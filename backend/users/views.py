from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
from django.http import JsonResponse

from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from users.serializers import UserActivitySerializer, UserSerializer, UserLoginSerializer, UserCreateSerializer
from users.models import User, UserActivity
from users.utils import json_reader, xml_reader, txt_reader
from conferences.models import Recording
from conferences.serializers import RecordingSerializer
from rest_framework import permissions


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = UserLoginSerializer(data=request.data)

    if serializer.is_valid():
        user = authenticate(request=request, **serializer.validated_data)

        if user is not None:
            login(request, user)
            UserActivity.log_activity(user, "Вход в профиль")

            tokens = RefreshToken.for_user(user)
            tokens['user'] = UserSerializer(user).data

            return JsonResponse({
                'tokens': {
                    'access': str(tokens.access_token),
                    'refresh': str(tokens)
                },
                'user': tokens['user']
            }, status=status.HTTP_200_OK)

        return JsonResponse({
            'error': 'Invalid credentials',
            'details': 'Invalid email or password'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    try:
        email = request.data.get('email')
        password = request.data.get('password')

        if User.objects.filter(email=email).exists():
            return JsonResponse({'email': 'Почта уже зарегистрирована'}, status=status.HTTP_400_BAD_REQUEST)

        if len(password) < 8:
            return JsonResponse({'password': 'Пароль слишком простой'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            UserActivity.log_activity(user, "Регистрация")

            # Генерация токенов
            tokens = RefreshToken.for_user(user)
            access_token = str(tokens.access_token)
            refresh_token = str(tokens)

            data = {
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': access_token,
                    'refresh': refresh_token
                },
                'message': 'User created and authenticated successfully'
            }
            return JsonResponse(data, status=status.HTTP_201_CREATED)

        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    UserActivity.log_activity(request.user, "Выход из профиля")  # добавлено
    logout(request)
    return JsonResponse({'message': 'User logged out successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    try:
        return JsonResponse({'user': UserSerializer(request.user).data}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return JsonResponse({
            'error': 'Authentication error',
            'details': 'User is not authenticated'
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_user_view(request, pk):
    try:
        user = User.objects.get(pk=pk)
        return JsonResponse({'user': UserSerializer(user).data}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return JsonResponse({
            'error': 'User not found',
            'details': 'User with this pk does not exist'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_search_view(request):
    try:
        query = request.GET.get('q', '').strip()

        if len(query) <= 2:
            return JsonResponse({
                'error': 'Invalid query',
                'details': 'Query must be at least 3 characters long'
            }, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(
            Q(firstname__icontains=query) |
            Q(lastname__icontains=query) |
            Q(email__icontains=query)
        ).exclude(pk=request.user.pk)

        serializer = UserSerializer(users, many=True)
        return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)

    except Exception as e:
        return JsonResponse({'error': 'Invalid query', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    refresh_token = request.data.get('refresh')

    if not refresh_token:
        return JsonResponse({
            "error": "Refresh Token is required",
            "detaild": "Refresh Token is required",
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        tokens = RefreshToken(refresh_token)
        new_access_token = str(tokens.access_token)
        return JsonResponse({"access": new_access_token}, status=status.HTTP_200_OK)
    except Exception as ex:
        return JsonResponse({
            "error": "Refresh Token invalid",
            "detaild": str(ex),
        }, status=status.HTTP_400_BAD_REQUEST)


class FileUploadView(APIView):
    parser_classes = (MultiPartParser, )

    def post(self, request, format=None):
        if 'file' not in request.FILES:
            return JsonResponse({"error": "No file was provided"}, status=status.HTTP_400_BAD_REQUEST)

        file_obj = request.FILES['file']
        sep = request.headers.get('Sep', '')
        content_type = file_obj.content_type
        content_file = file_obj.read()

        parsers = {
            'application/json': json_reader,
            'application/xml': xml_reader,
            'text/xml': xml_reader,
            'text/plain': lambda content: txt_reader(content, sep),
            'text/markdown': lambda content: txt_reader(content, sep)
        }

        if content_type not in parsers:
            return JsonResponse({"error": "File type not supported yet"}, status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)

        data = parsers[content_type](content_file)

        for user in data[:10]:
            full_user_name = user['Name'].split()
            email = user['EmailAddress']
            password = user.get('password')
            lastname = full_user_name[0]
            firstname = full_user_name[1]
            User.objects.create_if_not_exists(
                firstname=firstname,
                lastname=lastname,
                email=email,
                password=password
            )

        return JsonResponse({"data": data}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_activity_view(request):
    try:
        paginator = PageNumberPagination()
        paginator.page_size = int(request.GET.get('page_size', 10))
        queryset = UserActivity.objects.filter(user=request.user).order_by('-timestamp')

        page = paginator.paginate_queryset(queryset, request)
        serializer = UserActivitySerializer(page, many=True)

        return paginator.get_paginated_response(serializer.data)

    except Exception as e:
        return Response({
            'error': 'Ошибка при получении активности',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    user = request.user
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    if not old_password or not new_password:
        return JsonResponse(
            {"error": "Оба поля обязательны"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not user.check_password(old_password):
        return JsonResponse(
            {"error": "Неверный текущий пароль"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(new_password) < 8:
        return JsonResponse(
            {"error": "Новый пароль слишком короткий (минимум 8 символов)"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.set_password(new_password)
    user.save()

    # Логирование действия
    from users.models import UserActivity
    UserActivity.log_activity(user, "Сменил пароль")

    return JsonResponse({"message": "Пароль успешно изменён"}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_simple_view(request):
    email = request.data.get("email")
    lastname = request.data.get("lastname")
    new_password = request.data.get("new_password")

    if not email or not lastname or not new_password:
        return JsonResponse({"error": "Все поля обязательны"}, status=400)

    try:
        user = User.objects.get(email=email, lastname__iexact=lastname)
    except User.DoesNotExist:
        return JsonResponse({"error": "Пользователь не найден"}, status=404)

    if len(new_password) < 8:
        return JsonResponse({"error": "Пароль слишком короткий (минимум 8 символов)"}, status=400)

    user.set_password(new_password)
    user.save()
    UserActivity.log_activity(user, "Восстановил пароль (через фамилию и email)")

    return JsonResponse({"message": "Пароль успешно изменён"}, status=200)


from rest_framework import generics

class UserRecordingsListAPIView(generics.ListAPIView):
    serializer_class = RecordingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Recording.objects.filter(user=self.request.user).order_by('-created_at')