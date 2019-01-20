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
	let face = graph.faces_vertices
		.map((fv,i) => ({face:fv.map(v => graph.vertices_coords[v]),i:i}))
		.filter(f => Geom.core.intersection.point_in_poly(f.face, point))
		.shift()
	return (face == null ? undefined : face.i);
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
		level.filter((entry) => entry.parent != null).forEach((entry) => {
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
		level.filter((entry) => entry.parent != null).forEach((entry) => {
			let edge = entry.edge.map(v => graph.vertices_coords[v])
			let vec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
			let local = Geom.core.make_matrix2_reflection(vec, edge[0]);
			faces_matrix[entry.face] = Geom.core.multiply_matrices2(local, faces_matrix[entry.parent]);
		})
	);
	return faces_matrix;
}
export const split_convex_polygon = function(graph, faceIndex, linePoint, lineVector, crease_assignment = "F") {
	
	let vertices_intersections = graph.faces_vertices[faceIndex]
		.map(fv => graph.vertices_coords[fv])
		.map(v => Geom.core.intersection.point_on_line(linePoint, lineVector, v) ? v : undefined)
		.map((point, i) => ({
			point: point,
			i_face: i,
			i_vertices: graph.faces_vertices[faceIndex][i]
		}))
		.filter(el => el.point !== undefined);

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

	let new_v_indices = [];
	if (edges_intersections.length === 2) {
		new_v_indices = edges_intersections.map((el,i,arr) => {
			let diff = Graph.add_vertex_on_edge(graph, el.point[0], el.point[1], el.i_edges);
			arr.slice(i+1)
				.filter(el => diff.edges.map[el.i_edges] != null)
				.forEach(el => el.i_edges += diff.edges.map[el.i_edges])
			return diff.vertices.new[0].index
		});
	} else if (edges_intersections.length === 1 && vertices_intersections.length === 1) {
		let a = vertices_intersections.map(el => el.i_vertices);
		let b = edges_intersections.map((el,i,arr) => {
			let diff = Graph.add_vertex_on_edge(graph, el.point[0], el.point[1], el.i_edges);
			arr.slice(i+1)
				.filter(el => diff.edges.map[el.i_edges] != null)
				.forEach(el => el.i_edges += diff.edges.map[el.i_edges])
			return diff.vertices.new[0].index
		});
		new_v_indices = a.concat(b);
	} else if (vertices_intersections.length === 2) {
		new_v_indices = vertices_intersections.map(el => el.i_vertices);
	} else {
		return undefined;
	}

	// connect across the polygon. split into 2
	let new_indexOfs = new_v_indices.map(el => graph.faces_vertices[faceIndex].indexOf(el))
	let in_order = new_indexOfs[0] < new_indexOfs[1];
	let sorted_indices = new_indexOfs.sort((a,b) => a-b);

	let new_faces = [{}, {}];
	new_faces[0].vertices = graph.faces_vertices[faceIndex].slice(sorted_indices[1])
		.concat(graph.faces_vertices[faceIndex].slice(0, sorted_indices[0]+1));
	new_faces[1].vertices = graph.faces_vertices[faceIndex]
		.slice(sorted_indices[0], sorted_indices[1]+1);

	new_faces[0].edges = graph.faces_edges[faceIndex].slice(sorted_indices[1])
		.concat(graph.faces_edges[faceIndex].slice(0, sorted_indices[0]))
		.concat([graph.edges_vertices.length]);
	new_faces[1].edges = graph.faces_edges[faceIndex]
		.slice(sorted_indices[0], sorted_indices[1])
		.concat([graph.edges_vertices.length]);

	// todo: investigate this special case. why?
	if (sorted_indices[0] === 0) {
		new_faces[0].edges = graph.faces_edges[faceIndex].slice(sorted_indices[1] - 1, graph.faces_edges[faceIndex].length-1)
			.concat(graph.faces_edges[faceIndex].slice(0, sorted_indices[0]))
			.concat([graph.edges_vertices.length]);

		new_faces[1].edges = [graph.faces_edges[faceIndex][graph.faces_edges[faceIndex].length-1]].concat(graph.faces_edges[faceIndex]
			.slice(sorted_indices[0], sorted_indices[1]-1))
			.concat([graph.edges_vertices.length]);
	}

	let foldAngle = 0;
	switch (crease_assignment) {
		case "M": foldAngle = -180; break;
		case "V": foldAngle = 180; break;
	}
	const distance2 = function(a,b){
		return Math.sqrt(Math.pow(b[0]-a[0],2) + Math.pow(b[1]-a[1],2));
	}

	let new_edges = [{
		// index: graph.edges.
		vertices: [...new_v_indices],
		assignment: crease_assignment,
		foldAngle: foldAngle,
		length: distance2(...(new_v_indices.map(v => graph.vertices_coords[v]))),
		// todo, unclear if these are ordered with respect to the vertices
		faces: [graph.faces_vertices.length, graph.faces_vertices.length+1]
	}];

	let edges_count = graph.edges_vertices.length;
	let faces_count = graph.faces_vertices.length;

	new_edges.forEach((edge,i) => Object.keys(edge).forEach(suffix => {
		let key = "edges_" + suffix;
		graph[key][edges_count+i] = edge[suffix];
	}));
	new_edges.forEach((edge, i) => {
		let a = edge.vertices[0];
		let b = edge.vertices[1];
		graph.vertices_vertices[a].push(b);
		graph.vertices_vertices[b].push(a);
	})

	new_faces.forEach((face,i) => Object.keys(face).forEach(suffix => {
		let key = "faces_" + suffix;
		graph[key][faces_count+i] = face[suffix];
	}));

	let valid_edges = graph.edges_faces.map((e,i) => e.indexOf(faceIndex) !== -1);
	let valid_vertices = graph.vertices_faces.map((e,i) => e.indexOf(faceIndex) !== -1);
	graph.edges_faces = graph.edges_faces.map((_,i) => graph.edges_faces[i].filter(el => el !== faceIndex))
	graph.faces_edges.filter((_,i) => i !== faceIndex).map((face,i) => 
		face.filter(edge => valid_edges[edge])
			.forEach(edge => graph.edges_faces[edge].push(faces_count+i))
	);
	graph.vertices_faces = graph.vertices_faces.map((_,i) => graph.vertices_faces[i].filter(el => el !== faceIndex))
	// todo: this doesn't yet order faces counter-clockwise around the vertex
	graph.faces_vertices.filter((_,i) => i !== faceIndex).map((face,i) => 
		face.filter(vertex => valid_vertices[vertex])
			.forEach(vertex => graph.vertices_faces[vertex].push(faces_count+i))
	);

	Graph.remove_faces(graph, [faceIndex]);

	let diff = {
		faces: new_faces,
		edges: new_edges
	}

	// console.log(diff);
}

