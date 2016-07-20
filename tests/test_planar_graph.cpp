#include "world.h"
#include "../glRender.h"
#include "../planarGraph.cpp"

PlanarGraph g;

void fillWithRandom(){
	for(int i = 0; i < 10; i++){
		g.addEdgeWithVertices(arc4random()%1000/1000.0, 
		                      arc4random()%1000/1000.0, 
		                      arc4random()%1000/1000.0, 
		                      arc4random()%1000/1000.0 );
	}
}

void setup() { 

	// SETUP WORLD
	float a = WIDTH/(float)HEIGHT;
	// fit a square in a rectangle that is wider than it is taller
	float PADDING = .1f;
	float SIDE = 1.0f;
	orthoPerspective( (1.0 - (SIDE+PADDING*2)*a ) * .5, 
	                  -PADDING, 
	                  (SIDE+PADDING*2)*a, 
	                  (SIDE+PADDING*2) );
	polarPerspective(-0.5, -0.5, 0.0);
	GROUND = 0;
	GRID = 0;
	ZOOM = 1.0;
	ZOOM_SPEED = 0.02;
	fillWithRandom();
}
void update() { }
void draw() { 
	drawCoordinateFrame();
	glColor3f(1.0, 1.0, 1.0);
	glPointSize(5);
	drawGraphPoints(g);
	drawGraphLines(g);
}
void keyDown(unsigned int key) { }
void keyUp(unsigned int key) { }
void mouseDown(unsigned int button) { }
void mouseUp(unsigned int button) { }
void mouseMoved(int x, int y) { }