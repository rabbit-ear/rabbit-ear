
var possible = new OrigamiPaper("canvas-possible-folds");
possible.setPadding(0.05);

possible.nextSet;
possible.nextSetLayer = new possible.scope.Layer();
possible.selectedNextLayer = new possible.scope.Layer();
	
possible.refresh = function(){
	this.nextSet = this.cp.possibleFolds3();
	this.selectedNextLayer.removeChildren();
	this.selectedNextLayer.activate();
	for(var i = 0; i < this.nextSet.edges.length; i++){
		var newPath = new paper.Path({segments: this.nextSet.edges[i].nodes, closed: false });
		Object.assign(newPath, this.style.mark);
		newPath.strokeWidth = 0.001;
	}	
	this.nextSetLayer.bringToFront();
	this.selectedNextLayer.sendToBack();
}

possible.reset = function(){
	paper = this.scope; 
	// this.cp.clear();
	// this.draw();
	this.refresh();
}
possible.reset();

possible.onFrame = function(event) { }
possible.onResize = function(event) { }
possible.onMouseDown = function(event){ 
	if(selectedEdge !== undefined){
		var crease = this.cp.crease(selectedEdge.edge.nodes[0], selectedEdge.edge.nodes[1]);
		if(crease !== undefined){ 
			crease.valley(); 
		}
	}
	this.draw();
	this.refresh();
}
possible.onMouseUp = function(event){ }
possible.onMouseMove = function(event) { 
	this.nextSetLayer.removeChildren();
	this.nextSetLayer.activate();
	if(!this.cp.pointInside(event.point)){ return; }
	selectedEdge = this.nextSet.nearest(event.point.x, event.point.y).edge;
	if(selectedEdge != undefined){
		var newPath = new paper.Path({segments: selectedEdge.edge.nodes, closed: false });
		Object.assign(newPath, this.style.mark);
		newPath.strokeColor = {hue:0, saturation:1, brightness:1};
	}
}
