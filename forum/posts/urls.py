from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'posts', views.PostViewSet, basename='post')

urlpatterns = [
    # path('create/', views.CreatePostView.as_view(), name='create-post'),
    path('', include(router.urls)),
    path('link-preview/', views.LinkPreviewDataView.as_view(), name='post-link-preview'),
    path('content-list/', views.PostCommentListView.as_view(), name='content-list'),
]