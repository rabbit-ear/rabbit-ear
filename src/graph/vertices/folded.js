/**
 * Rabbit Ear (c) Kraft
 */
import { makeEdgesIsFolded } from "../../fold/spec.js";
import {
	normalize2,
	dot,
	scale2,
	add2,
	subtract2,
	rotate270,
	rotate90,
	resize,
} from "../../math/algebra/vector.js";
import {
	identity3x4,
	multiplyMatrix3Vector3,
} from "../../math/algebra/matrix3.js";
import {
	makeVerticesFaces,
	makeVerticesToEdgeBidirectional,
	makeFacesFaces,
} from "../make.js";
import { getFaceFaceSharedVertices } from "../find.js";
import { minimumSpanningTree } from "../trees.js";
import { makeFacesMatrix } from "../faces/matrix.js";
// import { makeFaceSpanningTree } from "../faces/spanningTree.js";
/**
 * @description Fold a graph along its edges and return the position
 * of the folded vertices. This method works in both 2D and 3D
 * unassigned edges are treated as flat fold (mountain/valley 180deg)
 * as a way of (assuming the user is giving a flat folded origami), help
 * solve things about an origami that is currently being figured out.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [root_face=0] the index of the face that will remain in place
 * @returns {number[][]} a new set of `vertices_coords` with the new positions.
 * @linkcode Origami ./src/graph/verticesCoordsFolded.js 36
 */
export const makeVerticesCoordsFolded = ({
	vertices_coords, vertices_faces, edges_vertices, edges_foldAngle,
	edges_assignment, faces_vertices, faces_faces, faces_matrix,
}, root_face) => {
	faces_matrix = makeFacesMatrix({
		vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces,
	}, root_face);
	if (!vertices_faces) {
		vertices_faces = makeVerticesFaces({ faces_vertices });
	}
	// assign one matrix to every vertex from faces, identity matrix if none exist
	const vertices_matrix = vertices_faces
		.map(faces => faces
			.filter(a => a != null) // must filter "undefined" and "null"
			.shift()) // get any face from the list
		.map(face => (face === undefined
			? identity3x4
			: faces_matrix[face]));
	return vertices_coords
		.map(coord => resize(3, coord))
		.map((coord, i) => multiplyMatrix3Vector3(vertices_matrix[i], coord));
};
/**
 * @description Fold a graph along its edges and return the position of the folded
 * vertices. this method works for 2D only (no z value).
 * if a edges_assignment is "U", assumed to be folded ("V" or "M").
 * Finally, if no edge foldAngle or assignments exist, this method will
 * assume all edges are flat-folded (except boundary) and will fold everything.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [root_face=0] the index of the face that will remain in place
 * @returns {number[][]} a new set of `vertices_coords` with the new positions.
 * @linkcode Origami ./src/graph/verticesCoordsFolded.js 69
 */
