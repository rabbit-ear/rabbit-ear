// creasePattern.js
// for the purposes of performing origami operations on a planar graph
// MIT open source license, Robby Kraft

// overview
// 1st order operations: crease pattern methods that don't require any arguments, or only 1st order types
// 2nd order operations: crease pattern methods that require knowledge of methods in the geometry module

import { PlanarClean, PlanarNode, PlanarEdge, PlanarFace, PlanarSector, PlanarJunction, PlanarGraph } from './planarGraph'
import CubicEquation from './polynomial'
import * as M from './geometry'
import SVGLoader from './SVGLoader.js'
import * as VoronoiGraph from './voronoi'

"use strict";

////////////// Copied from geometry.ts
function isValidPoint(point){return(point!==undefined&&!isNaN(point.x)&&!isNaN(point.y));}
function isValidNumber(n){return(n!==undefined&&!isNaN(n)&&!isNaN(n));}
function epsilonEqual(a, b, epsilon){
	if(epsilon === undefined){ epsilon = M.EPSILON_HIGH; }
	return ( Math.abs(a - b) < epsilon );
}
function cleanNumber(num, decimalPlaces){
	if(Math.floor(num) == num || decimalPlaces == undefined){ return num; }
	return parseFloat(num.toFixed(decimalPlaces));
}
///////////////////////////////////////

/////////////////////////////// FUNCTION INPUT INTERFACE ///////////////////////////////
function gimme1XY(a, b){
	// input is 1 XY, or 2 numbers
	// if(a instanceof XY){ return a; }
	if(isValidPoint(a)){ return new M.XY(a.x, a.y); }
	if(isValidNumber(b)){ return new M.XY(a, b); }
	if(a.constructor === Array){ return new M.XY(a[0], a[1]); }
}
function gimme2XY(a, b, c, d){
	// input is 2 XY, or 4 numbers
	if(a instanceof M.XY && b instanceof M.XY){ return [a,b]; }
	if(isValidPoint(b)){ return [new M.XY(a.x,a.y), new M.XY(b.x,b.y)]; }
	if(isValidNumber(d)){ return [new M.XY(a, b), new M.XY(c, d)]; }
}
function gimme1Edge(a, b, c, d){
	// input is 1 edge, 2 XY, or 4 numbers
	if(a instanceof M.Edge){ return a; }
	if(a.nodes !== undefined){ return new M.Edge(a.nodes[0], a.nodes[1]); }
	if(isValidPoint(b) ){ return new M.Edge(a,b); }
	if(isValidNumber(d)){ return new M.Edge(a,b,c,d); }
}
function gimme1Ray(a, b, c, d){
	// input is 1 ray, 2 XY, or 4 numbers
	if(a instanceof M.Ray){ return a; }
	if(isValidPoint(b) ){ return new M.Ray(a,b); }
	if(isValidNumber(d)){ return new M.Ray(new M.XY(a,b), new M.XY(c,d)); }
}

function gimme1Line(a, b, c, d){
	// input is 1 line
	if(a instanceof M.Line){ return a; }
	// input is 2 M.XY
	if(isValidPoint(b)){ return new M.Line(a,b); }
	// input is 4 numbers
	if(isValidNumber(d)){ return new M.Line(a,b,c,d); }
	// input is 1 line-like object with points in a nodes[] array
	if(a instanceof M.Edge && a.nodes instanceof Array &&
	        a.nodes.length > 0 &&
	        isValidPoint(a.nodes[1])){
		return new M.Line(a.nodes[0].x,a.nodes[0].y,a.nodes[1].x,a.nodes[1].y);
	}
}

class CPPoint extends M.XY{
	// cp;
	constructor(cp, point){
		super(point.x, point.y);
		this.cp = cp;
	}
	nearest(){ return this.cp.nearest(this); }
}
class CreaseLineType{
	// cp;
	crease(){ }
	// creaseAndRepeat(){ }
	// creaseAndStop(){ }
}
class CPLine extends M.Line{
	// cp;
	constructor(cp, line){
		super(line.point, line.direction);
		this.cp = cp;
	}
	crease(){ return this.cp.crease(this); }
	// creaseAndRepeat(){ this.cp.creaseRayRepeat(this); }
	// creaseAndStop(){ this.cp.creaseAndStop(this); }
}
class CPRay extends M.Ray {
	// cp;
	constructor(cp, ray){
		super(ray.origin, ray.direction);
		this.cp = cp;
	}
	crease(){ return this.cp.crease(this); }
	creaseAndRepeat(){ return this.cp.creaseRayRepeat(this); }
	creaseAndStop(){ return this.cp.creaseAndStop(this); }
}
class CPEdge extends M.Edge {
	// cp;
	// madeBy;
	constructor(cp, edge){
		super(edge.nodes[0], edge.nodes[1]);
		this.cp = cp;
	}
	crease(){ return this.cp.crease(this); }
	// creaseAndRepeat(){ this.cp.creaseRayRepeat(this); }
	// creaseAndStop(){ this.cp.creaseAndStop(this); }
}
class CPPolyline extends M.Polyline{
	// cp;
	constructor(cp, polyline){
		super();
		this.cp = cp;
		this.nodes = polyline.nodes.map(function(p){return new M.XY(p.x,p.y);},this);
	}
	crease(){ return this.cp.creasePolyline(this); }
}
// class RabbitEar{
// 	faceFace;
// 	edges;
// }

//////////////////////////////////////////////////////////////////////////
// CREASE PATTERN
// enum CreaseDirection{
// 	mark,
// 	boundary,
// 	mountain,
// 	valley
// }

const CreaseDirection = Object.freeze({
	mark : "mark",//Symbol("mark"),
	boundary : "boundary",//Symbol("boundary"),
	mountain : "mountain",//Symbol("mountain"),
	valley : "valley",//Symbol("valley")
});

class Fold{
	constructor(foldFunction, argumentArray){
		this.func = foldFunction;
		this.args = argumentArray;
	}
}

// enum MadeByType{
// 	ray,
// 	doubleRay,
// 	endpoints,
// 	axiom1,
// 	axiom2,
// 	axiom3,
// 	axiom4,
// 	axiom5,
// 	axiom6,
// 	axiom7
// }

class MadeBy{
	// type;
	// rayOriginNode;  // if it's a ray, there will be 1 endPoint
	// endPointsNode;  // if it's a point 2 point fold, no rayOrigin and 2 endPoints
	// intersections;  // 1:1 with endPoints
	constructor(){
		this.endPoints = [];
		this.intersections = [];
	}
}

// crease pattern change callback, hook directly into cp.paperjs.js init()
// enum ChangeType{
// 	position,
// 	newLine
// }

class FoldSequence{
	// uses edge and node indices
	// because the actual objects will go away, or don't yet exist at the beginning
	// nope nopE! that't won't work. if you "implement" the fold sequence on another sized
	// sheet of paper, the fold won't execute the same way, different node indices will get applied.
}

class CreaseSector extends PlanarSector{
	bisect(){
		var vectors = this.vectors();
		var angles = vectors.map(function(el){ return Math.atan2(el.y, el.x); });
		while(angles[0] < 0){ angles[0] += Math.PI*2; }
		while(angles[1] < 0){ angles[1] += Math.PI*2; }
		var interior = M.counterClockwiseInteriorAngleRadians(angles[0], angles[1]);
		var bisected = angles[0] + interior*0.5;
		var ray = new M.Ray(new M.XY(this.origin.x, this.origin.y), new M.XY(Math.cos(bisected), Math.sin(bisected)));
		return new CPRay(this.origin.graph, ray);
	}
	/** This will search for an angle which if an additional crease is made will satisfy Kawasaki's theorem */
	kawasakiCollapse(){
		var junction = this.origin.junction();
		if(junction.edges.length % 2 == 0){ return; }
		// find this interior angle among the other interior angles
		var foundIndex = undefined;
		for(var i = 0; i < junction.sectors.length; i++){
			if(this.equivalent(junction.sectors[i])){ foundIndex = i; }
		}
		if(foundIndex == undefined){ return; }
		var sumEven = 0;
		var sumOdd = 0;
		// iterate over sectors not including this one, add them to their sums
		for(var i = 0; i < junction.sectors.length-1; i++){
			var index = (i+foundIndex+1) % junction.sectors.length;
			if(i % 2 == 0){ sumEven += junction.sectors[index].angle(); }
			else { sumOdd += junction.sectors[index].angle(); }
		}
		var dEven = Math.PI - sumEven;
		// var dOdd = Math.PI - sumOdd;
		var vec0 = this.edges[0].vector(this.origin);
		var angle0 = Math.atan2(vec0.y, vec0.x);
		// var angle1 = this.edges[1].absoluteAngle(this.origin);
		var newA = angle0 + dEven;
		var solution = new M.Ray(new M.XY(this.origin.x, this.origin.y), new M.XY(Math.cos(newA), Math.sin(newA)));
		if( this.contains( solution.origin.add(solution.direction) ) ){
			return new CPRay(this.origin.graph, solution);
		}
	}
}
class CreaseJunction extends PlanarJunction{

	// originNode;
	// sectors and edges are sorted clockwise
	// sectorsSector[];
	// edges;

	flatFoldable(epsilon){ return this.kawasaki(epsilon) && this.maekawa(); }

