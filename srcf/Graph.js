// Graph.js
// a mathematical undirected graph with edges and nodes
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

"use strict";

/** A survey of the objects removed from a graph after a function is performed */

// "total" must be greater than or equal to the other members of each object
// "total" can include removed edges/nodes which don't count as "duplicate" or "circular"
// edges;
// nodes;
// intialize a GraphClean with totals, but no other details like "duplicate" or "isolated"

// function GraphClean() {
// 	return {
// 		nodes: {total:0, isolated:0},
// 		edges: {total:0, duplicate:0, circular:0},
// 		duplicateEdges: function(e){ }
// 	};
// }

// function GraphClean(){
// 	var nodes = {total:0, isolated:0}; 
// 	var edges = {total:0, duplicate:0, circular:0};

// 	function duplicateEdges(e){ }
// 	function circularEdges(e){ }
// 	function isolatedNodes(n){ }

// 	return Object.freeze({
// 		nodes,
// 		edges, 
// 		duplicateEdges,
// 		circularEdges,
// 		isolatedNodes
// 	});
// }

// nodes is an array of whatever
//   [ a, b, c ]
// edges is an array of arrays, indices in nodes array. only 2 per array
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
// REMOVE PARTS
///////////////////////////////////////////////

export default { clean_isolated_vertices }

// modifies input fold file
function clean_isolated_vertices(fold_file){
	// check for existence of vertex in these arrays:
	let refs = [fold_file.faces_vertices, fold_file.edges_vertices]
		.filter(a => a != null);
	let isolated = isolated_indices(fold_file.vertices_coords.length, refs);
	if(isolated == undefined){ return; } // no isolated vertices
	let s = 0, index_map = isolated.map(isolated => isolated ? --s : s);
	// modify vertex array
	isolated.map((b,i) => i)
		.filter(i => isolated[i])
		.reverse()
		.forEach(i => fold_file.vertices_coords.splice(i,1));
	// update reference arrays
	fold_file.faces_vertices = fold_file.faces_vertices
		.map(entry => entry = entry.map(v => v + index_map[v]));
	fold_file.edges_vertices = fold_file.edges_vertices
		.map(entry => entry = entry.map(v => v + index_map[v]));
}

