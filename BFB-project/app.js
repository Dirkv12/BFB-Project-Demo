(() => {
	const routes = Array.from(document.querySelectorAll('.route'));
	const navList = document.getElementById('primary-navigation');
	const navToggle = document.querySelector('.nav-toggle');
	const yearEl = document.getElementById('year');
	const statusEl = document.getElementById('contact-status');
	const form = document.getElementById('contact-form');

	function setActive(route) {
		routes.forEach(s => s.classList.toggle('active', s.dataset.route === route));
	}

	function navigate() {
		const hash = (location.hash || '#home').replace('#', '');
		setActive(hash);
	}

	window.addEventListener('hashchange', navigate);
	navigate();

// Simple authentication check without backend
if (document.getElementById('app')) {
	const isAuthed = localStorage.getItem('bfb_authed') === 'true';
	if (!isAuthed) {
		location.href = 'auth.html';
	}
}

	if (navToggle) {
		navToggle.addEventListener('click', () => {
			navList.classList.toggle('open');
			const expanded = navList.classList.contains('open');
			navToggle.setAttribute('aria-expanded', String(expanded));
		});
	}

	if (yearEl) {
		yearEl.textContent = String(new Date().getFullYear());
	}

	if (form) {
		form.addEventListener('submit', async (e) => {
			e.preventDefault();
			statusEl.textContent = 'Sending...';
			const data = Object.fromEntries(new FormData(form));
			try {
				await new Promise(r => setTimeout(r, 600));
				statusEl.textContent = 'Thanks! We\'ll be in touch shortly.';
				form.reset();
			} catch (err) {
				statusEl.textContent = 'Something went wrong. Please try again.';
			}
		});
	}

	// Signup form logic (was incorrectly attached to login form)
	const signupForm = document.getElementById('signup-form');
	const signupStatus = document.getElementById('signup-status');
	if (signupForm) {
		signupForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			signupStatus.textContent = '';
			const formData = Object.fromEntries(new FormData(signupForm));
			const profile = {
				fullName: (formData.fullName || '').toString().trim(),
				dob: (formData.dob || '').toString(),
				idNumber: (formData.idNumber || '').toString().trim(),
				gender: (formData.gender || '').toString(),
				email: (formData.email || '').toString().trim(),
				cell: (formData.cell || '').toString().trim(),
				createdAt: new Date().toISOString(),
			};

			if (!profile.email && !profile.cell) {
				signupStatus.textContent = 'Please provide at least email or cell phone.';
				return;
			}

			try {
				await saveProfile(profile);
				signupStatus.textContent = 'Saved. You are now logged in.';
				location.hash = '#home';
			} catch (err) {
				signupStatus.textContent = 'Could not save your details. Try again.';
			}
		});
	}

	async function saveProfile(profile) {
		// If dev provided firebase-config.js and initialized app, use Firestore
		try {
			// Dynamically import Firebase if available
			const appConfig = window.firebaseConfig || null;
			if (appConfig) {
				const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
				const { getFirestore, collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
				const app = initializeApp(appConfig);
				const db = getFirestore(app);
				await addDoc(collection(db, 'profiles'), { ...profile, createdAt: serverTimestamp() });
				return;
			}
		} catch (_) {
			// fall through to localStorage
		}

		// Fallback: localStorage queue
		const key = 'bfb_profiles';
		const existing = JSON.parse(localStorage.getItem(key) || '[]');
		existing.push(profile);
		localStorage.setItem(key, JSON.stringify(existing));
	}
})();
