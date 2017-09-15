var reflexMatrixCallback = undefined;

var circleStyle = { radius: 0.02, strokeWidth: 0.01, strokeColor: { hue:220, saturation:0.6, brightness:1 } };

var reflex = new OrigamiPaper("canvas-reflection");
// reflex.zoomToFit(0.0);

reflex.selectedNode = undefined;
reflex.decorationLayer = new reflex.scope.Layer();
reflex.decorationLayer.activate();
reflex.marks = [];
for(var i = 0; i < 2; i++) reflex.marks.push(new reflex.scope.Shape.Circle(circleStyle));

var testPoints = [];

var passed = true;
do{
	passed = true;
	testPoints[0] = new XY( (Math.random()*0.8) + 0.1, (Math.random()*0.8) + 0.1 );
	testPoints[1] = new XY( (Math.random()*0.8) + 0.1, (Math.random()*0.8) + 0.1 );
	testPoints[2] = new XY( (Math.random()*0.8) + 0.1, (Math.random()*0.8) + 0.1 );

	for(var i = 0; i < 3; i++){
		var iPrev = (i+2)%3;
		var iNext = (i+1)%3;
		var angle1 = Math.atan2(testPoints[i].y - testPoints[iPrev].y, testPoints[i].x - testPoints[iPrev].x);
		var angle2 = Math.atan2(testPoints[i].y - testPoints[iNext].y, testPoints[i].x - testPoints[iNext].x);
		var interiorAngle = clockwiseAngleFrom(angle1, angle2);
		if(interiorAngle < 0.4 || interiorAngle > 5.8){
			passed = false;
		}
	}

}while(passed === false);

reflex.marks[0].position = testPoints[0];
reflex.marks[1].position = testPoints[1];



reflex.computeReflection = function(){
	if(this.reflectionLine === undefined) return;
	var m = this.reflectionLine.reflectionMatrix();
	var p1t = testPoints[0].transform(m);
	var p2t = testPoints[1].transform(m);
	var p3t = testPoints[2].transform(m);
	var reflection1 = this.cp.newCrease(p1t.x,p1t.y, p2t.x,p2t.y);
	var reflection2 = this.cp.newCrease(p1t.x,p1t.y, p3t.x,p3t.y);
	var reflection3 = this.cp.newCrease(p2t.x,p2t.y, p3t.x,p3t.y);
	if(reflection1 !== undefined){ reflection1.valley(); }
	if(reflection2 !== undefined){ reflection2.valley(); }
	if(reflection3 !== undefined){ reflection3.valley(); }
	this.initialize();
	for(var i = this.edges.length-3; i < this.edges.length; i++){
		this.edges[i].strokeColor = this.style.mountain.strokeColor;
	}
	if(reflexMatrixCallback != undefined && this.reflectionLine !== undefined){
		reflexMatrixCallback(this.reflectionLine.reflectionMatrix());
	}
}

reflex.reset = function(){
	paper = this.scope; 
	this.cp.clear();
	this.reflectionLine = this.cp.creaseThroughPoints(this.marks[0].position, this.marks[1].
		position);
	if(this.reflectionLine !== undefined){ this.reflectionLine.valley(); }
	this.testLine1 = this.cp.newCrease(testPoints[0].x,testPoints[0].y, testPoints[1].x,testPoints[1].y);
	this.testLine2 = this.cp.newCrease(testPoints[0].x,testPoints[0].y, testPoints[2].x,testPoints[2].y);
	this.testLine3 = this.cp.newCrease(testPoints[1].x,testPoints[1].y, testPoints[2].x,testPoints[2].y);
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
