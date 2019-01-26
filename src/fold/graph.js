// graph manipulators for .FOLD file github.com/edemaine/fold
// MIT open source license, Robby Kraft

// keys in the .FOLD version 1.1
export const keys = {
	meta: [
		"file_spec",
		"file_creator",
		"file_author",
		"file_classes",
		"frame_title",
		"frame_attributes",
		"frame_classes"
	],
	graph: [
		"vertices_coords",
		"vertices_vertices",
		"vertices_faces",
		"edges_vertices",
		"edges_faces",
		"edges_assignment",
		"edges_foldAngle",
		"edges_length",
		"faces_vertices",
		"faces_edges"
	],
	orders: [
		"edgeOrders",
		"faceOrders"
	]
};

export const all_keys = ["file_frames"]
	.concat(keys.meta)
	.concat(keys.graph)
	.concat(keys.orders);

export const new_vertex = function(graph, x, y) {
	if (graph.vertices_coords == null) { graph.vertices_coords = []; }
	graph.vertices_coords.push([x,y]);
	let new_index = graph.vertices_coords.length-1;
	// // mark unclean data
	// unclean.vertices_vertices[new_index] = true;
	// unclean.vertices_faces[new_index] = true;
	return new_index;
}

export const new_edge = function(graph, node1, node2) {
	if (_m.edges_vertices == null) { graph.edges_vertices = []; }
	graph.edges_vertices.push([node1, node2]);
	let new_index = graph.edges_vertices.length-1;
	// // mark unclean data
	// unclean.edges_vertices[new_index] = true;
	// unclean.edges_faces[new_index] = true;
	// unclean.edges_assignment[new_index] = true;
	// unclean.edges_foldAngle[new_index] = true;
	// unclean.edges_length[new_index] = true;
	return new_index;
}

/* Get the number of vertices in the graph
 * in the case of abstract graphs, vertex count needs to be searched
 *
 * @returns {number} number of vertices
 */
export const vertices_count = function(graph) {
	return Math.max(...(
		[[], graph.vertices_coords, graph.vertices_faces, graph.vertices_vertices]
		.filter(el => el != null)
		.map(el => el.length)
	));
}
/* Get the number of edges in the graph as all edge definitions are optional
 *
 * @returns {number} number of edges
 */
export const edges_count = function(graph) {
	return Math.max(...(
		[[], graph.edges_vertices, graph.edges_faces]
		.filter(el => el != null)
		.map(el => el.length)
	));
}
/* Get the number of faces in the graph
 * in some cases face arrays might not be defined
 *
 * @returns {number} number of faces
 */
export const faces_count = function(graph) {
	return Math.max(...(
		[[], graph.faces_vertices, graph.faces_edges]
		.filter(el => el != null)
		.map(el => el.length)
	));
}

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
 * appends a vertex along an edge. causing a rebuild on all arrays
 * including edges and faces.
 * requires edges_vertices to be defined
 */
