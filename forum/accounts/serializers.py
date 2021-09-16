from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from topics.nested_serializers import TopicMinimalSerializer
from .models import User

class UserSerializer(serializers.ModelSerializer):
    is_followed = serializers.SerializerMethodField(method_name='get_is_followed')
    moderated_topics = TopicMinimalSerializer(many=True, read_only=True)

    def get_is_followed(self, user):
        return self.context['request'].user and user.is_followed_by(self.context['request'].user)
    
    class Meta:
        model = User
        fields = ('username', 'password', 'profile_pic', 'follower_count', 'is_followed', 'description', 'date_joined', 'moderated_topics')
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = self.Meta.model(**validated_data)
        
        if password is not None:
            user.set_password(password)
        
        user.save()
        return user

class MinimalUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'profile_pic')

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['profile_pic'] = 'http://localhost:8000' + user.profile_pic.url
        
        return token