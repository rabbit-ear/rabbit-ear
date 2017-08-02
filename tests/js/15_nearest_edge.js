var p5_nearest_edge = function(p) {
	p.callback = undefined;
	// var WIDTH = this.canvas.parentElement.offsetWidth;
	// var HEIGHT = this.canvas.parentElement.offsetHeight;
	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;
	// myp5.canvas.parentElement.offsetWidth
	var mouseXScaled;
	var mouseYScaled;

	var g = new CreasePattern();
	var closestEdge = undefined;

	function reset(){
		g.clear();
		g.fishBase();
	}

	p.setup = function(){
		canvas = p.createCanvas(WIDTH, HEIGHT);
		p.strokeWeight(.01);
		reset();
	}

	p.draw = function() {
		p.clear();
		p.applyMatrix(paperSize, 0, 0, paperSize, WIDTH*0.5-paperSize*0.5, HEIGHT*0.5-paperSize*0.5);		
		p.fill(0, 0, 0);
		p.stroke(0, 0, 0);
		// drawCoordinateFrame(p);
		drawGraphPoints(p, g);
		drawGraphLines(p, g);
		if(closestEdge != undefined && closestEdge.edge != undefined){
			p.stroke(255, 0, 0);
			p.fill(255, 0, 0);
			p.line(closestEdge.edge.node[0].x, closestEdge.edge.node[0].y, 
			       closestEdge.edge.node[1].x, closestEdge.edge.node[1].y );
			p.ellipse(closestEdge.edge.node[0].x, closestEdge.edge.node[0].y, .01, .01);
			p.ellipse(closestEdge.edge.node[1].x, closestEdge.edge.node[1].y, .01, .01);

			p.stroke(0, 0, 0);
			p.fill(0, 0, 0);
			p.line(mouseXScaled, mouseYScaled, closestEdge.x, closestEdge.y);
			p.ellipse(closestEdge.x, closestEdge.y, .02, .02);
		}
	}

	p.mouseMoved = function(event){
		// var mouseX = event.screenX;
		// var mouseX = (event.clientX - WIDTH*0.5 + paperSize*0.5) / paperSize;
		// var mouseY = (event.clientY - HEIGHT*0.5 + paperSize*0.5) / paperSize;
		mouseXScaled = p.mouseX / paperSize;
		mouseYScaled = p.mouseY / paperSize;
		if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
		if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
		closestEdge = g.getNearestEdge(mouseXScaled, mouseYScaled);
		if(p.callback != undefined)
			p.callback({'x':mouseXScaled, 'y':mouseYScaled, 'nearest':closestEdge});
	}

	p.mouseReleased = function(){
		reset();
	}
};