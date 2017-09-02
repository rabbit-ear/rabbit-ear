
var foldHalf = new OrigamiPaper("canvas-fold-in-half");
foldHalf.zoomToFit(0.05);

// foldHalf.selectNearestEdge = true;
foldHalf.style.mark.strokeColor = {gray:0};

foldHalf.reset = function(){
	this.cp.clear();
	this.initialize();
}
foldHalf.reset();

foldHalf.onFrame = function(event) { }
foldHalf.onResize = function(event) { }
foldHalf.onMouseDown = function(event){ 
	// this.reset();
	this.cp.foldInHalf().valley();
	this.cp.clean();
	for(var i = 0; i < this.cp.edges.length; i++){ if(this.cp.edges[i].orientation !== CreaseDirection.border) this.cp.edges[i].orientation = CreaseDirection.valley; }
	this.initialize();
}
foldHalf.onMouseUp = function(event){ }
foldHalf.onMouseMove = function(event) { }
