remove_edge_callback = undefined;

var removeEdge = new OrigamiPaper("canvas-remove-edge").setPadding(0.05);
removeEdge.show.faces = false;
removeEdge.show.nodes = true;
removeEdge.show.boundary = false;
removeEdge.style.node.fillColor = removeEdge.styles.byrne.blue;
removeEdge.style.node.radius = 0.0075;

removeEdge.reset = function(){ 
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	for(var i = 0; i < 15; i++){
		var angle = Math.random()*Math.PI*2;
		this.cp.creaseRay(new XY(Math.random(), Math.random()), new XY(Math.cos(angle), Math.sin(angle)));
	}
	this.cp.flatten();
	this.draw();
}
removeEdge.reset();

removeEdge.selectNearestEdge = function(point){
	var nearest = this.cp.nearest(point);
	this.updateStyles();
	if(nearest.edge != undefined && this.edges[ nearest.edge.index ] != undefined){
		this.edges[ nearest.edge.index ].strokeColor = this.styles.byrne.red;
	}
}

removeEdge.onFrame = function(event) { }
removeEdge.onResize = function(event) { }
removeEdge.onMouseDown = function(event){
	var nearest = this.cp.nearest(event.point);
	if(nearest.edge != undefined){
		var report = this.cp.removeEdge(nearest.edge);
		if(remove_edge_callback != undefined){ remove_edge_callback(report); }
		this.cp.flatten();
		this.draw();
		this.selectNearestEdge(event.point);
	}
}
removeEdge.onMouseUp = function(event){ }
removeEdge.onMouseMove = function(event){ this.selectNearestEdge(event.point); }
