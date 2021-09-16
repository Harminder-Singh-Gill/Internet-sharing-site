from django.contrib import admin
from .models import Post, PostImage

class PostImageAdmin(admin.TabularInline):
    model = PostImage

class PostAdmin(admin.ModelAdmin):
    inlines = (PostImageAdmin, )

admin.site.register(Post, PostAdmin)
