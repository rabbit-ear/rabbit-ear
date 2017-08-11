// generate faces

var radial_rainbow_callback = undefined;

function radial_rainbow(){
	var canvas = document.getElementById('canvas-radial-rainbow');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height);

	var cp = new CreasePattern();
	cp.nodes = [];
	cp.edges = [];

	var paperCP = new PaperCreasePattern(scope, cp);

	var nearestEdge = undefined;
	var nearestNode = undefined;
	var planarAdjacent = undefined;

	function colorForAngle(angle){
		var color = angle / Math.PI * 180;
		while(color < 0){color += 360;}
		return {hue:color, saturation:1.0, brightness:0.9};
	}

	function resetCP(){
		cp.clear();
		cp.nodes = [];
		cp.edges = [];
		var angle = 0;
		while(angle < Math.PI*2){
			cp.creaseRay(new XYPoint(0.5, 0.5), new XYPoint(Math.cos(angle), Math.sin(angle)));
			angle+= Math.random()*0.2;
		}
		cp.cleanDuplicateNodes();
		paperCP.initialize();

		planarAdjacent = cp.nodes[0].planarAdjacent();
		for(var i = 0; i < planarAdjacent.length; i++){
			var edgeIndex = planarAdjacent[i].edge.index;
			paperCP.edges[edgeIndex].strokeColor = {gray:0.0};
		}
	}
	resetCP();

	scope.view.onFrame = function(event){ }
	scope.view.onResize = function(event){
		paper = scope;
		zoomView(scope, canvas.width, canvas.height);
	}
	scope.view.onMouseMove = function(event){ 
		mousePos = event.point;
		var nEdge = cp.getNearestEdge( mousePos.x, mousePos.y ).edge;
		if(nearestEdge !== nEdge){
			nearestEdge = nEdge;
			for(var i = 0; i < planarAdjacent.length; i++){
				var edgeIndex = planarAdjacent[i].edge.index;
				if(planarAdjacent[i].edge === nearestEdge){
					paperCP.edges[edgeIndex].strokeColor = colorForAngle(planarAdjacent[i].angle);
					paperCP.edges[edgeIndex].strokeWidth = 0.02;//paperCP.lineWeight*1.5;
					paperCP.edges[edgeIndex].bringToFront();
					if(radial_rainbow_callback != undefined){
						radial_rainbow_callback(planarAdjacent[i]);
					}
				}
				else{
					paperCP.edges[edgeIndex].strokeColor = {gray:0.0};
					paperCP.edges[edgeIndex].strokeWidth = 0.01*0.66666;//paperCP.lineWeight*0.66666;
				}
			}
		}
	}

	scope.view.onMouseDown = function(event){
		paper = scope;
		resetCP();
	}

} radial_rainbow();