"""Serializers"""
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from users.serializers import UserSerializer


class TokenSerializer(TokenObtainPairSerializer):
    """Класс для сериализации токена с добавлением пользователя"""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user'] = UserSerializer(user).data
        return token
