var _01_kawasaki = function( p ) {
	p.callback = undefined;

	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var cp = new CreasePattern();

	var numEdges = 4;

	p.reset = function(){
		cp.clear();
		cp.nodes = [{'x':0.5, 'y':0.5 }];
		for(var i = 0; i < numEdges; i++){
			var angle = Math.random()*Math.PI * 2;
			var distance = 0.45;
			// var tan;
			// if(Math.abs(Math.tan(angle)) < Math.abs(1/Math.tan(angle)) ) tan = Math.tan(angle);
			// else                                     tan = 1/Math.tan(angle);
			// tan = Math.abs(tan);
			// tan *= (Math.sqrt(2) - 1) * 0.45;
			// distance += tan;
			var endPoint = { x:0.5 + 1.0*Math.cos(angle), 
			                 y:0.5 + 1.0*Math.sin(angle) };
			var a = lineSegmentIntersectionAlgorithm(cp.nodes[0], endPoint, {x:0,y:0}, {x:1,y:0} );
			var b = lineSegmentIntersectionAlgorithm(cp.nodes[0], endPoint, {x:1,y:0}, {x:1,y:1} );
			var c = lineSegmentIntersectionAlgorithm(cp.nodes[0], endPoint, {x:0,y:1}, {x:1,y:1} );
			var d = lineSegmentIntersectionAlgorithm(cp.nodes[0], endPoint, {x:0,y:0}, {x:0,y:1} );
			if(a != undefined) endPoint = a;
			if(b != undefined) endPoint = b;
			if(c != undefined) endPoint = c;
			if(d != undefined) endPoint = d;
			cp.newPlanarEdgeFromNode(0, endPoint.x, endPoint.y);
		}
		cp.clean();
	}
	p.setup = function(){
		canvas = p.createCanvas(WIDTH, HEIGHT);
		p.reset();
	}
	p.draw = function() {

		//draw
		p.clear();
		p.applyMatrix(paperSize, 0, 0, paperSize, WIDTH*0.5-paperSize*0.5, HEIGHT*0.5-paperSize*0.5);
		p.background(255);

		// draw graph
		p.fill(0);
		p.stroke(0);
		p.strokeWeight(.02);
		// drawGraphPoints(p, cp);
		drawGraphLines(p, cp);
		drawCoordinateFrame(p);

		p.colorMode(p.HSB);
		if(cp.nodes.length > 0){
			var n = 0;
			var edges = cp.nodes[n].adjacent.edges
			for(var e = 0; e < edges.length; e++){
				var angleDeg = Math.floor(edges[e].angle * 180 / Math.PI);
				if(angleDeg < 0) angleDeg += 360;
				var xOff = 0.225 * Math.cos(edges[e].angle);
				var yOff = 0.225 * Math.sin(edges[e].angle);
				p.stroke(angleDeg, 50, 100);
				p.line(cp.nodes[n].x, cp.nodes[n].y, cp.nodes[n].x + xOff, cp.nodes[n].y + yOff);	
			}
		}
		p.colorMode(p.RGB);
		
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
		}
	}
};