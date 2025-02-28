# locations/admin.py

from django.contrib import admin
from .models import Location, LocationCategory

@admin.register(LocationCategory)
class LocationCategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'latitude', 'longitude', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('name', 'description')
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'category')
        }),
        ('Geographic Coordinates', {
            'fields': ('latitude', 'longitude')
        }),
    )