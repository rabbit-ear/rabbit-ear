// Euclidean plane geometry
// primitives and algorithms for intersections, hulls, transformations
// MIT open source license, Robby Kraft

"use strict";

export var EPSILON_LOW  = 0.003;
export var EPSILON      = 0.00001;
export var EPSILON_HIGH = 0.00000001;
export var EPSILON_UI   = 0.05;  // user tap, based on precision of a finger on a screen

////////////////////////////   DATA TYPES   ///////////////////////////
export class Tree{
	// obj; //T;
	// parent; //Tree<T>;
	// children; //Tree<T>[];
	constructor(thisObject){
		this.obj = thisObject;
		this.parent = undefined;
		this.children = [];
	}
}
//////////////////////////// TYPE CHECKING //////////////////////////// 
function isValidPoint(point){return(point!==undefined&&!isNaN(point.x)&&!isNaN(point.y));}
function isValidNumber(n){return(n!==undefined&&!isNaN(n)&&!isNaN(n));}
function pointsSimilar(a, b, epsilon){
	if(epsilon == undefined){epsilon = EPSILON_HIGH;}
	return epsilonEqual(a.x,b.x,epsilon) && epsilonEqual(a.y,b.y,epsilon);
}
/////////////////////////////// NUMBERS ///////////////////////////////
/** map a number from one range into another */
// function map(input, fl1, ceil1, fl2, ceil2){
// 	return ( (input - fl1) / (ceil1 - fl1) ) * (ceil2 - fl2) + fl2;
// }
/** are 2 numbers similar to each other within an epsilon range. */
function epsilonEqual(a, b, epsilon){
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	return ( Math.abs(a - b) < epsilon );
}
// function formatFloat(num, epsilon){
// 	var fix = parseFloat((num).toFixed(15));
// 	if(num.toString().length - fix.toString().length > 5){ return fix; }
// 	return parseFloat((num).toFixed(14));
// }
/** will clean up numbers like 15.00000000000032 up to an epsilon range */
function cleanNumber(num, decimalPlaces){
	if(Math.floor(num) == num || decimalPlaces == undefined){ return num; }
	return parseFloat(num.toFixed(decimalPlaces));
}

/////////////////////////////////////////////////////////////////////////////////
//                            2D ALGORITHMS
/////////////////////////////////////////////////////////////////////////////////
/** There are 2 interior angles between 2 absolute angle measurements, from A to B return the clockwise one
 *  This is in the cartesian coordinate system. example: angle PI/2 is along the +Y axis
 * @param {number} angle in radians
 * @param {number} angle in radians
 * @returns {number} clockwise interior angle (from a to b) in radians
 */
function clockwiseInteriorAngleRadians(a, b){
	// this is on average 50 to 100 times faster than clockwiseInteriorAngle
	while(a < 0){ a += Math.PI*2; }
	while(b < 0){ b += Math.PI*2; }
	var a_b = a - b;
	if(a_b >= 0) return a_b;
	return Math.PI*2 - (b - a);
}
export function counterClockwiseInteriorAngleRadians(a, b){
	// this is on average 50 to 100 times faster than clockwiseInteriorAngle
	while(a < 0){ a += Math.PI*2; }
	while(b < 0){ b += Math.PI*2; }
	var b_a = b - a;
	if(b_a >= 0) return b_a;
	return Math.PI*2 - (a - b);
}
/** There are 2 interior angles between 2 vectors, from A to B return the clockwise one.
 *  This is in the cartesian coordinate system. example: angle PI/2 is along the +Y axis
 * @param {XY} vector
 * @param {XY} vector
 * @returns {number} clockwise interior angle (from a to b) in radians
 */
export function clockwiseInteriorAngle(a, b){
	// this is on average 50 to 100 slower faster than clockwiseInteriorAngleRadians
	var dotProduct = b.x*a.x + b.y*a.y;
	var determinant = b.x*a.y - b.y*a.x;
	var angle = Math.atan2(determinant, dotProduct);
	if(angle < 0){ angle += Math.PI*2; }
	return angle;
}
function counterClockwiseInteriorAngle(a, b){
	// this is on average 50 to 100 slower faster than clockwiseInteriorAngleRadians
	var dotProduct = a.x*b.x + a.y*b.y;
	var determinant = a.x*b.y - a.y*b.x;
	var angle = Math.atan2(determinant, dotProduct);
	if(angle < 0){ angle += Math.PI*2; }
	return angle;
}
/** There are 2 interior angles between 2 vectors, return both, always the smaller first
 * @param {XY} vector
 * @returns {number[]} 2 angle measurements between vectors
 */
function interiorAngles(a, b){
	var interior1 = clockwiseInteriorAngle(a, b);
	var interior2 = Math.PI*2 - interior1;
	if(interior1 < interior2) return [interior1, interior2];
	return [interior2, interior1];
}
/** This bisects 2 vectors, returning both smaller and larger outside angle bisections [small,large]
 * @param {XY} vector
 * @returns {XY[]} 2 vector angle bisections, the smaller interior angle is always first
 */
