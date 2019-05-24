/**
 * Each of these should return an array of Edges
 * 
 * Each of the axioms create full-page crease lines
 *  ending at the boundary; in non-convex paper, this
 *  could result in multiple edges
 */

// "re:boundaries_vertices" = [[5,3,9,7,6,8,1,2]];
// "faces_re:matrix" = [[1,0,0,1,0,0]];

import * as Geometry from "../../include/geometry";
import { make_faces_matrix } from "../graph/make";

/**
 * this builds a new faces_layer array. it first separates the folding
 * faces from the non-folding, using faces_folding, an array of [t,f].
 * it flips the folding faces over, appends them to the non-folding ordering,
 * and (re-indexes/normalizes) all the z-index values to be the minimum
 * whole number set starting with 0.
 */
export function foldLayers(faces_layer, faces_folding) {
	let folding_i = faces_layer
		.map((el,i) => faces_folding[i] ? i : undefined)
		.filter(a => a !== undefined)
	let not_folding_i = faces_layer
		.map((el,i) => !faces_folding[i] ? i : undefined)
		.filter(a => a !== undefined)
	let sorted_folding_i = folding_i.slice()
		.sort((a,b) => faces_layer[a] - faces_layer[b]);
	let sorted_not_folding_i = not_folding_i.slice()
		.sort((a,b) => faces_layer[a] - faces_layer[b]);
	let new_faces_layer = [];
	sorted_not_folding_i.forEach((layer, i) => new_faces_layer[layer] = i);
	let topLayer = sorted_not_folding_i.length;
	sorted_folding_i.reverse().forEach((layer, i) => new_faces_layer[layer] = topLayer + i);
	return new_faces_layer;
}


// let sector_angles = function(graph, vertex) {
// 	let adjacent = origami.cp.vertices_vertices[vertex];
// 	let vectors = adjacent.map(v => [
// 		origami.cp.vertices_coords[v][0] - origami.cp.vertices_coords[vertex][0],
// 		origami.cp.vertices_coords[v][1] - origami.cp.vertices_coords[vertex][1]
// 	]);
// 	let vectors_as_angles = vectors.map(v => Math.atan2(v[1], v[0]));
// 	return vectors.map((v,i,arr) => {
// 		let nextV = arr[(i+1)%arr.length];
// 		return Geometry.core.counter_clockwise_angle2(v, nextV);
// 	});
// }

export function fold_without_layering(fold, face) {
	if (face == null) { face = 0; }
	let faces_matrix = make_faces_matrix(fold, face);
	let vertex_in_face = fold.vertices_coords.map((v,i) => {
		for(var f = 0; f < fold.faces_vertices.length; f++){
			if(fold.faces_vertices[f].includes(i)){ return f; }
		}
	});
	let new_vertices_coords_cp = fold.vertices_coords.map((point,i) =>
		Geometry.core.multiply_vector2_matrix2(point, faces_matrix[vertex_in_face[i]]).map((n) => 
			Geometry.core.clean_number(n)
		)
	)
	fold.frame_classes = ["foldedForm"];
	fold.vertices_coords = new_vertices_coords_cp;
	return fold;
}

export const fold_vertices_coords = function(graph, face_stationary, faces_matrix) {
	if (face_stationary == null) {
		console.warn("fold_vertices_coords was not supplied a stationary face");
		face_stationary = 0;
	}
	if (faces_matrix == null) {
		faces_matrix = make_faces_matrix(graph, face_stationary);
	}
	let vertex_in_face = graph.vertices_coords.map((v,i) => {
		for(let f = 0; f < graph.faces_vertices.length; f++) {
			if (graph.faces_vertices[f].includes(i)){ return f; }
		}
	});
	return graph.vertices_coords.map((point,i) =>
		Geometry.core.multiply_vector2_matrix2(point, faces_matrix[vertex_in_face[i]]).map((n) => 
			Geometry.core.clean_number(n)
		)
	)
}

export function build_folded_frame(graph, face_stationary) {
	if (face_stationary == null) {
		face_stationary = 0;
		console.warn("build_folded_frame was not supplied a stationary face");
	}
	// console.log("build_folded_frame", graph, face_stationary);
	let faces_matrix = make_faces_matrix(graph, face_stationary);
	let vertices_coords = fold_vertices_coords(graph, face_stationary, faces_matrix);
	return {
		vertices_coords,
		frame_classes: ["foldedForm"],
		frame_inherit: true,
		frame_parent: 0, // this is not always the case. maybe shouldn't imply this here.
		// "face_re:stationary": face_stationary,
		"faces_re:matrix": faces_matrix
	};
}
