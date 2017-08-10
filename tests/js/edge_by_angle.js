// generate faces

edge_by_angle_callback = undefined;

var cp;

function edge_by_angle(){
	var canvas = document.getElementById('canvas-edge-by-angle');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height);

	cp = new CreasePattern();
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
		var centerNode = cp.newNode().position(0.5, 0.5);
		var num = Math.floor(Math.random()*12 + 3);
		for(var i = 0; i < num; i++){
			cp.newPlanarEdgeRadiallyFromNode(centerNode, Math.PI*2/num*i, 0.333);
		}
		// var intersections = cp.chop();
		// cp.generateFaces();
		paperCP.initialize();

		if(edge_by_angle_callback != undefined){
			edge_by_angle_callback(intersections);
		}
	}
	resetCP();

	scope.view.onFrame = function(event){ }
	scope.view.onResize = function(event){
		paper = scope;
		zoomView(scope, canvas.width, canvas.height);
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

} edge_by_angle();