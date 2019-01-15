
var myCodeMirror = CodeMirror(document.getElementById("code-container"), {
	value: "",
	mode:  "javascript",
	lineNumbers: true,
	theme: "idle"
}).on('change', (editor,event) => {
	// console.log( editor.getValue() );
	try{
		// eval(editor.getValue());
		origami.reset();
		// success
		// consoleDiv.innerHTML = "";
	}
	catch(err){
		// consoleDiv.innerHTML = err;
		// console.log(err);
	}
});

function injectCode(string){
	var cm = document.getElementsByClassName("CodeMirror")[0].CodeMirror;
	var doc = cm.getDoc();
	var cursor = doc.getCursor();
	var line = doc.getLine(cursor.line);
	var newline = '\n';
	if(cursor.ch == 0){ newline = ''; }
	var pos = { // create a new object to avoid mutation of the original selection
		line: (doc.size+5),
		ch: line.length - 1 // set the character position to the end of the line
	}
	doc.replaceRange(newline+string, pos);
}

injectCode("//use variables \"SLIDER\", \"ROWS\", \"COLUMNS\"\nvar points = [];\nfor(var r = -1; r < ROWS+1; r++){\n\tvar row = [];\n\tfor(var c = -1; c < COLUMNS+1; c++){\n\t\tvar point = {\n\t\t\tx:c/COLUMNS,\n\t\t\ty:r/ROWS + (c%2)*(1/ROWS*SLIDER)\n\t\t}\n\t\trow.push(point);\n\t}\n\tpoints.push(row);\n}\n//give back the points\npoints;");

/////////////////////////////////////////////////

var slider = new Slider('#interp-slider').on("slide",sliderUpdate);
function sliderUpdate(value){
	var v = parseFloat((value / 1000).toFixed(2));
	if(v < 0){ v = 0; }
	document.getElementById("interp-value").innerHTML = v;
	SLIDER = v;
	origami.reset();
}

///////////////////////////////////////////////

document.getElementById("rows-input").oninput = function(e){
	var newRows = parseInt(document.getElementById("rows-input").value);
	if(!isNaN(newRows)){
		ROWS = newRows;
		origami.reset();
	}
}
document.getElementById("columns-input").oninput = function(e){
	var newCols = parseInt(document.getElementById("columns-input").value);
	if(!isNaN(newCols)){
		COLUMNS = newCols;
		origami.reset();
	}
}

function download(text, filename, mimeType){
	var blob = new Blob([text], {type: mimeType});
	var url = window.URL.createObjectURL(blob);
	var a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
}
document.getElementById("download-file").addEventListener("click", function(e){
	e.preventDefault();
	var svgBlob = origami.cp.exportSVG();
	download(svgBlob, "creasepattern.svg", "image/svg+xml");
});

function fileDidLoad(blob, mimeType, fileExtension){
	var points = JSON.parse(blob);
	touchNodes.nodes = [];
	points.forEach(function(point){
		touchNodes.newPlanarNode(point[0], point[1]);
	},this);
	origami.drawVoronoi();
}

// $().button('toggle')
/////////////////////////////////////////////
var div = document.getElementById('cp-container');
var origami = new RabbitEar.Origami(div);
// origami.style.mountain.strokeColor = {gray:0.0}
// origami.mediumLines();

var dragOn = false;
var selectedNode = undefined;

var SLIDER = 0.5;
var ROWS = 12;
var COLUMNS = 12;

origami.reset = function(){
	this.cp.clear();
	// get points from code window

	var points = eval(document.getElementsByClassName("CodeMirror")[0].CodeMirror.getValue());
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

	points.forEach(function(row,j){
		row.forEach(function(point,i){
			// crease zig zag rows
			if(i < row.length-1){
				var nextHorizPoint = row[ (i+1)%row.length ];
				var crease = this.cp.crease(point, nextHorizPoint);
				if(crease != undefined){
					if(j%2 == 0){ crease.mountain(); }
					else { crease.valley(); }
				}
			}
			// crease lines connecting between zig zag rows
			if(j < points.length-1){
				var nextRow = points[ (j+1)%points.length ];
				var nextVertPoint = nextRow[ i ];
				var crease = this.cp.crease(point, nextVertPoint);
				if(crease != undefined){
					if((i+j)%2 == 0){ crease.mountain(); }
					else { crease.valley(); }
				}
			}
		},this)
	},this);
	this.draw();
}
origami.reset();

origami.onMouseDown = function(event){ }
origami.onMouseUp = function(event){ }
origami.onMouseMove = function(event){ }
origami.onFrame = function(event){ }
