#ifndef origami_graph_h
#define origami_graph_h

#include <math.h>
#include <vector>
using namespace std;

// this graph data structure has
// array of edges of {index1, index2}, which are indices in the
// array of nodes, which are templated - can be any type.

typedef struct Pair {
	unsigned short a, b;
} Pair;

template <class T> class Graph {
public:
//private:
	// the graph
	vector <T> nodes;
	vector <Pair> edges;

public:
	// constructor
	Graph();
	// removes all content (edges and nodes)
	void clear();
	// getters
	unsigned int numNodes();
	unsigned int numEdges();
	// inspect the graph
	bool edgeAdjacent(unsigned int edgeIndex1, unsigned int edgeIndex2);
	void log();

protected:
	// operate on the graph
	bool mergeNodes(unsigned int vIndex1, unsigned int vIndex2);
};

#include "graph.tpp"

#endif