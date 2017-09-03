var reflexMatrixCallback = undefined;

var circleStyle = { radius: 0.02, strokeWidth: 0.01, strokeColor: { hue:220, saturation:0.6, brightness:1 } };

var reflex = new OrigamiPaper("canvas-reflection");
reflex.zoomToFit(0.05);

reflex.selectedNode = undefined;
reflex.decorationLayer = new reflex.scope.Layer();
reflex.decorationLayer.activate();
reflex.marks = [];
for(var i = 0; i < 2; i++) reflex.marks.push(new reflex.scope.Shape.Circle(circleStyle));
reflex.marks[0].position = [0.0, 0.0];
reflex.marks[1].position = [1.0, 1.0];

testPoint1 = new XY(Math.random(),Math.random());
testPoint2 = new XY(Math.random(),Math.random());

reflex.computeReflection = function(){
	// var m = this.reflectMatrix(this.testLine);
	var m = this.reflectMatrix(this.reflectionLine);
	var p1t = m.transform(testPoint1);
	var p2t = m.transform(testPoint2);
	// console.log(p1t);
	// console.log(p2t);
	// console.log(m);

	var reflection = this.cp.crease(p1t, p2t);
	if(reflection !== undefined){ reflection.valley(); }
	this.initialize();	
}

reflex.reflectMatrix = function(symmetryLine){
	var midpoint = symmetryLine.midpoint();
	var angle = symmetryLine.absoluteAngle();
	// console.log(midpoint);
	// console.log(angle);
	var mat = new paper.Matrix(1, 0, 0, 1, 0, 0);
	mat = mat.rotate(angle*180/Math.PI, midpoint);
	mat = mat.scale(1, -1, midpoint);
	mat = mat.rotate(-angle*180/Math.PI, midpoint);
	return mat;
}

reflex.reset = function(){
	this.cp.clear();
	this.reflectionLine = this.cp.creaseThroughPoints(this.marks[0].position, this.marks[1].
		position).valley();
	this.testLine = this.cp.crease(testPoint1, testPoint2).mountain();
	this.computeReflection();
	// this.initialize();
}
reflex.reset();

reflex.onFrame = function(event) { }
reflex.onResize = function(event) { }
reflex.onMouseMove = function(event) {
	if(reflex.selectedNode != undefined){
		reflex.selectedNode.position = event.point;
		reflex.reset();
	}
	this.computeReflection();
	if(reflexMatrixCallback != undefined){
		reflexMatrixCallback(this.reflectMatrix(this.reflectionLine));
	}
}
reflex.onMouseDown = function(event){
	for(var i = 0; i < reflex.marks.length; i++){
		if(pointsSimilar(event.point, reflex.marks[i].position)){ reflex.selectedNode = reflex.marks[i];return;}
	}
	reflex.selectedNode = undefined;
}
reflex.onMouseUp = function(event){ 
	reflex.selectedNode = undefined;
	// this.computeReflection();
}
