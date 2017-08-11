var mouse_select_callback;

function mouse_select(){
	var canvas = document.getElementById('canvas-mouse-select');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height);

	var cp = new CreasePattern();
	cp.birdBase();

	var paperCP = new PaperCreasePattern(scope, cp);
	// for(var i = 0; i < paperCP.edges.length; i++){ paperCP.edges[i].strokeWidth = paperCP.lineWeight*1.5; }

	var nearestEdge = undefined;
	var nearestNode = undefined;

	var mouseNodeLayer = new paper.Layer();
	mouseNodeLayer.activate();
	mouseNodeLayer.removeChildren();
	var nodeCircle = new paper.Shape.Circle({
		center: [0, 0],
		radius: 0.02,
		fillColor: { hue:0, saturation:0.8, brightness:1 }//{ hue:130, saturation:0.8, brightness:0.7 }
	});

	scope.view.onFrame = function(event) { }
	scope.view.onResize = function(event) {
		paper = scope;
		zoomView(scope, canvas.width, canvas.height);
	}
	scope.view.onMouseMove = function(event){
		if(mouse_select_callback != undefined){ mouse_select_callback(event.point); }
		mousePos = event.point;
		var nNode = cp.getNearestNode( mousePos.x, mousePos.y );
		var nEdge = cp.getNearestEdge( mousePos.x, mousePos.y ).edge;
		if(nearestNode !== nNode){
			nearestNode = nNode;
			nodeCircle.position.x = nearestNode.x;
			nodeCircle.position.y = nearestNode.y;
			// console.log("Node: " + nearestNode);
		}
		if(nearestEdge !== nEdge){
			nearestEdge = nEdge;
			for(var i = 0; i < cp.edges.length; i++){
				if(nearestEdge != undefined && nearestEdge === cp.edges[i]){
					// paperCP.edges[i].strokeWidth = paperCP.lineWeight*2;
					paperCP.edges[i].strokeColor = { hue:0, saturation:0.8, brightness:1 };
				} else{
					// paperCP.edges[i].strokeWidth = paperCP.lineWeight;
					paperCP.edges[i].strokeColor = paperCP.styleForCrease(cp.edges[i].orientation).strokeColor;
				}
			}
			// console.log("Edge: " + nearestEdge);
		}
	}
	scope.view.onMouseDown = function(event){
		paper = scope;		
	}
} mouse_select();
