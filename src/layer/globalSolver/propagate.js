/**
 * Rabbit Ear (c) Kraft
 */
import table from "./table";
import { uniqueIntegers } from "../../general/arrays";
// "taco_taco", "taco_tortilla", "tortilla_tortilla", "transitivity"
const taco_types = Object.freeze(Object.keys(table));
/**
 * @description a layer orientation between two faces is encoded as:
 * 0: unknown, 1: face A is above B, 2: face B is above A.
 * this map will flip 1 and 2, leaving 0 to be 0.
 */
const flipFacePairOrder = { 0: 0, 1: 2, 2: 1 };
/**
 * @param {string} type one of the four:
 * "taco_taco", "taco_tortilla", "tortilla_tortilla", "transitivity"
 * @param {number[]} an array of the faces involved in this particular condition.
 */
const constraintToFacePairs = (type, f) => {
	switch (type) {
	// taco_taco (A,C) (B,D) (B,C) (A,D) (A,B) (C,D)
	case "taco_taco": return [
		[f[0], f[2]],
		[f[1], f[3]],
		[f[1], f[2]],
		[f[0], f[3]],
		[f[0], f[1]],
		[f[2], f[3]],
	];
	// taco_tortilla (A,C) (A,B) (B,C)
	case "taco_tortilla": return [[f[0], f[2]], [f[0], f[1]], [f[1], f[2]]];
	// tortilla_tortilla (A,C) (B,D)
	case "tortilla_tortilla": return [[f[0], f[2]], [f[1], f[3]]];
	// transitivity (A,B) (B,C) (C,A)
	case "transitivity": return [[f[0], f[1]], [f[1], f[2]], [f[2], f[0]]];
	default: return undefined;
	}
};
/**
 * @param {string} type one of the four:
 * "taco_taco", "taco_tortilla", "tortilla_tortilla", "transitivity"
 * @param {number[]} an array of the faces involved in this particular condition.
 */
const buildRuleAndLookup = (type, constraint, ...orders) => {
	const facePairsArray = constraintToFacePairs(type, constraint);
	const flipped = facePairsArray.map(pair => pair[1] < pair[0]);
	const facePairs = facePairsArray.map((pair, i) => (flipped[i]
		? `${pair[1]} ${pair[0]}`
		: `${pair[0]} ${pair[1]}`));
	const key = facePairs.map((facePair, i) => {
		for (let o = 0; o < orders.length; o += 1) {
			if (orders[o][facePair]) {
				return flipped[i]
					? flipFacePairOrder[orders[o][facePair]]
					: orders[o][facePair];
			}
		}
		return 0;
	}).join("");
	if (table[type][key] === true) { return true; }
	if (table[type][key] === false) { return false; }
	// we have an implication. return the implication expressed in terms
	// of the facePair and the order. make sure to flip the order if necessary
	const implication = table[type][key];
	const implicationFacePair = facePairs[implication[0]];
	const implicationOrder = flipped[implication[0]]
		? flipFacePairOrder[implication[1]]
		: implication[1];
	// console.log("implication", implication, implicationFacePair, implicationOrder, flipped[implication[0]]);
	return [implicationFacePair, implicationOrder];
};

const getFacesWithUnknownOrdersArray = (...orders) => {
	const unknownKeys = orders
		.map(facePairsOrder => Object.keys(facePairsOrder)
			.filter(key => facePairsOrder[key] !== 0))
		.flat();
	return uniqueIntegers(unknownKeys.map(key => key.split(" ")).flat());
};
/**
 * @description given a current set of modified facePairs keys, (modified
 * since the last time we ran this), get all condition indices that
 * include one or more of these facePairs. Additionally, filter out
 * the faces which only ever appear in solved facePairs.
 */
// const getConstraintIndicesFromFacePairs = (
// 	constraints,
// 	facePairConstraints,
// 	facePairsSubsetArray,
// 	...orders
// ) => {
// 	const facesWithUnknownOrders = {};
// 	getFacesWithUnknownOrdersArray(...orders)
// 		.forEach(f => { facesWithUnknownOrders[f] = true; });

