
var possible = new PaperCreasePattern("canvas-possible-folds");
possible.zoomToFit(0.05);

var nextSet;
var nextSetLayer = new possible.scope.Layer();
var selectedNextLayer = new possible.scope.Layer();
	

possible.refresh = function(){
	nextSet = this.cp.possibleFolds();
	selectedNextLayer.removeChildren();
	selectedNextLayer.activate();
	for(var i = 0; i < nextSet.edges.length; i++){
		var newPath = new paper.Path({segments: nextSet.edges[i].nodes, closed: false });
		Object.assign(newPath, this.style.mark);
		newPath.strokeWidth = 0.001;
	}	
	nextSetLayer.bringToFront();
	selectedNextLayer.sendToBack();
}

possible.reset = function(){
	// this.cp.clear();
	// this.initialize();
	this.refresh();
}
possible.reset();

possible.onFrame = function(event) { }
possible.onResize = function(event) { }
possible.onMouseDown = function(event){ 
	if(selectedEdge !== undefined){
		var crease = this.cp.crease(selectedEdge.edge.nodes[0], selectedEdge.edge.nodes[1]);
		if(crease !== undefined){ crease.valley(); }
	}
	this.initialize();
	this.refresh();
}
possible.onMouseUp = function(event){ }
possible.onMouseMove = function(event) { 
	selectedEdge = nextSet.getNearestEdge(event.point.x, event.point.y);
	nextSetLayer.removeChildren();
	nextSetLayer.activate();
	if(selectedEdge != undefined){
		// console.log(selectedEdge.edge.nodes);
		var newPath = new paper.Path({segments: selectedEdge.edge.nodes, closed: false });
		Object.assign(newPath, this.style.mark);
		newPath.strokeColor = {hue:0, saturation:1, brightness:1};
	}
}
