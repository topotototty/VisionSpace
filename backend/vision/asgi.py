"""
ASGI config for vision project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vision.settings')
django_asgi_app = get_asgi_application()

from websocket.middleware import WebSocketMiddleware
from invitations.routing import websocket_urlpatterns

# Здесь джанго проверяет тип соединения:
# при http и websocket запросах используются
# разные интерфейсы
application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': WebSocketMiddleware(
        URLRouter(websocket_urlpatterns)
    )
})
