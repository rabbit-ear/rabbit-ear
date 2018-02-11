// planarGraph.js
// a planar graph data structure containing edges and vertices in 2D space
// mit open source license, robby kraft
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="graph.ts"/>
/////////////////////////////////////
"use strict";
var EPSILON_LOW = 0.003;
var EPSILON = 0.00001;
var EPSILON_HIGH = 0.00000001;
var EPSILON_UI = 0.05; // user tap, based on precision of a finger on a screen
var EPSILON_COLLINEAR = EPSILON_LOW; //Math.PI * 0.001; // what decides 2 similar angles
//////////////////////////// TYPE CHECKING //////////////////////////// 
function isValidPoint(point) { return (point !== undefined && !isNaN(point.x) && !isNaN(point.y)); }
function isValidNumber(n) { return (n !== undefined && !isNaN(n) && !isNaN(n)); }
/////////////////////////////// NUMBERS ///////////////////////////////
/** map a number from one range into another */
function map(input, fl1, ceil1, fl2, ceil2) {
    return ((input - fl1) / (ceil1 - fl1)) * (ceil2 - fl2) + fl2;
}
/** are 2 numbers similar to each other within an epsilon range. */
function epsilonEqual(a, b, epsilon) {
    if (epsilon === undefined) {
        epsilon = EPSILON_HIGH;
    }
    return (Math.abs(a - b) < epsilon);
}
// if number is within epsilon range of a whole number, remove the floating point noise.
//  example: turns 0.999999989764 into 1.0
function wholeNumberify(num) {
    if (Math.abs(Math.round(num) - num) < EPSILON_HIGH) {
        num = Math.round(num);
    }
    return num;
}
/////////////////////////////// ARRAYS /////////////////////////////// 
function flatMap(array, mapFunc) {
    return array.reduce(function (cumulus, next) { return mapFunc(next).concat(cumulus); }, []);
}
/** all values in an array are equivalent based on !== comparison */
function allEqual(args) {
    for (var i = 1; i < args.length; i++) {
        if (args[i] !== args[0])
            return false;
    }
    return true;
}
/** does an array contain an object, based on reference comparison */
function arrayContainsObject(array, object) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === object) {
            return true;
        }
    }
    return false;
}
function arrayRemoveDuplicates(array, compFunction) {
    if (array.length <= 1)
        return array;
    for (var i = 0; i < array.length - 1; i++) {
        for (var j = array.length - 1; j > i; j--) {
            if (compFunction(array[i], array[j])) {
                array.splice(j, 1);
            }
        }
    }
    return array;
}
// this will return the index of the object in the array, or undefined if not found
function arrayContains(array, object, compFunction) {
    for (var i = 0; i < array.length; i++) {
        if (compFunction(array[i], object) === true) {
            return i;
        }
    }
    return undefined;
}
/////////////////////////////////////////////////////////////////////////////////
//                            2D ALGORITHMS
/////////////////////////////////////////////////////////////////////////////////
/** if points are all collinear, checks if point lies on line segment 'ab' */
function onSegment(point, a, b, epsilon) {
    if (epsilon === undefined) {
        epsilon = EPSILON;
    }
    var a_b = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    var p_a = Math.sqrt(Math.pow(point.x - a.x, 2) + Math.pow(point.y - a.y, 2));
    var p_b = Math.sqrt(Math.pow(point.x - b.x, 2) + Math.pow(point.y - b.y, 2));
    return (Math.abs(a_b - (p_a + p_b)) < epsilon);
}
/** There are 2 interior angles between 2 absolute angle measurements, from A to B, return the clockwise one
 * @param {number} angle in radians
 * @param {number} angle in radians
 * @returns {number} clockwise interior angle (from a to b) in radians
 */
function clockwiseInteriorAngleRadians(a, b) {
    // this is on average 50 to 100 times faster than clockwiseInteriorAngle
    while (a < 0) {
        a += Math.PI * 2;
    }
    while (b < 0) {
        b += Math.PI * 2;
    }
    var a_b = a - b;
    if (a_b >= 0)
        return a_b;
    return Math.PI * 2 - (b - a);
}
///////////////
function clockwiseInteriorAngle(a, b) {
    // this is on average 50 to 100 slower faster than clockwiseInteriorAngleRadians
    var dotProduct = b.x * a.x + b.y * a.y;
    var determinant = b.x * a.y - b.y * a.x;
    var angle = Math.atan2(determinant, dotProduct);
    if (angle < 0) {
        angle += Math.PI * 2;
    }
    return angle;
}
/** There are 2 interior angles between 2 vectors, return both, always the smaller first
 * @param {XY} vector
 * @returns {number[]} 2 angle measurements between vectors
 */
function interiorAngles(a, b) {
    var interior1 = clockwiseInteriorAngle(a, b);
    // we don't need to run atan2 again..
    // var interior2 = clockwiseInteriorAngle(b, a);
    var interior2 = Math.PI * 2 - interior1;
    if (interior1 < interior2)
        return [interior1, interior2];
    return [interior2, interior1];
}
/** This bisects 2 vectors, returning both smaller and larger outside angle bisections [small,large]
 * @param {XY} vector
 * @returns {XY[]} 2 vector angle bisections, the smaller interior angle is always first
 */
