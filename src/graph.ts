// graph.js
// a mathematical undirected graph with edges and nodes
// mit open source license, robby kraft
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

/** a survey of the objects removed from a graph after a function is performed */
class GraphClean {
	// "total" must be greater than or equal to the other members of each object
	// "total" can include removed edges/nodes which don't count as "duplicate" or "circular"
	edges:{total:number, duplicate:number, circular:number};
	nodes:{total:number, isolated:number};
	// intialize a GraphClean with totals, but no other details like "duplicate" or "isolated"
	constructor(numNodes?:number, numEdges?:number){
		this.nodes = {total:0, isolated:0};
		this.edges = {total:0, duplicate:0, circular:0};
		if(numNodes !== undefined){ this.nodes.total = numNodes; }
		if(numEdges !== undefined){ this.edges.total = numEdges; }
	}
	join(report:GraphClean):GraphClean{
		this.nodes.total += report.nodes.total;
		this.edges.total += report.edges.total;
		this.nodes.isolated += report.nodes.isolated;
		this.edges.duplicate += report.edges.duplicate;
		this.edges.circular += report.edges.circular;
		return this;
	}
	// use these setters instead of setting the property directly, handles totals
	isolatedNodes(num:number):GraphClean{ this.nodes.isolated = num; this.nodes.total += num; return this; }
	duplicateEdges(num:number):GraphClean{ this.edges.duplicate = num; this.edges.total += num; return this; }
	circularEdges(num:number):GraphClean{ this.edges.circular = num; this.edges.total += num; return this; }
}
/** Nodes are 1 of the 2 fundamental components in a graph */
class GraphNode{
	graph:Graph;  // pointer to the graph this node is a member. required for adjacent calculations
	index:number; // the index of this node in the graph's node array

	constructor(graph:Graph){ this.graph = graph; }

	/** Get an array of edges that contain this node
	 * @returns {GraphEdge[]} array of adjacent edges
	 */
	adjacentEdges():GraphEdge[]{
		return this.graph.edges.filter(function(el:GraphEdge){
			return el.nodes[0] === this || el.nodes[1] === this;
		},this);
	}
	/** Get an array of nodes that share an edge in common with this node
	 * @returns {GraphNode[]} array of adjacent nodes
	 */
	adjacentNodes():GraphNode[]{
		var checked = []; // the last step, to remove duplicate nodes
		return this.adjacentEdges()
		.filter(function(el:GraphEdge){ return !el.isCircular(); })
		.map(function(el:GraphEdge){
			if(el.nodes[0] === this){ return el.nodes[1]; }
			return el.nodes[0];
		},this)
		.filter(function(el:GraphNode){
			return checked.indexOf(el) >= 0 ? false : checked.push(el);
		},this);
	}
	/** Test if a node is connected to another node by an edge
	 * @returns {boolean} true or false, adjacent or not
	 */
	isAdjacentToNode(node:GraphNode):boolean{
		return (this.graph.getEdgeConnectingNodes(this, node) !== undefined);
	}
	/** The degree of a node is the number of adjacent edges, circular edges are counted twice
	 * @returns {number} number of adjacent edges
	 */
	degree():number{
		return this.graph.edges.map(function(el){
			var sum = 0;
			if(el.nodes[0] === this){ sum += 1; }
			if(el.nodes[1] === this){ sum += 1; }
			return sum;
		}, this).reduce(function(a, b){ return a + b; });
		// this implementation is insufficient because it doesn't count circular edges twice
		// return this.adjacentEdges().length;
	}
}
/** Edges are 1 of the 2 fundamental components in a graph. 1 edge connect 2 nodes. */
class GraphEdge{
	graph:Graph;   // pointer to the graph this edge is a member. required for adjacent calculations
	index:number;  // the index of this edge in the graph's edge array
	nodes:[GraphNode,GraphNode]; // not optional. every edge must connect 2 nodes

