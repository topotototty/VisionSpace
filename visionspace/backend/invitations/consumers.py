import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from invitations.models import Invitation
from invitations.serializers import InvitationSerializer


# Описываем обработчик websocket запросов к проекту
class InvitationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.group_name = f'{self.user.id}_group'

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

        # Оставляю на случай если решим, что пользователь должен видеть все свои приглашения, а не только актуальные
        invitations = await self.get_participant()
        if invitations:
            await self.send(
                text_data=json.dumps({'invitations': invitations}, ensure_ascii=False)
            )

    async def receive(self, text_data=None, bytes_data=None):
        return await super().receive(text_data, bytes_data)

    async def receive_json(self, content, **kwargs):
        return await super().receive_json(content, **kwargs)

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def send_invitation(self, event):
        serializer = InvitationSerializer(event['invitation'])
        # Этот вариант отправки приглашения логичнее, но в нем ломается кодировка описания конфы
        # await self.send_json(
        #     content={
        #         "invitation": serializer.data
        #     }
        # )
        await self.send(
            text_data=json.dumps(serializer.data, ensure_ascii=False)
        )

    @database_sync_to_async
    def get_participant(self):
        try:
            # return await sync_to_async(Invitation.objects.filter)(participant__email=self.scope['user'].email)
            invitations = Invitation.objects.filter(
                participant__email=self.scope['user'].email
            )
            return [InvitationSerializer(inv).data for inv in invitations]
            # не работает с filter, попробовать использовать sync_to_async
        except Invitation.DoesNotExist:
            return None