export const add_vertex_on_edge = function(graph, x, y, old_edge_index) {
	if (graph.edges_vertices.length < old_edge_index) { return; }
	// new vertex entries
	// vertices_coords
	let new_vertex_index = new_vertex(graph, x, y);
	let incident_vertices = graph.edges_vertices[old_edge_index];
	// vertices_vertices, new vertex
	if (graph.vertices_vertices == null) { graph.vertices_vertices = []; }
	graph.vertices_vertices[new_vertex_index] = JSON.parse(JSON.stringify(incident_vertices));
	// vertices_vertices, update incident vertices with new vertex
	incident_vertices.forEach((v,i,arr) => {
		let otherV = arr[(i+1)%arr.length];
		let otherI = graph.vertices_vertices[v].indexOf(otherV);
		graph.vertices_vertices[v][otherI] = new_vertex_index;
	})
	// vertices_faces
	if (graph.edges_faces != null && graph.edges_faces[old_edge_index] != null) {
		graph.vertices_faces[new_vertex_index] = JSON.parse(JSON.stringify(graph.edges_faces[old_edge_index]));
	}
	// new edges entries
	// set edges_vertices
	let new_edges = [
		{ edges_vertices: [incident_vertices[0], new_vertex_index] },
		{ edges_vertices: [new_vertex_index, incident_vertices[1]] }
	];
	// set new index in edges_ arrays
	new_edges.forEach((e,i) => e.i = graph.edges_vertices.length+i);
	// copy over relevant data if it exists
	["edges_faces", "edges_assignment", "edges_foldAngle"]
		.filter(key => graph[key] != null && graph[key][old_edge_index] != null)
		.forEach(key => {
			// todo, copy these arrays
			new_edges[0][key] = JSON.parse(JSON.stringify(graph[key][old_edge_index]));
			new_edges[1][key] = JSON.parse(JSON.stringify(graph[key][old_edge_index]));
		});
	// calculate length
	const distance2 = function(a,b){
		return Math.sqrt(Math.pow(b[0]-a[0],2) + Math.pow(b[1]-a[1],2));
	}
	new_edges.forEach((el,i) => {
		let verts = el.edges_vertices.map(v => graph.vertices_coords[v]);
		new_edges[i]["edges_length"] = distance2(...verts);
	})
	// todo: copy over edgeOrders. don't need to do this with faceOrders
	new_edges.forEach((edge,i) =>
		Object.keys(edge)
			.filter(key => key !== "i")
			.forEach(key => graph[key][edge.i] = edge[key])
	);
	let incident_faces_indices = graph.edges_faces[old_edge_index];
	let incident_faces_vertices = incident_faces_indices.map(i => graph.faces_vertices[i]);
	let incident_faces_edges = incident_faces_indices.map(i => graph.faces_edges[i]);

	// faces_vertices
	// because Javascript, this is a pointer and modifies the master graph
	incident_faces_vertices.forEach(face => 
		face.map((fv,i,arr) => {
			let nextI = (i+1)%arr.length;
			return (fv === incident_vertices[0] && arr[nextI] === incident_vertices[1]) ||
			       (fv === incident_vertices[1] && arr[nextI] === incident_vertices[0])
				? nextI : undefined;
		}).filter(el => el !== undefined)
		.sort((a,b) => b-a)
		.forEach(i => face.splice(i,0,new_vertex_index))
	);

	// faces_edges
	incident_faces_edges.forEach((face,i,arr) => {
		// there should be 2 faces in this array, incident to the removed edge
		// find the location of the removed edge in this face
		let edgeIndex = face.indexOf(old_edge_index);
		// the previous and next edge in this face, counter-clockwise
		let prevEdge = face[(edgeIndex+face.length-1)%face.length];
		let nextEdge = face[(edgeIndex+1)%face.length];
		let vertices = [
			[prevEdge, old_edge_index],
			[old_edge_index, nextEdge]
		].map(pairs => {
			let verts = pairs.map(e => graph.edges_vertices[e])
			return verts[0][0] === verts[1][0] || verts[0][0] === verts[1][1]
				? verts[0][0] : verts[0][1]; 
		}).reduce((a,b) => a.concat(b),[])
		let edges = [
			[vertices[0], new_vertex_index],
			[new_vertex_index, vertices[1]]
		].map(verts => {
			let in0 = verts.map(v => new_edges[0].edges_vertices.indexOf(v) !== -1)
				.reduce((a,b) => a && b, true);
			let in1 = verts.map(v => new_edges[1].edges_vertices.indexOf(v) !== -1)
				.reduce((a,b) => a && b, true);
			if(in0) { return new_edges[0].i; }
			if(in1) { return new_edges[1].i; }
			throw "something wrong with input graph's faces_edges construction";
		})
		if (edgeIndex === face.length-1) {
			// replacing the edge at the end of the array, we have to be careful
			// to put the first at the end, the second at the beginning
			face.splice(edgeIndex, 1, edges[0]);
			face.unshift(edges[1]);
		} else {
			face.splice(edgeIndex, 1, ...edges);
		}
		return edges;
	});
	// remove old data
	let edge_map = remove_edges(graph, [old_edge_index]);
	return {
		vertices: {
			new: [{index: new_vertex_index}]
		},
		edges: {
			map: edge_map,
			replace: [{
				old: old_edge_index,
				new: new_edges.map(el => el.i)
			}]
		}
	};
}



