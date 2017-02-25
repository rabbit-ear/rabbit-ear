"use strict";
var LOG = false;

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
		// (SIMPLE: NODE array added to only at the end)
		if(nodes != undefined && nodes.length > 0){
			this.nodes = this.nodes.concat(nodes);
			return true;
		}
		return false;
	}
	// addEdges(edges){
	// 	if(edges != undefined && edges.length > 0){
	// 		// TODO
	// 	}
	// }

	removeEdgesBetween(nodeIndex1, nodeIndex2){
		// (SIMPLE: NODE array length unchanged)
		var count = 0;
		var i = 0;
		while(i < this.edges.length){
			var didRemove = false;
			if( (this.edges[i].a == nodeIndex1 && this.edges[i].b == nodeIndex2) || 
				(this.edges[i].a == nodeIndex2 && this.edges[i].b == nodeIndex1) ){
				this.edges.splice(i, 1);
				didRemove = true;
				count += 1;
			}
			if(!didRemove) i++;
		}
		return count;
	}

	removeNode(nodeIndex){
		// (NOT SIMPLE: NODE array altered)
		if(nodeIndex >= this.nodes.length) { return false; }
		// step 1: remove the node (easy)
		this.nodes.splice(nodeIndex, 1);
		// step 2: traverse all edges, do (2) things:
		var i = 0;
		while(i < this.edges.length){
			var didRemove = false;
			if( this.edges[i].a == nodeIndex || this.edges[i].b == nodeIndex ){
				// remove edges which contained that node
				this.edges.splice(i, 1);
				didRemove = true;
			} else{
				// [0 1 2 3 4 5 6 (removed) 8 9 10 11 12]
				// because the array looks like this,
				// node indices after the removed node are off by 1
				if(this.edges[i].a > nodeIndex) this.edges[i].a -= 1;
				if(this.edges[i].b > nodeIndex) this.edges[i].b -= 1;
			}
			if(!didRemove) i++;
		}
		return true;
	}

	removeEdge(edgeIndex){
		this.edges.splice(edgeIndex, 1);
	}

	// remove circular edges (a node connecting to itself)
	cleanCircularEdges(){
		if(LOG) { console.log('graph.js: cleanCircularEdges()'); }
		var count = 0;
		for(var i = this.edges.length-1; i >= 0; i--){
			if(this.edges[i].a == this.edges[i].b){
				this.edges.splice(i,1);
				count += 1;
			}
		}
		return count;
	}

	// remove any duplicate edges (edges containing the same nodes)
	cleanDuplicateEdges(){
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
					if(LOG) { console.log("clean(): found similar edges, removing last " + i + '(' + this.edges[i].a + ' ' + this.edges[i].b + ') ' + j + '(' + this.edges[j].a + ' ' + this.edges[j].b + ') ' ); }
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
		return count;
	}

	clean(){
		if(LOG) { console.log('graph.js: clean()'); }
		var countCircular = this.cleanCircularEdges();
		var countDuplicate = this.cleanDuplicateEdges();
		if(LOG) { console.log('graph.js: finish clean()'); }
		return {'duplicate':countDuplicate, 'circular': countCircular};
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
		// iterate over all edges, if we find our node, add the edge
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

	// replaces all mention of one node with the other in both node and edge arrays
	// shrinks the total number of nodes
	mergeNodes(nodeIndex1, nodeIndex2){
		if(LOG) console.log('graph.js: mergeNodes(' + nodeIndex1 + ',' + nodeIndex2 + ')');
		// sort the 2 indices by whichever comes first in the node array
		var first, second;
		if(nodeIndex1 == nodeIndex2) { return false; }
		if(nodeIndex1 < nodeIndex2) { first = nodeIndex1; second = nodeIndex2; }
		if(nodeIndex1 > nodeIndex2) { first = nodeIndex2; second = nodeIndex1; }
		// replace all instances in EDGE array
		// and decrement all indices greater than nodeIndex2 (node array is about to lose nodeIndex2)
		for(var i = 0; i < this.edges.length; i++){
			if     (this.edges[i].a == second) this.edges[i].a = first;
			else if(this.edges[i].a > second)  this.edges[i].a -= 1;
			if     (this.edges[i].b == second) this.edges[i].b = first;
			else if(this.edges[i].b > second)  this.edges[i].b -= 1;
		}
		this.nodes.splice(second,1);
		return true;
	}

	log(detailed){
		console.log('#Nodes: ' + this.nodes.length);
		console.log('#Edges: ' + this.edges.length);
		if(detailed != undefined){
			for(var i = 0; i < this.edges.length; i++){
				console.log(i + ': ' + this.edges[i].a + ' ' + this.edges[i].b);
			}
		}
	}
}
