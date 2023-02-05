/**
 * Rabbit Ear (c) Kraft
 */
import {
	constraintToFacePairsStrings,
} from "./general.js";
/**
 * @description Each taco/tortilla event involves the relationship between
 * 3 or 4 faces. The lookup table encodes the relationship between all
 * permutations of pairs of these faces in a particular order.
 * 6: taco-taco, 3: taco-tortilla, 2: tortilla-tortilla, 3: transitivity.
 * @linkcode Origami ./src/layer/solver2d/makeConstraints.js 12
 */
export const makeConstraints = (tacos_tortillas, transitivity_trios) => {
	const constraints = {};
	// A-C and B-D are connected. A:[0][0] C:[0][1] B:[1][0] D:[1][1]
	// "(A,C) (B,D) (B,C) (A,D) (A,B) (C,D)"
	constraints.taco_taco = tacos_tortillas.taco_taco.map(el => [
		el[0][0], el[1][0], el[0][1], el[1][1],
	]);
	// A-C is the taco, B is the tortilla. A:taco[0] C:taco[1] B:tortilla
	// (A,C) (A,B) (B,C)
	constraints.taco_tortilla = tacos_tortillas.taco_tortilla.map(el => [
		el.taco[0], el.tortilla, el.taco[1],
	]);
	// A-B and C-D are connected, where A is above/below C and B is above/below D
	// A:[0][0] B:[0][1] C:[1][0] D:[1][1]
	// (A,C) (B,D)
	constraints.tortilla_tortilla = tacos_tortillas.tortilla_tortilla.map(el => [
		el[0][0], el[0][1], el[1][0], el[1][1],
	]);
	// transitivity. no relation between faces in the graph.
	// (A,B) (B,C) (C,A)
	constraints.transitivity = transitivity_trios.map(el => [
		el[0], el[1], el[2],
	]);
	return constraints;
};

export const makeConstraintsLookup = (constraints) => {
	const lookup = {};
	Object.keys(constraints).forEach(key => { lookup[key] = {}; });
	Object.keys(constraints).forEach(type => {
		constraints[type]
			.forEach((constraint, i) => constraintToFacePairsStrings[type](constraint)
				.forEach(key => {
					if (lookup[type][key] === undefined) {
						lookup[type][key] = [];
					}
					lookup[type][key].push(i);
				}));
	});
	return lookup;
};
