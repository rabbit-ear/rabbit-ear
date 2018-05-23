var pleat_edge = new OrigamiPaper("canvas-pleat-edge");
pleat_edge.style.mark.strokeColor = {gray:0.0};
pleat_edge.edgeHighlightLayer = new pleat_edge.scope.Layer();
pleat_edge.edgeHighlightColor = pleat_edge.styles.byrne.yellow;

pleat_edge.resetBoundary = function(radius){
	if (radius === undefined){ radius = 0.5; }
	var points = [];
	for(var i = 0; i < 30; i++){ 
		var angle = Math.random()*2*Math.PI;
		var r = Math.random()*radius;
		points.push(new XY(r*Math.cos(angle), r*Math.sin(angle)));
	}
	this.cp.setBoundary(points);
	// this.cp.setBoundary([ new XY(0,0), new XY(0,1.5), new XY(1.5,1.5), new XY(1.5,0) ])
	// this.cp.hexagon();
}
pleat_edge.reset = function(){
	paper = this.scope;
	var choices = [
		{r:0.5, i:3},
		{r:0.5, i:4},
		{r:1.0, i:8},
		{r:1.5, i:16},
		{r:1.2, i:12},
		{r:2, i:64}
	]
	var choice = choices[ parseInt(Math.random()*choices.length) ];
	this.cp.clear();
	this.resetBoundary(choice.r);
	var index0 = parseInt(Math.random()*this.cp.boundary.edges.length);
	var index1 = index0;
	while(index1 === index0){
		index1 = parseInt(Math.random()*this.cp.boundary.edges.length);
	}
	var creases = this.cp.pleat(choice.i, this.cp.boundary.edges[index0], this.cp.boundary.edges[index1])
	if(creases !== undefined){
		creases.forEach(function(el,i){
			if(i%2==0){ el.valley(); }
			else { el.mountain(); }
		},this);
	}
	this.draw();
	this.edgeHighlightLayer.removeChildren();
	this.edgeHighlightLayer.activate();
	new this.scope.Path({segments: this.cp.boundary.edges[index0].nodes, closed: false, strokeWidth:0.011, strokeColor:this.edgeHighlightColor });
	new this.scope.Path({segments: this.cp.boundary.edges[index1].nodes, closed: false, strokeWidth:0.011, strokeColor:this.edgeHighlightColor });
}
pleat_edge.reset();

pleat_edge.onFrame = function(event){ }
pleat_edge.onResize = function(event){ }
pleat_edge.onMouseDown = function(event){ this.reset(); }
pleat_edge.onMouseUp = function(event){ }
pleat_edge.onMouseMove = function(event){ }
