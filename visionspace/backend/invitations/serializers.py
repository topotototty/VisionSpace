from rest_framework import serializers
from invitations.models import Invitation
from conferences.serializers import ConferenceSerializer
from users.serializers import UserSerializer


class InvitationSerializer(serializers.ModelSerializer):
    """Стандартный сериализатор приглашения."""
    id = serializers.UUIDField(required=True)
    conference = ConferenceSerializer()
    participant = UserSerializer()

    class Meta:
        model = Invitation
        fields = [
            'id',
            'conference',
            'participant',
            'created_at',
            'invitation_status',
        ]
        ordering = ('created_at',)


class InvitationCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания приглашения."""

    participant = serializers.CharField()

    class Meta:
        model = Invitation
        fields = [
            'conference',
            'participant'
        ]


class InvitationAcceptORDeclineSerializer(serializers.ModelSerializer):
    """Сериализатор для принятия/отклонения приглашения."""
    id = serializers.UUIDField(required=True)

    class Meta:
        model = Invitation
        fields = [
            'id'
        ]
