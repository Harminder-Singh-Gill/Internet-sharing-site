from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponseBadRequest

from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import User
from .serializers import UserSerializer, CustomTokenObtainPairSerializer, MinimalUserSerializer

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'
    lookup_field_kwarg = 'username'

    @action(detail=True, methods=['post'])
    def toggle_follow(self, request, username):
        user = get_object_or_404(User, username=username)

        if user.followers.filter(id=request.user.id).exists():
            user.followers.remove(request.user)
            is_followed = False
        else:
            user.followers.add(request.user)
            is_followed = True
        
        follower_data = {
            'is_followed': is_followed,
            'follower_count': user.follower_count
        }
        return Response(follower_data, status=status.HTTP_200_OK)


class RegisterUserView(APIView):
    permission_classes = (AllowAny, )

    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.save()
            json = serializer.data
            return Response(json, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BlackListTokenView(APIView):
    permission_classes = (AllowAny, )

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            res_status = status.HTTP_200_OK
        except Exception as e:
            res_status = status.HTTP_400_BAD_REQUEST
        
        return Response (status=res_status)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

def username_available_view(request):
    if request.method == 'GET':
        username = request.GET.get('username')
        is_username_available = not (User.objects.filter(username=username).exists())
        
        return JsonResponse({'is_username_available': is_username_available}, status=200)
    
    return HttpResponseBadRequest()

class GetLoggedInUserView(APIView):
    permission_classes = (IsAuthenticated, )
    authentication_classes = (JWTAuthentication, )

    def get(self, request):
        user_data = {
            'id': request.user.id,
            'profile_pic': 'http://localhost:8000' + request.user.profile_pic.url,
            'username': request.user.username
        }
        return Response(user_data, status= status.HTTP_200_OK)