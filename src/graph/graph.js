// graph.js
// a mathematical undirected graph with nodes, edges, and faces
// naming adheres to the .FOLD format (https://github.com/edemaine/fold)
// MIT open source license, Robby Kraft
//
//  "adjacent": 2 nodes are adjacent when they are connected by an edge
//              edges are adjacent when they are both connected to the same node
//  "similar": edges are similar if they contain the same 2 nodes, even if in a different order
//  "incident": an edge is incident to its two nodes
//  "endpoints": a node is an endpoint of its edge
//  "new"/"add": functions like "newNode" vs. "addNode", easy way to remember is that the "new" function will use the javascript "new" object initializer. Objects are created in the "new" functions.
//  "size" the size of a graph is the number of edges
//  "cycle" a set of edges that form a closed circut, it's possible to walk down a cycle and end up where you began without visiting the same edge twice.
//  "circuit" a circuit is a cycle except that it's allowed to visit the same node more than once.
//  "multigraph": not this graph. but the special case where circular and duplicate edges are allowed
//  "degree": the degree of a node is how many edges are incident to it
//  "isolated": a node is isolated if it is connected to 0 edges, degree 0
//  "leaf": a node is a leaf if it is connected to only 1 edge, degree 1
//  "pendant": an edge incident with a leaf node

