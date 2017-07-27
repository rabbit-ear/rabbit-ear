var fishCP = new CreasePattern();
// fish base, wobble
function fish_base_wobble(){
	var canvas = document.getElementById('canvas-fish-base-wobble');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height, 0.5);

	fishCP.fishBase();
	var paperCP = new PaperCreasePattern(scope, fishCP);
	var wobble2 = {x:fishCP.nodes[6].x, y:fishCP.nodes[6].y};
	var wobble3 = {x:fishCP.nodes[7].x, y:fishCP.nodes[7].y};

	scope.view.onFrame = function(event) {
		var scale = .02;
		var sp = 1.5;
		fishCP.nodes[6].x = wobble2.x + Math.sin(sp*event.time*.8) * scale
		fishCP.nodes[6].y = wobble2.y + Math.cos(sp*event.time*.895) * scale;
		fishCP.nodes[7].x = wobble3.x + Math.sin(sp*event.time*1.2) * scale;
		fishCP.nodes[7].y = wobble3.y + Math.sin(sp*event.time) * scale;
		paperCP.update();
	}

	scope.view.onResize = function(event) {
		zoomView(scope, canvas.width, canvas.height, 0.5);
	}

	scope.view.onMouseMove = function(event) {
		mousePos = event.point;
	}
} fish_base_wobble();