// generate faces
var randomFaces = new OrigamiPaper("canvas-faces-random");
randomFaces.setPadding(0.05);
randomFaces.style.mark.strokeColor = {gray:0.0, alpha:1.0};
randomFaces.show.faces = true;
randomFaces.show.sectors = false;

randomFaces.reset = function(){
	paper = this.scope; 
	this.cp.clear();
	for(var i = 0; i < 3; i++){
		this.cp.creaseThroughPoints(new XY(Math.random(), Math.random()), new XY(Math.random(), Math.random()) );
	}
	this.cp.flatten();
	this.draw();
}
randomFaces.reset();

randomFaces.onFrame = function(event) { }
randomFaces.onResize = function(event) { }
randomFaces.onMouseDown = function(event){ 
	randomFaces.reset();
}
randomFaces.onMouseUp = function(event){ }
randomFaces.onMouseMove = function(event) {
	var nearest = this.cp.nearest(event.point);
	this.updateStyles();
	if(nearest.face !== undefined){
		this.faces[nearest.face.index].fillColor = this.styles.byrne.red;
	}
}