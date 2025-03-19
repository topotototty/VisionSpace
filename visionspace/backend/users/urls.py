from django.urls import path
from users import views

urlpatterns = [
    # Endpoints для basic authentication
    path("auth/providers/basic/login/", views.login_view,
         name="login"),
    path("auth/providers/basic/register/", views.register_view,
         name="register"),
    path("auth/providers/basic/logout/", views.logout_view,
         name="logout"),
    path("auth/token/", views.refresh_token_view,
         name="update token"),

#     # Endpoints для keycloak authentication
#     path("auth/providers/keycloak/login/", views.keycloak_login_view,
#          name="keycloak_login"),

    # Endpoints для профиля
    path("profile/", views.profile_view, name="profile"),
    path("profile/search/", views.profile_search_view, name="profile_search"),
    path("profile/<int:pk>/", views.profile_user_view, name="profile"),

    # Endpoint для импорта юзеров из файла в БД
    path('import/file/', views.FileUploadView.as_view(),
         name='import from file')
]
