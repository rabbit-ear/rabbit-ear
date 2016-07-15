#include <vector>
#include "world.c"
#include "../planarGraph.cpp"
using namespace std;

#define w 3
#define h 3
PlanarGraph graphs[w*h];
vector <unsigned int> sortedIndices[9];
vector <float> interiorAngles[9];

void buildGeometry(PlanarGraph *g){
	g->clear();
	// this is the center point
	Vertex origin;
	origin.x = origin.y = 0.0;
	origin.z = 0.0;
	g->addNode(origin);
	// these are 4 outer points which connect to the center
	int numEdgeVertices = arc4random()%3*2 + 4;
	for(int i = 0; i < numEdgeVertices; i++){
		Vertex v;
		v.x = arc4random() % 1000 / 1000.0 - .5;
		v.y = arc4random() % 1000 / 1000.0 - .5;
		v.z = 0.0;
		g->addNode(v);
	}
	// segment lines that connect outer points to the center point
	for(int i = 1; i < g->numNodes(); i++){
		Pair e;
		e.a = 0;
		e.b = i;
		g->addEdge(e);
	}
}

float oddEvenSumRatio(vector<float> angles){
	float odd = 0.0;
	float even = 0.0;
	for(int i = 0; i < angles.size(); i++){
		if(i%2)
			odd += angles[i];
		else
			even += angles[i];
	}
	return odd - even;
}

void setup(){
	glPointSize(10);
	POV = POLAR;
	ZOOM = 2.5;
	GRID = 0;
	GROUND = 0;

	for(int i = 0; i < w*h; i++){
		buildGeometry(&graphs[i]);
		sortedIndices[i].clear();
		interiorAngles[i].clear();
		sortedIndices[i] = graphs[i].connectingVertexIndicesSortedRadially(0);
		interiorAngles[i] = graphs[i].connectingVertexInteriorAngles(0, sortedIndices[i] );
		// float balance = oddEvenSumRatio(interiorAngles[i]);
		// printf("odd and even\n(%f)\n", balance);
		float equilibrium = oddEvenSumRatio(interiorAngles[i]);
		equilibrium /= 6.28;
		float w1 = (1.0 + equilibrium)*.5;
		float w2 = 1.0 - w1;
		printf("odd and even\n(%f)(%f:%f)\n", equilibrium, w1, w2);
	}
	// printf("SOLVED!\n--- vertices:\n");
	// for(int i = 0; i < graph.numV; i++)
	// 	printf("(%d):(%.2f,%.2f) ",i, graph.nodes[i].x, graph.nodes[i].y);
	// printf("\n--- sorted indices:\n");
	// for(int i = 0; i < sortedIndices.size(); i++)
	// 	printf("(%d):%d ",i, sortedIndices[i]);
	// printf("\n--- interior angle measurements\n");
	// for(int i = 0; i < interiorAngles.size(); i++)
	// 	printf("(%d):%f ",i, interiorAngles[i] / 3.1415 * 180);
	// printf("\n");
	// interiorAngles
	// float balance = oddEvenSumRatio(interiorAngles);
	// printf("odd and even\n(%f)\n", balance);
}

void update(){
	for(int i = 0; i < w*h; i++){
		float equilibrium = oddEvenSumRatio(interiorAngles[i]);
		if(fabs(equilibrium) > 0.1){
			// purturb a random index
			unsigned int randomIndex = arc4random()%(interiorAngles[i].size()-1)+1;
			float randomAngle = (arc4random()%2-.5)*.05;
			graphs[i].rotateEdge(randomIndex, 0, randomAngle);

			// recalculate changes to angles
			// sortedIndices = graph.connectingVertexIndicesSortedRadially(0);
			interiorAngles[i] = graphs[i].connectingVertexInteriorAngles(0, sortedIndices[i] );

			float newEquilibrium = oddEvenSumRatio(interiorAngles[i]);
			if(fabs(newEquilibrium) > fabs(equilibrium)){
				graphs[i].rotateEdge(randomIndex, 0, -randomAngle);
				interiorAngles[i] = graphs[i].connectingVertexInteriorAngles(0, sortedIndices[i] );
			}
		}
	}
}

