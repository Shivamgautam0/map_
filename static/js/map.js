// static/js/data.js

document.addEventListener('DOMContentLoaded', function() {
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
                <div class="location-item">
                    <div class="location-header">
                        <span class="location-name">${location.name}</span>
                        <span class="location-category">${location.category_name}</span>
                    </div>
                    <div class="location-description">${location.description || 'No description available.'}</div>
                </div>
            `).join('');
            
            document.getElementById('latest-locations').innerHTML = 
                latestLocationsHtml || '<p>No locations added yet.</p>';

            // Display category distribution
            const maxCount = Math.max(...data.category_distribution.map(item => item.count), 1);
            
            const categoryDistributionHtml = data.category_distribution.map(category => `
                <div class="stat-item">
                    <div>${category.name} (${category.count})</div>
                    <div class="stat-value">${Math.round(category.count / data.total_locations * 100)}%</div>
                </div>
                <div class="category-bar" style="width: ${(category.count / maxCount * 100)}%"></div>
            `).join('');
            
            document.getElementById('category-distribution').innerHTML = 
                categoryDistributionHtml || '<p>No categories available.</p>';
        })
        .catch(error => console.error('Error loading statistics:', error));
        
    // Load all locations
    fetch('/api/locations/')
        .then(response => response.json())
        .then(data => {
            const locationsHtml = data.map(location => `
                <div class="location-item">
                    <div class="location-header">
                        <span class="location-name">${location.name}</span>
                        <span class="location-category">${location.category_name}</span>
                    </div>
                    <div class="stat-item">
                        <div>Coordinates:</div>
                        <div>${location.latitude}, ${location.longitude}</div>
                    </div>
                    <div class="location-description">${location.description || 'No description available.'}</div>
                </div>
            `).join('');
            
            document.getElementById('locations-list').innerHTML = 
                locationsHtml || '<p>No locations available.</p>';
        })
        .catch(error => console.error('Error loading locations:', error));
});