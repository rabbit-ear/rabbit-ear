
var fishSwim = new OrigamiPaper("canvas-fish-base-wobble");
fishSwim.zoomToFit(0.05);


fishSwim.reset = function(){
	fishSwim.cp.clear();
	fishSwim.cp.fishBase();
	fishSwim.wobble2 = {x:fishSwim.cp.nodes[7].x, y:fishSwim.cp.nodes[7].y};
	fishSwim.wobble3 = {x:fishSwim.cp.nodes[6].x, y:fishSwim.cp.nodes[6].y};
	fishSwim.initialize();
	// fishSwim.faceLayer.visible = false;
	for(var j = 0; j < fishSwim.faceLayer.children.length; j++){
		fishSwim.faceLayer.children[j].fillColor.alpha = 0.001;
	}
}
fishSwim.reset();

fishSwim.onFrame = function(event) { 
	var scale = .02;
	var sp = 1.5;
	fishSwim.cp.nodes[7].x = fishSwim.wobble2.x + Math.sin(sp*event.time*.8) * scale
	fishSwim.cp.nodes[7].y = fishSwim.wobble2.y + Math.cos(sp*event.time*.895) * scale;
	fishSwim.cp.nodes[6].x = fishSwim.wobble3.x + Math.sin(sp*event.time*1.2) * scale;
	fishSwim.cp.nodes[6].y = fishSwim.wobble3.y + Math.sin(sp*event.time) * scale;
	fishSwim.update();
}
fishSwim.onResize = function(event) { }
fishSwim.onMouseDown = function(event){ }
fishSwim.onMouseUp = function(event){ }
fishSwim.onMouseMove = function(event) {
	for(var j = 0; j < fishSwim.faceLayer.children.length; j++){
		fishSwim.faceLayer.children[j].fillColor.alpha = 0.001;
	}
	var hitResult = fishSwim.faceLayer.hitTest(event.point);
	if(hitResult != null && hitResult.item != null){
		hitResult.item.fillColor.alpha = 0.2;
	}
}


// var fishCP = new CreasePattern();
// // fish base, wobble
// function fish_base_wobble(){
// 	var canvas = document.getElementById('canvas-fish-base-wobble');
// 	var scope = new paper.PaperScope();
// 	// setup paper scope with canvas
// 	scope.setup(canvas);
// 	zoomView(scope, canvas.width, canvas.height);

// 	fishCP.fishBase();
// 	var paperCP = new OrigamiPaper(scope, fishCP);
// 	// paperCP.faceLayer.visible = false;
// 	for(var j = 0; j < paperCP.faceLayer.children.length; j++){
// 		paperCP.faceLayer.children[j].fillColor.alpha = 0.001;
// 	}

// 	var wobble2 = {x:fishCP.nodes[7].x, y:fishCP.nodes[7].y};
// 	var wobble3 = {x:fishCP.nodes[6].x, y:fishCP.nodes[6].y};

// 	scope.view.onFrame = function(event) {
// 		var scale = .02;
// 		var sp = 1.5;
// 		fishCP.nodes[7].x = wobble2.x + Math.sin(sp*event.time*.8) * scale
// 		fishCP.nodes[7].y = wobble2.y + Math.cos(sp*event.time*.895) * scale;
// 		fishCP.nodes[6].x = wobble3.x + Math.sin(sp*event.time*1.2) * scale;
// 		fishCP.nodes[6].y = wobble3.y + Math.sin(sp*event.time) * scale;
// 		paperCP.update();
// 	}

// 	scope.view.onResize = function(event) {
// 		zoomView(scope, canvas.width, canvas.height);
// 	}

// 	scope.view.onMouseMove = function(event) {
// 		mousePos = event.point;

// 		for(var j = 0; j < paperCP.faceLayer.children.length; j++){
// 			paperCP.faceLayer.children[j].fillColor.alpha = 0.001;
// 		}

// 		var hitResult = paperCP.faceLayer.hitTest(event.point);
// 		if(hitResult != null && hitResult.item != null){
// 			hitResult.item.fillColor.alpha = 0.2;
// 		}
// 	}
// } fish_base_wobble();