from django.db.models import Q
from django.http import JsonResponse
from django.conf import settings
from django.shortcuts import get_object_or_404

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView

from conferences.models import Conference, Event
from conferences.serializers import (ConferenceSerializer,
                                    FastConferenceCreateSerializer,
                                    RepetitiveConferenceCreateSerializer)
from conferences.utils import ConferenceStatus
# from conferences.email_invitations import send_mail_to_invited

from users.models import User, UserActivity
from users.serializers import UserSerializer
from invitations.models import Invitation
from invitations.utils import InvitationStatus
from services.jitsi_service import JitsiService

# Новое
from conferences.filters import ConferenceFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework import viewsets, status as status_codes


# Объект для работы с JitsiService
JTS = JitsiService()


class ConferenceViewSet(viewsets.ModelViewSet):
    """ViewSet для управления конференциями"""

    serializer_class = ConferenceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = ConferenceFilter
    ordering_fields = ['started_at', 'title']
    ordering = ['-started_at']
    lookup_field = "id"
    queryset = Conference.objects.all()

    def get_queryset(self):
        invitations = Invitation.objects.filter(
            participant=self.request.user,
            invitation_status=InvitationStatus.ACCEPTED
        )
        return Conference.objects.filter(
            Q(id__in=invitations.values_list("conference_id", flat=True)) |
            Q(event__creator=self.request.user)
        )
    

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def perform_create(self, serializer):
        conference = serializer.save()
        UserActivity.log_activity(self.request.user, f"Создал планируемую конференцию: {conference.title}")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        UserActivity.log_activity(request.user, f"Удалил конференцию: {instance.title}")
        return super().destroy(request, *args, **kwargs)

    

class ConferenceChangeStatusView(APIView):
    """APIView для изменения статуса конференции
    POST - изменение статуса конференции"""

    permission_classes = [IsAuthenticated]

    def post(self, request, id, status):
        """Метод для изменения статуса конференции"""

        try:
            conference = Conference.objects.filter(
                id=id,
                event__creator=request.user
            ).first()

            if not conference:
                return JsonResponse(
                    {
                        'error': 'Конференция не найдена или вы не являетесь её создателем'
                    },
                    status=status_codes.HTTP_403_FORBIDDEN
                )

            if status not in [ConferenceStatus.STARTED,
                                ConferenceStatus.FINISHED,
                                ConferenceStatus.CANCELED]:
                return JsonResponse(
                    {'error': 'Неверный статус конференции'},
                    status=status_codes.HTTP_400_BAD_REQUEST
                )

            conference.status = status
            conference.save()

            return JsonResponse(
                {
                    'id': conference.id,
                    'status': conference.status
                },
                status=status_codes.HTTP_200_OK
            )
        except Exception as e:
            return JsonResponse(
                {
                    'error': str(e),
                    'details': 'Something went wrong'
                },
                status=status_codes.HTTP_400_BAD_REQUEST
            )


class ConferenceDetailAPIView(APIView):
    """APIView для получения информации о конференции и
    подключения к ней, посредством генерации токенов Jitsi

    GET - получение информации о конференции (доступна информация о участниках)
    POST - получение информации о конференции c токенами Jitsi"""

    permission_classes = [AllowAny]

    def get(self, request, id):
        try:
            conference = Conference.objects.get(id=id)

            # Получить всех участников конференции, где обязательно в статусе ACCEPTED
            invitations = Invitation.objects.filter(
                conference=conference,
                invitation_status=InvitationStatus.ACCEPTED
            )

            participans = User.objects.filter(
                id__in=invitations.values_list('participant', flat=True)
            )

            return JsonResponse(
                {
                    "conference": ConferenceSerializer(conference).data,
                    "participants": UserSerializer(participans, many=True).data
                },
                status=status_codes.HTTP_200_OK
            )
        except Conference.DoesNotExist:
            return JsonResponse(
                {
                    'error': 'Conference not found',
                    'details': 'Conference with this id does not exist'
                },
                status=status_codes.HTTP_404_NOT_FOUND
            )


    def post(self, request, id):
        try:
            conference = Conference.objects.get(id=id)

            # Получаем пользовательский ник
            username = request.data.get('username')

            if not username:
                username = settings.ANONYMOUS_USERNAME


            if conference.status in [ConferenceStatus.FINISHED,
                                     ConferenceStatus.CANCELED,
                                     ConferenceStatus.CREATED]:
                return JsonResponse(
                    {
                        "conference": ConferenceSerializer(conference).data
                    },
                    status=status_codes.HTTP_200_OK
                )

            userdata = {
                "name": username,
                "email": settings.ANONYMOUS_EMAIL,
                "affiliation": settings.ANONYMOUS_AFFILIATION
            }

            if request.user.is_authenticated:
                userdata = {
                    "name": f"{request.user.firstname} {request.user.lastname}",
                    "email": request.user.email,
                    "affiliation": "owner" if conference.event.creator == request.user else "member"
                }

            return JsonResponse(
                {
                    "conference": ConferenceSerializer(conference).data,
                    "token": JTS.create_token(userdata)
                },
                status=status_codes.HTTP_200_OK
            )
        except Conference.DoesNotExist:
            return JsonResponse(
                {
                    'error': 'Conference not found',
                    'details': 'Conference with this id does not exist'
                },
                status=status_codes.HTTP_404_NOT_FOUND
            )


class RepetitiveConferenceCreateAPIView(APIView):

    def post(self, request):
        serializer = RepetitiveConferenceCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            conferences = serializer.save()
            UserActivity.log_activity(request.user, f"Создание повторяющейся конференции {len(conferences)}")
            return JsonResponse(
                ConferenceSerializer(conferences, many=True).data,
                safe=False,
                status=status_codes.HTTP_201_CREATED
            )
        return JsonResponse(
            serializer.errors,
            status=status_codes.HTTP_400_BAD_REQUEST
        )


class RepetitiveConferenceAPIView(APIView):

    def get(self, request, event_id):
        # необходима фильтрация по принятым приглашениям или авторству
        # или только по авторству?
        # invitations = Invitation.objects.filter(
        #         participant=request.user,
        #         invitation_status=InvitationStatus.ACCEPTED
        #     )

        conferences = Conference.objects.filter(event_id=event_id)
        serializer = ConferenceSerializer(conferences, many=True)
        return JsonResponse(
            serializer.data,
            safe=False,
            status=status_codes.HTTP_200_OK
        )


    def delete(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)
        event.delete()
        return JsonResponse(
            data={'detail': 'Conferences successfully deleted'},
            status=status_codes.HTTP_200_OK
        )


class FastConferenceAPIView(APIView):

    def post(self, request):
        serializer = FastConferenceCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            conference = serializer.save()
            UserActivity.log_activity(request.user, f"Создание быстрой конференции: {conference.title}")
            return JsonResponse(
                ConferenceSerializer(conference).data,
                status=status_codes.HTTP_201_CREATED
            )
        return JsonResponse(
            serializer.errors,
            status=status_codes.HTTP_400_BAD_REQUEST
        )