	alternateAngleSum(){
		// only computes if number of interior angles are even
		if(this.sectors.length % 2 != 0){ return undefined; }
		var sums = [0,0];
		this.sectors.forEach(function(el,i){ sums[i%2] += el.angle(); });
		return sums;
	}
	maekawa(){
		if(this.origin.isBoundary()){ return true; }
		var m = this.edges.filter(function(edge){return edge.orientation===CreaseDirection.mountain;},this).length;
		var v = this.edges.filter(function(edge){return edge.orientation===CreaseDirection.valley;},this).length;
		return Math.abs(m-v)==2;
	}
	kawasaki(epsilon){
		// todo: adjust this epsilon
		if(epsilon === undefined){ epsilon = 0.0001; }
		if(this.origin.isBoundary()){ return true; }
		var alternating = this.alternateAngleSum();
		if(alternating == undefined){ return false; }
		return Math.abs(alternating[0] - alternating[1]) < epsilon;
	}
	// 0.0 is equivalent to 100% valid
	// pi is equivalent to 100% wrong
	kawasakiRating(){
		var alternating = this.alternateAngleSum();
		return Math.abs(alternating[0] - alternating[1]);
	}
	kawasakiSolution(){
		var alternating = this.alternateAngleSum().map(function(el){
				return {'difference':(Math.PI - el), 'sectors':[]};
			});
		this.sectors.forEach(function(el,i){ alternating[i%2].sectors.push(el); });
		return alternating;
	}
	kawasakiCollapse(sector){
		// sector must be one of the Joints in this Junction
		if(this.edges.length % 2 == 0){ return; }
		// find this interior angle among the other interior angles
		var foundIndex = undefined;
		if(sector != undefined){
			for(var i = 0; i < this.sectors.length; i++){
				if(sector.equivalent(this.sectors[i])){ foundIndex = i; }
			}
		}
		if(foundIndex == undefined){
			//find best match for a sector
			for(var i = 0; i < this.sectors.length; i++){
				var ray = this.sectors[i].kawasakiCollapse();
				if(ray != undefined){ return ray; }
			}
			return;
		}
		var sumEven = 0;
		var sumOdd = 0;
		for(var i = 0; i < this.sectors.length-1; i++){
			var index = (i+foundIndex+1) % this.sectors.length;
			if(i % 2 == 0){ sumEven += this.sectors[index].angle(); }
			else { sumOdd += this.sectors[index].angle(); }
		}
		var dEven = Math.PI - sumEven;
		// var dOdd = Math.PI - sumOdd;
		var vec0 = sector.edges[0].vector(sector.origin);
		var angle0 = Math.atan2(vec0.y, vec0.x);
		// var angle1 = sector.edges[1].absoluteAngle(sector.origin);
		var newA = angle0 - dEven;
		var solution = new M.Ray(new M.XY(this.origin.x, this.origin.y), new M.XY(Math.cos(newA), Math.sin(newA)));
		if( sector.contains( solution.origin.add(solution.direction) ) ){
			return new CPRay(this.origin.graph, solution);
		}
		// return new M.XY(Math.cos(newA), Math.sin(newA));
	}
}
class CreaseNode extends PlanarNode{

	isBoundary(){
		return this.graph.boundary.liesOnEdge(this);
	}
	alternateAngleSum(){
		return (this.junction()).alternateAngleSum();
	}
	kawasakiRating(){
		return (this.junction()).kawasakiRating();
	}
	flatFoldable(epsilon){
		if(this.isBoundary()){ return true; }
		return (this.junction()).flatFoldable(epsilon);
	}
	kawasakiCollapse(a, b){
		var junction = this.junction();
		var sector = junction.sectorWithEdges(a,b);
		if(sector !== undefined){
			return junction.kawasakiCollapse(sector);
		}
	}
	// AXIOM 1
	// creaseLineThrough(point){return this.graph.creaseThroughPoints(this, point);}
	// AXIOM 2
	// creaseToPoint(point){return this.graph.creasePointToPoint(this, point);}
}
class Crease extends PlanarEdge{

	// orientationDirection;
	// how it was made
	// newMadeBy;
	// madeBy;

	constructor(graph, node1, node2){
		super(graph, node1, node2);
		this.orientation = CreaseDirection.mark;
		this.newMadeBy = new MadeBy();
		this.newMadeBy.endPoints = [node1, node2];
	};
	mark()    { this.orientation = CreaseDirection.mark; return this;}
	mountain(){ this.orientation = CreaseDirection.mountain; return this;}
	valley()  { this.orientation = CreaseDirection.valley; return this;}
	boundary(){ this.orientation = CreaseDirection.boundary; return this;}
	// AXIOM 3
	creaseToEdge(edge){return this.graph.creaseEdgeToEdge(this, edge);}
}

class NoCrease extends Crease{
	// orientationDirection;
	// how it was made
	// newMadeBy;
	// madeBy;

	constructor(){
		super(undefined, undefined, undefined);
		this.orientation = CreaseDirection.mark;
		this.newMadeBy = new MadeBy();
	};
	mark()    { return this; }
	mountain(){ return this; }
	valley()  { return this; }
	boundary(){ return this; }
}

class CreaseFace extends PlanarFace{
	constructor(graph){
		super(graph);
		this.coloring = 0;
		this.cache = {};
	}
	rabbitEar(){
		var sectors = this.sectors();
		if(sectors.length !== 3){ return []; }
		var rays = sectors.map(function(el){ return el.bisect(); });
		// calculate intersection of each pairs of rays
		var incenter = rays
			.map(function(el, i){
				var nextEl = rays[(i+1)%rays.length];
				return el.intersection(nextEl);
			})
			// average each point (sum, then divide by total)
			.reduce(function(prev, current){ return prev.add(current);})
			.scale(1.0/rays.length);
		var incenterNode = (this.graph).newPlanarNode(incenter.x, incenter.y);

		return this.nodes.map(function(el){
			return (this.graph).newCreaseBetweenNodes(el, incenterNode);
		}, this);
	}
	clipEdge(edge){
		var intersections = this.edges
			.map(function(el){ return M.intersectionEdgeEdge(edge, el); })
			.filter(function(el){return el !== undefined; })
			// filter out intersections equivalent to the edge points themselves
			.filter(function(el){ 
				return !el.equivalent(edge.nodes[0]) &&
				       !el.equivalent(edge.nodes[1]); });
		switch(intersections.length){
			case 0:
				if(this.contains(edge.nodes[0])){ return edge; } // completely inside
				return undefined;  // completely outside
			case 1:
				if(this.contains(edge.nodes[0])){
					return new M.Edge(edge.nodes[0], intersections[0]);
				}
				return new M.Edge(edge.nodes[1], intersections[0]);
			// case 2: return new M.Edge(intersections[0], intersections[1]);
			default:
				for(var i = 1; i < intersections.length; i++){
					if( !intersections[0].equivalent(intersections[i]) ){
						return new M.Edge(intersections[0], intersections[i]);
					}
				}
		}
	}
	clipLine(line){
		var intersections = this.edges
			.map(function(el){ return M.intersectionLineEdge(line, el); })
			.filter(function(el){return el !== undefined; });
		switch(intersections.length){
			case 0: return undefined;
			case 1: return new M.Edge(intersections[0], intersections[0]); // degenerate edge
			// case 2: 
			default:
				for(var i = 1; i < intersections.length; i++){
					if( !intersections[0].equivalent(intersections[i]) ){
						return new M.Edge(intersections[0], intersections[i]);
					}
				}
		}
	}
	clipRay(ray){
		var intersections = this.edges
			.map(function(el){ return M.intersectionRayEdge(ray, el); })
			.filter(function(el){return el !== undefined; });
		switch(intersections.length){
			case 0: return undefined;
			case 1: return new M.Edge(ray.origin, intersections[0]);
			// case 2: return new Edge(intersections[0], intersections[1]);
			default:
				for(var i = 1; i < intersections.length; i++){
					if( !intersections[0].equivalent(intersections[i]) ){
						return new M.Edge(intersections[0], intersections[i]);
					}
				}
		}
	}	
}

export default class CreasePattern extends PlanarGraph{

	// nodesNode;
	// edges;
	// facesFace;
	// junctionsJunction;
	// sectorsSector;
	// for now boundaries are limited to convex polygons. an update simply requires switching this out.
	// boundary;

	// symmetryLine;

	// this will store the global fold sequence
	// foldSequence;

	// when subclassed, base types are overwritten

	// didChange;

	constructor(){
		super();
		// bind types
		this.nodeType = CreaseNode;
		this.edgeType = Crease;
		this.faceType = CreaseFace;
		this.sectorType = CreaseSector;
		this.junctionType = CreaseJunction;
		this.CreaseDirection = CreaseDirection;

		// this data model
		this.symmetryLine = undefined;
		this.boundary = new M.ConvexPolygon();
		this.square();
	}

	///////////////////////////////////////////////////////////////
	// CLEAN  /  REMOVE PARTS

	clear(){
		this.nodes = [];
		this.edges = [];
		this.faces = [];
		this.sectors = [];
		this.junctions = [];
		this.symmetryLine = undefined;
		this.cleanBoundary();
		this.clean();
		return this;
	}

	cleanBoundary(){
		// remove edges marked "boundary", remove any now-isolated nodes
		this.edges = this.edges.filter(function(el){ return el.orientation !== CreaseDirection.boundary; });
		this.cleanAllNodes();
		// based on boundary polygon, redraw crease lines to match, mark them as .boundary()
		var boundaryNodes = this.boundary.nodes().map(function(node){ return this.newPlanarNode(node.x, node.y); },this);
		boundaryNodes.forEach(function(node, i){
			var nextNode = boundaryNodes[ (i+1)%boundaryNodes.length ];
			(this.newPlanarEdgeBetweenNodes(node, nextNode)).boundary();
		},this);
		this.cleanDuplicateNodes();
	}

