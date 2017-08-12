var mouse_select_callback;

var mouseSelect = new PaperCreasePattern(new CreasePattern(), "canvas-mouse-select");
mouseSelect.zoomToFit(0.05);

mouseSelect.nearestNodeColor = { hue:0, saturation:0.8, brightness:1 };
mouseSelect.nearestEdgeColor = { hue:0, saturation:0.8, brightness:1 };

mouseSelect.reset = function(){
	mouseSelect.cp.clear();
	mouseSelect.cp.birdBase();
	mouseSelect.initialize();
}
mouseSelect.reset();

mouseSelect.onFrame = function(event) { }
mouseSelect.onResize = function(event) { }
mouseSelect.onMouseDown = function(event){ }
mouseSelect.onMouseUp = function(event){ }
mouseSelect.onMouseMove = function(event) { 
	if(mouse_select_callback != undefined){ mouse_select_callback(event.point); }
}