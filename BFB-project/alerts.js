(() => {
	const locSel = document.getElementById('alert-location');
	const facSel = document.getElementById('alert-facility');
	const itemSel = document.getElementById('alert-item');
	const form = document.getElementById('alert-form');
	const statusEl = document.getElementById('alert-status');
	const listEl = document.getElementById('alerts-list');
	const data = window.BFB_SAMPLE;
	if (!locSel || !facSel || !itemSel || !form || !listEl || !data) return;

	function renderLocations() {
		locSel.innerHTML = data.locations.map(l => `<option value="${l}">${l}</option>`).join('');
	}
	function renderItems() {
		itemSel.innerHTML = data.items.map(i => `<option value="${i}">${i}</option>`).join('');
	}
	function renderFacilities() {
		const loc = locSel.value;
		const list = data.facilities.filter(f => f.location === loc);
		facSel.innerHTML = list.map(f => `<option value="${f.id}">${f.name}</option>`).join('');
	}

	function loadAlerts() {
		const key = 'bfb_alerts';
		return JSON.parse(localStorage.getItem(key) || '[]');
	}
	function saveAlerts(alerts) {
		localStorage.setItem('bfb_alerts', JSON.stringify(alerts));
	}
	function renderAlertsList() {
		const alerts = loadAlerts();
		listEl.innerHTML = '';
		if (alerts.length === 0) {
			listEl.innerHTML = '<li>No alerts yet.</li>';
			return;
		}
		for (const a of alerts) {
			const fac = data.facilities.find(f => f.id === a.facilityId);
			const li = document.createElement('li');
			li.textContent = `${a.item} at ${fac ? fac.name : a.facilityId} (${a.location})`;
			listEl.appendChild(li);
		}
	}

	renderLocations();
	renderItems();
	renderFacilities();
	renderAlertsList();
	locSel.addEventListener('change', () => { renderFacilities(); });

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		statusEl.textContent = '';
		const location = locSel.value;
		const facilityId = facSel.value;
		const item = itemSel.value;
		if (!location || !facilityId || !item) { statusEl.textContent = 'Please select all fields.'; return; }
		const alerts = loadAlerts();
		alerts.push({ location, facilityId, item, createdAt: new Date().toISOString() });
		saveAlerts(alerts);
		statusEl.textContent = 'Alert saved.';
		renderAlertsList();
	});
})();


