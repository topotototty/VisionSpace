from django.urls import path, include
from conferences import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'', views.ConferenceViewSet, basename='conference')

urlpatterns = [
    # Создание быстрой конференции
    path('fast/', views.FastConferenceAPIView.as_view()),

    # Для создания повторяющейся конференции
    path('repetitive/', views.RepetitiveConferenceCreateAPIView.as_view()),

    # Для просмотра списка конференций по общему id, удаления, изменения повторяющейся конференции
    path('repetitive/<uuid:event_id>/', views.RepetitiveConferenceAPIView.as_view()),

    # Endpoints для управления статусом конференциями
    path('status/<uuid:id>/<str:status>/', views.ConferenceChangeStatusView.as_view()),

    # Endpoints для просмотра информации о конференции
    path('id/<uuid:id>/', views.ConferenceDetailAPIView.as_view()),

    # Endpoints для получения информации о конференциях и создания новых
    path('', include(router.urls)),
]
