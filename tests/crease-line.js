var creaseLineCallback = undefined;
var creaseLine = new OrigamiPaper("canvas-crease-line");

creaseLine.reset = function(){
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
creaseLine.reset();

creaseLine.updateCreases = function(){
	paper = this.scope;
	this.cp.clear();
	this.cp.creaseThroughPoints(this.selectable[0].position, this.selectable[1].position).valley();
	this.draw();
	if(creaseLineCallback !== undefined){
		creaseLineCallback({'points':[this.selectable[0].position, this.selectable[1].position]});
	}
}
creaseLine.updateCreases();

creaseLine.onFrame = function(event){ }
creaseLine.onResize = function(event){ }
creaseLine.onMouseDown = function(event){ }
creaseLine.onMouseUp = function(event){ }
creaseLine.onMouseMove = function(event){ if(this.mouse.isDragging){ this.updateCreases(); } }
