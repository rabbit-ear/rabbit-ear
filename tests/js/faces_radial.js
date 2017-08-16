// generate faces

var radialFaces = new PaperCreasePattern("canvas-faces-radial");
radialFaces.zoomToFit(0.05);

radialFaces.selectNearestNode = true;
radialFaces.selectNearestEdge = true;

radialFaces.reset = function(){
	radialFaces.cp.clear();
	var angle = 0;
	while(angle < Math.PI*2){
		radialFaces.cp.creaseRay(new XYPoint(0.5, 0.5), new XYPoint(Math.cos(angle), Math.sin(angle)));
		angle+= Math.random()*0.5;
	}
	radialFaces.cp.clean();
	radialFaces.cp.chop();
	radialFaces.cp.generateFaces();
	radialFaces.initialize();
}
radialFaces.reset();

radialFaces.onFrame = function(event) { }
radialFaces.onResize = function(event) { }
radialFaces.onMouseDown = function(event){ }
radialFaces.onMouseUp = function(event){ }
radialFaces.onMouseMove = function(event) { }
