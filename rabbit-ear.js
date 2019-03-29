/* Rabbit Ear v2 (c) Robby Kraft, MIT License */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.RabbitEar = {})));
}(this, (function (exports) { 'use strict';

	/* Geometry (c) Robby Kraft, MIT License */
	const EPSILON_LOW  = 3e-6;
	const EPSILON      = 1e-10;
	const EPSILON_HIGH = 1e-14;
	function clean_number(num, decimalPlaces = 15) {
		return (num == null
			? undefined
			: parseFloat(num.toFixed(decimalPlaces)));
	}

	function normalize(v) {
		let m = magnitude(v);
		return v.map(c => c / m);
	}
	function magnitude(v) {
		let sum = v
			.map(component => component * component)
			.reduce((prev,curr) => prev + curr);
		return Math.sqrt(sum);
	}
	function degenerate(v) {
		return Math.abs(v.reduce((a, b) => a + b, 0)) < EPSILON;
	}
	function dot(a, b) {
		return a
			.map((_,i) => a[i] * b[i])
			.reduce((prev,curr) => prev + curr, 0);
	}
	function equivalent(a, b, epsilon = EPSILON) {
		return a
			.map((_,i) => Math.abs(a[i] - b[i]) < epsilon)
			reduce((a,b) => a && b, true);
	}
	function parallel(a, b, epsilon = EPSILON) {
		return 1 - Math.abs(dot(normalize(a), normalize(b))) < epsilon;
	}
	function midpoint$1(a, b) {
		return a.map((ai,i) => (ai+b[i])*0.5);
	}
	function average(vectors) {
		let initial = Array.from(Array(vectors.length)).map(_ => 0);
		return vectors.reduce((a,b) => a.map((_,i) => a[i]+b[i]), initial)
			.map(c => c / vectors.length);
	}
	function multiply_vector2_matrix2(vector, matrix) {
		return [ vector[0] * matrix[0] + vector[1] * matrix[2] + matrix[4],
		         vector[0] * matrix[1] + vector[1] * matrix[3] + matrix[5] ];
	}
	function make_matrix2_reflection(vector, origin) {
		let angle = Math.atan2(vector[1], vector[0]);
		let cosAngle = Math.cos(angle);
		let sinAngle = Math.sin(angle);
		let _cosAngle = Math.cos(-angle);
		let _sinAngle = Math.sin(-angle);
		let a = cosAngle *  _cosAngle +  sinAngle * _sinAngle;
		let b = cosAngle * -_sinAngle +  sinAngle * _cosAngle;
		let c = sinAngle *  _cosAngle + -cosAngle * _sinAngle;
		let d = sinAngle * -_sinAngle + -cosAngle * _cosAngle;
		let tx = origin[0] + a * -origin[0] + -origin[1] * c;
		let ty = origin[1] + b * -origin[0] + -origin[1] * d;
		return [a, b, c, d, tx, ty];
	}
	function make_matrix2_rotation(angle, origin) {
		var a = Math.cos(angle);
		var b = Math.sin(angle);
		var c = -Math.sin(angle);
		var d = Math.cos(angle);
		var tx = (origin != null) ? origin[0] : 0;
		var ty = (origin != null) ? origin[1] : 0;
		return [a, b, c, d, tx, ty];
	}
	function make_matrix2_inverse(m) {
		var det = m[0] * m[3] - m[1] * m[2];
		if (!det || isNaN(det) || !isFinite(m[4]) || !isFinite(m[5])) { return undefined; }
		return [
			m[3]/det,
			-m[1]/det,
			-m[2]/det,
			m[0]/det,
			(m[2]*m[5] - m[3]*m[4])/det,
			(m[1]*m[4] - m[0]*m[5])/det
		];
	}
	function multiply_matrices2(m1, m2) {
		let a = m1[0] * m2[0] + m1[2] * m2[1];
		let c = m1[0] * m2[2] + m1[2] * m2[3];
		let tx = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
		let b = m1[1] * m2[0] + m1[3] * m2[1];
		let d = m1[1] * m2[2] + m1[3] * m2[3];
		let ty = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
		return [a, b, c, d, tx, ty];
	}
	function cross2(a, b) {
		return [ a[0]*b[1], a[1]*b[0] ];
	}
	function cross3(a, b) {
		return [
			a[1]*b[2] - a[2]*b[1],
			a[0]*b[2] - a[2]*b[0],
			a[0]*b[1] - a[1]*b[0]
		];
	}
	function distance2(a, b) {
		let c = a[0] - b[0];
		let d = a[1] - b[1];
		return Math.sqrt((c * c) + (d * d));
	}
	function distance3(a, b) {
		let c = a[0] - b[0];
		let d = a[1] - b[1];
		let e = a[2] - b[2];
		return Math.sqrt((c * c) + (d * d) + (e * e));
	}

	var algebra = /*#__PURE__*/Object.freeze({
		normalize: normalize,
		magnitude: magnitude,
		degenerate: degenerate,
		dot: dot,
		equivalent: equivalent,
		parallel: parallel,
		midpoint: midpoint$1,
		average: average,
		multiply_vector2_matrix2: multiply_vector2_matrix2,
		make_matrix2_reflection: make_matrix2_reflection,
		make_matrix2_rotation: make_matrix2_rotation,
		make_matrix2_inverse: make_matrix2_inverse,
		multiply_matrices2: multiply_matrices2,
		cross2: cross2,
		cross3: cross3,
		distance2: distance2,
		distance3: distance3
	});

	function equivalent2(a, b, epsilon = EPSILON) {
		return Math.abs(a[0]-b[0]) < epsilon && Math.abs(a[1]-b[1]) < epsilon;
	}
	function line_line(aPt, aVec, bPt, bVec, epsilon) {
		return intersection_function(aPt, aVec, bPt, bVec, line_line_comp, epsilon);
	}
	function line_ray(linePt, lineVec, rayPt, rayVec, epsilon) {
		return intersection_function(linePt, lineVec, rayPt, rayVec, line_ray_comp, epsilon);
	}
	function line_edge(point, vec, edge0, edge1, epsilon) {
		let edgeVec = [edge1[0]-edge0[0], edge1[1]-edge0[1]];
		return intersection_function(point, vec, edge0, edgeVec, line_edge_comp, epsilon);
	}
	function ray_ray(aPt, aVec, bPt, bVec, epsilon) {
		return intersection_function(aPt, aVec, bPt, bVec, ray_ray_comp, epsilon);
	}
	function ray_edge(rayPt, rayVec, edge0, edge1, epsilon) {
		let edgeVec = [edge1[0]-edge0[0], edge1[1]-edge0[1]];
		return intersection_function(rayPt, rayVec, edge0, edgeVec, ray_edge_comp, epsilon);
	}
	function edge_edge(a0, a1, b0, b1, epsilon) {
		let aVec = [a1[0]-a0[0], a1[1]-a0[1]];
		let bVec = [b1[0]-b0[0], b1[1]-b0[1]];
		return intersection_function(a0, aVec, b0, bVec, edge_edge_comp, epsilon);
	}
	function line_ray_exclusive(linePt, lineVec, rayPt, rayVec, epsilon) {
		return intersection_function(linePt, lineVec, rayPt, rayVec, line_ray_comp_exclusive, epsilon);
	}
	function line_edge_exclusive(point, vec, edge0, edge1, epsilon) {
		let edgeVec = [edge1[0]-edge0[0], edge1[1]-edge0[1]];
		return intersection_function(point, vec, edge0, edgeVec, line_edge_comp_exclusive, epsilon);
	}
	function ray_ray_exclusive(aPt, aVec, bPt, bVec, epsilon) {
		return intersection_function(aPt, aVec, bPt, bVec, ray_ray_comp_exclusive, epsilon);
	}
	function ray_edge_exclusive(rayPt, rayVec, edge0, edge1, epsilon) {
		let edgeVec = [edge1[0]-edge0[0], edge1[1]-edge0[1]];
		return intersection_function(rayPt, rayVec, edge0, edgeVec, ray_edge_comp_exclusive, epsilon);
	}
	function edge_edge_exclusive(a0, a1, b0, b1, epsilon) {
		let aVec = [a1[0]-a0[0], a1[1]-a0[1]];
		let bVec = [b1[0]-b0[0], b1[1]-b0[1]];
		return intersection_function(a0, aVec, b0, bVec, edge_edge_comp_exclusive, epsilon);
	}
	const line_line_comp = function() { return true; };
	const line_ray_comp = function(t0, t1, epsilon = EPSILON) {
		return t1 >= -epsilon;
	};
	const line_edge_comp = function(t0, t1, epsilon = EPSILON) {
		return t1 >= -epsilon && t1 <= 1+epsilon;
	};
	const ray_ray_comp = function(t0, t1, epsilon = EPSILON) {
		return t0 >= -epsilon && t1 >= -epsilon;
	};
	const ray_edge_comp = function(t0, t1, epsilon = EPSILON) {
		return t0 >= -epsilon && t1 >= -epsilon && t1 <= 1+epsilon;
	};
	const edge_edge_comp = function(t0, t1, epsilon = EPSILON) {
		return t0 >= -epsilon && t0 <= 1+epsilon &&
		       t1 >= -epsilon && t1 <= 1+epsilon;
	};
	const line_ray_comp_exclusive = function(t0, t1, epsilon = EPSILON) {
		return t1 > epsilon;
	};
	const line_edge_comp_exclusive = function(t0, t1, epsilon = EPSILON) {
		return t1 > epsilon && t1 < 1-epsilon;
	};
	const ray_ray_comp_exclusive = function(t0, t1, epsilon = EPSILON) {
		return t0 > epsilon && t1 > epsilon;
	};
	const ray_edge_comp_exclusive = function(t0, t1, epsilon = EPSILON) {
		return t0 > epsilon && t1 > epsilon && t1 < 1-epsilon;
	};
	const edge_edge_comp_exclusive = function(t0, t1, epsilon = EPSILON) {
		return t0 > epsilon && t0 < 1-epsilon &&
		       t1 > epsilon && t1 < 1-epsilon;
	};
	const intersection_function = function(aPt, aVec, bPt, bVec, compFunction, epsilon = EPSILON) {
		function det(a,b) { return a[0] * b[1] - b[0] * a[1]; }
		let denominator0 = det(aVec, bVec);
		let denominator1 = -denominator0;
		if (Math.abs(denominator0) < epsilon) { return undefined; }
		let numerator0 = det([bPt[0]-aPt[0], bPt[1]-aPt[1]], bVec);
		let numerator1 = det([aPt[0]-bPt[0], aPt[1]-bPt[1]], aVec);
		let t0 = numerator0 / denominator0;
		let t1 = numerator1 / denominator1;
		if (compFunction(t0, t1, epsilon)) {
			return [aPt[0] + aVec[0]*t0, aPt[1] + aVec[1]*t0];
		}
	};
	function point_on_line(linePoint, lineVector, point, epsilon = EPSILON) {
		let pointPoint = [point[0] - linePoint[0], point[1] - linePoint[1]];
		let cross = pointPoint[0]*lineVector[1] - pointPoint[1]*lineVector[0];
		return Math.abs(cross) < epsilon;
	}
	function point_on_edge(edge0, edge1, point, epsilon = EPSILON) {
		let dEdge = Math.sqrt(Math.pow(edge0[0]-edge1[0],2) +
		                      Math.pow(edge0[1]-edge1[1],2));
		let dP0 = Math.sqrt(Math.pow(point[0]-edge0[0],2) +
		                    Math.pow(point[1]-edge0[1],2));
		let dP1 = Math.sqrt(Math.pow(point[0]-edge1[0],2) +
		                    Math.pow(point[1]-edge1[1],2));
		return Math.abs(dEdge - dP0 - dP1) < epsilon;
	}
	function point_in_poly(poly, point, epsilon = EPSILON) {
		let isInside = false;
		for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
			if ( (poly[i][1] > point[1]) != (poly[j][1] > point[1]) &&
			point[0] < (poly[j][0] - poly[i][0]) * (point[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0] ) {
				isInside = !isInside;
			}
		}
		return isInside;
	}
	function point_in_convex_poly(poly, point, epsilon = EPSILON) {
		if (poly == undefined || !(poly.length > 0)) { return false; }
		return poly.map( (p,i,arr) => {
			let nextP = arr[(i+1)%arr.length];
			let a = [ nextP[0]-p[0], nextP[1]-p[1] ];
			let b = [ point[0]-p[0], point[1]-p[1] ];
			return a[0] * b[1] - a[1] * b[0] > -epsilon;
		}).map((s,i,arr) => s == arr[0]).reduce((prev,curr) => prev && curr, true)
	}
	function convex_polygons_overlap(ps1, ps2) {
		let e1 = ps1.map((p,i,arr) => [p, arr[(i+1)%arr.length]] );
		let e2 = ps2.map((p,i,arr) => [p, arr[(i+1)%arr.length]] );
		for (let i = 0; i < e1.length; i++) {
			for (let j = 0; j < e2.length; j++) {
				if (edge_edge(e1[i][0], e1[i][1], e2[j][0], e2[j][1]) != undefined) {
					return true;
				}
			}
		}
		if (point_in_convex_poly(ps1, ps2[0])) { return true; }
		if (point_in_convex_poly(ps2, ps1[0])) { return true; }
		return false;
	}
	function clip_line_in_convex_poly(poly, linePoint, lineVector) {
		let intersections = poly
			.map((p,i,arr) => [p, arr[(i+1)%arr.length]] )
			.map(el => line_edge(linePoint, lineVector, el[0], el[1]))
			.filter(el => el != null);
		switch (intersections.length) {
		case 0: return undefined;
		case 1: return [intersections[0], intersections[0]];
		case 2: return intersections;
		default:
			for (let i = 1; i < intersections.length; i++) {
				if ( !equivalent2(intersections[0], intersections[i])) {
					return [intersections[0], intersections[i]];
				}
			}
		}
	}
	function clip_ray_in_convex_poly(poly, linePoint, lineVector) {
		var intersections = poly
			.map((p,i,arr) => [p, arr[(i+1)%arr.length]] )
			.map(el => ray_edge(linePoint, lineVector, el[0], el[1]))
			.filter(el => el != null);
		switch (intersections.length) {
		case 0: return undefined;
		case 1: return [linePoint, intersections[0]];
		case 2: return intersections;
		default:
			for (let i = 1; i < intersections.length; i++) {
				if ( !equivalent2(intersections[0], intersections[i])) {
					return [intersections[0], intersections[i]];
				}
			}
		}
	}
	function clip_edge_in_convex_poly(poly, edgeA, edgeB) {
		let intersections = poly
			.map((p,i,arr) => [p, arr[(i+1)%arr.length]] )
			.map(el => edge_edge(edgeA, edgeB, el[0], el[1]))
			.filter(el => el != null);
		for (var i = 0; i < intersections.length; i++) {
			for (var j = intersections.length-1; j > i; j--) {
				if (equivalent2(intersections[i], intersections[j])) {
					intersections.splice(j, 1);
				}
			}
		}
		let aInside = point_in_convex_poly(edgeA, poly);
		switch (intersections.length) {
			case 0: return ( aInside
				? [[...edgeA], [...edgeB]]
				: undefined );
			case 1: return ( aInside
				? [[...edgeA], intersections[0]]
				: [[...edgeB], intersections[0]] );
			case 2: return intersections;
			default: throw "clipping ray in a convex polygon resulting in 3 or more points";
		}
	}
	function nearest_point(linePoint, lineVector, point, limiterFunc, epsilon = EPSILON) {
		let magSquared = Math.pow(lineVector[0],2) + Math.pow(lineVector[1],2);
		let vectorToPoint = [0,1].map((_,i) => point[i] - linePoint[i]);
		let pTo0 = [0,1].map((_,i) => point[i] - linePoint[i]);
		let dot = [0,1]
			.map((_,i) => lineVector[i] * vectorToPoint[i])
			.reduce((a,b) => a + b, 0);
		let distance = dot / magSquared;
		let d = limiterFunc(distance, epsilon);
		return [0,1].map((_,i) => linePoint[i] + lineVector[i] * d);
	}
	function intersection_circle_line(center, radius, p0, p1, epsilon = EPSILON) {
		let x1 = p0[0] - center[0];
		let y1 = p0[1] - center[1];
		let x2 = p1[0] - center[0];
		let y2 = p1[1] - center[1];
		let dx = x2 - x1;
		let dy = y2 - y1;
		let det = x1*y2 - x2*y1;
		let det_sq = det * det;
		let r_sq = radius * radius;
		let dr_sq = Math.abs(dx*dx + dy*dy);
		let delta = r_sq * dr_sq - det_sq;
		if (delta < -epsilon) { return undefined; }
		let suffix = Math.sqrt(r_sq*dr_sq - det_sq);
		function sgn(x) { return (x < -epsilon) ? -1 : 1; }
		let solutionA = [
			center[0] + (det * dy + sgn(dy)*dx * suffix) / dr_sq,
			center[1] + (-det * dx + Math.abs(dy) * suffix) / dr_sq
		];
		if (delta > epsilon) {
			let solutionB = [
				center[0] + (det * dy - sgn(dy)*dx * suffix) / dr_sq,
				center[1] + (-det * dx - Math.abs(dy) * suffix) / dr_sq
			];
			return [solutionA, solutionB];
		}
		return [solutionA];
	}
	function intersection_circle_ray(center, radius, p0, p1) {
		throw "intersection_circle_ray has not been written yet";
	}
	function intersection_circle_edge(center, radius, p0, p1) {
		var r_squared =  Math.pow(radius, 2);
		var x1 = p0[0] - center[0];
		var y1 = p0[1] - center[1];
		var x2 = p1[0] - center[0];
		var y2 = p1[1] - center[1];
		var dx = x2 - x1;
		var dy = y2 - y1;
		var dr_squared = dx*dx + dy*dy;
		var D = x1*y2 - x2*y1;
		function sgn(x) { if (x < 0) {return -1;} return 1; }
		var x1 = (D*dy + sgn(dy)*dx*Math.sqrt(r_squared*dr_squared - (D*D)))/(dr_squared);
		var x2 = (D*dy - sgn(dy)*dx*Math.sqrt(r_squared*dr_squared - (D*D)))/(dr_squared);
		var y1 = (-D*dx + Math.abs(dy)*Math.sqrt(r_squared*dr_squared - (D*D)))/(dr_squared);
		var y2 = (-D*dx - Math.abs(dy)*Math.sqrt(r_squared*dr_squared - (D*D)))/(dr_squared);
		let x1NaN = isNaN(x1);
		let x2NaN = isNaN(x2);
		if (!x1NaN && !x2NaN) {
			return [
				[x1 + center[0], y1 + center[1]],
				[x2 + center[0], y2 + center[1]]
			];
		}
		if (x1NaN && x2NaN) { return undefined; }
		if (!x1NaN) {
			return [ [x1 + center[0], y1 + center[1]] ];
		}
		if (!x2NaN) {
			return [ [x2 + center[0], y2 + center[1]] ];
		}
	}

	var intersection = /*#__PURE__*/Object.freeze({
		line_line: line_line,
		line_ray: line_ray,
		line_edge: line_edge,
		ray_ray: ray_ray,
		ray_edge: ray_edge,
		edge_edge: edge_edge,
		line_ray_exclusive: line_ray_exclusive,
		line_edge_exclusive: line_edge_exclusive,
		ray_ray_exclusive: ray_ray_exclusive,
		ray_edge_exclusive: ray_edge_exclusive,
		edge_edge_exclusive: edge_edge_exclusive,
		intersection_function: intersection_function,
		point_on_line: point_on_line,
		point_on_edge: point_on_edge,
		point_in_poly: point_in_poly,
		point_in_convex_poly: point_in_convex_poly,
		convex_polygons_overlap: convex_polygons_overlap,
		clip_line_in_convex_poly: clip_line_in_convex_poly,
		clip_ray_in_convex_poly: clip_ray_in_convex_poly,
		clip_edge_in_convex_poly: clip_edge_in_convex_poly,
		nearest_point: nearest_point,
		intersection_circle_line: intersection_circle_line,
		intersection_circle_ray: intersection_circle_ray,
		intersection_circle_edge: intersection_circle_edge
	});

	function make_regular_polygon(sides, x = 0, y = 0, radius = 1) {
		var halfwedge = 2*Math.PI/sides * 0.5;
		var r = radius / Math.cos(halfwedge);
		return Array.from(Array(Math.floor(sides))).map((_,i) => {
			var a = -2 * Math.PI * i / sides + halfwedge;
			var px = clean_number(x + r * Math.sin(a), 14);
			var py = clean_number(y + r * Math.cos(a), 14);
			return [px, py];
		});
	}
	function clockwise_angle2_radians(a, b) {
		while (a < 0) { a += Math.PI*2; }
		while (b < 0) { b += Math.PI*2; }
		var a_b = a - b;
		return (a_b >= 0)
			? a_b
			: Math.PI*2 - (b - a);
	}
	function counter_clockwise_angle2_radians(a, b) {
		while (a < 0) { a += Math.PI*2; }
		while (b < 0) { b += Math.PI*2; }
		var b_a = b - a;
		return (b_a >= 0)
			? b_a
			: Math.PI*2 - (a - b);
	}
	function clockwise_angle2(a, b) {
		var dotProduct = b[0]*a[0] + b[1]*a[1];
		var determinant = b[0]*a[1] - b[1]*a[0];
		var angle = Math.atan2(determinant, dotProduct);
		if (angle < 0) { angle += Math.PI*2; }
		return angle;
	}
	function counter_clockwise_angle2(a, b) {
		var dotProduct = a[0]*b[0] + a[1]*b[1];
		var determinant = a[0]*b[1] - a[1]*b[0];
		var angle = Math.atan2(determinant, dotProduct);
		if (angle < 0) { angle += Math.PI*2; }
		return angle;
	}
	function interior_angles2(a, b) {
		var interior1 = clockwise_angle2(a, b);
		var interior2 = Math.PI*2 - interior1;
		return (interior1 < interior2)
			? [interior1, interior2]
			: [interior2, interior1];
	}
	function bisect_vectors(a, b) {
		let aV = normalize(a);
		let bV = normalize(b);
		let sum = aV.map((_,i) => aV[i] + bV[i]);
		let vecA = normalize( sum );
		let vecB = aV.map((_,i) => -aV[i] + -bV[i]);
		return [vecA, normalize(vecB)];
	}
	function bisect_lines2(pointA, vectorA, pointB, vectorB) {
		let denominator = vectorA[0] * vectorB[1] - vectorB[0] * vectorA[1];
		if (Math.abs(denominator) < EPSILON) {
			return [midpoint(pointA, pointB), vectorA.slice()];
		}
		let vectorC = [pointB[0]-pointA[0], pointB[1]-pointA[1]];
		let numerator = (pointB[0]-pointA[0]) * vectorB[1] - vectorB[0] * (pointB[1]-pointA[1]);
		var t = numerator / denominator;
		let x = pointA[0] + vectorA[0]*t;
		let y = pointA[1] + vectorA[1]*t;
		var bisects = bisect_vectors(vectorA, vectorB);
		bisects[1] = [ bisects[1][1], -bisects[1][0] ];
		if (Math.abs(cross2(vectorA, bisects[1])) <
		   Math.abs(cross2(vectorA, bisects[0]))) {
			var swap = bisects[0];
			bisects[0] = bisects[1];
			bisects[1] = swap;
		}
		return bisects.map((el) => [[x,y], el]);
	}
	function signed_area(points) {
		return 0.5 * points.map((el,i,arr) => {
			var next = arr[(i+1)%arr.length];
			return el[0] * next[1] - next[0] * el[1];
		})
		.reduce((a, b) => a + b, 0);
	}
	function centroid(points) {
		let sixthArea = 1/(6 * signed_area(points));
		return points.map((el,i,arr) => {
			var next = arr[(i+1)%arr.length];
			var mag = el[0] * next[1] - next[0] * el[1];
			return [(el[0]+next[0])*mag, (el[1]+next[1])*mag];
		})
		.reduce((a, b) => [a[0]+b[0], a[1]+b[1]], [0,0])
		.map(c => c * sixthArea);
	}
	function enclosing_rectangle(points) {
		let l = points[0].length;
		let mins = Array.from(Array(l)).map(_ => Infinity);
		let maxs = Array.from(Array(l)).map(_ => -Infinity);
		points.forEach(point =>
			point.forEach((c,i) => {
				if(c < mins[i]) { mins[i] = c; }
				if(c > maxs[i]) { maxs[i] = c; }
			})
		);
		let lengths = maxs.map((max,i) => max - mins[i]);
		return [mins, lengths];
	}
	function convex_hull(points, include_collinear = false, epsilon = EPSILON_HIGH) {
		var INFINITE_LOOP = 10000;
		var sorted = points.slice().sort((a,b) =>
			(Math.abs(a[1]-b[1]) < epsilon
				? a[0] - b[0]
				: a[1] - b[1]));
		var hull = [];
		hull.push(sorted[0]);
		var ang = 0;
		var infiniteLoop = 0;
		do{
			infiniteLoop++;
			var h = hull.length-1;
			var angles = sorted
				.filter(el =>
					!( Math.abs(el[0] - hull[h][0]) < epsilon
					&& Math.abs(el[1] - hull[h][1]) < epsilon))
				.map(el => {
					var angle = Math.atan2(hull[h][1] - el[1], hull[h][0] - el[0]);
					while(angle < ang) { angle += Math.PI*2; }
					return {node:el, angle:angle, distance:undefined};
				})
				.sort((a,b) => (a.angle < b.angle)?-1:(a.angle > b.angle)?1:0);
			if (angles.length === 0) { return undefined; }
			var rightTurn = angles[0];
			angles = angles.filter(el => Math.abs(rightTurn.angle - el.angle) < epsilon)
				.map(el => {
					var distance = Math.sqrt(Math.pow(hull[h][0]-el.node[0], 2) + Math.pow(hull[h][1]-el.node[1], 2));
					el.distance = distance;
					return el;
				})
			.sort((a,b) => (a.distance < b.distance)?1:(a.distance > b.distance)?-1:0);
			if (hull.filter(el => el === angles[0].node).length > 0) {
				return hull;
			}
			hull.push(angles[0].node);
			ang = Math.atan2( hull[h][1] - angles[0].node[1], hull[h][0] - angles[0].node[0]);
		} while(infiniteLoop < INFINITE_LOOP);
		return undefined;
	}
	function split_polygon(poly, linePoint, lineVector) {
		let vertices_intersections = poly.map((v,i) => {
			let intersection = point_on_line(linePoint, lineVector, v);
			return { type: "v", point: intersection ? v : null, at_index: i };
		}).filter(el => el.point != null);
		let edges_intersections = poly.map((v,i,arr) => {
			let intersection = line_edge_exclusive(linePoint, lineVector, v, arr[(i+1)%arr.length]);
			return { type: "e", point: intersection, at_index: i };
		}).filter(el => el.point != null);
		let sorted = vertices_intersections.concat(edges_intersections).sort((a,b) =>
			( Math.abs(a.point[0]-b.point[0]) < EPSILON
				? a.point[1] - b.point[1]
				: a.point[0] - b.point[0] )
		);
		console.log(sorted);
		return poly;
	}
	function split_convex_polygon(poly, linePoint, lineVector) {
		let vertices_intersections = poly.map((v,i) => {
			let intersection = point_on_line(linePoint, lineVector, v);
			return { point: intersection ? v : null, at_index: i };
		}).filter(el => el.point != null);
		let edges_intersections = poly.map((v,i,arr) => {
			let intersection = line_edge_exclusive(linePoint, lineVector, v, arr[(i+1)%arr.length]);
			return { point: intersection, at_index: i };
		}).filter(el => el.point != null);
		if (edges_intersections.length == 2) {
			let sorted_edges = edges_intersections.slice()
				.sort((a,b) => a.at_index - b.at_index);
			let face_a = poly
				.slice(sorted_edges[1].at_index+1)
				.concat(poly.slice(0, sorted_edges[0].at_index+1));
			face_a.push(sorted_edges[0].point);
			face_a.push(sorted_edges[1].point);
			let face_b = poly
				.slice(sorted_edges[0].at_index+1, sorted_edges[1].at_index+1);
			face_b.push(sorted_edges[1].point);
			face_b.push(sorted_edges[0].point);
			return [face_a, face_b];
		} else if (edges_intersections.length == 1 && vertices_intersections.length == 1) {
			vertices_intersections[0]["type"] = "v";
			edges_intersections[0]["type"] = "e";
			let sorted_geom = vertices_intersections.concat(edges_intersections)
				.sort((a,b) => a.at_index - b.at_index);
			let face_a = poly.slice(sorted_geom[1].at_index+1)
				.concat(poly.slice(0, sorted_geom[0].at_index+1));
			if (sorted_geom[0].type === "e") { face_a.push(sorted_geom[0].point); }
			face_a.push(sorted_geom[1].point);
			let face_b = poly
				.slice(sorted_geom[0].at_index+1, sorted_geom[1].at_index+1);
			if (sorted_geom[1].type === "e") { face_b.push(sorted_geom[1].point); }
			face_b.push(sorted_geom[0].point);
			return [face_a, face_b];
		} else if (vertices_intersections.length == 2) {
			let sorted_vertices = vertices_intersections.slice()
				.sort((a,b) => a.at_index - b.at_index);
			let face_a = poly
				.slice(sorted_vertices[1].at_index)
				.concat(poly.slice(0, sorted_vertices[0].at_index+1));
			let face_b = poly
				.slice(sorted_vertices[0].at_index, sorted_vertices[1].at_index+1);
			return [face_a, face_b];
		}
		return [poly.slice()];
	}

	var geometry = /*#__PURE__*/Object.freeze({
		make_regular_polygon: make_regular_polygon,
		clockwise_angle2_radians: clockwise_angle2_radians,
		counter_clockwise_angle2_radians: counter_clockwise_angle2_radians,
		clockwise_angle2: clockwise_angle2,
		counter_clockwise_angle2: counter_clockwise_angle2,
		interior_angles2: interior_angles2,
		bisect_vectors: bisect_vectors,
		bisect_lines2: bisect_lines2,
		signed_area: signed_area,
		centroid: centroid,
		enclosing_rectangle: enclosing_rectangle,
		convex_hull: convex_hull,
		split_polygon: split_polygon,
		split_convex_polygon: split_convex_polygon
	});

	function axiom1(a, b) {
		return [a, a.map((_,i) => b[i] - a[i])];
	}
	function axiom2(a, b) {
		let mid = midpoint$1(a, b);
		let vec = a.map((_,i) => b[i] - a[i]);
		return [mid, [vec[1], -vec[0]] ];
	}
	function axiom3(pointA, vectorA, pointB, vectorB){
		return bisect_lines2(pointA, vectorA, pointB, vectorB);
	}
	function axiom4(pointA, vectorA, pointB) {
		let norm = normalize(vectorA);
		let rightAngle = [norm[1], -norm[0]];
		return [[...pointB], rightAngle];
	}
	function axiom5(pointA, vectorA, pointB, pointC) {
	}
	function axiom6(pointA, vectorA, pointB, vectorB, pointC, pointD) {
	}
	function axiom7(pointA, vectorA, pointB, vectorB, pointC) {
	}

	var origami$1 = /*#__PURE__*/Object.freeze({
		axiom1: axiom1,
		axiom2: axiom2,
		axiom3: axiom3,
		axiom4: axiom4,
		axiom5: axiom5,
		axiom6: axiom6,
		axiom7: axiom7
	});

	function get_vec() {
		let params = Array.from(arguments);
		if (params.length === 0) { return; }
		let numbers = params.filter((param) => !isNaN(param));
		if (numbers.length >= 1) { return numbers; }
		if (params[0].vector != null && params[0].vector.constructor === Array) {
			return params[0].vector;
		}
		if (!isNaN(params[0].x)) {
			return ['x','y','z'].map(c => params[0][c]).filter(a => a != null);
		}
		let arrays = params.filter((param) => param.constructor === Array);
		if (arrays.length >= 1) { return get_vec(...arrays[0]); }
	}
	function get_matrix2() {
		let params = Array.from(arguments);
		let numbers = params.filter((param) => !isNaN(param));
		let arrays = params.filter((param) => param.constructor === Array);
		if (params.length == 0) { return [1,0,0,1,0,0]; }
		if (params[0].m != null && params[0].m.constructor == Array) {
			numbers = params[0].m.slice();
		}
		if (numbers.length == 0 && arrays.length >= 1) { numbers = arrays[0]; }
		if (numbers.length >= 6) { return numbers.slice(0,6); }
		else if (numbers.length >= 4) {
			let m = numbers.slice(0,4);
			m[4] = 0;
			m[5] = 0;
			return m;
		}
		return [1,0,0,1,0,0];
	}
	function get_edge() {
		let params = Array.from(arguments).filter(p => p != null);
		let numbers = params.filter((param) => !isNaN(param));
		let arrays = params.filter((param) => param.constructor === Array);
		if (params.length === 0) { return undefined; }
		if (!isNaN(params[0]) && numbers.length >= 4) {
			return [
				[params[0], params[1]],
				[params[2], params[3]]
			];
		}
		if (arrays.length > 0) {
			if (arrays.length === 2) {
				return [
					[arrays[0][0], arrays[0][1]],
					[arrays[1][0], arrays[1][1]]
				];
			}
			else if (arrays.length === 4) {
				return [
					[arrays[0], arrays[1]],
					[arrays[2], arrays[3]]
				];
			}
			else { return get_edge(...arrays[0]); }
		}
		if (params[0].constructor === Object) {
			if(params[0].points.length > 0) {
				return params[0].points;
			}
		}
	}
	function get_line() {
		let params = Array.from(arguments);
		let numbers = params.filter((param) => !isNaN(param));
		let arrays = params.filter((param) => param.constructor === Array);
		if (params.length == 0) { return {vector: [], point: []}; }
		if (!isNaN(params[0]) && numbers.length >= 4) {
			return {
				point: [params[0], params[1]],
				vector: [params[2], params[3]]
			};
		}
		if (arrays.length > 0) {
			if (arrays.length == 2) {
				return {
					point: [arrays[0][0], arrays[0][1]],
					vector: [arrays[1][0], arrays[1][1]]
				};
			}
			if (arrays.length == 4) {
				return {
					point: [arrays[0], arrays[1]],
					vector: [arrays[2], arrays[3]]
				};
			}
		}
		if (params[0].constructor === Object) {
			let vector = [], point = [];
			if (params[0].vector != null)         { vector = get_vec(params[0].vector); }
			else if (params[0].direction != null) { vector = get_vec(params[0].direction); }
			if (params[0].point != null)       { point = get_vec(params[0].point); }
			else if (params[0].origin != null) { point = get_vec(params[0].origin); }
			return {point, vector};
		}
		return {point: [], vector: []};
	}
	function get_ray() {
		return get_line(...arguments);
	}
	function get_two_vec2() {
		let params = Array.from(arguments);
		let numbers = params.filter((param) => !isNaN(param));
		let arrays = params.filter((param) => param.constructor === Array);
		if (numbers.length >= 4) {
			return [
				[numbers[0], numbers[1]],
				[numbers[2], numbers[3]]
			];
		}
		if (arrays.length >= 2 && !isNaN(arrays[0][0])) {
			return arrays;
		}
		if (arrays.length == 1 && !isNaN(arrays[0][0][0])) {
			return arrays[0];
		}
	}
	function get_array_of_vec() {
		let params = Array.from(arguments);
		let arrays = params.filter((param) => param.constructor === Array);
		if (arrays.length == 1 && arrays[0].length > 0 && arrays[0][0].length > 0 && !isNaN(arrays[0][0][0])) {
			return arrays[0];
		}
		if (params[0].constructor === Object) {
			if (params[0].points != null) {
				return params[0].points;
			}
		}
	}

	function Vector() {
		let _v = get_vec(...arguments);
		if (_v === undefined) { return; }
		const normalize$$1 = function() {
			return Vector( normalize(_v) );
		};
		const dot$$1 = function() {
			let vec = get_vec(...arguments);
			return _v.length > vec.length
				? dot(vec, _v)
				: dot(_v, vec);
		};
		const cross = function() {
			let b = get_vec(...arguments);
			let a = _v.slice();
			if(a[2] == null){ a[2] = 0; }
			if(b[2] == null){ b[2] = 0; }
			return Vector( cross3(a, b) );
		};
		const distanceTo = function() {
			let vec = get_vec(...arguments);
			let length = (_v.length < vec.length) ? _v.length : vec.length;
			let sum = Array.from(Array(length))
				.map((_,i) => Math.pow(_v[i] - vec[i], 2))
				.reduce((prev, curr) => prev + curr, 0);
			return Math.sqrt(sum);
		};
		const transform = function() {
			let m = get_matrix2(...arguments);
			return Vector( multiply_vector2_matrix2(_v, m) );
		};
		const add = function(){
			let vec = get_vec(...arguments);
			return Vector( _v.map((v,i) => v + vec[i]) );
		};
		const subtract = function(){
			let vec = get_vec(...arguments);
			return Vector( _v.map((v,i) => v - vec[i]) );
		};
		const rotateZ = function(angle, origin) {
			var m = make_matrix2_rotation(angle, origin);
			return Vector( multiply_vector2_matrix2(_v, m) );
		};
		const rotateZ90 = function() {
			return Vector(-_v[1], _v[0]);
		};
		const rotateZ180 = function() {
			return Vector(-_v[0], -_v[1]);
		};
		const rotateZ270 = function() {
			return Vector(_v[1], -_v[0]);
		};
		const reflect = function() {
			let reflect = get_line(...arguments);
			let m = make_matrix2_reflection(reflect.vector, reflect.point);
			return Vector( multiply_vector2_matrix2(_v, m) );
		};
		const lerp = function(vector, pct) {
			let vec = get_vec(vector);
			let inv = 1.0 - pct;
			let length = (_v.length < vec.length) ? _v.length : vec.length;
			let components = Array.from(Array(length))
				.map((_,i) => _v[i] * pct + vec[i] * inv);
			return Vector(components);
		};
		const isEquivalent = function() {
			let vec = get_vec(...arguments);
			let sm = (_v.length < vec.length) ? _v : vec;
			let lg = (_v.length < vec.length) ? vec : _v;
			return equivalent(sm, lg);
		};
		const isParallel = function() {
			let vec = get_vec(...arguments);
			let sm = (_v.length < vec.length) ? _v : vec;
			let lg = (_v.length < vec.length) ? vec : _v;
			return parallel(sm, lg);
		};
		const scale = function(mag) {
			return Vector( _v.map(v => v * mag) );
		};
		const midpoint = function() {
			let vec = get_vec(...arguments);
			let sm = (_v.length < vec.length) ? _v.slice() : vec;
			let lg = (_v.length < vec.length) ? vec : _v.slice();
			for(var i = sm.length; i < lg.length; i++){ sm[i] = 0; }
			return Vector(lg.map((_,i) => (sm[i] + lg[i]) * 0.5));
		};
		const bisect = function(){
			let vec = get_vec(...arguments);
			return Vector( bisect_vectors(_v, vec) );
		};
		Object.defineProperty(_v, "normalize", {value: normalize$$1});
		Object.defineProperty(_v, "dot", {value: dot$$1});
		Object.defineProperty(_v, "cross", {value: cross});
		Object.defineProperty(_v, "distanceTo", {value: distanceTo});
		Object.defineProperty(_v, "transform", {value: transform});
		Object.defineProperty(_v, "add", {value: add});
		Object.defineProperty(_v, "subtract", {value: subtract});
		Object.defineProperty(_v, "rotateZ", {value: rotateZ});
		Object.defineProperty(_v, "rotateZ90", {value: rotateZ90});
		Object.defineProperty(_v, "rotateZ180", {value: rotateZ180});
		Object.defineProperty(_v, "rotateZ270", {value: rotateZ270});
		Object.defineProperty(_v, "reflect", {value: reflect});
		Object.defineProperty(_v, "lerp", {value: lerp});
		Object.defineProperty(_v, "isEquivalent", {value: isEquivalent});
		Object.defineProperty(_v, "isParallel", {value: isParallel});
		Object.defineProperty(_v, "scale", {value: scale});
		Object.defineProperty(_v, "midpoint", {value: midpoint});
		Object.defineProperty(_v, "bisect", {value: bisect});
		Object.defineProperty(_v, "x", {get: function(){ return _v[0]; }});
		Object.defineProperty(_v, "y", {get: function(){ return _v[1]; }});
		Object.defineProperty(_v, "z", {get: function(){ return _v[2]; }});
		Object.defineProperty(_v, "magnitude", {get: function() {
			return magnitude(_v);
		}});
		return _v;
	}

	function Circle(){
		let _origin, _radius;
		let params = Array.from(arguments);
		let numbers = params.filter((param) => !isNaN(param));
		if (numbers.length === 3) {
			_origin = numbers.slice(0,2);
			_radius = numbers[2];
		}
		const intersectionLine = function() {
			let line = get_line(...arguments);
			let p2 = [line.point[0] + line.vector[0], line.point[1] + line.vector[1]];
			let intersection = intersection_circle_line(_origin, _radius, line.point, p2);
			return (intersection === undefined
				? undefined
				: intersection.map(i => Vector(i))
			);
		};
		const intersectionRay = function() {
			let points = get_ray(...arguments);
			let intersection = intersection_circle_ray(_origin, _radius, points[0], points[1]);
			return (intersection === undefined
				? undefined
				: intersection.map(i => Vector(i))
			);
		};
		const intersectionEdge = function() {
			let points = get_two_vec2(...arguments);
			let intersection = intersection_circle_edge(_origin, _radius, points[0], points[1]);
			return (intersection === undefined
				? undefined
				: intersection.map(i => Vector(i))
			);
		};
		return {
			intersectionLine,
			intersectionRay,
			intersectionEdge,
			get origin() { return _origin; },
			get radius() { return _radius; },
		};
	}

	function LinePrototype(proto) {
		if(proto == null) {
			proto = {};
		}
		const reflection = function() {
			return Matrix2.makeReflection(this.vector, this.point);
		};
		const nearestPoint = function() {
			let point = get_vec(...arguments);
			return Vector(nearest_point(this.point, this.vector, point, this.vec_cap_func));
		};
		const intersectLine = function() {
			let line = get_line(...arguments);
			return intersection_function(
				this.point, this.vector,
				line.point, line.vector,
				compare_to_line.bind(this));
		};
		const intersectRay = function() {
			let ray = get_ray(...arguments);
			return intersection_function(
				this.point, this.vector,
				ray.point, ray.vector,
				compare_to_ray.bind(this));
		};
		const intersectEdge = function() {
			let edge = get_edge(...arguments);
			let edgeVec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
			return intersection_function(
				this.point, this.vector,
				edge[0], edgeVec,
				compare_to_edge.bind(this));
		};
		const compare_to_line = function(t0, t1, epsilon = EPSILON) {
			return this.vec_comp_func(t0, epsilon) && true;
		};
		const compare_to_ray = function(t0, t1, epsilon = EPSILON) {
			return this.vec_comp_func(t0, epsilon) && t1 >= -epsilon;
		};
		const compare_to_edge = function(t0, t1, epsilon = EPSILON) {
			return this.vec_comp_func(t0, epsilon) && t1 >= -epsilon && t1 <= 1+epsilon;
		};
		Object.defineProperty(proto, "reflection", {value: reflection});
		Object.defineProperty(proto, "nearestPoint", {value: nearestPoint});
		Object.defineProperty(proto, "intersectLine", {value: intersectLine});
		Object.defineProperty(proto, "intersectRay", {value: intersectRay});
		Object.defineProperty(proto, "intersectEdge", {value: intersectEdge});
		return Object.freeze(proto);
	}
	function Line() {
		let { point, vector } = get_line(...arguments);
		const isParallel = function() {
			let line = get_line(...arguments);
			return parallel(vector, line.vector);
		};
		const transform = function() {
			let mat = get_matrix2(...arguments);
			let norm = normalize(vector);
			let temp = point.map((p,i) => p + norm[i]);
			if (temp == null) { return; }
			var p0 = multiply_vector2_matrix2(point, mat);
			var p1 = multiply_vector2_matrix2(temp, mat);
			return Line.fromPoints([p0, p1]);
		};
		let line = Object.create(LinePrototype());
		const vec_comp_func = function() { return true; };
		const vec_cap_func = function(d) { return d; };
		Object.defineProperty(line, "vec_comp_func", {value: vec_comp_func});
		Object.defineProperty(line, "vec_cap_func", {value: vec_cap_func});
		Object.defineProperty(line, "point", {get: function(){ return Vector(point); }});
		Object.defineProperty(line, "vector", {get: function(){ return Vector(vector); }});
		Object.defineProperty(line, "length", {get: function(){ return Infinity; }});
		Object.defineProperty(line, "transform", {value: transform});
		Object.defineProperty(line, "isParallel", {value: isParallel});
		return line;
	}
	Line.fromPoints = function() {
		let points = get_two_vec2(...arguments);
		return Line({
			point: points[0],
			vector: normalize([
				points[1][0] - points[0][0],
				points[1][1] - points[0][1]
			])
		});
	};
	Line.perpendicularBisector = function() {
		let points = get_two_vec2(...arguments);
		let vec = normalize([
			points[1][0] - points[0][0],
			points[1][1] - points[0][1]
		]);
		return Line({
			point: midpoint$1(points[0], points[1]),
			vector: [vec[1], -vec[0]]
		});
	};
	function Ray() {
		let { point, vector } = get_line(...arguments);
		const transform = function() {
			let mat = get_matrix2(...arguments);
			let norm = normalize(vector);
			let temp = point.map((p,i) => p + norm[i]);
			if (temp == null) { return; }
			var p0 = multiply_vector2_matrix2(point, mat);
			var p1 = multiply_vector2_matrix2(temp, mat);
			return Ray.fromPoints([p0, p1]);
		};
		const rotate180 = function() {
			return Ray(point[0], point[1], -vector[0], -vector[1]);
		};
		let ray = Object.create(LinePrototype());
		const vec_comp_func = function(t0, ep) { return t0 >= -ep; };
		const vec_cap_func = function(d, ep) { return (d < -ep ? 0 : d); };
		Object.defineProperty(ray, "vec_comp_func", {value: vec_comp_func});
		Object.defineProperty(ray, "vec_cap_func", {value: vec_cap_func});
		Object.defineProperty(ray, "point", {get: function(){ return Vector(point); }});
		Object.defineProperty(ray, "vector", {get: function(){ return Vector(vector); }});
		Object.defineProperty(ray, "length", {get: function(){ return Infinity; }});
		Object.defineProperty(ray, "transform", {value: transform});
		Object.defineProperty(ray, "rotate180", {value: rotate180});
		return ray;
	}
	Ray.fromPoints = function() {
		let points = get_two_vec2(...arguments);
		return Ray({
			point: points[0],
			vector: normalize([
				points[1][0] - points[0][0],
				points[1][1] - points[0][1]
			])
		});
	};
	function Edge() {
		let inputs = get_two_vec2(...arguments);
		let edge = Object.create(LinePrototype(Array()));
		let _endpoints = (inputs.length > 0 ? inputs.map(p => Vector(p)) : undefined);
		if (_endpoints === undefined) { return; }
		_endpoints.forEach((p,i) => edge[i] = p);
		const transform = function() {
			let mat = get_matrix2(...arguments);
			let transformed_points = edge
				.map(point => multiply_vector2_matrix2(point, mat));
			return Edge(transformed_points);
		};
		const vector = function() {
			return Vector(
				edge[1][0] - edge[0][0],
				edge[1][1] - edge[0][1]
			);
		};
		const length = function() {
			return Math.sqrt(Math.pow(edge[1][0] - edge[0][0],2)
			               + Math.pow(edge[1][1] - edge[0][1],2));
		};
		const vec_comp_func = function(t0, ep) { return t0 >= -ep && t0 <= 1+ep; };
		const vec_cap_func = function(d, ep) {
			if (d < -ep) { return 0; }
			if (d > 1+ep) { return 1; }
			return d;
		};
		Object.defineProperty(edge, "vec_comp_func", {value: vec_comp_func});
		Object.defineProperty(edge, "vec_cap_func", {value: vec_cap_func});
		Object.defineProperty(edge, "point", {get: function(){ return edge[0]; }});
		Object.defineProperty(edge, "vector", {get: function(){ return vector(); }});
		Object.defineProperty(edge, "length", {get: function(){ return length(); }});
		Object.defineProperty(edge, "transform", {value: transform});
		return edge;
	}

	function Polygon() {
		let _points = get_array_of_vec(...arguments);
		if (_points === undefined) {
			return undefined;
		}
		const contains = function() {
			let point = get_vec(...arguments);
			return point_in_poly(_points, point);
		};
		const scale = function(magnitude, center = centroid(_points)) {
			let newPoints = _points
				.map(p => [0,1].map((_,i) => p[i] - center[i]))
				.map(vec => vec.map((_,i) => center[i] + vec[i] * magnitude));
			return Polygon(newPoints);
		};
		const rotate = function(angle, centerPoint = centroid(_points)) {
			let newPoints = _points.map(p => {
				let vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
				let mag = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
				let a = Math.atan2(vec[1], vec[0]);
				return [
					centerPoint[0] + Math.cos(a+angle) * mag,
					centerPoint[1] + Math.sin(a+angle) * mag
				];
			});
			return Polygon(newPoints);
		};
		const split = function() {
			let line = get_line(...arguments);
			return split_polygon(_points, line.point, line.vector)
				.map(poly => Polygon(poly));
		};
		const clipEdge = function() {
			let edge = get_edge(...arguments);
			return clip_edge_in_convex_poly(_points, edge[0], edge[1]);
		};
		const clipLine = function() {
			let line = get_line(...arguments);
			return clip_line_in_convex_poly(_points, line.point, line.vector);
		};
		const clipRay = function() {
			let line = get_line(...arguments);
			return clip_ray_in_convex_poly(_points, line.point, line.vector);
		};
		return {
			contains,
			scale,
			rotate,
			split,
			clipEdge,
			clipLine,
			clipRay,
			get points() { return _points; },
			get area() { return signed_area(_points); },
			get signedArea() { return signed_area(_points); },
			get centroid() { return centroid(_points); },
			get midpoint() { return Algebra.average(_points); },
			get enclosingRectangle() {
				return Rectangle(enclosing_rectangle(_points));
			},
		};
	}
	Polygon.regularPolygon = function(sides, x = 0, y = 0, radius = 1) {
		let points = make_regular_polygon(sides, x, y, radius);
		return Polygon(points);
	};
	Polygon.convexHull = function(points, includeCollinear = false) {
		let hull = convex_hull(points, includeCollinear);
		return Polygon(hull);
	};
	function ConvexPolygon() {
		let polygon = Object.create(Polygon(...arguments));
		const clipEdge = function() {
			let edge = get_edge(...arguments);
			let e = clip_edge_in_convex_poly(polygon.points, edge[0], edge[1]);
			return e === undefined ? undefined : Edge(e);
		};
		const clipLine = function() {
			let line = get_line(...arguments);
			let e = clip_line_in_convex_poly(polygon.points, line.point, line.vector);
			return e === undefined ? undefined : Edge(e);
		};
		const clipRay = function() {
			let line = get_line(...arguments);
			let e = clip_ray_in_convex_poly(polygon.points, line.point, line.vector);
			return e === undefined ? undefined : Edge(e);
		};
		const split = function() {
			let line = get_line(...arguments);
			return split_convex_polygon(polygon.points, line.point, line.vector)
				.map(poly => ConvexPolygon(poly));
		};
		const overlaps = function() {
			let points = get_array_of_vec(...arguments);
			return convex_polygons_overlap(polygon.points, points);
		};
		const scale = function(magnitude, center = centroid(polygon.points)) {
			let newPoints = polygon.points
				.map(p => [0,1].map((_,i) => p[i] - center[i]))
				.map(vec => vec.map((_,i) => center[i] + vec[i] * magnitude));
			return ConvexPolygon(newPoints);
		};
		const rotate = function(angle, centerPoint = centroid(polygon.points)) {
			let newPoints = polygon.points.map(p => {
				let vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
				let mag = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
				let a = Math.atan2(vec[1], vec[0]);
				return [
					centerPoint[0] + Math.cos(a+angle) * mag,
					centerPoint[1] + Math.sin(a+angle) * mag
				];
			});
			return ConvexPolygon(newPoints);
		};
		Object.defineProperty(polygon, "clipEdge", {value: clipEdge});
		Object.defineProperty(polygon, "clipLine", {value: clipLine});
		Object.defineProperty(polygon, "clipRay", {value: clipRay});
		Object.defineProperty(polygon, "split", {value: split});
		Object.defineProperty(polygon, "overlaps", {value: overlaps});
		Object.defineProperty(polygon, "scale", {value: scale});
		Object.defineProperty(polygon, "rotate", {value: rotate});
		return polygon;
	}
	ConvexPolygon.regularPolygon = function(sides, x = 0, y = 0, radius = 1) {
		let points = make_regular_polygon(sides, x, y, radius);
		return ConvexPolygon(points);
	};
	ConvexPolygon.convexHull = function(points, includeCollinear = false) {
		let hull = convex_hull(points, includeCollinear);
		return ConvexPolygon(hull);
	};
	function Rectangle(){
		let _origin, _width, _height;
		let params = Array.from(arguments);
		let numbers = params.filter((param) => !isNaN(param));
		let arrays = params.filter((param) => param.constructor === Array);
		if (numbers.length === 4) {
			_origin = numbers.slice(0,2);
			_width = numbers[2];
			_height = numbers[3];
		}
		if (arrays.length === 1) { arrays = arrays[0]; }
		if (arrays.length === 2) {
			if (typeof arrays[0][0] === "number") {
				_origin = arrays[0].slice();
				_width = arrays[1][0];
				_height = arrays[1][1];
			}
		}
		let points = [
			[_origin[0], _origin[1]],
			[_origin[0] + _width, _origin[1]],
			[_origin[0] + _width, _origin[1] + _height],
			[_origin[0], _origin[1] + _height],
		];
		let rect = Object.create(ConvexPolygon(points));
		const scale = function(magnitude, center) {
			if (center == null) {
				center = [_origin[0] + _width, _origin[1] + _height];
			}
			let x = _origin[0] + (center[0] - _origin[0]) * (1-magnitude);
			let y = _origin[1] + (center[1] - _origin[1]) * (1-magnitude);
			return Rectangle(x, y, _width*magnitude, _height*magnitude);
		};
		Object.defineProperty(rect, "origin", {get: function(){ return _origin; }});
		Object.defineProperty(rect, "width", {get: function(){ return _width; }});
		Object.defineProperty(rect, "height", {get: function(){ return _height; }});
		Object.defineProperty(rect, "area", {
			get: function(){ return _width * _height; }
		});
		Object.defineProperty(rect, "scale", {value: scale});
		return rect;
	}

	function Matrix2$1() {
		let _m = get_matrix2(...arguments);
		const inverse = function() {
			return Matrix2$1( make_matrix2_inverse(_m) );
		};
		const multiply = function() {
			let m2 = get_matrix2(...arguments);
			return Matrix2$1( multiply_matrices2(_m, m2) );
		};
		const transform = function() {
			let v = get_vec(...arguments);
			return Vector( multiply_vector2_matrix2(v, _m) );
		};
		return {
			inverse,
			multiply,
			transform,
			get m() { return _m; },
		};
	}
	Matrix2$1.makeIdentity = function() {
		return Matrix2$1(1,0,0,1,0,0);
	};
	Matrix2$1.makeRotation = function(angle, origin) {
		return Matrix2$1( make_matrix2_rotation(angle, origin) );
	};
	Matrix2$1.makeReflection = function(vector, origin) {
		return Matrix2$1( make_matrix2_reflection(vector, origin) );
	};

	function Sector(center, pointA, pointB) {
		let _center = get_vec(center);
		let _points = [pointA, pointB];
		let _vectors = _points.map(p => p.map((_,i) => p[i] - _center[i]));
		let _angle = counter_clockwise_angle2(_vectors[0], _vectors[1]);
		const bisect = function() {
			let angles = _vectors.map(el => Math.atan2(el[1], el[0]));
			let bisected = angles[0] + _angle*0.5;
			return Ray(_center[0], _center[1], Math.cos(bisected), Math.sin(bisected));
		};
		const subsect = function(divisions) {
		};
		const contains = function() {
			let point = get_vec(...arguments);
			var cross0 = (point[1] - _points[0][1]) * (_center[0] - _points[0][0]) -
			             (point[0] - _points[0][0]) * (_center[1] - _points[0][1]);
			var cross1 = (point[1] - _center[1]) * (_points[1][0] - _center[0]) -
			             (point[0] - _center[0]) * (_points[1][1] - _center[1]);
			return cross0 < 0 && cross1 < 0;
		};
		return {
			contains,
			bisect,
			subsect,
			get center() { return _center; },
			get points() { return _points; },
			get vectors() { return _vectors; },
			get angle() { return _angle; },
		};
	}

	function Junction(center, points) {
		let _points = get_array_of_vec(points);
		if (_points === undefined) {
			return undefined;
		}
		let _center = get_vec(center);
		let _vectors = _points.map(p => p.map((_,i) => p[i] - center[i]));
		let _angles = _vectors.map(v => Math.atan2(v[1], v[0]));
		let clockwise_order = Array.from(Array(_angles.length))
			.map((_,i) => i)
			.sort((a,b) => _angles[a] - _angles[b]);
		clockwise_order = clockwise_order
			.slice(clockwise_order.indexOf(0), clockwise_order.length)
			.concat(clockwise_order.slice(0, clockwise_order.indexOf(0)));
		const kawasaki = function() {
			let angles = points
				.map(p => [p.position[0] - sketch.width/2, p.position[1] - sketch.height/2])
				.map(v => Math.atan2(v[1], v[0]))
				.sort((a,b) => a - b);
			let r = (sketch.width > sketch.height) ? sketch.height*0.4 : sketch.width*0.4;
			let wedges = angles.map((_,i,arr) =>
				RabbitEar.svg.wedge(sketch.width/2, sketch.height/2, r, angles[i], angles[(i+1)%arr.length])
			);
			let wedgeColors = ["#314f69", "#e35536"];
			wedges.forEach((w,i) => w.setAttribute("fill", wedgeColors[i%2]));
			wedges.forEach(w => sketch.sectorLayer.appendChild(w));
		};
		const sectors = function() {
			return clockwise_order.map((_,i,arr) => Sector(_center, _points[clockwise_order[i]], _points[clockwise_order[(i+1)%clockwise_order.length]]));
		};
		const alternatingAngleSum = function() {
			let interior = sectors().map(s => s.angle);
			return [
				interior.filter((_,i) => i%2 === 0).reduce((a,b) => a+b, 0),
				interior.filter((_,i) => i%2 === 1).reduce((a,b) => a+b, 0)
			];
		};
		const kawasaki_from_even = function(array) {
			let even_sum = array.filter((_,i) => i%2 === 0).reduce((a,b) => a+b, 0);
			let odd_sum = array.filter((_,i) => i%2 === 1).reduce((a,b) => a+b, 0);
			return [Math.PI - even_sum, Math.PI - odd_sum];
		};
		const kawasaki_solutions = function() {
			return clockwise_order.map((_,i) => {
				let thisV = _vectors[clockwise_order[i]];
				let nextV = _vectors[clockwise_order[(i+1)%clockwise_order.length]];
				return counter_clockwise_angle2(thisV, nextV);
			}).map((_, i, arr) =>
				arr.slice(i+1,arr.length).concat(arr.slice(0,i))
			).map(a => kawasaki_from_even(a))
			.map((kawasakis, i, arr) =>
				(kawasakis == null
					? undefined
					: _angles[clockwise_order[i]] + kawasakis[0])
			).map(k => (k === undefined)
				? undefined
				: [Math.cos(k), Math.sin(k)]
			);
		};
		return {
			kawasaki,
			kawasaki_solutions,
			alternatingAngleSum,
			sectors,
			get center() { return _center; },
			get points() { return _points; },
			get vectors() { return _vectors; },
			get angles() { return _angles; },
		};
	}
	Junction.fromVectors = function(center, vectors) {
		let points = get_array_of_vec(vectors)
			.map(v => v.map((n,i) => n + center[i]));
		return Junction(center, points);
	};

	let core = { algebra, geometry, intersection, origami: origami$1, EPSILON_LOW, EPSILON, EPSILON_HIGH, clean_number };

	var geometry$1 = /*#__PURE__*/Object.freeze({
		core: core,
		Vector: Vector,
		Circle: Circle,
		Polygon: Polygon,
		ConvexPolygon: ConvexPolygon,
		Rectangle: Rectangle,
		Matrix2: Matrix2$1,
		Line: Line,
		Ray: Ray,
		Edge: Edge,
		Junction: Junction,
		Sector: Sector
	});

	/* SVG (c) Robby Kraft, MIT License */
	function createShiftArr(step) {
		var space = '    ';
		if ( isNaN(parseInt(step)) ) {
			space = step;
		} else {
			switch(step) {
				case 1: space = ' '; break;
				case 2: space = '  '; break;
				case 3: space = '   '; break;
				case 4: space = '    '; break;
				case 5: space = '     '; break;
				case 6: space = '      '; break;
				case 7: space = '       '; break;
				case 8: space = '        '; break;
				case 9: space = '         '; break;
				case 10: space = '          '; break;
				case 11: space = '           '; break;
				case 12: space = '            '; break;
			}
		}
		var shift = ['\n'];
		for(let ix=0;ix<100;ix++){
			shift.push(shift[ix]+space);
		}
		return shift;
	}
	function vkbeautify(){
		this.step = '\t';
		this.shift = createShiftArr(this.step);
	}vkbeautify.prototype.xml = function(text,step) {
		var ar = text.replace(/>\s{0,}</g,"><")
					 .replace(/</g,"~::~<")
					 .replace(/\s*xmlns\:/g,"~::~xmlns:")
					 .replace(/\s*xmlns\=/g,"~::~xmlns=")
					 .split('~::~'),
			len = ar.length,
			inComment = false,
			deep = 0,
			str = '',
			shift = step ? createShiftArr(step) : this.shift;
			for(let ix=0;ix<len;ix++) {
				if(ar[ix].search(/<!/) > -1) {
					str += shift[deep]+ar[ix];
					inComment = true;
					if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1 || ar[ix].search(/!DOCTYPE/) > -1 ) {
						inComment = false;
					}
				} else
				if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) {
					str += ar[ix];
					inComment = false;
				} else
				if( /^<\w/.exec(ar[ix-1]) && /^<\/\w/.exec(ar[ix]) &&
					/^<[\w:\-\.\,]+/.exec(ar[ix-1]) == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace('/','')) {
					str += ar[ix];
					if(!inComment) deep--;
				} else
				if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) == -1 && ar[ix].search(/\/>/) == -1 ) {
					str = !inComment ? str += shift[deep++]+ar[ix] : str += ar[ix];
				} else
				if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
					str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
				} else
				if(ar[ix].search(/<\//) > -1) {
					str = !inComment ? str += shift[--deep]+ar[ix] : str += ar[ix];
				} else
				if(ar[ix].search(/\/>/) > -1 ) {
					str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
				} else
				if(ar[ix].search(/<\?/) > -1) {
					str += shift[deep]+ar[ix];
				} else
				if( ar[ix].search(/xmlns\:/) > -1  || ar[ix].search(/xmlns\=/) > -1) {
					str += shift[deep]+ar[ix];
				}
				else {
					str += ar[ix];
				}
			}
		return  (str[0] == '\n') ? str.slice(1) : str;
	};
	vkbeautify.prototype.json = function(text,step) {
		var step = step ? step : this.step;
		if (typeof JSON === 'undefined' ) return text;
		if ( typeof text === "string" ) return JSON.stringify(JSON.parse(text), null, step);
		if ( typeof text === "object" ) return JSON.stringify(text, null, step);
		return text;
	};
	vkbeautify.prototype.css = function(text, step) {
		var ar = text.replace(/\s{1,}/g,' ')
					.replace(/\{/g,"{~::~")
					.replace(/\}/g,"~::~}~::~")
					.replace(/\;/g,";~::~")
					.replace(/\/\*/g,"~::~/*")
					.replace(/\*\//g,"*/~::~")
					.replace(/~::~\s{0,}~::~/g,"~::~")
					.split('~::~'),
			len = ar.length,
			deep = 0,
			str = '',
			shift = step ? createShiftArr(step) : this.shift;
			for(let ix=0;ix<len;ix++) {
				if( /\{/.exec(ar[ix]))  {
					str += shift[deep++]+ar[ix];
				} else
				if( /\}/.exec(ar[ix]))  {
					str += shift[--deep]+ar[ix];
				} else
				if( /\*\\/.exec(ar[ix]))  {
					str += shift[deep]+ar[ix];
				}
				else {
					str += shift[deep]+ar[ix];
				}
			}
			return str.replace(/^\n{1,}/,'');
	};
	function isSubquery(str, parenthesisLevel) {
		return  parenthesisLevel - (str.replace(/\(/g,'').length - str.replace(/\)/g,'').length )
	}
	function split_sql(str, tab) {
		return str.replace(/\s{1,}/g," ")
					.replace(/ AND /ig,"~::~"+tab+tab+"AND ")
					.replace(/ BETWEEN /ig,"~::~"+tab+"BETWEEN ")
					.replace(/ CASE /ig,"~::~"+tab+"CASE ")
					.replace(/ ELSE /ig,"~::~"+tab+"ELSE ")
					.replace(/ END /ig,"~::~"+tab+"END ")
					.replace(/ FROM /ig,"~::~FROM ")
					.replace(/ GROUP\s{1,}BY/ig,"~::~GROUP BY ")
					.replace(/ HAVING /ig,"~::~HAVING ")
					.replace(/ IN /ig," IN ")
					.replace(/ JOIN /ig,"~::~JOIN ")
					.replace(/ CROSS~::~{1,}JOIN /ig,"~::~CROSS JOIN ")
					.replace(/ INNER~::~{1,}JOIN /ig,"~::~INNER JOIN ")
					.replace(/ LEFT~::~{1,}JOIN /ig,"~::~LEFT JOIN ")
					.replace(/ RIGHT~::~{1,}JOIN /ig,"~::~RIGHT JOIN ")
					.replace(/ ON /ig,"~::~"+tab+"ON ")
					.replace(/ OR /ig,"~::~"+tab+tab+"OR ")
					.replace(/ ORDER\s{1,}BY/ig,"~::~ORDER BY ")
					.replace(/ OVER /ig,"~::~"+tab+"OVER ")
					.replace(/\(\s{0,}SELECT /ig,"~::~(SELECT ")
					.replace(/\)\s{0,}SELECT /ig,")~::~SELECT ")
					.replace(/ THEN /ig," THEN~::~"+tab+"")
					.replace(/ UNION /ig,"~::~UNION~::~")
					.replace(/ USING /ig,"~::~USING ")
					.replace(/ WHEN /ig,"~::~"+tab+"WHEN ")
					.replace(/ WHERE /ig,"~::~WHERE ")
					.replace(/ WITH /ig,"~::~WITH ")
					.replace(/ ALL /ig," ALL ")
					.replace(/ AS /ig," AS ")
					.replace(/ ASC /ig," ASC ")
					.replace(/ DESC /ig," DESC ")
					.replace(/ DISTINCT /ig," DISTINCT ")
					.replace(/ EXISTS /ig," EXISTS ")
					.replace(/ NOT /ig," NOT ")
					.replace(/ NULL /ig," NULL ")
					.replace(/ LIKE /ig," LIKE ")
					.replace(/\s{0,}SELECT /ig,"SELECT ")
					.replace(/\s{0,}UPDATE /ig,"UPDATE ")
					.replace(/ SET /ig," SET ")
					.replace(/~::~{1,}/g,"~::~")
					.split('~::~');
	}
	vkbeautify.prototype.sql = function(text,step) {
		var ar_by_quote = text.replace(/\s{1,}/g," ")
								.replace(/\'/ig,"~::~\'")
								.split('~::~'),
			len = ar_by_quote.length,
			ar = [],
			deep = 0,
			tab = this.step,
			parenthesisLevel = 0,
			str = '',
			shift = step ? createShiftArr(step) : this.shift;		for(let ix=0;ix<len;ix++) {
				if(ix%2) {
					ar = ar.concat(ar_by_quote[ix]);
				} else {
					ar = ar.concat(split_sql(ar_by_quote[ix], tab) );
				}
			}
			len = ar.length;
			for(let ix=0;ix<len;ix++) {
				parenthesisLevel = isSubquery(ar[ix], parenthesisLevel);
				if( /\s{0,}\s{0,}SELECT\s{0,}/.exec(ar[ix]))  {
					ar[ix] = ar[ix].replace(/\,/g,",\n"+tab+tab+"");
				}
				if( /\s{0,}\s{0,}SET\s{0,}/.exec(ar[ix]))  {
					ar[ix] = ar[ix].replace(/\,/g,",\n"+tab+tab+"");
				}
				if( /\s{0,}\(\s{0,}SELECT\s{0,}/.exec(ar[ix]))  {
					deep++;
					str += shift[deep]+ar[ix];
				} else
				if( /\'/.exec(ar[ix]) )  {
					if(parenthesisLevel<1 && deep) {
						deep--;
					}
					str += ar[ix];
				}
				else  {
					str += shift[deep]+ar[ix];
					if(parenthesisLevel<1 && deep) {
						deep--;
					}
				}
			}
			str = str.replace(/^\n{1,}/,'').replace(/\n{1,}/g,"\n");
			return str;
	};
	vkbeautify.prototype.xmlmin = function(text, preserveComments) {
		var str = preserveComments ? text
								   : text.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/g,"")
										 .replace(/[ \r\n\t]{1,}xmlns/g, ' xmlns');
		return  str.replace(/>\s{0,}</g,"><");
	};
	vkbeautify.prototype.jsonmin = function(text) {
		if (typeof JSON === 'undefined' ) return text;
		return JSON.stringify(JSON.parse(text), null, 0);
	};
	vkbeautify.prototype.cssmin = function(text, preserveComments) {
		var str = preserveComments ? text
								   : text.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g,"") ;
		return str.replace(/\s{1,}/g,' ')
				  .replace(/\{\s{1,}/g,"{")
				  .replace(/\}\s{1,}/g,"}")
				  .replace(/\;\s{1,}/g,";")
				  .replace(/\/\*\s{1,}/g,"/*")
				  .replace(/\*\/\s{1,}/g,"*/");
	};
	vkbeautify.prototype.sqlmin = function(text) {
		return text.replace(/\s{1,}/g," ").replace(/\s{1,}\(/,"(").replace(/\s{1,}\)/,")");
	};
	var vkbeautify$1 = (new vkbeautify());

	const removeChildren = function(parent) {
		while (parent.lastChild) {
			parent.removeChild(parent.lastChild);
		}
	};
	const getWidth = function(svg) {
		let w = parseInt(svg.getAttributeNS(null, "width"));
		return w != null && !isNaN(w) ? w : svg.getBoundingClientRect().width;
	};
	const getHeight = function(svg) {
		let h = parseInt(svg.getAttributeNS(null, "height"));
		return h != null && !isNaN(h) ? h : svg.getBoundingClientRect().height;
	};
	const getClassList = function(xmlNode) {
		let currentClass = xmlNode.getAttribute("class");
		return (currentClass == null
			? []
			: currentClass.split(" ").filter((s) => s !== ""));
	};
	const addClass = function(xmlNode, newClass) {
		if (xmlNode == null) {
			return;
		}
		let classes = getClassList(xmlNode)
			.filter(c => c !== newClass);
		classes.push(newClass);
		xmlNode.setAttributeNS(null, "class", classes.join(" "));
		return xmlNode;
	};
	const removeClass = function(xmlNode, removedClass) {
		if (xmlNode == null) {
			return;
		}
		let classes = getClassList(xmlNode)
			.filter(c => c !== removedClass);
		xmlNode.setAttributeNS(null, "class", classes.join(" "));
		return xmlNode;
	};
	const setClass = function(xmlNode, className) {
		xmlNode.setAttributeNS(null, "class", className);
		return xmlNode;
	};
	const setID = function(xmlNode, idName) {
		xmlNode.setAttributeNS(null, "id", idName);
		return xmlNode;
	};
	const save = function(svg, filename = "image.svg") {
		let a = document.createElement("a");
		let source = (new window.XMLSerializer()).serializeToString(svg);
		let formatted = vkbeautify$1.xml(source);
		let blob = new window.Blob([formatted], {type: "text/plain"});
		a.setAttribute("href", window.URL.createObjectURL(blob));
		a.setAttribute("download", filename);
		document.body.appendChild(a);
		a.click();
		a.remove();
	};
	const pErr = (new window.DOMParser())
		.parseFromString("INVALID", "text/xml")
		.getElementsByTagName("parsererror")[0]
		.namespaceURI;
	const load = function(input, callback) {
		if (typeof input === "string" || input instanceof String) {
			let xml = (new window.DOMParser()).parseFromString(input, "text/xml");
			if (xml.getElementsByTagNameNS(pErr, "parsererror").length === 0) {
				let parsedSVG = xml.documentElement;
				if (callback != null) {
					callback(parsedSVG);
				}
				return parsedSVG;
			}
			fetch(input)
				.then((response) => response.text())
				.then((str) => (new window.DOMParser())
					.parseFromString(str, "text/xml")
				).then((svgData) => {
					let allSVGs = svgData.getElementsByTagName("svg");
					if (allSVGs == null || allSVGs.length === 0) {
						throw "error, valid XML found, but no SVG element";
					}
					if (callback != null) {
						callback(allSVGs[0]);
					}
					return allSVGs[0];
				});
		} else if (input instanceof Document) {
			callback(input);
			return input;
		}
	};

	const setViewBox = function(svg, x, y, width, height, padding = 0) {
		let scale = 1.0;
		let d = (width / scale) - width;
		let X = (x - d) - padding;
		let Y = (y - d) - padding;
		let W = (width + d * 2) + padding * 2;
		let H = (height + d * 2) + padding * 2;
		let viewBoxString = [X, Y, W, H].join(" ");
		svg.setAttributeNS(null, "viewBox", viewBoxString);
	};
	const getViewBox = function(svg) {
		let vb = svg.getAttribute("viewBox");
		return (vb == null
			? undefined
			: vb.split(" ").map((n) => parseFloat(n)));
	};
	const scaleViewBox = function(svg, scale, origin_x = 0, origin_y = 0) {
		if (scale < 1e-8) { scale = 0.01; }
		let matrix = svg.createSVGMatrix()
			.translate(origin_x, origin_y)
			.scale(1/scale)
			.translate(-origin_x, -origin_y);
		let viewBox = getViewBox(svg);
		if (viewBox == null) {
			setDefaultViewBox(svg);
		}
		let top_left = svg.createSVGPoint();
		let bot_right = svg.createSVGPoint();
		top_left.x = viewBox[0];
		top_left.y = viewBox[1];
		bot_right.x = viewBox[0] + viewBox[2];
		bot_right.y = viewBox[1] + viewBox[3];
		let new_top_left = top_left.matrixTransform(matrix);
		let new_bot_right = bot_right.matrixTransform(matrix);
		setViewBox(svg,
			new_top_left.x,
			new_top_left.y,
			new_bot_right.x - new_top_left.x,
			new_bot_right.y - new_top_left.y
		);
	};
	const translateViewBox = function(svg, dx, dy) {
		let viewBox = getViewBox(svg);
		if (viewBox == null) {
			setDefaultViewBox(svg);
		}
		viewBox[0] += dx;
		viewBox[1] += dy;
		svg.setAttributeNS(null, "viewBox", viewBox.join(" "));
	};
	const convertToViewBox = function(svg, x, y) {
		let pt = svg.createSVGPoint();
		pt.x = x;
		pt.y = y;
		let svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
		let array = [svgPoint.x, svgPoint.y];
		array.x = svgPoint.x;
		array.y = svgPoint.y;
		return array;
	};
	const setDefaultViewBox = function(svg) {
		let size = svg.getBoundingClientRect();
		let width = (size.width == 0 ? 640 : size.width);
		let height = (size.height == 0 ? 480 : size.height);
		setViewBox(svg, 0, 0, width, height);
	};

	const svgNS = "http://www.w3.org/2000/svg";
	const svg = function() {
		let svgImage = document.createElementNS(svgNS, "svg");
		svgImage.setAttribute("version", "1.1");
		svgImage.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		setupSVG(svgImage);
		return svgImage;
	};
	const line$1 = function(x1, y1, x2, y2) {
		let shape = document.createElementNS(svgNS, "line");
		if (x1) { shape.setAttributeNS(null, "x1", x1); }
		if (y1) { shape.setAttributeNS(null, "y1", y1); }
		if (x2) { shape.setAttributeNS(null, "x2", x2); }
		if (y2) { shape.setAttributeNS(null, "y2", y2); }
		attachClassMethods(shape);
		return shape;
	};
	const circle = function(x, y, radius) {
		let shape = document.createElementNS(svgNS, "circle");
		if (x) { shape.setAttributeNS(null, "cx", x); }
		if (y) { shape.setAttributeNS(null, "cy", y); }
		if (radius) { shape.setAttributeNS(null, "r", radius); }
		attachClassMethods(shape);
		return shape;
	};
	const ellipse = function(x, y, rx, ry) {
		let shape = document.createElementNS(svgNS, "ellipse");
		if (x) { shape.setAttributeNS(null, "cx", x); }
		if (y) { shape.setAttributeNS(null, "cy", y); }
		if (rx) { shape.setAttributeNS(null, "rx", rx); }
		if (ry) { shape.setAttributeNS(null, "ry", ry); }
		attachClassMethods(shape);
		return shape;
	};
	const rect = function(x, y, width, height) {
		let shape = document.createElementNS(svgNS, "rect");
		if (x) { shape.setAttributeNS(null, "x", x); }
		if (y) { shape.setAttributeNS(null, "y", y); }
		if (width) { shape.setAttributeNS(null, "width", width); }
		if (height) { shape.setAttributeNS(null, "height", height); }
		attachClassMethods(shape);
		return shape;
	};
	const polygon = function(pointsArray) {
		let shape = document.createElementNS(svgNS, "polygon");
		setPoints(shape, pointsArray);
		attachClassMethods(shape);
		return shape;
	};
	const polyline = function(pointsArray) {
		let shape = document.createElementNS(svgNS, "polyline");
		setPoints(shape, pointsArray);
		attachClassMethods(shape);
		return shape;
	};
	const bezier = function(fromX, fromY, c1X, c1Y, c2X, c2Y, toX, toY) {
		let d = "M " + fromX + "," + fromY + " C " + c1X + "," + c1Y +
				" " + c2X + "," + c2Y + " " + toX + "," + toY;
		let shape = document.createElementNS(svgNS, "path");
		shape.setAttributeNS(null, "d", d);
		attachClassMethods(shape);
		return shape;
	};
	const text = function(textString, x, y) {
		let shape = document.createElementNS(svgNS, "text");
		shape.innerHTML = textString;
		shape.setAttributeNS(null, "x", x);
		shape.setAttributeNS(null, "y", y);
		attachClassMethods(shape);
		return shape;
	};
	const wedge = function(x, y, radius, angleA, angleB) {
		let shape = document.createElementNS(svgNS, "path");
		setArc(shape, x, y, radius, angleA, angleB, true);
		attachClassMethods(shape);
		return shape;
	};
	const arc = function(x, y, radius, angleA, angleB) {
		let shape = document.createElementNS(svgNS, "path");
		setArc(shape, x, y, radius, angleA, angleB, false);
		attachClassMethods(shape);
		return shape;
	};
	const group = function() {
		let g = document.createElementNS(svgNS, "g");
		attachClassMethods(g);
		attachGeometryMethods(g);
		return g;
	};
	const regularPolygon = function(cX, cY, radius, sides) {
		let halfwedge = 2*Math.PI/sides * 0.5;
		let r = Math.cos(halfwedge) * radius;
		let points = Array.from(Array(sides)).map((el,i) => {
			let a = -2 * Math.PI * i / sides + halfwedge;
			let x = cX + r * Math.sin(a);
			let y = cY + r * Math.cos(a);
			return [x, y];
		});
		return polygon(points);
	};
	const setPoints = function(polygon, pointsArray) {
		if (pointsArray == null || pointsArray.constructor !== Array) {
			return;
		}
		let pointsString = pointsArray.map((el) =>
			(el.constructor === Array ? el : [el.x, el.y])
		).reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
		polygon.setAttributeNS(null, "points", pointsString);
	};
	const setArc = function(shape, x, y, radius, startAngle, endAngle,
			includeCenter = false) {
		let start = [
			x + Math.cos(startAngle) * radius,
			y + Math.sin(startAngle) * radius ];
		let vecStart = [
			Math.cos(startAngle) * radius,
			Math.sin(startAngle) * radius ];
		let vecEnd = [
			Math.cos(endAngle) * radius,
			Math.sin(endAngle) * radius ];
		let arcVec = [vecEnd[0] - vecStart[0], vecEnd[1] - vecStart[1]];
		let py = vecStart[0]*vecEnd[1] - vecStart[1]*vecEnd[0];
		let px = vecStart[0]*vecEnd[0] + vecStart[1]*vecEnd[1];
		let arcdir = (Math.atan2(py, px) > 0 ? 0 : 1);
		let d = (includeCenter
			? "M " + x + "," + y + " l " + vecStart[0] + "," + vecStart[1] + " "
			: "M " + start[0] + "," + start[1] + " ");
		d += ["a ", radius, radius, 0, arcdir, 1, arcVec[0], arcVec[1]].join(" ");
		if (includeCenter) { d += " Z"; }
		shape.setAttributeNS(null, "d", d);
	};
	const geometryMethods = {
		"line" : line$1,
		"circle" : circle,
		"ellipse" : ellipse,
		"rect" : rect,
		"polygon" : polygon,
		"polyline" : polyline,
		"bezier" : bezier,
		"text" : text,
		"wedge" : wedge,
		"arc" : arc,
		"regularPolygon" : regularPolygon,
		"group" : group,
	};
	const attachGeometryMethods = function(element) {
		Object.keys(geometryMethods).forEach(key => {
			element[key] = function() {
				let g = geometryMethods[key](...arguments);
				element.appendChild(g);
				return g;
			};
		});
	};
	const attachClassMethods = function(element) {
		element.removeChildren = function() { return removeChildren(element); };
		element.addClass = function() { return addClass(element, ...arguments); };
		element.removeClass = function() { return removeClass(element, ...arguments); };
		element.setClass = function() { return setClass(element, ...arguments); };
		element.setID = function() { return setID(element, ...arguments); };
	};
	const attachViewBoxMethods = function(element) {
		element.setViewBox = function() { return setViewBox(element, ...arguments); };
		element.getViewBox = function() { return getViewBox(element, ...arguments); };
		element.scaleViewBox = function() { return scaleViewBox(element, ...arguments); };
		element.translateViewBox = function() { return translateViewBox(element, ...arguments); };
		element.convertToViewBox = function() { return convertToViewBox(element, ...arguments); };
	};
	const setupSVG = function(svgImage) {
		attachClassMethods(svgImage);
		attachGeometryMethods(svgImage);
		attachViewBoxMethods(svgImage);
	};

	const Names = {
		begin: "onMouseDown",
		enter: "onMouseEnter",
		leave: "onMouseLeave",
		move: "onMouseMove",
		end: "onMouseUp",
		scroll: "onScroll",
	};
	const Pointer = function(node) {
		let _node = node;
		let _pointer = Object.create(null);
		Object.assign(_pointer, {
			isPressed: false,
			position: [0,0],
			pressed: [0,0],
			drag: [0,0],
			prev: [0,0],
			x: 0,
			y: 0
		});
		const getPointer = function() {
			let m = _pointer.position.slice();
			Object.keys(_pointer)
				.filter(key => typeof key === "object")
				.forEach(key => m[key] = _pointer[key].slice());
			Object.keys(_pointer)
				.filter(key => typeof key !== "object")
				.forEach(key => m[key] = _pointer[key]);
			return Object.freeze(m);
		};
		const setPosition = function(clientX, clientY) {
			_pointer.position = convertToViewBox(_node, clientX, clientY);
			_pointer.x = _pointer.position[0];
			_pointer.y = _pointer.position[1];
		};
		const didRelease = function(clientX, clientY) {
			_pointer.isPressed = false;
		};
		const didPress = function(clientX, clientY) {
			_pointer.isPressed = true;
			_pointer.pressed = convertToViewBox(_node, clientX, clientY);
			setPosition(clientX, clientY);
		};
		const didMove = function(clientX, clientY) {
			_pointer.prev = _pointer.position;
			setPosition(clientX, clientY);
			if (_pointer.isPressed) {
				updateDrag();
			}
		};
		const updateDrag = function() {
			_pointer.drag = [_pointer.position[0] - _pointer.pressed[0],
			               _pointer.position[1] - _pointer.pressed[1]];
			_pointer.drag.x = _pointer.drag[0];
			_pointer.drag.y = _pointer.drag[1];
		};
		let _this = {};
		Object.defineProperty(_this, "getPointer", {value: getPointer});
		Object.defineProperty(_this, "didMove", {value: didMove});
		Object.defineProperty(_this, "didPress", {value: didPress});
		Object.defineProperty(_this, "didRelease", {value: didRelease});
		Object.defineProperty(_this, "node", {set: function(n){ _node = n; }});
		return _this;
	};
	function Events(node) {
		let _node;
		let _pointer = Pointer(node);
		let _events = {};
		const fireEvents = function(event, events) {
			if (events == null) { return; }
			if (events.length > 0) {
				event.preventDefault();
			}
			let mouse = _pointer.getPointer();
			events.forEach(f => f(mouse));
		};
		const mouseMoveHandler = function(event) {
			let events = _events[Names.move];
			_pointer.didMove(event.clientX, event.clientY);
			fireEvents(event, events);
		};
		const mouseDownHandler = function(event) {
			let events = _events[Names.begin];
			_pointer.didPress(event.clientX, event.clientY);
			fireEvents(event, events);
		};
		const mouseUpHandler = function(event) {
			mouseMoveHandler(event);
			let events = _events[Names.end];
			_pointer.didRelease(event.clientX, event.clientY);
			fireEvents(event, events);
		};
		const mouseLeaveHandler = function(event) {
			let events = _events[Names.leave];
			_pointer.didMove(event.clientX, event.clientY);
			fireEvents(event, events);
		};
		const mouseEnterHandler = function(event) {
			let events = _events[Names.enter];
			_pointer.didMove(event.clientX, event.clientY);
			fireEvents(event, events);
		};
		const touchStartHandler = function(event) {
			let events = _events[Names.begin];
			let touch = event.touches[0];
			if (touch == null) { return; }
			_pointer.didPress(touch.clientX, touch.clientY);
			fireEvents(event, events);
		};
		const touchEndHandler = function(event) {
			let events = _events[Names.end];
			_pointer.didRelease();
			fireEvents(event, events);
		};
		const touchMoveHandler = function(event) {
			let events = _events[Names.move];
			let touch = event.touches[0];
			if (touch == null) { return; }
			_pointer.didMove(touch.clientX, touch.clientY);
			fireEvents(event, events);
		};
		const scrollHandler = function(event) {
			let events = _events[Names.scroll];
			let e = {
				deltaX: event.deltaX,
				deltaY: event.deltaY,
				deltaZ: event.deltaZ,
			};
			e.position = convertToViewBox(_node, event.clientX, event.clientY);
			e.x = e.position[0];
			e.y = e.position[1];
			if (events == null) { return; }
			if (events.length > 0) {
				event.preventDefault();
			}
			events.forEach(f => f(e));
		};
		let _animate, _intervalID, _animationFrame;
		const updateAnimationHandler = function(handler) {
			if (_animate != null) {
				clearInterval(_intervalID);
			}
			_animate = handler;
			if (_animate != null) {
				_animationFrame = 0;
				_intervalID = setInterval(() => {
					let animObj = {
						"time": _node.getCurrentTime(),
						"frame": _animationFrame++
					};
					_animate(animObj);
				}, 1000/60);
			}
		};
		const handlers = {
			mouseup: mouseUpHandler,
			mousedown: mouseDownHandler,
			mousemove: mouseMoveHandler,
			mouseleave: mouseLeaveHandler,
			mouseenter: mouseEnterHandler,
			touchend: touchEndHandler,
			touchmove: touchMoveHandler,
			touchstart: touchStartHandler,
			touchcancel: touchEndHandler,
			wheel: scrollHandler,
		};
		const addEventListener = function(eventName, func) {
			if (typeof func !== "function") {
				throw "must supply a function type to addEventListener";
			}
			if (_events[eventName] === undefined) {
				_events[eventName] = [];
			}
			_events[eventName].push(func);
		};
		const attachHandlers = function(element) {
			Object.keys(handlers).forEach(key =>
				element.addEventListener(key, handlers[key], false)
			);
			updateAnimationHandler(_animate);
		};
		const removeHandlers = function(element) {
			Object.keys(handlers).forEach(key =>
				element.removeEventListener(key, handlers[key], false)
			);
			if (_animate != null) {
				clearInterval(_intervalID);
			}
		};
		const setup = function(node) {
			if (_node != null) {
				removeHandlers(_node);
			}
			_node = node;
			_pointer.node = _node;
			Object.keys(Names).map(key => Names[key]).forEach(key => {
				Object.defineProperty(_node, key, {
					set: function(handler) { addEventListener(key, handler); }
				});
			});
			Object.defineProperty(_node, "animate", {
				set: function(handler) { updateAnimationHandler(handler); }
			});
			Object.defineProperty(_node, "mouse", {get: function(){ return _pointer.getPointer(); }});
			Object.defineProperty(_node, "pointer", {get: function(){ return _pointer.getPointer(); }});
			attachHandlers(_node);
		};
		setup(node);
		return {
			setup,
			remove: function() { removeHandlers(_node); }
		};
	}

	function image() {
		let _svg = svg();
		let params = Array.from(arguments);
		initSize(_svg, params);
		attachSVGMethods(_svg);
		_svg.events = Events(_svg);
		const setup = function() {
			initSize(_svg, params);
			getElement(params).appendChild(_svg);
			params.filter((arg) => typeof arg === "function")
				.forEach((func) => func());
		};
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', setup);
		} else {
			setup();
		}
		return _svg;
	}const getElement = function(params) {
		let element = params.filter((arg) =>
				arg instanceof HTMLElement
			).shift();
		let idElement = params.filter((a) =>
				typeof a === "string" || a instanceof String)
			.map(str => document.getElementById(str))
			.shift();
		return (element != null
			? element
			: (idElement != null
				? idElement
				: document.body));
	};
	const initSize = function(svg$$1, params) {
		let numbers = params.filter((arg) => !isNaN(arg));
		if (numbers.length >= 2) {
			svg$$1.setAttributeNS(null, "width", numbers[0]);
			svg$$1.setAttributeNS(null, "height", numbers[1]);
			setViewBox(svg$$1, 0, 0, numbers[0], numbers[1]);
		}
		else if (svg$$1.getAttribute("viewBox") == null) {
			let rect$$1 = svg$$1.getBoundingClientRect();
			setViewBox(svg$$1, 0, 0, rect$$1.width, rect$$1.height);
		}
	};
	const attachSVGMethods = function(element) {
		Object.defineProperty(element, "w", {
			get: function(){ return getWidth(element); },
			set: function(w){ element.setAttributeNS(null, "width", w); }
		});
		Object.defineProperty(element, "h", {
			get: function(){ return getHeight(element); },
			set: function(h){ element.setAttributeNS(null, "height", h); }
		});
		element.getWidth = function() { return getWidth(element); };
		element.getHeight = function() { return getHeight(element); };
		element.setWidth = function(w) { element.setAttributeNS(null, "width", w); };
		element.setHeight = function(h) { element.setAttributeNS(null, "height", h); };
		element.save = function(filename = "image.svg") {
			return save(element, filename);
		};
		element.load = function(data, callback) {
			load(data, function(newSVG, error) {
				let parent = element.parentNode;
				if (newSVG != null) {
					newSVG.events = element.events;
					setupSVG(newSVG);
					if (newSVG.events == null) { newSVG.events = Events(newSVG); }
					else { newSVG.events.setup(newSVG); }
					attachSVGMethods(newSVG);
					element.remove();
					element = newSVG;
				}
				if (parent != null) { parent.appendChild(element); }
				if (callback != null) { callback(element, error); }
			});
		};
	};

	const controlPoint = function(parent, options) {
		if (options == null) { options = {}; }
		if (options.radius == null) { options.radius = 1; }
		if (options.fill == null) { options.fill = "#000000"; }
		if (options.position == null) { options.position = [0,0]; }
		let c = circle(0, 0, options.radius);
		c.setAttribute("fill", options.fill);
		let _position = options.position.slice();
		let _selected = false;
		if (parent != null) {
			parent.appendChild(c);
		}
		const setPosition = function(x, y) {
			_position[0] = x;
			_position[1] = y;
			c.setAttribute("cx", x);
			c.setAttribute("cy", y);
		};
		const onMouseMove = function(mouse) {
			if (_selected) {
				let pos = _updatePosition(mouse);
				setPosition(pos[0], pos[1]);
			}
		};
		const onMouseUp = function() {
			_selected = false;
		};
		const distance = function(mouse) {
			return Math.sqrt(
				Math.pow(mouse[0] - _position[0], 2) +
				Math.pow(mouse[1] - _position[1], 2)
			);
		};
		let _updatePosition = function(input){ return input; };
		return {
			circle: c,
			set position(pos) {
				if (pos[0] != null) { setPosition(pos[0], pos[1]); }
				else if (pos.x != null) { setPosition(pos.x, pos.y); }
			},
			get position() { return [..._position]; },
			onMouseUp,
			onMouseMove,
			distance,
			set positionDidUpdate(method) { _updatePosition = method; },
			set selected(value) { _selected = true; }
		};
	};
	function controls(svgObject, number = 1, options) {
		if (options == null) { options = {}; }
		if (options.parent == null) { options.parent = svgObject; }
		if (options.radius == null) { options.radius = 1; }
		if (options.fill == null) { options.fill = "#000000"; }
		let _points = Array.from(Array(number)).map(_ => controlPoint(options.parent, options));
		let _selected = undefined;
		const mouseDownHandler = function(event) {
			event.preventDefault();
			let mouse = convertToViewBox(svgObject, event.clientX, event.clientY);
			if (!(_points.length > 0)) { return; }
			_selected = _points
				.map((p,i) => ({i:i, d:p.distance(mouse)}))
				.sort((a,b) => a.d - b.d)
				.shift()
				.i;
			_points[_selected].selected = true;
		};
		const mouseMoveHandler = function(event) {
			event.preventDefault();
			let mouse = convertToViewBox(svgObject, event.clientX, event.clientY);
			_points.forEach(p => p.onMouseMove(mouse));
		};
		const mouseUpHandler = function(event) {
			event.preventDefault();
			_points.forEach(p => p.onMouseUp());
			_selected = undefined;
		};
		const touchDownHandler = function(event) {
			event.preventDefault();
			let touch = event.touches[0];
			if (touch == null) { return; }
			let pointer = convertToViewBox(svgObject, touch.clientX, touch.clientY);
			if (!(_points.length > 0)) { return; }
			_selected = _points
				.map((p,i) => ({i:i, d:p.distance(pointer)}))
				.sort((a,b) => a.d - b.d)
				.shift()
				.i;
			_points[_selected].selected = true;
		};
		const touchMoveHandler = function(event) {
			event.preventDefault();
			let touch = event.touches[0];
			if (touch == null) { return; }
			let pointer = convertToViewBox(svgObject, touch.clientX, touch.clientY);
			_points.forEach(p => p.onMouseMove(pointer));
		};
		const touchUpHandler = function(event) {
			event.preventDefault();
			_points.forEach(p => p.onMouseUp());
			_selected = undefined;
		};
		svgObject.addEventListener("touchstart", touchDownHandler, false);
		svgObject.addEventListener("touchend", touchUpHandler, false);
		svgObject.addEventListener("touchcancel", touchUpHandler, false);
		svgObject.addEventListener("touchmove", touchMoveHandler, false);
		svgObject.addEventListener("mousedown", mouseDownHandler, false);
		svgObject.addEventListener("mouseup", mouseUpHandler, false);
		svgObject.addEventListener("mousemove", mouseMoveHandler, false);
		Object.defineProperty(_points, "selectedIndex", {get: function() { return _selected; }});
		Object.defineProperty(_points, "selected", {get: function() { return _points[_selected]; }});
		Object.defineProperty(_points, "removeAll", {value: function() {
			_points.forEach(tp => tp.remove());
		}});
		return _points;
	}

	var svg$1 = /*#__PURE__*/Object.freeze({
		svg: svg,
		line: line$1,
		circle: circle,
		ellipse: ellipse,
		rect: rect,
		polygon: polygon,
		polyline: polyline,
		bezier: bezier,
		text: text,
		wedge: wedge,
		arc: arc,
		group: group,
		regularPolygon: regularPolygon,
		setPoints: setPoints,
		setArc: setArc,
		setViewBox: setViewBox,
		getViewBox: getViewBox,
		scaleViewBox: scaleViewBox,
		translateViewBox: translateViewBox,
		convertToViewBox: convertToViewBox,
		removeChildren: removeChildren,
		save: save,
		load: load,
		image: image,
		controls: controls
	});

	/*
	 * A speed-improved perlin and simplex noise algorithms for 2D.
	 *
	 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
	 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
	 * Better rank ordering method by Stefan Gustavson in 2012.
	 * Converted to Javascript by Joseph Gentle.
	 *
	 * Version 2012-03-09
	 *
	 * This code was placed in the public domain by its original author,
	 * Stefan Gustavson. You may use it as you see fit, but
	 * attribution is appreciated.
	 *
	 */

	function Grad(x, y, z) {
	  this.x = x; this.y = y; this.z = z;
	}

	Grad.prototype.dot2 = function(x, y) {
	  return this.x*x + this.y*y;
	};

	Grad.prototype.dot3 = function(x, y, z) {
	  return this.x*x + this.y*y + this.z*z;
	};

	var grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
	             new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
	             new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];

	var p = [151,160,137,91,90,15,
	131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
	190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
	88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
	77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
	102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
	135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
	5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
	223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
	129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
	251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
	49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
	138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
	// To remove the need for index wrapping, double the permutation table length
	var perm = new Array(512);
	var gradP = new Array(512);

	// This isn't a very good seeding function, but it works ok. It supports 2^16
	// different seed values. Write something better if you need more seeds.
	function seed(seed) {
	  if(seed > 0 && seed < 1) {
	    // Scale the seed out
	    seed *= 65536;
	  }

	  seed = Math.floor(seed);
	  if(seed < 256) {
	    seed |= seed << 8;
	  }

	  for(var i = 0; i < 256; i++) {
	    var v;
	    if (i & 1) {
	      v = p[i] ^ (seed & 255);
	    } else {
	      v = p[i] ^ ((seed>>8) & 255);
	    }

	    perm[i] = perm[i + 256] = v;
	    gradP[i] = gradP[i + 256] = grad3[v % 12];
	  }
	}
	seed(0);

	/*
	for(var i=0; i<256; i++) {
	  perm[i] = perm[i + 256] = p[i];
	  gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
	}*/

	// Skewing and unskewing factors for 2, 3, and 4 dimensions
	var F2 = 0.5*(Math.sqrt(3)-1);
	var G2 = (3-Math.sqrt(3))/6;

	var F3 = 1/3;
	var G3 = 1/6;

	// 2D simplex noise
	function simplex2(xin, yin) {
	  var n0, n1, n2; // Noise contributions from the three corners
	  // Skew the input space to determine which simplex cell we're in
	  var s = (xin+yin)*F2; // Hairy factor for 2D
	  var i = Math.floor(xin+s);
	  var j = Math.floor(yin+s);
	  var t = (i+j)*G2;
	  var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
	  var y0 = yin-j+t;
	  // For the 2D case, the simplex shape is an equilateral triangle.
	  // Determine which simplex we are in.
	  var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
	  if(x0>y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
	    i1=1; j1=0;
	  } else {    // upper triangle, YX order: (0,0)->(0,1)->(1,1)
	    i1=0; j1=1;
	  }
	  // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
	  // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
	  // c = (3-sqrt(3))/6
	  var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
	  var y1 = y0 - j1 + G2;
	  var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
	  var y2 = y0 - 1 + 2 * G2;
	  // Work out the hashed gradient indices of the three simplex corners
	  i &= 255;
	  j &= 255;
	  var gi0 = gradP[i+perm[j]];
	  var gi1 = gradP[i+i1+perm[j+j1]];
	  var gi2 = gradP[i+1+perm[j+1]];
	  // Calculate the contribution from the three corners
	  var t0 = 0.5 - x0*x0-y0*y0;
	  if(t0<0) {
	    n0 = 0;
	  } else {
	    t0 *= t0;
	    n0 = t0 * t0 * gi0.dot2(x0, y0);  // (x,y) of grad3 used for 2D gradient
	  }
	  var t1 = 0.5 - x1*x1-y1*y1;
	  if(t1<0) {
	    n1 = 0;
	  } else {
	    t1 *= t1;
	    n1 = t1 * t1 * gi1.dot2(x1, y1);
	  }
	  var t2 = 0.5 - x2*x2-y2*y2;
	  if(t2<0) {
	    n2 = 0;
	  } else {
	    t2 *= t2;
	    n2 = t2 * t2 * gi2.dot2(x2, y2);
	  }
	  // Add contributions from each corner to get the final noise value.
	  // The result is scaled to return values in the interval [-1,1].
	  return 70 * (n0 + n1 + n2);
	}
	// 3D simplex noise
	function simplex3(xin, yin, zin) {
	  var n0, n1, n2, n3; // Noise contributions from the four corners

	  // Skew the input space to determine which simplex cell we're in
	  var s = (xin+yin+zin)*F3; // Hairy factor for 2D
	  var i = Math.floor(xin+s);
	  var j = Math.floor(yin+s);
	  var k = Math.floor(zin+s);

	  var t = (i+j+k)*G3;
	  var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
	  var y0 = yin-j+t;
	  var z0 = zin-k+t;

	  // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
	  // Determine which simplex we are in.
	  var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
	  var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
	  if(x0 >= y0) {
	    if(y0 >= z0)      { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
	    else if(x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
	    else              { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
	  } else {
	    if(y0 < z0)      { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
	    else if(x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
	    else             { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
	  }
	  // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
	  // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
	  // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
	  // c = 1/6.
	  var x1 = x0 - i1 + G3; // Offsets for second corner
	  var y1 = y0 - j1 + G3;
	  var z1 = z0 - k1 + G3;

	  var x2 = x0 - i2 + 2 * G3; // Offsets for third corner
	  var y2 = y0 - j2 + 2 * G3;
	  var z2 = z0 - k2 + 2 * G3;

	  var x3 = x0 - 1 + 3 * G3; // Offsets for fourth corner
	  var y3 = y0 - 1 + 3 * G3;
	  var z3 = z0 - 1 + 3 * G3;

	  // Work out the hashed gradient indices of the four simplex corners
	  i &= 255;
	  j &= 255;
	  k &= 255;
	  var gi0 = gradP[i+   perm[j+   perm[k   ]]];
	  var gi1 = gradP[i+i1+perm[j+j1+perm[k+k1]]];
	  var gi2 = gradP[i+i2+perm[j+j2+perm[k+k2]]];
	  var gi3 = gradP[i+ 1+perm[j+ 1+perm[k+ 1]]];

	  // Calculate the contribution from the four corners
	  var t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
	  if(t0<0) {
	    n0 = 0;
	  } else {
	    t0 *= t0;
	    n0 = t0 * t0 * gi0.dot3(x0, y0, z0);  // (x,y) of grad3 used for 2D gradient
	  }
	  var t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
	  if(t1<0) {
	    n1 = 0;
	  } else {
	    t1 *= t1;
	    n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
	  }
	  var t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
	  if(t2<0) {
	    n2 = 0;
	  } else {
	    t2 *= t2;
	    n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
	  }
	  var t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
	  if(t3<0) {
	    n3 = 0;
	  } else {
	    t3 *= t3;
	    n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
	  }
	  // Add contributions from each corner to get the final noise value.
	  // The result is scaled to return values in the interval [-1,1].
	  return 32 * (n0 + n1 + n2 + n3);

	}
	// ##### Perlin noise stuff

	function fade(t) {
	  return t*t*t*(t*(t*6-15)+10);
	}

	function lerp(a, b, t) {
	  return (1-t)*a + t*b;
	}

	// 2D Perlin Noise
	function perlin2(x, y) {
	  // Find unit grid cell containing point
	  var X = Math.floor(x), Y = Math.floor(y);
	  // Get relative xy coordinates of point within that cell
	  x = x - X; y = y - Y;
	  // Wrap the integer cells at 255 (smaller integer period can be introduced here)
	  X = X & 255; Y = Y & 255;

	  // Calculate noise contributions from each of the four corners
	  var n00 = gradP[X+perm[Y]].dot2(x, y);
	  var n01 = gradP[X+perm[Y+1]].dot2(x, y-1);
	  var n10 = gradP[X+1+perm[Y]].dot2(x-1, y);
	  var n11 = gradP[X+1+perm[Y+1]].dot2(x-1, y-1);

	  // Compute the fade curve value for x
	  var u = fade(x);

	  // Interpolate the four results
	  return lerp(
	      lerp(n00, n10, u),
	      lerp(n01, n11, u),
	     fade(y));
	}
	// 3D Perlin Noise
	function perlin3(x, y, z) {
	  // Find unit grid cell containing point
	  var X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
	  // Get relative xyz coordinates of point within that cell
	  x = x - X; y = y - Y; z = z - Z;
	  // Wrap the integer cells at 255 (smaller integer period can be introduced here)
	  X = X & 255; Y = Y & 255; Z = Z & 255;

	  // Calculate noise contributions from each of the eight corners
	  var n000 = gradP[X+  perm[Y+  perm[Z  ]]].dot3(x,   y,     z);
	  var n001 = gradP[X+  perm[Y+  perm[Z+1]]].dot3(x,   y,   z-1);
	  var n010 = gradP[X+  perm[Y+1+perm[Z  ]]].dot3(x,   y-1,   z);
	  var n011 = gradP[X+  perm[Y+1+perm[Z+1]]].dot3(x,   y-1, z-1);
	  var n100 = gradP[X+1+perm[Y+  perm[Z  ]]].dot3(x-1,   y,   z);
	  var n101 = gradP[X+1+perm[Y+  perm[Z+1]]].dot3(x-1,   y, z-1);
	  var n110 = gradP[X+1+perm[Y+1+perm[Z  ]]].dot3(x-1, y-1,   z);
	  var n111 = gradP[X+1+perm[Y+1+perm[Z+1]]].dot3(x-1, y-1, z-1);

	  // Compute the fade curve value for x, y, z
	  var u = fade(x);
	  var v = fade(y);
	  var w = fade(z);

	  // Interpolate
	  return lerp(
	      lerp(
	        lerp(n000, n100, u),
	        lerp(n001, n101, u), w),
	      lerp(
	        lerp(n010, n110, u),
	        lerp(n011, n111, u), w),
	     v);
	}

	var perlin = /*#__PURE__*/Object.freeze({
		seed: seed,
		simplex2: simplex2,
		simplex3: simplex3,
		perlin2: perlin2,
		perlin3: perlin3
	});

	// graph manipulators for .FOLD file github.com/edemaine/fold
	// MIT open source license, Robby Kraft

	// keys in the .FOLD version 1.1
	const keys = {
		meta: [
			"file_spec",
			"file_creator",
			"file_author",
			"file_classes",
			"frame_title",
			"frame_attributes",
			"frame_classes"
		],
		graph: [
			"vertices_coords",
			"vertices_vertices",
			"vertices_faces",
			"edges_vertices",
			"edges_faces",
			"edges_assignment",
			"edges_foldAngle",
			"edges_length",
			"faces_vertices",
			"faces_edges"
		],
		orders: [
			"edgeOrders",
			"faceOrders"
		]
	};

	const all_keys = ["file_frames"]
		.concat(keys.meta)
		.concat(keys.graph)
		.concat(keys.orders);

	const new_vertex = function(graph, x, y) {
		if (graph.vertices_coords == null) { graph.vertices_coords = []; }
		graph.vertices_coords.push([x,y]);
		let new_index = graph.vertices_coords.length-1;
		// // mark unclean data
		// unclean.vertices_vertices[new_index] = true;
		// unclean.vertices_faces[new_index] = true;
		return new_index;
	};

	const new_edge = function(graph, node1, node2) {
		if (_m.edges_vertices == null) { graph.edges_vertices = []; }
		graph.edges_vertices.push([node1, node2]);
		let new_index = graph.edges_vertices.length-1;
		// // mark unclean data
		// unclean.edges_vertices[new_index] = true;
		// unclean.edges_faces[new_index] = true;
		// unclean.edges_assignment[new_index] = true;
		// unclean.edges_foldAngle[new_index] = true;
		// unclean.edges_length[new_index] = true;
		return new_index;
	};

	/**
	 * this removes all edges except for "B", boundary creases.
	 * rebuilds the face, and 
	 * todo: removes a collinear vertex and merges the 2 boundary edges
	 */
	const remove_non_boundary_edges = function(graph) {
		let remove_indices = graph.edges_assignment
			.map(a => !(a === "b" || a === "B"))
			.map((a,i) => a ? i : null)
			.filter(a => a != null);
		let edge_map = remove_edges(graph, remove_indices);
		let face = get_boundary_face(graph);
		graph.faces_edges = [face.edges];
		graph.faces_vertices = [face.vertices];
		remove_isolated_vertices(graph);
	};

	const remove_isolated_vertices = function(graph) {
		let isolated = graph.vertices_coords.map(_ => true);
		graph.edges_vertices.forEach(edge => edge.forEach(v => isolated[v] = false));
		let vertices = isolated.map((el,i) => el ? i : null)
			.filter(el => el !== null);
		if (vertices.length === 0) { return []; }
		return remove_vertices(graph, vertices);
	};

	const remove_collinear_vertices = function(graph) {
		
	};

	/* Get the number of vertices in the graph
	 * in the case of abstract graphs, vertex count needs to be searched
	 *
	 * @returns {number} number of vertices
	 */
	const vertices_count = function(graph) {
		return Math.max(...(
			[[], graph.vertices_coords, graph.vertices_faces, graph.vertices_vertices]
			.filter(el => el != null)
			.map(el => el.length)
		));
	};
	/* Get the number of edges in the graph as all edge definitions are optional
	 *
	 * @returns {number} number of edges
	 */
	const edges_count = function(graph) {
		return Math.max(...(
			[[], graph.edges_vertices, graph.edges_faces]
			.filter(el => el != null)
			.map(el => el.length)
		));
	};
	/* Get the number of faces in the graph
	 * in some cases face arrays might not be defined
	 *
	 * @returns {number} number of faces
	 */
	const faces_count = function(graph) {
		return Math.max(...(
			[[], graph.faces_vertices, graph.faces_edges]
			.filter(el => el != null)
			.map(el => el.length)
		));
	};

	///////////////////////////////////////////////
	// MAKERS
	///////////////////////////////////////////////

	// faces_faces is a set of faces edge-adjacent to a face.
	// for every face.
	const make_faces_faces = function(graph) {
		let nf = graph.faces_vertices.length;
		let faces_faces = Array.from(Array(nf)).map(() => []);
		let edgeMap = {};
		graph.faces_vertices.forEach((vertices_index, idx1) => {
			if (vertices_index === undefined) { return; }  //todo: why is this here?
			let n = vertices_index.length;
			vertices_index.forEach((v1, i, vs) => {
				let v2 = vs[(i + 1) % n];
				if (v2 < v1) [v1, v2] = [v2, v1];
				let key = v1 + " " + v2;
				if (key in edgeMap) {
					let idx2 = edgeMap[key];
					faces_faces[idx1].push(idx2);
					faces_faces[idx2].push(idx1);
				} else {
					edgeMap[key] = idx1;
				}
			}); 
		});
		return faces_faces;
	};

	/**
	 * true/false: which face shares color with root face
	 * the root face (and any similar-color face) will be marked as true
	 */
	const faces_coloring = function(graph, root_face = 0){
		let coloring = [];
		coloring[root_face] = true;
		make_face_walk_tree(graph, root_face).forEach((level, i) => 
			level.forEach((entry) => coloring[entry.face] = (i % 2 === 0))
		);
		return coloring;
	};

	// root_face will become the root node
	const make_face_walk_tree = function(graph, root_face = 0){
		let new_faces_faces = make_faces_faces(graph);
		var visited = [root_face];
		var list = [[{ face: root_face, parent: undefined, edge: undefined, level: 0 }]];
		// let current_level = 0;
		do{
			// current_level += 1;
			list[list.length] = list[list.length-1].map((current) =>{
				let unique_faces = new_faces_faces[current.face]
					.filter(f => visited.indexOf(f) === -1);
				visited = visited.concat(unique_faces);
				return unique_faces.map(f => ({
					face: f,
					parent: current.face,
					// level: current_level,
					edge: graph.faces_vertices[f]
						.filter(v => graph.faces_vertices[current.face].indexOf(v) !== -1)
						.sort((a,b) => a-b)
				}))
			}).reduce((prev,curr) => prev.concat(curr),[]);
		} while(list[list.length-1].length > 0);
		if(list.length > 0 && list[list.length-1].length == 0){ list.pop(); }
		return list;
	};

	/**
	 * appends a vertex along an edge. causing a rebuild on all arrays
	 * including edges and faces.
	 * requires edges_vertices to be defined
	 */
	const add_vertex_on_edge = function(graph, x, y, old_edge_index) {
		if (graph.edges_vertices.length < old_edge_index) { return; }
		// new vertex entries
		// vertices_coords
		let new_vertex_index = new_vertex(graph, x, y);
		let incident_vertices = graph.edges_vertices[old_edge_index];
		// vertices_vertices, new vertex
		if (graph.vertices_vertices == null) { graph.vertices_vertices = []; }
		graph.vertices_vertices[new_vertex_index] = JSON.parse(JSON.stringify(incident_vertices));
		// vertices_vertices, update incident vertices with new vertex
		incident_vertices.forEach((v,i,arr) => {
			let otherV = arr[(i+1)%arr.length];
			let otherI = graph.vertices_vertices[v].indexOf(otherV);
			graph.vertices_vertices[v][otherI] = new_vertex_index;
		});
		// vertices_faces
		if (graph.edges_faces != null && graph.edges_faces[old_edge_index] != null) {
			graph.vertices_faces[new_vertex_index] = JSON.parse(JSON.stringify(graph.edges_faces[old_edge_index]));
		}
		// new edges entries
		// set edges_vertices
		let new_edges = [
			{ edges_vertices: [incident_vertices[0], new_vertex_index] },
			{ edges_vertices: [new_vertex_index, incident_vertices[1]] }
		];
		// set new index in edges_ arrays
		new_edges.forEach((e,i) => e.i = graph.edges_vertices.length+i);
		// copy over relevant data if it exists
		["edges_faces", "edges_assignment", "edges_foldAngle"]
			.filter(key => graph[key] != null && graph[key][old_edge_index] != null)
			.forEach(key => {
				// todo, copy these arrays
				new_edges[0][key] = JSON.parse(JSON.stringify(graph[key][old_edge_index]));
				new_edges[1][key] = JSON.parse(JSON.stringify(graph[key][old_edge_index]));
			});
		// calculate length
		const distance2 = function(a,b){
			return Math.sqrt(Math.pow(b[0]-a[0],2) + Math.pow(b[1]-a[1],2));
		};
		new_edges.forEach((el,i) => {
			let verts = el.edges_vertices.map(v => graph.vertices_coords[v]);
			new_edges[i]["edges_length"] = distance2(...verts);
		});
		// todo: copy over edgeOrders. don't need to do this with faceOrders
		new_edges.forEach((edge,i) =>
			Object.keys(edge)
				.filter(key => key !== "i")
				.forEach(key => graph[key][edge.i] = edge[key])
		);
		let incident_faces_indices = graph.edges_faces[old_edge_index];
		let incident_faces_vertices = incident_faces_indices.map(i => graph.faces_vertices[i]);
		let incident_faces_edges = incident_faces_indices.map(i => graph.faces_edges[i]);

		// faces_vertices
		// because Javascript, this is a pointer and modifies the master graph
		incident_faces_vertices.forEach(face => 
			face.map((fv,i,arr) => {
				let nextI = (i+1)%arr.length;
				return (fv === incident_vertices[0] && arr[nextI] === incident_vertices[1]) ||
				       (fv === incident_vertices[1] && arr[nextI] === incident_vertices[0])
					? nextI : undefined;
			}).filter(el => el !== undefined)
			.sort((a,b) => b-a)
			.forEach(i => face.splice(i,0,new_vertex_index))
		);

		// faces_edges
		incident_faces_edges.forEach((face,i,arr) => {
			// there should be 2 faces in this array, incident to the removed edge
			// find the location of the removed edge in this face
			let edgeIndex = face.indexOf(old_edge_index);
			// the previous and next edge in this face, counter-clockwise
			let prevEdge = face[(edgeIndex+face.length-1)%face.length];
			let nextEdge = face[(edgeIndex+1)%face.length];
			let vertices = [
				[prevEdge, old_edge_index],
				[old_edge_index, nextEdge]
			].map(pairs => {
				let verts = pairs.map(e => graph.edges_vertices[e]);
				return verts[0][0] === verts[1][0] || verts[0][0] === verts[1][1]
					? verts[0][0] : verts[0][1]; 
			}).reduce((a,b) => a.concat(b),[]);
			let edges = [
				[vertices[0], new_vertex_index],
				[new_vertex_index, vertices[1]]
			].map(verts => {
				let in0 = verts.map(v => new_edges[0].edges_vertices.indexOf(v) !== -1)
					.reduce((a,b) => a && b, true);
				let in1 = verts.map(v => new_edges[1].edges_vertices.indexOf(v) !== -1)
					.reduce((a,b) => a && b, true);
				if(in0) { return new_edges[0].i; }
				if(in1) { return new_edges[1].i; }
				throw "something wrong with input graph's faces_edges construction";
			});
			if (edgeIndex === face.length-1) {
				// replacing the edge at the end of the array, we have to be careful
				// to put the first at the end, the second at the beginning
				face.splice(edgeIndex, 1, edges[0]);
				face.unshift(edges[1]);
			} else {
				face.splice(edgeIndex, 1, ...edges);
			}
			return edges;
		});
		// remove old data
		let edge_map = remove_edges(graph, [old_edge_index]);
		return {
			vertices: {
				new: [{index: new_vertex_index}]
			},
			edges: {
				map: edge_map,
				replace: [{
					old: old_edge_index,
					new: new_edges.map(el => el.i)
				}]
			}
		};
	};

	const get_boundary_face = function(graph) {
		let edges_vertices_b = graph.edges_assignment
			.map(a => a === "B" || a === "b");
		let vertices_edges = graph.vertices_coords.map(_ => []);
		graph.edges_vertices.forEach((ev,i) =>
			ev.forEach(v => vertices_edges[v].push(i))
		);
		let edge_walk = [];
		let vertex_walk = [];
		let edgeIndex = -1;
		for (let i = 0; i < edges_vertices_b.length; i++) {
			if (edges_vertices_b[i]) { edgeIndex = i; break; }
		}
		edges_vertices_b[edgeIndex] = false;
		edge_walk.push(edgeIndex);
		vertex_walk.push(graph.edges_vertices[edgeIndex][0]);
		let nextVertex = graph.edges_vertices[edgeIndex][1];
		while (vertex_walk[0] !== nextVertex) {
			vertex_walk.push(nextVertex);
			edgeIndex = vertices_edges[nextVertex]
				.filter(v => edges_vertices_b[v])
				.shift();
			if (graph.edges_vertices[edgeIndex][0] === nextVertex) {
				nextVertex = graph.edges_vertices[edgeIndex][1];
			} else {
				nextVertex = graph.edges_vertices[edgeIndex][0];
			}
			edges_vertices_b[edgeIndex] = false;
			edge_walk.push(edgeIndex);
		}
		return {
			vertices: vertex_walk,
			edges: edge_walk,
		};
	};

	const get_boundary_vertices = function(graph) {
		let edges_vertices_b = graph.edges_vertices.filter((ev,i) =>
			graph.edges_assignment[i] == "B" ||
			graph.edges_assignment[i] == "b"
		).map(arr => arr.slice());
		if (edges_vertices_b.length === 0) { return []; }
		// the index of keys[i] is an edge_vertex from edges_vertices_b
		//  the [] value is the indices in edges_vertices_b this i appears
		let keys = Array.from(Array(graph.vertices_coords.length)).map(_ => []);
		edges_vertices_b.forEach((ev,i) => ev.forEach(e => keys[e].push(i)));
		let edgeIndex = 0;
		let startVertex = edges_vertices_b[edgeIndex].shift();
		let nextVertex = edges_vertices_b[edgeIndex].shift();
		let vertices = [startVertex];
		while (vertices[0] !== nextVertex) {
			vertices.push(nextVertex);
			let whichEdges = keys[nextVertex];
			let thisKeyIndex = keys[nextVertex].indexOf(edgeIndex);
			if (thisKeyIndex === -1) { return; }
			keys[nextVertex].splice(thisKeyIndex, 1);
			let nextEdgeAndIndex = keys[nextVertex]
				.map((el,i) => ({key: el, i: i}))
				.filter(el => el.key !== edgeIndex).shift();
			if (nextEdgeAndIndex == null) { return; }
			keys[nextVertex].splice(nextEdgeAndIndex.i, 1);
			edgeIndex = nextEdgeAndIndex.key;
			let lastEdgeIndex = edges_vertices_b[edgeIndex].indexOf(nextVertex);
			if (lastEdgeIndex === -1) { return; }
			edges_vertices_b[edgeIndex].splice(lastEdgeIndex, 1);
			nextVertex = edges_vertices_b[edgeIndex].shift();
		}
		return vertices;
	};




	/** Convert this graph into an array of connected graphs, attempting one Hamilton path if possible. Edges are arranged in each graph.edges with connected edges next to one another.
	 * @returns {Graph[]} 
	 */
	const connectedGraphs = function(graph) {
		return;
		var cp = JSON.parse(JSON.stringify(graph));
		cp.clean();
		cp.removeIsolatedNodes();
		// cache every node's adjacent edge #
		cp.nodes.forEach(function(node){ node.cache['adj'] = node.adjacentEdges().length; },this);
		var graphs = [];
		while (cp.edges.length > 0) {
			var graph = new Graph();
			// create a duplicate set of nodes in the new emptry graph, remove unused nodes at the end
			cp.nodes.forEach(function(node){graph.addNode(Object.assign(new cp.nodeType(graph),node));},this);
			// select the node with most adjacentEdges
			var node = cp.nodes.slice().sort(function(a,b){return b.cache['adj'] - a.cache['adj'];})[0];
			var adj = node.adjacentEdges();
			while (adj.length > 0) {
				// approach 1
				// var nextEdge = adj[0];
				// approach 2
				// var nextEdge = adj.sort(function(a,b){return b.otherNode(node).cache['adj'] - a.otherNode(node).cache['adj'];})[0];
				// approach 3, prioritize nodes with even number of adjacencies
				var smartList = adj.filter(function(el){return el.otherNode(node).cache['adj'] % 2 == 0;},this);
				if (smartList.length == 0){ smartList = adj; }
				var nextEdge = smartList.sort(function(a,b){return b.otherNode(node).cache['adj'] - a.otherNode(node).cache['adj'];})[0];
				var nextNode = nextEdge.otherNode(node);
				// create new edge on other graph with pointers to its nodes
				var newEdge = Object.assign(new cp.edgeType(graph,undefined,undefined), nextEdge);
				newEdge.nodes = [graph.nodes[node.index], graph.nodes[nextNode.index] ];
				graph.addEdge( newEdge );
				// update this graph with 
				node.cache['adj'] -= 1;
				nextNode.cache['adj'] -= 1;
				cp.edges = cp.edges.filter(function(el){ return el !== nextEdge; });
				// prepare loop for next iteration. increment objects
				node = nextNode;
				adj = node.adjacentEdges();
			}
			// remove unused nodes
			graph.removeIsolatedNodes();
			graphs.push(graph);
		}
		return graphs;
	};








	/** Removes vertices, updates all relevant array indices
	 *
	 * @param {vertices} an array of vertex indices
	 * @example remove_vertices(fold_file, [2,6,11,15]);
	 */
	function remove_vertices(graph, vertices){
		// length of index_map is length of the original vertices_coords
		let s = 0, removes = Array( vertices_count(graph) ).fill(false);
		vertices.forEach(v => removes[v] = true);
		let index_map = removes.map(remove => remove ? --s : s);

		if(vertices.length === 0){ return index_map; }

		// update every component that points to vertices_coords
		// these arrays do not change their size, only their contents
		if(graph.faces_vertices != null){
			graph.faces_vertices = graph.faces_vertices
				.map(entry => entry.map(v => v + index_map[v]));
		}
		if(graph.edges_vertices != null){
			graph.edges_vertices = graph.edges_vertices
				.map(entry => entry.map(v => v + index_map[v]));
		}
		if(graph.vertices_vertices != null){
			graph.vertices_vertices = graph.vertices_vertices
				.map(entry => entry.map(v => v + index_map[v]));
		}

		// update every array with a 1:1 relationship to vertices_ arrays
		// these arrays change their size, their contents are untouched
		if(graph.vertices_faces != null){
			graph.vertices_faces = graph.vertices_faces
				.filter((v,i) => !removes[i]);
		}
		if(graph.vertices_vertices != null){
			graph.vertices_vertices = graph.vertices_vertices
				.filter((v,i) => !removes[i]);
		}
		if(graph.vertices_coords != null){
			graph.vertices_coords = graph.vertices_coords
				.filter((v,i) => !removes[i]);
		}

		return index_map;
		// todo: do the same with frames in file_frames where inherit=true
	}

	/* This returns a 
	 * in some cases face arrays might not be defined
	 *
	 * @returns {number} number of faces
	 */
	const remove_edges = function(graph, edges) {
		// length of index_map is length of the original edges_vertices
		let s = 0, removes = Array( edges_count(graph) ).fill(false);
		edges.forEach(e => removes[e] = true);
		let index_map = removes.map(remove => remove ? --s : s);

		if(edges.length === 0){ return index_map; }

		// update every component that points to edges_vertices
		// these arrays do not change their size, only their contents
		if(graph.faces_edges != null){
			graph.faces_edges = graph.faces_edges
				.map(entry => entry.map(v => v + index_map[v]));
		}
		if(graph.edgeOrders != null){
			graph.edgeOrders = graph.edgeOrders
				.map(entry => entry.map((v,i) => {
					if(i === 2) return v;  // exception. orientation. not index.
					return v + index_map[v];
				}));
		}

		// update every array with a 1:1 relationship to edges_ arrays
		// keys like "edges_vertices", "edges_faces" and anything else "edges_..."
		// these arrays change their size, their contents are untouched
		Object.keys(graph)
			.filter(key => key.includes("edges_"))
			.forEach(key => graph[key] = graph[key].filter((e,i) => !removes[i]));

		return index_map;
		// todo: do the same with frames in file_frames where inherit=true
	};


	/**
	 * Removes faces, updates all relevant array indices
	 * @param {faces} an array of face indices
	 * @example remove_edges(fold_file, [1,9,11,13]);
	 */
	function remove_faces(graph, faces) {
		// length of index_map is length of the original faces_vertices
		let s = 0, removes = Array( faces_count(graph) ).fill(false);
		faces.forEach(e => removes[e] = true);
		let index_map = removes.map(remove => remove ? --s : s);

		if (faces.length === 0) { return index_map; }

		// update every component that points to faces_ arrays
		// these arrays do not change their size, only their contents
		if (graph.vertices_faces != null) {
			graph.vertices_faces = graph.vertices_faces
				.map(entry => entry.map(v => v + index_map[v]));
		}
		if (graph.edges_faces != null) {
			graph.edges_faces = graph.edges_faces
				.map(entry => entry.map(v => v + index_map[v]));
		}
		if (graph.faceOrders != null) {
			graph.faceOrders = graph.faceOrders
				.map(entry => entry.map((v,i) => {
					if(i === 2) return v;  // exception. orientation. not index.
					return v + index_map[v];
				}));
		}
		// update every array with a 1:1 relationship to faces_
		// keys like "faces_vertices", "faces_edges" and anything else "faces_..."
		// these arrays change their size, their contents are untouched
		Object.keys(graph)
			.filter(key => key.includes("faces_"))
			.forEach(key => graph[key] = graph[key].filter((e,i) => !removes[i]));

		return index_map;
		// todo: do the same with frames in file_frames where inherit=true
	}

	/**
	 * Replace all instances of removed vertices with "vertex".
	 * @param vertex number index of vertex to remain
	 * @param [removed] array of indices to be replaced
	 */
	function merge_vertices(graph, vertex, removed) {
		

	}

	function make_edges_faces(graph) {
		let edges_faces = Array
			.from(Array(graph.edges_vertices.length))
			.map(_ => []);
		// todo: does not arrange counter-clockwise
		graph.faces_edges.forEach((face,i) => face.forEach(edge => edges_faces[edge].push(i)));
		return edges_faces;
	}

	function make_vertices_faces(graph) {
		let vertices_faces = Array
			.from(Array(graph.faces_vertices.length))
			.map(_ => []);
		graph.faces_vertices.forEach((face,i) => face.forEach(vertex => vertices_faces[vertex].push(i)));
		return vertices_faces;
	}

	const bounding_rect = function(graph) {
		if (graph.vertices_coords.length <= 0) { return [0,0,0,0]; }
		let dimension = graph.vertices_coords[0].length;
		let smallest = Array.from(Array(dimension)).map(_ => Infinity);
		let largest = Array.from(Array(dimension)).map(_ => -Infinity);
		graph.vertices_coords.forEach(v => v.forEach((n,i) => {
			if (n < smallest[i]) { smallest[i] = n; }
			if (n > largest[i]) { largest[i] = n; }
		}));
		let x = smallest[0];
		let y = smallest[1];
		let w = largest[0] - smallest[0];
		let h = largest[1] - smallest[1];
		return (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)
			? [0,0,0,0]
			: [x,y,w,h]);
	};

	var graph = /*#__PURE__*/Object.freeze({
		keys: keys,
		all_keys: all_keys,
		new_vertex: new_vertex,
		new_edge: new_edge,
		remove_non_boundary_edges: remove_non_boundary_edges,
		remove_isolated_vertices: remove_isolated_vertices,
		remove_collinear_vertices: remove_collinear_vertices,
		vertices_count: vertices_count,
		edges_count: edges_count,
		faces_count: faces_count,
		make_faces_faces: make_faces_faces,
		faces_coloring: faces_coloring,
		make_face_walk_tree: make_face_walk_tree,
		add_vertex_on_edge: add_vertex_on_edge,
		get_boundary_face: get_boundary_face,
		get_boundary_vertices: get_boundary_vertices,
		connectedGraphs: connectedGraphs,
		remove_vertices: remove_vertices,
		remove_edges: remove_edges,
		remove_faces: remove_faces,
		merge_vertices: merge_vertices,
		make_edges_faces: make_edges_faces,
		make_vertices_faces: make_vertices_faces,
		bounding_rect: bounding_rect
	});

	const apply_diff_map = function(diff_map, array) {
		// an array whose value is the new index it will end up
		let index_map = diff_map.map((change,i) => i + change);
		// gather the removed element indices, remove them from index_map
		Array.from(Array(diff_map.length-1))
			.map((change, i) => diff_map[i] !== diff_map[(i+1)%diff_map.length])
			.map((remove, i) => remove ? i : undefined)
			.filter(a => a !== undefined)
			.forEach(i => delete index_map[i]);
		// fill the new array using index_map
		let new_array = [];
		index_map.forEach((newI, oldI) => new_array[newI] = array[oldI]);
		return new_array;
	};

	const merge_maps = function(a, b) {
		// "a" came first
		let aRemoves = [];
		for (let i = 1; i < a.length; i++) {
			if (a[i] !== a[i-1]) { aRemoves.push(i); }
		}
		for (let i = 1; i < b.length; i++) {
			if (b[i] !== b[i-1]) ;
		}
		let bCopy = b.slice();
		aRemoves.forEach(i => bCopy.splice(i, 0, (i === 0) ? 0 : bCopy[i-1] ));

		return a.map((v,i) => v + bCopy[i]);
	};

	// import {vertices_count, edges_count, faces_count} from "./graph";

	// this is going to be messy! as I think of an edge case to test I add it here.
	// the intention IS that this is slow. slow but thorough.
	// currently only enforcing graph combinatorics.
	// nothing like illegal planar graph edge crossings.. that will probably be its own validate.
	// currently testing for and requiring that every key in spec 1.1 be present.

	function validate(graph) {

		let foldKeys = {
			"vertices": ["coords", "vertices", "faces"],
			"edges": ["vertices", "faces", "assignment", "foldAngle", "length"],
			"faces": ["vertices", "edges"],
		};

		// check for nulls
		["vertices_coords", "vertices_vertices", "vertices_faces",
		"edges_vertices", "edges_faces",
		"faces_vertices", "faces_edges"].forEach(key => {
			if(graph[key].map(a=>a.filter(b=>b==null).length>0).reduce((a,b)=>a||b,false)){
				throw key + " contains a null";
			}
		});
		["edges_assignment", "edges_foldAngle", "edges_length"].forEach(key => {
			if(graph[key].filter(a=>a==null).length>0){
				throw key + " contains a null";
			}
		});

		// all arrays with similar prefixes should be of the same length
		let arraysLengthTest = Object.keys(foldKeys)
			.map(key => ({prefix: key, suffixes: foldKeys[key]}))
			.map(el => el.suffixes
				.map(suffix => el.prefix + "_" + suffix)
				.filter(key => graph[key] != null)
				.map((key,_,arr) => graph[key].length === graph[arr[0]].length)
				.reduce((a,b) => a && b, true)
			).reduce((a,b) => a && b, true);

		if (!arraysLengthTest) {
			throw "validate failed, geometry array-lengths don't match";
		}

		let l = {
			vertices: vertices_count(graph),
			edges: edges_count(graph),
			faces: faces_count(graph)
		};
		// geometry indices point to arrays longer than that index value
		let arraysIndexTest = Object.keys(foldKeys)
			.map(key => ({prefix: key, suffixes: foldKeys[key]}))
			.map(el => el.suffixes
				.map(suffix => ({key:el.prefix + "_" + suffix, suffix: suffix}))
				.filter(ell => graph[ell.key] != null && l[ell.suffix] != null)
				.map(ell => ({key:ell.key, test:graph[ell.key]
					.reduce((prev,curr) => curr
						.reduce((a,b) => a && (b < l[ell.suffix]), true)
					, true)})
				)
			).reduce((a,b) => a.concat(b), []);

		arraysIndexTest
			.filter(el => !el.test)
			.forEach(el => {
				console.log("ERROR");
				console.log(graph);
				throw el.key + " contains a index too large, larger than the reference array to which it points";
			});

		// iterate over every vertices_vertices, check that the pairing of vertices
		// exists somewhere in edges_vertices
		// this assumes that vertices_vertices implies the presence of edges_vertices
		let vv_edge_test = graph.vertices_vertices
			.map((vv,i) => vv.map(v2 => [i,v2]))
			.reduce((a,b) => a.concat(b), []);
		let ev_test_fails = vv_edge_test
			.map(ve => graph.edges_vertices.filter(e => 
					(ve[0] === e[0] && ve[1] === e[1]) || (ve[0] === e[1] && ve[1] === e[0])
				).length > 0)
			.map((b,i) => ({test: b, i:i}))
			.filter(el => !el.test);

		if (ev_test_fails.length > 0) {
			throw "vertices_vertices at index "+ev_test_fails[0].i+" declares an edge that doesn't exist in edges_vertices";
		}

		let v_f_test = graph.vertices_faces.map((vert,i) => 
			vert.map(vf => ({test: graph.faces_vertices[vf].indexOf(i) !== -1, face:vf, i:i}))
				.filter(el => !el.test)
		).reduce((a,b) => a.concat(b), []);

		if (v_f_test.length > 0) {
			throw "vertex "+v_f_test[0].i+" in vertices_faces connects to face "+v_f_test[0].face+", whereas in faces_vertices this same connection in reverse doesn't exist.";
		}
		let e_f_test = graph.edges_faces.map((edge,i) => 
			edge.map(ef => ({test: graph.faces_edges[ef].indexOf(i) !== -1, face:ef, i:i}))
				.filter(el => !el.test)
		).reduce((a,b) => a.concat(b), []);

		if (e_f_test.length > 0) {
			throw "edges_faces "+e_f_test[0].i+" connects to face "+e_f_test[0].face+", whereas in faces_edges this same connection in reverse doesn't exist.";
		}

		let f_v_test = graph.faces_vertices.map((face,i) => 
			face.map(vf => ({test: graph.vertices_faces[vf].indexOf(i) !== -1, face:vf, i:i}))
				.filter(el => !el.test)
		).reduce((a,b) => a.concat(b), []);

		return true;
	}

	const angle_from_assignment = function(assignment) {
		switch (assignment) {
			case "M":
			case "m":
				return -180;
			case "V":
			case "v":
				return 180;
			default:
				return 0;
		}
	};

	/**
	 * @returns index of nearest vertex in vertices_ arrays or
	 *  undefined if there are no vertices_coords
	 */
	const nearest_vertex = function(graph, point) {
		if (graph.vertices_coords == null || graph.vertices_coords.length === 0) {
			return undefined;
		}
		let p = [...point];
		if (p[2] == null) { p[2] = 0; }
		return graph.vertices_coords.map(v => v
			.map((n,i) => Math.pow(n - p[i], 2))
			.reduce((a,b) => a + b,0)
		).map((n,i) => ({d:Math.sqrt(n), i:i}))
		.sort((a,b) => a.d - b.d)
		.shift()
		.i;
	};

	/**
	 * returns index of nearest edge in edges_ arrays or
	 *  undefined if there are no vertices_coords or edges_vertices
	 */
	const nearest_edge = function(graph, point) {
		if (graph.vertices_coords == null || graph.vertices_coords.length === 0 ||
			graph.edges_vertices == null || graph.edges_vertices.length === 0) {
			return undefined;
		}
		// todo, z is not included in the calculation
		return graph.edges_vertices
			.map(e => e.map(ev => graph.vertices_coords[ev]))
			.map(e => Edge(e))
			.map((e,i) => ({e:e, i:i, d:e.nearestPoint(point).distanceTo(point)}))
			.sort((a,b) => a.d - b.d)
			.shift()
			.i;
	};

	const face_containing_point = function(graph, point) {
		if (graph.vertices_coords == null || graph.vertices_coords.length === 0 ||
			graph.faces_vertices == null || graph.faces_vertices.length === 0) {
			return undefined;
		}
		let face = graph.faces_vertices
			.map((fv,i) => ({face:fv.map(v => graph.vertices_coords[v]),i:i}))
			.filter(f => core.intersection.point_in_poly(f.face, point))
			.shift();
		return (face == null ? undefined : face.i);
	};

	const faces_containing_point = function(graph, point) {
		if (graph.vertices_coords == null || graph.vertices_coords.length === 0 ||
			graph.faces_vertices == null || graph.faces_vertices.length === 0) {
			return undefined;
		}
		return graph.faces_vertices
			.map((fv,i) => ({face:fv.map(v => graph.vertices_coords[v]),i:i}))
			.filter(f => core.intersection.point_in_polygon(f.face, point))
			.map(f => f.i);
	};


	const make_faces_matrix = function(graph, root_face) {
		let faces_matrix = graph.faces_vertices.map(v => [1,0,0,1,0,0]);
		make_face_walk_tree(graph, root_face).forEach((level) =>
			level.filter((entry) => entry.parent != null).forEach((entry) => {
				let edge = entry.edge.map(v => graph.vertices_coords[v]);
				let vec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
				let local = core.algebra.make_matrix2_reflection(vec, edge[0]);
				faces_matrix[entry.face] = core.algebra.multiply_matrices2(faces_matrix[entry.parent], local);
			})
		);
		return faces_matrix;
	};

	const make_faces_matrix_inv = function(graph, root_face) {
		let faces_matrix = graph.faces_vertices.map(v => [1,0,0,1,0,0]);
		make_face_walk_tree(graph, root_face).forEach((level) =>
			level.filter((entry) => entry.parent != null).forEach((entry) => {
				let edge = entry.edge.map(v => graph.vertices_coords[v]);
				let vec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
				let local = core.algebra.make_matrix2_reflection(vec, edge[0]);
				faces_matrix[entry.face] = core.algebra.multiply_matrices2(local, faces_matrix[entry.parent]);
			})
		);
		return faces_matrix;
	};
	/**
	 * @returns {}, description of changes. empty object if no intersection.
	 *
	 */

	const split_convex_polygon$1 = function(graph, faceIndex, linePoint, lineVector, crease_assignment = "F") {
		// survey face for any intersections which cross directly over a vertex
		let vertices_intersections = graph.faces_vertices[faceIndex]
			.map(fv => graph.vertices_coords[fv])
			.map(v => core.intersection.point_on_line(linePoint, lineVector, v) ? v : undefined)
			.map((point, i) => ({
				point: point,
				i_face: i,
				i_vertices: graph.faces_vertices[faceIndex][i]
			}))
			.filter(el => el.point !== undefined);

		// gather all edges of this face which cross the line
		let edges_intersections = graph.faces_edges[faceIndex]
			.map(ei => graph.edges_vertices[ei])
			.map(edge => edge.map(e => graph.vertices_coords[e]))
			.map(edge => core.intersection.line_edge_exclusive(linePoint, lineVector, edge[0], edge[1]))
			.map((point, i) => ({
				point: point,
				i_face: i,
				i_edges: graph.faces_edges[faceIndex][i]
			}))
			.filter(el => el.point !== undefined);

		// the only cases we care about are
		// - 2 edge intersections
		// - 2 vertices intersections
		// - 1 edge intersection and 1 vertex intersection
		// resolve each case by either gatering vertices (v-intersections) or splitting edges and making new vertices (e-intersections)
		let new_v_indices = [];
		let edge_map = Array.from(Array(graph.edges_vertices.length)).map(_=>0);
		if (edges_intersections.length === 2) {
			new_v_indices = edges_intersections.map((el,i,arr) => {
				let diff = add_vertex_on_edge(graph, el.point[0], el.point[1], el.i_edges);
				arr.slice(i+1)
					.filter(el => diff.edges.map[el.i_edges] != null)
					.forEach(el => el.i_edges += diff.edges.map[el.i_edges]);
				edge_map = merge_maps(edge_map, diff.edges.map);
				return diff.vertices.new[0].index;
			});
		} else if (edges_intersections.length === 1 && vertices_intersections.length === 1) {
			let a = vertices_intersections.map(el => el.i_vertices);
			let b = edges_intersections.map((el,i,arr) => {
				let diff = add_vertex_on_edge(graph, el.point[0], el.point[1], el.i_edges);
				arr.slice(i+1)
					.filter(el => diff.edges.map[el.i_edges] != null)
					.forEach(el => el.i_edges += diff.edges.map[el.i_edges]);
				edge_map = diff.edges.map;
				return diff.vertices.new[0].index;
			});
			new_v_indices = a.concat(b);
		} else if (vertices_intersections.length === 2) {
			new_v_indices = vertices_intersections.map(el => el.i_vertices);
			// check if the proposed edge is collinear to an already existing edge
			let face_v = graph.faces_vertices[faceIndex];
			let v_i = vertices_intersections;
			let match_a = face_v[(v_i[0].i_face+1)%face_v.length] === v_i[1].i_vertices;
			let match_b = face_v[(v_i[1].i_face+1)%face_v.length] === v_i[0].i_vertices;
			if (match_a || match_b) { return {}; }
		} else {
			return {};
		}
		// this results in a possible removal of edges. we now have edge_map marking this change
		// example: [0,0,0,-1,-1,-1,-1,-2,-2,-2]

		// connect an edge splitting the polygon into two, joining the two vertices
		// 1. rebuild the two faces
		//    (a) faces_vertices
		//    (b) faces_edges
		// 2. build the new edge

		// inside our face's faces_vertices, get index location of our new vertices
		// this helps us build both faces_vertices and faces_edges arrays
		let new_face_v_indices = new_v_indices
			.map(el => graph.faces_vertices[faceIndex].indexOf(el))
			.sort((a,b) => a-b);

		// construct data for our new geometry: 2 faces (faces_vertices, faces_edges)
		let new_faces = [{}, {}];
		new_faces[0].vertices = graph.faces_vertices[faceIndex]
			.slice(new_face_v_indices[1])
			.concat(graph.faces_vertices[faceIndex].slice(0, new_face_v_indices[0]+1));
		new_faces[1].vertices = graph.faces_vertices[faceIndex]
			.slice(new_face_v_indices[0], new_face_v_indices[1]+1);
		new_faces[0].edges = graph.faces_edges[faceIndex]
			.slice(new_face_v_indices[1])
			.concat(graph.faces_edges[faceIndex].slice(0, new_face_v_indices[0]))
			.concat([graph.edges_vertices.length]);
		new_faces[1].edges = graph.faces_edges[faceIndex]
			.slice(new_face_v_indices[0], new_face_v_indices[1])
			.concat([graph.edges_vertices.length]);
		new_faces[0].index = graph.faces_vertices.length;
		new_faces[1].index = graph.faces_vertices.length+1;

		// construct data for our new edge (vertices, faces, assignent, foldAngle, length)
		let new_edges = [{
			index: graph.edges_vertices.length,
			vertices: [...new_v_indices],
			assignment: crease_assignment,
			foldAngle: angle_from_assignment(crease_assignment),
			length: core.algebra.distance2(
				...(new_v_indices.map(v => graph.vertices_coords[v]))
			),
			// todo, unclear if these are ordered with respect to the vertices
			faces: [graph.faces_vertices.length, graph.faces_vertices.length+1]
		}];

		// add 1 new edge and 2 new faces to our graph
		let edges_count$$1 = graph.edges_vertices.length;
		let faces_count$$1 = graph.faces_vertices.length;
		new_faces.forEach((face,i) => Object.keys(face)
			.filter(suffix => suffix !== "index")
			.forEach(suffix => graph["faces_"+suffix][faces_count$$1+i] = face[suffix])
		);
		new_edges.forEach((edge,i) => Object.keys(edge)
			.filter(suffix => suffix !== "index")
			.forEach(suffix => graph["edges_"+suffix][edges_count$$1+i] = edge[suffix])
		);
		// update data that has been changed by edges
		new_edges.forEach((edge, i) => {
			let a = edge.vertices[0];
			let b = edge.vertices[1];
			// todo, it appears these are going in counter-clockwise order, but i don't know why
			graph.vertices_vertices[a].push(b);
			graph.vertices_vertices[b].push(a);
		});

		// rebuild edges_faces, vertices_faces
		// search inside vertices_faces for an occurence of the removed face,
		// determine which of our two new faces needs to be put in its place
		// by checking faces_vertices, by way of this map we build below:
		let v_f_map = {};
		graph.faces_vertices
			.map((face,i) => ({face: face, i:i}))
			.filter(el => el.i === faces_count$$1 || el.i === faces_count$$1+1)
			.forEach(el => el.face.forEach(v => {
				if (v_f_map[v] == null) { v_f_map[v] = []; }
				v_f_map[v].push(el.i);
			}));
		graph.vertices_faces
			.forEach((vf,i) => {
				let indexOf = vf.indexOf(faceIndex);
				while (indexOf !== -1) {
					graph.vertices_faces[i].splice(indexOf, 1, ...(v_f_map[i]));
					indexOf = vf.indexOf(faceIndex);
				}
			});
		// the same as above, but making a map of faces_edges to rebuild edges_faces
		let e_f_map = {};
		graph.faces_edges
			.map((face,i) => ({face: face, i:i}))
			.filter(el => el.i === faces_count$$1 || el.i === faces_count$$1+1)
			.forEach(el => el.face.forEach(e => {
				if (e_f_map[e] == null) { e_f_map[e] = []; }
				e_f_map[e].push(el.i);
			}));
		graph.edges_faces
			.forEach((ef,i) => {
				let indexOf = ef.indexOf(faceIndex);
				while (indexOf !== -1) {
					graph.edges_faces[i].splice(indexOf, 1, ...(e_f_map[i]));
					indexOf = ef.indexOf(faceIndex);
				}
			});

		// remove faces, adjust all relevant indices
		// console.log(JSON.parse(JSON.stringify(graph["re:faces_coloring"])));
		let faces_map = remove_faces(graph, [faceIndex]);
		// console.log("removing faceIndex", faces_map);
		// console.log(JSON.parse(JSON.stringify(graph["re:faces_coloring"])));

		// return a diff of the geometry
		return {
			faces: {
				map: faces_map,
				replace: [{
					old: faceIndex,
					new: new_faces
				}]
			},
			edges: {
				new: new_edges,
				map: edge_map
			}
		}
	};

	/** 
	 * when an edge sits inside a face with its endpoints collinear to face edges,
	 *  find those 2 face edges.
	 * @param [[x, y], [x, y]] edge
	 * @param [a, b, c, d, e] face_vertices. just 1 face. not .fold array
	 * @param vertices_coords from .fold
	 * @return [[a,b], [c,d]] vertices indices of the collinear face edges. 1:1 index relation to edge endpoints.
	 */
	const find_collinear_face_edges = function(edge, face_vertices, vertices_coords){
		let face_edge_geometry = face_vertices
			.map((v) => vertices_coords[v])
			.map((v, i, arr) => [v, arr[(i+1)%arr.length]]);
		return edge.map((endPt) => {
			// filter collinear edges to each endpoint, return first one
			// as an edge array index, which == face vertex array between i, i+1
			let i = face_edge_geometry
				.map((edgeVerts, edgeI) => ({index:edgeI, edge:edgeVerts}))
				.filter((e) => core.intersection.point_on_edge(e.edge[0], e.edge[1], endPt))
				.shift()
				.index;
			return [face_vertices[i], face_vertices[(i+1)%face_vertices.length]]
				.sort((a,b) => a-b);
		})
	};


	function clip_line(fold, linePoint, lineVector){
		function len(a,b){
			return Math.sqrt(Math.pow(a[0]-b[0],2) + Math.pow(a[1]-b[1],2));
		}

		let edges = fold.edges_vertices
			.map(ev => ev.map(e => fold.vertices_coords[e]));

		return [lineVector, [-lineVector[0], -lineVector[1]]]
			.map(lv => edges
				.map(e => core.intersection.ray_edge(linePoint, lv, e[0], e[1]))
				.filter(i => i != null)
				.map(i => ({intersection:i, length:len(i, linePoint)}))
				.sort((a, b) => a.length - b.length)
				.map(el => el.intersection)
				.shift()
			).filter(p => p != null);
	}

	var planargraph = /*#__PURE__*/Object.freeze({
		nearest_vertex: nearest_vertex,
		nearest_edge: nearest_edge,
		face_containing_point: face_containing_point,
		faces_containing_point: faces_containing_point,
		make_faces_matrix: make_faces_matrix,
		make_faces_matrix_inv: make_faces_matrix_inv,
		split_convex_polygon: split_convex_polygon$1,
		find_collinear_face_edges: find_collinear_face_edges,
		clip_line: clip_line
	});

	/**
	 * Each of these should return an array of Edges
	 * 
	 * Each of the axioms create full-page crease lines
	 *  ending at the boundary; in non-convex paper, this
	 *  could result in multiple edges
	 */

	/**
	 * point average, not centroid, only useful in certain cases
	 */
	const make_face_center = function(graph, face_index) {
		return graph.faces_vertices[face_index]
			.map(v => graph.vertices_coords[v])
			.reduce((a,b) => [a[0]+b[0], a[1]+b[1]], [0,0])
			.map(el => el/graph.faces_vertices[face_index].length);
	};

	// for now, this uses "re:faces_layer", todo: use faceOrders
	function crease_through_layers(graph, point, vector, stay_normal, crease_direction = "V", face_index) {
		console.log("_______________ crease_through_layers");
		console.log(graph.json);
		// let face_index;
		// todo: switch this for the general form
		let faces_count$$1 = graph.faces_vertices.length;

		let opposite_crease = 
			(crease_direction === "M" || crease_direction === "m" ? "V" : "M");
		// if face isn't set, it will be determined by whichever face
		// is directly underneath point. or if none, index 0.
		let face_centroid;
		if (face_index == null) {
			face_index = face_containing_point(graph, point);
			if(face_index === undefined) { face_index = 0; }
		} else {
			let points = graph.faces_vertices[face_index].map(fv => graph.vertices_coords[fv]);
			face_centroid = Polygon(points).centroid;
		}
		let creaseLine = Line(point, vector);
		let stayNormalVec = Vector(stay_normal);
		// todo: replace these with a get_faces_length that checks edges too
		let faces_to_move = graph["re:faces_to_move"] != null
			? graph["re:faces_to_move"]
			: Array.from(Array(faces_count$$1)).map(_ => false);

		// todo: replace this. this doesn't work
		let graph_faces_layer = graph["re:faces_layer"] != null
			? graph["re:faces_layer"]
			: Array.from(Array(faces_count$$1)).map(_ => 0);

		let faces_matrix = make_faces_matrix_inv(graph, face_index);
		let faces_crease_line = faces_matrix.map(m => creaseLine.transform(m));
		let faces_stay_normal = faces_matrix.map(m => stayNormalVec.transform(m));
		let faces_coloring$$1 = faces_coloring(graph, face_index);
		let faces_folding = Array.from(Array(faces_count$$1));
		let original_face_indices = Array.from(Array(faces_count$$1)).map((_,i)=>i);

		let faces_center = Array.from(Array(faces_count$$1))
			.map((_, i) => make_face_center(graph, i))
			.map(p => Vector(p));

		let faces_sidedness = Array.from(Array(faces_count$$1))
			.map((_, i) => faces_center[i].subtract(faces_crease_line[i].point))
			.map((v2, i) => faces_coloring$$1[i]
				? faces_crease_line[i].vector.cross(v2).z > 0
				: faces_crease_line[i].vector.cross(v2).z < 0);

		faces_crease_line
			.reverse()
			.forEach((line, reverse_i, arr) => {
				let i = arr.length - 1 - reverse_i;
				let diff = split_convex_polygon$1(graph, i, line.point,
					line.vector, faces_coloring$$1[i] ? crease_direction : opposite_crease);

				console.log("diff", diff);

				if (diff != null && diff.faces != null) {
					let face_stay_normal = faces_stay_normal[i];
					diff.faces.replace.forEach(replace => {
						// center of two faces - b/c convex, able to do a quick average
						let two_face_centers = replace.new
							.map(el => el.index + diff.faces.map[el.index])
							.map(i => graph.faces_vertices[i])
							.map(fv => fv.map(v => graph.vertices_coords[v]))
							.map(face => 
								face.reduce((a,b) => [a[0]+b[0], a[1]+b[1]], [0,0])
									.map(el => el/face.length)
							).map(p => Vector(p));

						// "left";
						let two_face_should_move = two_face_centers
							.map(c => c.subtract(line.point))
							.map(v2 => faces_coloring$$1[replace.old]
								? line.vector.cross(v2).z > 0
								: line.vector.cross(v2).z < 0);

						// let two_face_dots = two_face_vectors.map(v => v.dot(face_stay_normal));
						// let two_face_should_move = two_face_dots.map(d => d < 0);

						// console.log("______(this face)_______");
						// console.log("two_face_should_move", two_face_should_move);
						// console.log("coloring", faces_coloring[replace.old]);
						// console.log("two_face_centers", two_face_centers);
						// console.log("two_face_vectors", two_face_vectors);
						// console.log("two_face_dots", two_face_dots);
						// console.log("A+", two_face_centers.map(c => c.subtract(line.point)))
						// console.log("two_face_should_move_cross", two_face_should_move_cross);

						// console.log("faces_to_move[replace.old]", faces_to_move[replace.old]);

						original_face_indices.splice(replace.old, 1);
						// delete graph_faces_coloring[replace.old];
						replace.new.forEach((newFace, i) => {
							// console.log("adding new face at ", newFace.index);
							// graph_faces_coloring[newFace.index] = colors[i]
							faces_to_move[newFace.index] = faces_to_move[replace.old] || two_face_should_move[i];
							graph_faces_layer[newFace.index] = graph_faces_layer[replace.old];
							faces_folding[newFace.index] = two_face_should_move[i];
							console.log("making a new face: coloring is ", faces_coloring$$1[replace.old], " faces_folding is ", faces_folding[newFace.index] );
						});
					});
					// diff.faces.map.forEach((change, index) => graph_faces_coloring[index+change] = graph_faces_coloring[index]);
					// if (graph_faces_coloring["-1"] != null) { delete graph_faces_coloring["-1"] }
					// graph_faces_coloring.pop();

					// console.log("+++++++");
					// console.log(diff.faces);
					// console.log(diff.faces.map);
					// console.log( JSON.parse(JSON.stringify(faces_to_move)) );
					// todo, if we add more places where faces get removed, add their indices here

					faces_to_move = apply_diff_map(diff.faces.map, faces_to_move);
					graph_faces_layer = apply_diff_map(diff.faces.map, graph_faces_layer);
					faces_folding = apply_diff_map(diff.faces.map, faces_folding);
					faces_center = apply_diff_map(diff.faces.map, faces_center);
					faces_sidedness = apply_diff_map(diff.faces.map, faces_sidedness);

					// console.log(JSON.parse(JSON.stringify(faces_to_move)));
					// console.log("--------");
				}
			});
		console.log("original_face_indices", original_face_indices);

		faces_folding.forEach((f,newI) => {
			if (f == null) {
				let oldI = original_face_indices[newI];
				console.log("old new", oldI, newI);
				let line = faces_crease_line[oldI];
				let face_center = graph.faces_vertices[newI]
					.map(v => graph.vertices_coords[v])
					.reduce((a,b) => [a[0]+b[0], a[1]+b[1]], [0,0])
					.map(el => el/graph.faces_vertices[newI].length);
				let face_center_vec = Vector(face_center);
				let v2 = face_center_vec.subtract(line.point);
				console.log("comparing " + newI, line.point, line.vector, v2);
				let should_fold = faces_coloring$$1[oldI]
						? line.vector.cross(v2).z > 0
						: line.vector.cross(v2).z < 0;
				// let should_fold = line.vector.cross(v2).z > 0;
				faces_folding[newI] = should_fold;
				console.log("filling in a line: coloring is ", faces_coloring$$1[newI], " faces_folding is ", should_fold );
			}
		});
		// now we know which layers are being folded
		console.log("+++ BEFORE faces_layer", JSON.parse(JSON.stringify(graph_faces_layer)));
		console.log("faces_folding ", faces_folding);
		let new_layer_order = foldLayers(graph_faces_layer, faces_folding);
		// console.log("layering after " + lastLayer, faces_folding_indices, folding_layer_order);
		console.log("--- AFTER faces_layer", JSON.parse(JSON.stringify(new_layer_order)));

		// console.log("faces_folding", faces_folding);
		// graph["re:faces_coloring"] = faces_coloring;
		graph["re:faces_to_move"] = faces_to_move;
		graph["re:faces_layer"] = new_layer_order;
		// determine which faces changed
		// console.log(graph);
	}

	function foldLayers(layer_order, faces_folding) {
		let new_layer_order = [];
		let folding_i = layer_order
			.map((el,i) => faces_folding[i] ? i : undefined)
			.filter(a => a !== undefined);
		let not_folding_i = layer_order
			.map((el,i) => !faces_folding[i] ? i : undefined)
			.filter(a => a !== undefined);
		let sorted_folding_i = folding_i.slice()
			.sort((a,b) => layer_order[a] - layer_order[b]);
		let sorted_not_folding_i = not_folding_i.slice()
			.sort((a,b) => layer_order[a] - layer_order[b]);
		sorted_not_folding_i.forEach((layer, i) => new_layer_order[layer] = i);
		let topLayer = sorted_not_folding_i.length;
		sorted_folding_i.reverse().forEach((layer, i) => new_layer_order[layer] = topLayer + i);
		return new_layer_order;
	}

	function crease_folded(graph, point, vector, face_index) {
		// if face isn't set, it will be determined by whichever face
		// is directly underneath point. or if none, index 0.
		if (face_index == null) {
			face_index = face_containing_point(graph, point);
			if(face_index === undefined) { face_index = 0; }
		}
		let primaryLine = Line(point, vector);
		let coloring = faces_coloring(graph, face_index);
		make_faces_matrix_inv(graph, face_index)
			.map(m => primaryLine.transform(m))
			.reverse()
			.forEach((line, reverse_i, arr) => {
				let i = arr.length - 1 - reverse_i;
				let diff = split_convex_polygon$1(graph, i, line.point, line.vector, coloring[i] ? "M" : "V");
			});
	}

	function crease_line(graph, point, vector) {
		// let boundary = Graph.get_boundary_vertices(graph);
		// let poly = boundary.map(v => graph.vertices_coords[v]);
		// let edge_map = Array.from(Array(graph.edges_vertices.length)).map(_=>0);
		let new_edges = [];
		let arr = Array.from(Array(graph.faces_vertices.length))
			.map((_,i)=>i).reverse();
		arr.forEach(i => {
			let diff = split_convex_polygon$1(graph, i, point, vector);
			if (diff.edges != null && diff.edges.new != null) {
				// a new crease line was added
				let newEdgeIndex = diff.edges.new[0].index;
				new_edges = new_edges.map(edge => 
					edge += (diff.edges.map[edge] == null
						? 0
						: diff.edges.map[edge])
				);
				new_edges.push(newEdgeIndex);
			}
		});
		return new_edges;
	}

	function crease_ray(graph, point, vector) {
		let new_edges = [];
		let arr = Array.from(Array(graph.faces_vertices.length)).map((_,i)=>i).reverse();
		arr.forEach(i => {
			let diff = split_convex_polygon$1(graph, i, point, vector);
			if (diff.edges != null && diff.edges.new != null) {
				// a new crease line was added
				let newEdgeIndex = diff.edges.new[0].index;
				new_edges = new_edges.map(edge =>
					edge += (diff.edges.map[edge] == null ? 0 : diff.edges.map[edge])
				);
				new_edges.push(newEdgeIndex);
			}
		});
		return new_edges;
	}

	function axiom1$1(graph, pointA, pointB) { // n-dimension
		let line = core.origami.axiom1(pointA, pointB);
		return crease_line(graph, line[0], line[1]);
	}
	function axiom2$1(graph, pointA, pointB) {
		let line = core.origami.axiom2(pointA, pointB);
		return crease_line(graph, line[0], line[1]);
	}
	function axiom3$1(graph, pointA, vectorA, pointB, vectorB) {
		let lines = core.origami.axiom3(pointA, vectorA, pointB, vectorB);
		// todo: each iteration needs to apply the diff to the prev iterations
		// return lines.map(line => crease_line(graph, line[0], line[1]))
		// 	.reduce((a,b) => a.concat(b), []);
		return crease_line(graph, lines[0][0], lines[0][1]);
	}
	function axiom4$1(graph, pointA, vectorA, pointB) {
		let line = core.origami.axiom4(pointA, vectorA, pointB);
		return crease_line(graph, line[0], line[1]);
	}
	function axiom5$1(graph, pointA, vectorA, pointB, pointC) {
		let line = core.origami.axiom5(pointA, vectorA, pointB, pointC);
		return crease_line(graph, line[0], line[1]);
	}
	function axiom6$1(graph, pointA, vectorA, pointB, vectorB, pointC, pointD) {
		let line = core.origami.axiom6(pointA, vectorA, pointB, vectorB, pointC, pointD);
		return crease_line(graph, line[0], line[1]);
	}
	function axiom7$1(graph, pointA, vectorA, pointB, vectorB, pointC) {
		let line = core.origami.axiom7(pointA, vectorA, pointB, vectorB, pointC);
		return crease_line(graph, line[0], line[1]);
	}

	function creaseRay(graph, point, vector) {
		// todo idk if this is done
		let ray = core.Ray(point, vector);
		graph.faces_vertices.forEach(face => {
			let points = face.map(v => graph.vertices_coords[v]);
			core.intersection.clip_ray_in_convex_poly(_points, point, vector);
		});
		return crease_line(graph, line[0], line[1]);
	}

	const creaseSegment = function(graph, a, b, c, d) {
		// let edge = Geom.Edge([a, b, c, d]);
		let edge = Edge([a, b]);
		let edge_vertices = [0,1]
			.map((_,e) => graph.vertices_coords
				.map(v => Math.sqrt(Math.pow(edge[e][0]-v[0],2)+Math.pow(edge[e][1]-v[1],2)))
				.map((d,i) => d < 0.00000001 ? i : undefined)
				.filter(el => el !== undefined)
				.shift()
			).map((v,i) => {
				if (v !== undefined) { return v; }
				// else
				graph.vertices_coords.push(edge[i]);
				return graph.vertices_coords.length - 1;
			});

		graph.edges_vertices.push(edge_vertices);
		graph.edges_assignment.push("F");
		return [graph.edges_vertices.length-1];
	};

	function add_edge_between_points(graph, x0, y0, x1, y1) {
		// this creates 2 new edges vertices indices.
		// or grabs old ones if a vertex already exists
		let edge = [[x0, y0], [x1, y1]];
		let edge_vertices = edge
			.map(ep => graph.vertices_coords
				// for both of the new points, iterate over every vertex,
				// return an index if it matches a new point, undefined if not
				.map(v => Math.sqrt(Math.pow(ep[0]-v[0],2)+Math.pow(ep[1]-v[1],2)))
				.map((d,i) => d < 0.00000001 ? i : undefined)
				.filter(el => el !== undefined)
				.shift()
			).map((v,i) => {
				if (v !== undefined) { return v; }
				// else
				graph.vertices_coords.push(edge[i]);
				return graph.vertices_coords.length - 1;
			});
		graph.edges_vertices.push(edge_vertices);
		graph.edges_assignment.push("F");
		graph.edges_length.push(Math.sqrt(Math.pow(x0-x1,2)+Math.pow(y0-y1,2)));
		return [graph.edges_vertices.length-1];
	}


	// let sector_angles = function(graph, vertex) {
	// 	let adjacent = origami.cp.vertices_vertices[vertex];
	// 	let vectors = adjacent.map(v => [
	// 		origami.cp.vertices_coords[v][0] - origami.cp.vertices_coords[vertex][0],
	// 		origami.cp.vertices_coords[v][1] - origami.cp.vertices_coords[vertex][1]
	// 	]);
	// 	let vectors_as_angles = vectors.map(v => Math.atan2(v[1], v[0]));
	// 	return vectors.map((v,i,arr) => {
	// 		let nextV = arr[(i+1)%arr.length];
	// 		return RabbitEar.math.core.geometry.counter_clockwise_angle2(v, nextV);
	// 	});
	// }

	let vertex_adjacent_vectors = function(graph, vertex) {
		let adjacent = origami.cp.vertices_vertices[vertex];
		return adjacent.map(v => [
			origami.cp.vertices_coords[v][0] - origami.cp.vertices_coords[vertex][0],
			origami.cp.vertices_coords[v][1] - origami.cp.vertices_coords[vertex][1]
		]);
	};

	function kawasaki_from_even(array) {
		let even_sum = array.filter((_,i) => i%2 === 0).reduce((a,b) => a+b, 0);
		let odd_sum = array.filter((_,i) => i%2 === 1).reduce((a,b) => a+b, 0);
		// if (even_sum > Math.PI) { return undefined; }
		return [Math.PI - even_sum, Math.PI - odd_sum];
	}

	function kawasaki_solutions(graph, vertex) {
		let vectors = vertex_adjacent_vectors(graph, vertex);
		let vectors_as_angles = vectors.map(v => Math.atan2(v[1], v[0]));
		// get the interior angles of sectors around a vertex
		return vectors.map((v,i,arr) => {
			let nextV = arr[(i+1)%arr.length];
			return core.geometry.counter_clockwise_angle2(v, nextV);
		}).map((_, i, arr) => {
			// for every sector, get an array of all the OTHER sectors
			let a = arr.slice();
			a.splice(i,1);
			return a;
		}).map(a => kawasaki_from_even(a))
		.map((kawasakis, i, arr) =>
			// change these relative angle solutions to absolute angles
			(kawasakis == null
				? undefined
				: vectors_as_angles[i] + kawasakis[1])
		).map(k => (k === undefined)
			// convert to vectors
			? undefined
			: [Math.cos(k), Math.sin(k)]
		);
	}

	function kawasaki_collapse(graph, vertex, face, crease_direction = "F") {
		let kawasakis = kawasaki_solutions(graph, vertex);
		let origin = graph.vertices_coords[vertex];
		split_convex_polygon$1(graph, face, origin, kawasakis[face], crease_direction);
	}

	function fold_without_layering(fold, face) {
		if (face == null) { face = 0; }
		let faces_matrix = make_faces_matrix(fold, face);
		let vertex_in_face = fold.vertices_coords.map((v,i) => {
			for(var f = 0; f < fold.faces_vertices.length; f++){
				if(fold.faces_vertices[f].includes(i)){ return f; }
			}
		});
		let new_vertices_coords_cp = fold.vertices_coords.map((point,i) =>
			core.algebra.multiply_vector2_matrix2(point, faces_matrix[vertex_in_face[i]]).map((n) => 
				core.clean_number(n)
			)
		);
		fold.frame_classes = ["foldedState"];
		fold.vertices_coords = new_vertices_coords_cp;
		return fold;
	}

	var origami$2 = /*#__PURE__*/Object.freeze({
		crease_through_layers: crease_through_layers,
		foldLayers: foldLayers,
		crease_folded: crease_folded,
		crease_line: crease_line,
		crease_ray: crease_ray,
		axiom1: axiom1$1,
		axiom2: axiom2$1,
		axiom3: axiom3$1,
		axiom4: axiom4$1,
		axiom5: axiom5$1,
		axiom6: axiom6$1,
		axiom7: axiom7$1,
		creaseRay: creaseRay,
		creaseSegment: creaseSegment,
		add_edge_between_points: add_edge_between_points,
		kawasaki_solutions: kawasaki_solutions,
		kawasaki_collapse: kawasaki_collapse,
		fold_without_layering: fold_without_layering
	});

	/** 
	 * this searches user-provided inputs for a valid n-dimensional vector 
	 * which includes objects {x:, y:}, arrays [x,y], or sequences of numbers
	 * 
	 * @returns (number[]) array of number components
	 *   invalid/no input returns an emptry array
	*/

	function get_vec$1() {
		let params = Array.from(arguments);
		if (params.length === 0) { return; }
		// list of numbers 1, 2, 3, 4, 5
		let numbers = params.filter((param) => !isNaN(param));
		if (numbers.length >= 1) { return numbers; }
		// already a vector type: {vector:[1,2,3]}
		if (params[0].vector != null && params[0].vector.constructor === Array) {
			return params[0].vector;
		}
		if (!isNaN(params[0].x)) {
			return ['x','y','z'].map(c => params[0][c]).filter(a => a != null);
		}
		// at this point, a valid vector is somewhere inside arrays
		let arrays = params.filter((param) => param.constructor === Array);
		if (arrays.length >= 1) { return get_vec$1(...arrays[0]); }
	}

	function get_two_vec2$1() {
		let params = Array.from(arguments);
		let numbers = params.filter((param) => !isNaN(param));
		if (numbers.length >= 4) {
			return [
				[numbers[0], numbers[1]],
				[numbers[2], numbers[3]]
			];
		}
		let vecs = params.map(a => get_vec$1(a)).filter(a => a != null);
		if (vecs.length > 1) { return vecs; }
		let arrays = params.filter((param) => param.constructor === Array);
		if (arrays.length === 0) { return; }
		return get_two_vec2$1(...arrays[0]);
	}

	function get_two_lines() {
		let params = Array.from(arguments);
		if (params[0].point) {
			if (params[0].point.constructor === Array) {
				return [
					[[params[0].point[0], params[0].point[1]],
					 [params[0].vector[0], params[0].vector[1]]],
					[[params[1].point[0], params[1].point[1]],
					 [params[1].vector[0], params[1].vector[1]]],
				];
			} else {
				return [
					[[params[0].point.x, params[0].point.y],
					 [params[0].vector.x, params[0].vector.y]],
					[[params[1].point.x, params[1].point.y],
					 [params[1].vector.x, params[1].vector.y]],
				];
			}
		}
	}

	/* (c) Robby Kraft, MIT License */
	const RES_CIRCLE=64,RES_PATH=64,svg_line_to_segments=function(a){return [[a.x1.baseVal.value,a.y1.baseVal.value,a.x2.baseVal.value,a.y2.baseVal.value]]},svg_rect_to_segments=function(a){let b=a.x.baseVal.value,c=a.y.baseVal.value,d=a.width.baseVal.value,e=a.height.baseVal.value;return [[b,c,b+d,c],[b+d,c,b+d,c+e],[b+d,c+e,b,c+e],[b,c+e,b,c]]},svg_circle_to_segments=function(a){var b=Math.PI;let c=a.cx.baseVal.value,d=a.cy.baseVal.value,e=a.r.baseVal.value;return Array.from(Array(RES_CIRCLE)).map((a,f)=>[c+e*Math.cos(2*(f/RES_CIRCLE*b)),d+e*Math.sin(2*(f/RES_CIRCLE*b))]).map((a,b,c)=>[c[b][0],c[b][1],c[(b+1)%c.length][0],c[(b+1)%c.length][1]])},svg_ellipse_to_segments=function(a){var b=Math.PI;let c=a.cx.baseVal.value,d=a.cy.baseVal.value,e=a.rx.baseVal.value,f=a.ry.baseVal.value;return Array.from(Array(RES_CIRCLE)).map((a,g)=>[c+e*Math.cos(2*(g/RES_CIRCLE*b)),d+f*Math.sin(2*(g/RES_CIRCLE*b))]).map((a,b,c)=>[c[b][0],c[b][1],c[(b+1)%c.length][0],c[(b+1)%c.length][1]])},svg_polygon_to_segments=function(a){return Array.from(a.points).map(a=>[a.x,a.y]).map((b,c,d)=>[d[c][0],d[c][1],d[(c+1)%d.length][0],d[(c+1)%d.length][1]])},svg_polyline_to_segments=function(a){let b=svg_polygon_to_segments(a);return b.pop(),b},svg_path_to_segments=function(a){let b=a.getAttribute("d"),c="Z"===b[b.length-1]||"z"===b[b.length-1],d=c?a.getTotalLength()/RES_PATH:a.getTotalLength()/(RES_PATH-1),e=Array.from(Array(RES_PATH)).map((b,c)=>a.getPointAtLength(c*d)).map(a=>[a.x,a.y]),f=e.map((b,c,d)=>[d[c][0],d[c][1],d[(c+1)%d.length][0],d[(c+1)%d.length][1]]);return c||f.pop(),f},parsers={line:svg_line_to_segments,rect:svg_rect_to_segments,circle:svg_circle_to_segments,ellipse:svg_ellipse_to_segments,polygon:svg_polygon_to_segments,polyline:svg_polyline_to_segments,path:svg_path_to_segments},parseable=Object.keys(parsers),flatten_tree=function(a){return "g"===a.tagName||"svg"===a.tagName?Array.from(a.children).map(a=>flatten_tree(a)).reduce((c,a)=>c.concat(a),[]):[a]},segments=function(a){return flatten_tree(a).filter(a=>-1!==parseable.indexOf(a.tagName)).map(a=>parsers[a.tagName](a)).reduce((c,a)=>c.concat(a),[])};

	function svg_to_fold(svg$$1) {

		// for each geometry, add creases without regards to invalid planar data
		//  (intersecting lines, duplicate vertices), clean up later.
		let graph = {
			"file_spec": 1.1,
			"file_creator": "RabbitEar",
			"file_classes": ["singleModel"],
			"frame_title": "",
			"frame_classes": ["creasePattern"],
			"frame_attributes": ["2D"],
			"vertices_coords": [],
			"vertices_vertices": [],
			"vertices_faces": [],
			"edges_vertices": [],
			"edges_faces": [],
			"edges_assignment": [],
			"edges_foldAngle": [],
			"edges_length": [],
			"faces_vertices": [],
			"faces_edges": [],
		};

		segments(svg$$1).forEach(l =>
			add_edge_between_points(graph, l[0], l[1], l[2], l[3])
		);

		return graph;
	}

	const load_fold = function(input, callback) {
		// are they giving us a filename, or the data of an already loaded file?
		if (typeof input === "string" || input instanceof String) {
			let extension = input.substr((input.lastIndexOf('.') + 1));
			// filename. we need to upload
			switch(extension) {
				case "fold":
				fetch(input)
					.then((response) => response.json)
					.then((data) => {
						if (callback != null) { callback(data); }
					});
				return;
				case "svg":
				load(input, function(svg$$1) {
					let fold = svg_to_fold(svg$$1);
					if (callback != null) { callback(fold); }
				});
				return;
			}
		}
		try {
			// try .fold file format first
			let fold = JSON.parse(input);
			if (callback != null) { callback(fold); }
		} catch(err) {
			console.log("not a valid .fold file format");
			// return this;
		}
	};

	function valleyfold(foldFile, linePoint, lineVector, touchPoint){

		// if (point == null) point = [0.6, 0.6];
		if (touchPoint != null) {
			// console.log("Jason Code!");
			let new_fold = split_folding_faces(
				foldFile, 
				linePoint, 
				lineVector,
				touchPoint
			);
			return new_fold;
		}
	}

	// assumes point not on line
	var split_folding_faces = function(fold, linePoint, lineVector, point) {

		// find which face index (layer) the user touched
		let tap = top_face_under_point(fold, point);
		if (tap == null) { return undefined; }
		// keys are faces with vals: {clip: [[x,y],[x,y]], collinear:[[i,j],[k,l]] }
		let clippedLines = clip_line_in_faces(fold, linePoint, lineVector);
		// array of objects: {edges:[i,j], face:f, point:[x,y]}
		let newVertices = get_new_vertices(clippedLines);
		// create a new .fold vertices_coords with new data appended to the end
		let new_vertices_coords = make_new_vertices_coords(fold.vertices_coords, newVertices);
		// walk faces. generate two new faces for every cut face
		// sort these new face-pairs by which side of the line they are.
		let new_face_map = make_new_face_mapping(fold.faces_vertices,
				clippedLines, newVertices).map((subs) =>
				sortTwoFacesBySide(subs, new_vertices_coords, linePoint, lineVector)
			);
		// convert undefined to empty array to convert face indices to face point geometry
		let side = [0,1]
			.map(s => new_face_map[tap][s] == null ? [] : new_face_map[tap][s]) 
			.map(points => points.map(f => new_vertices_coords[f]))
			.map(f => core.intersection.point_in_poly(f, point))
			.indexOf(true);
		// make face-adjacent faces on only a subset, the side we clicked on
		let moving_side = new_face_map.map(f => f[side]);
		let faces_faces = make_faces_faces({faces_vertices:moving_side});
		// mark which faces are going to be moving based on a valley fold
		let faces_mark = mark_moving_faces(moving_side, new_vertices_coords, 
			faces_faces, fold.faces_layer, tap);

		// split faces at the fold line. 
		let stay_faces, move_faces;
		({stay_faces, move_faces} = reconstitute_faces(fold.faces_vertices,
			fold.faces_layer, new_face_map, faces_mark, side));

		// compile layers back into arrays, bubble moving faces to top z-order
		let stay_layers = stay_faces.length;
		let new_layer_data = sort_faces_valley_fold(stay_faces, move_faces);

		// clean isolated vertices
		// (compiled_faces_vertices, compiled_faces_layer)
		// var cleaned = Graph.remove_isolated_vertices({new_vertices_coords,
		//	new_layer_data.faces_vertices});
		var cleaned = {
			vertices_coords: new_vertices_coords,
			faces_vertices:new_layer_data.faces_vertices
		};
		console.log(cleaned);
		remove_isolated_vertices(cleaned);

		// flip points across the fold line, 
		let reflected = reflect_across_fold(cleaned.vertices_coords,
			cleaned.faces_vertices, new_layer_data.faces_layer,
			stay_layers, linePoint, lineVector);

		// for every vertex, give me an index to a face which it's found in
		let vertex_in_face = reflected.vertices_coords.map((v,i) => {
			for(var f = 0; f < cleaned.faces_vertices.length; f++){
				if(cleaned.faces_vertices[f].includes(i)){ return f; }
			}
		});

		var bottom_face = 1; // todo: we need a way for the user to select this
		let faces_matrix = make_faces_matrix({vertices_coords:reflected.vertices_coords, 
			faces_vertices:cleaned.faces_vertices}, bottom_face);
		let inverseMatrices = faces_matrix.map(n => core.make_matrix2_inverse(n));

		let new_vertices_coords_cp = reflected.vertices_coords.map((point,i) =>
			core.multiply_vector2_matrix2(point, inverseMatrices[vertex_in_face[i]]).map((n) => 
				core.clean_number(n)
			)
		);

		// let faces_direction = cleaned.faces_vertices.map(f => true);
		// make_face_walk_tree(cleaned.faces_vertices, bottom_face)
		// 	.forEach((level,i) => level.forEach((f) => 
		// 		faces_direction[f.face] = i%2==0 ? true : false
		// 	))

		// create new fold file
		let new_fold = {
			vertices_coords: reflected.vertices_coords,
			faces_vertices: cleaned.faces_vertices,
			faces_layer: reflected.faces_layer
		};

		// new_fold.faces_direction = faces_direction;
		
		faces_vertices_to_edges(new_fold);

		let headers = {
			"file_spec": 1.1,
			"file_creator": "Rabbit Ear",
			"file_author": "",
			"file_classes": ["singleModel"],
			"frame_attributes": ["2D"],
			"frame_title": "one valley crease",
			"frame_classes": ["foldedState"]
		};
		// bring along any metadata from the original file, replace when necessary
		Object.keys(headers).forEach(meta => new_fold[meta] = (fold[meta] == undefined) ? headers[meta] : fold[meta]);

		new_fold.file_classes = ["singleModel"];
		new_fold.frame_attributes = ["2D"];
		new_fold.frame_classes = ["foldedState"];
		new_fold.file_frames = [{
			"frame_classes": ["creasePattern"],
			"parent": 0,
			"inherit": true,
			"vertices_coords": new_vertices_coords_cp
		}];

		// console.log("------------------");
		// console.log("1. tap", tap);
		// console.log("2. clippedLines", clippedLines);
		// console.log("3. newVertices", newVertices);
		// console.log("4. new_vertices_coords", new_vertices_coords);
		// console.log("5. new_face_map", new_face_map);
		// console.log("6. side", side);
		// console.log("7. faces_faces", faces_faces);
		// console.log("8. faces_mark", faces_mark);
		// console.log("9. new_layer_data", new_layer_data);
		// console.log("9. faces_layer", reflected.faces_layer);
		// console.log("10. vertices_coords", new_fold.vertices_coords);
		// console.log("11. vertex_in_face", vertex_in_face);
		// console.log("12. faces_matrix", faces_matrix);
		// console.log("13. new_fold", new_fold);

		return new_fold;
	};

	// input: fold file and line
	// output: dict keys: two vertex indices defining an edge (as a string: "4 6")
	//         dict vals: [x, y] location of intersection between the two edge vertices
	var clip_line_in_faces = function({vertices_coords, faces_vertices},
		linePoint, lineVector){
		// convert faces into x,y geometry instead of references to vertices
		// generate one clip line per face, or undefined if there is no intersection
		// array of objects {face: index of face, clip: the clip line}
		let clipLines = faces_vertices
			.map(va => va.map(v => vertices_coords[v]))
			.map((poly,i) => ({
				"face":i,
				"clip":core.intersection.clip_line_in_convex_poly(poly, linePoint, lineVector)
			}))
			.filter((obj) => obj.clip != undefined)
			.reduce((prev, curr) => {
				prev[curr.face] = {"clip": curr.clip};
				return prev;
			}, {});

		Object.keys(clipLines).forEach(faceIndex => {
			let face = faces_vertices[faceIndex];
			let line = clipLines[faceIndex].clip;
			clipLines[faceIndex].collinear = find_collinear_face_edges(line, face, vertices_coords);
		});

		// each face is now an index in the object, containing "clip", "collinear"
		// 0: {  clip: [[x,y],[x,y]],  collinear: [[i,j],[k,l]]  }
		return clipLines
	};

	var get_new_vertices = function(clipLines){
		// edgeCrossings is object with N entries: # edges which are crossed by line
		let edgeCrossings = {};
		Object.keys(clipLines).forEach(faceIndex => {
			let keys$$1 = clipLines[faceIndex].collinear.map(e => e.sort((a,b) => a-b).join(" "));
			keys$$1.forEach((k,i) => edgeCrossings[k] = ({
				"point": clipLines[faceIndex].clip[i],
				"face": parseInt(faceIndex)
			}));
		});
		let new_vertices = Object.keys(edgeCrossings).map(key => {
			edgeCrossings[key].edges = key.split(" ").map(s => parseInt(s));
			return edgeCrossings[key];
		});
		return new_vertices;
	};

	let make_new_vertices_coords = function(vertices_coords, newVertices){
		// deep copy components
		let new_vertices_coords = JSON.parse(JSON.stringify(vertices_coords));

		newVertices.forEach(obj => {
			new_vertices_coords.push(obj.point);
			obj.newVertexIndex = new_vertices_coords.length-1;
		});
		return new_vertices_coords;
	};

	/** 
	 * edge-walk faces with the new clip line to make 2 faces where 1 face was.
	 */
	var make_new_face_mapping = function(faces_vertices, clipLines, newVertices){
		// these will depricate the entries listed below, requiring rebuild:
		//   "vertices_vertices", "vertices_faces"
		//   "edges_faces", "edges_assignment", "edges_foldAngle", "edges_length"
		//   "faces_edges", "faces_layer", "faceOrders"

		let edgesCrossed = {};
		newVertices.forEach(newV => edgesCrossed[newV.edges.join(" ")] = newV);

		let new_face_map = faces_vertices.map(arr => [arr, undefined]);
		Object.keys(clipLines).forEach( s => {
			let faceIndex = parseInt(s);
			var newFacePair = [ [], [] ];
			var rightLeft = 0;
			faces_vertices[faceIndex].forEach( (vertex,i,vertexArray) => {
				let nextVertex = vertexArray[(i+1)%vertexArray.length];
				var key = [vertex, nextVertex].sort( (a,b) => a-b ).join(' ');
				if(edgesCrossed[key]){
					var intersection = edgesCrossed[key].newVertexIndex;
					newFacePair[rightLeft].push(intersection);
					rightLeft = (rightLeft+1)%2; // flip bit
					newFacePair[rightLeft].push(intersection);
					newFacePair[rightLeft].push(nextVertex);
				} else{
					newFacePair[rightLeft].push(nextVertex);
				}
			});
			new_face_map[faceIndex] = newFacePair;
		});
		return new_face_map;
	};

	var sortTwoFacesBySide = function(twoFaces, vertices_coords, linePoint, lineVector){
		var result = [undefined, undefined];
		twoFaces.forEach(face => {
			if(face == undefined){ return; }
			var crossSum = face.map(p => {
				var fP = vertices_coords[p];
				var a = [fP[0] - linePoint[0], fP[1] - linePoint[1]];
				var b = [lineVector[0], lineVector[1]];
				return a[0]*b[1] - a[1]*b[0];
			}).reduce((prev,curr) => prev+curr);
			var index = (crossSum < 0) ? 0 : 1;
			result[index] = face;
		});
		return result
	};

	var mark_moving_faces = function(faces_vertices, vertices_coords, faces_faces, faces_layer, face_idx) {
		let marked = faces_vertices.map(() => false);
		marked[face_idx] = true;
		let to_process = [face_idx];
		let process_idx = 0;
		let faces_points = faces_vertices.map((vertices_index) =>
		(vertices_index === undefined)
			? undefined
			: vertices_index.map(i => vertices_coords[i])
		);
		while (process_idx < to_process.length) {
			// pull face off queue
			let idx1 = to_process[process_idx];
			process_idx += 1;
			// add all unmarked above-overlapping faces to queue
			faces_vertices.forEach((vertices_index, idx2) => {
				if (!marked[idx2] && ((faces_layer[idx2] > faces_layer[idx1]))) {
			if (faces_points[idx1] !== undefined && faces_points[idx2] !== undefined) {
			  if (core.intersection.convex_polygons_overlap(faces_points[idx1], faces_points[idx2])) {
				marked[idx2] = true;
				to_process.push(idx2);
			  }
			}
				}
			});
			// add all unmarked adjacent faces to queue
			faces_faces[idx1].forEach((idx2) => {
				if (!marked[idx2]) {
					marked[idx2] = true;
					to_process.push(idx2);
				}
			});
		}
		return marked;
	};

	/** merge faces or separate faces at the clip line, and bubble up faces
	 *  in the layer order if they're going to be folded.
	 * new_face_map   - from make_new_face_mapping function
	 * faces_mark     - boolean if a face in new_face_map should move
	 * whichSideMoves - which side of the new_face_map we're moving
	 */
	var reconstitute_faces = function(faces_vertices, faces_layer, new_face_map, faces_mark, whichSideMoves){
		// for each level there are 4 cases:
		//  1. do not move: clipping ignored. original face restored. new_face_map ignored.
		//  2. move and clipping occured: split faces, move one face (to top layer)
		//  3. move without clipping: face was on one side and it either
		//     3a. moves  3b. stays
		let new_faces_vertices = faces_vertices.slice(); // append to this
		let new_faces_layer = faces_layer.slice(); // don't append to this
		let stay_layers = new_faces_layer.length; // which layer # divides stay/fold

		let faces_mark_i = faces_mark.map((mark,i) => ({mark:mark, i:i}));

		let stay_faces = faces_mark.map((mark,i) => {
			if(mark){ return new_face_map[i][(whichSideMoves+1)%2]; }
			else { return faces_vertices[i]; }
		}).map((verts,i) => {
			if(verts != undefined){ return {old_face:i, old_layer:faces_layer[i], new_vertices:verts}; }
		}).filter(el => el != undefined);

		let move_faces = faces_mark_i
			.filter(obj => obj.mark)
			.map(obj =>
			 ({old_face:obj.i, old_layer:faces_layer[obj.i], new_vertices:new_face_map[obj.i][whichSideMoves]})
		);
		return {stay_faces, move_faces};
	};

	// argument objects stay_faces and move_faces are modified in place
	var sort_faces_valley_fold = function(stay_faces, move_faces){
		// top/bottom layer maps. new faces, new layers, and where they came from
		// some faces have bubbled to the top, layers need to decrement to take their place
		stay_faces.forEach((obj,i) => obj.i = i);
		move_faces.forEach((obj,i) => obj.i = i);
		stay_faces.sort((a,b) => a.old_layer - b.old_layer)
			.forEach((obj,j) => obj.new_layer = j);
		// give me the top-most layer
		// give layer numbers to the new faces
		move_faces.sort((a,b) => a.old_layer - b.old_layer)
			.forEach((obj,j) => obj.new_layer = j + stay_faces.length);
		// we really don't need to do this. put faces back in original order
		stay_faces.sort((a,b) => a.i - b.i);
		move_faces.sort((a,b) => a.i - b.i);
		stay_faces.forEach(obj => delete obj.i);
		move_faces.forEach(obj => delete obj.i);
		// give new face ids
		stay_faces.forEach((obj,i) => obj.new_face = i);
		move_faces.forEach((obj,i) => obj.new_face = i + stay_faces.length);
		// perform a valley fold
		let stay_faces_vertices = stay_faces.map(obj => obj.new_vertices);
		let move_faces_vertices = move_faces.map(obj => obj.new_vertices);
		let stay_faces_layer = stay_faces.map(obj => obj.new_layer);
		let move_faces_layer = move_faces.map(obj => obj.new_layer);
		return {
			'faces_vertices': stay_faces_vertices.concat(move_faces_vertices),
			'faces_layer': stay_faces_layer.concat(move_faces_layer)
		}
	};

	var reflect_across_fold = function(vertices_coords, faces_vertices,
		faces_layer, stay_layers, linePoint, lineVector){
		var matrix = core.make_matrix_reflection(lineVector, linePoint);

		var top_layer = faces_layer.slice(0, stay_layers);
		var bottom_layer = faces_layer.slice(stay_layers, stay_layers + faces_layer.length-stay_layers);
		bottom_layer.reverse();

		var boolArray = vertices_coords.map(() => false);

		for(var i = stay_layers; i < faces_vertices.length; i++){
			for(var f = 0; f < faces_vertices[i].length; f++){
				if(!boolArray[ faces_vertices[i][f] ]){
					var vert = vertices_coords[ faces_vertices[i][f] ];
					vertices_coords[ faces_vertices[i][f] ] = core.multiply_vector2_matrix2(vert, matrix);
					boolArray[ faces_vertices[i][f] ] = true;
				}
			}
		}
		return {
			'faces_layer': top_layer.concat(bottom_layer),
			'vertices_coords': vertices_coords,
		}
	};

	// get index of highest layer face which intersects point
	var top_face_under_point = function(
			{faces_vertices, vertices_coords, faces_layer}, 
			point) {
		let top_fi = faces_vertices.map(
			(vertices_index, fi) => {
				let points = vertices_index.map(i => vertices_coords[i]);
				return core.intersection.point_in_poly(points, point) ? fi : -1;
			}).reduce((acc, fi) => {
				return ((acc === -1) || 
								((fi !== -1) && (faces_layer[fi] > faces_layer[acc]))
				) ? fi : acc;
			}, -1);
		return (top_fi === -1) ? undefined : top_fi;
	};


	///////////////////////////////////////////////
	// FROM .FOLD SOURCE
	///////////////////////////////////////////////

	// this comes from fold.js. still working on the best way to require() the fold module
	const faces_vertices_to_edges = function (mesh) {
		var edge, edgeMap, face, i, key, ref, v1, v2, vertices;
		mesh.edges_vertices = [];
		mesh.edges_faces = [];
		mesh.faces_edges = [];
		mesh.edges_assignment = [];
		edgeMap = {};
		ref = mesh.faces_vertices;
		for (face in ref) {
			vertices = ref[face];
			face = parseInt(face);
			mesh.faces_edges.push((function() {
				var j, len, results;
				results = [];
				for (i = j = 0, len = vertices.length; j < len; i = ++j) {
					v1 = vertices[i];
					v1 = parseInt(v1);
					v2 = vertices[(i + 1) % vertices.length];
					if (v1 <= v2) {
						key = v1 + "," + v2;
					} else {
						key = v2 + "," + v1;
					}
					if (key in edgeMap) {
						edge = edgeMap[key];
					} else {
						edge = edgeMap[key] = mesh.edges_vertices.length;
						if (v1 <= v2) {
							mesh.edges_vertices.push([v1, v2]);
						} else {
							mesh.edges_vertices.push([v2, v1]);
						}
						mesh.edges_faces.push([null, null]);
						mesh.edges_assignment.push('B');
					}
					if (v1 <= v2) {
						mesh.edges_faces[edge][0] = face;
					} else {
						mesh.edges_faces[edge][1] = face;
					}
					results.push(edge);
				}
				return results;
			})());
		}
		return mesh;
	};

	var squareFoldString = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"\",\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [[0,0], [1,0], [1,1], [0,1]],\n\t\"vertices_vertices\": [[1,3], [2,0], [3,1], [0,2]],\n\t\"vertices_faces\": [[0], [0], [0], [0]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,0]],\n\t\"edges_faces\": [[0], [0], [0], [0]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0],\n\t\"edges_length\": [1, 1, 1, 1],\n\t\"faces_vertices\": [[0,1,2,3]],\n\t\"faces_edges\": [[0,1,2,3]]\n}";

	// MIT open source license, Robby Kraft

	let cpObjKeys = ["load", "json", "clear", "wipe", "clearGraph", "nearestVertex", "nearestEdge", "nearestFace", "vertex", "edge", "face", "crease", "addVertexOnEdge", "connectedGraphs", "axiom1", "axiom2", "axiom3", "axiom4", "axiom5", "axiom6", "axiom7", "creaseRay"];

	/** A graph is a set of nodes and edges connecting them */
	function CreasePattern() {
		let graph = {}; // the returned object. fold file format spec

		// parse arguments, look for an input .fold file
		let params = Array.from(arguments);
		let paramsObjs = params.filter(el => typeof el === "object" && el !== null);
		// todo: which key should we check to verify .fold? coords prevents abstract CPs
		let foldObjs = paramsObjs.filter(el => el.vertices_coords != null);
		if (foldObjs.length > 0) {
			// expecting the user to have passed in a fold_file.
			// if there are multiple we are only grabbing the first one
			graph = JSON.parse(JSON.stringify(foldObjs.shift()));
		} else {
			// unit square is the default base if nothing else is provided
			graph = JSON.parse(squareFoldString);
		}

		// unclear if we want to use this
		// let frame = 0; // which fold file frame (0 ..< Inf) to display

		// callback for when the crease pattern has been altered
		graph.onchange = undefined;

		graph.load = function(file) {
			// todo:
			let imported = JSON.parse(JSON.stringify(file));
			// Graph.all_keys.filter(key => graph[key] = undefined) {

			// }
			for (let key in imported) {
				graph[key] = imported[key];
			}
		};
		graph.clear = function() {
			remove_non_boundary_edges(graph);
			if (typeof graph.onchange === "function") { graph.onchange(); }
		};
		graph.wipe = function() {
			// Graph.all_keys.filter(a => _m[a] != null)
			// 	.forEach(key => delete _m[key]);
			// if (typeof graph.onchange === "function") { graph.onchange(); }
		};
		graph.clearGraph = function() {
			// Graph.keys.graph.filter(a => _m[a] != null)
			// 	.forEach(key => delete _m[key]);
			// if (typeof graph.onchange === "function") { graph.onchange(); }
		};
		Object.defineProperty(graph, "isFolded", { get: function(){
			// try to discern folded state
			if (graph.frame_classes == null) { return false; }
			return graph.frame_classes.includes("foldedState");
		}});
		graph.copy = function() {
			// todo: how do you call the function that we're inside?
			return RabbitEar.CreasePattern(JSON.parse(JSON.stringify(graph)));
		};
		graph.nearestVertex = function(x, y, z = 0) {
			let index = nearest_vertex(graph, [x, y, z]);
			return (index != null) ? Vertex(this, index) : undefined;
		};
		graph.nearestEdge = function(x, y, z = 0) {
			let index = nearest_edge(graph, [x, y, z]);
			return (index != null) ? Edge$1(this, index) : undefined;
		};
		graph.nearestFace = function(x, y, z = 0) {
			let index = face_containing_point(graph, [x, y, z]);
			return (index != null) ? Face(this, index) : undefined;
		};
		graph.vertex = function(index)   { return Vertex(this, index);   };
		graph.edge = function(index)     { return Edge$1(this, index);     };
		graph.face = function(index)     { return Face(this, index);     };
		graph.crease = function(indices) { return Crease(this, indices); };

		// todo: these create new Geometry objects each time, even if the CP hasn't changed
		Object.defineProperty(graph, "vertices", { get: function() {
			return this.vertices_coords == null
				? []
				: this.vertices_coords.map(v => Vector(v));
		}});
		Object.defineProperty(graph, "edges", { get: function() {
			return this.edges_vertices == null
				? []
				: this.edges_vertices
					.map(e => e.map(ev => this.vertices_coords[ev]))
					.map(e => Edge(e));
		}});
		Object.defineProperty(graph, "faces", { get: function() {
			return this.faces_vertices == null
				? []
				: this.faces_vertices
					.map(f => f.map(fv => this.vertices_coords[fv]))
					.map(f => Polygon(f));
		}});
		Object.defineProperty(graph, "boundary", { get: function() {
			// todo: this only works for unfolded flat crease patterns
			return Polygon(get_boundary_face(graph)
				.vertices
				.map(v => graph.vertices_coords[v])
			);
		}});

		graph.addVertexOnEdge = function(x, y, oldEdgeIndex) {
			add_vertex_on_edge(graph, x, y, oldEdgeIndex);
			if (typeof graph.onchange === "function") { graph.onchange(); }
		};
		graph.axiom1 = function() {
			let points = get_two_vec2$1(...arguments);
			if (!points) { throw {name: "TypeError", message: "axiom1 needs 2 points"}; }
			let crease = Crease(this, axiom1$1(graph, ...points));
			if (typeof graph.onchange === "function") { graph.onchange(); }
			return crease;
		};
		graph.axiom2 = function() {
			let points = get_two_vec2$1(...arguments);
			if (!points) { throw {name: "TypeError", message: "axiom2 needs 2 points"}; }
			let crease = Crease(this, axiom2$1(graph, ...points));
			if (typeof graph.onchange === "function") { graph.onchange(); }
			return crease;
		};
		graph.axiom3 = function() {
			let lines = get_two_lines(...arguments);
			if (!lines) { throw {name: "TypeError", message: "axiom3 needs 2 lines"}; }
			let crease = Crease(this, axiom3$1(graph, ...lines[0], ...lines[1]));
			if (typeof graph.onchange === "function") { graph.onchange(); }
			return crease;
		};
		graph.axiom4 = function() {
			let crease = Crease(this, axiom4$1(graph, arguments));
			if (typeof graph.onchange === "function") { graph.onchange(); }
			return crease;
		};
		graph.axiom5 = function() {
			let crease = Crease(this, axiom5$1(graph, arguments));
			if (typeof graph.onchange === "function") { graph.onchange(); }
			return crease;
		};
		graph.axiom6 = function() {
			let crease = Crease(this, axiom6$1(graph, arguments));
			if (typeof graph.onchange === "function") { graph.onchange(); }
			return crease;
		};
		graph.axiom7 = function() {
			let crease = Crease(this, axiom7$1(graph, arguments));
			if (typeof graph.onchange === "function") { graph.onchange(); }
			return crease;
		};
		graph.creaseRay = function() {
			let crease = Crease(this, creaseRay(graph, ...arguments));
			if (typeof graph.onchange === "function") { graph.onchange(); }
			return crease;
		};
		graph.creaseSegment = function() {
			let crease = Crease(this, creaseSegment(graph, ...arguments));
			if (typeof graph.onchange === "function") { graph.onchange(); }
			return crease;
		};
		graph.creaseThroughLayers = function(point, vector, face) {
			RabbitEar.fold.origami.crease_folded(graph, point, vector, face);
			if (typeof graph.onchange === "function") { graph.onchange(); }
		};
		graph.valleyFold = function(point, vector, stayVector, face_index) {
			crease_through_layers(graph, point, vector, stayVector, "V", face_index);
			if (typeof graph.onchange === "function") { graph.onchange(); }
		};
		graph.kawasaki = function() {
			let crease = Crease(this, kawasaki_collapse(graph, ...arguments));
			if (typeof graph.onchange === "function") { graph.onchange(); }
			return crease;
		};
		// getters, setters
		Object.defineProperty(graph, "json", { get: function() {
				let fold_file = Object.create(null);
				Object.assign(fold_file, graph);
				cpObjKeys.forEach(key => delete fold_file[key]);
				return JSON.parse(JSON.stringify(fold_file));
			}
		});
		Object.defineProperty(graph, "connectedGraphs", { get: function() {
				return connectedGraphs(graph);
			}
		});

		return graph;
	}

	// consider this: a crease can be an ARRAY of edges. 
	// this way one crease is one crease. it's more what a person expects.
	// one crease can == many edges.
	const Crease = function(_graph, _indices) {
		let graph = _graph; // pointer back to the graph;
		let indices = _indices; // indices of this crease in the graph

		const is_assignment = function(options) {
			return indices.map(index => options
					.map(l => l === graph.edges_assignment[index])
					.reduce((a,b) => a || b, false)
				).reduce((a,b) => a || b, false);
		};
		const is_mountain = function() { return is_assignment(["M", "m"]); };
		const is_valley = function() { return is_assignment(["V", "v"]); };

		const flip = function() {
			if (is_mountain()) { valley(); }
			else if (is_valley()) { mountain(); }
			else { return; } // don't trigger the callback
			if (typeof graph.onchange === "function") { graph.onchange(); }
		};
		const mountain = function() {
			indices.forEach(index => graph.edges_assignment[index] = "M");
			indices.forEach(index => graph.edges_foldAngle[index] = -180);
			if (typeof graph.onchange === "function") { graph.onchange(); }
		};
		const valley = function() {
			indices.forEach(index => graph.edges_assignment[index] = "V");
			indices.forEach(index => graph.edges_foldAngle[index] = 180);
			if (typeof graph.onchange === "function") { graph.onchange(); }
		};
		const mark = function() {
			indices.forEach(index => graph.edges_assignment[index] = "F");
			indices.forEach(index => graph.edges_foldAngle[index] = 0);
			if (typeof graph.onchange === "function") { graph.onchange(); }
		};
		const remove = function() { };
		// const addVertexOnEdge = function(x, y) {
		// 	let thisEdge = this.index;
		// 	graph.addVertexOnEdge(x, y, thisEdge);
		// }

		return {
			get index() { return _indices; },
			mountain,
			valley,
			mark,
			flip,
			get isMountain(){ return is_mountain(); },
			get isValley(){ return is_valley(); },
			remove
			// addVertexOnEdge
		};
	};

	const Edge$1 = function(_graph, _index) {
		let graph = _graph; // pointer back to the graph;
		let index = _index; // index of this crease in the graph

		let points = _graph.edges_vertices[_index]
			.map(ev => _graph.vertices_coords[ev]);
		let _e = Edge(points);

		const is_assignment = function(options) {
			return options.map(l => l === graph.edges_assignment[index])
				.reduce((a,b) => a || b, false);
		};
		const is_mountain = function() { return is_assignment(["M", "m"]); };
		const is_valley = function() { return is_assignment(["V", "v"]); };

		const flip = function() {
			if (is_mountain()) { valley(); }
			else if (is_valley()) { mountain(); }
			else { return; } // don't trigger the callback
			if (typeof graph.onchange === "function") { graph.onchange(); }
		};
		const mountain = function() {
			graph.edges_assignment[index] = "M";
			graph.edges_foldAngle[index] = -180;
			if (typeof graph.onchange === "function") { graph.onchange(); }
		};
		const valley = function() {
			graph.edges_assignment[index] = "V";
			graph.edges_foldAngle[index] = 180;
			if (typeof graph.onchange === "function") { graph.onchange(); }
		};
		const mark = function() {
			graph.edges_assignment[index] = "F";
			graph.edges_foldAngle[index] = 0;
			if (typeof graph.onchange === "function") { graph.onchange(); }
		};
		const addVertexOnEdge = function(x, y) {
			let thisEdge = this.index;
			graph.addVertexOnEdge(x, y, thisEdge);
		};

		Object.defineProperty(_e, "mountain", {value: mountain});
		Object.defineProperty(_e, "valley", {value: valley});
		Object.defineProperty(_e, "mark", {value: mark});
		Object.defineProperty(_e, "flip", {value: flip});
		Object.defineProperty(_e, "index", {
			get: function(){ return _index; }
		});
		Object.defineProperty(_e, "isMountain", {
			get: function(){ return is_mountain(); }
		});
		Object.defineProperty(_e, "isValley", {
			get: function(){ return is_valley(); }
		});
		// Object.defineProperty(_e, "remove", {value: remove});
		Object.defineProperty(_e, "addVertexOnEdge", {value: addVertexOnEdge});

		return _e;
	};

	const Vertex = function(_graph, _index) {

		let _v = Vector(_graph.vertices_coords[_index]);
		Object.defineProperty(_v, "index", {
			get: function(){ return _index; }
		});
		return _v;
	};

	const Face = function(_graph, _index) {

		let points = _graph.faces_vertices[_index]
			.map(fv => _graph.vertices_coords[fv]);
		let _f = Polygon(points);
		Object.defineProperty(_f, "index", {
			get: function(){ return _index; }
		});
		return _f;
	};

	const flatten_frame = function(fold_file, frame_num){
		const dontCopy = ["frame_parent", "frame_inherit"];
		var memo = {visited_frames:[]};
		function recurse(fold_file, frame, orderArray){
			if(memo.visited_frames.indexOf(frame) != -1){
				throw ".FOLD file_frames encountered a cycle. stopping.";
				return orderArray;
			}
			memo.visited_frames.push(frame);
			orderArray = [frame].concat(orderArray);
			if(frame == 0){ return orderArray; }
			if(fold_file.file_frames[frame - 1].frame_inherit &&
			   fold_file.file_frames[frame - 1].frame_parent != undefined){
				return recurse(fold_file, fold_file.file_frames[frame - 1].frame_parent, orderArray);
			}
			return orderArray;
		}
		return recurse(fold_file, frame_num, []).map(frame => {
			if(frame == 0){
				// for frame 0 (the key frame) don't copy over file_frames array
				let swap = fold_file.file_frames;
				fold_file.file_frames = null;
				let copy = JSON.parse(JSON.stringify(fold_file));
				fold_file.file_frames = swap;
				delete copy.file_frames;
				dontCopy.forEach(key => delete copy[key]);
				return copy;
			}
			let copy = JSON.parse(JSON.stringify(fold_file.file_frames[frame-1]));
			dontCopy.forEach(key => delete copy[key]);
			return copy;
		}).reduce((prev,curr) => Object.assign(prev,curr),{})
	};

	const merge_frame$1 = function(fold_file, frame){
		const dontCopy = ["frame_parent", "frame_inherit"];
		let copy = JSON.parse(JSON.stringify(frame));
		dontCopy.forEach(key => delete copy[key]);
		// don't deep copy file_frames. stash. bring them back.
		let swap = fold_file.file_frames;
		fold_file.file_frames = null;
		let fold = JSON.parse(JSON.stringify(fold_file));
		fold_file.file_frames = swap;
		delete fold.file_frames;
		// merge 2
		Object.assign(fold, frame);
		return fold;
	};

	var frame = /*#__PURE__*/Object.freeze({
		flatten_frame: flatten_frame,
		merge_frame: merge_frame$1
	});

	/**
	 * .FOLD file into SVG, and back
	 */

	const CREASE_DIR = {
		"B": "boundary", "b": "boundary",
		"M": "mountain", "m": "mountain",
		"V": "valley",   "v": "valley",
		"F": "mark",     "f": "mark",
		"U": "mark",     "u": "mark"
	};

	const boundary = function(graph) {
		let boundary = get_boundary_vertices(graph)
			.map(v => graph.vertices_coords[v]);
		return [polygon(boundary).setClass("boundary")];
	};

	const vertices = function(graph, options) {
		let radius = options && options.radius ? options.radius : 0.01;
		return graph.vertices_coords.map((v,i) =>
			circle(v[0], v[1], radius)
				.setClass("vertex")
				.setID(""+i)
		);
	};

	const creases = function(graph) {
		let edges = graph.edges_vertices
			.map(ev => ev.map(v => graph.vertices_coords[v]));
		let eAssignments = graph.edges_assignment.map(a => CREASE_DIR[a]);
		return edges.map((e,i) =>
			line$1(e[0][0], e[0][1], e[1][0], e[1][1])
				.setClass(eAssignments[i])
				.setID(""+i)
		);
	};

	const facesVertices = function(graph) {
		let fAssignments = graph.faces_vertices.map(fv => "face");
		let facesV = !(graph.faces_vertices) ? [] : graph.faces_vertices
			.map(fv => fv.map(v => graph.vertices_coords[v]));
			// .map(face => Geom.Polygon(face));
		// facesV = facesV.map(face => face.scale(0.6666));
		return facesV.filter(f => f != null).map((face, i) =>
			polygon(face)
				.setClass(fAssignments[i])
				.setID(""+i)
		);
	};

	const facesEdges = function(graph) {
		let fAssignments = graph.faces_vertices.map(fv => "face");
		let facesE = !(graph.faces_edges) ? [] : graph.faces_edges
			.map(face_edges => face_edges
				.map(edge => graph.edges_vertices[edge])
				.map((vi,i,arr) => {
					let next = arr[(i+1)%arr.length];
					return (vi[1] === next[0] || vi[1] === next[1]
						? vi[0] : vi[1]);
				}).map(v => graph.vertices_coords[v])
			);
			// .map(face => Geom.Polygon(face));
		// facesE = facesE.map(face => face.scale(0.8333));
		return facesE.filter(f => f != null).map((face, i) =>
			polygon(face)
				.setClass(fAssignments[i])
				.setID(""+i)
		);
	};

	function faces_sorted_by_layer(faces_layer) {
		return faces_layer.map((layer,i) => ({layer:layer, i:i}))
			.sort((a,b) => a.layer-b.layer)
			.map(el => el.i)
	}

	const foldedFaces = function(graph) {
		let facesV = graph.faces_vertices
			.map(fv => fv.map(v => graph.vertices_coords[v]));
			// .map(face => Geom.Polygon(face));
		let notMoving = folded.cp["re:faces_to_move"].indexOf(false);
		if (notMoving === -1) { notMoving = 0; }
		// if (graph["re:faces_coloring"] && graph["re:faces_coloring"].length > 0) {
		let coloring = faces_coloring(graph, notMoving);

		let order = graph["re:faces_layer"] != null
			? faces_sorted_by_layer(graph["re:faces_layer"])
			: graph.faces_vertices.map((_,i) => i);
		return order.map(i =>
			polygon(facesV[i])
				.setClass(coloring[i] ? "face-front" : "face-back")
				// .setClass(coloring[i] ? "face-front-debug" : "face-back-debug")
				.setID(""+i)
		);
		// if (graph["re:faces_layer"] && graph["re:faces_layer"].length > 0) {
		// 	return graph["re:faces_layer"].map((fi,i) =>
		// 		SVG.polygon(facesV[fi])
		// 			.setClass(i%2==0 ? "face-front" : "face-back")
		// 			.setID(""+i)
		// 	);
		// } else {
		// 	return facesV.map((face, i) =>
		// 		SVG.polygon(face)
		// 			.setClass("folded-face")
		// 			.setID(""+i)
		// 		);
		// }
	};

	/** .FOLD file viewer
	 * this is an SVG based front-end for the .fold file format
	 *  (.fold file spec: https://github.com/edemaine/fold)
	 *
	 *  View constructor arguments:
	 *   - fold file
	 *   - DOM object, or "string" DOM id to attach to
	 */

	const plural = { boundary: "boundaries", face: "faces", crease: "creases", vertex: "vertices" };

	function View2D() {

		let _this = image(...arguments);

		let groups = {};
		["boundary", "face", "crease", "vertex"].forEach(key =>
			groups[key] = _this.group().setID(plural[key])
		);
		let labels = {
			"boundary": _this.group(),
			"face": _this.group(),
			"crease": _this.group(),
			"vertex": _this.group()
		};

		let prop = {
			cp: undefined, 
			frame: undefined,
			style: {
				vertex_radius: 0.01 // percent of page
			},
		};

		let preferences = {
			autofit: true,
		};

		const setCreasePattern = function(cp) {
			// todo: check if cp is a CreasePattern type
			prop.cp = cp;
			draw();
			prop.cp.onchange = draw;
		};

		const drawFolded = function(graph) {
			foldedFaces(graph)
				.forEach(f => groups.face.appendChild(f));
		};

		const drawCreasePattern = function(graph) {
			let drawings = {
				boundary: boundary(graph),
				face: facesVertices(graph).concat(facesEdges(graph)),
				crease: creases(graph),
				vertex: vertices(graph)
			};
			Object.keys(drawings).forEach(key => 
				drawings[key].forEach(el => groups[key].appendChild(el))
			);

			// face dubug nubmers
			labels.face.removeChildren();
			let fAssignments = graph.faces_vertices.map(fv => "face");
			let facesText = !(graph.faces_vertices) ? [] : graph.faces_vertices
				.map(fv => fv.map(v => graph.vertices_coords[v]))
				.map(fv => ConvexPolygon(fv))
				.map(face => face.centroid)
				.map((c,i) => labels.face.text(""+i, c[0], c[1]));
			facesText.forEach(text$$1 => {
				text$$1.setAttribute("fill", "black");
				text$$1.setAttribute("style", "font-family: sans-serif; font-size:0.05px");
			});
		};

		const draw = function() {
			Object.keys(groups).forEach((key) => removeChildren(groups[key]));
			labels.face.removeChildren(); //todo remove
			// flatten if necessary
			let graph = prop.frame
				? flatten_frame(prop.cp, prop.frame)
				: prop.cp;
			if (graph.isFolded) {
				drawFolded(graph);
			} else{
				drawCreasePattern(graph);
			}
			if (preferences.autofit) { updateViewBox(); }
		};

		const updateViewBox = function() {
			let r = bounding_rect(prop.cp);
			setViewBox(_this, r[0], r[1], r[2], r[3]);
		};

		const showVertices = function(){ groups.vertex.removeAttribute("visibility");};
		const hideVertices = function(){ groups.vertex.setAttribute("visibility", "hidden");};
		const showEdges = function(){ groups.crease.removeAttribute("visibility");};
		const hideEdges = function(){ groups.crease.setAttribute("visibility", "hidden");};
		const showFaces = function(){ groups.face.removeAttribute("visibility");};
		const hideFaces = function(){ groups.face.setAttribute("visibility", "hidden");};

		const nearest = function() {
			let p = Vector(...arguments);
			let methods = {
				"vertex": prop.cp.nearestVertex,
				"crease": prop.cp.nearestEdge,
				"face": prop.cp.nearestFace,
			};
			let nearest = {};
			// fill the methods
			Object.keys(methods)
				.forEach(key => nearest[key] = methods[key].apply(prop.cp, p));
			Object.keys(methods)
				.filter(key => methods[key] == null)
				.forEach(key => delete methods[key]);
			Object.keys(nearest)
				.filter(key => nearest[key] != null)
				.forEach(key => nearest[key].svg = groups[key].childNodes[nearest[key].index]);
			return nearest;
		};

		const load$$1 = function(input, callback) { // epsilon
			load_fold(input, function(fold){
				setCreasePattern( CreasePattern(fold) );
				if (callback != null) { callback(); }
			});
		};

		const fold = function(face){
			let folded = fold_without_layering(prop.cp, face);
			setCreasePattern( CreasePattern(folded) );
		};

		Object.defineProperty(_this, "cp", {
			get: function() { return prop.cp; },
			set: function(cp) { setCreasePattern(cp); }
		});
		Object.defineProperty(_this, "frameCount", {
			get: function() { return prop.cp.file_frames ? prop.cp.file_frames.length : 0; }
		});
		Object.defineProperty(_this, "frame", {
			set: function(f) { prop.frame = f; draw(); },
			get: function() { return prop.frame; }
		});

		// attach CreasePattern methods
		["axiom1", "axiom2", "axiom3", "axiom4", "axiom5", "axiom6", "axiom7",
		 "crease"]
			.forEach(method => Object.defineProperty(_this, method, {
				value: function(){ return prop.cp[method](...arguments); }
			}));
		// attach CreasePattern getters
		["boundary", "vertices", "edges", "faces", "isFolded"]
			.forEach(method => Object.defineProperty(_this, method, {
				get: function(){
					let components = prop.cp[method];
					// components.forEach(c => c.svg = )
					return components;
				}
			}));

		Object.defineProperty(_this, "nearest", {value: nearest});
		Object.defineProperty(_this, "draw", { value: draw });
		Object.defineProperty(_this, "fold", { value: fold });
		Object.defineProperty(_this, "load", { value: load$$1 });
		Object.defineProperty(_this, "folded", { 
			set: function(f) {
				prop.cp.frame_classes = prop.cp.frame_classes
					.filter(a => a !== "creasePattern");
				prop.cp.frame_classes = prop.cp.frame_classes
					.filter(a => a !== "foldedState");
				prop.cp.frame_classes.push("foldedState");
				// todo re-call draw()
			}
		});
		Object.defineProperty(_this, "showVertices", { value: showVertices });
		Object.defineProperty(_this, "hideVertices", { value: hideVertices });
		Object.defineProperty(_this, "showEdges", { value: showEdges });
		Object.defineProperty(_this, "hideEdges", { value: hideEdges });
		Object.defineProperty(_this, "showFaces", { value: showFaces });
		Object.defineProperty(_this, "hideFaces", { value: hideFaces });


		_this.groups = groups;
		_this.labels = labels;


		_this.preferences = preferences;

		// boot
		setCreasePattern( CreasePattern(...arguments) );

		return _this;
	}

	/** .FOLD file viewer
	 * this is an THREE.js based front-end for the .fold file format
	 *  (.fold file spec: https://github.com/edemaine/fold)
	 *
	 *  View constructor arguments:
	 *   - fold file
	 *   - DOM object, or "string" DOM id to attach to
	 */

	// import { unitSquare } from "./OrigamiBases"
	const unitSquare = {"file_spec":1.1,"file_creator":"","file_author":"","file_classes":["singleModel"],"frame_title":"","frame_attributes":["2D"],"frame_classes":["creasePattern"],"vertices_coords":[[0,0],[1,0],[1,1],[0,1]],"vertices_vertices":[[1,3],[2,0],[3,1],[0,2]],"vertices_faces":[[0],[0],[0],[0]],"edges_vertices":[[0,1],[1,2],[2,3],[3,0]],"edges_faces":[[0],[0],[0],[0]],"edges_assignment":["B","B","B","B"],"edges_foldAngle":[0,0,0,0],"edges_length":[1,1,1,1],"faces_vertices":[[0,1,2,3]],"faces_edges":[[0,1,2,3]]};

	function View3D(){

		//  from arguments, get a fold file, if it exists
		let args = Array.from(arguments);
		let _cp = args.filter(arg =>
			typeof arg == "object" && arg.vertices_coords != undefined
		).shift();
		if(_cp == undefined){ _cp = unitSquare; }


		let allMeshes = [];
		let scene = new THREE.Scene();
		let _parent;

		function bootThreeJS(domParent){
			var camera = new THREE.PerspectiveCamera(45, domParent.clientWidth/domParent.clientHeight, 0.1, 1000);
			var controls = new THREE.OrbitControls(camera, domParent);
			camera.position.set(0.5, 0.5, 1.5);
			controls.target.set(0.5, 0.5, 0.0);
			// camera.position.set(0.0, 0.0, 1.5 );
			// controls.target.set(0.0, 0.0, 0.0);
			controls.addEventListener('change', render);
			var renderer = new THREE.WebGLRenderer({antialias:true});
			renderer.setClearColor("#FFFFFF");
			renderer.setSize(domParent.clientWidth, domParent.clientHeight);
			domParent.appendChild(renderer.domElement);
			// shining from below
			var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.2);
			directionalLight2.position.set(20, 20, -100);
			scene.add(directionalLight2);
			// above
			var spotLight1 = new THREE.SpotLight(0xffffff, 0.3);
			spotLight1.position.set(50, -200, 100);
			scene.add(spotLight1);
			var spotLight2 = new THREE.SpotLight(0xffffff, 0.3);
			spotLight2.position.set(100, 50, 200);
			scene.add(spotLight2);
			var ambientLight = new THREE.AmbientLight(0xffffff, 0.48);
			scene.add(ambientLight);

			var render = function(){
				requestAnimationFrame(render);
				renderer.render(scene, camera);
				controls.update();
			};
			render();

			draw();
		}

		// after page load, find a parent element for the new SVG in the arguments
		const attachToDOM = function(){
			let functions = args.filter((arg) => typeof arg === "function");
			let numbers = args.filter((arg) => !isNaN(arg));
			let element = args.filter((arg) =>
					arg instanceof HTMLElement)
				.shift();
			let idElement = args.filter((a) =>
					typeof a === "string" || a instanceof String)
				.map(str => document.getElementById(str))
				.shift();
			_parent = (element != null
				? element
				: (idElement != null
					? idElement
					: document.body));
			bootThreeJS(_parent);
			if(numbers.length >= 2){
				_svg.setAttributeNS(null, "width", numbers[0]);
				_svg.setAttributeNS(null, "height", numbers[1]);
			} 
			if(functions.length >= 1){
				functions[0]();
			}
		};


		if(document.readyState === 'loading') {
			// wait until after the <body> has rendered
			document.addEventListener('DOMContentLoaded', attachToDOM);
		} else {
			attachToDOM();
		}


		function draw(){
			var material = new THREE.MeshPhongMaterial({
				color: 0xffffff,
				side: THREE.DoubleSide,
				flatShading:true,
				shininess:0,
				specular:0xffffff,
				reflectivity:0
			});
			let faces = foldFileToThreeJSFaces(_cp, material);
			let lines = foldFileToThreeJSLines(_cp);
			allMeshes.forEach(mesh => scene.remove(mesh));
			allMeshes = [];
			allMeshes.push(faces);
			allMeshes.push(lines);
			allMeshes.forEach(mesh => scene.add(mesh));
		}


		const load = function(input, callback){ // epsilon
			// are they giving us a filename, or the data of an already loaded file?
			if (typeof input === 'string' || input instanceof String){
				let extension = input.substr((input.lastIndexOf('.') + 1));
				// filename. we need to upload
				switch(extension){
					case 'fold':
					fetch(input)
						.then((response) => response.json)
						.then((data) => {
							_cp = data;
							draw();
							if(callback != undefined){ callback(_cp); }
						});
					// return this;
				}
			}
			try{
				// try .fold file format first
				let foldFileImport = JSON.parse(input);
				_cp = foldFileImport;
				// return this;
			} catch(err){
				console.log("not a valid .fold file format");
				// return this;
			}
		};

		const getFrames = function(){ return _cp.file_frames; };
		const getFrame = function(index){ return _cp.file_frames[index]; };
		const setFrame = function(index){
			draw();
		};


		// return Object.freeze({
		return {
			set cp(c){
				_cp = c;
				draw();
			},
			get cp(){
				return _cp;
			},
			draw,
			load,
			getFrames,
			getFrame,
			setFrame,
		// });
		};




		function foldFileToThreeJSFaces(foldFile, material){
			
			var geometry = new THREE.BufferGeometry();
			let vertices = foldFile.vertices_coords
				.map(v => [v[0], v[1], (v[2] != undefined ? v[2] : 0)])
				.reduce((prev,curr) => prev.concat(curr), []);
			let normals = foldFile.vertices_coords
				.map(v => [0,0,1])
				.reduce((prev,curr) => prev.concat(curr), []);
			let colors = foldFile.vertices_coords
				.map(v => [1,1,1])
				.reduce((prev,curr) => prev.concat(curr), []);
			let faces = foldFile.faces_vertices
				.map(fv => fv.map((v,i,arr) => [arr[0], arr[i+1], arr[i+2]])
				             .slice(0, fv.length-2))
				.reduce((prev,curr) => prev.concat(curr), [])
				.reduce((prev,curr) => prev.concat(curr), []);

			geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
			geometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
			geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
			geometry.setIndex(faces);

			if(material == undefined){ material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide}); }
			return new THREE.Mesh(geometry, material);
		}

		function crossVec3(a,b){
			return [
				a[1]*b[2] - a[2]*b[1],
				a[2]*b[0] - a[0]*b[2],
				a[0]*b[1] - a[1]*b[0]
			];
		}
		function magVec3(v){
			return Math.sqrt(Math.pow(v[0],2) + Math.pow(v[1],2) + Math.pow(v[2],2));
		}
		function normalizeVec3(v){
			let mag = Math.sqrt(Math.pow(v[0],2) + Math.pow(v[1],2) + Math.pow(v[2],2));
			return [v[0] / mag, v[1] / mag, v[2] / mag];
		}
		function scaleVec3(v, scale){
			return [v[0]*scale, v[1]*scale, v[2]*scale];
		}

		function cylinderEdgeVertices(edge, radius){
			// normalized edge vector
			let vec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1], edge[1][2] - edge[0][2]];
			let mag = Math.sqrt(Math.pow(vec[0],2) + Math.pow(vec[1],2) + Math.pow(vec[2],2));
			if(mag < 1e-10){ throw "degenerate edge"; }
			let normalized = [vec[0] / mag, vec[1] / mag, vec[2] / mag];
			let perp = [
				normalizeVec3(crossVec3(normalized, [1,0,0])),
				normalizeVec3(crossVec3(normalized, [0,1,0])),
				normalizeVec3(crossVec3(normalized, [0,0,1]))
			].map((v,i) => ({i:i, v:v, mag:magVec3(v)}))
			 .filter(v => v.mag > 1e-10)
			 .map(obj => obj.v)
			 .shift();
			let rotated = [perp];
			for(var i = 1; i < 4; i++){
				rotated.push(normalizeVec3(crossVec3(rotated[i-1], normalized)));
			}
			let dirs = rotated.map(v => scaleVec3(v, radius));
			return edge
				.map(v => dirs.map(dir => [v[0]+dir[0], v[1]+dir[1], v[2]+dir[2]]))
				.reduce((prev,curr) => prev.concat(curr), []);
		}

		function foldFileToThreeJSLines(foldFile, scale=0.005){
			let edges = foldFile.edges_vertices.map(ev => ev.map(v => foldFile.vertices_coords[v]));
			// make sure they all have a z component. when z is implied it's 0
			edges.forEach(edge => {
				if(edge[0][2] == undefined){ edge[0][2] = 0; }
				if(edge[1][2] == undefined){ edge[1][2] = 0; }
			});

			let colorAssignments = {
				"B": [0.0,0.0,0.0],
				// "M": [0.9,0.31,0.16],
				"M": [0.6,0.2,0.11],
				"F": [0.25,0.25,0.25],
				"V": [0.12,0.35,0.50]
			};

			let colors = foldFile.edges_assignment.map(e => 
				[colorAssignments[e], colorAssignments[e], colorAssignments[e], colorAssignments[e],
				colorAssignments[e], colorAssignments[e], colorAssignments[e], colorAssignments[e]]
			).reduce((prev,curr) => prev.concat(curr), [])
			 .reduce((prev,curr) => prev.concat(curr), [])
			 .reduce((prev,curr) => prev.concat(curr), []);

			let vertices = edges
				.map(edge => cylinderEdgeVertices(edge, scale))
				.reduce((prev,curr) => prev.concat(curr), [])
				.reduce((prev,curr) => prev.concat(curr), []);

			let normals = edges.map(edge => {
				// normalized edge vector
				let vec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1], edge[1][2] - edge[0][2]];
				let mag = Math.sqrt(Math.pow(vec[0],2) + Math.pow(vec[1],2) + Math.pow(vec[2],2));
				if(mag < 1e-10){ throw "degenerate edge"; }
				let c0 = scaleVec3(normalizeVec3(crossVec3(vec, [0,0,-1])), scale);
				let c1 = scaleVec3(normalizeVec3(crossVec3(vec, [0,0,1])), scale);
				return [
					c0, [-c0[2], c0[1], c0[0]],
					c1, [-c1[2], c1[1], c1[0]],
					c0, [-c0[2], c0[1], c0[0]],
					c1, [-c1[2], c1[1], c1[0]]
				]
			}).reduce((prev,curr) => prev.concat(curr), [])
			  .reduce((prev,curr) => prev.concat(curr), []);

			let faces = edges.map((e,i) => [
				// 8 triangles making the long cylinder
				i*8+0, i*8+4, i*8+1,
				i*8+1, i*8+4, i*8+5,
				i*8+1, i*8+5, i*8+2,
				i*8+2, i*8+5, i*8+6,
				i*8+2, i*8+6, i*8+3,
				i*8+3, i*8+6, i*8+7,
				i*8+3, i*8+7, i*8+0,
				i*8+0, i*8+7, i*8+4,
				// endcaps
				i*8+0, i*8+1, i*8+3,
				i*8+1, i*8+2, i*8+3,
				i*8+5, i*8+4, i*8+7,
				i*8+7, i*8+6, i*8+5,
			]).reduce((prev,curr) => prev.concat(curr), []);

			var geometry = new THREE.BufferGeometry();
			geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
			geometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
			geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
			geometry.setIndex(faces);
			geometry.computeVertexNormals();

			var material = new THREE.MeshToonMaterial( {
					shininess: 0,
					side: THREE.DoubleSide, vertexColors: THREE.VertexColors
			} );
			return new THREE.Mesh(geometry, material);
		}


	}

	// function that adds a frame onto the fold file - 
	// makes it a parent relationship to the keyframe,
	// removes all edge mappings, rebuilds faces.
	// @returns {number} new frame number (array index + 1)
	// no
	// returns {fold_frame} object
	function make_folded_frame(fold, parent_frame = 0, root_face){
		// todo, make it so parent_frame actually goes and gets data from that frame

		// remove_flat_creases(fold);
		// for every vertex, give me an index to a face which it's found in
		let vertex_in_face = fold.vertices_coords.map((v,i) => {
			for(var f = 0; f < fold.faces_vertices.length; f++){
				if(fold.faces_vertices[f].includes(i)){ return f; }
			}
		});
		let faces_matrix = Graph.make_faces_matrix(fold, root_face);
		// let inverseMatrices = faces_matrix.map(n => Geom.core.make_matrix2_inverse(n));
		let new_vertices_coords = fold.vertices_coords.map((point,i) =>
			Geom.core.multiply_vector2_matrix2(point, faces_matrix[vertex_in_face[i]])
				.map((n) => Geom.core.clean_number(n, 14))
		);
		return {
			"frame_classes": ["foldedState"],
			"frame_parent": parent_frame,
			"frame_inherit": true,
			"vertices_coords": new_vertices_coords,
			"re:faces_matrix": faces_matrix
		};
	}

	function make_unfolded_frame(fold, parent_frame = 0, root_face){
		// todo, make it so parent_frame actually goes and gets data from that frame

		// remove_flat_creases(fold);
		// for every vertex, give me an index to a face which it's found in
		let vertex_in_face = fold.vertices_coords.map((v,i) => {
			for(var f = 0; f < fold.faces_vertices.length; f++){
				if(fold.faces_vertices[f].includes(i)){ return f; }
			}
		});
		let faces_matrix = Graph.make_faces_matrix(fold, root_face);
		// let inverseMatrices = faces_matrix.map(n => Geom.core.make_matrix2_inverse(n));
		let new_vertices_coords = fold.vertices_coords.map((point,i) =>
			Geom.core.multiply_vector2_matrix2(point, faces_matrix[vertex_in_face[i]])
				.map((n) => Geom.core.clean_number(n, 14))
		);
		return {
			"frame_classes": ["creasePattern"],
			"frame_parent": parent_frame,
			"frame_inherit": true,
			"vertices_coords": new_vertices_coords,
			"re:faces_matrix": faces_matrix
		};
	}

	function crease_through_layers$1(fold_file, linePoint, lineVector){
		// console.log("+++++++++++++++++++");
		// let root_face = faces_containing_point(fold_file, linePoint).shift();
		let root_face = 0;
		// console.log("fold_file", fold_file);
		let fold = clone(fold_file);
		// console.log("faces 1", fold.faces_vertices);

		let folded_frame = make_folded_frame(fold, 1, root_face);
		// console.log("folded_frame", folded_frame);
		let folded = merge_frame(fold, folded_frame);
		// console.log("folded", folded);
		// console.log("folded", folded.faces_edges);
		// console.log("folded", folded);
		let creased = clip_edges_with_line(folded, linePoint, lineVector);
		let migration = creased["re:diff"];
		// console.log("migration", migration);

		//////////////////////////////////
		// wait, can we retain a mapping of the old faces_vertices to the old faces, then just transform using the old faces.
		let vertex_in_face = creased.vertices_coords.map((v,i) => {
			for(var f = 0; f < creased.faces_vertices.length; f++){
				if(creased.faces_vertices[f].includes(i)){ return f; }
			}
		});
		// console.log("migration.faces", migration.faces);
		let faces_matrix = creased["re:faces_matrix"];
		let new_vertices_coords = creased.vertices_coords.map((point,i) =>
			Geom.core.multiply_vector2_matrix2(point, Geom.core.make_matrix2_inverse(faces_matrix[migration.faces[vertex_in_face[i]]]))
				.map((n) => Geom.core.clean_number(n))
		);
		//////////////////////////////////
		// let unfolded_frame = make_unfolded_frame(creased, 0, root_face);
		// console.log("unfolded_frame", unfolded_frame);
		let unfolded = merge_frame(creased, {
			"frame_classes": ["creasePattern"],
			"frame_parent": 0,
			"frame_inherit": true,
			"vertices_coords": new_vertices_coords,
			"re:faces_matrix": faces_matrix
		});
		// console.log("unfolded", unfolded);

		// console.log("faces 2", unfolded.faces_vertices);

		delete unfolded.faces_edges;
		delete unfolded.faces_layer;
		delete unfolded.frame_inherit;
		delete unfolded.frame_parent;

		unfolded.file_frames = [ make_folded_frame(unfolded, 0, 1) ];

		return unfolded;
	}


	// i want my fold operation to be as simple (in code) as this
	// - fold the faces
	// - use the crease line to chop all faces (adding a mark line)
	// - unfold all the faces.
	// but to do this it won't work unless you unfold using the original
	// mapping of faces and transformations, as there are now new faces


	// let migration_object = {
	// 	vertices_: [0, 1, 2, 5, 5, 3, 4, 6, 6],
	// 	faces_: []
	// }

	// let migration_object = {
	// 	vertices_: [false, false, false, false, false, true, true, true]
	//  edges_: [0, 1, 2, null, 3, ]
	// }

	// edges change: remove edge 2 turns into 2 edges, appended to end
	//  [a, b,  c,  d, e, f]        -- before
	//  [a, b,  d,  e, f, g, h]     -- after (remove edge, 2, replcae with 2 new)
	//  [0, 1,  3,  4, 5, 2, 2]     -- these is a changelog for the old array

	// faces change: same as edge

	/** clip a line in all the faces of a fold file. */
	// todo: this is broken now read the comment at the bottom
	function clip_edges_with_line(fold, linePoint, lineVector){
		// console.log("+++++++++++++++++++++++");
		let fold_new = fold;//clone(fold);
		fold.edges_vertices.forEach((ev,i) => {
			let key = ev.sort( (a,b) => a-b ).join(' ');
		});
		// console.log("edge_map", edge_map);

		// 1. find all edge-crossings and vertex-crossings
		let vertices_length = fold_new.vertices_coords.length;
		let vertices_intersections = fold_new.vertices_coords
			.map(v => Geom.core.intersection.point_on_line(linePoint, lineVector, v));
		let edges_intersections = fold_new.edges_vertices
			.map(ev => ev.map(v => fold_new.vertices_coords[v]))
			.map((edge, i) => {
				let intersection = Geom.core.intersection.line_edge_exclusive(linePoint, lineVector, edge[0], edge[1]);
				let new_index = (intersection == null ? vertices_length : vertices_length++);
				return {
					point: intersection,
					vertices: fold_new.edges_vertices[i], // shallow copy to fold file
					new_index: new_index
				};
			});

		// 2. first fold modification: add new vertices to vertex_ arrays
		let new_vertices = edges_intersections
			.filter(el => el.point != null)
			.map(el => el.point);

		// 
		let vertices_diff = fold_new.vertices_coords
			.map(v => false)
			.concat(new_vertices.map(v => true));
		// console.log("vertices_diff", vertices_diff);

		fold_new.vertices_coords = fold_new.vertices_coords
			.concat(new_vertices);

		// add new edges to edges_ arrays

		// rebuild edges
		// an edge is clipped, creating 2 edges sharing 1 new vertex
		// 
		// edges_replacement: edges_-indexed objects:
		//  { edges: (2) edges which replace this edge,
		//    vertices: (3) 1 and 2 relate to edge 1 and 2. 3 is the new one
		//  }

		let edges_replacement = edges_intersections
			.map((sect, i) => {
				if (sect.point == null) { return null; }
				let a = [fold_new.edges_vertices[i][0], sect.new_index];
				let b = [fold_new.edges_vertices[i][1], sect.new_index];
				return {
					edges: Graph.replace_edge(fold_new, i, a, b),
					vertices:[a[0], b[0], sect.new_index]
				};
			});

		// console.log("edges_replacement", edges_replacement);

		// let two_vertex_with_intersection = {
		// 	"0 2" : new_v_i,
		// 	"5 7" : new_v_i,
		// 	"20 8" : new_v_i
		// }
		// let old_edge_with_intersection = {
		// 	"1" : new_v_i,
		// 	"4" : new_v_i,
		// 	"5" : new_v_i
		// }

		// let new_face_parts = [
		// 	undefined,
		// 	{}
		// ]

		// console.log("fold_new.faces_edges", fold_new.faces_edges);

		// make sure faces edges is built
		// fold_new.faces_edges
		// faces_-indexed has a face been chopped? objects:
		// { edges: (0,1,2) of its edges were chopped,
		//   vertices: (0,1,2) of its vertices was crossed by an edge
		//  }
		// these "edges" objects are
		let faces_intersections = fold_new.faces_vertices.map((face_v, face_i) => {
			let verts = face_v
				.map(v => ({intersection: vertices_intersections[v], v: v}))
				.filter(el => el.intersection)
				.map(el => el.v);
			let edges = fold_new.faces_edges[face_i]
				.map(face_e => {
					let e = edges_replacement[face_e];
					if (e == null) { return undefined; }
					e.old_edge = face_e;
					return e;
				})
				.filter(el => el != null);
			return {vertices:verts, edges:edges};
		});

		// console.log("faces_intersections", faces_intersections);

		// we don't do anything with this until later
		let faces_to_modify = faces_intersections.map(el => {
			if(el.edges.length == 2){ return el; }
			if(el.vertices.length == 1 && el.edges.length == 1){ return el; }
			return undefined;
		});

		// console.log("faces_to_modify", faces_to_modify);

		// two_edges_faces: face-indexed, which 
		let two_edges_faces = faces_intersections.map(el => {
			if(el.edges.length == 2){ return el; }
			return undefined;
		}).map(el => el != null ? el.edges : undefined);
		let point_edge_faces = faces_intersections.map(el => {
			if(el.vertices.length == 1 && el.edges.length == 1){ return el; }
			return undefined;
		}).map(el => el != null ? el.vertices : undefined);

		// console.log("two_edges_faces", two_edges_faces);

		let new_edges_vertices = [];
		let faces_substitution = [];
		// console.log("-------- inside faces loop");
		two_edges_faces
			.map((edges,i) => ({edges:edges, i:i}))
			.filter(el => el.edges != null)
			.forEach(el => {
				let face_index = el.i;
				let chop_edges = el.edges;
				let edge_keys = el.edges.map(e => ({
						key: e.vertices.slice(0, 2).sort((a,b) => a-b).join(' '), 
						new_v: e.vertices[2]
					})
				);
				let faces_edges_keys = fold_new.faces_vertices[face_index]
					.map((fv,i,arr) => [fv, arr[(i+1)%arr.length]])
					// .map((ev,i) => ({ev: ev.sort((a,b) => a-b).join(' '), i: i}))
					.map((ev,i) => ev.sort((a,b) => a-b).join(' '));
				// console.log("faces_edges_keys", faces_edges_keys);
				// faces_edges_keys.forEach(fkey => console.log(edge_map[fkey]));
				let found_indices = edge_keys
					.map(el => ({
						found: faces_edges_keys.indexOf(el.key),
						new_v: el.new_v
					})
				);
				let sorted_found_indices = found_indices.sort((a,b) => a.found-b.found);
				// console.log("sorted_found_indices", sorted_found_indices);
				// face a
				let face_a = fold_new.faces_vertices[face_index]
					.slice(sorted_found_indices[1].found+1);
				face_a = face_a.concat(fold_new.faces_vertices[face_index]
					.slice(0, sorted_found_indices[0].found+1)
				);
				face_a.push(sorted_found_indices[0].new_v);
				face_a.push(sorted_found_indices[1].new_v);
				// face b
				let face_b = fold_new.faces_vertices[face_index]
					.slice(sorted_found_indices[0].found+1, sorted_found_indices[1].found+1);
				face_b.push(sorted_found_indices[1].new_v);
				face_b.push(sorted_found_indices[0].new_v);
				// add things onto the graph
				new_edges_vertices.push([
					sorted_found_indices[0].new_v,
					sorted_found_indices[1].new_v
				]);
				faces_substitution[face_index] = [face_a, face_b];
				// faces_substitution.push(face_b);
			});

		// console.log("new_edges_vertices", new_edges_vertices);
		// console.log("faces_substitution", faces_substitution);

		// fold_new.edges_vertices = fold_new.edges_vertices.concat(new_edges_vertices);
		// fold_new.faces_vertices = fold_new.faces_vertices.concat(faces_substitution);

		new_edges_vertices.forEach(ev => Graph.add_edge(fold_new, ev, "F"));

		let new_faces_map = faces_substitution
			.map((faces,i) => ({faces:faces, i:i}))
			.filter(el => el.faces != null)
			.map(el => el.faces
				.map(face => ({
					old: el.i,
					new: Graph.replace_face(fold_new, el.i, face)
				})
			)).reduce((prev,curr) => prev.concat(curr));

		// clean components
		let vertices_to_remove = fold_new.vertices_coords
			.map((vc,i) => vc == null ? i : undefined)
			.filter(el => el != null);
		let edges_to_remove = fold_new.edges_vertices
			.map((ev,i) => ev == null ? i : undefined)
			.filter(el => el != null);
		// let faces_to_remove = faces_to_modify
		// 	.map((el,i) => (el != null) ? i : undefined)
		// 	.filter(el => el != null);
		let faces_to_remove = fold_new.faces_vertices
			.map((fv,i) => fv == null ? i : undefined)
			.filter(el => el != null);

		// console.log("new_faces_map", new_faces_map);
		// console.log("vertices_to_remove", vertices_to_remove);
		// console.log("edges_to_remove", edges_to_remove);
		// console.log("faces_to_remove", faces_to_remove);

	//  [a, b,  c,  d, e, f]        -- before
	//  [a, b,  d,  e, f, g, h]     -- after (remove edge, 2, replcae with 2 new)
	//  [0, 1,  3,  4, 5, 2, 2]     -- these is a changelog for the old array

		let edges_diff = fold_new.edges_vertices.map((v,i) => i);
		edges_replacement.forEach((record, old_edge) => {
			if(record != null){
				record.edges.forEach(new_index =>
					edges_diff[new_index] = old_edge
				);
			}
		});

		let faces_diff = fold_new.faces_vertices.map((v,i) => i);
		new_faces_map.forEach(el => faces_diff[el.new] = el.old);
		// console.log("new_faces_map", new_faces_map);

		// todo: each of these return values has been switched inside these functions
		// from the array of booleans to the array of maps.
		// to get this working again we need to switch those back
		let vertices_removes = Graph.remove_vertices(fold_new, vertices_to_remove);
		let edges_removes = Graph.remove_edges(fold_new, edges_to_remove);
		let faces_removes = Graph.remove_faces(fold_new, faces_to_remove);

		// console.log("faces_diff before:", faces_diff.slice());

		vertices_diff = vertices_diff.filter((v,i) => !vertices_removes[i]);
		edges_diff = edges_diff.filter((e,i) => !edges_removes[i]);
		faces_diff = faces_diff.filter((e,i) => !faces_removes[i]);

		fold_new["re:diff"] = {
			vertices: vertices_diff,
			edges: edges_diff,
			faces: faces_diff
		};
		return fold_new
	}

	var creasethrough = /*#__PURE__*/Object.freeze({
		make_folded_frame: make_folded_frame,
		make_unfolded_frame: make_unfolded_frame,
		crease_through_layers: crease_through_layers$1,
		clip_edges_with_line: clip_edges_with_line
	});

	var empty = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [],\n\t\"frame_title\": \"\",\n\t\"frame_attributes\": [],\n\t\"frame_classes\": [],\n\t\"vertices_coords\": [],\n\t\"vertices_vertices\": [],\n\t\"vertices_faces\": [],\n\t\"edges_vertices\": [],\n\t\"edges_faces\": [],\n\t\"edges_assignment\": [],\n\t\"edges_foldAngle\": [],\n\t\"edges_length\": [],\n\t\"faces_vertices\": [],\n\t\"faces_edges\": [],\n\t\"edgeOrders\": [],\n\t\"faceOrders\": [],\n\t\"file_frames\": []\n}";

	var book = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"\",\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [[0,0], [0.5,0], [1,0], [1,1], [0.5,1], [0,1]],\n\t\"vertices_vertices\": [[1,5], [2,4,0], [3,1], [4,2], [5,1,3], [0,4]],\n\t\"vertices_faces\": [[0], [0,1], [1], [1], [1,0], [0]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [1,4]],\n\t\"edges_faces\": [[0], [1], [1], [1], [0], [0], [0,1]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"V\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 180],\n\t\"edges_length\": [0.5, 0.5, 1, 0.5, 0.5, 1, 1],\n\t\"faces_vertices\": [[1,4,5,0], [4,1,2,3]],\n\t\"faces_edges\": [[6,4,5,0], [6,1,2,3]]\n}";

	var blintz = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"blintz base\",\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [[0,0], [0.5,0], [1,0], [1,0.5], [1,1], [0.5,1], [0,1], [0,0.5]],\n\t\"vertices_vertices\": [[1,7], [2,3,7,0], [3,1], [4,5,1,2], [5,3], [6,7,3,4], [7,5], [0,1,5,6]],\n\t\"vertices_faces\": [[0], [1,4,0], [1], [2,4,1], [2], [3,4,2], [3], [0,4,3]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,0], [1,3], [3,5], [5,7], [7,1]],\n\t\"edges_faces\": [[0], [1], [1], [2], [2], [3], [3], [0], [1,4], [2,4], [3,4], [0,4]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"V\",\"V\",\"V\",\"V\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n\t\"edges_length\": [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.707106781186548, 0.707106781186548, 0.707106781186548, 0.707106781186548],\n\t\"faces_vertices\": [[0,1,7], [2,3,1], [4,5,3], [6,7,5], [1,3,5,7]],\n\t\"faces_edges\": [[0,11,7], [2,8,1], [4,9,3], [6,10,5], [8,9,10,11]],\n\t\"file_frames\": [{\n\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\"frame_parent\": 0,\n\t\t\"frame_inherit\": true,\n\t\t\"vertices_coords\": [[0.5,0.5], [0.5,0.0], [0.5,0.5], [1.0,0.5], [0.5,0.5], [0.5,1.0], [0.5,0.5], [0.0,0.5]],\n\t\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 180, 180, 180, 180],\n\t\t\"faceOrders\": [[0,4,1], [1,4,1], [2,4,1], [3,4,1]]\n\t}]\n}";

	var kite = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"kite base\",\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [[0,0], [0.414213562373095,0], [1,0], [1,0.585786437626905], [1,1], [0,1]],\n\t\"vertices_vertices\": [[1,5], [2,5,0], [3,5,1], [4,5,2], [5,3], [0,1,2,3,4]],\n\t\"vertices_faces\": [[0], [1,0], [2,1], [3,2], [3], [0,1,2,3]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [5,1], [3,5], [5,2]],\n\t\"edges_faces\": [[0], [1], [2], [3], [3], [0], [0,1], [3,2], [1,2]],\n\t\"edges_assignment\": [\"B\", \"B\", \"B\", \"B\", \"B\", \"B\", \"V\", \"V\", \"F\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 0],\n\t\"edges_length\": [0.414213562373095, 0.585786437626905, 0.585786437626905, 0.414213562373095, 1, 1, 1.082392200292394, 1.082392200292394, 1.414213562373095],\n\t\"faces_vertices\": [[0,1,5], [1,2,5], [2,3,5], [3,4,5]],\n\t\"faces_edges\": [[0,6,5], [1,8,6], [2,7,8], [3,4,7]],\n\t\"file_frames\": [{\n\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\"frame_parent\": 0,\n\t\t\"frame_inherit\": true,\n\t\t\"vertices_coords\": [[0.707106781186548,0.292893218813452],[1,0],[0.707106781186548,0.292893218813452],[0,1],[0.414213562373095,0],[1,0.585786437626905]],\n\t\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 180, 180, 0],\n\t\t\"faceOrders\": [[0,1,1], [3,2,1]]\n\t}]\n}";

	var fish = "{\n\t\"this base is broken\": true,\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"\",\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [[0,0],[1,0],[1,1],[0,1],[0.292893218813452,0.292893218813452],[0.707106781186548,0.707106781186548],[0.292893218813452,0],[1,0.707106781186548]],\n\t\"vertices_vertices\": [[6,4,3],[7,5,3,4,6],[3,5,7],[0,4,1,5,2],[0,6,2,3],[1,7,2,3],[1,4,0],[2,5,1]],\n\t\"vertices_faces\":[[1,4],[2,3,5,6],[0,7],[0,1,2,3],[1,3,4,5],[0,2,6,7],[4,5],[6,7]],\n\t\"edges_vertices\": [[2,3],[3,0],[3,1],[0,4],[1,4],[3,4],[1,5],[2,5],[3,5],[4,6],[0,6],[6,1],[5,7],[1,7],[7,2]],\n\t\"edges_faces\":[[0],[0,2],[0,7],[1],[1,4],[1,3],[2,3],[2,6],[3,5],[4],[4,5],[5],[6],[6,7],[7]],\n\t\"edges_length\": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\n\t\"edges_foldAngle\": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\n\t\"edges_assignment\": [\"B\",\"B\",\"F\",\"M\",\"M\",\"M\",\"M\",\"M\",\"M\",\"V\",\"B\",\"B\",\"V\",\"B\",\"B\"],\n\t\"faces_vertices\": [[2,3,5],[3,0,4],[3,1,5],[1,3,4],[4,0,6],[1,4,6],[5,1,7],[2,5,7]],\n\t\"faces_edges\": [[0,8,7],[1,3,5],[2,6,8],[2,5,4],[3,10,9],[4,9,11],[6,13,12],[7,12,14]],\n\t\"file_frames\": [{\n\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\"frame_parent\": 0,\n\t\t\"frame_inherit\": true,\n\t\t\"vertices_coords\": [[0.707106781186548,0.292893218813452],[1,0],[0.707106781186548,0.292893218813452],[0,1],[0.292893218813452,0.292893218813452],[0.707106781186548,0.707106781186548],[0.5,0.5],[0.5,0.5]]\n\t}]\n}";

	var bird = "{\n\t\"file_spec\": 1.1,\n\t\"frame_title\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [[0,0],[1,0],[1,1],[0,1],[0.5,0.5],[0.207106781186548,0.5],[0.5,0.207106781186548],[0.792893218813452,0.5],[0.5,0.792893218813452],[0.353553390593274,0.646446609406726],[0.646446609406726,0.646446609406726],[0.646446609406726,0.353553390593274],[0.353553390593274,0.353553390593274],[0,0.5],[0.5,0],[1,0.5],[0.5,1]],\n\t\"edges_vertices\": [[3,5],[5,9],[3,9],[3,13],[5,13],[0,5],[0,13],[0,12],[5,12],[4,5],[4,12],[4,9],[0,6],[6,12],[0,14],[6,14],[1,6],[1,14],[1,11],[6,11],[4,6],[4,11],[1,7],[7,11],[1,15],[7,15],[2,7],[2,15],[2,10],[7,10],[4,7],[4,10],[2,8],[8,10],[2,16],[8,16],[3,8],[3,16],[8,9],[4,8]],\n\t\"edges_faces\": [[0,1],[0,5],[21,0],[1],[2,1],[2,3],[2],[3,6],[4,3],[4,5],[11,4],[5,22],[6,7],[6,11],[7],[8,7],[8,9],[8],[9,12],[10,9],[10,11],[17,10],[12,13],[12,17],[13],[14,13],[14,15],[14],[15,18],[16,15],[16,17],[23,16],[18,19],[18,23],[19],[20,19],[20,21],[20],[22,21],[22,23]],\n\t\"edges_assignment\": [\"M\",\"F\",\"V\",\"B\",\"V\",\"M\",\"B\",\"F\",\"F\",\"M\",\"F\",\"V\",\"M\",\"F\",\"B\",\"V\",\"M\",\"B\",\"V\",\"F\",\"M\",\"V\",\"M\",\"F\",\"B\",\"V\",\"M\",\"B\",\"F\",\"F\",\"M\",\"F\",\"M\",\"F\",\"B\",\"V\",\"M\",\"B\",\"F\",\"M\"],\n\t\"faces_vertices\": [[3,5,9],[5,3,13],[0,5,13],[5,0,12],[4,5,12],[5,4,9],[0,6,12],[6,0,14],[1,6,14],[6,1,11],[4,6,11],[6,4,12],[1,7,11],[7,1,15],[2,7,15],[7,2,10],[4,7,10],[7,4,11],[2,8,10],[8,2,16],[3,8,16],[8,3,9],[4,8,9],[8,4,10]],\n\t\"faces_edges\": [[0,1,2],[0,3,4],[5,4,6],[5,7,8],[9,8,10],[9,11,1],[12,13,7],[12,14,15],[16,15,17],[16,18,19],[20,19,21],[20,10,13],[22,23,18],[22,24,25],[26,25,27],[26,28,29],[30,29,31],[30,21,23],[32,33,28],[32,34,35],[36,35,37],[36,2,38],[39,38,11],[39,31,33]]\n}";

	var frog = "{\n\t\"file_spec\": 1.1,\n\t\"frame_title\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [[0,0],[1,0],[1,1],[0,1],[0.5,0.5],[0,0.5],[0.5,0],[1,0.5],[0.5,1],[0.146446609406726,0.353553390593274],[0.353553390593274,0.146446609406726],[0.646446609406726,0.146446609406726],[0.853553390593274,0.353553390593274],[0.853553390593274,0.646446609406726],[0.646446609406726,0.853553390593274],[0.353553390593274,0.853553390593274],[0.146446609406726,0.646446609406726],[0,0.353553390593274],[0,0.646446609406726],[0.353553390593274,0],[0.646446609406726,0],[1,0.353553390593274],[1,0.646446609406726],[0.646446609406726,1],[0.353553390593274,1]],\n\t\"edges_vertices\": [[0,4],[4,9],[0,9],[0,10],[4,10],[2,4],[2,14],[4,14],[4,13],[2,13],[3,4],[4,15],[3,15],[3,16],[4,16],[1,4],[1,12],[4,12],[4,11],[1,11],[4,5],[5,9],[5,16],[4,6],[6,11],[6,10],[4,7],[7,13],[7,12],[4,8],[8,15],[8,14],[9,17],[0,17],[5,17],[0,19],[10,19],[6,19],[11,20],[1,20],[6,20],[1,21],[12,21],[7,21],[13,22],[2,22],[7,22],[2,23],[14,23],[8,23],[15,24],[3,24],[8,24],[3,18],[16,18],[5,18]],\n\t\"edges_faces\": [[0,1],[0,8],[16,0],[1,18],[11,1],[3,2],[2,26],[15,2],[3,12],[24,3],[4,5],[4,14],[28,4],[5,30],[9,5],[7,6],[6,22],[13,6],[7,10],[20,7],[8,9],[8,17],[31,9],[10,11],[10,21],[19,11],[12,13],[12,25],[23,13],[14,15],[14,29],[27,15],[16,17],[16],[17],[18],[19,18],[19],[20,21],[20],[21],[22],[23,22],[23],[24,25],[24],[25],[26],[27,26],[27],[28,29],[28],[29],[30],[31,30],[31]],\n\t\"edges_assignment\": [\"F\",\"M\",\"M\",\"M\",\"M\",\"F\",\"M\",\"M\",\"M\",\"M\",\"V\",\"M\",\"M\",\"M\",\"M\",\"V\",\"M\",\"M\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\"],\n\t\"faces_vertices\": [[0,4,9],[4,0,10],[4,2,14],[2,4,13],[3,4,15],[4,3,16],[4,1,12],[1,4,11],[4,5,9],[5,4,16],[4,6,11],[6,4,10],[4,7,13],[7,4,12],[4,8,15],[8,4,14],[0,9,17],[9,5,17],[10,0,19],[6,10,19],[1,11,20],[11,6,20],[12,1,21],[7,12,21],[2,13,22],[13,7,22],[14,2,23],[8,14,23],[3,15,24],[15,8,24],[16,3,18],[5,16,18]],\n\t\"faces_edges\": [[0,1,2],[0,3,4],[5,6,7],[5,8,9],[10,11,12],[10,13,14],[15,16,17],[15,18,19],[20,21,1],[20,14,22],[23,24,18],[23,4,25],[26,27,8],[26,17,28],[29,30,11],[29,7,31],[2,32,33],[21,34,32],[3,35,36],[25,36,37],[19,38,39],[24,40,38],[16,41,42],[28,42,43],[9,44,45],[27,46,44],[6,47,48],[31,48,49],[12,50,51],[30,52,50],[13,53,54],[22,54,55]]\n}";

	var test = "{\n\t\"file_spec\":1.1,\n\t\"file_creator\":\"Rabbit Ear\",\n\t\"file_author\":\"Robby Kraft\",\n\t\"file_classes\":[\"singleModel\"],\n\t\"frame_attributes\":[\"2D\"],\n\t\"frame_title\":\"three crease\",\n\t\"frame_classes\":[\"creasePattern\"],\n\t\"vertices_coords\":[\n\t\t[0,0],[1,0],[1,1],[0,1],[1,0.21920709774914],[0,0.75329794695316],[0.1,1],[0,0.9],[0.506713890898239,0],[0.645319539098137,0.408638686308289],[1,0.871265438078371]\n\t],\n\t\"edges_vertices\":[[8,9],[5,9],[0,5],[0,8],[5,7],[9,10],[2,10],[2,6],[6,7],[3,6],[3,7],[1,8],[1,4],[4,9],[4,10]],\n\t\"edges_assignment\":[\"M\",\"M\",\"B\",\"B\",\"B\",\"V\",\"B\",\"B\",\"V\",\"B\",\"B\",\"B\",\"B\",\"M\",\"B\"],\n\t\"faces_vertices\":[[8,9,5,0],[7,5,9,10,2,6],[6,3,7],[8,1,4,9],[9,4,10]],\n\t\"faces_edges\":[[0,1,2,3],[4,1,5,6,7,8],[9,10,8],[11,12,13,0],[13,14,5]],\n\t\"re:faces_layer\":[0,1,2,4,3],\n\t\"file_frames\": [{\n\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\"frame_parent\": 0,\n\t\t\"frame_inherit\": true,\n\t\t\"vertices_coords\":[\n\t\t\t[0.62607055446971, 1.17221733980796],\n\t\t\t[0.44072549605688, 0.90956291495505],\n\t\t\t[1, 1],\n\t\t\t[0.1, 0.9],\n\t\t\t[0.37030057556411, 0.70197659007504],\n\t\t\t[0, 0.75329794695316],\n\t\t\t[0.1, 1],\n\t\t\t[0, 0.9],\n\t\t\t[0.90786114793244, 0.75108431015443],\n\t\t\t[0.64531953909814, 0.40863868630829],\n\t\t\t[1, 0.87126543807837]\n\t\t]\n\t}]\n}";

	var dodecagon = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_title\": \"\",\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [\n\t\t[1,0],[0.8660254,0.5],[0.5,0.8660254],[0,1],[-0.5,0.8660254],[-0.8660254,0.5],[-1,0],[-0.8660254,-0.5],[-0.5,-0.8660254],[0,-1],[0.5,-0.8660254],[0.8660254,-0.5]\n\t],\n\t\"vertices_vertices\": [[11,1], [0,2], [1,3], [2,4], [3,5], [4,6], [5,7], [6,8], [7,9], [8,10], [9,11], [10,0]],\n\t\"vertices_faces\": [[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]],\n\t\"edges_vertices\": [\n\t\t[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,8], [8,9], [9,10], [10,11], [11,0]\n\t],\n\t\"edges_faces\": [[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n\t\"edges_length\": [0.5176381, 0.5176381, 0.5176381, 0.5176381, 0.5176381, 0.5176381, 0.5176381, 0.5176381, 0.5176381, 0.5176381, 0.5176381, 0.5176381],\n\t\"faces_vertices\": [[0,1,2,3,4,5,6,7,8,9,10,11]],\n\t\"faces_edges\": [[0,1,2,3,4,5,6,7,8,9,10,11]]\n}";

	var boundary$1 = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [],\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_title\": \"\",\n\t\"frame_classes\": [],\n\t\"vertices_coords\": [[0.3535533905932738,0.8535533905932737], [-0.3535533905932738,0.8535533905932737], [-0.8535533905932737,0.35355339059327384], [-0.8535533905932737,-0.35355339059327373], [-0.35355339059327384,-0.8535533905932737], [0.3535533905932737,-0.8535533905932738], [0.8535533905932735,-0.3535533905932743], [0.8535533905932736,0.35355339059327395]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,7], [7,6], [6,5], [5,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,0]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\"],\n\t\"faces_vertices\": [[0,1,2,7,6,5,2,3,4,5,6,7]],\n\t\"faces_edges\": [[0,1,2,3,4,5,6,7,8,9,10,11]]\n}";

	var concave = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [],\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_title\": \"\",\n\t\"frame_classes\": [],\n\t\"vertices_coords\": [[0,0], [1,0], [1,0.33333333333333], [0.33333333333333,0.33333333333333], [0.33333333333333,0.66666666666666], [1,0.66666666666666], [1,1], [0,1]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,0]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\"],\n\t\"faces_vertices\": [[0,1,2,3,4,5,6,7]],\n\t\"faces_edges\": [[0,1,2,3,4,5,6,7]]\n}";

	var blintzAnimated = "{\n\t\"file_spec\": 1.1,\n\t\"file_author\": \"Robby Kraft\",\n\t\"file_classes\": [\"singleModel\", \"animation\"],\n\t\"re:file_date\": \"2018-10-14\",\n\t\"frame_title\": \"blintz base\",\n\t\"frame_attributes\": [\"3D\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [\n\t\t[0.0, 0.0, 0.0], [0.5, 0.0, 0.0],\n\t\t[1.0, 0.0, 0.0], [1.0, 0.5, 0.0],\n\t\t[1.0, 1.0, 0.0], [0.5, 1.0, 0.0],\n\t\t[0.0, 1.0, 0.0], [0.0, 0.5, 0.0]\n\t],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,0], [1,3], [3,5], [5,7], [7,1]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"V\",\"V\",\"V\",\"V\"],\n\t\"faces_vertices\": [[0,1,7], [2,3,1], [4,5,3], [6,7,5], [1,3,5,7]],\n\t\"faces_layer\": [4,0,1,2,3],\n\t\"file_frames\": [\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\": 0,\n\t\t\t\"frame_inherit\": true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.0012038183319507678, 0.0012038183319507678, 0.02450428508239015], [0.5, 0.0, 0.0],\n\t\t\t\t[0.9987961816680493, 0.0012038183319507678, 0.02450428508239015], [1.0, 0.5, 0.0],\n\t\t\t\t[0.9987961816680493, 0.9987961816680493, 0.02450428508239015], [0.5, 1.0, 0.0],\n\t\t\t\t[0.0012038183319507678, 0.9987961816680493, 0.02450428508239015], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.004803679899192392, 0.004803679899192392, 0.04877258050403206], [0.5, 0.0, 0.0],\n\t\t\t\t[0.9951963201008076, 0.004803679899192392, 0.04877258050403206], [1.0, 0.5, 0.0],\n\t\t\t\t[0.9951963201008076, 0.9951963201008076, 0.04877258050403206], [0.5, 1.0, 0.0],\n\t\t\t\t[0.004803679899192392, 0.9951963201008076, 0.04877258050403206], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.010764916066947794, 0.010764916066947794, 0.07257116931361558], [0.5, 0.0, 0.0],\n\t\t\t\t[0.9892350839330522, 0.010764916066947794, 0.07257116931361558], [1.0, 0.5, 0.0],\n\t\t\t\t[0.9892350839330522, 0.9892350839330522, 0.07257116931361558], [0.5, 1.0, 0.0],\n\t\t\t\t[0.010764916066947794, 0.9892350839330522, 0.07257116931361558], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.019030116872178315, 0.019030116872178315, 0.09567085809127245], [0.5, 0.0, 0.0],\n\t\t\t\t[0.9809698831278217, 0.019030116872178315, 0.09567085809127245], [1.0, 0.5, 0.0],\n\t\t\t\t[0.9809698831278217, 0.9809698831278217, 0.09567085809127245], [0.5, 1.0, 0.0],\n\t\t\t\t[0.019030116872178315, 0.9809698831278217, 0.09567085809127245], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.029519683912911238, 0.029519683912911238, 0.11784918420649941], [0.5, 0.0, 0.0],\n\t\t\t\t[0.9704803160870887, 0.029519683912911238, 0.11784918420649941], [1.0, 0.5, 0.0],\n\t\t\t\t[0.9704803160870887, 0.9704803160870887, 0.11784918420649941], [0.5, 1.0, 0.0],\n\t\t\t\t[0.029519683912911238, 0.9704803160870887, 0.11784918420649941], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.04213259692436369, 0.04213259692436369, 0.13889255825490054], [0.5, 0.0, 0.0],\n\t\t\t\t[0.9578674030756363, 0.04213259692436369, 0.13889255825490054], [1.0, 0.5, 0.0],\n\t\t\t\t[0.9578674030756363, 0.9578674030756363, 0.13889255825490054], [0.5, 1.0, 0.0],\n\t\t\t\t[0.04213259692436369, 0.9578674030756363, 0.13889255825490054], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.05674738665931575, 0.05674738665931575, 0.15859832104091137], [0.5, 0.0, 0.0],\n\t\t\t\t[0.9432526133406842, 0.05674738665931575, 0.15859832104091137], [1.0, 0.5, 0.0],\n\t\t\t\t[0.9432526133406842, 0.9432526133406842, 0.15859832104091137], [0.5, 1.0, 0.0],\n\t\t\t\t[0.05674738665931575, 0.9432526133406842, 0.15859832104091137], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.0732233047033631, 0.0732233047033631, 0.17677669529663687], [0.5, 0.0, 0.0],\n\t\t\t\t[0.9267766952966369, 0.0732233047033631, 0.17677669529663687], [1.0, 0.5, 0.0],\n\t\t\t\t[0.9267766952966369, 0.9267766952966369, 0.17677669529663687], [0.5, 1.0, 0.0],\n\t\t\t\t[0.0732233047033631, 0.9267766952966369, 0.17677669529663687], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.09140167895908863, 0.09140167895908863, 0.19325261334068422], [0.5, 0.0, 0.0],\n\t\t\t\t[0.9085983210409114, 0.09140167895908863, 0.19325261334068422], [1.0, 0.5, 0.0],\n\t\t\t\t[0.9085983210409114, 0.9085983210409114, 0.19325261334068422], [0.5, 1.0, 0.0],\n\t\t\t\t[0.09140167895908863, 0.9085983210409114, 0.19325261334068422], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.11110744174509943, 0.11110744174509943, 0.2078674030756363], [0.5, 0.0, 0.0],\n\t\t\t\t[0.8888925582549005, 0.11110744174509943, 0.2078674030756363], [1.0, 0.5, 0.0],\n\t\t\t\t[0.8888925582549005, 0.8888925582549005, 0.2078674030756363], [0.5, 1.0, 0.0],\n\t\t\t\t[0.11110744174509943, 0.8888925582549005, 0.2078674030756363], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.13215081579350055, 0.13215081579350055, 0.22048031608708873], [0.5, 0.0, 0.0],\n\t\t\t\t[0.8678491842064995, 0.13215081579350055, 0.22048031608708873], [1.0, 0.5, 0.0],\n\t\t\t\t[0.8678491842064995, 0.8678491842064995, 0.22048031608708873], [0.5, 1.0, 0.0],\n\t\t\t\t[0.13215081579350055, 0.8678491842064995, 0.22048031608708873], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.15432914190872754, 0.15432914190872754, 0.23096988312782168], [0.5, 0.0, 0.0],\n\t\t\t\t[0.8456708580912724, 0.15432914190872754, 0.23096988312782168], [1.0, 0.5, 0.0],\n\t\t\t\t[0.8456708580912724, 0.8456708580912724, 0.23096988312782168], [0.5, 1.0, 0.0],\n\t\t\t\t[0.15432914190872754, 0.8456708580912724, 0.23096988312782168], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.17742883068638443, 0.17742883068638443, 0.23923508393305223], [0.5, 0.0, 0.0],\n\t\t\t\t[0.8225711693136155, 0.17742883068638443, 0.23923508393305223], [1.0, 0.5, 0.0],\n\t\t\t\t[0.8225711693136155, 0.8225711693136155, 0.23923508393305223], [0.5, 1.0, 0.0],\n\t\t\t\t[0.17742883068638443, 0.8225711693136155, 0.23923508393305223], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.20122741949596792, 0.20122741949596792, 0.2451963201008076], [0.5, 0.0, 0.0],\n\t\t\t\t[0.7987725805040321, 0.20122741949596792, 0.2451963201008076], [1.0, 0.5, 0.0],\n\t\t\t\t[0.7987725805040321, 0.7987725805040321, 0.2451963201008076], [0.5, 1.0, 0.0],\n\t\t\t\t[0.20122741949596792, 0.7987725805040321, 0.2451963201008076], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.2254957149176098, 0.2254957149176098, 0.2487961816680492], [0.5, 0.0, 0.0],\n\t\t\t\t[0.7745042850823902, 0.2254957149176098, 0.2487961816680492], [1.0, 0.5, 0.0],\n\t\t\t\t[0.7745042850823902, 0.7745042850823902, 0.2487961816680492], [0.5, 1.0, 0.0],\n\t\t\t\t[0.2254957149176098, 0.7745042850823902, 0.2487961816680492], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.25, 0.25, 0.25], [0.5, 0.0, 0.0],\n\t\t\t\t[0.75, 0.25, 0.25], [1.0, 0.5, 0.0],\n\t\t\t\t[0.75, 0.75, 0.25], [0.5, 1.0, 0.0],\n\t\t\t\t[0.25, 0.75, 0.25], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.27450428508239016, 0.27450428508239016, 0.24879618166804923], [0.5, 0.0, 0.0],\n\t\t\t\t[0.7254957149176098, 0.27450428508239016, 0.24879618166804923], [1.0, 0.5, 0.0],\n\t\t\t\t[0.7254957149176098, 0.7254957149176098, 0.24879618166804923], [0.5, 1.0, 0.0],\n\t\t\t\t[0.27450428508239016, 0.7254957149176098, 0.24879618166804923], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.29877258050403205, 0.29877258050403205, 0.2451963201008076], [0.5, 0.0, 0.0],\n\t\t\t\t[0.701227419495968, 0.29877258050403205, 0.2451963201008076], [1.0, 0.5, 0.0],\n\t\t\t\t[0.701227419495968, 0.701227419495968, 0.2451963201008076], [0.5, 1.0, 0.0],\n\t\t\t\t[0.29877258050403205, 0.701227419495968, 0.2451963201008076], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.3225711693136155, 0.3225711693136155, 0.23923508393305223], [0.5, 0.0, 0.0],\n\t\t\t\t[0.6774288306863845, 0.3225711693136155, 0.23923508393305223], [1.0, 0.5, 0.0],\n\t\t\t\t[0.6774288306863845, 0.6774288306863845, 0.23923508393305223], [0.5, 1.0, 0.0],\n\t\t\t\t[0.3225711693136155, 0.6774288306863845, 0.23923508393305223], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.3456708580912724, 0.3456708580912724, 0.23096988312782168], [0.5, 0.0, 0.0],\n\t\t\t\t[0.6543291419087276, 0.3456708580912724, 0.23096988312782168], [1.0, 0.5, 0.0],\n\t\t\t\t[0.6543291419087276, 0.6543291419087276, 0.23096988312782168], [0.5, 1.0, 0.0],\n\t\t\t\t[0.3456708580912724, 0.6543291419087276, 0.23096988312782168], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.3678491842064994, 0.3678491842064994, 0.22048031608708876], [0.5, 0.0, 0.0],\n\t\t\t\t[0.6321508157935005, 0.3678491842064994, 0.22048031608708876], [1.0, 0.5, 0.0],\n\t\t\t\t[0.6321508157935005, 0.6321508157935005, 0.22048031608708876], [0.5, 1.0, 0.0],\n\t\t\t\t[0.3678491842064994, 0.6321508157935005, 0.22048031608708876], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.3888925582549005, 0.3888925582549005, 0.20786740307563634], [0.5, 0.0, 0.0],\n\t\t\t\t[0.6111074417450995, 0.3888925582549005, 0.20786740307563634], [1.0, 0.5, 0.0],\n\t\t\t\t[0.6111074417450995, 0.6111074417450995, 0.20786740307563634], [0.5, 1.0, 0.0],\n\t\t\t\t[0.3888925582549005, 0.6111074417450995, 0.20786740307563634], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.4085983210409113, 0.4085983210409113, 0.19325261334068428], [0.5, 0.0, 0.0],\n\t\t\t\t[0.5914016789590887, 0.4085983210409113, 0.19325261334068428], [1.0, 0.5, 0.0],\n\t\t\t\t[0.5914016789590887, 0.5914016789590887, 0.19325261334068428], [0.5, 1.0, 0.0],\n\t\t\t\t[0.4085983210409113, 0.5914016789590887, 0.19325261334068428], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.42677669529663687, 0.42677669529663687, 0.1767766952966369], [0.5, 0.0, 0.0],\n\t\t\t\t[0.5732233047033631, 0.42677669529663687, 0.1767766952966369], [1.0, 0.5, 0.0],\n\t\t\t\t[0.5732233047033631, 0.5732233047033631, 0.1767766952966369], [0.5, 1.0, 0.0],\n\t\t\t\t[0.42677669529663687, 0.5732233047033631, 0.1767766952966369], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.4432526133406842, 0.4432526133406842, 0.15859832104091137], [0.5, 0.0, 0.0],\n\t\t\t\t[0.5567473866593158, 0.4432526133406842, 0.15859832104091137], [1.0, 0.5, 0.0],\n\t\t\t\t[0.5567473866593158, 0.5567473866593158, 0.15859832104091137], [0.5, 1.0, 0.0],\n\t\t\t\t[0.4432526133406842, 0.5567473866593158, 0.15859832104091137], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.45786740307563634, 0.45786740307563634, 0.13889255825490054], [0.5, 0.0, 0.0],\n\t\t\t\t[0.5421325969243637, 0.45786740307563634, 0.13889255825490054], [1.0, 0.5, 0.0],\n\t\t\t\t[0.5421325969243637, 0.5421325969243637, 0.13889255825490054], [0.5, 1.0, 0.0],\n\t\t\t\t[0.45786740307563634, 0.5421325969243637, 0.13889255825490054], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.47048031608708873, 0.47048031608708873, 0.11784918420649947], [0.5, 0.0, 0.0],\n\t\t\t\t[0.5295196839129113, 0.47048031608708873, 0.11784918420649947], [1.0, 0.5, 0.0],\n\t\t\t\t[0.5295196839129113, 0.5295196839129113, 0.11784918420649947], [0.5, 1.0, 0.0],\n\t\t\t\t[0.47048031608708873, 0.5295196839129113, 0.11784918420649947], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.4809698831278217, 0.4809698831278217, 0.09567085809127247], [0.5, 0.0, 0.0],\n\t\t\t\t[0.5190301168721783, 0.4809698831278217, 0.09567085809127247], [1.0, 0.5, 0.0],\n\t\t\t\t[0.5190301168721783, 0.5190301168721783, 0.09567085809127247], [0.5, 1.0, 0.0],\n\t\t\t\t[0.4809698831278217, 0.5190301168721783, 0.09567085809127247], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.4892350839330522, 0.4892350839330522, 0.0725711693136156], [0.5, 0.0, 0.0],\n\t\t\t\t[0.5107649160669478, 0.4892350839330522, 0.0725711693136156], [1.0, 0.5, 0.0],\n\t\t\t\t[0.5107649160669478, 0.5107649160669478, 0.0725711693136156], [0.5, 1.0, 0.0],\n\t\t\t\t[0.4892350839330522, 0.5107649160669478, 0.0725711693136156], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.4951963201008076, 0.4951963201008076, 0.04877258050403215], [0.5, 0.0, 0.0],\n\t\t\t\t[0.5048036798991924, 0.4951963201008076, 0.04877258050403215], [1.0, 0.5, 0.0],\n\t\t\t\t[0.5048036798991924, 0.5048036798991924, 0.04877258050403215], [0.5, 1.0, 0.0],\n\t\t\t\t[0.4951963201008076, 0.5048036798991924, 0.04877258050403215], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.4987961816680492, 0.4987961816680492, 0.024504285082390206], [0.5, 0.0, 0.0],\n\t\t\t\t[0.5012038183319508, 0.4987961816680492, 0.024504285082390206], [1.0, 0.5, 0.0],\n\t\t\t\t[0.5012038183319508, 0.5012038183319508, 0.024504285082390206], [0.5, 1.0, 0.0],\n\t\t\t\t[0.4987961816680492, 0.5012038183319508, 0.024504285082390206], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.5, 0.5, 0.0], [0.5, 0.0, 0.0],\n\t\t\t\t[0.5, 0.5, 0.0], [1.0, 0.5, 0.0],\n\t\t\t\t[0.5, 0.5, 0.0], [0.5, 1.0, 0.0],\n\t\t\t\t[0.5, 0.5, 0.0], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t}\n\t]\n}";

	var blintzDistorted = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"blintz base\",\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [[0.005,0.005], [0.5,0], [0.995,0.005], [1,0.5], [0.995,0.995], [0.5,1], [0.005,0.995], [0,0.5]],\n\t\"vertices_vertices\": [[1,7], [2,3,7,0], [3,1], [4,5,1,2], [5,3], [6,7,3,4], [7,5], [0,1,5,6]],\n\t\"vertices_faces\": [[0], [1,4,0], [1], [2,4,1], [2], [3,4,2], [3], [0,4,3]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,0], [1,3], [3,5], [5,7], [7,1]],\n\t\"edges_faces\": [[0], [1], [1], [2], [2], [3], [3], [0], [1,4], [2,4], [3,4], [0,4]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"V\",\"V\",\"V\",\"V\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n\t\"edges_length\": [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.707106781186548, 0.707106781186548, 0.707106781186548, 0.707106781186548],\n\t\"faces_vertices\": [[0,1,7], [2,3,1], [4,5,3], [6,7,5], [1,3,5,7]],\n\t\"faces_edges\": [[0,11,7], [2,8,1], [4,9,3], [6,10,5], [8,9,10,11]],\n\t\"file_frames\": [{\n\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\"frame_parent\": 0,\n\t\t\"frame_inherit\": true,\n\t\t\"vertices_coords\": [[0.5,0.5], [0.5,0.0], [0.5,0.5], [1.0,0.5], [0.5,0.5], [0.5,1.0], [0.5,0.5], [0.0,0.5]],\n\t\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 180, 180, 180, 180],\n\t\t\"faceOrders\": [[0,4,1], [1,4,1], [2,4,1], [3,4,1]]\n\t}]\n}";

	const fold = {
		frame: frame,
		validate: validate,
		graph: graph,
		origami: origami$2,
		planargraph: planargraph,
		valleyfold: valleyfold,
		creasethrough: creasethrough
	};
	const bases = {
		empty: JSON.parse(empty),
		square: JSON.parse(squareFoldString),
		book: JSON.parse(book),
		blintz: JSON.parse(blintz),
		kite: JSON.parse(kite),
		fish: JSON.parse(fish),
		bird: JSON.parse(bird),
		frog: JSON.parse(frog),
		// remove these for production
		test: JSON.parse(test),
		dodecagon: JSON.parse(dodecagon),
		boundary: JSON.parse(boundary$1),
		concave: JSON.parse(concave),
		blintzAnimated: JSON.parse(blintzAnimated),
		blintzDistorted: JSON.parse(blintzDistorted)
	};

	exports.math = geometry$1;
	exports.svg = svg$1;
	exports.noise = perlin;
	exports.fold = fold;
	exports.bases = bases;
	exports.CreasePattern = CreasePattern;
	exports.Origami = View2D;
	exports.Origami3D = View3D;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
