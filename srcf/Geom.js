// Geometry for .fold file origami

// all points are array syntax [x,y]
// all edges are array syntax [[x,y], [x,y]]
// all infinite lines are defined as point and vector
// all polygons are an ordered set of points in either winding direction

/** will clean up numbers like 15.0000000000000002 into 15
 * the epsilon is set to 15 which clips the last 1 digit in a
 * Javascript 16 digit float. this epsilon is adjustable.*/
export function clean_number(num, decimalPlaces = 15){
	if (num == undefined) { return undefined; }
	return parseFloat(num.toFixed(decimalPlaces));
}

/** is a point inside of a convex polygon, including along the boundary within epsilon */
export function contains(poly, point, epsilon = 0.0000000001){
	if(poly == undefined || !(poly.length > 0)){ return false; }
	return poly.map( (p,i,arr) => {
		let nextP = arr[(i+1)%arr.length];
		let a = [ nextP[0]-p[0], nextP[1]-p[1] ];
		let b = [ point[0]-p[0], point[1]-p[1] ];
		return a[0] * b[1] - a[1] * b[0] > -epsilon;
	}).map((s,i,arr) => s == arr[0]).reduce((prev,curr) => prev && curr, true)
}

/** is a point collinear to an edge, between endpoints, within an epsilon */
export function collinear(edgeP0, edgeP1, point, epsilon = 0.0000000001){
	// distance between endpoints A,B should be equal to point->A + point->B
	let dEdge = Math.sqrt(Math.pow(edgeP0[0]-edgeP1[0],2) + Math.pow(edgeP0[1]-edgeP1[1],2));
	let dP0 = Math.sqrt(Math.pow(point[0]-edgeP0[0],2) + Math.pow(point[1]-edgeP0[1],2));
	let dP1 = Math.sqrt(Math.pow(point[0]-edgeP1[0],2) + Math.pow(point[1]-edgeP1[1],2));
	return Math.abs(dEdge - dP0 - dP1) < epsilon
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
	if(contains(ps1, ps2[0])){ return true; }
	if(contains(ps2, ps1[0])){ return true; }
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
var line_edge_intersection = function(point, vec, edge0, edge1){
	let edgeVec = [edge1[0]-edge0[0], edge1[1]-edge0[1]];
	return vector_intersection(point, vec, edge0, edgeVec, line_edge_comp_func);
}
/** 
 * the generalized vector intersection function
 * requires a compFunction to describe valid bounds checking 
 * line always returns true, ray is true for t > 0, edge must be between 0 < t < 1
*/
var vector_intersection = function(aOrigin, aVec, bOrigin, bVec, compFunction, epsilon = 0.0000000001){
	function determinantXY(a,b){ return a[0] * b[1] - b[0] * a[1]; }
	var denominator0 = determinantXY(aVec, bVec);
	var denominator1 = -denominator0;
	if(Math.abs(denominator0) < epsilon){ return undefined; } /* parallel */
	var numerator0 = determinantXY([bOrigin[0]-aOrigin[0], bOrigin[1]-aOrigin[1]], bVec);
	var numerator1 = determinantXY([aOrigin[0]-bOrigin[0], aOrigin[1]-bOrigin[1]], aVec);
	var t0 = numerator0 / denominator0;
	var t1 = numerator1 / denominator1;
	if(compFunction(t0,t1,epsilon)){ return [aOrigin[0] + aVec[0]*t0, aOrigin[1] + aVec[1]*t0]; }
}
/** comp functions for generalized vector intersection function */
const edge_edge_comp_func = function(t0,t1,ep = 0.0000000001){return t0 >= -ep && t0 <= 1+ep && t1 >= -ep && t1 <= 1+ep;}
const line_edge_comp_func = function(t0,t1,ep = 0.0000000001){return t1 >= -ep && t1 <= 1+ep;}

/** are two points equivalent within an epsilon */
function points_equivalent(a, b, epsilon = 0.0000000001){
	// rectangular bounds test for faster calculation
	return Math.abs(a.x-b.x) < epsilon && Math.abs(a.y-b.y) < epsilon;
}

// need to test:
// do two polygons overlap if they share a point in common? share an edge?

