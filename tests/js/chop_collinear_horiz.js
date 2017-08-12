
var chopHoriz = new PaperCreasePattern("canvas-chop-collinear-horiz");
chopHoriz.zoomToFit(0.05);

chopHoriz.nearestNodeColor = { hue:0, saturation:0.8, brightness:1 };
chopHoriz.nearestEdgeColor = { hue:0, saturation:0.8, brightness:1 };

chopHoriz.reset = function(){
	var NUM_LINES = 20;
	chopHoriz.cp.clear();
	chopHoriz.cp.nodes = [];
	chopHoriz.cp.edges = [];
	chopHoriz.cp.creaseOnly(new XYPoint(0.0, 0.5), new XYPoint(1.0, 0.5));
	for(var i = 0; i < NUM_LINES; i++){
		var x = .1 + .8*(i/(NUM_LINES-1));
		chopHoriz.cp.creaseOnly( new XYPoint(x, Math.random()), new XYPoint(x, 0.5) );
	}
	var crossings = chopHoriz.cp.chop();
	chopHoriz.initialize();
}
chopHoriz.reset();

chopHoriz.onFrame = function(event) { }
chopHoriz.onResize = function(event) { }
chopHoriz.onMouseDown = function(event){ chopHoriz.reset(); }
chopHoriz.onMouseUp = function(event){ }
chopHoriz.onMouseMove = function(event) { }
