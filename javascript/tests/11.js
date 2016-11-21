var test11 = function(p) {
	p.mouseMovedCallback = undefined;
	// var WIDTH = this.canvas.parentElement.offsetWidth;
	// var HEIGHT = this.canvas.parentElement.offsetHeight;
	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;
	// myp5.canvas.parentElement.offsetWidth

	var g = new PlanarGraph();
	var closestEdge = undefined;

	function reset(){
		g.clear();
		g.birdBase();
		g.generateFaces();
		console.log( g.faces );
	}

	p.setup = function(){
		canvas = p.createCanvas(WIDTH, HEIGHT);
		p.strokeWeight(.01);
		reset();
	}

	p.draw = function() {
		p.scalar = 0.5+0.5*Math.sin(p.millis() / 1000.0) - .01;
		if(p.scalar < 0) p.scalar = 0.0;
		p.clear();
		p.applyMatrix(paperSize, 0, 0, paperSize, WIDTH*0.5-paperSize*0.5, HEIGHT*0.5-paperSize*0.5);		
		p.fill(0, 0, 0);
		p.stroke(0, 0, 0);
		drawCoordinateFrame(p);
		drawGraphPoints(p, g);
		drawGraphLines(p, g);
		for(var i = 0; i < g.faces.length * p.scalar; i++){
			var color = HSVtoRGB(i/g.faces.length, 1.0, 1.0);
			p.fill(color.r, color.g, color.b, 50);
			p.beginShape();
			var face = g.faces[i];
			for(f = 0; f < face.length; f++){
				p.vertex(g.nodes[ face[f] ].x, g.nodes[ face[f] ].y);
			}
			p.endShape();
		}		
		if(closestEdge != undefined){
			p.stroke(255, 0, 0);
			p.fill(255, 0, 0);
			p.line(g.nodes[ g.edges[closestEdge].a ].x, g.nodes[ g.edges[closestEdge].a ].y, 
			       g.nodes[ g.edges[closestEdge].b ].x, g.nodes[ g.edges[closestEdge].b ].y );
			p.ellipse(g.nodes[ g.edges[closestEdge].a ].x, g.nodes[ g.edges[closestEdge].a ].y, .01, .01);
			p.ellipse(g.nodes[ g.edges[closestEdge].b ].x, g.nodes[ g.edges[closestEdge].b ].y, .01, .01);
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
		// closestFace = g.getClosestFace(mouseXScaled, mouseYScaled);
		if(p.mouseMovedCallback != undefined)
			p.mouseMovedCallback(mouseXScaled, mouseYScaled);
		if(mouseXScaled != undefined) p.scalar = mouseXScaled;
	}

	p.mouseReleased = function(){
		// reset();
	}
};