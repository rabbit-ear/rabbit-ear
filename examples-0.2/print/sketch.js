let origami = RabbitEar.Origami("origami", {
	folding:true,
	padding:0.1,
	autofit:false
});

let style = ":root{--crease-width: 0.005;}html, body {height: 100%;width: 100%;margin: 0;display: flex;flex-direction: column;}div {display: flex;justify-content: center;align-items: center;}svg {width: 100%;height: 100%;}svg * {stroke-width: var(--crease-width);stroke-linecap: round;stroke: black;}polygon {fill: none;stroke: none;stroke-linejoin: bevel;}.boundary {fill: linen;}.valley{stroke-dasharray: calc( var(--crease-width) * 1) calc( var(--crease-width) * 2);}.mark {stroke-width: calc( var(--crease-width) * 0.25);}.foldedForm .faces polygon {fill: rgba(220, 10, 100, 0.2);stroke: rgba(0, 0, 0, 0.2);}.foldedForm .faces .front {fill: linen;stroke: black;}.foldedForm .faces .back {fill: peru;stroke: black;}.foldedForm .creases line {stroke: none;} *{font-family:sans-serif;}";

function popupPrint(innerHTML) {
	let popupWinindow = window.open('', '_blank', 'width=1000,height=1000,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
	popupWinindow.document.open();
	popupWinindow.document.write('<html><head><style></style></head><body onload="window.print()">' + innerHTML + '</html>');
	popupWinindow.document.close();
}

// document.querySelector("#print-button").onclick = function() {
function oldPrint() {
	popupWinindow.document.write('<html><head><style>.floor-plan { background-color: #eaf3f3;  border-radius: 2px;  }  .floor-plan svg { /* Is needed because svg is by default inline-block and thusthe wrapping div would get higher by some extra pixels.See https://stackoverflow.com/questions/24626908/*/  display: block;  }  .floor-plan .boundary {  fill: transparent;  stroke: #0A7A74;  stroke-width: 2px;  }  .dining-table rect, .dining-table ellipse {  fill: transparent;  stroke: #0A7A74;  stroke-width: 2px;  }  .dining-table.assigned rect, .dining-table.assigned ellipse {  fill: #0a7a74;  }  .dining-table.assigned tspan {  fill: #ffffff;  }  .dining-table.hasSpecialInformation rect, .dining-table.hasSpecialInformation ellipse {  stroke: red;  }  .dining-table.hasOnlyBreakfast rect, .dining-table.hasOnlyBreakfast ellipse {  fill: #0d2f2e;  }  .dining-table image {  opacity: 0.5;  }  tspan.table-number {  fill: #666;  }  tspan.guest-info {fill: #333; font-weight: bolder;  } </style></head><body onload="window.print()">' + innerContents + '</html>');

	// printJS('origami', 'html', );

	createSteps();

	printJS({ printable: 'origami', type: 'html', header: 'Rabbit Ear', style: style });
}



let steps = [origami.cp.json];

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

origami.onMouseDown = function(mouse) { }
origami.onMouseUp = function(mouse) {
	steps.push(origami.cp.json);
}
origami.onMouseMove = function(mouse) { }
origami.onMouseLeave = function(mouse) { }
origami.onMouseEnter = function(mouse) { }
origami.animate = function(event) { }

function createSteps() {
	let svgOptions = {width:250, height:250, frame: 1, padding: 0.15};
	let svgs = steps.map(json => RE.convert.FOLD_SVG.toSVG(json, svgOptions));
	let innerHTML = svgs.join("\n");
	popupPrint(innerHTML);
	// console.log(svgs);
}

