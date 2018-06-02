// creasePattern.js
// for the purposes of performing origami operations on a planar graph
// MIT open source license, Robby Kraft

// overview
// 1st order operations: crease pattern methods that don't require any arguments, or only 1st order types
// 2nd order operations: crease pattern methods that require knowledge of methods in the geometry module

/// <reference path="planarGraph.ts" />

"use strict";

//////////////////////////// TYPE CHECKING //////////////////////////// 
// function isValidPoint(point:XY):boolean{return(point!==undefined&&!isNaN(point.x)&&!isNaN(point.y));}
// function isValidNumber(n:number):boolean{return(n!==undefined&&!isNaN(n)&&!isNaN(n));}
/////////////////////////////// FUNCTION INPUT INTERFACE /////////////////////////////// 
function gimme1XY(a:any, b?:any):XY{
	// input is 1 XY, or 2 numbers
	// if(a instanceof XY){ return a; }
	if(isValidPoint(a)){ return new XY(a.x, a.y); }
	if(isValidNumber(b)){ return new XY(a, b); }
	if(a.constructor === Array){ return new XY(a[0], a[1]); }
}
function gimme2XY(a:any, b:any, c?:any, d?:any):[XY,XY]{
	// input is 2 XY, or 4 numbers
	if(a instanceof XY && b instanceof XY){ return [a,b]; }
	if(isValidPoint(b)){ return [new XY(a.x,a.y), new XY(b.x,b.y)]; }
	if(isValidNumber(d)){ return [new XY(a, b), new XY(c, d)]; }
}
function gimme1Edge(a:any, b?:any, c?:any, d?:any):Edge{
	// input is 1 edge, 2 XY, or 4 numbers
	if(a instanceof Edge){ return a; }
	if(a.nodes !== undefined){ return new Edge(a.nodes[0], a.nodes[1]); }
	if(isValidPoint(b) ){ return new Edge(a,b); }
	if(isValidNumber(d)){ return new Edge(a,b,c,d); }
}
function gimme1Ray(a:any, b?:any, c?:any, d?:any):Ray{
	// input is 1 ray, 2 XY, or 4 numbers
	if(a instanceof Ray){ return a; }
	if(isValidPoint(b) ){ return new Ray(a,b); }
	if(isValidNumber(d)){ return new Ray(new XY(a,b), new XY(c,d)); }
}
function gimme1Line(a:any, b?:any, c?:any, d?:any):Line{
	// input is 1 line
	if(a instanceof Line){ return a; }
	// input is 2 XY
	if(isValidPoint(b) ){ return new Line(a,b); }
	// input is 4 numbers
	if(isValidNumber(d)){ return new Line(a,b,c,d); }
	// input is 1 line-like object with points in a nodes[] array
	if(a.nodes instanceof Array && 
	        a.nodes.length > 0 &&
	        isValidPoint(a.nodes[1])){
		return new Line(a.nodes[0].x,a.nodes[0].y,a.nodes[1].x,a.nodes[1].y);
	}
}

class CPPoint extends XY{
	cp:CreasePattern;
	constructor(cp:CreasePattern, point:XY){
		super(point.x, point.y);
		this.cp = cp;
	}
	nearest(){ return this.cp.nearest(this); }
}
abstract class CreaseLineType{
	cp:CreasePattern;
	crease(){ }
	// creaseAndRepeat(){ }
	// creaseAndStop(){ }
}
class CPLine extends Line implements CreaseLineType{
	cp:CreasePattern;
	constructor(cp:CreasePattern, line:Line){
		super(line.point, line.direction);
		this.cp = cp;
	}
	crease(){ return this.cp.crease(this); }
	// creaseAndRepeat(){ this.cp.creaseRayRepeat(this); }
	// creaseAndStop(){ this.cp.creaseAndStop(this); }
}
class CPRay extends Ray implements CreaseLineType{
	cp:CreasePattern;
	constructor(cp:CreasePattern, ray:Ray){
		super(ray.origin, ray.direction);
		this.cp = cp;
	}
	crease(){ return this.cp.crease(this); }
	creaseAndRepeat(){ this.cp.creaseRayRepeat(this); }
	creaseAndStop(){ this.cp.creaseAndStop(this); }
}
class CPEdge extends Edge implements CreaseLineType{
	cp:CreasePattern;
	madeBy:Fold;
	constructor(cp:CreasePattern, edge:Edge){
		super(edge.nodes[0], edge.nodes[1]);
		this.cp = cp;
	}
	crease(){ return this.cp.crease(this); }
	// creaseAndRepeat(){ this.cp.creaseRayRepeat(this); }
	// creaseAndStop(){ this.cp.creaseAndStop(this); }
}
class CPPolyline extends Polyline{
	cp:CreasePattern;
	constructor(cp:CreasePattern, polyline:Polyline){
		super();
		this.cp = cp;
		this.nodes = polyline.nodes.map(function(p){return new XY(p.x,p.y);},this);
	}
	crease(){ return this.cp.creasePolyline(this); }
}
// class CPVoronoiMolecule extends VoronoiMolecule{ }
// class CPVoronoiMoleculeTriangle extends VoronoiMoleculeTriangle{ }
// class CPVoronoiEdge extends VoronoiEdge{ }
// class CPVoronoiCell extends VoronoiCell{ }
// class CPVoronoiJunction extends VoronoiJunction{ }
// class CPVoronoiGraph extends VoronoiGraph{ }

//////////////////////////////////////////////////////////////////////////
// CREASE PATTERN
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

enum MadeByType{
	ray,
	doubleRay,
	endpoints,
	axiom1,
	axiom2,
	axiom3,
	axiom4,
	axiom5,
	axiom6,
	axiom7
}

class MadeBy{
	type:MadeByType;
	rayOrigin:CreaseNode;  // if it's a ray, there will be 1 endPoint
	endPoints:CreaseNode[];  // if it's a point 2 point fold, no rayOrigin and 2 endPoints
	intersections:Crease[];  // 1:1 with endPoints
	constructor(){
		this.endPoints = [];
		this.intersections = [];
	}
}

