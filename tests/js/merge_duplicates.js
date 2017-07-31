var epsilon_mrg_dup = 0.01;

function mergeDuplicatesSketch(){
	if(epsilon_mrg_dup == undefined){ epsilon_mrg_dup = 0.001; }
	var canvas = document.getElementById('canvas-merge-duplicates');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height, 0.5);

	var cp = new CreasePattern();
	var paperCP = new PaperCreasePattern(scope, cp);
	var nearestEdge = undefined;

	function reset(){
		cp.clear();
		cp.nodes = [];
		cp.edges = [];
		var freq = 12;
		var inc = Math.PI/(12*freq * 2);
		for(var i = 0; i < 1; i+=inc){
			cp.creaseOnly(new XYPoint(i, 0.5 + 0.45*Math.sin(i*freq)), 
			              new XYPoint((i+inc), 0.5 + 0.45*Math.sin((i+inc)*freq)));
			cp.creaseOnly(new XYPoint(i, 0.5 + 0.45*Math.cos(i*freq)), 
			              new XYPoint((i+inc), 0.5 + 0.45*Math.cos((i+inc)*freq)));
		}
		cp.mergeDuplicateVertices(epsilon_mrg_dup);
		paperCP.initialize();
	}

	reset();

	scope.view.onFrame = function(event) { }
	scope.view.onResize = function(event) {
		paper = scope;
		zoomView(scope, canvas.width, canvas.height, 0.5);
	}
	scope.view.onMouseMove = function(event) {
		mousePos = event.point;
		var nEdge = cp.getNearestEdge( mousePos.x, mousePos.y ).edge;
		if(nearestEdge != nEdge){
			nearestEdge = nEdge;
			for(var i = 0; i < cp.edges.length; i++){
				if(nearestEdge != undefined && nearestEdge == i){
					// paperCP.edges[i].strokeWidth = paperCP.lineWeight*2;
					paperCP.edges[i].strokeColor = { hue:0, saturation:0.8, brightness:1 };
				} else{
					// paperCP.edges[i].strokeWidth = paperCP.lineWeight;
					paperCP.edges[i].strokeColor = paperCP.colorForCrease(cp.edges[i].orientation);
				}
			}
			// console.log("Edge: " + nearestEdge);
		}
	}
	scope.view.onMouseDown = function(event){
		paper = scope;		
	}
} mergeDuplicatesSketch();