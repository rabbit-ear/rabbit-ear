
// VOCABULARY:
//  "adjacent": nodes are adjacent when they are connected by an edge
//              edges are adjacent when they are both connected to the same node
//  "similar": in the case of an edge: they contain the same 2 nodes, possibly in a different order


"use strict";
var LOG = false;


class EdgeAndNode{
	edge:number;  // index
	node:number;  // index
	constructor(e:number, n:number){
		this.edge = e;
		this.node = n;
	}
}

class GraphNode{  // Nodes can represent anything
	graph:Graph;
	index:number;

	adjacentEdges:()=>GraphEdge[] = function(){
		if(this.graph == undefined) { throw "error: didn't set a node's parent graph. use graph.addNode()"; }
		var thisIndex = this.index;
		return this.graph.edges.filter(function (el:GraphEdge) { return el.node[0] == thisIndex || el.node[1] == thisIndex; });
	}
	adjacentNodes:()=>GraphNode[] = function(){
		var adjacent:GraphNode[] = [];
		for(var i = 0; i < this.graph.edges.length; i++){
			if(this.graph.edges[i].node[0] == this.index) { adjacent.push( this.graph.nodes[ this.graph.edges[i].node[1] ] ); }
			if(this.graph.edges[i].node[1] == this.index) { adjacent.push( this.graph.nodes[ this.graph.edges[i].node[0] ] ); }
		}
		return adjacent;
	}
	adjacentEdgesAndTheirNodes:()=>EdgeAndNode[] = function(){
		var adjacentEdges:EdgeAndNode[] = [];
		// iterate over all edges, if we find our node, add the edge
		for(var i = 0; i < this.graph.edges.length; i++){
			if      (this.graph.edges[i].node[0] == this.index){ adjacentEdges.push(new EdgeAndNode(i, this.graph.edges[i].node[1])); }
			else if (this.graph.edges[i].node[1] == this.index){ adjacentEdges.push(new EdgeAndNode(i, this.graph.edges[i].node[0])); }
		}
		return adjacentEdges;
	}
	adjacentNodesAndTheirEdges:()=>EdgeAndNode[] = function(){
		var adjacentNodes:EdgeAndNode[] = [];
		for(var i = 0; i < this.graph.edges.length; i++){
			// if we find our node, add the node on the other end of the edge
			if(this.graph.edges[i].node[0] == this.index){adjacentNodes.push(new EdgeAndNode(i, this.graph.edges[i].node[1]));}
			if(this.graph.edges[i].node[1] == this.index){adjacentNodes.push(new EdgeAndNode(i, this.graph.edges[i].node[0]));}
		}
		return this.graph.nodes.filter(function (el:GraphNode) {});		
	}
}

class GraphEdge{
	graph:Graph;
	index:number;

	node:[number,number]; // every edge must connect 2 nodes
	constructor(g:Graph, nodeIndex1:number, nodeIndex2:number){
		this.node = [nodeIndex1, nodeIndex2];
		this.graph = g;
	};
	adjacentEdges:()=>GraphEdge[] = function(){
		var node0 = this.node[0];
		var node1 = this.node[1];
		return this.graph.edges.filter(function(el:GraphEdge)
		{  return el.node[0] == node0 || el.node[0] == node1 || el.node[1] == node0 || el.node[1] == node1; });
		// .remove(this)
		//TODO: remove this edge from adjacent array
	}
	adjacentNodes:()=>GraphNode[] = function(){
		return [this.graph.nodes[this.node[0]], this.graph.nodes[this.node[1]]];
	}
}

class Graph{
	nodes:GraphNode[];
	edges:GraphEdge[];
	preferences:any;
	// todo: callback hooks for when certain properties of the data structure have been altered
	didChange:(event:object)=>void;

