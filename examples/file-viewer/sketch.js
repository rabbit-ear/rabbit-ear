var slider = new Slider('#frame-slider').on("slide",sliderUpdate);

function sliderUpdate(value){
	let fraction = parseFloat(value / 1000);
	let frame = parseInt(fraction * origami.frameCount);
	origami.frame = frame;
}

var div = document.getElementsByClassName('canvases')[0];
var origami = RabbitEar.Origami(div, RabbitEar.bases.blintzAnimated);

origami.onMouseMove = function(event){
	origami.draw();
	var nearest = origami.nearest(event);

	if(nearest.vertex) { origami.addClass(nearest.vertex.svg, 'fill-yellow'); }
	if(nearest.edge) { origami.addClass(nearest.edge.svg, 'stroke-yellow'); }
	if(nearest.face) { origami.addClass(nearest.face.svg, 'fill-red'); }
}

// IMPORT / EXPORT
creasePatternDidUpload = function(cp){
	origami.cp = cp;
	origami.draw();
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