// remove unused vertices based on appearance in faces_vertices only
// changes contents of vertices_coords array.
function isolated_indices(array_length, ...reference_arrays){
	let isolated = Array(array_length).fill(true)
	vertex_search: // for loops-need to be able to break from inner loops
	for(let ra = 0; ra < reference_arrays.length; ra += 1){
		for(let arr = 0; arr < reference_arrays[ra].length; arr += 1){
			for(let entry = 0; entry < reference_arrays[ra][arr].length; entry += 1){
				for(let i = 0; i < reference_arrays[ra][arr][entry].length; i += 1){
					let v = reference_arrays[ra][arr][entry][i];
					console.log(v);
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

// function remove_node(fold_file, node_index){
	// let shift = Graph.remove_from_array(fold_file.edges_vertices, function(n,i))

	// Array.from(arguments).slice(2)
	// 	.forEach(obj => obj.forEach(arr => arr.forEach(a => a += shift[a])))

	// returns an "invalid" object: everything index in each key in the fold file is now invalid.
	// {
	// 	faces_edges:[3,6],
	// 	edges_vertices:[2,6,7,8],
	// }
// }



function remove_edge(edge_index, edge_array){
	edge_array.splice(edge_index, 1);
}

/** Searches and removes any edges connecting the two nodes supplied in the arguments
 * @param {[[number, number]]} an array of two-integer arrays.
 * @param {[number, number]} a two-integer array
 * @returns {boolean} true if an edge matched and was removed
 * @example 
 * var result = removeEdge(edges, e)
 */

function remove_edges_with_node(node_index, edge_array){
	edge_array = edge_array
		.filter(e => e[0] === node_index || e[1] === node_index);
}

function remove_edges_with_nodes(a_index, b_index, edge_array){
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

/** Remove a node and any edges that connect to it
 * @param {GraphNode} node the node that will be removed
 * @returns {GraphClean} number of nodes and edges removed
 * @example 
 * var result = graph.removeNode(node)
 * // result.node will be 1
 * // result.edges will be >= 0
 */
function remove_node(node_array, edge_array, node_index){
	edge_array = edge_array.filter(el => el[0] !== node_index && el[1] !== node_index);
	node_array = node_array.filter(el => el !== node);
	node_array.splice()
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

///////////////////////////////////////////////
// REMOVE PARTS (SEARCH REQUIRED TO LOCATE)
///////////////////////////////////////////////

/** Removes any node that isn't a part of an edge
 * @returns {GraphClean} the number of nodes removed
 * @example 
 * var result = graph.removeIsolatedNodes()
 * // result.node will be >= 0
 */
function removeIsolatedNodes(){
	// this function relies on .index values. it would be nice if it didn't
	this.nodeArrayDidChange();
	// build an array containing T/F if a node is NOT isolated for each node
	var nodeDegree = [];
	for(var i = 0; i < this.nodes.length; i++){ nodeDegree[i] = false; }
	for(var i = 0; i < this.edges.length; i++){
		nodeDegree[this.edges[i].nodes[0].index] = true;
		nodeDegree[this.edges[i].nodes[1].index] = true;
	}
	// filter out isolated nodes
	var nodeLength = this.nodes.length;
	this.nodes = this.nodes.filter(function(el,i){ return nodeDegree[i]; });
	var isolatedCount = nodeLength - this.nodes.length;
	if(isolatedCount > 0){ this.nodeArrayDidChange(); }
	return new GraphClean().isolatedNodes(isolatedCount);
}

/** Remove all edges that contain the same node at both ends
 * @returns {GraphClean} the number of edges removed
 * @example 
 * var result = graph.removeCircularEdges()
 * // result.edges will be >= 0
 */
function removeCircularEdges(){
	var edgesLength = this.edges.length;
	this.edges = this.edges.filter(function(el){ return el.nodes[0] !== el.nodes[1]; });
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
	this.nodeArrayDidChange();
	// should we remove isolated nodes as a part of clean()?
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
// GET PARTS
///////////////////////////////////////////////

/** Get an array of edges that contain this node
 * @returns {GraphEdge[]} array of adjacent edges
 * @example
 * var adjacent = node.adjacentEdges()
 */
function nodeAdjacentEdges(n){
	return this.edges.filter(e => e[0] === n || e[1] === n)
}
/** Get an array of nodes that share an edge in common with this node
 * @returns {GraphNode[]} array of adjacent nodes
 * @example
 * var adjacent = node.adjacentNodes()
 */
function nodeAdjacentNodes(){
	var checked = []; // the last step, to remove duplicate nodes
	return this.adjacentEdges()
		.filter(function(el){ return !el.isCircular(); })
		.map(function(el){
			if(el.nodes[0] === this){ return el.nodes[1]; }
			return el.nodes[0];
		},this)
		.filter(function(el){
			return checked.indexOf(el) >= 0 ? false : checked.push(el);
		},this);
}
/** Test if a node is connected to another node by an edge
 * @param {GraphNode} node test adjacency between this and the supplied parameter
 * @returns {boolean} true or false, adjacent or not
 * @example
 * var isAdjacent = node.isAdjacentToNode(anotherNode);
 */
function isNodeAdjacentToNode(node){
	return (this.graph.getEdgeConnectingNodes(this, node) !== undefined);
}
/** The degree of a node is the number of adjacent edges, circular edges are counted twice
 * @returns {number} number of adjacent edges
 * @example
 * var degree = node.degree();
 */
function degree(){
	return this.graph.edges.map(function(el){
		var sum = 0;
		if(el.nodes[0] === this){ sum += 1; }
		if(el.nodes[1] === this){ sum += 1; }
		return sum;
	}, this).reduce(function(a, b){ return a + b; });
	// this implementation does not consider the invalid graph case where circular edges are counted twice.
	// return this.adjacentEdges().length;
}




























/** Get an array of edges that share a node in common with this edge
 * @returns {GraphEdge[]} array of adjacent edges
 * @example
 * var adjacent = edge.adjacentEdges()
 */
function adjacentEdges(){
	return this.graph.edges
	.filter(function(el) {  return el !== this &&
					(el.nodes[0] === this.nodes[0] || 
					 el.nodes[0] === this.nodes[1] || 
					 el.nodes[1] === this.nodes[0] || 
					 el.nodes[1] === this.nodes[1]); }, this)
}
/** Get the two nodes of this edge
 * @returns {GraphNode[]} the two nodes of this edge
 * @example
 * var adjacent = edge.adjacentNodes()
 */
function adjacentNodes(){
	return [this.nodes[0], this.nodes[1]];
}
/** Test if an edge is connected to another edge by a common node
 * @param {GraphEdge} edge test adjacency between this and supplied parameter
 * @returns {boolean} true or false, adjacent or not
 * @example
 * var isAdjacent = edge.isAdjacentToEdge(anotherEdge)
 */
function isAdjacentToEdge(edge){
	return( (this.nodes[0] === edge.nodes[0]) || (this.nodes[1] === edge.nodes[1]) ||
			(this.nodes[0] === edge.nodes[1]) || (this.nodes[1] === edge.nodes[0]) );
}
/** Test if an edge contains the same nodes as another edge
 * @param {GraphEdge} edge test similarity between this and supplied parameter
 * @returns {boolean} true or false, similar or not
 * @example
 * var isSimilar = edge.isSimilarToEdge(anotherEdge)
 */
function isSimilarToEdge(edge){
	return( (this.nodes[0] === edge.nodes[0] && this.nodes[1] === edge.nodes[1] ) ||
			(this.nodes[0] === edge.nodes[1] && this.nodes[1] === edge.nodes[0] ) );
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
