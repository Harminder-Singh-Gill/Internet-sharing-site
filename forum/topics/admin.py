from django.contrib import admin
from .models import Topic, Rule, SidebarCard, PostType

admin.site.register(Topic)
admin.site.register(Rule)
admin.site.register(SidebarCard)
admin.site.register(PostType)
