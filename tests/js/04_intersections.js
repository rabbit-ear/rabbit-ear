var _04_intersections = function(p) {
	p.callback = undefined;
	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var g = new PlanarGraph();
	var numLines = 7;
	var intersections = [];

	function fillWithRope(graph, count){
		// var first = {x:Math.random(), y:Math.random(), z:0.0};
		// graph.nodes.push(first);
		graph.newNode();
		for(var i = 0; i < count; i++)
			graph.addEdgeFromVertex(graph.nodes[i], Math.random(), Math.random());
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
			var xnoise = p.noise(i*31.111+p.millis()*0.0002);
			if(xnoise < 0.5) g.nodes[i].x = -Math.pow(2*(0.5-xnoise), 0.8)*0.5 + 0.5;//((0.5-xnoise)*2);
			else             g.nodes[i].x = Math.pow(2*(xnoise-0.5), 0.8)*0.5 + 0.5;//((xnoise-0.5)*2);

			var ynoise = p.noise(i*44.22+10+p.millis()*0.0002);
			if(ynoise < 0.5) g.nodes[i].y = -Math.pow(2*(0.5-ynoise), 0.8)*0.5 + 0.5;//((0.5-ynoise)*2);
			else             g.nodes[i].y = Math.pow(2*(ynoise-0.5), 0.8)*0.5 + 0.5;//((ynoise-0.5)*2);
			// g.nodes[i].y = Math.sqrt(ynoise);
		}
		intersections = g.getEdgeIntersections();

		// draw
		p.clear();
		p.applyMatrix(paperSize, 0, 0, paperSize, WIDTH*0.5-paperSize*0.5, HEIGHT*0.5-paperSize*0.5);
		p.fill(0, 0, 0);
		p.stroke(0, 0, 0);
		p.strokeWeight(.01);
		// drawCoordinateFrame(p);
		drawGraphPoints(p, g);
		drawGraphLines(p, g);
		// intersections
		p.fill(255, 0, 0);
		p.noStroke();
		for(var i = 0; i < intersections.length; i++){
			p.ellipse(intersections[i].x, intersections[i].y, .03, .03);
		}
		if(p.callback != undefined){
			p.callback(intersections);
		}
	}
	p.mousePressed = function(){
		// p.reset();
	}
};