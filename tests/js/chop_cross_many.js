
var chopCross = new PaperCreasePattern(new CreasePattern(), "canvas-chop-cross-many");
chopCross.zoomToFit(0.05);

chopCross.nearestEdge = undefined;
chopCross.nearestNode = undefined;
chopCross.mouseNodeLayer = new chopCross.scope.Layer();
chopCross.mouseNodeLayer.activate();
chopCross.mouseNodeLayer.removeChildren();
chopCross.nearestCircle = new chopCross.scope.Shape.Circle({
	center: [0, 0],
	radius: 0.01,
	fillColor: { hue:0, saturation:0.8, brightness:1 }//{ hue:130, saturation:0.8, brightness:0.7 }
});

chopCross.reset = function(){
	var NUM_LINES = 30;
	chopCross.cp.clear();
	chopCross.cp.nodes = [];
	chopCross.cp.edges = [];
	var firstEdge = chopCross.cp.creaseOnly(new XYPoint(0.0, 0.5), new XYPoint(1.0, 0.5));
	var v = .8/(NUM_LINES-1);
	for(var i = 0; i < NUM_LINES; i++){
		var x = .1 + .8*(i/(NUM_LINES-1));
		chopCross.cp.creaseOnly(
			new XYPoint(x + Math.random()*v-v*0.5, 0.25 + Math.random()*v-v*0.5), 
			new XYPoint(x + Math.random()*v-v*0.5, 0.75 + Math.random()*v-v*0.5)
		);
	}
	var lowerEdge = chopCross.cp.creaseOnly(new XYPoint(0.0, 0.6), new XYPoint(1.0, 0.6));
	var crossings = chopCross.cp.chop();
	chopCross.initialize();
}
chopCross.reset();

chopCross.onFrame = function(event) { }
chopCross.onResize = function(event) { }
chopCross.onMouseDown = function(event){ chopCross.reset(); }
chopCross.onMouseUp = function(event){ }
chopCross.onMouseMove = function(event) { 
	var nNode = chopCross.cp.getNearestNode( event.point.x, event.point.y );
	var nEdge = chopCross.cp.getNearestEdge( event.point.x, event.point.y ).edge;
	if(chopCross.nearestNode !== nNode){
		chopCross.nearestNode = nNode;
		chopCross.nearestCircle.position = chopCross.nearestNode;
	}
	if(chopCross.nearestEdge !== nEdge){
		chopCross.nearestEdge = nEdge;
		for(var i = 0; i < chopCross.cp.edges.length; i++){
			if(chopCross.nearestEdge != undefined && chopCross.nearestEdge === chopCross.cp.edges[i]){
				chopCross.edges[i].strokeColor = { hue:0, saturation:0.8, brightness:1 };
			} else{
				chopCross.edges[i].strokeColor = chopCross.styleForCrease(chopCross.cp.edges[i].orientation).strokeColor;
			}
		}
	}
}
