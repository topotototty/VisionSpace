from django.contrib.auth.admin import UserAdmin
from django.contrib import admin
from users.models import User, UserActivity


class UserAdminManager(UserAdmin):
    """Админка для модели User, для управления пользователями"""
    model = User

    # Поля, отображаемые в списке пользователей
    list_display = [
        'email',
        'firstname',
        'lastname',
        'role',
        'is_superuser',
    ]

    # Поля, используемые для поиска
    search_fields = [
        'email',
        'firstname',
        'lastname',
    ]

    # Порядок сортировки пользователей
    ordering = ['email']

    # Поля, видимые в форме редактирования пользователя
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Персональная информация', {'fields': ('firstname', 'lastname')}),
        ('Права', {'fields': ('is_active', 'is_superuser', 'role')}),
        ('Даты', {'fields': ('last_login', 'created_at', 'updated_at')}),
    )

    # Поля, используемые при создании нового пользователя
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'firstname', 'lastname', 'password1', 'password2', 'role'),
        }),
    )

    # Поля, которые нельзя редактировать вручную
    readonly_fields = ('last_login', 'created_at', 'updated_at')

    # Фильтры для списка пользователей
    list_filter = (
        'is_superuser',
        'role',
    )


admin.site.register(User, UserAdminManager)

@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ("user", "action", "timestamp")
    search_fields = ("user__email", "action")
    list_filter = ("timestamp",)
    ordering = ("-timestamp",)