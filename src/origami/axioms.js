/*
             _                       _              _
            (_)                     (_)            (_)
   ___  _ __ _  __ _  __ _ _ __ ___  _    __ ___  ___  ___  _ __ ___  ___
  / _ \| '__| |/ _` |/ _` | '_ ` _ \| |  / _` \ \/ / |/ _ \| '_ ` _ \/ __|
 | (_) | |  | | (_| | (_| | | | | | | | | (_| |>  <| | (_) | | | | | \__ \
  \___/|_|  |_|\__, |\__,_|_| |_| |_|_|  \__,_/_/\_\_|\___/|_| |_| |_|___/
                __/ |
               |___/
*/

import math from "../../include/math";
import * as Args from "../convert/math_arguments";

/**
 * an axiom_frame is under the key "re:axiom", it contains:
 * - "number", the axiom number,
 * - "parameters", the inputs for the axiom. varying set of points and/or lines
 *   - "points": an array of entries. each entry is a point in array form
 *   - "lines": an array of entries. each entry is a line (point, vector) array
 * - "solutions", array of entries. each entry is a line (point, vector) array
 *
 * example: "re:axiom" =
 * {
 *  number: 6,
 *  parameters: {
 *    points: [
 *      [0.97319, 0.05149],
 *      [0.93478, 0.93204]
 *    ],
 *    lines: [
 *      [[0.36585, 0.01538], [0.707, 0.707]],
 *      [[0.16846, 0.64646], [1, 0]]
 *    ]
 *  },
 *  solutions: [
 *   [[0.5, 0.625], [0.6, -0.8]],
 *   [[0.25, 0.25], [0.4, -1.0]],
 *   [[0.15, 0.5], [0.2, -0.8]]
 *  ]
 * }
*/

export const axiom = function (number, parameters) {
  const params = Array(...arguments);
  params.shift(); // remove the first parameter, the axiom number
  switch (number) {
    case 1: return axiom1(...params);
    case 2: return axiom2(...params);
    case 3: return axiom3(...params);
    case 4: return axiom4(...params);
    case 5: return axiom5(...params);
    case 6: return axiom6(...params);
    case 7: return axiom7(...params);
    default: return undefined;
    // case 0: return paramTest(...params);
  }
};

// const paramTest = function (a, b, c, d) {
//  console.log("arguments", arguments);
//  console.log("...arguments", ...arguments);
//  console.log("a", a);
//  console.log("b", b);
//  console.log("c", c);
//  console.log("d", d);
// }

// please make sure poly is an array of points
const test_axiom1_2 = function (axiom_frame, poly) {
  const { points } = axiom_frame.parameters;
  return math.core.point_in_convex_poly(points[0], poly)
    && math.core.point_in_convex_poly(points[1], poly);
};

const test_axiom3 = function (axiom_frame, poly) {
  const Xing = math.core.intersection;
  const { lines } = axiom_frame.parameters;
  const a = Xing.convex_poly_line(poly, lines[0][0], lines[0][1]);
  const b = Xing.convex_poly_line(poly, lines[1][0], lines[1][1]);
  return a !== undefined && b !== undefined;
};

const test_axiom4 = function (axiom_frame, poly) {
  const params = axiom_frame.parameters;
  const overlap = math.core.intersection.line_line(
    params.lines[0][0], params.lines[0][1],
    params.points[0], [params.lines[0][1][1], -params.lines[0][1][0]],
  );
  if (overlap === undefined) { return false; }
  return math.core.point_in_convex_poly(overlap, poly)
    && math.core.point_in_convex_poly(params.points[0], poly);
};
const test_axiom5 = function (axiom_frame, poly) {
  return true;
};
const test_axiom6 = function (axiom_frame, poly) {
  return true;
};
const test_axiom7 = function (axiom_frame, poly) {
  if (axiom_frame.solutions.length === 0) { return false; }
  const solution = axiom_frame.solutions[0];
  const params = axiom_frame.parameters;
  const m = math.core.make_matrix2_reflection(solution[1], solution[0]);
  const reflected = math.core.multiply_vector2_matrix2(params.points[0], m);
  const intersect = math.core.intersection.line_line(
    params.lines[1][0], params.lines[1][1],
    solution[0], solution[1],
  );
  axiom_frame.test = {
    points_reflected: [reflected], // 1:1 length as paramters.points
  };
  return math.core.point_in_convex_poly(reflected, poly)
    && math.core.point_in_convex_poly(intersect, poly);
};

