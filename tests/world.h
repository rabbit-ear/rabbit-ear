#ifndef WORLD_FRAMEWORK
#define WORLD_FRAMEWORK

#ifdef __APPLE__
#  include <OpenGL/gl.h>
#  include <OpenGL/glu.h>
#  include <GLUT/glut.h>
#else
#  include <GL/gl.h>
#  include <GL/glu.h>
#  include <GL/glut.h>
#endif
#include <stdlib.h>
#include <math.h>
#include <stdio.h>
#include <string.h>

////////////////////////////////////////////////////////////////////////////////////////
//     WORLD is a hyper minimalist (1 file) framework for graphics (OpenGL) and user
//   input (keyboard, mouse) following the OpenFrameworks / Processing design paradigm
////////////////////////////////////////////////////////////////////////////////////////
//
//   HOW TO USE
//
//   1) make an empty .c file
//   2) #include "world.h"
//   3) implement the following functions:
//      done! type 'make', then 'make run'
//
void setup();
void update();
void draw();
void keyDown(unsigned int key);
void keyUp(unsigned int key);
void mouseDown(unsigned int button);
void mouseUp(unsigned int button);
void mouseMoved(int x, int y);
////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////
// CUSTOMIZE
#define CONTINUOUS_REFRESH 0  // (0) = maximum efficiency, screen will only redraw upon receiving input
#define WALK_INTERVAL .10f  // WALKING SPEED. @ 60 updates/second, walk speed = 6 units/second
#define MOUSE_SENSITIVITY 0.333f
// WINDOW size upon boot
static int WIDTH = 800;  // (readonly) set these values here
static int HEIGHT = 600; // (readonly) setting during runtime will not re-size window
static unsigned char FULLSCREEN = 0;  // fullscreen:1   window:0
// INPUT
static int mouseX = 0;  // get mouse location at any point, units in pixels
static int mouseY = 0;
static int mouseDragX = 0;  // dragging during one session (between click and release)
static int mouseDragY = 0;
static unsigned char keyboard[256];  // query this at any point for the state of a key (0:up, 1:pressed)
// GRAPHICS
static float originX = 0.0f;
static float originY = 0.0f;  // location of the eye
static float originZ = 0.0f;
static float ZOOM = 15.0f;  // POLAR PERSPECTIVE    // zoom scale, converted to logarithmic
static float ZOOM_RADIX = 3;
static unsigned char GROUND = 1;  // a 2D grid
static unsigned char GRID = 1;    // a 3D grid
// PERSPECTIVE
enum{  FPP,  POLAR,  ORTHO  } ; // first persion, polar, orthographic
static unsigned char PERSPECTIVE = FPP;  // initialize point of view in this state
// details of each perspective
float lookOrientation[3] = {0.0f, 0.0f, 0.0f}; // azimuth, altitude, zoom/FOV
float orthoFrame[4] = {0.0f, 0.0f, 4.0f, 3.0f}; // x, y, width, height
// TYPES
enum{ FALSE, TRUE };
typedef struct Point {
  float x;
  float y;
  float z;
} Point;
// TABLE OF CONTENTS:
int main(int argc, char **argv);  // initialize Open GL context
void typicalOpenGLSettings();  // colors, line width, glEnable
void reshapeWindow(int windowWidth, int windowHeight);  // contains viewport and frustum calls
void rebuildProjection();  // calls one of the three functions below
// CHANGE PERSPECTIVE
void firstPersonPerspective();//float azimuth, float altitude, float zoom);
void polarPerspective();//float azimuth, float altitude, float zoom);
void orthoPerspective(float x, float y, float width, float height);
// DRAW, ALIGNMENT, INPUT HANDLING
void display();
void updateWorld();  // process input devices
// INPUT DEVICES
void mouseButtons(int button, int state, int x, int y);  // when mouse button state changes
void mouseMotion(int x, int y);   // when mouse is dragging screen
void mousePassiveMotion(int x, int y);  // when mouse is moving but not pressed
void keyboardDown(unsigned char key, int x, int y);
void keyboardUp(unsigned char key,int x,int y);
void specialDown(int key, int x, int y);
void specialUp(int key, int x, int y);
void keyboardSetIdleFunc();
// WORLD SHAPES
void drawRect(float x, float y, float width, float height);
void drawUnitSquare(float x, float y);
void drawUnitAxis(float x, float y, float z, float scale);
void drawCheckerboard(float walkX, float walkY, int numSquares);
void drawAxesGrid(float walkX, float walkY, float walkZ, int span, int repeats);
void drawZoomboard(float zoom);
float modulusContext(float complete, int modulus);

