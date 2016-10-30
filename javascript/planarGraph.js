// for purposes of modeling origami crease patterns
//
// this is a planar graph data structure containing edges and vertices
// vertices are points in 3D space {x,y,z}  (z is 0 for now)


var USER_TAP_EPSILON = 0.01;
var VERTEX_DUPLICATE_EPSILON = 0.003;

// this graph represents an origami crease pattern
//    with creases (edges) defined by their endpoints (vertices)

var PlanarGraph = function(){
	// creases are lines (edges) with endpoints v1, v2 (indices in vertex array)

	// add to graph
	function addEdgeWithVertices(a, b);
	function addEdgeWithVertices(x1, y1, x2, y2);
	function addEdgeFromVertex(existingIndex, newVertex);
	function addEdgeFromVertex(existingIndex, newX, newY);
	// radial coordinates
	function addEdgeRadiallyFromVertex(existingIndex, angle, distance);

	// graph validity
	function cleanup();  // executes the following:
		function removeDuplicateVertices();

	function isValid();  // 1) no edge crossings, 2) more later...

	function edgeCrossesEdge(index1, index2);
	function edgeCrossesEdge(a1, a2, b1, b2);


	// needs to be a set, has duplicates
	function edgesIntersectingEdges();


	// rotate a vertex (index) around another vertex (originVertexIndex)
	function rotateVertex(int vertexIndex, int originVertexIndex, angleRadians);


	// input based on the X Y plane
	//   returns true if one exists
	function getVertexIndexAt(x, y, *index);


	function invalidEdgeCrossings();
	function edgeIsValid(edgeIndex);


	// technically includes "vertex lies on a vertex"
	//   returns the point of intersection (as an argument)
	function vertexLiesOnEdge(vIndex, *intersect);
	function vertexLiesOnEdge(v, *intersect);


	function log();

	// tidies up the inside of the arrays
	// organizes the vertices by position in space, edges by vertices
//	void defragment();

	// find all the vertices that are connected argument vertex by edges
	function connectedVertexIndices(vIndex);

	// find all the edges which join to the input vertex
	function connectingEdgeIndices(vIndex);

	// same as above, sorted radially by neighbor
	function connectingVertexIndicesSortedRadially(vIndex);

	// the angles in radians corresponding to the above list
	function connectingVertexInteriorAngles(vIndex, connectedVertexIndicesSorted);

// protected:

	function hVerticesEqual(x1, y1, x2, y2, epsilon);
	function hVerticesEqual(v1, v2, epsilon);

	function findAndReplaceInstancesEdge(*newVertexIndexMapping);

};

bool onSegment(Vertex a, Vertex point, Vertex b);
int orientation(Vertex p, Vertex q, Vertex r);
bool doIntersect(Vertex p1, Vertex q1, Vertex p2, Vertex q2);

PlanarGraph.prototype.addEdgeWithVertices = function(x1, y1, x2, y2){  // floats
	var a = {'x':x1, 'y':y1};
	var b = {'x':x2, 'y':y2};
	var vIndex1 = this.nodes.length;
	var vIndex2 = this.nodes.length+1;
	var e1 = {'a':vIndex1, 'b':vIndex2};

	// add vertices
	this.nodes.push(a);
	this.nodes.push(b);

	// add edge
	this.edges.push(e1);
}

PlanarGraph.prototype.addEdgeFromVertex = function(existingIndex, newX, newY){ // uint, floats
	var newVertex = {'x':newX, 'y':newY};
	var newVertexIndex = this.nodes.length;
	var e1 = {'a':existingIndex, 'b':newVertexIndex};

	// add vertices
	this.nodes.push(newVertex);

	// add edge
	this.edges.push(e1);
}

PlanarGraph.prototype.addEdgeRadiallyFromVertex = function(existingIndex, angle, distance){ // uint, floats
	var newX = this.nodes[existingIndex].x + Math.cos(angle) * distance;
	var newY = this.nodes[existingIndex].y + Math.sin(angle) * distance;
	this.addEdgeFromVertex(existingIndex, newX, newY);
}

PlanarGraph.prototype.cleanup = function(){
	this.removeDuplicateVertices();
}

