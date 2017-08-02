var _05_parallels = function(p) {
	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var g = [new PlanarGraph(), new PlanarGraph(), new PlanarGraph(), new PlanarGraph(), new PlanarGraph()];
	// g[0].verbose = true;
	var closestEdge = undefined;

	var count = 0;
	var flip = [1, 1, 1, 1, 1];  // (1, or -1) approach from the left or the right
	var angles = [Math.PI*0.5 * 0.8,
		          Math.PI*0.5 * 0.5,
		          Math.PI*0.5 * 0.2,
		          0.5*Math.PI, 
		          0];
	function reset(){
		count = 0;
		for(var i = 0; i < 5; i++) {
			g[i].clear();
			var row = Math.floor(i/3.0);
			g[i].addEdgeWithVertices(0.25*((i+1)%4) +row*0.35 + 0.2*Math.cos(angles[i]), 0.25+(row*0.5) + 0.2*Math.sin(angles[i]), 
			                         0.25*((i+1)%4) +row*0.35 - 0.2*Math.cos(angles[i]), 0.25+(row*0.5) - 0.2*Math.sin(angles[i]));
			g[i].addEdgeWithVertices(0, 0, 1, 1);
			g[i].clean();

			if(Math.random() < 0.5) flip[i] = 1;
			else                    flip[i] = -1;
		}
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
			var row = Math.floor(i/3.0);
			g[i].nodes[2].x = 0.25*((i+1)%4) +row*0.35 - 0.2*Math.cos( flip[i] * 0.1 + flip[i] * 0.1 * -Math.sin(count*0.01) + angles[i]);
			g[i].nodes[2].y = 0.25+(row*0.5)           - 0.2*Math.sin( flip[i] * 0.1 + flip[i] * 0.1 * -Math.sin(count*0.01) + angles[i]);
			g[i].nodes[3].x = 0.25*((i+1)%4) +row*0.35 + 0.2*Math.cos( flip[i] * 0.1 + flip[i] * 0.1 * -Math.sin(count*0.01) + angles[i]);
			g[i].nodes[3].y = 0.25+(row*0.5)           + 0.2*Math.sin( flip[i] * 0.1 + flip[i] * 0.1 * -Math.sin(count*0.01) + angles[i]);

			var intersections = g[i].getAllEdgeIntersections();

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