// crease pattern change callback, hook directly into cp.paperjs.js init()
enum ChangeType{
	position,
	newLine
}

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
		var interior = clockwiseInteriorAngleRadians(angles[0], angles[1]);
		var bisected = angles[0] - interior*0.5;
		var ray = new Ray(new XY(this.origin.x, this.origin.y), new XY(Math.cos(bisected), Math.sin(bisected)));
		return new CPRay(<CreasePattern>this.origin.graph, ray);
	}

	/** This will search for an angle which if an additional crease is made will satisfy Kawasaki's theorem */
	kawasakiFourth():XY{
		var junction = this.origin.junction();
		// todo: allow searches for other number edges
		if(junction.edges.length != 3){ return; }
		// find this interior angle among the other interior angles
		var foundIndex = undefined;
		for(var i = 0; i < junction.sectors.length; i++){
			if(this.equivalent(junction.sectors[i])){ foundIndex = i; }
		}
		if(foundIndex === undefined){ return undefined; }
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
		var newA = angle0 - dEven;
		return new XY(Math.cos(newA), Math.sin(newA));
	}
}
class CreaseJunction extends PlanarJunction{

	origin:CreaseNode;
	// sectors and edges are sorted clockwise
	sectors:CreaseSector[];
	edges:Crease[];

	flatFoldable(epsilon?:number):boolean{
		// todo: this should check (at least)
		// - kawasaki's theorem
		// - maekawa's theorem
		return this.kawasaki(epsilon) && this.maekawa();
	}

	alternateAngleSum():[number,number]{
		// only computes if number of interior angles are even
		if(this.sectors.length % 2 != 0){ return undefined; }
		var sums:[number, number] = [0,0];
		this.sectors.forEach(function(el,i){ sums[i%2] += el.angle(); });
		return sums;
	}
	maekawa():boolean{
		return true;
	}
	kawasaki(epsilon?:number):boolean{
		// todo: adjust this epsilon
		if(epsilon === undefined){ epsilon = 0.0001; }
		if(this.origin.isBoundary()){ return true; }
		var alternating = this.alternateAngleSum();
		if(alternating == undefined){ return true; }
		return Math.abs(alternating[0] - alternating[1]) < epsilon;
	}
	// 0.0 is equivalent to 100% valid
	// pi is equivalent to 100% wrong
	kawasakiRating():number{
		var alternating = this.alternateAngleSum();
		return Math.abs(alternating[0] - alternating[1]);
	}
	kawasakiSolution():[{'difference':number,'sectors':CreaseSector[]},
	                    {'difference':number,'sectors':CreaseSector[]}]{
		var alternating = <[{'difference':number,'sectors':CreaseSector[]},{'difference':number,'sectors':CreaseSector[]}]>
			this.alternateAngleSum().map(function(el){
				return {'difference':(Math.PI - el), 'sectors':[]};
			});
		this.sectors.forEach(function(el,i){ alternating[i%2].sectors.push(el); });
		return alternating;
	}
	kawasakiFourth(sector:PlanarSector):XY{
		// sector must be one of the Joints in this Junction
		
		// todo: allow searches for other number edges
		if(this.edges.length != 3){ return; }
		// find this interior angle among the other interior angles
		var foundIndex = undefined;
		for(var i = 0; i < this.sectors.length; i++){
			if(sector.equivalent(this.sectors[i])){ foundIndex = i; }
		}
		if(foundIndex === undefined){ return undefined; }
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
		return new XY(Math.cos(newA), Math.sin(newA));
	}
}
class CreaseNode extends PlanarNode{
	graph:CreasePattern;

	isBoundary():boolean{
		return this.graph.boundary.liesOnEdge(this);
	}
	alternateAngleSum():[number,number]{
		return (<CreaseJunction>this.junction()).alternateAngleSum();
	}
	kawasakiRating():number{
		return (<CreaseJunction>this.junction()).kawasakiRating();
	}
	flatFoldable(epsilon?:number):boolean{
		if(this.isBoundary()){ return true; }
		return (<CreaseJunction>this.junction()).flatFoldable(epsilon);
	}
	kawasakiFourth(a:Crease, b:Crease):XY{
		var junction = <CreaseJunction>this.junction();
		var sector = <CreaseSector>junction.sectorWithEdges(a,b);
		if(sector !== undefined){
			return junction.kawasakiFourth(sector);
		}
	}
	// AXIOM 1
	// creaseLineThrough(point:XY):Crease{return this.graph.creaseThroughPoints(this, point);}
	// AXIOM 2
	// creaseToPoint(point:XY):Crease{return this.graph.creasePointToPoint(this, point);}
}
class Crease extends PlanarEdge{

	graph:CreasePattern;
	orientation:CreaseDirection;
	// how it was made
	newMadeBy:MadeBy;
	madeBy:Fold;

	constructor(graph:CreasePattern, node1:CreaseNode, node2:CreaseNode){
		super(graph, node1, node2);
		this.orientation = CreaseDirection.mark;
		this.newMadeBy = new MadeBy();
		this.newMadeBy.endPoints = [node1, node2];
	};
	mark()    { this.orientation = CreaseDirection.mark; return this;}
	mountain(){ this.orientation = CreaseDirection.mountain; return this;}
	valley()  { this.orientation = CreaseDirection.valley; return this;}
	border()  { this.orientation = CreaseDirection.border; return this;}
	// AXIOM 3
	creaseToEdge(edge:Crease):Crease[]{return this.graph.creaseEdgeToEdge(this, edge);}
}

// class RabbitEar{
// 	face:CreaseFace;
// 	edges:Crease[];
// }

class CreaseFace extends PlanarFace{

	// rabbitEar():RabbitEar{
	rabbitEar():Crease[]{
		var sectors = this.sectors();
		if(sectors.length !== 3){ return []; }
		var rays:Ray[] = sectors.map(function(el){ return new Ray(el.origin, el.bisect()); });
		// calculate intersection of each pairs of rays
		var incenter = rays
			.map(function(el:Ray, i){
				var nextEl:Ray = rays[(i+1)%rays.length];
				return el.intersection(nextEl);
			})
			// average each point (sum, then divide by total)
			.reduce(function(prev, current){ return prev.add(current);})
			.scale(1.0/rays.length);
		var incenterNode = <CreaseNode>(<CreasePattern>this.graph).newPlanarNode(incenter.x, incenter.y);

		return this.nodes.map(function(el){
			return (<CreasePattern>this.graph).newCreaseBetweenNodes(<CreaseNode>el, incenterNode);
		}, this);
	}
}

class CreasePattern extends PlanarGraph{

	nodes:CreaseNode[];
	edges:Crease[];
	// faces:CreaseFace[];
	junctions:CreaseJunction[];
	sectors:CreaseSector[];
	// for now our crease patterns outlines are limited to convex shapes,
	//   this can be easily switched out if all member functions are implemented
	//   for a concave polygon class
	boundary:ConvexPolygon;

