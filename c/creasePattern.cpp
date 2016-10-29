#include "creasePattern.h"

CreasePattern::CreasePattern(){
}

void CreasePattern::loadPreliminaryBase(){
	Vertex center;
	center.x = 0.5;
	center.y = 0.5;
	center.z = 0.0;

// 4 corners
	Vertex topLeft;
	topLeft.x = 0.0;
	topLeft.y = 0.0;
	topLeft.z = 0.0;

	Vertex topRight;
	topRight.x = 1.0;
	topRight.y = 0.0;
	topRight.z = 0.0;

	Vertex bottomRight;
	bottomRight.x = 1.0;
	bottomRight.y = 1.0;
	bottomRight.z = 0.0;

	Vertex bottomLeft;
	bottomLeft.x = 0.0;
	bottomLeft.y = 1.0;
	bottomLeft.z = 0.0;

// 4 edge midpoints
	Vertex top;
	top.x = 0.5;
	top.y = 0.0;
	top.z = 0.0;

	Vertex right;
	right.x = 1.0;
	right.y = 0.5;
	right.z = 0.0;

	Vertex bottom;
	bottom.x = 0.5;
	bottom.y = 1.0;
	bottom.z = 0.0;

	Vertex left;
	left.x = 0.0;
	left.y = 0.5;
	left.z = 0.0;


	nodes.push_back(center);
	nodes.push_back(topLeft);
	nodes.push_back(topRight);
	nodes.push_back(bottomLeft);
	nodes.push_back(bottomRight);
	nodes.push_back(top);
	nodes.push_back(right);
	nodes.push_back(bottom);
	nodes.push_back(left);

// X lines
	Pair e1;
	e1.a = 0;
	e1.b = 1;

	Pair e2;
	e2.a = 0;
	e2.b = 2;

	Pair e3;
	e3.a = 0;
	e3.b = 3;

	Pair e4;
	e4.a = 0;
	e4.b = 4;

// + lines
	Pair e5;
	e5.a = 0;
	e5.b = 5;

	Pair e6;
	e6.a = 0;
	e6.b = 6;

	Pair e7;
	e7.a = 0;
	e7.b = 7;

	Pair e8;
	e8.a = 0;
	e8.b = 8;

	edges.push_back(e1);
	edges.push_back(e2);
	edges.push_back(e3);
	edges.push_back(e4);
	edges.push_back(e5);
	edges.push_back(e6);
	edges.push_back(e7);
	edges.push_back(e8);
}

