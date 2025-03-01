***REST API and Django REST Framework***
        Django REST Framework (DRF) provides tools for building Web APIs.
        *API Endpoints*
        project exposes several API endpoints:

        *Location Endpoints (provided by ModelViewSet):*

            GET /api/locations/ - List all locations
            POST /api/locations/ - Create a new location
            GET /api/locations/{id}/ - Retrieve a specific location
            PUT /api/locations/{id}/ - Update a location completely
            PATCH /api/locations/{id}/ - Update a location partially
            DELETE /api/locations/{id}/ - Delete a location


        Category Endpoints (also by ModelViewSet):

            Similar CRUD operations for categories


        Custom Endpoints:

            GET /api/geojson/ - Returns locations in GeoJSON format
            GET /api/statistics/ - Returns statistics about locations
        






***The Complete Data Flow***
Let's follow the entire process when a user visits the map page:

Request Handling:

    User navigates to http://localhost:8000/
    Django receives the request
    urls.py routes it to the map_view function
    map_view renders the map.html template
    The rendered HTML is sent to the browser


Page Loading:

    Browser loads HTML, CSS, and JavaScript
    JavaScript starts running


API Requests:

    JavaScript makes a fetch request to /api/geojson/
    Django routes this to the GeoJSONView.get method
    GeoJSONView retrieves locations from the database
    GeoJSONLocationSerializer formats the data as GeoJSON
    The JSON response is sent back to the browser
    JavaScript updates the UI based on the GeoJSON


Statistics Loading:

    JavaScript makes another fetch request to /api/statistics/
    Django routes this to the StatisticsView.get method
    The view performs database queries to get statistics
    The statistics are formatted as JSON and sent back
    JavaScript updates the sidebar with the statistics


User Interaction:

User can click markers to see location details
***Admin users can go to /admin/ to add or edit locations***
When new locations are added, the map and statistics update when the page is refreshed



This entire process happens without page reloads after the initial load, creating a smooth, interactive experience.