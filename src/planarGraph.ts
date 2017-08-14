/// <reference path="graph.ts"/>

// planarGraph.js
// a planar graph data structure containing edges and vertices in 2D space
// mit open source license, robby kraft

// VOCABULARY
//  "unused": a node is unused if it is not connected to an edge

"use strict";

var EPSILON_LOW =  0.003;
var EPSILON =      0.00001;
var EPSILON_HIGH = 0.00000001;
var EPSILON_UI =   0.05;  // user tap, based on precision of a finger on a screen

function epsilonEqual(a:number, b:number, epsilon?:number):boolean{
	if(epsilon == undefined){ epsilon = EPSILON_HIGH; }
	return ( Math.abs(a - b) < epsilon );
}

class XYPoint{
	x:number;
	y:number;
	constructor(x:number, y:number){
		this.x = x;
		this.y = y;
	}
	// position(x:number, y:number):XYPoint{ this.x = x; this.y = y; return this; }
	// translated(dx:number, dy:number):XYPoint{ this.x += dx; this.y += dy; return this;}
	normalize():XYPoint { var m = this.mag(); return new XYPoint(this.x/m, this.y/m);}
	rotate90():XYPoint { return new XYPoint(-this.y, this.x); }
	rotate(origin:XYPoint, angle:number){
		var dx = this.x-origin.x;
		var dy = this.y-origin.y;
		var radius = Math.sqrt( Math.pow(dy, 2) + Math.pow(dx, 2) );
		var currentAngle = Math.atan2(dy, dx);
		return new XYPoint(origin.x + radius*Math.cos(currentAngle + angle),
		                   origin.y + radius*Math.sin(currentAngle + angle));
	}
	dot(point:XYPoint):number { return this.x * point.x + this.y * point.y; }
	cross(vector:XYPoint):number{ return this.x*vector.y - this.y*vector.x; }
	mag():number { return Math.sqrt(this.x * this.x + this.y * this.y); }
	equivalent(point:XYPoint, epsilon?:number):boolean{
		if(epsilon == undefined){ epsilon = EPSILON_HIGH; }
		// rect bounding box, cheaper than radius calculation
		return (epsilonEqual(this.x, point.x, epsilon) && epsilonEqual(this.y, point.y, epsilon))
	}
}

class PlanarPair{
	// node adjacent to node, with angle offset and connecting edge
	node:PlanarNode;
	edge:PlanarEdge;  // edge connecting the two nodes
	angle:number; // radians
	// parent node
	parent:PlanarNode;
	constructor(parent:PlanarNode, node:PlanarNode, edge:PlanarEdge){
		this.node = node;
		this.angle = Math.atan2(node.y-parent.y, node.x-parent.x);
		this.edge = edge;
		// optional
		this.parent = parent;
	}
}

class EdgeIntersection extends XYPoint{
	// this is a unique class- used in intersection(), crossingEdges() on PlanarEdge
	edge:PlanarEdge;
	constructor(otherEdge:PlanarEdge, intersectionX:number, intersectionY:number){
		super(intersectionX, intersectionY);
		this.edge = otherEdge;
	}
}

class InteriorAngle{
	edges:[PlanarEdge,PlanarEdge];
	node:PlanarNode;
	angle:number;
	constructor(edge1:PlanarEdge, edge2:PlanarEdge){
		this.node = <PlanarNode>edge1.commonNodeWithEdge(edge2);
		if(this.node === undefined){ return undefined; }
		this.angle = clockwiseAngleFrom(edge1.absoluteAngle(this.node), edge2.absoluteAngle(this.node));
		this.edges = [edge1, edge2];
	}
	equivalent(a:InteriorAngle):boolean{
		if( (a.edges[0].isSimilarToEdge(this.edges[0]) && a.edges[1].isSimilarToEdge(this.edges[1])) ||
			(a.edges[0].isSimilarToEdge(this.edges[1]) && a.edges[1].isSimilarToEdge(this.edges[0]))){
			return true;
		}
		return false;
	}
}

// class NearestEdgeObject {
// 	edge:PlanarEdge; 
// 	pointOnEdge:XYPoint;
// 	distance:number;
// 	constructor(edge:PlanarEdge, pointOnEdge:XYPoint, distance:number){
// 		this.edge = edge;
// 		this.pointOnEdge = pointOnEdge;
// 		this.distance = distance;
// 	}
// }
// class PlanarAngle{
// 	// the radial space between 2 edges
// 	// an angle defined by two adjacent edges
// 	node:PlanarNode;    // center node
// 	edges:[PlanarEdge,PlanarEdge];  // two adjacent edges
// 	angle:number; // radians
// 	constructor(node:PlanarNode, edge1:PlanarEdge, edge2:PlanarEdge, angle){
// 		var nodeInCommon = <PlanarNode>edge1.nodeInCommon(edge2);
// 		this.node = nodeInCommon;
// 		this.angle = 0;//Math.atan2(node.y-parent.y, node.x-parent.x);
// 		this.edges = [edge1, edge2];
// 	}
// }

class PlanarNode extends GraphNode{

	graph:PlanarGraph;
	x:number;
	y:number;

