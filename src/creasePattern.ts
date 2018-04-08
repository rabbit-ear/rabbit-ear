// creasePattern.js
// for the purposes of performing origami operations on a planar graph
// mit open source license, robby kraft

/// <reference path="planarGraph.ts"/>

"use strict";

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
		var angle0 = this.edges[0].absoluteAngle(this.origin);
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
		return this.kawasaki() && this.maekawa();
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
	kawasaki():boolean{
		var alternating = this.alternateAngleSum();
		return epsilonEqual(alternating[0],alternating[1]);
	}
	// 0.0 is equivalent to 100% valid
	// pi is equivalent to 100% wrong
	kawasakiRating():number{
		var alternating = this.alternateAngleSum();
		return Math.abs(alternating[0] - alternating[1]);
	}
	kawasakiSolution():[{'difference':number,'sectors':CreaseSector[]},
	                    {'difference':number,'sectors':CreaseSector[]}]{
		var alternating = this.alternateAngleSum().map(function(el){
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
		var angle0 = sector.edges[0].absoluteAngle(sector.origin);
		// var angle1 = sector.edges[1].absoluteAngle(sector.origin);
		var newA = angle0 - dEven;
		return new XY(Math.cos(newA), Math.sin(newA));
	}
}

class CreaseNode extends PlanarNode{
	graph:CreasePattern;

	junctionType = CreaseJunction;
	sectorType = CreaseSector;

	isBoundary():boolean{
		for(var i = 0; i < this.graph.boundary.edges.length; i++){
			var thisPt = new XY(this.x, this.y);
			if(this.graph.boundary.edges[i].collinear(thisPt)){ return true; }
			// if(onSegment(thisPt, this.graph.boundary.edges[i])){ return true; }
		}
		return false;
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

	noCrossing():Crease{
		// find this edge's first intersection
		// remove this edge
		// replace it with an edge that doesn't intersect other edges
		var o = this.newMadeBy.rayOrigin;
		if(o === undefined){ o = <CreaseNode>this.nodes[0]; }
		var angle = this.absoluteAngle(o);
		var rayDirection = new XY(Math.cos(angle), Math.sin(angle));
		var intersection = undefined;
		var shortest = Infinity;
		for(var i = 0; i < this.graph.edges.length; i++){
			// var inter = rayLineSegmentIntersection(o, rayDirection, this.graph.edges[i].nodes[0], this.graph.edges[i].nodes[1]);
			var inter = intersectionRayEdge(new Ray(o, rayDirection), this.graph.edges[i]);
			if(inter !== undefined && !o.equivalent(inter)){
				var d = Math.sqrt( Math.pow(o.x-inter.x,2) + Math.pow(o.y-inter.y,2) );
				if(d < shortest){
					shortest = d;
					intersection = inter;
				}
			}
		}
		if(intersection !== undefined){
			var edge = this.graph.newCrease(o.x, o.y, intersection.x, intersection.y);
			this.graph.removeEdge(this);
			return edge;
		}
	}

	// AXIOM 3
	creaseToEdge(edge:Crease):Crease[]{
		return this.graph.creaseEdgeToEdge(this, edge);
	}
}

// class RabbitEar{
// 	face:CreaseFace;
// 	edges:Crease[];

// }

class CreaseFace extends PlanarFace{

	// rabbitEar():RabbitEar{
	rabbitEar():Crease[]{
		if(this.sectors.length !== 3){ return []; }
		var rays:Ray[] = this.sectors.map(function(el){
			// return { node: el.origin, vector: el.bisect() };
			return new Ray(el.origin, el.bisect());
		});
		// calculate intersection of each pairs of rays
		var incenter = rays
			.map(function(el,i){
				var nextEl = rays[(i+1)%rays.length];
				return intersectionRayRay(el, nextEl);
			})
			// average each point (sum, then divide by total)
			.reduce(function(prev, current){ return prev.add(current);})
			.scale(1.0/rays.length);
		return this.nodes.map(function(el){
			return (<CreasePattern>this.graph).crease(el, incenter)
		}, this);
	}
}

class CreasePattern extends PlanarGraph{

	nodes:CreaseNode[];
	edges:Crease[];
	// for now our crease patterns outlines are limited to convex shapes,
	//   this can be easily switched out if all member functions are implemented
	//   for a concave polygon class
	boundary:ConvexPolygon;

	symmetryLine:[XY, XY] = undefined;

	// this will 
	foldSequence:FoldSequence;

	// When subclassed (ie. PlanarGraph) types are overwritten
	nodeType = CreaseNode;
	edgeType = Crease;
	faceType = CreaseFace;

	landmarkNodes():XY[]{return this.nodes.map(function(el){return new XY(el.x, el.y);});}

	didChange:(event:object)=>void;

	constructor(){
		super();
		if(this.boundary === undefined){ this.boundary = new ConvexPolygon(); }
		this.square();
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

	
	///////////////////////////////////////////////////////////////
	// ADD PARTS

	fold(param1, param2, param3, param4){
		// detects parameters, make deductions
	}

	foldInHalf():Crease{
		var crease:Crease;
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

		if(epsilonEqual(bounds.size.width, bounds.size.height)){
				this.clean();
			var edgeCount = this.edges.length;
			var edgeMidpoints = this.edges.map(function(el){return el.midpoint();});
			var arrayOfPointsAndMidpoints = this.nodes.map(function(el){return new XY(el.x, el.y);}).concat(edgeMidpoints);
			// console.log(arrayOfPointsAndMidpoints);
			var centroid = new XY(bounds.topLeft.x + bounds.size.width*0.5,
			                      bounds.topLeft.y + bounds.size.height*0.5);
			var i = 0;
			do{
				// console.log("new round");
				// console.log(this.edges.length);
				crease = this.creaseThroughPoints(arrayOfPointsAndMidpoints[i], centroid);
				// console.log(this.edges.length);
				this.clean();
				i++;
			}while( edgeCount === this.edges.length && i < arrayOfPointsAndMidpoints.length );
			if(edgeCount !== this.edges.length) return crease;
		}
		return;
	}

	newCrease(a_x:number, a_y:number, b_x:number, b_y:number):Crease{
		// use this.crease() instead
		// this is a private function and expects all boundary intersection conditions satisfied
		this.creaseSymmetry(a_x, a_y, b_x, b_y);
		var newCrease = <Crease>this.newPlanarEdge(a_x, a_y, b_x, b_y);
		if(this.didChange !== undefined){ this.didChange(undefined); }
		return newCrease;
	}

	/** Create a crease that is a line segment, and will crop if it extends beyond boundary
	 * @arg 4 numbers, 2 XY points, or 1 Edge
	 * @returns {Crease} pointer to the Crease
	 */
	crease(a:any, b?:any, c?:any, d?:any):Crease{
		var edge;
		// input is 1 edge, 2 XY, or 4 numbers
		if(a instanceof Edge || a instanceof Crease){ edge = this.boundary.clipEdge(a); }
		else if(isValidPoint(a) && isValidPoint(b)){ edge = this.boundary.clipEdge(new Edge(a,b)); }
		else if(isValidNumber(a)&&isValidNumber(b)&&isValidNumber(c)&&isValidNumber(d)){
			edge = this.boundary.clipEdge(new Edge(a,b,c,d));
		}
		if(edge === undefined){ return; }
		return this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
	}

	creaseRay(a:any, b?:any, c?:any, d?:any):Crease{
		var ray;
		if(a instanceof Ray){ ray = a; }
		else if(isValidPoint(a) && isValidPoint(b)){ ray = new Ray(a, b); }
		else if(isValidNumber(a)&&isValidNumber(b)&&isValidNumber(c)&&isValidNumber(d)){
			ray = new Ray(new XY(a,b), new XY(c,d));
		}
		var edge = this.boundary.clipRay(ray);
		if(edge === undefined) { return; }
		var newCrease = this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
		// if(pointsSimilar(origin, newCrease.nodes[0])){ newCrease.newMadeBy.rayOrigin = <CreaseNode>newCrease.nodes[0]; }
		// if(pointsSimilar(origin, newCrease.nodes[1])){ newCrease.newMadeBy.rayOrigin = <CreaseNode>newCrease.nodes[1]; }
		return newCrease;
	}

	// creaseRayUntilMark
	creaseRayUntilIntersection(ray:Ray, target?:XY):Crease{
		var clips = ray.clipWithEdgesWithIntersections(this.edges);
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

	creaseRayRepeat(ray:Ray, target?:XY):Crease[]{
		return new Polyline()
			.rayReflectRepeat(ray, this.edges, target)
			.edges()
			.map(function(edge:Edge){
				return this.crease(edge);
			},this)
			.filter(function(el){ return el != undefined; });
	}

	creaseSymmetry(ax:number, ay:number, bx:number, by:number):Crease{
		if(this.symmetryLine === undefined){ return undefined; }
		var ra = new XY(ax, ay).reflect(this.symmetryLine[0], this.symmetryLine[1]);
		var rb = new XY(bx, by).reflect(this.symmetryLine[0], this.symmetryLine[1]);
		return <Crease>this.newPlanarEdge(ra.x, ra.y, rb.x, rb.y);
	}

	// AXIOM 1
	creaseThroughPoints(a:XY, b:XY):Crease{
		var edge = this.boundary.clipLine(new Line(a.x, a.y, b.x, b.y));
		if(edge === undefined){ return; }
		var newCrease = this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
		newCrease.madeBy = new Fold(this.creaseThroughPoints, [new XY(a.x,a.y), new XY(b.x,b.y)]);
		return newCrease;
	}
	// AXIOM 2
	creasePointToPoint(a:XY, b:XY):Crease{
		var midpoint = new XY( (a.x+b.x)*0.5, (a.y+b.y)*0.5 );
		var ab = new XY(b.x-a.x,b.y-a.y);
		var perp1 = ab.rotate90();
		var edge = this.boundary.clipLine(new Line(midpoint, midpoint.add(perp1)));
		if(edge !== undefined){
			var newCrease = this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
			newCrease.madeBy = new Fold(this.creasePointToPoint, [new XY(a.x,a.y), new XY(b.x,b.y)]);
			return newCrease
		}
		return;
	}
	// AXIOM 3
	creaseEdgeToEdge(one:Crease, two:Crease):Crease[]{
		var a = new Edge(one.nodes[0].x, one.nodes[0].y, one.nodes[1].x, one.nodes[1].y);
		var b = new Edge(two.nodes[0].x, two.nodes[0].y, two.nodes[1].x, two.nodes[1].y);
		if( a.parallel(b) ){
			var u = a.nodes[0].subtract(a.nodes[1]);
			var midpoint = a.nodes[0].midpoint(b.nodes[1]);
			var clip = this.boundary.clipLine( new Line(midpoint, midpoint.add(u)) );
			return [ this.newCrease(clip.nodes[0].x, clip.nodes[0].y, clip.nodes[1].x, clip.nodes[1].y) ];
		} else{
			var intersection:XY = intersectionLineLine(a, b);
			var u = a.nodes[1].subtract(a.nodes[0]);
			var v = b.nodes[1].subtract(b.nodes[0]);
			var vectors = bisect(u,v);
			vectors[1] = vectors[0].rotate90();
			return vectors
				.map(function(el){ return this.boundary.clipLine(new Line(intersection,el.add(intersection)));},this)
				.filter(function(el){ return el !== undefined; })
				.map(function(el){
					return this.newCrease(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y);
				}, this)
				.sort(function(a,b){
					return Math.abs(u.cross(vectors[0])) - Math.abs(u.cross(vectors[1]))
				});
		}
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
		var intersection = intersectionLineLine(new Line(point, pointParallel), ontoLine);
		if(intersection != undefined){
			var midPoint = new XY((intersection.x + point.x)*0.5, (intersection.y + point.y)*0.5);
			var perp = new XY(-align.y, align.x);
			var midPoint2 = new XY(midPoint.x + perp.x, midPoint.y + perp.y);
			return this.creaseThroughPoints(midPoint, midPoint2);
		}
		throw "axiom 7: two crease lines cannot be parallel"
	}

	creaseVoronoi(v:VoronoiGraph, interp?:number):VoronoiMolecule[]{
		if(interp === undefined){ interp = 0.5; }

		// original voronoi graph edges
		var edges = v.edges.filter(function(el){return !el.isBoundary; });
		// shrunk voronoi cell outlines
		var cells:[XY,XY][][] = v.cells.map(function(cell:VoronoiCell){
			return cell.edges.map(function(edge:VoronoiEdge){
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

		edges.forEach(function(edge:VoronoiEdge){
			var c = this.crease(edge.endPoints[0], edge.endPoints[1]);
			if(c !== undefined){ c.valley(); }
		},this);
		cells.forEach(function(cell:[XY,XY][]){ cell.forEach(function(edge){
			this.crease(edge[0], edge[1]).mountain();
		},this)},this);

		return sortedMolecules.reduce(function(prev, current){ return prev.concat(current); });
	}

	possibleFolds():CreasePattern{
		var next = this.copy();
		next.nodes = [];
		next.edges = [];
		next.faces = [];
		console.time("edge2edge");
		for(var i = 0; i < this.edges.length-1; i++){
			for(var j = i+1; j < this.edges.length; j++){
				next.creaseEdgeToEdge(this.edges[i], this.edges[j]);
			}
		}
		console.timeEnd("edge2edge");
		console.time("creasepoints");
		for(var i = 0; i < this.nodes.length-1; i++){
			for(var j = i+1; j < this.nodes.length; j++){
				next.creaseThroughPoints(this.nodes[i], this.nodes[j]);
				next.creasePointToPoint(this.nodes[i], this.nodes[j]);
			}
		}
		console.timeEnd("creasepoints");
		next.cleanDuplicateNodes();
		return next;
	}

	possibleFolds1():CreasePattern{
		var next = this.copy();
		next.nodes = [];
		next.edges = [];
		next.faces = [];
		for(var i = 0; i < this.nodes.length-1; i++){
			for(var j = i+1; j < this.nodes.length; j++){
				next.creaseThroughPoints(this.nodes[i], this.nodes[j]);
			}
		}
		// next.cleanDuplicateNodes();
		return next;
	}

	possibleFolds2():CreasePattern{
		var next = this.copy();
		next.nodes = [];
		next.edges = [];
		next.faces = [];
		for(var i = 0; i < this.nodes.length-1; i++){
			for(var j = i+1; j < this.nodes.length; j++){
				next.creasePointToPoint(this.nodes[i], this.nodes[j]);
			}
		}
		// next.cleanDuplicateNodes();
		return next;
	}

	possibleFolds3(edges?:Crease[]):CreasePattern{
		var next = this.copy();
		next.nodes = [];
		next.edges = [];
		next.faces = [];
		if(edges === undefined){ edges = this.edges; }
		for(var i = 0; i < edges.length-1; i++){
			for(var j = i+1; j < edges.length; j++){
				next.creaseEdgeToEdge(edges[i], edges[j]);
			}
		}
		// next.cleanDuplicateNodes();
		return next;
	}

	// precision is an epsilon value: 0.00001
/*	wiggle(precision):XY[]{
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
	wiggle():number{

		var lengths = this.edges.forEach(function(crease, i){
			return crease.length();
		});
		// prevent too much deviation from length

		var nodesAttempted:number = 0;
		// var dup = this.copy();
		// var shuffleNodes = shuffle(this.nodes);
		for(var i = 0; i < this.nodes.length; i++){
			var rating = this.nodes[i].kawasakiRating();
			if(rating > EPSILON){
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
	// BOUNDARY

	bounds():Rect{
		// return this.boundary.bounds();
		var boundaryNodes = this.boundary.edges.map(function(el){return el.nodes[0];});
		if(boundaryNodes === undefined || boundaryNodes.length === 0){ return undefined; }
		var minX = Infinity;
		var maxX = -Infinity;
		var minY = Infinity;
		var maxY = -Infinity;
		boundaryNodes.forEach(function(el){
			if(el.x > maxX){ maxX = el.x; }
			if(el.x < minX){ minX = el.x; }
			if(el.y > maxY){ maxY = el.y; }
			if(el.y < minY){ minY = el.y; }
		});
		return new Rect(minX, minY, maxX-minX, maxY-minY);
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
		// if(this.boundary === undefined){ this.boundary = new PlanarGraph(); }
		// else                           { this.boundary.clear(); }
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
		this.boundary = new ConvexPolygon();
		return this;
	}

	setBoundary(points:XY[], alreadyClockwiseSorted?:boolean):CreasePattern{
		if( points[0].equivalent(points[points.length-1]) ){ points.pop(); }
		if(alreadyClockwiseSorted !== undefined && alreadyClockwiseSorted === true){
			this.boundary.edges = this.boundary.edgesFromPoints(points);
		} else{
			this.boundary.convexHull(points);
		}
		this.edges = this.edges.filter(function(el){ return el.orientation !== CreaseDirection.border; });
		// todo: if an edge gets removed, it will leave behind its nodes. we might need the following:
		this.cleanAllUselessNodes();
		this.boundary.edges.forEach(function(el){
			(<Crease>this.newPlanarEdge(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y)).border();
		},this);
		this.cleanDuplicateNodes();
		return this;
	}

	setMinRectBoundary():CreasePattern{
		this.edges = this.edges.filter(function(el){ return el.orientation !== CreaseDirection.border; });
		var xMin = Infinity;
		var xMax = 0;
		var yMin = Infinity;
		var yMax = 0;
		for(var i = 0; i < this.nodes.length; i++){ 
			if(this.nodes[i].x > xMax) xMax = this.nodes[i].x;
			if(this.nodes[i].x < xMin) xMin = this.nodes[i].x;
			if(this.nodes[i].y > yMax) yMax = this.nodes[i].y;
			if(this.nodes[i].y < yMin) yMin = this.nodes[i].y;
		}
		this.setBoundary( [new XY(xMin, yMin), new XY(xMax, yMin), new XY(xMax, yMax), new XY(xMin, yMax) ]);
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


/*

	findFlatFoldable(angle:PlanarSector):number{
		var junction = angle.node.junction();
		// todo: allow searches for other number edges
		if(junction.edges.length != 3){ return; }
		// find this interior angle among the other interior angles
		var foundIndex = undefined;
		for(var i = 0; i < junction.sectors.length; i++){
			if(angle.equivalent(junction.sectors[i])){ foundIndex = i; }
		}
		if(foundIndex === undefined){ return undefined; }
		var sumEven = 0;
		var sumOdd = 0;
		for(var i = 0; i < junction.sectors.length-1; i++){
			var index = (i+foundIndex+1) % junction.sectors.length;
			if(i % 2 == 0){ sumEven += junction.sectors[index].angle(); } 
			else { sumOdd += junction.sectors[index].angle(); }
		}
		var dEven = Math.PI - sumEven;
		var dOdd = Math.PI - sumOdd;
		var angle0 = angle.edges[0].absoluteAngle(angle.node);
		var angle1 = angle.edges[1].absoluteAngle(angle.node);
		// this following if isn't where the problem lies, it is on both cases, the problem is in the data incoming, first 2 lines, it's not sorted, or whatever.
		// console.log(clockwiseInteriorAngleRadians(angle0, angle1) + " " + clockwiseInteriorAngleRadians(angle1, angle0));
		// if(clockwiseInteriorAngleRadians(angle0, angle1) < clockwiseInteriorAngleRadians(angle1, angle0)){
			// return angle1 - dOdd;
			// return angle1 - dEven;
		// } else{
			// return angle0 - dOdd;
		// }

		// return angle0 + dEven;
		return angle0 - dEven;
	}
*/
	




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

	// contains(a:any, b:any):boolean{
	// 	var point;
	// 	if(isValidPoint(a)){ point = new XY(a.x, a.y); }
	// 	else if(isValidNumber(a) && isValidNumber(b)){ point = new XY(a,b);}
	// 	if(this.boundary.faces.length > 0){
	// 		return this.boundary.faces[0].contains(point);
	// 	}
	// }

/*
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

*/

	// cleanIntersections(){
	// 	this.clean();
	// 	var intersections = super.fragment();
	// 	this.interestingPoints = this.interestingPoints.concat(intersections);
	// 	return intersections;
	// }


	joinedPaths():XY[][]{
		var cp = this.copy();
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

	svgMin(size:number):string{
		if(size === undefined || size <= 0){ size = 600; }
		var bounds = this.bounds();
		var width = bounds.size.width;
		var height = bounds.size.height;
		var padX = bounds.topLeft.x;
		var padY = bounds.topLeft.y;
		var scale = size / (width+padX*2);
		var strokeWidth = (width*scale * 0.0025).toFixed(1);
		if(strokeWidth === "0" || strokeWidth === "0.0"){ strokeWidth = "0.5"; }

		var paths = this.joinedPaths();

		var blob = "";
		blob = blob + "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"" +((width+padX*2)*scale)+ "px\" height=\"" +((height+padY*2)*scale)+ "px\" viewBox=\"0 0 " +((width+padX*2)*scale)+ " " +((height+padY*2)*scale)+ "\">\n<g>\n";

		for(var i = 0; i < paths.length; i++){
			if(paths[i].length >= 0){
				blob += "<polyline fill=\"none\" stroke-width=\"" + strokeWidth + "\" stroke=\"#000000\" points=\"";
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

	svg(size:number):string{
		if(size === undefined || size <= 0){
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
		var widthScaled = ((width)*scale).toFixed(2);
		var heightScaled = ((height)*scale).toFixed(2);
		var strokeWidth = ((width)*scale * 0.0025).toFixed(1);
		var dashW = ((width)*scale * 0.0025 * 3).toFixed(1);
		var dashWOff = ((width)*scale * 0.0025 * 3 * 0.5).toFixed(1);
		if(strokeWidth === "0" || strokeWidth === "0.0"){ strokeWidth = "0.5"; }
		blob = blob + "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"" +widthScaled+ "px\" height=\"" +heightScaled+ "px\" viewBox=\"0 0 " +widthScaled+ " " +heightScaled+ "\">\n<g>\n";

		//////// RECT BORDER
		blob += "<line stroke=\"#000000\" stroke-width=\"" + strokeWidth + "\" x1=\"0\" y1=\"0\" x2=\"" +widthScaled+ "\" y2=\"0\"/>\n" + "<line fill=\"none\" stroke-width=\"" + strokeWidth + "\" stroke=\"#000000\" stroke-miterlimit=\"10\" x1=\"" +widthScaled+ "\" y1=\"0\" x2=\"" +widthScaled+ "\" y2=\"" +heightScaled+ "\"/>\n" + "<line fill=\"none\" stroke-width=\"" + strokeWidth + "\" stroke=\"#000000\" stroke-miterlimit=\"10\" x1=\"" +widthScaled+ "\" y1=\"" +heightScaled+ "\" x2=\"0\" y2=\"" +heightScaled+ "\"/>\n" + "<line fill=\"none\" stroke-width=\"" + strokeWidth + "\" stroke=\"#000000\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"" +heightScaled+ "\" x2=\"0\" y2=\"0\"/>\n";
		////////
		var valleyStyle = "stroke=\"#4379FF\" stroke-dasharray=\"" + dashW + "," + dashWOff + "\" ";
		var mountainStyle = "stroke=\"#EE1032\" ";
		var noStyle = "stroke=\"#000000\" ";

		for(var i = 0; i < this.edges.length; i++){
			var a = <CreaseNode>this.edges[i].nodes[0];
			var b = <CreaseNode>this.edges[i].nodes[1];
			var x1 = ((a.x-orgX) * scale).toFixed(4);
			var y1 = ((a.y-orgY) * scale).toFixed(4);
			var x2 = ((b.x-orgX) * scale).toFixed(4);
			var y2 = ((b.y-orgY) * scale).toFixed(4);
			var thisStyle = noStyle;
			if(this.edges[i].orientation === CreaseDirection.mountain){ thisStyle = mountainStyle; }
			if(this.edges[i].orientation === CreaseDirection.valley){ thisStyle = valleyStyle; }
			blob += "<line " + thisStyle + "stroke-width=\"" + strokeWidth + "\" x1=\"" +x1+ "\" y1=\"" +y1+ "\" x2=\"" +x2+ "\" y2=\"" +y2+ "\"/>\n";
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
		this.clean();
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
		this.clean();
		this.generateFaces();
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
		// this.generateFaces();
		return this;
	}


}

