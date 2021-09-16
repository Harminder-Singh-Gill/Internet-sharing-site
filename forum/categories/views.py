from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Category


class CategoryListView(APIView):
    def get(self, request):
        return Response(Category.objects.values_list('name', flat=True), status=status.HTTP_200_OK)
