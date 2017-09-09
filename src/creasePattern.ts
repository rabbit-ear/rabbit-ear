// creasePattern.js
// for the purposes of performing origami operations on a planar graph
// mit open source license, robby kraft

/// <reference path="planarGraph.ts"/>

"use strict";

enum CreaseDirection{
	mark,
	border,
	mountain,
	valley
}

class Fold{
	func = undefined;
	args = [];
	constructor(foldFunction, argumentArray){
		this.func = foldFunction;
		this.args = argumentArray;
	}
}

class FoldSequence{
	// uses edge and node indices
	// because the actual objects will go away, or don't yet exist at the beginning
	// nope nopE! that't won't work. if you "implement" the fold sequence on another sized
	// sheet of paper, the fold won't execute the same way, different node indices will get applied.
}

class CreaseNode extends PlanarNode{
	graph:CreasePattern;

	isBoundary():boolean{
		for(var i = 0; i < this.graph.boundary.edges.length; i++){
			var thisPt = new XY(this.x, this.y);
			if(onSegment(thisPt, this.graph.boundary.edges[i].nodes[0], this.graph.boundary.edges[i].nodes[1])){ return true; }
		}
		return false;
	}

	kawasaki():[number,number]{
		var angles = this.interiorAngles();
		// only computes if number of interior angles are even
		if(angles.length % 2 != 0){ return undefined; }
		var aSum = angles.filter(function(el,i){return i%2;})
		                 .reduce(function(sum, el) {return sum + el.angle; }, 0);
		var bSum = angles.filter(function(el,i){return !(i%2);})
		                 .reduce(function(sum, el) { return sum + el.angle; }, 0);
		return [aSum, bSum];
	}

	flatFoldable():boolean{
		if(this.isBoundary()){ return true; }
		var sums = this.kawasaki();
		if(sums == undefined){ return false; } // not an even number of interior angles
		if(epsilonEqual(sums[0], Math.PI, 0.01) && 
		   epsilonEqual(sums[1], Math.PI, 0.01) ){ return true; }
		return false;
	}

	//////////////////////////////
	// FOLDS
	// AXIOM 1
	creaseLineThrough(point:XY):Crease{
		return this.graph.creaseThroughPoints(this, point);
	}
	// AXIOM 2
	creaseToPoint(point:XY):Crease{
		return this.graph.creasePointToPoint(this, point);
	}
}

class Crease extends PlanarEdge{

	graph:CreasePattern;
	orientation:CreaseDirection;
	// how it was made
	madeBy:Fold;

	constructor(graph:CreasePattern, node1:CreaseNode, node2:CreaseNode){
		super(graph, node1, node2);
		this.orientation = CreaseDirection.mark;
	};
	mark(){ this.orientation = CreaseDirection.mark; return this;}
	mountain(){ this.orientation = CreaseDirection.mountain; return this;}
	valley()  { this.orientation = CreaseDirection.valley; return this;}
	border()  { this.orientation = CreaseDirection.border; return this;}

	// AXIOM 3
	creaseToEdge(edge:Crease):Crease[]{
		return this.graph.creaseEdgeToEdge(this, edge);
	}
}

class CreasePattern extends PlanarGraph{

	nodes:CreaseNode[];
	edges:Crease[];
	boundary:PlanarGraph;

	symmetryLine:[XY, XY] = undefined;

	nodeType = CreaseNode;
	edgeType = Crease;

	landmarkNodes():XY[]{ return this.nodes.map(function(el){ return new XY(el.x, el.y); }); }

	constructor(){
		super();
		if(this.boundary === undefined){ this.boundary = new PlanarGraph(); }
		this.square();
	}

	/** This will deep-copy the contents of this graph and return it as a new object
	 * @returns {CreasePattern} 
	 */
	duplicate():CreasePattern{
		this.nodeArrayDidChange();
		this.edgeArrayDidChange();
		this.faceArrayDidChange();
		var g = new CreasePattern();
		g.boundary = undefined;
		g.clear();
		for(var i = 0; i < this.nodes.length; i++){
			var n = g.addNode(new CreaseNode(g));
			(<any>Object).assign(n, this.nodes[i]);
			n.graph = g; n.index = i;
		}
		for(var i = 0; i < this.edges.length; i++){
			var index = [this.edges[i].nodes[0].index, this.edges[i].nodes[1].index];
			var e = g.addEdge(new Crease(g, g.nodes[index[0]], g.nodes[index[1]]));
			(<any>Object).assign(e, this.edges[i]);
			e.graph = g; e.index = i;
			e.nodes = [g.nodes[index[0]], g.nodes[index[1]]];
			// e.orientation = this.edges[i].orientation;
		}
		for(var i = 0; i < this.faces.length; i++){
			var f = new PlanarFace(g);
			g.faces.push(f);
			f.graph = g; 
			f.index = i;
			// (<any>Object).assign(f, this.faces[i]);
			for(var j=0;j<this.faces[i].nodes.length;j++){
				var nIndex = this.faces[i].nodes[j].index;
				f.nodes.push(g.nodes[nIndex]);
			}
			for(var j=0;j<this.faces[i].edges.length;j++){
				var eIndex = this.faces[i].edges[j].index;
				f.edges.push(g.edges[eIndex]);
			}
			for(var j=0;j<this.faces[i].angles.length;j++){
				f.angles.push(this.faces[i].angles[j]); 
			}
		}
		// boundary
		this.boundary.nodeArrayDidChange();
		this.boundary.edgeArrayDidChange();
		var b = new PlanarGraph();
		for(var i = 0; i < this.boundary.nodes.length; i++){
			var bn = b.addNode(new PlanarNode(b));
			(<any>Object).assign(bn, this.boundary.nodes[i]);
			bn.graph = b; bn.index = i;
		}
		for(var i = 0; i < this.boundary.edges.length; i++){
			var index = [this.boundary.edges[i].nodes[0].index, this.boundary.edges[i].nodes[1].index];
			var be = b.addEdge(new PlanarEdge(b, b.nodes[index[0]], b.nodes[index[1]]));
			(<any>Object).assign(be, this.boundary.edges[i]);
			be.graph = b; be.index = i;
			be.nodes = [b.nodes[index[0]], b.nodes[index[1]]];
		}
		for(var i = 0; i < this.boundary.faces.length; i++){
			var bf = new PlanarFace(b);
			(<any>Object).assign(bf, this.boundary.faces[i]);
			for(var j=0;j<this.boundary.faces[i].nodes.length;j++){bf.nodes.push(b.nodes[this.boundary.faces[i].nodes[j].index]);}
			for(var j=0;j<this.boundary.faces[i].edges.length;j++){bf.edges.push(b.edges[this.boundary.faces[i].edges[j].index]);}
			for(var j=0;j<this.boundary.faces[i].angles.length;j++){bf.angles.push(this.boundary.faces[i].angles[j]); }
			bf.graph = b;
			b.faces.push(f);
		}
		g.boundary = b;
		return g;
	}

