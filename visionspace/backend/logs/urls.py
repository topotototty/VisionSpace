from django.urls import include, path
from rest_framework.routers import SimpleRouter
from views import UserSessionViewSet

router = SimpleRouter()

router.register('session', UserSessionViewSet, basename='session')

urlpatterns = [
    path('', include(router.urls)),
]
