import datetime

from django_filters.rest_framework import FilterSet
from django_filters import filters
from django.utils import timezone
from django.db.models import Q
from .models import Post

TIME_PERIODS = (
    ('day', 'day'),
    ('week', 'week'),
    ('month', 'month'),
    ('year', 'year'),
)

TIME_PERIODS_AS_DAYS = {
    'day': 1,
    'week': 7,
    'month': 31,
    'year': 365
}

class PostFilterSet(FilterSet):
    time_period = filters.ChoiceFilter(choices=TIME_PERIODS, method='filter_by_time_period')

    def filter_by_time_period(self, queryset, name, value):
        time_period_days_ago = TIME_PERIODS_AS_DAYS[value]
        time_period_date = timezone.now() - datetime.timedelta(days=time_period_days_ago)
        return queryset.filter(posted_date__gte=time_period_date)
    
    saved = filters.BooleanFilter(method='filter_by_user_relation')
    hidden = filters.BooleanFilter(method='filter_by_user_relation')
    upvoted = filters.BooleanFilter(method='filter_by_user_relation')
    downvoted = filters.BooleanFilter(method='filter_by_user_relation')
    followed = filters.BooleanFilter(method='filter_by_user_relation')

    def filter_by_user_relation(self, queryset, name, value):
        if not self.request or not self.request.user.is_authenticated: 
            return queryset
        
        if name == 'hidden': return queryset.filter(hiders = self.request.user)
        if name == 'saved': return queryset.filter(savers = self.request.user)
        if name == 'upvoted': return queryset.filter(upvoters = self.request.user)
        if name == 'downvoted': return queryset.filter(downvoters = self.request.user)
        if name == 'followed':
            return queryset.filter(Q(topic__followers = self.request.user) | Q(poster__followers = self.request.user, topic = None)).distinct()
        
        return queryset # This will never be returned

    poster = filters.CharFilter(field_name='poster__username')
    topic = filters.CharFilter(field_name='topic__name')

    class Meta:
        model= Post
        fields = []

