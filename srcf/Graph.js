// Graph.js - operations on a graph with vertices, edges, and faces
// all properties follow the .FOLD file specification github.com/edemaine/fold
// MIT open source license, Robby Kraft
//
//  "adjacent": 2 vertices are adjacent when they are connected by an edge
//              edges are adjacent when they are both connected to the same vertex
//  "similar": edges are similar if they contain the same 2 vertices, even if in a different order
//  "incident": an edge is incident to its two vertices
//  "endpoints": a vertex is an endpoint of its edge
//  "new"/"add": functions like "newNode" vs. "addNode", easy way to remember is that the "new" function will use the javascript "new" object initializer. Objects are created in the "new" functions.
//  "size" the size of a graph is the number of edges
//  "cycle" a set of edges that form a closed circut, it's possible to walk down a cycle and end up where you began without visiting the same edge twice.
//  "circuit" a circuit is a cycle except that it's allowed to visit the same vertex more than once.
//  "multigraph": not this graph. but the special case where circular and duplicate edges are allowed
//  "degree": the degree of a vertex is how many edges are incident to it
//  "isolated": a vertex is isolated if it is connected to 0 edges, degree 0
//  "leaf": a vertex is a leaf if it is connected to only 1 edge, degree 1
//  "pendant": an edge incident with a leaf vertex
//
// built to .FOLD v.1.1
//
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


import {clean_number, contains, collinear, overlaps, clip_line_in_poly, transform_point, Matrix} from './Geom'

///////////////////////////////////////////////
// MAKERS
///////////////////////////////////////////////

