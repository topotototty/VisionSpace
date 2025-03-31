from django.urls import path
from invitations import views

urlpatterns = [
    # Endpoints для получения приглашений
    path("", views.get_invitation_view, name="get invitations"),

    # Endpoints для управления приглашениями
    path("create/", views.create_invitation_view, name="create invitation"),
    path("accept/", views.accept_invitation_view, name="accept invitation"),
    path("decline/", views.decline_invitation_view, name="decline invitation"),
    path('send_email/', views.send_mail_to_invited, name='send_email')
]
