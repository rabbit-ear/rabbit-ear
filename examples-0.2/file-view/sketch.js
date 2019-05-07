var div = document.getElementsByClassName("origami")[0];
var origami = RabbitEar.Origami(div, {folding:false, padding:0.05});
var slider = document.querySelector("#frame-slider");
var frameInfo = document.querySelector("#frame-span");
slider.oninput = sliderUpdate;

origami.cp = {};

function sliderUpdate(event) {
	let value = event.target.value
	let fraction = parseFloat(value / 1000);
	let frameCount = origami.frames.length-1;
	let frame = parseInt(fraction * frameCount);
	origami.frame = frame;
	frameInfo.innerHTML = "frame " + frame + "/" + frameCount;
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

fileDidLoad = function(blob, mimeType, fileExtension) {
	origami.load(blob, function(cp) {
		sliderUpdate({target:{value:0}});
		slider.value = 0;
		var data = JSON.stringify(origami.cp);
		let codeWindow = document.querySelectorAll(".root")[0];
		while (codeWindow.children.length > 0) {
			codeWindow.removeChild(codeWindow.children[0]);
		}
		jsonView.format(data, ".root");
	});
}

document.getElementById("download-cp-svg")
	.addEventListener("click", function(e){
	e.preventDefault();
	var svg = origami.cp.svg();
	var svgBlob = (new XMLSerializer()).serializeToString(svg);
	makeDownloadBlob(svgBlob, "origami", "image/svg+xml");
});
document.getElementById("download-cp-fold")
	.addEventListener("click", function(e){
	e.preventDefault();
	var fold = JSON.stringify(origami.cp);
	makeDownloadBlob(fold, "origami", "application/json");
});
document.getElementById("download-cp-opx")
	.addEventListener("click", function(e){
	e.preventDefault();
	var oripa = origami.cp.oripa();
	makeDownloadBlob(oripa, "origami", "text/xml");
});

function makeDownloadBlob(text, filename, mimeType){
	var blob = new Blob([text], {type: mimeType});
	var url = window.URL.createObjectURL(blob);
	var a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
}
