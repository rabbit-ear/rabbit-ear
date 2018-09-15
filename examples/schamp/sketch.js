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
var origami = new OrigamiPaper(document.getElementsByClassName("row")[0], cp);
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

injectCode("var pleats = 16;\n\ncp.pleat(pleats, cp.edges[0], cp.edges[1]);\n\n// the origins of each ray\nvar o = [0,0,0,0,1/pleats,1/pleats,-1/pleats,-1/pleats];\n\n// the directions of each ray\n[[1,0],[0,1],[-1,0],[0,-1],[1,0],[0,-1],[-1,0],[0,1]]\n.map(function(el,i){\n	return new Ray(0.5+o[i], 0.5-o[i], el[0], el[1]);\n},this).map(function(ray){\n	return new Polyline().rayReflectRepeat(ray, this.cp.edges);\n},this).forEach(function(polyline){\n	polyline.edges().forEach(function(edge){\n		cp.crease(edge);\n	},this);\n},this);");
