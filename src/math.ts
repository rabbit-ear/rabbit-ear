// math.js
// math, mostly geometry to accompany origami crease pattern library
// mit open source license, robby kraft

"use strict";

var EPSILON_LOW  = 0.003;
var EPSILON      = 0.00001;
var EPSILON_HIGH = 0.00000001;
var EPSILON_UI   = 0.05;  // user tap, based on precision of a finger on a screen
var EPSILON_COLLINEAR = EPSILON_LOW;//Math.PI * 0.001; // what decides 2 similar angles

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
function wholeNumberify(num:number):number{
	if(Math.abs(Math.round(num) - num) < EPSILON_HIGH){ num = Math.round(num); }
	return num;
}
/////////////////////////////////////////////////////////////////////////////////
//                            2D ALGORITHMS
/////////////////////////////////////////////////////////////////////////////////
/** if points are all collinear, checks if point lies on line segment 'ab' */
function onSegment(point:XY, a:XY, b:XY, epsilon?:number):boolean{
	if(epsilon === undefined){ epsilon = EPSILON; }
	var a_b = Math.sqrt( Math.pow(a.x - b.x,  2) + Math.pow(a.y - b.y,  2) );
	var p_a = Math.sqrt( Math.pow(point.x-a.x,2) + Math.pow(point.y-a.y,2) );
	var p_b = Math.sqrt( Math.pow(point.x-b.x,2) + Math.pow(point.y-b.y,2) );
	return (Math.abs(a_b - (p_a+p_b)) < epsilon);
}
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
function linesParallel(p0:XY, p1:XY, p2:XY, p3:XY, epsilon?:number):boolean {
	if(epsilon === undefined){ epsilon = EPSILON; }
	// p0-p1 is first line, p2-p3 is second line
	var u = new XY(p1.x - p0.x, p1.y - p0.y);
	var v = new XY(p3.x - p2.x, p3.y - p2.y);
	return (Math.abs( u.dot( v.rotate90() ) ) < epsilon);
}
function minDistBetweenPointLine(a:XY, b:XY, point:XY):XY{
	// (a)-(b) define the line
	var p = Math.sqrt(Math.pow(b.x-a.x,2) + Math.pow(b.y-a.y,2));
	var u = ((point.x-a.x)*(b.x-a.x) + (point.y-a.y)*(b.y-a.y)) / (Math.pow(p,2));
	if(u < 0 || u > 1.0){return undefined;}
	return new XY(a.x + u*(b.x-a.x), a.y + u*(b.y-a.y));
}
function rayRayIntersection(aOrigin:XY, aVector:XY, bOrigin:XY, bVector:XY):XY{
	var u = (aOrigin.y*bVector.x + bVector.y*bOrigin.x - bOrigin.y*bVector.x - bVector.y*aOrigin.x) / (aVector.x*bVector.y - aVector.y*bVector.x);
	var v = (aOrigin.x + aVector.x*u - bOrigin.x) / bVector.x;
	// divide by zero causes v to be infinity or -infinity
	if(epsilonEqual(bVector.x, 0, EPSILON_HIGH)){ v = 0; }
	if(u < -EPSILON || v < -EPSILON){ return undefined; }
	return new XY(aOrigin.x + aVector.x * u, aOrigin.y + aVector.y * u);
}
function rayLineSegmentIntersection(rayOrigin:XY, rayDirection:XY, point1:XY, point2:XY){
	var v1 = new XY(rayOrigin.x - point1.x, rayOrigin.y - point1.y);
	var vLineSeg = new XY(point2.x - point1.x, point2.y - point1.y);
	var vRayPerp = new XY(-rayDirection.y, rayDirection.x);
	var dot = vLineSeg.x*vRayPerp.x + vLineSeg.y*vRayPerp.y;
	if (Math.abs(dot) < EPSILON){ return undefined; }
	var cross = (vLineSeg.x*v1.y-vLineSeg.y*v1.x);
	var t1 = cross / dot;
	var t2 = (v1.x*vRayPerp.x + v1.y*vRayPerp.y) / dot;
	if (t1 >= 0.0 && (t2 >= 0.0 && t2 <= 1.0)){
		return new XY(rayOrigin.x + rayDirection.x * t1, rayOrigin.y + rayDirection.y * t1);
	}
}
function lineIntersectionAlgorithm(p0:XY, p1:XY, p2:XY, p3:XY):XY {
	// p0-p1 is first line, p2-p3 is second line
	var rise1 = (p1.y-p0.y);
	var run1  = (p1.x-p0.x);
	var rise2 = (p3.y-p2.y);
	var run2  = (p3.x-p2.x);
	var denom = run1 * rise2 - run2 * rise1;
	// var denom = l1.u.x * l2.u.y - l1.u.y * l2.u.x;
	if(denom == 0){return undefined;}
	// return XY((l1.d * l2.u.y - l2.d * l1.u.y) / denom, (l2.d * l1.u.x - l1.d * l2.u.x) / denom);
	var s02 = {'x':p0.x - p2.x, 'y':p0.y - p2.y};
	var t = (run2 * s02.y - rise2 * s02.x) / denom;
	return new XY(p0.x + (t * run1), p0.y + (t * rise1) );
}
function lineSegmentIntersectionAlgorithm(p:XY, p2:XY, q:XY, q2:XY):XY {
	var r = new XY(p2.x - p.x, p2.y - p.y);
	var s = new XY(q2.x - q.x, q2.y - q.y);
	var uNumerator = (new XY(q.x - p.x, q.y - p.y)).cross(r);//crossProduct(subtractPoints(q, p), r);
	var denominator = r.cross(s);
	if(onSegment(p, q, q2)){ return p; }
	if(onSegment(p2, q, q2)){ return p2; }
	if(onSegment(q, p, p2)){ return q; }
	if(onSegment(q2, p, p2)){ return q2; }
	if (Math.abs(uNumerator) < EPSILON_HIGH && Math.abs(denominator) < EPSILON_HIGH) {
		// collinear
		// Do they overlap? (Are all the point differences in either direction the same sign)
		if(![(q.x - p.x) < 0, (q.x - p2.x) < 0, (q2.x - p.x) < 0, (q2.x - p2.x) < 0].allEqual() ||
		   ![(q.y - p.y) < 0, (q.y - p2.y) < 0, (q2.y - p.y) < 0, (q2.y - p2.y) < 0].allEqual()){
			return undefined;
		}		
		// Do they touch? (Are any of the points equal?)
		if(p.equivalent(q)){ return new XY(p.x, p.y); }
		if(p.equivalent(q2)){ return new XY(p.x, p.y); }
		if(p2.equivalent(q)){ return new XY(p2.x, p2.y); }
		if(p2.equivalent(q2)){ return new XY(p2.x, p2.y); }
	}
	if (Math.abs(denominator) < EPSILON_HIGH) {
		// parallel
		return undefined;
	}
	var u = uNumerator / denominator;
	var t = (new XY(q.x - p.x, q.y - p.y)).cross(s) / denominator;
	if((t >= 0) && (t <= 1) && (u >= 0) && (u <= 1)){
		return new XY(p.x + r.x*t, p.y + r.y*t);
	}
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
function convexHull(points:XY[]):XY[]{
	// validate input
	if(points === undefined || points.length === 0){ return []; }
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
		if(angles.length === 0){ return []; }
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
		if(hull.contains(angles[0].node)){ return hull; }
		// add point to hull, prepare to loop again
		hull.push(angles[0].node);
		// update walking direction with the angle to the new point
		ang = Math.atan2( hull[h].y - angles[0].node.y, hull[h].x - angles[0].node.x);
	}while(infiniteLoop < INFINITE_LOOP);
	return [];
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
	midpoint(other:XY):XY{ return new XY((this.x+other.x)*0.5, (this.y+other.y)*0.5); }
}

