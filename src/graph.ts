// a mathematical graph with edges and nodes
//
// VOCABULARY:
//  "adjacent": nodes are adjacent when they are connected by an edge
//              edges are adjacent when they are both connected to the same node
//  "similar": in the case of an edge: they contain the same 2 nodes, possibly in a different order

"use strict";

class GraphNode{  // Nodes can represent anything
	graph:Graph;
	index:number;

	adjacentEdges():GraphEdge[]{
		if(this.graph == undefined) { throw "error: didn't set a node's parent graph. use graph.newNode()"; }
		return this.graph.edges.filter(function(el:GraphEdge){ return el.node[0] === this || el.node[1] === this; }, this);
	}
	adjacentNodes():GraphNode[]{
		var first:GraphNode[] = this.graph.edges
			.filter(function(el){ return el.node[0] == this}, this)
			.map(function(el){ return el.node[1] }, this);
		var second:GraphNode[] = this.graph.edges
			.filter(function(el){ return el.node[1] == this}, this)
			.map(function(el){ return el.node[0] }, this);
		return first.concat(second);
	}
}

class GraphEdge{
	graph:Graph;
	index:number;

	node:[GraphNode,GraphNode]; // every edge must connect 2 nodes
	constructor(node1:GraphNode, node2:GraphNode){
		this.node = [node1, node2];
	};
	adjacentEdges():GraphEdge[]{
		return this.graph.edges
		.filter(function(el:GraphEdge) {  return el.node[0] === this.node[0] || 
		                                         el.node[0] === this.node[1] || 
		                                         el.node[1] === this.node[0] || 
		                                         el.node[1] === this.node[1]; }, this)
		.filter(function(el:GraphEdge){ return !(el === this) }, this);
	}
	adjacentNodes():GraphNode[]{
		return [this.node[0], this.node[1]];
	}
	isAdjacentWithEdge(edge:GraphEdge):boolean{
		return ( (this.node[0] === edge.node[0]) || (this.node[1] === edge.node[1]) ||
		         (this.node[0] === edge.node[1]) || (this.node[1] === edge.node[0]) );		
	}
	nodeInCommon(otherEdge:GraphEdge):GraphNode{
		if(this === otherEdge) return undefined;
		if(this.node[0] === otherEdge.node[0]) return this.node[0];
		if(this.node[0] === otherEdge.node[1]) return this.node[0];
		if(this.node[1] === otherEdge.node[0]) return this.node[1];
		if(this.node[1] === otherEdge.node[1]) return this.node[1];
		return undefined;
	}

}

class Graph{
	nodes:GraphNode[];
	edges:GraphEdge[];
	preferences:any;
	// todo: callback hooks for when certain properties of the data structure have been altered
	didChange:(event:object)=>void;

	constructor() {
		this.clear(); // initialize empty arrays

		// when you clean a graph, it will do different things based on these preferences
		this.preferences = {
			"allowDuplicate": false,  // set to truea and is no longer classical graph
			"allowCircular": false    // classic mathematical graph does not allow circular edges
		};
	}

	// removes all edges and nodes
	clear(){
		this.nodes = [];
		this.edges = [];
	}

	newNode():GraphNode {
		return this.addNode(new GraphNode());
	}
	newEdge(node1:GraphNode, node2:GraphNode):GraphEdge {
		return this.addEdge(new GraphEdge(node1, node2));
	}

