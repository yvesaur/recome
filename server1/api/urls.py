from django.urls import path
from . import views

urlpatterns = [
    path('api/v1/getNewsData', views.getNewsData),
    path('api/v1/getBehavioursData', views.getBehavioursData),
]
