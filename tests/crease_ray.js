var creaseRayCallback = undefined;
var creaseRay = new OrigamiPaper("canvas-crease-ray");

creaseRay.reset = function(){
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
creaseRay.reset();

creaseRay.updateCreases = function(){
	paper = this.scope;
	this.cp.clear();
	var vector = new XY(this.touchPoints[1].position.x-this.touchPoints[0].position.x, 
	                    this.touchPoints[1].position.y-this.touchPoints[0].position.y );
	var crease = this.cp.creaseRay(this.touchPoints[0].position, vector);
	if(crease != undefined){ crease.valley(); }
	this.draw();
	if(creaseRayCallback !== undefined){
		creaseRayCallback({'points':[this.touchPoints[0].position, vector]});
	}
}
creaseRay.updateCreases();

creaseRay.onFrame = function(event){ }
creaseRay.onResize = function(event){ }
creaseRay.onMouseDown = function(event){ }
creaseRay.onMouseUp = function(event){ }
creaseRay.onMouseMove = function(event){ if(this.mouse.isDragging){ this.updateCreases(); } }
