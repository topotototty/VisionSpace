from django.db import models
from datetime import datetime


class ConferenceType(models.TextChoices):
    """Типы конференции."""

    FAST = 'FAST', ('fast')
    SCHEDULED = 'SCHEDULED', ('scheduled')
    REPETITIVE = 'REPETITIVE', ('repetitive')


class ConferenceStatus(models.TextChoices):
    """Статусы конференции.
    Всего 4:
    - created: создана
    - started: запущена
    - finished: завершена
    - сanceled: отменена
    """

    CREATED = 'CREATED', ('Created')
    STARTED = 'STARTED', ('Started')
    FINISHED = 'FINISHED', ('Finished')
    CANCELED = 'CANCELED', ('Canceled')


class InvitationStatus(models.TextChoices):
    """Статусы приглашения.
    Всего 3:
    - pending: ожидает подтверждения
    - accepted: подтверждено
    - declined: отклонено
    """

    PENDING = 'PENDING', ('Pending')
    ACCEPTED = 'ACCEPTED', ('Accepted')
    DECLINED = 'DECLINED', ('Declined')


def generate_ics_file(event_name, start_time, end_time, description, link):
    """
    Генерирует содержимое ICS-файла для события.
    """
    # Преобразуем строки в datetime, если требуется
    if isinstance(start_time, str):
        start_time = datetime.strptime(start_time, '%Y-%m-%d %H:%M:%S')
    if isinstance(end_time, str):
        end_time = datetime.strptime(end_time, '%Y-%m-%d %H:%M:%S')

    ics_template = f"""
BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:{event_name}
DTSTART:{start_time.strftime('%Y%m%dT%H%M%S')}
DTEND:{end_time.strftime('%Y%m%dT%H%M%S')}
DESCRIPTION:{description}
URL:{link}
LOCATION:Онлайн
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Напоминание о событии
END:VALARM
END:VEVENT
END:VCALENDAR
"""
    return ics_template
