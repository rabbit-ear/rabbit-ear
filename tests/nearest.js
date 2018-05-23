var nearestCallback = undefined;

var nearestSketch = new OrigamiPaper("canvas-nearest").blackAndWhite();

nearestSketch.show.nodes = true;
nearestSketch.show.faces = true;
nearestSketch.show.sectors = true;
nearestSketch.style.face.fillColor = Object.assign({alpha:0.0}, nearestSketch.styles.byrne.red);
nearestSketch.style.sector.fillColors = [
	Object.assign({alpha:0.0}, nearestSketch.styles.byrne.blue), 
	Object.assign({alpha:0.0}, nearestSketch.styles.byrne.blue) ];
nearestSketch.style.boundary.strokeColor = {gray:0.0, alpha:0.0};
nearestSketch.style.node.fillColor = Object.assign({alpha:0.0}, nearestSketch.styles.byrne.red);
nearestSketch.style.node.radius = 0.015;

nearestSketch.reset = function(){
	this.cp.birdBase();
	this.cp.flatten();
	this.draw();
}
nearestSketch.reset();

nearestSketch.onMouseDown = function(event){ }
nearestSketch.onMouseMove = function(event){
	paper = this.scope;
	var nearest = this.cp.nearest(event.point);
	this.updateStyles();
	if(nearest.node !== undefined){ this.nodes[nearest.node.index].fillColor.alpha = 1.0; }
	if(nearest.edge !== undefined){
		this.edges[nearest.edge.index].strokeColor = {hue:43.2, saturation:0.88, brightness:0.93 };
		this.edges[nearest.edge.index].strokeWidth = this.style.mountain.strokeWidth*1.3333;
	}
	if(nearest.face !== undefined){ this.faces[nearest.face.index].fillColor.alpha = 1.0}
	if(nearest.sector !== undefined){ this.sectors[nearest.sector.index].fillColor.alpha = 1.0; }
	if(nearestCallback != undefined){ nearestCallback(event.point); }
}
