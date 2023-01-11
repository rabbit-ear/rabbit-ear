/**
 * Rabbit Ear (c) Kraft
 */
import {
	constraintToFacePairsStrings,
} from "./general";
/**
 * @description Given a facePairKey (like "3 39") check the constraints
 * lookup for all taco/tortilla events which this key is involved in.
 * Given this list, we can get all the other faces which are involved
 * in each of these conditions also. Given this second list, make all
 * possible combinations of face pairs (like "3 XX" and "39 XX") with
 * all other faces involved in every taco/tortilla event.
 * Note, this can include face pairs which aren't even being considered
 * in the greater calculation (already computed, for example), but these
 * will be filtered out inside getDisjointSets().
 */
const getNeighborsArray = (key, constraints, constraintsLookup) => {
	// collect all neighbors into one hash to remove duplicates.
	const neighborsHash = {};
	// visit each taco/tortilla/transitivity type, and inside each type,
	// visit all constraints, store the constraints in the neighborsHash.
	Object.keys(constraints).forEach(type => {
		// skip if constraintsLookup for a type/key doesn't exist.
		const indices = constraintsLookup[type][key];
		if (!indices) { return; }
		// for each constraint index, convert it into its 3 or 4 face indices,
		// then convert these into all permutations of face-pair strings.
		indices
			.map(c => constraints[type][c])
			.map(faces => constraintToFacePairsStrings[type](faces)
				// add each facePair to the neighborsHash.
				.forEach(facePair => { neighborsHash[facePair] = true; }));
	});
	return Object.keys(neighborsHash);
};
/**
 * @param {string[]} remainingKeys array of facePair keys which are unsolved
 * @param {any} constraints
 * @param {any} constraintsLookup
 * @param {object} constraintsNeighborsMemo given a face-pair (key),
 * the value is an array of all other face-pairs which are
 * included in some condition (taco/tortilla/trans)
 * in which the face-pair key also appears.
 * @linkcode Origami ./src/layer/solver3d/getDisjointSets.js 45
 */
const getDisjointSets = (
	remainingKeys,
	constraints,
	constraintsLookup,
	constraintsNeighborsMemo = {},
) => {
	// move remainingKeys into a dictionary.
	// we will delete keys from this dictionary as we visit them
	const keys = {};
	remainingKeys.forEach(key => { keys[key] = true; });
	// iterate through all remainingKeys
	let i = 0;
	// the number of groups will grow as needed
	// groupIndex is always groups.length - 1
	const groups = [];
	while (i < remainingKeys.length) {
		// begin iterating through all keys in the remaining keys
		// if the key already been visited, move onto the next.
		if (!keys[remainingKeys[i]]) { i += 1; continue; }
		// this marks the beginning of a new group.
		const group = [];
		// create a new stack (and stackHash containing duplicate data)
		// beginning with the first unvisited key
		const stack = [remainingKeys[i]];
		const stackHash = { [remainingKeys[i]]: true };
		do {
			// pop a key off of the stack
			const key = stack.shift();
			// mark the key as "visited" by removing it from "keys"
			delete keys[key];
			// add this key to the current group
			group.push(key);
			// we are about to loop through all of this key's neighbors
			// if they already exist, use the data from the memo
			const neighborsArray = constraintsNeighborsMemo[key]
				? constraintsNeighborsMemo[key]
				: getNeighborsArray(key, constraints, constraintsLookup);
			// in case there is new data, save it in the memo
			constraintsNeighborsMemo[key] = neighborsArray;
			// get all neighbors from the hash, filtering out facePairs
			// which were already visited any time in this method ("keys"),
			// and already visited and included inside this stack ("stackHash")
			const neighbors = neighborsArray
				.filter(facePair => keys[facePair] && !stackHash[facePair]);
			// console.log("branch search", key, "connected to", neighborsArray);
			// add these facePairs to the stack (and hash) to be visited next loop.
			stack.push(...neighbors);
			neighbors.forEach(facePair => { stackHash[facePair] = true; });
		} while (stack.length);
		i += 1;
		groups.push(group);
	}
	return groups;
};

export default getDisjointSets;
