/**
 * Rabbit Ear (c) Kraft
 */
import { assignmentIsBoundary } from "../../fold/spec.js";
import { uniqueElements } from "../../general/array.js";
import { invertFlatToArrayMap } from "../maps.js";
import { makeVerticesEdgesUnsorted } from "../make/verticesEdges.js";
import { makeVerticesVerticesUnsorted } from "../make/verticesVertices.js";
import { makeVerticesToEdge } from "../make/lookup.js";
import { connectedComponents } from "../connectedComponents.js";

/**
 * @description A vertex is a boundary vertex if it is a member of a boundary
 * edge, as defined by edges_assignment. If edges_assignment is not present,
 * or does not contain boundary edges, this will return an empty array.
 * If you need *sorted* vertices, use the boundary() or boundaries() method.
 * @param {FOLD} graph a FOLD object
 * @returns {number[]} unsorted list of vertex indices which lie along the boundary.
 */
export const boundaryVertices = ({ edges_vertices, edges_assignment = [] }) =>
	uniqueElements(
		edges_vertices.filter((_, i) => assignmentIsBoundary[edges_assignment[i]]).flat(),
	);

/**
 * @description return value for "boundary" method.
 */
const emptyBoundaryObject = () => ({ vertices: [], edges: [] });

/**
 * @description Use this method if edges are already marked with a "boundary"
 * assignment, and this will get the boundary of a FOLD graph in terms of
 * both vertices and edges. Use this method when you know there is only one
 * connected boundary in the graph. If there are more than one,
 * use the "boundaries" method.
 * @param {FOLD} graph a FOLD object
 * @returns {{
 *   vertices: number[],
 *   edges: number[],
 * }} with "vertices" and "edges", each arrays of indices.
 */
export const boundary = ({ vertices_edges, edges_vertices, edges_assignment }) => {
	if (!edges_assignment || !edges_vertices) {
		return emptyBoundaryObject();
	}
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	// true or false if an edge is a boundary edge, additionally,
	// turn a true into a false once we use the edge
	const edgesBoundary = edges_assignment.map((a) => a === "B" || a === "b");

	// inverse of "edgesBoundary", every time we visit a vertex, mark it true.
	const usedVertices = {};

	// the resulting boundary is stored in these two arrays
	const vertices = [];
	const edges = [];

	// get the first available edge index that is a boundary
	let edgeIndex = edgesBoundary
		.map((isBoundary, e) => (isBoundary ? e : undefined))
		.filter((a) => a !== undefined)
		.shift();
	if (edgeIndex === undefined) {
		return emptyBoundaryObject();
	}

	// add the first edge and remove it from the available edge list
	edgesBoundary[edgeIndex] = false;
	edges.push(edgeIndex);

	// add the edge's first vertex to the result, mark it used, set the second
	// vertex to the "nextVertex" which we will use to walk around the boundary
	vertices.push(edges_vertices[edgeIndex][0]);
	usedVertices[edges_vertices[edgeIndex][0]] = true;
	let nextVertex = edges_vertices[edgeIndex][1];

	// loop as long as "nextVertex" is not in the used vertices list.
	while (!usedVertices[nextVertex]) {
		// add nextVertex to our solutions list, mark it as used
		vertices.push(nextVertex);
		usedVertices[nextVertex] = true;

		// find the next edge index by consulting the nextVertex's adjacent edges,
		// filtering out the first one that has not yet been visited.
		edgeIndex = vertices_edges[nextVertex].filter((v) => edgesBoundary[v]).shift();

		// the boundary is not a nice, neat cycle.
		if (edgeIndex === undefined) {
			return emptyBoundaryObject();
		}

		// advance nextVertex, look at our current edge and select the
		// other vertex that isn't the current "nextVertex".
		if (edges_vertices[edgeIndex][0] === nextVertex) {
			[, nextVertex] = edges_vertices[edgeIndex];
		} else {
			[nextVertex] = edges_vertices[edgeIndex];
		}

		// add the next edge to our solution, mark it as used
		edges.push(edgeIndex);
		edgesBoundary[edgeIndex] = false;
	}
	return { vertices, edges };
};

/**
 * @description Use this method if edges are already marked with a "boundary"
 * assignment, and this will get the boundaries of a FOLD graph in terms of
 * both vertices and edges. This method will safely find all boundaries,
 * in case of a graph that has two disjoint sets.
 * @param {FOLD} graph a FOLD object
 * @returns {{
 *   vertices: number[],
 *   edges: number[],
 * }[]} an array of boundary solutions, where each boundary
 * is an object with "vertices" and "edges", each arrays of indices.
 */
