
var drawGraphLines = function(p, planarGraph){
	var point_array = [];
	for(var i = 0; i < planarGraph.nodes.length; i++){
		var v = planarGraph.nodes[i];
		point_array[i*3+0] = v.x;
		point_array[i*3+1] = v.y;
		point_array[i*3+2] = 0;//v.z;
	}
	var line_array = [];
	for(var i = 0; i < planarGraph.edges.length; i++){
		line_array[i*2+0] = planarGraph.edges[i].node[0].index;
		line_array[i*2+1] = planarGraph.edges[i].node[1].index;
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

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
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
// 		line_array[i*2+0] = planarGraph.edges[i].node[0];
// 		line_array[i*2+1] = planarGraph.edges[i].node[1];
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
