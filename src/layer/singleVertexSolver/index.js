/**
 * Rabbit Ear (c) Kraft
 */
import math from "../../math";
import makeFoldedStripTacos from "../tacos/makeFoldedStripTacos";
import validateLayerSolver from "./validateLayerSolver";
import foldStripWithAssignments from "./foldStripWithAssignments";
import { assignmentsToFacesVertical } from "./general";
import { invertMap } from "../../graph/maps";
import clone from "../../general/clone";

const is_boundary = { B: true, b: true };
/**
 * @description Given an ordered set of faces and crease assignments
 * between the faces, this recursive algorithm finds every combination
 * of layer orderings that work without causing any self-intersections.
 * "scalars" could be sector angles, where the sum of angles doesn't need to
 * add up to 360, or this method can solve a strip of paper where "scalars"
 * is not radial, simply 1D lengths between folds.
 * If "scalars" represents a 1D folded strip which does not loop around, make
 * sure to include two "B" assignments in the correct location.
 * faces and assignments are fencepost aligned. assignments precedes faces.
 * faces: |-----(0)-----(1)-----(2)---- ... -(n-2)-------(n-1)-|
 * assig: |-(0)-----(1)-----(2)-----(3) ... -------(n-1)-------|
 * @param {number[]} ordered unsigned scalars, the length of paper between folds
 * @param {string[]} array of "M","V", assignment of fold between faces
 * @returns {number[][]} array of arrays. each inner array is a solution.
 * each solution is an ordering of faces_layer, where each index is a
 * face and each value is the layer the face occupies.
 * @linkcode Origami ./src/layer/singleVertexSolver/index.js 30
 */
const singleVertexSolver = (ordered_scalars, assignments, epsilon = math.core.EPSILON) => {
	const faces_folded = foldStripWithAssignments(ordered_scalars, assignments);
	const faces_updown = assignmentsToFacesVertical(assignments);
	// todo: we only really need to check index [0] and [length-1]
	const is_circular = assignments
		.map(a => !(is_boundary[a]))
		.reduce((a, b) => a && b, true);
	// if the sector contains no boundary (cuts), check if the folded state
	// start and end line up, if not, it's clear no solution is possible.
	if (is_circular) {
		const start = faces_folded[0][0];
		const end = faces_folded[faces_folded.length - 1][1];
		if (Math.abs(start - end) > epsilon) { return []; }
	}
	// prepare tacos ahead of time, since we know the fold locations
	// only grab the left and right tacos. return their adjacent faces in the
	// form of which pair they are a part of, as an inverted array.
	// taco-tortilla testing will happen using a different data structure.
	const taco_face_pairs = makeFoldedStripTacos(faces_folded, is_circular, epsilon)
		.map(taco => [taco.left, taco.right]
			.map(invertMap)
			.filter(arr => arr.length > 1))
		.reduce((a, b) => a.concat(b), []);
	/**
	 * @description Consectively visit each face from 0...n, recursively
	 * inserting it above or below the current position (in all slots above
	 * or below). At the beginning of the recusive function check if there is a
	 * violation where the newly-inserted face is causing a self-intersection.
	 * @param {number[]} layering is an inverted form of the final return value.
	 * indices represent layers, from 0 to N, moving upwards in +Z space,
	 * and faces will be inserted into layers as we search for a layer ordering.
	 * @param {number} iteration count, relates directly to the face index
	 * @param {number} layer, the +Z index layer currently being added to,
	 * this is the splice index of layers_face we will be adding the face to.
	 */
	const recurse = (layers_face = [0], face = 0, layer = 0) => {
		const next_face = face + 1;
		// will the next face be above or below the current face's position?
		const next_dir = faces_updown[face];
		// because this test will run during the intermediate assembly of a strip.
		// the strip may eventually be circular, but currently it isn't.
		// set this boolean to be true only if we are also at the end.
		const is_done = face >= ordered_scalars.length - 1;
		// is circular AND is done (just added the final face)
		const circ_and_done = is_circular && is_done;
		// test for any self-intersections throughout the entire layering
		if (!validateLayerSolver(
			faces_folded,
			layers_face,
			taco_face_pairs,
			circ_and_done,
			epsilon,
		)) {
			return [];
		}
		// just before exit.
		// the final crease must turn the correct direction back to the start.
		if (circ_and_done) {
			// next_dir is now indicating the direction from the final face to the
			// first face, test if this also matches the orientation of the faces.
			const faces_layer = invertMap(layers_face);
			const first_face_layer = faces_layer[0];
			const last_face_layer = faces_layer[face];
			if (next_dir > 0 && last_face_layer > first_face_layer) { return []; }
			if (next_dir < 0 && last_face_layer < first_face_layer) { return []; }
			// todo: what about === 0 ?
		}

		// Exit case. all faces have been traversed.
		if (is_done) { return [layers_face]; }
		// Continue case.
		// depending on the direction of the next face (above, below, same level),
		// insert the face into one or many places, then repeat the recursive call.
		// note: causing a self-intersection is possible, hence, check at beginning
		if (next_dir === 0) {
			// append the next face into this layer (making it an array if necessary)
			// and repeat the recursion with no additional layers, just this one.
			layers_face[layer] = [next_face].concat(layers_face[layer]);
			// no need to call .slice() on layers_face. only one path forward.
			return recurse(layers_face, next_face, layer);
		}
		// given our current position (layer) and next_dir (up or down),
		// get the subarray that's either above or below the current layer.
		// these are all the indices we will attempt to insert the new face.
		// - below: [0, layer]. includes layer
		// - above: (layer, length]. excludes layer. includes length (# of faces)
		// this way all indices (including +1 at the end) are covered once.
		// these are used in the splice() method, 0...Length, inserting an element
		// will place the new element before the old element at that same index.
		// so, we need +1 indices (at the end) to be able to append to the end.
		const splice_layers = next_dir === 1
			? Array.from(Array(layers_face.length - layer))
				.map((_, i) => layer + i + 1)
			: Array.from(Array(layer + 1))
				.map((_, i) => i);
		// recursively attempt to fit the next folded face at all possible layers.
		// make a deep copy of the layers_face arrays.
		const next_layers_faces = splice_layers.map(() => clone(layers_face));
		// insert the next_face into all possible valid locations (above or below)
		next_layers_faces
			.forEach((layers, i) => layers.splice(splice_layers[i], 0, next_face));
		// recursively call
		return next_layers_faces
			.map((layers, i) => recurse(layers, next_face, splice_layers[i]))
			.reduce((a, b) => a.concat(b), []);
	};
	// after collecting all layers_face solutions, convert them into faces_layer
	return recurse().map(invertMap);
};

export default singleVertexSolver;
