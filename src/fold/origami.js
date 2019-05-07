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
import * as File from "./file";

export function build_folded_frame(graph, face_stationary) {
	if (face_stationary == null) {
		face_stationary = 0;
		console.warn("build_folded_frame was not supplied a stationary face");
	}
	// console.log("build_folded_frame", graph, face_stationary);
	let faces_matrix = PlanarGraph.make_faces_matrix(graph, face_stationary);
	let vertices_coords = fold_vertices_coords(graph, face_stationary, faces_matrix);
	return {
		vertices_coords,
		frame_classes: ["foldedForm"],
		frame_inherit: true,
		frame_parent: 0, // this is not always the case. maybe shouldn't imply this here.
		// "re:face_stationary": face_stationary,
		"re:faces_matrix": faces_matrix
	};
}

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
	graph["re:faces_preindex"] = Array.from(Array(faces_count)).map((_,i)=>i);
	// graph["re:faces_coloring"] = Graph.faces_coloring(graph, face_index);

	if (graph.file_frames != null
		&& graph.file_frames.length > 0
		&& graph.file_frames[0]["re:faces_matrix"] != null
		&& graph.file_frames[0]["re:faces_matrix"].length === faces_count) {
		// console.log("prepare_to_fold found faces matrix from last fold", graph.file_frames[0]["re:faces_matrix"]);
		graph["re:faces_matrix"] = JSON.parse(JSON.stringify(graph.file_frames[0]["re:faces_matrix"]));
	} else {
		// console.log("prepare_to_fold creating new faces matrix");
		graph["re:faces_matrix"] = PlanarGraph.make_faces_matrix(graph, face_index);
	}

	graph["re:faces_coloring"] = Graph.faces_matrix_coloring(graph["re:faces_matrix"]);

	// crease lines are calculated using each face's INVERSE matrix
	graph["re:faces_creases"] = graph["re:faces_matrix"]
		.map(mat => Geom.core.make_matrix2_inverse(mat))
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
	if (graph["re:faces_layer"] == null) {
		// valid solution only when there is 1 face
		graph["re:faces_layer"] = Array.from(Array(faces_count)).map(_ => 0);
	}
	// if (graph["re:face_stationary"] == null) {
	// 	graph["re:face_stationary"] = 0;
	// }
	if (graph["re:faces_to_move"] == null) {
		graph["re:faces_to_move"] = Array.from(Array(faces_count)).map(_ => false);
	}
}

// export const point_in_folded_face = function(graph, point) {
// 	let mats = PlanarGraph.make_faces_matrix_inv(graph, cpView.cp["re:face_stationary"]);
// 	let transformed_points = mats.map(m => Geom.core.multiply_vector2_matrix2(point, m));

// 	let circles = transformedPoints.map(p => cpView.drawLayer.circle(p[0], p[1], 0.01));
// 	// console.log(circles);
// 	let point_in_poly = transformedPoints.map((p,i) => faces[i].contains(p));

// 	PlanarGraph.faces_containing_point({}, point) 
// }

/**
 * this returns a copy of the graph with new crease lines.
 * modifying the input graph with "re:" keys
 * make sure graph at least follows fold file format
 * any additional keys will be copied over.
 */

