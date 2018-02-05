var project = new OrigamiPaper("canvas");
project.style.mountain.strokeColor = { gray:0.0, alpha:1.0 };

var validNodes = [];
var draggingNode = undefined;
project.arcLayer = new project.scope.Layer();

project.updateAngles = function(){
	var bisectedSmallerAngle = bisectSmallerInteriorAngle(new XY(0.5, 0.5), validNodes[0], validNodes[1]);
	var bisectedSmallerPoint = new XY(0.5 + 0.5*Math.cos(bisectedSmallerAngle), 
	                                  0.5 + 0.5*Math.sin(bisectedSmallerAngle) );
	this.arcLayer.activate();
	this.arcLayer.removeChildren();
	// bisect smaller angle
	var bisector = new this.scope.Path({segments:[[0.5,0.5], [bisectedSmallerPoint.x,bisectedSmallerPoint.y]], closed: true });
	Object.assign(bisector, this.style.valley);
}

project.reset = function(){
	this.selectNearestNode = true;
	var creases = [
		this.cp.crease(new XY(0.5, 0.5), new XY(Math.random(), Math.random())).mountain(),
		this.cp.crease(new XY(0.5, 0.5), new XY(Math.random(), Math.random())).mountain()
	];
	this.cp.clean();
	validNodes = [
		creases[0].uncommonNodeWithEdge(creases[1]),
		creases[1].uncommonNodeWithEdge(creases[0])
	];
	this.draw();
}
project.reset();

project.onFrame = function(event) { }
project.onResize = function(event) { }
project.onMouseDown = function(event){
	if(validNodes.includes(this.nearestNode)){
		draggingNode = this.nearestNode;
	}	
}
project.onMouseUp = function(event){
	draggingNode = undefined;
}
project.onMouseMove = function(event){
	if(draggingNode !== undefined){
		draggingNode.x = event.point.x;
		draggingNode.y = event.point.y;
	}
	this.update();
	this.updateAngles();
}
project.onMouseDidBeginDrag = function(event){ }
