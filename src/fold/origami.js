/**
 * Each of these should return an array of Edges
 * 
 * Each of the axioms create full-page crease lines
 *  ending at the boundary; in non-convex paper, this
 *  could result in multiple edges
 */

// "re:boundaries_vertices" = [[5,3,9,7,6,8,1,2]];
// "re:faces_matrix" = [[1,0,0,1,0,0]];

import * as Geom from "../../include/geometry";
import * as Graph from "./graph";
import * as PlanarGraph from "./planargraph";
import { apply_diff, apply_diff_map } from "./diff";

export function universal_molecule(polygon) {

}

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

/**
 * point average, not centroid, must be convex, only useful in certain cases
 */
const make_face_center = function(graph, face_index) {
	return graph.faces_vertices[face_index]
		.map(v => graph.vertices_coords[v])
		.reduce((a,b) => [a[0]+b[0], a[1]+b[1]], [0,0])
		.map(el => el/graph.faces_vertices[face_index].length);
}

/**
 * the crease line is defined by point, vector, happening on face_index
 */
const pointSidedness = function(point, vector, face_center, face_color) {
	let vec2 = [face_center[0] - point[0], face_center[1] - point[1]];
	let det = vector[0] * vec2[1] - vector[1] * vec2[0];
	return face_color ? det > 0 : det < 0;
}

const prepare_to_fold = function(graph, point, vector, face_index) {
	let faces_count = graph.faces_vertices.length;
	graph["re:faces_folding"] = Array.from(Array(faces_count));
	graph["re:faces_preindex"] = Array.from(Array(faces_count)).map((_,i)=>i);
	graph["re:faces_coloring"] = Graph.faces_coloring(graph, face_index);
	graph["re:faces_matrix"] = PlanarGraph.make_faces_matrix_inv(graph, face_index);
	graph["re:faces_creases"] = graph["re:faces_matrix"]
		.map(mat => Geom.core.multiply_line_matrix2(point, vector, mat));
	graph["re:faces_center"] = Array.from(Array(faces_count))
		.map((_, i) => make_face_center(graph, i));
	graph["re:faces_sidedness"] = Array.from(Array(faces_count))
		.map((_, i) => pointSidedness(
			graph["re:faces_creases"][i][0],
			graph["re:faces_creases"][i][1],
			graph["re:faces_center"][i],
			graph["re:faces_coloring"][i]
		));
}

const prepare_extensions = function(graph) {
	let faces_count = graph.faces_vertices.length;
	if (graph["re:faces_layer"] == null) { // this isn't exactly good. it works with 1 face
		graph["re:faces_layer"] = Array.from(Array(faces_count)).map(_ => 0);
	}
	if (graph["re:face_stationary"] == null) {
		graph["re:face_stationary"] = 0;
	}
	if (graph["re:faces_to_move"] == null) {
		graph["re:faces_to_move"] = Array.from(Array(faces_count)).map(_ => false);
	}
}

/**
 * this returns a copy of the graph with new crease lines.
 * modifying the input graph with "re:" keys
 * make sure graph at least follows fold file format
 * any additional keys will be copied over.
 */

// for now, this uses "re:faces_layer", todo: use faceOrders
export const crease_through_layers = function(graph, point, vector, face_index, crease_direction = "V") {
	// console.log("+++++++++++++++++++++++ crease_through_layers");

	let opposite_crease = 
		(crease_direction === "M" || crease_direction === "m" ? "V" : "M");
	if (face_index == null) {
		// an unset face will be the face under the point. or if none, index 0
		let containing_point = PlanarGraph.face_containing_point(graph, point);
		face_index = (containing_point === undefined) ? 0 : containing_point;
	}

	prepare_extensions(graph);
	prepare_to_fold(graph, point, vector, face_index);

	// let folded = JSON.parse(JSON.stringify(graph));
	let folded = Graph.clone(graph);

	let faces_count = graph.faces_vertices.length;
	Array.from(Array(faces_count)).map((_,i) => i).reverse()
		.forEach(i => {
			let diff = PlanarGraph.split_convex_polygon(
				folded, i,
				folded["re:faces_creases"][i][0],
				folded["re:faces_creases"][i][1],
				folded["re:faces_coloring"][i] ? crease_direction : opposite_crease
			);
			if (diff == null || diff.faces == null) { return; }
			// console.log("face_stationary", graph["re:face_stationary"]);
			// console.log("diff", diff);
			diff.faces.replace.forEach(replace => 
				replace.new.map(el => el.index)
					.map(index => index + diff.faces.map[index]) // new indices post-face removal
					.forEach(i => {
						folded["re:faces_center"][i] = make_face_center(folded, i);
						folded["re:faces_sidedness"][i] = pointSidedness(
							graph["re:faces_creases"][replace.old][0],
							graph["re:faces_creases"][replace.old][1],
							folded["re:faces_center"][i],
							graph["re:faces_coloring"][replace.old]
						);
						folded["re:faces_layer"][i] = graph["re:faces_layer"][replace.old];
						folded["re:faces_preindex"][i] = graph["re:faces_preindex"][replace.old];
					})
			)
		});
	folded["re:faces_layer"] = foldLayers(
		folded["re:faces_layer"],
		folded["re:faces_sidedness"]
	);

	// update stationary face with new face.
	let new_face_stationary = folded["re:faces_preindex"]
		.map((f, i) => ({face: f, i: i}))
		.filter(el => el.face === folded["re:face_stationary"])
		.filter(el => !folded["re:faces_sidedness"][el.i])
		.map(el => el.i)
		.shift();
	if (new_face_stationary != null) {
		folded["re:face_stationary"] = new_face_stationary;
	}
	// update colorings
	let original_stationary_coloring = graph["re:faces_coloring"][graph["re:face_stationary"]];
	folded["re:faces_coloring"] = Graph.faces_coloring(folded, new_face_stationary);

	// console.log("original stationary", graph["re:face_stationary"])
	// console.log("original coloring", graph["re:faces_coloring"][graph["re:face_stationary"]]);
	return folded;
}

