"use strict";

class Graph{

	constructor() {
		this.nodes = []; // can be of any type
		this.edges = []; // must be {a:__, b:__} where __ is index in this.nodes
	}

	addNode(node) {
		this.nodes.push(node);
	}
	addEdge(edge) {
		this.edges.push(edge);
	}

	removeEdgeBetween(nodeIndex1, nodeIndex2){
		var found = false;
		var i = 0;
		while(i < this.edges.length){
			if( (this.edges[i].a == nodeIndex1 && this.edges[i].b == nodeIndex2) || 
				(this.edges[i].a == nodeIndex2 && this.edges[i].b == nodeIndex1) ){
				this.edges.splice(i, 1);
				found = true;
			}
			i++;
		}
		return found;
	}

	// removes any duplicate edges (edges containing the same nodes)
	cleanup(){
		var i = 0;
		while(i < this.edges.length-1){
			var j = i+1;
			while(j < this.edges.length){
				// nested loop, compare every edge with every edge
				var didRemove = false;
				if ( this.edgesAreSimilar(i, j) ){
					// if edges are comprised of the same vertices (in any order)
					this.edges.splice(j, 1);
					didRemove = true;
				}
				// only iterate forward if we didn't remove an element
				//   if we did, it basically iterated forward for us, repeat the same 'j'
				// this is also possible because we know that j is always greater than i
				if(!didRemove){
					j+=1;
				}
			}
			i+=1;
		}
	}

	// removes all edges and nodes
	clear(){
		this.nodes = [];
		this.edges = [];
	}

	// inspect the graph
	//   2 nodes connected by an edge?
	areNodesAdjacent(nodeIndex1, nodeIndex2){
		for(var i = 0; i < this.edges.length; i++){
			if( (this.edges[i].a == nodeIndex1 && this.edges[i].b == nodeIndex2 ) ||
				(this.edges[i].a == nodeIndex2 && this.edges[i].b == nodeIndex1 ) ){
				return true;
			}
		}
		return false;
	}
	getEdgeIndexForAdjacentNodes(nodeIndex1, nodeIndex2){
		for(var i = 0; i < this.edges.length; i++){
			if( (this.edges[i].a == nodeIndex1 && this.edges[i].b == nodeIndex2 ) ||
				(this.edges[i].a == nodeIndex2 && this.edges[i].b == nodeIndex1 ) ){
				return i;
			}
		}
		return undefined;
	}
	getAdjacentNodes(nodeIndex){
		var adjacent = [];
		for(var i = 0; i < this.edges.length; i++){
			if(this.edges[i].a == nodeIndex) adjacent.push(this.edges[i].b);
			if(this.edges[i].b == nodeIndex) adjacent.push(this.edges[i].a);
		}
		return adjacent;
	}

	//   2 edges share a node?
	areEdgesAdjacent(edgeIndex1, edgeIndex2){
		return ( (this.edges[edgeIndex1].a == this.edges[edgeIndex2].a) ||
		         (this.edges[edgeIndex1].b == this.edges[edgeIndex2].b) ||
		         (this.edges[edgeIndex1].a == this.edges[edgeIndex2].b) ||
		         (this.edges[edgeIndex1].b == this.edges[edgeIndex2].a) );
	}
	getAdjacentEdges(edgeIndex){
		
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

	// 2 edges contain the same nodes
	edgesAreSimilar(eIndex1, eIndex2){
		return( (this.edges[eIndex1].a == this.edges[eIndex2].a &&
		         this.edges[eIndex1].b == this.edges[eIndex2].b ) ||
		        (this.edges[eIndex1].a == this.edges[eIndex2].b &&
		         this.edges[eIndex1].b == this.edges[eIndex2].a ) );
	}

	getConnectedNodes(nodeIndex){
		var connectedIndices = []; // uint
		// iterate over all edges
		for(var i = 0; i < this.edges.length; i++){
			// if we find our index, add the vertex on the other end of the edge
			if(this.edges[i].a == vIndex) {
				connectedIndices.push(this.edges[i].b);
			} if(this.edges[i].b == vIndex) {
				connectedIndices.push(this.edges[i].a);
			}
		}
		return connectedIndices;
	}

	getConnectedEdgesToNode(nodeIndex){  // uint
		var connectedIndices = []; // uint
		// iterate over all edges
		for(var i = 0; i < edges.length; i++){
			// if we find our vertex, add the edge
			if(this.edges[i].a == nodeIndex || this.edges[i].b == nodeIndex){
				connectedIndices.push(i);
			}
		}
		return connectedIndices;
	}

	// getConnectedEdgesToEdge(edgeIndex){  // uint
	// }

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
