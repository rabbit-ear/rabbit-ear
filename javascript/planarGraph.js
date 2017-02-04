"use strict";
// for purposes of modeling origami crease patterns
//
// this is a planar graph data structure containing edges and vertices
// vertices are points in 3D space {x,y,z}  (z is 0 for now)


var USER_TAP_EPSILON = 0.01;
var VERTEX_DUPLICATE_EPSILON = 0.003;
var SLOPE_ANGLE_PLACES = 2.5;
var SLOPE_ANGLE_EPSILON = 1 * Math.pow(10,-SLOPE_ANGLE_PLACES);
var SLOPE_ANGLE_INF_EPSILON = 1 * Math.pow(10,SLOPE_ANGLE_PLACES);

// this graph represents an origami crease pattern
//    with creases (edges) defined by their endpoints (vertices)

// creases are lines (edges) with endpoints v1, v2 (indices in vertex array)
class PlanarGraph extends Graph{

	constructor(){
		super();
		this.faces = [];
		this.clockwiseNodeEdges = [];

		this.verbose = false;
	}

	///////////////////////////////////////////////////////////////
	// ADD PARTS

	addEdgeWithVertices(x1, y1, x2, y2){  // floats
		var nodeArrayLength = this.nodes.length;
		this.nodes.push( {'x':x1, 'y':y1, 'isBoundary':this.isBoundaryNode(x1, y1)} );
		this.nodes.push( {'x':x2, 'y':y2, 'isBoundary':this.isBoundaryNode(x2, y2)} );
		this.edges.push( {'a':nodeArrayLength, 'b':nodeArrayLength+1} );
	}

	addEdgeFromVertex(existingIndex, newX, newY){ // uint, floats
		var nodeArrayLength = this.nodes.length;
		this.nodes.push( {'x':newX, 'y':newY, 'isBoundary':this.isBoundaryNode(newX, newY)} );
		this.edges.push( {'a':existingIndex, 'b':nodeArrayLength} );
	}

	addEdgeFromExistingVertices(existingIndex1, existingIndex2){ // uint, uint
		this.edges.push( {'a':existingIndex1, 'b':existingIndex2} );
	}

	addEdgeRadiallyFromVertex(existingIndex, angle, distance){ // uint, floats
		var newX = this.nodes[existingIndex].x + Math.cos(angle) * distance;
		var newY = this.nodes[existingIndex].y + Math.sin(angle) * distance;
		this.addEdgeFromVertex(existingIndex, newX, newY);
	}

	///////////////////////////////////////////////////////////////
	// CLEAN  /  REMOVE PARTS

	clean(){
		super.clean();
		this.mergeDuplicateVertices();
	}

