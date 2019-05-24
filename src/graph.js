//                              _
//                             | |
//         __ _ _ __ __ _ _ __ | |__
//        / _` | '__/ _` | '_ \| '_ \
//       | (_| | | | (_| | |_) | | | |
//        \__, |_|  \__,_| .__/|_| |_|
//         __/ |         | |
//        |___/          |_|
//
// an undirected graph with edges and nodes
//  "adjacent": 2 nodes are adjacent when they are connected by an edge
//              edges are adjacent when they both connect the same node
//  "similar": edges are similar if they contain the same 2 nodes,
//             even if in a different order
//  "incident": an edge is incident to its two nodes
//  "endpoints": a node is an endpoint of its edge
//  "size" the size of a graph is the number of edges
//  "cycle" a set of edges that form a closed circut, it's possible
//          to walk down a cycle and end up where you began without
//          visiting the same edge twice.
//  "circuit" a circuit is a cycle except that it's allowed to visit
//            the same node more than once.
//  "multigraph": not this graph. but the special case where
//                circular and duplicate edges are allowed
//  "degree": the degree of a node is how many edges are incident to it
//  "isolated": a node is isolated if it is connected to 0 edges, degree 0
//  "leaf": a node is a leaf if it is connected to only 1 edge, degree 1
//  "pendant": an edge incident with a leaf node
//
//  MIT open source license, Robby Kraft

const CleanPrototype = function() {
	let proto = Object.create(null);
	const join = function(report) {
		if (report == null) { return this; }
		this.nodes.total += report.nodes.total;
		this.edges.total += report.edges.total;
		this.nodes.isolated += report.nodes.isolated;
		this.edges.duplicate += report.edges.duplicate;
		this.edges.circular += report.edges.circular;
		return this;
	}
	const isolatedNodes = function(num) {
		this.nodes.isolated = num;
		this.nodes.total += num;
		return this;
	}
	const duplicateEdges = function(num) {
		this.edges.duplicate = num;
		this.edges.total += num;
		return this;
	}
	const circularEdges = function(num) {
		this.edges.circular = num;
		this.edges.total += num;
		return this;
	}
	Object.defineProperty(proto, "join", { value: join });
	Object.defineProperty(proto, "isolatedNodes", { value: isolatedNodes });
	Object.defineProperty(proto, "duplicateEdges", { value: duplicateEdges });
	Object.defineProperty(proto, "circularEdges", { value: circularEdges });
	return Object.freeze(proto);
}

/** A survey of the properties removed from a graph after an operation */
const GraphClean = function(numNodes, numEdges) {
	// "total" must be greater than or equal to the other members of each object
	// "total" can include removed edges/nodes which don't count
	//   as "duplicate" or "circular"
	let clean = Object.create(CleanPrototype());
	clean.nodes = {total:0, isolated:0};
	clean.edges = {total:0, duplicate:0, circular:0};
	if (numNodes != null) { clean.nodes.total = numNodes; }
	if (numEdges != null) { clean.edges.total = numEdges; }
	return clean;
}

