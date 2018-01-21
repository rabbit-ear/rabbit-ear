var singleFaceCallback;

var singleFace = new OrigamiPaper("canvas-face-single");
// singleFace.setPadding(0.05);

singleFace.reset = function(){
	paper = this.scope; 
	singleFace.cp.clear();
	singleFace.cp.nodes = [];
	singleFace.cp.edges = [];
	var center = new XY(0.5, 0.5);

	var newNumSides;
	do{
		newNumSides = Math.floor(Math.random()*5 + 3);
	}while(newNumSides == singleFace.SIDES);
	singleFace.SIDES = newNumSides;

	var r = 0.1;
	for(var i = 0; i < singleFace.SIDES; i++){
		var angle = i * Math.PI*2 / singleFace.SIDES;
		var rayPoint = new XY(center.x+Math.cos(angle) * r, center.y+Math.sin(angle) * r);
		singleFace.cp.creasePerpendicularThroughPoint({nodes:[center, rayPoint]}, rayPoint);
	}
	singleFace.cp.clean();
	var faces = singleFace.cp.generateFaces();
	singleFace.draw();
	singleFace.boundaryLayer.visible = false;
	if(singleFaceCallback != undefined){ singleFaceCallback(faces); }
}
singleFace.reset();

singleFace.onFrame = function(event) { }
singleFace.onResize = function(event) { }
singleFace.onMouseDown = function(event){ 
	singleFace.reset();
}
singleFace.onMouseUp = function(event){ }
singleFace.onMouseMove = function(event) { }
