// a edge's adjacent faces

var edge_adjacent_faces_callback = undefined;

var edgeAngle = new PaperCreasePattern(new CreasePattern(), "canvas-edge-adjacent-faces");
edgeAngle.zoomToFit(0.05);

edgeAngle.nearestEdge = undefined;
edgeAngle.faceLayer = new edgeAngle.scope.Layer();

edgeAngle.reset = function(){
	edgeAngle.cp.clear();
	edgeAngle.cp.birdBase();
	edgeAngle.cp.clean();
	edgeAngle.initialize();
}
edgeAngle.reset();

edgeAngle.onFrame = function(event) { }
edgeAngle.onResize = function(event) { }
edgeAngle.onMouseDown = function(event){ edgeAngle.reset(); }
edgeAngle.onMouseUp = function(event){ }
edgeAngle.onMouseMove = function(event) { 
	var nEdge = edgeAngle.cp.getNearestEdge( event.point.x, event.point.y ).edge;
	if(edgeAngle.nearestEdge !== nEdge){
		edgeAngle.nearestEdge = nEdge;
		for(var i = 0; i < edgeAngle.cp.edges.length; i++){
			if(edgeAngle.nearestEdge != undefined && edgeAngle.nearestEdge === edgeAngle.cp.edges[i]){
				edgeAngle.edges[i].strokeColor = { hue:0, saturation:0.8, brightness:1 };
			} else{
				edgeAngle.edges[i].strokeColor = edgeAngle.styleForCrease(edgeAngle.cp.edges[i].orientation).strokeColor;
			}
		}
	}
	edgeAngle.faceLayer.activate();
	edgeAngle.faceLayer.removeChildren();
	var faces = edgeAngle.nearestEdge.adjacentFaces();
	for(var i = 0; i < faces.length; i++){
		var segmentArray = faces[i].nodes;
		var color = 100 + 200 * i/faces.length;
		new edgeAngle.scope.Path({
				fillColor: { hue:color, saturation:1.0, brightness:1.0, alpha:0.2 },
				segments: segmentArray,
				closed: true
		});
	}
	if(edge_adjacent_faces_callback != undefined){
		edge_adjacent_faces_callback({'edge':edgeAngle.nearestEdge});
	}
}

