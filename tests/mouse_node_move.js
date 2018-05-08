var mouse_node_move_callback;

function mouse_node_move(){
	var canvas = document.getElementById('canvas-mouse-node-move');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height);

	var cp = new CreasePattern();
	cp.birdBase();

	var paperCP = new OrigamiPaper(scope, cp);
	// for(var i = 0; i < paperCP.edges.length; i++){ paperCP.edges[i].strokeWidth = paperCP.lineWeight*1.5; }

	var nearestNode = undefined;
	var movingNode = undefined;
	var movingNodeOriginalLocation = undefined;

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
		paper = scope;
		if(mouse_node_move_callback != undefined){ mouse_node_move_callback(event.point); }
		if(movingNode != undefined){
			movingNode.x = event.point.x;
			movingNode.y = event.point.y;
			nodeCircle.position.x = movingNode.x;
			nodeCircle.position.y = movingNode.y;
		} else{
			var nNode = cp.nearest( event.point.x, event.point.y ).node;
			if(nearestNode !== nNode){
				nearestNode = nNode;
				nodeCircle.position.x = nearestNode.x;
				nodeCircle.position.y = nearestNode.y;
			}
		}
		paperCP.draw();
	}
	scope.view.onMouseDown = function(event){
		paper = scope;
		movingNode = cp.nearest( event.point.x, event.point.y ).node;
		movingNodeOriginalLocation = new XY(movingNode.x, movingNode.y);
	}
	scope.view.onMouseUp = function(event){
		paper = scope;
		if(movingNode != undefined && movingNodeOriginalLocation != undefined){
			movingNode.x = movingNodeOriginalLocation.x;
			movingNode.y = movingNodeOriginalLocation.y;
			nodeCircle.position.x = movingNode.x;
			nodeCircle.position.y = movingNode.y;
			movingNode = undefined;
			movingNodeOriginalLocation = undefined;
			paperCP.draw();
		}
	}
} mouse_node_move();
