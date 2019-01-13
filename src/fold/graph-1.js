// graph manipulators. follows the .FOLD file specification
// github.com/edemaine/fold version 1.1
// MIT open source license, Robby Kraft

///////////////////////////////////////////////
// MAKERS
///////////////////////////////////////////////

// faces_faces is a set of faces edge-adjacent to a face.
// for every face.
export const make_faces_faces = function(graph) {
	let nf = graph.faces_vertices.length;
	let faces_faces = Array.from(Array(nf)).map(() => []);
	let edgeMap = {};
	graph.faces_vertices.forEach((vertices_index, idx1) => {
		if (vertices_index === undefined) { return; }  //todo: why is this here?
		let n = vertices_index.length;
		vertices_index.forEach((v1, i, vs) => {
			let v2 = vs[(i + 1) % n];
			if (v2 < v1) [v1, v2] = [v2, v1];
			let key = v1 + " " + v2;
			if (key in edgeMap) {
				let idx2 = edgeMap[key];
				faces_faces[idx1].push(idx2);
				faces_faces[idx2].push(idx1);
			} else {
				edgeMap[key] = idx1;
			}
		}); 
	});
	return faces_faces;
}

export const face_coloring = function(graph, root_face = 0){
	let coloring = [];
	coloring[root_face] = false;
	make_face_walk_tree(graph, root_face).forEach((level, i) => 
		level.forEach((entry) => coloring[entry.face] = (i % 2 === 0))
	);
	return coloring;
}

// root_face will become the root node
export const make_face_walk_tree = function(graph, root_face = 0){
	let new_faces_faces = make_faces_faces(graph);
	var visited = [root_face];
	var list = [[{ face: root_face, parent: undefined, edge: undefined, level: 0 }]];
	// let current_level = 0;
	do{
		// current_level += 1;
		list[list.length] = list[list.length-1].map((current) =>{
			let unique_faces = new_faces_faces[current.face]
				.filter(f => visited.indexOf(f) === -1);
			visited = visited.concat(unique_faces);
			return unique_faces.map(f => ({
				face: f,
				parent: current.face,
				// level: current_level,
				edge: graph.faces_vertices[f]
					.filter(v => graph.faces_vertices[current.face].indexOf(v) !== -1)
					.sort((a,b) => a-b)
			}))
		}).reduce((prev,curr) => prev.concat(curr),[])
	} while(list[list.length-1].length > 0);
	if(list.length > 0 && list[list.length-1].length == 0){ list.pop(); }
	return list;
}


/**
 * Get the number of vertices in the graph
 * in the case of abstract graphs, vertex count needs to be searched
 * @returns {number} number of vertices
 */
export const get_vertex_count = function(graph) {
	// these arrays indicate vertex length
	// assumption: 0-length array might be present when meant to be null
	if(graph.vertices_coords != null && graph.vertices_coords.length !== 0) {
		return graph.vertices_coords.length;
	}
	if(graph.vertices_faces != null && graph.vertices_faces.length !== 0) {
		return graph.vertices_faces.length;
	}
	if(graph.vertices_vertices != null && graph.vertices_vertices.length !== 0) {
		return graph.vertices_vertices.length;
	}
	// these arrays contain references to vertices. find the max instance
	let max = 0;
	if(graph.faces_vertices != null){
		graph.faces_vertices.forEach(fv => fv.forEach(v =>{
			if(v > max){ max = v; }
		}))
	}
	if(graph.edges_vertices != null){
		graph.edges_vertices.forEach(ev => ev.forEach(v =>{
			if(v > max){ max = v; }
		}))
	}
	// return 0 if none found
	return max;
}

/**
 * Get the number of edges in the graph as all edge definitions are optional
 * @returns {number} number of edges
 */
