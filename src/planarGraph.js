// planarGraph.js
// a planar graph data structure containing edges and vertices in 2D space
// mit open source license, robby kraft
/// <reference path="graph.ts"/>
// VOCABULARY
//  "unused": a node is unused if it is not connected to an edge
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
var EPSILON_LOW = 0.003;
var EPSILON = 0.00001;
var EPSILON_HIGH = 0.00000001;
var EPSILON_UI = 0.05; // user tap, based on precision of a finger on a screen
function epsilonEqual(a, b, epsilon) {
    if (epsilon == undefined) {
        epsilon = EPSILON_HIGH;
    }
    return (Math.abs(a - b) < epsilon);
}
var XY = (function () {
    function XY(x, y) {
        this.x = x;
        this.y = y;
    }
    // position(x:number, y:number):XY{ this.x = x; this.y = y; return this; }
    // translated(dx:number, dy:number):XY{ this.x += dx; this.y += dy; return this;}
    XY.prototype.normalize = function () { var m = this.mag(); return new XY(this.x / m, this.y / m); };
    XY.prototype.rotate90 = function () { return new XY(-this.y, this.x); };
    XY.prototype.rotate = function (origin, angle) {
        var dx = this.x - origin.x;
        var dy = this.y - origin.y;
        var radius = Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2));
        var currentAngle = Math.atan2(dy, dx);
        return new XY(origin.x + radius * Math.cos(currentAngle + angle), origin.y + radius * Math.sin(currentAngle + angle));
    };
    XY.prototype.dot = function (point) { return this.x * point.x + this.y * point.y; };
    XY.prototype.cross = function (vector) { return this.x * vector.y - this.y * vector.x; };
    XY.prototype.mag = function () { return Math.sqrt(this.x * this.x + this.y * this.y); };
    XY.prototype.equivalent = function (point, epsilon) {
        if (epsilon == undefined) {
            epsilon = EPSILON_HIGH;
        }
        // rect bounding box, cheaper than radius calculation
        return (epsilonEqual(this.x, point.x, epsilon) && epsilonEqual(this.y, point.y, epsilon));
    };
    XY.prototype.arrayForm = function () { return [this.x, this.y]; };
    return XY;
}());
var PlanarPair = (function () {
    function PlanarPair(parent, node, edge) {
        this.node = node;
        this.angle = Math.atan2(node.y - parent.y, node.x - parent.x);
        this.edge = edge;
        // optional
        this.parent = parent;
    }
    return PlanarPair;
}());
var EdgeIntersection = (function (_super) {
    __extends(EdgeIntersection, _super);
    function EdgeIntersection(otherEdge, intersectionX, intersectionY) {
        var _this = _super.call(this, intersectionX, intersectionY) || this;
        _this.edge = otherEdge;
        return _this;
    }
    return EdgeIntersection;
}(XY));
var InteriorAngle = (function () {
    function InteriorAngle(edge1, edge2) {
        this.node = edge1.commonNodeWithEdge(edge2);
        if (this.node === undefined) {
            return undefined;
        }
        this.angle = clockwiseAngleFrom(edge1.absoluteAngle(this.node), edge2.absoluteAngle(this.node));
        this.edges = [edge1, edge2];
    }
    InteriorAngle.prototype.equivalent = function (a) {
        if ((a.edges[0].isSimilarToEdge(this.edges[0]) && a.edges[1].isSimilarToEdge(this.edges[1])) ||
            (a.edges[0].isSimilarToEdge(this.edges[1]) && a.edges[1].isSimilarToEdge(this.edges[0]))) {
            return true;
        }
        return false;
    };
    return InteriorAngle;
}());
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
// class PlanarAngle{
// 	// the radial space between 2 edges
// 	// an angle defined by two adjacent edges
// 	node:PlanarNode;    // center node
// 	edges:[PlanarEdge,PlanarEdge];  // two adjacent edges
// 	angle:number; // radians
// 	constructor(node:PlanarNode, edge1:PlanarEdge, edge2:PlanarEdge, angle){
// 		var nodeInCommon = <PlanarNode>edge1.nodeInCommon(edge2);
// 		this.node = nodeInCommon;
// 		this.angle = 0;//Math.atan2(node.y-parent.y, node.x-parent.x);
// 		this.edges = [edge1, edge2];
// 	}
// }
var PlanarNode = (function (_super) {
    __extends(PlanarNode, _super);
    function PlanarNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlanarNode.prototype.adjacentFaces = function () {
        var adjacentFaces = [];
        var adj = this.planarAdjacent();
        for (var n = 0; n < adj.length; n++) {
            var face = this.graph.makeFace(this.graph.findClockwiseCircut(this, adj[n].node));
            if (face != undefined) {
                adjacentFaces.push(face);
            }
        }
        return adjacentFaces;
    };
    PlanarNode.prototype.interiorAngles = function () {
        var adj = this.planarAdjacent();
        // if this node is a leaf, should 1 angle be 360 degrees? or no interior angles
        if (adj.length <= 1) {
            return [];
        }
        return adj.map(function (el, i) {
            var nextI = (i + 1) % this.length;
            // var angleDifference = clockwiseAngleFrom(this[i].angle, this[nextI].angle);
            return new InteriorAngle(this[i].edge, this[nextI].edge);
        }, adj);
    };
    PlanarNode.prototype.planarAdjacent = function () {
        return this.adjacentEdges()
            .map(function (el) {
            if (this === el.nodes[0])
                return new PlanarPair(el.nodes[0], el.nodes[1], el);
            else
                return new PlanarPair(el.nodes[1], el.nodes[0], el);
        }, this)
            .sort(function (a, b) { return (a.angle < b.angle) ? 1 : (a.angle > b.angle) ? -1 : 0; });
    };
    /** Locates the most clockwise adjacent node from the node supplied in the argument. If this was a clock centered at this node, if you pass in node for the number 3, it will return you the number 4.
     * @returns {PlanarPair} PlanarPair object containing the clockwise node and the edge connecting the two.
     */
    PlanarNode.prototype.adjacentNodeClockwiseFrom = function (node) {
        var adjacentNodes = this.planarAdjacent();
        for (var i = 0; i < adjacentNodes.length; i++) {
            if (adjacentNodes[i].node === node) {
                return adjacentNodes[((i + 1) % adjacentNodes.length)];
            }
        }
        return undefined;
    };
    // implements XY
    // todo: probably need to break apart XY and this. this modifies the x and y in place. XY returns a new one and doesn't modify the current one in place
    PlanarNode.prototype.position = function (x, y) { this.x = x; this.y = y; return this; };
    PlanarNode.prototype.translate = function (dx, dy) { this.x += dx; this.y += dy; return this; };
    PlanarNode.prototype.normalize = function () { var m = this.mag(); this.x /= m; this.y /= m; return this; };
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
    PlanarNode.prototype.mag = function () { return Math.sqrt(this.x * this.x + this.y * this.y); };
    PlanarNode.prototype.equivalent = function (point, epsilon) {
        if (epsilon == undefined) {
            epsilon = EPSILON_HIGH;
        }
        // rect bounding box, cheaper than radius calculation
        return (epsilonEqual(this.x, point.x, epsilon) && epsilonEqual(this.y, point.y, epsilon));
    };
    PlanarNode.prototype.arrayForm = function () { return [this.x, this.y]; };
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
        return this.graph.edges
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
        return [this.graph.makeFace(this.graph.findClockwiseCircut(this.nodes[0], this.nodes[1])),
            this.graph.makeFace(this.graph.findClockwiseCircut(this.nodes[1], this.nodes[0]))]
            .filter(function (el) { return el !== undefined; });
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
    return PlanarFace;
}());
var PlanarGraph = (function (_super) {
    __extends(PlanarGraph, _super);
    function PlanarGraph() {
        var _this = _super.call(this) || this;
        _this.nodeType = PlanarNode;
        _this.edgeType = PlanarEdge;
        _this.clear();
        return _this;
    }
    // converts node objects into array of arrays notation x is [0], and y is [1]
    PlanarGraph.prototype.nodesArray = function () { return this.nodes.map(function (el) { return [el.x, el.y]; }); };
    /** This will deep-copy the contents of this graph and return it as a new object
     * @returns {PlanarGraph}
     */
    PlanarGraph.prototype.duplicate = function () {
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
        return len - this.edges.length;
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
        this.cleanNodeIfUseless(node1);
        this.cleanNodeIfUseless(node2);
        return len - this.edges.length;
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
                if (epsilonEqual(Math.abs(angleDiff), Math.PI)) {
                    var farNodes = [edges[0].uncommonNodeWithEdge(edges[1]),
                        edges[1].uncommonNodeWithEdge(edges[0])];
                    // super.removeEdge(edges[0]);
                    edges[0].nodes = [farNodes[0], farNodes[1]];
                    _super.prototype.removeEdge.call(this, edges[1]);
                    // this.newEdge(farNodes[0], farNodes[1]);
                    return this.removeNode(node);
                }
        }
        return 0;
    };
    /** Removes all isolated nodes and performs cleanNodeIfUseless() on every node
     * @returns {number} how many nodes were removed
     */
    PlanarGraph.prototype.cleanAllUselessNodes = function () {
        var count = _super.prototype.removeIsolatedNodes.call(this);
        for (var i = this.nodes.length - 1; i >= 0; i--) {
            count += this.cleanNodeIfUseless(this.nodes[i]);
        }
        return count;
    };
    // cleanNodes():number{
    // 	var count = this.cleanAllUselessNodes();
    // 	this.cleanDuplicateNodes();
    // 	return count;
    // }
    PlanarGraph.prototype.cleanDuplicateNodes = function (epsilon) {
        var that = this;
        function searchAndMergeOneDuplicatePair(epsilon) {
            for (var i = 0; i < that.nodes.length - 1; i++) {
                for (var j = i + 1; j < that.nodes.length; j++) {
                    if (that.nodes[i].equivalent(that.nodes[j], epsilon)) {
                        // todo, mergeNodes does repeated cleaning, suppress and move to end of function
                        // that.nodes[i].x = (that.nodes[i].x + that.nodes[j].x)*0.5;
                        // that.nodes[i].y = (that.nodes[i].y + that.nodes[j].y)*0.5;
                        return that.mergeNodes(that.nodes[i], that.nodes[j]);
                    }
                }
            }
            return undefined;
        }
        if (epsilon === undefined) {
            epsilon = EPSILON;
        }
        var node;
        var locations = [];
        do {
            node = searchAndMergeOneDuplicatePair(epsilon);
            if (node != undefined) {
                locations.push(new XY(node.x, node.y));
            }
        } while (node != undefined);
        return locations;
    };
    /** Removes circular and duplicate edges, merges and removes duplicate nodes, and refreshes .index values
     * @returns {object} 'edges' the number of edges removed, and 'nodes' an XY location for every duplicate node merging
     */
    PlanarGraph.prototype.clean = function () {
        var duplicates = this.cleanDuplicateNodes();
        var newNodes = this.fragment(); // todo: return this newNodes
        return {
            'edges': _super.prototype.cleanGraph.call(this),
            'nodes': this.cleanAllUselessNodes() + duplicates.length
        };
    };
    ///////////////////////////////////////////////////////////////
    // fragment, EDGE INTERSECTION
    /** Fragment looks at every edge and one by one removes 2 crossing edges and replaces them with a node at their intersection and 4 edges connecting their original endpoints to the intersection.
     * @returns {XY[]} array of XY locations of all the intersection locations
     */
    PlanarGraph.prototype.fragment = function () {
        var that = this;
        function fragmentOneRound() {
            var crossings = [];
            for (var i = 0; i < that.edges.length; i++) {
                var thisRound = that.fragmentEdge(that.edges[i]);
                crossings = crossings.concat(thisRound);
                if (thisRound.length > 0) {
                    that.cleanGraph();
                    that.cleanAllUselessNodes();
                    that.cleanDuplicateNodes();
                }
            }
            return crossings;
        }
        //todo: remove protection, or bake it into the class itself
        var protection = 0;
        var allCrossings = [];
        var thisCrossings;
        do {
            thisCrossings = fragmentOneRound();
            allCrossings = allCrossings.concat(thisCrossings);
            protection += 1;
        } while (thisCrossings.length != 0 && protection < 400);
        if (protection >= 400) {
            console.log("breaking loop, exceeded 400");
        }
        return allCrossings;
    };
    /** This function targets a single edge and performs the fragment operation on crossing edges.
     * @returns {XY[]} array of XY locations of all the intersection locations
     */
    PlanarGraph.prototype.fragmentEdge = function (edge) {
        var intersections = edge.crossingEdges();
        if (intersections.length === 0) {
            return [];
        }
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
        _super.prototype.removeEdge.call(this, edge);
        _super.prototype.cleanGraph.call(this);
        return intersections.map(function (el) { return new XY(el.x, el.y); });
    };
    ///////////////////////////////////////////////
    // GET PARTS
    ///////////////////////////////////////////////
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
            var pT = minDistBetweenPointLine(p[0], p[1], x, y);
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
            var pT = minDistBetweenPointLine(el.nodes[0], el.nodes[1], x, y);
            if (pT === undefined)
                return undefined;
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
        var nodes = this.getNearestNodes(x, y, 5);
        var node, angles;
        for (var i = 0; i < nodes.length; i++) {
            node = nodes[i];
            angles = node.interiorAngles();
            if (angles !== undefined && angles.length > 0) {
                break;
            }
        }
        if (angles == undefined || angles.length === 0) {
            return undefined;
        }
        // cross product on each edge pair
        var anglesInside = angles.filter(function (el) {
            var pt0 = el.edges[0].uncommonNodeWithEdge(el.edges[1]);
            var pt1 = el.edges[1].uncommonNodeWithEdge(el.edges[0]);
            var cross0 = (y - node.y) * (pt1.x - node.x) -
                (x - node.x) * (pt1.y - node.y);
            var cross1 = (y - pt0.y) * (node.x - pt0.x) -
                (x - pt0.x) * (node.y - pt0.y);
            if (cross0 < 0 || cross1 < 0) {
                return false;
            }
            return true;
        });
        if (anglesInside.length > 0)
            return anglesInside[0];
        return undefined;
    };
    ///////////////////////////////////////////////////////////////
    // CALCULATIONS
    // interiorAngle3Nodes(centerNode:PlanarNode, node1:PlanarNode, node2:PlanarNode):number{
    // 	var adjacentEdges = centerNode.planarAdjacent();
    // 	console.log(adjacentEdges);
    // 	return 0;
    // }
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
    PlanarGraph.prototype.findClockwiseCircut = function (node1, node2) {
        var incidentEdge = this.getEdgeConnectingNodes(node1, node2);
        if (incidentEdge == undefined) {
            return undefined;
        } // nodes are not adjacent
        var pairs = [];
        var lastNode = node1;
        var travelingNode = node2;
        var visitedList = [lastNode];
        var nextWalk = new PlanarPair(lastNode, travelingNode, incidentEdge);
        pairs.push(nextWalk);
        do {
            visitedList.push(travelingNode);
            nextWalk = travelingNode.adjacentNodeClockwiseFrom(lastNode);
            pairs.push(nextWalk);
            lastNode = travelingNode;
            travelingNode = nextWalk.node;
            if (travelingNode === node1) {
                return pairs;
            }
        } while (!arrayContainsObject(visitedList, travelingNode));
        return undefined;
    };
    PlanarGraph.prototype.makeFace = function (circut) {
        if (circut == undefined || circut.length < 3)
            return undefined;
        var face = new PlanarFace(this);
        face.nodes = circut.map(function (el) { return el.node; });
        // so the first node is already present, it's just in the last spot. is this okay?
        // face.nodes.unshift(circut[0].parent);
        face.edges = circut.map(function (el) { return el.edge; });
        for (var i = 0; i < circut.length; i++) {
            face.angles.push(clockwiseAngleFrom(circut[i].angle, circut[(i + 1) % (circut.length)].angle - Math.PI));
        }
        var angleSum = face.angles.reduce(function (sum, value) { return sum + value; }, 0);
        // sum of interior angles rule, (n-2) * PI
        if (face.nodes.length > 2 && epsilonEqual(angleSum / (face.nodes.length - 2), Math.PI, EPSILON)) {
            return face;
        }
    };
    // reflectFace(edge:PlanarEdge){
    // 	var midpoint = edge.midpoint();
    // 	var mat = new paper.Matrix(1, 0, 0, 1, 0, 0);
    // 	// svgLayer.matrix = mat;
    // }
    PlanarGraph.prototype.adjacentFacesTree = function (start) {
        this.faceArrayDidChange();
        var abc = [];
        abc.push(face);
        abc = abc.concat(adjacentArray);
        var face = start;
        var adjacentArray = face.edgeAdjacentFaces();
        var nextLevelAdjacent = [];
        for (var i = 0; i < adjacentArray.length; i++) {
            nextLevelAdjacent.push({ parent: start, adj: adjacentArray[i] });
        }
        var tree = new AdjacentFace(start);
        var round = 0;
        // this thing
        var adj = tree;
        var foundInThisRound;
        do {
            foundInThisRound = false;
            var thisLevelAdjacent = nextLevelAdjacent;
            var nextLevelAdjacent = [];
            for (var i = 0; i < thisLevelAdjacent.length; i++) {
                if (!arrayContainsObject(abc, thisLevelAdjacent[i].adj)) {
                    // instad of this, find parent, push it to the parent's tree
                    abc.push(thisLevelAdjacent[i].adj);
                    // continue as normal
                    var newAdj = new AdjacentFace(thisLevelAdjacent[i].adj);
                    adj.adjacent.push(newAdj);
                    nextLevelAdjacent.push({ parent: newAdj, adj: newAdj });
                    foundInThisRound = true;
                }
            }
        } while (foundInThisRound === true);
        return tree;
    };
    // adjacentFacesTree(start:PlanarFace):AdjacentFace{
    // 	function allocateFaces(face:PlanarFace){
    // 		var adjacent = face.edgeAdjacentFaces();
    // 	}
    // 	// when a face gets allocated, set this to true
    // 	var allocated = this.faces.map(function(el){ return false; });
    // 	var limit = 0;
    // 	var thisDepth = start.edgeAdjacentFaces();
    // 	var tree = new AdjacentFace();
    // 	tree.face = start;
    // 	allocated[ tree.face.index ] = true;
    // 	tree.adjacent = thisDepth.map(function(el){
    // 		var f = new AdjacentFace();
    // 		f.face = el;
    // 		return f;
    // 	});
    // 	for(var i = 0; i < tree.adjacent.length; i++){
    // 		allocated[ tree.adjacent[i].face.index ] = true;
    // 	}
    // 	do{
    // 		var nextDepth:PlanarFace[] = [];
    // 		for(var i = 0; i < thisDepth.length; i++){
    // 			nextDepth = nextDepth.concat(thisDepth[i].edgeAdjacentFaces());
    // 		}
    // 		nextDepth.filter(function(el){ return !allocated[el.index]; });
    // 		thisDepth = nextDepth;
    // 		var t = new AdjacentFace();
    // 		// t.face = start;
    // 		t.adjacent = thisDepth.map(function(el){
    // 			var f = new AdjacentFace();
    // 			f.face = el;
    // 			return f;
    // 		});
    // 		limit++;
    // 	}while(limit < this.faces.length);
    // 	return;
    // }
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
var AdjacentFace = (function () {
    function AdjacentFace(face) {
        this.face = face;
        this.adjacent = [];
    }
    return AdjacentFace;
}());
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//
//                            2D ALGORITHMS
//
function map(input, floor1, ceiling1, floor2, ceiling2) {
    return (input - floor1 / (ceiling1 - floor1)) * (ceiling2 - floor2) + floor2;
}
// if number is within epsilon range of a whole number, remove the floating point noise.
//  example: turns 0.999999989764 into 1.0
function wholeNumberify(num) {
    if (Math.abs(Math.round(num) - num) < EPSILON_HIGH) {
        num = Math.round(num);
    }
    return num;
}
function clockwiseAngleFrom(a, b) {
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
// if points are all collinear
// checks if point lies on line segment 'ab'
function onSegment(point, a, b) {
    var ab = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    var pa = Math.sqrt(Math.pow(point.x - a.x, 2) + Math.pow(point.y - a.y, 2));
    var pb = Math.sqrt(Math.pow(point.x - b.x, 2) + Math.pow(point.y - b.y, 2));
    if (Math.abs(ab - (pa + pb)) < EPSILON)
        return true;
    return false;
}
function rayLineSegmentIntersectionAlgorithm(rayOrigin, rayDirection, point1, point2) {
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
        // todo: really, we need to move beyond the need for whole numbers
        var x = wholeNumberify(rayOrigin.x + rayDirection.x * t1);
        var y = wholeNumberify(rayOrigin.y + rayDirection.y * t1);
        return new XY(x, y);
    }
}
function lineIntersectionAlgorithm(p0, p1, p2, p3) {
    // p0-p1 is first line
    // p2-p3 is second line
    var rise1 = (p1.y - p0.y);
    var run1 = (p1.x - p0.x);
    var rise2 = (p3.y - p2.y);
    var run2 = (p3.x - p2.x);
    var denom = run1 * rise2 - run2 * rise1;
    // var denom = l1.u.x * l2.u.y - l1.u.y * l2.u.x;
    if (denom == 0)
        return undefined;
    // return XY((l1.d * l2.u.y - l2.d * l1.u.y) / denom, (l2.d * l1.u.x - l1.d * l2.u.x) / denom);
    var s02 = { 'x': p0.x - p2.x, 'y': p0.y - p2.y };
    var t = (run2 * s02.y - rise2 * s02.x) / denom;
    return new XY(p0.x + (t * run1), p0.y + (t * rise1));
}
function allEqual(args) {
    for (var i = 1; i < args.length; i++) {
        if (args[i] != args[0])
            return false;
    }
    return true;
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
function linesParallel(p0, p1, p2, p3) {
    // p0-p1 is first line
    // p2-p3 is second line
    var u = new XY(p1.x - p0.x, p1.y - p0.y);
    var v = new XY(p3.x - p2.x, p3.y - p2.y);
    return (Math.abs(u.dot(v.rotate90())) < EPSILON);
}
function minDistBetweenPointLine(a, b, x, y) {
    // (a)-(b) define the line
    // x,y is the point
    var p = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    var u = ((x - a.x) * (b.x - a.x) + (y - a.y) * (b.y - a.y)) / (Math.pow(p, 2));
    if (u < 0 || u > 1.0)
        return undefined;
    return new XY(a.x + u * (b.x - a.x), a.y + u * (b.y - a.y));
}
function reflectPointAcrossLine(point, a, b) {
    var p = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    var u = ((point.x - a.x) * (b.x - a.x) + (point.y - a.y) * (b.y - a.y)) / (Math.pow(p, 2));
    var collinear = new XY(a.x + u * (b.x - a.x), a.y + u * (b.y - a.y));
    var d = new XY(point.x - collinear.x, point.y - collinear.y);
    return new XY(collinear.x - d.x, collinear.y - d.y);
}
function isValidPoint(point) { return (point !== undefined && !isNaN(point.x) && !isNaN(point.y)); }
function isValidNumber(n) { return (n !== undefined && !isNaN(n) && !isNaN(n)); }
//////////////////////////////////////////////////
// RECYCLE BIN - READY TO DELETE
//////////////////////////////////////////////////
function arrayContainsDuplicates(array) {
    if (array.length <= 1)
        return false;
    for (var i = 0; i < array.length - 1; i++) {
        for (var j = i + 1; j < array.length; j++) {
            if (array[i] === array[j]) {
                return true;
            }
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
function arrayContainsObject(array, object) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === object) {
            return true;
        }
    }
    return false;
}
function getNodeIndexNear(x, y, thisEpsilon) {
    var thisPoint = new XY(x, y);
    for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].equivalent(thisPoint, thisEpsilon)) {
            return i;
        }
    }
    return undefined;
}
