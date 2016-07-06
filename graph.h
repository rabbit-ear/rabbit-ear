#include "ofMain.h"

//using namespace std;

typedef struct Vertex{
    double x, y, z;
} Vertex;

typedef struct Edge {
    unsigned short v1, v2;
} Edge;


bool onSegment(Vertex p, Vertex q, Vertex r);
int orientation(Vertex p, Vertex q, Vertex r);
bool doIntersect(Vertex a1, Vertex a2, Vertex b1, Vertex b2);


class Graph : public ofBaseApp{
public:
    vector <Edge> e;
    vector <Vertex> v;

    Graph( int initial );
    
    
    // joins points lying on top of each other
    void cleanup();
    
    void addVerticesWithEdge(float x1, float y1, float x2, float y2);
    void addVerticesWithoutEdge(float x1, float y1, float x2, float y2);
    
    // crease start and finish, on a scale of 0 to 1
    void crease(float x1, float y1, float x2, float y2);
    
    // get back all the vertices that are connected to the input vertex by edges
    vector<unsigned int> connectedVertexIndices(unsigned int vIndex);
    
    // get back all the edges which join to the input vertex
    vector<unsigned int> connectingEdgeIndices(unsigned int vIndex);
    
    // same as above, sorted radially by neighbor
    vector<unsigned int> connectingVertexIndicesSortedRadially(unsigned int vIndex);
    
    // the angles in radians corresponding to the above list
    vector<float> connectingVertexInteriorAngles(unsigned int vIndex, vector<unsigned int> connectedVertexIndicesSorted);
    
    // rotate a vertex (index) around another vertex (indexOrigin)
    void rotateEdge(int index, int indexOrigin, float angle);
    
    void log();
    
    bool isValid();
    
    bool invalidEdgeCrossings();
    bool edgeIsValid(unsigned int edgeIndex);
    
private:
    void mergeVertices(unsigned int vIndex1, unsigned int vIndex2);
    void findAndReplaceInstancesEdge(int *newVertexIndexMapping);
};

