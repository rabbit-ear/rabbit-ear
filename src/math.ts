// math.js
// math, mostly geometry to accompany origami crease pattern library
// mit open source license, robby kraft

"use strict";

var EPSILON_LOW  = 0.003;
var EPSILON      = 0.00001;
var EPSILON_HIGH = 0.00000001;
var EPSILON_UI   = 0.05;  // user tap, based on precision of a finger on a screen

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
function bisect(a:XY, b:XY):XY[]{
	a = a.normalize();
	b = b.normalize();
	return [ (a.add(b)).normalize(),
	         new XY(-a.x + -b.x, -a.y + -b.y).normalize() ];
}

function determinantXY(a:XY,b:XY):number{
	return a.x * b.y - b.x * a.y;
}
function intersect_vec_func(aOrigin:XY, aVec:XY, bOrigin:XY, bVec:XY, compFunction:(t0,t1) => boolean, epsilon:number):XY{
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
		new XY(a.nodes[0].x, a.nodes[0].y),
		new XY(a.nodes[1].x-a.nodes[0].x, a.nodes[1].y-a.nodes[0].y),
		new XY(b.nodes[0].x, b.nodes[0].y),
		new XY(b.nodes[1].x-b.nodes[0].x, b.nodes[1].y-b.nodes[0].y),
		function(t0,t1){return true;}, epsilon);
}
function intersectionLineRay(line:Line, ray:Ray, epsilon?:number):XY{
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	return intersect_vec_func(
		new XY(line.nodes[0].x, line.nodes[0].y),
		new XY(line.nodes[1].x-line.nodes[0].x, line.nodes[1].y-line.nodes[0].y),
		new XY(ray.origin.x, ray.origin.y),
		new XY(ray.direction.x, ray.direction.y),
		function(t0,t1){return t1 >= 0;}, epsilon);
}
function intersectionLineEdge(line:Line, edge:Edge, epsilon?:number):XY{
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	return intersect_vec_func(
		new XY(line.nodes[0].x, line.nodes[0].y),
		new XY(line.nodes[1].x-line.nodes[0].x, line.nodes[1].y-line.nodes[0].y),
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

function circleLineIntersectionAlgorithm(center:XY, radius:number, p0:XY, p1:XY):XY[]{
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
	/** Calculates the matrix representation of a reflection across a line
	 * @returns {Matrix} 
	 */
	reflection(a:XY, b:XY):Matrix{
		var angle = Math.atan2(b.y-a.y, b.x-a.x);
		this.a = Math.cos(angle) *  Math.cos(-angle) +  Math.sin(angle) * Math.sin(-angle);
		this.b = Math.cos(angle) * -Math.sin(-angle) +  Math.sin(angle) * Math.cos(-angle);
		this.c = Math.sin(angle) *  Math.cos(-angle) + -Math.cos(angle) * Math.sin(-angle);
		this.d = Math.sin(angle) * -Math.sin(-angle) + -Math.cos(angle) * Math.cos(-angle);
		this.tx = a.x + this.a * -a.x + -a.y * this.c;
		this.ty = a.y + this.b * -a.x + -a.y * this.d;
		return this;
	}
	rotation(angle, origin?:XY):Matrix{
		this.a = Math.cos(angle);   this.c = -Math.sin(angle);
		this.b = Math.sin(angle);   this.d =  Math.cos(angle);
		// todo, if origin is undefined, should we set tx and ty to 0, or leave as is?
		if(origin != undefined){ this.tx = origin.x; this.ty = origin.y; }
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
	rotate90():XY { return new XY(-this.y, this.x); }
	rotate270():XY { return new XY(this.y, -this.x); }
	rotate(angle:number, origin?:XY){
		return this.transform( new Matrix().rotation(angle, origin) );
	}
	dot(point:XY):number { return this.x * point.x + this.y * point.y; }
	cross(vector:XY):number{ return this.x*vector.y - this.y*vector.x; }
	magnitude():number { return Math.sqrt(this.x * this.x + this.y * this.y); }
	distanceTo(a:XY):number{return Math.sqrt(Math.pow(this.x-a.x,2)+Math.pow(this.y-a.y,2));}
	equivalent(point:XY, epsilon?:number):boolean{
		if(epsilon == undefined){ epsilon = EPSILON_HIGH; }
		// rect bounding box, cheaper than radius calculation
		return (epsilonEqual(this.x, point.x, epsilon) && epsilonEqual(this.y, point.y, epsilon))
	}
	transform(matrix):XY{
		return new XY(this.x * matrix.a + this.y * matrix.c + matrix.tx,
					  this.x * matrix.b + this.y * matrix.d + matrix.ty);
	}
	lerp(point:XY, pct:number):XY{
		var inv = 1.0 - pct;
		return new XY(this.x*pct + point.x*inv, this.y*pct + point.y*inv);
	}
	/** reflects this point about a line that passes through 'a' and 'b' */
	reflect(a:XY,b:XY):XY{ return this.transform( new Matrix().reflection(a,b) ); }
	scale(magnitude:number):XY{ return new XY(this.x*magnitude, this.y*magnitude); }
	add(point:XY):XY{ return new XY(this.x+point.x, this.y+point.y); }
	subtract(sub:XY):XY{ return new XY(this.x-sub.x, this.y-sub.y); }
	multiply(m:XY):XY{ return new XY(this.x*m.x, this.y*m.y); }
	midpoint(other:XY):XY{ return new XY((this.x+other.x)*0.5, (this.y+other.y)*0.5); }
	abs():XY{ return new XY(Math.abs(this.x), Math.abs(this.y)); }
}

/** 2D line, extending infinitely in both directions, represented by 2 collinear points
 */
class Line{
	nodes:[XY,XY];
	constructor(a:any, b:any, c?:any, d?:any){
		if(a instanceof XY){this.nodes = [a,b];}
		else if(a.x !== undefined){this.nodes = [new XY(a.x, a.y), new XY(b.x, b.y)];}
		else{ this.nodes = [new XY(a,b), new XY(c,d)]; }
	}
	length(){return Infinity;}
	vector(originNode?:XY):XY{
		if(originNode === undefined){ return this.nodes[1].subtract(this.nodes[0]); }
		if(this.nodes[0].equivalent(originNode)){
			return this.nodes[1].subtract(this.nodes[0]);
		}
		return this.nodes[0].subtract(this.nodes[1]);
	}
	intersectLine(line:Line):XY{return intersectionLineLine(this,line);}
	intersectRay(ray:Ray):XY{return intersectionLineRay(this,ray);}
	intersectEdge(edge:Edge):XY{return intersectionLineEdge(this,edge);}
	reflectionMatrix():Matrix{return new Matrix().reflection(this.nodes[0], this.nodes[1]);}
	parallel(line:Line, epsilon?:number):boolean{
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		var u = this.nodes[1].subtract(this.nodes[0]);
		var v = line.nodes[1].subtract(line.nodes[0]);
		return epsilonEqual(u.cross(v), 0, epsilon);
	}
	collinear(point:XY, epsilon?:number):boolean{
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		if(point.equivalent(this.nodes[0], epsilon)){ return true; }
		var u = this.nodes[1].subtract(this.nodes[0]);
		var v = point.subtract(this.nodes[0]);
		return epsilonEqual(u.cross(v), 0, epsilon);
	}
	equivalent(line:Line, epsilon?:number):boolean{
		// if lines are parallel and share a point in common
		return undefined;
	}
	transform(matrix):Line{
		return new Line(this.nodes[0].transform(matrix), this.nodes[1].transform(matrix));
	}
	nearestPointNormalTo(point:XY):XY{
		var p = this.nodes[0].distanceTo(this.nodes[1]);
		var u = ((point.x-this.nodes[0].x)*(this.nodes[1].x-this.nodes[0].x) + (point.y-this.nodes[0].y)*(this.nodes[1].y-this.nodes[0].y)) / (Math.pow(p,2));
		return new XY(this.nodes[0].x + u*(this.nodes[1].x-this.nodes[0].x), this.nodes[0].y + u*(this.nodes[1].y-this.nodes[0].y));
	}
}

// /** 2D line, extending infinitely in both directions, represented by a point and a vector
//  */
// class LineVec{
// 	origin:XY;
// 	vector:XY;
// 	constructor(origin:XY, vector:XY){this.origin=origin; this.vector=vector;}
// }
// /** 2D line, extending infinitely in both directions, represented by a scalar and a normal */
 
// class LinePerp{
// 	d:number; // the distance of the nearest point on the line to the origin
// 	u:XY;  // normal to the line
// 	constructor(scalar:number, normal:XY){this.d=scalar; this.u=normal;}
// }

class Polyline{
	nodes:XY[];

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
		var firstClips:{edge:Edge,intersection:Edge}[] = ray.clipWithEdgesWithIntersections(intersectable);
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
			var reflection:Matrix = new Matrix().reflection(prevClip.intersection.nodes[0], prevClip.intersection.nodes[1]);
			var newRay = new Ray(prevClip.edge.nodes[1], prevClip.edge.nodes[0].transform(reflection).subtract(prevClip.edge.nodes[1]));
			// get next edge intersections
			var newClips:{edge:Edge,intersection:Edge}[] = newRay.clipWithEdgesWithIntersections(intersectable);
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

class Ray{
	origin:XY;
	direction:XY;
	constructor(origin:XY, direction:XY){this.origin=origin;this.direction=direction;}
	length(){return Infinity;}
	vector(){return this.direction;}
	intersectLine(line:Line):XY{return intersectionLineRay(line,this);}
	intersectRay(ray:Ray):XY{return intersectionRayRay(this,ray);}
	intersectEdge(edge:Edge):XY{return intersectionRayEdge(this,edge);}
	reflectionMatrix():Matrix{return new Matrix().reflection(this.origin, this.origin.add(this.direction));}
	parallel(line:Line, epsilon?:number):boolean{
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		var v = line.nodes[1].subtract(line.nodes[0]);
		return epsilonEqual(this.direction.cross(v), 0, epsilon);
	}
	collinear(point:XY):boolean{ return undefined; }
	equivalent(ray:Ray, epsilon?:number):boolean{
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		return (this.origin.equivalent(ray.origin, epsilon) &&
		        this.direction.normalize().equivalent(ray.direction.normalize(), epsilon));
	}
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
	clipWithEdgesWithIntersections(edges:Edge[], epsilon?:number):{edge:Edge,intersection:Edge}[]{
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

	// transform(matrix):Ray{
	// 	return new Line(this.nodes[0].transform(matrix), this.nodes[1].transform(matrix));
	// }
}

class Edge{
	nodes:[XY,XY];
	// a, b are points, or
	// (a,b) point 1 and (c,d) point 2, each x,y
	constructor(a:any, b:any, c?:any, d?:any){
		if(a instanceof XY){this.nodes = [a,b];}
		else if(a.x !== undefined){this.nodes = [new XY(a.x, a.y), new XY(b.x, b.y)];}
		else{ this.nodes = [new XY(a,b), new XY(c,d)]; }
	}
	length():number{ return Math.sqrt( Math.pow(this.nodes[0].x-this.nodes[1].x,2) + Math.pow(this.nodes[0].y-this.nodes[1].y,2) ); }
	vector(originNode?:XY):XY{
		if(originNode === undefined){ return this.nodes[1].subtract(this.nodes[0]); }
		if(this.nodes[0].equivalent(originNode)){
			return this.nodes[1].subtract(this.nodes[0]);
		}
		return this.nodes[0].subtract(this.nodes[1]);
	}
	midpoint():XY { return new XY( 0.5*(this.nodes[0].x + this.nodes[1].x),
								   0.5*(this.nodes[0].y + this.nodes[1].y));}
	intersectLine(line:Line):XY{return intersectionLineEdge(line,this);}
	intersectRay(ray:Ray):XY{return intersectionRayEdge(ray,this);}
	intersectEdge(edge:Edge):XY{return intersectionEdgeEdge(this,edge);}
	reflectionMatrix():Matrix{return new Matrix().reflection(this.nodes[0], this.nodes[1]);}
	parallel(line:Line, epsilon?:number):boolean{
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		var u = this.nodes[1].subtract(this.nodes[0]);
		var v = line.nodes[1].subtract(line.nodes[0]);
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
	transform(matrix:Matrix):Edge{
		return new Edge(this.nodes[0].transform(matrix), this.nodes[1].transform(matrix));
	}
	nearestPointNormalTo(point:XY):XY{
		var p = this.nodes[0].distanceTo(this.nodes[1]);
		var u = ((point.x-this.nodes[0].x)*(this.nodes[1].x-this.nodes[0].x) + (point.y-this.nodes[0].y)*(this.nodes[1].y-this.nodes[0].y)) / (Math.pow(p,2));
		if(u < 0 || u > 1.0){ return undefined; }
		return new XY(this.nodes[0].x + u*(this.nodes[1].x-this.nodes[0].x), this.nodes[0].y + u*(this.nodes[1].y-this.nodes[0].y));
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
			// calculate circumcenter
		}
	}
	angles():[number,number,number]{
		return this.points.map(function(p,i){
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




class ConvexPolygon{
	edges:Edge[];
	contains(p:XY):boolean{
		var found = true;
		for(var i = 0; i < this.edges.length; i++){
			var a = this.edges[i].nodes[1].subtract(this.edges[i].nodes[0]);
			var b = new XY(p.x-this.edges[i].nodes[0].x,p.y-this.edges[i].nodes[0].y);
			if (a.cross(b) < 0){ return false; }
		}
		return true;
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
	convexHull(points:XY[]):ConvexPolygon{
		// validate input
		if(points === undefined || points.length === 0){ this.edges = []; return undefined; }
		// # points in the convex hull before escaping function
		var INFINITE_LOOP = 10000;
		// sort points by x and y
		var sorted = points.sort(function(a,b){
				if(a.x-b.x < -EPSILON_HIGH){ return -1; }  if(a.x-b.x > EPSILON_HIGH){ return 1; }
				if(a.y-b.y < -EPSILON_HIGH){ return -1; }  if(a.y-b.y > EPSILON_HIGH){ return 1; }
				return 0;});
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
			if(hull.contains(angles[0].node)){
				this.edges = this.edgesFromPoints(hull);
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
	edgesFromPoints(points:XY[]):Edge[]{
		return points.map(function(el,i){
			var nextEl = points[ (i+1)%points.length ];
			return new Edge(el, nextEl);
		},this);
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
		return [this.endPoints[0].subtract(this.origin), this.endPoints[1].subtract(this.origin)];
	}
	angle():number{
		return clockwiseInteriorAngle(this.endPoints[0].subtract(this.origin), this.endPoints[1].subtract(this.origin));
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
		if(divisions === undefined || divisions < 1){ throw "subsetAngle() requires a parameter greater than 1"; }
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
		return vectors.map(function(el:XY,i){ return el.rotate(rotateNodes[i]); },this);
	}
	equivalent(a:Sector):boolean{
		return a.origin.equivalent(this.origin) && 
		       a.endPoints[0].equivalent(this.endPoints[0]) && 
		       a.endPoints[1].equivalent(this.endPoints[1]);
	}
	// (private function)
	sortByClockwise(){}
}

/////////////////////////////// ARRAYS /////////////////////////////// 
interface Array<T> {
	allEqual():boolean;
	removeDuplicates(compFunction:(a: T, b: T) => boolean): Array<T>;
	contains(object: T, compFunction?:(a: T, b: T) => boolean): boolean;
	flatMap<T, U>(mapFunc: (x: T) => U[]) : U[];	
}
Array.prototype.flatMap = function<T, U>(mapFunc: (x: T) => U[]) : U[] {
	return this.reduce((cumulus: U[], next: T) => [...mapFunc(next), ...cumulus], <U[]> []);
}
Array.prototype.removeDuplicates = function(compFunction:(a, b) => boolean): any[]{
	if(this.length <= 1) return this;
	for(var i = 0; i < this.length-1; i++){
		for(var j = this.length-1; j > i; j--){
			if(compFunction(this[i], this[j])){
				this.splice(j,1);
			}
		}
	}
	return this;
}
/** all values in an array are equivalent based on !== comparison */
Array.prototype.allEqual = function():boolean {
	if(this.length <= 1){ return true; }
	for(var i = 1; i < this.length; i++){ if(this[i] !== this[0]) return false; }
	return true;
}
/** does an array contain an object, based on reference comparison */
Array.prototype.contains = function(object, compFunction?:(a, b) => boolean):boolean{
	if(compFunction !== undefined){
		// comp function was supplied
		for(var i = 0; i < this.length; i++){
			if(compFunction(this[i], object) === true){ return true; }
		}
		return false;
	}
	for(var i = 0; i < this.length; i++) { if(this[i] === object){ return true; } }
	return false;
}
