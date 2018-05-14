mouse_delete_edge_callback = undefined;

var deleteEdge = new OrigamiPaper("canvas-mouse-delete-edge");
deleteEdge.setPadding(0.05);
deleteEdge.show.faces = false;
deleteEdge.style.node.visible = true;
deleteEdge.style.node.fillColor = { hue:220, saturation:0.6, brightness:0.8 };

deleteEdge.reset = function(){
	paper = this.scope; 
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	for(var i = 0; i < 15; i++){
		var angle = Math.random()*Math.PI*2;
		this.cp.creaseRay(new XY(Math.random(), Math.random()), new XY(Math.cos(angle), Math.sin(angle)));
	}
	this.cp.flatten();
	this.draw();
	// if(mouse_delete_edge_callback != undefined){ mouse_delete_edge_callback(intersections); }
}
deleteEdge.reset();

deleteEdge.selectNearestEdge = function(point){
	var nearest = this.cp.nearest(point);
	this.updateStyles();
	if(nearest.edge != undefined && this.edges[ nearest.edge.index ] != undefined){
		this.edges[ nearest.edge.index ].strokeColor = this.styles.byrne.red;
	}
}

deleteEdge.onFrame = function(event) { }
deleteEdge.onResize = function(event) { }
deleteEdge.onMouseDown = function(event){
	var nearest = this.cp.nearest(event.point);
	if(nearest.edge != undefined){
		var report = this.cp.removeEdge(nearest.edge);
		this.cp.flatten();
		this.draw();
		this.selectNearestEdge(event.point);
	}
}
deleteEdge.onMouseUp = function(event){ }
deleteEdge.onMouseMove = function(event){ this.selectNearestEdge(event.point); }
