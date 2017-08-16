var circleStyle = { radius: 0.02, strokeWidth: 0.01, strokeColor: { hue:220, saturation:0.6, brightness:1 } };

var axiom3 = new PaperCreasePattern("canvas-axiom-3");
axiom3.zoomToFit(0.05);

axiom3.selectedNode = undefined;
axiom3.decorationLayer = new axiom3.scope.Layer();
axiom3.decorationLayer.activate();
axiom3.marks = [];
for(var i = 0; i < 4; i++) axiom3.marks.push(new axiom3.scope.Shape.Circle(circleStyle));
// axiom3.marks[0].position = [0.5, 0.0];
// axiom3.marks[1].position = [0.0, 0.5];
// axiom3.marks[2].position = [1.0, 0.5];
// axiom3.marks[3].position = [0.5, 1.0];
axiom3.marks[0].position = [0.0, 0.0];
axiom3.marks[1].position = [1.0, 1.0];
axiom3.marks[2].position = [0.25, 0.5];
axiom3.marks[3].position = [1.0, 0.5];

axiom3.reset = function(){
	axiom3.cp.clear();
	var edgeA = axiom3.cp.creaseThroughPoints(axiom3.marks[0].position, axiom3.marks[1].position).mark();
	var edgeB = axiom3.cp.creaseThroughPoints(axiom3.marks[2].position, axiom3.marks[3].position).mark();
	var edges = axiom3.cp.creaseEdgeToEdge(edgeA, edgeB);
	edges.forEach(function(el){el.valley();});
	axiom3.initialize();
	if(edges.length >= 2){
		axiom3.edges[edges[1].index].strokeColor = { hue:20, saturation:0.6, brightness:1 };
	}
}
axiom3.reset();

axiom3.onFrame = function(event) { }
axiom3.onResize = function(event) { }
axiom3.onMouseMove = function(event) {
	if(axiom3.selectedNode != undefined){
		axiom3.selectedNode.position = event.point;
		axiom3.reset();		
	}
}
axiom3.onMouseDown = function(event){
	for(var i = 0; i < axiom3.marks.length; i++){
		if(pointsSimilar(event.point, axiom3.marks[i].position)){ axiom3.selectedNode = axiom3.marks[i];return;}
	}
	axiom3.selectedNode = undefined;
}
axiom3.onMouseUp = function(event){ axiom3.selectedNode = undefined; }
