/**
 * Rabbit Ear (c) Kraft
 */
import table from "./table.js";
import { constraintToFacePairs } from "./general.js";
import { uniqueElements } from "../../general/arrays.js";
/**
 * @typedef Constraint
 * @type {number[]}
 * @description an array of 3 or 4 faces involved in one taco/tortilla/transitivity constraint.
 */
/**
 * @typedef Constraints
 * @type {object}
 * @description All Constraint entries for all of the taco/tortilla/transitivity cases.
 * @property {Constraint[]} taco_taco an array of all taco-taco constraints.
 * @property {Constraint[]} taco_tortilla an array of all taco-tortilla constraints.
 * @property {Constraint[]} tortilla_tortilla an array of all tortilla-tortilla constraints.
 * @property {Constraint[]} transitivity an array of all transitivity constraints.
 */
// "taco_taco", "taco_tortilla", "tortilla_tortilla", "transitivity"
const taco_types = Object.freeze(Object.keys(table));
/**
 * @description a layer orientation between two faces is encoded as:
 * 0: unknown, 1: face A is above B, 2: face B is above A.
 * this map will flip 1 and 2, leaving 0 to be 0.
 */
const flipFacePairOrder = { 0: 0, 1: 2, 2: 1 };
/**
 * @description Given one particular taco/tortilla/transitivity constraint,
 * arrange its faces in all combinations of facePairs and check if any of
 * these orders are known (1 or 2), arrange this into a string (eg. 010021),
 * and use this string to reference the lookup table which will return one
 * of three states: valid, invalid, or the change implied by this state.
 * @param {string} type one of the four:
 * "taco_taco", "taco_tortilla", "tortilla_tortilla", "transitivity"
 * @param {number[]} constraint an array of the faces
 * involved in this particular condition.
 * @param {object[]} ...orders an array of solutions to facePair orders. each
 * taking the form of facePair keys, and orders (0,1,2) values.
 * @returns true if valid, false if invalid, and in the case of an implied
 * change, return an array where the first item is a facePair ("3 5"), and
 * the second is the order (like 1 or 2).
 * @linkcode Origami ./src/layer/solver2d/propagate.js 44
 */
const buildRuleAndLookup = (type, constraint, ...orders) => {
	// regroup the N faces into an array of pairs, giving us the
	// facePair ("3 5") and booleans stating if the order was flipped.
	const facePairsArray = constraintToFacePairs[type](constraint);
	const flipped = facePairsArray.map(pair => pair[1] < pair[0]);
	const facePairs = facePairsArray.map((pair, i) => (flipped[i]
		? `${pair[1]} ${pair[0]}`
		: `${pair[0]} ${pair[1]}`));
	// consult all "orders" parameters for a solution (1 or 2, not 0) to
	// the facePair. for each facePair get the first solution found, and
	// in the case of no solution, that facePair will be 0 (unknown).
	// join this together into a string, (eg: "010021")
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
	// now, consult the lookup table. if the result is a boolean,
	// return that boolean.
	if (table[type][key] === true) { return true; }
	if (table[type][key] === false) { return false; }
	// the table is giving us an implied state. return the implication's
	// facePair and order as an array. make sure to flip the order if necessary.
	const implication = table[type][key];
	const implicationFacePair = facePairs[implication[0]];
	const implicationOrder = flipped[implication[0]]
		? flipFacePairOrder[implication[1]]
		: implication[1];
	return [implicationFacePair, implicationOrder];
};

// const getFacesWithUnknownOrdersArray = (...orders) => {
// 	const unknownKeys = orders
// 		.map(facePairsOrder => Object.keys(facePairsOrder)
// 			.filter(key => facePairsOrder[key] !== 0))
// 		.flat();
// 	return uniqueElements(unknownKeys.map(key => key.split(" ")).flat());
// };
/**
 * @description Given a current set of modified facePairs keys, (modified
 * since the last time we ran this), get all condition indices that
 * include one or more of these facePairs. Additionally, filter out
 * the faces which only ever appear in solved facePairs.
 */
