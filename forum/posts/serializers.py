from . import utils
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from .models import Post
from comments.serializers import CommentSerializer
from topics.nested_serializers import TopicBaseSerializer
from topics.models import Topic
from accounts.serializers import MinimalUserSerializer

class PostSerializer(serializers.ModelSerializer):
    poster = MinimalUserSerializer(read_only=True)
    images = serializers.StringRelatedField(many=True, read_only=True)
    point_stats = serializers.SerializerMethodField(method_name='get_point_stats')
    is_saved = serializers.SerializerMethodField(method_name='get_is_saved')
    is_hidden = serializers.SerializerMethodField(method_name='get_is_hidden')
    topic = TopicBaseSerializer(read_only=True)
    vote = serializers.SerializerMethodField(method_name='get_vote')

    def get_vote(self, post):
        return post.user_vote(self.context['request'].user) if self.context['request'].user else None

    def get_is_saved(self, obj):
        return self.context['request'].user and obj.has_saved(self.context['request'].user)

    def get_is_hidden(self, obj):
        return self.context['request'].user and obj.has_hidden(self.context['request'].user)

    def get_point_stats(self, obj):
        return {
            'points': obj.points,
            'upvotes': obj.upvotes,
            'downvotes': obj.downvotes,
            'favourability': obj.favourability,
            'vote': obj.user_vote(self.context['request'].user) if self.context['request'].user else None,
        }

    def create(self, validated_data):
        post = Post()
        post.title = validated_data.get('title')
        post.post_type = validated_data.get('post_type')
        
        topic_name = self.context['request'].data.get('topic_name')
        if topic_name: post.topic = get_object_or_404(Topic, name=topic_name)

        post.poster = self.context['request'].user
        content = utils.get_post_content(post.post_type, self.context['request'].data)
        utils.set_post_content(post, content)
        
        post.save()
        post.hot_rank = post.calculate_hot_rank()
        
        post.save()
        post.upvoters.add(self.context['request'].user)
        
        
        return post

    class Meta:
        model = Post
        fields = ('id', 'post_type', 'title', 'images', 'text', 'link', 'poster', 'posted_date', 
        'last_edited_date', 'point_stats', 'is_saved', 'is_hidden', 'comment_count', 'topic', 
        'points', 'upvotes', 'downvotes', 'favourability', 'vote')