	addNode(node:GraphNode):GraphNode{
		if(node == undefined){ throw "addNode() requires an argument: 1 GraphNode"; }
		node.graph = this;
		node.index = this.nodes.length;
		this.nodes.push(node);
		return node;
	}
	addEdge(edge:GraphEdge):GraphEdge{
		// todo, make sure graph edge is valid
		// if(edge.node[0] >= this.nodes.length || edge.node[1] >= this.nodes.length ){ throw "addEdge() node indices greater than array length"; }
		edge.graph = this;
		edge.index = this.edges.length;
		this.edges.push( edge );
		return edge;
	}
	addNodes(nodes:GraphNode[]){
		if(nodes == undefined || nodes.length <= 0){ throw "addNodes() must contain array of GraphNodes"; }
		var len = this.nodes.length;
		var checkedNodes = nodes.filter(function(el){ return (el instanceof GraphNode); });
		this.nodes = this.nodes.concat(checkedNodes);
		// update new nodes with their indices, pointers
		for(var i = len; i < this.nodes.length; i++){
			this.nodes[i].graph = this;
			this.nodes[i].index = i;
		}
	}
	addEdges(edges:GraphEdge[]){
		if(edges == undefined || edges.length <= 0){ throw "addEdges() must contain array of GraphEdges"; }
		var len = this.edges.length;
		var checkedEdges = edges.filter(function(el){ return (el instanceof GraphEdge); });
		this.edges = this.edges.concat(checkedEdges);
		// update new edges with their indices, pointers
		for(var i = len; i < this.edges.length; i++){
			this.edges[i].graph = this;
			this.edges[i].index = i;
		}
		this.clean();
	}

	removeEdgesBetween(node1:GraphNode, node2:GraphNode):number{ // returns how many removed
		var len = this.edges.length;
		this.edges = this.edges.filter(function(el){ 
			return !((el.node[0] == node1 && el.node[1] == node2) ||
			         (el.node[0] == node2 && el.node[1] == node1) );
		});
		this.edgeArrayDidChange();
		return len - this.edges.length;
	}

	removeNode(node:GraphNode):boolean{
		for(var i = 0; i < this.nodes.length; i++) { this.nodes[i].index = i; }
		// (NOT SIMPLE: NODE array altered)
		if(node.index >= this.nodes.length) { return false; }
		// step 1: remove the node (easy)
		this.nodes.splice(node.index, 1);
		// step 2: traverse all edges, do (2) things:
		var i = 0;
		while(i < this.edges.length){
			var didRemove = false;
			if( this.edges[i].node[0] === node || this.edges[i].node[1] === node ){
				// remove edges which contained that node
				this.edges.splice(i, 1);
				didRemove = true;
			}
			if(!didRemove) i++;
		}
		this.nodeArrayDidChange();
		this.edgeArrayDidChange();
		return true;
	}

	removeEdge(edgeIndex:number){
		if(edgeIndex > this.edges.length){ throw "removeEdge() index is greater than length of edge array"; }
		this.edges.splice(edgeIndex, 1);
		this.edgeArrayDidChange();
	}

	nodeArrayDidChange(){ for(var i = 0; i < this.nodes.length; i++){ this.nodes[i].index = i; } }
	edgeArrayDidChange(){ for(var i = 0; i < this.edges.length; i++){ this.edges[i].index = i; } }

	// CLEAN will change the edges, but nodes will remain unaffected
	clean():object{
		var countCircular, countDuplicate;
		if(!(this.preferences.allowCircular)) { countCircular = this.cleanCircularEdges();  }
		if(!(this.preferences.allowDuplicate)){ countDuplicate = this.cleanDuplicateEdges();}
		return {'duplicate':countDuplicate, 'circular': countCircular};
	}

	// remove circular edges (a node connecting to itself)
	cleanCircularEdges():number{
		var len = this.edges.length;
		this.edges = this.edges.filter(function(el){ return !(el.node[0] == el.node[1]); });
		if(this.edges.length != len){ this.edgeArrayDidChange(); }
		return len - this.edges.length;
	}

	// remove any duplicate edges (edges containing the same 2 nodes)
	cleanDuplicateEdges():number{
		// N^2 time
		// (SIMPLE: does not modify NODE array)
		var count = 0;
		var i = 0;
		while(i < this.edges.length){
			var j = i+1;
			while(j < this.edges.length){
				// nested loop, uniquely compare every edge, remove if edges contain same nodes
				var didRemove = false;
				if ( this.areEdgesSimilar(i, j) ){
					//console.log("clean(): found similar edges, removing last " + i + '(' + this.edges[i].node[0] + ' ' + this.edges[i].node[1] + ') ' + j + '(' + this.edges[j].node[0] + ' ' + this.edges[j].node[1] + ') ' );
					this.edges.splice(j, 1);
					didRemove = true;
					count += 1;
				}
				// only iterate forward if we didn't remove an element
				//   if we did, it basically iterated forward for us, repeat the same 'j'
				// this is also possible because we know that j is always greater than i
				if(!didRemove) j++;
			}
			i+=1;
		}
		this.edgeArrayDidChange();
		return count;
	}