/** Nodes are 1 of the 2 fundamental components in a graph */
const GraphNode = function(graph) {
	let node = Object.create(null);
	node.graph = graph;

	/**
	 * Get an array of edges that contain this node
	 * @returns {GraphEdge[]} array of adjacent edges
	 * @example
	 * var adjacent = node.adjacentEdges()
	 */
	const adjacentEdges = function() {
		return node.graph.edges
			.filter((el) => el.nodes[0] === node || el.nodes[1] === node);
	}
	/** 
	 * Get an array of nodes that share an edge in common with this node
	 * @returns {GraphNode[]} array of adjacent nodes
	 * @example
	 * var adjacent = node.adjacentNodes()
	 */
	const adjacentNodes = function() {
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
	 * Get both adjacent edges and nodes.
	 */
	const adjacent = function() {
		let adj = Object.create(null);
		adj.edges = adjacentEdges();
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
	 * @param {GraphNode} node test adjacency between this and parameter node
	 * @returns {boolean} true or false, adjacent or not
	 * @example
	 * var isAdjacent = node.isAdjacentToNode(anotherNode);
	 */
	const isAdjacentToNode = function(n) {
		return adjacentNodes.filter(node => node === n).length > 0;
	}
	/** The degree of a node is the number of adjacent edges
	 *   circular edges are counted twice
	 * @returns {number} number of adjacent edges
	 * @example
	 * var degree = node.degree();
	 */
	const degree = function() {
		// circular edges are counted twice
		return node.graph.edges.map((el) =>
			el.nodes.map(n => n === node ? 1 : 0).reduce((a,b) => a + b, 0)
		).reduce((a, b) => a + b, 0);
	}
	Object.defineProperty(node, "adjacent", {
		get: function() { return adjacent(); }
	});
	// Object.defineProperty(node, "adjacentEdges", {
	// 	get:function() { return adjacentEdges(); }
	// });
	// Object.defineProperty(node, "adjacentNodes", {
	// 	get:function() { return adjacentNodes(); }
	// });
	Object.defineProperty(node, "degree", {get:function() { return degree(); }});
	Object.defineProperty(node, "isAdjacentToNode", {value: isAdjacentToNode });
	return node;
}

/**
 * Edges are 1 of the 2 fundamental components in a graph. 
 * 1 edge connect 2 nodes.
 */
const GraphEdge = function(graph, node1, node2) {

	let edge = Object.create(null);
	edge.graph = graph; // pointer to the graph. required for adjacency tests
	edge.nodes = [node1, node2]; // required. every edge must connect 2 nodes

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
		let adj = Object.create(null);
		adj.nodes = adjacentNodes();
		adj.edges = adjacentEdges();
		return adj;
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
	 * @param {GraphEdge} edge test similarity between this and parameter
	 * @returns {boolean} true or false, similar or not
	 * @example
	 * var isSimilar = edge.isSimilarToEdge(anotherEdge)
	 */
	const isSimilarToEdge = function(e) {
		return( (edge.nodes[0] === e.nodes[0] && edge.nodes[1] === e.nodes[1] ) ||
		        (edge.nodes[0] === e.nodes[1] && edge.nodes[1] === e.nodes[0] ) );
	}
	/** Supply one of the edge's incident nodes and get back the other node
	 * @param {GraphNode} node must be one of the edge's 2 nodes
	 * @returns {GraphNode} the node that is the other node
	 * @example
	 * var node2 = edge.otherNode(node1)
	 */
	const otherNode = function(n) {
		if (edge.nodes[0] === n) { return edge.nodes[1]; }
		if (edge.nodes[1] === n) { return edge.nodes[0]; }
		return undefined;
	}
	/** Test if an edge points both at both ends to the same node
	 * @returns {boolean} true or false, circular or not
	 * @example
	 * var isCircular = edge.isCircular
	 */
	const isCircular = function() {
		return edge.nodes[0] === edge.nodes[1];
	}
	// do we need to test for invalid edges?
		// && this.nodes[0] !== undefined;
	/** If this is a edge with duplicate edge(s),
	 * returns an array of duplicates not including self
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
		if (edge === otherEdge) {
			return undefined;
		}
		if (edge.nodes[0] === otherEdge.nodes[0] ||
		    edge.nodes[0] === otherEdge.nodes[1] ) {
			return edge.nodes[0];
		}
		if (edge.nodes[1] === otherEdge.nodes[0] ||
		    edge.nodes[1] === otherEdge.nodes[1] ) {
			return edge.nodes[1];
		}
		return undefined;
	}
	/** For adjacent edges, get this edge's node that is not
	 *   shared in common with the other edge
	 * @param {GraphEdge} otherEdge an adjacent edge
	 * @returns {GraphNode} the node on this edge not shared
	 *   by the other edge, undefined if not adjacent
	 * @example
	 * var notSharedNode = edge1.uncommonNodeWithEdge(edge2)
	 */
	const uncommonNodeWithEdge = function(otherEdge) {
		// only for adjacent edges
		if (edge === otherEdge) { return undefined; }
		if (edge.nodes[0] === otherEdge.nodes[0] ||
		    edge.nodes[0] === otherEdge.nodes[1] ) {
			return edge.nodes[1];
		}
		if (edge.nodes[1] === otherEdge.nodes[0] ||
		    edge.nodes[1] === otherEdge.nodes[1] ) {
			return edge.nodes[0];
		}
		return undefined;
		// consider another alternative ending,
		// returning both of its two nodes, as if to say all are uncommon
	}

	Object.defineProperty(edge, "adjacent", {
		get:function() { return adjacent(); }
	});
	// Object.defineProperty(edge, "adjacentEdges", {
	// 	get:function() { return adjacentEdges(); }
	// });
	// Object.defineProperty(edge, "adjacentNodes", {
	// 	get:function() { return adjacentNodes(); }
	// });
	Object.defineProperty(edge, "isAdjacentToEdge", {value: isAdjacentToEdge});
	Object.defineProperty(edge, "isSimilarToEdge", {value: isSimilarToEdge});
	Object.defineProperty(edge, "otherNode", {value: otherNode});
	Object.defineProperty(edge, "isCircular", {
		get:function() { return isCircular(); }
	});
	Object.defineProperty(edge, "duplicateEdges", {value: duplicateEdges});
	Object.defineProperty(edge, "commonNodeWithEdge", {
		value: commonNodeWithEdge
	});
	Object.defineProperty(edge, "uncommonNodeWithEdge", {
		value: uncommonNodeWithEdge
	});

	return edge;
}
/** A graph is a set of nodes and edges connecting them */
const Graph = function() {
	let graph = Object.create(null);

	graph.nodes = [];
	graph.edges = [];

	// if this Graph is subclassed, member types are overwritten with new types
	graph.types = {
		node: GraphNode,
		edge: GraphEdge
	}

	// todo: callback for when properties of the graph have been altered
	// graph.didChange = undefined;

	///////////////////////////////////////////////
	// ADD PARTS
	///////////////////////////////////////////////

	/** Create a node and add it to the graph
	 * @returns {GraphNode} pointer to the node
	 * @example
	 * var node = graph.newNode()
	 */
	const newNode = function() {
		let node = graph.types.node(graph);
		Object.assign(node, ...arguments)
		node.graph = graph;
		graph.nodes.push(node);
		return node;
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
		let edge = graph.types.edge(graph, node1, node2);
		edge.graph = graph;
		graph.edges.push(edge);
		return edge;
	}

	/** Shallow copies the contents of an existing node into a new node
	*     and adds it to the graph
	 * @returns {GraphNode} pointer to the node
	 */
	const copyNode = function(node) {
		return Object.assign(graph.newNode(), node);
	}

	/** Shallow copies the contents of an existing edge into a new edge
	 *    and adds it to the graph
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
		return GraphClean(undefined, edgesLength - graph.edges.length);
	}

	/** Removes any edges which connect the two nodes supplied in the arguments
	 * @param {GraphNode} node1 first node
	 * @param {GraphNode} node2 second node
	 * @returns {GraphClean} number of edges removed. in the case of
	 *    an unclean graph, there may be more than one
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
		graph.edges = graph.edges
			.filter((e) => e.nodes[0] !== node && e.nodes[1] !== node);
		// todo: a graphDidChange object like graphClean but
		return GraphClean(
			nodesLength-graph.nodes.length,
			edgesLength-graph.edges.length
		);
	}

	/** Remove the second node, replaces any occurences in edges with the first
	 * @param {GraphNode} node1 first node to merge, this node will persist
	 * @param {GraphNode} node2 second node to merge, this node will be removed
	 * @returns {GraphClean} 1 removed node, newly duplicate and
	 *    circular edges will be removed
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
		return GraphClean(nodesLength - graph.nodes.length).join(clean());
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
		// build an array containing T/F if a node is NOT isolated
		var nodeDegree = Array(graph.nodes.length).fill(false);
		graph.nodes.forEach((n,i) => n._memo = i);
		graph.edges.forEach(e => {
			nodeDegree[e.nodes[0]._memo] = true;
			nodeDegree[e.nodes[1]._memo] = true;
		})
		graph.nodes.forEach((n,i) => delete n._memo);
		// filter out isolated nodes
		var nodeLength = graph.nodes.length;
		graph.nodes = graph.nodes.filter((el,i) => nodeDegree[i]);
		return GraphClean().isolatedNodes(nodeLength - graph.nodes.length);
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
		return GraphClean().duplicateEdges(count);
	}

	/** 
	 * Removes circular and duplicate edges, only modifies edges array.
	 * @returns {GraphClean} the number of edges removed
	 * @example 
	 * var result = graph.clean()
	 * // result.edges will be >= 0
	 */
	const clean = function() {
		// should we remove isolated nodes as a part of clean()?
		return removeDuplicateEdges()
			.join(removeCircularEdges());
			// .join(removeIsolatedNodes());
	}

	///////////////////////////////////////////////
	// GET PARTS
	///////////////////////////////////////////////
	
	/** Searches for an edge that contains the 2 nodes supplied in the
	 * function call. Will return first edge found, if graph isn't clean it
	 * will miss any subsequent duplicate edges.
	 * @returns {GraphEdge} edge if exists. undefined if nodes are not adjacent
	 * @example 
	 * var edge = graph.getEdgeConnectingNodes(node1, node2)
	 */
	const getEdgeConnectingNodes = function(node1, node2) {
		let edges = graph.edges;
		// for this to work, graph must be cleaned. no duplicate edges
		for (var i = 0; i < edges.length; i++) {
			if ((edges[i].nodes[0] === node1 && edges[i].nodes[1] === node2 ) ||
			    (edges[i].nodes[0] === node2 && edges[i].nodes[1] === node1 ) ) {
				return edges[i];
			}
		}
		// nodes are not adjacent
		return undefined;
	}

	/**
	 * Searches for all edges that contains the 2 nodes supplied in the
	 * function call. This is suitable for unclean graphs, graphs with
	 * duplicate edges.
	 * @returns {GraphEdge[]} array of edges, if any exist. empty array if
	 * no edge connects the nodes (not adjacent)
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

	/**
	 * Deep-copy the contents of this graph and return it as a new object
	 * @returns {Graph} 
	 * @example
	 * var copiedGraph = graph.copy()
	 */
	const copy = function() {
		graph.nodes.forEach((node,i) => node._memo = i);
		var g = Graph();
		for (var i = 0; i < graph.nodes.length; i++) {
			let n = g.newNode();
			Object.assign(n, graph.nodes[i]);
			n.graph = g;
		}
		for (var i = 0; i < graph.edges.length; i++) {
			let indices = graph.edges[i].nodes.map(n => n._memo)
			let e = g.newEdge(g.nodes[indices[0]], g.nodes[indices[1]]);
			Object.assign(e, graph.edges[i]);
			e.graph = g;
			e.nodes = [g.nodes[indices[0]], g.nodes[indices[1]]];
		}
		graph.nodes.forEach((node,i) => delete node._memo);
		g.nodes.forEach((node,i) => delete node._memo);
		return g;
	}

	/**
	 * Convert this graph into an array of subgraphs, making
	 * as few Eulerian path possible covering all edges without duplicates.
	 * Connected edges in each edge array are sequentially-indexed.
	 * @returns {Graph[]}
	 */
	const eulerianPaths = function() {
		var cp = copy();
		cp.clean();
		cp.removeIsolatedNodes();
		// _memo every node's adjacent edge #
		cp.nodes.forEach((node,i) => node._memo = {
			index: i,
			adj: node.adjacent.edges.length
		});
		var graphs = [];
		while (cp.edges.length > 0) {
			var subGraph = Graph();
			// create a duplicate set of nodes in the new emptry graph,
			// remove unused nodes at the end
			subGraph.nodes = cp.nodes.map((node) =>
				Object.assign(subGraph.types.node(subGraph), node)
			);
			subGraph.nodes.forEach(n => n.graph = subGraph);

			// select the node with most adjacentEdges
			var node = cp.nodes.slice().sort((a,b) => b._memo.adj - a._memo.adj)[0];
			var adj = node.adjacent.edges;
			while (adj.length > 0) {
				// approach 1
				// var nextEdge = adj[0];
				// approach 2
				// var nextEdge = adj.sort(function(a,b) {
				// 	return b.otherNode(node)._memo.adj 
				// 	  - a.otherNode(node)._memo.adj;
				// })[0];
				// approach 3, prioritize nodes with even number of adjacencies
				var smartList = adj
					.filter((el) => el.otherNode(node)._memo.adj % 2 == 0)
				if (smartList.length === 0) { smartList = adj; }
				var nextEdge = smartList.sort((a,b) => 
					b.otherNode(node)._memo.adj - a.otherNode(node)._memo.adj
				)[0];
				var nextNode = nextEdge.otherNode(node);
				// create new edge on other graph with pointers to its nodes
				var newEdge = Object
					.assign(subGraph.types.edge(subGraph,undefined,undefined), nextEdge);
				newEdge.nodes = [
					subGraph.nodes[node._memo.index],
					subGraph.nodes[nextNode._memo.index]
				];
				subGraph.edges.push(newEdge);
				// update this graph with 
				node._memo.adj -= 1;
				nextNode._memo.adj -= 1;
				cp.edges = cp.edges.filter((el) => el !== nextEdge);
				// prepare loop for next iteration. increment objects
				node = nextNode;
				adj = node.adjacent.edges;
			}
			// remove unused nodes
			subGraph.removeIsolatedNodes();
			graphs.push(subGraph);
		}
		return graphs;
	}

	Object.defineProperty(graph, "newNode", {value: newNode});
	Object.defineProperty(graph, "newEdge", {value: newEdge});
	Object.defineProperty(graph, "clear", {value: clear});
	Object.defineProperty(graph, "removeEdge", {value: removeEdge});
	Object.defineProperty(graph, "removeEdgeBetween", {
		value: removeEdgeBetween
	});
	Object.defineProperty(graph, "removeNode", {value: removeNode});
	Object.defineProperty(graph, "mergeNodes", {value: mergeNodes});
	Object.defineProperty(graph, "removeIsolatedNodes", {
		value: removeIsolatedNodes
	});
	Object.defineProperty(graph, "removeCircularEdges", {
		value: removeCircularEdges
	});
	Object.defineProperty(graph, "removeDuplicateEdges", {
		value: removeDuplicateEdges
	});
	Object.defineProperty(graph, "clean", {value: clean});
	Object.defineProperty(graph, "getEdgeConnectingNodes", {
		value: getEdgeConnectingNodes
	});
	Object.defineProperty(graph, "getEdgesConnectingNodes", {
		value: getEdgesConnectingNodes
	});
	Object.defineProperty(graph, "copy", {value: copy});
	Object.defineProperty(graph, "eulerianPaths", {value: connectedGraphs});

	return graph;
}

export default Graph;