function bisectVectors(a, b){
	a = a.normalize();
	b = b.normalize();
	return [ (a.add(b)).normalize(),
	         new XY(-a.x + -b.x, -a.y + -b.y).normalize() ];
}
function intersect_vec_func(aOrigin, aVec, bOrigin, bVec, compFunction, epsilon){
	function determinantXY(a,b){ return a.x * b.y - b.x * a.y; }
	var denominator0 = determinantXY(aVec, bVec);
	var denominator1 = -denominator0;
	if(epsilonEqual(denominator0, 0, epsilon)){ return undefined; } /* parallel */
	var numerator0 = determinantXY(bOrigin.subtract(aOrigin), bVec);
	var numerator1 = determinantXY(aOrigin.subtract(bOrigin), aVec);
	var t0 = numerator0 / denominator0;
	var t1 = numerator1 / denominator1;
	if(compFunction(t0,t1)){ return aOrigin.add(aVec.scale(t0)); }
}
export function intersectionLineLine(a, b, epsilon){
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	return intersect_vec_func(
		new XY(a.point.x, a.point.y),
		new XY(a.direction.x, a.direction.y),
		new XY(b.point.x, b.point.y),
		new XY(b.direction.x, b.direction.y),
		function(t0,t1){return true;}, epsilon);
}
export function intersectionLineRay(line, ray, epsilon){
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	return intersect_vec_func(
		new XY(line.point.x, line.point.y),
		new XY(line.direction.x, line.direction.y),
		new XY(ray.origin.x, ray.origin.y),
		new XY(ray.direction.x, ray.direction.y),
		function(t0,t1){return t1 >= -epsilon;}, epsilon);
}
export function intersectionLineEdge(line, edge, epsilon){
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	return intersect_vec_func(
		new XY(line.point.x, line.point.y),
		new XY(line.direction.x, line.direction.y),
		new XY(edge.nodes[0].x, edge.nodes[0].y),
		new XY(edge.nodes[1].x-edge.nodes[0].x, edge.nodes[1].y-edge.nodes[0].y),
		function(t0,t1){return t1 >= -epsilon && t1 <= 1+epsilon;}, epsilon);
}
export function intersectionRayRay(a, b, epsilon){
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	return intersect_vec_func(
		new XY(a.origin.x, a.origin.y),
		new XY(a.direction.x, a.direction.y),
		new XY(b.origin.x, b.origin.y),
		new XY(b.direction.x, b.direction.y),
		function(t0,t1){return t0 >= -epsilon && t1 >= -epsilon;}, epsilon);
}
// used by voronoi. should work around and remove export
export function intersectionRayEdge(ray, edge, epsilon){
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	return intersect_vec_func(
		new XY(ray.origin.x, ray.origin.y),
		new XY(ray.direction.x, ray.direction.y),
		new XY(edge.nodes[0].x, edge.nodes[0].y),
		new XY(edge.nodes[1].x-edge.nodes[0].x, edge.nodes[1].y-edge.nodes[0].y),
		function(t0,t1){return t0 >= -epsilon && t1 >= -epsilon && t1 <= 1+epsilon;}, epsilon);
}
export function intersectionEdgeEdge(a, b, epsilon){
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	return intersect_vec_func(
		new XY(a.nodes[0].x, a.nodes[0].y),
		new XY(a.nodes[1].x-a.nodes[0].x, a.nodes[1].y-a.nodes[0].y),
		new XY(b.nodes[0].x, b.nodes[0].y),
		new XY(b.nodes[1].x-b.nodes[0].x, b.nodes[1].y-b.nodes[0].y),
		function(t0,t1){return t0 >= -epsilon && t0 <= 1+epsilon && t1 >= -epsilon && t1 <= 1+epsilon;}, epsilon);
}
export function intersectionCircleLine(center, radius, p0, p1){
	var r_squared =  Math.pow(radius,2);
	var x1 = p0.x - center.x;
	var y1 = p0.y - center.y;
	var x2 = p1.x - center.x;
	var y2 = p1.y - center.y;
	var dx = x2 - x1;
	var dy = y2 - y1;
	var dr_squared = dx*dx + dy*dy;
	var D = x1*y2 - x2*y1;
	function sgn(x){ if(x < 0){return -1;} return 1; }
	var x1 = (D*dy + sgn(dy)*dx*Math.sqrt(r_squared*dr_squared - (D*D)))/(dr_squared);
	var x2 = (D*dy - sgn(dy)*dx*Math.sqrt(r_squared*dr_squared - (D*D)))/(dr_squared);
	var y1 = (-D*dx + Math.abs(dy)*Math.sqrt(r_squared*dr_squared - (D*D)))/(dr_squared);
	var y2 = (-D*dx - Math.abs(dy)*Math.sqrt(r_squared*dr_squared - (D*D)))/(dr_squared);
	var intersections = [];
	if(!isNaN(x1)){ intersections.push( new XY(x1 + center.x, y1 + center.y) ); }
	if(!isNaN(x2)){ intersections.push( new XY(x2 + center.x, y2 + center.y) ); }
	return intersections;
}

/////////////////////////////////////////////////////////////////////////////////
//                                GEOMETRY
/////////////////////////////////////////////////////////////////////////////////

/** This is a 2x3 matrix: 2x2 for scale and rotation and 2x1 for translation */
export class Matrix{
	// a; c; tx;
	// b; d; ty;
	constructor(a, b, c, d, tx, ty){
		this.a = (a !== undefined) ? a : 1;
		this.b = (b !== undefined) ? b : 0;
		this.c = (c !== undefined) ? c : 0;
		this.d = (d !== undefined) ? d : 1;
		this.tx = (tx !== undefined) ? tx : 0;
		this.ty = (ty !== undefined) ? ty : 0;
	}
	/** Sets this to be the identity matrix */
	identity(){ this.a=1; this.b=0; this.c=0; this.d=1; this.tx=0; this.ty=0; return this;}
	/** Returns a new matrix that is the sum of this and the argument. Will not change this or the argument
	 * @returns {Matrix} 
	 */
	mult(mat){
		var r = new Matrix();
		r.a = this.a * mat.a + this.c * mat.b;
		r.c = this.a * mat.c + this.c * mat.d;
		r.tx = this.a * mat.tx + this.c * mat.ty + this.tx;
		r.b = this.b * mat.a + this.d * mat.b;
		r.d = this.b * mat.c + this.d * mat.d;
		r.ty = this.b * mat.tx + this.d * mat.ty + this.ty;
		return r;
	}
	/** Creates an inverted copy of this matrix
	 * @returns {Matrix}
	 */
	inverse(){
		var determinant = this.a * this.d - this.b * this.c;
		if (!determinant || isNaN(determinant) || !isFinite(this.tx) || !isFinite(this.ty)){ return undefined; }
		return new Matrix(this.d / determinant, 
		                 -this.b / determinant, 
		                 -this.c / determinant, 
		                  this.a / determinant, 
		                 (this.c * this.ty - this.d * this.tx) / determinant, 
		                 (this.b * this.tx - this.a * this.ty) / determinant);
	}
	/** Creates a transformation matrix representing a reflection across a line
	 * @returns {Matrix} 
	 */
	reflection(vector, offset){
		// the line of reflection passes through offset, runs along vector
		var angle = Math.atan2(vector.y, vector.x);
		var cosAngle = Math.cos(angle);
		var sinAngle = Math.sin(angle);
		var _cosAngle = Math.cos(-angle);
		var _sinAngle = Math.sin(-angle);
		this.a = cosAngle *  _cosAngle +  sinAngle * _sinAngle;
		this.b = cosAngle * -_sinAngle +  sinAngle * _cosAngle;
		this.c = sinAngle *  _cosAngle + -cosAngle * _sinAngle;
		this.d = sinAngle * -_sinAngle + -cosAngle * _cosAngle;
		// todo, if offset is undefined, should we set tx and ty to 0, or leave as is?
		if(offset !== undefined){
			this.tx = offset.x + this.a * -offset.x + -offset.y * this.c;
			this.ty = offset.y + this.b * -offset.x + -offset.y * this.d;
		}
		return this;
	}

