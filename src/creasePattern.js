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
// crease pattern change callback, hook directly into cp.paperjs.js init()
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
// function shuffle(a) {
// 	var array = [];
// 	for(var i = 0; i < a.length; i++){ array.push(a); }
// 	var currentIndex = array.length, temporaryValue, randomIndex;
// 	// While there remain elements to shuffle...
// 	while (0 !== currentIndex) {
// 		// Pick a remaining element...
// 		randomIndex = Math.floor(Math.random() * currentIndex);
// 		currentIndex -= 1;
// 		// And swap it with the current element.
// 		temporaryValue = array[currentIndex];
// 		array[currentIndex] = array[randomIndex];
// 		array[randomIndex] = temporaryValue;
// 	}
// 	return array;
// }
var CreaseNode = (function (_super) {
    __extends(CreaseNode, _super);
    function CreaseNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CreaseNode.prototype.isBoundary = function () {
        for (var i = 0; i < this.graph.boundary.edges.length; i++) {
            var thisPt = new XY(this.x, this.y);
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
    CreaseNode.prototype.kawasakiRating = function () {
        if (this.isBoundary()) {
            return 0;
        }
        // for each node: 0.0 to 1.0
        // 0.0 is 100% success on all nodes flat foldable.
        // 1.0 is as far from wrong as possible - 180 degrees apart from each other
        var sums = this.kawasaki();
        if (sums !== undefined) {
            var diff = Math.abs(sums[0] - sums[1]) / Math.PI;
            return diff;
        }
        return 0;
    };
    CreaseNode.prototype.flatFoldable = function (epsilon) {
        if (epsilon === undefined) {
            epsilon = EPSILON_LOW;
        }
        if (this.isBoundary()) {
            return true;
        }
        var sums = this.kawasaki();
        if (sums == undefined) {
            return false;
        } // not an even number of interior angles
        if (epsilonEqual(sums[0], Math.PI, epsilon) &&
            epsilonEqual(sums[1], Math.PI, epsilon)) {
            return true;
        }
        return false;
    };
    CreaseNode.prototype.maekawa = function () {
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
    CreaseNode.prototype.findFlatFoldable = function () {
        var that = this;
        return this.interiorAngles().map(function (el) {
            return that.graph.findFlatFoldable(el);
        });
    };
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
    Crease.prototype.noCrossing = function () {
        // find this edge's first intersection
        // remove this edge
        // replace it with an edge that doesn't intersect other edges
        var o = this.newMadeBy.rayOrigin;
        if (o === undefined) {
            o = this.nodes[0];
        }
        var angle = this.absoluteAngle(o);
        var rayDirection = new XY(Math.cos(angle), Math.sin(angle));
        var intersection = undefined;
        var shortest = Infinity;
        for (var i = 0; i < this.graph.edges.length; i++) {
            var inter = rayLineSegmentIntersection(o, rayDirection, this.graph.edges[i].nodes[0], this.graph.edges[i].nodes[1]);
            if (inter !== undefined && !o.equivalent(inter)) {
                var d = Math.sqrt(Math.pow(o.x - inter.x, 2) + Math.pow(o.y - inter.y, 2));
                if (d < shortest) {
                    shortest = d;
                    intersection = inter;
                }
            }
        }
        if (intersection !== undefined) {
            var edge = this.graph.newCrease(o.x, o.y, intersection.x, intersection.y);
            this.graph.removeEdge(this);
            return edge;
        }
    };
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
    CreasePattern.prototype.landmarkNodes = function () { return this.nodes.map(function (el) { return new XY(el.x, el.y); }); };
    /** This will deep-copy the contents of this graph and return it as a new object
     * @returns {CreasePattern}
     */
    CreasePattern.prototype.duplicate = function () {
        this.nodeArrayDidChange();
        this.edgeArrayDidChange();
        this.faceArrayDidChange();
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
            g.faces.push(f);
            f.graph = g;
            f.index = i;
            // (<any>Object).assign(f, this.faces[i]);
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
        // boundary
        this.boundary.nodeArrayDidChange();
        this.boundary.edgeArrayDidChange();
        var b = new PlanarGraph();
        if (this.boundary !== undefined) {
            if (this.boundary.nodes !== undefined) {
                for (var i = 0; i < this.boundary.nodes.length; i++) {
                    var bn = b.addNode(new PlanarNode(b));
                    Object.assign(bn, this.boundary.nodes[i]);
                    bn.graph = b;
                    bn.index = i;
                }
            }
            if (this.boundary.edges !== undefined) {
                for (var i = 0; i < this.boundary.edges.length; i++) {
                    var index = [this.boundary.edges[i].nodes[0].index, this.boundary.edges[i].nodes[1].index];
                    var be = b.addEdge(new PlanarEdge(b, b.nodes[index[0]], b.nodes[index[1]]));
                    Object.assign(be, this.boundary.edges[i]);
                    be.graph = b;
                    be.index = i;
                    be.nodes = [b.nodes[index[0]], b.nodes[index[1]]];
                }
            }
            if (this.boundary.faces !== undefined) {
                for (var i = 0; i < this.boundary.faces.length; i++) {
                    var bf = new PlanarFace(b);
                    bf.graph = b; // redundant
                    Object.assign(bf, this.boundary.faces[i]);
                    bf.nodes = [];
                    bf.edges = [];
                    bf.angles = [];
                    if (this.boundary.faces[i] !== undefined) {
                        for (var j = 0; j < this.boundary.faces[i].nodes.length; j++) {
                            bf.nodes.push(b.nodes[this.boundary.faces[i].nodes[j].index]);
                        }
                        for (var j = 0; j < this.boundary.faces[i].edges.length; j++) {
                            bf.edges.push(b.edges[this.boundary.faces[i].edges[j].index]);
                        }
                        for (var j = 0; j < this.boundary.faces[i].angles.length; j++) {
                            bf.angles.push(this.boundary.faces[i].angles[j]);
                        }
                        b.faces.push(bf);
                    }
                }
            }
        }
        g.boundary = b;
        return g;
    };
    CreasePattern.prototype.possibleFolds = function () {
        var next = this.duplicate();
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
        var next = this.duplicate();
        next.nodes = [];
        next.edges = [];
        next.faces = [];
        for (var i = 0; i < this.nodes.length - 1; i++) {
            for (var j = i + 1; j < this.nodes.length; j++) {
                next.creaseThroughPoints(this.nodes[i], this.nodes[j]);
            }
        }
        // next.cleanDuplicateNodes();
        return next;
    };
    CreasePattern.prototype.possibleFolds2 = function () {
        var next = this.duplicate();
        next.nodes = [];
        next.edges = [];
        next.faces = [];
        for (var i = 0; i < this.nodes.length - 1; i++) {
            for (var j = i + 1; j < this.nodes.length; j++) {
                next.creasePointToPoint(this.nodes[i], this.nodes[j]);
            }
        }
        // next.cleanDuplicateNodes();
        return next;
    };
    CreasePattern.prototype.possibleFolds3 = function (edges) {
        var next = this.duplicate();
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
        // next.cleanDuplicateNodes();
        return next;
    };
    // precision is an epsilon value: 0.00001
    /*	wiggle(precision):XY[]{
            if (precision === undefined){ precision = EPSILON; }
    
            var lengths = this.edges.forEach(function(crease, i){
                return crease.length();
            });
            // prevent too much deviation from length
            
            var dup = this.duplicate();
    
            var forces = [];
            for(var i = 0; i < dup.nodes.length; i++){ forces.push(new XY(0,0)); }
    
            var nodesAttempted:number = 0;
            // var shuffleNodes = shuffle(dup.nodes);
            for(var i = 0; i < dup.nodes.length; i++){
                var rating = dup.nodes[i].kawasakiRating();
    
                var edgeLengths = dup.edges.forEach(function(el){ return el.length(); });
    
                if(rating > precision){
                    nodesAttempted++;
                    // guess some numbers.
                    var guesses = []; // {xy:__(XY)__, rating:__(number)__};
                    for(var n = 0; n < 12; n++){
                        // maybe store angle so that we can keep track of it between rounds
                        var randomAngle = Math.PI*2 / 12 * n; // wrap around to make sure it's random
                        var radius = Math.random() * rating;
                        var move = new XY( 0.05*radius * Math.cos(randomAngle),
                                           0.05*radius * Math.sin(randomAngle));
                        dup.nodes[i].x += move.x;
                        dup.nodes[i].y += move.y;
                        var newRating = dup.nodes[i].kawasakiRating();
                        var adjNodes = dup.nodes[i].adjacentNodes();
                        // var numRatings = 1;  // begin with this node. add the adjacent nodes
                        var adjRating = 0;
                        for(var adj = 0; adj < adjNodes.length; adj++){
                            adjRating += dup.nodes[i].kawasakiRating();
                            // numRatings += 1;
                        }
                        guesses.push( {xy:move, rating:newRating+adjRating} );
                        // guesses.push( {xy:move, rating:(newRating+adjRating)/numRatings} );
                        // undo change
                        dup.nodes[i].x -= move.x;
                        dup.nodes[i].y -= move.y;
                    }
                    var sortedGuesses = guesses.sort(function(a,b) {return a.rating - b.rating;} );
                    // if(sortedGuesses[0].rating < rating){
                    forces[i].x += sortedGuesses[0].xy.x;
                    forces[i].y += sortedGuesses[0].xy.y;
                        // dup.nodes[i].x += sortedGuesses[0].xy.x;
                        // dup.nodes[i].y += sortedGuesses[0].xy.y;
                        // perform quick intersection test, does any line associated with this node intersect with other lines? if so, undo change.
                    // }
                }
            }
            // for(var i = 0; i < forces.length; i++){
            // 	dup.nodes[i].x += forces[i].x;
            // 	dup.nodes[i].y += forces[i].y;
            // }
    
            // for(var i = 0; i < this.nodes.length; i++){
            // 	this.nodes[i].x = dup.nodes[i].x;
            // 	this.nodes[i].y = dup.nodes[i].y;
            // }
    
            // console.log(forces);
            return forces;
            // return dup;
        }
    */
    // number of nodes tried to wiggle (ignores those correct within epsilon range)
    CreasePattern.prototype.wiggle = function () {
        var lengths = this.edges.forEach(function (crease, i) {
            return crease.length();
        });
        // prevent too much deviation from length
        var nodesAttempted = 0;
        // var dup = this.duplicate();
        // var shuffleNodes = shuffle(this.nodes);
        for (var i = 0; i < this.nodes.length; i++) {
            var rating = this.nodes[i].kawasakiRating();
            if (rating > EPSILON) {
                nodesAttempted++;
                // guess some numbers.
                var guesses = []; // {xy:__(XY)__, rating:__(number)__};
                for (var n = 0; n < 12; n++) {
                    // maybe store angle so that we can keep track of it between rounds
                    var randomAngle = Math.random() * Math.PI * 20; // wrap around to make sure it's random
                    var radius = Math.random() * rating;
                    var move = new XY(0.05 * radius * Math.cos(randomAngle), 0.05 * radius * Math.sin(randomAngle));
                    this.nodes[i].x += move.x;
                    this.nodes[i].y += move.y;
                    var newRating = this.nodes[i].kawasakiRating();
                    var adjNodes = this.nodes[i].adjacentNodes();
                    // var numRatings = 1;  // begin with this node. add the adjacent nodes
                    var adjRating = 0;
                    for (var adj = 0; adj < adjNodes.length; adj++) {
                        adjRating += this.nodes[i].kawasakiRating();
                        // numRatings += 1;
                    }
                    guesses.push({ xy: move, rating: newRating + adjRating });
                    // guesses.push( {xy:move, rating:(newRating+adjRating)/numRatings} );
                    // undo change
                    this.nodes[i].x -= move.x;
                    this.nodes[i].y -= move.y;
                }
                var sortedGuesses = guesses.sort(function (a, b) { return a.rating - b.rating; });
                // if(sortedGuesses[0].rating < rating){
                this.nodes[i].x += sortedGuesses[0].xy.x;
                this.nodes[i].y += sortedGuesses[0].xy.y;
                // perform quick intersection test, does any line associated with this node intersect with other lines? if so, undo change.
                // }
            }
        }
        return nodesAttempted;
    };
    CreasePattern.prototype.flatFoldable = function () {
        return this.nodes.map(function (el) { return el.flatFoldable(); })
            .reduce(function (prev, cur) { return prev && cur; });
    };
    ///////////////////////////////////////////////////////////////
    // ADD PARTS
    CreasePattern.prototype.fold = function (param1, param2, param3, param4) {
        // detects which parameters are there
    };
    CreasePattern.prototype.foldInHalf = function () {
        var crease;
        // var bounds = this.boundingBox();
        // var centroid = new XY(bounds.origin.x + bounds.size.width*0.5,
        //                       bounds.origin.y + bounds.size.height*0.5);
        // // var edges = [this.boundary.]
        // var validCreases = this.possibleFolds3().edges.filter(function(el){ 
        // 	return onSegment(centroid, el.nodes[0], el.nodes[1]);
        // }).sort(function(a,b){ 
        // 	var aSum = a.nodes[0].index + a.nodes[1].index;
        // 	var bSum = b.nodes[0].index + b.nodes[1].index;
        // 	return (aSum>bSum)?1:(aSum<bSum)?-1:0;
        // });
        // // console.log(validCreases);
        // var edgeCount = this.edges.length;
        // var i = 0;
        // do{
        // 	// console.log("new round");
        // 	// console.log(this.edges.length);
        // 	crease = this.creaseThroughPoints(validCreases[i].nodes[0], validCreases[i].nodes[1]);
        // 	// console.log(this.edges.length);
        // 	this.clean();
        // 	i++;
        // }while( edgeCount === this.edges.length && i < validCreases.length );
        // if(edgeCount !== this.edges.length) return crease;
        var bounds = this.bounds();
        if (epsilonEqual(bounds.size.width, bounds.size.height)) {
            this.clean();
            var edgeCount = this.edges.length;
            var edgeMidpoints = this.edges.map(function (el) { return el.midpoint(); });
            var arrayOfPointsAndMidpoints = this.nodes.map(function (el) { return new XY(el.x, el.y); }).concat(edgeMidpoints);
            // console.log(arrayOfPointsAndMidpoints);
            var centroid = new XY(bounds.topLeft.x + bounds.size.width * 0.5, bounds.topLeft.y + bounds.size.height * 0.5);
            var i = 0;
            do {
                // console.log("new round");
                // console.log(this.edges.length);
                crease = this.creaseThroughPoints(arrayOfPointsAndMidpoints[i], centroid);
                // console.log(this.edges.length);
                this.clean();
                i++;
            } while (edgeCount === this.edges.length && i < arrayOfPointsAndMidpoints.length);
            if (edgeCount !== this.edges.length)
                return crease;
        }
        return;
    };
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
        var newCrease = this.newPlanarEdge(a_x, a_y, b_x, b_y);
        if (this.didChange !== undefined) {
            this.didChange(undefined);
        }
        return newCrease;
    };
    /** Create a crease that is a line segment, and will crop if it extends beyond boundary
     * @arg 4 numbers or 2 XYs
     * @returns {Crease} pointer to the Crease
     */
    CreasePattern.prototype.crease = function (a, b, c, d) {
        if (a instanceof Crease) { }
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
            endpoints = this.clipLineSegmentInBoundary(new XY(a, b), new XY(c, d));
        }
        if (endpoints === undefined || endpoints.length < 2) {
            return;
        } //throw "crease(): coordinates lie outside boundary"; }
        return this.newCrease(endpoints[0].x, endpoints[0].y, endpoints[1].x, endpoints[1].y);
    };
    CreasePattern.prototype.creaseRay = function (origin, direction) {
        var endpoints = this.clipRayInBoundary(origin, direction);
        if (endpoints === undefined) {
            return;
        } //throw "creaseRay does not appear to be inside the boundary"; }
        var newCrease = this.newCrease(endpoints[0].x, endpoints[0].y, endpoints[1].x, endpoints[1].y);
        if (origin.equivalent(newCrease.nodes[0])) {
            newCrease.newMadeBy.rayOrigin = newCrease.nodes[0];
        }
        if (origin.equivalent(newCrease.nodes[1])) {
            newCrease.newMadeBy.rayOrigin = newCrease.nodes[1];
        }
        return newCrease;
    };
    CreasePattern.prototype.creaseRayUntilIntersection = function (origin, direction) {
        if (!isValidPoint(origin) || !isValidPoint(direction)) {
            return undefined;
        }
        var nearestIntersection = undefined;
        var intersections = this.edges
            .map(function (el) { return { edge: el, point: rayLineSegmentIntersection(origin, direction, el.nodes[0], el.nodes[1]) }; })
            .filter(function (el) { return el.point !== undefined; })
            .filter(function (el) { return !el.point.equivalent(origin); })
            .sort(function (a, b) {
            var da = Math.sqrt(Math.pow(origin.x - a.point.x, 2) + Math.pow(origin.y - a.point.y, 2));
            var db = Math.sqrt(Math.pow(origin.x - b.point.x, 2) + Math.pow(origin.y - b.point.y, 2));
            return (da > db) ? 1 : (da < db) ? -1 : 0;
        });
        if (intersections.length) {
            var newCrease = this.crease(origin, intersections[0].point);
            newCrease.newMadeBy.type = MadeByType.ray;
            if (origin.equivalent(newCrease.nodes[0])) {
                newCrease.newMadeBy.rayOrigin = newCrease.nodes[0];
                newCrease.newMadeBy.endPoints = [newCrease.nodes[1]];
            }
            if (origin.equivalent(newCrease.nodes[1])) {
                newCrease.newMadeBy.rayOrigin = newCrease.nodes[1];
                newCrease.newMadeBy.endPoints = [newCrease.nodes[0]];
            }
            newCrease.newMadeBy.intersections = [intersections[0].edge];
            return newCrease;
        }
        else {
            return this.creaseRay(origin, direction);
        }
    };
    CreasePattern.prototype.creaseRayRepeat = function (origin, direction) {
        var creases = [];
        creases.push(this.creaseRayUntilIntersection(origin, direction));
        var i = 0;
        while (i < 100 && creases[creases.length - 1] !== undefined && creases[creases.length - 1].newMadeBy.intersections.length) {
            var last = creases[creases.length - 1];
            // console.log(last.newMadeBy.intersections[0].reflectionMatrix());
            var reflectionMatrix = last.newMadeBy.intersections[0].reflectionMatrix();
            var reflectedPoint = new XY(last.newMadeBy.rayOrigin.x, last.newMadeBy.rayOrigin.y).transform(reflectionMatrix);
            var newStart = last.newMadeBy.endPoints[0];
            var newDirection = new XY(reflectedPoint.x - newStart.x, reflectedPoint.y - newStart.y);
            // var newStart = new XY(last.newMadeBy.endPoints[0].x + newDirection.x * 0.001,
            //                       last.newMadeBy.endPoints[0].y + newDirection.y * 0.001);
            var newCrease = this.creaseRayUntilIntersection(newStart, newDirection);
            creases.push(newCrease);
            var newIntersection = newCrease.newMadeBy.endPoints[0];
            if (newIntersection !== undefined) {
                var duplicates = creases.filter(function (el, i) { return i < creases.length - 1; })
                    .map(function (el) {
                    return newIntersection.equivalent(el.nodes[0], EPSILON_LOW) || newIntersection.equivalent(el.nodes[1], EPSILON_LOW);
                })
                    .reduce(function (prev, cur) { return prev || cur; });
                if (duplicates)
                    i = 100;
            }
            i++;
        }
        return creases.filter(function (el) { return el != undefined; });
    };
    CreasePattern.prototype.creaseAngle = function (origin, radians) {
        return this.creaseRay(origin, new XY(Math.cos(radians), Math.sin(radians)));
    };
    CreasePattern.prototype.creaseAngleBisector = function (a, b) {
        var aCommon, bCommon;
        if (a.nodes[0].equivalent(b.nodes[0])) {
            aCommon = a.nodes[0];
            bCommon = b.nodes[0];
        }
        if (a.nodes[0].equivalent(b.nodes[1])) {
            aCommon = a.nodes[0];
            bCommon = b.nodes[1];
        }
        if (a.nodes[1].equivalent(b.nodes[0])) {
            aCommon = a.nodes[1];
            bCommon = b.nodes[0];
        }
        if (a.nodes[1].equivalent(b.nodes[1])) {
            aCommon = a.nodes[1];
            bCommon = b.nodes[1];
        }
        // var commonNode = <PlanarNode>a.commonNodeWithEdge(b);
        // console.log(commonNode);
        if (aCommon === undefined)
            return undefined;
        var aAngle = a.absoluteAngle(aCommon);
        var bAngle = b.absoluteAngle(bCommon);
        var clockwise = clockwiseAngleFrom(bAngle, aAngle);
        var newAngle = bAngle - clockwise * 0.5 + Math.PI;
        return this.creaseRay(aCommon, new XY(Math.cos(newAngle), Math.sin(newAngle)));
    };
    CreasePattern.prototype.creaseAngleBisectorSmaller = function (a, b) {
        var aCommon, bCommon;
        if (a.nodes[0].equivalent(b.nodes[0])) {
            aCommon = a.nodes[0];
            bCommon = b.nodes[0];
        }
        if (a.nodes[0].equivalent(b.nodes[1])) {
            aCommon = a.nodes[0];
            bCommon = b.nodes[1];
        }
        if (a.nodes[1].equivalent(b.nodes[0])) {
            aCommon = a.nodes[1];
            bCommon = b.nodes[0];
        }
        if (a.nodes[1].equivalent(b.nodes[1])) {
            aCommon = a.nodes[1];
            bCommon = b.nodes[1];
        }
        // var commonNode = <PlanarNode>a.commonNodeWithEdge(b);
        // console.log(commonNode);
        if (aCommon === undefined)
            return undefined;
        var aAngle = a.absoluteAngle(aCommon);
        var bAngle = b.absoluteAngle(bCommon);
        var clockwise = clockwiseAngleFrom(bAngle, aAngle);
        var counter = clockwiseAngleFrom(aAngle, bAngle);
        var clockwiseAngle = bAngle - clockwise * 0.5 + Math.PI;
        var correctedAngle = bAngle - clockwise * 0.5;
        if (clockwise < counter) {
            return this.creaseRay(aCommon, new XY(Math.cos(correctedAngle), Math.sin(correctedAngle)));
        }
        return this.creaseRay(aCommon, new XY(Math.cos(clockwiseAngle), Math.sin(clockwiseAngle)));
    };
    CreasePattern.prototype.creaseSymmetry = function (ax, ay, bx, by) {
        if (this.symmetryLine === undefined) {
            return undefined;
        }
        var ra = new XY(ax, ay).reflect(this.symmetryLine[0], this.symmetryLine[1]);
        var rb = new XY(bx, by).reflect(this.symmetryLine[0], this.symmetryLine[1]);
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
        // if(!aInside && !bInside) { return this.clipLineInBoundary(a, b); }
        // maybe we don't want this feature
        var inside = a;
        var outside = b;
        if (bInside) {
            outside = a;
            inside = b;
        }
        var intersection = undefined;
        for (var i = 0; i < this.boundary.edges.length; i++) {
            intersection = lineSegmentIntersectionAlgorithm(inside, outside, this.boundary.edges[i].nodes[0], this.boundary.edges[i].nodes[1]);
            if (intersection !== undefined) {
                break;
            }
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
            var b = new XY(origin.x + direction.x, origin.y + direction.y);
            return this.clipLineInBoundary(origin, b);
        }
        for (var i = 0; i < this.boundary.edges.length; i++) {
            var intersection = rayLineSegmentIntersection(origin, direction, this.boundary.edges[i].nodes[0], this.boundary.edges[i].nodes[1]);
            if (intersection != undefined) {
                return [origin, intersection];
            }
        }
    };
    CreasePattern.prototype.clipLineInBoundary = function (a, b) {
        // todo this only works for convex polygon shaped boundary
        var b_a = new XY(b.x - a.x, b.y - a.y);
        var intersects = this.boundaryLineIntersection(a, b_a);
        if (intersects.length === 2) {
            return [intersects[0], intersects[1]];
        }
    };
    // AXIOM 1
    CreasePattern.prototype.creaseThroughPoints = function (a, b) {
        var endPoints = this.clipLineInBoundary(a, b);
        if (endPoints === undefined) {
            return;
        } //throw "creaseThroughPoints(): crease line doesn't cross inside boundary"; }
        var newCrease = this.newCrease(endPoints[0].x, endPoints[0].y, endPoints[1].x, endPoints[1].y);
        newCrease.madeBy = new Fold(this.creaseThroughPoints, [new XY(a.x, a.y), new XY(b.x, b.y)]);
        return newCrease;
    };
    // AXIOM 2
    CreasePattern.prototype.creasePointToPoint = function (a, b) {
        var midpoint = new XY((a.x + b.x) * 0.5, (a.y + b.y) * 0.5);
        var ab = new XY(b.x - a.x, b.y - a.y);
        var perp1 = new XY(-ab.y, ab.x);
        var intersects = this.boundaryLineIntersection(midpoint, perp1);
        if (intersects.length >= 2) {
            var newCrease = this.newCrease(intersects[0].x, intersects[0].y, intersects[1].x, intersects[1].y);
            newCrease.madeBy = new Fold(this.creasePointToPoint, [new XY(a.x, a.y), new XY(b.x, b.y)]);
            return newCrease;
        }
        return;
        // throw "points have no perpendicular bisector inside of the boundaries";
    };
    // AXIOM 3
    CreasePattern.prototype.creaseEdgeToEdge = function (a, b) {
        if (linesParallel(a.nodes[0], a.nodes[1], b.nodes[0], b.nodes[1])) {
            var u = new XY(a.nodes[1].x - a.nodes[0].x, a.nodes[1].y - a.nodes[0].y);
            var perp = new XY(u.x, u.y).rotate90();
            var intersect1 = lineIntersectionAlgorithm(u, new XY(u.x + perp.x, u.y + perp.y), a.nodes[0], a.nodes[1]);
            var intersect2 = lineIntersectionAlgorithm(u, new XY(u.x + perp.x, u.y + perp.y), b.nodes[0], b.nodes[1]);
            var midpoint = new XY((intersect1.x + intersect2.x) * 0.5, (intersect1.y + intersect2.y) * 0.5);
            var crease = this.creaseThroughPoints(midpoint, new XY(midpoint.x + u.x, midpoint.y + u.y));
            if (crease !== undefined) {
                crease.madeBy = new Fold(this.creaseEdgeToEdge, [
                    new XY(a.nodes[0].x, a.nodes[0].y),
                    new XY(a.nodes[1].x, a.nodes[1].y),
                    new XY(b.nodes[0].x, b.nodes[0].y),
                    new XY(b.nodes[1].x, b.nodes[1].y)
                ]);
            }
            return [crease];
        }
        else {
            var creases = [];
            var intersection = lineIntersectionAlgorithm(a.nodes[0], a.nodes[1], b.nodes[0], b.nodes[1]);
            var u = new XY(a.nodes[1].x - a.nodes[0].x, a.nodes[1].y - a.nodes[0].y);
            var v = new XY(b.nodes[1].x - b.nodes[0].x, b.nodes[1].y - b.nodes[0].y);
            var uMag = u.magnitude();
            var vMag = v.magnitude();
            var dir = new XY((u.x * vMag + v.x * uMag), (u.y * vMag + v.y * uMag));
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
                for (var i = 0; i < creases.length; i++) {
                    if (creases[i] !== undefined) {
                        creases[i].madeBy = new Fold(this.creaseEdgeToEdge, [
                            new XY(a.nodes[0].x, a.nodes[0].y),
                            new XY(a.nodes[1].x, a.nodes[1].y),
                            new XY(b.nodes[0].x, b.nodes[0].y),
                            new XY(b.nodes[1].x, b.nodes[1].y)
                        ]);
                    }
                }
                return creases;
            }
            return;
            // throw "lines have no inner edge inside of the boundaries";
        }
        ;
    };
    // AXIOM 4
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
        var align = new XY(endPts[1].x - endPts[0].x, endPts[1].y - endPts[0].y);
        var pointParallel = new XY(point.x + align.x, point.y + align.y);
        var intersection = lineIntersectionAlgorithm(point, pointParallel, ontoLine.nodes[0], ontoLine.nodes[1]);
        if (intersection != undefined) {
            var midPoint = new XY((intersection.x + point.x) * 0.5, (intersection.y + point.y) * 0.5);
            var perp = new XY(-align.y, align.x);
            var midPoint2 = new XY(midPoint.x + perp.x, midPoint.y + perp.y);
            return this.creaseThroughPoints(midPoint, midPoint2);
        }
        throw "axiom 7: two crease lines cannot be parallel";
    };
    // use D3 voronoi calculation and pass in as argument 'v'
    CreasePattern.prototype.voronoiGussets = function (v, interp) {
        if (interp === undefined) {
            interp = 0.5;
        }
        // draw classical voronoi graph edges
        v.edges.filter(function (el) { return el !== undefined; })
            .map(function (el) {
            return [new XY(el[0][0], el[0][1]), new XY(el[1][0], el[1][1])];
        }).forEach(function (el) {
            this.newCrease(el[0].x, el[0].y, el[1].x, el[1].y).valley();
        }, this);
        // D3 gives list of edges and cells, we need to make our own list of nodes
        var xyEdges = v.edges.filter(function (el) { return el !== undefined; })
            .map(function (el) {
            return [new XY(el[0][0], el[0][1]), new XY(el[1][0], el[1][1])];
        });
        var vNodes = [];
        for (var i = 0; i < xyEdges.length; i++) {
            vNodes.push({ position: xyEdges[i][0], halfEdges: [], quarterPoints: [], sites: [] });
            vNodes.push({ position: xyEdges[i][1], halfEdges: [], quarterPoints: [], sites: [] });
        }
        vNodes = arrayRemoveDuplicates(vNodes, function (a, b) { return a.position.equivalent(b.position); });
        xyEdges.forEach(function (el, i) {
            for (var n = 0; n < vNodes.length; n++) {
                if (el[0].equivalent(vNodes[n].position)) {
                    vNodes[n].halfEdges.push(i);
                }
                if (el[1].equivalent(vNodes[n].position)) {
                    vNodes[n].halfEdges.push(i);
                }
            }
        });
        // build our list of quarter edges and points
        var quarterEdges = [];
        var quarterPoints = [];
        for (var i = 0; i < v.cells.length; i++) {
            var site = v.cells[i].site;
            var edges = v.cells[i].halfedges.map(function (el) { return v.edges[el]; });
            // voronoi cells shrunk by interp amount
            var theseQuarterEdgeIndices = [];
            edges.forEach(function (el) {
                var midpoints = [el[0], el[1]].map(function (mapEl) {
                    return interpolate(new XY(mapEl[0], mapEl[1]), new XY(site[0], site[1]), interp);
                });
                var endpoints = [new XY(el[0][0], el[0][1]), new XY(el[1][0], el[1][1])];
                for (var n = 0; n < vNodes.length; n++) {
                    if (vNodes[n].position.equivalent(endpoints[0])) {
                        if (!arrayContainsObject(vNodes[n].sites, site)) {
                            vNodes[n].sites.push(site);
                        }
                        if (arrayContains(vNodes[n].quarterPoints, midpoints[0], function (a, b) { return a.equivalent(b); }) === undefined) {
                            vNodes[n].quarterPoints.push(midpoints[0]);
                        }
                    }
                    if (vNodes[n].position.equivalent(endpoints[1])) {
                        if (!arrayContainsObject(vNodes[n].sites, site)) {
                            vNodes[n].sites.push(site);
                        }
                        if (arrayContains(vNodes[n].quarterPoints, midpoints[1], function (a, b) { return a.equivalent(b); }) === undefined) {
                            vNodes[n].quarterPoints.push(midpoints[1]);
                        }
                    }
                }
                for (var n = 0; n < vNodes.length; n++) {
                    // sort v nodes
                    vNodes[n].quarterPoints = vNodes[n].quarterPoints.sort(function (a, b) {
                        var aV = new XY(a.x - vNodes[n].position.x, a.y - vNodes[n].position.y);
                        var bV = new XY(b.x - vNodes[n].position.x, b.y - vNodes[n].position.y);
                        var aT = Math.atan2(aV.y, aV.x);
                        var bT = Math.atan2(bV.y, bV.x);
                        return (aT < bT) ? -1 : (aT > bT) ? 1 : 0;
                    });
                }
                theseQuarterEdgeIndices.push(quarterEdges.length);
                quarterEdges.push([midpoints[0], midpoints[1]]);
                midpoints.forEach(function (el) { quarterPoints.push(el); });
            });
            v.cells[i].quarterEdges = theseQuarterEdgeIndices;
        }
        quarterEdges.forEach(function (el) {
            this.newCrease(el[0].x, el[0].y, el[1].x, el[1].y).mountain();
        }, this);
        v.quarterEdges = quarterEdges;
        quarterPoints = arrayRemoveDuplicates(quarterPoints, function (a, b) { return a.equivalent(b); });
        v.quarterPoints = quarterPoints;
        v.nodes = vNodes;
        this.clean();
        // draw the inner rabbit ear joints
        v.nodes.forEach(function (el) {
            if (el.quarterPoints.length === 3) {
                var triangle = []; // nodes and their opposite edges
                // gather the interior angles of the triangle
                // determine if it is acute or obtuse (opposite face requires to be hidden)
                for (var i = 0; i < el.quarterPoints.length; i++) {
                    var nextI = (i + 1) % el.quarterPoints.length;
                    var prevI = (i + el.quarterPoints.length - 1) % el.quarterPoints.length;
                    var a = new XY(el.quarterPoints[prevI].x - el.quarterPoints[i].x, el.quarterPoints[prevI].y - el.quarterPoints[i].y);
                    var b = new XY(el.quarterPoints[nextI].x - el.quarterPoints[i].x, el.quarterPoints[nextI].y - el.quarterPoints[i].y);
                    // smallest of the 2 interior angles
                    var interiorAngle = interiorAngles(a, b)[0];
                    var acuteAngle = true;
                    if (interiorAngle > Math.PI * 0.5) {
                        acuteAngle = false;
                    }
                    triangle.push({
                        point: el.quarterPoints[i],
                        interiorAngle: interiorAngle,
                        oppositeEdgeVisible: acuteAngle
                    });
                }
                // calculate the rabbit ear folds based on 
                for (var i = 0; i < triangle.length; i++) {
                    var nextI = (i + 1) % triangle.length;
                    var prevI = (i + 2) % triangle.length;
                    var prevThird = el.position;
                    var nextThird = el.position;
                    if (triangle[prevI].oppositeEdgeVisible === false ||
                        triangle[nextI].oppositeEdgeVisible === false) {
                        nextThird = triangle[prevI].point;
                        prevThird = triangle[nextI].point;
                    }
                    var bisects = [
                        bisect(prevThird.subtract(triangle[i].point), triangle[prevI].point.subtract(triangle[i].point))[0],
                        bisect(triangle[nextI].point.subtract(triangle[i].point), nextThird.subtract(triangle[i].point))[0],
                    ];
                    var a = new XY(prevThird.y - triangle[i].point.y, prevThird.x - triangle[i].point.x);
                    var b = new XY(triangle[prevI].point.y - triangle[i].point.y, triangle[prevI].point.x - triangle[i].point.x);
                    // var interiors = [
                    // 	0.5 * smallerInteriorAngleVector(a, b),
                    // 	0.5 * smallerInteriorAngleVector(b, a)
                    // 	];
                    var interiors = interiorAngles(a, b).forEach(function (el) { return el * 0.5; });
                    triangle[i].bisectAngles = bisects;
                    triangle[i].interiorAngles = interiors;
                }
                for (var i = 0; i < triangle.length; i++) {
                    var nextI = (i + 1) % triangle.length;
                    var prevI = (i + 2) % triangle.length;
                    if (triangle[i].oppositeEdgeVisible === false) {
                        var nextAbs = Math.atan2(triangle[nextI].point.y - triangle[i].point.y, triangle[nextI].point.x - triangle[i].point.x);
                        var prevAbs = Math.atan2(triangle[prevI].point.y - triangle[i].point.y, triangle[prevI].point.x - triangle[i].point.x);
                        triangle[i].bisectAngles = [
                            nextAbs + triangle[nextI].interiorAngles[0],
                            prevAbs - triangle[prevI].interiorAngles[0]
                        ];
                    }
                }
                var triangleMidpoints = [];
                var hiddenOppositeAngles = [];
                for (var i = 0; i < triangle.length; i++) {
                    var nextI = (i + 1) % triangle.length;
                    var prevI = (i + 2) % triangle.length;
                    if (triangle[i].oppositeEdgeVisible) {
                        this.newCrease(el.quarterPoints[prevI].x, el.quarterPoints[prevI].y, el.quarterPoints[nextI].x, el.quarterPoints[nextI].y).mountain();
                        triangleMidpoints.push(new XY((el.quarterPoints[prevI].x + el.quarterPoints[nextI].x) * 0.5, (el.quarterPoints[prevI].y + el.quarterPoints[nextI].y) * 0.5));
                    }
                    else {
                        var startNode = new XY((el.quarterPoints[prevI].x + el.quarterPoints[nextI].x) * 0.5, (el.quarterPoints[prevI].y + el.quarterPoints[nextI].y) * 0.5);
                        var endNode = el.position;
                        var angle = Math.atan2(endNode.y - startNode.y, endNode.x - startNode.x);
                        while (angle < 0)
                            angle += Math.PI * 2;
                        while (angle >= Math.PI * 2)
                            angle -= Math.PI * 2;
                        hiddenOppositeAngles.push(angle);
                    }
                    // else{
                    // 	triangleMidpoints.push(new XY(el.position.x, el.position.y));						
                    // }
                }
                // this.fragment();
                // var centerNodes = this.nodes.filter(function(fn){ return fn.equivalent(el.position,0.0001); });
                // if(centerNodes.length > 0){
                // var centerEdges = centerNodes[0].adjacentEdges();
                // 	centerEdges.forEach(function(ce){
                // 		var absAng = ce.absoluteAngle();
                // 		var absAng2 = absAng + Math.PI;
                // 		while(absAng2 > Math.PI*2) absAng2 -= Math.PI*2;
                // 		if(arrayContains(hiddenOppositeAngles, absAng, function(a,b){return epsilonEqual(a,b,0.1);}) === undefined && 
                // 		   arrayContains(hiddenOppositeAngles, absAng2, function(a,b){return epsilonEqual(a,b,0.1);}) === undefined ){
                // 			this.removeEdge(ce);
                // 		}
                // 	},this);
                // }
                // triangleMidpoints.forEach(function(tm){
                // 	// var newCrease = this.newCrease( el.position.x, el.position.y, tm.x, tm.y );
                // 	// if(newCrease !== undefined){ newCrease.mountain(); }
                // },this);
                var rabbitEarCenters = [];
                for (var i = 0; i < triangle.length; i++) {
                    var nextI = (i + 1) % triangle.length;
                    var prevI = (i + 2) % triangle.length;
                    if (triangle[i].bisectAngles !== undefined) {
                        for (var ba = 0; ba < triangle[i].bisectAngles.length; ba++) {
                            var dir = new XY(Math.cos(triangle[i].bisectAngles[ba]), Math.sin(triangle[i].bisectAngles[ba]));
                            var crease = this.creaseRayUntilIntersection(triangle[i].point, dir);
                            if (crease.nodes[0].equivalent(triangle[i].point)) {
                                rabbitEarCenters.push(new XY(crease.nodes[1].x, crease.nodes[1].y));
                            }
                            else if (crease.nodes[1].equivalent(triangle[i].point)) {
                                rabbitEarCenters.push(new XY(crease.nodes[0].x, crease.nodes[0].y));
                            }
                            if (crease !== undefined) {
                                crease.valley();
                            }
                        }
                    }
                }
                rabbitEarCenters = arrayRemoveDuplicates(rabbitEarCenters, function (a, b) { return a.equivalent(b); });
                this.fragment();
                triangleMidpoints.forEach(function (tm) {
                    var tmCreases = this.edges.filter(function (cr) {
                        return cr.nodes[0].equivalent(tm, 0.0001) || cr.nodes[1].equivalent(tm, 0.0001);
                    });
                    tmCreases.forEach(function (cr) {
                        for (var i = 0; i < rabbitEarCenters.length; i++) {
                            if (cr.nodes[0].equivalent(rabbitEarCenters[i], 0.0001) ||
                                cr.nodes[1].equivalent(rabbitEarCenters[i], 0.0001)) {
                                cr.mountain();
                            }
                        }
                    });
                }, this);
                // for(var i = 0 ; i < centerEdges.length; i++){
                // 	this.crease(centerEdges[i].x, centerEdges[i].y, rabbitEarCenters[i].x, rabbitEarCenters[i].y);
                // }
                // this.fragment();
                // var centerNodes = this.nodes.filter(function(fn){ return fn.equivalent(el.position,0.0001); });
                // if(centerNodes.length > 0){
                // 	var centerEdges = centerNodes[0].adjacentEdges();
                // 	centerEdges.forEach(function(ce){
                // 		if(ce.orientation !== CreaseDirection.valley){
                // 			this.removeEdge(ce);
                // 		}
                // 	},this);
                // }
                // rabbitEarCenters.forEach(function(re){
                // 	var newCrease = this.newCrease( el.position.x, el.position.y, re.x, re.y );
                // 	if(newCrease !== undefined){ newCrease.valley(); }
                // },this);
                // console.log(triangle);
                el.triangle = triangle;
            }
            else {
                // triangle boundary line
                for (var i = 0; i < el.quarterPoints.length; i++) {
                    var nextI = (i + 1) % el.quarterPoints.length;
                    var prevI = (i + el.quarterPoints.length - 1) % el.quarterPoints.length;
                    var nextNextI = (i + 2) % el.quarterPoints.length;
                    var a1 = new XY(el.quarterPoints[prevI].x - el.quarterPoints[i].x, el.quarterPoints[prevI].y - el.quarterPoints[i].y);
                    var b1 = new XY(el.quarterPoints[nextI].x - el.quarterPoints[i].x, el.quarterPoints[nextI].y - el.quarterPoints[i].y);
                    var interiorAngle1 = interiorAngles(a1, b1)[0];
                    // var interiorAngle1 = smallerInteriorAngleVector(el.quarterPoints[i], el.quarterPoints[prevI], el.quarterPoints[nextI]);
                    var a2 = new XY(el.quarterPoints[i].x - el.quarterPoints[nextI].x, el.quarterPoints[i].y - el.quarterPoints[nextI].y);
                    var b2 = new XY(el.quarterPoints[nextNextI].x - el.quarterPoints[nextI].x, el.quarterPoints[nextNextI].y - el.quarterPoints[nextI].y);
                    var interiorAngle2 = interiorAngles(a2, b2)[0];
                    // var interiorAngle2 = smallerInteriorAngleVector(el.quarterPoints[nextI], el.quarterPoints[i], el.quarterPoints[nextNextI]);
                    if (interiorAngle1 + interiorAngle2 > Math.PI * 0.5) {
                        this.newCrease(el.quarterPoints[i].x, el.quarterPoints[i].y, el.quarterPoints[nextI].x, el.quarterPoints[nextI].y).mountain();
                    }
                }
            }
            // site - quarterpoint ribs
            el.quarterPoints.forEach(function (qp) {
                this.newCrease(el.position.x, el.position.y, qp.x, qp.y).mountain();
            }, this);
            // this.fragment();
        }, this);
    };
    // // use D3 voronoi calculation and pass in as argument 'v'
    CreasePattern.prototype.voronoiSimple = function (v, interp) {
        if (interp === undefined) {
            interp = 0.5;
        }
        // protection against null data inside array
        var vEdges = v.edges.filter(function (el) { return el !== undefined; });
        for (var e = 0; e < vEdges.length; e++) {
            var endpts = [new XY(vEdges[e][0][0], vEdges[e][0][1]),
                new XY(vEdges[e][1][0], vEdges[e][1][1])];
            // traditional voronoi diagram lines
            this.newCrease(endpts[0].x, endpts[0].y, endpts[1].x, endpts[1].y).valley();
            // for each edge, find the left and right cell center nodes
            var sideNodes = [];
            if (vEdges[e].left !== undefined) {
                sideNodes.push(new XY(vEdges[e].left[0], vEdges[e].left[1]));
            }
            if (vEdges[e].right !== undefined) {
                sideNodes.push(new XY(vEdges[e].right[0], vEdges[e].right[1]));
            }
            var midpts = sideNodes.map(function (el) {
                return [interpolate(endpts[0], el, interp), interpolate(endpts[1], el, interp)];
            });
            for (var m = 0; m < midpts.length; m++) {
                // interpolate from the cell edge endpoints to the node
                this.newCrease(midpts[m][0].x, midpts[m][0].y, midpts[m][1].x, midpts[m][1].y).mountain();
                // connect smaller voronoi cells to the large voronoi cell endpoints
                this.newCrease(endpts[0].x, endpts[0].y, midpts[m][0].x, midpts[m][0].y).mountain();
                this.newCrease(endpts[1].x, endpts[1].y, midpts[m][1].x, midpts[m][1].y).mountain();
            }
        }
    };
    // use D3 voronoi calculation and pass in as argument 'v'
    CreasePattern.prototype.voronoi = function (v, interp) {
        if (interp === undefined) {
            interp = 0.5;
        }
        // protection against null data inside array
        var vEdges = v.edges.filter(function (el) { return el !== undefined; });
        for (var e = 0; e < vEdges.length; e++) {
            var endpts = [new XY(vEdges[e][0][0], vEdges[e][0][1]),
                new XY(vEdges[e][1][0], vEdges[e][1][1])];
            // traditional voronoi diagram lines
            this.newCrease(endpts[0].x, endpts[0].y, endpts[1].x, endpts[1].y).valley();
            // for each edge, find the left and right cell center nodes
            var sideNodes = [];
            if (vEdges[e].left !== undefined) {
                sideNodes.push(new XY(vEdges[e].left[0], vEdges[e].left[1]));
            }
            if (vEdges[e].right !== undefined) {
                sideNodes.push(new XY(vEdges[e].right[0], vEdges[e].right[1]));
            }
            var midpts = sideNodes.map(function (el) {
                return [interpolate(endpts[0], el, interp), interpolate(endpts[1], el, interp)];
            });
            var arteries = [];
            for (var m = 0; m < midpts.length; m++) {
                // interpolate from the cell edge endpoints to the node
                this.newCrease(midpts[m][0].x, midpts[m][0].y, midpts[m][1].x, midpts[m][1].y).mountain();
                // connect smaller voronoi cells to the large voronoi cell endpoints
                var a = this.newCrease(endpts[0].x, endpts[0].y, midpts[m][0].x, midpts[m][0].y).mountain();
                var b = this.newCrease(endpts[1].x, endpts[1].y, midpts[m][1].x, midpts[m][1].y).mountain();
                arteries.push([a, b]);
            }
            if (midpts.length == 2) {
                var c = [];
                var a = this.crease(midpts[0][0], midpts[1][0]);
                var b = this.crease(midpts[0][1], midpts[1][1]);
                if (a !== undefined) {
                    a.mark();
                }
                if (b !== undefined) {
                    b.mark();
                }
                c.push(this.creaseAngleBisectorSmaller(arteries[0][0], a));
                c.push(this.creaseAngleBisectorSmaller(a, arteries[1][0]));
                c.push(this.creaseAngleBisectorSmaller(b, arteries[0][1]));
                c.push(this.creaseAngleBisectorSmaller(arteries[1][1], b));
                for (var i = 0; i < c.length; i++) {
                    if (c[i] !== undefined) {
                        c[i].noCrossing();
                    }
                }
            }
        }
    };
    /////////////////////////////////////////////////////////////////////
    CreasePattern.prototype.boundaryLineIntersection = function (origin, direction) {
        var opposite = new XY(-direction.x, -direction.y);
        var intersects = [];
        for (var i = 0; i < this.boundary.edges.length; i++) {
            var endpts = this.boundary.edges[i].nodes;
            var test1 = rayLineSegmentIntersection(origin, direction, endpts[0], endpts[1]);
            var test2 = rayLineSegmentIntersection(origin, opposite, endpts[0], endpts[1]);
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
            var test = rayLineSegmentIntersection(origin, direction, endpts[0], endpts[1]);
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
    CreasePattern.prototype.bounds = function () {
        return this.boundary.bounds();
    };
    CreasePattern.prototype.square = function (width) {
        // console.log("setting page size: square()");
        var w = 1.0;
        // todo: isReal() - check if is real number
        if (width != undefined && width != 0) {
            w = Math.abs(width);
        }
        return this.setBoundary([new XY(0, 0), new XY(w, 0), new XY(w, w), new XY(0, w)]);
    };
    CreasePattern.prototype.rectangle = function (width, height) {
        // console.log("setting page size: rectangle(" + width + "," + height + ")");
        // todo: should this return undefined if a rectangle has not been made? or return this?
        if (width === undefined || height === undefined) {
            return undefined;
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
        // TODO: make sure paper edges are winding clockwise!!
        // clear old data
        if (this.boundary === undefined) {
            this.boundary = new PlanarGraph();
        }
        else {
            this.boundary.clear();
        }
        // 1: collect the nodes that are attached to border edges
        // var edgeNodes = this.edges
        // 	.filter(function(el){ return el.orientation !== CreaseDirection.border; })
        // 	.map(function(el){ return el.nodes; });
        // this.edges = this.edges.filter(function(el){ return el.orientation !== CreaseDirection.border; });
        // var edgeNodes = this.edges.map()
        // 2: iterate over edge nodes and remove them if they are unused
        // todo: if an edge gets removed, it will leave behind its nodes. we might need the following:
        // this.cleanUnusedNodes();
        // todo: test that this is the right way to remove last item:
        // if( points[0].equivalent(points[points.length-1]) ){ points.pop(); }
        return this;
    };
    CreasePattern.prototype.setBoundary = function (points) {
        // TODO: make sure paper edges are winding clockwise!!
        // todo: test that this is the right way to remove last item:
        if (points[0].equivalent(points[points.length - 1])) {
            points.pop();
        }
        // clear old data
        if (this.boundary === undefined) {
            this.boundary = new PlanarGraph();
        }
        else {
            this.boundary.clear();
        }
        this.edges = this.edges.filter(function (el) { return el.orientation !== CreaseDirection.border; });
        // todo: if an edge gets removed, it will leave behind its nodes. we might need the following:
        this.cleanAllUselessNodes();
        for (var i = 0; i < points.length; i++) {
            var nextI = (i + 1) % points.length;
            this.newPlanarEdge(points[i].x, points[i].y, points[nextI].x, points[nextI].y).border();
            this.boundary.newPlanarEdge(points[i].x, points[i].y, points[nextI].x, points[nextI].y);
        }
        this.cleanDuplicateNodes();
        this.boundary.cleanDuplicateNodes();
        this.boundary.generateFaces();
        return this;
    };
    CreasePattern.prototype.setMinRectBoundary = function () {
        this.boundary = new PlanarGraph();
        this.edges = this.edges.filter(function (el) { return el.orientation !== CreaseDirection.border; });
        var xMin = Infinity;
        var xMax = 0;
        var yMin = Infinity;
        var yMax = 0;
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].x > xMax)
                xMax = this.nodes[i].x;
            if (this.nodes[i].x < xMin)
                xMin = this.nodes[i].x;
            if (this.nodes[i].y > yMax)
                yMax = this.nodes[i].y;
            if (this.nodes[i].y < yMin)
                yMin = this.nodes[i].y;
        }
        this.setBoundary([new XY(xMin, yMin), new XY(xMax, yMin), new XY(xMax, yMax), new XY(xMin, yMax)]);
        return this;
    };
    ///////////////////////////////////////////////////////////////
    // CLEAN  /  REMOVE PARTS
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
    CreasePattern.prototype.topLeftCorner = function () {
        var boundaries = this.edges
            .filter(function (el) { return el.orientation === CreaseDirection.border; })
            .sort(function (a, b) { var ay = a.nodes[0].y + a.nodes[1].y; var by = b.nodes[0].y + b.nodes[1].y; return (ay > by) ? 1 : (ay < by) ? -1 : 0; });
        if (boundaries.length > 0) {
            return boundaries[0].nodes.sort(function (a, b) { return (a.x > b.x) ? 1 : (a.x < b.x) ? -1 : 0; })[0];
        }
        return undefined;
    };
    CreasePattern.prototype.topRightCorner = function () {
        var boundaries = this.edges
            .filter(function (el) { return el.orientation === CreaseDirection.border; })
            .sort(function (a, b) { var ay = a.nodes[0].y + a.nodes[1].y; var by = b.nodes[0].y + b.nodes[1].y; return (ay > by) ? 1 : (ay < by) ? -1 : 0; });
        if (boundaries.length > 0) {
            return boundaries[0].nodes.sort(function (a, b) { return (a.x > b.x) ? -1 : (a.x < b.x) ? 1 : 0; })[0];
        }
        return undefined;
    };
    ///////////////////////////////////////////////////////////////
    // SYMMETRY
    CreasePattern.prototype.bookSymmetry = function () {
        var top = this.topEdge();
        var bottom = this.bottomEdge();
        var a = new XY((top.nodes[0].x + top.nodes[1].x) * 0.5, (top.nodes[0].y + top.nodes[1].y) * 0.5);
        var b = new XY((bottom.nodes[0].x + bottom.nodes[1].x) * 0.5, (bottom.nodes[0].y + bottom.nodes[1].y) * 0.5);
        return this.setSymmetryLine(a, b);
    };
    CreasePattern.prototype.diagonalSymmetry = function () {
        var top = this.topEdge().nodes.sort(function (a, b) { return (a.x < b.x) ? 1 : (a.x > b.x) ? -1 : 0; });
        var bottom = this.bottomEdge().nodes.sort(function (a, b) { return (a.x < b.x) ? -1 : (a.x > b.x) ? 1 : 0; });
        return this.setSymmetryLine(top[0], bottom[0]);
    };
    CreasePattern.prototype.noSymmetry = function () {
        return this.setSymmetryLine();
    };
    CreasePattern.prototype.setSymmetryLine = function (a, b) {
        if (!isValidPoint(a) || !isValidPoint(b)) {
            this.symmetryLine = undefined;
        }
        else {
            this.symmetryLine = [a, b];
        }
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
    CreasePattern.prototype.contains = function (a, b) {
        var point;
        if (isValidPoint(a)) {
            point = new XY(a.x, a.y);
        }
        else if (isValidNumber(a) && isValidNumber(b)) {
            point = new XY(a, b);
        }
        if (this.boundary.faces.length > 0) {
            return this.boundary.faces[0].contains(point);
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
    // 	var intersections = super.fragment();
    // 	this.interestingPoints = this.interestingPoints.concat(intersections);
    // 	return intersections;
    // }
    CreasePattern.prototype.joinedPaths = function () {
        var cp = this.duplicate();
        cp.clean();
        cp.removeIsolatedNodes();
        var paths = [];
        while (cp.edges.length > 0) {
            var node = cp.nodes[0];
            var adj = node.adjacentNodes();
            var path = [];
            if (adj.length === 0) {
                // this shouldn't ever happen
                cp.removeIsolatedNodes();
            }
            else {
                var nextNode = adj[0];
                var edge = cp.getEdgeConnectingNodes(node, nextNode);
                path.push(new XY(node.x, node.y));
                // remove edge
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
                    path.push(new XY(node.x, node.y));
                    cp.edges = cp.edges.filter(function (el) {
                        return !((el.nodes[0] === node && el.nodes[1] === nextNode) ||
                            (el.nodes[0] === nextNode && el.nodes[1] === node));
                    });
                    cp.removeIsolatedNodes();
                    node = nextNode;
                    adj = node.adjacentNodes();
                }
                path.push(new XY(node.x, node.y));
            }
            paths.push(path);
        }
        return paths;
    };
    CreasePattern.prototype.svgMin = function (size) {
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
        var paths = this.joinedPaths();
        var blob = "";
        blob = blob + "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"" + ((width + padX * 2) * scale) + "px\" height=\"" + ((height + padY * 2) * scale) + "px\" viewBox=\"0 0 " + ((width + padX * 2) * scale) + " " + ((height + padY * 2) * scale) + "\">\n<g>\n";
        for (var i = 0; i < paths.length; i++) {
            if (paths[i].length >= 0) {
                blob += "<polyline fill=\"none\" stroke-width=\"" + strokeWidth + "\" stroke=\"#000000\" points=\"";
                for (var j = 0; j < paths[i].length; j++) {
                    var point = paths[i][j];
                    blob += (scale * point.x).toFixed(4) + "," + (scale * point.y).toFixed(4) + " ";
                }
                blob += "\"/>\n";
            }
        }
        //////// RECT BORDER
        // blob += "<line stroke=\"#000000\" x1=\"0\" y1=\"0\" x2=\"" +scale+ "\" y2=\"0\"/>\n" + "<line fill=\"none\" stroke=\"#000000\" stroke-miterlimit=\"10\" x1=\"" +scale+ "\" y1=\"0\" x2=\"" +scale+ "\" y2=\"" +scale+ "\"/>\n" + "<line fill=\"none\" stroke=\"#000000\" stroke-miterlimit=\"10\" x1=\"" +scale+ "\" y1=\"" +scale+ "\" x2=\"0\" y2=\"" +scale+ "\"/>\n" + "<line fill=\"none\" stroke=\"#000000\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"" +scale+ "\" x2=\"0\" y2=\"0\"/>\n";
        blob = blob + "</g>\n</svg>\n";
        return blob;
    };
    CreasePattern.prototype.svg = function (size) {
        if (size === undefined || size <= 0) {
            size = 600;
        }
        var bounds = this.bounds();
        var width = bounds.size.width;
        var height = bounds.size.height;
        var orgX = bounds.topLeft.x;
        var orgY = bounds.topLeft.y;
        var scale = size / (width);
        console.log(bounds);
        console.log(width);
        console.log(orgX);
        console.log(scale);
        var blob = "";
        var widthScaled = ((width) * scale).toFixed(2);
        var heightScaled = ((height) * scale).toFixed(2);
        var strokeWidth = ((width) * scale * 0.0025).toFixed(1);
        var dashW = ((width) * scale * 0.0025 * 3).toFixed(1);
        if (strokeWidth === "0" || strokeWidth === "0.0") {
            strokeWidth = "0.5";
        }
        blob = blob + "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"" + widthScaled + "px\" height=\"" + heightScaled + "px\" viewBox=\"0 0 " + widthScaled + " " + heightScaled + "\">\n<g>\n";
        //////// RECT BORDER
        blob += "<line stroke=\"#000000\" stroke-width=\"" + strokeWidth + "\" x1=\"0\" y1=\"0\" x2=\"" + widthScaled + "\" y2=\"0\"/>\n" + "<line fill=\"none\" stroke-width=\"" + strokeWidth + "\" stroke=\"#000000\" stroke-miterlimit=\"10\" x1=\"" + widthScaled + "\" y1=\"0\" x2=\"" + widthScaled + "\" y2=\"" + heightScaled + "\"/>\n" + "<line fill=\"none\" stroke-width=\"" + strokeWidth + "\" stroke=\"#000000\" stroke-miterlimit=\"10\" x1=\"" + widthScaled + "\" y1=\"" + heightScaled + "\" x2=\"0\" y2=\"" + heightScaled + "\"/>\n" + "<line fill=\"none\" stroke-width=\"" + strokeWidth + "\" stroke=\"#000000\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"" + heightScaled + "\" x2=\"0\" y2=\"0\"/>\n";
        ////////
        var valleyStyle = "stroke=\"#4030FF\" stroke-dasharray=\"" + dashW + "," + dashW + "\" ";
        var mountainStyle = "stroke=\"#FF1030\" ";
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
        this.fragment();
        this.clean();
        return this;
    };
    return CreasePattern;
}(PlanarGraph));
