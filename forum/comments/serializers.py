from django.db.models import Count, F

from rest_framework import serializers
from .models import Comment
from accounts.serializers import MinimalUserSerializer

class ContentSerializerMixin:
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['point_stats'] = serializers.SerializerMethodField(method_name='get_point_stats')
        self.fields['is_saved'] = serializers.SerializerMethodField(method_name='get_is_saved')
        self.fields['vote'] = serializers.SerializerMethodField(method_name='get_vote')

    def get_is_saved(self, obj):
        return self.context['request'].user and obj.has_saved(self.context['request'].user)

    def get_vote(self, obj):
        return obj.user_vote(self.context['request'].user) if self.context['request'].user else None,

    def get_point_stats(self, obj):
        return {
            'points': obj.points,
            'upvotes': obj.upvotes,
            'downvotes': obj.downvotes,
            'favourability': obj.favourability,
            'vote': obj.user_vote(self.context['request'].user) if self.context['request'].user else None,
        }

class CommentSerializer(ContentSerializerMixin, serializers.ModelSerializer):
    replies = serializers.SerializerMethodField(method_name='get_replies')
    low_priority_replies = serializers.SerializerMethodField(method_name='get_low_priority_replies')
    post = serializers.PrimaryKeyRelatedField(read_only=True)
    parent = serializers.PrimaryKeyRelatedField(read_only=True)
    poster = MinimalUserSerializer(read_only=True)

    def get_replies(self, obj):
        replies = obj.replies.annotate(_points = Count('upvoters') - Count('downvoters')).exclude(_points__lte=1).order_by('-_points')
        serializer = CommentSerializer(replies, many=True, context=self.context)
        return serializer.data
    
    def get_low_priority_replies(self, obj):
        ids = obj.replies.annotate(points = Count('upvoters') - Count('downvoters')).filter(points__lte=1).values_list('pk', flat=True)
        return list(ids)
    
    def create(self, validated_data):
        comment = Comment()
        comment.poster = self.context['request'].user
        comment.content = validated_data.get('content')
        comment.post_id = self.context['request'].data.get('postId')
        comment.parent_id = self.context['request'].data.get('parentId')
        comment.save()
        comment.upvoters.add(self.context['request'].user)
        return comment

    class Meta:
        model = Comment
        fields = ('id', 'content', 'posted_date', 'parent', 'post', 'points', 'upvotes', 'downvotes', 'favourability', 
        'poster', 'last_edited_date', 'replies', 'low_priority_replies')