	constructor(graph:Graph, node1:GraphNode, node2:GraphNode){
		this.graph = graph;
		this.nodes = [node1, node2];
	}

	/** Get an array of edges that share a node in common with this edge
	 * @returns {GraphEdge[]} array of adjacent edges
	 */
	adjacentEdges():GraphEdge[]{
		return this.graph.edges
		.filter(function(el:GraphEdge) {  return el !== this &&
		                (el.nodes[0] === this.nodes[0] || 
		                 el.nodes[0] === this.nodes[1] || 
		                 el.nodes[1] === this.nodes[0] || 
		                 el.nodes[1] === this.nodes[1]); }, this)
	}
	/** Get the two nodes of this edge
	 * @returns {GraphNode[]} the two nodes of this edge
	 */
	adjacentNodes():GraphNode[]{
		return [this.nodes[0], this.nodes[1]];
	}
	/** Test if an edge is connected to another edge by a common node
	 * @returns {boolean} true or false, adjacent or not
	 */
	isAdjacentToEdge(edge:GraphEdge):boolean{
		return( (this.nodes[0] === edge.nodes[0]) || (this.nodes[1] === edge.nodes[1]) ||
		        (this.nodes[0] === edge.nodes[1]) || (this.nodes[1] === edge.nodes[0]) );
	}
	/** Test if an edge contains the same nodes as another edge
	 * @returns {boolean} true or false, similar or not
	 */
	isSimilarToEdge(edge:GraphEdge):boolean{
		return( (this.nodes[0] === edge.nodes[0] && this.nodes[1] === edge.nodes[1] ) ||
		        (this.nodes[0] === edge.nodes[1] && this.nodes[1] === edge.nodes[0] ) );
	}
	/** Test if an edge points both at both ends to the same node
	 * @returns {boolean} true or false, circular or not
	 */
	isCircular():boolean{ return this.nodes[0] === this.nodes[1]; }
	// do we need to test for invalid edges?
		// && this.nodes[0] !== undefined;
	/** For adjacent edges, get the node they share in common
	 * @returns {GraphNode} the node in common, undefined if not adjacent
	 */
	commonNodeWithEdge(otherEdge:GraphEdge):GraphNode{
		// only for adjacent edges
		if(this === otherEdge) return undefined;
		if(this.nodes[0] === otherEdge.nodes[0] || this.nodes[0] === otherEdge.nodes[1]) 
			return this.nodes[0];
		if(this.nodes[1] === otherEdge.nodes[0] || this.nodes[1] === otherEdge.nodes[1])
			return this.nodes[1];
		return undefined;
	}
	/** For adjacent edges, get this edge's node that is not shared in common with the other edge
	 * @returns {GraphNode} the node not in common, undefined if not adjacent
	 */
	uncommonNodeWithEdge(otherEdge:GraphEdge):GraphNode{
		// only for adjacent edges
		if(this === otherEdge) return undefined;
		if(this.nodes[0] === otherEdge.nodes[0] || this.nodes[0] === otherEdge.nodes[1]) 
			return this.nodes[1];
		if(this.nodes[1] === otherEdge.nodes[0] || this.nodes[1] === otherEdge.nodes[1])
			return this.nodes[0];
		// optional ending: returning both of its two nodes, as if to say all are uncommon
		return undefined;
	}
}

/** A graph contains unlimited nodes and edges and can perform operations on them */
class Graph{
	nodes:GraphNode[];
	edges:GraphEdge[];
	// todo: callback hooks for when certain properties of the data structure have been altered
	didChange:(event:object)=>void;
	
	// When subclassed (ie. PlanarGraph) types are overwritten
	nodeType = GraphNode;
	edgeType = GraphEdge;

	constructor(){ this.clear(); }

