
var chop_sketch = new PaperCreasePattern(new CreasePattern(), "canvas-chop");
chop_sketch.zoomToFit(0.05);

chop_sketch.nearestEdge = undefined;
chop_sketch.nearestNode = undefined;
chop_sketch.mouseNodeLayer = new chop_sketch.scope.Layer();
chop_sketch.mouseNodeLayer.activate();
chop_sketch.mouseNodeLayer.removeChildren();
chop_sketch.nearestCircle = new chop_sketch.scope.Shape.Circle({
	center: [0, 0],
	radius: 0.01,
	fillColor: { hue:0, saturation:0.8, brightness:1 }//{ hue:130, saturation:0.8, brightness:0.7 }
});

chop_sketch.reset = function(){
	chop_sketch.cp.clear();
	chop_sketch.cp.nodes = [];
	chop_sketch.cp.edges = [];
	for(var i = 0; i < 30; i++){
		var angle = Math.random()*Math.PI*2;
		chop_sketch.cp.creaseRay(new XYPoint(Math.random(), Math.random()), new XYPoint(Math.cos(angle), Math.sin(angle)));
	}
	var crossings = chop_sketch.cp.chop();
	chop_sketch.initialize();
}
chop_sketch.reset();

chop_sketch.onFrame = function(event) { }
chop_sketch.onResize = function(event) { }
chop_sketch.onMouseDown = function(event){ chop_sketch.reset(); }
chop_sketch.onMouseUp = function(event){ }
chop_sketch.onMouseMove = function(event) { 
	var nNode = chop_sketch.cp.getNearestNode( event.point.x, event.point.y );
	var nEdge = chop_sketch.cp.getNearestEdge( event.point.x, event.point.y ).edge;
	if(chop_sketch.nearestNode !== nNode){
		chop_sketch.nearestNode = nNode;
		chop_sketch.nearestCircle.position = chop_sketch.nearestNode;
	}
	if(chop_sketch.nearestEdge !== nEdge){
		chop_sketch.nearestEdge = nEdge;
		for(var i = 0; i < chop_sketch.cp.edges.length; i++){
			if(chop_sketch.nearestEdge != undefined && chop_sketch.nearestEdge === chop_sketch.cp.edges[i]){
				// chop_sketch.edges[i].strokeWidth = chop_sketch.lineWeight*2;
				chop_sketch.edges[i].strokeColor = { hue:0, saturation:0.8, brightness:1 };
			} else{
				// chop_sketch.edges[i].strokeWidth = chop_sketch.lineWeight;
				chop_sketch.edges[i].strokeColor = chop_sketch.styleForCrease(chop_sketch.cp.edges[i].orientation).strokeColor;
			}
		}
	}
}
