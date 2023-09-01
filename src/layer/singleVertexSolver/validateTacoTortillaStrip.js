/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/constant.js";
import { invertMap } from "../../graph/maps.js";
/**
 * @description given two indices, return a copy of the array between them,
 * excluding the elements at the indices themselves.
 * @returns {any[]} the subarray exclusively between the two indices.
 */
const between = (arr, i, j) => (i < j
	? arr.slice(i + 1, j)
	: arr.slice(j + 1, i));
/**
 * because this test is meant to run during the intermediate steps while
 * the a strip is being assembled, the strip may eventually be circular,
 * but currently it isn't.
 *
 * @params {[number, number][]} for every sector, "start" and "end" of each sector
 * this is the output of having run "foldStripWithAssignments"
 * @param {number[]} layers_face, index is z-layer, value is the sector/face.
 * @param {boolean} do assignments contain a boundary? (to test for loop around)
 * @returns {boolean} does a violation occur. "false" means all good.
 * @linkcode Origami ./src/layer/singleVertexSolver/validateTacoTortillaStrip.js 24
 */
const validateTacoTortillaStrip = (
	faces_folded,
	layers_face,
	is_circular = true,
	epsilon = EPSILON,
) => {
	// for every sector/face, the value is its index in the layers_face array
	const faces_layer = invertMap(layers_face);
	// for every sector, the location of the end of the sector after folding
	// (the far end, the second end visited by the walk)
	const fold_location = faces_folded
		.map(ends => (ends ? ends[1] : undefined));
	// for every sector, the location of the end which lies nearest to -Infinity
	const faces_mins = faces_folded
		.map(ends => (ends ? Math.min(...ends) : undefined))
		.map(n => n + epsilon);
	// for every sector, the location of the end which lies nearest to +Infinity
	const faces_maxs = faces_folded
		.map(ends => (ends ? Math.max(...ends) : undefined))
		.map(n => n - epsilon);
	// we can't test the loop back around when j==end and i==0 because they only
	// connect after the piece has been completed,
	// but we do need to test it when that happens
	// const max = layers_face.length + (layers_face.length === sectors.length ? 0 : -1);
	// const faces_array_circular = is_circular
	//   && faces_layer.length === faces_folded.length;
	const max = faces_layer.length + (is_circular ? 0 : -1);
	// iterate through all the faces, take each face together with the next face,
	// establish the fold line between them, then check the layer stacking and
	// gather all faces that exist between this pair of faces, test each
	// of them to see if they cross through this pair's fold line.
	for (let i = 0; i < max; i += 1) {
		// this is the next face in the folding sequence
		const j = (i + 1) % faces_layer.length;
		// if two adjacent faces are in the same layer, they will not be causing an
		// overlap, at least not at their crease (because there is no crease).
		if (faces_layer[i] === faces_layer[j]) { continue; }
		// todo consider prebuilding a table of comparing fold locations with face mins and maxs
		// result of between contains both numbers and arrays: [5,[0,1],2,[3,4]]
		// the reduce will bring everything to the top level: [5,0,1,2,3,4]
		const layers_between = between(layers_face, faces_layer[i], faces_layer[j])
			.flat();
		// check if the fold line is (below/above) ALL of the sectors between it
		// it will be above if
		const all_below_min = layers_between
			.map(index => fold_location[i] < faces_mins[index])
			.reduce((a, b) => a && b, true);
		const all_above_max = layers_between
			.map(index => fold_location[i] > faces_maxs[index])
			.reduce((a, b) => a && b, true);
		if (!all_below_min && !all_above_max) { return false; }
	}
	return true;
};

export default validateTacoTortillaStrip;