	possibleFolds3(edges?:Crease[]):CreasePattern{
		var next = this.duplicate();
		next.nodes = [];
		next.edges = [];
		next.faces = [];
		if(edges === undefined){ edges = this.edges; }
		for(var i = 0; i < edges.length-1; i++){
			for(var j = i+1; j < edges.length; j++){
				next.creaseEdgeToEdge(edges[i], edges[j]);
			}
		}
		next.cleanDuplicateNodes();
		return next;
	}

	possibleFolds():CreasePattern{
		var next = this.duplicate();
		next.nodes = [];
		next.edges = [];
		next.faces = [];
		for(var i = 0; i < this.edges.length-1; i++){
			for(var j = i+1; j < this.edges.length; j++){
				next.creaseEdgeToEdge(this.edges[i], this.edges[j]);
			}
		}
		for(var i = 0; i < this.nodes.length-1; i++){
			for(var j = i+1; j < this.nodes.length; j++){
				next.creaseThroughPoints(this.nodes[i], this.nodes[j]);
				next.creasePointToPoint(this.nodes[i], this.nodes[j]);
			}
		}
		next.cleanDuplicateNodes();
		return next;
	}

	possibleFolds2():CreasePattern{
		var next = this.duplicate();
		next.nodes = [];
		next.edges = [];
		next.faces = [];
		for(var i = 0; i < this.nodes.length-1; i++){
			for(var j = i+1; j < this.nodes.length; j++){
				next.creasePointToPoint(this.nodes[i], this.nodes[j]);
			}
		}
		next.cleanDuplicateNodes();
		return next;
	}

	possibleFolds1():CreasePattern{
		var next = this.duplicate();
		next.nodes = [];
		next.edges = [];
		next.faces = [];
		for(var i = 0; i < this.nodes.length-1; i++){
			for(var j = i+1; j < this.nodes.length; j++){
				next.creaseThroughPoints(this.nodes[i], this.nodes[j]);
			}
		}
		next.cleanDuplicateNodes();
		return next;
	}
	
	///////////////////////////////////////////////////////////////
	// ADD PARTS

	fold(param1, param2, param3, param4){
		// detects which parameters are there
	}

	foldInHalf():Crease{
		var crease;
		var bounds = this.boundingBox();
		var centroid = new XY(bounds.origin.x + bounds.size.width*0.5,
		                      bounds.origin.y + bounds.size.height*0.5);

		// var edges = [this.boundary.]

		var validCreases = this.possibleFolds3().edges.filter(function(el){ 
			return onSegment(centroid, el.nodes[0], el.nodes[1]);
		}).sort(function(a,b){ 
			var aSum = a.nodes[0].index + a.nodes[1].index;
			var bSum = b.nodes[0].index + b.nodes[1].index;
			return (aSum>bSum)?1:(aSum<bSum)?-1:0;
		});
		console.log(validCreases);
		var edgeCount = this.edges.length;
		var i = 0;
		do{
			// console.log("new round");
			// console.log(this.edges.length);
			crease = this.creaseThroughPoints(validCreases[i].nodes[0], validCreases[i].nodes[1]);
			// console.log(this.edges.length);
			this.clean();
			i++;
		}while( edgeCount === this.edges.length && i < validCreases.length );
		if(edgeCount !== this.edges.length) return crease;

		// if(epsilonEqual(this.width(), this.height())){
		// 		this.clean();
		// 	var edgeCount = this.edges.length;
		// 	var edgeMidpoints = this.edges.map(function(el){return el.midpoint();});
		// 	var arrayOfPointsAndMidpoints = this.nodes.map(function(el){return new XY(el.x, el.y);}).concat(edgeMidpoints);
		// 	// console.log(arrayOfPointsAndMidpoints);
		// 	var bounds = this.boundingBox();
		// 	var centroid = new XY(bounds.origin.x + bounds.size.width*0.5,
		// 	                      bounds.origin.y + bounds.size.height*0.5);
		// 	var i = 0;
		// 	do{
		// 		// console.log("new round");
		// 		// console.log(this.edges.length);
		// 		crease = this.creaseThroughPoints(arrayOfPointsAndMidpoints[i], centroid);
		// 		// console.log(this.edges.length);
		// 		this.clean();
		// 		i++;
		// 	}while( edgeCount === this.edges.length && i < arrayOfPointsAndMidpoints.length );
		// 	if(edgeCount !== this.edges.length) return crease;
		// }
		return;
	}

	pointInside(p:XY){
		for(var i = 0; i < this.boundary.edges.length; i++){
			var endpts = this.boundary.edges[i].nodes;
			var cross = (p.y - endpts[0].y) * (endpts[1].x - endpts[0].x) - 
			            (p.x - endpts[0].x) * (endpts[1].y - endpts[0].y);
			if (cross < 0) return false;
		}
		return true;
	}

	newCrease(a_x:number, a_y:number, b_x:number, b_y:number):Crease{
		// use this.crease() instead
		// this is a private function and expects you have checked boundary intersect conditions
		this.creaseSymmetry(a_x, a_y, b_x, b_y);
		return <Crease>this.newPlanarEdge(a_x, a_y, b_x, b_y);
	}

	/** Create a crease that is a line segment, and will crop if it extends beyond boundary
	 * @arg 4 numbers or 2 XYs
	 * @returns {Crease} pointer to the Crease
	 */
	crease(a:any, b:any, c?:any, d?:any):Crease{
		if(a instanceof Crease){ }
		var endpoints = undefined;
		// input (a and b) are 2 xy points
		// if(a.hasOwnProperty('x') && a.hasOwnProperty('y') && 
		//    b.hasOwnProperty('x') && b.hasOwnProperty('y')){
		if(isValidPoint(a) && isValidPoint(b)){
			endpoints = this.clipLineSegmentInBoundary(a, b);
		}
		// input (a b and c d) are x and y of two points
		if(typeof a==='number' && typeof b==='number' && typeof c==='number' && typeof d==='number'){
			if(!isValidNumber(a) || !isValidNumber(b) || !isValidNumber(c) || !isValidNumber(d)){ return undefined; }
			endpoints = this.clipLineSegmentInBoundary(new XY(a,b), new XY(c,d));
		}
		if(endpoints === undefined || endpoints.length < 2){ return; }//throw "crease(): coordinates lie outside boundary"; }
		return this.newCrease(endpoints[0].x, endpoints[0].y, endpoints[1].x, endpoints[1].y);
	}

