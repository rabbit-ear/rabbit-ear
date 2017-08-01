// generate faces

faces_random_callback = undefined;

function faces_random(){
	var canvas = document.getElementById('canvas-faces-random');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height, 0.5);

	var cp = new CreasePattern();
	var paperCP = new PaperCreasePattern(scope, cp);

	var nearestEdge = undefined;
	// var nearestNode = undefined;

	var intersectionsLayer = new paper.Layer();
	
	// var mouseNodeLayer = new paper.Layer();
	// mouseNodeLayer.activate();
	// mouseNodeLayer.removeChildren();
	// var nodeCircle = new paper.Shape.Circle({
	// 	center: [0, 0],
	// 	radius: 0.01,
	// 	fillColor: { hue:0, saturation:0.8, brightness:1 }//{ hue:130, saturation:0.8, brightness:0.7 }
	// });

	function resetCP(){
		cp.clear();
		cp.nodes = [];
		cp.edges = [];
		var inset = 0.0001;
		cp.creaseOnly(new XYPoint(inset, inset), new XYPoint(inset, 1-inset) );
		cp.creaseOnly(new XYPoint(inset, 1-inset), new XYPoint(1-inset, 1-inset) );
		cp.creaseOnly(new XYPoint(1-inset, 1-inset), new XYPoint(1-inset, inset) );
		cp.creaseOnly(new XYPoint(1-inset, inset), new XYPoint(inset, inset) );
		for(var i = 0; i < 10; i++){
			cp.creaseConnectingPoints(new XYPoint(Math.random(), Math.random()), new XYPoint(Math.random(), Math.random()) );
		}
		var intersections = cp.chop();
		cp.generateFaces();
		paperCP.initialize();

		// intersectionsLayer.activate();
		// intersectionsLayer.removeChildren();
		// for(var i = 0; i < intersections.length; i++){
		// 	var nodeCircle = new paper.Shape.Circle({
		// 		center: [intersections[i].x, intersections[i].y],
		// 		radius: 0.01,
		// 		fillColor: { hue:220, saturation:0.6, brightness:0.8 }//{ hue:130, saturation:0.8, brightness:0.7 }
		// 	});
		// }
		if(faces_random_callback != undefined){
			faces_random_callback(intersections);
		}
	}
	resetCP();

	scope.view.onFrame = function(event){ }
	scope.view.onResize = function(event){
		paper = scope;
		zoomView(scope, canvas.width, canvas.height, 0.5);
	}
	scope.view.onMouseMove = function(event){ 
		paper = scope;
		mousePos = event.point;
		// var nNode = cp.getNearestNode( mousePos.x, mousePos.y );
		var nEdge = cp.getNearestEdge( mousePos.x, mousePos.y ).edge;
		// if(nearestNode !== nNode){
		// 	nearestNode = nNode;
		// 	nodeCircle.position.x = nearestNode.x;
		// 	nodeCircle.position.y = nearestNode.y;
		// 	// console.log("Node: " + nearestNode);
		// }
		if(nearestEdge !== nEdge){
			nearestEdge = nEdge;
			for(var i = 0; i < cp.edges.length; i++){
				if(nearestEdge != undefined && nearestEdge === cp.edges[i]){
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
		resetCP();
	}

} faces_random();