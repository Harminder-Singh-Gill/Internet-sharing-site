from django.db import models
from django.contrib.auth.models import AbstractUser

def get_image_upload_path(user, filename):
    return f'profile_pics/{user.id}.jpg/'

class User(AbstractUser):
    profile_pic = models.ImageField(default='image.png', upload_to=get_image_upload_path)
    followers = models.ManyToManyField('User', related_name="followed_users")
    description = models.TextField(blank=True)

    @property
    def follower_count(self):
        return self.followers.all().count()
    
    def is_followed_by(self, user):
        return self.followers.filter(id=user.id).exists()