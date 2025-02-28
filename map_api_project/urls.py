from django.contrib import admin
from django.urls import path, include
from locations.views import map_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('locations.urls')),  # Make sure this is correct
    path('', map_view, name='map'),
]