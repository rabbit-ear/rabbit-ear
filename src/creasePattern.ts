/// <reference path="planarGraph.ts"/>

// creasePattern.js
// for the purposes of performing origami operations on a planar graph
// mit open source license, robby kraft

"use strict";

enum CreaseDirection{
	none,
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

	// isBoundary():boolean{
	// 	if(this.y<EPSILON || this.x>1.0-EPSILON || this.y>1.0-EPSILON || this.x<EPSILON ){ return true; } 
	// 	return false;
	// }
	isBoundary():boolean{
		for(var i = 0; i < this.graph.boundary.edges.length; i++){
			var thisPt = new XYPoint(this.x, this.y);
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
		if(epsilonEqual(sums[0], Math.PI, EPSILON_LOW) && 
		   epsilonEqual(sums[1], Math.PI, EPSILON_LOW) ){ return true; }
		return false;
	}

	//////////////////////////////
	// FOLDS
	// AXIOM 1
	creaseLineThrough(point:XYPoint):Crease{
		return this.graph.creaseThroughPoints(this, point);
	}
	// AXIOM 2
	creaseToPoint(point:XYPoint):Crease{
		return this.graph.creasePointToPoint(this, point);
	}
}

class Crease extends PlanarEdge{
	graph:CreasePattern
	orientation:CreaseDirection;
	constructor(graph:CreasePattern, node1:CreaseNode, node2:CreaseNode){
		super(graph, node1, node2);
	};
	mark(){ this.orientation = CreaseDirection.none; return this;}
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

	nodeType = CreaseNode;
	edgeType = Crease;

	landmarkNodes():XYPoint[]{ return this.nodes.map(function(el){ return new XYPoint(el.x, el.y); }); }

	constructor(){
		super();
		if(this.boundary === undefined){ this.boundary = new PlanarGraph(); }
		this.square();
	}

	square(width?:number):CreasePattern{
		console.log("setting page size: square()");
		var w = 1.0;
		if(width != undefined && width != 0){ w = Math.abs(width); }
		// clear old data
		if(this.boundary === undefined){ this.boundary = new PlanarGraph(); }
		else                           { this.boundary.clear(); }
		this.edges = this.edges.filter(function(el){ return el.orientation !== CreaseDirection.border; });
		// this.cleanUnusedNodes();
		// add edges
		this.addPaperEdge(0,0, w,0);
		this.addPaperEdge(w,0, w,w);
		this.addPaperEdge(w,w, 0,w);
		this.addPaperEdge(0,w, 0,0);
		this.cleanDuplicateNodes();
		this.boundary.cleanDuplicateNodes();
		return this;
	}

	rectangle(width:number, height:number):CreasePattern{
		console.log("setting page size: rectangle(" + width + "," + height + ")");
		// clear old data
		if(this.boundary === undefined){ this.boundary = new PlanarGraph(); }
		else                           { this.boundary.clear(); }
		this.edges = this.edges.filter(function(el){ return el.orientation !== CreaseDirection.border; });
		// this.cleanUnusedNodes();
		// make sure paper edges are winding clockwise!!
		this.addPaperEdge(0,0, width,0);
		this.addPaperEdge(width,0, width,height);
		this.addPaperEdge(width,height, 0,height);
		this.addPaperEdge(0,height, 0,0);
		this.cleanDuplicateNodes();
		this.boundary.cleanDuplicateNodes();
		return this;
	}

	polygon(edgePoints:XYPoint[]):CreasePattern{
		console.log("setting page size: polygon(): " + edgePoints.length + " points");
		// clear old data
		if(this.boundary === undefined){ this.boundary = new PlanarGraph(); }
		else                           { this.boundary.clear(); }
		this.edges = this.edges.filter(function(el){ return el.orientation !== CreaseDirection.border; });
		// this.cleanUnusedNodes();
		// TODO: make sure paper edges are winding clockwise!!
		for(var i = 0; i < edgePoints.length; i++){
			var nextI = (i+1) % edgePoints.length;
			this.addPaperEdge(edgePoints[i].x,edgePoints[i].y, edgePoints[nextI].x,edgePoints[nextI].y);
		}
		return this;
	}

