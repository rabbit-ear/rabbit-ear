// graph.js
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

/** A survey of the objects removed from a graph after a function is performed */
const GraphClean = function(numNodes, numEdges) {
	// "total" must be greater than or equal to the other members of each object
	// "total" can include removed edges/nodes which don't count as "duplicate" or "circular"
	let _this = {
		nodes : {total:0, isolated:0},
		edges : {total:0, duplicate:0, circular:0},
	};
	if (numNodes != null) { _this.nodes.total = numNodes; }
	if (numEdges != null) { _this.edges.total = numEdges; }
	const join = function(report) {
		if (report == null) { return _this; }
		_this.nodes.total += report.nodes.total;
		_this.edges.total += report.edges.total;
		_this.nodes.isolated += report.nodes.isolated;
		_this.edges.duplicate += report.edges.duplicate;
		_this.edges.circular += report.edges.circular;
		return _this;
	}
	const isolatedNodes = function(num) {
		_this.nodes.isolated = num;
		_this.nodes.total += num;
		return _this;
	}
	const duplicateEdges = function(num) {
		_this.edges.duplicate = num;
		_this.edges.total += num;
		return _this;
	}
	const circularEdges = function(num) {
		_this.edges.circular = num;
		_this.edges.total += num;
		return _this;
	}
	Object.defineProperty(_this, "join", { value: join });
	Object.defineProperty(_this, "isolatedNodes", { value: isolatedNodes });
	Object.defineProperty(_this, "duplicateEdges", { value: duplicateEdges });
	Object.defineProperty(_this, "circularEdges", { value: circularEdges });
	return _this;
}

/** Nodes are 1 of the 2 fundamental components in a graph */
const GraphNode = function(graph) {
	let node = Object.create(null);
	node.graph = graph;
	// the index of this node in the graph's node array
	node.index = undefined;
	// for momoization, temporarily store information here
	node.cache = {};

	/**
	 * Get an array of edges that contain this node
	 * @returns {GraphEdge[]} array of adjacent edges
	 * @example
	 * var adjacent = node.adjacentEdges()
	 */
	const adjacentEdges = function(){
		return node.graph.edges
			.filter((el) => el.nodes[0] === node || el.nodes[1] === node);
	}
	/** 
	 * Get an array of nodes that share an edge in common with this node
	 * @returns {GraphNode[]} array of adjacent nodes
	 * @example
	 * var adjacent = node.adjacentNodes()
	 */
	const adjacentNodes = function(){
		let checked = []; // the last step, to remove duplicate nodes
		return adjacentEdges()
			.filter((el) => !el.isCircular)
			.map((el) => (el.nodes[0] === node)
				? el.nodes[1]
				: el.nodes[0])
			.filter((el) =>
				checked.indexOf(el) >= 0 ? false : checked.push(el)
			);
	}
	/** 
	 * Get both adjacent edges and nodes. saves on computation time
	 */
	const adjacent = function() {
		let adj = {
			edges: adjacentEdges()
		};
		let checked = []; // the last step, to remove duplicate nodes
		adj.nodes = adj.edges.filter((el) => !el.isCircular)
			.map((el) => (el.nodes[0] === node)
				? el.nodes[1]
				: el.nodes[0])
			.filter((el) =>
				checked.indexOf(el) >= 0 ? false : checked.push(el)
			);
		return adj;
	}
	/** Test if a node is connected to another node by an edge
	 * @param {GraphNode} node test adjacency between this and the supplied parameter
	 * @returns {boolean} true or false, adjacent or not
	 * @example
	 * var isAdjacent = node.isAdjacentToNode(anotherNode);
	 */
	const isAdjacentToNode = function(n) {
		return (node.graph.getEdgeConnectingNodes(node, n) !== undefined);
	}
	/** The degree of a node is the number of adjacent edges, circular edges are counted twice
	 * @returns {number} number of adjacent edges
	 * @example
	 * var degree = node.degree();
	 */
	const degree = function(){
		// circular edges are counted twice
		return node.graph.edges.map((el) =>
			el.nodes.map(n => n === node ? 1 : 0).reduce((a,b) => a + b, 0)
		).reduce((a, b) => a + b, 0);
	}
	Object.defineProperty(node, "adjacent", {get: function(){ return adjacent(); }});
	Object.defineProperty(node, "adjacentEdges", {get:function(){ return adjacentEdges(); }});
	Object.defineProperty(node, "adjacentNodes", {get:function(){ return adjacentNodes(); }});
	Object.defineProperty(node, "degree", {get:function(){ return degree(); }});
	Object.defineProperty(node, "isAdjacentToNode", {value: isAdjacentToNode });
	return node;
}

