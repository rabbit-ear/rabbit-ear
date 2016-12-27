var test03_03 = function( p ) {
	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var g = new PlanarGraph();
	p.numLines = 0;

	p.reset = function(){
		g.clear();
		g.addNode({x:0.5, y:0.5});
	}
	p.setup = function(){
		canvas = p.createCanvas(WIDTH, HEIGHT);
		p.reset();
		// noLoop();
		// frameRate(10);
	}
	p.draw = function() {
		p.clear();
		p.applyMatrix(paperSize, 0, 0, paperSize, WIDTH*0.5-paperSize*0.5, HEIGHT*0.5-paperSize*0.5);

		p.background(255);
		p.fill(0);
		p.stroke(0);
		p.strokeWeight(.01);
		drawGraphPoints(p, g);
		drawGraphLines(p, g);
		p.stroke(0);
		drawCoordinateFrame(p);

		// intersections
		p.fill(255, 0, 0);
		p.noStroke();
		for(var i = 0; i < intersections.length; i++){
			p.ellipse(intersections[i].x, intersections[i].y, .03, .03);
		}
	}
	p.mousePressed = function(){
		var mouseXScaled = p.mouseX / paperSize;
		var mouseYScaled = p.mouseY / paperSize;
		if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
		if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
		// closestNode = g.getClosestNode(mouseXScaled, mouseYScaled);
		// if(p.mouseMovedCallback != undefined)
		// 	p.mouseMovedCallback(mouseXScaled, mouseYScaled);

		g.addEdgeFromVertex(0, mouseXScaled, mouseYScaled);
	}
};