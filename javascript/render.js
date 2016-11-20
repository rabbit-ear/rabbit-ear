
var drawGraphLines = function(p, planarGraph){
	var point_array = [];
	for(var i = 0; i < planarGraph.nodes.length; i++){
		var v = planarGraph.nodes[i];
		point_array[i*3+0] = v.x;
		point_array[i*3+1] = v.y;
		point_array[i*3+2] = v.z;
	}
	var line_array = [];
	for(var i = 0; i < planarGraph.edges.length; i++){
		line_array[i*2+0] = planarGraph.edges[i].a;
		line_array[i*2+1] = planarGraph.edges[i].b;
	}
	// DRAW THINGS
	for(var i = 0; i < line_array.length*0.5; i++){
		p.line(point_array[ line_array[i*2+0]*3+0 ], point_array[ line_array[i*2+0]*3+1 ], 
		     point_array[ line_array[i*2+1]*3+0 ], point_array[ line_array[i*2+1]*3+1 ] );
	}
}

var drawCoordinateFrame = function(p){
	// draws a box around the (0,0) to (1,1) square space
	var corners = [0.0, 0.0, 0.0,
	               0.0, 1.0, 0.0,
	               1.0, 1.0, 0.0,
	               1.0, 0.0, 0.0 ];
	var cornerLines = [0, 1, 1, 2, 2, 3, 3, 0];
	for(var a = 0; a < 4; a++){
		var b = (a+1)%4;
		p.line(corners[a*3+0], corners[a*3+1],
		       corners[b*3+0], corners[b*3+1]);
	}
	// setColor(0.2, 0.2, 0.2);
	// DRAW LINES
}

var drawGraphPoints = function(p, planarGraph){
	var point_array = [];
	var numPoints = 0;
	for(var i = 0; i < planarGraph.nodes.length; i++){
		var v = planarGraph.nodes[i];
		point_array[i*3+0] = v.x;
		point_array[i*3+1] = v.y;
		point_array[i*3+2] = v.z;
		numPoints += 1;
	}
	// DRAW THINGS
	for(var i = 0; i < numPoints; i++){
		p.ellipse(point_array[i*3+0], point_array[i*3+1], .01, .01);
	}
}


// function drawCoordinateFrame(){
// 	// draws a box around the (0,0) to (1,1) square space
// 	var corners = [0.0, 0.0, 0.0,
// 	               0.0, 1.0, 0.0,
// 	               1.0, 1.0, 0.0,
// 	               1.0, 0.0, 0.0 ];
// 	var cornerLines = [0, 1, 1, 2, 2, 3, 3, 0];
// 	for(var a = 0; a < 4; a++){
// 		var b = (a+1)%4;
// 		line(corners[a*3+0], corners[a*3+1],
// 		     corners[b*3+0], corners[b*3+1]);
// 	}
// 	// setColor(0.2, 0.2, 0.2);
// 	// DRAW LINES
// }

// function drawGraphPoints(planarGraph){
// 	var point_array = [];
// 	var numPoints = 0;
// 	for(var i = 0; i < planarGraph.nodes.length; i++){
// 		var v = planarGraph.nodes[i];
// 		point_array[i*3+0] = v.x;
// 		point_array[i*3+1] = v.y;
// 		point_array[i*3+2] = v.z;
// 		numPoints += 1;
// 	}
// 	// DRAW THINGS
// 	for(var i = 0; i < numPoints; i++){
// 		ellipse(point_array[i*3+0], point_array[i*3+1], .01, .01);
// 	}
// }

// function drawGraphLines(planarGraph){
// 	var point_array = [];
// 	for(var i = 0; i < planarGraph.nodes.length; i++){
// 		var v = planarGraph.nodes[i];
// 		point_array[i*3+0] = v.x;
// 		point_array[i*3+1] = v.y;
// 		point_array[i*3+2] = v.z;
// 	}
// 	var line_array = [];
// 	for(var i = 0; i < planarGraph.edges.length; i++){
// 		line_array[i*2+0] = planarGraph.edges[i].a;
// 		line_array[i*2+1] = planarGraph.edges[i].b;
// 	}
// 	// DRAW THINGS
// 	for(var i = 0; i < line_array.length*0.5; i++){
// 		line(point_array[ line_array[i*2+0]*3+0 ], point_array[ line_array[i*2+0]*3+1 ], 
// 		     point_array[ line_array[i*2+1]*3+0 ], point_array[ line_array[i*2+1]*3+1 ] );
// 	}
// }

// void drawGraphFaces(planarGraph g){
// 	glEnableClientState(GL_VERTEX_ARRAY);
// 	glEnableClientState(GL_NORMAL_ARRAY);
// 	glVertexPointer(3, GL_FLOAT, 0, g.vertices);
// 	// glNormalPointer(GL_FLOAT, 0, normal_array);
// 	glDrawElements(GL_TRIANGLES, 3*_num_faces, GL_UNSIGNED_SHORT, face_array);
// 	glDisableClientState(GL_NORMAL_ARRAY);
// 	glDisableClientState(GL_VERTEX_ARRAY);
// }
