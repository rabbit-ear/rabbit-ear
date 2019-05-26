let origami = RabbitEar.Origami("origami", {
	folding:true,
	padding:0.1,
	autofit:false
});
let pattern = RE.Origami("pattern", {padding:0.1});

origami.onMouseMove = function(mouse) {
	if (mouse.isPressed) {
		pattern.cp = origami.cp;
	}
}

// pattern.onMouseDown = function() {
// 	pattern.backup = pattern.cp.copy();
// }

// pattern.onMouseMove = function(mouse) {
// 	if (mouse.isPressed) {
// 		pattern.cp = pattern.backup.copy();
// 		pattern.cp.valleyFold(mouse.pressed, mouse.drag);
// 		origami.cp = pattern.cp;
// 		origami.fold();
// 	}
// }

let steps = [JSON.parse(JSON.stringify(origami.cp))];

origami.onMouseUp = function(mouse) {
	steps.push(JSON.parse(JSON.stringify(origami.cp)));
}

document.querySelector("#reset-button").onclick = function() {
	origami.cp = RE.bases.square;
	pattern.cp = RE.bases.square;
	steps = [JSON.parse(JSON.stringify(origami.cp))];
}
document.querySelector("#back-button").onclick = function() {
	steps.pop();
	if (steps.length === 0) { return; }
	origami.cp = steps[steps.length-1];
	pattern.cp = origami.cp
	origami.fold();
}
document.querySelector("#print-button").onclick = function() {
	printDiagrams();
}

const printDiagrams = function() {
	
	// convert "re:construction" into "re:diagrams"
	let diagrams = Array.from(Array(steps.length-1))
		.map((_,i) => i + 1)
		.map(i => RE.core.build_diagram_frame(steps[i]));
	steps.forEach(cp => delete cp["re:diagrams"]); // clear old data if exists
	Array.from(Array(steps.length-1))
		.map((_,i) => steps[i])
		.forEach((cp,i) => cp["re:diagrams"] = [diagrams[i]]);

	// make SVGs of each step, including diagramming fold and arrows
	let svgs = steps
		.map(cp => RE.convert.FOLD_SVG.toSVG(cp, svgOptions));

	// get the written instructions (in english)
	let writtenInstructions = svgs
		.map((svg, i) => steps[i]["re:diagrams"])
		.filter(a => a != null)
		.map(seq => seq.map(a => a["re:instructions"])
			.filter(a => a != null)
			.map(inst => inst["en"])
			.join("\n")
		);

	// create html blob
	let innerHTML = svgs
		.reduce((prev, curr, i) => prev + 
			"<div>" + 
				curr + "<p>" + (writtenInstructions[i] || "") + "</p>" + 
			"</div>\n"
		, "");

	printHTML(innerHTML, page_style);
}

const printHTML = function(innerHTML, css) {
	if (css == null) { css = ""; }
	let printFrame = document.createElement("iframe");
	printFrame.setAttribute("id", "print-frame");
	printFrame.setAttribute("style",
		"visibility:hidden; height:0; width:0; position:absolute;");
	printFrame.srcdoc = "<html><head><title>Rabbit Ear</title><style>" + css +
		"</style></head><body>" + innerHTML + "</body></html>";
	document.getElementsByTagName("body")[0].appendChild(printFrame);
	printFrame.onload = function() {
		try {
			printFrame.focus();
			printFrame.contentWindow.print();
		} catch (error) {
			console.warn(error);
		} finally {
			document.getElementsByTagName("body")[0].removeChild(printFrame);
		}
	}
}

const svgOptions = {
	width:250,
	height:250,
	frame: 1,
	padding: 0.15,
	diagram: true,
	stylesheet: svg_style
	// shadows:true
};

const svg_style = `
svg { --crease-width: 0.015; }
svg * {
  stroke-width: var(--crease-width);
  stroke-linecap: round;
  stroke: black;
}
polygon { fill: none; stroke: none; stroke-linejoin: bevel; }
.boundary { fill: white; stroke: black; }
.mark { stroke: #AAA; }
.mountain { stroke: #00F; }
.valley {
  stroke: #000;
  stroke-dasharray:calc(var(--crease-width)*1.333) calc(var(--crease-width)*2);
}
.foldedForm .boundary {fill: none;stroke: none;}
.foldedForm .faces polygon { stroke: #000; }
.foldedForm .faces .front { fill: #FFF; }
.foldedForm .faces .back { fill: #DDD; }
.foldedForm .creases line { stroke: none; }
`;

const page_style = `
html, body {
	width: 100%;
	margin: 0;
}
body {
	display: grid;
	grid-template-columns: 33% 33% 33%;
	font-family: 'Montserrat', sans-serif;
	font-size: 130%;
}
p {
	text-align: center;
	width: 100%;
	margin-bottom: 3rem;
}
`;
