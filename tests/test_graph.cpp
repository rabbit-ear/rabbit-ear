#include <stdlib.h>
#include "../graph.h"

#define NODE_COUNT 50
#define EDGE_COUNT 500

Graph <int> graph;

int main(int argc, char **argv){

// CREATE A GRAPH, RANDOM COMPONENTS
	for(int i = 0; i < NODE_COUNT; i++){
		graph.addNode(i);
	}
	for(int i = 0; i < EDGE_COUNT; i++){
		Pair e;
		e.a = arc4random()%NODE_COUNT;
		e.b = arc4random()%NODE_COUNT;
		graph.addEdge(e);
	}
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
