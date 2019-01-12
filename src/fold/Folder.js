/** .FOLD file format modifier
 * 
 *  fold/unfold, add new creases, navigate frames,
 *  general cleanup and validation
 */
// dependencies: 
// - FOLD https://github.com/edemaine/fold/


// -- built for FOLD 1.1 --
// vertices_coords
// vertices_vertices
// vertices_faces
// edges_vertices
// edges_faces
// edges_assignment
// edges_foldAngle
// edges_length
// faces_vertices
// faces_edges
// faceOrders
// edgeOrders

// file_spec // num str
// file_creator // str
// file_author  // str
// file_title  // str
// file_description  // str
// file_classes // arr of str
// file_frames //

import * as Graph from "./graph";
import * as Geom from "../lib/geometry";
// import * as Geom from './math/core'
// import * as Rules from './math/rules'
// import * as Intersection from './math/intersection'

/** This filters out all non-operational edges
 * removes: "F": flat "U": unassigned
 * retains: "B": border/boundary, "M": mountain, "V": valley
 */
function remove_flat_creases(fold) {
	let removeTypes = ["f", "F", "b", "B"];
	let removeEdges = fold.edges_assignment
		.map((a,i) => ({a:a,i:i}))
		.filter(obj => removeTypes.indexOf(obj.a) != -1)
		.map(obj => obj.i)
	Graph.remove_edges(fold, removeEdges);
}

function faces_containing_point(fold, point) {
	return fold.faces_vertices
		.map((fv,i) => ({face:fv.map(v => fold.vertices_coords[v]),i:i}))
		.filter(f => Geom.core.intersection.point_in_polygon(f.face, point))
		.map(f => f.i);
}

