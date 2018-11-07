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
 * this searches user-provided inputs for a valid n-dimensional vector 
 * which includes objects {x:, y:}, arrays [x,y], or sequences of numbers
 * 
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
 * this searches user-provided inputs for a valid n-dimensional vector 
 * which includes objects {x:, y:}, arrays [x,y], or sequences of numbers
 * 
 * @returns ({ point:[], vector:[] })
*/
function get_line$1(){
	let params = Array.from(arguments);
	if(params.length == 0) { return {vector: [], point: []}; }
	// let numbers = params.filter((param) => !isNaN(param));
	// if(numbers.length >= 1) { return numbers; }
	if(params[0].constructor === Array);
	if(params[0].constructor === Object){
		let vector = [], point = [];
		if (params[0].vector != null)         { vector = get_vec(params[0].vector); }
		else if (params[0].direction != null) { vector = get_vec(params[0].direction); }
		if (params[0].point != null)       { point = get_vec(params[0].point); }
		else if (params[0].origin != null) { point = get_vec(params[0].origin); }
		return {vector, point};
	}
	return {vector: [], point: []};
}

var Input = /*#__PURE__*/Object.freeze({
	is_number: is_number,
	clean_number: clean_number,
	get_vec: get_vec,
	get_matrix: get_matrix,
	get_line: get_line$1
});

// Geometry for .fold file origami

// all points are array syntax [x,y]
// all edges are array syntax [[x,y], [x,y]]
// all infinite lines are defined as point and vector, both [x,y]
// all polygons are an ordered set of points ([x,y]), either winding direction

const EPSILON_LOW  = 3e-6;
const EPSILON      = 1e-10;
const EPSILON_HIGH$1 = 1e-14;

/** apply a matrix transform on a point */
function transform_point(point, matrix){
	return [ point[0] * matrix[0] + point[1] * matrix[2] + matrix[4],
	         point[0] * matrix[1] + point[1] * matrix[3] + matrix[5] ];
}

/** 
 * These all standardize a row-column order
 */

