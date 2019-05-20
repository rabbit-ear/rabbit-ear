const OrigamiAndCode = function(origamiID, codeID, consoleID) {
	const editorDidUpdate = function(delta) {
		try {
			origami.reset();
			eval(origami.editor.getValue());
			origami.draw();
			consoleDiv.innerHTML = "";
			if (origami.codeDidUpdate !== undefined) { origami.codeDidUpdate(); }
		}
		catch(err) { consoleDiv.innerHTML = "<p>" + err + "</p>"; }
	};
	const reset = function() {
		origami.cp = RabbitEar.bases.square;
	};
	const injectCode = function(text) {
		origami.editor.session.insert({
			row: origami.editor.session.getLength(),
			column: 0
		}, text);
	};

	var origami = RabbitEar.Origami(origamiID, {padding:0.1});
	let consoleDiv = document.querySelector("#"+consoleID);

	try{
		origami.editor = ace.edit(codeID);
	} catch(err) {
		throw("internet down, or maybe Ace editor CDN moved. see index.html");
	}
	origami.editor.setTheme("ace/theme/monokai");
	origami.editor.setKeyboardHandler("ace/keyboard/sublime");
	origami.editor.session.setMode("ace/mode/javascript");
	origami.editor.session.on("change", editorDidUpdate);

	origami.onMouseDown = function(mouse){
		let nearest = origami.nearest(mouse);
		let keys = Object.keys(nearest);
		let consoleString = keys
			.filter(key => nearest[key] != null)
			.map(key => "origami.cp." + key + "[" + nearest[key].index + "]")
			.map((objStr,i) => keys[i]
				+ ": <a href='#' onclick='origami.injectCode(\""
				+ objStr + "\")'>" + objStr + "</a><br>")
			.reduce((a,b) => a+b, "");
		consoleDiv.innerHTML = "<p>" + consoleString + "</p>";
	};

	Object.defineProperty(origami, "injectCode", {value: injectCode});
	origami.reset = reset; // allow it to be overwritten
	origami.codeDidUpdate = undefined;  // to be called on non-error text change
	return origami;
};

let origami = OrigamiAndCode("origami", "editor", "console");

// bind things to the window
Object.defineProperty(window, "cp", {get:function(){return origami.cp;}});
// inspecting an object and doing something with it
// function getAllMethods(object) {
// 	return Object.getOwnPropertyNames(object)
// 		.filter(property => typeof object[property] == 'function');
// }
// console.log(getAllMethods(RabbitEar));

window.onload = function(){
	eval(origami.editor.getValue());
	origami.draw();
}