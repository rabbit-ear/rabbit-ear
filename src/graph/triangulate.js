/**
 * Rabbit Ear (c) Kraft
 */
const triangulate = (indices) => Array.from(Array(indices.length - 2))
	.map((_, i) => [indices[0], indices[i + 1], indices[i + 2]]);

export const triangulateConvexFacesVertices = ({ faces_vertices }) => faces_vertices
	.flatMap(vertices => (vertices.length < 4
		? [vertices]
		: triangulate(vertices)));
