
var sequence2 = new OrigamiPaper("canvas-sequence-folding-2").setPadding(0.1);

sequence2.onFrame = function(event) { 
	var mag = 0.1;
	var paperCorners = [
		[0.0 + mag*Math.cos(event.time*1.75+4), 0.0],
		[0.0, 1.0],
		[1.0 + mag*Math.sin(event.time*1.5+2), 1.0],
		[1.0, 0.0 + mag*Math.cos(event.time*0.888888+5)]
	];
	this.cp.clear();
	this.cp.setBoundary(paperCorners);
	var firstFold = this.cp.creaseEdgeToEdge(this.cp.topEdge(), this.cp.bottomEdge())[0].valley();
	this.cp.creaseEdgeToEdge(this.cp.leftEdge(), this.cp.rightEdge())[0].valley().creaseToEdge(firstFold).forEach(function(el){el.mountain();});
	this.cp.clean();
	var centerNode = this.cp.nearestNodes(1, 0.5, 0.5).shift();
	// console.log(centerNode.flatFoldable());
	// console.log(centerNode.x + " " + centerNode.y);
	this.draw();
}
sequence2.onResize = function(event) { }
sequence2.onMouseDown = function(event){ }
sequence2.onMouseUp = function(event){ }
sequence2.onMouseMove = function(event) { }