	rotation(angle, origin){
		this.a = Math.cos(angle);   this.c = -Math.sin(angle);
		this.b = Math.sin(angle);   this.d =  Math.cos(angle);
		// todo, if origin is undefined, should we set tx and ty to 0, or leave as is?
		if(origin !== undefined){ this.tx = origin.x; this.ty = origin.y; }
		return this;
	}
	/** Deep-copy the Matrix and return it as a new object
	 * @returns {Matrix} 
	 */
	copy(){
		var m = new Matrix();
		m.a = this.a;   m.c = this.c;   m.tx = this.tx;
		m.b = this.b;   m.d = this.d;   m.ty = this.ty;
		return m;
	}
}

/** The base type for all vector representations, contains numbers x and y */
export class XY {
	// x;
	// y;
	constructor(x, y){ this.x = x; this.y = y; }
	normalize() { var m = this.magnitude(); return new XY(this.x/m, this.y/m);}
	dot(point) { return this.x * point.x + this.y * point.y; }
	cross(vector){ return this.x*vector.y - this.y*vector.x; }
	magnitude() { return Math.sqrt(this.x * this.x + this.y * this.y); }
	distanceTo(a){return Math.sqrt(Math.pow(this.x-a.x,2)+Math.pow(this.y-a.y,2));}
	transform(matrix){
		return new XY(this.x * matrix.a + this.y * matrix.c + matrix.tx,
					  this.x * matrix.b + this.y * matrix.d + matrix.ty);
	}
	translate(dx, dy){ return new XY(this.x+dx,this.y+dy);}
	rotate90() { return new XY(-this.y, this.x); }
	rotate180() { return new XY(-this.x, -this.y); }
	rotate270() { return new XY(this.y, -this.x); }
	rotate(angle, origin){ return this.transform( new Matrix().rotation(angle, origin) ); }
	lerp(point, pct){ var inv=1.0-pct; return new XY(this.x*pct+point.x*inv,this.y*pct+point.y*inv); }
	/** reflects this point about a line that passes through 'a' and 'b' */
	reflect(line){
		var origin = (line.direction != undefined) ? (line.point || line.origin) : new XY(line.nodes[0].x, line.nodes[0].y);
		var vector = (line.direction != undefined) ? line.direction : new XY(line.nodes[1].x, line.nodes[1].y).subtract(origin);
		return this.transform( new Matrix().reflection(vector, origin) );
	}
	scale(magnitude){ return new XY(this.x*magnitude, this.y*magnitude); }
	add(a, b){
		if(isValidPoint(a)){ return new XY(this.x+a.x, this.y+a.y); }
		else if(isValidNumber(b)){ return new XY(this.x+a, this.y+b); }
	}
	// todo, outfit all these constructors with flexible parameters like add()
	subtract(point){ return new XY(this.x-point.x, this.y-point.y); }
	multiply(m){ return new XY(this.x*m.x, this.y*m.y); }
	abs(){ return new XY(Math.abs(this.x), Math.abs(this.y)); }
	commonX(point, epsilon){return epsilonEqual(this.x, point.x, epsilon);}
	commonY(point, epsilon){return epsilonEqual(this.y, point.y, epsilon);}
	midpoint(other){ return new XY((this.x+other.x)*0.5, (this.y+other.y)*0.5); }
	equivalent(point, epsilon){
		if(epsilon == undefined){ epsilon = EPSILON_HIGH; }
		// rect bounding box for now, much cheaper than radius calculation
		return (epsilonEqual(this.x, point.x, epsilon) && epsilonEqual(this.y, point.y, epsilon))
	}
}
/** All line types (lines, rays, edges) must implement these functions */
class LineType{
	length(){}
	vector(){}
	parallel(line, epsilon){}
	collinear(point){}
	equivalent(line, epsilon){}
	degenerate(epsilon){}
	intersection(line, epsilon){}
	reflectionMatrix(){}
	nearestPoint(point){}
	nearestPointNormalTo(point){}
	transform(matrix){}
	// clipWithEdge(edge, epsilon){}
	// clipWithEdges(edges, epsilon){}
	// clipWithEdgesDetails(edges, epsilon){}
}
/** 2D line, extending infinitely in both directions, represented by a point and a vector */
export class Line{
	// point;
	// direction;
	constructor(a, b, c, d){
		// if(b instanceof XY){ this.point = a; this.direction = b; }
		if(a.x !== undefined){this.point = new XY(a.x, a.y); this.direction = new XY(b.x, b.y);}
		else{ this.point = new XY(a,b); this.direction = new XY(c,d); }
	}
	rays(){var a = new Ray(this.point, this.direction); return [a,a.flip()];}
	// implements LineType
	length(){ return Infinity; }
	vector(){ return this.direction; }
	parallel(line, epsilon){
		// works for Edges (2 XY nodes), or Lines or Rays (point and vector)
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		var v = (line.nodes !== undefined)
		        ? new XY(line.nodes[1].x-line.nodes[0].x, line.nodes[1].y-line.nodes[0].y)
		        : line.direction;
		return (v !== undefined) ? epsilonEqual(this.direction.cross(v), 0, epsilon) : undefined;
	}
	collinear(point, epsilon){
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		var x = [ this.point.x, this.point.x + this.direction.x, point.x ];
		var y = [ this.point.y, this.point.y + this.direction.y, point.y ];
		return epsilonEqual(x[0]*(y[1]-y[2]) + x[1]*(y[2]-y[0]) + x[2]*(y[0]-y[1]), 0, epsilon);
	}
	equivalent(line, epsilon){
		// if lines are parallel and share a point in common
		return this.collinear(line.point, epsilon) && this.parallel(line, epsilon);
	}
	degenerate(epsilon){
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		return epsilonEqual(this.direction.magnitude(), 0, epsilon);
	}
	intersection(line, epsilon){
		if(line instanceof Line){ return intersectionLineLine(this, line, epsilon); }
		if(line instanceof Ray){  return intersectionLineRay(this, line, epsilon);  }
		if(line instanceof Edge){ return intersectionLineEdge(this, line, epsilon); }
	}
	reflectionMatrix(){ return new Matrix().reflection(this.direction, this.point); }
	nearestPoint(point){ return this.nearestPointNormalTo(point); }
	nearestPointNormalTo(point){
		var v = this.direction.normalize();
		var u = ((point.x-this.point.x)*v.x + (point.y-this.point.y)*v.y);
		return new XY(this.point.x + u*v.x, this.point.y + u*v.y);
	}
	transform(matrix){
		// todo: a little more elegant of a solution, please
		var temp = this.point.add(this.direction.normalize());
		if(temp == undefined){ return this; }
		var p0 = this.point.transform(matrix);
		var p1 = temp.transform(matrix);
		return new Edge(p0.x, p0.y, p1.x, p1.y).infiniteLine();
	}
	bisect(line){
		if( this.parallel(line) ){
			return [new Line( this.point.midpoint(line.point), this.direction)];
		} else{
			var intersection = intersectionLineLine(this, line);
			var vectors = bisectVectors(this.direction, line.direction);
			vectors[1] = vectors[1].rotate90();
			if(Math.abs(this.direction.cross(vectors[1])) < Math.abs(this.direction.cross(vectors[0]))){
				var swap = vectors[0];    vectors[0] = vectors[1];    vectors[1] = swap;
			}
			return vectors.map(function(el){ return new Line(intersection, el); },this);
		}
	}
	subsect(line, count){
		var pcts = Array.apply(null, Array(count)).map(function(el,i){return i/count;});
		pcts.shift();
		if( this.parallel(line) ){
			return pcts.map(function(pct){ return new Line( this.point.lerp(line.point, pct), this.direction); },this);
		} else{
			var intersection = intersectionLineLine(this, line);
			// creates an array of sectors [a, b], by first building array of array [[a1,a2], [b1,b2]]
			// and filtering out the wrong-winding by sorting and locating smaller of the two.
			return [
				[ new Sector(intersection, [intersection.add(this.direction), intersection.add(line.direction)]),
				  new Sector(intersection, [intersection.add(this.direction), intersection.add(line.direction.rotate180())])
				  ].sort(function(a,b){ return a.angle() - b.angle(); }).shift(),
				[ new Sector(intersection, [intersection.add(line.direction), intersection.add(this.direction)]),
				  new Sector(intersection, [intersection.add(line.direction), intersection.add(this.direction.rotate180())])
				  ].sort(function(a,b){ return a.angle() - b.angle(); }).shift()
			].map(function(sector){ return sector.subsect(count); },this)
				.reduce(function(prev, curr){ return prev.concat(curr); },[])
				.map(function(ray){ return new Line(ray.origin, ray.direction); },this);
		}
	}
}
/** 2D line, extending infinitely in one direction, represented by a point and a vector */
export class Ray{
	// origin;
	// direction;
	constructor(a, b, c, d){
		// if(a instanceof XY){ this.origin = a; this.direction = b; }
		if(a.x !== undefined){
			this.origin = new XY(a.x, a.y);
			this.direction = new XY(b.x, b.y);
		}
		else{ 
			this.origin = new XY(a, b);
			this.direction = new XY(c, d);
		};
	}
	// implements LineType
	length(){return Infinity;}
	vector(){return this.direction;}
	parallel(line, epsilon){
		// works for Edges (2 XY nodes), or Lines or Rays (point and vector)
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		var v = (line.nodes !== undefined)
		        ? new XY(line.nodes[1].x-line.nodes[0].x, line.nodes[1].y-line.nodes[0].y)
		        : line.direction;
		if(v === undefined){ return undefined; }
		return epsilonEqual(this.direction.cross(v), 0, epsilon);
	}
	collinear(point, epsilon){
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		var pOrigin = new XY(point.x-this.origin.x, point.y-this.origin.y);
		var dot = pOrigin.dot(this.direction);
		if(dot < -epsilon){ return false; }  // point is behind the ray's origin
		var cross = pOrigin.cross(this.direction);
		return epsilonEqual(cross, 0, epsilon);
	}
	equivalent(ray, epsilon){
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		return (this.origin.equivalent(ray.origin, epsilon) &&
		        this.direction.normalize().equivalent(ray.direction.normalize(), epsilon));
	}
	degenerate(epsilon){
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		return epsilonEqual(this.direction.magnitude(), 0, epsilon);
	}
	intersection(line, epsilon){
		if(line instanceof Ray){ return intersectionRayRay(this, line, epsilon); }
		if(line instanceof Line){ return intersectionLineRay(line, this, epsilon); }
		if(line instanceof Edge){ return intersectionRayEdge(this, line, epsilon); }
	}
	reflectionMatrix(){ return new Matrix().reflection(this.direction, this.origin); }
	nearestPoint(point){
		var answer = this.nearestPointNormalTo(point);
		if(answer !== undefined){ return answer; }
		return this.origin;
	}
	nearestPointNormalTo(point, epsilon){
		if(epsilon == undefined){ epsilon = EPSILON_HIGH; }
		var v = this.direction.normalize();
		var u = ((point.x-this.origin.x)*v.x + (point.y-this.origin.y)*v.y);
		// todo: did I guess right? < 0, and not > 1.0
		if(u < -epsilon){ return undefined; }
		return new XY(this.origin.x + u*v.x, this.origin.y + u*v.y);
	}
	transform(matrix){
		// todo: who knows if this works
		return new Ray(this.origin.transform(matrix), this.direction.transform(matrix));
	}
	// additional methods
	flip(){ return new Ray(this.origin, new XY(-this.direction.x, -this.direction.y)); }
	/** this returns undefined if ray and edge don't intersect
	 * edge.nodes[0] is always the ray.origin
	 */
	clipWithEdge(edge, epsilon){
		var intersect = intersectionRayEdge(this, edge, epsilon);
		if(intersect === undefined){ return undefined; }
		return new Edge(this.origin, intersect);
	}
	/** this returns array of edges, sorted by shortest to longest */
	clipWithEdges(edges, epsilon){
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		return edges
			.map(function(edge){ return this.clipWithEdge(edge); }, this)
			.filter(function(edge){ return edge !== undefined; })
			.map(function(edge){ return {edge:edge, length:edge.length()}; })
			.filter(function(el){ return el.length > epsilon})
			.sort(function(a,b){ return a.length - b.length; })
			.map(function(el){ return el.edge })
	}
	intersectionsWithEdges(edges, epsilon){
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		return edges
			.map(function(edge){ return intersectionRayEdge(this, edge, epsilon); }, this)
			.filter(function(point){ return point !== undefined; },this)
			.map(function(point){ return {point:point, length:point.distanceTo(this.origin)}; },this)
			.sort(function(a,b){ return a.length - b.length; })
			.map(function(el){ return el.point },this);
	}
	clipWithEdgesDetails(edges, epsilon){
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		return edges
			.map(function(edge){ return {'edge':this.clipWithEdge(edge), 'intersection':edge } },this)
			.filter(function(el){ return el.edge !== undefined; })
			.map(function(el){ return {
				'edge':el.edge, 
				'intersection':el.intersection, 
				'length':el.edge.length()}; })
			.filter(function(el){ return el.length > epsilon; })
			.sort(function(a,b){ return a.length - b.length; })
			.map(function(el){ return {edge:el.edge,intersection:el.intersection}; })
	}
}
/** 2D finite line, bounded and defined by two endpoints */
export class Edge{
	// nodes;
	// a, b are points, or
	// (a,b) point 1 and (c,d) point 2, each x,y
	constructor(a, b, c, d){
		// if((a instanceof XY) && (b instanceof XY)){this.nodes = [a,b];}
		if(a.x !== undefined){this.nodes = [new XY(a.x, a.y), new XY(b.x, b.y)];}
		else if(isValidNumber(d)){ this.nodes = [new XY(a,b), new XY(c,d)]; }
		else if(a.nodes !== undefined){this.nodes = [new XY(a.nodes[0].x, a.nodes[0].y), new XY(a.nodes[1].x, a.nodes[1].y)];}
	}
	// implements LineType
	length(){ return Math.sqrt( Math.pow(this.nodes[0].x-this.nodes[1].x,2) + Math.pow(this.nodes[0].y-this.nodes[1].y,2) ); }
	vector(originNode){
		if(originNode === undefined){ return this.nodes[1].subtract(this.nodes[0]); }
		if(this.nodes[0].equivalent(originNode)){
			return this.nodes[1].subtract(this.nodes[0]);
		}
		return this.nodes[0].subtract(this.nodes[1]);
	}
	parallel(line, epsilon){
		// works for Edges (2 XY nodes), or Lines or Rays (point and vector)
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		var v = (line.nodes !== undefined)
		        ? new XY(line.nodes[1].x-line.nodes[0].x, line.nodes[1].y-line.nodes[0].y)
		        : line.direction;
		if(v === undefined){ return undefined; }
		var u = this.nodes[1].subtract(this.nodes[0]);
		return epsilonEqual(u.cross(v), 0, epsilon);
	}
	collinear(point, epsilon){
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		var p0 = new Edge(point, this.nodes[0]).length();
		var p1 = new Edge(point, this.nodes[1]).length();
		return epsilonEqual(this.length() - p0 - p1, 0, epsilon);
	}
	equivalent(e, epsilon){
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		return ((this.nodes[0].equivalent(e.nodes[0],epsilon) &&
		         this.nodes[1].equivalent(e.nodes[1],epsilon)) ||
		        (this.nodes[0].equivalent(e.nodes[1],epsilon) &&
		         this.nodes[1].equivalent(e.nodes[0],epsilon)) );
	}
	degenerate(epsilon){
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		return this.nodes[0].equivalent(this.nodes[1], epsilon);
	}
	intersection(line, epsilon){
		if(line instanceof Edge){ return intersectionEdgeEdge(this, line, epsilon); }
		if(line instanceof Line){ return intersectionLineEdge(line, this, epsilon); }
		if(line instanceof Ray){ return intersectionRayEdge(line, this, epsilon); }
	}
	reflectionMatrix(){
		return new Matrix().reflection(this.nodes[1].subtract(this.nodes[0]), this.nodes[0]);
	}
	nearestPoint(point){
		var answer = this.nearestPointNormalTo(point);
		if(answer !== undefined){ return answer; }
		return this.nodes
			.map(function(el){ return {point:el,distance:el.distanceTo(point)}; },this)
			.sort(function(a,b){ return a.distance - b.distance; })
			.shift()
			.point;
	}
	nearestPointNormalTo(point, epsilon){
		if(epsilon == undefined){ epsilon = EPSILON_HIGH; }
		var p = this.nodes[0].distanceTo(this.nodes[1]);
		var u = ((point.x-this.nodes[0].x)*(this.nodes[1].x-this.nodes[0].x) + (point.y-this.nodes[0].y)*(this.nodes[1].y-this.nodes[0].y)) / (Math.pow(p,2));
		if(u < -epsilon || u > 1.0 + epsilon){ return undefined; }
		return new XY(this.nodes[0].x + u*(this.nodes[1].x-this.nodes[0].x), this.nodes[0].y + u*(this.nodes[1].y-this.nodes[0].y));
	}
	transform(matrix){
		return new Edge(this.nodes[0].transform(matrix), this.nodes[1].transform(matrix));
	}
	// additional methods
	midpoint() { return new XY( 0.5*(this.nodes[0].x + this.nodes[1].x),
								   0.5*(this.nodes[0].y + this.nodes[1].y));}
	perpendicularBisector(){ return new Line(this.midpoint(), this.vector().rotate90()); }
	infiniteLine(){ return new Line(this.nodes[0], this.nodes[1].subtract(this.nodes[0]).normalize()); }
}
/** A path of node-adjacent edges defined by a set of nodes. */
export class Polyline{
	// nodes;

