from django.shortcuts import render, get_object_or_404, get_list_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import filters

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView

from .serializers import TopicSerializer
from .models import Topic

class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = (IsAuthenticatedOrReadOnly, )
    filter_backends = (filters.SearchFilter, DjangoFilterBackend)
    search_fields = ['name', 'title']
    filterset_fields = ('followers__username', 'name')
    lookup_field = 'name'
    lookup_url_kwarg = 'name'

    def get_queryset(self):
        limit = self.request.query_params.get('limit')
        if limit is not None:
            return Topic.objects.all()[:int(limit)]
        return Topic.objects.all()
    

    @action(detail=True, methods=['post'])
    def toggle_follow(self, request, name):
        topic = get_object_or_404(Topic, name=name)

        if topic.followers.filter(id=request.user.id).exists():
            topic.followers.remove(request.user)
            is_followed = False
        else:
            topic.followers.add(request.user)
            is_followed = True
        
        follower_data = {
            'is_followed': is_followed,
            'follower_count': topic.follower_count
        }
        return Response(follower_data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def follow_multiple(self, request):
        topic_names = request.data.get('topics')
        topics = get_list_or_404(Topic, name__in=topic_names)
        request.user.followed_topics.add(*topics)

        topic_serializer = TopicSerializer(topics, many=True, context={'request': request})
        return Response({'topics': topic_serializer.data}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def toggle_follow_multiple(self, request):
        topic_names = request.data.get('topics')
        topics = get_list_or_404(Topic, name__in=topic_names)

        for topic in topics:
            if topic.followers.filter(id=request.user.id).exists():
                topic.followers.remove(request.user)
            else:
                topic.followers.add(request.user)
        
        topic_serializer = TopicSerializer(topics, many=True, context={'request': request})
        return Response({'topics': topic_serializer.data}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def is_available(self, request):
        topic_name = request.query_params.get('topic_name')
        is_available = not Topic.objects.filter(name=topic_name).exists()
        return Response({'is_available': is_available}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def set_icon(self, request, name):
        topic = get_object_or_404(Topic, name=name)
        print(type(request.data.get('icon')))
        topic.icon = request.data.get('icon')
        topic.save()
        return Response(status=status.HTTP_200_OK)