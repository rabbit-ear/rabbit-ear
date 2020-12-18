const odd_assignment = (assignments) => {
	let ms = 0;
	let vs = 0;
	for (let i = 0; i < assignments.length; i += 1) {
		if (assignments[i] === "M" || assignments[i] === "m") { ms += 1; }
		if (assignments[i] === "V" || assignments[i] === "v") { vs += 1; }
	}
	for (let i = 0; i < assignments.length; i += 1) {
		if (ms > vs && (assignments[i] === "V" || assignments[i] === "v")) { return i; }
		if (vs > ms && (assignments[i] === "M" || assignments[i] === "m")) { return i; }
	}
}

/**
 * this only works for degree-4 vertices
 */
const single_vertex_fold_angles = (sectors, assignments, t = 0) => {
	const odd = odd_assignment(assignments);
	if (odd === undefined) { return; }
	const a = sectors[(odd + 1) % sectors.length];
	const b = sectors[(odd + 2) % sectors.length];
	
	//const pab = (odd + 2) % sectors.length;
	//const pbc = (odd + 3) % sectors.length;
	const pbc = Math.PI * t;

	const cosE = -Math.cos(a)*Math.cos(b) + Math.sin(a)*Math.sin(b)*Math.cos(Math.PI - pbc);
	const res = Math.cos(Math.PI - pbc) - ((Math.sin(Math.PI - pbc) ** 2) * Math.sin(a) * Math.sin(b))/(1 - cosE);

	const pab = -Math.acos(res) + Math.PI;
};

export default single_vertex_fold_angles;

