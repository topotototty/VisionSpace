from uuid import uuid4

from django.db import models

from conferences.models import Conference
from invitations.utils import InvitationStatus
from users.models import User
from users.utils import UserRole


class Invitation(models.Model):
    """Модель приглашений"""
    id = models.UUIDField(
        primary_key=True,
        editable=False,
        default=uuid4,
        verbose_name="Invitation ID"
    )
    conference = models.ForeignKey(Conference, on_delete=models.CASCADE)
    participant = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='invitations'
    )
    participant_role = models.CharField(
        choices=UserRole.choices,
        default=UserRole.MEMBER
    )
    invitation_status = models.CharField(
        choices=InvitationStatus.choices,
        default=InvitationStatus.PENDING
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Invitation Created At"
    )

    def to_dict(self):
        return dict(
            id=self.id,
            conference=self.conference,
            participant=self.participant,
            participant_role=self.participant_role,
            invitation_status=self.invitation_status,
            created_at=self.created_at
        )

    def __str__(self) -> str:
        return f'Пользователь {self.participant.email} приглашен на конференцию {self.conference.title}'

    class Meta:
        """Мета-класс приглашений"""
        verbose_name = "Пришлашение"
        verbose_name_plural = "Приглашения"
        ordering = ["-created_at"]
        db_table = "invitations"
