var test07 = function(p){
	p.callback = undefined;  // one argument: [all intersection points]

	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var g = new PlanarGraph();	
	var intersections = [];
	var chopOn = false;
	var chopI = 0;

	var ANIMATIONS = false;

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
		fullPageCreases(20);
	}

	p.setup = function(){
		canvas = p.createCanvas(WIDTH, HEIGHT);
		p.strokeWeight(.005);
		reset();
	}

	function chopIncrement(inp){
		for(var i = inp; i <inp+5; i++){
			if(i < g.edges.length){
				var intersections = g.getEdgeIntersectionsWithEdge(i);
				while(intersections.length > 0){
					var newIntersectionIndex = g.nodes.length;
					g.addNode({'x':intersections[0].x, 'y':intersections[0].y});
					g.addEdgeFromExistingVertices(g.nodes.length-1, intersections[0].e1n1);
					g.addEdgeFromExistingVertices(g.nodes.length-1, intersections[0].e1n2);
					g.addEdgeFromExistingVertices(g.nodes.length-1, intersections[0].e2n1);
					g.addEdgeFromExistingVertices(g.nodes.length-1, intersections[0].e2n2);
					g.removeEdgeBetween(intersections[0].e1n1, intersections[0].e1n2);
					g.removeEdgeBetween(intersections[0].e2n1, intersections[0].e2n2);
					var intersections = g.getEdgeIntersectionsWithEdge(i);
				}
			}
		}
	}

	p.draw = function() {
		// // uncomment for animations
		if(ANIMATIONS){
			if(chopOn){
				chopIncrement(chopI)
				chopI+=5;
			}
			if(chopI >= g.edges.length){
				chopOn = false;
				chopI = 0;
				g.clean();
			}
		}

		// draw
		p.clear();
		p.applyMatrix(paperSize, 0, 0, paperSize, WIDTH*0.5-paperSize*0.5, HEIGHT*0.5-paperSize*0.5);
		
		p.fill(0, 0, 0);
		p.stroke(0, 0, 0);
		drawCoordinateFrame(p);
		drawGraphPoints(p, g);
		p.stroke(0, 0, 0, 30);
		drawGraphLines(p, g);
	}

	p.mouseReleased = function(){
		if(!ANIMATIONS){
			reset();
		}
	}

	p.mousePressed = function(){
		if(ANIMATIONS){
			chopOn = true;
			chopI = 0;
			g.clean();
		} else{
			g.chop();
		}
	}
};