
var chopRays = new OrigamiPaper("canvas-chop-angle-ray");
chopRays.zoomToFit(0.05);

chopRays.selectNearestEdge = true;

chopRays.reset = function(){
	paper = this.scope; 
	var padding = 0.1;
	var NUM_FAN = 12;

	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	this.cp.crease(0.5, padding, 0.5, 1.0-padding);
	for(var i = 1; i < NUM_FAN; i++){
		var pct = (i)/(NUM_FAN);
		var edge = this.cp.creaseRay(new XY(0.5, padding + (1.0-padding*2)*pct), new XY(-Math.sin(Math.PI*pct), -Math.cos(Math.PI*pct)));
	}
	for(var i = 1; i < (NUM_FAN-1); i++){
		var pct = (i)/(NUM_FAN-1);
		var edge = this.cp.creaseRay(new XY(0.5, padding + (1.0-padding*2)*pct), new XY(Math.sin(Math.PI*pct), -Math.cos(Math.PI*pct)));
	}
	this.cp.fragment();
	this.init();
}
chopRays.reset();

chopRays.onFrame = function(event) { }
chopRays.onResize = function(event) { }
chopRays.onMouseDown = function(event){ chopRays.reset(); }
chopRays.onMouseUp = function(event){ }
chopRays.onMouseMove = function(event) { }
