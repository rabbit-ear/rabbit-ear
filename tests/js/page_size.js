
var project = new OrigamiPaper("canvas");
// project.zoomToFit(0.05);

project.reset = function(){
	paper = this.scope; 
	// project.cp.clear();
	// project.init();
}
project.reset();

project.onFrame = function(event) { }
project.onResize = function(event) { }
project.onMouseDown = function(event){ }
project.onMouseUp = function(event){ }
project.onMouseMove = function(event) { }
