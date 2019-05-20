import * as Graph from "./graph";
import * as Geom from "../../include/geometry";
import { merge_maps } from "./diff";
import { default as validate } from "./validate";

import {default as convert} from "../official/convert";
import {default as filter} from "../official/filter";

const angle_from_assignment = function(assignment) {
	switch (assignment) {
		case "M":
		case "m":
			return -180;
		case "V":
		case "v":
			return 180;
		default:
			return 0;
	}
}

export const fragment2 = function(graph, epsilon = Geom.core.EPSILON) {
	filter.subdivideCrossingEdges_vertices(graph);
	convert.edges_vertices_to_vertices_vertices_sorted(graph);
	convert.vertices_vertices_to_faces_vertices(graph);
	convert.faces_vertices_to_faces_edges(graph);
	console.log(graph);
	return graph;
}
/**
 * fragment splits overlapping edges at their intersections
 * and joins new edges at a new shared vertex.
 * this destroys and rebuilds all face data with face walking 
 */
export const fragment = function(graph, epsilon = Geom.core.EPSILON) {

	const EPSILON = 1e-12;
	const horizSort = function(a,b){ return a[0] - b[0]; }
	const vertSort = function(a,b){ return a[1] - b[1]; }
	// const horizSort2 = function(a,b){
	// 	return a.intersection[0] - b.intersection[0]; }
	// const vertSort2 = function(a,b){
	// 	return a.intersection[1] - b.intersection[1]; }

	const equivalent = function(a, b) {
		for (var i = 0; i < a.length; i++) {
			if (Math.abs(a[i] - b[i]) > epsilon) {
				return false;
			}
		}
		return true;
	}

	let edge_count = graph.edges_vertices.length;
	let edges = graph.edges_vertices.map(ev => [
		graph.vertices_coords[ev[0]],
		graph.vertices_coords[ev[1]]
	]);

	let edges_vector = edges.map(e => [e[1][0] - e[0][0], e[1][1] - e[0][1]]);
	let edges_magnitude = edges_vector.map(e => Math.sqrt(e[0]*e[0]+e[1]*e[1]));
	let edges_normalized = edges_vector
		.map((e,i) => [e[0]/edges_magnitude[i], e[1]/edges_magnitude[i]]);
	let edges_horizontal = edges_normalized.map(e => Math.abs(e[0]) > 0.7);//.707

	let crossings = Array.from(Array(edge_count - 1)).map(_ => []);
	for (let i = 0; i < edges.length-1; i++) {
		for (let j = i+1; j < edges.length; j++) {
			crossings[i][j] = Geom.core.intersection.edge_edge_exclusive(
				edges[i][0], edges[i][1],
				edges[j][0], edges[j][1]
			)
		}
	}

	let edges_intersections = Array.from(Array(edge_count)).map(_ => []);
	for (let i = 0; i < edges.length-1; i++) {
		for (let j = i+1; j < edges.length; j++) {
			if (crossings[i][j] != null) {
				// warning - these are shallow pointers
				edges_intersections[i].push(crossings[i][j]);
				edges_intersections[j].push(crossings[i][j]);
			}
		}
	}

	// let edges_intersections2 = Array.from(Array(edge_count)).map(_ => []);
	// for (let i = 0; i < edges.length-1; i++) {
	// 	for (let j = i+1; j < edges.length; j++) {
	// 		if (crossings[i][j] != null) {
	// 			// warning - these are shallow pointers
	// 			edges_intersections2[i].push({edge:j, intersection:crossings[i][j]});
	// 			edges_intersections2[j].push({edge:i, intersection:crossings[i][j]});
	// 		}
	// 	}
	// }

	edges.forEach((e,i) => e.sort(edges_horizontal[i] ? horizSort : vertSort));

	edges_intersections.forEach((e,i) => 
		e.sort(edges_horizontal[i] ? horizSort : vertSort)
	)
	// edges_intersections2.forEach((e,i) => 
	// 	e.sort(edges_horizontal[i] ? horizSort2 : vertSort2)
	// )

	let new_edges = edges_intersections
		.map((e,i) => [edges[i][0], ...e, edges[i][1]])
		.map(ev => 
			Array.from(Array(ev.length-1))
				.map((_,i) => [ev[i], ev[(i+1)]])
		);

	// remove degenerate edges
	new_edges = new_edges
		.map(edgeGroup => edgeGroup
			.filter(e => false === e
				.map((_,i) => Math.abs(e[0][i] - e[1][i]) < epsilon)
				.reduce((a,b) => a && b, true)
			)
		);

	// let edge_map = new_edges.map(edge => edge.map(_ => counter++));
	let edge_map = new_edges
		.map((edge,i) => edge.map(_ => i))
		.reduce((a,b) => a.concat(b), []);

	let vertices_coords = new_edges
		.map(edge => edge.reduce((a,b) => a.concat(b), []))
		.reduce((a,b) => a.concat(b), [])
	let counter = 0;
	let edges_vertices = new_edges
		.map(edge => edge.map(_ => [counter++, counter++]))
		.reduce((a,b) => a.concat(b), []);

	let vertices_equivalent = Array
		.from(Array(vertices_coords.length)).map(_ => []);
	for (var i = 0; i < vertices_coords.length-1; i++) {
		for (var j = i+1; j < vertices_coords.length; j++) {
			vertices_equivalent[i][j] = equivalent(
				vertices_coords[i],
				vertices_coords[j]
			);
		}
	}

	// console.log(vertices_equivalent);

	let vertices_map = vertices_coords.map(vc => undefined)

	vertices_equivalent.forEach((row,i) => row.forEach((eq,j) => {
		if (eq){
			vertices_map[j] = vertices_map[i] === undefined ? i : vertices_map[i];
		}
	}));
	let vertices_remove = vertices_map.map(m => m !== undefined);
	vertices_map.forEach((map,i) => {
		if(map === undefined) { vertices_map[i] = i; }
	});

	// console.log("vertices_map", vertices_map);

	edges_vertices.forEach((edge,i) => edge.forEach((v,j) => {
		edges_vertices[i][j] = vertices_map[v];
	}));

	let flat = {
		vertices_coords,
		edges_vertices
	}

	// console.log("edges_vertices", edges_vertices);
	// console.log("vertices_remove", vertices_remove);
	let vertices_remove_indices = vertices_remove
		.map((rm,i) => rm ? i : undefined)
		.filter(i => i !== undefined);
	Graph.remove_vertices(flat, vertices_remove_indices);

	// console.log(flat);

	convert.edges_vertices_to_vertices_vertices_sorted(flat);
	convert.vertices_vertices_to_faces_vertices(flat);
	convert.faces_vertices_to_faces_edges(flat);

	return flat;
}

