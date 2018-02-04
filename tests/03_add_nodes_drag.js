var _03_add_nodes_drag = function( p ) {
	p.callback = undefined;  // one argument: {start: {x:_, y:_}, end: {x:_, y:_}}

	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var g = new PlanarGraph();

	// if mouse is pressed, this is an {x:_,y:_} object
	var mouseDownLocation = undefined;  

	p.reset = function(){
		g.clear();
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
		drawCoordinateFrame(p);

		if(mouseDownLocation != undefined){
			var mouseXScaled = p.mouseX / paperSize;
			var mouseYScaled = p.mouseY / paperSize;
			if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
			if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;	
			p.line(mouseDownLocation.x, mouseDownLocation.y, mouseXScaled, mouseYScaled);
			p.ellipse(mouseDownLocation.x, mouseDownLocation.y, .01, .01);
			if(p.callback != undefined){
				p.callback({ 'start':{'x':mouseDownLocation.x, 'y':mouseDownLocation.y}, 
				             'end':{'x':mouseXScaled, 'y':mouseYScaled } });
			}
		}

	}
	p.mousePressed = function(){
		var mouseXScaled = p.mouseX / paperSize;
		var mouseYScaled = p.mouseY / paperSize;
		if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
		if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
		if(mouseXScaled != undefined && mouseYScaled != undefined){
			// mouse was pressed inside of canvas
			mouseDownLocation = {x:mouseXScaled, y:mouseYScaled};
		}
	}

	p.mouseReleased = function(event){
		if(mouseDownLocation != undefined){
			var mouseXScaled = p.mouseX / paperSize;
			var mouseYScaled = p.mouseY / paperSize;
			if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
			if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
			if(mouseXScaled != undefined && mouseYScaled != undefined){
				// mouse was released inside of canvas
				g.newPlanarEdge(mouseDownLocation.x, mouseDownLocation.y, mouseXScaled, mouseYScaled);
			}
		}
		mouseDownLocation = undefined;
		if(p.callback != undefined){
			p.callback(undefined);
		}
	}
};