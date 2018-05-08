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
	if(epsilon === undefined){epsilon = EPSILON_HIGH;}
	return epsilonEqual(a.x,b.x,epsilon) && epsilonEqual(a.y,b.y,epsilon);
}
/////////////////////////////// NUMBERS ///////////////////////////////
/** map a number from one range into another */
function map(input:number, fl1:number, ceil1:number, fl2:number, ceil2:number):number{
	return ( (input - fl1) / (ceil1 - fl1) ) * (ceil2 - fl2) + fl2;
}
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
/////////////////////////////////////////////////////////////////////////////////
//                            2D ALGORITHMS
/////////////////////////////////////////////////////////////////////////////////
/** There are 2 interior angles between 2 absolute angle measurements, from A to B, return the clockwise one
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
///////////////
function clockwiseInteriorAngle(a:XY, b:XY):number{
	// this is on average 50 to 100 slower faster than clockwiseInteriorAngleRadians
	var dotProduct = b.x*a.x + b.y*a.y;
	var determinant = b.x*a.y - b.y*a.x;
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
	// we don't need to run atan2 again..
	// var interior2 = clockwiseInteriorAngle(b, a);
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
		function(t0,t1){return t1 >= 0;}, epsilon);
}
function intersectionLineEdge(line:Line, edge:Edge, epsilon?:number):XY{
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	return intersect_vec_func(
		new XY(line.point.x, line.point.y),
		new XY(line.direction.x, line.direction.y),
		new XY(edge.nodes[0].x, edge.nodes[0].y),
		new XY(edge.nodes[1].x-edge.nodes[0].x, edge.nodes[1].y-edge.nodes[0].y),
		function(t0,t1){return t1 >= 0 && t1 <= 1;}, epsilon);
}
function intersectionRayRay(a:Ray, b:Ray, epsilon?:number):XY{
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	return intersect_vec_func(
		new XY(a.origin.x, a.origin.y),
		new XY(a.direction.x, a.direction.y),
		new XY(b.origin.x, b.origin.y),
		new XY(b.direction.x, b.direction.y),
		function(t0,t1){return t0 >= 0 && t1 >= 0;}, epsilon);
}
function intersectionRayEdge(ray:Ray, edge:Edge, epsilon?:number):XY{
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	return intersect_vec_func(
		new XY(ray.origin.x, ray.origin.y),
		new XY(ray.direction.x, ray.direction.y),
		new XY(edge.nodes[0].x, edge.nodes[0].y),
		new XY(edge.nodes[1].x-edge.nodes[0].x, edge.nodes[1].y-edge.nodes[0].y),
		function(t0,t1){return t0 >= 0 && t1 >= 0 && t1 <= 1;}, epsilon);
}
function intersectionEdgeEdge(a:Edge, b:Edge, epsilon?:number):XY{
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	return intersect_vec_func(
		new XY(a.nodes[0].x, a.nodes[0].y),
		new XY(a.nodes[1].x-a.nodes[0].x, a.nodes[1].y-a.nodes[0].y),
		new XY(b.nodes[0].x, b.nodes[0].y),
		new XY(b.nodes[1].x-b.nodes[0].x, b.nodes[1].y-b.nodes[0].y),
		function(t0,t1){return t0 >= 0 && t0 <= 1 && t1 >= 0 && t1 <= 1;}, epsilon);
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

class XY{
	x:number;
	y:number;
	constructor(x:number, y:number){ this.x = x; this.y = y; }
	// position(x:number, y:number):XY{ this.x = x; this.y = y; return this; }
	normalize():XY { var m = this.magnitude(); return new XY(this.x/m, this.y/m);}
	dot(point:XY):number { return this.x * point.x + this.y * point.y; }
	cross(vector:XY):number{ return this.x*vector.y - this.y*vector.x; }
	magnitude():number { return Math.sqrt(this.x * this.x + this.y * this.y); }
	distanceTo(a:XY):number{return Math.sqrt(Math.pow(this.x-a.x,2)+Math.pow(this.y-a.y,2));}
	equivalent(point:XY, epsilon?:number):boolean{
		if(epsilon == undefined){ epsilon = EPSILON_HIGH; }
		// rect bounding box, cheaper than radius calculation
		return (epsilonEqual(this.x, point.x, epsilon) && epsilonEqual(this.y, point.y, epsilon))
	}
	transform(matrix:Matrix):XY{
		return new XY(this.x * matrix.a + this.y * matrix.c + matrix.tx,
					  this.x * matrix.b + this.y * matrix.d + matrix.ty);
	}
	rotate90():XY { return new XY(-this.y, this.x); }
	rotate270():XY { return new XY(this.y, -this.x); }
	rotate(angle:number, origin?:XY){
		return this.transform( new Matrix().rotation(angle, origin) );
	}
	lerp(point:XY, pct:number):XY{
		var inv = 1.0 - pct;
		return new XY(this.x*pct + point.x*inv, this.y*pct + point.y*inv);
	}
	angleLerp(point:XY, pct:number):XY{
		function shortAngleDist(a0:number,a1:number) {
			var max = Math.PI*2;
			var da = (a1 - a0) % max;
			return 2*da % max - da;
		}
		var thisAngle = Math.atan2(this.y, this.x);
		var pointAngle = Math.atan2(point.y, point.x);
		var newAngle = thisAngle + shortAngleDist(thisAngle, pointAngle)*pct;
		return new XY( Math.cos(newAngle), Math.sin(newAngle) );
	}
	/** reflects this point about a line that passes through 'a' and 'b' */
	reflect(line:any):XY{
		var origin, vector;
		if(line.direction !== undefined){
			origin = line.point || line.origin;
			vector = line.direction;
		} else if(line.nodes !== undefined){
			origin = new XY(line.nodes[0].x, line.nodes[0].y);
			vector = new XY(line.nodes[1].x, line.nodes[1].y).subtract(origin);
		} else{
			return undefined;
		}
		return this.transform( new Matrix().reflection(vector, origin) );
	}
	scale(magnitude:number):XY{ return new XY(this.x*magnitude, this.y*magnitude); }
	// add(point:XY):XY{ return new XY(this.x+point.x, this.y+point.y); }
	// todo, outfit all these constructors with flexible parameters like add()
	add(a:any, b?:any):XY{
		// var point = gimme1XY(a,b);
		if(isValidPoint(a)){ return new XY(this.x+a.x, this.y+a.y); }
		else if(isValidNumber(b)){ return new XY(this.x+a, this.y+b); }
	}
	subtract(point:XY):XY{ return new XY(this.x-point.x, this.y-point.y); }
	multiply(m:XY):XY{ return new XY(this.x*m.x, this.y*m.y); }
	midpoint(other:XY):XY{ return new XY((this.x+other.x)*0.5, (this.y+other.y)*0.5); }
	abs():XY{ return new XY(Math.abs(this.x), Math.abs(this.y)); }
	commonX(point:XY, epsilon?:number):boolean{return epsilonEqual(this.y, point.y, epsilon);}
	commonY(point:XY, epsilon?:number):boolean{return epsilonEqual(this.x, point.x, epsilon);}
}

