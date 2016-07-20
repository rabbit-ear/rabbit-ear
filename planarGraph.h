// for purposes of modeling origami crease patterns
//
// this is a planar graph data structure containing edges and vertices
// vertices are points in 3D space {x,y,z}  (z is 0 for now)

#ifndef planarGraph_h
#define planarGraph_h

#include "graph.h"

#define USER_TAP_EPSILON 0.01
#define VERTEX_DUPLICATE_EPSILON 0.003

// this graph represents an origami crease pattern
//    with creases (edges) defined by their endpoints (vertices)

typedef struct Vertex{
	float x, y, z;
} Vertex;


class PlanarGraph : public Graph<Vertex>{
public:

	// creases are lines (edges) with endpoints v1, v2 (indices in vertex array)
	vector<Vertex> *vertices;  // another name for (and a pointer to) "nodes"

	PlanarGraph();

	// add to graph
	void addEdgeWithVertices(float x1, float y1, float x2, float y2);
	void addEdgeWithVertices(Vertex a, Vertex b);

	// graph validity
	void cleanup();  // remove all duplicate vertices

	bool isValid();  // 1) no edge crossings, 2) more later...

	bool edgeCrossesEdge(unsigned short index1, unsigned short index2);
	bool edgeCrossesEdge(Vertex a1, Vertex a2, Vertex b1, Vertex b2);


	// needs to be a set, has duplicates
	vector<unsigned short> edgesIntersectingEdges();


	// rotate a vertex (index) around another vertex (indexOrigin)
	void rotateEdge(int index, int indexOrigin, float angle);


	// input based on the X Y plane
	//   returns true if one exists
	bool getVertexIndexAt(float x, float y, unsigned short *index);


	bool invalidEdgeCrossings();
	bool edgeIsValid(unsigned short edgeIndex);


	// technically includes "vertex lies on a vertex"
	//   returns the point of intersection (as an argument)
	bool vertexLiesOnEdge(unsigned short vIndex, Vertex *intersect);
	bool vertexLiesOnEdge(Vertex v, Vertex *intersect);


	void log();

	// tidies up the inside of the arrays
	// organizes the vertices by position in space, edges by vertices
//	void defragment();

	// find all the vertices that are connected argument vertex by edges
	vector<unsigned int> connectedVertexIndices(unsigned int vIndex);

	// find all the edges which join to the input vertex
	vector<unsigned int> connectingEdgeIndices(unsigned int vIndex);

	// same as above, sorted radially by neighbor
	vector<unsigned int> connectingVertexIndicesSortedRadially(unsigned int vIndex);

	// the angles in radians corresponding to the above list
	vector<float> connectingVertexInteriorAngles(unsigned int vIndex, vector<unsigned int> connectedVertexIndicesSorted);

protected:

	bool hVerticesEqual(float x1, float y1, float x2, float y2, float epsilon);
	bool hVerticesEqual(Vertex v1, Vertex v2, float epsilon);

	void findAndReplaceInstancesEdge(int *newVertexIndexMapping);

};

#endif /* planarGraph_h */
