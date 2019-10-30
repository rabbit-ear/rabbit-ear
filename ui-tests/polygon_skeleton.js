let polySec = RabbitEar.svg("canvas-origami-molecule", 500, 500);

polySec.setup = function() {
	polySec.STROKE_WIDTH = polySec.w * 0.015;
	polySec.RADIUS = polySec.w * 0.03;

	polySec.polygon = RabbitEar.svg.polygon();
	polySec.polygon.setAttribute("stroke", "#ecb233");
	polySec.polygon.setAttribute("stroke-width", polySec.STROKE_WIDTH);
	polySec.polygon.setAttribute("fill", "none");
	polySec.polygon.setAttribute("stroke-linecap", "round");
	polySec.appendChild(polySec.polygon);

	polySec.drawLayer = RabbitEar.svg.group();
	polySec.appendChild(polySec.drawLayer);
	polySec.touches = RabbitEar.svg.controls(polySec, 7, {radius: polySec.RADIUS, fill: "#e44f2a"});
	polySec.touches.forEach(t => t.position = [Math.random()*polySec.w, Math.random()*polySec.h]);
}
polySec.setup();

polySec.recurseMolecule = function(rays, polygon, sides, isEdgeRay) {
	let count = rays.length;
	if (isEdgeRay == null) {
		isEdgeRay = rays.map(_ => true);
	}

	// each intersect is with rays at index i and i+1
	let intersects = rays
		.map((ray,i,arr) => ray.intersect(arr[(i+1)%arr.length]));

	if (count <= 3) {
		let incenter = intersects.filter(i => i !== undefined).shift();
		return [
			[rays[0].point, incenter],
			[rays[1].point, incenter],
			[rays[2].point, incenter]
		];
	}

	// each ray's 2 distances to the 2 neighboring intersections
	let rayDistances = rays.map((r,i,arr) => 
		[intersects[(i+arr.length-1)%arr.length], intersects[i]]
	).map((sects,i) => sects.map(s => s === undefined
		? [Infinity, Infinity]
		: rays[i].point.distanceTo(s))
	);
	// let rayDistances = rays.map((r,i,arr) => [
	// 	r.point.distanceTo(intersects[(i+arr.length-1)%arr.length]),
	// 	r.point.distanceTo(intersects[i])
	// ]);
	let sided = rayDistances.map(i => i[0] < i[1]);

	console.log("isEdgeRay", isEdgeRay);
	console.log("before", JSON.parse(JSON.stringify(rayDistances)));
	// bad fix for ignoring the inner lines
	isEdgeRay.map((e,i) => ({e, i}))
		.filter(el => !el.e)
		.forEach(el => rayDistances[el.i] = [Infinity, Infinity]);
	console.log("after", JSON.parse(JSON.stringify(rayDistances)));


	let smallest = rayDistances
		.map((d,i) => ({
			d: sided[i] ? d[0] : d[1],
			i: i,
			side: sided[i]
		})).sort((a,b) => a.d-b.d).shift();

	let index = smallest.side
		? (smallest.i + count - 1) % count
		: smallest.i;
	let pair = (smallest.side)
		? [(smallest.i+count-1)%count, smallest.i]
		: [smallest.i, (smallest.i+1)%count];

	let solutions = [
		[rays[pair[0]].point, intersects[index]],
		[rays[pair[1]].point, intersects[index]]
	];

	let side0 = sides[pair[0]][0];
	let side1 = sides[pair[1]][1];
	let pointA = polygon.points[side0[0]];
	let vectorA = polygon.points[side0[1]].subtract(pointA);
	let pointB = polygon.points[side1[0]];
	let vectorB = polygon.points[side1[1]].subtract(pointB);
	let bisects = RabbitEar.math.bisect_lines2(pointA, vectorA, pointB, vectorB);

	let newRay = RabbitEar.Ray(intersects[index], bisects[0][1]);
	let newSides = [side0, side1];

	polygon.points.map((_,i,arr) => [
		[i, (i+arr.length-1)%arr.length],
		[i, (i+1)%arr.length]
	]);

	let rays2 = rays.slice();
	let sides2 = sides.slice();
	if (pair[0] === rays2.length-1) {
		rays2.splice(pair[0], 1, newRay);
		rays2.splice(0, 1);
		sides2.splice(pair[0], 1, newSides);
		sides2.splice(0, 1);
		isEdgeRay.splice(pair[0], 1, false);
		isEdgeRay.splice(0, 1);
	} else {
		rays2.splice(pair[0], 2, newRay);
		sides2.splice(pair[0], 2, newSides);
		isEdgeRay.splice(pair[0], 2, false);
	}

	return solutions.concat(polySec.recurseMolecule(rays2, polygon, sides2, isEdgeRay));
}

polySec.buildMolecule = function(polygon) {
	let sectors = polygon.sectors;
	let rays = sectors.map(s => s.bisect());
	let intersects = rays
		.map((ray,i,arr) => ray.intersect(arr[(i+1)%arr.length]));
	let sides = polygon.points.map((_,i,arr) => [
		[i, (i+arr.length-1)%arr.length],
		[i, (i+1)%arr.length]
	]);
	return polySec.recurseMolecule(rays, polygon, sides);
}

polySec.redraw = function(){
	polySec.drawLayer.removeChildren();
	polySec.poly = RabbitEar.convexPolygon.convexHull(polySec.touches.map(t => t.position));

	let pointsString = polySec.poly.points
		.reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	polySec.polygon.setAttribute("points", pointsString);

	let straight_skeleton = polySec.buildMolecule(polySec.poly);
	straight_skeleton
		.map(s => polySec.drawLayer.line(s[0][0], s[0][1], s[1][0], s[1][1]))
		.forEach(l => {
			l.setAttribute("stroke-width", polySec.STROKE_WIDTH);
			l.setAttribute("stroke", "rgb(34, 76, 114)");
		});
}
polySec.redraw();

polySec.onMouseMove = function(mouse){
	if (mouse.isPressed) {
		polySec.redraw();
	}
};
