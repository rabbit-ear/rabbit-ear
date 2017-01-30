var _03_add_nodes_simple = function( p ) {
	p.callback = undefined;
	p.numLines = 17;
	p.pattern = Math.floor(Math.random()*2.999);

	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var g = new PlanarGraph();

	function fillWithRandom(graph, count){
		for(var i = 0; i < count; i++)
			graph.addEdgeWithVertices(Math.random(), Math.random(), Math.random(), Math.random());
	}
	function fillWithSunburst(graph, count){
		var center = {x:0.5, y:0.5, z:0.0};
		graph.nodes.push(center);
		for(var i = 0; i < count; i++)
			graph.addEdgeFromVertex(0, Math.random(), Math.random());
	}
	function fillWithRope(graph, count){
		var first = {x:Math.random(), y:Math.random(), z:0.0};
		graph.nodes.push(first);
		for(var i = 0; i < count; i++)
			graph.addEdgeFromVertex(i, Math.random(), Math.random());
	}

	p.reset = function(){
		g.clear();
		if(p.pattern == 2)
			fillWithRope(g, p.numLines);
		else if(p.pattern == 1)
			fillWithSunburst(g, p.numLines);
		else 
			fillWithRandom(g, p.numLines);
	}
	p.setup = function(){
		canvas = p.createCanvas(WIDTH, HEIGHT);
		p.reset();
		// noLoop();
		// frameRate(10);
	}
	p.draw = function() {
		p.clear();
		p.applyMatrix(paperSize, 0, 0, paperSize, WIDTH*0.5-paperSize*0.5, HEIGHT*0.5-paperSize*0.5);

		p.strokeWeight(.01);
		drawGraphPoints(p, g);
		drawGraphLines(p, g);
		p.stroke(0);
		drawCoordinateFrame(p);
	}
	p.mousePressed = function(){
		var mouseXScaled = p.mouseX / paperSize;
		var mouseYScaled = p.mouseY / paperSize;
		if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
		if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
		if(mouseXScaled != undefined && mouseYScaled != undefined){
			// mouse was pressed inside of canvas
			p.reset();
		}
	}
};