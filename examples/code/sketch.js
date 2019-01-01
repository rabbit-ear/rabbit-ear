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

var origami = new RabbitEar.Origami(document.getElementsByClassName("row")[0]);

// programmatically inspect object
// inspecting an object and doing something with it
function getAllMethods(object) {
	return Object.getOwnPropertyNames(object).filter(function(property) {
		return typeof object[property] == 'function';
	});
}
// console.log(getAllMethods(CreasePattern.prototype));

// window.crease = cp.crease.bind(cp);

function resetCP(){
	origami.cp = RabbitEar.bases.unitSquare;
}

origami.animate = function(event){ }
origami.onMouseMove = function(mouse){ }
origami.onMouseDown = function(mouse){
	var nearest = origami.nearest(mouse);
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
