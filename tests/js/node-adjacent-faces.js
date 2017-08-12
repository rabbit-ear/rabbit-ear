// a node's adjacent faces

var node_adjacent_faces_callback = undefined;

var nodeFaces = new PaperCreasePattern("canvas-node-adjacent-faces");
nodeFaces.zoomToFit(0.05);
nodeFaces.nearestNodeColor = { hue:220, saturation:0.6, brightness:1 };
nodeFaces.faceLayer = new nodeFaces.scope.Layer();
nodeFaces.edgeLayer.bringToFront();
nodeFaces.boundaryLayer.bringToFront();
nodeFaces.mouseNodeLayer.bringToFront();

nodeFaces.reset = function(){
	nodeFaces.cp.clear();
	nodeFaces.cp.birdBase();
	nodeFaces.cp.clean();
	nodeFaces.initialize();
}
nodeFaces.reset();

nodeFaces.onFrame = function(event) { }
nodeFaces.onResize = function(event) { }
nodeFaces.onMouseDown = function(event){ nodeFaces.reset(); }
nodeFaces.onMouseUp = function(event){ }
nodeFaces.onMouseMove = function(event) { 
	nodeFaces.faceLayer.activate();
	nodeFaces.faceLayer.removeChildren();
	var faces = nodeFaces.nearestNode.adjacentFaces();
	for(var i = 0; i < faces.length; i++){
		var color = 100 + 200 * i/faces.length;
		new nodeFaces.scope.Path({
				fillColor: { hue:color, saturation:1.0, brightness:1.0, alpha:0.2 },
				segments: faces[i].nodes,
				closed: true
		});
	}
	if(node_adjacent_faces_callback != undefined){
		node_adjacent_faces_callback({'node':nodeFaces.nearestNode});
	}
}

