var editor = function( p ) {
	p.callback = undefined;  // one argument: {start: {x:_, y:_}, end: {x:_, y:_}}

	var paperSize = 500;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	p.g = new CreasePattern();

	p.undoHistory = [];

	// if mouse is pressed, this is an {x:_,y:_} object
	var mouseDownLocation = undefined;  

	p.snapRadius = 0.05;
	p.showNodes = true;
	p.showSnapRadius = true;
	p.showFaces = false;
	p.showClockwise = false;

	p.mouseMode = 'draw'; // 'draw', 'select', ...
	p.selectedNode = undefined;

	p.saveUndoState = function(){
		if(p.undoHistory.length > 50){
			p.undoHistory.shift();
		}
		// var clone = Object.assign({}, p.g);
		// var clone = cloneSO(p.g);
		// var clone = JSON.parse(JSON.stringify(p.g));
		var clone = new CreasePattern();
		clone.import(p.g);
		p.undoHistory.push(clone);
	}

	p.loadBase = function(base){
		p.saveUndoState();
		switch (base){
			case 'kite': p.g.kiteBase(); break;
			case 'fish': p.g.fishBase(); break;
			case 'bird': p.g.birdBase(); break;
			case 'frog': p.g.frogBase(); break;
		}		
	}
	p.clearCP = function(){  p.g.clear();  }

	p.findFaces = function(){
		p.g.findAllFaces();
	}

	p.cleanIntersections = function(){
		p.saveUndoState();
		// var count = p.g.cleanIntersections();
		p.g.clean();
		// doCallback('clean', {'intersections':count} );
	}
	p.getPlanarGraphObject = function(){
		return p.g;
	}
	p.makeSVGBlob = function(){
		return p.g.exportSVG(500);
	}
	p.undo = function(){
		if(p.undoHistory.length){
			p.g = p.undoHistory.pop();
		}
	}
	p.refreshAdjacency = function(){
		p.g.refreshAdjacencies();		
	}
	p.reset = function(){
		p.saveUndoState();
		p.g.clear();
	}
	p.setup = function(){
		canvas = p.createCanvas(WIDTH, HEIGHT);
		p.g.clear();
	}
	p.draw = function() {
		p.clear();
		p.applyMatrix(paperSize, 0, 0, paperSize, WIDTH*0.5-paperSize*0.5, HEIGHT*0.5-paperSize*0.5);

		p.background(255);

		if(p.showSnapRadius){
			p.fill(0, 0, 0, 10);
			p.noStroke();
			for(var i = 0; i < p.g.interestingPoints.length; i++){
				var pt = p.g.interestingPoints[i];
				p.ellipse(pt.x, pt.y, p.snapRadius*2.0);
			}
		}

		if(p.showFaces){
			for(var i = 0; i < p.g.faces.length; i++){
				var color = HSVtoRGB(i/p.g.faces.length, 1.0, 1.0);
				p.fill(color.r, color.g, color.b);
				p.beginShape();
				var face = p.g.faces[i];
				for(f = 0; f < face.nodes.length; f++){
					p.vertex(p.g.nodes[ face.nodes[f] ].x, p.g.nodes[ face.nodes[f] ].y);
				}
				p.endShape();
			}
		}

		if(p.showClockwise){
			for(var e = 0; e < p.g.clockwiseNodeEdges.length; e++){
				var sortedConnectedNodes = p.g.clockwiseNodeEdges[e];
				for(var i = 0; i < sortedConnectedNodes.length; i++){
					var edge = p.g.getEdgeConnectingNodes(e, sortedConnectedNodes[i]);
					var color = HSVtoRGB(i/sortedConnectedNodes.length, 1.0, 1.0);
					p.stroke(color.r, color.g, color.b);
					p.line(p.g.nodes[ p.g.edges[edge].node[0] ].x, p.g.nodes[ p.g.edges[edge].node[0] ].y, 
					       p.g.nodes[ p.g.edges[edge].node[1] ].x, p.g.nodes[ p.g.edges[edge].node[1] ].y );
					p.ellipse(p.g.nodes[ sortedConnectedNodes[i] ].x, p.g.nodes[ sortedConnectedNodes[i] ].y, 0.01, 0.01);
				}
			}
		}



		p.fill(0);
		p.stroke(0);
		p.strokeWeight(.002);
		if(p.showNodes){
			drawGraphPoints(p, p.g);
		}
		drawGraphLines(p, p.g);
		drawCoordinateFrame(p);


		if(mouseDownLocation != undefined){
			// a line is being dragged and added right now
			var mouseXScaled = p.mouseX / paperSize;
			var mouseYScaled = p.mouseY / paperSize;
			if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
			if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
			p.line(mouseDownLocation.x, mouseDownLocation.y, mouseXScaled, mouseYScaled);
			p.ellipse(mouseDownLocation.x, mouseDownLocation.y, .01, .01);
			doCallback('draw-line', {'start':mouseDownLocation, 'end':{'x':mouseXScaled, 'y':mouseYScaled }});
		}
		if(p.mouseMode == 'select'){
			var mouseXScaled = p.mouseX / paperSize;
			var mouseYScaled = p.mouseY / paperSize;
			if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
			if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
			if(mouseXScaled != undefined && mouseYScaled != undefined){
				var closest = p.g.getClosestNode(mouseXScaled, mouseYScaled);
				if(closest != undefined){
					p.fill(255, 0, 0);
					p.noStroke();
					// p.stroke(0);
					// p.strokeWeight(.002);
					p.ellipse(p.g.nodes[closest].x, p.g.nodes[closest].y, .02, .02);
				}
			}
			if(p.selectedNode != undefined){
				p.stroke(255, 0, 0);
				p.strokeWeight(0.005)
				p.noFill();
				p.ellipse(p.g.nodes[p.selectedNode].x, p.g.nodes[p.selectedNode].y, 0.025, 0.025);
			}
		}


	}
	p.mousePressed = function(){
		if(p.mouseMode == 'select'){
			var mouseXScaled = p.mouseX / paperSize;
			var mouseYScaled = p.mouseY / paperSize;
			if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
			if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
			if(mouseXScaled != undefined && mouseYScaled != undefined){
				p.selectedNode = p.g.getClosestNode(mouseXScaled, mouseYScaled);
			} else{
				p.selectedNode = undefined;
			}
		}
		if(p.mouseMode == 'draw'){
			var mouseXScaled = p.mouseX / paperSize;
			var mouseYScaled = p.mouseY / paperSize;
			if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
			if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
			if(mouseXScaled != undefined && mouseYScaled != undefined){
				// mouse was pressed inside of canvas
				mouseDownLocation = p.g.trySnapVertex({x:mouseXScaled, y:mouseYScaled}, p.snapRadius);
			}
		}
	}

	p.mouseReleased = function(event){
		if(p.mouseMode == 'select'){
			
		}
		if(p.mouseMode == 'draw'){
			if(mouseDownLocation != undefined){
				var mouseXScaled = p.mouseX / paperSize;
				var mouseYScaled = p.mouseY / paperSize;
				if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
				if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
				if(mouseXScaled != undefined && mouseYScaled != undefined){
					// mouse was released inside of canvas
					var snapMouseRelease = p.g.trySnapVertex({'x':mouseXScaled, 'y':mouseYScaled}, p.snapRadius);
					addLine(mouseDownLocation, snapMouseRelease);
				}
			} else{
				if(p.callback != undefined){
					p.callback(undefined);
				}			
			}
			mouseDownLocation = undefined;
		}
	}

	addLine = function(start, end){
		p.saveUndoState();
		p.g.addEdgeWithVertices(start.x, start.y, end.x, end.y);
		doCallback('add-line', {'start':start,'end':end} );
		// var newIntersections = p.g.cleanIntersections();
		// console.log(newIntersections);
		// doCallback('clean', {'intersections':newIntersections} );
		p.g.clean();
	}

	doCallback = function(description, data){
		if(p.callback != undefined){
			p.callback( {'description':description,'data':data} );
		}
	}
};