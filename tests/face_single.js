var singleFace = new OrigamiPaper("canvas-face-single");
singleFace.show.faces = true;
singleFace.show.boundary = false;

singleFace.reset = function(){
	paper = this.scope; 
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	var center = new XY(0.5, 0.5);
	var newNumSides;
	do{
		newNumSides = Math.floor(Math.random()*5 + 3);
	}while(newNumSides == this.SIDES);
	this.SIDES = newNumSides;
	var r = 0.1;
	for(var i = 0; i < this.SIDES; i++){
		var angle = i * Math.PI*2 / this.SIDES;
		var rayPoint = new XY(center.x+Math.cos(angle) * r, center.y+Math.sin(angle) * r);
		this.cp.creasePerpendicularThroughPoint(new Edge(center, rayPoint).infiniteLine(), rayPoint);
	}
	this.cp.flatten();
	this.draw();
}
singleFace.reset();

singleFace.onFrame = function(event){ }
singleFace.onResize = function(event){ }
singleFace.onMouseDown = function(event){ this.reset(); }
singleFace.onMouseUp = function(event){ }
singleFace.onMouseMove = function(event){ }
