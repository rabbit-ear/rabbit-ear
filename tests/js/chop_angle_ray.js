function new_sketch(){
	var canvas = document.getElementById('canvas-chop-angle-ray');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height, 0.5);

	var cp = new CreasePattern();
	var paperCP = new PaperCreasePattern(scope, cp);

	var NUM_FAN = 12;
	var nearestEdge = undefined;

	function init(){
		cp.clear();
		cp.creaseOnly(new XYPoint(0.5, 0.25), new XYPoint(0.5, 0.75));
		for(var i = 1; i < NUM_FAN; i++){
			var pct = (i)/(NUM_FAN);
			cp.creaseRay(new XYPoint(0.5, 0.25 + 0.5*pct), new XYPoint(-Math.sin(Math.PI*pct), -Math.cos(Math.PI*pct)));
		}
		cp.chop();
		paperCP.initialize();
	} init();

	// scope.view.onFrame = function(event) { 
	// 	paper = scope;
	// 	// event.time;
	// }
	scope.view.onResize = function(event) {
		paper = scope;
		zoomView(scope, canvas.width, canvas.height, 0.5);
	}
	scope.view.onMouseMove = function(event){ 
		paper = scope;
		var nEdge = cp.getNearestEdge( event.point.x, event.point.y ).edge;
		if(nearestEdge !== nEdge){
			nearestEdge = nEdge;
			for(var i = 0; i < cp.edges.length; i++){
				if(nearestEdge != undefined && nearestEdge === cp.edges[i]){
					// paperCP.edges[i].strokeWidth = paperCP.lineWeight*2;
					paperCP.edges[i].strokeColor = { hue:0, saturation:0.8, brightness:1 };
				} else{
					// paperCP.edges[i].strokeWidth = paperCP.lineWeight;
					paperCP.edges[i].strokeColor = paperCP.colorForCrease(cp.edges[i].orientation);
				}
			}
		}
	}
	scope.view.onMouseDown = function(event){
		paper = scope;
	}
} new_sketch();