	//////////////////////////////////////////////
	// BOUNDARY
	contains(a, b){
		var p = gimme1XY(a, b);
		if(p == undefined){ return false; }
		return this.boundary.contains(p);
	}
	square(width){
		if(width == undefined){ width = 1.0; }
		else if(width < 0){ width = Math.abs(width); }
		return this.setBoundary([[0,0], [width,0], [width,width], [0,width]], true);
	}
	rectangle(width, height){
		if(width == undefined || height == undefined){ return this; }
		width = Math.abs(width);
		height = Math.abs(height);
		return this.setBoundary([[0,0], [width,0], [width,height], [0,height]], true);
	}
	polygon(sides){
		if(sides < 3){ return this; }
		return this.setBoundary(M.ConvexPolygon.regularPolygon(sides).nodes());
	}
	noBoundary(){
		this.boundary.edges = [];
		this.cleanBoundary();
		this.clean();
		return this;
	}
	setBoundary(pointArray, pointsSorted){
		var points = pointArray.map(function(p){ return gimme1XY(p); },this);
		// check if the first point is duplicated again at the end of the array
		if( points[0].equivalent(points[points.length-1]) ){ points.pop(); }
		if(pointsSorted === true){ this.boundary = M.ConvexPolygon.withPoints(points); }
		else{ this.boundary = M.ConvexPolygon.convexHull(points); }
		this.cleanBoundary();
		this.clean();
		return this;
	}
	setMinimumRectBoundary(){
		var bounds = this.bounds();
		return this.setBoundary( [
			[bounds.origin.x, bounds.origin.y],
			[bounds.origin.x+bounds.size.width, bounds.origin.y],
			[bounds.origin.x+bounds.size.width, bounds.origin.y+bounds.size.height],
			[bounds.origin.x, bounds.origin.y+bounds.size.height]
		]);
	}

	///////////////////////////////////////////////////////////////
	// SYMMETRY

	noSymmetry(){
		this.symmetryLine = undefined;
		return this;
	}
	bookSymmetry(){
		var center = this.boundary.center();
		this.symmetryLine = new M.Line(center, new M.XY(0, 1));
		return this;
	}
	diagonalSymmetry(){
		var center = this.boundary.center();
		this.symmetryLine = new M.Line(center, new M.XY(0.7071, 0.7071));
		return this;
	}
	setSymmetryLine(a, b, c, d){
		var edge = gimme1Edge(a,b,c,d);
		this.symmetryLine = new M.Line(edge.nodes[0], edge.nodes[1].subtract(edge.nodes[1]));
		return this;
	}

	///////////////////////////////////////////////////////////////
	// ADD PARTS

	// creaseThroughLayers(point, vector:CPVector){
	// 	return this.creaseRayRepeat(new Ray(point.x, point.y, vector.x, vector.y));
	// }

	// foldInHalf(){ return; }

	// kawasakiCollapse(a, b, c, d){
	// 	if(isValidPoint(a)){
	// 		var j = this.nearest(a, b).junction;
	// 		return j.kawasakiCollapse();
	// 	}
	// 	if(isValidNumber(a) && isValidNumber(b)){
	// 		var j = this.nearest(a, b).junction;
	// 		return j.kawasakiCollapse();
	// 	}
	// }
	kawasakiCollapse(a, b, c, d){
		if(isValidPoint(a)){
			var j = this.nearest(a, b).junction;
			if(j == undefined){ return new NoCrease(); }
			var k = j.kawasakiCollapse();
			return k != undefined ? k.crease() : new NoCrease();
		}
		if(isValidNumber(a) && isValidNumber(b)){
			var j = this.nearest(a, b).junction;
			if(j == undefined){ return new NoCrease(); }
			var k = j.kawasakiCollapse();
			return k != undefined ? k.crease() : new NoCrease();
		}
	}

	point(a, b){ return new CPPoint(this, gimme1XY(a,b)); }
	line(a, b, c, d){ return new CPLine(this, gimme1Line(a,b,c,d)); }
	ray(a, b, c, d){ return new CPRay(this, gimme1Ray(a,b,c,d)); }
	edge(a, b, c, d){ return new CPEdge(this, gimme1Edge(a,b,c,d)); }
	//AXIOMS
	axiom1(a, b, c, d){
		var points = gimme2XY(a, b, c, d);
		if(points === undefined){ return undefined; }
		return new CPLine(this, new M.Line(points[0], points[1].subtract(points[0])));
	}
	axiom2(a, b, c, d){
		var points = gimme2XY(a, b, c, d);
		return new CPLine(this, new M.Line(points[1].midpoint(points[0]), points[1].subtract(points[0]).rotate90()));
	}
	axiom3(one, two){
		return new M.Edge(one).infiniteLine().bisect(new M.Edge(two).infiniteLine())
			.map(function (line) { return new CPLine(this, line); }, this);
	}
	axiom4(line, point){ return new CPLine(this, new M.Line(point, new M.Edge(line).vector().rotate90())); }
	axiom5(origin, point, line){
		var radius = Math.sqrt(Math.pow(origin.x - point.x, 2) + Math.pow(origin.y - point.y, 2));
		var intersections = new M.Circle(origin, radius).intersection(new M.Edge(line).infiniteLine());
		var lines = [];
		for(var i = 0; i < intersections.length; i++){ lines.push(this.axiom2(point, intersections[i])); }
		return lines;
	}
	axiom6(point1, point2, line1, line2){
		var p1 = point1.x;
		var q1 = point1.y;
		//find equation of line in form y = mx+h (or x = k)
		if (line1.nodes[1].x - line1.nodes[0].x != 0) {
			var m1 = (line1.nodes[1].y - line1.nodes[0].y) / ((line1.nodes[1].x - line1.nodes[0].x));
			var h1 = line1.nodes[0].y - m1 * line1.nodes[0].x;
		}
		else {
			var k1 = line1.nodes[0].x;
		}

		var p2 = point2.x;
		var q2 = point2.y;
		//find equation of line in form y = mx+h (or x = k)
		if (line2.nodes[1].x - line2.nodes[0].x != 0) {
			var m2 = (line2.nodes[1].y - line2.nodes[0].y) / (line2.nodes[1].x - line2.nodes[0].x);
			var h2 = line2.nodes[0].y - m2 * line2.nodes[0].x;
		}
		else {
			var k2 = line2.nodes[0].x;
		}

		//equation of perpendicular bisector between (p,q) and (u, v) {passes through ((u+p)/2,(v+q)/2) with slope -(u-p)/(v-q)}
		//y = (-2(u-p)x + (v^2 -q^2 + u^2 - p^2))/2(v-q)

		//equation of perpendicular bisector between (p,q) and (u, mu+h)
		// y = (-2(u-p)x + (m^2+1)u^2 + 2mhu + h^2-p^2-q^2)/(2mu + 2(h-q))

		//equation of perpendicular bisector between (p,q) and (k, v)
		//y = (-2(k-p)x + (v^2 + k^2-p^2-q^2))/2(v-q)

		//if the two bisectors are the same line, then the gradients and intersections of both lines are equal

		//case 1: m1 and m2 both defined
		if (m1 !== undefined && m2 !== undefined) {
			//1: (u1-p1)/(m1u1+(h1 -q1)) = (u2-p2)/(m2u2+(h2-q2))
			//and
			//2: (a1u1^2+b1u1+ c1)/(d1u1+e1) = (a2u2^2+b2u2+c2)/(d2u2+e2)
			//where
			//an = mn^2+1
			//bn = 2mnhn
			//cn = hn^2-pn^2-qn^2
			//dn = 2mn
			//en = 2(hn-qn)

			var a1 = m1*m1 + 1;
			var b1 = 2*m1*h1;
			var c1 = h1*h1 - p1*p1 - q1*q1;
			//var d1 = 2*m1;
			//var e1 = 2*(h1 - q1);

			var a2 = m2*m2 + 1;
			var b2 = 2*m2*h2;
			var c2 =  h2*h2 - p2*p2 - q2*q2;
			//var d2 = 2*m2;
			//var e2 = 2*(h2 - q2);

			//rearrange 1 to express u1 in terms of u2
			//u1 = (a0u2+b0)/(c0u2+d0)
			//where
			//a0 = m2p1-(q1-h1)
			//b0 = p2(q1-h1)-p1(q2-h2)
			//c0= m2-m1
			//d0= m1p2-(q2-h2)
			var a0 = m2*p1 + (h1 - q1);
			var b0 = p1*(h2 - q2) - p2*(h1 - q1);
			var c0 = m2 - m1;
			var d0 = m1*p2 + (h2 - q2);

			var z = m1*p1 + (h1 - q1);
			//subsitute u1 into 2 and solve for u2:
		}
		else if (m1 === undefined && m2 === undefined) {
			//1: (k1-p1)/(v1 -q1)) = (k2-p2)/(v2-q2)
			//and
			//2: (v1^2+c1)/(d1v1+e1) = (v2^2+c2)/(d2u2+e2)
			//where
			//cn = kn^2-pn^2-qn^2
			//dn = 2
			//en = -2qn

			a1 = 1;
			b1 = 0;
			c1 = k1*k1 - p1*p1 - q1*q1;
			//d1 = 2;
			//e1 = -2*q1;

			a2 = 1;
			b2 = 0;
			c2 = k2*k2 - p2*p2 - q2*q2;
			//d2 = 2;
			//e2 = -2*q2;

			//rearrange 1 to express v1 in terms of v2
			//v1 = (a0v2+b0)/d0
			//where
			//a0 =k1-p1
			//b0 = q1(k2-p2)-q1(k1-p1)
			//d0= k2-p2
			a0 = k1 - p1;
			b0 = q1*(k2 - p2) - q2*(k1 - p1);
			c0 = 0;
			d0 = k2 - p2;

			z = a0;
			//subsitute v1 into 2 and solve for v2:
		}
		else {
			if (m1 === undefined) {
				//swap the order of the points and lines
				var p3 = p1;
				p1 = p2;
				p2 = p3;
				var q3 = q1;
				q1 = q2;
				q2 = q3;
				m1 = m2;
				m2 = undefined;
				h1 = h2;
				h2 = undefined;
				k2 = k1;
				k1 = undefined;
			}

			//1: (u1-p1)/(m1u1+(h1 -q1))  = (k2-p2)/(v2-q2)
			//and
			//2: (a1u1^2+b1u1+ c1)/(d1u1+e1) =  (v2^2+c2)/(d2u2+e2)
			//where
			//a1 = m1^2+1
			//b1 = 2m1h1
			//c1 = h1^2-p1^2-q1^2
			//d1 = 2m1
			//e1 = 2(h1-q1)
			//c2 = k2^2-p2^2-q2^2
			//d2 = 2
			//e2 = -2q2

			a1 = m1*m1 + 1;
			b1 = 2*m1*h1;
			c1 = h1*h1 - p1*p1 - q1*q1;
			//d1 = 2*m1;
			//e1 = 2*(h1 - q1);

			a2 = 1;
			b2 = 0;
			c2 = k2*k2 - p2*p2 - q2*q2;
			//d2 = 2;
			//e2 = -2*q2;

			//rearrange 1 to express u1 in terms of v2
			//u1 = (a0v2+b0)/(v2+d0)
			//where
			//a0 = p1
			//b0 = (h1-q1)(k2-p2) - p1q1
			//d0= -m1(k2-p2)-q2
			a0 = p1;
			b0 = (h1 - q1)*(k2 - p2) - p1*q2;
			c0 = 1;
			d0 = -m1*(k2 - p2) - q2;

			z = m1*p1 + (h1 - q1);
			//subsitute u1 into 2 and solve for v2:
		}

		//subsitute into 3:
		//4: (a3x^2 + b3x + c3)/(d3x^2 + e3x + f3) = (a2x^2 + b2x + c2)/(d2x + e2)
		//where
		//a3 = a1a0^2+b1a0c0+c1c0^2
		//b3 = 2a1a0b0+b1(a0d0+b0c0)+2c1c0d0
		//c3 = a1b0^2+b1b0d0+c1d0^2
		//d3 =c0(d1a0+e1c0) = d2c0z
		//e3 = d0(d1a0+e1c0)+c0(d1b+e1d) = (d2d0+e2c0)z
		//f3 = d0(d1b0+e1d0) = e2d0z

		var a3 = a1*a0*a0 + b1*a0*c0 + c1*c0*c0;
		var b3 = 2*a1*a0*b0 + b1*(a0*d0 + b0*c0) + 2*c1*c0*d0;
		var c3 = a1*b0*b0 + b1*b0*d0 + c1*d0*d0;
		//var d3 = d2*c0*z
		//var e3 = (d2*d0 + e2*c0)*z;
		//var f3 = e2*d0*z;

		//rearrange to gain the following quartic
		//5: (d2x+e2)(a4x^3+b4x^2+c4x+d) = 0
		//where
		//a4 = a2c0z
		//b4 = (a2d0+b2c0)z-a3
		//c4 = (b2d0+c2c0)z-b3
		//d4 = c2d0z-c3

		var a4 = a2*c0*z;
		var b4 = (a2*d0 + b2*c0) * z - a3;
		var c4 = (b2*d0 + c2*c0) * z - b3;
		var d4 =  c2*d0*z - c3;

		//find the roots
		var roots = new CubicEquation(a4,b4,c4,d4).realRoots();

		var lines = [];
		if (roots != undefined && roots.length > 0) {
			for (var i = 0; i < roots.length; ++i) {
				if (m1 !== undefined && m2 !== undefined) {
					var u2 = roots[i];
					var v2 = m2*u2 + h2;
					//var u1 = (a0*u2 + b0)/(c0*u2 + d0);
					//var v1 = m1*u1 + h1;
				}
				else if (m1 === undefined && m2 === undefined) {
					v2 = roots[i];
					u2 = k2;
					//v1 = (a0*v2 + b0)/d0;
					//u1 = k1;
				}
				else {
					v2 = roots[i];
					u2 = k2;
					//u1 = (a0*v2 + b0)/(v2 + d0);
					//v1 =  m1*u1 + h1;
				}

				//The midpoints may be the same point, so cannot be used to determine the crease
				//lines.push(this.axiom1(new M.XY((u1 + p1) / 2, (v1 + q1) / 2), new M.XY((u2 + p2) / 2, (v2 + q2) / 2)));

				if (v2 != q2) {
					//F(x) = mx + h = -((u-p)/(v-q))x +(v^2 -q^2 + u^2 - p^2)/2(v-q)
					var mF = -1*(u2 - p2)/(v2 - q2);
					var hF = (v2*v2 - q2*q2 + u2*u2 - p2*p2) / (2 * (v2 - q2));

					lines.push(this.axiom1(new M.XY(0, hF), new M.XY(1, mF + hF)));
				}
				else {
					//G(y) = k
					var kG = (u2 + p2)/2;

					lines.push(this.axiom1(new M.XY(kG, 0), new M.XY(kG, 1)));
				}
			}
		}
		return lines;
	}
	axiom7(point, ontoLine, perp){
		var newLine = new M.Line(point, new M.Edge(perp).vector());
		var intersection = newLine.intersection(new M.Edge(ontoLine).infiniteLine());
		if(intersection === undefined){ return undefined; }
		return this.axiom2(point, intersection);
	};

