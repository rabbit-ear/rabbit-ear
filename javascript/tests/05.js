var test05 = function(p){
	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

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
		// we're going to be iterating and removing elements at the same time (!)
		// we will remove edges. we only add to nodes array. nodes indices are preserved.
		var intersections = g.getAllEdgeIntersectionsDetailed();
		for(var i = 0; i < intersections.length; i++){
			var node1a = intersections[i]['edge1NodeA'];
			var node1b = intersections[i]['edge1NodeB'];
			var node2a = intersections[i]['edge2NodeA'];
			var node2b = intersections[i]['edge2NodeB'];
			var intersection = intersections[i].location;

			g.removeEdgeBetween(node1a, node1b);
			g.removeEdgeBetween(node2a, node2b);
			var newIntersectionVertexIndex = g.nodes.length;
			g.addEdgeFromVertex(node1a, intersection.x, intersection.y);
			g.addEdgeFromExistingVertices(node1b, newIntersectionVertexIndex);
			g.addEdgeFromExistingVertices(node2a, newIntersectionVertexIndex);
			g.addEdgeFromExistingVertices(node2b, newIntersectionVertexIndex);
		}
	}

	p.draw = function() {

		// update
		for(var i = 0; i < g.nodes.length; i++){
			var speed = 0.002;
			var mag = 0.02;
			var mult1 = Math.pow(i*2, 1.5);
			var mult2 = Math.pow(i*2.3, 1.333);
			g.nodes[i].x += -mag*0.5 + mag * p.noise(i*mult1+1.3*(i+1)+p.millis()*speed);
			g.nodes[i].y += -mag*0.5 + mag * p.noise(i*mult2+5*(i+1)+p.millis()*speed);
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
		drawGraphPoints(p, g);
		drawGraphLines(p, g);
		for(var i = 0; i < intersections.length; i++){
			p.fill(255, 0, 0);
			p.noStroke();
			p.ellipse(intersections[i].x, intersections[i].y, .03, .03);
		}
	}

	p.mouseReleased = function(){
		reset();
	}

	p.mousePressed = function(){
		chop();
	}
};