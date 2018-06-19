// Euclidean plane geometry
// primitives and algorithms for intersections, hulls, transformations
// MIT open source license, Robby Kraft

"use strict";

var EPSILON_LOW  = 0.003;
var EPSILON      = 0.00001;
var EPSILON_HIGH = 0.00000001;
var EPSILON_UI   = 0.05;  // user tap, based on precision of a finger on a screen

////////////////////////////   DATA TYPES   ///////////////////////////
class Tree<T>{
	obj:T;
	parent:Tree<T>;
	children:Tree<T>[];
	constructor(thisObject:T){
		this.obj = thisObject;
		this.parent = undefined;
		this.children = [];
	}
}
//////////////////////////// TYPE CHECKING //////////////////////////// 
function isValidPoint(point:XY):boolean{return(point!==undefined&&!isNaN(point.x)&&!isNaN(point.y));}
function isValidNumber(n:number):boolean{return(n!==undefined&&!isNaN(n)&&!isNaN(n));}
function pointsSimilar(a:any, b:any, epsilon?:number){
	if(epsilon == undefined){epsilon = EPSILON_HIGH;}
	return epsilonEqual(a.x,b.x,epsilon) && epsilonEqual(a.y,b.y,epsilon);
}
/////////////////////////////// NUMBERS ///////////////////////////////
/** map a number from one range into another */
// function map(input:number, fl1:number, ceil1:number, fl2:number, ceil2:number):number{
// 	return ( (input - fl1) / (ceil1 - fl1) ) * (ceil2 - fl2) + fl2;
// }
/** are 2 numbers similar to each other within an epsilon range. */
function epsilonEqual(a:number, b:number, epsilon?:number):boolean{
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	return ( Math.abs(a - b) < epsilon );
}
// if number is within epsilon range of a whole number, remove the floating point noise.
//  example: turns 0.999999989764 into 1.0
function wholeNumberify(num:number, epsilon?:number):number{
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	if(Math.abs(Math.round(num) - num) < epsilon){ num = Math.round(num); }
	return num;
}
// function formatFloat(num:number, epsilon?:number):number{
// 	var fix = parseFloat((num).toFixed(15));
// 	if(num.toString().length - fix.toString().length > 5){ return fix; }
// 	return parseFloat((num).toFixed(14));
// }
/** will clean up numbers like 15.00000000000032 to an epsilon range */
function cleanNumber(num:number, decimalPlaces?:number):number{
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
function clockwiseInteriorAngleRadians(a:number, b:number):number{
	// this is on average 50 to 100 times faster than clockwiseInteriorAngle
	while(a < 0){ a += Math.PI*2; }
	while(b < 0){ b += Math.PI*2; }
	var a_b = a - b;
	if(a_b >= 0) return a_b;
	return Math.PI*2 - (b - a);
}
function counterClockwiseInteriorAngleRadians(a:number, b:number):number{
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
function clockwiseInteriorAngle(a:XY, b:XY):number{
	// this is on average 50 to 100 slower faster than clockwiseInteriorAngleRadians
	var dotProduct = b.x*a.x + b.y*a.y;
	var determinant = b.x*a.y - b.y*a.x;
	var angle = Math.atan2(determinant, dotProduct);
	if(angle < 0){ angle += Math.PI*2; }
	return angle;
}
function counterClockwiseInteriorAngle(a:XY, b:XY):number{
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
function interiorAngles(a:XY, b:XY):number[]{
	var interior1 = clockwiseInteriorAngle(a, b);
	var interior2 = Math.PI*2 - interior1;
	if(interior1 < interior2) return [interior1, interior2];
	return [interior2, interior1];
}
/** This bisects 2 vectors, returning both smaller and larger outside angle bisections [small,large]
 * @param {XY} vector
 * @returns {XY[]} 2 vector angle bisections, the smaller interior angle is always first
 */
function bisectVectors(a:XY, b:XY):XY[]{
	a = a.normalize();
	b = b.normalize();
	return [ (a.add(b)).normalize(),
	         new XY(-a.x + -b.x, -a.y + -b.y).normalize() ];
}
function intersect_vec_func(aOrigin:XY, aVec:XY, bOrigin:XY, bVec:XY, compFunction:(t0:number,t1:number) => boolean, epsilon:number):XY{
	function determinantXY(a:XY,b:XY):number{ return a.x * b.y - b.x * a.y; }
	var denominator0 = determinantXY(aVec, bVec);
	var denominator1 = -denominator0;
	if(epsilonEqual(denominator0, 0, epsilon)){ return undefined; } /* parallel */
	var numerator0 = determinantXY(bOrigin.subtract(aOrigin), bVec);
	var numerator1 = determinantXY(aOrigin.subtract(bOrigin), aVec);
	var t0 = numerator0 / denominator0;
	var t1 = numerator1 / denominator1;
	if(compFunction(t0,t1)){ return aOrigin.add(aVec.scale(t0)); }
}
function intersectionLineLine(a:Line, b:Line, epsilon?:number):XY{
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	return intersect_vec_func(
		new XY(a.point.x, a.point.y),
		new XY(a.direction.x, a.direction.y),
		new XY(b.point.x, b.point.y),
		new XY(b.direction.x, b.direction.y),
		function(t0,t1){return true;}, epsilon);
}
function intersectionLineRay(line:Line, ray:Ray, epsilon?:number):XY{
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	return intersect_vec_func(
		new XY(line.point.x, line.point.y),
		new XY(line.direction.x, line.direction.y),
		new XY(ray.origin.x, ray.origin.y),
		new XY(ray.direction.x, ray.direction.y),
		function(t0,t1){return t1 >= -epsilon;}, epsilon);
}
function intersectionLineEdge(line:Line, edge:Edge, epsilon?:number):XY{
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	return intersect_vec_func(
		new XY(line.point.x, line.point.y),
		new XY(line.direction.x, line.direction.y),
		new XY(edge.nodes[0].x, edge.nodes[0].y),
		new XY(edge.nodes[1].x-edge.nodes[0].x, edge.nodes[1].y-edge.nodes[0].y),
		function(t0,t1){return t1 >= -epsilon && t1 <= 1+epsilon;}, epsilon);
}
function intersectionRayRay(a:Ray, b:Ray, epsilon?:number):XY{
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	return intersect_vec_func(
		new XY(a.origin.x, a.origin.y),
		new XY(a.direction.x, a.direction.y),
		new XY(b.origin.x, b.origin.y),
		new XY(b.direction.x, b.direction.y),
		function(t0,t1){return t0 >= -epsilon && t1 >= -epsilon;}, epsilon);
}
function intersectionRayEdge(ray:Ray, edge:Edge, epsilon?:number):XY{
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	return intersect_vec_func(
		new XY(ray.origin.x, ray.origin.y),
		new XY(ray.direction.x, ray.direction.y),
		new XY(edge.nodes[0].x, edge.nodes[0].y),
		new XY(edge.nodes[1].x-edge.nodes[0].x, edge.nodes[1].y-edge.nodes[0].y),
		function(t0,t1){return t0 >= -epsilon && t1 >= -epsilon && t1 <= 1+epsilon;}, epsilon);
}
function intersectionEdgeEdge(a:Edge, b:Edge, epsilon?:number):XY{
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	return intersect_vec_func(
		new XY(a.nodes[0].x, a.nodes[0].y),
		new XY(a.nodes[1].x-a.nodes[0].x, a.nodes[1].y-a.nodes[0].y),
		new XY(b.nodes[0].x, b.nodes[0].y),
		new XY(b.nodes[1].x-b.nodes[0].x, b.nodes[1].y-b.nodes[0].y),
		function(t0,t1){return t0 >= -epsilon && t0 <= 1+epsilon && t1 >= -epsilon && t1 <= 1+epsilon;}, epsilon);
}
function intersectionCircleLine(center:XY, radius:number, p0:XY, p1:XY):XY[]{
	var r_squared =  Math.pow(radius,2);
	var x1 = p0.x - center.x;
	var y1 = p0.y - center.y;
	var x2 = p1.x - center.x;
	var y2 = p1.y - center.y;
	var dx = x2 - x1;
	var dy = y2 - y1;
	var dr_squared = dx*dx + dy*dy;
	var D = x1*y2 - x2*y1;
	function sgn(x:number){ if(x < 0){return -1;} return 1; }
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
class Matrix{
	a:number; c:number; tx:number;
	b:number; d:number; ty:number;
	constructor(a?:number, b?:number, c?:number, d?:number, tx?:number, ty?:number){
		this.a = (a !== undefined) ? a : 1;
		this.b = (b !== undefined) ? b : 0;
		this.c = (c !== undefined) ? c : 0;
		this.d = (d !== undefined) ? d : 1;
		this.tx = (tx !== undefined) ? tx : 0;
		this.ty = (ty !== undefined) ? ty : 0;
	}
	/** Sets this to be the identity matrix */
	identity(){ this.a=1; this.b=0; this.c=0; this.d=1; this.tx=0; this.ty=0; }
	/** Returns a new matrix that is the sum of this and the argument. Will not change this or the argument
	 * @returns {Matrix} 
	 */
	mult(mat:Matrix):Matrix{
		var r = new Matrix();
		r.a = this.a * mat.a + this.c * mat.b;
		r.c = this.a * mat.c + this.c * mat.d;
		r.tx = this.a * mat.tx + this.c * mat.ty + this.tx;
		r.b = this.b * mat.a + this.d * mat.b;
		r.d = this.b * mat.c + this.d * mat.d;
		r.ty = this.b * mat.tx + this.d * mat.ty + this.ty;
		return r;
	}
	/** Creates a transformation matrix representing a reflection across a line
	 * @returns {Matrix} 
	 */
	reflection(vector:XY, offset?:XY):Matrix{
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

	rotation(angle:number, origin?:XY):Matrix{
		this.a = Math.cos(angle);   this.c = -Math.sin(angle);
		this.b = Math.sin(angle);   this.d =  Math.cos(angle);
		// todo, if origin is undefined, should we set tx and ty to 0, or leave as is?
		if(origin !== undefined){ this.tx = origin.x; this.ty = origin.y; }
		return this;
	}
	/** Deep-copy the Matrix and return it as a new object
	 * @returns {Matrix} 
	 */
	copy():Matrix{
		var m = new Matrix();
		m.a = this.a;   m.c = this.c;   m.tx = this.tx;
		m.b = this.b;   m.d = this.d;   m.ty = this.ty;
		return m;
	}
}
/** The base type for all vector representations, contains numbers x and y */
class XY{
	x:number;
	y:number;
	constructor(x:number, y:number){ this.x = x; this.y = y; }
	equivalent(point:XY, epsilon?:number):boolean{
		if(epsilon == undefined){ epsilon = EPSILON_HIGH; }
		// rect bounding box for now, much cheaper than radius calculation
		return (epsilonEqual(this.x, point.x, epsilon) && epsilonEqual(this.y, point.y, epsilon))
	}
	normalize():XY { var m = this.magnitude(); return new XY(this.x/m, this.y/m);}
	dot(point:XY):number { return this.x * point.x + this.y * point.y; }
	cross(vector:XY):number{ return this.x*vector.y - this.y*vector.x; }
	magnitude():number { return Math.sqrt(this.x * this.x + this.y * this.y); }
	distanceTo(a:XY):number{return Math.sqrt(Math.pow(this.x-a.x,2)+Math.pow(this.y-a.y,2));}
	transform(matrix:Matrix):XY{
		return new XY(this.x * matrix.a + this.y * matrix.c + matrix.tx,
					  this.x * matrix.b + this.y * matrix.d + matrix.ty);
	}
	translate(dx:number, dy:number):XY{ return new XY(this.x+dx,this.y+dy);}
	rotate90():XY { return new XY(-this.y, this.x); }
	rotate180():XY { return new XY(-this.x, -this.y); }
	rotate270():XY { return new XY(this.y, -this.x); }
	rotate(angle:number, origin?:XY){ return this.transform( new Matrix().rotation(angle, origin) ); }
	lerp(point:XY, pct:number):XY{ var inv=1.0-pct; return new XY(this.x*pct+point.x*inv,this.y*pct+point.y*inv); }
	midpoint(other:XY):XY{ return new XY((this.x+other.x)*0.5, (this.y+other.y)*0.5); }
	/** reflects this point about a line that passes through 'a' and 'b' */
	reflect(line:any):XY{
		var origin = (line.direction != undefined) ? (line.point || line.origin) : new XY(line.nodes[0].x, line.nodes[0].y);
		var vector = (line.direction != undefined) ? line.direction : new XY(line.nodes[1].x, line.nodes[1].y).subtract(origin);
		return this.transform( new Matrix().reflection(vector, origin) );
	}
	scale(magnitude:number):XY{ return new XY(this.x*magnitude, this.y*magnitude); }
	add(a:any, b?:any):XY{
		if(isValidPoint(a)){ return new XY(this.x+a.x, this.y+a.y); }
		else if(isValidNumber(b)){ return new XY(this.x+a, this.y+b); }
	}
	// todo, outfit all these constructors with flexible parameters like add()
	subtract(point:XY):XY{ return new XY(this.x-point.x, this.y-point.y); }
	multiply(m:XY):XY{ return new XY(this.x*m.x, this.y*m.y); }
	abs():XY{ return new XY(Math.abs(this.x), Math.abs(this.y)); }
	commonX(point:XY, epsilon?:number):boolean{return epsilonEqual(this.x, point.x, epsilon);}
	commonY(point:XY, epsilon?:number):boolean{return epsilonEqual(this.y, point.y, epsilon);}
}
/** All line types (lines, rays, edges) must implement these functions */
abstract class LineType{
	length(){}
	vector(){}
	parallel(line:any, epsilon?:number){}
	collinear(point:XY){}
	equivalent(line:any, epsilon?:number){}
	degenrate(epsilon?:number){}
	intersection(line:LineType, epsilon?:number){}
	reflectionMatrix(){}
	nearestPoint(point:XY){}
	nearestPointNormalTo(point:XY){}
	transform(matrix:Matrix){}
	// clipWithEdge(edge:Edge, epsilon?:number){}
	// clipWithEdges(edges:Edge[], epsilon?:number){}
	// clipWithEdgesDetails(edges:Edge[], epsilon?:number){}
}
/** 2D line, extending infinitely in both directions, represented by a point and a vector */
class Line implements LineType{
	point:XY;
	direction:XY;
	constructor(a:any, b:any, c?:any, d?:any){
		// if(b instanceof XY){ this.point = a; this.direction = b; }
		if(a.x !== undefined){this.point = new XY(a.x, a.y); this.direction = new XY(b.x, b.y);}
		else{ this.point = new XY(a,b); this.direction = new XY(c,d); }
	}
	rays():[Ray,Ray]{var a = new Ray(this.point, this.direction);return [a,a.flip()];}
	// implements LineType
	length():number{ return Infinity; }
	vector():XY{ return this.direction; }
	parallel(line:any, epsilon?:number):boolean{
		// works for Edges (2 XY nodes), or Lines or Rays (point and vector)
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		var v = (line.nodes !== undefined)
		        ? new XY(line.nodes[1].x-line.nodes[0].x, line.nodes[1].y-line.nodes[0].y)
		        : line.direction;
		return (v !== undefined) ? epsilonEqual(this.direction.cross(v), 0, epsilon) : undefined;
	}
	collinear(point:XY, epsilon?:number):boolean{
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		var x = [ this.point.x, this.point.x + this.direction.x, point.x ];
		var y = [ this.point.y, this.point.y + this.direction.y, point.y ];
		return epsilonEqual(x[0]*(y[1]-y[2]) + x[1]*(y[2]-y[0]) + x[2]*(y[0]-y[1]), 0, epsilon);
	}
	equivalent(line:Line, epsilon?:number):boolean{
		// if lines are parallel and share a point in common
		return this.collinear(line.point, epsilon) && this.parallel(line, epsilon);
	}
	degenrate(epsilon?:number):boolean{
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		return epsilonEqual(this.direction.magnitude(), 0, epsilon);
	}
	intersection(line:LineType, epsilon?:number){
		if(line instanceof Line){ return intersectionLineLine(this, line, epsilon); }
		if(line instanceof Ray){  return intersectionLineRay(this, line, epsilon);  }
		if(line instanceof Edge){ return intersectionLineEdge(this, line, epsilon); }
	}
	reflectionMatrix():Matrix{ return new Matrix().reflection(this.direction, this.point); }
	nearestPoint(point:XY):XY{ return this.nearestPointNormalTo(point); }
	nearestPointNormalTo(point:XY):XY{
		var v = this.direction.normalize();
		var u = ((point.x-this.point.x)*v.x + (point.y-this.point.y)*v.y);
		return new XY(this.point.x + u*v.x, this.point.y + u*v.y);
	}
	transform(matrix:Matrix):Line{
		// todo: who knows if this works
		return new Line(this.point.transform(matrix), this.direction.transform(matrix));
	}
	bisect(line:Line):Line[]{
		if( this.parallel(line) ){
			return [new Line( this.point.midpoint(line.point), this.direction)];
		} else{
			var intersection:XY = intersectionLineLine(this, line);
			var vectors = bisectVectors(this.direction, line.direction);
			vectors[1] = vectors[1].rotate90();
			if(Math.abs(this.direction.cross(vectors[1])) < Math.abs(this.direction.cross(vectors[0]))){
				var swap = vectors[0];    vectors[0] = vectors[1];    vectors[1] = swap;
			}
			return vectors.map(function(el:XY){ return new Line(intersection, el); },this);
		}
	}
	subsect(line:Line, count:number):Line[]{
		var pcts = Array.apply(null, Array(count)).map(function(el,i){return i/count;});
		pcts.shift();
		if( this.parallel(line) ){
			return pcts.map(function(pct){ return new Line( this.point.lerp(line.point, pct), this.direction); },this);
		} else{
			var intersection:XY = intersectionLineLine(this, line);
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
class Ray implements LineType{
	origin:XY;
	direction:XY;
	constructor(a:any, b:any, c?:any, d?:any){
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
	length():number{return Infinity;}
	vector():XY{return this.direction;}
	parallel(line:any, epsilon?:number):boolean{
		// works for Edges (2 XY nodes), or Lines or Rays (point and vector)
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		var v = (line.nodes !== undefined)
		        ? new XY(line.nodes[1].x-line.nodes[0].x, line.nodes[1].y-line.nodes[0].y)
		        : line.direction;
		if(v === undefined){ return undefined; }
		return epsilonEqual(this.direction.cross(v), 0, epsilon);
	}
	collinear(point:XY, epsilon?:number):boolean{
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		var pOrigin = new XY(point.x-this.origin.x, point.y-this.origin.y);
		var dot = pOrigin.dot(this.direction);
		if(dot < -epsilon){ return false; }  // point is behind the ray's origin
		var cross = pOrigin.cross(this.direction);
		return epsilonEqual(cross, 0, epsilon);
	}
	equivalent(ray:Ray, epsilon?:number):boolean{
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		return (this.origin.equivalent(ray.origin, epsilon) &&
		        this.direction.normalize().equivalent(ray.direction.normalize(), epsilon));
	}
	degenrate(epsilon?:number):boolean{
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		return epsilonEqual(this.direction.magnitude(), 0, epsilon);
	}
	intersection(line:LineType, epsilon?:number){
		if(line instanceof Ray){ return intersectionRayRay(this, line, epsilon); }
		if(line instanceof Line){ return intersectionLineRay(line, this, epsilon); }
		if(line instanceof Edge){ return intersectionRayEdge(this, line, epsilon); }
	}
	reflectionMatrix():Matrix{ return new Matrix().reflection(this.direction, this.origin); }
	nearestPoint(point:XY):XY{
		var answer = this.nearestPointNormalTo(point);
		if(answer !== undefined){ return answer; }
		return this.origin;
	}
	nearestPointNormalTo(point:XY):XY{
		var v = this.direction.normalize();
		var u = ((point.x-this.origin.x)*v.x + (point.y-this.origin.y)*v.y);
		// todo: did I guess right? < 0, and not > 1.0
		if(u < 0){ return undefined; }
		return new XY(this.origin.x + u*v.x, this.origin.y + u*v.y);
	}
	transform(matrix:Matrix):Ray{
		// todo: who knows if this works
		return new Ray(this.origin.transform(matrix), this.direction.transform(matrix));
	}
	// additional methods
	flip(){ return new Ray(this.origin, new XY(-this.direction.x, -this.direction.y)); }
	/** this returns undefined if ray and edge don't intersect
	 * edge.nodes[0] is always the ray.origin
	 */
	clipWithEdge(edge:Edge, epsilon?:number):Edge{
		var intersect = intersectionRayEdge(this, edge, epsilon);
		if(intersect === undefined){ return undefined; }
		return new Edge(this.origin, intersect);
	}
	/** this returns array of edges, sorted by shortest to longest */
	clipWithEdges(edges:Edge[], epsilon?:number):Edge[]{
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		return edges
			.map(function(edge:Edge){ return this.clipWithEdge(edge); }, this)
			.filter(function(edge){ return edge !== undefined; })
			.map(function(edge){ return {edge:edge, length:edge.length()}; })
			.filter(function(el){ return el.length > epsilon})
			.sort(function(a,b){ return a.length - b.length; })
			.map(function(el){ return el.edge })
	}
	intersectionsWithEdges(edges:Edge[], epsilon?:number):XY[]{
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		return edges
			.map(function(edge:Edge){ return intersectionRayEdge(this, edge, epsilon); }, this)
			.filter(function(point){ return point !== undefined; },this)
			.map(function(point){ return {point:point, length:point.distanceTo(this.origin)}; },this)
			.sort(function(a,b){ return a.length - b.length; })
			.map(function(el){ return el.point },this);
	}
	clipWithEdgesDetails(edges:Edge[], epsilon?:number):{edge:Edge,intersection:Edge}[]{
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		return edges
			.map(function(edge:Edge){ return {'edge':this.clipWithEdge(edge), 'intersection':edge } },this)
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
class Edge implements LineType{
	nodes:[XY,XY];
	// a, b are points, or
	// (a,b) point 1 and (c,d) point 2, each x,y
	constructor(a:any, b?:any, c?:any, d?:any){
		// if((a instanceof XY) && (b instanceof XY)){this.nodes = [a,b];}
		if(a.x !== undefined){this.nodes = [new XY(a.x, a.y), new XY(b.x, b.y)];}
		else if(isValidNumber(d)){ this.nodes = [new XY(a,b), new XY(c,d)]; }
		else if(a.nodes !== undefined){this.nodes = [new XY(a.nodes[0].x, a.nodes[0].y), new XY(a.nodes[1].x, a.nodes[1].y)];}
	}
	// implements LineType
	length():number{ return Math.sqrt( Math.pow(this.nodes[0].x-this.nodes[1].x,2) + Math.pow(this.nodes[0].y-this.nodes[1].y,2) ); }
	vector(originNode?:XY):XY{
		if(originNode === undefined){ return this.nodes[1].subtract(this.nodes[0]); }
		if(this.nodes[0].equivalent(originNode)){
			return this.nodes[1].subtract(this.nodes[0]);
		}
		return this.nodes[0].subtract(this.nodes[1]);
	}
	parallel(line:any, epsilon?:number):boolean{
		// works for Edges (2 XY nodes), or Lines or Rays (point and vector)
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		var v = (line.nodes !== undefined)
		        ? new XY(line.nodes[1].x-line.nodes[0].x, line.nodes[1].y-line.nodes[0].y)
		        : line.direction;
		if(v === undefined){ return undefined; }
		var u = this.nodes[1].subtract(this.nodes[0]);
		return epsilonEqual(u.cross(v), 0, epsilon);
	}
	collinear(point:XY, epsilon?:number):boolean{
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		var p0 = new Edge(point, this.nodes[0]).length();
		var p1 = new Edge(point, this.nodes[1]).length();
		return epsilonEqual(this.length() - p0 - p1, 0, epsilon);
	}
	equivalent(e:Edge, epsilon?:number):boolean{
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		return ((this.nodes[0].equivalent(e.nodes[0],epsilon) &&
		         this.nodes[1].equivalent(e.nodes[1],epsilon)) ||
		        (this.nodes[0].equivalent(e.nodes[1],epsilon) &&
		         this.nodes[1].equivalent(e.nodes[0],epsilon)) );
	}
	degenrate(epsilon?:number):boolean{
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		return this.nodes[0].equivalent(this.nodes[1], epsilon);
	}
	intersection(line:LineType, epsilon?:number):any{
		if(line instanceof Edge){ return intersectionEdgeEdge(this, line, epsilon); }
		if(line instanceof Line){ return intersectionLineEdge(line, this, epsilon); }
		if(line instanceof Ray){ return intersectionRayEdge(line, this, epsilon); }
	}
	reflectionMatrix():Matrix{
		return new Matrix().reflection(this.nodes[1].subtract(this.nodes[0]), this.nodes[0]);
	}
	nearestPoint(point:XY):XY{
		var answer = this.nearestPointNormalTo(point);
		if(answer !== undefined){ return answer; }
		return this.nodes
			.map(function(el){ return {point:el,distance:el.distanceTo(point)}; },this)
			.sort(function(a,b){ return a.distance - b.distance; })
			.shift()
			.point;
	}
	nearestPointNormalTo(point:XY):XY{
		var p = this.nodes[0].distanceTo(this.nodes[1]);
		var u = ((point.x-this.nodes[0].x)*(this.nodes[1].x-this.nodes[0].x) + (point.y-this.nodes[0].y)*(this.nodes[1].y-this.nodes[0].y)) / (Math.pow(p,2));
		if(u < 0 || u > 1.0){ return undefined; }
		return new XY(this.nodes[0].x + u*(this.nodes[1].x-this.nodes[0].x), this.nodes[0].y + u*(this.nodes[1].y-this.nodes[0].y));
	}
	transform(matrix:Matrix):Edge{
		return new Edge(this.nodes[0].transform(matrix), this.nodes[1].transform(matrix));
	}
	// additional methods
	midpoint():XY { return new XY( 0.5*(this.nodes[0].x + this.nodes[1].x),
								   0.5*(this.nodes[0].y + this.nodes[1].y));}
	perpendicularBisector():Line{ return new Line(this.midpoint(), this.vector().rotate90()); }
	infiniteLine():Line{ return new Line(this.nodes[0], this.nodes[1].subtract(this.nodes[0])); }
}
/** A path of node-adjacent edges defined by a set of nodes. */
class Polyline{
	nodes:XY[];

	constructor(){ this.nodes = []; }

	edges():Edge[]{
		var result = [];
		for(var i = 0; i < this.nodes.length-1; i++){
			result.push( new Edge(this.nodes[i], this.nodes[i+1]) );
		}
		return result;
	}

	rayReflectRepeat(ray:Ray, intersectable:Edge[], target?:XY):Polyline{
		const REFLECT_LIMIT = 666;
		var clips:{edge:Edge,intersection:Edge}[] = [];
		var firstClips:{edge:Edge,intersection:Edge}[] = ray.clipWithEdgesDetails(intersectable);
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
			var prevClip:{edge:Edge,intersection:Edge} = clips[clips.length-1];
			// if(prevClip.edge.nodes[0].equivalent(prevClip.intersection.nodes[0]) ||
			//    prevClip.edge.nodes[0].equivalent(prevClip.intersection.nodes[1]) ||
			//    prevClip.edge.nodes[1].equivalent(prevClip.intersection.nodes[0]) ||
			//    prevClip.edge.nodes[1].equivalent(prevClip.intersection.nodes[1])){ break; }
			var n0 = new XY(prevClip.intersection.nodes[0].x, prevClip.intersection.nodes[0].y);
			var n1 = new XY(prevClip.intersection.nodes[1].x, prevClip.intersection.nodes[1].y);
			var reflection:Matrix = new Matrix().reflection(n1.subtract(n0), n0);
			var newRay = new Ray(prevClip.edge.nodes[1], prevClip.edge.nodes[0].transform(reflection).subtract(prevClip.edge.nodes[1]));
			// get next edge intersections
			var newClips:{edge:Edge,intersection:Edge}[] = newRay.clipWithEdgesDetails(intersectable);
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
class Rect{
	origin:{x:number,y:number};
	size:{width:number, height:number};
	constructor(x:number,y:number,width:number,height:number){
		this.origin = {'x':x, 'y':y};
		this.size = {'width':width, 'height':height};
	}
	contains(point:XY, epsilon?:number):boolean{
		if(epsilon == undefined){ epsilon = 0; }
		return point.x > this.origin.x - epsilon && 
		       point.y > this.origin.y - epsilon &&
		       point.x < this.origin.x + this.size.width + epsilon &&
		       point.y < this.origin.y + this.size.height + epsilon;
	}
}
/** A verbose representation of a triangle containing points, edges, sectors (interior angles), and its circumcenter */
class Triangle{
	points:[XY,XY,XY];
	edges:[Edge, Edge, Edge];
	circumcenter:XY;
	sectors:[Sector,Sector,Sector];
	constructor(points:[XY,XY,XY], circumcenter?:XY){
		this.points = points;
		this.edges = <[Edge, Edge, Edge]>this.points.map(function(el,i){
			var nextEl = this.points[ (i+1)%this.points.length ];
			return new Edge(el, nextEl);
		},this);
		this.sectors = <[Sector,Sector,Sector]>this.points.map(function(el,i){
			var prevI = (i+this.points.length-1)%this.points.length;
			var nextI = (i+1)%this.points.length;
			return new Sector(el, [this.points[prevI], this.points[nextI]]);
		},this);
		this.circumcenter = circumcenter;
		if(circumcenter === undefined){
			// TODO: calculate circumcenter
		}
	}
	angles():[number,number,number]{
		return <[number,number,number]>this.points.map(function(p,i){
			var prevP = this.points[(i+this.points.length-1)%this.points.length];
			var nextP = this.points[(i+1)%this.points.length];
			return clockwiseInteriorAngle(nextP.subtract(p), prevP.subtract(p));
		},this);
	}
	isAcute():boolean{
		var a = this.angles();
		for(var i = 0; i < a.length; i++){if(a[i] > Math.PI*0.5){return false;}}
		return true;
	}
	isObtuse():boolean{
		var a = this.angles();
		for(var i = 0; i < a.length; i++){if(a[i] > Math.PI*0.5){return true;}}
		return false;
	}
	isRight():boolean{
		var a = this.angles();
		for(var i = 0; i < a.length; i++){if(epsilonEqual(a[i],Math.PI*0.5)){return true;}}
		return false;
	}
	pointInside(p:XY):boolean{
		for(var i = 0; i < this.points.length; i++){
			var p0 = this.points[i];
			var p1 = this.points[(i+1)%this.points.length];
			var cross = (p.y - p0.y) * (p1.x - p0.x) - 
			            (p.x - p0.x) * (p1.y - p0.y);
			if (cross < 0) return false;
		}
		return true;
	}
}
/** A circle defined by its center point and radius length */
class Circle{
	center:XY;
	radius:number;
	constructor(a:any, b:any, c?:any){
		if(c !== undefined){
			this.center = new XY(a, b);
			this.radius = c;
		} else{
			this.center = a;
			this.radius = b;
		}
	}
	intersection(line:LineType){
		if(line instanceof Line){return intersectionCircleLine(this.center,this.radius, line.point, line.point.add(line.direction));}
		if(line instanceof Edge){return intersectionCircleLine(this.center,this.radius, line.nodes[0], line.nodes[1]);}
		if(line instanceof Ray){return intersectionCircleLine(this.center,this.radius, line.origin, line.origin.add(line.direction));}
	}
}
/** The boundary of a polygon defined by a sequence of nodes */
class Polygon{
	nodes:XY[];
	constructor(){ this.nodes = []; }
	/** This compares two polygons by checking their nodes are the same, and in the same order.
	 * @returns {boolean} whether two polygons are equivalent or not
	 * @example
	 * var equivalent = polygon.equivalent(anotherPolygon)
	 */
	equivalent(polygon:Polygon):boolean{
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
	contains(point:XY):boolean{
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
	signedArea():number{
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
	centroid():XY{
		return this.nodes.map(function(el,i){
			var nextEl = this.nodes[ (i+1)%this.nodes.length ];
			var mag = el.x*nextEl.y - nextEl.x*el.y;
			return new XY((el.x+nextEl.x)*mag, (el.y+nextEl.y)*mag);
		},this)
		.reduce(function(prev:XY,current:XY){ return prev.add(current); },new XY(0,0))
		.scale(1/(6 * this.signedArea()));
	}
	/** Calculates the center of the bounding box made by the edges of the polygon.
	 * @returns {XY} the location of the center of the bounding box
	 * @example
	 * var boundsCenter = polygon.center()
	 */
	center():XY{
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
/** An ordered set of node-adjacent edges defining the boundary of a convex space */
class ConvexPolygon{
	edges:Edge[];
	constructor(){ this.edges = []; }
	nodes():XY[]{
		return this.edges.map(function(el,i){
			var nextEl = this.edges[ (i+1)%this.edges.length ];
			if(el.nodes[0].equivalent(nextEl.nodes[0]) || el.nodes[0].equivalent(nextEl.nodes[1])){
				return el.nodes[1];
			}
			return el.nodes[0];
		},this);
	}
	signedArea(nodes?:XY[]):number{
		if(nodes === undefined){ nodes = this.nodes(); }
		return 0.5 * nodes.map(function(el,i){
			var nextEl = nodes[ (i+1)%nodes.length ];
			return el.x*nextEl.y - nextEl.x*el.y;
		},this)
		.reduce(function(prev, cur){
			return prev + cur;
		},0);
	}
	centroid():XY{
		var nodes = this.nodes();
		return nodes.map(function(el,i){
			var nextEl = nodes[ (i+1)%nodes.length ];
			var mag = el.x*nextEl.y - nextEl.x*el.y;
			return new XY((el.x+nextEl.x)*mag, (el.y+nextEl.y)*mag);
		},this)
		.reduce(function(prev:XY,current:XY){
			return prev.add(current);
		},new XY(0,0))
		.scale(1/(6 * this.signedArea(nodes)));
	}
	center():XY{
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
	contains(p:XY):boolean{
		var found = true;
		for(var i = 0; i < this.edges.length; i++){
			var a = this.edges[i].nodes[1].subtract(this.edges[i].nodes[0]);
			var b = new XY(p.x-this.edges[i].nodes[0].x,p.y-this.edges[i].nodes[0].y);
			if(a.cross(b) < 0){ return false; }
		}
		return true;
	}
	// contains implemention which iterates over points instead of edges
	// contains(point:XY):boolean{
	// 	for(var i = 0; i < this.nodes.length; i++){
	// 		var thisNode = this.nodes[ i ];
	// 		var nextNode = this.nodes[ (i+1)%this.nodes.length ];
	// 		var a = new XY(nextNode.x - thisNode.x, nextNode.y - thisNode.y);
	// 		var b = new XY(point.x - thisNode.x, point.y - thisNode.y);
	// 		if(a.cross(b) < 0){ return false; }
	// 	}
	// 	return true;
	// }
	liesOnEdge(p:XY):boolean{
		for(var i = 0; i < this.edges.length; i++){
			if(this.edges[i].collinear(p)){ return true; }
		}
		return false;
	}
	clipEdge(edge:Edge):Edge{
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
			// case 2: return new Edge(intersections[0], intersections[1]);
			default:
				for(var i = 1; i < intersections.length; i++){
					if( !intersections[0].equivalent(intersections[i]) ){
						return new Edge(intersections[0], intersections[i]);
					}
				}
		}
	}
	clipLine(line:Line):Edge{
		var intersections = this.edges
			.map(function(el){ return intersectionLineEdge(line, el); })
			.filter(function(el){return el !== undefined; });
		switch(intersections.length){
			case 0: return undefined;
			case 1: return new Edge(intersections[0], intersections[0]); // degenerate edge
			// case 2: 
			default:
				for(var i = 1; i < intersections.length; i++){
					if( !intersections[0].equivalent(intersections[i]) ){
						return new Edge(intersections[0], intersections[i]);
					}
				}
		}
	}
	clipRay(ray:Ray):Edge{
		var intersections = this.edges
			.map(function(el){ return intersectionRayEdge(ray, el); })
			.filter(function(el){return el !== undefined; });
		switch(intersections.length){
			case 0: return undefined;
			case 1: return new Edge(ray.origin, intersections[0]);
			// case 2: return new Edge(intersections[0], intersections[1]);
			default:
				for(var i = 1; i < intersections.length; i++){
					if( !intersections[0].equivalent(intersections[i]) ){
						return new Edge(intersections[0], intersections[i]);
					}
				}
		}
	}
	setEdgesFromPoints(points:XY[]):ConvexPolygon{
		this.edges = points.map(function(el,i){
			var nextEl = points[ (i+1)%points.length ];
			return new Edge(el, nextEl);
		},this);
		return this;
	}
	regularPolygon(sides:number):ConvexPolygon{
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
	convexHull(points:XY[]):ConvexPolygon{
		// validate input
		if(points === undefined || points.length === 0){ this.edges = []; return undefined; }
		// # points in the convex hull before escaping function
		var INFINITE_LOOP = 10000;
		// sort points by x and y
		var sorted = points.slice().sort(function(a,b){
			if(epsilonEqual(a.y, b.y, EPSILON_HIGH)){ return a.x - b.x; }
			return a.y - b.y;
		});
		var hull:XY[] = [];
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
			if(angles.length === 0){ this.edges = []; return undefined; }
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
			if(hull.filter(function(el){return el === angles[0].node; }).length > 0){
				return this.setEdgesFromPoints(hull);
			}
			// add point to hull, prepare to loop again
			hull.push(angles[0].node);
			// update walking direction with the angle to the new point
			ang = Math.atan2( hull[h].y - angles[0].node.y, hull[h].x - angles[0].node.x);
		}while(infiniteLoop < INFINITE_LOOP);
		this.edges = [];
		return undefined;
	}
	minimumRect():Rect{
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
	copy():ConvexPolygon{
		var p = new ConvexPolygon();
		p.edges = this.edges.map(function(e:Edge){
			return new Edge(e.nodes[0].x, e.nodes[0].y, e.nodes[1].x, e.nodes[1].y);
		});
		return p;
	}	
}
/** a Sector is defined by three nodes connecting two adjacent edges (one common node) */
class Sector{
	// the node in common with the edges
	origin:XY;
	// the indices of these 2 nodes directly correlate to 2 edges' indices
	endPoints:[XY,XY];
	// angle counter-clockwise from endpoint 0 to 1
	constructor(origin:XY, endpoints:[XY,XY]){
		this.origin = origin;
		this.endPoints = endpoints;
	}
	vectors():[XY,XY]{
		return <[XY,XY]>this.endPoints.map(function(el){
			return new XY(el.x-this.origin.x, el.y-this.origin.y);
		},this);
	}
	/** the interior angle is measured clockwise from endpoint 0 to 1  */
	angle():number{
		var vectors = this.vectors();
		return counterClockwiseInteriorAngle(vectors[0], vectors[1]);
	}
	bisect():Ray{
		var vectors = this.vectors();
		var angles = vectors.map(function(el){ return Math.atan2(el.y, el.x); });
		while(angles[0] < 0){ angles[0] += Math.PI*2; }
		while(angles[1] < 0){ angles[1] += Math.PI*2; }
		var interior = counterClockwiseInteriorAngleRadians(angles[0], angles[1]);
		var bisected = angles[0] + interior*0.5;
		return new Ray(new XY(this.origin.x, this.origin.y), new XY(Math.cos(bisected), Math.sin(bisected)));
	}
	subsect(divisions:number):Ray[]{
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
	equivalent(a:Sector):boolean{
		return a.origin.equivalent(this.origin) && 
		       a.endPoints[0].equivalent(this.endPoints[0]) && 
		       a.endPoints[1].equivalent(this.endPoints[1]);
	}
	/** a sector contains a point if it is between the two edges in counter-clockwise order */
	contains(point:XY):boolean{
		var cross0 = (point.y - this.endPoints[0].y) * (this.origin.x - this.endPoints[0].x) - 
		             (point.x - this.endPoints[0].x) * (this.origin.y - this.endPoints[0].y);
		var cross1 = (point.y - this.origin.y) * (this.endPoints[1].x - this.origin.x) - 
		             (point.x - this.origin.x) * (this.endPoints[1].y - this.origin.y);
		return cross0 < 0 && cross1 < 0;
	}
	// (private function)
	sortByClockwise(){}
}
// unimplemented classes. may be useful
// subclass of Triangle
class IsoscelesTriangle extends Triangle{ }
