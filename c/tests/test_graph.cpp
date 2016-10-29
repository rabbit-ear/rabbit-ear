#include <stdlib.h>
#include "../graph.h"

Graph <int> graph;

void fillWithRandom(unsigned int numNodes, unsigned int numEdges){
	for(int i = 0; i < numNodes; i++){
		graph.addNode(i);
	}
	for(int i = 0; i < numEdges; i++){
		Pair e;
		e.a = arc4random()%numNodes;
		e.b = arc4random()%numNodes;
		graph.addEdge(e);
	}
}

int main(int argc, char **argv){

	unsigned int NODE_COUNT = 50;
	unsigned int EDGE_COUNT = 500;

// CREATE A GRAPH, RANDOM COMPONENTS
	fillWithRandom(NODE_COUNT, EDGE_COUNT);
	printf("created %u nodes and %u edges\n", graph.numNodes(), graph.numEdges());
	graph.log();

// REMOVE DUPLICATE EDGES
	graph.cleanup();
	printf("removing %u duplicate edges\n", EDGE_COUNT - graph.numEdges());
	graph.log();

// ADJACENT NODES
	unsigned int count = 0;
	vector <int> adjacentList;
	for(int i = 1; i < graph.numNodes(); i++){
		if(graph.nodesAdjacent(0, i)){
			adjacentList.push_back(i);
			count++;
		}
	}
	printf("%d nodes are adjacent to the first node (connected by an edge)\n", count);
	for(int i = 0; i < adjacentList.size(); i++)
		printf("%d, ", adjacentList[i]);
	printf("\n");

// ADJACENT EDGES
	count = 0;
	adjacentList.clear();
	for(int i = 1; i < graph.numEdges(); i++){
		if(graph.edgesAdjacent(0, i)){
			adjacentList.push_back(i);
			count++;
		}
	}
	printf("%d edges are adjacent to the first edge (edges share a node)\n", count);
	for(int i = 0; i < adjacentList.size(); i++)
		printf("%d, ", adjacentList[i]);
	printf("\n");
}