	mergeDuplicateVertices(){
		var i = 0;
		while(i < this.nodes.length-1){
			var j = i+1;
			while(j < this.nodes.length){
				var didRemove = false;
				// do the points overlap?
				if ( this.verticesEquivalent(this.nodes[i], this.nodes[j], VERTEX_DUPLICATE_EPSILON) ){
					didRemove = super.mergeNodes(i, j);
					// console.log('merged 2 nodes: ' + i + ' ' + j);
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

	// quick and easy, use a square bounding box
	verticesEquivalent(v1, v2, epsilon){  // Vertex type
		return (v1.x - epsilon < v2.x && v1.x + epsilon > v2.x &&
				v1.y - epsilon < v2.y && v1.y + epsilon > v2.y);
	}
	// verticesEquivalent(x1, y1, x2, y2, float epsilon){  // float type
	// 	return (x1 - epsilon < x2 && x1 + epsilon > x2 &&
	// 			y1 - epsilon < y2 && y1 + epsilon > y2);
	// }



	///////////////////////////////////////////////////////////////
	// EDGE INTERSECTION

	edgesIntersect(e1, e2){
		// if true - returns {x,y} location of intersection
		if(this.areEdgesAdjacent(e1, e2)){
			return undefined;
		}
		var v0 = this.nodes[ this.edges[e1].a ];
		var v1 = this.nodes[ this.edges[e1].b ];
		var v2 = this.nodes[ this.edges[e2].a ];
		var v3 = this.nodes[ this.edges[e2].b ];
		return this.lineSegmentIntersectionAlgorithm(v0, v1, v2, v3);
	}

	edgesIntersectUsingVertices(p0, p1, p2, p3){
		// if true - returns {x,y} location of intersection
		if(this.verticesEquivalent(p0, p2, VERTEX_DUPLICATE_EPSILON) ||
		   this.verticesEquivalent(p0, p3, VERTEX_DUPLICATE_EPSILON) ||
		   this.verticesEquivalent(p1, p2, VERTEX_DUPLICATE_EPSILON) ||
		   this.verticesEquivalent(p1, p3, VERTEX_DUPLICATE_EPSILON) ){
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
					intersection.e1n1 = this.edges[edgeIndex].a;
					intersection.e1n2 = this.edges[edgeIndex].b;
					intersection.e2n1 = this.edges[i].a;
					intersection.e2n2 = this.edges[i].b;
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
					// intersection.e1n1 = this.edges[i].a;
					// intersection.e1n2 = this.edges[i].b;
					// intersection.e2n1 = this.edges[j].a;
					// intersection.e2n2 = this.edges[j].b;
					intersections.push(intersection);
				}
			}
		}
		return intersections;
	}


	// splitAtIntersections(){
	chop(){
		var intersectionPoints = new PlanarGraph();
		// var allIntersections = [];
		for(var i = 0; i < this.edges.length; i++){
			var intersections = this.getEdgeIntersectionsWithEdge(i);
			if(intersections != undefined && intersections.length > 0){
				// allIntersections = allIntersections.concat(intersections);
				intersectionPoints.addNodes(intersections);
			}
			while(intersections.length > 0){
				var newIntersectionIndex = this.nodes.length;
				this.addNode({'x':intersections[0].x, 'y':intersections[0].y});
				this.addEdgeFromExistingVertices(this.nodes.length-1, intersections[0].e1n1);
				this.addEdgeFromExistingVertices(this.nodes.length-1, intersections[0].e1n2);
				this.addEdgeFromExistingVertices(this.nodes.length-1, intersections[0].e2n1);
				this.addEdgeFromExistingVertices(this.nodes.length-1, intersections[0].e2n2);
				this.removeEdgeBetween(intersections[0].e1n1, intersections[0].e1n2);
				this.removeEdgeBetween(intersections[0].e2n1, intersections[0].e2n2);
				intersections = this.getEdgeIntersectionsWithEdge(i);
				// add intersections to array
				// allIntersections = allIntersections.concat(intersections);
				intersectionPoints.addNodes(intersections);
			}
		}
		// return allIntersections;
		intersectionPoints.mergeDuplicateVertices();
		return intersectionPoints.nodes;
	}



	getClosestNode(x, y){
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

	getClosestEdge(x, y){
		// can be optimized with a k-d tree

		var index = this.getClosestNode(x, y);
		if(index == undefined)
			return undefined;

		var subArray = this.getNodesAdjacentToNode(index);
		if(subArray == undefined)
			return undefined;

		var subIndex = undefined;
		var subDistance = Math.sqrt(2);
		for(var i = 0; i < subArray.length; i++){
			var dist = Math.sqrt(Math.pow(this.nodes[ subArray[i] ].x - x,2) + Math.pow(this.nodes[ subArray[i] ].y - y,2));
			if(dist < subDistance){
				subDistance = dist;
				subIndex = i;
			}
		}
		if(subIndex == undefined)
			return undefined;

		var edge = this.getEdgeConnectingNodes(index, subArray[subIndex] );
		return edge;
	}

	getClockwiseNeighbor(node, nodePrime){
		var sortedNodes = getClockwiseConnectedNodesSorted(node);
		var node = this.getNextElementToItemInArray( sortedNodes, nodePrime );
		return node;
	}

	getClockwiseConnectedNodesSorted(nodeIndex){
		var connected = this.getNodesAdjacentToNode(nodeIndex);
		var nodeAngles = {};
		for(var i = 0; i < connected.length; i++){
			nodeAngles[ connected[i] ] = Math.atan2(-(this.nodes[nodeIndex].x - this.nodes[ connected[i] ].x),
			                                         (this.nodes[nodeIndex].y - this.nodes[ connected[i] ].y) );
			if(nodeAngles[ connected[i] ] < 0) nodeAngles[ connected[i] ] += 2*Math.PI;
		}
		var sortedNodes = [];
		while(Object.keys(nodeAngles).length > 0){
			var smallestAngle = undefined;
			var smallestNode = undefined;
			for (var key in nodeAngles) {
				if(smallestAngle == undefined || nodeAngles[key] < smallestAngle){
					smallestAngle = nodeAngles[key];
					smallestNode = key;
				}
			}
			sortedNodes.push( parseInt(smallestNode) );
			delete nodeAngles[smallestNode];
		}
		return sortedNodes;
	}
	getClockwiseConnectedNodesAndAngles(nodeIndex){
		var connected = this.getNodesAdjacentToNode(nodeIndex);
		var nodeAngles = {};
		for(var i = 0; i < connected.length; i++){
			nodeAngles[ connected[i] ] = Math.atan2(-(this.nodes[nodeIndex].x - this.nodes[ connected[i] ].x),
			                                         (this.nodes[nodeIndex].y - this.nodes[ connected[i] ].y) );
			if(nodeAngles[ connected[i] ] < 0) nodeAngles[ connected[i] ] += 2*Math.PI;
		}
		return nodeAngles;
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

	generateFaces(){
		var allNodesClockwise = [];
		for(var i = 0; i < this.nodes.length; i++){
			var sortedNodes = this.getClockwiseConnectedNodesSorted(i);
			if(sortedNodes == undefined) sortedNodes = [];
			allNodesClockwise.push(sortedNodes);
		}
		console.log('allNodesClockwise');
		console.log(allNodesClockwise);
		// walk around a face
		this.faces = [];
		var i = 0;
		for(var i = 0; i < this.nodes.length; i++){
			for(var n = 0; n < allNodesClockwise[i].length; n++){
				var aFace = [ i ];
				var iterate = 0;
				var current = allNodesClockwise[i][n];
				var previous = i;
				console.log('=== INIT ' + i + ' ' + current);
				while(iterate < 100 && i != current){
					console.log('+++ ADDING: ' + current + ' prev: ' + previous + ' from CW ARRAY ' + current);
					console.log(allNodesClockwise[current]);

					aFace.push(current);
					var previousBackup = previous;
					previous = current;
					// console.log('   algorithm ' + allNodesClockwise[ current ] + ' prev: ' + previousBackup);
					current = this.getNextElementToItemInArray( allNodesClockwise[ current ], previousBackup );
					console.log('NEXT: ' + current + ' prev: ' + previous );
					if(current == undefined) iterate = 100;
					if(aFace.length > 4) iterate = 100;

					iterate++;
				}
				if(iterate < 99){
					console.log('!! adding face');
					console.log(aFace);
					this.faces.push( aFace );
				} else{
					console.log('!! SKIPPING FACE');
				}
			}
		}
		console.log('FACES: not cleaned up');
		console.log(this.faces);
		var i = 0;
		while(i < this.faces.length-1){
			var j = 0;
			while(j < this.faces.length){
				if(this.areFacesEquivalent(i, j)){
					this.faces.splice(j, 1);
				}
				j++;
			}
			i++;
		}
		console.log('FACES: clean');
		console.log(this.faces);
	}

	areFacesEquivalent(faceIndex1, faceIndex2){
		if(this.faces[faceIndex1].length != this.faces[faceIndex2].length) return false;
		for(var i = 0; i < this.faces[faceIndex1].length; i++){
			var found = false;
			for(var j = 0; j < this.faces[faceIndex2].length; j++){
				if(this.faces[faceIndex1][i] == this.faces[faceIndex2][j]) found = true;
			}
			if(found == false) return false;
		}
		return true;
	}

	getVertexIndexAt(x, y){  // float float
		for(var i = 0; i < this.nodes.length; i++){
			if(this.verticesEquivalent(this.nodes[i].x, this.nodes[i].y, x, y, USER_TAP_EPSILON)){
				return i;
			}
		}
		return undefined;
	}


	isCornerNode(x, y){
		// var E = VERTEX_DUPLICATE_EPSILON;
		// if( y < E ) return 1;
		// if( x > 1.0 - E ) return 2;
		// if( y > 1.0 - E ) return 3;
		// if( x < E ) return 4;
		// return undefined;
	}

	isBoundaryNode(x, y){
		var E = .1;//VERTEX_DUPLICATE_EPSILON;
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
			if( this.verticesEquivalent(this.nodes[i], v, VERTEX_DUPLICATE_EPSILON) ){
				intersect.x = this.nodes[i].x;
				intersect.y = this.nodes[i].y;
				intersect.z = this.nodes[i].z;
				return true;
			}
		}

		for(var i = 0; i < this.edges.length; i++){
			var a = this.nodes[ this.edges[i].a ];
			var b = this.nodes[ this.edges[i].b ];
			var crossproduct = (v.y - a.y) * (b.x - a.x) - (v.x - a.x) * (b.y - a.y);
			if(Math.abs(crossproduct) < VERTEX_DUPLICATE_EPSILON){
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
			anglesBetweenVertices.push_back( diff );
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
			console.log(' ' + i + ': (' + this.nodes[i].x + ', ' + this.nodes[i].y + ', ' + this.nodes[i].z + ')');
		}
		console.log("\nEdges:\n" + this.edges.length + ")");
		for(var i = 0; i < this.edges.length; i++){
			console.log(' ' + i + ': (' + this.edges[i].a + ' -- ' + this.edges[i].b + ')');
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

}