from django.urls import path

from .consumers import InvitationConsumer

#  Создаем маршрутизатор для обработки websocket запросов к проекту
websocket_urlpatterns = [
    path('invitations/', InvitationConsumer.as_asgi())
]