	adjacentFaces():PlanarFace[]{
		var adjacentFaces = [];
		var adj = this.planarAdjacent();
		for(var n = 0; n < adj.length; n++){
			var face = this.graph.makeFace( this.graph.findClockwiseCircut(this, adj[n].node) );
			if(face != undefined){ adjacentFaces.push(face); }
		}
		return adjacentFaces;
	}
	interiorAngles():InteriorAngle[]{
		var adj = this.planarAdjacent();
		return adj.map(function(el, i){
			var nextI = (i+1)%this.length;
			// var angleDifference = clockwiseAngleFrom(this[i].angle, this[nextI].angle);
			return new InteriorAngle(this[i].edge, this[nextI].edge);
		}, adj);
	}

	planarAdjacent():PlanarPair[]{
		return (<PlanarEdge[]>this.adjacentEdges())
			.map(function(el){ 
				if(this === el.nodes[0]) return new PlanarPair(el.nodes[0], el.nodes[1], el);
				else                     return new PlanarPair(el.nodes[1], el.nodes[0], el);
			},this)
			.sort(function(a,b){return (a.angle < b.angle)?1:(a.angle > b.angle)?-1:0});
	}

	/** Locates the most clockwise adjacent node from the node supplied in the argument. If this was a clock centered at this node, if you pass in node for the number 3, it will return you the number 4.
	 * @returns {PlanarPair} PlanarPair object containing the clockwise node and the edge connecting the two.
	 */
	adjacentNodeClockwiseFrom(node:PlanarNode):PlanarPair{
		var adjacentNodes:PlanarPair[] = this.planarAdjacent();
		for(var i = 0; i < adjacentNodes.length; i++){
			if(adjacentNodes[i].node === node){
				return adjacentNodes[ ((i+1)%adjacentNodes.length) ];
			}
		}
		return undefined;
	}

// implements XYPoint
// todo: probably need to break apart XYPoint and this. this modifies the x and y in place. XYPoint returns a new one and doesn't modify the current one in place
	position(x:number, y:number):PlanarNode{ this.x = x; this.y = y; return this; }
	translate(dx:number, dy:number):PlanarNode{ this.x += dx; this.y += dy; return this;}
	normalize():PlanarNode { var m = this.mag(); this.x /= m; this.y /= m; return this; }
	rotate90():PlanarNode { var x = this.x; this.x = -this.y; this.y = x; return this; }
	rotate(origin:XYPoint, angle:number):PlanarNode{
		var dx = this.x-origin.x;
		var dy = this.y-origin.y;
		var radius = Math.sqrt( Math.pow(dy, 2) + Math.pow(dx, 2) );
		var currentAngle = Math.atan2(dy, dx);
		this.x = origin.x + radius*Math.cos(currentAngle + angle);
		this.y = origin.y + radius*Math.sin(currentAngle + angle);
		return this;
	}
	dot(point:XYPoint):number { return this.x * point.x + this.y * point.y; }
	cross(vector:XYPoint):number{ return this.x*vector.y - this.y*vector.x; }
	mag():number { return Math.sqrt(this.x * this.x + this.y * this.y); }
	equivalent(point:XYPoint, epsilon?:number):boolean{
		if(epsilon == undefined){ epsilon = EPSILON_HIGH; }
		// rect bounding box, cheaper than radius calculation
		return (epsilonEqual(this.x, point.x, epsilon) && epsilonEqual(this.y, point.y, epsilon))
	}
}

class PlanarEdge extends GraphEdge{

	graph:PlanarGraph;
	nodes:[PlanarNode,PlanarNode];

	intersection(edge:PlanarEdge):EdgeIntersection{
		// todo: should adjacent edges return the point in common they have with each other?
		if(this.isAdjacentToEdge(edge)){ return undefined; }
		var intersect = lineSegmentIntersectionAlgorithm(this.nodes[0], this.nodes[1], edge.nodes[0], edge.nodes[1]);
		if(intersect == undefined){ return undefined; }
		if(intersect.equivalent(this.nodes[0]) || intersect.equivalent(this.nodes[1])){return undefined;}
		// console.log(this.nodes[0].x + "," + this.nodes[0].y + ":" + this.nodes[1].x + "," + this.nodes[1].y + " and " + edge.nodes[0].x + "," + edge.nodes[0].y + ":" + edge.nodes[1].x + "," + edge.nodes[1].y + "  =  " + intersect.x + "," + intersect.y);
		return new EdgeIntersection(edge, intersect.x, intersect.y);
	}

	crossingEdges():EdgeIntersection[]{
		return this.graph.edges
			.filter(function(el){ return this !== el}, this)
			.map(function(el){ return this.intersection(el) }, this)
			.filter(function(el){ return el != undefined})
			.sort(function(a,b){
				if(a.x-b.x < -EPSILON_HIGH){ return -1; }
				if(a.x-b.x > EPSILON_HIGH){ return 1; }
				if(a.y-b.y < -EPSILON_HIGH){ return -1; }
				if(a.y-b.y > EPSILON_HIGH){ return 1; }
				return 0;});
	}

