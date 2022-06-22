/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description this method will remove an edge from a graph and
 * rebuild the adjacent graph data, including rebuilding faces.
 * This rebuilding makes this method differ from the "remove()" method.
 */
import remove from "../remove";
/**
 * @description given two (soon to be) formerly adjacent vertices,
 * remove mention of the other from each's vertices_vertices.
 */
const update_vertices_vertices = ({ vertices_vertices }, vertices) => {
	const other = [vertices[1], vertices[0]];
	vertices
		.map((v, i) => vertices_vertices[v].indexOf(other[i]))
		.forEach((index, i) => vertices_vertices[vertices[i]].splice(index, 1));
};

const update_vertices_edges = ({ vertices_edges }, edge, vertices) => {
	vertices
		.map((v, i) => vertices_edges[v].indexOf(edge))
		.forEach((index, i) => vertices_edges[vertices[i]].splice(index, 1));
};

const update_vertices_faces = () => {

};
/**
 * @param {object} a FOLD graph
 * @param {number[]} two face indices in an array.
 */
const join_faces = (graph, faces, edge, vertices) => {
	const other = [faces[1], faces[0]];
	// the index of the edge in the face's faces_edges array.
	const faces_edge_index = faces
		.map(f => graph.faces_edges[f].indexOf(edge));
	// the index of the FIRST vertex in the face's faces_vertices array.
	// this means that the two vertex indices are at i, and i+1.
	const faces_vertices_index = [];
	faces.forEach((face, f) => graph.faces_vertices[face]
		.forEach((v, i, arr) => {
			const next = arr[(i + 1) % arr.length];
			if ((v === vertices[0] && next === vertices[1])
				|| (v === vertices[1] && next === vertices[0])) {
				faces_vertices_index[f] = i;
			}
		}));
	if (faces_vertices_index[0] === undefined || faces_vertices_index[1] === undefined) { console.warn("removePlanarEdge error joining faces"); }

	// get the length of each face, before and after changes
	const edges_len_before = faces
		.map(f => graph.faces_edges[f].length);
	const vertices_len_before = faces
		.map(f => graph.faces_vertices[f].length);
	const edges_len_after = edges_len_before.map(len => len - 1);
	const vertices_len_after = vertices_len_before.map(len => len - 1);

	// get the first index after the remove indices for each array
	const faces_edge_keep = faces_edge_index
		.map((e, i) => (e + 1) % edges_len_before[i]);
	const faces_vertex_keep = faces_vertices_index
		.map((v, i) => (v + 1) % vertices_len_before[i]);

	const new_faces_edges = faces
		.map((face, f) => Array.from(Array(edges_len_after[f]))
			.map((_, i) => (faces_edge_keep[f] + i) % edges_len_before[f])
			.map(index => graph.faces_edges[face][index]));
	const new_faces_vertices = faces
		.map((face, f) => Array.from(Array(vertices_len_after[f]))
			.map((_, i) => (faces_vertex_keep[f] + i) % vertices_len_before[f])
			.map(index => graph.faces_vertices[face][index]));

	// todo this unaligns faces_faces with faces_vertices/faces_edges
	const new_faces_faces = faces
		.map(f => graph.faces_faces[f])
		.reduce((a, b) => a.concat(b), [])
		.filter(f => f !== faces[0] && f !== faces[1]);

	return {
		vertices: new_faces_vertices[0].concat(new_faces_vertices[1]),
		edges: new_faces_edges[0].concat(new_faces_edges[1]),
		faces: new_faces_faces,
	};
};
/**
 * @description remove an edge from a planar graph, rebuild affected faces,
 * remove any newly isolated vertices.
 * @param {object} graph a FOLD graph
 * @param {number} edge the index of the edge to be removed
 * @returns {undefined}
 */
const removePlanarEdge = (graph, edge) => {
	// the edge's vertices, sorted large to small.
	// if they are isolated, we want to remove them.
	const vertices = [...graph.edges_vertices[edge]]
		.sort((a, b) => b - a);
	const faces = [...graph.edges_faces[edge]];
	// console.log("removing edge", edge, "with", faces.length, "adjacent faces", faces, "and", vertices.length, "adjacent vertices", vertices);
	update_vertices_vertices(graph, vertices);
	update_vertices_edges(graph, edge, vertices);
	// is the vertex isolated? if so, mark it for removal
	// either 0, 1, or 2 vertices are able to be removed.
	// wait until the end to remove these.
	const vertices_should_remove = vertices
		.map(v => graph.vertices_vertices[v].length === 0);
	const remove_vertices = vertices
		.filter((vertex, i) => vertices_should_remove[i]);
	// only if the edge has two adjacent faces, and those faces are unique,
	// construct a new face by joining the two faces together at the edge.
	if (faces.length === 2 && faces[0] !== faces[1]) {
		// the index of the new face, the three faces (new and 2 old) are
		// going to temporarily coexist in the graph, before the 2 are removed.
		const new_face = graph.faces_vertices.length;
		// generate the new face's faces_vertices, faces_edges, faces_faces
		const new_face_data = join_faces(graph, faces, edge, vertices);
		graph.faces_vertices.push(new_face_data.vertices);
		graph.faces_edges.push(new_face_data.edges);
		graph.faces_faces.push(new_face_data.faces);
		// todo, check if other faces_ arrays exist. they are out of sync.
		// update all graphs which point to faces:
		// vertices_faces, edges_faces, faces_faces
		graph.vertices_faces.forEach((arr, i) => {
			// in the case of one vertex touching both faces, remove both
			// occurences of the old faces, but only add 1 occurence of the new.
			let already_added = false;
			arr.forEach((face, j) => {
				if (face === faces[0] || face === faces[1]) {
					graph.vertices_faces[i][j] = new_face;
					already_added ? arr.splice(i, 1) : arr.splice(i, 1, new_face);
					already_added = true;
				}
			});
		});
		graph.edges_faces.forEach((arr, i) => arr.forEach((face, j) => {
			if (face === faces[0] || face === faces[1]) {
				graph.edges_faces[i][j] = new_face;
			}
		}));
		graph.faces_faces.forEach((arr, i) => arr.forEach((face, j) => {
			if (face === faces[0] || face === faces[1]) {
				graph.faces_faces[i][j] = new_face;
			}
		}));
		graph.faces_vertices.forEach(fv => fv.forEach(f => {
			if (f === undefined) {
				console.log("FOUND ONE before remove", graph.faces_vertices);
			}
		}));
		// again, only if the edge separated two unique faces, then
		// remove the old faces
		remove(graph, "faces", faces);
	}
	// this edge is a part of a face where the edge pokes in, winds back
	// out, definitely not convex.
	// from the faces_vertices, remove any isolated vertices.
	// from the faces_edges, remove the edge.
	// then this creates a situation where two of the same vertex might be
	// repeated. filter out so that the vertices are unique only.
	if (faces.length === 2 && faces[0] === faces[1] && remove_vertices.length) {
		const face = faces[0]; // the non-convex face which needs correcting.
		graph.faces_vertices[face] = graph.faces_vertices[face]
			.filter(v => !remove_vertices.includes(v))
			.filter((v, i, arr) => v !== arr[(i+1)%arr.length]);
		graph.faces_edges[face] = graph.faces_edges[face]
			.filter(e => e !== edge);
	}
	// remove edge, shrink edges_vertices, edges_faces, ... by 1
	// this also replaces any edge occurence in _edge arrays including:
	// vertices_edges, faces_edges.
	remove(graph, "edges", [edge]);
	remove(graph, "vertices", remove_vertices);
};

export default removePlanarEdge;
