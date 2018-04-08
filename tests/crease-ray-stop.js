var creaseRayStopCallback = undefined;
var creaseRayStop = new OrigamiPaper("canvas-crease-ray-stop");

creaseRayStop.reset = function(){
	this.cp.clear();
	// reset boundary
	var boundaryPoints = [];
	for(var i = 0; i < 50; i++){ boundaryPoints.push(new XY(Math.random(), Math.random()));}
	this.cp.setBoundary(boundaryPoints);
	this.marks = [];
	for(var i = 0; i < 5; i++){ this.marks.push( new Edge(Math.random(), 0, Math.random(), 1) ); }
	this.draw();

	this.makeControlPoints(2, {radius:0.015,strokeWidth:0.01,strokeColor:{gray:0.0},fillColor:{gray:1.0}});
	for(var i = 0; i < this.selectable.length; i++){
		do{ this.selectable[i].position = new XY(Math.random(), Math.random());
		}while(!this.cp.boundary.contains(this.selectable[i].position));
	}
}
creaseRayStop.reset();

creaseRayStop.updateCreases = function(){
	this.cp.clear();
	for(var i = 0; i < this.marks.length; i++){
		var crease = this.cp.crease(this.marks[i]);
		if(crease !== undefined){ crease.mark(); }
	}
	var vector = new XY(this.selectable[1].position.x-this.selectable[0].position.x, 
	                    this.selectable[1].position.y-this.selectable[0].position.y );
	this.cp.creaseRayUntilIntersection(new Ray(this.selectable[0].position, vector)).valley();
	this.draw();
	if(creaseRayStopCallback !== undefined){
		creaseRayStopCallback({'points':[this.selectable[0].position, vector]});
	}
}
creaseRayStop.updateCreases();

creaseRayStop.onFrame = function(event){ }
creaseRayStop.onResize = function(event){ }
creaseRayStop.onMouseDown = function(event){ }
creaseRayStop.onMouseUp = function(event){ }
creaseRayStop.onMouseMove = function(event){ if(this.mouse.isDragging){ this.updateCreases(); } }