class Edge{
	nodes:[XY,XY];
	constructor(a:XY, b:XY){ this.nodes = [a, b]; }
	length():number{ return Math.sqrt( Math.pow(this.nodes[0].x-this.nodes[1].x,2) + Math.pow(this.nodes[0].y-this.nodes[1].y,2) ); }
	midpoint():XY { return new XY( 0.5*(this.nodes[0].x + this.nodes[1].x),
								   0.5*(this.nodes[0].y + this.nodes[1].y));}
	reflectionMatrix():Matrix{ return new Matrix().reflection(this.nodes[0], this.nodes[1]); }
	equivalent(e:Edge, epsilon?:number):boolean{
		if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
		if((this.nodes[0].equivalent(e.nodes[0],epsilon) && this.nodes[1].equivalent(e.nodes[1], epsilon)) ||
		   (this.nodes[0].equivalent(e.nodes[1],epsilon) && this.nodes[1].equivalent(e.nodes[0], epsilon)) ){
			return true;
		}
		return false;
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
	joints:[Joint,Joint,Joint];
	constructor(points:[XY,XY,XY], circumcenter?:XY){
		this.points = points;
		this.edges = this.points.map(function(el,i){
			var nextEl = this.points[ (i+1)%this.points.length ];
			return new Edge(el, nextEl);
		},this);
		this.joints = this.points.map(function(el,i){
			var prevI = (i+this.points.length-1)%this.points.length;
			var nextI = (i+1)%this.points.length;
			return new Joint(el, [this.points[prevI], this.points[nextI]]);
		},this);
		this.circumcenter = circumcenter;
		if(circumcenter === undefined){
			// calculate circumcenter
		}
	}
	angles():[number,number,number]{
		return this.joints.map(function(el){return el.angle();});
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

class IsoscelesTriangle extends Triangle{

}

/** a Joint is defined by 3 nodes (one common, 2 endpoints) 
 *  clockwise order is enforced
 *  the interior angle is measured clockwise from endpoint 0 to 1
 */
class Joint{
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
	getEdgeVectorsForNewAngle(angle:number, lockedEdge?:PlanarEdge):[XY,XY]{
		// todo, implement locked edge
		var vectors = this.vectors();
		var angleChange = angle - clockwiseInteriorAngle(vectors[0], vectors[1]);
		var rotateNodes = [-angleChange*0.5, angleChange*0.5];
		return vectors.map(function(el:XY,i){ return el.rotate(rotateNodes[i]); },this);
	}
	equivalent(a:Joint):boolean{
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
