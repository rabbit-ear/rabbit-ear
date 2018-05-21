var facesPolygon = new OrigamiPaper("canvas-faces-polygon");
facesPolygon.show.faces = true;
facesPolygon.show.boundary = false;

facesPolygon.reset = function(){
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
facesPolygon.reset();

facesPolygon.onFrame = function(event){ }
facesPolygon.onResize = function(event){ }
facesPolygon.onMouseDown = function(event){ this.reset(); }
facesPolygon.onMouseUp = function(event){ }
facesPolygon.onMouseMove = function(event){ }
