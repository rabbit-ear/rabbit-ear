mouse_delete_edge_callback = undefined;

var deleteEdge = new OrigamiPaper("canvas-mouse-delete-edge");
deleteEdge.setPadding(0.05);

deleteEdge.selectNearestEdge = true;

deleteEdge.reset = function(){
	paper = this.scope; 
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	for(var i = 0; i < 15; i++){
		var angle = Math.random()*Math.PI*2;
		this.cp.creaseRay(new XY(Math.random(), Math.random()), new XY(Math.cos(angle), Math.sin(angle)));
	}
	this.cp.fragment();
	this.draw();
	this.style.nodes.visible = true;
	this.style.nodes.fillColor = { hue:220, saturation:0.6, brightness:0.8 };
	this.update();
	if(mouse_delete_edge_callback != undefined){
		// mouse_delete_edge_callback(intersections);
	}
}
deleteEdge.reset();

deleteEdge.onFrame = function(event) { }
deleteEdge.onResize = function(event) { }
deleteEdge.onMouseDown = function(event){ 
	if(this.nearestEdge != undefined){
		this.cp.removeEdge(this.nearestEdge);
		this.cp.edgeArrayDidChange();
		this.nearestEdge = undefined;
		this.draw();
		this.selected.edges = [];
		// this.nodeLayer.visible = true;
	}
}
deleteEdge.onMouseUp = function(event){ }
deleteEdge.onMouseMove = function(event) { }
