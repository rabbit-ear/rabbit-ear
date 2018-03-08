
var voronoiSketch = new OrigamiPaper("canvas-voronoi");
voronoiSketch.updateWeights(0.005, 0.0025);
voronoiSketch.setPadding(0.05);
voronoiSketch.updateWeights(0.005, 0.0025);

var input = new PlanarGraph();
var voronoiAlgorithm; // global D3 algorithm implementation

var vInterpolation = 0.5;

var nodeCircles = [];

var dragOn = false;
var selectedNode = undefined;

voronoiSketch.reset = function(){
	this.cp.clear();
	this.draw();
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.topLeft.x, bounds.topLeft.y],[bounds.size.width, bounds.size.height]];
	voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
}
voronoiSketch.reset();

voronoiSketch.redraw = function(){
	var nodes = input.nodes.map(function(el){return el.values();});
	var d3Voronoi = voronoiAlgorithm( nodes );
	var v = new VoronoiGraph(d3Voronoi);

	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	this.cp.creaseVoronoi(v, vInterpolation);

	this.updateWeights(0.0025, 0.00125);
	this.draw();
	// this.update();

	nodeCircles = [];
	for(var i = 0; i < nodes.length; i++){
		var nodeCircle = new this.scope.Shape.Circle({ radius: 0.0025, fillColor:this.style.valley.strokeColor});
		nodeCircles.push(nodeCircle);
		nodeCircle.position = nodes[i];
	}
}

voronoiSketch.onResize = function(){
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.topLeft.x, bounds.topLeft.y],[bounds.size.width, bounds.size.height]];
	voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
}

voronoiSketch.onMouseDown = function(event){
	if(selectedNode === undefined){
		if(this.cp.pointInside(event.point)){ 
			input.newPlanarNode(event.point.x, event.point.y);
			this.redraw();
			selectedNode = undefined;
			for(var i = 0; i < input.nodes.length; i++){
				if(nodeCircles[i] !== undefined){
					var d = input.nodes[i].distanceTo(event.point);
					if(d < 0.01){ nodeCircles[i].radius = 0.005; selectedNode = i;}
					else        { nodeCircles[i].radius = 0.0025; }
				}
			}
			dragOn = true;
		}
	} else{
		this.redraw();
		dragOn = true;
	}
}
voronoiSketch.onMouseUp = function(event){ 
	dragOn = false;
}
voronoiSketch.onMouseMove = function(event) { 
	var mouse = event.point;
	if(dragOn){
		input.nodes[selectedNode].x = mouse.x;
		input.nodes[selectedNode].y = mouse.y;
		if(!this.cp.contains(mouse.x, mouse.y)){
			dragOn = false;
			input.nodes.splice(selectedNode,1);
		}
		this.redraw();
	} else{
		selectedNode = undefined;
		for(var i = 0; i < input.nodes.length; i++){
			if(nodeCircles[i] !== undefined){
				var d = input.nodes[i].distanceTo(event.point);
				if(d < 0.01){ nodeCircles[i].radius = 0.005; selectedNode = i;}
				else        { nodeCircles[i].radius = 0.0025; }
			}
		}
	}
}
voronoiSketch.onFrame = function(event){ }