#define ESCAPE_KEY 27
#define SPACE_BAR 32
#define RETURN_KEY 13
#define DELETE_KEY 127
#define EQUAL_KEY 61
#define PLUS_KEY 43
#define MINUS_KEY 45
#define UNDERBAR_KEY 95
#define PERIOD_KEY 46
#define GREATER_THAN_KEY 62
#define COMMA_KEY 44
#define LESS_THAN_KEY 60
// an abbreviated list. more can be defined for quick access
#define A_KEY 65
#define B_KEY 66
#define C_KEY 67
#define D_KEY 68
#define E_KEY 69
#define F_KEY 70
#define G_KEY 71
#define P_KEY 80
#define Q_KEY 81
#define S_KEY 83
#define W_KEY 87
#define X_KEY 88
#define Y_KEY 89
#define Z_KEY 90
#define a_KEY 97
#define b_KEY 98
#define c_KEY 99
#define d_KEY 100
#define e_KEY 101
#define f_KEY 102
#define g_KEY 103
#define p_KEY 112
#define q_KEY 113
#define s_KEY 115
#define w_KEY 119
#define x_KEY 120
#define y_KEY 121
#define z_KEY 122
// special key codes conflict with 0-127 ASCII codes, augmented them to 128-255 index range
#define UP_KEY GLUT_KEY_UP+128//229
#define DOWN_KEY GLUT_KEY_DOWN+128//231
#define RIGHT_KEY GLUT_KEY_RIGHT+128//230
#define LEFT_KEY GLUT_KEY_LEFT+128//228
int main(int argc, char **argv){
	// initialize glut
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
	glutInitWindowPosition(10,10);
	glutInitWindowSize(WIDTH,HEIGHT);
	glutCreateWindow(argv[0]);
	// tie this program's functions to glut
	glutDisplayFunc(display);
	glutReshapeFunc(reshapeWindow);
	glutMouseFunc(mouseButtons);
	glutMotionFunc(mouseMotion);
	glutPassiveMotionFunc(mousePassiveMotion);
	glutKeyboardUpFunc(keyboardUp);
	glutKeyboardFunc(keyboardDown);
	glutSpecialFunc(specialDown);
	glutSpecialUpFunc(specialUp);
	if(CONTINUOUS_REFRESH)
		glutIdleFunc(updateWorld);
	// setup this program
	memset(keyboard,0,256);
	typicalOpenGLSettings();
	glutPostRedisplay();
	setup();  // user defined function
	// begin main loop
	glutMainLoop();
	return 0;
}
void typicalOpenGLSettings(){
	firstPersonPerspective();
	glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
	glShadeModel(GL_FLAT);
	glEnable(GL_DEPTH_TEST);
	glDepthMask(GL_TRUE);
	glDepthFunc(GL_LESS);
	glLineWidth(1);
}
void reshapeWindow(int windowWidth, int windowHeight){
	WIDTH = windowWidth;
	HEIGHT = windowHeight;
	glViewport(0, 0, (GLsizei) WIDTH, (GLsizei) HEIGHT);
	rebuildProjection();
}
void rebuildProjection(){
	switch(PERSPECTIVE){
		case FPP:
			firstPersonPerspective(); break;
		case POLAR:
			polarPerspective(); break;
		case ORTHO:
			orthoPerspective(orthoFrame[0], orthoFrame[1], orthoFrame[2], orthoFrame[3]); break;
	}
}
void firstPersonPerspective(){
	PERSPECTIVE = FPP;
	float a = (float)WIDTH / HEIGHT;
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	glFrustum (-.1, .1, -.1/a, .1/a, .1, 100.0);
	// change POV
	glRotatef(-lookOrientation[1], 1, 0, 0);
	glRotatef(-lookOrientation[0], 0, 0, 1);
	// raise POV 1.0 above the floor, 1.0 is an arbitrary value
	glTranslatef(0.0f, 0.0f, -1.0f);
	glMatrixMode(GL_MODELVIEW);
}
void polarPerspective(){
	PERSPECTIVE = POLAR;
	float a = (float)WIDTH / HEIGHT;
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	glFrustum (-.1, .1, -.1/a, .1/a, .1, 100.0);
	// change POV
	glTranslatef(0, 0, -ZOOM);
	glRotatef(-lookOrientation[1], 1, 0, 0);
	glRotatef(-lookOrientation[0], 0, 0, 1);
	glMatrixMode(GL_MODELVIEW);
}
void orthoPerspective(float x, float y, float width, float height){
	PERSPECTIVE = ORTHO;
	orthoFrame[0] = x;
	orthoFrame[1] = y;
	orthoFrame[2] = width;
	orthoFrame[3] = height;
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	glOrtho(x, width + x, height + y, y, -100.0, 100.0);
	glMatrixMode(GL_MODELVIEW);
}
void display(){
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	glPushMatrix();
		// 3D REPEATED STRUCTURE
		if(GRID){
			glPushMatrix();
			float newX = modulusContext(originX, 5);
			float newY = modulusContext(originY, 5);
			float newZ = modulusContext(originZ, 5);
			glTranslatef(newX, newY, newZ);
			drawAxesGrid(newX, newY, newZ, 5, 4);
			glPopMatrix();
		}
		// 2D REPEATED STRUCTURE
		if(GROUND){
			glPushMatrix();
			float newX = modulusContext(originX, 2);
			float newY = modulusContext(originY, 2);
			glTranslatef(newX, newY, originZ);
			drawCheckerboard(newX, newY, 8);
			glPopMatrix();
		}
		// if(ZOOM_GROUND){
		// 	static double intpart;
		// 	float zoom = powf(3,modf(-originY, &intpart));
		// 	drawZoomboard(zoom);
		// }
		glPushMatrix();
			draw();
		glPopMatrix();
	glPopMatrix();
	// bring back buffer to the front on vertical refresh, auto-calls glFlush
	glutSwapBuffers();
	// glFlush();
}
// process input devices if in first person perspective mode
void updateWorld(){
	// map movement direction to the direction the person is facing
	float lookAzimuth = lookOrientation[0]/180.0*M_PI;
	if(keyboard[UP_KEY] || keyboard[W_KEY] || keyboard[w_KEY]){
		originX += WALK_INTERVAL * sinf(lookAzimuth);
		originY += WALK_INTERVAL * -cosf(lookAzimuth);
	}
	if(keyboard[DOWN_KEY] || keyboard[S_KEY] || keyboard[s_KEY]){
		originX -= WALK_INTERVAL * sinf(lookAzimuth);
		originY -= WALK_INTERVAL * -cosf(lookAzimuth);
	}
	if(keyboard[LEFT_KEY] || keyboard[A_KEY] || keyboard[a_KEY]){
		originX += WALK_INTERVAL * sinf(lookAzimuth+M_PI_2);
		originY += WALK_INTERVAL * -cosf(lookAzimuth+M_PI_2);
	}
	if(keyboard[RIGHT_KEY] || keyboard[D_KEY] || keyboard[d_KEY]){
		originX -= WALK_INTERVAL * sinf(lookAzimuth+M_PI_2);
		originY -= WALK_INTERVAL * -cosf(lookAzimuth+M_PI_2);
	}
	if(keyboard[Q_KEY] || keyboard[q_KEY])
		originZ -= WALK_INTERVAL;
	if(keyboard[Z_KEY] || keyboard[z_KEY])
		originZ += WALK_INTERVAL;
	if(keyboard[MINUS_KEY]){
		ZOOM += WALK_INTERVAL * 4;
		rebuildProjection();
	}
	if(keyboard[PLUS_KEY]){
		ZOOM -= WALK_INTERVAL * 4;
		if(ZOOM < 0)
			ZOOM = 0;
		rebuildProjection();
	}
	update();
	glutPostRedisplay();
}
///////////////////////////////////////
//////////       INPUT       //////////
///////////////////////////////////////
static int mouseDragStartX, mouseDragStartY;
void mouseUpdatePerspective(int dx, int dy){
	switch(PERSPECTIVE){
		case FPP:
			lookOrientation[0] += (dx * MOUSE_SENSITIVITY);
			lookOrientation[1] += (dy * MOUSE_SENSITIVITY);
			// lookOrientation[2] = 0.0;
			firstPersonPerspective();
		break;
		case POLAR:
			lookOrientation[0] += (dx * MOUSE_SENSITIVITY);
			lookOrientation[1] += (dy * MOUSE_SENSITIVITY);
			// lookOrientation[2] = 0.0;
			polarPerspective();
			break;
		case ORTHO:
			orthoFrame[0] += dx;
			orthoFrame[1] += dy;
			orthoPerspective(orthoFrame[0], orthoFrame[1], orthoFrame[2], orthoFrame[3]);
			break;
	}
}
// when mouse button state changes
void mouseButtons(int button, int state, int x, int y){
	if(button == GLUT_LEFT_BUTTON){
		if(!state){  // button down
			mouseX = x;
			mouseY = y;
			mouseDragStartX = x;
			mouseDragStartY = y;
			mouseDown(button);
		}
		else {  // button up
			mouseUp(button);
		}
	}
	else if(button == GLUT_MIDDLE_BUTTON){
		if(!state)  mouseDown(button);
		else        mouseUp(button);
	}
	else if(button == GLUT_RIGHT_BUTTON){
		if(!state)  mouseDown(button);
		else        mouseUp(button);
	}
}
// when mouse is dragging screen
void mouseMotion(int x, int y){
	// change since last mouse event
	mouseUpdatePerspective(mouseX - x, mouseY - y);
	// update new state
	mouseX = x;
	mouseY = y;
	mouseDragX = mouseDragStartX - x;
	mouseDragY = mouseDragStartY - y;
	mouseMoved(x, y);
	glutPostRedisplay();
}
// when mouse is moving but no buttons are pressed
void mousePassiveMotion(int x, int y){
	mouseX = x;
	mouseY = y;
	mouseMoved(x, y);
}
void keyboardDown(unsigned char key, int x, int y){
	if(keyboard[key] == 1)
		return;   // prevent repeated keyboard calls
	keyboard[key] = 1;

	if(key == ESCAPE_KEY)  // ESCAPE key
		exit (0);
	else if(key == f_KEY || key == F_KEY){
		if(!FULLSCREEN)
			glutFullScreen();
		else{
			reshapeWindow(WIDTH, HEIGHT);
			glutPositionWindow(0,0);
		}
		FULLSCREEN = !FULLSCREEN;
	}
	else if(key == P_KEY || key == p_KEY){
		PERSPECTIVE = (PERSPECTIVE+1)%3;
		rebuildProjection();
		glutPostRedisplay();
	}
	else if(key == G_KEY || key == g_KEY){
		GROUND = !GROUND;
		glutPostRedisplay();
	}
	else if (key == X_KEY || key == x_KEY){
		GRID = !GRID;
		glutPostRedisplay();
	}
	keyDown(key);
	if(!CONTINUOUS_REFRESH)
		keyboardSetIdleFunc(); // for efficient screen draw, trigger redraw if needed
}
void keyboardUp(unsigned char key, int x, int y){
	if(keyboard[key] == 0)
		return;   // prevent repeated keyboard calls
	keyboard[key] = 0;
	keyUp(key);
	if(!CONTINUOUS_REFRESH)
		keyboardSetIdleFunc();  // for efficient screen draw, turn off redraw if needed
}
void specialDown(int key, int x, int y){
	key += 128;  // special keys get stored in the 128-255 index range
	if(keyboard[key] == 1)
		return;   // prevent repeated keyboard calls
	keyboard[key] = 1;
	keyDown(key);
	if(!CONTINUOUS_REFRESH)
		keyboardSetIdleFunc();
}
void specialUp(int key, int x, int y){
	key += 128;  // special keys get stored in the 128-255 index range
	if(keyboard[key] == 0)
		return;   // prevent repeated keyboard calls
	keyboard[key] = 0;
	keyUp(key);
	if(!CONTINUOUS_REFRESH)
		keyboardSetIdleFunc();
}
void keyboardSetIdleFunc(){
	// if any key is pressed, idle function is set to re-draw screen
	unsigned char keyDown = 0;
	for(int i = 0; i < 256; i++){
		if(keyboard[i] == 1){
			keyDown = 1;
			break;
		}
	}
	if(keyDown)
		glutIdleFunc(updateWorld);
	else
		glutIdleFunc(NULL);
}