function make_matrix_reflection(vector, origin){
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
function make_matrix_inverse(m){
	var det = m[0] * m[3] - m[1] * m[2];
	if (!det || isNaN(det) || !isFinite(m[4]) || !isFinite(m[5])){ return undefined; }
	return [ m[3]/det, -m[1]/det, -m[2]/det, m[0]/det, 
	         (m[2]*m[5] - m[3]*m[4])/det, (m[1]*m[4] - m[0]*m[5])/det ];
}
function multiply_matrices(m1, m2){
	let a = m1[0] * m2[0] + m1[2] * m2[1];
	let c = m1[0] * m2[2] + m1[2] * m2[3];
	let tx = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
	let b = m1[1] * m2[0] + m1[3] * m2[1];
	let d = m1[1] * m2[2] + m1[3] * m2[3];
	let ty = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
	return [a, b, c, d, tx, ty];
}


/** are two points equivalent within an epsilon */
function points_equivalent(a, b, epsilon = EPSILON){
	// rectangular bounds test for faster calculation
	return Math.abs(a[0]-b[0]) < epsilon && Math.abs(a[1]-b[1]) < epsilon;
}

// need to test:
// do two polygons overlap if they share a point in common? share an edge?

var core = /*#__PURE__*/Object.freeze({
	EPSILON_LOW: EPSILON_LOW,
	EPSILON: EPSILON,
	EPSILON_HIGH: EPSILON_HIGH$1,
	transform_point: transform_point,
	make_matrix_reflection: make_matrix_reflection,
	make_matrix_inverse: make_matrix_inverse,
	multiply_matrices: multiply_matrices,
	points_equivalent: points_equivalent
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
	if(points_equivalent(x, edge0) || points_equivalent(x, edge1)){
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
			if( !points_equivalent(intersections[0], intersections[i])){
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
	clipRay: clipRay
});

/**
 *  Geometry library
 *  The goal of this user-facing library is to type check all arguments for a
 *  likely use case, which might slow runtime by a small fraction.
 *  Use the core library functions for fastest-possible calculations.
 */

// export * from './intersection';
let intersection = Intersection;

let input = Input;

/** n-dimensional vector */
function Vector() {
	let _v = get_vec(...arguments);

	const normalize = function() {
		let m = magnitude();
		let components = _v.map(c => c / m);
		return Vector(components);
	};
	const magnitude = function() {
		let sum = _v
			.map(component => component * component)
			.reduce((prev,curr) => prev + curr);
		return Math.sqrt(sum);
	};
	const dot = function() {
		let vec = get_vec(...arguments);
		let length = (_v.length < vec.length) ? _v.length : vec.length;
		return Array.from(Array(length))
			.map((_,i) => _v[i] * vec[i])
			.reduce((prev,curr) => prev + curr, 0);
	};
	const cross3 = function() {
		let b = get_vec(...arguments);
		let a = _v.slice();
		if(a[2] == null){ a[2] = 0; }
		if(b[2] == null){ b[2] = 0; }
		return (a[1]*b[2] - a[2]*b[1]) - (a[0]*b[2] - a[2]*b[0]) + (a[0]*b[1] - a[1]*b[0]);
	};
	const cross = function() {
		return cross3(...arguments);
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
		return Vector(_v[0] * m[0] + _v[1] * m[2] + m[4],
		              _v[0] * m[1] + _v[1] * m[3] + m[5]);
	};
	const rotateZ = function(angle, origin) {
		return transform( Matrix().rotation(angle, origin) );
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
		return transform( Matrix().reflection(reflect.vector, reflect.point) );
	};
	const lerp = function(point, pct) {
		let vec = get_vec(point);
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
	const midpoint = function() {
		let vec = get_vec(...arguments);
		let sm = (_v.length < vec.length) ? _v.slice() : vec;
		let lg = (_v.length < vec.length) ? vec : _v.slice();
		for(var i = sm.length; i < lg.length; i++){ sm[i] = 0; }
		return Vector(lg.map((_,i) => (sm[i] + lg[i]) * 0.5));
	};

	return Object.freeze( {
		normalize,
		magnitude,
		dot,
		cross,
		distanceTo,
		transform,
		rotateZ,
		rotateZ90,
		rotateZ180,
		rotateZ270,
		reflect,
		lerp,
		equivalent,
		scale,
		midpoint,
		get vector() { return _v; },
		get x() { return _v[0]; },
		get y() { return _v[1]; },
		get z() { return _v[2]; },
	} );
}


/** 
 * 2D Matrix with translation component in x,y
 */
function Matrix() {
	let _m = get_matrix(...arguments);

	const inverse = function() {
		var det = _m[0] * _m[3] - _m[1] * _m[2];
		if (!det || isNaN(det) || !isFinite(_m[4]) || !isFinite(_m[5])) {
			return undefined;
		}
		let a =  _m[3]/det;
		let b = -_m[1]/det;
		let c = -_m[2]/det;
		let d =  _m[0]/det;
		let tx = (_m[2]*_m[5] - _m[3]*_m[4])/det;
		let ty = (_m[1]*_m[4] - _m[0]*_m[5])/det;
		return Matrix(a, b, c, d, tx, ty);
	};
	const multiply = function() {
		let m2 = get_matrix(...arguments);
		let a = _m[0] * m2[0] + _m[2] * m2[1];
		let c = _m[0] * m2[2] + _m[2] * m2[3];
		let tx = _m[0] * m2[4] + _m[2] * m2[5] + _m[4];
		let b = _m[1] * m2[0] + _m[3] * m2[1];
		let d = _m[1] * m2[2] + _m[3] * m2[3];
		let ty = _m[1] * m2[4] + _m[3] * m2[5] + _m[5];
		return Matrix(a, b, c, d, tx, ty);
	};
	const transform = function(){
		let v = get_vec(...arguments);
		return Vector(v[0] * _m[0] + v[1] * _m[2] + _m[4],
		              v[0] * _m[1] + v[1] * _m[3] + _m[5]);
	};
	return Object.freeze( {
		inverse,
		multiply,
		transform,
		get m() { return _m; },
	} );
}
// static methods
Matrix.identity = function() {
	return Matrix(1,0,0,1,0,0);
};
Matrix.rotation = function(angle, origin) {
	var a = Math.cos(angle);
	var b = Math.sin(angle);
	var c = -Math.sin(angle);
	var d = Math.cos(angle);
	var tx = (origin != null) ? origin[0] : 0;
	var ty = (origin != null) ? origin[1] : 0;
	return Matrix(a, b, c, d, tx, ty);
};
Matrix.reflection = function(vector, origin) {
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
	return Matrix(a, b, c, d, tx, ty);
};

export { intersection, core, input, Vector, Matrix };
