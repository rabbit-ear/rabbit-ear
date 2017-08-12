var circleStyle = { radius: 0.02, strokeWidth: 0.01, strokeColor: { hue:220, saturation:0.6, brightness:1 } };

var axiom7 = new PaperCreasePattern("canvas-axiom-7");
axiom7.zoomToFit(0.05);

axiom7.selectedNode = undefined;
axiom7.decorationLayer = new axiom7.scope.Layer();
axiom7.decorationLayer.activate();
axiom7.marks = [];
for(var i = 0; i < 5; i++) axiom7.marks.push(new axiom7.scope.Shape.Circle(circleStyle));
axiom7.marks[0].position = [0.5, 0.0];
axiom7.marks[1].position = [1.0, 1.0];
axiom7.marks[2].position = [0.0, 0.75];
axiom7.marks[3].position = [1.0, 0.75];
axiom7.marks[4].position = [0.5, 0.5];

axiom7.reset = function(){
	axiom7.cp.clear();
	var crease1 = axiom7.cp.creaseThroughPoints(axiom7.marks[0].position, axiom7.marks[1].position).mountain();
	var crease2 = axiom7.cp.creaseThroughPoints(axiom7.marks[2].position, axiom7.marks[3].position).mountain();
	axiom7.cp.creasePerpendicularPointOntoLine(axiom7.marks[4].position, crease1, crease2).valley();
	axiom7.initialize();
}
axiom7.reset();

axiom7.onFrame = function(event) { }
axiom7.onResize = function(event) { }
axiom7.onMouseMove = function(event) {
	if(axiom7.selectedNode != undefined){
		axiom7.selectedNode.position = event.point;
		axiom7.reset();		
	}
}
axiom7.onMouseDown = function(event){
	for(var i = 0; i < axiom7.marks.length; i++){
		if(pointsSimilar(event.point, axiom7.marks[i].position)){ axiom7.selectedNode = axiom7.marks[i];return;}
	}
	axiom7.selectedNode = undefined;
}
axiom7.onMouseUp = function(event){ axiom7.selectedNode = undefined; }