/** Edges are 1 of the 2 fundamental components in a graph. 1 edge connect 2 nodes. */
const GraphEdge = function(graph, node1, node2){

	let edge = Object.create(null);
	edge.graph = graph;   // pointer to the graph this edge is a member. required for adjacent calculations
	edge.index = undefined;  // the index of this edge in the graph's edge array
	edge.nodes = [node1, node2]; // not optional. every edge must connect 2 nodes

	/** Get an array of edges that share a node in common with this edge
	 * @returns {GraphEdge[]} array of adjacent edges
	 * @example
	 * var adjacent = edge.adjacentEdges()
	 */
	const adjacentEdges = function() {
		return edge.graph.edges.filter((e) => e !== edge &&
			(e.nodes[0] === edge.nodes[0] ||
			 e.nodes[0] === edge.nodes[1] ||
			 e.nodes[1] === edge.nodes[0] ||
			 e.nodes[1] === edge.nodes[1])
		)
	}
	/** Get the two nodes of this edge
	 * @returns {GraphNode[]} the two nodes of this edge
	 * @example
	 * var adjacent = edge.adjacentNodes()
	 */
	const adjacentNodes = function() { return [...edge.nodes]; }
	/** 
	 * Get both adjacent edges and nodes. saves on computation time
	 */
	const adjacent = function() {
		return {
			nodes: adjacentNodes(),
			edges: adjacentEdges()
		}
	}

	/** Test if an edge is connected to another edge by a common node
	 * @param {GraphEdge} edge test adjacency between this and supplied parameter
	 * @returns {boolean} true or false, adjacent or not
	 * @example
	 * var isAdjacent = edge.isAdjacentToEdge(anotherEdge)
	 */
	const isAdjacentToEdge = function(e) {
		return( (edge.nodes[0] === e.nodes[0]) || (edge.nodes[1] === e.nodes[1]) ||
		        (edge.nodes[0] === e.nodes[1]) || (edge.nodes[1] === e.nodes[0]) );
	}
	/** Test if an edge contains the same nodes as another edge
	 * @param {GraphEdge} edge test similarity between this and supplied parameter
	 * @returns {boolean} true or false, similar or not
	 * @example
	 * var isSimilar = edge.isSimilarToEdge(anotherEdge)
	 */
	const isSimilarToEdge = function(e) {
		return( (edge.nodes[0] === e.nodes[0] && edge.nodes[1] === e.nodes[1] ) ||
		        (edge.nodes[0] === e.nodes[1] && edge.nodes[1] === e.nodes[0] ) );
	}
	/** A convenience function, supply one of the edge's incident nodes and get back the other node
	 * @param {GraphNode} node must be one of the edge's 2 nodes
	 * @returns {GraphNode} the node that is the other node
	 * @example
	 * var node2 = edge.otherNode(node1)
	 */
	const otherNode = function(n) {
		if (edge.nodes[0] === n){ return edge.nodes[1]; }
		if (edge.nodes[1] === n){ return edge.nodes[0]; }
		return undefined;
	}
	/** Test if an edge points both at both ends to the same node
	 * @returns {boolean} true or false, circular or not
	 * @example
	 * var isCircular = edge.isCircular
	 */
	const isCircular = function() { return edge.nodes[0] === edge.nodes[1]; }
	// do we need to test for invalid edges?
		// && this.nodes[0] !== undefined;
	/** If this is a edge with duplicate edge(s), returns an array of duplicates not including self
	 * @returns {GraphEdge[]} array of duplicate GraphEdge, empty array if none
	 * @example
	 * var array = edge.duplicateEdges()
	 */
	const duplicateEdges = function() {
		return edge.graph.edges.filter((el) => edge.isSimilarToEdge(el));
	}
	/** For adjacent edges, get the node they share in common
	 * @param {GraphEdge} otherEdge an adjacent edge
	 * @returns {GraphNode} the node in common, undefined if not adjacent
	 * @example
	 * var sharedNode = edge1.commonNodeWithEdge(edge2)
	 */
	const commonNodeWithEdge = function(otherEdge) {
		// only for adjacent edges
		if (edge === otherEdge) { return undefined; }
		if (edge.nodes[0] === otherEdge.nodes[0] || edge.nodes[0] === otherEdge.nodes[1]) {
			return edge.nodes[0];
		}
		if (edge.nodes[1] === otherEdge.nodes[0] || edge.nodes[1] === otherEdge.nodes[1]) {
			return edge.nodes[1];
		}
		return undefined;
	}
	/** For adjacent edges, get this edge's node that is not shared in common with the other edge
	 * @param {GraphEdge} otherEdge an adjacent edge
	 * @returns {GraphNode} the node on this edge not shared by the other edge, undefined if not adjacent
	 * @example
	 * var notSharedNode = edge1.uncommonNodeWithEdge(edge2)
	 */
	const uncommonNodeWithEdge = function(otherEdge) {
		// only for adjacent edges
		if (edge === otherEdge) { return undefined; }
		if (edge.nodes[0] === otherEdge.nodes[0] || edge.nodes[0] === otherEdge.nodes[1]) {
			return edge.nodes[1];
		}
		if (edge.nodes[1] === otherEdge.nodes[0] || edge.nodes[1] === otherEdge.nodes[1]) {
			return edge.nodes[0];
		}
		// optional ending: returning both of its two nodes, as if to say all are uncommon
		return undefined;
	}

	Object.defineProperty(edge, "adjacent", {get:function(){ return adjacent(); }});
	Object.defineProperty(edge, "adjacentEdges", {get:function(){ return adjacentEdges(); }});
	Object.defineProperty(edge, "adjacentNodes", {get:function(){ return adjacentNodes(); }});
	Object.defineProperty(edge, "isAdjacentToEdge", {value: isAdjacentToEdge});
	Object.defineProperty(edge, "isSimilarToEdge", {value: isSimilarToEdge});
	Object.defineProperty(edge, "otherNode", {value: otherNode});
	Object.defineProperty(edge, "isCircular", {get:function(){ return isCircular(); }});
	Object.defineProperty(edge, "duplicateEdges", {value: duplicateEdges});
	Object.defineProperty(edge, "commonNodeWithEdge", {value: commonNodeWithEdge});
	Object.defineProperty(edge, "uncommonNodeWithEdge", {value: uncommonNodeWithEdge});

	return edge;
}
/** A graph is a set of nodes and edges connecting them */
export default function(){
	let graph = Object.create(null);

	graph.nodes = [];
	graph.edges = [];

	// for Javascript reasons, member types are overwritten when Graph is subclassed
	graph.types = {
		node: GraphNode,
		edge: GraphEdge
	}
	// nodeType = GraphNode;
	// edgeType = GraphEdge;

	// todo: callback hooks for when certain properties of the data structure have been altered
	graph.didChange = undefined;

	///////////////////////////////////////////////
	// ADD PARTS
	///////////////////////////////////////////////

	/** Create a node and add it to the graph
	 * @returns {GraphNode} pointer to the node
	 * @example
	 * var node = graph.newNode()
	 */
	const newNode = function() {
		return addNode(graph.types.node(graph));
	}

	/** Create an edge and add it to the graph
	 * @param {GraphNode} node1 the first node that the edge connects
	 * @param {GraphNode} node2 the second node that the edge connects
	 * @returns {GraphEdge} if successful, pointer to the edge
	 * @example
	 * var node1 = graph.newNode()
	 * var node2 = graph.newNode()
	 * graph.newEdge(node1, node2)
	 */
	const newEdge = function(node1, node2) {
		return addEdge(graph.types.edge(graph, node1, node2));
	}

	/** Add an already-initialized node to the graph
	 * @param {GraphNode} node must be already initialized
	 * @returns {GraphNode} pointer to the node
	 * @example
	 * // it's preferred to simply use graph.newNode()
	 * var node = new GraphNode(graph)
	 * graph.addNode(node)
	 */
	const addNode = function(node) {
		if (node == null){ throw "addNode() missing argument: 1 GraphNode"; }
		node.graph = graph;
		node.index = graph.nodes.length;
		graph.nodes.push(node);
		return node;
	}

	/** Add an already-initialized edge to the graph
	 * @param {GraphEdge} edge must be initialized, and two nodes must be already be a part of this graph
	 * @returns {GraphEdge} if successful, pointer to the edge
	 * @example
	 * // it's preferred to simply use graph.newEdge(node1, node2)
	 * var edge = new GraphEdge(graph, node1, node2)
	 * graph.addEdge(edge)
	 */
	const addEdge = function(edge) {
		if (edge.nodes[0] === undefined ||
		    edge.nodes[1] === undefined || 
		    edge.nodes[0].graph !== graph ||
		    edge.nodes[1].graph !== graph ){ return undefined; }
		edge.graph = graph;
		edge.index = graph.edges.length;
		graph.edges.push(edge);
		return edge;
	}

	/** Add already-initialized node objects from an array to the graph
	 * @param {GraphNode[]} nodes array of GraphNode
	 * @example <caption>Initalize 2 nodes and add them to the graph.</caption>
	 * var n = [new GraphNode(graph), new GraphNode(graph)];
	 * graph.addNodes(n);
	 * @returns {number} number of nodes added to the graph
	 */
	const addNodes = function(nodes) {
		// if (nodes === undefined || nodes.length <= 0){ throw "addNodes() must contain array of GraphNodes"; }
		// var len = this.nodes.length;
		// var checkedNodes = nodes.filter(function(el){ return (el instanceof GraphNode); });
		// this.nodes = this.nodes.concat(checkedNodes);
		// for(var i = len; i < this.nodes.length; i++){
		// 	this.nodes[i].graph = this;
		// 	this.nodes[i].index = i;
		// }
		// // calling clean() is not required
		// return this.nodes.length - len;
	}

	/** Add already-initialized edge objects from an array to the graph, cleaning out any duplicate and circular edges
	 * @returns {number} number of edges added to the graph
	 */
	const addEdges = function(edges) {
		// if (edges == undefined || edges.length <= 0){ throw "addEdges() must contain array of GraphEdges"; }
		// var len = this.edges.length;
		// var checkedEdges = edges.filter(function(el){ return (el instanceof GraphEdge); });
		// this.edges = this.edges.concat(checkedEdges);
		// for(var i = len; i < this.edges.length; i++){ this.edges[i].graph = this; }
		// // clean() required. there are potentially duplicate or circular edges
		// this.cleanGraph();
		// return this.edges.length - len;
	}

	/** Copies the contents of an existing node into a new node and adds it to the graph
	 * @returns {GraphNode} pointer to the node
	 */
	const copyNode = function(node) {
		return Object.assign(graph.newNode(), node);
	}

	/** Copies the contents of an existing edge into a new edge and adds it to the graph
	 * @returns {GraphEdge} pointer to the edge
	 */
	const copyEdge = function(edge) {
		return Object.assign(graph.newEdge(edge.nodes[0], edge.nodes[1]), edge);
	}

	///////////////////////////////////////////////
	// REMOVE PARTS (TARGETS KNOWN)
	///////////////////////////////////////////////

	/** Removes all nodes and edges, returning the graph to it's original state 
	 * @example 
	 * graph.clear()
	 */
	const clear = function() {
		graph.nodes = [];
		graph.edges = [];
		return graph;
	}

	/** Remove an edge
	 * @returns {GraphClean} number of edges removed
	 * @example 
	 * var result = graph.removeEdge(edge)
	 * // result.edges should equal 1
	 */
	const removeEdge = function(edge) {
		var edgesLength = graph.edges.length;
		graph.edges = graph.edges.filter((el) => el !== edge);
		edgeArrayDidChange();
		return GraphClean(undefined, edgesLength - graph.edges.length);
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
		var edgesLength = graph.edges.length;
		graph.edges = graph.edges.filter((el) => 
			!((el.nodes[0] === node1 && el.nodes[1] === node2) ||
			  (el.nodes[0] === node2 && el.nodes[1] === node1) )
		);
		edgeArrayDidChange();
		return GraphClean(undefined, edgesLength - graph.edges.length);
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
		var nodesLength = graph.nodes.length;
		var edgesLength = graph.edges.length;
		graph.nodes = graph.nodes.filter((n) => n !== node);
		graph.edges = graph.edges.filter((e) => e.nodes[0] !== node && e.nodes[1] !== node);
		if (graph.edges.length !== edgesLength){ edgeArrayDidChange(); }
		if (graph.nodes.length !== nodesLength){ nodeArrayDidChange(); }
		// todo: a graphDidChange object like graphClean but
		return GraphClean(nodesLength-graph.nodes.length, edgesLength-graph.edges.length);
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
		graph.edges.forEach((edge) => {
			if (edge.nodes[0] === node2) { edge.nodes[0] = node1; }
			if (edge.nodes[1] === node2) { edge.nodes[1] = node1; }
		});
		// this potentially created circular edges
		var nodesLength = graph.nodes.length;
		graph.nodes = graph.nodes.filter((n) => n !== node2);
		return GraphClean(nodesLength - graph.nodes.length).join(cleanGraph());
	}

	/** Check if a node is isolated and remove it if so
	 * @returns {GraphClean} the number of nodes removed
	 */
	const removeNodeIfIsolated = function(node) {
		if (graph.edges.filter((edge) => edge.nodes[0] === node || edge.nodes[1] === node).length === 0){ return new GraphClean(); };
		graph.nodes = graph.nodes.filter((el) => el !== node);
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
		for(var i = 0; i < graph.nodes.length; i++){ nodeDegree[i] = false; }
		for(var i = 0; i < graph.edges.length; i++){
			nodeDegree[graph.edges[i].nodes[0].index] = true;
			nodeDegree[graph.edges[i].nodes[1].index] = true;
		}
		// filter out isolated nodes
		var nodeLength = graph.nodes.length;
		graph.nodes = graph.nodes.filter((el,i) => nodeDegree[i]);
		var isolatedCount = nodeLength - graph.nodes.length;
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
		var edgesLength = graph.edges.length;
		graph.edges = graph.edges.filter((el) => el.nodes[0] !== el.nodes[1]);
		if (graph.edges.length !== edgesLength){ edgeArrayDidChange(); }
		return GraphClean().circularEdges(edgesLength - graph.edges.length);
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
		for (var i = 0; i < graph.edges.length-1; i++) {
			for (var j = graph.edges.length-1; j > i; j--) {
				if (graph.edges[i].isSimilarToEdge(graph.edges[j])) {
					// console.log("duplicate edge found");
					graph.edges.splice(j, 1);
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
		// return this.removeDuplicateEdges().join(this.removeCircularEdges()).join(this.removeIsolatedNodes());
		// return this.removeDuplicateEdges().join(this.removeCircularEdges());
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
	const clean = function() { return cleanGraph(); }

	///////////////////////////////////////////////
	// GET PARTS
	///////////////////////////////////////////////
	
	/** Searches for an edge that contains the 2 nodes supplied in the function call. Will return first edge found, if graph isn't clean it will miss any subsequent duplicate edges.
	 * @returns {GraphEdge} edge, if exists. undefined, if no edge connects the nodes (not adjacent)
	 * @example 
	 * var edge = graph.getEdgeConnectingNodes(node1, node2)
	 */
	const getEdgeConnectingNodes = function(node1, node2) {
		// for this to work, graph must be cleaned. no duplicate edges
		for (var i = 0; i < graph.edges.length; i++) {
			if ((graph.edges[i].nodes[0] === node1 && graph.edges[i].nodes[1] === node2 ) ||
				(graph.edges[i].nodes[0] === node2 && graph.edges[i].nodes[1] === node1 )){
				return graph.edges[i];
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
		return graph.edges.filter((e) =>
			(e.nodes[0] === node1 && e.nodes[1] === node2 ) ||
			(e.nodes[0] === node2 && e.nodes[1] === node1 )
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
		for(var i = 0; i < graph.nodes.length; i++){
			var n = g.addNode(GraphNode(g));
			Object.assign(n, graph.nodes[i]);
			n.graph = g;
			n.index = i;
		}
		for(var i = 0; i < graph.edges.length; i++){
			var index = [graph.edges[i].nodes[0].index, graph.edges[i].nodes[1].index];
			var e = g.addEdge(GraphEdge(g, g.nodes[index[0]], g.nodes[index[1]]));
			Object.assign(e, graph.edges[i]);
			e.graph = g;
			e.index = i;
			e.nodes = [g.nodes[index[0]], g.nodes[index[1]]];
		}
		return g;
	}

	/** Convert this graph into an array of connected graphs, attempting one Hamilton path if possible. Edges are arranged in each graph.edges with connected edges next to one another.
	 * @returns {Graph[]} 
	 */
	const connectedGraphs = function() {
		// var cp = copy();
		// cp.clean();
		// cp.removeIsolatedNodes();
		// // cache every node's adjacent edge #
		// cp.nodes.forEach((node) => node.cache['adj'] = node.adjacent.edges.length);
		// var graphs = [];
		// while(cp.edges.length > 0){
		// 	var graph = Graph();
		// 	// create a duplicate set of nodes in the new emptry graph, remove unused nodes at the end
		// 	cp.nodes.forEach((node) => graph.addNode(Object.assign(cp.types.node(graph), node)));
		// 	// select the node with most adjacentEdges
		// 	var node = cp.nodes.slice().sort(function(a,b){return b.cache['adj'] - a.cache['adj'];})[0];
		// 	var adj:GraphEdge[] = node.adjacentEdges();
		// 	while(adj.length > 0){
		// 		// approach 1
		// 		// var nextEdge = adj[0];
		// 		// approach 2
		// 		// var nextEdge = adj.sort(function(a,b){return b.otherNode(node).cache['adj'] - a.otherNode(node).cache['adj'];})[0];
		// 		// approach 3, prioritize nodes with even number of adjacencies
		// 		var smartList = adj.filter(function(el){return el.otherNode(node).cache['adj'] % 2 == 0;},this)
		// 		if (smartList.length == 0){ smartList = adj; }
		// 		var nextEdge = smartList.sort(function(a,b){return b.otherNode(node).cache['adj'] - a.otherNode(node).cache['adj'];})[0];
		// 		var nextNode = nextEdge.otherNode(node);
		// 		// create new edge on other graph with pointers to its nodes
		// 		var newEdge = <GraphEdge>(<any>Object).assign(new cp.edgeType(graph,undefined,undefined), nextEdge);
		// 		newEdge.nodes = [graph.nodes[node.index], graph.nodes[nextNode.index] ];
		// 		graph.addEdge( newEdge );
		// 		// update this graph with 
		// 		node.cache['adj'] -= 1;
		// 		nextNode.cache['adj'] -= 1;
		// 		cp.edges = cp.edges.filter(function(el){ return el !== nextEdge; });
		// 		// prepare loop for next iteration. increment objects
		// 		node = nextNode;
		// 		adj = node.adjacentEdges();
		// 	}
		// 	// remove unused nodes
		// 	graph.removeIsolatedNodes();
		// 	graphs.push(graph);
		// }
		// return graphs;
	}	

	const nodeArrayDidChange = function() {
		for (var i = 0; i < graph.nodes.length; i++) {
			graph.nodes[i].index = i;
		}
	}
	const edgeArrayDidChange = function() {
		for (var i = 0; i < graph.edges.length; i++) {
			graph.edges[i].index = i;
		}
	}
	Object.defineProperty(graph, "newNode", {value: newNode});
	Object.defineProperty(graph, "newEdge", {value: newEdge});
	Object.defineProperty(graph, "addNode", {value: addNode});
	Object.defineProperty(graph, "addEdge", {value: addEdge});
	Object.defineProperty(graph, "addNodes", {value: addNodes});
	Object.defineProperty(graph, "addEdges", {value: addEdges});
	Object.defineProperty(graph, "copyNode", {value: copyNode});
	Object.defineProperty(graph, "copyEdge", {value: copyEdge});
	Object.defineProperty(graph, "clear", {value: clear});
	Object.defineProperty(graph, "removeEdge", {value: removeEdge});
	Object.defineProperty(graph, "removeEdgeBetween", {value: removeEdgeBetween});
	Object.defineProperty(graph, "removeNode", {value: removeNode});
	Object.defineProperty(graph, "mergeNodes", {value: mergeNodes});
	Object.defineProperty(graph, "removeNodeIfIsolated", {value: removeNodeIfIsolated});
	Object.defineProperty(graph, "removeIsolatedNodes", {value: removeIsolatedNodes});
	Object.defineProperty(graph, "removeCircularEdges", {value: removeCircularEdges});
	Object.defineProperty(graph, "removeDuplicateEdges", {value: removeDuplicateEdges});
	Object.defineProperty(graph, "cleanGraph", {value: cleanGraph});
	Object.defineProperty(graph, "clean", {value: clean});
	Object.defineProperty(graph, "getEdgeConnectingNodes", {value: getEdgeConnectingNodes});
	Object.defineProperty(graph, "getEdgesConnectingNodes", {value: getEdgesConnectingNodes});
	Object.defineProperty(graph, "copy", {value: copy});
	Object.defineProperty(graph, "connectedGraphs", {value: connectedGraphs});
	Object.defineProperty(graph, "nodeArrayDidChange", {value: nodeArrayDidChange});
	Object.defineProperty(graph, "edgeArrayDidChange", {value: edgeArrayDidChange});

	return graph;
}

/** A multigraph is a graph which allows circular and duplicate edges */
const Multigraph = function() {
	let multigraph = Graph();

	const cleanGraph = function() {
		multigraph.edgeArrayDidChange();
		multigraph.nodeArrayDidChange();
		return GraphClean();
	}
	return multigraph;
}
