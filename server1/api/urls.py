from django.urls import path
from . import views

urlpatterns = [
    path('api1/v1/getRecommendedNews/<str:id>', views.getRecommendedNews),
    path('api1/v1/getTrendingNews', views.getTrendingNews),
    path('api1/v1/getUserRecommendedNews/<str:id>', views.getUserRecommendedNews),
]
