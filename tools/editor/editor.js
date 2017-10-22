var project = new OrigamiPaper("canvas");
project.zoomToFit(0.05);
project.style.border.strokeWidth = 0.002;
project.update();

project.allPossibleFolds = new CreasePattern();

project.showCreases = false;

project.targetCreaseSourceLayer = new project.scope.Layer();
project.possibleCreasesLayer = new project.scope.Layer();
project.possibleCreasesLayer.visible = false;

project.inputMode = "add-valley";
// "add-mountain";
// "add-mark";
// "remove";

project.recalculateFolds = function(){
	// don't split the lines, but add their crossings as isolated nodes
	this.cp.removeIsolatedNodes();
	var intersections = this.cp.getEdgeIntersections();
	for(var i = 0; i < intersections.length; i++){
		this.cp.newPlanarNode(intersections[i].x, intersections[i].y);
	}
	// calculate all possible folds
	this.allPossibleFolds = this.cp.possibleFolds();
	this.possibleCreasesLayer.removeChildren();
	this.possibleCreasesLayer.activate();
	for(var i = 0; i < this.allPossibleFolds.edges.length; i++){
		var newPath = new this.scope.Path({segments: this.allPossibleFolds.edges[i].nodes, closed: false });
		Object.assign(newPath, this.style.mark);
		newPath.strokeWidth = 0.001;
	}
	this.possibleCreasesLayer.sendToBack();
	this.backgroundLayer.sendToBack();
	this.targetCreaseSourceLayer.bringToFront();
}

project.reset = function(){
	paper = this.scope; 
	this.recalculateFolds();
}
project.reset();

project.onFrame = function(event) { }
project.onResize = function(event) { }
project.onMouseDown = function(event){ }
project.onMouseUp = function(event){ 
	if(this.mouseDidDrag){
		this.mouseDragLayer.activate();
		this.mouseDragLayer.clear();
		// crease the line
		var edge = this.allPossibleFolds.getNearestEdgeFrom2Nodes(this.mouseDownLocation, event.point);
		if(edge !== undefined){
			var crease = this.cp.crease(edge.nodes[0], edge.nodes[1]);
			if(crease !== undefined){
			switch(this.inputMode){
				case "add-valley": crease.valley(); break;
				case "add-mountain": crease.mountain(); break;
				case "add-mark": crease.mark(); break;
				case "remove":
					if(selectedEdge.edge.orientation !== CreaseDirection.border){
						this.cp.removeEdge(selectedEdge.edge);
					}
					break;
				}
			}
			this.init();
			this.recalculateFolds();
		}
	} else{
		if(selectedEdge !== undefined){
			var crease = this.cp.crease(selectedEdge.edge.nodes[0], selectedEdge.edge.nodes[1]);
			if(crease !== undefined){
			switch(this.inputMode){
				case "add-valley": crease.valley(); break;
				case "add-mountain": crease.mountain(); break;
				case "add-mark": crease.mark(); break;
				case "remove":
					if(selectedEdge.edge.orientation !== CreaseDirection.border){
						this.cp.removeEdge(selectedEdge.edge);
					}
					break;
				}
			}
			this.init();
			this.recalculateFolds();
		}		
	}
}
project.onMouseDidBeginDrag = function(event){
	this.targetCreaseSourceLayer.removeChildren();	
}
project.onMouseMove = function(event) {
	if(this.mouseDown){
		this.mouseDragLayer.activate();
		this.mouseDragLayer.clear();
		var dragPath = new paper.Path({segments: [this.mouseDownLocation, event.point], closed: false });
		switch(this.inputMode){
			case "add-valley": Object.assign(dragPath, this.style.valley); break;
			case "add-mountain": Object.assign(dragPath, this.style.mountain); break;
			case "add-mark": Object.assign(dragPath, this.style.mark); break;
		}
		dragPath.strokeColor.alpha = 0.333;
		var edge = this.allPossibleFolds.getNearestEdgeFrom2Nodes(this.mouseDownLocation, event.point);
		if(edge !== undefined){
			var newPath = new paper.Path({segments: edge.nodes, closed: false });	
			switch(this.inputMode){
				case "add-valley": Object.assign(newPath, this.style.valley); break;
				case "add-mountain": Object.assign(newPath, this.style.mountain); break;
				case "add-mark": Object.assign(newPath, this.style.mark); break;
			}
			newPath.strokeColor.alpha = 0.666;
		}
	} else{
		this.targetCreaseSourceLayer.removeChildren();
		this.targetCreaseSourceLayer.activate();
		if(!this.cp.contains(event.point)){ return; }
		switch(this.inputMode){
			case "add-valley":
			case "add-mountain":
			case "add-mark":
				selectedEdge = this.allPossibleFolds.getNearestEdge(event.point.x, event.point.y);
			break;
			case "remove":
				selectedEdge = this.cp.getNearestEdge(event.point.x, event.point.y);
			break;
		}		
		
		if(selectedEdge != undefined){
			this.targetCreaseSourceLayer.activate();
			var newPath = new paper.Path({segments: selectedEdge.edge.nodes, closed: false });
			// Object.assign(newPath, this.style.mark);
			// newPath.strokeColor = {hue:0, saturation:1, brightness:1};
			switch(this.inputMode){
				case "add-valley": Object.assign(newPath, this.style.valley); break;
				case "add-mountain": Object.assign(newPath, this.style.mountain); break;
				case "add-mark": Object.assign(newPath, this.style.mark); break;
			}
			newPath.strokeColor.alpha = 0.666;

			if(selectedEdge.edge === undefined || selectedEdge.edge.madeBy === undefined || selectedEdge.edge.madeBy.args === undefined){ return; }
			var args = selectedEdge.edge.madeBy.args;
			if(args.length === 2){
				var points = [[args[0].x, args[0].y],
				              [args[1].x, args[1].y] ];
				var circle0 = new paper.Path.Circle(points[0], 0.01);
				var circle1 = new paper.Path.Circle(points[1], 0.01);
				Object.assign(circle0, {strokeWidth:0.01,strokeColor:{gray:0.0},fillColor:undefined});
				Object.assign(circle1, {strokeWidth:0.01,strokeColor:{gray:0.0},fillColor:undefined});
			}
			if(args.length === 4){
				var seg1 = [[args[0].x, args[0].y],
				            [args[1].x, args[1].y] ];
				var newPath1 = new paper.Path({segments: seg1, closed: false });
				Object.assign(newPath1, this.style.mountain);
				newPath1.strokeColor = { gray:0.0 };
				var seg2 = [[args[2].x, args[2].y],
				            [args[3].x, args[3].y] ];
				var newPath2 = new paper.Path({segments: seg2, closed: false });
				Object.assign(newPath2, this.style.mountain);
				newPath2.strokeColor = { gray:0.0 };
			}
		}

	}

	var mouseString = event.point.x.toFixed(2) + " " + event.point.y.toFixed(2);
	var ta = document.getElementById('mouse-position-text').value = mouseString;
}
