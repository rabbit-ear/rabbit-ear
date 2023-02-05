/**
 * Rabbit Ear (c) Kraft
 */
import math from "../../math.js";
import remove from "../remove.js";
import { findAdjacentFacesToEdge } from "../find.js";
import * as S from "../../general/strings.js";
import splitEdgeIntoTwo from "./splitEdgeIntoTwo.js";
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
 * @linkcode Origami ./src/graph/splitEdge/index.js 39
 */
const splitEdge = (graph, old_edge, coords, epsilon = math.core.EPSILON) => {
	// make sure old_edge is a valid index
	if (graph.edges_vertices.length < old_edge) { return {}; }
	const incident_vertices = graph.edges_vertices[old_edge];
	if (!coords) {
		coords = math.core.midpoint(...incident_vertices);
	}
	// test similarity with the incident vertices, if similar, return.
	const similar = incident_vertices
		.map(v => graph.vertices_coords[v])
		.map(vert => math.core.distance(vert, coords) < epsilon);
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
	const edge_map = remove(graph, S._edges, [old_edge]);
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
