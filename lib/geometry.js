/* Geometry (c) Robby Kraft, MIT License */
function is_number(n) {
	return n != null && !isNaN(n);
}

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

/** 
 * this searches user-provided inputs for a valid n-dimensional vector 
 * which includes objects {x:, y:}, arrays [x,y], or sequences of numbers
 * 
 * @returns (number[]) array of number components
 *   invalid/no input returns an emptry array
*/
function get_vec(){
	let params = Array.from(arguments);
	if(params.length == 0) { return []; }
	if(params[0].vector != null && params[0].vector.constructor == Array){
		return params[0].vector; // Vector type
	}
	let arrays = params.filter((param) => param.constructor === Array);
	if(arrays.length >= 1) { return arrays[0]; }
	let numbers = params.filter((param) => !isNaN(param));
	if(numbers.length >= 1) { return numbers; }
	if(!isNaN(params[0].x)){
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
function get_matrix(){
	let params = Array.from(arguments);
	let numbers = params.filter((param) => !isNaN(param));
	let arrays = params.filter((param) => param.constructor === Array);
	if(params.length == 0) { return [1,0,0,1,0,0]; }
	if(params[0].m != null && params[0].m.constructor == Array){
		numbers = params[0].m.slice(); // Matrix type
	}
	if(numbers.length == 0 && arrays.length >= 1){ numbers = arrays[0]; }
	if(numbers.length >= 6){ return numbers.slice(0,6); }
	else if(numbers.length >= 4){
		let m = numbers.slice(0,4);
		m[4] = 0;
		m[5] = 0;
		return m;
	}
	return [1,0,0,1,0,0];
}

/** 
 * @returns ({ point:[], vector:[] })
*/
function get_line(){
	let params = Array.from(arguments);
	let numbers = params.filter((param) => !isNaN(param));
	let arrays = params.filter((param) => param.constructor === Array);
	if(params.length == 0) { return {vector: [], point: []}; }
	if(!isNaN(params[0]) && numbers.length >= 4){
		return {
			point: [params[0], params[1]],
			vector: [params[2], params[3]]
		};
	}
	if(arrays.length > 0){
		if(arrays.length == 2){
			return {
				point: [arrays[0][0], arrays[0][1]],
				vector: [arrays[1][0], arrays[1][1]]
			};
		}
		if(arrays.length == 4){
			return {
				point: [arrays[0], arrays[1]],
				vector: [arrays[2], arrays[3]]
			};
		}
	}
	if(params[0].constructor === Object){
		let vector = [], point = [];
		if (params[0].vector != null)         { vector = get_vec(params[0].vector); }
		else if (params[0].direction != null) { vector = get_vec(params[0].direction); }
		if (params[0].point != null)       { point = get_vec(params[0].point); }
		else if (params[0].origin != null) { point = get_vec(params[0].origin); }
		return {point, vector};
	}
	return {point: [], vector: []};
}

function get_two_vec2(){
	let params = Array.from(arguments);
	let numbers = params.filter((param) => !isNaN(param));
	let arrays = params.filter((param) => param.constructor === Array);
	if(numbers.length >= 4){
		return [
			[numbers[0], numbers[1]],
			[numbers[2], numbers[3]]
		];
	}
	if(arrays.length >= 2 && !isNaN(arrays[0][0])){
		return arrays;
	}
}

var input = /*#__PURE__*/Object.freeze({
	is_number: is_number,
	clean_number: clean_number,
	get_vec: get_vec,
	get_matrix: get_matrix,
	get_line: get_line,
	get_two_vec2: get_two_vec2
});

// Geometry for .fold file origami

// all points are array syntax [x,y]
// all edges are array syntax [[x,y], [x,y]]
// all infinite lines are defined as point and vector, both [x,y]
// all polygons are an ordered set of points ([x,y]), either winding direction

const EPSILON_LOW  = 3e-6;
const EPSILON      = 1e-10;
const EPSILON_HIGH$1 = 1e-14;

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

// these require that the two arguments are the same size.
// also valid is the second argument larger than the first
// the extra will get ignored as the iterator maps to the first length
function dot(a, b) {
	return a
		.map((ai,i) => ai * b[i])
		.reduce((prev,curr) => prev + curr, 0);
}

function midpoint(a, b){
	return a.map((ai,i) => (ai+b[i])*0.5);
}


////////////////////////////////

/** apply a matrix transform on a point */
function multiply_vector2_matrix2(vector, matrix){
	return [ vector[0] * matrix[0] + vector[1] * matrix[2] + matrix[4],
	         vector[0] * matrix[1] + vector[1] * matrix[3] + matrix[5] ];
}

/** 
 * These all standardize a row-column order
 */
function make_matrix2_reflection(vector, origin){
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
function make_matrix2_rotation(angle, origin){
	var a = Math.cos(angle);
	var b = Math.sin(angle);
	var c = -Math.sin(angle);
	var d = Math.cos(angle);
	var tx = (origin != null) ? origin[0] : 0;
	var ty = (origin != null) ? origin[1] : 0;
	return [a, b, c, d, tx, ty];
}
function make_matrix2_inverse(m){
	var det = m[0] * m[3] - m[1] * m[2];
	if (!det || isNaN(det) || !isFinite(m[4]) || !isFinite(m[5])){ return undefined; }
	return [
		m[3]/det,
		-m[1]/det,
		-m[2]/det,
		m[0]/det, 
		(m[2]*m[5] - m[3]*m[4])/det,
		(m[1]*m[4] - m[0]*m[5])/det
	];
}
function multiply_matrices2(m1, m2){
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

/** are two points equivalent within an epsilon */
function equivalent2(a, b, epsilon = EPSILON){
	// rectangular bounds test for faster calculation
	return Math.abs(a[0]-b[0]) < epsilon && Math.abs(a[1]-b[1]) < epsilon;
}


function cross2(a, b){
	return [ a[0]*b[1], a[1]*b[0] ];
}

function cross3(a, b) {
	return [
		a[1]*b[2] - a[2]*b[1],
		a[0]*b[2] - a[2]*b[0],
		a[0]*b[1] - a[1]*b[0]
	];
}

function distance2(a, b){
	return Math.sqrt(
		Math.pow(a[0] - b[0], 2) +
		Math.pow(a[1] - b[1], 2)
	);
}

function distance3(a, b){
	return Math.sqrt(
		Math.pow(a[0] - b[0], 2) +
		Math.pow(a[1] - b[1], 2) +
		Math.pow(a[2] - b[2], 2)
	);
}

// need to test:
// do two polygons overlap if they share a point in common? share an edge?

var core = /*#__PURE__*/Object.freeze({
	EPSILON_LOW: EPSILON_LOW,
	EPSILON: EPSILON,
	EPSILON_HIGH: EPSILON_HIGH$1,
	normalize: normalize,
	magnitude: magnitude,
	dot: dot,
	midpoint: midpoint,
	multiply_vector2_matrix2: multiply_vector2_matrix2,
	make_matrix2_reflection: make_matrix2_reflection,
	make_matrix2_rotation: make_matrix2_rotation,
	make_matrix2_inverse: make_matrix2_inverse,
	multiply_matrices2: multiply_matrices2,
	equivalent2: equivalent2,
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


function line_line(aPt, aVec, bPt, bVec, epsilon){
	return vector_intersection(aPt, aVec, bPt, bVec, line_line_comp, epsilon);
}
function line_ray(linePt, lineVec, rayPt, rayVec, epsilon){
	return vector_intersection(linePt, lineVec, rayPt, rayVec, line_ray_comp, epsilon);
}
function line_edge(point, vec, edge0, edge1, epsilon){
	let edgeVec = [edge1[0]-edge0[0], edge1[1]-edge0[1]];
	return vector_intersection(point, vec, edge0, edgeVec, line_edge_comp, epsilon);
}
function ray_ray(aPt, aVec, bPt, bVec, epsilon){
	return vector_intersection(aPt, aVec, bPt, bVec, ray_ray_comp, epsilon);
}
function ray_edge(rayPt, rayVec, edge0, edge1, epsilon){
	let edgeVec = [edge1[0]-edge0[0], edge1[1]-edge0[1]];
	return vector_intersection(rayPt, rayVec, edge0, edgeVec, ray_edge_comp, epsilon);
}
function edge_edge(a0, a1, b0, b1, epsilon){
	let aVec = [a1[0]-a0[0], a1[1]-a0[1]];
	let bVec = [b1[0]-b0[0], b1[1]-b0[1]];
	return vector_intersection(a0, aVec, b0, bVec, edge_edge_comp, epsilon);
}

function line_edge_exclusive(point, vec, edge0, edge1){
	let edgeVec = [edge1[0]-edge0[0], edge1[1]-edge0[1]];
	let x = vector_intersection(point, vec, edge0, edgeVec, line_edge_comp);
	if (x == null){ return undefined; }
	if(equivalent2(x, edge0) || equivalent2(x, edge1)){
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
const ray_ray_comp = function(t0, t1, epsilon = EPSILON){
	return t0 >= -epsilon && t1 >= -epsilon;
};
const ray_edge_comp = function(t0, t1, epsilon = EPSILON){
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
var vector_intersection = function(aPt, aVec, bPt, bVec, compFunction, epsilon = EPSILON){
	function det(a,b){ return a[0] * b[1] - b[0] * a[1]; }
	var denominator0 = det(aVec, bVec);
	var denominator1 = -denominator0;
	if(Math.abs(denominator0) < epsilon){ return undefined; } /* parallel */
	var numerator0 = det([bPt[0]-aPt[0], bPt[1]-aPt[1]], bVec);
	var numerator1 = det([aPt[0]-bPt[0], aPt[1]-bPt[1]], aVec);
	var t0 = numerator0 / denominator0;
	var t1 = numerator1 / denominator1;
	if(compFunction(t0, t1, epsilon)) {
		return [aPt[0] + aVec[0]*t0, aPt[1] + aVec[1]*t0];
	}
};



/** 
 *  Boolean tests
 *  collinearity, overlap, contains
 */


// line_collinear - prev name
/** is a point collinear to a line, within an epsilon */
function point_on_line(linePoint, lineVector, point, epsilon = EPSILON){
	let pointPoint = [point[0] - linePoint[0], point[1] - linePoint[1]];
	let cross = pointPoint[0]*lineVector[1] - pointPoint[1]*lineVector[0];
	return Math.abs(cross) < epsilon;
}

// edge_collinear - prev name
/** is a point collinear to an edge, between endpoints, within an epsilon */
function point_on_edge(edge0, edge1, point, epsilon = EPSILON){
	// distance between endpoints A,B should be equal to point->A + point->B
	let dEdge = Math.sqrt(Math.pow(edge0[0]-edge1[0],2) + Math.pow(edge0[1]-edge1[1],2));
	let dP0 = Math.sqrt(Math.pow(point[0]-edge0[0],2) + Math.pow(point[1]-edge0[1],2));
	let dP1 = Math.sqrt(Math.pow(point[0]-edge1[0],2) + Math.pow(point[1]-edge1[1],2));
	return Math.abs(dEdge - dP0 - dP1) < epsilon;
}

/** is a point inside of a convex polygon? 
 * including along the boundary within epsilon 
 *
 * @param poly is an array of points [ [x,y], [x,y]...]
 * @returns {boolean} true if point is inside polygon
 */
function point_in_polygon(poly, point, epsilon = EPSILON){
	if(poly == undefined || !(poly.length > 0)){ return false; }
	return poly.map( (p,i,arr) => {
		let nextP = arr[(i+1)%arr.length];
		let a = [ nextP[0]-p[0], nextP[1]-p[1] ];
		let b = [ point[0]-p[0], point[1]-p[1] ];
		return a[0] * b[1] - a[1] * b[0] > -epsilon;
	}).map((s,i,arr) => s == arr[0]).reduce((prev,curr) => prev && curr, true)
}

/** do two convex polygons overlap one another */
function polygons_overlap(ps1, ps2){
	// convert array of points into edges [point, nextPoint]
	let e1 = ps1.map((p,i,arr) => [p, arr[(i+1)%arr.length]] );
	let e2 = ps2.map((p,i,arr) => [p, arr[(i+1)%arr.length]] );
	for(let i = 0; i < e1.length; i++){
		for(let j = 0; j < e2.length; j++){
			if(edge_edge_intersection(e1[i][0], e1[i][1], e2[j][0], e2[j][1]) != undefined){
				return true;
			}
		}
	}
	if(point_in_polygon(ps1, ps2[0])){ return true; }
	if(point_in_polygon(ps2, ps1[0])){ return true; }
	return false;
}



/** 
 *  Clipping operations
 *  
 */



/** clip an infinite line in a polygon, returns an edge or undefined if no intersection */
function clip_line_in_poly(poly, linePoint, lineVector){
	let intersections = poly
		.map((p,i,arr) => [p, arr[(i+1)%arr.length]] ) // poly points into edge pairs
		.map(function(el){ return line_edge_intersection(linePoint, lineVector, el[0], el[1]); })
		.filter(function(el){return el != undefined; });
	switch(intersections.length){
	case 0: return undefined;
	case 1: return [intersections[0], intersections[0]]; // degenerate edge
	case 2: return intersections;
	default:
	// special case: line intersects directly on a poly point (2 edges, same point)
	//  filter to unique points by [x,y] comparison.
		for(let i = 1; i < intersections.length; i++){
			if( !equivalent2(intersections[0], intersections[i])){
				return [intersections[0], intersections[i]];
			}
		}
	}
}

function clipEdge(edge){
	var intersections = this.edges
		.map(function(el){ return intersectionEdgeEdge(edge, el); })
		.filter(function(el){return el !== undefined; })
		// filter out intersections equivalent to the edge points themselves
		.filter(function(el){ 
			return !el.equivalent(edge.nodes[0]) &&
			       !el.equivalent(edge.nodes[1]); });
	switch(intersections.length){
		case 0:
			if(this.contains(edge.nodes[0])){ return edge; } // completely inside
			return undefined;  // completely outside
		case 1:
			if(this.contains(edge.nodes[0])){
				return new Edge(edge.nodes[0], intersections[0]);
			}
			return new Edge(edge.nodes[1], intersections[0]);
		case 2: return new Edge(intersections[0], intersections[1]);
		// default: throw "clipping edge in a convex polygon resulting in 3 or more points";
		default:
			for(var i = 1; i < intersections.length; i++){
				if( !intersections[0].equivalent(intersections[i]) ){
					return new Edge(intersections[0], intersections[i]);
				}
			}
	}
}
function clipLine(line){
	var intersections = this.edges
		.map(function(el){ return intersectionLineEdge(line, el); })
		.filter(function(el){return el !== undefined; });
	switch(intersections.length){
		case 0: return undefined;
		case 1: return new Edge(intersections[0], intersections[0]); // degenerate edge
		case 2: return new Edge(intersections[0], intersections[1]);
		// default: throw "clipping line in a convex polygon resulting in 3 or more points";
		default:
			for(var i = 1; i < intersections.length; i++){
				if( !intersections[0].equivalent(intersections[i]) ){
					return new Edge(intersections[0], intersections[i]);
				}
			}
	}
}
function clipRay(ray){
	var intersections = this.edges
		.map(function(el){ return intersectionRayEdge(ray, el); })
		.filter(function(el){return el !== undefined; });
	switch(intersections.length){
		case 0: return undefined;
		case 1: return new Edge(ray.origin, intersections[0]);
		case 2: return new Edge(intersections[0], intersections[1]);
		// default: throw "clipping ray in a convex polygon resulting in 3 or more points";
		default:
			for(var i = 1; i < intersections.length; i++){
				if( !intersections[0].equivalent(intersections[i]) ){
					return new Edge(intersections[0], intersections[i]);
				}
			}
	}
}

function intersection_circle_line(center, radius, p0, p1){
	var r_squared =  Math.pow(radius, 2);
	var x1 = p0[0] - center[0];
	var y1 = p0[1] - center[1];
	var x2 = p1[0] - center[0];
	var y2 = p1[1] - center[1];
	var dx = x2 - x1;
	var dy = y2 - y1;
	var dr_squared = dx*dx + dy*dy;
	var D = x1*y2 - x2*y1;
	function sgn(x){ if(x < 0){return -1;} return 1; }
	var x1 = (D*dy + sgn(dy)*dx*Math.sqrt(r_squared*dr_squared - (D*D)))/(dr_squared);
	var x2 = (D*dy - sgn(dy)*dx*Math.sqrt(r_squared*dr_squared - (D*D)))/(dr_squared);
	var y1 = (-D*dx + Math.abs(dy)*Math.sqrt(r_squared*dr_squared - (D*D)))/(dr_squared);
	var y2 = (-D*dx - Math.abs(dy)*Math.sqrt(r_squared*dr_squared - (D*D)))/(dr_squared);
	let x1NaN = isNaN(x1);
	let x2NaN = isNaN(x2);
	if(!x1NaN && !x2NaN){
		return [
			[x1 + center[0], y1 + center[1]],
			[x2 + center[0], y2 + center[1]]
		];
	}
	if(x1NaN && x2NaN){ return undefined; }
	if(!x1NaN){
		return [ [x1 + center[0], y1 + center[1]] ];
	}
	if(!x2NaN){
		return [ [x2 + center[0], y2 + center[1]] ];
	}
}

var Intersection = /*#__PURE__*/Object.freeze({
	line_line: line_line,
	line_ray: line_ray,
	line_edge: line_edge,
	ray_ray: ray_ray,
	ray_edge: ray_edge,
	edge_edge: edge_edge,
	line_edge_exclusive: line_edge_exclusive,
	point_on_line: point_on_line,
	point_on_edge: point_on_edge,
	point_in_polygon: point_in_polygon,
	polygons_overlap: polygons_overlap,
	clip_line_in_poly: clip_line_in_poly,
	clipEdge: clipEdge,
	clipLine: clipLine,
	clipRay: clipRay,
	intersection_circle_line: intersection_circle_line
});

/**
 *  Geometry library
 *  The goal of this user-facing library is to type check all arguments for a
 *  likely use case, which might slow runtime by a small fraction.
 *  Use the core library functions for fastest-possible calculations.
 */

// export * from './intersection';
let intersection = Intersection;

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
		return Vector( multiply_vector2_matrix2(v, _m) );
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

/** n-dimensional vector */
function Vector() {
	let _v = get_vec(...arguments);

	const normalize$$1 = function() {
		return Vector( normalize(_v) );
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
		let m = get_matrix(...arguments);
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
	// these are implicitly 2D functions, and will convert the vector into 2D
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
	const equivalent = function(vector, epsilon = EPSILON_HIGH) {
		// rect bounding box for now, much cheaper than radius calculation
		let vec = get_vec(vector);
		let sm = (_v.length < vec.length) ? _v.slice() : vec;
		let lg = (_v.length < vec.length) ? vec : _v.slice();
		for(var i = sm.length; i < lg.length; i++){ sm[i] = 0; }
		return lg.map((_,i) => Math.abs(sm[i] - lg[i]) < epsilon)
			.reduce((prev,curr) => prev && curr, true);
	};
	const scale = function(mag) {
		return Vector( _v.map(v => v * mag) );
	};
	const midpoint$$1 = function() {
		let vec = get_vec(...arguments);
		let sm = (_v.length < vec.length) ? _v.slice() : vec;
		let lg = (_v.length < vec.length) ? vec : _v.slice();
		for(var i = sm.length; i < lg.length; i++){ sm[i] = 0; }
		return Vector(lg.map((_,i) => (sm[i] + lg[i]) * 0.5));
	};

	return Object.freeze( {
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
		equivalent,
		scale,
		midpoint: midpoint$$1,
		get vector() { return _v; },
		get x() { return _v[0]; },
		get y() { return _v[1]; },
		get z() { return _v[2]; },
	} );
}

function Line$1(){
	let {point, vector} = get_line(...arguments);

	const isParallel = function(){
		let line2 = get_line(...arguments);
		let crossMag = cross2(vector, line2.vector).reduce((a,b)=>a+b,0);
		return Math.abs(crossMag) < EPSILON_HIGH$1;
	};

	return Object.freeze( {
		isParallel,
		get vector() { return vector; },
		get point() { return point; },
	} );
}
Line$1.makeBetweenPoints = function(){
	let points = get_two_vec2(...arguments);
	return Line$1({
		point: points[0],
		vector: normalize([
			points[1][0] - points[0][0],
			points[1][1] - points[0][1]
		])
	});
};
Line$1.makePerpendicularBisector = function() {
	let points = get_two_vec2(...arguments);
	let vec = normalize([
		points[1][0] - points[0][0],
		points[1][1] - points[0][1]
	]);
	return Line$1({
		point: midpoint(points[0], points[1]),
		vector: [vec[1], -vec[0]]
		// vector: Core.cross3(vec, [0,0,1])
	});
};


function Ray(){
	let {point, vector} = get_line(...arguments);

	return Object.freeze( {
		get vector() { return vector; },
		get point() { return point; },
		get origin() { return point; },
	} );
}


function Edge$1(){
	let _endpoints = get_two_vec2(...arguments);

	const vector = function(){
		return Vector(
			_endpoints[1][0] - _endpoints[0][0],
			_endpoints[1][1] - _endpoints[0][1]
		);
	};

	return Object.freeze( {
		vector,
		get endpoints() { return _endpoints; },
	} );
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

export { intersection, core as Core, input as Input, Matrix, Vector, Line$1 as Line, Ray, Edge$1 as Edge, Circle };
