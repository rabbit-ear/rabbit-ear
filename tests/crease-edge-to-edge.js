var creaseEdgeToEdgeCallback = undefined;
var creaseEdgeToEdge = new OrigamiPaper("canvas-crease-edge-to-edge");
creaseEdgeToEdge.selectNearestEdge = true;

creaseEdgeToEdge.reset = function(){
	this.cp.clear();
	// reset boundary
	var boundaryPoints = [];
	for(var i = 0; i < 30; i++){ boundaryPoints.push(new XY(Math.random(), Math.random()));}
	this.cp.setBoundary(boundaryPoints);
	this.draw();
}
creaseEdgeToEdge.reset();

creaseEdgeToEdge.edgeHighlights = [];
creaseEdgeToEdge.edgeHighlightLayer = new creaseEdgeToEdge.scope.Layer();

creaseEdgeToEdge.updateCreases = function(){
	this.cp.clear();

	var boundaryEdges = this.cp.boundary.edges.map(function(el){return new Edge(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y )});

	var nearest = this.nearestEdge;

	if(nearest !== undefined && !boundaryEdges[0].equivalent(nearest)){
		var edge = this.cp.creaseEdgeToEdge(boundaryEdges[0], nearest);
		if(edge !== undefined){ edge.forEach(function(el){el.valley();},this) }
	}
	this.draw();
	// this.update();

	this.edgeHighlightLayer.removeChildren();
	this.edgeHighlightLayer.activate();

	if(nearest !== undefined && !boundaryEdges[0].equivalent(nearest)){
		new this.scope.Path({segments: nearest.nodes, closed: false, strokeWidth:0.015, strokeColor:{red:1.0, green:0.0, blue:0.0} });
		new this.scope.Path({segments: boundaryEdges[0].nodes, closed: false, strokeWidth:0.015, strokeColor:{red:1.0, green:0.0, blue:0.0} });
	}

	if(creaseEdgeToEdgeCallback !== undefined){
		// creaseEdgeToEdgeCallback({'points':[this.selectable[0].position, this.selectable[1].position]});
	}
}
creaseEdgeToEdge.updateCreases();

creaseEdgeToEdge.onFrame = function(event){ }
creaseEdgeToEdge.onResize = function(event){ }
creaseEdgeToEdge.onMouseDown = function(event){ }
creaseEdgeToEdge.onMouseUp = function(event){ }
creaseEdgeToEdge.onMouseMove = function(event){ this.updateCreases(); }
