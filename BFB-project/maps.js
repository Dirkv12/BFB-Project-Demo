(() => {
	// Real Gauteng public hospitals with coordinates
	const GAUTENG_HOSPITALS = [
		{
			id: 'charlotte_maxeke',
			name: 'Charlotte Maxeke Johannesburg Academic Hospital',
			address: '17 Jubilee Rd, Parktown, Johannesburg, 2193',
			lat: -26.1736,
			lng: 28.0431,
			type: 'hospital',
			phone: '011 488 4911',
			services: ['Emergency', 'ICU', 'General Medicine', 'Surgery'],
			beds: { icu: 45, general: 120 },
			stock: { insulin: 25, amoxicillin: 80, paracetamol: 200 }
		},
		{
			id: 'helen_joseph',
			name: 'Helen Joseph Hospital',
			address: 'Percy St, Auckland Park, Johannesburg, 2092',
			lat: -26.1806,
			lng: 28.0069,
			type: 'hospital',
			phone: '011 489 1011',
			services: ['Emergency', 'ICU', 'Maternity', 'Pediatrics'],
			beds: { icu: 20, general: 85 },
			stock: { insulin: 15, amoxicillin: 60, paracetamol: 150 }
		},
		{
			id: 'chris_hani_baragwanath',
			name: 'Chris Hani Baragwanath Academic Hospital',
			address: 'Chris Hani Rd, Diepkloof, Soweto, 1862',
			lat: -26.2489,
			lng: 27.9081,
			type: 'hospital',
			phone: '011 933 8000',
			services: ['Emergency', 'ICU', 'Trauma', 'Specialized Care'],
			beds: { icu: 60, general: 200 },
			stock: { insulin: 40, amoxicillin: 120, paracetamol: 300 }
		},
		{
			id: 'tambo_memorial',
			name: 'Tambo Memorial Hospital',
			address: 'Hospital St, Boksburg, 1459',
			lat: -26.2106,
			lng: 28.2514,
			type: 'hospital',
			phone: '011 898 8000',
			services: ['Emergency', 'ICU', 'General Medicine'],
			beds: { icu: 15, general: 75 },
			stock: { insulin: 12, amoxicillin: 45, paracetamol: 120 }
		},
		{
			id: 'kalafong',
			name: 'Kalafong Provincial Tertiary Hospital',
			address: 'Kalafong Rd, Atteridgeville, Pretoria, 0008',
			lat: -25.7489,
			lng: 28.1014,
			type: 'hospital',
			phone: '012 318 6500',
			services: ['Emergency', 'ICU', 'Specialized Care'],
			beds: { icu: 25, general: 100 },
			stock: { insulin: 20, amoxicillin: 70, paracetamol: 180 }
		},
		{
			id: 'steve_biko',
			name: 'Steve Biko Academic Hospital',
			address: 'Malherbe St, Prinshof, Pretoria, 0001',
			lat: -25.7489,
			lng: 28.2014,
			type: 'hospital',
			phone: '012 354 1000',
			services: ['Emergency', 'ICU', 'Trauma', 'Specialized Care'],
			beds: { icu: 35, general: 150 },
			stock: { insulin: 30, amoxicillin: 90, paracetamol: 250 }
		},
		{
			id: 'george_mukhari',
			name: 'Dr George Mukhari Academic Hospital',
			address: 'Ga-Rankuwa, Pretoria, 0208',
			lat: -25.6189,
			lng: 28.0014,
			type: 'hospital',
			phone: '012 529 3000',
			services: ['Emergency', 'ICU', 'Maternity', 'Pediatrics'],
			beds: { icu: 30, general: 120 },
			stock: { insulin: 25, amoxicillin: 75, paracetamol: 200 }
		},
		{
			id: 'carletonville',
			name: 'Carletonville Hospital',
			address: 'Hospital St, Carletonville, 2500',
			lat: -26.3589,
			lng: 27.4014,
			type: 'hospital',
			phone: '018 787 2000',
			services: ['Emergency', 'General Medicine'],
			beds: { icu: 8, general: 40 },
			stock: { insulin: 8, amoxicillin: 30, paracetamol: 80 }
		}
	];

	let map;
	let userLocation = null;
	let markers = [];

	// Initialize Google Maps (called by the API)
	window.initMap = function() {
		console.log('Google Maps API loaded successfully');
		// If we already have the user's location, try to initialize the map now.
		try {
			if (userLocation) initializeMap();
		} catch (err) {
			console.error('Error initializing map after API load', err);
			showMapError('Unable to initialize map.');
		}
	};

	// Show a friendly error message in the map container when the Google Maps API fails
	function showMapError(message) {
		const mapContainer = document.getElementById('map');
		if (!mapContainer) return;
		mapContainer.innerHTML = '';
		const wrapper = document.createElement('div');
		wrapper.className = 'card';
		wrapper.style.padding = '16px';
		wrapper.style.margin = '8px 0';
		wrapper.innerHTML = `<h4 style="margin-top:0;">Map unavailable</h4><p class="muted">${message} The interactive map is unavailable. You can still view the nearest hospitals list above.</p>`;
		mapContainer.appendChild(wrapper);
	}

	// Get user's current location
	function getCurrentLocation() {
		const statusEl = document.getElementById('location-status');
		const resultsEl = document.getElementById('nearest-results');
		const btn = document.getElementById('get-location-btn');

		if (!navigator.geolocation) {
			statusEl.textContent = 'Geolocation is not supported by this browser.';
			return;
		}

		btn.textContent = '📍 Getting location...';
		statusEl.textContent = 'Getting your location...';

		navigator.geolocation.getCurrentPosition(
			(position) => {
				userLocation = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				
				statusEl.textContent = 'Location found! Finding nearest hospitals...';
				findNearestHospitals();
				initializeMap();
			},
			(error) => {
				let message = 'Unable to get your location. ';
				switch(error.code) {
					case error.PERMISSION_DENIED:
						message += 'Please allow location access and try again.';
						break;
					case error.POSITION_UNAVAILABLE:
						message += 'Location information is unavailable.';
						break;
					case error.TIMEOUT:
						message += 'Location request timed out.';
						break;
				}
				statusEl.textContent = message;
				btn.textContent = '📍 Get My Location';
			}
		);
	}

	// Calculate distance between two points using Haversine formula
	function calculateDistance(lat1, lng1, lat2, lng2) {
		const R = 6371; // Earth's radius in kilometers
		const dLat = (lat2 - lat1) * Math.PI / 180;
		const dLng = (lng2 - lng1) * Math.PI / 180;
		const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
			Math.sin(dLng/2) * Math.sin(dLng/2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		return R * c;
	}

	// Find nearest hospitals
	function findNearestHospitals() {
		if (!userLocation) return;

		const hospitalsWithDistance = GAUTENG_HOSPITALS.map(hospital => ({
			...hospital,
			distance: calculateDistance(
				userLocation.lat, userLocation.lng,
				hospital.lat, hospital.lng
			)
		}));

		// Sort by distance
		hospitalsWithDistance.sort((a, b) => a.distance - b.distance);

		// Show top 5 nearest
		const nearestHospitals = hospitalsWithDistance.slice(0, 5);
		displayNearestHospitals(nearestHospitals);
	}

	// Display nearest hospitals
	function displayNearestHospitals(hospitals) {
		const listEl = document.getElementById('hospitals-list');
		const resultsEl = document.getElementById('nearest-results');
		const btn = document.getElementById('get-location-btn');

		btn.textContent = '📍 Get My Location';

		const hospitalsHTML = hospitals.map((hospital, index) => {
			const bedLines = Object.entries(hospital.beds || {}).map(([k,v]) => 
				`<li>${k.toUpperCase()}: <strong>${v}</strong> available</li>`
			).join('');
			
			const stockLines = Object.entries(hospital.stock || {}).map(([k,v]) => 
				`<li>${k}: <strong>${v}</strong> in stock</li>`
			).join('');

			return `
				<div class="hospital-card" style="border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-bottom: 16px;">
					<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
						<div>
							<h4 style="margin: 0 0 4px 0;">${index + 1}. ${hospital.name}</h4>
							<p class="muted" style="margin: 0; font-size: 14px;">${hospital.address}</p>
							<p class="muted" style="margin: 4px 0 0 0; font-size: 14px;">📞 ${hospital.phone}</p>
						</div>
						<div style="text-align: right;">
							<div style="background: var(--brand); color: white; padding: 4px 8px; border-radius: 8px; font-size: 12px; font-weight: 600; margin-bottom: 8px;">
								${hospital.distance.toFixed(1)} km
							</div>
							<button onclick="openDirections('${hospital.lat}', '${hospital.lng}', '${hospital.name}', '${hospital.address}')" 
									class="directions-btn"
									style="background: var(--accent); color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px;">
								🗺️ Directions
							</button>
						</div>
					</div>
					<div class="grid-2">
						<div>
							<h5 style="margin: 0 0 8px 0; color: var(--muted);">Services</h5>
							<ul style="margin: 0; padding-left: 16px; font-size: 14px;">
								${hospital.services.map(s => `<li>${s}</li>`).join('')}
							</ul>
						</div>
						<div>
							<h5 style="margin: 0 0 8px 0; color: var(--muted);">Availability</h5>
							<div class="grid-2" style="gap: 8px;">
								<div>
									<h6 style="margin: 0 0 4px 0; font-size: 12px;">Beds</h6>
									<ul style="margin: 0; padding-left: 12px; font-size: 12px;">
										${bedLines}
									</ul>
								</div>
								<div>
									<h6 style="margin: 0 0 4px 0; font-size: 12px;">Medicine</h6>
									<ul style="margin: 0; padding-left: 12px; font-size: 12px;">
										${stockLines}
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			`;
		}).join('');

		listEl.innerHTML = hospitalsHTML;
		resultsEl.style.display = 'block';
	}

	// Initialize Google Map
	function initializeMap() {
		const mapContainer = document.getElementById('map');
		if (!mapContainer || !userLocation) return;

		// Guard: ensure Google Maps API is available
		if (typeof window.google === 'undefined' || !window.google.maps) {
			console.warn('Google Maps API not available');
			showMapError('Google Maps failed to load or is blocked.');
			return;
		}

		// Create map centered on user location
		try {
			map = new google.maps.Map(mapContainer, {
			zoom: 11,
			center: userLocation,
			styles: [
				{
					featureType: 'poi',
					elementType: 'labels',
					stylers: [{ visibility: 'off' }]
				}
			]
			});
		} catch (err) {
			console.error('Error creating Google Map', err);
			showMapError('An error occurred while creating the map.');
			return;
		}

		// Add user location marker
		new google.maps.Marker({
			position: userLocation,
			map: map,
			title: 'Your Location',
			icon: {
				url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle cx="12" cy="12" r="8" fill="#22c55e" stroke="white" stroke-width="2"/>
						<circle cx="12" cy="12" r="3" fill="white"/>
					</svg>
				`),
				scaledSize: new google.maps.Size(24, 24)
			}
		});

		// Add hospital markers
		GAUTENG_HOSPITALS.forEach(hospital => {
			const marker = new google.maps.Marker({
				position: { lat: hospital.lat, lng: hospital.lng },
				map: map,
				title: hospital.name,
				icon: {
					url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#0ea5e9" stroke="white" stroke-width="1"/>
							<path d="M2 17L12 22L22 17" stroke="white" stroke-width="1"/>
							<path d="M2 12L12 17L22 12" stroke="white" stroke-width="1"/>
						</svg>
					`),
					scaledSize: new google.maps.Size(24, 24)
				}
			});

			const infoWindow = new google.maps.InfoWindow({
				content: `
					<div style="padding: 8px; max-width: 250px;">
						<h4 style="margin: 0 0 8px 0; color: var(--text);">${hospital.name}</h4>
						<p style="margin: 0 0 4px 0; font-size: 14px; color: var(--muted);">${hospital.address}</p>
						<p style="margin: 0 0 8px 0; font-size: 14px; color: var(--muted);">📞 ${hospital.phone}</p>
						<div style="display: flex; gap: 8px; flex-wrap: wrap;">
							${hospital.services.slice(0, 3).map(service => 
								`<span style="background: var(--brand); color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${service}</span>`
							).join('')}
						</div>
					</div>
				`
			});

			marker.addListener('click', () => {
				infoWindow.open(map, marker);
			});

			markers.push(marker);
		});
	}

	// Open Google Maps with directions to hospital
	window.openDirections = function(lat, lng, name, address) {
		// Create Google Maps directions URL
		const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name + ' ' + address)}`;
		
		// Open in new tab
		window.open(directionsUrl, '_blank');
	};

	// Event listeners
	document.addEventListener('DOMContentLoaded', () => {
		const getLocationBtn = document.getElementById('get-location-btn');
		if (getLocationBtn) {
			getLocationBtn.addEventListener('click', getCurrentLocation);
		}
	});
})();