	absoluteAngle(startNode:PlanarNode):number{  // startNode is one of this edge's 2 nodes
		// measure edge as if it were a ray from one node to the other
		var endNode;
		if(startNode === this.nodes[0]){ endNode = this.nodes[1]; }
		else if(startNode === this.nodes[1]){ endNode = this.nodes[0]; }
		else{ return undefined; }
		return Math.atan2(endNode.y-startNode.y, endNode.x-startNode.x);
	}

	adjacentFaces():PlanarFace[]{
		var adjacentFaces = [];
		var face1 = this.graph.makeFace( this.graph.findClockwiseCircut(this.nodes[0], this.nodes[1]) );
		if(face1 != undefined){ adjacentFaces.push(face1); }
		var face2 = this.graph.makeFace( this.graph.findClockwiseCircut(this.nodes[1], this.nodes[0]) );
		if(face2 != undefined){ adjacentFaces.push(face2); }
		return adjacentFaces;
	}

}

class PlanarFace{
	graph:PlanarGraph;
	// clockwise
	nodes:PlanarNode[];
	edges:PlanarEdge[];
	angles:number[];  // maybe someday
	constructor(graph:PlanarGraph){
		this.graph = graph;
		this.nodes = [];
		this.edges = [];
		this.angles = [];
	}
	equivalent(face:PlanarFace):boolean{
		if(face.nodes.length != this.nodes.length) return false;
		var iFace = undefined;
		for(var i = 0; i < this.nodes.length; i++){
			if(this.nodes[0] === face.nodes[i]){ iFace = i; break; }
		}
		if(iFace == undefined) return false;
		for(var i = 0; i < this.nodes.length; i++){
			var iFaceMod = (iFace + i) % this.nodes.length;
			if(this.nodes[i] !== face.nodes[iFaceMod]) return false;
		}
		return true;
	}
}

class PlanarGraph extends Graph{

	nodes:PlanarNode[];
	edges:PlanarEdge[];
	faces:PlanarFace[];

	nodeType = PlanarNode;
	edgeType = PlanarEdge;

	constructor(){ super(); this.clear(); }

	// converts node objects into array of arrays notation x is [0], and y is [1]
	nodesArray():number[][]{return this.nodes.map(function(el){return [el.x, el.y]});}


	///////////////////////////////////////////////
	// ADD PARTS
	///////////////////////////////////////////////

	/** Create a new isolated planar node at x,y
	 * @returns {PlanarNode} pointer to the node
	 */
	newPlanarNode(x:number, y:number):PlanarNode{
		return (<PlanarNode>this.newNode()).position(x, y);
	}

	/** Create two new nodes each with x,y locations and an edge between them
	 * @returns {PlanarEdge} pointer to the edge
	 */
	newPlanarEdge(x1:number, y1:number, x2:number, y2:number):PlanarEdge{
		var a = (<PlanarNode>this.newNode()).position(x1, y1);
		var b = (<PlanarNode>this.newNode()).position(x2, y2);
		return <PlanarEdge>this.newEdge(a, b);
	}

	/** Create one node with an x,y location and an edge between it and an existing node
	 * @returns {PlanarEdge} pointer to the edge
	 */
	newPlanarEdgeFromNode(node:PlanarNode, x:number, y:number):PlanarEdge{
		var newNode = (<PlanarNode>this.newNode()).position(x, y);
		return <PlanarEdge>this.newEdge(node, newNode);
	}

	/** Create one node with an x,y location and an edge between it and an existing node
	 * @returns {PlanarEdge} pointer to the edge
	 */
	newPlanarEdgeBetweenNodes(a:PlanarNode, b:PlanarNode):PlanarEdge{
		return <PlanarEdge>this.newEdge(a, b);
	}


	/** Create one node with an angle and distance away from an existing node and make an edge between them
	 * @returns {PlanarEdge} pointer to the edge
	 */
	newPlanarEdgeRadiallyFromNode(node:PlanarNode, angle:number, length:number):PlanarEdge{
		var newNode = (<PlanarNode>this.copyNode(node))
		               .translate(Math.cos(angle)*length, Math.sin(angle)*length);
		return <PlanarEdge>this.newEdge(node, newNode);
	}

	/** This will deep-copy the contents of this graph and return it as a new object
	 * @returns {PlanarGraph} 
	 */
	duplicate():PlanarGraph{
		this.nodeArrayDidChange();
		this.edgeArrayDidChange();
		var g = new PlanarGraph();
		for(var i = 0; i < this.nodes.length; i++){
			var newNode = g.addNode(new PlanarNode(g));
			(<any>Object).assign(newNode, this.nodes[i]);
			newNode.graph = g;
			newNode.index = i;
		}
		for(var i = 0; i < this.edges.length; i++){
			var a = this.edges[i].nodes[0].index;
			var b = this.edges[i].nodes[1].index;
			var newEdge = g.addEdge(new PlanarEdge(g, g.nodes[a], g.nodes[b]));
			(<any>Object).assign(newEdge, this.edges[i]);
			newEdge.graph = g;
			newEdge.nodes = [g.nodes[a], g.nodes[b]];
			newEdge.index = i;
		}
		// for(var i = 0 ; i < this.nodes.length; i++){
		// 	var newNode = <PlanarNode>(<any>Object).assign(g.newPlanarNode(this.nodes[i].x, this.nodes[i].y), this.nodes[i]);
		// 	newNode.graph = g;
		// 	// newNode.index = i;
		// }
		// for(var i = 0 ; i < this.edges.length; i++){
		// 	var a = this.edges[i].nodes[0].index;
		// 	var b = this.edges[i].nodes[1].index;
		// 	var newEdge = <PlanarEdge>(<any>Object).assign(g.newPlanarEdgeBetweenNodes(g.nodes[a], g.nodes[b]), this.edges[i]);
		// 	newEdge.graph = g;
		// 	newEdge.nodes = [g.nodes[a], g.nodes[b]];
		// 	// newEdge.index = i;
		// }
		return g;
	}

