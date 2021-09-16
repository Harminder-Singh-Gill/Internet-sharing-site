import django_filters
from .models import Comment
from django_filters import filters

class CommentFilter(django_filters.FilterSet):
    poster = filters.CharFilter(field_name="poster__username")
    topic = filters.CharFilter(field_name="post__topic__name")
    only_top_level = filters.BooleanFilter(method='filter_only_top_level')
    post = filters.NumberFilter(field_name="post__id")
    
    def filter_only_top_level(self, queryset, name, value):
        if value: return queryset.filter(parent=None)
        return queryset

    class Meta:
        model = Comment
        fields = {'id': ('exact', 'in')}