var project = new OrigamiPaper("canvas");

function makeMinimumPath(){
	project.cp.setMinimumRectBoundary();
	project.draw();
	var scale = 600 / cp.bounds().size.width;
	if(isNaN(scale) || scale === undefined){ scale = 1.0; }
	var svgMin = project.cp.exportSVGMin(scale);
	download(svgMin, "creasepattern.min.svg");
}

function fileDidLoad(file, mimeType){
	try{
		// try .fold file format first
		var foldFile = JSON.parse(file);
		project.cp.importFoldFile(foldFile);
		project.draw();
		makeMinimumPath();
	} catch(err){
		// try .svg file format
		project.load(file, function(){
			makeMinimumPath();
		});
	}
}

function download(text, filename){
	var blob = new Blob([text], {type: "image/svg+xml"});
	var url = window.URL.createObjectURL(blob);
	var a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
}