	///////////////////////////////////////////////
	// REMOVE PARTS
	///////////////////////////////////////////////

	/** Removes all nodes, edges, and faces, returning the graph to it's original state */
	clear(){
		this.nodes = [];
		this.edges = [];
		this.faces = [];
	}

	/** Removes an edge and also attempt to remove the two nodes left behind if they are otherwise unused
	 * @returns {boolean} if the edge was removed
	 */
	removeEdge(edge:GraphEdge):boolean{
		var len = this.edges.length;
		var endNodes = [edge.nodes[0], edge.nodes[1]];
		this.edges = this.edges.filter(function(el){ return el !== edge; });
		this.cleanNodeIfUseless(endNodes[0]);
		this.cleanNodeIfUseless(endNodes[1]);
		return (len !== this.edges.length);
	}

	/** Attempt to remove an edge if one is found that connects the 2 nodes supplied, and also attempt to remove the two nodes left behind if they are otherwise unused
	 * @returns {number} how many edges were removed
	 */
	removeEdgeBetween(node1:GraphNode, node2:GraphNode):number{
		var len = this.edges.length;
		this.edges = this.edges.filter(function(el){ 
			return !((el.nodes[0] === node1 && el.nodes[1] === node2) ||
			         (el.nodes[0] === node2 && el.nodes[1] === node1) );
		});
		this.edgeArrayDidChange();
		this.cleanNodeIfUseless(node1);
		this.cleanNodeIfUseless(node2);
		return len - this.edges.length;
	}

	/** Remove a node if it is either unconnected to any edges, or is in the middle of 2 collinear edges
	 * @returns {boolean} if node was removed
	 */
	cleanNodeIfUseless(node):boolean{
		var edges = node.adjacentEdges();
		switch (edges.length){
			case 0: return this.removeNode(node);
			case 2:
				// collinear check
				var angleDiff = edges[0].absoluteAngle(node) - edges[1].absoluteAngle(node);
				if(epsilonEqual(Math.abs(angleDiff), Math.PI)){
					var farNodes = [edges[0].uncommonNodeWithEdge(edges[1]), 
					                edges[1].uncommonNodeWithEdge(edges[0])]
					// super.removeEdge(edges[0]);
					edges[0].nodes = [farNodes[0], farNodes[1]];
					super.removeEdge(edges[1]);
					// this.newEdge(farNodes[0], farNodes[1]);
					return this.removeNode(node);
				}
		}
		return false;
	}

	cleanUselessNodes():number{
		var count = super.removeIsolatedNodes();
		for(var i = this.nodes.length-1; i >= 0; i--){
			if(this.cleanNodeIfUseless(this.nodes[i])){ count += 1; }
		}
		return count;
	}

	// cleanNodes():number{
	// 	var count = this.cleanUselessNodes();
	// 	this.cleanDuplicateNodes();
	// 	return count;
	// }

	searchAndMergeOneDuplicatePair(epsilon:number):PlanarNode{
		for(var i = 0; i < this.nodes.length-1; i++){
			for(var j = i+1; j < this.nodes.length; j++){
				if ( this.nodes[i].equivalent( this.nodes[j], epsilon) ){
					// todo, mergeNodes does repeated cleaning, suppress and move to end of function
					// this.nodes[i].x = (this.nodes[i].x + this.nodes[j].x)*0.5;
					// this.nodes[i].y = (this.nodes[i].y + this.nodes[j].y)*0.5;
					return <PlanarNode>this.mergeNodes(this.nodes[i], this.nodes[j]);
				}
			}
		}
		return undefined;
	}

	cleanDuplicateNodes(epsilon?:number):XYPoint[]{
		if(epsilon == undefined){ epsilon = EPSILON; }
		var node:PlanarNode;
		var locations:XYPoint[] = [];
		do{
			node = this.searchAndMergeOneDuplicatePair(epsilon);
			if(node != undefined){ locations.push(new XYPoint(node.x, node.y)); }
		} while(node != undefined)
		return locations;
	}

	/** Removes circular and duplicate edges, merges and removes duplicate nodes, and refreshes .index values
	 * @returns {object} 'edges' the number of edges removed, and 'nodes' an XYPoint location for every duplicate node merging
	 */
	clean():any{
		var duplicates = this.cleanDuplicateNodes();
		var newNodes = this.chop(); // todo: return this newNodes
		return {
			'edges':super.cleanGraph(), 
			'nodes':this.cleanUselessNodes() + duplicates.length
		};
	}

