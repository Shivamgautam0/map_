from django.contrib import admin
from django.urls import path, include
from locations.views import location_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('locations.urls')),  # Make sure this is correct
    path('', location_view, name='map'),
]