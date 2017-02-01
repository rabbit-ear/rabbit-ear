var test09 = function(p) {
	// var WIDTH = this.canvas.parentElement.offsetWidth;
	// var HEIGHT = this.canvas.parentElement.offsetHeight;
	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;
	// myp5.canvas.parentElement.offsetWidth

	var g = new PlanarGraph();
	var numLines = 32;
	var sortedConnectedNodes = [];

	function fillWithSunburst(graph, count){
		var center = {x:0.5, y:0.5, z:0.0};
		graph.nodes.push(center);
		for(var i = 0; i < count; i++)
			graph.addEdgeFromVertex(0, Math.random(), Math.random());
	}

	function reset(){
		g.clear();
		fillWithSunburst(g, numLines);
		var angles = g.getClockwiseConnectedNodesAndAngles(0);
		sortedConnectedNodes = g.getClockwiseConnectedNodesSorted(0);
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
		p.strokeWeight(.0033);
		p.line(0.5, 0.5, 0.5, 0.0);
		p.strokeWeight(.01);

		p.fill(0, 0, 0);
		p.stroke(0, 0, 0);
		drawCoordinateFrame(p);
		// drawGraphPoints(p, g);
		// drawGraphLines(p, g);
		for(var i = 0; i < sortedConnectedNodes.length; i++){
			var edge = g.getEdgeConnectingNodes(0, sortedConnectedNodes[i]);
			var color = HSVtoRGB(i/sortedConnectedNodes.length, 1.0, 1.0);
			p.stroke(color.r, color.g, color.b);
			p.line(g.nodes[ g.edges[edge].a ].x, g.nodes[ g.edges[edge].a ].y, 
			       g.nodes[ g.edges[edge].b ].x, g.nodes[ g.edges[edge].b ].y );
			p.ellipse(g.nodes[ sortedConnectedNodes[i] ].x, g.nodes[ sortedConnectedNodes[i] ].y, 0.01, 0.01);
		}
	}

	p.mouseReleased = function(){
		reset();
	}
};