	///////////////////////////////////////////////////////////////
	// CHOP, EDGE INTERSECTION

	chopAllCrossingsWithEdge(edge:PlanarEdge):XYPoint[]{
		var intersections = edge.crossingEdges();
		if(intersections.length === 0) { return []; }
		var endNodes = edge.nodes.sort(function(a,b){
			if(a.x-b.x < -EPSILON_HIGH){ return -1; }
			if(a.x-b.x > EPSILON_HIGH){ return 1; }
			if(a.y-b.y < -EPSILON_HIGH){ return -1; }
			if(a.y-b.y > EPSILON_HIGH){ return 1; }
			return 0;});

		// iterate through intersections, rebuild edges in order
		var newLineNodes = [];
		for(var i = 0; i < intersections.length; i++){
			if(intersections[i] != undefined){
				var newNode = (<PlanarNode>this.newNode()).position(intersections[i].x, intersections[i].y);
				this.copyEdge(intersections[i].edge).nodes = [newNode, intersections[i].edge.nodes[1]];
				intersections[i].edge.nodes[1] = newNode;
				newLineNodes.push(newNode);
			}
		}
		// replace the original edge with smaller collinear pieces of itself
		this.copyEdge(edge).nodes = [endNodes[0], newLineNodes[0]];
		for(var i = 0; i < newLineNodes.length-1; i++){
			this.copyEdge(edge).nodes = [newLineNodes[i], newLineNodes[i+1]];
		}
		this.copyEdge(edge).nodes = [newLineNodes[newLineNodes.length-1], endNodes[1]];
		super.removeEdge(edge);
		super.cleanGraph();
		return intersections.map(function(el){ return new XYPoint(el.x, el.y); } );
	}

	chopOneRound():XYPoint[]{
		var crossings = [];
		for(var i = 0; i < this.edges.length; i++){
			var thisRound = this.chopAllCrossingsWithEdge(this.edges[i]);
			crossings = crossings.concat(thisRound);
			if(thisRound.length > 0){
				super.cleanGraph();
				this.cleanUselessNodes();
				this.cleanDuplicateNodes();
			}
		}
		return crossings;
	}

	chop(){
		//todo: remove protection, or bake it into the class itself
		var protection = 0;
		var allCrossings = [];
		var thisCrossings;
		do{
			thisCrossings = this.chopOneRound();
			allCrossings = allCrossings.concat(thisCrossings);
			protection += 1;
		}while(thisCrossings.length != 0 && protection < 400);
		if(protection >= 400){ console.log("breaking loop, exceeded 400"); }
		return allCrossings;
	}

	///////////////////////////////////////////////
	// GET PARTS
	///////////////////////////////////////////////

	getEdgeIntersections():XYPoint[]{
		// todo should this make new XYPoints instead of returning EdgeIntersection objects?
		var intersections = [];
		// check all edges against each other for intersections
		for(var i = 0; i < this.edges.length-1; i++){
			for(var j = i+1; j < this.edges.length; j++){
				var intersection = this.edges[i].intersection(this.edges[j]);
				// add to array if exists, and is unique
				if(intersection != undefined){
					var copy = false;
					for(var k = 0; k < intersections.length; k++){
						if(intersection.equivalent(intersections[k])){ copy = true;}
					}
					if(!copy){ intersections.push(intersection); }
				}
			}
		}
		return intersections;
	}

	getNearestNode(x:number, y:number):PlanarNode{
		// can be optimized with a k-d tree
		var node = undefined;
		var distance = Infinity;
		for(var i = 0; i < this.nodes.length; i++){
			var dist = Math.sqrt(Math.pow(this.nodes[i].x - x,2) + Math.pow(this.nodes[i].y - y,2));
			if(dist < distance){
				distance = dist;
				node = this.nodes[i];
			}
		}
		return node;
	}

	getNearestNodes(x:number, y:number, howMany:number):PlanarNode[]{
		// can be optimized with a k-d tree
		var distances = [];
		for(var i = 0; i < this.nodes.length; i++){
			var dist = Math.sqrt(Math.pow(this.nodes[i].x - x,2) + Math.pow(this.nodes[i].y - y,2));
			distances.push( {'i':i, 'd':dist} );
		}
		distances.sort(function(a,b) {return (a.d > b.d) ? 1 : ((b.d > a.d) ? -1 : 0);} ); 
		// cap howMany at the number of total nodes
		if(howMany > distances.length){ howMany = distances.length; }
		return distances.slice(0, howMany).map(function(el){ return this.nodes[el.i]; }, this);
	}