	/** Deep-copy the contents of this graph and return it as a new object
	 * @returns {Graph} 
	 */
	duplicate():Graph{
		this.nodeArrayDidChange();
		this.edgeArrayDidChange();
		var g = new Graph();
		for(var i = 0; i < this.nodes.length; i++){
			var n = g.addNode(new GraphNode(g));
			(<any>Object).assign(n, this.nodes[i]);
			n.graph = g; n.index = i;
		}
		for(var i = 0; i < this.edges.length; i++){
			var index = [this.edges[i].nodes[0].index, this.edges[i].nodes[1].index];
			var e = g.addEdge(new GraphEdge(g, g.nodes[index[0]], g.nodes[index[1]]));
			(<any>Object).assign(e, this.edges[i]);
			e.graph = g; e.index = i;
			e.nodes = [g.nodes[index[0]], g.nodes[index[1]]];
		}
		return g;
	}

	///////////////////////////////////////////////
	// ADD PARTS
	///////////////////////////////////////////////

	/** Create a node and add it to the graph
	 * @returns {GraphNode} pointer to the node
	 */
	newNode():GraphNode {
		return this.addNode(new this.nodeType(this));
	}

	/** Create an edge and add it to the graph
	 * @param {GraphNode} two nodes that the edge connects
	 * @returns {GraphEdge} if successful, pointer to the edge
	 */
	newEdge(node1:GraphNode, node2:GraphNode):GraphEdge {
		return this.addEdge(new this.edgeType(this, node1, node2));
	}

	/** Add an already-initialized node to the graph
	 * @param {GraphNode} must be already initialized
	 * @returns {GraphNode} pointer to the node
	 */
	addNode(node:GraphNode):GraphNode{
		if(node == undefined){ throw "addNode() requires an argument: 1 GraphNode"; }
		node.graph = this;
		node.index = this.nodes.length;
		this.nodes.push(node);
		return node;
	}

	/** Add an already-initialized edge to the graph
	 * @param {GraphEdge} must be initialized, and two nodes must be already be a part of this graph
	 * @returns {GraphEdge} if successful, pointer to the edge
	 */
	addEdge(edge:GraphEdge):GraphEdge{
		if(edge.nodes[0] === undefined ||
		   edge.nodes[1] === undefined || 
		   edge.nodes[0].graph !== this ||
		   edge.nodes[1].graph !== this ){ return undefined; }
		edge.graph = this;
		edge.index = this.edges.length;
		this.edges.push(edge);
		return edge;
	}

	/** Add already-initialized node objects from an array to the graph
	 * @returns {number} number of nodes added to the graph
	 */
	addNodes(nodes:GraphNode[]):number{
		if(nodes === undefined || nodes.length <= 0){ throw "addNodes() must contain array of GraphNodes"; }
		var len = this.nodes.length;
		var checkedNodes = nodes.filter(function(el){ return (el instanceof GraphNode); });
		this.nodes = this.nodes.concat(checkedNodes);
		for(var i = len; i < this.nodes.length; i++){
			this.nodes[i].graph = this;
			this.nodes[i].index = i;
		}
		// calling clean() is not required
		return this.nodes.length - len;
	}

	/** Add already-initialized edge objects from an array to the graph, cleaning out any duplicate and circular edges
	 * @returns {number} number of edges added to the graph
	 */
	addEdges(edges:GraphEdge[]){
		if(edges == undefined || edges.length <= 0){ throw "addEdges() must contain array of GraphEdges"; }
		var len = this.edges.length;
		var checkedEdges = edges.filter(function(el){ return (el instanceof GraphEdge); });
		this.edges = this.edges.concat(checkedEdges);
		for(var i = len; i < this.edges.length; i++){ this.edges[i].graph = this; }
		// clean() required. there are potentially duplicate or circular edges
		this.cleanGraph();
		return this.edges.length - len;
	}

	/** Copies the contents of an existing node into a new node and adds it to the graph
	 * @returns {GraphNode} pointer to the node
	 */
	copyNode(node:GraphNode):GraphNode {
		var nodeClone = <GraphNode>(<any>Object).assign(this.newNode(), node);
		return this.addNode(nodeClone);
	}

