// generate faces

edge_intersections_callback = undefined;

function edge_intersections(){
	var canvas = document.getElementById('canvas-intersections');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height, 0.0);

	var cp = new CreasePattern();

	var paperCP = new PaperCreasePattern(scope, cp);

	var NUM_LINES = 30;

	var nearestEdge = undefined;
	var nearestNode = undefined;

	var intersectionsLayer = new scope.Layer();

	function resetCP(){
		var aspect = canvas.width / canvas.height;
		cp.clear();
		cp.rectangle(aspect, 1.0);
		for(var i = 0; i < NUM_LINES; i++){
			var angle = Math.random()*Math.PI*2;
			cp.creaseRay(new XYPoint(Math.random() * aspect, Math.random()), new XYPoint(Math.cos(angle), Math.sin(angle)));
		}
		var intersections = cp.chop();
		paperCP.initialize();
		paperCP.nodeLayer.bringToFront();

		// make all the nodes invisible
		for(var i = 0; i < paperCP.nodes.length; i++){ paperCP.nodes[i].visible = false; }

		intersectionsLayer.activate();
		intersectionsLayer.removeChildren();
		for(var i = 0; i < intersections.length; i++){
			var nodeCircle = new paper.Shape.Circle({
				center: [intersections[i].x, intersections[i].y],
				radius: 0.01,
				fillColor: { hue:220, saturation:0.6, brightness:0.8 }//{ hue:130, saturation:0.8, brightness:0.7 }
			});
		}
		nearestEdge = undefined;
		nearestNode = undefined;
		if(edge_intersections_callback != undefined){ edge_intersections_callback(intersections); }
	}
	resetCP();

	scope.view.onFrame = function(event){ }
	scope.view.onResize = function(event){
		paper = scope;
		resetCP();
		zoomView(scope, canvas.width, canvas.height, 0.0);
	}
	scope.view.onMouseMove = function(event){ 
		paper = scope;
		mousePos = event.point;
		var nNode = cp.getNearestNode( mousePos.x, mousePos.y );
		var nEdge = cp.getNearestEdge( mousePos.x, mousePos.y ).edge;
		if(nearestNode !== nNode){
			paperCP.nodes[nNode.index].visible = true;
			if(nearestNode != undefined){ paperCP.nodes[nearestNode.index].visible = false; }
			nearestNode = nNode;
		}
		if(nearestEdge !== nEdge){
			nearestEdge = nEdge;
			for(var i = 0; i < cp.edges.length; i++){
				if(nearestEdge != undefined && nearestEdge === cp.edges[i]){
					paperCP.edges[i].strokeColor = { hue:0, saturation:0.8, brightness:1 };
				} else{
					paperCP.edges[i].strokeColor = paperCP.styleForCrease(cp.edges[i].orientation).strokeColor;
				}
			}
		}
	}

	scope.view.onMouseDown = function(event){
		paper = scope;
		resetCP();
	}

} edge_intersections();