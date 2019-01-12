
import * as Geom from '../../lib/geometry'

export function make_faces_matrix(graph, root_face){
	let faces_matrix = graph.faces_vertices.map(v => [1,0,0,1,0,0]);
	make_face_walk_tree(graph, root_face).forEach((level) => 
		level.filter((entry) => entry.parent != undefined).forEach((entry) => {
			let edge = entry.edge.map(v => graph.vertices_coords[v])
			let vec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
			let local = Geom.core.make_matrix2_reflection(vec, edge[0]);
			faces_matrix[entry.face] = Geom.core.multiply_matrices2(faces_matrix[entry.parent], local);
		})
	);
	return faces_matrix;
}

export function make_faces_matrix_inv(graph, root_face){
	let faces_matrix = graph.faces_vertices.map(v => [1,0,0,1,0,0]);
	make_face_walk_tree(graph, root_face).forEach((level) => 
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

// input: fold file and line
// output: dict keys: two vertex indices defining an edge (as a string: "4 6")
//         dict vals: [x, y] location of intersection between the two edge vertices
var clip_line_in_faces = function({vertices_coords, faces_vertices},
	linePoint, lineVector){
	// convert faces into x,y geometry instead of references to vertices
	// generate one clip line per face, or undefined if there is no intersection
	// array of objects {face: index of face, clip: the clip line}
	let clipLines = faces_vertices
		.map(va => va.map(v => vertices_coords[v]))
		.map((poly,i) => ({
			"face":i,
			"clip":Geom.core.intersection.clip_line_in_poly(poly, linePoint, lineVector)
		}))
		.filter((obj) => obj.clip != undefined)
		.reduce((prev, curr) => {
			prev[curr.face] = {"clip": curr.clip};
			return prev;
		}, {});

	Object.keys(clipLines).forEach(faceIndex => {
		let face = faces_vertices[faceIndex];
		let line = clipLines[faceIndex].clip;
		clipLines[faceIndex].collinear = find_collinear_face_edges(line, face, vertices_coords);
	});

	// each face is now an index in the object, containing "clip", "collinear"
	// 0: {  clip: [[x,y],[x,y]],  collinear: [[i,j],[k,l]]  }
	return clipLines
}
