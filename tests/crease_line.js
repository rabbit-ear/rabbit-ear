var creaseLineCallback = undefined;
var creaseLine = new OrigamiPaper("canvas-crease-line");

creaseLine.reset = function(){
	this.cp.clear();
	// reset boundary
	var boundaryPoints = [];
	for(var i = 0; i < 30; i++){ boundaryPoints.push(new XY(Math.random(), Math.random()));}
	this.cp.setBoundary(boundaryPoints);
	this.draw();

	[this.cp.boundary.center(),
	 this.cp.boundary.center().add(new XY(Math.random()*0.5-.25, Math.random()*0.5-.25))].forEach(function(point){
		this.makeTouchPoint(point, {radius:0.015,strokeWidth:0.01,strokeColor:{gray:0.0},fillColor:{gray:1.0}});
	 },this);
}
creaseLine.reset();

creaseLine.updateCreases = function(){
	paper = this.scope;
	this.cp.clear();
	var crease = this.cp.creaseThroughPoints(this.touchPoints[0].position, this.touchPoints[1].position);
	if(crease != undefined){ crease.valley(); }
	this.draw();
	if(creaseLineCallback !== undefined){
		creaseLineCallback({'points':[this.touchPoints[0].position, this.touchPoints[1].position]});
	}
}
creaseLine.updateCreases();

creaseLine.onFrame = function(event){ }
creaseLine.onResize = function(event){ }
creaseLine.onMouseDown = function(event){ }
creaseLine.onMouseUp = function(event){ }
creaseLine.onMouseMove = function(event){ if(this.mouse.isDragging){ this.updateCreases(); } }