	creaseRay(origin:XY,direction:XY):Crease{
		var endpoints = this.clipRayInBoundary(origin, direction);
		if(endpoints === undefined) { throw "creaseRay does not appear to be inside the boundary"; }
		return this.newCrease(endpoints[0].x, endpoints[0].y, endpoints[1].x, endpoints[1].y);
	}

	creaseRayUntilIntersection(origin:XY, direction:XY):Crease{
		if(!isValidPoint(origin) || !isValidPoint(direction)){ return undefined; }
		var nearestIntersection = undefined;
		var intersections = this.edges
			.map(function(el){ return rayLineSegmentIntersectionAlgorithm(origin, direction, el.nodes[0], el.nodes[1]); })
			.filter(function(el){ return el !== undefined; })
			.filter(function(el){ return !el.equivalent(origin) })
			.sort(function(a,b){
				var da = Math.sqrt(Math.pow(origin.x-a.x,2) + Math.pow(origin.y-a.y,2));
				var db = Math.sqrt(Math.pow(origin.x-b.x,2) + Math.pow(origin.y-b.y,2));
				return (da > db)?1:(da < db)?-1:0;
			});
		if(intersections.length){
			return this.crease(origin, intersections[0]);
		} else{
			return this.creaseRay(origin, direction);
		}
	}

	creaseAngle(origin:XY,radians:number):Crease{
		return this.creaseRay(origin, new XY(Math.cos(radians), Math.sin(radians)));
	}

	creaseAngleBisector(a:Crease, b:Crease):Crease{
		var commonNode = <PlanarNode>a.commonNodeWithEdge(b);
		if(commonNode === undefined) return undefined;
		var aAngle = a.absoluteAngle(commonNode);
		var bAngle = b.absoluteAngle(commonNode);
		var clockwise = clockwiseAngleFrom(bAngle, aAngle);
		var newAngle = bAngle - clockwise*0.5 + Math.PI;
		return this.creaseRay(commonNode, new XY(Math.cos(newAngle), Math.sin(newAngle)));
	}

	creaseSymmetry(ax:number, ay:number, bx:number, by:number):Crease{
		if(this.symmetryLine === undefined){ return undefined; }
		var ra = reflectPointAcrossLine(new XY(ax, ay), this.symmetryLine[0], this.symmetryLine[1]);
		var rb = reflectPointAcrossLine(new XY(bx, by), this.symmetryLine[0], this.symmetryLine[1]);
		return <Crease>this.newPlanarEdge(ra.x, ra.y, rb.x, rb.y);
	}

	clipLineSegmentInBoundary(a:XY, b:XY):[XY, XY]{
		// todo this only works for convex polygon shaped boundary
		var aInside = this.pointInside(a);
		var bInside = this.pointInside(b);
		if(aInside && bInside){ return [a, b]; }
		// if both are outside, it's still possible the line crosses into the boundary
		// if(!aInside && !bInside) { return this.clipLineInBoundary(a, b); }
		// maybe we don't want this feature

		var inside = a;
		var outside = b;
		if(bInside){ outside = a; inside = b; }

		var intersection = undefined;
		for(var i = 0; i < this.boundary.edges.length; i++){
			intersection = lineSegmentIntersectionAlgorithm(inside, outside, this.boundary.edges[i].nodes[0], this.boundary.edges[i].nodes[1]);
			if(intersection !== undefined){ break; }
		}
		if(intersection === undefined){ return undefined; }
		if( aInside ){ return [inside, intersection]; }
		else         { return [intersection, inside]; }
	}

	clipRayInBoundary(origin:XY, direction:XY):[XY, XY]{
		// todo this only works for convex polygon shaped boundary, needs to search for nearest point to origin
		if(!this.pointInside(origin)){
			var b = new XY(origin.x+direction.x, origin.y+direction.y);
			return this.clipLineInBoundary(origin, b);
		}
		for(var i = 0; i < this.boundary.edges.length; i++){
			var intersection = rayLineSegmentIntersectionAlgorithm(origin, direction, this.boundary.edges[i].nodes[0], this.boundary.edges[i].nodes[1]);
			if(intersection != undefined){ return [origin, intersection]; }
		}
	}

	clipLineInBoundary(a:XY, b:XY):[XY, XY]{
		// todo this only works for convex polygon shaped boundary
		var b_a = new XY(b.x - a.x, b.y - a.y);
		var intersects = this.boundaryLineIntersection(a, b_a);
		if(intersects.length === 2){ 
			return [intersects[0], intersects[1]]; 
		}
	}

