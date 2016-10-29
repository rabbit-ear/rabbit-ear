#ifdef __APPLE__
#  include <OpenGL/gl.h>
#  include <OpenGL/glu.h>
#  include <GLUT/glut.h>
#else
#  include <GL/gl.h>
#  include <GL/glu.h>
#  include <GL/glut.h>
#endif

#include "planarGraph.h"

void drawCoordinateFrame(){
	// draws a box around the (0,0) to (1,1) square space
	static float corners[12] = {0.0, 0.0, 0.0,
	                            0.0, 1.0, 0.0,
	                            1.0, 1.0, 0.0,
	                            1.0, 0.0, 0.0 };
	static unsigned short cornerLines[8] = {0, 1, 1, 2, 2, 3, 3, 0};
	glLineWidth(1);
	glColor3f(0.2, 0.2, 0.2);
	// DRAW LINES
	glEnableClientState(GL_VERTEX_ARRAY);
	glEnableClientState(GL_NORMAL_ARRAY);
	glVertexPointer(3, GL_FLOAT, 0, corners);
	// glNormalPointer(GL_FLOAT, 0, normal_array);
	glDrawElements(GL_LINES, 2*4, GL_UNSIGNED_SHORT, cornerLines);
	glDisableClientState(GL_NORMAL_ARRAY);
	glDisableClientState(GL_VERTEX_ARRAY);
}

void drawGraphPoints(PlanarGraph g){
	float point_array[g.numNodes()*3];
	for(int i = 0; i < g.numNodes(); i++){
		Vertex v = (Vertex)g.nodes[i];
		point_array[i*3+0] = v.x;
		point_array[i*3+1] = v.y;
		point_array[i*3+2] = v.z;
	}
	glEnableClientState(GL_VERTEX_ARRAY);
	glEnableClientState(GL_NORMAL_ARRAY);
	glVertexPointer(3, GL_FLOAT, 0, point_array);
	// glNormalPointer(GL_FLOAT, 0, normal_array);
	glDrawArrays(GL_POINTS, 0, g.numNodes());
	glDisableClientState(GL_NORMAL_ARRAY);
	glDisableClientState(GL_VERTEX_ARRAY);
}

void drawGraphLines(PlanarGraph g){
	float point_array[g.numNodes()*3];
	for(int i = 0; i < g.numNodes(); i++){
		Vertex v = (Vertex)g.nodes[i];
		point_array[i*3+0] = v.x;
		point_array[i*3+1] = v.y;
		point_array[i*3+2] = v.z;
	}
	unsigned short line_array[g.numEdges()*2];
	for(int i = 0; i < g.numEdges(); i++){
		line_array[i*2+0] = g.edges[i].a;
		line_array[i*2+1] = g.edges[i].b;
	}

	glEnableClientState(GL_VERTEX_ARRAY);
	glEnableClientState(GL_NORMAL_ARRAY);
	glVertexPointer(3, GL_FLOAT, 0, point_array);
	// glNormalPointer(GL_FLOAT, 0, normal_array);
	glDrawElements(GL_LINES, 2*g.numEdges(), GL_UNSIGNED_SHORT, line_array);
	glDisableClientState(GL_NORMAL_ARRAY);
	glDisableClientState(GL_VERTEX_ARRAY);
}

// void drawGraphFaces(planarGraph g){
// 	glEnableClientState(GL_VERTEX_ARRAY);
// 	glEnableClientState(GL_NORMAL_ARRAY);
// 	glVertexPointer(3, GL_FLOAT, 0, g.vertices);
// 	// glNormalPointer(GL_FLOAT, 0, normal_array);
// 	glDrawElements(GL_TRIANGLES, 3*_num_faces, GL_UNSIGNED_SHORT, face_array);
// 	glDisableClientState(GL_NORMAL_ARRAY);
// 	glDisableClientState(GL_VERTEX_ARRAY);
// }
