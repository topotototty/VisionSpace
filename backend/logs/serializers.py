from rest_framework import serializers

from models import Session


class SessionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Session
        fields = (
            'user',
            'browser',
            'created_at',
            'expires_at',
            'refresh_token',
        )
        read_only_fields = '__all__'
