
var chopVert = new PaperCreasePattern("canvas-chop-collinear-vert");
chopVert.zoomToFit(0.05);

chopVert.selectNearestNode = true;
chopVert.selectNearestEdge = true;

chopVert.reset = function(){
	var NUM_LINES = 20;
	chopVert.cp.clear();
	chopVert.cp.nodes = [];
	chopVert.cp.edges = [];
	chopVert.cp.creaseOnly(new XYPoint(0.5, 0.0), new XYPoint(0.5, 1.0));
	for(var i = 0; i < NUM_LINES; i++){
		var y = .1 + .8*(i/(NUM_LINES-1));
		chopVert.cp.creaseOnly( new XYPoint(Math.random(), y), new XYPoint(0.5, y) );
	}
	var crossings = chopVert.cp.chop();
	chopVert.initialize();
}
chopVert.reset();

chopVert.onFrame = function(event) { }
chopVert.onResize = function(event) { }
chopVert.onMouseDown = function(event){ chopVert.reset(); }
chopVert.onMouseUp = function(event){ }
chopVert.onMouseMove = function(event) { }