export const get_boundary_vertices = function(graph) {
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




/** Convert this graph into an array of connected graphs, attempting one Hamilton path if possible. Edges are arranged in each graph.edges with connected edges next to one another.
 * @returns {Graph[]} 
 */
export const connectedGraphs = function(graph) {
	var cp = JSON.parse(JSON.stringify(graph));
	cp.clean();
	cp.removeIsolatedNodes();
	// cache every node's adjacent edge #
	cp.nodes.forEach(function(node){ node.cache['adj'] = node.adjacentEdges().length; },this);
	var graphs = [];
	while (cp.edges.length > 0) {
		var graph = new Graph();
		// create a duplicate set of nodes in the new emptry graph, remove unused nodes at the end
		cp.nodes.forEach(function(node){graph.addNode(Object.assign(new cp.nodeType(graph),node));},this);
		// select the node with most adjacentEdges
		var node = cp.nodes.slice().sort(function(a,b){return b.cache['adj'] - a.cache['adj'];})[0];
		var adj = node.adjacentEdges();
		while (adj.length > 0) {
			// approach 1
			// var nextEdge = adj[0];
			// approach 2
			// var nextEdge = adj.sort(function(a,b){return b.otherNode(node).cache['adj'] - a.otherNode(node).cache['adj'];})[0];
			// approach 3, prioritize nodes with even number of adjacencies
			var smartList = adj.filter(function(el){return el.otherNode(node).cache['adj'] % 2 == 0;},this)
			if (smartList.length == 0){ smartList = adj; }
			var nextEdge = smartList.sort(function(a,b){return b.otherNode(node).cache['adj'] - a.otherNode(node).cache['adj'];})[0];
			var nextNode = nextEdge.otherNode(node);
			// create new edge on other graph with pointers to its nodes
			var newEdge = Object.assign(new cp.edgeType(graph,undefined,undefined), nextEdge);
			newEdge.nodes = [graph.nodes[node.index], graph.nodes[nextNode.index] ];
			graph.addEdge( newEdge );
			// update this graph with 
			node.cache['adj'] -= 1;
			nextNode.cache['adj'] -= 1;
			cp.edges = cp.edges.filter(function(el){ return el !== nextEdge; });
			// prepare loop for next iteration. increment objects
			node = nextNode;
			adj = node.adjacentEdges();
		}
		// remove unused nodes
		graph.removeIsolatedNodes();
		graphs.push(graph);
	}
	return graphs;
}








/** Removes vertices, updates all relevant array indices
 *
 * @param {vertices} an array of vertex indices
 * @example remove_vertices(fold_file, [2,6,11,15]);
 */
export function remove_vertices(graph, vertices){
	// length of index_map is length of the original vertices_coords
	let s = 0, removes = Array( vertices_count(graph) ).fill(false);
	vertices.forEach(v => removes[v] = true);
	let index_map = removes.map(remove => remove ? --s : s);

	if(vertices.length === 0){ return index_map; }

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

	return index_map;
	// todo: do the same with frames in file_frames where inherit=true
}

/* This returns a 
 * in some cases face arrays might not be defined
 *
 * @returns {number} number of faces
 */
export const remove_edges = function(graph, edges) {
	// length of index_map is length of the original edges_vertices
	let s = 0, removes = Array( edges_count(graph) ).fill(false);
	edges.forEach(e => removes[e] = true);
	let index_map = removes.map(remove => remove ? --s : s);

	if(edges.length === 0){ return index_map; }

	// update every component that points to edges_vertices
	// these arrays do not change their size, only their contents
	if(graph.faces_edges != null){
		graph.faces_edges = graph.faces_edges
			.map(entry => entry.map(v => v + index_map[v]));
	}
	if(graph.edgeOrders != null){
		graph.edgeOrders = graph.edgeOrders
			.map(entry => entry.map((v,i) => {
				if(i === 2) return v;  // exception. orientation. not index.
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
	return index_map;
	// todo: do the same with frames in file_frames where inherit=true
}


/** Removes faces, updates all relevant array indices
 *
 * @param {faces} an array of face indices
 * @example remove_edges(fold_file, [1,9,11,13]);
 */
export function remove_faces(graph, faces) {
	// length of index_map is length of the original faces_vertices
	let s = 0, removes = Array( faces_count(graph) ).fill(false);
	faces.forEach(e => removes[e] = true);
	let index_map = removes.map(remove => remove ? --s : s);

	if (faces.length === 0) { return index_map; }

	// update every component that points to faces_ arrays
	// these arrays do not change their size, only their contents
	if (graph.vertices_faces != null) {
		graph.vertices_faces = graph.vertices_faces
			.map(entry => entry.map(v => v + index_map[v]));
	}
	if (graph.edges_faces != null) {
		graph.edges_faces = graph.edges_faces
			.map(entry => entry.map(v => v + index_map[v]));
	}
	if (graph.faceOrders != null) {
		graph.faceOrders = graph.faceOrders
			.map(entry => entry.map((v,i) => {
				if(i === 2) return v;  // exception. orientation. not index.
				return v + index_map[v];
			}));
	}
	// update every array with a 1:1 relationship to faces_
	// these arrays change their size, their contents are untouched
	if (graph.faces_vertices != null) {
		graph.faces_vertices = graph.faces_vertices
			.filter((e,i) => !removes[i])
	}
	if (graph.faces_edges != null) {
		graph.faces_edges = graph.faces_edges
			.filter((e,i) => !removes[i])
	}
	return index_map;
	// todo: do the same with frames in file_frames where inherit=true
}
