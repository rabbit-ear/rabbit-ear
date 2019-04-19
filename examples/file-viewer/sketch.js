var div = document.getElementsByClassName("canvases")[0];
var origami = RabbitEar.Origami(div, {folding:false});
var slider = document.querySelector("#frame-slider");
slider.oninput = sliderUpdate;

function sliderUpdate(event) {
	let value = event.target.value
	let fraction = parseFloat(value / 1000);
	let frame = parseInt(fraction * (origami.frames.length-1));
	origami.frame = frame;
}

origami.onMouseMove = function(event){
	// update returns all components back to their original color
	origami.draw();
	origami.color(event);
}

origami.color = function(event) {
	// get all the nearest components to the cursor
	var nearest = origami.nearest(event);
	if(nearest.vertex) { nearest.vertex.svg.addClass('fill-yellow'); }
	if(nearest.crease) { nearest.crease.svg.addClass('stroke-yellow'); }
	if(nearest.face) { nearest.face.svg.addClass('fill-red'); }
}

// IMPORT / EXPORT
foldFileDidLoad = function(fold) {
	console.log("fold", fold)
	origami.cp = RabbitEar.CreasePattern(fold);
	// origami.draw();
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

