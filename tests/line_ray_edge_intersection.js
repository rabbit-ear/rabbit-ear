let lrex = RabbitEar.svg.image("canvas-line-ray-edge-intersection", 600, 300);

lrex.setup = function() {
	lrex.xingLayer = lrex.group();
	lrex.lineLayer = lrex.group();
	lrex.colors = ["#ecb233", "#195783", "#e44f2a"]
	lrex.lines = [lrex.line(), lrex.line(), lrex.line()];
	lrex.controls = RabbitEar.svg.controls(lrex, 6, {radius:8});
	lrex.controls.forEach(c => c.position = [
		Math.random()*lrex.w*0.8 + lrex.w*0.1,
		Math.random()*lrex.h*0.8 + lrex.h*0.1
	]);
	lrex.controls.forEach((c,i) => 
		c.circle.setAttribute("fill", lrex.colors[Math.floor(i/2)%3])
	);
	lrex.lines.forEach((l,i) => {
		l.setAttribute("stroke", lrex.colors[i%3]);
		l.setAttribute("stroke-width", 3);
		l.setAttribute("stroke-linecap", "round");
	});
	let p = 1000;
	lrex.boundary = RabbitEar.math.Polygon([
		[-p, -p], [lrex.w+p, -p], [lrex.w+p, lrex.h+p], [-p, lrex.h+p]
	]);
}
lrex.setup();

lrex.redraw = function(){
	let segments = Array.from(Array(3)).map((_,i) => [
		[lrex.controls[(i*2)+0].position[0], lrex.controls[(i*2)+0].position[1]],
		[lrex.controls[(i*2)+1].position[0], lrex.controls[(i*2)+1].position[1]]
	]);
	let line = RabbitEar.math.Line.fromPoints(lrex.controls[0].position, lrex.controls[1].position);
	let ray = RabbitEar.math.Ray.fromPoints(lrex.controls[2].position, lrex.controls[3].position);
	let edge = RabbitEar.math.Edge(lrex.controls[4].position, lrex.controls[5].position);

	segments[0] = lrex.boundary.clipLine(line);
	segments[1] = lrex.boundary.clipRay(ray);
	segments.forEach((segment, i) => segment.forEach((p, j) => {
		lrex.lines[i].setAttribute("x"+(j+1), p[0]);
		lrex.lines[i].setAttribute("y"+(j+1), p[1]);
	}));

	// intersection wedges
	lrex.xingLayer.removeChildren();
	let intersections = [
		// {p: line.intersectRay(ray), v: [line, ray], c: ["#ecb233", "#195783"]},
		// {p: ray.intersectEdge(edge), v: [ray, edge], c: ["#195783", "#e44f2a"]},
		// {p: edge.intersectLine(line), v: [edge, line], c: ["#e44f2a", "#ecb233"]}
		{p: line.intersectRay(ray), v: [line, ray], c: ["#ecb233", "#195783"]},
		{p: edge.intersectRay(ray), v: [ray, edge], c: ["#195783", "#e44f2a"]},
		{p: line.intersectEdge(edge), v: [edge, line], c: ["#e44f2a", "#ecb233"]}
	].filter(xing => xing.p != null);
	intersections.forEach(xing => xing.vecs = [
		xing.v[0].vector.normalize(),
		xing.v[0].vector.normalize().rotateZ180(),
		xing.v[1].vector.normalize(),
		xing.v[1].vector.normalize().rotateZ180()
	])
	intersections.forEach(xing => 
		xing.angles = xing.vecs
			.map(vec => Math.atan2(vec[1], vec[0]))
			.sort((a,b) => a-b)
	);

	let wedge_r = 10;
	let wedge_space = 3;
	let wedges = intersections
		.map(xing => xing.angles.map((_,i) => {
			let a = [xing.angles[i], xing.angles[(i+1)%xing.angles.length]];
			let dp = RabbitEar.math.core.geometry.bisect_vectors(
				[Math.cos(a[0]), Math.sin(a[0])],
				[Math.cos(a[1]), Math.sin(a[1])]
			)[0];
			let lc = (i === 3) ? Math.PI*2 : 0
			let interior = RabbitEar.math.core.geometry.counter_clockwise_angle2_radians(a[0], a[1]+lc);
			let r = wedge_space / Math.pow(interior / Math.PI, 0.8);
			let p = [xing.p[0] + dp[0]*r, xing.p[1] + dp[1]*r]
			let w = lrex.xingLayer.wedge(p[0], p[1], wedge_r, a[0], a[1]);
			w.setAttribute("fill", xing.c[i%2]);
			return w;
		})).reduce((a,b) => a.concat(b), [])
}
lrex.redraw();

lrex.onMouseMove = function(mouse){
	if (mouse.isPressed) {
		lrex.redraw();
	}
};
