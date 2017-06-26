/// <reference path="graph.ts"/>

"use strict";

// for purposes of modeling origami crease patterns
//
// this is a planar graph data structure containing edges and vertices
// vertices are points in 3D space {x,y,z}  (z is 0 for now)

var USER_TAP_EPSILON = 0.01;
var EPSILON = 0.003;
var SLOPE_ANGLE_PLACES = 2.5;
var SLOPE_ANGLE_EPSILON = 1 * Math.pow(10,-SLOPE_ANGLE_PLACES);
var SLOPE_ANGLE_INF_EPSILON = 1 * Math.pow(10,SLOPE_ANGLE_PLACES);

// this graph represents an origami crease pattern
//    with creases (edges) defined by their endpoints (vertices)

class EdgeNodeAngle extends EdgeAndNode{
	edge:number;  // index
	node:number;  // index
	angle:number; // degrees or radians IDK
}

class XYPoint{
	x:number;
	y:number;
	constructor(xx:number, yy:number){
		this.x = xx;
		this.y = yy;
	}
}

class PlanarNode extends GraphNode{
	x:number;
	y:number;
	adjacent:{
		edges:EdgeNodeAngle[], 
		nodes:EdgeNodeAngle[]
	}
	constructor(xx:number, yy:number){
		super();
		this.x = xx;
		this.y = yy;
		if(xx == undefined){ this.x = 0; }
		if(yy == undefined){ this.y = 0; }
	}
}

class PlanarEdge extends Edge{
	getEndpoints:()=>XYPoint[] =
	function() { return [XYPoint(this.node[0]), XYPoint()]; };

	constructor(index1:number, index2:number){
		super(index1, index2);
	};

	// getEndpoints()->object{

	// }
}

class Face{
	nodes:number[];
}

// creases are lines (edges) with endpoints v1, v2 (indices in vertex array)
class PlanarGraph extends Graph{

	nodes:PlanarNode[];
	faces:Face[];

	constructor(){
		super();
		this.faces = [];
		// reprogram these:
		this.nodes = []; // each entry is object with properties: 
		                 // {
		                 //   x:___,
		                 //   y:___,
		                 //   adjacent:{
		                 //     edges:[ {edge:3, node:2, angle:30°},
		                 //             {edge:0, node:3, angle:60°}, ... ]
		                 //     nodes:[ 0, 1, 2, ...]
		                 //   }
		                 // }
		                 // all angles are with respect to a universal coordinate frame
	}

	//////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////
	//
	//  1.
	//  ADD PARTS

	addEdgeWithVertices(x1, y1, x2, y2){  // floats
		var nodeArrayLength = this.nodes.length;
		this.nodes.push( new PlanarNode(x1, y1) );
		this.nodes.push( new PlanarNode(x2, y2) );
		this.edges.push( new Edge(nodeArrayLength, nodeArrayLength+1) );
		return this.edges.length-1;
		// this.changedNodes( [this.nodes.length-2, this.nodes.length-1] );
	}

	addEdgeFromVertex(existingIndex, newX, newY){ // uint, floats
		var nodeArrayLength = this.nodes.length;
		// this.nodes.push( {'x':newX, 'y':newY, 'isBoundary':this.isBoundaryNode(newX, newY)} );
		this.nodes.push( new PlanarNode(newX, newY) );
		this.edges.push( new Edge(existingIndex, nodeArrayLength) );
		// this.changedNodes( [existingIndex, this.nodes.length-1] );
	}

	addEdgeFromExistingVertices(existingIndex1, existingIndex2){ // uint, uint
		this.edges.push( new Edge(existingIndex1, existingIndex2) );
		// this.changedNodes( [existingIndex1, existingIndex2] );
	}

	addEdgeRadiallyFromVertex(existingIndex, angle, distance){ // uint, floats
		var newX = this.nodes[existingIndex].x + Math.cos(angle) * distance;
		var newY = this.nodes[existingIndex].y + Math.sin(angle) * distance;
		this.addEdgeFromVertex(existingIndex, newX, newY);
		// this.changedNodes( [existingIndex, this.nodes.length-1] );
	}

	//////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////
	//
	//  2.
	//  CLEAN  /  REFRESH COMPONENTS