// 	const constraintIndices = {};
// 	taco_types.forEach(type => {
// 		// given the array of modified facePairs since last round, get all
// 		// the indices in the constraints array in which these facePairs exist.
// 		const duplicates = facePairsSubsetArray
// 			.flatMap(facePair => facePairConstraints[type][facePair]);
// 		// filter these constraint indices so that (1) no duplicates and
// 		// (2) only faces which appear in an unknown order (0) are included,
// 		// which is done by consulting constraints[i] and checking all faces
// 		// mentioned in this array, testing if any of them are unknown
// 		constraintIndices[type] = uniqueIntegers(duplicates)
// 			.filter(i => constraints[type][i]
// 				.map(f => facesWithUnknownOrders[f])
// 				.reduce((a, b) => a || b, false));
// 	});
// 	return constraintIndices;
// };
const getConstraintIndicesFromFacePairs = (
	constraints,
	facePairConstraints,
	facePairsSubsetArray,
) => {
	const constraintIndices = {};
	taco_types.forEach(type => {
		// given the array of modified facePairs since last round, get all
		// the indices in the constraints array in which these facePairs exist.
		const duplicates = facePairsSubsetArray
			.flatMap(facePair => facePairConstraints[type][facePair]);
		// filter these constraint indices so that (1) no duplicates and
		// (2) only faces which appear in an unknown order (0) are included,
		// which is done by consulting constraints[i] and checking all faces
		// mentioned in this array, testing if any of them are unknown
		constraintIndices[type] = uniqueIntegers(duplicates)
			.filter(i => constraints[type][i]);
	});
	return constraintIndices;
};
/**
 * @description Update the orders, check for the implications,
 * update more orders, repeat.
 * @param {any} constraints the list of taco/tortilla/trans constraints,
 * each constraint being a list of face indices
 * @param {any} facePairConstraints a reference for every "n m" face pair key,
 * which indices does this key appear in.
 * @param {any} initiallyModifiedFacePairs array of face pair keys
 * whose value was updated since the last call to "propagate"
 * @param {any} facePairsOrder the solution.
 */
const propagate = (
	constraints,
	facePairConstraints,
	initiallyModifiedFacePairs,
	...orders
) => {
	// console.log("START propagate");
	// console.log("initiallyModifiedFacePairs", initiallyModifiedFacePairs);
	let modifiedFacePairs = initiallyModifiedFacePairs;
	// begin loop
	// all updates to "facePairsOrder", temporarily stored here until we can
	// confirm that all tests have passed and there are no layer order conflicts.
	const implications = {};

	let loopCount = 0;

	do {
		loopCount += 1;
		// using the facePairs which were modified in the last loop,
		// get all constraint indices which involve any of the individual faces
		// from any of these facePairs.
		const modifiedConstraintIndices = getConstraintIndicesFromFacePairs(
			constraints,
			facePairConstraints,
			modifiedFacePairs,
			// ...orders,
			// // implications,
		);
		// todo: do you get better results by fast forwarding through all taco-taco
		// implications (or transitivity, or any one in particular), before then
		// moving onto the other sets, or is it faster to depth-first search through all?
		// the modifications that happened this round
		const roundModificationsFacePairs = {};
		for (let t = 0; t < taco_types.length; t += 1) {
			const type = taco_types[t];
			const indices = modifiedConstraintIndices[type];
			for (let i = 0; i < indices.length; i += 1) {
				const lookupResult = buildRuleAndLookup(
					type,
					constraints[type][indices[i]],
					...orders,
					implications,
				);
				if (lookupResult === true) { continue; }
				if (lookupResult === false) {
					console.warn("invalid state found", type, constraints[type][indices[i]]);
					return false;
				}
				if (implications[lookupResult[0]]) {
					// rule already exists. make sure the results match
					if (implications[lookupResult[0]] !== lookupResult[1]) {
						console.warn("order conflict", type, constraints[type][indices[i]]);
						return false;
					}
				} else {
					const [key, value] = lookupResult;
					roundModificationsFacePairs[key] = true;
					implications[lookupResult[0]] = value;
				}
			}
		}
		modifiedFacePairs = Object.keys(roundModificationsFacePairs);
		// console.log("LOOP", loopCount);
		// console.log("modifiedConstraintIndices", modifiedConstraintIndices);
		// console.log("roundModificationsFacePairs", roundModificationsFacePairs);
		// console.log("implications", implications);
		// console.log("modifiedFacePairs", modifiedFacePairs.length, modifiedFacePairs);
	} while (modifiedFacePairs.length && loopCount < 1000);
	if (loopCount === 1000) { console.log("!!! loop reached 1000. early exit"); }
	return implications;
};

export default propagate;
