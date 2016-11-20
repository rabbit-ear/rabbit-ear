var test07 = function( p ) {
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;
	var paperSize = 250;

	var g = new PlanarGraph();
	this.numLines = 30;
	var closestEdge = undefined;

	function reset(){
		g.clear();
		g.frogBase();
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
		drawCoordinateFrame(p);
		drawGraphPoints(p, g);
		drawGraphLines(p, g);
		if(closestEdge != undefined){
			p.stroke(255, 0, 0);
			p.fill(255, 0, 0);
			p.line(g.nodes[ g.edges[closestEdge].a ].x, g.nodes[ g.edges[closestEdge].a ].y, 
			       g.nodes[ g.edges[closestEdge].b ].x, g.nodes[ g.edges[closestEdge].b ].y );
			p.ellipse(g.nodes[ g.edges[closestEdge].a ].x, g.nodes[ g.edges[closestEdge].a ].y, .01, .01);
			p.ellipse(g.nodes[ g.edges[closestEdge].b ].x, g.nodes[ g.edges[closestEdge].b ].y, .01, .01);
		}
	}

	p.mouseMoved = function(event){
		// var mouseX = event.screenX;
		var mouseX = (event.clientX - WIDTH*0.5 + paperSize*0.5) / paperSize;
		var mouseY = (event.clientY - HEIGHT*0.5 + paperSize*0.5) / paperSize;
		closestEdge = g.getClosestEdge(mouseX, mouseY);
	}

	p.mouseReleased = function(){
		reset();
	}
};