function bisect(a, b) {
    a = a.normalize();
    b = b.normalize();
    return [new XY(a.x + b.x, a.y + b.y).normalize(),
        new XY(-a.x + -b.x, -a.y + -b.y).normalize()];
}
function linesParallel(p0, p1, p2, p3, epsilon) {
    if (epsilon === undefined) {
        epsilon = EPSILON;
    }
    // p0-p1 is first line, p2-p3 is second line
    var u = new XY(p1.x - p0.x, p1.y - p0.y);
    var v = new XY(p3.x - p2.x, p3.y - p2.y);
    return (Math.abs(u.dot(v.rotate90())) < epsilon);
}
function minDistBetweenPointLine(a, b, point) {
    // (a)-(b) define the line
    var p = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    var u = ((point.x - a.x) * (b.x - a.x) + (point.y - a.y) * (b.y - a.y)) / (Math.pow(p, 2));
    if (u < 0 || u > 1.0) {
        return undefined;
    }
    return new XY(a.x + u * (b.x - a.x), a.y + u * (b.y - a.y));
}
function rayLineSegmentIntersection(rayOrigin, rayDirection, point1, point2) {
    var v1 = new XY(rayOrigin.x - point1.x, rayOrigin.y - point1.y);
    var vLineSeg = new XY(point2.x - point1.x, point2.y - point1.y);
    var vRayPerp = new XY(-rayDirection.y, rayDirection.x);
    var dot = vLineSeg.x * vRayPerp.x + vLineSeg.y * vRayPerp.y;
    if (Math.abs(dot) < EPSILON) {
        return undefined;
    }
    var cross = (vLineSeg.x * v1.y - vLineSeg.y * v1.x);
    var t1 = cross / dot;
    var t2 = (v1.x * vRayPerp.x + v1.y * vRayPerp.y) / dot;
    if (t1 >= 0.0 && (t2 >= 0.0 && t2 <= 1.0)) {
        return new XY(rayOrigin.x + rayDirection.x * t1, rayOrigin.y + rayDirection.y * t1);
    }
}
function lineIntersectionAlgorithm(p0, p1, p2, p3) {
    // p0-p1 is first line, p2-p3 is second line
    var rise1 = (p1.y - p0.y);
    var run1 = (p1.x - p0.x);
    var rise2 = (p3.y - p2.y);
    var run2 = (p3.x - p2.x);
    var denom = run1 * rise2 - run2 * rise1;
    // var denom = l1.u.x * l2.u.y - l1.u.y * l2.u.x;
    if (denom == 0) {
        return undefined;
    }
    // return XY((l1.d * l2.u.y - l2.d * l1.u.y) / denom, (l2.d * l1.u.x - l1.d * l2.u.x) / denom);
    var s02 = { 'x': p0.x - p2.x, 'y': p0.y - p2.y };
    var t = (run2 * s02.y - rise2 * s02.x) / denom;
    return new XY(p0.x + (t * run1), p0.y + (t * rise1));
}
function lineSegmentIntersectionAlgorithm(p, p2, q, q2) {
    var r = new XY(p2.x - p.x, p2.y - p.y);
    var s = new XY(q2.x - q.x, q2.y - q.y);
    var uNumerator = (new XY(q.x - p.x, q.y - p.y)).cross(r); //crossProduct(subtractPoints(q, p), r);
    var denominator = r.cross(s);
    if (onSegment(p, q, q2)) {
        return p;
    }
    if (onSegment(p2, q, q2)) {
        return p2;
    }
    if (onSegment(q, p, p2)) {
        return q;
    }
    if (onSegment(q2, p, p2)) {
        return q2;
    }
    if (Math.abs(uNumerator) < EPSILON_HIGH && Math.abs(denominator) < EPSILON_HIGH) {
        // collinear
        // Do they overlap? (Are all the point differences in either direction the same sign)
        if (!allEqual([(q.x - p.x) < 0, (q.x - p2.x) < 0, (q2.x - p.x) < 0, (q2.x - p2.x) < 0]) ||
            !allEqual([(q.y - p.y) < 0, (q.y - p2.y) < 0, (q2.y - p.y) < 0, (q2.y - p2.y) < 0])) {
            return undefined;
        }
        // Do they touch? (Are any of the points equal?)
        if (p.equivalent(q)) {
            return new XY(p.x, p.y);
        }
        if (p.equivalent(q2)) {
            return new XY(p.x, p.y);
        }
        if (p2.equivalent(q)) {
            return new XY(p2.x, p2.y);
        }
        if (p2.equivalent(q2)) {
            return new XY(p2.x, p2.y);
        }
    }
    if (Math.abs(denominator) < EPSILON_HIGH) {
        // parallel
        return undefined;
    }
    var u = uNumerator / denominator;
    var t = (new XY(q.x - p.x, q.y - p.y)).cross(s) / denominator;
    if ((t >= 0) && (t <= 1) && (u >= 0) && (u <= 1)) {
        return new XY(p.x + r.x * t, p.y + r.y * t);
    }
}
function circleLineIntersectionAlgorithm(center, radius, p0, p1) {
    var r_squared = Math.pow(radius, 2);
    var x1 = p0.x - center.x;
    var y1 = p0.y - center.y;
    var x2 = p1.x - center.x;
    var y2 = p1.y - center.y;
    var dx = x2 - x1;
    var dy = y2 - y1;
    var dr_squared = dx * dx + dy * dy;
    var D = x1 * y2 - x2 * y1;
    function sgn(x) { if (x < 0) {
        return -1;
    } return 1; }
    var x1 = (D * dy + sgn(dy) * dx * Math.sqrt(r_squared * dr_squared - (D * D))) / (dr_squared);
    var x2 = (D * dy - sgn(dy) * dx * Math.sqrt(r_squared * dr_squared - (D * D))) / (dr_squared);
    var y1 = (-D * dx + Math.abs(dy) * Math.sqrt(r_squared * dr_squared - (D * D))) / (dr_squared);
    var y2 = (-D * dx - Math.abs(dy) * Math.sqrt(r_squared * dr_squared - (D * D))) / (dr_squared);
    var intersections = [];
    if (!isNaN(x1)) {
        intersections.push(new XY(x1 + center.x, y1 + center.y));
    }
    if (!isNaN(x2)) {
        intersections.push(new XY(x2 + center.x, y2 + center.y));
    }
    return intersections;
}
function convexHull(points) {
    // validate input
    if (points === undefined || points.length === 0) {
        return [];
    }
    // # points in the convex hull before escaping function
    var INFINITE_LOOP = 10000;
    // sort points by x and y
    var sorted = points.sort(function (a, b) {
        if (a.x - b.x < -EPSILON_HIGH) {
            return -1;
        }
        if (a.x - b.x > EPSILON_HIGH) {
            return 1;
        }
        if (a.y - b.y < -EPSILON_HIGH) {
            return -1;
        }
        if (a.y - b.y > EPSILON_HIGH) {
            return 1;
        }
        return 0;
    });
    var hull = [];
    hull.push(sorted[0]);
    // the current direction the perimeter walker is facing
    var ang = 0;
    var infiniteLoop = 0;
    do {
        infiniteLoop++;
        var h = hull.length - 1;
        var angles = sorted
            .filter(function (el) {
            return !(epsilonEqual(el.x, hull[h].x, EPSILON_HIGH) && epsilonEqual(el.y, hull[h].y, EPSILON_HIGH));
        })
            .map(function (el) {
            var angle = Math.atan2(hull[h].y - el.y, hull[h].x - el.x);
            while (angle < ang) {
                angle += Math.PI * 2;
            }
            return { node: el, angle: angle, distance: undefined };
        }) // distance to be set later
            .sort(function (a, b) { return (a.angle < b.angle) ? -1 : (a.angle > b.angle) ? 1 : 0; });
        if (angles.length === 0) {
            return [];
        }
        // narrowest-most right turn
        var rightTurn = angles[0];
        // collect all other points that are collinear along the same ray
        angles = angles.filter(function (el) { return epsilonEqual(rightTurn.angle, el.angle, EPSILON_LOW); })
            .map(function (el) {
            var distance = Math.sqrt(Math.pow(hull[h].x - el.node.x, 2) + Math.pow(hull[h].y - el.node.y, 2));
            el.distance = distance;
            return el;
        })
            .sort(function (a, b) { return (a.distance < b.distance) ? 1 : (a.distance > b.distance) ? -1 : 0; });
        // (OPTION 2) include all collinear points along the hull
        // .sort(function(a,b){return (a.distance < b.distance)?-1:(a.distance > b.distance)?1:0});
        // if the point is already in the convex hull, we've made a loop. we're done
        if (arrayContainsObject(hull, angles[0].node)) {
            return hull;
        }
        // add point to hull, prepare to loop again
        hull.push(angles[0].node);
        // update walking direction with the angle to the new point
        ang = Math.atan2(hull[h].y - angles[0].node.y, hull[h].x - angles[0].node.x);
    } while (infiniteLoop < INFINITE_LOOP);
    return [];
}
/////////////////////////////////////////////////////////////////////////////////
//                                GEOMETRY
/////////////////////////////////////////////////////////////////////////////////
var XY = (function () {
    function XY(x, y) {
        this.x = x;
        this.y = y;
    }
    XY.prototype.values = function () { return [this.x, this.y]; };
    // position(x:number, y:number):XY{ this.x = x; this.y = y; return this; }
    // translated(dx:number, dy:number):XY{ this.x += dx; this.y += dy; return this;}
    XY.prototype.normalize = function () { var m = this.magnitude(); return new XY(this.x / m, this.y / m); };
    XY.prototype.rotate90 = function () { return new XY(-this.y, this.x); };
    XY.prototype.rotate = function (origin, angle) {
        // TODO: needs testing
        return this.transform(new Matrix().rotation(angle, origin));
        // var dx = this.x-origin.x;
        // var dy = this.y-origin.y;
        // var radius = Math.sqrt( Math.pow(dy, 2) + Math.pow(dx, 2) );
        // var currentAngle = Math.atan2(dy, dx);
        // return new XY(origin.x + radius*Math.cos(currentAngle + angle),
        // 			  origin.y + radius*Math.sin(currentAngle + angle));
    };
    XY.prototype.dot = function (point) { return this.x * point.x + this.y * point.y; };
    XY.prototype.cross = function (vector) { return this.x * vector.y - this.y * vector.x; };
    XY.prototype.magnitude = function () { return Math.sqrt(this.x * this.x + this.y * this.y); };
    XY.prototype.distanceTo = function (a) { return Math.sqrt(Math.pow(this.x - a.x, 2) + Math.pow(this.y - a.y, 2)); };
    XY.prototype.equivalent = function (point, epsilon) {
        if (epsilon == undefined) {
            epsilon = EPSILON_HIGH;
        }
        // rect bounding box, cheaper than radius calculation
        return (epsilonEqual(this.x, point.x, epsilon) && epsilonEqual(this.y, point.y, epsilon));
    };
    XY.prototype.transform = function (matrix) {
        return new XY(this.x * matrix.a + this.y * matrix.c + matrix.tx, this.x * matrix.b + this.y * matrix.d + matrix.ty);
    };
    XY.prototype.lerp = function (point, pct) {
        var inv = 1.0 - pct;
        return new XY(this.x * pct + point.x * inv, this.y * pct + point.y * inv);
    };
    /** reflects this point about a line that passes through 'a' and 'b' */
    XY.prototype.reflect = function (a, b) {
        return this.transform(new Matrix().reflection(a, b));
    };
    XY.prototype.scale = function (magnitude) { return new XY(this.x * magnitude, this.y * magnitude); };
    XY.prototype.subtract = function (sub) { return new XY(this.x - sub.x, this.y - sub.y); };
    return XY;
}());
var Rect = (function () {
    function Rect(x, y, width, height) {
        this.topLeft = { 'x': x, 'y': y };
        this.size = { 'width': width, 'height': height };
    }
    return Rect;
}());
/** This is a 2x3 matrix: 2x2 for scale and rotation and 2x1 for translation */
var Matrix = (function () {
    function Matrix(a, b, c, d, tx, ty) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
        if (a === undefined) {
            this.a = 1;
        }
        if (b === undefined) {
            this.b = 0;
        }
        if (c === undefined) {
            this.c = 0;
        }
        if (d === undefined) {
            this.d = 1;
        }
        if (tx === undefined) {
            this.tx = 0;
        }
        if (ty === undefined) {
            this.ty = 0;
        }
    }
    /** Sets this to be the identity matrix */
    Matrix.prototype.identity = function () { this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.tx = 0; this.ty = 0; };
    /** Returns a new matrix that is the sum of this and the argument. Will not change this or the argument
     * @returns {Matrix}
     */
    Matrix.prototype.mult = function (mat) {
        var r = new Matrix();
        r.a = this.a * mat.a + this.c * mat.b;
        r.c = this.a * mat.c + this.c * mat.d;
        r.tx = this.a * mat.tx + this.c * mat.ty + this.tx;
        r.b = this.b * mat.a + this.d * mat.b;
        r.d = this.b * mat.c + this.d * mat.d;
        r.ty = this.b * mat.tx + this.d * mat.ty + this.ty;
        return r;
    };
    /** Calculates the matrix representation of a reflection across a line
     * @returns {Matrix}
     */
    Matrix.prototype.reflection = function (a, b) {
        var angle = Math.atan2(b.y - a.y, b.x - a.x);
        this.a = Math.cos(angle) * Math.cos(-angle) + Math.sin(angle) * Math.sin(-angle);
        this.b = Math.cos(angle) * -Math.sin(-angle) + Math.sin(angle) * Math.cos(-angle);
        this.c = Math.sin(angle) * Math.cos(-angle) + -Math.cos(angle) * Math.sin(-angle);
        this.d = Math.sin(angle) * -Math.sin(-angle) + -Math.cos(angle) * Math.cos(-angle);
        this.tx = a.x + this.a * -a.x + -a.y * this.c;
        this.ty = a.y + this.b * -a.x + -a.y * this.d;
        return this;
    };
    Matrix.prototype.rotation = function (angle, origin) {
        this.a = Math.cos(angle);
        this.c = -Math.sin(angle);
        this.b = Math.sin(angle);
        this.d = Math.cos(angle);
        if (origin != undefined) {
            this.tx = origin.x;
            this.ty = origin.y;
        }
        return this;
    };
    /** Deep-copy the Matrix and return it as a new object
     * @returns {Matrix}
     */
    Matrix.prototype.copy = function () {
        var m = new Matrix();
        m.a = this.a;
        m.c = this.c;
        m.tx = this.tx;
        m.b = this.b;
        m.d = this.d;
        m.ty = this.ty;
        return m;
    };
    return Matrix;
}());
/////////////////////////////////////////////////////////////////////////////////
//                            PLANAR GRAPH PARTS
/////////////////////////////////////////////////////////////////////////////////
// class AdjacentNodes{
// 	// node adjacent to node, with angle offset and connecting edge
// 	parent:PlanarNode;  // "first" node, polarity required for angle calculation
// 	node:PlanarNode;
// 	angle:number; // radians, angle from parent to node
// 	edge:PlanarEdge;  // edge connecting the two nodes
// 	constructor(parent:PlanarNode, node:PlanarNode, edge:PlanarEdge){
// 		this.node = node;
// 		this.angle = Math.atan2(node.y-parent.y, node.x-parent.x);
// 		this.edge = edge;
// 		// optional
// 		this.parent = parent;
// 	}
// }
// class AdjacentFace{
// 	face:PlanarFace;
// 	parentEdge:PlanarEdge; // edge connecting to parent
// 	adjacent:AdjacentFace[];
// 	constructor(face:PlanarFace){
// 		this.face = face;
// 		this.adjacent = [];
// 	}
// }
/** walk from node1 to node2, continue always making right-most inner angle turn.
 */
