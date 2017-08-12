
var sequence3 = new PaperCreasePattern(new CreasePattern(), "canvas-sequence-folding-3");
sequence3.zoomToFit(0.1);

sequence3.reset = function(){ }
sequence3.reset();

sequence3.onFrame = function(event) { 
	var mag = 0.1;
	var paperCorners = [
		new XYPoint(0.0 + mag*Math.cos(event.time*1.75+4), 0.0),
		new XYPoint(0.0, 1.0),
		new XYPoint(1.0 + mag*Math.sin(event.time*1.5+2), 1.0),
		new XYPoint(1.0, 0.0 + mag*Math.cos(event.time*0.888888+5))
	];
	sequence3.cp.clear();
	sequence3.cp.polygon(paperCorners);
	var firstFold = sequence3.cp.creaseThroughPoints(sequence3.cp.topEdge().nodes[0], sequence3.cp.bottomEdge().nodes[0]).valley();
	sequence3.cp.creaseThroughPoints(sequence3.cp.topEdge().nodes[1], sequence3.cp.bottomEdge().nodes[1]).valley().creaseToEdge(firstFold).forEach(function(el){el.mountain();});
	sequence3.cp.clean();
	// console.log(sequence3.cp.nodes[8].flatFoldable());
	// console.log(sequence3.cp.nodes[8].x + " " + sequence3.cp.nodes[8].y);
	sequence3.initialize();
}
sequence3.onResize = function(event) { }
sequence3.onMouseDown = function(event){ }
sequence3.onMouseUp = function(event){ }
sequence3.onMouseMove = function(event) { }