// for now, this uses "re:faces_layer", todo: use faceOrders
export const crease_through_layers = function(graph, point, vector, face_index, crease_direction = "V") {
	// console.log("+++++++++ crease_through_layers", point, vector, face_index);

	let opposite_crease = 
		(crease_direction === "M" || crease_direction === "m" ? "V" : "M");
	if (face_index == null) {
		// an unset face will be the face under the point. or if none, index 0
		let containing_point = PlanarGraph.face_containing_point(graph, point);
		// todo, if it's still unset, find the point 
		face_index = (containing_point === undefined) ? 0 : containing_point;
	}

	prepare_extensions(graph);
	prepare_to_fold(graph, point, vector, face_index);

	let folded = File.clone(graph);
	// let folded = JSON.parse(JSON.stringify(graph));

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

	let new_face_stationary, old_face_stationary;
	for (var i = 0; i < folded["re:faces_preindex"].length; i++) {
		if (!folded["re:faces_sidedness"][i]) {
			old_face_stationary = folded["re:faces_preindex"][i];
			new_face_stationary = i
			break;
		}
	}

	let first_matrix;
	if (new_face_stationary === undefined) {
		first_matrix = Geom.core.make_matrix2_reflection(vector, point);
		first_matrix = Geom.core.multiply_matrices2(first_matrix, graph["re:faces_matrix"][0]);
		new_face_stationary = 0; // can be any face;
	} else {
		first_matrix = graph["re:faces_matrix"][old_face_stationary];
	}

	let folded_faces_matrix = PlanarGraph
		.make_faces_matrix(folded, new_face_stationary)
		.map(m => Geom.core.multiply_matrices2(first_matrix, m));

	folded["re:faces_coloring"] = Graph.faces_matrix_coloring(folded_faces_matrix);

	let folded_vertices_coords = fold_vertices_coords(folded, new_face_stationary, folded_faces_matrix);
	let folded_frame = {
		vertices_coords: folded_vertices_coords,
		frame_classes: ["foldedForm"],
		frame_inherit: true,
		frame_parent: 0, // this is not always the case. maybe shouldn't imply this here.
		// "re:face_stationary": new_face_stationary,
		"re:faces_matrix": folded_faces_matrix
	};

	folded.file_frames = [folded_frame];

	// let need_to_remove = [
	// 	"re:faces_center",
	// 	"re:faces_coloring",
	// 	"re:faces_creases",
	// 	"re:faces_layer",
	// 	"re:faces_matrix",
	// 	"re:faces_preindex",
	// 	"re:faces_sidedness",
	// 	"re:faces_to_move"
	// ];

	return folded;
}

// export function crease_folded(graph, point, vector, face_index) {
// 	// if face isn't set, it will be determined by whichever face
// 	// is directly underneath point. or if none, index 0.
// 	if (face_index == null) {
// 		face_index = PlanarGraph.face_containing_point(graph, point);
// 		if(face_index === undefined) { face_index = 0; }
// 	}
// 	let primaryLine = Geom.Line(point, vector);
// 	let coloring = Graph.faces_coloring(graph, face_index);
// 	PlanarGraph.make_faces_matrix_inv(graph, face_index)
// 		.map(m => primaryLine.transform(m))
// 		.reverse()
// 		.forEach((line, reverse_i, arr) => {
// 			let i = arr.length - 1 - reverse_i;
// 			let diff = PlanarGraph.split_convex_polygon(graph, i, line.point, line.vector, coloring[i] ? "M" : "V");
// 		});
// }

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

/**
 * this modifies vertices_coords, edges_vertices, with no regard to 
 * the other arrays - re-build all other edges_, faces_, vertices_
 */ 
