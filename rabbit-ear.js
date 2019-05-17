/* Rabbit Ear v0.2 (c) Robby Kraft, MIT License */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.RabbitEar = factory());
}(this, (function () { 'use strict';

	const EPSILON = 1e-10;
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
	var algebra = Object.freeze({
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
	function point_on_line(linePoint, lineVector, point, epsilon=EPSILON) {
		let pointPoint = [point[0] - linePoint[0], point[1] - linePoint[1]];
		let cross = pointPoint[0]*lineVector[1] - pointPoint[1]*lineVector[0];
		return Math.abs(cross) < epsilon;
	}
	function point_on_edge(edge0, edge1, point, epsilon = EPSILON) {
		let edge0_1 = [edge0[0]-edge1[0], edge0[1]-edge1[1]];
		let edge0_p = [edge0[0]-point[0], edge0[1]-point[1]];
		let edge1_p = [edge1[0]-point[0], edge1[1]-point[1]];
		let dEdge = Math.sqrt(edge0_1[0]*edge0_1[0] + edge0_1[1]*edge0_1[1]);
		let dP0   = Math.sqrt(edge0_p[0]*edge0_p[0] + edge0_p[1]*edge0_p[1]);
		let dP1   = Math.sqrt(edge1_p[0]*edge1_p[0] + edge1_p[1]*edge1_p[1]);
		return Math.abs(dEdge - dP0 - dP1) < epsilon;
	}
	function point_in_poly(point, poly, epsilon = EPSILON) {
		let isInside = false;
		for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
			if ( (poly[i][1] > point[1]) != (poly[j][1] > point[1]) &&
			point[0] < (poly[j][0] - poly[i][0]) * (point[1] - poly[i][1])
			/ (poly[j][1] - poly[i][1]) + poly[i][0] ) {
				isInside = !isInside;
			}
		}
		return isInside;
	}
	function point_in_convex_poly(point, poly, epsilon = EPSILON) {
		if (poly == null || !(poly.length > 0)) { return false; }
		return poly.map( (p,i,arr) => {
			let nextP = arr[(i+1)%arr.length];
			let a = [ nextP[0]-p[0], nextP[1]-p[1] ];
			let b = [ point[0]-p[0], point[1]-p[1] ];
			return a[0] * b[1] - a[1] * b[0] > -epsilon;
		}).map((s,i,arr) => s === arr[0])
			.reduce((prev,curr) => prev && curr, true);
	}
	function point_in_convex_poly_exclusive(point, poly, epsilon=EPSILON) {
		if (poly == null || !(poly.length > 0)) { return false; }
		return poly.map( (p,i,arr) => {
			let nextP = arr[(i+1)%arr.length];
			let a = [ nextP[0]-p[0], nextP[1]-p[1] ];
			let b = [ point[0]-p[0], point[1]-p[1] ];
			return a[0] * b[1] - a[1] * b[0] > epsilon;
		}).map((s,i,arr) => s === arr[0])
			.reduce((prev,curr) => prev && curr, true);
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
		if (point_in_poly(ps2[0], ps1)) { return true; }
		if (point_in_poly(ps1[0], ps2)) { return true; }
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
			.map(el => edge_edge_exclusive(edgeA, edgeB, el[0], el[1]))
			.filter(el => el != null);
		let aInsideExclusive = point_in_convex_poly_exclusive(edgeA, poly);
		let bInsideExclusive = point_in_convex_poly_exclusive(edgeB, poly);
		let aInsideInclusive = point_in_convex_poly(edgeA, poly);
		let bInsideInclusive = point_in_convex_poly(edgeB, poly);
		if (intersections.length === 0 &&
			(aInsideExclusive || bInsideExclusive)) {
			return [edgeA, edgeB];
		}
		if(intersections.length === 0 &&
			(aInsideInclusive && bInsideInclusive)) {
			return [edgeA, edgeB];
		}
		switch (intersections.length) {
			case 0: return ( aInsideExclusive
				? [[...edgeA], [...edgeB]]
				: undefined );
			case 1: return ( aInsideInclusive
				? [[...edgeA], intersections[0]]
				: [[...edgeB], intersections[0]] );
			case 2: return intersections;
			default: throw "clipping edge in a convex polygon resulting in 3 or more points";
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
	function circle_line(center, radius, p0, p1, epsilon = EPSILON) {
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
	function circle_ray(center, radius, p0, p1) {
		throw "circle_ray has not been written yet";
	}
	function circle_edge(center, radius, p0, p1) {
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
	var intersection = Object.freeze({
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
		point_in_convex_poly_exclusive: point_in_convex_poly_exclusive,
		convex_polygons_overlap: convex_polygons_overlap,
		clip_line_in_convex_poly: clip_line_in_convex_poly,
		clip_ray_in_convex_poly: clip_ray_in_convex_poly,
		clip_edge_in_convex_poly: clip_edge_in_convex_poly,
		nearest_point: nearest_point,
		circle_line: circle_line,
		circle_ray: circle_ray,
		circle_edge: circle_edge
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
	function convex_hull(points, include_collinear = false, epsilon = EPSILON) {
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
	var geometry = Object.freeze({
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
			if (arrays.length === 1) {
				return get_line(...arrays[0]);
			}
			if (arrays.length === 2) {
				return {
					point: [arrays[0][0], arrays[0][1]],
					vector: [arrays[1][0], arrays[1][1]]
				};
			}
			if (arrays.length === 4) {
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
			let intersection = circle_line(_origin, _radius, line.point, p2);
			return (intersection === undefined
				? undefined
				: intersection.map(i => Vector(i))
			);
		};
		const intersectionRay = function() {
			let points = get_ray(...arguments);
			let intersection = circle_ray(_origin, _radius, points[0], points[1]);
			return (intersection === undefined
				? undefined
				: intersection.map(i => Vector(i))
			);
		};
		const intersectionEdge = function() {
			let points = get_two_vec2(...arguments);
			let intersection = circle_edge(_origin, _radius, points[0], points[1]);
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
	function Matrix2() {
		let _m = get_matrix2(...arguments);
		const inverse = function() {
			return Matrix2( make_matrix2_inverse(_m) );
		};
		const multiply = function() {
			let m2 = get_matrix2(...arguments);
			return Matrix2( multiply_matrices2(_m, m2) );
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
	Matrix2.makeIdentity = function() {
		return Matrix2(1,0,0,1,0,0);
	};
	Matrix2.makeTranslation = function(tx, ty) {
		return Matrix2(1,0,0,1,tx,ty);
	};
	Matrix2.makeRotation = function(angle, origin) {
		return Matrix2( make_matrix2_rotation(angle, origin) );
	};
	Matrix2.makeReflection = function(vector, origin) {
		return Matrix2( make_matrix2_reflection(vector, origin) );
	};
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
		const isDegenerate = function(epsilon){
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
		Object.defineProperty(proto, "isDegenerate", {value: isDegenerate});
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
		const midpoint$$1 = function() {
			return Vector(midpoint(_endpoints[0], _endpoints[1]));
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
		Object.defineProperty(edge, "midpoint", {value: midpoint$$1});
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
		let _sides = _points
			.map((p,i,arr) => [p, arr[(i+1)%arr.length]])
			.map(ps => Edge(ps[0][0], ps[0][1], ps[1][0], ps[1][1]));
		const contains = function() {
			let point = get_vec(...arguments);
			return point_in_poly(point, _points);
		};
		const scale = function(magnitude$$1, center = centroid(_points)) {
			let newPoints = _points
				.map(p => [0,1].map((_,i) => p[i] - center[i]))
				.map(vec => vec.map((_,i) => center[i] + vec[i] * magnitude$$1));
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
		const translate = function() {
			let vec = get_vec(...arguments);
			let newPoints = _points.map(p => p.map((n,i) => n+vec[i]));
			return Polygon(newPoints);
		};
		const transform = function() {
			let m = get_matrix2(...arguments);
			let newPoints = _points
				.map(p => Vector(multiply_vector2_matrix2(p, m)));
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
			let e = clip_edge_in_convex_poly(_points, edge[0], edge[1]);
			return e === undefined ? undefined : Edge(e);
		};
		const clipLine = function() {
			let line = get_line(...arguments);
			let e = clip_line_in_convex_poly(_points, line.point, line.vector);
			return e === undefined ? undefined : Edge(e);
		};
		const clipRay = function() {
			let line = get_line(...arguments);
			let e = clip_ray_in_convex_poly(_points, line.point, line.vector);
			return e === undefined ? undefined : Edge(e);
		};
		const nearest = function() {
			let point = get_vec(...arguments);
			let points = _sides.map(edge => edge.nearestPoint(point));
			let lowD = Infinity, lowI;
			points.map(p => distance2(point, p))
				.forEach((d,i) => { if(d < lowD){ lowD = d; lowI = i;} });
			return {
				point: points[lowI],
				edge: _sides[lowI],
			}
		};
		return {
			contains,
			scale,
			rotate,
			translate,
			transform,
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
			get midpoint() { return average(_points); },
			nearest,
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
		const scale = function(magnitude$$1, center = centroid(polygon.points)) {
			let newPoints = polygon.points
				.map(p => [0,1].map((_,i) => p[i] - center[i]))
				.map(vec => vec.map((_,i) => center[i] + vec[i] * magnitude$$1));
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
		const scale = function(magnitude$$1, center) {
			if (center == null) {
				center = [_origin[0] + _width, _origin[1] + _height];
			}
			let x = _origin[0] + (center[0] - _origin[0]) * (1-magnitude$$1);
			let y = _origin[1] + (center[1] - _origin[1]) * (1-magnitude$$1);
			return Rectangle(x, y, _width*magnitude$$1, _height*magnitude$$1);
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
	core.EPSILON = EPSILON;
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

	var math = /*#__PURE__*/Object.freeze({
		Vector: Vector,
		Circle: Circle,
		Polygon: Polygon,
		ConvexPolygon: ConvexPolygon,
		Rectangle: Rectangle,
		Matrix2: Matrix2,
		Line: Line,
		Ray: Ray,
		Edge: Edge,
		Junction: Junction,
		Sector: Sector,
		core: core
	});

	function vkXML(text, step) {
		var ar = text.replace(/>\s{0,}</g,"><")
					 .replace(/</g,"~::~<")
					 .replace(/\s*xmlns\:/g,"~::~xmlns:")
					 .split('~::~'),
			len = ar.length,
			inComment = false,
			deep = 0,
			str = '',
			space = (step != null && typeof step === "string" ? step : "\t");
		var shift = ['\n'];
		for(let si=0; si<100; si++){
			shift.push(shift[si]+space);
		}
		for (let ix=0;ix<len;ix++) {
			if(ar[ix].search(/<!/) > -1) {
				str += shift[deep]+ar[ix];
				inComment = true;
				if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1
					|| ar[ix].search(/!DOCTYPE/) > -1 ) {
					inComment = false;
				}
			}
			else if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) {
				str += ar[ix];
				inComment = false;
			}
			else if ( /^<\w/.exec(ar[ix-1]) && /^<\/\w/.exec(ar[ix]) &&
				/^<[\w:\-\.\,]+/.exec(ar[ix-1])
				== /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace('/','')) {
				str += ar[ix];
				if (!inComment) { deep--; }
			}
			else if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) == -1
				&& ar[ix].search(/\/>/) == -1 ) {
				str = !inComment ? str += shift[deep++]+ar[ix] : str += ar[ix];
			}
			else if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
				str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
			}
			else if(ar[ix].search(/<\//) > -1) {
				str = !inComment ? str += shift[--deep]+ar[ix] : str += ar[ix];
			}
			else if(ar[ix].search(/\/>/) > -1 ) {
				str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
			}
			else if(ar[ix].search(/<\?/) > -1) {
				str += shift[deep]+ar[ix];
			}
			else if(ar[ix].search(/xmlns\:/) > -1 || ar[ix].search(/xmlns\=/) > -1){
				console.log("xmlns at level", deep);
				str += shift[deep]+ar[ix];
			}
			else {
				str += ar[ix];
			}
		}
		return  (str[0] == '\n') ? str.slice(1) : str;
	}
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
		let formatted = vkXML(source);
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
	const attachClassMethods = function(element) {
		element.removeChildren = function() {
			return removeChildren(element);
		};
		element.addClass = function() {
			return addClass(element, ...arguments);
		};
		element.removeClass = function() {
			return removeClass(element, ...arguments);
		};
		element.setClass = function() {
			return setClass(element, ...arguments);
		};
		element.setID = function() {
			return setID(element, ...arguments);
		};
	};
	const attachViewBoxMethods = function(element) {
		element.setViewBox = function() {
			return setViewBox(element, ...arguments);
		};
		element.getViewBox = function() {
			return getViewBox(element, ...arguments);
		};
		element.scaleViewBox = function() {
			return scaleViewBox(element, ...arguments);
		};
		element.translateViewBox = function() {
			return translateViewBox(element, ...arguments);
		};
		element.convertToViewBox = function() {
			return convertToViewBox(element, ...arguments);
		};
	};
	const attachAppendableMethods = function(element, methods) {
		Object.keys(methods).forEach(key => {
			element[key] = function() {
				let g = methods[key](...arguments);
				element.appendChild(g);
				return g;
			};
		});
	};
	const svgNS = "http://www.w3.org/2000/svg";
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
	const svgNS$1 = "http://www.w3.org/2000/svg";
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
	const arcArrow = function(startPoint, endPoint, options) {
		let p = {
			color: "#000",
			strokeWidth: 0.01,
			width: 0.025,
			length: 0.075,
			bend: 0.3,
			pinch: 0.618,
			padding: 0.5,
			side: true,
			start: false,
			end: true,
			strokeStyle: "",
			fillStyle: "",
		};
		if (typeof options === "object" && options !== null) {
			Object.assign(p, options);
		}
		let arrowFill = [
			"stroke:none",
			"fill:"+p.color,
			p.fillStyle
		].filter(a => a !== "").join(";");
		let arrowStroke = [
			"fill:none",
			"stroke:" + p.color,
			"stroke-width:" + p.strokeWidth,
			p.strokeStyle
		].filter(a => a !== "").join(";");
		let vector = [endPoint[0]-startPoint[0], endPoint[1]-startPoint[1]];
		let perpendicular = [vector[1], -vector[0]];
		let midpoint = [startPoint[0] + vector[0]/2, startPoint[1] + vector[1]/2];
		let bezPoint = [
			midpoint[0] + perpendicular[0]*(p.side?1:-1) * p.bend,
			midpoint[1] + perpendicular[1]*(p.side?1:-1) * p.bend
		];
		let bezStart = [bezPoint[0] - startPoint[0], bezPoint[1] - startPoint[1]];
		let bezEnd = [bezPoint[0] - endPoint[0], bezPoint[1] - endPoint[1]];
		let bezStartLen = Math.sqrt(bezStart[0]*bezStart[0]+bezStart[1]*bezStart[1]);
		let bezEndLen = Math.sqrt(bezEnd[0]*bezEnd[0]+bezEnd[1]*bezEnd[1]);
		let bezStartNorm = [bezStart[0]/bezStartLen, bezStart[1]/bezStartLen];
		let bezEndNorm = [bezEnd[0]/bezEndLen, bezEnd[1]/bezEndLen];
		let arcStart = [
			startPoint[0] + bezStartNorm[0]*p.length*((p.start?1:0)+p.padding),
			startPoint[1] + bezStartNorm[1]*p.length*((p.start?1:0)+p.padding)
		];
		let arcEnd = [
			endPoint[0] + bezEndNorm[0]*p.length*((p.end?1:0)+p.padding),
			endPoint[1] + bezEndNorm[1]*p.length*((p.end?1:0)+p.padding)
		];
		let controlStart = [
			arcStart[0] + (bezPoint[0] - arcStart[0]) * p.pinch,
			arcStart[1] + (bezPoint[1] - arcStart[1]) * p.pinch
		];
		let controlEnd = [
			arcEnd[0] + (bezPoint[0] - arcEnd[0]) * p.pinch,
			arcEnd[1] + (bezPoint[1] - arcEnd[1]) * p.pinch
		];
		let startVec = [-bezStartNorm[0], -bezStartNorm[1]];
		let endVec = [-bezEndNorm[0], -bezEndNorm[1]];
		let startNormal = [startVec[1], -startVec[0]];
		let endNormal = [endVec[1], -endVec[0]];
		let startPoints = [
			[arcStart[0]+startNormal[0]*-p.width, arcStart[1]+startNormal[1]*-p.width],
			[arcStart[0]+startNormal[0]*p.width, arcStart[1]+startNormal[1]*p.width],
			[arcStart[0]+startVec[0]*p.length, arcStart[1]+startVec[1]*p.length]
		];
		let endPoints = [
			[arcEnd[0]+endNormal[0]*-p.width, arcEnd[1]+endNormal[1]*-p.width],
			[arcEnd[0]+endNormal[0]*p.width, arcEnd[1]+endNormal[1]*p.width],
			[arcEnd[0]+endVec[0]*p.length, arcEnd[1]+endVec[1]*p.length]
		];
		let arrowGroup = document.createElementNS(svgNS$1, "g");
		let arrowArc = bezier(
			arcStart[0], arcStart[1], controlStart[0], controlStart[1],
			controlEnd[0], controlEnd[1], arcEnd[0], arcEnd[1]
		);
		arrowArc.setAttribute("style", arrowStroke);
		arrowGroup.appendChild(arrowArc);
		if (p.start) {
			let startHead = polygon(startPoints);
			startHead.setAttribute("style", arrowFill);
			arrowGroup.appendChild(startHead);
		}
		if (p.end) {
			let endHead = polygon(endPoints);
			endHead.setAttribute("style", arrowFill);
			arrowGroup.appendChild(endHead);
		}
		return arrowGroup;
	};
	const svgNS$2 = "http://www.w3.org/2000/svg";
	const svg = function() {
		let svgImage = document.createElementNS(svgNS$2, "svg");
		svgImage.setAttribute("version", "1.1");
		svgImage.setAttribute("xmlns", svgNS$2);
		setupSVG(svgImage);
		return svgImage;
	};
	const group = function() {
		let g = document.createElementNS(svgNS$2, "g");
		attachClassMethods(g);
		attachAppendableMethods(g, drawMethods);
		return g;
	};
	const setupSVG = function(svgImage) {
		attachClassMethods(svgImage);
		attachViewBoxMethods(svgImage);
		attachAppendableMethods(svgImage, drawMethods);
	};
	const drawMethods = {
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
		"group" : group,
		"arcArrow": arcArrow,
		"regularPolygon": regularPolygon
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
			let rect = svg$$1.getBoundingClientRect();
			setViewBox(svg$$1, 0, 0, rect.width, rect.height);
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
		let c = circle(0, 0, options.radius);
		c.setAttribute("fill", options.fill);
		let _position = [0,0];
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
		if ("position" in options) {
			let pos = options.position;
			if (pos[0] != null) { setPosition(...pos); }
			else if (pos.x != null) { setPosition(pos.x, pos.y); }
		}
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
		const remove = function() {
			parent.removeChild(c);
		};
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
			remove,
			set positionDidUpdate(method) { _updatePosition = method; },
			set selected(value) { _selected = true; }
		};
	};
	function controls(parent, number, options) {
		if (options == null) { options = {}; }
		if (options.parent == null) { options.parent = parent; }
		if (options.radius == null) { options.radius = 1; }
		if (options.fill == null) { options.fill = "#000000"; }
		let _points = Array.from(Array(number))
			.map(_ => controlPoint(options.parent, options));
		let _selected = undefined;
		const mouseDownHandler = function(event) {
			event.preventDefault();
			let mouse = convertToViewBox(parent, event.clientX, event.clientY);
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
			let mouse = convertToViewBox(parent, event.clientX, event.clientY);
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
			let pointer = convertToViewBox(parent, touch.clientX, touch.clientY);
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
			let pointer = convertToViewBox(parent, touch.clientX, touch.clientY);
			_points.forEach(p => p.onMouseMove(pointer));
		};
		const touchUpHandler = function(event) {
			event.preventDefault();
			_points.forEach(p => p.onMouseUp());
			_selected = undefined;
		};
		parent.addEventListener("touchstart", touchDownHandler, false);
		parent.addEventListener("touchend", touchUpHandler, false);
		parent.addEventListener("touchcancel", touchUpHandler, false);
		parent.addEventListener("touchmove", touchMoveHandler, false);
		parent.addEventListener("mousedown", mouseDownHandler, false);
		parent.addEventListener("mouseup", mouseUpHandler, false);
		parent.addEventListener("mousemove", mouseMoveHandler, false);
		Object.defineProperty(_points, "selectedIndex", {
			get: function() { return _selected; }
		});
		Object.defineProperty(_points, "selected", {
			get: function() { return _points[_selected]; }
		});
		Object.defineProperty(_points, "removeAll", {value: function() {
			_points.forEach(tp => tp.remove());
			_points.splice(0, _points.length);
			_selected = undefined;
		}});
		Object.defineProperty(_points, "add", {value: function(options) {
			_points.push(controlPoint(parent, options));
		}});
		return _points;
	}

	var svg$1 = /*#__PURE__*/Object.freeze({
		svg: svg,
		group: group,
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
		setPoints: setPoints,
		setArc: setArc,
		regularPolygon: regularPolygon,
		arcArrow: arcArrow,
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
	var perm = new Array(512);
	var gradP = new Array(512);
	function seed(seed) {
	  if(seed > 0 && seed < 1) {
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
	}seed(0);

	const clone$1 = function(o) {
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
		if ("file_frames" in fold_file === false ||
			fold_file.file_frames.length < frame_num) {
			return fold_file;
		}
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
		let swap = fold_file.file_frames;
		fold_file.file_frames = null;
		let fold = JSON.parse(JSON.stringify(fold_file));
		fold_file.file_frames = swap;
		delete fold.file_frames;
		Object.assign(fold, frame);
		return fold;
	};

	var file = /*#__PURE__*/Object.freeze({
		clone: clone$1,
		recursive_freeze: recursive_freeze,
		append_frame: append_frame,
		flatten_frame: flatten_frame,
		merge_frame: merge_frame$1
	});

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
	const new_vertex = function(graph, x, y) {
		if (graph.vertices_coords == null) { graph.vertices_coords = []; }
		graph.vertices_coords.push([x,y]);
		let new_index = graph.vertices_coords.length-1;
		return new_index;
	};
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
	const remove_duplicate_edges = function(graph) {
		const equivalent = function(a, b) {
			return (a[0] === b[0] && a[1] === b[1]) ||
			       (a[0] === b[1] && a[1] === b[0]);
		};
		let edges_equivalent = Array
			.from(Array(graph.edges_vertices.length)).map(_ => []);
		for (var i = 0; i < graph.edges_vertices.length-1; i++) {
			for (var j = i+1; j < graph.edges_vertices.length; j++) {
				edges_equivalent[i][j] = equivalent(
					graph.edges_vertices[i],
					graph.edges_vertices[j]
				);
			}
		}
		let edges_map = graph.edges_vertices.map(vc => undefined);
		edges_equivalent.forEach((row,i) => row.forEach((eq,j) => {
			if (eq){
				edges_map[j] = edges_map[i] === undefined ? i : edges_map[i];
			}
		}));
		let edges_remove = edges_map.map(m => m !== undefined);
		edges_map.forEach((map,i) => {
			if(map === undefined) { edges_map[i] = i; }
		});
		let edges_remove_indices = edges_remove
			.map((rm,i) => rm ? i : undefined)
			.filter(i => i !== undefined);
		remove_edges(graph, edges_remove_indices);
	};
	const vertices_count = function(graph) {
		return Math.max(...(
			[[], graph.vertices_coords, graph.vertices_faces, graph.vertices_vertices]
			.filter(el => el != null)
			.map(el => el.length)
		));
	};
	const edges_count = function(graph) {
		return Math.max(...(
			[[], graph.edges_vertices, graph.edges_faces]
			.filter(el => el != null)
			.map(el => el.length)
		));
	};
	const faces_count = function(graph) {
		return Math.max(...(
			[[], graph.faces_vertices, graph.faces_edges]
			.filter(el => el != null)
			.map(el => el.length)
		));
	};
	const make_faces_faces = function(graph) {
		let nf = graph.faces_vertices.length;
		let faces_faces = Array.from(Array(nf)).map(() => []);
		let edgeMap = {};
		graph.faces_vertices.forEach((vertices_index, idx1) => {
			if (vertices_index === undefined) { return; }
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
	const faces_coloring = function(graph, root_face = 0){
		let coloring = [];
		coloring[root_face] = true;
		make_face_walk_tree(graph, root_face).forEach((level, i) =>
			level.forEach((entry) => coloring[entry.face] = (i % 2 === 0))
		);
		return coloring;
	};
	const make_face_walk_tree = function(graph, root_face = 0){
		let new_faces_faces = make_faces_faces(graph);
		if (new_faces_faces.length <= 0) {
			return [];
		}
		var visited = [root_face];
		var list = [[{ face: root_face, parent: undefined, edge: undefined, level: 0 }]];
		do{
			list[list.length] = list[list.length-1].map((current) =>{
				let unique_faces = new_faces_faces[current.face]
					.filter(f => visited.indexOf(f) === -1);
				visited = visited.concat(unique_faces);
				return unique_faces.map(f => ({
					face: f,
					parent: current.face,
					edge: graph.faces_vertices[f]
						.filter(v => graph.faces_vertices[current.face].indexOf(v) !== -1)
						.sort((a,b) => a-b)
				}))
			}).reduce((prev,curr) => prev.concat(curr),[]);
		} while(list[list.length-1].length > 0);
		if(list.length > 0 && list[list.length-1].length == 0){ list.pop(); }
		return list;
	};
	const add_vertex_on_edge = function(graph, x, y, old_edge_index) {
		if (graph.edges_vertices.length < old_edge_index) { return; }
		let new_vertex_index = new_vertex(graph, x, y);
		let incident_vertices = graph.edges_vertices[old_edge_index];
		if (graph.vertices_vertices == null) { graph.vertices_vertices = []; }
		graph.vertices_vertices[new_vertex_index] = clone$1(incident_vertices);
		incident_vertices.forEach((v,i,arr) => {
			let otherV = arr[(i+1)%arr.length];
			let otherI = graph.vertices_vertices[v].indexOf(otherV);
			graph.vertices_vertices[v][otherI] = new_vertex_index;
		});
		if (graph.edges_faces != null && graph.edges_faces[old_edge_index] != null) {
			graph.vertices_faces[new_vertex_index] =
				clone$1(graph.edges_faces[old_edge_index]);
		}
		let new_edges = [
			{ edges_vertices: [incident_vertices[0], new_vertex_index] },
			{ edges_vertices: [new_vertex_index, incident_vertices[1]] }
		];
		new_edges.forEach((e,i) => e.i = graph.edges_vertices.length+i);
		["edges_faces", "edges_assignment", "edges_foldAngle"]
			.filter(key => graph[key] != null && graph[key][old_edge_index] != null)
			.forEach(key => {
				new_edges[0][key] = clone$1(graph[key][old_edge_index]);
				new_edges[1][key] = clone$1(graph[key][old_edge_index]);
			});
		const distance2 = function(a,b){
			return Math.sqrt(Math.pow(b[0]-a[0],2) + Math.pow(b[1]-a[1],2));
		};
		new_edges.forEach((el,i) => {
			let verts = el.edges_vertices.map(v => graph.vertices_coords[v]);
			new_edges[i]["edges_length"] = distance2(...verts);
		});
		new_edges.forEach((edge,i) =>
			Object.keys(edge)
				.filter(key => key !== "i")
				.forEach(key => graph[key][edge.i] = edge[key])
		);
		let incident_faces_indices = graph.edges_faces[old_edge_index];
		let incident_faces_vertices = incident_faces_indices
			.map(i => graph.faces_vertices[i]);
		let incident_faces_edges = incident_faces_indices
			.map(i => graph.faces_edges[i]);
		incident_faces_vertices.forEach(face =>
			face.map((fv,i,arr) => {
				let nextI = (i+1)%arr.length;
				return (fv === incident_vertices[0]
				        && arr[nextI] === incident_vertices[1]) ||
				       (fv === incident_vertices[1]
				        && arr[nextI] === incident_vertices[0])
					? nextI : undefined;
			}).filter(el => el !== undefined)
			.sort((a,b) => b-a)
			.forEach(i => face.splice(i,0,new_vertex_index))
		);
		incident_faces_edges.forEach((face,i,arr) => {
			let edgeIndex = face.indexOf(old_edge_index);
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
				face.splice(edgeIndex, 1, edges[0]);
				face.unshift(edges[1]);
			} else {
				face.splice(edgeIndex, 1, ...edges);
			}
			return edges;
		});
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
	function remove_vertices(graph, vertices){
		let s = 0, removes = Array( vertices_count(graph) ).fill(false);
		vertices.forEach(v => removes[v] = true);
		let index_map = removes.map(remove => remove ? --s : s);
		if(vertices.length === 0){ return index_map; }
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
	}
	const remove_edges = function(graph, edges) {
		let s = 0, removes = Array( edges_count(graph) ).fill(false);
		edges.forEach(e => removes[e] = true);
		let index_map = removes.map(remove => remove ? --s : s);
		if(edges.length === 0){ return index_map; }
		if(graph.faces_edges != null){
			graph.faces_edges = graph.faces_edges
				.map(entry => entry.map(v => v + index_map[v]));
		}
		if(graph.edgeOrders != null){
			graph.edgeOrders = graph.edgeOrders
				.map(entry => entry.map((v,i) => {
					if(i === 2) return v;
					return v + index_map[v];
				}));
		}
		Object.keys(graph)
			.filter(key => key.includes("edges_"))
			.forEach(key => graph[key] = graph[key].filter((e,i) => !removes[i]));
		return index_map;
	};
	function remove_faces(graph, faces) {
		let s = 0, removes = Array( faces_count(graph) ).fill(false);
		faces.forEach(e => removes[e] = true);
		let index_map = removes.map(remove => remove ? --s : s);
		if (faces.length === 0) { return index_map; }
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
					if(i === 2) return v;
					return v + index_map[v];
				}));
		}
		Object.keys(graph)
			.filter(key => key.includes("faces_"))
			.forEach(key => graph[key] = graph[key].filter((e,i) => !removes[i]));
		return index_map;
	}
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
	const remove_marks = function(fold) {
		let removeTypes = ["f", "F", "b", "B"];
		let removeEdges = fold.edges_assignment
			.map((a,i) => ({a:a,i:i}))
			.filter(obj => removeTypes.indexOf(obj.a) != -1)
			.map(obj => obj.i);
		Graph.remove_edges(fold, removeEdges);
	};
	const merge_vertices = function(graph, vertex, removed) {
	};
	const make_edges_faces = function(graph) {
		let edges_faces = Array
			.from(Array(graph.edges_vertices.length))
			.map(_ => []);
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
		remove_duplicate_edges: remove_duplicate_edges,
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

	function validate(graph) {
		let foldKeys = {
			"vertices": ["coords", "vertices", "faces"],
			"edges": ["vertices", "faces", "assignment", "foldAngle", "length"],
			"faces": ["vertices", "edges"],
		};
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

	var geom = {},
	  modulo = function(a, b) { return (+a % (b = +b) + b) % b; };
	geom.EPS = 0.000001;
	geom.sum = function(a, b) {
	  return a + b;
	};
	geom.min = function(a, b) {
	  if (a < b) {
	    return a;
	  } else {
	    return b;
	  }
	};
	geom.max = function(a, b) {
	  if (a > b) {
	    return a;
	  } else {
	    return b;
	  }
	};
	geom.all = function(a, b) {
	  return a && b;
	};
	geom.next = function(start, n, i) {
	  if (i == null) {
	    i = 1;
	  }
	  return modulo(start + i, n);
	};
	geom.rangesDisjoint = function(arg, arg1) {
	  var a1, a2, b1, b2, ref, ref1;
	  a1 = arg[0], a2 = arg[1];
	  b1 = arg1[0], b2 = arg1[1];
	  return ((b1 < (ref = Math.min(a1, a2)) && ref > b2)) || ((b1 > (ref1 = Math.max(a1, a2)) && ref1 < b2));
	};
	geom.topologicalSort = function(vs) {
	  var k, l, len, len1, list, ref, v;
	  for (k = 0, len = vs.length; k < len; k++) {
	    v = vs[k];
	    ref = [false, null], v.visited = ref[0], v.parent = ref[1];
	  }
	  list = [];
	  for (l = 0, len1 = vs.length; l < len1; l++) {
	    v = vs[l];
	    if (!v.visited) {
	      list = geom.visit(v, list);
	    }
	  }
	  return list;
	};
	geom.visit = function(v, list) {
	  var k, len, ref, u;
	  v.visited = true;
	  ref = v.children;
	  for (k = 0, len = ref.length; k < len; k++) {
	    u = ref[k];
	    if (!(!u.visited)) {
	      continue;
	    }
	    u.parent = v;
	    list = geom.visit(u, list);
	  }
	  return list.concat([v]);
	};
	geom.magsq = function(a) {
	  return geom.dot(a, a);
	};
	geom.mag = function(a) {
	  return Math.sqrt(geom.magsq(a));
	};
	geom.unit = function(a, eps) {
	  var length;
	  if (eps == null) {
	    eps = geom.EPS;
	  }
	  length = geom.magsq(a);
	  if (length < eps) {
	    return null;
	  }
	  return geom.mul(a, 1 / geom.mag(a));
	};
	geom.ang2D = function(a, eps) {
	  if (eps == null) {
	    eps = geom.EPS;
	  }
	  if (geom.magsq(a) < eps) {
	    return null;
	  }
	  return Math.atan2(a[1], a[0]);
	};
	geom.mul = function(a, s) {
	  var i, k, len, results;
	  results = [];
	  for (k = 0, len = a.length; k < len; k++) {
	    i = a[k];
	    results.push(i * s);
	  }
	  return results;
	};
	geom.linearInterpolate = function(t, a, b) {
	  return geom.plus(geom.mul(a, 1 - t), geom.mul(b, t));
	};
	geom.plus = function(a, b) {
	  var ai, i, k, len, results;
	  results = [];
	  for (i = k = 0, len = a.length; k < len; i = ++k) {
	    ai = a[i];
	    results.push(ai + b[i]);
	  }
	  return results;
	};
	geom.sub = function(a, b) {
	  return geom.plus(a, geom.mul(b, -1));
	};
	geom.dot = function(a, b) {
	  var ai, i;
	  return ((function() {
	    var k, len, results;
	    results = [];
	    for (i = k = 0, len = a.length; k < len; i = ++k) {
	      ai = a[i];
	      results.push(ai * b[i]);
	    }
	    return results;
	  })()).reduce(geom.sum);
	};
	geom.distsq = function(a, b) {
	  return geom.magsq(geom.sub(a, b));
	};
	geom.dist = function(a, b) {
	  return Math.sqrt(geom.distsq(a, b));
	};
	geom.closestIndex = function(a, bs) {
	  var b, dist, i, k, len, minDist, minI;
	  minDist = 2e308;
	  for (i = k = 0, len = bs.length; k < len; i = ++k) {
	    b = bs[i];
	    if (minDist > (dist = geom.dist(a, b))) {
	      minDist = dist;
	      minI = i;
	    }
	  }
	  return minI;
	};
	geom.dir = function(a, b) {
	  return geom.unit(geom.sub(b, a));
	};
	geom.ang = function(a, b) {
	  var ref, ua, ub, v;
	  ref = (function() {
	    var k, len, ref, results;
	    ref = [a, b];
	    results = [];
	    for (k = 0, len = ref.length; k < len; k++) {
	      v = ref[k];
	      results.push(geom.unit(v));
	    }
	    return results;
	  })(), ua = ref[0], ub = ref[1];
	  if (!((ua != null) && (ub != null))) {
	    return null;
	  }
	  return Math.acos(geom.dot(ua, ub));
	};
	geom.cross = function(a, b) {
	  var i, j, ref, ref1;
	  if ((a.length === (ref = b.length) && ref === 2)) {
	    return a[0] * b[1] - a[1] * b[0];
	  }
	  if ((a.length === (ref1 = b.length) && ref1 === 3)) {
	    return (function() {
	      var k, len, ref2, ref3, results;
	      ref2 = [[1, 2], [2, 0], [0, 1]];
	      results = [];
	      for (k = 0, len = ref2.length; k < len; k++) {
	        ref3 = ref2[k], i = ref3[0], j = ref3[1];
	        results.push(a[i] * b[j] - a[j] * b[i]);
	      }
	      return results;
	    })();
	  }
	  return null;
	};
	geom.parallel = function(a, b, eps) {
	  var ref, ua, ub, v;
	  if (eps == null) {
	    eps = geom.EPS;
	  }
	  ref = (function() {
	    var k, len, ref, results;
	    ref = [a, b];
	    results = [];
	    for (k = 0, len = ref.length; k < len; k++) {
	      v = ref[k];
	      results.push(geom.unit(v));
	    }
	    return results;
	  })(), ua = ref[0], ub = ref[1];
	  if (!((ua != null) && (ub != null))) {
	    return null;
	  }
	  return 1 - Math.abs(geom.dot(ua, ub)) < eps;
	};
	geom.rotate = function(a, u, t) {
	  var ct, i, k, len, p, q, ref, ref1, results, st;
	  u = geom.unit(u);
	  if (u == null) {
	    return null;
	  }
	  ref = [Math.cos(t), Math.sin(t)], ct = ref[0], st = ref[1];
	  ref1 = [[0, 1, 2], [1, 2, 0], [2, 0, 1]];
	  results = [];
	  for (k = 0, len = ref1.length; k < len; k++) {
	    p = ref1[k];
	    results.push(((function() {
	      var l, len1, ref2, results1;
	      ref2 = [ct, -st * u[p[2]], st * u[p[1]]];
	      results1 = [];
	      for (i = l = 0, len1 = ref2.length; l < len1; i = ++l) {
	        q = ref2[i];
	        results1.push(a[p[i]] * (u[p[0]] * u[p[i]] * (1 - ct) + q));
	      }
	      return results1;
	    })()).reduce(geom.sum));
	  }
	  return results;
	};
	geom.interiorAngle = function(a, b, c) {
	  var ang;
	  ang = geom.ang2D(geom.sub(a, b)) - geom.ang2D(geom.sub(c, b));
	  return ang + (ang < 0 ? 2 * Math.PI : 0);
	};
	geom.turnAngle = function(a, b, c) {
	  return Math.PI - geom.interiorAngle(a, b, c);
	};
	geom.triangleNormal = function(a, b, c) {
	  return geom.unit(geom.cross(geom.sub(b, a), geom.sub(c, b)));
	};
	geom.polygonNormal = function(points, eps) {
	  var i, p;
	  if (eps == null) {
	    eps = geom.EPS;
	  }
	  return geom.unit(((function() {
	    var k, len, results;
	    results = [];
	    for (i = k = 0, len = points.length; k < len; i = ++k) {
	      p = points[i];
	      results.push(geom.cross(p, points[geom.next(i, points.length)]));
	    }
	    return results;
	  })()).reduce(geom.plus), eps);
	};
	geom.twiceSignedArea = function(points) {
	  var i, v0, v1;
	  return ((function() {
	    var k, len, results;
	    results = [];
	    for (i = k = 0, len = points.length; k < len; i = ++k) {
	      v0 = points[i];
	      v1 = points[geom.next(i, points.length)];
	      results.push(v0[0] * v1[1] - v1[0] * v0[1]);
	    }
	    return results;
	  })()).reduce(geom.sum);
	};
	geom.polygonOrientation = function(points) {
	  return Math.sign(geom.twiceSignedArea(points));
	};
	geom.sortByAngle = function(points, origin, mapping) {
	  if (origin == null) {
	    origin = [0, 0];
	  }
	  if (mapping == null) {
	    mapping = function(x) {
	      return x;
	    };
	  }
	  origin = mapping(origin);
	  return points.sort(function(p, q) {
	    var pa, qa;
	    pa = geom.ang2D(geom.sub(mapping(p), origin));
	    qa = geom.ang2D(geom.sub(mapping(q), origin));
	    return pa - qa;
	  });
	};
	geom.segmentsCross = function(arg, arg1) {
	  var p0, p1, q0, q1;
	  p0 = arg[0], q0 = arg[1];
	  p1 = arg1[0], q1 = arg1[1];
	  if (geom.rangesDisjoint([p0[0], q0[0]], [p1[0], q1[0]]) || geom.rangesDisjoint([p0[1], q0[1]], [p1[1], q1[1]])) {
	    return false;
	  }
	  return geom.polygonOrientation([p0, q0, p1]) !== geom.polygonOrientation([p0, q0, q1]) && geom.polygonOrientation([p1, q1, p0]) !== geom.polygonOrientation([p1, q1, q0]);
	};
	geom.parametricLineIntersect = function(arg, arg1) {
	  var denom, p1, p2, q1, q2;
	  p1 = arg[0], p2 = arg[1];
	  q1 = arg1[0], q2 = arg1[1];
	  denom = (q2[1] - q1[1]) * (p2[0] - p1[0]) + (q1[0] - q2[0]) * (p2[1] - p1[1]);
	  if (denom === 0) {
	    return [null, null];
	  } else {
	    return [(q2[0] * (p1[1] - q1[1]) + q2[1] * (q1[0] - p1[0]) + q1[1] * p1[0] - p1[1] * q1[0]) / denom, (q1[0] * (p2[1] - p1[1]) + q1[1] * (p1[0] - p2[0]) + p1[1] * p2[0] - p2[1] * p1[0]) / denom];
	  }
	};
	geom.segmentIntersectSegment = function(s1, s2) {
	  var ref, s, t;
	  ref = geom.parametricLineIntersect(s1, s2), s = ref[0], t = ref[1];
	  if ((s != null) && ((0 <= s && s <= 1)) && ((0 <= t && t <= 1))) {
	    return geom.linearInterpolate(s, s1[0], s1[1]);
	  } else {
	    return null;
	  }
	};
	geom.lineIntersectLine = function(l1, l2) {
	  var ref, s, t;
	  ref = geom.parametricLineIntersect(l1, l2), s = ref[0], t = ref[1];
	  if (s != null) {
	    return geom.linearInterpolate(s, l1[0], l1[1]);
	  } else {
	    return null;
	  }
	};
	geom.pointStrictlyInSegment = function(p, s, eps) {
	  var v0, v1;
	  if (eps == null) {
	    eps = geom.EPS;
	  }
	  v0 = geom.sub(p, s[0]);
	  v1 = geom.sub(p, s[1]);
	  return geom.parallel(v0, v1, eps) && geom.dot(v0, v1) < 0;
	};
	geom.centroid = function(points) {
	  return geom.mul(points.reduce(geom.plus), 1.0 / points.length);
	};
	geom.basis = function(ps, eps) {
	  var d, ds, n, ns, p, x, y, z;
	  if (eps == null) {
	    eps = geom.EPS;
	  }
	  if (((function() {
	    var k, len, results;
	    results = [];
	    for (k = 0, len = ps.length; k < len; k++) {
	      p = ps[k];
	      results.push(p.length !== 3);
	    }
	    return results;
	  })()).reduce(geom.all)) {
	    return null;
	  }
	  ds = (function() {
	    var k, len, results;
	    results = [];
	    for (k = 0, len = ps.length; k < len; k++) {
	      p = ps[k];
	      if (geom.distsq(p, ps[0]) > eps) {
	        results.push(geom.dir(p, ps[0]));
	      }
	    }
	    return results;
	  })();
	  if (ds.length === 0) {
	    return [];
	  }
	  x = ds[0];
	  if (((function() {
	    var k, len, results;
	    results = [];
	    for (k = 0, len = ds.length; k < len; k++) {
	      d = ds[k];
	      results.push(geom.parallel(d, x, eps));
	    }
	    return results;
	  })()).reduce(geom.all)) {
	    return [x];
	  }
	  ns = (function() {
	    var k, len, results;
	    results = [];
	    for (k = 0, len = ds.length; k < len; k++) {
	      d = ds[k];
	      results.push(geom.unit(geom.cross(d, x)));
	    }
	    return results;
	  })();
	  ns = (function() {
	    var k, len, results;
	    results = [];
	    for (k = 0, len = ns.length; k < len; k++) {
	      n = ns[k];
	      if (n != null) {
	        results.push(n);
	      }
	    }
	    return results;
	  })();
	  z = ns[0];
	  y = geom.cross(z, x);
	  if (((function() {
	    var k, len, results;
	    results = [];
	    for (k = 0, len = ns.length; k < len; k++) {
	      n = ns[k];
	      results.push(geom.parallel(n, z, eps));
	    }
	    return results;
	  })()).reduce(geom.all)) {
	    return [x, y];
	  }
	  return [x, y, z];
	};
	geom.above = function(ps, qs, n, eps) {
	  var pn, qn, ref, v, vs;
	  if (eps == null) {
	    eps = geom.EPS;
	  }
	  ref = (function() {
	    var k, len, ref, results;
	    ref = [ps, qs];
	    results = [];
	    for (k = 0, len = ref.length; k < len; k++) {
	      vs = ref[k];
	      results.push((function() {
	        var l, len1, results1;
	        results1 = [];
	        for (l = 0, len1 = vs.length; l < len1; l++) {
	          v = vs[l];
	          results1.push(geom.dot(v, n));
	        }
	        return results1;
	      })());
	    }
	    return results;
	  })(), pn = ref[0], qn = ref[1];
	  if (qn.reduce(geom.max) - pn.reduce(geom.min) < eps) {
	    return 1;
	  }
	  if (pn.reduce(geom.max) - qn.reduce(geom.min) < eps) {
	    return -1;
	  }
	  return 0;
	};
	geom.separatingDirection2D = function(t1, t2, n, eps) {
	  var i, j, k, l, len, len1, len2, m, o, p, q, ref, sign, t;
	  if (eps == null) {
	    eps = geom.EPS;
	  }
	  ref = [t1, t2];
	  for (k = 0, len = ref.length; k < len; k++) {
	    t = ref[k];
	    for (i = l = 0, len1 = t.length; l < len1; i = ++l) {
	      p = t[i];
	      for (j = o = 0, len2 = t.length; o < len2; j = ++o) {
	        q = t[j];
	        if (!(i < j)) {
	          continue;
	        }
	        m = geom.unit(geom.cross(geom.sub(p, q), n));
	        if (m != null) {
	          sign = geom.above(t1, t2, m, eps);
	          if (sign !== 0) {
	            return geom.mul(m, sign);
	          }
	        }
	      }
	    }
	  }
	  return null;
	};
	geom.separatingDirection3D = function(t1, t2, eps) {
	  var i, j, k, l, len, len1, len2, len3, m, o, p, q1, q2, r, ref, ref1, sign, x1, x2;
	  if (eps == null) {
	    eps = geom.EPS;
	  }
	  ref = [[t1, t2], [t2, t1]];
	  for (k = 0, len = ref.length; k < len; k++) {
	    ref1 = ref[k], x1 = ref1[0], x2 = ref1[1];
	    for (l = 0, len1 = x1.length; l < len1; l++) {
	      p = x1[l];
	      for (i = o = 0, len2 = x2.length; o < len2; i = ++o) {
	        q1 = x2[i];
	        for (j = r = 0, len3 = x2.length; r < len3; j = ++r) {
	          q2 = x2[j];
	          if (!(i < j)) {
	            continue;
	          }
	          m = geom.unit(geom.cross(geom.sub(p, q1), geom.sub(p, q2)));
	          if (m != null) {
	            sign = geom.above(t1, t2, m, eps);
	            if (sign !== 0) {
	              return geom.mul(m, sign);
	            }
	          }
	        }
	      }
	    }
	  }
	  return null;
	};
	geom.circleCross = function(d, r1, r2) {
	  var x, y;
	  x = (d * d - r2 * r2 + r1 * r1) / d / 2;
	  y = Math.sqrt(r1 * r1 - x * x);
	  return [x, y];
	};
	geom.creaseDir = function(u1, u2, a, b, eps) {
	  var b1, b2, x, y, z, zmag;
	  if (eps == null) {
	    eps = geom.EPS;
	  }
	  b1 = Math.cos(a) + Math.cos(b);
	  b2 = Math.cos(a) - Math.cos(b);
	  x = geom.plus(u1, u2);
	  y = geom.sub(u1, u2);
	  z = geom.unit(geom.cross(y, x));
	  x = geom.mul(x, b1 / geom.magsq(x));
	  y = geom.mul(y, geom.magsq(y) < eps ? 0 : b2 / geom.magsq(y));
	  zmag = Math.sqrt(1 - geom.magsq(x) - geom.magsq(y));
	  z = geom.mul(z, zmag);
	  return [x, y, z].reduce(geom.plus);
	};
	geom.quadSplit = function(u, p, d, t) {
	  if (geom.magsq(p) > d * d) {
	    throw new Error("STOP! Trying to split expansive quad.");
	  }
	  return geom.mul(u, (d * d - geom.magsq(p)) / 2 / (d * Math.cos(t) - geom.dot(u, p)));
	};

	var filter$1 = {};
	var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	filter$1.edgesAssigned = function(fold, target) {
	  var assignment, i, k, len, ref, results;
	  ref = fold.edges_assignment;
	  results = [];
	  for (i = k = 0, len = ref.length; k < len; i = ++k) {
	    assignment = ref[i];
	    if (assignment === target) {
	      results.push(i);
	    }
	  }
	  return results;
	};
	filter$1.mountainEdges = function(fold) {
	  return filter$1.edgesAssigned(fold, 'M');
	};
	filter$1.valleyEdges = function(fold) {
	  return filter$1.edgesAssigned(fold, 'V');
	};
	filter$1.flatEdges = function(fold) {
	  return filter$1.edgesAssigned(fold, 'F');
	};
	filter$1.boundaryEdges = function(fold) {
	  return filter$1.edgesAssigned(fold, 'B');
	};
	filter$1.unassignedEdges = function(fold) {
	  return filter$1.edgesAssigned(fold, 'U');
	};
	filter$1.keysStartingWith = function(fold, prefix) {
	  var key, results;
	  results = [];
	  for (key in fold) {
	    if (key.slice(0, prefix.length) === prefix) {
	      results.push(key);
	    }
	  }
	  return results;
	};
	filter$1.keysEndingWith = function(fold, suffix) {
	  var key, results;
	  results = [];
	  for (key in fold) {
	    if (key.slice(-suffix.length) === suffix) {
	      results.push(key);
	    }
	  }
	  return results;
	};
	filter$1.remapField = function(fold, field, old2new) {
	  var array, i, j, k, key, l, len, len1, len2, m, new2old, old, ref, ref1;
	  new2old = [];
	  for (i = k = 0, len = old2new.length; k < len; i = ++k) {
	    j = old2new[i];
	    if (j != null) {
	      new2old[j] = i;
	    }
	  }
	  ref = filter$1.keysStartingWith(fold, field + "_");
	  for (l = 0, len1 = ref.length; l < len1; l++) {
	    key = ref[l];
	    fold[key] = (function() {
	      var len2, m, results;
	      results = [];
	      for (m = 0, len2 = new2old.length; m < len2; m++) {
	        old = new2old[m];
	        results.push(fold[key][old]);
	      }
	      return results;
	    })();
	  }
	  ref1 = filter$1.keysEndingWith(fold, "_" + field);
	  for (m = 0, len2 = ref1.length; m < len2; m++) {
	    key = ref1[m];
	    fold[key] = (function() {
	      var len3, n, ref2, results;
	      ref2 = fold[key];
	      results = [];
	      for (n = 0, len3 = ref2.length; n < len3; n++) {
	        array = ref2[n];
	        results.push((function() {
	          var len4, o, results1;
	          results1 = [];
	          for (o = 0, len4 = array.length; o < len4; o++) {
	            old = array[o];
	            results1.push(old2new[old]);
	          }
	          return results1;
	        })());
	      }
	      return results;
	    })();
	  }
	  return fold;
	};
	filter$1.remapFieldSubset = function(fold, field, keep) {
	  var id, old2new, value;
	  id = 0;
	  old2new = (function() {
	    var k, len, results;
	    results = [];
	    for (k = 0, len = keep.length; k < len; k++) {
	      value = keep[k];
	      if (value) {
	        results.push(id++);
	      } else {
	        results.push(null);
	      }
	    }
	    return results;
	  })();
	  filter$1.remapField(fold, field, old2new);
	  return old2new;
	};
	filter$1.numType = function(fold, type) {
	  var counts, key, value;
	  counts = (function() {
	    var k, len, ref, results;
	    ref = filter$1.keysStartingWith(fold, type + "_");
	    results = [];
	    for (k = 0, len = ref.length; k < len; k++) {
	      key = ref[k];
	      value = fold[key];
	      if (value.length == null) {
	        continue;
	      }
	      results.push(value.length);
	    }
	    return results;
	  })();
	  if (!counts.length) {
	    counts = (function() {
	      var k, len, ref, results;
	      ref = filter$1.keysEndingWith(fold, "_" + type);
	      results = [];
	      for (k = 0, len = ref.length; k < len; k++) {
	        key = ref[k];
	        results.push(1 + Math.max.apply(Math, fold[key]));
	      }
	      return results;
	    })();
	  }
	  if (counts.length) {
	    return Math.max.apply(Math, counts);
	  } else {
	    return 0;
	  }
	};
	filter$1.numVertices = function(fold) {
	  return filter$1.numType(fold, 'vertices');
	};
	filter$1.numEdges = function(fold) {
	  return filter$1.numType(fold, 'edges');
	};
	filter$1.numFaces = function(fold) {
	  return filter$1.numType(fold, 'faces');
	};
	filter$1.removeDuplicateEdges_vertices = function(fold) {
	  var edge, id, key, old2new, seen, v, w;
	  seen = {};
	  id = 0;
	  old2new = (function() {
	    var k, len, ref, results;
	    ref = fold.edges_vertices;
	    results = [];
	    for (k = 0, len = ref.length; k < len; k++) {
	      edge = ref[k];
	      v = edge[0], w = edge[1];
	      if (v < w) {
	        key = v + "," + w;
	      } else {
	        key = w + "," + v;
	      }
	      if (!(key in seen)) {
	        seen[key] = id;
	        id += 1;
	      }
	      results.push(seen[key]);
	    }
	    return results;
	  })();
	  filter$1.remapField(fold, 'edges', old2new);
	  return old2new;
	};
	filter$1.edges_verticesIncident = function(e1, e2) {
	  var k, len, v;
	  for (k = 0, len = e1.length; k < len; k++) {
	    v = e1[k];
	    if (indexOf.call(e2, v) >= 0) {
	      return v;
	    }
	  }
	  return null;
	};
	var RepeatedPointsDS = (function() {
	  function RepeatedPointsDS(vertices_coords, epsilon1) {
	    var base, coord, k, len, name, ref, v;
	    this.vertices_coords = vertices_coords;
	    this.epsilon = epsilon1;
	    this.hash = {};
	    ref = this.vertices_coords;
	    for (v = k = 0, len = ref.length; k < len; v = ++k) {
	      coord = ref[v];
	      ((base = this.hash)[name = this.key(coord)] != null ? base[name] : base[name] = []).push(v);
	    }
	  }
	  RepeatedPointsDS.prototype.lookup = function(coord) {
	    var k, key, l, len, len1, len2, m, ref, ref1, ref2, ref3, v, x, xr, xt, y, yr, yt;
	    x = coord[0], y = coord[1];
	    xr = Math.round(x / this.epsilon);
	    yr = Math.round(y / this.epsilon);
	    ref = [xr, xr - 1, xr + 1];
	    for (k = 0, len = ref.length; k < len; k++) {
	      xt = ref[k];
	      ref1 = [yr, yr - 1, yr + 1];
	      for (l = 0, len1 = ref1.length; l < len1; l++) {
	        yt = ref1[l];
	        key = xt + "," + yt;
	        ref3 = (ref2 = this.hash[key]) != null ? ref2 : [];
	        for (m = 0, len2 = ref3.length; m < len2; m++) {
	          v = ref3[m];
	          if (this.epsilon > geom.dist(this.vertices_coords[v], coord)) {
	            return v;
	          }
	        }
	      }
	    }
	    return null;
	  };
	  RepeatedPointsDS.prototype.key = function(coord) {
	    var key, x, xr, y, yr;
	    x = coord[0], y = coord[1];
	    xr = Math.round(x / this.epsilon);
	    yr = Math.round(y / this.epsilon);
	    return key = xr + "," + yr;
	  };
	  RepeatedPointsDS.prototype.insert = function(coord) {
	    var base, name, v;
	    v = this.lookup(coord);
	    if (v != null) {
	      return v;
	    }
	    ((base = this.hash)[name = this.key(coord)] != null ? base[name] : base[name] = []).push(v = this.vertices_coords.length);
	    this.vertices_coords.push(coord);
	    return v;
	  };
	  return RepeatedPointsDS;
	})();
	filter$1.collapseNearbyVertices = function(fold, epsilon) {
	  var coords, old2new, vertices;
	  vertices = new RepeatedPointsDS([], epsilon);
	  old2new = (function() {
	    var k, len, ref, results;
	    ref = fold.vertices_coords;
	    results = [];
	    for (k = 0, len = ref.length; k < len; k++) {
	      coords = ref[k];
	      results.push(vertices.insert(coords));
	    }
	    return results;
	  })();
	  return filter$1.remapField(fold, 'vertices', old2new);
	};
	filter$1.maybeAddVertex = function(fold, coords, epsilon) {
	  var i;
	  i = geom.closestIndex(coords, fold.vertices_coords);
	  if ((i != null) && epsilon >= geom.dist(coords, fold.vertices_coords[i])) {
	    return i;
	  } else {
	    return fold.vertices_coords.push(coords) - 1;
	  }
	};
	filter$1.addVertexLike = function(fold, oldVertexIndex) {
	  var k, key, len, ref, vNew;
	  vNew = filter$1.numVertices(fold);
	  ref = filter$1.keysStartingWith(fold, 'vertices_');
	  for (k = 0, len = ref.length; k < len; k++) {
	    key = ref[k];
	    switch (key.slice(6)) {
	      case 'vertices':
	        break;
	      default:
	        fold[key][vNew] = fold[key][oldVertexIndex];
	    }
	  }
	  return vNew;
	};
	filter$1.addEdgeLike = function(fold, oldEdgeIndex, v1, v2) {
	  var eNew, k, key, len, ref;
	  eNew = fold.edges_vertices.length;
	  ref = filter$1.keysStartingWith(fold, 'edges_');
	  for (k = 0, len = ref.length; k < len; k++) {
	    key = ref[k];
	    switch (key.slice(6)) {
	      case 'vertices':
	        fold.edges_vertices.push([v1 != null ? v1 : fold.edges_vertices[oldEdgeIndex][0], v2 != null ? v2 : fold.edges_vertices[oldEdgeIndex][1]]);
	        break;
	      case 'edges':
	        break;
	      default:
	        fold[key][eNew] = fold[key][oldEdgeIndex];
	    }
	  }
	  return eNew;
	};
	filter$1.addVertexAndSubdivide = function(fold, coords, epsilon) {
	  var changedEdges, e, i, iNew, k, len, ref, s, u, v;
	  v = filter$1.maybeAddVertex(fold, coords, epsilon);
	  changedEdges = [];
	  if (v === fold.vertices_coords.length - 1) {
	    ref = fold.edges_vertices;
	    for (i = k = 0, len = ref.length; k < len; i = ++k) {
	      e = ref[i];
	      if (indexOf.call(e, v) >= 0) {
	        continue;
	      }
	      s = (function() {
	        var l, len1, results;
	        results = [];
	        for (l = 0, len1 = e.length; l < len1; l++) {
	          u = e[l];
	          results.push(fold.vertices_coords[u]);
	        }
	        return results;
	      })();
	      if (geom.pointStrictlyInSegment(coords, s)) {
	        iNew = filter$1.addEdgeLike(fold, i, v, e[1]);
	        changedEdges.push(i, iNew);
	        e[1] = v;
	      }
	    }
	  }
	  return [v, changedEdges];
	};
	filter$1.removeLoopEdges = function(fold) {
	  var edge;
	  return filter$1.remapFieldSubset(fold, 'edges', (function() {
	    var k, len, ref, results;
	    ref = fold.edges_vertices;
	    results = [];
	    for (k = 0, len = ref.length; k < len; k++) {
	      edge = ref[k];
	      results.push(edge[0] !== edge[1]);
	    }
	    return results;
	  })());
	};
	filter$1.subdivideCrossingEdges_vertices = function(fold, epsilon, involvingEdgesFrom) {
	  var addEdge, changedEdges, cross, crossI, e, e1, e2, i, i1, i2, k, l, len, len1, len2, len3, m, n, old2new, p, ref, ref1, ref2, ref3, s, s1, s2, u, v, vertices;
	  changedEdges = [[], []];
	  addEdge = function(v1, v2, oldEdgeIndex, which) {
	    var eNew;
	    eNew = filter$1.addEdgeLike(fold, oldEdgeIndex, v1, v2);
	    return changedEdges[which].push(oldEdgeIndex, eNew);
	  };
	  i = involvingEdgesFrom != null ? involvingEdgesFrom : 0;
	  while (i < fold.edges_vertices.length) {
	    e = fold.edges_vertices[i];
	    s = (function() {
	      var k, len, results;
	      results = [];
	      for (k = 0, len = e.length; k < len; k++) {
	        u = e[k];
	        results.push(fold.vertices_coords[u]);
	      }
	      return results;
	    })();
	    ref = fold.vertices_coords;
	    for (v = k = 0, len = ref.length; k < len; v = ++k) {
	      p = ref[v];
	      if (indexOf.call(e, v) >= 0) {
	        continue;
	      }
	      if (geom.pointStrictlyInSegment(p, s)) {
	        addEdge(v, e[1], i, 0);
	        e[1] = v;
	      }
	    }
	    i++;
	  }
	  vertices = new RepeatedPointsDS(fold.vertices_coords, epsilon);
	  i1 = involvingEdgesFrom != null ? involvingEdgesFrom : 0;
	  while (i1 < fold.edges_vertices.length) {
	    e1 = fold.edges_vertices[i1];
	    s1 = (function() {
	      var l, len1, results;
	      results = [];
	      for (l = 0, len1 = e1.length; l < len1; l++) {
	        v = e1[l];
	        results.push(fold.vertices_coords[v]);
	      }
	      return results;
	    })();
	    ref1 = fold.edges_vertices.slice(0, i1);
	    for (i2 = l = 0, len1 = ref1.length; l < len1; i2 = ++l) {
	      e2 = ref1[i2];
	      s2 = (function() {
	        var len2, m, results;
	        results = [];
	        for (m = 0, len2 = e2.length; m < len2; m++) {
	          v = e2[m];
	          results.push(fold.vertices_coords[v]);
	        }
	        return results;
	      })();
	      if (!filter$1.edges_verticesIncident(e1, e2) && geom.segmentsCross(s1, s2)) {
	        cross = geom.lineIntersectLine(s1, s2);
	        if (cross == null) {
	          continue;
	        }
	        crossI = vertices.insert(cross);
	        if (!(indexOf.call(e1, crossI) >= 0 && indexOf.call(e2, crossI) >= 0)) {
	          if (indexOf.call(e1, crossI) < 0) {
	            addEdge(crossI, e1[1], i1, 0);
	            e1[1] = crossI;
	            s1[1] = fold.vertices_coords[crossI];
	          }
	          if (indexOf.call(e2, crossI) < 0) {
	            addEdge(crossI, e2[1], i2, 1);
	            e2[1] = crossI;
	          }
	        }
	      }
	    }
	    i1++;
	  }
	  old2new = filter$1.removeDuplicateEdges_vertices(fold);
	  ref2 = [0, 1];
	  for (m = 0, len2 = ref2.length; m < len2; m++) {
	    i = ref2[m];
	    changedEdges[i] = (function() {
	      var len3, n, ref3, results;
	      ref3 = changedEdges[i];
	      results = [];
	      for (n = 0, len3 = ref3.length; n < len3; n++) {
	        e = ref3[n];
	        results.push(old2new[e]);
	      }
	      return results;
	    })();
	  }
	  old2new = filter$1.removeLoopEdges(fold);
	  ref3 = [0, 1];
	  for (n = 0, len3 = ref3.length; n < len3; n++) {
	    i = ref3[n];
	    changedEdges[i] = (function() {
	      var len4, o, ref4, results;
	      ref4 = changedEdges[i];
	      results = [];
	      for (o = 0, len4 = ref4.length; o < len4; o++) {
	        e = ref4[o];
	        results.push(old2new[e]);
	      }
	      return results;
	    })();
	  }
	  if (involvingEdgesFrom != null) {
	    return changedEdges;
	  } else {
	    return changedEdges[0].concat(changedEdges[1]);
	  }
	};
	filter$1.addEdgeAndSubdivide = function(fold, v1, v2, epsilon) {
	  var changedEdges, changedEdges1, changedEdges2, e, i, iNew, k, len, ref, ref1, ref2, ref3, ref4;
	  if (v1.length != null) {
	    ref = filter$1.addVertexAndSubdivide(fold, v1, epsilon), v1 = ref[0], changedEdges1 = ref[1];
	  }
	  if (v2.length != null) {
	    ref1 = filter$1.addVertexAndSubdivide(fold, v2, epsilon), v2 = ref1[0], changedEdges2 = ref1[1];
	  }
	  if (v1 === v2) {
	    return [[], []];
	  }
	  ref2 = fold.edges_vertices;
	  for (i = k = 0, len = ref2.length; k < len; i = ++k) {
	    e = ref2[i];
	    if ((e[0] === v1 && e[1] === v2) || (e[0] === v2 && e[1] === v1)) {
	      return [[i], []];
	    }
	  }
	  iNew = fold.edges_vertices.push([v1, v2]) - 1;
	  if (iNew) {
	    changedEdges = filter$1.subdivideCrossingEdges_vertices(fold, epsilon, iNew);
	    if (indexOf.call(changedEdges[0], iNew) < 0) {
	      changedEdges[0].push(iNew);
	    }
	  } else {
	    changedEdges = [[iNew], []];
	  }
	  if (changedEdges1 != null) {
	    (ref3 = changedEdges[1]).push.apply(ref3, changedEdges1);
	  }
	  if (changedEdges2 != null) {
	    (ref4 = changedEdges[1]).push.apply(ref4, changedEdges2);
	  }
	  return changedEdges;
	};
	filter$1.cutEdges = function(fold, es) {
	  var b1, b2, boundaries, e, e1, e2, ev, i, i1, i2, ie, ie1, ie2, k, l, len, len1, len2, len3, len4, len5, len6, len7, m, n, neighbor, neighbors, o, q, r, ref, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, t, u1, u2, v, v1, v2, ve, vertices_boundaries;
	  vertices_boundaries = [];
	  ref = filter$1.boundaryEdges(fold);
	  for (k = 0, len = ref.length; k < len; k++) {
	    e = ref[k];
	    ref1 = fold.edges_vertices[e];
	    for (l = 0, len1 = ref1.length; l < len1; l++) {
	      v = ref1[l];
	      (vertices_boundaries[v] != null ? vertices_boundaries[v] : vertices_boundaries[v] = []).push(e);
	    }
	  }
	  for (m = 0, len2 = es.length; m < len2; m++) {
	    e1 = es[m];
	    e2 = filter$1.addEdgeLike(fold, e1);
	    ref2 = fold.edges_vertices[e1];
	    for (i = n = 0, len3 = ref2.length; n < len3; i = ++n) {
	      v = ref2[i];
	      ve = fold.vertices_edges[v];
	      ve.splice(ve.indexOf(e1) + i, 0, e2);
	    }
	    ref3 = fold.edges_vertices[e1];
	    for (i = o = 0, len4 = ref3.length; o < len4; i = ++o) {
	      v1 = ref3[i];
	      u1 = fold.edges_vertices[e1][1 - i];
	      u2 = fold.edges_vertices[e2][1 - i];
	      boundaries = (ref4 = vertices_boundaries[v1]) != null ? ref4.length : void 0;
	      if (boundaries >= 2) {
	        if (boundaries > 2) {
	          throw new Error(vertices_boundaries[v1].length + " boundary edges at vertex " + v1);
	        }
	        ref5 = vertices_boundaries[v1], b1 = ref5[0], b2 = ref5[1];
	        neighbors = fold.vertices_edges[v1];
	        i1 = neighbors.indexOf(b1);
	        i2 = neighbors.indexOf(b2);
	        if (i2 === (i1 + 1) % neighbors.length) {
	          if (i2 !== 0) {
	            neighbors = neighbors.slice(i2).concat(neighbors.slice(0, +i1 + 1 || 9e9));
	          }
	        } else if (i1 === (i2 + 1) % neighbors.length) {
	          if (i1 !== 0) {
	            neighbors = neighbors.slice(i1).concat(neighbors.slice(0, +i2 + 1 || 9e9));
	          }
	        } else {
	          throw new Error("Nonadjacent boundary edges at vertex " + v1);
	        }
	        ie1 = neighbors.indexOf(e1);
	        ie2 = neighbors.indexOf(e2);
	        ie = Math.min(ie1, ie2);
	        fold.vertices_edges[v1] = neighbors.slice(0, +ie + 1 || 9e9);
	        v2 = filter$1.addVertexLike(fold, v1);
	        fold.vertices_edges[v2] = neighbors.slice(1 + ie);
	        ref6 = fold.vertices_edges[v2];
	        for (q = 0, len5 = ref6.length; q < len5; q++) {
	          neighbor = ref6[q];
	          ev = fold.edges_vertices[neighbor];
	          ev[ev.indexOf(v1)] = v2;
	        }
	      }
	    }
	    if ((ref7 = fold.edges_assignment) != null) {
	      ref7[e1] = 'B';
	    }
	    if ((ref8 = fold.edges_assignment) != null) {
	      ref8[e2] = 'B';
	    }
	    ref9 = fold.edges_vertices[e1];
	    for (i = r = 0, len6 = ref9.length; r < len6; i = ++r) {
	      v = ref9[i];
	      (vertices_boundaries[v] != null ? vertices_boundaries[v] : vertices_boundaries[v] = []).push(e1);
	    }
	    ref10 = fold.edges_vertices[e2];
	    for (i = t = 0, len7 = ref10.length; t < len7; i = ++t) {
	      v = ref10[i];
	      (vertices_boundaries[v] != null ? vertices_boundaries[v] : vertices_boundaries[v] = []).push(e2);
	    }
	  }
	  delete fold.vertices_vertices;
	  return fold;
	};
	filter$1.edges_vertices_to_vertices_vertices = function(fold) {
	  var edge, k, len, numVertices, ref, v, vertices_vertices, w;
	  numVertices = filter$1.numVertices(fold);
	  vertices_vertices = (function() {
	    var k, ref, results;
	    results = [];
	    for (v = k = 0, ref = numVertices; 0 <= ref ? k < ref : k > ref; v = 0 <= ref ? ++k : --k) {
	      results.push([]);
	    }
	    return results;
	  })();
	  ref = fold.edges_vertices;
	  for (k = 0, len = ref.length; k < len; k++) {
	    edge = ref[k];
	    v = edge[0], w = edge[1];
	    while (v >= vertices_vertices.length) {
	      vertices_vertices.push([]);
	    }
	    while (w >= vertices_vertices.length) {
	      vertices_vertices.push([]);
	    }
	    vertices_vertices[v].push(w);
	    vertices_vertices[w].push(v);
	  }
	  return vertices_vertices;
	};

	var convert$1 = {},
	  modulo$1 = function(a, b) { return (+a % (b = +b) + b) % b; },
	  hasProp = {}.hasOwnProperty;
	convert$1.edges_vertices_to_vertices_vertices_unsorted = function(fold) {
	  fold.vertices_vertices = filter$1.edges_vertices_to_vertices_vertices(fold);
	  return fold;
	};
	convert$1.edges_vertices_to_vertices_vertices_sorted = function(fold) {
	  convert$1.edges_vertices_to_vertices_vertices_unsorted(fold);
	  return convert$1.sort_vertices_vertices(fold);
	};
	convert$1.edges_vertices_to_vertices_edges_sorted = function(fold) {
	  convert$1.edges_vertices_to_vertices_vertices_sorted(fold);
	  return convert$1.vertices_vertices_to_vertices_edges(fold);
	};
	convert$1.sort_vertices_vertices = function(fold) {
	  var neighbors, ref, ref1, ref2, v;
	  if (((ref = fold.vertices_coords) != null ? (ref1 = ref[0]) != null ? ref1.length : void 0 : void 0) !== 2) {
	    throw new Error("sort_vertices_vertices: Vertex coordinates missing or not two dimensional");
	  }
	  if (fold.vertices_vertices == null) {
	    convert$1.edges_vertices_to_vertices_vertices(fold);
	  }
	  ref2 = fold.vertices_vertices;
	  for (v in ref2) {
	    neighbors = ref2[v];
	    geom.sortByAngle(neighbors, v, function(x) {
	      return fold.vertices_coords[x];
	    });
	  }
	  return fold;
	};
	convert$1.vertices_vertices_to_faces_vertices = function(fold) {
	  var face, i, j, k, key, l, len, len1, len2, neighbors, next, ref, ref1, ref2, ref3, u, uv, v, w, x;
	  next = {};
	  ref = fold.vertices_vertices;
	  for (v = j = 0, len = ref.length; j < len; v = ++j) {
	    neighbors = ref[v];
	    for (i = k = 0, len1 = neighbors.length; k < len1; i = ++k) {
	      u = neighbors[i];
	      next[u + "," + v] = neighbors[modulo$1(i - 1, neighbors.length)];
	    }
	  }
	  fold.faces_vertices = [];
	  ref1 = (function() {
	    var results;
	    results = [];
	    for (key in next) {
	      results.push(key);
	    }
	    return results;
	  })();
	  for (l = 0, len2 = ref1.length; l < len2; l++) {
	    uv = ref1[l];
	    w = next[uv];
	    if (w == null) {
	      continue;
	    }
	    next[uv] = null;
	    ref2 = uv.split(','), u = ref2[0], v = ref2[1];
	    u = parseInt(u);
	    v = parseInt(v);
	    face = [u, v];
	    while (w !== face[0]) {
	      if (w == null) {
	        console.warn("Confusion with face " + face);
	        break;
	      }
	      face.push(w);
	      ref3 = [v, w], u = ref3[0], v = ref3[1];
	      w = next[u + "," + v];
	      next[u + "," + v] = null;
	    }
	    next[face[face.length - 1] + "," + face[0]] = null;
	    if ((w != null) && geom.polygonOrientation((function() {
	      var len3, m, results;
	      results = [];
	      for (m = 0, len3 = face.length; m < len3; m++) {
	        x = face[m];
	        results.push(fold.vertices_coords[x]);
	      }
	      return results;
	    })()) > 0) {
	      fold.faces_vertices.push(face);
	    }
	  }
	  return fold;
	};
	convert$1.vertices_edges_to_faces_vertices_edges = function(fold) {
	  var e, e1, e2, edges, i, j, k, l, len, len1, len2, len3, m, neighbors, next, nexts, ref, ref1, v, vertex, vertices, x;
	  next = [];
	  ref = fold.vertices_edges;
	  for (v = j = 0, len = ref.length; j < len; v = ++j) {
	    neighbors = ref[v];
	    next[v] = {};
	    for (i = k = 0, len1 = neighbors.length; k < len1; i = ++k) {
	      e = neighbors[i];
	      next[v][e] = neighbors[modulo$1(i - 1, neighbors.length)];
	    }
	  }
	  fold.faces_vertices = [];
	  fold.faces_edges = [];
	  for (vertex = l = 0, len2 = next.length; l < len2; vertex = ++l) {
	    nexts = next[vertex];
	    for (e1 in nexts) {
	      e2 = nexts[e1];
	      if (e2 == null) {
	        continue;
	      }
	      e1 = parseInt(e1);
	      nexts[e1] = null;
	      edges = [e1];
	      vertices = [filter$1.edges_verticesIncident(fold.edges_vertices[e1], fold.edges_vertices[e2])];
	      if (vertices[0] == null) {
	        throw new Error("Confusion at edges " + e1 + " and " + e2);
	      }
	      while (e2 !== edges[0]) {
	        if (e2 == null) {
	          console.warn("Confusion with face containing edges " + edges);
	          break;
	        }
	        edges.push(e2);
	        ref1 = fold.edges_vertices[e2];
	        for (m = 0, len3 = ref1.length; m < len3; m++) {
	          v = ref1[m];
	          if (v !== vertices[vertices.length - 1]) {
	            vertices.push(v);
	            break;
	          }
	        }
	        e1 = e2;
	        e2 = next[v][e1];
	        next[v][e1] = null;
	      }
	      if ((e2 != null) && geom.polygonOrientation((function() {
	        var len4, n, results;
	        results = [];
	        for (n = 0, len4 = vertices.length; n < len4; n++) {
	          x = vertices[n];
	          results.push(fold.vertices_coords[x]);
	        }
	        return results;
	      })()) > 0) {
	        fold.faces_vertices.push(vertices);
	        fold.faces_edges.push(edges);
	      }
	    }
	  }
	  return fold;
	};
	convert$1.edges_vertices_to_faces_vertices = function(fold) {
	  convert$1.edges_vertices_to_vertices_vertices_sorted(fold);
	  return convert$1.vertices_vertices_to_faces_vertices(fold);
	};
	convert$1.edges_vertices_to_faces_vertices_edges = function(fold) {
	  convert$1.edges_vertices_to_vertices_edges_sorted(fold);
	  return convert$1.vertices_edges_to_faces_vertices(fold);
	};
	convert$1.vertices_vertices_to_vertices_edges = function(fold) {
	  var edge, edgeMap, i, j, len, ref, ref1, v1, v2, vertex, vertices;
	  edgeMap = {};
	  ref = fold.edges_vertices;
	  for (edge = j = 0, len = ref.length; j < len; edge = ++j) {
	    ref1 = ref[edge], v1 = ref1[0], v2 = ref1[1];
	    edgeMap[v1 + "," + v2] = edge;
	    edgeMap[v2 + "," + v1] = edge;
	  }
	  return fold.vertices_edges = (function() {
	    var k, len1, ref2, results;
	    ref2 = fold.vertices_vertices;
	    results = [];
	    for (vertex = k = 0, len1 = ref2.length; k < len1; vertex = ++k) {
	      vertices = ref2[vertex];
	      results.push((function() {
	        var l, ref3, results1;
	        results1 = [];
	        for (i = l = 0, ref3 = vertices.length; 0 <= ref3 ? l < ref3 : l > ref3; i = 0 <= ref3 ? ++l : --l) {
	          results1.push(edgeMap[vertex + "," + vertices[i]]);
	        }
	        return results1;
	      })());
	    }
	    return results;
	  })();
	};
	convert$1.faces_vertices_to_faces_edges = function(fold) {
	  var edge, edgeMap, face, i, j, len, ref, ref1, v1, v2, vertices;
	  edgeMap = {};
	  ref = fold.edges_vertices;
	  for (edge = j = 0, len = ref.length; j < len; edge = ++j) {
	    ref1 = ref[edge], v1 = ref1[0], v2 = ref1[1];
	    edgeMap[v1 + "," + v2] = edge;
	    edgeMap[v2 + "," + v1] = edge;
	  }
	  return fold.faces_edges = (function() {
	    var k, len1, ref2, results;
	    ref2 = fold.faces_vertices;
	    results = [];
	    for (face = k = 0, len1 = ref2.length; k < len1; face = ++k) {
	      vertices = ref2[face];
	      results.push((function() {
	        var l, ref3, results1;
	        results1 = [];
	        for (i = l = 0, ref3 = vertices.length; 0 <= ref3 ? l < ref3 : l > ref3; i = 0 <= ref3 ? ++l : --l) {
	          results1.push(edgeMap[vertices[i] + "," + vertices[(i + 1) % vertices.length]]);
	        }
	        return results1;
	      })());
	    }
	    return results;
	  })();
	};
	convert$1.faces_vertices_to_edges = function(mesh) {
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
	convert$1.deepCopy = function(fold) {
	  var copy, item, j, key, len, ref, results, value;
	  if ((ref = typeof fold) === 'number' || ref === 'string' || ref === 'boolean') {
	    return fold;
	  } else if (Array.isArray(fold)) {
	    results = [];
	    for (j = 0, len = fold.length; j < len; j++) {
	      item = fold[j];
	      results.push(convert$1.deepCopy(item));
	    }
	    return results;
	  } else {
	    copy = {};
	    for (key in fold) {
	      if (!hasProp.call(fold, key)) continue;
	      value = fold[key];
	      copy[key] = convert$1.deepCopy(value);
	    }
	    return copy;
	  }
	};
	convert$1.toJSON = function(fold) {
	  var key, obj, value;
	  return "{\n" + ((function() {
	    var results;
	    results = [];
	    var keys = Object.keys(fold);
	    for(var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
	      key = keys[keyIndex];
	      value = fold[key];
	      results.push(("  " + (JSON.stringify(key)) + ": ") + (Array.isArray(value) ? "[\n" + ((function() {
	        var j, len, results1;
	        results1 = [];
	        for (j = 0, len = value.length; j < len; j++) {
	          obj = value[j];
	          results1.push("    " + (JSON.stringify(obj)));
	        }
	        return results1;
	      })()).join(',\n') + "\n  ]" : JSON.stringify(value)));
	    }
	    return results;
	  })()).join(',\n') + "\n}\n";
	};
	convert$1.extensions = {};
	convert$1.converters = {};
	convert$1.getConverter = function(fromExt, toExt) {
	  if (fromExt === toExt) {
	    return function(x) {
	      return x;
	    };
	  } else {
	    return convert$1.converters["" + fromExt + toExt];
	  }
	};
	convert$1.setConverter = function(fromExt, toExt, converter) {
	  convert$1.extensions[fromExt] = true;
	  convert$1.extensions[toExt] = true;
	  return convert$1.converters["" + fromExt + toExt] = converter;
	};
	convert$1.convertFromTo = function(data, fromExt, toExt) {
	  var converter;
	  if (fromExt[0] !== '.') {
	    fromExt = "." + fromExt;
	  }
	  if (toExt[0] !== '.') {
	    toExt = "." + toExt;
	  }
	  converter = convert$1.getConverter(fromExt, toExt);
	  if (converter == null) {
	    if (fromExt === toExt) {
	      return data;
	    }
	    throw new Error("No converter from " + fromExt + " to " + toExt);
	  }
	  return converter(data);
	};
	convert$1.convertFrom = function(data, fromExt) {
	  return convert$1.convertFromTo(data, fromExt, '.fold');
	};
	convert$1.convertTo = function(data, toExt) {
	  return convert$1.convertFromTo(data, '.fold', toExt);
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
	const fragment2 = function(graph, epsilon = core.EPSILON) {
		filter$1.subdivideCrossingEdges_vertices(graph);
		convert$1.edges_vertices_to_vertices_vertices_sorted(graph);
		convert$1.vertices_vertices_to_faces_vertices(graph);
		convert$1.faces_vertices_to_faces_edges(graph);
		console.log(graph);
		return graph;
	};
	const fragment = function(graph, epsilon = core.EPSILON) {
		const horizSort = function(a,b){ return a[0] - b[0]; };
		const vertSort = function(a,b){ return a[1] - b[1]; };
		const equivalent = function(a, b) {
			for (var i = 0; i < a.length; i++) {
				if (Math.abs(a[i] - b[i]) > epsilon) {
					return false;
				}
			}
			return true;
		};
		let edge_count = graph.edges_vertices.length;
		let edges = graph.edges_vertices.map(ev => [
			graph.vertices_coords[ev[0]],
			graph.vertices_coords[ev[1]]
		]);
		let edges_vector = edges.map(e => [e[1][0] - e[0][0], e[1][1] - e[0][1]]);
		let edges_magnitude = edges_vector.map(e => Math.sqrt(e[0]*e[0]+e[1]*e[1]));
		let edges_normalized = edges_vector
			.map((e,i) => [e[0]/edges_magnitude[i], e[1]/edges_magnitude[i]]);
		let edges_horizontal = edges_normalized.map(e => Math.abs(e[0]) > 0.7);
		let crossings = Array.from(Array(edge_count - 1)).map(_ => []);
		for (let i = 0; i < edges.length-1; i++) {
			for (let j = i+1; j < edges.length; j++) {
				crossings[i][j] = core.intersection.edge_edge_exclusive(
					edges[i][0], edges[i][1],
					edges[j][0], edges[j][1]
				);
			}
		}
		let edges_intersections = Array.from(Array(edge_count)).map(_ => []);
		for (let i = 0; i < edges.length-1; i++) {
			for (let j = i+1; j < edges.length; j++) {
				if (crossings[i][j] != null) {
					edges_intersections[i].push(crossings[i][j]);
					edges_intersections[j].push(crossings[i][j]);
				}
			}
		}
		edges.forEach((e,i) => e.sort(edges_horizontal[i] ? horizSort : vertSort));
		edges_intersections.forEach((e,i) =>
			e.sort(edges_horizontal[i] ? horizSort : vertSort)
		);
		let new_edges = edges_intersections
			.map((e,i) => [edges[i][0], ...e, edges[i][1]])
			.map(ev =>
				Array.from(Array(ev.length-1))
					.map((_,i) => [ev[i], ev[(i+1)]])
			);
		new_edges = new_edges
			.map(edgeGroup => edgeGroup
				.filter(e => false === e
					.map((_,i) => Math.abs(e[0][i] - e[1][i]) < epsilon)
					.reduce((a,b) => a && b, true)
				)
			);
		let edge_map = new_edges
			.map((edge,i) => edge.map(_ => i))
			.reduce((a,b) => a.concat(b), []);
		let vertices_coords = new_edges
			.map(edge => edge.reduce((a,b) => a.concat(b), []))
			.reduce((a,b) => a.concat(b), []);
		let counter = 0;
		let edges_vertices = new_edges
			.map(edge => edge.map(_ => [counter++, counter++]))
			.reduce((a,b) => a.concat(b), []);
		let vertices_equivalent = Array
			.from(Array(vertices_coords.length)).map(_ => []);
		for (var i = 0; i < vertices_coords.length-1; i++) {
			for (var j = i+1; j < vertices_coords.length; j++) {
				vertices_equivalent[i][j] = equivalent(
					vertices_coords[i],
					vertices_coords[j]
				);
			}
		}
		let vertices_map = vertices_coords.map(vc => undefined);
		vertices_equivalent.forEach((row,i) => row.forEach((eq,j) => {
			if (eq){
				vertices_map[j] = vertices_map[i] === undefined ? i : vertices_map[i];
			}
		}));
		let vertices_remove = vertices_map.map(m => m !== undefined);
		vertices_map.forEach((map,i) => {
			if(map === undefined) { vertices_map[i] = i; }
		});
		edges_vertices.forEach((edge,i) => edge.forEach((v,j) => {
			edges_vertices[i][j] = vertices_map[v];
		}));
		let flat = {
			vertices_coords,
			edges_vertices
		};
		let vertices_remove_indices = vertices_remove
			.map((rm,i) => rm ? i : undefined)
			.filter(i => i !== undefined);
		remove_vertices(flat, vertices_remove_indices);
		convert$1.edges_vertices_to_vertices_vertices_sorted(flat);
		convert$1.vertices_vertices_to_faces_vertices(flat);
		convert$1.faces_vertices_to_faces_edges(flat);
		return flat;
	};
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
	const nearest_edge = function(graph, point) {
		if (graph.vertices_coords == null || graph.vertices_coords.length === 0 ||
			graph.edges_vertices == null || graph.edges_vertices.length === 0) {
			return undefined;
		}
		return graph.edges_vertices
			.map(e => e.map(ev => graph.vertices_coords[ev]))
			.map(e => Edge(e))
			.map((e,i) => ({e:e, i:i, d:e.nearestPoint(point).distanceTo(point)}))
			.sort((a,b) => a.d - b.d)
			.shift()
			.i;
	};
	const topmost_face$1 = function(graph, faces_options) {
		if (faces_options == null) {
			faces_options = Array.from(Array(graph.faces_vertices.length))
				.map((_,i) => i);
		}
		if (faces_options.length === 0) { return undefined; }
		if (faces_options.length === 1) { return faces_options[0]; }
		let faces_in_order = graph["faces_re:layer"]
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
			.filter(f => core.intersection.point_in_poly(point, f.face))
			.shift();
		return (face == null ? undefined : face.i);
	};
	const folded_faces_containing_point = function(graph, point, faces_matrix) {
		let transformed_points = faces_matrix
			.map(m => core.multiply_vector2_matrix2(point, m));
		return graph.faces_vertices
			.map((fv,i) => ({face: fv.map(v => graph.vertices_coords[v]), i: i}))
			.filter((f,i) => core.intersection.point_in_poly(transformed_points[i], f.face))
			.map(f => f.i);
	};
	const faces_containing_point = function(graph, point) {
		if (graph.vertices_coords == null || graph.vertices_coords.length === 0 ||
			graph.faces_vertices == null || graph.faces_vertices.length === 0) {
			return undefined;
		}
		return graph.faces_vertices
			.map((fv,i) => ({face: fv.map(v => graph.vertices_coords[v]), i: i}))
			.filter(f => core.intersection.point_in_poly(point, f.face))
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
	const split_convex_polygon$1 = function(graph, faceIndex, linePoint, lineVector, crease_assignment = "F") {
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
			let face_v = graph.faces_vertices[faceIndex];
			let v_i = vertices_intersections;
			let match_a = face_v[(v_i[0].i_face+1)%face_v.length] === v_i[1].i_vertices;
			let match_b = face_v[(v_i[1].i_face+1)%face_v.length] === v_i[0].i_vertices;
			if (match_a || match_b) { return {}; }
		} else {
			return {};
		}
		let new_face_v_indices = new_v_indices
			.map(el => graph.faces_vertices[faceIndex].indexOf(el))
			.sort((a,b) => a-b);
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
		let new_edges = [{
			index: graph.edges_vertices.length,
			vertices: [...new_v_indices],
			assignment: crease_assignment,
			foldAngle: angle_from_assignment(crease_assignment),
			length: core.distance2(
				...(new_v_indices.map(v => graph.vertices_coords[v]))
			),
			faces: [graph.faces_vertices.length, graph.faces_vertices.length+1]
		}];
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
		new_edges.forEach((edge, i) => {
			let a = edge.vertices[0];
			let b = edge.vertices[1];
			graph.vertices_vertices[a].push(b);
			graph.vertices_vertices[b].push(a);
		});
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
		let faces_map = remove_faces(graph, [faceIndex]);
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
	const find_collinear_face_edges = function(edge, face_vertices,
		vertices_coords) {
		let face_edge_geometry = face_vertices
			.map((v) => vertices_coords[v])
			.map((v, i, arr) => [v, arr[(i+1)%arr.length]]);
		return edge.map((endPt) => {
			let i = face_edge_geometry
				.map((edgeVerts, edgeI) => ({index:edgeI, edge:edgeVerts}))
				.filter((e) => core.intersection
					.point_on_edge(e.edge[0], e.edge[1], endPt)
				).shift()
				.index;
			return [face_vertices[i], face_vertices[(i+1)%face_vertices.length]]
				.sort((a,b) => a-b);
		})
	};
	function clip_line(fold, linePoint, lineVector) {
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
		if ("vertices_coords" in graph === false ||
			graph.vertices_coords.length <= 0) {
			return [0,0,0,0];
		}
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
		fragment2: fragment2,
		fragment: fragment,
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

	function build_folded_frame(graph, face_stationary) {
		if (face_stationary == null) {
			face_stationary = 0;
			console.warn("build_folded_frame was not supplied a stationary face");
		}
		let faces_matrix = make_faces_matrix(graph, face_stationary);
		let vertices_coords = fold_vertices_coords(graph, face_stationary, faces_matrix);
		return {
			vertices_coords,
			frame_classes: ["foldedForm"],
			frame_inherit: true,
			frame_parent: 0,
			"faces_re:matrix": faces_matrix
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
	const make_face_center = function(graph, face_index) {
		return graph.faces_vertices[face_index]
			.map(v => graph.vertices_coords[v])
			.reduce((a,b) => [a[0]+b[0], a[1]+b[1]], [0,0])
			.map(el => el/graph.faces_vertices[face_index].length);
	};
	const pointSidedness = function(point, vector, face_center, face_color) {
		let vec2 = [face_center[0] - point[0], face_center[1] - point[1]];
		let det = vector[0] * vec2[1] - vector[1] * vec2[0];
		return face_color ? det > 0 : det < 0;
	};
	const prepare_to_fold = function(graph, point, vector, face_index) {
		let faces_count$$1 = graph.faces_vertices.length;
		graph["faces_re:preindex"] = Array.from(Array(faces_count$$1)).map((_,i)=>i);
		if (graph.file_frames != null
			&& graph.file_frames.length > 0
			&& graph.file_frames[0]["faces_re:matrix"] != null
			&& graph.file_frames[0]["faces_re:matrix"].length === faces_count$$1) {
			graph["faces_re:matrix"] = JSON.parse(JSON.stringify(graph.file_frames[0]["faces_re:matrix"]));
		} else {
			graph["faces_re:matrix"] = make_faces_matrix(graph, face_index);
		}
		graph["faces_re:coloring"] = faces_matrix_coloring(graph["faces_re:matrix"]);
		graph["faces_re:creases"] = graph["faces_re:matrix"]
			.map(mat => core.make_matrix2_inverse(mat))
			.map(mat => core.multiply_line_matrix2(point, vector, mat));
		graph["faces_re:center"] = Array.from(Array(faces_count$$1))
			.map((_, i) => make_face_center(graph, i));
		graph["faces_re:sidedness"] = Array.from(Array(faces_count$$1))
			.map((_, i) => pointSidedness(
				graph["faces_re:creases"][i][0],
				graph["faces_re:creases"][i][1],
				graph["faces_re:center"][i],
				graph["faces_re:coloring"][i]
			));
	};
	const prepare_extensions = function(graph) {
		let faces_count$$1 = graph.faces_vertices.length;
		if (graph["faces_re:layer"] == null) {
			graph["faces_re:layer"] = Array.from(Array(faces_count$$1)).map(_ => 0);
		}
		if (graph["faces_re:to_move"] == null) {
			graph["faces_re:to_move"] = Array.from(Array(faces_count$$1)).map(_ => false);
		}
	};
	const crease_through_layers = function(graph, point, vector, face_index, crease_direction = "V") {
		let opposite_crease =
			(crease_direction === "M" || crease_direction === "m" ? "V" : "M");
		if (face_index == null) {
			let containing_point = face_containing_point(graph, point);
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
					folded["faces_re:creases"][i][0],
					folded["faces_re:creases"][i][1],
					folded["faces_re:coloring"][i] ? crease_direction : opposite_crease
				);
				if (diff == null || diff.faces == null) { return; }
				diff.faces.replace.forEach(replace =>
					replace.new.map(el => el.index)
						.map(index => index + diff.faces.map[index])
						.forEach(i => {
							folded["faces_re:center"][i] = make_face_center(folded, i);
							folded["faces_re:sidedness"][i] = pointSidedness(
								graph["faces_re:creases"][replace.old][0],
								graph["faces_re:creases"][replace.old][1],
								folded["faces_re:center"][i],
								graph["faces_re:coloring"][replace.old]
							);
							folded["faces_re:layer"][i] = graph["faces_re:layer"][replace.old];
							folded["faces_re:preindex"][i] = graph["faces_re:preindex"][replace.old];
						})
				);
			});
		folded["faces_re:layer"] = foldLayers(
			folded["faces_re:layer"],
			folded["faces_re:sidedness"]
		);
		let new_face_stationary, old_face_stationary;
		for (var i = 0; i < folded["faces_re:preindex"].length; i++) {
			if (!folded["faces_re:sidedness"][i]) {
				old_face_stationary = folded["faces_re:preindex"][i];
				new_face_stationary = i;
				break;
			}
		}
		let first_matrix;
		if (new_face_stationary === undefined) {
			first_matrix = core.make_matrix2_reflection(vector, point);
			first_matrix = core.multiply_matrices2(first_matrix, graph["faces_re:matrix"][0]);
			new_face_stationary = 0;
		} else {
			first_matrix = graph["faces_re:matrix"][old_face_stationary];
		}
		let instruction_crease = core.multiply_line_matrix2(
			graph["faces_re:creases"][old_face_stationary][0],
			graph["faces_re:creases"][old_face_stationary][1],
			graph["faces_re:matrix"][old_face_stationary]
		);
		folded["re:fabricated"] = {
			crease: {
				point: instruction_crease[0],
				vector: instruction_crease[1]
			}
		};
		let folded_faces_matrix = make_faces_matrix(folded, new_face_stationary)
			.map(m => core.multiply_matrices2(first_matrix, m));
		folded["faces_re:coloring"] = faces_matrix_coloring(folded_faces_matrix);
		let folded_vertices_coords = fold_vertices_coords(folded, new_face_stationary, folded_faces_matrix);
		let folded_frame = {
			vertices_coords: folded_vertices_coords,
			frame_classes: ["foldedForm"],
			frame_inherit: true,
			frame_parent: 0,
			"faces_re:matrix": folded_faces_matrix
		};
		folded.file_frames = [folded_frame];
		return folded;
	};
	function crease_line(graph, point, vector) {
		let new_edges = [];
		let arr = Array.from(Array(graph.faces_vertices.length))
			.map((_,i)=>i).reverse();
		arr.forEach(i => {
			let diff = split_convex_polygon$1(graph, i, point, vector);
			if (diff.edges != null && diff.edges.new != null) {
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
				let newEdgeIndex = diff.edges.new[0].index;
				new_edges = new_edges.map(edge =>
					edge += (diff.edges.map[edge] == null ? 0 : diff.edges.map[edge])
				);
				new_edges.push(newEdgeIndex);
			}
		});
		return new_edges;
	}
	function creaseRay(graph, point, vector) {
		let ray = Ray(point, vector);
		graph.faces_vertices.forEach(face => {
			let points = face.map(v => graph.vertices_coords[v]);
			core.intersection.clip_ray_in_convex_poly(points, point, vector);
		});
		return crease_line(graph, line[0], line[1]);
	}
	const creaseSegment = function(graph, a, b, c, d) {
		let edge = Edge([a, b]);
		let edges = graph.edges_vertices
			.map(ev => ev.map(v => graph.vertices_coords[v]));
		let edge_collinear_a = edges
			.map(e => core.intersection.point_on_edge(e[0], e[1], edge[0]))
			.map((on_edge, i) => on_edge ? i : undefined)
			.filter(a => a !== undefined)
			.shift();
		let edge_collinear_b = edges
			.map(e => core.intersection.point_on_edge(e[0], e[1], edge[1]))
			.map((on_edge, i) => on_edge ? i : undefined)
			.filter(a => a !== undefined)
			.shift();
		let vertex_equivalent_a = graph.vertices_coords
			.map(v => Math.sqrt(Math.pow(edge[0][0]-v[0], 2) +
			                    Math.pow(edge[0][1]-v[1], 2)))
			.map((d,i) => d < 1e-8 ? i : undefined)
			.filter(el => el !== undefined)
			.shift();
		let vertex_equivalent_b = graph.vertices_coords
			.map(v => Math.sqrt(Math.pow(edge[1][0]-v[0], 2) +
			                    Math.pow(edge[1][1]-v[1], 2)))
			.map((d,i) => d < 1e-8 ? i : undefined)
			.filter(el => el !== undefined)
			.shift();
		let edge_vertices = [];
		let edges_to_remove = [];
		let edges_index_map = [];
		if (vertex_equivalent_a !== undefined) {
			edge_vertices[0] = vertex_equivalent_a;
		} else {
			graph.vertices_coords.push([edge[0][0], edge[0][1]]);
			let vertex_new_index = graph.vertices_coords.length - 1;
			edge_vertices[0] = vertex_new_index;
			if (edge_collinear_a !== undefined) {
				edges_to_remove.push(edge_collinear_a);
				let edge_vertices_old = graph.edges_vertices[edge_collinear_a];
				graph.edges_vertices.push([edge_vertices_old[0], vertex_new_index]);
				graph.edges_vertices.push([vertex_new_index, edge_vertices_old[1]]);
				edges_index_map[graph.edges_vertices.length - 2] = edge_collinear_a;
				edges_index_map[graph.edges_vertices.length - 1] = edge_collinear_a;
			}
		}
		if (vertex_equivalent_b !== undefined) {
			edge_vertices[1] = vertex_equivalent_b;
		} else {
			graph.vertices_coords.push([edge[1][0], edge[1][1]]);
			let vertex_new_index = graph.vertices_coords.length - 1;
			edge_vertices[1] = vertex_new_index;
			if (edge_collinear_b !== undefined) {
				edges_to_remove.push(edge_collinear_b);
				let edge_vertices_old = graph.edges_vertices[edge_collinear_b];
				graph.edges_vertices.push([edge_vertices_old[0], vertex_new_index]);
				graph.edges_vertices.push([vertex_new_index, edge_vertices_old[1]]);
				edges_index_map[graph.edges_vertices.length - 2] = edge_collinear_b;
				edges_index_map[graph.edges_vertices.length - 1] = edge_collinear_b;
			}
		}
		graph.edges_vertices.push(edge_vertices);
		graph.edges_assignment[graph.edges_vertices.length-1] = "F";
		let diff = {
			edges_new: [graph.edges_vertices.length-1],
			edges_to_remove: edges_to_remove,
			edges_index_map
		};
		return diff;
	};
	function add_edge_between_points(graph, x0, y0, x1, y1) {
		let edge = [[x0, y0], [x1, y1]];
		let edge_vertices = edge
			.map(ep => graph.vertices_coords
				.map(v => Math.sqrt(Math.pow(ep[0]-v[0],2)+Math.pow(ep[1]-v[1],2)))
				.map((d,i) => d < 0.00000001 ? i : undefined)
				.filter(el => el !== undefined)
				.shift()
			).map((v,i) => {
				if (v !== undefined) { return v; }
				graph.vertices_coords.push(edge[i]);
				return graph.vertices_coords.length - 1;
			});
		graph.edges_vertices.push(edge_vertices);
		graph.edges_assignment.push("F");
		graph.edges_length.push(Math.sqrt(Math.pow(x0-x1,2)+Math.pow(y0-y1,2)));
		return [graph.edges_vertices.length-1];
	}
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
		return [Math.PI - even_sum, Math.PI - odd_sum];
	}
	function kawasaki_solutions(graph, vertex) {
		let vectors = vertex_adjacent_vectors(graph, vertex);
		let vectors_as_angles = vectors.map(v => Math.atan2(v[1], v[0]));
		return vectors.map((v,i,arr) => {
			let nextV = arr[(i+1)%arr.length];
			return core.counter_clockwise_angle2(v, nextV);
		}).map((_, i, arr) => {
			let a = arr.slice();
			a.splice(i,1);
			return a;
		}).map(a => kawasaki_from_even(a))
		.map((kawasakis, i, arr) =>
			(kawasakis == null
				? undefined
				: vectors_as_angles[i] + kawasakis[1])
		).map(k => (k === undefined)
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
		creaseRay: creaseRay,
		creaseSegment: creaseSegment,
		add_edge_between_points: add_edge_between_points,
		kawasaki_solutions: kawasaki_solutions,
		kawasaki_collapse: kawasaki_collapse,
		fold_without_layering: fold_without_layering,
		fold_vertices_coords: fold_vertices_coords
	});

	let oripa = {};
	oripa.type2fold = {
	  0: 'F',
	  1: 'B',
	  2: 'M',
	  3: 'V'
	};
	oripa.fold2type = {};
	let ref = oripa.type2fold;
	for (let x in ref) {
	  let y = ref[x];
	  oripa.fold2type[y] = x;
	}
	oripa.fold2type_default = 0;
	oripa.prop_xml2fold = {
	  'editorName': 'frame_author',
	  'originalAuthorName': 'frame_designer',
	  'reference': 'frame_reference',
	  'title': 'frame_title',
	  'memo': 'frame_description',
	  'paperSize': null,
	  'mainVersion': null,
	  'subVersion': null
	};
	oripa.POINT_EPS = 1.0;
	oripa.toFold = function(oripaStr) {
	  var children, fold, j, k, l, len, len1, len2, len3, len4, line, lines, m, n, nodeSpec, object, oneChildSpec, oneChildText, prop, property, ref1, ref2, ref3, ref4, ref5, subproperty, top, type, vertex, x0, x1, xml, y0, y1;
	  fold = {
	    vertices_coords: [],
	    edges_vertices: [],
	    edges_assignment: [],
	    file_creator: 'oripa2fold'
	  };
	  vertex = function(x, y) {
	    var v;
	    v = fold.vertices_coords.length;
	    fold.vertices_coords.push([parseFloat(x), parseFloat(y)]);
	    return v;
	  };
	  nodeSpec = function(node, type, key, value) {
	    if ((type != null) && node.tagName !== type) {
	      console.warn("ORIPA file has " + node.tagName + " where " + type + " was expected");
	      return null;
	    } else if ((key != null) && (!node.hasAttribute(key) || ((value != null) && node.getAttribute(key) !== value))) {
	      console.warn("ORIPA file has " + node.tagName + " with " + key + " = " + (node.getAttribute(key)) + " where " + value + " was expected");
	      return null;
	    } else {
	      return node;
	    }
	  };
	  children = function(node) {
	    var child, j, len, ref1, results;
	    if (node) {
	      ref1 = node.childNodes;
	      results = [];
	      for (j = 0, len = ref1.length; j < len; j++) {
	        child = ref1[j];
	        if (child.nodeType === 1) {
	          results.push(child);
	        }
	      }
	      return results;
	    } else {
	      return [];
	    }
	  };
	  oneChildSpec = function(node, type, key, value) {
	    var sub;
	    sub = children(node);
	    if (sub.length !== 1) {
	      console.warn("ORIPA file has " + node.tagName + " with " + node.childNodes.length + " children, not 1");
	      return null;
	    } else {
	      return nodeSpec(sub[0], type, key, value);
	    }
	  };
	  oneChildText = function(node) {
	    var child;
	    if (node.childNodes.length > 1) {
	      console.warn("ORIPA file has " + node.tagName + " with " + node.childNodes.length + " children, not 0 or 1");
	      return null;
	    } else if (node.childNodes.length === 0) {
	      return '';
	    } else {
	      child = node.childNodes[0];
	      if (child.nodeType !== 3) {
	        return console.warn("ORIPA file has nodeType " + child.nodeType + " where 3 (text) was expected");
	      } else {
	        return child.data;
	      }
	    }
	  };
	  xml = new DOMParser().parseFromString(oripaStr, 'text/xml');
	  ref1 = children(xml.documentElement);
	  for (j = 0, len = ref1.length; j < len; j++) {
	    top = ref1[j];
	    if (nodeSpec(top, 'object', 'class', 'oripa.DataSet')) {
	      ref2 = children(top);
	      for (k = 0, len1 = ref2.length; k < len1; k++) {
	        property = ref2[k];
	        if (property.getAttribute('property') === 'lines') {
	          lines = oneChildSpec(property, 'array', 'class', 'oripa.OriLineProxy');
	          ref3 = children(lines);
	          for (l = 0, len2 = ref3.length; l < len2; l++) {
	            line = ref3[l];
	            if (nodeSpec(line, 'void', 'index')) {
	              ref4 = children(line);
	              for (m = 0, len3 = ref4.length; m < len3; m++) {
	                object = ref4[m];
	                if (nodeSpec(object, 'object', 'class', 'oripa.OriLineProxy')) {
	                  x0 = x1 = y0 = y1 = type = 0;
	                  ref5 = children(object);
	                  for (n = 0, len4 = ref5.length; n < len4; n++) {
	                    subproperty = ref5[n];
	                    if (nodeSpec(subproperty, 'void', 'property')) {
	                      switch (subproperty.getAttribute('property')) {
	                        case 'x0':
	                          x0 = oneChildText(oneChildSpec(subproperty, 'double'));
	                          break;
	                        case 'x1':
	                          x1 = oneChildText(oneChildSpec(subproperty, 'double'));
	                          break;
	                        case 'y0':
	                          y0 = oneChildText(oneChildSpec(subproperty, 'double'));
	                          break;
	                        case 'y1':
	                          y1 = oneChildText(oneChildSpec(subproperty, 'double'));
	                          break;
	                        case 'type':
	                          type = oneChildText(oneChildSpec(subproperty, 'int'));
	                      }
	                    }
	                  }
	                  if ((x0 != null) && (x1 != null) && (y0 != null) && (y1 != null)) {
	                    fold.edges_vertices.push([vertex(x0, y0), vertex(x1, y1)]);
	                    if (type != null) {
	                      type = parseInt(type);
	                    }
	                    fold.edges_assignment.push(oripa.type2fold[type]);
	                  } else {
	                    console.warn("ORIPA line has missing data: " + x0 + " " + x1 + " " + y0 + " " + y1 + " " + type);
	                  }
	                }
	              }
	            }
	          }
	        } else if (property.getAttribute('property') in oripa.prop_xml2fold) {
	          prop = oripa.prop_xml2fold[property.getAttribute('property')];
	          if (prop != null) {
	            fold[prop] = oneChildText(oneChildSpec(property, 'string'));
	          }
	        } else {
	          console.warn("Ignoring " + property.tagName + " " + (top.getAttribute('property')) + " in ORIPA file");
	        }
	      }
	    }
	  }
	  filter.collapseNearbyVertices(fold, oripa.POINT_EPS);
	  filter.subdivideCrossingEdges_vertices(fold, oripa.POINT_EPS);
	  convert.edges_vertices_to_faces_vertices(fold);
	  return fold;
	};
	oripa.fromFold = function(fold) {
	  var coord, edge, ei, fp, i, j, len, line, lines, ref1, s, vertex, vs, xp;
	  if (typeof fold === 'string') {
	    fold = JSON.parse(fold);
	  }
	  s = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> \n<java version=\"1.5.0_05\" class=\"java.beans.XMLDecoder\"> \n <object class=\"oripa.DataSet\"> \n  <void property=\"mainVersion\"> \n   <int>1</int> \n  </void> \n  <void property=\"subVersion\"> \n   <int>1</int> \n  </void> \n  <void property=\"paperSize\"> \n   <double>400.0</double> \n  </void> \n";
	  ref1 = oripa.prop_xml2fold;
	  for (xp in ref1) {
	    fp = ref1[xp];
	    s += (".\n  <void property=\"" + xp + "\"> \n   <string>" + (fold[fp] || '') + "</string> \n  </void> \n").slice(2);
	  }
	  lines = (function() {
	    var j, len, ref2, results;
	    ref2 = fold.edges_vertices;
	    results = [];
	    for (ei = j = 0, len = ref2.length; j < len; ei = ++j) {
	      edge = ref2[ei];
	      vs = (function() {
	        var k, l, len1, len2, ref3, results1;
	        results1 = [];
	        for (k = 0, len1 = edge.length; k < len1; k++) {
	          vertex = edge[k];
	          ref3 = fold.vertices_coords[vertex].slice(2);
	          for (l = 0, len2 = ref3.length; l < len2; l++) {
	            coord = ref3[l];
	          }
	          results1.push(fold.vertices_coords[vertex]);
	        }
	        return results1;
	      })();
	      results.push({
	        x0: vs[0][0],
	        y0: vs[0][1],
	        x1: vs[1][0],
	        y1: vs[1][1],
	        type: oripa.fold2type[fold.edges_assignment[ei]] || oripa.fold2type_default
	      });
	    }
	    return results;
	  })();
	  s += (".\n  <void property=\"lines\"> \n   <array class=\"oripa.OriLineProxy\" length=\"" + lines.length + "\"> \n").slice(2);
	  for (i = j = 0, len = lines.length; j < len; i = ++j) {
	    line = lines[i];
	    s += (".\n    <void index=\"" + i + "\"> \n     <object class=\"oripa.OriLineProxy\"> \n      <void property=\"type\"> \n       <int>" + line.type + "</int> \n      </void> \n      <void property=\"x0\"> \n       <double>" + line.x0 + "</double> \n      </void> \n      <void property=\"x1\"> \n       <double>" + line.x1 + "</double> \n      </void> \n      <void property=\"y0\"> \n       <double>" + line.y0 + "</double> \n      </void> \n      <void property=\"y1\"> \n       <double>" + line.y1 + "</double> \n      </void> \n     </object> \n    </void> \n").slice(2);
	  }
	  s += ".\n   </array> \n  </void> \n </object> \n</java> \n".slice(2);
	  return s;
	};

	const pErr$1 = (new window.DOMParser())
		.parseFromString("INVALID", "text/xml")
		.getElementsByTagName("parsererror")[0]
		.namespaceURI;
	const load_file = function(input, callback) {
		let type = typeof input;
		if (type === "object") {
			try {
				let fold = JSON.parse(JSON.stringify(input));
				if (fold.vertices_coords == null) {
					throw "tried FOLD format, got empty object";
				}
				if (callback != null) {
					callback(fold);
				}
				return fold;
			} catch(err) {
				if (input instanceof Element){
					return;
				}
			}
		}
		if (type === "string" || input instanceof String) {
			try {
				let fold = JSON.parse(input);
				if (callback != null) { callback(fold); }
			} catch(err) {
				let xml = (new window.DOMParser()).parseFromString(input, "text/xml");
				if (xml.getElementsByTagNameNS(pErr$1, "parsererror").length === 0) {
					let parsedSVG = xml.documentElement;
					return;
				}
				let extension = input.substr((input.lastIndexOf('.') + 1));
				switch(extension) {
					case "fold":
						fetch(input)
							.then((response) => response.json())
							.then((data) => {
								if (callback != null) { callback(data); }
							});
					break;
					case "svg":
						load(input, function(svg$$1) {
						});
					break;
					case "oripa":
					break;
				}
			}
		}
	};
	const toFOLD = function(input, callback) {
		return load_file(input, function(fold) {
			if (callback != null) { callback(fold); }
		});
	};
	const toSVG = function(input, callback) {
		let syncFold;
		syncFold = load_file(input, function(fold) {
		});
		if (syncFold !== undefined) {
			return;
		}
	};
	const toORIPA = function(input, callback) {
		let fold = JSON.parse(JSON.stringify(input));
		return oripa.fromFold(fold);
	};

	var length = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0};
	var segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
	function parse(path) {
	  var data = [];
		path.replace(segment, function(_, command, args){
			var type = command.toLowerCase();
			args = parseValues(args);
			if (type === 'm' && args.length > 2) {
				data.push([command].concat(args.splice(0, 2)));
				type = 'l';
				command = command === 'm' ? 'l' : 'L';
			}
			while (args.length >= 0) {
				if (args.length === length[type]) {
					args.unshift(command);
					return data.push(args);
				}
				if (args.length < length[type]) {
	        throw new Error('malformed path data');
	      }
				data.push([command].concat(args.splice(0, length[type])));
			}
		});
	  return data;
	}
	var number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;
	function parseValues(args) {
		var numbers = args.match(number);
		return numbers ? numbers.map(Number) : [];
	}
	function Bezier(ax, ay, bx, by, cx, cy, dx, dy) {
	  return new Bezier$1(ax, ay, bx, by, cx, cy, dx, dy);
	}
	function Bezier$1(ax, ay, bx, by, cx, cy, dx, dy) {
	  this.a = {x:ax, y:ay};
	  this.b = {x:bx, y:by};
	  this.c = {x:cx, y:cy};
	  this.d = {x:dx, y:dy};
	  if(dx !== null && dx !== undefined && dy !== null && dy !== undefined){
	    this.getArcLength = getCubicArcLength;
	    this.getPoint = cubicPoint;
	    this.getDerivative = cubicDerivative;
	  } else {
	    this.getArcLength = getQuadraticArcLength;
	    this.getPoint = quadraticPoint;
	    this.getDerivative = quadraticDerivative;
	  }
	  this.init();
	}
	Bezier$1.prototype = {
	  constructor: Bezier$1,
	  init: function() {
	    this.length = this.getArcLength([this.a.x, this.b.x, this.c.x, this.d.x],
	                                    [this.a.y, this.b.y, this.c.y, this.d.y]);
	  },
	  getTotalLength: function() {
	    return this.length;
	  },
	  getPointAtLength: function(length) {
	    var t = t2length(length, this.length, this.getArcLength,
	                    [this.a.x, this.b.x, this.c.x, this.d.x],
	                    [this.a.y, this.b.y, this.c.y, this.d.y]);
	    return this.getPoint([this.a.x, this.b.x, this.c.x, this.d.x],
	                                    [this.a.y, this.b.y, this.c.y, this.d.y],
	                                  t);
	  },
	  getTangentAtLength: function(length){
	    var t = t2length(length, this.length, this.getArcLength,
	                    [this.a.x, this.b.x, this.c.x, this.d.x],
	                    [this.a.y, this.b.y, this.c.y, this.d.y]);
	    var derivative = this.getDerivative([this.a.x, this.b.x, this.c.x, this.d.x],
	                    [this.a.y, this.b.y, this.c.y, this.d.y], t);
	    var mdl = Math.sqrt(derivative.x * derivative.x + derivative.y * derivative.y);
	    var tangent;
	    if (mdl > 0){
	      tangent = {x: derivative.x/mdl, y: derivative.y/mdl};
	    } else {
	      tangent = {x: 0, y: 0};
	    }
	    return tangent;
	  },
	  getPropertiesAtLength: function(length){
	    var t = t2length(length, this.length, this.getArcLength,
	                    [this.a.x, this.b.x, this.c.x, this.d.x],
	                    [this.a.y, this.b.y, this.c.y, this.d.y]);
	    var derivative = this.getDerivative([this.a.x, this.b.x, this.c.x, this.d.x],
	                    [this.a.y, this.b.y, this.c.y, this.d.y], t);
	    var mdl = Math.sqrt(derivative.x * derivative.x + derivative.y * derivative.y);
	    var tangent;
	    if (mdl > 0){
	      tangent = {x: derivative.x/mdl, y: derivative.y/mdl};
	    } else {
	      tangent = {x: 0, y: 0};
	    }
	    var point = this.getPoint([this.a.x, this.b.x, this.c.x, this.d.x],
	                                    [this.a.y, this.b.y, this.c.y, this.d.y],
	                                  t);
	    return {x: point.x, y: point.y, tangentX: tangent.x, tangentY: tangent.y};
	  }
	};
	function quadraticDerivative(xs, ys, t){
	  return {x: (1 - t) * 2*(xs[1] - xs[0]) +t * 2*(xs[2] - xs[1]),
	    y: (1 - t) * 2*(ys[1] - ys[0]) +t * 2*(ys[2] - ys[1])
	  };
	}
	function cubicDerivative(xs, ys, t){
	  var derivative = quadraticPoint(
	            [3*(xs[1] - xs[0]), 3*(xs[2] - xs[1]), 3*(xs[3] - xs[2])],
	            [3*(ys[1] - ys[0]), 3*(ys[2] - ys[1]), 3*(ys[3] - ys[2])],
	            t);
	  return derivative;
	}
	function t2length(length, total_length, func, xs, ys){
	  var error = 1;
	  var t = length/total_length;
	  var step = (length - func(xs, ys, t))/total_length;
	  var numIterations = 0;
	  while (error > 0.001){
	    var increasedTLength = func(xs, ys, t + step);
	    var decreasedTLength = func(xs, ys, t - step);
	    var increasedTError = Math.abs(length - increasedTLength) / total_length;
	    var decreasedTError = Math.abs(length - decreasedTLength) / total_length;
	    if (increasedTError < error) {
	      error = increasedTError;
	      t += step;
	    } else if (decreasedTError < error) {
	      error = decreasedTError;
	      t -= step;
	    } else {
	      step /= 2;
	    }
	    numIterations++;
	    if(numIterations > 500){
	      break;
	    }
	  }
	  return t;
	}
	function quadraticPoint(xs, ys, t){
	  var x = (1 - t) * (1 - t) * xs[0] + 2 * (1 - t) * t * xs[1] + t * t * xs[2];
	  var y = (1 - t) * (1 - t) * ys[0] + 2 * (1 - t) * t * ys[1] + t * t * ys[2];
	  return {x: x, y: y};
	}
	function cubicPoint(xs, ys, t){
	  var x = (1 - t) * (1 - t) * (1 - t) * xs[0] + 3 * (1 - t) * (1 - t) * t * xs[1] +
	  3 * (1 - t) * t * t * xs[2] + t * t * t * xs[3];
	  var y = (1 - t) * (1 - t) * (1 - t) * ys[0] + 3 * (1 - t) * (1 - t) * t * ys[1] +
	  3 * (1 - t) * t * t * ys[2] + t * t * t * ys[3];
	  return {x: x, y: y};
	}
	function getQuadraticArcLength(xs, ys, t) {
	  if (t === undefined) {
	    t = 1;
	  }
	   var ax = xs[0] - 2 * xs[1] + xs[2];
	   var ay = ys[0] - 2 * ys[1] + ys[2];
	   var bx = 2 * xs[1] - 2 * xs[0];
	   var by = 2 * ys[1] - 2 * ys[0];
	   var A = 4 * (ax * ax + ay * ay);
	   var B = 4 * (ax * bx + ay * by);
	   var C = bx * bx + by * by;
	   if(A === 0){
	     return t * Math.sqrt(Math.pow(xs[2] - xs[0], 2) + Math.pow(ys[2] - ys[0], 2));
	   }
	   var b = B/(2*A);
	   var c = C/A;
	   var u = t + b;
	   var k = c - b*b;
	   var uuk = (u*u+k)>0?Math.sqrt(u*u+k):0;
	   var bbk = (b*b+k)>0?Math.sqrt(b*b+k):0;
	   var term = ((b+Math.sqrt(b*b+k)))!==0?k*Math.log(Math.abs((u+uuk)/(b+bbk))):0;
	   return (Math.sqrt(A)/2)*(
	     u*uuk-b*bbk+
	     term
	   );
	}
	var tValues = [
	  [],
	  [],
	  [-0.5773502691896257,0.5773502691896257],
	  [0,-0.7745966692414834,0.7745966692414834],
	  [-0.33998104358485626,0.33998104358485626,-0.8611363115940526,0.8611363115940526],
	  [0,-0.5384693101056831,0.5384693101056831,-0.906179845938664,0.906179845938664],
	  [0.6612093864662645,-0.6612093864662645,-0.2386191860831969,0.2386191860831969,-0.932469514203152,0.932469514203152],
	  [0,0.4058451513773972,-0.4058451513773972,-0.7415311855993945,0.7415311855993945,-0.9491079123427585,0.9491079123427585],
	  [-0.1834346424956498,0.1834346424956498,-0.525532409916329,0.525532409916329,-0.7966664774136267,0.7966664774136267,-0.9602898564975363,0.9602898564975363],
	  [0,-0.8360311073266358,0.8360311073266358,-0.9681602395076261,0.9681602395076261,-0.3242534234038089,0.3242534234038089,-0.6133714327005904,0.6133714327005904],
	  [-0.14887433898163122,0.14887433898163122,-0.4333953941292472,0.4333953941292472,-0.6794095682990244,0.6794095682990244,-0.8650633666889845,0.8650633666889845,-0.9739065285171717,0.9739065285171717],
	  [0,-0.26954315595234496,0.26954315595234496,-0.5190961292068118,0.5190961292068118,-0.7301520055740494,0.7301520055740494,-0.8870625997680953,0.8870625997680953,-0.978228658146057,0.978228658146057],
	  [-0.1252334085114689,0.1252334085114689,-0.3678314989981802,0.3678314989981802,-0.5873179542866175,0.5873179542866175,-0.7699026741943047,0.7699026741943047,-0.9041172563704749,0.9041172563704749,-0.9815606342467192,0.9815606342467192],
	  [0,-0.2304583159551348,0.2304583159551348,-0.44849275103644687,0.44849275103644687,-0.6423493394403402,0.6423493394403402,-0.8015780907333099,0.8015780907333099,-0.9175983992229779,0.9175983992229779,-0.9841830547185881,0.9841830547185881],
	  [-0.10805494870734367,0.10805494870734367,-0.31911236892788974,0.31911236892788974,-0.5152486363581541,0.5152486363581541,-0.6872929048116855,0.6872929048116855,-0.827201315069765,0.827201315069765,-0.9284348836635735,0.9284348836635735,-0.9862838086968123,0.9862838086968123],
	  [0,-0.20119409399743451,0.20119409399743451,-0.3941513470775634,0.3941513470775634,-0.5709721726085388,0.5709721726085388,-0.7244177313601701,0.7244177313601701,-0.8482065834104272,0.8482065834104272,-0.937273392400706,0.937273392400706,-0.9879925180204854,0.9879925180204854],
	  [-0.09501250983763744,0.09501250983763744,-0.2816035507792589,0.2816035507792589,-0.45801677765722737,0.45801677765722737,-0.6178762444026438,0.6178762444026438,-0.755404408355003,0.755404408355003,-0.8656312023878318,0.8656312023878318,-0.9445750230732326,0.9445750230732326,-0.9894009349916499,0.9894009349916499],
	  [0,-0.17848418149584785,0.17848418149584785,-0.3512317634538763,0.3512317634538763,-0.5126905370864769,0.5126905370864769,-0.6576711592166907,0.6576711592166907,-0.7815140038968014,0.7815140038968014,-0.8802391537269859,0.8802391537269859,-0.9506755217687678,0.9506755217687678,-0.9905754753144174,0.9905754753144174],
	  [-0.0847750130417353,0.0847750130417353,-0.2518862256915055,0.2518862256915055,-0.41175116146284263,0.41175116146284263,-0.5597708310739475,0.5597708310739475,-0.6916870430603532,0.6916870430603532,-0.8037049589725231,0.8037049589725231,-0.8926024664975557,0.8926024664975557,-0.9558239495713977,0.9558239495713977,-0.9915651684209309,0.9915651684209309],
	  [0,-0.16035864564022537,0.16035864564022537,-0.31656409996362983,0.31656409996362983,-0.46457074137596094,0.46457074137596094,-0.600545304661681,0.600545304661681,-0.7209661773352294,0.7209661773352294,-0.8227146565371428,0.8227146565371428,-0.9031559036148179,0.9031559036148179,-0.96020815213483,0.96020815213483,-0.9924068438435844,0.9924068438435844],
	  [-0.07652652113349734,0.07652652113349734,-0.22778585114164507,0.22778585114164507,-0.37370608871541955,0.37370608871541955,-0.5108670019508271,0.5108670019508271,-0.636053680726515,0.636053680726515,-0.7463319064601508,0.7463319064601508,-0.8391169718222188,0.8391169718222188,-0.912234428251326,0.912234428251326,-0.9639719272779138,0.9639719272779138,-0.9931285991850949,0.9931285991850949],
	  [0,-0.1455618541608951,0.1455618541608951,-0.2880213168024011,0.2880213168024011,-0.4243421202074388,0.4243421202074388,-0.5516188358872198,0.5516188358872198,-0.6671388041974123,0.6671388041974123,-0.7684399634756779,0.7684399634756779,-0.8533633645833173,0.8533633645833173,-0.9200993341504008,0.9200993341504008,-0.9672268385663063,0.9672268385663063,-0.9937521706203895,0.9937521706203895],
	  [-0.06973927331972223,0.06973927331972223,-0.20786042668822127,0.20786042668822127,-0.34193582089208424,0.34193582089208424,-0.469355837986757,0.469355837986757,-0.5876404035069116,0.5876404035069116,-0.6944872631866827,0.6944872631866827,-0.7878168059792081,0.7878168059792081,-0.8658125777203002,0.8658125777203002,-0.926956772187174,0.926956772187174,-0.9700604978354287,0.9700604978354287,-0.9942945854823992,0.9942945854823992],
	  [0,-0.1332568242984661,0.1332568242984661,-0.26413568097034495,0.26413568097034495,-0.3903010380302908,0.3903010380302908,-0.5095014778460075,0.5095014778460075,-0.6196098757636461,0.6196098757636461,-0.7186613631319502,0.7186613631319502,-0.8048884016188399,0.8048884016188399,-0.8767523582704416,0.8767523582704416,-0.9329710868260161,0.9329710868260161,-0.9725424712181152,0.9725424712181152,-0.9947693349975522,0.9947693349975522],
	  [-0.06405689286260563,0.06405689286260563,-0.1911188674736163,0.1911188674736163,-0.3150426796961634,0.3150426796961634,-0.4337935076260451,0.4337935076260451,-0.5454214713888396,0.5454214713888396,-0.6480936519369755,0.6480936519369755,-0.7401241915785544,0.7401241915785544,-0.820001985973903,0.820001985973903,-0.8864155270044011,0.8864155270044011,-0.9382745520027328,0.9382745520027328,-0.9747285559713095,0.9747285559713095,-0.9951872199970213,0.9951872199970213]
	];
	var cValues = [
	  [],
	  [],
	  [1,1],
	  [0.8888888888888888,0.5555555555555556,0.5555555555555556],
	  [0.6521451548625461,0.6521451548625461,0.34785484513745385,0.34785484513745385],
	  [0.5688888888888889,0.47862867049936647,0.47862867049936647,0.23692688505618908,0.23692688505618908],
	  [0.3607615730481386,0.3607615730481386,0.46791393457269104,0.46791393457269104,0.17132449237917036,0.17132449237917036],
	  [0.4179591836734694,0.3818300505051189,0.3818300505051189,0.27970539148927664,0.27970539148927664,0.1294849661688697,0.1294849661688697],
	  [0.362683783378362,0.362683783378362,0.31370664587788727,0.31370664587788727,0.22238103445337448,0.22238103445337448,0.10122853629037626,0.10122853629037626],
	  [0.3302393550012598,0.1806481606948574,0.1806481606948574,0.08127438836157441,0.08127438836157441,0.31234707704000286,0.31234707704000286,0.26061069640293544,0.26061069640293544],
	  [0.29552422471475287,0.29552422471475287,0.26926671930999635,0.26926671930999635,0.21908636251598204,0.21908636251598204,0.1494513491505806,0.1494513491505806,0.06667134430868814,0.06667134430868814],
	  [0.2729250867779006,0.26280454451024665,0.26280454451024665,0.23319376459199048,0.23319376459199048,0.18629021092773426,0.18629021092773426,0.1255803694649046,0.1255803694649046,0.05566856711617366,0.05566856711617366],
	  [0.24914704581340277,0.24914704581340277,0.2334925365383548,0.2334925365383548,0.20316742672306592,0.20316742672306592,0.16007832854334622,0.16007832854334622,0.10693932599531843,0.10693932599531843,0.04717533638651183,0.04717533638651183],
	  [0.2325515532308739,0.22628318026289723,0.22628318026289723,0.2078160475368885,0.2078160475368885,0.17814598076194574,0.17814598076194574,0.13887351021978725,0.13887351021978725,0.09212149983772845,0.09212149983772845,0.04048400476531588,0.04048400476531588],
	  [0.2152638534631578,0.2152638534631578,0.2051984637212956,0.2051984637212956,0.18553839747793782,0.18553839747793782,0.15720316715819355,0.15720316715819355,0.12151857068790319,0.12151857068790319,0.08015808715976021,0.08015808715976021,0.03511946033175186,0.03511946033175186],
	  [0.2025782419255613,0.19843148532711158,0.19843148532711158,0.1861610000155622,0.1861610000155622,0.16626920581699392,0.16626920581699392,0.13957067792615432,0.13957067792615432,0.10715922046717194,0.10715922046717194,0.07036604748810812,0.07036604748810812,0.03075324199611727,0.03075324199611727],
	  [0.1894506104550685,0.1894506104550685,0.18260341504492358,0.18260341504492358,0.16915651939500254,0.16915651939500254,0.14959598881657674,0.14959598881657674,0.12462897125553388,0.12462897125553388,0.09515851168249279,0.09515851168249279,0.062253523938647894,0.062253523938647894,0.027152459411754096,0.027152459411754096],
	  [0.17944647035620653,0.17656270536699264,0.17656270536699264,0.16800410215645004,0.16800410215645004,0.15404576107681028,0.15404576107681028,0.13513636846852548,0.13513636846852548,0.11188384719340397,0.11188384719340397,0.08503614831717918,0.08503614831717918,0.0554595293739872,0.0554595293739872,0.02414830286854793,0.02414830286854793],
	  [0.1691423829631436,0.1691423829631436,0.16427648374583273,0.16427648374583273,0.15468467512626524,0.15468467512626524,0.14064291467065065,0.14064291467065065,0.12255520671147846,0.12255520671147846,0.10094204410628717,0.10094204410628717,0.07642573025488905,0.07642573025488905,0.0497145488949698,0.0497145488949698,0.02161601352648331,0.02161601352648331],
	  [0.1610544498487837,0.15896884339395434,0.15896884339395434,0.15276604206585967,0.15276604206585967,0.1426067021736066,0.1426067021736066,0.12875396253933621,0.12875396253933621,0.11156664554733399,0.11156664554733399,0.09149002162245,0.09149002162245,0.06904454273764123,0.06904454273764123,0.0448142267656996,0.0448142267656996,0.019461788229726478,0.019461788229726478],
	  [0.15275338713072584,0.15275338713072584,0.14917298647260374,0.14917298647260374,0.14209610931838204,0.14209610931838204,0.13168863844917664,0.13168863844917664,0.11819453196151841,0.11819453196151841,0.10193011981724044,0.10193011981724044,0.08327674157670475,0.08327674157670475,0.06267204833410907,0.06267204833410907,0.04060142980038694,0.04060142980038694,0.017614007139152118,0.017614007139152118],
	  [0.14608113364969041,0.14452440398997005,0.14452440398997005,0.13988739479107315,0.13988739479107315,0.13226893863333747,0.13226893863333747,0.12183141605372853,0.12183141605372853,0.10879729916714838,0.10879729916714838,0.09344442345603386,0.09344442345603386,0.0761001136283793,0.0761001136283793,0.057134425426857205,0.057134425426857205,0.036953789770852494,0.036953789770852494,0.016017228257774335,0.016017228257774335],
	  [0.13925187285563198,0.13925187285563198,0.13654149834601517,0.13654149834601517,0.13117350478706238,0.13117350478706238,0.12325237681051242,0.12325237681051242,0.11293229608053922,0.11293229608053922,0.10041414444288096,0.10041414444288096,0.08594160621706773,0.08594160621706773,0.06979646842452049,0.06979646842452049,0.052293335152683286,0.052293335152683286,0.03377490158481415,0.03377490158481415,0.0146279952982722,0.0146279952982722],
	  [0.13365457218610619,0.1324620394046966,0.1324620394046966,0.12890572218808216,0.12890572218808216,0.12304908430672953,0.12304908430672953,0.11499664022241136,0.11499664022241136,0.10489209146454141,0.10489209146454141,0.09291576606003515,0.09291576606003515,0.07928141177671895,0.07928141177671895,0.06423242140852585,0.06423242140852585,0.04803767173108467,0.04803767173108467,0.030988005856979445,0.030988005856979445,0.013411859487141771,0.013411859487141771],
	  [0.12793819534675216,0.12793819534675216,0.1258374563468283,0.1258374563468283,0.12167047292780339,0.12167047292780339,0.1155056680537256,0.1155056680537256,0.10744427011596563,0.10744427011596563,0.09761865210411388,0.09761865210411388,0.08619016153195327,0.08619016153195327,0.0733464814110803,0.0733464814110803,0.05929858491543678,0.05929858491543678,0.04427743881741981,0.04427743881741981,0.028531388628933663,0.028531388628933663,0.0123412297999872,0.0123412297999872]
	];
	var binomialCoefficients = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]];
	function binomials(n, k) {
	  return binomialCoefficients[n][k];
	}
	function getDerivative(derivative, t, vs) {
	  var n = vs.length - 1,
	      _vs,
	      value,
	      k;
	  if (n === 0) {
	    return 0;
	  }
	  if (derivative === 0) {
	    value = 0;
	    for (k = 0; k <= n; k++) {
	      value += binomials(n, k) * Math.pow(1 - t, n - k) * Math.pow(t, k) * vs[k];
	    }
	    return value;
	  } else {
	    _vs = new Array(n);
	    for (k = 0; k < n; k++) {
	      _vs[k] = n * (vs[k + 1] - vs[k]);
	    }
	    return getDerivative(derivative - 1, t, _vs);
	  }
	}
	function B(xs, ys, t) {
	  var xbase = getDerivative(1, t, xs);
	  var ybase = getDerivative(1, t, ys);
	  var combined = xbase * xbase + ybase * ybase;
	  return Math.sqrt(combined);
	}
	function getCubicArcLength(xs, ys, t) {
	  var z, sum, i, correctedT;
	  if (t === undefined) {
	    t = 1;
	  }
	  var n = 20;
	  z = t / 2;
	  sum = 0;
	  for (i = 0; i < n; i++) {
	    correctedT = z * tValues[n][i] + z;
	    sum += cValues[n][i] * B(xs, ys, correctedT);
	  }
	  return z * sum;
	}
	function Arc(x0, y0, rx,ry, xAxisRotate, LargeArcFlag,SweepFlag, x,y) {
	  return new Arc$1(x0, y0, rx,ry, xAxisRotate, LargeArcFlag,SweepFlag, x,y);
	}
	function Arc$1(x0, y0,rx,ry, xAxisRotate, LargeArcFlag, SweepFlag,x1,y1) {
	  this.x0 = x0;
	  this.y0 = y0;
	  this.rx = rx;
	  this.ry = ry;
	  this.xAxisRotate = xAxisRotate;
	  this.LargeArcFlag = LargeArcFlag;
	  this.SweepFlag = SweepFlag;
	  this.x1 = x1;
	  this.y1 = y1;
	  var lengthProperties = approximateArcLengthOfCurve(300, function(t) {
	    return pointOnEllipticalArc({x: x0, y:y0}, rx, ry, xAxisRotate,
	                                 LargeArcFlag, SweepFlag, {x: x1, y:y1}, t);
	  });
	  this.length = lengthProperties.arcLength;
	}
	Arc$1.prototype = {
	  constructor: Arc$1,
	  init: function() {
	  },
	  getTotalLength: function() {
	    return this.length;
	  },
	  getPointAtLength: function(fractionLength) {
	    if(fractionLength < 0){
	      fractionLength = 0;
	    } else if(fractionLength > this.length){
	      fractionLength = this.length;
	    }
	    var position = pointOnEllipticalArc({x: this.x0, y:this.y0},
	      this.rx, this.ry, this.xAxisRotate,
	      this.LargeArcFlag, this.SweepFlag,
	      {x: this.x1, y: this.y1},
	      fractionLength/this.length);
	    return {x: position.x, y: position.y};
	  },
	  getTangentAtLength: function(fractionLength) {
	    if(fractionLength < 0){
	        fractionLength = 0;
	        } else if(fractionLength > this.length){
	        fractionLength = this.length;
	        }
	        var position = pointOnEllipticalArc({x: this.x0, y:this.y0},
	          this.rx, this.ry, this.xAxisRotate,
	          this.LargeArcFlag, this.SweepFlag,
	          {x: this.x1, y: this.y1},
	          fractionLength/this.length);
	        return {x: position.x, y: position.y};
	  },
	  getPropertiesAtLength: function(fractionLength){
	    var tangent = this.getTangentAtLength(fractionLength);
	    var point = this.getPointAtLength(fractionLength);
	    return {x: point.x, y: point.y, tangentX: tangent.x, tangentY: tangent.y};
	  }
	};
	function pointOnEllipticalArc(p0, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, p1, t) {
	  rx = Math.abs(rx);
	  ry = Math.abs(ry);
	  xAxisRotation = mod(xAxisRotation, 360);
	  var xAxisRotationRadians = toRadians(xAxisRotation);
	  if(p0.x === p1.x && p0.y === p1.y) {
	    return p0;
	  }
	  if(rx === 0 || ry === 0) {
	    return this.pointOnLine(p0, p1, t);
	  }
	  var dx = (p0.x-p1.x)/2;
	  var dy = (p0.y-p1.y)/2;
	  var transformedPoint = {
	    x: Math.cos(xAxisRotationRadians)*dx + Math.sin(xAxisRotationRadians)*dy,
	    y: -Math.sin(xAxisRotationRadians)*dx + Math.cos(xAxisRotationRadians)*dy
	  };
	  var radiiCheck = Math.pow(transformedPoint.x, 2)/Math.pow(rx, 2) + Math.pow(transformedPoint.y, 2)/Math.pow(ry, 2);
	  if(radiiCheck > 1) {
	    rx = Math.sqrt(radiiCheck)*rx;
	    ry = Math.sqrt(radiiCheck)*ry;
	  }
	  var cSquareNumerator = Math.pow(rx, 2)*Math.pow(ry, 2) - Math.pow(rx, 2)*Math.pow(transformedPoint.y, 2) - Math.pow(ry, 2)*Math.pow(transformedPoint.x, 2);
	  var cSquareRootDenom = Math.pow(rx, 2)*Math.pow(transformedPoint.y, 2) + Math.pow(ry, 2)*Math.pow(transformedPoint.x, 2);
	  var cRadicand = cSquareNumerator/cSquareRootDenom;
	  cRadicand = cRadicand < 0 ? 0 : cRadicand;
	  var cCoef = (largeArcFlag !== sweepFlag ? 1 : -1) * Math.sqrt(cRadicand);
	  var transformedCenter = {
	    x: cCoef*((rx*transformedPoint.y)/ry),
	    y: cCoef*(-(ry*transformedPoint.x)/rx)
	  };
	  var center = {
	    x: Math.cos(xAxisRotationRadians)*transformedCenter.x - Math.sin(xAxisRotationRadians)*transformedCenter.y + ((p0.x+p1.x)/2),
	    y: Math.sin(xAxisRotationRadians)*transformedCenter.x + Math.cos(xAxisRotationRadians)*transformedCenter.y + ((p0.y+p1.y)/2)
	  };
	  var startVector = {
	    x: (transformedPoint.x-transformedCenter.x)/rx,
	    y: (transformedPoint.y-transformedCenter.y)/ry
	  };
	  var startAngle = angleBetween({
	    x: 1,
	    y: 0
	  }, startVector);
	  var endVector = {
	    x: (-transformedPoint.x-transformedCenter.x)/rx,
	    y: (-transformedPoint.y-transformedCenter.y)/ry
	  };
	  var sweepAngle = angleBetween(startVector, endVector);
	  if(!sweepFlag && sweepAngle > 0) {
	    sweepAngle -= 2*Math.PI;
	  }
	  else if(sweepFlag && sweepAngle < 0) {
	    sweepAngle += 2*Math.PI;
	  }
	  sweepAngle %= 2*Math.PI;
	  var angle = startAngle+(sweepAngle*t);
	  var ellipseComponentX = rx*Math.cos(angle);
	  var ellipseComponentY = ry*Math.sin(angle);
	  var point = {
	    x: Math.cos(xAxisRotationRadians)*ellipseComponentX - Math.sin(xAxisRotationRadians)*ellipseComponentY + center.x,
	    y: Math.sin(xAxisRotationRadians)*ellipseComponentX + Math.cos(xAxisRotationRadians)*ellipseComponentY + center.y
	  };
	  point.ellipticalArcStartAngle = startAngle;
	  point.ellipticalArcEndAngle = startAngle+sweepAngle;
	  point.ellipticalArcAngle = angle;
	  point.ellipticalArcCenter = center;
	  point.resultantRx = rx;
	  point.resultantRy = ry;
	  return point;
	}
	function approximateArcLengthOfCurve(resolution, pointOnCurveFunc) {
	  resolution = resolution ? resolution : 500;
	  var resultantArcLength = 0;
	  var arcLengthMap = [];
	  var approximationLines = [];
	  var prevPoint = pointOnCurveFunc(0);
	  var nextPoint;
	  for(var i = 0; i < resolution; i++) {
	    var t = clamp(i*(1/resolution), 0, 1);
	    nextPoint = pointOnCurveFunc(t);
	    resultantArcLength += distance(prevPoint, nextPoint);
	    approximationLines.push([prevPoint, nextPoint]);
	    arcLengthMap.push({
	      t: t,
	      arcLength: resultantArcLength
	    });
	    prevPoint = nextPoint;
	  }
	  nextPoint = pointOnCurveFunc(1);
	  approximationLines.push([prevPoint, nextPoint]);
	  resultantArcLength += distance(prevPoint, nextPoint);
	  arcLengthMap.push({
	    t: 1,
	    arcLength: resultantArcLength
	  });
	  return {
	    arcLength: resultantArcLength,
	    arcLengthMap: arcLengthMap,
	    approximationLines: approximationLines
	  };
	}
	function mod(x, m) {
	  return (x%m + m)%m;
	}
	function toRadians(angle) {
	  return angle * (Math.PI / 180);
	}
	function distance(p0, p1) {
	  return Math.sqrt(Math.pow(p1.x-p0.x, 2) + Math.pow(p1.y-p0.y, 2));
	}
	function clamp(val, min, max) {
	  return Math.min(Math.max(val, min), max);
	}
	function angleBetween(v0, v1) {
	  var p = v0.x*v1.x + v0.y*v1.y;
	  var n = Math.sqrt((Math.pow(v0.x, 2)+Math.pow(v0.y, 2)) * (Math.pow(v1.x, 2)+Math.pow(v1.y, 2)));
	  var sign = v0.x*v1.y - v0.y*v1.x < 0 ? -1 : 1;
	  var angle = sign*Math.acos(p/n);
	  return angle;
	}
	function LinearPosition(x0, x1, y0, y1) {
	  return new LinearPosition$1(x0, x1, y0, y1);
	}
	function LinearPosition$1(x0, x1, y0, y1){
	  this.x0 = x0;
	  this.x1 = x1;
	  this.y0 = y0;
	  this.y1 = y1;
	}
	LinearPosition$1.prototype.getTotalLength = function(){
	  return Math.sqrt(Math.pow(this.x0 - this.x1, 2) +
	         Math.pow(this.y0 - this.y1, 2));
	};
	LinearPosition$1.prototype.getPointAtLength = function(pos){
	  var fraction = pos/ (Math.sqrt(Math.pow(this.x0 - this.x1, 2) +
	         Math.pow(this.y0 - this.y1, 2)));
	  var newDeltaX = (this.x1 - this.x0)*fraction;
	  var newDeltaY = (this.y1 - this.y0)*fraction;
	  return { x: this.x0 + newDeltaX, y: this.y0 + newDeltaY };
	};
	LinearPosition$1.prototype.getTangentAtLength = function(){
	  var module = Math.sqrt((this.x1 - this.x0) * (this.x1 - this.x0) +
	              (this.y1 - this.y0) * (this.y1 - this.y0));
	  return { x: (this.x1 - this.x0)/module, y: (this.y1 - this.y0)/module };
	};
	LinearPosition$1.prototype.getPropertiesAtLength = function(pos){
	  var point = this.getPointAtLength(pos);
	  var tangent = this.getTangentAtLength();
	  return {x: point.x, y: point.y, tangentX: tangent.x, tangentY: tangent.y};
	};
	function PathProperties(svgString) {
	  var length = 0;
	  var partial_lengths = [];
	  var functions = [];
	  function svgProperties(string){
	    if(!string){return null;}
	    var parsed = parse(string);
	    var cur = [0, 0];
	    var prev_point = [0, 0];
	    var curve;
	    var ringStart;
	    for (var i = 0; i < parsed.length; i++){
	      if(parsed[i][0] === "M"){
	        cur = [parsed[i][1], parsed[i][2]];
	        ringStart = [cur[0], cur[1]];
	        functions.push(null);
	      } else if(parsed[i][0] === "m"){
	        cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[1]];
	        ringStart = [cur[0], cur[1]];
	        functions.push(null);
	      }
	      else if(parsed[i][0] === "L"){
	        length = length + Math.sqrt(Math.pow(cur[0] - parsed[i][1], 2) + Math.pow(cur[1] - parsed[i][2], 2));
	        functions.push(new LinearPosition(cur[0], parsed[i][1], cur[1], parsed[i][2]));
	        cur = [parsed[i][1], parsed[i][2]];
	      } else if(parsed[i][0] === "l"){
	        length = length + Math.sqrt(Math.pow(parsed[i][1], 2) + Math.pow(parsed[i][2], 2));
	        functions.push(new LinearPosition(cur[0], parsed[i][1] + cur[0], cur[1], parsed[i][2] + cur[1]));
	        cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[1]];
	      } else if(parsed[i][0] === "H"){
	        length = length + Math.abs(cur[0] - parsed[i][1]);
	        functions.push(new LinearPosition(cur[0], parsed[i][1], cur[1], cur[1]));
	        cur[0] = parsed[i][1];
	      } else if(parsed[i][0] === "h"){
	        length = length + Math.abs(parsed[i][1]);
	        functions.push(new LinearPosition(cur[0], cur[0] + parsed[i][1], cur[1], cur[1]));
	        cur[0] = parsed[i][1] + cur[0];
	      } else if(parsed[i][0] === "V"){
	        length = length + Math.abs(cur[1] - parsed[i][1]);
	        functions.push(new LinearPosition(cur[0], cur[0], cur[1], parsed[i][1]));
	        cur[1] = parsed[i][1];
	      } else if(parsed[i][0] === "v"){
	        length = length + Math.abs(parsed[i][1]);
	        functions.push(new LinearPosition(cur[0], cur[0], cur[1], cur[1] + parsed[i][1]));
	        cur[1] = parsed[i][1] + cur[1];
	      }  else if(parsed[i][0] === "z" || parsed[i][0] === "Z"){
	        length = length + Math.sqrt(Math.pow(ringStart[0] - cur[0], 2) + Math.pow(ringStart[1] - cur[1], 2));
	        functions.push(new LinearPosition(cur[0], ringStart[0], cur[1], ringStart[1]));
	        cur = [ringStart[0], ringStart[1]];
	      }
	      else if(parsed[i][0] === "C"){
	        curve = new Bezier(cur[0], cur[1] , parsed[i][1], parsed[i][2] , parsed[i][3], parsed[i][4] , parsed[i][5], parsed[i][6]);
	        length = length + curve.getTotalLength();
	        cur = [parsed[i][5], parsed[i][6]];
	        functions.push(curve);
	      } else if(parsed[i][0] === "c"){
	        curve = new Bezier(cur[0], cur[1] , cur[0] + parsed[i][1], cur[1] + parsed[i][2] , cur[0] + parsed[i][3], cur[1] + parsed[i][4] , cur[0] + parsed[i][5], cur[1] + parsed[i][6]);
	        if(curve.getTotalLength() > 0){
	          length = length + curve.getTotalLength();
	          functions.push(curve);
	          cur = [parsed[i][5] + cur[0], parsed[i][6] + cur[1]];
	        } else {
	          functions.push(new LinearPosition(cur[0], cur[0], cur[1], cur[1]));
	        }
	      } else if(parsed[i][0] === "S"){
	        if(i>0 && ["C","c","S","s"].indexOf(parsed[i-1][0]) > -1){
	          curve = new Bezier(cur[0], cur[1] , 2*cur[0] - parsed[i-1][parsed[i-1].length - 4], 2*cur[1] - parsed[i-1][parsed[i-1].length - 3], parsed[i][1], parsed[i][2] , parsed[i][3], parsed[i][4]);
	        } else {
	          curve = new Bezier(cur[0], cur[1] , cur[0], cur[1], parsed[i][1], parsed[i][2] , parsed[i][3], parsed[i][4]);
	        }
	        length = length + curve.getTotalLength();
	        cur = [parsed[i][3], parsed[i][4]];
	        functions.push(curve);
	      }  else if(parsed[i][0] === "s"){
	        if(i>0 && ["C","c","S","s"].indexOf(parsed[i-1][0]) > -1){
	          curve = new Bezier(cur[0], cur[1] , cur[0] + curve.d.x - curve.c.x, cur[1] + curve.d.y - curve.c.y, cur[0] + parsed[i][1], cur[1] + parsed[i][2] , cur[0] + parsed[i][3], cur[1] + parsed[i][4]);
	        } else {
	          curve = new Bezier(cur[0], cur[1] , cur[0], cur[1], cur[0] + parsed[i][1], cur[1] + parsed[i][2] , cur[0] + parsed[i][3], cur[1] + parsed[i][4]);
	        }
	        length = length + curve.getTotalLength();
	        cur = [parsed[i][3] + cur[0], parsed[i][4] + cur[1]];
	        functions.push(curve);
	      }
	      else if(parsed[i][0] === "Q"){
	        if(cur[0] == parsed[i][1] && cur[1] == parsed[i][2]){
	          curve = new LinearPosition(parsed[i][1], parsed[i][3], parsed[i][2], parsed[i][4]);
	        } else {
	          curve = new Bezier(cur[0], cur[1] , parsed[i][1], parsed[i][2] , parsed[i][3], parsed[i][4]);
	        }
	        length = length + curve.getTotalLength();
	        functions.push(curve);
	        cur = [parsed[i][3], parsed[i][4]];
	        prev_point = [parsed[i][1], parsed[i][2]];
	      }  else if(parsed[i][0] === "q"){
	        if(!(parsed[i][1] == 0 && parsed[i][2] == 0)){
	          curve = new Bezier(cur[0], cur[1] , cur[0] + parsed[i][1], cur[1] + parsed[i][2] , cur[0] + parsed[i][3], cur[1] + parsed[i][4]);
	        } else {
	          curve = new LinearPosition(cur[0] + parsed[i][1], cur[0] + parsed[i][3], cur[1] + parsed[i][2], cur[1] + parsed[i][4]);
	        }
	        length = length + curve.getTotalLength();
	        prev_point = [cur[0] + parsed[i][1], cur[1] + parsed[i][2]];
	        cur = [parsed[i][3] + cur[0], parsed[i][4] + cur[1]];
	        functions.push(curve);
	      } else if(parsed[i][0] === "T"){
	        if(i>0 && ["Q","q","T","t"].indexOf(parsed[i-1][0]) > -1){
	          curve = new Bezier(cur[0], cur[1] , 2 * cur[0] - prev_point[0] , 2 * cur[1] - prev_point[1] , parsed[i][1], parsed[i][2]);
	        } else {
	          curve = new LinearPosition(cur[0], parsed[i][1], cur[1], parsed[i][2]);
	        }
	        functions.push(curve);
	        length = length + curve.getTotalLength();
	        prev_point = [2 * cur[0] - prev_point[0] , 2 * cur[1] - prev_point[1]];
	        cur = [parsed[i][1], parsed[i][2]];
	      } else if(parsed[i][0] === "t"){
	        if(i>0 && ["Q","q","T","t"].indexOf(parsed[i-1][0]) > -1){
	          curve = new Bezier(cur[0], cur[1] , 2 * cur[0] - prev_point[0] , 2 * cur[1] - prev_point[1] , cur[0] + parsed[i][1], cur[1] + parsed[i][2]);
	        } else {
	          curve = new LinearPosition(cur[0], cur[0] + parsed[i][1], cur[1], cur[1] + parsed[i][2]);
	        }
	        length = length + curve.getTotalLength();
	        prev_point = [2 * cur[0] - prev_point[0] , 2 * cur[1] - prev_point[1]];
	        cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[0]];
	        functions.push(curve);
	      } else if(parsed[i][0] === "A"){
	        curve = new Arc(cur[0], cur[1], parsed[i][1], parsed[i][2], parsed[i][3], parsed[i][4], parsed[i][5], parsed[i][6], parsed[i][7]);
	        length = length + curve.getTotalLength();
	        cur = [parsed[i][6], parsed[i][7]];
	        functions.push(curve);
	      } else if(parsed[i][0] === "a"){
	        curve = new Arc(cur[0], cur[1], parsed[i][1], parsed[i][2], parsed[i][3], parsed[i][4], parsed[i][5], cur[0] + parsed[i][6], cur[1] + parsed[i][7]);
	        length = length + curve.getTotalLength();
	        cur = [cur[0] + parsed[i][6], cur[1] + parsed[i][7]];
	        functions.push(curve);
	      }
	      partial_lengths.push(length);
	    }
	    return svgProperties;
	  }
	 svgProperties.getTotalLength = function(){
	    return length;
	  };
	  svgProperties.getPointAtLength = function(fractionLength){
	    var fractionPart = getPartAtLength(fractionLength);
	    return functions[fractionPart.i].getPointAtLength(fractionPart.fraction);
	  };
	  svgProperties.getTangentAtLength = function(fractionLength){
	    var fractionPart = getPartAtLength(fractionLength);
	    return functions[fractionPart.i].getTangentAtLength(fractionPart.fraction);
	  };
	  svgProperties.getPropertiesAtLength = function(fractionLength){
	    var fractionPart = getPartAtLength(fractionLength);
	    return functions[fractionPart.i].getPropertiesAtLength(fractionPart.fraction);
	  };
	  svgProperties.getParts = function(){
	    var parts = [];
	    for(var i = 0; i< functions.length; i++){
	      if(functions[i] != null){
	        var properties = {};
	        properties['start'] = functions[i].getPointAtLength(0);
	        properties['end'] = functions[i].getPointAtLength(partial_lengths[i] - partial_lengths[i-1]);
	        properties['length'] = partial_lengths[i] - partial_lengths[i-1];
	        (function(func){
	          properties['getPointAtLength'] = function(d){return func.getPointAtLength(d);};
	          properties['getTangentAtLength'] = function(d){return func.getTangentAtLength(d);};
	          properties['getPropertiesAtLength'] = function(d){return func.getPropertiesAtLength(d);};
	        })(functions[i]);
	        parts.push(properties);
	      }
	    }
	    return parts;
	  };
	  var getPartAtLength = function(fractionLength){
	    if(fractionLength < 0){
	      fractionLength = 0;
	    } else if(fractionLength > length){
	      fractionLength = length;
	    }
	    var i = partial_lengths.length - 1;
	    while(partial_lengths[i] >= fractionLength && partial_lengths[i] > 0){
	      i--;
	    }
	    i++;
	    return {fraction: fractionLength-partial_lengths[i-1], i: i};
	  };
	  return svgProperties(svgString);
	}
	const RES_CIRCLE = 64;
	const RES_PATH = 128;
	const emptyValue = { value: 0 };
	const getAttributes = function(element, attributeList) {
		let indices = attributeList.map(attr => {
			for (var i = 0; i < element.attributes.length; i++) {
				if (element.attributes[i].nodeName === attr) {
					return i;
				}
			}
		});
		return indices
			.map(i => i === undefined ? emptyValue : element.attributes[i])
			.map(attr => attr.value !== undefined ? attr.value : attr.baseVal.value);
	};
	const svg_line_to_segments = function(line) {
		return [getAttributes(line, ["x1","y1","x2","y2"])];
	};
	const svg_rect_to_segments = function(rect) {
		let attrs = getAttributes(rect, ["x","y","width","height"]);
		let x = parseFloat(attrs[0]);
		let y = parseFloat(attrs[1]);
		let width = parseFloat(attrs[2]);
		let height = parseFloat(attrs[3]);
		return [
			[x, y, x+width, y],
			[x+width, y, x+width, y+height],
			[x+width, y+height, x, y+height],
			[x, y+height, x, y]
		];
	};
	const svg_circle_to_segments = function(circle) {
		let attrs = getAttributes(circle, ["cx", "cy", "r"]);
		let cx = parseFloat(attrs[0]);
		let cy = parseFloat(attrs[1]);
		let r = parseFloat(attrs[2]);
		return Array.from(Array(RES_CIRCLE))
			.map((_,i) => [
				cx + r*Math.cos(i/RES_CIRCLE*Math.PI*2),
				cy + r*Math.sin(i/RES_CIRCLE*Math.PI*2)
			]).map((_,i,arr) => [
				arr[i][0],
				arr[i][1],
				arr[(i+1)%arr.length][0],
				arr[(i+1)%arr.length][1]
			]);
	};
	const svg_ellipse_to_segments = function(ellipse) {
		let attrs = getAttributes(ellipse, ["cx", "cy", "rx", "ry"]);
		let cx = parseFloat(attrs[0]);
		let cy = parseFloat(attrs[1]);
		let rx = parseFloat(attrs[2]);
		let ry = parseFloat(attrs[3]);
		return Array.from(Array(RES_CIRCLE))
			.map((_,i) => [
				cx + rx*Math.cos(i/RES_CIRCLE*Math.PI*2),
				cy + ry*Math.sin(i/RES_CIRCLE*Math.PI*2)
			]).map((_,i,arr) => [
				arr[i][0],
				arr[i][1],
				arr[(i+1)%arr.length][0],
				arr[(i+1)%arr.length][1]
			]);
	};
	const pointStringToArray = function(str) {
		return str.split(" ")
			.filter(s => s !== "")
			.map(p => p.split(",")
				.map(n => parseFloat(n))
			);
	};
	const svg_polygon_to_segments = function(polygon) {
		let points = "";
		for (var i = 0; i < polygon.attributes.length; i++) {
			if (polygon.attributes[i].nodeName === "points") {
				points = polygon.attributes[i].value;
				break;
			}
		}
		return pointStringToArray(points)
			.map((_,i,a) => [
				a[i][0],
				a[i][1],
				a[(i+1)%a.length][0],
				a[(i+1)%a.length][1]
			])
	};
	const svg_polyline_to_segments = function(polyline) {
		let circularPath = svg_polygon_to_segments(polyline);
		circularPath.pop();
		return circularPath;
	};
	const svg_path_to_segments = function(path) {
		let d = path.getAttribute("d");
		let prop = PathProperties(d);
		let length = prop.getTotalLength();
		let isClosed = (d[d.length-1] === "Z" || d[d.length-1] === "z");
		let segmentLength = (isClosed
			? length / RES_PATH
			: length / (RES_PATH-1));
		let pathsPoints = Array.from(Array(RES_PATH))
			.map((_,i) => prop.getPointAtLength(i*segmentLength))
			.map(p => [p.x, p.y]);
		let segments = pathsPoints.map((_,i,a) => [
			a[i][0],
			a[i][1],
			a[(i+1)%a.length][0],
			a[(i+1)%a.length][1]
		]);
		if (!isClosed) { segments.pop(); }
		return segments;
	};
	const parsers = {
		"line": svg_line_to_segments,
		"rect": svg_rect_to_segments,
		"circle": svg_circle_to_segments,
		"ellipse": svg_ellipse_to_segments,
		"polygon": svg_polygon_to_segments,
		"polyline": svg_polyline_to_segments,
		"path": svg_path_to_segments
	};
	let DOMParser$1 = (typeof window === "undefined" || window === null)
		? undefined
		: window.DOMParser;
	if (typeof DOMParser$1 === "undefined" || DOMParser$1 === null) {
		DOMParser$1 = require("xmldom").DOMParser;
	}
	let XMLSerializer = (typeof window === "undefined" || window === null)
		? undefined
		: window.XMLSerializer;
	if (typeof XMLSerializer === "undefined" || XMLSerializer === null) {
		XMLSerializer = require("xmldom").XMLSerializer;
	}
	let document$1 = (typeof window === "undefined" || window === null)
		? undefined
		: window.document;
	if (typeof document$1 === "undefined" || document$1 === null) {
		document$1 = new DOMParser$1()
			.parseFromString("<!DOCTYPE html><title>a</title>", "text/html");
	}
	const parseable = Object.keys(parsers);
	const shape_attr = {
		"line": ["x1", "y1", "x2", "y2"],
		"rect": ["x", "y", "width", "height"],
		"circle": ["cx", "cy", "r"],
		"ellipse": ["cx", "cy", "rx", "ry"],
		"polygon": ["points"],
		"polyline": ["points"],
		"path": ["d"]
	};
	const inputIntoXML = function(input) {
		return (typeof input === "string"
			? new DOMParser$1().parseFromString(input, "text/xml").documentElement
			: input);
	};
	const flatten_tree = function(element) {
		if (element.tagName === "g" || element.tagName === "svg") {
			if (element.childNodes == null) { return []; }
			return Array.from(element.childNodes)
				.map(child => flatten_tree(child))
				.reduce((a,b) => a.concat(b),[]);
		}
		return [element];
	};
	const attribute_list = function(element) {
		return Array.from(element.attributes)
			.filter(a => shape_attr[element.tagName].indexOf(a.name) === -1);
	};
	const withAttributes = function(input) {
		let inputSVG = inputIntoXML(input);
		return flatten_tree(inputSVG)
			.filter(e => parseable.indexOf(e.tagName) !== -1)
			.map(e => parsers[e.tagName](e).map(s => {
				let obj = ({x1:s[0], y1:s[1], x2:s[2], y2:s[3]});
				attribute_list(e).forEach(a => obj[a.nodeName] = a.value);
				return obj;
			}))
			.reduce((a,b) => a.concat(b), []);
	};
	const get_boundary_vertices$1 = function(graph) {
		let edges_vertices_b = graph.edges_vertices.filter((ev,i) =>
			graph.edges_assignment[i] == "B" ||
			graph.edges_assignment[i] == "b"
		).map(arr => arr.slice());
		if (edges_vertices_b.length === 0) { return []; }
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
	const bounding_rect$1 = function(graph) {
		if ("vertices_coords" in graph === false ||
			graph.vertices_coords.length <= 0) {
			return [0,0,0,0];
		}
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
	const make_faces_faces$1 = function(graph) {
		let nf = graph.faces_vertices.length;
		let faces_faces = Array.from(Array(nf)).map(() => []);
		let edgeMap = {};
		graph.faces_vertices.forEach((vertices_index, idx1) => {
			if (vertices_index === undefined) { return; }
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
	const faces_matrix_coloring$1 = function(faces_matrix) {
		return faces_matrix
			.map(m => m[0] * m[3] - m[1] * m[2])
			.map(c => c >= 0);
	};
	const faces_coloring$1 = function(graph, root_face = 0){
		let coloring = [];
		coloring[root_face] = true;
		make_face_walk_tree$1(graph, root_face).forEach((level, i) =>
			level.forEach((entry) => coloring[entry.face] = (i % 2 === 0))
		);
		return coloring;
	};
	const make_face_walk_tree$1 = function(graph, root_face = 0){
		let new_faces_faces = make_faces_faces$1(graph);
		if (new_faces_faces.length <= 0) {
			return [];
		}
		var visited = [root_face];
		var list = [[{ face: root_face, parent: undefined, edge: undefined, level: 0 }]];
		do{
			list[list.length] = list[list.length-1].map((current) =>{
				let unique_faces = new_faces_faces[current.face]
					.filter(f => visited.indexOf(f) === -1);
				visited = visited.concat(unique_faces);
				return unique_faces.map(f => ({
					face: f,
					parent: current.face,
					edge: graph.faces_vertices[f]
						.filter(v => graph.faces_vertices[current.face].indexOf(v) !== -1)
						.sort((a,b) => a-b)
				}))
			}).reduce((prev,curr) => prev.concat(curr),[]);
		} while(list[list.length-1].length > 0);
		if(list.length > 0 && list[list.length-1].length == 0){ list.pop(); }
		return list;
	};
	const flatten_frame$1 = function(fold_file, frame_num){
		if ("file_frames" in fold_file === false ||
			fold_file.file_frames.length < frame_num) {
			return fold_file;
		}
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
	var css_colors = {
		"black": "#000000",
		"silver": "#c0c0c0",
		"gray": "#808080",
		"white": "#ffffff",
		"maroon": "#800000",
		"red": "#ff0000",
		"purple": "#800080",
		"fuchsia": "#ff00ff",
		"green": "#008000",
		"lime": "#00ff00",
		"olive": "#808000",
		"yellow": "#ffff00",
		"navy": "#000080",
		"blue": "#0000ff",
		"teal": "#008080",
		"aqua": "#00ffff",
		"orange": "#ffa500",
		"aliceblue": "#f0f8ff",
		"antiquewhite": "#faebd7",
		"aquamarine": "#7fffd4",
		"azure": "#f0ffff",
		"beige": "#f5f5dc",
		"bisque": "#ffe4c4",
		"blanchedalmond": "#ffebcd",
		"blueviolet": "#8a2be2",
		"brown": "#a52a2a",
		"burlywood": "#deb887",
		"cadetblue": "#5f9ea0",
		"chartreuse": "#7fff00",
		"chocolate": "#d2691e",
		"coral": "#ff7f50",
		"cornflowerblue": "#6495ed",
		"cornsilk": "#fff8dc",
		"crimson": "#dc143c",
		"cyan": "#00ffff",
		"darkblue": "#00008b",
		"darkcyan": "#008b8b",
		"darkgoldenrod": "#b8860b",
		"darkgray": "#a9a9a9",
		"darkgreen": "#006400",
		"darkgrey": "#a9a9a9",
		"darkkhaki": "#bdb76b",
		"darkmagenta": "#8b008b",
		"darkolivegreen": "#556b2f",
		"darkorange": "#ff8c00",
		"darkorchid": "#9932cc",
		"darkred": "#8b0000",
		"darksalmon": "#e9967a",
		"darkseagreen": "#8fbc8f",
		"darkslateblue": "#483d8b",
		"darkslategray": "#2f4f4f",
		"darkslategrey": "#2f4f4f",
		"darkturquoise": "#00ced1",
		"darkviolet": "#9400d3",
		"deeppink": "#ff1493",
		"deepskyblue": "#00bfff",
		"dimgray": "#696969",
		"dimgrey": "#696969",
		"dodgerblue": "#1e90ff",
		"firebrick": "#b22222",
		"floralwhite": "#fffaf0",
		"forestgreen": "#228b22",
		"gainsboro": "#dcdcdc",
		"ghostwhite": "#f8f8ff",
		"gold": "#ffd700",
		"goldenrod": "#daa520",
		"greenyellow": "#adff2f",
		"grey": "#808080",
		"honeydew": "#f0fff0",
		"hotpink": "#ff69b4",
		"indianred": "#cd5c5c",
		"indigo": "#4b0082",
		"ivory": "#fffff0",
		"khaki": "#f0e68c",
		"lavender": "#e6e6fa",
		"lavenderblush": "#fff0f5",
		"lawngreen": "#7cfc00",
		"lemonchiffon": "#fffacd",
		"lightblue": "#add8e6",
		"lightcoral": "#f08080",
		"lightcyan": "#e0ffff",
		"lightgoldenrodyellow": "#fafad2",
		"lightgray": "#d3d3d3",
		"lightgreen": "#90ee90",
		"lightgrey": "#d3d3d3",
		"lightpink": "#ffb6c1",
		"lightsalmon": "#ffa07a",
		"lightseagreen": "#20b2aa",
		"lightskyblue": "#87cefa",
		"lightslategray": "#778899",
		"lightslategrey": "#778899",
		"lightsteelblue": "#b0c4de",
		"lightyellow": "#ffffe0",
		"limegreen": "#32cd32",
		"linen": "#faf0e6",
		"magenta": "#ff00ff",
		"mediumaquamarine": "#66cdaa",
		"mediumblue": "#0000cd",
		"mediumorchid": "#ba55d3",
		"mediumpurple": "#9370db",
		"mediumseagreen": "#3cb371",
		"mediumslateblue": "#7b68ee",
		"mediumspringgreen": "#00fa9a",
		"mediumturquoise": "#48d1cc",
		"mediumvioletred": "#c71585",
		"midnightblue": "#191970",
		"mintcream": "#f5fffa",
		"mistyrose": "#ffe4e1",
		"moccasin": "#ffe4b5",
		"navajowhite": "#ffdead",
		"oldlace": "#fdf5e6",
		"olivedrab": "#6b8e23",
		"orangered": "#ff4500",
		"orchid": "#da70d6",
		"palegoldenrod": "#eee8aa",
		"palegreen": "#98fb98",
		"paleturquoise": "#afeeee",
		"palevioletred": "#db7093",
		"papayawhip": "#ffefd5",
		"peachpuff": "#ffdab9",
		"peru": "#cd853f",
		"pink": "#ffc0cb",
		"plum": "#dda0dd",
		"powderblue": "#b0e0e6",
		"rosybrown": "#bc8f8f",
		"royalblue": "#4169e1",
		"saddlebrown": "#8b4513",
		"salmon": "#fa8072",
		"sandybrown": "#f4a460",
		"seagreen": "#2e8b57",
		"seashell": "#fff5ee",
		"sienna": "#a0522d",
		"skyblue": "#87ceeb",
		"slateblue": "#6a5acd",
		"slategray": "#708090",
		"slategrey": "#708090",
		"snow": "#fffafa",
		"springgreen": "#00ff7f",
		"steelblue": "#4682b4",
		"tan": "#d2b48c",
		"thistle": "#d8bfd8",
		"tomato": "#ff6347",
		"turquoise": "#40e0d0",
		"violet": "#ee82ee",
		"wheat": "#f5deb3",
		"whitesmoke": "#f5f5f5",
		"yellowgreen": "#9acd32"
	};
	const css_color_names = Object.keys(css_colors);
	const svg_to_fold = function(svg$$1) {
		let graph = {
			"file_spec": 1.1,
			"file_creator": "Rabbit Ear",
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
		let vl = graph.vertices_coords.length;
		let segments$$1 = withAttributes(svg$$1);
		graph.vertices_coords = segments$$1
			.map(s => [[s.x1, s.y1], [s.x2, s.y2]])
			.reduce((a,b) => a.concat(b), []);
		return graph;
		graph.edges_vertices = segments$$1.map((_,i) => [vl+i*2, vl+i*2+1]);
		graph.edges_assignment = segments$$1.map(l => color_to_assignment(l.stroke));
		graph.edges_foldAngle = graph.edges_assignment.map(a =>
			(a === "M" ? -180 : (a === "V" ? 180 : 0))
		);
		return graph;
	};
	const color_to_assignment = function(string) {
		let c = [0,0,0,1];
		if (string[0] === "#") {
			c = hexToComponents(string);
		} else if (css_color_names.indexOf(string) !== -1) {
			c = hexToComponents(css_colors[string]);
		}
		const ep = 0.05;
		if (c[0] < ep && c[1] < ep && c[2] < ep) { return "F"; }
		if (c[0] > c[1] && (c[0] - c[2]) > ep) { return "V"; }
		if (c[2] > c[1] && (c[2] - c[0]) > ep) { return "M"; }
		return "F";
	};
	const hexToComponents = function(h) {
		let r = 0, g = 0, b = 0, a = 255;
		if (h.length == 4) {
			r = "0x" + h[1] + h[1];
			g = "0x" + h[2] + h[2];
			b = "0x" + h[3] + h[3];
		} else if (h.length == 7) {
			r = "0x" + h[1] + h[2];
			g = "0x" + h[3] + h[4];
			b = "0x" + h[5] + h[6];
		} else if (h.length == 5) {
			r = "0x" + h[1] + h[1];
			g = "0x" + h[2] + h[2];
			b = "0x" + h[3] + h[3];
			a = "0x" + h[4] + h[4];
		} else if (h.length == 9) {
			r = "0x" + h[1] + h[2];
			g = "0x" + h[3] + h[4];
			b = "0x" + h[5] + h[6];
			a = "0x" + h[7] + h[8];
		}
		return [+(r / 255), +(g / 255), +(b / 255), +(a / 255)];
	};
	let DOMParser$1$1 = (typeof window === "undefined" || window === null)
		? undefined
		: window.DOMParser;
	if (typeof DOMParser$1$1 === "undefined" || DOMParser$1$1 === null) {
		DOMParser$1$1 = require("xmldom").DOMParser;
	}
	let document$1$1 = (typeof window === "undefined" || window === null)
		? undefined
		: window.document;
	if (typeof document$1$1 === "undefined" || document$1$1 === null) {
		document$1$1 = new DOMParser$1$1()
			.parseFromString("<!DOCTYPE html><title>a</title>", "text/html");
	}
	const svgNS$1$1 = "http://www.w3.org/2000/svg";
	const svg$1$1 = function() {
		let svgImage = document$1$1.createElementNS(svgNS$1$1, "svg");
		svgImage.setAttribute("version", "1.1");
		svgImage.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		return svgImage;
	};
	const group$1 = function() {
		let g = document$1$1.createElementNS(svgNS$1$1, "g");
		return g;
	};
	const style = function() {
		let style = document$1$1.createElementNS(svgNS$1$1, "style");
		style.setAttribute("type", "text/css");
		return style;
	};
	const shadowFilter = function(id_name = "shadow") {
		let defs = document$1$1.createElementNS(svgNS$1$1, "defs");
		let filter = document$1$1.createElementNS(svgNS$1$1, "filter");
		filter.setAttribute("width", "200%");
		filter.setAttribute("height", "200%");
		filter.setAttribute("id", id_name);
		let blur = document$1$1.createElementNS(svgNS$1$1, "feGaussianBlur");
		blur.setAttribute("in", "SourceAlpha");
		blur.setAttribute("stdDeviation", "0.005");
		blur.setAttribute("result", "blur");
		let offset = document$1$1.createElementNS(svgNS$1$1, "feOffset");
		offset.setAttribute("in", "blur");
		offset.setAttribute("result", "offsetBlur");
		let flood = document$1$1.createElementNS(svgNS$1$1, "feFlood");
		flood.setAttribute("flood-color", "#000");
		flood.setAttribute("flood-opacity", "0.3");
		flood.setAttribute("result", "offsetColor");
		let composite = document$1$1.createElementNS(svgNS$1$1, "feComposite");
		composite.setAttribute("in", "offsetColor");
		composite.setAttribute("in2", "offsetBlur");
		composite.setAttribute("operator", "in");
		composite.setAttribute("result", "offsetBlur");
		let merge = document$1$1.createElementNS(svgNS$1$1, "feMerge");
		let mergeNode1 = document$1$1.createElementNS(svgNS$1$1, "feMergeNode");
		let mergeNode2 = document$1$1.createElementNS(svgNS$1$1, "feMergeNode");
		mergeNode2.setAttribute("in", "SourceGraphic");
		merge.appendChild(mergeNode1);
		merge.appendChild(mergeNode2);
		defs.appendChild(filter);
		filter.appendChild(blur);
		filter.appendChild(offset);
		filter.appendChild(flood);
		filter.appendChild(composite);
		filter.appendChild(merge);
		return defs;
	};
	const line$2 = function(x1, y1, x2, y2) {
		let shape = document$1$1.createElementNS(svgNS$1$1, "line");
		shape.setAttributeNS(null, "x1", x1);
		shape.setAttributeNS(null, "y1", y1);
		shape.setAttributeNS(null, "x2", x2);
		shape.setAttributeNS(null, "y2", y2);
		return shape;
	};
	const circle$1 = function(x, y, radius) {
		let shape = document$1$1.createElementNS(svgNS$1$1, "circle");
		shape.setAttributeNS(null, "cx", x);
		shape.setAttributeNS(null, "cy", y);
		shape.setAttributeNS(null, "r", radius);
		return shape;
	};
	const polygon$1 = function(pointsArray) {
		let shape = document$1$1.createElementNS(svgNS$1$1, "polygon");
		setPoints$1(shape, pointsArray);
		return shape;
	};
	const bezier$1 = function(fromX, fromY, c1X, c1Y, c2X, c2Y, toX, toY) {
		let d = "M " + fromX + "," + fromY + " C " + c1X + "," + c1Y +
				" " + c2X + "," + c2Y + " " + toX + "," + toY;
		let shape = document$1$1.createElementNS(svgNS$1$1, "path");
		shape.setAttributeNS(null, "d", d);
		return shape;
	};
	const arcArrow$1 = function(startPoint, endPoint, options) {
		let p = {
			color: "#000",
			strokeWidth: 0.01,
			width: 0.025,
			length: 0.075,
			bend: 0.3,
			pinch: 0.618,
			padding: 0.5,
			side: true,
			start: false,
			end: true,
			strokeStyle: "",
			fillStyle: "",
		};
		if (typeof options === "object" && options !== null) {
			Object.assign(p, options);
		}
		let arrowFill = [
			"stroke:none",
			"fill:"+p.color,
			p.fillStyle
		].filter(a => a !== "").join(";");
		let arrowStroke = [
			"fill:none",
			"stroke:" + p.color,
			"stroke-width:" + p.strokeWidth,
			p.strokeStyle
		].filter(a => a !== "").join(";");
		let vector = [endPoint[0]-startPoint[0], endPoint[1]-startPoint[1]];
		let perpendicular = [vector[1], -vector[0]];
		let midpoint = [startPoint[0] + vector[0]/2, startPoint[1] + vector[1]/2];
		let bezPoint = [
			midpoint[0] + perpendicular[0]*(p.side?1:-1) * p.bend,
			midpoint[1] + perpendicular[1]*(p.side?1:-1) * p.bend
		];
		let bezStart = [bezPoint[0] - startPoint[0], bezPoint[1] - startPoint[1]];
		let bezEnd = [bezPoint[0] - endPoint[0], bezPoint[1] - endPoint[1]];
		let bezStartLen = Math.sqrt(bezStart[0]*bezStart[0]+bezStart[1]*bezStart[1]);
		let bezEndLen = Math.sqrt(bezEnd[0]*bezEnd[0]+bezEnd[1]*bezEnd[1]);
		let bezStartNorm = [bezStart[0]/bezStartLen, bezStart[1]/bezStartLen];
		let bezEndNorm = [bezEnd[0]/bezEndLen, bezEnd[1]/bezEndLen];
		let arcStart = [
			startPoint[0] + bezStartNorm[0]*p.length*((p.start?1:0)+p.padding),
			startPoint[1] + bezStartNorm[1]*p.length*((p.start?1:0)+p.padding)
		];
		let arcEnd = [
			endPoint[0] + bezEndNorm[0]*p.length*((p.end?1:0)+p.padding),
			endPoint[1] + bezEndNorm[1]*p.length*((p.end?1:0)+p.padding)
		];
		let controlStart = [
			arcStart[0] + (bezPoint[0] - arcStart[0]) * p.pinch,
			arcStart[1] + (bezPoint[1] - arcStart[1]) * p.pinch
		];
		let controlEnd = [
			arcEnd[0] + (bezPoint[0] - arcEnd[0]) * p.pinch,
			arcEnd[1] + (bezPoint[1] - arcEnd[1]) * p.pinch
		];
		let startVec = [-bezStartNorm[0], -bezStartNorm[1]];
		let endVec = [-bezEndNorm[0], -bezEndNorm[1]];
		let startNormal = [startVec[1], -startVec[0]];
		let endNormal = [endVec[1], -endVec[0]];
		let startPoints = [
			[arcStart[0]+startNormal[0]*-p.width, arcStart[1]+startNormal[1]*-p.width],
			[arcStart[0]+startNormal[0]*p.width, arcStart[1]+startNormal[1]*p.width],
			[arcStart[0]+startVec[0]*p.length, arcStart[1]+startVec[1]*p.length]
		];
		let endPoints = [
			[arcEnd[0]+endNormal[0]*-p.width, arcEnd[1]+endNormal[1]*-p.width],
			[arcEnd[0]+endNormal[0]*p.width, arcEnd[1]+endNormal[1]*p.width],
			[arcEnd[0]+endVec[0]*p.length, arcEnd[1]+endVec[1]*p.length]
		];
		let arrowGroup = document$1$1.createElementNS(svgNS$1$1, "g");
		let arrowArc = bezier$1(
			arcStart[0], arcStart[1], controlStart[0], controlStart[1],
			controlEnd[0], controlEnd[1], arcEnd[0], arcEnd[1]
		);
		arrowArc.setAttribute("style", arrowStroke);
		arrowGroup.appendChild(arrowArc);
		if (p.start) {
			let startHead = polygon$1(startPoints);
			startHead.setAttribute("style", arrowFill);
			arrowGroup.appendChild(startHead);
		}
		if (p.end) {
			let endHead = polygon$1(endPoints);
			endHead.setAttribute("style", arrowFill);
			arrowGroup.appendChild(endHead);
		}
		return arrowGroup;
	};
	const setPoints$1 = function(polygon, pointsArray) {
		if (pointsArray == null || pointsArray.constructor !== Array) {
			return;
		}
		let pointsString = pointsArray.map((el) =>
			(el.constructor === Array ? el : [el.x, el.y])
		).reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
		polygon.setAttributeNS(null, "points", pointsString);
	};
	const setViewBox$1 = function(svg, x, y, width, height, padding = 0) {
		let scale = 1.0;
		let d = (width / scale) - width;
		let X = (x - d) - padding;
		let Y = (y - d) - padding;
		let W = (width + d * 2) + padding * 2;
		let H = (height + d * 2) + padding * 2;
		let viewBoxString = [X, Y, W, H].join(" ");
		svg.setAttributeNS(null, "viewBox", viewBoxString);
	};
	function vkXML$1(text, step) {
		var ar = text.replace(/>\s{0,}</g,"><")
					 .replace(/</g,"~::~<")
					 .replace(/\s*xmlns\:/g,"~::~xmlns:")
					 .split('~::~'),
			len = ar.length,
			inComment = false,
			deep = 0,
			str = '',
			space = (step != null && typeof step === "string" ? step : "\t");
		var shift = ['\n'];
		for(let si=0; si<100; si++){
			shift.push(shift[si]+space);
		}
		for (let ix=0;ix<len;ix++) {
			if(ar[ix].search(/<!/) > -1) {
				str += shift[deep]+ar[ix];
				inComment = true;
				if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1
					|| ar[ix].search(/!DOCTYPE/) > -1 ) {
					inComment = false;
				}
			}
			else if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) {
				str += ar[ix];
				inComment = false;
			}
			else if ( /^<\w/.exec(ar[ix-1]) && /^<\/\w/.exec(ar[ix]) &&
				/^<[\w:\-\.\,]+/.exec(ar[ix-1])
				== /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace('/','')) {
				str += ar[ix];
				if (!inComment) { deep--; }
			}
			else if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) == -1
				&& ar[ix].search(/\/>/) == -1 ) {
				str = !inComment ? str += shift[deep++]+ar[ix] : str += ar[ix];
			}
			else if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
				str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
			}
			else if(ar[ix].search(/<\//) > -1) {
				str = !inComment ? str += shift[--deep]+ar[ix] : str += ar[ix];
			}
			else if(ar[ix].search(/\/>/) > -1 ) {
				str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
			}
			else if(ar[ix].search(/<\?/) > -1) {
				str += shift[deep]+ar[ix];
			}
			else if(ar[ix].search(/xmlns\:/) > -1 || ar[ix].search(/xmlns\=/) > -1){
				console.log("xmlns at level", deep);
				str += shift[deep]+ar[ix];
			}
			else {
				str += ar[ix];
			}
		}
		return  (str[0] == '\n') ? str.slice(1) : str;
	}
	const style$1 = `
svg * {
  stroke-width:var(--crease-width);
  stroke-linecap:round;
  stroke:black;
}
polygon {fill:none; stroke:none; stroke-linejoin:bevel;}
.boundary {fill:white; stroke:black;}
.mark {stroke:#AAA;}
.mountain {stroke:#00F;}
.valley{
  stroke:#F00;
  stroke-dasharray:calc(var(--crease-width)*2) calc(var(--crease-width)*2);
}
.foldedForm .boundary {fill:none;stroke:none;}
.foldedForm .faces polygon { stroke:#000; }
.foldedForm .faces .front { fill:#DDD; }
.foldedForm .faces .back { fill:#FFF; }
.foldedForm .creases line { stroke:none; }`;
	let DOMParser$2 = (typeof window === "undefined" || window === null)
		? undefined
		: window.DOMParser;
	if (typeof DOMParser$2 === "undefined" || DOMParser$2 === null) {
		DOMParser$2 = require("xmldom").DOMParser;
	}
	let XMLSerializer$1 = (typeof window === "undefined" || window === null)
		? undefined
		: window.XMLSerializer;
	if (typeof XMLSerializer$1 === "undefined" || XMLSerializer$1 === null) {
		XMLSerializer$1 = require("xmldom").XMLSerializer;
	}
	const CREASE_NAMES$1 = {
		B: "boundary", b: "boundary",
		M: "mountain", m: "mountain",
		V: "valley",   v: "valley",
		F: "mark",     f: "mark",
		U: "mark",     u: "mark"
	};
	const DISPLAY_NAME = {
		vertices: "vertices",
		edges: "creases",
		faces: "faces",
		boundaries: "boundaries"
	};
	const fold_to_svg = function(fold, options) {
		let svg = svg$1$1();
		let stylesheet = style$1;
		let graph = fold;
		let style$$1 = true;
		let shadows = false;
		let padding = 0;
		let groups = {
			boundaries: true,
			faces: true,
			edges: true,
			vertices: false
		};
		let width = "500px";
		let height = "500px";
		if (options != null) {
			if (options.width != null) { width = options.width; }
			if (options.height != null) { height = options.height; }
			if (options.style != null) { style$$1 = options.style; }
			if (options.stylesheet != null) { stylesheet = options.stylesheet; }
			if (options.shadows != null) { shadows = options.shadows; }
			if (options.padding != null) { padding = options.padding; }
			if (options.frame != null) {
				graph = flatten_frame$1(fold, options.frame);
			}
		}
		let file_classes = (graph.file_classes != null
			? graph.file_classes : []).join(" ");
		let frame_classes = graph.frame_classes != null
			? graph.frame_classes : [].join(" ");
		let top_level_classes = [file_classes, frame_classes]
			.filter(s => s !== "")
			.join(" ");
		svg.setAttribute("class", top_level_classes);
		svg.setAttribute("width", width);
		svg.setAttribute("height", height);
		let styleElement = style();
		svg.appendChild(styleElement);
		Object.keys(groups)
			.filter(key => groups[key] === false)
			.forEach(key => delete groups[key]);
		Object.keys(groups).forEach(key => {
			groups[key] = group$1();
			groups[key].setAttribute("class", DISPLAY_NAME[key]);
			svg.appendChild(groups[key]);
		});
		Object.keys(groups).forEach(key =>
			components[key](graph).forEach(o =>
				groups[key].appendChild(o)
			)
		);
		if ("re:instructions" in graph) {
			let instructionLayer = group$1();
			svg.appendChild(instructionLayer);
			renderInstructions(graph, instructionLayer);
		}
		if (shadows) {
			let shadow_id = "face_shadow";
			let shadowFilter$$1 = shadowFilter(shadow_id);
			svg.appendChild(shadowFilter$$1);
			Array.from(groups.faces.childNodes)
				.forEach(f => f.setAttribute("filter", "url(#"+shadow_id+")"));
		}
		let rect = bounding_rect$1(graph);
		setViewBox$1(svg, ...rect, padding);
		let vmin = rect[2] > rect[3] ? rect[3] : rect[2];
		let innerStyle = (style$$1
			? `\nsvg { --crease-width: ${vmin*0.005}; }\n${stylesheet}`
			: `\nsvg { --crease-width: ${vmin*0.005}; }\n`);
		var docu = (new DOMParser$2())
			.parseFromString('<xml></xml>', 'application/xml');
		var cdata = docu.createCDATASection(innerStyle);
		styleElement.appendChild(cdata);
		let stringified = (new XMLSerializer$1()).serializeToString(svg);
		let beautified = vkXML$1(stringified);
		return beautified;
	};
	const svgBoundaries = function(graph) {
		if ("edges_vertices" in graph === false ||
		    "vertices_coords" in graph === false) {
			return [];
		}
		let boundary = get_boundary_vertices$1(graph)
			.map(v => graph.vertices_coords[v]);
		let p = polygon$1(boundary);
		p.setAttribute("class", "boundary");
		return [p];
	};
	const svgVertices = function(graph, options) {
		if ("vertices_coords" in graph === false) {
			return [];
		}
		let radius = options && options.radius ? options.radius : 0.01;
		let svg_vertices = graph.vertices_coords
			.map(v => circle$1(v[0], v[1], radius));
		svg_vertices.forEach((c,i) => c.setAttribute("id", ""+i));
		return svg_vertices;
	};
	const svgEdges = function(graph) {
		if ("edges_vertices" in graph === false ||
		    "vertices_coords" in graph === false) {
			return [];
		}
		let svg_edges = graph.edges_vertices
			.map(ev => ev.map(v => graph.vertices_coords[v]))
			.map(e => line$2(e[0][0], e[0][1], e[1][0], e[1][1]));
		svg_edges.forEach((edge, i) => edge.setAttribute("id", ""+i));
		make_edge_assignment_names(graph)
			.forEach((a, i) => svg_edges[i].setAttribute("class", a));
		return svg_edges;
	};
	const svgFaces = function(graph) {
		if ("faces_vertices" in graph === true) {
			return svgFacesVertices(graph);
		} else if ("faces_edges" in graph === true) {
			return svgFacesEdges(graph);
		}
		return [];
	};
	const svgFacesVertices = function(graph) {
		if ("faces_vertices" in graph === false ||
		    "vertices_coords" in graph === false) {
			return [];
		}
		let svg_faces = graph.faces_vertices
			.map(fv => fv.map(v => graph.vertices_coords[v]))
			.map(face => polygon$1(face));
		svg_faces.forEach((face, i) => face.setAttribute("id", ""+i));
		return finalize_faces(graph, svg_faces);
	};
	const svgFacesEdges = function(graph) {
		if ("faces_edges" in graph === false ||
		    "edges_vertices" in graph === false ||
		    "vertices_coords" in graph === false) {
			return [];
		}
		let svg_faces = graph.faces_edges
			.map(face_edges => face_edges
				.map(edge => graph.edges_vertices[edge])
				.map((vi, i, arr) => {
					let next = arr[(i+1)%arr.length];
					return (vi[1] === next[0] || vi[1] === next[1] ? vi[0] : vi[1]);
				}).map(v => graph.vertices_coords[v])
			).map(face => polygon$1(face));
		svg_faces.forEach((face, i) => face.setAttribute("id", ""+i));
		return finalize_faces(graph, svg_faces);
	};
	const finalize_faces = function(graph, svg_faces) {
		let orderIsCertain = graph["faces_re:layer"] != null
			&& graph["faces_re:layer"].length === graph.faces_vertices.length;
		if (orderIsCertain) {
			make_faces_sidedness(graph)
				.forEach((side, i) => svg_faces[i].setAttribute("class", side));
		}
		return (orderIsCertain
			? faces_sorted_by_layer(graph["faces_re:layer"]).map(i => svg_faces[i])
			: svg_faces);
	};
	const make_faces_sidedness = function(graph) {
		let coloring = graph["faces_re:coloring"];
		if (coloring == null) {
			coloring = ("faces_re:matrix" in graph)
				? faces_matrix_coloring$1(graph["faces_re:matrix"])
				: faces_coloring$1(graph, 0);
		}
		return coloring.map(c => c ? "front" : "back");
	};
	const faces_sorted_by_layer = function(faces_layer) {
		return faces_layer.map((layer,i) => ({layer:layer, i:i}))
			.sort((a,b) => a.layer-b.layer)
			.map(el => el.i)
	};
	const make_edge_assignment_names = function(graph) {
		return (graph.edges_vertices == null || graph.edges_assignment == null ||
			graph.edges_vertices.length !== graph.edges_assignment.length
			? []
			: graph.edges_assignment.map(a => CREASE_NAMES$1[a]));
	};
	const components = {
		vertices: svgVertices,
		edges: svgEdges,
		faces: svgFaces,
		boundaries: svgBoundaries
	};
	const renderInstructions = function(graph, group$$1) {
		if (graph["re:instructions"] === undefined) { return; }
		if (graph["re:instructions"].length === 0) { return; }
		Array.from(graph["re:instructions"]).forEach(instruction => {
			if ("re:instruction_creaseLines" in instruction === true) {
				instruction["re:instruction_creaseLines"].forEach(crease => {
					let creaseClass = ("re:instruction_creaseLines_class" in crease)
						? crease["re:instruction_creaseLines_class"]
						: "valley";
					let pts = crease["re:instruction_creaseLines_endpoints"];
					if (pts !== undefined) {
						let l = line$2(pts[0][0], pts[0][1], pts[1][0], pts[1][1]);
						l.setAttribute("class", creaseClass);
						group$$1.appendChild(l);
					}
				});
			}
			if ("re:instruction_arrows" in instruction === true) {
				instruction["re:instruction_arrows"].forEach(arrowInst => {
					let start = arrowInst["re:instruction_arrows_start"];
					let end = arrowInst["re:instruction_arrows_end"];
					if (start === undefined || end === undefined) { return; }
					let arrow = arcArrow$1(start, end, {start:true, end:true});
					group$$1.appendChild(arrow);
				});
			}
		});
	};
	let DOMParser$3 = (typeof window === "undefined" || window === null)
		? undefined
		: window.DOMParser;
	if (typeof DOMParser$3 === "undefined" || DOMParser$3 === null) {
		DOMParser$3 = require("xmldom").DOMParser;
	}
	let XMLSerializer$2 = (typeof window === "undefined" || window === null)
		? undefined
		: window.XMLSerializer;
	if (typeof XMLSerializer$2 === "undefined" || XMLSerializer$2 === null) {
		XMLSerializer$2 = require("xmldom").XMLSerializer;
	}
	let core$1 = {
		svgBoundaries,
		svgVertices,
		svgEdges,
		svgFacesVertices,
		svgFacesEdges
	};
	let convert$2 = {
		core: core$1,
		toSVG: function(input, options) {
			if (typeof input === "object" && input !== null) {
				return fold_to_svg(input, options);
			}
			else if (typeof input === "string" || input instanceof String) {
				try {
					let obj = JSON.parse(input);
					return fold_to_svg(obj, options);
				} catch (error) {
					throw error;
				}
			}
		},
		toFOLD: function(input, options) {
			if (typeof input === "string") {
				let svg = (new DOMParser$3())
					.parseFromString(input, "text/xml").documentElement;
				return svg_to_fold(svg, options);
			} else {
				return svg_to_fold(input, options);
			}
		},
	};

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
		return (num == null
			? undefined
			: parseFloat(num.toFixed(decimalPlaces)));
	};
	const get_vec$1 = function() {
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
		const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		return Array.from(Array(24))
			.map(_ => Math.floor(Math.random()*digits.length))
			.map(i => digits[i])
			.join('');
	};
	const Component = function(proto, options) {
		if(proto == null) {
			proto = {};
		}
		if (options != null) {
			proto.graph = options.graph;
			proto.index = options.index;
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
			else { return; }
			this.graph.onchange.forEach(f => f());
		};
		const mountain = function() {
			this.graph.edges_assignment[index] = "M";
			this.graph.edges_foldAngle[index] = -180;
			this.graph.onchange.forEach(f => f());
		};
		const valley = function() {
			this.graph.edges_assignment[index] = "V";
			this.graph.edges_foldAngle[index] = 180;
			this.graph.onchange.forEach(f => f());
		};
		const mark = function() {
			this.graph.edges_assignment[index] = "F";
			this.graph.edges_foldAngle[index] = 0;
			this.graph.onchange.forEach(f => f());
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
		Object.defineProperty(_this, "addVertexOnEdge", {configurable: true, value: addVertexOnEdge});
		return _this;
	};
	const Crease = function(_graph, _indices) {
		let graph = _graph;
		let indices = _indices;
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
			else { return; }
			graph.onchange.forEach(f => f());
		};
		const mountain = function() {
			indices.forEach(index => graph.edges_assignment[index] = "M");
			indices.forEach(index => graph.edges_foldAngle[index] = -180);
			graph.onchange.forEach(f => f());
		};
		const valley = function() {
			indices.forEach(index => graph.edges_assignment[index] = "V");
			indices.forEach(index => graph.edges_foldAngle[index] = 180);
			graph.onchange.forEach(f => f());
		};
		const mark = function() {
			indices.forEach(index => graph.edges_assignment[index] = "F");
			indices.forEach(index => graph.edges_foldAngle[index] = 0);
			graph.onchange.forEach(f => f());
		};
		const remove = function() { };
		return {
			mountain,
			valley,
			mark,
			flip,
			get isMountain(){ return is_mountain(); },
			get isValley(){ return is_valley(); },
			remove
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
	const square = function(width, height) {
		return Object.assign(
			Object.create(null),
			template(),
			cp_type(),
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
			cp_type(),
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
			vertices_coords: arr.map((_,i) => angle * i).map(a => [
				clean_number$1(radius*Math.cos(a)),
				clean_number$1(radius*Math.sin(a))
			]),
			vertices_vertices: arr
				.map((_,i) => [(i+1)%arr.length, (i+arr.length-1)%arr.length]),
			vertices_faces: arr.map(_ => [0]),
			edges_vertices: arr.map((_,i) => [i, (i+1)%arr.length]),
			edges_faces: arr.map(_ => [0]),
			edges_assignment: arr.map(_ => "B"),
			edges_foldAngle: arr.map(_ => 0),
			edges_length: arr.map(_ => sideLength),
			faces_vertices: [arr.map((_,i) => i)],
			faces_edges: [arr.map((_,i) => i)],
		};
		return Object.assign(
			Object.create(null),
			template(),
			cp_type(),
			graph
		);
	};

	const Prototype = function(proto) {
		if(proto == null) {
			proto = {};
		}
		let components = {
			vertices: [],
			edges: [],
			faces: [],
		};
		let _this;
		const bind = function(that) {
			_this = that;
		};
		const clean = function() {
			remove_duplicate_edges(_this);
			convert$1.edges_vertices_to_vertices_vertices_sorted(_this);
			convert$1.vertices_vertices_to_faces_vertices(_this);
			convert$1.faces_vertices_to_faces_edges(_this);
		};
		const load = function(file, prevent_wipe) {
			if (prevent_wipe == null || prevent_wipe !== true) {
				all_keys.forEach(key => delete _this[key]);
			}
			Object.assign(_this, JSON.parse(JSON.stringify(file)));
		};
		const copy = function() {
			return CreasePattern(JSON.parse(JSON.stringify(_this)));
		};
		const clear = function() {
			remove_non_boundary_edges(_this);
			_this.onchange.forEach(f => f());
		};
		const json = function() {
			return convert$1.toJSON(_this);
		};
		const svg = function(cssRules) {
		};
		const oripa = function() {
			return toORIPA(_this);
		};
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
		};
		const getFaces = function() {
			components.faces
				.filter(f => f.disable !== undefined)
				.forEach(f => f.disable());
			components.faces = (_this.faces_vertices || [])
				.map((_,i) => Face(_this, i));
			return components.faces;
		};
		const getBoundary = function() {
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
		const didModifyGraph = function() {
			_this.onchange.forEach(f => f());
		};
		const valleyFold = function(point, vector, face_index) {
			if (!is_vector(point)
				|| !is_vector(vector)
				|| !is_number(face_index)) {
				console.warn("valleyFold was not supplied the correct parameters");
				return;
			}
			let folded = crease_through_layers(_this,
				point,
				vector,
				face_index,
				"V");
			Object.keys(folded).forEach(key => _this[key] = folded[key]);
			delete _this["faces_re:matrix"];
			didModifyGraph();
		};
		const crease = function() {
			let o = Array.from(arguments)
				.filter(el => typeof el === "object" && el !== null)
				.shift();
			if (o !== undefined) {
				if ("point" in o && "vector" in o) {
					let c = Crease(this, crease_line(_this, o.point, o.vector));
					didModifyGraph();
					return c;
				}
			}
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
			let diff = creaseSegment(_this, ...arguments);
			if (diff === undefined) { return; }
			if (diff.edges_index_map != null) {
				Object.keys(diff.edges_index_map)
					.forEach(i => _this.edges_assignment[i] =
						_this.edges_assignment[ diff.edges_index_map[i] ]);
			}
			let edges_remove_count = (diff.edges_to_remove != null)
				? diff.edges_to_remove.length : 0;
			if (diff.edges_to_remove != null) {
				diff.edges_to_remove.slice()
					.sort((a,b) => b-a)
					.forEach(i => {
						_this.edges_vertices.splice(i, 1);
						_this.edges_assignment.splice(i, 1);
					});
			}
			let crease = Crease(this, [diff.edges_new[0] - edges_remove_count]);
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
		Object.defineProperty(proto, "clean", { value: clean });
		Object.defineProperty(proto, "load", { value: load });
		Object.defineProperty(proto, "copy", { value: copy });
		Object.defineProperty(proto, "bind", { value: bind });
		Object.defineProperty(proto, "json", { get: json });
		Object.defineProperty(proto, "nearestVertex", { value: nearestVertex });
		Object.defineProperty(proto, "nearestEdge", { value: nearestEdge });
		Object.defineProperty(proto, "nearestFace", { value: nearestFace });
		Object.defineProperty(proto, "svg", { value: svg });
		Object.defineProperty(proto, "oripa", { value: oripa });
		Object.defineProperty(proto, "axiom1", { value: axiom1 });
		Object.defineProperty(proto, "axiom2", { value: axiom2 });
		Object.defineProperty(proto, "axiom3", { value: axiom3 });
		Object.defineProperty(proto, "axiom4", { value: axiom4 });
		Object.defineProperty(proto, "axiom5", { value: axiom5 });
		Object.defineProperty(proto, "axiom6", { value: axiom6 });
		Object.defineProperty(proto, "axiom7", { value: axiom7 });
		Object.defineProperty(proto, "valleyFold", { value: valleyFold });
		Object.defineProperty(proto, "addVertexOnEdge", { value: addVertexOnEdge });
		Object.defineProperty(proto, "crease", { value: crease });
		Object.defineProperty(proto, "creaseLine", { value: creaseLine });
		Object.defineProperty(proto, "creaseRay", { value: creaseRay$$1 });
		Object.defineProperty(proto, "creaseSegment", { value: creaseSegment$$1 });
		Object.defineProperty(proto, "creaseThroughLayers", {
			value: creaseThroughLayers
		});
		Object.defineProperty(proto, "kawasaki", { value: kawasaki });
		proto.onchange = [];
		proto.__rabbit_ear = RabbitEar;
		return Object.freeze(proto);
	};
	const validFoldObject = function(fold) {
		let keys1_1 = ["file_spec","file_creator","file_author","file_title","file_description","file_classes","file_frames","frame_author","frame_title","frame_description","frame_attributes","frame_classes","frame_unit","vertices_coords","vertices_vertices","vertices_faces","edges_vertices","edges_faces","edges_assignment","edges_foldAngle","edges_length","faces_vertices","faces_edges","edgeOrders","faceOrders"];
		let argKeys = Object.keys(fold);
		for(var i = 0; i < argKeys.length; i++) {
			if (keys1_1.includes(argKeys[i])) { return true; }
		}
		return false;
	};
	const CreasePattern = function() {
		let proto = Prototype();
		let graph = Object.create(proto);
		proto.bind(graph);
		let foldObjs = Array.from(arguments)
			.filter(el => typeof el === "object" && el !== null)
			.filter(el => validFoldObject(el));
		graph.load( (foldObjs.shift() || square()) );
		return graph;
	};
	CreasePattern.square = function() {
		return CreasePattern(rectangle(1, 1));
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

	const DEFAULTS = Object.freeze({
		autofit: true,
		debug: false,
		folding: false,
		padding: 0,
		shadows: false,
		labels: false
	});
	const DISPLAY_NAME$1 = {
		vertices: "vertices",
		edges: "creases",
		faces: "faces",
		boundaries: "boundaries"
	};
	const drawComponent = {
		vertices: convert$2.core.svgVertices,
		edges: convert$2.core.svgEdges,
		faces: convert$2.core.svgFacesVertices,
		boundaries: convert$2.core.svgBoundaries
	};
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
	function Origami$1() {
		let _this = image(...arguments);
		_this.appendChild(shadowFilter$1("faces_shadow"));
		let groups = {};
		["boundaries", "faces", "edges", "vertices"].forEach(key => {
			groups[key] = _this.group();
			groups[key].setAttribute("class", DISPLAY_NAME$1[key]);
			groups[key].setAttribute("pointer-events", "none");
			_this.appendChild(groups[key]);
		});
		let visible = ["boundaries", "faces", "edges"];
		let groupLabels = _this.group();
		let prop = {
			cp: undefined,
			frame: undefined,
			style: {
				vertex_radius: 0.01
			},
		};
		let preferences = {};
		Object.assign(preferences, DEFAULTS);
		let userDefaults = parsePreferences(...arguments);
		Object.keys(userDefaults)
			.forEach(key => preferences[key] = userDefaults[key]);
		const setCreasePattern = function(cp, frame = undefined) {
			prop.cp = (cp.__rabbit_ear != null)
				? cp
				: CreasePattern(cp);
			prop.frame = frame;
			draw();
			if (!preferences.autofit) { updateViewBox(); }
			prop.cp.onchange.push(draw);
		};
		const isFolded = function(graph) {
			if (graph.frame_classes == null) { return false; }
			return graph.frame_classes.includes("foldedForm");
		};
		const draw = function() {
			let graph = prop.frame
				? flatten_frame(prop.cp, prop.frame)
				: prop.cp;
			let file_classes = (graph.file_classes != null
				? graph.file_classes : []).join(" ");
			let frame_classes = graph.frame_classes != null
				? graph.frame_classes : [].join(" ");
			let top_level_classes = [file_classes, frame_classes]
				.filter(s => s !== "")
				.join(" ");
			_this.setAttribute("class", top_level_classes);
			visible = isFolded(graph)
				? ["faces", "edges"]
				: ["boundaries", "faces", "edges"];
			Object.keys(groups).forEach(key => groups[key].removeChildren());
			groupLabels.removeChildren();
			visible.forEach(key =>
				drawComponent[key](graph).forEach(o =>
					groups[key].appendChild(o)
				)
			);
			if (preferences.debug) { drawDebug(graph); }
			if (preferences.labels) { drawLabels(graph); }
			if (preferences.autofit) { updateViewBox(); }
			if (preferences.shadows) {
				Array.from(groups.faces.childNodes).forEach(f =>
					f.setAttribute("filter", "url(#faces_shadow)")
				);
			}
			let styleElement = _this.querySelector("style");
			if (styleElement == null) {
				const svgNS = "http://www.w3.org/2000/svg";
				styleElement = document.createElementNS(svgNS, "style");
				_this.appendChild(styleElement);
			}
			let r = bounding_rect(graph);
			let vmin = r[2] > r[3] ? r[3] : r[2];
			let creaseStyle = "stroke-width:" + vmin*0.005;
			styleElement.innerHTML = "#creases line {" + creaseStyle + "}";
		};
		const drawLabels = function(graph) {
			if ("faces_vertices" in graph === false ||
			    "edges_vertices" in graph === false ||
			    "vertices_coords" in graph === false) { return; }
			let r = bounding_rect(graph);
			let vmin = r[2] > r[3] ? r[3] : r[2];
			let fSize = vmin*0.04;
			let labels_style = {
				vertices: "fill:#27b;font-family:sans-serif;font-size:"+fSize+"px;",
				edges: "fill:#e53;font-family:sans-serif;font-size:"+fSize+"px;",
				faces: "fill:black;font-family:sans-serif;font-size:"+fSize+"px;",
			};
			let m = [fSize*0.33, fSize*0.4];
			graph.vertices_coords
				.map((v,i) => groupLabels.text(""+i, v[0]-m[0], v[1]+m[1]))
				.forEach(t => t.setAttribute("style", labels_style.vertices));
			graph.edges_vertices
				.map(ev => ev.map(v => graph.vertices_coords[v]))
				.map(verts => core.average(verts))
				.map((c,i) => groupLabels.text(""+i, c[0]-m[0], c[1]+m[1]))
				.forEach(t => t.setAttribute("style", labels_style.edges));
			graph.faces_vertices
				.map(fv => fv.map(v => graph.vertices_coords[v]))
				.map(verts => core.average(verts))
				.map((c,i) => groupLabels.text(""+i, c[0]-m[0], c[1]+m[1]))
				.forEach(t => t.setAttribute("style", labels_style.faces));
		};
		const drawDebug = function(graph) {
			let r = bounding_rect(graph);
			let vmin = r[2] > r[3] ? r[3] : r[2];
			let strokeW = vmin*0.005;
			let debug_style = {
				faces_vertices: "fill:none;stroke:#27b;stroke-width:"+strokeW+";",
				faces_edges: "fill:none;stroke:#e53;stroke-width:"+strokeW+";",
			};
			graph.faces_vertices
				.map(fv => fv.map(v => graph.vertices_coords[v]))
				.map(face => ConvexPolygon(face).scale(0.866).points)
				.map(points => groupLabels.polygon(points))
				.forEach(poly => poly.setAttribute("style", debug_style.faces_vertices));
			graph.faces_edges
				.map(face_edges => face_edges
					.map(edge => graph.edges_vertices[edge])
					.map((vi, i, arr) => {
						let next = arr[(i+1)%arr.length];
						return (vi[1] === next[0] || vi[1] === next[1] ? vi[0] : vi[1]);
					}).map(v => graph.vertices_coords[v])
				).map(face => ConvexPolygon(face).scale(0.75).points)
				.map(points => groupLabels.polygon(points))
				.forEach(poly => poly.setAttribute("style", debug_style.faces_edges));
		};
		const updateViewBox = function() {
			let graph = prop.frame
				? flatten_frame(prop.cp, prop.frame)
				: prop.cp;
			let r = bounding_rect(graph);
			let vmin = r[2] > r[3] ? r[3] : r[2];
			setViewBox(_this, r[0], r[1], r[2], r[3], preferences.padding * vmin);
		};
		const nearest = function() {
			let p = Vector(...arguments);
			let methods = {
				"vertices": prop.cp.nearestVertex,
				"creases": prop.cp.nearestEdge,
				"faces": prop.cp.nearestFace,
			};
			let nearest = {};
			Object.keys(methods)
				.forEach(key => nearest[key] = methods[key].apply(prop.cp, p));
			Object.keys(methods)
				.filter(key => methods[key] == null)
				.forEach(key => delete methods[key]);
			Object.keys(nearest)
				.filter(key => nearest[key] != null)
				.forEach(key =>
					nearest[key].svg = groups[key].childNodes[nearest[key].index]
				);
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
		};
		const getBoundary = function() {
			let graph = prop.frame
				? flatten_frame(prop.cp, prop.frame)
				: prop.cp;
			return Polygon(
				get_boundary_face(graph)
					.vertices
					.map(v => graph.vertices_coords[v])
			);
		};
		const load$$1 = function(input, callback) {
			load_file(input, function(fold) {
				setCreasePattern( CreasePattern(fold) );
				if (callback != null) { callback(); }
			});
		};
		const fold = function(face) {
			if (prop.cp.file_frames != null
				&& prop.cp.file_frames.length > 0
				&& prop.cp.file_frames[0]["faces_re:matrix"] != null
				&& prop.cp.file_frames[0]["faces_re:matrix"].length
					=== prop.cp.faces_vertices.length) ; else {
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
				if (prop.cp.file_frames === undefined) {
					return [JSON.parse(JSON.stringify(prop.cp))];
				}
				let frameZero = JSON.parse(JSON.stringify(prop.cp));
				delete frameZero.file_frames;
				let frames = JSON.parse(JSON.stringify(prop.cp.file_frames));
				return [frameZero].concat(frames);
			}
		});
		Object.defineProperty(_this, "frame", {
			get: function() { return prop.frame; },
			set: function(newValue) {
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
			get: function() { return prop.cp.file_frames
				? prop.cp.file_frames.length
				: 0;
			}
		});
		["axiom1", "axiom2", "axiom3", "axiom4", "axiom5", "axiom6", "axiom7",
		 "crease"]
			.forEach(method => Object.defineProperty(_this, method, {
				value: function(){ return prop.cp[method](...arguments); }
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
		Object.defineProperty(_this, "boundary", {
			get: function(){ return getBoundary(); }
		});
		Object.defineProperty(_this, "draw", { value: draw });
		Object.defineProperty(_this, "fold", { value: fold });
		Object.defineProperty(_this, "foldWithoutLayering", {
			value: foldWithoutLayering
		});
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
		Object.defineProperty(_this, "updateViewBox", { value: updateViewBox });
		_this.preferences = preferences;
		setCreasePattern( CreasePattern(...arguments), 1 );
		let prevCP, prevCPFolded, touchFaceIndex;
		_this.events.addEventListener("onMouseDown", function(mouse) {
			if (preferences.folding) {
				try {
					prevCP = JSON.parse(JSON.stringify(prop.cp));
					if (prop.frame == null
						|| prop.frame === 0
						|| prevCP.file_frames == null) {
						let file_frame = build_folded_frame(prevCP, 0);
						if (prevCP.file_frames == null) { prevCP.file_frames = []; }
						prevCP.file_frames.unshift(file_frame);
					}
					prevCPFolded = flatten_frame(prevCP, 1);
					let faces_containing = faces_containing_point(prevCPFolded, mouse);
					let top_face = topmost_face$1(prevCPFolded, faces_containing);
					touchFaceIndex = (top_face == null)
						? 0
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
	}const shadowFilter$1 = function(id_name = "shadow") {
		const svgNS = "http://www.w3.org/2000/svg";
		let defs = document.createElementNS(svgNS, "defs");
		let filter = document.createElementNS(svgNS, "filter");
		filter.setAttribute("width", "200%");
		filter.setAttribute("height", "200%");
		filter.setAttribute("id", id_name);
		let blur = document.createElementNS(svgNS, "feGaussianBlur");
		blur.setAttribute("in", "SourceAlpha");
		blur.setAttribute("stdDeviation", "0.01");
		blur.setAttribute("result", "blur");
		let offset = document.createElementNS(svgNS, "feOffset");
		offset.setAttribute("in", "blur");
		offset.setAttribute("result", "offsetBlur");
		let flood = document.createElementNS(svgNS, "feFlood");
		flood.setAttribute("flood-color", "#000");
		flood.setAttribute("flood-opacity", "0.4");
		flood.setAttribute("result", "offsetColor");
		let composite = document.createElementNS(svgNS, "feComposite");
		composite.setAttribute("in", "offsetColor");
		composite.setAttribute("in2", "offsetBlur");
		composite.setAttribute("operator", "in");
		composite.setAttribute("result", "offsetBlur");
		let merge = document.createElementNS(svgNS, "feMerge");
		let mergeNode1 = document.createElementNS(svgNS, "feMergeNode");
		let mergeNode2 = document.createElementNS(svgNS, "feMergeNode");
		mergeNode2.setAttribute("in", "SourceGraphic");
		merge.appendChild(mergeNode1);
		merge.appendChild(mergeNode2);
		defs.appendChild(filter);
		filter.appendChild(blur);
		filter.appendChild(offset);
		filter.appendChild(flood);
		filter.appendChild(composite);
		filter.appendChild(merge);
		return defs;
	};

	const unitSquare = {"file_spec":1.1,"file_creator":"","file_author":"","file_classes":["singleModel"],"frame_title":"","frame_attributes":["2D"],"frame_classes":["creasePattern"],"vertices_coords":[[0,0],[1,0],[1,1],[0,1]],"vertices_vertices":[[1,3],[2,0],[3,1],[0,2]],"vertices_faces":[[0],[0],[0],[0]],"edges_vertices":[[0,1],[1,2],[2,3],[3,0]],"edges_faces":[[0],[0],[0],[0]],"edges_assignment":["B","B","B","B"],"edges_foldAngle":[0,0,0,0],"edges_length":[1,1,1,1],"faces_vertices":[[0,1,2,3]],"faces_edges":[[0,1,2,3]]};
	function View3D(){
		let args = Array.from(arguments);
		let allMeshes = [];
		let scene = new THREE.Scene();
		let _parent;
		let prop = {
			cp: undefined,
			frame: undefined,
			style: {
				vertex_radius: 0.01
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
			camera.position.set(-0.75, 2, -0.025);
			controls.target.set(0.0, 0.0, 0.0);
			controls.addEventListener('change', render);
			var renderer = new THREE.WebGLRenderer({antialias:true});
			if (window.devicePixelRatio !== 1) {
				renderer.setPixelRatio(window.devicePixelRatio);
			}
			renderer.setClearColor("#FFFFFF");
			renderer.setSize(domParent.clientWidth, domParent.clientHeight);
			domParent.appendChild(renderer.domElement);
			var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.2);
			directionalLight2.position.set(20, 20, -100);
			scene.add(directionalLight2);
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
			prop.cp = cp;
			draw();
			prop.cp.onchange = draw;
		};
		const load = function(input, callback) {
			load_file(input, function(fold) {
				setCreasePattern( CreasePattern(fold) );
				if (callback != null) { callback(); }
			});
		};
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
			edges.forEach(edge => {
				if(edge[0][2] == undefined){ edge[0][2] = 0; }
				if(edge[1][2] == undefined){ edge[1][2] = 0; }
			});
			let colorAssignments = {
				"B": [0.0,0.0,0.0],
				"M": [0.0,0.0,0.0],
				"F": [0.0,0.0,0.0],
				"V": [0.0,0.0,0.0],
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
				i*8+0, i*8+4, i*8+1,
				i*8+1, i*8+4, i*8+5,
				i*8+1, i*8+5, i*8+2,
				i*8+2, i*8+5, i*8+6,
				i*8+2, i*8+6, i*8+3,
				i*8+3, i*8+6, i*8+7,
				i*8+3, i*8+7, i*8+0,
				i*8+0, i*8+7, i*8+4,
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
	const GraphClean = function(numNodes, numEdges) {
		let clean = Object.create(CleanPrototype());
		clean.nodes = {total:0, isolated:0};
		clean.edges = {total:0, duplicate:0, circular:0};
		if (numNodes != null) { clean.nodes.total = numNodes; }
		if (numEdges != null) { clean.edges.total = numEdges; }
		return clean;
	};
	const GraphNode = function(graph) {
		let node = Object.create(null);
		node.graph = graph;
		const adjacentEdges = function() {
			return node.graph.edges
				.filter((el) => el.nodes[0] === node || el.nodes[1] === node);
		};
		const adjacentNodes = function() {
			let checked = [];
			return adjacentEdges()
				.filter((el) => !el.isCircular)
				.map((el) => (el.nodes[0] === node)
					? el.nodes[1]
					: el.nodes[0])
				.filter((el) =>
					checked.indexOf(el) >= 0 ? false : checked.push(el)
				);
		};
		const adjacent = function() {
			let adj = Object.create(null);
			adj.edges = adjacentEdges();
			let checked = [];
			adj.nodes = adj.edges.filter((el) => !el.isCircular)
				.map((el) => (el.nodes[0] === node)
					? el.nodes[1]
					: el.nodes[0])
				.filter((el) =>
					checked.indexOf(el) >= 0 ? false : checked.push(el)
				);
			return adj;
		};
		const isAdjacentToNode = function(n) {
			return adjacentNodes.filter(node => node === n).length > 0;
		};
		const degree = function() {
			return node.graph.edges.map((el) =>
				el.nodes.map(n => n === node ? 1 : 0).reduce((a,b) => a + b, 0)
			).reduce((a, b) => a + b, 0);
		};
		Object.defineProperty(node, "adjacent", {
			get: function() { return adjacent(); }
		});
		Object.defineProperty(node, "degree", {get:function() { return degree(); }});
		Object.defineProperty(node, "isAdjacentToNode", {value: isAdjacentToNode });
		return node;
	};
	const GraphEdge = function(graph, node1, node2) {
		let edge = Object.create(null);
		edge.graph = graph;
		edge.nodes = [node1, node2];
		const adjacentEdges = function() {
			return edge.graph.edges.filter((e) => e !== edge &&
				(e.nodes[0] === edge.nodes[0] ||
				 e.nodes[0] === edge.nodes[1] ||
				 e.nodes[1] === edge.nodes[0] ||
				 e.nodes[1] === edge.nodes[1])
			)
		};
		const adjacentNodes = function() { return [...edge.nodes]; };
		const adjacent = function() {
			let adj = Object.create(null);
			adj.nodes = adjacentNodes();
			adj.edges = adjacentEdges();
			return adj;
		};
		const isAdjacentToEdge = function(e) {
			return( (edge.nodes[0] === e.nodes[0]) || (edge.nodes[1] === e.nodes[1]) ||
			        (edge.nodes[0] === e.nodes[1]) || (edge.nodes[1] === e.nodes[0]) );
		};
		const isSimilarToEdge = function(e) {
			return( (edge.nodes[0] === e.nodes[0] && edge.nodes[1] === e.nodes[1] ) ||
			        (edge.nodes[0] === e.nodes[1] && edge.nodes[1] === e.nodes[0] ) );
		};
		const otherNode = function(n) {
			if (edge.nodes[0] === n) { return edge.nodes[1]; }
			if (edge.nodes[1] === n) { return edge.nodes[0]; }
			return undefined;
		};
		const isCircular = function() {
			return edge.nodes[0] === edge.nodes[1];
		};
		const duplicateEdges = function() {
			return edge.graph.edges.filter((el) => edge.isSimilarToEdge(el));
		};
		const commonNodeWithEdge = function(otherEdge) {
			if (edge === otherEdge) {
				return undefined;
			}
			if (edge.nodes[0] === otherEdge.nodes[0] ||
			    edge.nodes[0] === otherEdge.nodes[1] ) {
				return edge.nodes[0];
			}
			if (edge.nodes[1] === otherEdge.nodes[0] ||
			    edge.nodes[1] === otherEdge.nodes[1] ) {
				return edge.nodes[1];
			}
			return undefined;
		};
		const uncommonNodeWithEdge = function(otherEdge) {
			if (edge === otherEdge) { return undefined; }
			if (edge.nodes[0] === otherEdge.nodes[0] ||
			    edge.nodes[0] === otherEdge.nodes[1] ) {
				return edge.nodes[1];
			}
			if (edge.nodes[1] === otherEdge.nodes[0] ||
			    edge.nodes[1] === otherEdge.nodes[1] ) {
				return edge.nodes[0];
			}
			return undefined;
		};
		Object.defineProperty(edge, "adjacent", {
			get:function() { return adjacent(); }
		});
		Object.defineProperty(edge, "isAdjacentToEdge", {value: isAdjacentToEdge});
		Object.defineProperty(edge, "isSimilarToEdge", {value: isSimilarToEdge});
		Object.defineProperty(edge, "otherNode", {value: otherNode});
		Object.defineProperty(edge, "isCircular", {
			get:function() { return isCircular(); }
		});
		Object.defineProperty(edge, "duplicateEdges", {value: duplicateEdges});
		Object.defineProperty(edge, "commonNodeWithEdge", {
			value: commonNodeWithEdge
		});
		Object.defineProperty(edge, "uncommonNodeWithEdge", {
			value: uncommonNodeWithEdge
		});
		return edge;
	};
	const Graph$1 = function() {
		let graph = Object.create(null);
		graph.nodes = [];
		graph.edges = [];
		graph.types = {
			node: GraphNode,
			edge: GraphEdge
		};
		const newNode = function() {
			let node = graph.types.node(graph);
			Object.assign(node, ...arguments);
			node.graph = graph;
			graph.nodes.push(node);
			return node;
		};
		const newEdge = function(node1, node2) {
			let edge = graph.types.edge(graph, node1, node2);
			edge.graph = graph;
			graph.edges.push(edge);
			return edge;
		};
		const clear = function() {
			graph.nodes = [];
			graph.edges = [];
			return graph;
		};
		const removeEdge = function(edge) {
			var edgesLength = graph.edges.length;
			graph.edges = graph.edges.filter((el) => el !== edge);
			return GraphClean(undefined, edgesLength - graph.edges.length);
		};
		const removeEdgeBetween = function(node1, node2) {
			var edgesLength = graph.edges.length;
			graph.edges = graph.edges.filter((el) =>
				!((el.nodes[0] === node1 && el.nodes[1] === node2) ||
				  (el.nodes[0] === node2 && el.nodes[1] === node1) )
			);
			return GraphClean(undefined, edgesLength - graph.edges.length);
		};
		const removeNode = function(node) {
			var nodesLength = graph.nodes.length;
			var edgesLength = graph.edges.length;
			graph.nodes = graph.nodes.filter((n) => n !== node);
			graph.edges = graph.edges
				.filter((e) => e.nodes[0] !== node && e.nodes[1] !== node);
			return GraphClean(
				nodesLength-graph.nodes.length,
				edgesLength-graph.edges.length
			);
		};
		const mergeNodes = function(node1, node2) {
			if (node1 === node2) { return undefined; }
			graph.edges.forEach((edge) => {
				if (edge.nodes[0] === node2) { edge.nodes[0] = node1; }
				if (edge.nodes[1] === node2) { edge.nodes[1] = node1; }
			});
			var nodesLength = graph.nodes.length;
			graph.nodes = graph.nodes.filter((n) => n !== node2);
			return GraphClean(nodesLength - graph.nodes.length).join(clean());
		};
		const removeIsolatedNodes = function() {
			var nodeDegree = Array(graph.nodes.length).fill(false);
			graph.nodes.forEach((n,i) => n._memo = i);
			graph.edges.forEach(e => {
				nodeDegree[e.nodes[0]._memo] = true;
				nodeDegree[e.nodes[1]._memo] = true;
			});
			graph.nodes.forEach((n,i) => delete n._memo);
			var nodeLength = graph.nodes.length;
			graph.nodes = graph.nodes.filter((el,i) => nodeDegree[i]);
			return GraphClean().isolatedNodes(nodeLength - graph.nodes.length);
		};
		const removeCircularEdges = function() {
			var edgesLength = graph.edges.length;
			graph.edges = graph.edges.filter((el) => el.nodes[0] !== el.nodes[1]);
			return GraphClean().circularEdges(edgesLength - graph.edges.length);
		};
		const removeDuplicateEdges = function() {
			var count = 0;
			for (var i = 0; i < graph.edges.length-1; i++) {
				for (var j = graph.edges.length-1; j > i; j--) {
					if (graph.edges[i].isSimilarToEdge(graph.edges[j])) {
						graph.edges.splice(j, 1);
						count += 1;
					}
				}
			}
			return GraphClean().duplicateEdges(count);
		};
		const clean = function() {
			return removeDuplicateEdges()
				.join(removeCircularEdges());
		};
		const getEdgeConnectingNodes = function(node1, node2) {
			let edges = graph.edges;
			for (var i = 0; i < edges.length; i++) {
				if ((edges[i].nodes[0] === node1 && edges[i].nodes[1] === node2 ) ||
				    (edges[i].nodes[0] === node2 && edges[i].nodes[1] === node1 ) ) {
					return edges[i];
				}
			}
			return undefined;
		};
		const getEdgesConnectingNodes = function(node1, node2) {
			return graph.edges.filter((e) =>
				(e.nodes[0] === node1 && e.nodes[1] === node2 ) ||
				(e.nodes[0] === node2 && e.nodes[1] === node1 )
			);
		};
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
		Object.defineProperty(graph, "newNode", {value: newNode});
		Object.defineProperty(graph, "newEdge", {value: newEdge});
		Object.defineProperty(graph, "clear", {value: clear});
		Object.defineProperty(graph, "removeEdge", {value: removeEdge});
		Object.defineProperty(graph, "removeEdgeBetween", {
			value: removeEdgeBetween
		});
		Object.defineProperty(graph, "removeNode", {value: removeNode});
		Object.defineProperty(graph, "mergeNodes", {value: mergeNodes});
		Object.defineProperty(graph, "removeIsolatedNodes", {
			value: removeIsolatedNodes
		});
		Object.defineProperty(graph, "removeCircularEdges", {
			value: removeCircularEdges
		});
		Object.defineProperty(graph, "removeDuplicateEdges", {
			value: removeDuplicateEdges
		});
		Object.defineProperty(graph, "clean", {value: clean});
		Object.defineProperty(graph, "getEdgeConnectingNodes", {
			value: getEdgeConnectingNodes
		});
		Object.defineProperty(graph, "getEdgesConnectingNodes", {
			value: getEdgesConnectingNodes
		});
		Object.defineProperty(graph, "copy", {value: copy});
		Object.defineProperty(graph, "eulerianPaths", {value: connectedGraphs});
		return graph;
	};

	const makeCrease = function(point, vector) {
		let crease = [point, vector];
		crease.point = point;
		crease.vector = vector;
		return crease;
	};
	const axiom = function(number, parameters) {
		let params = Array(...arguments);
		params.shift();
		switch(number) {
			case 1: return axiom1$1(...params);
			case 2: return axiom2$1(...params);
			case 3: return axiom3$1(...params);
			case 4: return axiom4$1(...params);
			case 5: return axiom5$1(...params);
			case 6: return axiom6$1(...params);
			case 7: return axiom7$1(...params);
		}
	};
	const axiom1$1 = function(pointA, pointB) {
		let p0 = get_vec$1(pointA);
		let p1 = get_vec$1(pointB);
		let vec = p0.map((_,i) => p1[i] - p0[i]);
		return makeCrease(p0, vec);
	};
	const axiom2$1 = function(a, b) {
		let mid = core.midpoint(a, b);
		let vec = core.normalize(a.map((_,i) => b[i] - a[i]));
		return makeCrease(mid, [vec[1], -vec[0]]);
	};
	const axiom3$1 = function(pointA, vectorA, pointB, vectorB){
		return core.bisect_lines2(pointA, vectorA, pointB, vectorB)
			.map(line => makeCrease(line[0], line[1]));
	};
	const axiom4$1 = function(pointA, vectorA, pointB) {
		let norm = core.normalize(vectorA);
		return makeCrease([...pointB], [norm[1], -norm[0]]);
	};
	const axiom5$1 = function(pointA, vectorA, pointB, pointC) {
		let pA = get_vec$1(pointA);
		let vA = get_vec$1(vectorA);
		let pB = get_vec$1(pointB);
		let pC = get_vec$1(pointC);
		let radius = Math.sqrt(Math.pow(pB[0]-pC[0], 2) + Math.pow(pB[1]-pC[1], 2));
		let pA2 = [pA[0] + vA[0], pA[1] + vA[1]];
		let sect = core.intersection.circle_line(pB, radius, pA, pA2);
		return sect === undefined
			? []
			: sect.map(s => axiom2$1(pC, s));
	};
	const axiom7$1 = function(pointA, vectorA, pointB, vectorB, pointC) {
		let pA = get_vec$1(pointA);
		let pC = get_vec$1(pointC);
		let vA = get_vec$1(vectorA);
		let vB = get_vec$1(vectorB);
		let sect = core.intersection.line_line(pA, vA, pC, vB);
		if(sect === undefined){ return undefined; }
		let mid = core.midpoint(pC, sect);
		let vec = core.normalize(pC.map((_,i) => sect[i] - pC[i]));
		return makeCrease(mid, [vec[1], -vec[0]]);
	};
	const cuberoot = function(x) {
		var y = Math.pow(Math.abs(x), 1/3);
		return x < 0 ? -y : y;
	};
	const solveCubic = function(a, b, c, d) {
		if (Math.abs(a) < 1e-8) {
			a = b; b = c; c = d;
			if (Math.abs(a) < 1e-8) {
				a = b; b = c;
				if (Math.abs(a) < 1e-8){
					return [];
				}
				return [-b/a];
			}
			var D = b*b - 4*a*c;
			if (Math.abs(D) < 1e-8){
				return [-b/(2*a)];
			}
			else if (D > 0){
				return [(-b+Math.sqrt(D))/(2*a), (-b-Math.sqrt(D))/(2*a)];
			}
			return [];
		}
		var p = (3*a*c - b*b)/(3*a*a);
		var q = (2*b*b*b - 9*a*b*c + 27*a*a*d)/(27*a*a*a);
		var roots;
		if (Math.abs(p) < 1e-8) {
			roots = [cuberoot(-q)];
		} else if (Math.abs(q) < 1e-8) {
			roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
		} else {
			var D = q*q/4 + p*p*p/27;
			if (Math.abs(D) < 1e-8) {
				roots = [-1.5*q/p, 3*q/p];
			} else if (D > 0) {
				var u = cuberoot(-q/2 - Math.sqrt(D));
				roots = [u - p/(3*u)];
			} else {
				var u = 2*Math.sqrt(-p/3);
				var t = Math.acos(3*q/p/u)/3;
				var k = 2*Math.PI/3;
				roots = [u*Math.cos(t), u*Math.cos(t-k), u*Math.cos(t-2*k)];
			}
		}
		for (var i = 0; i < roots.length; i++){
			roots[i] -= b/(3*a);
		}
		return roots;
	};
	const axiom6$1 = function(pointA, vecA, pointB, vecB, pointC, pointD) {
		var p1 = pointC[0];
		var q1 = pointC[1];
		if (Math.abs(vecA[0]) > core.EPSILON) {
			var m1 = vecA[1] / vecA[0];
			var h1 = pointA[1] - m1 * pointA[0];
		}
		else {
			var k1 = pointA[0];
		}
		var p2 = pointD[0];
		var q2 = pointD[1];
		if (Math.abs(vecB[0]) > core.EPSILON) {
			var m2 = vecB[1] / vecB[0];
			var h2 = pointB[1] - m2 * pointB[0];
		}
		else {
			var k2 = pointB[0];
		}
		if (m1 !== undefined && m2 !== undefined) {
			var a1 = m1*m1 + 1;
			var b1 = 2*m1*h1;
			var c1 = h1*h1 - p1*p1 - q1*q1;
			var a2 = m2*m2 + 1;
			var b2 = 2*m2*h2;
			var c2 =  h2*h2 - p2*p2 - q2*q2;
			var a0 = m2*p1 + (h1 - q1);
			var b0 = p1*(h2 - q2) - p2*(h1 - q1);
			var c0 = m2 - m1;
			var d0 = m1*p2 + (h2 - q2);
			var z = m1*p1 + (h1 - q1);
		}
		else if (m1 === undefined && m2 === undefined) {
			a1 = 1;
			b1 = 0;
			c1 = k1*k1 - p1*p1 - q1*q1;
			a2 = 1;
			b2 = 0;
			c2 = k2*k2 - p2*p2 - q2*q2;
			a0 = k1 - p1;
			b0 = q1*(k2 - p2) - q2*(k1 - p1);
			c0 = 0;
			d0 = k2 - p2;
			z = a0;
		}
		else {
			if (m1 === undefined) {
				var p3 = p1;
				p1 = p2;
				p2 = p3;
				var q3 = q1;
				q1 = q2;
				q2 = q3;
				m1 = m2;
				m2 = undefined;
				h1 = h2;
				h2 = undefined;
				k2 = k1;
				k1 = undefined;
			}
			a1 = m1*m1 + 1;
			b1 = 2*m1*h1;
			c1 = h1*h1 - p1*p1 - q1*q1;
			a2 = 1;
			b2 = 0;
			c2 = k2*k2 - p2*p2 - q2*q2;
			a0 = p1;
			b0 = (h1 - q1)*(k2 - p2) - p1*q2;
			c0 = 1;
			d0 = -m1*(k2 - p2) - q2;
			z = m1*p1 + (h1 - q1);
		}
		var a3 = a1*a0*a0 + b1*a0*c0 + c1*c0*c0;
		var b3 = 2*a1*a0*b0 + b1*(a0*d0 + b0*c0) + 2*c1*c0*d0;
		var c3 = a1*b0*b0 + b1*b0*d0 + c1*d0*d0;
		var a4 = a2*c0*z;
		var b4 = (a2*d0 + b2*c0) * z - a3;
		var c4 = (b2*d0 + c2*c0) * z - b3;
		var d4 =  c2*d0*z - c3;
		var roots = solveCubic(a4,b4,c4,d4);
		var lines = [];
		if (roots != undefined && roots.length > 0) {
			for (var i = 0; i < roots.length; ++i) {
				if (m1 !== undefined && m2 !== undefined) {
					var u2 = roots[i];
					var v2 = m2*u2 + h2;
				}
				else if (m1 === undefined && m2 === undefined) {
					v2 = roots[i];
					u2 = k2;
				}
				else {
					v2 = roots[i];
					u2 = k2;
				}
				if (v2 != q2) {
					var mF = -1*(u2 - p2)/(v2 - q2);
					var hF = (v2*v2 - q2*q2 + u2*u2 - p2*p2) / (2 * (v2 - q2));
					lines.push(makeCrease([0, hF], [1, mF]));
				}
				else {
					var kG = (u2 + p2)/2;
					lines.push(makeCrease([kG, 0], [0, 1]));
				}
			}
		}
		return lines;
	};

	var empty = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_title\": \"\",\n\t\"file_description\": \"\",\n\t\"file_classes\": [],\n\t\"file_frames\": [],\n\n\t\"frame_author\": \"\",\n\t\"frame_title\": \"\",\n\t\"frame_description\": \"\",\n\t\"frame_attributes\": [],\n\t\"frame_classes\": [],\n\t\"frame_unit\": \"\",\n\n\t\"vertices_coords\": [],\n\t\"vertices_vertices\": [],\n\t\"vertices_faces\": [],\n\n\t\"edges_vertices\": [],\n\t\"edges_faces\": [],\n\t\"edges_assignment\": [],\n\t\"edges_foldAngle\": [],\n\t\"edges_length\": [],\n\n\t\"faces_vertices\": [],\n\t\"faces_edges\": [],\n\n\t\"edgeOrders\": [],\n\t\"faceOrders\": []\n}\n";

	var square$1 = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"\",\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [[0,0], [1,0], [1,1], [0,1]],\n\t\"vertices_vertices\": [[1,3], [2,0], [3,1], [0,2]],\n\t\"vertices_faces\": [[0], [0], [0], [0]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,0]],\n\t\"edges_faces\": [[0], [0], [0], [0]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0],\n\t\"edges_length\": [1, 1, 1, 1],\n\t\"faces_vertices\": [[0,1,2,3]],\n\t\"faces_edges\": [[0,1,2,3]]\n}";

	var book = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"\",\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [[0,0], [0.5,0], [1,0], [1,1], [0.5,1], [0,1]],\n\t\"vertices_vertices\": [[1,5], [2,4,0], [3,1], [4,2], [5,1,3], [0,4]],\n\t\"vertices_faces\": [[0], [0,1], [1], [1], [1,0], [0]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [1,4]],\n\t\"edges_faces\": [[0], [1], [1], [1], [0], [0], [0,1]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"V\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 180],\n\t\"edges_length\": [0.5, 0.5, 1, 0.5, 0.5, 1, 1],\n\t\"faces_vertices\": [[1,4,5,0], [4,1,2,3]],\n\t\"faces_edges\": [[6,4,5,0], [6,1,2,3]]\n}";

	var blintz = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"blintz base\",\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [[0,0], [0.5,0], [1,0], [1,0.5], [1,1], [0.5,1], [0,1], [0,0.5]],\n\t\"vertices_vertices\": [[1,7], [2,3,7,0], [3,1], [4,5,1,2], [5,3], [6,7,3,4], [7,5], [0,1,5,6]],\n\t\"vertices_faces\": [[0], [1,4,0], [1], [2,4,1], [2], [3,4,2], [3], [0,4,3]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,0], [1,3], [3,5], [5,7], [7,1]],\n\t\"edges_faces\": [[0], [1], [1], [2], [2], [3], [3], [0], [1,4], [2,4], [3,4], [0,4]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"V\",\"V\",\"V\",\"V\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n\t\"edges_length\": [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.707106781186548, 0.707106781186548, 0.707106781186548, 0.707106781186548],\n\t\"faces_vertices\": [[0,1,7], [2,3,1], [4,5,3], [6,7,5], [1,3,5,7]],\n\t\"faces_edges\": [[0,11,7], [2,8,1], [4,9,3], [6,10,5], [8,9,10,11]],\n\t\"file_frames\": [{\n\t\t\"frame_classes\": [\"foldedForm\"],\n\t\t\"frame_parent\": 0,\n\t\t\"frame_inherit\": true,\n\t\t\"vertices_coords\": [[0.5,0.5], [0.5,0.0], [0.5,0.5], [1.0,0.5], [0.5,0.5], [0.5,1.0], [0.5,0.5], [0.0,0.5]],\n\t\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 180, 180, 180, 180],\n\t\t\"faceOrders\": [[0,4,1], [1,4,1], [2,4,1], [3,4,1]]\n\t}]\n}";

	var kite = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"kite base\",\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [[0,0], [0.414213562373095,0], [1,0], [1,0.585786437626905], [1,1], [0,1]],\n\t\"vertices_vertices\": [[1,5], [2,5,0], [3,5,1], [4,5,2], [5,3], [0,1,2,3,4]],\n\t\"vertices_faces\": [[0], [1,0], [2,1], [3,2], [3], [0,1,2,3]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [5,1], [3,5], [5,2]],\n\t\"edges_faces\": [[0], [1], [2], [3], [3], [0], [0,1], [3,2], [1,2]],\n\t\"edges_assignment\": [\"B\", \"B\", \"B\", \"B\", \"B\", \"B\", \"V\", \"V\", \"F\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 0],\n\t\"edges_length\": [0.414213562373095, 0.585786437626905, 0.585786437626905, 0.414213562373095, 1, 1, 1.082392200292394, 1.082392200292394, 1.414213562373095],\n\t\"faces_vertices\": [[0,1,5], [1,2,5], [2,3,5], [3,4,5]],\n\t\"faces_edges\": [[0,6,5], [1,8,6], [2,7,8], [3,4,7]],\n\t\"file_frames\": [{\n\t\t\"frame_classes\": [\"foldedForm\"],\n\t\t\"frame_parent\": 0,\n\t\t\"frame_inherit\": true,\n\t\t\"vertices_coords\": [[0.707106781186548,0.292893218813452],[1,0],[0.707106781186548,0.292893218813452],[0,1],[0.414213562373095,0],[1,0.585786437626905]],\n\t\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 180, 180, 0],\n\t\t\"faceOrders\": [[0,1,1], [3,2,1]]\n\t}]\n}";

	var fish = "{\n\t\"this base is broken\": true,\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"\",\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [[0,0],[1,0],[1,1],[0,1],[0.292893218813452,0.292893218813452],[0.707106781186548,0.707106781186548],[0.292893218813452,0],[1,0.707106781186548]],\n\t\"vertices_vertices\": [[6,4,3],[7,5,3,4,6],[3,5,7],[0,4,1,5,2],[0,6,2,3],[1,7,2,3],[1,4,0],[2,5,1]],\n\t\"vertices_faces\":[[1,4],[2,3,5,6],[0,7],[0,1,2,3],[1,3,4,5],[0,2,6,7],[4,5],[6,7]],\n\t\"edges_vertices\": [[2,3],[3,0],[3,1],[0,4],[1,4],[3,4],[1,5],[2,5],[3,5],[4,6],[0,6],[6,1],[5,7],[1,7],[7,2]],\n\t\"edges_faces\":[[0],[0,2],[0,7],[1],[1,4],[1,3],[2,3],[2,6],[3,5],[4],[4,5],[5],[6],[6,7],[7]],\n\t\"edges_length\": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\n\t\"edges_foldAngle\": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\n\t\"edges_assignment\": [\"B\",\"B\",\"F\",\"M\",\"M\",\"M\",\"M\",\"M\",\"M\",\"V\",\"B\",\"B\",\"V\",\"B\",\"B\"],\n\t\"faces_vertices\": [[2,3,5],[3,0,4],[3,1,5],[1,3,4],[4,0,6],[1,4,6],[5,1,7],[2,5,7]],\n\t\"faces_edges\": [[0,8,7],[1,3,5],[2,6,8],[2,5,4],[3,10,9],[4,9,11],[6,13,12],[7,12,14]],\n\t\"file_frames\": [{\n\t\t\"frame_classes\": [\"foldedForm\"],\n\t\t\"frame_parent\": 0,\n\t\t\"frame_inherit\": true,\n\t\t\"vertices_coords\": [[0.707106781186548,0.292893218813452],[1,0],[0.707106781186548,0.292893218813452],[0,1],[0.292893218813452,0.292893218813452],[0.707106781186548,0.707106781186548],[0.5,0.5],[0.5,0.5]]\n\t}]\n}";

	var bird = "{\n\t\"file_spec\": 1.1,\n\t\"frame_title\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [[0,0],[1,0],[1,1],[0,1],[0.5,0.5],[0.207106781186548,0.5],[0.5,0.207106781186548],[0.792893218813452,0.5],[0.5,0.792893218813452],[0.353553390593274,0.646446609406726],[0.646446609406726,0.646446609406726],[0.646446609406726,0.353553390593274],[0.353553390593274,0.353553390593274],[0,0.5],[0.5,0],[1,0.5],[0.5,1]],\n\t\"edges_vertices\": [[3,5],[5,9],[3,9],[3,13],[5,13],[0,5],[0,13],[0,12],[5,12],[4,5],[4,12],[4,9],[0,6],[6,12],[0,14],[6,14],[1,6],[1,14],[1,11],[6,11],[4,6],[4,11],[1,7],[7,11],[1,15],[7,15],[2,7],[2,15],[2,10],[7,10],[4,7],[4,10],[2,8],[8,10],[2,16],[8,16],[3,8],[3,16],[8,9],[4,8]],\n\t\"edges_faces\": [[0,1],[0,5],[21,0],[1],[2,1],[2,3],[2],[3,6],[4,3],[4,5],[11,4],[5,22],[6,7],[6,11],[7],[8,7],[8,9],[8],[9,12],[10,9],[10,11],[17,10],[12,13],[12,17],[13],[14,13],[14,15],[14],[15,18],[16,15],[16,17],[23,16],[18,19],[18,23],[19],[20,19],[20,21],[20],[22,21],[22,23]],\n\t\"edges_assignment\": [\"M\",\"F\",\"V\",\"B\",\"V\",\"M\",\"B\",\"F\",\"F\",\"M\",\"F\",\"V\",\"M\",\"F\",\"B\",\"V\",\"M\",\"B\",\"V\",\"F\",\"M\",\"V\",\"M\",\"F\",\"B\",\"V\",\"M\",\"B\",\"F\",\"F\",\"M\",\"F\",\"M\",\"F\",\"B\",\"V\",\"M\",\"B\",\"F\",\"M\"],\n\t\"faces_vertices\": [[3,5,9],[5,3,13],[0,5,13],[5,0,12],[4,5,12],[5,4,9],[0,6,12],[6,0,14],[1,6,14],[6,1,11],[4,6,11],[6,4,12],[1,7,11],[7,1,15],[2,7,15],[7,2,10],[4,7,10],[7,4,11],[2,8,10],[8,2,16],[3,8,16],[8,3,9],[4,8,9],[8,4,10]],\n\t\"faces_edges\": [[0,1,2],[0,3,4],[5,4,6],[5,7,8],[9,8,10],[9,11,1],[12,13,7],[12,14,15],[16,15,17],[16,18,19],[20,19,21],[20,10,13],[22,23,18],[22,24,25],[26,25,27],[26,28,29],[30,29,31],[30,21,23],[32,33,28],[32,34,35],[36,35,37],[36,2,38],[39,38,11],[39,31,33]]\n}";

	var frog = "{\n\t\"file_spec\": 1.1,\n\t\"frame_title\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [[0,0],[1,0],[1,1],[0,1],[0.5,0.5],[0,0.5],[0.5,0],[1,0.5],[0.5,1],[0.146446609406726,0.353553390593274],[0.353553390593274,0.146446609406726],[0.646446609406726,0.146446609406726],[0.853553390593274,0.353553390593274],[0.853553390593274,0.646446609406726],[0.646446609406726,0.853553390593274],[0.353553390593274,0.853553390593274],[0.146446609406726,0.646446609406726],[0,0.353553390593274],[0,0.646446609406726],[0.353553390593274,0],[0.646446609406726,0],[1,0.353553390593274],[1,0.646446609406726],[0.646446609406726,1],[0.353553390593274,1]],\n\t\"edges_vertices\": [[0,4],[4,9],[0,9],[0,10],[4,10],[2,4],[2,14],[4,14],[4,13],[2,13],[3,4],[4,15],[3,15],[3,16],[4,16],[1,4],[1,12],[4,12],[4,11],[1,11],[4,5],[5,9],[5,16],[4,6],[6,11],[6,10],[4,7],[7,13],[7,12],[4,8],[8,15],[8,14],[9,17],[0,17],[5,17],[0,19],[10,19],[6,19],[11,20],[1,20],[6,20],[1,21],[12,21],[7,21],[13,22],[2,22],[7,22],[2,23],[14,23],[8,23],[15,24],[3,24],[8,24],[3,18],[16,18],[5,18]],\n\t\"edges_faces\": [[0,1],[0,8],[16,0],[1,18],[11,1],[3,2],[2,26],[15,2],[3,12],[24,3],[4,5],[4,14],[28,4],[5,30],[9,5],[7,6],[6,22],[13,6],[7,10],[20,7],[8,9],[8,17],[31,9],[10,11],[10,21],[19,11],[12,13],[12,25],[23,13],[14,15],[14,29],[27,15],[16,17],[16],[17],[18],[19,18],[19],[20,21],[20],[21],[22],[23,22],[23],[24,25],[24],[25],[26],[27,26],[27],[28,29],[28],[29],[30],[31,30],[31]],\n\t\"edges_assignment\": [\"F\",\"M\",\"M\",\"M\",\"M\",\"F\",\"M\",\"M\",\"M\",\"M\",\"V\",\"M\",\"M\",\"M\",\"M\",\"V\",\"M\",\"M\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\"],\n\t\"faces_vertices\": [[0,4,9],[4,0,10],[4,2,14],[2,4,13],[3,4,15],[4,3,16],[4,1,12],[1,4,11],[4,5,9],[5,4,16],[4,6,11],[6,4,10],[4,7,13],[7,4,12],[4,8,15],[8,4,14],[0,9,17],[9,5,17],[10,0,19],[6,10,19],[1,11,20],[11,6,20],[12,1,21],[7,12,21],[2,13,22],[13,7,22],[14,2,23],[8,14,23],[3,15,24],[15,8,24],[16,3,18],[5,16,18]],\n\t\"faces_edges\": [[0,1,2],[0,3,4],[5,6,7],[5,8,9],[10,11,12],[10,13,14],[15,16,17],[15,18,19],[20,21,1],[20,14,22],[23,24,18],[23,4,25],[26,27,8],[26,17,28],[29,30,11],[29,7,31],[2,32,33],[21,34,32],[3,35,36],[25,36,37],[19,38,39],[24,40,38],[16,41,42],[28,42,43],[9,44,45],[27,46,44],[6,47,48],[31,48,49],[12,50,51],[30,52,50],[13,53,54],[22,54,55]]\n}";

	let convert$3 = { toFOLD, toSVG, toORIPA, FOLD_SVG: convert$2 };
	const core$2 = Object.create(null);
	Object.assign(core$2, file, validate, graph, Origami, planargraph);
	let b = {
		empty: recursive_freeze(JSON.parse(empty)),
		square: recursive_freeze(JSON.parse(square$1)),
		book: recursive_freeze(JSON.parse(book)),
		blintz: recursive_freeze(JSON.parse(blintz)),
		kite: recursive_freeze(JSON.parse(kite)),
		fish: recursive_freeze(JSON.parse(fish)),
		bird: recursive_freeze(JSON.parse(bird)),
		frog: recursive_freeze(JSON.parse(frog))
	};
	let clone$2 = core$2.clone;
	let bases = Object.create(null);
	Object.defineProperty(bases, "empty", {get:function(){ return clone$2(b.empty); }});
	Object.defineProperty(bases, "square", {get:function(){ return clone$2(b.square); }});
	Object.defineProperty(bases, "book", {get:function(){ return clone$2(b.book); }});
	Object.defineProperty(bases, "blintz", {get:function(){ return clone$2(b.blintz); }});
	Object.defineProperty(bases, "kite", {get:function(){ return clone$2(b.kite); }});
	Object.defineProperty(bases, "fish", {get:function(){ return clone$2(b.fish); }});
	Object.defineProperty(bases, "bird", {get:function(){ return clone$2(b.bird); }});
	Object.defineProperty(bases, "frog", {get:function(){ return clone$2(b.frog); }});
	let rabbitEar = {
		CreasePattern,
		Origami: Origami$1,
		Origami3D: View3D,
		Graph: Graph$1,
		svg: svg$1,
		convert: convert$3,
		core: core$2,
		bases,
		math: core,
		axiom: axiom
	};
	Object.keys(math)
		.filter(key => key !== "core")
		.forEach(key => rabbitEar[key] = math[key]);

	return rabbitEar;

})));
const RE = RabbitEar;