export const boundaries = ({ vertices_edges, edges_vertices, edges_assignment }) => {
	if (!edges_assignment || !edges_vertices) {
		return [emptyBoundaryObject()];
	}
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}

	// create a copy of edges_vertices that only contains boundary edges, this
	// array will have holes, no indices change they will match the input graph.
	const edges_verticesBoundary = [...edges_vertices];

	// delete the non-boundary edges
	edges_assignment
		.map((a) => a === "B" || a === "b")
		.map((isBoundary, e) => (!isBoundary ? e : undefined))
		.filter((e) => e !== undefined)
		.forEach((e) => delete edges_verticesBoundary[e]);

	// a copy of vertices_edges, but only includes boundary edges
	const vertices_edgesBoundary = makeVerticesEdgesUnsorted({
		edges_vertices: edges_verticesBoundary,
	});

	// an adjacent vertices_vertices list, but only include boundary vertices
	const verticesVertices = makeVerticesVerticesUnsorted({
		vertices_edges: vertices_edgesBoundary,
		edges_vertices: edges_verticesBoundary,
	});

	// using the boundary-only vertices_vertices, make a connected components,
	// each vertex (index) will contain a group number that it is a part of (value)
	const connectedVertices = connectedComponents(verticesVertices);

	// using the connected components, create a list of groups where, each group
	// is a list of vertices, then, for each group, take just one vertex.
	const groupsVertex = invertFlatToArrayMap(connectedVertices).map(
		(vertices) => vertices[0],
	);

	// given a start vertex and the list of verticesVertices, walk through
	// the adjacent vertex list, modifying the verticesVertices object as we go
	// by removing visited vertices, until we reach a verticesVertices with no
	// available vertices to travel to. return the list of vertices walked.
	const walkVerticesVertices = (startVertex) => {
		let prevVertex;
		let currVertex = startVertex;
		let nextVertex;
		const result = [];
		const filterFunc = (v) => v !== prevVertex;
		while (true) {
			// in an ideal situation, the current verticesVertices array will have
			// the vertex from which we just came, and the one to head to next.
			// remove the vertex from which we just came, and set the next vertex.
			verticesVertices[currVertex] = verticesVertices[currVertex].filter(filterFunc);
			nextVertex = verticesVertices[currVertex].shift();

			// if the array was empty, there is nowhere else to go. we're done.
			if (nextVertex === undefined) {
				return result;
			}

			// add the current vertex to the result list, then increment the walk.
			result.push(currVertex);
			prevVertex = currVertex;
			currVertex = nextVertex;
		}
	};

	// for each group of connected vertices, using the first vertex from
	// the group, walk the connected vertices and get back a list of vertices.
	const boundariesVertices = groupsVertex.map((vertex) => walkVerticesVertices(vertex));

	// backwards lookup, which edge is made of a pair of vertices.
	// we only need to use the boundary edges, should be a little faster.
	const edgeMap = makeVerticesToEdge({
		edges_vertices: edges_verticesBoundary,
	});

	// group vertices into pairs, find the edge that connects each pair.
	const boundariesEdges = boundariesVertices.map((vertices) =>
		vertices
			.map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
			.map((pair) => edgeMap[pair.join(" ")]),
	);

	return boundariesVertices.map((vertices, i) => ({
		vertices,
		edges: boundariesEdges[i],
	}));
};

/**
 * @description Get a FOLD object's boundary as a list of points. Use this
 * method in the case where there might be more than one boundary cycle.
 * @param {FOLD} graph a FOLD object
 * @returns {([number, number]|[number, number, number])[][]} array of polygons
 */
export const boundaryPolygons = ({
	vertices_coords,
	vertices_edges,
	edges_vertices,
	edges_assignment,
}) =>
	boundaries({ vertices_edges, edges_vertices, edges_assignment }).map(({ vertices }) =>
		vertices.map((v) => vertices_coords[v]),
	);

/**
 * @description Get a FOLD object's boundary as a list of points. Use this
 * method if you are certain that there is only one boundary.
 * @param {FOLD} graph a FOLD object
 * @returns {([number, number]|[number, number, number])[]} a polygon
 */
export const boundaryPolygon = ({
	vertices_coords,
	vertices_edges,
	edges_vertices,
	edges_assignment,
}) =>
	boundary({ vertices_edges, edges_vertices, edges_assignment }).vertices.map(
		(v) => vertices_coords[v],
	);

