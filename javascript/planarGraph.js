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
	var *vertices;  // another name for (and a pointer to) "nodes"

	PlanarGraph();

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
