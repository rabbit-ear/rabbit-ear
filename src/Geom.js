// Geometry for .fold file origami

// all points are array syntax [x,y]
// all edges are array syntax [[x,y], [x,y]]
// all infinite lines are defined as point and vector
// all polygons are an ordered set of points in either winding direction

/** is a point inside of a convex polygon? 
 * including along the boundary within epsilon 
 *
 * @param poly is an array of points [ [x,y], [x,y]...]
 * @returns {boolean} true if point is inside polygon
 */
export function polygon_contains_point(poly, point, epsilon = 1e-10){
	if(poly == undefined || !(poly.length > 0)){ return false; }
	return poly.map( (p,i,arr) => {
		let nextP = arr[(i+1)%arr.length];
		let a = [ nextP[0]-p[0], nextP[1]-p[1] ];
		let b = [ point[0]-p[0], point[1]-p[1] ];
		return a[0] * b[1] - a[1] * b[0] > -epsilon;
	}).map((s,i,arr) => s == arr[0]).reduce((prev,curr) => prev && curr, true)
}

/** is a point collinear to an edge, between endpoints, within an epsilon */
export function edge_collinear(edgeP0, edgeP1, point, epsilon = 1e-10){
	// distance between endpoints A,B should be equal to point->A + point->B
	let dEdge = Math.sqrt(Math.pow(edgeP0[0]-edgeP1[0],2) + Math.pow(edgeP0[1]-edgeP1[1],2));
	let dP0 = Math.sqrt(Math.pow(point[0]-edgeP0[0],2) + Math.pow(point[1]-edgeP0[1],2));
	let dP1 = Math.sqrt(Math.pow(point[0]-edgeP1[0],2) + Math.pow(point[1]-edgeP1[1],2));
	return Math.abs(dEdge - dP0 - dP1) < epsilon
}

/** is a point collinear to a line, within an epsilon */
// export function line_collinear(linePoint, lineVector, point, epsilon = 1e-10){
// 	// point is collinear to line if the vectors to linePoint dot product == 1
// 	let pointPoint = normalize([point[0] - linePoint[0], point[1] - linePoint[1]]);
// 	let normalVec = normalize(lineVector);
// 	let dot = pointPoint[0]*normalVec[0] + pointPoint[1]*normalVec[1];
// 	return Math.abs(Math.abs(dot)-1) < epsilon;
// }
export function line_collinear(linePoint, lineVector, point, epsilon = 1e-10){
	let pointPoint = [point[0] - linePoint[0], point[1] - linePoint[1]];
	let cross = pointPoint[0]*lineVector[1] - pointPoint[1]*lineVector[0];
	return Math.abs(cross) < epsilon;
}


/** do two convex polygons overlap one another */
export function overlaps(ps1, ps2){
	// convert array of points into edges [point, nextPoint]
	let e1 = ps1.map((p,i,arr) => [p, arr[(i+1)%arr.length]] )
	let e2 = ps2.map((p,i,arr) => [p, arr[(i+1)%arr.length]] )
	for(let i = 0; i < e1.length; i++){
		for(let j = 0; j < e2.length; j++){
			if(edge_intersection(e1[i][0], e1[i][1], e2[j][0], e2[j][1]) != undefined){
				return true;
			}
		}
	}
	if(polygon_contains_point(ps1, ps2[0])){ return true; }
	if(polygon_contains_point(ps2, ps1[0])){ return true; }
	return false;
}

