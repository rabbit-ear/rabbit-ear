/// <reference path="planarGraph.ts"/>

"use strict";

enum CreaseDirection{
	none,
	border,
	mountain,
	valley
}

class CreaseNode extends PlanarNode{
	graph:CreasePattern;

	constructor(xx:number, yy:number){
		super(xx, yy);
	}
	// isBoundary():boolean{
	// 	if(this.y<EPSILON || this.x>1.0-EPSILON || this.y>1.0-EPSILON || this.x<EPSILON ){ return true; } 
	// 	return false;
	// }
	isBoundary():boolean{
		for(var i = 0; i < this.graph.boundary.length; i++){
			var thisPt = new XYPoint(this.x, this.y);
			if(onSegment(thisPt, this.graph.boundary[i].endPoints()[0], this.graph.boundary[i].endPoints()[1])){ return true; }
		}
		return false;
	}
}

class Crease extends PlanarEdge{
	orientation:CreaseDirection;
	constructor(node1:CreaseNode, node2:CreaseNode){
		super(node1, node2);
	};
	mountain(){ this.orientation = CreaseDirection.mountain; return this;}
	valley()  { this.orientation = CreaseDirection.valley; return this;}
	border()  { this.orientation = CreaseDirection.border; return this;}
}

// for purposes of modeling origami crease patterns
// creases are lines (edges) with endpoints v1, v2 (indices in vertex array)
class CreasePattern extends PlanarGraph{

	nodes:CreaseNode[];
	edges:Crease[];
	boundary:Crease[];

	landmarkNodes():XYPoint[]{ return this.nodes.map(function(el){ return new XYPoint(el.x, el.y); }); }

	constructor(){
		super();
		this.boundary = [];
		// square page
		this.addPaperEdge(0,0, 1,0);
		this.addPaperEdge(1,0, 1,1);
		this.addPaperEdge(1,1, 0,1);
		this.addPaperEdge(0,1, 0,0);
		this.mergeDuplicateVertices();
	}

	import(cp:CreasePattern){
		this.nodes = cp.nodes.slice();
		this.edges = cp.edges.slice();
		this.faces = cp.faces.slice();
	}

	// re-implement super class functions with new types
	newEdge(node1:CreaseNode, node2:CreaseNode):Crease {
		return <Crease>this.addEdge(new Crease(node1, node2));
	}
	addEdgeWithVertices(x1:number, y1:number, x2:number, y2:number):Crease{
		var a = <CreaseNode>this.addNode( new CreaseNode(x1, y1) );
		var b = <CreaseNode>this.addNode( new CreaseNode(x2, y2) );
		return this.newEdge(a, b);
	}

	///////////////////////////////////////////////////////////////
	// CLEAN  /  REMOVE PARTS

	clean(){
		console.log("CREASE PATTERN clean()");
		// check if any nodes are free floating and not connected to any edges, remove them
		var superReturn = super.clean();
		//var intersections = super.chop();
		// this.interestingPoints = this.nodes;
		// this.interestingPoints = this.appendUniquePoints(this.nodes, this.starterLocations);
		console.log("clean() end");
		return superReturn;
	}

	clear(){
		super.clear();

		this.boundary = [];
		// square page
		// make sure paper edges are winding clockwise!!
		this.addPaperEdge(0,0, 1,0);
		this.addPaperEdge(1,0, 1,1);
		this.addPaperEdge(1,1, 0,1);
		this.addPaperEdge(0,1, 0,0);
		this.mergeDuplicateVertices();
		// this.interestingPoints = this.starterLocations;
	}
	///////////////////////////////////////////////////////////////
	// ADD PARTS

	pointInside(p:XYPoint){
		for(var i = 0; i < this.boundary.length; i++){
			var endpts = this.boundary[i].endPoints();
			var cross = (p.y - endpts[0].y) * (endpts[1].x - endpts[0].x) - 
			            (p.x - endpts[0].x) * (endpts[1].y - endpts[0].y);
			if (cross < 0) return false;
		}
		return true;
	}

