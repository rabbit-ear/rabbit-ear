/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../math/constant.js";
import {
	epsilonEqual,
} from "../math/compare.js";
import {
	dot2,
	subtract2,
	resize2,
} from "../math/vector.js";
import {
	uniqueElements,
} from "../general/array.js";
import {
	clusterSortedGeneric,
} from "../general/cluster.js";
import {
	invertFlatToArrayMap,
	invertArrayMap,
} from "./maps.js";
import {
	getEdgesLine,
} from "./edges/lines.js";
import {
	makeVerticesEdgesUnsorted,
} from "./make/verticesEdges.js";

/**
 * @param {number[][][]} lines_verticesClusters
 * @returns {number[]} a nextmap for each vertex
 */
const lineVertexClustersToNewVertices = (lines_verticesClusters) => {
	const nextMap = [];
	let newIndex = 0;
	lines_verticesClusters
		.map(clusters => clusters
			.map(cluster => {
				const match = cluster.map(v => nextMap[v]).shift();
				const matchFound = match !== undefined;
				const index = matchFound ? match : newIndex;
				cluster.forEach(v => { nextMap[v] = index; })
				return matchFound ? match : newIndex++;
			}));
	return nextMap;
};

/**
 * @param {number[][][]} lines_edgesClusters
 */
const lineEdgeClustersToNewEdges = (lines_edgesClusters) => {
	const map = [];
	let newIndex = 0;
	lines_edgesClusters
		.map(clusters => clusters
			.map(cluster => {
				cluster
					.filter(i => map[i] === undefined)
					.forEach(i => { map[i] = []; });
				cluster.forEach(i => map[i].push(newIndex));
				return newIndex++;
			}));
	return map;
};

/**
 * @description When more than one overlapping edge is going to be merged
 * into one, we need to know which assignment to carry over. This is a
 * subjective ranking of which assignment should win out (lower is better).
 * The logic goes like this:
 * - boundary is most important and similarly are cut lines.
 * - valley and mountain come before anything remaining.
 * - join and flat, it's unclear which should come first, to be honest.
 * - unassigned should be last. it is the absense of information. everything
 *   should be able to override unassigned.
 */
const assignmentPriority = { B: 1, C: 2, V: 3, M: 4, J: 5, F: 6, U: 7 };
Object.keys(assignmentPriority).forEach(key => {
	assignmentPriority[key.toLowerCase()] = assignmentPriority[key];
});

/**
 * @description Given a list of assignments of overlapping edges, competing
 * to be the assignment which "wins out", return the index in the array
 * which has the best priority value, according to the priority lookup.
 * @param {string[]} assignments a list of edges_assignments
 * @returns {number} the index of the input array with the highest priority
 */
const highestPriorityAssignmentIndex = (assignments) => {
	if (assignments.length === 1) { return 0; }
	let index = 0;
	assignments.forEach((a, i) => {
		if (assignmentPriority[a] < assignmentPriority[assignments[index]]) {
			index = i;
		}
	});
	return index;
}

/**
 * @description Make one step to planarize a graph into the 2D XY plane
 * by fixing all instances of two collinear edges overlapping. This does not
 * resolve edges crossing edges, or multiple vertices overlapping at the same
 * coordinate. Call "planarize" instead for the complete method.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {{ graph: FOLD, info: object }} a new FOLD object, with
 * an info object which describes all changes to the graph.
 */
