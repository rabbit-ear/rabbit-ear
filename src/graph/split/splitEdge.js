/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../../math/constant.js";
import {
	distance,
	midpoint,
} from "../../math/vector.js";
import {
	makeVerticesToEdgeBidirectional,
} from "../make.js";
import {
	findAdjacentFacesToEdge,
} from "./general.js";
import remove from "../remove.js";

/**
 * @description an edge was just split into two by the addition of a vertex.
 * update new vertex's vertices_vertices, as well as the split edge's
 * endpoint's vertices_vertices to include the new vertex in place of the
 * old endpoints, preserving all other vertices_vertices of the endpoints.
 * @param {object} graph a FOLD object, modified in place
 * @param {number} vertex index of new vertex
 * @param {number[]} incident_vertices vertices that make up the split edge.
 * the new vertex lies between.
 */
const updateVerticesVertices = (
	{ vertices_vertices },
	vertex,
	incidentVertices,
) => {
	if (!vertices_vertices) { return; }
	// create a new entry for this new vertex
	// only 2 vertices, no need to worry about winding order.
	vertices_vertices[vertex] = [...incidentVertices];

	// update the incident vertices' existing entries in vertices_vertices.
	incidentVertices.forEach((v, i, arr) => {
		// for each of the incident vertices entries in vertices_vertices, find the
		// index of the other incident vertex, and substitute it for our new vertex
		const otherIncidentVertex = arr[(i + 1) % arr.length];
		const index = vertices_vertices[v].indexOf(otherIncidentVertex);
		vertices_vertices[v][index] = vertex;
	});
};

/**
 * @description An edge was just split into two by the addition of a vertex.
 * Update vertices_edges for the new vertex, as well as the split edge's
 * endpoint's vertices_edges to include the two new edges in place of the
 * old one while preserving all other vertices_vertices in each endpoint.
 * @param {object} graph a FOLD object, modified in place
 * @param {number} old_edge the index of the old edge
 * @param {number} new_vertex the index of the new vertex splitting the edge
 * @param {number[]} vertices the old edge's two vertices,
 * must be aligned with "newEdges"
 * @param {number[]} newEdges the two new edges, must be aligned with "vertices"
 */
const updateVerticesEdges = ({
	vertices_edges,
}, oldEdge, newVertex, vertices, newEdges) => {
	if (!vertices_edges) { return; }
	// update 1 vertex, our new vertex
	vertices_edges[newVertex] = [...newEdges];
	// update the two vertices, our new vertex replaces the alternate
	// vertex in each of their arrays.  0-------x-------0
	vertices
		.map(v => vertices_edges[v].indexOf(oldEdge))
		.forEach((index, i) => {
			vertices_edges[vertices[i]][index] = newEdges[i];
		});
};

/**
 * @description a new vertex was added between two faces, update the
 * vertices_faces with the already-known faces indices.
 * @param {object} graph a FOLD object, modified in place
 * @param {number} vertex the index of the new vertex
 * @param {number[]} faces array of 0, 1, or 2 incident faces.
 */
const updateVerticesFaces = ({ vertices_faces }, vertex, faces) => {
	if (!vertices_faces) { return; }
	vertices_faces[vertex] = [...faces];
};

/**
 * @description a new vertex was added between two faces, update the
 * edges_faces with the already-known faces indices.
 * @param {object} graph a FOLD object, modified in place
 * @param {number[]} new_edges array of 2 new edges
 * @param {number[]} faces array of 0, 1, or 2 incident faces.
 */
const updateEdgesFaces = ({ edges_faces }, new_edges, faces) => {
	if (!edges_faces) { return; }
	new_edges.forEach(edge => { edges_faces[edge] = [...faces]; });
};

/**
 * @description a new vertex was added, splitting an edge. rebuild the
 * two incident faces by replacing the old edge with new one.
 * @param {object} graph a FOLD object, modified in place
 * @param {number[]} new_vertex indices of two faces to be rebuilt
 * @param {number} incident_vertices new vertex index
 * @param {number[]} faces the two vertices of the old edge
 */
const updateFacesVertices = ({ faces_vertices }, new_vertex, incident_vertices, faces) => {
	// exit if we don't even have faces_vertices
	if (!faces_vertices) { return; }
	faces
		.map(i => faces_vertices[i])
		.forEach(face => face
			.map((fv, i, arr) => {
				const nextI = (i + 1) % arr.length;
				return (fv === incident_vertices[0]
								&& arr[nextI] === incident_vertices[1])
								|| (fv === incident_vertices[1]
								&& arr[nextI] === incident_vertices[0])
					? nextI : undefined;
			}).filter(el => el !== undefined)
			.sort((a, b) => b - a)
			.forEach(i => face.splice(i, 0, new_vertex)));
};

/**
 * @description 
 */
const updateFacesEdgesWithVertices = ({
	edges_vertices, faces_vertices, faces_edges,
}, faces) => {
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	faces
		.map(f => faces_vertices[f]
			.map((vertex, i, arr) => [vertex, arr[(i + 1) % arr.length]])
			.map(pair => edge_map[pair.join(" ")]))
		.forEach((edges, i) => { faces_edges[faces[i]] = edges; });
};