	addPaperEdge(x1:number, y1:number, x2:number, y2:number){
		// this.boundary.push(this.addEdgeWithVertices(x1, y1, x2, y2).border());
		this.addEdgeWithVertices(x1, y1, x2, y2).border();
	}
	creaseOnly(a:XYPoint, b:XYPoint):Crease{
		if(this.pointInside(a) && this.pointInside(b)) return this.addEdgeWithVertices(a.x, a.y, b.x, b.y);
		if(!this.pointInside(a) && !this.pointInside(b)) {
			// if both are outside, only give us a crease if the two points invove an intersection with the boundary
			for(var i = 0; i < this.boundary.length; i++){
				if(lineSegmentIntersectionAlgorithm(a, b, this.boundary[i].endPoints()[0], this.boundary[i].endPoints()[1])) return this.creaseConnectingPoints(a,b);
			}
		}
		var inside, outside;
		if(this.pointInside(a)){ inside = a; outside = b; }
		else { outside = a; inside = b; }
		for(var i = 0; i < this.boundary.length; i++){
			var intersection = lineSegmentIntersectionAlgorithm(inside, outside, this.boundary[i].endPoints()[0], this.boundary[i].endPoints()[1]);
			if(intersection != undefined){
				return this.addEdgeWithVertices(intersection.x, intersection.y, inside.x, inside.y);
			}
		}
		return undefined;
	}
	// creaseRay(origin:XYPoint, direction:XYPoint):Crease{
	// }
	// creaseLineSegment(a:XYPoint, b:XYPoint):Crease{
	// }

	// AXIOM 1
	creaseConnectingPoints(a:XYPoint, b:XYPoint):Crease{
		var ab = new XYPoint(b.x - a.x, b.y - a.y);
		var intersects = this.boundaryLineIntersection(a, ab);
		if(intersects.length >= 2){
			return this.addEdgeWithVertices(intersects[0].x, intersects[0].y, intersects[1].x, intersects[1].y);
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
			return this.addEdgeWithVertices(intersects[0].x, intersects[0].y, intersects[1].x, intersects[1].y);
		}
		throw "points have no perpendicular bisector inside of the boundaries";
	}
	// AXIOM 3
	creaseEdgeToEdge(a:Crease, b:Crease):Crease[]{
		var aEndPts = a.endPoints();
		var bEndPts = b.endPoints();
		if ( linesParallel(aEndPts[0], aEndPts[1], bEndPts[0], bEndPts[1]) ) {
			var u = new XYPoint(aEndPts[1].x - aEndPts[0].x, aEndPts[1].y - aEndPts[0].y);
			var perp:XYPoint = u.Rotate90();
			var intersect1 = lineIntersectionAlgorithm(u, new XYPoint(u.x+perp.x, u.y+perp.y), aEndPts[0], aEndPts[1]);
			var intersect2 = lineIntersectionAlgorithm(u, new XYPoint(u.x+perp.x, u.y+perp.y), bEndPts[0], bEndPts[1]);
			var midpoint = new XYPoint((intersect1.x + intersect2.x)*0.5, (intersect1.y + intersect2.y)*0.5);
			return [this.creaseConnectingPoints(midpoint, new XYPoint(midpoint.x+u.x, midpoint.y+u.y))];
		}
		else {
			var creases:Crease[] = [];
			var intersection = lineIntersectionAlgorithm(aEndPts[0], aEndPts[1], bEndPts[0], bEndPts[1]);
			var u = new XYPoint(aEndPts[1].x - aEndPts[0].x, aEndPts[1].y - aEndPts[0].y);
			var v = new XYPoint(bEndPts[1].x - bEndPts[0].x, bEndPts[1].y - bEndPts[0].y);
			var uMag = u.Mag();
			var vMag = v.Mag();
			var dir = new XYPoint( (u.x*vMag + v.x*uMag), (u.y*vMag + v.y*uMag) );
			var intersects = this.boundaryLineIntersection(intersection, dir);
			if(intersects.length >= 2){
				creases.push(this.addEdgeWithVertices(intersects[0].x, intersects[0].y, intersects[1].x, intersects[1].y));
			}
			var dir90 = dir.Rotate90();
			var intersects90 = this.boundaryLineIntersection(intersection, dir90);
			if(intersects90.length >= 2){
				if(Math.abs(u.Cross(dir)) < Math.abs(u.Cross(dir90)))
					creases.push(this.addEdgeWithVertices(intersects90[0].x, intersects90[0].y, intersects90[1].x, intersects90[1].y));
				else creases.unshift(this.addEdgeWithVertices(intersects90[0].x, intersects90[0].y, intersects90[1].x, intersects90[1].y));
			}
			if(creases.length){
				return creases;
			}
			throw "lines have no inner edge inside of the boundaries";
		};
	}
	// AXIOM 4
	creasePerpendicularThroughPoint(line:Crease, point:XYPoint):Crease{
		var endPts = line.endPoints();
		var ab = new XYPoint(endPts[1].x - endPts[0].x, endPts[1].y - endPts[0].y);
		var perp = new XYPoint(-ab.y, ab.x);
		var point2 = new XYPoint(point.x + perp.x, point.y + perp.y);
		return this.creaseConnectingPoints(point, point2);
	}
	// AXIOM 5
	creasePointToLine(origin:XYPoint, point:XYPoint, line:Crease):Crease[]{
		var endPts = line.endPoints();
		var radius = Math.sqrt( Math.pow(origin.x-point.x,2) + Math.pow(origin.y-point.y,2) );
		var intersections = circleLineIntersectionAlgorithm(origin, radius, endPts[0], endPts[1]);
		// return (radius*radius) * dr_squared > (D*D)  // check if there are any intersections
		var creases = [];
		for(var i = 0; i < intersections.length; i++){
			creases.push( this.creasePointToPoint(point, intersections[i]) );
		}
		return creases;
	}
	// AXIOM 7
	creasePerpendicularPointOntoLine(point:XYPoint, ontoLine:Crease, perpendicularTo:Crease):Crease{
		var endPts = perpendicularTo.endPoints();
		var align = new XYPoint(endPts[1].x - endPts[0].x, endPts[1].y - endPts[0].y);
		var pointParallel = new XYPoint(point.x+align.x, point.y+align.y);
		var intersection = lineIntersectionAlgorithm(point, pointParallel, ontoLine.endPoints()[0], ontoLine.endPoints()[1]);
		if(intersection != undefined){
			var midPoint = new XYPoint((intersection.x + point.x)*0.5, (intersection.y + point.y)*0.5);
			var perp = new XYPoint(-align.y, align.x);
			var midPoint2 = new XYPoint(midPoint.x + perp.x, midPoint.y + perp.y);
			return this.creaseConnectingPoints(midPoint, midPoint2);
		}
		throw "axiom 7: two crease lines cannot be parallel"
	}

