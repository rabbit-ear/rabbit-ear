
var editor;
try{
	editor = ace.edit("editor");
} catch(err) {
	throw("requires internet. access to ace editor in HTML file. maybe CDN moved.");
}

editor.setTheme("ace/theme/monokai");
editor.setKeyboardHandler("ace/keyboard/sublime");
editor.session.setMode("ace/mode/javascript");
editor.session.on("change", function(delta){
	try{
		origami.reset();
		// eval(editor.getValue());
		// origami.draw();
		// success
		consoleDiv.innerHTML = "";
	}
	catch(err){
		consoleDiv.innerHTML = "<p>" + err + "</p>";
		console.log(err);
	}
});
// after code mirror sets up, trigger origami.redraw()

var consoleDiv = document.querySelector("#console");

// programmatically inspect object
// inspecting an object and doing something with it
function getAllMethods(object) {
	return Object.getOwnPropertyNames(object).filter(function(property) {
		return typeof object[property] == 'function';
	});
}
// console.log(getAllMethods(CreasePattern.prototype));

// window.crease = cp.crease.bind(cp);

function injectCode(string){
	// var cm = document.getElementsByClassName("CodeMirror")[0].CodeMirror;
	// var doc = cm.getDoc();
	// var cursor = doc.getCursor();
	// var line = doc.getLine(cursor.line);
	// var newline = '\n';
	// if(cursor.ch == 0){ newline = ''; }
	// var pos = { // create a new object to avoid mutation of the original selection
	// 	line: (doc.size+5),
	// 	ch: line.length - 1 // set the character position to the end of the line
	// }
	// doc.replaceRange(newline+string, pos);
}

// injectCode("//use variables \"SLIDER\", \"ROWS\", \"COLUMNS\"\nvar points = [];\nfor(var r = -1; r < ROWS+1; r++){\n\tvar row = [];\n\tfor(var c = 0; c < COLUMNS+1; c++){\n\t\tvar point = [\n\t\t\tc/COLUMNS,\n\t\t\tr/ROWS + (c%2)*(1/ROWS*SLIDER)\n\t\t]\n\t\trow.push(point);\n\t}\n\tpoints.push(row);\n}\n//give back the points\npoints;");

/////////////////////////////////////////////////

document.querySelector("#interp-slider").oninput = function(event) {
	var v = parseFloat((event.target.value / 1000).toFixed(2));
	if(v < 0){ v = 0; }
	document.getElementById("interp-value").innerHTML = v;
	SLIDER = v;
	origami.reset();
}

///////////////////////////////////////////////

// document.getElementById("rows-input").oninput = function(e){
// 	var newRows = parseInt(document.getElementById("rows-input").value);
// 	if(!isNaN(newRows)){
// 		ROWS = newRows;
// 		origami.reset();
// 	}
// }
// document.getElementById("columns-input").oninput = function(e){
// 	var newCols = parseInt(document.getElementById("columns-input").value);
// 	if(!isNaN(newCols)){
// 		COLUMNS = newCols;
// 		origami.reset();
// 	}
// }

function download(text, filename, mimeType){
	var blob = new Blob([text], {type: mimeType});
	var url = window.URL.createObjectURL(blob);
	var a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
}
document.getElementById("download-svg").addEventListener("click", function(e){
	e.preventDefault();
	var svgBlob = origami.svgFile;
	download(svgBlob, "creasepattern.svg", "image/svg+xml");
});
document.getElementById("download-fold").addEventListener("click", function(e){
	e.preventDefault();
	var foldBlob = JSON.stringify(origami.cp.json);
	download(foldBlob, "creasepattern.fold", "application/json");
});

function fileDidLoad(blob, mimeType, fileExtension){
	// var points = JSON.parse(blob);
	// touchNodes.nodes = [];
	// points.forEach(function(point){
	// 	touchNodes.newPlanarNode(point[0], point[1]);
	// },this);
	// origami.drawVoronoi();
}

// $().button('toggle')
/////////////////////////////////////////////

