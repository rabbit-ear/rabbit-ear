import * as Geometry from "../../include/geometry";
import * as Args from "../convert/arguments";

export const axiom = function(number, parameters) {
	let params = Array(...arguments)
	params.shift();
	switch(number) {
		case 1: return axiom1(...params);
		case 2: return axiom2(...params);
		case 3: return axiom3(...params);
		case 4: return axiom4(...params);
		case 5: return axiom5(...params);
		case 6: return axiom6(...params);
		case 7: return axiom7(...params);
		case 0: return paramTest(...params);
	}
};

const paramTest = function(a, b, c, d) {
	console.log("arguments", arguments);
	console.log("...arguments", ...arguments);
	console.log("a", a);
	console.log("b", b);
	console.log("c", c);
	console.log("d", d);
}

// export const axiom = function(number, params) {
// 	let args;
// 	switch(number) {
// 		case 1: args = Args.get_two_vec2(params); break;
// 		case 2: args = Args.get_two_vec2(params); break;
// 		case 3: args = Args.get_two_lines(params); break;
// 		case 4: args = Args.get_two_lines(params); break;
// 		case 5: args = Args.get_two_lines(params); break;
// 		case 6: args = Args.get_two_lines(params); break;
// 		case 7: args = Args.get_two_lines(params); break;
// 	}
// 	// if (args === undefined) {
// 	// 	throw "axiom " + number + " was not provided with the correct inputs";
// 	// }
// 	let crease = Crease(_this, Origami["axiom"+number](_this, ...args));
// 	didModifyGraph();
// 	return crease;
// };
// const axiom1 = function() { return axiom.call(_this, [1, arguments]); };
// const axiom2 = function() { return axiom.call(_this, [2, arguments]); };
// const axiom3 = function() { return axiom.call(_this, [3, arguments]); };
// const axiom4 = function() { return axiom.call(_this, [4, arguments]); };
// const axiom5 = function() { return axiom.call(_this, [5, arguments]); };
// const axiom6 = function() { return axiom.call(_this, [6, arguments]); };
// const axiom7 = function() { return axiom.call(_this, [7, arguments]); };

const makeCrease = function(point, vector) {
	let crease = [point, vector];
	crease.point = point;
	crease.vector = vector;
	return crease;
}

// n-dimension
export const axiom1 = function(pointA, pointB) {
	let a, b;
	a = pointA; b = pointB;
	let p0 = Args.get_vec(pointA);
	let p1 = Args.get_vec(pointB);
	let vec = p0.map((_,i) => p1[i] - p0[i]);
	return makeCrease(p0, vec);
}

// 2-dimension
export const axiom2 = function(a, b) {
	let mid = Geometry.core.midpoint(a, b);
	let vec = Geometry.core.normalize(a.map((_,i) => b[i] - a[i]));
	return makeCrease(mid, [vec[1], -vec[0]]);
}
export const axiom3 = function(pointA, vectorA, pointB, vectorB){
	return Geometry.core.bisect_lines2(pointA, vectorA, pointB, vectorB)
		.map(line => makeCrease(line[0], line[1]));
}
export const axiom4 = function(pointA, vectorA, pointB) {
	let norm = Geometry.core.normalize(vectorA);
	let rightAngle = [norm[1], -norm[0]];
	return [[...pointB], rightAngle];
}
export const axiom5 = function(pointA, vectorA, pointB, pointC) {
	let pA = Args.get_vec(pointA);
	let vA = Args.get_vec(vectorA);
	let pB = Args.get_vec(pointB);
	let pC = Args.get_vec(pointC);
	let radius = Math.sqrt(Math.pow(pB[0]-pC[0], 2) + Math.pow(pB[1]-pC[1], 2));
	// circle line intersection needs another point, not vector... oops
	let pA2 = [pA[0] + vA[0], pA[1] + vA[1]];
	let sect = Geometry.core.intersection.circle_line(pB, radius, pA, pA2);
	return sect === undefined
		? []
		: sect.map(s => axiom2(pC, s));
}


