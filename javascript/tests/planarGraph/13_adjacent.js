var _13_adjacent = function( p ) {
	p.callback = undefined;

	var paperSize = 500;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var cp = new CreasePattern();

	var numEdges = 5;

	var fontSize = 0.05;

	p.reset = function(){
		cp.clear();
		for(var i = 0; i < numEdges; i++){
			var x1pos = Math.random();
			var y1pos = Math.random();
			var x2pos = Math.random();
			var y2pos = Math.random();
			cp.crease( x1pos, y1pos, x2pos, y2pos );
		}
		cp.clean();
		cp.refreshAdjacencies();
		for(var i = 0; i < cp.nodes.length; i++){
			console.log(cp.nodes[i].adjacent);
		}
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
		p.fill(178);
		p.stroke(178);
		p.strokeWeight(.01);
		drawGraphPoints(p, cp);
		drawGraphLines(p, cp);
		drawCoordinateFrame(p);

		p.textSize(fontSize);
		for(var n = 0; n < cp.nodes.length; n++){
			var edges = cp.nodes[n].adjacent.edges
			for(var e = 0; e < edges.length; e++){
				var xOff = 0.05 * Math.cos(edges[e].angle);
				var yOff = 0.05 * Math.sin(edges[e].angle);
				p.stroke(220);
				p.line(cp.nodes[n].x, cp.nodes[n].y, cp.nodes[n].x + xOff, cp.nodes[n].y + yOff);

				p.noStroke();
				p.fill(0);
				var angleString = (Math.floor(edges[e].angle * 180 / Math.PI)).toString();
				p.text(angleString, cp.nodes[n].x + xOff - (fontSize*0.4 + (angleString.length-1)*fontSize*0.25), cp.nodes[n].y + yOff + (fontSize*0.4));
			}
		}


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