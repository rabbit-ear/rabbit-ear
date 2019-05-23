let origami = RabbitEar.Origami("origami", {
	folding:true,
	padding:0.1,
	autofit:false
});

let steps = [JSON.parse(JSON.stringify(origami.cp))];
let instructions = [];

origami.onMouseUp = function(mouse) {
	steps.push(JSON.parse(JSON.stringify(origami.cp)));
}

document.querySelector("#reset-button").onclick = function() {
	origami.cp = RE.bases.square;
	steps = [];
}
document.querySelector("#back-button").onclick = function() {
	steps.pop();
	if (steps.length === 0) { return; }
	origami.cp = steps[steps.length-1];
	origami.fold();
}
document.querySelector("#print-button").onclick = function() {
	createSteps();
}

function createSteps() {
	let svgOptions = {
		width:250,
		height:250,
		frame: 1,
		padding: 0.15,
		diagram: true
		// shadows:true
	};
	
	fencepostDiagrams(steps);

	let svgs = steps
		.map(cp => RE.convert.FOLD_SVG.toSVG(cp, svgOptions));
	let writtenInstructions = svgs.map((svg, i) => {
		let d = steps[i]["re:diagrams"];
		return d == null ? "" : d.map(diag => diag["re:instructions"])
			.filter(a => a != null)
			.map(a => a.en) // english
			.join("\n");
	});

	let innerHTML = svgs
		.reduce((prev, curr, i) => prev + "<div>" + curr + "<p>" +
			(writtenInstructions[i] || "") + "</p></div>\n", "");
	// let innerHTML = svgs.join("\n");

	let grid_style = `html, body { width: 100%; margin: 0; }
body { display: grid; grid-template-columns: 33% 33% 33%; }
p { text-align: center; width:100%; }`;
	printHTML(innerHTML, grid_style);
}

function printHTML(innerHTML, css) {
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

function fencepostDiagrams(sequence) {
	let diagrams = Array.from(Array(sequence.length-1))
		.map((_,i) => sequence[i+1])
		.map(cp => cp["re:diagrams"]);

	sequence.forEach(cp => delete cp["re:diagrams"]);

	Array.from(Array(sequence.length-1))
		.map((_,i) => sequence[i])
		.forEach((cp,i) => cp["re:diagrams"] = diagrams[i]);
}


// let style = ":root{--crease-width: 0.005;}html, body {height: 100%;width: 100%;margin: 0;display: flex;flex-direction: column;}div {display: flex;justify-content: center;align-items: center;}svg {width: 100%;height: 100%;}svg * {stroke-width: var(--crease-width);stroke-linecap: round;stroke: black;}polygon {fill: none;stroke: none;stroke-linejoin: bevel;}.boundary {fill: linen;}.valley{stroke-dasharray: calc( var(--crease-width) * 1) calc( var(--crease-width) * 2);}.mark {stroke-width: calc( var(--crease-width) * 0.25);}.foldedForm .faces polygon {fill: rgba(220, 10, 100, 0.2);stroke: rgba(0, 0, 0, 0.2);}.foldedForm .faces .front {fill: linen;stroke: black;}.foldedForm .faces .back {fill: peru;stroke: black;}.foldedForm .creases line {stroke: none;} *{font-family:sans-serif;}";