export const get_edge_count = function(graph) {
	// these arrays indicate edge length
	// assumption: 0-length array might be present when meant to be null
	if(graph.edges_vertices != null && graph.edges_vertices.length !== 0) {
		return graph.edges_vertices.length;
	}
	if(graph.edges_faces != null && graph.edges_faces.length !== 0) {
		return graph.edges_faces.length;
	}
	if(graph.edges_assignment != null && graph.edges_assignment.length !== 0) {
		return graph.edges_assignment.length;
	}
	if(graph.edges_foldAngle != null && graph.edges_foldAngle.length !== 0) {
		return graph.edges_foldAngle.length;
	}
	if(graph.edges_length != null && graph.edges_length.length !== 0) {
		return graph.edges_length.length;
	}
	// these arrays contain references to edges. find the max instance
	let max = 0;
	if(graph.faces_edges != null){
		graph.faces_edges.forEach(fe => fe.forEach(e =>{
			if(e > max){ max = e; }
		}))
	}
	if(graph.edgeOrders != null){
		graph.edgeOrders.forEach(eo => eo.forEach((e,i) =>{
			// exception. index 2 is orientation, not index
			if(i != 2 && e > max){ max = e; }
		}))
	}
	// return 0 if none found
	return max;
}

/* Get the number of faces in the graph
 * in some cases face arrays might not be defined
 *
 * @returns {number} number of faces
 */
export const get_face_count = function(graph) {
	// these arrays indicate vertex length
	// assumption: 0-length array might be present when meant to be null
	if(graph.faces_vertices != null && graph.faces_vertices.length !== 0) {
		return graph.faces_vertices.length;
	}
	if(graph.faces_edges != null && graph.faces_edges.length !== 0) {
		return graph.faces_edges.length;
	}
	// these arrays contain references to faces. find the max instance
	let max = 0;
	if(graph.vertices_faces != null){
		graph.vertices_faces.forEach(fv => fv.forEach(v =>{
			if(v > max){ max = v; }
		}))
	}
	if(graph.edges_faces != null){
		graph.edges_faces.forEach(ev => ev.forEach(v =>{
			if(v > max){ max = v; }
		}))
	}
	// return 0 if none found
	return max;
}
///////////////////////////////////////////////
// REMOVE THINGS
///////////////////////////////////////////////

/** Removes circular and duplicate edges, isolated vertices */
export function clean_graph(graph) { }
/** Remove the second vertex and replaces every instance of it with the first */
export function merge_vertices(graph, a, b) { }

export function remove_vertex(graph, vertex_index){
	// todo, rewrite this to be simple, more direct
	remove_vertices(graph, [vertex_index]);
}

export function remove_edge(graph, edge_index){
	// todo, rewrite this to be simple, more direct
	remove_edges(graph, [edge_index]);
}

/** Removes vertices, updates all relevant array indices
 *
 * @param {vertices} an array of vertex indices
 * @example remove_vertices(fold_file, [2,6,11,15]);
 */
export function remove_vertices(graph, vertices){
	// length of index_map is length of the original vertices_coords
	let s = 0, removes = Array( get_vertex_count(graph) ).fill(false);
	vertices.forEach(v => removes[v] = true);
	let index_map = removes.map(remove => remove ? --s : s);

	if(vertices.length == 0){ return removes; }

	// update every component that points to vertices_coords
	// these arrays do not change their size, only their contents
	if(graph.faces_vertices != null){
		graph.faces_vertices = graph.faces_vertices
			.map(entry => entry.map(v => v + index_map[v]));
	}
	if(graph.edges_vertices != null){
		graph.edges_vertices = graph.edges_vertices
			.map(entry => entry.map(v => v + index_map[v]));
	}
	if(graph.vertices_vertices != null){
		graph.vertices_vertices = graph.vertices_vertices
			.map(entry => entry.map(v => v + index_map[v]));
	}

	// update every array with a 1:1 relationship to vertices_ arrays
	// these arrays change their size, their contents are untouched
	if(graph.vertices_faces != null){
		graph.vertices_faces = graph.vertices_faces
			.filter((v,i) => !removes[i])
	}
	if(graph.vertices_vertices != null){
		graph.vertices_vertices = graph.vertices_vertices
			.filter((v,i) => !removes[i])
	}
	if(graph.vertices_coords != null){
		graph.vertices_coords = graph.vertices_coords
			.filter((v,i) => !removes[i])
	}

	return removes;
	// todo: do the same with frames in file_frames where inherit=true
}

