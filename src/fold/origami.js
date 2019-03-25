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
import { apply_diff, apply_diff_map } from "./diff";

// for now, this uses "re:faces_layer", todo: use faceOrders
export function crease_through_layers(graph, point, vector, stay_normal, crease_direction = "V") {
	console.log("_______________ crease_through_layers");
	console.log(graph.json);
	let face_index;
	let opposite_crease = 
		(crease_direction === "M" || crease_direction === "m" ? "V" : "M");
	// if face isn't set, it will be determined by whichever face
	// is directly underneath point. or if none, index 0.
	let face_centroid;
	if (face_index == null) {
		face_index = PlanarGraph.face_containing_point(graph, point);
		if(face_index === undefined) { face_index = 0; }
	} else {
		let points = graph.faces_vertices(face => face.map(fv => graph.vertices_coords[fv]));
		face_centroid = Geom.Polygon(points).center;
		console.log("did this work");
		console.log(face_centroid);
	}
	let creaseLine = Geom.Line(point, vector);
	let stayNormalVec = Geom.Vector(stay_normal);

	// let graph_faces_coloring = graph["re:faces_coloring"] != null
	// 	? graph["re:faces_coloring"]
	// 	: Graph.faces_coloring(graph, face_index);

	let folded = [];
	// todo: replace these with a get_faces_length that checks edges too
	let faces_to_move = graph["re:faces_to_move"] != null
		? graph["re:faces_to_move"]
		: Array.from(Array(graph.faces_vertices.length)).map(_ => false);

	// todo: replace this. this doesn't work
	let graph_faces_layer = graph["re:faces_layer"] != null
		? graph["re:faces_layer"]
		: Array.from(Array(graph.faces_vertices.length)).map(_ => 0);

	let faces_matrix = PlanarGraph.make_faces_matrix_inv(graph, face_index);
	let faces_crease_line = faces_matrix.map(m => creaseLine.transform(m));
	let faces_stay_normal = faces_matrix.map(m => stayNormalVec.transform(m));
	let faces_coloring = Graph.faces_coloring(graph, face_index);
	let faces_folding = Array.from(Array(graph.faces_vertices.length));

	faces_crease_line
		.reverse()
		.forEach((line, reverse_i, arr) => {
			let i = arr.length - 1 - reverse_i;
			let diff = PlanarGraph.split_convex_polygon(graph, i, line.point,
				line.vector, faces_coloring[i] ? crease_direction : opposite_crease);
			if (diff != null && diff.faces != null) {
				let face_stay_normal = faces_stay_normal[i];
				diff.faces.replace.forEach(replace => {
					// center of two faces - b/c convex, able to do a quick average
					let two_face_centers = replace.new
						.map(el => el.index + diff.faces.map[el.index])
						.map(i => graph.faces_vertices[i])
						.map(fv => fv.map(v => graph.vertices_coords[v]))
						.map(face => 
							face.reduce((a,b) => [a[0]+b[0], a[1]+b[1]], [0,0])
								.map(el => el/face.length)
						).map(p => Geom.Vector(p))
					let two_face_vectors = [
						two_face_centers[0].subtract(two_face_centers[1]),
						two_face_centers[1].subtract(two_face_centers[0]),
					];

					// "left";
					let two_face_should_move = two_face_centers
						.map(c => c.subtract(line.point))
						.map(v2 => faces_coloring[replace.old]
							? line.vector.cross(v2).z > 0
							: line.vector.cross(v2).z < 0);

					// let two_face_dots = two_face_vectors.map(v => v.dot(face_stay_normal));
					// let two_face_should_move = two_face_dots.map(d => d < 0);

					// console.log("______(this face)_______");
					// console.log("two_face_should_move", two_face_should_move);
					// console.log("coloring", faces_coloring[replace.old]);
					// console.log("two_face_centers", two_face_centers);
					// console.log("two_face_vectors", two_face_vectors);
					// console.log("two_face_dots", two_face_dots);
					// console.log("A+", two_face_centers.map(c => c.subtract(line.point)))
					// console.log("two_face_should_move_cross", two_face_should_move_cross);

					// console.log("faces_to_move[replace.old]", faces_to_move[replace.old]);

					// delete graph_faces_coloring[replace.old];
					replace.new.forEach((newFace, i) => {
						// console.log("adding new face at ", newFace.index);
						// graph_faces_coloring[newFace.index] = colors[i]
						faces_to_move[newFace.index] = faces_to_move[replace.old] || two_face_should_move[i];
						graph_faces_layer[newFace.index] = graph_faces_layer[replace.old];
						faces_folding[newFace.index] = two_face_should_move[i];
						faces_coloring[newFace.index] = two_face_should_move[i]; // not sure if this is right. or if we need it
						console.log("making a new face: coloring is ", faces_coloring[replace.old], " faces_folding is ", faces_folding[newFace.index] );
					});
				})
				// diff.faces.map.forEach((change, index) => graph_faces_coloring[index+change] = graph_faces_coloring[index]);
				// if (graph_faces_coloring["-1"] != null) { delete graph_faces_coloring["-1"] }
				// graph_faces_coloring.pop();

				// console.log("+++++++");
				// console.log(diff.faces);
				// console.log(diff.faces.map);
				// console.log( JSON.parse(JSON.stringify(faces_to_move)) );
				// todo, if we add more places where faces get removed, add their indices here
				let removed_faces_index = diff.faces.replace.map(el => el.old);
				removed_faces_index.forEach(i => {
					delete faces_to_move[i];
					delete graph_faces_layer[i];
					delete faces_folding[i]
				});
				diff.faces.map.forEach((change, i) => {
					if (!removed_faces_index.includes(i)) {
						faces_to_move[i + change] = faces_to_move[i];
						graph_faces_layer[i + change] = graph_faces_layer[i];
						faces_folding[i + change] = faces_folding[i];
					}
				})
				let faces_remove_count = diff.faces.map[diff.faces.map.length-1];
				// console.log("faces_remove_count", faces_remove_count);
				faces_to_move = faces_to_move
					.slice(0, faces_to_move.length + faces_remove_count);
				graph_faces_layer = graph_faces_layer
					.slice(0, graph_faces_layer.length + faces_remove_count);
				faces_folding = faces_folding
					.slice(0, faces_folding.length + faces_remove_count);

				// console.log(JSON.parse(JSON.stringify(faces_to_move)));
				// console.log("--------");

				faces_folding.forEach((f,i) => {
					if (f == null) {
						let face_center = graph.faces_vertices[i]
							.map(v => graph.vertices_coords[v])
							.reduce((a,b) => [a[0]+b[0], a[1]+b[1]], [0,0])
							.map(el => el/graph.faces_vertices[i].length)
						let face_center_vec = Geom.Vector(face_center);

						let v2 = face_center_vec.subtract(line.point);
						let should_fold = !faces_coloring[i]
								? line.vector.cross(v2).z > 0
								: line.vector.cross(v2).z < 0;
						faces_folding[i] = should_fold;
						console.log("filling in a line: coloring is ", faces_coloring[i], " faces_folding is ", should_fold );
					}
				});

				// now we know which layers are being folded

				// shuffle layers in faces layers
				let lastLayer = graph_faces_layer.reduce((a,b) => a > b ? a : b , -Infinity);
				let foldingLayers = faces_folding
					.map((m,i) => m ? i : undefined)
					.filter(el => el !== undefined);
				// foldingLayers.forEach((l,i) => graph_faces_layer[l] = lastLayer + i + 1);
				let folding_layer_order = foldingLayers.slice()
					.map((el,i) => ({el:el, i:i}))
					.sort((a,b) => b.el - a.el)
					// .sort((a,b) => a.el - b.el)
					.map(el => el.i);
				folding_layer_order.forEach((order,i) => 
					graph_faces_layer[foldingLayers[order]] = lastLayer + i + 1
				);
				console.log("faces_folding ", faces_folding);
				console.log("layering after " + lastLayer, foldingLayers, folding_layer_order);
			}
		});
	// console.log("faces_folding", faces_folding);
	// graph["re:faces_coloring"] = faces_coloring;
	graph["re:faces_to_move"] = faces_to_move;
	graph["re:faces_layer"] = graph_faces_layer;
	// determine which faces changed
	// console.log(graph);
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
		return Geom.core.geometry.counter_clockwise_angle2(v, nextV);
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
