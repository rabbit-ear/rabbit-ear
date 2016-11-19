// for purposes of modeling origami crease patterns
//
// this is a planar graph data structure containing edges and vertices
// vertices are points in 3D space {x,y,z}  (z is 0 for now)


var USER_TAP_EPSILON = 0.01;
var VERTEX_DUPLICATE_EPSILON = 0.003;

// this graph represents an origami crease pattern
//    with creases (edges) defined by their endpoints (vertices)

// creases are lines (edges) with endpoints v1, v2 (indices in vertex array)
class PlanarGraph extends Graph{
	constructor(){
		super();
	}

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

	cleanup(){
		super.cleanup();
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

	edgesIntersect(e1, e2){
		// if true - returns {x,y} location of intersection
		if(this.edgesAdjacent(e1, e2)){
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

	// quick and easy, use a square bounding box
	verticesEquivalent(v1, v2, epsilon){  // Vertex type
		return (v1.x - epsilon < v2.x && v1.x + epsilon > v2.x &&
				v1.y - epsilon < v2.y && v1.y + epsilon > v2.y);
	}
	// verticesEquivalent(x1, y1, x2, y2, float epsilon){  // float type
	// 	return (x1 - epsilon < x2 && x1 + epsilon > x2 &&
	// 			y1 - epsilon < y2 && y1 + epsilon > y2);
	// }


	getAllEdgeIntersections(){
		var intersections = [];
		// for(var i = 0; i < this.edges.length; i++){
		// 	for(var j = 0; j < this.edges.length; j++){
		for(var i = 0; i < this.edges.length - 1; i++){
			for(var j = i+1; j < this.edges.length; j++){
				// if(i != j){
					var intersect = this.edgesIntersect(i, j);
					if(intersect != undefined){
						intersections.push(intersect);
					}
				// }
			}
		}
		return intersections;
	}

	getAllEdgeIntersectionsDetailed(){
		var edgesIntersecting = [];  // type uint
		for(var i = 0; i < this.edges.length - 1; i++){
			for(var j = i+1; j < this.edges.length; j++){
				var intersection = this.edgesIntersect(i, j);
				if(intersection != undefined){
					edgesIntersecting.push( {'a':i,
					                         'b':j,
					                'edge1NodeA':this.edges[i].a,
					                'edge1NodeB':this.edges[i].b,
					                'edge2NodeA':this.edges[j].a,
					                'edge2NodeB':this.edges[j].b,
					                  'location':intersection} );
				}
			}
		}
		return edgesIntersecting;
	}


	splitAtIntersections(){
		var edgesIntersecting = edgesIntersectingEdges();
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
		// do not call this directly, call one of the doEdgesIntersect functions

		var s02 = {'x':0, 'y':0};
		var s10 = {'x':0, 'y':0};
		var s32 = {'x':0, 'y':0};
		s10.x = p1.x - p0.x;
		s10.y = p1.y - p0.y;
		s32.x = p3.x - p2.x;
		s32.y = p3.y - p2.y;

		var denom = s10.x * s32.y - s32.x * s10.y;
		if (denom == 0)
			return undefined; // Collinear
		var denomPositive = false;
		if(denom > 0) 
			denomPositive = true;

		s02.x = p0.x - p2.x;
		s02.y = p0.y - p2.y;
		var s_numer = s10.x * s02.y - s10.y * s02.x;
		if ((s_numer < 0) == denomPositive)
			return undefined; // No collision

		var t_numer = s32.x * s02.y - s32.y * s02.x;
		if ((t_numer < 0) == denomPositive)
			return undefined; // No collision

		if (((s_numer > denom) == denomPositive) || ((t_numer > denom) == denomPositive))
			return undefined; // No collision
		// Collision detected
		var t = t_numer / denom;
		var i = {'x':(p0.x + (t * s10.x)), 'y':(p0.y + (t * s10.y))};
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

	kiteBase(){
		this.addEdgeWithVertices(1, 0, 0, 1);
		this.addEdgeWithVertices(0, 1, 1, .58578);
		this.addEdgeWithVertices(0, 1, .41421, 0);
	}
	fishBase(){
		this.addEdgeWithVertices(1, 0, 0, 1);
		this.addEdgeWithVertices(0, 1, .70711, .70711);
		this.addEdgeWithVertices(0, 1, .29288, .2929);
		this.addEdgeWithVertices(1, 0, .29289, .2929);
		this.addEdgeWithVertices(1, 0, .7071, .7071);
		this.addEdgeWithVertices(.29289, .2929, 0, 0);
		this.addEdgeWithVertices(.70711, .7071, 1, 1);
		this.addEdgeWithVertices(.70711, .70711, 1, .70711);
		this.addEdgeWithVertices(.29288, .2929, .29288, 0);
		this.cleanup();
	}
	birdBase(){
		this.addEdgeWithVertices(.35355, .64645, 0, 1);
		this.addEdgeWithVertices(0.5, 0.5, .35355, .64645);
		this.addEdgeWithVertices(.64645, .35356, 0.5, 0.5);
		this.addEdgeWithVertices(1, 0, .64645, .35356);
		this.addEdgeWithVertices(0, 1, 0.5, .79289);
		this.addEdgeWithVertices(0, 1, .2071, 0.5);
		this.addEdgeWithVertices(1, 0, 0.5, .20711);
		this.addEdgeWithVertices(1, 0, .79289, 0.5);
		this.addEdgeWithVertices(.64643, .64643, 1, 1);
		this.addEdgeWithVertices(0.5, 0.5, .64643, .64643);
		this.addEdgeWithVertices(.35353, .35353, 0.5, 0.5);
		this.addEdgeWithVertices(0, 0, .35353, .35353);
		this.addEdgeWithVertices(1, 1, .79291, 0.5);
		this.addEdgeWithVertices(1, 1, 0.5, .79291);
		this.addEdgeWithVertices(0, 0, .20709, 0.5);
		this.addEdgeWithVertices(0, 0, 0.5, .2071);
		this.addEdgeWithVertices(.35355, .35354, .2071, 0.5);
		this.addEdgeWithVertices(0.5, .20711, .35355, .35354);
		this.addEdgeWithVertices(.35355, .64645, 0.5, .7929);
		this.addEdgeWithVertices(.2071, 0.5, .35355, .64645);
		this.addEdgeWithVertices(.64645, .64645, .79289, 0.5);
		this.addEdgeWithVertices(0.5, .7929, .64645, .64645);
		this.addEdgeWithVertices(.64645, .35356, 0.5, .20711);
		this.addEdgeWithVertices(.79289, 0.5, .64645, .35356);
		this.addEdgeWithVertices(0.5, 0.5, 0.5, .79289);
		this.addEdgeWithVertices(0.5, .20711, 0.5, 0.5);
		this.addEdgeWithVertices(0.5, 0.5, .79289, 0.5);
		this.addEdgeWithVertices(.2071, 0.5, 0.5, 0.5);
		this.addEdgeWithVertices(0.5, .20711, 0.5, 0);
		this.addEdgeWithVertices(.79289, 0.5, 1, 0.5);
		this.addEdgeWithVertices(0.5, .79289, 0.5, 1);
		this.addEdgeWithVertices(.2071, 0.5, 0, 0.5);
	}
	frogBase(){
		this.addEdgeWithVertices(0, 0, .14646, .35353);
		this.addEdgeWithVertices(0, 0, .35353, .14646);
		this.addEdgeWithVertices(.14646, .35353, 0.5, 0.5);
		this.addEdgeWithVertices(0.5, 0.5, .35353, .14646);
		this.addEdgeWithVertices(.14646, .35353, .14646, 0.5);
		this.addEdgeWithVertices(0, 0.5, .14646, 0.5);
		this.addEdgeWithVertices(0.5, 0.5, 0.5, .14644);
		this.addEdgeWithVertices(0.5, .14644, 0.5, 0);
		this.addEdgeWithVertices(0.5, 0, .35353, .14646);
		this.addEdgeWithVertices(.35353, .14646, 0.5, .14646);
		this.addEdgeWithVertices(.14646, .35354, 0, 0.5);
		this.addEdgeWithVertices(.14646, .35354, .25, .25);
		this.addEdgeWithVertices(.25, .25, .35353, .14646);
		this.addEdgeWithVertices(0, 1, .35352, .85354);
		this.addEdgeWithVertices(0, 1, .14646, .64646);
		this.addEdgeWithVertices(.35352, .85354, 0.5, 0.5);
		this.addEdgeWithVertices(0.5, 0.5, .14646, .64646);
		this.addEdgeWithVertices(.35352, .85354, 0.5, .85354);
		this.addEdgeWithVertices(0.5, 1, 0.5, .85354);
		this.addEdgeWithVertices(0.5, 0.5, 0.5, .85354);
		this.addEdgeWithVertices(0.5, 0.5, .14643, 0.5);
		this.addEdgeWithVertices(0, 0.5, .14646, .64646);
		this.addEdgeWithVertices(.14646, .64646, .14646, 0.5);
		this.addEdgeWithVertices(.35353, .85354, 0.5, 1);
		this.addEdgeWithVertices(.35353, .85354, .25, .75);
		this.addEdgeWithVertices(.25, .75, .14646, .64646);
		this.addEdgeWithVertices(1, 0, .85352, .35353);
		this.addEdgeWithVertices(1, 0, .64645, .14646);
		this.addEdgeWithVertices(.85352, .35353, 0.5, 0.5);
		this.addEdgeWithVertices(0.5, 0.5, .64645, .14646);
		this.addEdgeWithVertices(.85352, .35353, .85352, 0.5);
		this.addEdgeWithVertices(1, 0.5, .85352, 0.5);
		this.addEdgeWithVertices(0.5, 0, .64645, .14646);
		this.addEdgeWithVertices(.64645, .14646, 0.5, .14646);
		this.addEdgeWithVertices(.8535, .35354, 1, 0.5);
		this.addEdgeWithVertices(.8535, .35354, .75, .25);
		this.addEdgeWithVertices(.75, .25, .64645, .14646);
		this.addEdgeWithVertices(1, 1, .64645, .85354);
		this.addEdgeWithVertices(1, 1, .85352, .64646);
		this.addEdgeWithVertices(.64645, .85354, 0.5, 0.5);
		this.addEdgeWithVertices(0.5, 0.5, .85352, .64646);
		this.addEdgeWithVertices(.64645, .85354, 0.5, .85354);
		this.addEdgeWithVertices(0.5, 0.5, .85354, 0.5);
		this.addEdgeWithVertices(1, 0.5, .85352, .64646);
		this.addEdgeWithVertices(.85352, .64646, .85352, 0.5);
		this.addEdgeWithVertices(.64645, .85354, 0.5, 1);
		this.addEdgeWithVertices(.64645, .85354, .75, .75);
		this.addEdgeWithVertices(.75, .75, .85352, .64646);
		this.addEdgeWithVertices(.35353, .14646, .35353, 0);
		this.addEdgeWithVertices(.64645, .14646, .64645, 0);
		this.addEdgeWithVertices(.85352, .35353, 1, .35353);
		this.addEdgeWithVertices(.85352, .64646, 1, .64646);
		this.addEdgeWithVertices(.64645, .85354, .64645, 1);
		this.addEdgeWithVertices(.35352, .85354, .35352, 1);
		this.addEdgeWithVertices(.14646, .64646, 0, .64646);
		this.addEdgeWithVertices(.14646, .35353, 0, .35353);
		this.addEdgeWithVertices(0.5, 0.5, .25, .25);
		this.addEdgeWithVertices(0.5, 0.5, .75, .25);
		this.addEdgeWithVertices(0.5, 0.5, .75, .75);
		this.addEdgeWithVertices(0.5, 0.5, .25, .75);
		this.addEdgeWithVertices(.25, .75, 0, 1);
		this.addEdgeWithVertices(.25, .25, 0, 0);
		this.addEdgeWithVertices(.75, .25, 1, 0);
		this.addEdgeWithVertices(.75, .75, 1, 1);
	}


}