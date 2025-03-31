from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
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

# Раздача статики в dev-режиме (если DEBUG=True)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

