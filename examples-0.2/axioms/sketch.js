let origami = RabbitEar.Origami("origami-cp", {padding:0.05});
let folded = RabbitEar.Origami("origami-fold", {padding:0.05, shadows:true});

origami.markLayer = origami.group();
origami.interactionLayer = origami.group();
origami.arrowLayer = origami.group();
origami.controls = RE.svg.controls(origami, 0);
origami.axiom = undefined;
origami.subSelect = 0;

// 1: hard reset, axiom has changed
origami.setNewAxiom = function(axiom) {
	origami.axiom = axiom;
	origami.interactionLayer.removeChildren();
	
	origami.controls.removeAll();
	let paramCount = [null, 2, 2, 4, 3, 4, 6, 5];
	Array.from(Array(paramCount[axiom]))
		.map(_ => [Math.random(), Math.random()])
		.map(p => ({position: p, radius: 0.02, fill:"#e14929"}))
		.forEach(options => origami.controls.add(options));

	origami.update();
}

// 2: soft reset, axiom params updated
origami.update = function() {
	// clear and re-fold axiom
	origami.cp = RabbitEar.bases.square;
	
	let pts = origami.controls.map(p => p.position);
	let lines = [];

	// convert points to lines if necessary
	switch (origami.axiom){
		case 3:
		case 6:
		case 7:
			let v = [
				[pts[2][0] - pts[0][0], pts[2][1] - pts[0][1]],
				[pts[3][0] - pts[1][0], pts[3][1] - pts[1][1]]
			];
			lines = [RE.Line(pts[0], v[0]), RE.Line(pts[1], v[1])];
		break;
		case 4:
		case 5:
			lines = [RE.Line(pts[0], [pts[1][0]-pts[0][0], pts[1][1]-pts[0][1]])];
		break;
	}

	// axiom to get a crease line
	let creaseLine;
	switch (origami.axiom){
		case 1:
		case 2: creaseLine = RE.axiom(origami.axiom, ...pts);
		break;
		case 3: creaseLine = RE.axiom(origami.axiom,
							lines[0].point, lines[0].vector,
							lines[1].point, lines[1].vector)[origami.subSelect];
		break;
		case 4: creaseLine = RE.axiom(origami.axiom,
							lines[0].point, lines[0].vector,
							pts[2]);
		break;
		case 5: creaseLine = RE.axiom(origami.axiom,
							lines[0].point, lines[0].vector,
							pts[2], pts[3])[origami.subSelect];
		break;
		case 6: creaseLine = RE.axiom(origami.axiom,
							lines[0].point, lines[0].vector,
							lines[1].point, lines[1].vector,
							pts[4], pts[5])[origami.subSelect];
		break;
		case 7: creaseLine = RE.axiom(origami.axiom,
							lines[0].point, lines[0].vector,
							lines[1].point, lines[1].vector,
							pts[4]);
		break;
	}

	if (creaseLine === undefined) { return; }

	let crease = origami.cp.valleyFold(creaseLine[0], creaseLine[1], 0);
	if (crease) {
		crease.valley();
	}
	// until we get valleyFold returning the crease - create a duplicate
	let creaseEdge = origami.cp.boundary.clipLine(creaseLine);

	folded.cp = origami.cp;
	folded.fold();

	// draw axiom helper lines
	origami.markLayer.removeChildren();
	let auxLineStyle = "stroke:#e14929;stroke-width:0.005";
	lines
		.map(l => origami.cp.boundary.clipLine(l))
		.map(l => origami.markLayer.line(l[0][0], l[0][1], l[1][0], l[1][1]))
		.forEach(l => l.setAttribute("style", auxLineStyle));

	origami.arrowLayer.removeChildren();
	origami.drawArrowsForAxiom(origami.axiom, creaseEdge);
}

