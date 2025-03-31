from django.urls import path
from plugins import views

urlpatterns = [
    path("outlook/", views.generate_manifest, name="generate_manifest"),
]