PlanarGraph.prototype.removeDuplicateVertices = function(){
	var i = 0;
	while(i < this.nodes.length-1){
		var j = i+1;
		while(j < this.nodes.length){
			var didRemove = false;
			// do the points overlap?
			if ( this.hVerticesEqual(this.nodes[i], this.nodes[j], VERTEX_DUPLICATE_EPSILON) ){
				didRemove = this.mergeNodes(i, j);
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

PlanarGraph.prototype.isValid = function(){
	// var invalid = false;
	// invalid |= invalidEdgeCrossings();
	// // TODO: more here
	// return !invalid;
}

PlanarGraph.prototype.edgeCrossesEdge = function(index1, index2){  // edge indices
	// shares vertices
	if(this.edgesAdjacent(index1, index2)){
		return false;
	}
	// edges overlap
	return this.doIntersect(this.nodes[ this.edges[index1].a ], this.nodes[ this.edges[index1].b ],
	                        this.nodes[ this.edges[index2].a ], this.nodes[ this.edges[index2].b ] );
}
// PlanarGraph.prototype.edgeCrossesEdge = function(a1, a2, b1, b2){ // Vertex type
// 	// shares vertices
// 	if(this.hVerticesEqual(a1, b1, VERTEX_DUPLICATE_EPSILON) ||
// 	   this.hVerticesEqual(a1, b2, VERTEX_DUPLICATE_EPSILON) ||
// 	   this.hVerticesEqual(a2, b1, VERTEX_DUPLICATE_EPSILON) ||
// 	   this.hVerticesEqual(a2, b2, VERTEX_DUPLICATE_EPSILON) ){
// 		return false;
// 	}
// 	// edges overlap
// 	return this.doIntersect(a1, a2, b1, b2);
// }

// quick and easy, use a square bounding box
PlanarGraph.prototype.hVerticesEqual = function(v1, v2, float epsilon){  // Vertex type
	return (v1.x - epsilon < v2.x && v1.x + epsilon > v2.x &&
			v1.y - epsilon < v2.y && v1.y + epsilon > v2.y);
}
// PlanarGraph.prototype.hVerticesEqual = function(x1, y1, x2, y2, float epsilon){  // float type
// 	return (x1 - epsilon < x2 && x1 + epsilon > x2 &&
// 			y1 - epsilon < y2 && y1 + epsilon > y2);
// }


PlanarGraph.prototype.edgesIntersectingEdges = function(){
	var invalidEdges = [];  // type uint
	for(var i = 0; i < this.edges.length - 1; i++){
		for(var j = i+1; j < this.edges.length; j++){
			var one = !this.edgesAdjacent(i, j);
			var two = this.doIntersect(this.nodes[ this.edges[i].a ],
								       this.nodes[ this.edges[i].b ],
								       this.nodes[ this.edges[j].a ],
								       this.nodes[ this.edges[j].b ]);
			if(one && two){
//				print("LISTEN TO LAST ONE (%d:%d):\n   +(%f, %f) (%f, %f)\n   +(%f, %f) (%f, %f)\n", one, two,
//					   this.nodes[ this.edges[i].a ].x, this.nodes[ this.edges[i].a ].y,
//					   this.nodes[ this.edges[i].b ].x, this.nodes[ this.edges[i].b ].y,
//					   this.nodes[ this.edges[j].a ].x, this.nodes[ this.edges[j].a ].y,
//					   this.nodes[ this.edges[j].b ].x, this.nodes[ this.edges[j].b ].y);
// true: this.edges i and j overlap
				invalidEdges.push(i);
				invalidEdges.push(j);
			}
		}
	}
	return invalidEdges;
}

PlanarGraph.prototype.invalidEdgeCrossings = function(){
	for(var i = 0; i < this.edges.length; i++){
		for(var j = 0; j < this.edges.length; j++){
			if(i != j){
				var vertex[4];
				vertex[0] = this.nodes[ this.edges[i].a ];
				vertex[1] = this.nodes[ this.edges[i].b ];
				vertex[2] = this.nodes[ this.edges[j].a ];
				vertex[3] = this.nodes[ this.edges[j].b ];
				if(this.doIntersect(vertex[0], vertex[1], vertex[2], vertex[3])){
					return true;
				}
			}
		}
	}
	return false;
}

PlanarGraph.prototype.edgeIsValid = function(edgeIndex){  // uint
	for(var i = 0; i < this.edges.length; i++){
		if(edgeIndex != i){
			var vertex[4];
			vertex[0] = this.nodes[ this.edges[edgeIndex].a ];
			vertex[1] = this.nodes[ this.edges[edgeIndex].b ];
			vertex[2] = this.nodes[ this.edges[i].a ];
			vertex[3] = this.nodes[ this.edges[i].b ];
			if(this.doIntersect(vertex[0], vertex[1], vertex[2], vertex[3])){
				return false;
			}
		}
	}
	return true;
}

PlanarGraph.prototype.findAndReplaceInstancesEdge = function(newVertexIndexMapping){  // int array
	for(int i = 0; i < this.edges.length; i++){
		if(newVertexIndexMapping[ this.edges[i].a ] != -1){
			this.edges[i].a = newVertexIndexMapping[ this.edges[i].a ];
		}
		if(newVertexIndexMapping[ this.edges[i].b ] != -1){
			this.edges[i].b = newVertexIndexMapping[ this.edges[i].b ];
		}
	}
}

PlanarGraph.prototype.getVertexIndexAt = function(x, y, index){  // float float uint*
	for(var i = 0; i < this.nodes.length; i++){
		if(this.hVerticesEqual(this.nodes[i].x, this.nodes[i].y, x, y, USER_TAP_EPSILON)){
			*index = i;
			return true;
		}
	}
	return false;
}



PlanarGraph.prototype.vertexLiesOnEdge = function(vIndex, intersect){  // uint, Vertex
	var v = this.nodes[vIndex];
	return this.vertexLiesOnEdge(v, intersect);
}

PlanarGraph.prototype.vertexLiesOnEdge = function(v, intersect){  // Vertex, Vertex*
	// including a margin of error, bounding area around vertex

	// first check if point lies on end points
	for(var i = 0; i < this.nodes.length; i++){
		if( this.hVerticesEqual(this.nodes[i], v, VERTEX_DUPLICATE_EPSILON) ){
			intersect->x = this.nodes[i].x;
			intersect->y = this.nodes[i].y;
			intersect->z = this.nodes[i].z;
			return true;
		}
	}

	for(var i = 0; i < this.edges.length; i++){
		var a = this.nodes[ this.edges[i].a ];
		var b = this.nodes[ this.edges[i].b ];
		float crossproduct = (v.y - a.y) * (b.x - a.x) - (v.x - a.x) * (b.y - a.y);
		if(Math.abs(crossproduct) < VERTEX_DUPLICATE_EPSILON){
			// cross product is essentially zero, point lies along the (infinite) line
			// now check if it is between the two points
			float dotproduct = (v.x - a.x) * (b.x - a.x) + (v.y - a.y) * (b.y - a.y);
			// dot product must be between 0 and the squared length of the line segment
			if(dotproduct > 0){
				float lengthSquared = Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2);
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

PlanarGraph.prototype.connectedVertexIndices = function(vIndex){  // uint
	var indices = []; // uint
	// iterate over all edges
	for(var i = 0; i < this.edges.length; i++){
		// if we find our index, add the vertex on the other end of the edge
		if(this.edges[i].a == vIndex) {
			indices.push(this.edges[i].b);
		} if(this.edges[i].b == vIndex) {
			indices.push(this.edges[i].a);
		}
	}
	return indices;
}

PlanarGraph.prototype.connectingEdgeIndices = function(vIndex){  // uint
	var indices = []; // uint
	// iterate over all edges
	for(var i = 0; i < edges.length; i++){
		// if we find our vertex, add the edge
		if(this.edges[i].a == vIndex || this.edges[i].b == vIndex){
			indices.push(i);
		}
	}
	return indices;
}
/*
PlanarGraph.prototype.connectingVertexIndicesSortedRadially = function(vIndex){  // uint
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

PlanarGraph.prototype.connectingVertexInteriorAngles = function(vIndex, connectedVertexIndicesSorted){ // uint, uint array
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

PlanarGraph.prototype.log = function(){
	console.log("Vertices:");
	for(var i = 0; i < nodes.length; i++){
		console.log(' ' + i + ': (' + nodes[i].x + ', ' + nodes[i].y + ', ' + nodes[i].z + ')');
	}
	console.log("\nEdges:\n");
	for(var i = 0; i < edges.length; i++){
		console.log(' ' + i + ': (' + edges[i].a + ' -- ' + edges[i].b + ')');
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
PlanarGraph.prototype.onSegment = function(a, point, b){  // Vertices
	if (point.x <= Math.max(a.x, b.x) && point.x >= Math.min(a.x, b.x) &&
		point.y <= Math.max(a.y, b.y) && point.y >= Math.min(a.y, b.y))
		return true;
	return false;
}


// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are collinear
// 1 --> Clockwise
// 2 --> Counterclockwise
PlanarGraph.prototype.orientation = function(p, q, r){  // Vertices
	// See http://www.geeksforgeeks.org/orientation-3-ordered-points/
	// for details of below formula.
	var val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
	if (Math.abs(val) <= .00001) return 0;  // collinear
	return (val > 0)? 1: 2; // clock or counterclock wise
}

// The main function that returns true if line segment 'p1q1'
// and 'p2q2' intersect.
PlanarGraph.prototype.doIntersect = function(p1, q1, p2, q2){ // Vertices
	// Find the four orientations needed for general and
	// special cases
	var o1 = this.orientation(p1, q1, p2);
	var o2 = this.orientation(p1, q1, q2);
	var o3 = this.orientation(p2, q2, p1);
	var o4 = this.orientation(p2, q2, q1);

	// General case
	if (o1 != o2 && o3 != o4){
		// 0 1 0 2
		// 0 2 0 1
//		printf("general %d %d %d %d\n", o1, o2, o3, o4);
		return true;
	}
	// Special Cases
	// p1, q1 and p2 are colinear and p2 lies on segment p1q1
	if (o1 == 0 && this.onSegment(p1, p2, q1)) {
//		printf("one\n");
		return true;
	}

	// p1, q1 and p2 are colinear and q2 lies on segment p1q1
	if (o2 == 0 && this.onSegment(p1, q2, q1)){
//		printf("two\n");
		return true;
	}

	// p2, q2 and p1 are colinear and p1 lies on segment p2q2
	if (o3 == 0 && this.onSegment(p2, p1, q2)){
//		printf("three\n");
		return true;
	}

	// p2, q2 and q1 are colinear and q1 lies on segment p2q2
	if (o4 == 0 && this.onSegment(p2, q1, q2)){
//		printf("four\n");
		return true;
	}

	return false; // Doesn't fall in any of the above cases
}
