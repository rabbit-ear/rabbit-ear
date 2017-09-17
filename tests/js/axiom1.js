var circleStyle = { radius: 0.02, strokeWidth: 0.01, strokeColor: { hue:220, saturation:0.6, brightness:1 } };

var axiom1 = new OrigamiPaper("canvas-axiom-1");
axiom1.zoomToFit(0.05);

axiom1.selectedNode = undefined;
axiom1.decorationLayer = new axiom1.scope.Layer();
axiom1.decorationLayer.activate();
axiom1.marks = [];
for(var i = 0; i < 2; i++) axiom1.marks.push(new axiom1.scope.Shape.Circle(circleStyle));
axiom1.marks[0].position = [0.0, 0.0];
axiom1.marks[1].position = [1.0, 1.0];

axiom1.reset = function(){
	axiom1.cp.clear();
	axiom1.cp.creaseThroughPoints(axiom1.marks[0].position, axiom1.marks[1].position).valley();
	axiom1.init();
}
axiom1.reset();

axiom1.onFrame = function(event) { }
axiom1.onResize = function(event) { }
axiom1.onMouseMove = function(event) {
	if(axiom1.selectedNode != undefined){
		axiom1.selectedNode.position = event.point;
		axiom1.reset();
	}
}
axiom1.onMouseDown = function(event){
	for(var i = 0; i < axiom1.marks.length; i++){
		if(pointsSimilar(event.point, axiom1.marks[i].position)){ axiom1.selectedNode = axiom1.marks[i];return;}
	}
	axiom1.selectedNode = undefined;
}
axiom1.onMouseUp = function(event){ axiom1.selectedNode = undefined; }
