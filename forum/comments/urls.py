from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

comment_router = DefaultRouter()
comment_router.register(r'comments', views.CommentViewSet)