const test = [null,
  test_axiom1_2,
  test_axiom1_2,
  test_axiom3,
  test_axiom4,
  test_axiom5,
  test_axiom6,
  test_axiom7,
];

export const test_axiom = function (axiom_frame, poly) {
  const passes = test[axiom_frame.number].call(null, axiom_frame, poly);
  const polyobject = math.Polygon(poly);
  return !passes
    ? []
    : axiom_frame.solutions.map(s => polyobject.clipLine(s));
};

// works in n-dimensions
export const axiom1 = function (pointA, pointB) {
  // const a = pointA;
  // const b = pointB;
  const p0 = Args.get_vector(pointA);
  const p1 = Args.get_vector(pointB);
  const vec = p0.map((_, i) => p1[i] - p0[i]);
  const solution = [[p0, vec]];
  return {
    number: 1,
    parameters: { points: [p0, p1] },
    solutions: [solution],
  };
};

// 2-dimension only
export const axiom2 = function (a, b) {
  const mid = math.core.midpoint(a, b);
  const vec = math.core.normalize(a.map((_, i) => b[i] - a[i]));
  const solution = [mid, [vec[1], -vec[0]]];
  return {
    number: 2,
    parameters: { points: [a, b] },
    solutions: [solution],
  };
};
export const axiom3 = function (pointA, vectorA, pointB, vectorB) {
  const parameters = { lines: [[pointA, vectorA], [pointB, vectorB]] };
  const solutions = math.core.bisect_lines2(pointA, vectorA, pointB, vectorB);
  return {
    number: 3,
    parameters,
    solutions,
  };
};
export const axiom4 = function (pointA, vectorA, pointB) {
  const norm = math.core.normalize(vectorA);
  const solution = [[...pointB], [norm[1], -norm[0]]];
  const parameters = { points: [pointB], lines: [[pointA, vectorA]] };
  return {
    number: 4,
    parameters,
    solutions: [solution],
  };
};
export const axiom5 = function (pointA, vectorA, pointB, pointC) {
  const pA = Args.get_vector(pointA);
  const vA = Args.get_vector(vectorA);
  const pB = Args.get_vector(pointB);
  const pC = Args.get_vector(pointC);
  const radius = Math.sqrt(((pB[0] - pC[0]) ** 2) + ((pB[1] - pC[1]) ** 2));
  // circle line intersection needs another point, not vector... oops
  const pA2 = [pA[0] + vA[0], pA[1] + vA[1]];
  const sect = math.core.intersection.circle_line(pB, radius, pA, pA2) || [];
  const solutions = sect.map((s) => {
    // axiom 2
    const mid = math.core.midpoint(pC, s);
    const vec = math.core.normalize(s.map((_, i) => s[i] - pC[i]));
    return [mid, [vec[1], -vec[0]]];
  });
  const parameters = { points: [pB, pC], lines: [[pA, vA]] };
  return {
    number: 5,
    parameters,
    solutions,
  };
};

/**
 * make a crease by bringing a point (pointC) onto a line (pointA, vectorA)
 * that lies perpendicular to another line (pointB, vectorB)
 * (technically we don't need pointB, but it does go into "parameters")
 */
export const axiom7 = function (pointA, vectorA, pointB, vectorB, pointC) {
  const pA = Args.get_vector(pointA);
  const pB = Args.get_vector(pointB);
  const pC = Args.get_vector(pointC);
  const vA = Args.get_vector(vectorA);
  const vB = Args.get_vector(vectorB);
  const sect = math.core.intersection.line_line(pA, vA, pC, vB);
  if (sect === undefined) { return undefined; }
  // axiom 2
  const mid = math.core.midpoint(pC, sect);
  const vec = math.core.normalize(pC.map((_, i) => sect[i] - pC[i]));
  const solution = [mid, [vec[1], -vec[0]]];
  const parameters = { points: [pC], lines: [[pA, vA], [pB, vB]] };
  return {
    number: 7,
    parameters,
    solutions: [solution],
  };
};


// axiom 6 stuff below

