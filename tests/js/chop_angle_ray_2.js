
var chopRays2 = new PaperCreasePattern("canvas-chop-angle-ray-2");
chopRays2.zoomToFit(0.05);

chopRays2.selectNearestEdge = true;

chopRays2.reset = function(){
	var padding = 0.1;
	var NUM_FAN = 12;

	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	this.cp.crease(0.0, 0.0, 1.0, 1.0);
	for(var i = 1; i < NUM_FAN; i++){
		var pct = (i)/(NUM_FAN);
		var edge = this.cp.creaseRay(new XYPoint(padding + (1.0-padding*2)*pct, 
		                                         padding + (1.0-padding*2)*pct), 
		                             new XYPoint(Math.sin(-Math.PI*0.75+Math.PI*pct), Math.cos(-Math.PI*0.75+Math.PI*pct)));
	}
	for(var i = 1; i < (NUM_FAN-1); i++){
		var pct = (i)/(NUM_FAN-1);
		var edge = this.cp.creaseRay(new XYPoint(padding + (1.0-padding*2)*pct,
			                                     padding + (1.0-padding*2)*pct), 
		                             new XYPoint(Math.sin(-Math.PI*0.25+Math.PI*pct), -Math.cos(-Math.PI*0.25+Math.PI*pct)));
	}
	this.cp.chop();
	this.initialize();
}
chopRays2.reset();

chopRays2.onFrame = function(event) { }
chopRays2.onResize = function(event) { }
chopRays2.onMouseDown = function(event){ chopRays2.reset(); }
chopRays2.onMouseUp = function(event){ }
chopRays2.onMouseMove = function(event) { }
