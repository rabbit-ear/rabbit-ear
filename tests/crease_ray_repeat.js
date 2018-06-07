var creaseRayRepeatCallback = undefined;
var creaseRayRepeat = new OrigamiPaper("canvas-crease-ray-repeat");

creaseRayRepeat.reset = function(){
	this.cp.clear();
	this.marks = [];
	for(var i = 0; i < 5; i++){ this.marks.push( new Edge(Math.random(), 0, Math.random(), 1) ); }
	this.draw();
	[new XY(0.1, 0.4+Math.random()*0.2),
	 new XY(0.9, 0.4+Math.random()*0.2)].forEach(function(point){
		this.makeTouchPoint(point, {radius:0.015,strokeWidth:0.01,strokeColor:{gray:0.0},fillColor:{gray:1.0}});
	},this);
}
creaseRayRepeat.reset();

creaseRayRepeat.updateCreases = function(){
	this.cp.clear();
	for(var i = 0; i < this.marks.length; i++){
		var crease = this.cp.crease(this.marks[i]);
		if(crease !== undefined){ crease.mark(); }
	}
	var vector = new XY(this.touchPoints[1].position.x-this.touchPoints[0].position.x, 
	                    this.touchPoints[1].position.y-this.touchPoints[0].position.y );
	this.cp.creaseRayRepeat(new Ray(this.touchPoints[0].position, vector)).forEach(function(crease){
		if(crease !== undefined){
			crease.valley();
		}
	},this);
	this.draw();
	if(creaseRayRepeatCallback !== undefined){
		creaseRayRepeatCallback({'points':[this.touchPoints[0].position, vector]});
	}
}
creaseRayRepeat.updateCreases();

creaseRayRepeat.onFrame = function(event){ }
creaseRayRepeat.onResize = function(event){ }
creaseRayRepeat.onMouseDown = function(event){ }
creaseRayRepeat.onMouseUp = function(event){ }
creaseRayRepeat.onMouseMove = function(event){ if(this.mouse.isDragging){ this.updateCreases(); } }
