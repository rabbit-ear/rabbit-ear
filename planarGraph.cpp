//
//  planarGraph.cpp
//
//
//  Created by Robby on 7/13/16.
//
//

#include "planarGraph.h"

//////////////////////////////////////////////////////////////////
//#include "algorithms2d.h"
bool onSegment(Vertex a, Vertex point, Vertex b);
int orientation(Vertex p, Vertex q, Vertex r);
bool doIntersect(Vertex p1, Vertex q1, Vertex p2, Vertex q2);
//////////////////////////////////////////////////////////////////


PlanarGraph::PlanarGraph(){
	vertices = &nodes;
}

//Graph::Graph(){//int initial){
//    switch (initial) {
//        case 0:
//            break;
//        case 1:
//            break;
//        default:
//            break;
//    }
//}

void PlanarGraph::cleanup(){
	int i = 0;
	while(i < nodes.size()-1){
		int j = i+1;
		while(j < nodes.size()){
			bool didRemove = false;
			// do the points overlap?
			if ( hVerticesEqual(nodes[i], nodes[j], VERTEX_DUPLICATE_EPSILON) ){
				didRemove = mergeNodes(i, j);
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

// crease start and finish, on a scale of 0 to 1
void PlanarGraph::addEdgeWithVertices(float x1, float y1, float x2, float y2){
	unsigned short vI1 = nodes.size();
	unsigned short vI2 = nodes.size()+1;
	Pair e1 = {vI1, vI2};
	
	// add vertices
	Vertex v1 = {x1, y1};
	Vertex v2 = {x2, y2};
	nodes.push_back(v1);
	nodes.push_back(v2);
	
	// add edge
	edges.push_back(e1);
}


bool PlanarGraph::isValid(){
	invalidEdgeCrossings();
}


// quick and easy, use a square bounding box
bool PlanarGraph::hVerticesEqual(Vertex v1, Vertex v2, float epsilon){
	return (v1.x - epsilon < v2.x && v1.x + epsilon > v2.x &&
			v1.y - epsilon < v2.y && v1.y + epsilon > v2.y);
}
bool PlanarGraph::hVerticesEqual(float x1, float y1, float x2, float y2, float epsilon){
	return (x1 - epsilon < x2 && x1 + epsilon > x2 &&
			y1 - epsilon < y2 && y1 + epsilon > y2);
}



vector<unsigned int> PlanarGraph::edgesIntersectingEdges(){
	vector<unsigned int> invalidEdges;
	for(int i = 0; i < edges.size() - 1; i++){
		for(int j = i+1; j < edges.size(); j++){
			bool one = !edgeAdjacent(i, j);
			bool two = doIntersect(nodes[ edges[i].a ],
								   nodes[ edges[i].b ],
								   nodes[ edges[j].a ],
								   nodes[ edges[j].b ]);
			if(one && two){
				//                printf("LISTEN TO LAST ONE (%d:%d):\n   +(%f, %f) (%f, %f)\n   +(%f, %f) (%f, %f)\n", one, two,
				//                       nodes[ edges[i].a ].x, nodes[ edges[i].a ].y,
				//                       nodes[ edges[i].b ].x, nodes[ edges[i].b ].y,
				//                       nodes[ edges[j].a ].x, nodes[ edges[j].a ].y,
				//                       nodes[ edges[j].b ].x, nodes[ edges[j].b ].y);
				// true: edges i and j overlap
				invalidEdges.push_back(i);
				invalidEdges.push_back(j);
			}
		}
	}
	return invalidEdges;
}

bool PlanarGraph::invalidEdgeCrossings(){
	float SCALE = 100.0;
	for(int i = 0; i < edges.size(); i++){
		for(int j = 0; j < edges.size(); j++){
			if(i != j){
				Vertex vertex[4];
				vertex[0] = nodes[ edges[i].a ];
				vertex[1] = nodes[ edges[i].b ];
				vertex[2] = nodes[ edges[j].a ];
				vertex[3] = nodes[ edges[j].b ];
				for(int k = 0; k < 4; k++){
					vertex[k].x *= SCALE;
					vertex[k].y *= SCALE;
					vertex[k].z *= SCALE;
				}
				if(doIntersect(vertex[0], vertex[1], vertex[2], vertex[3]))
					return true;
			}
		}
	}
	return false;
}

bool PlanarGraph::edgeIsValid(unsigned int edgeIndex){
	float SCALE = 100.0;
	for(int i = 0; i < edges.size(); i++){
		if(edgeIndex != i){
			Vertex vertex[4];
			vertex[0] = nodes[ edges[edgeIndex].a ];
			vertex[1] = nodes[ edges[edgeIndex].b ];
			vertex[2] = nodes[ edges[i].a ];
			vertex[3] = nodes[ edges[i].b ];
			for(int j = 0; j < 4; j++){
				vertex[j].x *= SCALE;
				vertex[j].y *= SCALE;
				vertex[j].z *= SCALE;
			}
			if(doIntersect(vertex[0], vertex[1], vertex[2], vertex[3]))
				return false;
		}
	}
	return true;
}



void PlanarGraph::findAndReplaceInstancesEdge(int *newVertexIndexMapping){
	for(int i = 0; i < edges.size(); i++){
		if(newVertexIndexMapping[ edges[i].a ] != -1){
			edges[i].a = newVertexIndexMapping[ edges[i].a ];
		}
		if(newVertexIndexMapping[ edges[i].b ] != -1){
			edges[i].b = newVertexIndexMapping[ edges[i].b ];
		}
	}
}

bool PlanarGraph::getVertexIndexAt(float x, float y, unsigned int *index){
	for(int i = 0; i < nodes.size(); i++){
		if(hVerticesEqual(nodes[i].x, nodes[i].y, x, y, USER_TAP_EPSILON)){
			*index = i;
			return true;
		}
	}
	return false;
}



bool PlanarGraph::vertexLiesOnEdge(unsigned int vIndex, Vertex *intersect){
	Vertex v = nodes[vIndex];
	return vertexLiesOnEdge(v, intersect);
}

bool PlanarGraph::vertexLiesOnEdge(Vertex v, Vertex *intersect){
	// including a margin of error, bounding area around vertex
	
	// first check if point lies on end points
	for(int i = 0; i < nodes.size(); i++){
		if( hVerticesEqual(nodes[i], v, VERTEX_DUPLICATE_EPSILON) ){
			intersect->x = nodes[i].x;
			intersect->y = nodes[i].y;
			intersect->z = nodes[i].z;
			return true;
		}
	}
	
	for(int i = 0; i < edges.size(); i++){
		Vertex a = nodes[ edges[i].a ];
		Vertex b = nodes[ edges[i].b ];
		float crossproduct = (v.y - a.y) * (b.x - a.x) - (v.x - a.x) * (b.y - a.y);
		if(fabs(crossproduct) < VERTEX_DUPLICATE_EPSILON){
			// cross product is essentially zero, point lies along the (infinite) line
			// now check if it is between the two points
			float dotproduct = (v.x - a.x) * (b.x - a.x) + (v.y - a.y) * (b.y - a.y);
			// dot product must be between 0 and the squared length of the line segment
			if(dotproduct > 0){
				float lengthSquared = powf(b.x - a.x, 2) + powf(b.y - a.y, 2);
				if(dotproduct < lengthSquared){
					//TODO: intersection
					//                    intersect =
					return true;
				}
			}
		}
	}
	return false;
}

vector<unsigned int> PlanarGraph::connectedVertexIndices(unsigned int vIndex){
	vector<unsigned int> indices;
	// iterate over all edges
	for(int i = 0; i < edges.size(); i++){
		// if we find our index, add the vertex on the other end of the edge
		if(this->edges[i].a == vIndex)
			indices.push_back(this->edges[i].b);
		if(this->edges[i].b == vIndex)
			indices.push_back(this->edges[i].a);
	}
	return indices;
}

vector<unsigned int> PlanarGraph::connectingEdgeIndices(unsigned int vIndex){
	vector<unsigned int> indices;
	// iterate over all edges
	for(int i = 0; i < edges.size(); i++){
		// if we find our vertex, add the edge
		if(this->edges[i].a == vIndex || this->edges[i].b == vIndex)
			indices.push_back(i);
	}
	return indices;
}

vector<unsigned int> PlanarGraph::connectingVertexIndicesSortedRadially(unsigned int vIndex){
	vector<unsigned int> connectedVertices = connectedVertexIndices(vIndex);
	vector<float> globalAngleValues;  // calculated from global 0deg line
	// we have to query the global angle of each segment
	// so we can locally sort each clockwise or counter clockwise
	vector<float> sortedGlobalAngleValues;
	for(int i = 0; i < connectedVertices.size(); i++){
		float angle = atan2(this->nodes[connectedVertices[i]].y - this->nodes[vIndex].y,
							this->nodes[connectedVertices[i]].x - this->nodes[vIndex].x);
		globalAngleValues.push_back( angle );
		sortedGlobalAngleValues.push_back( angle );
	}
	sort(sortedGlobalAngleValues.begin(), sortedGlobalAngleValues.begin()+connectedVertices.size());
	// now each edge'd sprout angle is sorted from -pi to pi
	vector<unsigned int> connectedVertexIndicesSorted;
	for(int i = 0; i < connectedVertices.size(); i++)
		for(int j = 0; j < connectedVertices.size(); j++)
			if(sortedGlobalAngleValues[i] == globalAngleValues[j])
				connectedVertexIndicesSorted.push_back(connectedVertices[j]);
	return connectedVertexIndicesSorted;
}

vector<float> PlanarGraph::connectingVertexInteriorAngles(unsigned int vIndex, vector<unsigned int> connectedVertexIndicesSorted){
	vector<float> anglesBetweenVertices;
	vector<float> anglesOfVertices;
	for(int i = 0; i < connectedVertexIndicesSorted.size(); i++){
		float angle = atan2(this->nodes[connectedVertexIndicesSorted[i]].y - this->nodes[vIndex].y,
							this->nodes[connectedVertexIndicesSorted[i]].x - this->nodes[vIndex].x);
		anglesOfVertices.push_back(angle);
	}
	for(int i = 0; i < anglesOfVertices.size(); i++){
		// when it's the wrap around value (i==3) add 2pi to the angle it's subtracted from
		float diff = anglesOfVertices[(i+1)%anglesOfVertices.size()]
		+ (M_PI*2 * (i==3))
		- anglesOfVertices[i%anglesOfVertices.size()];
		anglesBetweenVertices.push_back( diff );
	}
	return anglesBetweenVertices;
}

void PlanarGraph::rotateEdge(int index, int indexOrigin, float angle){
	float distance = sqrt(powf( this->nodes[indexOrigin].y - this->nodes[index].y ,2)
						  +powf( this->nodes[indexOrigin].x - this->nodes[index].x ,2));
	float currentAngle = atan2(this->nodes[index].y, this->nodes[index].x);
	this->nodes[index].x = distance*cosf(currentAngle + angle);
	this->nodes[index].y = distance*sinf(currentAngle + angle);
}




void PlanarGraph::log(){
	printf("\nVertices:\n");
	for(int i = 0; i < nodes.size(); i++)
		printf(" %d: (%f, %f, %f)\n", i, nodes[i].x, nodes[i].y, nodes[i].z);
	printf("\nEdges:\n");
	for(int i = 0; i < edges.size(); i++)
		printf(" %d: (%d -- %d)\n", i, edges[i].a, edges[i].b);
}



/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//
//                            2D ALGORITHMS
//

// if points are all collinear
// checks if point q lies on line segment 'ab'
bool onSegment(Vertex a, Vertex point, Vertex b){
	if (point.x <= max(a.x, b.x) && point.x >= min(a.x, b.x) &&
		point.y <= max(a.y, b.y) && point.y >= min(a.y, b.y))
		return true;
	return false;
}


// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are collinear
// 1 --> Clockwise
// 2 --> Counterclockwise
int orientation(Vertex p, Vertex q, Vertex r){
	// See http://www.geeksforgeeks.org/orientation-3-ordered-points/
	// for details of below formula.
	float val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
	if (fabs(val) <= .00001) return 0;  // collinear
	return (val > 0)? 1: 2; // clock or counterclock wise
}

// The main function that returns true if line segment 'p1q1'
// and 'p2q2' intersect.
bool doIntersect(Vertex p1, Vertex q1, Vertex p2, Vertex q2){
	// Find the four orientations needed for general and
	// special cases
	int o1 = orientation(p1, q1, p2);
	int o2 = orientation(p1, q1, q2);
	int o3 = orientation(p2, q2, p1);
	int o4 = orientation(p2, q2, q1);
	
	// General case
	if (o1 != o2 && o3 != o4){
		// 0 1 0 2
		// 0 2 0 1
		//        printf("general %d %d %d %d\n", o1, o2, o3, o4);
		return true;
	}
	// Special Cases
	// p1, q1 and p2 are colinear and p2 lies on segment p1q1
	if (o1 == 0 && onSegment(p1, p2, q1)) {
		//        printf("one\n");
		return true;
	}
	
	// p1, q1 and p2 are colinear and q2 lies on segment p1q1
	if (o2 == 0 && onSegment(p1, q2, q1)){
		//        printf("two\n");
		return true;
	}
	
	// p2, q2 and p1 are colinear and p1 lies on segment p2q2
	if (o3 == 0 && onSegment(p2, p1, q2)){
		//        printf("three\n");
		return true;
	}
	
	// p2, q2 and q1 are colinear and q1 lies on segment p2q2
	if (o4 == 0 && onSegment(p2, q1, q2)){
		//        printf("four\n");
		return true;
	}
	
	return false; // Doesn't fall in any of the above cases
}
