/**
 * Rabbit Ear (c) Kraft
 */
import table from "./table";
// "taco_taco", "taco_tortilla", "tortilla_tortilla", "transitivity"
const taco_types = Object.freeze(Object.keys(table));
/**
 * @description a layer orientation between two faces is encoded as:
 * 0: unknown, 1: face A is above B, 2: face B is above A.
 * this map will flip 1 and 2, leaving 0 to be 0.
 */
const flipFacePairOrder = { 0: 0, 1: 2, 2: 1 };

/**
 * @returns {string[]} but effectively {number[]} where the array is a subset
 * of indices from the nextConstraintIndices parameter. These are the indices
 * of "constraints" array which have a change in them since the last round.
 */
const fillConstraintsFromFacePairsOrder = (
	facePairsOrder,
	constraints,
	constraintsInfo,
	nextConstraintIndices,
) => {
	// todo, get the CHANGED facePairsOrder. changed from last time we updated things.
	// then, this return array "changed" will actually be relevant.
	// this is an object, so we can set the key and prevent duplicates.
	const changed = {};
	const iterators = (nextConstraintIndices || Object.keys(constraints));
	// constraints.forEach((layer, i) => constraintsInfo[i].face_keys
	// each constraint info contains the list of face-pair keys involved
	iterators.forEach(i => constraintsInfo[i].face_keys
		.forEach((key, j) => {
			// this can happen when working on a branch of a soluion, the key is not present.
			if (!(key in facePairsOrder)) { return; }
			// for each face-pair, check if it contains a layer order (1 or 2),
			// and if so, update the constraintsOrder with this order.
			if (facePairsOrder[key] !== 0) {
				// if the pair of faces in the key was flipped, flip the suggestion too
				const orientation = constraintsInfo[i].keys_ordered[j]
					? facePairsOrder[key]
					: flipFacePairOrder[facePairsOrder[key]];
				// now it's possible that this face pair has already been set (not 0).
				// if so, double check that the previously set value is the same as
				// the new one, otherwise the conflict means that this layer
				// arrangement is unsolvable and needs to report the fail all the way
				// back up to the original recursive call.
				if (constraints[i][j] !== 0 && constraints[i][j] !== orientation) {
					throw new Error("fill conflict");
				}
				constraints[i][j] = orientation;
				changed[i] = true;
			}
		}));
	// return changed;
	return Object.keys(changed);
};
/**
 * @description given all the new face-pair orders which have been updated since
 * last round (indices of "modifiedIndices"), iterate through the new changes, gather
 * the lookup_table's suggested next steps, and check that none of the previous changes
 * resulted in an invalid state according to the lookup_table.
 * @param {array} constraints
 * @param {array} constraintsInfo
 * @param {object} lookup_table
 * @param {string[]} but effectively {number[]}, the list of "constraints" indices which
 * were modified since we last ran this function. we only need to visit these.
 */
const getSuggestedFacePairOrders = (
	constraints,
	constraintsInfo,
	lookup_table,
	modifiedIndices,
) => {
	const iterators = (modifiedIndices || Object.keys(constraints));
	return iterators.map(i => {
		const info = constraintsInfo[i];
		const key = constraints[i].join("");
		const next_step = lookup_table[key];
		if (next_step === false) { throw new Error("unsolvable"); }
		if (next_step === true) { return undefined; }
		if (constraints[i][next_step[0]] !== 0 && constraints[i][next_step[0]] !== next_step[1]) {
			throw new Error("infer conflict");
		}
		constraints[i][next_step[0]] = next_step[1];
		// if (constraints[i].indexOf(0) === -1) { delete constraints[i]; }
		// format this next_step change into face-pair-key and above/below value
		// so that it can be added to the facePairsOrder object.
		const condition_key = info.face_keys[next_step[0]];
		const condition_value = info.keys_ordered[next_step[0]]
			? next_step[1]
			: flipFacePairOrder[next_step[1]];
		return [condition_key, condition_value];
	}).filter(a => a !== undefined);
};
/**
 * @description Given a set of facePairs, get the indices in the constraints array
 * which contains an appearance of any one of these facePairs.
 * @returns {object} with 4 keys: taco_taco, taco_tortilla, tortilla_tortilla, transitivity,
 * where each value is {string[]} (but effectively number[], they are indices as strings).
 * These indices are integer string type, but it doesn't matter for our use.
 */
