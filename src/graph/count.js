/**
 * Rabbit Ear (c) Kraft
 */
import { filterKeysWithPrefix } from "../fold/spec.js";
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
 * This works even with custom component names in place of "vertices", "edges"...
 *
 * This will fail in the case of abstract graphs, for example where no vertices
 * are defined in a vertex_ array, but still exist as mentions in faces_vertices.
 * In that case, use the implied count method. "count_implied.js"
 * @param {FOLD} graph a FOLD object
 * @param {string} key the prefix for a key, eg: "vertices"
 * @returns {number} the number of the requested element type in the graph
 * @linkcode Origami ./src/graph/count.js 25
 */
const count = (graph, key) => (
	max_arrays_length(...filterKeysWithPrefix(graph, key).map(k => graph[k])));

// standard graph components names
/**
 * @description Get the number of vertices in a graph.
 * @param {FOLD} graph a FOLD object
 * @returns {number} the number of vertices in the graph
 */
count.vertices = ({ vertices_coords, vertices_faces, vertices_vertices }) => (
	max_arrays_length(vertices_coords, vertices_faces, vertices_vertices));
/**
 * @description Get the number of edges in a graph.
 * @param {FOLD} graph a FOLD object
 * @returns {number} the number of edges in the graph
 */
count.edges = ({ edges_vertices, edges_edges, edges_faces }) => (
	max_arrays_length(edges_vertices, edges_edges, edges_faces));
/**
 * @description Get the number of faces in a graph.
 * @param {FOLD} graph a FOLD object
 * @returns {number} the number of faces in the graph
 */
count.faces = ({ faces_vertices, faces_edges, faces_faces }) => (
	max_arrays_length(faces_vertices, faces_edges, faces_faces));

export default count;
