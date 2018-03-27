var voronoiSketch = new OrigamiPaper("canvas-voronoi");
// var aspect = voronoiSketch.canvas.width / voronoiSketch.canvas.height;
// voronoiSketch.cp.rectangle(aspect, 1.0);

voronoiSketch.updateWeights(0.005, 0.0025);
voronoiSketch.setPadding(0.05);
voronoiSketch.updateWeights(0.005, 0.0025);

voronoiSketch.input = new PlanarGraph();
voronoiSketch.voronoiAlgorithm; // global D3 algorithm implementation
voronoiSketch.vInterpolation = 0.5;
voronoiSketch.nodeCircles = [];

voronoiSketch.dragOn = false;
voronoiSketch.selectedNode = undefined;

voronoiSketch.reset = function(){
	this.cp.clear();
	this.draw();
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.topLeft.x, bounds.topLeft.y],[bounds.size.width, bounds.size.height]];
	this.voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
}
voronoiSketch.reset();

voronoiSketch.redraw = function(){
	var nodes = this.input.nodes.map(function(el){return [el.x, el.y];});
	var d3Voronoi = this.voronoiAlgorithm( nodes );
	var v = new VoronoiGraph(d3Voronoi);
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	this.cp.creaseVoronoi(v, this.vInterpolation);

	this.updateWeights(0.0025, 0.00125);
	this.draw();

	this.nodeCircles = [];
	for(var i = 0; i < nodes.length; i++){
		var nodeCircle = new this.scope.Shape.Circle({ radius: 0.0025, fillColor:this.style.valley.strokeColor});
		this.nodeCircles.push(nodeCircle);
		nodeCircle.position = nodes[i];
	}
}
voronoiSketch.redraw();

voronoiSketch.onResize = function(){
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.topLeft.x, bounds.topLeft.y],[bounds.size.width, bounds.size.height]];
	this.voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
}

voronoiSketch.onMouseDown = function(event){
	if(this.selectedNode === undefined){
		if(this.cp.boundary.contains(event.point)){ 
			this.input.newPlanarNode(event.point.x, event.point.y);
			this.redraw();
			this.selectedNode = undefined;
			for(var i = 0; i < this.input.nodes.length; i++){
				if(this.nodeCircles[i] !== undefined){
					var d = this.input.nodes[i].distanceTo(event.point);
					if(d < 0.01){ this.nodeCircles[i].radius = 0.005; this.selectedNode = i;}
					else        { this.nodeCircles[i].radius = 0.0025; }
				}
			}
			this.dragOn = true;
		}
	} else{
		this.redraw();
		this.dragOn = true;
	}
}
voronoiSketch.onMouseUp = function(event){ 
	this.dragOn = false;
}
voronoiSketch.onMouseMove = function(event) { 
	var mouse = event.point;
	if(this.dragOn){
		this.input.nodes[this.selectedNode].x = mouse.x;
		this.input.nodes[this.selectedNode].y = mouse.y;
		if(!this.cp.contains(mouse.x, mouse.y)){
			this.dragOn = false;
			this.input.nodes.splice(this.selectedNode,1);
		}
		this.redraw();
	} else{
		this.selectedNode = undefined;
		for(var i = 0; i < this.input.nodes.length; i++){
			if(this.nodeCircles[i] !== undefined){
				var d = this.input.nodes[i].distanceTo(event.point);
				if(d < 0.01){ this.nodeCircles[i].radius = 0.005; this.selectedNode = i;}
				else        { this.nodeCircles[i].radius = 0.0025; }
			}
		}
	}
}
voronoiSketch.onFrame = function(event){ }