// faces_faces is a set of faces edge-adjacent to a face.
// for every face.
export function make_faces_faces(graph) {
	let nf = graph.faces_vertices.length;
	let faces_faces = Array.from(Array(nf)).map(() => []);
	let edgeMap = {};
	graph.faces_vertices.forEach((vertices_index, idx1) => {
		if (vertices_index === undefined) return;  //todo: why is this here?
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

export function make_faces_matrix(graph, root_face){
	let faces_matrix = graph.faces_vertices.map(v => [1,0,0,1,0,0]);
	make_face_walk_tree(graph, root_face).forEach((level) => 
		level.filter((entry) => entry.parent != undefined).forEach((entry) => {
			let edge = entry.edge.map(v => graph.vertices_coords[v])
			let vec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
			let local = Matrix.reflection(edge[0], vec);
			faces_matrix[entry.face] = Matrix.multiply(local, faces_matrix[entry.parent]);
		})
	);
	return faces_matrix;
}

// root_face will become the root node
function make_face_walk_tree(graph, root_face = 0){
	let new_faces_faces = make_faces_faces(graph);
	var visited = [root_face];
	var list = [[{ face: root_face, parent: undefined, edge: undefined }]];
	do{
		list[list.length] = list[list.length-1].map((current) =>{
			let unique_faces = new_faces_faces[current.face]
				.filter(f => visited.indexOf(f) === -1);
			visited = visited.concat(unique_faces);
			return unique_faces.map(f => ({
				face: f,
				parent: current.face,
				edge: graph.faces_vertices[f]
					.filter(v => graph.faces_vertices[current.face].indexOf(v) != -1)
					.sort((a,b) => a-b)
			}))
		}).reduce((prev,curr) => prev.concat(curr),[])
	} while(list[list.length-1].length > 0);
	if(list.length > 0 && list[list.length-1].length == 0){ list.pop(); }
	return list;
}

///////////////////////////////////////////////
// QUERIES
///////////////////////////////////////////////


/** Check if a vertex is connected to another vertex by an edge */
export function are_vertices_adjacent(graph, a, b){
	return get_vertex_adjacent_vertices(graph, a).indexOf(b) !== -1;
}

/** Check if an edge contains the same nodes as another edge */
export function are_edges_similar(graph, a, b){
	return (graph.edges_vertices[a][0] === graph.edges_vertices[b][0] && 
	        graph.edges_vertices[a][1] === graph.edges_vertices[b][1] ) ||
	       (graph.edges_vertices[a][0] === graph.edges_vertices[b][1] && 
	        graph.edges_vertices[a][1] === graph.edges_vertices[b][0] );
}

/** Check if an edge is connected to another edge by a common vertex */
export function are_edges_adjacent(graph, a, b){
	return graph.edges_vertices[a][0] === graph.edges_vertices[b][0] ||
	       graph.edges_vertices[a][0] === graph.edges_vertices[b][1] || 
	       graph.edges_vertices[a][1] === graph.edges_vertices[b][0] ||
	       graph.edges_vertices[a][1] === graph.edges_vertices[b][1];
}

/** Check if an edge points both at both ends to the same node */
export function is_edge_circular(graph, edge){
	return graph.edges_vertices[edge][0] == graph.edges_vertices[edge][1];
}

///////////////////////////////////////////////
// GETTERS, ADJACENCY, ISOLATED
///////////////////////////////////////////////

/** Get an array of edge indices adjacent to this vertex
 *
 * @returns {number[]]} array of adjacent edge indices
 */
export function get_vertex_adjacent_edges(graph, vertex){
	return graph.edges_vertices
		.map((edge, i) => edge.indexOf(vertex) === -1 ? -1 : i)
		.filter(edge => edge != -1)
}
/** Get an array of vertex indices that share an edge with this vertex
 *
 * @returns {number[]]} array of adjacent vertex indices
 */
export function get_vertex_adjacent_vertices(graph, vertex){
	let edges = graph.edges_vertices
		.map((edge,index)=> ({edge:edge, index:index}));
	let a = edges
		.filter(obj => obj.edge[0] === vertex)
		.map(obj => obj.edge[1])
	let b = edges
		.filter(obj => obj.edge[1] === vertex)
		.map(obj => obj.edge[0])
	return a.concat(b);
}

/** The degree of a vertex is the number of adjacent edges
 * circular edges count twice
 *
 * @returns {number} number of adjacent edges
 */
export function get_vertex_degree(graph, vertex){
	return graph.edges_vertices.filter(edge => edge[0] === vertex).length +
	       graph.edges_vertices.filter(edge => edge[1] === vertex).length;
}

/** Get an array of edges_vertices indices that share a node in common with this edge
 * @returns {[number]} array of adjacent edges
 * @example
 * var adjacent = edge.adjacentEdges()
 */
export function get_edge_adjacent_edges(graph, edge_index){
	let match = graph.edges_vertices[edge_index];
	return graph.edges_vertices
		.map((edge,index) => ({edge:edge, index:index}))
		.filter(e => e.edge[0] === match[0] || 
					 e.edge[0] === match[1] || 
					 e.edge[1] === match[0] || 
					 e.edge[1] === match[1])
		.map(e => e.index)
}
/* Vertices are isolated if they aren't found
 * in faces_vertices or edges_vertices
 *
 * @returns {number[]} array of vertex indices
 */
export function get_isolated_vertices(graph){
	// check for existence of vertex in these arrays:
	let refs = [graph.faces_vertices, graph.edges_vertices]
		.filter(a => a != null);
	let vertices_length = get_vertex_count(graph);
	let isolated = Array(vertices_length).fill(true);
	vertex_search: // need to use for-loops to be able to break
	for(let ra = 0; ra < refs.length; ra += 1){
		for(let entry = 0; entry < refs[ra].length; entry += 1){
			for(let i = 0; i < refs[ra][entry].length; i += 1){
				let v = refs[ra][entry][i];
				if(isolated[v] == true){
					isolated[v] = false;
					vertices_length -= 1;
				}
				if(vertices_length == 0){ break vertex_search; } // we fliped N bits. break
			}
		}
	}
	return isolated
		.map((isolated, index) => ({isolated:isolated, index:index}))
		.filter(obj => obj.isolated)
		.map(obj => obj.index)
}


/* Edges are duplicate if both ends point to the same vertex
 *
 * @returns {number[]} array of edge indices
 */
export function get_duplicate_edges(graph){
	var duplicate = [];
	for(var i = 0; i < graph.edges_vertices.length-1; i++){
		for(var j = graph.edges_vertices.length-1; j > i; j--){
			var a = graph.edges_vertices[i];
			var b = graph.edges_vertices[j];
			if(are_edges_similar(graph, a, b)){
				duplicate.push(j);
			}
		}
	}
	return duplicate;
}

/** For adjacent edges, get the node they share in common
 * @returns {number} node index, or undefined if no node is shared
 */
function get_two_edges_common_node(graph, a, b){
	// if edges are not adjacent, returns undefined
	let edgeA = graph.edges_vertices[a];
	let edgeB = graph.edges_vertices[b];
	if(edgeA[0] === edgeB[0] || edgeA[0] === edgeB[1]){ return edgeA[0]; }
	if(edgeA[1] === edgeB[0] || edgeA[1] === edgeB[1]){ return edgeA[1]; }
}

/** Searches for an edge that contains these two vertices.
 * @returns {number} edge index, or undefined if no edge exists
 */
function get_edge_connecting_vertices(graph, a, b){
	// this doesn't check for duplicate edges
	for(let i = 0; i < graph.edges_vertices.length; i++){
		let edge = graph.edges_vertices[i];
		if((edge[0] === a && edge[1] === b) ||
		   (edge[0] === b && edge[1] === a)){
			return i;
		}
	}
}

/* Get the number of vertices in the graph
 * in the case of abstract graphs, vertex count needs to be searched
 *
 * @returns {number} number of vertices
 */
function get_vertex_count(graph){
	// these arrays indicate vertex length
	// assumption: 0-length array might be present when meant to be null
	if(graph.vertices_coords != null && graph.vertices_coords.length != 0){
		return graph.vertices_coords.length;
	}
	if(graph.vertices_faces != null && graph.vertices_faces.length != 0){
		return graph.vertices_faces.length;
	}
	if(graph.vertices_vertices != null && graph.vertices_vertices.length != 0){
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

/* Get the number of edges in the graph as all edge definitions are optional
 *
 * @returns {number} number of edges
 */
function get_edge_count(graph){
	// these arrays indicate edge length
	// assumption: 0-length array might be present when meant to be null
	if(graph.edges_vertices != null && edges_vertices.length != 0){
		return edges_vertices.length;
	}
	if(graph.edges_faces != null && edges_faces.length != 0){
		return edges_faces.length;
	}
	if(graph.edges_assignment != null && edges_assignment.length != 0){
		return edges_assignment.length;
	}
	if(graph.edges_foldAngle != null && edges_foldAngle.length != 0){
		return edges_foldAngle.length;
	}
	if(graph.edges_length != null && edges_length.length != 0){
		return edges_length.length;
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

///////////////////////////////////////////////
// REMOVE THINGS
///////////////////////////////////////////////

/** Removes circular and duplicate edges, isolated vertices */
export function clean_graph(graph){
	remove_isolated_vertices(graph);
	remove_circular_edges(graph);
	remove_duplicate_edges(graph);
	// todo: add more clean. faces. edge things.
}

/** Remove the second vertex and replaces every instance of it with the first */
export function merge_vertices(graph, a, b){
	if(a === b) { return; }
	reindex_vertex(graph, b, a);
	remove_vertex(graph, b);
	// this potentially created circular edges
	remove_circular_edges(graph);
}

/** Removes any vertex that isn't a part of an edge */
export function remove_isolated_vertices(graph){
	let isolated = get_isolated_vertices(graph);
	remove_vertices(graph, isolated);
}

/** Remove all edges that contain the same vertex at both ends */
export function remove_circular_edges(graph){
	let circular = graph.edges_vertices.filter(edge => edge[0] === edge[1]);
	remove_edges(circular);
}

/** Remove edges that are similar to another edge */
export function remove_duplicate_edges(graph){
	let duplicate = get_duplicate_edges(graph);
	remove_edges(duplicate);
}

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
 */
export function remove_vertices(graph, vertices){
	if(vertices.length == 0){ return; }

	// length of index_map is length of the original vertices_coords
	let s = 0, removes = Array( get_vertex_count(graph) ).fill(false);
	vertices.forEach(v => removes[v] = true);
	let index_map = removes.map(remove => remove ? --s : s);

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

	// update every array with a 1:1 relationship to vertices_coords
	// these arrays change their size, their contents are untouched
	if(graph.vertices_faces != null){
		graph.vertices_faces = graph.vertices_faces
			.filter((v,i) => removes[i])
	}
	if(graph.vertices_vertices != null){
		graph.vertices_vertices = graph.vertices_vertices
			.filter((v,i) => removes[i])
	}
	if(graph.vertices_coords != null){
		graph.vertices_coords = graph.vertices_coords
			.filter((v,i) => removes[i])
	}

	// todo: do the same with frames in file_frames where inherit=true
}

/** Removes edges, updates all relevant array indices
 *
 * @param {edges} an array of edge indices
 */
export function remove_edges(graph, edges){
	if(edges.length == 0){ return; }

	// length of index_map is length of the original edges_vertices
	let s = 0, removes = Array( get_edge_count(graph) ).fill(false);
	edges.forEach(e => removes[e] = true);
	let index_map = removes.map(remove => remove ? --s : s);

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

	// update every array with a 1:1 relationship to edges_vertices
	// these arrays change their size, their contents are untouched
	if(graph.edges_vertices != null){
		graph.edges_vertices = graph.edges_vertices
			.filter((e,i) => removes[i])
	}
	if(graph.edges_faces != null){
		graph.edges_faces = graph.edges_faces
			.filter((e,i) => removes[i])
	}
	if(graph.edges_assignment != null){
		graph.edges_assignment = graph.edges_assignment
			.filter((e,i) => removes[i])
	}
	if(graph.edges_foldAngle != null){
		graph.edges_foldAngle = graph.edges_foldAngle
			.filter((e,i) => removes[i])
	}
	if(graph.edges_length != null){
		graph.edges_length = graph.edges_length
			.filter((e,i) => removes[i])
	}

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
