
var chopRays = new PaperCreasePattern(new CreasePattern(), "canvas-chop-angle-ray");
chopRays.zoomToFit(0.05);

chopRays.nearestEdge = undefined;
chopRays.nearestNode = undefined;
chopRays.mouseNodeLayer = new chopRays.scope.Layer();
chopRays.mouseNodeLayer.activate();
chopRays.mouseNodeLayer.removeChildren();
chopRays.nearestCircle = new chopRays.scope.Shape.Circle({
	center: [0, 0],
	radius: 0.01,
	fillColor: { hue:0, saturation:0.8, brightness:1 }//{ hue:130, saturation:0.8, brightness:0.7 }
});

chopRays.reset = function(){
	var padding = 0.1;
	var NUM_FAN = 12;

	chopRays.cp.clear();
	chopRays.cp.nodes = [];
	chopRays.cp.edges = [];
	chopRays.cp.creaseOnly(new XYPoint(0.5, padding), new XYPoint(0.5, 1.0-padding));
	for(var i = 1; i < NUM_FAN; i++){
		var pct = (i)/(NUM_FAN);
		var edge = chopRays.cp.creaseRay(new XYPoint(0.5, padding + (1.0-padding*2)*pct), new XYPoint(-Math.sin(Math.PI*pct), -Math.cos(Math.PI*pct)));
	}
	for(var i = 1; i < (NUM_FAN-1); i++){
		var pct = (i)/(NUM_FAN-1);
		var edge = chopRays.cp.creaseRay(new XYPoint(0.5, padding + (1.0-padding*2)*pct), new XYPoint(Math.sin(Math.PI*pct), -Math.cos(Math.PI*pct)));
	}
	chopRays.cp.chop();
	chopRays.initialize();
}
chopRays.reset();

chopRays.onFrame = function(event) { }
chopRays.onResize = function(event) { }
chopRays.onMouseDown = function(event){ chopRays.reset(); }
chopRays.onMouseUp = function(event){ }
chopRays.onMouseMove = function(event) { 
	var nNode = chopRays.cp.getNearestNode( event.point.x, event.point.y );
	var nEdge = chopRays.cp.getNearestEdge( event.point.x, event.point.y ).edge;
	if(chopRays.nearestNode !== nNode){
		chopRays.nearestNode = nNode;
		chopRays.nearestCircle.position = chopRays.nearestNode;
	}
	if(chopRays.nearestEdge !== nEdge){
		chopRays.nearestEdge = nEdge;
		for(var i = 0; i < chopRays.cp.edges.length; i++){
			if(chopRays.nearestEdge != undefined && chopRays.nearestEdge === chopRays.cp.edges[i]){
				chopRays.edges[i].strokeColor = { hue:0, saturation:0.8, brightness:1 };
			} else{
				chopRays.edges[i].strokeColor = chopRays.styleForCrease(chopRays.cp.edges[i].orientation).strokeColor;
			}
		}
	}
}
