function kawasaki_sketch(){
	var canvas = document.getElementById('canvas-kawasaki');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height, 0.5);

	var cp = new CreasePattern();

	cp.addEdgeWithVertices(.35995, .34829, .35995, .01228);
	cp.addEdgeWithVertices(.35995, .34829, .02393, .01228);
	cp.addEdgeWithVertices(.35995, .34829, .97391, .96248);
	cp.addEdgeWithVertices(.35995, .34829, .61437, .96248);
	cp.addEdgeWithVertices(.35995, .34829, .97391, .6026);
	cp.addEdgeWithVertices(.35995, .34829, .35995, .96248);
	cp.addEdgeWithVertices(.35995, .34829, .02393, .48738);
	cp.addEdgeWithVertices(.35995, .34829, .10552, .96248);
	cp.addEdgeWithVertices(.35995, .34829, .59738, .01228);
	cp.addEdgeWithVertices(.35995, .34829, .97391, .27863);
	cp.clean();
	console.log(cp);
	var adjacent = cp.nodes[4].planarAdjacent();
	console.log(adjacent);

	var paperCP = new PaperCreasePattern(scope, cp);

	scope.view.onFrame = function(event) { }
	scope.view.onResize = function(event) {
		paper = scope;
		zoomView(scope, canvas.width, canvas.height, 0.5);
	}
	scope.view.onMouseMove = function(event) {
		mousePos = event.point;
	}
	scope.view.onMouseDown = function(event){
		paper = scope;		
	}
} kawasaki_sketch();