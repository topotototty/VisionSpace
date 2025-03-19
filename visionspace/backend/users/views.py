from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout
from django.db.models import Q
from django.http import JsonResponse

from keycloak.exceptions import KeycloakAuthenticationError
from keycloak.exceptions import KeycloakGetError

from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from users.serializers import UserSerializer
from users.serializers import UserLoginSerializer
from users.serializers import UserCreateSerializer
from users.serializers import KeycloakUserSerializer
from users.serializers import KeycloakLoginSerializer
from users.models import User

from services.keycloak_service import KEYCLOAK_OPENID as KC
from services.keycloak_service import get_userinfo
from users.utils import json_reader, xml_reader, txt_reader


# Basic Auth
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Эндпоинт для стандартной авторизации пользователя."""

    serializer = UserLoginSerializer(data=request.data)

    if serializer.is_valid():
        user = authenticate(
            request=request,
            **serializer.validated_data
        )

        if user is not None:
            login(request, user)

            tokens = RefreshToken.for_user(user)
            tokens['user'] = UserSerializer(user).data

            return JsonResponse(
                {
                    'tokens': {
                        'access': str(tokens.access_token),
                        'refresh': str(tokens)
                    },
                    'user': tokens['user']
                },
                status=status.HTTP_200_OK
            )

        return JsonResponse(
            {
                'error': 'Invalid credentials',
                'details': 'Invalid email or password'
            },
            status=status.HTTP_401_UNAUTHORIZED
        )
    else:
        return JsonResponse(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Эндпоинт для регистрации пользователя."""
    try:
        email = request.data.get('email')
        password = request.data.get('password')

        # Проверяем, существует ли такой email
        if User.objects.filter(email=email).exists():
            return JsonResponse({'email': 'Почта уже зарегистрирована'}, status=status.HTTP_400_BAD_REQUEST)

        # Проверяем сложность пароля (например, минимум 8 символов)
        if len(password) < 8:
            return JsonResponse({'password': 'Пароль слишком простой'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            data = {
                'user': UserSerializer(user).data,
                'message': 'User created successfully'
            }
            return JsonResponse(data=data, status=status.HTTP_201_CREATED)

        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Эндпоинт для выхода пользователя из системы авторизации"""
    logout(request)
    return JsonResponse(
        {
            'message': 'User logged out successfully'
        },
        status=status.HTTP_200_OK
    )


# # KeyCloak endpoints
# @api_view(['POST'])
# @permission_classes([AllowAny])
# def keycloak_login_view(request):
#     """Эндпоинт для авторизации пользователя с помощью KeyCloak."""

#     serializer = KeycloakLoginSerializer(data=request.data)

#     if serializer.is_valid():
#         try:
#             kc_token = KC.token(
#                 username=serializer.validated_data['email'],
#                 password=serializer.validated_data['password'],
#             )
#         except KeycloakAuthenticationError as e:
#             return JsonResponse(
#                 {
#                     'error': 'Authentication error',
#                     'details': str(e)
#                 },
#                 status=status.HTTP_401_UNAUTHORIZED
#             )

#         try:
#             user = get_userinfo(kc_token['access_token'])
#         except KeycloakGetError as e:
#             return JsonResponse(
#                 {
#                     'error': 'Keycloak error',
#                     'details': str(e)
#                 },
#                 status=status.HTTP_401_UNAUTHORIZED
#             )
#         # Получение данных
#         user_name = user['preferred_username']
#         if "@" in user_name:
#             user_name = user_name.split("@")[0]

#         if (len(user['given_name'].split()) >= 1):
#             user_fi = user['given_name'].split()
#             new_user, _ = User.objects.get_or_create(
#                 firstname=user_fi[0],
#                 lastname=user_fi[1],
#                 email=user['email'],
#                 password=''
#             )
#         else:
#             new_user, _ = User.objects.get_or_create(
#                 firstname=user['given_name'],
#                 lastname=user['family_name'],
#                 email=user['email'],
#                 password=''
#             )

#         login(request, new_user)

#         tokens = RefreshToken.for_user(new_user)
#         tokens['user'] = KeycloakUserSerializer(new_user).data
#         print(tokens['user'])
#         return JsonResponse(
#             {
#                 'tokens': {
#                     'access': str(tokens.access_token),
#                     'refresh': str(tokens)
#                 },
#                 'user': tokens['user']
#             },
#             status=status.HTTP_200_OK
#         )
#     else:
#         return JsonResponse(
#             serializer.errors,
#             status=status.HTTP_400_BAD_REQUEST
#         )


# Эндпоинты профиля
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """Эндпоинт для получения информации
    о авторизованном в системе пользователе."""

    try:
        return JsonResponse(
            {
                'user': UserSerializer(request.user).data
            },
            status=status.HTTP_200_OK
        )
    except User.DoesNotExist:
        return JsonResponse(
            {
                'error': 'Authentication error',
                'details': 'User is not authenticated'
            },
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_user_view(request, pk):
    """Эндпоинт для получения информации
    о пользователе с заданным идентификатором."""

    try:
        user = User.objects.get(pk=pk)
        return JsonResponse(
            {
                'user': UserSerializer(user).data
            },
            status=status.HTTP_200_OK
        )
    except User.DoesNotExist:
        return JsonResponse(
            {
                'error': 'User not found',
                'details': 'User with this pk does not exist'
            },
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_search_view(request):
    """Эндпоинт для поиска пользователя по имени, фамилии, логину и почте."""

    try:
        query = request.GET.get('q').capitalize()

        if len(query) <= 2 or query.isspace():
            return JsonResponse({
                'error': 'Invalid query',
                'details': 'Query must be at least 3 characters long'
            }, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(
            Q(firstname__icontains=query) |
            Q(lastname__icontains=query) |
            Q(email__icontains=query)
        )

        # Убрать из списка себя
        users = users.exclude(pk=request.user.pk)

        if users is None:
            return JsonResponse({}, status=status.HTTP_200_OK)

        serializer = UserSerializer(users, many=True)

        return JsonResponse(
            serializer.data,
            safe=False,
            status=status.HTTP_200_OK
        )

    except Exception as e:
        return JsonResponse({
                'error': 'Invalid query',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


# Custom view for update
@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    """
        Эндпоинт, который обновляет токены
    """

    refresh_token = request.data.get('refresh')

    if not refresh_token:
        return JsonResponse(
            {
                "error": "Refresh Token is required",
                "detaild": "Refresh Token is required",
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        tokens = RefreshToken(refresh_token)
        new_access_token = str(tokens.access_token)

        return JsonResponse(
            {
                "access": new_access_token
            },
            status=status.HTTP_200_OK
        )
    except Exception as ex:
        return JsonResponse(
            {
                "error": "Refresh Token is required",
                "detaild": str(ex),
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class FileUploadView(APIView):
    parser_classes = (MultiPartParser, )

    def post(self, request, format=None):

        if 'file' not in request.FILES:
            return JsonResponse(
                {"error": "No file was provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        file_obj = request.FILES['file']
        sep = request.headers.get('Sep', '')

        content_type = file_obj.content_type
        content_file = file_obj.read()

        parsers = {
            # json
            'application/json': json_reader,

            # xml
            'application/xml': xml_reader,
            'text/xml': xml_reader,

            # txt files
            'text/plain': lambda content: txt_reader(content, sep),
            'text/markdown': lambda content: txt_reader(content, sep)
        }

        if content_type not in parsers:
            return JsonResponse(
                {
                    "error": "File type not supported yet",
                },
                status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE
            )

        # json data
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

        # Process the file here
        return JsonResponse(
            {"data": data},
            status=status.HTTP_200_OK
        )
