var editor = function( p ) {
	p.callback = undefined;  // one argument: {start: {x:_, y:_}, end: {x:_, y:_}}

	var paperSize = 500;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var g = new CreasePattern();

	// if mouse is pressed, this is an {x:_,y:_} object
	var mouseDownLocation = undefined;  

	p.snapRadius = 0.08;

	p.loadBase = function(base){
		console.log(base);
		switch (base){
			case 'kite': g.kiteBase(); break;
			case 'fish': g.fishBase(); break;
			case 'bird': g.birdBase(); break;
			case 'frog': g.frogBase(); break;
		}		
	}
	p.clearCP = function(){  g.clear();  }

	p.cleanIntersections = function(){
		// var count = g.cleanIntersections();
		g.clean();
		// doCallback('clean', {'intersections':count} );
	}
	p.getPlanarGraphObject = function(){
		return g;
	}
	p.makeSVGBlob = function(){
		return g.makeSVGBlob();
	}

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
		p.fill(0, 0, 0, 10);
		p.noStroke();
		for(var i = 0; i < g.interestingPoints.length; i++){
			var pt = g.interestingPoints[i];
			p.ellipse(pt.x, pt.y, p.snapRadius*2.0);
		}

		p.fill(0);
		p.stroke(0);
		p.strokeWeight(.002);
		drawGraphPoints(p, g);
		drawGraphLines(p, g);
		drawCoordinateFrame(p);

		if(mouseDownLocation != undefined){
			// a line is being dragged and added right now
			var mouseXScaled = p.mouseX / paperSize;
			var mouseYScaled = p.mouseY / paperSize;
			if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
			if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
			p.line(mouseDownLocation.x, mouseDownLocation.y, mouseXScaled, mouseYScaled);
			p.ellipse(mouseDownLocation.x, mouseDownLocation.y, .01, .01);
			doCallback('draw-line', {'start':mouseDownLocation, 'end':{'x':mouseXScaled, 'y':mouseYScaled }});
		}
	}
	p.mousePressed = function(){
		var mouseXScaled = p.mouseX / paperSize;
		var mouseYScaled = p.mouseY / paperSize;
		if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
		if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
		if(mouseXScaled != undefined && mouseYScaled != undefined){
			// mouse was pressed inside of canvas
			mouseDownLocation = g.trySnapVertex({x:mouseXScaled, y:mouseYScaled}, p.snapRadius);
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
				var snapMouseRelease = g.trySnapVertex({'x':mouseXScaled, 'y':mouseYScaled}, p.snapRadius);
				addLine(mouseDownLocation, snapMouseRelease);
			}
		} else{
			if(p.callback != undefined){
				p.callback(undefined);
			}			
		}
		mouseDownLocation = undefined;
	}

	addLine = function(start, end){
		g.addEdgeWithVertices(start.x, start.y, end.x, end.y);
		doCallback('add-line', {'start':start,'end':end} );
		// var newIntersections = g.cleanIntersections();
		// console.log(newIntersections);
		// doCallback('clean', {'intersections':newIntersections} );
		g.clean();
	}

	doCallback = function(description, data){
		if(p.callback != undefined){
			p.callback( {'description':description,'data':data} );
		}
	}
};