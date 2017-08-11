
var chopHoriz = new PaperCreasePattern(new CreasePattern(), "canvas-chop-collinear-horiz");
chopHoriz.zoomToFit(0.05);

chopHoriz.nearestEdge = undefined;
chopHoriz.nearestNode = undefined;
chopHoriz.mouseNodeLayer = new chopHoriz.scope.Layer();
chopHoriz.mouseNodeLayer.activate();
chopHoriz.mouseNodeLayer.removeChildren();
chopHoriz.nearestCircle = new chopHoriz.scope.Shape.Circle({
	center: [0, 0],
	radius: 0.01,
	fillColor: { hue:0, saturation:0.8, brightness:1 }//{ hue:130, saturation:0.8, brightness:0.7 }
});

chopHoriz.reset = function(){
	var NUM_LINES = 20;
	chopHoriz.cp.clear();
	chopHoriz.cp.nodes = [];
	chopHoriz.cp.edges = [];
	chopHoriz.cp.creaseOnly(new XYPoint(0.0, 0.5), new XYPoint(1.0, 0.5));
	for(var i = 0; i < NUM_LINES; i++){
		var x = .1 + .8*(i/(NUM_LINES-1));
		chopHoriz.cp.creaseOnly( new XYPoint(x, Math.random()), new XYPoint(x, 0.5) );
	}
	var crossings = chopHoriz.cp.chop();
	chopHoriz.initialize();
}
chopHoriz.reset();

chopHoriz.onFrame = function(event) { }
chopHoriz.onResize = function(event) { }
chopHoriz.onMouseDown = function(event){ chopHoriz.reset(); }
chopHoriz.onMouseUp = function(event){ }
chopHoriz.onMouseMove = function(event) { 
	var nNode = chopHoriz.cp.getNearestNode( event.point.x, event.point.y );
	var nEdge = chopHoriz.cp.getNearestEdge( event.point.x, event.point.y ).edge;
	if(chopHoriz.nearestNode !== nNode){
		chopHoriz.nearestNode = nNode;
		chopHoriz.nearestCircle.position = chopHoriz.nearestNode;
	}
	if(chopHoriz.nearestEdge !== nEdge){
		chopHoriz.nearestEdge = nEdge;
		for(var i = 0; i < chopHoriz.cp.edges.length; i++){
			if(chopHoriz.nearestEdge != undefined && chopHoriz.nearestEdge === chopHoriz.cp.edges[i]){
				chopHoriz.edges[i].strokeColor = { hue:0, saturation:0.8, brightness:1 };
			} else{
				chopHoriz.edges[i].strokeColor = chopHoriz.styleForCrease(chopHoriz.cp.edges[i].orientation).strokeColor;
			}
		}
	}
}
