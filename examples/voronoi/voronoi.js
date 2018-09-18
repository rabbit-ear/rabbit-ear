var slider = new Slider('#interp-slider').on("slide",sliderUpdate);
function sliderUpdate(value){
	var v = parseFloat((value / 1000).toFixed(2));
	if(v < 0.01){ v = 0.01; }
	document.getElementById("interp-value").innerHTML = v;
	interpolation = v;
	project.drawVoronoi();
}
// sliderUpdate(500);

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
	var svgBlob = project.cp.exportSVG();
	download(svgBlob, "creasepattern.svg", "image/svg+xml");
});
document.getElementById("download-sites").addEventListener("click", function(e){
	e.preventDefault();
	var nodeArray = touchNodes.nodes.map(function(node){return [node.x, node.y]});
	var jsonBlob = JSON.stringify(nodeArray);
	download(jsonBlob, "sites.json", "application/json");
});

function fileDidLoad(blob, mimeType, fileExtension){
	var points = JSON.parse(blob);
	console.log(points);
	touchNodes.nodes = [];
	points.forEach(function(point){
		touchNodes.newPlanarNode(point[0], point[1]);
	},this);
	project.drawVoronoi();
}

document.getElementById("sites-checkbox").addEventListener("click", function(e){
	console.log(e);
	// document.getElementById("sites-checkbox").clas = "on";
	// document.getElementById("sites-checkbox").checked = true;
	if(e.target.classList && e.target.classList.contains('active')){
		project.showSites = false;
		e.target.classList.remove('active');
	} else{
		project.showSites = true;
		e.target.classList.add('active');
	}
	project.drawVoronoi();
});

// $().button('toggle')
/////////////////////////////////////////////

var voronoiAlgorithm; // global D3 algorithm implementation

var div = document.getElementsByClassName('canvases')[0];
var project = new OrigamiPaper(div);
// project.style.mountain.strokeColor = {gray:0.0}
// project.mediumLines();
project.showSites = false;

var touchNodes = new PlanarGraph();
var touchNodesCircles = [];

touchNodesLayer = document.createElementNS(svgNS, 'g');
touchNodesLayer.setAttributeNS(null, 'id', 'touch-nodes');
project.svg.appendChild(touchNodesLayer);

for(var i = 0; i < 3; i++){
	touchNodes.newPlanarNode(Math.random()*1, Math.random());
}

var dragOn = false;
var selectedNode = undefined;

var interpolation = 0.5;

project.drawVoronoi = function(complex, showGussets){
	var nodes = touchNodes.nodes.map(function(el){return [el.x, el.y];});
	var d3Voronoi = voronoiAlgorithm( nodes );
	var v = new VoronoiGraph(d3Voronoi);
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	if(showGussets == false){
		creaseVoronoi(this.cp, v, interpolation);
	}
	else if(complex == false){
		creaseVoronoi(this.cp, v, interpolation);
	} else{
		creaseVoronoi(this.cp, v, interpolation);
	}
	if(this.showSites){
		for(var i = 0; i < touchNodes.nodes.length; i++){
			var position = new XY(touchNodes.nodes[i].x, touchNodes.nodes[i].y);
			this.cp.crease(position.add(new XY(-0.01, 0.00)), position.add(new XY(0.01, 0.00)) );
			this.cp.crease(position.add(new XY(0.00, -0.01)), position.add(new XY(0.00, 0.01)) );
		}
	}
	this.draw();

	while(touchNodesLayer.lastChild){ touchNodesLayer.removeChild(touchNodesLayer.lastChild); }

	touchNodesCircles = [];
	for(var i = 0; i < touchNodes.nodes.length; i++){
		var dot = document.createElementNS(svgNS,"circle");
		dot.setAttribute('cx', touchNodes.nodes[i].x);
		dot.setAttribute('cy', touchNodes.nodes[i].y);
		dot.setAttribute('r', 0.0025);
		dot.setAttribute('class', 'touch-node');
		dot.setAttribute('id', 'touch-node-' + i);
		touchNodesLayer.appendChild(dot);
		touchNodesCircles.push(dot);
	}
	return v;
}

project.reset = function(){
	this.cp.clear();
	this.cp.rectangle(1, 1);
	this.draw();
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.origin.x, bounds.origin.y],[bounds.size.width, bounds.size.height]];
	voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );

	while(touchNodesLayer.lastChild){ touchNodesLayer.removeChild(touchNodesLayer.lastChild); }

	this.drawVoronoi();
}
project.reset();

project.onResize = function(){
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.origin.x, bounds.origin.y],[bounds.size.width, bounds.size.height]];
	voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
}

project.onMouseDown = function(event){
	if(selectedNode === undefined){
		if(this.cp.contains(event.point)){ 
			touchNodes.newPlanarNode(event.point.x, event.point.y); 
			this.drawVoronoi();
			selectedNode = undefined;
			for(var i = 0; i < touchNodes.nodes.length; i++){
				if(touchNodesCircles[i] !== undefined){
					var d = touchNodes.nodes[i].distanceTo(event.point);
					if(d < 0.01){ touchNodesCircles[i].setAttribute('r', 0.005); selectedNode = i;}
					else        { touchNodesCircles[i].setAttribute('r', 0.0025); }
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
				if(d < 0.01){ touchNodesCircles[i].setAttribute('r', 0.005); selectedNode = i; }
				else        { touchNodesCircles[i].setAttribute('r', 0.0025); }
			}
		}
	}
}
project.onFrame = function(event){ }
