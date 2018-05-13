var nearestSketch = new OrigamiPaper("canvas").blackAndWhite();
nearestSketch.style.face.fillColor = {hue:43.2, saturation:0.88, brightness:0.93, alpha:0.0};
nearestSketch.style.node.fillColor = {hue:43.2, saturation:0.88, brightness:0.93};
nearestSketch.style.sector.fillColors = [{hue:43.2, saturation:0.88, brightness:0.93, alpha:0.0},{hue:43.2, saturation:0.88, brightness:0.93, alpha:0.0 } ];

nearestSketch.reset = function(){
	this.cp.birdBase();
	this.draw();
}
nearestSketch.reset();

nearestSketch.onMouseDown = function(event){ }
nearestSketch.onMouseMove = function(event){
	var nearest = this.cp.nearest(event.point);

	this.updateStyles();
	// this.nodes.forEach(function(el){ el.visible = false; },this);
	if(nearest.node !== undefined){ this.nodes[nearest.node.index].visible = true; }

	// this.faces.forEach(function(el){ el.fillColor = {gray:1.0}; },this);
	if(nearest.face !== undefined){ this.faces[nearest.face.index].fillColor.alpha = 1.0 }

	if(nearest.edge !== undefined){
		this.edges[nearest.edge.index].strokeColor = {hue:43.2, saturation:0.88, brightness:0.93 };
		this.edges[nearest.edge.index].strokeWidth = this.style.mountain.strokeWidth*1.3333;
	}

	// if(nearest.sector !== undefined){ this.sectors[nearest.sector.index].fillColor.alpha = 1.0; }

}
