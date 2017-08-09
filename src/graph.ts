// graph.js
// a mathematical graph with edges and nodes
// mit open source license, robby kraft
//
//  "adjacent": nodes are adjacent when they are connected by an edge
//              edges are adjacent when they are both connected to the same node
//  "similar": edges are similar if they contain the same 2 nodes, even if in a different order
//  "connect": an edge connects two nodes
//  "new"/"add": functions like "newNode" vs. "addNode", easy way to remember is that the "new" function will use the javascript "new" object initializer. Objects are created in the "new" functions.

"use strict";

class GraphNode{
	graph:Graph;
	index:number;

	constructor(graph:Graph){ this.graph = graph; }

	adjacentEdges():GraphEdge[]{
		if(this.graph == undefined) { throw "error: didn't set a node's parent graph. use graph.newNode()"; }
		return this.graph.edges.filter(function(el:GraphEdge){ return el.nodes[0] === this || el.nodes[1] === this; }, this);
	}
	adjacentNodes():GraphNode[]{
		var first:GraphNode[] = this.graph.edges
			.filter(function(el){ return el.nodes[0] === this}, this)
			.map(function(el){ return el.nodes[1] }, this);
		var second:GraphNode[] = this.graph.edges
			.filter(function(el){ return el.nodes[1] === this}, this)
			.map(function(el){ return el.nodes[0] }, this);
		return first.concat(second);
	}
	isAdjacentToNode(node:GraphNode):boolean{
		if(this.graph.getEdgeConnectingNodes(this, node) == undefined) return false;
		return true;
	}
}

class GraphEdge{
	graph:Graph;
	index:number;
	nodes:[GraphNode,GraphNode]; // every edge must connect 2 nodes

	constructor(graph:Graph, node1:GraphNode, node2:GraphNode){
		this.graph = graph;
		this.nodes = [node1, node2];
	}

	adjacentEdges():GraphEdge[]{
		return this.graph.edges
		.filter(function(el:GraphEdge) {  return el !== this &&
		                (el.nodes[0] === this.nodes[0] || 
		                 el.nodes[0] === this.nodes[1] || 
		                 el.nodes[1] === this.nodes[0] || 
		                 el.nodes[1] === this.nodes[1]); }, this)
	}
	adjacentNodes():GraphNode[]{
		return [this.nodes[0], this.nodes[1]];
	}
	isAdjacentToEdge(edge:GraphEdge):boolean{
		return( (this.nodes[0] === edge.nodes[0]) || (this.nodes[1] === edge.nodes[1]) ||
		        (this.nodes[0] === edge.nodes[1]) || (this.nodes[1] === edge.nodes[0]) );
	}
	isSimilarToEdge(edge:GraphEdge):boolean{
		return( (this.nodes[0] === edge.nodes[0] && this.nodes[1] === edge.nodes[1] ) ||
		        (this.nodes[0] === edge.nodes[1] && this.nodes[1] === edge.nodes[0] ) );
	}
	commonNodeWithEdge(otherEdge:GraphEdge):GraphNode{
		// only for adjacent edges
		if(this === otherEdge) return undefined;
		if(this.nodes[0] === otherEdge.nodes[0] || this.nodes[0] === otherEdge.nodes[1]) 
			return this.nodes[0];
		if(this.nodes[1] === otherEdge.nodes[0] || this.nodes[1] === otherEdge.nodes[1])
			return this.nodes[1];
		return undefined;
	}
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

class Graph{
	nodes:GraphNode[];
	edges:GraphEdge[];
	// todo: callback hooks for when certain properties of the data structure have been altered
	didChange:(event:object)=>void;
	
	// for subclassing (ie. PlanarGraph) the node/edge types get reset to new types (PlanarNode)
	nodeType = GraphNode;
	edgeType = GraphEdge;

	constructor(){ this.clear(); }


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
		if(nodes == undefined || nodes.length <= 0){ throw "addNodes() must contain array of GraphNodes"; }
		var len = this.nodes.length;
		var checkedNodes = nodes.filter(function(el){ return (el instanceof GraphNode); });
		this.nodes = this.nodes.concat(checkedNodes);
		for(var i = len; i < this.nodes.length; i++){
			this.nodes[i].graph = this;
			this.nodes[i].index = i;
		}
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
		this.cleanGraph();
		return this.edges.length - len;
	}


	///////////////////////////////////////////////
	// REMOVE PARTS
	///////////////////////////////////////////////

	/** Removes all nodes and edges, returning the graph to it's original state */
	clear(){
		this.nodes = [];
		this.edges = [];
	}

