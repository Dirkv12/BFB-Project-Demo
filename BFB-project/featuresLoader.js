
(async () => {
	const list = document.getElementById('features-list');
	if (!list) return;
	try {
		const res = await fetch('doc_extracted.txt');
		if (!res.ok) throw new Error('missing doc_extracted.txt');
		const text = await res.text();
		const lines = text.split(/\r?\n/);
		// naive parse: find a line that includes 'Features' and collect next ~8 bullets/lines
		let idx = lines.findIndex(l => /features/i.test(l));
		const items = [];
		if (idx >= 0) {
			for (let i = idx + 1; i < Math.min(lines.length, idx + 30); i++) {
				const line = lines[i].trim();
				if (!line) continue;
				if (/^[A-Z][A-Za-z\s]{0,30}$/.test(line) && /about|contact|login|sign/i.test(line)) break;
				items.push(line);
				if (items.length >= 8) break;
			}
		}
		list.innerHTML = '';
		if (items.length === 0) {
			list.innerHTML = '<li>No features detected in document yet.</li>';
			return;
		}
		for (const it of items) {
			const li = document.createElement('li');
			li.textContent = it;
			list.appendChild(li);
		}
	} catch (_) {
		list.innerHTML = '<li>Could not load document content.</li>';
	}
})();