void draw(){
	glPushMatrix();
	glTranslatef(0.0, 0.0, 0.001);

	for(int k = 0; k < w*h; k++){
		// for(int i = 0; i < sortedIndices[k].size(); i++){
		// 	glColor3f(1.0, ((float)i)/sortedIndices[k].size(), 0.0);
		// 	drawPoint(graphs[k].nodes[sortedIndices[k][i]].x, graphs[k].nodes[sortedIndices[k][i]].y, 0.0);
		// }
		glPushMatrix();

		glTranslatef( (-1 + (k%3))*1.33 , (-1 + floor(k/3.0))*1.33 , 0.0);

		for(int i = 0; i < sortedIndices[k].size(); i++){
			float vertices[9];
			vertices[0] = graphs[k].nodes[sortedIndices[k][i]].x;
			vertices[1] = graphs[k].nodes[sortedIndices[k][i]].y;
			vertices[2] = graphs[k].nodes[sortedIndices[k][i]].z;
			vertices[3] = graphs[k].nodes[0].x;
			vertices[4] = graphs[k].nodes[0].y;
			vertices[5] = graphs[k].nodes[0].z;
			vertices[6] = graphs[k].nodes[sortedIndices[k][(i+1)%sortedIndices[k].size()]].x;
			vertices[7] = graphs[k].nodes[sortedIndices[k][(i+1)%sortedIndices[k].size()]].y;
			vertices[8] = graphs[k].nodes[sortedIndices[k][(i+1)%sortedIndices[k].size()]].z;

			glColor3f((i%2)*.5+.5, (i%2)*.5+.5, (i%2)*.5+.5 );
			// glEnableClientState(GL_VERTEX_ARRAY);
			// glVertexPointer(3, GL_FLOAT, 0, graphs[k].nodes);
			// glDrawElements(GL_TRIANGLE_FAN, 9, GL_UNSIGNED_SHORT, vertices);
			// glDisableClientState(GL_VERTEX_ARRAY);
			glEnableClientState(GL_VERTEX_ARRAY);
			glVertexPointer(3, GL_FLOAT, 0, vertices);
			glDrawArrays(GL_TRIANGLES, 0, 3);
			glDisableClientState(GL_VERTEX_ARRAY);
		}
		// glColor3f(0.2, 0.2, 1.0);
		// glEnableClientState(GL_VERTEX_ARRAY);
		// glVertexPointer(3, GL_FLOAT, 0, graphs[k].nodes);
		// glDrawElements(GL_LINES, graphs[k].numE*2, GL_UNSIGNED_SHORT, graphs[k].e);
		// glDisableClientState(GL_VERTEX_ARRAY);

		float equilibrium = oddEvenSumRatio(interiorAngles[k]) / 6.283;

		float w1 = (1.0 + equilibrium)*.5;
		float w2 = 1.0 - w1;
		glColor3f(.5, .5, .5);
		drawRect(-w1, -.75, w1, 0.1);
		glColor3f(1.0, 1.0, 1.0);
		drawRect(0.0, -.75, w2, 0.1);

		glPopMatrix();
	}
	glPopMatrix();
}

void keyDown(unsigned int key){
	if(key == SPACE_BAR){
		for(int i = 0; i < w*h; i++){
			buildGeometry(&graphs[i]);
			sortedIndices[i].clear();
			interiorAngles[i].clear();
			sortedIndices[i] = graphs[i].connectingVertexIndicesSortedRadially(0);
			interiorAngles[i] = graphs[i].connectingVertexInteriorAngles(0, sortedIndices[i] );
		float equilibrium = oddEvenSumRatio(interiorAngles[i]);
		equilibrium /= 6.28;

		float w1 = (1.0 + equilibrium)*.5;
		float w2 = 1.0 - w1;
		printf("odd and even\n(%f)(%f:%f)\n", equilibrium, w1, w2);
		graphs[i].log();
		}
	}
}

void keyUp(unsigned int key){}
void mouseDown(unsigned int button){}
void mouseUp(unsigned int button){}
void mouseMoved(int x, int y){}
