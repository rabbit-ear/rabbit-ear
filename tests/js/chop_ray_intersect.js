
var rayIntersect = new PaperCreasePattern("canvas-chop-ray-intersect");
rayIntersect.zoomToFit(0.05);

rayIntersect.selectNearestEdge = true;

rayIntersect.reset = function(){
	var padding = 0.1;
	var NUM_FAN = 12;

	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	this.cp.creaseThroughPoints(new XY(Math.random(), Math.random()), 
	                            new XY(Math.random(), Math.random()) );
	var angle = Math.random()*Math.PI*2;
	this.cp.creaseRayUntilIntersection(new XY(Math.random(), Math.random()), 
	                                   new XY(Math.cos(angle), Math.sin(angle)));
	this.cp.clean();
	this.initialize();
}
rayIntersect.reset();

rayIntersect.onFrame = function(event) { }
rayIntersect.onResize = function(event) { }
rayIntersect.onMouseDown = function(event){ rayIntersect.reset(); }
rayIntersect.onMouseUp = function(event){ }
rayIntersect.onMouseMove = function(event) { }
