
var sequence1 = new OrigamiPaper("canvas-sequence-folding").setPadding(0.1);

sequence1.onFrame = function(event) { 
	var mag = 0.1;
	var paperCorners = [
		[0.0 + mag*Math.cos(event.time*1.75+4), 0.0],
		[0.0, 1.0],
		[1.0 + mag*Math.sin(event.time*1.5+2), 1.0],
		[1.0, 0.0 + mag*Math.cos(event.time*0.888888+5)]
	];
	this.cp.clear();
	this.cp.setBoundary(paperCorners);
	var firstFold = this.cp.creaseEdgeToEdge(this.cp.topEdge(), this.cp.leftEdge())[0].mountain();
	this.cp.creaseEdgeToEdge(this.cp.topEdge(), this.cp.rightEdge())[0].mountain().creaseToEdge(firstFold).forEach(function(el){el.valley();});
	this.cp.clean();
	var centerNode = this.cp.nearestNodes(1, 0.5, 0.5).shift();
	// console.log(centerNode.flatFoldable());
	// console.log(centerNode.x + " " + centerNode.y);
	this.draw();
}
sequence1.onResize = function(event) { }
sequence1.onMouseDown = function(event){ }
sequence1.onMouseUp = function(event){ }
sequence1.onMouseMove = function(event) { }
