// generate faces
faces_random_partial_callback = undefined;

var partialFaces = new OrigamiPaper("canvas-faces-random-partial");
partialFaces.setPadding(0.05);

partialFaces.select.edge = true;

partialFaces.reset = function(){
	paper = this.scope; 
	partialFaces.cp.clear();
	for(var i = 0; i < 30; i++){
		var angle = Math.random()*Math.PI*2;
		partialFaces.cp.creaseRay(new XY(Math.random(), Math.random()), new XY(Math.cos(angle), Math.sin(angle)));
	}
	var intersections = partialFaces.cp.fragment();
	partialFaces.cp.generateFaces();
	partialFaces.draw();
	if(faces_random_callback != undefined){
		faces_random_callback(intersections);
	}
}
partialFaces.reset();

partialFaces.onFrame = function(event) { }
partialFaces.onResize = function(event) { }
partialFaces.onMouseDown = function(event){ 
	partialFaces.reset();
}
partialFaces.onMouseUp = function(event){ }
partialFaces.onMouseMove = function(event) { }