	getNearestEdge(x:number, y:number):EdgeIntersection{
		if(x == undefined || y == undefined){ return undefined; }
		var minDist, nearestEdge, minLocation = {x:undefined, y:undefined};
		for(var i = 0; i < this.edges.length; i++){
			var p = this.edges[i].nodes;
			var pT = minDistBetweenPointLine(p[0], p[1], x, y);
			if(pT != undefined){
				var thisDist = Math.sqrt(Math.pow(x-pT.x,2) + Math.pow(y-pT.y,2));
				if(minDist == undefined || thisDist < minDist){
					minDist = thisDist;
					nearestEdge = this.edges[i];
					minLocation = pT;
				}
			}
		}
		// for (x,y) that is not orthogonal to the length of the edge (past the endpoint)
		// check distance to node endpoints
		for(var i = 0; i < this.nodes.length; i++){
			var dist = Math.sqrt(Math.pow(this.nodes[i].x - x,2) + Math.pow(this.nodes[i].y - y,2));
			if(dist < minDist){
				var adjEdges = this.nodes[i].adjacentEdges();
				if(adjEdges != undefined && adjEdges.length > 0){
					minDist = dist;
					nearestEdge = adjEdges[0];
					minLocation = {x:this.nodes[i].x, y:this.nodes[i].y};
				}
			}
		}
		return new EdgeIntersection(nearestEdge, minLocation.x, minLocation.y);
	}

	getNearestEdges(x:number, y:number, howMany:number):any[]{
		if(x == undefined || y == undefined){ return undefined; }
		var minDist, nearestEdge, minLocation = {x:undefined, y:undefined};
		var edges = this.edges.map(function(el){ 
			var pT = minDistBetweenPointLine(el.nodes[0], el.nodes[1], x, y);
			if(pT === undefined) return undefined;
			var distances = [
				Math.sqrt(Math.pow(x-pT.x,2) + Math.pow(y-pT.y,2)), // perp dist
				Math.sqrt(Math.pow(el.nodes[0].x - x, 2) + Math.pow(el.nodes[0].y - y, 2)), // node 1 dist
				Math.sqrt(Math.pow(el.nodes[1].x - x, 2) + Math.pow(el.nodes[1].y - y, 2)), // node 2 dist
			].filter(function(el){return el !== undefined; })
			 .sort(function(a,b){return (a > b)?1:(a < b)?-1:0});
			if(distances.length){ return {'edge':el, 'distance':distances[0]}; }			
		});
		return edges.filter(function(el){return el != undefined; });
		// var edges2 = this.edges.map(function(el){
		// 	var dist = Math.sqrt(Math.pow(el.nodes[i].x - x,2) + Math.pow(el.nodes[i].y - y,2));
		// 	if(dist < minDist){
		// 		var adjEdges = this.nodes[i].adjacentEdges();
		// 		if(adjEdges != undefined && adjEdges.length > 0){
		// 			minDist = dist;
		// 			nearestEdge = adjEdges[0];
		// 			minLocation = {x:this.nodes[i].x, y:this.nodes[i].y};
		// 		}
		// 	}
		// });
		// for(var i = 0; i < this.nodes.length; i++){
		// 	var dist = Math.sqrt(Math.pow(this.nodes[i].x - x,2) + Math.pow(this.nodes[i].y - y,2));
		// 	if(dist < minDist){
		// 		var adjEdges = this.nodes[i].adjacentEdges();
		// 		if(adjEdges != undefined && adjEdges.length > 0){
		// 			minDist = dist;
		// 			nearestEdge = adjEdges[0];
		// 			minLocation = {x:this.nodes[i].x, y:this.nodes[i].y};
		// 		}
		// 	}
		// }
	}


	///////////////////////////////////////////////////////////////
	// CALCULATIONS

	// interiorAngle3Nodes(centerNode:PlanarNode, node1:PlanarNode, node2:PlanarNode):number{
	// 	var adjacentEdges = centerNode.planarAdjacent();
	// 	console.log(adjacentEdges);
	// 	return 0;
	// }

	///////////////////////////////////////////////////////////////
	// FACE

	generateFaces():PlanarFace[]{
		this.faces = [];
		for(var i = 0; i < this.nodes.length; i++){
			var adjacentFaces = this.nodes[i].adjacentFaces();
			for(var af = 0; af < adjacentFaces.length; af++){
				var duplicate = false;
				for(var tf = 0; tf < this.faces.length; tf++){
					if(this.faces[tf].equivalent(adjacentFaces[af])){ duplicate = true; break; }
				}
				if(!duplicate){ this.faces.push(adjacentFaces[af]); }
			}
		}
		return this.faces;
	}

	findClockwiseCircut(node1:PlanarNode, node2:PlanarNode):PlanarPair[]{
		var incidentEdge = <PlanarEdge>this.getEdgeConnectingNodes(node1, node2);
		if(incidentEdge == undefined) { return undefined; }  // nodes are not adjacent
		var pairs:PlanarPair[] = [];
		var lastNode = node1;
		var travelingNode = node2;
		var visitedList = [lastNode];
		var nextWalk = new PlanarPair(lastNode, travelingNode, incidentEdge);
		pairs.push(nextWalk);
		do{
			visitedList.push(travelingNode);
			nextWalk = travelingNode.adjacentNodeClockwiseFrom(lastNode);
			pairs.push(nextWalk);
			lastNode = travelingNode;
			travelingNode = nextWalk.node;
			if(travelingNode === node1){ return pairs; }
		} while(!arrayContainsObject(visitedList, travelingNode));
		return undefined;
	}

