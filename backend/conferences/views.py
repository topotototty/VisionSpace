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

import os
import subprocess
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Recording
from .serializers import RecordingSerializer
from django.core.files.storage import default_storage

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
    
import os
import subprocess
import logging
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status, permissions

from storages.backends.s3boto3 import S3Boto3Storage
from conferences.models import Recording

logger = logging.getLogger(__name__)

class UploadRecordingView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            return Response({"error": "Файл не найден."}, status=status.HTTP_400_BAD_REQUEST)

        # Временная папка
        temp_dir = os.path.join(settings.BASE_DIR, 'tmp')
        os.makedirs(temp_dir, exist_ok=True)

        base_name = os.path.splitext(uploaded_file.name)[0]
        temp_webm_path = os.path.join(temp_dir, f"{base_name}.webm")
        temp_mp4_path = os.path.join(temp_dir, f"{base_name}.mp4")

        try:
            with open(temp_webm_path, 'wb+') as f:
                for chunk in uploaded_file.chunks():
                    f.write(chunk)

            ffmpeg_command = [
                'ffmpeg',
                '-i', temp_webm_path,
                '-c:v', 'libx264',
                '-preset', 'veryfast',
                '-crf', '28',
                '-c:a', 'aac',
                temp_mp4_path
            ]
            result = subprocess.run(ffmpeg_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

            if result.returncode != 0:
                logger.error(f"Ошибка ffmpeg: {result.stderr.decode()}")
                return Response({"error": "Ошибка конвертации видео."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            s3_storage = S3Boto3Storage()
            final_filename = f"recordings/{base_name}.mp4"
            with open(temp_mp4_path, 'rb') as mp4_file:
                s3_storage.save(final_filename, mp4_file)

            file_url = s3_storage.url(final_filename)

            Recording.objects.create(
                user=request.user,
                file_url=file_url
            )

            return Response({"file_url": file_url}, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.exception("Ошибка при загрузке записи")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        finally:
            # 6. Убираем временные файлы всегда, даже если ошибка
            for path in [temp_webm_path, temp_mp4_path]:
                if os.path.exists(path):
                    try:
                        os.remove(path)
                    except Exception as cleanup_error:
                        logger.warning(f"Не удалось удалить {path}: {cleanup_error}")
