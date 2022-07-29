/**
 * Rabbit Ear (c) Kraft
 */
import {
	constraintToFacePairsStrings,
} from "./general";
/**
 * @param {string[]} remainingKeys array of facePair keys which are unsolved
 * @linkcode Origami ./src/layer/globalSolver/getBranches.js 9
 */
const getBranches = (remainingKeys, constraints, constraintsLookup) => {
	const taco_types = Object.keys(constraints);
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
			// collect all neighbors into one hash to remove duplicates.
			const neighborsHash = {};
			// visit each taco/tortilla/transitivity type, and inside each type,
			// visit all constraints, store the constraints in the neighborsHash.
			taco_types.forEach(type => {
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
			// get all neighbors from the hash, filtering out facePairs
			// which were already visited any time in this method ("keys"),
			// and already visited and included inside this stack ("stackHash")
			const neighbors = Object.keys(neighborsHash)
				.filter(facePair => keys[facePair])
				.filter(facePair => !stackHash[facePair]);
			// add these facePairs to the stack (and hash) to be visited next loop.
			stack.push(...neighbors);
			neighbors.forEach(facePair => { stackHash[facePair] = true; });
		} while (stack.length);
		i += 1;
		groups.push(group);
	}
	return groups;
};

export default getBranches;
