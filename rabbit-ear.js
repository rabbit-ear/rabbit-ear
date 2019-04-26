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
			.reduce((prev,curr) => prev + curr, 0);
		return Math.sqrt(sum);
	}
	function degenerate(v, epsilon = EPSILON) {
		return Math.abs(v.reduce((a, b) => a + b, 0)) < epsilon;
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
	function midpoint(a, b) {
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
	function multiply_line_matrix2(point, vector, matrix) {
		let new_point = multiply_vector2_matrix2(point, matrix);
		let vec_point = vector.map((vec,i) => vec + point[i]);
		let new_vector = multiply_vector2_matrix2(vec_point, matrix)
			.map((vec,i) => vec - new_point[i]);
		return [new_point, new_vector];
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
		midpoint: midpoint,
		average: average,
		multiply_vector2_matrix2: multiply_vector2_matrix2,
		multiply_line_matrix2: multiply_line_matrix2,
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
		if (Math.abs(denominator0) < epsilon) { return undefined; }
		let denominator1 = -denominator0;
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
			let solution = [midpoint(pointA, pointB), [vectorA[0], vectorA[1]]];
			let array = [solution, solution];
			let dot$$1 = vectorA[0]*vectorB[0] + vectorA[1]*vectorB[1];
			(dot$$1 > 0 ? delete array[1] : delete array[0]);
			return array;
		}
		let vectorC = [pointB[0]-pointA[0], pointB[1]-pointA[1]];
		let numerator = (pointB[0]-pointA[0]) * vectorB[1] - vectorB[0] * (pointB[1]-pointA[1]);
		let t = numerator / denominator;
		let x = pointA[0] + vectorA[0]*t;
		let y = pointA[1] + vectorA[1]*t;
		let bisects = bisect_vectors(vectorA, vectorB);
		bisects[1] = [ bisects[1][1], -bisects[1][0] ];
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
		let mid = midpoint(a, b);
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
		const add = function() {
			let vec = get_vec(...arguments);
			return Vector( _v.map((v,i) => v + vec[i]) );
		};
		const subtract = function() {
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
		const midpoint$$1 = function() {
			let vec = get_vec(...arguments);
			let sm = (_v.length < vec.length) ? _v.slice() : vec;
			let lg = (_v.length < vec.length) ? vec : _v.slice();
			for (let i = sm.length; i < lg.length; i++) { sm[i] = 0; }
			return Vector(lg.map((_,i) => (sm[i] + lg[i]) * 0.5));
		};
		const bisect = function() {
			let vec = get_vec(...arguments);
			return bisect_vectors(_v, vec).map(b => Vector(b));
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
		Object.defineProperty(_v, "midpoint", {value: midpoint$$1});
		Object.defineProperty(_v, "bisect", {value: bisect});
		Object.defineProperty(_v, "x", {get: function(){ return _v[0]; }});
		Object.defineProperty(_v, "y", {get: function(){ return _v[1]; }});
		Object.defineProperty(_v, "z", {get: function(){ return _v[2]; }});
		Object.defineProperty(_v, "magnitude", {get: function() {
			return magnitude(_v);
		}});
		Object.defineProperty(_v, "copy", {value: function() { return Vector(..._v);}});
		return _v;
	}

	function Circle(){
		let _origin, _radius;
		let params = Array.from(arguments);
		let numbers = params.filter((param) => !isNaN(param));
		if (numbers.length === 3) {
			_origin = Vector(numbers.slice(0,2));
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
			set radius(newRadius) { _radius = newRadius; },
		};
	}

	function LinePrototype(proto) {
		if(proto == null) {
			proto = {};
		}
		const isParallel = function(line, epsilon){
			if (line.vector == null) {
				throw "line isParallel(): please ensure object contains a vector";
			}
			let this_is_smaller = (this.vector.length < line.vector.length);
			let sm = this_is_smaller ? this.vector : line.vector;
			let lg = this_is_smaller ? line.vector : this.vector;
			return parallel(sm, lg, epsilon);
		};
		const isDegenrate = function(epsilon){
			return degenerate(this.vector, epsilon);
		};
		const reflection = function() {
			return Matrix2.makeReflection(this.vector, this.point);
		};
		const nearestPoint = function() {
			let point = get_vec(...arguments);
			return Vector(nearest_point(this.point, this.vector, point, this.clip_function));
		};
		const intersect = function(other) {
			return intersection_function(
				this.point, this.vector,
				other.point, other.vector,
				function(t0, t1, epsilon = EPSILON) {
					return this.compare_function(t0, epsilon)
					   && other.compare_function(t1, epsilon);
				}.bind(this)
			);
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
			return this.compare_function(t0, epsilon) && true;
		};
		const compare_to_ray = function(t0, t1, epsilon = EPSILON) {
			return this.compare_function(t0, epsilon) && t1 >= -epsilon;
		};
		const compare_to_edge = function(t0, t1, epsilon = EPSILON) {
			return this.compare_function(t0, epsilon) && t1 >= -epsilon && t1 <= 1+epsilon;
		};
		Object.defineProperty(proto, "isParallel", {value: isParallel});
		Object.defineProperty(proto, "isDegenrate", {value: isDegenrate});
		Object.defineProperty(proto, "nearestPoint", {value: nearestPoint});
		Object.defineProperty(proto, "reflection", {value: reflection});
		Object.defineProperty(proto, "intersect", {value: intersect});
		Object.defineProperty(proto, "intersectLine", {value: intersectLine});
		Object.defineProperty(proto, "intersectRay", {value: intersectRay});
		Object.defineProperty(proto, "intersectEdge", {value: intersectEdge});
		return Object.freeze(proto);
	}
	function Line() {
		let { point, vector } = get_line(...arguments);
		const transform = function() {
			let mat = get_matrix2(...arguments);
			let line = multiply_line_matrix2(point, vector, mat);
			return Line(line[0], line[1]);
		};
		let line = Object.create(LinePrototype());
		const compare_function = function() { return true; };
		const clip_function = function(d) { return d; };
		Object.defineProperty(line, "compare_function", {value: compare_function});
		Object.defineProperty(line, "clip_function", {value: clip_function});
		Object.defineProperty(line, "point", {get: function(){ return Vector(point); }});
		Object.defineProperty(line, "vector", {get: function(){ return Vector(vector); }});
		Object.defineProperty(line, "length", {get: function(){ return Infinity; }});
		Object.defineProperty(line, "transform", {value: transform});
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
			point: midpoint(points[0], points[1]),
			vector: [vec[1], -vec[0]]
		});
	};
	function Ray() {
		let { point, vector } = get_line(...arguments);
		const transform = function() {
			let mat = get_matrix2(...arguments);
			let new_point = multiply_vector2_matrix2(point, mat);
			let vec_point = vector.map((vec,i) => vec + point[i]);
			let new_vector = multiply_vector2_matrix2(vec_point, mat)
				.map((vec,i) => vec - new_point[i]);
			return Ray(new_point, new_vector);
		};
		const rotate180 = function() {
			return Ray(point[0], point[1], -vector[0], -vector[1]);
		};
		let ray = Object.create(LinePrototype());
		const compare_function = function(t0, ep) { return t0 >= -ep; };
		const clip_function = function(d, ep) { return (d < -ep ? 0 : d); };
		Object.defineProperty(ray, "compare_function", {value: compare_function});
		Object.defineProperty(ray, "clip_function", {value: clip_function});
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
		const compare_function = function(t0, ep) { return t0 >= -ep && t0 <= 1+ep; };
		const clip_function = function(d, ep) {
			if (d < -ep) { return 0; }
			if (d > 1+ep) { return 1; }
			return d;
		};
		Object.defineProperty(edge, "compare_function", {value: compare_function});
		Object.defineProperty(edge, "clip_function", {value: clip_function});
		Object.defineProperty(edge, "point", {get: function(){ return edge[0]; }});
		Object.defineProperty(edge, "vector", {get: function(){ return vector(); }});
		Object.defineProperty(edge, "length", {get: function(){ return length(); }});
		Object.defineProperty(edge, "transform", {value: transform});
		return edge;
	}

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

	function Polygon() {
		let _points = get_array_of_vec(...arguments).map(p => Vector(p));
		if (_points === undefined) {
			return undefined;
		}
		let _sides = _points.map((p,i,arr) =>
			Edge(p[0], p[1], arr[(i+1)%arr.length][0], arr[(i+1)%arr.length][0]));
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
		const sectors = function() {
			return _points.map((p,i,arr) =>
				[arr[(i+arr.length-1)%arr.length], p, arr[(i+1)%arr.length]]
			).map(points => Sector(points[1], points[2], points[0]));
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
			get sides() { return _sides; },
			get edges() { return _sides; },
			get sectors() { return sectors(); },
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

	let core = Object.create(null);
	Object.assign(core, algebra, geometry);
	core.EPSILON_LOW = EPSILON_LOW;
	core.EPSILON = EPSILON;
	core.EPSILON_HIGH = EPSILON_HIGH;
	core.intersection = intersection;
	core.clean_number = clean_number;
	core.axiom = [];
	core.axiom[1] = axiom1;
	core.axiom[2] = axiom2;
	core.axiom[3] = axiom3;
	core.axiom[4] = axiom4;
	core.axiom[5] = axiom5;
	core.axiom[6] = axiom6;
	core.axiom[7] = axiom7;
	delete core.axiom[0];
	Object.freeze(core.axiom);
	Object.freeze(core);

	var geometry$1 = /*#__PURE__*/Object.freeze({
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
		Sector: Sector,
		core: core
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
	const save = function(svg, filename = "image.svg", includeDOMCSS = false) {
		let a = document.createElement("a");
		if (includeDOMCSS) {
			let styleContainer = document.createElementNS("http://www.w3.org/2000/svg", "style");
			styleContainer.setAttribute("type", "text/css");
			styleContainer.innerHTML = getPageCSS();
			svg.appendChild(styleContainer);
		}
		let source = (new window.XMLSerializer()).serializeToString(svg);
		let formatted = vkbeautify$1.xml(source);
		let blob = new window.Blob([formatted], {type: "text/plain"});
		a.setAttribute("href", window.URL.createObjectURL(blob));
		a.setAttribute("download", filename);
		document.body.appendChild(a);
		a.click();
		a.remove();
	};
	const getPageCSS = function() {
		let css = [];
		for (let s = 0; s < document.styleSheets.length; s++) {
			let sheet = document.styleSheets[s];
			try {
				let rules = ('cssRules' in sheet) ? sheet.cssRules : sheet.rules;
				for (let r = 0; r < rules.length; r++) {
					let rule = rules[r];
					if ('cssText' in rule){
						css.push(rule.cssText);
					}
					else{
						css.push(rule.selectorText+' {\n'+rule.style.cssText+'\n}\n');
					}
				}
			} catch(error){ }
		}
		return css.join('\n');
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
			addEventListener,
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
					if (parent != null) { parent.insertBefore(newSVG, element); }
					element.remove();
					element = newSVG;
				}
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

	const clone$1 = function(o) {
		// from https://jsperf.com/deep-copy-vs-json-stringify-json-parse/5
		var newO, i;
		if (typeof o !== 'object') {
			return o;
		}
		if (!o) {
			return o;
		}
		if ('[object Array]' === Object.prototype.toString.apply(o)) {
			newO = [];
			for (i = 0; i < o.length; i += 1) {
				newO[i] = clone$1(o[i]);
			}
			return newO;
		}
		newO = {};
		for (i in o) {
			if (o.hasOwnProperty(i)) {
				newO[i] = clone$1(o[i]);
			}
		}
		return newO;
	}; 

	const recursive_freeze = function(input) {
		Object.freeze(input);
			if (input === undefined) {
			return input;
		}
		Object.getOwnPropertyNames(input).filter(prop =>
			input[prop] !== null
			&& (typeof input[prop] === "object" || typeof input[prop] === "function")
			&& !Object.isFrozen(input[prop])
		).forEach(prop => recursive_freeze(input[prop]));
		return input;
	};

	const append_frame = function(fold_file) {

	};

	const flatten_frame = function(fold_file, frame_num){
		const dontCopy = ["frame_parent", "frame_inherit"];
		var memo = {visited_frames:[]};
		function recurse(fold_file, frame, orderArray) {
			if (memo.visited_frames.indexOf(frame) !== -1) {
				throw "FOLD file_frames encountered a cycle. stopping.";
				return orderArray;
			}
			memo.visited_frames.push(frame);
			orderArray = [frame].concat(orderArray);
			if (frame === 0) { return orderArray; }
			if (fold_file.file_frames[frame - 1].frame_inherit &&
			   fold_file.file_frames[frame - 1].frame_parent != null) {
				return recurse(fold_file, fold_file.file_frames[frame - 1].frame_parent, orderArray);
			}
			return orderArray;
		}
		return recurse(fold_file, frame_num, []).map(frame => {
			if (frame === 0) {
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

	/**
	 * this asynchronously or synchronously loads data from "input",
	 * if necessary, converts into the FOLD format,
	 * and calls "callback(fold)" with the data as the first argument.
	 *
	 * valid "input" arguments are:
	 * - filenames ("pattern.svg")
	 * - raw blob contents of a preloaded file (.fold, .oripa, .svg)
	 * - SVG DOM objects (<svg> SVGElement)
	 */

	const load_file = function(input, callback) {
		let type = typeof input;
		if (type === "object") {
			try {
				let fold = JSON.parse(JSON.stringify(input));
				// todo different way of checking fold format validity
				if (fold.vertices_coords == null) {
					throw "tried FOLD format, got empty object";
				}
				if (callback != null) {
					callback(fold);
				}
				return fold; // asynchronous loading was not required
			} catch(err) {
				if (input instanceof Element){
					let fold = svg_to_fold(input);
					if (callback != null) {
						callback(fold);
					}
					return fold; // asynchronous loading was not required
				}
			} 
			// finally {
			// 	return;  // currently not used. everything previous is already returning
			// }
		}
		// are they giving us a filename, or the data of an already loaded file?
		if (type === "string" || input instanceof String) {
			// try a FOLD format string
			try {
				// try .fold file format first
				let fold = JSON.parse(input);
				if (callback != null) { callback(fold); }
			} catch(err) {
				let extension = input.substr((input.lastIndexOf('.') + 1));
				// filename. we need to upload
				switch(extension) {
					case "fold":
						fetch(input)
							.then((response) => response.json())
							.then((data) => {
								if (callback != null) { callback(data); }
							});
					break;
					case "svg":
						SVG.load(input, function(svg) {
							let fold = svg_to_fold(svg);
							if (callback != null) { callback(fold); }
						});
					break;
					case "oripa":
						// ORIPA.load(input, function(fold) {
						// 	if (callback != null) { callback(fold); }
						// });
					break;
				}
			}
		}
	};

	var file = /*#__PURE__*/Object.freeze({
		clone: clone$1,
		recursive_freeze: recursive_freeze,
		append_frame: append_frame,
		flatten_frame: flatten_frame,
		merge_frame: merge_frame$1,
		load_file: load_file
	});

	// graph manipulators for .FOLD file github.com/edemaine/fold

	// keys in the .FOLD version 1.1
	const keys = {
		file: [
			"file_spec",
			"file_creator",
			"file_author",
			"file_title",
			"file_description",
			"file_classes",
			"file_frames"
		],
		frame: [
			"frame_author",
			"frame_title",
			"frame_description",
			"frame_attributes",
			"frame_classes",
			"frame_unit"
			// "frame_parent",  // when inside file_frames only
			// "frame_inherit",
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

	const all_keys = []
		.concat(keys.file)
		.concat(keys.frame)
		.concat(keys.graph)
		.concat(keys.orders);

	const CREASE_NAMES = {
		"B": "boundary", "b": "boundary",
		"M": "mountain", "m": "mountain",
		"V": "valley",   "v": "valley",
		"F": "mark",     "f": "mark",
		"U": "mark",     "u": "mark"
	};

	/**
	 * these should trigger a careful re-build, they augment only one
	 * array for the larger set of components
	 */ 
	const new_vertex = function(graph, x, y) {
		if (graph.vertices_coords == null) { graph.vertices_coords = []; }
		graph.vertices_coords.push([x,y]);
		let new_index = graph.vertices_coords.length-1;
		// // mark unclean data
		// unclean.vertices_vertices[new_index] = true;
		// unclean.vertices_faces[new_index] = true;
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
			.map((a,i) => a ? i : undefined)
			.filter(a => a !== undefined);
		let edge_map = remove_edges(graph, remove_indices);
		let face = get_boundary_face(graph);
		graph.faces_edges = [face.edges];
		graph.faces_vertices = [face.vertices];
		remove_isolated_vertices(graph);
	};

	const remove_isolated_vertices = function(graph) {
		let isolated = graph.vertices_coords.map(_ => true);
		graph.edges_vertices.forEach(edge => edge.forEach(v => isolated[v] = false));
		let vertices = isolated.map((el,i) => el ? i : undefined)
			.filter(el => el !== undefined);
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
		// if(graph.faces_vertices != null){
		// 	graph.faces_vertices.forEach(fv => fv.forEach(v =>{
		// 		if(v > max){ max = v; }
		// 	}))
		// }
		// if(graph.edges_vertices != null){
		// 	graph.edges_vertices.forEach(ev => ev.forEach(v =>{
		// 		if(v > max){ max = v; }
		// 	}))
		// }
		// // return 0 if none found
		// return max;
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
		// let max = 0;
		// if(graph.faces_edges != null){
		// 	graph.faces_edges.forEach(fe => fe.forEach(e =>{
		// 		if(e > max){ max = e; }
		// 	}))
		// }
		// if(graph.edgeOrders != null){
		// 	graph.edgeOrders.forEach(eo => eo.forEach((e,i) =>{
		// 		// exception. index 2 is orientation, not index
		// 		if(i != 2 && e > max){ max = e; }
		// 	}))
		// }
		// // return 0 if none found
		// return max;
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
		// let max = 0;
		// if(graph.vertices_faces != null){
		// 	graph.vertices_faces.forEach(fv => fv.forEach(v =>{
		// 		if(v > max){ max = v; }
		// 	}))
		// }
		// if(graph.edges_faces != null){
		// 	graph.edges_faces.forEach(ev => ev.forEach(v =>{
		// 		if(v > max){ max = v; }
		// 	}))
		// }
		// // return 0 if none found
		// return max;
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


	const faces_matrix_coloring = function(faces_matrix) {
		return faces_matrix
			.map(m => m[0] * m[3] - m[1] * m[2])
			.map(c => c >= 0);
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
		graph.vertices_vertices[new_vertex_index] = clone$1(incident_vertices);
		// vertices_vertices, update incident vertices with new vertex
		incident_vertices.forEach((v,i,arr) => {
			let otherV = arr[(i+1)%arr.length];
			let otherI = graph.vertices_vertices[v].indexOf(otherV);
			graph.vertices_vertices[v][otherI] = new_vertex_index;
		});
		// vertices_faces
		if (graph.edges_faces != null && graph.edges_faces[old_edge_index] != null) {
			graph.vertices_faces[new_vertex_index] = clone$1(graph.edges_faces[old_edge_index]);
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
				new_edges[0][key] = clone$1(graph[key][old_edge_index]);
				new_edges[1][key] = clone$1(graph[key][old_edge_index]);
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

	/** replace all instances of the vertex old_index with new_index
	 * does not modify array sizes, only contents of arrays
	 */
	/**
	 * subscript should be a component, "vertices" will search "faces_vertices"...
	 */
	const reindex_subscript = function(graph, subscript, old_index, new_index){
		Object.keys(graph)
			.filter(key => key.includes("_" + subscript))
			.forEach(key =>
				graph[key].forEach((array, outerI) =>
					array.forEach((component, innerI) => {
						if(component === old_index){
							graph[key][outerI][innerI] = new_index;
						}
					})
				)
			);
		return graph;
	};

	/** This filters out all non-operational edges
	 * removes: "F": flat "U": unassigned
	 * retains: "B": border/boundary, "M": mountain, "V": valley
	 */
	const remove_marks = function(fold) {
		let removeTypes = ["f", "F", "b", "B"];
		let removeEdges = fold.edges_assignment
			.map((a,i) => ({a:a,i:i}))
			.filter(obj => removeTypes.indexOf(obj.a) != -1)
			.map(obj => obj.i);
		Graph.remove_edges(fold, removeEdges);
		// todo, rebuild faces
	};


	/**
	 * Replace all instances of removed vertices with "vertex".
	 * @param vertex number index of vertex to remain
	 * @param [removed] array of indices to be replaced
	 */
	const merge_vertices = function(graph, vertex, removed) {
		

	};

	const make_edges_faces = function(graph) {
		let edges_faces = Array
			.from(Array(graph.edges_vertices.length))
			.map(_ => []);
		// todo: does not arrange counter-clockwise
		graph.faces_edges.forEach((face,i) => face.forEach(edge => edges_faces[edge].push(i)));
		return edges_faces;
	};

	const make_vertices_faces = function(graph) {
		let vertices_faces = Array
			.from(Array(graph.faces_vertices.length))
			.map(_ => []);
		graph.faces_vertices.forEach((face,i) => face.forEach(vertex => vertices_faces[vertex].push(i)));
		return vertices_faces;
	};

	var graph = /*#__PURE__*/Object.freeze({
		keys: keys,
		all_keys: all_keys,
		CREASE_NAMES: CREASE_NAMES,
		remove_non_boundary_edges: remove_non_boundary_edges,
		remove_isolated_vertices: remove_isolated_vertices,
		remove_collinear_vertices: remove_collinear_vertices,
		vertices_count: vertices_count,
		edges_count: edges_count,
		faces_count: faces_count,
		make_faces_faces: make_faces_faces,
		faces_matrix_coloring: faces_matrix_coloring,
		faces_coloring: faces_coloring,
		make_face_walk_tree: make_face_walk_tree,
		add_vertex_on_edge: add_vertex_on_edge,
		get_boundary_face: get_boundary_face,
		get_boundary_vertices: get_boundary_vertices,
		remove_vertices: remove_vertices,
		remove_edges: remove_edges,
		remove_faces: remove_faces,
		reindex_subscript: reindex_subscript,
		remove_marks: remove_marks,
		merge_vertices: merge_vertices,
		make_edges_faces: make_edges_faces,
		make_vertices_faces: make_vertices_faces
	});

	// import {vertices_count, edges_count, faces_count} from "./graph";

	// there's little order right now other than adding tests as i think of them
	// this should be thorough at the cost of speed.
	// currently only enforcing graph combinatorics, doesn't check things like illegal
	// planar graph edge crossings.. that will probably be its own validate.
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

	/**
	 * someday this will implement facesOrders. right now just re:faces_layer
	 * leave faces_options empty to search all faces
	 */
	const topmost_face$1 = function(graph, faces_options) {
		if (faces_options == null) {
			faces_options = Array.from(Array(graph.faces_vertices.length))
				.map((_,i) => i);
		}
		if (faces_options.length === 0) { return undefined; }
		if (faces_options.length === 1) { return faces_options[0]; }

		// top to bottom
		let faces_in_order = graph["re:faces_layer"]
			.map((layer,i) => ({layer:layer, i:i}))
			.sort((a,b) => b.layer - a.layer)
			.map(el => el.i);

		for (var i = 0; i < faces_in_order.length; i++) {
			if (faces_options.includes(faces_in_order[i])) {
				return faces_in_order[i];
			}
		}
	};

	const face_containing_point = function(graph, point) {
		if (graph.vertices_coords == null || graph.vertices_coords.length === 0 ||
			graph.faces_vertices == null || graph.faces_vertices.length === 0) {
			return undefined;
		}
		let face = graph.faces_vertices
			.map((fv,i) => ({face: fv.map(v => graph.vertices_coords[v]), i: i}))
			.filter(f => core.intersection.point_in_poly(f.face, point))
			.shift();
		return (face == null ? undefined : face.i);
	};

	const folded_faces_containing_point = function(graph, point, faces_matrix) {
		let transformed_points = faces_matrix
			.map(m => core.multiply_vector2_matrix2(point, m));
		return graph.faces_vertices
			.map((fv,i) => ({face: fv.map(v => graph.vertices_coords[v]), i: i}))
			.filter((f,i) => core.intersection.point_in_poly(f.face, transformed_points[i]))
			.map(f => f.i);
	};

	const faces_containing_point = function(graph, point) {
		if (graph.vertices_coords == null || graph.vertices_coords.length === 0 ||
			graph.faces_vertices == null || graph.faces_vertices.length === 0) {
			return undefined;
		}
		return graph.faces_vertices
			.map((fv,i) => ({face: fv.map(v => graph.vertices_coords[v]), i: i}))
			.filter(f => core.intersection.point_in_poly(f.face, point))
			.map(f => f.i);
	};

	const make_faces_matrix = function(graph, root_face) {
		let faces_matrix = graph.faces_vertices.map(v => [1,0,0,1,0,0]);
		make_face_walk_tree(graph, root_face).forEach((level) =>
			level.filter((entry) => entry.parent != null).forEach((entry) => {
				let edge = entry.edge.map(v => graph.vertices_coords[v]);
				let vec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
				let local = core.make_matrix2_reflection(vec, edge[0]);
				faces_matrix[entry.face] =
					core.multiply_matrices2(faces_matrix[entry.parent], local);
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
				let local = core.make_matrix2_reflection(vec, edge[0]);
				faces_matrix[entry.face] =
					core.multiply_matrices2(local, faces_matrix[entry.parent]);
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
			.map(v => (core.intersection.point_on_line(linePoint, lineVector, v)
				? v
				: undefined))
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
			length: core.distance2(
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

	var planargraph = /*#__PURE__*/Object.freeze({
		nearest_vertex: nearest_vertex,
		nearest_edge: nearest_edge,
		topmost_face: topmost_face$1,
		face_containing_point: face_containing_point,
		folded_faces_containing_point: folded_faces_containing_point,
		faces_containing_point: faces_containing_point,
		make_faces_matrix: make_faces_matrix,
		make_faces_matrix_inv: make_faces_matrix_inv,
		split_convex_polygon: split_convex_polygon$1,
		find_collinear_face_edges: find_collinear_face_edges,
		clip_line: clip_line,
		bounding_rect: bounding_rect
	});

	/**
	 * Each of these should return an array of Edges
	 * 
	 * Each of the axioms create full-page crease lines
	 *  ending at the boundary; in non-convex paper, this
	 *  could result in multiple edges
	 */

	function build_folded_frame(graph, face_stationary) {
		if (face_stationary == null) {
			face_stationary = 0;
			console.warn("build_folded_frame was not supplied a stationary face");
		}
		// console.log("build_folded_frame", graph, face_stationary);
		let faces_matrix = make_faces_matrix(graph, face_stationary);
		let vertices_coords = fold_vertices_coords(graph, face_stationary, faces_matrix);
		return {
			vertices_coords,
			frame_classes: ["foldedForm"],
			frame_inherit: true,
			frame_parent: 0, // this is not always the case. maybe shouldn't imply this here.
			// "re:face_stationary": face_stationary,
			"re:faces_matrix": faces_matrix
		};
	}

	function universal_molecule(polygon) {

	}

	function foldLayers(faces_layer, faces_folding) {
		let folding_i = faces_layer
			.map((el,i) => faces_folding[i] ? i : undefined)
			.filter(a => a !== undefined);
		let not_folding_i = faces_layer
			.map((el,i) => !faces_folding[i] ? i : undefined)
			.filter(a => a !== undefined);
		let sorted_folding_i = folding_i.slice()
			.sort((a,b) => faces_layer[a] - faces_layer[b]);
		let sorted_not_folding_i = not_folding_i.slice()
			.sort((a,b) => faces_layer[a] - faces_layer[b]);
		let new_faces_layer = [];
		sorted_not_folding_i.forEach((layer, i) => new_faces_layer[layer] = i);
		let topLayer = sorted_not_folding_i.length;
		sorted_folding_i.reverse().forEach((layer, i) => new_faces_layer[layer] = topLayer + i);
		return new_faces_layer;
	}

	/**
	 * point average, not centroid, must be convex, only useful in certain cases
	 */
	const make_face_center = function(graph, face_index) {
		return graph.faces_vertices[face_index]
			.map(v => graph.vertices_coords[v])
			.reduce((a,b) => [a[0]+b[0], a[1]+b[1]], [0,0])
			.map(el => el/graph.faces_vertices[face_index].length);
	};

	/**
	 * the crease line is defined by point, vector, happening on face_index
	 */
	const pointSidedness = function(point, vector, face_center, face_color) {
		let vec2 = [face_center[0] - point[0], face_center[1] - point[1]];
		let det = vector[0] * vec2[1] - vector[1] * vec2[0];
		return face_color ? det > 0 : det < 0;
	};

	const prepare_to_fold = function(graph, point, vector, face_index) {
		let faces_count$$1 = graph.faces_vertices.length;
		graph["re:faces_folding"] = Array.from(Array(faces_count$$1));
		graph["re:faces_preindex"] = Array.from(Array(faces_count$$1)).map((_,i)=>i);
		// graph["re:faces_coloring"] = Graph.faces_coloring(graph, face_index);

		if (graph.file_frames != null
			&& graph.file_frames.length > 0
			&& graph.file_frames[0]["re:faces_matrix"] != null
			&& graph.file_frames[0]["re:faces_matrix"].length === faces_count$$1) {
			// console.log("prepare_to_fold found faces matrix from last fold", graph.file_frames[0]["re:faces_matrix"]);
			graph["re:faces_matrix"] = JSON.parse(JSON.stringify(graph.file_frames[0]["re:faces_matrix"]));
		} else {
			// console.log("prepare_to_fold creating new faces matrix");
			graph["re:faces_matrix"] = make_faces_matrix(graph, face_index);
		}

		graph["re:faces_coloring"] = faces_matrix_coloring(graph["re:faces_matrix"]);

		// crease lines are calculated using each face's INVERSE matrix
		graph["re:faces_creases"] = graph["re:faces_matrix"]
			.map(mat => core.make_matrix2_inverse(mat))
			.map(mat => core.multiply_line_matrix2(point, vector, mat));
		graph["re:faces_center"] = Array.from(Array(faces_count$$1))
			.map((_, i) => make_face_center(graph, i));
		graph["re:faces_sidedness"] = Array.from(Array(faces_count$$1))
			.map((_, i) => pointSidedness(
				graph["re:faces_creases"][i][0],
				graph["re:faces_creases"][i][1],
				graph["re:faces_center"][i],
				graph["re:faces_coloring"][i]
			));
	};

	const prepare_extensions = function(graph) {
		let faces_count$$1 = graph.faces_vertices.length;
		if (graph["re:faces_layer"] == null) {
			// valid solution only when there is 1 face
			graph["re:faces_layer"] = Array.from(Array(faces_count$$1)).map(_ => 0);
		}
		// if (graph["re:face_stationary"] == null) {
		// 	graph["re:face_stationary"] = 0;
		// }
		if (graph["re:faces_to_move"] == null) {
			graph["re:faces_to_move"] = Array.from(Array(faces_count$$1)).map(_ => false);
		}
	};

	// export const point_in_folded_face = function(graph, point) {
	// 	let mats = PlanarGraph.make_faces_matrix_inv(graph, cpView.cp["re:face_stationary"]);
	// 	let transformed_points = mats.map(m => Geom.core.multiply_vector2_matrix2(point, m));

	// 	let circles = transformedPoints.map(p => cpView.drawLayer.circle(p[0], p[1], 0.01));
	// 	// console.log(circles);
	// 	let point_in_poly = transformedPoints.map((p,i) => faces[i].contains(p));

	// 	PlanarGraph.faces_containing_point({}, point) 
	// }

	/**
	 * this returns a copy of the graph with new crease lines.
	 * modifying the input graph with "re:" keys
	 * make sure graph at least follows fold file format
	 * any additional keys will be copied over.
	 */

	// for now, this uses "re:faces_layer", todo: use faceOrders
	const crease_through_layers = function(graph, point, vector, face_index, crease_direction = "V") {
		// console.log("+++++++++ crease_through_layers", point, vector, face_index);

		let opposite_crease = 
			(crease_direction === "M" || crease_direction === "m" ? "V" : "M");
		if (face_index == null) {
			// an unset face will be the face under the point. or if none, index 0
			let containing_point = face_containing_point(graph, point);
			// todo, if it's still unset, find the point 
			face_index = (containing_point === undefined) ? 0 : containing_point;
		}

		prepare_extensions(graph);
		prepare_to_fold(graph, point, vector, face_index);

		let folded = clone$1(graph);

		let faces_count$$1 = graph.faces_vertices.length;
		Array.from(Array(faces_count$$1)).map((_,i) => i).reverse()
			.forEach(i => {
				let diff = split_convex_polygon$1(
					folded, i,
					folded["re:faces_creases"][i][0],
					folded["re:faces_creases"][i][1],
					folded["re:faces_coloring"][i] ? crease_direction : opposite_crease
				);
				if (diff == null || diff.faces == null) { return; }
				// console.log("face_stationary", graph["re:face_stationary"]);
				// console.log("diff", diff);
				diff.faces.replace.forEach(replace => 
					replace.new.map(el => el.index)
						.map(index => index + diff.faces.map[index]) // new indices post-face removal
						.forEach(i => {
							folded["re:faces_center"][i] = make_face_center(folded, i);
							folded["re:faces_sidedness"][i] = pointSidedness(
								graph["re:faces_creases"][replace.old][0],
								graph["re:faces_creases"][replace.old][1],
								folded["re:faces_center"][i],
								graph["re:faces_coloring"][replace.old]
							);
							folded["re:faces_layer"][i] = graph["re:faces_layer"][replace.old];
							folded["re:faces_preindex"][i] = graph["re:faces_preindex"][replace.old];
						})
				);
			});
		folded["re:faces_layer"] = foldLayers(
			folded["re:faces_layer"],
			folded["re:faces_sidedness"]
		);

		let new_face_stationary, old_face_stationary;
		for (var i = 0; i < folded["re:faces_preindex"].length; i++) {
			if (!folded["re:faces_sidedness"][i]) {
				old_face_stationary = folded["re:faces_preindex"][i];
				new_face_stationary = i;
				break;
			}
		}

		let first_matrix;
		if (new_face_stationary === undefined) {
			first_matrix = core.make_matrix2_reflection(vector, point);
			first_matrix = core.multiply_matrices2(first_matrix, graph["re:faces_matrix"][0]);
			new_face_stationary = 0; // can be any face;
		} else {
			first_matrix = graph["re:faces_matrix"][old_face_stationary];
		}

		let folded_faces_matrix = make_faces_matrix(folded, new_face_stationary)
			.map(m => core.multiply_matrices2(first_matrix, m));

		folded["re:faces_coloring"] = faces_matrix_coloring(folded_faces_matrix);

		let folded_vertices_coords = fold_vertices_coords(folded, new_face_stationary, folded_faces_matrix);
		let folded_frame = {
			vertices_coords: folded_vertices_coords,
			frame_classes: ["foldedForm"],
			frame_inherit: true,
			frame_parent: 0, // this is not always the case. maybe shouldn't imply this here.
			// "re:face_stationary": new_face_stationary,
			"re:faces_matrix": folded_faces_matrix
		};

		folded.file_frames = [folded_frame];

		// let need_to_remove = [
		// 	"re:faces_center",
		// 	"re:faces_coloring",
		// 	"re:faces_creases",
		// 	"re:faces_folding",
		// 	"re:faces_layer",
		// 	"re:faces_matrix",
		// 	"re:faces_preindex",
		// 	"re:faces_sidedness",
		// 	"re:faces_to_move"
		// ];

		return folded;
	};

	// export function crease_folded(graph, point, vector, face_index) {
	// 	// if face isn't set, it will be determined by whichever face
	// 	// is directly underneath point. or if none, index 0.
	// 	if (face_index == null) {
	// 		face_index = PlanarGraph.face_containing_point(graph, point);
	// 		if(face_index === undefined) { face_index = 0; }
	// 	}
	// 	let primaryLine = Geom.Line(point, vector);
	// 	let coloring = Graph.faces_coloring(graph, face_index);
	// 	PlanarGraph.make_faces_matrix_inv(graph, face_index)
	// 		.map(m => primaryLine.transform(m))
	// 		.reverse()
	// 		.forEach((line, reverse_i, arr) => {
	// 			let i = arr.length - 1 - reverse_i;
	// 			let diff = PlanarGraph.split_convex_polygon(graph, i, line.point, line.vector, coloring[i] ? "M" : "V");
	// 		});
	// }

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
		let line = core.axiom[1](pointA, pointB);
		return crease_line(graph, line[0], line[1]);
	}
	function axiom2$1(graph, pointA, pointB) {
		let line = core.axiom[2](pointA, pointB);
		return crease_line(graph, line[0], line[1]);
	}
	function axiom3$1(graph, pointA, vectorA, pointB, vectorB) {
		let lines = core.axiom[3](pointA, vectorA, pointB, vectorB);
		// todo: each iteration needs to apply the diff to the prev iterations
		// return lines.map(line => crease_line(graph, line[0], line[1]))
		// 	.reduce((a,b) => a.concat(b), []);
		return crease_line(graph, lines[0][0], lines[0][1]);
	}
	function axiom4$1(graph, pointA, vectorA, pointB) {
		let line = core.axiom[4](pointA, vectorA, pointB);
		return crease_line(graph, line[0], line[1]);
	}
	function axiom5$1(graph, pointA, vectorA, pointB, pointC) {
		let line = core.axiom[5](pointA, vectorA, pointB, pointC);
		return crease_line(graph, line[0], line[1]);
	}
	function axiom6$1(graph, pointA, vectorA, pointB, vectorB, pointC, pointD) {
		let line = core.axiom[6](pointA, vectorA, pointB, vectorB, pointC, pointD);
		return crease_line(graph, line[0], line[1]);
	}
	function axiom7$1(graph, pointA, vectorA, pointB, vectorB, pointC) {
		let line = core.axiom[7](pointA, vectorA, pointB, vectorB, pointC);
		return crease_line(graph, line[0], line[1]);
	}

	// export function creaseLine(graph, point, vector) {
	// 	// todo idk if this is done
	// 	let ray = Geom.Line(point, vector);
	// 	graph.faces_vertices.forEach(face => {
	// 		let points = face.map(v => graph.vertices_coords[v]);
	// 		Geom.core.intersection.clip_line_in_convex_poly(points, point, vector);
	// 	})
	// 	return crease_line(graph, line[0], line[1]);
	// }

	function creaseRay(graph, point, vector) {
		// todo idk if this is done
		let ray = Ray(point, vector);
		graph.faces_vertices.forEach(face => {
			let points = face.map(v => graph.vertices_coords[v]);
			core.intersection.clip_ray_in_convex_poly(points, point, vector);
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
	// 		return RabbitEar.math.core.counter_clockwise_angle2(v, nextV);
	// 	});
	// }

	let vertex_adjacent_vectors = function(graph, vertex) {
		let adjacent = graph.vertices_vertices[vertex];
		return adjacent.map(v => [
			graph.vertices_coords[v][0] - graph.vertices_coords[vertex][0],
			graph.vertices_coords[v][1] - graph.vertices_coords[vertex][1]
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
			return core.counter_clockwise_angle2(v, nextV);
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
			core.multiply_vector2_matrix2(point, faces_matrix[vertex_in_face[i]]).map((n) => 
				core.clean_number(n)
			)
		);
		fold.frame_classes = ["foldedForm"];
		fold.vertices_coords = new_vertices_coords_cp;
		return fold;
	}


	const fold_vertices_coords = function(graph, face_stationary, faces_matrix) {
		if (face_stationary == null) {
			console.warn("fold_vertices_coords was not supplied a stationary face");
			face_stationary = 0;
		}
		if (faces_matrix == null) {
			faces_matrix = make_faces_matrix(graph, face_stationary);
		}
		let vertex_in_face = graph.vertices_coords.map((v,i) => {
			for(let f = 0; f < graph.faces_vertices.length; f++) {
				if (graph.faces_vertices[f].includes(i)){ return f; }
			}
		});
		return graph.vertices_coords.map((point,i) =>
			core.multiply_vector2_matrix2(point, faces_matrix[vertex_in_face[i]]).map((n) => 
				core.clean_number(n)
			)
		)
	};

	var Origami = /*#__PURE__*/Object.freeze({
		build_folded_frame: build_folded_frame,
		universal_molecule: universal_molecule,
		foldLayers: foldLayers,
		crease_through_layers: crease_through_layers,
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
		fold_without_layering: fold_without_layering,
		fold_vertices_coords: fold_vertices_coords
	});

	/* (c) Robby Kraft, MIT License */

	/**
	 * .FOLD file into SVG, and back
	 */

	/**
	 * if you already have groups initialized, to save on re-initializing, pass the groups
	 * in as values under these keys, and they will get drawn into.
	 */
	const intoGroups = function(graph, {boundaries, faces, creases, vertices}) {
		if (boundaries){ drawBoundary(graph).forEach(b => boundaries.appendChild(b)); }
		if (faces){ drawFaces(graph).forEach(f => faces.appendChild(f)); }
		if (creases){ drawCreases(graph).forEach(c => creases.appendChild(c)); }
		if (vertices){ drawVertices(graph).forEach(v => vertices.appendChild(v)); }
	};

	const drawBoundary = function(graph) {
		let boundary = get_boundary_vertices(graph)
			.map(v => graph.vertices_coords[v]);
		return [polygon(boundary).setClass("boundary")];
	};

	const drawVertices = function(graph, options) {
		let radius = options && options.radius ? options.radius : 0.01;
		return graph.vertices_coords.map((v,i) =>
			circle(v[0], v[1], radius)
				.setClass("vertex")
				.setID(""+i)
		);
	};

	const drawCreases = function(graph) {
		let edges = graph.edges_vertices
			.map(ev => ev.map(v => graph.vertices_coords[v]));
		let eAssignments = graph.edges_assignment.map(a => CREASE_NAMES[a]);
		return edges.map((e,i) =>
			line$1(e[0][0], e[0][1], e[1][0], e[1][1])
				.setClass(eAssignments[i])
				.setID(""+i)
		);
	};

	function faces_sorted_by_layer(faces_layer) {
		return faces_layer.map((layer,i) => ({layer:layer, i:i}))
			.sort((a,b) => a.layer-b.layer)
			.map(el => el.i)
	}

	const drawFaces = function(graph) {
		let facesV = graph.faces_vertices
			.map(fv => fv.map(v => graph.vertices_coords[v]));
			// .map(face => Geom.Polygon(face));

		// determine coloring of each face
		let coloring = graph["re:faces_coloring"];
		if (coloring == null) {
			if (graph["re:faces_matrix"] != null) {
				coloring = faces_matrix_coloring(graph["re:faces_matrix"]);
			} else {
				// last resort. assuming a lot with the 0 face.
				coloring = faces_coloring(graph, 0);
			}
		}

		// determine layer order
		let orderIsCertain = graph["re:faces_layer"] != null;

		let order = graph["re:faces_layer"] != null
			? faces_sorted_by_layer(graph["re:faces_layer"])
			: graph.faces_vertices.map((_,i) => i);

		return orderIsCertain
			? order.map(i => polygon(facesV[i])
				.setClass(coloring[i] ? "front" : "back")
				.setID(""+i))
			: order.map(i =>polygon(facesV[i]).setID(""+i));
	};

	// import * as Fold from "../include/fold";


	const intoFOLD = function(input, callback) {
		return load_file(input, function(fold) {
			if (callback != null) { callback(fold); }
		});
	};

	const intoSVG = function(input, callback) {
		let syncFold, async = false;
		// attempt to load synchronously, the callback will be called regardless,
		// we need a flag to flip when the call is done, then check if the async
		// call is in progress
		syncFold = load_file(input, function(fold) {
			if (async) {
				let svg$$1 = fold_to_svg(fold);
				if (callback != null) { 
					callback(svg$$1);
				}
			}
		});
		async = true;
		// if the load was synchronous, syncFold will contain data. if not,
		// let the callback above finish off the conversion.
		if (syncFold !== undefined) {
			let svg$$1 = fold_to_svg(syncFold);
			if (callback != null) { 
				callback(svg$$1);
			}
			return svg$$1;
		}
	};

	const intoORIPA = function(input, callback) {

	};

	/**
	 * specify a frame number otherwise it will render the top level
	 */
	const fold_to_svg = function(fold, frame_number = 0) {
		// console.log("fold_to_svg start");
		let graph = frame_number
			? flatten_frame(fold, frame_number)
			: fold;
		// if (isFolded(graph)) { }
		let svg$$1 = svg();
		svg$$1.setAttribute("x", "0px");
		svg$$1.setAttribute("y", "0px");
		svg$$1.setAttribute("width", "600px");
		svg$$1.setAttribute("height", "600px");
		let groupNames = ["boundary", "face", "crease", "vertex"]
			.map(singular => groupNamesPlural[singular]);
		let groups = groupNames.map(key => svg$$1.group().setID(key));
		// console.log("fold_to_svg about to fill");
		// console.log(svg, {...groups});
		// return svg;
		intoGroups(graph, {...groups});
		setViewBox(svg$$1, ...bounding_rect(graph));
		// console.log("fold_to_svg done");
		return svg$$1;
	};

	const groupNamesPlural = {
		boundary: "boundaries",
		face: "faces",
		crease: "creases",
		vertex: "vertices"
	};

	var empty = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_title\": \"\",\n\t\"file_description\": \"\",\n\t\"file_classes\": [],\n\t\"file_frames\": [],\n\n\t\"frame_author\": \"\",\n\t\"frame_title\": \"\",\n\t\"frame_description\": \"\",\n\t\"frame_attributes\": [],\n\t\"frame_classes\": [],\n\t\"frame_unit\": \"\",\n\n\t\"vertices_coords\": [],\n\t\"vertices_vertices\": [],\n\t\"vertices_faces\": [],\n\n\t\"edges_vertices\": [],\n\t\"edges_faces\": [],\n\t\"edges_assignment\": [],\n\t\"edges_foldAngle\": [],\n\t\"edges_length\": [],\n\n\t\"faces_vertices\": [],\n\t\"faces_edges\": [],\n\n\t\"edgeOrders\": [],\n\t\"faceOrders\": []\n}\n";

	var square = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"\",\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [[0,0], [1,0], [1,1], [0,1]],\n\t\"vertices_vertices\": [[1,3], [2,0], [3,1], [0,2]],\n\t\"vertices_faces\": [[0], [0], [0], [0]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,0]],\n\t\"edges_faces\": [[0], [0], [0], [0]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0],\n\t\"edges_length\": [1, 1, 1, 1],\n\t\"faces_vertices\": [[0,1,2,3]],\n\t\"faces_edges\": [[0,1,2,3]],\n\t\"re:faces_layer\": [0]\n}";

	var book = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"\",\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [[0,0], [0.5,0], [1,0], [1,1], [0.5,1], [0,1]],\n\t\"vertices_vertices\": [[1,5], [2,4,0], [3,1], [4,2], [5,1,3], [0,4]],\n\t\"vertices_faces\": [[0], [0,1], [1], [1], [1,0], [0]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [1,4]],\n\t\"edges_faces\": [[0], [1], [1], [1], [0], [0], [0,1]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"V\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 180],\n\t\"edges_length\": [0.5, 0.5, 1, 0.5, 0.5, 1, 1],\n\t\"faces_vertices\": [[1,4,5,0], [4,1,2,3]],\n\t\"faces_edges\": [[6,4,5,0], [6,1,2,3]]\n}";

	var blintz = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"blintz base\",\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [[0,0], [0.5,0], [1,0], [1,0.5], [1,1], [0.5,1], [0,1], [0,0.5]],\n\t\"vertices_vertices\": [[1,7], [2,3,7,0], [3,1], [4,5,1,2], [5,3], [6,7,3,4], [7,5], [0,1,5,6]],\n\t\"vertices_faces\": [[0], [1,4,0], [1], [2,4,1], [2], [3,4,2], [3], [0,4,3]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,0], [1,3], [3,5], [5,7], [7,1]],\n\t\"edges_faces\": [[0], [1], [1], [2], [2], [3], [3], [0], [1,4], [2,4], [3,4], [0,4]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"V\",\"V\",\"V\",\"V\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n\t\"edges_length\": [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.707106781186548, 0.707106781186548, 0.707106781186548, 0.707106781186548],\n\t\"faces_vertices\": [[0,1,7], [2,3,1], [4,5,3], [6,7,5], [1,3,5,7]],\n\t\"faces_edges\": [[0,11,7], [2,8,1], [4,9,3], [6,10,5], [8,9,10,11]],\n\t\"file_frames\": [{\n\t\t\"frame_classes\": [\"foldedForm\"],\n\t\t\"frame_parent\": 0,\n\t\t\"frame_inherit\": true,\n\t\t\"vertices_coords\": [[0.5,0.5], [0.5,0.0], [0.5,0.5], [1.0,0.5], [0.5,0.5], [0.5,1.0], [0.5,0.5], [0.0,0.5]],\n\t\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 180, 180, 180, 180],\n\t\t\"faceOrders\": [[0,4,1], [1,4,1], [2,4,1], [3,4,1]]\n\t}]\n}";

	var kite = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"kite base\",\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [[0,0], [0.414213562373095,0], [1,0], [1,0.585786437626905], [1,1], [0,1]],\n\t\"vertices_vertices\": [[1,5], [2,5,0], [3,5,1], [4,5,2], [5,3], [0,1,2,3,4]],\n\t\"vertices_faces\": [[0], [1,0], [2,1], [3,2], [3], [0,1,2,3]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [5,1], [3,5], [5,2]],\n\t\"edges_faces\": [[0], [1], [2], [3], [3], [0], [0,1], [3,2], [1,2]],\n\t\"edges_assignment\": [\"B\", \"B\", \"B\", \"B\", \"B\", \"B\", \"V\", \"V\", \"F\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 0],\n\t\"edges_length\": [0.414213562373095, 0.585786437626905, 0.585786437626905, 0.414213562373095, 1, 1, 1.082392200292394, 1.082392200292394, 1.414213562373095],\n\t\"faces_vertices\": [[0,1,5], [1,2,5], [2,3,5], [3,4,5]],\n\t\"faces_edges\": [[0,6,5], [1,8,6], [2,7,8], [3,4,7]],\n\t\"file_frames\": [{\n\t\t\"frame_classes\": [\"foldedForm\"],\n\t\t\"frame_parent\": 0,\n\t\t\"frame_inherit\": true,\n\t\t\"vertices_coords\": [[0.707106781186548,0.292893218813452],[1,0],[0.707106781186548,0.292893218813452],[0,1],[0.414213562373095,0],[1,0.585786437626905]],\n\t\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 180, 180, 0],\n\t\t\"faceOrders\": [[0,1,1], [3,2,1]]\n\t}]\n}";

	var fish = "{\n\t\"this base is broken\": true,\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"\",\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [[0,0],[1,0],[1,1],[0,1],[0.292893218813452,0.292893218813452],[0.707106781186548,0.707106781186548],[0.292893218813452,0],[1,0.707106781186548]],\n\t\"vertices_vertices\": [[6,4,3],[7,5,3,4,6],[3,5,7],[0,4,1,5,2],[0,6,2,3],[1,7,2,3],[1,4,0],[2,5,1]],\n\t\"vertices_faces\":[[1,4],[2,3,5,6],[0,7],[0,1,2,3],[1,3,4,5],[0,2,6,7],[4,5],[6,7]],\n\t\"edges_vertices\": [[2,3],[3,0],[3,1],[0,4],[1,4],[3,4],[1,5],[2,5],[3,5],[4,6],[0,6],[6,1],[5,7],[1,7],[7,2]],\n\t\"edges_faces\":[[0],[0,2],[0,7],[1],[1,4],[1,3],[2,3],[2,6],[3,5],[4],[4,5],[5],[6],[6,7],[7]],\n\t\"edges_length\": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\n\t\"edges_foldAngle\": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\n\t\"edges_assignment\": [\"B\",\"B\",\"F\",\"M\",\"M\",\"M\",\"M\",\"M\",\"M\",\"V\",\"B\",\"B\",\"V\",\"B\",\"B\"],\n\t\"faces_vertices\": [[2,3,5],[3,0,4],[3,1,5],[1,3,4],[4,0,6],[1,4,6],[5,1,7],[2,5,7]],\n\t\"faces_edges\": [[0,8,7],[1,3,5],[2,6,8],[2,5,4],[3,10,9],[4,9,11],[6,13,12],[7,12,14]],\n\t\"file_frames\": [{\n\t\t\"frame_classes\": [\"foldedForm\"],\n\t\t\"frame_parent\": 0,\n\t\t\"frame_inherit\": true,\n\t\t\"vertices_coords\": [[0.707106781186548,0.292893218813452],[1,0],[0.707106781186548,0.292893218813452],[0,1],[0.292893218813452,0.292893218813452],[0.707106781186548,0.707106781186548],[0.5,0.5],[0.5,0.5]]\n\t}]\n}";

	var bird = "{\n\t\"file_spec\": 1.1,\n\t\"frame_title\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [[0,0],[1,0],[1,1],[0,1],[0.5,0.5],[0.207106781186548,0.5],[0.5,0.207106781186548],[0.792893218813452,0.5],[0.5,0.792893218813452],[0.353553390593274,0.646446609406726],[0.646446609406726,0.646446609406726],[0.646446609406726,0.353553390593274],[0.353553390593274,0.353553390593274],[0,0.5],[0.5,0],[1,0.5],[0.5,1]],\n\t\"edges_vertices\": [[3,5],[5,9],[3,9],[3,13],[5,13],[0,5],[0,13],[0,12],[5,12],[4,5],[4,12],[4,9],[0,6],[6,12],[0,14],[6,14],[1,6],[1,14],[1,11],[6,11],[4,6],[4,11],[1,7],[7,11],[1,15],[7,15],[2,7],[2,15],[2,10],[7,10],[4,7],[4,10],[2,8],[8,10],[2,16],[8,16],[3,8],[3,16],[8,9],[4,8]],\n\t\"edges_faces\": [[0,1],[0,5],[21,0],[1],[2,1],[2,3],[2],[3,6],[4,3],[4,5],[11,4],[5,22],[6,7],[6,11],[7],[8,7],[8,9],[8],[9,12],[10,9],[10,11],[17,10],[12,13],[12,17],[13],[14,13],[14,15],[14],[15,18],[16,15],[16,17],[23,16],[18,19],[18,23],[19],[20,19],[20,21],[20],[22,21],[22,23]],\n\t\"edges_assignment\": [\"M\",\"F\",\"V\",\"B\",\"V\",\"M\",\"B\",\"F\",\"F\",\"M\",\"F\",\"V\",\"M\",\"F\",\"B\",\"V\",\"M\",\"B\",\"V\",\"F\",\"M\",\"V\",\"M\",\"F\",\"B\",\"V\",\"M\",\"B\",\"F\",\"F\",\"M\",\"F\",\"M\",\"F\",\"B\",\"V\",\"M\",\"B\",\"F\",\"M\"],\n\t\"faces_vertices\": [[3,5,9],[5,3,13],[0,5,13],[5,0,12],[4,5,12],[5,4,9],[0,6,12],[6,0,14],[1,6,14],[6,1,11],[4,6,11],[6,4,12],[1,7,11],[7,1,15],[2,7,15],[7,2,10],[4,7,10],[7,4,11],[2,8,10],[8,2,16],[3,8,16],[8,3,9],[4,8,9],[8,4,10]],\n\t\"faces_edges\": [[0,1,2],[0,3,4],[5,4,6],[5,7,8],[9,8,10],[9,11,1],[12,13,7],[12,14,15],[16,15,17],[16,18,19],[20,19,21],[20,10,13],[22,23,18],[22,24,25],[26,25,27],[26,28,29],[30,29,31],[30,21,23],[32,33,28],[32,34,35],[36,35,37],[36,2,38],[39,38,11],[39,31,33]]\n}";

	var frog = "{\n\t\"file_spec\": 1.1,\n\t\"frame_title\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [[0,0],[1,0],[1,1],[0,1],[0.5,0.5],[0,0.5],[0.5,0],[1,0.5],[0.5,1],[0.146446609406726,0.353553390593274],[0.353553390593274,0.146446609406726],[0.646446609406726,0.146446609406726],[0.853553390593274,0.353553390593274],[0.853553390593274,0.646446609406726],[0.646446609406726,0.853553390593274],[0.353553390593274,0.853553390593274],[0.146446609406726,0.646446609406726],[0,0.353553390593274],[0,0.646446609406726],[0.353553390593274,0],[0.646446609406726,0],[1,0.353553390593274],[1,0.646446609406726],[0.646446609406726,1],[0.353553390593274,1]],\n\t\"edges_vertices\": [[0,4],[4,9],[0,9],[0,10],[4,10],[2,4],[2,14],[4,14],[4,13],[2,13],[3,4],[4,15],[3,15],[3,16],[4,16],[1,4],[1,12],[4,12],[4,11],[1,11],[4,5],[5,9],[5,16],[4,6],[6,11],[6,10],[4,7],[7,13],[7,12],[4,8],[8,15],[8,14],[9,17],[0,17],[5,17],[0,19],[10,19],[6,19],[11,20],[1,20],[6,20],[1,21],[12,21],[7,21],[13,22],[2,22],[7,22],[2,23],[14,23],[8,23],[15,24],[3,24],[8,24],[3,18],[16,18],[5,18]],\n\t\"edges_faces\": [[0,1],[0,8],[16,0],[1,18],[11,1],[3,2],[2,26],[15,2],[3,12],[24,3],[4,5],[4,14],[28,4],[5,30],[9,5],[7,6],[6,22],[13,6],[7,10],[20,7],[8,9],[8,17],[31,9],[10,11],[10,21],[19,11],[12,13],[12,25],[23,13],[14,15],[14,29],[27,15],[16,17],[16],[17],[18],[19,18],[19],[20,21],[20],[21],[22],[23,22],[23],[24,25],[24],[25],[26],[27,26],[27],[28,29],[28],[29],[30],[31,30],[31]],\n\t\"edges_assignment\": [\"F\",\"M\",\"M\",\"M\",\"M\",\"F\",\"M\",\"M\",\"M\",\"M\",\"V\",\"M\",\"M\",\"M\",\"M\",\"V\",\"M\",\"M\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\"],\n\t\"faces_vertices\": [[0,4,9],[4,0,10],[4,2,14],[2,4,13],[3,4,15],[4,3,16],[4,1,12],[1,4,11],[4,5,9],[5,4,16],[4,6,11],[6,4,10],[4,7,13],[7,4,12],[4,8,15],[8,4,14],[0,9,17],[9,5,17],[10,0,19],[6,10,19],[1,11,20],[11,6,20],[12,1,21],[7,12,21],[2,13,22],[13,7,22],[14,2,23],[8,14,23],[3,15,24],[15,8,24],[16,3,18],[5,16,18]],\n\t\"faces_edges\": [[0,1,2],[0,3,4],[5,6,7],[5,8,9],[10,11,12],[10,13,14],[15,16,17],[15,18,19],[20,21,1],[20,14,22],[23,24,18],[23,4,25],[26,27,8],[26,17,28],[29,30,11],[29,7,31],[2,32,33],[21,34,32],[3,35,36],[25,36,37],[19,38,39],[24,40,38],[16,41,42],[28,42,43],[9,44,45],[27,46,44],[6,47,48],[31,48,49],[12,50,51],[30,52,50],[13,53,54],[22,54,55]]\n}";

	/** 
	 * this searches user-provided inputs for a valid n-dimensional vector 
	 * which includes objects {x:, y:}, arrays [x,y], or sequences of numbers
	 * 
	 * @returns (number[]) array of number components
	 *   invalid/no input returns an emptry array
	*/

	const is_vector = function(arg) {
		return arg != null
			&& arg[0] != null
			&& arg[1] != null
			&& !isNaN(arg[0])
			&& !isNaN(arg[1]);
	};
	const is_number = function(n) {
		return n != null && !isNaN(n);
	};

	const clean_number$1 = function(num, decimalPlaces = 15) {
		// todo, this fails when num is a string, consider checking
		return (num == null
			? undefined
			: parseFloat(num.toFixed(decimalPlaces)));
	};

	const get_vec$1 = function() {
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
	};

	const get_two_vec2$1 = function() {
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
	};

	const get_two_lines = function() {
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
	};

	const makeUUID = function() {
		// there is a non-zero chance this generates duplicate strings
		const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		return Array.from(Array(24))
			.map(_ => Math.floor(Math.random()*digits.length))
			.map(i => digits[i])
			.join('');
	};

	/**
	 * this is meant to be a prototype
	 * a component relates 1:1 to something in the FOLD graph, vertex/edge/face.
	 */
	const Component = function(proto, options) {
		if(proto == null) {
			proto = {};
		}
		if (options != null) {
			proto.graph = options.graph; // pointer back to the graph
			proto.index = options.index; // index of this crease in the graph
		}
		proto.uuid = makeUUID();

		const disable = function() {
			Object.setPrototypeOf(this, null);
			Object.getOwnPropertyNames(this)
				.forEach(key => delete this[key]);
		};
		Object.defineProperty(proto, "disable", { value: disable});
		return Object.freeze(proto);
	};

	/**
	 * in each of these, properties should be set to configurable so that
	 * the object can be disabled, and all property keys erased.
	 */

	const Vertex = function(graph, index) {
		let point = Vector(graph.vertices_coords[index]);
		let _this = Object.create(Component(point, {graph, index}));
		return _this;
	};

	const Face = function(graph, index) {
		let points = graph.faces_vertices[index]
			.map(fv => graph.vertices_coords[fv]);
		let face = Polygon(points);
		let _this = Object.create(Component(face, {graph, index}));
		return _this;
	};

	const Edge$1 = function(graph, index) {

		let points = graph.edges_vertices[index]
			.map(ev => graph.vertices_coords[ev]);
		let edge = Edge(points);

		let _this = Object.create(Component(edge, {graph, index}));

		const is_assignment = function(options) {
			return options.map(l => l === this.graph.edges_assignment[index])
				.reduce((a,b) => a || b, false);
		};
		const is_mountain = function() {
			return is_assignment.call(this, ["M", "m"]);
		};
		const is_valley = function() {
			return is_assignment.call(this, ["V", "v"]);
		};
		const is_boundary = function() {
			return is_assignment.call(this, ["B", "b"]);
		};

		const flip = function() {
			if (is_mountain.call(this)) { valley.call(this); }
			else if (is_valley.call(this)) { mountain.call(this); }
			else { return; } // don't trigger the callback
			if (typeof this.graph.onchange === "function") { this.graph.onchange(); }
		};
		const mountain = function() {
			this.graph.edges_assignment[index] = "M";
			this.graph.edges_foldAngle[index] = -180;
			if (typeof this.graph.onchange === "function") { this.graph.onchange(); }
		};
		const valley = function() {
			this.graph.edges_assignment[index] = "V";
			this.graph.edges_foldAngle[index] = 180;
			if (typeof this.graph.onchange === "function") { this.graph.onchange(); }
		};
		const mark = function() {
			this.graph.edges_assignment[index] = "F";
			this.graph.edges_foldAngle[index] = 0;
			if (typeof this.graph.onchange === "function") { this.graph.onchange(); }
		};
		const addVertexOnEdge = function(x, y) {
			let thisEdge = this.index;
			this.graph.addVertexOnEdge(x, y, thisEdge);
		};

		Object.defineProperty(_this, "mountain", {configurable: true, value: mountain});
		Object.defineProperty(_this, "valley", {configurable: true, value: valley});
		Object.defineProperty(_this, "mark", {configurable: true, value: mark});
		Object.defineProperty(_this, "flip", {configurable: true, value: flip});
		Object.defineProperty(_this, "isBoundary", {
			configurable: true,
			get: function(){ return is_boundary.call(this); }
		});
		Object.defineProperty(_this, "isMountain", {
			configurable: true,
			get: function(){ return is_mountain.call(this); }
		});
		Object.defineProperty(_this, "isValley", {
			configurable: true,
			get: function(){ return is_valley.call(this); }
		});
		// Object.defineProperty(_this, "remove", {value: remove});
		Object.defineProperty(_this, "addVertexOnEdge", {configurable: true, value: addVertexOnEdge});
		return _this;
	};


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

		// Object.create(Component())

		return {
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

	const template = function() {
		return {
			file_spec: 1.1,
			file_creator: "Rabbit Ear",
			file_author: "",
			file_title: "",
			file_description: "",
			file_classes: [],
			file_frames: [],

			frame_author: "",
			frame_title: "",
			frame_description: "",
			frame_attributes: [],
			frame_classes: [],
			frame_unit: "unit",
		};
	};

	const cp_type = function() {
		return {
			file_classes: ["singleModel"],
			frame_attributes: ["2D"],
			frame_classes: ["creasePattern"],
		};
	};

	const square_graph = function() {
		return {
			vertices_coords: [[0,0], [1,0], [1,1], [0,1]],
			vertices_vertices: [[1,3], [2,0], [3,1], [0,2]],
			vertices_faces: [[0], [0], [0], [0]],
			edges_vertices: [[0,1], [1,2], [2,3], [3,0]],
			edges_faces: [[0], [0], [0], [0]],
			edges_assignment: ["B","B","B","B"],
			edges_foldAngle: [0, 0, 0, 0],
			edges_length: [1, 1, 1, 1],
			faces_vertices: [[0,1,2,3]],
			faces_edges: [[0,1,2,3]]
		};
	};


	const square$1 = function(width, height) {
		return Object.assign(
			Object.create(null),
			template(),
			cp_type,
			square_graph()
		);
	};

	const rectangle = function(width, height) {
		let graph = square_graph();
		graph.vertices_coords = [[0,0], [width,0], [width,height], [0,height]];
		graph.edges_length = [width, height, width, height];
		return Object.assign(
			Object.create(null),
			template(),
			cp_type,
			graph
		);
	};

	const regular_polygon = function(sides, radius = 1) {
		let arr = Array.from(Array(sides));
		let angle = 2 * Math.PI / sides;
		let sideLength = clean_number$1(Math.sqrt(
			Math.pow(radius - radius*Math.cos(angle), 2) +
			Math.pow(radius*Math.sin(angle), 2)
		));
		let graph = {
			// vertices_
			vertices_coords: arr.map((_,i) => angle * i).map(a => [
				clean_number$1(radius*Math.cos(a)),
				clean_number$1(radius*Math.sin(a))
			]),
			vertices_vertices: arr
				.map((_,i) => [(i+1)%arr.length, (i+arr.length-1)%arr.length]),
			vertices_faces: arr.map(_ => [0]),
			// edges_
			edges_vertices: arr.map((_,i) => [i, (i+1)%arr.length]),
			edges_faces: arr.map(_ => [0]),
			edges_assignment: arr.map(_ => "B"),
			edges_foldAngle: arr.map(_ => 0),
			edges_length: arr.map(_ => sideLength),
			// faces_
			faces_vertices: [arr.map((_,i) => i)],
			faces_edges: [arr.map((_,i) => i)],
			// "re:faces_layer": [0]
		};
		return Object.assign(
			Object.create(null),
			template(),
			cp_type,
			graph
		);
	};

	// MIT open source license, Robby Kraft

	const CreasePatternPrototype = function(proto) {
		if(proto == null) {
			proto = {};
		}

		/** 
		 * the most important thing this class offers: this component array
		 * each object matches 1:1 a component in the FOLD graph.
		 * when a graph component gets removed, its corresponding object deletes
		 * itself so even if the user holds onto it, it no longer points to anything.
		 * each component brings extra functionality to these edges/faces/vertices.
		 * take great care to make sure they are always matching 1:1.
		 * keys are each component's UUID for speedy lookup.
		 */
		let components = {
			vertices: [],
			edges: [],
			faces: [],
			// boundary: {},
		};

		let _this;

		const bind = function(that){
			_this = that;
		};

		/**
		 * @param {file} is a FOLD object.
		 * @param {prevent_wipe} true and it will import without first clearing
		 */
		const load = function(file, prevent_wipe) {
			if (prevent_wipe == null || prevent_wipe !== true) {
				all_keys.forEach(key => delete _this[key]);
			}
			Object.assign(_this, JSON.parse(JSON.stringify(file)));
		};
		/**
		 * @return {CreasePattern} a deep copy of this object.
		 */ 
		const copy = function() {
			return CreasePattern(JSON.parse(JSON.stringify(_this)));
		};
		/**
		 * this removes all geometry from the crease pattern and returns it
		 * to its original state (and keeps the boundary edges if present)
		 */
		const clear = function() {
			remove_non_boundary_edges(_this);
			if (typeof _this.onchange === "function") { _this.onchange(); }
		};
		/**
		 * @return {Object} a deep copy of this object in the FOLD format.
		 */ 
		const json = function() {
			try {
				return Object.assign(Object.create(null), JSON.parse(JSON.stringify(_this)));
			} catch(error){
				console.warn("could not parse Crease Pattern into JSON", error);
			}
		};

		const svg = function(cssRules) {
			return fold_to_svg(_this);
		};

		// const wipe = function() {
		// 	Graph.all_keys.filter(a => _m[a] != null)
		// 		.forEach(key => delete _m[key]);
		// 	if (typeof this.onchange === "function") { this.onchange(); }
		// }

		// todo: memo these. they're created each time, even if the CP hasn't changed
		const getVertices = function() {
			components.vertices
				.filter(v => v.disable !== undefined)
				.forEach(v => v.disable());
			components.vertices = (_this.vertices_coords || [])
				.map((_,i) => Vertex(_this, i));
			return components.vertices;
		};
		const getEdges = function() {
			components.edges
				.filter(e => e.disable !== undefined)
				.forEach(e => e.disable());
			components.edges = (_this.edges_vertices || [])
				.map((_,i) => Edge$1(_this, i));
			return components.edges;
			// return (this.edges_vertices || [])
			// 		.map(e => e.map(ev => this.vertices_coords[ev]))
			// 		.map(e => Geometry.Edge(e));
		};
		const getFaces = function() {
			components.faces
				.filter(f => f.disable !== undefined)
				.forEach(f => f.disable());
			components.faces = (_this.faces_vertices || [])
				.map((_,i) => Face(_this, i));
			return components.faces;
			// return (this.faces_vertices || [])
			// 		.map(f => f.map(fv => this.vertices_coords[fv]))
			// 		.map(f => Polygon(f));
		};
		const getBoundary = function() {
			// todo: test this for another reason anyway
			// todo: this only works for unfolded flat crease patterns
			return Polygon(
				get_boundary_face(_this).vertices
					.map(v => _this.vertices_coords[v])
			);
		};
		const nearestVertex = function(x, y, z = 0) {
			let index = nearest_vertex(_this, [x, y, z]);
			return (index != null) ? Vertex(_this, index) : undefined;
		};
		const nearestEdge = function(x, y, z = 0) {
			let index = nearest_edge(_this, [x, y, z]);
			return (index != null) ? Edge$1(_this, index) : undefined;
		};
		const nearestFace = function(x, y, z = 0) {
			let index = face_containing_point(_this, [x, y, z]);
			return (index != null) ? Face(_this, index) : undefined;
		};

		const getFoldedForm = function() {
			let foldedFrame = _this.file_frames
				.filter(f => f.frame_classes.includes("foldedForm"))
				.filter(f => f.vertices_coords.length === _this.vertices_coords.length)
				.shift();
			return foldedFrame != null
				? merge_frame$1(_this, foldedFrame)
				: undefined;
		};


		// updates
		const didModifyGraph = function() {
			// remove file_frames which were dependent on this geometry. we can
			// no longer guarantee they match. alternatively we could mark them invalid
			
			// _this.file_frames = _this.file_frames
			// 	.filter(ff => !(ff.frame_inherit === true && ff.frame_parent === 0));
			
			// broadcast update to handler if attached
			if (typeof _this.onchange === "function") {
				_this.onchange();
			}
		};
		// fold methods
		const valleyFold = function(point, vector, face_index) {
			if (!is_vector(point) || !is_vector(vector) || !is_number(face_index)) {
				console.warn("valleyFold was not supplied the correct parameters");
				return;
			}
			let folded = crease_through_layers(_this, point, vector, face_index, "V");
			Object.keys(folded).forEach(key => _this[key] = folded[key]);
			delete _this["re:faces_matrix"];
			didModifyGraph();
		};

		const axiom = function(number, params) {
			let args;
			switch(number) {
				case 1: args = get_two_vec2$1(params); break;
				case 2: args = get_two_vec2$1(params); break;
				case 3: args = get_two_lines(params); break;
				case 4: args = get_two_lines(params); break;
				case 5: args = get_two_lines(params); break;
				case 6: args = get_two_lines(params); break;
				case 7: args = get_two_lines(params); break;
			}
			if (args === undefined) {
				throw "axiom " + number + " was not provided with the correct inputs";
			}
			let crease = Crease(_this, Origami["axiom"+number](_this, ...args));
			didModifyGraph();
			return crease;
		};
		const axiom1 = function() { return axiom.call(_this, [1, arguments]); };
		const axiom2 = function() { return axiom.call(_this, [2, arguments]); };
		const axiom3 = function() { return axiom.call(_this, [3, arguments]); };
		const axiom4 = function() { return axiom.call(_this, [4, arguments]); };
		const axiom5 = function() { return axiom.call(_this, [5, arguments]); };
		const axiom6 = function() { return axiom.call(_this, [6, arguments]); };
		const axiom7 = function() { return axiom.call(_this, [7, arguments]); };

		const addVertexOnEdge = function(x, y, oldEdgeIndex) {
			add_vertex_on_edge(_this, x, y, oldEdgeIndex);
			didModifyGraph();
		};

		const creaseLine = function() {
			let crease = Crease(this, crease_line(_this, ...arguments));
			didModifyGraph();
			return crease;
		};
		const creaseRay$$1 = function() {
			let crease = Crease(this, creaseRay(_this, ...arguments));
			didModifyGraph();
			return crease;
		};
		const creaseSegment$$1 = function() {
			let crease = Crease(this, creaseSegment(_this, ...arguments));
			didModifyGraph();
			return crease;
		};
		const creaseThroughLayers = function(point, vector, face) {
			RabbitEar.fold.origami.crease_folded(_this, point, vector, face);
			didModifyGraph();
		};
		const kawasaki = function() {
			let crease = Crease(this, kawasaki_collapse(_this, ...arguments));
			didModifyGraph();
			return crease;
		};

		Object.defineProperty(proto, "getFoldedForm", { value: getFoldedForm });

		Object.defineProperty(proto, "boundary", { get: getBoundary });
		Object.defineProperty(proto, "vertices", { get: getVertices });
		Object.defineProperty(proto, "edges", { get: getEdges });
		Object.defineProperty(proto, "faces", { get: getFaces });
		Object.defineProperty(proto, "clear", { value: clear });
		Object.defineProperty(proto, "load", { value: load });
		Object.defineProperty(proto, "copy", { value: copy });
		Object.defineProperty(proto, "bind", { value: bind });
		Object.defineProperty(proto, "json", { get: json });
		Object.defineProperty(proto, "nearestVertex", { value: nearestVertex });
		Object.defineProperty(proto, "nearestEdge", { value: nearestEdge });
		Object.defineProperty(proto, "nearestFace", { value: nearestFace });
		Object.defineProperty(proto, "svg", { value: svg });

		Object.defineProperty(proto, "axiom1", { value: axiom1 });
		Object.defineProperty(proto, "axiom2", { value: axiom2 });
		Object.defineProperty(proto, "axiom3", { value: axiom3 });
		Object.defineProperty(proto, "axiom4", { value: axiom4 });
		Object.defineProperty(proto, "axiom5", { value: axiom5 });
		Object.defineProperty(proto, "axiom6", { value: axiom6 });
		Object.defineProperty(proto, "axiom7", { value: axiom7 });
		Object.defineProperty(proto, "valleyFold", { value: valleyFold });
		Object.defineProperty(proto, "addVertexOnEdge", { value: addVertexOnEdge });
		Object.defineProperty(proto, "creaseLine", { value: creaseLine });
		Object.defineProperty(proto, "creaseRay", { value: creaseRay$$1 });
		Object.defineProperty(proto, "creaseSegment", { value: creaseSegment$$1 });
		Object.defineProperty(proto, "creaseThroughLayers", { value: creaseThroughLayers });
		Object.defineProperty(proto, "kawasaki", { value: kawasaki });
		
		Object.defineProperty(proto, "isFolded", { get: function(){
			// todo, this is a heuristic function. can incorporate more cases
			if (_this.frame_classes == null) { return false; }
			return _this.frame_classes.includes("foldedForm");
		}});

		// Object.defineProperty(proto, "connectedGraphs", { get: function() {
		// 	return Graph.connectedGraphs(this);
		// }});

		return Object.freeze(proto);
	};

	/** A graph is a set of nodes and edges connecting them */
	const CreasePattern = function() {

		let proto = CreasePatternPrototype();
		let graph = Object.create(proto);
		proto.bind(graph);

		// parse arguments, look for an input .fold file
		// todo: which key should we check to verify .fold? coords prevents abstract CPs
		let foldObjs = Array.from(arguments)
			.filter(el => typeof el === "object" && el !== null)
			.filter(el => el.vertices_coords != null);
		// unit square is the default base if nothing else is provided
		graph.load( (foldObjs.shift() || square$1()) );

		// callback for when the crease pattern has been altered
		graph.onchange = undefined;

		return graph;
	};

	CreasePattern.square = function() {
		return CreasePattern();
	};
	CreasePattern.rectangle = function(width = 1, height = 1) {
		return CreasePattern(rectangle(width, height));
	};
	CreasePattern.regularPolygon = function(sides, radius = 1) {
		if (sides == null) {
			console.warn("regularPolygon requires number of sides parameter");
		}
		return CreasePattern(regular_polygon(sides, radius));
	};

	/** FOLD file viewer
	 * this is an SVG based front-end for the FOLD file format
	 *  (FOLD file spec: https://github.com/edemaine/fold)
	 *
	 *  View constructor arguments:
	 *   - FOLD file
	 *   - DOM object, or "string" DOM id to attach to
	 */

	const DEFAULTS = Object.freeze({
		autofit: true,
		debug: false,
		folding: false,
		padding: 0
	});

	const parsePreferences = function() {
		let keys$$1 = Object.keys(DEFAULTS);
		let prefs = {};
		Array(...arguments)
			.filter(obj => typeof obj === "object")
			.forEach(obj => Object.keys(obj)
				.filter(key => keys$$1.includes(key))
				.forEach(key => prefs[key] = obj[key])
			);
		return prefs;
	};

	function View2D() {

		let _this = image(...arguments);

		let groups = {};  // visible = {};
		// ["boundary", "face", "crease", "vertex"]
		// make sure they are added in this order
		["boundaries", "faces", "creases", "vertices", "labels"].forEach(key =>
			groups[key] = _this.group().setID(key)
		);

		let visibleGroups = {
			"boundaries": groups["boundaries"],
			"faces": groups["faces"],
			"creases": groups["creases"],
		};

		// make svg components pass through their touches
		Object.keys(groups).forEach(key =>
			groups[key].setAttribute("pointer-events", "none")
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

		let preferences = {};
		Object.assign(preferences, DEFAULTS);
		let userDefaults = parsePreferences(...arguments);
		Object.keys(userDefaults)
			.forEach(key => preferences[key] = userDefaults[key]);

		const setCreasePattern = function(cp) {
			// todo: check if cp is a CreasePattern type
			prop.cp = cp;
			prop.frame = undefined;
			draw();
			prop.cp.onchange = draw;
		};

		const drawDebug = function(graph) {
			// if (preferences.debug) {
			// 	// add faces edges
			// 	drawings.face = drawings.face.concat(Draw.facesEdges(graph));
			// }
			// face dubug numbers
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

		const isFolded = function(graph) {
			// todo, this is a heuristic function. can incorporate more cases
			if (graph.frame_classes == null) { return false; }
			return graph.frame_classes.includes("foldedForm");
		};

		/**
		 * This converts the FOLD object into an SVG
		 * (1) flattens the frame if one is selected (recursively if needed)
		 * (2) identifies whether the frame is creasePattern or folded form
		 */
		const draw = function() {
			// flatten if necessary
			let graph = prop.frame
				? flatten_frame(prop.cp, prop.frame)
				: prop.cp;

			if (isFolded(graph)) {
				_this.removeClass("creasePattern");
				_this.addClass("foldedForm");
			} else{
				_this.removeClass("foldedForm");
				_this.addClass("creasePattern");
			}

			Object.keys(groups).forEach((key) => removeChildren(groups[key]));
			labels.face.removeChildren(); //todo remove
			// both folded and non-folded draw all the components, style them in CSS
			intoGroups(graph, visibleGroups);


			// if (groups.faces.children.length === graph.faces_vertices.length) {
			// 	Draw.updateFaces(graph, groups.faces);
			// } else {
			// 	// SVG.removeChildren(groups.faces);
			// 	Draw.updateGroups(graph, visibleGroups);
			// }

			if (preferences.debug) { drawDebug(graph); }
			if (preferences.autofit) { updateViewBox(); }
		};

		const updateViewBox = function() {
			let graph = prop.frame
				? flatten_frame(prop.cp, prop.frame)
				: prop.cp;
			let r = bounding_rect(graph);
			setViewBox(_this, r[0], r[1], r[2], r[3], preferences.padding);
		};

		const nearest = function() {
			let p = Vector(...arguments);
			// let methods = {
			// 	"vertex": prop.cp.nearestVertex,
			// 	"crease": prop.cp.nearestEdge,
			// 	"face": prop.cp.nearestFace,
			// };
			let methods = {
				"vertices": prop.cp.nearestVertex,
				"creases": prop.cp.nearestEdge,
				"faces": prop.cp.nearestFace,
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

		const getVertices = function() {
			let vertices = prop.cp.vertices;
			vertices.forEach((v,i) => v.svg = groups.vertices.children[i]);
			Object.defineProperty(vertices, "visible", {
				get: function(){ return visibleGroups["vertices"] !== undefined; },
				set: function(isVisible){
					if(isVisible) { visibleGroups["vertices"] = groups["vertices"]; }
					else { delete visibleGroups["vertices"]; }
					draw();
				},
			});
			return vertices;
		};
		const getEdges = function() {
			let edges = prop.cp.edges;
			edges.forEach((v,i) => v.svg = groups.creases.children[i]);
			Object.defineProperty(edges, "visible", {
				get: function(){ return visibleGroups["creases"] !== undefined; },
				set: function(isVisible){
					if(isVisible) { visibleGroups["creases"] = groups["creases"]; }
					else { delete visibleGroups["creases"]; }
					draw();
				},
			});
			return edges;
		};
		const getFaces = function() {
			let faces = prop.cp.faces;
			let sortedFaces = Array.from(groups.faces.children).slice()
				.sort((a,b) => parseInt(a.id) - parseInt(b.id) );
			faces.forEach((v,i) => v.svg = sortedFaces[i]);
			Object.defineProperty(faces, "visible", {
				get: function(){ return visibleGroups["faces"] !== undefined; },
				set: function(isVisible){
					if (isVisible) { visibleGroups["faces"] = groups["faces"]; }
					else { delete visibleGroups["faces"]; }
					draw();
				},
			});
			return faces;
			// return prop.cp.faces
			// 	.map((v,i) => Object.assign(groups.face.children[i], v));
		};

		const load$$1 = function(input, callback) { // epsilon
			load_file(input, function(fold) {
				setCreasePattern( CreasePattern(fold) );
				if (callback != null) { callback(); }
			});
		};

		const fold = function(face) {
			// 1. check if a folded frame already exists (and it's valid)
			// 2. if not, build one
			// if (prop.cp.file_frames.length > 0)
			// if (face == null) { face = 0; }

			if (prop.cp.file_frames != null
				&& prop.cp.file_frames.length > 0
				&& prop.cp.file_frames[0]["re:faces_matrix"] != null
				&& prop.cp.file_frames[0]["re:faces_matrix"].length === prop.cp.faces_vertices.length) ; else {
				// for the moment let's assume it's just 1 layer. face = 0
				if (face == null) { face = 0; }
				let file_frame = build_folded_frame(prop.cp, face);
				if (prop.cp.file_frames == null) { prop.cp.file_frames = []; }
				prop.cp.file_frames.unshift(file_frame);
			}
			prop.frame = 1;
			draw();
		};

		const foldWithoutLayering = function(face){
			let folded = fold_without_layering(prop.cp, face);
			setCreasePattern( CreasePattern(folded) );
			Array.from(groups.faces.children).forEach(face => face.setClass("face"));
		};

		Object.defineProperty(_this, "frames", {
			get: function() {
				let frameZero = JSON.parse(JSON.stringify(prop.cp));
				delete frameZero.file_frames;
				return [frameZero].concat(JSON.parse(JSON.stringify(prop.cp.file_frames)));
			}
		});
		Object.defineProperty(_this, "frame", {
			get: function() { return prop.frame; },
			set: function(newValue) {
				// check bounds of frames
				prop.frame = newValue;
				draw();
			}
		});

		Object.defineProperty(_this, "export", { value: function() {
			let svg$$1 = _this.cloneNode(true);
			svg$$1.setAttribute("x", "0px");
			svg$$1.setAttribute("y", "0px");
			svg$$1.setAttribute("width", "600px");
			svg$$1.setAttribute("height", "600px");
			return save(svg$$1, ...arguments);
		}});

		Object.defineProperty(_this, "cp", {
			get: function() { return prop.cp; },
			set: function(cp) { setCreasePattern(cp); }
		});
		Object.defineProperty(_this, "frameCount", {
			get: function() { return prop.cp.file_frames ? prop.cp.file_frames.length : 0; }
		});
		// Object.defineProperty(_this, "frame", {
		// 	set: function(f) { prop.frame = f; draw(); },
		// 	get: function() { return prop.frame; }
		// });

		// attach CreasePattern methods
		["axiom1", "axiom2", "axiom3", "axiom4", "axiom5", "axiom6", "axiom7",
		 "crease"]
			.forEach(method => Object.defineProperty(_this, method, {
				value: function(){ return prop.cp[method](...arguments); }
			}));
		// attach CreasePattern getters
		// ["boundary", "vertices", "edges", "faces",
		["isFolded"]
			.forEach(method => Object.defineProperty(_this, method, {
				get: function(){
					let components = prop.cp[method];
					// components.forEach(c => c.svg = )
					return components;
				}
			}));

		Object.defineProperty(_this, "nearest", {value: nearest});
		Object.defineProperty(_this, "vertices", {
			get: function(){ return getVertices(); }
		});
		Object.defineProperty(_this, "edges", {
			get: function(){ return getEdges(); }
		});
		Object.defineProperty(_this, "faces", {
			get: function(){ return getFaces(); }
		});
		Object.defineProperty(_this, "draw", { value: draw });
		Object.defineProperty(_this, "fold", { value: fold });
		Object.defineProperty(_this, "foldWithoutLayering", { value: foldWithoutLayering });
		Object.defineProperty(_this, "load", { value: load$$1 });
		Object.defineProperty(_this, "folded", { 
			set: function(f) {
				prop.cp.frame_classes = prop.cp.frame_classes
					.filter(a => a !== "creasePattern");
				prop.cp.frame_classes = prop.cp.frame_classes
					.filter(a => a !== "foldedForm");
				prop.cp.frame_classes.push( f ? "foldedForm" : "creasePattern");
				draw();
			}
		});

		// _this.groups = groups;
		// _this.labels = labels;

		Object.defineProperty(_this, "updateViewBox", { value: updateViewBox });

		_this.preferences = preferences;

		// boot
		setCreasePattern( CreasePattern(...arguments) );

		let prevCP, prevCPFolded, touchFaceIndex;
		_this.events.addEventListener("onMouseDown", function(mouse) {
			if (preferences.folding) {
				try {
					prevCP = JSON.parse(JSON.stringify(prop.cp));
					// console.log("got a prev cp", prevCP);
					if (prop.frame == null || prop.frame === 0 || prevCP.file_frames == null) {
						// console.log("NEEDING TO BUILD A FOLDED FRAME");
						let file_frame = build_folded_frame(prevCP, 0);
						if (prevCP.file_frames == null) { prevCP.file_frames = []; }
						prevCP.file_frames.unshift(file_frame);
					}
					prevCPFolded = flatten_frame(prevCP, 1);
					let faces_containing = faces_containing_point(prevCPFolded, mouse);
					let top_face = topmost_face$1(prevCPFolded, faces_containing);
					touchFaceIndex = (top_face == null)
						? 0 // get bottom most face
						: top_face;
				} catch(error) {
					console.warn("problem loading the last fold step", error);
				}
			}
		});
		_this.events.addEventListener("onMouseMove", function(mouse) {
			if (preferences.folding && mouse.isPressed) {
				prop.cp = CreasePattern(prevCP);
				let points = [Vector(mouse.pressed), Vector(mouse.position)];
				let midpoint = points[0].midpoint(points[1]);
				let vector = points[1].subtract(points[0]);
				prop.cp.valleyFold(midpoint, vector.rotateZ90(), touchFaceIndex);
				fold();
			}
		});

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

		let allMeshes = [];
		let scene = new THREE.Scene();
		let _parent;

		let prop = {
			cp: undefined,
			frame: undefined,
			style: {
				vertex_radius: 0.01 // percent of page
			},
		};

		prop.cp = args.filter(arg =>
			typeof arg == "object" && arg.vertices_coords != undefined
		).shift();
		if(prop.cp == undefined){ prop.cp = CreasePattern(unitSquare); }


		function bootThreeJS(domParent){
			var camera = new THREE.PerspectiveCamera(45, domParent.clientWidth/domParent.clientHeight, 0.1, 1000);
			var controls = new THREE.OrbitControls(camera, domParent);
			controls.enableZoom = false;
	//		camera.position.set(0.5, 0.5, 1.5);
			camera.position.set(-0.75, 2, -0.025);
			// controls.target.set(0.5, 0.5, 0.0);
			controls.target.set(0.0, 0.0, 0.0);
			// camera.position.set(0.0, 0.0, 1.5 );
			// controls.target.set(0.0, 0.0, 0.0);
			controls.addEventListener('change', render);
			var renderer = new THREE.WebGLRenderer({antialias:true});

			if (window.devicePixelRatio !== 1) {
				renderer.setPixelRatio(window.devicePixelRatio);
			}
			
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

		// after page load, find a parent element for the canvas in the arguments
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
			if(numbers.length >= 2); 
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

			let graph = prop.frame
				? flatten_frame(prop.cp, prop.frame)
				: prop.cp;
			let faces = foldFileToThreeJSFaces(graph, material);
			let lines = foldFileToThreeJSLines(graph);
			allMeshes.forEach(mesh => scene.remove(mesh));
			allMeshes = [];
			allMeshes.push(faces);
			allMeshes.push(lines);
			allMeshes.forEach(mesh => scene.add(mesh));
		}

		const setCreasePattern = function(cp) {
			// todo: check if cp is a CreasePattern type
			prop.cp = cp;
			draw();
			prop.cp.onchange = draw;
		};

		const load = function(input, callback) { // epsilon
			load_file(input, function(fold) {
				setCreasePattern( CreasePattern(fold) );
				if (callback != null) { callback(); }
			});
		};

		// return Object.freeze({
		return {
			set cp(c){
				setCreasePattern(c);
				draw();
			},
			get cp(){
				return prop.cp;
			},
			draw,
			load,
			get frame() { return prop.frame; },
			set frame(newValue) {
				prop.frame = newValue;
				draw();
			},
			get frames() {
				let frameZero = JSON.parse(JSON.stringify(prop.cp));
				delete frameZero.file_frames;
				return [frameZero].concat(JSON.parse(JSON.stringify(prop.cp.file_frames)));
			}
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

		function foldFileToThreeJSLines(foldFile, scale=0.002){
			let edges = foldFile.edges_vertices.map(ev => ev.map(v => foldFile.vertices_coords[v]));
			// make sure they all have a z component. when z is implied it's 0
			edges.forEach(edge => {
				if(edge[0][2] == undefined){ edge[0][2] = 0; }
				if(edge[1][2] == undefined){ edge[1][2] = 0; }
			});

			let colorAssignments = {
				"B": [0.0,0.0,0.0],
		 // "M": [0.9,0.31,0.16],
				"M": [0.0,0.0,0.0],//[34/255, 76/255, 117/255], //[0.6,0.2,0.11],
				"F": [0.0,0.0,0.0],//[0.25,0.25,0.25],
				"V": [0.0,0.0,0.0],//[227/255, 85/255, 54/255]//[0.12,0.35,0.50]
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

	// Graph.js
	// an undirected graph with edges and nodes
	// MIT open source license, Robby Kraft
	//
	//  "adjacent": 2 nodes are adjacent when they are connected by an edge
	//              edges are adjacent when they are both connected to the same node
	//  "similar": edges are similar if they contain the same 2 nodes, even if in a different order
	//  "incident": an edge is incident to its two nodes
	//  "endpoints": a node is an endpoint of its edge
	//  "size" the size of a graph is the number of edges
	//  "cycle" a set of edges that form a closed circut, it's possible to walk down a cycle and end up where you began without visiting the same edge twice.
	//  "circuit" a circuit is a cycle except that it's allowed to visit the same node more than once.
	//  "multigraph": not this graph. but the special case where circular and duplicate edges are allowed
	//  "degree": the degree of a node is how many edges are incident to it
	//  "isolated": a node is isolated if it is connected to 0 edges, degree 0
	//  "leaf": a node is a leaf if it is connected to only 1 edge, degree 1
	//  "pendant": an edge incident with a leaf node

	const CleanPrototype = function() {
		let proto = Object.create(null);
		const join = function(report) {
			if (report == null) { return this; }
			this.nodes.total += report.nodes.total;
			this.edges.total += report.edges.total;
			this.nodes.isolated += report.nodes.isolated;
			this.edges.duplicate += report.edges.duplicate;
			this.edges.circular += report.edges.circular;
			return this;
		};
		const isolatedNodes = function(num) {
			this.nodes.isolated = num;
			this.nodes.total += num;
			return this;
		};
		const duplicateEdges = function(num) {
			this.edges.duplicate = num;
			this.edges.total += num;
			return this;
		};
		const circularEdges = function(num) {
			this.edges.circular = num;
			this.edges.total += num;
			return this;
		};
		Object.defineProperty(proto, "join", { value: join });
		Object.defineProperty(proto, "isolatedNodes", { value: isolatedNodes });
		Object.defineProperty(proto, "duplicateEdges", { value: duplicateEdges });
		Object.defineProperty(proto, "circularEdges", { value: circularEdges });
		return Object.freeze(proto);
	};

	/** A survey of the objects removed from a graph after a function is performed */
	const GraphClean = function(numNodes, numEdges) {
		// "total" must be greater than or equal to the other members of each object
		// "total" can include removed edges/nodes which don't count as "duplicate" or "circular"
		let clean = Object.create(CleanPrototype());
		clean.nodes = {total:0, isolated:0};
		clean.edges = {total:0, duplicate:0, circular:0};
		if (numNodes != null) { clean.nodes.total = numNodes; }
		if (numEdges != null) { clean.edges.total = numEdges; }
		return clean;
	};

	/** Nodes are 1 of the 2 fundamental components in a graph */
	const GraphNode = function(graph) {
		let node = Object.create(null);
		node.graph = graph;

		/**
		 * Get an array of edges that contain this node
		 * @returns {GraphEdge[]} array of adjacent edges
		 * @example
		 * var adjacent = node.adjacentEdges()
		 */
		const adjacentEdges = function() {
			return node.graph.edges
				.filter((el) => el.nodes[0] === node || el.nodes[1] === node);
		};
		/** 
		 * Get an array of nodes that share an edge in common with this node
		 * @returns {GraphNode[]} array of adjacent nodes
		 * @example
		 * var adjacent = node.adjacentNodes()
		 */
		const adjacentNodes = function() {
			let checked = []; // the last step, to remove duplicate nodes
			return adjacentEdges()
				.filter((el) => !el.isCircular)
				.map((el) => (el.nodes[0] === node)
					? el.nodes[1]
					: el.nodes[0])
				.filter((el) =>
					checked.indexOf(el) >= 0 ? false : checked.push(el)
				);
		};
		/** 
		 * Get both adjacent edges and nodes.
		 */
		const adjacent = function() {
			let adj = Object.create(null);
			adj.edges = adjacentEdges();
			let checked = []; // the last step, to remove duplicate nodes
			adj.nodes = adj.edges.filter((el) => !el.isCircular)
				.map((el) => (el.nodes[0] === node)
					? el.nodes[1]
					: el.nodes[0])
				.filter((el) =>
					checked.indexOf(el) >= 0 ? false : checked.push(el)
				);
			return adj;
		};
		/** Test if a node is connected to another node by an edge
		 * @param {GraphNode} node test adjacency between this and the supplied parameter
		 * @returns {boolean} true or false, adjacent or not
		 * @example
		 * var isAdjacent = node.isAdjacentToNode(anotherNode);
		 */
		const isAdjacentToNode = function(n) {
			return adjacentNodes.filter(node => node === n).length > 0;
		};
		/** The degree of a node is the number of adjacent edges, circular edges are counted twice
		 * @returns {number} number of adjacent edges
		 * @example
		 * var degree = node.degree();
		 */
		const degree = function() {
			// circular edges are counted twice
			return node.graph.edges.map((el) =>
				el.nodes.map(n => n === node ? 1 : 0).reduce((a,b) => a + b, 0)
			).reduce((a, b) => a + b, 0);
		};
		Object.defineProperty(node, "adjacent", {get: function() { return adjacent(); }});
		// Object.defineProperty(node, "adjacentEdges", {get:function() { return adjacentEdges(); }});
		// Object.defineProperty(node, "adjacentNodes", {get:function() { return adjacentNodes(); }});
		Object.defineProperty(node, "degree", {get:function() { return degree(); }});
		Object.defineProperty(node, "isAdjacentToNode", {value: isAdjacentToNode });
		return node;
	};

	/** Edges are 1 of the 2 fundamental components in a graph. 1 edge connect 2 nodes. */
	const GraphEdge = function(graph, node1, node2) {

		let edge = Object.create(null);
		edge.graph = graph; // pointer to the graph. required for adjacency tests
		edge.nodes = [node1, node2]; // required. every edge must connect 2 nodes

		/** Get an array of edges that share a node in common with this edge
		 * @returns {GraphEdge[]} array of adjacent edges
		 * @example
		 * var adjacent = edge.adjacentEdges()
		 */
		const adjacentEdges = function() {
			return edge.graph.edges.filter((e) => e !== edge &&
				(e.nodes[0] === edge.nodes[0] ||
				 e.nodes[0] === edge.nodes[1] ||
				 e.nodes[1] === edge.nodes[0] ||
				 e.nodes[1] === edge.nodes[1])
			)
		};
		/** Get the two nodes of this edge
		 * @returns {GraphNode[]} the two nodes of this edge
		 * @example
		 * var adjacent = edge.adjacentNodes()
		 */
		const adjacentNodes = function() { return [...edge.nodes]; };
		/** 
		 * Get both adjacent edges and nodes. saves on computation time
		 */
		const adjacent = function() {
			let adj = Object.create(null);
			adj.nodes = adjacentNodes();
			adj.edges = adjacentEdges();
			return adj;
		};

		/** Test if an edge is connected to another edge by a common node
		 * @param {GraphEdge} edge test adjacency between this and supplied parameter
		 * @returns {boolean} true or false, adjacent or not
		 * @example
		 * var isAdjacent = edge.isAdjacentToEdge(anotherEdge)
		 */
		const isAdjacentToEdge = function(e) {
			return( (edge.nodes[0] === e.nodes[0]) || (edge.nodes[1] === e.nodes[1]) ||
			        (edge.nodes[0] === e.nodes[1]) || (edge.nodes[1] === e.nodes[0]) );
		};
		/** Test if an edge contains the same nodes as another edge
		 * @param {GraphEdge} edge test similarity between this and supplied parameter
		 * @returns {boolean} true or false, similar or not
		 * @example
		 * var isSimilar = edge.isSimilarToEdge(anotherEdge)
		 */
		const isSimilarToEdge = function(e) {
			return( (edge.nodes[0] === e.nodes[0] && edge.nodes[1] === e.nodes[1] ) ||
			        (edge.nodes[0] === e.nodes[1] && edge.nodes[1] === e.nodes[0] ) );
		};
		/** A convenience function, supply one of the edge's incident nodes and get back the other node
		 * @param {GraphNode} node must be one of the edge's 2 nodes
		 * @returns {GraphNode} the node that is the other node
		 * @example
		 * var node2 = edge.otherNode(node1)
		 */
		const otherNode = function(n) {
			if (edge.nodes[0] === n) { return edge.nodes[1]; }
			if (edge.nodes[1] === n) { return edge.nodes[0]; }
			return undefined;
		};
		/** Test if an edge points both at both ends to the same node
		 * @returns {boolean} true or false, circular or not
		 * @example
		 * var isCircular = edge.isCircular
		 */
		const isCircular = function() { return edge.nodes[0] === edge.nodes[1]; };
		// do we need to test for invalid edges?
			// && this.nodes[0] !== undefined;
		/** If this is a edge with duplicate edge(s), returns an array of duplicates not including self
		 * @returns {GraphEdge[]} array of duplicate GraphEdge, empty array if none
		 * @example
		 * var array = edge.duplicateEdges()
		 */
		const duplicateEdges = function() {
			return edge.graph.edges.filter((el) => edge.isSimilarToEdge(el));
		};
		/** For adjacent edges, get the node they share in common
		 * @param {GraphEdge} otherEdge an adjacent edge
		 * @returns {GraphNode} the node in common, undefined if not adjacent
		 * @example
		 * var sharedNode = edge1.commonNodeWithEdge(edge2)
		 */
		const commonNodeWithEdge = function(otherEdge) {
			// only for adjacent edges
			if (edge === otherEdge) { return undefined; }
			if (edge.nodes[0] === otherEdge.nodes[0] || edge.nodes[0] === otherEdge.nodes[1]) {
				return edge.nodes[0];
			}
			if (edge.nodes[1] === otherEdge.nodes[0] || edge.nodes[1] === otherEdge.nodes[1]) {
				return edge.nodes[1];
			}
			return undefined;
		};
		/** For adjacent edges, get this edge's node that is not shared in common with the other edge
		 * @param {GraphEdge} otherEdge an adjacent edge
		 * @returns {GraphNode} the node on this edge not shared by the other edge, undefined if not adjacent
		 * @example
		 * var notSharedNode = edge1.uncommonNodeWithEdge(edge2)
		 */
		const uncommonNodeWithEdge = function(otherEdge) {
			// only for adjacent edges
			if (edge === otherEdge) { return undefined; }
			if (edge.nodes[0] === otherEdge.nodes[0] || edge.nodes[0] === otherEdge.nodes[1]) {
				return edge.nodes[1];
			}
			if (edge.nodes[1] === otherEdge.nodes[0] || edge.nodes[1] === otherEdge.nodes[1]) {
				return edge.nodes[0];
			}
			// optional ending: returning both of its two nodes, as if to say all are uncommon
			return undefined;
		};

		Object.defineProperty(edge, "adjacent", {get:function() { return adjacent(); }});
		// Object.defineProperty(edge, "adjacentEdges", {get:function() { return adjacentEdges(); }});
		// Object.defineProperty(edge, "adjacentNodes", {get:function() { return adjacentNodes(); }});
		Object.defineProperty(edge, "isAdjacentToEdge", {value: isAdjacentToEdge});
		Object.defineProperty(edge, "isSimilarToEdge", {value: isSimilarToEdge});
		Object.defineProperty(edge, "otherNode", {value: otherNode});
		Object.defineProperty(edge, "isCircular", {get:function() { return isCircular(); }});
		Object.defineProperty(edge, "duplicateEdges", {value: duplicateEdges});
		Object.defineProperty(edge, "commonNodeWithEdge", {value: commonNodeWithEdge});
		Object.defineProperty(edge, "uncommonNodeWithEdge", {value: uncommonNodeWithEdge});

		return edge;
	};
	/** A graph is a set of nodes and edges connecting them */
	const Graph$1 = function() {
		let graph = Object.create(null);

		graph.nodes = [];
		graph.edges = [];

		// if this Graph is subclassed, member types are overwritten with new types
		graph.types = {
			node: GraphNode,
			edge: GraphEdge
		};

		// todo: callback hooks for when certain properties of the data structure have been altered
		// graph.didChange = undefined;

		///////////////////////////////////////////////
		// ADD PARTS
		///////////////////////////////////////////////

		/** Create a node and add it to the graph
		 * @returns {GraphNode} pointer to the node
		 * @example
		 * var node = graph.newNode()
		 */
		const newNode = function() {
			let node = graph.types.node(graph);
			Object.assign(node, ...arguments);
			node.graph = graph;
			graph.nodes.push(node);
			return node;
		};

		/** Create an edge and add it to the graph
		 * @param {GraphNode} node1 the first node that the edge connects
		 * @param {GraphNode} node2 the second node that the edge connects
		 * @returns {GraphEdge} if successful, pointer to the edge
		 * @example
		 * var node1 = graph.newNode()
		 * var node2 = graph.newNode()
		 * graph.newEdge(node1, node2)
		 */
		const newEdge = function(node1, node2) {
			let edge = graph.types.edge(graph, node1, node2);
			edge.graph = graph;
			graph.edges.push(edge);
			return edge;
		};

		///////////////////////////////////////////////
		// REMOVE PARTS (TARGETS KNOWN)
		///////////////////////////////////////////////

		/** Removes all nodes and edges, returning the graph to it's original state 
		 * @example 
		 * graph.clear()
		 */
		const clear = function() {
			graph.nodes = [];
			graph.edges = [];
			return graph;
		};

		/** Remove an edge
		 * @returns {GraphClean} number of edges removed
		 * @example 
		 * var result = graph.removeEdge(edge)
		 * // result.edges should equal 1
		 */
		const removeEdge = function(edge) {
			var edgesLength = graph.edges.length;
			graph.edges = graph.edges.filter((el) => el !== edge);
			return GraphClean(undefined, edgesLength - graph.edges.length);
		};

		/** Searches and removes any edges connecting the two nodes supplied in the arguments
		 * @param {GraphNode} node1 first node
		 * @param {GraphNode} node2 second node
		 * @returns {GraphClean} number of edges removed. in the case of an unclean graph, there may be more than one
		 * @example 
		 * var result = graph.removeEdgeBetween(node1, node2)
		 * // result.edges should be >= 1
		 */
		const removeEdgeBetween = function(node1, node2) {
			var edgesLength = graph.edges.length;
			graph.edges = graph.edges.filter((el) => 
				!((el.nodes[0] === node1 && el.nodes[1] === node2) ||
				  (el.nodes[0] === node2 && el.nodes[1] === node1) )
			);
			return GraphClean(undefined, edgesLength - graph.edges.length);
		};

		/** Remove a node and any edges that connect to it
		 * @param {GraphNode} node the node that will be removed
		 * @returns {GraphClean} number of nodes and edges removed
		 * @example 
		 * var result = graph.removeNode(node)
		 * // result.node will be 1
		 * // result.edges will be >= 0
		 */
		const removeNode = function(node) {
			var nodesLength = graph.nodes.length;
			var edgesLength = graph.edges.length;
			graph.nodes = graph.nodes.filter((n) => n !== node);
			graph.edges = graph.edges.filter((e) => e.nodes[0] !== node && e.nodes[1] !== node);
			// todo: a graphDidChange object like graphClean but
			return GraphClean(nodesLength-graph.nodes.length, edgesLength-graph.edges.length);
		};

		/** Remove the second node and replaces all mention of it with the first in every edge
		 * @param {GraphNode} node1 first node to merge, this node will persist
		 * @param {GraphNode} node2 second node to merge, this node will be removed
		 * @returns {GraphClean} 1 removed node, newly duplicate and circular edges will be removed
		 * @example 
		 * var result = graph.mergeNodes(node1, node2)
		 * // result.node will be 1
		 * // result.edges will be >= 0
		 */
		const mergeNodes = function(node1, node2) {
			if (node1 === node2) { return undefined; }
			graph.edges.forEach((edge) => {
				if (edge.nodes[0] === node2) { edge.nodes[0] = node1; }
				if (edge.nodes[1] === node2) { edge.nodes[1] = node1; }
			});
			// this potentially created circular edges
			var nodesLength = graph.nodes.length;
			graph.nodes = graph.nodes.filter((n) => n !== node2);
			return GraphClean(nodesLength - graph.nodes.length).join(clean());
		};

		///////////////////////////////////////////////
		// REMOVE PARTS (SEARCH REQUIRED TO LOCATE)
		///////////////////////////////////////////////

		/** Removes any node that isn't a part of an edge
		 * @returns {GraphClean} the number of nodes removed
		 * @example 
		 * var result = graph.removeIsolatedNodes()
		 * // result.node will be >= 0
		 */
		const removeIsolatedNodes = function() {
			// build an array containing T/F if a node is NOT isolated
			var nodeDegree = Array(graph.nodes.length).fill(false);
			graph.nodes.forEach((n,i) => n._memo = i);
			graph.edges.forEach(e => {
				nodeDegree[e.nodes[0]._memo] = true;
				nodeDegree[e.nodes[1]._memo] = true;
			});
			graph.nodes.forEach((n,i) => delete n._memo);
			// filter out isolated nodes
			var nodeLength = graph.nodes.length;
			graph.nodes = graph.nodes.filter((el,i) => nodeDegree[i]);
			return GraphClean().isolatedNodes(nodeLength - graph.nodes.length);
		};

		/** Remove all edges that contain the same node at both ends
		 * @returns {GraphClean} the number of edges removed
		 * @example 
		 * var result = graph.removeCircularEdges()
		 * // result.edges will be >= 0
		 */
		const removeCircularEdges = function() {
			var edgesLength = graph.edges.length;
			graph.edges = graph.edges.filter((el) => el.nodes[0] !== el.nodes[1]);
			return GraphClean().circularEdges(edgesLength - graph.edges.length);
		};

		/** Remove edges that are similar to another edge
		 * @returns {GraphClean} the number of edges removed
		 * @example 
		 * var result = graph.removeDuplicateEdges()
		 * // result.edges will be >= 0
		 */
		const removeDuplicateEdges = function() {
			var count = 0;
			for (var i = 0; i < graph.edges.length-1; i++) {
				for (var j = graph.edges.length-1; j > i; j--) {
					if (graph.edges[i].isSimilarToEdge(graph.edges[j])) {
						// console.log("duplicate edge found");
						graph.edges.splice(j, 1);
						count += 1;
					}
				}
			}
			return GraphClean().duplicateEdges(count);
		};

		/** 
		 * Removes circular and duplicate edges, only modifies edges array.
		 * @returns {GraphClean} the number of edges removed
		 * @example 
		 * var result = graph.clean()
		 * // result.edges will be >= 0
		 */
		const clean = function() {
			// should we remove isolated nodes as a part of clean()?
			return removeDuplicateEdges()
				.join(removeCircularEdges());
				// .join(removeIsolatedNodes());
		};

		///////////////////////////////////////////////
		// GET PARTS
		///////////////////////////////////////////////
		
		/** Searches for an edge that contains the 2 nodes supplied in the
		 * function call. Will return first edge found, if graph isn't clean it
		 * will miss any subsequent duplicate edges.
		 * @returns {GraphEdge} edge if exists. undefined if nodes are not adjacent
		 * @example 
		 * var edge = graph.getEdgeConnectingNodes(node1, node2)
		 */
		const getEdgeConnectingNodes = function(node1, node2) {
			// for this to work, graph must be cleaned. no duplicate edges
			for (var i = 0; i < graph.edges.length; i++) {
				if ((graph.edges[i].nodes[0] === node1 && graph.edges[i].nodes[1] === node2 ) ||
					(graph.edges[i].nodes[0] === node2 && graph.edges[i].nodes[1] === node1 )) {
					return graph.edges[i];
				}
			}
			// nodes are not adjacent
			return undefined;
		};

		/**
		 * Searches for all edges that contains the 2 nodes supplied in the
		 * function call. This is suitable for unclean graphs, graphs with
		 * duplicate edges.
		 * @returns {GraphEdge[]} array of edges, if any exist. empty array if
		 * no edge connects the nodes (not adjacent)
		 * @example 
		 * var array = graph.getEdgesConnectingNodes(node1, node2)
		 */
		const getEdgesConnectingNodes = function(node1, node2) {
			return graph.edges.filter((e) =>
				(e.nodes[0] === node1 && e.nodes[1] === node2 ) ||
				(e.nodes[0] === node2 && e.nodes[1] === node1 )
			);
		};

		///////////////////////////////////////////////
		// COPY
		///////////////////////////////////////////////

		/**
		 * Deep-copy the contents of this graph and return it as a new object
		 * @returns {Graph} 
		 * @example
		 * var copiedGraph = graph.copy()
		 */
		const copy = function() {
			graph.nodes.forEach((node,i) => node._memo = i);
			var g = Graph$1();
			for (var i = 0; i < graph.nodes.length; i++) {
				let n = g.newNode();
				Object.assign(n, graph.nodes[i]);
				n.graph = g;
			}
			for (var i = 0; i < graph.edges.length; i++) {
				let indices = graph.edges[i].nodes.map(n => n._memo);
				let e = g.newEdge(g.nodes[indices[0]], g.nodes[indices[1]]);
				Object.assign(e, graph.edges[i]);
				e.graph = g;
				e.nodes = [g.nodes[indices[0]], g.nodes[indices[1]]];
			}
			graph.nodes.forEach((node,i) => delete node._memo);
			g.nodes.forEach((node,i) => delete node._memo);
			return g;
		};

		/** 
		 * Convert this graph into an array of connected graphs, attempting one
		 * Hamilton path if possible. Edges are arranged in each graph.edges
		 * with connected edges next to one another.
		 * @returns {Graph[]} 
		 */
		const connectedGraphs = function() {
			var cp = copy();
			cp.clean();
			cp.removeIsolatedNodes();
			// _memo every node's adjacent edge #
			cp.nodes.forEach((node,i) => node._memo = {
				index: i,
				adj: node.adjacent.edges.length
			});
			var graphs = [];
			while (cp.edges.length > 0) {
				var subGraph = Graph$1();
				// create a duplicate set of nodes in the new emptry graph, remove unused nodes at the end
				subGraph.nodes = cp.nodes.map((node) => Object.assign(subGraph.types.node(subGraph), node));
				subGraph.nodes.forEach(n => n.graph = subGraph);

				// select the node with most adjacentEdges
				var node = cp.nodes.slice().sort((a,b) => b._memo.adj - a._memo.adj)[0];
				var adj = node.adjacent.edges;
				while (adj.length > 0) {
					// approach 1
					// var nextEdge = adj[0];
					// approach 2
					// var nextEdge = adj.sort(function(a,b) {return b.otherNode(node)._memo.adj - a.otherNode(node)._memo.adj;})[0];
					// approach 3, prioritize nodes with even number of adjacencies
					var smartList = adj.filter((el) => el.otherNode(node)._memo.adj % 2 == 0);
					if (smartList.length === 0) { smartList = adj; }
					var nextEdge = smartList.sort((a,b) => b.otherNode(node)._memo.adj - a.otherNode(node)._memo.adj)[0];
					var nextNode = nextEdge.otherNode(node);
					// create new edge on other graph with pointers to its nodes
					var newEdge = Object.assign(subGraph.types.edge(subGraph,undefined,undefined), nextEdge);
					newEdge.nodes = [subGraph.nodes[node._memo.index], subGraph.nodes[nextNode._memo.index] ];
					subGraph.edges.push(newEdge);
					// update this graph with 
					node._memo.adj -= 1;
					nextNode._memo.adj -= 1;
					cp.edges = cp.edges.filter((el) => el !== nextEdge);
					// prepare loop for next iteration. increment objects
					node = nextNode;
					adj = node.adjacent.edges;
				}
				// remove unused nodes
				subGraph.removeIsolatedNodes();
				graphs.push(subGraph);
			}
			return graphs;
		};

		Object.defineProperty(graph, "newNode", {value: newNode});
		Object.defineProperty(graph, "newEdge", {value: newEdge});
		Object.defineProperty(graph, "clear", {value: clear});
		Object.defineProperty(graph, "removeEdge", {value: removeEdge});
		Object.defineProperty(graph, "removeEdgeBetween", {value: removeEdgeBetween});
		Object.defineProperty(graph, "removeNode", {value: removeNode});
		Object.defineProperty(graph, "mergeNodes", {value: mergeNodes});
		Object.defineProperty(graph, "removeIsolatedNodes", {value: removeIsolatedNodes});
		Object.defineProperty(graph, "removeCircularEdges", {value: removeCircularEdges});
		Object.defineProperty(graph, "removeDuplicateEdges", {value: removeDuplicateEdges});
		Object.defineProperty(graph, "clean", {value: clean});
		Object.defineProperty(graph, "getEdgeConnectingNodes", {value: getEdgeConnectingNodes});
		Object.defineProperty(graph, "getEdgesConnectingNodes", {value: getEdgesConnectingNodes});
		Object.defineProperty(graph, "copy", {value: copy});
		Object.defineProperty(graph, "connectedGraphs", {value: connectedGraphs});

		return graph;
	};

	let convert = { intoFOLD, intoSVG, intoORIPA };

	const core$1 = Object.create(null);
	Object.assign(core$1, file, validate, graph, Origami, planargraph);
	// remove these for production
	// import test from './bases/test-three-fold.fold';
	// import dodecagon from './bases/test-dodecagon.fold';
	// import boundary from './bases/test-boundary.fold';
	// import concave from './bases/test-concave.fold';
	// import blintzAnimated from './bases/blintz-animated.fold';
	// import blintzDistorted from './bases/blintz-distort.fold';
	const bases = {
		empty: recursive_freeze(JSON.parse(empty)),
		square: recursive_freeze(JSON.parse(square)),
		book: recursive_freeze(JSON.parse(book)),
		blintz: recursive_freeze(JSON.parse(blintz)),
		kite: recursive_freeze(JSON.parse(kite)),
		fish: recursive_freeze(JSON.parse(fish)),
		bird: recursive_freeze(JSON.parse(bird)),
		frog: recursive_freeze(JSON.parse(frog)),
		// remove these for production
		// test: JSON.parse(test),
		// dodecagon: JSON.parse(dodecagon),
		// boundary: JSON.parse(boundary),
		// concave: JSON.parse(concave),
		// blintzAnimated: JSON.parse(blintzAnimated),
		// blintzDistorted: JSON.parse(blintzDistorted)
	};

	exports.math = geometry$1;
	exports.svg = svg$1;
	exports.convert = convert;
	exports.core = core$1;
	exports.bases = bases;
	exports.CreasePattern = CreasePattern;
	exports.Origami = View2D;
	exports.Origami3D = View3D;
	exports.Graph = Graph$1;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