const cuberoot = function (x) {
  var y = Math.pow(Math.abs(x), 1 / 3);
  return x < 0 ? -y : y;
};

const solveCubic = function (a, b, c, d) {
  if (Math.abs(a) < 1e-8) { // Quadratic case, ax^2+bx+c=0
    a = b; b = c; c = d;
    if (Math.abs(a) < 1e-8) { // Linear case, ax+b=0
      a = b; b = c;
      if (Math.abs(a) < 1e-8){ // Degenerate case
        return [];
      }
      return [-b/a];
    }
    var D = b*b - 4*a*c;
    if (Math.abs(D) < 1e-8){
      return [-b/(2*a)];
    }
    else if (D > 0){
      return [(-b+Math.sqrt(D))/(2*a), (-b-Math.sqrt(D))/(2*a)];
    }
    return [];
  }
  // Convert to depressed cubic t^3+pt+q = 0 (subst x = t - b/3a)
  var p = (3*a*c - b*b)/(3*a*a);
  var q = (2*b*b*b - 9*a*b*c + 27*a*a*d)/(27*a*a*a);
  var roots;

  if (Math.abs(p) < 1e-8) { // p = 0 -> t^3 = -q -> t = -q^1/3
    roots = [cuberoot(-q)];
  } else if (Math.abs(q) < 1e-8) { // q = 0 -> t^3 + pt = 0 -> t(t^2+p)=0
    roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
  } else {
    var D = q*q/4 + p*p*p/27;
    if (Math.abs(D) < 1e-8) {       // D = 0 -> two roots
      roots = [-1.5*q/p, 3*q/p];
    } else if (D > 0) {             // Only one real root
      var u = cuberoot(-q/2 - Math.sqrt(D));
      roots = [u - p/(3*u)];
    } else {
      // D < 0, three roots, needs complex numbers/trigonometric solution
      var u = 2*Math.sqrt(-p/3);
      // D < 0 implies p < 0 and acos argument in [-1..1]
      var t = Math.acos(3*q/p/u)/3;
      var k = 2*Math.PI/3;
      roots = [u*Math.cos(t), u*Math.cos(t-k), u*Math.cos(t-2*k)];
    }
  }
  // Convert back from depressed cubic
  for (var i = 0; i < roots.length; i++){
    roots[i] -= b/(3*a);
  }
  return roots;
}

