var Graph = function() {
	this.nodes = []; // can be of any type
	this.edges = []; // must be {a:__, b:__} where __ is index in this.nodes
};

Graph.prototype.addNode = function(node) {
	this.nodes.push(node);
};
Graph.prototype.addEdge = function(edge) {
	this.edges.push(edge);
};

// removes any duplicate edges (edges containing the same nodes)
Graph.prototype.cleanup = function(){
	var i = 0;
	while(i < this.edges.length-1){
		var j = i+1;
		while(j < this.edges.length){
			// nested loop, compare every edge with every edge
			var didRemove = false;
			if ( this.edgesAreSimilar(i, j) ){
				// if edges are comprised of the same vertices (in any order)
				edges.splice(edges.begin()+j, 1);
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
Graph.prototype.clear = function(){
	this.nodes = [];
	this.edges = [];
}

// inspect the graph
//   2 nodes connected by an edge?
Graph.prototype.nodesAdjacent = function(nodeIndex1, nodeIndex2){
	for(var i = 0; i < this.edges.length; i++){
		if( (this.edges[i].a == nodeIndex1 && this.edges[i].b == nodeIndex2 ) ||
			(this.edges[i].a == nodeIndex2 && this.edges[i].b == nodeIndex1 ) ){
			return true;
		}
	}
	return false;
}

//   2 edges share a node?
Graph.prototype.edgesAdjacent = function(edgeIndex1, edgeIndex2){
	return ( (this.edges[edgeIndex1].a == this.edges[edgeIndex2].a) ||
	         (this.edges[edgeIndex1].b == this.edges[edgeIndex2].b) ||
	         (this.edges[edgeIndex1].a == this.edges[edgeIndex2].b) ||
	         (this.edges[edgeIndex1].b == this.edges[edgeIndex2].a) );
}

// replaces all mention of one vertex with the other in both vertex and edge arrays
// shrinks the total number of vertices
Graph.prototype.mergeNodes = function(vIndex1, vIndex2){
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
	nodes.erase(nodes.begin()+two);
	return true;
}

// 2 edges contain the same nodes
Graph.prototype.edgesAreSimilar = function(eIndex1, eIndex2){
	return( (this.edges[eIndex1].a == this.edges[eIndex2].a &&
	         this.edges[eIndex1].b == this.edges[eIndex2].b ) ||
	        (this.edges[eIndex1].a == this.edges[eIndex2].b &&
	         this.edges[eIndex1].b == this.edges[eIndex2].a ) );
}


Graph.prototype.log = function(){
	console.log('#Nodes: ' + this.nodes.length);
	console.log('#Edges: ' + this.edges.length);
}
Graph.prototype.logMore = function(){
	this.log();
	for(var i = 0; i < this.edges.length; i++){
		console.log(i + ': ' + this.edges[i].a + ' ' + this.edges[i].b);
	}
}