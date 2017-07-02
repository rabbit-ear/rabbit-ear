/// <reference path="graph.ts"/>
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
// for purposes of modeling origami crease patterns
//
// this is a planar graph data structure containing edges and vertices
// vertices are points in 3D space {x,y,z}  (z is 0 for now)
var EPSILON = 0.003;
var USER_TAP_EPSILON = 0.01;
var SLOPE_ANGLE_PLACES = 2.5;
var SLOPE_ANGLE_EPSILON = 1 * Math.pow(10, -SLOPE_ANGLE_PLACES);
var SLOPE_ANGLE_INF_EPSILON = 1 * Math.pow(10, SLOPE_ANGLE_PLACES);
// this graph represents an origami crease pattern
//    with creases (edges) defined by their endpoints (vertices)
var XYPoint = (function () {
    function XYPoint(xx, yy) {
        this.x = xx;
        this.y = yy;
    }
    return XYPoint;
}());
var Intersection = (function (_super) {
    __extends(Intersection, _super);
    function Intersection(a, b) {
        var _this = _super.call(this, undefined, undefined) || this;
        _this.exists = false;
        if (a.isAdjacentWithEdge(b)) {
            return undefined;
        }
        var aPts = a.endPoints();
        var bPts = b.endPoints();
        var intersect = lineSegmentIntersectionAlgorithm(aPts[0], aPts[1], bPts[0], bPts[1]);
        if (intersect == undefined) {
            return undefined;
        }
        _this.x = intersect.x;
        _this.y = intersect.y;
        _this.edges = [a, b];
        _this.nodes = [aPts[0], aPts[1], bPts[0], bPts[1]];
        _this.exists = true;
        return _this;
    }
    return Intersection;
}(XYPoint));
var PlanarPair = (function () {
    function PlanarPair(parent, node, edge) {
        this.node = node;
        this.angle = Math.atan2(node.y - parent.y, node.x - parent.x);
        this.edge = edge;
    }
    return PlanarPair;
}());
var PlanarNode = (function (_super) {
    __extends(PlanarNode, _super);
    function PlanarNode(xx, yy) {
        var _this = _super.call(this) || this;
        _this.x = xx;
        _this.y = yy;
        if (xx == undefined) {
            _this.x = 0;
        }
        if (yy == undefined) {
            _this.y = 0;
        }
        return _this;
    }
    PlanarNode.prototype.adjacentNodes = function () {
        return _super.prototype.adjacentNodes.call(this);
    };
    PlanarNode.prototype.adjacentEdges = function () {
        return _super.prototype.adjacentEdges.call(this);
    };
    // a sorted (clockwise) adjacency list of nodes and their connecting edges to this node
    PlanarNode.prototype.planarAdjacent = function () {
        return _super.prototype.adjacentEdges.call(this)
            .map(function (el) {
            var nodes = el.endPoints();
            if (this === nodes[0])
                return new PlanarPair(nodes[0], nodes[1], el);
            else
                return new PlanarPair(nodes[1], nodes[0], el);
        }, this)
            .sort(function (a, b) { return (a.angle < b.angle) ? 1 : (a.angle > b.angle) ? -1 : 0; });
        // .sort(function(a,b){return (a.angle > b.angle)?1:((b.angle > a.angle)?-1:0);});
    };
    PlanarNode.prototype.translate = function (dx, dy) {
        this.x += dx;
        this.y += dy;
    };
    PlanarNode.prototype.rotateAroundNode = function (node, angle) {
        var dx = this.x - node.x;
        var dy = this.y - node.y;
        var distance = Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2));
        var currentAngle = Math.atan2(dy, dx);
        this.x = node.x + distance * Math.cos(currentAngle + angle);
        this.y = node.y + distance * Math.sin(currentAngle + angle);
    };
    return PlanarNode;
}(GraphNode));
var PlanarEdge = (function (_super) {
    __extends(PlanarEdge, _super);
    function PlanarEdge() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // convenience renaming
    // endPoints:()=>PlanarNode[] = function() { return this.adjacentNodes(); };
    // actually asking for more typecasting than i expected
    PlanarEdge.prototype.endPoints = function () {
        var planarNodes = this.graph.nodes;
        return [planarNodes[this.node[0]], planarNodes[this.node[1]]];
    };
    PlanarEdge.prototype.adjacentNodes = function () {
        return _super.prototype.adjacentNodes.call(this);
    };
    PlanarEdge.prototype.adjacentEdges = function () {
        return _super.prototype.adjacentEdges.call(this);
    };
    return PlanarEdge;
}(GraphEdge));
var PlanarFace = (function () {
    function PlanarFace() {
    }
    return PlanarFace;
}());
// creases are lines (edges) with endpoints v1, v2 (indices in vertex array)
var PlanarGraph = (function (_super) {
    __extends(PlanarGraph, _super);
    function PlanarGraph() {
        var _this = _super.call(this) || this;
        _this.clear(); // initalize all empty arrays
        return _this;
    }
    PlanarGraph.prototype.clear = function () {
        _super.prototype.clear.call(this); // clears out nodes[] and edges[]
        this.faces = [];
    };
    PlanarGraph.prototype.newEdge = function (nodeIndex1, nodeIndex2) {
        return this.addEdge(new PlanarEdge(nodeIndex1, nodeIndex2));
    };
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //
    //  1.
    //  ADD PARTS
    PlanarGraph.prototype.addEdgeWithVertices = function (x1, y1, x2, y2) {
        var a = this.addNode(new PlanarNode(x1, y1));
        var b = this.addNode(new PlanarNode(x2, y2));
        return this.newEdge(a, b);
        // this.changedNodes( [this.nodes.length-2, this.nodes.length-1] );
    };
    PlanarGraph.prototype.addEdgeFromVertex = function (existingIndex, newX, newY) {
        var index = this.addNode(new PlanarNode(newX, newY));
        return this.newEdge(existingIndex, index);
        // this.changedNodes( [existingIndex, this.nodes.length-1] );
    };
    PlanarGraph.prototype.addEdgeFromExistingVertices = function (existingIndex1, existingIndex2) {
        return this.newEdge(existingIndex1, existingIndex2);
        // this.changedNodes( [existingIndex1, existingIndex2] );
    };
    PlanarGraph.prototype.addEdgeRadiallyFromVertex = function (existingIndex, angle, distance) {
        var newX = this.nodes[existingIndex].x + Math.cos(angle) * distance;
        var newY = this.nodes[existingIndex].y + Math.sin(angle) * distance;
        return this.addEdgeFromVertex(existingIndex, newX, newY);
        // this.changedNodes( [existingIndex, this.nodes.length-1] );
    };
    PlanarGraph.prototype.addFaceBetweenNodes = function (nodeArray) {
        if (nodeArray.length == 0)
            return;
        var edgeArray = [];
        for (var i = 0; i < nodeArray.length; i++) {
            var nextI = (i + 1) % nodeArray.length;
            var thisEdge = this.edges[this.getEdgeConnectingNodes(nodeArray[i], nodeArray[nextI])];
            if (thisEdge == undefined) {
                console.log("creating edge to make face between nodes " + nodeArray[i] + ' ' + nodeArray[nextI]);
                thisEdge = this.edges[this.addEdgeFromExistingVertices(nodeArray[i], nodeArray[nextI])];
            }
            edgeArray.push(thisEdge);
        }
        var face = new PlanarFace();
        face.edges = edgeArray;
        face.nodes = nodeArray.map(function (el) { return this.nodes[el]; }, this);
        this.faces.push(face);
    };
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //
    //  2.
    //  CLEAN  /  REFRESH COMPONENTS
    // rect bounding box, cheaper than radius calculation
    PlanarGraph.prototype.verticesEquivalent = function (v1, v2, epsilon) {
        return (v1.x - epsilon < v2.x && v1.x + epsilon > v2.x &&
            v1.y - epsilon < v2.y && v1.y + epsilon > v2.y);
    };
    PlanarGraph.prototype.clean = function () {
        var graphResult = _super.prototype.clean.call(this); //{'duplicate':countDuplicate, 'circular': countCircular};
        var result = this.mergeDuplicateVertices();
        Object.assign(graphResult, result);
        return graphResult;
    };
    //////////////////////////////////////
    //   Graph-related (non-positional)
    //      D  G
    //      | /
    //      |/
    //      A----Q
    //     / \
    //    /   \
    //   P     S
    //  clockwise neighbor around:(A), fromNode:(Q) will give you (S)
    PlanarGraph.prototype.getClockwiseNeighborAround = function (centerNode, fromNode) {
        var adjacentNodes = centerNode.planarAdjacent();
        for (var i = 0; i < adjacentNodes.length; i++) {
            if (adjacentNodes[i].node === fromNode) {
                var index = ((i + 1) % adjacentNodes.length);
                return adjacentNodes[index].node;
            }
        }
        throw "getClockwiseNeighborAround() fromNode was not found adjacent to the specified node";
    };
    PlanarGraph.prototype.getNextElementToItemInArray = function (array, item) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == item) {
                var index = i + 1;
                if (index >= array.length)
                    index -= array.length;
                return array[index];
            }
        }
        return undefined;
    };
    ////////////////////////////////////
    //   Planar-related (positional)
    PlanarGraph.prototype.mergeDuplicateVertices = function () {
        // DANGEROUS: removes nodes
        // this looks for nodes.position which are physically nearby, within EPSILON radius
        var removeCatalog = [];
        for (var i = 0; i < this.nodes.length - 1; i++) {
            for (var j = this.nodes.length - 1; j > i; j--) {
                if (this.verticesEquivalent(this.nodes[i], this.nodes[j], EPSILON)) {
                    _super.prototype.mergeNodes.call(this, i, j);
                    // removeCatalog.push( {'x':this.nodes[i].x, 'y':this.nodes[i].y, 'nodes':[i,j] } );
                    removeCatalog.push(new XYPoint(this.nodes[i].x, this.nodes[i].y));
                }
            }
        }
        return removeCatalog;
    };
    PlanarGraph.prototype.getNearestNode = function (x, y) {
        // can be optimized with a k-d tree
        var index = undefined;
        var distance = Math.sqrt(2);
        for (var i = 0; i < this.nodes.length; i++) {
            var dist = Math.sqrt(Math.pow(this.nodes[i].x - x, 2) + Math.pow(this.nodes[i].y - y, 2));
            if (dist < distance) {
                distance = dist;
                index = i;
            }
        }
        return index;
    };
    PlanarGraph.prototype.getNearestNodes = function (x, y, howMany) {
        // can be optimized with a k-d tree
        var distances = [];
        for (var i = 0; i < this.nodes.length; i++) {
            var dist = Math.sqrt(Math.pow(this.nodes[i].x - x, 2) + Math.pow(this.nodes[i].y - y, 2));
            distances.push({ 'i': i, 'd': dist });
        }
        distances.sort(function (a, b) { return (a.d > b.d) ? 1 : ((b.d > a.d) ? -1 : 0); });
        if (howMany > distances.length)
            howMany = distances.length;
        var indices = [];
        for (var i = 0; i < howMany; i++) {
            indices.push(distances[i]['i']);
        }
        return indices;
    };
    PlanarGraph.prototype.getNearestEdge = function (x, y) {
        if (x == undefined || y == undefined)
            return undefined;
        var minDist = undefined;
        var minDistIndex = undefined;
        var minLocation = undefined;
        for (var i = 0; i < this.edges.length; i++) {
            var p = this.edges[i].endPoints();
            var pT = minDistBetweenPointLine(p[0], p[1], x, y);
            if (pT != undefined) {
                var thisDist = Math.sqrt(Math.pow(x - pT.x, 2) + Math.pow(y - pT.y, 2));
                if (minDist == undefined || thisDist < minDist) {
                    minDist = thisDist;
                    minDistIndex = i;
                    minLocation = pT;
                }
            }
        }
        return { 'edge': minDistIndex, 'location': minLocation, 'distance': minDist };
    };
    ///////////////////////////////////////////////////////////////
    // EDGE INTERSECTION
    PlanarGraph.prototype.edgesIntersectUsingVertices = function (a1, a2, b1, b2) {
        // test line a1-a2 intersect with line b1-b2
        // if true - returns {x,y} location of intersection
        if (this.verticesEquivalent(a1, b1, EPSILON) ||
            this.verticesEquivalent(a1, b2, EPSILON) ||
            this.verticesEquivalent(a2, b1, EPSILON) ||
            this.verticesEquivalent(a2, b2, EPSILON)) {
            return undefined;
        }
        return lineSegmentIntersectionAlgorithm(a1, a2, b1, b2);
    };
    PlanarGraph.prototype.getEdgeIntersectionsWithEdge = function (edgeIndex) {
        if (edgeIndex >= this.edges.length) {
            throw "getEdgeIntersectionsWithEdge() edge index larger than edge array";
        }
        var intersections = [];
        for (var i = 0; i < this.edges.length; i++) {
            if (edgeIndex != i) {
                var intersection = new Intersection(this.edges[edgeIndex], this.edges[i]);
                if (intersection.exists) {
                    intersections.push(intersection);
                }
            }
        }
        return intersections;
    };
    PlanarGraph.prototype.getAllEdgeIntersections = function () {
        var intersections = [];
        for (var i = 0; i < this.edges.length - 1; i++) {
            for (var j = i + 1; j < this.edges.length; j++) {
                var intersection = new Intersection(this.edges[i], this.edges[j]);
                if (intersection.exists) {
                    intersections.push(intersection);
                }
            }
        }
        return intersections;
    };
    PlanarGraph.prototype.chop = function () {
        // var intersectionPoints = new PlanarGraph();
        var allIntersections = []; // keep a running total of all the intersection points
        for (var i = 0; i < this.edges.length; i++) {
            var edgeCrossings = this.getEdgeIntersectionsWithEdge(i);
            if (edgeCrossings != undefined && edgeCrossings.length > 0) {
                allIntersections = allIntersections.concat(edgeCrossings);
            }
            while (edgeCrossings.length > 0) {
                var newIntersectionIndex = this.nodes.length;
                this.addNode(new PlanarNode(edgeCrossings[0].x, edgeCrossings[0].y));
                // this.addNode({'x':edgeCrossings[0].x, 'y':edgeCrossings[0].y});
                this.addEdgeFromExistingVertices(this.nodes.length - 1, edgeCrossings[0].nodes[0].index);
                this.addEdgeFromExistingVertices(this.nodes.length - 1, edgeCrossings[0].nodes[1].index);
                this.addEdgeFromExistingVertices(this.nodes.length - 1, edgeCrossings[0].nodes[2].index);
                this.addEdgeFromExistingVertices(this.nodes.length - 1, edgeCrossings[0].nodes[3].index);
                this.removeEdgesBetween(edgeCrossings[0].nodes[0].index, edgeCrossings[0].nodes[1].index);
                this.removeEdgesBetween(edgeCrossings[0].nodes[2].index, edgeCrossings[0].nodes[3].index);
                edgeCrossings = this.getEdgeIntersectionsWithEdge(i);
                // add intersections to array
                allIntersections = allIntersections.concat(edgeCrossings);
                // intersectionPoints.addNodes(edgeCrossings);
                this.clean();
            }
        }
        // return allIntersections;
        // return a unique array of all intersection points
        var pg = new PlanarGraph(); // creating a object inside of the object def itself?..
        pg.nodes = allIntersections;
        pg.mergeDuplicateVertices();
        return pg.nodes;
    };
    ///////////////////////////////////////////////////////////////
    // FACE
    PlanarGraph.prototype.generateFaces = function () {
        // walk around a face
        this.faces = [];
        for (var startIndex = 0; startIndex < this.nodes.length; startIndex++) {
            // from a starting node, get all of its nodes/edges clockwise around it
            var startNodeAdjacent = this.nodes[startIndex].planarAdjacent();
            for (var n = 0; n < startNodeAdjacent.length; n++) {
                // from the start node, venture off in every connected node direction, attempt to make a face
                var adjacentPair = startNodeAdjacent[n];
                var currentNode = adjacentPair.node;
                // attempt to build a face, add first 2 points and connecting edge
                var theFace = new PlanarFace();
                theFace.nodes = [this.nodes[startIndex], currentNode];
                theFace.edges = [adjacentPair.edge];
                var validFace = true;
                while (validFace && currentNode.index != startIndex) {
                    // travel down edges, select the most immediately-clockwise connected node
                    // this requires to get the node we just came from
                    var fromNode = theFace.nodes[theFace.nodes.length - 2];
                    // step forwar down the next edge
                    currentNode = this.getClockwiseNeighborAround(currentNode, fromNode);
                    // check if we have reached the beginning again, if the face is complete
                    if (currentNode == undefined) {
                        validFace = false;
                    } // something weird is going on
                    else {
                        if (currentNode === fromNode) {
                            validFace = false;
                        }
                        else {
                            if (currentNode.index != startIndex) {
                                theFace['nodes'].push(currentNode);
                                // var nextAngle = adjacentPair.angle;
                                // totalAngle += (nextAngle - prevAngle);
                            }
                            theFace['edges'].push(adjacentPair.edge);
                            // var already = this.arrayContainsNumberAtIndex(theFace, currentNode);
                            // if(already == undefined){
                            // 	theFace.push(currentNode);								
                            // } else{
                            // face that makes a figure 8. visits a node twice in the middle.
                            // if(this.faces.length > 2){
                            // 	// we can use this sub section if it's larger than a line
                            // 	var cropFace = theFace.slice(already, 1 + theFace.length-already);
                            // 	this.faces.push(cropFace);
                            // } 
                            // validFace = false;
                            // }
                        }
                    }
                }
                if (validFace && !this.arrayContainsDuplicates(theFace)) {
                    // theFace['angle'] = totalAngle;
                    this.faces.push(theFace);
                }
            }
        }
        // remove duplicate faces
        var i = 0;
        while (i < this.faces.length - 1) {
            var j = this.faces.length - 1;
            while (j > i) {
                if (this.areFacesEquivalent(i, j)) {
                    this.faces.splice(j, 1);
                }
                j--;
            }
            i++;
        }
    };
    PlanarGraph.prototype.arrayContainsNumberAtIndex = function (array, number) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == number) {
                return i;
            }
        }
        return undefined;
    };
    PlanarGraph.prototype.arrayContainsDuplicates = function (array) {
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
    };
    PlanarGraph.prototype.areFacesEquivalent = function (faceIndex1, faceIndex2) {
        // todo: does this work? checking memory location or check .index
        if (this.faces[faceIndex1].nodes.length != this.faces[faceIndex2].nodes.length)
            return false;
        var sorted1 = this.faces[faceIndex1].nodes.sort(function (a, b) { return (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0); });
        var sorted2 = this.faces[faceIndex2].nodes.sort(function (a, b) { return (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0); });
        for (var i = 0; i < sorted1.length; i++) {
            if (!(sorted1[i] === sorted2[i]))
                return false;
        }
        return true;
    };
    PlanarGraph.prototype.getNodeIndexNear = function (x, y, thisEpsilon) {
        var thisPoint = new XYPoint(x, y);
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.verticesEquivalent(this.nodes[i], thisPoint, thisEpsilon)) {
                return i;
            }
        }
        return undefined;
    };
    PlanarGraph.prototype.vertexLiesOnHorizontalEdge = function (v, edgeY) {
        if (v.y < edgeY + EPSILON && v.y > edgeY - EPSILON)
            return true;
        return false;
    };
    PlanarGraph.prototype.vertexLiesOnVerticalEdge = function (v, edgeX) {
        if (v.x < edgeX + EPSILON && v.x > edgeX - EPSILON)
            return true;
        return false;
    };
    PlanarGraph.prototype.vertexLiesOnEdge = function (v, intersect) {
        // including a margin of error, bounding area around vertex
        // first check if point lies on end points
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.verticesEquivalent(this.nodes[i], v, EPSILON)) {
                intersect.x = this.nodes[i].x;
                intersect.y = this.nodes[i].y;
                // intersect.z = this.nodes[i].z;
                return true;
            }
        }
        for (var i = 0; i < this.edges.length; i++) {
            var a = this.nodes[this.edges[i].node[0]];
            var b = this.nodes[this.edges[i].node[1]];
            var crossproduct = (v.y - a.y) * (b.x - a.x) - (v.x - a.x) * (b.y - a.y);
            if (Math.abs(crossproduct) < EPSILON) {
                // cross product is essentially zero, point lies along the (infinite) line
                // now check if it is between the two points
                var dotproduct = (v.x - a.x) * (b.x - a.x) + (v.y - a.y) * (b.y - a.y);
                // dot product must be between 0 and the squared length of the line segment
                if (dotproduct > 0) {
                    var lengthSquared = Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2);
                    if (dotproduct < lengthSquared) {
                        //TODO: intersection
                        //                    intersect =
                        return true;
                    }
                }
            }
        }
        return false;
    };
    PlanarGraph.prototype.log = function () {
        _super.prototype.log.call(this);
        console.log("Vertices: (" + this.nodes.length + ")");
        for (var i = 0; i < this.nodes.length; i++) {
            // console.log(' ' + i + ': (' + this.nodes[i].x + ', ' + this.nodes[i].y + ', ' + this.nodes[i].z + ')');
            console.log(' ' + i + ': (' + this.nodes[i].x + ', ' + this.nodes[i].y + ')');
        }
        console.log("\nEdges:\n" + this.edges.length + ")");
        for (var i = 0; i < this.edges.length; i++) {
            console.log(' ' + i + ': (' + this.edges[i].node[0] + ' -- ' + this.edges[i].node[1] + ')');
        }
    };
    return PlanarGraph;
}(Graph));
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//
//                            2D ALGORITHMS
//
// if points are all collinear
// checks if point lies on line segment 'ab'
function onSegment(a, point, b) {
    if (point.x <= Math.max(a.x, b.x) && point.x >= Math.min(a.x, b.x) &&
        point.y <= Math.max(a.y, b.y) && point.y >= Math.min(a.y, b.y)) {
        return true;
    }
    return false;
}
function rayLineSegmentIntersectionAlgorithm(rayOrigin, rayDirection, point1, point2) {
    var v1 = new XYPoint(rayOrigin.x - point1.x, rayOrigin.y - point1.y);
    var v2 = new XYPoint(point2.x - point1.x, point2.y - point1.y);
    var v3 = new XYPoint(-rayDirection.y, rayDirection.x);
    var dot = v2.x * v3.x + v2.y * v3.y;
    if (Math.abs(dot) < EPSILON)
        return undefined;
    var cross = (v2.x * v1.y - v2.y * v1.x);
    var t1 = cross / dot;
    var t2 = (v1.x * v3.x + v1.y * v3.y) / dot;
    if (t1 >= 0.0 && (t2 >= 0.0 && t2 <= 1.0)) {
        return new XYPoint(rayOrigin.x + rayDirection.x * t1, rayOrigin.y + rayDirection.y * t1);
        //return t1;
    }
    return null;
}
function lineSegmentIntersectionAlgorithm(p0, p1, p2, p3) {
    // p0-p1 is first line
    // p2-p3 is second line
    var rise1 = (p1.y - p0.y);
    var run1 = (p1.x - p0.x);
    var rise2 = (p3.y - p2.y);
    var run2 = (p3.x - p2.x);
    var slope1 = rise1 / run1;
    var slope2 = rise2 / run2;
    // if lines are parallel to each other within a floating point error
    if (Math.abs(slope1) == Infinity && Math.abs(slope2) > SLOPE_ANGLE_INF_EPSILON)
        return undefined;
    if (Math.abs(slope2) == Infinity && Math.abs(slope1) > SLOPE_ANGLE_INF_EPSILON)
        return undefined;
    var angle1 = Math.atan(slope1);
    var angle2 = Math.atan(slope2);
    if (Math.abs(angle1 - angle2) < SLOPE_ANGLE_EPSILON)
        return undefined;
    var denom = run1 * rise2 - run2 * rise1;
    if (denom == 0)
        return undefined; // Collinear
    var denomPositive = false;
    if (denom > 0)
        denomPositive = true;
    var s02 = { 'x': p0.x - p2.x, 'y': p0.y - p2.y };
    // var s02 = new XYPoint(p0.x - p2.x, p0.y - p2.y);
    var s_numer = run1 * s02.y - rise1 * s02.x;
    if ((s_numer < 0) == denomPositive)
        return undefined; // No collision
    var t_numer = run2 * s02.y - rise2 * s02.x;
    if ((t_numer < 0) == denomPositive)
        return undefined; // No collision
    if (((s_numer > denom) == denomPositive) || ((t_numer > denom) == denomPositive))
        return undefined; // No collision
    // Collision detected
    var t = t_numer / denom;
    // var i = {'x':(p0.x + (t * run1)), 'y':(p0.y + (t * rise1))};
    // return i;
    return new XYPoint(p0.x + (t * run1), p0.y + (t * rise1));
}
function minDistBetweenPointLine(a, b, x, y) {
    // (a)-(b) define the line
    // x,y is the point
    var p = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    var u = ((x - a.x) * (b.x - a.x) + (y - a.y) * (b.y - a.y)) / (Math.pow(p, 2));
    if (u < 0 || u > 1.0)
        return undefined;
    return new XYPoint(a.x + u * (b.x - a.x), a.y + u * (b.y - a.y));
}