	symmetryLine:Line = undefined;

	// this will store the global fold sequence
	foldSequence:FoldSequence;

	// when subclassed, base types are overwritten
	nodeType = CreaseNode;
	edgeType = Crease;
	faceType = CreaseFace;
	sectorType = CreaseSector;
	junctionType = CreaseJunction;

	didChange:(event:object)=>void;

	constructor(){
		super();
		if(this.boundary === undefined){ this.boundary = new ConvexPolygon(); }
		this.square();
	}

	///////////////////////////////////////////////////////////////
	// PUBLIC - ADD PARTS

	// creaseThroughLayers(point:CPPoint, vector:CPVector):Crease[]{
	// 	return this.creaseRayRepeat(new Ray(point.x, point.y, vector.x, vector.y));
	// }

	point(a:any, b?:any):CPPoint{ return new CPPoint(this, gimme1XY(a,b)); }
	line(a:any, b?:any, c?:any, d?:any):CPLine{ return new CPLine(this, gimme1Line(a,b,c,d)); }
	ray(a:any, b?:any, c?:any, d?:any):CPRay{ return new CPRay(this, gimme1Ray(a,b,c,d)); }
	edge(a:any, b?:any, c?:any, d?:any):CPEdge{ return new CPEdge(this, gimme1Edge(a,b,c,d)); }
	
	///////////////////////////////////////////////////////////////
	// ADD PARTS

	foldInHalf():Crease{ return; }

	// private
	newCreaseBetweenNodes(a:CreaseNode, b:CreaseNode):Crease{
		this.dirty = true;
		return <Crease>this.newEdge(a, b);
	}

	private newCrease(a_x:number, a_y:number, b_x:number, b_y:number):Crease{
		// this is a private function expecting all boundary conditions satisfied
		// use this.crease() instead
		this.creaseSymmetry(a_x, a_y, b_x, b_y);
		var newCrease = <Crease>this.newPlanarEdge(a_x, a_y, b_x, b_y);
		if(this.didChange !== undefined){ this.didChange(undefined); }
		return newCrease;
	}

	private creaseSymmetry(ax:number, ay:number, bx:number, by:number):Crease{
		if(this.symmetryLine === undefined){ return undefined; }
		// todo, improve this whole situation
		var ra = new XY(ax, ay).reflect(this.symmetryLine);
		var rb = new XY(bx, by).reflect(this.symmetryLine);
		return <Crease>this.newPlanarEdge(ra.x, ra.y, rb.x, rb.y);
	}

	/** Create a crease that is a line segment, and will crop if it extends beyond boundary
	 * @arg 1 Edge, Ray, or Line, or 2 XY points or 4 numbers indicating endpoints of an edge
	 * @returns {Crease} pointer to the Crease
	 */
	crease(a:any, b?:any, c?:any, d?:any):Crease{
		if(a instanceof Line){ return this.creaseLine(a); }
		if(a instanceof Edge){ return this.creaseEdge(a); }
		if(a instanceof Ray){ return this.creaseRay(a); }
		var e = gimme1Edge(a,b,c,d);
		if(e === undefined){ return; }
		var edge = this.boundary.clipEdge(e);
		if(edge === undefined){ return; }
		return this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
	}
	/** Create a crease 
	 * @arg 4 numbers, 2 XY points, or 1 Edge, Ray, or Line
	 * @returns {Crease} pointer to the Crease
	 */
	creaseAndStop(a:any, b?:any, c?:any, d?:any):Crease{
		if(a instanceof Line){
			var endpoints = a.rays().map(function(ray){
				return ray.intersectionsWithEdges(this.edges).shift()
			},this).filter(function(el){return el!=undefined;},this);
			// todo: split this out into length == 0 (below), and length == 1 (redo it with 1 ray)
			if(endpoints.length < 2){ return this.creaseLine(a); }
			return this.creaseEdge(endpoints[0], endpoints[1]);
		}
		if(a instanceof Ray){
			// todo: implicit epsilon
			var intersections = a.intersectionsWithEdges(this.edges).filter(function(point){return !point.equivalent(a.origin);});
			var intersection = intersections.shift();
			if(intersection == undefined){ return this.creaseRay(a); }
			return this.creaseEdge(a.origin, intersection);
		}
		// too much is inferred here, but point 0 of the edge is treated as the ray origin and the entire edge is creased so long as it doesn't cross over other edges, if it does it retains the side with the origin
		var e = gimme1Edge(a,b,c,d);
		var point0Ray = new Ray(e.nodes[0],new XY(e.nodes[1].x-e.nodes[0].x,e.nodes[1].y-e.nodes[0].y));
		var edgeDetail = point0Ray.clipWithEdgesDetails(this.edges).shift();
		if(edgeDetail == undefined){ return; }
		if(edgeDetail['edge'].length() < e.length()){
			return this.creaseEdge(edgeDetail['edge']);
		}
		return this.creaseEdge(e);
	}

	creaseAndReflect(a:any, b?:any, c?:any, d?:any):Crease{
		return undefined;
	}

	creaseLine(a:any, b?:any, c?:any, d?:any):Crease{
		var line = gimme1Line(a,b,c,d);
		if(line === undefined){ return; }
		var edge = this.boundary.clipLine(line);
		if(edge === undefined){ return; }
		return this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
	}
	creaseRay(a:any, b?:any, c?:any, d?:any):Crease{
		var ray = gimme1Ray(a,b,c,d);
		if(ray === undefined) { return; }
		var edge = this.boundary.clipRay(ray);
		if(edge === undefined) { return; }
		var newCrease = this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
		// if(pointsSimilar(origin, newCrease.nodes[0])){ newCrease.newMadeBy.rayOrigin = <CreaseNode>newCrease.nodes[0]; }
		// if(pointsSimilar(origin, newCrease.nodes[1])){ newCrease.newMadeBy.rayOrigin = <CreaseNode>newCrease.nodes[1]; }
		return newCrease;
	}
	creaseEdge(a:any, b?:any, c?:any, d?:any):Crease{
		var e = gimme1Edge(a,b,c,d);
		if(e === undefined){ return; }
		var edge = this.boundary.clipEdge(e);
		if(edge === undefined){ return; }
		return this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
	}

