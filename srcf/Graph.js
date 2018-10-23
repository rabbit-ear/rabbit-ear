// Graph.js
// an undirected graph with edges and vertices and circuit-defining faces
// with operations targeting the .FOLD file spec github.com/edemaine/fold
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

"use strict";

/** A survey of the objects removed from a graph after a function is performed */

// "total" must be greater than or equal to the other members of each object
// "total" can include removed edges/vertices which don't count as "duplicate" or "circular"
// edges;
// vertices;
// intialize a GraphClean with totals, but no other details like "duplicate" or "isolated"

// function GraphClean() {
// 	return {
// 		vertices: {total:0, isolated:0},
// 		edges: {total:0, duplicate:0, circular:0},
// 		duplicateEdges: function(e){ }
// 	};
// }

// function GraphClean(){
// 	var vertices = {total:0, isolated:0}; 
// 	var edges = {total:0, duplicate:0, circular:0};

// 	function duplicateEdges(e){ }
// 	function circularEdges(e){ }
// 	function isolatedNodes(n){ }

// 	return Object.freeze({
// 		vertices,
// 		edges, 
// 		duplicateEdges,
// 		circularEdges,
// 		isolatedNodes
// 	});
// }

// vertices is an array of whatever
//   [ a, b, c ]
// edges is an array of arrays, indices in vertices array. only 2 per array
//   [ [i,j], [k,l], ... ]


// SPEC 1.1

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






///////////////////////////////////////////////
// GET PARTS
///////////////////////////////////////////////

/** Get an array of edge indices that contain the vertex
 * @returns {GraphEdge[]} array of adjacent edges
 * @example
 * var adjacent = vertex.adjacentEdges()
 */
function vertex_adjacent_edges(graph, vertex){
	return graph.edges_vertices
		.map((edge, index)=> ({edge:edge, index:index}))
		.filter(obj => obj.edge[0] === vertex || obj.edge[1] === vertex)
		.map(obj => obj.index)
}
/** Get an array of vertices that share an edge in common with this vertex
 * @returns {GraphNode[]} array of adjacent vertices
 * @example
 * var adjacent = vertex.adjacentNodes()
 */
