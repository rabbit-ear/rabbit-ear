var creaseRayCallback = undefined;
var creaseRay = new OrigamiPaper("canvas-crease-ray");

creaseRay.reset = function(){
	this.cp.clear();
	// reset boundary
	var boundaryPoints = [];
	for(var i = 0; i < 30; i++){ boundaryPoints.push(new XY(Math.random(), Math.random()));}
	this.cp.setBoundary(boundaryPoints);
	this.draw();

	this.makeControlPoints(2, {radius:0.015,strokeWidth:0.01,strokeColor:{gray:0.0},fillColor:{gray:1.0}});
	var center = this.cp.boundary.center();
	for(var i = 0; i < this.selectable.length; i++){
		do{ this.selectable[i].position = center.add(new XY(Math.random()*0.5-.25, Math.random()*0.5-.25));
		}while(!this.cp.boundary.contains(this.selectable[i].position));
	}
}
creaseRay.reset();

creaseRay.updateCreases = function(){
	paper = this.scope;
	this.cp.clear();
	var vector = new XY(this.selectable[1].position.x-this.selectable[0].position.x, 
	                    this.selectable[1].position.y-this.selectable[0].position.y );
	this.cp.creaseRay(this.selectable[0].position, vector).valley();
	this.draw();
	if(creaseRayCallback !== undefined){
		creaseRayCallback({'points':[this.selectable[0].position, vector]});
	}
}
creaseRay.updateCreases();

creaseRay.onFrame = function(event){ }
creaseRay.onResize = function(event){ }
creaseRay.onMouseDown = function(event){ }
creaseRay.onMouseUp = function(event){ }
creaseRay.onMouseMove = function(event){ if(this.mouse.isDragging){ this.updateCreases(); } }
