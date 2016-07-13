// GRAPH.CPP
//
// for purposes of modeling origami crease patterns
//
// this is a planar graph data structure containing edges and vertices
// vertices are points in 3D space {x,y,z}  (z is 0 for now)
// all the geometry is made to easily incorporate into OpenGL calls

#include <stdlib.h>
#include <stdio.h>
#include <math.h>


template <class T>
Graph<T>::Graph(){
//Graph::Graph(){//int initial){
//    switch (initial) {
//        case 0:
//            break;
//        case 1:
//            break;
//        default:
//            break;
//    }
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
        if     (edges[i].v1 == two) edges[i].v1 = one;
        else if(edges[i].v1 > two)  edges[i].v1--;
        if     (edges[i].v2 == two) edges[i].v2 = one;
        else if(edges[i].v2 > two)  edges[i].v2--;
    }
    nodes.erase(nodes.begin()+two);
    return true;
}

template <class T>
bool Graph<T>::edgeAdjacent(unsigned int edgeIndex1, unsigned int edgeIndex2){
    return ( (edges[edgeIndex1].v1 == edges[edgeIndex2].v1) ||
             (edges[edgeIndex1].v2 == edges[edgeIndex2].v2) ||
             (edges[edgeIndex1].v1 == edges[edgeIndex2].v2) ||
             (edges[edgeIndex1].v2 == edges[edgeIndex2].v1) );
}


template <class T>
void Graph<T>::log(){
    printf("\n# Nodes: %d\n", nodes.size());
    printf("\n# Edges: %d\n", edges.size());
    for(int i = 0; i < edges.size(); i++)
        printf(" %d: (%d -- %d)\n", i, edges[i].v1, edges[i].v2);
}