export const makeVerticesCoordsFlatFolded = ({
	vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces,
}, root_face = 0) => {
	if (!faces_faces) {
		faces_faces = makeFacesFaces({ faces_vertices });
	}
	const edges_is_folded = makeEdgesIsFolded({ edges_vertices, edges_foldAngle, edges_assignment });
	const vertices_coords_folded = [];
	faces_vertices[root_face]
		.forEach(v => { vertices_coords_folded[v] = [...vertices_coords[v]]; });
	const faces_flipped = [];
	faces_flipped[root_face] = false;
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	minimumSpanningTree(faces_faces, root_face)
		.slice(1) // remove the first level, it has no parent face
		.forEach(level => level
			.forEach(entry => {
				// coordinates and vectors of the reflecting edge
				const edge_key = getFaceFaceSharedVertices(
					faces_vertices[entry.index],
					faces_vertices[entry.parent],
				).slice(0, 2).join(" ");
				const edge = edge_map[edge_key];
				// build a basis axis using the folding edge, normalized.
				const coords = edges_vertices[edge].map(v => vertices_coords_folded[v]);
				if (coords[0] === undefined || coords[1] === undefined) { return; }
				const coords_cp = edges_vertices[edge].map(v => vertices_coords[v]);
				// the basis axis origin, x-basis axis (vector) and y-basis (normal)
				const origin_cp = coords_cp[0];
				const vector_cp = normalize2(subtract2(coords_cp[1], coords_cp[0]));
				const normal_cp = rotate90(vector_cp);
				// if we are crossing a flipping edge (m/v), set this face to be
				// flipped opposite of the parent face. otherwise keep it the same.
				faces_flipped[entry.index] = edges_is_folded[edge]
					? !faces_flipped[entry.parent]
					: faces_flipped[entry.parent];
				const vector_folded = normalize2(subtract2(coords[1], coords[0]));
				const origin_folded = coords[0];
				const normal_folded = faces_flipped[entry.index]
					? rotate270(vector_folded)
					: rotate90(vector_folded);
				// remaining_faces_vertices
				faces_vertices[entry.index]
					.filter(v => vertices_coords_folded[v] === undefined)
					.forEach(v => {
						const to_point = subtract2(vertices_coords[v], origin_cp);
						const project_norm = dot(to_point, normal_cp);
						const project_line = dot(to_point, vector_cp);
						const walk_up = scale2(vector_folded, project_line);
						const walk_perp = scale2(normal_folded, project_norm);
						const folded_coords = add2(add2(origin_folded, walk_up), walk_perp);
						vertices_coords_folded[v] = folded_coords;
					});
			}));
	return vertices_coords_folded;
};
// export const makeVerticesCoordsFlatFolded = ({
// 	vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces,
// }, root_face = 0) => {
// 	const edges_is_folded = makeEdgesIsFolded({ edges_vertices, edges_foldAngle, edges_assignment });
// 	const vertices_coords_folded = [];
// 	faces_vertices[root_face]
// 		.forEach(v => { vertices_coords_folded[v] = [...vertices_coords[v]]; });
// 	const faces_flipped = [];
// 	faces_flipped[root_face] = false;
// 	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
// 	makeFaceSpanningTree({ faces_vertices, faces_faces }, root_face)
// 		.slice(1) // remove the first level, it has no parent face
// 		.forEach(level => level
// 			.forEach(entry => {
// 				// coordinates and vectors of the reflecting edge
// 				const edge_key = entry.edge_vertices.join(" ");
// 				const edge = edge_map[edge_key];
// 				// build a basis axis using the folding edge, normalized.
// 				const coords = edges_vertices[edge].map(v => vertices_coords_folded[v]);
// 				if (coords[0] === undefined || coords[1] === undefined) { return; }
// 				const coords_cp = edges_vertices[edge].map(v => vertices_coords[v]);
// 				// the basis axis origin, x-basis axis (vector) and y-basis (normal)
// 				const origin_cp = coords_cp[0];
// 				const vector_cp = normalize2(subtract2(coords_cp[1], coords_cp[0]));
// 				const normal_cp = rotate90(vector_cp);
// 				// if we are crossing a flipping edge (m/v), set this face to be
// 				// flipped opposite of the parent face. otherwise keep it the same.
// 				faces_flipped[entry.face] = edges_is_folded[edge]
// 					? !faces_flipped[entry.parent]
// 					: faces_flipped[entry.parent];
// 				const vector_folded = normalize2(subtract2(coords[1], coords[0]));
// 				const origin_folded = coords[0];
// 				const normal_folded = faces_flipped[entry.face]
// 					? rotate270(vector_folded)
// 					: rotate90(vector_folded);
// 				// remaining_faces_vertices
// 				faces_vertices[entry.face]
// 					.filter(v => vertices_coords_folded[v] === undefined)
// 					.forEach(v => {
// 						const to_point = subtract2(vertices_coords[v], origin_cp);
// 						const project_norm = dot(to_point, normal_cp);
// 						const project_line = dot(to_point, vector_cp);
// 						const walk_up = scale2(vector_folded, project_line);
// 						const walk_perp = scale2(normal_folded, project_norm);
// 						const folded_coords = add2(add2(origin_folded, walk_up), walk_perp);
// 						vertices_coords_folded[v] = folded_coords;
// 					});
// 			}));
// 	return vertices_coords_folded;
// };
/**
 *
 */
const makeVerticesCoordsUnfolded = ({
	vertices_coords, vertices_faces, edges_vertices, edges_foldAngle,
	edges_assignment, faces_vertices, faces_faces, faces_matrix,
}) => {

};
