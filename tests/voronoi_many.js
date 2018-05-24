
var voronoiMany = new OrigamiPaper("canvas-voronoi-many").setPadding(0.001).mediumLines();
var aspect = voronoiMany.canvas.width / voronoiMany.canvas.height;
voronoiMany.cp.rectangle(aspect, 1.0);
voronoiMany.voronoiAlgorithm; // global D3 algorithm implementation
voronoiMany.input = new PlanarGraph();
voronoiMany.topLayer = new voronoiMany.scope.Layer()
voronoiMany.style.mountain.strokeColor = { gray:0.0 }
voronoiMany.style.mountain.strokeWidth = voronoiMany.style.valley.strokeWidth*1.3

voronoiMany.vInterpolation = 0.5;
voronoiMany.selectRadius = 0.05;

voronoiMany.reset = function(){
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
voronoiMany.reset();

voronoiMany.drawSites = function(){
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


voronoiMany.fillWithPoints = function(){
	var bounds = this.cp.bounds();
	for(var i = 0; i < 30; i++){
		var randX = Math.random() * bounds.size.width;
		var randY = Math.random() * bounds.size.height;
		voronoiMany.input.newPlanarNode(randX, randY);
	}
}
voronoiMany.fillWithPoints();

voronoiMany.redraw = function(){
	paper = this.scope;

	var nodes = this.input.nodes.map(function(el){return [el.x, el.y];});
	var d3Voronoi = this.voronoiAlgorithm( nodes );
	var v = new VoronoiGraph(d3Voronoi);

	this.cp.clear();
	this.cp.creaseVoronoi(v, this.vInterpolation);
	this.draw();
	this.drawSites();
}
voronoiMany.redraw();

voronoiMany.onResize = function(){
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.origin.x, bounds.origin.y],[bounds.size.width, bounds.size.height]];
	this.voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
}
voronoiMany.onMouseDown = function(event){
	if(this.nearestNode == undefined && this.cp.boundary.contains(event.point)){ 
		this.nearestNode = this.input.newPlanarNode(event.point.x, event.point.y);
		this.redraw();
	}
}
voronoiMany.onMouseUp = function(event){ 
	this.dragOn = false;
}
voronoiMany.onMouseMove = function(event){
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
voronoiMany.onFrame = function(event){ }
