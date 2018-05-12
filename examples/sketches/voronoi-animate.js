var voronoiAlgorithm; // global D3 algorithm implementation

var voronoiAnim = new OrigamiPaper("canvas");
voronoiAnim.setPadding();
voronoiAnim.thinLines();

var touchNodes = new PlanarGraph();
var touchNodesCircles = [];
var touchNodesLayer

var TOTAL = 6;

for(var i = 0; i < TOTAL; i++){
	touchNodes.newPlanarNode(Math.random(), Math.random());
}


var dragOn = false;
var selectedNode = undefined;

var interpolation = 0.5;

// voronoiAnim.style.mountain.strokeColor = {hue:0.53*360, saturation:0.82, brightness:0.28 };
// voronoiAnim.style.valley.strokeColor = {hue:0.53*360, saturation:0.82, brightness:0.28 };

voronoiAnim.style.mountain.strokeColor = {gray:0.0};
voronoiAnim.style.valley.strokeColor = {gray:0.0};

voronoiAnim.drawVoronoi = function(complex, showGussets){
	var nodes = touchNodes.nodes.map(function(el){return [el.x, el.y];});
	var d3Voronoi = voronoiAlgorithm( nodes );
	var v = new VoronoiGraph(d3Voronoi);
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	if(showGussets == false){
		this.cp.creaseVoronoi(v, interpolation);
	}
	else if(complex == false){
		this.cp.creaseVoronoi(v, interpolation);
	} else{
		this.cp.creaseVoronoi(v, interpolation);
	}

	this.draw();
	touchNodesLayer.activate();
	touchNodesLayer.removeChildren();
	touchNodesCircles = [];
	for(var i = 0; i < touchNodes.nodes.length; i++){
		var nodeCircle = new this.scope.Shape.Circle({ radius: 0.005, fillColor:{gray:0.0}});
		touchNodesCircles.push(nodeCircle);
		nodeCircle.position = touchNodes.nodes[i];
	}
	return v;
}

voronoiAnim.reset = function(){
	this.cp.clear();
	// this.cp.rectangle(1, 1);
	this.draw();
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.origin.x, bounds.origin.y],[bounds.size.width, bounds.size.height]];
	voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );

	if(touchNodesLayer !== undefined){ touchNodesLayer.removeChildren(); }
	touchNodesLayer = new this.scope.Layer();

	this.drawVoronoi();
}
voronoiAnim.reset();

voronoiAnim.onResize = function(){
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.origin.x, bounds.origin.y],[bounds.size.width, bounds.size.height]];
	voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
}

voronoiAnim.onMouseDown = function(event){
	if(selectedNode === undefined){
		if(this.cp.pointInside(event.point)){ 
			touchNodes.newPlanarNode(event.point.x, event.point.y); 
			this.drawVoronoi();
			selectedNode = undefined;
			for(var i = 0; i < touchNodes.nodes.length; i++){
				if(touchNodesCircles[i] !== undefined){
					var d = touchNodes.nodes[i].distanceTo(event.point);
					if(d < 0.01){ touchNodesCircles[i].radius = 0.01; selectedNode = i;}
					else        { touchNodesCircles[i].radius = 0.005; }
				}
			}
			dragOn = true;
		}
	} else{
		this.drawVoronoi();
		dragOn = true;
	}
}
voronoiAnim.onMouseUp = function(event){ 
	dragOn = false;
}

var mag = 1.0;

voronoiAnim.onMouseMove = function(event) {
	var mouse = event.point;
	mag = mouse.y/2;
	if(dragOn){
		touchNodes.nodes[selectedNode].x = mouse.x;
		touchNodes.nodes[selectedNode].y = mouse.y;
		if(!this.cp.contains(mouse.x, mouse.y)){
			dragOn = false;
			touchNodes.nodes.splice(selectedNode,1);
		}
		this.drawVoronoi();
	} else{
		selectedNode = undefined;
		for(var i = 0; i < touchNodes.nodes.length; i++){
			if(touchNodesCircles[i] !== undefined){
				var d = touchNodes.nodes[i].distanceTo(event.point);
				if(d < 0.01){ touchNodesCircles[i].radius = 0.01; selectedNode = i;}
				else        { touchNodesCircles[i].radius = 0.005; }
			}
		}
	}
}

var amp = [];
var freqX = [];
var freqY = [];
var offset = [];
for(var i = 0; i < TOTAL; i++){
	amp[i] = Math.random()*0.5;
	freqX[i] = Math.random()*0.4-0.2;
	freqY[i] = Math.random()*0.4-0.2;
	offset[i] = Math.random()*6;
	console.log(freqX[i], freqY[i]);
}

var elapsedTime = 0;
voronoiAnim.onFrame = function(event){
	elapsedTime += 1 * mag;
	for(var i = 0; i < TOTAL; i++){
		touchNodes.nodes[i].x = 0.5+Math.cos(freqX[i]*elapsedTime+offset[i])*amp[i];
		touchNodes.nodes[i].y = 0.5+Math.sin(freqY[i]*elapsedTime+offset[i])*amp[i];
	}
	this.drawVoronoi();
}
