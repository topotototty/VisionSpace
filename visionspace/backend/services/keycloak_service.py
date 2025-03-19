"""
Keycloak Service
для получения данных из Keycloak
"""

from django.conf import settings
from keycloak import KeycloakOpenID
from keycloak.exceptions import KeycloakGetError
from keycloak.exceptions import KeycloakAuthenticationError


# Инициализация OpenID
KEYCLOAK_OPENID = KeycloakOpenID(
    server_url=settings.KC_SERVER,
    client_id=settings.KC_CLIENT_ID,
    realm_name=settings.KC_REALM,
    client_secret_key=settings.KC_CLIENT_SECRET,
    verify=False
)


def get_token(
    auth_code: str,
    redirect_uri: str
):
    """Получает токен для Keycloak"""
    
    try:
        return KEYCLOAK_OPENID.token(
            grant_type='authorization_code',
            code=auth_code,
            redirect_uri=redirect_uri
        )
    except KeycloakAuthenticationError as e:
        raise e


def get_userinfo(token: str) -> dict:
    """Получает информацию о пользователе из токена"""

    try:
        return KEYCLOAK_OPENID.decode_token(token)
    except KeycloakGetError as e:
        print(e)
        raise e