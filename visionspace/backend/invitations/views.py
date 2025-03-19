from django.http import JsonResponse

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

from invitations.models import Invitation
from invitations.utils import InvitationStatus, generate_ics_file
from invitations.serializers import InvitationSerializer
from invitations.serializers import InvitationAcceptORDeclineSerializer
from invitations.serializers import InvitationCreateSerializer

from users.models import User

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
import io


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_invitation_view(request):
    """Эндпоинт для получения информации о приглашениях"""

    try:
        invitations = Invitation.objects.filter(
            participant=request.user
        )
        serializer = InvitationSerializer(invitations, many=True)
        return JsonResponse(
            serializer.data,
            safe=False,
            status=status.HTTP_200_OK
        )
    except Invitation.DoesNotExist:
        return JsonResponse(
            {'error': 'Invitation not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_invitation_view(request):
    """Эндпоинт для создания приглашения"""

    try:
        serializer = InvitationCreateSerializer(data=request.data)
        if serializer.is_valid():
            if (
                request.user != serializer.validated_data['conference'].creator
            ):
                return JsonResponse(
                    {
                        'error': 'You are not the owner of the conference'
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

            participant = User.objects.filter(
                email=serializer.validated_data['participant']
            ).first()

            if not participant:
                return JsonResponse(
                    {
                        'error': f'User with email {serializer.validated_data["participant"]} not found'
                    },
                    status=status.HTTP_404_NOT_FOUND
                )

            Invitation.objects.create(
                conference=serializer.validated_data['conference'],
                participant=participant
            )
            return JsonResponse(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        else:
            return JsonResponse(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
    except Exception as e:
        return JsonResponse(
            {
                'error': str(e),
                'details': 'Something went wrong'
            },
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_invitation_view(request):
    """Эндпоинт для принятия приглашения"""

    try:
        serializer = InvitationAcceptORDeclineSerializer(data=request.data)
        if serializer.is_valid():
            invitation = Invitation.objects.get(
                id=serializer.validated_data['id'],
                participant=request.user
            )
            if invitation:
                invitation.invitation_status = InvitationStatus.ACCEPTED
                invitation.save()
                return JsonResponse(
                    {
                        'message': f'Invitation {invitation.id} accepted'
                    },
                    status=status.HTTP_200_OK
                )
            else:
                return JsonResponse(
                    {
                        'error': 'You are not the participant of the conference'
                    },
                    status=status.HTTP_403_FORBIDDEN
                )
        else:
            return JsonResponse(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
    except Invitation.DoesNotExist:
        return JsonResponse(
            {
                'error': 'Invitation not found',
                'details': 'Invitation with this pk does not exist'
            },
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(e)
        return JsonResponse(
            {
                'error': "error",
                'details': str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def decline_invitation_view(request):
    """Эндпоинт для отклонения приглашения"""

    try:
        serializer = InvitationAcceptORDeclineSerializer(data=request.data)
        if serializer.is_valid():
            invitation = Invitation.objects.get(
                id=serializer.validated_data['id'],
                participant=request.user
            )
            if invitation:
                invitation.invitation_status = InvitationStatus.DECLINED
                invitation.save()
                return JsonResponse(
                    {
                        'message': 'Invitation declined'
                    },
                    status=status.HTTP_200_OK
                )
            else:
                return JsonResponse(
                    {
                        'error': 'You are not the participant of the conference'
                    },
                    status=status.HTTP_403_FORBIDDEN
                )
        else:
            return JsonResponse(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
    except Invitation.DoesNotExist:
        return JsonResponse(
            {
                'error': 'Invitation not found',
                'details': 'Invitation with this pk does not exist'
            },
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(e)
        return JsonResponse(
            {
                'error': "error",
                'details': str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
def send_mail_to_invited(request):
    participants = request.data['participants']
    email = EmailMultiAlternatives(
        'Новое событие',
        to=participants
    )
    ics_file = generate_ics_file('Тестовое имя события', '2024-12-11 23:00:00', '2024-12-12 00:00:00', 'Тестовое описание события: http://wakehub.ru', 'http://wakehub.ru')
    f = io.BytesIO(ics_file.encode('utf-8'))
    email.attach(filename='Тест.ics', content=f.getvalue(), mimetype='text/calendar')
    email_template = render_to_string('email.html')
    email.attach_alternative(email_template, 'text/html')
    email.send()
