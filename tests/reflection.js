var reflexMatrixCallback = undefined;

var circleStyle = { radius: 0.02, strokeWidth: 0.01, strokeColor: { hue:220, saturation:0.6, brightness:1 } };

var reflex = new OrigamiPaper("canvas-reflection");

reflex.selectedNode = undefined;
reflex.decorationLayer = new reflex.scope.Layer();
reflex.decorationLayer.activate();
reflex.marks = [];
for(var i = 0; i < 2; i++) {reflex.marks.push(new reflex.scope.Shape.Circle(circleStyle));}

var rfxTestPoints = [];

var rfxPassed = true;
do{
	rfxPassed = true;
	rfxTestPoints[0] = new XY( (Math.random()*0.8) + 0.1, (Math.random()*0.8) + 0.1 );
	rfxTestPoints[1] = new XY( (Math.random()*0.8) + 0.1, (Math.random()*0.8) + 0.1 );
	rfxTestPoints[2] = new XY( (Math.random()*0.8) + 0.1, (Math.random()*0.8) + 0.1 );
	for(var i = 0; i < 3; i++){
		var iPrev = (i+2)%3;
		var iNext = (i+1)%3;
		var angle1 = Math.atan2(rfxTestPoints[i].y - rfxTestPoints[iPrev].y, rfxTestPoints[i].x - rfxTestPoints[iPrev].x);
		var angle2 = Math.atan2(rfxTestPoints[i].y - rfxTestPoints[iNext].y, rfxTestPoints[i].x - rfxTestPoints[iNext].x);
		var interiorAngle = clockwiseInteriorAngleRadians(angle1, angle2);
		if(interiorAngle < 0.4 || interiorAngle > 5.8){
			rfxPassed = false;
		}
	}
}while(rfxPassed === false);

reflex.marks[0].position = rfxTestPoints[0];
reflex.marks[1].position = rfxTestPoints[1];

// reflex.marks[0].position = new XY(0.2, 0.2);
// reflex.marks[1].position = new XY(0.8, 0.8);

reflex.computeReflection = function(){
	paper = this.scope;
	if(this.reflectionLine === undefined) return;
	var m = this.reflectionLine.reflectionMatrix();
	var p1t = rfxTestPoints[0].transform(m);
	var p2t = rfxTestPoints[1].transform(m);
	var p3t = rfxTestPoints[2].transform(m);
	var reflection1 = this.cp.newCrease(p1t.x,p1t.y, p2t.x,p2t.y);
	var reflection2 = this.cp.newCrease(p1t.x,p1t.y, p3t.x,p3t.y);
	var reflection3 = this.cp.newCrease(p2t.x,p2t.y, p3t.x,p3t.y);
	if(reflection1 !== undefined){ reflection1.valley(); }
	if(reflection2 !== undefined){ reflection2.valley(); }
	if(reflection3 !== undefined){ reflection3.valley(); }
	this.draw();
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
	this.reflectionLine = this.cp.creaseThroughPoints(this.marks[0].position, this.marks[1].position);
	if(this.reflectionLine !== undefined){ this.reflectionLine.valley(); }
	this.testLine1 = this.cp.newCrease(rfxTestPoints[0].x,rfxTestPoints[0].y, rfxTestPoints[1].x,rfxTestPoints[1].y);
	this.testLine2 = this.cp.newCrease(rfxTestPoints[0].x,rfxTestPoints[0].y, rfxTestPoints[2].x,rfxTestPoints[2].y);
	this.testLine3 = this.cp.newCrease(rfxTestPoints[1].x,rfxTestPoints[1].y, rfxTestPoints[2].x,rfxTestPoints[2].y);
	if(this.testLine1 !== undefined){ this.testLine1.mountain(); }
	if(this.testLine2 !== undefined){ this.testLine2.mountain(); }
	if(this.testLine3 !== undefined){ this.testLine3.mountain(); }
	this.computeReflection();
	// this.draw();
}
reflex.reset();
reflex.draw();

reflex.onFrame = function(event) { }
reflex.onResize = function(event) { }
reflex.onMouseMove = function(event) {
	if(this.selectedNode != undefined){
		this.selectedNode.position = event.point;
		this.reset();
	}
	this.computeReflection();
}
reflex.onMouseDown = function(event){
	for(var i = 0; i < this.marks.length; i++){
		if(pointsSimilar(event.point, this.marks[i].position,0.05)){ this.selectedNode = this.marks[i];return;}
	}
	this.selectedNode = undefined;
}
reflex.onMouseUp = function(event){ 
	this.selectedNode = undefined;
}
