function merge_node_sketch(){
	var canvas = document.getElementById('canvas-merge-node-check');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height, 0.5);

	var cp = new CreasePattern();
	var paperCP = new PaperCreasePattern(scope, cp);

	var nodeLayer = new scope.Layer();

	function init(){
		loadSVG("/tests/svg/sea-turtle-base.svg", function(e){ 
			cp = e;
			paperCP = new PaperCreasePattern(scope, cp);
			nodeLayer.bringToFront();
			for(var i = 0; i < cp.nodes.length; i++){
				var nodeCircle = new scope.Shape.Circle({
					center: [cp.nodes[i].x, cp.nodes[i].y],
					radius: 0.03,
					fillColor: { hue:220, saturation:0.8, brightness:1, alpha:0.2 }
				});
			}
		});
	} 
	init();

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
} merge_node_sketch();
