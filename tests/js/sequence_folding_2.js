
var sequence2 = new PaperCreasePattern("canvas-sequence-folding-2");
sequence2.zoomToFit(0.1);

sequence2.reset = function(){ }
sequence2.reset();

sequence2.onFrame = function(event) { 
	var mag = 0.1;
	var paperCorners = [
		new XY(0.0 + mag*Math.cos(event.time*1.75+4), 0.0),
		new XY(0.0, 1.0),
		new XY(1.0 + mag*Math.sin(event.time*1.5+2), 1.0),
		new XY(1.0, 0.0 + mag*Math.cos(event.time*0.888888+5))
	];
	sequence2.cp.clear();
	sequence2.cp.polygon(paperCorners);
	var firstFold = sequence2.cp.creaseEdgeToEdge(sequence2.cp.topEdge(), sequence2.cp.bottomEdge())[0].valley();
	sequence2.cp.creaseEdgeToEdge(sequence2.cp.leftEdge(), sequence2.cp.rightEdge())[0].valley().creaseToEdge(firstFold).forEach(function(el){el.mountain();});
	sequence2.cp.clean();
	// console.log(sequence2.cp.nodes[12].flatFoldable());
	// console.log(sequence2.cp.nodes[12].x + " " + sequence2.cp.nodes[12].y);
	sequence2.initialize();
}
sequence2.onResize = function(event) { }
sequence2.onMouseDown = function(event){ }
sequence2.onMouseUp = function(event){ }
sequence2.onMouseMove = function(event) { }

