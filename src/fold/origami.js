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

// for now, this uses "re:faces_layer", todo: use faceOrders
export function crease_through_layers(graph, point, vector, face_index, crease_direction = "V") {
	let opposite_crease = 
		(crease_direction === "M" || crease_direction === "m" ? "V" : "M");
	// if face isn't set, it will be determined by whichever face
	// is directly underneath point. or if none, index 0.
	let face_centroid;
	if (face_index == null) {
		face_index = PlanarGraph.face_containing_point(graph, point);
		if(face_index === undefined) { face_index = 0; }
	} else {
		face_centroid = Geom.Face()
	}
	let primaryLine = Geom.Line(point, vector);
	let coloring = Graph.face_coloring(graph, face_index);
	PlanarGraph.make_faces_matrix_inv(graph, face_index)
		.map(m => primaryLine.transform(m))
		.reverse()
		.forEach((line, reverse_i, arr) => {
			let i = arr.length - 1 - reverse_i;
			PlanarGraph.split_convex_polygon(graph, i, line.point,
				line.vector, coloring[i] ? crease_direction : opposite_crease);
		});
	// determine which faces changed

}

export function crease_folded(graph, point, vector, face_index) {
	// if face isn't set, it will be determined by whichever face
	// is directly underneath point. or if none, index 0.
	if (face_index == null) {
		face_index = PlanarGraph.face_containing_point(graph, point);
		if(face_index === undefined) { face_index = 0; }
	}
	let primaryLine = Geom.Line(point, vector);
	let coloring = Graph.face_coloring(graph, face_index);
	PlanarGraph.make_faces_matrix_inv(graph, face_index)
		.map(m => primaryLine.transform(m))
		.reverse()
		.forEach((line, reverse_i, arr) => {
			let i = arr.length - 1 - reverse_i;
			PlanarGraph.split_convex_polygon(graph, i, line.point, line.vector, coloring[i] ? "M" : "V");
		});
}

export function crease_line(graph, point, vector) {
	// let boundary = Graph.get_boundary_vertices(graph);
	// let poly = boundary.map(v => graph.vertices_coords[v]);
	// let edge_map = Array.from(Array(graph.edges_vertices.length)).map(_=>0);
	let new_edges = [];
	let arr = Array.from(Array(graph.faces_vertices.length))
		.map((_,i)=>i).reverse();
	arr.forEach(i => {
		let diff = PlanarGraph.split_convex_polygon(graph, i, point, vector);
		if (diff.edges != null && diff.edges.new != null) {
			// a new crease line was added
			let newEdgeIndex = diff.edges.new[0].index;
			new_edges = new_edges.map(edge => 
				edge += (diff.edges.map[edge] == null
					? 0
					: diff.edges.map[edge])
			);
			new_edges.push(newEdgeIndex);
		}
	});
	return new_edges;
}

