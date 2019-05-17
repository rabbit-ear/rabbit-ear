let origami = RabbitEar.Origami("origami", {
	folding:true,
	padding:0.1,
	autofit:false
});

let steps = [origami.cp.json];

origami.onMouseUp = function(mouse) {
	steps.push(origami.cp.json);
}

document.querySelector("#reset-button").onclick = function() {
	origami.cp = RE.bases.square;
	steps = [];
}
document.querySelector("#back-button").onclick = function() {
	steps.pop();
	if (steps.length === 0) { return; }
	origami.cp = JSON.parse(steps[steps.length-1]);
	origami.fold();
}
document.querySelector("#print-button").onclick = function() {
	createSteps();
}

function createSteps() {
	let svgOptions = {width:250, height:250, frame: 1, padding: 0.15};
	let svgs = steps.map(json => RE.convert.FOLD_SVG.toSVG(json, svgOptions));
	let innerHTML = svgs.join("\n");
	printHTML(innerHTML);
}

function printHTML(innerHTML, css) {
	if (css == null) { css = ""; }
	let printFrame = document.createElement("iframe");
	printFrame.setAttribute("id", "print-frame");
	printFrame.setAttribute("style", "visibility:hidden; height:0; width:0; position:absolute;");
	printFrame.srcdoc = "<html><head><title>Rabbit Ear</title><style>" + css + "</style></head><body>" + innerHTML + "</body></html>";
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


// let style = ":root{--crease-width: 0.005;}html, body {height: 100%;width: 100%;margin: 0;display: flex;flex-direction: column;}div {display: flex;justify-content: center;align-items: center;}svg {width: 100%;height: 100%;}svg * {stroke-width: var(--crease-width);stroke-linecap: round;stroke: black;}polygon {fill: none;stroke: none;stroke-linejoin: bevel;}.boundary {fill: linen;}.valley{stroke-dasharray: calc( var(--crease-width) * 1) calc( var(--crease-width) * 2);}.mark {stroke-width: calc( var(--crease-width) * 0.25);}.foldedForm .faces polygon {fill: rgba(220, 10, 100, 0.2);stroke: rgba(0, 0, 0, 0.2);}.foldedForm .faces .front {fill: linen;stroke: black;}.foldedForm .faces .back {fill: peru;stroke: black;}.foldedForm .creases line {stroke: none;} *{font-family:sans-serif;}";
