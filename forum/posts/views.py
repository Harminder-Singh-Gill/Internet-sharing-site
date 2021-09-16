from datetime import timedelta
from heapq import merge
import requests
from bs4 import BeautifulSoup

from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.db.models import Count

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter

from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters.rest_framework import DjangoFilterBackend

from .models import Post
from .serializers import PostSerializer
from .utils import get_title, get_description, get_image_url
from .filters import PostFilterSet
from .paginators import PostPageNumberPagination
from topics.serializers import TopicSerializer
from accounts.serializers import UserSerializer
from comments.serializers import CommentSerializer
from comments.models import Comment

class PostViewSet(ModelViewSet):
    # queryset = Post.objects.annotate(points=Count('upvoters') - Count('downvoters'))
    serializer_class = PostSerializer
    authentication_classes = (JWTAuthentication, )
    permission_classes = (IsAuthenticatedOrReadOnly, )
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filterset_class = PostFilterSet
    pagination_class = PostPageNumberPagination
    ordering_fields = ('-hot_rank', 'posted_date', '_points')
    ordering = ('-hot_rank', )
    
    def get_queryset(self):
        queryset = Post.objects.annotate(_points=Count('upvoters', distinct=True) - Count('downvoters', distinct=True))
        
        if self.request.user.is_authenticated:
            if not self.are_requested_posts_private():
                queryset = queryset.exclude(hiders=self.request.user)
        
        return queryset
    
    # is the user asking for private posts
    def are_requested_posts_private(self):
        private_post_types = {'hidden', 'saved', 'upvoted', 'downvoted'}
        return private_post_types & self.request.query_params.keys()

    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        post = get_object_or_404(Post, pk=pk)
        vote = request.data.get('vote')
        
        if vote == 'upvote':
            if post.has_upvoted(request.user):
                post.upvoters.remove(request.user)
            else:
                if post.has_downvoted(request.user):
                    post.downvoters.remove(request.user)
                post.upvoters.add(request.user)
        elif vote == 'downvote':
            if post.has_downvoted(request.user):
                post.downvoters.remove(request.user)
            else:
                if post.has_upvoted(request.user):
                    post.upvoters.remove(request.user)
                post.downvoters.add(request.user)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        post.hot_rank = post.calculate_hot_rank()
        post.save()

        serializer = self.get_serializer(post)

        return Response(serializer.data.get('point_stats'), status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def toggle_save(self, request, pk=None):
        post = get_object_or_404(Post, pk=pk)
        
        if post.savers.filter(id=request.user.id).exists():
            post.savers.remove(request.user)
            is_saved = False
        else:
            post.savers.add(request.user)
            is_saved = True
        
        return Response({'is_saved': is_saved}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def toggle_hide(self, request, pk=None):
        post = get_object_or_404(Post, pk=pk)
        
        if post.hiders.filter(id=request.user.id).exists():
            post.hiders.remove(request.user)
            is_hidden = False
        else:
            post.hiders.add(request.user)
            is_hidden = True
        
        return Response({'is_hidden': is_hidden}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def post_topic(self, request, pk=None):
        post = get_object_or_404(Post, pk = pk)
        
        post_serializer = PostSerializer(post, context = {'request': request})
        post_topic_data = {'post': post_serializer.data}

        if post.topic: 
            topic_serializer = TopicSerializer(post.topic, context = {'request': request})
            post_topic_data['topic'] = topic_serializer.data
        else:
            user_serializer = UserSerializer(post.poster, context = {'request': request})
            post_topic_data['user'] = user_serializer.data


        return Response(post_topic_data, status=status.HTTP_200_OK)

class LinkPreviewDataView(APIView):
    
    def get(self, request):
            url = request.query_params.get('url')
            source = requests.get(url).text
            soup = BeautifulSoup(source, 'lxml')
            description = get_description(soup)

            link_preview_data = {
                'description': [description if description != 'Forbidden' else ''],
                'title': get_title(soup),
                'image_url': get_image_url(soup)
            }
            return Response(link_preview_data, status=status.HTTP_200_OK)

class PostCommentListView(APIView):
    def get(self, request):

        page_size = 10 # based on rest framework setting PAGE_SIZE
        page_no = int(request.query_params.get('page', 1))
        start_index = page_size*(page_no-1)

        if start_index < 0 or start_index > 999:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        if start_index + 10 <= 999:
            next_page = request.get_full_path().replace(f'page={page_no}', f'page={page_no + 1}')
        else: 
            next_page = None

        if start_index - 10 >= 0:
            prev_page = request.get_full_path().replace(f'page={page_no}', f'page={page_no - 1}')
        else:
            prev_page = None
        
        posts = Post.objects.all()
        comments = Comment.objects.all()
        
        poster = self.request.query_params.get('poster')
        
        if poster:
            posts = posts.filter(poster__username = poster)
            comments = comments.filter(poster__username = poster)
        
        time_period = self.request.query_params.get('time_period')
        
        posts = self.filter_by_time_period(time_period, posts)
        comments = self.filter_by_time_period(time_period, comments)
        
        posts = self.filter_by_user_relation(posts)
        comments = self.filter_by_user_relation(comments)
        
        count = posts.count() + comments.count()
        
        if start_index > count:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        if start_index + 10 <= count:
            next_page = request.get_full_path().replace(f'page={page_no}', '') + f'page={page_no + 1}'
        else: 
            next_page = None
        
        content_list = self.get_content_list(posts, comments)
        
        response_data = {
            'count': count,
            'next': next_page,
            'prev': prev_page,
            'results': content_list[start_index : start_index+page_size]
        }
        return Response(response_data, status=status.HTTP_200_OK)
    
    def get_content_list(self, posts, comments):
        ordering = self.request.query_params.get('ordering')
        if ordering == '-_points':
            return self.get_sorted_list(posts, comments, '_points', reverse=True)
        if ordering == 'posted_date':
            return self.get_sorted_list(posts, comments, 'posted_date')
        
        return self.get_sorted_list(posts, comments, 'posted_date', reverse=True)
    
    def get_sorted_list(self, posts, comments, order_by, reverse=False):
        query_order_by = f'-{order_by}' if reverse else order_by
        order_key = order_by if order_by != '_points' else 'points'

        if order_by == '_points':
            posts = posts.annotate(_points = Count('upvoters', distinct=True) - Count('downvoters', distinct=True))
            comments = comments.annotate(_points = Count('upvoters', distinct=True) - Count('downvoters', distinct=True))
        
        posts = posts.order_by(query_order_by)[:1000]
        comments = comments.order_by(query_order_by)[:1000]
        
        post_serializer = PostSerializer(posts, many=True, context = {'request' :self.request})
        comment_serializer = CommentSerializer(comments, many=True, context = {'request' : self.request})
        
        post_dataset = post_serializer.data
        comment_dataset = comment_serializer.data
        
        return list(merge(post_dataset, comment_dataset, key= lambda content: content[order_key], reverse=reverse))

    def filter_by_user_relation(self, queryset):
        if not self.request or not self.request.user.is_authenticated: 
            return queryset

        if 'saved' in self.request.query_params.keys(): 
            return queryset.filter(savers = self.request.user)
        if 'upvoted' in self.request.query_params.keys(): 
            return queryset.filter(upvoters = self.request.user)
        if 'downvoted' in self.request.query_params.keys(): 
            return queryset.filter(downvoters = self.request.user)
        
        return queryset

    def filter_by_time_period(self, time_period, queryset):
        if not time_period: return queryset
        
        TIME_PERIODS_AS_DAYS = {
            'day': 1,
            'week': 7,
            'month': 31,
            'year': 365
        }

        if time_period not in TIME_PERIODS_AS_DAYS.keys():
            return queryset
        
        time_period_days_ago = TIME_PERIODS_AS_DAYS[time_period]
        time_period_date = timezone.now() - timedelta(days=time_period_days_ago)
        return queryset.filter(posted_date__gte=time_period_date)