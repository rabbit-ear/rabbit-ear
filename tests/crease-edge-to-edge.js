var creaseEdgeToEdgeCallback = undefined;
var creaseEdgeToEdge = new OrigamiPaper("canvas-crease-edge-to-edge");
creaseEdgeToEdge.selectNearestEdge = true;

creaseEdgeToEdge.reset = function(){
	this.cp.clear();
	// reset boundary
	var boundaryPoints = [];
	for(var i = 0; i < 50; i++){
		var r = Math.random()*0.5;
		var a = Math.random()*2*Math.PI;
		boundaryPoints.push(new XY(0.5+r*Math.cos(a), 0.5+r*Math.sin(a)));
	}
	this.cp.setBoundary(boundaryPoints);
	this.draw();
}
creaseEdgeToEdge.reset();

creaseEdgeToEdge.edgeHighlights = [];
creaseEdgeToEdge.edgeHighlightLayer = new creaseEdgeToEdge.scope.Layer();

creaseEdgeToEdge.updateCreases = function(){
	this.cp.clear();

	var nearest = this.cp.boundary.edges
		.map(function(edge){ return {edge:edge, point:edge.nearestPoint(this.mouse.position)}; },this)
		.map(function(el){ el.distance = this.mouse.position.distanceTo(el.point); return el; },this)
		.sort(function(a,b){ return a.distance - b.distance; },this)
		.map(function(el){ return el.edge},this)
		.shift();

	var boundary0 = new Edge(this.cp.boundary.edges[0].nodes[0].x,
	                         this.cp.boundary.edges[0].nodes[0].y,
	                         this.cp.boundary.edges[0].nodes[1].x,
	                         this.cp.boundary.edges[0].nodes[1].y );

	if(nearest !== undefined && !boundary0.equivalent(nearest)){
		var edge = this.cp.creaseEdgeToEdge(boundary0, nearest);
		if(edge !== undefined){ edge.forEach(function(el){el.valley();},this) }
	}
	this.draw();

	this.edgeHighlightLayer.removeChildren();
	this.edgeHighlightLayer.activate();

	new this.scope.Path({segments: boundary0.nodes, closed: false, strokeWidth:0.015, strokeColor:{red:1.0, green:0.0, blue:0.0} });
	new this.scope.Path({segments: nearest.nodes, closed: false, strokeWidth:0.015, strokeColor:{red:1.0, green:0.0, blue:0.0} });

	if(creaseEdgeToEdgeCallback !== undefined){
		// creaseEdgeToEdgeCallback({'points':[this.selectable[0].position, this.selectable[1].position]});
	}
}
creaseEdgeToEdge.updateCreases();

creaseEdgeToEdge.onFrame = function(event){ }
creaseEdgeToEdge.onResize = function(event){ }
creaseEdgeToEdge.onMouseDown = function(event){ this.reset(); this.updateCreases(); }
creaseEdgeToEdge.onMouseUp = function(event){ }
creaseEdgeToEdge.onMouseMove = function(event){ this.updateCreases(); }
