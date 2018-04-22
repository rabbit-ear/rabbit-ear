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
	// AXIOM 1
	creaseLineThrough(point:XY):Crease{return this.graph.creaseThroughPoints(this, point);}
	// AXIOM 2
	creaseToPoint(point:XY):Crease{return this.graph.creasePointToPoint(this, point);}
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

	symmetryLine:Line = undefined;

	// this will 
	foldSequence:FoldSequence;

	// When subclassed (ie. PlanarGraph) types are overwritten
	nodeType = CreaseNode;
	edgeType = Crease;
	faceType = CreaseFace;

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
		// this is a private function expecting all boundary conditions satisfied
		// use this.crease() instead
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
		var e = gimme1Edge(a,b,c,d);
		if(e === undefined){ return; }
		var edge = this.boundary.clipEdge(e);
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

	creaseSymmetry(ax:number, ay:number, bx:number, by:number):Crease{
		if(this.symmetryLine === undefined){ return undefined; }
		var ra = new XY(ax, ay).reflect(this.symmetryLine.nodes[0], this.symmetryLine.nodes[1]);
		var rb = new XY(bx, by).reflect(this.symmetryLine.nodes[0], this.symmetryLine.nodes[1]);
		return <Crease>this.newPlanarEdge(ra.x, ra.y, rb.x, rb.y);
	}

	// AXIOM 1
	creaseThroughPoints(a:any, b?:any, c?:any, d?:any):Crease{
		var line = gimme1Line(a,b,c,d);
		if(line === undefined){ return; }
		var edge = this.boundary.clipLine(line);
		if(edge === undefined){ return; }
		var newCrease = this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
		newCrease.madeBy = new Fold(this.creaseThroughPoints, [new XY(a.x,a.y), new XY(b.x,b.y)]);
		return newCrease;
	}
	// AXIOM 2
	creasePointToPoint(a:any, b:any, c?:any, d?:any):Crease{
		var p = gimme2XY(a,b,c,d);
		if(p === undefined){ return; }
		var midpoint = new XY( (p[0].x+p[1].x)*0.5, (p[0].y+p[1].y)*0.5 );
		var v = new XY(p[1].x-p[0].x,p[1].y-p[0].y);
		var perp1 = v.rotate90();
		var edge = this.boundary.clipLine(new Line(midpoint, midpoint.add(perp1)));
		if(edge !== undefined){
			var newCrease = this.newCrease(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
			newCrease.madeBy = new Fold(this.creasePointToPoint, [new XY(p[0].x,p[0].y), new XY(p[1].x,p[1].y)]);
			return newCrease
		}
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

	pleat(one:Crease, two:Crease, count:number):Crease[]{
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
					var vector = u.angleLerp(v, el);
					return this.boundary.clipLine( new Line(origin, origin.add(vector)) ); 
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
					return this.boundary.clipLine( new Line(c, c.add(vector)) ); 
				},this)
				.filter(function(el){ return el !== undefined; },this)
				.map(function(el){ return this.newCrease(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y) },this);


		}else{
			var intersection:XY = intersectionLineLine(a, b);
			if(a.nodes[0].equivalent(intersection), EPSILON_LOW){
			       u = a.nodes[1].subtract(intersection); }
			else { u = a.nodes[0].subtract(intersection); }
			if(b.nodes[0].equivalent(intersection), EPSILON_LOW){
				   v = b.nodes[1].subtract(intersection); }
			else { v = b.nodes[0].subtract(intersection); }
			return Array.apply(null, Array(count-1))
				.map(function(el,i){ return (i+1)/count; },this)
				.map(function(el){
					var vector = u.angleLerp(v, el);
					return this.boundary.clipLine( new Line(intersection, intersection.add(vector)) ); 
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
				return this.boundary.clipLine( new Line(origin, origin.add(vector)) ); 
			},this)
			.filter(function(el){ return el !== undefined; },this)
			.map(function(el){ return this.newCrease(el.nodes[0].x, el.nodes[0].y, el.nodes[1].x, el.nodes[1].y) },this);
	}

	creaseVoronoi(v:VoronoiGraph, interp?:number):VoronoiMolecule[]{
		if(interp === undefined){ interp = 0.5; }

		// original voronoi graph edges
		var edges = v.edges.filter(function(el){return !el.isBoundary; });
		// shrunk voronoi cell outlines
		var cells:[XY,XY][][] = <[XY,XY][][]>v.cells.map(function(cell:VoronoiCell){
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
	contains(p:XY):boolean{ return this.boundary.contains(p); }


	square(width?:number):CreasePattern{
		var w = 1.0;
		// todo: isReal() - check if is real number
		if(width != undefined && width != 0){ w = Math.abs(width); }
		return this.setBoundary([new XY(0,0), new XY(w,0), new XY(w,w), new XY(0,w)]);
	}

	rectangle(width:number, height:number):CreasePattern{
		if(width === undefined || height === undefined){ return this; }
		width = Math.abs(width);
		height = Math.abs(height);
		var points = [new XY(0,0), 
		              new XY(width,0), 
		              new XY(width,height), 
		              new XY(0,height)];
		return this.setBoundary(points);
	}

	noBoundary():CreasePattern{
		// clear old data
		this.boundary.edges = [];
		this.edges = this.edges.filter(function(el){ return el.orientation !== CreaseDirection.border; });
		this.cleanAllUselessNodes();
		return this;
	}

	setBoundary(points:XY[], alreadyClockwiseSorted?:boolean):CreasePattern{
		if( points[0].equivalent(points[points.length-1]) ){ points.pop(); }
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

	///////////////////////////////////////////////////////////////
	// SYMMETRY
	
	noSymmetry():CreasePattern{ this.symmetryLine = undefined; return this; }
	bookSymmetry():CreasePattern{
		var center = this.boundary.center();
		return this.setSymmetryLine(center, center.add(new XY(0, 1)));
	}
	diagonalSymmetry():CreasePattern{
		var center = this.boundary.center();
		return this.setSymmetryLine(center, center.add(new XY(1, 1)));
	}
	setSymmetryLine(a:any, b?:any, c?:any, d?:any):CreasePattern{
		this.symmetryLine = gimme1Line(a,b,c,d);
		return this;
	}

	///////////////////////////////////////////////////////////////
	// FILE FORMATS

	exportFoldFile():object{
		this.generateFaces();
		this.nodeArrayDidChange();
		this.edgeArrayDidChange();

		var file = {};
		file["file_spec"] = 1;
		file["file_creator"] = "creasepattern.js by Robby Kraft";
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

	importFoldFile(file:object):boolean{
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
				return [el.nodes[0].xy(), el.nodes[1].xy()]
			},this)
		this.setBoundary([].concat.apply([],boundaryPoints));

		this.clean();
		return true;
	}

	exportSVG(size:number):string{
		if(size === undefined || size <= 0){ size = 600; }
		var bounds = this.bounds();
		var width = bounds.size.width;
		var height = bounds.size.height;
		var orgX = bounds.topLeft.x;
		var orgY = bounds.topLeft.y;
		var scale = size / (width);
		console.log(bounds, width, orgX, scale);
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

	exportSVGMin(size:number):string{
		if(size === undefined || size <= 0){ size = 600; }
		var bounds = this.bounds();
		var width = bounds.size.width;
		var height = bounds.size.height;
		var padX = bounds.topLeft.x;
		var padY = bounds.topLeft.y;
		var scale = size / (width+padX*2);
		var strokeWidth = (width*scale * 0.0025).toFixed(1);
		if(strokeWidth === "0" || strokeWidth === "0.0"){ strokeWidth = "0.5"; }
		var polylines = this.fewestPolylines();
		var blob = "";
		blob = blob + "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"" +((width+padX*2)*scale)+ "px\" height=\"" +((height+padY*2)*scale)+ "px\" viewBox=\"0 0 " +((width+padX*2)*scale)+ " " +((height+padY*2)*scale)+ "\">\n<g>\n";

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

interface Array<T> {
	mountain():Crease[];
	valley():Crease[];
}
Array.prototype.mountain = function():Crease[] {
	if(this.length <= 1){ return ; }
	for(var i = 0; i < this.length; i++){
		if( this[i] instanceof Crease){
			this[i].mountain();
		}
	}
	return this;
}
Array.prototype.valley = function():Crease[] {
	if(this.length <= 1){ return ; }
	for(var i = 0; i < this.length; i++){
		if( this[i] instanceof Crease){
			this[i].valley();
		}
	}
	return this;
}