/** clip an infinite line in a polygon, returns an edge or undefined if no intersection */
export function clip_line_in_poly(poly, linePoint, lineVector){
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

/** apply a matrix transform on a point */
export function transform_point(point, matrix){
	return [ point[0] * matrix[0] + point[1] * matrix[2] + matrix[4],
	         point[0] * matrix[1] + point[1] * matrix[3] + matrix[5] ];
}

/** 
 * Matrix class to standardize row-column order
 */
export function matrix_reflection(origin, vector){

}
export class Matrix{
	static reflection(origin, vector){
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
	static inverse(m){
		var det = m[0] * m[3] - m[1] * m[2];
		if (!det || isNaN(det) || !isFinite(m[4]) || !isFinite(m[5])){ return undefined; }
		return [ m[3]/det, -m[1]/det, -m[2]/det, m[0]/det, 
		         (m[2]*m[5] - m[3]*m[4])/det, (m[1]*m[4] - m[0]*m[5])/det ];
	}
	static multiply(m1, m2){
		let a = m1[0] * m2[0] + m1[2] * m2[1];
		let c = m1[0] * m2[2] + m1[2] * m2[3];
		let tx = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
		let b = m1[1] * m2[0] + m1[3] * m2[1];
		let d = m1[1] * m2[2] + m1[3] * m2[3];
		let ty = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
		return [a, b, c, d, tx, ty];
	}
}

//
//  internal
//

/** edge-edge intersection: four endpoints of the two edges */
var edge_intersection = function(a0, a1, b0, b1){
	let vecA = [a1[0]-a0[0], a1[1]-a0[1]];
	let vecB = [b1[0]-b0[0], b1[1]-b0[1]];
	return vector_intersection(a0, vecA, b0, vecB, edge_edge_comp_func);
}
/** 
 * line-edge intersection:
 * in the arguments line comes first (point, vector) followed by edge's two endpoints
 */
export function line_edge_intersection(point, vec, edge0, edge1){
	let edgeVec = [edge1[0]-edge0[0], edge1[1]-edge0[1]];
	return vector_intersection(point, vec, edge0, edgeVec, line_edge_comp_func);
}

export function line_edge_intersect_exclusive(point, vec, edge0, edge1){
	let edgeVec = [edge1[0]-edge0[0], edge1[1]-edge0[1]];
	let x = vector_intersection(point, vec, edge0, edgeVec, line_edge_comp_func);
	if (x == null){ return undefined; }
	if(points_equivalent(x, edge0) || points_equivalent(x, edge1)){
		return undefined;
	}
	return x;
}
/** 
 * the generalized vector intersection function
 * requires a compFunction to describe valid bounds checking 
 * line always returns true, ray is true for t > 0, edge must be between 0 < t < 1
*/
var vector_intersection = function(aOrigin, aVec, bOrigin, bVec, compFunction, epsilon = 1e-10){
	function det(a,b){ return a[0] * b[1] - b[0] * a[1]; }
	var denominator0 = det(aVec, bVec);
	var denominator1 = -denominator0;
	if(Math.abs(denominator0) < epsilon){ return undefined; } /* parallel */
	var numerator0 = det([bOrigin[0]-aOrigin[0], bOrigin[1]-aOrigin[1]], bVec);
	var numerator1 = det([aOrigin[0]-bOrigin[0], aOrigin[1]-bOrigin[1]], aVec);
	var t0 = numerator0 / denominator0;
	var t1 = numerator1 / denominator1;
	if(compFunction(t0,t1,epsilon)){ return [aOrigin[0] + aVec[0]*t0, aOrigin[1] + aVec[1]*t0]; }
}
/** comp functions for generalized vector intersection function */
const edge_edge_comp_func = function(t0,t1,ep = 1e-10){return t0 >= -ep && t0 <= 1+ep && t1 >= -ep && t1 <= 1+ep;}
const line_edge_comp_func = function(t0,t1,ep = 1e-10){return t1 >= -ep && t1 <= 1+ep;}

/** are two points equivalent within an epsilon */
function points_equivalent(a, b, epsilon = 1e-10){
	// rectangular bounds test for faster calculation
	return Math.abs(a[0]-b[0]) < epsilon && Math.abs(a[1]-b[1]) < epsilon;
}

/** clean floating point numbers
 *  example: 15.0000000000000002 into 15
 * the adjustable epsilon is default 15, Javascripts 16 digit float
 */
export function clean_number(num, decimalPlaces = 15){
	if (num == undefined) { return undefined; }
	return parseFloat(num.toFixed(decimalPlaces));
}

function normalize(p){
	var z = p[2] == null ? 0 : p[2];
	var m = Math.sqrt(p[0]*p[0] + p[1]*p[1] + z*z);
	return [p[0]/m, p[1]/m, z/m];
}
function midpoint(a, b){
	var aZ = a[2] == null ? 0 : a[2];
	var bZ = b[2] == null ? 0 : b[2];
	return [(a[0]+b[0])*0.5, (a[1]+b[1])*0.5, (aZ+bZ)*0.5];
}
function cross(a, b){ return [
	a[1]*b[2] - a[2]*b[1],
	a[2]*b[0] - a[0]*b[2],
	a[0]*b[1] - a[1]*b[0]
];}

// Origami Axioms
class Line{
	static betweenPoints(){
		let points = gimme2Points(...arguments);
		return {
			point: [points[0][0], points[0][1], points[0][2]],
			direction: normalize([
				points[1][0] - points[0][0],
				points[1][1] - points[0][1],
				points[1][2] - points[0][2]
			])
		}
	}
	static perpendicularBisector(){
		// perpendicular bisector in 3D gives you a plane.
		// we're going to assume this plane intersects with the z=0 plane.
		// figure out a user friendly way to ask for this second plane
		let points = gimme2Points(...arguments);
		let vec = normalize([
			points[1][0] - points[0][0],
			points[1][1] - points[0][1],
			points[1][2] - points[0][2]
		]);
		return {
			point: midpoint(points[0], points[1]),
			direction: cross(vec, [0,0,1])
		}
	}
}

function bisect_lines(a, b){
	if( a.parallel(b) ){
		return [new Line( a.point.midpoint(b.point), a.direction)];
	} else{
		var intersection = intersectionLineLine(a, b);
		var vectors = bisectVectors(a.direction, b.direction);
		vectors[1] = vectors[1].rotate90();
		if(Math.abs(a.direction.cross(vectors[1])) < Math.abs(a.direction.cross(vectors[0]))){
			var swap = vectors[0];
			vectors[0] = vectors[1];
			vectors[1] = swap;
		}
		return vectors.map((el) => new Line(intersection, el));
	}
}

// function gimme1Edge(a, b, c, d){
// 	// input is 1 edge, 2 XY, or 4 numbers
// 	if(a instanceof M.Edge){ return a; }
// 	if(a.nodes !== undefined){ return new M.Edge(a.nodes[0], a.nodes[1]); }
// 	if(isValidPoint(b) ){ return new M.Edge(a,b); }
// 	if(isValidNumber(d)){ return new M.Edge(a,b,c,d); }
// }

function axiom1(){
	return Line.betweenPoints(...arguments);
}
function axiom2(){
	return Line.perpendicularBisector(...arguments);
}
function axiom3(one, two){
	return new M.Edge(one)
		.infiniteLine()
		.bisect(new M.Edge(two).infiniteLine())
		.map(function (line) { return new CPLine(this, line); }, this);
}
function axiom4(line, point){
	return new CPLine(this, new M.Line(point, new M.Edge(line).vector().rotate90()));
}
function axiom5(origin, point, line){
	var radius = Math.sqrt(Math.pow(origin.x - point.x, 2) + Math.pow(origin.y - point.y, 2));
	var intersections = new M.Circle(origin, radius).intersection(new M.Edge(line).infiniteLine());
	var lines = [];
	for(var i = 0; i < intersections.length; i++){ lines.push(this.axiom2(point, intersections[i])); }
	return lines;
}

function axiom7(point, ontoLine, perp){
	var newLine = new M.Line(point, new M.Edge(perp).vector());
	var intersection = newLine.intersection(new M.Edge(ontoLine).infiniteLine());
	if(intersection === undefined){ return undefined; }
	return this.axiom2(point, intersection);
};

// need to test:
// do two polygons overlap if they share a point in common? share an edge?


