// generate faces

var radial_rainbow_callback = undefined;

function radial_rainbow(){
	var canvas = document.getElementById('canvas-radial-rainbow');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height, 0.5);

	var cp = new CreasePattern();
	cp.nodes = [];
	cp.edges = [];

	var paperCP = new PaperCreasePattern(scope, cp);

	var nearestEdge = undefined;
	var nearestNode = undefined;
	var planarAdjacent = undefined;
	// var mouseNodeLayer = new paper.Layer();
	// mouseNodeLayer.activate();
	// mouseNodeLayer.removeChildren();
	// var nodeCircle = new paper.Shape.Circle({
	// 	center: [0, 0],
	// 	radius: 0.02,
	// 	fillColor: { hue:0, saturation:0.8, brightness:1 }//{ hue:130, saturation:0.8, brightness:0.7 }
	// });

	function colorForAngle(angle){
		var brightness = angle;
		if(angle < 0) brightness = angle + Math.PI*2;
		return (brightness / (2*Math.PI) * 0.75);
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
		cp.mergeDuplicateVertices();
		paperCP.initialize();

		planarAdjacent = cp.nodes[0].planarAdjacent();
		for(var i = 0; i < planarAdjacent.length; i++){
			var edgeIndex = planarAdjacent[i].edge.index;
			// var angleDegrees = planarAdjacent[i].angle * 180 / Math.PI;
			// if(angleDegrees < 0) angleDegrees += 360;
			// paperCP.edges[edgeIndex].strokeColor = { hue:angleDegrees, saturation:0.8, brightness:1.0 };
			paperCP.edges[edgeIndex].strokeColor = { gray:colorForAngle(planarAdjacent[i].angle) };
		}
	}
	resetCP();

	scope.view.onFrame = function(event){ }
	scope.view.onResize = function(event){
		paper = scope;
		zoomView(scope, canvas.width, canvas.height, 0.5);
	}
	scope.view.onMouseMove = function(event){ 
		mousePos = event.point;
		var nEdge = cp.getNearestEdge( mousePos.x, mousePos.y ).edge;
		if(nearestEdge !== nEdge){
			nearestEdge = nEdge;
			for(var i = 0; i < cp.edges.length; i++){
				if(nearestEdge != undefined && nearestEdge === cp.edges[i]){
					paperCP.edges[i].strokeWidth = paperCP.lineWeight*1.2;
				} else{
					paperCP.edges[i].strokeWidth = paperCP.lineWeight*0.66666;
				}
			}
			for(var i = 0; i < planarAdjacent.length; i++){
				var edgeIndex = planarAdjacent[i].edge.index;
				if(planarAdjacent[i].edge === nearestEdge){
					paperCP.edges[edgeIndex].strokeColor = { red:1.0, green:0.0, blue:0.0 };
					if(radial_rainbow_callback != undefined){
						radial_rainbow_callback(planarAdjacent[i].angle);
					}
				}
				else{
					paperCP.edges[edgeIndex].strokeColor = { gray:colorForAngle(planarAdjacent[i].angle) };					
				}
			}
		}
	}

	scope.view.onMouseDown = function(event){
		paper = scope;
		resetCP();
	}

} radial_rainbow();