	newCreaseBetweenNodes(aNode, bNode){
		this.unclean = true;
		return this.newEdge(a, b);
	}

	newCrease(a_x, a_y, b_x, b_y){
		// this is a function expecting all boundary conditions satisfied
		// use this.crease() instead
		this.creaseSymmetry(a_x, a_y, b_x, b_y);
		var newCrease = this.newPlanarEdge(a_x, a_y, b_x, b_y);
		if(this.didChange !== undefined){ this.didChange(undefined); }
		return newCrease;
	}

	creaseSymmetry(ax, ay, bx, by){
		if(this.symmetryLine === undefined){ return undefined; }
		// todo, improve this whole situation
		var ra = new M.XY(ax, ay).reflect(this.symmetryLine);
		var rb = new M.XY(bx, by).reflect(this.symmetryLine);
		return this.newPlanarEdge(ra.x, ra.y, rb.x, rb.y);
	}

	/** Create a crease that is a line segment, and will crop if it extends beyond boundary
	 * @arg 1 Edge, Ray, or Line, or 2 M.XY points or 4 numbers indicating endpoints of an edge
	 * @returns {Crease} pointer to the Crease
	 */
	crease(a, b, c, d){
		if(a instanceof M.Line){ return this.creaseLine(a); }
		if(a instanceof M.Edge){ return this.creaseEdge(a); }
		if(a instanceof M.Ray){ return this.creaseRay(a); }
		var e = gimme1Edge(a,b,c,d);
		if(e === undefined){ return; }
		var edge = this.boundary.clipEdge(e);
		if(edge === undefined){ return; }
		return this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
	}
	/** Create a crease
	 * @arg 4 numbers, 2 M.XY points, or 1 Edge, Ray, or Line
	 * @returns {Crease} pointer to the Crease
	 */
	creaseAndStop(a, b, c, d){
		if(a instanceof M.Line){
			var endpoints = a.rays().map(function(ray){
				return ray.intersectionsWithEdges(this.edges).shift()
			},this).filter(function(el){return el!=undefined;},this);
			// todo: split this out into length == 0 (below), and length == 1 (redo it with 1 ray)
			if(endpoints.length < 2){ return this.creaseLine(a); }
			return this.creaseEdge(endpoints[0], endpoints[1]);
		}
		if(a instanceof M.Ray){
			// todo: implicit epsilon
			var intersections = a.intersectionsWithEdges(this.edges).filter(function(point){return !point.equivalent(a.origin);});
			var intersection = intersections.shift();
			if(intersection == undefined){ return this.creaseRay(a); }
			return this.creaseEdge(a.origin, intersection);
		}
		// too much is inferred here, but point 0 of the edge is treated as the ray origin and the entire edge is creased so long as it doesn't cross over other edges, if it does it retains the side with the origin
		var e = gimme1Edge(a,b,c,d);
		var point0Ray = new M.Ray(e.nodes[0],new M.XY(e.nodes[1].x-e.nodes[0].x,e.nodes[1].y-e.nodes[0].y));
		var edgeDetail = point0Ray.clipWithEdgesDetails(this.edges).shift();
		if(edgeDetail == undefined){ return; }
		if(edgeDetail['edge'].length() < e.length()){
			return this.creaseEdge(edgeDetail['edge']);
		}
		return this.creaseEdge(e);
	}

	creaseAndReflect(a, b, c, d){
		if(a instanceof M.Line){
			return a.rays().map(function(ray){
				return this.creaseRayRepeat(ray);
			},this).reduce(function(prev,curr){
				return prev.concat(curr);
			},[]);
		}
		if(a instanceof M.Ray){
			return this.creaseRayRepeat(a);
		}
		if(isValidPoint(a) && isValidPoint(b)){
			return this.creaseRayRepeat(new M.Ray(a, b));
		}
		return undefined;
	}

	creaseLine(a, b, c, d){
		var line = gimme1Line(a,b,c,d);
		if(line === undefined){ return; }
		var edge = this.boundary.clipLine(line);
		if(edge === undefined){ return; }
		return this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
	}
	creaseRay(a, b, c, d){
		var ray = gimme1Ray(a,b,c,d);
		if(ray === undefined) { return; }
		var edge = this.boundary.clipRay(ray);
		if(edge === undefined) { return; }
		var newCrease = this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
		// if(pointsSimilar(origin, newCrease.nodes[0])){ newCrease.newMadeBy.rayOrigin = newCrease.nodes[0]; }
		// if(pointsSimilar(origin, newCrease.nodes[1])){ newCrease.newMadeBy.rayOrigin = newCrease.nodes[1]; }
		return newCrease;
	}
	creaseEdge(a, b, c, d){
		var e = gimme1Edge(a,b,c,d);
		if(e === undefined){ return; }
		var edge = this.boundary.clipEdge(e);
		if(edge === undefined){ return; }
		return this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
	}

