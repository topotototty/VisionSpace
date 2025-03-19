from django.urls import include, path
from django.contrib import admin

from rest_framework.documentation import include_docs_urls  # type: ignore

# API-urls
api = [
    path('users/', include('users.urls')),
    path('conferences/', include('conferences.urls')),
    path('invitations/', include('invitations.urls')),
    # path('plugins/', include('plugins.urls')),
]

urlpatterns = [
    path('api/admin/', admin.site.urls),
    # path('api/docs/', include_docs_urls(title='Vision API')),
    path('api/v1/', include(api)),
]
