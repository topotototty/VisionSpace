from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken


class WebSocketMiddleware(BaseMiddleware):

    async def __call__(self, scope, receive, send):
        headers = dict(scope['headers'])
        scope['user'] = None

        if b'authorization' in headers:
            token_name, token = headers[b'authorization'].decode().split()
            if token_name == 'Bearer':
                user = await self.get_user(token)
                scope['user'] = user

        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user(self, token):
        from users.models import User
        data = AccessToken(token)

        return User.objects.get(id=data['user_id'])
