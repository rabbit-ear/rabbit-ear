// GRAPH.CPP
//
// for purposes of modeling origami crease patterns
//
// this is a graph data structure containing edges and vertices
// vertices are points in 3D space {x,y,z}
// all the geometry is made to easily incorporate into OpenGL calls

using namespace std;

typedef struct Vertex{
	float x;
	float y;
	float z;
} Vertex;

typedef struct Edge {
	unsigned short v1;
	unsigned short v2;
} Edge; 

class Graph{
public:
	Edge *e;
	Vertex *v;
	unsigned int numV;
	unsigned int numE;

	Graph();
	void clear();
	void addVertex(Vertex a);
	void addEdge(Edge a);

	// specify vertex index, get back all vertices that are directly joined to it by an edge
	vector<unsigned int> connectedVertexIndices(unsigned int vIndex);

	// specify vertex index, get back all edges which include this vertex
	vector<unsigned int> connectingEdgeIndices(unsigned int vIndex);

	// same as above, sorted radially by neighbor
	vector<unsigned int> connectingVertexIndicesSortedRadially(unsigned int vIndex);
	// the angles in radians corresponding to the above list
	vector<float> connectingVertexInteriorAngles(unsigned int vIndex, vector<unsigned int> connectedVertexIndicesSorted);

	// rotate a vertex (index) around another vertex (indexOrigin)
	void rotateEdge(int index, int indexOrigin, float angle);
};

Graph::Graph(){
	numV = numE = 0;
}

void Graph::clear(){
	if(numV){
		free(this->v);
	}
	if(numE){
		free(this->e);
	}
	numV = numE = 0;
}

void Graph::addVertex(Vertex a){
	// create a c++ vector copy of Vertex array
	std::vector<Vertex> vVector;
	if(this->numV){
		for(int i = 0; i < this->numV; i++){
			Vertex v;
			v.x = this->v[i].x;
			v.y = this->v[i].y;
			v.z = this->v[i].z;
			vVector.push_back(v);
		}
		free(this->v);
	}
	// add and increment c++ vector
	vVector.push_back(a);
	this->numV++;
	// move c++ vector back into OpenGL safe Vertex array
	this->v = (Vertex*)malloc(sizeof(Vertex)*this->numV);
	for(int i = 0; i < this->numV; i++){
		this->v[i].x = vVector[i].x;
		this->v[i].y = vVector[i].y;
		this->v[i].z = vVector[i].z;
	}
	vVector.clear();
}

void Graph::addEdge(Edge a){
	// create a c++ vector copy of Edge array
	std::vector<Edge> eVector;
	if(this->numE){
		for(int i = 0; i < this->numE; i++){
			Edge e;
			e.v1 = this->e[i].v1;
			e.v2 = this->e[i].v2;
			eVector.push_back(e);
		}
		free(this->e);
	}
	// add and increment c++ vector
	eVector.push_back(a);
	this->numE++;
	// move c++ vector back into OpenGL safe Edge array
	this->e = (Edge*)malloc(sizeof(Edge)*this->numE);
	for(int i = 0; i < this->numE; i++){
		this->e[i].v1 = eVector[i].v1;
		this->e[i].v2 = eVector[i].v2;
	}
	eVector.clear();
}

vector<unsigned int> Graph::connectedVertexIndices(unsigned int vIndex){
	vector<unsigned int> indices;
	// iterate over all edges
	for(int i = 0; i < this->numE; i++){
		// if we find our index, add the vertex on the other end of the edge
		if(this->e[i].v1 == vIndex)
			indices.push_back(this->e[i].v2);
		if(this->e[i].v2 == vIndex)
			indices.push_back(this->e[i].v1);
	}
	return indices;
}

vector<unsigned int> Graph::connectingEdgeIndices(unsigned int vIndex){
	vector<unsigned int> indices;
	// iterate over all edges
	for(int i = 0; i < this->numE; i++){
		// if we find our vertex, add the edge
		if(this->e[i].v1 == vIndex || this->e[i].v2 == vIndex)
			indices.push_back(i);
	}
	return indices;
}

vector<unsigned int> Graph::connectingVertexIndicesSortedRadially(unsigned int vIndex){
	vector<unsigned int> connectedVertices = connectedVertexIndices(vIndex);	
	vector<float> globalAngleValues;  // calculated from global 0deg line
	// we have to query the global angle of each segment
	// so we can locally sort each clockwise or counter clockwise
	vector<float> sortedGlobalAngleValues;
	for(int i = 0; i < connectedVertices.size(); i++){
		float angle = atan2(this->v[connectedVertices[i]].y - this->v[vIndex].y, 
		                    this->v[connectedVertices[i]].x - this->v[vIndex].x);
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

vector<float> Graph::connectingVertexInteriorAngles(unsigned int vIndex, vector<unsigned int> connectedVertexIndicesSorted){
	vector<float> anglesBetweenVertices;
	vector<float> anglesOfVertices;
	for(int i = 0; i < connectedVertexIndicesSorted.size(); i++){
		float angle = atan2(this->v[connectedVertexIndicesSorted[i]].y - this->v[vIndex].y, 
		                    this->v[connectedVertexIndicesSorted[i]].x - this->v[vIndex].x);		
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

void Graph::rotateEdge(int index, int indexOrigin, float angle){
	float distance = sqrt(powf( this->v[indexOrigin].y - this->v[index].y ,2)
	                     +powf( this->v[indexOrigin].x - this->v[index].x ,2));
	float currentAngle = atan2(this->v[index].y, this->v[index].x);
	this->v[index].x = distance*cosf(currentAngle + angle);
	this->v[index].y = distance*sinf(currentAngle + angle);
}