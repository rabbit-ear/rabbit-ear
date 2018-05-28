/////////////////////////////////////////////////////////////////
function download(text, filename){
	var blob = new Blob([text], {type: "image/svg+xml"});
	var url = window.URL.createObjectURL(blob);
	var a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
}
// button to download
document.getElementById("download-svg").addEventListener("click", function(e){
	e.preventDefault();
	var svgBlob = panel3.cp.exportSVG();
	download(svgBlob, "creasepattern.svg", "image/svg+xml");
});
document.getElementById("download-fold").addEventListener("click", function(e){
	e.preventDefault();
	var foldObject = panel3.cp.exportFoldFile();
	var foldFileBlob = JSON.stringify(foldObject);
	download(foldFileBlob, "creasepattern.fold", "application/json");
});
document.getElementById("download-opx").addEventListener("click", function(e){
	e.preventDefault();
	var foldObject = panel3.cp.exportFoldFile();
	var foldFileBlob = JSON.stringify(foldObject);
	var opxFile = FOLD.convert.convertFromTo(foldFileBlob, "fold", "opx");
	download(opxFile, "creasepattern.opx", "text/xml");
});
////////////////////////////////////////////////////////////////////
var panel1 = new OrigamiPaper("canvas-1").mediumLines();
var panel2 = new OrigamiPaper("canvas-2").mediumLines();
var panel3 = new OrigamiPaper("canvas-3").mediumLines();
panel2.show.faces = true;
panel3.show.faces = true;
var foldedState = new OrigamiFold("canvas-4");

var yellow = {hue:43.2, saturation:0.88, brightness:0.93 };
panel1.onMouseMove = function(event){
	var nearest = this.cp.nearest(event.point);
	this.updateStyles();
	if(nearest.edge !== undefined){ this.edges[nearest.edge.index].strokeColor = yellow; }
}
panel2.onMouseMove = function(event){
	var nearest = this.cp.nearest(event.point);
	this.updateStyles();
	if(nearest.edge !== undefined){ this.edges[nearest.edge.index].strokeColor = yellow; }
}
panel3.onMouseMove = function(event){
	var nearest = this.cp.nearest(event.point);
	this.updateStyles();
	if(nearest.edge !== undefined){ this.edges[nearest.edge.index].strokeColor = yellow; }
}

function updateFoldedState(cp){
	foldedState.cp = cp.copy();
	foldedState.draw();
	foldedState.style = { face:{ fillColor:{ gray:0.0, alpha:0.1 } } };
	foldedState.update();
}
// incoming file from upload-button or drag-to-upload
function fileDidLoad(file){
	// try{
	// 	// try .fold file format first
	// 	var foldFile = JSON.parse(file);
	// 	panel1.cp.importFoldFile(foldFile);
	// 	panel1.draw();
	// 	updateFoldedState(panel1.cp);
	// } catch(err){
		panel1.loadRaw(file);
		// try .svg file format
		panel2.load(file, function(){
			panel2.cp.clean(0.0001);
			updateFoldedState(panel2.cp);
		});
	// }
}