from uuid import uuid4

from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.contrib.auth.models import (AbstractBaseUser,
                                        BaseUserManager,
                                        PermissionsMixin)
from django.db import models

from vision import settings

from .utils import UserRole


class UserManager(BaseUserManager):
    """Менеджер для модели пользователя"""

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        # Хеширование пароля
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        return self._create_user(email, password, **extra_fields)

    def create_if_not_exists(self, email, password=None, **extra_fields):
        # Для всех пользователей, у которых не задан пароль, создается одинаковый пароль
        try:
            validate_email(email)
        except ValidationError:
            return
        if email and not User.objects.filter(email=email):
            return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', UserRole.MODERATOR)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Кастомная пользовательская модель"""

    id = models.UUIDField(
        primary_key=True,
        editable=False,
        default=uuid4,
        verbose_name="User ID"
    )
    firstname = models.CharField(
        max_length=100,
        verbose_name="Имя",
        null=False,
        blank=False
    )
    lastname = models.CharField(
        max_length=100,
        verbose_name="Фамилия",
        null=False,
        blank=False
    )
    email = models.EmailField(
        verbose_name="Почта пользователя",
        unique=True,
    )
    last_login = models.DateTimeField(
        blank=True,
        null=True,
        auto_now=True,
        verbose_name="Последний вход",
    )
    role = models.CharField(
        choices=UserRole.choices,
        default=UserRole.MEMBER,
        verbose_name='Роль пользователя')
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата создания"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Дата обновления"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Активен"
    )

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ('firstname', 'lastname', 'password')

    @property
    def is_member(self):
        return self.role == UserRole.MEMBER

    @property
    def is_moderator(self):
        return self.role == UserRole.MODERATOR

    @property
    def is_tech_support(self):
        return self.role == UserRole.TECH_SUPPORT

    @property
    def is_staff(self):
        """Возвращает True, если пользователь имеет права администратора (например, роль модератора или техподдержки)."""
        return self.is_superuser or self.role in (UserRole.MODERATOR, UserRole.TECH_SUPPORT)

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        abstract = False
        ordering = ('firstname', 'lastname')
        db_table = "users"

    def __str__(self) -> str:
        return f"{self.firstname} {self.lastname}"


class UserActivity(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='activities',
        verbose_name="Пользователь"
    )
    action = models.CharField(max_length=255, verbose_name="Действие")
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Время")

    class Meta:
        ordering = ['-timestamp']
        verbose_name = "Активность пользователя"
        verbose_name_plural = "Активности пользователей"

    def __str__(self):
        return f"{self.user.email} — {self.action} [{self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}]"

    @staticmethod
    def log_activity(user, action: str):
        if user and user.is_authenticated:
            UserActivity.objects.create(user=user, action=action)

            # Удаляем старые, если больше 100
            user_activities = UserActivity.objects.filter(user=user).order_by('-timestamp')
            if user_activities.count() > 100:
                to_delete = user_activities[100:]
                UserActivity.objects.filter(id__in=[a.id for a in to_delete]).delete()