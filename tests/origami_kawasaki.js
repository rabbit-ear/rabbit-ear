let sketch = RabbitEar.svg.Image("canvas-kawasaki", function() {
	sketch.setup();
});

sketch.updateSectors = function() {
	let jp = sketch.controls.map(p => p.position);
	let kawasakiNormalized = RabbitEar.math
		.Junction([sketch.width/2, sketch.height/2], jp)
		.alternatingAngleSum()
	 	.map(n => 0.5+0.5*(Math.PI - n) / (Math.PI) );

	RabbitEar.svg.removeChildren(sketch.sectorLayer);
	let angles = sketch.controls
		.map(p => [p.position[0] - sketch.width/2, p.position[1] - sketch.height/2])
		.map(v => Math.atan2(v[1], v[0]))
		.sort((a,b) => a - b);
	let r = (sketch.width > sketch.height
		? sketch.height*0.45
		: sketch.width*0.45);
	let wedges = angles.map((_,i,arr) => {
		let thisr = Math.sqrt(kawasakiNormalized[i%2]) * r;
		return RabbitEar.svg.wedge(sketch.width/2, sketch.height/2, thisr, angles[i], angles[(i+1)%arr.length])
	});
	let flatFoldable = Math.abs(kawasakiNormalized[0] - kawasakiNormalized[1]) < 0.02;
	let wedgeColors = flatFoldable
		? ["#f1c14f", "#f1c14f"]
		: ["#314f69", "#e35536"];
	wedges.forEach((w,i) => w.setAttribute("fill", wedgeColors[i%2]));
	wedges.forEach(w => sketch.sectorLayer.appendChild(w));
}

sketch.setup = function() {
	sketch.removeChildren();

	sketch.drawLayer = RabbitEar.svg.group();
	sketch.sectorLayer = RabbitEar.svg.group();
	sketch.touchLayer = RabbitEar.svg.group();
	sketch.appendChild(sketch.sectorLayer);
	sketch.appendChild(sketch.drawLayer);
	sketch.appendChild(sketch.touchLayer);

	sketch.controls = RabbitEar.svg.controls(sketch, 8, {
		parent: sketch.touchLayer,
		radius: sketch.width*0.01,
		fill: "#000"
	});
	sketch.controls.forEach(p => p.circle.remove());
	sketch.controls.forEach((p,i) => {
		let r = (sketch.width > sketch.height 
			? sketch.height*0.45
			: sketch.width*0.45);
		let angle = Math.random() * Math.PI * 2;
		p.position = [
			sketch.width/2 + r * Math.cos(angle),
			sketch.height/2 + r * Math.sin(angle)
		];
	});
	sketch.sectorLines = sketch.controls
		.map(p => [sketch.width/2, sketch.height/2, p.position[0], p.position[1]])
		.map(p => RabbitEar.svg.line(p[0], p[1], p[2], p[3]))
	sketch.sectorLines.forEach(line => sketch.drawLayer.appendChild(line));
	sketch.sectorLines.forEach(line => line.setAttribute("stroke", "black"));
	sketch.sectorLines.forEach(line => line.setAttribute("stroke-width", 5));
	sketch.sectorLines.forEach(line => line.setAttribute("stroke-linecap", "round"));

	sketch.controls.forEach(p => {
		p.positionDidUpdate = function(mouse){
			let angle = Math.atan2(mouse[1] - sketch.height/2, mouse[0] - sketch.width/2);
			let r = (sketch.width > sketch.height
				? sketch.height*0.45
				: sketch.width*0.45);
			let x = sketch.width/2 + r * Math.cos(angle);
			let y = sketch.height/2 + r * Math.sin(angle);
			return [x, y];
		}
	});
	sketch.updateSectors();
}

sketch.addEventListener("mousemove", function(mouse){
	if (sketch.controls.selected !== undefined) {
		let line = sketch.sectorLines[sketch.controls.selectedIndex];
		line.setAttribute("x2", sketch.controls.selected.position[0]);
		line.setAttribute("y2", sketch.controls.selected.position[1]);
		sketch.updateSectors();
	}
});

