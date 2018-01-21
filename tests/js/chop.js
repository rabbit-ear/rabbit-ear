
var chop_sketch = new OrigamiPaper("canvas-chop");
chop_sketch.setPadding(0.05);

chop_sketch.selectNearestNode = true;
chop_sketch.selectNearestEdge = true;

chop_sketch.reset = function(){
	paper = this.scope; 
	chop_sketch.cp.clear();
	chop_sketch.cp.nodes = [];
	chop_sketch.cp.edges = [];
	for(var i = 0; i < 30; i++){
		var angle = Math.random()*Math.PI*2;
		chop_sketch.cp.creaseRay(new XY(Math.random(), Math.random()), new XY(Math.cos(angle), Math.sin(angle)));
	}
	var crossings = chop_sketch.cp.fragment();
	chop_sketch.draw();
}
chop_sketch.reset();

chop_sketch.onFrame = function(event) { }
chop_sketch.onResize = function(event) { }
chop_sketch.onMouseDown = function(event){ chop_sketch.reset(); }
chop_sketch.onMouseUp = function(event){ }
chop_sketch.onMouseMove = function(event) { }
