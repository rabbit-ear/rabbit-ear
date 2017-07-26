// a node's adjacent faces

function node_adjacent_faces(){
	var canvas = document.getElementById('canvas-node-adjacent-faces');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height, 0.5);

	var cp = new CreasePattern();
	cp.birdBase();
	var paperCP = new PaperCreasePattern(scope, cp);
	var nearestEdge = undefined;
	var nearestNode = undefined;

	var faceLayer = new paper.Layer();
	var mouseNodeLayer = new paper.Layer();
	mouseNodeLayer.activate();
	mouseNodeLayer.removeChildren();

	var nodeCircle = new paper.Shape.Circle({
		center: [0, 0],
		radius: 0.03,
		fillColor: { hue:220, saturation:0.8, brightness:1.0 }//{ hue:130, saturation:0.8, brightness:0.7 }
	});

	scope.view.onFrame = function(event) { }
	scope.view.onResize = function(event) {
		zoomView(scope, canvas.width, canvas.height, 0.5);
	}
	scope.view.onMouseMove = function(event) {
		mousePos = event.point;
		var nNode = cp.getNearestNode( mousePos.x, mousePos.y );
		var nEdge = cp.getNearestEdge( mousePos.x, mousePos.y ).edge;
		if(nearestNode != nNode){
			nearestNode = nNode;
			nodeCircle.position.x = cp.nodes[nearestNode].x;
			nodeCircle.position.y = cp.nodes[nearestNode].y;
			faceLayer.activate();
			faceLayer.removeChildren();
			var faces = cp.nodes[nearestNode].adjacentFaces();
			for(var i = 0; i < faces.length; i++){
				var segmentArray = faces[i].nodes;
				new paper.Path({
						fillColor: { hue:120, saturation:1.0, brightness:1.0, alpha:0.2 },
						segments: segmentArray,
						closed: true
				});
			}
			console.log("Node: " + nearestNode);
		}
	}

	scope.view.onMouseDown = function(event){ }

} node_adjacent_faces();