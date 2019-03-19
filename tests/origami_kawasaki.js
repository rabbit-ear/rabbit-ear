let kawasakiSketch
kawasakiSketch = RabbitEar.svg.image("canvas-kawasaki", 500, 500, function() {
	if (kawasakiSketch != null) {
		kawasakiSketch.setup();
	}
});

kawasakiSketch.updateSectors = function() {
	let jp = kawasakiSketch.controls.map(p => p.position);
	let junction = RabbitEar.math
		.Junction([kawasakiSketch.width/2, kawasakiSketch.height/2], jp);
	let kawasakiNormalized = junction
		.alternatingAngleSum()
	 	.map(n => 0.5+0.5*(Math.PI - n) / (Math.PI) );
	RabbitEar.svg.removeChildren(kawasakiSketch.sectorLayer);
	let angles = junction.sectors()
		.map(s => s.vectors[0])
		.map(v => Math.atan2(v[1], v[0]));
	let r = (kawasakiSketch.width > kawasakiSketch.height
		? kawasakiSketch.height*0.45
		: kawasakiSketch.width*0.45);
	let wedges = angles.map((_,i,arr) => {
		let thisr = Math.sqrt(kawasakiNormalized[i%2]) * r;
		return RabbitEar.svg.wedge(
			kawasakiSketch.width/2,
			kawasakiSketch.height/2, thisr, angles[i], angles[(i+1)%arr.length
		])
	});
	let flatFoldable = Math.abs(kawasakiNormalized[0] - kawasakiNormalized[1]) < 0.02;
	let wedgeColors = flatFoldable
		? ["#f1c14f", "#f1c14f"]
		: ["#314f69", "#e35536"];
	wedges.forEach((w,i) => w.setAttribute("fill", wedgeColors[i%2]));
	wedges.forEach(w => kawasakiSketch.sectorLayer.appendChild(w));
}

kawasakiSketch.setup = function() {
	if (kawasakiSketch.didSetup) { return; }

	kawasakiSketch.removeChildren();

	kawasakiSketch.drawLayer = RabbitEar.svg.group();
	kawasakiSketch.sectorLayer = RabbitEar.svg.group();
	kawasakiSketch.touchLayer = RabbitEar.svg.group();
	kawasakiSketch.appendChild(kawasakiSketch.sectorLayer);
	kawasakiSketch.appendChild(kawasakiSketch.drawLayer);
	kawasakiSketch.appendChild(kawasakiSketch.touchLayer);

	kawasakiSketch.controls = RabbitEar.svg.controls(kawasakiSketch, 8, {
		parent: kawasakiSketch.touchLayer,
		radius: kawasakiSketch.width*0.01,
		fill: "#000"
	});
	kawasakiSketch.controls.forEach(p => p.circle.remove());
	kawasakiSketch.controls.forEach((p,i) => {
		let r = (kawasakiSketch.width > kawasakiSketch.height 
			? kawasakiSketch.height*0.45
			: kawasakiSketch.width*0.45);
		let angle = Math.random() * Math.PI * 2;
		p.position = [
			kawasakiSketch.width/2 + r * Math.cos(angle),
			kawasakiSketch.height/2 + r * Math.sin(angle)
		];
	});
	kawasakiSketch.sectorLines = kawasakiSketch.controls
		.map(p => [kawasakiSketch.width/2, kawasakiSketch.height/2, p.position[0], p.position[1]])
		.map(p => RabbitEar.svg.line(p[0], p[1], p[2], p[3]))
	kawasakiSketch.sectorLines.forEach(line => kawasakiSketch.drawLayer.appendChild(line));
	kawasakiSketch.sectorLines.forEach(line => line.setAttribute("stroke", "black"));
	kawasakiSketch.sectorLines.forEach(line => line.setAttribute("stroke-width", 5));
	kawasakiSketch.sectorLines.forEach(line => line.setAttribute("stroke-linecap", "round"));

	kawasakiSketch.controls.forEach(p => {
		p.positionDidUpdate = function(mouse){
			let angle = Math.atan2(
				mouse[1] - kawasakiSketch.height/2, 
				mouse[0] - kawasakiSketch.width/2
			);
			let r = (kawasakiSketch.width > kawasakiSketch.height
				? kawasakiSketch.height*0.45
				: kawasakiSketch.width*0.45);
			let x = kawasakiSketch.width/2 + r * Math.cos(angle);
			let y = kawasakiSketch.height/2 + r * Math.sin(angle);
			return [x, y];
		}
	});
	kawasakiSketch.updateSectors();
	kawasakiSketch.didSetup = true;
}
kawasakiSketch.setup();

kawasakiSketch.addEventListener("mousemove", function(mouse){
	if (kawasakiSketch.controls.selected !== undefined) {
		let line = kawasakiSketch.sectorLines[kawasakiSketch.controls.selectedIndex];
		line.setAttribute("x2", kawasakiSketch.controls.selected.position[0]);
		line.setAttribute("y2", kawasakiSketch.controls.selected.position[1]);
		kawasakiSketch.updateSectors();
	}
});