export function crease_ray(graph, point, vector) {
	let new_edges = [];
	let arr = Array.from(Array(graph.faces_vertices.length)).map((_,i)=>i).reverse();
	arr.forEach(i => {
		let diff = PlanarGraph.split_convex_polygon(graph, i, point, vector);
		if (diff.edges != null && diff.edges.new != null) {
			// a new crease line was added
			let newEdgeIndex = diff.edges.new[0].index;
			new_edges = new_edges.map(edge =>
				edge += (diff.edges.map[edge] == null ? 0 : diff.edges.map[edge])
			);
			new_edges.push(newEdgeIndex);
		}
	});
	return new_edges;
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
	// todo: each iteration needs to apply the diff to the prev iterations
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

export function creaseRay(graph, point, vector) {
	// todo idk if this is done
	let ray = Geom.core.Ray(point, vector);
	graph.faces_vertices.forEach(face => {
		let points = face.map(v => graph.vertices_coords[v]);
		Geom.core.intersection.clip_ray_in_convex_poly(_points, point, vector);
	})
	return crease_line(graph, line[0], line[1]);
}

export const creaseSegment = function(graph, a, b, c, d) {
	// let edge = Geom.Edge([a, b, c, d]);
	let edge = Geom.Edge([a, b]);

	let edge_vertices = edge.endpoints
		.map(ep => graph.vertices_coords
			.map(v => Math.sqrt(Math.pow(ep[0]-v[0],2)+Math.pow(ep[1]-v[1],2)))
			.map((d,i) => d < 0.00000001 ? i : undefined)
			.filter(el => el !== undefined)
			.shift()
		).map((v,i) => {
			if (v !== undefined) { return v; }
			// else
			graph.vertices_coords.push(edge.endpoints[i]);
			return graph.vertices_coords.length - 1;
		});

	graph.edges_vertices.push(edge_vertices);
	graph.edges_assignment.push("F");
	return [graph.edges_vertices.length-1];
}

export function add_edge_between_points(graph, x0, y0, x1, y1) {
	// this creates 2 new edges vertices indices.
	// or grabs old ones if a vertex already exists
	let edge = [[x0, y0], [x1, y1]];
	let edge_vertices = edge
		.map(ep => graph.vertices_coords
			// for both of the new points, iterate over every vertex,
			// return an index if it matches a new point, undefined if not
			.map(v => Math.sqrt(Math.pow(ep[0]-v[0],2)+Math.pow(ep[1]-v[1],2)))
			.map((d,i) => d < 0.00000001 ? i : undefined)
			.filter(el => el !== undefined)
			.shift()
		).map((v,i) => {
			if (v !== undefined) { return v; }
			// else
			graph.vertices_coords.push(edge[i]);
			return graph.vertices_coords.length - 1;
		});
	graph.edges_vertices.push(edge_vertices);
	graph.edges_assignment.push("F");
	graph.edges_length.push(Math.sqrt(Math.pow(x0-x1,2)+Math.pow(y0-y1,2)));
	return [graph.edges_vertices.length-1];
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
// 		return RabbitEar.math.core.geometry.counter_clockwise_angle2(v, nextV);
// 	});
// }

let vertex_adjacent_vectors = function(graph, vertex) {
	let adjacent = origami.cp.vertices_vertices[vertex];
	return adjacent.map(v => [
		origami.cp.vertices_coords[v][0] - origami.cp.vertices_coords[vertex][0],
		origami.cp.vertices_coords[v][1] - origami.cp.vertices_coords[vertex][1]
	]);
}

function kawasaki_from_even(array) {
	let even_sum = array.filter((_,i) => i%2 === 0).reduce((a,b) => a+b, 0);
	let odd_sum = array.filter((_,i) => i%2 === 1).reduce((a,b) => a+b, 0);
	// if (even_sum > Math.PI) { return undefined; }
	return [Math.PI - even_sum, Math.PI - odd_sum];
}

export function kawasaki_solutions(graph, vertex) {
	let vectors = vertex_adjacent_vectors(graph, vertex);
	let vectors_as_angles = vectors.map(v => Math.atan2(v[1], v[0]));
	// get the interior angles of sectors around a vertex
	return vectors.map((v,i,arr) => {
		let nextV = arr[(i+1)%arr.length];
		return RabbitEar.math.core.geometry.counter_clockwise_angle2(v, nextV);
	}).map((_, i, arr) => {
		// for every sector, get an array of all the OTHER sectors
		let a = arr.slice();
		a.splice(i,1);
		return a;
	}).map(a => kawasaki_from_even(a))
	.map((kawasakis, i, arr) =>
		// change these relative angle solutions to absolute angles
		(kawasakis == null
			? undefined
			: vectors_as_angles[i] + kawasakis[1])
	).map(k => (k === undefined)
		// convert to vectors
		? undefined
		: [Math.cos(k), Math.sin(k)]
	);
}

export function kawasaki_collapse(graph, vertex, face, crease_direction = "F") {
	let kawasakis = kawasaki_solutions(graph, vertex);
	let origin = graph.vertices_coords[vertex];
	PlanarGraph.split_convex_polygon(graph, face, origin, kawasakis[face], crease_direction);
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
		Geom.core.algebra.multiply_vector2_matrix2(point, faces_matrix[vertex_in_face[i]]).map((n) => 
			Geom.core.clean_number(n)
		)
	)
	fold.frame_classes = ["foldedState"];
	fold.vertices_coords = new_vertices_coords_cp;
	return fold;
}
