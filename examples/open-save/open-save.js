
FOLD = require('fold');

var project = new OrigamiPaper("canvas");

// incoming file from upload-button or drag-to-upload
function fileDidLoad(file, mimeType){
	try{
		// try .fold file format first
		var foldFile = JSON.parse(file);
		project.cp.importFoldFile(foldFile);
		project.draw();
	} catch(err){
		// try .svg file format
		project.load(file, function(){ });
	}
	// switch(mimeType){
	// 	case "image/svg+xml": project.load(file, function(){ }); break;
	// 	default: break;
	// }
}

// download svg blob
function download(text, filename, mimeType){
	var blob = new Blob([text], {type: mimeType});
	var url = window.URL.createObjectURL(blob);
	var a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
}

// button to download
document.getElementById("download-svg").addEventListener("click", function(e){
	e.preventDefault();
	var scale = 600 / project.cpMin;
	var svgBlob = project.cp.exportSVG(scale);
	download(svgBlob, "creasepattern.svg", "image/svg+xml");
});
document.getElementById("download-fold").addEventListener("click", function(e){
	e.preventDefault();
	var foldObject = project.cp.exportFoldFile();
	var foldFileBlob = JSON.stringify(foldObject);
	download(foldFileBlob, "creasepattern.fold", "application/json");
});
document.getElementById("download-opx").addEventListener("click", function(e){
	e.preventDefault();
	var foldObject = project.cp.exportFoldFile();
	var foldFileBlob = JSON.stringify(foldObject);
	var opxFile = FOLD.convert.convertFromTo(foldFileBlob, "fold", "opx");
	download(opxFile, "creasepattern.opx", "text/xml");
});