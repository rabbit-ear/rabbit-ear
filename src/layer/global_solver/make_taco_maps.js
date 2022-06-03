/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description Each taco/tortilla event involves the relationship between
 * 3 or 4 faces. The lookup table encodes the relationship between all
 * permutations of pairs of these faces in a particular order.
 * 6: taco-taco, 3: taco-tortilla, 2: tortilla-tortilla, 3: transitivity.
 */
const refactor_pairs = (tacos_tortillas, transitivity_trios) => {
	const pairs = {};
	// A-C and B-D are connected. A:[0][0] C:[0][1] B:[1][0] D:[1][1]
	// "(A,C) (B,D) (B,C) (A,D) (A,B) (C,D)"
	pairs.taco_taco = tacos_tortillas.taco_taco.map(el => [
		[el[0][0], el[0][1]],
		[el[1][0], el[1][1]],
		[el[1][0], el[0][1]],
		[el[0][0], el[1][1]],
		[el[0][0], el[1][0]],
		[el[0][1], el[1][1]],
	]);
	// A-C is the taco, B is the tortilla. A:taco[0] C:taco[1] B:tortilla
	// (A,C) (A,B) (B,C)
	pairs.taco_tortilla = tacos_tortillas.taco_tortilla.map(el => [
		[el.taco[0], el.taco[1]],
		[el.taco[0], el.tortilla],
		[el.tortilla, el.taco[1]],
	]);
	// // A-C and B-D are connected. A:[0][0] C:[0][1] B:[1][0] D:[1][1]
	// // (A,C) (B,D)
	// pairs.tortilla_tortilla = tacos_tortillas.tortilla_tortilla.map(el => [
	//   [el[0][0], el[0][1]],
	//   [el[1][0], el[1][1]],
	// ]);

	// A-B and C-D are connected, where A is above/below C and B is above/below D
	// A:[0][0] B:[0][1] C:[1][0] D:[1][1]
	// (A,C) (B,D)
	pairs.tortilla_tortilla = tacos_tortillas.tortilla_tortilla.map(el => [
		[el[0][0], el[1][0]],
		[el[0][1], el[1][1]],
	]);
	// transitivity. no relation between faces in the graph.
	// (A,B) (B,C) (C,A)
	pairs.transitivity = transitivity_trios.map(el => [
		[el[0], el[1]],
		[el[1], el[2]],
		[el[2], el[0]],
	]);
	return pairs;
};
/**
 * @description refactor_pairs converts all taco/tortilla events into
 * an array of (6/3/2/3) pairs of faces involved in the taco/tortilla.
 * this method converts the pairs into space-separated strings, like "3 17",
 * and stores a note whether the pairs of numbers had to be flipped to be
 * sorted small to large (the only encoding in the conditions list), implying
 * that the value will also need to be flipped when storing and extracting.
 * @returns {object[]} array of objects matching the length of the number
 * of taco/tortilla cases. each object represents one taco/tortilla event.
 * each object contains two keys, each value is an array.
 * "face_keys": array of face keys (length 6,3,2,3), like "3 17".
 * "keys_ordered": matching-length array noting if the pair had to be flipped.
 */
const make_maps = tacos_face_pairs => tacos_face_pairs
	.map(face_pairs => {
		const keys_ordered = face_pairs.map(pair => pair[0] < pair[1]);
		const face_keys = face_pairs.map((pair, i) => keys_ordered[i]
			? `${pair[0]} ${pair[1]}`
			: `${pair[1]} ${pair[0]}`);
		return { face_keys, keys_ordered };
	});

const make_taco_maps = (tacos_tortillas, transitivity_trios) => {
	const pairs = refactor_pairs(tacos_tortillas, transitivity_trios);
	// console.log("pairs", pairs);
	// keys_ordered answers "is the first face < than second face?" regarding
	// how this will be used to reference the conditions lookup table.
	return {
		taco_taco: make_maps(pairs.taco_taco),
		taco_tortilla: make_maps(pairs.taco_tortilla),
		tortilla_tortilla: make_maps(pairs.tortilla_tortilla),
		transitivity: make_maps(pairs.transitivity),
	};
};

export default make_taco_maps;
