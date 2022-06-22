const taco_taco_valid_states = [
	[1,1,1,1,1,2],
	[1,1,1,1,2,1],
	[1,1,1,2,2,2],
	[1,1,2,1,1,1],
	[1,2,1,1,1,2],
	[1,2,1,2,2,2],
	[1,2,2,1,1,1],
	[1,2,2,2,1,2],
	[2,1,1,1,2,1],
	[2,1,1,2,2,2],
	[2,1,2,1,1,1],
	[2,1,2,2,2,1],
	[2,2,1,2,2,2],
	[2,2,2,1,1,1],
	[2,2,2,2,1,2],
	[2,2,2,2,2,1],
];

const taco_tortilla_valid_states = [
	[1,1,2],
	[1,2,1],
	[2,1,2],
	[2,2,1],
];

const tortilla_tortilla_valid_states = [
	[1,1],
	[2,2],
];

const func = (states, t, A) => {
	// const A = [a,b,c,d,e,f];
	if (A.filter(x => x === 0).length !== t) { return; }
	states[t][A.join("")] = 0;
	let good = 0;
	for (let i = 0; i < A.length; i++) {
		let check = [];
		if (A[i] === 0) {
			for (let x = 1; x <= 2; x++) {          
				A[i] = x
				if (states[t - 1][A.join("")] !== 0) {
					check.push([i, x]);
				}
			}
			A[i] = 0;
			if (check.length > 0 && good === 0) {
				good = [];
			}
			if (check.length == 1) {
				good.push(check[0]);
			}
		}
	}
	if (good !== 0 && good.length === 0) {
		good = 1;
	}
	states[t][A.join("")] = good;
};

const make_taco_taco_lookup = () => {
	const states = [{}, {}, {}, {}, {}, {}, {}];
	[1,2]
	.forEach(a => [1,2]
		.forEach(b => [1,2]
			.forEach(c => [1,2]
				.forEach(d => [1,2]
					.forEach(e => [1,2]
						.map(f => `${a}${b}${c}${d}${e}${f}`)
						.forEach(key => { states[0][key] = 0; }))))));
	taco_taco_valid_states
		.map(state => state.join(""))
		.forEach(s => { states[0][s] = 1; });
	[1,2,3,4,5,6]
	.forEach(t => [0,1,2]
		.forEach(a => [0,1,2]
			.forEach(b => [0,1,2]
				.forEach(c => [0,1,2]
					.forEach(d => [0,1,2]
						.forEach(e => [0,1,2]
							.forEach(f => func(states, t, [a, b, c, d, e, f]))))))));
	let outs = [];
	[6, 5, 4, 3, 2, 1, 0].forEach(t => {
		const A = [];
		Object.keys(states[t]).forEach(key => {
			let out = states[t][key];
			if (out !== 0 && out !== 1) { out = out[0]; }
			A.push([key, out]);
		});
		outs = outs.concat(A);
	});
	outs.sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
	const taco_taco_lookup = {};
	outs.forEach(el => { taco_taco_lookup[el[0]] = el[1]; });
	return taco_taco_lookup;
};

const make_taco_tortilla_lookup = () => {
	const states = [{}, {}, {}, {}];
	[1,2]
	.forEach(a => [1,2]
		.forEach(b => [1,2]
			.map(c => `${a}${b}${c}`)
			.forEach(key => { states[0][key] = 0; })));
	taco_tortilla_valid_states
		.map(state => state.join(""))
		.forEach(s => { states[0][s] = 1; });
	[1,2,3]
	.forEach(t => [0,1,2]
		.forEach(a => [0,1,2]
			.forEach(b => [0,1,2]
				.forEach(c => func(states, t, [a, b, c])))));
	let outs = [];
	[3, 2, 1, 0].forEach(t => {
		const A = [];
		Object.keys(states[t]).forEach(key => {
			let out = states[t][key];
			if (out !== 0 && out !== 1) { out = out[0]; }
			A.push([key, out]);
		});
		outs = outs.concat(A);
	});
	outs.sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
	const taco_tortilla_lookup = {};
	outs.forEach(el => { taco_tortilla_lookup[el[0]] = el[1]; });
	return taco_tortilla_lookup;
};

const make_tortilla_tortilla_lookup = () => {
	const states = [{}, {}, {}];
	[1,2]
	.forEach(a => [1,2]
		.map(b => `${a}${b}`)
		.forEach(key => { states[0][key] = 0; }));
	tortilla_tortilla_valid_states
		.map(state => state.join(""))
		.forEach(s => { states[0][s] = 1; });
	// [1,2,3]
	[1,2]
	.forEach(t => [0,1,2]
		.forEach(a => [0,1,2]
			.forEach(b => func(states, t, [a, b]))));
	let outs = [];
	[2, 1, 0].forEach(t => {
		const A = [];
		Object.keys(states[t]).forEach(key => {
			let out = states[t][key];
			if (out !== 0 && out !== 1) { out = out[0]; }
			A.push([key, out]);
		});
		outs = outs.concat(A);
	});
	outs.sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
	const tortilla_tortilla_lookup = {};
	outs.forEach(el => { tortilla_tortilla_lookup[el[0]] = el[1]; });
	return tortilla_tortilla_lookup;
};

// todo: recursively Object.freeze
export default {
	taco_taco: make_taco_taco_lookup(),
	taco_tortilla: make_taco_tortilla_lookup(),
	tortilla_tortilla: make_tortilla_tortilla_lookup(),
};
