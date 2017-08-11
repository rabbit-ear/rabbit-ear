// a edge's adjacent faces

var edge_adjacent_faces_callback = undefined;

function edge_adjacent_faces(){

	var canvas = document.getElementById('canvas-edge-adjacent-faces');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height);

	var cp = new CreasePattern();
	cp.birdBase();
	cp.clean();
	var paperCP = new PaperCreasePattern(scope, cp);
	var nearestEdge = undefined;

	// console.log(cp);

	var faceLayer = new paper.Layer();

	scope.view.onFrame = function(event) { }
	scope.view.onResize = function(event) {
		zoomView(scope, canvas.width, canvas.height);
	}
	scope.view.onMouseMove = function(event) {
		paper = scope;
		mousePos = event.point;
		var nEdge = cp.getNearestEdge( mousePos.x, mousePos.y ).edge;
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
			faceLayer.activate();
			faceLayer.removeChildren();
			var faces = nearestEdge.adjacentFaces();
			for(var i = 0; i < faces.length; i++){
				var segmentArray = faces[i].nodes;
				var color = 100 + 200 * i/faces.length;
				new paper.Path({
						fillColor: { hue:color, saturation:1.0, brightness:1.0, alpha:0.2 },
						segments: segmentArray,
						closed: true
				});
			}
			if(edge_adjacent_faces_callback != undefined){
				edge_adjacent_faces_callback({'edge':nearestEdge});
			}
			// console.log("Edge: " + nearestEdge);
		}
	}
	scope.view.onMouseDown = function(event){ }

	// on boot, load (0.0, 0.0)
	scope.view.onMouseMove({point:{x:0.0, y:0.0}});
} edge_adjacent_faces();
