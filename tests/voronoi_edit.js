
var voronoiEditor = new OrigamiPaper("canvas-voronoi-edit");
voronoiEditor.setPadding();

var inputEditor = new PlanarGraph();
var voronoiAlgorithm; // global D3 algorithm implementation

var vInterpolation = 0.5;

var nodeCircles = [];

var dragOn = false;
var selectedNode = undefined;

var simpleVoronoi = false;


voronoiEditor.redraw = function(){
	paper = this.scope;
	var nodes = inputEditor.nodes.map(function(el){return [el.x, el.y];});
	var d3Voronoi = voronoiAlgorithm( nodes );
	var v = new VoronoiGraph(d3Voronoi);	

	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	this.cp.creaseVoronoi(v, vInterpolation);

	if(simpleVoronoi === true){
		for(var i = this.cp.edges.length-1; i >= 0; i--){
			// if(this.cp.edges[i].orientation !== CreaseDirection.valley){
			if(this.cp.edges[i].orientation === CreaseDirection.mark || 
			   this.cp.edges[i].orientation === CreaseDirection.mountain){
				this.cp.removeEdge(this.cp.edges[i]);
			}
		}
	}

	this.draw();

	nodeCircles = [];
	for(var i = 0; i < nodes.length; i++){
		var nodeCircle = new this.scope.Shape.Circle({ radius: 0.0025, fillColor:this.style.valley.strokeColor});
		nodeCircles.push(nodeCircle);
		nodeCircle.position = nodes[i];
	}
}

var numdots = Math.PI*20;

voronoiEditor.reset = function(){
	paper = this.scope;
	this.cp.clear();
	// this.cp.rectangle(1.333333,1);
	this.draw();
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.origin.x, bounds.origin.y],[bounds.size.width, bounds.size.height]];
	voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );

	// add to voronoi
	// for(var i = -10; i < numdots+10; i++){
	// 	var freq = Math.PI*2 * (i/numdots)  * 0.5;  //0.5
	// 	var freq2 = Math.PI*2 * (i/numdots) * 3;  //4
	// 	var x = (i/numdots) + Math.cos(freq2)*0.2;
	// 	var y = map(Math.cos(freq), -1, 1, .1, .9) + Math.sin(freq2)*0.2;
	// 	if(x <= 1 && x >= 0 && y >= 0 && y <= 1){
	// 		inputEditor.newPlanarNode(x, y);
	// 	}
	// }

	// for(var i = 0; i < numdots+30; i++){
	// 	var freq = Math.PI*2 * (i/numdots * .5);  //0.5
	// 	var freq2 = Math.PI*2 * (i/numdots * Math.PI);  //4
	// 	var x = (i/numdots) + Math.cos(freq2)*0.1;
	// 	var y = map(Math.cos(freq), -1, 1, .1, .9) + Math.sin(freq2)*0.1;
	// 	if(x <= 1 && x >= 0 && y >= 0 && y <= 1){
	// 		inputEditor.newPlanarNode(x, y);
	// 	}
	// }
	this.redraw();
}
voronoiEditor.reset();

voronoiEditor.onResize = function(){
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.origin.x, bounds.origin.y],[bounds.size.width, bounds.size.height]];
	voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
}

voronoiEditor.onMouseDown = function(event){
	// mouse change
	// numdots = Math.floor(event.point.x * 10 + 1);
	// console.log(numdots);
	// this.reset();

	if(selectedNode === undefined){
		if(this.cp.pointInside(event.point)){ 
			inputEditor.newPlanarNode(event.point.x, event.point.y); 
			this.redraw();
			selectedNode = undefined;
			for(var i = 0; i < inputEditor.nodes.length; i++){
				if(nodeCircles[i] !== undefined){
					var d = inputEditor.nodes[i].distanceTo(event.point);
					if(d < 0.01){ nodeCircles[i].radius = 0.005; selectedNode = i;}
					else        { nodeCircles[i].radius = 0.0025; }
				}
			}
			dragOn = true;
		}
	} else{
		dragOn = true;
		this.redraw();
	}
}
voronoiEditor.onMouseUp = function(event){ 
	dragOn = false;
}
voronoiEditor.onMouseMove = function(event) {


	var mouse = event.point;
	if(dragOn){
		inputEditor.nodes[selectedNode].x = mouse.x;
		inputEditor.nodes[selectedNode].y = mouse.y;
		// var nodeCircle = nodeCircles[selectedNode];
		// if(nodeCircle !== undefined){
		// 	nodeCircle.position = event.point;
		// }
		if(!this.cp.boundary.contains(mouse.x, mouse.y)){
			dragOn = false;
			inputEditor.nodes.splice(selectedNode,1);
		}
		this.redraw();
	} else{
		selectedNode = undefined;
		for(var i = 0; i < inputEditor.nodes.length; i++){
			if(nodeCircles[i] !== undefined){
				var d = inputEditor.nodes[i].distanceTo(event.point);
				if(d < 0.01){ nodeCircles[i].radius = 0.005; selectedNode = i;}
				else        { nodeCircles[i].radius = 0.0025; }
			}
		}
	}
}
voronoiEditor.onFrame = function(event){ }
