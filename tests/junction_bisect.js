let junctionBisect
junctionBisect = RabbitEar.svg.image("canvas-junction-bisect", 500, 500, function() {
	if (junctionBisect != null) {
		junctionBisect.setup();
	}
});

junctionBisect.updateSectors = function() {
	let vmin = (junctionBisect.w > junctionBisect.h
		? junctionBisect.h
		: junctionBisect.w);
	let jp = junctionBisect.controls.map(p => p.position);
	let junction = RabbitEar.math
		.Junction([junctionBisect.w/2, junctionBisect.h/2], jp);
	RabbitEar.svg.removeChildren(junctionBisect.sectorLayer);
	let sectors = junction.sectors();
	let angles = sectors
		.map(s => s.vectors[0])
		.map(v => Math.atan2(v[1], v[0]));

	let radii = sectors.map(s =>
		vmin*0.4 - Math.pow(s.angle/(Math.PI*2), 0.5) * vmin*0.25
	);

	let wedges = angles.map((_,i,arr) => {
		return RabbitEar.svg.wedge(
			junctionBisect.w/2,
			junctionBisect.h/2, radii[i], angles[i], angles[(i+1)%arr.length
		])
	});
	wedges.forEach(w => w.setAttribute("pointer-events", "none"));
	let wedgeColors = ["#f1c14f","#314f69", "#e14929"];
	wedges.forEach((w,i) => w.setAttribute("fill", wedgeColors[i%3]));
	wedges.forEach(w => junctionBisect.sectorLayer.appendChild(w));

	junctionBisect.dotsLayer.removeChildren();
	let bisections = junction.sectors().map(s => s.bisect());
	let r2 = vmin*0.45;
	let dots = bisections.map(b => [
		b.point[0] + b.vector[0]*r2,
		b.point[1] + b.vector[1]*r2
	]).map(p => junctionBisect.dotsLayer.circle(p[0], p[1], 10));
//	dots.forEach((d,i) => d.setAttribute("fill", wedgeColors[i%3]));
	dots.forEach((d,i) => d.setAttribute("fill", "#000"));

	junctionBisect.controls.map(c =>
		junctionBisect.sectorLayer.line(junctionBisect.w/2, junctionBisect.h/2, c.position[0], c.position[1]),
	).forEach(l => {
		l.setAttribute("stroke", "#000");
		l.setAttribute("stroke-width", 6);
		l.setAttribute("stroke-linecap", "round");
	});
}

junctionBisect.setup = function() {
	if (junctionBisect.didSetup) { return; }

	junctionBisect.removeChildren();

	junctionBisect.drawLayer = RabbitEar.svg.group();
	junctionBisect.sectorLayer = RabbitEar.svg.group();
	junctionBisect.dotsLayer = RabbitEar.svg.group();
	junctionBisect.touchLayer = RabbitEar.svg.group();
	junctionBisect.appendChild(junctionBisect.sectorLayer);
	junctionBisect.appendChild(junctionBisect.drawLayer);
	junctionBisect.appendChild(junctionBisect.dotsLayer);
	junctionBisect.appendChild(junctionBisect.touchLayer);

	junctionBisect.controls = RabbitEar.svg.controls(junctionBisect, 3, {
		parent: junctionBisect.touchLayer,
		radius: junctionBisect.w*0.01,
		fill: "#000"
	});
	junctionBisect.controls.forEach(p => p.circle.remove());
	junctionBisect.controls.forEach((p,i) => {
		let r = (junctionBisect.w > junctionBisect.h 
			? junctionBisect.h*0.4
			: junctionBisect.w*0.4);
		let angle = Math.random() * Math.PI * 2;
		p.position = [
			junctionBisect.w/2 + r * Math.cos(angle),
			junctionBisect.h/2 + r * Math.sin(angle)
		];
	});
	// junctionBisect.sectorLines = junctionBisect.controls
	// 	.map(p => [junctionBisect.w/2, junctionBisect.h/2, p.position[0], p.position[1]])
	// 	.map(p => RabbitEar.svg.line(p[0], p[1], p[2], p[3]))
	// junctionBisect.sectorLines.forEach(line => junctionBisect.drawLayer.appendChild(line));
	// junctionBisect.sectorLines.forEach(line => line.setAttribute("stroke", "black"));
	// junctionBisect.sectorLines.forEach(line => line.setAttribute("stroke-width", 5));
	// junctionBisect.sectorLines.forEach(line => line.setAttribute("stroke-linecap", "round"));

	junctionBisect.controls.forEach(p => {
		p.positionDidUpdate = function(mouse){
			let angle = Math.atan2(
				mouse[1] - junctionBisect.h/2, 
				mouse[0] - junctionBisect.w/2
			);
			let r = (junctionBisect.w > junctionBisect.h
				? junctionBisect.h*0.4
				: junctionBisect.w*0.4);
			let x = junctionBisect.w/2 + r * Math.cos(angle);
			let y = junctionBisect.h/2 + r * Math.sin(angle);
			return [x, y];
		}
	});
	junctionBisect.updateSectors();
	junctionBisect.didSetup = true;
}
junctionBisect.setup();

junctionBisect.onMouseMove = function(mouse) {
	if (junctionBisect.controls.selected !== undefined) {
		junctionBisect.updateSectors();
	}
}

// junctionBisect.addEventListener("mousemove", function(mouse){
// 	if (junctionBisect.controls.selected !== undefined) {
// 		// let line = junctionBisect.sectorLines[junctionBisect.controls.selectedIndex];
// 		// line.setAttribute("x2", junctionBisect.controls.selected.position[0]);
// 		// line.setAttribute("y2", junctionBisect.controls.selected.position[1]);
// 		junctionBisect.updateSectors();
// 	}
// });

