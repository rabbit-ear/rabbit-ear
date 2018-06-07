var creaseRayStopCallback = undefined;
var creaseRayStop = new OrigamiPaper("canvas-crease-ray-stop");

creaseRayStop.reset = function(){
	this.cp.clear();
	this.marks = [];
	for(var i = 0; i < 3; i++){ this.marks.push( new Edge(0.2+0.6*Math.random(), 0, 0.2+0.6*Math.random(), 1) ); }
	this.draw();
	[new XY(0.1, 0.4+Math.random()*0.2),
	 new XY(0.9, 0.4+Math.random()*0.2)].forEach(function(point){
		this.makeTouchPoint(point, {radius:0.015,strokeWidth:0.01,strokeColor:{gray:0.0},fillColor:{gray:1.0}});
	},this);
}
creaseRayStop.reset();

creaseRayStop.updateCreases = function(){
	this.cp.clear();
	for(var i = 0; i < this.marks.length; i++){
		var crease = this.cp.crease(this.marks[i]);
		if(crease !== undefined){ crease.mark(); }
	}
	var vector = new XY(this.touchPoints[1].position.x-this.touchPoints[0].position.x, 
	                    this.touchPoints[1].position.y-this.touchPoints[0].position.y );
	var crease = this.cp.creaseRayUntilIntersection(new Ray(this.touchPoints[0].position, vector));
	if(crease != undefined){ crease.valley(); }
	this.draw();
	if(creaseRayStopCallback !== undefined){
		creaseRayStopCallback({'points':[this.touchPoints[0].position, vector]});
	}
}
creaseRayStop.updateCreases();

creaseRayStop.onFrame = function(event){ }
creaseRayStop.onResize = function(event){ }
creaseRayStop.onMouseDown = function(event){ }
creaseRayStop.onMouseUp = function(event){ }
creaseRayStop.onMouseMove = function(event){ if(this.mouse.isDragging){ this.updateCreases(); } }