export function crease_folded(graph, point, vector, face_index) {
	// if face isn't set, it will be determined by whichever face
	// is directly underneath point. or if none, index 0.
	if (face_index == null) {
		face_index = PlanarGraph.face_containing_point(graph, point);
		if(face_index === undefined) { face_index = 0; }
	}
	let primaryLine = Geom.Line(point, vector);
	let coloring = Graph.faces_coloring(graph, face_index);
	PlanarGraph.make_faces_matrix_inv(graph, face_index)
		.map(m => primaryLine.transform(m))
		.reverse()
		.forEach((line, reverse_i, arr) => {
			let i = arr.length - 1 - reverse_i;
			let diff = PlanarGraph.split_convex_polygon(graph, i, line.point, line.vector, coloring[i] ? "M" : "V");
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
	let line = Geom.core.axiom[1](pointA, pointB);
	return crease_line(graph, line[0], line[1]);
}
export function axiom2(graph, pointA, pointB) {
	let line = Geom.core.axiom[2](pointA, pointB);
	return crease_line(graph, line[0], line[1]);
}
export function axiom3(graph, pointA, vectorA, pointB, vectorB) {
	let lines = Geom.core.axiom[3](pointA, vectorA, pointB, vectorB);
	// todo: each iteration needs to apply the diff to the prev iterations
	// return lines.map(line => crease_line(graph, line[0], line[1]))
	// 	.reduce((a,b) => a.concat(b), []);
	return crease_line(graph, lines[0][0], lines[0][1]);
}
export function axiom4(graph, pointA, vectorA, pointB) {
	let line = Geom.core.axiom[4](pointA, vectorA, pointB);
	return crease_line(graph, line[0], line[1]);
}
export function axiom5(graph, pointA, vectorA, pointB, pointC) {
	let line = Geom.core.axiom[5](pointA, vectorA, pointB, pointC);
	return crease_line(graph, line[0], line[1]);
}
export function axiom6(graph, pointA, vectorA, pointB, vectorB, pointC, pointD) {
	let line = Geom.core.axiom[6](pointA, vectorA, pointB, vectorB, pointC, pointD);
	return crease_line(graph, line[0], line[1]);
}
export function axiom7(graph, pointA, vectorA, pointB, vectorB, pointC) {
	let line = Geom.core.axiom[7](pointA, vectorA, pointB, vectorB, pointC);
	return crease_line(graph, line[0], line[1]);
}

// export function creaseLine(graph, point, vector) {
// 	// todo idk if this is done
// 	let ray = Geom.Line(point, vector);
// 	graph.faces_vertices.forEach(face => {
// 		let points = face.map(v => graph.vertices_coords[v]);
// 		Geom.core.intersection.clip_line_in_convex_poly(points, point, vector);
// 	})
// 	return crease_line(graph, line[0], line[1]);
// }

export function creaseRay(graph, point, vector) {
	// todo idk if this is done
	let ray = Geom.Ray(point, vector);
	graph.faces_vertices.forEach(face => {
		let points = face.map(v => graph.vertices_coords[v]);
		Geom.core.intersection.clip_ray_in_convex_poly(points, point, vector);
	})
	return crease_line(graph, line[0], line[1]);
}

export const creaseSegment = function(graph, a, b, c, d) {
	// let edge = Geom.Edge([a, b, c, d]);
	let edge = Geom.Edge([a, b]);
	let edge_vertices = [0,1]
		.map((_,e) => graph.vertices_coords
			.map(v => Math.sqrt(Math.pow(edge[e][0]-v[0],2)+Math.pow(edge[e][1]-v[1],2)))
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
// 		return RabbitEar.math.core.counter_clockwise_angle2(v, nextV);
// 	});
// }

let vertex_adjacent_vectors = function(graph, vertex) {
	let adjacent = graph.vertices_vertices[vertex];
	return adjacent.map(v => [
		graph.vertices_coords[v][0] - graph.vertices_coords[vertex][0],
		graph.vertices_coords[v][1] - graph.vertices_coords[vertex][1]
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
		return Geom.core.counter_clockwise_angle2(v, nextV);
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
	if (fold["re:face_stationary"] != null) {
		face = fold["re:face_stationary"];
	}
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
	fold.frame_classes = ["foldedForm"];
	fold.vertices_coords = new_vertices_coords_cp;
	return fold;
}


export const fold_vertices_coords = function(fold, face) {
	if (fold["re:face_stationary"] != null) {
		face = fold["re:face_stationary"];
	}
	if (face == null) { face = 0; }
	let faces_matrix = PlanarGraph.make_faces_matrix(fold, face);
	let vertex_in_face = fold.vertices_coords.map((v,i) => {
		for(let f = 0; f < fold.faces_vertices.length; f++) {
			if (fold.faces_vertices[f].includes(i)){ return f; }
		}
	});
	return fold.vertices_coords.map((point,i) =>
		Geom.core.multiply_vector2_matrix2(point, faces_matrix[vertex_in_face[i]]).map((n) => 
			Geom.core.clean_number(n)
		)
	)
}
