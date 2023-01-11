/**
 * Rabbit Ear (c) Kraft
 */
import math from "../../../math";

export const makeEdgesFacesSide = (graph, faces_center) => {
	const edges_origin = graph.edges_vertices
		.map(vertices => graph.vertices_coords[vertices[0]]);
	const edges_vector = graph.edges_vertices
		.map(vertices => math.core.subtract2(
			graph.vertices_coords[vertices[1]],
			graph.vertices_coords[vertices[0]],
		));
	return graph.edges_faces
		.map((faces, i) => faces
			.map(face => math.core.cross2(
				math.core.subtract2(
					faces_center[face],
					edges_origin[i],
				),
				edges_vector[i],
			))
			.map(cross => Math.sign(cross)));
};
/**
 * @description having already pre-computed a the tacos in the form of
 * edges and the edges' adjacent faces, give each face a +1 or -1 based
 * on which side of the edge it is on. "side" determined by the cross-
 * product against the edge's vector.
 * @linkcode Origami ./src/layer/solver2d/tacos/facesSide.js 30
 */
export const makeTacosFacesSide = (graph, faces_center, tacos_edges, tacos_faces) => {
	// there are two edges involved in a taco, grab the first one.
	// we have to use the same origin/vector so that the face-sidedness is
	// consistent globally, not local to its edge.
	const tacos_edge_coords = tacos_edges
		.map(edges => graph.edges_vertices[edges[0]]
			.map(vertex => graph.vertices_coords[vertex]));
	const tacos_edge_origin = tacos_edge_coords
		.map(coords => coords[0]);
	const tacos_edge_vector = tacos_edge_coords
		.map(coords => math.core.subtract2(coords[1], coords[0]));

	const tacos_faces_center = tacos_faces
		.map(faces => faces
			.map(face_pair => face_pair
				.map(face => faces_center[face])));

	return tacos_faces_center
		.map((faces, i) => faces
			.map(pairs => pairs
				.map(center => math.core.cross2(
					math.core.subtract2(
						center,
						tacos_edge_origin[i],
					),
					tacos_edge_vector[i],
				))
				.map(cross => Math.sign(cross))));
};