/**
 * @returns index of nearest vertex in vertices_ arrays or
 *  undefined if there are no vertices_coords
 */
export const nearest_vertex = function(graph, point) {
	if (graph.vertices_coords == null || graph.vertices_coords.length === 0) {
		return undefined;
	}
	let p = [...point];
	if (p[2] == null) { p[2] = 0; }
	return graph.vertices_coords.map(v => v
		.map((n,i) => Math.pow(n - p[i], 2))
		.reduce((a,b) => a + b,0)
	).map((n,i) => ({d:Math.sqrt(n), i:i}))
	.sort((a,b) => a.d - b.d)
	.shift()
	.i;
};

/**
 * returns index of nearest edge in edges_ arrays or
 *  undefined if there are no vertices_coords or edges_vertices
 */
export const nearest_edge = function(graph, point) {
	if (graph.vertices_coords == null || graph.vertices_coords.length === 0 ||
		graph.edges_vertices == null || graph.edges_vertices.length === 0) {
		return undefined;
	}
	// todo, z is not included in the calculation
	return graph.edges_vertices
		.map(e => e.map(ev => graph.vertices_coords[ev]))
		.map(e => Geom.Edge(e))
		.map((e,i) => ({e:e, i:i, d:e.nearestPoint(point).distanceTo(point)}))
		.sort((a,b) => a.d - b.d)
		.shift()
		.i;
};

