var _10_clean = function( p ) {
	p.callback = undefined;  // one argument: _

	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var g = new PlanarGraph();

	var numLines = 30;

	VERTEX_DUPLICATE_EPSILON = 0.021;

	p.reset = function(){
		g.clear();
		var lineW = 0.2;
		for(var i = 0; i < numLines; i++){
			var xpos = Math.pow(1.15,i)/numLines*0.1;
			var ypos = (i+1)/(numLines+1);
			// g.addEdgeWithVertices( 0.5 + xpos, ypos, 0.5 + (xpos+lineW), ypos );
			// g.addEdgeWithVertices( 0.5 - xpos, ypos, 0.5 - (xpos+lineW), ypos );
			g.addEdgeWithVertices( 0.5 + xpos, 1.0-ypos, 1.0, 1.0-ypos );
			g.addEdgeWithVertices( 0.5 - xpos, 1.0-ypos, 0.0, 1.0-ypos );
		}
	}
	p.setup = function(){
		canvas = p.createCanvas(WIDTH, HEIGHT);
		p.reset();
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
		// drawCoordinateFrame(p);
	}
	p.mousePressed = function(){
		var mouseXScaled = p.mouseX / paperSize;
		var mouseYScaled = p.mouseY / paperSize;
		if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
		if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
		if(mouseXScaled != undefined && mouseYScaled != undefined){
			// mouse was pressed inside of canvas
			g.clean();
		}
	}

	p.mouseReleased = function(event){
		p.reset();
		var mouseXScaled = p.mouseX / paperSize;
		var mouseYScaled = p.mouseY / paperSize;
		if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
		if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
		if(mouseXScaled != undefined && mouseYScaled != undefined){
			// mouse was released inside of canvas
		}
	}
};