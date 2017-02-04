"use strict";

class Graph{

	// VOCABULARY:
	//  "adjacent": nodes are adjacent when they are connected by an edge
	//              edges are adjacent when they are both connected to the same node
	//  "similar": in the case of an edge: they contain the same 2 nodes, possibly in a different order

	constructor() {
		this.nodes = []; // can be of any type
		this.edges = []; // each entry is {a:__, b:__} where __ is index in this.nodes
	}

	// removes all edges and nodes
	clear(){
		this.nodes = [];
		this.edges = [];
	}

	addNode(node) {
		this.nodes.push(node);
	}
	addEdge(edge) {
		this.edges.push(edge);
	}

	addNodes(nodes){
		if(nodes != undefined && nodes.length > 0){
			this.nodes = this.nodes.concat(nodes);
		}
	}
	addEdges(edges){
		if(edges != undefined && edges.length > 0){
			// 
		}
	}

	removeEdgeBetween(nodeIndex1, nodeIndex2){
		var found = false;
		var i = 0;
		while(i < this.edges.length){
			var didRemove = false;
			if( (this.edges[i].a == nodeIndex1 && this.edges[i].b == nodeIndex2) || 
				(this.edges[i].a == nodeIndex2 && this.edges[i].b == nodeIndex1) ){
				this.edges.splice(i, 1);
				didRemove = true;
				found = true;
			}
			if(!didRemove) i++;
		}
		return found;
	}

	removeNode(nodeIndex){
		this.nodes.splice(nodeIndex, 1);
		var i = 0;
		while(i < this.edges.length){
			var didRemove = false;
			if( this.edges[i].a == nodeIndex || this.edges[i].b == nodeIndex ){
				this.edges.splice(i, 1);
				didRemove = true;
			} else{
				if(this.edges[i].a > nodeIndex) this.edges[i].a -= 1;
				if(this.edges[i].b > nodeIndex) this.edges[i].b -= 1;
			}
			if(!didRemove) i++;
		}		
	}

	removeEdge(edgeIndex){
		this.edges.splice(edgeIndex, 1);
	}

	clean(){
		// remove circular edges (a node connecting to itself)
		for(var i = this.edges.length-1; i >= 0; i--){
			if(this.edges[i].a == this.edges[i].b)
				this.edges.splice(i,1);
		}

		// remove any duplicate edges (edges containing the same nodes)
		var i = 0;
		while(i < this.edges.length){
			var j = i+1;
			while(j < this.edges.length){
				// nested loop, uniquely compare every edge, remove if edges contain same nodes
				var didRemove = false;
				if ( this.areEdgesSimilar(i, j) ){
					console.log("clean(): found similar edges, removing last " + i + '(' + this.edges[i].a + ' ' + this.edges[i].b + ') ' + j + '(' + this.edges[j].a + ' ' + this.edges[j].b + ') ' );
					this.edges.splice(j, 1);
					didRemove = true;
				}
				// only iterate forward if we didn't remove an element
				//   if we did, it basically iterated forward for us, repeat the same 'j'
				// this is also possible because we know that j is always greater than i
				if(!didRemove) j++;
			}
			i+=1;
		}
	}

	// TRUE FALSE QUERIES
	areNodesAdjacent(nodeIndex1, nodeIndex2){
		for(var i = 0; i < this.edges.length; i++){
			if( (this.edges[i].a == nodeIndex1 && this.edges[i].b == nodeIndex2 ) ||
				(this.edges[i].a == nodeIndex2 && this.edges[i].b == nodeIndex1 ) ){
				return true;
			}
		}
		return false;
	}
	areEdgesAdjacent(edgeIndex1, edgeIndex2){
		return ( (this.edges[edgeIndex1].a == this.edges[edgeIndex2].a) ||
		         (this.edges[edgeIndex1].b == this.edges[edgeIndex2].b) ||
		         (this.edges[edgeIndex1].a == this.edges[edgeIndex2].b) ||
		         (this.edges[edgeIndex1].b == this.edges[edgeIndex2].a) );
	}
	areEdgesSimilar(eIndex1, eIndex2){
		return( (this.edges[eIndex1].a == this.edges[eIndex2].a &&
		         this.edges[eIndex1].b == this.edges[eIndex2].b ) ||
		        (this.edges[eIndex1].a == this.edges[eIndex2].b &&
		         this.edges[eIndex1].b == this.edges[eIndex2].a ) );
	}