/** Removes edges, updates all relevant array indices
 *
 * @param {edges} an array of edge indices
 * @example remove_edges(fold_file, [3,4,8,12]);
 */
export function remove_edges(graph, edges){
	// length of index_map is length of the original edges_vertices
	let s = 0, removes = Array( get_edge_count(graph) ).fill(false);
	edges.forEach(e => removes[e] = true);
	let index_map = removes.map(remove => remove ? --s : s);

	if(edges.length == 0){ return removes; }

	// update every component that points to edges_vertices
	// these arrays do not change their size, only their contents
	if(graph.faces_edges != null){
		graph.faces_edges = graph.faces_edges
			.map(entry => entry.map(v => v + index_map[v]));
	}
	if(graph.edgeOrders != null){
		graph.edgeOrders = graph.edgeOrders
			.map(entry => entry.map((v,i) => {
				if(i == 2) return v;  // exception. orientation. not index.
				return v + index_map[v];
			}));
	}

	// update every array with a 1:1 relationship to edges_ arrays
	// these arrays change their size, their contents are untouched
	if(graph.edges_vertices != null){
		graph.edges_vertices = graph.edges_vertices
			.filter((e,i) => !removes[i])
	}
	if(graph.edges_faces != null){
		graph.edges_faces = graph.edges_faces
			.filter((e,i) => !removes[i])
	}
	if(graph.edges_assignment != null){
		graph.edges_assignment = graph.edges_assignment
			.filter((e,i) => !removes[i])
	}
	if(graph.edges_foldAngle != null){
		graph.edges_foldAngle = graph.edges_foldAngle
			.filter((e,i) => !removes[i])
	}
	if(graph.edges_length != null){
		graph.edges_length = graph.edges_length
			.filter((e,i) => !removes[i])
	}
	return removes;
	// todo: do the same with frames in file_frames where inherit=true
}

/** Removes faces, updates all relevant array indices
 *
 * @param {faces} an array of face indices
 * @example remove_edges(fold_file, [1,9,11,13]);
 */
export function remove_faces(graph, faces){
	// length of index_map is length of the original edges_vertices
	let s = 0, removes = Array( get_face_count(graph) ).fill(false);
	faces.forEach(e => removes[e] = true);
	let index_map = removes.map(remove => remove ? --s : s);

	if(faces.length == 0){ return removes; }

	// update every component that points to faces_ arrays
	// these arrays do not change their size, only their contents
	if(graph.vertices_faces != null){
		graph.vertices_faces = graph.vertices_faces
			.map(entry => entry.map(v => v + index_map[v]));
	}
	if(graph.edges_faces != null){
		graph.edges_faces = graph.edges_faces
			.map(entry => entry.map(v => v + index_map[v]));
	}
	if(graph.faceOrders != null){
		graph.faceOrders = graph.faceOrders
			.map(entry => entry.map((v,i) => {
				if(i == 2) return v;  // exception. orientation. not index.
				return v + index_map[v];
			}));
	}
	// update every array with a 1:1 relationship to faces_
	// these arrays change their size, their contents are untouched
	if(graph.faces_vertices != null){
		graph.faces_vertices = graph.faces_vertices
			.filter((e,i) => !removes[i])
	}
	if(graph.faces_edges != null){
		graph.faces_edges = graph.faces_edges
			.filter((e,i) => !removes[i])
	}
	return removes;
	// todo: do the same with frames in file_frames where inherit=true
}

// unused, but can be a generalized function one day
function remove_from_array(array, match_function){
	let remove = array.map((a,i) => match_function(a,i));
	let s = 0, shift = remove.map(rem => rem ? --s : s);
	array = array.filter(e => match_function(e));
	return shift;
}

// function remove_edges_with_vertex(vertex_index, edge_array){ }
// function remove_edges_with_vertices(a_index, b_index, edge_array){ }


