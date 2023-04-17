/**
 * Rabbit Ear (c) Kraft
 */
import {
	exclude,
	excludeS,
} from "../../../math/general/function.js";
import { subtract2 } from "../../../math/algebra/vector.js";
import { clipLineConvexPolygon } from "../../../math/intersect/clip.js";
/**
 *
 */
const makeTortillasFacesCrossing = ({
	vertices_coords, edges_vertices, faces_polygon,
}, edges_faces_side, epsilon) => {
	const tortilla_edge_indices = edges_faces_side
		.map(side => side.length === 2 && side[0] !== side[1])
		.map((bool, i) => (bool ? i : undefined))
		.filter(a => a !== undefined);
	const edges_coords = tortilla_edge_indices
		.map(e => edges_vertices[e])
		.map(edge => edge
			.map(vertex => vertices_coords[vertex]));
	const edges_vector = edges_coords
		.map(coords => subtract2(coords[1], coords[0]));
	const matrix = [];
	tortilla_edge_indices.forEach(e => { matrix[e] = []; });
	const result = tortilla_edge_indices
		.map((e, ei) => faces_polygon
			.map(poly => clipLineConvexPolygon(
				poly,
				{ vector: edges_vector[ei], origin: edges_coords[ei][0] },
				exclude,
				excludeS,
				epsilon,
			))
			.map(res => res !== undefined));
	result.forEach((faces, ei) => faces
		.forEach((overlap, f) => {
			if (overlap) {
				matrix[tortilla_edge_indices[ei]].push(f);
			}
		}));
	return matrix;
};
/**
 * @description Tortilla-tortillas can be generated in two ways:
 * 1. two tortillas (4 faces) where the two dividing edges are collinear
 * 2. two tortillas (4 faces) where the dividing edges lie on top of
 * each other, crossing each other, but are not collinear.
 * This method generates all tortillas from the second set.
 */
export const makeTortillaTortillaFacesCrossing = ({
	vertices_coords, edges_vertices, edges_faces, faces_polygon,
}, edges_faces_side, epsilon) => {
	const tortillas_faces_crossing = makeTortillasFacesCrossing({
		vertices_coords, edges_vertices, faces_polygon,
	}, edges_faces_side, epsilon);
	const tortilla_faces_results = tortillas_faces_crossing
		.map((faces, e) => faces.map(face => [edges_faces[e], [face, face]]))
		.reduce((a, b) => a.concat(b), []);
	return tortilla_faces_results;
};