	// creaseRayUntilMark
	creaseRayUntilIntersection(ray:Ray, target?:XY):Crease{
		var clips = ray.clipWithEdgesDetails(this.edges);
		if(clips.length > 0){
			// if target exists, and target is closer than shortest edge, return crease to target
			if(target !== undefined){
				var targetEdge = new Edge(ray.origin.x, ray.origin.y, target.x, target.y);
				if(clips[0].edge.length() > targetEdge.length()){ return this.crease(targetEdge); }
			}
			// return crease to edge
			return this.crease(clips[0].edge);
		}
		return undefined;
	}

	creaseLineRepeat(a:any, b?:any, c?:any, d?:any):Crease[]{
		var ray = gimme1Ray(a,b,c,d);
		return this.creaseRayRepeat(ray)
		           .concat(this.creaseRayRepeat( ray.flip() ));
	}

	creaseRayRepeat(ray:Ray, target?:XY):Crease[]{
		return new Polyline()
			.rayReflectRepeat(ray, this.edges, target)
			.edges()
			.map(function(edge:Edge){
				return this.crease(edge);
			},this)
			.filter(function(el){ return el != undefined; });
	}

	creasePolyline(polyline:Polyline):Crease[]{
		return polyline.edges()
			.map(function(edge:Edge){
				return this.crease(edge);
			},this)
			.filter(function(el){ return el != undefined; });
	}

	// AXIOM 1
	creaseThroughPoints(a:any, b?:any, c?:any, d?:any):Crease{
		var inputEdge = gimme1Edge(a,b,c,d);
		if(inputEdge === undefined){ return; }
		var edge = this.boundary.clipLine( inputEdge.infiniteLine() );
		if(edge === undefined){ return; }
		var newCrease = this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
		// newCrease.madeBy = new Fold(this.creaseThroughPoints, [new XY(a.x,a.y), new XY(b.x,b.y)]);
		return newCrease;
	}
	// AXIOM 2
	creasePointToPoint(a:any, b:any, c?:any, d?:any):Crease{
		var e = gimme1Edge(a,b,c,d);
		if(e === undefined){ return; }
		var edge = this.boundary.clipLine( e.perpendicularBisector() );
		if(edge === undefined){ return; }
		var newCrease = this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
		// newCrease.madeBy = new Fold(this.creasePointToPoint, [new XY(p[0].x,p[0].y), new XY(p[1].x,p[1].y)]);
		return newCrease
	}
	// AXIOM 3
	creaseEdgeToEdge(one:Crease, two:Crease):Crease[]{
		var a:Line = gimme1Edge(one).infiniteLine();
		var b:Line = gimme1Edge(two).infiniteLine();
		return a.bisect(b)
			.map(function(line:Line){ return this.boundary.clipLine( line ); },this)
			.filter(function(edge:Edge){ return edge !== undefined; },this)
			.map(function(edge:Edge){
				return this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
			},this);
	}
	// AXIOM 4
	creasePerpendicularThroughPoint(line:Crease, point:XY):Crease{
		var edge = this.boundary.clipLine( new Line(point, line.vector().rotate90()) );
		if(edge === undefined){ return; }
		var newCrease = this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
		// crease.madeBy = new Fold(this.creasePerpendicularThroughPoint, [new XY(line.nodes[0].x, line.nodes[0].y), new XY(line.nodes[1].x, line.nodes[1].y), new XY(point.x, point.y)]);
		return newCrease;
	}
	// AXIOM 5
	creasePointToLine(origin:XY, point:XY, line:Crease):Crease[]{
		var radius = Math.sqrt( Math.pow(origin.x-point.x,2) + Math.pow(origin.y-point.y,2) );
		var intersections = new Circle(origin.x, origin.y, radius).intersection(new Edge(line));
		// return (radius*radius) * dr_squared > (D*D)  // check if there are any intersections
		var creases = [];
		for(var i = 0; i < intersections.length; i++){
			creases.push( this.creasePointToPoint(point, intersections[i]) );
		}
		return creases;
	}
	// AXIOM 7
	creasePerpendicularPointOntoLine(point:XY, ontoLine:Crease, perp:Crease):Crease{
		var newLine = new Line(point, new XY(perp.nodes[1].x-perp.nodes[0].x, perp.nodes[1].y-perp.nodes[0].y));
		var intersection = newLine.intersection( ontoLine.infiniteLine() );
		if(intersection === undefined){ return; }
		var edge = this.boundary.clipLine( new Edge(point, intersection).perpendicularBisector() );
		if(edge === undefined){ return; }
		return this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
	}

	pleat(count:number, one:Crease, two:Crease):Crease[]{
		var a = new Edge(one.nodes[0].x, one.nodes[0].y, one.nodes[1].x, one.nodes[1].y);
		var b = new Edge(two.nodes[0].x, two.nodes[0].y, two.nodes[1].x, two.nodes[1].y);
		var u,v;
		if( a.parallel(b) ){
			u = a.nodes[0].subtract(a.nodes[1]);
			v = b.nodes[0].subtract(b.nodes[1]);
			return Array.apply(null, Array(count-1))
				.map(function(el,i){ return (i+1)/count; },this)
				.map(function(el){
					var origin = a.nodes[0].lerp(b.nodes[0], el);
					return this.boundary.clipLine( new Line(origin, u) ); 
				},this)
				.filter(function(el){ return el !== undefined; },this)
				.map(function(el){ return this.newCrease(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y) },this);
		} else if(a.nodes[0].equivalent(b.nodes[0]) || 
		          a.nodes[0].equivalent(b.nodes[1]) || 
		          a.nodes[1].equivalent(b.nodes[0]) || 
		          a.nodes[1].equivalent(b.nodes[1])){
			var c:XY, aUn:XY, bUn:XY;
			if( a.nodes[0].equivalent(b.nodes[0]) ){ c = a.nodes[0]; aUn = a.nodes[1]; bUn = b.nodes[1]; }
			if( a.nodes[0].equivalent(b.nodes[1]) ){ c = a.nodes[0]; aUn = a.nodes[1]; bUn = b.nodes[0]; }
			if( a.nodes[1].equivalent(b.nodes[0]) ){ c = a.nodes[1]; aUn = a.nodes[0]; bUn = b.nodes[1]; }
			if( a.nodes[1].equivalent(b.nodes[1]) ){ c = a.nodes[1]; aUn = a.nodes[0]; bUn = b.nodes[0]; }
			u = aUn.subtract(c);
			v = bUn.subtract(c);
			return Array.apply(null, Array(count-1))
				.map(function(el,i){ return (i+1)/count; },this)
				.map(function(el){
					var vector = u.angleLerp(v, el);
					return this.boundary.clipLine( new Line(c, vector) ); 
				},this)
				.filter(function(el){ return el !== undefined; },this)
				.map(function(el){ return this.newCrease(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y) },this);
		}else{
			var intersection:XY = a.infiniteLine().intersection( b.infiniteLine() );
			// var intersection:XY = intersectionLineLine(a.infiniteLine(), b.infiniteLine());
			// these two .equivalent() calls used EPSILON_LOW. do we need that?
			if(a.nodes[0].equivalent(intersection)){
			       u = a.nodes[1].subtract(intersection); }
			else { u = a.nodes[0].subtract(intersection); }
			if(b.nodes[0].equivalent(intersection)){
				   v = b.nodes[1].subtract(intersection); }
			else { v = b.nodes[0].subtract(intersection); }
			return Array.apply(null, Array(count-1))
				.map(function(el,i){ return (i+1)/count; },this)
				.map(function(el){
					var vector = u.angleLerp(v, el);
					return this.boundary.clipLine( new Line(intersection, vector) ); 
				},this)
				.filter(function(el){ return el !== undefined; },this)
				.map(function(el){ return this.newCrease(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y) },this);
		}
	}