const getConstraintIndicesContainingFacePairs = (facePairs, pairConstraintLookup) => {
	// temporarily store indices as keys in a hash
	const hash = {};
	taco_types.forEach(type => { hash[type] = {}; });
	// for every taco type, iterate through all facePairs.
	taco_types.forEach(taco_type => facePairs
		.forEach(facePair => pairConstraintLookup[taco_type][facePair]
			.forEach(i => { hash[taco_type][i] = true; })));
	// convert hash into an array of indices
	const indices = {};
	taco_types.forEach(type => { indices[type] = Object.keys(hash[type]); });
	return indices;
};
/**
 * @description This method will loop. Given a set of facePairs and their
 * layer order, update the constraints array with all changed facePairs, use the
 * constraints to consult the taco-tortilla lookup_table for any suggested changes,
 * apply the changes to the facePairs layer order, repeat.
 */
const completeSuggestionsLoop = (
	facePairsOrder,
	constraints,
	constraintsInfo,
	pairConstraintLookup,
) => {
	// given the current set of facePairsOrder, complete them as much as possible
	// only adding the determined results certain from the current state.
	let facePairsOrderChanges;
	// each round, the facePair orders are updated, and these altered facePairs are
	// scattered throughout the constraints. gather all of the changed indices here.
	// { taco_taco: [6, 25, 98, 150...], taco_tortilla: [54, 112, ...], ... }
	const nextConstraintsIndices = {};
	do {
		try {
			// for each: taco_taco, taco_tortilla, tortilla_tortilla, transitivity
			const modifiedConstraints = {};
			taco_types.forEach(taco_type => { modifiedConstraints[taco_type] = {}; });
			// for each taco-condition type, fill any unset constraints with the orders
			// in facePairsOrder. return a list of the modified indices in constraints.
			taco_types.forEach(type => {
				modifiedConstraints[type] = fillConstraintsFromFacePairsOrder(
					facePairsOrder,
					constraints[type],
					constraintsInfo[type],
					nextConstraintsIndices[type],
				);
			});
			// for every constraint (only consult the ones changed in this round), consult
			// the lookup_table for any suggestions and format them as arrays of two indices:
			// [face_pair, order], and gather them together without applying the changes.
			// the lookup table will also report valid/invalid states. if invalid, throw an error.
			facePairsOrderChanges = taco_types.flatMap(type => getSuggestedFacePairOrders(
				constraints[type],
				constraintsInfo[type],
				table[type],
				modifiedConstraints[type],
			));
			// update the facePairsOrder with all suggested changes.
			// todo: will it ever happen that an order will be overwritten with a different
			// value? if not, why?
			facePairsOrderChanges.forEach(el => { facePairsOrder[el[0]] = el[1]; });
			// update the nextConstraintsIndices with all the constraints indices containing
			// facePair keys which were changed in this round. to be used next loop.
			Object.apply(nextConstraintsIndices, getConstraintIndicesContainingFacePairs(
				facePairsOrderChanges.map(el => el[0]), // the facePair keys as an array.
				pairConstraintLookup,
			));
		} catch (error) {
			// "false" indicates that the given parameters are faulty, the solver which called
			// this method made an incorrect guess, and this entire solution should be thrown out.
			return false;
		}
		// as long as facePairsOrder was changed, do one more loop, see if there
		// are more layer order suggestions from the lookup_table.
	} while (facePairsOrderChanges.length > 0);
	// all constraints for any modified facePairs layer orders have been checked
	// in the lookup_table and nowhere did we encounter an "invalid" state.
	return true;
};

export default completeSuggestionsLoop;
