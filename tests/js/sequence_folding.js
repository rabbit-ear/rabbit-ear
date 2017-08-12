
var sequence1 = new PaperCreasePattern(new CreasePattern(), "canvas-sequence-folding");
sequence1.zoomToFit(0.1);

sequence1.reset = function(){ }
sequence1.reset();

sequence1.onFrame = function(event) { 
	var mag = 0.1;
	var paperCorners = [
		new XYPoint(0.0 + mag*Math.cos(event.time*1.75+4), 0.0),
		new XYPoint(0.0, 1.0),
		new XYPoint(1.0 + mag*Math.sin(event.time*1.5+2), 1.0),
		new XYPoint(1.0, 0.0 + mag*Math.cos(event.time*0.888888+5))
	];
	sequence1.cp.clear();
	sequence1.cp.polygon(paperCorners);
	var firstFold = sequence1.cp.creaseEdgeToEdge(sequence1.cp.topEdge(), sequence1.cp.leftEdge())[0].mountain();
	sequence1.cp.creaseEdgeToEdge(sequence1.cp.topEdge(), sequence1.cp.rightEdge())[0].mountain().creaseToEdge(firstFold).forEach(function(el){el.valley();});
	sequence1.cp.clean();
	// console.log(sequence1.cp.nodes[10].flatFoldable());
	// console.log(sequence1.cp.nodes[10].x + " " + sequence1.cp.nodes[10].y);
	sequence1.initialize();
}
sequence1.onResize = function(event) { }
sequence1.onMouseDown = function(event){ }
sequence1.onMouseUp = function(event){ }
sequence1.onMouseMove = function(event) { }