	// quick and easy, use a square bounding box
	verticesEquivalent(v1:PlanarNode, v2:PlanarNode, epsilon:number){  // Vertex type
		return (v1.x - epsilon < v2.x && v1.x + epsilon > v2.x &&
				v1.y - epsilon < v2.y && v1.y + epsilon > v2.y);
	}
	// verticesEquivalent(x1, y1, x2, y2, float epsilon){  // float type
	// 	return (x1 - epsilon < x2 && x1 + epsilon > x2 &&
	// 			y1 - epsilon < y2 && y1 + epsilon > y2);
	// } 

	clean(){
		var graphResult = super.clean(); //{'duplicate':countDuplicate, 'circular': countCircular};
		var result = this.mergeDuplicateVertices();
		return graphResult; //TODO: add result to this
	}

	// changedNodes(nodeArray){
	// 	var adjacent = [];
	// 	for(var i = 0; i < nodeArray.length; i++){
	// 		adjacent = adjacent.concat( this.getNodesAdjacentToNode(nodeArray[i]) );
	// 	}
	// 	//make list unique
	// 	var unique = [...new Set(adjacent)]; 
	// 	for(var i = 0; i < unique.length; i++){
	// 		this.refreshAdjacencyAtNode(i);
	// 	}
	// }

	///////////////////////////////////
	// Graph-related (non-positional)

	refreshAdjacencyAtNode(nodeIndex:number){
		///////// EDGES
		// get indices of all connected edges
		var adjacentEdgeIndices = this.getEdgesAdjacentToNode(nodeIndex);
		var adjacentEdges:EdgeNodeAngle[] = [];
		for(var i = 0; i < adjacentEdgeIndices.length; i++){
			var newEdge = new EdgeNodeAngle();
			// find other 
			var node0 = this.edges[ adjacentEdgeIndices[i] ].node[0];
			var node1 = this.edges[ adjacentEdgeIndices[i] ].node[1];
			var edgesOtherNode = undefined
			if(node0 == nodeIndex){ edgesOtherNode = node1; }
			if(node1 == nodeIndex){ edgesOtherNode = node0; }
			if(edgesOtherNode != undefined){
				var dx = this.nodes[edgesOtherNode].x - this.nodes[nodeIndex].x;
				var dy = this.nodes[edgesOtherNode].y - this.nodes[nodeIndex].y;
				var edgeAngle = Math.atan2(dy, dx);
				// could add a distance property here too
				newEdge.edge = adjacentEdgeIndices[i];
				newEdge.node = edgesOtherNode;
				newEdge.angle = edgeAngle;
			}
			adjacentEdges.push( newEdge );
		}
		///////// NODES
		var adjacentNodeIndices = this.getNodesAdjacentToNode(nodeIndex);
		var adjacentNodes:EdgeNodeAngle[] = [];
		for(var i = 0; i < adjacentNodeIndices.length; i++){
			var newNode = new EdgeNodeAngle();
			var nodesOtherNode = adjacentNodeIndices[i];
			var nodesEdge = this.getEdgeConnectingNodes(nodeIndex, nodesOtherNode);
			{
				var dx = this.nodes[nodesOtherNode].x - this.nodes[nodeIndex].x;
				var dy = this.nodes[nodesOtherNode].y - this.nodes[nodeIndex].y;
				var edgeAngle = Math.atan2(dy, dx);
			}
			newNode.edge = nodesEdge;
			newNode.node = nodesOtherNode;
			newNode.angle = edgeAngle;
			adjacentNodes.push( newNode );
		}
		this.nodes[nodeIndex].adjacent = {'nodes': adjacentNodes, 'edges': adjacentEdges};
	}

	refreshAdjacencies(){
		for(var i = 0; i < this.nodes.length; i++){
			this.refreshAdjacencyAtNode(i);
		}
	}

	getClockwiseNeighborAround(node, fromNode){
		var array = this.nodes[node]['adjacent']['edges'];
		for(var i = 0; i < array.length; i++){
			if(array[i]['node'] == fromNode){
				var index = ((i+1)%array.length);
				return array[index];
			}
		}
		return undefined;
	}

	getNextElementToItemInArray(array, item){
		for(var i = 0; i < array.length; i++){
			if(array[i] == item){
				var index = i+1;
				if(index >= array.length) index -= array.length;
				return array[index];
			}
		}
		return undefined;
	}

	//////////////////////////////
	// position vicinity related

