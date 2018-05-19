$("#radio-input-mode :input").change(function() {
	switch(this.id){
	case "radio-button-add":
		project.inputMode = "add-valley";
	break;
	case "radio-button-remove":
		project.inputMode = "remove";
	break;
	}
});


// incoming file from upload-button or drag-to-upload
function fileDidLoad(file, mimeType){
	try{
		// try .fold file format first
		var foldFile = JSON.parse(file);
		project.cp.importFoldFile(foldFile);
		project.draw();
	} catch(err){
		// try .svg file format
		project.load(file, function(){ });
	}
	// switch(mimeType){
	// 	case "image/svg+xml": project.load(file, function(){ }); break;
	// 	default: break;
	// }
}
function download(text, filename, mimeType){
	var blob = new Blob([text], {type: mimeType});
	var url = window.URL.createObjectURL(blob);
	var a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
}
document.getElementById("download-svg").addEventListener("click", function(e){
	e.preventDefault();
	var svgBlob = project.cp.exportSVG();
	download(svgBlob, "creasepattern.svg", "image/svg+xml");
});

////////////////////////////////////////////////////////////////////////

//var foldedState = new OrigamiFold("canvas-folded");

var project = new OrigamiPaper("canvas");
project.setPadding(0.05);
project.style.border.strokeWidth = 0.002;
project.update();

project.allPossibleFolds = new CreasePattern();

project.showCreases = false;

project.ghostCreaseLayer = new project.scope.Layer();
project.possibleCreasesLayer = new project.scope.Layer();
project.possibleCreasesLayer.visible = false;

project.mouseDragLayer = new project.scope.Layer();

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
	if(this.allPossibleFolds !== undefined){
		for(var i = 0; i < this.allPossibleFolds.edges.length; i++){
			var newPath = new this.scope.Path({segments: this.allPossibleFolds.edges[i].nodes, closed: false });
			Object.assign(newPath, this.style.mark);
			newPath.strokeWidth = 0.001;
		}
	}
	this.possibleCreasesLayer.sendToBack();
	this.backgroundLayer.sendToBack();
	this.ghostCreaseLayer.bringToFront();
}

project.reset = function(){
	paper = this.scope;
	this.recalculateFolds();
	// foldCP();
}
project.reset();

project.onFrame = function(event){ }
project.onResize = function(event){ }
project.onMouseDown = function(event){ }
project.onMouseUp = function(event){ 
	if(this.mouseDidDrag){
		this.mouseDragLayer.activate();
		this.mouseDragLayer.clear();
		// crease the line
		var edge = this.allPossibleFolds.getNearestEdgeConnectingPoints(this.mouse.pressed, event.point);
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
			this.draw();
			this.recalculateFolds();
			// foldCP();
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
			this.draw();
			this.recalculateFolds();
			// foldCP();
		}		
	}
}
project.onMouseDidBeginDrag = function(event){
	this.ghostCreaseLayer.removeChildren();	
}
project.onMouseMove = function(event){
	if(this.mouse.isPressed){
		this.mouseDragLayer.activate();
		this.mouseDragLayer.clear();
		var dragPath = new paper.Path({segments: [this.mouse.pressed, event.point], closed: false });
		switch(this.inputMode){
			case "add-valley": Object.assign(dragPath, this.style.valley); break;
			case "add-mountain": Object.assign(dragPath, this.style.mountain); break;
			case "add-mark": Object.assign(dragPath, this.style.mark); break;
		}
		dragPath.strokeColor.alpha = 0.333;
		// var edge = this.allPossibleFolds.getNearestEdgeConnectingPoints(this.mouse.pressed, event.point);
		// if(edge !== undefined){
		// 	var newPath = new paper.Path({segments: edge.nodes, closed: false });	
		// 	switch(this.inputMode){
		// 		case "add-valley": Object.assign(newPath, this.style.valley); break;
		// 		case "add-mountain": Object.assign(newPath, this.style.mountain); break;
		// 		case "add-mark": Object.assign(newPath, this.style.mark); break;
		// 	}
		// 	newPath.strokeColor.alpha = 0.666;
		// }
	} else{
		this.ghostCreaseLayer.removeChildren();
		this.ghostCreaseLayer.activate();
		if(!this.cp.contains(event.point)){ return; }
		switch(this.inputMode){
			case "add-valley":
			case "add-mountain":
			case "add-mark":
				selectedEdge = this.allPossibleFolds.nearest(event.point.x, event.point.y).edge;
			break;
			case "remove":
				selectedEdge = this.cp.nearest(event.point.x, event.point.y).edge;
			break;
		}		
		
		if(selectedEdge != undefined){
			this.ghostCreaseLayer.activate();
			var newPath = new paper.Path({segments: selectedEdge.edge.nodes, closed: false });
			// Object.assign(newPath, this.style.mark);
			// newPath.strokeColor = {hue:0, saturation:1, brightness:1};
			switch(this.inputMode){
				case "add-valley": Object.assign(newPath, this.style.valley); break;
				case "add-mountain": Object.assign(newPath, this.style.mountain); break;
				case "add-mark": Object.assign(newPath, this.style.mark); break;
				case "remove": Object.assign(newPath, this.style.mountain); break;
			}
			if(newPath.strokeColor !== null){
				newPath.strokeColor.alpha = 0.666;
			}

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

	// var mouseString = event.point.x.toFixed(2) + " " + event.point.y.toFixed(2);
	// var ta = document.getElementById('mouse-position-text').value = mouseString;
}