abstract class LineType{
	length(){}
	vector(){}
	parallel(line:any, epsilon?:number){}
	collinear(point:XY){}
	equivalent(line:any, epsilon?:number){}
	intersection(line:LineType, epsilon?:number){}
	reflectionMatrix(){}
	nearestPoint(point:XY){}
	nearestPointNormalTo(point:XY){}
	transform(matrix:Matrix){}
	degenrate(epsilon?:number){}
	// clipWithEdge(edge:Edge, epsilon?:number){}
	// clipWithEdges(edges:Edge[], epsilon?:number){}
	// clipWithEdgesDetails(edges:Edge[], epsilon?:number){}
}

/** 2D line, extending infinitely in both directions, represented by a point and a vector
 */
class Line implements LineType{
	point:XY;
	direction:XY;
	constructor(a:any, b:any, c?:any, d?:any){
		if(b instanceof XY){ this.point = a; this.direction = b; }
		else if(a.x !== undefined){this.point = new XY(a.x, a.y); this.direction = new XY(b.x, b.y);}
		else{ this.point = new XY(a,b); this.direction = new XY(c,d); }
	}
	// implements LineType
	length():number{ return Infinity; }
	vector():XY{ return this.direction; }
	parallel(line:any, epsilon?:number):boolean{
		// works for Edges (2 XY nodes), or Lines or Rays (point and vector)
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		var v = (line.nodes !== undefined) ? line.nodes[1].subtract(line.nodes[0]) : line.direction;
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
	degenrate(epsilon?:number):boolean{
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		return epsilonEqual(this.direction.magnitude(), 0, epsilon);
	}
	bisect(line:Line):Line[]{
		if( this.parallel(line) ){
			return [new Line( this.point.midpoint(line.point), this.direction)];
		} else{
			var intersection:XY = intersectionLineLine(this, line);
			var vectors = bisectVectors(this.direction, line.direction);
			vectors[1] = vectors[0].rotate90();
			return vectors.sort(function(a:XY,b:XY){
				return Math.abs(a.cross(vectors[0])) - Math.abs(b.cross(vectors[1]))
			}).map(function(el){
				return new Line(intersection, el);
			},this);

		}
	}
}

class Ray implements LineType{
	origin:XY;
	direction:XY;
	constructor(a:any, b:any, c?:any, d?:any){
		if(a instanceof XY){ this.origin = a; this.direction = b; }
		else if(a.x !== undefined){
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
		var v = (line.nodes !== undefined) ? line.nodes[1].subtract(line.nodes[0]) : line.direction;
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
	degenrate(epsilon?:number):boolean{
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		return epsilonEqual(this.direction.magnitude(), 0, epsilon);
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

class Edge implements LineType{
	nodes:[XY,XY];
	// a, b are points, or
	// (a,b) point 1 and (c,d) point 2, each x,y
	constructor(a:any, b?:any, c?:any, d?:any){
		if((a instanceof XY) && (b instanceof XY)){this.nodes = [a,b];}
		else if(a.x !== undefined){this.nodes = [new XY(a.x, a.y), new XY(b.x, b.y)];}
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
		var v = (line.nodes !== undefined) ? line.nodes[1].subtract(line.nodes[0]) : line.direction;
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
	degenrate(epsilon?:number):boolean{
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		return this.nodes[0].equivalent(this.nodes[1], epsilon);
	}
	// additional methods
	midpoint():XY { return new XY( 0.5*(this.nodes[0].x + this.nodes[1].x),
								   0.5*(this.nodes[0].y + this.nodes[1].y));}
	perpendicularBisector():Line{ return new Line(this.midpoint(), this.vector().rotate90()); }
	infiniteLine():Line{ return new Line(this.nodes[0], this.nodes[1].subtract(this.nodes[0])); }
}

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
		const REFLECT_LIMIT = 100;
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

class Rect{
	// didChange:(event:object)=>void;
	topLeft:{x:number,y:number};
	size:{width:number, height:number};
	constructor(x:number,y:number,width:number,height:number){
		this.topLeft = {'x':x, 'y':y};
		this.size = {'width':width, 'height':height};
	}
}

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
			// calculate circumcenter
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
		var found = true;
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
class IsoscelesTriangle extends Triangle{}

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

class ConvexPolygon{
	edges:Edge[];
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
		return new XY(xMin+(xMin+xMax)*0.5, yMin+(yMin+yMax)*0.5);
	}
	contains(p:XY):boolean{
		var found = true;
		for(var i = 0; i < this.edges.length; i++){
			var a = this.edges[i].nodes[1].subtract(this.edges[i].nodes[0]);
			var b = new XY(p.x-this.edges[i].nodes[0].x,p.y-this.edges[i].nodes[0].y);
			if (a.cross(b) < 0){ return false; }
		}
		return true;
	}
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
	setEdgesFromPoints(points:XY[]):Edge[]{
		return points.map(function(el,i){
			var nextEl = points[ (i+1)%points.length ];
			return new Edge(el, nextEl);
		},this);
	}
	convexHull(points:XY[]):ConvexPolygon{
		// validate input
		if(points === undefined || points.length === 0){ this.edges = []; return undefined; }
		// # points in the convex hull before escaping function
		var INFINITE_LOOP = 10000;
		// sort points by x and y
		var sorted = points.sort(function(a,b){
			if(epsilonEqual(a.y, b.y, EPSILON_HIGH)){
				return a.x - b.x;
			}
			return a.y - b.y;});
				// if(a.x-b.x < -EPSILON_HIGH){ return -1; }  
				// if(a.x-b.x > EPSILON_HIGH){ return 1; }
				// if(a.y-b.y < -EPSILON_HIGH){ return -1; } 
				// if(a.y-b.y > EPSILON_HIGH){ return 1; }
				// return 0;});
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
				this.edges = this.setEdgesFromPoints(hull);
				return this;
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
		this.edges
			.map(function(el){ return el.nodes[0]; })
			.forEach(function(el){
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

/** a Sector is defined by 3 nodes (one common, 2 endpoints) 
 *  clockwise order is enforced
 *  the interior angle is measured clockwise from endpoint 0 to 1
 */
class Sector{
	// the node in common with the edges
	origin:XY;
	// the indices of these 2 nodes directly correlate to 2 edges' indices
	endPoints:[XY,XY];
	// angle clockwise from endpoint 0 to 1
	constructor(origin:XY, endpoints:[XY,XY]){
		this.origin = origin;
		this.endPoints = endpoints;
	}
	vectors():[XY,XY]{
		return <[XY,XY]>this.endPoints.map(function(el){
			return new XY(el.x-this.origin.x, el.y-this.origin.y);
		},this);
	}
	angle():number{
		var vectors = this.vectors();
		return clockwiseInteriorAngle(vectors[0], vectors[1]);
	}
	bisect():XY{
		var vectors = this.vectors();
		var angles = vectors.map(function(el){ return Math.atan2(el.y, el.x); });
		while(angles[0] < 0){ angles[0] += Math.PI*2; }
		while(angles[1] < 0){ angles[1] += Math.PI*2; }
		var interior = clockwiseInteriorAngleRadians(angles[0], angles[1]);
		var bisected = angles[0] - interior*0.5;
		return new XY(Math.cos(bisected), Math.sin(bisected));
	}
	// todo: needs testing
	subsectAngle(divisions:number):number[]{
		if(divisions === undefined || divisions < 1){ throw "subsetAngle() invalid argument"; }
		var angles = this.vectors().map(function(el){ return Math.atan2(el.y, el.x); });
		var interiorA = clockwiseInteriorAngleRadians(angles[0], angles[1]);
		var results:number[] = [];
		for(var i = 1; i < divisions; i++){
			results.push( angles[0] - interiorA * (1.0/divisions) * i );
		}
		return results;
	}
	getEdgeVectorsForNewAngle(angle:number, lockedEdge?:Edge):[XY,XY]{
		// todo, implement locked edge
		var vectors = this.vectors();
		var angleChange = angle - clockwiseInteriorAngle(vectors[0], vectors[1]);
		var rotateNodes = [-angleChange*0.5, angleChange*0.5];
		return <[XY,XY]>vectors.map(function(el:XY,i){ return el.rotate(rotateNodes[i]); },this);
	}
	equivalent(a:Sector):boolean{
		return a.origin.equivalent(this.origin) && 
		       a.endPoints[0].equivalent(this.endPoints[0]) && 
		       a.endPoints[1].equivalent(this.endPoints[1]);
	}
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

//////////////////////////////////////////////////////////////////////////
// VORONOI DEPENDENCIES
interface d3VoronoiObject{
	'edges':{
		0:[number,number],
		1:[number,number],
		'left'?:{0:number,1:number,'data':[number,number],'index':number,'length':number},
		'right'?:{0:number,1:number,'data':[number,number],'index':number,'length':number},
		'length':number
	}[],
	'cells':{
		'halfedges':number[],  // integer type, variable length
		'site':{
			0:number,
			1:number,
			'data':[number,number],
			'length':number   // integer type
		}
	}[]
}
/////////////////////////////////////////////////////////////////////////////////
//                            VORONOI
/////////////////////////////////////////////////////////////////////////////////

class VoronoiMolecule extends Triangle{
	overlaped:VoronoiMolecule[];
	hull:ConvexPolygon;
	units:VoronoiMoleculeTriangle[];
	isEdge:boolean;
	edgeNormal:XY; // if isEdge is true, normal to edge, pointing (in/out) from hull?
	isCorner:boolean;
	constructor(points:[XY,XY,XY], circumcenter:XY, edgeNormal?:XY){
		super(points, circumcenter);
		this.isEdge = false;  this.isCorner = false;
		this.overlaped = [];
		this.hull = new ConvexPolygon().convexHull([points[0], points[1], points[2], circumcenter].filter(function(el){return el !== undefined;}));
		this.units = this.points.map(function(el,i){
			var nextEl = this.points[ (i+1)%this.points.length ];
			return new VoronoiMoleculeTriangle(circumcenter, [el, nextEl]);
		},this);//.filter(function(el){return el !== undefined; });
		// handle edge and corner cases
		var pointsLength = (<XY[]>this.points).length;
		switch(pointsLength){
			case 1: this.isCorner = true; this.addCornerMolecules(); break;
			case 2:
				this.isEdge = true;
				// this.units.pop();
				// there are two reflected triangles built around the same base line. remove the counter-clockwise wound one
				this.units = this.units.filter(function(el){
					// update molecule crimp angle
					var cross = (el.vertex.y-el.base[0].y)*(el.base[1].x-el.base[0].x) -
					            (el.vertex.x-el.base[0].x)*(el.base[1].y-el.base[0].y);
					if(cross < 0){ return false;}
					return true;
				},this);
				this.addEdgeMolecules(edgeNormal);
			break;
		}
		// obtuse case: look for the eclipsed molecule, adjust the remaining crimp angles accordingly
		var eclipsed:VoronoiMoleculeTriangle = undefined;
		this.units = this.units.filter(function(el){
			// update molecule crimp angle
			var cross = (el.vertex.y - el.base[0].y) * (el.base[1].x - el.base[0].x) -
			            (el.vertex.x - el.base[0].x) * (el.base[1].y - el.base[0].y);
			if(cross < 0){ eclipsed = el; return false;}
			return true;
		},this);
		if(eclipsed !== undefined){
			var angle = clockwiseInteriorAngle(eclipsed.vertex.subtract(eclipsed.base[1]), eclipsed.base[0].subtract(eclipsed.base[1]));
			this.units.forEach(function(el){ el.crimpAngle -= angle; });
		}
	}
	addEdgeMolecules(normal:XY){
		this.edgeNormal = normal.normalize().abs();
		if(this.units.length < 1){ return; }
		var base = this.units[0].base;
		var reflected = base.map(function(b){
			var diff = this.circumcenter.subtract(b);
			var change = diff.multiply(this.edgeNormal).scale(2);
			return b.add(change);
		},this);
		this.units = this.units.concat(
			[new VoronoiMoleculeTriangle(this.circumcenter, [base[1], reflected[1]]),
			 new VoronoiMoleculeTriangle(this.circumcenter, [reflected[0], base[0]])]
		);
	}
	addCornerMolecules(){ }

	generateCreases():Edge[]{
		var edges:Edge[] = [];
		var outerEdges = this.units.map(function(el,i){
			var nextEl = this.units[ (i+1)%this.units.length ];
			if(el.base[1].equivalent(nextEl.base[0])){ 
				edges.push(new Edge(el.base[1], el.vertex))
			}
		},this);

		var creases = this.units.map(function(el){return el.generateCrimpCreaseLines();});
		creases.forEach(function(el){ edges = edges.concat(el); },this);

		if(this.isObtuse()){
			// obtuse angles, outer edges only creased if shared between 2 units
			this.units.forEach(function(el,i){
				var nextEl = this.units[ (i+1)%this.units.length ];
				if(el.base[0].equivalent(el.base[1])){ edges.push( new Edge(el.base[0], el.vertex)); }
			},this);
		}
		return edges;
	}
}
/** Isosceles Triangle units that comprise a VoronoiMolecule */
class VoronoiMoleculeTriangle{
	base:[XY,XY];
	vertex:XY;
	// the crimp angle is measured against the base side.
	crimpAngle:number;
	overlapped:VoronoiMolecule[];
	constructor(vertex:XY, base:[XY,XY], crimpAngle?:number){
		this.vertex = vertex;
		this.base = base;
		this.crimpAngle = crimpAngle;
		this.overlapped = [];
		if(this.crimpAngle === undefined){
			var vec1 = base[1].subtract(base[0]);
			var vec2 = vertex.subtract(base[0]);
			var a1 = clockwiseInteriorAngle(vec1, vec2);
			var a2 = clockwiseInteriorAngle(vec2, vec1);
			this.crimpAngle = (a1<a2) ? a1 : a2;
		}
	}
	crimpLocations():[XY,XY]{
		// first is the top of the outer triangle, the second the angle bisection
		var baseAngle = Math.atan2(this.base[1].y-this.base[0].y,this.base[1].x-this.base[0].x);
		var crimpVector = new XY(Math.cos(baseAngle+this.crimpAngle),Math.sin(baseAngle+this.crimpAngle));
		var bisectVector = new XY(Math.cos(baseAngle+this.crimpAngle*0.5),Math.sin(baseAngle+this.crimpAngle*0.5));
		var symmetryLine = new Edge(this.vertex, this.base[0].midpoint(this.base[1]));
		var crimpPos = intersectionRayEdge(new Ray(this.base[0], crimpVector), symmetryLine);
		var bisectPos = intersectionRayEdge(new Ray(this.base[0], bisectVector), symmetryLine);
		return [crimpPos, bisectPos];
	}
	generateCrimpCreaseLines():Edge[]{
		var crimps:[XY,XY] = this.crimpLocations();

		var symmetryLine = new Edge(this.vertex, this.base[0].midpoint(this.base[1]));
		if(this.overlapped.length > 0){
			symmetryLine.nodes[1] = this.overlapped[0].circumcenter;
		}
		var overlappingEdges = [symmetryLine]
			.concat(flatMap(this.overlapped, function(el:VoronoiMolecule){
				return el.generateCreases();
			}))
		var edges = [symmetryLine]
			// .concat(rayReflectRepeat(this.base[0], this.base[1].subtract(this.base[0]), overlappingEdges, this.base[1]) );
			.concat(new Polyline().rayReflectRepeat(new Ray(this.base[0], this.base[1].subtract(this.base[0])), overlappingEdges, this.base[1]).edges());
		crimps.filter(function(el){
				return el!==undefined && !el.equivalent(this.vertex);},this)
			.forEach(function(crimp:XY){
				// edges = edges.concat( rayReflectRepeat(this.base[0], crimp.subtract(this.base[0]), overlappingEdges, this.base[1]) );
				edges = edges.concat( new Polyline().rayReflectRepeat(new Ray(this.base[0], crimp.subtract(this.base[0])), overlappingEdges, this.base[1]).edges() );
			},this);
		return edges;
	}
	pointInside(p:XY):boolean{
		var found = true;
		var points = [this.vertex, this.base[0], this.base[1]];
		for(var i = 0; i < points.length; i++){
			var p0 = points[i];
			var p1 = points[(i+1)%points.length];
			var cross = (p.y - p0.y) * (p1.x - p0.x) - 
			            (p.x - p0.x) * (p1.y - p0.y);
			if (cross < 0) return false;
		}
		return true;
	}
}

class VoronoiEdge{
	endPoints:[XY, XY];
	junctions:[VoronoiJunction, VoronoiJunction];
	cells:[VoronoiCell,VoronoiCell];
	isBoundary:boolean;
	cache:object = {};
}
class VoronoiCell{
	site:XY;
	points:XY[];
	edges:VoronoiEdge[];
	constructor(){ this.points = []; this.edges = []; }
}
class VoronoiJunction{
	position:XY;
	edges:VoronoiEdge[];
	cells:VoronoiCell[];
	isEdge:boolean;
	isCorner:boolean;
	edgeNormal:XY;// normal to the edge, if there is an edge
	constructor(){ this.edges = []; this.cells = []; this.isEdge = false; this.isCorner = false; }
}
class VoronoiGraph{
	edges:VoronoiEdge[];
	junctions:VoronoiJunction[];
	cells:VoronoiCell[];

	edgeExists(points:[XY,XY], epsilon?:number):VoronoiEdge{
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		this.edges.forEach(function(el){
			if(el.endPoints[0].equivalent(points[0], epsilon) &&
			   el.endPoints[1].equivalent(points[1], epsilon)){ return el; }
			if(el.endPoints[1].equivalent(points[0], epsilon) &&
			   el.endPoints[0].equivalent(points[1], epsilon)){ return el; }
		});
		return undefined;
	}
	/** Build a VoronoiGraph object from the object generated by D3.js Voronoi */
	constructor(v:d3VoronoiObject, epsilon?:number){
		// var compFunc = function(a:XY,b:XY){ return a.equivalent(b,epsilon); };
		var containsXY = function(a:XY[],object:XY):boolean{
			return (a.filter(function(e:XY){
				return e.equivalent(object,epsilon);
			}).length > 0);
		}

		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		var allPoints = flatMap(v.edges, function(e){return [new XY(e[0][0],e[0][1]),new XY(e[1][0],e[1][1])]})
		var hull = new ConvexPolygon().convexHull(allPoints);
		this.edges = [];
		this.junctions = [];
		this.cells = [];
		this.edges = v.edges.map(function(el){
			var edge = new VoronoiEdge()
			edge.endPoints = [new XY(el[0][0],el[0][1]), new XY(el[1][0],el[1][1])];
			edge.cache = {'left': el.left, 'right': el.right}
			return edge;
		});
		this.cells = v.cells.map(function(c){
			var cell = new VoronoiCell();
			cell.site = new XY(c.site[0], c.site[1]);
			// use halfedge indices to make an array of VoronoiEdge
			cell.edges = c.halfedges.map(function(hf){ return this.edges[hf]; },this);
			// turn the edges into a circuit of points
			cell.points = cell.edges.map(function(el,i){
				var a = el.endPoints[0];
				var b = el.endPoints[1];
				var nextA = cell.edges[(i+1)%cell.edges.length].endPoints[0];
				var nextB = cell.edges[(i+1)%cell.edges.length].endPoints[1];
				if(a.equivalent(nextA,epsilon) || a.equivalent(nextB,epsilon)){
					return b;
				}
				return a;
			},this);
			return cell;
		},this);
		// locate each of the neighbor cells for every edge
		this.edges.forEach(function(el){
			var thisCells:[VoronoiCell, VoronoiCell] = [undefined, undefined];
			if(el.cache['left'] !== undefined){
				var leftSite = new XY(el.cache['left'][0], el.cache['left'][1]);
				for(var i = 0; i < this.cells.length; i++){
					if(leftSite.equivalent(this.cells[i].site,epsilon)){
						thisCells[0] = this.cells[i];
						break;
					}
				}
			}
			if(el.cache['right'] !== undefined){
				var rightSite = new XY(el.cache['right'][0], el.cache['right'][1]);
				for(var i = 0; i < this.cells.length; i++){
					if(rightSite.equivalent(this.cells[i].site,epsilon)){
						thisCells[1] = this.cells[i];
						break;
					}
				}
			}
			el.cells = thisCells;
			el.isBoundary = false;
			if(el.cells[0] === undefined || el.cells[1] === undefined){el.isBoundary = true;}
			el.cache = {};
		},this);
		var nodes:XY[] = [];
		this.edges.forEach(function(el){
			if(!containsXY(nodes, el.endPoints[0])){nodes.push(el.endPoints[0]);}
			if(!containsXY(nodes, el.endPoints[1])){nodes.push(el.endPoints[1]);}
		},this);
		this.junctions = nodes.map(function(el){
			var junction = new VoronoiJunction();
			junction.position = el;
			junction.cells = this.cells.filter(function(cell){ 
				return containsXY(cell.points, el)
			},this).sort(function(a:VoronoiCell,b:VoronoiCell){
				var vecA = a.site.subtract(el);
				var vecB = b.site.subtract(el);
				return Math.atan2(vecA.y,vecA.x) - Math.atan2(vecB.y,vecB.x);
			});
			switch(junction.cells.length){
				case 1: junction.isCorner = true; break;
				case 2: 
					junction.isEdge = true;
					hull.edges.forEach(function(edge:Edge){
						if(edge.collinear(junction.position)){
							junction.edgeNormal = edge.nodes[1].subtract(edge.nodes[0]).rotate90();
						}
					});
				break;
			}
			junction.edges = this.edges.filter(function(edge){
				return containsXY(edge.endPoints, el);
			},this).sort(function(a:VoronoiEdge,b:VoronoiEdge){
				var otherA = a.endPoints[0];
				if(otherA.equivalent(el)){ otherA = a.endPoints[1];}
				var otherB = b.endPoints[0];
				if(otherB.equivalent(el)){ otherB = b.endPoints[1];}
				var vecA = otherA.subtract(el);
				var vecB = otherB.subtract(el);
				return Math.atan2(vecA.y,vecA.x) - Math.atan2(vecB.y,vecB.x);
			});
			return junction;
		},this);
		return this;
	}

	generateMolecules(interp:number):VoronoiMolecule[]{
		return this.junctions.map(function(j:VoronoiJunction){
			var endPoints:XY[] = j.cells.map(function(cell:VoronoiCell){
				return cell.site.lerp(j.position,interp);
			},this);
			var molecule = new VoronoiMolecule(<[XY,XY,XY]>endPoints, j.position, j.isEdge?j.edgeNormal:undefined);
			return molecule;
		},this);		
	}

	/** sorts molecules based on overlap  */
	generateSortedMolecules(interp:number):VoronoiMolecule[][]{
		var molecules = this.generateMolecules(interp);
		for(var i = 0; i < molecules.length; i++){
			for(var j = 0; j < molecules.length; j++){
				if(i !== j){
					molecules[j].units.forEach(function(unit){
						if(unit.pointInside(molecules[i].circumcenter)){
							unit.overlapped.push(molecules[i]);
							molecules[j].overlaped.push(molecules[i]);
						}
					});
				}
			}
		}
		for(var i = 0; i < molecules.length; i++){
			molecules[i].units.forEach(function(unit:VoronoiMoleculeTriangle){
				unit.overlapped.sort(function(a:VoronoiMolecule,b:VoronoiMolecule){
					return a.circumcenter.distanceTo(unit.vertex)-b.circumcenter.distanceTo(unit.vertex);
				});
			});
			molecules[i].overlaped.sort(function(a:VoronoiMolecule,b:VoronoiMolecule){
				return a.circumcenter.distanceTo(molecules[i].circumcenter)-b.circumcenter.distanceTo(molecules[i].circumcenter);
			});
		}
		// not correct. could be better? maybe?
		var array = [];
		var mutableMolecules = molecules.slice();
		var rowIndex = 0;
		while(mutableMolecules.length > 0){
			array.push([]);
			for(var i = mutableMolecules.length-1; i >= 0; i--){
				if(mutableMolecules[i].overlaped.length <= rowIndex){
					array[rowIndex].push(mutableMolecules[i]);
					mutableMolecules.splice(i, 1);
				}
			}
			rowIndex++;
		}
		return array;
	}		

}

//////////////////////////////////////////////////////////////////////
///////////////   we're not using these  /////////////////////////////
//////////////////////////////////////////////////////////////////////


/** 2D line, extending infinitely in both directions, represented by 2 collinear points
 */
// class LineNodes{
// 	nodes:[XY,XY];
// 	constructor(a:any, b:any, c?:any, d?:any){
// 		if(a instanceof XY){this.nodes = [a,b];}
// 		else if(a.x !== undefined){this.nodes = [new XY(a.x, a.y), new XY(b.x, b.y)];}
// 		else{ this.nodes = [new XY(a,b), new XY(c,d)]; }
// 	}
// 	length(){return Infinity;}
// 	vector(originNode?:XY):XY{
// 		if(originNode === undefined){ return this.nodes[1].subtract(this.nodes[0]); }
// 		if(this.nodes[0].equivalent(originNode)){
// 			return this.nodes[1].subtract(this.nodes[0]);
// 		}
// 		return this.nodes[0].subtract(this.nodes[1]);
// 	}
// 	intersectLine(line:Line):XY{return intersectionLineLine(this,line);}
// 	intersectRay(ray:Ray):XY{return intersectionLineRay(this,ray);}
// 	intersectEdge(edge:Edge):XY{return intersectionLineEdge(this,edge);}
// 	reflectionMatrix():Matrix{return new Matrix().reflectionAcrossLine(this);}
// 	parallel(line:Line, epsilon?:number):boolean{
// 		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
// 		var u = this.nodes[1].subtract(this.nodes[0]);
// 		var v = line.nodes[1].subtract(line.nodes[0]);
// 		return epsilonEqual(u.cross(v), 0, epsilon);
// 	}
// 	collinear(point:XY, epsilon?:number):boolean{
// 		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
// 		if(point.equivalent(this.nodes[0], epsilon)){ return true; }
// 		var u = this.nodes[1].subtract(this.nodes[0]);
// 		var v = point.subtract(this.nodes[0]);
// 		return epsilonEqual(u.cross(v), 0, epsilon);
// 	}
// 	equivalent(line:Line, epsilon?:number):boolean{
// 		// if lines are parallel and share a point in common
// 		return undefined;
// 	}
// 	transform(matrix):Line{
// 		return new Line(this.nodes[0].transform(matrix), this.nodes[1].transform(matrix));
// 	}
// 	nearestPointNormalTo(point:XY):XY{
// 		var p = this.nodes[0].distanceTo(this.nodes[1]);
// 		var u = ((point.x-this.nodes[0].x)*(this.nodes[1].x-this.nodes[0].x) + (point.y-this.nodes[0].y)*(this.nodes[1].y-this.nodes[0].y)) / (Math.pow(p,2));
// 		return new XY(this.nodes[0].x + u*(this.nodes[1].x-this.nodes[0].x), this.nodes[0].y + u*(this.nodes[1].y-this.nodes[0].y));
// 	}
// }

/** 2D line, extending infinitely in both directions, represented by a scalar and a normal */
// class LinePerp{
// 	d:number; // the distance of the nearest point on the line to the origin
// 	u:XY;  // normal to the line
// 	constructor(scalar:number, normal:XY){this.d=scalar; this.u=normal;}
// }


/////////////////////////////// ARRAYS /////////////////////////////// 
// interface Array<T> {
// 	allEqual():boolean;
// 	removeDuplicates(compFunction:(a: T, b: T) => boolean): Array<T>;
// 	contains(object: T, compFunction?:(a: T, b: T) => boolean): boolean;
// 	flatMap<T, U>(mapFunc: (x: T) => U[]) : U[];	
// }
var flatMap = function<T, U>(array:any[], mapFunc: (x: T) => U[]) : U[] {
	return array.reduce((cumulus: U[], next: T) => [...mapFunc(next), ...cumulus], <U[]> []);
}
// var removeDuplicates = function(array:any[], compFunction:(a, b) => boolean): any[]{
// 	if(array.length <= 1) return array;
// 	for(var i = 0; i < array.length-1; i++){
// 		for(var j = array.length-1; j > i; j--){
// 			if(compFunction(array[i], array[j])){
// 				array.splice(j,1);
// 			}
// 		}
// 	}
// 	return array;
// }
/** all values in an array are equivalent based on !== comparison */
// var allEqual = function(array:any[]):boolean {
// 	if(array.length <= 1){ return true; }
// 	for(var i = 1; i < array.length; i++){ if(array[i] !== array[0]) return false; }
// 	return true;
// }
/** does an array contain an object, based on reference comparison */
// var contains = function(array:any[], object, compFunction?:(a, b) => boolean):boolean{
// 	if(compFunction !== undefined){
// 		// comp function was supplied
// 		for(var i = 0; i < array.length; i++){
// 			if(compFunction(array[i], object) === true){ return true; }
// 		}
// 		return false;
// 	}
// 	for(var i = 0; i < array.length; i++) { if(array[i] === object){ return true; } }
// 	return false;
// }
/////////////////////////////// ARRAYS /////////////////////////////// 




// /////////////////////////////// FUNCTION INPUT INTERFACE /////////////////////////////// 
// function gimme1XY(a:any, b?:any):XY{
// 	// input is 1 XY, or 2 numbers
// 	if(isValidPoint(a)){ return a; }
// 	else if(isValidNumber(b)){ return new XY(a, b); }
// }
// function gimme2XY(a:any, b:any, c?:any, d?:any):[XY,XY]{
// 	// input is 2 XY, or 4 numbers
// 	if(isValidPoint(b)){ return [a,b]; }
// 	else if(isValidNumber(d)){ return [new XY(a, b), new XY(c, d)]; }
// }
// function gimme1Edge(a:any, b?:any, c?:any, d?:any):Edge{
// 	// input is 1 edge, 2 XY, or 4 numbers
// 	if(a instanceof Edge || a.nodes !== undefined){ return a; }
// 	else if(isValidPoint(b) ){ return new Edge(a,b); }
// 	else if(isValidNumber(d)){ return new Edge(a,b,c,d); }
// }
// function gimme1Ray(a:any, b?:any, c?:any, d?:any):Ray{
// 	// input is 1 ray, 2 XY, or 4 numbers
// 	if(a instanceof Ray){ return a; }
// 	else if(isValidPoint(b) ){ return new Ray(a,b); }
// 	else if(isValidNumber(d)){ return new Ray(new XY(a,b), new XY(c,d)); }
// }
// function gimme1Line(a:any, b?:any, c?:any, d?:any):Line{
// 	// input is 1 line
// 	if(a instanceof Line){ return a; }
// 	// input is 2 XY
// 	else if(isValidPoint(b) ){ return new Line(a,b); }
// 	// input is 4 numbers
// 	else if(isValidNumber(d)){ return new Line(a,b,c,d); }
// 	// input is 1 line-like object with points in a nodes[] array
// 	else if(a.nodes instanceof Array && 
// 	        a.nodes.length > 0 &&
// 	        isValidPoint(a.nodes[1])){
// 		return new Line(a.nodes[0].x,a.nodes[0].y,a.nodes[1].x,a.nodes[1].y);
// 	}
// }