	// AXIOM 1
	creaseThroughPoints(a:XY, b:XY):Crease{
		var endPoints = this.clipLineInBoundary(a,b);
		if(endPoints === undefined){ return; }//throw "creaseThroughPoints(): crease line doesn't cross inside boundary"; }
		var newCrease = this.newCrease(endPoints[0].x, endPoints[0].y, endPoints[1].x, endPoints[1].y);
		newCrease.madeBy = new Fold(this.creaseThroughPoints, [new XY(a.x,a.y), new XY(b.x,b.y)]);
		return newCrease;
	}
	// AXIOM 2
	creasePointToPoint(a:XY, b:XY):Crease{
		var midpoint = new XY((a.x + b.x)*0.5, (a.y + b.y)*0.5);
		var ab = new XY(b.x - a.x, b.y - a.y);
		var perp1 = new XY(-ab.y, ab.x);
		var intersects = this.boundaryLineIntersection(midpoint, perp1);
		if(intersects.length >= 2){
			var newCrease = this.newCrease(intersects[0].x, intersects[0].y, intersects[1].x, intersects[1].y);
			newCrease.madeBy = new Fold(this.creasePointToPoint, [new XY(a.x,a.y), new XY(b.x,b.y)]);
			return newCrease
		}
		return;
		// throw "points have no perpendicular bisector inside of the boundaries";
	}
	// AXIOM 3
	creaseEdgeToEdge(a:Crease, b:Crease):Crease[]{
		if ( linesParallel(a.nodes[0], a.nodes[1], b.nodes[0], b.nodes[1]) ) {
			var u = new XY(a.nodes[1].x - a.nodes[0].x, a.nodes[1].y - a.nodes[0].y);
			var perp:XY = new XY(u.x, u.y).rotate90();
			var intersect1 = lineIntersectionAlgorithm(u, new XY(u.x+perp.x, u.y+perp.y), a.nodes[0], a.nodes[1]);
			var intersect2 = lineIntersectionAlgorithm(u, new XY(u.x+perp.x, u.y+perp.y), b.nodes[0], b.nodes[1]);
			var midpoint = new XY((intersect1.x + intersect2.x)*0.5, (intersect1.y + intersect2.y)*0.5);
			var crease = this.creaseThroughPoints(midpoint, new XY(midpoint.x+u.x, midpoint.y+u.y));
			if(crease !== undefined){
				crease.madeBy = new Fold(this.creaseEdgeToEdge, [
				new XY(a.nodes[0].x, a.nodes[0].y),
				new XY(a.nodes[1].x, a.nodes[1].y),
				new XY(b.nodes[0].x, b.nodes[0].y),
				new XY(b.nodes[1].x, b.nodes[1].y)]);
			}
			return [crease];
		}
		else {
			var creases:Crease[] = [];
			var intersection = lineIntersectionAlgorithm(a.nodes[0], a.nodes[1], b.nodes[0], b.nodes[1]);
			var u = new XY(a.nodes[1].x - a.nodes[0].x, a.nodes[1].y - a.nodes[0].y);
			var v = new XY(b.nodes[1].x - b.nodes[0].x, b.nodes[1].y - b.nodes[0].y);
			var uMag = u.mag();
			var vMag = v.mag();
			var dir = new XY( (u.x*vMag + v.x*uMag), (u.y*vMag + v.y*uMag) );
			var intersects = this.boundaryLineIntersection(intersection, dir);
			if(intersects.length >= 2){
				creases.push(this.newCrease(intersects[0].x, intersects[0].y, intersects[1].x, intersects[1].y));
			}
			var dir90 = dir.rotate90();
			var intersects90 = this.boundaryLineIntersection(intersection, dir90);
			if(intersects90.length >= 2){
				if(Math.abs(u.cross(dir)) < Math.abs(u.cross(dir90)))
					creases.push(this.newCrease(intersects90[0].x, intersects90[0].y, intersects90[1].x, intersects90[1].y));
				else creases.unshift(this.newCrease(intersects90[0].x, intersects90[0].y, intersects90[1].x, intersects90[1].y));
			}
			if(creases.length){
				for(var i = 0; i < creases.length; i++){ 
					if(creases[i] !== undefined){
						creases[i].madeBy = new Fold(this.creaseEdgeToEdge, [
						new XY(a.nodes[0].x, a.nodes[0].y),
						new XY(a.nodes[1].x, a.nodes[1].y),
						new XY(b.nodes[0].x, b.nodes[0].y),
						new XY(b.nodes[1].x, b.nodes[1].y)]);}
					}
				return creases;
			}
			return;
			// throw "lines have no inner edge inside of the boundaries";
		};
	}
	// AXIOM 4
	creasePerpendicularThroughPoint(line:Crease, point:XY):Crease{
		var ab = new XY(line.nodes[1].x - line.nodes[0].x, line.nodes[1].y - line.nodes[0].y);
		var perp = new XY(-ab.y, ab.x);
		var point2 = new XY(point.x + perp.x, point.y + perp.y);
		var crease = this.creaseThroughPoints(point, point2);
		if(crease !== undefined){ crease.madeBy = new Fold(this.creasePerpendicularThroughPoint, [new XY(line.nodes[0].x, line.nodes[0].y), new XY(line.nodes[1].x, line.nodes[1].y), new XY(point.x, point.y)]); }
		return crease
	}
	// AXIOM 5
	creasePointToLine(origin:XY, point:XY, line:Crease):Crease[]{
		var radius = Math.sqrt( Math.pow(origin.x-point.x,2) + Math.pow(origin.y-point.y,2) );
		var intersections = circleLineIntersectionAlgorithm(origin, radius, line.nodes[0], line.nodes[1]);
		// return (radius*radius) * dr_squared > (D*D)  // check if there are any intersections
		var creases = [];
		for(var i = 0; i < intersections.length; i++){
			creases.push( this.creasePointToPoint(point, intersections[i]) );
		}
		return creases;
	}
	// AXIOM 7
	creasePerpendicularPointOntoLine(point:XY, ontoLine:Crease, perpendicularTo:Crease):Crease{
		var endPts = perpendicularTo.nodes;
		var align = new XY(endPts[1].x - endPts[0].x, endPts[1].y - endPts[0].y);
		var pointParallel = new XY(point.x+align.x, point.y+align.y);
		var intersection = lineIntersectionAlgorithm(point, pointParallel, ontoLine.nodes[0], ontoLine.nodes[1]);
		if(intersection != undefined){
			var midPoint = new XY((intersection.x + point.x)*0.5, (intersection.y + point.y)*0.5);
			var perp = new XY(-align.y, align.x);
			var midPoint2 = new XY(midPoint.x + perp.x, midPoint.y + perp.y);
			return this.creaseThroughPoints(midPoint, midPoint2);
		}
		throw "axiom 7: two crease lines cannot be parallel"
	}

/////////////////////////////////////////////////////////////////////
	
	boundaryLineIntersection(origin:XY, direction:XY):XY[]{
		var opposite = new XY(-direction.x, -direction.y);
		var intersects:XY[] = [];
		for(var i = 0; i < this.boundary.edges.length; i++){
			var endpts = this.boundary.edges[i].nodes;
			var test1 = rayLineSegmentIntersectionAlgorithm(origin, direction, endpts[0], endpts[1]);
			var test2 = rayLineSegmentIntersectionAlgorithm(origin, opposite, endpts[0], endpts[1]);
			if(test1 != undefined){ 
				test1.x = wholeNumberify(test1.x);
				test1.y = wholeNumberify(test1.y);
				intersects.push(test1); 
			}
			if(test2 != undefined){ 
				test2.x = wholeNumberify(test2.x);
				test2.y = wholeNumberify(test2.y);
				intersects.push(test2); 
			}
		}
		// todo, need remove duplicate points from array function
		for(var i = 0; i < intersects.length-1; i++){
			for(var j = intersects.length-1; j > i; j--){
				if( intersects[i].equivalent(intersects[j]) ){
					intersects.splice(j,1);
				}
			}
		}
		return intersects;		
	}
	boundaryRayIntersection(origin:XY, direction:XY):XY[]{
		var intersects:XY[] = [];
		for(var i = 0; i < this.boundary.edges.length; i++){
			var endpts = this.boundary.edges[i].nodes;
			var test = rayLineSegmentIntersectionAlgorithm(origin, direction, endpts[0], endpts[1]);
			if(test != undefined){ intersects.push(test); }
		}
		// todo, need remove duplicate points from array function
		for(var i = 0; i < intersects.length-1; i++){
			for(var j = intersects.length-1; j > i; j--){
				if( intersects[i].equivalent(intersects[j]) ){
					intersects.splice(j,1);
				}
			}
		}
		return intersects;
	}

