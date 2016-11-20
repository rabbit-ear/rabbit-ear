var test04 = function(p) {
	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var g = new PlanarGraph();
	var numLines = 7;
	var intersections = [];

	function fillWithRope(graph, count){
		var first = {x:Math.random(), y:Math.random(), z:0.0};
		graph.nodes.push(first);
		for(var i = 0; i < count; i++)
			graph.addEdgeFromVertex(i, Math.random(), Math.random());
	}

	p.reset = function(){
		g.clear();
		fillWithRope(g, numLines);
	}
	p.setup = function(){
		canvas = p.createCanvas(WIDTH, HEIGHT);
		p.reset();
		// for(var i = 0; i < g.nodes.length; i++){
		// 	var boundary = g.nodes[i].isBoundary;
		// }
		// noLoop();
		// frameRate(10);
	}
	p.draw = function() {
		// update
		for(var i = 0; i < g.nodes.length; i++){
			g.nodes[i].x = p.noise(i*31.111+p.millis()*0.0002);
			g.nodes[i].y = p.noise(i*44.22+10+p.millis()*0.0002);
		}
		intersections = g.getAllEdgeIntersections();

		// draw
		p.clear();
		p.applyMatrix(paperSize, 0, 0, paperSize, WIDTH*0.5-paperSize*0.5, HEIGHT*0.5-paperSize*0.5);
		p.fill(0, 0, 0);
		p.stroke(0, 0, 0);
		p.strokeWeight(.01);
		drawCoordinateFrame(p);
		drawGraphPoints(p, g);
		drawGraphLines(p, g);
		// intersections
		p.fill(255, 0, 0);
		p.noStroke();
		for(var i = 0; i < intersections.length; i++){
			p.ellipse(intersections[i].x, intersections[i].y, .03, .03);
		}
	}
	p.mousePressed = function(){
		// p.reset();
	}
};