	// GRAPH QUERIES
	getNodesAdjacentToNode(nodeIndex){
		var adjacent = [];
		for(var i = 0; i < this.edges.length; i++){
			// if we find our node, add the node on the other end of the edge
			if(this.edges[i].a == nodeIndex) adjacent.push(this.edges[i].b);
			if(this.edges[i].b == nodeIndex) adjacent.push(this.edges[i].a);
		}
		return adjacent;
	}
	getNodesAdjacentToEdge(edgeIndex){
		return [this.edges[edgeIndex].a, this.edges[edgeIndex].b];
	}
	getEdgesAdjacentToEdge(edgeIndex){
		var adjacent = [];
		for(var i = 0; i < this.edges.length; i++){
			if(edgeIndex != i){
				if(this.areEdgesAdjacent(edgeIndex, i)){
					adjacent.push(i);
				}
			}
		}
		return adjacent;
	}
	getEdgeConnectingNodes(nodeIndex1, nodeIndex2){
		// for this to work, graph must be cleaned. no duplicate edges
		for(var i = 0; i < this.edges.length; i++){
			if( (this.edges[i].a == nodeIndex1 && this.edges[i].b == nodeIndex2 ) ||
				(this.edges[i].a == nodeIndex2 && this.edges[i].b == nodeIndex1 ) ){
				return i;
			}
		}
		// if nodes are not connected
		return undefined;
	}
	getEdgesAdjacentToNode(nodeIndex){  // uint
		var connectedIndices = []; // uint
		// iterate over all edges, if we find our vertex, add the edge
		for(var i = 0; i < this.edges.length; i++){
			if(this.edges[i].a == nodeIndex || this.edges[i].b == nodeIndex)
				connectedIndices.push(i);
		}
		return connectedIndices;
	}

	getEdgesConnectedToEdge(edgeIndex){
		var connected1 = getEdgesAdjacentToNode(this.edges[edgeIndex].a);
		var connected2 = getEdgesAdjacentToNode(this.edges[edgeIndex].b);
		// remove self (edgeIndex) from answer
		var found = connected1.indexOf(edgeIndex);
		while(found != -1){
			connected1.splice(found, 1);
			found = connected1.indexOf(edgeIndex);
		}
		var found = connected2.indexOf(edgeIndex);
		while(found != -1){
			connected2.splice(found, 1);
			found = connected2.indexOf(edgeIndex);
		}
		return connected1.concat(connected2);
	}

	// replaces all mention of one vertex with the other in both vertex and edge arrays
	// shrinks the total number of vertices
	mergeNodes(nodeIndex1, nodeIndex2){
		// retains the smaller index of the two
		var one;
		var two;
		if(nodeIndex1 == nodeIndex2) {
			return false;
		}
		if(nodeIndex1 < nodeIndex2) {one = nodeIndex1; two = nodeIndex2;}
		if(nodeIndex1 > nodeIndex2) {one = nodeIndex2; two = nodeIndex1;}

		// replace all instances in EDGE array
		// and decrement all indices greater than vertexIndex2 (vertex array is about to lose vertexIndex2)
		for(var i = 0; i < this.edges.length; i++){
			if     (this.edges[i].a == two) this.edges[i].a = one;
			else if(this.edges[i].a > two)  this.edges[i].a -= 1;
			if     (this.edges[i].b == two) this.edges[i].b = one;
			else if(this.edges[i].b > two)  this.edges[i].b -= 1;
		}
		this.nodes.splice(two,1);
		return true;
	}

	log(){
		console.log('#Nodes: ' + this.nodes.length);
		console.log('#Edges: ' + this.edges.length);
	}
	logMore(){
		this.log();
		for(var i = 0; i < this.edges.length; i++){
			console.log(i + ': ' + this.edges[i].a + ' ' + this.edges[i].b);
		}
	}	
}
