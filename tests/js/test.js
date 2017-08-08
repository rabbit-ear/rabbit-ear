function test_js(){
	var canvas = document.getElementById('canvas-test');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height, 0.5);

	var cp = new CreasePattern();
	cp.nodes = [];
	cp.edges = [];
	cp.boundary = [];
	// cp.birdBase();

	var nearestEdge = undefined;
	var nearestNode = undefined;

	cp.newPlanarEdge(0.5, 0.0, 0.5, 1.0);
	cp.newPlanarEdge(0.5, 0.5, 1.0, 0.5);
	// cp.newPlanarEdge(0.5, 0.5, 0.0, 0.5);

	cp.chop();
	cp.clean();
	cp.chop();
	cp.clean();

	var paperCP = new PaperCreasePattern(scope, cp);
	paperCP.initialize();

	var nodeCircle = new paper.Shape.Circle({
		center: [0, 0],
		radius: 0.03,
		fillColor: { hue:0, saturation:0.8, brightness:1 }//{ hue:130, saturation:0.8, brightness:0.7 }
	});

	scope.view.onFrame = function(event) { }
	scope.view.onResize = function(event) {
		paper = scope;
		zoomView(scope, canvas.width, canvas.height, 0.5);
	}
	scope.view.onMouseMove = function(event) {
		mousePos = event.point;
		var nNode = cp.getNearestNode( mousePos.x, mousePos.y );
		var nEdge = cp.getNearestEdge( mousePos.x, mousePos.y ).edge;
		if(nearestNode != nNode){
			nearestNode = nNode;
			nodeCircle.position.x = cp.nodes[nearestNode].x;
			nodeCircle.position.y = cp.nodes[nearestNode].y;
			// console.log("Node: " + nearestNode);
		}
		if(nearestEdge != nEdge){
			nearestEdge = nEdge;
			for(var i = 0; i < cp.edges.length; i++){
				var weight = 3;
				if(nearestEdge != undefined && nearestEdge == i){
					paperCP.edges[i].strokeWidth = paperCP.lineWeight*2;
					// paperCP.edges[i].strokeColor = { hue:0, saturation:0.8, brightness:1 };
				} else{
					paperCP.edges[i].strokeWidth = paperCP.lineWeight;
					// paperCP.edges[i].strokeColor = { hue:0, saturation:0, brightness:0 };
				}
			}
			// console.log("Edge: " + nearestEdge);
		}
	}
	scope.view.onMouseDown = function(event){
		paper = scope;
		var endpoints = cp.edges[nearestEdge].endPoints();
		console.log(endpoints[0].x + ", " + endpoints[0].y + ", " + endpoints[1].x + ", " + endpoints[1].y);
	}
} test_js();
