
var chopVert = new OrigamiPaper("canvas-chop-collinear-vert");
chopVert.zoomToFit(0.05);

chopVert.selectNearestNode = true;
chopVert.selectNearestEdge = true;

chopVert.reset = function(){
	var NUM_LINES = 20;
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	this.cp.crease(0.5, 0.0, 0.5, 1.0);
	for(var i = 0; i < NUM_LINES; i++){
		var y = .1 + .8*(i/(NUM_LINES-1));
		this.cp.crease(Math.random(), y, 0.5, y);
	}
	var crossings = this.cp.chop();
	this.initialize();
}
chopVert.reset();

chopVert.onFrame = function(event) { }
chopVert.onResize = function(event) { }
chopVert.onMouseDown = function(event){ this.reset(); }
chopVert.onMouseUp = function(event){ }
chopVert.onMouseMove = function(event) { }