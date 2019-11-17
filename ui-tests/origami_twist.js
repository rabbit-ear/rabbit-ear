let twist = RabbitEar.svg("canvas-convex-twist", 500, 500);

twist.setup = function() {

	twist.STROKE_WIDTH = twist.w * 0.01;
	twist.RADIUS = twist.w * 0.02;

	twist.polygon = RabbitEar.svg.polygon();
	twist.polygon.setAttribute("stroke", "#e14929");//"#ecb233");
	twist.polygon.setAttribute("stroke-width", twist.STROKE_WIDTH);
	twist.polygon.setAttribute("fill", "#f8eed9");
	twist.polygon.setAttribute("stroke-linecap", "round");
	twist.appendChild(twist.polygon);

	twist.creaseLayer = RabbitEar.svg.group();
	twist.errorLayer = RabbitEar.svg.group();
	twist.appendChild(twist.creaseLayer);
	twist.appendChild(twist.errorLayer);

	twist.controls = RabbitEar.svg.controls(twist, 8, {
		radius: twist.RADIUS,
		fill: "#ecb233"
	});
	twist.controls.forEach(control => control.position = [
		Math.random()*twist.w*0.5 + twist.w*0.25, 
		Math.random()*twist.h*0.5 + twist.h*0.25
	]);
}
twist.setup();

twist.rebuildHull = function(){
	let points = twist.controls.map(t => t.position);
	twist.poly = RabbitEar.convexPolygon.convexHull(points);
	let pointsString = twist.poly.points.reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	twist.polygon.setAttribute("points", pointsString);
}

twist.rebuildCreases = function() {
	RabbitEar.svg.removeChildren(twist.creaseLayer);
	let poly_junctions = twist.poly.points.map((center, i, arr) => ({
		center: center,
		points: [arr[(i+1)%arr.length], arr[(i+arr.length-1)%arr.length]]
	})).map(el => RabbitEar.Junction(el.center, el.points));
	let poly_sectors = poly_junctions.map(j => j.sectors().sort((a,b) => a.angle - b.angle).shift());
	let rays = poly_sectors.map(sector => sector.bisect());
	let rays_180 = rays.map(ray => ray.rotate180());

	twist.junctions = poly_junctions.map((j,i) =>
		RabbitEar.Junction.fromVectors(j.center, j.vectors.concat([rays_180[i].vector]))
	);

	let solutions = twist.junctions.map(j => j.kawasaki_solutions());

	let boundary = RabbitEar.convexPolygon([[0,0], [500,0], [500,500], [0,500]]);
	twist.bisect_edges = rays_180.map(r => boundary.clipRay(r));
	let svgLines = twist.bisect_edges
		.map(e => RabbitEar.svg.line(e[0][0], e[0][1], e[1][0], e[1][1]));
	svgLines.forEach(l => {
		l.setAttribute("stroke", "#e14929");
		l.setAttribute("stroke-width", twist.STROKE_WIDTH);
		l.setAttribute("stroke-linecap", "round");
		twist.creaseLayer.appendChild(l);
	});

	let kawasakiVectors = solutions
		.map((three,i) => three.map(vec => RabbitEar.Ray(twist.junctions[i].center, vec)))
	twist.kawasaki_edges = kawasakiVectors
		.map(vec => vec.filter((_,i) => i === 1).shift())
		.map(r => boundary.clipRay(r));
	let svgKawasakis = twist.kawasaki_edges
		.map(e => RabbitEar.svg.line(e[0][0], e[0][1], e[1][0], e[1][1]));
	svgKawasakis.forEach(l => {
		l.setAttribute("stroke", "#314f69");
		l.setAttribute("stroke-width", twist.STROKE_WIDTH);
		l.setAttribute("stroke-dasharray", twist.STROKE_WIDTH*1.5 + " " + twist.STROKE_WIDTH*3);
		l.setAttribute("stroke-linecap", "round");
		twist.creaseLayer.appendChild(l);
	});

}

twist.reportErrors = function() {
	RabbitEar.svg.removeChildren(twist.errorLayer);
	for (let i = 0; i < twist.bisect_edges.length; i++) {
		for(let j = 0; j < twist.kawasaki_edges.length; j++) {
			if (i !== j) {
				let sect = RabbitEar.math.intersection.segment_segment(
					twist.bisect_edges[i][0], twist.bisect_edges[i][1],
					twist.kawasaki_edges[j][0], twist.kawasaki_edges[j][1]
				);
				// let sect = twist.bisect_edges[i].intersectEdge(twist.kawasaki_edges[j]);
				if (sect !== undefined) {
					let error_dot = RabbitEar.svg.circle(sect[0], sect[1], twist.STROKE_WIDTH*2);
					error_dot.setAttribute("stroke", "none");
					error_dot.setAttribute("fill", "#e44f2a");
					twist.errorLayer.appendChild(error_dot);
				}
			}
		}
	}
}

twist.redraw = function(){
	twist.rebuildHull();
	twist.rebuildCreases();
	twist.reportErrors();
}
twist.redraw();

twist.onMouseMove = function(mouse){
	if(mouse.isPressed){
		twist.redraw();
	}
}