/**
 * @description this does not modify the graph. it builds 2 objects with:
 * { edges_vertices, edges_assignment, edges_foldAngle }
 * @param {object} graph a FOLD object, modified in place
 * @param {number} edgeIndex the index of the edge that will be split by the new vertex
 * @param {number} newVertex the index of the new vertex
 * @returns {object[]} array of two edge objects, containing edge data as FOLD keys
 */
const makeNewEdgesFields = (graph, edgeIndex, newVertex) => {
	const edge_vertices = graph.edges_vertices[edgeIndex];
	const new_edges = [
		{ edges_vertices: [edge_vertices[0], newVertex] },
		{ edges_vertices: [newVertex, edge_vertices[1]] },
	];
	new_edges.forEach(edgeDef => ["edges_assignment", "edges_foldAngle"]
		.filter(key => graph[key] && graph[key][edgeIndex] !== undefined)
		.forEach(key => { edgeDef[key] = graph[key][edgeIndex]; }));
	return new_edges;
};

/**
 * @description Split an edge with a new vertex, replacing the old
 * edge with two new edges sharing the common vertex, rebuilding:
 * - vertices_coords, vertices_vertices, vertices_edges, vertices_faces,
 * - edges_vertices, edges_faces, edges_assignment, edges_foldAngle
 * - faces_vertices, faces_edges,
 * without needing to rebuild:
 * - faces_faces, faceOrders
 * without rebuilding (todo):
 * - edgeOrders
 * @param {FOLD} graph FOLD object, modified in place
 * @param {number} oldEdge index of old edge to be split
 * @param {number[]} coords coordinates of the new vertex to be added. optional.
 * if omitted, a vertex will be generated at the edge's midpoint.
 * @param {number} [epsilon=1e-6] if an incident vertex is within this distance
 * the function will not split the edge, simply return this vertex.
 * @returns {object} a summary of the changes with keys "vertex", "edges"
 * "vertex" is the index of the new vertex (or old index, if similar)
 * "edge" is a summary of changes to edges, with "map" and "remove"
 * @linkcode
 */
export const splitEdge = (graph, oldEdge, coords, epsilon = EPSILON) => {
	// make sure oldEdge is a valid index
	if (!graph.edges_vertices[oldEdge]) { return {}; }
	const incidentVertices = graph.edges_vertices[oldEdge];

	// if the user did not supply any coordinate parameter, choose the midpoint
	if (!coords) {
		coords = midpoint(...incidentVertices.map(v => graph.vertices_coords[v]));
	}

	// if the desired coordinate is too close to one of the existing endpoints,
	// we don't need to do anything. return the index of the existing vertex.
	const similar = incidentVertices
		.map(v => graph.vertices_coords[v])
		.map(vert => distance(vert, coords) < epsilon);
	if (similar[0]) { return { vertex: incidentVertices[0], edges: {} }; }
	if (similar[1]) { return { vertex: incidentVertices[1], edges: {} }; }

	// the new vertex will be added to the end of the vertices_ arrays.
	const vertex = graph.vertices_coords.length;
	graph.vertices_coords[vertex] = coords;

	// the new edge indices, they will be added to the end of the edges_ arrays.
	const newEdges = [0, 1].map(i => i + graph.edges_vertices.length);

	// create new edge definitions for edges_vertices, assignment, and foldAngle.
	// add these fields to the graph.
	makeNewEdgesFields(graph, oldEdge, vertex)
		.forEach((edge, i) => Object.keys(edge)
			.forEach((key) => { graph[key][newEdges[i]] = edge[key]; }));

	// at this point we are finished with:
	// vertices_coords, edges_vertices, edges_assignment, edges_foldAngle

	// update the relevant vertices arrays
	updateVerticesVertices(graph, vertex, incidentVertices);
	updateVerticesEdges(graph, oldEdge, vertex, incidentVertices, newEdges);

	// we are now done with all vertices_ and edges_ arrays except those which
	// relate to faces: vertices_faces and edges_faces.

	// we don't need to make any new faces, we only need to modify the faces
	// (if they exist) incident to the old edge.
	const incident_faces = findAdjacentFacesToEdge(graph, oldEdge);
	updateVerticesFaces(graph, vertex, incident_faces);
	updateEdgesFaces(graph, newEdges, incident_faces);
	updateFacesVertices(graph, vertex, incidentVertices, incident_faces);
	updateFacesEdgesWithVertices(graph, incident_faces);
	// update_faces_edges(graph, oldEdge, vertex, newEdges, incident_faces);

	// this method never removed the old edge, this way, when we call this
	// method, no matter where the edge was inside the edges_ arrays, all
	// the indices after it will shift up to fill in the hole and this
	// method handles all re-indexing, including inside the _edges arrays.
	const edgeMap = remove(graph, "edges", [oldEdge]);

	// at this point our graph is complete. prepare the changelog info to return

	// shift our new edge indices since these relate to the graph before remove().
	newEdges.forEach((_, i) => { newEdges[i] = edgeMap[newEdges[i]]; });

	// we had to run "remove" with the new edges added, but the edgeMap should
	// relate to the graph before any changes. remove those new edge entries,
	// and set them to be the new edges under the "oldEdge" index.
	edgeMap.splice(-2);
	edgeMap[oldEdge] = newEdges;

	return {
		vertex,
		edges: {
			map: edgeMap,
			new: newEdges,
			remove: oldEdge,
		},
	};
};
