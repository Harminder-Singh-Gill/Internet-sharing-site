"""forum URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from . import views
from comments.urls import comment_router
from topics.urls import topic_router
from accounts.urls import user_router

urlpatterns = [
    path('admin/', admin.site.urls),
    path('account/', include('accounts.urls')),
    path('post/', include('posts.urls')),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('search/', views.SearchResultsAPIView.as_view(), name='search'),
    path('category/', include('categories.urls')),
] 

urlpatterns += comment_router.urls
urlpatterns += topic_router.urls
urlpatterns += user_router.urls

# this method of serving uploaded media files is not suitable for production use
# Read more at https://docs.djangoproject.com/en/3.1/howto/static-files/#serving-static-files-during-development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)