	/** Searches and removes any edges connecting the two nodes supplied in the arguments
	 * @returns {number} number of edges removed. in the case of an unclean graph, there may be more than one
	 */
	removeEdgeBetween(node1:GraphNode, node2:GraphNode):number{
		var len = this.edges.length;
		this.edges = this.edges.filter(function(el){ 
			return !((el.nodes[0] === node1 && el.nodes[1] === node2) ||
			         (el.nodes[0] === node2 && el.nodes[1] === node1) );
		});
		this.edgeArrayDidChange();
		return len - this.edges.length;
	}

	/** Remove a node and any edges that connect to it
	 * @returns {boolean} if the node was removed
	 */
	removeNode(node:GraphNode):boolean{
		var nodesLength = this.nodes.length;
		var edgesLength = this.edges.length;
		this.nodes = this.nodes.filter(function(el){ return el !== node; });
		this.edges = this.edges.filter(function(el){ return el.nodes[0] !== node && el.nodes[1] !== node; });
		if(this.edges.length != edgesLength){ this.edgeArrayDidChange(); }
		if(this.nodes.length != nodesLength){ this.nodeArrayDidChange(); return true; }
		return false;
	}

	/** Remove an edge
	 * @returns {boolean} if the edge was removed
	 */
	removeEdge(edge:GraphEdge):boolean{
		var len = this.edges.length;
		this.edges = this.edges.filter(function(el){ return el !== edge; });
		return (len !== this.edges.length);
	}

	/** Remove the second node and replaces all mention of it with the first in every edge
	 * @returns {GraphNode} undefined if no merge, otherwise returns a pointer to the remaining node
	 */
	mergeNodes(node1:GraphNode, node2:GraphNode):GraphNode{
		if(node1 === node2) { return undefined; }
		this.edges = this.edges.map(function(el){
			if(el.nodes[0] === node2) el.nodes[0] = node1;
			if(el.nodes[1] === node2) el.nodes[1] = node1;
			return el;
		});
		this.nodes = this.nodes.filter(function(el){ return el !== node2; });
		this.cleanGraph();
		// this.edgeArrayDidChange();
		// this.nodeArrayDidChange();
		// this.cleanDuplicateEdges();
		// this.cleanCircularEdges();
		return node1;
	}

	/** Removes any node that isn't a part of an edge
	 * @returns {number} the number of nodes removed
	 */
	cleanUnusedNodes():number{
		this.nodeArrayDidChange();  // this function depends on .index values, run this to be safe
		var usedNodes = [];
		for(var i = 0; i < this.nodes.length; i++){ usedNodes[i] = false; }
		for(var i = 0; i < this.edges.length; i++){
			usedNodes[this.edges[i].nodes[0].index] = true;
			usedNodes[this.edges[i].nodes[1].index] = true;
		}
		var count = 0;
		for(var i = this.nodes.length-1; i >= 0; i--){
			var index = this.nodes[i].index;
			if(usedNodes[index] == false){ this.nodes.splice(i, 1); count++; }
		}
		if(count > 0){ this.nodeArrayDidChange(); }
		return count;
	}

	/** Remove all edges that contain the same node at both ends
	 * @returns {number} the number of edges removed
	 */
	cleanCircularEdges():number{
		var edgesLength = this.edges.length;
		this.edges = this.edges.filter(function(el){ return !(el.nodes[0] === el.nodes[1]); });
		if(this.edges.length != edgesLength){ this.edgeArrayDidChange(); }
		return edgesLength - this.edges.length;
	}

	/** Remove edges that are similar to another edge
	 * @returns {number} the number of edges removed
	 */
	cleanDuplicateEdges():number{
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
		return count;
	}

	// internally to this Graph class, we have to call this function instead of clean()
	// even though they are the same. during subclassing, clean() gets overwritten by new methods
	cleanGraph():number{
		this.edgeArrayDidChange();
		this.nodeArrayDidChange();
		return this.cleanDuplicateEdges() + this.cleanCircularEdges();
	}

	/** Only modifies edges array. Removes circular and duplicate edges, refreshes .index values of both edges and nodes arrays
	 * @returns {number} the number of edges removed
	 */
	clean():any{
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

	nodeArrayDidChange(){for(var i=0; i<this.nodes.length; i++){this.nodes[i].index=i;}}
	edgeArrayDidChange(){for(var i=0; i<this.edges.length; i++){this.edges[i].index=i;}}
	// nodeArrayDidChange(){this.nodes=this.nodes.map(function(el,i){el.index=i;return el;});}	
}

class EdgeNodeCount{
	edges:number;
	nodes:number;
	constructor(edgeCount, nodeCount){
		this.edges = edgeCount;
		this.nodes = nodeCount;
	}
}
