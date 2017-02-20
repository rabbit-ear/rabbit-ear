var editor = function( p ) {
	p.callback = undefined;  // one argument: {start: {x:_, y:_}, end: {x:_, y:_}}

	var paperSize = 500;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var g = new CreasePattern();

	// if mouse is pressed, this is an {x:_,y:_} object
	var mouseDownLocation = undefined;  

	p.snapRadius = 0.08;

	p.cleanIntersections = function(){
		var count = g.cleanIntersections();
		console.log(count);
		return count;
	}
	p.getPlanarGraphObject = function(){
		return g;
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
		p.fill(96, 168, 255, 50);
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
			var mouseXScaled = p.mouseX / paperSize;
			var mouseYScaled = p.mouseY / paperSize;
			if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
			if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;	
			p.line(mouseDownLocation.x, mouseDownLocation.y, mouseXScaled, mouseYScaled);
			p.ellipse(mouseDownLocation.x, mouseDownLocation.y, .01, .01);
			if(p.callback != undefined){
				var object = {
					description:"draw-line",
					data:{ 'start':{'x':mouseDownLocation.x, 'y':mouseDownLocation.y}, 
				             'end':{'x':mouseXScaled, 'y':mouseYScaled } }
				}
				p.callback(object);
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
				g.addEdgeWithVertices(mouseDownLocation.x, mouseDownLocation.y, snapMouseRelease.x, snapMouseRelease.y);
				if(p.callback != undefined){
					var object = {
						description:"add-line",
						data:{ 'start':{'x':mouseDownLocation.x, 'y':mouseDownLocation.y}, 
					             'end':{'x':snapMouseRelease.x, 'y':snapMouseRelease.y } }
					}
					p.callback(object);
				}
			}
		} else{
			if(p.callback != undefined){
				p.callback(undefined);
			}			
		}
		mouseDownLocation = undefined;
	}
};