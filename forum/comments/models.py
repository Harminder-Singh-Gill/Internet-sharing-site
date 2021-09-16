from django.db import models
from posts.models import Post
from accounts.models import User


class Comment(models.Model):
    poster = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='comments')
    upvoters = models.ManyToManyField(User, related_name='upvoted_comments')
    downvoters = models.ManyToManyField(User, related_name='downvoted_comments')
    savers = models.ManyToManyField(User, related_name='saved_comments')
    posted_date = models.DateTimeField(auto_now_add=True)
    last_edited_date = models.DateTimeField(auto_now=True)
    content = models.TextField()
    parent = models.ForeignKey('Comment', null=True, on_delete=models.CASCADE, related_name='replies')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')

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
    
    def __str__(self) -> str:
        return self.content