	/** Copies the contents of an existing edge into a new edge and adds it to the graph
	 * @returns {GraphEdge} pointer to the edge
	 */
	copyEdge(edge:GraphEdge):GraphEdge {
		var edgeClone = (<any>Object).assign(this.newEdge(edge.nodes[0], edge.nodes[1]), edge);
		return this.addEdge(edgeClone);
	}

	///////////////////////////////////////////////
	// REMOVE PARTS
	///////////////////////////////////////////////
	//
	// TARGETS KNOWN

	/** Removes all nodes and edges, returning the graph to it's original state */
	clear():Graph{
		this.nodes = [];
		this.edges = [];
		return this;
	}

	/** Remove an edge
	 * @returns {GraphClean} number of edges removed
	 */
	removeEdge(edge:GraphEdge):GraphClean{
		var edgesLength = this.edges.length;
		this.edges = this.edges.filter(function(el){ return el !== edge; });
		this.edgeArrayDidChange();
		return new GraphClean(undefined, edgesLength - this.edges.length);
	}

	/** Searches and removes any edges connecting the two nodes supplied in the arguments
	 * @returns {GraphClean} number of edges removed. in the case of an unclean graph, there may be more than one
	 */
	removeEdgeBetween(node1:GraphNode, node2:GraphNode):GraphClean{
		var edgesLength = this.edges.length;
		this.edges = this.edges.filter(function(el){ 
			return !((el.nodes[0] === node1 && el.nodes[1] === node2) ||
			         (el.nodes[0] === node2 && el.nodes[1] === node1) );
		});
		this.edgeArrayDidChange();
		return new GraphClean(undefined, edgesLength - this.edges.length);
	}

	/** Remove a node and any edges that connect to it
	 * @returns {GraphClean} number of nodes and edges removed
	 */
	removeNode(node:GraphNode):GraphClean{
		var nodesLength = this.nodes.length;
		var edgesLength = this.edges.length;
		this.nodes = this.nodes.filter(function(el){ return el !== node; });
		this.edges = this.edges.filter(function(el){ return el.nodes[0] !== node && el.nodes[1] !== node; });
		if(this.edges.length != edgesLength){ this.edgeArrayDidChange(); }
		if(this.nodes.length != nodesLength){ this.nodeArrayDidChange(); }
		// todo: a graphDidChange object like graphClean but
		return new GraphClean(nodesLength-this.nodes.length, edgesLength-this.edges.length);
	}

	/** Remove the second node and replaces all mention of it with the first in every edge
	 * @returns {GraphClean} returns a pointer to the remaining node
	 */
	mergeNodes(node1:GraphNode, node2:GraphNode):GraphClean{
		if(node1 === node2) { return undefined; }
		this.edges = this.edges.map(function(el){
			if(el.nodes[0] === node2){ el.nodes[0] = node1; }
			if(el.nodes[1] === node2){ el.nodes[1] = node1; }
			return el;
		});
		var nodesLength = this.nodes.length;
		this.nodes = this.nodes.filter(function(el){ return el !== node2; });
		return new GraphClean(nodesLength - this.nodes.length).join(this.cleanGraph());
	}

	///////////////////////////////////////////////
	// REMOVE PARTS
	///////////////////////////////////////////////
	//
	// TARGETS UNKNOWN (SEARCH REQUIRED)

	/** Removes any node that isn't a part of an edge
	 * @returns {GraphClean} the number of nodes removed
	 */
	removeIsolatedNodes():GraphClean{
		// this function relies on .index values. it would be nice if it didn't
		this.nodeArrayDidChange();
		var nodeDegree = [];
		for(var i = 0; i < this.nodes.length; i++){ nodeDegree[i] = false; }
		for(var i = 0; i < this.edges.length; i++){
			nodeDegree[this.edges[i].nodes[0].index] = true;
			nodeDegree[this.edges[i].nodes[1].index] = true;
		}
		var count = 0;
		for(var i = this.nodes.length-1; i >= 0; i--){
			var index = this.nodes[i].index;
			if(nodeDegree[index] == false){ this.nodes.splice(i, 1); count++; }
		}
		if(count > 0){ this.nodeArrayDidChange(); }
		return new GraphClean().isolatedNodes(count);
	}