	// TRUE FALSE QUERIES
	areNodesAdjacent(nodeIndex1:number, nodeIndex2:number):boolean{
		if(this.getEdgeConnectingNodes == undefined){ return false; }
		return true;
	}
	areEdgesAdjacent(edgeIndex1:number, edgeIndex2:number):boolean{
		return ( (this.edges[edgeIndex1].node[0] == this.edges[edgeIndex2].node[0]) ||
		         (this.edges[edgeIndex1].node[1] == this.edges[edgeIndex2].node[1]) ||
		         (this.edges[edgeIndex1].node[0] == this.edges[edgeIndex2].node[1]) ||
		         (this.edges[edgeIndex1].node[1] == this.edges[edgeIndex2].node[0]) );
	}
	areEdgesSimilar(edgeIndex1:number, edgeIndex2:number):boolean{
		return( (this.edges[edgeIndex1].node[0] == this.edges[edgeIndex2].node[0] &&
		         this.edges[edgeIndex1].node[1] == this.edges[edgeIndex2].node[1] ) ||
		        (this.edges[edgeIndex1].node[0] == this.edges[edgeIndex2].node[1] &&
		         this.edges[edgeIndex1].node[1] == this.edges[edgeIndex2].node[0] ) );
	}

	// getEdgeConnectingNodes in 2 parts: if graph is classical (no duplicate edges)
	//  the use "Edge" singular, else use "Edges" plural getEdgesConnectingNodes
	getEdgeConnectingNodes(node1:GraphNode, node2:GraphNode):GraphEdge{
		// for this to work, graph must be cleaned. no duplicate edges
		for(var i = 0; i < this.edges.length; i++){
			if( (this.edges[i].node[0] === node1 && this.edges[i].node[1] === node2 ) ||
				(this.edges[i].node[0] === node2 && this.edges[i].node[1] === node1 ) ){
				return this.edges[i];
			}
		}
		// if nodes are not connected
		return undefined;
	}
	getEdgesConnectingNodes(node1:GraphNode, node2:GraphNode):GraphEdge[]{
		var edges = [];
		for(var i = 0; i < this.edges.length; i++){
			if( (this.edges[i].node[0] == node1 && this.edges[i].node[1] == node2 ) ||
				(this.edges[i].node[0] == node2 && this.edges[i].node[1] == node1 ) ){
				edges.push( this.edges[i] );
			}
		}
		return edges;
	}

	// replaces all mention of one node with the other in both node and edge arrays
	// shrinks the total number of nodes
	mergeNodes(node1:GraphNode, node2:GraphNode):boolean{
		// sort the 2 indices by whichever comes first in the node array
		var first, second;
		if(node1 === node2) { return false; }
		if(node1.index < node2.index) { first = node1; second = node2; }
		else                          { first = node2; second = node1; }
		// replace all instances in EDGE array
		// and decrement all indices greater than nodeIndex2 (node array is about to lose nodeIndex2)
		for(var i = 0; i < this.edges.length; i++){
			if(this.edges[i].node[0] == second) this.edges[i].node[0] = first;
			if(this.edges[i].node[1] == second) this.edges[i].node[1] = first;
		}
		this.cleanCircularEdges();
		this.cleanDuplicateEdges();
		// this.removeNode(second);   // the above for loop does this, we can just call below:
		this.nodes.splice(second,1);
		this.nodeArrayDidChange();
		this.edgeArrayDidChange();
		return true;
	}

	log(){ // (detailed)
		console.log('#Nodes: ' + this.nodes.length);
		console.log('#Edges: ' + this.edges.length);
		// if(detailed != undefined){
			// for(var i = 0; i < this.edges.length; i++){
			// 	console.log(i + ': ' + this.edges[i].node[0] + ' ' + this.edges[i].node[1]);
			// }
		// }
	}
}
