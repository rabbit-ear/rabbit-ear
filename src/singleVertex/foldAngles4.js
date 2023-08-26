/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description In a valid, flat-foldable degree-4 single vertex,
 * three assignments should be similar, with a single odd one out.
 * This method will find the index of the odd one out.
 */
const oddAssignmentIndex = (assignments) => {
	const assigns = assignments.map(a => a.toUpperCase());
	const mountainCount = assigns.filter(a => a === "M").length;
	const valleyCount = assigns.filter(a => a === "V").length;
	return mountainCount > valleyCount
		? assigns.indexOf("V")
		: assigns.indexOf("M");
};
/**
 * @description fold a degree-4 single vertex in 3D.
 * @usage this only works for degree-4 vertices
 * @param {number[]} sectors an array of sector angles,
 * in a sorted-order around the central vertex.
 * @param {string[]} assignments an array of FOLD spec characters, "M" or "V".
 * @param {number} foldAngle the fold amount in radians, between 0 and PI.
 * This value will be internally clamped between -PI and +PI.
 * @todo is it possible to validate self-intersection (and fully validate
 * the folding), if you simply check the assignments around the smallest angle?
 * @returns {number[]|undefined} four fold angles as numbers in an array,
 * or "undefined" if the operation could not be completed.
 * @linkcode Origami ./src/singleVertex/foldAngles4.js 24
 */
const foldAngles4 = (sectors, assignments, foldAngle = 0) => {
	const odd = oddAssignmentIndex(assignments);
	if (odd === -1) { return undefined; }
	const a = sectors[(odd + 1) % sectors.length];
	const b = sectors[(odd + 2) % sectors.length];

	// const pab = (odd + 2) % sectors.length;
	// const pbc = (odd + 3) % sectors.length;
	// const pbc = Math.PI * foldAngle; // when input was between 0 and 1.
	const pbc = Math.max(-Math.PI, Math.min(Math.PI, foldAngle));

	const cosE = -Math.cos(a) * Math.cos(b)
		+ Math.sin(a) * Math.sin(b) * Math.cos(Math.PI - pbc);
	const res = Math.cos(Math.PI - pbc)
		- ((Math.sin(Math.PI - pbc) ** 2) * Math.sin(a) * Math.sin(b))
		/ (1 - cosE);

	const pab = -Math.acos(res) + Math.PI;
	return (odd % 2 === 0
		? [pab, pbc, pab, pbc].map((n, i) => (odd === i ? -n : n))
		: [pbc, pab, pbc, pab].map((n, i) => (odd === i ? -n : n)));
};

export default foldAngles4;
