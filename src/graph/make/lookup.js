/**
 * Rabbit Ear (c) Kraft
 */

/**
 * @description Make an object which answers the question: "which edge connects
 * these two vertices?". This is accomplished by building an object with keys
 * containing vertex pairs (space separated string), and the value is the edge index.
 * This is bidirectional, so "7 15" and "15 7" are both keys that point to the same edge.
 * @param {FOLD} graph a FOLD object, containing edges_vertices
 * @returns {object} space-separated vertex pair keys, edge indices values
 * @linkcode Origami ./src/graph/make.js 336
 */
export const makeVerticesToEdgeBidirectional = ({ edges_vertices }) => {
	const map = {};
	edges_vertices
		.map(ev => ev.join(" "))
		.forEach((key, i) => { map[key] = i; });
	edges_vertices
		.map(ev => `${ev[1]} ${ev[0]}`)
		.forEach((key, i) => { map[key] = i; });
	return map;
};

/**
 * @description Make an object which answers the question: "which edge connects
 * these two vertices?". This is accomplished by building an object with keys
 * containing vertex pairs (space separated string), and the value is the edge index.
 * This is not bidirectional, so "7 15" can exist while "15 7" does not. This is useful
 * for example for looking up the edge's vector, which is direction specific.
 * @param {FOLD} graph a FOLD object, containing edges_vertices
 * @returns {object} space-separated vertex pair keys, edge indices values
 * @linkcode Origami ./src/graph/make.js 356
 */
export const makeVerticesToEdge = ({ edges_vertices }) => {
	const map = {};
	edges_vertices
		.map(ev => ev.join(" "))
		.forEach((key, i) => { map[key] = i; });
	return map;
};

/**
 * @description Make an object which answers the question: "which face contains these
 * 3 consecutive vertices? (3 vertices in sequential order, from two adjacent edges)"
 * The keys are space-separated trios of vertex indices, 3 vertices which
 * are found when walking a face. These 3 vertices uniquely point to one and only one
 * face, and the counter-clockwise walk direction is respected, this is not
 * bidirectional, and does not contain the opposite order of the same 3 vertices.
 * @param {FOLD} graph a FOLD object, containing faces_vertices
 * @returns {object} space-separated vertex trio keys, face indices values
 * @linkcode Origami ./src/graph/make.js 374
 */
export const makeVerticesToFaceTriple = ({ faces_vertices }) => {
	const map = {};
	faces_vertices
		.forEach((face, f) => face
			.map((_, i) => [0, 1, 2]
				.map(j => (i + j) % face.length)
				.map(n => face[n])
				.join(" "))
			.forEach(key => { map[key] = f; }));
	return map;
};

/**
 *
 */
export const makeVerticesToFace = ({ faces_vertices }) => {
	const map = {};
	faces_vertices
		.forEach((face, f) => face
			.map((_, i) => [0, 1]
				.map(j => (i + j) % face.length)
				.map(n => face[n])
				.join(" "))
			.forEach(key => { map[key] = f; }));
	return map;
};

/**
 *
 */
export const makeEdgesToFace = ({ faces_edges }) => {
	const map = {};
	faces_edges
		.forEach((edges, f) => edges
			.map((_, i) => [0, 1]
				.map(j => (i + j) % edges.length)
				.map(n => edges[n])
				.join(" "))
			.forEach(key => { map[key] = f; }));
	return map;
};
