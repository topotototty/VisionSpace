from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from time import mktime
from jwt import encode


class JitsiService:
    """Jitsi Service для создания JWT токенов входа
    в конференцию Jitsi"""

    def __init__(self)->None:
        """Инициализирует конфигурацию и полезную информацию 
        для создания токена"""

        self.config = {
            "algorithm": settings.JITSI_ALG,
            "key": settings.JITSI_SECRET,
            "headers": {
                'kid': 'jitsi/api-factory.ru',
                'typ': 'JWT',
                'alg': settings.JITSI_ALG
            }
        }

        self.payload = {
            "aud": settings.JITSI_AUD,
            "iss": settings.JITSI_ISS,
            "sub": settings.JITSI_SUB,
            "room": settings.JITSI_ROOM,
            "context": {}
        }


    def _get_iat(self)->int:
        """Возвращает время создания токена в секундах"""
        return int(
            mktime(
                timezone.datetime.now().timetuple()
            )
        )


    def _get_nbf(self)->int:
        """Возвращает время начала действия токена в секундах"""
        return int(
            mktime(
                (
                    timezone.datetime.now() - 
                    timedelta(
                        seconds=4
                    )
                ).timetuple()
            )
        )


    def _get_exp(self)->int:
        """Возвращает время окончания действия токена в секундах"""
        return int(
            mktime(
                (
                    timezone.datetime.now() + 
                    timedelta(
                        hours=settings.JITSI_EXP_DURATION
                    )
                ).timetuple()
            )
        )
    

    def _get_payload(self, userdata: dict)->dict:
        """Возвращает полезную информацию для создания токена
        в формате словаря"""

        payload = self.payload

        """
        It definitely is up to how you interpret the time.
        So you issue a JWT with:
        iat set to now
        nbf set to tomorrow 12:00pm
        exp set to tomorrow 1:00pm 
        """

        # payload['iat'] = self._get_iat()
        # payload['nbf'] = self._get_nbf()
        payload['exp'] = self._get_exp()
        payload['context']['user'] = userdata

        return payload


    def create_token(self, userdata: dict)->str:
        """Создает JWT токен в формате строки"""
        
        try:
            token = encode(
                payload=self._get_payload(userdata),
                key=self.config['key'],
                algorithm=self.config['algorithm'],
                headers=self.config['headers']
            )
            return token
        except Exception as e:
            raise e
