
let polySec = RabbitEar.svg.image("canvas-origami-molecule", 500, 500);

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
	console.log("+ ", count);

	// each intersect is with rays at index i and i+1
	let intersects = rays
		.map((ray,i,arr) => ray.intersect(arr[(i+1)%arr.length]));

	if (count <= 3) {
		console.log("===== DONE", rays);
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

	let sideA = sides[pair[0]];
	let sideB = sides[pair[1]];
	console.log(sideA, sideB);
	let pointA = polygon.points[sideA.a[1]];
	let vectorA = polygon.points[sideA.a[0]].subtract(pointA);
	let pointB = polygon.points[sideB.b[0]];
	let vectorB = polygon.points[sideB.b[1]].subtract(pointB);
	let bisects = RabbitEar.math.core.geometry.bisect_lines2(pointA, vectorA, pointB, vectorB);

	let newRay = RabbitEar.math.Ray(intersects[index], bisects[0][1]);
	console.log("newRay", newRay);

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
		sides2.splice(0, 1);
	} else {
		rays2.splice(pair[0], 2, newRay);
		sides2.splice(pair[0], 1);
	}

	recursionSteps += 1;
	return solutions.concat(polySec.recurseMolecule(rays2, polygon, sides2));
	// return solutions;
}

polySec.recurseMolecule2 = function(obj) {
	let count = obj.rays.length;
	console.log(obj);

	let smA = obj.lengthsA.slice().map((el,i) => ({el,i}))
		.sort((a,b) => a.el-b.el)
	let smB = obj.lengthsB.slice().map((el,i) => ({el,i}))
		.sort((a,b) => a.el-b.el)

	let smP = smB[0].i
	let smI = (smA[0].el < smB[0].el)
		? (smA[0].i + count - 1)%count
		: smB[0].i;

	let next = (smP+1)%count;
	let solutions = [
		[obj.rays[smP].point, obj.intersects[smI]],
		[obj.rays[next].point, obj.intersects[smI]]
	];
	let sideA = obj.sides[smP];
	let sideB = obj.sides[next];
	console.log(sideA, sideB);
	let pointA = obj.polygon.points[sideA.a[1]];
	let vectorA = obj.polygon.points[sideA.a[0]].subtract(pointA);
	let pointB = obj.polygon.points[sideB.b[0]];
	let vectorB = obj.polygon.points[sideB.b[1]].subtract(pointB);
	let bisects = RabbitEar.math.core.geometry.bisect_lines2(pointA, vectorA, pointB, vectorB);
	console.log(bisects);

	let l = polySec.drawLayer.line(
		obj.intersects[smI][0],
		obj.intersects[smI][1],
		obj.intersects[smI][0] + 100 * bisects[0][1][0],
		obj.intersects[smI][1] + 100 * bisects[0][1][1]
	);
	l.setAttribute("stroke-width", 4);
	l.setAttribute("stroke", "#e44f2a");

	let l2 = polySec.drawLayer.line(
		pointA[0],
		pointA[1],
		pointA[0] + vectorA[0],
		pointA[1] + vectorA[1]
	);
	l2.setAttribute("stroke-width", 7);
	l2.setAttribute("stroke", "#e44f2a");
	let l3 = polySec.drawLayer.line(
		pointB[0],
		pointB[1],
		pointB[0] + vectorB[0],
		pointB[1] + vectorB[1]
	);
	l3.setAttribute("stroke-width", 7);
	l3.setAttribute("stroke", "#e44f2a");

	return solutions;
}

polySec.buildMolecule = function(polygon) {

	recursionSteps = 0;

	let sectors = polygon.sectors;
	let rays = sectors.map(s => s.bisect());
	let intersects = rays
		.map((ray,i,arr) => ray.intersect(arr[(i+1)%arr.length]));
	let sides = polygon.points.map((_,i,arr) => ({
		a: [(i+arr.length-1)%arr.length, i],
		b: [i, (i+1)%arr.length]
	}));

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
	polySec.poly = RabbitEar.math.ConvexPolygon.convexHull(polySec.touches.map(t => t.position));
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
