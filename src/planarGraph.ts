/// <reference path="graph.ts"/>

"use strict";

// for purposes of modeling origami crease patterns
//
// this is a planar graph data structure containing edges and vertices
// vertices are points in 3D space {x,y,z}  (z is 0 for now)

var EPSILON = 0.003;
var EPSILON_HIGH = 0.00001;
var USER_TAP_EPSILON = 0.01;
var SLOPE_ANGLE_PLACES = 2.5;
var SLOPE_ANGLE_EPSILON = 1 * Math.pow(10,-SLOPE_ANGLE_PLACES);
var SLOPE_ANGLE_INF_EPSILON = 1 * Math.pow(10,SLOPE_ANGLE_PLACES);

// this graph represents an origami crease pattern
//    with creases (edges) defined by their endpoints (vertices)

function epsilonEqual(a:number, b:number, epsilon?:number):boolean{
	if(epsilon == undefined){ epsilon = EPSILON_HIGH; }
	return (a - epsilon < b && a + epsilon > b);
}

class XYPoint{
	x:number;
	y:number;
	constructor(xx:number, yy:number){
		this.x = xx;
		this.y = yy;
	}
	Dot(point:XYPoint):number { return this.x * point.x + this.y * point.y; }
	Cross(vector:XYPoint):number{ return this.x*vector.y - this.y*vector.x; }
	Mag():number { return Math.sqrt(this.x * this.x + this.y * this.y); }
	Rotate90():XYPoint { return new XYPoint(-this.y, this.x); }
	Normalize():XYPoint { var m = this.Mag(); return new XYPoint(this.x / m, this.y / m); }
}

class Intersection extends XYPoint{
	// intersection of 2 edges - contains 1 intersection point, 2 edges, 4 nodes (2 edge 2 endpoints)
	exists:boolean;  // t/f intersection exists
	edges:[PlanarEdge, PlanarEdge];
	nodes:[PlanarNode, PlanarNode, PlanarNode, PlanarNode];
	constructor(a:PlanarEdge, b:PlanarEdge){
		super(undefined, undefined);  // to be set later, if intersection exists
		this.exists = false;
		if(a.isAdjacentToEdge(b)){ return this; }
		var aPts:PlanarNode[] = a.endPoints();
		var bPts:PlanarNode[] = b.endPoints();
		var intersect = lineSegmentIntersectionAlgorithm(aPts[0], aPts[1], bPts[0], bPts[1]);
		if(intersect == undefined){ return this; }
		this.x = intersect.x;
		this.y = intersect.y;
		this.edges = [a,b];
		this.nodes = [aPts[0], aPts[1], bPts[0], bPts[1]];
		this.exists = true;
	}
}

class PlanarPair{
	// node adjacent to node, with angle offset and connecting edge
	node:PlanarNode;
	edge:PlanarEdge;  // edge connecting the two nodes
	angle:number; // radians
	constructor(parent:PlanarNode, node:PlanarNode, edge:PlanarEdge){
		this.node = node;
		this.angle = Math.atan2(node.y-parent.y, node.x-parent.x);
		this.edge = edge;
	}
}

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

class PlanarNode extends GraphNode implements XYPoint{

	graph:PlanarGraph;

	x:number;
	y:number;

// implements XYPoint
	Dot(point:XYPoint):number { return this.x * point.x + this.y * point.y; }
	Cross(vector:XYPoint):number{ return this.x*vector.y - this.y*vector.x; }
	Rotate90() { return new XYPoint(-this.y, this.x); }
	Mag():number { return Math.sqrt(this.x * this.x + this.y * this.y); }
	Normalize():XYPoint { var m = this.Mag(); return new XYPoint(this.x / m, this.y / m); }

	constructor(xx:number, yy:number){
		super();
		this.x = xx;
		this.y = yy;
		if(xx == undefined){ this.x = 0; }
		if(yy == undefined){ this.y = 0; }
	}

	adjacentNodes():PlanarNode[]{
		return <PlanarNode[]>super.adjacentNodes();
	}
	adjacentEdges():PlanarEdge[]{
		return <PlanarEdge[]>super.adjacentEdges();
	}
	adjacentFaces():PlanarFace[]{
		var adjacentFaces = [];
		var homeAdjacencyArray = this.planarAdjacent();
		for(var n = 0; n < homeAdjacencyArray.length; n++){
			var thisFace = new PlanarFace();
			var invalidFace = false;
			var angleSum = 0;
			thisFace.nodes = [ this ];
			var a2b:PlanarPair;
			var a:PlanarNode;
			var b:PlanarNode = this;
			var b2c:PlanarPair = homeAdjacencyArray[n];
			var c:PlanarNode = b2c.node;
			do{
				if(c === a){ invalidFace = true; break; } // this shouldn't be needed if graph is clean
				thisFace.nodes.push(c);
				thisFace.edges.push(b2c.edge);
				// increment, step forward
				a = b;   b = c;   a2b = b2c;
				b2c = b.adjacentNodeClockwiseFrom(a);
				c = b2c.node;
				angleSum += clockwiseAngleFrom(a2b.angle, b2c.angle - Math.PI);
			}while(c !== this);
			// close off triangle
			thisFace.edges.push(b2c.edge);
			// find interior angle from left off to the original point
			var c2a = this.adjacentNodeClockwiseFrom(b);
			angleSum += clockwiseAngleFrom(b2c.angle, c2a.angle - Math.PI);
			// add face if valid
			if(!invalidFace && thisFace.nodes.length > 2){
				// sum of interior angles rule, (n-2) * PI
				var polygonAngle = angleSum / (thisFace.nodes.length-2);
				if(polygonAngle - EPSILON <= Math.PI && polygonAngle + EPSILON >= Math.PI){
					adjacentFaces.push(thisFace);
				}
			}
		}
		return adjacentFaces;
	}

