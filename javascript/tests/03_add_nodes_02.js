var test03_02 = function( p ) {
	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var g = new PlanarGraph();
	p.numLines = 0;

	var mouseDownLocation = undefined;

	var callback = undefined;  // callback function- format callback(x1, y1, x2, y2);

	p.reset = function(){
		g.clear();
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
		drawCoordinateFrame(p);

		// intersections
		// p.fill(255, 0, 0);
		// p.noStroke();
		// for(var i = 0; i < intersections.length; i++){
		// 	p.ellipse(intersections[i].x, intersections[i].y, .03, .03);
		// }

		if(mouseDownLocation != undefined){
			var mouseXScaled = p.mouseX / paperSize;
			var mouseYScaled = p.mouseY / paperSize;
			if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
			if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;	
			p.line(mouseDownLocation.x, mouseDownLocation.y, mouseXScaled, mouseYScaled);
			p.ellipse(mouseDownLocation.x, mouseDownLocation.y, .01, .01);
			if(callback != undefined){
				callback(mouseDownLocation.x, mouseDownLocation.y, mouseXScaled, mouseYScaled);
			}
		}

	}
	p.mousePressed = function(){
		var mouseXScaled = p.mouseX / paperSize;
		var mouseYScaled = p.mouseY / paperSize;
		if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
		if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;

		mouseDownLocation = {x:mouseXScaled, y:mouseYScaled};
	}

	p.mouseReleased = function(event){
		if(mouseDownLocation != undefined){
			var mouseXScaled = p.mouseX / paperSize;
			var mouseYScaled = p.mouseY / paperSize;
			if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
			if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
			if(mouseXScaled != undefined && mouseYScaled != undefined){
				g.addEdgeWithVertices(mouseDownLocation.x, mouseDownLocation.y, mouseXScaled, mouseYScaled);
			}
		}
		mouseDownLocation = undefined;
	}
};