var test05 = function(p){
	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;
	var highlighted1 = false;
	var highlighted2 = false;
	p.setHighlight1 = function(on){ highlighted1 = on; }
	p.setHighlight2 = function(on){ highlighted2 = on; }

	var g = new PlanarGraph();	
	var intersections = [];
	var bounds = [
		{xmin:0.0, xmax:0.33, ymin:0.0, ymax:0.33},
		{xmin:0.66, xmax:1.0, ymin:0.66, ymax:1.0},
		{xmin:0.66, xmax:1.0, ymin:0.0, ymax:0.33},
		{xmin:0.0, xmax:0.33, ymin:0.66, ymax:1.0},
		{xmin:0.0, xmax:1.0, ymin:0.0, ymax:1.0}
	];

	function drawAnX(graph){
		graph.clear();
		var w = 0.33;
		var first = {x:Math.random()*w, y:Math.random()*w, z:0.0};
		graph.nodes.push(first);
		graph.addEdgeFromVertex(0, Math.random()*w+(1-w), Math.random()*w+(1-w));
		var second = {x:Math.random()*w, y:Math.random()*w+(1-w), z:0.0};
		graph.nodes.push(second);
		graph.addEdgeFromVertex(2, Math.random()*w+(1-w), Math.random()*w);
	}

	function reset(){
		g.edges = [];
		g.nodes.pop();
		g.addEdgeFromExistingVertices(0, 1);
		g.addEdgeFromExistingVertices(2, 3);
		intersections = g.getAllEdgeIntersections();
	}

	p.setup = function(){
		canvas = p.createCanvas(WIDTH, HEIGHT);
		p.strokeWeight(.01);
		drawAnX(g);
	}

	function chop(){
		g.cleanup();
		for(var i = 0; i < g.edges.length; i++){
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
		g.cleanup();
	}

	p.draw = function() {

		// update
		for(var i = 0; i < g.nodes.length; i++){
			var speed = 0.002;
			var mag = 0.02;
			var mult1 = Math.pow(i*2, 1.5);
			var mult2 = Math.pow(i*2.3, 1.333);
			g.nodes[i].x += mag * (p.noise(i*mult1+1.3*(i+1)+p.millis()*speed) - 0.47); // noise() leans positive for some reason 
			g.nodes[i].y += mag * (p.noise(i*mult2+5*(i+1)+p.millis()*speed) - 0.47);
			if(g.nodes[i].x < bounds[i].xmin) g.nodes[i].x = bounds[i].xmin;
			if(g.nodes[i].x > bounds[i].xmax) g.nodes[i].x = bounds[i].xmax;
			if(g.nodes[i].y < bounds[i].ymin) g.nodes[i].y = bounds[i].ymin;
			if(g.nodes[i].y > bounds[i].ymax) g.nodes[i].y = bounds[i].ymax;
		}
		intersections = g.getAllEdgeIntersections();
		
		// draw
		p.clear();
		p.applyMatrix(paperSize, 0, 0, paperSize, WIDTH*0.5-paperSize*0.5, HEIGHT*0.5-paperSize*0.5);
		
		p.fill(0, 0, 0);
		p.stroke(0, 0, 0);
		drawCoordinateFrame(p);
		// drawGraphPoints(p, g);

		if(g.edges.length == 2)
			p.draw1();
		else
			p.draw2();
	
		// for(var i = 0; i < g.edges.length; i++){
		// 	line(g.nodes[g.edges[i].a].x, g.nodes[g.edges[i].a].y,
		// 	     g.nodes[g.edges[i].b].x, g.nodes[g.edges[i].b].y);
		// }

		// drawGraphLines(p, g);
		for(var i = 0; i < intersections.length; i++){
			p.fill(255, 0, 0);
			p.noStroke();
			p.ellipse(intersections[i].x, intersections[i].y, .03, .03);
		}
	}

	p.draw1 = function(){
		if(highlighted1) p.stroke(255, 0, 0);
		else p.stroke(0, 0, 0);
		p.ellipse(g.nodes[g.edges[0].a].x, g.nodes[g.edges[0].a].y, 0.01, 0.01);
		p.ellipse(g.nodes[g.edges[0].b].x, g.nodes[g.edges[0].b].y, 0.01, 0.01);
		p.line(g.nodes[g.edges[0].a].x, g.nodes[g.edges[0].a].y,
			 g.nodes[g.edges[0].b].x, g.nodes[g.edges[0].b].y);
	
		if(highlighted2) p.stroke(255, 0, 0);
		else p.stroke(0, 0, 0);
		p.ellipse(g.nodes[g.edges[1].a].x, g.nodes[g.edges[1].a].y, 0.01, 0.01);
		p.ellipse(g.nodes[g.edges[1].b].x, g.nodes[g.edges[1].b].y, 0.01, 0.01);
		p.line(g.nodes[g.edges[1].a].x, g.nodes[g.edges[1].a].y,
			 g.nodes[g.edges[1].b].x, g.nodes[g.edges[1].b].y);

	}
	p.draw2 = function(){
		drawGraphPoints(p, g);
		drawGraphLines(p, g);
		// if(highlighted1) p.stroke(200, 200, 0);
		// else p.stroke(0, 0, 0);
		// p.ellipse(g.nodes[g.edges[0].a].x, g.nodes[g.edges[0].a].y, 0.01, 0.01);
		// p.ellipse(g.nodes[g.edges[0].b].x, g.nodes[g.edges[0].b].y, 0.01, 0.01);
		// p.line(g.nodes[g.edges[0].a].x, g.nodes[g.edges[0].a].y,
		// 	 g.nodes[g.edges[0].b].x, g.nodes[g.edges[0].b].y);
	
		// if(highlighted2) p.stroke(200, 200, 0);
		// else p.stroke(0, 0, 0);
		// p.ellipse(g.nodes[g.edges[1].a].x, g.nodes[g.edges[1].a].y, 0.01, 0.01);
		// p.ellipse(g.nodes[g.edges[1].b].x, g.nodes[g.edges[1].b].y, 0.01, 0.01);
		// p.line(g.nodes[g.edges[1].a].x, g.nodes[g.edges[1].a].y,
		// 	 g.nodes[g.edges[1].b].x, g.nodes[g.edges[1].b].y);

	}

	p.mouseReleased = function(){
		reset();
	}

	p.mousePressed = function(){
		chop();
	}
};