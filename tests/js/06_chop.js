var test06 = function(p){
	p.callback = undefined;  // one argument: intersection point

	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;
	var highlighted1 = false;
	var highlighted2 = false;
	p.setHighlight1 = function(on){ highlighted1 = on; }
	p.setHighlight2 = function(on){ highlighted2 = on; }

	var chopped = false;

	var g = new PlanarGraph();	
	var intersections = [];
	var bounds = [
		{xmin:0.0, xmax:0.33, ymin:0.0, ymax:0.33},
		{xmin:0.66, xmax:1.0, ymin:0.66, ymax:1.0},
		{xmin:0.66, xmax:1.0, ymin:0.0, ymax:0.33},
		{xmin:0.0, xmax:0.33, ymin:0.66, ymax:1.0},
		{xmin:0.0, xmax:1.0, ymin:0.0, ymax:1.0}
	];

	function drawAnX(graph){
		graph.clear();
		var w = 0.33;
		graph.newPlanarEdge(Math.random()*w, Math.random()*w, Math.random()*w+(1-w), Math.random()*w+(1-w));
		graph.newPlanarEdge(Math.random()*w, Math.random()*w+(1-w), Math.random()*w+(1-w), Math.random()*w);
	}

	function reset(){
		g.edges = [];
		g.nodes.pop();
		g.addEdgeFromExistingVertices(0, 1);
		g.addEdgeFromExistingVertices(2, 3);
		intersections = g.getEdgeIntersectionsWithEdge(0);
	}

	p.setup = function(){
		canvas = p.createCanvas(WIDTH, HEIGHT);
		p.strokeWeight(.01);
		drawAnX(g);
	}

	p.draw = function() {
		// update
		for(var i = 0; i < 4; i++){
			var speed = 0.002;
			var mag = 0.02;
			var mult1 = Math.pow(i*2, 1.5);
			var mult2 = Math.pow(i*2.3, 1.333);
			g.nodes[i].x += mag * (p.noise(i*mult1+1.3*(i+1)+p.millis()*speed) - 0.47); // noise() leans positive for some reason 
			g.nodes[i].y += mag * (p.noise(i*mult2+5*(i+1)+p.millis()*speed) - 0.47);
			if(g.nodes[i].x < bounds[i].xmin) g.nodes[i].x = bounds[i].xmin;
			if(g.nodes[i].x > bounds[i].xmax) g.nodes[i].x = bounds[i].xmax;
			if(g.nodes[i].y < bounds[i].ymin) g.nodes[i].y = bounds[i].ymin;
			if(g.nodes[i].y > bounds[i].ymax) g.nodes[i].y = bounds[i].ymax;
		}
		intersections = g.getEdgeIntersectionsWithEdge(0);
		if(!chopped){
		if(p.callback != undefined){
			p.callback(intersections[0]);
		}
	}


		// draw
		p.clear();
		p.applyMatrix(paperSize, 0, 0, paperSize, WIDTH*0.5-paperSize*0.5, HEIGHT*0.5-paperSize*0.5);

		p.fill(0, 0, 0);
		p.stroke(0, 0, 0);
		// drawCoordinateFrame(p);
		// drawGraphPoints(p, g);
		if(g.edges.length == 2)  p.draw1();
		else                     p.draw2();
		// drawGraphLines(p, g);
		for(var i = 0; i < intersections.length; i++){
			p.fill(255, 0, 0);
			p.noStroke();
			p.ellipse(intersections[i].x, intersections[i].y, .03, .03);
		}
	}

	p.draw1 = function(){
		if(highlighted1) p.stroke(255, 0, 0);
		else p.stroke(0, 0, 0);
		p.ellipse(g.nodes[g.edges[0].node[0]].x, g.nodes[g.edges[0].node[0]].y, 0.01, 0.01);
		p.ellipse(g.nodes[g.edges[0].node[1]].x, g.nodes[g.edges[0].node[1]].y, 0.01, 0.01);
		p.line(g.nodes[g.edges[0].node[0]].x, g.nodes[g.edges[0].node[0]].y,
			 g.nodes[g.edges[0].node[1]].x, g.nodes[g.edges[0].node[1]].y);

		if(highlighted2) p.stroke(255, 0, 0);
		else p.stroke(0, 0, 0);
		p.ellipse(g.nodes[g.edges[1].node[0]].x, g.nodes[g.edges[1].node[0]].y, 0.01, 0.01);
		p.ellipse(g.nodes[g.edges[1].node[1]].x, g.nodes[g.edges[1].node[1]].y, 0.01, 0.01);
		p.line(g.nodes[g.edges[1].node[0]].x, g.nodes[g.edges[1].node[0]].y,
			 g.nodes[g.edges[1].node[1]].x, g.nodes[g.edges[1].node[1]].y);

	}
	p.draw2 = function(){
		drawGraphPoints(p, g);
		drawGraphLines(p, g);
	}

	p.mouseReleased = function(){
		var mouseXScaled = p.mouseX / paperSize;
		var mouseYScaled = p.mouseY / paperSize;
		if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
		if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
		if(mouseXScaled != undefined && mouseYScaled != undefined){
			// mouse was released inside of canvas
		} 

		if(chopped){
			reset();
			chopped = false;
			// if(p.callback != undefined){
			// 	p.callback(undefined);
			// }
		}
	}

	p.mousePressed = function(){
		var mouseXScaled = p.mouseX / paperSize;
		var mouseYScaled = p.mouseY / paperSize;
		if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
		if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
		if(mouseXScaled != undefined && mouseYScaled != undefined){
			// mouse was pressed inside of canvas
			chopped = true;
			var intersections = g.chop();
			if(intersections.length){
				if(p.callback != undefined){
					p.callback(undefined);
				}
			}

		}
	}
};