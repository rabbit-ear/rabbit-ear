let origami = RE.Origami("canvas-arrows", {padding:0.1});
origami.drawLayer = origami.group();

origami.controls = RE.svg.controls(origami, 0);
Array.from(Array(4))
	.map(_ => [Math.random(), Math.random()])
	.map(p => ({position: p, radius: 0.02, fill:"#e14929"}))
	.forEach(options => origami.controls.add(options));

origami.onMouseMove = function(mouse) {
	let c = origami.controls;
	if (mouse.isPressed) {
		origami.drawLayer.removeChildren();
		// drawArrowAcross(c[0].position, c[1].position);
		let arrow = origami.arcArrow(c[0].position, c[1].position);
		origami.drawLayer.appendChild(arrow);
	}
}

origami.arcArrow = function(start, end, options) {
	let arrowGroup = RE.svg.group();

	let arrowFill = "stroke:none;fill:#000";
	let arrowStroke = "stroke:#000;stroke-width:0.01;fill:none;";
	let debugYellowStyle = "stroke:#ecb233;stroke-width:0.005";
	let debugBlueStyle = "stroke:#224c72;stroke-width:0.005";
	let debugRedStyle = "stroke:#e14929;stroke-width:0.005";

	let headW = 0.025;
	let headLen = 0.075;
	let arcBend = 0.15;

	let vector = [end[0]-start[0], end[1]-start[1]];
	let perpendicular = [vector[1], -vector[0]];
	let midpoint = [start[0] + vector[0]/2, start[1] + vector[1]/2];
	let len = Math.sqrt(vector[0]*vector[0] + vector[1]*vector[1]);
	let bezPoint = [
		midpoint[0] + perpendicular[0] * len * arcBend * 2,
		midpoint[1] + perpendicular[1] * len * arcBend * 2,
	];

	// var arcMid = midpoint.add(arrowPerp.scale(perpendicular.length * arcBend + headLen*0.2));
	let startPad = [bezPoint[0] - start[0], bezPoint[1] - start[1]];
	let endPad = [bezPoint[0] - end[0], bezPoint[1] - end[1]];
	let startPadLen = Math.sqrt(startPad[0]*startPad[0]+startPad[1]*startPad[1]);
	let endPadLen = Math.sqrt(endPad[0]*endPad[0]+endPad[1]*endPad[1]);
	let startPadNorm = [startPad[0]/startPadLen, startPad[1]/startPadLen];
	let endPadNorm = [endPad[0]/endPadLen, endPad[1]/endPadLen];

	let arcEnds = [[
		start[0]+startPadNorm[0]*headLen*1.25,
		start[1]+startPadNorm[1]*headLen*1.25
	],[
		end[0]+endPadNorm[0]*headLen*1.25,
		end[1]+endPadNorm[1]*headLen*1.25
	]];
	let l = arrowGroup.line(arcEnds[0][0], arcEnds[0][1], arcEnds[1][0], arcEnds[1][1]);
	l.setAttribute("style", debugBlueStyle);

	arrowGroup.line(arcEnds[0][0], arcEnds[0][1], bezPoint[0], bezPoint[1])
		.setAttribute("style", debugRedStyle);
	arrowGroup.line(arcEnds[1][0], arcEnds[1][1], bezPoint[0], bezPoint[1])
		.setAttribute("style", debugRedStyle);

	let curveStart = [start[0] + startPad[0]*0.66, start[1] + startPad[1]*0.66];
	let curveEnd = [end[0] + endPad[0]*0.66, end[1] + endPad[1]*0.66];

	arrowGroup.bezier(
		arcEnds[0][0], arcEnds[0][1],
		curveStart[0], curveStart[1],
		curveEnd[0], curveEnd[1],
		arcEnds[1][0], arcEnds[1][1]
	).setAttribute("style", arrowStroke);

	let startVec = [-startPadNorm[0], -startPadNorm[1]];
	let endVec = [-endPadNorm[0], -endPadNorm[1]];
	let startNormal = [startVec[1], -startVec[0]];
	let endNormal = [endVec[1], -endVec[0]];

	let startPoints = [
		[arcEnds[0][0]+startNormal[0]*-headW, arcEnds[0][1]+startNormal[1]*-headW],
		[arcEnds[0][0]+startNormal[0]*headW, arcEnds[0][1]+startNormal[1]*headW],
		[arcEnds[0][0]+startVec[0]*headLen, arcEnds[0][1]+startVec[1]*headLen]
	];
	let endPoints = [
		[arcEnds[1][0]+endNormal[0]*-headW, arcEnds[1][1]+endNormal[1]*-headW],
		[arcEnds[1][0]+endNormal[0]*headW, arcEnds[1][1]+endNormal[1]*headW],
		[arcEnds[1][0]+endVec[0]*headLen, arcEnds[1][1]+endVec[1]*headLen]
	];
	let arrowheadStart = arrowGroup.polygon(startPoints)
		.setAttribute("style", arrowFill);
	let arrowheadEnd = arrowGroup.polygon(endPoints)
		.setAttribute("style", arrowFill);

	return arrowGroup;

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
	// 	midpoint.x, midpoint.y,
	// 	midpoint.add(toMiddleOfPage).x, midpoint.add(toMiddleOfPage).y
	// ).setAttribute("style", debugBlueStyle);
	// origami.arrowLayer.line(
	// 	curveControls[0].x, curveControls[0].y,
	// 	curveControls[1].x, curveControls[1].y
	// ).setAttribute("style", debugRedStyle);
	// origami.arrowLayer
	// 	.line(arcEnds[0].x, arcEnds[0].y, arcEnds[1].x, arcEnds[1].y)
	// 	.setAttribute("style", debugBlueStyle);
	// origami.arrowLayer.line(
	// 	arcEnds[0].x, arcEnds[0].y,
	// 	curveControls[0].x, curveControls[0].y
	// ).setAttribute("style", debugBlueStyle);
	// origami.arrowLayer.line(
	// 	curveControls[1].x, curveControls[1].y,
	// 	arcEnds[1].x, arcEnds[1].y
	// ).setAttribute("style", debugBlueStyle);
	return arrowGroup;
}

// intersect is a point on the line,
// the point which the arrow should be cast perpendicularly across
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
	// ).setAttribute("style", debugBlueStyle);
	// origami.arrowLayer.line(
	// 	curveControls[0].x, curveControls[0].y,
	// 	curveControls[1].x, curveControls[1].y
	// ).setAttribute("style", debugRedStyle);
	// origami.arrowLayer
	// 	.line(arcEnds[0].x, arcEnds[0].y, arcEnds[1].x, arcEnds[1].y)
	// 	.setAttribute("style", debugBlueStyle);
	// origami.arrowLayer.line(
	// 	arcEnds[0].x, arcEnds[0].y,
	// 	curveControls[0].x, curveControls[0].y
	// ).setAttribute("style", debugBlueStyle);
	// origami.arrowLayer.line(
	// 	curveControls[1].x, curveControls[1].y,
	// 	arcEnds[1].x, arcEnds[1].y
	// ).setAttribute("style", debugBlueStyle);

}