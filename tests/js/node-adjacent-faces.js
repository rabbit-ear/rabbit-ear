// a node's adjacent faces

var node_adjacent_faces_callback = undefined;

function node_adjacent_faces(){

	var canvas = document.getElementById('canvas-node-adjacent-faces');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height, 0.5);

	var cp = new CreasePattern();
	cp.birdBase();
	cp.clean();
	var paperCP = new PaperCreasePattern(scope, cp);
	var nearestNode = undefined;

	console.log(cp);

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
		if(nearestNode !== nNode){
			nearestNode = nNode;
			nodeCircle.position.x = nearestNode.x;
			nodeCircle.position.y = nearestNode.y;
			faceLayer.activate();
			faceLayer.removeChildren();
			var faces = nearestNode.adjacentFaces();
			for(var i = 0; i < faces.length; i++){
				var segmentArray = faces[i].nodes;
				var color = 100 + 200 * i/faces.length;
				new paper.Path({
						fillColor: { hue:color, saturation:1.0, brightness:1.0, alpha:0.2 },
						segments: segmentArray,
						closed: true
				});
			}
			// console.log("Node: " + nearestNode);
			if(node_adjacent_faces_callback != undefined){
				node_adjacent_faces_callback({'node':nearestNode.index});
			}
		}
	}
	scope.view.onMouseDown = function(event){ }

	// on boot, load (0.5, 0.5)
	scope.view.onMouseMove({point:{x:0.0, y:0.0}});
} node_adjacent_faces();
