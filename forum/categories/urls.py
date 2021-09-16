from . import views
from django.urls import path

urlpatterns = [
    path('list/', views.CategoryListView.as_view(), name="category-list"),
]