// function (point1, point2, line1, line2){
export const axiom6 = function (pointA, vecA, pointB, vecB, pointC, pointD) {
  var p1 = pointC[0];
  var q1 = pointC[1];
  //find equation of line in form y = mx+h (or x = k)
  if (Math.abs(vecA[0]) > math.core.EPSILON) {
    var m1 = vecA[1] / vecA[0];
    var h1 = pointA[1] - m1 * pointA[0];
  }
  else {
    var k1 = pointA[0];
  }

  var p2 = pointD[0];
  var q2 = pointD[1];
  //find equation of line in form y = mx+h (or x = k)
  if (Math.abs(vecB[0]) > math.core.EPSILON) {
    var m2 = vecB[1] / vecB[0];
    var h2 = pointB[1] - m2 * pointB[0];
  }
  else {
    var k2 = pointB[0];
  }

  //equation of perpendicular bisector between (p,q) and (u, v)
  //  {passes through ((u+p)/2,(v+q)/2) with slope -(u-p)/(v-q)}
  //y = (-2(u-p)x + (v^2 -q^2 + u^2 - p^2))/2(v-q)

  //equation of perpendicular bisector between (p,q) and (u, mu+h)
  // y = (-2(u-p)x + (m^2+1)u^2 + 2mhu + h^2-p^2-q^2)/(2mu + 2(h-q))

  //equation of perpendicular bisector between (p,q) and (k, v)
  //y = (-2(k-p)x + (v^2 + k^2-p^2-q^2))/2(v-q)

  // if the two bisectors are the same line,
  // then the gradients and intersections of both lines are equal

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

    var a1 = m1*m1 + 1;
    var b1 = 2*m1*h1;
    var c1 = h1*h1 - p1*p1 - q1*q1;
    //var d1 = 2*m1;
    //var e1 = 2*(h1 - q1);

    var a2 = m2*m2 + 1;
    var b2 = 2*m2*h2;
    var c2 =  h2*h2 - p2*p2 - q2*q2;
    //var d2 = 2*m2;
    //var e2 = 2*(h2 - q2);

    //rearrange 1 to express u1 in terms of u2
    //u1 = (a0u2+b0)/(c0u2+d0)
    //where
    //a0 = m2p1-(q1-h1)
    //b0 = p2(q1-h1)-p1(q2-h2)
    //c0= m2-m1
    //d0= m1p2-(q2-h2)
    var a0 = m2*p1 + (h1 - q1);
    var b0 = p1*(h2 - q2) - p2*(h1 - q1);
    var c0 = m2 - m1;
    var d0 = m1*p2 + (h2 - q2);

    var z = m1*p1 + (h1 - q1);
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
      var p3 = p1;
      p1 = p2;
      p2 = p3;
      var q3 = q1;
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

  var a3 = a1*a0*a0 + b1*a0*c0 + c1*c0*c0;
  var b3 = 2*a1*a0*b0 + b1*(a0*d0 + b0*c0) + 2*c1*c0*d0;
  var c3 = a1*b0*b0 + b1*b0*d0 + c1*d0*d0;
  //var d3 = d2*c0*z
  //var e3 = (d2*d0 + e2*c0)*z;
  //var f3 = e2*d0*z;

  //rearrange to gain the following quartic
  //5: (d2x+e2)(a4x^3+b4x^2+c4x+d) = 0
  //where
  //a4 = a2c0z
  //b4 = (a2d0+b2c0)z-a3
  //c4 = (b2d0+c2c0)z-b3
  //d4 = c2d0z-c3

  var a4 = a2*c0*z;
  var b4 = (a2*d0 + b2*c0) * z - a3;
  var c4 = (b2*d0 + c2*c0) * z - b3;
  var d4 =  c2*d0*z - c3;

  //find the roots
  var roots = solveCubic(a4,b4,c4,d4);

  var solutions = [];
  if (roots != undefined && roots.length > 0) {
    for (var i = 0; i < roots.length; ++i) {
      if (m1 !== undefined && m2 !== undefined) {
        var u2 = roots[i];
        var v2 = m2*u2 + h2;
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

      //The midpoints may be the same point,
      // so cannot be used to determine the crease
      //solutions.push(this.axiom1(new M.XY((u1 + p1) / 2, (v1 + q1) / 2),
      //   new M.XY((u2 + p2) / 2, (v2 + q2) / 2)));

      if (v2 != q2) {
        //F(x) = mx + h = -((u-p)/(v-q))x +(v^2 -q^2 + u^2 - p^2)/2(v-q)
        var mF = -1*(u2 - p2)/(v2 - q2);
        var hF = (v2*v2 - q2*q2 + u2*u2 - p2*p2) / (2 * (v2 - q2));

        // solutions.push(this.axiom1(new M.XY(0, hF), new M.XY(1, mF + hF)));
        solutions.push([[0, hF], [1, mF]]);
      }
      else {
        //G(y) = k
        var kG = (u2 + p2)/2;

        // solutions.push(this.axiom1(new M.XY(kG, 0), new M.XY(kG, 1)));
        solutions.push([[kG, 0], [0, 1]]);
      }
    }
  }
  let parameters = {
    points: [pointC, pointD],
    lines: [[pointA, vecA], [pointB, vecB]]
  };
  return {
    number: 6,
    parameters,
    solutions
  };
}



// needed for axiom 6
var order, irootMax, q1, q2, S, Sr, Si, U;

const CubeRoot = function (x) {
  return (x >= 0) ? Math.pow(x, 1/3) : -Math.pow(-x, 1/3);
}

export const axiom6RefFinder = function (
  pointA, vecA, pointB, vecB, pointC, pointD
) {

  order = 0; // short     // the order of the equation
  irootMax = 0; // short    // maximum value of iroot, = ((# of roots) - 1)
  q1 = 0; // double     // used for quadratic equation solutions
  q2 = 0; // double
  S = 0; // double      // used for cubic equation solutions
  Sr = 0; // double
  Si = 0; // double
  U = 0; // double

  let results = [
    axiom6RefFinderFunc(pointA, vecA, pointB, vecB, pointC, pointD, 0),
    axiom6RefFinderFunc(pointA, vecA, pointB, vecB, pointC, pointD, 1),
    axiom6RefFinderFunc(pointA, vecA, pointB, vecB, pointC, pointD, 2)
  ];
  return results.filter(c => c != null);
}

export const axiom6RefFinderFunc = function (
  pointA, vecA, pointB, vecB, pointC, pointD, iroot
) {

  let pA = Args.get_vector(pointA);
  let pB = Args.get_vector(pointB);
  let pC = Args.get_vector(pointC);
  let pD = Args.get_vector(pointD);
  let vA = Args.get_vector(vecA);
  let vB = Args.get_vector(vecB);

  let p1 = pC;
  let l1 = math.line(pA, vA);
  let u1 = [-vA[1], vA[0]];
  let d1 = l1.nearestPoint(0,0).magnitude;
  let p2 = pD;
  let l2 = math.line(pB, vB);
  let u2 = [-vB[1], vB[0]]
  let d2 = l2.nearestPoint(0,0).magnitude;

  if (math.core.dot(u1,l1.nearestPoint(0,0)) < 0) {
    u1 = [vA[1], -vA[0]];
  }
  if (math.core.dot(u2,l2.nearestPoint(0,0)) < 0) {
    u2 = [vB[1], -vB[0]];
  }

  let u1p = [u1[1], -u1[0]]; // 90deg

  // todo these might be broke
  // if (l1.nearestPoint(p1).distanceTo(p1) < math.core.EPSILON) {
  //  return;
  // }
  // if (l2.nearestPoint(p2).distanceTo(p2) < math.core.EPSILON) {
  //  return;
  // }
  
  // if ((p1 == p2) || (l1 == l2)) return;
  if (Math.abs(p1[0] - p2[0]) < math.core.EPSILON &&
      Math.abs(p1[1] - p2[1]) < math.core.EPSILON) { return; }
  // todo, check if line 1 is equivalent to line 2
  
  let rc = 0;
  switch (iroot) {
    case 0:
      // let v1b = [d1*u1[0], d1*u1[1]];
      // let v1c = [2*p2[0], 2*p2[1]];
      // let v1 = [p1[0] + v1b[0] - v1c[0], p1[1] + v1b[1] - v1c[1]];
      // let v2 = [
      //  d1 * u1[0] - p1[0],
      //  d1 * u1[1] - p1[1]
      // ];
      let v1 = [
        p1[0] + d1 * u1[0] - 2 * p2[0],
        p1[1] + d1 * u1[1] - 2 * p2[1]
      ];
      let v2 = [
        d1 * u1[0] - p1[0],
        d1 * u1[1] - p1[1]
      ];

      let c1 = math.core.dot(p2, u2) - d2;
      let c2 = math.core.dot(v2, u1p) * 2;
      let c3 = math.core.dot(v2, v2);
      let c4 = math.core.dot(v1.map((_,i) => v1[i]+v2[i]), u1p);
      let c5 = math.core.dot(v1, v2);
      let c6 = math.core.dot(u1p, u2);
      let c7 = math.core.dot(v2, u2);

      // the equation is a * r^3 + b * r^2 + c * r + d == 0
      let a = c6;
      let b = c1 + c4 * c6 + c7;
      let c = c1 * c2 + c5 * c6 + c4 * c7;
      let d = c1 * c3 + c5 * c7;
  
      if (Math.abs(a) > math.core.EPSILON) { order = 3; }
      else if (Math.abs(b) > math.core.EPSILON) { order = 2; }
      else if (Math.abs(c) > math.core.EPSILON) { order = 1; }
      else { order = 0; }
      
      switch(order) {
        case 0: return;
        case 1: rc = -d / c; break;
        case 2:
          let disc = Math.pow(c, 2) - 4 * b * d;
          q1 = -c / (2 * b);
          if (disc < 0) {
            irootMax = -1;
            return;
          }
          else if (Math.abs(disc) < math.core.EPSILON) {
            irootMax = 0;
            rc = q1;
          }
          else {
            irootMax = 1;
            q2 = Math.sqrt(disc) / (2 * b);
            rc = q1 + q2;
          }
          break;
        case 3:
            let a2 = b / a;
            let a1 = c / a;
            let a0 = d / a;
            let Q = (3 * a1 - Math.pow(a2, 2)) / 9;
            let R = (9 * a2 * a1 - 27 * a0 - 2 * Math.pow(a2, 3)) / 54;
            let D = Math.pow(Q, 3) + Math.pow(R, 2);
            U = -a2 / 3;
            // todo, are these relying on C++ integer division?
            if (D > 0) {
              irootMax = 0;
              let rD = Math.sqrt(D);
              S = CubeRoot(R + rD);
              let T = CubeRoot(R - rD);
              rc = U + S + T;
            }
            else if (Math.abs(D) < math.core.EPSILON) {
              irootMax = 1;
              S = Math.pow(R, 1/3);
              rc = U + 2 * S;
            }
            else {
              irootMax = 2;
              let rD = Math.sqrt(-D);
              let phi = Math.atan2(rD, R) / 3;
              let rS = Math.pow(Math.pow(R, 2) - D, 1/6);
              Sr = rS * Math.cos(phi);
              Si = rS * Math.sin(phi);
              rc = U + 2 * Sr;
            }
          break;
        }
      break;
    case 1:
      if (irootMax < 1) { return; }
      switch(order) {
        case 2:
          rc = q1 - q2;
          break;
        case 3:
          if (irootMax === 1) { rc = U - S; }
          else { rc = U - Sr - Math.sqrt(3) * Si; }
          break;
      }
      break;
    case 2:
      if (irootMax < 2) return;
      switch(order) {
        case 3:
          rc = U - Sr + Math.sqrt(3) * Si;
          break;
      }
      break;
  }

  let p1p = [
    d1 * u1[0] + rc * u1p[0],
    d1 * u1[1] + rc * u1p[1]
  ];

  //if (p1p == p1) return;   // we only consider p1 off of the fold line

  let l_u = math.core.normalize([p1p[0]-p1[0], p1p[1]-p1[1]]);
  let l_d = math.core.dot(l_u, math.core.midpoint(p1p, p1));

  let creasePoint = [l_d * l_u[0], l_d * l_u[1]];
  let creaseVector = [-l_u[1], l_u[0]];

  return [creasePoint, creaseVector];

/*

  // Validate; the images of p1 and p2 must lie within the square.
  let p2p = [
    p2[0] + 2 * (l_d - math.core.dot(p2, l_u)) * l_u[0],
    p2[1] + 2 * (l_d - math.core.dot(p2, l_u)) * l_u[1]
  ];
  // if (!ReferenceFinder::sPaper.Encloses(p1p) || 
  //  !ReferenceFinder::sPaper.Encloses(p2p)) return;
  
  // Validate visibility; we require that the alignment be visible even with
  // opaque paper. Meaning that the moving parts must be edge points or edge
  // lines.
  
  // Note whether p1 and p2 are on the same side of the fold line. If they are,
  // then either both points move or both lines move. If they're not, then one
  // of each moves.

  bool sameSide = ((p1.Dot(l.u) - l.d) * (p2.Dot(l.u) - l.d) >= 0);
  
  // Note which points and lines are on the edge of the paper
  bool p1edge = rm1->IsOnEdge();
  bool p2edge = rm2->IsOnEdge();
  bool l1edge = rl1->IsOnEdge();
  bool l2edge = rl2->IsOnEdge();
  
  // Now, check the visibility of this alignment and use it to specify which
  // parts move
  if (ReferenceFinder::sVisibilityMatters) {
    if (sameSide)
      if (p1edge && p2edge) mWhoMoves = WHOMOVES_P1P2;
      else if (l1edge && l2edge) mWhoMoves = WHOMOVES_L1L2;
      else return;
    else
      if (p1edge && l2edge) mWhoMoves = WHOMOVES_P1L2;
      else if (p2edge && l1edge) mWhoMoves = WHOMOVES_P2L1;
      else return;
  }
  else {
    if (sameSide) mWhoMoves = WHOMOVES_P1P2;
    else mWhoMoves = WHOMOVES_P1L2;
  };
  
  // If this line creates a skinny flap, we won't use it.
  if (ReferenceFinder::sPaper.MakesSkinnyFlap(l)) return;
  
  // Set the key.
  FinishConstructor();
*/
}

