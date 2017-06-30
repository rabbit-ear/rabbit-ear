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
var EdgeNodeAngle = (function (_super) {
    __extends(EdgeNodeAngle, _super);
    function EdgeNodeAngle(e, n, a) {
        var _this = _super.call(this, e, n) || this;
        _this.edge = e;
        _this.node = n;
        _this.angle = a;
        return _this;
    }
    return EdgeNodeAngle;
}(EdgeAndNode));
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
            var thisEdge = this.getEdgeConnectingNodes(nodeArray[i], nodeArray[nextI]);
            if (thisEdge == undefined) {
                console.log("creating edge to make face between nodes " + nodeArray[i] + ' ' + nodeArray[nextI]);
                thisEdge = this.addEdgeFromExistingVertices(nodeArray[i], nodeArray[nextI]);
            }
            edgeArray.push(thisEdge);
        }
        var face = new PlanarFace();
        face.edges = edgeArray;
        face.nodes = nodeArray;
        this.faces.push(face);
    };
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //
    //  2.
    //  CLEAN  /  REFRESH COMPONENTS
    // quick and easy, use a square bounding box
    PlanarGraph.prototype.verticesEquivalent = function (v1, v2, epsilon) {
        return (v1.x - epsilon < v2.x && v1.x + epsilon > v2.x &&
            v1.y - epsilon < v2.y && v1.y + epsilon > v2.y);
    };
    // verticesEquivalent(x1, y1, x2, y2, float epsilon){  // float type
    // 	return (x1 - epsilon < x2 && x1 + epsilon > x2 &&
    // 			y1 - epsilon < y2 && y1 + epsilon > y2);
    // } 
    PlanarGraph.prototype.clean = function () {
        var graphResult = _super.prototype.clean.call(this); //{'duplicate':countDuplicate, 'circular': countCircular};
        var result = this.mergeDuplicateVertices();
        Object.assign(graphResult, result);
        return graphResult;
    };
    // changedNodes(nodeArray){
    // 	var adjacent = [];
    // 	for(var i = 0; i < nodeArray.length; i++){
    // 		adjacent = adjacent.concat( this.getNodesAdjacentToNode(nodeArray[i]) );
    // 	}
    // 	//make list unique
    // 	var unique = [...new Set(adjacent)]; 
    // 	for(var i = 0; i < unique.length; i++){
    // 		this.refreshAdjacencyAtNode(i);
    // 	}
    // }
    ///////////////////////////////////
    // Graph-related (non-positional)
    PlanarGraph.prototype.nodeAdjacentEdgesWithDetails = function (nodeIndex) {
        var adjacentEdges = [];
        var adjacentEdgeObjects = this.nodes[nodeIndex].adjacentEdges();
        for (var i = 0; i < adjacentEdgeObjects.length; i++) {
            // find other 
            var node0 = adjacentEdgeObjects[i].node[0];
            var node1 = adjacentEdgeObjects[i].node[1];
            var edgesOtherNode = undefined;
            if (node0 == nodeIndex) {
                edgesOtherNode = node1;
            }
            if (node1 == nodeIndex) {
                edgesOtherNode = node0;
            }
            if (edgesOtherNode != undefined) {
                var dx = this.nodes[edgesOtherNode].x - this.nodes[nodeIndex].x;
                var dy = this.nodes[edgesOtherNode].y - this.nodes[nodeIndex].y;
                var edgeAngle = Math.atan2(dy, dx);
                // could add a distance property here too
                adjacentEdges.push(new EdgeNodeAngle(adjacentEdgeObjects[i].index, edgesOtherNode, edgeAngle));
            }
        }
        return adjacentEdges;
    };
    // refreshAdjacencyAtNode(nodeIndex:number){
    // 	///////// EDGES
    // 	// get indices of all connected edges
    // 	// var adjacentEdgeIndices = this.getEdgesAdjacentToNode(nodeIndex);
    // 	var adjacentEdgeIndices = this.nodes[nodeIndex].adjacentEdges();
    // 	var adjacentEdges:EdgeNodeAngle[] = [];
    // 	for(var i = 0; i < adjacentEdgeIndices.length; i++){
    // 		// find other 
    // 		var node0 = this.edges[ adjacentEdgeIndices[i] ].node[0];
    // 		var node1 = this.edges[ adjacentEdgeIndices[i] ].node[1];
    // 		var edgesOtherNode = undefined
    // 		if(node0 == nodeIndex){ edgesOtherNode = node1; }
    // 		if(node1 == nodeIndex){ edgesOtherNode = node0; }
    // 		if(edgesOtherNode != undefined){
    // 			var dx = this.nodes[edgesOtherNode].x - this.nodes[nodeIndex].x;
    // 			var dy = this.nodes[edgesOtherNode].y - this.nodes[nodeIndex].y;
    // 			var edgeAngle = Math.atan2(dy, dx);
    // 			// could add a distance property here too
    // 			adjacentEdges.push( new EdgeNodeAngle(adjacentEdgeIndices[i], edgesOtherNode, edgeAngle) );
    // 		}
    // 	}
    // 	///////// NODES
    // 	var adjacentNodeIndices = this.getNodesAdjacentToNode(nodeIndex);
    // 	var adjacentNodes:EdgeNodeAngle[] = [];
    // 	for(var i = 0; i < adjacentNodeIndices.length; i++){
    // 		var nodesOtherNode = adjacentNodeIndices[i];
    // 		var nodesEdge = this.getEdgeConnectingNodes(nodeIndex, nodesOtherNode);
    // 		var dx = this.nodes[nodesOtherNode].x - this.nodes[nodeIndex].x;
    // 		var dy = this.nodes[nodesOtherNode].y - this.nodes[nodeIndex].y;
    // 		var edgeAngle = Math.atan2(dy, dx);
    // 		adjacentNodes.push( new EdgeNodeAngle(nodesEdge, nodesOtherNode, edgeAngle) );
    // 	}
    // 	this.nodes[nodeIndex].adjacent = {'nodes': adjacentNodes, 'edges': adjacentEdges};
    // }
    // refreshAdjacencies(){
    // 	for(var i = 0; i < this.nodes.length; i++){
    // 		this.refreshAdjacencyAtNode(i);
    // 	}
    // }
    PlanarGraph.prototype.getClockwiseNeighborAround = function (node, fromNode) {
        var array = this.nodes[node]['adjacent']['edges'];
        for (var i = 0; i < array.length; i++) {
            if (array[i]['node'] == fromNode) {
                var index = ((i + 1) % array.length);
                return array[index];
            }
        }
        return undefined;
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
    //////////////////////////////
    // position vicinity related
    PlanarGraph.prototype.mergeDuplicateVertices = function () {
        // DANGEROUS: removes nodes
        // this looks for nodes.position which are physically nearby, within EPSILON radius
        var removeCatalog = [];
        for (var i = 0; i < this.nodes.length - 1; i++) {
            for (var j = this.nodes.length - 1; j > i; j--) {
                if (this.verticesEquivalent(this.nodes[i], this.nodes[j], EPSILON)) {
                    _super.prototype.mergeNodes.call(this, i, j);
                    removeCatalog.push({ 'x': this.nodes[i].x, 'y': this.nodes[i].y, 'nodes': [i, j] });
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
            var p1 = this.nodes[this.edges[i].node[0]];
            var p2 = this.nodes[this.edges[i].node[1]];
            var pT = minDistBetweenPointLine(p1, p2, x, y);
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
    // splitAtIntersections(){
    // chop(){
    // 	var intersectionPoints = new PlanarGraph();
    // 	// var allIntersections = [];
    // 	for(var i = 0; i < this.edges.length; i++){
    // 		var intersections = this.getEdgeIntersectionsWithEdge(i);
    // 		if(intersections != undefined && intersections.length > 0){
    // 			// allIntersections = allIntersections.concat(intersections);
    // 			intersectionPoints.addNodes(intersections);
    // 		}
    // 		while(intersections.length > 0){
    // 			var newIntersectionIndex = this.nodes.length;
    // 			this.addNode({'x':intersections[0].x, 'y':intersections[0].y});
    // 			this.addEdgeFromExistingVertices(this.nodes.length-1, intersections[0].e1n1);
    // 			this.addEdgeFromExistingVertices(this.nodes.length-1, intersections[0].e1n2);
    // 			this.addEdgeFromExistingVertices(this.nodes.length-1, intersections[0].e2n1);
    // 			this.addEdgeFromExistingVertices(this.nodes.length-1, intersections[0].e2n2);
    // 			this.removeEdgesBetween(intersections[0].e1n1, intersections[0].e1n2);
    // 			this.removeEdgesBetween(intersections[0].e2n1, intersections[0].e2n2);
    // 			intersections = this.getEdgeIntersectionsWithEdge(i);
    // 			// add intersections to array
    // 			// allIntersections = allIntersections.concat(intersections);
    // 			intersectionPoints.addNodes(intersections);
    // 		}
    // 	}
    // 	// return allIntersections;
    // 	intersectionPoints.mergeDuplicateVertices();
    // 	return intersectionPoints.nodes;
    // }
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
    // Planar Graph new data structures
    PlanarGraph.prototype.generateFaces = function () {
        // // walk around a face
        // this.faces = [];
        // for(var startNode = 0; startNode < this.nodes.length; startNode++){
        // 	var startNodeAdjacentEdges = this.nodeAdjacentEdgesWithDetails(startNode);
        // 	// var startNodeAdjacentEdges = this.nodes[startNode].adjacentEdges().map(function(el){  });
        // 	for(var n = 0; n < startNodeAdjacentEdges.length; n++){
        // 		var validFace = true;
        // 		var nextAdjacent:EdgeNodeAngle = startNodeAdjacentEdges[n];
        // 		var travelingNode = nextAdjacent.node;
        // 		var theFace = new PlanarFace();
        // 		theFace['nodes'] = [ startNode, travelingNode ];
        // 		theFace['edges'] = [ nextAdjacent.edge ];
        // 		// var prevAngle = 0
        // 		// theFace['angles'] = [ this.nodes[startNode].adjacent.edges[n].angle ];
        // 		// var totalAngle = 0;
        // 		while(validFace && travelingNode != startNode){
        // 			var prevNode = theFace['nodes'][ theFace['nodes'].length-2 ];
        // 			var nextAdjacent = this.getClockwiseNeighborAround( travelingNode, prevNode );
        // 			travelingNode = nextAdjacent.node;
        // 			// theFace['angles'].push(nextAdjacent.angle);
        // 			// var nextAngle = nextAdjacent.angle;
        // 			// totalAngle += (nextAngle - prevAngle);
        // 			// prevAngle = nextAngle;
        // 			if(travelingNode == undefined){
        // 				// next element in array returning undefined, something weird is going on
        // 				validFace = false;
        // 			} else {
        // 				if(travelingNode == prevNode){
        // 					validFace = false;
        // 				} else{
        // 					if(travelingNode != startNode){
        // 						theFace['nodes'].push(travelingNode);
        // 						// var nextAngle = nextAdjacent.angle;
        // 						// totalAngle += (nextAngle - prevAngle);
        // 					}
        // 					theFace['edges'].push(nextAdjacent.edge);
        // 					// var already = this.arrayContainsNumberAtIndex(theFace, travelingNode);
        // 					// if(already == undefined){
        // 					// 	theFace.push(travelingNode);								
        // 					// } else{
        // 						// face that makes a figure 8. visits a node twice in the middle.
        // 						// if(this.faces.length > 2){
        // 						// 	// we can use this sub section if it's larger than a line
        // 						// 	var cropFace = theFace.slice(already, 1 + theFace.length-already);
        // 						// 	this.faces.push(cropFace);
        // 						// } 
        // 						// validFace = false;
        // 					// }
        // 				}
        // 			}
        // 		}
        // 		if(validFace && !this.arrayContainsDuplicates(theFace)){
        // 			// theFace['angle'] = totalAngle;
        // 			this.faces.push(theFace);
        // 		}
        // 	}
        // }
        // // remove duplicate faces
        // var i = 0;
        // while(i < this.faces.length-1){
        // 	var j = this.faces.length-1;
        // 	while(j > i){
        // 		if(this.areFacesEquivalent(i, j)){
        // 			this.faces.splice(j, 1);
        // 		}
        // 		j--;
        // 	}
        // 	i++;
        // }
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
                if (array[i] == array[j]) {
                    return true;
                }
            }
        }
        return false;
    };
    PlanarGraph.prototype.areFacesEquivalent = function (faceIndex1, faceIndex2) {
        if (this.faces[faceIndex1].nodes.length != this.faces[faceIndex2].nodes.length)
            return false;
        var sorted1 = this.faces[faceIndex1].nodes.sort();
        var sorted2 = this.faces[faceIndex2].nodes.sort();
        for (var i = 0; i < sorted1.length; i++) {
            if (sorted1[i] != sorted2[i])
                return false;
        }
        return true;
    };
    PlanarGraph.prototype.getVertexIndexAt = function (x, y) {
        var thisPoint = new XYPoint(x, y);
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.verticesEquivalent(this.nodes[i], thisPoint, USER_TAP_EPSILON)) {
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
    /*
    connectingVertexIndicesSortedRadially(vIndex){  // uint
        var connectedVertices = this.connectedVertexIndices(vIndex);  // array uint
        var globalAngleValues = []; //float  // calculated from global 0deg line
        // we have to query the global angle of each segment
        // so we can locally sort each clockwise or counter clockwise
        var sortedGlobalAngleValues = []; // float
        for(var i = 0; i < connectedVertices.length; i++){
            float angle = Math.atan2(this.nodes[connectedVertices[i]].y - this.nodes[vIndex].y,
                                     this.nodes[connectedVertices[i]].x - this.nodes[vIndex].x);
            globalAngleValues.push( angle );
            sortedGlobalAngleValues.push( angle );
        }
        sort(sortedGlobalAngleValues.begin(), sortedGlobalAngleValues.begin()+connectedVertices.length);
        // now each edge'd sprout angle is sorted from -pi to pi
        var connectedVertexIndicesSorted = []; // uint
        for(var i = 0; i < connectedVertices.length; i++)
            for(var j = 0; j < connectedVertices.length; j++)
                if(sortedGlobalAngleValues[i] == globalAngleValues[j])
                    connectedVertexIndicesSorted.push(connectedVertices[j]);
        return connectedVertexIndicesSorted;
    }

    connectingVertexInteriorAngles(vIndex, connectedVertexIndicesSorted){ // uint, uint array
        var anglesBetweenVertices = []; // float
        var anglesOfVertices = []; // float
        for(var i = 0; i < connectedVertexIndicesSorted.length; i++){
            float angle = atan2(this.nodes[connectedVertexIndicesSorted[i]].y - this.nodes[vIndex].y,
                                this.nodes[connectedVertexIndicesSorted[i]].x - this.nodes[vIndex].x);
            anglesOfVertices.push(angle);
        }
        for(var i = 0; i < anglesOfVertices.length; i++){
            // when it's the wrap around value (i==3) add 2pi to the angle it's subtracted from
            float diff = anglesOfVertices[(i+1)%anglesOfVertices.length]
            + (M_PI*2 * (i==3))
            - anglesOfVertices[i%anglesOfVertices.length];
            anglesBetweenVertices.push( diff );
        }
        return anglesBetweenVertices;
    }

    void PlanarGraph::rotateVertex(int vertexIndex, int originVertexIndex, float angleRadians){
        float distance = sqrt(powf( this->nodes[originVertexIndex].y - this->nodes[vertexIndex].y ,2)
                              +powf( this->nodes[originVertexIndex].x - this->nodes[vertexIndex].x ,2));
        float currentAngle = atan2(this->nodes[vertexIndex].y, this->nodes[vertexIndex].x);
        this->nodes[vertexIndex].x = distance*cosf(currentAngle + angleRadians);
        this->nodes[vertexIndex].y = distance*sinf(currentAngle + angleRadians);
    }

    */
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
// if points are all collinear
// checks if point q lies on line segment 'ab'
function onSegment(a, point, b) {
    if (point.x <= Math.max(a.x, b.x) && point.x >= Math.min(a.x, b.x) &&
        point.y <= Math.max(a.y, b.y) && point.y >= Math.min(a.y, b.y)) {
        return true;
    }
    return false;
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
