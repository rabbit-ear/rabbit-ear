
function full_screen_sketch(){
	var canvas = document.getElementById('canvas-full-screen');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height, 0.0);

	var cp = new PlanarGraph();
	var paperCP = new OrigamiPaper(scope, cp);

	var mouseNodeLayer = new paper.Layer();
	mouseNodeLayer.activate();
	mouseNodeLayer.removeChildren();
	var nodeCircle = new paper.Shape.Circle({
		center: [0, 0],
		radius: 0.01,
		fillColor: { hue:0, saturation:0.8, brightness:1 }//{ hue:130, saturation:0.8, brightness:0.7 }
	});

	function resetCP(){
		var aspect = canvas.width / canvas.height;
		cp.clear();
		cp.newPlanarEdge(0.0, 0.0, 1.0 * aspect, 1.0);
		cp.newPlanarEdge(0.0, 1.0, 1.0 * aspect, 0.0);
		var crossings = cp.fragment();
		paperCP.initialize();
	}
	resetCP();

	scope.view.onFrame = function(event){ }
	scope.view.onResize = function(event){
		paper = scope;
		resetCP();
		zoomView(scope, canvas.width, canvas.height, 0.0);
	}
	scope.view.onMouseMove = function(event){ 
		mousePos = event.point;
		if(mousePos != undefined){
			nodeCircle.position.x = mousePos.x;
			nodeCircle.position.y = mousePos.y;
		}
	}

	scope.view.onMouseDown = function(event){
		paper = scope;
		resetCP();
	}

}  full_screen_sketch();