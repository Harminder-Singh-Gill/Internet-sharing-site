from django.db.models import Count
from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from topics.models import Topic
from topics.nested_serializers import TopicBaseSerializer
from accounts.models import User
from accounts.serializers import MinimalUserSerializer

def home_view(request):
    render(request, 'forum/home.html')

class SearchResultsAPIView(APIView):
    def get(self, request):
        search_query = request.query_params.get('search');
        
        if not search_query:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        results = {}

        if request.query_params.get('topic'):
            topics = Topic.objects.filter(name__icontains=search_query)
            topics = topics.annotate(_follower_count = Count('followers')).order_by('-_follower_count')
            results['topics'] = TopicBaseSerializer(topics, many=True, context = {'request': request}).data
        
        if request.query_params.get('user'):
            users = User.objects.filter(username__icontains=search_query)
            users = users.annotate(_follower_count = Count('followers')).order_by('-_follower_count')
            results['users'] = MinimalUserSerializer(users, many=True, context = {'request': request}).data
    
        return Response(results, status=status.HTTP_200_OK)


