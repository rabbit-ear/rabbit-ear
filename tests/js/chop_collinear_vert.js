
var chopVert = new PaperCreasePattern(new CreasePattern(), "canvas-chop-collinear-vert");
chopVert.zoomToFit(0.05);

chopVert.nearestEdge = undefined;
chopVert.nearestNode = undefined;
chopVert.mouseNodeLayer = new chopVert.scope.Layer();
chopVert.mouseNodeLayer.activate();
chopVert.mouseNodeLayer.removeChildren();
chopVert.nearestCircle = new chopVert.scope.Shape.Circle({
	center: [0, 0],
	radius: 0.01,
	fillColor: { hue:0, saturation:0.8, brightness:1 }//{ hue:130, saturation:0.8, brightness:0.7 }
});

chopVert.reset = function(){
	var NUM_LINES = 20;
	chopVert.cp.clear();
	chopVert.cp.nodes = [];
	chopVert.cp.edges = [];
	chopVert.cp.creaseOnly(new XYPoint(0.5, 0.0), new XYPoint(0.5, 1.0));
	for(var i = 0; i < NUM_LINES; i++){
		var y = .1 + .8*(i/(NUM_LINES-1));
		chopVert.cp.creaseOnly( new XYPoint(Math.random(), y), new XYPoint(0.5, y) );
	}
	var crossings = chopVert.cp.chop();
	chopVert.initialize();
}
chopVert.reset();

chopVert.onFrame = function(event) { }
chopVert.onResize = function(event) { }
chopVert.onMouseDown = function(event){ chopVert.reset(); }
chopVert.onMouseUp = function(event){ }
chopVert.onMouseMove = function(event) { 
	var nNode = chopVert.cp.getNearestNode( event.point.x, event.point.y );
	var nEdge = chopVert.cp.getNearestEdge( event.point.x, event.point.y ).edge;
	if(chopVert.nearestNode !== nNode){
		chopVert.nearestNode = nNode;
		chopVert.nearestCircle.position = chopVert.nearestNode;
	}
	if(chopVert.nearestEdge !== nEdge){
		chopVert.nearestEdge = nEdge;
		for(var i = 0; i < chopVert.cp.edges.length; i++){
			if(chopVert.nearestEdge != undefined && chopVert.nearestEdge === chopVert.cp.edges[i]){
				chopVert.edges[i].strokeColor = { hue:0, saturation:0.8, brightness:1 };
			} else{
				chopVert.edges[i].strokeColor = chopVert.styleForCrease(chopVert.cp.edges[i].orientation).strokeColor;
			}
		}
	}
}