# locations/views.py

from django.db.models import Count
from django.shortcuts import render
from rest_framework import viewsets, views
from rest_framework.response import Response
from .models import Location, LocationCategory
from .serializers import LocationSerializer, LocationCategorySerializer, GeoJSONLocationSerializer

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class LocationCategoryViewSet(viewsets.ModelViewSet):
    queryset = LocationCategory.objects.all()
    serializer_class = LocationCategorySerializer

class GeoJSONView(views.APIView):
    """Returns locations in GeoJSON format"""
    
    def get(self, request, format=None):
        locations = Location.objects.all()
        features = GeoJSONLocationSerializer(locations, many=True).data
        
        return Response({
            "type": "FeatureCollection",
            "features": features
        })

class StatisticsView(views.APIView):
    """Returns basic statistics about locations"""
    
    def get(self, request, format=None):
        total_locations = Location.objects.count()
        total_categories = LocationCategory.objects.count()
        
        # Get most common category
        category_counts = LocationCategory.objects.annotate(
            location_count=Count('locations')
        ).order_by('-location_count')
        
        most_common_category = None
        if category_counts.exists():
            most_common = category_counts.first()
            most_common_category = {
                'name': most_common.name,
                'count': most_common.location_count
            }
        
        # Get latest added locations
        latest_locations = Location.objects.order_by('-created_at')[:5]
        latest = LocationSerializer(latest_locations, many=True).data
        
        # Get category distribution
        category_distribution = [
            {'name': category.name, 'count': category.location_count}
            for category in category_counts
        ]
        
        return Response({
            'total_locations': total_locations,
            'total_categories': total_categories,
            'most_common_category': most_common_category,
            'latest_locations': latest,
            'category_distribution': category_distribution
        })

def location_view(request):
    """Renders the location data page"""
    return render(request, 'map.html')