	//      D  G
	//      | /
	//      |/
	//     this---Q
	//     / \
	//    /   \
	//   P     S
	//  clockwise neighbor around:(this), from node:(Q) will give you (S)
	adjacentNodeClockwiseFrom(node:PlanarNode):PlanarPair{
		var adjacentNodes:PlanarPair[] = this.planarAdjacent();
		for(var i = 0; i < adjacentNodes.length; i++){
			if(adjacentNodes[i].node === node){
				var index = ((i+1)%adjacentNodes.length);
				return adjacentNodes[index];
			}
		}
		// return undefined;
		throw "adjacentNodeClockwiseFrom() fromNode was not found adjacent to the specified node";
	}

	// a sorted (clockwise) adjacency list of nodes and their connecting edges to this node
	planarAdjacent():PlanarPair[]{
		return (<PlanarEdge[]>super.adjacentEdges())
			.map(function(el){ 
				var nodes = el.endPoints();
				if(this === nodes[0])
					return new PlanarPair(nodes[0], nodes[1], el);
				else 
					return new PlanarPair(nodes[1], nodes[0], el);
			},this)
			.sort(function(a,b){ return (a.angle < b.angle) ? 1 : (a.angle > b.angle) ? -1 : 0 });
			// .sort(function(a,b){return (a.angle > b.angle)?1:((b.angle > a.angle)?-1:0);});
	}
	translate(dx:number, dy:number){
		this.x += dx;
		this.y += dy;
	}
	rotateAroundNode(node:PlanarNode, angle:number){  // in radians
		var dx = this.x-node.x;
		var dy = this.y-node.y;
		var distance = Math.sqrt( Math.pow(dy, 2) + Math.pow(dx, 2) );
		var currentAngle = Math.atan2(dy, dx);
		this.x = node.x + distance*Math.cos(currentAngle + angle);
		this.y = node.y + distance*Math.sin(currentAngle + angle);
	}
}

class PlanarEdge extends GraphEdge{

	graph:PlanarGraph;

	node:[PlanarNode,PlanarNode];

	// convenience renaming
	// endPoints:()=>PlanarNode[] = function() { return this.adjacentNodes(); };
	// actually asking for more typecasting than i expected
	endPoints():PlanarNode[]{
		// var planarNodes:PlanarNode[] = <PlanarNode[]>this.graph.nodes;
		// return [planarNodes[0], planarNodes[1]];
		return [<PlanarNode>this.node[0], <PlanarNode>this.node[1]];
	}
	adjacentNodes():PlanarNode[]{
		return <PlanarNode[]>super.adjacentNodes();
	}
	adjacentEdges():PlanarEdge[]{
		return <PlanarEdge[]>super.adjacentEdges();
	}

	crossingEdges():Intersection[]{
		return this.graph.edges
			.filter(function(el){ return this !== el}, this)
			.map(function(el){ return new Intersection(this, el) }, this)
			.filter(function(el){ return el.exists; })
			.sort(function(a,b){if(a.x<b.x){return -1;}if(a.x>b.x){return 1;}return 0;})
			.sort(function(a,b){if(a.y<b.y){return -1;}if(a.y>b.y){return 1;}return 0;});
	}
	// adjacentFaces():PlanarFace[]{
	// 	var adjacentFaces = [];
	// 	var endpoints = this.endPoints();
	// 	var startA:PlanarNode = endpoints[0];
	// 	var startB:PlanarNode = endpoints[1];

	// 	var thing = startA.getClockwiseAdjacent(startB);
	// 	var homeAdjacencyArray = this.planarAdjacent();