///////////////////////////////////////////////////////////////////////////////////////
/////////////////////////        TINY OPENGL TOOLBOX         //////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

/////////////////////////        PRIMITIVES         //////////////////////////

float modulusContext(float complete, int modulus){
	double wholePart;
	double fracPart = modf(complete, &wholePart);
	return ( ((int)wholePart) % modulus ) + fracPart;
}
void drawRect(float x, float y, float width, float height){
	glPushMatrix();
	glScalef(width, height, 1.0);
	drawUnitSquare(x, y);
	glPopMatrix();
}
void drawPoint(float x, float y, float z){
	static const GLfloat _zero_point_vertex[] = { 0.0f, 0.0f, 0.0f };
	glPushMatrix();
	glTranslatef(x, y, z);
	glEnableClientState(GL_VERTEX_ARRAY);
	glVertexPointer(3, GL_FLOAT, 0, _zero_point_vertex);
	glDrawArrays(GL_POINTS, 0, 1);
	glDisableClientState(GL_VERTEX_ARRAY);
	glPopMatrix();
}
// draws a XY 1x1 square in the Z = 0 plane
void drawUnitSquare(float x, float y){
	static const GLfloat _unit_square_vertex[] = {
		0.0f, 1.0f, 0.0f,     1.0f, 1.0f, 0.0f,    0.0f, 0.0f, 0.0f,    1.0f, 0.0f, 0.0f };
	static const GLfloat _unit_square_normals[] = {
		0.0f, 0.0f, 1.0f,     0.0f, 0.0f, 1.0f,    0.0f, 0.0f, 1.0f,    0.0f, 0.0f, 1.0f };
	glPushMatrix();
	glTranslatef(x, y, 0.0);
	glEnableClientState(GL_VERTEX_ARRAY);
	glEnableClientState(GL_NORMAL_ARRAY);
	glVertexPointer(3, GL_FLOAT, 0, _unit_square_vertex);
	glNormalPointer(GL_FLOAT, 0, _unit_square_normals);
	glDrawArrays(GL_TRIANGLE_STRIP, 0, 4);
	glDisableClientState(GL_NORMAL_ARRAY);
	glDisableClientState(GL_VERTEX_ARRAY);
	glPopMatrix();
}
void drawUnitAxis(float x, float y, float z, float scale){
	static const GLfloat _unit_axis_vertices[] = {
		1.0f, 0.0f, 0.0f,    -1.0f, 0.0f, 0.0f,
		0.0f, 1.0f, 0.0f,     0.0f, -1.0f, 0.0f,
		0.0f, 0.0f, 1.0f,     0.0f, 0.0f, -1.0f};
	static const GLfloat _unit_axis_normals[] = {
		0.0f, 1.0f, 1.0f,     0.0f, 1.0f, 1.0f,
		0.0f, 0.0f, 1.0f,     0.0f, 0.0f, 1.0f,
		1.0f, 0.0f, 0.0f,     1.0f, 0.0f, 0.0f};
	glPushMatrix();
	glTranslatef(x, y, z);
	glScalef(scale, scale, scale);
	glEnableClientState(GL_VERTEX_ARRAY);
	glEnableClientState(GL_NORMAL_ARRAY);
	glVertexPointer(3, GL_FLOAT, 0, _unit_axis_vertices);
	glNormalPointer(GL_FLOAT, 0, _unit_axis_normals);
	glDrawArrays(GL_LINES, 0, 6);
	glDisableClientState(GL_NORMAL_ARRAY);
	glDisableClientState(GL_VERTEX_ARRAY);
	glPopMatrix();
}

