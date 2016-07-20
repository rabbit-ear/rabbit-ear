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
	static float corners[12] = {0.0, 0.0, 0.0,
	                            0.0, 1.0, 0.0,
	                            1.0, 1.0, 0.0,
	                            1.0, 0.0, 0.0 };
	static unsigned short cornerLines[8] = {0, 1,
	                                        1, 2,
	                                        2, 3,
	                                        3, 0 };

	glLineWidth(1);
	glColor3f(0.2, 0.2, 0.2);
	// DRAW LINES
	glEnableClientState(GL_VERTEX_ARRAY);
	glEnableClientState(GL_NORMAL_ARRAY);
	glVertexPointer(3, GL_FLOAT, 0, corners);
	// glNormalPointer(GL_FLOAT, 0, _platonic_point_arrays[ solidType ]);
	glDrawElements(GL_LINES, 2*4, GL_UNSIGNED_SHORT, cornerLines);
	glDisableClientState(GL_NORMAL_ARRAY);
	glDisableClientState(GL_VERTEX_ARRAY);

	// glPointSize(5);
	// glColor3f(0.33, 0.33, 0.33);
	// // DRAW POINTS
	// glEnableClientState(GL_VERTEX_ARRAY);
	// glEnableClientState(GL_NORMAL_ARRAY);
	// glVertexPointer(3, GL_FLOAT, 0, corners);
	// // glNormalPointer(GL_FLOAT, 0, _platonic_point_arrays[ solidType ]);
	// glDrawArrays(GL_POINTS, 0, 4);
	// glDisableClientState(GL_NORMAL_ARRAY);
	// glDisableClientState(GL_VERTEX_ARRAY);
}

// void drawPlatonicSolidFaces(planarGraph g){
// 	glEnableClientState(GL_VERTEX_ARRAY);
// 	glEnableClientState(GL_NORMAL_ARRAY);
// 	glVertexPointer(3, GL_FLOAT, 0, g.vertices);
// 	// glNormalPointer(GL_FLOAT, 0, _platonic_point_arrays[ solidType ]);
// 	glDrawElements(GL_TRIANGLES, 3*_platonic_num_faces[solidType], GL_UNSIGNED_SHORT, _platonic_face_array[solidType]);
// 	glDisableClientState(GL_NORMAL_ARRAY);
// 	glDisableClientState(GL_VERTEX_ARRAY);
// }
// void drawPlatonicSolidLines(planarGraph g){
// 	glEnableClientState(GL_VERTEX_ARRAY);
// 	glEnableClientState(GL_NORMAL_ARRAY);
// 	glVertexPointer(3, GL_FLOAT, 0, g.vertices);
// 	glNormalPointer(GL_FLOAT, 0, _platonic_point_arrays[ solidType ]);
// 	glDrawElements(GL_LINES, 2*_platonic_num_lines[solidType], GL_UNSIGNED_SHORT, _platonic_line_array[solidType]);
// 	glDisableClientState(GL_NORMAL_ARRAY);
// 	glDisableClientState(GL_VERTEX_ARRAY);
// }


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
	// glNormalPointer(GL_FLOAT, 0, _platonic_point_arrays[ solidType ]);
	glDrawArrays(GL_POINTS, 0, g.numNodes());
	glDisableClientState(GL_NORMAL_ARRAY);
	glDisableClientState(GL_VERTEX_ARRAY);
}
