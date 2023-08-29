/**
 * Rabbit Ear (c) Kraft
 */
import { makeEdgesIsFolded } from "../../fold/spec.js";
import {
	subtract,
	subtract2,
	resizeUp,
} from "../../math/algebra/vector.js";
import {
	identity2x3,
	multiplyMatrix2Vector2,
	makeMatrix2Reflect,
	multiplyMatrices2,
} from "../../math/algebra/matrix2.js";
import {
	identity3x4,
	makeMatrix3Rotate,
	multiplyMatrices3,
} from "../../math/algebra/matrix3.js";
import {
	makeVerticesFaces,
	makeVerticesToEdgeBidirectional,
	makeEdgesFoldAngle,
	makeEdgesAssignmentSimple,
	makeFacesFaces,
} from "../make.js";
import { getFaceFaceSharedVertices } from "./general.js";
// import { makeFaceSpanningTree } from "./spanningTree.js";
import { minimumSpanningTrees } from "../trees.js";
/**
 * @description Given a FOLD object and a set of 2x3 matrices, one per face,
 * "fold" the vertices by finding one matrix per vertex and multiplying them.
 * @param {object} FOLD graph with vertices_coords, faces_vertices, and
 * if vertices_faces does not exist it will be built.
 * @param {number[][]} an array of 2x3 matrices. one per face.
 * @returns {number[][]} a new set of vertices_coords, transformed.
 * @linkcode Origami ./src/graph/facesMatrix.js 37
 */
export const multiplyVerticesFacesMatrix2 = ({
	vertices_coords, vertices_faces, faces_vertices,
}, faces_matrix) => {
	if (!vertices_faces) {
		vertices_faces = makeVerticesFaces({ faces_vertices });
	}
	const vertices_matrix = vertices_faces
		.map(faces => faces
			.filter(a => a != null)
			.shift())
		.map(face => (face === undefined
			? identity2x3
			: faces_matrix[face]));
	return vertices_coords
		.map((coord, i) => multiplyMatrix2Vector2(vertices_matrix[i], coord));
};
const unassigned_angle = { U: true, u: true };
/**
 * @description Create one transformation matrix for every face which
 * represents the transformation of the face AFTER the graph has been folded
 * along all of the creases (this works in 3D too).
 * This traverses a face-adjacency tree (edge-adjacent faces) and
 * recursively applies the affine transform that represents a fold
 * across the edge between the faces. "flat" creases are ignored.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [root_face=0] the index of the face that will remain in place
 * @returns {number[][]} for every face, a 3x4 matrix (an array of 12 numbers).
 * @linkcode Origami ./src/graph/facesMatrix.js 65
 */
// { vertices_coords, edges_vertices, edges_foldAngle, faces_vertices, faces_faces}
export const makeFacesMatrix = ({
	vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces,
}, root_face = 0) => {
	if (!edges_assignment && edges_foldAngle) {
		edges_assignment = makeEdgesAssignmentSimple({ edges_foldAngle });
	}
	if (!edges_foldAngle) {
		if (edges_assignment) {
			edges_foldAngle = makeEdgesFoldAngle({ edges_assignment });
		} else {
			// if no edges_foldAngle data exists, everyone gets identity matrix
			edges_foldAngle = Array(edges_vertices.length).fill(0);
		}
	}
	if (!faces_faces) {
		faces_faces = makeFacesFaces({ faces_vertices });
	}
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	const faces_matrix = faces_vertices.map(() => identity3x4);
	// makeFaceSpanningTree({ faces_vertices, faces_faces }, root_face)
	minimumSpanningTrees(faces_faces, root_face)
		.forEach(tree => tree
			.slice(1) // remove the first level, it has no parent face
			.forEach(level => level
				.forEach((entry) => {
					const edge_vertices = getFaceFaceSharedVertices(
						faces_vertices[entry.index],
						faces_vertices[entry.parent],
					).slice(0, 2);
					const coords = edge_vertices.map(v => vertices_coords[v]);
					const edgeKey = edge_vertices.join(" ");
					const edge = edge_map[edgeKey];
					// if the assignment is unassigned, assume it is a flat fold.
					const foldAngle = unassigned_angle[edges_assignment[edge]]
						? Math.PI
						: (edges_foldAngle[edge] * Math.PI) / 180;
					const local_matrix = makeMatrix3Rotate(
						foldAngle, // rotation angle
						subtract(...resizeUp(coords[1], coords[0])), // line-vector
						coords[0], // line-origin
					);
					faces_matrix[entry.index] = multiplyMatrices3(faces_matrix[entry.parent], local_matrix);
					// to build the inverse matrix, switch these two parameters
					// .multiplyMatrices3(local_matrix, faces_matrix[entry.parent]);
				})));
	return faces_matrix;
};
/**
 * @description Create one transformation matrix for every face which
 * represents the transformation of the face AFTER the graph has been folded
 * along all of the creases.
 * This ignores any 3D data, and treats all creases as flat-folded.
 * This will generate a 2D matrix for every face by virtually folding the graph
 * at every edge according to the assignment or foldAngle.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [root_face=0] the index of the face that will remain in place
 * @returns {number[][]} for every face, a 2x3 matrix (an array of 6 numbers).
 * @linkcode Origami ./src/graph/facesMatrix.js 141
 */
export const makeFacesMatrix2 = ({
	vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces,
}, root_face = 0) => {
	if (!edges_foldAngle) {
		if (edges_assignment) {
			edges_foldAngle = makeEdgesFoldAngle({ edges_assignment });
		} else {
			// if no edges_foldAngle data exists, everyone gets identity matrix
			edges_foldAngle = Array(edges_vertices.length).fill(0);
		}
	}
	if (!faces_faces) {
		faces_faces = makeFacesFaces({ faces_vertices });
	}
	// However, if there is no edges_assignments, and we have to use edges_foldAngle,
	// the "unassigned" trick will no longer work, only +/- non zero numbers get
	// counted as folded edges (true).
	// For this reason, treating "unassigned" as a folded edge, this method's
	// functionality is better considered to be specific to makeFacesMatrix2,
	// instead of a generalized method.
	const edges_is_folded = makeEdgesIsFolded({ edges_vertices, edges_foldAngle, edges_assignment });
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	const faces_matrix = faces_vertices.map(() => identity2x3);
	minimumSpanningTrees(faces_faces, root_face)
		.forEach(tree => tree
			.slice(1) // remove the first level, it has no parent face
			.forEach(level => level
				.forEach((entry) => {
					const edge_vertices = getFaceFaceSharedVertices(
						faces_vertices[entry.index],
						faces_vertices[entry.parent],
					).slice(0, 2);
					const coords = edge_vertices.map(v => vertices_coords[v]);
					const edgeKey = edge_vertices.join(" ");
					const edge = edge_map[edgeKey];
					const reflect_vector = subtract2(coords[1], coords[0]);
					const reflect_origin = coords[0];
					const local_matrix = edges_is_folded[edge]
						? makeMatrix2Reflect(reflect_vector, reflect_origin)
						: identity2x3;
					faces_matrix[entry.index] = multiplyMatrices2(faces_matrix[entry.parent], local_matrix);
					// to build the inverse matrix, switch these two parameters
					// .multiplyMatrices2(local_matrix, faces_matrix[entry.parent]);
				})));
	return faces_matrix;
};
