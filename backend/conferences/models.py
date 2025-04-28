"""Модели конференции"""
from uuid import uuid4
from django.db import models
from users.models import User
from conferences.utils import ConferenceStatus, ConferenceType


class Event(models.Model):
    id = models.UUIDField(
        primary_key=True,
        editable=False,
        default=uuid4,
        verbose_name="Event ID"
    )
    type = models.CharField(
        max_length=50,
        choices=ConferenceType.choices,
        default=ConferenceType.SCHEDULED,
        verbose_name='Conference Type'
    )
    creator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="Conference Creator ID",
        related_name='events'  # Исправил related_name, чтобы было логично
    )

    def __str__(self):
        return f"{self.id} ({self.type})"

    class Meta:
        """Мета-класс модели ивента"""
        verbose_name = "Ивент"
        verbose_name_plural = "Ивенты"


class Conference(models.Model):
    """Модель конференции"""
    id = models.UUIDField(
        primary_key=True,
        editable=False,
        default=uuid4,
        verbose_name="Conference ID"
    )
    title = models.CharField(
        max_length=100,
        verbose_name="Conference Title"
    )
    description = models.TextField(
        null=True,
        blank=True,
        max_length=255,
        verbose_name="Conference Description"
    )
    duration = models.DurationField(
        verbose_name="Conference Duration",
        help_text="Format: HH:MM:SS",
        null=False,
        blank=False,
    )
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        verbose_name='Event ID',
        related_name='conferences',
    )
    
    started_at = models.DateTimeField(
        null=False,
        blank=False,
        verbose_name="Conference Starting Time"
    )
    status = models.CharField(
        max_length=20,
        choices=ConferenceStatus.choices,
        default=ConferenceStatus.CREATED,
        verbose_name='Conference Status'
    )
    link = models.URLField(
        null=True,
        blank=True,
        verbose_name="Conference Link"
    )

    REQUIRED_FIELDS = (
        'title',
        'description',
        'started_at',
        'status'
    )

    def __str__(self):
        return f"{self.title} ({self.status})"

    class Meta:
        """Мета-класс модели конференции"""
        verbose_name = "Конференция"
        verbose_name_plural = "Конференции"
        ordering = ('-started_at',)
        db_table = "conferences"


class Recording(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recordings')
    file_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Recording by {self.user.email} at {self.created_at}"
    
    class Meta:
        app_label = 'conferences'
        verbose_name = "Запись"
        verbose_name_plural = "Записи"
        db_table = "conferences_recording"