/**
 * someday this will implement facesOrders. right now just faces_re:layer
 * leave faces_options empty to search all faces
 */
export const topmost_face = function(graph, faces_options) {
	if (faces_options == null) {
		faces_options = Array.from(Array(graph.faces_vertices.length))
			.map((_,i) => i);
	}
	if (faces_options.length === 0) { return undefined; }
	if (faces_options.length === 1) { return faces_options[0]; }

	// top to bottom
	let faces_in_order = graph["faces_re:layer"]
		.map((layer,i) => ({layer:layer, i:i}))
		.sort((a,b) => b.layer - a.layer)
		.map(el => el.i)

	for (var i = 0; i < faces_in_order.length; i++) {
		if (faces_options.includes(faces_in_order[i])) {
			return faces_in_order[i];
		}
	}
}

export const face_containing_point = function(graph, point) {
	if (graph.vertices_coords == null || graph.vertices_coords.length === 0 ||
		graph.faces_vertices == null || graph.faces_vertices.length === 0) {
		return undefined;
	}
	let face = graph.faces_vertices
		.map((fv,i) => ({face: fv.map(v => graph.vertices_coords[v]), i: i}))
		.filter(f => Geom.core.intersection.point_in_poly(point, f.face))
		.shift()
	return (face == null ? undefined : face.i);
};

export const folded_faces_containing_point = function(graph, point, faces_matrix) {
	let transformed_points = faces_matrix
		.map(m => Geom.core.multiply_vector2_matrix2(point, m));
	return graph.faces_vertices
		.map((fv,i) => ({face: fv.map(v => graph.vertices_coords[v]), i: i}))
		.filter((f,i) => Geom.core.intersection.point_in_poly(transformed_points[i], f.face))
		.map(f => f.i);
}

export const faces_containing_point = function(graph, point) {
	if (graph.vertices_coords == null || graph.vertices_coords.length === 0 ||
		graph.faces_vertices == null || graph.faces_vertices.length === 0) {
		return undefined;
	}
	return graph.faces_vertices
		.map((fv,i) => ({face: fv.map(v => graph.vertices_coords[v]), i: i}))
		.filter(f => Geom.core.intersection.point_in_poly(point, f.face))
		.map(f => f.i);
};

export const make_faces_matrix = function(graph, root_face) {
	let faces_matrix = graph.faces_vertices.map(v => [1,0,0,1,0,0]);
	Graph.make_face_walk_tree(graph, root_face).forEach((level) =>
		level.filter((entry) => entry.parent != null).forEach((entry) => {
			let edge = entry.edge.map(v => graph.vertices_coords[v])
			let vec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
			let local = Geom.core.make_matrix2_reflection(vec, edge[0]);
			faces_matrix[entry.face] =
				Geom.core.multiply_matrices2(faces_matrix[entry.parent], local);
		})
	);
	return faces_matrix;
}

export const make_faces_matrix_inv = function(graph, root_face) {
	let faces_matrix = graph.faces_vertices.map(v => [1,0,0,1,0,0]);
	Graph.make_face_walk_tree(graph, root_face).forEach((level) =>
		level.filter((entry) => entry.parent != null).forEach((entry) => {
			let edge = entry.edge.map(v => graph.vertices_coords[v])
			let vec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
			let local = Geom.core.make_matrix2_reflection(vec, edge[0]);
			faces_matrix[entry.face] =
				Geom.core.multiply_matrices2(local, faces_matrix[entry.parent]);
		})
	);
	return faces_matrix;
}

