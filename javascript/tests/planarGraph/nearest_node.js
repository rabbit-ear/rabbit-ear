var p5_nearest_node = function(p) {
	p.mouseMovedCallback = undefined;
	p.numPoints = 30;
	// var WIDTH = window.innerWidth;
	// var HEIGHT = window.innerHeight;
	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var g = new PlanarGraph();
	var closestNode = undefined;


	function reset(){
		g.clear();
		for(var i = 0 ;i  < p.numPoints; i++){
			g.nodes.push( {x:Math.random(), y:Math.random(), z:0.0} );
		}
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
		if(closestNode != undefined){
			p.fill(255, 0, 0);
			p.stroke(255, 0, 0);
			p.ellipse(g.nodes[closestNode].x, g.nodes[closestNode].y, .03, .03);
		}
	}

	p.mouseMoved = function(event){
		// var mouseX = event.screenX;
		// var mouseX = (event.clientX - WIDTH*0.5 + paperSize*0.5) / paperSize;
		// var mouseY = (event.clientY - HEIGHT*0.5 + paperSize*0.5) / paperSize;
		var mouseXScaled = p.mouseX / paperSize;
		var mouseYScaled = p.mouseY / paperSize;
		if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
		if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
		closestNode = g.getClosestNode(mouseXScaled, mouseYScaled);
		if(p.mouseMovedCallback != undefined)
			p.mouseMovedCallback(mouseXScaled, mouseYScaled);
	}

	p.mouseReleased = function(){
		reset();
	}
};