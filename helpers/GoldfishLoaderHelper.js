Goldfish.Create({
	title: 'Goldfish',
	properties: 'Interests,Colleagues,PastProjects,Responsibilities'
});

Goldfish.RegisterLayouts(
	[
		{ 
			label: 'Interests', 
			value: 'Interests', 
			key: 9,
			template: {
				value: 'Interests'
			}
		},
		{ 
			label: 'Colleagues', 
			value: 'Colleagues', 
			key: 10,
			template: {
				value: 'Colleagues'
			} 
		},
		{ 
			label: 'Past Projects', 
			value: 'Past Projects', 
			key: 11,
			template: {
				value: 'PastProjects'
			} 
		},
		{ 
			label: 'Responsibilities', 
			value: 'Responsibilities', 
			key: 12,
			template: {
				value: 'Responsibilities'
			} 
		}
	]
);