var origami = RabbitEar.Origami("origami-cp", {padding:0.05});
var folded = RabbitEar.Origami("origami-fold", {padding:0.05});

var SLIDER = 0.5;

origami.reset = function(){
	// this.cp.clear();
	// this.cp.load(RabbitEar.bases.square);
	origami.cp = RabbitEar.bases.square;
	// get points from code window
	let points = eval(editor.getValue());
	if(points == undefined || points.constructor !== Array){ return; }
	
	// create points manually
	// var points = [];
	// for(var r = -1; r < ROWS+1; r++){
	// 	var row = [];
	// 	for(var c = -1; c < COLUMNS+1; c++){
	// 		var point = {
	// 			x:c/COLUMNS,
	// 			y:r/ROWS + (c%2)*(1/ROWS*SLIDER)
	// 		}
	// 		row.push( point );
	// 	}
	// 	points.push(row);
	// }
	origami.cp.onchange = undefined;

	let boundary = RE.ConvexPolygon([[0,0], [1,0], [1,1], [0,1]]);

	// let c0 = origami.cp.creaseSegment([0,0.5], [1,0.4]);
	// if (c0 != null){ c0.valley(); }
	// let c1 = origami.cp.creaseSegment([0.5,0], [1,0.4]);
	// if (c1 != null){ c1.mountain(); }
	// let c2 = origami.cp.creaseSegment([0,0.5], [1,1]);
	// if (c2 != null){ c2.mountain(); }



	points.forEach((row,j) => {
		row.forEach((point,i) => {
			// crease zig zag rows
			if(i < row.length-1){
				var nextHorizPoint = row[ (i+1)%row.length ];
				let clip = boundary.clipEdge(point, nextHorizPoint);
				if (clip !== undefined) {
					// var crease = origami.cp.creaseSegment(point, nextHorizPoint);
					var crease = origami.cp.creaseSegment(clip[0], clip[1]);
					if(crease != null){
						if(j%2 == 0){ crease.valley(); }
						else { crease.mountain(); }
					}
				}
			}
			// crease lines connecting between zig zag rows
			if(j < points.length-1){
				var nextRow = points[ (j+1)%points.length ];
				var nextVertPoint = nextRow[ i ];
				let clip = boundary.clipEdge(point, nextVertPoint);
				if (clip !== undefined) {
					// var crease = origami.cp.creaseSegment(point, nextVertPoint);
					var crease = origami.cp.creaseSegment(clip[0], clip[1]);
					if(crease != null){
						if((i+j)%2 == 0){ crease.mountain(); }
						else { crease.valley(); }
					}
				}
			}
		})
	});



	origami.cp.onchange = function(){ origami.draw(); };

	origami.cp.clean();
	origami.draw();

	folded.cp = origami.cp.copy();
	folded.fold();
}
origami.reset();

origami.onMouseDown = function(event){ }
origami.onMouseUp = function(event){ }
origami.onMouseMove = function(event){ }
origami.onFrame = function(event){ }

// function resetCP(){
// 	origami.cp = RabbitEar.bases.square;
// }

// origami.animate = function(event){ }
// origami.onMouseMove = function(mouse){ }
// origami.onMouseDown = function(mouse){
// 	var nearest = origami.nearest(mouse);
// 	console.log(nearest);
// 	var keys = Object.keys(nearest);
// 	var consoleString = "";
// 	for(var i = 0; i < keys.length; i++){
// 		if(nearest[keys[i]] !== undefined){
// 			var cpObject = "cp." + keys[i] + "s[" + nearest[keys[i]].index + "]";
// 			consoleString += keys[i] + ": <a href='#' onclick='injectCode(\"" + cpObject + "\")'>" + cpObject + "</a><br>";
// 		}
// 	}
// 	consoleDiv.innerHTML = "<p>" + consoleString + "</p>";
// 	// var nearestEdge = this.cp.nearest(event.point).edge || {};
// 	// if(nearestEdge !== undefined){
// 	// 	updateCodeMirror("cp.edges[" + nearestEdge.edge.index + "]");
// 	// 	// console.log( nearest.edge.edge.index );
// 	// }
// }