export function fold_without_layering(fold, face) {
	if (face == null) { face = 0; }
	let faces_matrix = Graph.make_faces_matrix(fold, face);
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

// function clip_face_into_two(fold, face_index, )



var get_new_vertices = function(clipLines){
	// edgeCrossings is object with N entries: # edges which are crossed by line
	let edgeCrossings = {};
	Object.keys(clipLines).forEach(faceIndex => {
		let keys = clipLines[faceIndex].collinear.map(e => e.sort((a,b) => a-b).join(" "))
		keys.forEach((k,i) => edgeCrossings[k] = ({
			"point": clipLines[faceIndex].clip[i],
			"face": parseInt(faceIndex)
		}))
	});
	let new_vertices = Object.keys(edgeCrossings).map(key => {
		edgeCrossings[key].edges = key.split(" ").map(s => parseInt(s));
		return edgeCrossings[key];
	})
	return new_vertices;
}


// /** clip an infinite line in a polygon, returns an edge or undefined if no intersection */
// export function clip_line_in_poly(poly, linePoint, lineVector){
// 	let intersections = poly
// 		.map((p,i,arr) => [p, arr[(i+1)%arr.length]] ) // poly points into edge pairs
// 		.map((el,i,arr) => ({
// 			xing:line_edge_intersection(linePoint, lineVector, el[0], el[1]),
// 			poly_vertices:[i, (i+1)%arr.length]
// 		}))
// 		.filter((el) => el.xing != null);
// 	switch(intersections.length){
// 	case 0: return undefined;
// 	case 1: // degenerate edge
// 		let array = [intersections[0].xing, intersections[0].xing];
// 		array[face]
// 	case 2:
// 		let array = intersections.map(el => el.xing)
// 		return intersections;
// 	default:
// 	// special case: line intersects directly on a poly point (2 edges, same point)
// 	//  filter to unique points by [x,y] comparison.
// 		for(let i = 1; i < intersections.length; i++){
// 			if( !equivalent2(intersections[0], intersections[i])){
// 				return [intersections[0], intersections[i]];
// 			}
// 		}
// 	}
// }


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

// function that adds a frame onto the fold file - 
// makes it a parent relationship to the keyframe,
// removes all edge mappings, rebuilds faces.
// @returns {number} new frame number (array index + 1)
// no
// returns {fold_frame} object
export function make_folded_frame(fold, parent_frame = 0, root_face){
	// todo, make it so parent_frame actually goes and gets data from that frame

	// remove_flat_creases(fold);
	// for every vertex, give me an index to a face which it's found in
	let vertex_in_face = fold.vertices_coords.map((v,i) => {
		for(var f = 0; f < fold.faces_vertices.length; f++){
			if(fold.faces_vertices[f].includes(i)){ return f; }
		}
	});
	let faces_matrix = Graph.make_faces_matrix(fold, root_face);
	// let inverseMatrices = faces_matrix.map(n => Geom.core.make_matrix2_inverse(n));
	let new_vertices_coords = fold.vertices_coords.map((point,i) =>
		Geom.core.multiply_vector2_matrix2(point, faces_matrix[vertex_in_face[i]])
			.map((n) => Geom.core.clean_number(n, 14))
	)
	return {
		"frame_classes": ["foldedState"],
		"frame_parent": parent_frame,
		"frame_inherit": true,
		"vertices_coords": new_vertices_coords,
		"re:faces_matrix": faces_matrix
	};
}


export function make_unfolded_frame(fold, parent_frame = 0, root_face){
	// todo, make it so parent_frame actually goes and gets data from that frame

	// remove_flat_creases(fold);
	// for every vertex, give me an index to a face which it's found in
	let vertex_in_face = fold.vertices_coords.map((v,i) => {
		for(var f = 0; f < fold.faces_vertices.length; f++){
			if(fold.faces_vertices[f].includes(i)){ return f; }
		}
	});
	let faces_matrix = Graph.make_faces_matrix(fold, root_face);
	// let inverseMatrices = faces_matrix.map(n => Geom.core.make_matrix2_inverse(n));
	let new_vertices_coords = fold.vertices_coords.map((point,i) =>
		Geom.core.multiply_vector2_matrix2(point, faces_matrix[vertex_in_face[i]])
			.map((n) => Geom.core.clean_number(n, 14))
	)
	return {
		"frame_classes": ["creasePattern"],
		"frame_parent": parent_frame,
		"frame_inherit": true,
		"vertices_coords": new_vertices_coords,
		"re:faces_matrix": faces_matrix
	};
}

export function crease_through_layers(fold_file, linePoint, lineVector){
	// console.log("+++++++++++++++++++");
	// let root_face = faces_containing_point(fold_file, linePoint).shift();
	let root_face = 0;
	// console.log("fold_file", fold_file);
	let fold = clone(fold_file);
	// console.log("faces 1", fold.faces_vertices);

	let folded_frame = make_folded_frame(fold, 1, root_face);
	// console.log("folded_frame", folded_frame);
	let folded = merge_frame(fold, folded_frame);
	// console.log("folded", folded);
	// console.log("folded", folded.faces_edges);
	// console.log("folded", folded);
	let creased = clip_edges_with_line(folded, linePoint, lineVector);
	let migration = creased["re:diff"]
	// console.log("migration", migration);

	//////////////////////////////////
	// wait, can we retain a mapping of the old faces_vertices to the old faces, then just transform using the old faces.
	let vertex_in_face = creased.vertices_coords.map((v,i) => {
		for(var f = 0; f < creased.faces_vertices.length; f++){
			if(creased.faces_vertices[f].includes(i)){ return f; }
		}
	});
	// console.log("migration.faces", migration.faces);
	let faces_matrix = creased["re:faces_matrix"];
	let new_vertices_coords = creased.vertices_coords.map((point,i) =>
		Geom.core.multiply_vector2_matrix2(point, Geom.core.make_matrix2_inverse(faces_matrix[migration.faces[vertex_in_face[i]]]))
			.map((n) => Geom.core.clean_number(n))
	)
	//////////////////////////////////
	// let unfolded_frame = make_unfolded_frame(creased, 0, root_face);
	// console.log("unfolded_frame", unfolded_frame);
	let unfolded = merge_frame(creased, {
		"frame_classes": ["creasePattern"],
		"frame_parent": 0,
		"frame_inherit": true,
		"vertices_coords": new_vertices_coords,
		"re:faces_matrix": faces_matrix
	});
	// console.log("unfolded", unfolded);

	// console.log("faces 2", unfolded.faces_vertices);

	delete unfolded.faces_edges;
	delete unfolded.faces_layer;
	delete unfolded.frame_inherit;
	delete unfolded.frame_parent;

	unfolded.file_frames = [ make_folded_frame(unfolded, 0, 1) ];

	return unfolded;
}


// i want my fold operation to be as simple (in code) as this
// - fold the faces
// - use the crease line to chop all faces (adding a mark line)
// - unfold all the faces.
// but to do this it won't work unless you unfold using the original
// mapping of faces and transformations, as there are now new faces


// let migration_object = {
// 	vertices_: [0, 1, 2, 5, 5, 3, 4, 6, 6],
// 	faces_: []
// }

// let migration_object = {
// 	vertices_: [false, false, false, false, false, true, true, true]
//  edges_: [0, 1, 2, null, 3, ]
// }

// edges change: remove edge 2 turns into 2 edges, appended to end
//  [a, b,  c,  d, e, f]        -- before
//  [a, b,  d,  e, f, g, h]     -- after (remove edge, 2, replcae with 2 new)
//  [0, 1,  3,  4, 5, 2, 2]     -- these is a changelog for the old array

// faces change: same as edge

/** clip a line in all the faces of a fold file. */
export function clip_edges_with_line(fold, linePoint, lineVector){
	// console.log("+++++++++++++++++++++++");
	let fold_new = fold;//clone(fold);
	let edge_map = {};
	fold.edges_vertices.forEach((ev,i) => {
		let key = ev.sort( (a,b) => a-b ).join(' ')
		edge_map[key] = i;
	});
	// console.log("edge_map", edge_map);

	// 1. find all edge-crossings and vertex-crossings
	let vertices_length = fold_new.vertices_coords.length;
	let vertices_intersections = fold_new.vertices_coords
		.map(v => Geom.core.intersection.point_on_line(linePoint, lineVector, v));
	let edges_intersections = fold_new.edges_vertices
		.map(ev => ev.map(v => fold_new.vertices_coords[v]))
		.map((edge, i) => {
			let intersection = Geom.core.intersection.line_edge_exclusive(linePoint, lineVector, edge[0], edge[1]);
			let new_index = (intersection == null ? vertices_length : vertices_length++);
			return {
				point: intersection,
				vertices: fold_new.edges_vertices[i], // shallow copy to fold file
				new_index: new_index
			};
		})

	// 2. first fold modification: add new vertices to vertex_ arrays
	let new_vertices = edges_intersections
		.filter(el => el.point != null)
		.map(el => el.point)

	// 
	let vertices_diff = fold_new.vertices_coords
		.map(v => false)
		.concat(new_vertices.map(v => true));
	// console.log("vertices_diff", vertices_diff);

	fold_new.vertices_coords = fold_new.vertices_coords
		.concat(new_vertices);

	// add new edges to edges_ arrays

	// rebuild edges
	// an edge is clipped, creating 2 edges sharing 1 new vertex
	// 
	// edges_replacement: edges_-indexed objects:
	//  { edges: (2) edges which replace this edge,
	//    vertices: (3) 1 and 2 relate to edge 1 and 2. 3 is the new one
	//  }

	let edges_replacement = edges_intersections
		.map((sect, i) => {
			if (sect.point == null) { return null; }
			let a = [fold_new.edges_vertices[i][0], sect.new_index];
			let b = [fold_new.edges_vertices[i][1], sect.new_index];
			return {
				edges: Graph.replace_edge(fold_new, i, a, b),
				vertices:[a[0], b[0], sect.new_index]
			};
		})

	// console.log("edges_replacement", edges_replacement);

	// let two_vertex_with_intersection = {
	// 	"0 2" : new_v_i,
	// 	"5 7" : new_v_i,
	// 	"20 8" : new_v_i
	// }
	// let old_edge_with_intersection = {
	// 	"1" : new_v_i,
	// 	"4" : new_v_i,
	// 	"5" : new_v_i
	// }

	// let new_face_parts = [
	// 	undefined,
	// 	{}
	// ]

	// console.log("fold_new.faces_edges", fold_new.faces_edges);

	// make sure faces edges is built
	// fold_new.faces_edges
	// faces_-indexed has a face been chopped? objects:
	// { edges: (0,1,2) of its edges were chopped,
	//   vertices: (0,1,2) of its vertices was crossed by an edge
	//  }
	// these "edges" objects are
	let faces_intersections = fold_new.faces_vertices.map((face_v, face_i) => {
		let verts = face_v
			.map(v => ({intersection: vertices_intersections[v], v: v}))
			.filter(el => el.intersection)
			.map(el => el.v)
		let edges = fold_new.faces_edges[face_i]
			.map(face_e => {
				let e = edges_replacement[face_e];
				if (e == null) { return undefined; }
				e.old_edge = face_e;
				return e;
			})
			.filter(el => el != null)
		return {vertices:verts, edges:edges};
	});

	// console.log("faces_intersections", faces_intersections);

	// we don't do anything with this until later
	let faces_to_modify = faces_intersections.map(el => {
		if(el.edges.length == 2){ return el; }
		if(el.vertices.length == 1 && el.edges.length == 1){ return el; }
		return undefined;
	});

	// console.log("faces_to_modify", faces_to_modify);

	// two_edges_faces: face-indexed, which 
	let two_edges_faces = faces_intersections.map(el => {
		if(el.edges.length == 2){ return el; }
		return undefined;
	}).map(el => el != null ? el.edges : undefined);
	let point_edge_faces = faces_intersections.map(el => {
		if(el.vertices.length == 1 && el.edges.length == 1){ return el; }
		return undefined;
	}).map(el => el != null ? el.vertices : undefined);

	// console.log("two_edges_faces", two_edges_faces);

	let new_edges_vertices = [];
	let faces_substitution = [];
	// console.log("-------- inside faces loop");
	two_edges_faces
		.map((edges,i) => ({edges:edges, i:i}))
		.filter(el => el.edges != null)
		.forEach(el => {
			let face_index = el.i;
			let chop_edges = el.edges
			let edge_keys = el.edges.map(e => ({
					key: e.vertices.slice(0, 2).sort((a,b) => a-b).join(' '), 
					new_v: e.vertices[2]
				})
			)
			let faces_edges_keys = fold_new.faces_vertices[face_index]
				.map((fv,i,arr) => [fv, arr[(i+1)%arr.length]])
				// .map((ev,i) => ({ev: ev.sort((a,b) => a-b).join(' '), i: i}))
				.map((ev,i) => ev.sort((a,b) => a-b).join(' '))
			// console.log("faces_edges_keys", faces_edges_keys);
			// faces_edges_keys.forEach(fkey => console.log(edge_map[fkey]));
			let found_indices = edge_keys
				.map(el => ({
					found: faces_edges_keys.indexOf(el.key),
					new_v: el.new_v
				})
			)
			let sorted_found_indices = found_indices.sort((a,b) => a.found-b.found);
			// console.log("sorted_found_indices", sorted_found_indices);
			// face a
			let face_a = fold_new.faces_vertices[face_index]
				.slice(sorted_found_indices[1].found+1);
			face_a = face_a.concat(fold_new.faces_vertices[face_index]
				.slice(0, sorted_found_indices[0].found+1)
			)
			face_a.push(sorted_found_indices[0].new_v);
			face_a.push(sorted_found_indices[1].new_v);
			// face b
			let face_b = fold_new.faces_vertices[face_index]
				.slice(sorted_found_indices[0].found+1, sorted_found_indices[1].found+1);
			face_b.push(sorted_found_indices[1].new_v);
			face_b.push(sorted_found_indices[0].new_v);
			// add things onto the graph
			new_edges_vertices.push([
				sorted_found_indices[0].new_v,
				sorted_found_indices[1].new_v
			]);
			faces_substitution[face_index] = [face_a, face_b];
			// faces_substitution.push(face_b);
		})

	// console.log("new_edges_vertices", new_edges_vertices);
	// console.log("faces_substitution", faces_substitution);

	// fold_new.edges_vertices = fold_new.edges_vertices.concat(new_edges_vertices);
	// fold_new.faces_vertices = fold_new.faces_vertices.concat(faces_substitution);

	new_edges_vertices.forEach(ev => Graph.add_edge(fold_new, ev, "F"));

	let new_faces_map = faces_substitution
		.map((faces,i) => ({faces:faces, i:i}))
		.filter(el => el.faces != null)
		.map(el => el.faces
			.map(face => ({
				old: el.i,
				new: Graph.replace_face(fold_new, el.i, face)
			})
		)).reduce((prev,curr) => prev.concat(curr));

	// clean components
	let vertices_to_remove = fold_new.vertices_coords
		.map((vc,i) => vc == null ? i : undefined)
		.filter(el => el != null);
	let edges_to_remove = fold_new.edges_vertices
		.map((ev,i) => ev == null ? i : undefined)
		.filter(el => el != null);
	// let faces_to_remove = faces_to_modify
	// 	.map((el,i) => (el != null) ? i : undefined)
	// 	.filter(el => el != null);
	let faces_to_remove = fold_new.faces_vertices
		.map((fv,i) => fv == null ? i : undefined)
		.filter(el => el != null);

	// console.log("new_faces_map", new_faces_map);
	// console.log("vertices_to_remove", vertices_to_remove);
	// console.log("edges_to_remove", edges_to_remove);
	// console.log("faces_to_remove", faces_to_remove);

//  [a, b,  c,  d, e, f]        -- before
//  [a, b,  d,  e, f, g, h]     -- after (remove edge, 2, replcae with 2 new)
//  [0, 1,  3,  4, 5, 2, 2]     -- these is a changelog for the old array

	let edges_diff = fold_new.edges_vertices.map((v,i) => i);
	edges_replacement.forEach((record, old_edge) => {
		if(record != null){
			record.edges.forEach(new_index =>
				edges_diff[new_index] = old_edge
			)
		}
	})

	let faces_diff = fold_new.faces_vertices.map((v,i) => i);
	new_faces_map.forEach(el => faces_diff[el.new] = el.old);
	// console.log("new_faces_map", new_faces_map);

	let vertices_removes = Graph.remove_vertices(fold_new, vertices_to_remove);
	let edges_removes = Graph.remove_edges(fold_new, edges_to_remove);
	let faces_removes = Graph.remove_faces(fold_new, faces_to_remove);

	// console.log("faces_diff before:", faces_diff.slice());

	vertices_diff = vertices_diff.filter((v,i) => !vertices_removes[i]);
	edges_diff = edges_diff.filter((e,i) => !edges_removes[i]);
	faces_diff = faces_diff.filter((e,i) => !faces_removes[i]);

	fold_new["re:diff"] = {
		vertices: vertices_diff,
		edges: edges_diff,
		faces: faces_diff
	};
	return fold_new
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

export function add_line(fold, linePoint, lineVector){

}

export function is_boundary_closed(fold){

}

export function remove_boundary(fold){
	
}


// export function apply_diff(graph, diff){
// 	if(diff.vertices != null){
// 		if(diff.vertices.new != null){
// 			graph.vertices_coords = graph.vertices_coords.concat(diff.vertices.new);
// 		}
// 	}
// 	if(diff.edges != null){
// 		if(diff.edges.replace != null){
// 			diff.edges.replace.forEach(el => {
// 				Graph.replace_edge(graph, el.old_index, el.new)
// 				// Graph.remove_edges(graph, [el.old_index]);
// 			});
// 		}
// 		// let remove = diff.edges.replace.map(el => el.old_index);
// 		// Graph.remove_edges(graph, remove);
// 		if(diff.edges.new != null){
// 			diff.edges.new.forEach(edge => Graph.add_edge(graph, edge, "V"));
// 		}
// 	}
// 	if(diff.faces != null){
// 		if(diff.faces.replace != null){
// 			diff.faces.replace.forEach(el => {
// 				Graph.replace_face(graph, el.old_index, el.new);
// 				// Graph.remove_faces(graph, [el.old_index]);
// 			});
// 		}
// 		// let remove = diff.faces.replace.map(el => el.old_index);
// 		// Graph.remove_faces(graph, remove);
// 	}
// }


export function get_boundary_vertices(graph){
	let edges_vertices_b = graph.edges_vertices.filter((ev,i) =>
		graph.edges_assignment[i] == "B" ||
		graph.edges_assignment[i] == "b"
	).map(arr => arr.slice());
	// the index of keys[i] is an edge_vertex from edges_vertices_b
	//  the [] value is the indices in edges_vertices_b this i appears
	let keys = Array.from(Array(graph.vertices_coords.length)).map(_ => [])
	edges_vertices_b.forEach((ev,i) => ev.forEach(e => keys[e].push(i)))
	let edgeIndex = 0;
	let startVertex = edges_vertices_b[edgeIndex].shift();
	let nextVertex = edges_vertices_b[edgeIndex].shift();
	let vertices = [startVertex];
	while (vertices[0] !== nextVertex) {
		vertices.push(nextVertex);
		let whichEdges = keys[nextVertex];
		let thisKeyIndex = keys[nextVertex].indexOf(edgeIndex);
		if (thisKeyIndex === -1) { return; }
		keys[nextVertex].splice(thisKeyIndex, 1);
		let nextEdgeAndIndex = keys[nextVertex]
			.map((el,i) => ({key: el, i: i}))
			.filter(el => el.key !== edgeIndex).shift();
		if (nextEdgeAndIndex == null) { return; }
		keys[nextVertex].splice(nextEdgeAndIndex.i, 1);
		edgeIndex = nextEdgeAndIndex.key;
		let lastEdgeIndex = edges_vertices_b[edgeIndex].indexOf(nextVertex);
		if (lastEdgeIndex === -1) { return; }
		edges_vertices_b[edgeIndex].splice(lastEdgeIndex, 1);
		nextVertex = edges_vertices_b[edgeIndex].shift();
	}
	return vertices;
}

function diff_new_v(graph, newVertex){
	let i = Graph.get_vertex_count(graph);
	Object.keys(newVertex).forEach(suffix => {
		let key = "vertices_" + suffix;
		// console.log("setting " + key + " at " + i + " with " + newVertex[suffix]);
		graph[key][i] = newVertex[suffix];
		if(newVertex[suffix] == null){
			console.log("ERROR NEW VERTEX");
			console.log(key);
			console.log(i);
			console.log(graph[key]);
		}
	});
	return i;
}

function diff_new_e(graph, newEdge){
	let i = Graph.get_edge_count(graph);
	Object.keys(newEdge).forEach(suffix => {
		let key = "edges_" + suffix;
		// console.log("setting " + key + " at " + i + " with " + newEdge[suffix]);
		graph[key][i] = newEdge[suffix];
		if(newEdge[suffix] == null){
			console.log("ERROR new edge");
			console.log(key);
			console.log(i);
			console.log(graph[key]);
		}
	});
	return i;
}
function diff_new_f(graph, newFace){
	let i = Graph.get_face_count(graph);
	Object.keys(newFace).forEach(suffix => {
		let key = "faces_" + suffix;
		// console.log("setting " + key + " at " + i + " with " + newFace[suffix]);
		graph[key][i] = newFace[suffix];
		if(newFace[suffix] == null){
			console.log("ERROR new face");
			console.log(key);
			console.log(i);
			console.log(graph[key]);
		}
	});
	return i;
}

export function join_diff(a, b){
	let c = {};
	if(a.vertices != null || b.vertices != null){
		if(a.vertices == null) { a.vertices = {}; }
		if(b.vertices == null) { b.vertices = {}; }
		if(a.vertices.new == null) { a.vertices.new = []; }
		if(b.vertices.new == null) { b.vertices.new = []; }
		c.vertices = {};
		c.vertices.new = a.vertices.new.concat(b.vertices.new);
	}

	if(a.edges != null || b.edges != null){
		if(a.edges == null) { a.edges = {}; }
		if(b.edges == null) { b.edges = {}; }
		if(a.edges.new == null) { a.edges.new = []; }
		if(b.edges.new == null) { b.edges.new = []; }
		c.edges = {};
		c.edges.new = a.edges.new.concat(b.edges.new);

		if(a.edges.replace == null) { a.edges.replace = []; }
		if(b.edges.replace == null) { b.edges.replace = []; }
		c.edges = {};
		c.edges.replace = a.edges.replace.concat(b.edges.replace);
	}

	if(a.faces != null || b.faces != null){
		if(a.faces == null) { a.faces = {}; }
		if(b.faces == null) { b.faces = {}; }

		if(a.faces.replace == null) { a.faces.replace = []; }
		if(b.faces.replace == null) { b.faces.replace = []; }
		c.faces = {};
		c.faces.replace = a.faces.replace.concat(b.faces.replace);
	}
	return c;

}

export function apply_diff(graph, diff){

	let remove_vertices = [];
	let remove_edges = [];
	let remove_faces = [];
	// should we remove all parts at the end of everything?
	if(diff.vertices != null){
		if(diff.vertices.new != null){
			diff.vertices.new.forEach(el => diff_new_v(graph, el))
		}
	}
	if(diff.edges != null){
		if(diff.edges.replace != null){
			diff.edges.replace.forEach(el => {
				let oldAssignment = graph.edges_assignment[el.old_index];
				el.new
					.filter(e => e.edges_assignment == null)
					.forEach(e => e.assignment = oldAssignment);
				el.new.forEach(newEdge => {
					let index = diff_new_e(graph, newEdge);
					// check the standard keys and infer any that were left out
					// ["vertices", "faces", "assignment", "foldAngle", "length"]
					let allKeys = ["faces", "assignment"];
					allKeys.filter(suffix => newEdge[suffix] != null)
						.forEach(suffix => {
							let key = "edges_" + suffix;
							graph[key][index] = graph[key][el.old_index];
						});
				})
			});
			remove_edges = remove_edges
				.concat(diff.edges.replace.map(el => el.old_index));
		}
		if(diff.edges.new != null){
			diff.edges.new.forEach(el => diff_new_e(graph, el));
		}
	}
	if(diff.faces != null){
		if(diff.faces.replace != null){
			diff.faces.replace.forEach(el => {
				el.new.forEach(newFace => {
					let index = diff_new_f(graph, newFace);
					// check the standard keys and infer any that were left out
					// ["vertices", "faces", "assignment", "foldAngle", "length"]
					let allKeys = ["vertices", "edges"];
					allKeys.filter(suffix => newFace[suffix] != null)
						.forEach(suffix => {
							let key = "faces_" + suffix;
							graph[key][index] = graph[key][el.old_index];
						});
				})
			});
			remove_faces = remove_faces
				.concat(diff.faces.replace.map(el => el.old_index));
		}
	}

	let validated = validate(graph);

	return {
		vertices: remove_vertices,
		edges: remove_edges,
		faces: remove_faces
	};

}

