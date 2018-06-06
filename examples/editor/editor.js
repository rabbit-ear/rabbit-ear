var mouseMoveCallback = undefined;

var project = new OrigamiPaper("canvas");

project.show.nodes = true;
project.show.faces = true;
project.show.sectors = true;
project.style.face.fillColor = Object.assign({alpha:0.0}, project.styles.byrne.red);
project.style.sector.fillColors = [
	Object.assign({alpha:0.0}, project.styles.byrne.blue), 
	Object.assign({alpha:0.0}, project.styles.byrne.blue) ];
project.style.boundary.strokeColor = {gray:0.0, alpha:0.0};
project.style.node.fillColor = Object.assign({alpha:0.0}, project.styles.byrne.red);
project.style.node.radius = 0.015;
project.style.sector.scale = 0.5;
//
project.inputMode = "add";

project.reset = function(){
	this.draw();
}
project.reset();

project.onMouseDown = function(event){
	switch(this.inputMode){
		case 'add':
			var nearest = this.cp.nearest(event.point);
			if(nearest.sector !== undefined){
				nearest.sector.bisect().crease().mountain();
			}
		break;
		case 'remove':
			var nearest = this.cp.nearest(event.point);
			if(nearest.edge !== undefined){
				this.cp.removeEdge(nearest.edge);
			}
		break;
		case 'flip-m-v':
			var nearest = this.cp.nearest(event.point);
			if(nearest.edge !== undefined){
				switch(nearest.edge.orientation){
					case CreaseDirection.mountain: nearest.edge.orientation = CreaseDirection.valley; break;
					case CreaseDirection.valley:   nearest.edge.orientation = CreaseDirection.mountain; break;
				}
			}
		break;
	}
	this.cp.flatten();
	this.draw();
}
project.onMouseMove = function(event){
	var nearest = this.cp.nearest(event.point);
	this.updateStyles();
	switch(this.inputMode){
		case 'add':
			if(nearest.node !== undefined){ this.nodes[nearest.node.index].fillColor.alpha = 1.0; }
			if(nearest.edge !== undefined){
				this.edges[nearest.edge.index].strokeColor = {hue:43.2, saturation:0.88, brightness:0.93 };
				this.edges[nearest.edge.index].strokeWidth = this.style.mountain.strokeWidth*1.3333;
			}
			if(nearest.face !== undefined){ this.faces[nearest.face.index].fillColor.alpha = 1.0}
			if(nearest.sector !== undefined){ this.sectors[nearest.sector.index].fillColor.alpha = 1.0; }
			if(mouseMoveCallback != undefined){ mouseMoveCallback(event.point); }
		break;
		case 'remove':
			if(nearest.edge !== undefined){
				this.edges[nearest.edge.index].strokeColor = {hue:43.2, saturation:0.88, brightness:0.93 };
				this.edges[nearest.edge.index].strokeWidth = this.style.mountain.strokeWidth*1.3333;
			}
		break;
		case 'flip-m-v':
			if(nearest.edge !== undefined){
				// this.edges[nearest.edge.index].strokeColor = {hue:43.2, saturation:0.88, brightness:0.93 };
				this.edges[nearest.edge.index].strokeWidth = this.style.mountain.strokeWidth*1.3333;
			}
		break;
	}
}

document.getElementById("radio-input-mode").onchange = function(event){
	switch(event.target.id){
		case "radio-button-add-crease":    project.inputMode = "add";      break;
		case "radio-button-remove-crease": project.inputMode = "remove";   break;
		case "radio-button-flip-crease":   project.inputMode = "flip-m-v"; break;
	}
}
// modal stuff
$("#modal-what-is-this").draggable({ handle: ".modal-header" });
function whatIsThisDidPress(){
	document.getElementById("modal-what-is-this").style.display = 'block';
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
