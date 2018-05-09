
var foldHalf = new OrigamiPaper("canvas-fold-in-half");
foldHalf.setPadding(0.05);

// foldHalf.select.edge = true;
foldHalf.style.mark.strokeColor = {gray:0};

foldHalf.reset = function(){
	paper = this.scope; 
	this.cp.clear();
	this.draw();
}
foldHalf.reset();

foldHalf.onFrame = function(event) { }
foldHalf.onResize = function(event) { }
foldHalf.onMouseDown = function(event){ 
	// this.reset();
	this.cp.foldInHalf().valley();
	this.cp.clean();
	for(var i = 0; i < this.cp.edges.length; i++){ if(this.cp.edges[i].orientation !== CreaseDirection.border) this.cp.edges[i].orientation = CreaseDirection.valley; }
	this.draw();
}
foldHalf.onMouseUp = function(event){ }
foldHalf.onMouseMove = function(event) { }