// axiom5(origin:XY, point:XY, line:Crease):CPLine[]{
// 	var radius = Math.sqrt(Math.pow(origin.x - point.x, 2) + Math.pow(origin.y - point.y, 2));
// 	var intersections:XY[] = new Circle(origin, radius).intersection(new Edge(line).infiniteLine());
// 	var lines:CPLine[] = [];
// 	for(var i:number = 0; i < intersections.length; i++){ lines.push(this.axiom2(point, intersections[i])); }
// 	return lines;
// }

export const axiom6 = function(pointA, vectorA, pointB, vectorB, pointC, pointD) {
}
/**
 * make a crease by bringing a point (pointC) onto a line (pointA, vectorA)
 * that lies perpendicular to another line (pointB, vectorB)
 * ...technically we don't need to be asking for pointB...
 */
export const axiom7 = function(pointA, vectorA, pointB, vectorB, pointC) {
	let pA = Args.get_vec(pointA);
	// let pB = Args.get_vec(pointB);
	let pC = Args.get_vec(pointC);
	let vA = Args.get_vec(vectorA);
	let vB = Args.get_vec(vectorB);
	let sect = Geometry.core.intersection.line_line(pA, vA, pC, vB);
	if(sect === undefined){ return undefined; }
	// axiom 2
	let mid = Geometry.core.midpoint(pC, sect);
	let vec = Geometry.core.normalize(pC.map((_,i) => sect[i] - pC[i]));
	return makeCrease(mid, [vec[1], -vec[0]]);
};