	import(cp:CreasePattern){
		this.nodes = cp.nodes.slice();
		this.edges = cp.edges.slice();
		this.faces = cp.faces.slice();
		// TODO: copy boundary too
		// this.boundary = cp.boundary.slice();
	}

	// re-implement super class functions with new types
	// newEdge(node1:CreaseNode, node2:CreaseNode):Crease {
	// 	return <Crease>this.addEdge(new Crease(this, node1, node2));
	// }
	// newNode():CreaseNode {
	// 	var x = 0; var y = 0;
	// 	return <CreaseNode>this.addNode(<GraphNode>(new CreaseNode(this).position(x, y)));
	// }
	// newPlanarEdge(x1:number, y1:number, x2:number, y2:number):Crease{
	// 	var a = <CreaseNode>this.addNode( new CreaseNode(this, x1, y1) );
	// 	var b = <CreaseNode>this.addNode( new CreaseNode(this, x2, y2) );
	// 	return this.newEdge(a, b);
	// }

	/** This will deep-copy the contents of this graph and return it as a new object
	 * @returns {CreasePattern} 
	 */
	duplicate():CreasePattern{
		this.nodeArrayDidChange();
		this.edgeArrayDidChange();
		var g = new CreasePattern();
		g.boundary = undefined;
		g.clear();
		for(var i = 0; i < this.nodes.length; i++){
			var newNode = g.addNode(new CreaseNode(g));
			(<any>Object).assign(newNode, this.nodes[i]);
			newNode.graph = g;
			newNode.index = i;
		}
		for(var i = 0; i < this.edges.length; i++){
			var a = this.edges[i].nodes[0].index;
			var b = this.edges[i].nodes[1].index;
			var newEdge = <Crease>g.addEdge(new Crease(g, g.nodes[a], g.nodes[b]));
			(<any>Object).assign(newEdge, this.edges[i]);
			newEdge.graph = g;
			newEdge.nodes = [g.nodes[a], g.nodes[b]];
			newEdge.orientation = this.edges[i].orientation;
			newEdge.index = i;
		}
		// boundary
		this.boundary.nodeArrayDidChange();
		this.boundary.edgeArrayDidChange();
		var bound = new PlanarGraph();
		for(var i = 0; i < this.boundary.nodes.length; i++){
			var newBNode = bound.addNode(new PlanarNode(bound));
			(<any>Object).assign(newBNode, this.boundary.nodes[i]);
			newBNode.graph = bound;
			newBNode.index = i;
		}
		for(var i = 0; i < this.boundary.edges.length; i++){
			var a = this.boundary.edges[i].nodes[0].index;
			var b = this.boundary.edges[i].nodes[1].index;
			var newBEdge = <PlanarEdge>bound.addEdge(new PlanarEdge(bound, bound.nodes[a], bound.nodes[b]));
			(<any>Object).assign(newBEdge, this.boundary.edges[i]);
			newBEdge.graph = bound;
			newBEdge.nodes = [bound.nodes[a], bound.nodes[b]];
			newBEdge.index = i;
		}
		g.boundary = bound;
		return g;
	}

	///////////////////////////////////////////////////////////////
	// CLEAN  /  REMOVE PARTS

