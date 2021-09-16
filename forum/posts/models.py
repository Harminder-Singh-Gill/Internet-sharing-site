from django.db import models
from accounts.models import User
from topics.models import Topic
from math import log10
from datetime import datetime

site_birth = datetime(2021, 3, 1)

class Post(models.Model):
    POST_TYPES = (('text', 'Text'), ('link', 'Link'), ('images', 'Images'))
    title = models.CharField(max_length=300)
    text = models.TextField(max_length=10000, blank=True)
    link = models.URLField(null=True, blank=True)
    poster = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    post_type = models.CharField(choices=POST_TYPES, max_length=6, default='Text')
    posted_date = models.DateTimeField(auto_now_add=True)
    last_edited_date = models.DateTimeField(auto_now = True)
    upvoters = models.ManyToManyField(User, related_name='upvoted_posts')
    downvoters = models.ManyToManyField(User, related_name='downvoted_posts')
    savers = models.ManyToManyField(User, related_name='saved_posts')
    hiders = models.ManyToManyField(User, related_name='hidden_posts')
    topic = models.ForeignKey(Topic, null=True, on_delete = models.RESTRICT)
    hot_rank = models.FloatField(null=True)

    @property
    def upvotes(self):
        return self.upvoters.count()
    
    @property
    def downvotes(self):
        return self.downvoters.count()
    
    @property
    def points(self):
        return self.upvotes - self.downvotes

    @property
    def favourability(self):
        if self.points == 0: return 50
        return (self.upvotes / self.points) * 100
    
    @property
    def comment_count(self):
        return self.comments.count()
    
    def calculate_hot_rank(self):
        points = self.points
        abs_points = abs(points)
        order = log10(max(abs_points, 1))
        sign = 0 if abs_points == 0 else (points / abs_points)
        seconds = self.posted_date.timestamp() - site_birth.timestamp()
        return round(sign * order + seconds / 45000, 7)
    
    def has_hidden(self, user):
        return self.hiders.filter(id=user.id).exists()

    def has_saved(self, user):
        return self.savers.filter(id=user.id).exists()

    def has_upvoted(self, user):
        return self.upvoters.filter(id=user.id).exists()
    
    def has_downvoted(self, user):
        return self.downvoters.filter(id=user.id).exists()
    
    def user_vote(self, user):
        if self.has_upvoted(user): return 'upvote'
        if self.has_downvoted(user): return 'downvote'
        return None

    def __str__(self):
        return self.title


def post_image_upload_url(post_image, filename):
    return f'postimages/{post_image.post.id}/{post_image.id}.jpg'

class PostImage(models.Model):
    image = models.ImageField(upload_to=post_image_upload_url)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="images")
    
    def __str__(self):
        return self.image.url
