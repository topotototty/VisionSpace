from django.apps import AppConfig


class InvitationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'invitations'
    verbose_name = 'Приглашения'

    def ready(self):
        import invitations.signals  # noqa
        return super().ready()
