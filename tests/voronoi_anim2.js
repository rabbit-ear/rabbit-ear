
var voronoiAnim2 = new OrigamiPaper("canvas-voronoi-animate-2");
voronoiAnim2.setPadding(0.05);
voronoiAnim2.updateWeights(0.0075, 0.005);

var vA1Input = new PlanarGraph();
var voronoiAlgorithm; // global D3 algorithm implementation

vA1Input.newPlanarNode(0.1, 0.5);
vA1Input.newPlanarNode(0.66, 0.2);
vA1Input.newPlanarNode(0.66, 0.8);

voronoiAnim2.topLayer = new voronoiAnim2.scope.Layer();

voronoiAnim2.vInterp = 0.666;

var nodeCircles = [];

var dragOn = false;
var selectedNode = undefined;

voronoiAnim2.reset = function(){
	this.cp.clear();
	this.draw();
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.topLeft.x, bounds.topLeft.y],[bounds.size.width, bounds.size.height]];
	voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
}
voronoiAnim2.reset();

voronoiAnim2.redraw = function(){
	var nodes = vA1Input.nodes.map(function(el){return [el.x, el.y];});
	var d3Voronoi = voronoiAlgorithm( nodes );
	var v = new VoronoiGraph(d3Voronoi);

	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
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


	nodeCircles = [];
	for(var i = 0; i < nodes.length; i++){
		var nodeCircle = new this.scope.Shape.Circle({ radius: 0.0025, fillColor:this.style.valley.strokeColor});
		nodeCircles.push(nodeCircle);
		nodeCircle.position = nodes[i];
	}
}

voronoiAnim2.onResize = function(){
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.topLeft.x, bounds.topLeft.y],[bounds.size.width, bounds.size.height]];
	voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
}

voronoiAnim2.onMouseDown = function(event){
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
voronoiAnim2.onMouseUp = function(event){ 
	dragOn = false;
}
voronoiAnim2.onMouseMove = function(event) { 
	var mouse = event.point;
	if(dragOn){
		vA1Input.nodes[selectedNode].x = mouse.x;
		vA1Input.nodes[selectedNode].y = mouse.y;
		if(!this.cp.boundary.contains(mouse.x, mouse.y)){
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
voronoiAnim2.onFrame = function(event){
	paper = this.scope;
	vA1Input.nodes[0].x = 0.33 + 0.15*Math.sin(event.time);
	this.redraw();
}
