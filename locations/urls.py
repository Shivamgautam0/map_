from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'locations', views.LocationViewSet)
router.register(r'categories', views.LocationCategoryViewSet)

urlpatterns = [
    # This is the correct way to include router URLs
    path('', include(router.urls)),
    path('geojson/', views.GeoJSONView.as_view(), name='geojson'),
    path('statistics/', views.StatisticsView.as_view(), name='statistics'),
]