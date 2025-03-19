from django.db import models


class Action(models.TextChoices):
    AUTHENTICATION = 'AUTHENTICATION', ('authentication')
