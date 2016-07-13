//
//  planarGraph.h
//
//
//  Created by Robby on 7/13/16.
//
//

#ifndef planarGraph_h
#define planarGraph_h

#include "graph.h"

class PlanarGraph : public Graph {
public:
	PlanarGraph();
	
	// remove all duplicate vertices
	void cleanup();
	
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

	
	// fun getters
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
	
protected:
	
	bool hVerticesEqual(float x1, float y1, float x2, float y2, float epsilon);
	bool hVerticesEqual(Vertex v1, Vertex v2, float epsilon);
	
	
	void findAndReplaceInstancesEdge(int *newVertexIndexMapping);

};

#endif /* planarGraph_h */