	constructor(){ this.nodes = []; }

	edges(){
		var result = [];
		for(var i = 0; i < this.nodes.length-1; i++){
			result.push( new Edge(this.nodes[i], this.nodes[i+1]) );
		}
		return result;
	}

	rayReflectRepeat(ray, intersectable, target){
		const REFLECT_LIMIT = 666;
		var clips = [];
		var firstClips = ray.clipWithEdgesDetails(intersectable);
		if (firstClips.length == 0){ return this; }
		// special case: original ray directed toward target
		if(target !== undefined &&
		   epsilonEqual(ray.direction.cross(target.subtract(ray.origin)), 0, EPSILON_HIGH)){
			if(firstClips.length === 0 || 
			   ray.origin.distanceTo(target) < firstClips[0].edge.length()){
				this.nodes = [ray.origin, target];
				return this;
			}
		}
		clips.push( firstClips[0] );
		var i = 0;
		while(i < REFLECT_LIMIT){
			// build new ray, reflected across edge
			var prevClip = clips[clips.length-1];
			// if(prevClip.edge.nodes[0].equivalent(prevClip.intersection.nodes[0]) ||
			//    prevClip.edge.nodes[0].equivalent(prevClip.intersection.nodes[1]) ||
			//    prevClip.edge.nodes[1].equivalent(prevClip.intersection.nodes[0]) ||
			//    prevClip.edge.nodes[1].equivalent(prevClip.intersection.nodes[1])){ break; }
			var n0 = new XY(prevClip.intersection.nodes[0].x, prevClip.intersection.nodes[0].y);
			var n1 = new XY(prevClip.intersection.nodes[1].x, prevClip.intersection.nodes[1].y);
			var reflection = new Matrix().reflection(n1.subtract(n0), n0);
			var newRay = new Ray(prevClip.edge.nodes[1], prevClip.edge.nodes[0].transform(reflection).subtract(prevClip.edge.nodes[1]));
			// get next edge intersections
			var newClips = newRay.clipWithEdgesDetails(intersectable);
			if(target !== undefined &&
			   epsilonEqual(newRay.direction.cross(target.subtract(newRay.origin)), 0, EPSILON_HIGH)){
				clips.push({edge:new Edge(newRay.origin, target), intersection:undefined});
				break;
			}
			if(newClips.length === 0 || newClips[0] === undefined){ break; }
			clips.push( newClips[0] );
			i++;
		}
		this.nodes = clips.map(function(el){ return el.edge.nodes[0]; });
		this.nodes.push( clips[clips.length-1].edge.nodes[1] );
		return this;
	}
}
/** A rectilinear space defined by width and height and one corner of the rectangle */
export class Rect{
	// origin
	// size
	constructor(x,y,width,height){
		this.origin = {'x':x, 'y':y};
		this.size = {'width':width, 'height':height};
	}
	contains(point, epsilon){
		if(epsilon == undefined){ epsilon = 0; }
		return point.x > this.origin.x - epsilon && 
		       point.y > this.origin.y - epsilon &&
		       point.x < this.origin.x + this.size.width + epsilon &&
		       point.y < this.origin.y + this.size.height + epsilon;
	}
}
/** A verbose representation of a triangle containing points, edges, sectors (interior angles), and its circumcenter */
export class Triangle{
	// points;
	// edges;
	// circumcenter;
	// sectors;
	constructor(points, circumcenter){
		this.points = points;
		this.edges = this.points.map(function(el,i){
			var nextEl = this.points[ (i+1)%this.points.length ];
			return new Edge(el, nextEl);
		},this);
		this.sectors = this.points.map(function(el,i){
			var prevI = (i+this.points.length-1)%this.points.length;
			var nextI = (i+1)%this.points.length;
			return new Sector(el, [this.points[prevI], this.points[nextI]]);
		},this);
		this.circumcenter = circumcenter;
		if(circumcenter === undefined){
			// TODO: calculate circumcenter
		}
	}
	angles(){
		return this.points.map(function(p,i){
			var prevP = this.points[(i+this.points.length-1)%this.points.length];
			var nextP = this.points[(i+1)%this.points.length];
			return clockwiseInteriorAngle(nextP.subtract(p), prevP.subtract(p));
		},this);
	}
	incenter(){
		var sides = this.edges.map(function(e){return e.length();},this);
		sides.push(sides.shift());
		var perimeter = sides.reduce(function(prev,curr){return prev+curr;},0);
		return sides.reduce(function(prev,curr,i){ return prev.add(this.points[i].scale(curr)); }.bind(this),new XY(0,0)).scale(1/perimeter);
	}
	isAcute(){
		var a = this.angles();
		for(var i = 0; i < a.length; i++){if(a[i] > Math.PI*0.5){return false;}}
		return true;
	}
	isObtuse(){
		var a = this.angles();
		for(var i = 0; i < a.length; i++){if(a[i] > Math.PI*0.5){return true;}}
		return false;
	}
	isRight(){
		var a = this.angles();
		for(var i = 0; i < a.length; i++){if(epsilonEqual(a[i],Math.PI*0.5)){return true;}}
		return false;
	}
	pointInside(p, epsilon){
		if(epsilon == undefined){ epsilon = EPSILON_HIGH; }
		for(var i = 0; i < this.points.length; i++){
			var p0 = this.points[i];
			var p1 = this.points[(i+1)%this.points.length];
			var cross = (p.y - p0.y) * (p1.x - p0.x) - 
			            (p.x - p0.x) * (p1.y - p0.y);
			if(cross < -epsilon){ return false; }
		}
		return true;
	}
}
/** A circle defined by its center point and radius length */
export class Circle{
	// center;
	// radius;
	constructor(a, b, c){
		if(c !== undefined){
			this.center = new XY(a, b);
			this.radius = c;
		} else{
			this.center = a;
			this.radius = b;
		}
	}
	intersection(line){
		if(line instanceof Line){return intersectionCircleLine(this.center,this.radius, line.point, line.point.add(line.direction));}
		if(line instanceof Edge){return intersectionCircleLine(this.center,this.radius, line.nodes[0], line.nodes[1]);}
		if(line instanceof Ray){return intersectionCircleLine(this.center,this.radius, line.origin, line.origin.add(line.direction));}
	}
}
/** The boundary of a polygon defined by a sequence of nodes */
export class Polygon{
	// nodes;
	constructor(){ this.nodes = []; }
	/** This compares two polygons by checking their nodes are the same, and in the same order.
	 * @returns {boolean} whether two polygons are equivalent or not
	 * @example
	 * var equivalent = polygon.equivalent(anotherPolygon)
	 */
	equivalent(polygon){
		// quick check, if number of nodes differs, can't be equivalent
		if(polygon.nodes.length != this.nodes.length){return false;}
		var iFace = undefined;
		polygon.nodes.forEach(function(n,i){ if(n === this.nodes[0]){ iFace = i; return; }},this);
		if(iFace == undefined){return false;}
		for(var i = 0; i < this.nodes.length; i++){
			var iFaceMod = (iFace + i) % this.nodes.length;
			if(this.nodes[i] !== polygon.nodes[iFaceMod]){return false;}
		}
		return true;
	}
	/** Tests whether or not a point is contained inside a polygon. This is counting on the polygon to be convex.
	 * @returns {boolean} whether the point is inside the polygon or not
	 * @example
	 * var isInside = polygon.contains( {x:0.5, y:0.5} )
	 */
	contains(point){
    	var isInside = false;
		// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
		for(var i = 0, j = this.nodes.length - 1; i < this.nodes.length; j = i++) {
			if( (this.nodes[i].y > point.y) != (this.nodes[j].y > point.y) &&
			point.x < (this.nodes[j].x - this.nodes[i].x) * (point.y - this.nodes[i].y) / (this.nodes[j].y - this.nodes[i].y) + this.nodes[i].x ) {
				isInside = !isInside;
			}
		}
		return isInside;
	}
	/** Calculates the signed area of a polygon. This requires the polygon be non-intersecting.
	 * @returns {number} the area of the polygon
	 * @example
	 * var area = polygon.signedArea()
	 */
	signedArea(){
		return 0.5 * this.nodes.map(function(el,i){
			var nextEl = this.nodes[ (i+1)%this.nodes.length ];
			return el.x*nextEl.y - nextEl.x*el.y;
		},this)
		.reduce(function(prev, cur){ return prev + cur; },0);
	}
	/** Calculates the centroid or the center of mass of the polygon.
	 * @returns {XY} the location of the centroid
	 * @example
	 * var centroid = polygon.centroid()
	 */
	centroid(){
		return this.nodes.map(function(el,i){
			var nextEl = this.nodes[ (i+1)%this.nodes.length ];
			var mag = el.x*nextEl.y - nextEl.x*el.y;
			return new XY((el.x+nextEl.x)*mag, (el.y+nextEl.y)*mag);
		},this)
		.reduce(function(prev,current){ return prev.add(current); },new XY(0,0))
		.scale(1/(6 * this.signedArea()));
	}
	/** Calculates the center of the bounding box made by the edges of the polygon.
	 * @returns {XY} the location of the center of the bounding box
	 * @example
	 * var boundsCenter = polygon.center()
	 */
	center(){
		var xMin = Infinity, xMax = 0, yMin = Infinity, yMax = 0;
		for(var i = 0; i < this.nodes.length; i++){ 
			if(this.nodes[i].x > xMax){ xMax = this.nodes[i].x; }
			if(this.nodes[i].x < xMin){ xMin = this.nodes[i].x; }
			if(this.nodes[i].y > yMax){ yMax = this.nodes[i].y; }
			if(this.nodes[i].y < yMin){ yMin = this.nodes[i].y; }
		}
		return new XY(xMin+(xMax-xMin)*0.5, yMin+(yMax-yMin)*0.5);
	}
	/** Apply a matrix transform to this polygon by transforming the location of its points.
	 * @example
	 * polygon.transform(matrix)
	 */
	transform(matrix){ this.nodes.forEach(function(node){node.transform(matrix);},this); }
}
/** An ordered set of node-adjacent edges defining the boundary of a convex 2D space */
export class ConvexPolygon{
	// edges;
	constructor(){ this.edges = []; }
	nodes(){
		return this.edges.map(function(el,i){
			var nextEl = this.edges[ (i+1)%this.edges.length ];
			if(el.nodes[0].equivalent(nextEl.nodes[0]) || el.nodes[0].equivalent(nextEl.nodes[1])){
				return el.nodes[1];
			}
			return el.nodes[0];
		},this);
	}
	static withPoints(points){
		var poly = new ConvexPolygon();
		poly.edges = points.map(function(el,i){
			var nextEl = points[ (i+1)%points.length ];
			return new Edge(el, nextEl);
		},this);
		return poly;
	}
	static regularPolygon(sides){
		var halfwedge = 2*Math.PI/sides * 0.5;
		var radius = Math.cos(halfwedge);
		var points = [];
		for(var i = 0; i < sides; i++){
			var a = -2 * Math.PI * i / sides + halfwedge;
			var x = cleanNumber(radius * Math.sin(a), 14);
			var y = cleanNumber(radius * Math.cos(a), 14);
			points.push( new XY(x, y) ); // align point along Y
		}
		this.setEdgesFromPoints(points);
		return this;
	}
	static convexHull(points, includeCollinear){
		if(includeCollinear == undefined){ includeCollinear = false; }
		// validate input
		if(points === undefined || points.length === 0){ return undefined; }
		// # points in the convex hull before escaping function
		var INFINITE_LOOP = 10000;
		// sort points by x and y
		var sorted = points.slice().sort(function(a,b){
			if(epsilonEqual(a.y, b.y, EPSILON_HIGH)){ return a.x - b.x; }
			return a.y - b.y;
		});
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
				.filter(function(el){ 
					return !(epsilonEqual(el.x, hull[h].x, EPSILON_HIGH) && epsilonEqual(el.y, hull[h].y, EPSILON_HIGH)) })
				// sort by angle, setting lowest values next to "ang"
				.map(function(el){
					var angle = Math.atan2(hull[h].y - el.y, hull[h].x - el.x);
					while(angle < ang){ angle += Math.PI*2; }
					return {node:el, angle:angle, distance:undefined}; })  // distance to be set later
				.sort(function(a,b){return (a.angle < b.angle)?-1:(a.angle > b.angle)?1:0});
			if(angles.length === 0){ return undefined; }
			// narrowest-most right turn
			var rightTurn = angles[0];
			// collect all other points that are collinear along the same ray
			angles = angles.filter(function(el){ return epsilonEqual(rightTurn.angle, el.angle, EPSILON_LOW); })
			// sort collinear points by their distances from the connecting point
			.map(function(el){ 
				var distance = Math.sqrt(Math.pow(hull[h].x-el.node.x, 2) + Math.pow(hull[h].y-el.node.y, 2));
				el.distance = distance;
				return el;})
			// (OPTION 1) exclude all collinear points along the hull 
			.sort(function(a,b){return (a.distance < b.distance)?1:(a.distance > b.distance)?-1:0});
			// (OPTION 2) include all collinear points along the hull
			// .sort(function(a,b){return (a.distance < b.distance)?-1:(a.distance > b.distance)?1:0});
			// if the point is already in the convex hull, we've made a loop. we're done
			// if(contains(hull, angles[0].node)){
			// if(includeCollinear){
			// 	points.sort(function(a,b){return (a.distance - b.distance)});
			// } else{
			// 	points.sort(function(a,b){return b.distance - a.distance});
			// }


			if(hull.filter(function(el){return el === angles[0].node; }).length > 0){
				return ConvexPolygon.withPoints(hull);
			}
			// add point to hull, prepare to loop again
			hull.push(angles[0].node);
			// update walking direction with the angle to the new point
			ang = Math.atan2( hull[h].y - angles[0].node.y, hull[h].x - angles[0].node.x);
		}while(infiniteLoop < INFINITE_LOOP);
		return undefined;
	}

	signedArea(nodes){
		if(nodes === undefined){ nodes = this.nodes(); }
		return 0.5 * nodes.map(function(el,i){
			var nextEl = nodes[ (i+1)%nodes.length ];
			return el.x*nextEl.y - nextEl.x*el.y;
		},this)
		.reduce(function(prev, cur){
			return prev + cur;
		},0);
	}
	centroid(){
		var nodes = this.nodes();
		return nodes.map(function(el,i){
			var nextEl = nodes[ (i+1)%nodes.length ];
			var mag = el.x*nextEl.y - nextEl.x*el.y;
			return new XY((el.x+nextEl.x)*mag, (el.y+nextEl.y)*mag);
		},this)
		.reduce(function(prev,current){
			return prev.add(current);
		},new XY(0,0))
		.scale(1/(6 * this.signedArea(nodes)));
	}
	center(){
		// this is not an average / means
		var xMin = Infinity, xMax = 0, yMin = Infinity, yMax = 0;
		var nodes = this.edges.map(function(el){return el.nodes[0];})
		for(var i = 0; i < nodes.length; i++){ 
			if(nodes[i].x > xMax){ xMax = nodes[i].x; }
			if(nodes[i].x < xMin){ xMin = nodes[i].x; }
			if(nodes[i].y > yMax){ yMax = nodes[i].y; }
			if(nodes[i].y < yMin){ yMin = nodes[i].y; }
		}
		return new XY(xMin+(xMax-xMin)*0.5, yMin+(yMax-yMin)*0.5);
	}
	contains(p, epsilon){
		if(epsilon == undefined){ epsilon = EPSILON_HIGH; }
		var found = true;
		for(var i = 0; i < this.edges.length; i++){
			var a = this.edges[i].nodes[1].subtract(this.edges[i].nodes[0]);
			var b = new XY(p.x-this.edges[i].nodes[0].x,p.y-this.edges[i].nodes[0].y);
			if(a.cross(b) < -epsilon){ return false; }
		}
		return true;
	}
	// contains implemention which iterates over points instead of edges
	// contains(point){
	// 	for(var i = 0; i < this.nodes.length; i++){
	// 		var thisNode = this.nodes[ i ];
	// 		var nextNode = this.nodes[ (i+1)%this.nodes.length ];
	// 		var a = new XY(nextNode.x - thisNode.x, nextNode.y - thisNode.y);
	// 		var b = new XY(point.x - thisNode.x, point.y - thisNode.y);
	// 		if(a.cross(b) < -epsilon){ return false; }
	// 	}
	// 	return true;
	// }
	liesOnEdge(p){
		for(var i = 0; i < this.edges.length; i++){
			if(this.edges[i].collinear(p)){ return true; }
		}
		return false;
	}
	clipEdge(edge){
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
	clipLine(line){
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
	clipRay(ray){
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
	minimumRect(){
		var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
		this.nodes().forEach(function(el){
			if(el.x > maxX){ maxX = el.x; }
			if(el.x < minX){ minX = el.x; }
			if(el.y > maxY){ maxY = el.y; }
			if(el.y < minY){ minY = el.y; }
		});
		return new Rect(minX, minY, maxX-minX, maxY-minY);
	}
	/** deep copy this object and all its contents */
	copy(){
		var p = new ConvexPolygon();
		p.edges = this.edges.map(function(e){
			return new Edge(e.nodes[0].x, e.nodes[0].y, e.nodes[1].x, e.nodes[1].y);
		});
		return p;
	}	
}
/** a Sector is defined by three nodes connecting two adjacent edges (one common node) */
export class Sector{
	// the node in common with the edges
	// origin;
	// the indices of these 2 nodes directly correlate to 2 edges' indices
	// endPoints;
	// angle counter-clockwise from endpoint 0 to 1
	constructor(origin, endpoints){
		this.origin = origin;
		this.endPoints = endpoints;
	}
	vectors(){
		return this.endPoints.map(function(el){
			return new XY(el.x-this.origin.x, el.y-this.origin.y);
		},this);
	}
	/** the interior angle is measured clockwise from endpoint 0 to 1  */
	angle(){
		var vectors = this.vectors();
		return counterClockwiseInteriorAngle(vectors[0], vectors[1]);
	}
	bisect(){
		var vectors = this.vectors();
		var angles = vectors.map(function(el){ return Math.atan2(el.y, el.x); });
		while(angles[0] < 0){ angles[0] += Math.PI*2; }
		while(angles[1] < 0){ angles[1] += Math.PI*2; }
		var interior = counterClockwiseInteriorAngleRadians(angles[0], angles[1]);
		var bisected = angles[0] + interior*0.5;
		return new Ray(new XY(this.origin.x, this.origin.y), new XY(Math.cos(bisected), Math.sin(bisected)));
	}
	subsect(divisions){
		if(divisions == undefined || divisions < 2){ throw "subset() requires number parameter > 1"; }
		var angles = this.vectors().map(function(el){ return Math.atan2(el.y, el.x); });
		while(angles[0] < 0){ angles[0] += Math.PI*2; }
		while(angles[1] < 0){ angles[1] += Math.PI*2; }
		var interior = counterClockwiseInteriorAngleRadians(angles[0], angles[1]);
		var rays = [];
		for(var i = 1; i < divisions; i++){
			var angle = angles[0] + interior * (i/divisions);
			rays.push(new Ray(new XY(this.origin.x, this.origin.y), new XY(Math.cos(angle), Math.sin(angle))));
		}
		return rays;
	}
	equivalent(a){
		return a.origin.equivalent(this.origin) && 
		       a.endPoints[0].equivalent(this.endPoints[0]) && 
		       a.endPoints[1].equivalent(this.endPoints[1]);
	}
	/** a sector contains a point if it is between the two edges in counter-clockwise order */
	contains(point, epsilon){
		if(epsilon == undefined){ epsilon = EPSILON_HIGH; }
		var cross0 = (point.y - this.endPoints[0].y) * (this.origin.x - this.endPoints[0].x) - 
		             (point.x - this.endPoints[0].x) * (this.origin.y - this.endPoints[0].y);
		var cross1 = (point.y - this.origin.y) * (this.endPoints[1].x - this.origin.x) - 
		             (point.x - this.origin.x) * (this.endPoints[1].y - this.origin.y);
		return cross0 < epsilon && cross1 < epsilon;
	}
}
// unimplemented classes. may be useful
// subclass of Triangle
class IsoscelesTriangle extends Triangle{ }
