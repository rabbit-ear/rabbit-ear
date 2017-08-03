function new_sketch(){
	var canvas = document.getElementById('canvas-new');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height, 0.5);

	var cp = new CreasePattern();
	var paperCP = new PaperCreasePattern(scope, cp);

	function init(){
		cp.clear();
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
		// mousePos = event.point;
	}
	scope.view.onMouseDown = function(event){
		paper = scope;
	}
} new_sketch();