/** A graph is a set of nodes and edges connecting them */
export default function Graph() {
	let _m = {}; // the data model. fold file format spec

	let params = Array.from(arguments);
	let paramsObj = params.filter(el => typeof el === "object" && el !== null);
	if (paramsObj.length > 0) {
		// expecting the user to have passed in a fold_file.
		// no way of filtering multiple objects right now.
		_m = JSON.parse(JSON.stringify(paramsObj.shift()));
	}

	let _meta_keys = ["file_spec", "file_creator", "file_author", "file_classes",
		"frame_title", "frame_attributes", "frame_classes"];
	let _geom_keys = ["vertices_coords", "vertices_vertices", "vertices_faces",
		"edges_vertices", "edges_faces", "edges_assignment", "edges_foldAngle", "edges_length",
		"faces_vertices", "faces_edges"];
	let _orders_keys = ["edgeOrders", "faceOrders"];

	let _all_keys = ["file_frames"]
		.concat(_meta_keys)
		.concat(_geom_keys)
		.concat(_orders_keys);

	let _geometry_dict = {
		"vertices": ["coords", "vertices", "faces"],
		"edges": ["vertices", "faces", "assignment", "foldAngle", "length"],
		"faces": ["vertices", "edges"]
	};

	// todo: callback hooks for when certain properties of the data structure have been altered
	let didChange = undefined; // callback function

	///////////////////////////////////////////////
	// ADD PARTS
	///////////////////////////////////////////////

	// this contains keys, like "vertices_vertices", which require rebuilding
	let unclean = {
		"vertices_coords": [],
		"vertices_vertices": [],
		"vertices_faces": [],
		"edges_vertices": [],
		"edges_faces": [],
		"edges_assignment": [],
		"edges_foldAngle": [],
		"edges_length": [],
		"faces_vertices": [],
		"faces_edges": [],
		"edgeOrders": [],
		"faceOrders": [],
	};

	/** Create a node and add it to the graph
	 * @returns {number} index of new vertex in vertices_coords
	 * @example
	 * let index = graph.newVertex(5.8, 13)
	 */
	const newVertex = function(x, y) {
		if (_m.vertices_coords == null) { _m.vertices_coords = []; }
		_m.vertices_coords.push([x,y]);
		let new_index = _m.vertices_coords.length-1;
		// mark unclean data
		unclean.vertices_vertices[new_index] = true;
		unclean.vertices_faces[new_index] = true;
		return new_index;
	}

	/** Create an edge and add it to the graph
	 * @param {number} the indices of 2 nodes to connect
	 * @returns {number} index of new edge in edges_vertices, undefined if unsuccessful
	 * @example
	 * let index = graph.newEdge(2, 4)
	 */
	const newEdge = function(node1, node2) {
		if (_m.edges_vertices == null) { _m.edges_vertices = []; }
		_m.edges_vertices.push([node1, node2]);
		let new_index = _m.edges_vertices.length-1;
		// mark unclean data
		unclean.edges_vertices[new_index] = true;
		unclean.edges_faces[new_index] = true;
		unclean.edges_assignment[new_index] = true;
		unclean.edges_foldAngle[new_index] = true;
		unclean.edges_length[new_index] = true;
		return new_index;
	}

	const validate = function() {
		let arraysLengthTest = Object.keys(_geometry_dict)
			.map(key => ({prefix: key, suffixes: _geometry_dict[key]}))
			.map(el => el.suffixes
				.map(suffix => el.prefix + "_" + suffix)
				.filter(key => _m[key] != null)
				.map((key,_,arr) => _m[key].length === _m[arr[0]].length)
				.reduce((a,b) => a && b, true)
			).reduce((a,b) => a && b, true);
		let l = {
			vertices: verticesCount(),
			edges: edgesCount(),
			faces: facesCount()
		}
		let arraysIndexTest = Object.keys(_geometry_dict)
			.map(key => ({prefix: key, suffixes: _geometry_dict[key]}))
			.map(el => el.suffixes
				.map(suffix => ({key:el.prefix + "_" + suffix, suffix: suffix}))
				.filter(ell => _m[ell.key] != null && l[ell.suffix] != null)
				.map(ell => _m[ell.key]
					.reduce((prev,curr) => curr
						.reduce((a,b) => a && (b < l[ell.suffix]), true)
					, true)
				).reduce((a,b) => a && b, true)
			).reduce((a,b) => a && b, true);
		return arraysLengthTest && arraysIndexTest;
	}

	/* Get the number of vertices in the graph
	 * in the case of abstract graphs, vertex count needs to be searched
	 *
	 * @returns {number} number of vertices
	 */
	const verticesCount = function() {
		return Math.max(...(
			[[], _m.vertices_coords, _m.vertices_faces, _m.vertices_vertices]
			.filter(el => el != null)
			.map(el => el.length)
		));
	}
	/* Get the number of edges in the graph as all edge definitions are optional
	 *
	 * @returns {number} number of edges
	 */
	const edgesCount = function() {
		return Math.max(...(
			[[], _m.edges_vertices, _m.edges_faces]
			.filter(el => el != null)
			.map(el => el.length)
		));
	}
	/* Get the number of faces in the graph
	 * in some cases face arrays might not be defined
	 *
	 * @returns {number} number of faces
	 */
	const facesCount = function() {
		return Math.max(...(
			[[], _m.faces_vertices, _m.faces_edges]
			.filter(el => el != null)
			.map(el => el.length)
		));
	}

	const load = function(fold_file){
		_m = JSON.parse(JSON.stringify(fold_file));
	}

	const foldFile = function() {
		let fold_file = Object.create(null);
		_all_keys.filter(key => _m[key] != null)
			.forEach(key =>
				fold_file[key] = JSON.parse(JSON.stringify(_m[key]))
			);
		return fold_file;
	}


	///////////////////////////////////////////////
	// REMOVE PARTS (TARGETS KNOWN)
	///////////////////////////////////////////////

	/** Removes all nodes and edges, returning the graph to it's original state 
	 * @example 
	 * graph.clear()
	 */
	const clear = function() {
		_all_keys.filter(a => _m[a] != null)
			.forEach(key => delete _m[key]);
	}

	const clearGeometry = function() {
		_geom_keys.filter(a => _m[a] != null)
			.forEach(key => delete _m[key]);
	}

	/** Remove an edge
	 * @returns {GraphClean} number of edges removed
	 * @example 
	 * var result = graph.removeEdge(edge)
	 * // result.edges should equal 1
	 */
	const removeEdge = function(index) {
		return _edges.splice(index, 1);
		// edgeArrayDidChange();
		// return new GraphClean(undefined, edgesLength - edges.length);
	}

	const addVertexOnEdge = function(x, y, oldEdgeIndex) {
		if (edgesCount() < oldEdgeIndex) { return; }
		// new vertex entries
		// vertices_coords
		let new_vertex_index = newVertex(x, y);
		let incident_vertices = _m.edges_vertices[old_edge_index];
		// vertices_vertices, new vertex
		if (_m.vertices_vertices == null) { _m.vertices_vertices = []; }
		_m.vertices_vertices[new_vertex_index] = [...incident_vertices];
		// vertices_vertices, update incident vertices with new vertex
		incident_vertices.forEach((v,i,arr) => {
			let otherV = arr[(i+1)%arr.length];
			let otherI = _m.vertices_vertices[v].indexOf(otherV);
			_m.vertices_vertices[v][otherI] = new_vertex_index;
		})
		// vertices_faces
		if (_m.edges_faces != null && _m.edges_faces[old_edge_index] != null) {
			_m.vertices_faces[new_vertex_index] = [..._m.edges_faces[old_edge_index]];
		}
		// new edges entries
		// set edges_vertices
		let new_edges = [
			{ edges_vertices: [incident_vertices[0], new_vertex_index] },
			{ edges_vertices: [new_vertex_index, incident_vertices[1]] }
		];
		// set new index in edges_ arrays
		new_edges.forEach((e,i) => e.i = _m.edges_vertices.length+i);
		// copy over relevant data if it exists
		["edges_faces", "edges_assignment", "edges_foldAngle"]
			.filter(key => _m[key] != null && _m[key][old_edge_index] != null)
			.forEach(key => {
				// todo, copy these arrays
				new_edges[0][key] = _m[key][old_edge_index];
				new_edges[1][key] = _m[key][old_edge_index];
			});

		// todo: recalculate "edges_length"
		// todo: copy over edgeOrders. don't need to do this with faceOrders

		new_edges.forEach((edge,i) =>
			Object.keys(edge)
				.filter(key => key !== "i")
				.forEach(key => _m[key][edge.i] = edge[key])
		);
		let incident_faces_indices = _m.edges_faces[old_edge_index];
		let face_edges = _m.faces_edges

		let incident_faces_edges = incident_faces_indices.map(i => _m.faces_edges[i]);
		let incident_faces_vertices = incident_faces_indices.map(i => _m.faces_vertices[i]);

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
				let verts = pairs.map(e => _m.edges_vertices[e])
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
				throw "something wrong with faces_edges construction";
			})
			face.splice(edgeIndex, 1, ...edges);
			return edges;
		});
		// remove old data
		// ["edges_vertices", "edges_faces", "edges_assignment", "edges_foldAngle", "edges_length"]
		// 	.filter(key => _m[key] != null)
		// 	.forEach(key => _m[key][old_edge_index] = undefined);
		remove_edges(_m, [old_edge_index]);
	}

	/** Searches and removes any edges connecting the two nodes supplied in the arguments
	 * @param {GraphNode} node1 first node
	 * @param {GraphNode} node2 second node
	 * @returns {GraphClean} number of edges removed. in the case of an unclean graph, there may be more than one
	 * @example 
	 * var result = graph.removeEdgeBetween(node1, node2)
	 * // result.edges should be >= 1
	 */
	const removeEdgeBetween = function(node1, node2) {
		// var edgesLength = edges.length;
		_edges = _edges.filter((e) => 
			(e[0] === node1 && el[1] === node2) ||
			(e[0] === node2 && el[1] === node1) );
		// edgeArrayDidChange();
		// return new GraphClean(undefined, edgesLength - edges.length);
	}

	/** Remove a node and any edges that connect to it
	 * @param {GraphNode} node the node that will be removed
	 * @returns {GraphClean} number of nodes and edges removed
	 * @example 
	 * var result = graph.removeNode(node)
	 * // result.node will be 1
	 * // result.edges will be >= 0
	 */
	const removeNode = function(node) {
		var nodesLength = nodes.length;
		var edgesLength = edges.length;
		nodes = nodes.filter(function(el){ return el !== node; });
		edges = edges.filter(function(el){ return el.nodes[0] !== node && el.nodes[1] !== node; });
		if (edges.length != edgesLength){ edgeArrayDidChange(); }
		if (nodes.length != nodesLength){ nodeArrayDidChange(); }
		// todo: a graphDidChange object like graphClean but
		return GraphClean(nodesLength-nodes.length, edgesLength-edges.length);
	}

	/** Remove the second node and replaces all mention of it with the first in every edge
	 * @param {GraphNode} node1 first node to merge, this node will persist
	 * @param {GraphNode} node2 second node to merge, this node will be removed
	 * @returns {GraphClean} 1 removed node, newly duplicate and circular edges will be removed
	 * @example 
	 * var result = graph.mergeNodes(node1, node2)
	 * // result.node will be 1
	 * // result.edges will be >= 0
	 */
	const mergeNodes = function(node1, node2) {
		if (node1 === node2) { return undefined; }
		edges.forEach(function(edge){
			if (edge.nodes[0]===node2){edge.nodes[0]=node1;}
			if (edge.nodes[1]===node2){edge.nodes[1]=node1;}
		},this);
		// this potentially created circular edges
		var nodesLength = nodes.length;
		nodes = nodes.filter(function(el){ return el !== node2; });
		return GraphClean(nodesLength - nodes.length).join(this.cleanGraph());
	}

	/** Check if a node is isolated and remove it if so
	 * @returns {GraphClean} the number of nodes removed
	 */
	const removeNodeIfIsolated = function(node) {
		if (edges.filter(function(edge){return edge.nodes[0]===node||edge.nodes[1]===node;},this).length === 0){ return GraphClean(); };
		nodes = nodes.filter(function(el){ return el !== node; });
		nodeArrayDidChange();
		return GraphClean(1, 0);
	}

	///////////////////////////////////////////////
	// REMOVE PARTS (SEARCH REQUIRED TO LOCATE)
	///////////////////////////////////////////////

	/** Removes any node that isn't a part of an edge
	 * @returns {GraphClean} the number of nodes removed
	 * @example 
	 * var result = graph.removeIsolatedNodes()
	 * // result.node will be >= 0
	 */
	const removeIsolatedNodes = function() {
		// this function relies on .index values. it would be nice if it didn't
		nodeArrayDidChange();
		// build an array containing T/F if a node is NOT isolated for each node
		var nodeDegree = [];
		for(var i = 0; i < nodes.length; i++){ nodeDegree[i] = false; }
		for(var i = 0; i < edges.length; i++){
			nodeDegree[edges[i].nodes[0].index] = true;
			nodeDegree[edges[i].nodes[1].index] = true;
		}
		// filter out isolated nodes
		var nodeLength = nodes.length;
		nodes = nodes.filter(function(el,i){ return nodeDegree[i]; });
		var isolatedCount = nodeLength - nodes.length;
		if (isolatedCount > 0){ nodeArrayDidChange(); }
		return GraphClean().isolatedNodes(isolatedCount);
	}

	/** Remove all edges that contain the same node at both ends
	 * @returns {GraphClean} the number of edges removed
	 * @example 
	 * var result = graph.removeCircularEdges()
	 * // result.edges will be >= 0
	 */
	const removeCircularEdges = function() {
		var edgesLength = edges.length;
		edges = edges.filter((el) => el.nodes[0] !== el.nodes[1]);
		if (edges.length != edgesLength){ edgeArrayDidChange(); }
		return GraphClean().circularEdges(edgesLength - edges.length);
	}

	/** Remove edges that are similar to another edge
	 * @returns {GraphClean} the number of edges removed
	 * @example 
	 * var result = graph.removeDuplicateEdges()
	 * // result.edges will be >= 0
	 */
	const removeDuplicateEdges = function() {
		var count = 0;
		var spliceIndex = [];
		for(var i = 0; i < edges.length-1; i++){
			for(var j = edges.length-1; j > i; j--){
				if (edges[i].isSimilarToEdge(edges[j])){
					// console.log("duplicate edge found");
					edges.splice(j, 1);
					spliceIndex.push(j);
					count += 1;
				}
			}
		}
		if (count > 0){ edgeArrayDidChange(); }
		return GraphClean().duplicateEdges(count);
	}

	/** Graph specific clean function: removes circular and duplicate edges, refreshes .index. Only modifies edges array.
	 * @returns {GraphClean} the number of edges removed
	 * @example 
	 * var result = graph.cleanGraph()
	 * // result.edges will be >= 0
	 */
	const cleanGraph = function() {
		edgeArrayDidChange();
		nodeArrayDidChange();
		// should we remove isolated nodes as a part of clean()?
		// return removeDuplicateEdges().join(removeCircularEdges()).join(removeIsolatedNodes());
		// return removeDuplicateEdges().join(removeCircularEdges());
		var dups = removeDuplicateEdges();
		var circ = removeCircularEdges();
		return dups.join(circ);
	}

	/** Clean calls cleanGraph(), gets overwritten when subclassed. Removes circular and duplicate edges, refreshes .index. Only modifies edges array.
	 * @returns {GraphClean} the number of edges removed
	 * @example 
	 * var result = graph.clean()
	 * // result.edges will be >= 0
	 */
	const clean = function() {
		return cleanGraph();
	}

	///////////////////////////////////////////////
	// GET PARTS
	///////////////////////////////////////////////

	const get_vertex_count = function(graph){
		Object.keys(this);
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

	/** Searches for an edge that contains the 2 nodes supplied in the function call. Will return first edge found, if graph isn't clean it will miss any subsequent duplicate edges.
	 * @returns {GraphEdge} edge, if exists. undefined, if no edge connects the nodes (not adjacent)
	 * @example 
	 * var edge = graph.getEdgeConnectingNodes(node1, node2)
	 */
	const getEdgeConnectingNodes = function(node1, node2) {
		// for this to work, graph must be cleaned. no duplicate edges
		for(var i = 0; i < edges.length; i++){
			if ( (edges[i].nodes[0] === node1 && edges[i].nodes[1] === node2 ) ||
				(edges[i].nodes[0] === node2 && edges[i].nodes[1] === node1 ) ){
				return edges[i];
			}
		}
		// nodes are not adjacent
		return undefined;
	}

	/** Searches for all edges that contains the 2 nodes supplied in the function call. This is suitable for unclean graphs, graphs with duplicate edges.
	 * @returns {GraphEdge[]} array of edges, if any exist. empty array if no edge connects the nodes (not adjacent)
	 * @example 
	 * var array = graph.getEdgesConnectingNodes(node1, node2)
	 */
	const getEdgesConnectingNodes = function(node1, node2) {
		return edges.filter((el) =>
			(el.nodes[0] === node1 && el.nodes[1] === node2 ) ||
			(el.nodes[0] === node2 && el.nodes[1] === node1 )
		);
	}

	///////////////////////////////////////////////
	// COPY
	///////////////////////////////////////////////

	/** Deep-copy the contents of this graph and return it as a new object
	 * @returns {Graph} 
	 * @example
	 * var copiedGraph = graph.copy()
	 */
	const copy = function() {
		nodeArrayDidChange();
		edgeArrayDidChange();
		var g = Graph();
		for(var i = 0; i < nodes.length; i++){
			var n = g.addNode(GraphNode(g));
			Object.assign(n, nodes[i]);
			n.graph = g; n.index = i;
		}
		for(var i = 0; i < edges.length; i++){
			var index = [edges[i].nodes[0].index, edges[i].nodes[1].index];
			var e = g.addEdge(GraphEdge(g, g.nodes[index[0]], g.nodes[index[1]]));
			Object.assign(e, edges[i]);
			e.graph = g; e.index = i;
			e.nodes = [g.nodes[index[0]], g.nodes[index[1]]];
		}
		return g;
	}

	/** Convert this graph into an array of connected graphs, attempting one Hamilton path if possible. Edges are arranged in each graph.edges with connected edges next to one another.
	 * @returns {Graph[]} 
	 */
	const connectedGraphs = function() {
		var cp = copy();
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

	const nodeArrayDidChange = function(){for(var i=0;i<nodes.length;i++){nodes[i].index=i;}}
	const edgeArrayDidChange = function(){for(var i=0;i<edges.length;i++){edges[i].index=i;}}

	return {
		// get scale() { return _scale; },
		// set onMouseMove(handler) { _onmousemove = handler; },
		get nodes() { return _nodes; },
		get edges() { return _edges.map(e => e.nodes.map(n => n.index)) },
		// nodeType,
		// edgeType,
		didChange,
		newVertex,
		newEdge,
		validate,
		verticesCount,
		edgesCount,
		facesCount,
		clear,
		load,
		foldFile,
		removeEdge,
		removeEdgeBetween,
		removeNode,
		mergeNodes,
		removeNodeIfIsolated,
		removeIsolatedNodes,
		removeCircularEdges,
		removeDuplicateEdges,
		cleanGraph,
		clean,
		getEdgeConnectingNodes,
		getEdgesConnectingNodes,
		copy,
		connectedGraphs,
		nodeArrayDidChange,
		edgeArrayDidChange,
		get vertices_coords() { return _m.vertices_coords; },
		get vertices_vertices() { return _m.vertices_vertices; },
		get vertices_faces() { return _m.vertices_faces; },
		get edges_vertices() { return _m.edges_vertices; },
		get edges_faces() { return _m.edges_faces; },
		get edges_assignment() { return _m.edges_assignment; },
		get edges_foldAngle() { return _m.edges_foldAngle; },
		get edges_length() { return _m.edges_length; },
		get faces_vertices() { return _m.faces_vertices; },
		get faces_edges() { return _m.faces_edges; },
		get edgeOrders() { return _m.edgeOrders; },
		get faceOrders() { return _m.faceOrders; },
		get file_frames() { return _m.file_frames; }
	};

}

/** Nodes are 1 of the 2 fundamental components in a graph */
function GraphNode(g) {
	// let params = Array.from(arguments);
	// let graph = params.filter(p => p iskindof Graph).shift();
	// pointer to the graph this node is a member. required for adjacent calculations
	let graph = g;
	// the index of this node in the graph's node array
	let index; 
	// for speeding up algorithms, temporarily store information here
	let cache = {};

	/** Get an array of edges that contain this node
	 * @returns {GraphEdge[]} array of adjacent edges
	 * @example
	 * var adjacent = node.adjacentEdges()
	 */
	const adjacentEdges = function() {
		return graph.edges.filter((el) =>
			el.nodes[0] === this || el.nodes[1] === this
		);
	}

	/** Get an array of nodes that share an edge in common with this node
	 * @returns {GraphNode[]} array of adjacent nodes
	 * @example
	 * var adjacent = node.adjacentNodes()
	 */
	const adjacentNodes = function() {
		var checked = []; // the last step, to remove duplicate nodes
		return adjacentEdges()
			.filter((el) => !el.isCircular())
			.map((el) => (el.nodes[0] === this ? el.nodes[1] : el.nodes[0]))
			.filter((el) => (checked.indexOf(el) >= 0 ? false : checked.push(el)) );
	}
	/** Test if a node is connected to another node by an edge
	 * @param {GraphNode} node test adjacency between this and the supplied parameter
	 * @returns {boolean} true or false, adjacent or not
	 * @example
	 * var isAdjacent = node.isAdjacentToNode(anotherNode);
	 */
	const isAdjacentToNode = function(node) {
		return (graph.getEdgeConnectingNodes(this, node) != null);
	}
	/** The degree of a node is the number of adjacent edges, circular edges are counted twice
	 * @returns {number} number of adjacent edges
	 * @example
	 * var degree = node.degree();
	 */
	const degree = function() {
		return graph.edges.map((el) => {
			var sum = 0;
			if (el.nodes[0] === this){ sum += 1; }
			if (el.nodes[1] === this){ sum += 1; }
			return sum;
		}).reduce((a, b) => a + b);
		// this implementation does not consider the invalid graph case where circular edges are counted twice.
		// return this.adjacentEdges().length;
	}

	return {
		graph,
		index,
		cache,
		adjacentEdges,
		adjacentNodes,
		isAdjacentToNode,
		degree
	};
}

/** Edges are 1 of the 2 fundamental components in a graph. 1 edge connect 2 nodes. */
function GraphEdge(g, node1, node2) {
	let graph = g;   // pointer to the graph this edge is a member. required for adjacent calculations
	let index;  // the index of this edge in the graph's edge array
	let nodes = [node1, node2]; // not optional. every edge must connect 2 nodes

	/** Get an array of edges that share a node in common with this edge
	 * @returns {GraphEdge[]} array of adjacent edges
	 * @example
	 * var adjacent = edge.adjacentEdges()
	 */
	const adjacentEdges = function() {
		return graph.edges.filter((el) => 
			el !== this && (
				el.nodes[0] === this.nodes[0] || 
				el.nodes[0] === this.nodes[1] || 
				el.nodes[1] === this.nodes[0] || 
				el.nodes[1] === this.nodes[1]
			));
	}
	/** Get the two nodes of this edge
	 * @returns {GraphNode[]} the two nodes of this edge
	 * @example
	 * var adjacent = edge.adjacentNodes()
	 */
	const adjacentNodes = function() {
		return nodes.slice();
	}
	/** Test if an edge is connected to another edge by a common node
	 * @param {GraphEdge} edge test adjacency between this and supplied parameter
	 * @returns {boolean} true or false, adjacent or not
	 * @example
	 * var isAdjacent = edge.isAdjacentToEdge(anotherEdge)
	 */
	const isAdjacentToEdge = function(edge) {
		return( (nodes[0] === edge.nodes[0]) || (nodes[1] === edge.nodes[1]) ||
		        (nodes[0] === edge.nodes[1]) || (nodes[1] === edge.nodes[0]) );
	}
	/** Test if an edge contains the same nodes as another edge
	 * @param {GraphEdge} edge test similarity between this and supplied parameter
	 * @returns {boolean} true or false, similar or not
	 * @example
	 * var isSimilar = edge.isSimilarToEdge(anotherEdge)
	 */
	const isSimilarToEdge = function(edge) {
		return( (nodes[0] === edge.nodes[0] && nodes[1] === edge.nodes[1] ) ||
		        (nodes[0] === edge.nodes[1] && nodes[1] === edge.nodes[0] ) );
	}
	/** A convenience function, supply one of the edge's incident nodes and get back the other node
	 * @param {GraphNode} node must be one of the edge's 2 nodes
	 * @returns {GraphNode} the node that is the other node
	 * @example
	 * var node2 = edge.otherNode(node1)
	 */
	const otherNode = function(node) {
		if (nodes[0] === node){ return nodes[1]; }
		if (nodes[1] === node){ return nodes[0]; }
	}
	/** Test if an edge points both at both ends to the same node
	 * @returns {boolean} true or false, circular or not
	 * @example
	 * var isCircular = edge.isCircular()
	 */
	const isCircular = function() {
		return nodes[0] === nodes[1];
	}
	// do we need to test for invalid edges?
		// && this.nodes[0] !== undefined;
	/** If this is a edge with duplicate edge(s), returns an array of duplicates not including self
	 * @returns {GraphEdge[]} array of duplicate GraphEdge, empty array if none
	 * @example
	 * var array = edge.duplicateEdges()
	 */
	const duplicateEdges = function() {
		return graph.edges.filter((el) => isSimilarToEdge(el));
	}
	/** For adjacent edges, get the node they share in common
	 * @param {GraphEdge} otherEdge an adjacent edge
	 * @returns {GraphNode} the node in common, undefined if not adjacent
	 * @example
	 * var sharedNode = edge1.commonNodeWithEdge(edge2)
	 */
	const commonNodeWithEdge = function(otherEdge) {
		// only for adjacent edges
		if (this === otherEdge) return undefined;
		if (nodes[0] === otherEdge.nodes[0] || nodes[0] === otherEdge.nodes[1]) 
			return nodes[0];
		if (nodes[1] === otherEdge.nodes[0] || nodes[1] === otherEdge.nodes[1])
			return this.nodes[1];
	}
	/** For adjacent edges, get this edge's node that is not shared in common with the other edge
	 * @param {GraphEdge} otherEdge an adjacent edge
	 * @returns {GraphNode} the node on this edge not shared by the other edge, undefined if not adjacent
	 * @example
	 * var notSharedNode = edge1.uncommonNodeWithEdge(edge2)
	 */
	const uncommonNodeWithEdge = function(otherEdge) {
		// only for adjacent edges
		if (this === otherEdge) return undefined;
		if (nodes[0] === otherEdge.nodes[0] || nodes[0] === otherEdge.nodes[1])
			return nodes[1];
		if (nodes[1] === otherEdge.nodes[0] || nodes[1] === otherEdge.nodes[1])
			return nodes[0];
		// optional ending: returning both of its two nodes, as if to say all are uncommon
	}

	return {
		graph,
		index,
		nodes,
		adjacentEdges,
		adjacentNodes,
		isAdjacentToEdge,
		isSimilarToEdge,
		otherNode,
		isCircular,
		duplicateEdges,
		commonNodeWithEdge,
		uncommonNodeWithEdge
	};
}

/** A survey of the objects removed from a graph after a function is performed */
function GraphClean(numNodes, numEdges) {
	// "total" must be greater than or equal to the other members of each object
	// "total" can include removed edges/nodes which don't count as "duplicate" or "circular"
	let nodes = {
		total: 0,
		isolated: 0
	};
	let edges = {
		total: 0,
		duplicate: 0,
		circular: 0
	};
	// let params = Array.from(arguments);
	// let numbers = params.filter(p => !isNaN(p));

	if (numNodes != null) { nodes.total = numNodes; }
	if (numEdges != null) { edges.total = numEdges; }

	const join = function(report) {
		nodes.total += report.nodes.total;
		edges.total += report.edges.total;
		nodes.isolated += report.nodes.isolated;
		edges.duplicate += report.edges.duplicate;
		edges.circular += report.edges.circular;
		return this;
	}
	// use these setters instead of setting the property directly, handles totals
	const isolatedNodes = function(num) {
		nodes.isolated = num;
		nodes.total += num;
		return this;
	}
	const duplicateEdges = function(num) {
		edges.duplicate = num;
		edges.total += num;
		return this;
	}
	const circularEdges = function(num) {
		edges.circular = num;
		edges.total += num;
		return this;
	}
	return {
		nodes,
		edges,
		join,
		isolatedNodes,
		duplicateEdges,
		circularEdges
	};
}
