
var fishSwim = new OrigamiPaper("canvas-fish-base-wobble").blackAndWhite();
fishSwim.setPadding(0.05);

fishSwim.reset = function(){
	fishSwim.cp.clear();
	fishSwim.cp.fishBase();
	fishSwim.wobble2 = {x:fishSwim.cp.nodes[7].x, y:fishSwim.cp.nodes[7].y};
	fishSwim.wobble3 = {x:fishSwim.cp.nodes[6].x, y:fishSwim.cp.nodes[6].y};
	fishSwim.draw();
	fishSwim.faceLayer.visible = false;
	// for(var j = 0; j < fishSwim.faceLayer.children.length; j++){
	// 	fishSwim.faceLayer.children[j].fillColor.alpha = 0.001;
	// }
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
	// var hitResult = fishSwim.faceLayer.hitTest(event.point);
	// if(hitResult != null && hitResult.item != null){
	// 	hitResult.item.fillColor.alpha = 0.2;
	// }
}