	//////////////////////////////////////////////
	// BOUNDARY

	// rectangular bounding box around the paper: [x,y],[width,height]
	boundingBox():{origin:XY,size:{width:number,height:number}}{
		var left = this.boundary.nodes.sort(function(a,b){return (a.x>b.x) ? 1:((b.x>a.x) ? -1:0);} )[0].x;
		var right = this.boundary.nodes.sort(function(a,b){return (a.x>b.x) ? -1:((b.x>a.x) ? 1:0);} )[0].x;
		var top = this.boundary.nodes.sort(function(a,b){return (a.y>b.y) ? 1:((b.y>a.y) ? -1:0);} )[0].y;
		var bottom = this.boundary.nodes.sort(function(a,b){return (a.y>b.y) ? -1:((b.y>a.y) ? 1:0);} )[0].y;
		return {origin:new XY(left, top), size:{width:right-left, height:bottom-top}};
	}
	boundingBoxD3():[[number,number],[number,number]]{
		var left = this.boundary.nodes.sort(function(a,b){return (a.x>b.x) ? 1:((b.x>a.x) ? -1:0);} )[0].x;
		var right = this.boundary.nodes.sort(function(a,b){return (a.x>b.x) ? -1:((b.x>a.x) ? 1:0);} )[0].x;
		var top = this.boundary.nodes.sort(function(a,b){return (a.y>b.y) ? 1:((b.y>a.y) ? -1:0);} )[0].y;
		var bottom = this.boundary.nodes.sort(function(a,b){return (a.y>b.y) ? -1:((b.y>a.y) ? 1:0);} )[0].y;
		return [[left, top], [right-left, bottom-top]];
	}
	width():number{
		// this is the width of the BOUNDING BOX. be careful if the polygon is not a square
		var left = this.boundary.nodes.sort(function(a,b){return (a.x>b.x) ? 1:((b.x>a.x) ? -1:0);} )[0].x;
		var right = this.boundary.nodes.sort(function(a,b){return (a.x>b.x) ? -1:((b.x>a.x) ? 1:0);} )[0].x;
		return right-left;
	}
	height():number{
		// this is the height of the BOUNDING BOX. be careful if the polygon is not a square
		var top = this.boundary.nodes.sort(function(a,b){return (a.y>b.y) ? 1:((b.y>a.y) ? -1:0);} )[0].y;
		var bottom = this.boundary.nodes.sort(function(a,b){return (a.y>b.y) ? -1:((b.y>a.y) ? 1:0);} )[0].y;
		return bottom-top;
	}

	square(width?:number):CreasePattern{
		// console.log("setting page size: square()");
		var w = 1.0;
		// todo: isReal() - check if is real number
		if(width != undefined && width != 0){ w = Math.abs(width); }
		return this.setBoundary([new XY(0,0), new XY(w,0), new XY(w,w), new XY(0,w)]);
	}

	rectangle(width:number, height:number):CreasePattern{
		// console.log("setting page size: rectangle(" + width + "," + height + ")");
		// todo: should this return undefined if a rectangle has not been made? or return this?
		if(width === undefined || height === undefined){ return undefined; }
		width = Math.abs(width); height = Math.abs(height);
		var points = [new XY(0,0), 
		              new XY(width,0), 
		              new XY(width,height), 
		              new XY(0,height)];
		return this.setBoundary(points);
	}

	noBoundary():CreasePattern{
		// TODO: make sure paper edges are winding clockwise!!
		// clear old data
		if(this.boundary === undefined){ this.boundary = new PlanarGraph(); }
		else                           { this.boundary.clear(); }
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
	}

	setBoundary(points:XY[]):CreasePattern{
		// TODO: make sure paper edges are winding clockwise!!
		// clear old data
		if(this.boundary === undefined){ this.boundary = new PlanarGraph(); }
		else                           { this.boundary.clear(); }
		this.edges = this.edges.filter(function(el){ return el.orientation !== CreaseDirection.border; });
		// todo: if an edge gets removed, it will leave behind its nodes. we might need the following:
		// this.cleanUnusedNodes();
		// todo: test that this is the right way to remove last item:
		if( points[0].equivalent(points[points.length-1]) ){ points.pop(); }
		for(var i = 0; i < points.length; i++){
			var nextI = (i+1) % points.length;
			(<Crease>this.newPlanarEdge(points[i].x, points[i].y, points[nextI].x, points[nextI].y)).border();
			this.boundary.newPlanarEdge(points[i].x, points[i].y, points[nextI].x, points[nextI].y);
		}
		this.cleanDuplicateNodes();
		this.boundary.cleanDuplicateNodes();
		return this;
	}

	///////////////////////////////////////////////////////////////
	// CLEAN  /  REMOVE PARTS

	clear():CreasePattern{
		this.nodes = [];
		this.edges = [];
		this.faces = [];
		this.symmetryLine = undefined;
		if(this.boundary === undefined){ return this; }
		for(var i = 0; i < this.boundary.edges.length; i++){
			var nodes = this.boundary.edges[i].nodes;
			(<Crease>this.newPlanarEdge(nodes[0].x, nodes[0].y, nodes[1].x, nodes[1].y)).border();
		}
		this.cleanDuplicateNodes();
		return this;
	}

	bottomEdge():Crease{
		var boundaries = this.edges
			.filter(function(el){return el.orientation === CreaseDirection.border})
			.sort(function(a,b){ var ay=a.nodes[0].y+a.nodes[1].y;  var by=b.nodes[0].y+b.nodes[1].y; return (ay<by)?1:(ay>by)?-1:0 });
		if(boundaries.length>0){ return boundaries[0]; }
		return undefined;
	}
	topEdge():Crease{
		var boundaries = this.edges
			.filter(function(el){return el.orientation === CreaseDirection.border})
			.sort(function(a,b){ var ay=a.nodes[0].y+a.nodes[1].y;  var by=b.nodes[0].y+b.nodes[1].y; return (ay>by)?1:(ay<by)?-1:0 });
		if(boundaries.length>0){ return boundaries[0]; }
		return undefined;
	}
	rightEdge():Crease{
		var boundaries = this.edges
			.filter(function(el){return el.orientation === CreaseDirection.border})
			.sort(function(a,b){ var ax=a.nodes[0].x+a.nodes[1].x;  var bx=b.nodes[0].x+b.nodes[1].x; return (ax<bx)?1:(ax>bx)?-1:0 });
		if(boundaries.length>0){ return boundaries[0]; }
		return undefined;
	}
	leftEdge():Crease{
		var boundaries = this.edges
			.filter(function(el){return el.orientation === CreaseDirection.border})
			.sort(function(a,b){ var ax=a.nodes[0].x+a.nodes[1].x;  var bx=b.nodes[0].x+b.nodes[1].x; return (ax>bx)?1:(ax<bx)?-1:0 });
		if(boundaries.length>0){ return boundaries[0]; }
		return undefined;
	}

