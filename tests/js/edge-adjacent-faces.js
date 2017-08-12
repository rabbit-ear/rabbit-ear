// a edge's adjacent faces

var edge_adjacent_faces_callback = undefined;

var edgeFaces = new PaperCreasePattern("canvas-edge-adjacent-faces");
edgeFaces.zoomToFit(0.05);
edgeFaces.nearestEdgeColor = { hue:0, saturation:0.8, brightness:1 };
edgeFaces.faceLayer = new edgeFaces.scope.Layer();
edgeFaces.edgeLayer.bringToFront();
edgeFaces.paperEdgeLayer.bringToFront();

edgeFaces.reset = function(){
	edgeFaces.cp.clear();
	edgeFaces.cp.birdBase();
	edgeFaces.cp.clean();
	edgeFaces.initialize();
}
edgeFaces.reset();

edgeFaces.onFrame = function(event) { }
edgeFaces.onResize = function(event) { }
edgeFaces.onMouseDown = function(event){ edgeFaces.reset(); }
edgeFaces.onMouseUp = function(event){ }
edgeFaces.onMouseMove = function(event) { 
	edgeFaces.faceLayer.activate();
	edgeFaces.faceLayer.removeChildren();
	var faces = edgeFaces.nearestEdge.adjacentFaces();
	for(var i = 0; i < faces.length; i++){
		var color = 100 + 200 * i/faces.length;
		new edgeFaces.scope.Path({
				fillColor: { hue:color, saturation:1.0, brightness:1.0, alpha:0.2 },
				segments: faces[i].nodes,
				closed: true
		});
	}
	if(edge_adjacent_faces_callback != undefined){
		edge_adjacent_faces_callback({'edge':edgeFaces.nearestEdge});
	}
}

