window.BFB_SAMPLE = {
	locations: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Carletonville'],
	facilities: [
		// Johannesburg hospitals
		{ id: 'charlotte_maxeke', name: 'Charlotte Maxeke Johannesburg Academic Hospital', type: 'hospital', location: 'Johannesburg', beds: { icu: 45, general: 120 }, stock: { insulin: 25, amoxicillin: 80, paracetamol: 200 } },
		{ id: 'helen_joseph', name: 'Helen Joseph Hospital', type: 'hospital', location: 'Johannesburg', beds: { icu: 20, general: 85 }, stock: { insulin: 15, amoxicillin: 60, paracetamol: 150 } },
		{ id: 'chris_hani_baragwanath', name: 'Chris Hani Baragwanath Academic Hospital', type: 'hospital', location: 'Johannesburg', beds: { icu: 60, general: 200 }, stock: { insulin: 40, amoxicillin: 120, paracetamol: 300 } },
		{ id: 'tambo_memorial', name: 'Tambo Memorial Hospital', type: 'hospital', location: 'Johannesburg', beds: { icu: 15, general: 75 }, stock: { insulin: 12, amoxicillin: 45, paracetamol: 120 } },
		
		// Pretoria hospitals
		{ id: 'kalafong', name: 'Kalafong Provincial Tertiary Hospital', type: 'hospital', location: 'Pretoria', beds: { icu: 25, general: 100 }, stock: { insulin: 20, amoxicillin: 70, paracetamol: 180 } },
		{ id: 'steve_biko', name: 'Steve Biko Academic Hospital', type: 'hospital', location: 'Pretoria', beds: { icu: 35, general: 150 }, stock: { insulin: 30, amoxicillin: 90, paracetamol: 250 } },
		{ id: 'george_mukhari', name: 'Dr George Mukhari Academic Hospital', type: 'hospital', location: 'Pretoria', beds: { icu: 30, general: 120 }, stock: { insulin: 25, amoxicillin: 75, paracetamol: 200 } },
		
		// Other Gauteng hospitals
		{ id: 'carletonville', name: 'Carletonville Hospital', type: 'hospital', location: 'Carletonville', beds: { icu: 8, general: 40 }, stock: { insulin: 8, amoxicillin: 30, paracetamol: 80 } },
		
		// Original sample data
		{ id: 'h_jhb_1', name: 'Joburg General Hospital', type: 'hospital', location: 'Johannesburg', beds: { icu: 3, general: 12 }, stock: { insulin: 8, amoxicillin: 20, paracetamol: 150 } },
		{ id: 'c_jhb_1', name: 'Hillbrow Clinic', type: 'clinic', location: 'Johannesburg', beds: { general: 2 }, stock: { insulin: 0, amoxicillin: 5, paracetamol: 40 } },
		{ id: 'h_cpt_1', name: 'Cape Metro Hospital', type: 'hospital', location: 'Cape Town', beds: { icu: 1, general: 7 }, stock: { insulin: 2, amoxicillin: 12, paracetamol: 90 } },
		{ id: 'c_cpt_1', name: 'Sea Point Clinic', type: 'clinic', location: 'Cape Town', beds: { general: 5 }, stock: { insulin: 1, amoxicillin: 3, paracetamol: 60 } },
		{ id: 'h_dbn_1', name: 'Durban Central Hospital', type: 'hospital', location: 'Durban', beds: { icu: 4, general: 20 }, stock: { insulin: 5, amoxicillin: 25, paracetamol: 200 } },
		{ id: 'c_dbn_1', name: 'Umhlanga Clinic', type: 'clinic', location: 'Durban', beds: { general: 4 }, stock: { insulin: 0, amoxicillin: 10, paracetamol: 80 } },
	],
	items: ['ICU bed', 'General bed', 'Insulin', 'Amoxicillin', 'Paracetamol']
};

