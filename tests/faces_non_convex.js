var facesNonConvex = new OrigamiPaper("canvas-faces-non-convex").setPadding(0.05);
facesNonConvex.show.faces = true;
facesNonConvex.show.sectors = false;

facesNonConvex.reset = function(){
	this.cp.clear();
	for(var i = 0; i < 30; i++){
		var angle = Math.random()*Math.PI*2;
		this.cp.creaseRay(new XY(Math.random(), Math.random()), new XY(Math.cos(angle), Math.sin(angle)));
	}
	this.cp.flatten();
	this.draw();
}
facesNonConvex.reset();

facesNonConvex.onFrame = function(event){ }
facesNonConvex.onResize = function(event){ }
facesNonConvex.onMouseDown = function(event){ this.reset(); }
facesNonConvex.onMouseUp = function(event){ }
facesNonConvex.onMouseMove = function(event){
	var nearest = this.cp.nearest(event.point);
	this.updateStyles();
	if(nearest.face !== undefined){
		this.faces[nearest.face.index].fillColor = this.styles.byrne.red;
	}
}