	clear(){
		this.nodes = [];
		this.edges = [];
		this.faces = [];
		if(this.boundary != undefined){
			for(var i = 0; i < this.boundary.edges.length; i++){
				var nodes = this.boundary.edges[i].nodes;
				(<Crease>this.newPlanarEdge(nodes[0].x, nodes[0].y, nodes[1].x, nodes[1].y)).border();
			}
		}
		// this.interestingPoints = this.starterLocations;
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
	///////////////////////////////////////////////////////////////
	// ADD PARTS

	fold(param1, param2, param3, param4){
		// detects which parameters are there
	}

	pointInside(p:XYPoint){
		for(var i = 0; i < this.boundary.edges.length; i++){
			var endpts = this.boundary.edges[i].nodes;
			var cross = (p.y - endpts[0].y) * (endpts[1].x - endpts[0].x) - 
			            (p.x - endpts[0].x) * (endpts[1].y - endpts[0].y);
			if (cross < 0) return false;
		}
		return true;
	}

	addPaperEdge(x1:number, y1:number, x2:number, y2:number){
		// this.boundary.push(this.newPlanarEdge(x1, y1, x2, y2).border());
		(<Crease>this.newPlanarEdge(x1, y1, x2, y2)).border();
		// this.newPlanarEdge(x1, y1, x2, y2);
		// (<Crease>this.newPlanarEdge(x1, y1, x2, y2)).border();
		this.boundary.newPlanarEdge(x1, y1, x2, y2);
	}
	creaseOnly(a:XYPoint, b:XYPoint):Crease{
		if(this.pointInside(a) && this.pointInside(b)) return <Crease>this.newPlanarEdge(a.x, a.y, b.x, b.y);
		if(!this.pointInside(a) && !this.pointInside(b)) {
			// if both are outside, only give us a crease if the two points invove an intersection with the boundary
			for(var i = 0; i < this.boundary.edges.length; i++){
				if(lineSegmentIntersectionAlgorithm(a, b, this.boundary.edges[i].nodes[0], this.boundary.edges[i].nodes[1])) return this.creaseThroughPoints(a,b);
			}
		}
		var inside, outside;
		if(this.pointInside(a)){ inside = a; outside = b; }
		else { outside = a; inside = b; }
		for(var i = 0; i < this.boundary.edges.length; i++){
			var intersection = lineSegmentIntersectionAlgorithm(inside, outside, this.boundary.edges[i].nodes[0], this.boundary.edges[i].nodes[1]);
			if(intersection != undefined){
				return <Crease>this.newPlanarEdge(intersection.x, intersection.y, inside.x, inside.y);
			}
		}
		return undefined;
	}


	// creaseRay(origin:XYPoint, direction:XYPoint):Crease{
	// }
	// creaseLineSegment(a:XYPoint, b:XYPoint):Crease{
	// }

	// AXIOM 1
	creaseThroughPoints(a:XYPoint, b:XYPoint):Crease{
		var ab = new XYPoint(b.x - a.x, b.y - a.y);
		var intersects = this.boundaryLineIntersection(a, ab);
		if(intersects.length >= 2){
			return <Crease>this.newPlanarEdge(intersects[0].x, intersects[0].y, intersects[1].x, intersects[1].y);
		}
		throw "points have no crease line inside of the boundaries";
	}
	// AXIOM 2
	creasePointToPoint(a:XYPoint, b:XYPoint):Crease{
		var midpoint = new XYPoint((a.x + b.x)*0.5, (a.y + b.y)*0.5);
		var ab = new XYPoint(b.x - a.x, b.y - a.y);
		var perp1 = new XYPoint(-ab.y, ab.x);
		var intersects = this.boundaryLineIntersection(midpoint, perp1);
		if(intersects.length >= 2){
			return <Crease>this.newPlanarEdge(intersects[0].x, intersects[0].y, intersects[1].x, intersects[1].y);
		}
		throw "points have no perpendicular bisector inside of the boundaries";
	}
	// AXIOM 3
	creaseEdgeToEdge(a:Crease, b:Crease):Crease[]{
		if ( linesParallel(a.nodes[0], a.nodes[1], b.nodes[0], b.nodes[1]) ) {
			var u = new XYPoint(a.nodes[1].x - a.nodes[0].x, a.nodes[1].y - a.nodes[0].y);
			var perp:XYPoint = new XYPoint(u.x, u.y).rotate90();
			var intersect1 = lineIntersectionAlgorithm(u, new XYPoint(u.x+perp.x, u.y+perp.y), a.nodes[0], a.nodes[1]);
			var intersect2 = lineIntersectionAlgorithm(u, new XYPoint(u.x+perp.x, u.y+perp.y), b.nodes[0], b.nodes[1]);
			var midpoint = new XYPoint((intersect1.x + intersect2.x)*0.5, (intersect1.y + intersect2.y)*0.5);
			return [this.creaseThroughPoints(midpoint, new XYPoint(midpoint.x+u.x, midpoint.y+u.y))];
		}
		else {
			var creases:Crease[] = [];
			var intersection = lineIntersectionAlgorithm(a.nodes[0], a.nodes[1], b.nodes[0], b.nodes[1]);
			var u = new XYPoint(a.nodes[1].x - a.nodes[0].x, a.nodes[1].y - a.nodes[0].y);
			var v = new XYPoint(b.nodes[1].x - b.nodes[0].x, b.nodes[1].y - b.nodes[0].y);
			var uMag = u.mag();
			var vMag = v.mag();
			var dir = new XYPoint( (u.x*vMag + v.x*uMag), (u.y*vMag + v.y*uMag) );
			var intersects = this.boundaryLineIntersection(intersection, dir);
			if(intersects.length >= 2){
				creases.push(<Crease>this.newPlanarEdge(intersects[0].x, intersects[0].y, intersects[1].x, intersects[1].y));
			}
			var dir90 = dir.rotate90();
			var intersects90 = this.boundaryLineIntersection(intersection, dir90);
			if(intersects90.length >= 2){
				if(Math.abs(u.cross(dir)) < Math.abs(u.cross(dir90)))
					creases.push(<Crease>this.newPlanarEdge(intersects90[0].x, intersects90[0].y, intersects90[1].x, intersects90[1].y));
				else creases.unshift(<Crease>this.newPlanarEdge(intersects90[0].x, intersects90[0].y, intersects90[1].x, intersects90[1].y));
			}
			if(creases.length){
				return creases;
			}
			throw "lines have no inner edge inside of the boundaries";
		};
	}
	// AXIOM 4
	creasePerpendicularThroughPoint(line:Crease, point:XYPoint):Crease{
		var ab = new XYPoint(line.nodes[1].x - line.nodes[0].x, line.nodes[1].y - line.nodes[0].y);
		var perp = new XYPoint(-ab.y, ab.x);
		var point2 = new XYPoint(point.x + perp.x, point.y + perp.y);
		return this.creaseThroughPoints(point, point2);
	}
	// AXIOM 5
	creasePointToLine(origin:XYPoint, point:XYPoint, line:Crease):Crease[]{
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
	creasePerpendicularPointOntoLine(point:XYPoint, ontoLine:Crease, perpendicularTo:Crease):Crease{
		var endPts = perpendicularTo.nodes;
		var align = new XYPoint(endPts[1].x - endPts[0].x, endPts[1].y - endPts[0].y);
		var pointParallel = new XYPoint(point.x+align.x, point.y+align.y);
		var intersection = lineIntersectionAlgorithm(point, pointParallel, ontoLine.nodes[0], ontoLine.nodes[1]);
		if(intersection != undefined){
			var midPoint = new XYPoint((intersection.x + point.x)*0.5, (intersection.y + point.y)*0.5);
			var perp = new XYPoint(-align.y, align.x);
			var midPoint2 = new XYPoint(midPoint.x + perp.x, midPoint.y + perp.y);
			return this.creaseThroughPoints(midPoint, midPoint2);
		}
		throw "axiom 7: two crease lines cannot be parallel"
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
			if(i % 2 == 0){ sumEven += interiorAngles[i].angle; } 
			else { sumOdd += interiorAngles[i].angle; }
		}
		var dEven = Math.PI - sumEven;
		var dOdd = Math.PI - sumOdd;
		var angle0 = angle.edges[0].absoluteAngle(angle.node);
		var angle1 = angle.edges[1].absoluteAngle(angle.node);
		// this following if isn't where the problem lies, it is on both cases, the problem is in the data incoming, first 2 lines, it's not sorted, or whatever.
		console.log(clockwiseAngleFrom(angle0, angle1) + " " + clockwiseAngleFrom(angle1, angle0));
		if(clockwiseAngleFrom(angle0, angle1) < clockwiseAngleFrom(angle1, angle0)){
			// return angle1 - dOdd;
			return angle1 - dEven;
		} else{
			return angle1 - dOdd;
		}

	}

	creaseRay(start:XYPoint,vector:XYPoint):Crease{
		if(start == undefined || vector == undefined || isNaN(start.x) || isNaN(start.y) || isNaN(vector.x) || isNaN(vector.y) ){ return undefined; }
		var boundaryIntersection = undefined;
		for(var i = 0; i < this.boundary.edges.length; i++){
			var thisIntersection = rayLineSegmentIntersectionAlgorithm(start, vector, this.boundary.edges[i].nodes[0], this.boundary.edges[i].nodes[1]);
			if(thisIntersection != undefined){ boundaryIntersection = thisIntersection; }
		}
		if(boundaryIntersection == undefined) { throw "creaseRay() requires paper boundaries else it will crease to infinity"; }
		return <Crease>this.newPlanarEdge(start.x, start.y, boundaryIntersection.x, boundaryIntersection.y);
	}

	creaseAngle(start:XYPoint,radians:number):Crease{
		return this.creaseRay(start, new XYPoint(Math.cos(radians), Math.sin(radians)));
	}

	creaseAngleBisector(a:Crease, b:Crease):Crease{
		var commonNode = <PlanarNode>a.commonNodeWithEdge(b);
		if(commonNode === undefined) return undefined;
		var aAngle = a.absoluteAngle(commonNode);
		var bAngle = b.absoluteAngle(commonNode);
		var clockwise = clockwiseAngleFrom(bAngle, aAngle);
		var newAngle = bAngle - clockwise*0.5 + Math.PI;
		return this.creaseRay(commonNode, new XYPoint(Math.cos(newAngle), Math.sin(newAngle)));
	}

	boundaryLineIntersection(origin:XYPoint, direction:XYPoint):XYPoint[]{
		var opposite = new XYPoint(-direction.x, -direction.y);
		var intersects:XYPoint[] = [];
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
		for(var i = 0; i < intersects.length-1; i++){
			for(var j = intersects.length-1; j > i; j--){
				if( intersects[i].equivalent(intersects[j]) ){
					intersects.splice(j,1);
				}
			}
		}
		// for(var i = 0; i < intersects.length; i++){
		// 	console.log(intersects[i].x + "," + intersects[i].y);
		// }
		return intersects;		
	}
	boundaryRayIntersection(origin:XYPoint, direction:XYPoint):XYPoint[]{
		var intersects:XYPoint[] = [];
		for(var i = 0; i < this.boundary.edges.length; i++){
			var endpts = this.boundary.edges[i].nodes;
			var test = rayLineSegmentIntersectionAlgorithm(origin, direction, endpts[0], endpts[1]);
			if(test != undefined){ intersects.push(test); }
		}
		for(var i = 0; i < intersects.length-1; i++){
			for(var j = intersects.length-1; j > i; j--){
				if( intersects[i].equivalent(intersects[j], EPSILON) ){
					intersects.splice(j,1);
				}
			}
		}
		return intersects;
	}

	// vertexLiesOnEdge(vIndex, intersect){  // uint, Vertex
	// 	var v = this.nodes[vIndex];
	// 	return this.vertexLiesOnEdge(v, intersect);
	// }

	trySnapVertex(newVertex:XYPoint, epsilon:number){ // newVertex has {x:__, y:__}
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
	// 	var intersections = super.chop();
	// 	this.interestingPoints = this.interestingPoints.concat(intersections);
	// 	return intersections;
	// }

	exportSVG(scale){
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
		this.chop();
		this.clean();
		return this;
	}


}