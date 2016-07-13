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

template <class T> class Graph : public ofBaseApp{
    
//private:
public:
    // creases are lines (edges) with endpoints (v1, v2) which are
    //   indices pointing to vertices in the vertices array
    vector <Edge> edges;
    vector <T> nodes;
    
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
	unsigned int numNodes();
	unsigned int numEdges();
	    
    bool edgeAdjacent(unsigned int edgeIndex1, unsigned int edgeIndex2);
	
protected:
	
	bool mergeNodes(unsigned int vIndex1, unsigned int vIndex2);

};

#include "graph.tpp"


#endif
