var myCodeMirror = CodeMirror(document.getElementById("code-container"), {
	value: "",
	mode:  "javascript",
	lineNumbers: true,
	theme: "idle"
}).on('change', (editor,event) => {
	// console.log( editor.getValue() );
	try{
		resetCP();
		eval(editor.getValue());
		origami.draw();
		// success
		consoleDiv.innerHTML = "";
	}
	catch(err){
		consoleDiv.innerHTML = err;
		console.log(err);
	}
});

// after code mirror sets up, trigger origami.redraw()

var consoleDiv = document.createElement("div");
consoleDiv.id = "code-console";
document.getElementById("code-container").appendChild(consoleDiv)

var cp = new CreasePattern();
var origami = new OrigamiPaper("canvas", cp);
origami.setPadding(0.05);

//reflection
// programmatically inspect object
// inspecting an object and doing something with it
function getAllMethods(object) {
	return Object.getOwnPropertyNames(object).filter(function(property) {
		return typeof object[property] == 'function';
	});
}
console.log(getAllMethods(CreasePattern.prototype));

// var boundCrease = cp.crease.bind(cp)
// window.creaseRay = cp.creaseRay;
window.crease = cp.crease.bind(cp);

// console.log(window.cp);
// function creaseRay(ray) {
// 		cp.creaseRay(ray);
// }

// console.log(Object.getOwnPropertyNames(CreasePattern));

function resetCP(){
	origami.cp.clear();
}

origami.onFrame = function(event){ }
origami.onResize = function(event){ }
origami.onMouseMove = function(event){ }
origami.onMouseDown = function(event){
	var nearest = this.cp.nearest(event.point);
	console.log(nearest);
	var keys = Object.keys(nearest);
	var consoleString = "";
	for(var i = 0; i < keys.length; i++){
		if(nearest[keys[i]] !== undefined){
			var cpObject = "cp." + keys[i] + "s[" + nearest[keys[i]].index + "]";
			consoleString += keys[i] + ": <a href='#' onclick='injectCode(\"" + cpObject + "\")'>" + cpObject + "</a><br>";
		}
	}
	consoleDiv.innerHTML = consoleString;
	// var nearestEdge = this.cp.nearest(event.point).edge || {};
	// if(nearestEdge !== undefined){
	// 	updateCodeMirror("cp.edges[" + nearestEdge.edge.index + "]");
	// 	// console.log( nearest.edge.edge.index );
	// }
}

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

injectCode("//0 to 1, intensity of wave\nvar wave = 1;\n\nvar SIZE = 10;\nvar points = [];\nfor(var i = 0; i < SIZE; i++){\n	var inner = [];\n	for(var j = 0; j < SIZE; j++){ inner.push(j); }\n	points.push(inner);\n}\npoints = points.map(function(row,y){\n	return row.map(function(point,x){\n		return new XY(x/(SIZE-1) + Math.cos(y)*0.05 * wave, \n                      y/(SIZE-1) + (x%2)*0.07);\n	},this);\n},this);\npoints.forEach(function(row,j){\n	row.forEach(function(point,i){\n		// crease zig zag rows\n		if(i < row.length-1){\n			var nextHorizPoint = row[ (i+1)%row.length ];\n			var crease = cp.crease(point, nextHorizPoint);\n			if(crease != undefined){\n				if(j%2 == 0){ crease.mountain(); }\n				else { crease.valley(); }\n			}\n		}\n		// crease lines connecting between zig zag rows\n		if(j < points.length-1){\n			var nextRow = points[ (j+1)%points.length ];\n			var nextVertPoint = nextRow[ i ];\n			var crease = cp.crease(point, nextVertPoint);\n			if(crease != undefined){\n				if((i+j+1)%2 == 0){ crease.mountain(); }\n				else { crease.valley(); }\n			}\n		}\n	})\n},this);");
