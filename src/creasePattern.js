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
var CreaseNode = (function (_super) {
    __extends(CreaseNode, _super);
    function CreaseNode(xx, yy) {
        return _super.call(this, xx, yy) || this;
    }
    return CreaseNode;
}(PlanarNode));
var Crease = (function (_super) {
    __extends(Crease, _super);
    function Crease(index1, index2) {
        return _super.call(this, index1, index2) || this;
    }
    ;
    Crease.prototype.mountain = function () { this.orientation = CreaseDirection.mountain; return this; };
    Crease.prototype.valley = function () { this.orientation = CreaseDirection.valley; return this; };
    Crease.prototype.border = function () { this.orientation = CreaseDirection.border; return this; };
    return Crease;
}(PlanarEdge));
// for purposes of modeling origami crease patterns
// creases are lines (edges) with endpoints v1, v2 (indices in vertex array)
var CreasePattern = (function (_super) {
    __extends(CreasePattern, _super);
    function CreasePattern() {
        var _this = _super.call(this) || this;
        // square page
        _this.addPaperEdge(0, 0, 0, 1);
        _this.addPaperEdge(0, 1, 1, 1);
        _this.addPaperEdge(1, 1, 1, 0);
        _this.addPaperEdge(1, 0, 0, 0);
        _this.clean();
        _this.landmarkNodes = [
            { x: 0.0, y: 0.0 },
            { x: 0.0, y: 1.0 },
            { x: 1.0, y: 0.0 },
            { x: 1.0, y: 1.0 },
            { x: 0.5, y: 0.5 },
            { x: 0.0, y: 0.5 },
            { x: 0.5, y: 0.0 },
            { x: 1.0, y: 0.5 },
            { x: 0.5, y: 1.0 }
        ];
        return _this;
    }
    CreasePattern.prototype["import"] = function (cp) {
        this.nodes = cp.nodes.slice();
        this.edges = cp.edges.slice();
        this.faces = cp.faces.slice();
    };
    CreasePattern.prototype.newEdge = function (nodeIndex1, nodeIndex2) {
        return this.addEdge(new Crease(nodeIndex1, nodeIndex2));
    };
    CreasePattern.prototype.addEdgeWithVertices = function (x1, y1, x2, y2) {
        var a = this.addNode(new CreaseNode(x1, y1));
        var b = this.addNode(new CreaseNode(x2, y2));
        return this.newEdge(a.index, b.index);
        // this.changedNodes( [this.nodes.length-2, this.nodes.length-1] );
    };
    ///////////////////////////////////////////////////////////////
    // ADD PARTS
    CreasePattern.prototype.crease = function (x1, y1, x2, y2) {
        return this.addEdgeWithVertices(x1, y1, x2, y2);
    };
    CreasePattern.prototype.creaseVector = function (start, vector) {
    };
    CreasePattern.prototype.creaseAngle = function (start, radians) {
    };
    CreasePattern.prototype.addPaperEdge = function (x1, y1, x2, y2) {
        this.crease(x1, y1, x2, y2).border();
    };
    ///////////////////////////////////////////////////////////////
    // CLEAN  /  REMOVE PARTS
    CreasePattern.prototype.clean = function () {
        // check if any nodes are free floating and not connected to any edges, remove them
        var superReturn = _super.prototype.clean.call(this);
        var intersections = _super.prototype.chop.call(this);
        // this.interestingPoints = this.nodes;
        // this.interestingPoints = this.appendUniquePoints(this.nodes, this.starterLocations);
        return superReturn;
    };
    CreasePattern.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.faces = [];
        // this.interestingPoints = this.starterLocations;
    };
    CreasePattern.prototype.isCornerNode = function (x, y) {
        // var E = EPSILON;
        // if( y < E ) return 1;
        // if( x > 1.0 - E ) return 2;
        // if( y > 1.0 - E ) return 3;
        // if( x < E ) return 4;
        // return undefined;
    };
    CreasePattern.prototype.isBoundaryNode = function (x, y) {
        var E = .1; //EPSILON;
        if (y < E)
            return 1;
        if (x > 1.0 - E)
            return 2;
        if (y > 1.0 - E)
            return 3;
        if (x < E)
            return 4;
        return undefined;
    };
    // vertexLiesOnEdge(vIndex, intersect){  // uint, Vertex
    // 	var v = this.nodes[vIndex];
    // 	return this.vertexLiesOnEdge(v, intersect);
    // }
    CreasePattern.prototype.trySnapVertex = function (newVertex, snapRadius) {
        // find the closest interesting point to the vertex
        var closestDistance = undefined;
        var closestIndex = undefined;
        for (var i = 0; i < this.landmarkNodes.length; i++) {
            // we could improve this, this.verticesEquivalent could return the distance itself, saving calculations
            if (this.verticesEquivalent(newVertex, this.landmarkNodes[i], snapRadius)) {
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
    CreasePattern.prototype.snapAll = function (snapRadius) {
        for (var i = 0; i < this.nodes.length; i++) {
            for (var j = 0; j < this.landmarkNodes.length; j++) {
                if (this.nodes[i] != undefined && this.verticesEquivalent(this.nodes[i], this.landmarkNodes[j], snapRadius)) {
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
            var a = this.edges[i].node[0];
            var b = this.edges[i].node[1];
            var x1 = (this.nodes[a].x * scale).toFixed(4);
            var y1 = (this.nodes[a].y * scale).toFixed(4);
            var x2 = (this.nodes[b].x * scale).toFixed(4);
            var y2 = (this.nodes[b].y * scale).toFixed(4);
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
                if (this.verticesEquivalent(master[i], child[c], EPSILON)) {
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
    CreasePattern.prototype.findAllFaces = function () {
        this.generateFaces();
    };
    CreasePattern.prototype.log = function () {
        _super.prototype.log.call(this);
    };
    CreasePattern.prototype.kiteBase = function () {
        this.addEdgeWithVertices(1, 0, 0, 1);
        this.addEdgeWithVertices(0, 1, 1, .58578);
        this.addEdgeWithVertices(0, 1, .41421, 0);
        this.clean();
    };
    CreasePattern.prototype.fishBase = function () {
        this.clear();
        this.crease(1, 0, 0, 1).mountain();
        this.crease(0, 1, 0.70711, 0.70711).valley();
        this.crease(0, 1, 0.29289, 0.29289).valley();
        this.crease(1, 0, 0.29289, 0.29289).valley();
        this.crease(1, 0, 0.70711, 0.70711).valley();
        this.crease(0.29289, 0.29289, 0, 0).valley();
        this.crease(0.70711, 0.70711, 1, 1).valley();
        this.crease(0.70711, 0.70711, 1, 0.70711).mountain();
        this.crease(0.29289, 0.29289, 0.29289, 0).mountain();
        this.addPaperEdge(0, 0, 0.29289, 0);
        this.addPaperEdge(0.29289, 0, 1, 0);
        this.addPaperEdge(1, 0, 1, 0.70711);
        this.addPaperEdge(1, 0.70711, 1, 1);
        this.addPaperEdge(1, 1, 0, 1);
        this.addPaperEdge(0, 1, 0, 0);
        this.clean();
        this.addFaceBetweenNodes([0, 1, 3]);
        this.addFaceBetweenNodes([0, 2, 1]);
        this.addFaceBetweenNodes([4, 3, 1]);
        this.addFaceBetweenNodes([5, 1, 2]);
        this.addFaceBetweenNodes([6, 5, 2]);
        this.addFaceBetweenNodes([6, 2, 0]);
        this.addFaceBetweenNodes([7, 3, 4]);
        this.addFaceBetweenNodes([7, 0, 3]);
    };
    CreasePattern.prototype.birdBase = function () {
        this.addEdgeWithVertices(.35355, .64645, 0, 1);
        this.addEdgeWithVertices(0.5, 0.5, .35355, .64645);
        this.addEdgeWithVertices(.64645, .35356, 0.5, 0.5);
        this.addEdgeWithVertices(1, 0, .64645, .35356);
        this.addEdgeWithVertices(0, 1, 0.5, .79289);
        this.addEdgeWithVertices(0, 1, .2071, 0.5);
        this.addEdgeWithVertices(1, 0, 0.5, .20711);
        this.addEdgeWithVertices(1, 0, .79289, 0.5);
        this.addEdgeWithVertices(.64643, .64643, 1, 1);
        this.addEdgeWithVertices(0.5, 0.5, .64643, .64643);
        this.addEdgeWithVertices(.35353, .35353, 0.5, 0.5);
        this.addEdgeWithVertices(0, 0, .35353, .35353);
        this.addEdgeWithVertices(1, 1, .79291, 0.5);
        this.addEdgeWithVertices(1, 1, 0.5, .79291);
        this.addEdgeWithVertices(0, 0, .20709, 0.5);
        this.addEdgeWithVertices(0, 0, 0.5, .2071);
        this.addEdgeWithVertices(.35355, .35354, .2071, 0.5);
        this.addEdgeWithVertices(0.5, .20711, .35355, .35354);
        this.addEdgeWithVertices(.35355, .64645, 0.5, .7929);
        this.addEdgeWithVertices(.2071, 0.5, .35355, .64645);
        this.addEdgeWithVertices(.64645, .64645, .79289, 0.5);
        this.addEdgeWithVertices(0.5, .7929, .64645, .64645);
        this.addEdgeWithVertices(.64645, .35356, 0.5, .20711);
        this.addEdgeWithVertices(.79289, 0.5, .64645, .35356);
        this.addEdgeWithVertices(0.5, 0.5, 0.5, .79289);
        this.addEdgeWithVertices(0.5, .20711, 0.5, 0.5);
        this.addEdgeWithVertices(0.5, 0.5, .79289, 0.5);
        this.addEdgeWithVertices(.2071, 0.5, 0.5, 0.5);
        this.addEdgeWithVertices(0.5, .20711, 0.5, 0);
        this.addEdgeWithVertices(.79289, 0.5, 1, 0.5);
        this.addEdgeWithVertices(0.5, .79289, 0.5, 1);
        this.addEdgeWithVertices(.2071, 0.5, 0, 0.5);
        this.clean();
    };
    CreasePattern.prototype.frogBase = function () {
        this.addEdgeWithVertices(0, 0, .14646, .35353);
        this.addEdgeWithVertices(0, 0, .35353, .14646);
        this.addEdgeWithVertices(.14646, .35353, 0.5, 0.5);
        this.addEdgeWithVertices(0.5, 0.5, .35353, .14646);
        this.addEdgeWithVertices(.14646, .35353, .14646, 0.5);
        this.addEdgeWithVertices(0, 0.5, .14646, 0.5);
        this.addEdgeWithVertices(0.5, 0.5, 0.5, .14644);
        this.addEdgeWithVertices(0.5, .14644, 0.5, 0);
        this.addEdgeWithVertices(0.5, 0, .35353, .14646);
        this.addEdgeWithVertices(.35353, .14646, 0.5, .14646);
        this.addEdgeWithVertices(.14646, .35354, 0, 0.5);
        this.addEdgeWithVertices(.14646, .35354, .25, .25);
        this.addEdgeWithVertices(.25, .25, .35353, .14646);
        this.addEdgeWithVertices(0, 1, .35352, .85354);
        this.addEdgeWithVertices(0, 1, .14646, .64646);
        this.addEdgeWithVertices(.35352, .85354, 0.5, 0.5);
        this.addEdgeWithVertices(0.5, 0.5, .14646, .64646);
        this.addEdgeWithVertices(.35352, .85354, 0.5, .85354);
        this.addEdgeWithVertices(0.5, 1, 0.5, .85354);
        this.addEdgeWithVertices(0.5, 0.5, 0.5, .85354);
        this.addEdgeWithVertices(0.5, 0.5, .14643, 0.5);
        this.addEdgeWithVertices(0, 0.5, .14646, .64646);
        this.addEdgeWithVertices(.14646, .64646, .14646, 0.5);
        this.addEdgeWithVertices(.35353, .85354, 0.5, 1);
        this.addEdgeWithVertices(.35353, .85354, .25, .75);
        this.addEdgeWithVertices(.25, .75, .14646, .64646);
        this.addEdgeWithVertices(1, 0, .85352, .35353);
        this.addEdgeWithVertices(1, 0, .64645, .14646);
        this.addEdgeWithVertices(.85352, .35353, 0.5, 0.5);
        this.addEdgeWithVertices(0.5, 0.5, .64645, .14646);
        this.addEdgeWithVertices(.85352, .35353, .85352, 0.5);
        this.addEdgeWithVertices(1, 0.5, .85352, 0.5);
        this.addEdgeWithVertices(0.5, 0, .64645, .14646);
        this.addEdgeWithVertices(.64645, .14646, 0.5, .14646);
        this.addEdgeWithVertices(.8535, .35354, 1, 0.5);
        this.addEdgeWithVertices(.8535, .35354, .75, .25);
        this.addEdgeWithVertices(.75, .25, .64645, .14646);
        this.addEdgeWithVertices(1, 1, .64645, .85354);
        this.addEdgeWithVertices(1, 1, .85352, .64646);
        this.addEdgeWithVertices(.64645, .85354, 0.5, 0.5);
        this.addEdgeWithVertices(0.5, 0.5, .85352, .64646);
        this.addEdgeWithVertices(.64645, .85354, 0.5, .85354);
        this.addEdgeWithVertices(0.5, 0.5, .85354, 0.5);
        this.addEdgeWithVertices(1, 0.5, .85352, .64646);
        this.addEdgeWithVertices(.85352, .64646, .85352, 0.5);
        this.addEdgeWithVertices(.64645, .85354, 0.5, 1);
        this.addEdgeWithVertices(.64645, .85354, .75, .75);
        this.addEdgeWithVertices(.75, .75, .85352, .64646);
        this.addEdgeWithVertices(.35353, .14646, .35353, 0);
        this.addEdgeWithVertices(.64645, .14646, .64645, 0);
        this.addEdgeWithVertices(.85352, .35353, 1, .35353);
        this.addEdgeWithVertices(.85352, .64646, 1, .64646);
        this.addEdgeWithVertices(.64645, .85354, .64645, 1);
        this.addEdgeWithVertices(.35352, .85354, .35352, 1);
        this.addEdgeWithVertices(.14646, .64646, 0, .64646);
        this.addEdgeWithVertices(.14646, .35353, 0, .35353);
        this.addEdgeWithVertices(0.5, 0.5, .25, .25);
        this.addEdgeWithVertices(0.5, 0.5, .75, .25);
        this.addEdgeWithVertices(0.5, 0.5, .75, .75);
        this.addEdgeWithVertices(0.5, 0.5, .25, .75);
        this.addEdgeWithVertices(.25, .75, 0, 1);
        this.addEdgeWithVertices(.25, .25, 0, 0);
        this.addEdgeWithVertices(.75, .25, 1, 0);
        this.addEdgeWithVertices(.75, .75, 1, 1);
        this.clean();
    };
    return CreasePattern;
}(PlanarGraph));
