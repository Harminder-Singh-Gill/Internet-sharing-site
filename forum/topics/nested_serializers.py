from rest_framework import serializers
from .models import Topic, Rule

class RuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rule
        fields = ('id', 'no', 'title', 'description')

class TopicBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ('name', 'icon')
    
class TopicMinimalSerializer(TopicBaseSerializer):
    is_followed = serializers.SerializerMethodField(method_name='get_is_followed')

    def get_is_followed(self, topic):
        return self.context['request'].user and topic.is_followed(self.context['request'].user)

    class Meta(TopicBaseSerializer.Meta):
        fields = TopicBaseSerializer.Meta.fields + ('follower_count', 'is_followed')