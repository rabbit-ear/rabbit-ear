// GRAPH.CPP
//
// for purposes of modeling origami crease patterns
//
// this is a planar graph data structure containing edges and vertices
// vertices are points in 3D space {x,y,z}  (z is 0 for now)
// all the geometry is made to easily incorporate into OpenGL calls

#include "graph.h"

#include <stdlib.h>
#include <stdio.h>
#include <math.h>


Graph::Graph(){//int initial){
//    switch (initial) {
//        case 0:
//            break;
//        case 1:
//            break;
//        default:
//            break;
//    }
}

void Graph::clear(){
    vertices.clear();
    edges.clear();
}

unsigned int Graph::numEdges(){
    return edges.size();
}

unsigned int Graph::numVertices(){
    return vertices.size();
}


// crease start and finish, on a scale of 0 to 1
void Graph::addEdgeWithVertices(float x1, float y1, float x2, float y2){
    unsigned short vI1 = vertices.size();
    unsigned short vI2 = vertices.size()+1;
    Edge e1 = {vI1, vI2};

    // add vertices
    Vertex v1 = {x1, y1};
    Vertex v2 = {x2, y2};
    vertices.push_back(v1);
    vertices.push_back(v2);
    
    // add edge
    edges.push_back(e1);
}

bool Graph::mergeVertices(unsigned int vertexIndex1, unsigned int vertexIndex2){
    // replaces all mention of one vertex with the other in both vertex and edge arrays
    // shrinks the total number of vertices
    
    // retains the smaller index of the two
    unsigned int one, two;
    if(vertexIndex1 == vertexIndex2) {
        return false;
    }
    if(vertexIndex1 < vertexIndex2) {one = vertexIndex1; two = vertexIndex2;}
    if(vertexIndex1 > vertexIndex2) {one = vertexIndex2; two = vertexIndex1;}

    // replace all instances in EDGE array
    // and decrement all indices greater than vertexIndex2 (vertex array is about to lose vertexIndex2)
    for(int i = 0; i < edges.size(); i++){
        if     (edges[i].v1 == two) edges[i].v1 = one;
        else if(edges[i].v1 > two)  edges[i].v1--;
        if     (edges[i].v2 == two) edges[i].v2 = one;
        else if(edges[i].v2 > two)  edges[i].v2--;
    }
    vertices.erase(vertices.begin()+two);
    return true;
}

bool Graph::edgeAdjacent(unsigned int edgeIndex1, unsigned int edgeIndex2){
    return ( (edges[edgeIndex1].v1 == edges[edgeIndex2].v1) ||
             (edges[edgeIndex1].v2 == edges[edgeIndex2].v2) ||
             (edges[edgeIndex1].v1 == edges[edgeIndex2].v2) ||
             (edges[edgeIndex1].v2 == edges[edgeIndex2].v1) );
}


void Graph::log(){
    printf("\nVertices:\n");
    for(int i = 0; i < vertices.size(); i++)
        printf(" %d: (%f, %f, %f)\n", i, vertices[i].x, vertices[i].y, vertices[i].z);
    printf("\nEdges:\n");
    for(int i = 0; i < edges.size(); i++)
        printf(" %d: (%d -- %d)\n", i, edges[i].v1, edges[i].v2);
}

