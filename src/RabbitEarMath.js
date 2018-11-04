
var EPSILON_LOW  = 3e-6;
var EPSILON      = 1e-10;
var EPSILON_HIGH = 1e-14;

/** n-dimensional vector */
export function Vector() {
	let _v = get_vec(...arguments);

	const normalize = function() {
		let m = magnitude();
		let components = _v.map(c => c / m);
		return Vector(components);
	}
	const magnitude = function() {
		let sum = _v
			.map(component => component * component)
			.reduce((prev,curr) => prev + curr);
		return Math.sqrt(sum);
	}
	const dot = function() {
		let vec = get_vec(...arguments);
		let length = (_v.length < vec.length) ? _v.length : vec.length;
		return Array.from(Array(length))
			.map((_,i) => _v[i] * vec[i])
			.reduce((prev,curr) => prev + curr, 0);
	}
	const cross2 = function() {
		let vec = get_vec(...arguments);
		return _v[0] * vec[1] - _v[1] * vec[0];
	}
	const cross3 = function() {
		let b = get_vec(...arguments);
		let a = _v.slice();
		if(a[2] == null){ a[2] = 0; }
		if(b[2] == null){ b[2] = 0; }
		return (a[1]*b[2] - a[2]*b[1]) - (a[0]*b[2] - a[2]*b[0]) + (a[0]*b[1] - a[1]*b[0]);
	}
	const cross = function(){ return cross3(...arguments); }
	const distanceTo = function() {
		let vec = get_vec(...arguments);
		let length = (_v.length < vec.length) ? _v.length : vec.length;
		let sum = Array.from(Array(length))
			.map((_,i) => Math.pow(_v[i] - vec[i], 2))
			.reduce((prev, curr) => prev + curr, 0);
		return Math.sqrt(sum);
	}
	const transform = function() {
		let m = get_matrix(...arguments);
		return Vector(_v[0] * m[0] + _v[1] * m[2] + m[4],
		              _v[0] * m[1] + _v[1] * m[3] + m[5]);
	}
	const rotateZ = function(angle, origin){
		return transform( Matrix().rotation(angle, origin) );
	}
	const rotateZ90 = function() { return Vector(-_v[1], _v[0]); }
	const rotateZ180 = function() { return Vector(-_v[0], -_v[1]); }
	const rotateZ270 = function() { return Vector(_v[1], -_v[0]); }
	const reflect = function(line){
		var origin = (line.direction != undefined) ? (line.point || line.origin) : new XY(line.nodes[0].x, line.nodes[0].y);
		var vector = (line.direction != undefined) ? line.direction : new XY(line.nodes[1].x, line.nodes[1].y).subtract(origin);
		return transform( Matrix().reflection(vector, origin) );
	}
	const lerp = function(point, pct){
		let inv = 1.0-pct;
		return XY(_x * pct + point[0] * inv, _y * pct + point[1] * inv);
	}

	const equivalent = function(point, epsilon = EPSILON_HIGH){
		// rect bounding box for now, much cheaper than radius calculation
		return Math.abs(_x - point.x) < epsilon && Math.abs(_y - point.y) < epsilon;
	}
	const scale = function(mag){ return XY(_x * mag, _y * mag); }
	const midpoint = function(a){ return XY((_x+a[0])*0.5, (_y+a[1])*0.5); }

	return Object.freeze({
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
		// get x() { return _m[0]; },
		// get y() { return _m[1]; },
		get vector() { return _v; },
		get x() { return _v[0]; },
		get y() { return _v[1]; },
		get z() { return _v[2]; },
	});
}


/** 
 * 2D Matrix with translation component in x,y
 */
export function Matrix(){
	let params = Array.from(arguments);
	let numbers = params.filter((arg) => !isNaN(arg));
	let arrays = params.filter((arg) => arg.constructor === Array);

	let _m = [];

	// constructor
	if(numbers.length == 0 && arrays.length >= 1){ numbers = arrays[0]; }
	if(numbers.length >= 6){ _m = numbers.slice(0,6); }
	else if(numbers.length >= 4){
		_m = numbers.slice(0,4);
		_m[4] = 0;
		_m[5] = 0;
	}
	else{ _m = [1,0,0,1,0,0]; }

	const identity = function(){
		return Matrix(1,0,0,1,0,0);
	}
	const reflection = function(origin, vector){
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
	}
	const inverse = function(m){
		var det = m[0] * m[3] - m[1] * m[2];
		if (!det || isNaN(det) || !isFinite(m[4]) || !isFinite(m[5])){ return undefined; }
		let a =  m[3]/det;
		let b = -m[1]/det;
		let c = -m[2]/det;
		let d =  m[0]/det;
		let tx = (m[2]*m[5] - m[3]*m[4])/det;
		let ty = (m[1]*m[4] - m[0]*m[5])/det;
		return Matrix(a, b, c, d, tx, ty);
	}
	const multiply = function(m1, m2){
		let a = m1[0] * m2[0] + m1[2] * m2[1];
		let c = m1[0] * m2[2] + m1[2] * m2[3];
		let tx = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
		let b = m1[1] * m2[0] + m1[3] * m2[1];
		let d = m1[1] * m2[2] + m1[3] * m2[3];
		let ty = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
		return Matrix(a, b, c, d, tx, ty);
	}
	const rotation = function(angle, origin){
		var a = Math.cos(angle);
		var b = Math.sin(angle);
		var c = -Math.sin(angle);
		var d = Math.cos(angle);
		var tx = (origin != null) ? origin[0] : 0;
		var ty = (origin != null) ? origin[1] : 0;
		return Matrix(a, b, c, d, tx, ty);
	}
	return Object.freeze({
		identity,
		reflection,
		inverse,
		multiply,
		rotation,
		get m() { return _m; },
	});
}

/** are two points equivalent within an epsilon */
function points_equivalent(a, b, epsilon = EPSILON){
	// rectangular bounds test for faster calculation
	return Math.abs(a[0]-b[0]) < epsilon && Math.abs(a[1]-b[1]) < epsilon;
}

function isValidNumber(n){ return n != null && !isNaN(n); }
function isValidXY(p){ return p != null && !isNaN(p.x) && !isNaN(p.y); }
function isValidPoint(p){
	return p.constructor === Array && !isNaN(p[0]) && !isNaN(p[1]);
}


/** clean floating point numbers
 *  example: 15.0000000000000002 into 15
 * the adjustable epsilon is default 15, Javascripts 16 digit float
 */
export function clean_number(num, decimalPlaces = 15){
	if (num == undefined) { return undefined; }
	return parseFloat(num.toFixed(decimalPlaces));
}

/** 
 * this searches user-provided inputs for a valid n-dimensional vector 
 * which includes objects {x:, y:}, arrays [x,y], or sequences of numbers
 * 
 * @returns (number[]) array of number components
*/
export function get_vec(){
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
*/
export function get_matrix(){
	let params = Array.from(arguments);
	if(params.length == 0) { return []; }
	if(params[0].m != null && params[0].m.constructor == Array){
		return params[0].m; // Matrix type
	}
	let arrays = params.filter((param) => param.constructor === Array);
	if(arrays.length >= 1) { return arrays[0]; }
	let numbers = params.filter((param) => !isNaN(param));
	if(numbers.length >= 1) { return numbers; }
	return [];
}
