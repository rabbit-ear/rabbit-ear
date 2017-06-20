"use strict";
var LOG = false;

class EdgeNode{
	edge:number;  // index
	node:number;  // index
}

class GraphNode{  // "Node" is already taken by Typescript
	adjacent:{
		edges:EdgeNode[], // adjacent edges, and the nodes at their other end
		nodes:EdgeNode[]  // adjacent nodes, and the edges it takes to get to them
	}
}

class Edge{
	node:[number,number]; // every edge must connect 2 nodes
	constructor(index1:number, index2:number){
		this.node = [index1, index2];
	};
}

class Graph{

	// VOCABULARY:
	//  "adjacent": nodes are adjacent when they are connected by an edge
	//              edges are adjacent when they are both connected to the same node
	//  "similar": in the case of an edge: they contain the same 2 nodes, possibly in a different order

	nodes:any[];
	edges:Edge[];
	preferences:any;

	constructor() {
		this.nodes = []; // can be of any type (type is not dealt with in here)
		this.edges = []; // each entry is object with one property: { node:[ ___(1)___, ___(2)___ ] }
		                 //   the node array is size 2: node1Index, node2Index

		// when you clean a graph, it will do different things based on these preferences
		this.preferences = {
			"allowDuplicate": false,  // classic mathematical graph, does not allow redundant edges 
			"allowCircular": false   // classic mathematical graph, does not allow circular edges
		};
	}

	// removes all edges and nodes
	clear(){
		this.nodes = [];
		this.edges = [];
	}

	addNode(node) {
		this.nodes.push(node);
		return this.nodes.length-1;
	}
	addEdge(nodeIndex1, nodeIndex2) {
		if(nodeIndex1 >= this.nodes.length || nodeIndex2 >= this.nodes.length ){ return undefined; }
		this.edges.push( new Edge(nodeIndex1, nodeIndex2) );
		return this.edges.length-1;
	}

	addNodes(nodes){
		// (SIMPLE: NODE array added to only at the end)
		if(nodes != undefined && nodes.length > 0){
			this.nodes = this.nodes.concat(nodes);
			return true;
		}
		return false;
	}
	addEdges(edges){
		if(edges != undefined && edges.length > 0){
			for(var i = 0; i < edges.length; i++){
				this.addEdge(edges[i].nodes[0], edges[i].nodes[1] );
			}
			return true;
		}
		return false;
	}

	removeEdgesBetween(nodeIndex1, nodeIndex2){
		// (SIMPLE: NODE array length unchanged)
		var count = 0;
		var i = 0;
		while(i < this.edges.length){
			var didRemove = false;
			if( (this.edges[i].node[0] == nodeIndex1 && this.edges[i].node[1] == nodeIndex2) || 
				(this.edges[i].node[0] == nodeIndex2 && this.edges[i].node[1] == nodeIndex1) ){
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
		return true;
	}

	removeEdge(edgeIndex){
		this.edges.splice(edgeIndex, 1);
	}

	// CLEAN GRAPH
	clean(){
		if(LOG) { console.log('graph.js: clean()'); }
		var countCircular, countDuplicate;
		if(!this.preferences.allowCircular) { countCircular = this.cleanCircularEdges();  }
		if(!this.preferences.allowDuplicate){ countDuplicate = this.cleanDuplicateEdges();}
		if(LOG) { console.log('graph.js: finish clean()'); }
		return {'duplicate':countDuplicate, 'circular': countCircular};
	}

	// remove circular edges (a node connecting to itself)
	cleanCircularEdges(){
		if(LOG) { console.log('graph.js: cleanCircularEdges()'); }
		var count = 0;
		for(var i = this.edges.length-1; i >= 0; i--){
			if(this.edges[i].node[0] == this.edges[i].node[1]){
				this.edges.splice(i,1);
				count += 1;
			}
		}
		return count;
	}

	// remove any duplicate edges (edges containing the same 2 nodes)
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
		return count;
	}

	// TRUE FALSE QUERIES
	areNodesAdjacent(nodeIndex1, nodeIndex2){
		for(var i = 0; i < this.edges.length; i++){
			if( (this.edges[i].node[0] == nodeIndex1 && this.edges[i].node[1] == nodeIndex2 ) ||
				(this.edges[i].node[0] == nodeIndex2 && this.edges[i].node[1] == nodeIndex1 ) ){
				return true;
			}
		}
		return false;
	}
	areEdgesAdjacent(edgeIndex1, edgeIndex2){
		return ( (this.edges[edgeIndex1].node[0] == this.edges[edgeIndex2].node[0]) ||
		         (this.edges[edgeIndex1].node[1] == this.edges[edgeIndex2].node[1]) ||
		         (this.edges[edgeIndex1].node[0] == this.edges[edgeIndex2].node[1]) ||
		         (this.edges[edgeIndex1].node[1] == this.edges[edgeIndex2].node[0]) );
	}
	areEdgesSimilar(edgeIndex1, edgeIndex2){
		return( (this.edges[edgeIndex1].node[0] == this.edges[edgeIndex2].node[0] &&
		         this.edges[edgeIndex1].node[1] == this.edges[edgeIndex2].node[1] ) ||
		        (this.edges[edgeIndex1].node[0] == this.edges[edgeIndex2].node[1] &&
		         this.edges[edgeIndex1].node[1] == this.edges[edgeIndex2].node[0] ) );
	}

	// GRAPH QUERIES
	getNodesAdjacentToNode(nodeIndex){
		var adjacent = [];
		for(var i = 0; i < this.edges.length; i++){
			// if we find our node, add the node on the other end of the edge
			if(this.edges[i].node[0] == nodeIndex) adjacent.push(this.edges[i].node[1]);
			if(this.edges[i].node[1] == nodeIndex) adjacent.push(this.edges[i].node[0]);
		}
		return adjacent;
	}
	getNodesAdjacentToEdge(edgeIndex){
		return [this.edges[edgeIndex].node[0], this.edges[edgeIndex].node[1]];
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

	// getEdgeConnectingNodes in 2 parts: if graph is classical (no duplicate edges)
	//  the use "Edge" singular, else use "Edges" plural getEdgesConnectingNodes
	getEdgeConnectingNodes(nodeIndex1, nodeIndex2){
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
	getEdgesConnectingNodes(nodeIndex1, nodeIndex2){
		var edges = [];
		for(var i = 0; i < this.edges.length; i++){
			if( (this.edges[i].node[0] == nodeIndex1 && this.edges[i].node[1] == nodeIndex2 ) ||
				(this.edges[i].node[0] == nodeIndex2 && this.edges[i].node[1] == nodeIndex1 ) ){
				edges.push(i);
			}
		}
		return edges;
	}

	getEdgesAdjacentToNode(nodeIndex){  // uint
		var connectedIndices = []; // uint
		// iterate over all edges, if we find our node, add the edge
		for(var i = 0; i < this.edges.length; i++){
			if(this.edges[i].node[0] == nodeIndex || this.edges[i].node[1] == nodeIndex)
				connectedIndices.push(i);
		}
		return connectedIndices;
	}

	getEdgesConnectedToEdge(edgeIndex){
		var connected1 = this.getEdgesAdjacentToNode(this.edges[edgeIndex].node[0]);
		var connected2 = this.getEdgesAdjacentToNode(this.edges[edgeIndex].node[1]);
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