	/** Remove all edges that contain the same node at both ends
	 * @returns {GraphClean} the number of edges removed
	 */
	cleanCircularEdges():GraphClean{
		var edgesLength = this.edges.length;
		this.edges = this.edges.filter(function(el){ return !(el.nodes[0] === el.nodes[1]); });
		if(this.edges.length != edgesLength){ this.edgeArrayDidChange(); }
		return new GraphClean().circularEdges(edgesLength - this.edges.length);
	}

	/** Remove edges that are similar to another edge
	 * @returns {GraphClean} the number of edges removed
	 */
	cleanDuplicateEdges():GraphClean{
		var count = 0;
		for(var i = 0; i < this.edges.length-1; i++){
			for(var j = this.edges.length-1; j > i; j--){
				if(this.edges[i].isSimilarToEdge(this.edges[j])){
					this.edges.splice(j, 1);
					count += 1;
				}
			}
		}
		if(count > 0){ this.edgeArrayDidChange(); }
		return new GraphClean().duplicateEdges(count);
	}

	/** Graph specific clean function: removes circular and duplicate edges, refreshes .index. Only modifies edges array.
	 * @returns {GraphClean} the number of edges removed
	 */
	cleanGraph():GraphClean{
		this.edgeArrayDidChange();
		this.nodeArrayDidChange();
		// should we remove isolated nodes as a part of clean()?
		// return this.cleanDuplicateEdges().join(this.cleanCircularEdges()).join(this.removeIsolatedNodes());
		return this.cleanDuplicateEdges().join(this.cleanCircularEdges());
	}

	/** Clean calls cleanGraph(), gets overwritten when subclassed. Removes circular and duplicate edges, refreshes .index. Only modifies edges array.
	 * @returns {GraphClean} the number of edges removed
	 */
	clean():GraphClean{
		return this.cleanGraph();
	}

	///////////////////////////////////////////////
	// GET PARTS
	///////////////////////////////////////////////
	
	/** Searches for an edge that contains the 2 nodes supplied in the function call. Will return first edge found, if graph isn't clean it will miss any subsequent duplicate edges.
	 * @returns {GraphEdge} edge, if exists. undefined, if no edge connects the nodes (not adjacent)
	 */
	getEdgeConnectingNodes(node1:GraphNode, node2:GraphNode):GraphEdge{
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
	 */
	getEdgesConnectingNodes(node1:GraphNode, node2:GraphNode):GraphEdge[]{
		return this.edges.filter(function(el){
			return (el.nodes[0] === node1 && el.nodes[1] === node2 ) ||
			       (el.nodes[0] === node2 && el.nodes[1] === node1 );
		});
	}

	log(verbose?:boolean){
		console.log('#Nodes: ' + this.nodes.length);
		console.log('#Edges: ' + this.edges.length);
		if(verbose != undefined && verbose == true){
			for(var i = 0; i < this.edges.length; i++){
				console.log(i + ': ' + this.edges[i].nodes[0] + ' ' + this.edges[i].nodes[1]);
			}
		}
	}

	nodeArrayDidChange(){for(var i=0;i<this.nodes.length;i++){this.nodes[i].index=i;}}
	edgeArrayDidChange(){for(var i=0;i<this.edges.length;i++){this.edges[i].index=i;}}
//	nodeArrayDidChange(){this.nodes=this.nodes.map(function(el,i){el.index=i;return el;});}	
}

/** a multigraph is a graph which allows circular and duplicate edges */
class Multigraph extends Graph{
	cleanGraph():GraphClean{
		this.edgeArrayDidChange();
		this.nodeArrayDidChange();
		return new GraphClean();
	}
}
