// generate faces
faces_random_callback = undefined;

var randomFaces = new PaperCreasePattern("canvas-faces-random");
randomFaces.zoomToFit(0.05);
randomFaces.style.mark.strokeColor = {gray:0.0, alpha:1.0};

randomFaces.selectNearestEdge = true;

randomFaces.reset = function(){
	randomFaces.cp.clear();
	for(var i = 0; i < 10; i++){
		randomFaces.cp.creaseThroughPoints(new XYPoint(Math.random(), Math.random()), new XYPoint(Math.random(), Math.random()) );
	}
	var intersections = randomFaces.cp.chop();
	randomFaces.cp.generateFaces();
	randomFaces.initialize();
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
randomFaces.onMouseMove = function(event) { }