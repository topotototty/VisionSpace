import datetime as dt
from django.utils import timezone
from rest_framework import serializers
from conferences.models import Conference, Event, Recording
from conferences.utils import ConferenceType
from invitations.models import Invitation
from users.models import User


class CreatorSerializer(serializers.ModelSerializer):
    """Сериализатор модели пользователей."""

    class Meta:
        model = User
        fields = ('id', 'firstname', 'lastname')


class ConferenceSerializer(serializers.ModelSerializer):
    """Стандартный сериализатор для конференций."""
    creator = CreatorSerializer(read_only=True, source='event.creator')
    type = serializers.CharField(source='event.type', read_only=True)
    participants = serializers.ListField(
        child=serializers.EmailField(),
        write_only=True,
        required=False
    ) # Список email'ов приглашённых пользователей

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if ret['description'] is None:
            ret.pop('description')
        return ret


    class Meta:
        model = Conference
        fields = [
            'id',
            'title',
            'duration',
            'description',
            'started_at',
            'status',
            'creator',
            'event',  # ID эвента
            'type',  # Тип эвента
            'participants',
            'link'
        ]
        read_only_fields = ['event']

    
    def create(self, validated_data):
        request = self.context['request']
        user = request.user if request else None

        if not user:
            raise serializers.ValidationError({'creator': 'Пользователь не аутентифицирован'})
        
        participants = validated_data.pop('participants', [])
        
        event = Event.objects.create(
            type=ConferenceType.SCHEDULED,
            creator=user
        )
        validated_data['event'] = event
        conference = super().create(validated_data)
        self.create_invitations(conference, participants)
        return conference
    

    def create_invitations(self, conference, participants):
        users = User.objects.filter(email__in=participants)
        invitations = [
            Invitation(conference=conference, participant=user)
            for user in users
        ]
        Invitation.objects.bulk_create(invitations)




class ScheduledConferenceCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания конференции."""

    started_at = serializers.DateTimeField(
        format="%Y-%m-%dT%H:%M:%S.%f"
    )
    duration = serializers.DurationField()
    participants = serializers.ListField(
        child=serializers.EmailField(),
        allow_empty=True,
        required=False
    )

    class Meta:
        model = Conference
        fields = [
            'title',
            'description',
            'started_at',
            'participants',
            'duration'
        ]


class ConferenceUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления конференции."""

    id = serializers.UUIDField(required=True)
    title = serializers.CharField(
        required=False
    )
    description = serializers.CharField(
        required=False
    )
    started_at = serializers.DateTimeField(
        format="%Y-%m-%dT%H:%M:%S.%f",
        required=False
    )
    duration = serializers.DurationField(
        required=False
    )

    class Meta:
        model = Conference
        fields = [
            'id',
            'title',
            'description',
            'started_at',
            'duration'
        ]


class ConferenceDeleteSerializer(serializers.ModelSerializer):
    """Сериализатор для удаления конференции."""

    id = serializers.UUIDField(required=True)

    class Meta:
        model = Conference
        fields = [
            'id'
        ]


class RepetitiveConferenceCreateSerializer(serializers.ModelSerializer):
    participants = serializers.ListField(child=serializers.EmailField(), min_length=1)  # приглашенных пользователей может не быть
    properties = serializers.DictField()
    time = serializers.DictField()
    creator = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Conference
        fields = (
            'title',
            'description',
            'participants',
            'time',
            'creator',
            'properties'
        )
        read_only_fields = ('properties',)

    def validate_time(self, value):
        if value['end'] < value['start']:
            raise serializers.ValidationError('Время окончания конференции не может быть меньше времени начала!')
        return value

    def create(self, validated_data):
        participants = validated_data.pop('participants')
        properties = validated_data.pop('properties')
        time = validated_data.pop('time')

        # создаем ивент
        event = Event.objects.create(type='REPETITIVE', creator=validated_data.pop('creator'))  # может все же сохранять интервал?

        # парсим переодичность повторения
        periodicity = properties.get('periodicity')

        # определяем пределы повторения
        limits = properties.get('limits')
        # определяем стартовую дату+время
        current_date = limits['start_date'] + 'T' + time['start']
        current_date = dt.datetime.strptime(current_date, '%Y-%m-%dT%H:%M:%S')
        current_date = current_date.replace(tzinfo=dt.UTC)  # ПЕРЕДЕЛАТЬ!!!
        # определяем конечную дату+время
        end_date = limits['end_date'] + 'T' + time['end']
        end_date = dt.datetime.strptime(end_date, '%Y-%m-%dT%H:%M:%S')
        end_date = end_date.replace(tzinfo=dt.UTC)
        # определяем продолжительность
        data = [int(x) for x in time['end'].split(sep=":")]
        end_time = current_date.replace(hour=data[0], minute=data[1], second=data[2])  # неподходящее название, кривая генерация времени!!!
        duration = (end_time - current_date)

        conferences = []

        if properties.get('interval') == 'daily':
            if periodicity > 0:
                while current_date <= end_date:
                    conferences.append(Conference(**validated_data, started_at=current_date, duration=duration, event=event))
                    current_date += dt.timedelta(days=periodicity)
            else:
                while current_date <= end_date:
                    if current_date.isoweekday() < 6:
                        conferences.append(Conference(**validated_data, started_at=current_date, duration=duration, event=event))
                    current_date += dt.timedelta(days=1)
        elif properties.get('interval') == 'weekly':
            while current_date <= end_date:
                conferences.append(Conference(**validated_data, started_at=current_date, duration=duration, event=event))
                current_date += dt.timedelta(weeks=periodicity)
        elif properties.get('interval') == 'monthly':
            while current_date <= end_date:
                conferences.append(Conference(**validated_data, started_at=current_date, duration=duration, event=event))
                if current_date.month + periodicity[1] <= 12:
                    current_date = current_date.replace(month=current_date.month+periodicity[1])
                else:
                    current_date = current_date.replace(year=current_date.year+1, month=(periodicity[1]-(12-current_date.month)))
                current_date = current_date.replace(day=periodicity[0])
        conferences = Conference.objects.bulk_create(conferences)
        return conferences

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)


class FastConferenceCreateSerializer(serializers.ModelSerializer):
    started_at = serializers.DateTimeField(default=timezone.now)
    creator = serializers.HiddenField(default=serializers.CurrentUserDefault())
    duration = serializers.DurationField(default=dt.timedelta(hours=1))
    description = serializers.CharField(default='')

    class Meta:
        model = Conference
        fields = (
            'title',
            'description',
            'started_at',
            'duration',
            'creator'
        )

    def create(self, validated_data):
        event = Event.objects.create(type='FAST', creator=validated_data.pop('creator'))

        conference = Conference.objects.create(**validated_data, event=event)
        return conference

class RecordingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recording
        fields = ['id', 'file_url', 'created_at']
