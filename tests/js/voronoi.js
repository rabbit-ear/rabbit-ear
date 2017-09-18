
var voronoiSketch = new OrigamiPaper("canvas-voronoi");
voronoiSketch.updateWeights(0.005, 0.0025);
voronoiSketch.zoomToFit(0.05);
voronoiSketch.updateWeights(0.005, 0.0025);

var input = new PlanarGraph();
var voronoiAlgorithm; // global D3 algorithm implementation

var vInterpolation = 0.5;

var nodeCircles = [];

var dragOn = false;
var selectedNode = undefined;

voronoiSketch.reset = function(){
	this.cp.clear();
	this.init();
	voronoiAlgorithm = d3.voronoi().extent( this.cp.boundingBox_array() );
}
voronoiSketch.reset();

voronoiSketch.redraw = function(){
	var nodes = input.nodes.map(function(el){return el.values();});
	var v = voronoiAlgorithm( nodes );
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	this.cp.voronoi(v, vInterpolation);

	this.updateWeights(0.0025, 0.00125);
	this.init();
	// this.update();

	nodeCircles = [];
	for(var i = 0; i < nodes.length; i++){
		var nodeCircle = new this.scope.Shape.Circle({ radius: 0.0025, fillColor:this.style.valley.strokeColor});
		nodeCircles.push(nodeCircle);
		nodeCircle.position = nodes[i];
	}
}

voronoiSketch.onResize = function(){
	voronoiAlgorithm = d3.voronoi().extent( this.cp.boundingBox_array() );
}

voronoiSketch.onMouseDown = function(event){
	if(selectedNode === undefined){
		if(this.cp.pointInside(event.point)){ input.newPlanarNode(event.point.x, event.point.y); }
	} else{
		dragOn = true;
	}
	this.redraw();
}
voronoiSketch.onMouseUp = function(event){ 
	dragOn = false;
}
voronoiSketch.onMouseMove = function(event) { 
	var mouse = event.point;
	if(dragOn){
		input.nodes[selectedNode].x = mouse.x;
		input.nodes[selectedNode].y = mouse.y;
		// var nodeCircle = nodeCircles[selectedNode];
		// if(nodeCircle !== undefined){
		// 	nodeCircle.position = event.point;
		// }
		this.redraw();
	} else{
		selectedNode = undefined;
		for(var i = 0; i < input.nodes.length; i++){
			if(nodeCircles[i] !== undefined){
				var d = input.nodes[i].distance(event.point);
				if(d < 0.01){ nodeCircles[i].radius = 0.005; selectedNode = i;}
				else        { nodeCircles[i].radius = 0.0025; }
			}
		}
	}
}
voronoiSketch.onFrame = function(event){ }
