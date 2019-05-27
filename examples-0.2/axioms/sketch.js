let origami = RabbitEar.Origami("origami-cp", {padding:0.05, diagram:true});
let folded = RabbitEar.Origami("origami-fold", {padding:0.05});//,shadows:true});

origami.markLayer = RE.svg.group();
origami.insertBefore(origami.markLayer,
	origami.querySelectorAll(".boundaries")[0].nextSibling);
origami.controls = RE.svg.controls(origami, 0);
origami.axiom = undefined;
origami.subSelect = 0;  // some axioms have 2 or 3 results

// a lookup for expected parameters in axiom() func. is param a point or line?
const paramIsLine = [null, 
	[false, false],
	[false, false],
	[true, true, true, true],
	[true, true, false],
	[true, true, false, false],
	[true, true, true, true, false, false],
	[true, true, true, true, false]
];

// 1: hard reset, axiom has changed
origami.setAxiom = function(axiom) {
	if (axiom < 1 || axiom > 7) { return; }
	// axiom number buttons
	document.querySelectorAll("[id^=btn-axiom]")
		.forEach(b => b.className = "button");
	document.querySelector("#btn-axiom-"+axiom).className = "button red";
	// sub options buttons
	let optionCount = [null, 0, 0, 2, 0, 2, 3, 0][axiom];
	document.querySelectorAll("[id^=btn-option")
		.forEach((b,i) => b.style.opacity = i < optionCount ? 1 : 0);
	origami.setSubSel(0);
	// origami.setSubSel(origami.subSelect);
	
	origami.controls.removeAll();
	Array.from(Array([null, 2, 2, 4, 3, 4, 6, 5][axiom]))
		.map(_ => [Math.random(), Math.random()])
		.map((p,i) => ({
			position: p,
			radius: paramIsLine[axiom][i] ? 0.01 : 0.02,
			stroke: paramIsLine[axiom][i] ? "#eb3" : "black",
			fill: paramIsLine[axiom][i] ? "#eb3" : "#d42"})
		).forEach(options => origami.controls.add(options));

	origami.axiom = axiom;
	origami.update();
}

origami.setSubSel = function(s) {
	document.querySelectorAll("[id^=btn-option")
		.forEach(b => b.className = "button");
	document.querySelector("#btn-option-"+s).className = "button red";

	origami.subSelect = s;
	origami.update();
}

// 2: soft reset, axiom params updated
origami.update = function() {
	// clear and re-fold axiom
	origami.cp = RabbitEar.bases.square;

	// convert the input-control-points into marks and lines,
	// the proper arguments for axiom method calls
	let pts = origami.controls.map(p => p.position);
	let lines = [];
	switch (origami.axiom) {
		case 3: case 6: case 7:
			let v = [
				[pts[2][0] - pts[0][0], pts[2][1] - pts[0][1]],
				[pts[3][0] - pts[1][0], pts[3][1] - pts[1][1]]
			];
			lines = [RE.Line(pts[0], v[0]), RE.Line(pts[1], v[1])];
			break;
		case 4: case 5:
			lines = [RE.Line(pts[0], [pts[1][0]-pts[0][0], pts[1][1]-pts[0][1]])];
			break;
	}

	// axiom to get a crease line
	let axiomInfo;
	switch (origami.axiom){
		case 1:
		case 2: axiomInfo = RE.axiom(origami.axiom, ...pts);
			break;
		case 3: axiomInfo = RE.axiom(origami.axiom,
							lines[0].point, lines[0].vector,
							lines[1].point, lines[1].vector);
			break;
		case 4: axiomInfo = RE.axiom(origami.axiom,
							lines[0].point, lines[0].vector,
							pts[2]);
			break;
		case 5: axiomInfo = RE.axiom(origami.axiom,
							lines[0].point, lines[0].vector,
							pts[2], pts[3]);
			break;
		case 6: axiomInfo = RE.axiom(origami.axiom,
							lines[0].point, lines[0].vector,
							lines[1].point, lines[1].vector,
							pts[4], pts[5]);
			break;
		case 7: axiomInfo = RE.axiom(origami.axiom,
							lines[0].point, lines[0].vector,
							lines[1].point, lines[1].vector,
							pts[4]);
			break;
	}
	// draw axiom helper lines
	origami.markLayer.removeChildren();
	lines.map(l => origami.cp.boundary.clipLine(l))
		.map(l => origami.markLayer.line(l[0][0], l[0][1], l[1][0], l[1][1]))
		.forEach(l => l.setAttribute("style", "stroke:#eb3;stroke-width:0.01;"));

	let options = {
		color: "#eb3",
		strokeWidth: 0.01, width: 0.025, length: 0.06, padding: 0.013,
	};
	lines.map(l => [l.point, l.point.add(l.vector)])
		.map(pts => origami.markLayer.straightArrow(pts[0], pts[1], options))

	if (axiomInfo === undefined) { return; }
	// axiom 3, 5, and 6 give us back multiple solutions inside an array
	// if (axiomInfo.constructor === Array) {
	// 	axiomInfo = axiomInfo[origami.subSelect];
	// 	if (axiomInfo === undefined) { return; }
	// }

	let valid = RE.core.apply_axiom(axiomInfo, origami.cp.boundary.points);

	// origami.preferences.styleSheet = valid[origami.subSelect] == null
	// 	? ".valley  { stroke: red; }"
	// 	: undefined;

	origami.preferences.styleSheet = valid[origami.subSelect] == null
		? ".valley { stroke: #e53; }"
		: undefined;

	origami.cp.valleyFold(axiomInfo.solutions[origami.subSelect]);
	let diagram = RE.core.build_diagram_frame(origami.cp);

	origami.cp["re:diagrams"] = [diagram];
	origami.draw();

	folded.cp = origami.cp;
	folded.fold();
}

origami.onMouseMove = function(event){
	if (!origami.mouse.isPressed){ return; }
	origami.update();
}

document.querySelectorAll("[id^=btn-axiom]")
	.forEach(b => b.onclick = function(e) {
		origami.setAxiom(parseInt(e.target.id.substring(10,11)));
	});
document.querySelectorAll("[id^=btn-option]")
	.forEach(b => b.onclick = function(e) {
		origami.setSubSel(parseInt(e.target.id.substring(11,12)));
	});

origami.setAxiom(1);