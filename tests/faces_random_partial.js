// generate faces
var partialFaces = new OrigamiPaper("canvas-faces-random-partial");
partialFaces.setPadding(0.05);
partialFaces.show.faces = true;
partialFaces.show.sectors = false;

partialFaces.reset = function(){
	paper = this.scope; 
	partialFaces.cp.clear();
	for(var i = 0; i < 30; i++){
		var angle = Math.random()*Math.PI*2;
		partialFaces.cp.creaseRay(new XY(Math.random(), Math.random()), new XY(Math.cos(angle), Math.sin(angle)));
	}
	partialFaces.cp.flatten();
	partialFaces.draw();
}
partialFaces.reset();

partialFaces.onFrame = function(event) { }
partialFaces.onResize = function(event) { }
partialFaces.onMouseDown = function(event){ 
	partialFaces.reset();
}
partialFaces.onMouseUp = function(event){ }
partialFaces.onMouseMove = function(event){
	var nearest = this.cp.nearest(event.point);
	this.updateStyles();
	if(nearest.face !== undefined){
		this.faces[nearest.face.index].fillColor = this.styles.byrne.red;
	}	
}