	mergeDuplicateVertices(){
		// DANGEROUS: removes nodes
		// this looks for nodes.position which are physically nearby, within EPSILON radius
		var removeCatalog = [];
		for(var i = 0; i < this.nodes.length-1; i++){
			for(var j = this.nodes.length-1; j > i; j--){
				if ( this.verticesEquivalent(this.nodes[i], this.nodes[j], EPSILON) ){
					super.mergeNodes(i, j);
					removeCatalog.push( {'x':this.nodes[i].x, 'y':this.nodes[i].y, 'nodes':[i,j] } );
				}
			}
		}
		return removeCatalog;
	}

	getNearestNode(x, y){
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

	getNearestNodes(x, y, howMany){
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


	getNearestEdge(x, y){
		if(x == undefined || y == undefined)
			return undefined;

		var minDist = undefined;
		var minDistIndex = undefined;
		var minLocation = undefined;
		for(var i = 0; i < this.edges.length; i++){
			var p1 = this.nodes[ this.edges[i].node[0] ];
			var p2 = this.nodes[ this.edges[i].node[1] ];
			var pT = this.minDistBetweenPointLine(p1.x, p1.y, p2.x, p2.y, x, y);
			if(pT != undefined){
				var thisDist = Math.sqrt(Math.pow(x-pT.x,2) + Math.pow(y-pT.y,2));
				if(minDist == undefined || thisDist < minDist){
					minDist = thisDist;
					minDistIndex = i;
					minLocation = pT;
				}
			}
		}
		return {'edge':minDistIndex, 'location':minLocation, 'distance':minDist};
	}


	///////////////////////////////////////////////////////////////
	// EDGE INTERSECTION

	edgesIntersect(e1, e2): any{
		// if true - returns {x,y} location of intersection
		if(this.areEdgesAdjacent(e1, e2)){  return undefined;  }
		var v0 = this.nodes[ this.edges[e1].node[0] ];
		var v1 = this.nodes[ this.edges[e1].node[1] ];
		var v2 = this.nodes[ this.edges[e2].node[0] ];
		var v3 = this.nodes[ this.edges[e2].node[1] ];
		return this.lineSegmentIntersectionAlgorithm(v0, v1, v2, v3);
	}

	edgesIntersectUsingVertices(p0, p1, p2, p3){
		// if true - returns {x,y} location of intersection
		if(this.verticesEquivalent(p0, p2, EPSILON) ||
		   this.verticesEquivalent(p0, p3, EPSILON) ||
		   this.verticesEquivalent(p1, p2, EPSILON) ||
		   this.verticesEquivalent(p1, p3, EPSILON) ){
		   	return undefined;
		}
		return this.lineSegmentIntersectionAlgorithm(p0, p1, p2, p3);
	}

	getEdgeIntersectionsWithEdge(edgeIndex){
		var intersections = [];
		for(var i = 0; i < this.edges.length; i++){
			if(edgeIndex != i){
				var intersection = this.edgesIntersect(edgeIndex, i);
				if(intersection != undefined){
					intersection.e1 = edgeIndex;
					intersection.e2 = i;
					intersection.e1n1 = this.edges[edgeIndex].node[0];
					intersection.e1n2 = this.edges[edgeIndex].node[1];
					intersection.e2n1 = this.edges[i].node[0];
					intersection.e2n2 = this.edges[i].node[1];
					intersections.push(intersection);
				}
			}
		}
		return intersections;
	}

	getAllEdgeIntersections(){
		var intersections = [];
		for(var i = 0; i < this.edges.length-1; i++){
			for(var j = i+1; j < this.edges.length; j++){
				var intersection = this.edgesIntersect(i, j);
				if(intersection != undefined){
					// it's just. i really think... we don't need this extra stuff in this function
					// intersection.e1 = i;
					// intersection.e2 = j;
					// intersection.e1n1 = this.edges[i].node[0];
					// intersection.e1n2 = this.edges[i].node[1];
					// intersection.e2n1 = this.edges[j].node[0];
					// intersection.e2n2 = this.edges[j].node[1];
					intersections.push(intersection);
				}
			}
		}
		return intersections;
	}

	// splitAtIntersections(){
	// chop(){
	// 	var intersectionPoints = new PlanarGraph();
	// 	// var allIntersections = [];
	// 	if(LOG) console.log('crease pattern: chop()');
	// 	for(var i = 0; i < this.edges.length; i++){
	// 		var intersections = this.getEdgeIntersectionsWithEdge(i);
	// 		if(intersections != undefined && intersections.length > 0){
	// 			// allIntersections = allIntersections.concat(intersections);
	// 			intersectionPoints.addNodes(intersections);
	// 		}
	// 		while(intersections.length > 0){
	// 			var newIntersectionIndex = this.nodes.length;
	// 			this.addNode({'x':intersections[0].x, 'y':intersections[0].y});
	// 			this.addEdgeFromExistingVertices(this.nodes.length-1, intersections[0].e1n1);
	// 			this.addEdgeFromExistingVertices(this.nodes.length-1, intersections[0].e1n2);
	// 			this.addEdgeFromExistingVertices(this.nodes.length-1, intersections[0].e2n1);
	// 			this.addEdgeFromExistingVertices(this.nodes.length-1, intersections[0].e2n2);
	// 			this.removeEdgesBetween(intersections[0].e1n1, intersections[0].e1n2);
	// 			this.removeEdgesBetween(intersections[0].e2n1, intersections[0].e2n2);
	// 			intersections = this.getEdgeIntersectionsWithEdge(i);
	// 			// add intersections to array
	// 			// allIntersections = allIntersections.concat(intersections);
	// 			intersectionPoints.addNodes(intersections);
	// 		}
	// 	}
	// 	// return allIntersections;
	// 	intersectionPoints.mergeDuplicateVertices();
	// 	return intersectionPoints.nodes;
	// }

	chop(){
		// var intersectionPoints = new PlanarGraph();
		var allIntersections = [];  // keep a running total of all the intersection points
		for(var i = 0; i < this.edges.length; i++){
			var edgeCrossings = this.getEdgeIntersectionsWithEdge(i);
			if(edgeCrossings != undefined && edgeCrossings.length > 0){
				allIntersections = allIntersections.concat(edgeCrossings);
				// intersectionPoints.addNodes(edgeCrossings);
			}
			while(edgeCrossings.length > 0){
				var newIntersectionIndex = this.nodes.length;
				this.addNode({'x':edgeCrossings[0].x, 'y':edgeCrossings[0].y});
				this.addEdgeFromExistingVertices(this.nodes.length-1, edgeCrossings[0].e1n1);
				this.addEdgeFromExistingVertices(this.nodes.length-1, edgeCrossings[0].e1n2);
				this.addEdgeFromExistingVertices(this.nodes.length-1, edgeCrossings[0].e2n1);
				this.addEdgeFromExistingVertices(this.nodes.length-1, edgeCrossings[0].e2n2);
				this.removeEdgesBetween(edgeCrossings[0].e1n1, edgeCrossings[0].e1n2);
				this.removeEdgesBetween(edgeCrossings[0].e2n1, edgeCrossings[0].e2n2);
				edgeCrossings = this.getEdgeIntersectionsWithEdge(i);
				// add intersections to array
				allIntersections = allIntersections.concat(edgeCrossings);
				// intersectionPoints.addNodes(edgeCrossings);
				this.clean();
			}
		}
		// return allIntersections;
		// return a unique array of all intersection points
		var pg = new PlanarGraph();  // creating a object inside of the object def itself?..
		pg.nodes = allIntersections;
		pg.mergeDuplicateVertices();
		return pg.nodes;
	}

	arrayContainsNumberAtIndex(array, number){
		for(var i = 0; i < array.length; i++) {
			if (array[i] == number) {  return i;  }
		} return undefined;
	}

	arrayContainsDuplicates(array){
		if(array.length <= 1) return false;
		for(var i = 0; i < array.length-1; i++) {
			for(var j = i+1; j < array.length; j++){
				if(array[i] == array[j]){
					return true;
				}
			}
		}
		return false;
	}


// Planar Graph new data structures

	generateFaces(){
		// walk around a face
		this.faces = [];
		for(var startNode = 0; startNode < this.nodes.length; startNode++){
			for(var n = 0; n < this.nodes[startNode].adjacent.edges.length; n++){
				var validFace = true;
				var nextAdjacent = this.nodes[startNode].adjacent.edges[n];
				var travelingNode = nextAdjacent.node;
				var theFace = new Face();
				theFace['nodes'] = [ startNode, travelingNode ];
				theFace['edges'] = [ nextAdjacent.edge ];
				// var prevAngle = 0
				// theFace['angles'] = [ this.nodes[startNode].adjacent.edges[n].angle ];
				// var totalAngle = 0;
				while(validFace && travelingNode != startNode){
					var prevNode = theFace['nodes'][ theFace['nodes'].length-2 ];
					var nextAdjacent = this.getClockwiseNeighborAround( travelingNode, prevNode );
					travelingNode = nextAdjacent.node;
					// theFace['angles'].push(nextAdjacent.angle);
					// var nextAngle = nextAdjacent.angle;
					// totalAngle += (nextAngle - prevAngle);
					// prevAngle = nextAngle;
					if(travelingNode == undefined){
						// next element in array returning undefined, something weird is going on
						validFace = false;
					} else {
						if(travelingNode == prevNode){
							validFace = false;
						} else{
							if(travelingNode != startNode){
								theFace['nodes'].push(travelingNode);
								// var nextAngle = nextAdjacent.angle;
								// totalAngle += (nextAngle - prevAngle);
							}
							theFace['edges'].push(nextAdjacent.edge);
							// var already = this.arrayContainsNumberAtIndex(theFace, travelingNode);
							// if(already == undefined){
							// 	theFace.push(travelingNode);								
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
	}

	areFacesEquivalent(faceIndex1, faceIndex2){
		if(this.faces[faceIndex1].nodes.length != this.faces[faceIndex2].nodes.length) return false;
		for(var i = 0; i < this.faces[faceIndex1].nodes.length; i++){
			var found = false;
			for(var j = 0; j < this.faces[faceIndex2].nodes.length; j++){
				if(this.faces[faceIndex1].nodes[i] == this.faces[faceIndex2].nodes[j]) found = true;
			}
			if(found == false) return false;
		}
		return true;
	}

	getVertexIndexAt(x, y){  // float float
		for(var i = 0; i < this.nodes.length; i++){
			if(this.verticesEquivalent(this.nodes[i], new PlanarNode(x, y), USER_TAP_EPSILON)){
				return i;
			}
		}
		return undefined;
	}

	isCornerNode(x, y){
		// var E = EPSILON;
		// if( y < E ) return 1;
		// if( x > 1.0 - E ) return 2;
		// if( y > 1.0 - E ) return 3;
		// if( x < E ) return 4;
		// return undefined;
	}

	isBoundaryNode(x, y){
		var E = .1;//EPSILON;
		if( y < E ) return 1;
		if( x > 1.0 - E ) return 2;
		if( y > 1.0 - E ) return 3;
		if( x < E ) return 4;
		return undefined;
	}

	// vertexLiesOnEdge(vIndex, intersect){  // uint, Vertex
	// 	var v = this.nodes[vIndex];
	// 	return this.vertexLiesOnEdge(v, intersect);
	// }

	vertexLiesOnEdge(v, intersect){  // Vertex, Vertex*
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
			var a = this.nodes[ this.edges[i].node[0] ];
			var b = this.nodes[ this.edges[i].node[1] ];
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

	/*
	connectingVertexIndicesSortedRadially(vIndex){  // uint
		var connectedVertices = this.connectedVertexIndices(vIndex);  // array uint
		var globalAngleValues = []; //float  // calculated from global 0deg line
		// we have to query the global angle of each segment
		// so we can locally sort each clockwise or counter clockwise
		var sortedGlobalAngleValues = []; // float
		for(var i = 0; i < connectedVertices.length; i++){
			float angle = Math.atan2(this.nodes[connectedVertices[i]].y - this.nodes[vIndex].y,
								     this.nodes[connectedVertices[i]].x - this.nodes[vIndex].x);
			globalAngleValues.push( angle );
			sortedGlobalAngleValues.push( angle );
		}
		sort(sortedGlobalAngleValues.begin(), sortedGlobalAngleValues.begin()+connectedVertices.length);
		// now each edge'd sprout angle is sorted from -pi to pi
		var connectedVertexIndicesSorted = []; // uint
		for(var i = 0; i < connectedVertices.length; i++)
			for(var j = 0; j < connectedVertices.length; j++)
				if(sortedGlobalAngleValues[i] == globalAngleValues[j])
					connectedVertexIndicesSorted.push(connectedVertices[j]);
		return connectedVertexIndicesSorted;
	}

	connectingVertexInteriorAngles(vIndex, connectedVertexIndicesSorted){ // uint, uint array
		var anglesBetweenVertices = []; // float
		var anglesOfVertices = []; // float
		for(var i = 0; i < connectedVertexIndicesSorted.length; i++){
			float angle = atan2(this.nodes[connectedVertexIndicesSorted[i]].y - this.nodes[vIndex].y,
								this.nodes[connectedVertexIndicesSorted[i]].x - this.nodes[vIndex].x);
			anglesOfVertices.push(angle);
		}
		for(var i = 0; i < anglesOfVertices.length; i++){
			// when it's the wrap around value (i==3) add 2pi to the angle it's subtracted from
			float diff = anglesOfVertices[(i+1)%anglesOfVertices.length]
			+ (M_PI*2 * (i==3))
			- anglesOfVertices[i%anglesOfVertices.length];
			anglesBetweenVertices.push( diff );
		}
		return anglesBetweenVertices;
	}

	void PlanarGraph::rotateVertex(int vertexIndex, int originVertexIndex, float angleRadians){
		float distance = sqrt(powf( this->nodes[originVertexIndex].y - this->nodes[vertexIndex].y ,2)
							  +powf( this->nodes[originVertexIndex].x - this->nodes[vertexIndex].x ,2));
		float currentAngle = atan2(this->nodes[vertexIndex].y, this->nodes[vertexIndex].x);
		this->nodes[vertexIndex].x = distance*cosf(currentAngle + angleRadians);
		this->nodes[vertexIndex].y = distance*sinf(currentAngle + angleRadians);
	}

	*/

	log(){
		super.log();
		console.log("Vertices: (" + this.nodes.length + ")");
		for(var i = 0; i < this.nodes.length; i++){
			// console.log(' ' + i + ': (' + this.nodes[i].x + ', ' + this.nodes[i].y + ', ' + this.nodes[i].z + ')');
			console.log(' ' + i + ': (' + this.nodes[i].x + ', ' + this.nodes[i].y + ')');
		}
		console.log("\nEdges:\n" + this.edges.length + ")");
		for(var i = 0; i < this.edges.length; i++){
			console.log(' ' + i + ': (' + this.edges[i].node[0] + ' -- ' + this.edges[i].node[1] + ')');
		}
	}

	/////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////
	//
	//                            2D ALGORITHMS
	//

	// if points are all collinear
	// checks if point q lies on line segment 'ab'
	onSegment(a, point, b){  // Vertices
		if (point.x <= Math.max(a.x, b.x) && point.x >= Math.min(a.x, b.x) &&
			point.y <= Math.max(a.y, b.y) && point.y >= Math.min(a.y, b.y)){
			console.log('returning true');
			return true;
		}
		console.log('returning false');
		return false;
	}

	lineSegmentIntersectionAlgorithm(p0, p1, p2, p3) {
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

		if (((s_numer > denom) == denomPositive) || ((t_numer > denom) == denomPositive))
			return undefined; // No collision
		// Collision detected
		var t = t_numer / denom;
		var i = {'x':(p0.x + (t * run1)), 'y':(p0.y + (t * rise1))};
		return i;
	}

	// lineSegmentIntersectionAlgorithm(p0, p1, p2, p3) {
	// 	var s1 = {'x':0, 'y':0};
	// 	var s2 = {'x':0, 'y':0};
	// 	s1.x = p1.x - p0.x;
	// 	s1.y = p1.y - p0.y;
	// 	s2.x = p3.x - p2.x;
	// 	s2.y = p3.y - p2.y;
	// 	var s = (-s1.y * (p0.x - p2.x) + s1.x * (p0.y - p2.y)) / (-s2.x * s1.y + s1.x * s2.y);
	// 	var t = ( s2.x * (p0.y - p2.y) - s2.y * (p0.x - p2.x)) / (-s2.x * s1.y + s1.x * s2.y);
	// 	console.log('x1:' + s1.x + ' y1:' + s1.y);
	// 	console.log('x2:' + s2.x + ' y2:' + s2.y);
	// 	console.log('s:' + s + ' t:' + t);
	// 	if (s >= 0 && s <= 1 && t >= 0 && t <= 1){
	// 		// Collision detected
	// 		var i = {'x': p0.x + (t * s1.x), 'y': p0.y + (t * s1.y)};
	// 		return true;
	// 	}
	// 	return false; // No collision
	// }

	minDistBetweenPointLine(x1, y1, x2, y2, x3, y3){
		// (x1,y1)-(x2,y2) define the line
		// x3,y3 is the point
		var p = Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
		var u = ((x3-x1)*(x2-x1) + (y3-y1)*(y2-y1)) / (Math.pow(p,2));
		if(u < 0 || u > 1.0) return undefined;
		var x = x1 + u*(x2-x1);
		var y = y1 + u*(y2-y1);
		return {'x':x, 'y':y};
	}

}