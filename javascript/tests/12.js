var test12 = function(p) {
	p.mouseMovedCallback = undefined;
	// var WIDTH = this.canvas.parentElement.offsetWidth;
	// var HEIGHT = this.canvas.parentElement.offsetHeight;
	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;
	// myp5.canvas.parentElement.offsetWidth

	var g = new PlanarGraph();
	var closestEdge = undefined;

	var count = 0;

	var option = 2; // 0:horizontal  1:vertical  2:random angle

	var angle;
	function addCreases(){
		switch (option){
		case 0:
			angle = 0;
			break;
		case 1:
			angle = 0.5 * Math.PI;
			break;
		case 2:
			angle = Math.random()*Math.PI*2;
			break;
		}
		g.addEdgeWithVertices(0.5 + 0.25*Math.cos(angle), 0.5 + 0.25*Math.sin(angle), 
		                      0.5 - 0.25*Math.cos(angle), 0.5 - 0.25*Math.sin(angle));
		g.addEdgeWithVertices(0, 0, 1, 1);
		g.cleanup();
	}

	function reset(){
		g.clear();
		addCreases();
	}

	p.setup = function(){
		canvas = p.createCanvas(WIDTH, HEIGHT);
		p.strokeWeight(.01);
		reset();
	}

	p.draw = function() {
		count++;
		var a = angle;
		switch(option){
			case 1:
				a = Math.PI * 0.5;
			break;
		}
		g.nodes[2].x = 0.5 - 0.3*Math.cos( 0.1 + 0.1 * -Math.sin(count*0.01) + a);
		g.nodes[2].y = 0.5 - 0.3*Math.sin( 0.1 + 0.1 * -Math.sin(count*0.01) + a);
		g.nodes[3].x = 0.5 + 0.3*Math.cos( 0.1 + 0.1 * -Math.sin(count*0.01) + a);
		g.nodes[3].y = 0.5 + 0.3*Math.sin( 0.1 + 0.1 * -Math.sin(count*0.01) + a);

		var intersections = g.getAllEdgeIntersections();

		p.clear();
		p.applyMatrix(paperSize, 0, 0, paperSize, WIDTH*0.5-paperSize*0.5, HEIGHT*0.5-paperSize*0.5);		
		p.fill(0, 0, 0);
		p.stroke(0, 0, 0);
		drawCoordinateFrame(p);
		drawGraphPoints(p, g);
		drawGraphLines(p, g);

		for(var i = 0; i < intersections.length; i++){
			p.fill(255, 0, 0);
			p.noStroke();
			p.ellipse(intersections[i].x, intersections[i].y, .03, .03);
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
		if(mouseXScaled != undefined) p.scalar = mouseXScaled*.9+0.1;
	}

	p.mousePressed = function(){
		for(var i = 0; i < g.nodes.length; i++)
			console.log(g.nodes[i].x + ' ' + g.nodes[i].y);
	}

	p.mouseReleased = function(){
		// reset();
	}
};