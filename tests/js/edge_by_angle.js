edge_by_angle_callback = undefined;

var edgeAngle = new PaperCreasePattern(new CreasePattern(), "canvas-edge-by-angle");
edgeAngle.zoomToFit(0.05);

edgeAngle.nearestEdge = undefined;
edgeAngle.nearestNode = undefined;
edgeAngle.mouseNodeLayer = new edgeAngle.scope.Layer();
edgeAngle.mouseNodeLayer.activate();
edgeAngle.mouseNodeLayer.removeChildren();
edgeAngle.nearestCircle = new edgeAngle.scope.Shape.Circle({
	center: [0, 0],
	radius: 0.01,
	fillColor: { hue:0, saturation:0.8, brightness:1 }//{ hue:130, saturation:0.8, brightness:0.7 }
});

edgeAngle.reset = function(){
	edgeAngle.cp.clear();
	var centerNode = edgeAngle.cp.newNode().position(0.5, 0.5);
	var num = Math.floor(Math.random()*12 + 3);
	for(var i = 0; i < num; i++){
		edgeAngle.cp.newPlanarEdgeRadiallyFromNode(centerNode, Math.PI*2/num*i, 0.333);
	}
	// var intersections = edgeAngle.cp.chop();
	// edgeAngle.cp.generateFaces();
	edgeAngle.initialize();

	if(edge_by_angle_callback != undefined){
		edge_by_angle_callback(intersections);
	}
}
edgeAngle.reset();

edgeAngle.onFrame = function(event) { }
edgeAngle.onResize = function(event) { }
edgeAngle.onMouseDown = function(event){ edgeAngle.reset(); }
edgeAngle.onMouseUp = function(event){ }
edgeAngle.onMouseMove = function(event) { 
	var nNode = edgeAngle.cp.getNearestNode( event.point.x, event.point.y );
	var nEdge = edgeAngle.cp.getNearestEdge( event.point.x, event.point.y ).edge;
	if(edgeAngle.nearestNode !== nNode){
		edgeAngle.nearestNode = nNode;
		edgeAngle.nearestCircle.position = edgeAngle.nearestNode;
	}
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
}

