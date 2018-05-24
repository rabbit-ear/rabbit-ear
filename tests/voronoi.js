var voronoiSketch = new OrigamiPaper("canvas-voronoi").setPadding(0.005).mediumLines();
var aspect = voronoiSketch.canvas.width / voronoiSketch.canvas.height;
voronoiSketch.cp.rectangle(aspect, 1.0);
voronoiSketch.voronoiAlgorithm; // global D3 algorithm implementation
voronoiSketch.input = new PlanarGraph();
voronoiSketch.topLayer = new voronoiSketch.scope.Layer()

voronoiSketch.vInterpolation = 0.5;
voronoiSketch.selectRadius = 0.05;

voronoiSketch.reset = function(){
	this.input.clear();
	this.input.newPlanarNode(Math.random(), Math.random());
	this.input.newPlanarNode(Math.random(), Math.random());
	this.input.newPlanarNode(Math.random(), Math.random());
	this.cp.clear();
	this.draw();
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.origin.x, bounds.origin.y],[bounds.size.width, bounds.size.height]];
	this.voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
}
voronoiSketch.reset();

voronoiSketch.drawSites = function(){
	this.topLayer.activate();
	this.topLayer.removeChildren();
	this.input.nodes.forEach(function(node){
		new this.scope.Shape.Circle({
			radius: (this.nearestNode === node) ? 0.005 : 0.0025,
			fillColor:this.style.valley.strokeColor,
			position:{x:node.x,y:node.y}
		});
	},this);
}

voronoiSketch.redraw = function(){
	paper = this.scope;

	var nodes = this.input.nodes.map(function(el){return [el.x, el.y];});
	var d3Voronoi = this.voronoiAlgorithm( nodes );
	var v = new VoronoiGraph(d3Voronoi);

	this.cp.clear();
	this.cp.creaseVoronoi(v, this.vInterpolation);
	this.draw();
	this.drawSites();
}
voronoiSketch.redraw();

voronoiSketch.onResize = function(){
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.origin.x, bounds.origin.y],[bounds.size.width, bounds.size.height]];
	this.voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
}
voronoiSketch.onMouseDown = function(event){
	if(this.nearestNode == undefined && this.cp.boundary.contains(event.point)){ 
		this.nearestNode = this.input.newPlanarNode(event.point.x, event.point.y);
		this.redraw();
	}
}
voronoiSketch.onMouseUp = function(event){ 
	this.dragOn = false;
}
voronoiSketch.onMouseMove = function(event){
	if(this.mouse.isPressed){
		this.nearestNode.x = event.point.x;
		this.nearestNode.y = event.point.y;
		this.redraw();
	} else{
		this.nearestNode = this.input.nearestNodes(1, event.point).shift();
		if(this.nearestNode != undefined && Math.sqrt(Math.pow(this.nearestNode.x-event.point.x,2) + Math.pow(this.nearestNode.y-event.point.y,2)) > this.selectRadius){
			this.nearestNode = undefined;
		}
	}
	this.drawSites();
}
voronoiSketch.onFrame = function(event){ }
