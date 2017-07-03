var _03_kawasaki = function( p ) {
	p.callback = undefined;  // returns the inner angles upon refresh

	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var cp = new CreasePattern();

	var numEdges = 4;

	var innerAngles = [];

	p.endPointForAngle = function(angle){
		var distance = 0.45;
		var endPoint = { x:0.5 + 1.0*Math.cos(angle), 
		                 y:0.5 + 1.0*Math.sin(angle) };
		var a = cp.lineSegmentIntersectionAlgorithm(cp.nodes[0], endPoint, {x:0,y:0}, {x:1,y:0} );
		var b = cp.lineSegmentIntersectionAlgorithm(cp.nodes[0], endPoint, {x:1,y:0}, {x:1,y:1} );
		var c = cp.lineSegmentIntersectionAlgorithm(cp.nodes[0], endPoint, {x:0,y:1}, {x:1,y:1} );
		var d = cp.lineSegmentIntersectionAlgorithm(cp.nodes[0], endPoint, {x:0,y:0}, {x:0,y:1} );
		if(a != undefined) endPoint = a;
		if(b != undefined) endPoint = b;
		if(c != undefined) endPoint = c;
		if(d != undefined) endPoint = d;
		return endPoint;
	}

	p.reset = function(){
		cp.clear();
		cp.nodes = [{'x':0.5, 'y':0.5 }];
		for(var i = 0; i < numEdges; i++){
			var angle = Math.random()*Math.PI * 2;
			var endPoint = p.endPointForAngle(angle);
			cp.addEdgeFromVertex(0, endPoint.x, endPoint.y);
		}
		cp.clean();
		cp.refreshAdjacencies();
		innerAngles = cp.kawasaki(0);
		if(p.callback != undefined){
			p.callback(innerAngles);
		}
		console.log(innerAngles);
		for(var i = 0; i < innerAngles.length; i++){
			console.log(innerAngles[i].kawasaki);
		}

	}
	p.setup = function(){
		canvas = p.createCanvas(WIDTH, HEIGHT);
		p.reset();
	}
	p.draw = function() {

		innerAngles = cp.kawasaki(0);
		// console.log(innerAngles);
		if(p.callback != undefined){
			p.callback(innerAngles);
		}

		for(var i = 0; i < 1; i++){
			if(innerAngles[i].kawasaki > 0){
				// console.log(innerAngles[i].kawasaki);
				var angles = innerAngles[i].angles;
				var nodes = innerAngles[i].nodes;
				angles[0] += 0.1;
				angles[1] -= 0.1;
				cp.nodes[ nodes[0] ] = p.endPointForAngle( angles[0] );
				cp.nodes[ nodes[1] ] = p.endPointForAngle( angles[1] );
				console.log( cp.nodes[ nodes[0] ] );
			} else{
				// var angles = innerAngles[i].angles;
				// var nodes = innerAngles[i].nodes;
				// angles[0] += 0.01;
				// angles[1] -= 0.01;
				// cp.nodes[ nodes[0] ] = p.endPointForAngle( angles[0] )
				// cp.nodes[ nodes[1] ] = p.endPointForAngle( angles[1] )
			}
		}
		cp.clean();

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

		p.stroke(255, 0, 0);
		p.noFill();
		for(var i = 0; i < innerAngles.length; i++){
			var radius = 0.5;
			if(i%2 == 0) radius = 0.6;
			p.arc(0.5, 0.5, radius, radius, innerAngles[i].angles[0], innerAngles[i].angles[1]);
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