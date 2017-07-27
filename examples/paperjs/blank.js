// generate faces

function fillCanvasWithCP(canvasName, cp){
	var canvas = document.getElementById(canvasName);
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height, 0.5);

	var paperCP = new PaperCreasePattern(scope, cp);

	scope.view.onFrame = function(event){ }
	scope.view.onResize = function(event){
		paper = scope;
		zoomView(scope, canvas.width, canvas.height, 0.5);
	}
	scope.view.onMouseMove = function(event){ }

	scope.view.onMouseDown = function(event){
		paper = scope;		
	}

}