/////////////////////////        SCENES         //////////////////////////

void drawCheckerboard(float walkX, float walkY, int numSquares){
	int XOffset = ceil(walkX);
	int YOffset = ceil(walkY);
	// if even split
	if(numSquares%2 == 0){
		for(int i = -numSquares*.5; i <= numSquares*.5; i++){
			for(int j = -numSquares*.5; j <= numSquares*.5; j++){
				int b = abs(((i+j+XOffset+YOffset)%2));
				if(b) glColor3f(1.0, 1.0, 1.0);
				else glColor3f(0.0, 0.0, 0.0);
				drawUnitSquare(i-XOffset, j-YOffset);
			}
		}
	}
// if odd number
	else{
		numSquares--;
		for(int i = -numSquares*.5; i <= numSquares*.5; i++){
			for(int j = -numSquares*.5; j <= numSquares*.5; j++){
				int b = abs(((i+j+XOffset+YOffset)%2));
				if(b) glColor3f(1.0, 1.0, 1.0);
				else glColor3f(0.0, 0.0, 0.0);
				drawUnitSquare(i-XOffset - .5, j-YOffset - .5);
			}
		}
	}
}
// span: how many units to skip inbetween each axis
// repeats: how many rows/cols/stacks on either side of center
void drawAxesGrid(float walkX, float walkY, float walkZ, int span, int repeats){
	float XSpanMod = walkX - floor(walkX/span)*span;
	float YSpanMod = walkY - floor(walkY/span)*span;
	float ZSpanMod = walkZ - floor(walkZ/span)*span;
	for(int i = -repeats*span; i < repeats*span; i+=span){
		for(int j = -repeats*span; j < repeats*span; j+=span){
			for(int k = -repeats*span; k < repeats*span; k+=span){
				// distance approximation works just fine in this case
				float distance = fabs(i+XSpanMod-1) + fabs(j+YSpanMod-1) + abs(k);
				float brightness = 1.0 - distance/(repeats*span);
				glColor3f(brightness, brightness, brightness);
				// glLineWidth(100.0/distance/distance);
				drawUnitAxis(i + XSpanMod - walkX,
				             j + YSpanMod - walkY,
				             k + ZSpanMod - walkZ, 1.0);
			}
		}
	}
}
void drawZoomboard(float zoom){
	glPushMatrix();
	glScalef(zoom, zoom, zoom);
	for(int a = -5; a < 8; a++){
		glPushMatrix();
		// glScalef(1.0/powf(ZOOM_RADIX,a), 1.0/powf(ZOOM_RADIX,a), 1.0/powf(ZOOM_RADIX,a));
		glScalef(1.0f/ZOOM_RADIX, 1.0f/ZOOM_RADIX, 1.0f/ZOOM_RADIX);
		drawCheckerboard(0,0,ZOOM_RADIX);
		glPopMatrix();
		// for(int i = -1; i <= 1; i++){
		// 	for(int j = -1; j <= 1; j++){
		// 		int b = abs(((i+j)%2));
		// 		if(b) glColor3f(1.0, 1.0, 1.0);
		// 		else glColor3f(0.0, 0.0, 0.0);
		// 		if(!(i == 0 && j == 0))
		// 			drawUnitSquare(i-.5, j-.5, 1.0/powf(3,a), 1.0/powf(3,a));
		// 	}
		// }
	}
	glPopMatrix();
}
#endif /* WORLD_FRAMEWORK */
