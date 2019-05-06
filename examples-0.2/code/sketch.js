
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.setKeyboardHandler("ace/keyboard/sublime");
editor.session.setMode("ace/mode/javascript");
editor.session.on("change", function(delta){
	try{
		resetCP();
		eval(editor.getValue());
		origami.draw();
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
var origami = RabbitEar.Origami("origami", {padding:0.1});

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
	origami.cp = RabbitEar.bases.square;
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
	consoleDiv.innerHTML = "<p>" + consoleString + "</p>";
	// var nearestEdge = this.cp.nearest(event.point).edge || {};
	// if(nearestEdge !== undefined){
	// 	updateCodeMirror("cp.edges[" + nearestEdge.edge.index + "]");
	// 	// console.log( nearest.edge.edge.index );
	// }
}
