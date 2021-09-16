from categories.models import Category
from django.db import models
from accounts.models import User


def get_topic_icon_path(topic, filename):
    return f'topic_icons/{topic.id}.jpg'

def get_topic_banner_path(topic, filename):
    return f'topic_banner/{topic.id}.jpg'

class PostType(models.Model): #limited to Link, Image, and Text for now
    name = models.CharField(max_length=25)
    
    def __str__(self):
        return self.name

class Topic(models.Model):
    name = models.CharField(max_length=20, blank=True)
    creation_date = models.DateTimeField(auto_now_add=True, blank=True)
    followers = models.ManyToManyField(User, related_name='followed_topics', blank=True)
    creator = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='created_topics', blank=True)
    moderators = models.ManyToManyField(User, related_name='moderated_topics', blank=True)
    description = models.TextField(null=True, blank=True)
    title = models.CharField(blank=True, max_length = 100)
    icon = models.ImageField(null=True, blank=True, upload_to=get_topic_icon_path, default='default_topic_icon.jpg')
    post_message = models.TextField(blank=True)
    valid_post_types = models.ManyToManyField(PostType)
    banner = models.ImageField(blank=True, upload_to=get_topic_banner_path)
    category = models.ForeignKey(Category, null=True, on_delete=models.SET_NULL, related_name='topics', blank=True)
    ACCESS_TYPES = [
        ('+', 'public'),
        ('#', 'restricted'),
        ('-', 'private')
    ]
    access = models.CharField(max_length=10, choices=ACCESS_TYPES)

    @property
    def follower_count(self):
        return self.followers.count()
    
    def is_followed(self, user):
        return self.followers.filter(id=user.id).exists()
    
    def __str__(self):
        return self.name
    
class Rule(models.Model):
    no = models.PositiveIntegerField()
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='rules')

    def __str__(self):
        return f'{self.topic.name}: {self.no}. {self.title}'
    

class SidebarCard(models.Model):
    title = models.CharField(max_length=50)
    content = models.TextField()
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='sidebar_cards')

    def __str__(self):
        return self.title