// export function split_convex_polygon(graph, faceIndex, linePoint, lineVector, crease_assignment = "F"){
// 	let vertices_count = graph.vertices_coords.length;
// 	let edges_count = graph.edges_vertices.length;
// 	let faces_count = graph.faces_vertices.length;

// 	let face_vertices = graph.faces_vertices[faceIndex];
// 	let face_edges = graph.faces_edges[faceIndex];

// 	//    point: intersection [x,y] point or null if no intersection
// 	// i_face: where in the polygon this occurs
// 	let vertices_intersections = face_vertices
// 		.map(fv => graph.vertices_coords[fv])
// 		.map(v => Geom.core.intersection.point_on_line(linePoint, lineVector, v) ? v : undefined)
// 		.map((point, i) => ({ point: point, i_face: i }))
// 		.filter(el => el.point !== undefined);

// 	let edges_intersections = face_edges
// 		.map(ei => graph.edges_vertices[ei])
// 		.map(edge => edge.map(e => graph.vertices_coords[e]))
// 		.map(edge => Geom.core.intersection.line_edge_exclusive(linePoint, lineVector, edge[0], edge[1]))
// 		.map((point, i) => ({point: point, i_face: i, i_edges: face_edges[i] }))
// 		.filter(el => el.point !== undefined);
// 	//todo: make the epsilon for edge intersections DEFINITELY larger than vertices intersections.
// 	// right now it's possible to have duplicate cases
// 	if (vertices_intersections.length === 0 && edges_intersections.length === 0) {
// 		// the line does not intersect the face
// 		return {};
// 	}
// 	// console.log("edges_intersections", edges_intersections);