	coolPleat(one:Crease, two:Crease, count:number):Crease[]{
		var a = new Edge(one.nodes[0].x, one.nodes[0].y, one.nodes[1].x, one.nodes[1].y);
		var b = new Edge(two.nodes[0].x, two.nodes[0].y, two.nodes[1].x, two.nodes[1].y);
		var u = a.nodes[0].subtract(a.nodes[1]);
		var v = b.nodes[0].subtract(b.nodes[1]);
		return Array.apply(null, Array(count-1))
			.map(function(el,i){ return (i+1)/count; },this)
			.map(function(el){
				var origin = a.nodes[0].lerp(b.nodes[0], el);
				var vector = u.lerp(v, el);
				return this.boundary.clipLine( new Line(origin, vector) ); 
			},this)
			.filter(function(el){ return el !== undefined; },this)
			.map(function(el){ return this.newCrease(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y) },this);
	}

	// returns an array of VoronoiMolecule[]
	creaseVoronoi(v:VoronoiGraph, interp?:number):any[]{
		if(interp === undefined){ interp = 0.5; }

		// original voronoi graph edges
		var edges = v.edges.filter(function(el){return !el.isBoundary; });
		// shrunk voronoi cell outlines
		var cells:[XY,XY][][] = <[XY,XY][][]>v.cells.map(function(cell){
			return cell.edges.map(function(edge){
				return edge.endPoints.map(function(el:XY){
					return cell.site.lerp(el,interp);
				});
			},this);
		},this);
		// junction molecules
		// var molecules:VoronoiMolecule[] = v.generateMolecules(interp);
		// find overlapped molecules
		var sortedMolecules = v.generateSortedMolecules(interp);
		sortedMolecules.forEach(function(arr){
			arr.forEach(function(m){
				var edges = m.generateCreases();
				edges.forEach(function(el){
					this.crease(el.nodes[0], el.nodes[1]);
				},this);
			}, this);
		}, this);

		edges.forEach(function(edge){
			var c = this.crease(edge.endPoints[0], edge.endPoints[1]);
			if(c !== undefined){ c.valley(); }
		},this);
		cells.forEach(function(cell:[XY,XY][]){ cell.forEach(function(edge){
			this.crease(edge[0], edge[1]).mountain();
		},this)},this);

		return sortedMolecules.reduce(function(prev, current){ return prev.concat(current); });
	}

	availableAxiomFolds():Edge[]{
		var edges = [];
		edges = edges.concat(this.availableAxiom1Folds());
		edges = edges.concat(this.availableAxiom2Folds());
		edges = edges.concat(this.availableAxiom3Folds());
		return edges;
	}
	// availableAxiom1Folds():Edge[]{
	availableAxiom1Folds():Crease[]{
		var edges = [];
		for(var n0 = 0; n0 < this.nodes.length-1; n0++){
			for(var n1 = n0+1; n1 < this.nodes.length; n1++){
				var inputEdge = new Edge(this.nodes[n0], this.nodes[n1]);
				var edge = this.boundary.clipLine( inputEdge.infiniteLine() );
				if(edge !== undefined){
					var e = new CPEdge(this, edge);
					e.madeBy = new Fold(this.creaseThroughPoints, [new XY(this.nodes[n0].x,this.nodes[n0].y), new XY(this.nodes[n1].x,this.nodes[n1].y)]);
					edges.push(e);
				}
			}
		}
		// this.cleanDuplicateNodes();
		return edges;
	}
	// availableAxiom2Folds():Edge[]{
	availableAxiom2Folds():Crease[]{
		var edges = [];
		for(var n0 = 0; n0 < this.nodes.length-1; n0++){
			for(var n1 = n0+1; n1 < this.nodes.length; n1++){
				var inputEdge = new Edge(this.nodes[n0], this.nodes[n1]);
				var edge = this.boundary.clipLine( inputEdge.perpendicularBisector() );
				if(edge !== undefined){
					var e = new CPEdge(this, edge);
					e.madeBy = new Fold(this.creasePointToPoint, [new XY(this.nodes[n0].x,this.nodes[n0].y), new XY(this.nodes[n1].x,this.nodes[n1].y)]);
					edges.push(edge);
				}
			}
		}
		// this.cleanDuplicateNodes();
		return edges;
	}
	// availableAxiom3Folds():Edge[]{
	availableAxiom3Folds():Crease[]{
		var edges = [];
		for(var e0 = 0; e0 < this.edges.length-1; e0++){
			for(var e1 = e0+1; e1 < this.edges.length; e1++){
				var a:Line = this.edges[e0].infiniteLine();
				var b:Line = this.edges[e1].infiniteLine();
				var pair = a.bisect(b).map(function(line:Line){
					return this.boundary.clipLine( line );
				},this).filter(function(el){ return el !== undefined; },this);
				var p = pair.map(function(edge){
					var e = new CPEdge(this, edge);
					e.madeBy = new Fold(this.creaseEdgeToEdge, [this.edges[e0].nodes[0].copy(), this.edges[e0].nodes[1].copy(), this.edges[e1].nodes[0].copy(), this.edges[e1].nodes[1].copy()]);
					return e					
				},this);
				edges = edges.concat(pair);
			}
		}
		// this.cleanDuplicateNodes();
		return edges;
	}


