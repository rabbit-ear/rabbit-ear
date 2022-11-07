import {
	makeVerticesEdgesUnsorted,
	makeVerticesVerticesUnsorted,
} from "./make";
/**
 * @description Given a list of indices, and a list of pairwise combinations of
 * these indices, these pairs represent edges, separate the set of indices into
 * disjointed graphs. By providing "indices", this allows for isolated vertices.
 * @param {number[][]} edges edges of the graph encoded as as pairs of vertex indices.
 * @returns something. todo.
 * @example to call with faceOrders create a copy of faceOrders and remove
 * the [2] third index for "pairs".
 */
export const getDisjointedVertices = ({ edges_vertices, vertices_edges, vertices_vertices }) => {
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVerticesUnsorted({ vertices_edges, edges_vertices });
	}
	// "indicesHash" will be a dictionary with indices as keys and values:
	// - "true" as the initial state
	// - deleted, once it has been sorted into a group
	const indicesHash = {};
	edges_vertices.forEach(edge => {
		indicesHash[edge[0]] = true;
		indicesHash[edge[1]] = true;
	});
	const indicesArray = Object.keys(indicesHash).map(n => parseInt(n, 10));
	// iterate through all remainingKeys
	let i = 0;
	// the number of groups will grow as needed
	// groupIndex is always groups.length - 1
	const groups = [];
	while (i < indicesArray.length) {
		// begin iterating through all keys in the remaining keys
		// if the key already been visited, move onto the next.
		if (!indicesHash[indicesArray[i]]) { i += 1; continue; }
		// this marks the beginning of a new group.
		const group = [];
		// create a new stack (and stackHash containing duplicate data)
		// beginning with the first unvisited key
		const stack = [indicesArray[i]];
		const stackHash = { [indicesArray[i]]: true };
		do {
			// pop a key off of the stack
			const key = stack.shift();
			// mark the key as "visited" by removing it from "keys"
			delete indicesHash[key];
			// add this key to the current group
			group.push(key);
			// get all neighbors from the hash, filtering out facePairs
			// which were already visited any time in this method ("keys"),
			// and already visited and included inside this stack ("stackHash")
			const neighbors = vertices_vertices[key]
				? vertices_vertices[key].filter(i => indicesHash[i] && !stackHash[i])
				: [];
			// console.log("branch search", key, "connected to", neighborsArray);
			// add these facePairs to the stack (and hash) to be visited next loop.
			stack.push(...neighbors);
			neighbors.forEach(index => { stackHash[index] = true; });
		} while (stack.length);
		i += 1;
		groups.push(group);
	}
	return groups;
};