	// 		var thisFace = new PlanarFace();
	// 		var invalidFace = false;
	// 		var angleSum = 0;
	// 		thisFace.nodes = [ this ];
	// 		thisFace.edges = [];
	// 		var a2b:PlanarPair;
	// 		var a:PlanarNode;
	// 		var b:PlanarNode = this;
	// 		var b2c:PlanarPair = homeAdjacencyArray[n];
	// 		var c:PlanarNode = b2c.node;
	// 		do{
	// 			if(c === a){ invalidFace = true; break; } // this shouldn't be needed if graph is clean
	// 			thisFace.nodes.push(c);
	// 			thisFace.edges.push(b2c.edge);
	// 			// increment, step forward
	// 			a = b;
	// 			b = c;
	// 			a2b = b2c;
	// 			b2c = b.getClockwiseAdjacent(a);
	// 			c = b2c.node;
	// 			angleSum += clockwiseAngleFrom(a2b.angle, b2c.angle - Math.PI);
	// 		}while(c !== this);
	// 		// close off triangle
	// 		thisFace.edges.push(b2c.edge);
	// 		// find interior angle from left off to the original point
	// 		var c2a = this.getClockwiseAdjacent(b);
	// 		angleSum += clockwiseAngleFrom(b2c.angle, c2a.angle - Math.PI);
	// 		// add face if valid
	// 		if(!invalidFace && thisFace.nodes.length > 2){
	// 			// sum of interior angles rule, (n-2) * PI
	// 			var polygonAngle = angleSum / (thisFace.nodes.length-2);
	// 			if(polygonAngle - EPSILON <= Math.PI && polygonAngle + EPSILON >= Math.PI){
	// 				adjacentFaces.push(thisFace);
	// 			}
	// 		}

	// 	return adjacentFaces;
	// }
}

