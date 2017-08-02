var test07 = function(p){
	p.callback = undefined;  // one argument: [all intersection points]

	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var g = new PlanarGraph();
	var intersections = [];
	var chopOn = false;
	var chopI = 0;

	function fullPageCreases(count){
		g.clear();
		for(var i = 0; i < count; i++){
			if(Math.random() < 0.5){
				// horizontal: right pointing, or left pointing
				if(Math.random() < 0.5) g.addEdgeWithVertices(0, Math.random(), 1, Math.random());
				else                    g.addEdgeWithVertices(1, Math.random(), 0, Math.random());
			} else{
				// vertical: down pointing, or up pointing
				if(Math.random() < 0.5) g.addEdgeWithVertices(Math.random(), 0, Math.random(), 1);
				else                    g.addEdgeWithVertices(Math.random(), 1, Math.random(), 0);
			}
		}
	}

	p.reset = function(){
		g.clear();
		fullPageCreases(20);
	}
	p.setup = function(){
		canvas = p.createCanvas(WIDTH, HEIGHT);
		p.strokeWeight(.005);
		p.reset();
	}

	function chopIncrement(inp){
		for(var i = inp; i <inp+5; i++){
			if(i < g.edges.length){
				var intersects = g.getEdgeIntersectionsWithEdge(i);
				while(intersects.length > 0){
					var newIntersectionIndex = g.nodes.length;
					g.addNode({'x':intersects[0].x, 'y':intersects[0].y});
					g.addEdgeFromExistingVertices(g.nodes.length-1, intersects[0].e1n1);
					g.addEdgeFromExistingVertices(g.nodes.length-1, intersects[0].e1n2);
					g.addEdgeFromExistingVertices(g.nodes.length-1, intersects[0].e2n1);
					g.addEdgeFromExistingVertices(g.nodes.length-1, intersects[0].e2n2);
					g.removeEdgeBetween(intersects[0].e1n1, intersects[0].e1n2);
					g.removeEdgeBetween(intersects[0].e2n1, intersects[0].e2n2);
					var intersects = g.getEdgeIntersectionsWithEdge(i);
				}
			}
		}
	}
	p.draw = function() {
		// draw
		p.clear();
		p.applyMatrix(paperSize, 0, 0, paperSize, WIDTH*0.5-paperSize*0.5, HEIGHT*0.5-paperSize*0.5);
		
		p.fill(0, 0, 0);
		p.stroke(0, 0, 0);
		// drawCoordinateFrame(p);
		drawGraphPoints(p, g);
		p.stroke(0, 0, 0, 30);
		drawGraphLines(p, g);
	}
	p.mouseReleased = function(){
		var mouseXScaled = p.mouseX / paperSize;
		var mouseYScaled = p.mouseY / paperSize;
		if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
		if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
		if(mouseXScaled != undefined && mouseYScaled != undefined){
			// mouse was released inside of canvas
			p.reset();
			if(p.callback != undefined){
				p.callback(undefined);
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
			intersections = g.chop();
			if(p.callback != undefined){
				p.callback(intersections);
			}
		}
	}
};