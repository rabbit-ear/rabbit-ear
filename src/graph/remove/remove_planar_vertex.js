import remove from "../remove";
import { unique_sorted_integers } from "../../general/arrays";

const get_opposite_vertices = (graph, vertex, edges) => {
	edges.forEach(edge => {
		if (graph.edges_vertices[edge][0] === vertex
			&& graph.edges_vertices[edge][1] === vertex) {
			console.warn("remove_planar_vertex circular edge");
		}
	});
	return edges.map(edge => graph.edges_vertices[edge][0] === vertex
		? graph.edges_vertices[edge][1]
		: graph.edges_vertices[edge][0]);
};

const remove_planar_vertex = (graph, vertex) => {
	const edges = graph.vertices_edges[vertex];
	const faces = unique_sorted_integers(graph.vertices_faces[vertex]
		.filter(a => a != null))
	if (edges.length !== 2 || faces.length > 2) {
		console.warn("cannot remove non 2-degree vertex yet (e,f)", edges, faces);
		return;
	}
	const vertices = get_opposite_vertices(graph, vertex, edges);
	const vertices_reverse = vertices.slice().reverse();
	// sort edges so the smallest index is first
	// edges[0] is the keep edge. edges[1] will be the removed edge.
	edges.sort((a, b) => a - b);
	// vertices_edges
	// replace the index of the removed edge with the keep edge.
	// one of them will already be linked to the keep edge. skip it.
	vertices.forEach(v => {
		const index = graph.vertices_edges[v].indexOf(edges[1]);
		if (index === -1) { return; }
		graph.vertices_edges[v][index] = edges[0];
	});
	// vertices_vertices
	// find the index of the removed vertex,
	// replace it with the opposite vertex.
	vertices.forEach((v, i) => {
		const index = graph.vertices_vertices[v].indexOf(vertex);
		if (index === -1) {
			console.warn("remove_planar_vertex unknown vertex issue");
			return;
		}
		graph.vertices_vertices[v][index] = vertices_reverse[i];
	});
	// edges_vertices
	graph.edges_vertices[edges[0]] = [...vertices];
	// faces_vertices
	faces.forEach(face => {
		const index = graph.faces_vertices[face].indexOf(vertex);
		if (index === -1) {
			console.warn("remove_planar_vertex unknown face_vertex issue");
			return;
		}
		graph.faces_vertices[face].splice(index, 1);
	});
	// faces_edges
	faces.forEach(face => {
		const index = graph.faces_edges[face].indexOf(edges[1]);
		if (index === -1) {
			console.warn("remove_planar_vertex unknown face_edge issue");
			return;
		}
		graph.faces_edges[face].splice(index, 1);
	});
	// no changes to: vertices_faces, edges_faces, faces_faces,
	// edges_assignment/foldAngle
	remove(graph, "vertices", [vertex]);
	remove(graph, "edges", [edges[1]]);
};

export default remove_planar_vertex;
