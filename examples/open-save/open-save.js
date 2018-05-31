
FOLD = require('fold');

var project = new OrigamiPaper("canvas").setPadding(0.02);
project.style.boundary.strokeColor = {gray:0.0, alpha:0.0};
project.style.face.scale = 0.7;
project.show.faces = false;

project.onMouseMove = function(event){
	var nearest = this.cp.nearest(event.point);
	this.updateStyles();
	// if(nearest.node !== undefined){ this.nodes[nearest.node.index].visible = true; }
	if(nearest.edge !== undefined){
		this.edges[nearest.edge.index].strokeColor = this.styles.byrne.yellow;
		this.edges[nearest.edge.index].strokeWidth = this.style.mountain.strokeWidth*1.3333;
		this.edges[nearest.edge.index].bringToFront();
	}
	// if(nearest.face !== undefined){ this.faces[nearest.face.index].fillColor = this.styles.byrne.yellow}
	// if(nearest.sector !== undefined){ this.sectors[nearest.sector.index].fillColor.alpha = 1.0; }
}
project.onMouseDown = function(event){
	var nearest = this.cp.nearest(event.point);
	if(nearest.edge){
		console.log(nearest.edge);
	}
}

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
	var svgBlob = project.cp.exportSVG();
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