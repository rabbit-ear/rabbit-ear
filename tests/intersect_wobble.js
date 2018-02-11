var wobble_intersections_callback = undefined;

var wobble = new OrigamiPaper("canvas-intersection-wobble", new PlanarGraph());
wobble.setPadding(0.05);

wobble.intersections = [];
wobble.intersectionLayer = new wobble.scope.Layer();

wobble.cpForFaces = new PlanarGraph();
wobble.style.mark.strokeColor = {gray:0.0};

wobble.reset = function(){
	paper = this.scope; 
	var numLines = 9;
	wobble.cp.clear();
	wobble.cp.newNode();
	// var first = {x:Math.random(), y:Math.random(), z:0.0};
	// graph.nodes.push(first);
	for(var i = 0; i < numLines; i++){
		wobble.cp.newPlanarEdgeFromNode(wobble.cp.nodes[i], Math.random(), Math.random());
	}
	wobble.draw();
	for(var i = 0; i < wobble.edgeLayer.children.length; i++){
		wobble.edgeLayer.children[i].strokeColor = {gray:0.0};
	}
	// wobble.nodeLayer.visible = true;
}
wobble.reset();

wobble.onFrame = function(event) { 
	// var centerX = 0.5;//(wobble.canvas.width / wobble.canvas.height) * 0.5;
	var scale = 0.666;
	for(var i = 0; i < wobble.cp.nodes.length; i++){
		var xnoise = p5js.noise(i*31.111+p5js.millis()*0.0002);
		if(xnoise < 0.5) wobble.cp.nodes[i].x = -Math.pow(2*(0.5-xnoise), 0.8)*scale + 0.5;
		else             wobble.cp.nodes[i].x = Math.pow(2*(xnoise-0.5), 0.8)*scale + 0.5;

		wobble.cp.nodes[i].x *= 1.25;

		var ynoise = p5js.noise(i*44.22+10+p5js.millis()*0.0002);
		if(ynoise < 0.5) wobble.cp.nodes[i].y = -Math.pow(2*(0.5-ynoise), 0.8)*scale + 0.5;
		else             wobble.cp.nodes[i].y = Math.pow(2*(ynoise-0.5), 0.8)*scale + 0.5;
		// wobble.cp.nodes[i].y = Math.sqrt(ynoise);
	}

	// wobble.cp.generateFaces();
	// todo: wobble.cpForFaces = wobble.cp.copy()
	// write the duplicate function that does a deep copy
	// wobble.draw();
	// for(var i = 0; i < wobble.edgeLayer.children.length; i++){
	// 	wobble.edgeLayer.children[i].strokeColor = {gray:0.0};
	// }

	wobble.update();

	wobble.intersections = wobble.cp.getEdgeIntersections();

	wobble.intersectionLayer.activate();
	wobble.intersectionLayer.removeChildren();
	for(var i = wobble.intersections.length-1; i >= 0 ; i--){
		new wobble.scope.Shape.Circle({
			position: wobble.intersections[i],
			fillColor: {hue:0, saturation:0.8, brightness:1.0},
			radius: 0.0133
		});
	}
	if(wobble_intersections_callback != undefined){
		wobble_intersections_callback(wobble.intersections);
	}

}

wobble.onResize = function(event) { }
wobble.onMouseDown = function(event){ }
wobble.onMouseUp = function(event){ }
wobble.onMouseMove = function(event) { }
