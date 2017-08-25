// creasePattern.js
// for the purposes of performing origami operations on a planar graph
// mit open source license, robby kraft
/// <reference path="planarGraph.ts"/>
"use strict";
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
var CreaseDirection;
(function (CreaseDirection) {
    CreaseDirection[CreaseDirection["none"] = 0] = "none";
    CreaseDirection[CreaseDirection["border"] = 1] = "border";
    CreaseDirection[CreaseDirection["mountain"] = 2] = "mountain";
    CreaseDirection[CreaseDirection["valley"] = 3] = "valley";
})(CreaseDirection || (CreaseDirection = {}));
var Fold = (function () {
    function Fold(foldFunction, argumentArray) {
        this.func = undefined;
        this.args = [];
        this.func = foldFunction;
        this.args = argumentArray;
    }
    return Fold;
}());
var FoldSequence = (function () {
    function FoldSequence() {
    }
    return FoldSequence;
}());
var CreaseNode = (function (_super) {
    __extends(CreaseNode, _super);
    function CreaseNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CreaseNode.prototype.isBoundary = function () {
        for (var i = 0; i < this.graph.boundary.edges.length; i++) {
            var thisPt = new XYPoint(this.x, this.y);
            if (onSegment(thisPt, this.graph.boundary.edges[i].nodes[0], this.graph.boundary.edges[i].nodes[1])) {
                return true;
            }
        }
        return false;
    };
    CreaseNode.prototype.kawasaki = function () {
        var angles = this.interiorAngles();
        // only computes if number of interior angles are even
        if (angles.length % 2 != 0) {
            return undefined;
        }
        var aSum = angles.filter(function (el, i) { return i % 2; })
            .reduce(function (sum, el) { return sum + el.angle; }, 0);
        var bSum = angles.filter(function (el, i) { return !(i % 2); })
            .reduce(function (sum, el) { return sum + el.angle; }, 0);
        return [aSum, bSum];
    };
    CreaseNode.prototype.flatFoldable = function () {
        if (this.isBoundary()) {
            return true;
        }
        var sums = this.kawasaki();
        if (sums == undefined) {
            return false;
        } // not an even number of interior angles
        if (epsilonEqual(sums[0], Math.PI, EPSILON_LOW) &&
            epsilonEqual(sums[1], Math.PI, EPSILON_LOW)) {
            return true;
        }
        return false;
    };
    //////////////////////////////
    // FOLDS
    // AXIOM 1
    CreaseNode.prototype.creaseLineThrough = function (point) {
        return this.graph.creaseThroughPoints(this, point);
    };
    // AXIOM 2
    CreaseNode.prototype.creaseToPoint = function (point) {
        return this.graph.creasePointToPoint(this, point);
    };
    return CreaseNode;
}(PlanarNode));
var Crease = (function (_super) {
    __extends(Crease, _super);
    function Crease(graph, node1, node2) {
        return _super.call(this, graph, node1, node2) || this;
    }
    ;
    Crease.prototype.mark = function () { this.orientation = CreaseDirection.none; return this; };
    Crease.prototype.mountain = function () { this.orientation = CreaseDirection.mountain; return this; };
    Crease.prototype.valley = function () { this.orientation = CreaseDirection.valley; return this; };
    Crease.prototype.border = function () { this.orientation = CreaseDirection.border; return this; };
    // AXIOM 3
    Crease.prototype.creaseToEdge = function (edge) {
        return this.graph.creaseEdgeToEdge(this, edge);
    };
    return Crease;
}(PlanarEdge));
var CreasePattern = (function (_super) {
    __extends(CreasePattern, _super);
    function CreasePattern() {
        var _this = _super.call(this) || this;
        _this.symmetryLine = undefined;
        _this.nodeType = CreaseNode;
        _this.edgeType = Crease;
        if (_this.boundary === undefined) {
            _this.boundary = new PlanarGraph();
        }
        _this.square();
        return _this;
    }
    CreasePattern.prototype.landmarkNodes = function () { return this.nodes.map(function (el) { return new XYPoint(el.x, el.y); }); };
    /** This will deep-copy the contents of this graph and return it as a new object
     * @returns {CreasePattern}
     */
    CreasePattern.prototype.duplicate = function () {
        this.nodeArrayDidChange();
        this.edgeArrayDidChange();
        var g = new CreasePattern();
        g.boundary = undefined;
        g.clear();
        for (var i = 0; i < this.nodes.length; i++) {
            var n = g.addNode(new CreaseNode(g));
            Object.assign(n, this.nodes[i]);
            n.graph = g;
            n.index = i;
        }
        for (var i = 0; i < this.edges.length; i++) {
            var index = [this.edges[i].nodes[0].index, this.edges[i].nodes[1].index];
            var e = g.addEdge(new Crease(g, g.nodes[index[0]], g.nodes[index[1]]));
            Object.assign(e, this.edges[i]);
            e.graph = g;
            e.index = i;
            e.nodes = [g.nodes[index[0]], g.nodes[index[1]]];
            // e.orientation = this.edges[i].orientation;
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
        // boundary
        this.boundary.nodeArrayDidChange();
        this.boundary.edgeArrayDidChange();
        var b = new PlanarGraph();
        for (var i = 0; i < this.boundary.nodes.length; i++) {
            var bn = b.addNode(new PlanarNode(b));
            Object.assign(bn, this.boundary.nodes[i]);
            bn.graph = b;
            bn.index = i;
        }
        for (var i = 0; i < this.boundary.edges.length; i++) {
            var index = [this.boundary.edges[i].nodes[0].index, this.boundary.edges[i].nodes[1].index];
            var be = b.addEdge(new PlanarEdge(b, b.nodes[index[0]], b.nodes[index[1]]));
            Object.assign(be, this.boundary.edges[i]);
            be.graph = b;
            be.index = i;
            be.nodes = [b.nodes[index[0]], b.nodes[index[1]]];
        }
        for (var i = 0; i < this.boundary.faces.length; i++) {
            var bf = new PlanarFace(b);
            Object.assign(bf, this.boundary.faces[i]);
            for (var j = 0; j < this.boundary.faces[i].nodes.length; j++) {
                bf.nodes.push(b.nodes[this.boundary.faces[i].nodes[j].index]);
            }
            for (var j = 0; j < this.boundary.faces[i].edges.length; j++) {
                bf.edges.push(b.edges[this.boundary.faces[i].edges[j].index]);
            }
            for (var j = 0; j < this.boundary.faces[i].angles.length; j++) {
                bf.angles.push(this.boundary.faces[i].angles[j]);
            }
            bf.graph = b;
            b.faces.push(f);
        }
        g.boundary = b;
        return g;
    };
    ///////////////////////////////////////////////////////////////
    // ADD PARTS
    // fold(param1, param2, param3, param4){
    // 	// detects which parameters are there
    // }
    CreasePattern.prototype.pointInside = function (p) {
        for (var i = 0; i < this.boundary.edges.length; i++) {
            var endpts = this.boundary.edges[i].nodes;
            var cross = (p.y - endpts[0].y) * (endpts[1].x - endpts[0].x) -
                (p.x - endpts[0].x) * (endpts[1].y - endpts[0].y);
            if (cross < 0)
                return false;
        }
        return true;
    };
    CreasePattern.prototype.newCrease = function (a_x, a_y, b_x, b_y) {
        // use this.crease() instead
        // this is a private function and expects you have checked boundary intersect conditions
        this.creaseSymmetry(a_x, a_y, b_x, b_y);
        return this.newPlanarEdge(a_x, a_y, b_x, b_y);
    };
    /** Create a crease that is a line segment, and will crop if it extends beyond boundary
     * @arg 4 numbers or 2 XYPoints
     * @returns {Crease} pointer to the Crease
     */
    CreasePattern.prototype.crease = function (a, b, c, d) {
        var endpoints = undefined;
        // input (a and b) are 2 xy points
        // if(a.hasOwnProperty('x') && a.hasOwnProperty('y') && 
        //    b.hasOwnProperty('x') && b.hasOwnProperty('y')){
        if (isValidPoint(a) && isValidPoint(b)) {
            endpoints = this.clipLineSegmentInBoundary(a, b);
        }
        // input (a b and c d) are x and y of two points
        if (typeof a === 'number' && typeof b === 'number' && typeof c === 'number' && typeof d === 'number') {
            if (!isValidNumber(a) || !isValidNumber(b) || !isValidNumber(c) || !isValidNumber(d)) {
                return undefined;
            }
            endpoints = this.clipLineSegmentInBoundary(new XYPoint(a, b), new XYPoint(c, d));
        }
        if (endpoints === undefined || endpoints.length < 2) {
            throw "crease(): coordinates lie outside boundary";
        }
        return this.newCrease(endpoints[0].x, endpoints[0].y, endpoints[1].x, endpoints[1].y);
    };
    CreasePattern.prototype.creaseRay = function (origin, direction) {
        var endpoints = this.clipRayInBoundary(origin, direction);
        if (endpoints === undefined) {
            throw "creaseRay does not appear to be inside the boundary";
        }
        return this.newCrease(endpoints[0].x, endpoints[0].y, endpoints[1].x, endpoints[1].y);
    };
    CreasePattern.prototype.creaseRayUntilIntersection = function (origin, direction) {
        if (!isValidPoint(origin) || !isValidPoint(direction)) {
            return undefined;
        }
        var nearestIntersection = undefined;
        var intersections = this.edges
            .map(function (el) { return rayLineSegmentIntersectionAlgorithm(origin, direction, el.nodes[0], el.nodes[1]); })
            .filter(function (el) { return el !== undefined; })
            .filter(function (el) { return !el.equivalent(origin); })
            .sort(function (a, b) {
            var da = Math.sqrt(Math.pow(origin.x - a.x, 2) + Math.pow(origin.y - a.y, 2));
            var db = Math.sqrt(Math.pow(origin.x - b.x, 2) + Math.pow(origin.y - b.y, 2));
            return (da > db) ? 1 : (da < db) ? -1 : 0;
        });
        if (intersections.length) {
            return this.crease(origin, intersections[0]);
        }
        else {
            return this.creaseRay(origin, direction);
        }
    };
    CreasePattern.prototype.creaseAngle = function (origin, radians) {
        return this.creaseRay(origin, new XYPoint(Math.cos(radians), Math.sin(radians)));
    };
    CreasePattern.prototype.creaseAngleBisector = function (a, b) {
        var commonNode = a.commonNodeWithEdge(b);
        if (commonNode === undefined)
            return undefined;
        var aAngle = a.absoluteAngle(commonNode);
        var bAngle = b.absoluteAngle(commonNode);
        var clockwise = clockwiseAngleFrom(bAngle, aAngle);
        var newAngle = bAngle - clockwise * 0.5 + Math.PI;
        return this.creaseRay(commonNode, new XYPoint(Math.cos(newAngle), Math.sin(newAngle)));
    };
    CreasePattern.prototype.creaseSymmetry = function (ax, ay, bx, by) {
        if (this.symmetryLine === undefined) {
            return undefined;
        }
        var ra = reflectPointAcrossLine(new XYPoint(ax, ay), this.symmetryLine[0], this.symmetryLine[1]);
        var rb = reflectPointAcrossLine(new XYPoint(bx, by), this.symmetryLine[0], this.symmetryLine[1]);
        return this.newPlanarEdge(ra.x, ra.y, rb.x, rb.y);
    };
    CreasePattern.prototype.clipLineSegmentInBoundary = function (a, b) {
        // todo this only works for convex polygon shaped boundary
        var aInside = this.pointInside(a);
        var bInside = this.pointInside(b);
        if (aInside && bInside) {
            return [a, b];
        }
        // if both are outside, it's still possible the line crosses into the boundary
        if (!aInside && !bInside) {
            return this.clipLineInBoundary(a, b);
        }
        var inside = a, outside = b;
        if (bInside) {
            outside = a;
            inside = b;
        }
        var intersection = undefined;
        for (var i = 0; i < this.boundary.edges.length; i++) {
            intersection = lineSegmentIntersectionAlgorithm(inside, outside, this.boundary.edges[i].nodes[0], this.boundary.edges[i].nodes[1]);
        }
        if (intersection === undefined) {
            return undefined;
        }
        if (aInside) {
            return [inside, intersection];
        }
        else {
            return [intersection, inside];
        }
    };
    CreasePattern.prototype.clipRayInBoundary = function (origin, direction) {
        // todo this only works for convex polygon shaped boundary, needs to search for nearest point to origin
        if (!this.pointInside(origin)) {
            var b = new XYPoint(origin.x + direction.x, origin.y + direction.y);
            return this.clipLineInBoundary(origin, b);
        }
        for (var i = 0; i < this.boundary.edges.length; i++) {
            var intersection = rayLineSegmentIntersectionAlgorithm(origin, direction, this.boundary.edges[i].nodes[0], this.boundary.edges[i].nodes[1]);
            if (intersection != undefined) {
                return [origin, intersection];
            }
        }
    };
    CreasePattern.prototype.clipLineInBoundary = function (a, b) {
        // todo this only works for convex polygon shaped boundary
        var b_a = new XYPoint(b.x - a.x, b.y - a.y);
        var intersects = this.boundaryLineIntersection(a, b_a);
        if (intersects.length === 2) {
            return [intersects[0], intersects[1]];
        }
    };
    // AXIOM 1
    CreasePattern.prototype.creaseThroughPoints = function (a, b) {
        var endPoints = this.clipLineInBoundary(a, b);
        if (endPoints === undefined) {
            throw "creaseThroughPoints(): crease line doesn't cross inside boundary";
        }
        return this.newCrease(endPoints[0].x, endPoints[0].y, endPoints[1].x, endPoints[1].y);
    };
    // AXIOM 2
    CreasePattern.prototype.creasePointToPoint = function (a, b) {
        var midpoint = new XYPoint((a.x + b.x) * 0.5, (a.y + b.y) * 0.5);
        var ab = new XYPoint(b.x - a.x, b.y - a.y);
        var perp1 = new XYPoint(-ab.y, ab.x);
        var intersects = this.boundaryLineIntersection(midpoint, perp1);
        if (intersects.length >= 2) {
            return this.newCrease(intersects[0].x, intersects[0].y, intersects[1].x, intersects[1].y);
        }
        throw "points have no perpendicular bisector inside of the boundaries";
    };
    // AXIOM 3
    CreasePattern.prototype.creaseEdgeToEdge = function (a, b) {
        if (linesParallel(a.nodes[0], a.nodes[1], b.nodes[0], b.nodes[1])) {
            var u = new XYPoint(a.nodes[1].x - a.nodes[0].x, a.nodes[1].y - a.nodes[0].y);
            var perp = new XYPoint(u.x, u.y).rotate90();
            var intersect1 = lineIntersectionAlgorithm(u, new XYPoint(u.x + perp.x, u.y + perp.y), a.nodes[0], a.nodes[1]);
            var intersect2 = lineIntersectionAlgorithm(u, new XYPoint(u.x + perp.x, u.y + perp.y), b.nodes[0], b.nodes[1]);
            var midpoint = new XYPoint((intersect1.x + intersect2.x) * 0.5, (intersect1.y + intersect2.y) * 0.5);
            return [this.creaseThroughPoints(midpoint, new XYPoint(midpoint.x + u.x, midpoint.y + u.y))];
        }
        else {
            var creases = [];
            var intersection = lineIntersectionAlgorithm(a.nodes[0], a.nodes[1], b.nodes[0], b.nodes[1]);
            var u = new XYPoint(a.nodes[1].x - a.nodes[0].x, a.nodes[1].y - a.nodes[0].y);
            var v = new XYPoint(b.nodes[1].x - b.nodes[0].x, b.nodes[1].y - b.nodes[0].y);
            var uMag = u.mag();
            var vMag = v.mag();
            var dir = new XYPoint((u.x * vMag + v.x * uMag), (u.y * vMag + v.y * uMag));
            var intersects = this.boundaryLineIntersection(intersection, dir);
            if (intersects.length >= 2) {
                creases.push(this.newCrease(intersects[0].x, intersects[0].y, intersects[1].x, intersects[1].y));
            }
            var dir90 = dir.rotate90();
            var intersects90 = this.boundaryLineIntersection(intersection, dir90);
            if (intersects90.length >= 2) {
                if (Math.abs(u.cross(dir)) < Math.abs(u.cross(dir90)))
                    creases.push(this.newCrease(intersects90[0].x, intersects90[0].y, intersects90[1].x, intersects90[1].y));
                else
                    creases.unshift(this.newCrease(intersects90[0].x, intersects90[0].y, intersects90[1].x, intersects90[1].y));
            }
            if (creases.length) {
                return creases;
            }
            throw "lines have no inner edge inside of the boundaries";
        }
        ;
    };
    // AXIOM 4
    CreasePattern.prototype.creasePerpendicularThroughPoint = function (line, point) {
        var ab = new XYPoint(line.nodes[1].x - line.nodes[0].x, line.nodes[1].y - line.nodes[0].y);
        var perp = new XYPoint(-ab.y, ab.x);
        var point2 = new XYPoint(point.x + perp.x, point.y + perp.y);
        return this.creaseThroughPoints(point, point2);
    };
    // AXIOM 5
    CreasePattern.prototype.creasePointToLine = function (origin, point, line) {
        var radius = Math.sqrt(Math.pow(origin.x - point.x, 2) + Math.pow(origin.y - point.y, 2));
        var intersections = circleLineIntersectionAlgorithm(origin, radius, line.nodes[0], line.nodes[1]);
        // return (radius*radius) * dr_squared > (D*D)  // check if there are any intersections
        var creases = [];
        for (var i = 0; i < intersections.length; i++) {
            creases.push(this.creasePointToPoint(point, intersections[i]));
        }
        return creases;
    };
    // AXIOM 7
    CreasePattern.prototype.creasePerpendicularPointOntoLine = function (point, ontoLine, perpendicularTo) {
        var endPts = perpendicularTo.nodes;
        var align = new XYPoint(endPts[1].x - endPts[0].x, endPts[1].y - endPts[0].y);
        var pointParallel = new XYPoint(point.x + align.x, point.y + align.y);
        var intersection = lineIntersectionAlgorithm(point, pointParallel, ontoLine.nodes[0], ontoLine.nodes[1]);
        if (intersection != undefined) {
            var midPoint = new XYPoint((intersection.x + point.x) * 0.5, (intersection.y + point.y) * 0.5);
            var perp = new XYPoint(-align.y, align.x);
            var midPoint2 = new XYPoint(midPoint.x + perp.x, midPoint.y + perp.y);
            return this.creaseThroughPoints(midPoint, midPoint2);
        }
        throw "axiom 7: two crease lines cannot be parallel";
    };
    CreasePattern.prototype.boundaryLineIntersection = function (origin, direction) {
        var opposite = new XYPoint(-direction.x, -direction.y);
        var intersects = [];
        for (var i = 0; i < this.boundary.edges.length; i++) {
            var endpts = this.boundary.edges[i].nodes;
            var test1 = rayLineSegmentIntersectionAlgorithm(origin, direction, endpts[0], endpts[1]);
            var test2 = rayLineSegmentIntersectionAlgorithm(origin, opposite, endpts[0], endpts[1]);
            if (test1 != undefined) {
                test1.x = wholeNumberify(test1.x);
                test1.y = wholeNumberify(test1.y);
                intersects.push(test1);
            }
            if (test2 != undefined) {
                test2.x = wholeNumberify(test2.x);
                test2.y = wholeNumberify(test2.y);
                intersects.push(test2);
            }
        }
        // todo, need remove duplicate points from array function
        for (var i = 0; i < intersects.length - 1; i++) {
            for (var j = intersects.length - 1; j > i; j--) {
                if (intersects[i].equivalent(intersects[j])) {
                    intersects.splice(j, 1);
                }
            }
        }
        return intersects;
    };
    CreasePattern.prototype.boundaryRayIntersection = function (origin, direction) {
        var intersects = [];
        for (var i = 0; i < this.boundary.edges.length; i++) {
            var endpts = this.boundary.edges[i].nodes;
            var test = rayLineSegmentIntersectionAlgorithm(origin, direction, endpts[0], endpts[1]);
            if (test != undefined) {
                intersects.push(test);
            }
        }
        // todo, need remove duplicate points from array function
        for (var i = 0; i < intersects.length - 1; i++) {
            for (var j = intersects.length - 1; j > i; j--) {
                if (intersects[i].equivalent(intersects[j])) {
                    intersects.splice(j, 1);
                }
            }
        }
        return intersects;
    };
    //////////////////////////////////////////////
    // BOUNDARY
    CreasePattern.prototype.square = function (width) {
        // console.log("setting page size: square()");
        var w = 1.0;
        // todo: isReal() - check if is real number
        if (width != undefined && width != 0) {
            w = Math.abs(width);
        }
        return this.setBoundary([new XYPoint(0, 0), new XYPoint(w, 0), new XYPoint(w, w), new XYPoint(0, w)]);
    };
    CreasePattern.prototype.rectangle = function (width, height) {
        // console.log("setting page size: rectangle(" + width + "," + height + ")");
        // todo: should this return undefined if a rectangle has not been made? or return this?
        if (width === undefined || height === undefined) {
            return undefined;
        }
        width = Math.abs(width);
        height = Math.abs(height);
        var points = [new XYPoint(0, 0),
            new XYPoint(width, 0),
            new XYPoint(width, height),
            new XYPoint(0, height)];
        return this.setBoundary(points);
    };
    CreasePattern.prototype.setBoundary = function (points) {
        // TODO: make sure paper edges are winding clockwise!!
        // clear old data
        if (this.boundary === undefined) {
            this.boundary = new PlanarGraph();
        }
        else {
            this.boundary.clear();
        }
        this.edges = this.edges.filter(function (el) { return el.orientation !== CreaseDirection.border; });
        // todo: if an edge gets removed, it will leave behind its nodes. we might need the following:
        // this.cleanUnusedNodes();
        // todo: test that this is the right way to remove last item:
        if (points[0].equivalent(points[points.length - 1])) {
            points.pop();
        }
        for (var i = 0; i < points.length; i++) {
            var nextI = (i + 1) % points.length;
            this.newPlanarEdge(points[i].x, points[i].y, points[nextI].x, points[nextI].y).border();
            this.boundary.newPlanarEdge(points[i].x, points[i].y, points[nextI].x, points[nextI].y);
        }
        this.cleanDuplicateNodes();
        this.boundary.cleanDuplicateNodes();
        return this;
    };
    ///////////////////////////////////////////////////////////////
    // CLEAN  /  REMOVE PARTS
    CreasePattern.prototype.clear = function () {
        this.nodes = [];
        this.edges = [];
        this.faces = [];
        if (this.boundary === undefined) {
            return this;
        }
        for (var i = 0; i < this.boundary.edges.length; i++) {
            var nodes = this.boundary.edges[i].nodes;
            this.newPlanarEdge(nodes[0].x, nodes[0].y, nodes[1].x, nodes[1].y).border();
        }
        this.cleanDuplicateNodes();
        return this;
    };
    CreasePattern.prototype.bottomEdge = function () {
        var boundaries = this.edges
            .filter(function (el) { return el.orientation === CreaseDirection.border; })
            .sort(function (a, b) { var ay = a.nodes[0].y + a.nodes[1].y; var by = b.nodes[0].y + b.nodes[1].y; return (ay < by) ? 1 : (ay > by) ? -1 : 0; });
        if (boundaries.length > 0) {
            return boundaries[0];
        }
        return undefined;
    };
    CreasePattern.prototype.topEdge = function () {
        var boundaries = this.edges
            .filter(function (el) { return el.orientation === CreaseDirection.border; })
            .sort(function (a, b) { var ay = a.nodes[0].y + a.nodes[1].y; var by = b.nodes[0].y + b.nodes[1].y; return (ay > by) ? 1 : (ay < by) ? -1 : 0; });
        if (boundaries.length > 0) {
            return boundaries[0];
        }
        return undefined;
    };
    CreasePattern.prototype.rightEdge = function () {
        var boundaries = this.edges
            .filter(function (el) { return el.orientation === CreaseDirection.border; })
            .sort(function (a, b) { var ax = a.nodes[0].x + a.nodes[1].x; var bx = b.nodes[0].x + b.nodes[1].x; return (ax < bx) ? 1 : (ax > bx) ? -1 : 0; });
        if (boundaries.length > 0) {
            return boundaries[0];
        }
        return undefined;
    };
    CreasePattern.prototype.leftEdge = function () {
        var boundaries = this.edges
            .filter(function (el) { return el.orientation === CreaseDirection.border; })
            .sort(function (a, b) { var ax = a.nodes[0].x + a.nodes[1].x; var bx = b.nodes[0].x + b.nodes[1].x; return (ax > bx) ? 1 : (ax < bx) ? -1 : 0; });
        if (boundaries.length > 0) {
            return boundaries[0];
        }
        return undefined;
    };
    ///////////////////////////////////////////////////////////////
    // SYMMETRY
    CreasePattern.prototype.bookSymmetry = function () {
        var top = this.topEdge();
        var bottom = this.bottomEdge();
        var a = new XYPoint((top.nodes[0].x + top.nodes[1].x) * 0.5, (top.nodes[0].y + top.nodes[1].y) * 0.5);
        var b = new XYPoint((bottom.nodes[0].x + bottom.nodes[1].x) * 0.5, (bottom.nodes[0].y + bottom.nodes[1].y) * 0.5);
        return this.setSymmetryLine(a, b);
    };
    CreasePattern.prototype.diagonalSymmetry = function () {
        var top = this.topEdge().nodes.sort(function (a, b) { return (a.x < b.x) ? 1 : (a.x > b.x) ? -1 : 0; });
        var bottom = this.bottomEdge().nodes.sort(function (a, b) { return (a.x < b.x) ? -1 : (a.x > b.x) ? 1 : 0; });
        return this.setSymmetryLine(top[0], bottom[0]);
    };
    CreasePattern.prototype.setSymmetryLine = function (a, b) {
        this.symmetryLine = [a, b];
        return this;
    };
    CreasePattern.prototype.findFlatFoldable = function (angle) {
        var interiorAngles = angle.node.interiorAngles();
        if (interiorAngles.length != 3) {
            return;
        }
        // find this interior angle among the other interior angles
        var foundIndex = undefined;
        for (var i = 0; i < interiorAngles.length; i++) {
            if (angle.equivalent(interiorAngles[i])) {
                foundIndex = i;
            }
        }
        if (foundIndex === undefined) {
            return undefined;
        }
        var sumEven = 0;
        var sumOdd = 0;
        for (var i = 0; i < interiorAngles.length - 1; i++) {
            var index = (i + foundIndex + 1) % interiorAngles.length;
            if (i % 2 == 0) {
                sumEven += interiorAngles[index].angle;
            }
            else {
                sumOdd += interiorAngles[index].angle;
            }
        }
        var dEven = Math.PI - sumEven;
        var dOdd = Math.PI - sumOdd;
        var angle0 = angle.edges[0].absoluteAngle(angle.node);
        var angle1 = angle.edges[1].absoluteAngle(angle.node);
        // this following if isn't where the problem lies, it is on both cases, the problem is in the data incoming, first 2 lines, it's not sorted, or whatever.
        // console.log(clockwiseAngleFrom(angle0, angle1) + " " + clockwiseAngleFrom(angle1, angle0));
        // if(clockwiseAngleFrom(angle0, angle1) < clockwiseAngleFrom(angle1, angle0)){
        // return angle1 - dOdd;
        // return angle1 - dEven;
        // } else{
        // return angle0 - dOdd;
        // }
        // return angle0 + dEven;
        return angle0 - dEven;
    };
    // vertexLiesOnEdge(vIndex, intersect){  // uint, Vertex
    // 	var v = this.nodes[vIndex];
    // 	return this.vertexLiesOnEdge(v, intersect);
    // }
    CreasePattern.prototype.trySnapVertex = function (newVertex, epsilon) {
        // find the closest interesting point to the vertex
        var closestDistance = undefined;
        var closestIndex = undefined;
        for (var i = 0; i < this.landmarkNodes.length; i++) {
            // we could improve this, this.verticesEquivalent could return the distance itself, saving calculations
            if (newVertex.equivalent(this.landmarkNodes[i], epsilon)) {
                var thisDistance = Math.sqrt(Math.pow(newVertex.x - this.landmarkNodes[i].x, 2) +
                    Math.pow(newVertex.y - this.landmarkNodes[i].y, 2));
                if (closestIndex == undefined || (thisDistance < closestDistance)) {
                    closestIndex = i;
                    closestDistance = thisDistance;
                }
            }
        }
        if (closestIndex != undefined) {
            return this.landmarkNodes[closestIndex];
        }
        return newVertex;
    };
    CreasePattern.prototype.snapAll = function (epsilon) {
        for (var i = 0; i < this.nodes.length; i++) {
            for (var j = 0; j < this.landmarkNodes.length; j++) {
                if (this.nodes[i] != undefined && this.nodes[i].equivalent(this.landmarkNodes[j], epsilon)) {
                    this.nodes[i].x = this.landmarkNodes[j].x;
                    this.nodes[i].y = this.landmarkNodes[j].y;
                }
            }
        }
    };
    CreasePattern.prototype.kawasaki = function (nodeIndex) {
        // this hands back an array of angles, the spaces between edges, clockwise.
        // each angle object contains:
        //  - arc angle
        //  - details on the root data (nodes, edges, their angles)
        //  - results from the kawasaki algorithm:
        //     which is the amount in radians to add to each angle to make flat foldable 
        // var adjacentEdges = this.nodes[nodeIndex].adjacent.edges;
        var thisNode = this.nodes[nodeIndex];
        var adjacentEdges = thisNode.planarAdjacent();
        // console.log(adjacentEdges);
        var angles = [];
        for (var i = 0; i < adjacentEdges.length; i++) {
            var nextI = (i + 1) % adjacentEdges.length;
            var angleDiff = adjacentEdges[nextI].angle - adjacentEdges[i].angle;
            if (angleDiff < 0)
                angleDiff += Math.PI * 2;
            angles.push({
                "arc": angleDiff,
                "angles": [adjacentEdges[i].angle, adjacentEdges[nextI].angle],
                "nodes": [adjacentEdges[i].node, adjacentEdges[nextI].node],
                "edges": [adjacentEdges[i].edge, adjacentEdges[nextI].edge]
            });
        }
        var sumEven = 0;
        var sumOdd = 0;
        for (var i = 0; i < angles.length; i++) {
            if (i % 2 == 0) {
                sumEven += angles[i].arc;
            }
            else {
                sumOdd += angles[i].arc;
            }
        }
        var dEven = Math.PI - sumEven;
        var dOdd = Math.PI - sumOdd;
        for (var i = 0; i < angles.length; i++) {
            if (i % 2 == 0) {
                angles[i]["kawasaki"] = dEven * (angles[i].arc / (Math.PI * 2));
            }
            else {
                angles[i]["kawasaki"] = dOdd * (angles[i].arc / (Math.PI * 2));
            }
        }
        return angles;
    };
    CreasePattern.prototype.kawasakiDeviance = function (nodeIndex) {
        var kawasaki = kawasaki(nodeIndex);
        var adjacentEdges = this.nodes[nodeIndex].planarAdjacent();
        var angles = [];
        for (var i = 0; i < adjacentEdges.length; i++) {
            var nextI = (i + 1) % adjacentEdges.length;
            var angleDiff = adjacentEdges[nextI].angle - adjacentEdges[i].angle;
            if (angleDiff < 0)
                angleDiff += Math.PI * 2;
            angles.push({ "arc": angleDiff, "angles": [adjacentEdges[i].angle, adjacentEdges[nextI].angle], "nodes": [i, nextI] });
        }
        return angles;
    };
    // cleanIntersections(){
    // 	this.clean();
    // 	var intersections = super.chop();
    // 	this.interestingPoints = this.interestingPoints.concat(intersections);
    // 	return intersections;
    // }
    CreasePattern.prototype.exportSVG = function (scale) {
        if (scale == undefined || scale <= 0) {
            scale = 1;
        }
        var blob = "";
        blob = blob + "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"" + scale + "px\" height=\"" + scale + "px\" viewBox=\"0 0 " + scale + " " + scale + "\">\n<g>\n";
        //////// RECT BORDER
        blob += "<line stroke=\"#000000\" x1=\"0\" y1=\"0\" x2=\"" + scale + "\" y2=\"0\"/>\n" + "<line fill=\"none\" stroke=\"#000000\" stroke-miterlimit=\"10\" x1=\"" + scale + "\" y1=\"0\" x2=\"" + scale + "\" y2=\"" + scale + "\"/>\n" + "<line fill=\"none\" stroke=\"#000000\" stroke-miterlimit=\"10\" x1=\"" + scale + "\" y1=\"" + scale + "\" x2=\"0\" y2=\"" + scale + "\"/>\n" + "<line fill=\"none\" stroke=\"#000000\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"" + scale + "\" x2=\"0\" y2=\"0\"/>\n";
        ////////
        for (var i = 0; i < this.edges.length; i++) {
            var a = this.edges[i].nodes[0];
            var b = this.edges[i].nodes[1];
            var x1 = (a.x * scale).toFixed(4);
            var y1 = (a.y * scale).toFixed(4);
            var x2 = (b.x * scale).toFixed(4);
            var y2 = (b.y * scale).toFixed(4);
            blob += "<line stroke=\"#000000\" x1=\"" + x1 + "\" y1=\"" + y1 + "\" x2=\"" + x2 + "\" y2=\"" + y2 + "\"/>\n";
        }
        blob = blob + "</g>\n</svg>\n";
        return blob;
    };
    CreasePattern.prototype.appendUniquePoints = function (master, child) {
        var returned = master.slice(0);
        for (var c = 0; c < child.length; c++) {
            var found = false;
            var i = 0;
            while (!found && i < master.length) {
                if (master[i].equivalent(child[c])) {
                    found = true;
                }
                i += 1;
            }
            if (!found) {
                returned.push(child[c]);
            }
        }
        return returned;
    };
    CreasePattern.prototype.kiteBase = function () {
        _super.prototype.clear.call(this);
        this.newPlanarEdge(0.0, 0.0, 0.41421, 0.0).border();
        this.newPlanarEdge(0.41421, 0.0, 1.0, 0.0).border();
        this.newPlanarEdge(1.0, 0.0, 1.0, 0.58578).border();
        this.newPlanarEdge(1.0, 0.58578, 1.0, 1.0).border();
        this.newPlanarEdge(1.0, 1.0, 0.0, 1.0).border();
        this.newPlanarEdge(0.0, 1.0, 0.0, 0.0).border();
        this.newPlanarEdge(1, 0, 0, 1).mountain();
        this.newPlanarEdge(0, 1, 1, 0.58578).valley();
        this.newPlanarEdge(0, 1, 0.41421, 0).valley();
        this.clean();
        return this;
    };
    CreasePattern.prototype.fishBase = function () {
        _super.prototype.clear.call(this);
        this.newPlanarEdge(0.0, 0.0, 0.29289, 0.0).border();
        this.newPlanarEdge(0.29289, 0.0, 1.0, 0.0).border();
        this.newPlanarEdge(1.0, 0.0, 1.0, 0.70711).border();
        this.newPlanarEdge(1.0, 0.70711, 1.0, 1.0).border();
        this.newPlanarEdge(1.0, 1.0, 0.0, 1.0).border();
        this.newPlanarEdge(0.0, 1.0, 0.0, 0.0).border();
        this.newPlanarEdge(1, 0, 0, 1).mountain();
        this.newPlanarEdge(0, 1, 0.70711, 0.70711).valley();
        this.newPlanarEdge(0, 1, 0.29289, 0.29289).valley();
        this.newPlanarEdge(1, 0, 0.29289, 0.29289).valley();
        this.newPlanarEdge(1, 0, 0.70711, 0.70711).valley();
        this.newPlanarEdge(0.29289, 0.29289, 0, 0).valley();
        this.newPlanarEdge(0.70711, 0.70711, 1, 1).valley();
        this.newPlanarEdge(0.70711, 0.70711, 1, 0.70711).mountain();
        this.newPlanarEdge(0.29289, 0.29289, 0.29289, 0).mountain();
        this.clean();
        this.generateFaces();
        return this;
    };
    CreasePattern.prototype.birdBase = function () {
        _super.prototype.clear.call(this);
        this.newPlanarEdge(0.0, 0.0, 0.5, 0.0).border();
        this.newPlanarEdge(0.5, 0.0, 1.0, 0.0).border();
        this.newPlanarEdge(1.0, 0.0, 1.0, 0.5).border();
        this.newPlanarEdge(1.0, 0.5, 1.0, 1.0).border();
        this.newPlanarEdge(1.0, 1.0, 0.5, 1.0).border();
        this.newPlanarEdge(0.5, 1.0, 0.0, 1.0).border();
        this.newPlanarEdge(0.0, 1.0, 0.0, 0.5).border();
        this.newPlanarEdge(0.0, 0.5, 0.0, 0.0).border();
        // eight 22.5 degree lines
        this.newPlanarEdge(0, 1, 0.5, .79290).mountain();
        this.newPlanarEdge(0, 1, .20710, 0.5).mountain();
        this.newPlanarEdge(1, 0, 0.5, .20710).mountain();
        this.newPlanarEdge(1, 0, .79290, 0.5).mountain();
        this.newPlanarEdge(1, 1, .79290, 0.5).mountain();
        this.newPlanarEdge(1, 1, 0.5, .79290).mountain();
        this.newPlanarEdge(0, 0, .20710, 0.5).mountain();
        this.newPlanarEdge(0, 0, 0.5, .20710).mountain();
        // corner 45 degree lines
        this.newPlanarEdge(0, 0, .35354, .35354).valley();
        this.newPlanarEdge(.35354, .64645, 0, 1).valley();
        this.newPlanarEdge(1, 0, .64645, .35354).mountain();
        this.newPlanarEdge(.64645, .64645, 1, 1).valley();
        // center X
        this.newPlanarEdge(0.5, 0.5, .35354, .64645).valley();
        this.newPlanarEdge(.64645, .35354, 0.5, 0.5).mountain();
        this.newPlanarEdge(0.5, 0.5, .64645, .64645).valley();
        this.newPlanarEdge(.35354, .35354, 0.5, 0.5).valley();
        // center ⃟
        this.newPlanarEdge(.35354, .35354, .20710, 0.5).mark();
        this.newPlanarEdge(0.5, .20710, .35354, .35354).mark();
        this.newPlanarEdge(.35354, .64645, 0.5, .79290).mark();
        this.newPlanarEdge(.20710, 0.5, .35354, .64645).mark();
        this.newPlanarEdge(.64645, .64645, .79290, 0.5).mark();
        this.newPlanarEdge(0.5, .79290, .64645, .64645).mark();
        this.newPlanarEdge(.64645, .35354, 0.5, .20710).mark();
        this.newPlanarEdge(.79290, 0.5, .64645, .35354).mark();
        // center +
        this.newPlanarEdge(0.5, 0.5, 0.5, .79290).mountain();
        this.newPlanarEdge(0.5, .20710, 0.5, 0.5).mountain();
        this.newPlanarEdge(0.5, 0.5, .79290, 0.5).mountain();
        this.newPlanarEdge(.20710, 0.5, 0.5, 0.5).mountain();
        // paper edge center connections
        this.newPlanarEdge(0.5, .20710, 0.5, 0).valley();
        this.newPlanarEdge(.79290, 0.5, 1, 0.5).valley();
        this.newPlanarEdge(0.5, .79290, 0.5, 1).valley();
        this.newPlanarEdge(.20710, 0.5, 0, 0.5).valley();
        this.clean();
        return this;
    };
    CreasePattern.prototype.frogBase = function () {
        this.newPlanarEdge(0, 0, .14646, .35353);
        this.newPlanarEdge(0, 0, .35353, .14646);
        this.newPlanarEdge(.14646, .35353, 0.5, 0.5);
        this.newPlanarEdge(0.5, 0.5, .35353, .14646);
        this.newPlanarEdge(.14646, .35353, .14646, 0.5);
        this.newPlanarEdge(0, 0.5, .14646, 0.5);
        this.newPlanarEdge(0.5, 0.5, 0.5, .14646);
        this.newPlanarEdge(0.5, .14646, 0.5, 0);
        this.newPlanarEdge(0.5, 0, .35353, .14646);
        this.newPlanarEdge(.35353, .14646, 0.5, .14646);
        this.newPlanarEdge(.14646, .35353, 0, 0.5);
        this.newPlanarEdge(.14646, .35353, .25, .25);
        this.newPlanarEdge(.25, .25, .35353, .14646);
        this.newPlanarEdge(0, 1, .35353, .85353);
        this.newPlanarEdge(0, 1, .14646, .64646);
        this.newPlanarEdge(.35353, .85353, 0.5, 0.5);
        this.newPlanarEdge(0.5, 0.5, .14646, .64646);
        this.newPlanarEdge(.35353, .85353, 0.5, .85353);
        this.newPlanarEdge(0.5, 1, 0.5, .85353);
        this.newPlanarEdge(0.5, 0.5, 0.5, .85353);
        this.newPlanarEdge(0.5, 0.5, .14646, 0.5);
        this.newPlanarEdge(0, 0.5, .14646, .64646);
        this.newPlanarEdge(.14646, .64646, .14646, 0.5);
        this.newPlanarEdge(.35353, .85353, 0.5, 1);
        this.newPlanarEdge(.35353, .85353, .25, .75);
        this.newPlanarEdge(.25, .75, .14646, .64646);
        this.newPlanarEdge(1, 0, .85353, .35353);
        this.newPlanarEdge(1, 0, .64646, .14646);
        this.newPlanarEdge(.85353, .35353, 0.5, 0.5);
        this.newPlanarEdge(0.5, 0.5, .64646, .14646);
        this.newPlanarEdge(.85353, .35353, .85353, 0.5);
        this.newPlanarEdge(1, 0.5, .85353, 0.5);
        this.newPlanarEdge(0.5, 0, .64646, .14646);
        this.newPlanarEdge(.64646, .14646, 0.5, .14646);
        this.newPlanarEdge(.85353, .35353, 1, 0.5);
        this.newPlanarEdge(.85353, .35353, .75, .25);
        this.newPlanarEdge(.75, .25, .64646, .14646);
        this.newPlanarEdge(1, 1, .64646, .85353);
        this.newPlanarEdge(1, 1, .85353, .64646);
        this.newPlanarEdge(.64646, .85353, 0.5, 0.5);
        this.newPlanarEdge(0.5, 0.5, .85353, .64646);
        this.newPlanarEdge(.64646, .85353, 0.5, .85353);
        this.newPlanarEdge(0.5, 0.5, .85353, 0.5);
        this.newPlanarEdge(1, 0.5, .85353, .64646);
        this.newPlanarEdge(.85353, .64646, .85353, 0.5);
        this.newPlanarEdge(.64646, .85353, 0.5, 1);
        this.newPlanarEdge(.64646, .85353, .75, .75);
        this.newPlanarEdge(.75, .75, .85353, .64646);
        this.newPlanarEdge(.35353, .14646, .35353, 0);
        this.newPlanarEdge(.64646, .14646, .64646, 0);
        this.newPlanarEdge(.85353, .35353, 1, .35353);
        this.newPlanarEdge(.85353, .64646, 1, .64646);
        this.newPlanarEdge(.64646, .85353, .64646, 1);
        this.newPlanarEdge(.35353, .85353, .35353, 1);
        this.newPlanarEdge(.14646, .64646, 0, .64646);
        this.newPlanarEdge(.14646, .35353, 0, .35353);
        this.newPlanarEdge(0.5, 0.5, .25, .25);
        this.newPlanarEdge(0.5, 0.5, .75, .25);
        this.newPlanarEdge(0.5, 0.5, .75, .75);
        this.newPlanarEdge(0.5, 0.5, .25, .75);
        this.newPlanarEdge(.25, .75, 0, 1);
        this.newPlanarEdge(.25, .25, 0, 0);
        this.newPlanarEdge(.75, .25, 1, 0);
        this.newPlanarEdge(.75, .75, 1, 1);
        this.chop();
        this.clean();
        return this;
    };
    return CreasePattern;
}(PlanarGraph));
