var circleStyle = { radius: 0.02, strokeWidth: 0.01, strokeColor: { hue:220, saturation:0.6, brightness:1 } };

var axiom2 = new OrigamiPaper("canvas-axiom-2");
axiom2.setPadding(0.05);

axiom2.selectedNode = undefined;
axiom2.decorationLayer = new axiom2.scope.Layer();
axiom2.decorationLayer.activate();
axiom2.marks = [];
for(var i = 0; i < 2; i++) axiom2.marks.push(new axiom2.scope.Shape.Circle(circleStyle));
axiom2.marks[0].position = [0.0, 0.0];
axiom2.marks[1].position = [1.0, 1.0];

axiom2.reset = function(){
	axiom2.cp.clear();
	axiom2.cp.creasePointToPoint(axiom2.marks[0].position, axiom2.marks[1].position).valley();
	axiom2.draw();
}
axiom2.reset();

axiom2.onFrame = function(event) { }
axiom2.onResize = function(event) { }
axiom2.onMouseMove = function(event) {
	if(axiom2.selectedNode != undefined){
		axiom2.selectedNode.position = event.point;
		axiom2.reset();
	}
}
axiom2.onMouseDown = function(event){
	for(var i = 0; i < axiom2.marks.length; i++){
		if(pointsSimilar(event.point, axiom2.marks[i].position)){ axiom2.selectedNode = axiom2.marks[i];return;}
	}
	axiom2.selectedNode = undefined;
}
axiom2.onMouseUp = function(event){ axiom2.selectedNode = undefined; }