	////////////////////////////////////////////////////////////////
	///
	////////////////////////////////////////////////////////////////

	// TODO: this should export a FOLD file format as a .json
	fold(face?:PlanarFace):XY[][]{
		this.flatten();
		if(face == undefined){
			var bounds = this.bounds();
			face = this.nearest(bounds.size.width * 0.5, bounds.size.height*0.5).face;
		}
		if(face === undefined){ return; }
		var tree = face.adjacentFaceTree();
		var faces:{'face':PlanarFace, 'matrix':Matrix}[] = [];
		tree['matrix'] = new Matrix();
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
		return faces.map(function(el:{'face':PlanarFace, 'matrix':Matrix}){
			return el.face.nodes.map(function(node:CreaseNode){
				return node.copy().transform(el.matrix);
			});
		},this);
	}

	// precision is an epsilon value: 0.00001
	/*
	wiggle(precision):XY[]{
		if (precision === undefined){ precision = EPSILON; }

		var lengths = this.edges.forEach(function(crease, i){
			return crease.length();
		});
		// prevent too much deviation from length
		
		var dup = this.copy();

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
	wiggle(epsilon?:number):number{
		if(epsilon === undefined){ epsilon = 0.00001; }

		var lengths = this.edges.forEach(function(crease, i){
			return crease.length();
		});
		// prevent too much deviation from length

		var nodesAttempted:number = 0;
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
					var move = new XY( 0.05*radius * Math.cos(randomAngle), 
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

	flatFoldable():boolean{
		return this.nodes.map(function(el){return el.flatFoldable()})
		                 .reduce(function(prev,cur){return prev && cur;});
	}

	//////////////////////////////////////////////
	// GET PARTS
	bounds():Rect{ return this.boundary.minimumRect(); }

	bottomEdge():Crease{
		return this.edges
			.filter(function(el){return el.orientation === CreaseDirection.border})
			.sort(function(a,b){return (b.nodes[0].y+b.nodes[1].y)-(a.nodes[0].y+a.nodes[1].y);})
			.shift();
	}
	topEdge():Crease{
		return this.edges
			.filter(function(el){return el.orientation === CreaseDirection.border})
			.sort(function(a,b){ return (a.nodes[0].y+a.nodes[1].y)-(b.nodes[0].y+b.nodes[1].y);})
			.shift();
	}
	rightEdge():Crease{
		return this.edges
			.filter(function(el){return el.orientation === CreaseDirection.border})
			.sort(function(a,b){ return (b.nodes[0].x+b.nodes[1].x)-(a.nodes[0].x+a.nodes[1].x);})
			.shift();
	}
	leftEdge():Crease{
		return this.edges
			.filter(function(el){return el.orientation === CreaseDirection.border})
			.sort(function(a,b){return (a.nodes[0].x+a.nodes[1].x)-(b.nodes[0].x+b.nodes[1].x);})
			.shift();
	}

	//////////////////////////////////////////////
	// BOUNDARY
	contains(a:any):boolean{
		var p = gimme1XY(a);
		if(p === undefined){ return false; }
		return this.boundary.contains(p);
	}

	square(width?:number):CreasePattern{
		var w = 1.0;
		// todo: isReal() - check if is real number
		if(width != undefined && width != 0){ w = Math.abs(width); }
		return this.setBoundary([[0,0], [w,0], [w,w], [0,w]]);
	}

	rectangle(width:number, height:number):CreasePattern{
		if(width === undefined || height === undefined){ return this; }
		width = Math.abs(width);
		height = Math.abs(height);
		return this.setBoundary( [[0,0], [width,0], [width,height], [0,height]] );
	}
	hexagon(radius?:number):CreasePattern{
		if(radius === undefined){ radius = 0.5; }
		var sqt3_4 = 0.8660254;
		radius = Math.abs(radius);
		var points = [[radius*0.5,  radius*sqt3_4],
		              [radius,      0.0],
		              [radius*0.5,  -radius*sqt3_4],
		              [-radius*0.5, -radius*sqt3_4],
		              [-radius,     0.0],
		              [-radius*0.5, radius*sqt3_4] ];
		return this.setBoundary(points);
	}

	noBoundary():CreasePattern{
		// clear old data
		this.boundary.edges = [];
		this.edges = this.edges.filter(function(el){ return el.orientation !== CreaseDirection.border; });
		this.cleanAllUselessNodes();
		this.flatten();
		return this;
	}

	setBoundary(pointArray:any[], alreadyClockwiseSorted?:boolean):CreasePattern{
		var points = pointArray.map(function(p){ return gimme1XY(p); },this);
		// check if the first point is duplicated again at the end of the array
		if( points[0].equivalent(points[points.length-1]) ){ points.pop(); }
		// perform convex hull if points are not already sorted clockwise
		if(alreadyClockwiseSorted !== undefined && alreadyClockwiseSorted === true){
			this.boundary.edges = this.boundary.setEdgesFromPoints(points);
		} else{
			this.boundary.convexHull(points);
		}
		this.edges = this.edges.filter(function(el){ return el.orientation !== CreaseDirection.border; });
		this.cleanAllUselessNodes();
		this.boundary.edges.forEach(function(el){
			(<Crease>this.newPlanarEdge(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y)).border();
		},this);
		this.cleanDuplicateNodes();
		this.flatten();
		return this;
	}

	setMinRectBoundary():CreasePattern{
		this.edges = this.edges.filter(function(el){ return el.orientation !== CreaseDirection.border; });
		var xMin = Infinity;
		var xMax = 0;
		var yMin = Infinity;
		var yMax = 0;
		for(var i = 0; i < this.nodes.length; i++){ 
			if(this.nodes[i].x > xMax){ xMax = this.nodes[i].x; }
			if(this.nodes[i].x < xMin){ xMin = this.nodes[i].x; }
			if(this.nodes[i].y > yMax){ yMax = this.nodes[i].y; }
			if(this.nodes[i].y < yMin){ yMin = this.nodes[i].y; }
		}
		this.setBoundary( [new XY(xMin, yMin), new XY(xMax, yMin), new XY(xMax, yMax), new XY(xMin, yMax) ]);
		this.flatten();
		return this;
	}

	///////////////////////////////////////////////////////////////
	// CLEAN  /  REMOVE PARTS

	clear():CreasePattern{
		this.nodes = [];
		this.edges = [];
		this.faces = [];
		this.junctions = [];
		this.sectors = [];
		this.symmetryLine = undefined;
		if(this.boundary === undefined){ return this; }
		for(var i = 0; i < this.boundary.edges.length; i++){
			var nodes = this.boundary.edges[i].nodes;
			(<Crease>this.newPlanarEdge(nodes[0].x, nodes[0].y, nodes[1].x, nodes[1].y)).border();
		}
		this.cleanDuplicateNodes();
		this.flatten();
		return this;
	}

	///////////////////////////////////////////////////////////////
	// SYMMETRY
	
	noSymmetry():CreasePattern{ this.symmetryLine = undefined; return this; }
	bookSymmetry():CreasePattern{
		var center = this.boundary.center();
		this.symmetryLine = new Line(center, new XY(0, 1));
		return this;
	}
	diagonalSymmetry():CreasePattern{
		var center = this.boundary.center();
		this.symmetryLine = new Line(center, new XY(0.7071, 0.7071));
		return this;
	}
	setSymmetryLine(a:any, b?:any, c?:any, d?:any):CreasePattern{
		var edge = gimme1Edge(a,b,c,d);
		this.symmetryLine = new Line(edge.nodes[0], edge.nodes[1].subtract(edge.nodes[1]));
		return this;
	}

	///////////////////////////////////////////////////////////////
	// FILE FORMATS

	export(fileType):any{
		switch(fileType.toLowerCase()){
			case "fold": return this.exportFoldFile();
			case "svg": return this.exportSVG();
		}
	}

	exportFoldFile():object{
		this.flatten();
		this.nodeArrayDidChange();
		this.edgeArrayDidChange();

		var file = {};
		file["file_spec"] = 1;
		file["file_creator"] = "crease pattern Javascript library by Robby Kraft";
		file["file_author"] = "";
		file["file_classes"] = ["singleModel"];
		file["vertices_coords"] = this.nodes.map(function(node){ return [node.x,node.y]; },this);
		file["faces_vertices"] = this.faces.map(function(face){
			return face.nodes.map(function(node){ return node.index; },this);
		},this);
		file["edges_vertices"] = this.edges.map(function(edge){
			return edge.nodes.map(function(node){ return node.index; },this);
		},this);
		file["edges_assignment"] = this.edges.map(function(edge){
			switch(edge.orientation){
				case CreaseDirection.border: return "B";
				case CreaseDirection.mountain: return "M";
				case CreaseDirection.valley: return "V";
				case CreaseDirection.mark: return "F";
				default: return "U";
			}
		},this);
		return file;
	}

	importFoldFile(file:object, epsilon?:number):boolean{
		if(file === undefined || 
		   file["vertices_coords"] === undefined ||
		   file["edges_vertices"] === undefined){ return false; }

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

		this.clear();
		this.noBoundary();

		file["vertices_coords"].forEach(function(el){
			// if z value is found, it should alert the user
			// this library only supports 2D
			this.newPlanarNode( (el[0] || 0), (el[1] || 0));
		},this);
		this.nodeArrayDidChange();

		file["edges_vertices"]
			.map(function(el:[number, number]):[CreaseNode, CreaseNode]{
				return <[CreaseNode, CreaseNode]>el.map(function(index){ return this.nodes[index]; },this);
			},this)
			.filter(function(el){ return el[0] !== undefined && el[1] !== undefined; },this)
			.forEach(function(nodes){
				this.newPlanarEdgeBetweenNodes(nodes[0], nodes[1]);
			},this);
		this.edgeArrayDidChange();

		var assignmentDictionary = { "B": CreaseDirection.border, "M": CreaseDirection.mountain, "V": CreaseDirection.valley, "F": CreaseDirection.mark, "U": CreaseDirection.mark };
		file["edges_assignment"]
			.map(function(assignment){ return assignmentDictionary[assignment]; })
			.forEach(function(orientation, i){ this.edges[i].orientation = orientation; },this);

		// file["faces_vertices"]
		// 	.forEach(function(faceNodeArray){
		// 		var faceNodes = faceNodeArray.map(function(nodeIndex){
		// 			return this.nodes[nodeIndex];
		// 		},this);
		// 		return new CreaseFace(this).makeFromNodes(faceNodes);
		// 	},this)
		// 	.filter(function(el){ return el !== undefined; });

		var boundaryPoints = this.edges
			.filter(function(el){ return el.orientation === CreaseDirection.border; },this)
			.map(function(el){
				return [
					new XY(el.nodes[0].x, el.nodes[0].y), 
					new XY(el.nodes[1].x, el.nodes[1].y)
				]
			},this)
		this.setBoundary([].concat.apply([],boundaryPoints));
		this.clean(epsilon);
		return true;
	}

	strNum(num:number, decimalPlaces?:number){
		if(Math.floor(num) == num || decimalPlaces == undefined){ return num.toString(); }
		return parseFloat(num.toFixed(decimalPlaces)).toString();
	}

	exportSVG(size?:number):string{
		if(size === undefined || size <= 0){ size = 600; }
		var bounds = this.bounds();
		var width = bounds.size.width;
		var height = bounds.size.height;
		var scale = size / (width);
		var origins = [bounds.origin.x, bounds.origin.y];
		var widthScaled = this.strNum(width*scale);
		var heightScaled = this.strNum(height*scale);
		var dashW = this.strNum(width * scale * 0.0025 * 4);
		// var dashWOff = ((width)*scale * 0.0025 * 6 * 0.5).toFixed(1);
		var dashWOff = dashW;
		var strokeWidthNum = width * scale * 0.0025 * 2
		var strokeWidth = strokeWidthNum < 0.5 ? 0.5 : this.strNum(strokeWidthNum);
		if(strokeWidth == 0){ strokeWidth = 0.5; }

		var valleyStyle = "stroke=\"#4379FF\" stroke-linecap=\"round\" stroke-dasharray=\"" + dashW + "," + dashWOff + "\" ";
		var mountainStyle = "stroke=\"#EE1032\" ";
		var noStyle = "stroke=\"#000000\" ";

		var blob = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- generated by crease pattern Javascript library by Robby Kraft  -->\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"" +widthScaled+ "px\" height=\"" +heightScaled+ "px\" viewBox=\"0 0 " +widthScaled+ " " +heightScaled+ "\">\n";

		var orientationList = [CreaseDirection.mark, CreaseDirection.valley, CreaseDirection.mountain, CreaseDirection.border];
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
					.map(function(number){ return this.strNum(number, 12); },this);
				blob += "\t<line " + style + "stroke-width=\"" + strokeWidth + "\" x1=\"" +p[0]+ "\" y1=\"" +p[1]+ "\" x2=\"" +p[2]+ "\" y2=\"" +p[3]+ "\"/>\n";
			},this);
			blob += "</g>\n";
		},this);

		blob += "</svg>\n";
		return blob;
	}

	exportSVGMin(size:number):string{
		if(size === undefined || size <= 0){ size = 600; }
		var bounds = this.bounds();
		var width = bounds.size.width;
		var height = bounds.size.height;
		var padX = bounds.origin.x;
		var padY = bounds.origin.y;
		var scale = size / (width+padX*2);
		var strokeWidth = (width*scale * 0.0025).toFixed(1);
		if(strokeWidth === "0" || strokeWidth === "0.0"){ strokeWidth = "0.5"; }
		var polylines = this.polylines();
		var blob = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- generated by crease pattern Javascript library by Robby Kraft  -->\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"" +((width+padX*2)*scale)+ "px\" height=\"" +((height+padY*2)*scale)+ "px\" viewBox=\"0 0 " +((width+padX*2)*scale)+ " " +((height+padY*2)*scale)+ "\">\n<g>\n";

		for(var i = 0; i < polylines.length; i++){
			if(polylines[i].nodes.length >= 0){
				blob += "<polyline fill=\"none\" stroke-width=\"" + strokeWidth + "\" stroke=\"#000000\" points=\"";
				for(var j = 0; j < polylines[i].nodes.length; j++){
					var point = polylines[i].nodes[j];
					blob += (scale*point.x).toFixed(4) + "," + (scale*point.y).toFixed(4) + " ";
				}
				blob += "\"/>\n";
			}
		}
		blob = blob + "</g>\n</svg>\n";
		return blob;
	}

	kiteBase():CreasePattern{
		this.clear();
		(<Crease>this.newPlanarEdge(0.0, 0.0, 0.41421, 0.0)).border();
		(<Crease>this.newPlanarEdge(0.41421, 0.0, 1.0, 0.0)).border();
		(<Crease>this.newPlanarEdge(1.0, 0.0, 1.0, 0.58578)).border();
		(<Crease>this.newPlanarEdge(1.0, 0.58578, 1.0, 1.0)).border();
		(<Crease>this.newPlanarEdge(1.0, 1.0, 0.0, 1.0)).border();
		(<Crease>this.newPlanarEdge(0.0, 1.0, 0.0, 0.0)).border();
		(<Crease>this.newPlanarEdge(1, 0, 0, 1)).mountain();
		(<Crease>this.newPlanarEdge(0, 1, 1, 0.58578)).valley();
		(<Crease>this.newPlanarEdge(0, 1, 0.41421, 0)).valley();
		this.flatten();
		return this;
	}
	fishBase():CreasePattern{
		this.clear();
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
		this.flatten();
		return this;
	}
	birdBase():CreasePattern{
		this.clear();
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
		this.flatten();
		return this;
	}
	frogBase():CreasePattern{
		this.clear();
		[[0,0,.14646,.35353],[0,0,.35353,.14646],[.14646,.35353,0.5,0.5],[0.5,0.5,.35353,.14646],[.14646,.35353,.14646,0.5],[0,0.5,.14646,0.5],[0.5,0.5,0.5,.14646],[0.5,.14646,0.5,0],[0.5,0,.35353,.14646],[.35353,.14646,0.5,.14646],[.14646,.35353,0,0.5],[.14646,.35353,.25,.25],[.25,.25,.35353,.14646],[0,1,.35353,.85353],[0,1,.14646,.64646],[.35353,.85353,0.5,0.5],[0.5,0.5,.14646,.64646],[.35353,.85353,0.5,.85353],[0.5,1,0.5,.85353],[0.5,0.5,0.5,.85353],[0.5,0.5,.14646,0.5],[0,0.5,.14646,.64646],[.14646,.64646,.14646,0.5],[.35353,.85353,0.5,1],[.35353,.85353,.25,.75],[.25,.75,.14646,.64646],[1,0,.85353,.35353],[1,0,.64646,.14646],[.85353,.35353,0.5,0.5],[0.5,0.5,.64646,.14646],[.85353,.35353,.85353,0.5],[1,0.5,.85353,0.5],[0.5,0,.64646,.14646],[.64646,.14646,0.5,.14646],[.85353,.35353,1,0.5],[.85353,.35353,.75,.25],[.75,.25,.64646,.14646],[1,1,.64646,.85353],[1,1,.85353,.64646],[.64646,.85353,0.5,0.5],[0.5,0.5,.85353,.64646],[.64646,.85353,0.5,.85353],[0.5,0.5,.85353,0.5],[1,0.5,.85353,.64646],[.85353,.64646,.85353,0.5],[.64646,.85353,0.5,1],[.64646,.85353,.75,.75],[.75,.75,.85353,.64646],[.35353,.14646,.35353,0],[.64646,.14646,.64646,0],[.85353,.35353,1,.35353],[.85353,.64646,1,.64646],[.64646,.85353,.64646,1],[.35353,.85353,.35353,1],[.14646,.64646,0,.64646],[.14646,.35353,0,.35353],[0.5,0.5,.25,.25],[0.5,0.5,.75,.25],[0.5,0.5,.75,.75],[0.5,0.5,.25,.75],[.25,.75,0,1],[.25,.25,0,0],[.75,.25,1,0],[.75,.75,1,1]].forEach(function(el:[number,number,number,number]){
			this.newPlanarEdge(el[0], el[1], el[2], el[3]);
		},this);
		this.flatten();
		return this;
	}


	/** This will deep-copy the contents of this graph and return it as a new object
	 * @returns {CreasePattern} 
	 */
	copy():CreasePattern{
		this.nodeArrayDidChange();
		this.edgeArrayDidChange();
		this.faceArrayDidChange();
		var g = new CreasePattern();
		g.nodes = []; g.edges = []; g.faces = [];
		g.boundary = undefined;
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
				if(this.faces[i].angles !== undefined){
				for(var j=0;j<this.faces[i].angles.length;j++){
					f.angles.push(this.faces[i].angles[j]); 
				} }
			}
		}
		g.boundary = this.boundary.copy();
		return g;
	}
}


