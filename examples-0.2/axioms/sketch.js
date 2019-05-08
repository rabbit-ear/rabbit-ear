let origami = RabbitEar.Origami("origami-cp", {padding:0.05});
let folded = RabbitEar.Origami("origami-fold", {padding:0.05});

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
							pts[4], pts[5]);
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
			var intersect = crease.nearestPoint(pts[0]);
			origami.drawArrowAcross(crease, intersect);
			break;
		case 5:
			var intersect = crease.nearestPoint(pts[2]);  // todo: or [3] ?
			origami.drawArrowAcross(crease, intersect);
			break;
		case 6:
			var intersect1 = crease.nearestPoint({x:origami.marks[0].x, y:origami.marks[0].y});
			var intersect2 = crease.nearestPoint({x:origami.marks[1].x, y:origami.marks[1].y});
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

// intersect is a point on the line, the point which the arrow should be cast perpendicularly across
// when left undefined, intersect will be the midpoint of the line.
origami.drawArrowAcross = function(crease, crossing){

	if (crease == null) { return; }

	if (crossing == null) { crossing = crease.midpoint(); }

	var creaseNormal = crease.vector.rotateZ90().normalize();
	var perpLine = {
		point:{x:crossing.x, y:crossing.y},
		vector:{x:creaseNormal.x, y:creaseNormal.y}
	};
	var perpendicularInBoundary = origami.cp.boundary.clipLine(perpLine);

	var shortLength = [perpendicularInBoundary[0], perpendicularInBoundary[1]]
		.map(function(n){ return n.distanceTo(crossing); },this)
		.sort(function(a,b){ return a-b; })
		.shift();

	// another place it can fail
	let shortPerp = [perpendicularInBoundary[0], perpendicularInBoundary[1]]
		.map(n => n.subtract(crossing).normalize())
		.filter(v => v !== undefined)
		.map(v => v.scale(shortLength))
		.map(v => crossing.add(v))
	if (shortPerp.length < 2) { return; }

	let perpendicular = RE.Edge(shortPerp);

	var toMiddleOfPage = RE.Vector(0.5 - crossing[0], 0.5 - crossing[1]);
	var arrowPerp = (toMiddleOfPage.cross(creaseNormal) < 0) ? creaseNormal.rotateZ90() : creaseNormal.rotateZ270();

	var arrowheadWidth = 0.05;
	var arrowheadLength = 0.075;

	var arcBend = 0.1;
	// var arcMid = crossing.add(arrowPerp.scale(perpendicular.length * arcBend + arrowheadLength*0.2));
	var arcEnds = [perpendicular[0], perpendicular[1]]
		.map(function(n){
			var bezierTarget = crossing.add(arrowPerp.scale(perpendicular.length * arcBend * 2));
			var nudge = bezierTarget.subtract(n).normalize().scale(arrowheadLength + arrowheadLength*0.25);
			return n.add(nudge);
		},this);

	var controlTarget = crossing.add(arrowPerp.scale(perpendicular.length * (arcBend*2) + arrowheadLength*0.2));
	var curveControls = [arcEnds[0], arcEnds[1]].map(function(p){
		var distance = p.distanceTo(controlTarget);
		var vector = controlTarget.subtract(p).normalize().scale(distance*0.666);
		return p.add(vector);
	},this);

	// draw geometry
	let arrowFill = "stroke:none;fill:#000";
	let arrowStroke = "stroke:#000;stroke-width:0.01;fill:none;";

	var bez = origami.arrowLayer.bezier(
		arcEnds[0].x, arcEnds[0].y,
		curveControls[0].x, curveControls[0].y,
		curveControls[1].x, curveControls[1].y,
		arcEnds[1].x, arcEnds[1].y
	);
	bez.setAttribute("style", arrowStroke);

	let arrowVecs = [0,1].map(i => RE.Vector(
		arcEnds[i].x - curveControls[i].x,
		arcEnds[i].y - curveControls[i].y
	).normalize());

	[arcEnds[0], arcEnds[1]].forEach(function(point, i){
		// var tilt = vector.rotate( (i%2)*Math.PI ).rotate(0.35 * Math.pow(-1,i+1));
		// var arrowVector = perpendicular[i].subtract(point).normalize();
		var arrowVector = arrowVecs[i];
		var arrowNormal = arrowVector.rotateZ90();
		var segments = [
			point.add(arrowNormal.scale(-arrowheadWidth*0.375)), 
			point.add(arrowNormal.scale(arrowheadWidth*0.375)), 
			point.add(arrowVector.scale(arrowheadLength))
		];
		let arrowhead = origami.arrowLayer.polygon(segments);
		arrowhead.setAttribute("style", arrowFill)
	},this);

	///////////////////////////////////////////
	// debug lines
	// let debugYellowStyle = "stroke:#ecb233;stroke-width:0.005";
	// let debugBlueStyle = "stroke:#224c72;stroke-width:0.005";
	// let debugRedStyle = "stroke:#e14929;stroke-width:0.005";
	// var dbl = perpendicular;
	// origami.arrowLayer
	// 	.line(dbl[0].x, dbl[0].y, dbl[1].x, dbl[1].y)
	// 	.setAttribute("style", debugYellowStyle);
	// origami.arrowLayer.line(
	// 	crossing.x, crossing.y,
	// 	crossing.add(toMiddleOfPage).x, crossing.add(toMiddleOfPage).y
	// ).setAttribute("style", debugBlueStyle)
	// origami.arrowLayer.line(
	// 	curveControls[0].x, curveControls[0].y,
	// 	curveControls[1].x, curveControls[1].y
	// ).setAttribute("style", debugRedStyle)
	// origami.arrowLayer
	// 	.line(arcEnds[0].x, arcEnds[0].y, arcEnds[1].x, arcEnds[1].y)
	// 	.setAttribute("style", debugBlueStyle);
	// origami.arrowLayer.line(
	// 	arcEnds[0].x, arcEnds[0].y,
	// 	curveControls[0].x, curveControls[0].y
	// ).setAttribute("style", debugBlueStyle)
	// origami.arrowLayer.line(
	// 	curveControls[1].x, curveControls[1].y,
	// 	arcEnds[1].x, arcEnds[1].y
	// ).setAttribute("style", debugBlueStyle)

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

var whichAxiom = function(){
	for(var i = 1; i < 8; i++){
		if(document.getElementById("btn-axiom-"+i).className.indexOf("active") !== -1){ return i; }
	}
	return 0;
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