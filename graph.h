#ifndef origami_graph_h
#define origami_graph_h

#include "ofMain.h"


typedef struct Vertex{
    double x, y, z;
} Vertex;
typedef struct Edge {
    unsigned short v1, v2;
} Edge;


bool onSegment(Vertex p, Vertex q, Vertex r);
int orientation(Vertex p, Vertex q, Vertex r);
bool doIntersect(Vertex a1, Vertex a2, Vertex b1, Vertex b2);


#define USER_SETTING_GET_VERTEX_RANGE 0.01
#define EPSILON 0.003

// this graph represents an origami crease pattern
//    with creases (edges) defined by their endpoints (vertices)
//    for now, coordinate space is a square (0,0) (0,1) (1,1) (1,0)

class Graph : public ofBaseApp{
    
//private:
public:
    // creases are lines (edges) with endpoints (v1, v2) which are
    //   indices pointing to vertices in the vertices array
    vector <Edge> edges;
    vector <Vertex> vertices;
    
public:
  
    // constructors
	Graph();
//    Graph( int initial );
	
    // removes all content (edges and vertices)
    void clear();
    
    // tidies up the inside of the arrays
    // organizes the vertices by position in space, edges by vertices
//    void defragment();
	
	void log();
	
	// getters
	unsigned int numVertices();
	unsigned int numEdges();
	
    // add a crease line start (x,y) to finish (x,y). scale from 0 to 1
    void addEdgeWithVertices(float x1, float y1, float x2, float y2);
    
    bool edgeAdjacent(unsigned int edgeIndex1, unsigned int edgeIndex2);
	
protected:
	
	bool mergeVertices(unsigned int vIndex1, unsigned int vIndex2);

};

#endif
