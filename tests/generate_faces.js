// generate faces

function node_adjacent_faces(){
	var canvas = document.getElementById('canvas-generate-faces');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height);

	var cp = new CreasePattern();
	cp.birdBase();
	cp.generateFaces();
	var paperCP = new OrigamiPaper(scope, cp);

	scope.view.onFrame = function(event){ }
	scope.view.onResize = function(event){
		paper = scope;
		zoomView(scope, canvas.width, canvas.height);
	}
	scope.view.onMouseMove = function(event){ }

	scope.view.onMouseDown = function(event){
		paper = scope;		
	}

} node_adjacent_faces();