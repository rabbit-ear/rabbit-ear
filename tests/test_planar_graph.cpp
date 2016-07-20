#include "world.h"
#include "../glRender.h"
#include "../planarGraph.cpp"

PlanarGraph g;

void setup() { 
	float a = WIDTH/(float)HEIGHT;
	// fit a square in a rectangle that is wider than it is taller
	float PADDING = .1f;
	float SIDE = 1.0f;
	orthoPerspective( (1.0 - (SIDE+PADDING*2)*a ) * .5, 
	                  -PADDING, 
	                  (SIDE+PADDING*2)*a, 
	                  (SIDE+PADDING*2) );


	g.loadPreliminaryBase();
	GROUND = 0;
	GRID = 0;
	g.log();
	for(int i = 0; i < g.numNodes(); i++){
		printf("%f %f\n", ((Vertex)g.nodes[i]).x, ((Vertex)g.nodes[i]).y);
	}
}
void update() { }
void draw() { 
	drawCoordinateFrame();
	glColor3f(1.0, 1.0, 1.0);
	glPointSize(5);
	drawGraphPoints(g);
}
void keyDown(unsigned int key) { }
void keyUp(unsigned int key) { }
void mouseDown(unsigned int button) { }
void mouseUp(unsigned int button) { }
void mouseMoved(int x, int y) { }