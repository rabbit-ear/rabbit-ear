
var chopMV = new PaperCreasePattern(new CreasePattern(), "canvas-chop-mountain-valley");
chopMV.zoomToFit(0.05);

chopMV.nearestEdge = undefined;
chopMV.nearestNode = undefined;
chopMV.mouseNodeLayer = new chopMV.scope.Layer();
chopMV.mouseNodeLayer.activate();
chopMV.mouseNodeLayer.removeChildren();
chopMV.nearestCircle = new chopMV.scope.Shape.Circle({
	center: [0, 0],
	radius: 0.01,
	fillColor: { hue:0, saturation:0.8, brightness:1 }//{ hue:130, saturation:0.8, brightness:0.7 }
});

chopMV.reset = function(){
	var NUM_LINES = 10;
	chopMV.cp.clear();
	for(var i = 0; i < NUM_LINES; i++){
		var crease = chopMV.cp.creaseOnly( new XYPoint(Math.random(), Math.random()), new XYPoint(Math.random(), Math.random()) );
		if(Math.random() < 0.5){ crease.mountain(); } 
		else{                    crease.valley(); }
	}
	chopMV.cp.clean();
	chopMV.initialize();
}
chopMV.reset();

chopMV.onFrame = function(event) { }
chopMV.onResize = function(event) { }
chopMV.onMouseDown = function(event){ chopMV.reset(); }
chopMV.onMouseUp = function(event){ }
chopMV.onMouseMove = function(event) { 
	var nNode = chopMV.cp.getNearestNode( event.point.x, event.point.y );
	var nEdge = chopMV.cp.getNearestEdge( event.point.x, event.point.y ).edge;
	if(chopMV.nearestNode !== nNode){
		chopMV.nearestNode = nNode;
		chopMV.nearestCircle.position = chopMV.nearestNode;
	}
	if(chopMV.nearestEdge !== nEdge){
		chopMV.nearestEdge = nEdge;
		for(var i = 0; i < chopMV.cp.edges.length; i++){
			if(chopMV.nearestEdge != undefined && chopMV.nearestEdge === chopMV.cp.edges[i]){
				chopMV.edges[i].strokeColor = { hue:0, saturation:0.8, brightness:1 };
			} else{
				chopMV.edges[i].strokeColor = chopMV.styleForCrease(chopMV.cp.edges[i].orientation).strokeColor;
			}
		}
	}
}


