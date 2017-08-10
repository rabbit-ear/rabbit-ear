function sequence_folding(){
	var canvas = document.getElementById('canvas-sequence-folding');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height);

	var mag = 0.1;

	var cp = new CreasePattern();
	var paperCP = new PaperCreasePattern(scope, cp);

	// var firstFold = cp.creaseEdgeToEdge(cp.topEdge(), cp.leftEdge())[0].mountain();
	// cp.creaseEdgeToEdge(cp.topEdge(), cp.rightEdge())[0].mountain().creaseToEdge(firstFold).forEach(function(el){el.valley();});
	// cp.creaseEdgeToEdge(cp.topEdge(), cp.rightEdge())[0].mountain().creaseToEdge(cp.bottomEdge())[0].valley();
	paperCP.initialize();

	scope.view.onFrame = function(event) { 
		// event.time;
		var paperCorners = [
			new XYPoint(0.0 + mag*Math.cos(event.time*1.75+4), 0.0),
			new XYPoint(0.0, 1.0),
			new XYPoint(1.0 + mag*Math.sin(event.time*1.5+2), 1.0),
			new XYPoint(1.0, 0.0 + mag*Math.cos(event.time*0.888888+5))
		];
		cp.clear();
		cp.polygon(paperCorners);
		var firstFold = cp.creaseEdgeToEdge(cp.topEdge(), cp.leftEdge())[0].mountain();
		cp.creaseEdgeToEdge(cp.topEdge(), cp.rightEdge())[0].mountain().creaseToEdge(firstFold).forEach(function(el){el.valley();});

		paperCP.initialize();
	}
	scope.view.onResize = function(event) {
		paper = scope;
		zoomView(scope, canvas.width, canvas.height);
	}
	scope.view.onMouseMove = function(event){ 
		paper = scope;
		mousePos = event.point;
	}
	scope.view.onMouseDown = function(event){
		paper = scope;		
	}
} sequence_folding();
