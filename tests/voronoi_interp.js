var voronoiInterpCallback = undefined;

var voronoiInterp = new OrigamiPaper("canvas-voronoi-interpolate");
voronoiInterp.setPadding(0.05);

// keep track of voronoi nodes in a separate graph
var input = new PlanarGraph();
var voronoiAlgorithm; // global D3 algorithm implementation

var vInterpolation = 0.5;

voronoiInterp.reset = function(){
	this.cp.clear();
	this.draw();
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.topLeft.x, bounds.topLeft.y],[bounds.size.width, bounds.size.height]];
	voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
	for(var i = 0; i < 4; i++){
		var x = map(Math.random(), 0, 1, 0.1, 0.9);
		var y = map(Math.random(), 0, 1, 0.1, 0.9);
		input.newPlanarNode(x, y);
	}
}
voronoiInterp.reset();

voronoiInterp.redraw = function(){

	var nodes = input.nodes.map(function(el){return [el.x, el.y];});
	var d3Voronoi = voronoiAlgorithm( nodes );
	var v = new VoronoiGraph(d3Voronoi);

	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	this.cp.creaseVoronoi(v, vInterpolation);
	this.updateWeights(0.005, 0.0025);
	this.draw();

	for(var i = 0; i < nodes.length; i++){
		var nodeCircle = new this.scope.Shape.Circle({ radius: 0.01, fillColor:this.style.valley.strokeColor});
		nodeCircle.position = nodes[i];
	}
}

voronoiInterp.onResize = function(){
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.topLeft.x, bounds.topLeft.y],[bounds.size.width, bounds.size.height]];
	voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
}

voronoiInterp.onMouseDown = function(event){
	if(this.cp.pointInside(event.point)){ input.newPlanarNode(event.point.x, event.point.y); }
	if(input.nodes.length < 2) return;
	this.redraw();
}
voronoiInterp.onMouseUp = function(event){ }
voronoiInterp.onMouseMove = function(event) { }
voronoiInterp.onFrame = function(event){
	vInterpolation = map( Math.sin(event.time*0.75), -1, 1, 0.4, 0.8 );
	if(voronoiInterpCallback !== undefined){
		voronoiInterpCallback(vInterpolation);
	}
	this.redraw();
}
