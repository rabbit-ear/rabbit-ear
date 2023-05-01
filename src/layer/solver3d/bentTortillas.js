/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description For a 3D folded model, this will find the places
 * where two planes meet along collinear edges, these joining of two
 * planes creates a tortilla-tortilla relationship.
 * @param {FOLD} graph a FOLD graph
 * @param {number[][]} tortillaTortillaEdges each tortilla event is
 * a pair of edge indices.
 * @param {number[]} faces_set for every face, which set is it a member of.
 * @param {boolean[]} faces_winding for every face, is it aligned in its plane?
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][][]} an array of tortilla-tortilla events
 * where each item is an array of array of face indices, for example:
 * [[A,B], [X,Y]], where A-B are adjacent faces and X-Y are adjacent.
 */
const makeBentTortillas = ({
	edges_faces,
}, tortillaTortillaEdges, faces_set, faces_winding) => {
	// all pairwise combinations of edges that create a 3D tortilla-tortilla
	// for each tortilla-tortilla edge, get the four adjacent faces involved
	const tortilla_faces = tortillaTortillaEdges
		.map(pair => pair
			.map(edge => edges_faces[edge].slice()));
	// sort the faces of the tortillas on the correct side so that
	// the two faces in the same plane have the same index in their arrays.
	// [[A,B], [X,Y]], A and B are edge-connected faces, X and Y are connected,
	// and A and X are in the same plane, B and Y are in the same plane.
	tortilla_faces.forEach((tortillas, i) => {
		// if both [0] are not from the same set, reverse the second tortilla's faces
		if (faces_set[tortillas[0][0]] !== faces_set[tortillas[1][0]]) {
			tortilla_faces[i][1].reverse();
		}
	});
	// finally, each planar set chose a normal for that plane at random,
	// it's possible that either side of the tortilla have opposing normals,
	// the act of the solver placing a face "above" or "below" the other means
	// two different things for either side. we need to normalize this behavior.
	// determine a mismatch by checking two adjacent faces (two different sets)
	tortilla_faces
		.map(tortillas => [tortillas[0][0], tortillas[0][1]])
		.map(faces => faces.map(face => faces_winding[face]))
		.map((orients, i) => (orients[0] !== orients[1] ? i : undefined))
		.filter(a => a !== undefined)
		.forEach(i => {
			// two faces that are a member of the same planar set. swap them.
			const temp = tortilla_faces[i][0][1];
			tortilla_faces[i][0][1] = tortilla_faces[i][1][1];
			tortilla_faces[i][1][1] = temp;
		});
	return tortilla_faces;
};

export default makeBentTortillas;
