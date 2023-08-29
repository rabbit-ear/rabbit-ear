/**
 * Rabbit Ear (c) Kraft
 */
/**
 *
 */
// export const getEdgeBetweenVertices = ({ vertices_edges }, a, b) => {
// 	const set = new Set(vertices_edges[a]);
// 	return vertices_edges[b].filter(edge => set.has(edge)).shift();
// };
/**
 * @description Given one vertex, and a list of edges which contain this vertex,
 * get one vertex for every edge which is not the input parameter vertex.
 * @param {FOLD} graph a FOLD graph with edges_vertices
 * @param {number} vertex one vertex index
 * @param {number[]} edges a list of edge indices
 * @returns {number[]} for every edge, one vertex that is the opposite vertex
 */
export const getOtherVerticesInEdges = ({ edges_vertices }, vertex, edges) => edges
	.map(edge => (edges_vertices[edge][0] === vertex
		? edges_vertices[edge][1]
		: edges_vertices[edge][0]));
