mouse_delete_edge_callback = undefined;

var deleteEdge = new PaperCreasePattern(new CreasePattern(), "canvas-mouse-delete-edge");
deleteEdge.zoomToFit(0.05);

deleteEdge.nearestEdgeColor = { hue:0, saturation:0.8, brightness:1 };

deleteEdge.reset = function(){
	deleteEdge.cp.clear();
	for(var i = 0; i < 15; i++){
		var angle = Math.random()*Math.PI*2;
		deleteEdge.cp.creaseRay(new XYPoint(Math.random(), Math.random()), new XYPoint(Math.cos(angle), Math.sin(angle)));
	}
	deleteEdge.cp.chop();
	deleteEdge.initialize();
	deleteEdge.nodeLayer.visible = true;
	if(mouse_delete_edge_callback != undefined){
		// mouse_delete_edge_callback(intersections);
	}
}
deleteEdge.reset();

deleteEdge.onFrame = function(event) { }
deleteEdge.onResize = function(event) { }
deleteEdge.onMouseDown = function(event){ 
	if(deleteEdge.nearestEdge != undefined){
		deleteEdge.cp.removeEdge(deleteEdge.nearestEdge);
		deleteEdge.nearestEdge = deleteEdge.cp.getNearestEdge( event.point.x, event.point.y ).edge;
		deleteEdge.initialize();
		deleteEdge.nodeLayer.visible = true;
	}
}
deleteEdge.onMouseUp = function(event){ }
deleteEdge.onMouseMove = function(event) { }
