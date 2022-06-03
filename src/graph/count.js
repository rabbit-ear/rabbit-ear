/**
 * Rabbit Ear (c) Kraft
 */
import { get_graph_keys_with_prefix } from "../fold/spec";
/**
 * @param {any[]} arrays any number of arrays
 * @returns {number} the length of the longest array
 */
const max_arrays_length = (...arrays) => Math.max(0, ...(arrays
	.filter(el => el !== undefined)
	.map(el => el.length)));
/**
 * @description Get the number of vertices, edges, or faces in the graph by
 * simply checking the length of arrays starting with the key; in the case
 * of differing array lengths (which shouldn't happen) return the largest number.
 * 
 * This works even with custom component names, not "vertices", "edges", etc..
 *
 * This will fail in the case of abstract graphs, for example where no vertices
 * are defined in any vertex_ array but only exist as mentions in faces_vertices.
 * In that case, use the implied count method. "count_implied.js"
 * @param {object} a FOLD graph
 * @param {string} the prefix for a key, eg: "vertices" 
 * @returns {number} the number of vertices, edges, or faces in the graph.
 */
const count = (graph, key) => max_arrays_length(...get_graph_keys_with_prefix(graph, key).map(key => graph[key]));

// standard graph components names
count.vertices = ({ vertices_coords, vertices_faces, vertices_vertices }) =>
	max_arrays_length(vertices_coords, vertices_faces, vertices_vertices);
count.edges = ({ edges_vertices, edges_edges, edges_faces }) =>
	max_arrays_length(edges_vertices, edges_edges, edges_faces);
count.faces = ({ faces_vertices, faces_edges, faces_faces }) =>
	max_arrays_length(faces_vertices, faces_edges, faces_faces);

export default count;
