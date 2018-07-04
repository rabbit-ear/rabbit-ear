var circleStyle = { radius: 0.02, strokeWidth: 0.01, strokeColor: { hue:220, saturation:0.6, brightness:1 } };

var axiom6 = new OrigamiPaper("canvas-axiom-6");
axiom6.setPadding(0.05);

var strokeColors = [axiom6.style.valley.strokeColor,  { hue:20, saturation:0.6, brightness:1 },  { hue:120, saturation:0.6, brightness:1 },  { hue:70, saturation:0.6, brightness:1 }]

axiom6.selectedNode = undefined;
axiom6.decorationLayer = new axiom6.scope.Layer();
axiom6.decorationLayer.activate();
axiom6.marks = [];
for(var i = 0; i < 6; i++) axiom6.marks.push(new axiom6.scope.Shape.Circle(circleStyle));
axiom6.marks[0].position = [0.0, 0.0];
axiom6.marks[1].position = [1.0, 1.0];
axiom6.marks[2].position = [0.0, 0.75];
axiom6.marks[3].position = [1.0, 0.5];
axiom6.marks[4].position = [1.0, 0.25];
axiom6.marks[5].position = [0.5, 0.0];

axiom6.reset = function(){
	axiom6.cp.clear();
	var edge1 = axiom6.cp.creaseThroughPoints(axiom6.marks[0].position, axiom6.marks[1].position).mark();
	var edge2 = axiom6.cp.creaseThroughPoints(axiom6.marks[2].position, axiom6.marks[3].position).mark();
	var newCreases = axiom6.cp.creasePointsToLines(axiom6.marks[4].position, axiom6.marks[5].position, edge1, edge2);
	newCreases.forEach(function(el){ el.valley(); });
	axiom6.draw();
	
	for (var i = 0; i < newCreases.length; ++i) {
		axiom6.edges[ newCreases[i].index ].strokeColor = strokeColors[i];
		
		// algorithm helper visuals
		for (var j = 0; j <= 1; ++j) {
			var perp = new Line(axiom6.marks[j + 4].position, newCreases[i].vector().rotate90());
			var line = new Edge(axiom6.marks[2 * j].position, axiom6.marks[2 * j + 1].position);
			var marker = perp.intersection(line);
			if (marker != undefined) {
				var circle = new axiom6.scope.Shape.Circle({
					center: [marker.x, marker.y], radius: 0.02, strokeWidth:0.01,
					strokeColor: strokeColors[i]
				});
				circle.strokeColor.alpha = 0.5;
			}
		}
	}
}
axiom6.reset();

axiom6.onFrame = function(event) { }
axiom6.onResize = function(event) { }
axiom6.onMouseMove = function(event) {
	if(axiom6.selectedNode != undefined){
		axiom6.selectedNode.position = event.point;
		axiom6.reset();		
	}
}
axiom6.onMouseDown = function(event){
	for(var i = 0; i < axiom6.marks.length; i++){
		if(pointsSimilar(event.point, axiom6.marks[i].position, 0.05)){ axiom6.selectedNode = axiom6.marks[i];return;}
	}
	axiom6.selectedNode = undefined;
}
axiom6.onMouseUp = function(event){ axiom6.selectedNode = undefined; }
