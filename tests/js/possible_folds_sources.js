
var possible2 = new OrigamiPaper("canvas-possible-folds-sources");
possible2.zoomToFit(0.05);

possible2.nextSet;
possible2.nextSetLayer = new possible2.scope.Layer();
possible2.selectedNextLayer = new possible2.scope.Layer();

possible2.refresh = function(){
	this.nextSet = this.cp.possibleFolds3();
	this.selectedNextLayer.removeChildren();
	this.selectedNextLayer.activate();
	// for(var i = 0; i < this.nextSet.edges.length; i++){
	// 	var newPath = new paper.Path({segments: this.nextSet.edges[i].nodes, closed: false });
	// 	Object.assign(newPath, this.style.mark);
	// 	newPath.strokeWidth = 0.001;
	// }	
	this.nextSetLayer.bringToFront();
	this.selectedNextLayer.sendToBack();
}

possible2.reset = function(){
	// this.cp.clear();
	// this.initialize();
	this.refresh();
}
possible2.reset();

possible2.onFrame = function(event) { }
possible2.onResize = function(event) { }
possible2.onMouseDown = function(event){ 
	if(selectedEdge !== undefined){
		var crease = this.cp.crease(selectedEdge.edge.nodes[0], selectedEdge.edge.nodes[1]);
		if(crease !== undefined){ 
			crease.valley(); 
		}
	}
	this.initialize();
	this.refresh();
}
possible2.onMouseUp = function(event){ }
possible2.onMouseMove = function(event) { 
	this.nextSetLayer.removeChildren();
	this.nextSetLayer.activate();
	if(!this.cp.pointInside(event.point)){ return; }
	selectedEdge = this.nextSet.getNearestEdge(event.point.x, event.point.y);
	if(selectedEdge != undefined){
		console.log(selectedEdge.edge.madeBy);
		// console.log(selectedEdge.edge.nodes);
		var newPath = new paper.Path({segments: selectedEdge.edge.nodes, closed: false });
		Object.assign(newPath, this.style.valley);
		// newPath.strokeColor = {hue:0, saturation:1, brightness:1};
		var args = selectedEdge.edge.madeBy.args;
		if(args.length === 4){
			var seg1 = [[args[0].x, args[0].y],
			            [args[1].x, args[1].y] ];
			var newPath1 = new paper.Path({segments: seg1, closed: false });
			Object.assign(newPath1, this.style.mountain);
			newPath1.strokeColor = {hue:0, saturation:1, brightness:1};//{hue:140, saturation:0.7, brightness:0.9};
			// newPath1.strokeWidth = 0.015;

			var seg2 = [[args[2].x, args[2].y],
			            [args[3].x, args[3].y] ];
			var newPath2 = new paper.Path({segments: seg2, closed: false });
			Object.assign(newPath2, this.style.mountain);
			newPath2.strokeColor = {hue:0, saturation:1, brightness:1};//{hue:140, saturation:0.7, brightness:0.9};
			// newPath2.strokeWidth = 0.015;
		}
	}
}
