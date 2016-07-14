// for purposes of modeling origami crease patterns
//
// this is a planar graph data structure containing edges and vertices
// vertices are points in 3D space {x,y,z}  (z is 0 for now)
//
// at one point, the geometry was made to easily incorporate into OpenGL calls

#ifndef planarGraph_h
#define planarGraph_h

#include "graph.h"

#define USER_TAP_EPSILON 0.01
#define VERTEX_DUPLICATE_EPSILON 0.003


// this graph represents an origami crease pattern
//    with creases (edges) defined by their endpoints (vertices)
//    for now, coordinate space is a square (0,0) (0,1) (1,1) (1,0)

typedef struct Vertex{
	double x, y, z;
} Vertex;


bool onSegment(Vertex p, Vertex q, Vertex r);
int orientation(Vertex p, Vertex q, Vertex r);
bool doIntersect(Vertex a1, Vertex a2, Vertex b1, Vertex b2);


class PlanarGraph : public Graph<Vertex>{
public:
	
	// creases are lines (edges) with endpoints (v1, v2) which are
	//   indices pointing to vertices in the vertices array
	vector<Vertex> *vertices;

	PlanarGraph();
	
	// remove all duplicate vertices
	void cleanup();
	
	// add a crease line start (x,y) to finish (x,y). scale from 0 to 1
	void addEdgeWithVertices(float x1, float y1, float x2, float y2);

	
	// needs to be a set, has duplicates
	vector<unsigned int> edgesIntersectingEdges();
	
	
	// rotate a vertex (index) around another vertex (indexOrigin)
	void rotateEdge(int index, int indexOrigin, float angle);

	
	// input based on the X Y plane
	//   returns true if one exists
	bool getVertexIndexAt(float x, float y, unsigned int *index);

	
	bool isValid();
	
	bool invalidEdgeCrossings();
	bool edgeIsValid(unsigned int edgeIndex);
	
	
	// technically includes "vertex lies on a vertex"
	//   returns the point of intersection (as an argument)
	bool vertexLiesOnEdge(unsigned int vIndex, Vertex *intersect);
	bool vertexLiesOnEdge(Vertex v, Vertex *intersect);
	
	bool edgeCrossesEdge(unsigned int index1, unsigned int index2);
	bool edgeCrossesEdge(Vertex a1, Vertex a2, Vertex b1, Vertex b2);
	
	
	void log();
	
	// tidies up the inside of the arrays
	// organizes the vertices by position in space, edges by vertices
//	void defragment();
	
protected:
	
	bool hVerticesEqual(float x1, float y1, float x2, float y2, float epsilon);
	bool hVerticesEqual(Vertex v1, Vertex v2, float epsilon);
	
	void findAndReplaceInstancesEdge(int *newVertexIndexMapping);

	// find all the vertices that are connected argument vertex by edges
	vector<unsigned int> connectedVertexIndices(unsigned int vIndex);
	
	// find all the edges which join to the input vertex
	vector<unsigned int> connectingEdgeIndices(unsigned int vIndex);
	
	// same as above, sorted radially by neighbor
	vector<unsigned int> connectingVertexIndicesSortedRadially(unsigned int vIndex);
	
	// the angles in radians corresponding to the above list
	vector<float> connectingVertexInteriorAngles(unsigned int vIndex, vector<unsigned int> connectedVertexIndicesSorted);

};

#endif /* planarGraph_h */
