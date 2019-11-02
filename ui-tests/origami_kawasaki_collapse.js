let collapse;
collapse = RabbitEar.svg("canvas-kawasaki-collapse", 500, 500, function() {
	if (collapse != null) {
		collapse.setup();
	}
});

collapse.setup = function() {
	if (collapse.didInitialize) { return; }
	collapse.STROKE_WIDTH = collapse.w * 0.01;
	collapse.removeChildren();
	collapse.mountainLayer = RabbitEar.svg.group();
	collapse.appendChild(collapse.mountainLayer);
	collapse.valleyLayer = RabbitEar.svg.group();
	collapse.appendChild(collapse.valleyLayer);

	let r = RabbitEar.svg.rect(0, 0, 500, 500);
	r.setAttribute("fill", "#f8eed9");
	collapse.mountainLayer.appendChild(r);

	collapse.junction = undefined;
	let largest, vectors;
	do{
		vectors = [
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2,
		].map(a => [Math.cos(a), Math.sin(a)]);
		collapse.junction = RabbitEar.Junction.fromVectors([collapse.w/2, collapse.h/2], vectors);
		let interior_angles = collapse.junction.sectors().map(s => s.angle);
		largest = interior_angles.slice().sort((a,b) => b-a).shift();
	} while(largest > Math.PI * 0.9);
	let rays = vectors.map(v => RabbitEar.Ray(collapse.w/2, collapse.h/2, v[0], v[1]));
	let boundary = RabbitEar.convexPolygon([[0,0], [500,0], [500,500], [0,500]]);
	let ray_edges = rays.map(r => boundary.clipRay(r));
	let svgLines = ray_edges
		.map(e => RabbitEar.svg.line(e[0][0], e[0][1], e[1][0], e[1][1]));
	svgLines.forEach(l => {
		l.setAttribute("stroke", "#e14929");
		l.setAttribute("stroke-width", collapse.STROKE_WIDTH);
		l.setAttribute("stroke-linecap", "round");
		collapse.mountainLayer.appendChild(l);
	});
	collapse.solutions = collapse.junction.kawasaki_solutions();
	collapse.didInitialize = true;
}
collapse.setup();

// collapse.addEventListener("mousemove", function(mouse){
// 	collapse.didTouch(mouse);
// });
// collapse.addEventListener("mousedown", function(mouse){
// 	collapse.didTouch(mouse);
// });

collapse.onMouseMove = function(mouse) {
	collapse.didTouch(mouse);
}
collapse.onMouseDown = function(mouse) {
	collapse.didTouch(mouse);
}

collapse.didTouch = function(point) {
	RabbitEar.svg.removeChildren(collapse.valleyLayer);
	if (collapse.junction === undefined) { return; }
	let sectors = collapse.junction.sectors();
	let sector_index = collapse.junction.sectors()
		.map((s,i) => ({sector: s, i: i}))
		.filter(el => el.sector.contains(point))
		.map(el => el.i)
		.shift();
	if (sector_index === undefined) { return; }

	let vector = collapse.solutions[sector_index];
	if (vector === undefined) { return; }

	let valley_ray = RabbitEar.Ray(collapse.w/2, collapse.h/2, vector[0], vector[1]);
	let boundary = RabbitEar.convexPolygon([[0,0], [500,0], [500,500], [0,500]]);
	let valley_edge = boundary.clipRay(valley_ray);
	let e = valley_edge;
	let l = RabbitEar.svg.line(e[0][0], e[0][1], e[1][0], e[1][1]);
	l.setAttribute("stroke", "#314f69");
	l.setAttribute("stroke-width", collapse.STROKE_WIDTH);
	l.setAttribute("stroke-dasharray", collapse.STROKE_WIDTH*1.5 + " " + collapse.STROKE_WIDTH*2);
	l.setAttribute("stroke-linecap", "round");
	collapse.valleyLayer.appendChild(l);
}