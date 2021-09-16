from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

topic_router = DefaultRouter()
topic_router.register(r'topics', views.TopicViewSet)