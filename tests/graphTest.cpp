#include <vector>
#include "world.c"
#include "../graph.h"
using namespace std;

#define NODE_COUNT 50

Graph <int> graph;

void setup(){
	glPointSize(10);
	POV = POLAR;
	ZOOM = 2.5;
	GRID = 0;
	GROUND = 0;

	for(int i = 0; i < NODE_COUNT; i++){
		graph.addNode(i);
	}
	for(int i = 0; i < NODE_COUNT; i++){
		Pair e;
		e.a = arc4random()%NODE_COUNT;
		e.b = arc4random()%NODE_COUNT;
		if(e.a!=e.b){
			graph.addEdge(e);
		}
	}
	graph.log();
}

void update(){
}

void draw(){
	// glPushMatrix();
	// glTranslatef(0.0, 0.0, 0.001);
	//
	// for(int k = 0; k < w*h; k++){
	// 	glPushMatrix();
	//
	// 	glTranslatef( (-1 + (k%3))*1.33 , (-1 + floor(k/3.0))*1.33 , 0.0);
	//
	// 	for(int i = 0; i < sortedIndices[k].size(); i++){
	// 		float vertices[9];
	// 		vertices[0] = graphs[k].nodes[sortedIndices[k][i]].x;
	// 		vertices[1] = graphs[k].nodes[sortedIndices[k][i]].y;
	// 		vertices[2] = graphs[k].nodes[sortedIndices[k][i]].z;
	// 		vertices[3] = graphs[k].nodes[0].x;
	// 		vertices[4] = graphs[k].nodes[0].y;
	// 		vertices[5] = graphs[k].nodes[0].z;
	// 		vertices[6] = graphs[k].nodes[sortedIndices[k][(i+1)%sortedIndices[k].size()]].x;
	// 		vertices[7] = graphs[k].nodes[sortedIndices[k][(i+1)%sortedIndices[k].size()]].y;
	// 		vertices[8] = graphs[k].nodes[sortedIndices[k][(i+1)%sortedIndices[k].size()]].z;
	//
	// 		glColor3f((i%2)*.5+.5, (i%2)*.5+.5, (i%2)*.5+.5 );
	// 		glEnableClientState(GL_VERTEX_ARRAY);
	// 		glVertexPointer(3, GL_FLOAT, 0, vertices);
	// 		glDrawArrays(GL_TRIANGLES, 0, 3);
	// 		glDisableClientState(GL_VERTEX_ARRAY);
	// 	}
	//
	// 	float equilibrium = oddEvenSumRatio(interiorAngles[k]) / 6.283;
	//
	// 	float w1 = (1.0 + equilibrium)*.5;
	// 	float w2 = 1.0 - w1;
	// 	glColor3f(.5, .5, .5);
	// 	drawRect(-w1, -.75, w1, 0.1);
	// 	glColor3f(1.0, 1.0, 1.0);
	// 	drawRect(0.0, -.75, w2, 0.1);
	//
	// 	glPopMatrix();
	// }
	// glPopMatrix();
}

void keyDown(unsigned int key){}
void keyUp(unsigned int key){}
void mouseDown(unsigned int button){}
void mouseUp(unsigned int button){}
void mouseMoved(int x, int y){}