/*
	axiom6(point1:XY, point2:XY, line1:Crease, line2:Crease):CPLine[]{
		var p1:number = point1.x;
		var q1:number = point1.y;
		//find equation of line in form y = mx+h (or x = k)
		if (line1.nodes[1].x - line1.nodes[0].x != 0) {
			var m1:number = (line1.nodes[1].y - line1.nodes[0].y) / ((line1.nodes[1].x - line1.nodes[0].x));
			var h1:number = line1.nodes[0].y - m1 * line1.nodes[0].x;
		}
		else {
			var k1:number = line1.nodes[0].x;
		}

		var p2:number = point2.x;
		var q2:number = point2.y;
		//find equation of line in form y = mx+h (or x = k)
		if (line2.nodes[1].x - line2.nodes[0].x != 0) {
			var m2:number = (line2.nodes[1].y - line2.nodes[0].y) / (line2.nodes[1].x - line2.nodes[0].x);
			var h2:number = line2.nodes[0].y - m2 * line2.nodes[0].x;
		}
		else {
			var k2:number = line2.nodes[0].x;
		}

		//equation of perpendicular bisector between (p,q) and (u, v) {passes through ((u+p)/2,(v+q)/2) with slope -(u-p)/(v-q)}
		//y = (-2(u-p)x + (v^2 -q^2 + u^2 - p^2))/2(v-q)

		//equation of perpendicular bisector between (p,q) and (u, mu+h)
		// y = (-2(u-p)x + (m^2+1)u^2 + 2mhu + h^2-p^2-q^2)/(2mu + 2(h-q))

		//equation of perpendicular bisector between (p,q) and (k, v)
		//y = (-2(k-p)x + (v^2 + k^2-p^2-q^2))/2(v-q)

		//if the two bisectors are the same line, then the gradients and intersections of both lines are equal

		//case 1: m1 and m2 both defined
		if (m1 !== undefined && m2 !== undefined) {
			//1: (u1-p1)/(m1u1+(h1 -q1)) = (u2-p2)/(m2u2+(h2-q2))
			//and
			//2: (a1u1^2+b1u1+ c1)/(d1u1+e1) = (a2u2^2+b2u2+c2)/(d2u2+e2)
			//where
			//an = mn^2+1
			//bn = 2mnhn
			//cn = hn^2-pn^2-qn^2
			//dn = 2mn
			//en = 2(hn-qn)

			var a1:number = m1*m1 + 1;
			var b1:number = 2*m1*h1;
			var c1:number = h1*h1 - p1*p1 - q1*q1;
			//var d1:number = 2*m1;
			//var e1:number = 2*(h1 - q1);

			var a2:number = m2*m2 + 1;
			var b2:number = 2*m2*h2;
			var c2:number =  h2*h2 - p2*p2 - q2*q2;
			//var d2:number = 2*m2;
			//var e2:number = 2*(h2 - q2);

			//rearrange 1 to express u1 in terms of u2
			//u1 = (a0u2+b0)/(c0u2+d0)
			//where
			//a0 = m2p1-(q1-h1)
			//b0 = p2(q1-h1)-p1(q2-h2)
			//c0= m2-m1
			//d0= m1p2-(q2-h2)
			var a0:number = m2*p1 + (h1 - q1);
			var b0:number = p1*(h2 - q2) - p2*(h1 - q1);
			var c0:number = m2 - m1;
			var d0:number = m1*p2 + (h2 - q2);

			var z:number = m1*p1 + (h1 - q1);
			//subsitute u1 into 2 and solve for u2:
		}
		else if (m1 === undefined && m2 === undefined) {
			//1: (k1-p1)/(v1 -q1)) = (k2-p2)/(v2-q2)
			//and
			//2: (v1^2+c1)/(d1v1+e1) = (v2^2+c2)/(d2u2+e2)
			//where
			//cn = kn^2-pn^2-qn^2
			//dn = 2
			//en = -2qn

			a1 = 1;
			b1 = 0;
			c1 = k1*k1 - p1*p1 - q1*q1;
			//d1 = 2;
			//e1 = -2*q1;

			a2 = 1;
			b2 = 0;
			c2 = k2*k2 - p2*p2 - q2*q2;
			//d2 = 2;
			//e2 = -2*q2;

			//rearrange 1 to express v1 in terms of v2
			//v1 = (a0v2+b0)/d0
			//where
			//a0 =k1-p1
			//b0 = q1(k2-p2)-q1(k1-p1)
			//d0= k2-p2
			a0 = k1 - p1;
			b0 = q1*(k2 - p2) - q2*(k1 - p1);
			c0 = 0;
			d0 = k2 - p2;

			z = a0;
			//subsitute v1 into 2 and solve for v2:
		}
		else {
			if (m1 === undefined) {
				//swap the order of the points and lines
				var p3:number = p1;
				p1 = p2;
				p2 = p3;
				var q3:number = q1;
				q1 = q2;
				q2 = q3;
				m1 = m2;
				m2 = undefined;
				h1 = h2;
				h2 = undefined;
				k2 = k1;
				k1 = undefined;
			}

			//1: (u1-p1)/(m1u1+(h1 -q1))  = (k2-p2)/(v2-q2)
			//and
			//2: (a1u1^2+b1u1+ c1)/(d1u1+e1) =  (v2^2+c2)/(d2u2+e2)
			//where
			//a1 = m1^2+1
			//b1 = 2m1h1
			//c1 = h1^2-p1^2-q1^2
			//d1 = 2m1
			//e1 = 2(h1-q1)
			//c2 = k2^2-p2^2-q2^2
			//d2 = 2
			//e2 = -2q2

			a1 = m1*m1 + 1;
			b1 = 2*m1*h1;
			c1 = h1*h1 - p1*p1 - q1*q1;
			//d1 = 2*m1;
			//e1 = 2*(h1 - q1);

			a2 = 1;
			b2 = 0;
			c2 = k2*k2 - p2*p2 - q2*q2;
			//d2 = 2;
			//e2 = -2*q2;

			//rearrange 1 to express u1 in terms of v2
			//u1 = (a0v2+b0)/(v2+d0)
			//where
			//a0 = p1
			//b0 = (h1-q1)(k2-p2) - p1q1
			//d0= -m1(k2-p2)-q2
			a0 = p1;
			b0 = (h1 - q1)*(k2 - p2) - p1*q2;
			c0 = 1;
			d0 = -m1*(k2 - p2) - q2;

			z = m1*p1 + (h1 - q1);
			//subsitute u1 into 2 and solve for v2:
		}

		//subsitute into 3:
		//4: (a3x^2 + b3x + c3)/(d3x^2 + e3x + f3) = (a2x^2 + b2x + c2)/(d2x + e2)
		//where
		//a3 = a1a0^2+b1a0c0+c1c0^2
		//b3 = 2a1a0b0+b1(a0d0+b0c0)+2c1c0d0
		//c3 = a1b0^2+b1b0d0+c1d0^2
		//d3 =c0(d1a0+e1c0) = d2c0z
		//e3 = d0(d1a0+e1c0)+c0(d1b+e1d) = (d2d0+e2c0)z
		//f3 = d0(d1b0+e1d0) = e2d0z

		var a3:number = a1*a0*a0 + b1*a0*c0 + c1*c0*c0;
		var b3:number = 2*a1*a0*b0 + b1*(a0*d0 + b0*c0) + 2*c1*c0*d0;
		var c3:number = a1*b0*b0 + b1*b0*d0 + c1*d0*d0;
		//var d3:number = d2*c0*z
		//var e3:number = (d2*d0 + e2*c0)*z;
		//var f3:number = e2*d0*z;

		//rearrange to gain the following quartic
		//5: (d2x+e2)(a4x^3+b4x^2+c4x+d) = 0
		//where
		//a4 = a2c0z
		//b4 = (a2d0+b2c0)z-a3
		//c4 = (b2d0+c2c0)z-b3
		//d4 = c2d0z-c3

		var a4:number = a2*c0*z;
		var b4:number = (a2*d0 + b2*c0) * z - a3;
		var c4:number = (b2*d0 + c2*c0) * z - b3;
		var d4:number =  c2*d0*z - c3;

		//find the roots
		var roots:number[] = new CubicEquation(a4,b4,c4,d4).realRoots();

		var lines:CPLine[] = [];
		if (roots != undefined && roots.length > 0) {
			for (var i:number = 0; i < roots.length; ++i) {
				if (m1 !== undefined && m2 !== undefined) {
					var u2:number = roots[i];
					var v2:number = m2*u2 + h2;
					//var u1 = (a0*u2 + b0)/(c0*u2 + d0);
					//var v1 = m1*u1 + h1;
				}
				else if (m1 === undefined && m2 === undefined) {
					v2 = roots[i];
					u2 = k2;
					//v1 = (a0*v2 + b0)/d0;
					//u1 = k1;
				}
				else {
					v2 = roots[i];
					u2 = k2;
					//u1 = (a0*v2 + b0)/(v2 + d0);
					//v1 =  m1*u1 + h1;
				}

				//The midpoints may be the same point, so cannot be used to determine the crease
				//lines.push(this.axiom1(new XY((u1 + p1) / 2, (v1 + q1) / 2), new XY((u2 + p2) / 2, (v2 + q2) / 2)));

				if (v2 != q2) {
					//F(x) = mx + h = -((u-p)/(v-q))x +(v^2 -q^2 + u^2 - p^2)/2(v-q)
					var mF:number = -1*(u2 - p2)/(v2 - q2);
					var hF:number = (v2*v2 - q2*q2 + u2*u2 - p2*p2) / (2 * (v2 - q2));

					lines.push(this.axiom1(new XY(0, hF), new XY(1, mF + hF)));
				}
				else {
					//G(y) = k
					var kG:number = (u2 + p2)/2;

					lines.push(this.axiom1(new XY(kG, 0), new XY(kG, 1)));
				}
			}
		}
		return lines;
	}

	*/
