var _11_merge_duplicates = function( p ) {
	p.callback = undefined;  // two arguments: number of nodes, number of edges

	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var g = new PlanarGraph();

	var numEdges = 10;

	p.reset = function(){
		g.clear();
		for(var i = 0; i < numEdges; i++){
			var x1pos = Math.random();
			var y1pos = Math.random();
			var x2pos = Math.random();
			var y2pos = Math.random();
			g.addEdgeWithVertices( x1pos, y1pos, x2pos, y2pos );
			g.nodes[g.nodes.length-1]['offset'] = {'x':Math.random()*80,'y':Math.random()*80};
			g.nodes[g.nodes.length-1]['speed'] = {'x':Math.random()*80,'y':Math.random()*80};
			g.nodes[g.nodes.length-2]['offset'] = {'x':Math.random()*80,'y':Math.random()*80};
			g.nodes[g.nodes.length-2]['speed'] = {'x':Math.random()*80,'y':Math.random()*80};
		}
		if(p.callback != undefined){
			p.callback(g.nodes.length, g.edges.length);
		}
	}
	p.setup = function(){
		canvas = p.createCanvas(WIDTH, HEIGHT);
		p.reset();
	}
	var t = 0;
	p.draw = function() {
		// update
		t += 1;
		for(var i = 0; i < g.nodes.length; i++){
			g.nodes[i].x = 0.5+0.5*Math.cos(t*g.nodes[i].speed.x * 0.0002 + g.nodes[i].offset.x);
			g.nodes[i].y = 0.5+0.5*Math.sin(t*g.nodes[i].speed.y * 0.0002 + g.nodes[i].offset.y);
		}
		if(g.mergeDuplicateVertices()){
			if(p.callback != undefined){
				p.callback(g.nodes.length, g.edges.length);
			}
		}

		//draw
		p.clear();
		p.applyMatrix(paperSize, 0, 0, paperSize, WIDTH*0.5-paperSize*0.5, HEIGHT*0.5-paperSize*0.5);

		p.background(255);
		p.fill(0);
		p.stroke(0);
		p.strokeWeight(.01);
		drawGraphPoints(p, g);
		drawGraphLines(p, g);
		drawCoordinateFrame(p);
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
		} else{
			console.log(g.edges);			
		}
	}
};