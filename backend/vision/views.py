from rest_framework_simplejwt.tokens import RefreshToken
from users.serializers import UserSerializer


def get_tokens_for_user(user):
    """Функция, которая возвращает токены для пользователя."""
    refresh = RefreshToken.for_user(user)
    refresh["user"] = UserSerializer(user).data
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }
