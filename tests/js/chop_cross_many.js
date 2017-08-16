
var chopCross = new PaperCreasePattern("canvas-chop-cross-many");
chopCross.zoomToFit(0.05);

chopCross.selectNearestNode = true;
chopCross.selectNearestEdge = true;

chopCross.reset = function(){
	var NUM_LINES = 30;
	chopCross.cp.clear();
	chopCross.cp.nodes = [];
	chopCross.cp.edges = [];
	var firstEdge = chopCross.cp.creaseOnly(new XYPoint(0.0, 0.5), new XYPoint(1.0, 0.5));
	var v = .8/(NUM_LINES-1);
	for(var i = 0; i < NUM_LINES; i++){
		var x = .1 + .8*(i/(NUM_LINES-1));
		chopCross.cp.creaseOnly(
			new XYPoint(x + Math.random()*v-v*0.5, 0.25 + Math.random()*v-v*0.5), 
			new XYPoint(x + Math.random()*v-v*0.5, 0.75 + Math.random()*v-v*0.5)
		);
	}
	var lowerEdge = chopCross.cp.creaseOnly(new XYPoint(0.0, 0.6), new XYPoint(1.0, 0.6));
	var crossings = chopCross.cp.chop();
	chopCross.initialize();
}
chopCross.reset();

chopCross.onFrame = function(event) { }
chopCross.onResize = function(event) { }
chopCross.onMouseDown = function(event){ chopCross.reset(); }
chopCross.onMouseUp = function(event){ }
chopCross.onMouseMove = function(event) { }
