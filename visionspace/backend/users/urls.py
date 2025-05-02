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

    # Endpoints для профиля
    path("profile/", views.profile_view, name="profile"),
    path("profile/search/", views.profile_search_view, name="profile_search"),
    path("profile/<int:pk>/", views.profile_user_view, name="profile"),
    
    path("me/activities/", views.user_activity_view, name='user-activities'),
    path("profile/change-password/", views.change_password_view, name="change_password"),
    path("profile/reset-password/", views.reset_password_simple_view, name="reset-password"),
    
    path("recordings/", views.user_recordings_view, name="user_recordings"),
    # Endpoint для импорта юзеров из файла в БД
    path('import/file/', views.FileUploadView.as_view(), name='import from file'),
]
