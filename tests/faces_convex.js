var facesConvex = new OrigamiPaper("canvas-faces-convex").setPadding(0.05);
facesConvex.show.faces = true;
facesConvex.show.sectors = false;

facesConvex.reset = function(){
	this.cp.clear();
	for(var i = 0; i < 4; i++){
		this.cp.creaseThroughPoints(new XY(Math.random(),Math.random()),new XY(Math.random(),Math.random()));
	}
	this.cp.clean();
	this.draw();
}
facesConvex.reset();

facesConvex.onFrame = function(event){ }
facesConvex.onResize = function(event){ }
facesConvex.onMouseDown = function(event){ this.reset(); }
facesConvex.onMouseUp = function(event){ }
facesConvex.onMouseMove = function(event){
	var nearest = this.cp.nearest(event.point);
	this.updateStyles();
	if(nearest.face !== undefined){
		this.faces[nearest.face.index].fillColor = this.styles.byrne.red;
	}
}