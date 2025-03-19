from channels.layers import get_channel_layer
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Invitation


@receiver(post_save, sender=Invitation)
async def get_notification(sender, instance: Invitation, created, **kwargs):
    if created:
        participant_id = instance.participant.id
        content = instance.to_dict()
        channel_layer = get_channel_layer()
        await channel_layer.group_send(
            f'{participant_id}_group',
            {'type': 'send.invitation',
             'invitation': content}
            )
