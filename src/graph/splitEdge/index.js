/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/constant.js";
import {
	distance,
	midpoint,
} from "../../math/vector.js";
import remove from "../remove.js";
import {
	update_vertices_vertices,
	update_vertices_edges,
	update_vertices_faces,
	update_vertices_sectors,
	update_edges_faces,
	update_faces_vertices,
	update_faces_edges_with_vertices,
	// update_faces_edges,
} from "./update.js";
/**
 * @description Given an edge, uncover the adjacent faces.
 * @param {FOLD} graph a FOLD graph
 * @param {number} edge index of the edge in the graph
 * {number[]} indices of the two vertices making up the edge
 * @returns {number[]} array of 0, 1, or 2 numbers, the edge's adjacent faces
 * @linkcode Origami ./src/graph/find.js 10
 */
const findAdjacentFacesToEdge = ({
	vertices_faces, edges_vertices, edges_faces, faces_edges, faces_vertices,
}, edge) => {
	// easiest case, if edges_faces already exists.
	if (edges_faces && edges_faces[edge]) {
		return edges_faces[edge];
	}
	// if that doesn't exist, uncover the data by looking at our incident
	// vertices' faces, compare every index against every index, looking
	// for 2 indices that are present in both arrays. there should be 2.
	const vertices = edges_vertices[edge];
	if (vertices_faces !== undefined) {
		const faces = [];
		for (let i = 0; i < vertices_faces[vertices[0]].length; i += 1) {
			for (let j = 0; j < vertices_faces[vertices[1]].length; j += 1) {
				if (vertices_faces[vertices[0]][i] === vertices_faces[vertices[1]][j]) {
					// todo: now allowing undefined to be in vertices_faces,
					// but, do we want to exclude them from the result?
					if (vertices_faces[vertices[0]][i] === undefined) { continue; }
					faces.push(vertices_faces[vertices[0]][i]);
				}
			}
		}
		return faces;
	}
	if (faces_edges) {
		const faces = [];
		for (let i = 0; i < faces_edges.length; i += 1) {
			for (let e = 0; e < faces_edges[i].length; e += 1) {
				if (faces_edges[i][e] === edge) { faces.push(i); }
			}
		}
		return faces;
	}
	if (faces_vertices) {
		console.warn("todo: findAdjacentFacesToEdge");
		// let faces = [];
		// for (let i = 0; i < faces_vertices.length; i += 1) {
		//   for (let v = 0; v < faces_vertices[i].length; v += 1) {
		//   }
		// }
	}
};
/**
 * @description Given a face, uncover the adjacent faces.
 * @param {FOLD} graph a FOLD graph
 * @param {number} face index of the face in the graph
 * @returns {number[]} array the face's adjacent faces
 * @linkcode Origami ./src/graph/find.js 60
 */
// export const findAdjacentFacesToFace = ({
// 	vertices_faces, edges_faces, faces_edges, faces_vertices, faces_faces,
// }, face) => {
// 	if (faces_faces && faces_faces[face]) {
// 		return faces_faces[face];
// 	}
// 	console.warn("todo: findAdjacentFacesToFace");
// };
/**
 * @description this does not modify the graph. it builds 2 objects with:
 * { edges_vertices, edges_assignment, edges_foldAngle }
 * including external to the spec: { edges_length, edges_vector }
 * this does not rebuild edges_edges.
 * @param {object} graph a FOLD object, modified in place
 * @param {number} edge_index the index of the edge that will be split by the new vertex
 * @param {number} new_vertex the index of the new vertex
 * @returns {object[]} array of two edge objects, containing edge data as FOLD keys
 */
