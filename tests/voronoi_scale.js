var voronoiScaleCallback = undefined;

var voronoiScale = new OrigamiPaper("canvas-voronoi-scale").mediumLines();
voronoiScale.voronoiAlgorithm; // global D3 algorithm implementation
voronoiScale.input = new PlanarGraph();
voronoiScale.vInterpolation = 0.5;

voronoiScale.reset = function(){
	this.input.clear();
	this.cp.clear();
	this.draw();

	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.origin.x, bounds.origin.y],[bounds.size.width, bounds.size.height]];
	this.voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
	
	for(var i = 0; i < 4; i++){
		this.input.newPlanarNode(Math.random()*0.8+0.1, Math.random()*0.8+0.1);
	}
}
voronoiScale.reset();

voronoiScale.redraw = function(){
	paper = this.scope;

	var nodes = this.input.nodes.map(function(el){return [el.x, el.y];});
	var d3Voronoi = this.voronoiAlgorithm( nodes );
	var v = new VoronoiGraph(d3Voronoi);

	this.cp.clear();
	this.cp.creaseVoronoi(v, this.vInterpolation);
	this.draw();

	for(var i = 0; i < nodes.length; i++){
		new this.scope.Shape.Circle({ radius: 0.005, fillColor:this.style.valley.strokeColor, position:nodes[i]});
	}
}

voronoiScale.onResize = function(){
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.origin.x, bounds.origin.y],[bounds.size.width, bounds.size.height]];
	this.voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
}

voronoiScale.onMouseDown = function(event){
	if(this.cp.boundary.contains(event.point)){
		this.input.newPlanarNode(event.point.x, event.point.y);
	}
	if(this.input.nodes.length < 2) return;
	this.redraw();
}
voronoiScale.onMouseUp = function(event){ }
voronoiScale.onMouseMove = function(event) { }
voronoiScale.onFrame = function(event){
	// between 0.4, 0.8
	this.vInterpolation = (Math.sin(event.time*0.75)+1)*0.5 * 0.4+0.4
	if(voronoiScaleCallback !== undefined){
		voronoiScaleCallback(this.vInterpolation);
	}
	this.redraw();
}
