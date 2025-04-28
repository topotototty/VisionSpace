from django.contrib import admin
from conferences.models import Conference, Recording
from conferences.models import Event


@admin.register(Conference)
class ConferenceAdmin(admin.ModelAdmin):
    """Админка для конференций"""

    list_display = (
        'id',
        'title',
        'started_at',
        'status'
    )

    list_filter = (
        'title',
        'started_at',
        'status'
    )

    class Meta:
        model = Conference


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    """Админка для мероприятий"""
    list_display = (
        'id',
        'type',
        'creator',
    )

    list_filter = (
        'id',
        'type',
        'creator',
    )

    class Meta:
        model = Event

@admin.register(Recording)
class RecordingAdmin(admin.ModelAdmin):
    list_display = (
        'id', 
        'user', 
        'file_url', 
        'created_at'
    )
    search_fields = (
        'user__email',
        'file_url'
    )
    list_filter = ('created_at',)
    
    class Meta:
        model = Recording