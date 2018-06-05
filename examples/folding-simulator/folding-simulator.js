/////////////////////////////////////////////////////////////////
function download(text, filename){
	var blob = new Blob([text], {type: "image/svg+xml"});
	var url = window.URL.createObjectURL(blob);
	var a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
}
document.getElementById("download-file").addEventListener("click", function(e){
	e.preventDefault();
	var svgBlob = project.cp.exportSVG();
	download(svgBlob, "creasepattern.svg");
});	
////////////////////////////////////////////////////////////////////
var foldedState = new OrigamiFold("canvas-2");
var project = new OrigamiPaper("canvas-1").mediumLines();
project.show.faces = true;

function updateFoldedState(cp){
	foldedState.cp = cp.copy();
	foldedState.draw();
	foldedState.style = { face:{ fillColor:{ gray:0.0, alpha:0.1 } } };
	foldedState.update();
}
// incoming file from upload-button or drag-to-upload
function fileDidLoad(file){
	try{
		// try .fold file format first
		var foldFile = JSON.parse(file);
		project.cp.importFoldFile(foldFile);
		project.draw();
		updateFoldedState(project.cp);
	} catch(err){
		// try .svg file format
		project.load(file, function(){
			updateFoldedState(project.cp);
		},0.0001);
	}
}