	topLeftCorner():CreaseNode{
		var boundaries = this.edges
			.filter(function(el){return el.orientation === CreaseDirection.border})
			.sort(function(a,b){ var ay=a.nodes[0].y+a.nodes[1].y;  var by=b.nodes[0].y+b.nodes[1].y; return (ay>by)?1:(ay<by)?-1:0 });
		if(boundaries.length>0){ return <CreaseNode>boundaries[0].nodes.sort(function(a,b){ return (a.x>b.x)?1:(a.x<b.x)?-1:0 })[0]; }
		return undefined;
	}
	topRightCorner():CreaseNode{
		var boundaries = this.edges
			.filter(function(el){return el.orientation === CreaseDirection.border})
			.sort(function(a,b){ var ay=a.nodes[0].y+a.nodes[1].y;  var by=b.nodes[0].y+b.nodes[1].y; return (ay>by)?1:(ay<by)?-1:0 });
		if(boundaries.length>0){ return <CreaseNode>boundaries[0].nodes.sort(function(a,b){ return (a.x>b.x)?-1:(a.x<b.x)?1:0 })[0]; }
		return undefined;
	}

	///////////////////////////////////////////////////////////////
	// SYMMETRY

	bookSymmetry():CreasePattern{
		var top = this.topEdge();
		var bottom = this.bottomEdge();
		var a = new XY( (top.nodes[0].x+top.nodes[1].x)*0.5, (top.nodes[0].y+top.nodes[1].y)*0.5);
		var b = new XY( (bottom.nodes[0].x+bottom.nodes[1].x)*0.5, (bottom.nodes[0].y+bottom.nodes[1].y)*0.5);
		return this.setSymmetryLine(a, b);
	}

	diagonalSymmetry():CreasePattern{
		var top = this.topEdge().nodes.sort(function(a,b){ return (a.x<b.x)?1:(a.x>b.x)?-1:0 });
		var bottom = this.bottomEdge().nodes.sort(function(a,b){ return (a.x<b.x)?-1:(a.x>b.x)?1:0 });
		return this.setSymmetryLine(top[0], bottom[0]);
	}

	noSymmetry():CreasePattern{
		return this.setSymmetryLine();
	}

	setSymmetryLine(a?:XY, b?:XY):CreasePattern{
		if(!isValidPoint(a) || !isValidPoint(b)){ this.symmetryLine = undefined; }
		else { this.symmetryLine = [a, b]; }
		return this;
	}

