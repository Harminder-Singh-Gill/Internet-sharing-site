from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

user_router = DefaultRouter()
user_router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterUserView.as_view(), name='register_user'),
    path('username/available/',views.username_available_view, name='username-available'),
    path('logout/blacklist/', views.BlackListTokenView.as_view(), name='blacklist'),
    path('authenticated/user/', views.GetLoggedInUserView.as_view(), name='authenticated-user'),
]