#include "world.h"
#include "../glRender.h"
#include "../planarGraph.cpp"

PlanarGraph g;

void fillWithRandom(int count){
	for(int i = 0; i < count; i++){
		g.addEdgeWithVertices(arc4random()%1000/1000.0, 
		                      arc4random()%1000/1000.0, 
		                      arc4random()%1000/1000.0, 
		                      arc4random()%1000/1000.0 );
	}
}

void fillWithSunburst(int count){
	Vertex center = {0.5, 0.5, 0.0};
	g.vertices->push_back(center);
	for(int i = 0; i < count; i++){
		g.addEdgeFromVertex(0,
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
	// fillWithRandom(10);
	fillWithSunburst(10);
}
void update() { }
void draw() { 
	drawCoordinateFrame();
	glColor3f(1.0, 1.0, 1.0);
	glPointSize(5);
	drawGraphPoints(g);
	drawGraphLines(g);
}
void keyDown(unsigned int key) { 
	if(key == ' '){
		g.clear();
		if(arc4random() % 2)
			fillWithSunburst(10);
		else
			fillWithRandom(10);
	}
}
void keyUp(unsigned int key) { }
void mouseDown(unsigned int button) { }
void mouseUp(unsigned int button) { }
void mouseMoved(int x, int y) { }