origami.drawArrowsForAxiom = function(axiom, crease){
	if (crease == null) { return; }

	let pts = origami.controls.map(p => p.position);
	switch (axiom){
		case 2:
			origami.arrowLayer.arcArrow(pts[0], pts[1], {side:pts[0][0]<pts[1][0]});
			break;
		// case 2:
		// 	var intersect = crease.nearestPoint(pts[0]);
		// 	origami.drawArrowAcross(crease, intersect);
		// 	break;
		case 5:
			var intersect = crease.nearestPoint(pts[2]);  // todo: or [3] ?
			origami.drawArrowAcross(crease, intersect);
			break;
		case 6:
			let intersect1 = crease.nearestPoint(pts[4]);
			let intersect2 = crease.nearestPoint(pts[5]);
			origami.drawArrowAcross(crease, intersect1);
			origami.drawArrowAcross(crease, intersect2);
			break;
		case 7:
			var intersect = crease.nearestPoint(pts[4]);
			origami.drawArrowAcross(crease, intersect);
			break;
		default:
			origami.drawArrowAcross(crease);
			break;
	}
}

origami.onMouseMove = function(event){
	if (!origami.mouse.isPressed){ return; }
	origami.update();
}

// intersect is a point on the line,
// the point which the arrow should be cast perpendicularly across
// when left undefined, intersect will be the midpoint of the line.
origami.drawArrowAcross = function(crease, crossing){
	if (crease == null) {
		console.warn("drawArrowAcross not provided the correct parameters");
		return;
	}
	if (crossing == null) {
		crossing = crease.midpoint();
	}

	let normal = [-crease.vector[1], crease.vector[0]];
	let perpLine = { point: crossing, vector: normal };
	let perpClipEdge = origami.cp.boundary.clipLine(perpLine);

	let shortLength = [perpClipEdge[0], perpClipEdge[1]]
		.map(function(n){ return n.distanceTo(crossing); },this)
		.sort(function(a,b){ return a-b; })
		.shift();

	// another place it can fail
	let pts = [perpClipEdge[0], perpClipEdge[1]]
		.map(n => n.subtract(crossing).normalize())
		.filter(v => v !== undefined)
		.map(v => v.scale(shortLength))
		.map(v => crossing.add(v))
	if (pts.length < 2) { return; }

	let arrowStyle = { side: pts[0][0]<pts[1][0] };
	origami.arrowLayer.arcArrow(pts[0], pts[1], arrowStyle);
}

var selectAxiom = function(n){
	// update DOM
	for(var i = 1; i < 8; i++){
		document.getElementById("btn-axiom-"+i).checked = false;
		// document.getElementById("btn-axiom-"+i).className = "btn btn-outline-light";
	}
	document.getElementById("btn-axiom-"+n).checked = true;
	// document.getElementById("btn-axiom-"+n).className = "btn btn-outline-light active";
	// update model
	["btn-option-a", "btn-option-b", "btn-option-c"]
		.forEach(s => document.querySelector("#"+s).style.opacity = 0);

	if (n === 3 || n === 5 || n === 6) {
		document.querySelector("#btn-option-a").style.opacity = 1;
		document.querySelector("#btn-option-b").style.opacity = 1;
	}
	if (n === 6) {
		document.querySelector("#btn-option-c").style.opacity = 1;
	}
	origami.setNewAxiom(n);
}

function setSubSel(s) {
	origami.subSelect = s;
	origami.update();
}

document.getElementById("btn-axiom-1").onclick = function(){ selectAxiom(1); }
document.getElementById("btn-axiom-2").onclick = function(){ selectAxiom(2); }
document.getElementById("btn-axiom-3").onclick = function(){ selectAxiom(3); }
document.getElementById("btn-axiom-4").onclick = function(){ selectAxiom(4); }
document.getElementById("btn-axiom-5").onclick = function(){ selectAxiom(5); }
document.getElementById("btn-axiom-6").onclick = function(){ selectAxiom(6); }
document.getElementById("btn-axiom-7").onclick = function(){ selectAxiom(7); }
document.getElementById("btn-option-a").onclick = function(){ setSubSel(0); }
document.getElementById("btn-option-b").onclick = function(){ setSubSel(1); }
document.getElementById("btn-option-c").onclick = function(){ setSubSel(2); }

selectAxiom(1);