	makeFace(circut:PlanarPair[]):PlanarFace{
		if(circut == undefined || circut.length < 3) return undefined;
		var face = new PlanarFace(this);
		face.nodes = circut.map(function(el){return el.node;});
		// so the first node is already present, it's just in the last spot. is this okay?
		// face.nodes.unshift(circut[0].parent);
		face.edges = circut.map(function(el){return el.edge;});
		for(var i = 0; i < circut.length; i++){
			face.angles.push(clockwiseAngleFrom(circut[i].angle, circut[(i+1)%(circut.length)].angle-Math.PI));
		}
		var angleSum = face.angles.reduce(function(sum,value){ return sum + value; }, 0);
		// sum of interior angles rule, (n-2) * PI
		if(face.nodes.length > 2 && epsilonEqual(angleSum/(face.nodes.length-2), Math.PI, EPSILON)){
			return face;
		}
	}

	log(verbose?:boolean){
		console.log('#Nodes: ' + this.nodes.length);
		console.log('#Edges: ' + this.edges.length);
		if(verbose != undefined && verbose == true){
			for(var i = 0; i < this.edges.length; i++){
				console.log(i + ': ' + this.edges[i].nodes[0] + ' ' + this.edges[i].nodes[1]);
			}
		}
		for(var i = 0; i < this.nodes.length; i++){
			console.log(' ' + i + ': (' + this.nodes[i].x + ', ' + this.nodes[i].y + ')');
		}
		for(var i = 0; i < this.edges.length; i++){
			console.log(' ' + i + ': (' + this.edges[i].nodes[0].index + ' -- ' + this.edges[i].nodes[1].index + ')');
		}
	}
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//
//                            2D ALGORITHMS
//

function clockwiseAngleFrom(a:number, b:number):number{
	while(a < 0){ a += Math.PI*2; }
	while(b < 0){ b += Math.PI*2; }
	var a_b = a - b;
	if(a_b >= 0) return a_b;
	return Math.PI*2 - (b - a);
}

// if points are all collinear
// checks if point lies on line segment 'ab'
function onSegment(point:XYPoint, a:XYPoint, b:XYPoint):boolean{
	// if (point.x <= Math.max(a.x, b.x) && point.x >= Math.min(a.x, b.x) &&
	// 	point.y <= Math.max(a.y, b.y) && point.y >= Math.min(a.y, b.y)){
	// 	return true;
	// }
	// return false;
	var ab = Math.sqrt( Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2) );
	var pa = Math.sqrt( Math.pow(point.x-a.x,2) + Math.pow(point.y-a.y,2) );
	var pb = Math.sqrt( Math.pow(point.x-b.x,2) + Math.pow(point.y-b.y,2) );
	if( Math.abs(ab - (pa+pb)) < EPSILON ) return true;
	return false;
}

function rayLineSegmentIntersectionAlgorithm(rayOrigin:XYPoint, rayDirection:XYPoint, point1:XYPoint, point2:XYPoint){
	var v1 = new XYPoint(rayOrigin.x - point1.x, rayOrigin.y - point1.y);
	var vLineSeg = new XYPoint(point2.x - point1.x, point2.y - point1.y);
	var vRayPerp = new XYPoint(-rayDirection.y, rayDirection.x);
	var dot = vLineSeg.x*vRayPerp.x + vLineSeg.y*vRayPerp.y;
	if (Math.abs(dot) < EPSILON)//0.000001)
		return undefined;
	var cross = (vLineSeg.x*v1.y-vLineSeg.y*v1.x);
	var t1 = cross / dot;
	var t2 = (v1.x*vRayPerp.x + v1.y*vRayPerp.y) / dot;
	if (t1 >= 0.0 && (t2 >= 0.0 && t2 <= 1.0)){
		var x = rayOrigin.x + rayDirection.x * t1;
		var y = rayOrigin.y + rayDirection.y * t1;
		// todo: really, we need to move beyond the need for whole numbers
		x = wholeNumberify(x);
		y = wholeNumberify(y);
		return new XYPoint(x, y);
		//return t1;
	}
	return undefined;
}

function wholeNumberify(num:number):number{
	if(Math.abs(Math.round(num) - num) < EPSILON_HIGH){ num = Math.round(num); }
	return num;
}

function lineIntersectionAlgorithm(p0:XYPoint, p1:XYPoint, p2:XYPoint, p3:XYPoint):XYPoint {
	// p0-p1 is first line
	// p2-p3 is second line
	var rise1 = (p1.y-p0.y);
	var run1  = (p1.x-p0.x);
	var rise2 = (p3.y-p2.y);
	var run2  = (p3.x-p2.x);
	var denom = run1 * rise2 - run2 * rise1;
	// var denom = l1.u.x * l2.u.y - l1.u.y * l2.u.x;
	if(denom == 0) return undefined;
	// return XYPoint((l1.d * l2.u.y - l2.d * l1.u.y) / denom, (l2.d * l1.u.x - l1.d * l2.u.x) / denom);
	var s02 = {'x':p0.x - p2.x, 'y':p0.y - p2.y};
	var t = (run2 * s02.y - rise2 * s02.x) / denom;
	return new XYPoint(p0.x + (t * run1), p0.y + (t * rise1) );
}

function allEqual(args:boolean[]):boolean {
	for(var i = 1; i < args.length; i++){
		if(args[i] != args[0]) return false;
	}
	return true;
}

