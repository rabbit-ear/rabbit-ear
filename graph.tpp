template <class T>
Graph<T>::Graph(){ }

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
bool Graph<T>::edgeAdjacent(unsigned int edgeIndex1, unsigned int edgeIndex2){
	return ( (edges[edgeIndex1].a == edges[edgeIndex2].a) ||
	         (edges[edgeIndex1].b == edges[edgeIndex2].b) ||
	         (edges[edgeIndex1].a == edges[edgeIndex2].b) ||
	         (edges[edgeIndex1].b == edges[edgeIndex2].a) );
}

template <class T>
void Graph<T>::log(){
	printf("\n#Nodes: %d\n", nodes.size());
	printf("\n#Edges: %d\n", edges.size());
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