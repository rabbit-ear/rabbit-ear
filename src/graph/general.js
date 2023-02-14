/**
 * Rabbit Ear (c) Kraft
 */
/**
 * do not include these in the export of graph
 */
import Messages from "../environment/messages.js";

export const getOppositeVertices = ({ edges_vertices }, vertex, edges) => {
	edges.forEach(edge => {
		if (edges_vertices[edge][0] === vertex
			&& edges_vertices[edge][1] === vertex) {
			throw new Error(Messages.circularEdge);
		}
	});
	return edges.map(edge => (edges_vertices[edge][0] === vertex
		? edges_vertices[edge][1]
		: edges_vertices[edge][0]));
};
