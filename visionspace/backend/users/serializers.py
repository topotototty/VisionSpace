from rest_framework import serializers
from django.contrib.auth import get_user_model

UserModel = get_user_model()


class BaseUserSerializer(serializers.ModelSerializer):
    """Базовый сериализатор пользовательской модели."""

    class Meta:
        model = UserModel
        fields = (
            'firstname',
            'lastname',
            'email',
            'role',
            'last_login',
        )


class UserSerializer(BaseUserSerializer):
    """Сериализатор пользовательской модели."""

    class Meta(BaseUserSerializer.Meta):
        fields = BaseUserSerializer.Meta.fields + ('id',)


class UserCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания нового пользователя."""

    class Meta:
        model = UserModel
        fields = (
            'firstname',
            'lastname',
            'email',
            'password',
        )

    def create(self, validated_data):
        return UserModel.objects.create_user(**validated_data)


class UserLoginSerializer(serializers.Serializer):
    """Сериализатор для пользовательской модели, при стандартной
    авторизации."""

    email = serializers.CharField()  # email
    password = serializers.CharField()

    class Meta:
        model = UserModel
        fields = (
            'email',  # email
            'password',
        )


class KeycloakUserSerializer(BaseUserSerializer):
    """Сериализатор пользовательской модели Keycloak."""

    class Meta(BaseUserSerializer.Meta):
        fields = BaseUserSerializer.Meta.fields + ('id',)


class KeycloakLoginSerializer(serializers.Serializer):
    """Сериализатор для входа в приложение через Keycloak."""

    email = serializers.EmailField()
    password = serializers.CharField()


class KeycloakLogoutSerializer(serializers.Serializer):
    """Сериализатор для выхода из приложения,
    если пользователь входил через Keycloak."""

    refresh_token = serializers.CharField()
