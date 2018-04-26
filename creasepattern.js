"use strict";
System.register("src/graph", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var GraphClean, GraphNode, GraphEdge, Graph, Multigraph;
    return {
        setters: [],
        execute: function () {
            GraphClean = class GraphClean {
                constructor(numNodes, numEdges) {
                    this.nodes = { total: 0, isolated: 0 };
                    this.edges = { total: 0, duplicate: 0, circular: 0 };
                    if (numNodes !== undefined) {
                        this.nodes.total = numNodes;
                    }
                    if (numEdges !== undefined) {
                        this.edges.total = numEdges;
                    }
                }
                join(report) {
                    this.nodes.total += report.nodes.total;
                    this.edges.total += report.edges.total;
                    this.nodes.isolated += report.nodes.isolated;
                    this.edges.duplicate += report.edges.duplicate;
                    this.edges.circular += report.edges.circular;
                    return this;
                }
                isolatedNodes(num) { this.nodes.isolated = num; this.nodes.total += num; return this; }
                duplicateEdges(num) { this.edges.duplicate = num; this.edges.total += num; return this; }
                circularEdges(num) { this.edges.circular = num; this.edges.total += num; return this; }
            };
            exports_1("GraphClean", GraphClean);
            GraphNode = class GraphNode {
                constructor(graph) { this.graph = graph; }
                adjacentEdges() {
                    return this.graph.edges.filter(function (el) {
                        return el.nodes[0] === this || el.nodes[1] === this;
                    }, this);
                }
                adjacentNodes() {
                    var checked = [];
                    return this.adjacentEdges()
                        .filter(function (el) { return !el.isCircular(); })
                        .map(function (el) {
                        if (el.nodes[0] === this) {
                            return el.nodes[1];
                        }
                        return el.nodes[0];
                    }, this)
                        .filter(function (el) {
                        return checked.indexOf(el) >= 0 ? false : checked.push(el);
                    }, this);
                }
                isAdjacentToNode(node) {
                    return (this.graph.getEdgeConnectingNodes(this, node) !== undefined);
                }
                degree() {
                    return this.graph.edges.map(function (el) {
                        var sum = 0;
                        if (el.nodes[0] === this) {
                            sum += 1;
                        }
                        if (el.nodes[1] === this) {
                            sum += 1;
                        }
                        return sum;
                    }, this).reduce(function (a, b) { return a + b; });
                }
            };
            exports_1("GraphNode", GraphNode);
            GraphEdge = class GraphEdge {
                constructor(graph, node1, node2) {
                    this.graph = graph;
                    this.nodes = [node1, node2];
                }
                adjacentEdges() {
                    return this.graph.edges
                        .filter(function (el) {
                        return el !== this &&
                            (el.nodes[0] === this.nodes[0] ||
                                el.nodes[0] === this.nodes[1] ||
                                el.nodes[1] === this.nodes[0] ||
                                el.nodes[1] === this.nodes[1]);
                    }, this);
                }
                adjacentNodes() {
                    return [this.nodes[0], this.nodes[1]];
                }
                isAdjacentToEdge(edge) {
                    return ((this.nodes[0] === edge.nodes[0]) || (this.nodes[1] === edge.nodes[1]) ||
                        (this.nodes[0] === edge.nodes[1]) || (this.nodes[1] === edge.nodes[0]));
                }
                isSimilarToEdge(edge) {
                    return ((this.nodes[0] === edge.nodes[0] && this.nodes[1] === edge.nodes[1]) ||
                        (this.nodes[0] === edge.nodes[1] && this.nodes[1] === edge.nodes[0]));
                }
                otherNode(node) {
                    if (this.nodes[0] === node) {
                        return this.nodes[1];
                    }
                    if (this.nodes[1] === node) {
                        return this.nodes[0];
                    }
                    return undefined;
                }
                isCircular() { return this.nodes[0] === this.nodes[1]; }
                duplicateEdges() {
                    return this.graph.edges.filter(function (el) {
                        return this.isSimilarToEdge(el);
                    }, this);
                }
                commonNodeWithEdge(otherEdge) {
                    if (this === otherEdge)
                        return undefined;
                    if (this.nodes[0] === otherEdge.nodes[0] || this.nodes[0] === otherEdge.nodes[1])
                        return this.nodes[0];
                    if (this.nodes[1] === otherEdge.nodes[0] || this.nodes[1] === otherEdge.nodes[1])
                        return this.nodes[1];
                    return undefined;
                }
                uncommonNodeWithEdge(otherEdge) {
                    if (this === otherEdge)
                        return undefined;
                    if (this.nodes[0] === otherEdge.nodes[0] || this.nodes[0] === otherEdge.nodes[1])
                        return this.nodes[1];
                    if (this.nodes[1] === otherEdge.nodes[0] || this.nodes[1] === otherEdge.nodes[1])
                        return this.nodes[0];
                    return undefined;
                }
            };
            exports_1("GraphEdge", GraphEdge);
            Graph = class Graph {
                constructor() {
                    this.nodeType = GraphNode;
                    this.edgeType = GraphEdge;
                    this.clear();
                }
                copy() {
                    this.nodeArrayDidChange();
                    this.edgeArrayDidChange();
                    var g = new Graph();
                    for (var i = 0; i < this.nodes.length; i++) {
                        var n = g.addNode(new GraphNode(g));
                        Object.assign(n, this.nodes[i]);
                        n.graph = g;
                        n.index = i;
                    }
                    for (var i = 0; i < this.edges.length; i++) {
                        var index = [this.edges[i].nodes[0].index, this.edges[i].nodes[1].index];
                        var e = g.addEdge(new GraphEdge(g, g.nodes[index[0]], g.nodes[index[1]]));
                        Object.assign(e, this.edges[i]);
                        e.graph = g;
                        e.index = i;
                        e.nodes = [g.nodes[index[0]], g.nodes[index[1]]];
                    }
                    return g;
                }
                newNode() {
                    return this.addNode(new this.nodeType(this));
                }
                newEdge(node1, node2) {
                    return this.addEdge(new this.edgeType(this, node1, node2));
                }
                addNode(node) {
                    if (node == undefined) {
                        throw "addNode() requires an argument: 1 GraphNode";
                    }
                    node.graph = this;
                    node.index = this.nodes.length;
                    this.nodes.push(node);
                    return node;
                }
                addEdge(edge) {
                    if (edge.nodes[0] === undefined ||
                        edge.nodes[1] === undefined ||
                        edge.nodes[0].graph !== this ||
                        edge.nodes[1].graph !== this) {
                        return undefined;
                    }
                    edge.graph = this;
                    edge.index = this.edges.length;
                    this.edges.push(edge);
                    return edge;
                }
                addNodes(nodes) {
                    if (nodes === undefined || nodes.length <= 0) {
                        throw "addNodes() must contain array of GraphNodes";
                    }
                    var len = this.nodes.length;
                    var checkedNodes = nodes.filter(function (el) { return (el instanceof GraphNode); });
                    this.nodes = this.nodes.concat(checkedNodes);
                    for (var i = len; i < this.nodes.length; i++) {
                        this.nodes[i].graph = this;
                        this.nodes[i].index = i;
                    }
                    return this.nodes.length - len;
                }
                addEdges(edges) {
                    if (edges == undefined || edges.length <= 0) {
                        throw "addEdges() must contain array of GraphEdges";
                    }
                    var len = this.edges.length;
                    var checkedEdges = edges.filter(function (el) { return (el instanceof GraphEdge); });
                    this.edges = this.edges.concat(checkedEdges);
                    for (var i = len; i < this.edges.length; i++) {
                        this.edges[i].graph = this;
                    }
                    this.cleanGraph();
                    return this.edges.length - len;
                }
                copyNode(node) {
                    var nodeClone = Object.assign(this.newNode(), node);
                    return this.addNode(nodeClone);
                }
                copyEdge(edge) {
                    var edgeClone = Object.assign(this.newEdge(edge.nodes[0], edge.nodes[1]), edge);
                    return this.addEdge(edgeClone);
                }
                clear() {
                    this.nodes = [];
                    this.edges = [];
                    return this;
                }
                removeEdge(edge) {
                    var edgesLength = this.edges.length;
                    this.edges = this.edges.filter(function (el) { return el !== edge; });
                    this.edgeArrayDidChange();
                    return new GraphClean(undefined, edgesLength - this.edges.length);
                }
                removeEdgeBetween(node1, node2) {
                    var edgesLength = this.edges.length;
                    this.edges = this.edges.filter(function (el) {
                        return !((el.nodes[0] === node1 && el.nodes[1] === node2) ||
                            (el.nodes[0] === node2 && el.nodes[1] === node1));
                    });
                    this.edgeArrayDidChange();
                    return new GraphClean(undefined, edgesLength - this.edges.length);
                }
                removeNode(node) {
                    var nodesLength = this.nodes.length;
                    var edgesLength = this.edges.length;
                    this.nodes = this.nodes.filter(function (el) { return el !== node; });
                    this.edges = this.edges.filter(function (el) { return el.nodes[0] !== node && el.nodes[1] !== node; });
                    if (this.edges.length != edgesLength) {
                        this.edgeArrayDidChange();
                    }
                    if (this.nodes.length != nodesLength) {
                        this.nodeArrayDidChange();
                    }
                    return new GraphClean(nodesLength - this.nodes.length, edgesLength - this.edges.length);
                }
                mergeNodes(node1, node2) {
                    if (node1 === node2) {
                        return undefined;
                    }
                    this.edges = this.edges.map(function (el) {
                        if (el.nodes[0] === node2) {
                            el.nodes[0] = node1;
                        }
                        if (el.nodes[1] === node2) {
                            el.nodes[1] = node1;
                        }
                        return el;
                    });
                    var nodesLength = this.nodes.length;
                    this.nodes = this.nodes.filter(function (el) { return el !== node2; });
                    return new GraphClean(nodesLength - this.nodes.length).join(this.cleanGraph());
                }
                removeIsolatedNodes() {
                    this.nodeArrayDidChange();
                    var nodeDegree = [];
                    for (var i = 0; i < this.nodes.length; i++) {
                        nodeDegree[i] = false;
                    }
                    for (var i = 0; i < this.edges.length; i++) {
                        nodeDegree[this.edges[i].nodes[0].index] = true;
                        nodeDegree[this.edges[i].nodes[1].index] = true;
                    }
                    var nodeLength = this.nodes.length;
                    this.nodes = this.nodes.filter(function (el, i) { return nodeDegree[i]; });
                    var isolatedCount = nodeLength - this.nodes.length;
                    if (isolatedCount > 0) {
                        this.nodeArrayDidChange();
                    }
                    return new GraphClean().isolatedNodes(isolatedCount);
                }
                cleanCircularEdges() {
                    var edgesLength = this.edges.length;
                    this.edges = this.edges.filter(function (el) { return !(el.nodes[0] === el.nodes[1]); });
                    if (this.edges.length != edgesLength) {
                        this.edgeArrayDidChange();
                    }
                    return new GraphClean().circularEdges(edgesLength - this.edges.length);
                }
                cleanDuplicateEdges() {
                    var count = 0;
                    for (var i = 0; i < this.edges.length - 1; i++) {
                        for (var j = this.edges.length - 1; j > i; j--) {
                            if (this.edges[i].isSimilarToEdge(this.edges[j])) {
                                this.edges.splice(j, 1);
                                count += 1;
                            }
                        }
                    }
                    if (count > 0) {
                        this.edgeArrayDidChange();
                    }
                    return new GraphClean().duplicateEdges(count);
                }
                cleanGraph() {
                    this.edgeArrayDidChange();
                    this.nodeArrayDidChange();
                    return this.cleanDuplicateEdges().join(this.cleanCircularEdges());
                }
                clean() {
                    return this.cleanGraph();
                }
                getEdgeConnectingNodes(node1, node2) {
                    for (var i = 0; i < this.edges.length; i++) {
                        if ((this.edges[i].nodes[0] === node1 && this.edges[i].nodes[1] === node2) ||
                            (this.edges[i].nodes[0] === node2 && this.edges[i].nodes[1] === node1)) {
                            return this.edges[i];
                        }
                    }
                    return undefined;
                }
                getEdgesConnectingNodes(node1, node2) {
                    return this.edges.filter(function (el) {
                        return (el.nodes[0] === node1 && el.nodes[1] === node2) ||
                            (el.nodes[0] === node2 && el.nodes[1] === node1);
                    });
                }
                nodeArrayDidChange() { for (var i = 0; i < this.nodes.length; i++) {
                    this.nodes[i].index = i;
                } }
                edgeArrayDidChange() { for (var i = 0; i < this.edges.length; i++) {
                    this.edges[i].index = i;
                } }
            };
            exports_1("Graph", Graph);
            Multigraph = class Multigraph extends Graph {
                cleanGraph() {
                    this.edgeArrayDidChange();
                    this.nodeArrayDidChange();
                    return new GraphClean();
                }
            };
        }
    };
});
var EPSILON_LOW = 0.003;
var EPSILON = 0.00001;
var EPSILON_HIGH = 0.00000001;
var EPSILON_UI = 0.05;
function isValidPoint(point) { return (point !== undefined && !isNaN(point.x) && !isNaN(point.y)); }
function isValidNumber(n) { return (n !== undefined && !isNaN(n) && !isNaN(n)); }
function pointsSimilar(a, b, epsilon) {
    if (epsilon === undefined) {
        epsilon = EPSILON_HIGH;
    }
    return epsilonEqual(a.x, b.x, epsilon) && epsilonEqual(a.y, b.y, epsilon);
}
function map(input, fl1, ceil1, fl2, ceil2) {
    return ((input - fl1) / (ceil1 - fl1)) * (ceil2 - fl2) + fl2;
}
function epsilonEqual(a, b, epsilon) {
    if (epsilon === undefined) {
        epsilon = EPSILON_HIGH;
    }
    return (Math.abs(a - b) < epsilon);
}
function wholeNumberify(num, epsilon) {
    if (epsilon === undefined) {
        epsilon = EPSILON_HIGH;
    }
    if (Math.abs(Math.round(num) - num) < epsilon) {
        num = Math.round(num);
    }
    return num;
}
function clockwiseInteriorAngleRadians(a, b) {
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
function clockwiseInteriorAngle(a, b) {
    var dotProduct = b.x * a.x + b.y * a.y;
    var determinant = b.x * a.y - b.y * a.x;
    var angle = Math.atan2(determinant, dotProduct);
    if (angle < 0) {
        angle += Math.PI * 2;
    }
    return angle;
}
function interiorAngles(a, b) {
    var interior1 = clockwiseInteriorAngle(a, b);
    var interior2 = Math.PI * 2 - interior1;
    if (interior1 < interior2)
        return [interior1, interior2];
    return [interior2, interior1];
}
function bisect(a, b) {
    a = a.normalize();
    b = b.normalize();
    return [(a.add(b)).normalize(),
        new XY(-a.x + -b.x, -a.y + -b.y).normalize()];
}
function determinantXY(a, b) {
    return a.x * b.y - b.x * a.y;
}
function intersect_vec_func(aOrigin, aVec, bOrigin, bVec, compFunction, epsilon) {
    var denominator0 = determinantXY(aVec, bVec);
    var denominator1 = -denominator0;
    if (epsilonEqual(denominator0, 0, epsilon)) {
        return undefined;
    }
    var numerator0 = determinantXY(bOrigin.subtract(aOrigin), bVec);
    var numerator1 = determinantXY(aOrigin.subtract(bOrigin), aVec);
    var t0 = numerator0 / denominator0;
    var t1 = numerator1 / denominator1;
    if (compFunction(t0, t1)) {
        return aOrigin.add(aVec.scale(t0));
    }
}
function intersectionLineLine(a, b, epsilon) {
    if (epsilon === undefined) {
        epsilon = EPSILON_HIGH;
    }
    return intersect_vec_func(new XY(a.point.x, a.point.y), new XY(a.direction.x, a.direction.y), new XY(b.point.x, b.point.y), new XY(b.direction.x, b.direction.y), function (t0, t1) { return true; }, epsilon);
}
function intersectionLineRay(line, ray, epsilon) {
    if (epsilon === undefined) {
        epsilon = EPSILON_HIGH;
    }
    return intersect_vec_func(new XY(line.point.x, line.point.y), new XY(line.direction.x, line.direction.y), new XY(ray.origin.x, ray.origin.y), new XY(ray.direction.x, ray.direction.y), function (t0, t1) { return t1 >= 0; }, epsilon);
}
function intersectionLineEdge(line, edge, epsilon) {
    if (epsilon === undefined) {
        epsilon = EPSILON_HIGH;
    }
    return intersect_vec_func(new XY(line.point.x, line.point.y), new XY(line.direction.x, line.direction.y), new XY(edge.nodes[0].x, edge.nodes[0].y), new XY(edge.nodes[1].x - edge.nodes[0].x, edge.nodes[1].y - edge.nodes[0].y), function (t0, t1) { return t1 >= 0 && t1 <= 1; }, epsilon);
}
function intersectionRayRay(a, b, epsilon) {
    if (epsilon === undefined) {
        epsilon = EPSILON_HIGH;
    }
    return intersect_vec_func(new XY(a.origin.x, a.origin.y), new XY(a.direction.x, a.direction.y), new XY(b.origin.x, b.origin.y), new XY(b.direction.x, b.direction.y), function (t0, t1) { return t0 >= 0 && t1 >= 0; }, epsilon);
}
function intersectionRayEdge(ray, edge, epsilon) {
    if (epsilon === undefined) {
        epsilon = EPSILON_HIGH;
    }
    return intersect_vec_func(new XY(ray.origin.x, ray.origin.y), new XY(ray.direction.x, ray.direction.y), new XY(edge.nodes[0].x, edge.nodes[0].y), new XY(edge.nodes[1].x - edge.nodes[0].x, edge.nodes[1].y - edge.nodes[0].y), function (t0, t1) { return t0 >= 0 && t1 >= 0 && t1 <= 1; }, epsilon);
}
function intersectionEdgeEdge(a, b, epsilon) {
    if (epsilon === undefined) {
        epsilon = EPSILON_HIGH;
    }
    return intersect_vec_func(new XY(a.nodes[0].x, a.nodes[0].y), new XY(a.nodes[1].x - a.nodes[0].x, a.nodes[1].y - a.nodes[0].y), new XY(b.nodes[0].x, b.nodes[0].y), new XY(b.nodes[1].x - b.nodes[0].x, b.nodes[1].y - b.nodes[0].y), function (t0, t1) { return t0 >= 0 && t0 <= 1 && t1 >= 0 && t1 <= 1; }, epsilon);
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
class Matrix {
    constructor(a, b, c, d, tx, ty) {
        this.a = (a !== undefined) ? a : 1;
        this.b = (b !== undefined) ? b : 0;
        this.c = (c !== undefined) ? c : 0;
        this.d = (d !== undefined) ? d : 1;
        this.tx = (tx !== undefined) ? tx : 0;
        this.ty = (ty !== undefined) ? ty : 0;
    }
    identity() { this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.tx = 0; this.ty = 0; }
    mult(mat) {
        var r = new Matrix();
        r.a = this.a * mat.a + this.c * mat.b;
        r.c = this.a * mat.c + this.c * mat.d;
        r.tx = this.a * mat.tx + this.c * mat.ty + this.tx;
        r.b = this.b * mat.a + this.d * mat.b;
        r.d = this.b * mat.c + this.d * mat.d;
        r.ty = this.b * mat.tx + this.d * mat.ty + this.ty;
        return r;
    }
    reflection(vector, offset) {
        var angle = Math.atan2(vector.y, vector.x);
        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);
        var _cosAngle = Math.cos(-angle);
        var _sinAngle = Math.sin(-angle);
        this.a = cosAngle * _cosAngle + sinAngle * _sinAngle;
        this.b = cosAngle * -_sinAngle + sinAngle * _cosAngle;
        this.c = sinAngle * _cosAngle + -cosAngle * _sinAngle;
        this.d = sinAngle * -_sinAngle + -cosAngle * _cosAngle;
        if (offset !== undefined) {
            this.tx = offset.x + this.a * -offset.x + -offset.y * this.c;
            this.ty = offset.y + this.b * -offset.x + -offset.y * this.d;
        }
        return this;
    }
    rotation(angle, origin) {
        this.a = Math.cos(angle);
        this.c = -Math.sin(angle);
        this.b = Math.sin(angle);
        this.d = Math.cos(angle);
        if (origin !== undefined) {
            this.tx = origin.x;
            this.ty = origin.y;
        }
        return this;
    }
    copy() {
        var m = new Matrix();
        m.a = this.a;
        m.c = this.c;
        m.tx = this.tx;
        m.b = this.b;
        m.d = this.d;
        m.ty = this.ty;
        return m;
    }
}
class XY {
    constructor(x, y) { this.x = x; this.y = y; }
    normalize() { var m = this.magnitude(); return new XY(this.x / m, this.y / m); }
    rotate90() { return new XY(-this.y, this.x); }
    rotate270() { return new XY(this.y, -this.x); }
    rotate(angle, origin) {
        return this.transform(new Matrix().rotation(angle, origin));
    }
    dot(point) { return this.x * point.x + this.y * point.y; }
    cross(vector) { return this.x * vector.y - this.y * vector.x; }
    magnitude() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    distanceTo(a) { return Math.sqrt(Math.pow(this.x - a.x, 2) + Math.pow(this.y - a.y, 2)); }
    equivalent(point, epsilon) {
        if (epsilon == undefined) {
            epsilon = EPSILON_HIGH;
        }
        return (epsilonEqual(this.x, point.x, epsilon) && epsilonEqual(this.y, point.y, epsilon));
    }
    transform(matrix) {
        return new XY(this.x * matrix.a + this.y * matrix.c + matrix.tx, this.x * matrix.b + this.y * matrix.d + matrix.ty);
    }
    lerp(point, pct) {
        var inv = 1.0 - pct;
        return new XY(this.x * pct + point.x * inv, this.y * pct + point.y * inv);
    }
    angleLerp(point, pct) {
        function shortAngleDist(a0, a1) {
            var max = Math.PI * 2;
            var da = (a1 - a0) % max;
            return 2 * da % max - da;
        }
        var thisAngle = Math.atan2(this.y, this.x);
        var pointAngle = Math.atan2(point.y, point.x);
        var newAngle = thisAngle + shortAngleDist(thisAngle, pointAngle) * pct;
        return new XY(Math.cos(newAngle), Math.sin(newAngle));
    }
    reflect(line) {
        var origin, vector;
        if (line.direction !== undefined) {
            origin = line.point || line.origin;
            vector = line.direction;
        }
        else if (line.nodes !== undefined) {
            origin = new XY(line.nodes[0].x, line.nodes[0].y);
            vector = new XY(line.nodes[1].x, line.nodes[1].y).subtract(origin);
        }
        else {
            return undefined;
        }
        return this.transform(new Matrix().reflection(vector, origin));
    }
    scale(magnitude) { return new XY(this.x * magnitude, this.y * magnitude); }
    add(point) { return new XY(this.x + point.x, this.y + point.y); }
    subtract(sub) { return new XY(this.x - sub.x, this.y - sub.y); }
    multiply(m) { return new XY(this.x * m.x, this.y * m.y); }
    midpoint(other) { return new XY((this.x + other.x) * 0.5, (this.y + other.y) * 0.5); }
    abs() { return new XY(Math.abs(this.x), Math.abs(this.y)); }
}
class LineType {
    length() { }
    vector() { }
    parallel(line, epsilon) { }
    collinear(point) { }
    equivalent(line, epsilon) { }
    intersection(line) { }
    reflectionMatrix() { }
    nearestPoint(point) { }
    nearestPointNormalTo(point) { }
    transform(matrix) { }
    degenrate(epsilon) { }
}
class Line {
    constructor(a, b, c, d) {
        if (b instanceof XY) {
            this.point = a;
            this.direction = b;
        }
        else if (a.x !== undefined) {
            this.point = new XY(a.x, a.y);
            this.direction = new XY(b.x, b.y);
        }
        else {
            this.point = new XY(a, b);
            this.direction = new XY(c, d);
        }
    }
    length() { return Infinity; }
    vector() { return this.direction; }
    parallel(line, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        var v = (line.nodes !== undefined) ? line.nodes[1].subtract(line.nodes[0]) : line.direction;
        return (v !== undefined) ? epsilonEqual(this.direction.cross(v), 0, epsilon) : undefined;
    }
    collinear(point, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        var x = [this.point.x, this.point.x + this.direction.x, point.x];
        var y = [this.point.y, this.point.y + this.direction.y, point.y];
        return epsilonEqual(x[0] * (y[1] - y[2]) + x[1] * (y[2] - y[0]) + x[2] * (y[0] - y[1]), 0, epsilon);
    }
    equivalent(line, epsilon) {
        return this.collinear(line.point, epsilon) && this.parallel(line, epsilon);
    }
    intersection(line) {
        if (line instanceof Line) {
            return intersectionLineLine(this, line);
        }
        if (line instanceof Ray) {
            return intersectionLineRay(this, line);
        }
        if (line instanceof Edge) {
            return intersectionLineEdge(this, line);
        }
    }
    reflectionMatrix() { return new Matrix().reflection(this.direction, this.point); }
    nearestPoint(point) { return this.nearestPointNormalTo(point); }
    nearestPointNormalTo(point) {
        var v = this.direction.normalize();
        var u = ((point.x - this.point.x) * v.x + (point.y - this.point.y) * v.y);
        return new XY(this.point.x + u * v.x, this.point.y + u * v.y);
    }
    transform(matrix) {
        return new Line(this.point.transform(matrix), this.direction.transform(matrix));
    }
    degenrate(epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        return epsilonEqual(this.direction.magnitude(), 0, epsilon);
    }
}
class Ray {
    constructor(a, b, c, d) {
        if (a instanceof XY) {
            this.origin = a;
            this.direction = b;
        }
        else if (a.x !== undefined) {
            this.origin = new XY(a.x, a.y);
            this.direction = new XY(b.x, b.y);
        }
        else {
            this.origin = new XY(a, b);
            this.direction = new XY(c, d);
        }
        ;
    }
    length() { return Infinity; }
    vector() { return this.direction; }
    parallel(line, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        var v = (line.nodes !== undefined) ? line.nodes[1].subtract(line.nodes[0]) : line.direction;
        if (v === undefined) {
            return undefined;
        }
        return epsilonEqual(this.direction.cross(v), 0, epsilon);
    }
    collinear(point, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        var pOrigin = new XY(point.x - this.origin.x, point.y - this.origin.y);
        var dot = pOrigin.dot(this.direction);
        if (dot < -epsilon) {
            return false;
        }
        var cross = pOrigin.cross(this.direction);
        return epsilonEqual(cross, 0, epsilon);
    }
    equivalent(ray, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        return (this.origin.equivalent(ray.origin, epsilon) &&
            this.direction.normalize().equivalent(ray.direction.normalize(), epsilon));
    }
    intersection(line) {
        if (line instanceof Ray) {
            return intersectionRayRay(this, line);
        }
        if (line instanceof Line) {
            return intersectionLineRay(line, this);
        }
        if (line instanceof Edge) {
            return intersectionRayEdge(this, line);
        }
    }
    reflectionMatrix() { return new Matrix().reflection(this.direction, this.origin); }
    nearestPoint(point) {
        var answer = this.nearestPointNormalTo(point);
        if (answer !== undefined) {
            return answer;
        }
        return this.origin;
    }
    nearestPointNormalTo(point) {
        var v = this.direction.normalize();
        var u = ((point.x - this.origin.x) * v.x + (point.y - this.origin.y) * v.y);
        if (u < 0) {
            return undefined;
        }
        return new XY(this.origin.x + u * v.x, this.origin.y + u * v.y);
    }
    transform(matrix) {
        return new Ray(this.origin.transform(matrix), this.direction.transform(matrix));
    }
    degenrate(epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        return epsilonEqual(this.direction.magnitude(), 0, epsilon);
    }
    flip() { return new Ray(this.origin, new XY(-this.direction.x, -this.direction.y)); }
    clipWithEdge(edge, epsilon) {
        var intersect = intersectionRayEdge(this, edge, epsilon);
        if (intersect === undefined) {
            return undefined;
        }
        return new Edge(this.origin, intersect);
    }
    clipWithEdges(edges, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        return edges
            .map(function (edge) { return this.clipWithEdge(edge); }, this)
            .filter(function (edge) { return edge !== undefined; })
            .map(function (edge) { return { edge: edge, length: edge.length() }; })
            .filter(function (el) { return el.length > epsilon; })
            .sort(function (a, b) { return a.length - b.length; })
            .map(function (el) { return el.edge; });
    }
    clipWithEdgesDetails(edges, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        return edges
            .map(function (edge) { return { 'edge': this.clipWithEdge(edge), 'intersection': edge }; }, this)
            .filter(function (el) { return el.edge !== undefined; })
            .map(function (el) {
            return {
                'edge': el.edge,
                'intersection': el.intersection,
                'length': el.edge.length()
            };
        })
            .filter(function (el) { return el.length > epsilon; })
            .sort(function (a, b) { return a.length - b.length; })
            .map(function (el) { return { edge: el.edge, intersection: el.intersection }; });
    }
}
class Edge {
    constructor(a, b, c, d) {
        if (a instanceof XY) {
            this.nodes = [a, b];
        }
        else if (a.x !== undefined) {
            this.nodes = [new XY(a.x, a.y), new XY(b.x, b.y)];
        }
        else if (isValidNumber(d)) {
            this.nodes = [new XY(a, b), new XY(c, d)];
        }
        else if (a.nodes !== undefined) {
            this.nodes = [new XY(a.nodes[0].x, a.nodes[0].y), new XY(a.nodes[1].x, a.nodes[1].y)];
        }
    }
    length() { return Math.sqrt(Math.pow(this.nodes[0].x - this.nodes[1].x, 2) + Math.pow(this.nodes[0].y - this.nodes[1].y, 2)); }
    vector(originNode) {
        if (originNode === undefined) {
            return this.nodes[1].subtract(this.nodes[0]);
        }
        if (this.nodes[0].equivalent(originNode)) {
            return this.nodes[1].subtract(this.nodes[0]);
        }
        return this.nodes[0].subtract(this.nodes[1]);
    }
    parallel(line, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        var v = (line.nodes !== undefined) ? line.nodes[1].subtract(line.nodes[0]) : line.direction;
        if (v === undefined) {
            return undefined;
        }
        var u = this.nodes[1].subtract(this.nodes[0]);
        return epsilonEqual(u.cross(v), 0, epsilon);
    }
    collinear(point, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        var p0 = new Edge(point, this.nodes[0]).length();
        var p1 = new Edge(point, this.nodes[1]).length();
        return epsilonEqual(this.length() - p0 - p1, 0, epsilon);
    }
    equivalent(e, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        return ((this.nodes[0].equivalent(e.nodes[0], epsilon) &&
            this.nodes[1].equivalent(e.nodes[1], epsilon)) ||
            (this.nodes[0].equivalent(e.nodes[1], epsilon) &&
                this.nodes[1].equivalent(e.nodes[0], epsilon)));
    }
    intersection(line) {
        if (line instanceof Line) {
            return intersectionLineEdge(line, this);
        }
        if (line instanceof Ray) {
            return intersectionRayEdge(line, this);
        }
        if (line instanceof Edge) {
            return intersectionEdgeEdge(this, line);
        }
    }
    reflectionMatrix() {
        return new Matrix().reflection(this.nodes[1].subtract(this.nodes[0]), this.nodes[0]);
    }
    nearestPoint(point) {
        var answer = this.nearestPointNormalTo(point);
        if (answer !== undefined) {
            return answer;
        }
        return this.nodes
            .map(function (el) { return { point: el, distance: el.distanceTo(point) }; }, this)
            .sort(function (a, b) { return a.distance - b.distance; })
            .shift()
            .point;
    }
    nearestPointNormalTo(point) {
        var p = this.nodes[0].distanceTo(this.nodes[1]);
        var u = ((point.x - this.nodes[0].x) * (this.nodes[1].x - this.nodes[0].x) + (point.y - this.nodes[0].y) * (this.nodes[1].y - this.nodes[0].y)) / (Math.pow(p, 2));
        if (u < 0 || u > 1.0) {
            return undefined;
        }
        return new XY(this.nodes[0].x + u * (this.nodes[1].x - this.nodes[0].x), this.nodes[0].y + u * (this.nodes[1].y - this.nodes[0].y));
    }
    transform(matrix) {
        return new Edge(this.nodes[0].transform(matrix), this.nodes[1].transform(matrix));
    }
    degenrate(epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        return this.nodes[0].equivalent(this.nodes[1], epsilon);
    }
    midpoint() {
        return new XY(0.5 * (this.nodes[0].x + this.nodes[1].x), 0.5 * (this.nodes[0].y + this.nodes[1].y));
    }
    pointVectorForm() { return new Line(this.nodes[0], this.nodes[1].subtract(this.nodes[0])); }
}
class Polyline {
    constructor() { this.nodes = []; }
    edges() {
        var result = [];
        for (var i = 0; i < this.nodes.length - 1; i++) {
            result.push(new Edge(this.nodes[i], this.nodes[i + 1]));
        }
        return result;
    }
    rayReflectRepeat(ray, intersectable, target) {
        const REFLECT_LIMIT = 100;
        var clips = [];
        var firstClips = ray.clipWithEdgesDetails(intersectable);
        if (target !== undefined &&
            epsilonEqual(ray.direction.cross(target.subtract(ray.origin)), 0, EPSILON_HIGH)) {
            if (firstClips.length === 0 ||
                ray.origin.distanceTo(target) < firstClips[0].edge.length()) {
                this.nodes = [ray.origin, target];
                return this;
            }
        }
        clips.push(firstClips[0]);
        var i = 0;
        while (i < REFLECT_LIMIT) {
            var prevClip = clips[clips.length - 1];
            var n0 = new XY(prevClip.intersection.nodes[0].x, prevClip.intersection.nodes[0].y);
            var n1 = new XY(prevClip.intersection.nodes[1].x, prevClip.intersection.nodes[1].y);
            var reflection = new Matrix().reflection(n1.subtract(n0), n0);
            var newRay = new Ray(prevClip.edge.nodes[1], prevClip.edge.nodes[0].transform(reflection).subtract(prevClip.edge.nodes[1]));
            var newClips = newRay.clipWithEdgesDetails(intersectable);
            if (target !== undefined &&
                epsilonEqual(newRay.direction.cross(target.subtract(newRay.origin)), 0, EPSILON_HIGH)) {
                clips.push({ edge: new Edge(newRay.origin, target), intersection: undefined });
                break;
            }
            if (newClips.length === 0 || newClips[0] === undefined) {
                break;
            }
            clips.push(newClips[0]);
            i++;
        }
        this.nodes = clips.map(function (el) { return el.edge.nodes[0]; });
        this.nodes.push(clips[clips.length - 1].edge.nodes[1]);
        return this;
    }
}
class Rect {
    constructor(x, y, width, height) {
        this.topLeft = { 'x': x, 'y': y };
        this.size = { 'width': width, 'height': height };
    }
}
class Triangle {
    constructor(points, circumcenter) {
        this.points = points;
        this.edges = this.points.map(function (el, i) {
            var nextEl = this.points[(i + 1) % this.points.length];
            return new Edge(el, nextEl);
        }, this);
        this.sectors = this.points.map(function (el, i) {
            var prevI = (i + this.points.length - 1) % this.points.length;
            var nextI = (i + 1) % this.points.length;
            return new Sector(el, [this.points[prevI], this.points[nextI]]);
        }, this);
        this.circumcenter = circumcenter;
        if (circumcenter === undefined) {
        }
    }
    angles() {
        return this.points.map(function (p, i) {
            var prevP = this.points[(i + this.points.length - 1) % this.points.length];
            var nextP = this.points[(i + 1) % this.points.length];
            return clockwiseInteriorAngle(nextP.subtract(p), prevP.subtract(p));
        }, this);
    }
    isAcute() {
        var a = this.angles();
        for (var i = 0; i < a.length; i++) {
            if (a[i] > Math.PI * 0.5) {
                return false;
            }
        }
        return true;
    }
    isObtuse() {
        var a = this.angles();
        for (var i = 0; i < a.length; i++) {
            if (a[i] > Math.PI * 0.5) {
                return true;
            }
        }
        return false;
    }
    isRight() {
        var a = this.angles();
        for (var i = 0; i < a.length; i++) {
            if (epsilonEqual(a[i], Math.PI * 0.5)) {
                return true;
            }
        }
        return false;
    }
    pointInside(p) {
        var found = true;
        for (var i = 0; i < this.points.length; i++) {
            var p0 = this.points[i];
            var p1 = this.points[(i + 1) % this.points.length];
            var cross = (p.y - p0.y) * (p1.x - p0.x) -
                (p.x - p0.x) * (p1.y - p0.y);
            if (cross < 0)
                return false;
        }
        return true;
    }
}
class IsoscelesTriangle extends Triangle {
}
class ConvexPolygon {
    center() {
        var xMin = Infinity, xMax = 0, yMin = Infinity, yMax = 0;
        var nodes = this.edges.map(function (el) { return el.nodes[0]; });
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].x > xMax) {
                xMax = nodes[i].x;
            }
            if (nodes[i].x < xMin) {
                xMin = nodes[i].x;
            }
            if (nodes[i].y > yMax) {
                yMax = nodes[i].y;
            }
            if (nodes[i].y < yMin) {
                yMin = nodes[i].y;
            }
        }
        return new XY(xMin + (xMin + xMax) * 0.5, yMin + (yMin + yMax) * 0.5);
    }
    contains(p) {
        var found = true;
        for (var i = 0; i < this.edges.length; i++) {
            var a = this.edges[i].nodes[1].subtract(this.edges[i].nodes[0]);
            var b = new XY(p.x - this.edges[i].nodes[0].x, p.y - this.edges[i].nodes[0].y);
            if (a.cross(b) < 0) {
                return false;
            }
        }
        return true;
    }
    clipEdge(edge) {
        var intersections = this.edges
            .map(function (el) { return intersectionEdgeEdge(edge, el); })
            .filter(function (el) { return el !== undefined; })
            .filter(function (el) {
            return !el.equivalent(edge.nodes[0]) &&
                !el.equivalent(edge.nodes[1]);
        });
        switch (intersections.length) {
            case 0:
                if (this.contains(edge.nodes[0])) {
                    return edge;
                }
                return undefined;
            case 1:
                if (this.contains(edge.nodes[0])) {
                    return new Edge(edge.nodes[0], intersections[0]);
                }
                return new Edge(edge.nodes[1], intersections[0]);
            default:
                for (var i = 1; i < intersections.length; i++) {
                    if (!intersections[0].equivalent(intersections[i])) {
                        return new Edge(intersections[0], intersections[i]);
                    }
                }
        }
    }
    clipLine(line) {
        var intersections = this.edges
            .map(function (el) { return intersectionLineEdge(line, el); })
            .filter(function (el) { return el !== undefined; });
        switch (intersections.length) {
            case 0: return undefined;
            case 1: return new Edge(intersections[0], intersections[0]);
            default:
                for (var i = 1; i < intersections.length; i++) {
                    if (!intersections[0].equivalent(intersections[i])) {
                        return new Edge(intersections[0], intersections[i]);
                    }
                }
        }
    }
    clipRay(ray) {
        var intersections = this.edges
            .map(function (el) { return intersectionRayEdge(ray, el); })
            .filter(function (el) { return el !== undefined; });
        switch (intersections.length) {
            case 0: return undefined;
            case 1: return new Edge(ray.origin, intersections[0]);
            default:
                for (var i = 1; i < intersections.length; i++) {
                    if (!intersections[0].equivalent(intersections[i])) {
                        return new Edge(intersections[0], intersections[i]);
                    }
                }
        }
    }
    setEdgesFromPoints(points) {
        return points.map(function (el, i) {
            var nextEl = points[(i + 1) % points.length];
            return new Edge(el, nextEl);
        }, this);
    }
    convexHull(points) {
        if (points === undefined || points.length === 0) {
            this.edges = [];
            return undefined;
        }
        var INFINITE_LOOP = 10000;
        var sorted = points.sort(function (a, b) {
            if (epsilonEqual(a.y, b.y, EPSILON_HIGH)) {
                return a.x - b.x;
            }
            return a.y - b.y;
        });
        var hull = [];
        hull.push(sorted[0]);
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
            })
                .sort(function (a, b) { return (a.angle < b.angle) ? -1 : (a.angle > b.angle) ? 1 : 0; });
            if (angles.length === 0) {
                this.edges = [];
                return undefined;
            }
            var rightTurn = angles[0];
            angles = angles.filter(function (el) { return epsilonEqual(rightTurn.angle, el.angle, EPSILON_LOW); })
                .map(function (el) {
                var distance = Math.sqrt(Math.pow(hull[h].x - el.node.x, 2) + Math.pow(hull[h].y - el.node.y, 2));
                el.distance = distance;
                return el;
            })
                .sort(function (a, b) { return (a.distance < b.distance) ? 1 : (a.distance > b.distance) ? -1 : 0; });
            if (contains(hull, angles[0].node)) {
                this.edges = this.setEdgesFromPoints(hull);
                return this;
            }
            hull.push(angles[0].node);
            ang = Math.atan2(hull[h].y - angles[0].node.y, hull[h].x - angles[0].node.x);
        } while (infiniteLoop < INFINITE_LOOP);
        this.edges = [];
        return undefined;
    }
    minimumRect() {
        var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        this.edges
            .map(function (el) { return el.nodes[0]; })
            .forEach(function (el) {
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
    }
    copy() {
        var p = new ConvexPolygon();
        p.edges = this.edges.map(function (e) {
            return new Edge(e.nodes[0].x, e.nodes[0].y, e.nodes[1].x, e.nodes[1].y);
        });
        return p;
    }
}
class Sector {
    constructor(origin, endpoints) {
        this.origin = origin;
        this.endPoints = endpoints;
    }
    vectors() {
        return [this.endPoints[0].subtract(this.origin), this.endPoints[1].subtract(this.origin)];
    }
    angle() {
        return clockwiseInteriorAngle(this.endPoints[0].subtract(this.origin), this.endPoints[1].subtract(this.origin));
    }
    bisect() {
        var vectors = this.vectors();
        var angles = vectors.map(function (el) { return Math.atan2(el.y, el.x); });
        while (angles[0] < 0) {
            angles[0] += Math.PI * 2;
        }
        while (angles[1] < 0) {
            angles[1] += Math.PI * 2;
        }
        var interior = clockwiseInteriorAngleRadians(angles[0], angles[1]);
        var bisected = angles[0] - interior * 0.5;
        return new XY(Math.cos(bisected), Math.sin(bisected));
    }
    subsectAngle(divisions) {
        if (divisions === undefined || divisions < 1) {
            throw "subsetAngle() requires a parameter greater than 1";
        }
        var angles = this.vectors().map(function (el) { return Math.atan2(el.y, el.x); });
        var interiorA = clockwiseInteriorAngleRadians(angles[0], angles[1]);
        var results = [];
        for (var i = 1; i < divisions; i++) {
            results.push(angles[0] - interiorA * (1.0 / divisions) * i);
        }
        return results;
    }
    getEdgeVectorsForNewAngle(angle, lockedEdge) {
        var vectors = this.vectors();
        var angleChange = angle - clockwiseInteriorAngle(vectors[0], vectors[1]);
        var rotateNodes = [-angleChange * 0.5, angleChange * 0.5];
        return vectors.map(function (el, i) { return el.rotate(rotateNodes[i]); }, this);
    }
    equivalent(a) {
        return a.origin.equivalent(this.origin) &&
            a.endPoints[0].equivalent(this.endPoints[0]) &&
            a.endPoints[1].equivalent(this.endPoints[1]);
    }
    sortByClockwise() { }
}
class VoronoiMolecule extends Triangle {
    constructor(points, circumcenter, edgeNormal) {
        super(points, circumcenter);
        this.isEdge = false;
        this.isCorner = false;
        this.overlaped = [];
        this.hull = new ConvexPolygon().convexHull([points[0], points[1], points[2], circumcenter].filter(function (el) { return el !== undefined; }));
        this.units = this.points.map(function (el, i) {
            var nextEl = this.points[(i + 1) % this.points.length];
            return new VoronoiMoleculeTriangle(circumcenter, [el, nextEl]);
        }, this);
        var pointsLength = this.points.length;
        switch (pointsLength) {
            case 1:
                this.isCorner = true;
                this.addCornerMolecules();
                break;
            case 2:
                this.isEdge = true;
                this.units = this.units.filter(function (el) {
                    var cross = (el.vertex.y - el.base[0].y) * (el.base[1].x - el.base[0].x) -
                        (el.vertex.x - el.base[0].x) * (el.base[1].y - el.base[0].y);
                    if (cross < 0) {
                        return false;
                    }
                    return true;
                }, this);
                this.addEdgeMolecules(edgeNormal);
                break;
        }
        var eclipsed = undefined;
        this.units = this.units.filter(function (el) {
            var cross = (el.vertex.y - el.base[0].y) * (el.base[1].x - el.base[0].x) -
                (el.vertex.x - el.base[0].x) * (el.base[1].y - el.base[0].y);
            if (cross < 0) {
                eclipsed = el;
                return false;
            }
            return true;
        }, this);
        if (eclipsed !== undefined) {
            var angle = clockwiseInteriorAngle(eclipsed.vertex.subtract(eclipsed.base[1]), eclipsed.base[0].subtract(eclipsed.base[1]));
            this.units.forEach(function (el) { el.crimpAngle -= angle; });
        }
    }
    addEdgeMolecules(normal) {
        this.edgeNormal = normal.normalize().abs();
        if (this.units.length < 1) {
            return;
        }
        var base = this.units[0].base;
        var reflected = base.map(function (b) {
            var diff = this.circumcenter.subtract(b);
            var change = diff.multiply(this.edgeNormal).scale(2);
            return b.add(change);
        }, this);
        this.units = this.units.concat([new VoronoiMoleculeTriangle(this.circumcenter, [base[1], reflected[1]]),
            new VoronoiMoleculeTriangle(this.circumcenter, [reflected[0], base[0]])]);
    }
    addCornerMolecules() { }
    generateCreases() {
        var edges = [];
        var outerEdges = this.units.map(function (el, i) {
            var nextEl = this.units[(i + 1) % this.units.length];
            if (el.base[1].equivalent(nextEl.base[0])) {
                edges.push(new Edge(el.base[1], el.vertex));
            }
        }, this);
        var creases = this.units.map(function (el) { return el.generateCrimpCreaseLines(); });
        creases.forEach(function (el) { edges = edges.concat(el); }, this);
        if (this.isObtuse()) {
            this.units.forEach(function (el, i) {
                var nextEl = this.units[(i + 1) % this.units.length];
                if (el.base[0].equivalent(el.base[1])) {
                    edges.push(new Edge(el.base[0], el.vertex));
                }
            }, this);
        }
        return edges;
    }
}
class VoronoiMoleculeTriangle {
    constructor(vertex, base, crimpAngle) {
        this.vertex = vertex;
        this.base = base;
        this.crimpAngle = crimpAngle;
        this.overlapped = [];
        if (this.crimpAngle === undefined) {
            var vec1 = base[1].subtract(base[0]);
            var vec2 = vertex.subtract(base[0]);
            var a1 = clockwiseInteriorAngle(vec1, vec2);
            var a2 = clockwiseInteriorAngle(vec2, vec1);
            this.crimpAngle = (a1 < a2) ? a1 : a2;
        }
    }
    crimpLocations() {
        var baseAngle = Math.atan2(this.base[1].y - this.base[0].y, this.base[1].x - this.base[0].x);
        var crimpVector = new XY(Math.cos(baseAngle + this.crimpAngle), Math.sin(baseAngle + this.crimpAngle));
        var bisectVector = new XY(Math.cos(baseAngle + this.crimpAngle * 0.5), Math.sin(baseAngle + this.crimpAngle * 0.5));
        var symmetryLine = new Edge(this.vertex, this.base[0].midpoint(this.base[1]));
        var crimpPos = intersectionRayEdge(new Ray(this.base[0], crimpVector), symmetryLine);
        var bisectPos = intersectionRayEdge(new Ray(this.base[0], bisectVector), symmetryLine);
        return [crimpPos, bisectPos];
    }
    generateCrimpCreaseLines() {
        var crimps = this.crimpLocations();
        var symmetryLine = new Edge(this.vertex, this.base[0].midpoint(this.base[1]));
        if (this.overlapped.length > 0) {
            symmetryLine.nodes[1] = this.overlapped[0].circumcenter;
        }
        var overlappingEdges = [symmetryLine]
            .concat(flatMap(this.overlapped, function (el) {
            return el.generateCreases();
        }));
        var edges = [symmetryLine]
            .concat(new Polyline().rayReflectRepeat(new Ray(this.base[0], this.base[1].subtract(this.base[0])), overlappingEdges, this.base[1]).edges());
        crimps.filter(function (el) {
            return el !== undefined && !el.equivalent(this.vertex);
        }, this)
            .forEach(function (crimp) {
            edges = edges.concat(new Polyline().rayReflectRepeat(new Ray(this.base[0], crimp.subtract(this.base[0])), overlappingEdges, this.base[1]).edges());
        }, this);
        return edges;
    }
    pointInside(p) {
        var found = true;
        var points = [this.vertex, this.base[0], this.base[1]];
        for (var i = 0; i < points.length; i++) {
            var p0 = points[i];
            var p1 = points[(i + 1) % points.length];
            var cross = (p.y - p0.y) * (p1.x - p0.x) -
                (p.x - p0.x) * (p1.y - p0.y);
            if (cross < 0)
                return false;
        }
        return true;
    }
}
class VoronoiEdge {
    constructor() {
        this.cache = {};
    }
}
class VoronoiCell {
    constructor() { this.points = []; this.edges = []; }
}
class VoronoiJunction {
    constructor() { this.edges = []; this.cells = []; this.isEdge = false; this.isCorner = false; }
}
class VoronoiGraph {
    edgeExists(points, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        this.edges.forEach(function (el) {
            if (el.endPoints[0].equivalent(points[0], epsilon) &&
                el.endPoints[1].equivalent(points[1], epsilon)) {
                return el;
            }
            if (el.endPoints[1].equivalent(points[0], epsilon) &&
                el.endPoints[0].equivalent(points[1], epsilon)) {
                return el;
            }
        });
        return undefined;
    }
    constructor(v, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        var allPoints = flatMap(v.edges, function (e) { return [new XY(e[0][0], e[0][1]), new XY(e[1][0], e[1][1])]; });
        var hull = new ConvexPolygon().convexHull(allPoints);
        this.edges = [];
        this.junctions = [];
        this.cells = [];
        this.edges = v.edges.map(function (el) {
            var edge = new VoronoiEdge();
            edge.endPoints = [new XY(el[0][0], el[0][1]), new XY(el[1][0], el[1][1])];
            edge.cache = { 'left': el.left, 'right': el.right };
            return edge;
        });
        this.cells = v.cells.map(function (c) {
            var cell = new VoronoiCell();
            cell.site = new XY(c.site[0], c.site[1]);
            cell.edges = c.halfedges.map(function (hf) { return this.edges[hf]; }, this);
            cell.points = cell.edges.map(function (el, i) {
                var a = el.endPoints[0];
                var b = el.endPoints[1];
                var nextA = cell.edges[(i + 1) % cell.edges.length].endPoints[0];
                var nextB = cell.edges[(i + 1) % cell.edges.length].endPoints[1];
                if (a.equivalent(nextA, epsilon) || a.equivalent(nextB, epsilon)) {
                    return b;
                }
                return a;
            }, this);
            return cell;
        }, this);
        this.edges.forEach(function (el) {
            var thisCells = [undefined, undefined];
            if (el.cache['left'] !== undefined) {
                var leftSite = new XY(el.cache['left'][0], el.cache['left'][1]);
                for (var i = 0; i < this.cells.length; i++) {
                    if (leftSite.equivalent(this.cells[i].site, epsilon)) {
                        thisCells[0] = this.cells[i];
                        break;
                    }
                }
            }
            if (el.cache['right'] !== undefined) {
                var rightSite = new XY(el.cache['right'][0], el.cache['right'][1]);
                for (var i = 0; i < this.cells.length; i++) {
                    if (rightSite.equivalent(this.cells[i].site, epsilon)) {
                        thisCells[1] = this.cells[i];
                        break;
                    }
                }
            }
            el.cells = thisCells;
            el.isBoundary = false;
            if (el.cells[0] === undefined || el.cells[1] === undefined) {
                el.isBoundary = true;
            }
            el.cache = {};
        }, this);
        var nodes = [];
        var compFunc = function (a, b) { return a.equivalent(b, epsilon); };
        this.edges.forEach(function (el) {
            if (!contains(nodes, el.endPoints[0], compFunc)) {
                nodes.push(el.endPoints[0]);
            }
            if (!contains(nodes, el.endPoints[1], compFunc)) {
                nodes.push(el.endPoints[1]);
            }
        }, this);
        this.junctions = nodes.map(function (el) {
            var junction = new VoronoiJunction();
            junction.position = el;
            junction.cells = this.cells.filter(function (cell) {
                return contains(cell.points, el, compFunc);
            }, this).sort(function (a, b) {
                var vecA = a.site.subtract(el);
                var vecB = b.site.subtract(el);
                return Math.atan2(vecA.y, vecA.x) - Math.atan2(vecB.y, vecB.x);
            });
            switch (junction.cells.length) {
                case 1:
                    junction.isCorner = true;
                    break;
                case 2:
                    junction.isEdge = true;
                    hull.edges.forEach(function (edge) {
                        if (edge.collinear(junction.position)) {
                            junction.edgeNormal = edge.nodes[1].subtract(edge.nodes[0]).rotate90();
                        }
                    });
                    break;
            }
            junction.edges = this.edges.filter(function (edge) {
                return contains(edge.endPoints, el, compFunc);
            }, this).sort(function (a, b) {
                var otherA = a.endPoints[0];
                if (otherA.equivalent(el)) {
                    otherA = a.endPoints[1];
                }
                var otherB = b.endPoints[0];
                if (otherB.equivalent(el)) {
                    otherB = b.endPoints[1];
                }
                var vecA = otherA.subtract(el);
                var vecB = otherB.subtract(el);
                return Math.atan2(vecA.y, vecA.x) - Math.atan2(vecB.y, vecB.x);
            });
            return junction;
        }, this);
        return this;
    }
    generateMolecules(interp) {
        return this.junctions.map(function (j) {
            var endPoints = j.cells.map(function (cell) {
                return cell.site.lerp(j.position, interp);
            }, this);
            var molecule = new VoronoiMolecule(endPoints, j.position, j.isEdge ? j.edgeNormal : undefined);
            return molecule;
        }, this);
    }
    generateSortedMolecules(interp) {
        var molecules = this.generateMolecules(interp);
        for (var i = 0; i < molecules.length; i++) {
            for (var j = 0; j < molecules.length; j++) {
                if (i !== j) {
                    molecules[j].units.forEach(function (unit) {
                        if (unit.pointInside(molecules[i].circumcenter)) {
                            unit.overlapped.push(molecules[i]);
                            molecules[j].overlaped.push(molecules[i]);
                        }
                    });
                }
            }
        }
        for (var i = 0; i < molecules.length; i++) {
            molecules[i].units.forEach(function (unit) {
                unit.overlapped.sort(function (a, b) {
                    return a.circumcenter.distanceTo(unit.vertex) - b.circumcenter.distanceTo(unit.vertex);
                });
            });
            molecules[i].overlaped.sort(function (a, b) {
                return a.circumcenter.distanceTo(molecules[i].circumcenter) - b.circumcenter.distanceTo(molecules[i].circumcenter);
            });
        }
        var array = [];
        var mutableMolecules = molecules.slice();
        var rowIndex = 0;
        while (mutableMolecules.length > 0) {
            array.push([]);
            for (var i = mutableMolecules.length - 1; i >= 0; i--) {
                if (mutableMolecules[i].overlaped.length <= rowIndex) {
                    array[rowIndex].push(mutableMolecules[i]);
                    mutableMolecules.splice(i, 1);
                }
            }
            rowIndex++;
        }
        return array;
    }
}
function gimme1XY(a, b) {
    if (isValidPoint(a)) {
        return a;
    }
    else if (isValidNumber(b)) {
        return new XY(a, b);
    }
}
function gimme2XY(a, b, c, d) {
    if (isValidPoint(b)) {
        return [a, b];
    }
    else if (isValidNumber(d)) {
        return [new XY(a, b), new XY(c, d)];
    }
}
function gimme1Edge(a, b, c, d) {
    if (a instanceof Edge || a.nodes !== undefined) {
        return a;
    }
    else if (isValidPoint(b)) {
        return new Edge(a, b);
    }
    else if (isValidNumber(d)) {
        return new Edge(a, b, c, d);
    }
}
function gimme1Ray(a, b, c, d) {
    if (a instanceof Ray) {
        return a;
    }
    else if (isValidPoint(b)) {
        return new Ray(a, b);
    }
    else if (isValidNumber(d)) {
        return new Ray(new XY(a, b), new XY(c, d));
    }
}
function gimme1Line(a, b, c, d) {
    if (a instanceof Line) {
        return a;
    }
    else if (isValidPoint(b)) {
        return new Line(a, b);
    }
    else if (isValidNumber(d)) {
        return new Line(a, b, c, d);
    }
    else if (a.nodes instanceof Array &&
        a.nodes.length > 0 &&
        isValidPoint(a.nodes[1])) {
        return new Line(a.nodes[0].x, a.nodes[0].y, a.nodes[1].x, a.nodes[1].y);
    }
}
var flatMap = function (array, mapFunc) {
    return array.reduce((cumulus, next) => [...mapFunc(next), ...cumulus], []);
};
var removeDuplicates = function (array, compFunction) {
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
};
var allEqual = function (array) {
    if (array.length <= 1) {
        return true;
    }
    for (var i = 1; i < array.length; i++) {
        if (array[i] !== array[0])
            return false;
    }
    return true;
};
var contains = function (array, object, compFunction) {
    if (compFunction !== undefined) {
        for (var i = 0; i < array.length; i++) {
            if (compFunction(array[i], object) === true) {
                return true;
            }
        }
        return false;
    }
    for (var i = 0; i < array.length; i++) {
        if (array[i] === object) {
            return true;
        }
    }
    return false;
};
System.register("src/planarGraph", ["src/graph"], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var graph_1, PlanarClean, PlanarNode, PlanarEdge, PlanarFace, PlanarSector, PlanarJunction, PlanarGraph;
    return {
        setters: [
            function (graph_1_1) {
                graph_1 = graph_1_1;
            }
        ],
        execute: function () {
            "use strict";
            PlanarClean = class PlanarClean extends graph_1.GraphClean {
                constructor(numNodes, numEdges) {
                    super();
                    this.edges = { total: 0, duplicate: 0, circular: 0 };
                    this.nodes = {
                        total: 0,
                        isolated: 0,
                        fragment: [],
                        collinear: [],
                        duplicate: []
                    };
                    if (numNodes !== undefined) {
                        this.nodes.total += numNodes;
                    }
                    if (numEdges !== undefined) {
                        this.edges.total += numEdges;
                    }
                }
                fragmentedNodes(nodes) {
                    this.nodes.fragment = nodes;
                    this.nodes.total += nodes.length;
                    return this;
                }
                collinearNodes(nodes) {
                    this.nodes.collinear = nodes;
                    this.nodes.total += nodes.length;
                    return this;
                }
                duplicateNodes(nodes) {
                    this.nodes.duplicate = nodes;
                    this.nodes.total += nodes.length;
                    return this;
                }
                join(report) {
                    this.nodes.total += report.nodes.total;
                    this.edges.total += report.edges.total;
                    this.nodes.isolated += report.nodes.isolated;
                    this.edges.duplicate += report.edges.duplicate;
                    this.edges.circular += report.edges.circular;
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
                }
            };
            exports_2("PlanarClean", PlanarClean);
            PlanarNode = class PlanarNode extends graph_1.GraphNode {
                constructor() {
                    super(...arguments);
                    this.junctionType = PlanarJunction;
                    this.sectorType = PlanarSector;
                    this.cache = {};
                }
                adjacentEdges() {
                    return this.graph.edges
                        .filter(function (el) {
                        return el.nodes[0] === this || el.nodes[1] === this;
                    }, this)
                        .map(function (el) {
                        var other = el.otherNode(this);
                        return { 'edge': el, 'angle': Math.atan2(other.y - this.y, other.x - this.x) };
                    }, this)
                        .sort(function (a, b) { return b.angle - a.angle; })
                        .map(function (el) { return el.edge; });
                }
                adjacentFaces() {
                    var junction = this.junction();
                    if (junction === undefined) {
                        return [];
                    }
                    return junction.faces();
                }
                interiorAngles() { return this.junction().interiorAngles(); }
                junction() {
                    var junction = new this.junctionType(this);
                    if (junction.edges.length === 0) {
                        return undefined;
                    }
                    return junction;
                }
                xy() { return new XY(this.x, this.y); }
                position(x, y) { this.x = x; this.y = y; return this; }
                translate(dx, dy) { this.x += dx; this.y += dy; return this; }
                normalize() { var m = this.magnitude(); this.x /= m; this.y /= m; return this; }
                rotate90() { var x = this.x; this.x = -this.y; this.y = x; return this; }
                rotate270() { var x = this.x; this.x = this.y; this.y = -x; return this; }
                rotate(angle, origin) {
                    var dx = this.x - origin.x;
                    var dy = this.y - origin.y;
                    var radius = Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2));
                    var currentAngle = Math.atan2(dy, dx);
                    this.x = origin.x + radius * Math.cos(currentAngle + angle);
                    this.y = origin.y + radius * Math.sin(currentAngle + angle);
                    return this;
                }
                dot(point) { return this.x * point.x + this.y * point.y; }
                cross(vector) { return this.x * vector.y - this.y * vector.x; }
                magnitude() { return Math.sqrt(this.x * this.x + this.y * this.y); }
                distanceTo(a) { return Math.sqrt(Math.pow(this.x - a.x, 2) + Math.pow(this.y - a.y, 2)); }
                equivalent(point, epsilon) {
                    return new XY(this.x, this.y).equivalent(point, epsilon);
                }
                transform(matrix) {
                    var xx = this.x;
                    var yy = this.y;
                    this.x = xx * matrix.a + yy * matrix.c + matrix.tx;
                    this.y = xx * matrix.b + yy * matrix.d + matrix.ty;
                    return this;
                }
                lerp(point, pct) {
                    var inv = 1.0 - pct;
                    return new XY(this.x * pct + point.x * inv, this.y * pct + point.y * inv);
                }
                angleLerp(point, pct) {
                    function shortAngleDist(a0, a1) {
                        var max = Math.PI * 2;
                        var da = (a1 - a0) % max;
                        return 2 * da % max - da;
                    }
                    var thisAngle = Math.atan2(this.y, this.x);
                    var pointAngle = Math.atan2(point.y, point.x);
                    var newAngle = thisAngle + shortAngleDist(thisAngle, pointAngle) * pct;
                    return new XY(Math.cos(newAngle), Math.sin(newAngle));
                }
                reflect(line) {
                    var origin, vector;
                    if (line.direction !== undefined) {
                        origin = line.point || line.origin;
                        vector = line.direction;
                    }
                    else if (line.nodes !== undefined) {
                        origin = new XY(line.nodes[0].x, line.nodes[0].y);
                        vector = new XY(line.nodes[1].x, line.nodes[1].y).subtract(origin);
                    }
                    else {
                        return undefined;
                    }
                    return this.transform(new Matrix().reflection(vector, origin));
                }
                scale(magnitude) { this.x *= magnitude; this.y *= magnitude; return this; }
                add(point) { this.x += point.x; this.y += point.y; return this; }
                subtract(sub) { this.x -= sub.x; this.y -= sub.y; return this; }
                multiply(m) { this.x *= m.x; this.y *= m.y; return this; }
                midpoint(other) { return new XY((this.x + other.x) * 0.5, (this.y + other.y) * 0.5); }
                abs() { this.x = Math.abs(this.x), this.y = Math.abs(this.y); return this; }
            };
            exports_2("PlanarNode", PlanarNode);
            PlanarEdge = class PlanarEdge extends graph_1.GraphEdge {
                length() { return this.nodes[0].distanceTo(this.nodes[1]); }
                vector(originNode) {
                    var origin = originNode || this.nodes[0];
                    var otherNode = this.otherNode(origin);
                    return new XY(otherNode.x, otherNode.y).subtract(origin);
                }
                parallel(edge, epsilon) {
                    return new Edge(this).parallel(new Edge(edge), epsilon);
                }
                collinear(point, epsilon) {
                    return new Edge(this).collinear(point, epsilon);
                }
                equivalent(e, epsilon) { return this.isSimilarToEdge(e); }
                intersection(edge, epsilon) {
                    if (epsilon === undefined) {
                        epsilon = EPSILON_HIGH;
                    }
                    if (edge instanceof PlanarEdge && this.isAdjacentToEdge(edge)) {
                        return undefined;
                    }
                    var a = new Edge(this.nodes[0].x, this.nodes[0].y, this.nodes[1].x, this.nodes[1].y);
                    var b = new Edge(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
                    var intersect = intersectionEdgeEdge(a, b, epsilon);
                    if (intersect !== undefined &&
                        !(intersect.equivalent(this.nodes[0], epsilon) || intersect.equivalent(this.nodes[1], epsilon))) {
                        var pe = edge;
                        return { 'edge': pe, 'point': intersect };
                    }
                    return undefined;
                }
                reflectionMatrix() {
                    var origin = new XY(this.nodes[0].x, this.nodes[0].y);
                    var vector = new XY(this.nodes[1].x, this.nodes[1].y).subtract(origin);
                    return new Matrix().reflection(vector, origin);
                }
                nearestPoint(point) {
                    var answer = this.nearestPointNormalTo(point);
                    if (answer !== undefined) {
                        return answer;
                    }
                    return this.nodes
                        .map(function (el) { return { point: el, distance: el.distanceTo(point) }; }, this)
                        .sort(function (a, b) { return a.distance - b.distance; })
                        .shift()
                        .point;
                }
                nearestPointNormalTo(point) {
                    var p = this.nodes[0].distanceTo(this.nodes[1]);
                    var u = ((point.x - this.nodes[0].x) * (this.nodes[1].x - this.nodes[0].x) + (point.y - this.nodes[0].y) * (this.nodes[1].y - this.nodes[0].y)) / (Math.pow(p, 2));
                    if (u < 0 || u > 1.0) {
                        return undefined;
                    }
                    return new XY(this.nodes[0].x + u * (this.nodes[1].x - this.nodes[0].x), this.nodes[0].y + u * (this.nodes[1].y - this.nodes[0].y));
                }
                transform(matrix) {
                    this.nodes[0].transform(matrix);
                    this.nodes[1].transform(matrix);
                    return this;
                }
                degenrate(epsilon) {
                    if (epsilon === undefined) {
                        epsilon = EPSILON_HIGH;
                    }
                    return this.nodes[0].equivalent(this.nodes[1], epsilon);
                }
                pointVectorForm() {
                    var origin = new XY(this.nodes[0].x, this.nodes[0].y);
                    var vector = new XY(this.nodes[1].x, this.nodes[1].y).subtract(origin);
                    return new Line(origin, vector);
                }
                midpoint() {
                    return new XY(0.5 * (this.nodes[0].x + this.nodes[1].x), 0.5 * (this.nodes[0].y + this.nodes[1].y));
                }
                crossingEdges() {
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
                        if (a.point.x - b.point.x < -EPSILON_HIGH) {
                            return -1;
                        }
                        if (a.point.x - b.point.x > EPSILON_HIGH) {
                            return 1;
                        }
                        if (a.point.y - b.point.y < -EPSILON_HIGH) {
                            return -1;
                        }
                        if (a.point.y - b.point.y > EPSILON_HIGH) {
                            return 1;
                        }
                        return 0;
                    });
                }
                absoluteAngle(startNode) {
                    if (startNode === undefined) {
                        startNode = this.nodes[1];
                    }
                    var endNode = this.otherNode(startNode);
                    return Math.atan2(endNode.y - startNode.y, endNode.x - startNode.x);
                }
                adjacentFaces() {
                    return [
                        new this.graph.faceType(this.graph).makeFromCircuit(this.graph.walkClockwiseCircut(this.nodes[0], this.nodes[1])),
                        new this.graph.faceType(this.graph).makeFromCircuit(this.graph.walkClockwiseCircut(this.nodes[1], this.nodes[0]))
                    ]
                        .filter(function (el) { return el !== undefined; });
                }
            };
            exports_2("PlanarEdge", PlanarEdge);
            PlanarFace = class PlanarFace {
                constructor(graph) {
                    this.graph = graph;
                    this.nodes = [];
                    this.edges = [];
                    this.angles = [];
                }
                makeFromCircuit(circut) {
                    if (circut == undefined || circut.length < 3) {
                        return undefined;
                    }
                    this.edges = circut;
                    this.nodes = circut.map(function (el, i) {
                        return el.uncommonNodeWithEdge(circut[(i + 1) % circut.length]);
                    });
                    var sectorType = this.nodes[0].sectorType;
                    this.sectors = this.edges.map(function (el, i) {
                        var nexti = (i + 1) % this.edges.length;
                        var origin = el.commonNodeWithEdge(this.edges[nexti]);
                        var endPoints = [el.uncommonNodeWithEdge(this.edges[nexti]),
                            this.edges[nexti].uncommonNodeWithEdge(el)];
                        return new sectorType(el, this.edges[nexti]);
                    }, this);
                    this.angles = this.sectors.map(function (el) { return el.angle(); });
                    var angleSum = this.angles.reduce(function (sum, value) { return sum + value; }, 0);
                    if (this.nodes.length > 2 && Math.abs(angleSum / (this.nodes.length - 2) - Math.PI) < EPSILON) {
                        return this;
                    }
                    return undefined;
                }
                makeFromNodes(nodes) {
                    var edgeCircut = nodes.map(function (node, i) {
                        var nextNode = this.nodes[(i + 1) % this.nodes.length];
                        return this.graph.getEdgeConnectingNodes(node, nextNode);
                    }, this);
                    return this.makeFromCircuit(edgeCircut);
                }
                equivalent(face) {
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
                }
                commonEdge(face) {
                    for (var i = 0; i < this.edges.length; i++) {
                        for (var j = 0; j < face.edges.length; j++) {
                            if (this.edges[i] === face.edges[j]) {
                                return this.edges[i];
                            }
                        }
                    }
                }
                commonEdges(face) {
                    var edges = [];
                    for (var i = 0; i < this.edges.length; i++) {
                        for (var j = 0; j < face.edges.length; j++) {
                            if (this.edges[i] === face.edges[j]) {
                                edges.push(this.edges[i]);
                            }
                        }
                    }
                    return removeDuplicates(edges, function (a, b) { return a === b; });
                }
                uncommonEdges(face) {
                    var edges = this.edges.slice(0);
                    for (var i = 0; i < face.edges.length; i++) {
                        edges = edges.filter(function (el) { return el !== face.edges[i]; });
                    }
                    return edges;
                }
                edgeAdjacentFaces() {
                    return this.edges.map(function (ed) {
                        var allFaces = this.graph.faces.filter(function (el) { return !this.equivalent(el); }, this);
                        for (var i = 0; i < allFaces.length; i++) {
                            var adjArray = allFaces[i].edges.filter(function (ef) { return ed === ef; });
                            if (adjArray.length > 0) {
                                return allFaces[i];
                            }
                        }
                    }, this).filter(function (el) { return el !== undefined; });
                }
                contains(point) {
                    for (var i = 0; i < this.edges.length; i++) {
                        var endpts = this.edges[i].nodes;
                        var cross = (point.y - endpts[0].y) * (endpts[1].x - endpts[0].x) -
                            (point.x - endpts[0].x) * (endpts[1].y - endpts[0].y);
                        if (cross < 0) {
                            return false;
                        }
                    }
                    return true;
                }
                transform(matrix) {
                    for (var i = 0; i < this.nodes.length; i++) {
                        this.nodes[i].transform(matrix);
                    }
                }
            };
            exports_2("PlanarFace", PlanarFace);
            PlanarSector = class PlanarSector extends Sector {
                constructor(edge1, edge2) {
                    super(edge1.commonNodeWithEdge(edge2), undefined);
                    if (this.origin === undefined) {
                        return;
                    }
                    if (edge1 === edge2) {
                        return;
                    }
                    this.edges = [edge1, edge2];
                    this.endPoints = [
                        (edge1.nodes[0] === this.origin) ? edge1.nodes[1] : edge1.nodes[0],
                        (edge2.nodes[0] === this.origin) ? edge2.nodes[1] : edge2.nodes[0]
                    ];
                }
                makeWithEdges(edge1, edge2) {
                    this.origin = edge1.commonNodeWithEdge(edge2);
                    if (this.origin === undefined) {
                        return;
                    }
                    if (edge1 === edge2) {
                        return;
                    }
                    this.edges = [edge1, edge2];
                    this.endPoints = [
                        (edge1.nodes[0] === this.origin) ? edge1.nodes[1] : edge1.nodes[0],
                        (edge2.nodes[0] === this.origin) ? edge2.nodes[1] : edge2.nodes[0]
                    ];
                    return this;
                }
                vectors() {
                    return this.edges.map(function (el) { return el.vector(this.origin); }, this);
                }
                angle() {
                    var vectors = this.vectors();
                    return clockwiseInteriorAngle(vectors[0], vectors[1]);
                }
                bisect() {
                    var absolute1 = this.edges[0].absoluteAngle(this.origin);
                    var absolute2 = this.edges[1].absoluteAngle(this.origin);
                    while (absolute1 < 0) {
                        absolute1 += Math.PI * 2;
                    }
                    var interior = clockwiseInteriorAngleRadians(absolute1, absolute2);
                    var bisected = absolute1 - interior * 0.5;
                    return new XY(Math.cos(bisected), Math.sin(bisected));
                }
                subsectAngle(divisions) {
                    if (divisions === undefined || divisions < 1) {
                        throw "subsetAngle() requires a parameter greater than 1";
                    }
                    var angleA = this.edges[0].absoluteAngle(this.origin);
                    var angleB = this.edges[1].absoluteAngle(this.origin);
                    var interiorA = clockwiseInteriorAngleRadians(angleA, angleB);
                    var results = [];
                    for (var i = 1; i < divisions; i++) {
                        results.push(angleA - interiorA * (1.0 / divisions) * i);
                    }
                    return results;
                }
                getEdgeVectorsForNewAngle(angle, lockedEdge) {
                    var vectors = this.vectors();
                    var angleChange = angle - clockwiseInteriorAngle(vectors[0], vectors[1]);
                    var rotateNodes = [-angleChange * 0.5, angleChange * 0.5];
                    return vectors.map(function (el, i) { return el.rotate(rotateNodes[i]); }, this);
                }
                getEndNodesChangeForNewAngle(angle, lockedEdge) {
                    var vectors = this.vectors();
                    var angleChange = angle - clockwiseInteriorAngle(vectors[0], vectors[1]);
                    var rotateNodes = [-angleChange * 0.5, angleChange * 0.5];
                    return vectors.map(function (el, i) {
                        return this.endPoints[i].subtract(el.rotate(rotateNodes[i]).add(this.origin));
                    }, this);
                }
                equivalent(a) {
                    return ((a.edges[0].isSimilarToEdge(this.edges[0]) &&
                        a.edges[1].isSimilarToEdge(this.edges[1])) ||
                        (a.edges[0].isSimilarToEdge(this.edges[1]) &&
                            a.edges[1].isSimilarToEdge(this.edges[0])));
                }
            };
            exports_2("PlanarSector", PlanarSector);
            PlanarJunction = class PlanarJunction {
                constructor(node) {
                    this.origin = node;
                    this.sectors = [];
                    this.edges = [];
                    if (node === undefined) {
                        return;
                    }
                    this.edges = this.origin.adjacentEdges();
                    if (this.edges.length <= 1) {
                        return;
                    }
                    this.sectors = this.edges.map(function (el, i) {
                        var nextEl = this.edges[(i + 1) % this.edges.length];
                        var origin = el.commonNodeWithEdge(nextEl);
                        var nextN = nextEl.uncommonNodeWithEdge(el);
                        var prevN = el.uncommonNodeWithEdge(nextEl);
                        return new this.origin.sectorType(el, nextEl);
                    }, this);
                }
                edgeVectorsNormalized() {
                    return this.edges.map(function (el) { return el.vector(this.origin).normalize(); }, this);
                }
                edgeAngles() {
                    return this.edges.map(function (el) { return el.absoluteAngle(this.origin); }, this);
                }
                sectorWithEdges(a, b) {
                    var found = undefined;
                    this.sectors.forEach(function (el) {
                        if ((el.edges[0].equivalent(a) && el.edges[1].equivalent(b)) ||
                            (el.edges[1].equivalent(a) && el.edges[0].equivalent(b))) {
                            found = el;
                            return found;
                        }
                    }, this);
                    return found;
                }
                interiorAngles() {
                    var absoluteAngles = this.edges.map(function (el) { return el.absoluteAngle(this.origin); }, this);
                    return absoluteAngles.map(function (el, i) {
                        var nextI = (i + 1) % this.edges.length;
                        return clockwiseInteriorAngleRadians(el, absoluteAngles[nextI]);
                    }, this);
                }
                clockwiseNode(fromNode) {
                    for (var i = 0; i < this.edges.length; i++) {
                        if (this.edges[i].otherNode(this.origin) === fromNode) {
                            return this.edges[(i + 1) % this.edges.length].otherNode(this.origin);
                        }
                    }
                }
                clockwiseEdge(fromEdge) {
                    var index = this.edges.indexOf(fromEdge);
                    if (index === -1) {
                        return undefined;
                    }
                    return this.edges[(index + 1) % this.edges.length];
                }
                faces() {
                    var adjacentFaces = [];
                    for (var n = 0; n < this.edges.length; n++) {
                        var circuit = this.origin.graph.walkClockwiseCircut(this.origin, this.edges[n].otherNode(this.origin));
                        var face = new this.origin.graph.faceType(this.origin.graph).makeFromCircuit(circuit);
                        if (face !== undefined) {
                            adjacentFaces.push(face);
                        }
                    }
                    return adjacentFaces;
                }
            };
            exports_2("PlanarJunction", PlanarJunction);
            PlanarGraph = class PlanarGraph extends graph_1.Graph {
                constructor() {
                    super();
                    this.nodeType = PlanarNode;
                    this.edgeType = PlanarEdge;
                    this.faceType = PlanarFace;
                    this.properties = { "optimization": 0 };
                    this.clear();
                }
                copy() {
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
                }
                newPlanarNode(x, y) {
                    return this.newNode().position(x, y);
                }
                newPlanarEdge(x1, y1, x2, y2) {
                    var a = this.newNode().position(x1, y1);
                    var b = this.newNode().position(x2, y2);
                    return this.newEdge(a, b);
                }
                newPlanarEdgeFromNode(node, x, y) {
                    var newNode = this.newNode().position(x, y);
                    return this.newEdge(node, newNode);
                }
                newPlanarEdgeBetweenNodes(a, b) {
                    return this.newEdge(a, b);
                }
                newPlanarEdgeRadiallyFromNode(node, angle, length) {
                    var newNode = this.copyNode(node)
                        .translate(Math.cos(angle) * length, Math.sin(angle) * length);
                    return this.newEdge(node, newNode);
                }
                clear() {
                    this.nodes = [];
                    this.edges = [];
                    this.faces = [];
                    return this;
                }
                removeEdge(edge) {
                    var len = this.edges.length;
                    var endNodes = [edge.nodes[0], edge.nodes[1]];
                    this.edges = this.edges.filter(function (el) { return el !== edge; });
                    this.edgeArrayDidChange();
                    this.cleanNodeIfUseless(endNodes[0]);
                    this.cleanNodeIfUseless(endNodes[1]);
                    return new PlanarClean(undefined, len - this.edges.length);
                }
                removeEdgeBetween(node1, node2) {
                    var len = this.edges.length;
                    this.edges = this.edges.filter(function (el) {
                        return !((el.nodes[0] === node1 && el.nodes[1] === node2) ||
                            (el.nodes[0] === node2 && el.nodes[1] === node1));
                    });
                    this.edgeArrayDidChange();
                    return new PlanarClean(undefined, len - this.edges.length)
                        .join(this.cleanNodeIfUseless(node1))
                        .join(this.cleanNodeIfUseless(node2));
                }
                cleanNodeIfUseless(node) {
                    var edges = node.adjacentEdges();
                    switch (edges.length) {
                        case 0: return this.removeNode(node);
                        case 2:
                            var angleDiff = edges[0].absoluteAngle(node) - edges[1].absoluteAngle(node);
                            if (epsilonEqual(Math.abs(angleDiff), Math.PI, EPSILON_HIGH)) {
                                var farNodes = [edges[0].uncommonNodeWithEdge(edges[1]),
                                    edges[1].uncommonNodeWithEdge(edges[0])];
                                edges[0].nodes = [farNodes[0], farNodes[1]];
                                this.removeEdge(edges[1]);
                                this.removeNode(node);
                                return new PlanarClean(1, 1);
                            }
                    }
                    return new PlanarClean();
                }
                cleanAllUselessNodes() {
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
                                var angleDiff = edges[0].absoluteAngle(this.nodes[i]) - edges[1].absoluteAngle(this.nodes[i]);
                                if (epsilonEqual(Math.abs(angleDiff), Math.PI, EPSILON_HIGH)) {
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
                }
                cleanDuplicateNodes(epsilon) {
                    if (epsilon === undefined) {
                        epsilon = EPSILON_HIGH;
                    }
                    var tree = rbush();
                    var nodes = this.nodes.map(function (el) {
                        return {
                            minX: el.x - epsilon,
                            minY: el.y - epsilon,
                            maxX: el.x + epsilon,
                            maxY: el.y + epsilon,
                            node: el
                        };
                    });
                    tree.load(nodes);
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
                }
                clean(epsilon) {
                    var report = new PlanarClean();
                    report.join(this.cleanDuplicateNodes(epsilon));
                    report.join(this.fragment());
                    report.join(this.cleanDuplicateNodes(epsilon));
                    report.join(this.cleanGraph());
                    report.join(this.cleanAllUselessNodes());
                    return report;
                }
                fragment() {
                    var that = this;
                    function fragmentOneRound() {
                        var roundReport = new PlanarClean();
                        for (var i = 0; i < that.edges.length; i++) {
                            var fragmentReport = that.fragmentEdge(that.edges[i]);
                            roundReport.join(fragmentReport);
                            if (fragmentReport.nodes.fragment.length > 0) {
                                roundReport.join(that.cleanGraph());
                                roundReport.join(that.cleanAllUselessNodes());
                                roundReport.join(that.cleanDuplicateNodes());
                            }
                        }
                        return roundReport;
                    }
                    var protection = 0;
                    var report = new PlanarClean();
                    var thisReport;
                    do {
                        thisReport = fragmentOneRound();
                        report.join(thisReport);
                        protection += 1;
                    } while (thisReport.nodes.fragment.length != 0 && protection < 400);
                    if (protection >= 400) {
                        console.log("breaking loop, exceeded 400");
                    }
                    return report;
                }
                fragmentEdge(edge) {
                    var report = new PlanarClean();
                    var intersections = edge.crossingEdges();
                    if (intersections.length === 0) {
                        return report;
                    }
                    report.nodes.fragment = intersections.map(function (el) { return new XY(el.point.x, el.point.y); });
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
                    var newLineNodes = [];
                    for (var i = 0; i < intersections.length; i++) {
                        if (intersections[i] != undefined) {
                            var newNode = this.newNode().position(intersections[i].point.x, intersections[i].point.y);
                            this.copyEdge(intersections[i].edge).nodes = [newNode, intersections[i].edge.nodes[1]];
                            intersections[i].edge.nodes[1] = newNode;
                            newLineNodes.push(newNode);
                        }
                    }
                    this.copyEdge(edge).nodes = [endNodes[0], newLineNodes[0]];
                    for (var i = 0; i < newLineNodes.length - 1; i++) {
                        this.copyEdge(edge).nodes = [newLineNodes[i], newLineNodes[i + 1]];
                    }
                    this.copyEdge(edge).nodes = [newLineNodes[newLineNodes.length - 1], endNodes[1]];
                    this.removeEdge(edge);
                    report.join(this.cleanGraph());
                    return report;
                }
                walkClockwiseCircut(node1, node2) {
                    if (node1 === undefined || node2 === undefined) {
                        return undefined;
                    }
                    var incidentEdge = node1.graph.getEdgeConnectingNodes(node1, node2);
                    if (incidentEdge == undefined) {
                        return undefined;
                    }
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
                    } while (!contains(visitedList, travelingNode));
                    return undefined;
                }
                bounds() {
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
                }
                getEdgeIntersections(epsilon) {
                    var intersections = [];
                    for (var i = 0; i < this.edges.length - 1; i++) {
                        for (var j = i + 1; j < this.edges.length; j++) {
                            var intersection = this.edges[i].intersection(this.edges[j], epsilon);
                            if (intersection != undefined) {
                                var copy = false;
                                for (var k = 0; k < intersections.length; k++) {
                                    if (intersection.point.equivalent(intersections[k], epsilon)) {
                                        copy = true;
                                    }
                                }
                                if (!copy) {
                                    intersections.push(intersection.point);
                                }
                            }
                        }
                    }
                    return intersections;
                }
                getNearestNode(a, b) {
                    var p = gimme1XY(a, b);
                    if (p === undefined) {
                        return;
                    }
                    var node = undefined;
                    var distance = Infinity;
                    for (var i = 0; i < this.nodes.length; i++) {
                        var dist = Math.sqrt(Math.pow(this.nodes[i].x - p.x, 2) + Math.pow(this.nodes[i].y - p.y, 2));
                        if (dist < distance) {
                            distance = dist;
                            node = this.nodes[i];
                        }
                    }
                    return node;
                }
                getNearestNodes(a, b, howMany) {
                    var p = gimme1XY(a, b);
                    if (p === undefined) {
                        return;
                    }
                    var distances = [];
                    for (var i = 0; i < this.nodes.length; i++) {
                        var dist = Math.sqrt(Math.pow(this.nodes[i].x - p.x, 2) + Math.pow(this.nodes[i].y - p.y, 2));
                        distances.push({ 'i': i, 'd': dist });
                    }
                    distances.sort(function (a, b) { return (a.d > b.d) ? 1 : ((b.d > a.d) ? -1 : 0); });
                    if (howMany > distances.length) {
                        howMany = distances.length;
                    }
                    return distances.slice(0, howMany).map(function (el) { return this.nodes[el.i]; }, this);
                }
                getNearestEdge(a, b) {
                    var input = gimme1XY(a, b);
                    if (input === undefined) {
                        return;
                    }
                    var minDist, nearestEdge, minLocation = new XY(undefined, undefined);
                    for (var i = 0; i < this.edges.length; i++) {
                        var p = this.edges[i];
                        var pT = p.nearestPoint(input);
                        if (pT != undefined) {
                            var thisDist = Math.sqrt(Math.pow(input.x - pT.x, 2) + Math.pow(input.y - pT.y, 2));
                            if (minDist == undefined || thisDist < minDist) {
                                minDist = thisDist;
                                nearestEdge = this.edges[i];
                                minLocation = pT;
                            }
                        }
                    }
                    for (var i = 0; i < this.nodes.length; i++) {
                        var dist = Math.sqrt(Math.pow(this.nodes[i].x - input.x, 2) + Math.pow(this.nodes[i].y - input.y, 2));
                        if (dist < minDist) {
                            var adjEdges = this.nodes[i].adjacentEdges();
                            if (adjEdges != undefined && adjEdges.length > 0) {
                                minDist = dist;
                                nearestEdge = adjEdges[0];
                                minLocation = this.nodes[i].xy();
                            }
                        }
                    }
                    return { 'edge': nearestEdge, 'point': minLocation };
                }
                getNearestEdges(a, b, howMany) {
                    var p = gimme1XY(a, b);
                    if (p === undefined) {
                        return;
                    }
                    var minDist, nearestEdge, minLocation = { x: undefined, y: undefined };
                    var edges = this.edges.map(function (el) {
                        var pT = el.nearestPointNormalTo(p);
                        if (pT === undefined) {
                            return undefined;
                        }
                        var distances = [
                            Math.sqrt(Math.pow(p.x - pT.x, 2) + Math.pow(p.y - pT.y, 2)),
                            Math.sqrt(Math.pow(el.nodes[0].x - p.x, 2) + Math.pow(el.nodes[0].y - p.y, 2)),
                            Math.sqrt(Math.pow(el.nodes[1].x - p.x, 2) + Math.pow(el.nodes[1].y - p.y, 2)),
                        ].filter(function (el) { return el !== undefined; })
                            .sort(function (a, b) { return (a > b) ? 1 : (a < b) ? -1 : 0; });
                        if (distances.length) {
                            return { 'edge': el, 'distance': distances[0] };
                        }
                    });
                    return edges.filter(function (el) { return el != undefined; });
                }
                getNearestEdgeConnectingPoints(a, b, c, d) {
                    var p = gimme2XY(a, b, c, d);
                    if (p === undefined) {
                        return;
                    }
                    var aNear = this.getNearestNode(p[0].x, p[0].y);
                    var bNear = this.getNearestNode(p[1].x, p[1].y);
                    var edge = this.getEdgeConnectingNodes(aNear, bNear);
                    if (edge !== undefined)
                        return edge;
                    for (var cou = 3; cou < 20; cou += 3) {
                        var aNears = this.getNearestNodes(p[0].x, p[0].y, cou);
                        var bNears = this.getNearestNodes(p[1].x, p[1].y, cou);
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
                }
                getNearestFace(a, b) {
                    var nearestNode = this.getNearestNode(a, b);
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
                }
                getNearestInteriorAngle(a, b) {
                    var p = gimme1XY(a, b);
                    if (p === undefined) {
                        return;
                    }
                    var nodes = this.getNearestNodes(p.x, p.y, 5);
                    var node, sectors;
                    for (var i = 0; i < nodes.length; i++) {
                        node = nodes[i];
                        var nodeJunction = node.junction();
                        if (nodeJunction !== undefined) {
                            sectors = nodeJunction.sectors;
                            if (sectors !== undefined && sectors.length > 0) {
                                break;
                            }
                        }
                    }
                    if (sectors == undefined || sectors.length === 0) {
                        return undefined;
                    }
                    var anglesInside = sectors.filter(function (el) {
                        var pts = el.endPoints;
                        var cross0 = (p.y - node.y) * (pts[1].x - node.x) -
                            (p.x - node.x) * (pts[1].y - node.y);
                        var cross1 = (p.y - pts[0].y) * (node.x - pts[0].x) -
                            (p.x - pts[0].x) * (node.y - pts[0].y);
                        if (cross0 < 0 || cross1 < 0) {
                            return false;
                        }
                        return true;
                    });
                    if (anglesInside.length > 0)
                        return anglesInside[0];
                    return undefined;
                }
                faceArrayDidChange() { for (var i = 0; i < this.faces.length; i++) {
                    this.faces[i].index = i;
                } }
                generateFaces() {
                    this.faces = [];
                    this.clean();
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
                }
                adjacentFaceTree(start) {
                    this.faceArrayDidChange();
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
                    faceRanks[start.index] = { rank: 0, parents: [], face: start };
                    var safety = 0;
                    while (!allFacesRanked() && safety < this.faces.length + 1) {
                        rankI += 1;
                        rank[rankI] = [];
                        for (var p = 0; p < rank[rankI - 1].length; p++) {
                            var adjacent = rank[rankI - 1][p].edgeAdjacentFaces();
                            for (var i = 0; i < adjacent.length; i++) {
                                if (faceRanks[adjacent[i].index] === undefined) {
                                    rank[rankI].push(adjacent[i]);
                                    var parentArray = faceRanks[rank[rankI - 1][p].index].parents.slice();
                                    parentArray.unshift(rank[rankI - 1][p]);
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
                }
                edgeExistsThroughPoints(a, b) {
                    for (var i = 0; i < this.edges.length; i++) {
                        console.log(a);
                        console.log(this.edges[i].nodes[0]);
                        if ((a.equivalent(this.edges[i].nodes[0]) && b.equivalent(this.edges[i].nodes[1])) ||
                            (a.equivalent(this.edges[i].nodes[1]) && b.equivalent(this.edges[i].nodes[0]))) {
                            return true;
                        }
                    }
                    return false;
                }
                fewestPolylines() {
                    var cp = this.copy();
                    cp.clean();
                    cp.removeIsolatedNodes();
                    var paths = [];
                    while (cp.edges.length > 0) {
                        var node = cp.nodes[0];
                        var adj = node.adjacentNodes();
                        var polyline = new Polyline();
                        if (adj.length === 0) {
                            cp.removeIsolatedNodes();
                        }
                        else {
                            var nextNode = adj[0];
                            var edge = cp.getEdgeConnectingNodes(node, nextNode);
                            polyline.nodes.push(new XY(node.x, node.y));
                            cp.edges = cp.edges.filter(function (el) {
                                return !((el.nodes[0] === node && el.nodes[1] === nextNode) ||
                                    (el.nodes[0] === nextNode && el.nodes[1] === node));
                            });
                            cp.removeIsolatedNodes();
                            node = nextNode;
                            adj = [];
                            if (node !== undefined) {
                                adj = node.adjacentNodes();
                            }
                            while (adj.length > 0) {
                                nextNode = adj[0];
                                polyline.nodes.push(new XY(node.x, node.y));
                                cp.edges = cp.edges.filter(function (el) {
                                    return !((el.nodes[0] === node && el.nodes[1] === nextNode) ||
                                        (el.nodes[0] === nextNode && el.nodes[1] === node));
                                });
                                cp.removeIsolatedNodes();
                                node = nextNode;
                                adj = node.adjacentNodes();
                            }
                            polyline.nodes.push(new XY(node.x, node.y));
                        }
                        paths.push(polyline);
                    }
                    return paths;
                }
            };
            exports_2("PlanarGraph", PlanarGraph);
        }
    };
});
System.register("src/creasePattern", ["src/planarGraph"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var planarGraph_1, CreaseDirection, Fold, MadeByType, MadeBy, ChangeType, FoldSequence, CreaseSector, CreaseJunction, CreaseNode, Crease, CreaseFace, CreasePattern;
    return {
        setters: [
            function (planarGraph_1_1) {
                planarGraph_1 = planarGraph_1_1;
            }
        ],
        execute: function () {
            "use strict";
            (function (CreaseDirection) {
                CreaseDirection[CreaseDirection["mark"] = 0] = "mark";
                CreaseDirection[CreaseDirection["border"] = 1] = "border";
                CreaseDirection[CreaseDirection["mountain"] = 2] = "mountain";
                CreaseDirection[CreaseDirection["valley"] = 3] = "valley";
            })(CreaseDirection || (CreaseDirection = {}));
            Fold = class Fold {
                constructor(foldFunction, argumentArray) {
                    this.func = undefined;
                    this.args = [];
                    this.func = foldFunction;
                    this.args = argumentArray;
                }
            };
            (function (MadeByType) {
                MadeByType[MadeByType["ray"] = 0] = "ray";
                MadeByType[MadeByType["doubleRay"] = 1] = "doubleRay";
                MadeByType[MadeByType["endpoints"] = 2] = "endpoints";
                MadeByType[MadeByType["axiom1"] = 3] = "axiom1";
                MadeByType[MadeByType["axiom2"] = 4] = "axiom2";
                MadeByType[MadeByType["axiom3"] = 5] = "axiom3";
                MadeByType[MadeByType["axiom4"] = 6] = "axiom4";
                MadeByType[MadeByType["axiom5"] = 7] = "axiom5";
                MadeByType[MadeByType["axiom6"] = 8] = "axiom6";
                MadeByType[MadeByType["axiom7"] = 9] = "axiom7";
            })(MadeByType || (MadeByType = {}));
            MadeBy = class MadeBy {
                constructor() {
                    this.endPoints = [];
                    this.intersections = [];
                }
            };
            (function (ChangeType) {
                ChangeType[ChangeType["position"] = 0] = "position";
                ChangeType[ChangeType["newLine"] = 1] = "newLine";
            })(ChangeType || (ChangeType = {}));
            FoldSequence = class FoldSequence {
            };
            CreaseSector = class CreaseSector extends planarGraph_1.PlanarSector {
                kawasakiFourth() {
                    var junction = this.origin.junction();
                    if (junction.edges.length != 3) {
                        return;
                    }
                    var foundIndex = undefined;
                    for (var i = 0; i < junction.sectors.length; i++) {
                        if (this.equivalent(junction.sectors[i])) {
                            foundIndex = i;
                        }
                    }
                    if (foundIndex === undefined) {
                        return undefined;
                    }
                    var sumEven = 0;
                    var sumOdd = 0;
                    for (var i = 0; i < junction.sectors.length - 1; i++) {
                        var index = (i + foundIndex + 1) % junction.sectors.length;
                        if (i % 2 == 0) {
                            sumEven += junction.sectors[index].angle();
                        }
                        else {
                            sumOdd += junction.sectors[index].angle();
                        }
                    }
                    var dEven = Math.PI - sumEven;
                    var angle0 = this.edges[0].absoluteAngle(this.origin);
                    var newA = angle0 - dEven;
                    return new XY(Math.cos(newA), Math.sin(newA));
                }
            };
            CreaseJunction = class CreaseJunction extends planarGraph_1.PlanarJunction {
                flatFoldable(epsilon) {
                    return this.kawasaki() && this.maekawa();
                }
                alternateAngleSum() {
                    if (this.sectors.length % 2 != 0) {
                        return undefined;
                    }
                    var sums = [0, 0];
                    this.sectors.forEach(function (el, i) { sums[i % 2] += el.angle(); });
                    return sums;
                }
                maekawa() {
                    return true;
                }
                kawasaki(epsilon) {
                    if (epsilon === undefined) {
                        epsilon = EPSILON_HIGH;
                    }
                    var alternating = this.alternateAngleSum();
                    return Math.abs(alternating[0] - alternating[1]) < epsilon;
                }
                kawasakiRating() {
                    var alternating = this.alternateAngleSum();
                    return Math.abs(alternating[0] - alternating[1]);
                }
                kawasakiSolution() {
                    var alternating = this.alternateAngleSum().map(function (el) {
                        return { 'difference': (Math.PI - el), 'sectors': [] };
                    });
                    this.sectors.forEach(function (el, i) { alternating[i % 2].sectors.push(el); });
                    return alternating;
                }
                kawasakiFourth(sector) {
                    if (this.edges.length != 3) {
                        return;
                    }
                    var foundIndex = undefined;
                    for (var i = 0; i < this.sectors.length; i++) {
                        if (sector.equivalent(this.sectors[i])) {
                            foundIndex = i;
                        }
                    }
                    if (foundIndex === undefined) {
                        return undefined;
                    }
                    var sumEven = 0;
                    var sumOdd = 0;
                    for (var i = 0; i < this.sectors.length - 1; i++) {
                        var index = (i + foundIndex + 1) % this.sectors.length;
                        if (i % 2 == 0) {
                            sumEven += this.sectors[index].angle();
                        }
                        else {
                            sumOdd += this.sectors[index].angle();
                        }
                    }
                    var dEven = Math.PI - sumEven;
                    var angle0 = sector.edges[0].absoluteAngle(sector.origin);
                    var newA = angle0 - dEven;
                    return new XY(Math.cos(newA), Math.sin(newA));
                }
            };
            CreaseNode = class CreaseNode extends planarGraph_1.PlanarNode {
                constructor() {
                    super(...arguments);
                    this.junctionType = CreaseJunction;
                    this.sectorType = CreaseSector;
                }
                isBoundary() {
                    for (var i = 0; i < this.graph.boundary.edges.length; i++) {
                        var thisPt = new XY(this.x, this.y);
                        if (this.graph.boundary.edges[i].collinear(thisPt)) {
                            return true;
                        }
                    }
                    return false;
                }
                alternateAngleSum() {
                    return this.junction().alternateAngleSum();
                }
                kawasakiRating() {
                    return this.junction().kawasakiRating();
                }
                flatFoldable(epsilon) {
                    if (this.isBoundary()) {
                        return true;
                    }
                    return this.junction().flatFoldable(epsilon);
                }
                kawasakiFourth(a, b) {
                    var junction = this.junction();
                    var sector = junction.sectorWithEdges(a, b);
                    if (sector !== undefined) {
                        return junction.kawasakiFourth(sector);
                    }
                }
                creaseLineThrough(point) { return this.graph.creaseThroughPoints(this, point); }
                creaseToPoint(point) { return this.graph.creasePointToPoint(this, point); }
            };
            Crease = class Crease extends planarGraph_1.PlanarEdge {
                constructor(graph, node1, node2) {
                    super(graph, node1, node2);
                    this.orientation = CreaseDirection.mark;
                    this.newMadeBy = new MadeBy();
                    this.newMadeBy.endPoints = [node1, node2];
                }
                ;
                mark() { this.orientation = CreaseDirection.mark; return this; }
                mountain() { this.orientation = CreaseDirection.mountain; return this; }
                valley() { this.orientation = CreaseDirection.valley; return this; }
                border() { this.orientation = CreaseDirection.border; return this; }
                creaseToEdge(edge) { return this.graph.creaseEdgeToEdge(this, edge); }
            };
            CreaseFace = class CreaseFace extends planarGraph_1.PlanarFace {
                rabbitEar() {
                    if (this.sectors.length !== 3) {
                        return [];
                    }
                    var rays = this.sectors.map(function (el) {
                        return new Ray(el.origin, el.bisect());
                    });
                    var incenter = rays
                        .map(function (el, i) {
                        var nextEl = rays[(i + 1) % rays.length];
                        return intersectionRayRay(el, nextEl);
                    })
                        .reduce(function (prev, current) { return prev.add(current); })
                        .scale(1.0 / rays.length);
                    return this.nodes.map(function (el) {
                        return this.graph.crease(el, incenter);
                    }, this);
                }
            };
            CreasePattern = class CreasePattern extends planarGraph_1.PlanarGraph {
                constructor() {
                    super();
                    this.symmetryLine = undefined;
                    this.nodeType = CreaseNode;
                    this.edgeType = Crease;
                    this.faceType = CreaseFace;
                    if (this.boundary === undefined) {
                        this.boundary = new ConvexPolygon();
                    }
                    this.square();
                }
                copy() {
                    this.nodeArrayDidChange();
                    this.edgeArrayDidChange();
                    this.faceArrayDidChange();
                    var g = new CreasePattern();
                    g.nodes = [];
                    g.edges = [];
                    g.faces = [];
                    g.boundary = undefined;
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
                    }
                    for (var i = 0; i < this.faces.length; i++) {
                        var f = new planarGraph_1.PlanarFace(g);
                        g.faces.push(f);
                        f.graph = g;
                        f.index = i;
                        if (this.faces[i] !== undefined) {
                            if (this.faces[i].nodes !== undefined) {
                                for (var j = 0; j < this.faces[i].nodes.length; j++) {
                                    var nIndex = this.faces[i].nodes[j].index;
                                    f.nodes.push(g.nodes[nIndex]);
                                }
                            }
                            if (this.faces[i].edges !== undefined) {
                                for (var j = 0; j < this.faces[i].edges.length; j++) {
                                    var eIndex = this.faces[i].edges[j].index;
                                    f.edges.push(g.edges[eIndex]);
                                }
                            }
                            if (this.faces[i].angles !== undefined) {
                                for (var j = 0; j < this.faces[i].angles.length; j++) {
                                    f.angles.push(this.faces[i].angles[j]);
                                }
                            }
                        }
                    }
                    g.boundary = this.boundary.copy();
                    return g;
                }
                fold(param1, param2, param3, param4) {
                }
                foldInHalf() {
                    var crease;
                    return;
                }
                newCrease(a_x, a_y, b_x, b_y) {
                    this.creaseSymmetry(a_x, a_y, b_x, b_y);
                    var newCrease = this.newPlanarEdge(a_x, a_y, b_x, b_y);
                    if (this.didChange !== undefined) {
                        this.didChange(undefined);
                    }
                    return newCrease;
                }
                crease(a, b, c, d) {
                    var e = gimme1Edge(a, b, c, d);
                    if (e === undefined) {
                        return;
                    }
                    var edge = this.boundary.clipEdge(e);
                    if (edge === undefined) {
                        return;
                    }
                    return this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
                }
                creaseRay(a, b, c, d) {
                    var ray = gimme1Ray(a, b, c, d);
                    if (ray === undefined) {
                        return;
                    }
                    var edge = this.boundary.clipRay(ray);
                    if (edge === undefined) {
                        return;
                    }
                    var newCrease = this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
                    return newCrease;
                }
                creaseRayUntilIntersection(ray, target) {
                    var clips = ray.clipWithEdgesDetails(this.edges);
                    if (clips.length > 0) {
                        if (target !== undefined) {
                            var targetEdge = new Edge(ray.origin.x, ray.origin.y, target.x, target.y);
                            if (clips[0].edge.length() > targetEdge.length()) {
                                return this.crease(targetEdge);
                            }
                        }
                        return this.crease(clips[0].edge);
                    }
                    return undefined;
                }
                creaseLineRepeat(a, b, c, d) {
                    var ray = gimme1Ray(a, b, c, d);
                    return this.creaseRayRepeat(ray)
                        .concat(this.creaseRayRepeat(ray.flip()));
                }
                creaseRayRepeat(ray, target) {
                    return new Polyline()
                        .rayReflectRepeat(ray, this.edges, target)
                        .edges()
                        .map(function (edge) {
                        return this.crease(edge);
                    }, this)
                        .filter(function (el) { return el != undefined; });
                }
                creaseSymmetry(ax, ay, bx, by) {
                    if (this.symmetryLine === undefined) {
                        return undefined;
                    }
                    var ra = new XY(ax, ay).reflect(this.symmetryLine);
                    var rb = new XY(bx, by).reflect(this.symmetryLine);
                    return this.newPlanarEdge(ra.x, ra.y, rb.x, rb.y);
                }
                creaseThroughPoints(a, b, c, d) {
                    var inputEdge = gimme1Edge(a, b, c, d);
                    if (inputEdge === undefined) {
                        return;
                    }
                    var edge = this.boundary.clipLine(inputEdge.pointVectorForm());
                    if (edge === undefined) {
                        return;
                    }
                    var newCrease = this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
                    newCrease.madeBy = new Fold(this.creaseThroughPoints, [new XY(a.x, a.y), new XY(b.x, b.y)]);
                    return newCrease;
                }
                creasePointToPoint(a, b, c, d) {
                    var p = gimme2XY(a, b, c, d);
                    if (p === undefined) {
                        return;
                    }
                    var midpoint = new XY((p[0].x + p[1].x) * 0.5, (p[0].y + p[1].y) * 0.5);
                    var v = new XY(p[1].x - p[0].x, p[1].y - p[0].y);
                    var perp1 = v.rotate90();
                    var edge = this.boundary.clipLine(new Line(midpoint, perp1));
                    if (edge !== undefined) {
                        var newCrease = this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
                        newCrease.madeBy = new Fold(this.creasePointToPoint, [new XY(p[0].x, p[0].y), new XY(p[1].x, p[1].y)]);
                        return newCrease;
                    }
                }
                creaseEdgeToEdge(one, two) {
                    var a = new Edge(one.nodes[0].x, one.nodes[0].y, one.nodes[1].x, one.nodes[1].y);
                    var b = new Edge(two.nodes[0].x, two.nodes[0].y, two.nodes[1].x, two.nodes[1].y);
                    if (a.parallel(b)) {
                        var u = a.nodes[0].subtract(a.nodes[1]);
                        var midpoint = a.nodes[0].midpoint(b.nodes[1]);
                        var clip = this.boundary.clipLine(new Line(midpoint, u));
                        return [this.newCrease(clip.nodes[0].x, clip.nodes[0].y, clip.nodes[1].x, clip.nodes[1].y)];
                    }
                    else {
                        var intersection = intersectionLineLine(a.pointVectorForm(), b.pointVectorForm());
                        var u = a.nodes[1].subtract(a.nodes[0]);
                        var v = b.nodes[1].subtract(b.nodes[0]);
                        var vectors = bisect(u, v);
                        vectors[1] = vectors[0].rotate90();
                        return vectors
                            .map(function (el) { return this.boundary.clipLine(new Line(intersection, el)); }, this)
                            .filter(function (el) { return el !== undefined; })
                            .map(function (el) {
                            return this.newCrease(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y);
                        }, this)
                            .sort(function (a, b) {
                            return Math.abs(u.cross(vectors[0])) - Math.abs(u.cross(vectors[1]));
                        });
                    }
                }
                creasePerpendicularThroughPoint(line, point) {
                    var ab = new XY(line.nodes[1].x - line.nodes[0].x, line.nodes[1].y - line.nodes[0].y);
                    var perp = new XY(-ab.y, ab.x);
                    var point2 = new XY(point.x + perp.x, point.y + perp.y);
                    var crease = this.creaseThroughPoints(point, point2);
                    if (crease !== undefined) {
                        crease.madeBy = new Fold(this.creasePerpendicularThroughPoint, [new XY(line.nodes[0].x, line.nodes[0].y), new XY(line.nodes[1].x, line.nodes[1].y), new XY(point.x, point.y)]);
                    }
                    return crease;
                }
                creasePointToLine(origin, point, line) {
                    var radius = Math.sqrt(Math.pow(origin.x - point.x, 2) + Math.pow(origin.y - point.y, 2));
                    var intersections = circleLineIntersectionAlgorithm(origin, radius, line.nodes[0], line.nodes[1]);
                    var creases = [];
                    for (var i = 0; i < intersections.length; i++) {
                        creases.push(this.creasePointToPoint(point, intersections[i]));
                    }
                    return creases;
                }
                creasePerpendicularPointOntoLine(point, ontoLine, perpendicularTo) {
                    var endPts = perpendicularTo.nodes;
                    var align = new XY(endPts[1].x - endPts[0].x, endPts[1].y - endPts[0].y);
                    var intersection = intersectionLineLine(new Line(point, align), ontoLine.pointVectorForm());
                    if (intersection != undefined) {
                        var midPoint = new XY((intersection.x + point.x) * 0.5, (intersection.y + point.y) * 0.5);
                        var perp = new XY(-align.y, align.x);
                        var midPoint2 = new XY(midPoint.x + perp.x, midPoint.y + perp.y);
                        return this.creaseThroughPoints(midPoint, midPoint2);
                    }
                    throw "axiom 7: two crease lines cannot be parallel";
                }
                pleat(one, two, count) {
                    var a = new Edge(one.nodes[0].x, one.nodes[0].y, one.nodes[1].x, one.nodes[1].y);
                    var b = new Edge(two.nodes[0].x, two.nodes[0].y, two.nodes[1].x, two.nodes[1].y);
                    var u, v;
                    if (a.parallel(b)) {
                        u = a.nodes[0].subtract(a.nodes[1]);
                        v = b.nodes[0].subtract(b.nodes[1]);
                        return Array.apply(null, Array(count - 1))
                            .map(function (el, i) { return (i + 1) / count; }, this)
                            .map(function (el) {
                            var origin = a.nodes[0].lerp(b.nodes[0], el);
                            return this.boundary.clipLine(new Line(origin, u));
                        }, this)
                            .filter(function (el) { return el !== undefined; }, this)
                            .map(function (el) { return this.newCrease(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y); }, this);
                    }
                    else if (a.nodes[0].equivalent(b.nodes[0]) ||
                        a.nodes[0].equivalent(b.nodes[1]) ||
                        a.nodes[1].equivalent(b.nodes[0]) ||
                        a.nodes[1].equivalent(b.nodes[1])) {
                        var c, aUn, bUn;
                        if (a.nodes[0].equivalent(b.nodes[0])) {
                            c = a.nodes[0];
                            aUn = a.nodes[1];
                            bUn = b.nodes[1];
                        }
                        if (a.nodes[0].equivalent(b.nodes[1])) {
                            c = a.nodes[0];
                            aUn = a.nodes[1];
                            bUn = b.nodes[0];
                        }
                        if (a.nodes[1].equivalent(b.nodes[0])) {
                            c = a.nodes[1];
                            aUn = a.nodes[0];
                            bUn = b.nodes[1];
                        }
                        if (a.nodes[1].equivalent(b.nodes[1])) {
                            c = a.nodes[1];
                            aUn = a.nodes[0];
                            bUn = b.nodes[0];
                        }
                        u = aUn.subtract(c);
                        v = bUn.subtract(c);
                        return Array.apply(null, Array(count - 1))
                            .map(function (el, i) { return (i + 1) / count; }, this)
                            .map(function (el) {
                            var vector = u.angleLerp(v, el);
                            return this.boundary.clipLine(new Line(c, vector));
                        }, this)
                            .filter(function (el) { return el !== undefined; }, this)
                            .map(function (el) { return this.newCrease(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y); }, this);
                    }
                    else {
                        var intersection = intersectionLineLine(a.pointVectorForm(), b.pointVectorForm());
                        if (a.nodes[0].equivalent(intersection), EPSILON_LOW) {
                            u = a.nodes[1].subtract(intersection);
                        }
                        else {
                            u = a.nodes[0].subtract(intersection);
                        }
                        if (b.nodes[0].equivalent(intersection), EPSILON_LOW) {
                            v = b.nodes[1].subtract(intersection);
                        }
                        else {
                            v = b.nodes[0].subtract(intersection);
                        }
                        return Array.apply(null, Array(count - 1))
                            .map(function (el, i) { return (i + 1) / count; }, this)
                            .map(function (el) {
                            var vector = u.angleLerp(v, el);
                            return this.boundary.clipLine(new Line(intersection, vector));
                        }, this)
                            .filter(function (el) { return el !== undefined; }, this)
                            .map(function (el) { return this.newCrease(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y); }, this);
                    }
                }
                coolPleat(one, two, count) {
                    var a = new Edge(one.nodes[0].x, one.nodes[0].y, one.nodes[1].x, one.nodes[1].y);
                    var b = new Edge(two.nodes[0].x, two.nodes[0].y, two.nodes[1].x, two.nodes[1].y);
                    var u = a.nodes[0].subtract(a.nodes[1]);
                    var v = b.nodes[0].subtract(b.nodes[1]);
                    return Array.apply(null, Array(count - 1))
                        .map(function (el, i) { return (i + 1) / count; }, this)
                        .map(function (el) {
                        var origin = a.nodes[0].lerp(b.nodes[0], el);
                        var vector = u.lerp(v, el);
                        return this.boundary.clipLine(new Line(origin, vector));
                    }, this)
                        .filter(function (el) { return el !== undefined; }, this)
                        .map(function (el) { return this.newCrease(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y); }, this);
                }
                creaseVoronoi(v, interp) {
                    if (interp === undefined) {
                        interp = 0.5;
                    }
                    var edges = v.edges.filter(function (el) { return !el.isBoundary; });
                    var cells = v.cells.map(function (cell) {
                        return cell.edges.map(function (edge) {
                            return edge.endPoints.map(function (el) {
                                return cell.site.lerp(el, interp);
                            });
                        }, this);
                    }, this);
                    var sortedMolecules = v.generateSortedMolecules(interp);
                    sortedMolecules.forEach(function (arr) {
                        arr.forEach(function (m) {
                            var edges = m.generateCreases();
                            edges.forEach(function (el) {
                                this.crease(el.nodes[0], el.nodes[1]);
                            }, this);
                        }, this);
                    }, this);
                    edges.forEach(function (edge) {
                        var c = this.crease(edge.endPoints[0], edge.endPoints[1]);
                        if (c !== undefined) {
                            c.valley();
                        }
                    }, this);
                    cells.forEach(function (cell) {
                        cell.forEach(function (edge) {
                            this.crease(edge[0], edge[1]).mountain();
                        }, this);
                    }, this);
                    return sortedMolecules.reduce(function (prev, current) { return prev.concat(current); });
                }
                possibleFolds() {
                    var next = this.copy();
                    next.nodes = [];
                    next.edges = [];
                    next.faces = [];
                    console.time("edge2edge");
                    for (var i = 0; i < this.edges.length - 1; i++) {
                        for (var j = i + 1; j < this.edges.length; j++) {
                            next.creaseEdgeToEdge(this.edges[i], this.edges[j]);
                        }
                    }
                    console.timeEnd("edge2edge");
                    console.time("creasepoints");
                    for (var i = 0; i < this.nodes.length - 1; i++) {
                        for (var j = i + 1; j < this.nodes.length; j++) {
                            next.creaseThroughPoints(this.nodes[i], this.nodes[j]);
                            next.creasePointToPoint(this.nodes[i], this.nodes[j]);
                        }
                    }
                    console.timeEnd("creasepoints");
                    next.cleanDuplicateNodes();
                    return next;
                }
                possibleFolds1() {
                    var next = this.copy();
                    next.nodes = [];
                    next.edges = [];
                    next.faces = [];
                    for (var i = 0; i < this.nodes.length - 1; i++) {
                        for (var j = i + 1; j < this.nodes.length; j++) {
                            next.creaseThroughPoints(this.nodes[i], this.nodes[j]);
                        }
                    }
                    return next;
                }
                possibleFolds2() {
                    var next = this.copy();
                    next.nodes = [];
                    next.edges = [];
                    next.faces = [];
                    for (var i = 0; i < this.nodes.length - 1; i++) {
                        for (var j = i + 1; j < this.nodes.length; j++) {
                            next.creasePointToPoint(this.nodes[i], this.nodes[j]);
                        }
                    }
                    return next;
                }
                possibleFolds3(edges) {
                    var next = this.copy();
                    next.nodes = [];
                    next.edges = [];
                    next.faces = [];
                    if (edges === undefined) {
                        edges = this.edges;
                    }
                    for (var i = 0; i < edges.length - 1; i++) {
                        for (var j = i + 1; j < edges.length; j++) {
                            next.creaseEdgeToEdge(edges[i], edges[j]);
                        }
                    }
                    return next;
                }
                wiggle() {
                    var lengths = this.edges.forEach(function (crease, i) {
                        return crease.length();
                    });
                    var nodesAttempted = 0;
                    for (var i = 0; i < this.nodes.length; i++) {
                        var rating = this.nodes[i].kawasakiRating();
                        if (rating > EPSILON) {
                            nodesAttempted++;
                            var guesses = [];
                            for (var n = 0; n < 12; n++) {
                                var randomAngle = Math.random() * Math.PI * 20;
                                var radius = Math.random() * rating;
                                var move = new XY(0.05 * radius * Math.cos(randomAngle), 0.05 * radius * Math.sin(randomAngle));
                                this.nodes[i].x += move.x;
                                this.nodes[i].y += move.y;
                                var newRating = this.nodes[i].kawasakiRating();
                                var adjNodes = this.nodes[i].adjacentNodes();
                                var adjRating = 0;
                                for (var adj = 0; adj < adjNodes.length; adj++) {
                                    adjRating += this.nodes[i].kawasakiRating();
                                }
                                guesses.push({ xy: move, rating: newRating + adjRating });
                                this.nodes[i].x -= move.x;
                                this.nodes[i].y -= move.y;
                            }
                            var sortedGuesses = guesses.sort(function (a, b) { return a.rating - b.rating; });
                            this.nodes[i].x += sortedGuesses[0].xy.x;
                            this.nodes[i].y += sortedGuesses[0].xy.y;
                        }
                    }
                    return nodesAttempted;
                }
                flatFoldable() {
                    return this.nodes.map(function (el) { return el.flatFoldable(); })
                        .reduce(function (prev, cur) { return prev && cur; });
                }
                bounds() { return this.boundary.minimumRect(); }
                bottomEdge() {
                    return this.edges
                        .filter(function (el) { return el.orientation === CreaseDirection.border; })
                        .sort(function (a, b) { return (b.nodes[0].y + b.nodes[1].y) - (a.nodes[0].y + a.nodes[1].y); })
                        .shift();
                }
                topEdge() {
                    return this.edges
                        .filter(function (el) { return el.orientation === CreaseDirection.border; })
                        .sort(function (a, b) { return (a.nodes[0].y + a.nodes[1].y) - (b.nodes[0].y + b.nodes[1].y); })
                        .shift();
                }
                rightEdge() {
                    return this.edges
                        .filter(function (el) { return el.orientation === CreaseDirection.border; })
                        .sort(function (a, b) { return (b.nodes[0].x + b.nodes[1].x) - (a.nodes[0].x + a.nodes[1].x); })
                        .shift();
                }
                leftEdge() {
                    return this.edges
                        .filter(function (el) { return el.orientation === CreaseDirection.border; })
                        .sort(function (a, b) { return (a.nodes[0].x + a.nodes[1].x) - (b.nodes[0].x + b.nodes[1].x); })
                        .shift();
                }
                contains(p) { return this.boundary.contains(p); }
                square(width) {
                    var w = 1.0;
                    if (width != undefined && width != 0) {
                        w = Math.abs(width);
                    }
                    return this.setBoundary([new XY(0, 0), new XY(w, 0), new XY(w, w), new XY(0, w)]);
                }
                rectangle(width, height) {
                    if (width === undefined || height === undefined) {
                        return this;
                    }
                    width = Math.abs(width);
                    height = Math.abs(height);
                    var points = [new XY(0, 0),
                        new XY(width, 0),
                        new XY(width, height),
                        new XY(0, height)];
                    return this.setBoundary(points);
                }
                hexagon(radius) {
                    if (radius === undefined) {
                        radius = 0.5;
                    }
                    var sqt = 0.8660254;
                    radius = Math.abs(radius);
                    var points = [new XY(radius * 0.5, radius * 0.8660254),
                        new XY(radius, 0),
                        new XY(radius * 0.5, -radius * 0.8660254),
                        new XY(-radius * 0.5, -radius * 0.8660254),
                        new XY(-radius, 0),
                        new XY(-radius * 0.5, radius * 0.8660254)];
                    return this.setBoundary(points);
                }
                noBoundary() {
                    this.boundary.edges = [];
                    this.edges = this.edges.filter(function (el) { return el.orientation !== CreaseDirection.border; });
                    this.cleanAllUselessNodes();
                    return this;
                }
                setBoundary(points, alreadyClockwiseSorted) {
                    if (points[0].equivalent(points[points.length - 1])) {
                        points.pop();
                    }
                    if (alreadyClockwiseSorted !== undefined && alreadyClockwiseSorted === true) {
                        this.boundary.edges = this.boundary.setEdgesFromPoints(points);
                    }
                    else {
                        this.boundary.convexHull(points);
                    }
                    this.edges = this.edges.filter(function (el) { return el.orientation !== CreaseDirection.border; });
                    this.cleanAllUselessNodes();
                    this.boundary.edges.forEach(function (el) {
                        this.newPlanarEdge(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y).border();
                    }, this);
                    this.cleanDuplicateNodes();
                    return this;
                }
                setMinRectBoundary() {
                    this.edges = this.edges.filter(function (el) { return el.orientation !== CreaseDirection.border; });
                    var xMin = Infinity;
                    var xMax = 0;
                    var yMin = Infinity;
                    var yMax = 0;
                    for (var i = 0; i < this.nodes.length; i++) {
                        if (this.nodes[i].x > xMax) {
                            xMax = this.nodes[i].x;
                        }
                        if (this.nodes[i].x < xMin) {
                            xMin = this.nodes[i].x;
                        }
                        if (this.nodes[i].y > yMax) {
                            yMax = this.nodes[i].y;
                        }
                        if (this.nodes[i].y < yMin) {
                            yMin = this.nodes[i].y;
                        }
                    }
                    this.setBoundary([new XY(xMin, yMin), new XY(xMax, yMin), new XY(xMax, yMax), new XY(xMin, yMax)]);
                    return this;
                }
                clear() {
                    this.nodes = [];
                    this.edges = [];
                    this.faces = [];
                    this.symmetryLine = undefined;
                    if (this.boundary === undefined) {
                        return this;
                    }
                    for (var i = 0; i < this.boundary.edges.length; i++) {
                        var nodes = this.boundary.edges[i].nodes;
                        this.newPlanarEdge(nodes[0].x, nodes[0].y, nodes[1].x, nodes[1].y).border();
                    }
                    this.cleanDuplicateNodes();
                    return this;
                }
                noSymmetry() { this.symmetryLine = undefined; return this; }
                bookSymmetry() {
                    var center = this.boundary.center();
                    return this.setSymmetryLine(center, center.add(new XY(0, 1)));
                }
                diagonalSymmetry() {
                    var center = this.boundary.center();
                    return this.setSymmetryLine(center, center.add(new XY(1, 1)));
                }
                setSymmetryLine(a, b, c, d) {
                    var edge = gimme1Edge(a, b, c, d);
                    this.symmetryLine = new Line(edge.nodes[0], edge.nodes[1].subtract(edge.nodes[1]));
                    return this;
                }
                exportFoldFile() {
                    this.generateFaces();
                    this.nodeArrayDidChange();
                    this.edgeArrayDidChange();
                    var file = {};
                    file["file_spec"] = 1;
                    file["file_creator"] = "creasepattern.js by R.Kraft";
                    file["file_author"] = "";
                    file["file_classes"] = ["singleModel"];
                    file["vertices_coords"] = this.nodes.map(function (node) { return [node.x, node.y]; }, this);
                    file["faces_vertices"] = this.faces.map(function (face) {
                        return face.nodes.map(function (node) { return node.index; }, this);
                    }, this);
                    file["edges_vertices"] = this.edges.map(function (edge) {
                        return edge.nodes.map(function (node) { return node.index; }, this);
                    }, this);
                    file["edges_assignment"] = this.edges.map(function (edge) {
                        switch (edge.orientation) {
                            case CreaseDirection.border: return "B";
                            case CreaseDirection.mountain: return "M";
                            case CreaseDirection.valley: return "V";
                            case CreaseDirection.mark: return "F";
                            default: return "U";
                        }
                    }, this);
                    return file;
                }
                importFoldFile(file) {
                    if (file === undefined ||
                        file["vertices_coords"] === undefined ||
                        file["edges_vertices"] === undefined) {
                        return false;
                    }
                    if (file["frame_attributes"] !== undefined && file["frame_attributes"].contains("3D")) {
                        console.log("importFoldFile(): FOLD file marked as '3D', this library only supports 2D. attempting import anyway, expect a possible distortion due to orthogonal projection.");
                    }
                    this.clear();
                    this.noBoundary();
                    file["vertices_coords"].forEach(function (el) {
                        this.newPlanarNode((el[0] || 0), (el[1] || 0));
                    }, this);
                    this.nodeArrayDidChange();
                    file["edges_vertices"]
                        .map(function (el) {
                        return el.map(function (index) { return this.nodes[index]; }, this);
                    }, this)
                        .filter(function (el) { return el[0] !== undefined && el[1] !== undefined; }, this)
                        .forEach(function (nodes) {
                        this.newPlanarEdgeBetweenNodes(nodes[0], nodes[1]);
                    }, this);
                    this.edgeArrayDidChange();
                    var assignmentDictionary = { "B": CreaseDirection.border, "M": CreaseDirection.mountain, "V": CreaseDirection.valley, "F": CreaseDirection.mark, "U": CreaseDirection.mark };
                    file["edges_assignment"]
                        .map(function (assignment) { return assignmentDictionary[assignment]; })
                        .forEach(function (orientation, i) { this.edges[i].orientation = orientation; }, this);
                    var boundaryPoints = this.edges
                        .filter(function (el) { return el.orientation === CreaseDirection.border; }, this)
                        .map(function (el) {
                        return [el.nodes[0].xy(), el.nodes[1].xy()];
                    }, this);
                    this.setBoundary([].concat.apply([], boundaryPoints));
                    this.clean();
                    return true;
                }
                exportSVG(size) {
                    if (size === undefined || size <= 0) {
                        size = 600;
                    }
                    var bounds = this.bounds();
                    var width = bounds.size.width;
                    var height = bounds.size.height;
                    var orgX = bounds.topLeft.x;
                    var orgY = bounds.topLeft.y;
                    var scale = size / (width);
                    console.log(bounds, width, orgX, scale);
                    var blob = "";
                    var widthScaled = ((width) * scale).toFixed(2);
                    var heightScaled = ((height) * scale).toFixed(2);
                    var strokeWidth = ((width) * scale * 0.0025).toFixed(1);
                    var dashW = ((width) * scale * 0.0025 * 3).toFixed(1);
                    var dashWOff = ((width) * scale * 0.0025 * 3 * 0.5).toFixed(1);
                    if (strokeWidth === "0" || strokeWidth === "0.0") {
                        strokeWidth = "0.5";
                    }
                    blob = blob + "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"" + widthScaled + "px\" height=\"" + heightScaled + "px\" viewBox=\"0 0 " + widthScaled + " " + heightScaled + "\">\n<g>\n";
                    blob += "<line stroke=\"#000000\" stroke-width=\"" + strokeWidth + "\" x1=\"0\" y1=\"0\" x2=\"" + widthScaled + "\" y2=\"0\"/>\n" + "<line fill=\"none\" stroke-width=\"" + strokeWidth + "\" stroke=\"#000000\" stroke-miterlimit=\"10\" x1=\"" + widthScaled + "\" y1=\"0\" x2=\"" + widthScaled + "\" y2=\"" + heightScaled + "\"/>\n" + "<line fill=\"none\" stroke-width=\"" + strokeWidth + "\" stroke=\"#000000\" stroke-miterlimit=\"10\" x1=\"" + widthScaled + "\" y1=\"" + heightScaled + "\" x2=\"0\" y2=\"" + heightScaled + "\"/>\n" + "<line fill=\"none\" stroke-width=\"" + strokeWidth + "\" stroke=\"#000000\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"" + heightScaled + "\" x2=\"0\" y2=\"0\"/>\n";
                    var valleyStyle = "stroke=\"#4379FF\" stroke-dasharray=\"" + dashW + "," + dashWOff + "\" ";
                    var mountainStyle = "stroke=\"#EE1032\" ";
                    var noStyle = "stroke=\"#000000\" ";
                    for (var i = 0; i < this.edges.length; i++) {
                        var a = this.edges[i].nodes[0];
                        var b = this.edges[i].nodes[1];
                        var x1 = ((a.x - orgX) * scale).toFixed(4);
                        var y1 = ((a.y - orgY) * scale).toFixed(4);
                        var x2 = ((b.x - orgX) * scale).toFixed(4);
                        var y2 = ((b.y - orgY) * scale).toFixed(4);
                        var thisStyle = noStyle;
                        if (this.edges[i].orientation === CreaseDirection.mountain) {
                            thisStyle = mountainStyle;
                        }
                        if (this.edges[i].orientation === CreaseDirection.valley) {
                            thisStyle = valleyStyle;
                        }
                        blob += "<line " + thisStyle + "stroke-width=\"" + strokeWidth + "\" x1=\"" + x1 + "\" y1=\"" + y1 + "\" x2=\"" + x2 + "\" y2=\"" + y2 + "\"/>\n";
                    }
                    blob = blob + "</g>\n</svg>\n";
                    return blob;
                }
                exportSVGMin(size) {
                    if (size === undefined || size <= 0) {
                        size = 600;
                    }
                    var bounds = this.bounds();
                    var width = bounds.size.width;
                    var height = bounds.size.height;
                    var padX = bounds.topLeft.x;
                    var padY = bounds.topLeft.y;
                    var scale = size / (width + padX * 2);
                    var strokeWidth = (width * scale * 0.0025).toFixed(1);
                    if (strokeWidth === "0" || strokeWidth === "0.0") {
                        strokeWidth = "0.5";
                    }
                    var polylines = this.fewestPolylines();
                    var blob = "";
                    blob = blob + "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"" + ((width + padX * 2) * scale) + "px\" height=\"" + ((height + padY * 2) * scale) + "px\" viewBox=\"0 0 " + ((width + padX * 2) * scale) + " " + ((height + padY * 2) * scale) + "\">\n<g>\n";
                    for (var i = 0; i < polylines.length; i++) {
                        if (polylines[i].nodes.length >= 0) {
                            blob += "<polyline fill=\"none\" stroke-width=\"" + strokeWidth + "\" stroke=\"#000000\" points=\"";
                            for (var j = 0; j < polylines[i].nodes.length; j++) {
                                var point = polylines[i].nodes[j];
                                blob += (scale * point.x).toFixed(4) + "," + (scale * point.y).toFixed(4) + " ";
                            }
                            blob += "\"/>\n";
                        }
                    }
                    blob = blob + "</g>\n</svg>\n";
                    return blob;
                }
                kiteBase() {
                    this.clear();
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
                }
                fishBase() {
                    this.clear();
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
                }
                birdBase() {
                    this.clear();
                    this.newPlanarEdge(0.0, 0.0, 0.5, 0.0).border();
                    this.newPlanarEdge(0.5, 0.0, 1.0, 0.0).border();
                    this.newPlanarEdge(1.0, 0.0, 1.0, 0.5).border();
                    this.newPlanarEdge(1.0, 0.5, 1.0, 1.0).border();
                    this.newPlanarEdge(1.0, 1.0, 0.5, 1.0).border();
                    this.newPlanarEdge(0.5, 1.0, 0.0, 1.0).border();
                    this.newPlanarEdge(0.0, 1.0, 0.0, 0.5).border();
                    this.newPlanarEdge(0.0, 0.5, 0.0, 0.0).border();
                    this.newPlanarEdge(0, 1, 0.5, .79290).mountain();
                    this.newPlanarEdge(0, 1, .20710, 0.5).mountain();
                    this.newPlanarEdge(1, 0, 0.5, .20710).mountain();
                    this.newPlanarEdge(1, 0, .79290, 0.5).mountain();
                    this.newPlanarEdge(1, 1, .79290, 0.5).mountain();
                    this.newPlanarEdge(1, 1, 0.5, .79290).mountain();
                    this.newPlanarEdge(0, 0, .20710, 0.5).mountain();
                    this.newPlanarEdge(0, 0, 0.5, .20710).mountain();
                    this.newPlanarEdge(0, 0, .35354, .35354).valley();
                    this.newPlanarEdge(.35354, .64645, 0, 1).valley();
                    this.newPlanarEdge(1, 0, .64645, .35354).mountain();
                    this.newPlanarEdge(.64645, .64645, 1, 1).valley();
                    this.newPlanarEdge(0.5, 0.5, .35354, .64645).valley();
                    this.newPlanarEdge(.64645, .35354, 0.5, 0.5).mountain();
                    this.newPlanarEdge(0.5, 0.5, .64645, .64645).valley();
                    this.newPlanarEdge(.35354, .35354, 0.5, 0.5).valley();
                    this.newPlanarEdge(.35354, .35354, .20710, 0.5).mark();
                    this.newPlanarEdge(0.5, .20710, .35354, .35354).mark();
                    this.newPlanarEdge(.35354, .64645, 0.5, .79290).mark();
                    this.newPlanarEdge(.20710, 0.5, .35354, .64645).mark();
                    this.newPlanarEdge(.64645, .64645, .79290, 0.5).mark();
                    this.newPlanarEdge(0.5, .79290, .64645, .64645).mark();
                    this.newPlanarEdge(.64645, .35354, 0.5, .20710).mark();
                    this.newPlanarEdge(.79290, 0.5, .64645, .35354).mark();
                    this.newPlanarEdge(0.5, 0.5, 0.5, .79290).mountain();
                    this.newPlanarEdge(0.5, .20710, 0.5, 0.5).mountain();
                    this.newPlanarEdge(0.5, 0.5, .79290, 0.5).mountain();
                    this.newPlanarEdge(.20710, 0.5, 0.5, 0.5).mountain();
                    this.newPlanarEdge(0.5, .20710, 0.5, 0).valley();
                    this.newPlanarEdge(.79290, 0.5, 1, 0.5).valley();
                    this.newPlanarEdge(0.5, .79290, 0.5, 1).valley();
                    this.newPlanarEdge(.20710, 0.5, 0, 0.5).valley();
                    this.clean();
                    return this;
                }
                frogBase() {
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
                    this.fragment();
                    this.clean();
                    return this;
                }
            };
        }
    };
});
!function (t) { if ("object" == typeof exports && "undefined" != typeof module)
    module.exports = t();
else if ("function" == typeof define && define.amd)
    define([], t);
else {
    var i;
    i = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, i.rbush = t();
} }(function () { return function t(i, n, e) { function r(h, o) { if (!n[h]) {
    if (!i[h]) {
        var s = "function" == typeof require && require;
        if (!o && s)
            return s(h, !0);
        if (a)
            return a(h, !0);
        var l = new Error("Cannot find module '" + h + "'");
        throw l.code = "MODULE_NOT_FOUND", l;
    }
    var f = n[h] = { exports: {} };
    i[h][0].call(f.exports, function (t) { var n = i[h][1][t]; return r(n ? n : t); }, f, f.exports, t, i, n, e);
} return n[h].exports; } for (var a = "function" == typeof require && require, h = 0; h < e.length; h++)
    r(e[h]); return r; }({ 1: [function (t, i, n) {
            "use strict";
            function e(t, i) { return this instanceof e ? (this._maxEntries = Math.max(4, t || 9), this._minEntries = Math.max(2, Math.ceil(.4 * this._maxEntries)), i && this._initFormat(i), void this.clear()) : new e(t, i); }
            function r(t, i, n) { if (!n)
                return i.indexOf(t); for (var e = 0; e < i.length; e++)
                if (n(t, i[e]))
                    return e; return -1; }
            function a(t, i) { h(t, 0, t.children.length, i, t); }
            function h(t, i, n, e, r) { r || (r = p(null)), r.minX = 1 / 0, r.minY = 1 / 0, r.maxX = -(1 / 0), r.maxY = -(1 / 0); for (var a, h = i; h < n; h++)
                a = t.children[h], o(r, t.leaf ? e(a) : a); return r; }
            function o(t, i) { return t.minX = Math.min(t.minX, i.minX), t.minY = Math.min(t.minY, i.minY), t.maxX = Math.max(t.maxX, i.maxX), t.maxY = Math.max(t.maxY, i.maxY), t; }
            function s(t, i) { return t.minX - i.minX; }
            function l(t, i) { return t.minY - i.minY; }
            function f(t) { return (t.maxX - t.minX) * (t.maxY - t.minY); }
            function u(t) { return t.maxX - t.minX + (t.maxY - t.minY); }
            function c(t, i) { return (Math.max(i.maxX, t.maxX) - Math.min(i.minX, t.minX)) * (Math.max(i.maxY, t.maxY) - Math.min(i.minY, t.minY)); }
            function m(t, i) { var n = Math.max(t.minX, i.minX), e = Math.max(t.minY, i.minY), r = Math.min(t.maxX, i.maxX), a = Math.min(t.maxY, i.maxY); return Math.max(0, r - n) * Math.max(0, a - e); }
            function d(t, i) { return t.minX <= i.minX && t.minY <= i.minY && i.maxX <= t.maxX && i.maxY <= t.maxY; }
            function x(t, i) { return i.minX <= t.maxX && i.minY <= t.maxY && i.maxX >= t.minX && i.maxY >= t.minY; }
            function p(t) { return { children: t, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -(1 / 0), maxY: -(1 / 0) }; }
            function M(t, i, n, e, r) { for (var a, h = [i, n]; h.length;)
                n = h.pop(), i = h.pop(), n - i <= e || (a = i + Math.ceil((n - i) / e / 2) * e, g(t, a, i, n, r), h.push(i, a, a, n)); }
            i.exports = e;
            var g = t("quickselect");
            e.prototype = { all: function () { return this._all(this.data, []); }, search: function (t) { var i = this.data, n = [], e = this.toBBox; if (!x(t, i))
                    return n; for (var r, a, h, o, s = []; i;) {
                    for (r = 0, a = i.children.length; r < a; r++)
                        h = i.children[r], o = i.leaf ? e(h) : h, x(t, o) && (i.leaf ? n.push(h) : d(t, o) ? this._all(h, n) : s.push(h));
                    i = s.pop();
                } return n; }, collides: function (t) { var i = this.data, n = this.toBBox; if (!x(t, i))
                    return !1; for (var e, r, a, h, o = []; i;) {
                    for (e = 0, r = i.children.length; e < r; e++)
                        if (a = i.children[e], h = i.leaf ? n(a) : a, x(t, h)) {
                            if (i.leaf || d(t, h))
                                return !0;
                            o.push(a);
                        }
                    i = o.pop();
                } return !1; }, load: function (t) { if (!t || !t.length)
                    return this; if (t.length < this._minEntries) {
                    for (var i = 0, n = t.length; i < n; i++)
                        this.insert(t[i]);
                    return this;
                } var e = this._build(t.slice(), 0, t.length - 1, 0); if (this.data.children.length)
                    if (this.data.height === e.height)
                        this._splitRoot(this.data, e);
                    else {
                        if (this.data.height < e.height) {
                            var r = this.data;
                            this.data = e, e = r;
                        }
                        this._insert(e, this.data.height - e.height - 1, !0);
                    }
                else
                    this.data = e; return this; }, insert: function (t) { return t && this._insert(t, this.data.height - 1), this; }, clear: function () { return this.data = p([]), this; }, remove: function (t, i) { if (!t)
                    return this; for (var n, e, a, h, o = this.data, s = this.toBBox(t), l = [], f = []; o || l.length;) {
                    if (o || (o = l.pop(), e = l[l.length - 1], n = f.pop(), h = !0), o.leaf && (a = r(t, o.children, i), a !== -1))
                        return o.children.splice(a, 1), l.push(o), this._condense(l), this;
                    h || o.leaf || !d(o, s) ? e ? (n++, o = e.children[n], h = !1) : o = null : (l.push(o), f.push(n), n = 0, e = o, o = o.children[0]);
                } return this; }, toBBox: function (t) { return t; }, compareMinX: s, compareMinY: l, toJSON: function () { return this.data; }, fromJSON: function (t) { return this.data = t, this; }, _all: function (t, i) { for (var n = []; t;)
                    t.leaf ? i.push.apply(i, t.children) : n.push.apply(n, t.children), t = n.pop(); return i; }, _build: function (t, i, n, e) { var r, h = n - i + 1, o = this._maxEntries; if (h <= o)
                    return r = p(t.slice(i, n + 1)), a(r, this.toBBox), r; e || (e = Math.ceil(Math.log(h) / Math.log(o)), o = Math.ceil(h / Math.pow(o, e - 1))), r = p([]), r.leaf = !1, r.height = e; var s, l, f, u, c = Math.ceil(h / o), m = c * Math.ceil(Math.sqrt(o)); for (M(t, i, n, m, this.compareMinX), s = i; s <= n; s += m)
                    for (f = Math.min(s + m - 1, n), M(t, s, f, c, this.compareMinY), l = s; l <= f; l += c)
                        u = Math.min(l + c - 1, f), r.children.push(this._build(t, l, u, e - 1)); return a(r, this.toBBox), r; }, _chooseSubtree: function (t, i, n, e) { for (var r, a, h, o, s, l, u, m;;) {
                    if (e.push(i), i.leaf || e.length - 1 === n)
                        break;
                    for (u = m = 1 / 0, r = 0, a = i.children.length; r < a; r++)
                        h = i.children[r], s = f(h), l = c(t, h) - s, l < m ? (m = l, u = s < u ? s : u, o = h) : l === m && s < u && (u = s, o = h);
                    i = o || i.children[0];
                } return i; }, _insert: function (t, i, n) { var e = this.toBBox, r = n ? t : e(t), a = [], h = this._chooseSubtree(r, this.data, i, a); for (h.children.push(t), o(h, r); i >= 0 && a[i].children.length > this._maxEntries;)
                    this._split(a, i), i--; this._adjustParentBBoxes(r, a, i); }, _split: function (t, i) { var n = t[i], e = n.children.length, r = this._minEntries; this._chooseSplitAxis(n, r, e); var h = this._chooseSplitIndex(n, r, e), o = p(n.children.splice(h, n.children.length - h)); o.height = n.height, o.leaf = n.leaf, a(n, this.toBBox), a(o, this.toBBox), i ? t[i - 1].children.push(o) : this._splitRoot(n, o); }, _splitRoot: function (t, i) { this.data = p([t, i]), this.data.height = t.height + 1, this.data.leaf = !1, a(this.data, this.toBBox); }, _chooseSplitIndex: function (t, i, n) { var e, r, a, o, s, l, u, c; for (l = u = 1 / 0, e = i; e <= n - i; e++)
                    r = h(t, 0, e, this.toBBox), a = h(t, e, n, this.toBBox), o = m(r, a), s = f(r) + f(a), o < l ? (l = o, c = e, u = s < u ? s : u) : o === l && s < u && (u = s, c = e); return c; }, _chooseSplitAxis: function (t, i, n) { var e = t.leaf ? this.compareMinX : s, r = t.leaf ? this.compareMinY : l, a = this._allDistMargin(t, i, n, e), h = this._allDistMargin(t, i, n, r); a < h && t.children.sort(e); }, _allDistMargin: function (t, i, n, e) { t.children.sort(e); var r, a, s = this.toBBox, l = h(t, 0, i, s), f = h(t, n - i, n, s), c = u(l) + u(f); for (r = i; r < n - i; r++)
                    a = t.children[r], o(l, t.leaf ? s(a) : a), c += u(l); for (r = n - i - 1; r >= i; r--)
                    a = t.children[r], o(f, t.leaf ? s(a) : a), c += u(f); return c; }, _adjustParentBBoxes: function (t, i, n) { for (var e = n; e >= 0; e--)
                    o(i[e], t); }, _condense: function (t) { for (var i, n = t.length - 1; n >= 0; n--)
                    0 === t[n].children.length ? n > 0 ? (i = t[n - 1].children, i.splice(i.indexOf(t[n]), 1)) : this.clear() : a(t[n], this.toBBox); }, _initFormat: function (t) { var i = ["return a", " - b", ";"]; this.compareMinX = new Function("a", "b", i.join(t[0])), this.compareMinY = new Function("a", "b", i.join(t[1])), this.toBBox = new Function("a", "return {minX: a" + t[0] + ", minY: a" + t[1] + ", maxX: a" + t[2] + ", maxY: a" + t[3] + "};"); } };
        }, { quickselect: 2 }], 2: [function (t, i, n) {
            "use strict";
            function e(t, i, n, a, h) { for (; a > n;) {
                if (a - n > 600) {
                    var o = a - n + 1, s = i - n + 1, l = Math.log(o), f = .5 * Math.exp(2 * l / 3), u = .5 * Math.sqrt(l * f * (o - f) / o) * (s - o / 2 < 0 ? -1 : 1), c = Math.max(n, Math.floor(i - s * f / o + u)), m = Math.min(a, Math.floor(i + (o - s) * f / o + u));
                    e(t, i, c, m, h);
                }
                var d = t[i], x = n, p = a;
                for (r(t, n, i), h(t[a], d) > 0 && r(t, n, a); x < p;) {
                    for (r(t, x, p), x++, p--; h(t[x], d) < 0;)
                        x++;
                    for (; h(t[p], d) > 0;)
                        p--;
                }
                0 === h(t[n], d) ? r(t, n, p) : (p++, r(t, p, a)), p <= i && (n = p + 1), i <= p && (a = p - 1);
            } }
            function r(t, i, n) { var e = t[i]; t[i] = t[n], t[n] = e; }
            i.exports = e;
        }, {}] }, {}, [1])(1); });
