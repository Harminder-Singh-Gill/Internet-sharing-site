from django.shortcuts import render, get_object_or_404
from django.db.models import Count
from rest_framework.filters import OrderingFilter

from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly, OR
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication

from django_filters.rest_framework import DjangoFilterBackend

from .models import Comment
from .serializers import CommentSerializer
from .filters import CommentFilter
from .paginators import CommentPageNumberPagination

class ContentViewSetMixin:
    permission_classes = (IsAuthenticatedOrReadOnly, )
    authentication_classes = (JWTAuthentication, )

    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        content_obj = get_object_or_404(self.queryset, pk=pk)
        vote = request.data.get('vote')
        
        if vote == 'upvote':
            if content_obj.has_upvoted(request.user):
                content_obj.upvoters.remove(request.user)
            else:
                if content_obj.has_downvoted(request.user):
                    content_obj.downvoters.remove(request.user)
                content_obj.upvoters.add(request.user)
        elif vote == 'downvote':
            if content_obj.has_downvoted(request.user):
                content_obj.downvoters.remove(request.user)
            else:
                if content_obj.has_upvoted(request.user):
                    content_obj.upvoters.remove(request.user)
                content_obj.downvoters.add(request.user)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(content_obj)

        return Response(serializer.data.get('point_stats'), status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def toggle_save(self, request, pk=None):
        content_obj = get_object_or_404(self.queryset, pk=pk)
        
        if content_obj.savers.filter(id=request.user.id).exists():
            content_obj.savers.remove(request.user)
            is_saved = False
        else:
            content_obj.savers.add(request.user)
            is_saved = True
        
        return Response({'is_saved': is_saved}, status=status.HTTP_200_OK)


class CommentViewSet(ContentViewSetMixin, ModelViewSet):
    queryset = Comment.objects.annotate(_points = Count('upvoters', distinct=True) - Count('downvoters', distinct=True))
    serializer_class = CommentSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filterset_class = CommentFilter
    pagination_class = CommentPageNumberPagination
    ordering_fields = ('posted_date', '_points')
    ordering = ('-posted_date', )
    