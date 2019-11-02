
let polySec = RabbitEar.svg("canvas-origami-molecule", 500, 500);

polySec.setup = function() {
	polySec.STROKE_WIDTH = polySec.w * 0.01;
	polySec.RADIUS = polySec.w * 0.02;

	polySec.polygon = RabbitEar.svg.polygon();
	polySec.polygon.setAttribute("stroke", "#ecb233");
	polySec.polygon.setAttribute("stroke-width", polySec.STROKE_WIDTH);
	polySec.polygon.setAttribute("fill", "none");
	polySec.polygon.setAttribute("stroke-linecap", "round");
	polySec.appendChild(polySec.polygon);

	polySec.drawLayer = RabbitEar.svg.group();
	polySec.appendChild(polySec.drawLayer);
	polySec.touches = RabbitEar.svg.controls(polySec, 6, {radius: polySec.RADIUS, fill: "#e44f2a"});
	polySec.touches.forEach(t => t.position = [Math.random()*polySec.w, Math.random()*polySec.h]);
}
polySec.setup();

let stepColors = ["#666", "#999", "#ccc", "#eee", "#fff"];
let recursionSteps = 0;

polySec.recurseMolecule = function(rays, polygon, sides) {
	let count = rays.length;
	// console.log("+ ", count);

	// each intersect is with rays at index i and i+1
	let intersects = rays
		.map((ray,i,arr) => ray.intersect(arr[(i+1)%arr.length]));

	if (count <= 3) {
		// console.log("===== DONE", rays);
		return [
			[rays[0].point, intersects[0]],
			[rays[1].point, intersects[0]],
			[rays[2].point, intersects[0]],
		];
	}

	// each ray's 2 distances to the 2 neighboring intersections
	let rayDistances = rays.map((r,i,arr) => [
		r.point.distanceTo(intersects[(i+arr.length-1)%arr.length]),
		r.point.distanceTo(intersects[i])
	]);
	let sided = rayDistances.map(i => i[0] < i[1]);

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

	polySec.drawLayer.circle(
		rays[pair[smallest.side ? 1 : 0]].point[0],
		rays[pair[smallest.side ? 1 : 0]].point[1],
		20).setAttribute("fill", "#30C080");
	polySec.drawLayer.circle(
		rays[pair[smallest.side ? 0 : 1]].point[0],
		rays[pair[smallest.side ? 0 : 1]].point[1],
		20).setAttribute("fill", "#CCC");

	let solutions = [
		[rays[pair[0]].point, intersects[index]],
		[rays[pair[1]].point, intersects[index]]
	];

	let side0 = sides[pair[0]][0];
	let side1 = sides[pair[1]][1];
	// console.log(side0, side1);
	let pointA = polygon.points[side0[0]];
	let vectorA = polygon.points[side0[1]].subtract(pointA);
	let pointB = polygon.points[side1[0]];
	let vectorB = polygon.points[side1[1]].subtract(pointB);
	let bisects = RabbitEar.math.bisect_lines2(pointA, vectorA, pointB, vectorB);

	let newRay = RabbitEar.Ray(intersects[index], bisects[0][1]);
	// console.log("newRay", newRay);

	// let next0 = sides[(pair[0]+sides.length-1)%sides.length][0];
	// let next1 = sides[(pair[1]+1)%sides.length][1];
	// let newSides = [next0, next1];
	let newSides = [side0, side1];
	// console.log("newSides", newSides);

	polygon.points.map((_,i,arr) => [
		[i, (i+arr.length-1)%arr.length],
		[i, (i+1)%arr.length]
	]);

	let l2 = polySec.drawLayer.line(
		pointA[0],
		pointA[1],
		pointA[0] + vectorA[0],
		pointA[1] + vectorA[1]
	);
	l2.setAttribute("stroke-width", 10-recursionSteps*4);
	l2.setAttribute("stroke", stepColors[recursionSteps%5]);
	let l3 = polySec.drawLayer.line(
		pointB[0],
		pointB[1],
		pointB[0] + vectorB[0],
		pointB[1] + vectorB[1]
	);
	l3.setAttribute("stroke-width", 10-recursionSteps*4);
	l3.setAttribute("stroke", stepColors[recursionSteps%5]);

	let l = polySec.drawLayer.line(
		intersects[index][0],
		intersects[index][1],
		intersects[index][0] + 100 * bisects[0][1][0],
		intersects[index][1] + 100 * bisects[0][1][1]
	);
	l.setAttribute("stroke-width", 10-recursionSteps*4);
	l.setAttribute("stroke", stepColors[recursionSteps%5]);


	let rays2 = rays.slice();
	let sides2 = sides.slice();
	if (pair[0] === rays2.length-1) {
		rays2.splice(pair[0], 1, newRay);
		rays2.splice(0, 1);
		sides2.splice(pair[0], 1, newSides);
		sides2.splice(0, 1);
	} else {
		rays2.splice(pair[0], 2, newRay);
		sides2.splice(pair[0], 2, newSides);
		// sides2.splice(pair[0], 1);
	}

	recursionSteps += 1;
	return solutions.concat(polySec.recurseMolecule(rays2, polygon, sides2));
}

polySec.buildMolecule = function(polygon) {

	recursionSteps = 0;

	let sectors = polygon.sectors;
	let rays = sectors.map(s => s.bisect());
	let intersects = rays
		.map((ray,i,arr) => ray.intersect(arr[(i+1)%arr.length]));
	let sides = polygon.points.map((_,i,arr) => [
		[i, (i+arr.length-1)%arr.length],
		[i, (i+1)%arr.length]
	]);

	let lines = polySec.recurseMolecule(rays, polygon, sides);

	lines.map(s => polySec.drawLayer.line(s[0][0], s[0][1], s[1][0], s[1][1]))
		.forEach(l => {
			l.setAttribute("stroke-width", 4);
			l.setAttribute("stroke", "rgb(34, 76, 114)");
		});	

	// let leftRight = rays.map((b,i,arr) => [
	// 	b.point.distanceTo(intersects[(i+arr.length-1)%arr.length]),
	// 	b.point.distanceTo(intersects[i])
	// ]).map(i => i[0] < i[1])

	// leftRight
	// 	.map((lr,i,arr) => !lr ? intersects[i] : intersects[(i+arr.length-1)%arr.length])
	// 	.map((p,i) => [rays[i].point, p])
	// 	.map(s => polySec.drawLayer.line(s[0][0], s[0][1], s[1][0], s[1][1]))
	// 	.forEach(l => {
	// 		l.setAttribute("stroke-width", 4);
	// 		l.setAttribute("stroke", "rgb(34, 76, 114)");
	// 	});	
}

polySec.redraw = function(){
	polySec.drawLayer.removeChildren();
	polySec.poly = RabbitEar.convexPolygon.convexHull(polySec.touches.map(t => t.position));
	polySec.buildMolecule(polySec.poly);

	// rays.map(s => [s.point, s.point.add(s.vector.scale(80))])
	// 	.map(s => polySec.drawLayer.line(s[0][0], s[0][1], s[1][0], s[1][1]))
	// 	.forEach(l => {
	// 		l.setAttribute("stroke-width", 4);
	// 		l.setAttribute("stroke", "rgb(34, 76, 114)");
	// 	});

	let pointsString = polySec.poly.points.reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	polySec.polygon.setAttribute("points", pointsString);
}
polySec.redraw();

polySec.onMouseMove = function(mouse){
	if (mouse.isPressed) {
		polySec.redraw();
	}
};
