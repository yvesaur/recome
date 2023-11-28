from django.urls import path
from . import views

urlpatterns = [
    path('api/v1/getRecommendedNews/<str:id>', views.getRecommendedNews),
    path('api/v1/getTrendingNews', views.getTrendingNews),
]
