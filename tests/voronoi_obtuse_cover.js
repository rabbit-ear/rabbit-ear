var voronoiAlgorithm; // global D3 algorithm implementation

var voronoiObtuseCover = new OrigamiPaper("canvas-voronoi-obtuse-cover").setPadding(0.05).mediumLines();
voronoiObtuseCover.style.mountain.strokeColor = {gray:0.0};
voronoiObtuseCover.inputGraph = new PlanarGraph();
voronoiObtuseCover.vInterp = 0.666;
voronoiObtuseCover.nodeCircles = [];
voronoiObtuseCover.topLayer = new voronoiObtuseCover.scope.Layer()

voronoiObtuseCover.reset = function(){
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
voronoiObtuseCover.reset();

voronoiObtuseCover.redraw = function(){
	paper = this.scope;

	var nodes = this.inputGraph.nodes.map(function(el){return [el.x, el.y];});
	var d3Voronoi = voronoiAlgorithm( nodes );
	var v = new VoronoiGraph(d3Voronoi);

	this.cp.clear();
	var molecules = this.cp.creaseVoronoi(v, this.vInterp);

	this.draw();

	this.topLayer.activate();
	this.topLayer.removeChildren();

	molecules.forEach(function(m){
		if(m.points.length > 2){
			var points = m.hull.edges.map(function(el){return el.nodes[0];});
			var face = new this.scope.Path({segments:points,closed:true});
			face.fillColor = {gray:0.8};
			face.strokeColor = {gray:0.0};
			face.strokeWidth = this.style.mountain.strokeWidth;
		}
	},this);

	this.edgeLayer.activate();

	for(var i = 0; i < nodes.length; i++){
		new this.scope.Shape.Circle({ radius: 0.005, fillColor:this.style.valley.strokeColor, position:nodes[i]});
	}
}

voronoiObtuseCover.onResize = function(){
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.origin.x, bounds.origin.y],[bounds.size.width, bounds.size.height]];
	voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
}

voronoiObtuseCover.onMouseDown = function(event){ }
voronoiObtuseCover.onMouseUp = function(event){ }
voronoiObtuseCover.onMouseMove = function(event){ }
voronoiObtuseCover.onFrame = function(event){
	this.inputGraph.nodes[0].x = 0.33 + 0.15*Math.sin(event.time);
	this.redraw();
}