/**
 * @returns {}, description of changes. empty object if no intersection.
 *
 */
export const split_convex_polygon = function(graph, faceIndex, linePoint, lineVector, crease_assignment = "F") {
	// survey face for any intersections which cross directly over a vertex
	let vertices_intersections = graph.faces_vertices[faceIndex]
		.map(fv => graph.vertices_coords[fv])
		.map(v => (Geom.core.intersection.point_on_line(linePoint, lineVector, v)
			? v
			: undefined))
		.map((point, i) => ({
			point: point,
			i_face: i,
			i_vertices: graph.faces_vertices[faceIndex][i]
		}))
		.filter(el => el.point !== undefined);

	// gather all edges of this face which cross the line
	let edges_intersections = graph.faces_edges[faceIndex]
		.map(ei => graph.edges_vertices[ei])
		.map(edge => edge.map(e => graph.vertices_coords[e]))
		.map(edge => Geom.core.intersection.line_edge_exclusive(linePoint, lineVector, edge[0], edge[1]))
		.map((point, i) => ({
			point: point,
			i_face: i,
			i_edges: graph.faces_edges[faceIndex][i]
		}))
		.filter(el => el.point !== undefined);

	// the only cases we care about are
	// - 2 edge intersections
	// - 2 vertices intersections
	// - 1 edge intersection and 1 vertex intersection
	// resolve each case by either gatering vertices (v-intersections) or splitting edges and making new vertices (e-intersections)
	let new_v_indices = [];
	let edge_map = Array.from(Array(graph.edges_vertices.length)).map(_=>0);
	if (edges_intersections.length === 2) {
		new_v_indices = edges_intersections.map((el,i,arr) => {
			let diff = Graph
				.add_vertex_on_edge(graph, el.point[0], el.point[1], el.i_edges);
			arr.slice(i+1)
				.filter(el => diff.edges.map[el.i_edges] != null)
				.forEach(el => el.i_edges += diff.edges.map[el.i_edges]);
			edge_map = merge_maps(edge_map, diff.edges.map);
			return diff.vertices.new[0].index;
		});
	} else if (edges_intersections.length === 1 && vertices_intersections.length === 1) {
		let a = vertices_intersections.map(el => el.i_vertices);
		let b = edges_intersections.map((el,i,arr) => {
			let diff = Graph
				.add_vertex_on_edge(graph, el.point[0], el.point[1], el.i_edges);
			arr.slice(i+1)
				.filter(el => diff.edges.map[el.i_edges] != null)
				.forEach(el => el.i_edges += diff.edges.map[el.i_edges]);
			edge_map = diff.edges.map;
			return diff.vertices.new[0].index;
		});
		new_v_indices = a.concat(b);
	} else if (vertices_intersections.length === 2) {
		new_v_indices = vertices_intersections.map(el => el.i_vertices);
		// check if the proposed edge is collinear to an already existing edge
		let face_v = graph.faces_vertices[faceIndex];
		let v_i = vertices_intersections;
		let match_a = face_v[(v_i[0].i_face+1)%face_v.length] === v_i[1].i_vertices;
		let match_b = face_v[(v_i[1].i_face+1)%face_v.length] === v_i[0].i_vertices;
		if (match_a || match_b) { return {}; }
	} else {
		return {};
	}
	// this results in a possible removal of edges. we now have edge_map marking this change
	// example: [0,0,0,-1,-1,-1,-1,-2,-2,-2]

	// connect an edge splitting the polygon into two, joining the two vertices
	// 1. rebuild the two faces
	//    (a) faces_vertices
	//    (b) faces_edges
	// 2. build the new edge

	// inside our face's faces_vertices, get index location of our new vertices
	// this helps us build both faces_vertices and faces_edges arrays
	let new_face_v_indices = new_v_indices
		.map(el => graph.faces_vertices[faceIndex].indexOf(el))
		.sort((a,b) => a-b);

	// construct data for our new geometry: 2 faces (faces_vertices, faces_edges)
	let new_faces = [{}, {}];
	new_faces[0].vertices = graph.faces_vertices[faceIndex]
		.slice(new_face_v_indices[1])
		.concat(graph.faces_vertices[faceIndex].slice(0, new_face_v_indices[0]+1));
	new_faces[1].vertices = graph.faces_vertices[faceIndex]
		.slice(new_face_v_indices[0], new_face_v_indices[1]+1);
	new_faces[0].edges = graph.faces_edges[faceIndex]
		.slice(new_face_v_indices[1])
		.concat(graph.faces_edges[faceIndex].slice(0, new_face_v_indices[0]))
		.concat([graph.edges_vertices.length]);
	new_faces[1].edges = graph.faces_edges[faceIndex]
		.slice(new_face_v_indices[0], new_face_v_indices[1])
		.concat([graph.edges_vertices.length]);
	new_faces[0].index = graph.faces_vertices.length;
	new_faces[1].index = graph.faces_vertices.length+1;

	// construct data for our new edge (vertices, faces, assignent, foldAngle, length)
	let new_edges = [{
		index: graph.edges_vertices.length,
		vertices: [...new_v_indices],
		assignment: crease_assignment,
		foldAngle: angle_from_assignment(crease_assignment),
		length: Geom.core.distance2(
			...(new_v_indices.map(v => graph.vertices_coords[v]))
		),
		// todo, unclear if these are ordered with respect to the vertices
		faces: [graph.faces_vertices.length, graph.faces_vertices.length+1]
	}];

	// add 1 new edge and 2 new faces to our graph
	let edges_count = graph.edges_vertices.length;
	let faces_count = graph.faces_vertices.length;
	new_faces.forEach((face,i) => Object.keys(face)
		.filter(suffix => suffix !== "index")
		.forEach(suffix => graph["faces_"+suffix][faces_count+i] = face[suffix])
	);
	new_edges.forEach((edge,i) => Object.keys(edge)
		.filter(suffix => suffix !== "index")
		.forEach(suffix => graph["edges_"+suffix][edges_count+i] = edge[suffix])
	);
	// update data that has been changed by edges
	new_edges.forEach((edge, i) => {
		let a = edge.vertices[0];
		let b = edge.vertices[1];
		// todo, it appears these are going in counter-clockwise order, but i don't know why
		graph.vertices_vertices[a].push(b);
		graph.vertices_vertices[b].push(a);
	});

	// rebuild edges_faces, vertices_faces
	// search inside vertices_faces for an occurence of the removed face,
	// determine which of our two new faces needs to be put in its place
	// by checking faces_vertices, by way of this map we build below:
	let v_f_map = {};
	graph.faces_vertices
		.map((face,i) => ({face: face, i:i}))
		.filter(el => el.i === faces_count || el.i === faces_count+1)
		.forEach(el => el.face.forEach(v => {
			if (v_f_map[v] == null) { v_f_map[v] = []; }
			v_f_map[v].push(el.i)
		}));
	graph.vertices_faces
		.forEach((vf,i) => {
			let indexOf = vf.indexOf(faceIndex);
			while (indexOf !== -1) {
				graph.vertices_faces[i].splice(indexOf, 1, ...(v_f_map[i]));
				indexOf = vf.indexOf(faceIndex);
			}
		})
	// the same as above, but making a map of faces_edges to rebuild edges_faces
	let e_f_map = {};
	graph.faces_edges
		.map((face,i) => ({face: face, i:i}))
		.filter(el => el.i === faces_count || el.i === faces_count+1)
		.forEach(el => el.face.forEach(e => {
			if (e_f_map[e] == null) { e_f_map[e] = []; }
			e_f_map[e].push(el.i)
		}));
	graph.edges_faces
		.forEach((ef,i) => {
			let indexOf = ef.indexOf(faceIndex);
			while (indexOf !== -1) {
				graph.edges_faces[i].splice(indexOf, 1, ...(e_f_map[i]));
				indexOf = ef.indexOf(faceIndex);
			}
		});

	// remove faces, adjust all relevant indices
	// console.log(JSON.parse(JSON.stringify(graph["faces_re:coloring"])));
	let faces_map = Graph.remove_faces(graph, [faceIndex]);
	// console.log("removing faceIndex", faces_map);
	// console.log(JSON.parse(JSON.stringify(graph["faces_re:coloring"])));

	// return a diff of the geometry
	return {
		faces: {
			map: faces_map,
			replace: [{
				old: faceIndex,
				new: new_faces
			}]
		},
		edges: {
			new: new_edges,
			map: edge_map
		}
	}
}