// 	// in the case of edges_intersections, we have new vertices, edges, and faces
// 	// otherwise in the case of only vertices_intersections, we only have new faces
// 	let diff = { edges: {} };
// 	if (edges_intersections.length > 0) {
// 		diff.vertices = {};
// 		diff.vertices.new = edges_intersections.map(el => ({
// 			coords: el.point,  // vertices_coords
// 			// faces: [graph.faces_vertices.length, graph.faces_vertices.length+1],  // vertices_faces
// 			// vertices:  // vertices_vertices
// 		}))
// 	}
// 	if (edges_intersections.length > 0) {
// 		diff.edges.replace = edges_intersections
// 			.map((el, i) => {
// 				let a = graph.edges_vertices[face_edges[el.i_face]][0];
// 				let c = graph.edges_vertices[face_edges[el.i_face]][1];
// 				let b = vertices_count + i;
// 				return {
// 					// old_index: el.i_face,
// 					old_index: el.i_edges,
// 					new: [
// 						{vertices: [a, b] },
// 						{vertices: [b, c] }
// 					]
// 				};
// 			});
// 	}
// 	let foldAngle = 0;
// 	switch (crease_assignment) {
// 		case "M": foldAngle = -180;
// 		case "V": foldAngle = 180;
// 		default: foldAngle = 0;
// 	}
// 	let new_faces = [{vertices:[], edges:[]}, {vertices:[], edges:[]}]
// 	let new_edge = {
// 		vertices: [], assignment: crease_assignment, foldAngle: foldAngle,
// 		// todo, these aren't ordered with respect to the vertices
// 		faces: [faces_count, faces_count+1]
// 	};
// 	// three cases: intersection at 2 edges, 2 points, 1 edge and 1 point
// 	if(edges_intersections.length === 2){
// 		let in_order = (edges_intersections[0].i_face < edges_intersections[1].i_face);

// 		let sorted_edges = edges_intersections.slice()
// 			.sort((a,b) => a.i_face - b.i_face);

// 		// this points to new vertices
// 		let face_a_vertices_end = in_order
// 			? [vertices_count, vertices_count+1]
// 			: [vertices_count+1, vertices_count];
// 		let face_b_vertices_end = in_order
// 			? [vertices_count+1, vertices_count]
// 			: [vertices_count, vertices_count+1];

// 		// new faces_vertices
// 		new_faces[0].vertices = face_vertices
// 			.slice(sorted_edges[1].i_face+1)
// 			.concat(face_vertices.slice(0, sorted_edges[0].i_face+1))
// 			.concat(face_a_vertices_end);
// 		new_faces[1].vertices = face_vertices
// 			.slice(sorted_edges[0].i_face+1, sorted_edges[1].i_face+1)
// 			.concat(face_b_vertices_end);

// 		// 0 4 8 7
// 		// 2 6 8 5

// 		// this points to new edges
// 		let face_a_edges_end = in_order
// 			? [edges_count, edges_count+4, edges_count+3]
// 			: [edges_count+2, edges_count+4, edges_count+1];
// 		let face_b_edges_end = in_order
// 			? [edges_count+2, edges_count+4, edges_count+1]
// 			: [edges_count, edges_count+4, edges_count+3];

// 		// new faces_edges
// 		new_faces[0].edges = face_edges
// 			.slice(sorted_edges[1].i_face+1)
// 			.concat(face_edges.slice(0, sorted_edges[0].i_face))
// 			.concat(face_a_edges_end);
// 		new_faces[1].edges = face_edges
// 			.slice(sorted_edges[0].i_face+1, sorted_edges[1].i_face)
// 			.concat(face_b_edges_end);