function findClockwiseCircut(node1, node2) {
    if (node1 === undefined || node2 === undefined) {
        return undefined;
    }
    var incidentEdge = node1.graph.getEdgeConnectingNodes(node1, node2);
    if (incidentEdge == undefined) {
        return undefined;
    } // nodes are not adjacent
    var pairs = [];
    var lastNode = node1;
    var travelingNode = node2;
    var visitedList = [lastNode];
    var nextWalk = incidentEdge;
    pairs.push(nextWalk);
    do {
        visitedList.push(travelingNode);
        var travelingNodeJunction = travelingNode.junction();
        if (travelingNodeJunction !== undefined) {
            nextWalk = travelingNodeJunction.clockwiseEdge(nextWalk);
        }
        pairs.push(nextWalk);
        lastNode = travelingNode;
        travelingNode = nextWalk.otherNode(lastNode);
        if (travelingNode === node1) {
            return pairs;
        }
    } while (!arrayContainsObject(visitedList, travelingNode));
    return undefined;
}
var EdgeIntersection = (function (_super) {
    __extends(EdgeIntersection, _super);
    function EdgeIntersection(otherEdge, intersectionX, intersectionY) {
        var _this = _super.call(this, intersectionX, intersectionY) || this;
        _this.edge = otherEdge;
        return _this;
    }
    return EdgeIntersection;
}(XY));
/** a PlanarJoint is defined by 2 unique edges and 3 nodes (one common, 2 endpoints)
 *  clockwise order is required
 *  the interior angle is measured clockwise from the 1st edge (edge[0]) to the 2nd
 */
