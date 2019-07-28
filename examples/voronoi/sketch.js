var svgNS = 'http://www.w3.org/2000/svg';

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
	// var nodeArray = touchNodes.map(function(node){return [node.x, node.y]});
	var jsonBlob = JSON.stringify(touchNodes);
	download(jsonBlob, "sites.json", "application/json");
});

function fileDidLoad(blob, mimeType, fileExtension){
	var points = JSON.parse(blob);
	console.log(points);
	touchNodes = [];
	points.forEach(function(point){
		touchNodes.push( [point[0], point[1]] );
		// touchNodes.newPlanarNode(point[0], point[1]);
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

var div = document.getElementsByClassName('canvases')[0];
var project = new OrigamiPaper(div);
// project.style.mountain.strokeColor = {gray:0.0}
// project.mediumLines();
project.showSites = false;

// var touchNodes = new PlanarGraph();
var touchNodesCircles = [];
var touchNodes = []

touchNodesLayer = document.createElementNS(svgNS, 'g');
touchNodesLayer.setAttributeNS(null, 'id', 'touch-nodes');
project.svg.appendChild(touchNodesLayer);

for(var i = 0; i < 6; i++){
	touchNodes.push( [Math.random(), Math.random()*0.8] );
}

var dragOn = false;
var selectedNode = undefined;

var interpolation = 0.5;

project.drawVoronoi = function(complex, showGussets){
	
	// var v = new RabbitEar.VoronoiGraph(touchNodes, this.cp.bounds());
	var v = new RabbitEar.VoronoiGraph(touchNodes, {origin:{x:0, y:0}, size:{width:1, height:0.8}});
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	if(showGussets == false){
		RabbitEar.creaseVoronoi(this.cp, v, interpolation);
	}
	else if(complex == false){
		RabbitEar.creaseVoronoi(this.cp, v, interpolation);
	} else{
		RabbitEar.creaseVoronoi(this.cp, v, interpolation);
	}
	if(this.showSites){
		for(var i = 0; i < touchNodes.length; i++){
			var x = touchNodes[i][0];
			var y = touchNodes[i][1];
			this.cp.crease(x-0.01, y+0.00, x+0.01, y+0.00);
			this.cp.crease(x+0.00, y-0.01, x+0.00, y+0.01);
		}
	}
	this.draw();

	while(touchNodesLayer.lastChild){ touchNodesLayer.removeChild(touchNodesLayer.lastChild); }

	touchNodesCircles = [];
	for(var i = 0; i < touchNodes.length; i++){
		var dot = document.createElementNS(svgNS,"circle");
		dot.setAttribute('cx', touchNodes[i][0]);
		dot.setAttribute('cy', touchNodes[i][1]);
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
	this.cp.rectangle(1, 0.8);
	this.draw();
	var bounds = {origin:{x:0, y:0}, size:{width:1, height:0.8}};//this.cp.bounds();
	while(touchNodesLayer.lastChild){ touchNodesLayer.removeChild(touchNodesLayer.lastChild); }
	this.drawVoronoi();
}
project.reset();

project.onResize = function(){
	var bounds = {origin:{x:0, y:0}, size:{width:1, height:0.8}};//this.cp.bounds();
}

project.onMouseDown = function(event){
	if(selectedNode === undefined){
		if(this.cp.contains(event.point)){
			touchNodes.push( [event.point.x, event.point.y] );
//			touchNodes.newPlanarNode(event.point.x, event.point.y); 
			this.drawVoronoi();
			selectedNode = undefined;
			for(var i = 0; i < touchNodes.length; i++){
				if(touchNodesCircles[i] !== undefined){
					var d = Math.sqrt(Math.pow(touchNodes[i][0]-event.point.x, 2)+Math.pow(touchNodes[i][1]-event.point.y, 2));
					// var d = touchNodes[i].distanceTo(event.point);
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
		touchNodes[selectedNode][0] = mouse.x;
		touchNodes[selectedNode][1] = mouse.y;
		if(!this.cp.contains(mouse.x, mouse.y)){
			dragOn = false;
			touchNodes.splice(selectedNode,1);
		}
		this.drawVoronoi();
	} else{
		selectedNode = undefined;
		for(var i = 0; i < touchNodes.length; i++){
			if(touchNodesCircles[i] !== undefined){
				// var d = touchNodes[i].distanceTo(event.point);
				var d = Math.sqrt(Math.pow(touchNodes[i][0]-event.point.x, 2)+Math.pow(touchNodes[i][1]-event.point.y, 2));
				if(d < 0.01){ touchNodesCircles[i].setAttribute('r', 0.005); selectedNode = i; }
				else        { touchNodesCircles[i].setAttribute('r', 0.0025); }
			}
		}
	}
}
project.onFrame = function(event){ }
