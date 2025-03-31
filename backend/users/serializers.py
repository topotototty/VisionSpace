from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import User, UserActivity

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

class UserUpdateRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['role']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'firstname',
            'lastname',
            'email',
            'role',
            'last_login',
            'created_at',
            'updated_at',
        )


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

class UserActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivity
        fields = ('action', 'timestamp')
