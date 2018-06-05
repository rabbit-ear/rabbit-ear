FOLD = require('fold');


// UPLOAD: implement this callback, function(cp){ }  -it will pass in the crease pattern as argument #1
var creasePatternDidUpload;
// DOWNLOAD: call this function pass 3 arguments: (creasepattern, "filename without extension", "extension")
// valid extensions: svg, fold, opx
var downloadCreasePattern; 

////////////////////////
// UPLOAD

// incoming file from upload-button or drag-to-upload
function fileDidLoad(file, mimeType, extension){
	switch (extension){
		case 'fold':
			var foldFile = JSON.parse(file);
			creasePatternDidUpload( new CreasePattern().importFoldFile(foldFile) );
		return;
		case 'svg':
			loadSVGToCPUsingPaperJS(file, function(cp){
				creasePatternDidUpload(cp);
			});
		return;
		case 'opx':
			var foldFile = FOLD.convert.convertFromTo(file, "opx", "fold");
			creasePatternDidUpload( new CreasePattern().importFoldFile(foldFile) );
		return;
	}
	// if no extension, try things..
	try{
		// try .fold file format first
		var foldFile = JSON.parse(file);
		creasePatternDidUpload( new CreasePattern().importFoldFile(foldFile) );
	} catch(err){
		// try .svg file format
		loadSVGToCPUsingPaperJS(file, function(cp){
			creasePatternDidUpload(cp);
		});
	}
}

function loadSVGToCPUsingPaperJS(file, callback, epsilon){
	paper.project.importSVG(file, function(e){
		var cp = new PaperJSLoader().paperPathToCP(e);
		if(epsilon == undefined){ epsilon = 0.0001; }
		console.log("loading svg with epsilon " + epsilon);
		cp.flatten(epsilon);
		if(callback != undefined){
			callback(cp);
		}
	});
}

/////////////////////////
// DOWNLOAD

function downloadCreasePattern(cp, filename, extension){
	var supportedFileTypes = ['fold', 'svg', 'opx'];
	if(filename == "" || filename == undefined){ filename = "creasepattern"; }
	if(supportedFileTypes.indexOf(extension) == -1){ throw "downloadCreasePattern does not support file format, or function is improperly called."; }
	var fullname = [filename, extension].join('.');
	switch(extension){
		case 'fold':
			var foldObject = cp.exportFoldFile();
			var foldFileBlob = JSON.stringify(foldObject);
			makeDownloadBlob(foldFileBlob, fullname, "application/json");
		break;
		case 'svg':
			var svgBlob = cp.exportSVG();
			makeDownloadBlob(svgBlob, fullname, "image/svg+xml");
		break;
		case 'opx':
			var foldObject = cp.exportFoldFile();
			var foldFileBlob = JSON.stringify(foldObject);
			var opxFile = FOLD.convert.convertFromTo(foldFileBlob, "fold", "opx");
			makeDownloadBlob(opxFile, fullname, "text/xml");
		break;
	}
}

function makeDownloadBlob(text, filename, mimeType){
	var blob = new Blob([text], {type: mimeType});
	var url = window.URL.createObjectURL(blob);
	var a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
}