class PlanarFace{
	// clockwise
	nodes:PlanarNode[];
	edges:PlanarEdge[];
	// angles:number[];  // optional, maybe delete someday
	constructor(){
		this.nodes = [];
		this.edges = [];
		// this.angles = [];
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

// creases are lines (edges) with endpoints v1, v2 (indices in vertex array)
class PlanarGraph extends Graph{

	// don't modify these arrays directly, use the new_() add_() functions to properly establish pointers
	nodes:PlanarNode[];
	edges:PlanarEdge[];
	faces:PlanarFace[];

	constructor(){
		super();
		this.clear(); // initalize all empty arrays
	}

	clear(){
		super.clear(); // clears out nodes[] and edges[]
		this.faces = [];
	}

	// converts node positions from object notation .x .y into array notation [0] [1]
	nodesArray():number[][]{
		return this.nodes.map(function(el){return [el.x, el.y]});
	}

	addNode(node:PlanarNode):PlanarNode{
		if(node == undefined){ throw "addNode() requires an argument: 1 GraphNode"; }
		node.graph = this;
		node.index = this.nodes.length;
		this.nodes.push(node);
		return node;
	}
	addEdge(edge:PlanarEdge):PlanarEdge{
		// todo, make sure graph edge is valid
		// if(edge.node[0] >= this.nodes.length || edge.node[1] >= this.nodes.length ){ throw "addEdge() node indices greater than array length"; }
		edge.graph = this;
		edge.index = this.edges.length;
		this.edges.push( edge );
		return edge;
	}


	newEdge(node1:PlanarNode, node2:PlanarNode):PlanarEdge {
		return this.addEdge(new PlanarEdge(node1, node2));
	}

	//////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////
	//
	//  1.
	//  ADD PARTS

	addEdgeWithVertices(x1:number, y1:number, x2:number, y2:number):PlanarEdge{  // floats
		var a = this.addNode( new PlanarNode(x1, y1) );
		var b = this.addNode( new PlanarNode(x2, y2) );
		return this.newEdge(a, b);
		// this.changedNodes( [this.nodes.length-2, this.nodes.length-1] );
	}

	addEdgeFromVertex(existingNode:PlanarNode, newX:number, newY:number):PlanarEdge{ // uint, floats
		var node = this.addNode( new PlanarNode(newX, newY) );
		return this.newEdge(existingNode, node);
		// this.changedNodes( [existingIndex, this.nodes.length-1] );
	}

	addEdgeFromExistingVertices(existingNode1:PlanarNode, existingNode2:PlanarNode):PlanarEdge{ // uint, uint
		return this.newEdge(existingNode1, existingNode2);
		// this.changedNodes( [existingIndex1, existingIndex2] );
	}

	addEdgeRadiallyFromVertex(existingNode:PlanarNode, angle:number, distance:number):PlanarEdge{ // uint, floats
		var newX = existingNode.x + Math.cos(angle) * distance;
		var newY = existingNode.y + Math.sin(angle) * distance;
		return this.addEdgeFromVertex(existingNode, newX, newY);
		// this.changedNodes( [existingIndex, this.nodes.length-1] );
	}

	addFaceBetweenNodes(nodeArray:PlanarNode[]){
		if(nodeArray.length == 0) return;
		var edgeArray:PlanarEdge[] = [];
		for(var i = 0; i < nodeArray.length; i++){
			var nextI = (i + 1) % nodeArray.length;
			var thisEdge = <PlanarEdge>this.getEdgeConnectingNodes(nodeArray[i], nodeArray[nextI]);
			if(thisEdge == undefined){
				console.log("creating edge to make face between nodes " + nodeArray[i] + ' ' + nodeArray[nextI]);
				thisEdge = this.addEdgeFromExistingVertices(nodeArray[i], nodeArray[nextI]);
			}
			edgeArray.push(thisEdge);
		}
		var face = new PlanarFace();
		face.edges = edgeArray;
		face.nodes = nodeArray
		this.faces.push(face);
	}

	//////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////
	//
	//  2.
	//  CLEAN  /  REFRESH COMPONENTS

	// rect bounding box, cheaper than radius calculation
	verticesEquivalent(v1:XYPoint, v2:XYPoint, epsilon:number):boolean{
		return (v1.x - epsilon < v2.x && v1.x + epsilon > v2.x &&
				v1.y - epsilon < v2.y && v1.y + epsilon > v2.y);
	}

	clean():object{
		// console.log("PLANAR GRAPH clean()");
		var graphResult = super.clean(); //{'duplicate':countDuplicate, 'circular': countCircular};
		// console.log("merging duplicate vertices");
		var result = this.mergeDuplicateVertices();
		(<any>Object).assign(graphResult, result);
		return graphResult;
	}

	//////////////////////////////////////
	//   Graph-related (non-positional)

	//      D  G
	//      | /
	//      |/
	//      A----Q
	//     / \
	//    /   \
	//   P     S
	//  clockwise neighbor around:(A), fromNode:(Q) will give you (S)
	getClockwiseNeighborAround(centerNode:PlanarNode, fromNode:PlanarNode):PlanarNode{
		var adjacentNodes:PlanarPair[] = centerNode.planarAdjacent();
		for(var i = 0; i < adjacentNodes.length; i++){
			if(adjacentNodes[i].node === fromNode){
				var index = ((i+1)%adjacentNodes.length);
				return adjacentNodes[index].node;
			}
		}
		throw "getClockwiseNeighborAround() fromNode was not found adjacent to the specified node";
	}

	getNextElementToItemInArray(array:any[], item:any):any{
		for(var i = 0; i < array.length; i++){
			if(array[i] == item){
				var index = i+1;
				if(index >= array.length) index -= array.length;
				return array[index];
			}
		}
		return undefined;
	}

	////////////////////////////////////
	//   Planar-related (positional)

	searchAndMergeOneDuplicatePair(epsilon:number):boolean{
		for(var i = 0; i < this.nodes.length-1; i++){
			for(var j = i+1; j < this.nodes.length; j++){
				if ( this.verticesEquivalent(this.nodes[i], this.nodes[j], epsilon) ){
					super.mergeNodes(this.nodes[i], this.nodes[j]);
					return true;
				}
			}
		}
		return false;
	}

	mergeDuplicateVertices(epsilon?:number){
		if(epsilon == undefined){ epsilon = EPSILON; }
		while(this.searchAndMergeOneDuplicatePair(epsilon)){};
		// var removeCatalog:XYPoint[] = [];
		// removeCatalog.push( new XYPoint(this.nodes[i].x, this.nodes[i].y) );
		// return removeCatalog;
	}

	mergeCollinearLines(epsilon?:number){
		//gather all lines collinear to this one line
		// gather all the collinear points, remove all edges between all of them
		// but leave the nodes
		// sort the nodes by this:
		
		// nodeArray
		// 	.sort(function(a,b){if(a.x<b.x){return -1;}if(a.x>b.x){return 1;}return 0;})
		// 	.sort(function(a,b){if(a.y<b.y){return -1;}if(a.y>b.y){return 1;}return 0;});
		
		// add edges back onto the line

	}

	clearUnusedCollinearNodes(){
		// remove all nodes separating two collinear lines
	}

	getNearestNode(x:number, y:number):number{  // returns index of node
		// can be optimized with a k-d tree
		var index = undefined;
		var distance = Math.sqrt(2);
		for(var i = 0; i < this.nodes.length; i++){
			var dist = Math.sqrt(Math.pow(this.nodes[i].x - x,2) + Math.pow(this.nodes[i].y - y,2));
			if(dist < distance){
				distance = dist;
				index = i;
			}
		}
		return index;
	}

	getNearestNodes(x:number, y:number, howMany:number):number[]{  // returns array of indices to nodes
		// can be optimized with a k-d tree
		var distances = [];
		for(var i = 0; i < this.nodes.length; i++){
			var dist = Math.sqrt(Math.pow(this.nodes[i].x - x,2) + Math.pow(this.nodes[i].y - y,2));
			distances.push( {'i':i, 'd':dist} );
		}
		distances.sort(function(a,b) {return (a.d > b.d) ? 1 : ((b.d > a.d) ? -1 : 0);} ); 
		if(howMany > distances.length)
			howMany = distances.length;
		var indices = [];
		for(var i = 0; i < howMany; i++){
			indices.push(distances[i]['i']);
		}
		return indices;
	}


	getNearestEdge(x:number, y:number){
		if(x == undefined || y == undefined)
			return undefined;

		var minDist = undefined;
		var minDistIndex = undefined;
		var minLocation = undefined;
		for(var i = 0; i < this.edges.length; i++){
			var p = this.edges[i].endPoints();
			var pT = minDistBetweenPointLine(p[0], p[1], x, y);
			if(pT != undefined){
				var thisDist = Math.sqrt(Math.pow(x-pT.x,2) + Math.pow(y-pT.y,2));
				if(minDist == undefined || thisDist < minDist){
					minDist = thisDist;
					minDistIndex = i;
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
					minDistIndex = adjEdges[0].index;
					minLocation = {x:this.nodes[i].x, y:this.nodes[i].y};
				}
			}
		}
		return {'edge':minDistIndex, 'location':minLocation, 'distance':minDist};
	}

	///////////////////////////////////////////////////////////////
	// CALCULATIONS

	interiorAngle3Nodes(centerNode:PlanarNode, node1:PlanarNode, node2:PlanarNode):number{
		var adjacentEdges = centerNode.planarAdjacent();

		console.log(adjacentEdges);


		return 0;

	}


	///////////////////////////////////////////////////////////////
	// EDGE INTERSECTION

	edgesIntersectUsingVertices(a1:XYPoint, a2:XYPoint, b1:XYPoint, b2:XYPoint):XYPoint{
		// test line a1-a2 intersect with line b1-b2
		// if true - returns {x,y} location of intersection
		if(this.verticesEquivalent(a1, b1, EPSILON) ||
		   this.verticesEquivalent(a1, b2, EPSILON) ||
		   this.verticesEquivalent(a2, b1, EPSILON) ||
		   this.verticesEquivalent(a2, b2, EPSILON) ){
		   	return undefined;
		}
		return lineSegmentIntersectionAlgorithm(a1, a2, b1, b2);
	}

	getEdgeIntersectionsWithEdge(edgeIndex):Intersection[]{
		if(edgeIndex >= this.edges.length){ throw "getEdgeIntersectionsWithEdge() edge index larger than edge array"; }
		var intersections:Intersection[] = [];
		for(var i = 0; i < this.edges.length; i++){
			if(edgeIndex != i){
				var intersection = new Intersection(this.edges[edgeIndex], this.edges[i]);
				if(intersection.exists){ intersections.push(intersection); }
			}
		}
		return intersections;
	}

	getAllEdgeIntersections():Intersection[]{
		var intersections:Intersection[] = [];
		for(var i = 0; i < this.edges.length-1; i++){
			for(var j = i+1; j < this.edges.length; j++){
				var intersection = new Intersection(this.edges[i], this.edges[j]);
				if(intersection.exists){ intersections.push(intersection); }
			}
		}
		return intersections;
	}

	// returns the first intersection it finds, otherwise returns undefined
	anyEdgeCrossings():Intersection{
		for(var i = 0; i < this.edges.length-1; i++){
			for(var j = i+1; j < this.edges.length; j++){
				var intersection = new Intersection(this.edges[i], this.edges[j]);
				if(intersection.exists == true){
					return intersection; 
				}
			}
		}
		return undefined;
	}

	chopAllCrossingsWithEdge(edge:PlanarEdge):XYPoint[]{
		var intersections = edge.crossingEdges();
		if(intersections.length === 0) { return []; }
		var endNodes = [edge.node[0], edge.node[1]]
			.sort(function(a,b){if(a.x<b.x){return -1;}if(a.x>b.x){return 1;}return 0;})
			.sort(function(a,b){if(a.y<b.y){return -1;}if(a.y>b.y){return 1;}return 0;});
		// remove the edge
		super.removeEdge(edge);
		// step down the intersections, rebuild edges in order
		var newLineNodes = [];
		for(var i = 0; i < intersections.length; i++){
			var intersection = intersections[i];
			var crossingEdge;
			var crossingNodes = [];
			if(intersection.edges[0] === edge){
				crossingEdge = intersection.edges[1];
				crossingNodes = [intersection.nodes[2], intersection.nodes[3] ];
			} else if(intersection.edges[1] === edge){
				crossingEdge = intersection.edges[0];
				crossingNodes = [intersection.nodes[0], intersection.nodes[1] ];
			} else{ console.log(":p something weird"); }

			this.removeEdge(crossingEdge);
			var newNode = this.addNode(new PlanarNode(intersection.x, intersection.y));
			this.addEdgeFromExistingVertices(newNode, crossingNodes[0]);
			this.addEdgeFromExistingVertices(newNode, crossingNodes[1]);
			newLineNodes.push(newNode);
		}
		this.addEdgeFromExistingVertices(endNodes[0], newLineNodes[0]);
		for(var i = 0; i < newLineNodes.length-1; i++){
			this.addEdgeFromExistingVertices(newLineNodes[i], newLineNodes[i+1]);
		}
		this.addEdgeFromExistingVertices(newLineNodes[newLineNodes.length-1], endNodes[1]);
		super.clean();
		return intersections.map(function(el){ return new XYPoint(el.x, el.y); } );
	}

	// chopEdgesWithIntersection(intersection:Intersection){
	// 	if(intersection == undefined) return;
	// 	this.removeEdgesBetween(intersection.nodes[0], intersection.nodes[1]);
	// 	this.removeEdgesBetween(intersection.nodes[2], intersection.nodes[3]);
	// 	var centerNode = this.addNode(new PlanarNode(intersection.x, intersection.y));
	// 	this.addEdgeFromExistingVertices(centerNode, intersection.nodes[0]);
	// 	this.addEdgeFromExistingVertices(centerNode, intersection.nodes[1]);
	// 	this.addEdgeFromExistingVertices(centerNode, intersection.nodes[2]);
	// 	this.addEdgeFromExistingVertices(centerNode, intersection.nodes[3]);
	// 	this.mergeDuplicateVertices();
	// }

	chop():XYPoint[]{
		var crossings = [];
		for(var i = 0; i < this.edges.length; i++){
			crossings = crossings.concat(this.chopAllCrossingsWithEdge(this.edges[i]));
			this.clean();
		}
		// todo: crossings sometimes has duplicate points, either clean it up here,
		//       or something can be improved about the algorithm
		return crossings;
	}

	// chopOld(){
	// 	// var intersectionPoints = new PlanarGraph();
	// 	var allIntersections = [];  // keep a running total of all the intersection points
	// 	for(var i = 0; i < this.edges.length; i++){
	// 		console.log("edge " + i);
	// 		console.log(this.edges[i].endPoints()[0].x + " " + this.edges[i].endPoints()[0].y);
	// 		var edgeCrossings:Intersection[] = this.getEdgeIntersectionsWithEdge(i);
	// 		if(edgeCrossings != undefined && edgeCrossings.length > 0){
	// 			console.log(i + ": # crossings" + edgeCrossings.length);
	// 			allIntersections = allIntersections.concat(edgeCrossings);
	// 		}
	// 		while(edgeCrossings.length > 0){
	// 			var newIntersectionIndex = this.nodes.length;
	// 			this.addNode(new PlanarNode(edgeCrossings[0].x, edgeCrossings[0].y));
	// 			// this.addNode({'x':edgeCrossings[0].x, 'y':edgeCrossings[0].y});
	// 			this.addEdgeFromExistingVertices(this.nodes[this.nodes.length-1], edgeCrossings[0].nodes[0]);
	// 			this.addEdgeFromExistingVertices(this.nodes[this.nodes.length-1], edgeCrossings[0].nodes[1]);
	// 			this.addEdgeFromExistingVertices(this.nodes[this.nodes.length-1], edgeCrossings[0].nodes[2]);
	// 			this.addEdgeFromExistingVertices(this.nodes[this.nodes.length-1], edgeCrossings[0].nodes[3]);
	// 			this.removeEdgesBetween(edgeCrossings[0].nodes[0], edgeCrossings[0].nodes[1]);
	// 			this.removeEdgesBetween(edgeCrossings[0].nodes[2], edgeCrossings[0].nodes[3]);
	// 			edgeCrossings = this.getEdgeIntersectionsWithEdge(i);
	// 			// add intersections to array
	// 			allIntersections = allIntersections.concat(edgeCrossings);
	// 			// intersectionPoints.addNodes(edgeCrossings);
	// 			this.clean();
	// 		}
	// 	}
	// 	// return allIntersections;
	// 	// return a unique array of all intersection points
	// 	var pg = new PlanarGraph();  // creating a object inside of the object def itself?..
	// 	pg.nodes = allIntersections;
	// 	pg.mergeDuplicateVertices();
	// 	return pg.nodes;
	// }

	///////////////////////////////////////////////////////////////
	// FACE

	generateFaces(){
		var faces = [];
		for(var i = 0; i < this.nodes.length; i++){
			var thisNode = this.nodes[i];
			var adjacentFaces = [];
			var homeAdjacencyArray = thisNode.planarAdjacent();
			for(var n = 0; n < homeAdjacencyArray.length; n++){
				var thisFace = new PlanarFace();
				var invalidFace = false;
				var angleSum = 0;
				thisFace.nodes = [ thisNode ];
				var a2b:PlanarPair;
				var a:PlanarNode;
				var b:PlanarNode = thisNode;
				var b2c:PlanarPair = homeAdjacencyArray[n];
				var c:PlanarNode = b2c.node;
				do{
					if(c === a){ invalidFace = true; break; } // this shouldn't be needed if graph is clean
					thisFace.nodes.push(c);
					thisFace.edges.push(b2c.edge);
					// increment, step forward
					a = b;   b = c;   a2b = b2c;
					b2c = b.adjacentNodeClockwiseFrom(a);
					c = b2c.node;
					angleSum += clockwiseAngleFrom(a2b.angle, b2c.angle - Math.PI);
				}while(c !== thisNode);
				// close off triangle
				thisFace.edges.push(b2c.edge);
				// find interior angle from left off to the original point
				if(thisNode === b){ invalidFace = true;} // this is consistently happening with one of the paper corner vertices
				else{
					var c2a = thisNode.adjacentNodeClockwiseFrom(b);
					angleSum += clockwiseAngleFrom(b2c.angle, c2a.angle - Math.PI);
				}
				// add face if valid
				if(!invalidFace && thisFace.nodes.length > 2){
					// sum of interior angles rule, (n-2) * PI
					var polygonAngle = angleSum / (thisFace.nodes.length-2);
					if(polygonAngle - EPSILON <= Math.PI && polygonAngle + EPSILON >= Math.PI){
						adjacentFaces.push(thisFace);
					}
				}

			}
			for(var af = 0; af < adjacentFaces.length; af++){
				var duplicate = false;
				for(var tf = 0; tf < this.faces.length; tf++){
					if(this.faces[tf].equivalent(adjacentFaces[af])){ duplicate = true; break; }
				}
				if(!duplicate){ this.faces.push(adjacentFaces[af]); }
			}
		}
	}

	/*generateFaces(){
		// walk around a face
		this.faces = [];
		for(var startIndex = 0; startIndex < this.nodes.length; startIndex++){
			// from a starting node, get all of its nodes/edges clockwise around it
			var startNodeAdjacent = this.nodes[startIndex].planarAdjacent();
			for(var n = 0; n < startNodeAdjacent.length; n++){
				// from the start node, venture off in every connected node direction, attempt to make a face
				var adjacentPair:PlanarPair = startNodeAdjacent[n];
				var currentNode = adjacentPair.node;
				// attempt to build a face, add first 2 points and connecting edge
				var theFace = new PlanarFace();
				theFace.nodes = [ this.nodes[startIndex], currentNode ];
				theFace.edges = [ adjacentPair.edge ];
				var validFace = true;
				while(validFace && currentNode.index != startIndex){
					// travel down edges, select the most immediately-clockwise connected node
					// this requires to get the node we just came from
					var fromNode = theFace.nodes[ theFace.nodes.length-2 ];
					// step forwar down the next edge
					currentNode = this.getClockwiseNeighborAround( currentNode, fromNode );
					// check if we have reached the beginning again, if the face is complete
					if(currentNode == undefined){ validFace = false;} // something weird is going on
					else {
						if(currentNode === fromNode){ validFace = false; } 
						else{
							if(currentNode.index != startIndex){
								theFace['nodes'].push(currentNode);
								// var nextAngle = adjacentPair.angle;
								// totalAngle += (nextAngle - prevAngle);
							}
							theFace['edges'].push(adjacentPair.edge);
							// var already = this.arrayContainsNumberAtIndex(theFace, currentNode);
							// if(already == undefined){
							// 	theFace.push(currentNode);								
							// } else{
								// face that makes a figure 8. visits a node twice in the middle.
								// if(this.faces.length > 2){
								// 	// we can use this sub section if it's larger than a line
								// 	var cropFace = theFace.slice(already, 1 + theFace.length-already);
								// 	this.faces.push(cropFace);
								// } 
								// validFace = false;
							// }
						}

					}
				}

				if(validFace && !this.arrayContainsDuplicates(theFace)){
					// theFace['angle'] = totalAngle;
					this.faces.push(theFace);
				}
			}
		}

		// remove duplicate faces
		var i = 0;
		while(i < this.faces.length-1){
			var j = this.faces.length-1;
			while(j > i){
				if(this.areFacesEquivalent(i, j)){
					this.faces.splice(j, 1);
				}
				j--;
			}
			i++;
		}
	}*/

	arrayContainsNumberAtIndex(array, number:number){
		for(var i = 0; i < array.length; i++) {
			if (array[i] == number) {  return i;  }
		} return undefined;
	}

	arrayContainsDuplicates(array):boolean{
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

	areFacesEquivalent(faceIndex1:number, faceIndex2:number):boolean{
		// todo: does this work? checking memory location or check .index
		if(this.faces[faceIndex1].nodes.length != this.faces[faceIndex2].nodes.length) return false;
		var sorted1 = this.faces[faceIndex1].nodes.sort(function(a,b){return (a.index > b.index)?1:((b.index > a.index)?-1:0);});
		var sorted2 = this.faces[faceIndex2].nodes.sort(function(a,b){return (a.index > b.index)?1:((b.index > a.index)?-1:0);});
		for(var i = 0; i < sorted1.length; i++) {
			if(!(sorted1[i] === sorted2[i])) return false;
		}
		return true;
	}

	getNodeIndexNear(x:number, y:number, thisEpsilon:number){
		var thisPoint = new XYPoint(x, y);
		for(var i = 0; i < this.nodes.length; i++){
			if(this.verticesEquivalent(this.nodes[i], thisPoint, thisEpsilon)){
				return i;
			}
		}
		return undefined;
	}

	vertexLiesOnHorizontalEdge(v:XYPoint, edgeY:number):boolean{
		if(v.y < edgeY + EPSILON && v.y > edgeY - EPSILON) return true;
		return false;
	}
	vertexLiesOnVerticalEdge(v:XYPoint, edgeX:number):boolean{
		if(v.x < edgeX + EPSILON && v.x > edgeX - EPSILON) return true;
		return false;
	}
	vertexLiesOnEdge(v:XYPoint, intersect:XYPoint):boolean{  // Vertex, Vertex*
		// including a margin of error, bounding area around vertex

		// first check if point lies on end points
		for(var i = 0; i < this.nodes.length; i++){
			if( this.verticesEquivalent(this.nodes[i], v, EPSILON) ){
				intersect.x = this.nodes[i].x;
				intersect.y = this.nodes[i].y;
				// intersect.z = this.nodes[i].z;
				return true;
			}
		}

		for(var i = 0; i < this.edges.length; i++){
			var a = <PlanarNode>this.edges[i].node[0];
			var b = <PlanarNode>this.edges[i].node[1];
			var crossproduct = (v.y - a.y) * (b.x - a.x) - (v.x - a.x) * (b.y - a.y);
			if(Math.abs(crossproduct) < EPSILON){
				// cross product is essentially zero, point lies along the (infinite) line
				// now check if it is between the two points
				var dotproduct = (v.x - a.x) * (b.x - a.x) + (v.y - a.y) * (b.y - a.y);
				// dot product must be between 0 and the squared length of the line segment
				if(dotproduct > 0){
					var lengthSquared = Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2);
					if(dotproduct < lengthSquared){
						//TODO: intersection
						//                    intersect =
						return true;
					}
				}
			}
		}
		return false;
	}


	log(detailed?:boolean){
		super.log(detailed);
		for(var i = 0; i < this.nodes.length; i++){
			console.log(' ' + i + ': (' + this.nodes[i].x + ', ' + this.nodes[i].y + ')');
		}
		for(var i = 0; i < this.edges.length; i++){
			console.log(' ' + i + ': (' + this.edges[i].node[0].index + ' -- ' + this.edges[i].node[1].index + ')');
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
		return new XYPoint(rayOrigin.x + rayDirection.x * t1, rayOrigin.y + rayDirection.y * t1);
		//return t1;
	}
	return undefined;
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

function lineSegmentIntersectionAlgorithm(p0:XYPoint, p1:XYPoint, p2:XYPoint, p3:XYPoint):XYPoint {
	// p0-p1 is first line
	// p2-p3 is second line
	var rise1 = (p1.y-p0.y);
	var run1  = (p1.x-p0.x);
	var rise2 = (p3.y-p2.y);
	var run2  = (p3.x-p2.x);
	var slope1 = rise1 / run1;
	var slope2 = rise2 / run2;

	// if lines are parallel to each other within a floating point error
	if(Math.abs(slope1) == Infinity && Math.abs(slope2) > SLOPE_ANGLE_INF_EPSILON) return undefined;
	if(Math.abs(slope2) == Infinity && Math.abs(slope1) > SLOPE_ANGLE_INF_EPSILON) return undefined;
	var angle1 = Math.atan(slope1);
	var angle2 = Math.atan(slope2);
	if(Math.abs(angle1-angle2) < SLOPE_ANGLE_EPSILON) return undefined;

	var denom = run1 * rise2 - run2 * rise1;
	if (denom == 0)
		return undefined; // Collinear
	var denomPositive = false;
	if(denom > 0) 
		denomPositive = true;

	var s02 = {'x':p0.x - p2.x, 'y':p0.y - p2.y};

	var s_numer = run1 * s02.y - rise1 * s02.x;
	if ((s_numer < 0) == denomPositive)
		return undefined; // No collision

	var t_numer = run2 * s02.y - rise2 * s02.x;
	if ((t_numer < 0) == denomPositive)
		return undefined; // No collision

	if(!epsilonEqual(s_numer, denom) && !epsilonEqual(t_numer, denom)){ // ! (point exists on line)
		if (((s_numer > denom) == denomPositive) || ((t_numer > denom) == denomPositive))
			return undefined; // No collision
	}
	// Collision detected
	var t = t_numer / denom;
	// var i = {'x':(p0.x + (t * run1)), 'y':(p0.y + (t * rise1))};
	// return i;
	return new XYPoint(p0.x + (t * run1), p0.y + (t * rise1) );
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
	return (Math.abs( u.Dot( v.Rotate90() ) ) < EPSILON);
}


function minDistBetweenPointLine(a:XYPoint, b:XYPoint, x:number, y:number):XYPoint{
	// (a)-(b) define the line
	// x,y is the point
	var p = Math.sqrt(Math.pow(b.x-a.x,2) + Math.pow(b.y-a.y,2));
	var u = ((x-a.x)*(b.x-a.x) + (y-a.y)*(b.y-a.y)) / (Math.pow(p,2));
	if(u < 0 || u > 1.0) return undefined;
	return new XYPoint(a.x + u*(b.x-a.x), a.y + u*(b.y-a.y));
}