var myCodeMirror = CodeMirror(document.getElementById("codeColumn"), {
	value: "",
	mode:  "javascript",
	lineNumbers: true,
	theme: "mdn-like"
}).on('change', (editor,event) => {
	// console.log( editor.getValue() );
	try{
		resetCP();
		eval(editor.getValue());
		project.draw();
	}
	catch(err){
		// console.log("broken");
	}
});

var cp = new CreasePattern();
var project = new OrigamiPaper("canvas", cp);
project.setPadding(0.05);

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
	project.cp.clear();
}

project.onFrame = function(event){ }
project.onResize = function(event){ }
project.onMouseMove = function(event){ }
project.onMouseDown = function(event){
	var nearest.edge = this.cp.nearest(event.point).edge || {};
	if(nearest.edge.edge !== undefined){
		updateCodeMirror("cp.edges[" + nearest.edge.edge.index + "]");
		// console.log( nearest.edge.edge.index );
	}
}

function updateCodeMirror(data){
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
	doc.replaceRange(newline+data, pos);
}