	constructor() {
		this.nodes = [];
		this.edges = [];

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

	addNode(node:GraphNode):number {
		node.graph = this;
		node.index = this.nodes.length;
		this.nodes.push(node);
		return node.index;
	}
	addEdge(nodeIndex1:number, nodeIndex2:number):number {
		if(nodeIndex1 >= this.nodes.length || nodeIndex2 >= this.nodes.length ){ throw "addEdge() node indices greater than array length"; }
		var newEdge = new GraphEdge(this, nodeIndex1, nodeIndex2);
		newEdge.index = this.edges.length;
		this.edges.push( newEdge );
		return newEdge.index;
	}
	addNodes(nodes):boolean{
		// (SIMPLE: NODE array added to only at the end)
		if(nodes != undefined && nodes.length > 0){
			this.nodes = this.nodes.concat(nodes);
			// update new nodes with their indices
			for(var i = 0; i < this.nodes.length; i++){ this.nodes[i].index = i; }
			return true;
		}
		return false;
	}
	addEdges(edges:GraphEdge[]):boolean{
		if(edges != undefined && edges.length > 0){
			for(var i = 0; i < edges.length; i++){
				this.addEdge(edges[i].node[0], edges[i].node[1] );
			}
			return true;
		}
		return false;
	}

	removeEdgesBetween(nodeIndex1:number, nodeIndex2:number){
		// (SIMPLE: NODE array length unchanged)
		// var count = 0;
		// var i = 0;
		// while(i < this.edges.length){
		// 	var didRemove = false;
		// 	if( (this.edges[i].node[0] == nodeIndex1 && this.edges[i].node[1] == nodeIndex2) || 
		// 		(this.edges[i].node[0] == nodeIndex2 && this.edges[i].node[1] == nodeIndex1) ){
		// 		this.edges.splice(i, 1);
		// 		didRemove = true;
		// 		count += 1;
		// 	}
		// 	if(!didRemove) i++;
		// }
		this.edges = this.edges.filter(function(el){ 
			return !((el.node[0] == nodeIndex1 && el.node[1] == nodeIndex2) ||
			         (el.node[0] == nodeIndex2 && el.node[1] == nodeIndex1) );
		});
		for(var i = 0; i < this.edges.length; i++){ this.edges[i].index = i; }
		// return count;
	}

	removeNode(nodeIndex:number):boolean{
		// (NOT SIMPLE: NODE array altered)
		if(nodeIndex >= this.nodes.length) { return false; }
		// step 1: remove the node (easy)
		this.nodes.splice(nodeIndex, 1);
		// step 2: traverse all edges, do (2) things:
		var i = 0;
		while(i < this.edges.length){
			var didRemove = false;
			if( this.edges[i].node[0] == nodeIndex || this.edges[i].node[1] == nodeIndex ){
				// remove edges which contained that node
				this.edges.splice(i, 1);
				didRemove = true;
			} else{
				// [0 1 2 3 4 5 6 (removed) 8 9 10 11 12]
				// because the array looks like this,
				// node indices after the removed node are off by 1
				if(this.edges[i].node[0] > nodeIndex) this.edges[i].node[0] -= 1;
				if(this.edges[i].node[1] > nodeIndex) this.edges[i].node[1] -= 1;
			}
			if(!didRemove) i++;
		}
		for(var i = 0; i < this.nodes.length; i++){ this.nodes[i].index = i; }
		for(var i = 0; i < this.edges.length; i++){ this.edges[i].index = i; }
		return true;
	}

	removeEdge(edgeIndex:number){
		this.edges.splice(edgeIndex, 1);
		for(var i = 0; i < this.edges.length; i++){ this.edges[i].index = i; }
	}

	// CLEAN GRAPH
	clean():object{
		if(LOG) { console.log('graph.js: clean()'); }
		var countCircular, countDuplicate;
		if(!this.preferences.allowCircular) { countCircular = this.cleanCircularEdges();  }
		if(!this.preferences.allowDuplicate){ countDuplicate = this.cleanDuplicateEdges();}
		if(LOG) { console.log('graph.js: finish clean()'); }
		return {'duplicate':countDuplicate, 'circular': countCircular};
	}

	// remove circular edges (a node connecting to itself)
	cleanCircularEdges():number{
		if(LOG) { console.log('graph.js: cleanCircularEdges()'); }
		var count = 0;
		for(var i = this.edges.length-1; i >= 0; i--){
			if(this.edges[i].node[0] == this.edges[i].node[1]){
				this.edges.splice(i,1);
				count += 1;
			}
		}
		for(var i = 0; i < this.edges.length; i++){ this.edges[i].index = i; }
		return count;
	}

	// remove any duplicate edges (edges containing the same 2 nodes)
	cleanDuplicateEdges():number{
		// (SIMPLE: does not modify NODE array)
		if(LOG) { console.log('graph.js: cleanDuplicateEdges()'); }
		var count = 0;
		var i = 0;
		while(i < this.edges.length){
			var j = i+1;
			while(j < this.edges.length){
				// nested loop, uniquely compare every edge, remove if edges contain same nodes
				var didRemove = false;
				if ( this.areEdgesSimilar(i, j) ){
					if(LOG) { console.log("clean(): found similar edges, removing last " + i + '(' + this.edges[i].node[0] + ' ' + this.edges[i].node[1] + ') ' + j + '(' + this.edges[j].node[0] + ' ' + this.edges[j].node[1] + ') ' ); }
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
		for(var i = 0; i < this.edges.length; i++){ this.edges[i].index = i; }
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
	getEdgeConnectingNodes(nodeIndex1:number, nodeIndex2:number):number{
		// for this to work, graph must be cleaned. no duplicate edges
		for(var i = 0; i < this.edges.length; i++){
			if( (this.edges[i].node[0] == nodeIndex1 && this.edges[i].node[1] == nodeIndex2 ) ||
				(this.edges[i].node[0] == nodeIndex2 && this.edges[i].node[1] == nodeIndex1 ) ){
				return i;
			}
		}
		// if nodes are not connected
		return undefined;
	}
	getEdgesConnectingNodes(nodeIndex1:number, nodeIndex2:number):number[]{
		var edges = [];
		for(var i = 0; i < this.edges.length; i++){
			if( (this.edges[i].node[0] == nodeIndex1 && this.edges[i].node[1] == nodeIndex2 ) ||
				(this.edges[i].node[0] == nodeIndex2 && this.edges[i].node[1] == nodeIndex1 ) ){
				edges.push(i);
			}
		}
		return edges;
	}

	// replaces all mention of one node with the other in both node and edge arrays
	// shrinks the total number of nodes
	mergeNodes(nodeIndex1:number, nodeIndex2:number):boolean{
		if(LOG) console.log('graph.js: mergeNodes(' + nodeIndex1 + ',' + nodeIndex2 + ')');
		// sort the 2 indices by whichever comes first in the node array
		var first, second;
		if(nodeIndex1 == nodeIndex2) { return false; }
		if(nodeIndex1 < nodeIndex2) { first = nodeIndex1; second = nodeIndex2; }
		if(nodeIndex1 > nodeIndex2) { first = nodeIndex2; second = nodeIndex1; }
		// replace all instances in EDGE array
		// and decrement all indices greater than nodeIndex2 (node array is about to lose nodeIndex2)
		for(var i = 0; i < this.edges.length; i++){
			if     (this.edges[i].node[0] == second) this.edges[i].node[0] = first;
			else if(this.edges[i].node[0] > second)  this.edges[i].node[0] -= 1;
			if     (this.edges[i].node[1] == second) this.edges[i].node[1] = first;
			else if(this.edges[i].node[1] > second)  this.edges[i].node[1] -= 1;
		}
		this.cleanCircularEdges();
		this.cleanDuplicateEdges();
		// this.removeNode(second);   // the above for loop does this, we can just call below:
		this.nodes.splice(second,1);
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
