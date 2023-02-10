/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math.js";
/**
 * @description find a topological ordering from a set of faceOrders
 * @param {number[]} faces a subset of face indices where all faces have been
 * @param {FOLD} graph an optional FOLD graph
 * @returns {number[]} layers_face, for every layer (key) which face (value) inhabits it.
 * @linkcode Origami ./src/layer/topological.js 10
 */
const topologicalOrder = ({ faceOrders, faces_normal }, faces) => {
	if (!faceOrders) { return []; }
	const facesHash = {};
	faces.forEach(face => { facesHash[face] = true; });
	const face0 = faces[0];
	const faces_normal_match = [];
	faces.map(face => {
		faces_normal_match[face] = math
			.dot(faces_normal[face], faces_normal[faces[0]]) > 0;
	});
	// create an array where every face involved gets an index and an array as its value
	// this array will contain every face that is "below" this face.
	const facesBelow = [];
	// const facesAbove = [];
	faces.forEach(face => { facesBelow[face] = []; });
	// faces.forEach(face => { facesAbove[face] = []; })
	faceOrders.forEach(order => {
		// "faces" is already disjoint. we only need to check one face in order
		if (!facesHash[order[0]]) { return; }
		// this pair states face [0] is above face [1]. according to the +1 -1 order,
		// and whether or not the reference face [1] normal is flipped. (xor either)
		const pair = (order[2] === -1) ^ (!faces_normal_match[order[1]])
			? [order[1], order[0]]
			: [order[0], order[1]];
		facesBelow[pair[0]].push(pair[1]);
		// facesAbove[pair[1]].push(pair[0]);
	});
	const layers_face = []; // this is the topological ordering
	const faces_visited = {};
	const recurse = (face) => {
		faces_visited[face] = true;
		facesBelow[face].forEach(f => {
			if (faces_visited[f]) { return; }
			recurse(f);
		});
		layers_face.push(face);
	};
	faces.forEach(face => {
		if (faces_visited[face]) { return; }
		recurse(face);
	});
	// console.log("faces", faces);
	// console.log("faceOrders", faceOrders);
	// console.log("faces_normal_match", faces_normal_match);
	// console.log("facesBelow", facesBelow);
	// console.log("facesAbove", facesAbove);
	// console.log("layers_face", layers_face);
	return layers_face;
};

export default topologicalOrder;
