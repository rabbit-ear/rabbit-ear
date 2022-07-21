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
	const key = facePairs.map(facePair => {
		for (let i = 0; i < orders.length; i += 1) {
			if (orders[i][facePair]) { return orders[i][facePair]; }
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
	console.log("implication", implication, implicationFacePair, implicationOrder, flipped[implication[0]]);
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
 * @description Update the orders, check for the implications,
 * update more orders, repeat.
 * @param {any} facePairsOrder the solution.
 * @param {any} constraints the list of taco/tortilla/trans constraints,
 * each constraint being a list of face indices
 * @param {any} facePairConstraints a reference for every "n m" face pair key,
 * which indices does this key appear in.
 * @param {any} initiallyModifiedFacePairs array of face pair keys whose value was updated
 * since the last call to "propagate"
 */
const propagate = (
	facePairsOrder,
	constraints,
	facePairConstraints,
	initiallyModifiedFacePairs,
) => {
	/**
	 * @description given a current set of modified facePairs keys, (modified
	 * since the last time we ran this), get all condition indices that
	 * include one or more of these facePairs; filtering out the faces
	 * which, for every case, are already solved.
	 */
	const getConstraintIndicesFromFacePairs = (facePairsSubsetArray, ...orders) => {
		const facesWithUnknownOrders = {};
		getFacesWithUnknownOrdersArray(...orders)
			.forEach(f => { facesWithUnknownOrders[f] = true; });

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
				.filter(i => constraints[type][i]
					.map(f => facesWithUnknownOrders[f])
					.reduce((a, b) => a || b, false));
		});
		return constraintIndices;
	};

	let modifiedFacePairs = initiallyModifiedFacePairs;
	// begin loop
	// all updates to "facePairsOrder", temporarily stored here until we can
	// confirm that all tests have passed and there are no layer order conflicts.
	const implications = {};

	let loopCount = 0;

	do {
		console.log("+++ START LOOP +++ ", loopCount);
		loopCount += 1;
		const modifiedConstraintIndices = getConstraintIndicesFromFacePairs(
			modifiedFacePairs,
			facePairsOrder,
		);

		// console.log("facesWithUnknownOrders", facesWithUnknownOrders);
		console.log("initiallyModifiedFacePairs", initiallyModifiedFacePairs);
		console.log("modifiedConstraintIndices", modifiedConstraintIndices);
		// todo: do you get better results by fast forwarding through all taco-taco
		// implications (or transitivity, or any one in particular), before then
		// moving onto the other sets, or is it faster to depth-first search through all?
		// the modifications that happened this round
		const roundModificationsFacePairs = {};
		taco_types.forEach(type => {
			const indices = modifiedConstraintIndices[type];
			for (let i = 0; i < indices.length; i += 1) {
				const lookupResult = buildRuleAndLookup(
					type,
					constraints[type][indices[i]],
					facePairsOrder,
					implications,
				);
				if (lookupResult === false) { return false; }
				if (lookupResult === true) { continue; }
				if (implications[lookupResult[0]]) {
					// rule already exists. make sure the results match
					if (implications[lookupResult[0]] !== lookupResult[1]) {
						console.log("order conflict");
						return false;
					}
				} else {
					roundModificationsFacePairs[lookupResult[0]] = true;
					implications[lookupResult[0]] = lookupResult[1];
				}
			}
		});
		console.log("roundModificationsFacePairs", roundModificationsFacePairs);
		console.log("implications", implications);
		modifiedFacePairs = Object.keys(roundModificationsFacePairs);
		console.log("END modifiedFacePairs", modifiedFacePairs.length, modifiedFacePairs);
	} while (modifiedFacePairs.length && loopCount < 20);
	return true;
};

export default propagate;
