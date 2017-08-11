
var project = new PaperCreasePattern(new CreasePattern(), "canvas");
project.zoomToFit(0.05);

project.reset = function(){
	project.cp.clear();
	project.initialize();
}
project.reset();

project.onFrame = function(event) { }
project.onResize = function(event) { }
project.onMouseDown = function(event){ }
project.onMouseUp = function(event){ }
project.onMouseMove = function(event) { }