// const getConstraintIndicesFromFacePairs = (
// 	constraints,
// 	constraintsLookup,
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
// 			.flatMap(facePair => constraintsLookup[type][facePair]);
// 		// filter these constraint indices so that (1) no duplicates and
// 		// (2) only faces which appear in an unknown order (0) are included,
// 		// which is done by consulting constraints[i] and checking all faces
// 		// mentioned in this array, testing if any of them are unknown
// 		constraintIndices[type] = uniqueElements(duplicates)
// 			.filter(i => constraints[type][i]
// 				.map(f => facesWithUnknownOrders[f])
// 				.reduce((a, b) => a || b, false));
// 	});
// 	return constraintIndices;
// };
/**
 * @description Given a current set of modified facePairs keys, (modified
 * since the last time we ran this), get all condition indices that
 * include one or more of these facePairs.
 * @param {Constraints} constraints an object containing all four cases, inside
 * of each is an (very large, typically) array of all constraints as a list of faces.
 * @param {object} constraintsLookup a map which contains, for every
 * taco/tortilla/transitivity case (top level keys), inside each is an object
 * which relates each facePair (key) to an array of indices (value),
 * where each index is an index in the "constraints" array
 * in which **both** of these faces appear.
 * @param {string[]} facePairsSubsetArray an array of facePair string keys.
 * @linkcode Origami ./src/layer/solver2d/propagate.js 134
 */
const getConstraintIndicesFromFacePairs = (
	constraints,
	constraintsLookup,
	facePairsSubsetArray,
) => {
	const constraintIndices = {};
	taco_types.forEach(type => {
		// given the array of modified facePairs since last round, get all
		// the indices in the constraints array in which these facePairs exist.
		// this array will contain duplicates
		const constraintIndicesWithDups = facePairsSubsetArray
			.flatMap(facePair => constraintsLookup[type][facePair]);
		// filter these constraint indices to remove duplicates
		constraintIndices[type] = uniqueElements(constraintIndicesWithDups)
			.filter(i => constraints[type][i]);
	});
	return constraintIndices;
};
/**
 * @description Consult the lookup table for the current layer-orders,
 * check for any implied layer order changes (and check for validity), propagate
 * these implied states, check these updated conditions for new implications, repeat.
 * @param {Constraints} constraints an object containing all four cases, inside
 * of each is an (very large, typically) array of all constraints as a list of faces.
 * @param {object} a map which contains, for every taco/tortilla/transitivity case
 * (top level keys), inside each is an object which relates each facePair (key) to
 * an array of indices (value), where each index is an index in the "constraints"
 * array in which **both** of these faces appear.
 * @param {string[]} initiallyModifiedFacePairs an array of facePair string keys.
 * These are the keys which had a layer change since the last time running this method.
 * @param {...object} ...orders any number of facePairsOrder solutions
 * which relate facePairs (key) like "3 5" to an order, either 0, 1, or 2.
 * @linkcode Origami ./src/layer/solver2d/propagate.js 168
 */
const propagate = (
	constraints,
	constraintsLookup,
	initiallyModifiedFacePairs,
	...orders
) => {
	// "modifiedFacePairs" is an array of facePair strings, as we make updates and
	// apply changes and repeat, this will hold all changed facePair keys.
	// the moment this array is empty, we have finished propagating all changes.
	let modifiedFacePairs = initiallyModifiedFacePairs;
	// this is the result which will be returned, it maps facePairs (keys)
	// to layer orders, either 1 or 2 (values) and contains only those facePairs
	// which were changed by this method, so it will never contain a 0 value condition.
	const newOrders = {};
	do {
		// using the facePairs which were modified in the last loop,
		// get all constraint indices which involve any of the individual faces
		// from any of these facePairs.
		const modifiedConstraintIndices = getConstraintIndicesFromFacePairs(
			constraints,
			constraintsLookup,
			modifiedFacePairs,
		);
		// todo: do you get better results by fast forwarding through all taco-taco
		// newOrders (or transitivity, or any one in particular), before then
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
					newOrders,
				);
				if (lookupResult === true) { continue; }
				if (lookupResult === false) {
					// consider throwing an error, we can convey descriptive information
					// about which faces are causing a problem
					console.warn("invalid state found", type, constraints[type][indices[i]]);
					return false;
				}
				if (newOrders[lookupResult[0]]) {
					// rule already exists. make sure the results match
					if (newOrders[lookupResult[0]] !== lookupResult[1]) {
						console.warn("order conflict", type, constraints[type][indices[i]]);
						return false;
					}
				} else {
					const [key, value] = lookupResult;
					roundModificationsFacePairs[key] = true;
					newOrders[lookupResult[0]] = value;
				}
			}
		}
		modifiedFacePairs = Object.keys(roundModificationsFacePairs);
		// console.log("modifiedConstraintIndices", modifiedConstraintIndices);
		// console.log("roundModificationsFacePairs", roundModificationsFacePairs);
		// console.log("newOrders", newOrders);
		// console.log("modifiedFacePairs", modifiedFacePairs.length, modifiedFacePairs);
	} while (modifiedFacePairs.length);
	return newOrders;
};

export default propagate;