/** replace all instances of the vertex old_index with new_index
 * does not modify array sizes, only contents of arrays
 */
function reindex_vertex(graph, old_index, new_index){
	if(graph.faces_vertices != null){
		graph.faces_vertices.forEach((fv,fi) => fv.forEach((v,vi) => {
			if(v == old_index){ graph.faces_vertices[fi][vi] = new_index; }
		}))
	}
	if(graph.edges_vertices != null){
		graph.edges_vertices.forEach((ev,ei) => ev.forEach((v,vi) => {
			if(v == old_index){ graph.edges_vertices[ei][vi] = new_index; }
		}))
	}
	if(graph.vertices_vertices != null){
		graph.vertices_vertices.forEach((vv,vvi) => vv.forEach((v,vi) => {
			if(v == old_index){ graph.vertices_vertices[vvi][vi] = new_index; }
		}))
	}
}

/** replace all instances of the edge old_index with new_index
 * does not modify array sizes, only contents of arrays
 */
function reindex_edge(graph, old_index, new_index){
	if(graph.faces_edges != null){
		graph.faces_edges.forEach((fe,fi) => fe.forEach((e,ei) => {
			if(e == old_index){ graph.faces_edges[fi][ei] = new_index; }
		}))
	}
	if(graph.edgeOrders != null){
		graph.edgeOrders.forEach((fe,fi) => fe.forEach((e,ei) => {
			// exception. third index is orientation, not index
			if(i != 2 && e == old_index){
				graph.edgeOrders[fi][ei] = new_index;
			}
		}))
	}
}


///////////////////////////////////////////////
// GEOMETRY STUFF
///////////////////////////////////////////////

// an edge has been split into two edges.
// remove the old_index, add edges_vertices, an array of edges
// and copy over any properties from old_index to the new
// (like crease assignment)
export function replace_edge(graph, old_index, edges_vertices){
	// this leaves behind a null in the old_index in every array

// todo: do we need to rebuild vertices_vertices?
// also edgeOrders
	let new_count = edges_vertices.length;

	if(graph.edges_vertices != null){
		graph.edges_vertices = graph.edges_vertices.concat(edges_vertices);
		graph.edges_vertices[old_index] = undefined;
	}
	if(graph.edges_faces != null){
		// let copies = Array.from(Array(new_count))
		// 	.map(_ => graph.edges_faces[old_index].slice());
		// graph.edges_faces = graph.edges_faces.concat(copies);
		for(var i = 0; i < new_count; i++){
			graph.edges_faces.push( graph.edges_faces[old_index].slice() );
		}
		graph.edges_faces[old_index] = undefined;
	}
	if(graph.edges_assignment != null){
		for(var i = 0; i < new_count; i++){
			graph.edges_assignment.push( graph.edges_assignment[old_index] );
		}
		graph.edges_assignment[old_index] = undefined;
	}
	if(graph.edges_foldAngle != null){
		for(var i = 0; i < new_count; i++){
			graph.edges_foldAngle.push( graph.edges_foldAngle[old_index] );
		}
		graph.edges_foldAngle[old_index] = undefined;
	}
	if(graph.edges_length != null){
		for(var i = 0; i < new_count; i++){
			graph.edges_length.push( graph.edges_length[old_index] );
		}
		graph.edges_length[old_index] = undefined;
	}
	// [ graph.edges_vertices, graph.edges_faces, graph.edges_assignment,
	// 	graph.edges_foldAngle, graph.edges_length
	// ].forEach(arr => arr[old_index] = undefined)
	let edges_count = get_edge_count(graph);
	return [edges_count - 2, edges_count - 1];
}
// returns the new edge created by the two faces