export const creaseSegment = function(graph, a, b, c, d) {
	// the input parameter
	let edge = Geom.Edge([a, b]);

	let edges = graph.edges_vertices
		.map(ev => ev.map(v => graph.vertices_coords[v]));

	let edge_collinear_a = edges
		.map(e => Geom.core.intersection.point_on_edge(e[0], e[1], edge[0]))
		.map((on_edge, i) => on_edge ? i : undefined)
		.filter(a => a !== undefined)
		.shift();
	let edge_collinear_b = edges
		.map(e => Geom.core.intersection.point_on_edge(e[0], e[1], edge[1]))
		.map((on_edge, i) => on_edge ? i : undefined)
		.filter(a => a !== undefined)
		.shift();
	let vertex_equivalent_a = graph.vertices_coords
		.map(v => Math.sqrt(Math.pow(edge[0][0]-v[0], 2) +
		                    Math.pow(edge[0][1]-v[1], 2)))
		.map((d,i) => d < 1e-8 ? i : undefined)
		.filter(el => el !== undefined)
		.shift();
	let vertex_equivalent_b = graph.vertices_coords
		.map(v => Math.sqrt(Math.pow(edge[1][0]-v[0], 2) +
		                    Math.pow(edge[1][1]-v[1], 2)))
		.map((d,i) => d < 1e-8 ? i : undefined)
		.filter(el => el !== undefined)
		.shift();

	// the new edge
	let edge_vertices = [];
	// don't remove things until very end, make sure indices match
	let edges_to_remove = [];
	// at each new index, which edge did this edge come from
	let edges_index_map = [];


	// if (vertex_equivalent_a !== undefined && vertex_equivalent_b !== undefined) {
	// 	let edge_already_exists = graph.edges_vertices.filter(ev => 
	// 		(ev[0] === vertex_equivalent_a && ev[1] === vertex_equivalent_b) ||
	// 		(ev[0] === vertex_equivalent_b && ev[1] === vertex_equivalent_a)
	// 	);
	// 	if(edge_already_exists.length > 0) { console.log("found already edge"); console.log(edge_already_exists); return; }
	// }

	if (vertex_equivalent_a !== undefined) {
		// easy, assign point
		edge_vertices[0] = vertex_equivalent_a;
	} else {
		// create new vertex
		graph.vertices_coords.push([edge[0][0], edge[0][1]]);
		let vertex_new_index = graph.vertices_coords.length - 1;
		edge_vertices[0] = vertex_new_index;
		if (edge_collinear_a !== undefined) {
			// rebuild old edge with two edges, new vertex inbetween
			edges_to_remove.push(edge_collinear_a);
			let edge_vertices_old = graph.edges_vertices[edge_collinear_a];
			graph.edges_vertices.push([edge_vertices_old[0], vertex_new_index]);
			graph.edges_vertices.push([vertex_new_index, edge_vertices_old[1]]);
			// these new edges came from this old edge
			edges_index_map[graph.edges_vertices.length - 2] = edge_collinear_a;
			edges_index_map[graph.edges_vertices.length - 1] = edge_collinear_a;
		}
	}

	if (vertex_equivalent_b !== undefined) {
		// easy, assign point
		edge_vertices[1] = vertex_equivalent_b;
	} else {
		// create new vertex
		graph.vertices_coords.push([edge[1][0], edge[1][1]]);
		let vertex_new_index = graph.vertices_coords.length - 1;
		edge_vertices[1] = vertex_new_index;
		if (edge_collinear_b !== undefined) {
			// rebuild old edge with two edges, new vertex inbetween
			edges_to_remove.push(edge_collinear_b);
			let edge_vertices_old = graph.edges_vertices[edge_collinear_b];
			graph.edges_vertices.push([edge_vertices_old[0], vertex_new_index]);
			graph.edges_vertices.push([vertex_new_index, edge_vertices_old[1]]);
			// these new edges came from this old edge
			edges_index_map[graph.edges_vertices.length - 2] = edge_collinear_b;
			edges_index_map[graph.edges_vertices.length - 1] = edge_collinear_b;
		}
	}

	// edges_to_remove.sort((a,b) => a-b);
	// for(var i = edges_to_remove.length-1; i >= 0; i--) {
	// 	graph.edges_vertices.splice(i, 1);
	// }

	graph.edges_vertices.push(edge_vertices);
	graph.edges_assignment[graph.edges_vertices.length-1] = "F";

	let diff = {
		edges_new: [graph.edges_vertices.length-1],
		edges_to_remove: edges_to_remove,
		edges_index_map
	}
	return diff;
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
// 		return Geom.core.counter_clockwise_angle2(v, nextV);
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


export const fold_vertices_coords = function(graph, face_stationary, faces_matrix) {
	if (face_stationary == null) {
		console.warn("fold_vertices_coords was not supplied a stationary face");
		face_stationary = 0;
	}
	if (faces_matrix == null) {
		faces_matrix = PlanarGraph.make_faces_matrix(graph, face_stationary);
	}
	let vertex_in_face = graph.vertices_coords.map((v,i) => {
		for(let f = 0; f < graph.faces_vertices.length; f++) {
			if (graph.faces_vertices[f].includes(i)){ return f; }
		}
	});
	return graph.vertices_coords.map((point,i) =>
		Geom.core.multiply_vector2_matrix2(point, faces_matrix[vertex_in_face[i]]).map((n) => 
			Geom.core.clean_number(n)
		)
	)
}