const splitEdgeIntoTwo = (graph, edge_index, new_vertex) => {
	const edge_vertices = graph.edges_vertices[edge_index];
	const new_edges = [
		{ edges_vertices: [edge_vertices[0], new_vertex] },
		{ edges_vertices: [new_vertex, edge_vertices[1]] },
	];
	new_edges.forEach(edge => ["edges_assignment", "edges_foldAngle"]
		.filter(key => graph[key] && graph[key][edge_index] !== undefined)
		.forEach(key => { edge[key] = graph[key][edge_index]; }));
	return new_edges;
};
/**
 * @description split an edge with a new vertex, replacing the old
 * edge with two new edges sharing the common vertex. rebuilding:
 * - vertices_coords, vertices_vertices, vertices_edges, vertices_faces,
 * - edges_vertices, edges_faces, edges_assignment,
 * - edges_foldAngle, edges_vector
 * - faces_vertices, faces_edges,
 * without rebuilding:
 * - faces_faces
 * todo: edgeOrders
 * @usage requires edges_vertices to be defined
 * @param {object} graph FOLD object, modified in place
 * @param {number} old_edge index of old edge to be split
 * @param {number[]} coords coordinates of the new vertex to be added. optional.
 * if omitted, a vertex will be generated at the edge's midpoint.
 * @param {number} [epsilon=1e-6] if an incident vertex is within this distance
 * the function will not split the edge, simply return this vertex.
 * @returns {object} a summary of the changes with keys "vertex", "edges"
 * "vertex" is the index of the new vertex (or old index, if similar)
 * "edge" is a summary of changes to edges, with "map" and "remove"
 * @linkcode Origami ./src/graph/splitEdge/index.js 63
 */
const splitEdge = (graph, old_edge, coords, epsilon = EPSILON) => {
	// make sure old_edge is a valid index
	if (graph.edges_vertices.length < old_edge) { return {}; }
	const incident_vertices = graph.edges_vertices[old_edge];
	if (!coords) {
		coords = midpoint(...incident_vertices.map(v => graph.vertices_coords[v]));
	}
	// test similarity with the incident vertices, if similar, return.
	const similar = incident_vertices
		.map(v => graph.vertices_coords[v])
		.map(vert => distance(vert, coords) < epsilon);
	if (similar[0]) { return { vertex: incident_vertices[0], edges: {} }; }
	if (similar[1]) { return { vertex: incident_vertices[1], edges: {} }; }
	// the new vertex will sit at the end of the array
	const vertex = graph.vertices_coords.length;
	graph.vertices_coords[vertex] = coords;
	// indices of new edges
	const new_edges = [0, 1].map(i => i + graph.edges_vertices.length);
	// create 2 new edges, add them to the graph
	splitEdgeIntoTwo(graph, old_edge, vertex)
		.forEach((edge, i) => Object.keys(edge)
			.forEach((key) => { graph[key][new_edges[i]] = edge[key]; }));
	// done with: vertices_coords, edges_vertices, edges_assignment, edges_foldAngle
	update_vertices_vertices(graph, vertex, incident_vertices);
	update_vertices_sectors(graph, vertex); // after vertices_vertices
	update_vertices_edges(graph, old_edge, vertex, incident_vertices, new_edges);
	// done with: vertices_edges, vertices_vertices, and
	// vertices_sectors if it exists.
	const incident_faces = findAdjacentFacesToEdge(graph, old_edge);
	if (incident_faces) {
		update_vertices_faces(graph, vertex, incident_faces);
		update_edges_faces(graph, new_edges, incident_faces);
		update_faces_vertices(graph, vertex, incident_vertices, incident_faces);
		update_faces_edges_with_vertices(graph, incident_faces);
		// update_faces_edges(graph, old_edge, vertex, new_edges, incident_faces);
	}
	// done with: vertices_faces, edges_faces, faces_vertices, faces_edges
	// and we don't need to bother with faces_faces and faceOrders.
	// todo: edgeOrders. the only spec key remaining.
	// remove old data
	const edge_map = remove(graph, "edges", [old_edge]);
	// shift our new edge indices since these relate to the graph before remove().
	new_edges.forEach((_, i) => { new_edges[i] = edge_map[new_edges[i]]; });
	// we had to run "remove" with the new edges added. to return the change info,
	// we need to adjust the map to exclude these edges.
	edge_map.splice(-2);
	// replace the "undefined" in the map with the two new edge indices.
	edge_map[old_edge] = new_edges;
	return {
		vertex,
		edges: {
			map: edge_map,
			new: new_edges,
			remove: old_edge,
		},
	};
};

export default splitEdge;
