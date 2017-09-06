var reflexMatrixCallback = undefined;

var circleStyle = { radius: 0.02, strokeWidth: 0.01, strokeColor: { hue:220, saturation:0.6, brightness:1 } };

var reflex = new OrigamiPaper("canvas-reflection");
// reflex.zoomToFit(0.0);

reflex.selectedNode = undefined;
reflex.decorationLayer = new reflex.scope.Layer();
reflex.decorationLayer.activate();
reflex.marks = [];
for(var i = 0; i < 2; i++) reflex.marks.push(new reflex.scope.Shape.Circle(circleStyle));
reflex.marks[0].position = [0.0833, 0.0833];
reflex.marks[1].position = [0.9166, 0.9166];

testPoint1 = new XY(Math.random(),Math.random());
testPoint2 = new XY(Math.random(),Math.random());
testPoint3 = new XY(Math.random(),Math.random());

reflex.computeReflection = function(){
	if(this.reflectionLine === undefined) return;
	var m = this.reflectionLine.reflectionMatrix();
	var p1t = testPoint1.transform(m);
	var p2t = testPoint2.transform(m);
	var p3t = testPoint3.transform(m);
	var reflection1 = this.cp.newCrease(p1t.x,p1t.y, p2t.x,p2t.y);
	var reflection2 = this.cp.newCrease(p1t.x,p1t.y, p3t.x,p3t.y);
	var reflection3 = this.cp.newCrease(p2t.x,p2t.y, p3t.x,p3t.y);
	if(reflection1 !== undefined){ reflection1.valley(); }
	if(reflection2 !== undefined){ reflection2.valley(); }
	if(reflection3 !== undefined){ reflection3.valley(); }
	this.initialize();	
}

reflex.reset = function(){
	this.cp.clear();
	this.reflectionLine = this.cp.creaseThroughPoints(this.marks[0].position, this.marks[1].
		position);
	if(this.reflectionLine !== undefined){ this.reflectionLine.valley(); }
	this.testLine1 = this.cp.newCrease(testPoint1.x,testPoint1.y, testPoint2.x,testPoint2.y);
	this.testLine2 = this.cp.newCrease(testPoint1.x,testPoint1.y, testPoint3.x,testPoint3.y);
	this.testLine3 = this.cp.newCrease(testPoint2.x,testPoint2.y, testPoint3.x,testPoint3.y);
	if(this.testLine1 !== undefined){ this.testLine1.mountain(); }
	if(this.testLine2 !== undefined){ this.testLine2.mountain(); }
	if(this.testLine3 !== undefined){ this.testLine3.mountain(); }
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
	if(reflexMatrixCallback != undefined && this.reflectionLine !== undefined){
		reflexMatrixCallback(this.reflectionLine.reflectionMatrix());
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
}