function lineSegmentIntersectionAlgorithm(p:XYPoint, p2:XYPoint, q:XYPoint, q2:XYPoint):XYPoint {
	var r = new XYPoint(p2.x - p.x, p2.y - p.y);
	var s = new XYPoint(q2.x - q.x, q2.y - q.y);
	var uNumerator = (new XYPoint(q.x - p.x, q.y - p.y)).cross(r);//crossProduct(subtractPoints(q, p), r);
	var denominator = r.cross(s);

	if (Math.abs(uNumerator) < EPSILON_HIGH && Math.abs(denominator) < EPSILON_HIGH) {
		// collinear
		// Do they overlap? (Are all the point differences in either direction the same sign)
		if(!allEqual([(q.x - p.x) < 0, (q.x - p2.x) < 0, (q2.x - p.x) < 0, (q2.x - p2.x) < 0]) ||
		   !allEqual([(q.y - p.y) < 0, (q.y - p2.y) < 0, (q2.y - p.y) < 0, (q2.y - p2.y) < 0])){
			return undefined;
		}		
		// Do they touch? (Are any of the points equal?)
		if(p.equivalent(q)){ return new XYPoint(p.x, p.y); }
		if(p.equivalent(q2)){ return new XYPoint(p.x, p.y); }
		if(p2.equivalent(q)){ return new XYPoint(p2.x, p2.y); }
		if(p2.equivalent(q2)){ return new XYPoint(p2.x, p2.y); }
	}

	if (Math.abs(denominator) < EPSILON_HIGH) {
		// parallel
		return undefined;
	}

	var u = uNumerator / denominator;
	var t = (new XYPoint(q.x - p.x, q.y - p.y)).cross(s) / denominator;

	if((t >= 0) && (t <= 1) && (u >= 0) && (u <= 1)){
		return new XYPoint(p.x + r.x*t, p.y + r.y*t);
	}
}

function circleLineIntersectionAlgorithm(center:XYPoint, radius:number, p0:XYPoint, p1:XYPoint):XYPoint[]{
	var r_squared =  Math.pow(radius,2);

	var x1 = p0.x - center.x;
	var y1 = p0.y - center.y;
	var x2 = p1.x - center.x;
	var y2 = p1.y - center.y;
	var dx = x2 - x1;
	var dy = y2 - y1;
	var dr_squared = dx*dx + dy*dy;
	var D = x1*y2 - x2*y1;

	function sgn(x){ if(x < 0){return -1;} return 1; }

	var x1 = (D*dy + sgn(dy)*dx*Math.sqrt(r_squared*dr_squared - (D*D)))/(dr_squared);
	var x2 = (D*dy - sgn(dy)*dx*Math.sqrt(r_squared*dr_squared - (D*D)))/(dr_squared);
	var y1 = (-D*dx + Math.abs(dy)*Math.sqrt(r_squared*dr_squared - (D*D)))/(dr_squared);
	var y2 = (-D*dx - Math.abs(dy)*Math.sqrt(r_squared*dr_squared - (D*D)))/(dr_squared);

	var intersections = [];
	if(!isNaN(x1)){ intersections.push( new XYPoint(x1 + center.x, y1 + center.y) ); }
	if(!isNaN(x2)){ intersections.push( new XYPoint(x2 + center.x, y2 + center.y) ); }
	return intersections;
}

function linesParallel(p0:XYPoint, p1:XYPoint, p2:XYPoint, p3:XYPoint):boolean {
	// p0-p1 is first line
	// p2-p3 is second line
	var u = new XYPoint(p1.x - p0.x, p1.y - p0.y);
	var v = new XYPoint(p3.x - p2.x, p3.y - p2.y);
	return (Math.abs( u.dot( v.rotate90() ) ) < EPSILON);
}


function minDistBetweenPointLine(a:XYPoint, b:XYPoint, x:number, y:number):XYPoint{
	// (a)-(b) define the line
	// x,y is the point
	var p = Math.sqrt(Math.pow(b.x-a.x,2) + Math.pow(b.y-a.y,2));
	var u = ((x-a.x)*(b.x-a.x) + (y-a.y)*(b.y-a.y)) / (Math.pow(p,2));
	if(u < 0 || u > 1.0) return undefined;
	return new XYPoint(a.x + u*(b.x-a.x), a.y + u*(b.y-a.y));
}

//////////////////////////////////////////////////
// RECYCLE BIN - READY TO DELETE
//////////////////////////////////////////////////

function arrayContainsDuplicates(array):boolean{
	if(array.length <= 1) return false;
	for(var i = 0; i < array.length-1; i++) {
		for(var j = i+1; j < array.length; j++){
			if(array[i] === array[j]){
				return true;
			}
		}
	}
	return false;
}

function arrayContainsObject(array, object):boolean{
	for(var i = 0; i < array.length; i++) { if(array[i] === object){ return true; } }
	return false;
}

function getNodeIndexNear(x:number, y:number, thisEpsilon:number){
	var thisPoint = new XYPoint(x, y);
	for(var i = 0; i < this.nodes.length; i++){
		if(this.nodes[i].equivalent(thisPoint, thisEpsilon)){
			return i;
		}
	}
	return undefined;
}
