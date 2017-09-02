var circleStyle = { radius: 0.02, strokeWidth: 0.01, strokeColor: { hue:220, saturation:0.6, brightness:1 } };

var axiom5 = new OrigamiPaper("canvas-axiom-5");
axiom5.zoomToFit(0.05);

axiom5.selectedNode = undefined;
axiom5.decorationLayer = new axiom5.scope.Layer();
axiom5.decorationLayer.activate();
axiom5.marks = [];
for(var i = 0; i < 4; i++) axiom5.marks.push(new axiom5.scope.Shape.Circle(circleStyle));
// axiom5.marks[0].position = [0.0, 0.0];
// axiom5.marks[1].position = [1.0, 1.0];
// axiom5.marks[2].position = [0.7071, 1.0-0.7071];
// axiom5.marks[3].position = [1.0, 0.0];
axiom5.marks[0].position = [0.0, 0.0];
axiom5.marks[1].position = [1.0, 1.0];
axiom5.marks[2].position = [1.0, 0.25];
axiom5.marks[3].position = [0.5, 0.0];

axiom5.reset = function(){
	axiom5.cp.clear();
	var edge = axiom5.cp.creaseThroughPoints(axiom5.marks[0].position, axiom5.marks[1].position).mark();
	var newCreases = axiom5.cp.creasePointToLine(axiom5.marks[2].position, axiom5.marks[3].position, edge);
	newCreases.forEach(function(el){ el.valley(); });
	axiom5.initialize();
	if(newCreases.length >= 2){
		axiom5.edges[ newCreases[1].index ].strokeColor = { hue:20, saturation:0.6, brightness:1 };
	}
	// algorithm helper visuals
	var radius = Math.sqrt( Math.pow(axiom5.marks[3].position.x - axiom5.marks[2].position.x,2) + Math.pow(axiom5.marks[3].position.y - axiom5.marks[2].position.y,2));
	var markers = circleLineIntersectionAlgorithm(axiom5.marks[2].position, radius, axiom5.marks[0].position, axiom5.marks[1].position);
	if(markers.length >= 2){
		var circle1 = new axiom5.scope.Shape.Circle({
			center: [markers[0].x, markers[0].y], radius: 0.02, strokeWidth:0.01,
			strokeColor: axiom5.style.valley.strokeColor//{ hue:130, saturation:0.8, brightness:0.7 }
		});
		var circle2 = new axiom5.scope.Shape.Circle({
			center: [markers[1].x, markers[1].y], radius: 0.02, strokeWidth:0.01,
			strokeColor: { hue:20, saturation:0.6, brightness:1 }
		});
		circle1.strokeColor.alpha = 0.5;
		circle2.strokeColor.alpha = 0.5;
	}

}
axiom5.reset();

axiom5.onFrame = function(event) { }
axiom5.onResize = function(event) { }
axiom5.onMouseMove = function(event) {
	if(axiom5.selectedNode != undefined){
		axiom5.selectedNode.position = event.point;
		axiom5.reset();		
	}
}
axiom5.onMouseDown = function(event){
	for(var i = 0; i < axiom5.marks.length; i++){
		if(pointsSimilar(event.point, axiom5.marks[i].position)){ axiom5.selectedNode = axiom5.marks[i];return;}
	}
	axiom5.selectedNode = undefined;
}
axiom5.onMouseUp = function(event){ axiom5.selectedNode = undefined; }
