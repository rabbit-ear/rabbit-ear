let vecSketchCallback;

svg.size(-1, -1, 2, 2);

const drawLayer = svg.g();
const dotLayer = svg.g();

var touches;
var dotX;
var dotY;
var v;
var normalized;
var cross;

	dotLayer.removeChildren();
	var randAngle = Math.random() * Math.PI * 2;
	touches = [
		{pos: [Math.cos(randAngle),
		       Math.sin(randAngle)],
		 svg: svg.circle(0.05)}
	];
	touches.forEach(p => {
		p.svg.setAttribute("fill", "#e53");
		dotLayer.appendChild(p.svg);
	});


const update = function (p, i, points) {
	v = ear.vector(p);
	normalized = v.normalize();
	cross = v.cross([0,0,1]);
	dotX = v.dot([1,0,0]);
	dotY = v.dot([0,1,0]);

	drawLayer.removeChildren();

	// dot product
	let dotXLine = drawLayer.line(0, 0, dotX, 0);
	let dotYLine = drawLayer.line(0, 0, 0, dotY);
	dotXLine.setAttribute("stroke", "#fb4");
	dotYLine.setAttribute("stroke", "#fb4");
	dotXLine.setAttribute("stroke-width", 0.02);
	dotYLine.setAttribute("stroke-width", 0.02);
	dotXLine.setAttribute("stroke-linecap", "round");
	dotYLine.setAttribute("stroke-linecap", "round");

	let dotXdash = drawLayer.line(v.x, v.y, dotX, 0);
	let dotYdash = drawLayer.line(v.x, v.y, 0, dotY);
	dotXdash.setAttribute("stroke", "#fb4");
	dotYdash.setAttribute("stroke", "#fb4");
	dotXdash.setAttribute("stroke-width", 0.02);
	dotYdash.setAttribute("stroke-width", 0.02);
	dotXdash.setAttribute("stroke-linecap", "round");
	dotYdash.setAttribute("stroke-linecap", "round");
	dotXdash.setAttribute("stroke-dasharray", "0.025 0.05");
	dotYdash.setAttribute("stroke-dasharray", "0.025 0.05");

	// cross product
	let crossLine = drawLayer.line(0, 0, cross.x, cross.y);
	crossLine.setAttribute("stroke", "#158");
	crossLine.setAttribute("stroke-width", 0.02);
	crossLine.setAttribute("stroke-linecap", "round");
	crossLine.setAttribute("stroke-dasharray", "0.025 0.05");
	let crossDot = drawLayer.circle(cross.x, cross.y, 0.05);
	crossDot.setAttribute("fill", "#158");

	let crossLen = cross.magnitude;
	let crossAngle = Math.atan2(cross.y, cross.x);
	let crossA = 0, crossB = 0;
	if (cross.x > 0 && cross.y > 0){ crossA = 0;  crossB = crossAngle; }
	if (cross.x > 0 && cross.y < 0){ crossA = crossAngle;  crossB = 0; }
	if (cross.x < 0 && cross.y > 0){ crossA = crossAngle;  crossB = Math.PI; }
	if (cross.x < 0 && cross.y < 0){ crossA = Math.PI;  crossB = crossAngle; }

	let crossArc1 = drawLayer.arc(0, 0, crossLen, crossA, crossB);
	crossArc1.setAttribute("stroke", "#158");
	crossArc1.setAttribute("fill", "none");
	crossArc1.setAttribute("stroke-width", 0.02);
	crossArc1.setAttribute("stroke-linecap", "round");
	crossArc1.setAttribute("stroke-dasharray", "0.0001 0.05");

	let line = drawLayer.line(0, 0, normalized.x, normalized.y);
	line.setAttribute("stroke", "#e53");
	line.setAttribute("stroke-width", 0.02);
	line.setAttribute("stroke-linecap", "round");

	let normLen = normalized.magnitude;
	let normAngle = Math.atan2(normalized.y, normalized.x);
	let nA = 0, nB = 0;
	if (normalized.x > 0 && normalized.y > 0){ nA = 0;  nB = normAngle; }
	if (normalized.x > 0 && normalized.y < 0){ nA = normAngle;  nB = 0; }
	if (normalized.x < 0 && normalized.y > 0){ nA = normAngle;  nB = Math.PI; }
	if (normalized.x < 0 && normalized.y < 0){ nA = Math.PI;  nB = normAngle; }

	let normArc = drawLayer.arc(0, 0, normLen, nA, nB);
	normArc.stroke("#e53");
	normArc.fill("none");
	normArc.strokeWidth(0.02);
	normArc.strokeLinecap("round");
	normArc.strokeDasharray("0.025 0.05");
}

svg.controls(1)
	.svg(() => svg.circle(0.05).fill("#e53"))
	.position(() => [Math.random(), Math.random()])
	.onChange(update, true);
