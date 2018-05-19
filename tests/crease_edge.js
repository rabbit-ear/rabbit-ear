var creaseEdgeCallback = undefined;
var creaseEdge = new OrigamiPaper("canvas-crease-edge");

creaseEdge.reset = function(){
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
creaseEdge.reset();

creaseEdge.updateCreases = function(){
	paper = this.scope;
	this.cp.clear();
	var crease = this.cp.crease(this.selectable[0].position, this.selectable[1].position);
	if(crease != undefined){ crease.valley(); }
	this.draw();
	if(creaseEdgeCallback !== undefined){
		creaseEdgeCallback({'points':[this.selectable[0].position, this.selectable[1].position]});
	}
}
creaseEdge.updateCreases();

creaseEdge.onFrame = function(event){ }
creaseEdge.onResize = function(event){ }
creaseEdge.onMouseDown = function(event){ }
creaseEdge.onMouseUp = function(event){ }
creaseEdge.onMouseMove = function(event){ if(this.mouse.isDragging){ this.updateCreases(); } }
