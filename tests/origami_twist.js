let twist = RabbitEar.svg.Image("canvas-convex-twist", 500, 500);

twist.STROKE_WIDTH = twist.width * 0.01;
twist.RADIUS = twist.width * 0.02;

twist.polygon = RabbitEar.svg.polygon();
twist.polygon.setAttribute("stroke", "#000");//"#ecb233");
twist.polygon.setAttribute("stroke-width", twist.STROKE_WIDTH);
twist.polygon.setAttribute("fill", "none");
twist.polygon.setAttribute("stroke-linecap", "round");
twist.appendChild(twist.polygon);

twist.dotLayer = RabbitEar.svg.group();
twist.appendChild(twist.dotLayer);

twist.creaseLayer = RabbitEar.svg.group();
twist.appendChild(twist.creaseLayer);

twist.errorLayer = RabbitEar.svg.group();
twist.appendChild(twist.errorLayer);

twist.touches = Array.from(Array(7)).map(_ => ({
	pos: [
		Math.random()*twist.width*0.5 + twist.width*0.25, 
		Math.random()*twist.height*0.5 + twist.height*0.25
	],
	svg: RabbitEar.svg.circle(0, 0, twist.RADIUS)
}));

twist.touches.forEach(p => {
	p.svg.setAttribute("fill", "#000");//"#ecb233");//"#e44f2a");
	twist.appendChild(p.svg);
});

twist.rebuildHull = function(){
	let points = twist.touches.map(t => t.pos);
	twist.poly = RabbitEar.math.ConvexPolygon.convexHull(points);
	// let convexHull = RabbitEar.math.core.geometry.convex_hull(twist.touches.map(t => t.pos));
	let pointsString = twist.poly.points.reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	twist.polygon.setAttribute("points", pointsString);
}

twist.rebuildCreases = function() {
	RabbitEar.svg.removeChildren(twist.creaseLayer);
	let poly_junctions = twist.poly.points.map((center, i, arr) => ({
		center: center,
		points: [arr[(i+1)%arr.length], arr[(i+arr.length-1)%arr.length]]
	})).map(el => RabbitEar.math.Junction(el.center, el.points));
	let poly_sectors = poly_junctions.map(j => j.sectors().sort((a,b) => a.angle - b.angle).shift());
	let rays = poly_sectors.map(sector => sector.bisect());
	let rays_180 = rays.map(ray => ray.rotate180());
	twist.junctions = poly_junctions.map((j,i) =>
		RabbitEar.math.Junction.fromVectors(j.center, j.vectors.concat([rays_180[i].vector]))
	);
	let solutions = twist.junctions.map(j => j.kawasaki_solutions());

	let boundary = RabbitEar.math.ConvexPolygon([[0,0], [500,0], [500,500], [0,500]]);
	twist.bisect_edges = rays_180.map(r => boundary.clipRay(r));
	let svgLines = twist.bisect_edges
		.map(e => e.points)
		.map(e => RabbitEar.svg.line(e[0][0], e[0][1], e[1][0], e[1][1]));
	svgLines.forEach(l => {
		l.setAttribute("stroke", "black");
		l.setAttribute("stroke-width", twist.STROKE_WIDTH);
		l.setAttribute("stroke-linecap", "round");
		twist.creaseLayer.appendChild(l);
	});

	let kawasakiVectors = solutions
		.map((three,i) => three.map(vec => RabbitEar.math.Ray(twist.junctions[i].center, vec)))
	twist.kawasaki_edges = kawasakiVectors
		.map(junc => junc.filter((_,i) => i === 1).shift())
		.map(r => boundary.clipRay(r));
	let svgKawasakis = twist.kawasaki_edges
		.map(e => e.points)
		.map(e => RabbitEar.svg.line(e[0][0], e[0][1], e[1][0], e[1][1]));
	svgKawasakis.forEach(l => {
		l.setAttribute("stroke", "black");
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
				let sect = RabbitEar.math.core.intersection.edge_edge(
					twist.bisect_edges[i].points[0], twist.bisect_edges[i].points[1],
					twist.kawasaki_edges[j].points[0], twist.kawasaki_edges[j].points[1]
				);
				// let sect = twist.bisect_edges[i].intersectEdge(twist.kawasaki_edges[j]);
				if (sect !== undefined) {
					let error_dot = RabbitEar.svg.circle(sect[0], sect[1], twist.STROKE_WIDTH*1.5);
					error_dot.setAttribute("stroke", "none");
					error_dot.setAttribute("fill", "#e44f2a");
					twist.errorLayer.appendChild(error_dot);
				}
			}
		}
	}
}

twist.redraw = function(){
	twist.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
	});
	twist.rebuildHull();
	twist.rebuildCreases();
	twist.reportErrors();
}
twist.redraw();

twist.addEventListener("mousedown", function(mouse){
	let ep = twist.width / 50;
	let down = twist.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	twist.selected = found;
});

twist.addEventListener("mousemove", function(mouse){
	if(mouse.isPressed && twist.selected != null){
		twist.touches[twist.selected].pos = mouse.position;
		twist.redraw();
	}
});