export const planarizeCollinearEdges = ({
	vertices_coords,
	vertices_edges,
	edges_vertices,
	edges_assignment,
	edges_foldAngle,
}, epsilon = EPSILON) => {
	const {
		lines,
		edges_line,
	} = getEdgesLine({ vertices_coords, edges_vertices }, epsilon);

	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}

	// one to many mapping of a line and the edges along it.
	const lines_edges = invertFlatToArrayMap(edges_line);

	const lines_verticesInfo = lines_edges
		.map(edges => uniqueElements(edges.flatMap(edge => edges_vertices[edge])))
		.map((vertices, l) => vertices
			.map(v => ({
				v,
				p: dot2(subtract2(vertices_coords[v], lines[l].origin), lines[l].vector),
			})).sort((a, b) => a.p - b.p));

	const lines_vertices = lines_verticesInfo
		.map(objs => objs.map(({ v }) => v));
	const lines_verticesParameter = lines_verticesInfo
		.map(objs => objs.map(({ p }) => p));

	const lines_verticesClusters = lines_verticesParameter
		.map((params, l) => clusterSortedGeneric(params, epsilonEqual)
			.map(cluster => cluster.map(i => lines_vertices[l][i])));

	const vertexNextMap = lineVertexClustersToNewVertices(lines_verticesClusters);
	const vertexBackMap = invertFlatToArrayMap(vertexNextMap);

	// [ [ 12, 28 ], [ 29 ], [ 13 ] ]
	// a graph with circular edges will break here.
	const lines_edgesClusters = lines_verticesClusters
		.map((verticesClusters, l) => {
			// this lookup contains all edges which lie along this line
			const edgesLookup = {};
			lines_edges[l].forEach(e => { edgesLookup[e] = true; });
			// push edges onto the stack and pop them off.
			/** @type {Set<number>} */
			const edges = new Set();
			// fencepost between the clusters of vertices to make new edges
			return Array
				.from(Array(verticesClusters.length - 1))
				.map((_, i) => verticesClusters[i])
				.map(vertices => {
					// we want to return a list of all edges which are currently on the stack.
					// these are edges which either start or end at this point along the line.
					const adjacentEdges = uniqueElements(vertices
						.flatMap(vertex => vertices_edges[vertex])
						// only edges which are along this line are allowed
						.filter(edge => edgesLookup[edge]));
					// true: if the edge is not already on the stack, false if it is.
					const adjacentEdgesIsNew = adjacentEdges.map(e => !edges.has(e));
					// const edgesEnding = adjacentEdges.filter(e => edges.has(e));
					// const newEdges = adjacentEdges.filter(e => !edges.has(e));
					adjacentEdges.forEach((edge, i) => (adjacentEdgesIsNew[i]
						? edges.add(edge)
						: edges.delete(edge)));
					return Array.from(edges);
				});
		});

	/** @type {[number, number][]} */
	const newEdgesVertices = lines_verticesClusters
		.map(clusters => clusters.map(cluster => vertexNextMap[cluster[0]]))
		.flatMap(vertices => Array
			.from(Array(vertices.length - 1))
			.map((_, i) => [vertices[i], vertices[i + 1]]))
		.map(([a, b]) => [a, b]);

	const edgesNextMap = lineEdgeClustersToNewEdges(lines_edgesClusters);

	const newVerticesCoords = vertexBackMap
		.map(vertices => vertices_coords[vertices[0]])
		.map(resize2);

	const graph = {
		vertices_coords: newVerticesCoords,
		edges_vertices: newEdgesVertices,
	};

	if (edges_assignment || edges_foldAngle) {
		const edgesBackMap = invertArrayMap(edgesNextMap);
		// for the trivial cases (new edge maps to one old edge) simply carry over
		// the previous assignment and fold angle (index 0 in backmap inner array).
		// any other time, when a new edge comes from more than one previous edge,
		// we have to choose which assignment "wins out". This list contains,
		// for every edge, the index in the backmap (0, 1, 2...) of the edge which
		// "wins out", use this edge to carry over assignment/foldAngle if exists.
		const edgesBackMapIndexToUse = edges_assignment
			? edgesBackMap
				.map(edges => edges.map(edge => edges_assignment[edge]))
				.map(highestPriorityAssignmentIndex)
			: edgesBackMap.map(() => 0);
		if (edges_assignment) {
			graph.edges_assignment = edgesBackMapIndexToUse
				.map((index, i) => edges_assignment[edgesBackMap[i][index]]);
		}
		if (edges_foldAngle) {
			graph.edges_foldAngle = edgesBackMapIndexToUse
				.map((index, i) => edges_foldAngle[edgesBackMap[i][index]]);
		}
	}

	const info = {
		vertices: { map: vertexNextMap },
		edges: { map: edgesNextMap },
	};

	return { graph, info };
};
