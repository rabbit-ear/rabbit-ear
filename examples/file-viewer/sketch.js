var slider = new Slider('#frame-slider').on("slide",sliderUpdate);

function sliderUpdate(value){
	let fraction = parseFloat(value / 1000);
	let frame = parseInt(fraction * origami.getFrames().length);
	origami.setFrame(frame);
}

var div = document.getElementsByClassName('canvases')[0];
var origami = new RabbitEar.Origami(div, RabbitEar.bases.blintz);

origami.onMouseMove = function(event){

	// var nearest = origami.cp.nearest(event.point);
	// if(nearest.node !== undefined){ this.nodes[nearest.node.index].visible = true; }
	// if(nearest.edge !== undefined){
		// this.addClass(this.get(nearest.edge), 'stroke-yellow');
	// }
	// if(nearest.face !== undefined){ this.faces[nearest.face.index].fillColor = this.styles.byrne.yellow}
	// if(nearest.sector !== undefined){ this.sectors[nearest.sector.index].fillColor.alpha = 1.0; }

}
origami.onMouseDown = function(event){

	var nearest = this.cp.nearest(event.point);
	// if(nearest.edge){ console.log(nearest.edge); }

}
// IMPORT / EXPORT
creasePatternDidUpload = function(cp){
	origami.cp = cp;
	origami.draw();
	updateFoldedState(origami.cp);
}
function updateFoldedState(cp){
	// origami.cp = cp.copy();
	// origami.draw();
	// origami.style = { face:{ fillColor:{ gray:0.0, alpha:0.1 } } };
	// origami.update();
}
document.getElementById("download-cp-svg").addEventListener("click", function(e){
	e.preventDefault();
	downloadCreasePattern(origami.cp, "creasepattern", "svg");
});
document.getElementById("download-cp-fold").addEventListener("click", function(e){
	e.preventDefault();
	downloadCreasePattern(origami.cp, "creasepattern", "fold");
});
document.getElementById("download-cp-opx").addEventListener("click", function(e){
	e.preventDefault();
	downloadCreasePattern(origami.cp, "creasepattern", "opx");
});
document.getElementById("download-folded-svg").addEventListener("click", function(e){
	e.preventDefault();
	downloadFolded(origami.cp, "folded", "svg");
});
document.getElementById("download-folded-fold").addEventListener("click", function(e){
	e.preventDefault();
	downloadFolded(origami.cp, "folded", "fold");
});


