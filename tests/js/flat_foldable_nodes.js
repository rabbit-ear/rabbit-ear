var flat_foldable_nodes_callback;

function flat_foldable_nodes(){
	var canvas = document.getElementById('canvas-flat-foldable-nodes');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height);

	var cp;
	var paperCP;
	

	loadSVG("/tests/svg/sea-turtle-errors.svg", function(e){ 
		cp = e;
		paperCP = new PaperCreasePattern(scope, cp);

		var nodeLayer = new scope.Layer();
		nodeLayer.activate();
		nodeLayer.removeChildren();
		for(var i = 0; i < cp.nodes.length; i++){
			// console.log(cp.nodes[i].flatFoldable());
			var color = { hue:130, saturation:0.8, brightness:0.7, alpha:0.5 }
			if( !cp.nodes[i].flatFoldable() ){
				color = { hue:0, saturation:0.8, brightness:1, alpha:0.5 }
			}
			var nodeCircle = new scope.Shape.Circle({
				center: [cp.nodes[i].x, cp.nodes[i].y],
				radius: 0.02,
				fillColor: color
			});
		}
		// paperCP.initialize();
	});

	var nearestEdge = undefined;

	scope.view.onFrame = function(event) { }
	scope.view.onResize = function(event) {
		paper = scope;
		zoomView(scope, canvas.width, canvas.height);
	}
	scope.view.onMouseMove = function(event){ 
		mousePos = event.point;
		var nEdge = cp.getNearestEdge( mousePos.x, mousePos.y ).edge;
		// if(nearestEdge !== nEdge){
		// 	nearestEdge = nEdge;
		// 	for(var i = 0; i < cp.edges.length; i++){
		// 		if(nearestEdge != undefined && nearestEdge === cp.edges[i]){
		// 			// paperCP.edges[i].strokeWidth = paperCP.lineWeight*2;
		// 			paperCP.edges[i].strokeColor = { hue:0, saturation:0.8, brightness:1 };
		// 		} else{
		// 			// paperCP.edges[i].strokeWidth = paperCP.lineWeight;
		// 			paperCP.edges[i].strokeColor = paperCP.colorForCrease(cp.edges[i].orientation);
		// 		}
		// 	}
		// }
	}
	scope.view.onMouseDown = function(event){
		paper = scope;		
	}
} flat_foldable_nodes();
