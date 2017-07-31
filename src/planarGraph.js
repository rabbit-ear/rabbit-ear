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
var EPSILON_HIGH = 0.00001;
var USER_TAP_EPSILON = 0.01;
var SLOPE_ANGLE_PLACES = 2.5;
var SLOPE_ANGLE_EPSILON = 1 * Math.pow(10, -SLOPE_ANGLE_PLACES);
var SLOPE_ANGLE_INF_EPSILON = 1 * Math.pow(10, SLOPE_ANGLE_PLACES);
// this graph represents an origami crease pattern
//    with creases (edges) defined by their endpoints (vertices)
function epsilonEqual(a, b, epsilon) {
    if (epsilon == undefined) {
        epsilon = EPSILON_HIGH;
    }
    return (a - epsilon < b && a + epsilon > b);
}
var XYPoint = (function () {
    function XYPoint(xx, yy) {
        this.x = xx;
        this.y = yy;
    }
    XYPoint.prototype.Dot = function (point) { return this.x * point.x + this.y * point.y; };
    XYPoint.prototype.Cross = function (vector) { return this.x * vector.y - this.y * vector.x; };
    XYPoint.prototype.Mag = function () { return Math.sqrt(this.x * this.x + this.y * this.y); };
    XYPoint.prototype.Rotate90 = function () { return new XYPoint(-this.y, this.x); };
    XYPoint.prototype.Normalize = function () { var m = this.Mag(); return new XYPoint(this.x / m, this.y / m); };
    XYPoint.prototype.Equivalent = function (point) {
        return (epsilonEqual(this.x, point.x) && epsilonEqual(this.y, point.y));
    };
    return XYPoint;
}());
// class Intersection extends XYPoint{
// 	// intersection of 2 edges - contains 1 intersection point, 2 edges, 4 nodes (2 edge 2 endpoints)
// 	exists:boolean;  // t/f intersection exists
// 	edges:[PlanarEdge, PlanarEdge];
// 	nodes:[PlanarNode, PlanarNode, PlanarNode, PlanarNode];
// 	constructor(a:PlanarEdge, b:PlanarEdge){
// 		super(undefined, undefined);  // to be set later, if intersection exists
// 		this.exists = false;
// 		if(a.isAdjacentToEdge(b) || a.isSimilarToEdge(b)){ return this; }
// 		var aPts:PlanarNode[] = a.endPoints();
// 		var bPts:PlanarNode[] = b.endPoints();
// 		var intersect = lineSegmentIntersectionAlgorithm(aPts[0], aPts[1], bPts[0], bPts[1]);
// 		if(intersect == undefined){ return this; }
// 		this.x = intersect.x;
// 		this.y = intersect.y;
// 		this.edges = [a,b];
// 		this.nodes = [aPts[0], aPts[1], bPts[0], bPts[1]];
// 		this.exists = true;
// 	}
// }
var PlanarPair = (function () {
    function PlanarPair(parent, node, edge) {
        this.node = node;
        this.angle = Math.atan2(node.y - parent.y, node.x - parent.x);
        this.edge = edge;
    }
    return PlanarPair;
}());
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
    // implements XYPoint
    PlanarNode.prototype.Dot = function (point) { return this.x * point.x + this.y * point.y; };
    PlanarNode.prototype.Cross = function (vector) { return this.x * vector.y - this.y * vector.x; };
    PlanarNode.prototype.Rotate90 = function () { return new XYPoint(-this.y, this.x); };
    PlanarNode.prototype.Mag = function () { return Math.sqrt(this.x * this.x + this.y * this.y); };
    PlanarNode.prototype.Normalize = function () { var m = this.Mag(); return new XYPoint(this.x / m, this.y / m); };
    PlanarNode.prototype.Equivalent = function (point) {
        return (epsilonEqual(this.x, point.x) && epsilonEqual(this.y, point.y));
    };
    PlanarNode.prototype.adjacentNodes = function () {
        return _super.prototype.adjacentNodes.call(this);
    };
    PlanarNode.prototype.adjacentEdges = function () {
        return _super.prototype.adjacentEdges.call(this);
    };
    PlanarNode.prototype.adjacentFaces = function () {
        var adjacentFaces = [];
        var homeAdjacencyArray = this.planarAdjacent();
        for (var n = 0; n < homeAdjacencyArray.length; n++) {
            var thisFace = new PlanarFace();
            var invalidFace = false;
            var angleSum = 0;
            thisFace.nodes = [this];
            var a2b;
            var a;
            var b = this;
            var b2c = homeAdjacencyArray[n];
            var c = b2c.node;
            do {
                if (c === a) {
                    invalidFace = true;
                    break;
                } // this shouldn't be needed if graph is clean
                thisFace.nodes.push(c);
                thisFace.edges.push(b2c.edge);
                // increment, step forward
                a = b;
                b = c;
                a2b = b2c;
                b2c = b.adjacentNodeClockwiseFrom(a);
                c = b2c.node;
                angleSum += clockwiseAngleFrom(a2b.angle, b2c.angle - Math.PI);
            } while (c !== this);
            // close off triangle
            thisFace.edges.push(b2c.edge);
            // find interior angle from left off to the original point
            var c2a = this.adjacentNodeClockwiseFrom(b);
            angleSum += clockwiseAngleFrom(b2c.angle, c2a.angle - Math.PI);
            // add face if valid
            if (!invalidFace && thisFace.nodes.length > 2) {
                // sum of interior angles rule, (n-2) * PI
                var polygonAngle = angleSum / (thisFace.nodes.length - 2);
                if (polygonAngle - EPSILON <= Math.PI && polygonAngle + EPSILON >= Math.PI) {
                    adjacentFaces.push(thisFace);
                }
            }
        }
        return adjacentFaces;
    };
    //      D  G
    //      | /
    //      |/
    //     this---Q
    //     / \
    //    /   \
    //   P     S
    //  clockwise neighbor around:(this), from node:(Q) will give you (S)
    PlanarNode.prototype.adjacentNodeClockwiseFrom = function (node) {
        var adjacentNodes = this.planarAdjacent();
        for (var i = 0; i < adjacentNodes.length; i++) {
            if (adjacentNodes[i].node === node) {
                var index = ((i + 1) % adjacentNodes.length);
                return adjacentNodes[index];
            }
        }
        // return undefined;
        throw "adjacentNodeClockwiseFrom() fromNode was not found adjacent to the specified node";
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
var EdgeIntersection = (function () {
    function EdgeIntersection(otherEdge, intersectionX, intersectionY) {
        this.edge = otherEdge;
        this.x = intersectionX;
        this.y = intersectionY;
    }
    return EdgeIntersection;
}());
var PlanarEdge = (function (_super) {
    __extends(PlanarEdge, _super);
    function PlanarEdge() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // convenience renaming
    // endPoints:()=>PlanarNode[] = function() { return this.adjacentNodes(); };
    // actually asking for more typecasting than i expected
    PlanarEdge.prototype.endPoints = function () {
        return [this.node[0], this.node[1]];
    };
    PlanarEdge.prototype.adjacentNodes = function () {
        return _super.prototype.adjacentNodes.call(this);
    };
    PlanarEdge.prototype.adjacentEdges = function () {
        return _super.prototype.adjacentEdges.call(this);
    };
    PlanarEdge.prototype.intersection = function (edge) {
        if (this.isAdjacentToEdge(edge)) {
            return undefined;
        }
        var intersect = lineSegmentIntersectionAlgorithm(this.node[0], this.node[1], edge.node[0], edge.node[1]);
        if (intersect == undefined) {
            return undefined;
        }
        if (intersect.Equivalent(this.node[0]) || intersect.Equivalent(this.node[1])) {
            return undefined;
        }
        // console.log(this.node[0].x + "," + this.node[0].y + ":" + this.node[1].x + "," + this.node[1].y + " and " + edge.node[0].x + "," + edge.node[0].y + ":" + edge.node[1].x + "," + edge.node[1].y + "  =  " + intersect.x + "," + intersect.y);
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
    return PlanarEdge;
}(GraphEdge));
var PlanarFace = (function () {
    // angles:number[];  // optional, maybe delete someday
    function PlanarFace() {
        this.nodes = [];
        this.edges = [];
        // this.angles = [];
    }
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
    // converts node objects into array of arrays notation [0]=x [1]=y
    PlanarGraph.prototype.nodesArray = function () { return this.nodes.map(function (el) { return [el.x, el.y]; }); };
    ///////////////////////////////////////////////
    // ADD PARTS
    ///////////////////////////////////////////////
    // newNode(x:number, y:number):PlanarNode {
    // 	return this.addNode(new PlanarNode(x, y));
    // }
    PlanarGraph.prototype.newEdge = function (node1, node2) {
        return this.addEdge(new PlanarEdge(node1, node2));
    };
    PlanarGraph.prototype.addNode = function (node) {
        if (node == undefined) {
            throw "addNode() requires an argument: 1 GraphNode";
        }
        node.graph = this;
        node.index = this.nodes.length;
        this.nodes.push(node);
        return node;
    };
    PlanarGraph.prototype.addEdge = function (edge) {
        // todo, make sure graph edge is valid
        // if(edge.node[0] >= this.nodes.length || edge.node[1] >= this.nodes.length ){ throw "addEdge() node indices greater than array length"; }
        edge.graph = this;
        edge.index = this.edges.length;
        this.edges.push(edge);
        return edge;
    };
    PlanarGraph.prototype.addEdgeWithVertices = function (x1, y1, x2, y2) {
        var a = this.addNode(new PlanarNode(x1, y1));
        var b = this.addNode(new PlanarNode(x2, y2));
        return this.newEdge(a, b);
    };
    PlanarGraph.prototype.addEdgeFromVertex = function (existingNode, newX, newY) {
        var node = this.addNode(new PlanarNode(newX, newY));
        return this.newEdge(existingNode, node);
    };
    PlanarGraph.prototype.addEdgeFromExistingVertices = function (a, b) {
        return this.newEdge(a, b);
    };
    PlanarGraph.prototype.addEdgeRadiallyFromVertex = function (existingNode, angle, distance) {
        var newX = existingNode.x + Math.cos(angle) * distance;
        var newY = existingNode.y + Math.sin(angle) * distance;
        return this.addEdgeFromVertex(existingNode, newX, newY);
        // this.changedNodes( [existingIndex, this.nodes.length-1] );
    };
    PlanarGraph.prototype.addFaceBetweenNodes = function (nodeArray) {
        if (nodeArray.length == 0)
            return;
        var edgeArray = [];
        for (var i = 0; i < nodeArray.length; i++) {
            var nextI = (i + 1) % nodeArray.length;
            var thisEdge = this.getEdgeConnectingNodes(nodeArray[i], nodeArray[nextI]);
            if (thisEdge == undefined) {
                console.log("creating edge to make face between nodes " + nodeArray[i] + ' ' + nodeArray[nextI]);
                thisEdge = this.newEdge(nodeArray[i], nodeArray[nextI]);
            }
            edgeArray.push(thisEdge);
        }
        var face = new PlanarFace();
        face.edges = edgeArray;
        face.nodes = nodeArray;
        this.faces.push(face);
    };
    ///////////////////////////////////////////////
    // REMOVE PARTS
    ///////////////////////////////////////////////
    PlanarGraph.prototype.clear = function () {
        _super.prototype.clear.call(this); // clears out nodes[] and edges[]
        this.faces = [];
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
        // console.log("PLANAR GRAPH clean()");
        var graphResult = _super.prototype.clean.call(this); //{'duplicate':countDuplicate, 'circular': countCircular};
        // console.log("merging duplicate vertices");
        var result = this.mergeDuplicateVertices();
        //todo: i think i need to run graph.clean() again
        // var graphResult = super.clean();
        Object.assign(graphResult, result);
        return graphResult;
    };
    ////////////////////////////////////
    //  POSITIONAL CALCULATION
    ////////////////////////////////////
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
    PlanarGraph.prototype.searchAndMergeOneDuplicatePair = function (epsilon) {
        for (var i = 0; i < this.nodes.length - 1; i++) {
            for (var j = i + 1; j < this.nodes.length; j++) {
                if (this.verticesEquivalent(this.nodes[i], this.nodes[j], epsilon)) {
                    _super.prototype.mergeNodes.call(this, this.nodes[i], this.nodes[j]);
                    return true;
                }
            }
        }
        return false;
    };
    PlanarGraph.prototype.mergeDuplicateVertices = function (epsilon) {
        if (epsilon == undefined) {
            epsilon = EPSILON;
        }
        var count = 0;
        while (this.searchAndMergeOneDuplicatePair(epsilon)) {
            count += 1;
        }
        ;
        return count;
    };
    PlanarGraph.prototype.mergeCollinearLines = function (epsilon) {
        //gather all lines collinear to this one line
        // gather all the collinear points, remove all edges between all of them
        // but leave the nodes
        // sort the nodes by this:
        // nodeArray
        // 	.sort(function(a,b){if(a.x<b.x){return -1;}if(a.x>b.x){return 1;}return 0;})
        // 	.sort(function(a,b){if(a.y<b.y){return -1;}if(a.y>b.y){return 1;}return 0;});
        // add edges back onto the line
    };
    PlanarGraph.prototype.clearUnusedCollinearNodes = function () {
        // remove all nodes separating two collinear lines
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
        // for (x,y) that is not orthogonal to the length of the edge (past the endpoint)
        // check distance to node endpoints
        for (var i = 0; i < this.nodes.length; i++) {
            var dist = Math.sqrt(Math.pow(this.nodes[i].x - x, 2) + Math.pow(this.nodes[i].y - y, 2));
            if (dist < minDist) {
                var adjEdges = this.nodes[i].adjacentEdges();
                if (adjEdges != undefined && adjEdges.length > 0) {
                    minDist = dist;
                    minDistIndex = adjEdges[0].index;
                    minLocation = { x: this.nodes[i].x, y: this.nodes[i].y };
                }
            }
        }
        return { 'edge': minDistIndex, 'location': minLocation, 'distance': minDist };
    };
    ///////////////////////////////////////////////////////////////
    // CALCULATIONS
    PlanarGraph.prototype.interiorAngle3Nodes = function (centerNode, node1, node2) {
        var adjacentEdges = centerNode.planarAdjacent();
        console.log(adjacentEdges);
        return 0;
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
    // getEdgeIntersectionsWithEdge(edgeIndex):Intersection[]{
    // 	if(edgeIndex >= this.edges.length){ throw "getEdgeIntersectionsWithEdge() edge index larger than edge array"; }
    // 	var intersections:Intersection[] = [];
    // 	for(var i = 0; i < this.edges.length; i++){
    // 		if(edgeIndex != i){
    // 			var intersection = new Intersection(this.edges[edgeIndex], this.edges[i]);
    // 			if(intersection.exists){ intersections.push(intersection); }
    // 		}
    // 	}
    // 	return intersections;
    // }
    // getAllEdgeIntersections():Intersection[]{
    // 	var intersections:Intersection[] = [];
    // 	for(var i = 0; i < this.edges.length-1; i++){
    // 		for(var j = i+1; j < this.edges.length; j++){
    // 			var intersection = new Intersection(this.edges[i], this.edges[j]);
    // 			if(intersection.exists){ intersections.push(intersection); }
    // 		}
    // 	}
    // 	return intersections;
    // }
    // returns the first intersection it finds, otherwise returns undefined
    // anyEdgeCrossings():Intersection{
    // 	for(var i = 0; i < this.edges.length-1; i++){
    // 		for(var j = i+1; j < this.edges.length; j++){
    // 			var intersection = new Intersection(this.edges[i], this.edges[j]);
    // 			if(intersection.exists == true){
    // 				return intersection; 
    // 			}
    // 		}
    // 	}
    // 	return undefined;
    // }
    PlanarGraph.prototype.chopAllCrossingsWithEdge = function (edge) {
        var intersections = edge.crossingEdges();
        // console.log(intersections)
        if (intersections.length === 0) {
            return [];
        }
        // console.log("proceding to resolve " + intersections.length + " crossings");
        // for(var i = 0; i < intersections.length; i++){console.log(i + ": " + intersections[i].x + " " + intersections[i].y);}
        var endNodes = edge.node.sort(function (a, b) {
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
        // step down the intersections, rebuild edges in order
        var newLineNodes = [];
        for (var i = 0; i < intersections.length; i++) {
            if (intersections[i] != undefined) {
                this.removeEdge(intersections[i].edge);
                var newNode = this.addNode(new PlanarNode(intersections[i].x, intersections[i].y));
                this.newEdge(intersections[i].edge.node[0], newNode);
                this.newEdge(newNode, intersections[i].edge.node[1]);
                newLineNodes.push(newNode);
            }
        }
        // remove the edge
        _super.prototype.removeEdge.call(this, edge);
        this.newEdge(endNodes[0], newLineNodes[0]);
        for (var i = 0; i < newLineNodes.length - 1; i++) {
            this.newEdge(newLineNodes[i], newLineNodes[i + 1]);
        }
        this.newEdge(newLineNodes[newLineNodes.length - 1], endNodes[1]);
        _super.prototype.clean.call(this);
        return intersections.map(function (el) { return new XYPoint(el.x, el.y); });
    };
    // chopEdgesWithIntersection(intersection:Intersection){
    // 	if(intersection == undefined) return;
    // 	this.removeEdgesBetween(intersection.nodes[0], intersection.nodes[1]);
    // 	this.removeEdgesBetween(intersection.nodes[2], intersection.nodes[3]);
    // 	var centerNode = this.addNode(new PlanarNode(intersection.x, intersection.y));
    // 	this.newEdge(centerNode, intersection.nodes[0]);
    // 	this.newEdge(centerNode, intersection.nodes[1]);
    // 	this.newEdge(centerNode, intersection.nodes[2]);
    // 	this.newEdge(centerNode, intersection.nodes[3]);
    // 	this.mergeDuplicateVertices();
    // }
    PlanarGraph.prototype.chop = function () {
        var crossings = [];
        // var max = this.edges.length;
        for (var i = 0; i < this.edges.length; i++) {
            // console.log("chop " + i);
            crossings = crossings.concat(this.chopAllCrossingsWithEdge(this.edges[i]));
            this.clean();
        }
        // todo: crossings sometimes has duplicate points, either clean it up here,
        //       or something can be improved about the algorithm
        return crossings;
    };
    // chopOld(){
    // 	// var intersectionPoints = new PlanarGraph();
    // 	var allIntersections = [];  // keep a running total of all the intersection points
    // 	for(var i = 0; i < this.edges.length; i++){
    // 		console.log("edge " + i);
    // 		console.log(this.edges[i].endPoints()[0].x + " " + this.edges[i].endPoints()[0].y);
    // 		var edgeCrossings:Intersection[] = this.getEdgeIntersectionsWithEdge(i);
    // 		if(edgeCrossings != undefined && edgeCrossings.length > 0){
    // 			console.log(i + ": # crossings" + edgeCrossings.length);
    // 			allIntersections = allIntersections.concat(edgeCrossings);
    // 		}
    // 		while(edgeCrossings.length > 0){
    // 			var newIntersectionIndex = this.nodes.length;
    // 			this.addNode(new PlanarNode(edgeCrossings[0].x, edgeCrossings[0].y));
    // 			// this.addNode({'x':edgeCrossings[0].x, 'y':edgeCrossings[0].y});
    // 			this.newEdge(this.nodes[this.nodes.length-1], edgeCrossings[0].nodes[0]);
    // 			this.newEdge(this.nodes[this.nodes.length-1], edgeCrossings[0].nodes[1]);
    // 			this.newEdge(this.nodes[this.nodes.length-1], edgeCrossings[0].nodes[2]);
    // 			this.newEdge(this.nodes[this.nodes.length-1], edgeCrossings[0].nodes[3]);
    // 			this.removeEdgesBetween(edgeCrossings[0].nodes[0], edgeCrossings[0].nodes[1]);
    // 			this.removeEdgesBetween(edgeCrossings[0].nodes[2], edgeCrossings[0].nodes[3]);
    // 			edgeCrossings = this.getEdgeIntersectionsWithEdge(i);
    // 			// add intersections to array
    // 			allIntersections = allIntersections.concat(edgeCrossings);
    // 			// intersectionPoints.addNodes(edgeCrossings);
    // 			this.clean();
    // 		}
    // 	}
    // 	// return allIntersections;
    // 	// return a unique array of all intersection points
    // 	var pg = new PlanarGraph();  // creating a object inside of the object def itself?..
    // 	pg.nodes = allIntersections;
    // 	pg.mergeDuplicateVertices();
    // 	return pg.nodes;
    // }
    ///////////////////////////////////////////////////////////////
    // FACE
    PlanarGraph.prototype.generateFaces = function () {
        var faces = [];
        for (var i = 0; i < this.nodes.length; i++) {
            var thisNode = this.nodes[i];
            var adjacentFaces = [];
            var homeAdjacencyArray = thisNode.planarAdjacent();
            for (var n = 0; n < homeAdjacencyArray.length; n++) {
                var thisFace = new PlanarFace();
                var invalidFace = false;
                var angleSum = 0;
                thisFace.nodes = [thisNode];
                var a2b;
                var a;
                var b = thisNode;
                var b2c = homeAdjacencyArray[n];
                var c = b2c.node;
                do {
                    if (c === a) {
                        invalidFace = true;
                        break;
                    } // this shouldn't be needed if graph is clean
                    thisFace.nodes.push(c);
                    thisFace.edges.push(b2c.edge);
                    // increment, step forward
                    a = b;
                    b = c;
                    a2b = b2c;
                    b2c = b.adjacentNodeClockwiseFrom(a);
                    c = b2c.node;
                    angleSum += clockwiseAngleFrom(a2b.angle, b2c.angle - Math.PI);
                } while (c !== thisNode);
                // close off triangle
                thisFace.edges.push(b2c.edge);
                // find interior angle from left off to the original point
                if (thisNode === b) {
                    invalidFace = true;
                } // this is consistently happening with one of the paper corner vertices
                else {
                    var c2a = thisNode.adjacentNodeClockwiseFrom(b);
                    angleSum += clockwiseAngleFrom(b2c.angle, c2a.angle - Math.PI);
                }
                // add face if valid
                if (!invalidFace && thisFace.nodes.length > 2) {
                    // sum of interior angles rule, (n-2) * PI
                    var polygonAngle = angleSum / (thisFace.nodes.length - 2);
                    if (polygonAngle - EPSILON <= Math.PI && polygonAngle + EPSILON >= Math.PI) {
                        adjacentFaces.push(thisFace);
                    }
                }
            }
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
    };
    /*generateFaces(){
        // walk around a face
        this.faces = [];
        for(var startIndex = 0; startIndex < this.nodes.length; startIndex++){
            // from a starting node, get all of its nodes/edges clockwise around it
            var startNodeAdjacent = this.nodes[startIndex].planarAdjacent();
            for(var n = 0; n < startNodeAdjacent.length; n++){
                // from the start node, venture off in every connected node direction, attempt to make a face
                var adjacentPair:PlanarPair = startNodeAdjacent[n];
                var currentNode = adjacentPair.node;
                // attempt to build a face, add first 2 points and connecting edge
                var theFace = new PlanarFace();
                theFace.nodes = [ this.nodes[startIndex], currentNode ];
                theFace.edges = [ adjacentPair.edge ];
                var validFace = true;
                while(validFace && currentNode.index != startIndex){
                    // travel down edges, select the most immediately-clockwise connected node
                    // this requires to get the node we just came from
                    var fromNode = theFace.nodes[ theFace.nodes.length-2 ];
                    // step forwar down the next edge
                    currentNode = this.getClockwiseNeighborAround( currentNode, fromNode );
                    // check if we have reached the beginning again, if the face is complete
                    if(currentNode == undefined){ validFace = false;} // something weird is going on
                    else {
                        if(currentNode === fromNode){ validFace = false; }
                        else{
                            if(currentNode.index != startIndex){
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

                if(validFace && !this.arrayContainsDuplicates(theFace)){
                    // theFace['angle'] = totalAngle;
                    this.faces.push(theFace);
                }
            }
        }

        // remove duplicate faces
        var i = 0;
        while(i < this.faces.length-1){
            var j = this.faces.length-1;
            while(j > i){
                if(this.areFacesEquivalent(i, j)){
                    this.faces.splice(j, 1);
                }
                j--;
            }
            i++;
        }
    }*/
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
            var a = this.edges[i].node[0];
            var b = this.edges[i].node[1];
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
    PlanarGraph.prototype.log = function (detailed) {
        _super.prototype.log.call(this, detailed);
        for (var i = 0; i < this.nodes.length; i++) {
            console.log(' ' + i + ': (' + this.nodes[i].x + ', ' + this.nodes[i].y + ')');
        }
        for (var i = 0; i < this.edges.length; i++) {
            console.log(' ' + i + ': (' + this.edges[i].node[0].index + ' -- ' + this.edges[i].node[1].index + ')');
        }
    };
    return PlanarGraph;
}(Graph));
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//
//                            2D ALGORITHMS
//
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
    // if (point.x <= Math.max(a.x, b.x) && point.x >= Math.min(a.x, b.x) &&
    // 	point.y <= Math.max(a.y, b.y) && point.y >= Math.min(a.y, b.y)){
    // 	return true;
    // }
    // return false;
    var ab = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    var pa = Math.sqrt(Math.pow(point.x - a.x, 2) + Math.pow(point.y - a.y, 2));
    var pb = Math.sqrt(Math.pow(point.x - b.x, 2) + Math.pow(point.y - b.y, 2));
    if (Math.abs(ab - (pa + pb)) < EPSILON)
        return true;
    return false;
}
function rayLineSegmentIntersectionAlgorithm(rayOrigin, rayDirection, point1, point2) {
    var v1 = new XYPoint(rayOrigin.x - point1.x, rayOrigin.y - point1.y);
    var vLineSeg = new XYPoint(point2.x - point1.x, point2.y - point1.y);
    var vRayPerp = new XYPoint(-rayDirection.y, rayDirection.x);
    var dot = vLineSeg.x * vRayPerp.x + vLineSeg.y * vRayPerp.y;
    if (Math.abs(dot) < EPSILON)
        return undefined;
    var cross = (vLineSeg.x * v1.y - vLineSeg.y * v1.x);
    var t1 = cross / dot;
    var t2 = (v1.x * vRayPerp.x + v1.y * vRayPerp.y) / dot;
    if (t1 >= 0.0 && (t2 >= 0.0 && t2 <= 1.0)) {
        return new XYPoint(rayOrigin.x + rayDirection.x * t1, rayOrigin.y + rayDirection.y * t1);
        //return t1;
    }
    return undefined;
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
    // return XYPoint((l1.d * l2.u.y - l2.d * l1.u.y) / denom, (l2.d * l1.u.x - l1.d * l2.u.x) / denom);
    var s02 = { 'x': p0.x - p2.x, 'y': p0.y - p2.y };
    var t = (run2 * s02.y - rise2 * s02.x) / denom;
    return new XYPoint(p0.x + (t * run1), p0.y + (t * rise1));
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
    var s_numer = run1 * s02.y - rise1 * s02.x;
    if ((s_numer < 0) == denomPositive)
        return undefined; // No collision
    var t_numer = run2 * s02.y - rise2 * s02.x;
    if ((t_numer < 0) == denomPositive)
        return undefined; // No collision
    // if(!epsilonEqual(s_numer, denom) && !epsilonEqual(t_numer, denom)){ // ! (point exists on line)
    if (((s_numer > denom) == denomPositive) || ((t_numer > denom) == denomPositive))
        return undefined; // No collision
    // }
    // Collision detected
    var t = t_numer / denom;
    // var i = {'x':(p0.x + (t * run1)), 'y':(p0.y + (t * rise1))};
    // return i;
    return new XYPoint(p0.x + (t * run1), p0.y + (t * rise1));
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
        intersections.push(new XYPoint(x1 + center.x, y1 + center.y));
    }
    if (!isNaN(x2)) {
        intersections.push(new XYPoint(x2 + center.x, y2 + center.y));
    }
    return intersections;
}
function linesParallel(p0, p1, p2, p3) {
    // p0-p1 is first line
    // p2-p3 is second line
    var u = new XYPoint(p1.x - p0.x, p1.y - p0.y);
    var v = new XYPoint(p3.x - p2.x, p3.y - p2.y);
    return (Math.abs(u.Dot(v.Rotate90())) < EPSILON);
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
