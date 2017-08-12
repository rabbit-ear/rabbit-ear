
edge_intersections_callback = undefined;

var intersectionSketch = new PaperCreasePattern(new CreasePattern(), "canvas-intersections");
intersectionSketch.zoomToFit(0.05);
intersectionSketch.intersectionsLayer = new intersectionSketch.scope.Layer();

intersectionSketch.reset = function(){
	var NUM_LINES = 30;
	var aspect = intersectionSketch.canvas.width / intersectionSketch.canvas.height;
	intersectionSketch.cp.clear();
	intersectionSketch.cp.rectangle(aspect, 1.0);
	intersectionSketch.cp.edges = [];
	intersectionSketch.cp.nodes = [];
	for(var i = 0; i < NUM_LINES; i++){
		var angle = Math.random()*Math.PI*2;
		intersectionSketch.cp.creaseRay(new XYPoint(Math.random() * aspect, Math.random()), new XYPoint(Math.cos(angle), Math.sin(angle)));
	}
	var intersections = intersectionSketch.cp.chop();
	intersectionSketch.initialize();
	intersectionSketch.nodeLayer.bringToFront();

	intersectionSketch.intersectionsLayer.activate();
	intersectionSketch.intersectionsLayer.removeChildren();
	for(var i = 0; i < intersections.length; i++){
		var nodeCircle = new paper.Shape.Circle({
			center: [intersections[i].x, intersections[i].y],
			radius: 0.01,
			fillColor: { hue:220, saturation:0.6, brightness:0.8 }//{ hue:130, saturation:0.8, brightness:0.7 }
		});
	}
	if(edge_intersections_callback != undefined){ edge_intersections_callback(intersections); }
}
intersectionSketch.reset();

intersectionSketch.onFrame = function(event) { }
intersectionSketch.onResize = function(event) { }
intersectionSketch.onMouseDown = function(event){
	intersectionSketch.reset();
}
intersectionSketch.onMouseUp = function(event){ }
intersectionSketch.onMouseMove = function(event) { }
