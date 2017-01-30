var _03_add_nodes_radial = function( p ) {
	p.callback = undefined;

	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var g = new PlanarGraph();

	// if mouse is pressed, this is an {x:_,y:_} object
	var mouseDownLocation = undefined;  

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

		if(mouseDownLocation != undefined){
			var mouseXScaled = p.mouseX / paperSize;
			var mouseYScaled = p.mouseY / paperSize;
			if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
			if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;	
			p.line(g.nodes[0].x, g.nodes[0].y, mouseXScaled, mouseYScaled);
			if(p.callback != undefined){
				p.callback({ 'start':{'x':g.nodes[0].x, 'y':g.nodes[0].y}, 
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
				g.addEdgeFromVertex(0, mouseXScaled, mouseYScaled);
				// g.addEdgeWithVertices(mouseDownLocation.x, mouseDownLocation.y, mouseXScaled, mouseYScaled);
			}
		}
		mouseDownLocation = undefined;
		if(p.callback != undefined){
			p.callback(undefined);
		}
	}

};