// adds n number of faces to the arrays
// copying old_face's attributes
export function replace_face(graph, old_index, new_face_vertices){
	// this leaves behind a null in the old_index in every array

// faces_vertices
// faces_edges

// vertices_faces
// edges_faces

// faceOrders
// edgeOrders
	

	if(graph.faces_vertices != null){
		graph.faces_vertices.push(new_face_vertices);
		graph.faces_vertices[old_index] = undefined;
	}
	if(graph.faces_edges != null){
	// 	let edge_key = {};
	// 	graph.faces_edges.forEach((ev,i) => {
	// 		console.log(ev);
	// 		if(ev != null){
	// 			let key = ev.sort((a,b) => a-b).join(' ');
	// 			edge_key[key] = i;
	// 		}
	// 	})
	// 	let new_face_edges = new_face_vertices.map((fv,i,arr) => {
	// 		let key = [fv, arr[(i+1)%arr.length]].sort((a,b) => a-b).join(' ');
	// 		return edge_key[key];
	// 	});
	// 	graph.faces_edges.push(new_face_edges);
	// 	graph.faces_edges[old_index] = undefined;
	}
	if(graph.faceOrders != null){
		//todo
	}

	// if(graph.vertices_faces != null){
	// 	let new_index = get_face_count(graph)
	// 	for(var i = 0; i < graph.vertices_faces.length; i++){
	// 		for(var j = 0; j < graph.vertices_faces[i].length; j++){
	// 			if(graph.vertices_faces[i][j] == old_index){
	// 				graph.vertices_faces[i][j] = new_index;
	// 			}
	// 		}
	// 	}
	// }
	// if(graph.edges_faces != null){
	// 	let new_index = get_face_count(graph)
	// 	for(var i = 0; i < graph.edges_faces.length; i++){
	// 		for(var j = 0; j < graph.edges_faces[i].length; j++){
	// 			if(graph.edges_faces[i][j] == old_index){
	// 				graph.edges_faces[i][j] = new_index;
	// 			}
	// 		}
	// 	}
	// }

	// return index of new face
	return graph.faces_vertices.length - 1;
}


/** This filters out all non-operational edges
 * removes: "F": flat "U": unassigned
 * retains: "B": border/boundary, "M": mountain, "V": valley
 */
export const remove_marks = function(fold) {
	let removeTypes = ["f", "F", "b", "B"];
	let removeEdges = fold.edges_assignment
		.map((a,i) => ({a:a,i:i}))
		.filter(obj => removeTypes.indexOf(obj.a) != -1)
		.map(obj => obj.i)
	Graph.remove_edges(fold, removeEdges);
	// todo, rebuild faces
}



///////////////////////////////////////////////
// FROM .FOLD SOURCE
///////////////////////////////////////////////

// this comes from fold.js. still working on the best way to require() the fold module
export var faces_vertices_to_edges = function (mesh) {
	var edge, edgeMap, face, i, key, ref, v1, v2, vertices;
	mesh.edges_vertices = [];
	mesh.edges_faces = [];
	mesh.faces_edges = [];
	mesh.edges_assignment = [];
	edgeMap = {};
	ref = mesh.faces_vertices;
	for (face in ref) {
		vertices = ref[face];
		face = parseInt(face);
		mesh.faces_edges.push((function() {
			var j, len, results;
			results = [];
			for (i = j = 0, len = vertices.length; j < len; i = ++j) {
				v1 = vertices[i];
				v1 = parseInt(v1);
				v2 = vertices[(i + 1) % vertices.length];
				if (v1 <= v2) {
					key = v1 + "," + v2;
				} else {
					key = v2 + "," + v1;
				}
				if (key in edgeMap) {
					edge = edgeMap[key];
				} else {
					edge = edgeMap[key] = mesh.edges_vertices.length;
					if (v1 <= v2) {
						mesh.edges_vertices.push([v1, v2]);
					} else {
						mesh.edges_vertices.push([v2, v1]);
					}
					mesh.edges_faces.push([null, null]);
					mesh.edges_assignment.push('B');
				}
				if (v1 <= v2) {
					mesh.edges_faces[edge][0] = face;
				} else {
					mesh.edges_faces[edge][1] = face;
				}
				results.push(edge);
			}
			return results;
		})());
	}
	return mesh;
};
