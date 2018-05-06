///////////////////////////////////////////////

function download(text, filename, mimeType){
	var blob = new Blob([text], {type: mimeType});
	var url = window.URL.createObjectURL(blob);
	var a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
}
document.getElementById("download-file").addEventListener("click", function(e){
	e.preventDefault();
	var scale = 600 / project.cpMin;
	var svgBlob = project.cp.exportSVG(scale);
	download(svgBlob, "creasepattern.svg", "image/svg+xml");
});

/////////////////////////////////////////////

var voronoiAlgorithm; // global D3 algorithm implementation

var project = new OrigamiPaper("canvas-voronoi");
project.setPadding();

var touchNodes = new PlanarGraph();
var touchNodesCircles = [];
var touchNodesLayer

// four kinds of joints
// touchNodes.newPlanarNode(0.599944, 0.149394);
// touchNodes.newPlanarNode(0.653850, 0.806533);
// touchNodes.newPlanarNode(0.481864, 0.539570);
// touchNodes.newPlanarNode(0.196933, 0.259773);
// touchNodes.newPlanarNode(0.261107, 0.760328);

// one overlapping
// touchNodes.newPlanarNode(0.426255, 0.023926);
// touchNodes.newPlanarNode(0.309947, 0.536469);
// touchNodes.newPlanarNode(0.268550, 0.355108);
// touchNodes.newPlanarNode(0.536649, 0.830195);

// two overlapping
// touchNodes.newPlanarNode(0.21748332891029512, 0.03981581339672393);
// touchNodes.newPlanarNode(0.18134616579052865, 0.611234705228031);
// touchNodes.newPlanarNode(0.1022961214660395, 0.3176202548799286);
// touchNodes.newPlanarNode(0.27214622270434996, 0.7228368430205118);
// touchNodes.newPlanarNode(0.6984427919609809, 0.8950778811039989);

// setTimeout(function(){
// 	for(var i = 0; i < 10; i++){
// 		touchNodes.newPlanarNode(Math.random()*1.33, Math.random());
// 	}
// 	project.reset();
// }, 100);

// good one
touchNodes.newPlanarNode(0.4428578875064548, 0.2515515847111665);
touchNodes.newPlanarNode(0.9904930832719806, 0.6247723485875926);
touchNodes.newPlanarNode(0.8598615021873204, 0.6588121242826661);
touchNodes.newPlanarNode(0.7780196712686458, 0.5828161384296111);
touchNodes.newPlanarNode(0.6883833802624785, 0.6354287440201876);
touchNodes.newPlanarNode(0.7448932158968014, 0.49512846244531694);
touchNodes.newPlanarNode(0.6513596948468875, 0.39964632637353);
touchNodes.newPlanarNode(0.38829666689400505, 0.7542942603544531);
touchNodes.newPlanarNode(0.3084034509972037, 0.31780449545485545);
touchNodes.newPlanarNode(0.5656206338844666, 0.22621958942681486);
touchNodes.newPlanarNode(0.34737575143466776, 0.24375712462367372);
touchNodes.newPlanarNode(0.39803974200337106, 0.1424291434862671);
touchNodes.newPlanarNode(0.19343516470668468, 0.3002669602579966);
touchNodes.newPlanarNode(0.6338221596500287, 0.12099437824566185);
touchNodes.newPlanarNode(0.7176126055905765, 0.05669008252384613);
touchNodes.newPlanarNode(1.210612206124497, 0.6315315139764412);
touchNodes.newPlanarNode(0.12718225396299573, 0.5379979929265274);
touchNodes.newPlanarNode(0.1953837797285579, 0.7367567251575942);
touchNodes.newPlanarNode(0.253842230384754, 0.7776776406169316);
touchNodes.newPlanarNode(0.47988157292204564, 0.7971637908356636);

var dragOn = false;
var selectedNode = undefined;

var interpolation = 0.33;

project.drawVoronoi = function(complex, showGussets){
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
	this.updateWeights(0.0025, 0.00125);
	for(var i = 0; i < touchNodes.nodes.length; i++){
		var position = new XY(touchNodes.nodes[i].x, touchNodes.nodes[i].y);
		this.cp.crease(position.add(new XY(-0.01, 0.00)), position.add(new XY(0.01, 0.00)) );
		this.cp.crease(position.add(new XY(0.00, -0.01)), position.add(new XY(0.00, 0.01)) );
	}

	this.draw();
	touchNodesLayer.activate();
	touchNodesLayer.removeChildren();
	touchNodesCircles = [];
	for(var i = 0; i < touchNodes.nodes.length; i++){
		var nodeCircle = new this.scope.Shape.Circle({ radius: 0.0025, fillColor:this.style.valley.strokeColor});
		touchNodesCircles.push(nodeCircle);
		nodeCircle.position = touchNodes.nodes[i];
	}
	return v;
}

project.reset = function(){
	this.cp.clear();
	this.cp.rectangle(1.33, 1);
	this.draw();
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.topLeft.x, bounds.topLeft.y],[bounds.size.width, bounds.size.height]];
	voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );

	if(touchNodesLayer !== undefined){ touchNodesLayer.removeChildren(); }
	touchNodesLayer = new this.scope.Layer();

	this.drawVoronoi();
}
project.reset();

project.onResize = function(){
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.topLeft.x, bounds.topLeft.y],[bounds.size.width, bounds.size.height]];
	voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
}

project.onMouseDown = function(event){
	if(selectedNode === undefined){
		if(this.cp.pointInside(event.point)){ 
			touchNodes.newPlanarNode(event.point.x, event.point.y); 
			this.drawVoronoi();
			selectedNode = undefined;
			for(var i = 0; i < touchNodes.nodes.length; i++){
				if(touchNodesCircles[i] !== undefined){
					var d = touchNodes.nodes[i].distanceTo(event.point);
					if(d < 0.01){ touchNodesCircles[i].radius = 0.005; selectedNode = i;}
					else        { touchNodesCircles[i].radius = 0.0025; }
				}
			}
			dragOn = true;
		}
	} else{
		this.drawVoronoi();
		dragOn = true;
	}
}
project.onMouseUp = function(event){ 
	dragOn = false;
}
project.onMouseMove = function(event) {
	var mouse = event.point;
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
				if(d < 0.01){ touchNodesCircles[i].radius = 0.005; selectedNode = i;}
				else        { touchNodesCircles[i].radius = 0.0025; }
			}
		}
	}
}
project.onFrame = function(event){ }
