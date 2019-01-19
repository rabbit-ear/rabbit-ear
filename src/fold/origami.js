/**
 * Each of these should return an array of Edges
 * 
 * Each of the axioms create full-page crease lines
 *  ending at the boundary; in non-convex paper, this
 *  could result in multiple edges
 */


// "re:boundaries_vertices" = [[5,3,9,7,6,8,1,2]];
// "re:faces_matrix" = [[1,0,0,1,0,0]];

import * as Geom from "../../lib/geometry";
import * as Graph from "./graph";
import * as PlanarGraph from "./planargraph";
import { apply_diff } from "./diff";

export function crease_line(graph, point, vector) {
	let boundary = Graph.get_boundary_vertices(graph);
	let poly = boundary.map(v => graph.vertices_coords[v]);
	// let edge = Geom.core.intersection.clip_line_in_convex_poly(poly, line[0], line[1]);
	let new_edge_count = 0;
	graph.faces_vertices.forEach((fv,i) => {
		let diff = PlanarGraph.split_convex_polygon(graph, i, point, vector);
		// let remove = apply_diff(graph, diff);
		// if (diff.edges != null && diff.edges.new != null) {
		// 	new_edge_count += diff.edges.new.length;
		// }
		// console.log(diff, remove);
		// Graph.remove_vertices(graph, remove.vertices);
		// Graph.remove_edges(graph, remove.edges);
		// Graph.remove_faces(graph, remove.faces);
	});
	return [];
	// return Array.apply(null, Array(new_edge_count))
	// 	.map((_,i) => graph.edges_vertices.length-new_edge_count+i);
}

export function axiom1(graph, pointA, pointB) { // n-dimension
	let line = Geom.core.origami.axiom1(pointA, pointB);
	return crease_line(graph, line[0], line[1]);
}
export function axiom2(graph, pointA, pointB) {
	let line = Geom.core.origami.axiom2(pointA, pointB);
	return crease_line(graph, line[0], line[1]);
}
export function axiom3(graph, pointA, vectorA, pointB, vectorB) {
	let lines = Geom.core.origami.axiom3(pointA, vectorA, pointB, vectorB);
	// return lines.map(line => crease_line(graph, line[0], line[1]))
	// 	.reduce((a,b) => a.concat(b), []);

	return crease_line(graph, lines[0][0], lines[0][1]);
}
export function axiom4(graph, pointA, vectorA, pointB) {
	let line = Geom.core.origami.axiom4(pointA, vectorA, pointB);
	return crease_line(graph, line[0], line[1]);
}
export function axiom5(graph, pointA, vectorA, pointB, pointC) {
	let line = Geom.core.origami.axiom5(pointA, vectorA, pointB, pointC);
	return crease_line(graph, line[0], line[1]);
}
export function axiom6(graph, pointA, vectorA, pointB, vectorB, pointC, pointD) {
	let line = Geom.core.origami.axiom6(pointA, vectorA, pointB, vectorB, pointC, pointD);
	return crease_line(graph, line[0], line[1]);
}
export function axiom7(graph, pointA, vectorA, pointB, vectorB, pointC) {
	let line = Geom.core.origami.axiom7(pointA, vectorA, pointB, vectorB, pointC);
	return crease_line(graph, line[0], line[1]);
}

export function fold_without_layering(fold, face) {
	if (face == null) { face = 0; }
	let faces_matrix = PlanarGraph.make_faces_matrix(fold, face);
	let vertex_in_face = fold.vertices_coords.map((v,i) => {
		for(var f = 0; f < fold.faces_vertices.length; f++){
			if(fold.faces_vertices[f].includes(i)){ return f; }
		}
	});
	let new_vertices_coords_cp = fold.vertices_coords.map((point,i) =>
		Geom.core.multiply_vector2_matrix2(point, faces_matrix[vertex_in_face[i]]).map((n) => 
			Geom.core.clean_number(n)
		)
	)
	fold.frame_classes = ["foldedState"];
	fold.vertices_coords = new_vertices_coords_cp;
	return fold;
}
