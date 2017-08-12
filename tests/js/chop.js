
var chop_sketch = new PaperCreasePattern("canvas-chop");
chop_sketch.zoomToFit(0.05);

chop_sketch.nearestNodeColor = { hue:0, saturation:0.8, brightness:1 };
chop_sketch.nearestEdgeColor = { hue:0, saturation:0.8, brightness:1 };

chop_sketch.reset = function(){
	chop_sketch.cp.clear();
	chop_sketch.cp.nodes = [];
	chop_sketch.cp.edges = [];
	for(var i = 0; i < 30; i++){
		var angle = Math.random()*Math.PI*2;
		chop_sketch.cp.creaseRay(new XYPoint(Math.random(), Math.random()), new XYPoint(Math.cos(angle), Math.sin(angle)));
	}
	var crossings = chop_sketch.cp.chop();
	chop_sketch.initialize();
}
chop_sketch.reset();

chop_sketch.onFrame = function(event) { }
chop_sketch.onResize = function(event) { }
chop_sketch.onMouseDown = function(event){ chop_sketch.reset(); }
chop_sketch.onMouseUp = function(event){ }
chop_sketch.onMouseMove = function(event) { }
