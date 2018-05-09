
var edgeAngle = new OrigamiPaper("canvas-edge-by-angle");
edgeAngle.setPadding(0.05);

edgeAngle.select.edge = true;

edgeAngle.reset = function(){
	paper = this.scope; 
	edgeAngle.cp.clear();
	var centerNode = edgeAngle.cp.newNode().position(0.5, 0.5);
	var num = Math.floor(Math.random()*12 + 3);
	for(var i = 0; i < num; i++){
		edgeAngle.cp.newPlanarEdgeRadiallyFromNode(centerNode, Math.PI*2/num*i, 0.333);
	}
	edgeAngle.draw();
}
edgeAngle.reset();

edgeAngle.onFrame = function(event) { }
edgeAngle.onResize = function(event) { }
edgeAngle.onMouseDown = function(event){ edgeAngle.reset(); }
edgeAngle.onMouseUp = function(event){ }
edgeAngle.onMouseMove = function(event) { }