/** 
 * when an edge sits inside a face with its endpoints collinear to face edges,
 *  find those 2 face edges.
 * @param [[x, y], [x, y]] edge
 * @param [a, b, c, d, e] face_vertices. just 1 face. not .fold array
 * @param vertices_coords from .fold
 * @return [[a,b], [c,d]] vertices indices of the collinear face edges.
 *         1:1 index relation to edge endpoints.
 */
export const find_collinear_face_edges = function(edge, face_vertices,
	vertices_coords) {
	let face_edge_geometry = face_vertices
		.map((v) => vertices_coords[v])
		.map((v, i, arr) => [v, arr[(i+1)%arr.length]]);
	return edge.map((endPt) => {
		// filter collinear edges to each endpoint, return first one
		// as an edge array index, which == face vertex array between i, i+1
		let i = face_edge_geometry
			.map((edgeVerts, edgeI) => ({index:edgeI, edge:edgeVerts}))
			.filter((e) => Geom.core.intersection
				.point_on_edge(e.edge[0], e.edge[1], endPt)
			).shift()
			.index;
		return [face_vertices[i], face_vertices[(i+1)%face_vertices.length]]
			.sort((a,b) => a-b);
	})
}


export function clip_line(fold, linePoint, lineVector) {
	function len(a,b){
		return Math.sqrt(Math.pow(a[0]-b[0],2) + Math.pow(a[1]-b[1],2));
	}

	let edges = fold.edges_vertices
		.map(ev => ev.map(e => fold.vertices_coords[e]));

	return [lineVector, [-lineVector[0], -lineVector[1]]]
		.map(lv => edges
			.map(e => Geom.core.intersection.ray_edge(linePoint, lv, e[0], e[1]))
			.filter(i => i != null)
			.map(i => ({intersection:i, length:len(i, linePoint)}))
			.sort((a, b) => a.length - b.length)
			.map(el => el.intersection)
			.shift()
		).filter(p => p != null);
}


export const bounding_rect = function(graph) {
	if ("vertices_coords" in graph === false ||
		graph.vertices_coords.length <= 0) {
		return [0,0,0,0];
	}
	let dimension = graph.vertices_coords[0].length;
	let smallest = Array.from(Array(dimension)).map(_ => Infinity);
	let largest = Array.from(Array(dimension)).map(_ => -Infinity);
	graph.vertices_coords.forEach(v => v.forEach((n,i) => {
		if (n < smallest[i]) { smallest[i] = n; }
		if (n > largest[i]) { largest[i] = n; }
	}));
	let x = smallest[0];
	let y = smallest[1];
	let w = largest[0] - smallest[0];
	let h = largest[1] - smallest[1];
	return (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)
		? [0,0,0,0]
		: [x,y,w,h]);
}

const bounding_cube = function(graph) {
}


export const vertex_is_collinear = function(graph) {
	// returns n-sized array matching vertices_ length
	// T/F is a vertex 2-degree between two collinear edges.
	
}

export const remove_collinear_vertices = function(graph) {
	
}
