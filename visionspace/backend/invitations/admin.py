from django.contrib import admin
from invitations.models import Invitation


@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    """Админка для приглашений"""

    list_display = (
        'id',
        'conference',
        'participant',
        'participant_role',
        'invitation_status',
        'created_at',
    )
    list_filter = (
        'conference',
        'participant',
        'created_at',
        'invitation_status',
    )
    list_editable = (
        'invitation_status',
    )

    class Meta:
        model = Invitation
