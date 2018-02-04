var _12_adjacent = function( p ) {
	p.callback = undefined;

	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var cp = new CreasePattern();

	var numEdges = 10;

	p.reset = function(){
		cp.clear();
		for(var i = 0; i < numEdges; i++){
			var x1pos = Math.random();
			var y1pos = Math.random();
			var x2pos = Math.random();
			var y2pos = Math.random();
			cp.newPlanarEdge( x1pos, y1pos, x2pos, y2pos );
		}
		cp.clean();
		// cp.refreshAdjacencies();
		for(var i = 0; i < cp.nodes.length; i++){
			console.log(cp.nodes[i].adjacent);
		}
	}
	p.setup = function(){
		canvas = p.createCanvas(WIDTH, HEIGHT);
		p.reset();
	}

	p.draw = function() {

		//draw
		p.clear();
		p.applyMatrix(paperSize, 0, 0, paperSize, WIDTH*0.5-paperSize*0.5, HEIGHT*0.5-paperSize*0.5);

		p.background(255);
		// draw graph
		p.fill(0);
		p.stroke(0);
		p.strokeWeight(.01);
		drawGraphPoints(p, cp);
		drawGraphLines(p, cp);
		drawCoordinateFrame(p);

		p.stroke(255,0,0);
		for(var n = 0; n < cp.nodes.length; n++){
			var edges = cp.nodes[n].adjacent.edges
			for(var e = 0; e < edges.length; e++){
				var xOff = 0.05 * Math.cos(edges[e].angle);
				var yOff = 0.05 * Math.sin(edges[e].angle);
				p.line(cp.nodes[n].x, cp.nodes[n].y, cp.nodes[n].x + xOff, cp.nodes[n].y + yOff);
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
		}
	}
	p.mouseReleased = function(event){
		var mouseXScaled = p.mouseX / paperSize;
		var mouseYScaled = p.mouseY / paperSize;
		if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
		if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
		if(mouseXScaled != undefined && mouseYScaled != undefined){
			// mouse was released inside of canvas
			p.reset();
		}
	}
};