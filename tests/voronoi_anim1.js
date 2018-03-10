
var voronoiAnim1 = new OrigamiPaper("canvas-voronoi-animate-1");
voronoiAnim1.setPadding(0.05);
voronoiAnim1.updateWeights(0.0075, 0.005);

var vA1Input = new PlanarGraph();
var voronoiAlgorithm; // global D3 algorithm implementation

vA1Input.newPlanarNode(0.1, 0.5);
vA1Input.newPlanarNode(0.66, 0.2);
vA1Input.newPlanarNode(0.66, 0.8);

voronoiAnim1.vInterp = 0.666;

var nodeCircles = [];

var dragOn = false;
var selectedNode = undefined;

voronoiAnim1.reset = function(){
	this.cp.clear();
	this.draw();
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.topLeft.x, bounds.topLeft.y],[bounds.size.width, bounds.size.height]];
	voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
}
voronoiAnim1.reset();

voronoiAnim1.redraw = function(){
	var nodes = vA1Input.nodes.map(function(el){return el.values();});
	var d3Voronoi = voronoiAlgorithm( nodes );
	var v = new VoronoiGraph(d3Voronoi);

	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	this.cp.creaseVoronoi(v, this.vInterp);

	this.draw();

	nodeCircles = [];
	for(var i = 0; i < nodes.length; i++){
		var nodeCircle = new this.scope.Shape.Circle({ radius: 0.0025, fillColor:this.style.valley.strokeColor});
		nodeCircles.push(nodeCircle);
		nodeCircle.position = nodes[i];
	}
}

voronoiAnim1.onResize = function(){
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.topLeft.x, bounds.topLeft.y],[bounds.size.width, bounds.size.height]];
	voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
}

voronoiAnim1.onMouseDown = function(event){
	if(selectedNode === undefined){
		if(this.cp.pointInside(event.point)){ 
			vA1Input.newPlanarNode(event.point.x, event.point.y);
			this.redraw();
			selectedNode = undefined;
			for(var i = 0; i < vA1Input.nodes.length; i++){
				if(nodeCircles[i] !== undefined){
					var d = vA1Input.nodes[i].distanceTo(event.point);
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
voronoiAnim1.onMouseUp = function(event){ 
	dragOn = false;
}
voronoiAnim1.onMouseMove = function(event) { 
	var mouse = event.point;
	if(dragOn){
		vA1Input.nodes[selectedNode].x = mouse.x;
		vA1Input.nodes[selectedNode].y = mouse.y;
		if(!this.cp.contains(mouse.x, mouse.y)){
			dragOn = false;
			vA1Input.nodes.splice(selectedNode,1);
		}
		this.redraw();
	} else{
		selectedNode = undefined;
		for(var i = 0; i < vA1Input.nodes.length; i++){
			if(nodeCircles[i] !== undefined){
				var d = vA1Input.nodes[i].distanceTo(event.point);
				if(d < 0.01){ nodeCircles[i].radius = 0.005; selectedNode = i;}
				else        { nodeCircles[i].radius = 0.0025; }
			}
		}
	}
}
voronoiAnim1.onFrame = function(event){
	paper = this.scope;
	vA1Input.nodes[0].x = 0.33 + 0.15*Math.sin(event.time);
	this.redraw();
}