// 		console.log(new_faces[0].edges);
// 		console.log(new_faces[1].edges);

// 		new_edge.vertices = [vertices_count, vertices_count+1];

// 	} else if(edges_intersections.length === 1 && vertices_intersections.length === 1){
// 		vertices_intersections[0]["type"] = "v";
// 		edges_intersections[0]["type"] = "e";
// 		let sorted_geom = vertices_intersections.concat(edges_intersections)
// 			.sort((a,b) => a.i_face - b.i_face);

// 		// this points to new vertices
// 		let face_a_vertices_end = sorted_geom[0].type === "e"
// 			? [vertices_count, sorted_geom[1].i_face]
// 			: [vertices_count];
// 		let face_b_vertices_end = sorted_geom[1].type === "e"
// 			? [vertices_count, sorted_geom[0].i_face]
// 			: [vertices_count];

// 		// this points to new edges
// 		let face_a_edges_end = sorted_geom[0].type === "e"
// 			? [edges_count, sorted_geom[1].i_face]
// 			: [edges_count];
// 		let face_b_edges_end = sorted_geom[1].type === "e"
// 			? [edges_count, sorted_geom[0].i_face]
// 			: [edges_count];

// 		// new faces_vertices
// 		new_faces[0].vertices = face_vertices.slice(sorted_geom[1].i_face+1)
// 			.concat(face_vertices.slice(0, sorted_geom[0].i_face+1))
// 			.concat(face_a_vertices_end);
// 		new_faces[1].vertices = face_vertices
// 			.slice(sorted_geom[0].i_face+1, sorted_geom[1].i_face+1)
// 			.concat(face_b_vertices_end);

// 		// new faces_edges NOT TESTED
// 		new_faces[0].edges = face_edges.slice(sorted_geom[1].i_face+1)
// 			.concat(face_edges.slice(0, sorted_geom[0].i_face+1))
// 			.concat(face_a_edges_end);
// 		new_faces[1].edges = face_edges
// 			.slice(sorted_geom[0].i_face+1, sorted_geom[1].i_face+1)
// 			.concat(face_b_edges_end);

// 		new_edge.vertices = [vertices_intersections[0].i_face, vertices_count];

// 	} else if(vertices_intersections.length === 2){
// 		let sorted_vertices = vertices_intersections.slice()
// 			.sort((a,b) => a.i_face - b.i_face);
// 		// new faces_vertices
// 		new_faces[0].vertices = face_vertices
// 			.slice(sorted_vertices[1].i_face)
// 			.concat(face_vertices.slice(0, sorted_vertices[0].i_face+1))
// 		new_faces[1].vertices = face_vertices
// 			.slice(sorted_vertices[0].i_face, sorted_vertices[1].i_face+1);
// 		// new faces_edges... not tested
// 		new_faces[0].vertices = face_edges
// 			.slice(sorted_vertices[1].i_face)
// 			.concat(face_edges.slice(0, sorted_vertices[0].i_face+1))
// 		new_faces[1].vertices = face_edges
// 			.slice(sorted_vertices[0].i_face, sorted_vertices[1].i_face+1);

// 		new_edge.vertices = sorted_vertices.map(el => el.i_face);

// 	}

// 	// replace old face with new face per edge.
// 	new_faces.forEach((new_f,i) => new_f.edges
// 		.forEach(e => {
// 			console.log(e);
// 			if (graph.edges_faces[e] != null) {
// 				let old_index = graph.edges_faces[e].indexOf(faceIndex);
// 				graph.edges_faces[e][old_index] = faces_count + i;
// 			} else {
// 				graph.edges_faces[e] = [faces_count + i];
// 			}
// 		})
// 	);

// 	if(new_edge == null){
// 		return {};
// 	}
// 	diff.edges.new = [new_edge];
// 	diff.faces = {};
// 	diff.faces.replace = [{
// 		old_index: faceIndex,
// 		new: new_faces
// 	}];
// 	return diff;
// }

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


export const add_crease = function(graph, a, b, c, d) {
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
	return graph.edges_vertices.length-1;
}


