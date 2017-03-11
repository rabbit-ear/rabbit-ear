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
	var closestNodes = [];

	var mouseXScaled;
	var mouseYScaled;

	function reset(){
		g.clear();
		for(var i = 0 ;i  < p.numPoints; i++){
			g.nodes.push( {x:Math.random(), y:Math.random(), z:0.0} );
		}
		closestNode = undefined;
		closestNodes = [];
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

		if(mouseXScaled != undefined && mouseYScaled != undefined){
			for(var i = 0; i < closestNodes.length; i++){
				p.stroke(50*i, 50*i, 50*i);
				p.line(mouseXScaled, mouseYScaled, g.nodes[ closestNodes[i] ].x, 
				                                   g.nodes[ closestNodes[i] ].y);
			}
		}		
		p.stroke(0, 0, 0);
		drawGraphPoints(p, g);
		if(mouseXScaled != undefined && mouseYScaled != undefined && closestNode != undefined){
			p.line(mouseXScaled, mouseYScaled, g.nodes[closestNode].x, g.nodes[closestNode].y);
			p.fill(255, 0, 0);
			p.stroke(255, 0, 0);
			p.ellipse(g.nodes[closestNode].x, g.nodes[closestNode].y, .03, .03);
		}
	}

	p.mouseMoved = function(event){
		mouseXScaled = p.mouseX / paperSize;
		mouseYScaled = p.mouseY / paperSize;
		if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
		if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
		closestNode = g.getClosestNode(mouseXScaled, mouseYScaled);
		closestNodes = g.getClosestNodes(mouseXScaled, mouseYScaled, 5);
		if(p.mouseMovedCallback != undefined)
			p.mouseMovedCallback(mouseXScaled, mouseYScaled);
	}

	p.mouseReleased = function(){
		if(mouseXScaled != undefined && mouseYScaled != undefined){
			reset();
		}
	}
};