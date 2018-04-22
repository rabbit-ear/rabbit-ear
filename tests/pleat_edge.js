var pleat_edge = new OrigamiPaper("canvas-pleat-edge");

pleat_edge.style.mark.strokeColor = {gray:0.0};
pleat_edge.edgeHighlightLayer = new pleat_edge.scope.Layer();
pleat_edge.edgeHighlightColor = pleat_edge.styles.byrne.yellow;//{gray:0.6};

pleat_edge.resetBoundary = function(){
	var points = [];
	for(var i = 0; i < 20; i++){ points.push(new XY(Math.random(), Math.random()));}
	this.cp.setBoundary(points);
	this.draw();
}
pleat_edge.reset = function(){
	this.cp.clear();
	this.resetBoundary();
	var randomEdge = 0;
	while(randomEdge === 0){
		randomEdge = parseInt(Math.random()*this.cp.boundary.edges.length);
	}
	var creases = this.cp.pleat(this.cp.boundary.edges[0], this.cp.boundary.edges[randomEdge], 8)
	if(creases !== undefined){
		creases.forEach(function(el,i){
			if(i%2==0){ el.mountain(); }
			else { el.valley(); }
		},this);
	}
	
	this.draw();

	this.edgeHighlightLayer.removeChildren();
	this.edgeHighlightLayer.activate();
	new this.scope.Path({segments: this.cp.boundary.edges[0].nodes, closed: false, strokeWidth:0.011, strokeColor:this.edgeHighlightColor });
	new this.scope.Path({segments: this.cp.boundary.edges[randomEdge].nodes, closed: false, strokeWidth:0.011, strokeColor:this.edgeHighlightColor });
}
pleat_edge.reset();

pleat_edge.onFrame = function(event){ }
pleat_edge.onResize = function(event){ }
pleat_edge.onMouseDown = function(event){ this.reset(); }
pleat_edge.onMouseUp = function(event){ }
pleat_edge.onMouseMove = function(event){ }
