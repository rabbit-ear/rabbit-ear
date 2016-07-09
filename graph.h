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
    Graph( int initial );
    
    // removes all content (edges and vertices)
    void clear();

    // remove all duplicate vertices
    void cleanup();
    
    // tidies up the inside of the arrays
    // organizes the vertices by position in space, edges by vertices
//    void defragment();
    
    // add a crease line start (x,y) to finish (x,y). scale from 0 to 1
    void addEdgeWithVertices(float x1, float y1, float x2, float y2);
    
    bool edgeAdjacent(unsigned int edgeIndex1, unsigned int edgeIndex2);
    
    // needs to be a set, has duplicates
    vector<unsigned int> edgesIntersectingEdges();

    // find all the vertices that are connected argument vertex by edges
    vector<unsigned int> connectedVertexIndices(unsigned int vIndex);
    
    // find all the edges which join to the input vertex
    vector<unsigned int> connectingEdgeIndices(unsigned int vIndex);
    
    // same as above, sorted radially by neighbor
    vector<unsigned int> connectingVertexIndicesSortedRadially(unsigned int vIndex);
    
    // the angles in radians corresponding to the above list
    vector<float> connectingVertexInteriorAngles(unsigned int vIndex, vector<unsigned int> connectedVertexIndicesSorted);
    
    // rotate a vertex (index) around another vertex (indexOrigin)
    void rotateEdge(int index, int indexOrigin, float angle);
    
    void log();
    
    // getters
    unsigned int numVertices();
    unsigned int numEdges();
    
    bool isValid();
    
    bool invalidEdgeCrossings();
    bool edgeIsValid(unsigned int edgeIndex);
    
    
    // technically includes "vertex lies on a vertex"
    //   returns the point of intersection (as an argument)
    bool vertexLiesOnEdge(unsigned int vIndex, Vertex *intersect);
    bool vertexLiesOnEdge(Vertex v, Vertex *intersect);
    
    bool edgeCrossesEdge(unsigned int index1, unsigned int index2);
    bool edgeCrossesEdge(Vertex a1, Vertex a2, Vertex b1, Vertex b2);
    
private:
    
    bool hVerticesEqual(float x1, float y1, float x2, float y2);
    bool hVerticesEqual(Vertex v1, Vertex v2);

    
    bool mergeVertices(unsigned int vIndex1, unsigned int vIndex2);
    void findAndReplaceInstancesEdge(int *newVertexIndexMapping);

};