var PlanarJoint = (function () {
    // angle clockwise from edge 0 to edge 1 is in index 0. edge 1 to 0 is in index 1
    // angle:number;// this should be a function
    // set autoSortBySmaller to "discover" the clockwise orientation- setting the smaller interior angle 
    function PlanarJoint(edge1, edge2, autoSortBySmaller) {
        this.node = edge1.commonNodeWithEdge(edge2);
        if (this.node === undefined) {
            return;
        }
        if (edge1 === edge2) {
            return;
        }
        // make sure we are storing clockwise from A->B the smaller interior angle
        var a = edge1, b = edge2;
        if (autoSortBySmaller !== undefined && autoSortBySmaller === true) {
            var interior1 = clockwiseInteriorAngleRadians(a.absoluteAngle(), b.absoluteAngle());
            var interior2 = clockwiseInteriorAngleRadians(b.absoluteAngle(), a.absoluteAngle());
            if (interior2 < interior1) {
                b = edge1;
                a = edge2;
            }
        }
        this.edges = [a, b];
        this.endNodes = [
            (a.nodes[0] === this.node) ? a.nodes[1] : a.nodes[0],
            (b.nodes[0] === this.node) ? b.nodes[1] : b.nodes[0]
        ];
    }
    PlanarJoint.prototype.vectors = function () {
        return this.edges.map(function (el) { return el.vector(this.node); }, this);
    };
    PlanarJoint.prototype.angle = function () {
        var vectors = this.vectors();
        return clockwiseInteriorAngle(vectors[0], vectors[1]);
    };
    PlanarJoint.prototype.bisect = function () {
        // var vectors = this.vectors();
        // return bisect(vectors[0], vectors[1])[0];
        var absolute1 = this.edges[0].absoluteAngle(this.node);
        var absolute2 = this.edges[1].absoluteAngle(this.node);
        while (absolute1 < 0) {
            absolute1 += Math.PI * 2;
        }
        var interior = clockwiseInteriorAngleRadians(absolute1, absolute2);
        var bisected = absolute1 - interior * 0.5;
        return new XY(Math.cos(bisected), Math.sin(bisected));
    };
    // todo: needs testing
    PlanarJoint.prototype.subsectAngle = function (divisions) {
        if (divisions === undefined || divisions < 1) {
            throw "subsetAngle() requires a parameter greater than 1";
        }
        var angleA = this.edges[0].absoluteAngle(this.node);
        var angleB = this.edges[1].absoluteAngle(this.node);
        var interiorA = clockwiseInteriorAngleRadians(angleA, angleB);
        var results = [];
        for (var i = 1; i < divisions; i++) {
            results.push(angleA - interiorA * (1.0 / divisions) * i);
        }
        return results;
    };
    PlanarJoint.prototype.equivalent = function (a) {
        return ((a.edges[0].isSimilarToEdge(this.edges[0]) && a.edges[1].isSimilarToEdge(this.edges[1])) ||
            (a.edges[0].isSimilarToEdge(this.edges[1]) && a.edges[1].isSimilarToEdge(this.edges[0])));
    };
    // (private function)
    PlanarJoint.prototype.sortByClockwise = function () { };
    return PlanarJoint;
}());
var PlanarJunction = (function () {
    // Planar Junction is invalid if the node is either isolated or a leaf node
    //  javascript constructors can't return null. if invalid: edges = [], joints = []
    function PlanarJunction(node) {
        this.node = node;
        this.joints = [];
        this.edges = [];
        var adjEdges = this.node.adjacentEdges();
        // Junctions by definition cannot be built on leaf nodes. there is only 1 edge.
        if (adjEdges.length <= 1) {
            return;
        }
        var sortedEdges = adjEdges
            .map(function (el) {
            var otherNode = el.otherNode(this.node);
            return { 'edge': el, 'angle': Math.atan2(otherNode.y - this.node.y, otherNode.x - this.node.x) };
        }, this)
            .sort(function (a, b) { return (a.angle < b.angle) ? 1 : (a.angle > b.angle) ? -1 : 0; })
            .map(function (el) { return el.edge; });
        this.joints = sortedEdges.map(function (el, i) {
            var nexti = (i + 1) % sortedEdges.length;
            return new PlanarJoint(el, sortedEdges[nexti]);
        });
        this.edges = this.joints.map(function (el) { return el.edges[0]; });
    }
    PlanarJunction.prototype.edgeAngles = function () {
        return this.edges.map(function (el) { return el.absoluteAngle(this.node); }, this);
    };
    PlanarJunction.prototype.interiorAngles = function () {
        var absoluteAngles = this.edges.map(function (el) { return el.absoluteAngle(this.node); }, this);
        return absoluteAngles.map(function (el, i) {
            var nextI = (i + 1) % this.edges.length;
            return clockwiseInteriorAngleRadians(el, absoluteAngles[nextI]);
        }, this);
    };
    /** Locates the most clockwise adjacent node from the node supplied in the argument. If this was a clock centered at this node, if you pass in node for the number 3, it will return you the number 4.
     * @returns {PlanarNode}
     */
    PlanarJunction.prototype.clockwiseNode = function (fromNode) {
        for (var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].otherNode(this.node) === fromNode) {
                return this.edges[(i + 1) % this.edges.length].otherNode(this.node);
            }
        }
    };
    PlanarJunction.prototype.clockwiseEdge = function (fromEdge) {
        var index = this.edges.indexOf(fromEdge);
        if (index === -1) {
            return undefined;
        }
        return this.edges[(index + 1) % this.edges.length];
    };
    PlanarJunction.prototype.faces = function () {
        var adjacentFaces = [];
        for (var n = 0; n < this.edges.length; n++) {
            var circuit = findClockwiseCircut(this.node, this.edges[n].otherNode(this.node));
            var face = new PlanarFace(this.node.graph).makeFromCircuit(circuit);
            if (face !== undefined) {
                adjacentFaces.push(face);
            }
        }
        return adjacentFaces;
    };
    return PlanarJunction;
}());
var PlanarClean = (function (_super) {
    __extends(PlanarClean, _super);
    function PlanarClean(numNodes, numEdges) {
        var _this = _super.call(this) || this;
        _this.edges = { total: 0, duplicate: 0, circular: 0 };
        _this.nodes = {
            total: 0,
            isolated: 0,
            fragment: [],
            collinear: [],
            duplicate: []
        };
        if (numNodes !== undefined) {
            _this.nodes.total += numNodes;
        }
        if (numEdges !== undefined) {
            _this.edges.total += numEdges;
        }
        return _this;
    }
    PlanarClean.prototype.fragmentedNodes = function (nodes) {
        this.nodes.fragment = nodes;
        this.nodes.total += nodes.length;
        return this;
    };
    PlanarClean.prototype.collinearNodes = function (nodes) {
        this.nodes.collinear = nodes;
        this.nodes.total += nodes.length;
        return this;
    };
    PlanarClean.prototype.duplicateNodes = function (nodes) {
        this.nodes.duplicate = nodes;
        this.nodes.total += nodes.length;
        return this;
    };
    PlanarClean.prototype.join = function (report) {
        this.nodes.total += report.nodes.total;
        this.edges.total += report.edges.total;
        this.nodes.isolated += report.nodes.isolated;
        this.edges.duplicate += report.edges.duplicate;
        this.edges.circular += report.edges.circular;
        // if we are merging 2 planar clean reports, type cast this variable and check properties
        var planarReport = report;
        if (planarReport.nodes.fragment !== undefined) {
            this.nodes.fragment = this.nodes.fragment.concat(planarReport.nodes.fragment);
        }
        if (planarReport.nodes.collinear !== undefined) {
            this.nodes.collinear = this.nodes.collinear.concat(planarReport.nodes.collinear);
        }
        if (planarReport.nodes.duplicate !== undefined) {
            this.nodes.duplicate = this.nodes.duplicate.concat(planarReport.nodes.duplicate);
        }
        return this;
    };
    return PlanarClean;
}(GraphClean));
// class NearestEdgeObject {
// 	edge:PlanarEdge; 
// 	pointOnEdge:XY;
// 	distance:number;
// 	constructor(edge:PlanarEdge, pointOnEdge:XY, distance:number){
// 		this.edge = edge;
// 		this.pointOnEdge = pointOnEdge;
// 		this.distance = distance;
// 	}
// }
var PlanarNode = (function (_super) {
    __extends(PlanarNode, _super);
    function PlanarNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.junctionType = PlanarJunction;
        // jointType = PlanarJoint;
        // for speeding up algorithms, temporarily store information here
        _this.cache = {};
        return _this;
    }
    PlanarNode.prototype.adjacentFaces = function () {
        var junction = this.junction();
        if (junction === undefined) {
            return [];
        }
        return junction.faces();
    };
    /** Adjacent nodes and edges sorted clockwise around this node */
    PlanarNode.prototype.junction = function () {
        //todo: check cache for junction object
        // store this new one if doesn't exist yet
        var junction = new this.junctionType(this);
        if (junction.edges.length === 0) {
            return undefined;
        }
        return junction;
    };
    PlanarNode.prototype.interiorAngles = function () {
        return this.junction().interiorAngles();
    };
    /** Locates the most clockwise adjacent node from the node supplied in the argument. If this was a clock centered at this node, if you pass in node for the number 3, it will return you the number 4.
     * @returns {AdjacentNodes} AdjacentNodes object containing the clockwise node and the edge connecting the two.
     */
    // adjacentNodeClockwiseFrom(node:PlanarNode):AdjacentNodes{
    // 	var adjacentNodes:AdjacentNodes[] = this.planarAdjacent();
    // 	for(var i = 0; i < adjacentNodes.length; i++){
    // 		if(adjacentNodes[i].node === node){
    // 			return adjacentNodes[ ((i+1)%adjacentNodes.length) ];
    // 		}
    // 	}
    // 	return undefined;
    // }
    // implements XY
    PlanarNode.prototype.values = function () { return [this.x, this.y]; };
    // todo: probably need to break apart XY and this. this modifies the x and y in place. XY returns a new one and doesn't modify the current one in place
    PlanarNode.prototype.position = function (x, y) { this.x = x; this.y = y; return this; };
    PlanarNode.prototype.translate = function (dx, dy) { this.x += dx; this.y += dy; return this; };
    PlanarNode.prototype.normalize = function () { var m = this.magnitude(); this.x /= m; this.y /= m; return this; };
    PlanarNode.prototype.rotate90 = function () { var x = this.x; this.x = -this.y; this.y = x; return this; };
    PlanarNode.prototype.rotate = function (origin, angle) {
        var dx = this.x - origin.x;
        var dy = this.y - origin.y;
        var radius = Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2));
        var currentAngle = Math.atan2(dy, dx);
        this.x = origin.x + radius * Math.cos(currentAngle + angle);
        this.y = origin.y + radius * Math.sin(currentAngle + angle);
        return this;
    };
    PlanarNode.prototype.dot = function (point) { return this.x * point.x + this.y * point.y; };
    PlanarNode.prototype.cross = function (vector) { return this.x * vector.y - this.y * vector.x; };
    PlanarNode.prototype.magnitude = function () { return Math.sqrt(this.x * this.x + this.y * this.y); };
    PlanarNode.prototype.equivalent = function (point, epsilon) {
        if (epsilon == undefined) {
            epsilon = EPSILON_HIGH;
        }
        // rect bounding box, cheaper than radius calculation
        return (epsilonEqual(this.x, point.x, epsilon) && epsilonEqual(this.y, point.y, epsilon));
    };
    PlanarNode.prototype.transform = function (matrix) {
        var xx = this.x;
        var yy = this.y;
        this.x = xx * matrix.a + yy * matrix.c + matrix.tx;
        this.y = xx * matrix.b + yy * matrix.d + matrix.ty;
        return this;
    };
    PlanarNode.prototype.lerp = function (point, pct) {
        var inv = 1.0 - pct;
        return new XY(this.x * pct + point.x * inv, this.y * pct + point.y * inv);
    };
    /** reflects about a line that passes through 'a' and 'b' */
    PlanarNode.prototype.reflect = function (a, b) {
        return this.transform(new Matrix().reflection(a, b));
    };
    PlanarNode.prototype.distanceTo = function (a) {
        return Math.sqrt(Math.pow(this.x - a.x, 2) + Math.pow(this.y - a.y, 2));
    };
    PlanarNode.prototype.scale = function (magnitude) { this.x *= magnitude; this.y *= magnitude; return this; };
    PlanarNode.prototype.subtract = function (sub) { this.x -= sub.x; this.y -= sub.y; return this; };
    return PlanarNode;
}(GraphNode));
var PlanarEdge = (function (_super) {
    __extends(PlanarEdge, _super);
    function PlanarEdge() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlanarEdge.prototype.midpoint = function () {
        return new XY(0.5 * (this.nodes[0].x + this.nodes[1].x), 0.5 * (this.nodes[0].y + this.nodes[1].y));
    };
    PlanarEdge.prototype.length = function () { return this.nodes[0].distanceTo(this.nodes[1]); };
    // form a vector by placing one of the nodes at the origin
    PlanarEdge.prototype.vector = function (originNode) {
        var otherNode = this.otherNode(originNode);
        return new XY(otherNode.x - originNode.x, otherNode.y - originNode.y);
    };
    PlanarEdge.prototype.intersection = function (edge) {
        // todo: should intersecting adjacent edges return the point in common they have with each other?
        if (this.isAdjacentToEdge(edge)) {
            return undefined;
        }
        var intersect = lineSegmentIntersectionAlgorithm(this.nodes[0], this.nodes[1], edge.nodes[0], edge.nodes[1]);
        if (intersect == undefined) {
            return undefined;
        }
        if (intersect.equivalent(this.nodes[0]) || intersect.equivalent(this.nodes[1])) {
            return undefined;
        }
        // console.log(this.nodes[0].x + "," + this.nodes[0].y + ":" + this.nodes[1].x + "," + this.nodes[1].y + " and " + edge.nodes[0].x + "," + edge.nodes[0].y + ":" + edge.nodes[1].x + "," + edge.nodes[1].y + "  =  " + intersect.x + "," + intersect.y);
        return new EdgeIntersection(edge, intersect.x, intersect.y);
    };
    PlanarEdge.prototype.crossingEdges = function () {
        // optimize by excluding all edges outside of the quad space occupied by this edge
        var minX = (this.nodes[0].x < this.nodes[1].x) ? this.nodes[0].x : this.nodes[1].x;
        var maxX = (this.nodes[0].x > this.nodes[1].x) ? this.nodes[0].x : this.nodes[1].x;
        var minY = (this.nodes[0].y < this.nodes[1].y) ? this.nodes[0].y : this.nodes[1].y;
        var maxY = (this.nodes[0].y > this.nodes[1].y) ? this.nodes[0].y : this.nodes[1].y;
        return this.graph.edges
            .filter(function (el) {
            return !((el.nodes[0].x < minX && el.nodes[1].x < minX) ||
                (el.nodes[0].x > maxX && el.nodes[1].x > maxX) ||
                (el.nodes[0].y < minY && el.nodes[1].y < minY) ||
                (el.nodes[0].y > maxY && el.nodes[1].y > maxY));
        }, this)
            .filter(function (el) { return this !== el; }, this)
            .map(function (el) { return this.intersection(el); }, this)
            .filter(function (el) { return el != undefined; })
            .sort(function (a, b) {
            if (a.x - b.x < -EPSILON_HIGH) {
                return -1;
            }
            if (a.x - b.x > EPSILON_HIGH) {
                return 1;
            }
            if (a.y - b.y < -EPSILON_HIGH) {
                return -1;
            }
            if (a.y - b.y > EPSILON_HIGH) {
                return 1;
            }
            return 0;
        });
    };
    PlanarEdge.prototype.absoluteAngle = function (startNode) {
        // if not specified it will pick one node
        if (startNode === undefined) {
            startNode = this.nodes[1];
        }
        // measure edge as if it were a ray from one node to the other
        var endNode;
        if (startNode === this.nodes[0]) {
            endNode = this.nodes[1];
        }
        else if (startNode === this.nodes[1]) {
            endNode = this.nodes[0];
        }
        else {
            return undefined;
        }
        return Math.atan2(endNode.y - startNode.y, endNode.x - startNode.x);
    };
    PlanarEdge.prototype.adjacentFaces = function () {
        return [
            new PlanarFace(this.graph).makeFromCircuit(findClockwiseCircut(this.nodes[0], this.nodes[1])),
            new PlanarFace(this.graph).makeFromCircuit(findClockwiseCircut(this.nodes[1], this.nodes[0]))
        ]
            .filter(function (el) { return el !== undefined; });
    };
    PlanarEdge.prototype.transform = function (matrix) {
        this.nodes[0].transform(matrix);
        this.nodes[1].transform(matrix);
    };
    // returns the matrix representation form of this edge as the line of reflection
    PlanarEdge.prototype.reflectionMatrix = function () { return new Matrix().reflection(this.nodes[0], this.nodes[1]); };
    return PlanarEdge;
}(GraphEdge));
var PlanarFace = (function () {
    function PlanarFace(graph) {
        this.graph = graph;
        this.nodes = [];
        this.edges = [];
        this.angles = [];
    }
    PlanarFace.prototype.makeFromCircuit = function (circut) {
        if (circut == undefined || circut.length < 3) {
            return undefined;
        }
        this.edges = circut;
        this.nodes = circut.map(function (el, i) {
            return el.uncommonNodeWithEdge(circut[(i + 1) % circut.length]);
        });
        this.angles = [];
        // so the first node is already present, it's just in the last spot. is this okay?
        // this.nodes.unshift(circut[0].parent);
        // this.edges = circut.map(function(el){return el.edge;});
        for (var i = 0; i < this.edges.length; i++) {
            var nextI = (i + 1) % this.edges.length;
            var common = this.edges[i].commonNodeWithEdge(this.edges[nextI]);
            var angle = clockwiseInteriorAngleRadians(this.edges[i].absoluteAngle(common), this.edges[nextI].absoluteAngle(common));
            this.angles.push(angle);
            // this.angles.push(clockwiseInteriorAngleRadians(this.edges[i].angle, this.edges[(i+1)%(this.edges.length)].angle-Math.PI));
        }
        var angleSum = this.angles.reduce(function (sum, value) { return sum + value; }, 0);
        // sum of interior angles rule, (n-2) * PI
        if (this.nodes.length > 2 && epsilonEqual(angleSum / (this.nodes.length - 2), Math.PI, EPSILON)) {
            return this;
        }
        return undefined;
    };
    PlanarFace.prototype.equivalent = function (face) {
        // quick check, only verfies nodes
        if (face.nodes.length != this.nodes.length)
            return false;
        var iFace = undefined;
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[0] === face.nodes[i]) {
                iFace = i;
                break;
            }
        }
        if (iFace == undefined)
            return false;
        for (var i = 0; i < this.nodes.length; i++) {
            var iFaceMod = (iFace + i) % this.nodes.length;
            if (this.nodes[i] !== face.nodes[iFaceMod])
                return false;
        }
        return true;
    };
    PlanarFace.prototype.commonEdge = function (face) {
        // faces will have only 1 edge in common if all faces are convex
        for (var i = 0; i < this.edges.length; i++) {
            for (var j = 0; j < face.edges.length; j++) {
                if (this.edges[i] === face.edges[j]) {
                    return this.edges[i];
                }
            }
        }
    };
    PlanarFace.prototype.commonEdges = function (face) {
        // faces will have only 1 edge in common if all faces are convex
        var edges = [];
        for (var i = 0; i < this.edges.length; i++) {
            for (var j = 0; j < face.edges.length; j++) {
                if (this.edges[i] === face.edges[j]) {
                    edges.push(this.edges[i]);
                }
            }
        }
        return arrayRemoveDuplicates(edges, function (a, b) { return a === b; });
    };
    PlanarFace.prototype.uncommonEdges = function (face) {
        var edges = this.edges.slice(0);
        for (var i = 0; i < face.edges.length; i++) {
            edges = edges.filter(function (el) { return el !== face.edges[i]; });
        }
        return edges;
    };
    PlanarFace.prototype.edgeAdjacentFaces = function () {
        return this.edges.map(function (ed) {
            var allFaces = this.graph.faces.filter(function (el) { return !this.equivalent(el); }, this);
            for (var i = 0; i < allFaces.length; i++) {
                var adjArray = allFaces[i].edges.filter(function (ef) { return ed === ef; });
                if (adjArray.length > 0) {
                    return allFaces[i];
                }
            }
        }, this).filter(function (el) { return el !== undefined; });
    };
    PlanarFace.prototype.contains = function (point) {
        for (var i = 0; i < this.edges.length; i++) {
            var endpts = this.edges[i].nodes;
            var cross = (point.y - endpts[0].y) * (endpts[1].x - endpts[0].x) -
                (point.x - endpts[0].x) * (endpts[1].y - endpts[0].y);
            if (cross < 0)
                return false;
        }
        return true;
    };
    PlanarFace.prototype.transform = function (matrix) {
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].transform(matrix);
        }
    };
    return PlanarFace;
}());
var PlanarGraph = (function (_super) {
    __extends(PlanarGraph, _super);
    function PlanarGraph() {
        var _this = _super.call(this) || this;
        // When subclassed (ie. PlanarGraph) types are overwritten
        _this.nodeType = PlanarNode;
        _this.edgeType = PlanarEdge;
        _this.properties = { "optimization": 0 }; // we need something to be able to set to skip over functions
        _this.clear();
        return _this;
    }
    ///////////////////////////////////////////////
    // ADD PARTS
    ///////////////////////////////////////////////
    /** Create a new isolated planar node at x,y
     * @returns {PlanarNode} pointer to the node
     */
    PlanarGraph.prototype.newPlanarNode = function (x, y) {
        return this.newNode().position(x, y);
    };
    /** Create two new nodes each with x,y locations and an edge between them
     * @returns {PlanarEdge} pointer to the edge
     */
    PlanarGraph.prototype.newPlanarEdge = function (x1, y1, x2, y2) {
        var a = this.newNode().position(x1, y1);
        var b = this.newNode().position(x2, y2);
        return this.newEdge(a, b);
    };
    /** Create one node with an x,y location and an edge between it and an existing node
     * @returns {PlanarEdge} pointer to the edge
     */
    PlanarGraph.prototype.newPlanarEdgeFromNode = function (node, x, y) {
        var newNode = this.newNode().position(x, y);
        return this.newEdge(node, newNode);
    };
    /** Create one node with an x,y location and an edge between it and an existing node
     * @returns {PlanarEdge} pointer to the edge
     */
    PlanarGraph.prototype.newPlanarEdgeBetweenNodes = function (a, b) {
        return this.newEdge(a, b);
    };
    /** Create one node with an angle and distance away from an existing node and make an edge between them
     * @returns {PlanarEdge} pointer to the edge
     */
    PlanarGraph.prototype.newPlanarEdgeRadiallyFromNode = function (node, angle, length) {
        var newNode = this.copyNode(node)
            .translate(Math.cos(angle) * length, Math.sin(angle) * length);
        return this.newEdge(node, newNode);
    };
    ///////////////////////////////////////////////
    // REMOVE PARTS
    ///////////////////////////////////////////////
    /** Removes all nodes, edges, and faces, returning the graph to it's original state */
    PlanarGraph.prototype.clear = function () {
        this.nodes = [];
        this.edges = [];
        this.faces = [];
        return this;
    };
    /** Removes an edge and also attempt to remove the two nodes left behind if they are otherwise unused
     * @returns {boolean} if the edge was removed
     */
    PlanarGraph.prototype.removeEdge = function (edge) {
        var len = this.edges.length;
        var endNodes = [edge.nodes[0], edge.nodes[1]];
        this.edges = this.edges.filter(function (el) { return el !== edge; });
        this.edgeArrayDidChange();
        this.cleanNodeIfUseless(endNodes[0]);
        this.cleanNodeIfUseless(endNodes[1]);
        // todo: this is hitting the same node repeatedly from different sides, so keeping track of nodes is not working
        // var report = new PlanarCleanReport();
        // var a = this.cleanNodeIfUseless(endNodes[0]);
        // var b = this.cleanNodeIfUseless(endNodes[1]);
        // console.log(a +  " " + b)
        return new PlanarClean(undefined, len - this.edges.length);
    };
    /** Attempt to remove an edge if one is found that connects the 2 nodes supplied, and also attempt to remove the two nodes left behind if they are otherwise unused
     * @returns {number} how many edges were removed
     */
    PlanarGraph.prototype.removeEdgeBetween = function (node1, node2) {
        var len = this.edges.length;
        this.edges = this.edges.filter(function (el) {
            return !((el.nodes[0] === node1 && el.nodes[1] === node2) ||
                (el.nodes[0] === node2 && el.nodes[1] === node1));
        });
        this.edgeArrayDidChange();
        return new PlanarClean(undefined, len - this.edges.length)
            .join(this.cleanNodeIfUseless(node1))
            .join(this.cleanNodeIfUseless(node2));
    };
    /** Remove a node if it is either unconnected to any edges, or is in the middle of 2 collinear edges
     * @returns {number} how many nodes were removed
     */
    PlanarGraph.prototype.cleanNodeIfUseless = function (node) {
        var edges = node.adjacentEdges();
        switch (edges.length) {
            case 0: return this.removeNode(node);
            case 2:
                // collinear check
                var angleDiff = edges[0].absoluteAngle(node) - edges[1].absoluteAngle(node);
                // console.log("collinear check " + angleDiff);
                if (epsilonEqual(Math.abs(angleDiff), Math.PI, EPSILON_COLLINEAR)) {
                    var farNodes = [edges[0].uncommonNodeWithEdge(edges[1]),
                        edges[1].uncommonNodeWithEdge(edges[0])];
                    edges[0].nodes = [farNodes[0], farNodes[1]];
                    this.removeEdge(edges[1]);
                    // this.newEdge(farNodes[0], farNodes[1]);
                    this.removeNode(node);
                    // console.log("Collinear " + (nodeLen - this.nodes.length));
                    return new PlanarClean(1, 1);
                }
        }
        return new PlanarClean();
    };
    ///////////////////////////////////////////////
    // REMOVE PARTS
    ///////////////////////////////////////////////
    //
    // REQUIRES SEARCH BEFORE REMOVE
    //
    /** Removes all isolated nodes and performs cleanNodeIfUseless() on every node
     * @returns {number} how many nodes were removed
     */
    PlanarGraph.prototype.cleanAllUselessNodes = function () {
        // prepare adjacency information
        this.nodes.forEach(function (el) { el.cache['adjacentEdges'] = []; });
        this.edges.forEach(function (el) {
            el.nodes[0].cache['adjacentEdges'].push(el);
            el.nodes[1].cache['adjacentEdges'].push(el);
        });
        var report = new PlanarClean().join(this.removeIsolatedNodes());
        this.nodeArrayDidChange();
        this.edgeArrayDidChange();
        for (var i = this.nodes.length - 1; i >= 0; i--) {
            var edges = this.nodes[i].cache['adjacentEdges'];
            switch (edges.length) {
                case 0:
                    report.join(this.removeNode(this.nodes[i]));
                    break;
                case 2:
                    // collinear check
                    var angleDiff = edges[0].absoluteAngle(this.nodes[i]) - edges[1].absoluteAngle(this.nodes[i]);
                    // console.log("collinear check " + angleDiff);
                    if (epsilonEqual(Math.abs(angleDiff), Math.PI, EPSILON_COLLINEAR)) {
                        var farNodes = [edges[0].uncommonNodeWithEdge(edges[1]),
                            edges[1].uncommonNodeWithEdge(edges[0])];
                        edges[0].nodes = [farNodes[0], farNodes[1]];
                        this.edges.splice(edges[1].index, 1);
                        this.edgeArrayDidChange();
                        this.nodes.splice(this.nodes[i].index, 1);
                        this.nodeArrayDidChange();
                        report.join(new PlanarClean(1, 1));
                    }
                    break;
            }
        }
        this.nodes.forEach(function (el) { el.cache['adjacentEdges'] = undefined; });
        return report;
    };
    PlanarGraph.prototype.cleanDuplicateNodes = function (epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        var tree = rbush();
        // cache each node's adjacent edges
        // this.nodes.forEach(function(el){ el.cache = {'edges':[]}; });
        // this.edges.forEach(function(el){ 
        // 	el.nodes[0].cache['edges'].push(el);
        // 	el.nodes[1].cache['edges'].push(el);
        // });
        // console.time("map");
        var nodes = this.nodes.map(function (el) {
            return {
                minX: el.x - epsilon,
                minY: el.y - epsilon,
                maxX: el.x + epsilon,
                maxY: el.y + epsilon,
                node: el
            };
        });
        // console.timeEnd("map");
        // console.time("load");
        tree.load(nodes);
        // console.timeEnd("load");
        var that = this;
        function merge2Nodes(nodeA, nodeB) {
            that.edges.forEach(function (el) {
                if (el.nodes[0] === nodeB) {
                    el.nodes[0] = nodeA;
                }
                if (el.nodes[1] === nodeB) {
                    el.nodes[1] = nodeA;
                }
            });
            that.nodes = that.nodes.filter(function (el) { return el !== nodeB; });
            return new PlanarClean().duplicateNodes(new XY(nodeB.x, nodeB.y)).join(that.cleanGraph());
        }
        var clean = new PlanarClean();
        for (var i = 0; i < this.nodes.length; i++) {
            var result = tree.search({
                minX: this.nodes[i].x - epsilon,
                minY: this.nodes[i].y - epsilon,
                maxX: this.nodes[i].x + epsilon,
                maxY: this.nodes[i].y + epsilon
            });
            for (var r = 0; r < result.length; r++) {
                if (this.nodes[i] !== result[r]['node']) {
                    clean.join(merge2Nodes(this.nodes[i], result[r]['node']));
                }
            }
        }
        return clean;
    };
    /** Removes circular and duplicate edges, merges and removes duplicate nodes, and refreshes .index values
     * @returns {object} 'edges' the number of edges removed, and 'nodes' an XY location for every duplicate node merging
     */
    PlanarGraph.prototype.clean = function (epsilon) {
        var report = new PlanarClean();
        report.join(this.cleanDuplicateNodes(epsilon));
        report.join(this.fragment());
        report.join(this.cleanDuplicateNodes(epsilon));
        report.join(this.cleanGraph());
        report.join(this.cleanAllUselessNodes());
        return report;
    };
    ///////////////////////////////////////////////////////////////
    // fragment, EDGE INTERSECTION
    /** Fragment looks at every edge and one by one removes 2 crossing edges and replaces them with a node at their intersection and 4 edges connecting their original endpoints to the intersection.
     * @returns {XY[]} array of XY locations of all the intersection locations
     */
    // new idea
    // build a N x N matrix of edge to edge relationships, but only use the top triangle
    // fill matrix with approximations
    PlanarGraph.prototype.fragment = function () {
        var that = this;
        function fragmentOneRound() {
            var roundReport = new PlanarClean();
            for (var i = 0; i < that.edges.length; i++) {
                // console.time("fragmentEdge");
                var fragmentReport = that.fragmentEdge(that.edges[i]);
                roundReport.join(fragmentReport);
                if (fragmentReport.nodes.fragment.length > 0) {
                    // console.timeEnd("fragmentEdge");
                    // console.time("clean");
                    roundReport.join(that.cleanGraph());
                    roundReport.join(that.cleanAllUselessNodes());
                    roundReport.join(that.cleanDuplicateNodes());
                    // console.timeEnd("clean");
                }
            }
            return roundReport;
        }
        //todo: remove protection, or bake it into the class itself
        var protection = 0;
        var report = new PlanarClean();
        var thisReport;
        // console.time("fragment");
        do {
            thisReport = fragmentOneRound();
            report.join(thisReport);
            protection += 1;
        } while (thisReport.nodes.fragment.length != 0 && protection < 400);
        if (protection >= 400) {
            console.log("breaking loop, exceeded 400");
        }
        // console.timeEnd("fragment");
        return report;
    };
    /** This function targets a single edge and performs the fragment operation on all crossing edges.
     * @returns {XY[]} array of XY locations of all the intersection locations
     */
    PlanarGraph.prototype.fragmentEdge = function (edge) {
        var report = new PlanarClean();
        // console.time("crossingEdge");
        var intersections = edge.crossingEdges();
        // console.timeEnd("crossingEdge");
        if (intersections.length === 0) {
            return report;
        }
        report.nodes.fragment = intersections.map(function (el) { return new XY(el.x, el.y); });
        // console.time("fragmentEdge");
        var endNodes = edge.nodes.sort(function (a, b) {
            if (a.x - b.x < -EPSILON_HIGH) {
                return -1;
            }
            if (a.x - b.x > EPSILON_HIGH) {
                return 1;
            }
            if (a.y - b.y < -EPSILON_HIGH) {
                return -1;
            }
            if (a.y - b.y > EPSILON_HIGH) {
                return 1;
            }
            return 0;
        });
        // iterate through intersections, rebuild edges in order
        var newLineNodes = [];
        // todo, add endNodes into this array
        for (var i = 0; i < intersections.length; i++) {
            if (intersections[i] != undefined) {
                var newNode = this.newNode().position(intersections[i].x, intersections[i].y);
                this.copyEdge(intersections[i].edge).nodes = [newNode, intersections[i].edge.nodes[1]];
                intersections[i].edge.nodes[1] = newNode;
                newLineNodes.push(newNode);
            }
        }
        // replace the original edge with smaller collinear pieces of itself
        this.copyEdge(edge).nodes = [endNodes[0], newLineNodes[0]];
        for (var i = 0; i < newLineNodes.length - 1; i++) {
            this.copyEdge(edge).nodes = [newLineNodes[i], newLineNodes[i + 1]];
        }
        this.copyEdge(edge).nodes = [newLineNodes[newLineNodes.length - 1], endNodes[1]];
        this.removeEdge(edge);
        // console.timeEnd("fragmentEdge");
        report.join(this.cleanGraph());
        return report;
    };
    ///////////////////////////////////////////////
    // GET PARTS
    ///////////////////////////////////////////////
    PlanarGraph.prototype.bounds = function () {
        if (this.nodes === undefined || this.nodes.length === 0) {
            return undefined;
        }
        var minX = Infinity;
        var maxX = -Infinity;
        var minY = Infinity;
        var maxY = -Infinity;
        this.nodes.forEach(function (el) {
            if (el.x > maxX) {
                maxX = el.x;
            }
            if (el.x < minX) {
                minX = el.x;
            }
            if (el.y > maxY) {
                maxY = el.y;
            }
            if (el.y < minY) {
                minY = el.y;
            }
        });
        return new Rect(minX, minY, maxX - minX, maxY - minY);
    };
    /** Without changing the graph, this function collects the XY locations of every point that two edges cross each other.
     * @returns {XY[]} array of XY locations of all the intersection locations
     */
    PlanarGraph.prototype.getEdgeIntersections = function () {
        // todo should this make new XYs instead of returning EdgeIntersection objects?
        var intersections = [];
        // check all edges against each other for intersections
        for (var i = 0; i < this.edges.length - 1; i++) {
            for (var j = i + 1; j < this.edges.length; j++) {
                var intersection = this.edges[i].intersection(this.edges[j]);
                // add to array if exists, and is unique
                if (intersection != undefined) {
                    var copy = false;
                    for (var k = 0; k < intersections.length; k++) {
                        if (intersection.equivalent(intersections[k])) {
                            copy = true;
                        }
                    }
                    if (!copy) {
                        intersections.push(intersection);
                    }
                }
            }
        }
        return intersections;
    };
    /** Add an already-initialized edge to the graph
     * @param {XY} either two numbers (x,y) or one XY point object (XY)
     * @returns {PlanarNode} nearest node to the point
     */
    PlanarGraph.prototype.getNearestNode = function (x, y) {
        // input x is an xy point
        if (isValidPoint(x)) {
            y = x.y;
            x = x.x;
        }
        if (typeof (x) !== 'number' || typeof (y) !== 'number') {
            return;
        }
        // can be optimized with a k-d tree
        var node = undefined;
        var distance = Infinity;
        for (var i = 0; i < this.nodes.length; i++) {
            var dist = Math.sqrt(Math.pow(this.nodes[i].x - x, 2) + Math.pow(this.nodes[i].y - y, 2));
            if (dist < distance) {
                distance = dist;
                node = this.nodes[i];
            }
        }
        return node;
    };
    PlanarGraph.prototype.getNearestNodes = function (x, y, howMany) {
        // input x is an xy point
        if (isValidPoint(x)) {
            y = x.y;
            x = x.x;
        }
        if (typeof (x) !== 'number' || typeof (y) !== 'number') {
            return;
        }
        // can be optimized with a k-d tree
        var distances = [];
        for (var i = 0; i < this.nodes.length; i++) {
            var dist = Math.sqrt(Math.pow(this.nodes[i].x - x, 2) + Math.pow(this.nodes[i].y - y, 2));
            distances.push({ 'i': i, 'd': dist });
        }
        distances.sort(function (a, b) { return (a.d > b.d) ? 1 : ((b.d > a.d) ? -1 : 0); });
        // cap howMany at the number of total nodes
        if (howMany > distances.length) {
            howMany = distances.length;
        }
        return distances.slice(0, howMany).map(function (el) { return this.nodes[el.i]; }, this);
    };
    PlanarGraph.prototype.getNearestEdge = function (x, y) {
        // input x is an xy point
        if (isValidPoint(x)) {
            y = x.y;
            x = x.x;
        }
        if (typeof (x) !== 'number' || typeof (y) !== 'number') {
            return;
        }
        var minDist, nearestEdge, minLocation = { x: undefined, y: undefined };
        for (var i = 0; i < this.edges.length; i++) {
            var p = this.edges[i].nodes;
            var pT = minDistBetweenPointLine(p[0], p[1], new XY(x, y));
            if (pT != undefined) {
                var thisDist = Math.sqrt(Math.pow(x - pT.x, 2) + Math.pow(y - pT.y, 2));
                if (minDist == undefined || thisDist < minDist) {
                    minDist = thisDist;
                    nearestEdge = this.edges[i];
                    minLocation = pT;
                }
            }
        }
        // for (x,y) that is not orthogonal to the length of the edge (past the endpoint)
        // check distance to node endpoints
        for (var i = 0; i < this.nodes.length; i++) {
            var dist = Math.sqrt(Math.pow(this.nodes[i].x - x, 2) + Math.pow(this.nodes[i].y - y, 2));
            if (dist < minDist) {
                var adjEdges = this.nodes[i].adjacentEdges();
                if (adjEdges != undefined && adjEdges.length > 0) {
                    minDist = dist;
                    nearestEdge = adjEdges[0];
                    minLocation = { x: this.nodes[i].x, y: this.nodes[i].y };
                }
            }
        }
        return new EdgeIntersection(nearestEdge, minLocation.x, minLocation.y);
    };
    PlanarGraph.prototype.getNearestEdges = function (x, y, howMany) {
        // input x is an xy point
        if (isValidPoint(x)) {
            y = x.y;
            x = x.x;
        }
        if (typeof (x) !== 'number' || typeof (y) !== 'number') {
            return;
        }
        var minDist, nearestEdge, minLocation = { x: undefined, y: undefined };
        var edges = this.edges.map(function (el) {
            var pT = minDistBetweenPointLine(el.nodes[0], el.nodes[1], new XY(x, y));
            if (pT === undefined) {
                return undefined;
            }
            var distances = [
                Math.sqrt(Math.pow(x - pT.x, 2) + Math.pow(y - pT.y, 2)),
                Math.sqrt(Math.pow(el.nodes[0].x - x, 2) + Math.pow(el.nodes[0].y - y, 2)),
                Math.sqrt(Math.pow(el.nodes[1].x - x, 2) + Math.pow(el.nodes[1].y - y, 2)),
            ].filter(function (el) { return el !== undefined; })
                .sort(function (a, b) { return (a > b) ? 1 : (a < b) ? -1 : 0; });
            if (distances.length) {
                return { 'edge': el, 'distance': distances[0] };
            }
        });
        return edges.filter(function (el) { return el != undefined; });
    };
    PlanarGraph.prototype.getNearestEdgeFrom2Nodes = function (a, b) {
        var aNear = this.getNearestNode(a.x, a.y);
        var bNear = this.getNearestNode(b.x, b.y);
        var edge = this.getEdgeConnectingNodes(aNear, bNear);
        if (edge !== undefined)
            return edge;
        // check more
        for (var cou = 3; cou < 20; cou += 3) {
            var aNears = this.getNearestNodes(a.x, a.y, cou);
            var bNears = this.getNearestNodes(b.x, b.y, cou);
            for (var i = 0; i < aNears.length; i++) {
                for (var j = 0; j < bNears.length; j++) {
                    if (i !== j) {
                        var edge = this.getEdgeConnectingNodes(aNears[i], bNears[j]);
                        if (edge !== undefined)
                            return edge;
                    }
                }
            }
        }
        return undefined;
    };
    PlanarGraph.prototype.getNearestFace = function (x, y) {
        // input x is an xy point
        if (isValidPoint(x)) {
            y = x.y;
            x = x.x;
        }
        if (typeof (x) !== 'number' || typeof (y) !== 'number') {
            return;
        }
        var nearestNode = this.getNearestNode(x, y);
        if (nearestNode === undefined) {
            return;
        }
        var faces = nearestNode.adjacentFaces();
        if (faces === undefined || faces.length == 0) {
            return;
        }
        var sortedFaces = faces.sort(function (a, b) {
            var avgA = 0;
            var avgB = 0;
            for (var i = 0; i < a.nodes.length; i++) {
                avgA += a.nodes[i].y;
            }
            avgA /= (a.nodes.length);
            for (var i = 0; i < b.nodes.length; i++) {
                avgB += b.nodes[i].y;
            }
            avgB /= (a.nodes.length);
            return (avgA < avgB) ? 1 : ((avgA > avgB) ? -1 : 0);
        });
        if (sortedFaces.length <= 1) {
            return;
        }
        return sortedFaces[0];
    };
    PlanarGraph.prototype.getNearestInteriorAngle = function (x, y) {
        // input x is an xy point
        if (isValidPoint(x)) {
            y = x.y;
            x = x.x;
        }
        if (typeof (x) !== 'number' || typeof (y) !== 'number') {
            return;
        }
        // var node = this.getNearestNode(x,y);
        // var angles = node.interiorAngles();
        // todo: 5 is an arbitrary number to speed up this algorithm
        var nodes = this.getNearestNodes(x, y, 5);
        var node, joints;
        for (var i = 0; i < nodes.length; i++) {
            node = nodes[i];
            var nodeJunction = node.junction();
            if (nodeJunction !== undefined) {
                joints = nodeJunction.joints;
                if (joints !== undefined && joints.length > 0) {
                    break;
                }
            }
        }
        if (joints == undefined || joints.length === 0) {
            return undefined;
        }
        // cross product on each edge pair
        var anglesInside = joints.filter(function (el) {
            var pts = el.endNodes;
            var cross0 = (y - node.y) * (pts[1].x - node.x) -
                (x - node.x) * (pts[1].y - node.y);
            var cross1 = (y - pts[0].y) * (node.x - pts[0].x) -
                (x - pts[0].x) * (node.y - pts[0].y);
            if (cross0 < 0 || cross1 < 0) {
                return false;
            }
            return true;
        });
        if (anglesInside.length > 0)
            return anglesInside[0];
        return undefined;
    };
    /** This will deep-copy the entire graph and its contents and return it as a new object
     * @returns {PlanarGraph}
     */
    PlanarGraph.prototype.copy = function () {
        this.nodeArrayDidChange();
        this.edgeArrayDidChange();
        var g = new PlanarGraph();
        for (var i = 0; i < this.nodes.length; i++) {
            var n = g.addNode(new PlanarNode(g));
            Object.assign(n, this.nodes[i]);
            n.graph = g;
            n.index = i;
        }
        for (var i = 0; i < this.edges.length; i++) {
            var index = [this.edges[i].nodes[0].index, this.edges[i].nodes[1].index];
            var e = g.addEdge(new PlanarEdge(g, g.nodes[index[0]], g.nodes[index[1]]));
            Object.assign(e, this.edges[i]);
            e.graph = g;
            e.index = i;
            e.nodes = [g.nodes[index[0]], g.nodes[index[1]]];
        }
        for (var i = 0; i < this.faces.length; i++) {
            var f = new PlanarFace(g);
            Object.assign(f, this.faces[i]);
            for (var j = 0; j < this.faces[i].nodes.length; j++) {
                f.nodes.push(f.nodes[this.faces[i].nodes[j].index]);
            }
            for (var j = 0; j < this.faces[i].edges.length; j++) {
                f.edges.push(f.edges[this.faces[i].edges[j].index]);
            }
            for (var j = 0; j < this.faces[i].angles.length; j++) {
                f.angles.push(this.faces[i].angles[j]);
            }
            f.graph = g;
            g.faces.push(f);
        }
        return g;
    };
    ///////////////////////////////////////////////////////////////
    // CALCULATIONS
    // interiorAngle3Nodes(centerNode:PlanarNode, node1:PlanarNode, node2:PlanarNode):number{
    // 	var adjacentEdges = centerNode.planarAdjacent();
    // 	console.log(adjacentEdges);
    // 	return 0;
    // }
    PlanarGraph.prototype.nodeNormals = function () {
    };
    PlanarGraph.prototype.nodeTangents = function () {
        // var nodes2Edges = this.nodes.map()
    };
    ///////////////////////////////////////////////////////////////
    // INTERIOR ANGLES
    PlanarGraph.prototype.generatePlanarJoints = function () {
        return flatMap(this.nodes, function (el) { return el.junction().interiorAngles(); });
    };
    ///////////////////////////////////////////////////////////////
    // FACE
    PlanarGraph.prototype.faceArrayDidChange = function () { for (var i = 0; i < this.faces.length; i++) {
        this.faces[i].index = i;
    } };
    PlanarGraph.prototype.generateFaces = function () {
        this.faces = [];
        for (var i = 0; i < this.nodes.length; i++) {
            var adjacentFaces = this.nodes[i].adjacentFaces();
            for (var af = 0; af < adjacentFaces.length; af++) {
                var duplicate = false;
                for (var tf = 0; tf < this.faces.length; tf++) {
                    if (this.faces[tf].equivalent(adjacentFaces[af])) {
                        duplicate = true;
                        break;
                    }
                }
                if (!duplicate) {
                    this.faces.push(adjacentFaces[af]);
                }
            }
        }
        this.faceArrayDidChange();
        return this.faces;
    };
    PlanarGraph.prototype.adjacentFaceTree = function (start) {
        this.faceArrayDidChange();
        // this will keep track of faces still needing to be visited
        var faceRanks = [];
        for (var i = 0; i < this.faces.length; i++) {
            faceRanks.push(undefined);
        }
        function allFacesRanked() {
            for (var i = 0; i < faceRanks.length; i++) {
                if (faceRanks[i] === undefined) {
                    return false;
                }
            }
            return true;
        }
        var rank = [];
        var rankI = 0;
        rank.push([start]);
        // rank 0 is an array of 1 face, the start face
        faceRanks[start.index] = { rank: 0, parents: [], face: start };
        // loop
        var safety = 0;
        while (!allFacesRanked() && safety < this.faces.length + 1) {
            rankI += 1;
            rank[rankI] = [];
            for (var p = 0; p < rank[rankI - 1].length; p++) {
                var adjacent = rank[rankI - 1][p].edgeAdjacentFaces();
                for (var i = 0; i < adjacent.length; i++) {
                    // add a face if it hasn't already been found
                    if (faceRanks[adjacent[i].index] === undefined) {
                        rank[rankI].push(adjacent[i]);
                        var parentArray = faceRanks[rank[rankI - 1][p].index].parents.slice();
                        // add nearest parent to beginning of array
                        parentArray.unshift(rank[rankI - 1][p]);
                        // OR, add them to the beginning
                        // parentArray.push( rank[rankI-1][p] );
                        faceRanks[adjacent[i].index] = { rank: rankI, parents: parentArray, face: adjacent[i] };
                    }
                }
            }
            safety++;
        }
        for (var i = 0; i < faceRanks.length; i++) {
            if (faceRanks[i] !== undefined && faceRanks[i].parents !== undefined && faceRanks[i].parents.length > 0) {
                var parent = faceRanks[i].parents[0];
                var edge = parent.commonEdge(faceRanks[i].face);
                var m = edge.reflectionMatrix();
                faceRanks[i].matrix = m;
            }
        }
        for (var i = 0; i < rank.length; i++) {
            for (var j = 0; j < rank[i].length; j++) {
                var parents = faceRanks[rank[i][j].index].parents;
                var matrix = faceRanks[rank[i][j].index].matrix;
                if (parents !== undefined && m !== undefined && parents.length > 0) {
                    var parentGlobal = faceRanks[parents[0].index].global;
                    if (parentGlobal !== undefined) {
                        // faceRanks[ rank[i][j].index ].global = matrix.mult(parentGlobal.copy());
                        faceRanks[rank[i][j].index].global = parentGlobal.copy().mult(matrix);
                    }
                    else {
                        faceRanks[rank[i][j].index].global = matrix.copy();
                    }
                }
                else {
                    faceRanks[rank[i][j].index].matrix = new Matrix();
                    faceRanks[rank[i][j].index].global = new Matrix();
                }
            }
        }
        return { rank: rank, faces: faceRanks };
    };
    ///////////////////////////////////////////////////////////////////////
    PlanarGraph.prototype.log = function (verbose) {
        console.log('#Nodes: ' + this.nodes.length);
        console.log('#Edges: ' + this.edges.length);
        if (verbose != undefined && verbose == true) {
            for (var i = 0; i < this.edges.length; i++) {
                console.log(i + ': ' + this.edges[i].nodes[0] + ' ' + this.edges[i].nodes[1]);
            }
        }
        for (var i = 0; i < this.nodes.length; i++) {
            console.log(' ' + i + ': (' + this.nodes[i].x + ', ' + this.nodes[i].y + ')');
        }
        for (var i = 0; i < this.edges.length; i++) {
            console.log(' ' + i + ': (' + this.edges[i].nodes[0].index + ' -- ' + this.edges[i].nodes[1].index + ')');
        }
    };
    ///////////////////////////////////////////////////////////////////////
    // delete?
    PlanarGraph.prototype.edgeExistsThroughPoints = function (a, b) {
        for (var i = 0; i < this.edges.length; i++) {
            console.log(a);
            console.log(this.edges[i].nodes[0]);
            if ((a.equivalent(this.edges[i].nodes[0]) && b.equivalent(this.edges[i].nodes[1])) ||
                (a.equivalent(this.edges[i].nodes[1]) && b.equivalent(this.edges[i].nodes[0]))) {
                return true;
            }
        }
        return false;
    };
    return PlanarGraph;
}(Graph));
