var mouse_select_callback;

var mouseSelect = new OrigamiPaper("canvas-mouse-select").blackAndWhite();
mouseSelect.setPadding(0.05);

mouseSelect.select.node = true;
mouseSelect.select.edge = true;

mouseSelect.reset = function(){
	paper = this.scope; 
	mouseSelect.cp.clear();
	mouseSelect.cp.birdBase();
	mouseSelect.draw();
}
mouseSelect.reset();

mouseSelect.onFrame = function(event) { }
mouseSelect.onResize = function(event) { }
mouseSelect.onMouseDown = function(event){ }
mouseSelect.onMouseUp = function(event){ }
mouseSelect.onMouseMove = function(event) { 
	if(mouse_select_callback != undefined){ mouse_select_callback(event.point); }
}