var _05_parallels = function(p) {
	var paperSize = 250;
	var WIDTH = paperSize*2;
	var HEIGHT = paperSize;

	var g = [new PlanarGraph(), new PlanarGraph(), new PlanarGraph(), new PlanarGraph(), new PlanarGraph()];
	// g[0].verbose = true;
	var closestEdge = undefined;

	var count = 0;
	var flip = [1, 1, 1, 1, 1];  // (1, or -1) approach from the left or the right
	var angles = [0.5*Math.PI, 
	              Math.PI*0.5 * 0.8,
	              Math.PI*0.5 * 0.5,
	              Math.PI*0.5 * 0.2,
	              0];
	var len = 0.3;
	function reset(){
		count = 0;
		for(var i = 0; i < 5; i++) {
			g[i].clear();
			g[i].newPlanarEdge(0.36*(i-1) + len*Math.cos(angles[i]), 0.5 + len*Math.sin(angles[i]),
			                         0.36*(i-1) - len*Math.cos(angles[i]), 0.5 - len*Math.sin(angles[i]));
			g[i].newPlanarEdge(0, 0, 1, 1);
			g[i].clean();

			if(Math.random() < 0.5) flip[i] = 1;
			else                    flip[i] = -1;
		}
		flip[4] = 1;
	}

	p.setup = function(){
		canvas = p.createCanvas(WIDTH, HEIGHT);
		p.strokeWeight(.01);
		reset();
	}

	p.draw = function() {
		count++;

		p.clear();
		p.applyMatrix(paperSize, 0, 0, paperSize, WIDTH*0.5-paperSize*0.5, HEIGHT*0.5-paperSize*0.5);		
		p.fill(0, 0, 0);
		p.stroke(0, 0, 0);
		// drawCoordinateFrame(p);

		for(var i = 0; i < 5; i++){
			g[i].nodes[2].x = 0.36*(i-1) - len*Math.cos(flip[i]*0.1 + flip[i]*0.1* -Math.sin(count*0.01)+angles[i]);
			g[i].nodes[2].y = 0.5 - len*Math.sin(flip[i]*0.1 + flip[i]*0.1* -Math.sin(count*0.01)+angles[i]);
			g[i].nodes[3].x = 0.36*(i-1) + len*Math.cos(flip[i]*0.1 + flip[i]*0.1* -Math.sin(count*0.01)+angles[i]);
			g[i].nodes[3].y = 0.5 + len*Math.sin(flip[i]*0.1 + flip[i]*0.1* -Math.sin(count*0.01)+angles[i]);

			g[i].nodes[2].x = g[i].nodes[0].x + 0.04*Math.sin(count*0.01);
			g[i].nodes[2].y = g[i].nodes[0].y;// + 0.04*Math.sin(count*0.01);
			g[i].nodes[3].x = g[i].nodes[1].x - 0.04*Math.sin(count*0.01);
			g[i].nodes[3].y = g[i].nodes[1].y;// - 0.04*Math.sin(count*0.01);

			var intersections = g[i].getEdgeIntersections();

			p.fill(0, 0, 0);
			p.stroke(0, 0, 0);
			drawGraphPoints(p, g[i]);
			drawGraphLines(p, g[i]);

			for(var j = 0; j < intersections.length; j++){
				p.fill(255, 0, 0);
				p.noStroke();
				p.ellipse(intersections[j].x, intersections[j].y, .03, .03);
			}
		}
	}

	p.mouseMoved = function(event){ }
	p.mousePressed = function(){ }
	p.mouseReleased = function(){
		reset();
	}
};