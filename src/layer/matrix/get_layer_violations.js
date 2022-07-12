/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description given a matrix with +1/-1 face relationship rules, and a
 * faces_layer, check every face against every face testing if any of the
 * faces in faces_layers are violating one of the rules in the matrix.
 *
 * this is useful for testing the validity of a faces_layer order, or
 * correcting an incorrect order, as it provides information on the violations.
 *
 * if you build a layer order properly you won't ever need this method.
 */
const get_layer_violations = (matrix, faces_layer) => {
	const faces = Object.keys(faces_layer).map(n => parseInt(n, 10));
	const violations = [];
	faces.forEach(i => {
		faces.forEach(j => {
			if (i === j) { return; }
			const rule = matrix[i][j];
			if (rule == null) { return; }
			const face_direction = Math.sign(faces_layer[i] - faces_layer[j]);
			if (rule !== face_direction) {
				violations.push([i, j, matrix[i][j]]);
			}
		});
	});
	return violations;
};

export default get_layer_violations;
