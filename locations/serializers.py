# locations/serializers.py

from rest_framework import serializers
from .models import Location, LocationCategory

class LocationCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationCategory
        fields = ['id', 'name']

class LocationSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Location
        fields = ['id', 'name', 'description', 'latitude', 'longitude', 'category', 'category_name', 'created_at']

class GeoJSONLocationSerializer(serializers.ModelSerializer):
    """Serializer that formats locations as GeoJSON features."""
    
    class Meta:
        model = Location
        fields = ['id', 'name', 'description', 'latitude', 'longitude', 'category']
    
    def to_representation(self, instance):
        return {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [instance.longitude, instance.latitude]
            },
            "properties": {
                "id": instance.id,
                "name": instance.name,
                "description": instance.description,
                "category": instance.category.name,
                "category_id": instance.category.id
            }
        }