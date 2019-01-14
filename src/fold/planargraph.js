
import * as Graph from "./graph";
import * as Geom from "../../lib/geometry";

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

export const face_containing_point = function(graph, point) {
	if (graph.vertices_coords == null || graph.vertices_coords.length === 0 ||
		graph.faces_vertices == null || graph.faces_vertices.length === 0) {
		return undefined;
	}
	return graph.faces_vertices
		.map((fv,i) => ({face:fv.map(v => graph.vertices_coords[v]),i:i}))
		.filter(f => Geom.core.intersection.point_in_poly(f.face, point))
		.shift()
		.i;
};

export const faces_containing_point = function(graph, point) {
	if (graph.vertices_coords == null || graph.vertices_coords.length === 0 ||
		graph.faces_vertices == null || graph.faces_vertices.length === 0) {
		return undefined;
	}
	return graph.faces_vertices
		.map((fv,i) => ({face:fv.map(v => graph.vertices_coords[v]),i:i}))
		.filter(f => Geom.core.intersection.point_in_polygon(f.face, point))
		.map(f => f.i);
};


export const make_faces_matrix = function(graph, root_face) {
	let faces_matrix = graph.faces_vertices.map(v => [1,0,0,1,0,0]);
	Graph.make_face_walk_tree(graph, root_face).forEach((level) =>
		level.filter((entry) => entry.parent != undefined).forEach((entry) => {
			let edge = entry.edge.map(v => graph.vertices_coords[v])
			let vec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
			let local = Geom.core.make_matrix2_reflection(vec, edge[0]);
			faces_matrix[entry.face] = Geom.core.multiply_matrices2(faces_matrix[entry.parent], local);
		})
	);
	return faces_matrix;
}

export const make_faces_matrix_inv = function(graph, root_face) {
	let faces_matrix = graph.faces_vertices.map(v => [1,0,0,1,0,0]);
	Graph.make_face_walk_tree(graph, root_face).forEach((level) =>
		level.filter((entry) => entry.parent != undefined).forEach((entry) => {
			let edge = entry.edge.map(v => graph.vertices_coords[v])
			let vec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
			let local = Geom.core.make_matrix2_reflection(vec, edge[0]);
			faces_matrix[entry.face] = Geom.core.multiply_matrices2(local, faces_matrix[entry.parent]);
		})
	);
	return faces_matrix;
}


