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

	var origami = RabbitEar.Origami(origamiID, {padding:0.05});
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

document.querySelector("#interp-slider").oninput = function(event) {
	var v = parseFloat((event.target.value / 1000).toFixed(2));
	if(v < 0){ v = 0; }
	document.getElementById("interp-value").innerHTML = v;
	SLIDER = v;
	origami.reset();
}

var SLIDER = 0.5;
let origami = OrigamiAndCode("origami-cp", "editor", "console");
var folded = RabbitEar.Origami("origami-fold", {padding:0.05});

origami.miuraOri = function(points) {
	let boundary = RE.ConvexPolygon([[0,0], [1,0], [1,1], [0,1]]);
	points.forEach((row,j) => {
		row.forEach((point,i) => {
			// crease zig zag rows
			if(i < row.length-1){
				var nextHorizPoint = row[ (i+1)%row.length ];
				let clip = boundary.clipEdge(point, nextHorizPoint);
				if (clip !== undefined) {
					var crease = this.cp.creaseSegment(clip[0], clip[1]);
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
					var crease = this.cp.creaseSegment(clip[0], clip[1]);
					if(crease != null){
						if((i+j)%2 == 0){ crease.mountain(); }
						else { crease.valley(); }
					}
				}
			}
		})
	});
	this.cp.clean();
}

origami.reset = function(){
	origami.cp = RabbitEar.bases.square;
	// get points from code window
	let points = eval(origami.editor.getValue());
	if(points == undefined || points.constructor !== Array){ return; }

	delete origami.cp.onchange[0];
	origami.miuraOri(points);
	origami.cp.onchange[0] = function(){ origami.draw(); };
	origami.draw();

	folded.cp = origami.cp.copy();
	folded.fold();
}

origami.reset();

function download(text, filename, mimeType){
	var blob = new Blob([text], {type: mimeType});
	var url = window.URL.createObjectURL(blob);
	var a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
}

document.querySelector("#download-code").onclick = function(event) {
	let sliderText = "// let SLIDER = " + SLIDER + ";\n"
	let text = sliderText + origami.editor.getValue();
	download(text, "miura-ori-code.txt", "text/plain");
}

document.querySelector("#download-svg").onclick = function(event) {
	var svg = origami.cp.svg();
	var svgBlob = (new XMLSerializer()).serializeToString(svg);
	download(svgBlob, "origami.svg", "image/svg+xml");
}

document.querySelector("#download-fold").onclick = function(event) {
	var foldFile = JSON.stringify(origami.cp.json);
	download(foldFile, "origami.fold", "application/json");
}