	creaseVector(start:XYPoint,vector:XYPoint):Crease{
		var boundaryIntersection = undefined;
		for(var i = 0; i < this.boundary.length; i++){
			var thisIntersection = rayLineSegmentIntersectionAlgorithm(start, vector, this.boundary[i].endPoints()[0], this.boundary[i].endPoints()[1]);
			if(thisIntersection != undefined){ boundaryIntersection = thisIntersection; }
		}
		if(boundaryIntersection == undefined) { throw "creaseVector() requires paper boundaries else it will crease to infinity"; }
		return this.addEdgeWithVertices(start.x, start.y, boundaryIntersection.x, boundaryIntersection.y);
	}

	creaseAngle(start:XYPoint,radians:number):Crease{
		return this.creaseVector(start, new XYPoint(Math.cos(radians), Math.sin(radians)));
	}



	boundaryLineIntersection(origin:XYPoint, direction:XYPoint):XYPoint[]{
		var opposite = new XYPoint(-direction.x, -direction.y);
		var intersects:XYPoint[] = [];
		for(var i = 0; i < this.boundary.length; i++){
			var endpts = this.boundary[i].endPoints();
			var test1 = rayLineSegmentIntersectionAlgorithm(origin, direction, endpts[0], endpts[1]);
			var test2 = rayLineSegmentIntersectionAlgorithm(origin, opposite, endpts[0], endpts[1]);
			if(test1 != undefined){ intersects.push(test1); }
			if(test2 != undefined){ intersects.push(test2); }
		}
		for(var i = 0; i < intersects.length-1; i++){
			for(var j = intersects.length-1; j > i; j--){
				if ( this.verticesEquivalent(intersects[i], intersects[j], EPSILON) ){
					intersects.splice(j,1);
				}
			}
		}
		return intersects;		
	}
	boundaryRayIntersection(origin:XYPoint, direction:XYPoint):XYPoint[]{
		var intersects:XYPoint[] = [];
		for(var i = 0; i < this.boundary.length; i++){
			var endpts = this.boundary[i].endPoints();
			var test = rayLineSegmentIntersectionAlgorithm(origin, direction, endpts[0], endpts[1]);
			if(test != undefined){ intersects.push(test); }
		}
		for(var i = 0; i < intersects.length-1; i++){
			for(var j = intersects.length-1; j > i; j--){
				if ( this.verticesEquivalent(intersects[i], intersects[j], EPSILON) ){
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



	trySnapVertex(newVertex, snapRadius){ // newVertex has {x:__, y:__}
		// find the closest interesting point to the vertex
		var closestDistance = undefined;
		var closestIndex = undefined;
		for(var i = 0; i < this.landmarkNodes.length; i++){
			// we could improve this, this.verticesEquivalent could return the distance itself, saving calculations
			if(this.verticesEquivalent(newVertex, this.landmarkNodes[i], snapRadius)){
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

	snapAll(snapRadius){ // probably should not be used! it merges points that are simply near each other
		for(var i = 0; i < this.nodes.length; i++){
			for(var j = 0; j < this.landmarkNodes.length; j++){
				if(this.nodes[i] != undefined && this.verticesEquivalent(this.nodes[i], this.landmarkNodes[j], snapRadius)){
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
			var a = <CreaseNode>this.edges[i].node[0];
			var b = <CreaseNode>this.edges[i].node[1];
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
				if(this.verticesEquivalent(master[i], child[c], EPSILON)){
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

	findAllFaces(){
		this.generateFaces();
	}

	log(){
		super.log();
	}

	kiteBase(){
		this.addEdgeWithVertices(1, 0, 0, 1);
		this.addEdgeWithVertices(0, 1, 1, .58578);
		this.addEdgeWithVertices(0, 1, .41421, 0);
		this.clean();
	}
	fishBase(){
		this.clear();
		this.addEdgeWithVertices(1,0, 0,1).mountain();
		this.addEdgeWithVertices(0,1, 0.70711,0.70711).valley();
		this.addEdgeWithVertices(0,1, 0.29289,0.29289).valley();
		this.addEdgeWithVertices(1,0, 0.29289,0.29289).valley();
		this.addEdgeWithVertices(1,0, 0.70711,0.70711).valley();
		this.addEdgeWithVertices(0.29289,0.29289, 0,0).valley();
		this.addEdgeWithVertices(0.70711,0.70711, 1,1).valley();
		this.addEdgeWithVertices(0.70711,0.70711, 1,0.70711).mountain();
		this.addEdgeWithVertices(0.29289,0.29289, 0.29289,0).mountain();
		this.clean();
		this.edges[9].mountain();
		this.edges[12].mountain();
		// this.addFaceBetweenNodes([0, 1, 3]);
		// this.addFaceBetweenNodes([0, 2, 1]);
		// this.addFaceBetweenNodes([4, 3, 1]);
		// this.addFaceBetweenNodes([5, 1, 2]);
		// this.addFaceBetweenNodes([6, 5, 2]);
		// this.addFaceBetweenNodes([6, 2, 0]);
		// this.addFaceBetweenNodes([7, 3, 4]);
		// this.addFaceBetweenNodes([7, 0, 3]);
	}
	birdBase(){
		super.clear();
		this.addPaperEdge(0.0,0.0,0.5,0.0);
		this.addPaperEdge(0.5,0.0,1.0,0.0);
		this.addPaperEdge(1.0,0.0,1.0,0.5);
		this.addPaperEdge(1.0,0.5,1.0,1.0);
		this.addPaperEdge(1.0,1.0,0.5,1.0);
		this.addPaperEdge(0.5,1.0,0.0,1.0);
		this.addPaperEdge(0.0,1.0,0.0,0.5);
		this.addPaperEdge(0.0,0.5,0.0,0.0);
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
	}
	frogBase(){
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
	}


}