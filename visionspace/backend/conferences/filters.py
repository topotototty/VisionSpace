import django_filters
from django.db.models import Q
from conferences.models import Conference


class ConferenceFilter(django_filters.FilterSet):

    creator = django_filters.CharFilter(
        field_name="event__creator__lastname",
        lookup_expr="icontains"
    )
    type = django_filters.CharFilter(
        field_name="event__type",
        lookup_expr="iexact"
    )
    search = django_filters.CharFilter(
        method="filter_search"
    )


    class Meta:
        model = Conference
        fields = ['creator', 'type']


    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(id__icontains=value) |
            Q(title__icontains=value) |
            Q(description__icontains=value) |
            Q(event__creator__id__icontains=value) | 
            Q(event__creator__firstname__icontains=value) |
            Q(event__creator__lastname__icontains=value) |
            Q(event__creator__email__icontains=value)
        )