function vertex_adjacent_vertices(graph, vertex){
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
/** Test if a vertex is connected to another vertex by an edge
 * @param {GraphNode} vertex test adjacency between this and the supplied parameter
 * @returns {boolean} true or false, adjacent or not
 * @example
 * var isAdjacent = vertex.isAdjacentToNode(anotherNode);
 */
function are_vertices_adjacent(graph, a, b){
	return vertex_adjacent_vertices(graph, a).indexOf(b) != -1
}
/** The degree of a vertex is the number of adjacent edges, circular edges are counted twice
 * @returns {number} number of adjacent edges
 * @example
 * var degree = vertex.degree();
 */
function degree(graph, vertex){
	return graph.edges_vertices.filter(edge => edge[0] === vertex).length +
	       graph.edges_vertices.filter(edge => edge[1] === vertex).length;
}
/** Removes any vertex that isn't a part of an edge
 * @returns {GraphClean} the number of vertices removed
 * @example 
 * var result = graph.removeIsolatedNodes()
 * // result.vertex will be >= 0
 */


/** Remove all edges that contain the same vertex at both ends
 * @returns {GraphClean} the number of edges removed
 * @example 
 * var result = graph.removeCircularEdges()
 * // result.edges will be >= 0
 */
function remove_circular_edges(graph){
	let circular = graph.edges_vertices.filter(edge => edge[0] === edge[1]);
	if(this.edges.length != edgesLength){ this.edgeArrayDidChange(); }
	return new GraphClean().circularEdges(edgesLength - this.edges.length);
}

/** Remove edges that are similar to another edge
 * @returns {GraphClean} the number of edges removed
 * @example 
 * var result = graph.removeDuplicateEdges()
 * // result.edges will be >= 0
 */
function removeDuplicateEdges(){
	var count = 0;
	var spliceIndex = [];
	for(var i = 0; i < this.edges.length-1; i++){
		for(var j = this.edges.length-1; j > i; j--){
			if(this.edges[i].isSimilarToEdge(this.edges[j])){
				// console.log("duplicate edge found");
				this.edges.splice(j, 1);
				spliceIndex.push(j);
				count += 1;
			}
		}
	}
	if(count > 0){ this.edgeArrayDidChange(); }
	return new GraphClean().duplicateEdges(count);
}

/** Graph specific clean function: removes circular and duplicate edges, refreshes .index. Only modifies edges array.
 * @returns {GraphClean} the number of edges removed
 * @example 
 * var result = graph.cleanGraph()
 * // result.edges will be >= 0
 */
function cleanGraph(){
	this.edgeArrayDidChange();
	this.vertexArrayDidChange();
	// should we remove isolated vertices as a part of clean()?
	// return this.removeDuplicateEdges().join(this.removeCircularEdges()).join(this.removeIsolatedNodes());
	// return this.removeDuplicateEdges().join(this.removeCircularEdges());
	var dups = this.removeDuplicateEdges();
	var circ = this.removeCircularEdges();
	return dups.join(circ);
}

/** Clean calls cleanGraph(), gets overwritten when subclassed. Removes circular and duplicate edges, refreshes .index. Only modifies edges array.
 * @returns {GraphClean} the number of edges removed
 * @example 
 * var result = graph.clean()
 * // result.edges will be >= 0
 */
function clean(){ return this.cleanGraph(); }



///////////////////////////////////////////////
// REMOVE PARTS
///////////////////////////////////////////////

export default { clean_isolated_vertices }

// modifies input fold file // changes contents of vertices_coords array.
function clean_isolated_vertices(fold){
	// check for existence of vertex in these arrays:
	let refs = [fold.faces_vertices, fold.edges_vertices]
		.filter(a => a != null);
	let isolated = isolated_indices(fold.vertices_coords.length, refs);
	if(isolated == undefined){ return; } // no isolated vertices
	let s = 0, index_map = isolated.map(isolated => isolated ? --s : s);
	// modify vertex array
	isolated.map((b,i) => i)
		.filter(i => isolated[i])
		.reverse()
		.forEach(i => fold.vertices_coords.splice(i,1));
	// update all _vertices data in fold
	vertices_did_update(fold, index_map);
}


/* compare a 0-indexed array (array's length) against a set of
 *  reference arrays, search for no mention of each index in refs
 *  which are arrays of arrays themselves. inside an array.
 */
function isolated_indices(array_length, ...reference_arrays){
	let isolated = Array(array_length).fill(true)
	vertex_search: // need for-loops to be able to break
	for(let ra = 0; ra < reference_arrays.length; ra += 1){
		for(let arr = 0; arr < reference_arrays[ra].length; arr += 1){
			for(let entry = 0; entry < reference_arrays[ra][arr].length; entry += 1){
				for(let i = 0; i < reference_arrays[ra][arr][entry].length; i += 1){
					let v = reference_arrays[ra][arr][entry][i];
					if(isolated[v] == true){
						isolated[v] = false;
						array_length -= 1;
					}
					if(array_length == 0){ break vertex_search; } // we fliped N bits. break
				}
			}
		}
	}
	return isolated;
}

function vertices_did_update(graph, index_map){
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
}


// this comes from fold.js. still working on the best way to require() the fold module
var faces_vertices_to_edges = function (mesh) {
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

// let ff = {
// 	"file_spec": 1.1,
// 	"file_creator": "",
// 	"file_author": "",
// 	"file_classes": ["singleModel"],
// 	"frame_attributes": ["2D"],
// 	"frame_title": "",
// 	"frame_classes": ["creasePattern"],
// 	"vertices_coords": [[0,0], [1,0], [1,1], [0,1]],
// 	"edges_vertices": [[0,1], [1,3], [3,0]],
// 	"edges_assignment": ["B","B","B","B"],
// 	"faces_vertices": [[0,1,3]],
// 	"faces_layer": [0],
// 	"file_frames": [{
// 		"frame_classes": ["creasePattern"],
// 		"frame_parent":0,
// 		"inherit":true
// 	}]
// };

// clean_isolated_vertices(ff);

// console.log(ff);

function remove_vertex(fold, vertex_index){

// vertices_coords
// vertices_vertices
// edges_vertices
// faces_vertices
	// fold.vertices_coords.splice(vertex_index,1);
	// if(fold.vertices_vertices != null){
	// 	fold.vertices_vertices.forEach((entry,e) => entry.forEach((vertex,v) => {
	// 		if(v == vertex_index){ fold.vertices_vertices[e][v] = null; }
	// 		if(v > vertex_index){ fold.vertices_vertices[e][v] -= 1; }
	// 	}));
	// }


	// Array.from(arguments).slice(2)
	// 	.forEach(obj => obj.forEach(arr => arr.forEach(a => a += shift[a])))

	// // returns an "invalid" object: everything index in each key in the fold file is now invalid.
	// {
	// 	faces_edges:[3,6],
	// 	edges_vertices:[2,6,7,8],
	// }
}



function remove_edge(edge_index, edge_array){
	edge_array.splice(edge_index, 1);
}

/** Searches and removes any edges connecting the two vertices supplied in the arguments
 * @param {[[number, number]]} an array of two-integer arrays.
 * @param {[number, number]} a two-integer array
 * @returns {boolean} true if an edge matched and was removed
 * @example 
 * var result = removeEdge(edges, e)
 */

function remove_edges_with_vertex(vertex_index, edge_array){
	edge_array = edge_array
		.filter(e => e[0] === vertex_index || e[1] === vertex_index);
}

function remove_edges_with_vertices(a_index, b_index, edge_array){
	edge_array = edge_array.filter(e =>
		(e[0] === a_index && e[1] === b_index) ||
		(e[0] === b_index && e[1] === a_index)
	);
	Array.from(arguments).slice(3).forEach()
}

function remove_from_array(array, match_function){
	let remove = array.map((a,i) => match_function(a,i));
	let s = 0, shift = remove.map(rem => rem ? --s : s);
	array = array.filter(e => match_function(e));
	return shift;
}

/** Remove a vertex and any edges that connect to it
 * @param {GraphNode} vertex the vertex that will be removed
 * @returns {GraphClean} number of vertices and edges removed
 * @example 
 * var result = graph.removeNode(vertex)
 * // result.vertex will be 1
 * // result.edges will be >= 0
 */
function remove_vertex(vertex_array, edge_array, vertex_index){
	edge_array = edge_array.filter(el => el[0] !== vertex_index && el[1] !== vertex_index);
	vertex_array = vertex_array.filter(el => el !== vertex);
	vertex_array.splice()
}

/** Remove the second vertex and replaces all mention of it with the first in every edge
 * @param {GraphNode} vertex1 first vertex to merge, this vertex will persist
 * @param {GraphNode} vertex2 second vertex to merge, this vertex will be removed
 * @returns {GraphClean} 1 removed vertex, newly duplicate and circular edges will be removed
 * @example 
 * var result = graph.mergeNodes(vertex1, vertex2)
 * // result.vertex will be 1
 * // result.edges will be >= 0
 */
function mergeNodes(node1, node2){
	if(node1 === node2) { return undefined; }
	this.edges.forEach(function(edge){
		if(edge.nodes[0]===node2){edge.nodes[0]=node1;}
		if(edge.nodes[1]===node2){edge.nodes[1]=node1;}
	},this);
	// this potentially created circular edges
	var nodesLength = this.nodes.length;
	this.nodes = this.nodes.filter(function(el){ return el !== node2; });
	return new GraphClean(nodesLength - this.nodes.length).join(this.cleanGraph());
}



/** Check if a node is isolated and remove it if so
 * @returns {GraphClean} the number of nodes removed
 */
function removeNodeIfIsolated(node){
	if(this.edges.filter(function(edge){return edge.nodes[0]===node||edge.nodes[1]===node;},this).length === 0){ return new GraphClean(); };
	this.nodes = this.nodes.filter(function(el){ return el !== node; });
	this.nodeArrayDidChange();
	return new GraphClean(1, 0);
}














/** Get an array of edges_vertices indices that share a node in common with this edge
 * @returns {[number]} array of adjacent edges
 * @example
 * var adjacent = edge.adjacentEdges()
 */
function edgeAdjacentEdges(fold, edge_index){
	let match = fold.edges_vertices[edge_index];
	return fold.edges_vertices
		.map((edge,index) => ({edge:edge, index:index}))
		.filter(e => e.edge[0] === match[0] || 
					 e.edge[0] === match[1] || 
					 e.edge[1] === match[0] || 
					 e.edge[1] === match[1])
		.map(e => e.index)
}

/** Test if an edge is connected to another edge by a common node
 * @param {GraphEdge} edge test adjacency between this and supplied parameter
 * @returns {boolean} true or false, adjacent or not
 * @example
 * var isAdjacent = edge.isAdjacentToEdge(anotherEdge)
 */
function areEdgesAdjacent(fold, a, b){
	return( (fold.edges_vertices[a][0] === fold.edges_vertices[b][0]) ||
	        (fold.edges_vertices[a][0] === fold.edges_vertices[b][1]) || 
	        (fold.edges_vertices[a][1] === fold.edges_vertices[b][0]) ||
	        (fold.edges_vertices[a][1] === fold.edges_vertices[b][1]) );
}
/** Test if an edge contains the same nodes as another edge
 * @param {GraphEdge} edge test similarity between this and supplied parameter
 * @returns {boolean} true or false, similar or not
 * @example
 * var isSimilar = edge.isSimilarToEdge(anotherEdge)
 */
function areEdgesSimilar(fold, a, b){
	return( (fold.edges_vertices[a][0] === fold.edges_vertices[b][0] && 
		     fold.edges_vertices[a][1] === fold.edges_vertices[b][1] ) ||
			(fold.edges_vertices[a][0] === fold.edges_vertices[b][1] && 
			 fold.edges_vertices[a][1] === fold.edges_vertices[b][0] ) );
}
/** A convenience function, supply one of the edge's incident nodes and get back the other node
 * @param {GraphNode} node must be one of the edge's 2 nodes
 * @returns {GraphNode} the node that is the other node
 * @example
 * var node2 = edge.otherNode(node1)
 */
function otherNode(node){
	if(this.nodes[0] === node){ return this.nodes[1]; }
	if(this.nodes[1] === node){ return this.nodes[0]; }
	return undefined;
}
/** Test if an edge points both at both ends to the same node
 * @returns {boolean} true or false, circular or not
 * @example
 * var isCircular = edge.isCircular()
 */
function isCircular(){ return this.nodes[0] === this.nodes[1]; }
// do we need to test for invalid edges?
	// && this.nodes[0] !== undefined;
/** If this is a edge with duplicate edge(s), returns an array of duplicates not including self
 * @returns {GraphEdge[]} array of duplicate GraphEdge, empty array if none
 * @example
 * var array = edge.duplicateEdges()
 */
function duplicateEdges(){
	return this.graph.edges.filter(function(el){
		return this.isSimilarToEdge(el);
	}, this);
}
/** For adjacent edges, get the node they share in common
 * @param {GraphEdge} otherEdge an adjacent edge
 * @returns {GraphNode} the node in common, undefined if not adjacent
 * @example
 * var sharedNode = edge1.commonNodeWithEdge(edge2)
 */
function commonNodeWithEdge(otherEdge){
	// only for adjacent edges
	if(this === otherEdge) return undefined;
	if(this.nodes[0] === otherEdge.nodes[0] || this.nodes[0] === otherEdge.nodes[1]) 
		return this.nodes[0];
	if(this.nodes[1] === otherEdge.nodes[0] || this.nodes[1] === otherEdge.nodes[1])
		return this.nodes[1];
	return undefined;
}
/** For adjacent edges, get this edge's node that is not shared in common with the other edge
 * @param {GraphEdge} otherEdge an adjacent edge
 * @returns {GraphNode} the node on this edge not shared by the other edge, undefined if not adjacent
 * @example
 * var notSharedNode = edge1.uncommonNodeWithEdge(edge2)
 */
function uncommonNodeWithEdge(otherEdge){
	// only for adjacent edges
	if(this === otherEdge) return undefined;
	if(this.nodes[0] === otherEdge.nodes[0] || this.nodes[0] === otherEdge.nodes[1]) 
		return this.nodes[1];
	if(this.nodes[1] === otherEdge.nodes[0] || this.nodes[1] === otherEdge.nodes[1])
		return this.nodes[0];
	// optional ending: returning both of its two nodes, as if to say all are uncommon
	return undefined;
}

































/** Searches for an edge that contains the 2 nodes supplied in the function call. Will return first edge found, if graph isn't clean it will miss any subsequent duplicate edges.
 * @returns {GraphEdge} edge, if exists. undefined, if no edge connects the nodes (not adjacent)
 * @example 
 * var edge = graph.getEdgeConnectingNodes(node1, node2)
 */
function getEdgeConnectingNodes(node1, node2){
	// for this to work, graph must be cleaned. no duplicate edges
	for(var i = 0; i < this.edges.length; i++){
		if( (this.edges[i].nodes[0] === node1 && this.edges[i].nodes[1] === node2 ) ||
			(this.edges[i].nodes[0] === node2 && this.edges[i].nodes[1] === node1 ) ){
			return this.edges[i];
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
function getEdgesConnectingNodes(node1, node2){
	return this.edges.filter(function(el){
		return (el.nodes[0] === node1 && el.nodes[1] === node2 ) ||
			   (el.nodes[0] === node2 && el.nodes[1] === node1 );
	});
}

///////////////////////////////////////////////
// COPY
///////////////////////////////////////////////

/** Deep-copy the contents of this graph and return it as a new object
 * @returns {Graph} 
 * @example
 * var copiedGraph = graph.copy()
 */
function copy(){
	this.nodeArrayDidChange();
	this.edgeArrayDidChange();
	var g = new Graph();
	for(var i = 0; i < this.nodes.length; i++){
		var n = g.addNode(new GraphNode(g));
		Object.assign(n, this.nodes[i]);
		n.graph = g; n.index = i;
	}
	for(var i = 0; i < this.edges.length; i++){
		var index = [this.edges[i].nodes[0].index, this.edges[i].nodes[1].index];
		var e = g.addEdge(new GraphEdge(g, g.nodes[index[0]], g.nodes[index[1]]));
		Object.assign(e, this.edges[i]);
		e.graph = g; e.index = i;
		e.nodes = [g.nodes[index[0]], g.nodes[index[1]]];
	}
	return g;
}

/** Convert this graph into an array of connected graphs, attempting one Hamilton path if possible. Edges are arranged in each graph.edges with connected edges next to one another.
 * @returns {Graph[]} 
 */
function connectedGraphs(){
	var cp = this.copy();
	cp.clean();
	cp.removeIsolatedNodes();
	// cache every node's adjacent edge #
	cp.nodes.forEach(function(node){ node.cache['adj'] = node.adjacentEdges().length; },this);
	var graphs = [];
	while(cp.edges.length > 0){
		var graph = new Graph();
		// create a duplicate set of nodes in the new emptry graph, remove unused nodes at the end
		cp.nodes.forEach(function(node){graph.addNode(Object.assign(new cp.nodeType(graph),node));},this);
		// select the node with most adjacentEdges
		var node = cp.nodes.slice().sort(function(a,b){return b.cache['adj'] - a.cache['adj'];})[0];
		var adj = node.adjacentEdges();
		while(adj.length > 0){
			// approach 1
			// var nextEdge = adj[0];
			// approach 2
			// var nextEdge = adj.sort(function(a,b){return b.otherNode(node).cache['adj'] - a.otherNode(node).cache['adj'];})[0];
			// approach 3, prioritize nodes with even number of adjacencies
			var smartList = adj.filter(function(el){return el.otherNode(node).cache['adj'] % 2 == 0;},this)
			if(smartList.length == 0){ smartList = adj; }
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



/** A multigraph is a graph which allows circular and duplicate edges */
class Multigraph extends Graph{
	cleanGraph(){
		this.edgeArrayDidChange();
		this.nodeArrayDidChange();
		return new GraphClean();
	}
}
