var circleStyle = { radius: 0.02, strokeWidth: 0.01, strokeColor: { hue:220, saturation:0.6, brightness:1 } };

var axiom4 = new OrigamiPaper("canvas-axiom-4");
axiom4.zoomToFit(0.05);

axiom4.selectedNode = undefined;
axiom4.decorationLayer = new axiom4.scope.Layer();
axiom4.decorationLayer.activate();
axiom4.marks = [];
for(var i = 0; i < 3; i++) axiom4.marks.push(new axiom4.scope.Shape.Circle(circleStyle));
axiom4.marks[0].position = [0.0, 0.0];
axiom4.marks[1].position = [1.0, 1.0];
axiom4.marks[2].position = [1.0, 0.5];

axiom4.reset = function(){
	axiom4.cp.clear();
	var edge = axiom4.cp.creaseThroughPoints(axiom4.marks[0].position, axiom4.marks[1].position).mark();
	axiom4.cp.creasePerpendicularThroughPoint(edge, axiom4.marks[2].position).valley();
	axiom4.initialize();
}
axiom4.reset();

axiom4.onFrame = function(event) { }
axiom4.onResize = function(event) { }
axiom4.onMouseMove = function(event) {
	if(axiom4.selectedNode != undefined){
		axiom4.selectedNode.position = event.point;
		axiom4.reset();
	}
}
axiom4.onMouseDown = function(event){
	for(var i = 0; i < axiom4.marks.length; i++){
		if(pointsSimilar(event.point, axiom4.marks[i].position)){ axiom4.selectedNode = axiom4.marks[i];return;}
	}
	axiom4.selectedNode = undefined;
}
axiom4.onMouseUp = function(event){ axiom4.selectedNode = undefined; }
