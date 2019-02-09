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

	/** clean floating point numbers
	 *  example: 15.0000000000000002 into 15
	 * the adjustable epsilon is default 15, Javascripts 16 digit float
	 */
	function clean_number(num, decimalPlaces = 15) {
		// todo, this fails when num is a string, consider checking
		return (num == null
			? undefined
			: parseFloat(num.toFixed(decimalPlaces)));
	}

	// all points are array syntax [x,y]

	///////////////////////////////////////////////////////////////////////////////
	// the following operations neatly generalize for n-dimensions
	//
	/** @param [number]
	 *  @returns [number]
	 */
	function normalize(v) {
		let m = magnitude(v);
		// todo: do we need to intervene for a divide by 0?
		return v.map(c => c / m);
	}

	/** @param [number]
	 *  @returns number
	 */
	function magnitude(v) {
		let sum = v
			.map(component => component * component)
			.reduce((prev,curr) => prev + curr);
		return Math.sqrt(sum);
	}

	/** @param [number]
	 *  @returns boolean
	 */
	function degenerate(v) {
		return Math.abs(v.reduce((a, b) => a + b, 0)) < EPSILON;
	}

	///////////////////////////////////////////////////////////////////////////////
	// these *can* generalize to n-dimensions, but lengths of arguments must match
	// if the second argument larger than the first it will ignore leftover components
	//
	function dot(a, b) {
		return a
			.map((ai,i) => ai * b[i])
			.reduce((prev,curr) => prev + curr, 0);
	}

	function midpoint$1(a, b) {
		return a.map((ai,i) => (ai+b[i])*0.5);
	}

	function equivalent(a, b, epsilon = EPSILON) {
		// rectangular bounds test for fast calculation
		return a
			.map((ai,i) => Math.abs(ai - b[i]) < epsilon)
			reduce((a,b) => a && b, true);
	}

	function parallel(a, b, epsilon = EPSILON) {
		return 1 - Math.abs(dot(normalize(a), normalize(b))) < epsilon;
	}


	///////////////////////////////////////////////////////////////////////////////
	// everything else that follows is hard-coded to certain dimensions
	//

	/** apply a matrix transform on a point */
	function multiply_vector2_matrix2(vector, matrix) {
		return [ vector[0] * matrix[0] + vector[1] * matrix[2] + matrix[4],
		         vector[0] * matrix[1] + vector[1] * matrix[3] + matrix[5] ];
	}

	/** 
	 * These all standardize a row-column order
	 */
	function make_matrix2_reflection(vector, origin) {
		// the line of reflection passes through origin, runs along vector
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

	// these are all hard-coded to certain vector lengths
	// the length is specified by the number at the end of the function name

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
		return Math.sqrt(
			Math.pow(a[0] - b[0], 2) +
			Math.pow(a[1] - b[1], 2)
		);
	}

	function distance3(a, b) {
		return Math.sqrt(
			Math.pow(a[0] - b[0], 2) +
			Math.pow(a[1] - b[1], 2) +
			Math.pow(a[2] - b[2], 2)
		);
	}

	// need to test:
	// do two polygons overlap if they share a point in common? share an edge?

	var algebra = /*#__PURE__*/Object.freeze({
		normalize: normalize,
		magnitude: magnitude,
		degenerate: degenerate,
		dot: dot,
		midpoint: midpoint$1,
		equivalent: equivalent,
		parallel: parallel,
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

	/** 
	 *  all intersection functions are inclusive and return true if 
	 *  intersection lies directly on an edge's endpoint. to exclude
	 *  endpoints, use "exclusive" functions
	 */

	function equivalent2(a, b, epsilon = EPSILON) {
		return Math.abs(a[0]-b[0]) < epsilon && Math.abs(a[1]-b[1]) < epsilon;
	}


	function line_line(aPt, aVec, bPt, bVec, epsilon) {
		return vector_intersection(aPt, aVec, bPt, bVec, line_line_comp, epsilon);
	}
	function line_ray(linePt, lineVec, rayPt, rayVec, epsilon) {
		return vector_intersection(linePt, lineVec, rayPt, rayVec, line_ray_comp, epsilon);
	}
	function line_edge(point, vec, edge0, edge1, epsilon) {
		let edgeVec = [edge1[0]-edge0[0], edge1[1]-edge0[1]];
		return vector_intersection(point, vec, edge0, edgeVec, line_edge_comp, epsilon);
	}
	function ray_ray(aPt, aVec, bPt, bVec, epsilon) {
		return vector_intersection(aPt, aVec, bPt, bVec, ray_ray_comp, epsilon);
	}
	function ray_edge(rayPt, rayVec, edge0, edge1, epsilon) {
		let edgeVec = [edge1[0]-edge0[0], edge1[1]-edge0[1]];
		return vector_intersection(rayPt, rayVec, edge0, edgeVec, ray_edge_comp, epsilon);
	}
	function edge_edge(a0, a1, b0, b1, epsilon) {
		let aVec = [a1[0]-a0[0], a1[1]-a0[1]];
		let bVec = [b1[0]-b0[0], b1[1]-b0[1]];
		return vector_intersection(a0, aVec, b0, bVec, edge_edge_comp, epsilon);
	}

	function line_edge_exclusive(point, vec, edge0, edge1) {
		let edgeVec = [edge1[0]-edge0[0], edge1[1]-edge0[1]];
		let x = vector_intersection(point, vec, edge0, edgeVec, line_edge_comp);
		if (x == null) { return undefined; }
		if (equivalent2(x, edge0) || equivalent2(x, edge1)) {
			return undefined;
		}
		return x;
	}

	/** comparison functions for a generalized vector intersection function */
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


	/** 
	 * the generalized vector intersection function
	 * requires a compFunction to describe valid bounds checking 
	 * line always returns true, ray is true for t > 0, edge must be between 0 < t < 1
	*/
	var vector_intersection = function(aPt, aVec, bPt, bVec, compFunction, epsilon = EPSILON) {
		function det(a,b) { return a[0] * b[1] - b[0] * a[1]; }
		var denominator0 = det(aVec, bVec);
		var denominator1 = -denominator0;
		if (Math.abs(denominator0) < epsilon) { return undefined; } /* parallel */
		var numerator0 = det([bPt[0]-aPt[0], bPt[1]-aPt[1]], bVec);
		var numerator1 = det([aPt[0]-bPt[0], aPt[1]-bPt[1]], aVec);
		var t0 = numerator0 / denominator0;
		var t1 = numerator1 / denominator1;
		if (compFunction(t0, t1, epsilon)) {
			return [aPt[0] + aVec[0]*t0, aPt[1] + aVec[1]*t0];
		}
	};



	/** 
	 *  Boolean tests
	 *  collinearity, overlap, contains
	 */


	/** is a point collinear to a line, within an epsilon */
	function point_on_line(linePoint, lineVector, point, epsilon = EPSILON) {
		let pointPoint = [point[0] - linePoint[0], point[1] - linePoint[1]];
		let cross = pointPoint[0]*lineVector[1] - pointPoint[1]*lineVector[0];
		return Math.abs(cross) < epsilon;
	}

	/** is a point collinear to an edge, between endpoints, within an epsilon */
	function point_on_edge(edge0, edge1, point, epsilon = EPSILON) {
		// distance between endpoints A,B should be equal to point->A + point->B
		let dEdge = Math.sqrt(Math.pow(edge0[0]-edge1[0],2) +
		                      Math.pow(edge0[1]-edge1[1],2));
		let dP0 = Math.sqrt(Math.pow(point[0]-edge0[0],2) +
		                    Math.pow(point[1]-edge0[1],2));
		let dP1 = Math.sqrt(Math.pow(point[0]-edge1[0],2) +
		                    Math.pow(point[1]-edge1[1],2));
		return Math.abs(dEdge - dP0 - dP1) < epsilon;
	}


	/**
	 * Tests whether or not a point is contained inside a polygon.
	 * @returns {boolean} whether the point is inside the polygon or not
	 * @example
	 * var isInside = point_in_poly(polygonPoints, [0.5, 0.5])
	 */
	function point_in_poly(poly, point, epsilon = EPSILON) {
		// W. Randolph Franklin https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
		let isInside = false;
		for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
			if ( (poly[i][1] > point[1]) != (poly[j][1] > point[1]) &&
			point[0] < (poly[j][0] - poly[i][0]) * (point[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0] ) {
				isInside = !isInside;
			}
		}
		return isInside;
	}

	/** is a point inside of a convex polygon? 
	 * including along the boundary within epsilon 
	 *
	 * @param poly is an array of points [ [x,y], [x,y]...]
	 * @returns {boolean} true if point is inside polygon
	 */
	function point_in_convex_poly(poly, point, epsilon = EPSILON) {
		if (poly == undefined || !(poly.length > 0)) { return false; }
		return poly.map( (p,i,arr) => {
			let nextP = arr[(i+1)%arr.length];
			let a = [ nextP[0]-p[0], nextP[1]-p[1] ];
			let b = [ point[0]-p[0], point[1]-p[1] ];
			return a[0] * b[1] - a[1] * b[0] > -epsilon;
		}).map((s,i,arr) => s == arr[0]).reduce((prev,curr) => prev && curr, true)
	}

	/** do two convex polygons overlap one another */
	function convex_polygons_overlap(ps1, ps2) {
		// convert array of points into edges [point, nextPoint]
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

	/** 
	 *  Clipping operations
	 *  
	 */

	/** clip an infinite line in a polygon, returns an edge or undefined if no intersection */
	function clip_line_in_convex_poly(poly, linePoint, lineVector) {
		let intersections = poly
			.map((p,i,arr) => [p, arr[(i+1)%arr.length]] ) // poly points into edge pairs
			.map(el => line_edge(linePoint, lineVector, el[0], el[1]))
			.filter(el => el != null);
		switch (intersections.length) {
		case 0: return undefined;
		case 1: return [intersections[0], intersections[0]]; // degenerate edge
		case 2: return intersections;
		default:
		// special case: line intersects directly on a poly point (2 edges, same point)
		//  filter to unique points by [x,y] comparison.
			for (let i = 1; i < intersections.length; i++) {
				if ( !equivalent2(intersections[0], intersections[i])) {
					return [intersections[0], intersections[i]];
				}
			}
		}
	}

	function clip_ray_in_convex_poly(poly, linePoint, lineVector) {
		var intersections = poly
			.map((p,i,arr) => [p, arr[(i+1)%arr.length]] ) // poly points into edge pairs
			.map(el => ray_edge(linePoint, lineVector, el[0], el[1]))
			.filter(el => el != null);
		switch (intersections.length) {
		case 0: return undefined;
		case 1: return [linePoint, intersections[0]];
		case 2: return intersections;
		// default: throw "clipping ray in a convex polygon resulting in 3 or more points";
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
			.map((p,i,arr) => [p, arr[(i+1)%arr.length]] ) // poly points into edge pairs
			.map(el => edge_edge(edgeA, edgeB, el[0], el[1]))
			.filter(el => el != null);
		// more efficient if we make sure these are unique
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


	function intersection_circle_line(center, radius, p0, p1) {
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
		line_edge_exclusive: line_edge_exclusive,
		point_on_line: point_on_line,
		point_on_edge: point_on_edge,
		point_in_poly: point_in_poly,
		point_in_convex_poly: point_in_convex_poly,
		convex_polygons_overlap: convex_polygons_overlap,
		clip_line_in_convex_poly: clip_line_in_convex_poly,
		clip_ray_in_convex_poly: clip_ray_in_convex_poly,
		clip_edge_in_convex_poly: clip_edge_in_convex_poly,
		intersection_circle_line: intersection_circle_line
	});

	function make_regular_polygon(sides, x = 0, y = 0, radius = 1) {
		var halfwedge = 2*Math.PI/sides * 0.5;
		var r = radius / Math.cos(halfwedge);
		return Array.from(Array(Math.floor(sides))).map((_,i) => {
			var a = -2 * Math.PI * i / sides + halfwedge;
			var px = clean_number(x + r * Math.sin(a), 14);
			var py = clean_number(y + r * Math.cos(a), 14);
			return [px, py]; // align point along Y
		});
	}

	/** There are 2 interior angles between 2 absolute angle measurements, from A to B return the clockwise one
	 * @param {number} angle in radians, angle PI/2 is along the +Y axis
	 * @returns {number} clockwise interior angle (from a to b) in radians
	 */
	function clockwise_angle2_radians(a, b) {
		// this is on average 50 to 100 times faster than clockwise_angle2
		while (a < 0) { a += Math.PI*2; }
		while (b < 0) { b += Math.PI*2; }
		var a_b = a - b;
		return (a_b >= 0)
			? a_b
			: Math.PI*2 - (b - a);
	}
	function counter_clockwise_angle2_radians(a, b) {
		// this is on average 50 to 100 times faster than counter_clockwise_angle2
		while (a < 0) { a += Math.PI*2; }
		while (b < 0) { b += Math.PI*2; }
		var b_a = b - a;
		return (b_a >= 0)
			? b_a
			: Math.PI*2 - (a - b);
	}

	/** There are 2 angles between 2 vectors, from A to B return the clockwise one.
	 * @param {[number, number]} vector
	 * @returns {number} clockwise angle (from a to b) in radians
	 */
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
	/** There are 2 interior angles between 2 vectors, return both, the smaller first
	 * @param {[number, number]} vector
	 * @returns {[number, number]} 2 angle measurements between vectors
	 */
	function interior_angles2(a, b) {
		var interior1 = clockwise_angle2(a, b);
		var interior2 = Math.PI*2 - interior1;
		return (interior1 < interior2)
			? [interior1, interior2]
			: [interior2, interior1];
	}
	/** This bisects 2 vectors, returning both smaller and larger outside angle bisections [small, large]
	 * @param {[number, number]} vector
	 * @returns {[[number, number],[number, number]]} 2 vectors, the smaller angle first
	 */
	function bisect_vectors(a, b) {
		let aV = normalize(a);
		let bV = normalize(b);
		let sum = aV.map((_,i) => aV[i] + bV[i]);
		let vecA = normalize( sum );
		let vecB = aV.map((_,i) => -aV[i] + -bV[i]);
		return [vecA, normalize(vecB)];
	}

	/** This bisects 2 lines
	 * @param {[number, number]} all vectors, lines defined by points and vectors
	 * @returns [ [number,number], [number,number] ] // line, defined as point, vector, in that order
	 */
	function bisect_lines2(pointA, vectorA, pointB, vectorB) {
		let denominator = vectorA[0] * vectorB[1] - vectorB[0] * vectorA[1];
		if (Math.abs(denominator) < EPSILON) { /* parallel */
			return [midpoint(pointA, pointB), vectorA.slice()];
		}
		let vectorC = [pointB[0]-pointA[0], pointB[1]-pointA[1]];
		// var numerator = vectorC[0] * vectorB[1] - vectorB[0] * vectorC[1];
		let numerator = (pointB[0]-pointA[0]) * vectorB[1] - vectorB[0] * (pointB[1]-pointA[1]);
		var t = numerator / denominator;
		let x = pointA[0] + vectorA[0]*t;
		let y = pointA[1] + vectorA[1]*t;
		var bisects = bisect_vectors(vectorA, vectorB);
		bisects[1] = [ bisects[1][1], -bisects[1][0] ];
		// swap to make smaller interior angle first
		if (Math.abs(cross2(vectorA, bisects[1])) <
		   Math.abs(cross2(vectorA, bisects[0]))) {
			var swap = bisects[0];
			bisects[0] = bisects[1];
			bisects[1] = swap;
		}
		return bisects.map((el) => [[x,y], el]);
	}

	// todo: check the implementation above, if it works, delete this:

	// export function bisect_lines2(pointA, vectorA, pointB, vectorB) {
	// 	if (parallel(vectorA, vectorB)) {
	// 		return [midpoint(pointA, pointB), vectorA.slice()];
	// 	} else{
	// 		var inter = Intersection.line_line(pointA, vectorA, pointB, vectorB);
	// 		var bisect = bisect_vectors(vectorA, vectorB);
	// 		bisects[1] = [ bisects[1][1], -bisects[1][0] ];
	// 		// swap to make smaller interior angle first
	// 		if (Math.abs(cross2(vectorA, bisects[1])) <
	// 		   Math.abs(cross2(vectorA, bisects[0]))) {
	// 			var swap = bisects[0];
	// 			bisects[0] = bisects[1];
	// 			bisects[1] = swap;
	// 		}
	// 		return bisects.map((el) => [inter, el]);
	// 	}
	// }


	function convex_hull(points, include_collinear = false, epsilon = EPSILON_HIGH) {
		// # points in the convex hull before escaping function
		var INFINITE_LOOP = 10000;
		// sort points by y. if ys are equivalent, sort by x
		var sorted = points.slice().sort((a,b) =>
			(Math.abs(a[1]-b[1]) < epsilon
				? a[0] - b[0]
				: a[1] - b[1]));
		var hull = [];
		hull.push(sorted[0]);
		// the current direction the perimeter walker is facing
		var ang = 0;  
		var infiniteLoop = 0;
		do{
			infiniteLoop++;
			var h = hull.length-1;
			var angles = sorted
				// remove all points in the same location from this search
				.filter(el => 
					!( Math.abs(el[0] - hull[h][0]) < epsilon
					&& Math.abs(el[1] - hull[h][1]) < epsilon))
				// sort by angle, setting lowest values next to "ang"
				.map(el => {
					var angle = Math.atan2(hull[h][1] - el[1], hull[h][0] - el[0]);
					while(angle < ang) { angle += Math.PI*2; }
					return {node:el, angle:angle, distance:undefined};
				})  // distance to be set later
				.sort((a,b) => (a.angle < b.angle)?-1:(a.angle > b.angle)?1:0);
			if (angles.length === 0) { return undefined; }
			// narrowest-most right turn
			var rightTurn = angles[0];
			// collect all other points that are collinear along the same ray
			angles = angles.filter(el => Math.abs(rightTurn.angle - el.angle) < epsilon)
			// sort collinear points by their distances from the connecting point
				.map(el => { 
					var distance = Math.sqrt(Math.pow(hull[h][0]-el.node[0], 2) + Math.pow(hull[h][1]-el.node[1], 2));
					el.distance = distance;
					return el;
				})
			// (OPTION 1) exclude all collinear points along the hull 
			.sort((a,b) => (a.distance < b.distance)?1:(a.distance > b.distance)?-1:0);
			// (OPTION 2) include all collinear points along the hull
			// .sort(function(a,b) {return (a.distance < b.distance)?-1:(a.distance > b.distance)?1:0});
			// if the point is already in the convex hull, we've made a loop. we're done
			// if (contains(hull, angles[0].node)) {
			// if (includeCollinear) {
			// 	points.sort(function(a,b) {return (a.distance - b.distance)});
			// } else{
			// 	points.sort(function(a,b) {return b.distance - a.distance});
			// }

			if (hull.filter(el => el === angles[0].node).length > 0) {
				return hull;
			}
			// add point to hull, prepare to loop again
			hull.push(angles[0].node);
			// update walking direction with the angle to the new point
			ang = Math.atan2( hull[h][1] - angles[0].node[1], hull[h][0] - angles[0].node[0]);
		} while(infiniteLoop < INFINITE_LOOP);
		return undefined;
	}


	function split_polygon(poly, linePoint, lineVector) {
		//    point: intersection [x,y] point or null if no intersection
		// at_index: where in the polygon this occurs
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
		// todo: should this return undefined if no intersection? 
		//       or the original poly?

		//    point: intersection [x,y] point or null if no intersection
		// at_index: where in the polygon this occurs
		let vertices_intersections = poly.map((v,i) => {
			let intersection = point_on_line(linePoint, lineVector, v);
			return { point: intersection ? v : null, at_index: i };
		}).filter(el => el.point != null);
		let edges_intersections = poly.map((v,i,arr) => {
			let intersection = line_edge_exclusive(linePoint, lineVector, v, arr[(i+1)%arr.length]);
			return { point: intersection, at_index: i };
		}).filter(el => el.point != null);

		// three cases: intersection at 2 edges, 2 points, 1 edge and 1 point
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
			face_a.push(sorted_geom[1].point); // todo: if there's a bug, it's here. switch this

			let face_b = poly
				.slice(sorted_geom[0].at_index+1, sorted_geom[1].at_index+1);
			if (sorted_geom[1].type === "e") { face_b.push(sorted_geom[1].point); }
			face_b.push(sorted_geom[0].point); // todo: if there's a bug, it's here. switch this
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
		convex_hull: convex_hull,
		split_polygon: split_polygon,
		split_convex_polygon: split_convex_polygon
	});

	function axiom1(a, b) {
		// n-dimension
		return [a, a.map((_,i) => b[i] - a[i])];
	}
	function axiom2(a, b) {
		// 2-dimension
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
		// var radius = Math.sqrt(Math.pow(origin.x - point.x, 2) + Math.pow(origin.y - point.y, 2));
		// var intersections = new M.Circle(origin, radius).intersection(new M.Edge(line).infiniteLine());
		// var lines = [];
		// for(var i = 0; i < intersections.length; i++){ lines.push(this.axiom2(point, intersections[i])); }
		// return lines;
	}
	function axiom6(pointA, vectorA, pointB, vectorB, pointC, pointD) {
	}
	function axiom7(pointA, vectorA, pointB, vectorB, pointC) {
		// var newLine = new M.Line(point, new M.Edge(perp).vector());
		// var intersection = newLine.intersection(new M.Edge(ontoLine).infiniteLine());
		// if(intersection === undefined){ return undefined; }
		// return this.axiom2(point, intersection);
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

	/** 
	 * this searches user-provided inputs for a valid n-dimensional vector 
	 * which includes objects {x:, y:}, arrays [x,y], or sequences of numbers
	 * 
	 * @returns (number[]) array of number components
	 *   invalid/no input returns an emptry array
	*/
	function get_vec() {
		let params = Array.from(arguments);
		if (params.length == 0) { return []; }
		if (params[0].vector != null && params[0].vector.constructor == Array) {
			return params[0].vector; // already a Vector type
		}
		let arrays = params.filter((param) => param.constructor === Array);
		if (arrays.length >= 1) { return [...arrays[0]]; }
		let numbers = params.filter((param) => !isNaN(param));
		if (numbers.length >= 1) { return numbers; }
		if (!isNaN(params[0].x)) {
			// todo, we are relying on convention here. should 'w' be included?
			// todo: if y is not defined but z is, it will move z to index 1
			return ['x','y','z'].map(c => params[0][c]).filter(a => a != null);
		}
		return [];
	}

	/** 
	 * @returns (number[]) array of number components
	 *  invalid/no input returns the identity matrix
	*/
	function get_matrix() {
		let params = Array.from(arguments);
		let numbers = params.filter((param) => !isNaN(param));
		let arrays = params.filter((param) => param.constructor === Array);
		if (params.length == 0) { return [1,0,0,1,0,0]; }
		if (params[0].m != null && params[0].m.constructor == Array) {
			numbers = params[0].m.slice(); // Matrix type
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


	/** 
	 * @returns [[2,3],[10,11]]
	*/
	function get_edge() {
		let params = Array.from(arguments);
		let numbers = params.filter((param) => !isNaN(param));
		let arrays = params.filter((param) => param.constructor === Array);
		if (params.length == 0) { return undefined; }
		if (!isNaN(params[0]) && numbers.length >= 4) {
			return [
				[params[0], params[1]],
				[params[2], params[3]]
			];
		}
		if (arrays.length > 0) {
			if (arrays.length == 2) {
				return [
					[arrays[0][0], arrays[0][1]],
					[arrays[1][0], arrays[1][1]]
				];
			}
			if (arrays.length == 4) {
				return [
					[arrays[0], arrays[1]],
					[arrays[2], arrays[3]]
				];
			}
		}
	}


	/** 
	 * @returns ({ point:[], vector:[] })
	*/
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

	/** n-dimensional vector */
	function Vector$1() {
		let _v = get_vec(...arguments);

		const normalize$$1 = function() {
			return Vector$1( normalize(_v) );
		};
		const magnitude$$1 = function() {
			return magnitude(_v);
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
			return Vector$1( cross3(a, b) );
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
			let m = get_matrix(...arguments);
			return Vector$1( multiply_vector2_matrix2(_v, m) );
		};
		const add = function(){
			let vec = get_vec(...arguments);
			return Vector$1( _v.map((v,i) => v + vec[i]) );
		};
		const subtract = function(){
			let vec = get_vec(...arguments);
			return Vector$1( _v.map((v,i) => v - vec[i]) );
		};
		// these are implicitly 2D functions, and will convert the vector into 2D
		const rotateZ = function(angle, origin) {
			var m = make_matrix2_rotation(angle, origin);
			return Vector$1( multiply_vector2_matrix2(_v, m) );
		};
		const rotateZ90 = function() {
			return Vector$1(-_v[1], _v[0]);
		};
		const rotateZ180 = function() {
			return Vector$1(-_v[0], -_v[1]);
		};
		const rotateZ270 = function() {
			return Vector$1(_v[1], -_v[0]);
		};
		const reflect = function() {
			let reflect = get_line(...arguments);
			let m = make_matrix2_reflection(reflect.vector, reflect.point);
			return Vector$1( multiply_vector2_matrix2(_v, m) );
		};
		const lerp = function(vector, pct) {
			let vec = get_vec(vector);
			let inv = 1.0 - pct;
			let length = (_v.length < vec.length) ? _v.length : vec.length;
			let components = Array.from(Array(length))
				.map((_,i) => _v[i] * pct + vec[i] * inv);
			return Vector$1(components);
		};
		const isEquivalent = function(vector) {
			// rect bounding box for now, much cheaper than radius calculation
			let vec = get_vec(vector);
			let sm = (_v.length < vec.length) ? _v : vec;
			let lg = (_v.length < vec.length) ? vec : _v;
			return equivalent(sm, lg);
		};
		const isParallel = function(vector) {
			let vec = get_vec(vector);
			let sm = (_v.length < vec.length) ? _v : vec;
			let lg = (_v.length < vec.length) ? vec : _v;
			return parallel(sm, lg);
		};
		const scale = function(mag) {
			return Vector$1( _v.map(v => v * mag) );
		};
		const midpoint = function() {
			let vec = get_vec(...arguments);
			let sm = (_v.length < vec.length) ? _v.slice() : vec;
			let lg = (_v.length < vec.length) ? vec : _v.slice();
			for(var i = sm.length; i < lg.length; i++){ sm[i] = 0; }
			return Vector$1(lg.map((_,i) => (sm[i] + lg[i]) * 0.5));
		};
		const bisect = function(vector){
			let vec = get_vec(vector);
			return Vector$1( bisect_vectors(_v, vec) );
		};

		return Object.freeze(
			Object.assign({
				normalize: normalize$$1,
				magnitude: magnitude$$1,
				dot: dot$$1,
				cross,
				distanceTo,
				transform,
				add,
				subtract,
				rotateZ,
				rotateZ90,
				rotateZ180,
				rotateZ270,
				reflect,
				lerp,
				isEquivalent,
				isParallel,
				scale,
				midpoint,
				bisect,
				get x() { return _v[0]; },
				get y() { return _v[1]; },
				get z() { return _v[2]; },
			}, _v)
		);
	}

	function Circle(){
		let _origin, _radius;

		let params = Array.from(arguments);
		let numbers = params.filter((param) => !isNaN(param));
		if(numbers.length == 3){
			_origin = numbers.slice(0,2);
			_radius = numbers[2];
		}

		const intersectionLine = function(){
			let line = get_line(...arguments);
			let point2 = [
				line.point[0] + line.vector[0],
				line.point[1] + line.vector[1]
			];
			let intersection = intersection_circle_line(_origin, _radius, line.point, point2);
			return Vector(intersection);
		};

		const intersectionEdge = function(){
			let points = get_two_vec2(...arguments);
			let intersection = intersection_circle_line(_origin, _radius, points[0], points[1]);
			return Vector(intersection);
		};

		return Object.freeze( {
			intersectionLine,
			intersectionEdge,
			get origin() { return _origin; },
			get radius() { return _radius; },
		} );
	}

	function Polygon() {

		let _points = get_array_of_vec(...arguments);

		/** 
		 * Tests whether or not a point is contained inside a polygon.
		 * @returns {boolean}
		 * @example
		 * var isInside = polygon.contains( [0.5, 0.5] )
		 */
		const contains = function(point) {
			return point_in_poly(_points, point);
		};

		/** Calculates the signed area of a polygon. This requires the polygon be non-intersecting.
		 * @returns {number} the area of the polygon
		 * @example
		 * var area = polygon.signedArea()
		 */
		const signedArea = function() {
			return 0.5 * _points.map((el,i,arr) => {
				var next = arr[(i+1)%arr.length];
				return el[0] * next[1] - next[0] * el[1];
			})
			.reduce((a, b) => a + b, 0);
		};
		/** Calculates the centroid or the center of mass of the polygon.
		 * @returns {XY} the location of the centroid
		 * @example
		 * var centroid = polygon.centroid()
		 */
		const centroid = function() {
			return _points.map((el,i,arr) => {
				var next = arr[(i+1)%arr.length];
				var mag = el[0] * next[1] - next[0] * el[1];
				return Vector$1( (el[0]+next[0])*mag, (el[1]+next[1])*mag );
			})
			.reduce((prev, curr) => prev.add(curr), Vector$1(0,0))
			.scale(1/(6 * signedArea(_points)));
		};
		/** Calculates the center of the bounding box made by the edges of the polygon.
		 * @returns {XY} the location of the center of the bounding box
		 * @example
		 * var boundsCenter = polygon.center()
		 */
		const center = function() {
			// this is not an average / means
			var xMin = Infinity, xMax = 0, yMin = Infinity, yMax = 0;
			_points.forEach(p => {
				if (p[0] > xMax) { xMax = p[0]; }
				if (p[0] < xMin) { xMin = p[0]; }
				if (p[1] > yMax) { yMax = p[1]; }
				if (p[1] < yMin) { yMin = p[1]; }
			});
			return Vector$1( xMin+(xMax-xMin)*0.5, yMin+(yMax-yMin)*0.5 );
		};

		const scale = function(magnitude, centerPoint = centroid()) {
			let newPoints = _points.map(p => {
				let vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
				return [centerPoint[0] + vec[0]*magnitude, centerPoint[1] + vec[1]*magnitude];
			});
			return Polygon(newPoints);
		};

		const rotate = function(angle, centerPoint = centroid()) {
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


		// todo: replace with non-convex
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

		return Object.freeze( {
			contains,
			signedArea,
			centroid,
			center,
			scale,
			rotate,
			split,
			clipEdge,
			clipLine,
			clipRay,
			get points() { return _points; },
		} );

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

		let {
			contains,
			signedArea,
			centroid,
			center,
			points
		} = Polygon(...arguments);
		let _points = points;

		// const liesOnEdge = function(p) {
		// 	for(var i = 0; i < this.edges.length; i++) {
		// 		if (this.edges[i].collinear(p)) { return true; }
		// 	}
		// 	return false;
		// }
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
		const enclosingRectangle = function() {
			var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
			_points.forEach(p => {
				if (p[0] > maxX) { maxX = p[0]; }
				if (p[0] < minX) { minX = p[0]; }
				if (p[1] > maxY) { maxY = p[1]; }
				if (p[1] < minY) { minY = p[1]; }
			});
			return Rectangle(minX, minY, maxX-minX, maxY-minY);
		};

		const split = function() {
			let line = get_line(...arguments);
			return split_convex_polygon(_points, line.point, line.vector)
				.map(poly => ConvexPolygon(poly));
		};

		const overlaps = function() {
			let points = get_array_of_vec(...arguments);
			return convex_polygons_overlap(_points, points);
		};

		const scale = function(magnitude, centerPoint = centroid()) {
			let newPoints = _points.map(p => {
				let vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
				return [centerPoint[0] + vec[0]*magnitude, centerPoint[1] + vec[1]*magnitude];
			});
			return ConvexPolygon(newPoints);
		};

		const rotate = function(angle, centerPoint = centroid()) {
			let newPoints = _points.map(p => {
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

		return Object.freeze( {
			signedArea,
			centroid,
			center,
			contains,
			clipEdge,
			clipLine,
			clipRay,
			enclosingRectangle,
			split,
			overlaps,
			scale,
			rotate,
			get points() { return _points; },
		} );
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
		if(numbers.length == 4){
			_origin = numbers.slice(0,2);
			_width = numbers[2];
			_height = numbers[3];
		}

		return Object.freeze( {
			get origin() { return _origin; },
			get width() { return _width; },
			get height() { return _height; },
		} );
	}

	/** 
	 * 2D Matrix (2x3) with translation component in x,y
	 */
	function Matrix() {
		let _m = get_matrix(...arguments);

		const inverse = function() {
			return Matrix( make_matrix2_inverse(_m) );
		};
		const multiply = function() {
			let m2 = get_matrix(...arguments);
			return Matrix( multiply_matrices2(_m, m2) );
		};
		const transform = function(){
			let v = get_vec(...arguments);
			return Vector$1( multiply_vector2_matrix2(v, _m) );
		};
		return Object.freeze( {
			inverse,
			multiply,
			transform,
			get m() { return _m; },
		} );
	}
	// static methods
	Matrix.makeIdentity = function() {
		return Matrix(1,0,0,1,0,0);
	};
	Matrix.makeRotation = function(angle, origin) {
		return Matrix( make_matrix2_rotation(angle, origin) );
	};
	Matrix.makeReflection = function(vector, origin) {
		return Matrix( make_matrix2_reflection(vector, origin) );
	};

	function Line() {
		let {point, vector} = get_line(...arguments);

		const isParallel = function() {
			let line = get_line(...arguments);
			return parallel(vector, line.vector);
		};
		const transform = function() {
			let mat = get_matrix(...arguments);
			// todo: a little more elegant of a solution, please
			let norm = normalize(vector);
			let temp = point.map((p,i) => p + norm[i]);
			if(temp == null) { return; }
			var p0 = multiply_vector2_matrix2(point, mat);
			var p1 = multiply_vector2_matrix2(temp, mat);
			return Line.withPoints([p0, p1]);
		};

		return Object.freeze( {
			isParallel,
			transform,
			get vector() { return vector; },
			get point() { return point; },
		} );
	}
	// static methods
	Line.withPoints = function() {
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
			// vector: Algebra.cross3(vec, [0,0,1])
		});
	};


	function Ray() {
		let {point, vector} = get_line(...arguments);

		return Object.freeze( {
			get vector() { return vector; },
			get point() { return point; },
			get origin() { return point; },
		} );
	}
	// static methods
	Ray.withPoints = function() {
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
		let _endpoints = get_two_vec2(...arguments);

		const vector = function() {
			return Vector$1(
				_endpoints[1][0] - _endpoints[0][0],
				_endpoints[1][1] - _endpoints[0][1]
			);
		};

		const length = function() {
			return Math.sqrt(Math.pow(_endpoints[1][0] - _endpoints[0][0],2)
			               + Math.pow(_endpoints[1][1] - _endpoints[0][1],2));
		};

		const nearestPoint = function() {
			let point = get_vec(...arguments);
			var answer = nearestPointNormalTo(...arguments);
			return (answer == null)
				? Vector$1(_endpoints.map(p => ({
						point: p,
						d: Math.sqrt(Math.pow(p[0] - point[0],2) + Math.pow(p[1] - point[1],2))
					}))
					.sort((a,b) => a.d - b.d)
					.shift()
					.point)
				: answer;
		};
		const nearestPointNormalTo = function() {
			let point = get_vec(...arguments);
			let p = length();
			var u = ((point[0]-_endpoints[0][0]) * (_endpoints[1][0]-_endpoints[0][0])
			       + (point[1]-_endpoints[0][1]) * (_endpoints[1][1]-_endpoints[0][1]))
			       / (Math.pow(p, 2) );
			return (u < 0 || u > 1.0)
				? undefined
				: Vector$1(_endpoints[0][0] + u*(_endpoints[1][0]-_endpoints[0][0]),
			             _endpoints[0][1] + u*(_endpoints[1][1]-_endpoints[0][1]) );
		};

		return Object.freeze( {
			vector,
			length,
			nearestPoint,
			nearestPointNormalTo,
			get endpoints() { return _endpoints; },
		} );
	}

	/**
	 *  Geometry library
	 *  The goal of this user-facing library is to type check all arguments for a
	 *  likely use case, which might slow runtime by a small fraction.
	 *  Use the core library functions for fastest-possible calculations.
	 */

	// let core = { algebra, geometry, intersection, origami };
	let core = { algebra, geometry, intersection, origami: origami$1, EPSILON_LOW, EPSILON, EPSILON_HIGH, clean_number };

	var geometry$1 = /*#__PURE__*/Object.freeze({
		core: core,
		Vector: Vector$1,
		Circle: Circle,
		Polygon: Polygon,
		ConvexPolygon: ConvexPolygon,
		Rectangle: Rectangle,
		Matrix: Matrix,
		Line: Line,
		Ray: Ray,
		Edge: Edge
	});

	/* SVG (c) Robby Kraft, MIT License */
	function createShiftArr(a){var b="    ";isNaN(parseInt(a))?b=a:1===a?b=" ":2===a?b="  ":3===a?b="   ":4===a?b="    ":5===a?b="     ":6===a?b="      ":7===a?b="       ":8===a?b="        ":9===a?b="         ":10===a?b="          ":11===a?b="           ":12===a?b="            ":void 0;var c=["\n"];for(let d=0;100>d;d++)c.push(c[d]+b);return c}function vkbeautify(){this.step="\t",this.shift=createShiftArr(this.step);}vkbeautify.prototype.xml=function(a,b){var c=a.replace(/>\s{0,}</g,"><").replace(/</g,"~::~<").replace(/\s*xmlns\:/g,"~::~xmlns:").replace(/\s*xmlns\=/g,"~::~xmlns=").split("~::~"),d=c.length,e=!1,f=0,g="",h=b?createShiftArr(b):this.shift;for(let i=0;i<d;i++)-1<c[i].search(/<!/)?(g+=h[f]+c[i],e=!0,(-1<c[i].search(/-->/)||-1<c[i].search(/\]>/)||-1<c[i].search(/!DOCTYPE/))&&(e=!1)):-1<c[i].search(/-->/)||-1<c[i].search(/\]>/)?(g+=c[i],e=!1):/^<\w/.exec(c[i-1])&&/^<\/\w/.exec(c[i])&&/^<[\w:\-\.\,]+/.exec(c[i-1])==/^<\/[\w:\-\.\,]+/.exec(c[i])[0].replace("/","")?(g+=c[i],e||f--):-1<c[i].search(/<\w/)&&-1==c[i].search(/<\//)&&-1==c[i].search(/\/>/)?g=e?g+=c[i]:g+=h[f++]+c[i]:-1<c[i].search(/<\w/)&&-1<c[i].search(/<\//)?g=e?g+=c[i]:g+=h[f]+c[i]:-1<c[i].search(/<\//)?g=e?g+=c[i]:g+=h[--f]+c[i]:-1<c[i].search(/\/>/)?g=e?g+=c[i]:g+=h[f]+c[i]:g+=-1<c[i].search(/<\?/)?h[f]+c[i]:-1<c[i].search(/xmlns\:/)||-1<c[i].search(/xmlns\=/)?h[f]+c[i]:c[i];return "\n"==g[0]?g.slice(1):g},vkbeautify.prototype.json=function(a,b){var b=b?b:this.step;return "undefined"==typeof JSON?a:"string"==typeof a?JSON.stringify(JSON.parse(a),null,b):"object"==typeof a?JSON.stringify(a,null,b):a},vkbeautify.prototype.css=function(a,b){var c=a.replace(/\s{1,}/g," ").replace(/\{/g,"{~::~").replace(/\}/g,"~::~}~::~").replace(/\;/g,";~::~").replace(/\/\*/g,"~::~/*").replace(/\*\//g,"*/~::~").replace(/~::~\s{0,}~::~/g,"~::~").split("~::~"),d=c.length,e=0,f="",g=b?createShiftArr(b):this.shift;for(let h=0;h<d;h++)f+=/\{/.exec(c[h])?g[e++]+c[h]:/\}/.exec(c[h])?g[--e]+c[h]:/\*\\/.exec(c[h])?g[e]+c[h]:g[e]+c[h];return f.replace(/^\n{1,}/,"")};function isSubquery(a,b){return b-(a.replace(/\(/g,"").length-a.replace(/\)/g,"").length)}function split_sql(a,b){return a.replace(/\s{1,}/g," ").replace(/ AND /ig,"~::~"+b+b+"AND ").replace(/ BETWEEN /ig,"~::~"+b+"BETWEEN ").replace(/ CASE /ig,"~::~"+b+"CASE ").replace(/ ELSE /ig,"~::~"+b+"ELSE ").replace(/ END /ig,"~::~"+b+"END ").replace(/ FROM /ig,"~::~FROM ").replace(/ GROUP\s{1,}BY/ig,"~::~GROUP BY ").replace(/ HAVING /ig,"~::~HAVING ").replace(/ IN /ig," IN ").replace(/ JOIN /ig,"~::~JOIN ").replace(/ CROSS~::~{1,}JOIN /ig,"~::~CROSS JOIN ").replace(/ INNER~::~{1,}JOIN /ig,"~::~INNER JOIN ").replace(/ LEFT~::~{1,}JOIN /ig,"~::~LEFT JOIN ").replace(/ RIGHT~::~{1,}JOIN /ig,"~::~RIGHT JOIN ").replace(/ ON /ig,"~::~"+b+"ON ").replace(/ OR /ig,"~::~"+b+b+"OR ").replace(/ ORDER\s{1,}BY/ig,"~::~ORDER BY ").replace(/ OVER /ig,"~::~"+b+"OVER ").replace(/\(\s{0,}SELECT /ig,"~::~(SELECT ").replace(/\)\s{0,}SELECT /ig,")~::~SELECT ").replace(/ THEN /ig," THEN~::~"+b+"").replace(/ UNION /ig,"~::~UNION~::~").replace(/ USING /ig,"~::~USING ").replace(/ WHEN /ig,"~::~"+b+"WHEN ").replace(/ WHERE /ig,"~::~WHERE ").replace(/ WITH /ig,"~::~WITH ").replace(/ ALL /ig," ALL ").replace(/ AS /ig," AS ").replace(/ ASC /ig," ASC ").replace(/ DESC /ig," DESC ").replace(/ DISTINCT /ig," DISTINCT ").replace(/ EXISTS /ig," EXISTS ").replace(/ NOT /ig," NOT ").replace(/ NULL /ig," NULL ").replace(/ LIKE /ig," LIKE ").replace(/\s{0,}SELECT /ig,"SELECT ").replace(/\s{0,}UPDATE /ig,"UPDATE ").replace(/ SET /ig," SET ").replace(/~::~{1,}/g,"~::~").split("~::~")}vkbeautify.prototype.sql=function(a,b){var c=a.replace(/\s{1,}/g," ").replace(/\'/ig,"~::~'").split("~::~"),d=c.length,e=[],f=0,g=this.step,h=0,i="",j=b?createShiftArr(b):this.shift;for(let f=0;f<d;f++)e=f%2?e.concat(c[f]):e.concat(split_sql(c[f],g));d=e.length;for(let c=0;c<d;c++)h=isSubquery(e[c],h),/\s{0,}\s{0,}SELECT\s{0,}/.exec(e[c])&&(e[c]=e[c].replace(/\,/g,",\n"+g+g+"")),/\s{0,}\s{0,}SET\s{0,}/.exec(e[c])&&(e[c]=e[c].replace(/\,/g,",\n"+g+g+"")),/\s{0,}\(\s{0,}SELECT\s{0,}/.exec(e[c])?(f++,i+=j[f]+e[c]):/\'/.exec(e[c])?(1>h&&f&&f--,i+=e[c]):(i+=j[f]+e[c],1>h&&f&&f--);return i=i.replace(/^\n{1,}/,"").replace(/\n{1,}/g,"\n"),i},vkbeautify.prototype.xmlmin=function(a,b){var c=b?a:a.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/g,"").replace(/[ \r\n\t]{1,}xmlns/g," xmlns");return c.replace(/>\s{0,}</g,"><")},vkbeautify.prototype.jsonmin=function(a){return "undefined"==typeof JSON?a:JSON.stringify(JSON.parse(a),null,0)},vkbeautify.prototype.cssmin=function(a,b){var c=b?a:a.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g,"");return c.replace(/\s{1,}/g," ").replace(/\{\s{1,}/g,"{").replace(/\}\s{1,}/g,"}").replace(/\;\s{1,}/g,";").replace(/\/\*\s{1,}/g,"/*").replace(/\*\/\s{1,}/g,"*/")},vkbeautify.prototype.sqlmin=function(a){return a.replace(/\s{1,}/g," ").replace(/\s{1,}\(/,"(").replace(/\s{1,}\)/,")")};var vkbeautify$1=new vkbeautify;const svgNS="http://www.w3.org/2000/svg",setClassIdParent=function(a,b,c,d){null!=b&&a.setAttributeNS(null,"class",b),null!=c&&a.setAttributeNS(null,"id",c),null!=d&&d.appendChild(a);},setPoints=function(a,b){if(null!=b&&b.constructor===Array){let c=b.map(a=>a.constructor===Array?a:[a.x,a.y]).reduce((a,b)=>a+b[0]+","+b[1]+" ","");a.setAttributeNS(null,"points",c);}},setArc=function(a,b,c,e,f,g,h=!1){var i=Math.sin,j=Math.cos;let k=[b+j(f)*e,c+i(f)*e],l=[j(f)*e,i(f)*e],m=[j(g)*e,i(g)*e],n=[m[0]-l[0],m[1]-l[1]],o=l[0]*m[1]-l[1]*m[0],p=l[0]*m[0]+l[1]*m[1],q=0<Math.atan2(o,p)?0:1,r=h?"M "+b+","+c+" l "+l[0]+","+l[1]+" ":"M "+k[0]+","+k[1]+" ";r+=["a ",e,e,0,q,1,n[0],n[1]].join(" "),h&&(r+=" Z"),a.setAttributeNS(null,"d",r);},line$1=function(a,b,c,d,e,f,g){let h=document.createElementNS(svgNS,"line");return h.setAttributeNS(null,"x1",a),h.setAttributeNS(null,"y1",b),h.setAttributeNS(null,"x2",c),h.setAttributeNS(null,"y2",d),setClassIdParent(h,e,f,g),h},circle=function(a,b,c,d,e,f){let g=document.createElementNS(svgNS,"circle");return g.setAttributeNS(null,"cx",a),g.setAttributeNS(null,"cy",b),g.setAttributeNS(null,"r",c),setClassIdParent(g,d,e,f),g},rect=function(a,b,c,d,e,f,g){let h=document.createElementNS(svgNS,"rect");return h.setAttributeNS(null,"x",a),h.setAttributeNS(null,"y",b),h.setAttributeNS(null,"width",c),h.setAttributeNS(null,"height",d),setClassIdParent(h,e,f,g),h},polygon=function(a,b,c,d){let e=document.createElementNS(svgNS,"polygon");return setPoints(e,a),setClassIdParent(e,b,c,d),e},polyline=function(a,b,c,d){let e=document.createElementNS(svgNS,"polyline");return setPoints(e,a),setClassIdParent(e,b,c,d),e},bezier=function(a,b,c,d,e,f,g,h,i,j,k){let l=document.createElementNS(svgNS,"path");return l.setAttributeNS(null,"d","M "+a+","+b+" C "+c+","+d+" "+e+","+f+" "+g+","+h),setClassIdParent(l,i,j,k),l},text=function(a,b,c,d,e,f){let g=document.createElementNS(svgNS,"text");return g.innerHTML=a,g.setAttributeNS(null,"x",b),g.setAttributeNS(null,"y",c),setClassIdParent(g,d,e,f),g},wedge=function(a,b,c,d,e,f,g,h){let i=document.createElementNS(svgNS,"path");return setArc(i,a,b,c,d,e,!0),setClassIdParent(i,f,g,h),i},arc=function(a,b,c,d,e,f,g,h){let i=document.createElementNS(svgNS,"path");return setArc(i,a,b,c,d,e,!1),setClassIdParent(i,f,g,h),i},regularPolygon=function(b,c,a,d,e,f,g){var h=Math.PI,j=Math.cos;let k=.5*(2*h/d),l=j(k)*a,i=Array.from(Array(d)).map((e,f)=>{let g=-2*h*f/d+k,a=b+l*Math.sin(g),i=c+l*j(g);return [a,i]});return polygon(i,e,f,g)},group=function(a,b,c){let d=document.createElementNS(svgNS,"g");return setClassIdParent(d,a,b,c),d},svg=function(a,b,c){let d=document.createElementNS(svgNS,"svg");return setClassIdParent(d,a,b,c),d},addClass=function(a,b){if(null==a)return;let c=a.getAttribute("class");c==null&&(c="");let d=c.split(" ").filter(a=>a!==b);d.push(b),a.setAttributeNS(null,"class",d.join(" "));},removeClass=function(a,b){if(null==a)return;let c=a.getAttribute("class");c==null&&(c="");let d=c.split(" ").filter(a=>a!==b);a.setAttributeNS(null,"class",d.join(" "));},setId=function(a,b){null==a||a.setAttributeNS(null,"id",b);},removeChildren=function(a){for(;a.lastChild;)a.removeChild(a.lastChild);},setViewBox=function(a,b,c,e,f,g=0){let h=e/1-e,d=[b-h-g,c-h-g,e+2*h+2*g,f+2*h+2*g].join(" ");a.setAttributeNS(null,"viewBox",d);},setDefaultViewBox=function(a){let b=a.getBoundingClientRect(),c=0==b.width?640:b.width,d=0==b.height?480:b.height;setViewBox(a,0,0,c,d);},getViewBox=function(a){let b=a.getAttribute("viewBox");return null==b?void 0:b.split(" ").map(a=>parseFloat(a))},scale=function(a,b,c=0,d=0){1e-8>b&&(b=.01);let e=a.createSVGMatrix().translate(c,d).scale(1/b).translate(-c,-d),f=getViewBox(a);null==f&&setDefaultViewBox(a);let g=a.createSVGPoint(),h=a.createSVGPoint();g.x=f[0],g.y=f[1],h.x=f[0]+f[2],h.y=f[1]+f[3];let i=g.matrixTransform(e),j=h.matrixTransform(e);setViewBox(a,i.x,i.y,j.x-i.x,j.y-i.y);},translate=function(a,b,c){let d=getViewBox(a);null==d&&setDefaultViewBox(a),d[0]+=b,d[1]+=c,a.setAttributeNS(null,"viewBox",d.join(" "));},convertToViewBox=function(a,b,c){let d=a.createSVGPoint();d.x=b,d.y=c;let e=d.matrixTransform(a.getScreenCTM().inverse()),f=[e.x,e.y];return f.x=e.x,f.y=e.y,f},save=function(b,c="image.svg"){let d=document.createElement("a"),a=new window.XMLSerializer().serializeToString(b),e=vkbeautify$1.xml(a),f=new window.Blob([e],{type:"text/plain"});d.setAttribute("href",window.URL.createObjectURL(f)),d.setAttribute("download",c),d.click();},pErr=new window.DOMParser().parseFromString("INVALID","text/xml").getElementsByTagName("parsererror")[0].namespaceURI,load=function(a,b){if("string"==typeof a||a instanceof String){let c=new window.DOMParser().parseFromString(a,"text/xml");if(0===c.getElementsByTagNameNS(pErr,"parsererror").length){let a=c.documentElement;return null!=b&&b(a),a}fetch(a).then(a=>a.text()).then(a=>new window.DOMParser().parseFromString(a,"text/xml")).then(a=>{let c=a.getElementsByTagName("svg");if(null==c||0==c.length)throw"error, valid XML found, but no SVG element";return null!=b&&b(c[0]),c[0]}).catch(a=>b(null,a));}else if(a instanceof Document)return b(a),a};function Image(){function a(){n.addEventListener("mouseup",f,!1),n.addEventListener("mousedown",e,!1),n.addEventListener("mousemove",d,!1),n.addEventListener("mouseleave",g,!1),n.addEventListener("mouseenter",h,!1),n.addEventListener("touchend",f,!1),n.addEventListener("touchmove",j,!1),n.addEventListener("touchstart",i,!1),n.addEventListener("touchcancel",f,!1);}function b(a,b){r.prev=r.position,r.position=convertToViewBox(n,a,b),r.x=r.position[0],r.y=r.position[1];}function c(){r.drag=[r.position[0]-r.pressed[0],r.position[1]-r.pressed[1]],r.drag.x=r.drag[0],r.drag.y=r.drag[1];}function d(a){b(a.clientX,a.clientY),r.isPressed&&c(),null!=E&&E(Object.assign({},r));}function e(a){r.isPressed=!0,r.pressed=convertToViewBox(n,a.clientX,a.clientY),null!=F&&F(Object.assign({},r));}function f(){r.isPressed=!1,null!=G&&G(Object.assign({},r));}function g(a){b(a.clientX,a.clientY),null!=H&&H(Object.assign({},r));}function h(a){b(a.clientX,a.clientY),null!=I&&I(Object.assign({},r));}function i(a){a.preventDefault();let b=a.touches[0];null==b||(r.isPressed=!0,r.pressed=convertToViewBox(n,b.clientX,b.clientY),null!=F&&F(Object.assign({},r)));}function j(a){a.preventDefault();let d=a.touches[0];null==d||(b(d.clientX,d.clientY),r.isPressed&&c(),null!=E&&E(Object.assign({},r)));}function k(a){null!=J&&clearInterval(L),J=a,null!=J&&(K=0,L=setInterval(()=>{let a={time:n.getCurrentTime(),frame:K++};J(a);},1e3/60));}let l,m=Array.from(arguments),n=svg(),o=1,p=0,q=n.createSVGMatrix(),r={isPressed:!1,position:[0,0],pressed:[0,0],drag:[0,0],prev:[0,0],x:0,y:0};const s=function(a,b=0,c=0){o=a,scale(n,a,b,c);},t=function(a,b){translate(n,a,b);},u=function(a,b,c,d){setViewBox(n,a,b,c,d,p);},v=function(){return getViewBox(n)},w=function(a){n.appendChild(a);},x=function(a){for(null==a&&(a=n);a.lastChild;)a.removeChild(a.lastChild);},y=function(a="image.svg"){return save(n,a)},z=function(a,b){if(null!=a&&null!=b){let c=getViewBox(n);setViewBox(n,c[0],c[1],a,b,p),n.setAttributeNS(null,"width",a),n.setAttributeNS(null,"height",b);}},A=function(){let a=parseInt(n.getAttributeNS(null,"width"));return null==a?n.getBoundingClientRect().width:a},B=function(){let a=parseInt(n.getAttributeNS(null,"height"));return null==a?n.getBoundingClientRect().height:a},C=function(){let b=m.filter(a=>"function"==typeof a),c=m.filter(a=>!isNaN(a)),d=m.filter(a=>a instanceof HTMLElement).shift(),e=m.filter(b=>"string"==typeof b||b instanceof String).map(a=>document.getElementById(a)).shift();if(l=null==d?null==e?document.body:e:d,l.appendChild(n),2<=c.length)n.setAttributeNS(null,"width",c[0]),n.setAttributeNS(null,"height",c[1]),setViewBox(n,0,0,c[0],c[1]);else if(null==n.getAttribute("viewBox")){let a=n.getBoundingClientRect();setViewBox(n,0,0,a.width,a.height);}1<=b.length&&b[0](),a();};let D=m.filter(a=>!isNaN(a));2<=D.length&&(n.setAttributeNS(null,"width",D[0]),n.setAttributeNS(null,"height",D[1]),setViewBox(n,0,0,D[0],D[1])),"loading"===document.readyState?document.addEventListener("DOMContentLoaded",C):C();let E,F,G,H,I,J,K,L;return {zoom:s,translate:t,appendChild:w,removeChildren:x,load:function(b,c){load(b,function(b,d){null!=b&&(l.removeChild(n),n=b,l.appendChild(n),a()),null!=c&&c(b,d);});},save:y,setViewBox:u,getViewBox:v,size:z,get scale(){return o},get svg(){return n},get width(){return A()},get height(){return B()},set width(a){n.setAttributeNS(null,"width",a);},set height(a){n.setAttributeNS(null,"height",a);},set onMouseMove(a){E=a;},set onMouseDown(a){F=a;},set onMouseUp(a){G=a;},set onMouseLeave(a){H=a;},set onMouseEnter(a){I=a;},set animate(a){k(a);}}}

	var svg$1 = /*#__PURE__*/Object.freeze({
		Image: Image,
		setPoints: setPoints,
		setArc: setArc,
		line: line$1,
		circle: circle,
		rect: rect,
		polygon: polygon,
		polyline: polyline,
		bezier: bezier,
		text: text,
		wedge: wedge,
		arc: arc,
		regularPolygon: regularPolygon,
		group: group,
		svg: svg,
		addClass: addClass,
		removeClass: removeClass,
		setId: setId,
		removeChildren: removeChildren,
		setViewBox: setViewBox,
		setDefaultViewBox: setDefaultViewBox,
		getViewBox: getViewBox,
		scale: scale,
		translate: translate,
		convertToViewBox: convertToViewBox,
		save: save,
		load: load
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

	const face_coloring = function(graph, root_face = 0){
		let coloring = [];
		coloring[root_face] = false;
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
		// these arrays change their size, their contents are untouched
		if(graph.edges_vertices != null){
			graph.edges_vertices = graph.edges_vertices
				.filter((e,i) => !removes[i]);
		}
		if(graph.edges_faces != null){
			graph.edges_faces = graph.edges_faces
				.filter((e,i) => !removes[i]);
		}
		if(graph.edges_assignment != null){
			graph.edges_assignment = graph.edges_assignment
				.filter((e,i) => !removes[i]);
		}
		if(graph.edges_foldAngle != null){
			graph.edges_foldAngle = graph.edges_foldAngle
				.filter((e,i) => !removes[i]);
		}
		if(graph.edges_length != null){
			graph.edges_length = graph.edges_length
				.filter((e,i) => !removes[i]);
		}
		return index_map;
		// todo: do the same with frames in file_frames where inherit=true
	};


	/** Removes faces, updates all relevant array indices
	 *
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
		// these arrays change their size, their contents are untouched
		if (graph.faces_vertices != null) {
			graph.faces_vertices = graph.faces_vertices
				.filter((e,i) => !removes[i]);
		}
		if (graph.faces_edges != null) {
			graph.faces_edges = graph.faces_edges
				.filter((e,i) => !removes[i]);
		}
		return index_map;
		// todo: do the same with frames in file_frames where inherit=true
	}

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
		face_coloring: face_coloring,
		make_face_walk_tree: make_face_walk_tree,
		add_vertex_on_edge: add_vertex_on_edge,
		get_boundary_face: get_boundary_face,
		get_boundary_vertices: get_boundary_vertices,
		connectedGraphs: connectedGraphs,
		remove_vertices: remove_vertices,
		remove_edges: remove_edges,
		remove_faces: remove_faces
	});

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
		let faces_map = remove_faces(graph, [faceIndex]);

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
		clip_line: clip_line
	});

	/**
	 * Each of these should return an array of Edges
	 * 
	 * Each of the axioms create full-page crease lines
	 *  ending at the boundary; in non-convex paper, this
	 *  could result in multiple edges
	 */

	function crease_folded(graph, point, vector, face_index) {
		// if face isn't set, it will be determined by whichever face
		// is directly underneath point. or if none, index 0.
		if (face_index == null) {
			// todo, detect face under point
			face_index = 0;
			// let faces = Array.from(chopReflect.svg.childNodes)
			// 	.filter(el => el.getAttribute('id') == 'faces')
			// 	.shift();
			// faces.childNodes[face_index].setAttribute("class", "face");
			// face_index = found;
		}
		let primaryLine = Line(point, vector);
		let coloring = face_coloring(graph, face_index);
		make_faces_matrix_inv(graph, face_index)
			.map(m => primaryLine.transform(m))
			.reverse()
			.forEach((line, reverse_i, arr) => {
				let i = arr.length - 1 - reverse_i;
				split_convex_polygon$1(graph, i, line.point, line.vector, coloring[i] ? "M" : "V");
			});
	}

	function crease_line(graph, point, vector) {
		// let boundary = Graph.get_boundary_vertices(graph);
		// let poly = boundary.map(v => graph.vertices_coords[v]);
		// let edge_map = Array.from(Array(graph.edges_vertices.length)).map(_=>0);
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

		let edge_vertices = edge.endpoints
			.map(ep => graph.vertices_coords
				.map(v => Math.sqrt(Math.pow(ep[0]-v[0],2)+Math.pow(ep[1]-v[1],2)))
				.map((d,i) => d < 0.00000001 ? i : undefined)
				.filter(el => el !== undefined)
				.shift()
			).map((v,i) => {
				if (v !== undefined) { return v; }
				// else
				graph.vertices_coords.push(edge.endpoints[i]);
				return graph.vertices_coords.length - 1;
			});

		graph.edges_vertices.push(edge_vertices);
		graph.edges_assignment.push("F");
		return [graph.edges_vertices.length-1];
	};


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
			return RabbitEar.math.core.geometry.counter_clockwise_angle2(v, nextV);
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
		kawasaki_solutions: kawasaki_solutions,
		kawasaki_collapse: kawasaki_collapse,
		fold_without_layering: fold_without_layering
	});

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
		graph.json = function() {
			let fold_file = Object.create(null);
			Object.assign(fold_file, graph);
			cpObjKeys.forEach(key => delete fold_file[key]);
			return JSON.parse(JSON.stringify(fold_file));
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

		graph.addVertexOnEdge = function(x, y, oldEdgeIndex) {
			add_vertex_on_edge(graph, x, y, oldEdgeIndex);
			if (typeof graph.onchange === "function") { graph.onchange(); }
		};
		graph.connectedGraphs = function() {
			return connectedGraphs(graph);
			if (typeof graph.onchange === "function") { graph.onchange(); }
		};
		graph.axiom1 = function() {
			return Crease(this, axiom1$1(graph, ...arguments));
		};
		graph.axiom2 = function() {
			return Crease(this, axiom2$1(graph, ...arguments));
		};
		graph.axiom3 = function() {
			return Crease(this, axiom3$1(graph, ...arguments));
		};
		graph.axiom4 = function() {
			return Crease(this, axiom4$1(graph, ...arguments));
		};
		graph.axiom5 = function() {
			return Crease(this, axiom5$1(graph, ...arguments));
		};
		graph.axiom6 = function() {
			return Crease(this, axiom6$1(graph, ...arguments));
		};
		graph.axiom7 = function() {
			return Crease(this, axiom7$1(graph, ...arguments));
		};
		graph.creaseRay = function() {
			return Crease(this, creaseRay(graph, ...arguments));
		};
		graph.creaseSegment = function() {
			return Crease(this, creaseSegment(graph, ...arguments));
		};
		graph.kawasaki = function() {
			return Crease(this, kawasaki_collapse(graph, ...arguments));
		};

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
			get index() { return _index; },
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
		const remove = function() { };
		const addVertexOnEdge = function(x, y) {
			let thisEdge = this.index;
			graph.addVertexOnEdge(x, y, thisEdge);
		};

		return {
			get index() { return _index; },
			mountain,
			valley,
			mark,
			flip,
			get isMountain(){ return is_mountain(); },
			get isValley(){ return is_valley(); },
			remove,
			addVertexOnEdge
		};
	};

	const Vertex = function(_graph, _index) {

		return {
			get index() { return _index; },
		};
	};

	const Face = function(_graph, _index) {

		return {
			get index() { return _index; },
		};
	};

	/** deep clone an object */
	const clone$1 = function(thing){
		// types to check:, "undefined" / "null", "boolean", "number", "string", "symbol", "function", "object"
		return JSON.parse(JSON.stringify(thing));  // might be a faster way
		// recurse over each entry. todo
		// if(thing == null || typeof thing == "boolean" || typeof thing ==  "number" ||
		//    typeof thing ==  "string" || typeof thing ==  "symbol"){ return thing; }
		// var copy = (thing.constructor === Array) ? thing.slice() : Object.assign({},thing);
		// Object.entries(copy)
		// 	.filter(([k,v]) => typeof v == "object" || typeof v == "symbol" || typeof v == "function")
		// 	.forEach(([k,v]) => copy[k] = clone(copy[k]) )
		// return copy;
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
				let copy = clone$1(fold_file);
				fold_file.file_frames = swap;
				delete copy.file_frames;
				dontCopy.forEach(key => delete copy[key]);
				return copy;
			}
			let copy = clone$1(fold_file.file_frames[frame-1]);
			dontCopy.forEach(key => delete copy[key]);
			return copy;
		}).reduce((prev,curr) => Object.assign(prev,curr),{})
	};


	const merge_frame$1 = function(fold_file, frame){
		const dontCopy = ["frame_parent", "frame_inherit"];
		let copy = clone$1(frame);
		dontCopy.forEach(key => delete copy[key]);
		// don't deep copy file_frames. stash. bring them back.
		let swap = fold_file.file_frames;
		fold_file.file_frames = null;
		let fold = clone$1(fold_file);
		fold_file.file_frames = swap;
		delete fold.file_frames;
		// merge 2
		Object.assign(fold, frame);
		return fold;
	};

	var file = /*#__PURE__*/Object.freeze({
		clone: clone$1,
		flatten_frame: flatten_frame,
		merge_frame: merge_frame$1
	});

	/** .FOLD file viewer
	 * this is an SVG based front-end for the .fold file format
	 *  (.fold file spec: https://github.com/edemaine/fold)
	 *
	 *  View constructor arguments:
	 *   - fold file
	 *   - DOM object, or "string" DOM id to attach to
	 */

	const CREASE_DIR = {
		"B": "boundary", "b": "boundary",
		"M": "mountain", "m": "mountain",
		"V": "valley",   "v": "valley",
		"F": "mark",     "f": "mark",
		"U": "mark",     "u": "mark"
	};

	function View() {

		let canvas = Image(...arguments);
		//  from arguments, get a fold file, if it exists
		let _cp = RabbitEar.CreasePattern(...arguments);
		// tie handler from crease pattern
		_cp.onchange = function() {
			draw();
		};

		// prepare SVG
		let groups = {
			boundary: group(undefined, "boundary"),
			faces: group(undefined, "faces"),
			creases: group(undefined, "creases"),
			vertices: group(undefined, "vertices"),
		};
		canvas.svg.appendChild(groups.boundary);
		canvas.svg.appendChild(groups.faces);
		canvas.svg.appendChild(groups.creases);
		canvas.svg.appendChild(groups.vertices);

		// view properties
		let style = {
			vertex:{ radius: 0.01 },  // radius, percent of page
		};
		let _mouse = {
			isPressed: false,// is the mouse button pressed (y/n)
			position: [0,0], // the current position of the mouse
			pressed: [0,0],  // the last location the mouse was pressed
			drag: [0,0],     // vector, displacement from start to now
			prev: [0,0],     // on mouseMoved, this was the previous location
			x: 0,      // redundant data --
			y: 0       // -- these are the same as position
		};

		let frame;

		const drawFolded = function(graph) {
			// gather components
			let verts = graph.vertices_coords;
			// let edges = graph.edges_vertices.map(ev => ev.map(v => verts[v]));
			// let eAssignments = graph.edges_assignment.map(a => CREASE_DIR["F"]);
			let fAssignments = graph.faces_vertices.map(fv => "face folded");
			// todo: ask if faces V or faces E doesn't exist, grab available one
			let facesV = graph.faces_vertices
				.map(fv => fv.map(v => verts[v]))
				.map(face => Polygon(face));
			let boundary = get_boundary_vertices(graph)
				.map(v => graph.vertices_coords[v]);
			
			// clear layers
			Object.keys(groups).forEach((key) => removeChildren(groups[key]));
			// boundary
			// SVG.polygon(boundary, "boundary", null, groups.boundary);
			// // vertices
			// verts.forEach((v,i) => SVG.circle(v[0], v[1], style.vertex.radius, "vertex", ""+i, groups.vertices));
			// // edges
			// edges.forEach((e,i) =>
			// 	SVG.line(e[0][0], e[0][1], e[1][0], e[1][1], eAssignments[i], ""+i, groups.creases)
			// );
			// faces
			if (graph["re:faces_layer"] && graph["re:faces_layer"].length > 0) {
				graph["re:faces_layer"].forEach((fi,i) =>
					polygon(facesV[fi].points, i%2==0 ? "face-front" : "face-back", "face", groups.faces)
				);
			} else if (graph.facesOrder && graph.facesOrder.length > 0) ; else {
				facesV.forEach((face, i) =>
					polygon(face.points, fAssignments[i], "face", groups.faces)
				);
			}
		};
		const drawCP = function(graph) {
			// gather components
			let verts = graph.vertices_coords;
			let edges = graph.edges_vertices.map(ev => ev.map(v => verts[v]));
			let eAssignments = graph.edges_assignment.map(a => CREASE_DIR[a]);
			let fAssignments = graph.faces_vertices.map(fv => "face");
			let facesV = !(graph.faces_vertices) ? [] : graph.faces_vertices
				.map(fv => fv.map(v => verts[v]))
				.map(face => Polygon(face));
			let facesE = !(graph.faces_edges) ? [] : graph.faces_edges
				.map(face_edges => face_edges
					.map(edge => graph.edges_vertices[edge])
					.map((vi,i,arr) => {
						let next = arr[(i+1)%arr.length];
						return (vi[1] === next[0] || vi[1] === next[1]
							? vi[0] : vi[1]);
					}).map(v => graph.vertices_coords[v])
				)
				.map(face => Polygon(face));
			let boundary = get_boundary_vertices(graph)
				.map(v => graph.vertices_coords[v]);
			
			facesV = facesV.map(face => face.scale(0.6666));
			facesE = facesE.map(face => face.scale(0.8333));
			// clear layers
			Object.keys(groups).forEach((key) => removeChildren(groups[key]));
			// boundary
			polygon(boundary, "boundary", null, groups.boundary);
			// vertices
			verts.forEach((v,i) => circle(v[0], v[1], style.vertex.radius, "vertex", ""+i, groups.vertices));
			// edges
			edges.forEach((e,i) =>
				line$1(e[0][0], e[0][1], e[1][0], e[1][1], eAssignments[i], ""+i, groups.creases)
			);
			// faces
			facesV.forEach((face, i) =>
				polygon(face.points, fAssignments[i], "face", groups.faces)
			);
			facesE.forEach((face, i) =>
				polygon(face.points, fAssignments[i], "face", groups.faces)
			);
		};

		const draw = function() {
			if (_cp.vertices_coords == null){ return; }
			let graph = frame ? flatten_frame(_cp, frame) : _cp;
			if (isFolded()) {
				drawFolded(graph);
			} else{
				drawCP(graph);
			}
			updateViewBox();
		};
		
		const updateViewBox = function() {
			// calculate bounds
			let xSorted = _cp.vertices_coords.slice().sort((a,b) => a[0] - b[0]);
			let ySorted = _cp.vertices_coords.slice().sort((a,b) => a[1] - b[1]);
			let boundsX = xSorted.shift()[0];
			let boundsY = ySorted.shift()[1];
			let boundsW = xSorted.pop()[0] - boundsX;
			let boundsH = ySorted.pop()[1] - boundsY;
			let isInvalid = isNaN(boundsX) || isNaN(boundsY) ||
			                isNaN(boundsW) || isNaN(boundsH);
			if (isInvalid) {
				setViewBox(canvas.svg, 0, 0, 1, 1);
			} else{
				setViewBox(canvas.svg, boundsX, boundsY, boundsW, boundsH);
			}
		};

		const nearest = function() {
			let point = Vector$1(...arguments);
			let nearestVertex = _cp.nearestVertex(point[0], point[1]);
			let nearestEdge = _cp.nearestEdge(point[0], point[1]);
			let nearestFace = _cp.nearestFace(point[0], point[1]);

			let nearest = {};

			if (nearestVertex != null) {
				nearestVertex.svg = groups.vertices.childNodes[nearestVertex.index];
				nearest.vertex = nearestVertex;
			}
			if (nearestEdge != null) {
				nearestEdge.svg = groups.creases.childNodes[nearestEdge.index];
				nearest.edge = nearestEdge;
			}
			if (nearestFace != null) {
				nearestFace.svg = groups.faces.childNodes[nearestFace.index];
				nearest.face = nearestFace;
			}

			return nearest;

			// var junction = (node != undefined) ? node.junction() : undefined;
			// if(junction === undefined){
			// 	var sortedJunction = this.junctions
			// 		.map(function(el){ return {'junction':el, 'distance':point.distanceTo(el.origin)};},this)
			// 		.sort(function(a,b){return a['distance']-b['distance'];})
			// 		.shift();
			// 	junction = (sortedJunction !== undefined) ? sortedJunction['junction'] : undefined
			// }

			// var sector = (junction !== undefined) ? junction.sectors.filter(function(el){
			// 	return el.contains(point);
			// },this).shift() : undefined;
		};

		const save$$1 = function() {

		};

		const load$$1 = function(input, callback) { // epsilon
			// are they giving us a filename, or the data of an already loaded file?
			if (typeof input === 'string' || input instanceof String){
				let extension = input.substr((input.lastIndexOf('.') + 1));
				// filename. we need to upload
				switch(extension){
					case 'fold':
					fetch(input)
						.then((response) => response.json())
						.then((data) => {
							_cp = data;
							draw();
							if(callback != null){ callback(_cp); }
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
		const isFolded = function() {
			// try to discern folded state
			if(_cp == null || _cp.frame_classes == null){ return false; }
			return _cp.frame_classes.includes("foldedState");
		};

		const makeVertices = function() {
			return _cp.vertices_coords == null
				? []
				: _cp.vertices_coords.map(v => Vector$1(v));
		};
		const makeEdges = function() {
			return _cp.edges_vertices == null
				? []
				: _cp.edges_vertices
					.map(e => e.map(ev => _cp.vertices_coords[ev]))
					.map(e => Edge(e));
		};
		const makeFaces = function() {
			return _cp.faces_vertices == null
				? []
				: _cp.faces_vertices
					.map(f => f.map(fv => _cp.vertices_coords[fv]))
					.map(f => Polygon(f));
		};

		const showVertices = function(){ groups.vertices.removeAttribute("visibility");};
		const hideVertices = function(){ groups.vertices.setAttribute("visibility", "hidden");};
		const showEdges = function(){ groups.creases.removeAttribute("visibility");};
		const hideEdges = function(){ groups.creases.setAttribute("visibility", "hidden");};
		const showFaces = function(){ groups.faces.removeAttribute("visibility");};
		const hideFaces = function(){ groups.faces.setAttribute("visibility", "hidden");};

		function addClass$$1(node, className) { addClass(node, className); }
		function removeClass$$1(node, className) { removeClass(node, className); }

		const clear = function() {
			// todo: remove all creases from current CP, leave the boundary.
		};

		const crease = function(a, b, c, d){
			// Folder.
		};

		const fold = function(face){
			// return Folder.fold_without_layering(_cp, face);
		};
		// crease pattern functions for convenience
		const axiom1 = function() { return _cp.axiom1(...arguments); };
		const axiom2 = function() { return _cp.axiom2(...arguments); };
		const axiom3 = function() { return _cp.axiom3(...arguments); };
		const axiom4 = function() { return _cp.axiom4(...arguments); };
		const axiom5 = function() { return _cp.axiom5(...arguments); };
		const axiom6 = function() { return _cp.axiom6(...arguments); };
		const axiom7 = function() { return _cp.axiom7(...arguments); };

		// init this object
		draw();

		// return Object.freeze({
		return {
			get mouse() { return JSON.parse(JSON.stringify(_mouse)); },
			set cp(c){
				_cp = c;
				draw();
				_cp.onchange = function() {
					draw();
				};
			},
			get cp(){ return _cp; },
			get vertices() { return makeVertices(); },
			get edges() { return makeEdges(); },
			get faces() { return makeFaces(); },

			get frameCount() {
				return _cp.file_frames ? _cp.file_frames.length : 0;
			},
			set frame(f) {
				frame = f;
				draw();
			},

			nearest,
			addClass: addClass$$1,
			removeClass: removeClass$$1,

			clear,
			crease,
			fold,
			axiom1, axiom2, axiom3, axiom4, axiom5, axiom6, axiom7,
			isFolded,

			draw,
			updateViewBox,

			showVertices, showEdges, showFaces,
			hideVertices, hideEdges, hideFaces,
		
			load: load$$1,
			save: save$$1,
			get svg() { return canvas.svg; },
			get zoom() { return canvas.zoom; },
			get translate() { return canvas.translate; },
			get appendChild() { return canvas.appendChild; },
			get removeChildren() { return canvas.removeChildren; },
			get size() { return canvas.size; },
			get scale() { return canvas.scale; },
			get width() { return canvas.width; },
			get height() { return canvas.height; },
			set width(a) { canvas.width = a; },
			set height(a) { canvas.height = a; },
			set onMouseMove(a) { canvas.onMouseMove = a; },
			set onMouseDown(a) { canvas.onMouseDown = a; },
			set onMouseUp(a) { canvas.onMouseUp = a; },
			set onMouseLeave(a) { canvas.onMouseLeave = a; },
			set onMouseEnter(a) { canvas.onMouseEnter = a; },
			set animate(a) { canvas.animate = a; },

			set setFolded(_folded) {
				_cp.frame_classes = _cp.frame_classes
					.filter(a => a !== "creasePattern");
				_cp.frame_classes = _cp.frame_classes
					.filter(a => a !== "foldedState");
				_cp.frame_classes.push("foldedState");
				// todo re-call draw()
			},

		};
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
						.then((response) => response.json())
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

	function valleyfold(foldFile, line, point){

		if(point != null){ point = [point.x, point.y]; }
		let linePoint = [line.point.x, line.point.y];
		let lineVector = [line.direction.x, line.direction.y];

		// if (point == null) point = [0.6, 0.6];
		if (point != null) {
			// console.log("Jason Code!");
			let new_fold = split_folding_faces(
				foldFile, 
				linePoint, 
				lineVector,
				point
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
			.map(f => Geom.core.intersection.point_in_polygon(f, point))
			.indexOf(true);
		// make face-adjacent faces on only a subset, the side we clicked on
		let moving_side = new_face_map.map(f => f[side]);
		let faces_faces = Graph.make_faces_faces({faces_vertices:moving_side});
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
		Graph.remove_isolated_vertices(cleaned);

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
		let faces_matrix = Graph.make_faces_matrix({vertices_coords:reflected.vertices_coords, 
			faces_vertices:cleaned.faces_vertices}, bottom_face);
		let inverseMatrices = faces_matrix.map(n => Geom.core.make_matrix2_inverse(n));

		let new_vertices_coords_cp = reflected.vertices_coords.map((point,i) =>
			Geom.core.multiply_vector2_matrix2(point, inverseMatrices[vertex_in_face[i]]).map((n) => 
				Geom.core.clean_number(n)
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
		
		Graph.faces_vertices_to_edges(new_fold);

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
				"clip":Geom.core.intersection.clip_line_in_poly(poly, linePoint, lineVector)
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
			let keys = clipLines[faceIndex].collinear.map(e => e.sort((a,b) => a-b).join(" "));
			keys.forEach((k,i) => edgeCrossings[k] = ({
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
			  if (Geom.core.intersection.polygons_overlap(faces_points[idx1], faces_points[idx2])) {
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
		var matrix = Geom.core.make_matrix_reflection(lineVector, linePoint);

		var top_layer = faces_layer.slice(0, stay_layers);
		var bottom_layer = faces_layer.slice(stay_layers, stay_layers + faces_layer.length-stay_layers);
		bottom_layer.reverse();

		var boolArray = vertices_coords.map(() => false);

		for(var i = stay_layers; i < faces_vertices.length; i++){
			for(var f = 0; f < faces_vertices[i].length; f++){
				if(!boolArray[ faces_vertices[i][f] ]){
					var vert = vertices_coords[ faces_vertices[i][f] ];
					vertices_coords[ faces_vertices[i][f] ] = Geom.core.multiply_vector2_matrix2(vert, matrix);
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
				return Geom.core.intersection.point_in_polygon(points, point) ? fi : -1;
			}).reduce((acc, fi) => {
				return ((acc === -1) || 
								((fi !== -1) && (faces_layer[fi] > faces_layer[acc]))
				) ? fi : acc;
			}, -1);
		return (top_fi === -1) ? undefined : top_fi;
	};

	var valleyfold$1 = /*#__PURE__*/Object.freeze({
		default: valleyfold
	});

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

	function crease_through_layers(fold_file, linePoint, lineVector){
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
		crease_through_layers: crease_through_layers,
		clip_edges_with_line: clip_edges_with_line
	});

	var empty = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [],\n\t\"frame_title\": \"\",\n\t\"frame_attributes\": [],\n\t\"frame_classes\": [],\n\t\"vertices_coords\": [],\n\t\"vertices_vertices\": [],\n\t\"vertices_faces\": [],\n\t\"edges_vertices\": [],\n\t\"edges_faces\": [],\n\t\"edges_assignment\": [],\n\t\"edges_foldAngle\": [],\n\t\"edges_length\": [],\n\t\"faces_vertices\": [],\n\t\"faces_edges\": [],\n\t\"edgeOrders\": [],\n\t\"faceOrders\": [],\n\t\"file_frames\": []\n}";

	var book = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"\",\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [[0,0], [0.5,0], [1,0], [1,1], [0.5,1], [0,1]],\n\t\"vertices_vertices\": [[1,5], [2,4,0], [3,1], [4,2], [5,1,3], [0,4]],\n\t\"vertices_faces\": [[0], [0,1], [1], [1], [1,0], [0]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [1,4]],\n\t\"edges_faces\": [[0], [1], [1], [1], [0], [0], [0,1]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"V\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 180],\n\t\"edges_length\": [0.5, 0.5, 1, 0.5, 0.5, 1, 1],\n\t\"faces_vertices\": [[1,4,5,0], [4,1,2,3]],\n\t\"faces_edges\": [[6,4,5,0], [6,1,2,3]]\n}";

	var blintz = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"blintz base\",\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [[0,0], [0.5,0], [1,0], [1,0.5], [1,1], [0.5,1], [0,1], [0,0.5]],\n\t\"vertices_vertices\": [[1,7], [2,3,7,0], [3,1], [4,5,1,2], [5,3], [6,7,3,4], [7,5], [0,1,5,6]],\n\t\"vertices_faces\": [[0], [1,4,0], [1], [2,4,1], [2], [3,4,2], [3], [0,4,3]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,0], [1,3], [3,5], [5,7], [7,1]],\n\t\"edges_faces\": [[0], [1], [1], [2], [2], [3], [3], [0], [1,4], [2,4], [3,4], [0,4]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"V\",\"V\",\"V\",\"V\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n\t\"edges_length\": [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.707106781186548, 0.707106781186548, 0.707106781186548, 0.707106781186548],\n\t\"faces_vertices\": [[0,1,7], [2,3,1], [4,5,3], [6,7,5], [1,3,5,7]],\n\t\"faces_edges\": [[0,11,7], [2,8,1], [4,9,3], [6,10,5], [8,9,10,11]],\n\t\"file_frames\": [{\n\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\"frame_parent\": 0,\n\t\t\"frame_inherit\": true,\n\t\t\"vertices_coords\": [[0.5,0.5], [0.5,0.0], [0.5,0.5], [1.0,0.5], [0.5,0.5], [0.5,1.0], [0.5,0.5], [0.0,0.5]],\n\t\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 180, 180, 180, 180],\n\t\t\"faceOrders\": [[0,4,1], [1,4,1], [2,4,1], [3,4,1]]\n\t}]\n}";

	var kite = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"kite base\",\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [[0,0], [0.414213562373095,0], [1,0], [1,0.585786437626905], [1,1], [0,1]],\n\t\"vertices_vertices\": [[1,5], [2,5,0], [3,5,1], [4,5,2], [5,3], [0,1,2,3,4]],\n\t\"vertices_faces\": [[0], [1,0], [2,1], [3,2], [3], [0,1,2,3]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [5,1], [3,5], [5,2]],\n\t\"edges_faces\": [[0], [1], [2], [3], [3], [0], [0,1], [3,2], [1,2]],\n\t\"edges_assignment\": [\"B\", \"B\", \"B\", \"B\", \"B\", \"B\", \"V\", \"V\", \"F\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 0],\n\t\"edges_length\": [0.414213562373095, 0.585786437626905, 0.585786437626905, 0.414213562373095, 1, 1, 1.082392200292394, 1.082392200292394, 1.414213562373095],\n\t\"faces_vertices\": [[0,1,5], [1,2,5], [2,3,5], [3,4,5]],\n\t\"faces_edges\": [[0,6,5], [1,8,6], [2,7,8], [3,4,7]],\n\t\"file_frames\": [{\n\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\"frame_parent\": 0,\n\t\t\"frame_inherit\": true,\n\t\t\"vertices_coords\": [[0.707106781186548,0.292893218813452],[1,0],[0.707106781186548,0.292893218813452],[0,1],[0.414213562373095,0],[1,0.585786437626905]],\n\t\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 180, 180, 0],\n\t\t\"faceOrders\": [[0,1,1], [3,2,1]]\n\t}]\n}";

	var fish = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"\",\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [[0,0],[1,0],[1,1],[0,1],[0.292893218813452,0.292893218813452],[0.707106781186548,0.707106781186548],[0.292893218813452,0],[1,0.707106781186548]],\n\t\"edges_vertices\": [[2,3],[3,0],[3,1],[0,4],[1,4],[3,4],[1,5],[2,5],[3,5],[4,6],[0,6],[6,1],[5,7],[1,7],[7,2]],\n\t\"edges_assignment\": [\"B\",\"B\",\"F\",\"M\",\"M\",\"M\",\"M\",\"M\",\"M\",\"V\",\"B\",\"B\",\"V\",\"B\",\"B\"],\n\t\"faces_vertices\": [[2,3,5],[3,0,4],[3,1,5],[1,3,4],[4,0,6],[1,4,6],[5,1,7],[2,5,7]],\n\t\"faces_edges\": [[0,8,7],[1,3,5],[2,6,8],[2,5,4],[3,10,9],[4,9,11],[6,13,12],[7,12,14]],\n\t\"file_frames\": [{\n\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\"frame_parent\": 0,\n\t\t\"frame_inherit\": true,\n\t\t\"vertices_coords\": [[0.707106781186548,0.292893218813452],[1,0],[0.707106781186548,0.292893218813452],[0,1],[0.292893218813452,0.292893218813452],[0.707106781186548,0.707106781186548],[0.5,0.5],[0.5,0.5]]\n\t}]\n}";

	var bird = "{\n\t\"file_spec\": 1.1,\n\t\"frame_title\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [[0,0],[1,0],[1,1],[0,1],[0.5,0.5],[0.207106781186548,0.5],[0.5,0.207106781186548],[0.792893218813452,0.5],[0.5,0.792893218813452],[0.353553390593274,0.646446609406726],[0.646446609406726,0.646446609406726],[0.646446609406726,0.353553390593274],[0.353553390593274,0.353553390593274],[0,0.5],[0.5,0],[1,0.5],[0.5,1]],\n\t\"edges_vertices\": [[3,5],[5,9],[3,9],[3,13],[5,13],[0,5],[0,13],[0,12],[5,12],[4,5],[4,12],[4,9],[0,6],[6,12],[0,14],[6,14],[1,6],[1,14],[1,11],[6,11],[4,6],[4,11],[1,7],[7,11],[1,15],[7,15],[2,7],[2,15],[2,10],[7,10],[4,7],[4,10],[2,8],[8,10],[2,16],[8,16],[3,8],[3,16],[8,9],[4,8]],\n\t\"edges_faces\": [[0,1],[0,5],[21,0],[1],[2,1],[2,3],[2],[3,6],[4,3],[4,5],[11,4],[5,22],[6,7],[6,11],[7],[8,7],[8,9],[8],[9,12],[10,9],[10,11],[17,10],[12,13],[12,17],[13],[14,13],[14,15],[14],[15,18],[16,15],[16,17],[23,16],[18,19],[18,23],[19],[20,19],[20,21],[20],[22,21],[22,23]],\n\t\"edges_assignment\": [\"M\",\"F\",\"V\",\"B\",\"V\",\"M\",\"B\",\"F\",\"F\",\"M\",\"F\",\"V\",\"M\",\"F\",\"B\",\"V\",\"M\",\"B\",\"V\",\"F\",\"M\",\"V\",\"M\",\"F\",\"B\",\"V\",\"M\",\"B\",\"F\",\"F\",\"M\",\"F\",\"M\",\"F\",\"B\",\"V\",\"M\",\"B\",\"F\",\"M\"],\n\t\"faces_vertices\": [[3,5,9],[5,3,13],[0,5,13],[5,0,12],[4,5,12],[5,4,9],[0,6,12],[6,0,14],[1,6,14],[6,1,11],[4,6,11],[6,4,12],[1,7,11],[7,1,15],[2,7,15],[7,2,10],[4,7,10],[7,4,11],[2,8,10],[8,2,16],[3,8,16],[8,3,9],[4,8,9],[8,4,10]],\n\t\"faces_edges\": [[0,1,2],[0,3,4],[5,4,6],[5,7,8],[9,8,10],[9,11,1],[12,13,7],[12,14,15],[16,15,17],[16,18,19],[20,19,21],[20,10,13],[22,23,18],[22,24,25],[26,25,27],[26,28,29],[30,29,31],[30,21,23],[32,33,28],[32,34,35],[36,35,37],[36,2,38],[39,38,11],[39,31,33]]\n}";

	var frog = "{\n\t\"file_spec\": 1.1,\n\t\"frame_title\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [[0,0],[1,0],[1,1],[0,1],[0.5,0.5],[0,0.5],[0.5,0],[1,0.5],[0.5,1],[0.146446609406726,0.353553390593274],[0.353553390593274,0.146446609406726],[0.646446609406726,0.146446609406726],[0.853553390593274,0.353553390593274],[0.853553390593274,0.646446609406726],[0.646446609406726,0.853553390593274],[0.353553390593274,0.853553390593274],[0.146446609406726,0.646446609406726],[0,0.353553390593274],[0,0.646446609406726],[0.353553390593274,0],[0.646446609406726,0],[1,0.353553390593274],[1,0.646446609406726],[0.646446609406726,1],[0.353553390593274,1]],\n\t\"edges_vertices\": [[0,4],[4,9],[0,9],[0,10],[4,10],[2,4],[2,14],[4,14],[4,13],[2,13],[3,4],[4,15],[3,15],[3,16],[4,16],[1,4],[1,12],[4,12],[4,11],[1,11],[4,5],[5,9],[5,16],[4,6],[6,11],[6,10],[4,7],[7,13],[7,12],[4,8],[8,15],[8,14],[9,17],[0,17],[5,17],[0,19],[10,19],[6,19],[11,20],[1,20],[6,20],[1,21],[12,21],[7,21],[13,22],[2,22],[7,22],[2,23],[14,23],[8,23],[15,24],[3,24],[8,24],[3,18],[16,18],[5,18]],\n\t\"edges_faces\": [[0,1],[0,8],[16,0],[1,18],[11,1],[3,2],[2,26],[15,2],[3,12],[24,3],[4,5],[4,14],[28,4],[5,30],[9,5],[7,6],[6,22],[13,6],[7,10],[20,7],[8,9],[8,17],[31,9],[10,11],[10,21],[19,11],[12,13],[12,25],[23,13],[14,15],[14,29],[27,15],[16,17],[16],[17],[18],[19,18],[19],[20,21],[20],[21],[22],[23,22],[23],[24,25],[24],[25],[26],[27,26],[27],[28,29],[28],[29],[30],[31,30],[31]],\n\t\"edges_assignment\": [\"F\",\"M\",\"M\",\"M\",\"M\",\"F\",\"M\",\"M\",\"M\",\"M\",\"V\",\"M\",\"M\",\"M\",\"M\",\"V\",\"M\",\"M\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\"],\n\t\"faces_vertices\": [[0,4,9],[4,0,10],[4,2,14],[2,4,13],[3,4,15],[4,3,16],[4,1,12],[1,4,11],[4,5,9],[5,4,16],[4,6,11],[6,4,10],[4,7,13],[7,4,12],[4,8,15],[8,4,14],[0,9,17],[9,5,17],[10,0,19],[6,10,19],[1,11,20],[11,6,20],[12,1,21],[7,12,21],[2,13,22],[13,7,22],[14,2,23],[8,14,23],[3,15,24],[15,8,24],[16,3,18],[5,16,18]],\n\t\"faces_edges\": [[0,1,2],[0,3,4],[5,6,7],[5,8,9],[10,11,12],[10,13,14],[15,16,17],[15,18,19],[20,21,1],[20,14,22],[23,24,18],[23,4,25],[26,27,8],[26,17,28],[29,30,11],[29,7,31],[2,32,33],[21,34,32],[3,35,36],[25,36,37],[19,38,39],[24,40,38],[16,41,42],[28,42,43],[9,44,45],[27,46,44],[6,47,48],[31,48,49],[12,50,51],[30,52,50],[13,53,54],[22,54,55]]\n}";

	var test = "{\n\t\"file_spec\":1.1,\n\t\"file_creator\":\"Rabbit Ear\",\n\t\"file_author\":\"Robby Kraft\",\n\t\"file_classes\":[\"singleModel\"],\n\t\"frame_attributes\":[\"2D\"],\n\t\"frame_title\":\"three crease\",\n\t\"frame_classes\":[\"creasePattern\"],\n\t\"vertices_coords\":[\n\t\t[0,0],[1,0],[1,1],[0,1],[1,0.21920709774914],[0,0.75329794695316],[0.1,1],[0,0.9],[0.506713890898239,0],[0.645319539098137,0.408638686308289],[1,0.871265438078371]\n\t],\n\t\"edges_vertices\":[[8,9],[5,9],[0,5],[0,8],[5,7],[9,10],[2,10],[2,6],[6,7],[3,6],[3,7],[1,8],[1,4],[4,9],[4,10]],\n\t\"edges_assignment\":[\"M\",\"M\",\"B\",\"B\",\"B\",\"V\",\"B\",\"B\",\"V\",\"B\",\"B\",\"B\",\"B\",\"M\",\"B\"],\n\t\"faces_vertices\":[[8,9,5,0],[7,5,9,10,2,6],[6,3,7],[8,1,4,9],[9,4,10]],\n\t\"faces_edges\":[[0,1,2,3],[4,1,5,6,7,8],[9,10,8],[11,12,13,0],[13,14,5]],\n\t\"re:faces_layer\":[0,1,2,4,3],\n\t\"file_frames\": [{\n\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\"frame_parent\": 0,\n\t\t\"frame_inherit\": true,\n\t\t\"vertices_coords\":[\n\t\t\t[0.62607055446971, 1.17221733980796],\n\t\t\t[0.44072549605688, 0.90956291495505],\n\t\t\t[1, 1],\n\t\t\t[0.1, 0.9],\n\t\t\t[0.37030057556411, 0.70197659007504],\n\t\t\t[0, 0.75329794695316],\n\t\t\t[0.1, 1],\n\t\t\t[0, 0.9],\n\t\t\t[0.90786114793244, 0.75108431015443],\n\t\t\t[0.64531953909814, 0.40863868630829],\n\t\t\t[1, 0.87126543807837]\n\t\t]\n\t}]\n}";

	var dodecagon = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_title\": \"\",\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [\n\t\t[1,0],[0.8660254,0.5],[0.5,0.8660254],[0,1],[-0.5,0.8660254],[-0.8660254,0.5],[-1,0],[-0.8660254,-0.5],[-0.5,-0.8660254],[0,-1],[0.5,-0.8660254],[0.8660254,-0.5]\n\t],\n\t\"vertices_vertices\": [[11,1], [0,2], [1,3], [2,4], [3,5], [4,6], [5,7], [6,8], [7,9], [8,10], [9,11], [10,0]],\n\t\"vertices_faces\": [[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]],\n\t\"edges_vertices\": [\n\t\t[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,8], [8,9], [9,10], [10,11], [11,0]\n\t],\n\t\"edges_faces\": [[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n\t\"edges_length\": [0.5176381, 0.5176381, 0.5176381, 0.5176381, 0.5176381, 0.5176381, 0.5176381, 0.5176381, 0.5176381, 0.5176381, 0.5176381, 0.5176381],\n\t\"faces_vertices\": [[0,1,2,3,4,5,6,7,8,9,10,11]],\n\t\"faces_edges\": [[0,1,2,3,4,5,6,7,8,9,10,11]]\n}";

	var boundary = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [],\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_title\": \"\",\n\t\"frame_classes\": [],\n\t\"vertices_coords\": [[0.3535533905932738,0.8535533905932737], [-0.3535533905932738,0.8535533905932737], [-0.8535533905932737,0.35355339059327384], [-0.8535533905932737,-0.35355339059327373], [-0.35355339059327384,-0.8535533905932737], [0.3535533905932737,-0.8535533905932738], [0.8535533905932735,-0.3535533905932743], [0.8535533905932736,0.35355339059327395]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,7], [7,6], [6,5], [5,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,0]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\"],\n\t\"faces_vertices\": [[0,1,2,7,6,5,2,3,4,5,6,7]],\n\t\"faces_edges\": [[0,1,2,3,4,5,6,7,8,9,10,11]]\n}";

	var concave = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [],\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_title\": \"\",\n\t\"frame_classes\": [],\n\t\"vertices_coords\": [[0,0], [1,0], [1,0.33333333333333], [0.33333333333333,0.33333333333333], [0.33333333333333,0.66666666666666], [1,0.66666666666666], [1,1], [0,1]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,0]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\"],\n\t\"faces_vertices\": [[0,1,2,3,4,5,6,7]],\n\t\"faces_edges\": [[0,1,2,3,4,5,6,7]]\n}";

	var blintzAnimated = "{\n\t\"file_spec\": 1.1,\n\t\"file_author\": \"Robby Kraft\",\n\t\"file_classes\": [\"singleModel\", \"animation\"],\n\t\"re:file_date\": \"2018-10-14\",\n\t\"frame_title\": \"blintz base\",\n\t\"frame_attributes\": [\"3D\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [\n\t\t[0.0, 0.0, 0.0], [0.5, 0.0, 0.0],\n\t\t[1.0, 0.0, 0.0], [1.0, 0.5, 0.0],\n\t\t[1.0, 1.0, 0.0], [0.5, 1.0, 0.0],\n\t\t[0.0, 1.0, 0.0], [0.0, 0.5, 0.0]\n\t],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,0], [1,3], [3,5], [5,7], [7,1]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"V\",\"V\",\"V\",\"V\"],\n\t\"faces_vertices\": [[0,1,7], [2,3,1], [4,5,3], [6,7,5], [1,3,5,7]],\n\t\"faces_layer\": [4,0,1,2,3],\n\t\"file_frames\": [\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\": 0,\n\t\t\t\"frame_inherit\": true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.0012038183319507678, 0.0012038183319507678, 0.02450428508239015], [0.5, 0.0, 0.0],\n\t\t\t\t[0.9987961816680493, 0.0012038183319507678, 0.02450428508239015], [1.0, 0.5, 0.0],\n\t\t\t\t[0.9987961816680493, 0.9987961816680493, 0.02450428508239015], [0.5, 1.0, 0.0],\n\t\t\t\t[0.0012038183319507678, 0.9987961816680493, 0.02450428508239015], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.004803679899192392, 0.004803679899192392, 0.04877258050403206], [0.5, 0.0, 0.0],\n\t\t\t\t[0.9951963201008076, 0.004803679899192392, 0.04877258050403206], [1.0, 0.5, 0.0],\n\t\t\t\t[0.9951963201008076, 0.9951963201008076, 0.04877258050403206], [0.5, 1.0, 0.0],\n\t\t\t\t[0.004803679899192392, 0.9951963201008076, 0.04877258050403206], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.010764916066947794, 0.010764916066947794, 0.07257116931361558], [0.5, 0.0, 0.0],\n\t\t\t\t[0.9892350839330522, 0.010764916066947794, 0.07257116931361558], [1.0, 0.5, 0.0],\n\t\t\t\t[0.9892350839330522, 0.9892350839330522, 0.07257116931361558], [0.5, 1.0, 0.0],\n\t\t\t\t[0.010764916066947794, 0.9892350839330522, 0.07257116931361558], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.019030116872178315, 0.019030116872178315, 0.09567085809127245], [0.5, 0.0, 0.0],\n\t\t\t\t[0.9809698831278217, 0.019030116872178315, 0.09567085809127245], [1.0, 0.5, 0.0],\n\t\t\t\t[0.9809698831278217, 0.9809698831278217, 0.09567085809127245], [0.5, 1.0, 0.0],\n\t\t\t\t[0.019030116872178315, 0.9809698831278217, 0.09567085809127245], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.029519683912911238, 0.029519683912911238, 0.11784918420649941], [0.5, 0.0, 0.0],\n\t\t\t\t[0.9704803160870887, 0.029519683912911238, 0.11784918420649941], [1.0, 0.5, 0.0],\n\t\t\t\t[0.9704803160870887, 0.9704803160870887, 0.11784918420649941], [0.5, 1.0, 0.0],\n\t\t\t\t[0.029519683912911238, 0.9704803160870887, 0.11784918420649941], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.04213259692436369, 0.04213259692436369, 0.13889255825490054], [0.5, 0.0, 0.0],\n\t\t\t\t[0.9578674030756363, 0.04213259692436369, 0.13889255825490054], [1.0, 0.5, 0.0],\n\t\t\t\t[0.9578674030756363, 0.9578674030756363, 0.13889255825490054], [0.5, 1.0, 0.0],\n\t\t\t\t[0.04213259692436369, 0.9578674030756363, 0.13889255825490054], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.05674738665931575, 0.05674738665931575, 0.15859832104091137], [0.5, 0.0, 0.0],\n\t\t\t\t[0.9432526133406842, 0.05674738665931575, 0.15859832104091137], [1.0, 0.5, 0.0],\n\t\t\t\t[0.9432526133406842, 0.9432526133406842, 0.15859832104091137], [0.5, 1.0, 0.0],\n\t\t\t\t[0.05674738665931575, 0.9432526133406842, 0.15859832104091137], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.0732233047033631, 0.0732233047033631, 0.17677669529663687], [0.5, 0.0, 0.0],\n\t\t\t\t[0.9267766952966369, 0.0732233047033631, 0.17677669529663687], [1.0, 0.5, 0.0],\n\t\t\t\t[0.9267766952966369, 0.9267766952966369, 0.17677669529663687], [0.5, 1.0, 0.0],\n\t\t\t\t[0.0732233047033631, 0.9267766952966369, 0.17677669529663687], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.09140167895908863, 0.09140167895908863, 0.19325261334068422], [0.5, 0.0, 0.0],\n\t\t\t\t[0.9085983210409114, 0.09140167895908863, 0.19325261334068422], [1.0, 0.5, 0.0],\n\t\t\t\t[0.9085983210409114, 0.9085983210409114, 0.19325261334068422], [0.5, 1.0, 0.0],\n\t\t\t\t[0.09140167895908863, 0.9085983210409114, 0.19325261334068422], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.11110744174509943, 0.11110744174509943, 0.2078674030756363], [0.5, 0.0, 0.0],\n\t\t\t\t[0.8888925582549005, 0.11110744174509943, 0.2078674030756363], [1.0, 0.5, 0.0],\n\t\t\t\t[0.8888925582549005, 0.8888925582549005, 0.2078674030756363], [0.5, 1.0, 0.0],\n\t\t\t\t[0.11110744174509943, 0.8888925582549005, 0.2078674030756363], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.13215081579350055, 0.13215081579350055, 0.22048031608708873], [0.5, 0.0, 0.0],\n\t\t\t\t[0.8678491842064995, 0.13215081579350055, 0.22048031608708873], [1.0, 0.5, 0.0],\n\t\t\t\t[0.8678491842064995, 0.8678491842064995, 0.22048031608708873], [0.5, 1.0, 0.0],\n\t\t\t\t[0.13215081579350055, 0.8678491842064995, 0.22048031608708873], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.15432914190872754, 0.15432914190872754, 0.23096988312782168], [0.5, 0.0, 0.0],\n\t\t\t\t[0.8456708580912724, 0.15432914190872754, 0.23096988312782168], [1.0, 0.5, 0.0],\n\t\t\t\t[0.8456708580912724, 0.8456708580912724, 0.23096988312782168], [0.5, 1.0, 0.0],\n\t\t\t\t[0.15432914190872754, 0.8456708580912724, 0.23096988312782168], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.17742883068638443, 0.17742883068638443, 0.23923508393305223], [0.5, 0.0, 0.0],\n\t\t\t\t[0.8225711693136155, 0.17742883068638443, 0.23923508393305223], [1.0, 0.5, 0.0],\n\t\t\t\t[0.8225711693136155, 0.8225711693136155, 0.23923508393305223], [0.5, 1.0, 0.0],\n\t\t\t\t[0.17742883068638443, 0.8225711693136155, 0.23923508393305223], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.20122741949596792, 0.20122741949596792, 0.2451963201008076], [0.5, 0.0, 0.0],\n\t\t\t\t[0.7987725805040321, 0.20122741949596792, 0.2451963201008076], [1.0, 0.5, 0.0],\n\t\t\t\t[0.7987725805040321, 0.7987725805040321, 0.2451963201008076], [0.5, 1.0, 0.0],\n\t\t\t\t[0.20122741949596792, 0.7987725805040321, 0.2451963201008076], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.2254957149176098, 0.2254957149176098, 0.2487961816680492], [0.5, 0.0, 0.0],\n\t\t\t\t[0.7745042850823902, 0.2254957149176098, 0.2487961816680492], [1.0, 0.5, 0.0],\n\t\t\t\t[0.7745042850823902, 0.7745042850823902, 0.2487961816680492], [0.5, 1.0, 0.0],\n\t\t\t\t[0.2254957149176098, 0.7745042850823902, 0.2487961816680492], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.25, 0.25, 0.25], [0.5, 0.0, 0.0],\n\t\t\t\t[0.75, 0.25, 0.25], [1.0, 0.5, 0.0],\n\t\t\t\t[0.75, 0.75, 0.25], [0.5, 1.0, 0.0],\n\t\t\t\t[0.25, 0.75, 0.25], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.27450428508239016, 0.27450428508239016, 0.24879618166804923], [0.5, 0.0, 0.0],\n\t\t\t\t[0.7254957149176098, 0.27450428508239016, 0.24879618166804923], [1.0, 0.5, 0.0],\n\t\t\t\t[0.7254957149176098, 0.7254957149176098, 0.24879618166804923], [0.5, 1.0, 0.0],\n\t\t\t\t[0.27450428508239016, 0.7254957149176098, 0.24879618166804923], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.29877258050403205, 0.29877258050403205, 0.2451963201008076], [0.5, 0.0, 0.0],\n\t\t\t\t[0.701227419495968, 0.29877258050403205, 0.2451963201008076], [1.0, 0.5, 0.0],\n\t\t\t\t[0.701227419495968, 0.701227419495968, 0.2451963201008076], [0.5, 1.0, 0.0],\n\t\t\t\t[0.29877258050403205, 0.701227419495968, 0.2451963201008076], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.3225711693136155, 0.3225711693136155, 0.23923508393305223], [0.5, 0.0, 0.0],\n\t\t\t\t[0.6774288306863845, 0.3225711693136155, 0.23923508393305223], [1.0, 0.5, 0.0],\n\t\t\t\t[0.6774288306863845, 0.6774288306863845, 0.23923508393305223], [0.5, 1.0, 0.0],\n\t\t\t\t[0.3225711693136155, 0.6774288306863845, 0.23923508393305223], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.3456708580912724, 0.3456708580912724, 0.23096988312782168], [0.5, 0.0, 0.0],\n\t\t\t\t[0.6543291419087276, 0.3456708580912724, 0.23096988312782168], [1.0, 0.5, 0.0],\n\t\t\t\t[0.6543291419087276, 0.6543291419087276, 0.23096988312782168], [0.5, 1.0, 0.0],\n\t\t\t\t[0.3456708580912724, 0.6543291419087276, 0.23096988312782168], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.3678491842064994, 0.3678491842064994, 0.22048031608708876], [0.5, 0.0, 0.0],\n\t\t\t\t[0.6321508157935005, 0.3678491842064994, 0.22048031608708876], [1.0, 0.5, 0.0],\n\t\t\t\t[0.6321508157935005, 0.6321508157935005, 0.22048031608708876], [0.5, 1.0, 0.0],\n\t\t\t\t[0.3678491842064994, 0.6321508157935005, 0.22048031608708876], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.3888925582549005, 0.3888925582549005, 0.20786740307563634], [0.5, 0.0, 0.0],\n\t\t\t\t[0.6111074417450995, 0.3888925582549005, 0.20786740307563634], [1.0, 0.5, 0.0],\n\t\t\t\t[0.6111074417450995, 0.6111074417450995, 0.20786740307563634], [0.5, 1.0, 0.0],\n\t\t\t\t[0.3888925582549005, 0.6111074417450995, 0.20786740307563634], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.4085983210409113, 0.4085983210409113, 0.19325261334068428], [0.5, 0.0, 0.0],\n\t\t\t\t[0.5914016789590887, 0.4085983210409113, 0.19325261334068428], [1.0, 0.5, 0.0],\n\t\t\t\t[0.5914016789590887, 0.5914016789590887, 0.19325261334068428], [0.5, 1.0, 0.0],\n\t\t\t\t[0.4085983210409113, 0.5914016789590887, 0.19325261334068428], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.42677669529663687, 0.42677669529663687, 0.1767766952966369], [0.5, 0.0, 0.0],\n\t\t\t\t[0.5732233047033631, 0.42677669529663687, 0.1767766952966369], [1.0, 0.5, 0.0],\n\t\t\t\t[0.5732233047033631, 0.5732233047033631, 0.1767766952966369], [0.5, 1.0, 0.0],\n\t\t\t\t[0.42677669529663687, 0.5732233047033631, 0.1767766952966369], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.4432526133406842, 0.4432526133406842, 0.15859832104091137], [0.5, 0.0, 0.0],\n\t\t\t\t[0.5567473866593158, 0.4432526133406842, 0.15859832104091137], [1.0, 0.5, 0.0],\n\t\t\t\t[0.5567473866593158, 0.5567473866593158, 0.15859832104091137], [0.5, 1.0, 0.0],\n\t\t\t\t[0.4432526133406842, 0.5567473866593158, 0.15859832104091137], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.45786740307563634, 0.45786740307563634, 0.13889255825490054], [0.5, 0.0, 0.0],\n\t\t\t\t[0.5421325969243637, 0.45786740307563634, 0.13889255825490054], [1.0, 0.5, 0.0],\n\t\t\t\t[0.5421325969243637, 0.5421325969243637, 0.13889255825490054], [0.5, 1.0, 0.0],\n\t\t\t\t[0.45786740307563634, 0.5421325969243637, 0.13889255825490054], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.47048031608708873, 0.47048031608708873, 0.11784918420649947], [0.5, 0.0, 0.0],\n\t\t\t\t[0.5295196839129113, 0.47048031608708873, 0.11784918420649947], [1.0, 0.5, 0.0],\n\t\t\t\t[0.5295196839129113, 0.5295196839129113, 0.11784918420649947], [0.5, 1.0, 0.0],\n\t\t\t\t[0.47048031608708873, 0.5295196839129113, 0.11784918420649947], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.4809698831278217, 0.4809698831278217, 0.09567085809127247], [0.5, 0.0, 0.0],\n\t\t\t\t[0.5190301168721783, 0.4809698831278217, 0.09567085809127247], [1.0, 0.5, 0.0],\n\t\t\t\t[0.5190301168721783, 0.5190301168721783, 0.09567085809127247], [0.5, 1.0, 0.0],\n\t\t\t\t[0.4809698831278217, 0.5190301168721783, 0.09567085809127247], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.4892350839330522, 0.4892350839330522, 0.0725711693136156], [0.5, 0.0, 0.0],\n\t\t\t\t[0.5107649160669478, 0.4892350839330522, 0.0725711693136156], [1.0, 0.5, 0.0],\n\t\t\t\t[0.5107649160669478, 0.5107649160669478, 0.0725711693136156], [0.5, 1.0, 0.0],\n\t\t\t\t[0.4892350839330522, 0.5107649160669478, 0.0725711693136156], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.4951963201008076, 0.4951963201008076, 0.04877258050403215], [0.5, 0.0, 0.0],\n\t\t\t\t[0.5048036798991924, 0.4951963201008076, 0.04877258050403215], [1.0, 0.5, 0.0],\n\t\t\t\t[0.5048036798991924, 0.5048036798991924, 0.04877258050403215], [0.5, 1.0, 0.0],\n\t\t\t\t[0.4951963201008076, 0.5048036798991924, 0.04877258050403215], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.4987961816680492, 0.4987961816680492, 0.024504285082390206], [0.5, 0.0, 0.0],\n\t\t\t\t[0.5012038183319508, 0.4987961816680492, 0.024504285082390206], [1.0, 0.5, 0.0],\n\t\t\t\t[0.5012038183319508, 0.5012038183319508, 0.024504285082390206], [0.5, 1.0, 0.0],\n\t\t\t\t[0.4987961816680492, 0.5012038183319508, 0.024504285082390206], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"frame_classes\": [\"foldedState\"],\n\t\t\t\"frame_parent\":0,\n\t\t\t\"frame_inherit\":true,\n\t\t\t\"vertices_coords\": [\n\t\t\t\t[0.5, 0.5, 0.0], [0.5, 0.0, 0.0],\n\t\t\t\t[0.5, 0.5, 0.0], [1.0, 0.5, 0.0],\n\t\t\t\t[0.5, 0.5, 0.0], [0.5, 1.0, 0.0],\n\t\t\t\t[0.5, 0.5, 0.0], [0.0, 0.5, 0.0]\n\t\t\t]\n\t\t}\n\t]\n}";

	const fold = {
		file: file,
		validate: validate,
		graph: graph,
		origami: origami$2,
		planargraph: planargraph,
		valleyfold: valleyfold$1,
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
		boundary: JSON.parse(boundary),
		concave: JSON.parse(concave),
		blintzAnimated: JSON.parse(blintzAnimated)
	};

	exports.math = geometry$1;
	exports.svg = svg$1;
	exports.noise = perlin;
	exports.fold = fold;
	exports.bases = bases;
	exports.CreasePattern = CreasePattern;
	exports.Origami = View;
	exports.Origami3D = View3D;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
