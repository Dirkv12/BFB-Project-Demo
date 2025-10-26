(() => {
	const locSel = document.getElementById('info-location');
	const typeSel = document.getElementById('info-type');
	const facSel = document.getElementById('info-facility');
	const output = document.getElementById('info-output');
	const data = window.BFB_SAMPLE;
	if (!locSel || !typeSel || !facSel || !output || !data) return;

	function renderLocations() {
		locSel.innerHTML = data.locations.map(l => `<option value="${l}">${l}</option>`).join('');
	}
	function filterFacilities() {
		const loc = locSel.value;
		const type = typeSel.value;
		const list = data.facilities.filter(f => f.location === loc && (type === 'all' || f.type === type));
		facSel.innerHTML = list.map(f => `<option value="${f.id}">${f.name}</option>`).join('');
		if (list.length) { showFacility(list[0].id); } else { output.innerHTML = '<i>No facilities</i>'; }
	}
	function showFacility(id) {
		const f = data.facilities.find(x => x.id === id);
		if (!f) { output.innerHTML = '<i>Select a facility</i>'; return; }
		const bedLines = Object.entries(f.beds || {}).map(([k,v]) => `<li>${k.toUpperCase()}: <strong>${v}</strong> available</li>`).join('');
		const stockLines = Object.entries(f.stock || {}).map(([k,v]) => `<li>${k}: <strong>${v}</strong> in stock</li>`).join('');
		output.innerHTML = `
			<h3 style="margin-top:0;">${f.name}</h3>
			<p class="muted">${f.type[0].toUpperCase()+f.type.slice(1)} • ${f.location}</p>
			<div class="grid-2">
				<div>
					<h4>Beds</h4>
					<ul>${bedLines || '<li>—</li>'}</ul>
				</div>
				<div>
					<h4>Medication stock</h4>
					<ul>${stockLines || '<li>—</li>'}</ul>
				</div>
			</div>
		`;
	}

	renderLocations();
	filterFacilities();
	locSel.addEventListener('change', filterFacilities);
	typeSel.addEventListener('change', filterFacilities);
	facSel.addEventListener('change', () => showFacility(facSel.value));
})();


