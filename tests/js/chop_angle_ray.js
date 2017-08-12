
var chopRays = new PaperCreasePattern("canvas-chop-angle-ray");
chopRays.zoomToFit(0.05);

// chopRays.nearestNodeColor = { hue:0, saturation:0.8, brightness:1 };
chopRays.nearestEdgeColor = { hue:0, saturation:0.8, brightness:1 };

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
chopRays.onMouseMove = function(event) { }
