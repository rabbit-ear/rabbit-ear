// generate faces
faces_random_callback = undefined;

var randomFaces = new OrigamiPaper("canvas-faces-random");
randomFaces.setPadding(0.05);
randomFaces.style.mark.strokeColor = {gray:0.0, alpha:1.0};

randomFaces.select.edge = true;

randomFaces.reset = function(){
	paper = this.scope; 
	this.cp.clear();
	for(var i = 0; i < 3; i++){
		this.cp.creaseThroughPoints(new XY(Math.random(), Math.random()), new XY(Math.random(), Math.random()) );
	}
	this.cp.clean();
	var intersections = this.cp.fragment();
	this.cp.generateFaces();
	this.draw();
	if(faces_random_callback != undefined){
		faces_random_callback(intersections);
	}
}
randomFaces.reset();

randomFaces.onFrame = function(event) { }
randomFaces.onResize = function(event) { }
randomFaces.onMouseDown = function(event){ 
	randomFaces.reset();
}
randomFaces.onMouseUp = function(event){ }
randomFaces.onMouseMove = function(event) {
	this.cp.nearest(event.point);
}