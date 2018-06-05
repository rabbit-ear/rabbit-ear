
var project = new OrigamiPaper("canvas").setPadding(0.02);
project.style.boundary.strokeColor = {gray:0.0, alpha:0.0};
project.style.face.scale = 0.7;
project.show.faces = false;

project.onMouseMove = function(event){
	var nearest = this.cp.nearest(event.point);
	this.updateStyles();
	// if(nearest.node !== undefined){ this.nodes[nearest.node.index].visible = true; }
	if(nearest.edge !== undefined){
		this.edges[nearest.edge.index].strokeColor = this.styles.byrne.yellow;
		this.edges[nearest.edge.index].strokeWidth = this.style.mountain.strokeWidth*1.3333;
		this.edges[nearest.edge.index].bringToFront();
	}
	// if(nearest.face !== undefined){ this.faces[nearest.face.index].fillColor = this.styles.byrne.yellow}
	// if(nearest.sector !== undefined){ this.sectors[nearest.sector.index].fillColor.alpha = 1.0; }
}
project.onMouseDown = function(event){
	var nearest = this.cp.nearest(event.point);
	if(nearest.edge){
		console.log(nearest.edge);
	}
}
// IMPORT / EXPORT
creasePatternDidUpload = function(cp){
	project.cp = cp;
	project.draw();
}
document.getElementById("download-svg").addEventListener("click", function(e){
	e.preventDefault();
	downloadCreasePattern(project.cp, "creasepattern", "svg");
});
document.getElementById("download-fold").addEventListener("click", function(e){
	e.preventDefault();
	downloadCreasePattern(project.cp, "creasepattern", "fold");
});
document.getElementById("download-opx").addEventListener("click", function(e){
	e.preventDefault();
	downloadCreasePattern(project.cp, "creasepattern", "opx");
});