	// creaseRayUntilMark
	creaseRayUntilIntersection(ray, target){
		var clips = ray.clipWithEdgesDetails(this.edges);
		if(clips.length > 0){
			// if target exists, and target is closer than shortest edge, return crease to target
			if(target !== undefined){
				var targetEdge = new M.Edge(ray.origin.x, ray.origin.y, target.x, target.y);
				if(clips[0].edge.length() > targetEdge.length()){ return this.crease(targetEdge); }
			}
			// return crease to edge
			return this.crease(clips[0].edge);
		}
		return undefined;
	}

	creaseLineRepeat(a, b, c, d){
		var ray = gimme1Ray(a,b,c,d);
		return this.creaseRayRepeat(ray)
		           .concat(this.creaseRayRepeat( ray.flip() ));
	}

	creaseRayRepeat(ray, target){
		return new M.Polyline()
			.rayReflectRepeat(ray, this.edges, target)
			.edges()
			.map(function(edge){
				return this.crease(edge);
			},this)
			.filter(function(el){ return el != undefined; });
	}

	creasePolyline(polyline){
		return polyline.edges()
			.map(function(edge){
				return this.crease(edge);
			},this)
			.filter(function(el){ return el != undefined; });
	}

	// AXIOM 1
	creaseThroughPoints(a, b, c, d){
		var l = this.axiom1(a, b, c, d);
		if(l === undefined){ return undefined; }
		var newCrease = l.crease();
		// newCrease.madeBy = new Fold(this.creaseThroughPoints, gimme2XY(a,b,c,d));
		return newCrease;
	}
	// AXIOM 2
	creasePointToPoint(a, b, c, d){
		var l = this.axiom2(a, b, c, d);
		if(l === undefined){ return undefined; }
		var newCrease = l.crease();
		// newCrease.madeBy = new Fold(this.creasePointToPoint, gimme2XY(a,b,c,d));
		return newCrease;
	}
	// AXIOM 3
	creaseEdgeToEdge(one, two){
		return this.axiom3(one, two)
			.map(function(line){ return line.crease(); }, this)
			.filter(function(edge){ return edge !== undefined; }, this);
	}
	// AXIOM 4
	creasePerpendicularThroughPoint(line, point){
		var l = this.axiom4(line, point);
		if(l === undefined){ return undefined; }
		var newCrease = l.crease();
		//newCrease.madeBy = new Fold(this.creasePerpendicularThroughPoint, [new M.Edge(line), new M.XY(point)]);
		return newCrease;
	}
	// AXIOM 5
	creasePointToLine(origin, point, line){
		return this.axiom5(origin, point, line)
			.map(function(line){ return line.crease(); }, this)
			.filter(function(edge){ return edge !== undefined; }, this);
	}
	// AXIOM 6
	creasePointsToLines(point1, point2, line1, line2){
		return this.axiom6(point1, point2, line1, line2)
			.map(function(line){ return line.crease(); }, this)
			.filter(function(edge){ return edge !== undefined; }, this);
	}
	// AXIOM 7
	creasePerpendicularPointOntoLine(point, ontoLine, perp){
		var l = this.axiom7(point, ontoLine, perp);
		if(l === undefined){ return undefined; }
		var newCrease = l.crease();
		//newCrease.madeBy = new Fold(this.creasePerpendicularPointOntoLine, [new M.XY(point), new M.Edge(ontoLine), new M.Edge(perp)]);
		return newCrease;
	}

	pleat(count, one, two){
		var a = new M.Edge(one.nodes[0].x, one.nodes[0].y, one.nodes[1].x, one.nodes[1].y);
		var b = new M.Edge(two.nodes[0].x, two.nodes[0].y, two.nodes[1].x, two.nodes[1].y);
		return a.infiniteLine()
			.subsect(b.infiniteLine(), count)
			.map(function(line){
					return this.boundary.clipLine( line );
				},this)
			.filter(function(el){ return el != undefined; },this)
			.map(function(el){
				return this.newCrease(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y);
			},this);
	}

	glitchPleat(one, two, count){
		var a = new M.Edge(one.nodes[0].x, one.nodes[0].y, one.nodes[1].x, one.nodes[1].y);
		var b = new M.Edge(two.nodes[0].x, two.nodes[0].y, two.nodes[1].x, two.nodes[1].y);
		var u = a.nodes[0].subtract(a.nodes[1]);
		var v = b.nodes[0].subtract(b.nodes[1]);
		return Array.apply(null, Array(count-1))
			.map(function(el,i){ return (i+1)/count; },this)
			.map(function(el){
				var origin = a.nodes[0].lerp(b.nodes[0], el);
				var vector = u.lerp(v, el);
				return this.boundary.clipLine( new M.Line(origin, vector) );
			},this)
			.filter(function(el){ return el !== undefined; },this)
			.map(function(el){ return this.newCrease(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y) },this);
	}

	availableAxiomFolds(){
		var edges = [];
		edges = edges.concat(this.availableAxiom1Folds());
		edges = edges.concat(this.availableAxiom2Folds());
		edges = edges.concat(this.availableAxiom3Folds());
		return edges;
	}
	// availableAxiom1Folds(){
	availableAxiom1Folds(){
		var edges = [];
		for(var n0 = 0; n0 < this.nodes.length-1; n0++){
			for(var n1 = n0+1; n1 < this.nodes.length; n1++){
				var inputEdge = new M.Edge(this.nodes[n0], this.nodes[n1]);
				var edge = this.boundary.clipLine( inputEdge.infiniteLine() );
				if(edge !== undefined){
					var cpedge = new CPEdge(this, edge);
					cpedge.madeBy = new Fold(this.creaseThroughPoints, [new M.XY(this.nodes[n0].x,this.nodes[n0].y), new M.XY(this.nodes[n1].x,this.nodes[n1].y)]);
					edges.push(cpedge);
				}
			}
		}
		// this.cleanDuplicateNodes();
		return edges;
	}
	// availableAxiom2Folds(){
	availableAxiom2Folds(){
		var edges = [];
		for(var n0 = 0; n0 < this.nodes.length-1; n0++){
			for(var n1 = n0+1; n1 < this.nodes.length; n1++){
				var inputEdge = new M.Edge(this.nodes[n0], this.nodes[n1]);
				var edge = this.boundary.clipLine( inputEdge.perpendicularBisector() );
				if(edge !== undefined){
					var cpedge = new CPEdge(this, edge);
					cpedge.madeBy = new Fold(this.creasePointToPoint, [new M.XY(this.nodes[n0].x,this.nodes[n0].y), new M.XY(this.nodes[n1].x,this.nodes[n1].y)]);
					edges.push(cpedge);
				}
			}
		}
		// this.cleanDuplicateNodes();
		return edges;
	}
	// availableAxiom3Folds(){
	availableAxiom3Folds(){
		var edges = [];
		for(var e0 = 0; e0 < this.edges.length-1; e0++){
			for(var e1 = e0+1; e1 < this.edges.length; e1++){
				var a = this.edges[e0].infiniteLine();
				var b = this.edges[e1].infiniteLine();
				var pair = a.bisect(b).map(function(line){
					return this.boundary.clipLine( line );
				},this).filter(function(el){ return el !== undefined; },this);
				var p = pair.map(function(edge){
					var cpedge = new CPEdge(this, edge);
					cpedge.madeBy = new Fold(this.creaseEdgeToEdge, [this.edges[e0].copy(), this.edges[e1].copy()]);
					return cpedge;
				},this);
				edges = edges.concat(p);
			}
		}
		// this.cleanDuplicateNodes();
		return edges;
	}

	availableAxiom4Folds(){
		var edges = [];
		for(var e = 0; e < this.edges.length; e++){
			for(var n = 0; n < this.nodes.length; n++){
				var point = new M.XY(this.nodes[n].x, this.nodes[n].y);
				var edge = this.boundary.clipLine( new M.Line(point, this.edges[e].vector().rotate90()) );
				if(edge != undefined){
					var cpedge = new CPEdge(this, edge);
					cpedge.madeBy = new Fold(this.creasePerpendicularThroughPoint, [point, new M.Edge(this.edges[e].nodes[0].copy(), this.edges[e].nodes[1].copy())]);
					edges.push(cpedge);
				}
			}
		}
		return edges;
	}

