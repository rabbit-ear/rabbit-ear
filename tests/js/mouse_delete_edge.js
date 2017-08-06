// generate faces

mouse_delete_edge_callback = undefined;

function mouse_delete_edge(){
	var canvas = document.getElementById('canvas-mouse-delete-edge');
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
		// cp.nodes = [];
		// cp.edges = [];
		// var inset = 0.0001;
		// cp.creaseOnly(new XYPoint(inset, inset), new XYPoint(inset, 1-inset) );
		// cp.creaseOnly(new XYPoint(inset, 1-inset), new XYPoint(1-inset, 1-inset) );
		// cp.creaseOnly(new XYPoint(1-inset, 1-inset), new XYPoint(1-inset, inset) );
		// cp.creaseOnly(new XYPoint(1-inset, inset), new XYPoint(inset, inset) );
		for(var i = 0; i < 15; i++){
			var angle = Math.random()*Math.PI*2;
			cp.creaseRay(new XYPoint(Math.random(), Math.random()), new XYPoint(Math.cos(angle), Math.sin(angle)));
		}
		cp.chop();
		paperCP.initialize();
		paperCP.nodeLayer.visible = true;

		if(mouse_delete_edge_callback != undefined){
			// mouse_delete_edge_callback(intersections);
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
		// resetCP();
		if(nearestEdge != undefined){
			cp.removeEdge(nearestEdge);
			nearestEdge = cp.getNearestEdge( mousePos.x, mousePos.y ).edge;
			paperCP.initialize();
			paperCP.nodeLayer.visible = true;
		}
	}

} mouse_delete_edge();