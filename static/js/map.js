// static/js/map.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    const map = L.map('map').setView([0, 0], 2);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Load locations as GeoJSON
    fetch('/api/geojson/')
        .then(response => response.json())
        .then(data => {
            // Add GeoJSON to map
            L.geoJSON(data, {
                pointToLayer: function(feature, latlng) {
                    return L.marker(latlng);
                },
                onEachFeature: function(feature, layer) {
                    const properties = feature.properties;
                    layer.bindPopup(`
                        <h3>${properties.name}</h3>
                        <p><strong>Category:</strong> ${properties.category}</p>
                        <p>${properties.description || 'No description available.'}</p>
                    `);
                }
            }).addTo(map);

            // If we have locations, fit the map to show all of them
            if (data.features.length > 0) {
                const bounds = L.geoJSON(data).getBounds();
                map.fitBounds(bounds);
            }
        })
        .catch(error => console.error('Error loading GeoJSON:', error));

    // Load statistics
    fetch('/api/statistics/')
        .then(response => response.json())
        .then(data => {
            // Display general statistics
            document.getElementById('statistics-container').innerHTML = `
                <div class="stat-item">
                    <div>Total Locations:</div>
                    <div class="stat-value">${data.total_locations}</div>
                </div>
                <div class="stat-item">
                    <div>Total Categories:</div>
                    <div class="stat-value">${data.total_categories}</div>
                </div>
                ${data.most_common_category ? 
                    `<div class="stat-item">
                        <div>Most Common Category:</div>
                        <div class="stat-value">${data.most_common_category.name} (${data.most_common_category.count} locations)</div>
                    </div>` : 
                    ''}
            `;

            // Display latest locations
            const latestLocationsHtml = data.latest_locations.map(location => `
                <div class="stat-item">
                    <div>${location.name}</div>
                    <div class="stat-value">${location.category_name}</div>
                </div>
            `).join('');
            
            document.getElementById('latest-locations').innerHTML = 
                latestLocationsHtml || '<p>No locations added yet.</p>';

            // Display category distribution
            const maxCount = Math.max(...data.category_distribution.map(item => item.count));
            
            const categoryDistributionHtml = data.category_distribution.map(category => `
                <div class="stat-item">
                    <div>${category.name} (${category.count})</div>
                    <div class="category-bar" style="width: ${(category.count / maxCount * 100)}%"></div>
                </div>
            `).join('');
            
            document.getElementById('category-distribution').innerHTML = 
                categoryDistributionHtml || '<p>No categories available.</p>';
        })
        .catch(error => console.error('Error loading statistics:', error));
});