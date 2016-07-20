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
	// nodes are templated type, and edges are indices in vector<T>nodes
	vector <T> nodes;
	vector <Pair> edges;

public:
	// constructor
	Graph();

	void addNode(T node);
	void addEdge(Pair edge);

	// removes any duplicate edges (edges containing the same nodes)
	void cleanup();

	// removes all edges and nodes
	void clear();

	// getters
	unsigned int numNodes();
	unsigned int numEdges();

	// inspect the graph
	//   2 nodes connected by an edge?
	bool nodesAdjacent(unsigned int nodeIndex1, unsigned int nodeIndex2);
	//   2 edges share a node?
	bool edgesAdjacent(unsigned int edgeIndex1, unsigned int edgeIndex2);

	void log();
	void logMore();

protected:
	// operations on the graph

	// replaces all mention of one vertex with the other in both vertex and edge arrays
	// shrinks the total number of vertices
	bool mergeNodes(unsigned int vIndex1, unsigned int vIndex2);

	// 2 edges contain the same nodes
	bool edgesAreSimilar(unsigned int eIndex1, unsigned int eIndex2);
};


//////////////////////////////////////////////////////////////////////
// IMPLEMENTATION
//
template <class T>
Graph<T>::Graph(){ }

template <class T>
void Graph<T>::addNode(T node){
	nodes.push_back(node);
}

template <class T>
void Graph<T>::addEdge(Pair edge){
	edges.push_back(edge);
}

template <class T>
void Graph<T>::cleanup(){
	int i = 0;
	while(i < edges.size()-1){
		int j = i+1;
		while(j < edges.size()){
			bool didRemove = false;
			if ( edgesAreSimilar(i, j) ){
				edges.erase(edges.begin()+j);
				didRemove = true;
			}
			// only iterate forward if we didn't remove an element
			//   if we did, it basically iterated forward for us, repeat the same 'j'
			// this is also possible because we know that j is always greater than i
			if(!didRemove)
				j++;
		}
		i++;
	}
}

template <class T>
void Graph<T>::clear(){
	nodes.clear();
	edges.clear();
}

template <class T>
unsigned int Graph<T>::numEdges(){
	return edges.size();
}

template <class T>
unsigned int Graph<T>::numNodes(){
	return nodes.size();
}

template <class T>
bool Graph<T>::nodesAdjacent(unsigned int nodeIndex1, unsigned int nodeIndex2){
	for(int i = 0; i < edges.size(); i++){
		if( (edges[i].a == nodeIndex1 && edges[i].b == nodeIndex2 ) ||
			(edges[i].a == nodeIndex2 && edges[i].b == nodeIndex1 ) ){
			return true;
		}
	}
	return false;
}

template <class T>
bool Graph<T>::edgesAdjacent(unsigned int edgeIndex1, unsigned int edgeIndex2){
	return ( (edges[edgeIndex1].a == edges[edgeIndex2].a) ||
	         (edges[edgeIndex1].b == edges[edgeIndex2].b) ||
	         (edges[edgeIndex1].a == edges[edgeIndex2].b) ||
	         (edges[edgeIndex1].b == edges[edgeIndex2].a) );
}

template <class T>
void Graph<T>::log(){
	printf("#Nodes: %lu\n", nodes.size());
	printf("#Edges: %lu\n", edges.size());
}

template <class T>
void Graph<T>::logMore(){
	log();
	for(int i = 0; i < edges.size(); i++)
		printf(" %d: (%d-%d)\n", i, edges[i].a, edges[i].b);
}

template <class T>
bool Graph<T>::mergeNodes(unsigned int nodeIndex1, unsigned int nodeIndex2){
	// replaces all mention of one vertex with the other in both vertex and edge arrays
	// shrinks the total number of vertices

	// retains the smaller index of the two
	unsigned int one, two;
	if(nodeIndex1 == nodeIndex2) {
		return false;
	}
	if(nodeIndex1 < nodeIndex2) {one = nodeIndex1; two = nodeIndex2;}
	if(nodeIndex1 > nodeIndex2) {one = nodeIndex2; two = nodeIndex1;}

	// replace all instances in EDGE array
	// and decrement all indices greater than vertexIndex2 (vertex array is about to lose vertexIndex2)
	for(int i = 0; i < edges.size(); i++){
		if     (edges[i].a == two) edges[i].a = one;
		else if(edges[i].a > two)  edges[i].a--;
		if     (edges[i].b == two) edges[i].b = one;
		else if(edges[i].b > two)  edges[i].b--;
	}
	nodes.erase(nodes.begin()+two);
	return true;
}

template <class T>
bool Graph<T>::edgesAreSimilar(unsigned int eIndex1, unsigned int eIndex2){
	return( (edges[eIndex1].a == edges[eIndex2].a &&
	         edges[eIndex1].b == edges[eIndex2].b ) ||
	        (edges[eIndex1].a == edges[eIndex2].b &&
   	         edges[eIndex1].b == edges[eIndex2].a ) );
}


#endif
