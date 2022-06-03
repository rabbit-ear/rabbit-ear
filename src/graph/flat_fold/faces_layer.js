/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description this builds a new faces_layer array. it first separates the
 * folding faces from the non-folding using faces_folding, an array of [t,f].
 * it flips the folding faces over, appends them to the non-folding ordering,
 * and (re-indexes/normalizes) all the z-index values to be the minimum
 * whole number set starting with 0.
 *
 * @param {number[]} each index is a face, each value is the z-layer order.
 * @param {boolean[]} each index is a face, T/F will the face be folded over?
 * @returns {number[]} each index is a face, each value is the z-layer order.
 */
export const fold_faces_layer = (faces_layer, faces_folding) => {
	const new_faces_layer = [];
	// filter face indices into two arrays, those folding and not folding
	const arr = faces_layer.map((_, i) => i);
	const folding = arr.filter(i => faces_folding[i]);
	const not_folding = arr.filter(i => !faces_folding[i]);
	// sort all the non-folding indices by their current layer, bottom to top,
	// give each face index a new layering index.
	// compress whatever current layer numbers down into [0...n]
	not_folding
		.sort((a, b) => faces_layer[a] - faces_layer[b])
		.forEach((face, i) => { new_faces_layer[face] = i; })
	// sort the folding faces in reverse order (flip them), compress their
	// layers down into [0...n] and and set each face to this layer index
	folding
		.sort((a, b) => faces_layer[b] - faces_layer[a]) // reverse order here
		.forEach((face, i) => { new_faces_layer[face] = not_folding.length + i; });
	return new_faces_layer;
};
