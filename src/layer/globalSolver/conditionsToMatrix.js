/**
 * Rabbit Ear (c) Kraft
 */
// todo: is it okay to remove the filter?
const conditionsToMatrix = (conditions) => {
	const condition_keys = Object.keys(conditions);
	const face_pairs = condition_keys
		.map(key => key.split(" ").map(n => parseInt(n, 10)));
	const faces = [];
	face_pairs
		.reduce((a, b) => a.concat(b), [])
		.forEach(f => { faces[f] = undefined; });
	const matrix = faces.map(() => []);
	face_pairs
		// .filter((_, i) => conditions[condition_keys[i]] !== 0)
		.forEach(([a, b]) => {
			matrix[a][b] = conditions[`${a} ${b}`];
			matrix[b][a] = -conditions[`${a} ${b}`];
		});
	return matrix;
};

export default conditionsToMatrix;