	findFlatFoldable(angle:InteriorAngle):number{
		var interiorAngles = angle.node.interiorAngles();
		if(interiorAngles.length != 3){ return; }
		// find this interior angle among the other interior angles
		var foundIndex = undefined;
		for(var i = 0; i < interiorAngles.length; i++){
			if(angle.equivalent(interiorAngles[i])){ foundIndex = i; }
		}
		if(foundIndex === undefined){ return undefined; }
		var sumEven = 0;
		var sumOdd = 0;
		for(var i = 0; i < interiorAngles.length-1; i++){
			var index = (i+foundIndex+1) % interiorAngles.length;
			if(i % 2 == 0){ sumEven += interiorAngles[index].angle; } 
			else { sumOdd += interiorAngles[index].angle; }
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
	}

	// vertexLiesOnEdge(vIndex, intersect){  // uint, Vertex
	// 	var v = this.nodes[vIndex];
	// 	return this.vertexLiesOnEdge(v, intersect);
	// }

	trySnapVertex(newVertex:XY, epsilon:number){ // newVertex has {x:__, y:__}
		// find the closest interesting point to the vertex
		var closestDistance = undefined;
		var closestIndex = undefined;
		for(var i = 0; i < this.landmarkNodes.length; i++){
			// we could improve this, this.verticesEquivalent could return the distance itself, saving calculations
			if(newVertex.equivalent(this.landmarkNodes[i], epsilon)){
				var thisDistance = Math.sqrt(Math.pow(newVertex.x-this.landmarkNodes[i].x,2) + 
				                             Math.pow(newVertex.y-this.landmarkNodes[i].y,2));
				if(closestIndex == undefined || (thisDistance < closestDistance)){
					closestIndex = i;
					closestDistance = thisDistance;
				}
			}
		}
		if(closestIndex != undefined){
			return this.landmarkNodes[closestIndex];
		}
		return newVertex;
	}

	snapAll(epsilon:number){ // probably should not be used! it merges points that are simply near each other
		for(var i = 0; i < this.nodes.length; i++){
			for(var j = 0; j < this.landmarkNodes.length; j++){
				if(this.nodes[i] != undefined && this.nodes[i].equivalent(this.landmarkNodes[j], epsilon)){
					this.nodes[i].x = this.landmarkNodes[j].x;
					this.nodes[i].y = this.landmarkNodes[j].y;
				}				
			}
		}
	}

	kawasaki(nodeIndex){
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
		for(var i = 0; i < adjacentEdges.length; i++){
			var nextI = (i+1)%adjacentEdges.length;
			var angleDiff = adjacentEdges[nextI].angle - adjacentEdges[i].angle;
			if(angleDiff < 0) angleDiff += Math.PI*2;
			angles.push( {
				"arc":angleDiff, 
				"angles":[adjacentEdges[i].angle, adjacentEdges[nextI].angle], 
				"nodes": [adjacentEdges[i].node, adjacentEdges[nextI].node], 
				"edges": [adjacentEdges[i].edge, adjacentEdges[nextI].edge] } );
		}
		var sumEven = 0;
		var sumOdd = 0;
		for(var i = 0; i < angles.length; i++){
			if(i % 2 == 0){ sumEven += angles[i].arc; } 
			else { sumOdd += angles[i].arc; }
		}
		var dEven = Math.PI - sumEven;
		var dOdd = Math.PI - sumOdd;
		for(var i = 0; i < angles.length; i++){
			if(i % 2 == 0){angles[i]["kawasaki"] = dEven * (angles[i].arc/(Math.PI*2)); }
			else { angles[i]["kawasaki"] = dOdd * (angles[i].arc/(Math.PI*2)); }
		}
		return angles;
	}

	kawasakiDeviance(nodeIndex){
		var kawasaki = kawasaki(nodeIndex);
		var adjacentEdges = this.nodes[nodeIndex].planarAdjacent();
		var angles = [];
		for(var i = 0; i < adjacentEdges.length; i++){
			var nextI = (i+1)%adjacentEdges.length;
			var angleDiff = adjacentEdges[nextI].angle - adjacentEdges[i].angle;
			if(angleDiff < 0) angleDiff += Math.PI*2;
			angles.push( {"arc":angleDiff, "angles":[adjacentEdges[i].angle, adjacentEdges[nextI].angle], "nodes": [i, nextI] } );
		}
		return angles;
	}


	// cleanIntersections(){
	// 	this.clean();
	// 	var intersections = super.fragment();
	// 	this.interestingPoints = this.interestingPoints.concat(intersections);
	// 	return intersections;
	// }


	joinedPaths():XY[][]{
		var cp = this.duplicate();
		cp.clean();
		cp.removeIsolatedNodes();
		var paths = [];
		while(cp.edges.length > 0){
			var node = cp.nodes[0];
			var adj = <CreaseNode[]>node.adjacentNodes();
			var path = [];
			if(adj.length === 0){
				// this shouldn't ever happen
				cp.removeIsolatedNodes();
			}else{
				var nextNode = adj[0];
				var edge = cp.getEdgeConnectingNodes(node, nextNode);
				path.push( new XY(node.x, node.y) );
				// remove edge
				cp.edges = cp.edges.filter(function(el){
					return !((el.nodes[0] === node && el.nodes[1] === nextNode) ||
					         (el.nodes[0] === nextNode && el.nodes[1] === node) );
				});
				cp.removeIsolatedNodes();
				node = nextNode;
				adj = [];
				if(node !== undefined){ adj = <CreaseNode[]>node.adjacentNodes(); }
				while(adj.length > 0){
					nextNode = adj[0];
					path.push( new XY(node.x, node.y) );
					cp.edges = cp.edges.filter(function(el){
						return !((el.nodes[0] === node && el.nodes[1] === nextNode) ||
						         (el.nodes[0] === nextNode && el.nodes[1] === node) );
					});
					cp.removeIsolatedNodes();
					node = nextNode;
					adj = <CreaseNode[]>node.adjacentNodes();
				}
				path.push(new XY(node.x, node.y));
			}
			paths.push(path);
		}
		return paths;
	}

	svgMin(scale:number):string{
		console.log("svgMin");
		var paths = this.joinedPaths();
		if(scale == undefined || scale <= 0){
			scale = 1000;
		}
		var blob = "";
		blob = blob + "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"" +scale+ "px\" height=\"" +scale+ "px\" viewBox=\"0 0 " +scale+ " " +scale+ "\">\n<g>\n";

		for(var i = 0; i < paths.length; i++){
			if(paths[i].length >= 0){
				blob += "<polyline fill=\"none\" stroke-width=\"1\" stroke=\"#000000\" points=\"";
				for(var j = 0; j < paths[i].length; j++){
					var point = paths[i][j];
					blob += (scale*point.x).toFixed(4) + "," + (scale*point.y).toFixed(4) + " ";
				}
				blob += "\"/>\n";
			}
		}

		//////// RECT BORDER
		// blob += "<line stroke=\"#000000\" x1=\"0\" y1=\"0\" x2=\"" +scale+ "\" y2=\"0\"/>\n" + "<line fill=\"none\" stroke=\"#000000\" stroke-miterlimit=\"10\" x1=\"" +scale+ "\" y1=\"0\" x2=\"" +scale+ "\" y2=\"" +scale+ "\"/>\n" + "<line fill=\"none\" stroke=\"#000000\" stroke-miterlimit=\"10\" x1=\"" +scale+ "\" y1=\"" +scale+ "\" x2=\"0\" y2=\"" +scale+ "\"/>\n" + "<line fill=\"none\" stroke=\"#000000\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"" +scale+ "\" x2=\"0\" y2=\"0\"/>\n";

		blob = blob + "</g>\n</svg>\n";
		return blob;
	}

	svg(scale){
		if(scale == undefined || scale <= 0){
			scale = 1;
		}
		var blob = "";
		blob = blob + "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"" +scale+ "px\" height=\"" +scale+ "px\" viewBox=\"0 0 " +scale+ " " +scale+ "\">\n<g>\n";

		//////// RECT BORDER
		blob += "<line stroke=\"#000000\" x1=\"0\" y1=\"0\" x2=\"" +scale+ "\" y2=\"0\"/>\n" + "<line fill=\"none\" stroke=\"#000000\" stroke-miterlimit=\"10\" x1=\"" +scale+ "\" y1=\"0\" x2=\"" +scale+ "\" y2=\"" +scale+ "\"/>\n" + "<line fill=\"none\" stroke=\"#000000\" stroke-miterlimit=\"10\" x1=\"" +scale+ "\" y1=\"" +scale+ "\" x2=\"0\" y2=\"" +scale+ "\"/>\n" + "<line fill=\"none\" stroke=\"#000000\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"" +scale+ "\" x2=\"0\" y2=\"0\"/>\n";
		////////

		for(var i = 0; i < this.edges.length; i++){
			var a = <CreaseNode>this.edges[i].nodes[0];
			var b = <CreaseNode>this.edges[i].nodes[1];
			var x1 = (a.x * scale).toFixed(4);
			var y1 = (a.y * scale).toFixed(4);
			var x2 = (b.x * scale).toFixed(4);
			var y2 = (b.y * scale).toFixed(4);
			blob += "<line stroke=\"#000000\" x1=\"" +x1+ "\" y1=\"" +y1+ "\" x2=\"" +x2+ "\" y2=\"" +y2+ "\"/>\n";
		}
		blob = blob + "</g>\n</svg>\n";
		return blob;
	}

	appendUniquePoints(master, child){
		var returned = master.slice(0);
		for(var c = 0; c < child.length; c++){
			var found = false;
			var i = 0;
			while (!found && i < master.length){
				if(master[i].equivalent(child[c])){
					found = true;
				}
				i += 1;
			}
			if(!found){
				returned.push(child[c]);
			}
		}
		return returned;
	}

	kiteBase():CreasePattern{
		super.clear();
		(<Crease>this.newPlanarEdge(0.0, 0.0, 0.41421, 0.0)).border();
		(<Crease>this.newPlanarEdge(0.41421, 0.0, 1.0, 0.0)).border();
		(<Crease>this.newPlanarEdge(1.0, 0.0, 1.0, 0.58578)).border();
		(<Crease>this.newPlanarEdge(1.0, 0.58578, 1.0, 1.0)).border();
		(<Crease>this.newPlanarEdge(1.0, 1.0, 0.0, 1.0)).border();
		(<Crease>this.newPlanarEdge(0.0, 1.0, 0.0, 0.0)).border();
		(<Crease>this.newPlanarEdge(1, 0, 0, 1)).mountain();
		(<Crease>this.newPlanarEdge(0, 1, 1, 0.58578)).valley();
		(<Crease>this.newPlanarEdge(0, 1, 0.41421, 0)).valley();
		this.clean();
		return this;
	}
	fishBase():CreasePattern{
		super.clear();
		(<Crease>this.newPlanarEdge(0.0, 0.0, 0.29289, 0.0)).border();
		(<Crease>this.newPlanarEdge(0.29289, 0.0, 1.0, 0.0)).border();
		(<Crease>this.newPlanarEdge(1.0, 0.0, 1.0, 0.70711)).border();
		(<Crease>this.newPlanarEdge(1.0, 0.70711, 1.0, 1.0)).border();
		(<Crease>this.newPlanarEdge(1.0, 1.0, 0.0, 1.0)).border();
		(<Crease>this.newPlanarEdge(0.0, 1.0, 0.0, 0.0)).border();
		(<Crease>this.newPlanarEdge(1,0, 0,1)).mountain();
		(<Crease>this.newPlanarEdge(0,1, 0.70711,0.70711)).valley();
		(<Crease>this.newPlanarEdge(0,1, 0.29289,0.29289)).valley();
		(<Crease>this.newPlanarEdge(1,0, 0.29289,0.29289)).valley();
		(<Crease>this.newPlanarEdge(1,0, 0.70711,0.70711)).valley();
		(<Crease>this.newPlanarEdge(0.29289,0.29289, 0,0)).valley();
		(<Crease>this.newPlanarEdge(0.70711,0.70711, 1,1)).valley();
		(<Crease>this.newPlanarEdge(0.70711,0.70711, 1,0.70711)).mountain();
		(<Crease>this.newPlanarEdge(0.29289,0.29289, 0.29289,0)).mountain();
		this.clean();
		this.generateFaces();
		return this;
	}
	birdBase():CreasePattern{
		super.clear();
		(<Crease>this.newPlanarEdge(0.0,0.0,0.5,0.0)).border();
		(<Crease>this.newPlanarEdge(0.5,0.0,1.0,0.0)).border();
		(<Crease>this.newPlanarEdge(1.0,0.0,1.0,0.5)).border();
		(<Crease>this.newPlanarEdge(1.0,0.5,1.0,1.0)).border();
		(<Crease>this.newPlanarEdge(1.0,1.0,0.5,1.0)).border();
		(<Crease>this.newPlanarEdge(0.5,1.0,0.0,1.0)).border();
		(<Crease>this.newPlanarEdge(0.0,1.0,0.0,0.5)).border();
		(<Crease>this.newPlanarEdge(0.0,0.5,0.0,0.0)).border();
		// eight 22.5 degree lines
		(<Crease>this.newPlanarEdge(0, 1, 0.5, .79290)).mountain();
		(<Crease>this.newPlanarEdge(0, 1, .20710, 0.5)).mountain();
		(<Crease>this.newPlanarEdge(1, 0, 0.5, .20710)).mountain();
		(<Crease>this.newPlanarEdge(1, 0, .79290, 0.5)).mountain();
		(<Crease>this.newPlanarEdge(1, 1, .79290, 0.5)).mountain();
		(<Crease>this.newPlanarEdge(1, 1, 0.5, .79290)).mountain();
		(<Crease>this.newPlanarEdge(0, 0, .20710, 0.5)).mountain();
		(<Crease>this.newPlanarEdge(0, 0, 0.5, .20710)).mountain();
		// corner 45 degree lines
		(<Crease>this.newPlanarEdge(0, 0, .35354, .35354)).valley();
		(<Crease>this.newPlanarEdge(.35354, .64645, 0, 1)).valley();
		(<Crease>this.newPlanarEdge(1, 0, .64645, .35354)).mountain();
		(<Crease>this.newPlanarEdge(.64645, .64645, 1, 1)).valley();
		// center X
		(<Crease>this.newPlanarEdge(0.5, 0.5, .35354, .64645)).valley();
		(<Crease>this.newPlanarEdge(.64645, .35354, 0.5, 0.5)).mountain();
		(<Crease>this.newPlanarEdge(0.5, 0.5, .64645, .64645)).valley();
		(<Crease>this.newPlanarEdge(.35354, .35354, 0.5, 0.5)).valley();
		// center ⃟
		(<Crease>this.newPlanarEdge(.35354, .35354, .20710, 0.5)).mark();
		(<Crease>this.newPlanarEdge(0.5, .20710, .35354, .35354)).mark();
		(<Crease>this.newPlanarEdge(.35354, .64645, 0.5, .79290)).mark();
		(<Crease>this.newPlanarEdge(.20710, 0.5, .35354, .64645)).mark();
		(<Crease>this.newPlanarEdge(.64645, .64645, .79290, 0.5)).mark();
		(<Crease>this.newPlanarEdge(0.5, .79290, .64645, .64645)).mark();
		(<Crease>this.newPlanarEdge(.64645, .35354, 0.5, .20710)).mark();
		(<Crease>this.newPlanarEdge(.79290, 0.5, .64645, .35354)).mark();
		// center +
		(<Crease>this.newPlanarEdge(0.5, 0.5, 0.5, .79290)).mountain();
		(<Crease>this.newPlanarEdge(0.5, .20710, 0.5, 0.5)).mountain();
		(<Crease>this.newPlanarEdge(0.5, 0.5, .79290, 0.5)).mountain();
		(<Crease>this.newPlanarEdge(.20710, 0.5, 0.5, 0.5)).mountain();
		// paper edge center connections
		(<Crease>this.newPlanarEdge(0.5, .20710, 0.5, 0)).valley();
		(<Crease>this.newPlanarEdge(.79290, 0.5, 1, 0.5)).valley();
		(<Crease>this.newPlanarEdge(0.5, .79290, 0.5, 1)).valley();
		(<Crease>this.newPlanarEdge(.20710, 0.5, 0, 0.5)).valley();
		this.clean();
		return this;
	}
	frogBase():CreasePattern{
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


}