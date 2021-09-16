from rest_framework import serializers
from accounts.serializers import MinimalUserSerializer
from .nested_serializers import TopicMinimalSerializer, RuleSerializer
from .models import Topic, PostType
from categories.models import Category
from django.shortcuts import get_object_or_404

class TopicSerializer(TopicMinimalSerializer):
    moderators = MinimalUserSerializer(many=True, read_only=True)
    valid_post_types = serializers.StringRelatedField(many=True)
    rules = RuleSerializer(many=True, read_only=True)

    def create(self, validated_data):
        if self.context['request'].data.get('category') == '': category = None
        else: category = get_object_or_404(Category, name=self.context['request'].data.get('category'))
        
        topic = Topic.objects.create(
            name=validated_data.get('name'),
            description=validated_data.get('description'),
            access=self.context['request'].data.get('access'),
            category=category)

        topic.valid_post_types.add(*PostType.objects.all())
        topic.moderators.add(self.context['request'].user)
        return topic
    
    class Meta(TopicMinimalSerializer.Meta):
        fields = TopicMinimalSerializer.Meta.fields + ('description','moderators', 'creation_date', 'rules', 
        'sidebar_cards', 'post_message', 'valid_post_types', 'banner', 'title')
