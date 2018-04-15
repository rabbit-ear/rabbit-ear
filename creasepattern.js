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
var GraphClean = (function () {
    function GraphClean(numNodes, numEdges) {
        this.nodes = { total: 0, isolated: 0 };
        this.edges = { total: 0, duplicate: 0, circular: 0 };
        if (numNodes !== undefined) {
            this.nodes.total = numNodes;
        }
        if (numEdges !== undefined) {
            this.edges.total = numEdges;
        }
    }
    GraphClean.prototype.join = function (report) {
        this.nodes.total += report.nodes.total;
        this.edges.total += report.edges.total;
        this.nodes.isolated += report.nodes.isolated;
        this.edges.duplicate += report.edges.duplicate;
        this.edges.circular += report.edges.circular;
        return this;
    };
    GraphClean.prototype.isolatedNodes = function (num) { this.nodes.isolated = num; this.nodes.total += num; return this; };
    GraphClean.prototype.duplicateEdges = function (num) { this.edges.duplicate = num; this.edges.total += num; return this; };
    GraphClean.prototype.circularEdges = function (num) { this.edges.circular = num; this.edges.total += num; return this; };
    return GraphClean;
}());
var GraphNode = (function () {
    function GraphNode(graph) {
        this.graph = graph;
    }
    GraphNode.prototype.adjacentEdges = function () {
        return this.graph.edges.filter(function (el) {
            return el.nodes[0] === this || el.nodes[1] === this;
        }, this);
    };
    GraphNode.prototype.adjacentNodes = function () {
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
    };
    GraphNode.prototype.isAdjacentToNode = function (node) {
        return (this.graph.getEdgeConnectingNodes(this, node) !== undefined);
    };
    GraphNode.prototype.degree = function () {
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
    };
    return GraphNode;
}());
var GraphEdge = (function () {
    function GraphEdge(graph, node1, node2) {
        this.graph = graph;
        this.nodes = [node1, node2];
    }
    GraphEdge.prototype.adjacentEdges = function () {
        return this.graph.edges
            .filter(function (el) {
            return el !== this &&
                (el.nodes[0] === this.nodes[0] ||
                    el.nodes[0] === this.nodes[1] ||
                    el.nodes[1] === this.nodes[0] ||
                    el.nodes[1] === this.nodes[1]);
        }, this);
    };
    GraphEdge.prototype.adjacentNodes = function () {
        return [this.nodes[0], this.nodes[1]];
    };
    GraphEdge.prototype.isAdjacentToEdge = function (edge) {
        return ((this.nodes[0] === edge.nodes[0]) || (this.nodes[1] === edge.nodes[1]) ||
            (this.nodes[0] === edge.nodes[1]) || (this.nodes[1] === edge.nodes[0]));
    };
    GraphEdge.prototype.isSimilarToEdge = function (edge) {
        return ((this.nodes[0] === edge.nodes[0] && this.nodes[1] === edge.nodes[1]) ||
            (this.nodes[0] === edge.nodes[1] && this.nodes[1] === edge.nodes[0]));
    };
    GraphEdge.prototype.otherNode = function (node) {
        if (this.nodes[0] === node) {
            return this.nodes[1];
        }
        if (this.nodes[1] === node) {
            return this.nodes[0];
        }
        return undefined;
    };
    GraphEdge.prototype.isCircular = function () { return this.nodes[0] === this.nodes[1]; };
    GraphEdge.prototype.duplicateEdges = function () {
        return this.graph.edges.filter(function (el) {
            return this.isSimilarToEdge(el);
        }, this);
    };
    GraphEdge.prototype.commonNodeWithEdge = function (otherEdge) {
        if (this === otherEdge)
            return undefined;
        if (this.nodes[0] === otherEdge.nodes[0] || this.nodes[0] === otherEdge.nodes[1])
            return this.nodes[0];
        if (this.nodes[1] === otherEdge.nodes[0] || this.nodes[1] === otherEdge.nodes[1])
            return this.nodes[1];
        return undefined;
    };
    GraphEdge.prototype.uncommonNodeWithEdge = function (otherEdge) {
        if (this === otherEdge)
            return undefined;
        if (this.nodes[0] === otherEdge.nodes[0] || this.nodes[0] === otherEdge.nodes[1])
            return this.nodes[1];
        if (this.nodes[1] === otherEdge.nodes[0] || this.nodes[1] === otherEdge.nodes[1])
            return this.nodes[0];
        return undefined;
    };
    return GraphEdge;
}());
var Graph = (function () {
    function Graph() {
        this.nodeType = GraphNode;
        this.edgeType = GraphEdge;
        this.clear();
    }
    Graph.prototype.copy = function () {
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
    };
    Graph.prototype.newNode = function () {
        return this.addNode(new this.nodeType(this));
    };
    Graph.prototype.newEdge = function (node1, node2) {
        return this.addEdge(new this.edgeType(this, node1, node2));
    };
    Graph.prototype.addNode = function (node) {
        if (node == undefined) {
            throw "addNode() requires an argument: 1 GraphNode";
        }
        node.graph = this;
        node.index = this.nodes.length;
        this.nodes.push(node);
        return node;
    };
    Graph.prototype.addEdge = function (edge) {
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
    };
    Graph.prototype.addNodes = function (nodes) {
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
    };
    Graph.prototype.addEdges = function (edges) {
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
    };
    Graph.prototype.copyNode = function (node) {
        var nodeClone = Object.assign(this.newNode(), node);
        return this.addNode(nodeClone);
    };
    Graph.prototype.copyEdge = function (edge) {
        var edgeClone = Object.assign(this.newEdge(edge.nodes[0], edge.nodes[1]), edge);
        return this.addEdge(edgeClone);
    };
    Graph.prototype.clear = function () {
        this.nodes = [];
        this.edges = [];
        return this;
    };
    Graph.prototype.removeEdge = function (edge) {
        var edgesLength = this.edges.length;
        this.edges = this.edges.filter(function (el) { return el !== edge; });
        this.edgeArrayDidChange();
        return new GraphClean(undefined, edgesLength - this.edges.length);
    };
    Graph.prototype.removeEdgeBetween = function (node1, node2) {
        var edgesLength = this.edges.length;
        this.edges = this.edges.filter(function (el) {
            return !((el.nodes[0] === node1 && el.nodes[1] === node2) ||
                (el.nodes[0] === node2 && el.nodes[1] === node1));
        });
        this.edgeArrayDidChange();
        return new GraphClean(undefined, edgesLength - this.edges.length);
    };
    Graph.prototype.removeNode = function (node) {
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
    };
    Graph.prototype.mergeNodes = function (node1, node2) {
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
    };
    Graph.prototype.removeIsolatedNodes = function () {
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
    };
    Graph.prototype.cleanCircularEdges = function () {
        var edgesLength = this.edges.length;
        this.edges = this.edges.filter(function (el) { return !(el.nodes[0] === el.nodes[1]); });
        if (this.edges.length != edgesLength) {
            this.edgeArrayDidChange();
        }
        return new GraphClean().circularEdges(edgesLength - this.edges.length);
    };
    Graph.prototype.cleanDuplicateEdges = function () {
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
    };
    Graph.prototype.cleanGraph = function () {
        this.edgeArrayDidChange();
        this.nodeArrayDidChange();
        return this.cleanDuplicateEdges().join(this.cleanCircularEdges());
    };
    Graph.prototype.clean = function () {
        return this.cleanGraph();
    };
    Graph.prototype.getEdgeConnectingNodes = function (node1, node2) {
        for (var i = 0; i < this.edges.length; i++) {
            if ((this.edges[i].nodes[0] === node1 && this.edges[i].nodes[1] === node2) ||
                (this.edges[i].nodes[0] === node2 && this.edges[i].nodes[1] === node1)) {
                return this.edges[i];
            }
        }
        return undefined;
    };
    Graph.prototype.getEdgesConnectingNodes = function (node1, node2) {
        return this.edges.filter(function (el) {
            return (el.nodes[0] === node1 && el.nodes[1] === node2) ||
                (el.nodes[0] === node2 && el.nodes[1] === node1);
        });
    };
    Graph.prototype.nodeArrayDidChange = function () { for (var i = 0; i < this.nodes.length; i++) {
        this.nodes[i].index = i;
    } };
    Graph.prototype.edgeArrayDidChange = function () { for (var i = 0; i < this.edges.length; i++) {
        this.edges[i].index = i;
    } };
    return Graph;
}());
var Multigraph = (function (_super) {
    __extends(Multigraph, _super);
    function Multigraph() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Multigraph.prototype.cleanGraph = function () {
        this.edgeArrayDidChange();
        this.nodeArrayDidChange();
        return new GraphClean();
    };
    return Multigraph;
}(Graph));
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
    return intersect_vec_func(new XY(a.nodes[0].x, a.nodes[0].y), new XY(a.nodes[1].x - a.nodes[0].x, a.nodes[1].y - a.nodes[0].y), new XY(b.nodes[0].x, b.nodes[0].y), new XY(b.nodes[1].x - b.nodes[0].x, b.nodes[1].y - b.nodes[0].y), function (t0, t1) { return true; }, epsilon);
}
function intersectionLineRay(line, ray, epsilon) {
    if (epsilon === undefined) {
        epsilon = EPSILON_HIGH;
    }
    return intersect_vec_func(new XY(line.nodes[0].x, line.nodes[0].y), new XY(line.nodes[1].x - line.nodes[0].x, line.nodes[1].y - line.nodes[0].y), new XY(ray.origin.x, ray.origin.y), new XY(ray.direction.x, ray.direction.y), function (t0, t1) { return t1 >= 0; }, epsilon);
}
function intersectionLineEdge(line, edge, epsilon) {
    if (epsilon === undefined) {
        epsilon = EPSILON_HIGH;
    }
    return intersect_vec_func(new XY(line.nodes[0].x, line.nodes[0].y), new XY(line.nodes[1].x - line.nodes[0].x, line.nodes[1].y - line.nodes[0].y), new XY(edge.nodes[0].x, edge.nodes[0].y), new XY(edge.nodes[1].x - edge.nodes[0].x, edge.nodes[1].y - edge.nodes[0].y), function (t0, t1) { return t1 >= 0 && t1 <= 1; }, epsilon);
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
var Matrix = (function () {
    function Matrix(a, b, c, d, tx, ty) {
        this.a = (a !== undefined) ? a : 1;
        this.b = (b !== undefined) ? b : 0;
        this.c = (c !== undefined) ? c : 0;
        this.d = (d !== undefined) ? d : 1;
        this.tx = (tx !== undefined) ? tx : 0;
        this.ty = (ty !== undefined) ? ty : 0;
    }
    Matrix.prototype.identity = function () { this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.tx = 0; this.ty = 0; };
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
var XY = (function () {
    function XY(x, y) {
        this.x = x;
        this.y = y;
    }
    XY.prototype.normalize = function () { var m = this.magnitude(); return new XY(this.x / m, this.y / m); };
    XY.prototype.rotate90 = function () { return new XY(-this.y, this.x); };
    XY.prototype.rotate270 = function () { return new XY(this.y, -this.x); };
    XY.prototype.rotate = function (angle, origin) {
        return this.transform(new Matrix().rotation(angle, origin));
    };
    XY.prototype.dot = function (point) { return this.x * point.x + this.y * point.y; };
    XY.prototype.cross = function (vector) { return this.x * vector.y - this.y * vector.x; };
    XY.prototype.magnitude = function () { return Math.sqrt(this.x * this.x + this.y * this.y); };
    XY.prototype.distanceTo = function (a) { return Math.sqrt(Math.pow(this.x - a.x, 2) + Math.pow(this.y - a.y, 2)); };
    XY.prototype.equivalent = function (point, epsilon) {
        if (epsilon == undefined) {
            epsilon = EPSILON_HIGH;
        }
        return (epsilonEqual(this.x, point.x, epsilon) && epsilonEqual(this.y, point.y, epsilon));
    };
    XY.prototype.transform = function (matrix) {
        return new XY(this.x * matrix.a + this.y * matrix.c + matrix.tx, this.x * matrix.b + this.y * matrix.d + matrix.ty);
    };
    XY.prototype.lerp = function (point, pct) {
        var inv = 1.0 - pct;
        return new XY(this.x * pct + point.x * inv, this.y * pct + point.y * inv);
    };
    XY.prototype.reflect = function (a, b) { return this.transform(new Matrix().reflection(a, b)); };
    XY.prototype.scale = function (magnitude) { return new XY(this.x * magnitude, this.y * magnitude); };
    XY.prototype.add = function (point) { return new XY(this.x + point.x, this.y + point.y); };
    XY.prototype.subtract = function (sub) { return new XY(this.x - sub.x, this.y - sub.y); };
    XY.prototype.multiply = function (m) { return new XY(this.x * m.x, this.y * m.y); };
    XY.prototype.midpoint = function (other) { return new XY((this.x + other.x) * 0.5, (this.y + other.y) * 0.5); };
    XY.prototype.abs = function () { return new XY(Math.abs(this.x), Math.abs(this.y)); };
    return XY;
}());
var Line = (function () {
    function Line(a, b, c, d) {
        if (a instanceof XY) {
            this.nodes = [a, b];
        }
        else if (a.x !== undefined) {
            this.nodes = [new XY(a.x, a.y), new XY(b.x, b.y)];
        }
        else {
            this.nodes = [new XY(a, b), new XY(c, d)];
        }
    }
    Line.prototype.length = function () { return Infinity; };
    Line.prototype.vector = function (originNode) {
        if (originNode === undefined) {
            return this.nodes[1].subtract(this.nodes[0]);
        }
        if (this.nodes[0].equivalent(originNode)) {
            return this.nodes[1].subtract(this.nodes[0]);
        }
        return this.nodes[0].subtract(this.nodes[1]);
    };
    Line.prototype.intersectLine = function (line) { return intersectionLineLine(this, line); };
    Line.prototype.intersectRay = function (ray) { return intersectionLineRay(this, ray); };
    Line.prototype.intersectEdge = function (edge) { return intersectionLineEdge(this, edge); };
    Line.prototype.reflectionMatrix = function () { return new Matrix().reflection(this.nodes[0], this.nodes[1]); };
    Line.prototype.parallel = function (line, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        var u = this.nodes[1].subtract(this.nodes[0]);
        var v = line.nodes[1].subtract(line.nodes[0]);
        return epsilonEqual(u.cross(v), 0, epsilon);
    };
    Line.prototype.collinear = function (point, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        if (point.equivalent(this.nodes[0], epsilon)) {
            return true;
        }
        var u = this.nodes[1].subtract(this.nodes[0]);
        var v = point.subtract(this.nodes[0]);
        return epsilonEqual(u.cross(v), 0, epsilon);
    };
    Line.prototype.equivalent = function (line, epsilon) {
        return undefined;
    };
    Line.prototype.transform = function (matrix) {
        return new Line(this.nodes[0].transform(matrix), this.nodes[1].transform(matrix));
    };
    Line.prototype.nearestPointNormalTo = function (point) {
        var p = this.nodes[0].distanceTo(this.nodes[1]);
        var u = ((point.x - this.nodes[0].x) * (this.nodes[1].x - this.nodes[0].x) + (point.y - this.nodes[0].y) * (this.nodes[1].y - this.nodes[0].y)) / (Math.pow(p, 2));
        return new XY(this.nodes[0].x + u * (this.nodes[1].x - this.nodes[0].x), this.nodes[0].y + u * (this.nodes[1].y - this.nodes[0].y));
    };
    return Line;
}());
var Polyline = (function () {
    function Polyline() {
        this.nodes = [];
    }
    Polyline.prototype.edges = function () {
        var result = [];
        for (var i = 0; i < this.nodes.length - 1; i++) {
            result.push(new Edge(this.nodes[i], this.nodes[i + 1]));
        }
        return result;
    };
    Polyline.prototype.rayReflectRepeat = function (ray, intersectable, target) {
        var REFLECT_LIMIT = 100;
        var clips = [];
        var firstClips = ray.clipWithEdgesWithIntersections(intersectable);
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
            var reflection = new Matrix().reflection(prevClip.intersection.nodes[0], prevClip.intersection.nodes[1]);
            var newRay = new Ray(prevClip.edge.nodes[1], prevClip.edge.nodes[0].transform(reflection).subtract(prevClip.edge.nodes[1]));
            var newClips = newRay.clipWithEdgesWithIntersections(intersectable);
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
    };
    return Polyline;
}());
var Ray = (function () {
    function Ray(a, b, c, d) {
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
    Ray.prototype.length = function () { return Infinity; };
    Ray.prototype.vector = function () { return this.direction; };
    Ray.prototype.intersectLine = function (line) { return intersectionLineRay(line, this); };
    Ray.prototype.intersectRay = function (ray) { return intersectionRayRay(this, ray); };
    Ray.prototype.intersectEdge = function (edge) { return intersectionRayEdge(this, edge); };
    Ray.prototype.reflectionMatrix = function () { return new Matrix().reflection(this.origin, this.origin.add(this.direction)); };
    Ray.prototype.parallel = function (line, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        var v = line.nodes[1].subtract(line.nodes[0]);
        return epsilonEqual(this.direction.cross(v), 0, epsilon);
    };
    Ray.prototype.collinear = function (point) { return undefined; };
    Ray.prototype.equivalent = function (ray, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        return (this.origin.equivalent(ray.origin, epsilon) &&
            this.direction.normalize().equivalent(ray.direction.normalize(), epsilon));
    };
    Ray.prototype.flip = function () {
        return new Ray(this.origin, new XY(-this.direction.x, -this.direction.y));
    };
    Ray.prototype.clipWithEdge = function (edge, epsilon) {
        var intersect = intersectionRayEdge(this, edge, epsilon);
        if (intersect === undefined) {
            return undefined;
        }
        return new Edge(this.origin, intersect);
    };
    Ray.prototype.clipWithEdges = function (edges, epsilon) {
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
    };
    Ray.prototype.clipWithEdgesWithIntersections = function (edges, epsilon) {
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
    };
    return Ray;
}());
var Edge = (function () {
    function Edge(a, b, c, d) {
        if (a instanceof XY) {
            this.nodes = [a, b];
        }
        else if (a.x !== undefined) {
            this.nodes = [new XY(a.x, a.y), new XY(b.x, b.y)];
        }
        else {
            this.nodes = [new XY(a, b), new XY(c, d)];
        }
    }
    Edge.prototype.length = function () { return Math.sqrt(Math.pow(this.nodes[0].x - this.nodes[1].x, 2) + Math.pow(this.nodes[0].y - this.nodes[1].y, 2)); };
    Edge.prototype.vector = function (originNode) {
        if (originNode === undefined) {
            return this.nodes[1].subtract(this.nodes[0]);
        }
        if (this.nodes[0].equivalent(originNode)) {
            return this.nodes[1].subtract(this.nodes[0]);
        }
        return this.nodes[0].subtract(this.nodes[1]);
    };
    Edge.prototype.midpoint = function () {
        return new XY(0.5 * (this.nodes[0].x + this.nodes[1].x), 0.5 * (this.nodes[0].y + this.nodes[1].y));
    };
    Edge.prototype.intersectLine = function (line) { return intersectionLineEdge(line, this); };
    Edge.prototype.intersectRay = function (ray) { return intersectionRayEdge(ray, this); };
    Edge.prototype.intersectEdge = function (edge) { return intersectionEdgeEdge(this, edge); };
    Edge.prototype.reflectionMatrix = function () { return new Matrix().reflection(this.nodes[0], this.nodes[1]); };
    Edge.prototype.parallel = function (line, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        var u = this.nodes[1].subtract(this.nodes[0]);
        var v = line.nodes[1].subtract(line.nodes[0]);
        return epsilonEqual(u.cross(v), 0, epsilon);
    };
    Edge.prototype.collinear = function (point, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        var p0 = new Edge(point, this.nodes[0]).length();
        var p1 = new Edge(point, this.nodes[1]).length();
        return epsilonEqual(this.length() - p0 - p1, 0, epsilon);
    };
    Edge.prototype.equivalent = function (e, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        return ((this.nodes[0].equivalent(e.nodes[0], epsilon) &&
            this.nodes[1].equivalent(e.nodes[1], epsilon)) ||
            (this.nodes[0].equivalent(e.nodes[1], epsilon) &&
                this.nodes[1].equivalent(e.nodes[0], epsilon)));
    };
    Edge.prototype.degenrate = function (epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        return this.nodes[0].equivalent(this.nodes[1], epsilon);
    };
    Edge.prototype.transform = function (matrix) {
        return new Edge(this.nodes[0].transform(matrix), this.nodes[1].transform(matrix));
    };
    Edge.prototype.nearestPoint = function (point) {
        var answer = this.nearestPointNormalTo(point);
        if (answer !== undefined) {
            return answer;
        }
        return this.nodes
            .map(function (el) { return { point: el, distance: el.distanceTo(point) }; }, this)
            .sort(function (a, b) { return a.distance - b.distance; })
            .shift()
            .point;
    };
    Edge.prototype.nearestPointNormalTo = function (point) {
        var p = this.nodes[0].distanceTo(this.nodes[1]);
        var u = ((point.x - this.nodes[0].x) * (this.nodes[1].x - this.nodes[0].x) + (point.y - this.nodes[0].y) * (this.nodes[1].y - this.nodes[0].y)) / (Math.pow(p, 2));
        if (u < 0 || u > 1.0) {
            return undefined;
        }
        return new XY(this.nodes[0].x + u * (this.nodes[1].x - this.nodes[0].x), this.nodes[0].y + u * (this.nodes[1].y - this.nodes[0].y));
    };
    return Edge;
}());
var Rect = (function () {
    function Rect(x, y, width, height) {
        this.topLeft = { 'x': x, 'y': y };
        this.size = { 'width': width, 'height': height };
    }
    return Rect;
}());
var Triangle = (function () {
    function Triangle(points, circumcenter) {
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
    Triangle.prototype.angles = function () {
        return this.points.map(function (p, i) {
            var prevP = this.points[(i + this.points.length - 1) % this.points.length];
            var nextP = this.points[(i + 1) % this.points.length];
            return clockwiseInteriorAngle(nextP.subtract(p), prevP.subtract(p));
        }, this);
    };
    Triangle.prototype.isAcute = function () {
        var a = this.angles();
        for (var i = 0; i < a.length; i++) {
            if (a[i] > Math.PI * 0.5) {
                return false;
            }
        }
        return true;
    };
    Triangle.prototype.isObtuse = function () {
        var a = this.angles();
        for (var i = 0; i < a.length; i++) {
            if (a[i] > Math.PI * 0.5) {
                return true;
            }
        }
        return false;
    };
    Triangle.prototype.isRight = function () {
        var a = this.angles();
        for (var i = 0; i < a.length; i++) {
            if (epsilonEqual(a[i], Math.PI * 0.5)) {
                return true;
            }
        }
        return false;
    };
    Triangle.prototype.pointInside = function (p) {
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
    };
    return Triangle;
}());
var IsoscelesTriangle = (function (_super) {
    __extends(IsoscelesTriangle, _super);
    function IsoscelesTriangle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return IsoscelesTriangle;
}(Triangle));
var ConvexPolygon = (function () {
    function ConvexPolygon() {
    }
    ConvexPolygon.prototype.center = function () {
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
    };
    ConvexPolygon.prototype.contains = function (p) {
        var found = true;
        for (var i = 0; i < this.edges.length; i++) {
            var a = this.edges[i].nodes[1].subtract(this.edges[i].nodes[0]);
            var b = new XY(p.x - this.edges[i].nodes[0].x, p.y - this.edges[i].nodes[0].y);
            if (a.cross(b) < 0) {
                return false;
            }
        }
        return true;
    };
    ConvexPolygon.prototype.clipEdge = function (edge) {
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
    };
    ConvexPolygon.prototype.clipLine = function (line) {
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
    };
    ConvexPolygon.prototype.clipRay = function (ray) {
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
    };
    ConvexPolygon.prototype.setEdgesFromPoints = function (points) {
        return points.map(function (el, i) {
            var nextEl = points[(i + 1) % points.length];
            return new Edge(el, nextEl);
        }, this);
    };
    ConvexPolygon.prototype.convexHull = function (points) {
        if (points === undefined || points.length === 0) {
            this.edges = [];
            return undefined;
        }
        var INFINITE_LOOP = 10000;
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
            if (hull.contains(angles[0].node)) {
                this.edges = this.setEdgesFromPoints(hull);
                return this;
            }
            hull.push(angles[0].node);
            ang = Math.atan2(hull[h].y - angles[0].node.y, hull[h].x - angles[0].node.x);
        } while (infiniteLoop < INFINITE_LOOP);
        this.edges = [];
        return undefined;
    };
    ConvexPolygon.prototype.minimumRect = function () {
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
    };
    ConvexPolygon.prototype.copy = function () {
        var p = new ConvexPolygon();
        p.edges = this.edges.map(function (e) {
            return new Edge(e.nodes[0].x, e.nodes[0].y, e.nodes[1].x, e.nodes[1].y);
        });
        return p;
    };
    return ConvexPolygon;
}());
var Sector = (function () {
    function Sector(origin, endpoints) {
        this.origin = origin;
        this.endPoints = endpoints;
    }
    Sector.prototype.vectors = function () {
        return [this.endPoints[0].subtract(this.origin), this.endPoints[1].subtract(this.origin)];
    };
    Sector.prototype.angle = function () {
        return clockwiseInteriorAngle(this.endPoints[0].subtract(this.origin), this.endPoints[1].subtract(this.origin));
    };
    Sector.prototype.bisect = function () {
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
    };
    Sector.prototype.subsectAngle = function (divisions) {
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
    };
    Sector.prototype.getEdgeVectorsForNewAngle = function (angle, lockedEdge) {
        var vectors = this.vectors();
        var angleChange = angle - clockwiseInteriorAngle(vectors[0], vectors[1]);
        var rotateNodes = [-angleChange * 0.5, angleChange * 0.5];
        return vectors.map(function (el, i) { return el.rotate(rotateNodes[i]); }, this);
    };
    Sector.prototype.equivalent = function (a) {
        return a.origin.equivalent(this.origin) &&
            a.endPoints[0].equivalent(this.endPoints[0]) &&
            a.endPoints[1].equivalent(this.endPoints[1]);
    };
    Sector.prototype.sortByClockwise = function () { };
    return Sector;
}());
var VoronoiMolecule = (function (_super) {
    __extends(VoronoiMolecule, _super);
    function VoronoiMolecule(points, circumcenter, edgeNormal) {
        var _this = _super.call(this, points, circumcenter) || this;
        _this.isEdge = false;
        _this.isCorner = false;
        _this.overlaped = [];
        _this.hull = new ConvexPolygon().convexHull([points[0], points[1], points[2], circumcenter].filter(function (el) { return el !== undefined; }));
        _this.units = _this.points.map(function (el, i) {
            var nextEl = this.points[(i + 1) % this.points.length];
            return new VoronoiMoleculeTriangle(circumcenter, [el, nextEl]);
        }, _this);
        switch (_this.points.length) {
            case 1:
                _this.isCorner = true;
                _this.addCornerMolecules();
                break;
            case 2:
                _this.isEdge = true;
                _this.units = _this.units.filter(function (el) {
                    var cross = (el.vertex.y - el.base[0].y) * (el.base[1].x - el.base[0].x) -
                        (el.vertex.x - el.base[0].x) * (el.base[1].y - el.base[0].y);
                    if (cross < 0) {
                        return false;
                    }
                    return true;
                }, _this);
                _this.addEdgeMolecules(edgeNormal);
                break;
        }
        var eclipsed = undefined;
        _this.units = _this.units.filter(function (el) {
            var cross = (el.vertex.y - el.base[0].y) * (el.base[1].x - el.base[0].x) -
                (el.vertex.x - el.base[0].x) * (el.base[1].y - el.base[0].y);
            if (cross < 0) {
                eclipsed = el;
                return false;
            }
            return true;
        }, _this);
        if (eclipsed !== undefined) {
            var angle = clockwiseInteriorAngle(eclipsed.vertex.subtract(eclipsed.base[1]), eclipsed.base[0].subtract(eclipsed.base[1]));
            _this.units.forEach(function (el) { el.crimpAngle -= angle; });
        }
        return _this;
    }
    VoronoiMolecule.prototype.addEdgeMolecules = function (normal) {
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
    };
    VoronoiMolecule.prototype.addCornerMolecules = function () { };
    VoronoiMolecule.prototype.generateCreases = function () {
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
    };
    return VoronoiMolecule;
}(Triangle));
var VoronoiMoleculeTriangle = (function () {
    function VoronoiMoleculeTriangle(vertex, base, crimpAngle) {
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
    VoronoiMoleculeTriangle.prototype.crimpLocations = function () {
        var baseAngle = Math.atan2(this.base[1].y - this.base[0].y, this.base[1].x - this.base[0].x);
        var crimpVector = new XY(Math.cos(baseAngle + this.crimpAngle), Math.sin(baseAngle + this.crimpAngle));
        var bisectVector = new XY(Math.cos(baseAngle + this.crimpAngle * 0.5), Math.sin(baseAngle + this.crimpAngle * 0.5));
        var symmetryLine = new Edge(this.vertex, this.base[0].midpoint(this.base[1]));
        var crimpPos = intersectionRayEdge(new Ray(this.base[0], crimpVector), symmetryLine);
        var bisectPos = intersectionRayEdge(new Ray(this.base[0], bisectVector), symmetryLine);
        return [crimpPos, bisectPos];
    };
    VoronoiMoleculeTriangle.prototype.generateCrimpCreaseLines = function () {
        var crimps = this.crimpLocations();
        var symmetryLine = new Edge(this.vertex, this.base[0].midpoint(this.base[1]));
        if (this.overlapped.length > 0) {
            symmetryLine.nodes[1] = this.overlapped[0].circumcenter;
        }
        var overlappingEdges = [symmetryLine]
            .concat(this.overlapped.flatMap(function (el) {
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
    };
    VoronoiMoleculeTriangle.prototype.pointInside = function (p) {
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
    };
    return VoronoiMoleculeTriangle;
}());
var VoronoiEdge = (function () {
    function VoronoiEdge() {
        this.cache = {};
    }
    return VoronoiEdge;
}());
var VoronoiCell = (function () {
    function VoronoiCell() {
        this.points = [];
        this.edges = [];
    }
    return VoronoiCell;
}());
var VoronoiJunction = (function () {
    function VoronoiJunction() {
        this.edges = [];
        this.cells = [];
        this.isEdge = false;
        this.isCorner = false;
    }
    return VoronoiJunction;
}());
var VoronoiGraph = (function () {
    function VoronoiGraph(v, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        var allPoints = v.edges.flatMap(function (e) { return [new XY(e[0][0], e[0][1]), new XY(e[1][0], e[1][1])]; });
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
            if (!nodes.contains(el.endPoints[0], compFunc)) {
                nodes.push(el.endPoints[0]);
            }
            if (!nodes.contains(el.endPoints[1], compFunc)) {
                nodes.push(el.endPoints[1]);
            }
        }, this);
        this.junctions = nodes.map(function (el) {
            var junction = new VoronoiJunction();
            junction.position = el;
            junction.cells = this.cells.filter(function (cell) {
                return cell.points.contains(el, compFunc);
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
                return edge.endPoints.contains(el, compFunc);
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
    VoronoiGraph.prototype.edgeExists = function (points, epsilon) {
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
    };
    VoronoiGraph.prototype.generateMolecules = function (interp) {
        return this.junctions.map(function (j) {
            var endPoints = j.cells.map(function (cell) {
                return cell.site.lerp(j.position, interp);
            }, this);
            var molecule = new VoronoiMolecule(endPoints, j.position, j.isEdge ? j.edgeNormal : undefined);
            return molecule;
        }, this);
    };
    VoronoiGraph.prototype.generateSortedMolecules = function (interp) {
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
    };
    return VoronoiGraph;
}());
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
    if (a instanceof Edge || a instanceof Crease) {
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
Array.prototype.flatMap = function (mapFunc) {
    return this.reduce(function (cumulus, next) { return mapFunc(next).concat(cumulus); }, []);
};
Array.prototype.removeDuplicates = function (compFunction) {
    if (this.length <= 1)
        return this;
    for (var i = 0; i < this.length - 1; i++) {
        for (var j = this.length - 1; j > i; j--) {
            if (compFunction(this[i], this[j])) {
                this.splice(j, 1);
            }
        }
    }
    return this;
};
Array.prototype.allEqual = function () {
    if (this.length <= 1) {
        return true;
    }
    for (var i = 1; i < this.length; i++) {
        if (this[i] !== this[0])
            return false;
    }
    return true;
};
Array.prototype.contains = function (object, compFunction) {
    if (compFunction !== undefined) {
        for (var i = 0; i < this.length; i++) {
            if (compFunction(this[i], object) === true) {
                return true;
            }
        }
        return false;
    }
    for (var i = 0; i < this.length; i++) {
        if (this[i] === object) {
            return true;
        }
    }
    return false;
};
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
var PlanarNode = (function (_super) {
    __extends(PlanarNode, _super);
    function PlanarNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.junctionType = PlanarJunction;
        _this.sectorType = PlanarSector;
        _this.cache = {};
        return _this;
    }
    PlanarNode.prototype.adjacentEdges = function () {
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
    };
    PlanarNode.prototype.adjacentFaces = function () {
        var junction = this.junction();
        if (junction === undefined) {
            return [];
        }
        return junction.faces();
    };
    PlanarNode.prototype.interiorAngles = function () { return this.junction().interiorAngles(); };
    PlanarNode.prototype.junction = function () {
        var junction = new this.junctionType(this);
        if (junction.edges.length === 0) {
            return undefined;
        }
        return junction;
    };
    PlanarNode.prototype.xy = function () { return new XY(this.x, this.y); };
    PlanarNode.prototype.position = function (x, y) { this.x = x; this.y = y; return this; };
    PlanarNode.prototype.translate = function (dx, dy) { this.x += dx; this.y += dy; return this; };
    PlanarNode.prototype.normalize = function () { var m = this.magnitude(); this.x /= m; this.y /= m; return this; };
    PlanarNode.prototype.rotate90 = function () { var x = this.x; this.x = -this.y; this.y = x; return this; };
    PlanarNode.prototype.rotate270 = function () { var x = this.x; this.x = this.y; this.y = -x; return this; };
    PlanarNode.prototype.rotate = function (angle, origin) {
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
    PlanarNode.prototype.distanceTo = function (a) { return Math.sqrt(Math.pow(this.x - a.x, 2) + Math.pow(this.y - a.y, 2)); };
    PlanarNode.prototype.equivalent = function (point, epsilon) {
        if (epsilon == undefined) {
            epsilon = EPSILON_HIGH;
        }
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
    PlanarNode.prototype.reflect = function (a, b) { return this.transform(new Matrix().reflection(a, b)); };
    PlanarNode.prototype.scale = function (magnitude) { this.x *= magnitude; this.y *= magnitude; return this; };
    PlanarNode.prototype.add = function (point) { this.x += point.x; this.y += point.y; return this; };
    PlanarNode.prototype.subtract = function (sub) { this.x -= sub.x; this.y -= sub.y; return this; };
    PlanarNode.prototype.multiply = function (m) { this.x *= m.x; this.y *= m.y; return this; };
    PlanarNode.prototype.midpoint = function (other) { return new XY((this.x + other.x) * 0.5, (this.y + other.y) * 0.5); };
    PlanarNode.prototype.abs = function () { this.x = Math.abs(this.x), this.y = Math.abs(this.y); return this; };
    return PlanarNode;
}(GraphNode));
var PlanarEdge = (function (_super) {
    __extends(PlanarEdge, _super);
    function PlanarEdge() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlanarEdge.prototype.vector = function (originNode) {
        var otherNode = this.otherNode(originNode);
        return new XY(otherNode.x, otherNode.y).subtract(originNode);
    };
    PlanarEdge.prototype.intersection = function (edge, epsilon) {
        if (this.isAdjacentToEdge(edge)) {
            return undefined;
        }
        var intersect = intersectionEdgeEdge(this, edge, epsilon);
        if (intersect !== undefined &&
            !(intersect.equivalent(this.nodes[0], epsilon) || intersect.equivalent(this.nodes[1], epsilon))) {
            return { 'edge': edge, 'point': intersect };
        }
        return undefined;
    };
    PlanarEdge.prototype.crossingEdges = function () {
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
    };
    PlanarEdge.prototype.absoluteAngle = function (startNode) {
        if (startNode === undefined) {
            startNode = this.nodes[1];
        }
        var endNode = this.otherNode(startNode);
        return Math.atan2(endNode.y - startNode.y, endNode.x - startNode.x);
    };
    PlanarEdge.prototype.adjacentFaces = function () {
        return [
            new this.graph.faceType(this.graph).makeFromCircuit(this.graph.walkClockwiseCircut(this.nodes[0], this.nodes[1])),
            new this.graph.faceType(this.graph).makeFromCircuit(this.graph.walkClockwiseCircut(this.nodes[1], this.nodes[0]))
        ]
            .filter(function (el) { return el !== undefined; });
    };
    PlanarEdge.prototype.length = function () { return this.nodes[0].distanceTo(this.nodes[1]); };
    PlanarEdge.prototype.midpoint = function () {
        return new XY(0.5 * (this.nodes[0].x + this.nodes[1].x), 0.5 * (this.nodes[0].y + this.nodes[1].y));
    };
    PlanarEdge.prototype.intersectLine = function (line) { return intersectionLineEdge(line, this); };
    PlanarEdge.prototype.intersectRay = function (ray) { return intersectionRayEdge(ray, this); };
    PlanarEdge.prototype.intersectEdge = function (edge) { return intersectionEdgeEdge(this, edge); };
    PlanarEdge.prototype.reflectionMatrix = function () { return new Matrix().reflection(this.nodes[0], this.nodes[1]); };
    PlanarEdge.prototype.parallel = function (edge, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        var u = this.nodes[1].subtract(this.nodes[0]);
        var v = edge.nodes[1].subtract(edge.nodes[0]);
        return epsilonEqual(u.cross(v), 0, epsilon);
    };
    PlanarEdge.prototype.collinear = function (point, epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        var p0 = new Edge(point, this.nodes[0]).length();
        var p1 = new Edge(point, this.nodes[1]).length();
        return epsilonEqual(this.length() - p0 - p1, 0, epsilon);
    };
    PlanarEdge.prototype.equivalent = function (e) { return this.isSimilarToEdge(e); };
    PlanarEdge.prototype.degenrate = function (epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_HIGH;
        }
        return this.nodes[0].equivalent(this.nodes[1], epsilon);
    };
    PlanarEdge.prototype.transform = function (matrix) {
        this.nodes[0].transform(matrix);
        this.nodes[1].transform(matrix);
        return this;
    };
    PlanarEdge.prototype.nearestPoint = function (point) {
        var answer = this.nearestPointNormalTo(point);
        if (answer !== undefined) {
            return answer;
        }
        return this.nodes
            .map(function (el) { return { point: el, distance: el.distanceTo(point) }; }, this)
            .sort(function (a, b) { return a.distance - b.distance; })
            .shift()
            .point;
    };
    PlanarEdge.prototype.nearestPointNormalTo = function (point) {
        var p = this.nodes[0].distanceTo(this.nodes[1]);
        var u = ((point.x - this.nodes[0].x) * (this.nodes[1].x - this.nodes[0].x) + (point.y - this.nodes[0].y) * (this.nodes[1].y - this.nodes[0].y)) / (Math.pow(p, 2));
        if (u < 0 || u > 1.0) {
            return undefined;
        }
        return new XY(this.nodes[0].x + u * (this.nodes[1].x - this.nodes[0].x), this.nodes[0].y + u * (this.nodes[1].y - this.nodes[0].y));
    };
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
        if (this.nodes.length > 2 && epsilonEqual(angleSum / (this.nodes.length - 2), Math.PI, EPSILON)) {
            return this;
        }
        return undefined;
    };
    PlanarFace.prototype.makeFromNodes = function (nodes) {
        var edgeCircut = nodes.map(function (node, i) {
            var nextNode = this.nodes[(i + 1) % this.nodes.length];
            return this.graph.getEdgeConnectingNodes(node, nextNode);
        }, this);
        return this.makeFromCircuit(edgeCircut);
    };
    PlanarFace.prototype.equivalent = function (face) {
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
        for (var i = 0; i < this.edges.length; i++) {
            for (var j = 0; j < face.edges.length; j++) {
                if (this.edges[i] === face.edges[j]) {
                    return this.edges[i];
                }
            }
        }
    };
    PlanarFace.prototype.commonEdges = function (face) {
        var edges = [];
        for (var i = 0; i < this.edges.length; i++) {
            for (var j = 0; j < face.edges.length; j++) {
                if (this.edges[i] === face.edges[j]) {
                    edges.push(this.edges[i]);
                }
            }
        }
        return edges.removeDuplicates(function (a, b) { return a === b; });
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
            if (cross < 0) {
                return false;
            }
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
var PlanarSector = (function (_super) {
    __extends(PlanarSector, _super);
    function PlanarSector(edge1, edge2) {
        var _this = _super.call(this, edge1.commonNodeWithEdge(edge2), undefined) || this;
        if (_this.origin === undefined) {
            return _this;
        }
        if (edge1 === edge2) {
            return _this;
        }
        _this.edges = [edge1, edge2];
        _this.endPoints = [
            (edge1.nodes[0] === _this.origin) ? edge1.nodes[1] : edge1.nodes[0],
            (edge2.nodes[0] === _this.origin) ? edge2.nodes[1] : edge2.nodes[0]
        ];
        return _this;
    }
    PlanarSector.prototype.makeWithEdges = function (edge1, edge2) {
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
    };
    PlanarSector.prototype.vectors = function () {
        return this.edges.map(function (el) { return el.vector(this.origin); }, this);
    };
    PlanarSector.prototype.angle = function () {
        var vectors = this.vectors();
        return clockwiseInteriorAngle(vectors[0], vectors[1]);
    };
    PlanarSector.prototype.bisect = function () {
        var absolute1 = this.edges[0].absoluteAngle(this.origin);
        var absolute2 = this.edges[1].absoluteAngle(this.origin);
        while (absolute1 < 0) {
            absolute1 += Math.PI * 2;
        }
        var interior = clockwiseInteriorAngleRadians(absolute1, absolute2);
        var bisected = absolute1 - interior * 0.5;
        return new XY(Math.cos(bisected), Math.sin(bisected));
    };
    PlanarSector.prototype.subsectAngle = function (divisions) {
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
    };
    PlanarSector.prototype.getEdgeVectorsForNewAngle = function (angle, lockedEdge) {
        var vectors = this.vectors();
        var angleChange = angle - clockwiseInteriorAngle(vectors[0], vectors[1]);
        var rotateNodes = [-angleChange * 0.5, angleChange * 0.5];
        return vectors.map(function (el, i) { return el.rotate(rotateNodes[i]); }, this);
    };
    PlanarSector.prototype.getEndNodesChangeForNewAngle = function (angle, lockedEdge) {
        var vectors = this.vectors();
        var angleChange = angle - clockwiseInteriorAngle(vectors[0], vectors[1]);
        var rotateNodes = [-angleChange * 0.5, angleChange * 0.5];
        return vectors.map(function (el, i) {
            return this.endPoints[i].subtract(el.rotate(rotateNodes[i]).add(this.origin));
        }, this);
    };
    PlanarSector.prototype.equivalent = function (a) {
        return ((a.edges[0].isSimilarToEdge(this.edges[0]) &&
            a.edges[1].isSimilarToEdge(this.edges[1])) ||
            (a.edges[0].isSimilarToEdge(this.edges[1]) &&
                a.edges[1].isSimilarToEdge(this.edges[0])));
    };
    return PlanarSector;
}(Sector));
var PlanarJunction = (function () {
    function PlanarJunction(node) {
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
    PlanarJunction.prototype.edgeVectorsNormalized = function () {
        return this.edges.map(function (el) { return el.vector(this.origin).normalize(); }, this);
    };
    PlanarJunction.prototype.edgeAngles = function () {
        return this.edges.map(function (el) { return el.absoluteAngle(this.origin); }, this);
    };
    PlanarJunction.prototype.sectorWithEdges = function (a, b) {
        var found = undefined;
        this.sectors.forEach(function (el) {
            if ((el.edges[0].equivalent(a) && el.edges[1].equivalent(b)) ||
                (el.edges[1].equivalent(a) && el.edges[0].equivalent(b))) {
                found = el;
                return found;
            }
        }, this);
        return found;
    };
    PlanarJunction.prototype.interiorAngles = function () {
        var absoluteAngles = this.edges.map(function (el) { return el.absoluteAngle(this.origin); }, this);
        return absoluteAngles.map(function (el, i) {
            var nextI = (i + 1) % this.edges.length;
            return clockwiseInteriorAngleRadians(el, absoluteAngles[nextI]);
        }, this);
    };
    PlanarJunction.prototype.clockwiseNode = function (fromNode) {
        for (var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].otherNode(this.origin) === fromNode) {
                return this.edges[(i + 1) % this.edges.length].otherNode(this.origin);
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
            var circuit = this.origin.graph.walkClockwiseCircut(this.origin, this.edges[n].otherNode(this.origin));
            var face = new this.origin.graph.faceType(this.origin.graph).makeFromCircuit(circuit);
            if (face !== undefined) {
                adjacentFaces.push(face);
            }
        }
        return adjacentFaces;
    };
    return PlanarJunction;
}());
var PlanarGraph = (function (_super) {
    __extends(PlanarGraph, _super);
    function PlanarGraph() {
        var _this = _super.call(this) || this;
        _this.nodeType = PlanarNode;
        _this.edgeType = PlanarEdge;
        _this.faceType = PlanarFace;
        _this.properties = { "optimization": 0 };
        _this.clear();
        return _this;
    }
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
    PlanarGraph.prototype.newPlanarNode = function (x, y) {
        return this.newNode().position(x, y);
    };
    PlanarGraph.prototype.newPlanarEdge = function (x1, y1, x2, y2) {
        var a = this.newNode().position(x1, y1);
        var b = this.newNode().position(x2, y2);
        return this.newEdge(a, b);
    };
    PlanarGraph.prototype.newPlanarEdgeFromNode = function (node, x, y) {
        var newNode = this.newNode().position(x, y);
        return this.newEdge(node, newNode);
    };
    PlanarGraph.prototype.newPlanarEdgeBetweenNodes = function (a, b) {
        return this.newEdge(a, b);
    };
    PlanarGraph.prototype.newPlanarEdgeRadiallyFromNode = function (node, angle, length) {
        var newNode = this.copyNode(node)
            .translate(Math.cos(angle) * length, Math.sin(angle) * length);
        return this.newEdge(node, newNode);
    };
    PlanarGraph.prototype.clear = function () {
        this.nodes = [];
        this.edges = [];
        this.faces = [];
        return this;
    };
    PlanarGraph.prototype.removeEdge = function (edge) {
        var len = this.edges.length;
        var endNodes = [edge.nodes[0], edge.nodes[1]];
        this.edges = this.edges.filter(function (el) { return el !== edge; });
        this.edgeArrayDidChange();
        this.cleanNodeIfUseless(endNodes[0]);
        this.cleanNodeIfUseless(endNodes[1]);
        return new PlanarClean(undefined, len - this.edges.length);
    };
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
    PlanarGraph.prototype.cleanNodeIfUseless = function (node) {
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
    };
    PlanarGraph.prototype.cleanAllUselessNodes = function () {
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
    };
    PlanarGraph.prototype.cleanDuplicateNodes = function (epsilon) {
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
    };
    PlanarGraph.prototype.clean = function (epsilon) {
        var report = new PlanarClean();
        report.join(this.cleanDuplicateNodes(epsilon));
        report.join(this.fragment());
        report.join(this.cleanDuplicateNodes(epsilon));
        report.join(this.cleanGraph());
        report.join(this.cleanAllUselessNodes());
        return report;
    };
    PlanarGraph.prototype.fragment = function () {
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
    };
    PlanarGraph.prototype.fragmentEdge = function (edge) {
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
    };
    PlanarGraph.prototype.walkClockwiseCircut = function (node1, node2) {
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
        } while (!visitedList.contains(travelingNode));
        return undefined;
    };
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
    PlanarGraph.prototype.getEdgeIntersections = function (epsilon) {
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
    };
    PlanarGraph.prototype.getNearestNode = function (a, b) {
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
    };
    PlanarGraph.prototype.getNearestNodes = function (a, b, howMany) {
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
    };
    PlanarGraph.prototype.getNearestEdge = function (a, b) {
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
    };
    PlanarGraph.prototype.getNearestEdges = function (a, b, howMany) {
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
    };
    PlanarGraph.prototype.getNearestEdgeConnectingPoints = function (a, b, c, d) {
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
    };
    PlanarGraph.prototype.getNearestFace = function (a, b) {
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
    };
    PlanarGraph.prototype.getNearestInteriorAngle = function (a, b) {
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
    };
    PlanarGraph.prototype.faceArrayDidChange = function () { for (var i = 0; i < this.faces.length; i++) {
        this.faces[i].index = i;
    } };
    PlanarGraph.prototype.generateFaces = function () {
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
    };
    PlanarGraph.prototype.adjacentFaceTree = function (start) {
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
    };
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
    PlanarGraph.prototype.fewestPolylines = function () {
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
    };
    return PlanarGraph;
}(Graph));
var CreaseDirection;
(function (CreaseDirection) {
    CreaseDirection[CreaseDirection["mark"] = 0] = "mark";
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
var MadeByType;
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
var MadeBy = (function () {
    function MadeBy() {
        this.endPoints = [];
        this.intersections = [];
    }
    return MadeBy;
}());
var ChangeType;
(function (ChangeType) {
    ChangeType[ChangeType["position"] = 0] = "position";
    ChangeType[ChangeType["newLine"] = 1] = "newLine";
})(ChangeType || (ChangeType = {}));
var FoldSequence = (function () {
    function FoldSequence() {
    }
    return FoldSequence;
}());
var CreaseSector = (function (_super) {
    __extends(CreaseSector, _super);
    function CreaseSector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CreaseSector.prototype.kawasakiFourth = function () {
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
    };
    return CreaseSector;
}(PlanarSector));
var CreaseJunction = (function (_super) {
    __extends(CreaseJunction, _super);
    function CreaseJunction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CreaseJunction.prototype.flatFoldable = function (epsilon) {
        return this.kawasaki() && this.maekawa();
    };
    CreaseJunction.prototype.alternateAngleSum = function () {
        if (this.sectors.length % 2 != 0) {
            return undefined;
        }
        var sums = [0, 0];
        this.sectors.forEach(function (el, i) { sums[i % 2] += el.angle(); });
        return sums;
    };
    CreaseJunction.prototype.maekawa = function () {
        return true;
    };
    CreaseJunction.prototype.kawasaki = function () {
        var alternating = this.alternateAngleSum();
        return epsilonEqual(alternating[0], alternating[1]);
    };
    CreaseJunction.prototype.kawasakiRating = function () {
        var alternating = this.alternateAngleSum();
        return Math.abs(alternating[0] - alternating[1]);
    };
    CreaseJunction.prototype.kawasakiSolution = function () {
        var alternating = this.alternateAngleSum().map(function (el) {
            return { 'difference': (Math.PI - el), 'sectors': [] };
        });
        this.sectors.forEach(function (el, i) { alternating[i % 2].sectors.push(el); });
        return alternating;
    };
    CreaseJunction.prototype.kawasakiFourth = function (sector) {
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
    };
    return CreaseJunction;
}(PlanarJunction));
var CreaseNode = (function (_super) {
    __extends(CreaseNode, _super);
    function CreaseNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.junctionType = CreaseJunction;
        _this.sectorType = CreaseSector;
        return _this;
    }
    CreaseNode.prototype.isBoundary = function () {
        for (var i = 0; i < this.graph.boundary.edges.length; i++) {
            var thisPt = new XY(this.x, this.y);
            if (this.graph.boundary.edges[i].collinear(thisPt)) {
                return true;
            }
        }
        return false;
    };
    CreaseNode.prototype.alternateAngleSum = function () {
        return this.junction().alternateAngleSum();
    };
    CreaseNode.prototype.kawasakiRating = function () {
        return this.junction().kawasakiRating();
    };
    CreaseNode.prototype.flatFoldable = function (epsilon) {
        if (this.isBoundary()) {
            return true;
        }
        return this.junction().flatFoldable(epsilon);
    };
    CreaseNode.prototype.kawasakiFourth = function (a, b) {
        var junction = this.junction();
        var sector = junction.sectorWithEdges(a, b);
        if (sector !== undefined) {
            return junction.kawasakiFourth(sector);
        }
    };
    CreaseNode.prototype.creaseLineThrough = function (point) { return this.graph.creaseThroughPoints(this, point); };
    CreaseNode.prototype.creaseToPoint = function (point) { return this.graph.creasePointToPoint(this, point); };
    return CreaseNode;
}(PlanarNode));
var Crease = (function (_super) {
    __extends(Crease, _super);
    function Crease(graph, node1, node2) {
        var _this = _super.call(this, graph, node1, node2) || this;
        _this.orientation = CreaseDirection.mark;
        _this.newMadeBy = new MadeBy();
        _this.newMadeBy.endPoints = [node1, node2];
        return _this;
    }
    ;
    Crease.prototype.mark = function () { this.orientation = CreaseDirection.mark; return this; };
    Crease.prototype.mountain = function () { this.orientation = CreaseDirection.mountain; return this; };
    Crease.prototype.valley = function () { this.orientation = CreaseDirection.valley; return this; };
    Crease.prototype.border = function () { this.orientation = CreaseDirection.border; return this; };
    Crease.prototype.creaseToEdge = function (edge) { return this.graph.creaseEdgeToEdge(this, edge); };
    return Crease;
}(PlanarEdge));
var CreaseFace = (function (_super) {
    __extends(CreaseFace, _super);
    function CreaseFace() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CreaseFace.prototype.rabbitEar = function () {
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
    };
    return CreaseFace;
}(PlanarFace));
var CreasePattern = (function (_super) {
    __extends(CreasePattern, _super);
    function CreasePattern() {
        var _this = _super.call(this) || this;
        _this.symmetryLine = undefined;
        _this.nodeType = CreaseNode;
        _this.edgeType = Crease;
        _this.faceType = CreaseFace;
        if (_this.boundary === undefined) {
            _this.boundary = new ConvexPolygon();
        }
        _this.square();
        return _this;
    }
    CreasePattern.prototype.copy = function () {
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
            var f = new PlanarFace(g);
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
    };
    CreasePattern.prototype.fold = function (param1, param2, param3, param4) {
    };
    CreasePattern.prototype.foldInHalf = function () {
        var crease;
        var bounds = this.bounds();
        if (epsilonEqual(bounds.size.width, bounds.size.height)) {
            this.clean();
            var edgeCount = this.edges.length;
            var edgeMidpoints = this.edges.map(function (el) { return el.midpoint(); });
            var arrayOfPointsAndMidpoints = this.nodes.map(function (el) { return new XY(el.x, el.y); }).concat(edgeMidpoints);
            var centroid = new XY(bounds.topLeft.x + bounds.size.width * 0.5, bounds.topLeft.y + bounds.size.height * 0.5);
            var i = 0;
            do {
                crease = this.creaseThroughPoints(arrayOfPointsAndMidpoints[i], centroid);
                this.clean();
                i++;
            } while (edgeCount === this.edges.length && i < arrayOfPointsAndMidpoints.length);
            if (edgeCount !== this.edges.length)
                return crease;
        }
        return;
    };
    CreasePattern.prototype.newCrease = function (a_x, a_y, b_x, b_y) {
        this.creaseSymmetry(a_x, a_y, b_x, b_y);
        var newCrease = this.newPlanarEdge(a_x, a_y, b_x, b_y);
        if (this.didChange !== undefined) {
            this.didChange(undefined);
        }
        return newCrease;
    };
    CreasePattern.prototype.crease = function (a, b, c, d) {
        var e = gimme1Edge(a, b, c, d);
        if (e === undefined) {
            return;
        }
        var edge = this.boundary.clipEdge(e);
        if (edge === undefined) {
            return;
        }
        return this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
    };
    CreasePattern.prototype.creaseRay = function (a, b, c, d) {
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
    };
    CreasePattern.prototype.creaseRayUntilIntersection = function (ray, target) {
        var clips = ray.clipWithEdgesWithIntersections(this.edges);
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
    };
    CreasePattern.prototype.creaseLineRepeat = function (a, b, c, d) {
        var ray = gimme1Ray(a, b, c, d);
        return this.creaseRayRepeat(ray)
            .concat(this.creaseRayRepeat(ray.flip()));
    };
    CreasePattern.prototype.creaseRayRepeat = function (ray, target) {
        return new Polyline()
            .rayReflectRepeat(ray, this.edges, target)
            .edges()
            .map(function (edge) {
            return this.crease(edge);
        }, this)
            .filter(function (el) { return el != undefined; });
    };
    CreasePattern.prototype.creaseSymmetry = function (ax, ay, bx, by) {
        if (this.symmetryLine === undefined) {
            return undefined;
        }
        var ra = new XY(ax, ay).reflect(this.symmetryLine.nodes[0], this.symmetryLine.nodes[1]);
        var rb = new XY(bx, by).reflect(this.symmetryLine.nodes[0], this.symmetryLine.nodes[1]);
        return this.newPlanarEdge(ra.x, ra.y, rb.x, rb.y);
    };
    CreasePattern.prototype.creaseThroughPoints = function (a, b, c, d) {
        var line = gimme1Line(a, b, c, d);
        if (line === undefined) {
            return;
        }
        var edge = this.boundary.clipLine(line);
        if (edge === undefined) {
            return;
        }
        var newCrease = this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
        newCrease.madeBy = new Fold(this.creaseThroughPoints, [new XY(a.x, a.y), new XY(b.x, b.y)]);
        return newCrease;
    };
    CreasePattern.prototype.creasePointToPoint = function (a, b, c, d) {
        var p = gimme2XY(a, b, c, d);
        if (p === undefined) {
            return;
        }
        var midpoint = new XY((p[0].x + p[1].x) * 0.5, (p[0].y + p[1].y) * 0.5);
        var v = new XY(p[1].x - p[0].x, p[1].y - p[0].y);
        var perp1 = v.rotate90();
        var edge = this.boundary.clipLine(new Line(midpoint, midpoint.add(perp1)));
        if (edge !== undefined) {
            var newCrease = this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
            newCrease.madeBy = new Fold(this.creasePointToPoint, [new XY(p[0].x, p[0].y), new XY(p[1].x, p[1].y)]);
            return newCrease;
        }
    };
    CreasePattern.prototype.creaseEdgeToEdge = function (one, two) {
        var a = new Edge(one.nodes[0].x, one.nodes[0].y, one.nodes[1].x, one.nodes[1].y);
        var b = new Edge(two.nodes[0].x, two.nodes[0].y, two.nodes[1].x, two.nodes[1].y);
        if (a.parallel(b)) {
            var u = a.nodes[0].subtract(a.nodes[1]);
            var midpoint = a.nodes[0].midpoint(b.nodes[1]);
            var clip = this.boundary.clipLine(new Line(midpoint, midpoint.add(u)));
            return [this.newCrease(clip.nodes[0].x, clip.nodes[0].y, clip.nodes[1].x, clip.nodes[1].y)];
        }
        else {
            var intersection = intersectionLineLine(a, b);
            var u = a.nodes[1].subtract(a.nodes[0]);
            var v = b.nodes[1].subtract(b.nodes[0]);
            var vectors = bisect(u, v);
            vectors[1] = vectors[0].rotate90();
            return vectors
                .map(function (el) { return this.boundary.clipLine(new Line(intersection, el.add(intersection))); }, this)
                .filter(function (el) { return el !== undefined; })
                .map(function (el) {
                return this.newCrease(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y);
            }, this)
                .sort(function (a, b) {
                return Math.abs(u.cross(vectors[0])) - Math.abs(u.cross(vectors[1]));
            });
        }
    };
    CreasePattern.prototype.creasePerpendicularThroughPoint = function (line, point) {
        var ab = new XY(line.nodes[1].x - line.nodes[0].x, line.nodes[1].y - line.nodes[0].y);
        var perp = new XY(-ab.y, ab.x);
        var point2 = new XY(point.x + perp.x, point.y + perp.y);
        var crease = this.creaseThroughPoints(point, point2);
        if (crease !== undefined) {
            crease.madeBy = new Fold(this.creasePerpendicularThroughPoint, [new XY(line.nodes[0].x, line.nodes[0].y), new XY(line.nodes[1].x, line.nodes[1].y), new XY(point.x, point.y)]);
        }
        return crease;
    };
    CreasePattern.prototype.creasePointToLine = function (origin, point, line) {
        var radius = Math.sqrt(Math.pow(origin.x - point.x, 2) + Math.pow(origin.y - point.y, 2));
        var intersections = circleLineIntersectionAlgorithm(origin, radius, line.nodes[0], line.nodes[1]);
        var creases = [];
        for (var i = 0; i < intersections.length; i++) {
            creases.push(this.creasePointToPoint(point, intersections[i]));
        }
        return creases;
    };
    CreasePattern.prototype.creasePerpendicularPointOntoLine = function (point, ontoLine, perpendicularTo) {
        var endPts = perpendicularTo.nodes;
        var align = new XY(endPts[1].x - endPts[0].x, endPts[1].y - endPts[0].y);
        var pointParallel = new XY(point.x + align.x, point.y + align.y);
        var intersection = intersectionLineLine(new Line(point, pointParallel), ontoLine);
        if (intersection != undefined) {
            var midPoint = new XY((intersection.x + point.x) * 0.5, (intersection.y + point.y) * 0.5);
            var perp = new XY(-align.y, align.x);
            var midPoint2 = new XY(midPoint.x + perp.x, midPoint.y + perp.y);
            return this.creaseThroughPoints(midPoint, midPoint2);
        }
        throw "axiom 7: two crease lines cannot be parallel";
    };
    CreasePattern.prototype.creaseVoronoi = function (v, interp) {
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
    };
    CreasePattern.prototype.possibleFolds = function () {
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
    };
    CreasePattern.prototype.possibleFolds1 = function () {
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
    };
    CreasePattern.prototype.possibleFolds2 = function () {
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
    };
    CreasePattern.prototype.possibleFolds3 = function (edges) {
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
    };
    CreasePattern.prototype.wiggle = function () {
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
    };
    CreasePattern.prototype.flatFoldable = function () {
        return this.nodes.map(function (el) { return el.flatFoldable(); })
            .reduce(function (prev, cur) { return prev && cur; });
    };
    CreasePattern.prototype.bounds = function () { return this.boundary.minimumRect(); };
    CreasePattern.prototype.bottomEdge = function () {
        return this.edges
            .filter(function (el) { return el.orientation === CreaseDirection.border; })
            .sort(function (a, b) { return (b.nodes[0].y + b.nodes[1].y) - (a.nodes[0].y + a.nodes[1].y); })
            .shift();
    };
    CreasePattern.prototype.topEdge = function () {
        return this.edges
            .filter(function (el) { return el.orientation === CreaseDirection.border; })
            .sort(function (a, b) { return (a.nodes[0].y + a.nodes[1].y) - (b.nodes[0].y + b.nodes[1].y); })
            .shift();
    };
    CreasePattern.prototype.rightEdge = function () {
        return this.edges
            .filter(function (el) { return el.orientation === CreaseDirection.border; })
            .sort(function (a, b) { return (b.nodes[0].x + b.nodes[1].x) - (a.nodes[0].x + a.nodes[1].x); })
            .shift();
    };
    CreasePattern.prototype.leftEdge = function () {
        return this.edges
            .filter(function (el) { return el.orientation === CreaseDirection.border; })
            .sort(function (a, b) { return (a.nodes[0].x + a.nodes[1].x) - (b.nodes[0].x + b.nodes[1].x); })
            .shift();
    };
    CreasePattern.prototype.contains = function (p) { return this.boundary.contains(p); };
    CreasePattern.prototype.square = function (width) {
        var w = 1.0;
        if (width != undefined && width != 0) {
            w = Math.abs(width);
        }
        return this.setBoundary([new XY(0, 0), new XY(w, 0), new XY(w, w), new XY(0, w)]);
    };
    CreasePattern.prototype.rectangle = function (width, height) {
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
    };
    CreasePattern.prototype.noBoundary = function () {
        this.boundary.edges = [];
        this.edges = this.edges.filter(function (el) { return el.orientation !== CreaseDirection.border; });
        this.cleanAllUselessNodes();
        return this;
    };
    CreasePattern.prototype.setBoundary = function (points, alreadyClockwiseSorted) {
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
    };
    CreasePattern.prototype.setMinRectBoundary = function () {
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
    };
    CreasePattern.prototype.clear = function () {
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
    };
    CreasePattern.prototype.noSymmetry = function () { this.symmetryLine = undefined; return this; };
    CreasePattern.prototype.bookSymmetry = function () {
        var center = this.boundary.center();
        return this.setSymmetryLine(center, center.add(new XY(0, 1)));
    };
    CreasePattern.prototype.diagonalSymmetry = function () {
        var center = this.boundary.center();
        return this.setSymmetryLine(center, center.add(new XY(1, 1)));
    };
    CreasePattern.prototype.setSymmetryLine = function (a, b, c, d) {
        this.symmetryLine = gimme1Line(a, b, c, d);
        return this;
    };
    CreasePattern.prototype.exportFoldFile = function () {
        this.generateFaces();
        this.nodeArrayDidChange();
        this.edgeArrayDidChange();
        var file = {};
        file["file_spec"] = 1;
        file["file_creator"] = "creasepattern.js by Robby Kraft";
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
    };
    CreasePattern.prototype.importFoldFile = function (file) {
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
    };
    CreasePattern.prototype.exportSVG = function (size) {
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
    };
    CreasePattern.prototype.exportSVGMin = function (size) {
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
    };
    CreasePattern.prototype.kiteBase = function () {
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
    };
    CreasePattern.prototype.fishBase = function () {
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
    };
    CreasePattern.prototype.birdBase = function () {
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
        this.fragment();
        this.clean();
        return this;
    };
    return CreasePattern;
}(PlanarGraph));
Array.prototype.mountain = function () {
    if (this.length <= 1) {
        return;
    }
    for (var i = 0; i < this.length; i++) {
        if (this[i] instanceof Crease) {
            this[i].mountain();
        }
    }
    return this;
};
Array.prototype.valley = function () {
    if (this.length <= 1) {
        return;
    }
    for (var i = 0; i < this.length; i++) {
        if (this[i] instanceof Crease) {
            this[i].valley();
        }
    }
    return this;
};
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
