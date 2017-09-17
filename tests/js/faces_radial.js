// generate faces

var radialFaces = new OrigamiPaper("canvas-faces-radial");
radialFaces.zoomToFit(0.05);

radialFaces.selectNearestNode = true;
radialFaces.selectNearestEdge = true;

radialFaces.reset = function(){
	paper = this.scope; 
	radialFaces.cp.clear();
	var angle = 0;
	while(angle < Math.PI*2){
		radialFaces.cp.creaseRay(new XY(0.5, 0.5), new XY(Math.cos(angle), Math.sin(angle)));
		angle+= Math.random()*0.5;
	}
	radialFaces.cp.clean();
	radialFaces.cp.fragment();
	radialFaces.cp.generateFaces();
	radialFaces.init();
}
radialFaces.reset();

radialFaces.onFrame = function(event) { }
radialFaces.onResize = function(event) { }
radialFaces.onMouseDown = function(event){ }
radialFaces.onMouseUp = function(event){ }
radialFaces.onMouseMove = function(event) { }
