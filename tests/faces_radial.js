
var radialFaces = new OrigamiPaper("canvas-faces-radial");
radialFaces.setPadding(0.05);
radialFaces.show.faces = true;
radialFaces.style.face.scale = 1.0;

radialFaces.updateRainbows = function(){
	var adj = this.cp.nearest(0.5, 0.5).node.adjacentFaces();
	for(var i = 0; i < adj.length; i++){
		this.faces[ adj[i].index ].fillColor = {hue:i/adj.length*360, saturation:1.0, brightness:1.0};
	}
}
radialFaces.reset = function(){
	paper = this.scope; 
	this.cp.clear();
	var angle = 0;
	while(angle < Math.PI*2){
		this.cp.creaseRay(new XY(0.5, 0.5), new XY(Math.cos(angle), Math.sin(angle)));
		angle+= Math.random()*0.5;
	}
	this.cp.clean();
	this.draw();
	this.updateRainbows();
}
radialFaces.reset();

radialFaces.onFrame = function(event){ }
radialFaces.onResize = function(event){ }
radialFaces.onMouseDown = function(event){ this.reset(); }
radialFaces.onMouseUp = function(event){ }
radialFaces.onMouseMove = function(event){
	this.update();
	this.updateRainbows();
	var nearestFace = this.cp.nearest(event.point).face;
	if(nearestFace != undefined){
		this.faces[ nearestFace.index ].fillColor = {gray:1.0};
	}
}
