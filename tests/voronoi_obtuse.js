var voronoiAlgorithm; // global D3 algorithm implementation

var voronoiObtuse = new OrigamiPaper("canvas-voronoi-obtuse").setPadding(0.05).mediumLines();
voronoiObtuse.style.mountain.strokeColor = {gray:0.0};
voronoiObtuse.inputGraph = new PlanarGraph();
voronoiObtuse.vInterp = 0.666;
voronoiObtuse.nodeCircles = [];
voronoiObtuse.topLayer = new voronoiObtuse.scope.Layer()

voronoiObtuse.reset = function(){
	this.inputGraph.clear();
	this.inputGraph.newPlanarNode(0.1, 0.5);
	this.inputGraph.newPlanarNode(0.66, 0.2);
	this.inputGraph.newPlanarNode(0.66, 0.8);
	this.cp.clear();
	this.draw();
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.origin.x, bounds.origin.y],[bounds.size.width, bounds.size.height]];
	voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
}
voronoiObtuse.reset();

voronoiObtuse.redraw = function(){
	paper = this.scope;

	var nodes = this.inputGraph.nodes.map(function(el){return [el.x, el.y];});
	var d3Voronoi = voronoiAlgorithm( nodes );
	var v = new VoronoiGraph(d3Voronoi);

	this.cp.clear();
	creaseVoronoi(this.cp, v, this.vInterp);

	this.draw();

	this.topLayer.activate();
	this.topLayer.removeChildren();

	for(var i = 0; i < nodes.length; i++){
		new this.scope.Shape.Circle({ radius: 0.005, fillColor:this.style.valley.strokeColor, position:nodes[i]});
	}
}

voronoiObtuse.onResize = function(){
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.origin.x, bounds.origin.y],[bounds.size.width, bounds.size.height]];
	voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
}

voronoiObtuse.onMouseDown = function(event){ }
voronoiObtuse.onMouseUp = function(event){ }
voronoiObtuse.onMouseMove = function(event){ }
voronoiObtuse.onFrame = function(event){
	this.inputGraph.nodes[0].x = 0.33 + 0.15*Math.sin(event.time);
	this.redraw();
}
