import datetime as dt
from uuid import uuid4

from django.db import models

from users.models import User
from logs.utils import Action


class Session(models.Model):
    id = models.UUIDField(
        primary_key=True,
        editable=False,
        default=uuid4,
        verbose_name="Invitation ID"
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    browser = models.TextField(
        verbose_name='User Agent'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=(dt.datetime.now() + dt.timedelta(days=365)))
    refresh_token = models.TextField(
        verbose_name='Refresh Token'
    )
    last_access = models.DateTimeField(default=dt.datetime.now())


class Log(models.Model):
    user = models.ForeignKey(
        User,
        null=True,
        on_delete=models.SET_NULL
    )
    action = models.CharField(
        choices=Action.choices,
        default='Nothing',
        verbose_name='User Action'
    )
    details = models.TextField(
        verbose_name='Action Details'
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
