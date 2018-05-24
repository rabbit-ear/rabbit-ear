
var sequence3 = new OrigamiPaper("canvas-sequence-folding-3").setPadding(0.1);

sequence3.onFrame = function(event) { 
	var mag = 0.1;
	var paperCorners = [
		[0.0 + mag*Math.cos(event.time*1.75+4), 0.0],
		[0.0, 1.0],
		[1.0 + mag*Math.sin(event.time*1.5+2), 1.0],
		[1.0, 0.0 + mag*Math.cos(event.time*0.888888+5)]
	];
	this.cp.clear();
	this.cp.setBoundary(paperCorners);
	var firstFold = this.cp.creaseThroughPoints(this.cp.topEdge().nodes[0], this.cp.bottomEdge().nodes[0]).valley();
	this.cp.creaseThroughPoints(this.cp.topEdge().nodes[1], this.cp.bottomEdge().nodes[1]).valley().creaseToEdge(firstFold).forEach(function(el){el.mountain();});
	this.cp.clean();
	var centerNode = this.cp.nearestNodes(1, 0.5, 0.5).shift();
	// console.log(centerNode.flatFoldable());
	// console.log(centerNode.x + " " + centerNode.y);
	this.draw();
}
sequence3.onResize = function(event) { }
sequence3.onMouseDown = function(event){ }
sequence3.onMouseUp = function(event){ }
sequence3.onMouseMove = function(event) { }
