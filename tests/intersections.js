
edge_intersections_callback = undefined;

var intersectionSketch = new OrigamiPaper("canvas-intersections");
intersectionSketch.setPadding(0.05);
intersectionSketch.intersectionsLayer = new intersectionSketch.scope.Layer();

intersectionSketch.reset = function(){
	paper = this.scope; 
	var NUM_LINES = 30;
	var aspect = this.canvas.width / this.canvas.height;
	this.cp.clear();
	this.cp.rectangle(aspect, 1.0);
	this.cp.edges = [];
	this.cp.nodes = [];
	for(var i = 0; i < NUM_LINES; i++){
		var angle = Math.random()*Math.PI*2;
		this.cp.creaseRay(new XY(Math.random() * aspect, Math.random()), new XY(Math.cos(angle), Math.sin(angle)));
	}
	var report = this.cp.fragment()
	var intersections = report.nodes.fragment;
	this.draw();
	this.nodeLayer.bringToFront();

	this.intersectionsLayer.activate();
	this.intersectionsLayer.removeChildren();
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