export function split_convex_polygon(graph, faceIndex, linePoint, lineVector, crease_assignment = "M"){
	let vertices_coords = graph.vertices_coords;
	let edges_vertices = graph.edges_vertices;

	let face_vertices = graph.faces_vertices[faceIndex];
	let face_edges = graph.faces_edges[faceIndex];

	let diff = {
		edges: {} // we are definitely adding edges.. probably
	};

	//    point: intersection [x,y] point or null if no intersection
	// at_index: where in the polygon this occurs
	let vertices_intersections = face_vertices
		.map(fv => vertices_coords[fv])
		.map(v => Geom.core.intersection.point_on_line(linePoint, lineVector, v) ? v : null)
		.map((point, i) => ({ point: point, at_index: i }))
		.filter(el => el.point != null);

	let edges_intersections = face_edges
		.map(ei => edges_vertices[ei])
		.map(edge => edge.map(e => vertices_coords[e]))
		.map(edge => Geom.core.intersection.line_edge_exclusive(linePoint, lineVector, edge[0], edge[1]))
		.map((point, i) => ({point: point, at_index: i, at_real_index: face_edges[i] }))
		.filter(el => el.point != null);

	if(vertices_intersections.length == 0 && edges_intersections.length == 0){
		return {};
	}
	// in the case of edges_intersections, we have new vertices, edges, and faces
	// otherwise in the case of only vertices_intersections, we only have new faces
	if(edges_intersections.length > 0){
		diff.vertices = {};
		diff.vertices.new = edges_intersections.map(el => ({coords:el.point}))
	}
	if(edges_intersections.length > 0){
		diff.edges.replace = edges_intersections
			.map((el, i) => {
				let a = edges_vertices[face_edges[el.at_index]][0];
				let c = edges_vertices[face_edges[el.at_index]][1];
				let b = vertices_coords.length + i;
				return {
					// old_index: el.at_index,
					old_index: el.at_real_index,
					new: [
						{vertices: [a, b]},
						{vertices: [b, c]}
					]
				};
			});
	}

	let face_a, face_b, new_edge;
	// three cases: intersection at 2 edges, 2 points, 1 edge and 1 point
	if(edges_intersections.length == 2){
		let in_order = (edges_intersections[0].at_index < edges_intersections[1].at_index);

		let sorted_edges = edges_intersections.slice()
			.sort((a,b) => a.at_index - b.at_index);

		// these are new vertices
		let face_a_vertices_end = in_order
			? [vertices_coords.length, vertices_coords.length+1]
			: [vertices_coords.length+1, vertices_coords.length];
		let face_b_vertices_end = in_order
			? [vertices_coords.length+1, vertices_coords.length]
			: [vertices_coords.length, vertices_coords.length+1];

		face_a = face_vertices
			.slice(sorted_edges[1].at_index+1)
			.concat(face_vertices.slice(0, sorted_edges[0].at_index+1))
			.concat(face_a_vertices_end);
		face_b = face_vertices
			.slice(sorted_edges[0].at_index+1, sorted_edges[1].at_index+1)
			.concat(face_b_vertices_end);
		new_edge = [vertices_coords.length, vertices_coords.length+1];

	} else if(edges_intersections.length == 1 && vertices_intersections.length == 1){
		vertices_intersections[0]["type"] = "v";
		edges_intersections[0]["type"] = "e";
		let sorted_geom = vertices_intersections.concat(edges_intersections)
			.sort((a,b) => a.at_index - b.at_index);

		let face_a_vertices_end = sorted_geom[0].type === "e"
			? [vertices_coords.length, sorted_geom[1].at_index]
			: [vertices_coords.length];
		let face_b_vertices_end = sorted_geom[1].type === "e"
			? [vertices_coords.length, sorted_geom[0].at_index]
			: [vertices_coords.length];

		face_a = face_vertices.slice(sorted_geom[1].at_index+1)
			.concat(face_vertices.slice(0, sorted_geom[0].at_index+1))
			.concat(face_a_vertices_end);
		face_b = face_vertices
			.slice(sorted_geom[0].at_index+1, sorted_geom[1].at_index+1)
			.concat(face_b_vertices_end);
		new_edge = [vertices_intersections[0].at_index, vertices_coords.length];

	} else if(vertices_intersections.length == 2){
		let sorted_vertices = vertices_intersections.slice()
			.sort((a,b) => a.at_index - b.at_index);
		face_a = face_vertices
			.slice(sorted_vertices[1].at_index)
			.concat(face_vertices.slice(0, sorted_vertices[0].at_index+1))
		face_b = face_vertices
			.slice(sorted_vertices[0].at_index, sorted_vertices[1].at_index+1);
		new_edge = sorted_vertices.map(el => el.at_index);

	}
	if(new_edge == null){
		return {};
	}
	diff.edges.new = [{
		vertices: new_edge,
		assignment: crease_assignment  // from way at the top
	}];
	diff.faces = {};
	diff.faces.replace = [{
		old_index: faceIndex,
		new: [
			{vertices: face_a}, 
			{vertices: face_b}
		]
	}];
	return diff;
}

/** 
 * when an edge sits inside a face with its endpoints collinear to face edges,
 *  find those 2 face edges.
 * @param [[x, y], [x, y]] edge
 * @param [a, b, c, d, e] face_vertices. just 1 face. not .fold array
 * @param vertices_coords from .fold
 * @return [[a,b], [c,d]] vertices indices of the collinear face edges. 1:1 index relation to edge endpoints.
 */
var find_collinear_face_edges = function(edge, face_vertices, vertices_coords){
	let face_edge_geometry = face_vertices
		.map((v) => vertices_coords[v])
		.map((v, i, arr) => [v, arr[(i+1)%arr.length]]);
	return edge.map((endPt) => {
		// filter collinear edges to each endpoint, return first one
		// as an edge array index, which == face vertex array between i, i+1
		let i = face_edge_geometry
			.map((edgeVerts, edgeI) => ({index:edgeI, edge:edgeVerts}))
			.filter((e) => Geom.core.intersection.point_on_edge(e.edge[0], e.edge[1], endPt))
			.shift()
			.index;
		return [face_vertices[i], face_vertices[(i+1)%face_vertices.length]]
			.sort((a,b) => a-b);
	})
}


export function clip_line(fold, linePoint, lineVector){
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

