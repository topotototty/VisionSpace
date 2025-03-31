from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated

from models import Session
from permissions import SessionPermission
from serializers import SessionSerializer


class RetriveDeleteViewSet(
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    pass


class UserSessionViewSet(RetriveDeleteViewSet):
    serializer_class = SessionSerializer
    permission_classes = [IsAuthenticated, SessionPermission]

    def get_queryset(self):
        new_queryset = Session.objects.filter(user=self.request.user)
        return new_queryset
