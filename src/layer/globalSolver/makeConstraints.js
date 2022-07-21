/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description Each taco/tortilla event involves the relationship between
 * 3 or 4 faces. The lookup table encodes the relationship between all
 * permutations of pairs of these faces in a particular order.
 * 6: taco-taco, 3: taco-tortilla, 2: tortilla-tortilla, 3: transitivity.
 */
const makeConstraints = (tacos_tortillas, transitivity_trios) => {
	const pairs = {};
	// A-C and B-D are connected. A:[0][0] C:[0][1] B:[1][0] D:[1][1]
	// "(A,C) (B,D) (B,C) (A,D) (A,B) (C,D)"
	pairs.taco_taco = tacos_tortillas.taco_taco.map(el => [
		el[0][0], el[1][0], el[0][1], el[1][1],
	]);
	// A-C is the taco, B is the tortilla. A:taco[0] C:taco[1] B:tortilla
	// (A,C) (A,B) (B,C)
	pairs.taco_tortilla = tacos_tortillas.taco_tortilla.map(el => [
		el.taco[0], el.tortilla, el.taco[1],
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
		el[0][0], el[0][1], el[1][0], el[1][1],
	]);
	// transitivity. no relation between faces in the graph.
	// (A,B) (B,C) (C,A)
	pairs.transitivity = transitivity_trios.map(el => [
		el[0], el[1], el[2],
	]);
	return pairs;
};

export default makeConstraints;
