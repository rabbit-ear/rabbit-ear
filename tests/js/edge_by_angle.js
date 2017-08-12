
var edgeAngle = new PaperCreasePattern("canvas-edge-by-angle");
edgeAngle.zoomToFit(0.05);

edgeAngle.nearestEdgeColor = { hue:0, saturation:0.8, brightness:1 };

edgeAngle.reset = function(){
	edgeAngle.cp.clear();
	var centerNode = edgeAngle.cp.newNode().position(0.5, 0.5);
	var num = Math.floor(Math.random()*12 + 3);
	for(var i = 0; i < num; i++){
		edgeAngle.cp.newPlanarEdgeRadiallyFromNode(centerNode, Math.PI*2/num*i, 0.333);
	}
	edgeAngle.initialize();
}
edgeAngle.reset();

edgeAngle.onFrame = function(event) { }
edgeAngle.onResize = function(event) { }
edgeAngle.onMouseDown = function(event){ edgeAngle.reset(); }
edgeAngle.onMouseUp = function(event){ }
edgeAngle.onMouseMove = function(event) { }

