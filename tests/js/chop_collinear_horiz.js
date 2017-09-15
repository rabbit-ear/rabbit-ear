
var chopHoriz = new OrigamiPaper("canvas-chop-collinear-horiz");
chopHoriz.zoomToFit(0.05);

chopHoriz.selectNearestNode = true;
chopHoriz.selectNearestEdge = true;

chopHoriz.reset = function(){
	paper = this.scope; 
	var NUM_LINES = 20;
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	this.cp.crease(0.0, 0.5, 1.0, 0.5);
	for(var i = 0; i < NUM_LINES; i++){
		var x = .1 + .8*(i/(NUM_LINES-1));
		this.cp.crease( x, Math.random(), x, 0.5 );
	}
	var crossings = this.cp.fragment();
	this.initialize();
}
chopHoriz.reset();

chopHoriz.onFrame = function(event) { }
chopHoriz.onResize = function(event) { }
chopHoriz.onMouseDown = function(event){ this.reset(); }
chopHoriz.onMouseUp = function(event){ }
chopHoriz.onMouseMove = function(event) { }