	// precision is an epsilon value: 0.00001
	/*
	wiggle(precision){
		if (precision === undefined){ precision = EPSILON; }

		var lengths = this.edges.forEach(function(crease, i){
			return crease.length();
		});
		// prevent too much deviation from length

		var dup = this.copy();

		var forces = [];
		for(var i = 0; i < dup.nodes.length; i++){ forces.push(new M.XY(0,0)); }

		var nodesAttempted = 0;
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
					var move = new M.XY( 0.05*radius * Math.cos(randomAngle),
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
	wiggle(epsilon){
		if(epsilon === undefined){ epsilon = 0.00001; }

		var lengths = this.edges.forEach(function(crease, i){
			return crease.length();
		});
		// prevent too much deviation from length

		var nodesAttempted = 0;
		// var dup = this.copy();
		// var shuffleNodes = shuffle(this.nodes);
		for(var i = 0; i < this.nodes.length; i++){
			var rating = this.nodes[i].kawasakiRating();
			if(rating > epsilon){
				nodesAttempted++;
				// guess some numbers.
				var guesses = []; // {xy:__(XY)__, rating:__(number)__};
				for(var n = 0; n < 12; n++){
					// maybe store angle so that we can keep track of it between rounds
					var randomAngle = Math.random()*Math.PI*20; // wrap around to make sure it's random
					var radius = Math.random() * rating;
					var move = new M.XY( 0.05*radius * Math.cos(randomAngle),
					                   0.05*radius * Math.sin(randomAngle));
					this.nodes[i].x += move.x;
					this.nodes[i].y += move.y;
					var newRating = this.nodes[i].kawasakiRating();
					var adjNodes = this.nodes[i].adjacentNodes();
					// var numRatings = 1;  // begin with this node. add the adjacent nodes
					var adjRating = 0;
					for(var adj = 0; adj < adjNodes.length; adj++){
						adjRating += this.nodes[i].kawasakiRating();
						// numRatings += 1;
					}
					guesses.push( {xy:move, rating:newRating+adjRating} );
					// guesses.push( {xy:move, rating:(newRating+adjRating)/numRatings} );
					// undo change
					this.nodes[i].x -= move.x;
					this.nodes[i].y -= move.y;
				}
				var sortedGuesses = guesses.sort(function(a,b) {return a.rating - b.rating;} );
				// if(sortedGuesses[0].rating < rating){
					this.nodes[i].x += sortedGuesses[0].xy.x;
					this.nodes[i].y += sortedGuesses[0].xy.y;
					// perform quick intersection test, does any line associated with this node intersect with other lines? if so, undo change.
				// }
			}
		}
		return nodesAttempted;
	}

	flatFoldable(){
		return this.nodes.map(function(el){return el.flatFoldable()})
		                 .reduce(function(prev,cur){return prev && cur;});
	}

	//////////////////////////////////////////////
	// GET PARTS
	boundaryBounds(){ return this.boundary.minimumRect(); }

	bottomEdge(){
		return this.edges
			.filter(function(el){return el.orientation === CreaseDirection.boundary})
			.sort(function(a,b){return (b.nodes[0].y+b.nodes[1].y)-(a.nodes[0].y+a.nodes[1].y);})
			.shift();
	}
	topEdge(){
		return this.edges
			.filter(function(el){return el.orientation === CreaseDirection.boundary})
			.sort(function(a,b){ return (a.nodes[0].y+a.nodes[1].y)-(b.nodes[0].y+b.nodes[1].y);})
			.shift();
	}
	rightEdge(){
		return this.edges
			.filter(function(el){return el.orientation === CreaseDirection.boundary})
			.sort(function(a,b){ return (b.nodes[0].x+b.nodes[1].x)-(a.nodes[0].x+a.nodes[1].x);})
			.shift();
	}
	leftEdge(){
		return this.edges
			.filter(function(el){return el.orientation === CreaseDirection.boundary})
			.sort(function(a,b){return (a.nodes[0].x+a.nodes[1].x)-(b.nodes[0].x+b.nodes[1].x);})
			.shift();
	}

	////////////////////////////////////////////////////////////////
	///
	////////////////////////////////////////////////////////////////

	overlapRelationMatrix(){
		// boolean relationship for entry matrix[A][B] can be read as:
		//  is face A "on top of" face B?
		this.clean();
		// if(face == undefined){
		// 	var bounds = this.boundaryBounds();
		// 	face = this.nearest(bounds.size.width * 0.5, bounds.size.height*0.5).face;
		// }
		// if(face === undefined){ return; }
		// var tree = face.adjacentFaceTree();
		// console.log(tree);

		var matrix = Array.apply(null, Array(this.faces.length)).map(function(e){
			return Array.apply(null, Array(this.faces.length))
		},this);
		var adj = this.faces.map(function(face){return face.edgeAdjacentFaces();},this);
		adj.forEach(function(adjFaces, i){
			var face = this.faces[i];
			adjFaces.filter(function(adjFace){ return matrix[face.index][adjFace.index] == undefined; },this)
				.forEach(function(adjFace){
					// only works for convex faces
					var thisEdge = face.commonEdges(adjFace).shift();
					switch(thisEdge.orientation){
						case CreaseDirection.mountain: matrix[face.index][adjFace.index] = true; break;
						case CreaseDirection.valley: matrix[face.index][adjFace.index] = false; break;
					}
				},this);
		},this);

		console.log(matrix);

		return undefined;
	}

	removeAllMarks(){
		for(var i = this.edges.length-1; i >= 0; i--){
			if(this.edges[i].orientation === CreaseDirection.mark){
				// this.removeEdge(this.edges[i]);
				i -= this.removeEdge(this.edges[i]).edges.total - 1;
			}
		}
		this.clean();
		return this;
	}

	fold(face){
		this.clean();
		var copyCP = this.copy().removeAllMarks();
		if(face == undefined){
			var bounds = copyCP.boundaryBounds();
			face = copyCP.nearest(bounds.origin.x + bounds.size.width * 0.5,
			                      bounds.origin.y + bounds.size.height*0.5).face;
		} else{
			var centroid = face.centroid();
			face = copyCP.nearest(centroid.x, centroid.y).face;
		}
		if(face === undefined){ return; }
		var tree = face.adjacentFaceTree();
		var faces = [];
		tree['matrix'] = new M.Matrix();
		faces.push({'face':tree.obj, 'matrix':tree['matrix'], 'level':0});
		function recurse(node, level){
			node.children.forEach(function(child){
				var local = child.obj.commonEdges(child.parent.obj).shift().reflectionMatrix();
				child['matrix'] = child.parent['matrix'].mult(local);
				faces.push({'face':child.obj, 'matrix':child['matrix'], 'level':level});
				recurse(child, level+1);
			},this);
		}
		recurse(tree, 1);
		var nodeTransformed = Array.apply(false, Array(copyCP.nodes.length))
		faces.forEach(function(f){
			f.face.cache = {matrix:f.matrix, coloring:f.level % 2};
			f.face.nodes
				.filter(function(node){ return !nodeTransformed[node.index]; },this)
				.forEach(function(node){
					node.transform(f.matrix);
					nodeTransformed[node.index] = true;
				},this);
		},this);
		return copyCP.exportFoldFile();
	}

	foldSVG(face){
		this.clean();
		var copyCP = this.copy().removeAllMarks();
		if(face == undefined){
			var bounds = copyCP.boundaryBounds();
			face = copyCP.nearest(bounds.origin.x + bounds.size.width * 0.5,
			                      bounds.origin.y + bounds.size.height * 0.5).face;
		}
		if(face === undefined){ return; }
		var tree = face.adjacentFaceTree();
		var faces = [];
		tree['matrix'] = new M.Matrix();
		faces.push({'face':tree.obj, 'matrix':tree['matrix']});
		function recurse(node){
			node.children.forEach(function(child){
				var local = child.obj.commonEdges(child.parent.obj).shift().reflectionMatrix();
				child['matrix'] = child.parent['matrix'].mult(local);
				faces.push({'face':child.obj, 'matrix':child['matrix']});
				recurse(child);
			},this);
		}
		recurse(tree);
		var nodeTransformed = Array.apply(false, Array(copyCP.nodes.length))
		faces.forEach(function(el){
			el.face.nodes
				.filter(function(node){ return !nodeTransformed[node.index]; },this)
				.forEach(function(node){
					node.transform(el.matrix);
					nodeTransformed[node.index] = true;
				},this);
		},this);
		return copyCP.exportSVG();
	}

	///////////////////////////////////////////////////////////////
	// FILE FORMATS

	importCreasePattern(cp){
		// shallow copy, 
		this.nodes = cp.nodes;
		this.edges = cp.edges;
		this.faces = cp.faces;
		this.junctions = cp.junctions;
		this.sectors = cp.sectors;
		this.boundary = cp.boundary;
		this.symmetryLine = cp.symmetryLine;
		this.foldSequence = cp.foldSequence;
	}

	export(fileType){
		switch(fileType.toLowerCase()){
			case "fold": return this.exportFoldFile();
			case "svg": return this.exportSVG();
		}
	}

	exportFoldFile(){
		// this.clean();
		this.nodeArrayDidChange();
		this.edgeArrayDidChange();

		var file = {};
		file["file_spec"] = 1;
		file["file_creator"] = "Rabbit Ear";
		file["file_author"] = "";
		file["file_classes"] = ["singleModel"];
		file["vertices_coords"] = this.nodes.map(function(node){
			return [cleanNumber(node.x, 12),cleanNumber(node.y, 12)];
		},this);
		file["faces_vertices"] = this.faces.map(function(face){
			return face.nodes.map(function(node){ return node.index; },this);
		},this);
		file["edges_vertices"] = this.edges.map(function(edge){
			return edge.nodes.map(function(node){ return node.index; },this);
		},this);
		file["edges_assignment"] = this.edges.map(function(edge){
			switch(edge.orientation){
				case CreaseDirection.boundary: return "B";
				case CreaseDirection.mountain: return "M";
				case CreaseDirection.valley: return "V";
				case CreaseDirection.mark: return "F";
				default: return "U";
			}
		},this);
		file["faces_matrix"] = this.faces.map(function(face){
			if(face.cache != undefined && face.cache.matrix != undefined){
				var m = face.cache.matrix;
				return [m.a, m.b, m.c, m.d, m.tx, m.ty];
			} else { return [1, 0, 0, 1, 0, 0]; }
		});
		file["faces_coloring"] = this.faces.map(function(face){
			if(face.cache != undefined && face.cache.coloring != undefined){
				return face.cache.coloring;
			} else { return 0; }
		});
		return file;
	}

	importFoldFile(file, epsilon){
		if(file === undefined ||
		   file["vertices_coords"] === undefined ||
		   file["edges_vertices"] === undefined){ return undefined; }

		// this library only supports 2D
		// if file is 3D, we need to alert the user
		if(file["frame_attributes"] !== undefined && file["frame_attributes"].contains("3D")){
			console.log("importFoldFile(): FOLD file marked as '3D', this library only supports 2D. attempting import anyway, expect a possible distortion due to orthogonal projection.");
			// return false;
		}

		// file["file_spec"]
		// file["file_creator"]
		// file["file_author"]
		// file["file_title"]
		// file["file_description"]
		// file["file_classes"]

		this.noBoundary();
		this.clear();

		file["vertices_coords"].forEach(function(el){
			// if z value is found, it should alert the user
			this.newPlanarNode( (el[0] || 0), (el[1] || 0));
		},this);
		this.nodeArrayDidChange();

		file["edges_vertices"]
			.map(function(el){
				return el.map(function(index){ return this.nodes[index]; },this);
			},this)
			.filter(function(el){ return el[0] !== undefined && el[1] !== undefined; },this)
			.forEach(function(nodes){
				this.newPlanarEdgeBetweenNodes(nodes[0], nodes[1]);
			},this);
		this.edgeArrayDidChange();

		var assignmentDictionary = { "B": CreaseDirection.boundary, "M": CreaseDirection.mountain, "V": CreaseDirection.valley, "F": CreaseDirection.mark, "U": CreaseDirection.mark };
		file["edges_assignment"]
			.map(function(assignment){ return assignmentDictionary[assignment]; })
			.forEach(function(orientation, i){ this.edges[i].orientation = orientation; },this);

		this.faces = file["faces_vertices"]
			.map(function(faceNodeArray, fi){
				var face = new CreaseFace(this);
				face.nodes = faceNodeArray.map(function(nodeIndex){ return this.nodes[nodeIndex]; },this);
				face.edges = face.nodes.map(function(node,ei){
					var nextNode = face.nodes[ (ei+1)%face.nodes.length ];
					return this.getEdgeConnectingNodes(node, nextNode);
				},this);
				if(file["faces_matrix"] != undefined && file["faces_matrix"][fi].length >= 6){
					var m = file['faces_matrix'][fi];
					face.matrix = new M.Matrix(m[0], m[1], m[2], m[3], m[4], m[5]);
				}
				if(file["faces_coloring"] != undefined){
					face.coloring = file['faces_coloring'][fi];
				}
				return face;
			},this)
		this.faceArrayDidChange();

		var boundaryPoints = this.edges
			.filter(function(el){ return el.orientation === CreaseDirection.boundary; },this)
			.map(function(el){
				return [
					new M.XY(el.nodes[0].x, el.nodes[0].y),
					new M.XY(el.nodes[1].x, el.nodes[1].y)
				]
			},this)
		this.setBoundary([].concat.apply([],boundaryPoints));
		this.clean(epsilon);
		return this;
	}
	
	importSVG(data){
		var cp = SVGLoader(data);
		this.importCreasePattern(cp);
		return this;
	};


	exportSVG(size){
		if(size === undefined || size <= 0){ size = 600; }
		var bounds = this.boundaryBounds();
		var width = bounds.size.width;
		var height = bounds.size.height;
		var scale = size / (width);
		var origins = [bounds.origin.x, bounds.origin.y];
		var widthScaled = cleanNumber(width*scale).toString();
		var heightScaled = cleanNumber(height*scale).toString();
		var dashW = cleanNumber(width * scale * 0.0025 * 4).toString();
		// var dashWOff = ((width)*scale * 0.0025 * 6 * 0.5).toFixed(1);
		var dashWOff = dashW;
		var strokeWidthNum = width * scale * 0.0025 * 2
		var strokeWidth = strokeWidthNum < 0.5 ? 0.5 : cleanNumber(strokeWidthNum).toString();
		if(strokeWidth == 0){ strokeWidth = 0.5; }

		var valleyStyle = "stroke=\"#4379FF\" stroke-linecap=\"round\" stroke-dasharray=\"" + dashW + "," + dashWOff + "\" ";
		var mountainStyle = "stroke=\"#EE1032\" ";
		var noStyle = "stroke=\"#000000\" ";

		var blob = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- generated by Rabbit Ear https://rabbitear.org -->\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"" +widthScaled+ "px\" height=\"" +heightScaled+ "px\" viewBox=\"0 0 " +widthScaled+ " " +heightScaled+ "\">\n";

		var orientationList = [CreaseDirection.mark, CreaseDirection.valley, CreaseDirection.mountain, CreaseDirection.boundary];
		var styles = [noStyle, valleyStyle, mountainStyle, noStyle];
		var gNames = ["marks", "valley", "mountain", "boundary"];
		var sortedCreases = orientationList.map(function(orient){ return this.edges.filter(function(e){return e.orientation==orient;},this)},this);
		// add a category for anything that slipped by the crease orientation
		sortedCreases.unshift( this.edges.filter(function(e){
			// matching this crease's orientation against list of orientations comes up with no matches
			return orientationList.filter(function(el){return el==e.orientation;},this).length==0;
		},this) );
		gNames.unshift("other")
		styles.unshift(noStyle);

		sortedCreases.forEach(function(creases,i){
			if(creases.length == 0){ return; }
			blob += "<g id=\"" + gNames[i] + "\">\n";
			var style = styles[i];
			creases.forEach(function(crease){
				var p = crease.nodes
					.map(function(el){ return [el.x, el.y]; },this)
					.reduce(function(prev,curr){ return prev.concat(curr); },[])
 					.map(function(el,i){ return (el - origins[i%2]) * scale; },this)
					.map(function(number){ return cleanNumber(number, 12).toString(); },this);
				blob += "\t<line " + style + "stroke-width=\"" + strokeWidth + "\" x1=\"" +p[0]+ "\" y1=\"" +p[1]+ "\" x2=\"" +p[2]+ "\" y2=\"" +p[3]+ "\"/>\n";
			},this);
			blob += "</g>\n";
		},this);

		blob += "</svg>\n";
		return blob;
	}

	exportSVGMin(size){
		if(size === undefined || size <= 0){ size = 600; }
		var bounds = this.boundaryBounds();
		var width = bounds.size.width;
		var height = bounds.size.height;
		var padX = bounds.origin.x;
		var padY = bounds.origin.y;
		var scale = size / (width+padX*2);
		var strokeWidth = (width*scale * 0.0025).toFixed(1);
		if(strokeWidth === "0" || strokeWidth === "0.0"){ strokeWidth = "0.5"; }
		var polylines = this.polylines();
		var blob = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- generated by Rabbit Ear https://rabbitear.org -->\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"" +((width+padX*2)*scale)+ "px\" height=\"" +((height+padY*2)*scale)+ "px\" viewBox=\"0 0 " +((width+padX*2)*scale)+ " " +((height+padY*2)*scale)+ "\">\n<g>\n";

		for(var i = 0; i < polylines.length; i++){
			if(polylines[i].nodes.length >= 0){
				blob += "<polyline fill=\"none\" stroke-width=\"" + strokeWidth + "\" stroke=\"#000000\" points=\"";
				for(var j = 0; j < polylines[i].nodes.length; j++){
					var point = polylines[i].nodes[j];
					blob += cleanNumber(scale*point.x, 12).toString() + "," + cleanNumber(scale*point.y, 12).toString() + " ";
				}
				blob += "\"/>\n";
			}
		}
		blob = blob + "</g>\n</svg>\n";
		return blob;
	}

	kiteBase(){
		return this.importFoldFile({"vertices_coords":[[0,0],[1,0],[1,1],[0,1],[0.4142135623730955,0],[1,0.5857864376269045]],"faces_vertices":[[2,3,5],[3,0,4],[3,1,5],[1,3,4]],"edges_vertices":[[2,3],[3,0],[3,1],[3,4],[0,4],[4,1],[3,5],[1,5],[5,2]],"edges_assignment":["B","B","V","M","B","B","M","B","B"]});
	}
	fishBase(){
		return this.importFoldFile({"vertices_coords":[[0,0],[1,0],[1,1],[0,1],[0.292893218813,0.292893218813],[0.707106781187,0.707106781187],[0.292893218813,0],[1,0.707106781187]],"faces_vertices":[[2,3,5],[3,0,4],[3,1,5],[1,3,4],[4,0,6],[1,4,6],[5,1,7],[2,5,7]],"edges_vertices":[[2,3],[3,0],[3,1],[0,4],[1,4],[3,4],[1,5],[2,5],[3,5],[4,6],[0,6],[6,1],[5,7],[1,7],[7,2]],"edges_assignment":["B","B","V","M","M","M","M","M","M","V","B","B","V","B","B"]});
	}
	birdBase(){
		return this.importFoldFile({"vertices_coords":[[0,0],[1,0],[1,1],[0,1],[0.5,0.5],[0.207106781187,0.5],[0.5,0.207106781187],[0.792893218813,0.5],[0.5,0.792893218813],[0.353553390593,0.646446609407],[0.646446609407,0.646446609407],[0.646446609407,0.353553390593],[0.353553390593,0.353553390593],[0,0.5],[0.5,0],[1,0.5],[0.5,1]],"faces_vertices":[[3,5,9],[5,3,13],[0,5,13],[5,0,12],[4,5,12],[5,4,9],[0,6,12],[6,0,14],[1,6,14],[6,1,11],[4,6,11],[6,4,12],[1,7,11],[7,1,15],[2,7,15],[7,2,10],[4,7,10],[7,4,11],[2,8,10],[8,2,16],[3,8,16],[8,3,9],[4,8,9],[8,4,10]],"edges_vertices":[[3,5],[0,5],[4,5],[0,6],[1,6],[4,6],[1,7],[2,7],[4,7],[2,8],[3,8],[4,8],[5,9],[9,8],[9,4],[3,9],[8,10],[10,7],[4,10],[10,2],[7,11],[11,6],[4,11],[11,1],[6,12],[12,5],[0,12],[12,4],[5,13],[0,13],[13,3],[6,14],[0,14],[14,1],[7,15],[1,15],[15,2],[8,16],[3,16],[16,2]],"edges_assignment":["M","M","M","M","M","M","M","M","M","M","M","M","F","F","F","F","F","F","V","V","F","F","F","F","F","F","V","V","V","B","B","V","B","B","V","B","B","V","B","B"]});
	}
	frogBase(){
		return this.importFoldFile({"vertices_coords":[[0,0],[1,0],[1,1],[0,1],[0.5,0.5],[0,0.5],[0.5,0],[1,0.5],[0.5,1],[0.146446609407,0.353553390593],[0.353553390593,0.146446609407],[0.646446609407,0.146446609407],[0.853553390593,0.353553390593],[0.853553390593,0.646446609407],[0.646446609407,0.853553390593],[0.353553390593,0.853553390593],[0.146446609407,0.646446609407],[0,0.353553390593],[0,0.646446609407],[0.353553390593,0],[0.646446609407,0],[1,0.353553390593],[1,0.646446609407],[0.646446609407,1],[0.353553390593,1]],"faces_vertices":[[0,4,9],[4,0,10],[4,2,14],[2,4,13],[3,4,15],[4,3,16],[4,1,12],[1,4,11],[4,5,9],[5,4,16],[4,6,11],[6,4,10],[4,7,13],[7,4,12],[4,8,15],[8,4,14],[0,9,17],[9,5,17],[10,0,19],[6,10,19],[1,11,20],[11,6,20],[12,1,21],[7,12,21],[2,13,22],[13,7,22],[14,2,23],[8,14,23],[3,15,24],[15,8,24],[16,3,18],[5,16,18]],"edges_vertices":[[0,4],[4,2],[3,4],[4,1],[4,5],[4,6],[4,7],[4,8],[0,9],[4,9],[5,9],[4,10],[0,10],[6,10],[1,11],[4,11],[6,11],[4,12],[1,12],[7,12],[2,13],[4,13],[7,13],[4,14],[2,14],[8,14],[3,15],[4,15],[8,15],[4,16],[3,16],[5,16],[9,17],[0,17],[17,5],[16,18],[5,18],[18,3],[10,19],[0,19],[19,6],[11,20],[6,20],[20,1],[12,21],[1,21],[21,7],[13,22],[7,22],[22,2],[14,23],[8,23],[23,2],[15,24],[3,24],[24,8]],"edges_assignment":["V","V","V","M","V","V","V","V","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","V","B","B","V","B","B","V","B","B","V","B","B","V","B","B","V","B","B","V","B","B","V","B","B"]});
	}

	/** This will deep-copy the contents of this graph and return it as a new object
	 * @returns {CreasePattern}
	 */
	copy(){
		this.nodeArrayDidChange();
		this.edgeArrayDidChange();
		this.faceArrayDidChange();
		var g = new CreasePattern();
		g.nodes = []; g.edges = []; g.faces = [];
		g.boundary = undefined;
		for(var i = 0; i < this.nodes.length; i++){
			var n = g.addNode(new CreaseNode(g));
			Object.assign(n, this.nodes[i]);
			n.graph = g; n.index = i;
		}
		for(var i = 0; i < this.edges.length; i++){
			var index = [this.edges[i].nodes[0].index, this.edges[i].nodes[1].index];
			var e = g.addEdge(new Crease(g, g.nodes[index[0]], g.nodes[index[1]]));
			Object.assign(e, this.edges[i]);
			e.graph = g; e.index = i;
			e.nodes = [g.nodes[index[0]], g.nodes[index[1]]];
			// e.orientation = this.edges[i].orientation;
		}
		for(var i = 0; i < this.faces.length; i++){
			var f = new CreaseFace(g);
			g.faces.push(f);
			f.graph = g;
			f.index = i;
			// Object.assign(f, this.faces[i]);
			if(this.faces[i] !== undefined){
				if(this.faces[i].nodes !== undefined){
				for(var j=0;j<this.faces[i].nodes.length;j++){
					var nIndex = this.faces[i].nodes[j].index;
					f.nodes.push(g.nodes[nIndex]);
				} }
				if(this.faces[i].edges !== undefined){
				for(var j=0;j<this.faces[i].edges.length;j++){
					var eIndex = this.faces[i].edges[j].index;
					f.edges.push(g.edges[eIndex]);
				} }
			}
		}
		g.sectors = this.sectors.map(function(sector,i){
			var gSecEdges = sector.edges.map(function(edge){ return g.edges[edge.index]; },this);
			var s = new CreaseSector(gSecEdges[0], gSecEdges[1]);
			s.index = i;
			return s;
		},this);
		g.junctions = this.junctions.map(function(junction,i){
			var j = new CreaseJunction(undefined);
			// Object.assign(j, this.junctions[i]);
			j.origin = g.nodes[ junction.origin.index ];
			j.sectors = junction.sectors.map(function(sector){ return g.sectors[sector.index]; },this);
			j.edges = junction.edges.map(function(edge){ return g.edges[edge.index]; },this);
			j.index = i;
			return j;
		},this);
		g.boundary = this.boundary.copy();
		return g;
	}


/*
	loadXML() {
		var ret = {};
		var callback, errorCallback;

		for (var i = 1; i < arguments.length; i++) {
			var arg = arguments[i];
			if (typeof arg === 'function') {
				if (typeof callback === 'undefined') {
					callback = arg;
				} else if (typeof errorCallback === 'undefined') {
					errorCallback = arg;
				}
			}
		}

		var self = this;
		this.httpDo(
			arguments[0],
			'GET',
			'xml',
			function(xml) {
				for (var key in xml) {
					ret[key] = xml[key];
				}
				if (typeof callback !== 'undefined') {
					callback(ret);
				}

				// self._decrementPreload();
			},
			function(err) {
				// Error handling
				// error

				if (errorCallback) {
					errorCallback(err);
				} else {
					throw err;
				}
			}
		);

		return ret;
	};



		// _runIfPreloadsAreDone() {
		// 	var context = this._isGlobal ? window : this;
		// 	if (context._preloadCount === 0) {
		// 		var loadingScreen = document.getElementById(context._loadingScreenId);
		// 		if (loadingScreen) {
		// 			loadingScreen.parentNode.removeChild(loadingScreen);
		// 		}
		// 		context._setup();
		// 		context._runFrames();
		// 		context._draw();
		// 	}
		// };

		// _decrementPreload() {
		// 	var context = this._isGlobal ? window : this;
		// 	if (typeof context.preload === 'function') {
		// 		context._setProperty('_preloadCount', context._preloadCount - 1);
		// 		context._runIfPreloadsAreDone();
		// 	}
		// };


	httpDo(_a, _b, _c, _d, _e) {
		var type;
		var callback;
		var errorCallback;
		var request;
		var promise;
		var jsonpOptions = {};
		var cbCount = 0;
		var contentType = 'text/plain';
		// Trim the callbacks off the end to get an idea of how many arguments are passed
		for (var i = arguments.length - 1; i > 0; i--) {
			if (typeof arguments[i] === 'function') {
				cbCount++;
			} else {
				break;
			}
		}
		// The number of arguments minus callbacks
		var argsCount = arguments.length - cbCount;
		var path = arguments[0];
		if (
			argsCount === 2 &&
			typeof path === 'string' &&
			typeof arguments[1] === 'object'
		) {
			// Intended for more advanced use, pass in Request parameters directly
			request = new Request(path, arguments[1]);
			callback = arguments[2];
			errorCallback = arguments[3];
		} else {
			// Provided with arguments
			var method = 'GET';
			var data;

			for (var j = 1; j < arguments.length; j++) {
				var a = arguments[j];
				if (typeof a === 'string') {
					if (a === 'GET' || a === 'POST' || a === 'PUT' || a === 'DELETE') {
						method = a;
					} else if (
						a === 'json' ||
						a === 'jsonp' ||
						a === 'binary' ||
						a === 'arrayBuffer' ||
						a === 'xml' ||
						a === 'text' ||
						a === 'table'
					) {
						type = a;
					} else {
						data = a;
					}
				} else if (typeof a === 'number') {
					data = a.toString();
				} else if (typeof a === 'object') {
					if (a.hasOwnProperty('jsonpCallback')) {
						for (var attr in a) {
							jsonpOptions[attr] = a[attr];
						}
					} else {
						data = JSON.stringify(a);
						contentType = 'application/json';
					}
				} else if (typeof a === 'function') {
					if (!callback) {
						callback = a;
					} else {
						errorCallback = a;
					}
				}
			}

			request = new Request(path, {
				method: method,
				mode: 'cors',
				body: data,
				headers: new Headers({
					'Content-Type': contentType
				})
			});
		}
		// do some sort of smart type checking
		if (!type) {
			if (path.indexOf('json') !== -1) {
				type = 'json';
			} else if (path.indexOf('xml') !== -1) {
				type = 'xml';
			} else {
				type = 'text';
			}
		}

		if (type === 'jsonp') {
			// promise = fetchJsonp(path, jsonpOptions);
		} else {
			promise = fetch(request);
		}
		promise = promise.then(function(res) {
			if (!res.ok) {
				var err = new Error(res.body);
				err['status'] = res.status;
				err['ok'] = false;
				throw err;
			} else {
				var fileSize = res.headers.get('content-length');
				if (fileSize && fileSize > 64000000) {
					// error loading file
				}
				switch (type) {
					case 'json':
					case 'jsonp':
						return res.json();
					case 'binary':
						return res.blob();
					case 'arrayBuffer':
						return res.arrayBuffer();
					case 'xml':
						return res.text().then(function(text) {
							var parser = new DOMParser();
							var xml = parser.parseFromString(text, 'text/xml');
							return this.parseXML(xml.documentElement);
						});
					default:
						return res.text();
				}
			}
		});
		promise.then(callback || function() {});
		promise.catch(errorCallback || console.error);
		return promise;
	};


	XML = function() {
		this.name = null;
		this.attributes = {};
		this.children = [];
		this.parent = null;
		this.content = null;
	};

	parseXML(two) {
		var one = new this.XML();
		var children = two.childNodes;
		if (children && children.length) {
			for (var i = 0; i < children.length; i++) {
				var node = this.parseXML(children[i]);
				one.addChild(node);
			}
			one.setName(two.nodeName);
			one._setCont(two.textContent);
			one._setAttributes(two);
			for (var j = 0; j < one.children.length; j++) {
				one.children[j].parent = one;
			}
			return one;
		} else {
			one.setName(two.nodeName);
			one._setCont(two.textContent);
			one._setAttributes(two);
			return one;
		}
	}
*/


}
