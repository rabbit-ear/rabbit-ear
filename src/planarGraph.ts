// planarGraph.js
// a planar graph data structure containing edges and vertices in 2D space
// MIT open source license, Robby Kraft

/// <reference path="graph.ts" />
/// <reference path="geometry.ts" />

import * as M from './geometry'
import { GraphClean, GraphNode, GraphEdge, Graph } from './graph'

"use strict";

//////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
interface rbushObject{
	load(data:object[]);
	insert(data:object):object;
	search(data:object):object[];
} declare function rbush():rbushObject;
//////////////////////////////////////////////////////////////////////////
// PLANAR GRAPH

export class PlanarClean extends GraphClean{
	edges:{total:number, duplicate:number, circular:number};
	nodes:{
		total:number;
		fragment:M.XY[];  // nodes added at intersection of 2 lines, from fragment()
		collinear:M.XY[]; // nodes removed due to being collinear
		duplicate:M.XY[]; // nodes removed due to occupying the same space
		isolated:number;  // nodes removed for being unattached to any edge
	}
	constructor(numNodes?:number, numEdges?:number){
		super();
		this.edges = {total:0,duplicate:0, circular:0};
		this.nodes = {
			total:0,
			isolated:0,
			fragment:[],
			collinear:[],
			duplicate:[]
		}
		if(numNodes !== undefined){ this.nodes.total += numNodes; }
		if(numEdges !== undefined){ this.edges.total += numEdges; }
	}
	fragmentedNodes(nodes:M.XY[]):PlanarClean{
		this.nodes.fragment = nodes; this.nodes.total += nodes.length; return this;
	}
	collinearNodes(nodes:M.XY[]):PlanarClean{
		this.nodes.collinear = nodes; this.nodes.total += nodes.length; return this;
	}
	duplicateNodes(nodes:M.XY[]):PlanarClean{
		this.nodes.duplicate = nodes; this.nodes.total += nodes.length; return this;
	}
	join(report:GraphClean):PlanarClean{
		this.nodes.total += report.nodes.total;
		this.edges.total += report.edges.total;
		this.nodes.isolated += report.nodes.isolated;
		this.edges.duplicate += report.edges.duplicate;
		this.edges.circular += report.edges.circular;
		// if we are merging 2 planar clean reports, type cast this variable and check properties
		var planarReport = <PlanarClean>report;
		if(planarReport.nodes.fragment !== undefined){ 
			this.nodes.fragment = this.nodes.fragment.concat(planarReport.nodes.fragment); 
		}
		if(planarReport.nodes.collinear !== undefined){ 
			this.nodes.collinear = this.nodes.collinear.concat(planarReport.nodes.collinear);
		}
		if(planarReport.nodes.duplicate !== undefined){ 
			this.nodes.duplicate = this.nodes.duplicate.concat(planarReport.nodes.duplicate);
		}
		return this;
	}
}

export class PlanarNode extends GraphNode implements M.XY{

	graph:PlanarGraph;
	x:number;
	y:number;

	junctionType = PlanarJunction;
	sectorType = PlanarSector;

	// for speeding up algorithms, temporarily store information here
	cache:object = {};

	// is this a good design decision? a nodes adjacent edges are always sorted by angle
	// TODO: are these increaseing in the right direction?
	adjacentEdges():PlanarEdge[]{
		return this.graph.edges
		.filter(function(el:PlanarEdge){
				return el.nodes[0] === this || el.nodes[1] === this;
			},this)
		.map(function(el:PlanarEdge){
				var other = <PlanarNode>el.otherNode(this);
				return {'edge':el, 'angle':Math.atan2(other.y-this.y, other.x-this.x)};
			},this)
		// .sort(function(a,b){return a.angle-b.angle;})
		.sort(function(a,b){return b.angle-a.angle;})
		.map(function(el){ return el.edge });
	}
	adjacentFaces():PlanarFace[]{
		var junction = this.junction();
		if(junction === undefined){ return []; }
		return junction.faces();
	}
	interiorAngles():number[]{ return this.junction().interiorAngles(); }

	/** Adjacent nodes and edges sorted clockwise around this node */
	junction():PlanarJunction{
		//todo: check cache for junction object
		// store this new one if doesn't exist yet
		var junction = new this.junctionType(this);
		if (junction.edges.length === 0){ return undefined; }
		return junction;
	}
	// implements XY
	// todo: probably need to break apart XY and this. this modifies the x and y in place. XY returns a new one and doesn't modify the current one in place
	position(x:number, y:number):PlanarNode{ this.x = x; this.y = y; return this; }
	translate(dx:number, dy:number):PlanarNode{ this.x += dx; this.y += dy; return this;}
	normalize():PlanarNode { var m = this.magnitude(); this.x /= m; this.y /= m; return this; }
	dot(point:M.XY):number { return this.x * point.x + this.y * point.y; }
	cross(vector:M.XY):number{ return this.x*vector.y - this.y*vector.x; }
	magnitude():number { return Math.sqrt(this.x * this.x + this.y * this.y); }
	distanceTo(a:M.XY):number{ return Math.sqrt( Math.pow(this.x-a.x,2) + Math.pow(this.y-a.y,2) ); }
	equivalent(point:M.XY, epsilon?:number):boolean{
		return new M.XY(this.x, this.y).equivalent(point, epsilon);
	}
	transform(matrix):PlanarNode{
		var xx = this.x; var yy = this.y;
		this.x = xx * matrix.a + yy * matrix.c + matrix.tx;
		this.y = xx * matrix.b + yy * matrix.d + matrix.ty;
		return this;
	}
	rotate90():PlanarNode { var x = this.x; this.x = -this.y; this.y = x; return this; }
	rotate270():PlanarNode { var x = this.x; this.x = this.y; this.y = -x; return this; }
	rotate(angle:number, origin?:M.XY):PlanarNode{
		var rotated = new M.XY(this.x, this.y).rotate(angle, origin);
		return this.position(rotated.x, rotated.y);
	}
	lerp(point:M.XY, pct:number):PlanarNode{
		var translated = new M.XY(this.x, this.y).lerp(point, pct);
		return this.position(translated.x, translated.y);
	}
	angleLerp(point:M.XY, pct:number):PlanarNode{
		var translated = new M.XY(this.x,this.y).angleLerp(point,pct);
		return this.position(translated.x, translated.y);
	}
	/** reflects about a line that passes through 'a' and 'b' */
	reflect(line:any):PlanarNode{
		var reflected = new M.XY(this.x, this.y).reflect(line);
		return this.position(reflected.x, reflected.y);
	}
	scale(magnitude:number):PlanarNode{ this.x*=magnitude; this.y*=magnitude; return this; }
	add(point:M.XY):PlanarNode{ this.x+=point.x; this.y+=point.y; return this; }
	subtract(sub:M.XY):PlanarNode{ this.x-=sub.x; this.y-=sub.y; return this; }
	multiply(m:M.XY):PlanarNode{ this.x*=m.x; this.y*=m.y; return this; }
	midpoint(other:M.XY):M.XY{ return new M.XY((this.x+other.x)*0.5, (this.y+other.y)*0.5); }
	abs():PlanarNode{ this.x = Math.abs(this.x), this.y = Math.abs(this.y); return this; }
	commonX(p:M.XY, epsilon?:number):boolean{return new M.XY(this.x,this.y).commonX(new M.XY(p.x,p.y),epsilon);}
	commonY(p:M.XY, epsilon?:number):boolean{return new M.XY(this.x,this.y).commonY(new M.XY(p.x,p.y),epsilon);}
}

export class PlanarEdge extends GraphEdge implements M.Edge{

	graph:PlanarGraph;
	nodes:[PlanarNode,PlanarNode];

	adjacentFaces():PlanarFace[]{
		return [
			new this.graph.faceType(this.graph).makeFromCircuit( this.graph.walkClockwiseCircut(this.nodes[0], this.nodes[1]) ),
			new this.graph.faceType(this.graph).makeFromCircuit( this.graph.walkClockwiseCircut(this.nodes[1], this.nodes[0]) )]
			.filter(function(el){ return el !== undefined });
	}
	// returns the matrix representation form of this edge as the line of reflection
	crossingEdges():{edge:PlanarEdge, point:M.XY}[]{
		// optimize by excluding all edges outside of the quad space occupied by this edge
		var minX = (this.nodes[0].x < this.nodes[1].x) ? this.nodes[0].x : this.nodes[1].x;
		var maxX = (this.nodes[0].x > this.nodes[1].x) ? this.nodes[0].x : this.nodes[1].x;
		var minY = (this.nodes[0].y < this.nodes[1].y) ? this.nodes[0].y : this.nodes[1].y;
		var maxY = (this.nodes[0].y > this.nodes[1].y) ? this.nodes[0].y : this.nodes[1].y;
		return this.graph.edges
			.filter(function(el){ return !(
				(el.nodes[0].x < minX && el.nodes[1].x < minX) ||
				(el.nodes[0].x > maxX && el.nodes[1].x > maxX) ||
				(el.nodes[0].y < minY && el.nodes[1].y < minY) ||
				(el.nodes[0].y > maxY && el.nodes[1].y > maxY)
				)},this)
			.filter(function(el){ return this !== el}, this)
			.map(function(el){ return this.intersection(el) }, this)
			.filter(function(el){ return el != undefined})
			.sort(function(a,b){
				if(a.commonX(b)){ return a.y-b.y; }
				return a.x-b.x;
			});
	}
	absoluteAngle(startNode?:PlanarNode):number{  // startNode is one of this edge's 2 nodes
		// if not specified it will pick one node
		if(startNode === undefined){ startNode = this.nodes[1]; }
		// measure edge as if it were a ray
		var endNode = <PlanarNode>this.otherNode(startNode);
		return Math.atan2(endNode.y-startNode.y, endNode.x-startNode.x);
	}
	// implements Edge (implements LineType)
	length():number{ return this.nodes[0].distanceTo(this.nodes[1]); }
	vector(originNode?:PlanarNode):M.XY{
		var origin = originNode || this.nodes[0];
		var otherNode = <PlanarNode>this.otherNode(origin);
		return new M.XY(otherNode.x, otherNode.y).subtract(origin);
	}
	parallel(edge:PlanarEdge, epsilon?:number):boolean{
		return new M.Edge(this).parallel(new M.Edge(edge), epsilon);
	}
	collinear(point:M.XY, epsilon?:number):boolean{
		return new M.Edge(this).collinear(point, epsilon);
	}
	equivalent(e:PlanarEdge, epsilon?:number):boolean{ return this.isSimilarToEdge(e); }
	intersection(edge:M.Edge, epsilon?:number):{edge:PlanarEdge, point:M.XY}{
		// todo: should intersecting adjacent edges return the point in common they have with each other or register no intersection?
		if(edge instanceof PlanarEdge && this.isAdjacentToEdge(edge)){ return undefined; }
		var a = new M.Edge(this.nodes[0].x, this.nodes[0].y, this.nodes[1].x, this.nodes[1].y);
		var b = new M.Edge(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
		var intersect = a.intersection(b,epsilon); //intersectionEdgeEdge(a, b, epsilon);
		if(intersect !== undefined && 
		 !(intersect.equivalent(this.nodes[0], epsilon) || intersect.equivalent(this.nodes[1], epsilon))){
		 	var pe = <PlanarEdge>edge;
			return {'edge':pe, 'point':intersect};
		}
	}
	reflectionMatrix(){
		return new M.Edge(this.nodes[0], this.nodes[1]).reflectionMatrix();
	}
	nearestPoint(point:M.XY):M.XY{
		var answer = this.nearestPointNormalTo(point);
		if(answer !== undefined){ return answer; }
		return this.nodes
			.map(function(el){ return {point:el,distance:el.distanceTo(point)}; },this)
			.sort(function(a,b){ return a.distance - b.distance; })
			.shift()
			.point;
	}
	nearestPointNormalTo(point:M.XY):M.XY{
		var p = this.nodes[0].distanceTo(this.nodes[1]);
		var u = ((point.x-this.nodes[0].x)*(this.nodes[1].x-this.nodes[0].x) + (point.y-this.nodes[0].y)*(this.nodes[1].y-this.nodes[0].y)) / (Math.pow(p,2));
		if(u < 0 || u > 1.0){return undefined;}
		return new M.XY(this.nodes[0].x + u*(this.nodes[1].x-this.nodes[0].x), this.nodes[0].y + u*(this.nodes[1].y-this.nodes[0].y));
	}
	transform(matrix):PlanarEdge{
		this.nodes[0].transform(matrix);
		this.nodes[1].transform(matrix);
		return this;
	}
	degenrate(epsilon?:number):boolean{
		return this.nodes[0].equivalent(this.nodes[1], epsilon);
	}
	// implements Edge (outside LineType)
	midpoint():M.XY { return new M.XY( 0.5*(this.nodes[0].x + this.nodes[1].x),
	                                   0.5*(this.nodes[0].y + this.nodes[1].y));}
	infiniteLine():M.Line{
		var origin = new M.XY(this.nodes[0].x, this.nodes[0].y);
		var vector = new M.XY(this.nodes[1].x, this.nodes[1].y).subtract(origin);
		return new M.Line(origin, vector);
	}
}

export class PlanarFace{
	// this library is counting on the edges and nodes to be stored in clockwise winding
	graph:PlanarGraph;
	nodes:PlanarNode[];
	edges:PlanarEdge[];
	sectors:PlanarSector[];
	angles:number[];
	index:number;

	constructor(graph:PlanarGraph){
		this.graph = graph;
		this.nodes = [];
		this.edges = [];
		this.angles = [];
	}
	makeFromCircuit(circut:PlanarEdge[]):PlanarFace{
		var SUM_ANGLE_EPSILON = 0.00001;
		// todo: console log below, see how close to epsilon we normally get. hardcode this epsilon value, it shouldn't need to be adjusted unless porting to a new language.
		if(circut == undefined || circut.length < 3){ return undefined; }
		this.edges = circut;
		this.nodes = circut.map(function(el,i){
			return <PlanarNode>el.uncommonNodeWithEdge( circut[ (i+1)%circut.length ] );
		});
		var sectorType = this.nodes[0].sectorType;
		this.sectors = this.edges.map(function(el,i){
			var nexti = (i+1)%this.edges.length;
			var origin = el.commonNodeWithEdge(this.edges[nexti]);
			var endPoints = [ el.uncommonNodeWithEdge(this.edges[nexti]),
			                  this.edges[nexti].uncommonNodeWithEdge(el) ];
			return new sectorType(el, this.edges[nexti]);
		},this);
		this.angles = this.sectors.map(function(el:PlanarSector){ return el.angle(); });
		var angleSum = this.angles.reduce(function(sum,value){ return sum + value; }, 0);
		// sum of interior angles rule, (n-2) * PI
		// console.log( Math.abs(angleSum/(this.nodes.length-2)-Math.PI) );
		if(this.nodes.length > 2 && Math.abs(angleSum/(this.nodes.length-2)-Math.PI) < SUM_ANGLE_EPSILON){
			return this;
		}
		return undefined;
	}
	// this algorithm takes time, it hunts for a mapping of adjacent-nodes to edges,
	//   then calls makeFromCircut()
	makeFromNodes(nodes:PlanarNode[]):PlanarFace{
		var edgeCircut = nodes.map(function(node,i){
			var nextNode = this.nodes[ (i+1)%this.nodes.length ];
			return <PlanarEdge>this.graph.getEdgeConnectingNodes(node, nextNode);
		},this);
		return this.makeFromCircuit(edgeCircut);
	}
	equivalent(face:PlanarFace):boolean{
		// quick check, only verfies nodes
		if(face.nodes.length != this.nodes.length) return false;
		var iFace = undefined;
		for(var i = 0; i < this.nodes.length; i++){
			if(this.nodes[0] === face.nodes[i]){ iFace = i; break; }
		}
		if(iFace == undefined) return false;
		for(var i = 0; i < this.nodes.length; i++){
			var iFaceMod = (iFace + i) % this.nodes.length;
			if(this.nodes[i] !== face.nodes[iFaceMod]) return false;
		}
		return true;
	}
	commonEdge(face:PlanarFace):PlanarEdge{
		// faces will have only 1 edge in common if all faces are convex
		for(var i = 0; i < this.edges.length; i++){
			for(var j = 0; j < face.edges.length; j++){
				if(this.edges[i] === face.edges[j]){ return this.edges[i]; }
			}
		}
	}
	/*
	commonEdges(face:PlanarFace):PlanarEdge[]{
		// faces will have only 1 edge in common if all faces are convex
		var edges = [];
		for(var i = 0; i < this.edges.length; i++){
			for(var j = 0; j < face.edges.length; j++){
				if(this.edges[i] === face.edges[j]){ edges.push(this.edges[i]); }
			}
		}
		return removeDuplicates(edges, function(a,b){return a === b; });
	}
	uncommonEdges(face:PlanarFace):PlanarEdge[]{
		var edges = this.edges.slice(0);
		for(var i = 0; i < face.edges.length; i++){
			edges = edges.filter(function(el){return el !== face.edges[i];});
		}
		return edges;
	}
	*/
	edgeAdjacentFaces():PlanarFace[]{
		return this.edges.map(function(ed){
			var allFaces = this.graph.faces.filter(function(el){return !this.equivalent(el);},this);
			for(var i = 0; i < allFaces.length; i++){
				var adjArray = allFaces[i].edges.filter(function(ef){return ed === ef;});
				if(adjArray.length > 0){ return allFaces[i]; }
			}
		}, this).filter(function(el){return el !== undefined;});
	}
	contains(point:M.XY):boolean{
		for(var i = 0; i < this.edges.length; i++){
			var endpts = this.edges[i].nodes;
			var cross = (point.y - endpts[0].y) * (endpts[1].x - endpts[0].x) - 
						(point.x - endpts[0].x) * (endpts[1].y - endpts[0].y);
			if (cross < 0){ return false; }
		}
		return true;
	}
	transform(matrix){
		for(var i = 0; i < this.nodes.length; i++){
			this.nodes[i].transform(matrix);
		}
	}

// [
// 	[CreaseFace]
// 	[CreaseFace, CreaseFace, CreaseFace]
// 	[CreaseFace, CreaseFace, CreaseFace, CreaseFace, CreaseFace]
// 	[CreaseFace, CreaseFace, CreaseFace, CreaseFace, CreaseFace, CreaseFace, CreaseFace]
// 	[CreaseFace, CreaseFace, CreaseFace, CreaseFace, CreaseFace]
// 	[CreaseFace, CreaseFace]
// 	[CreaseFace]
// ]
	adjacencyTree():M.Tree<PlanarFace>{
		// todo: if generateFaces() hasn't been called, call it. better if we set a flag.
		if(this.graph.faces.length === 0){
			this.graph.generateFaces();
		} else{ this.graph.faceArrayDidChange(); }
		// just make sure we call this.graph.faceArrayDidChange();
		// this will keep track of faces still needing to be visited
		// var visited = Array.apply(undefined, Array(this.graph.faces.length))
		var current = this;
		var visited = [];
		var list:{"face":PlanarFace,"parent":PlanarFace}[][] = [[{"face":current,"parent":undefined}]];
		do{
			var totalRoundAdjacent = [];
			list[ list.length-1 ].forEach(function(current:{"face":PlanarFace,"parent":PlanarFace}){
				totalRoundAdjacent.concat(current.face.edgeAdjacentFaces()
					.filter(function(face){
						return visited.filter(function(el){return el === face},this).length == 0;
					},this)
					.map(function(face){
						visited.push(face);
						return {"face":face, "parent":current};
					},this)
				);
			});
			list[ list.length ] = totalRoundAdjacent;
		} while(list[list.length-1].length > 0);

		var root = new M.Tree<PlanarFace>(list[0][0].face);

		return root;

		// list.forEach(function(smList:{"face":PlanarFace,"parent":PlanarFace}[]){
		// 	smList.forEach()
		// });
	}
}


/** a PlanarSector is defined by 2 unique edges and 3 nodes (one common, 2 endpoints) 
 *  clockwise order is required
 *  the interior angle is measured clockwise from the 1st edge (edge[0]) to the 2nd
 */
export class PlanarSector extends M.Sector{
	// the node in common with the edges
	origin:PlanarNode;
	// the indices of these 2 nodes directly correlate to 2 edges' indices
	edges:[PlanarEdge, PlanarEdge];
	endPoints:[PlanarNode, PlanarNode];
	// angle clockwise from edge 0 to edge 1 is in index 0. edge 1 to 0 is in index 1
	// constructor(origin:PlanarNode, endPoints?:[PlanarNode,PlanarNode], edges?:[PlanarEdge, PlanarEdge]){
	constructor(edge1:PlanarEdge, edge2:PlanarEdge){
		super(<PlanarNode>edge1.commonNodeWithEdge(edge2), undefined);
		if(this.origin === undefined){ return; }
		if(edge1 === edge2){ return; }
		this.edges = [edge1, edge2];
		this.endPoints = [
			(edge1.nodes[0] === this.origin) ? edge1.nodes[1] : edge1.nodes[0],
			(edge2.nodes[0] === this.origin) ? edge2.nodes[1] : edge2.nodes[0]
		];
	}
	makeWithEdges(edge1:PlanarEdge, edge2:PlanarEdge):PlanarSector{
		this.origin = <PlanarNode>edge1.commonNodeWithEdge(edge2);
		if(this.origin === undefined){ return; }
		if(edge1 === edge2){ return; }
		this.edges = [edge1, edge2];
		this.endPoints = [
			(edge1.nodes[0] === this.origin) ? edge1.nodes[1] : edge1.nodes[0],
			(edge2.nodes[0] === this.origin) ? edge2.nodes[1] : edge2.nodes[0]
		];
		return this;
	}
	equivalent(a:PlanarSector):boolean{
		return( (a.edges[0].isSimilarToEdge(this.edges[0]) &&
		         a.edges[1].isSimilarToEdge(this.edges[1])) ||
		        (a.edges[0].isSimilarToEdge(this.edges[1]) &&
		         a.edges[1].isSimilarToEdge(this.edges[0])));
	}
	// Available through Sector
	// vectors():[M.XY,M.XY]{}
	// angle():number{}
	// bisect():M.XY{}
	// subsectAngle(divisions:number):number[]{}
	// getEdgeVectorsForNewAngle(angle:number, lockedEdge?:PlanarEdge):[XY,XY]{}

	// getEndNodesChangeForNewAngle(angle:number, lockedEdge?:PlanarEdge):[XY,XY]{
	// 	// todo, implement locked edge
	// 	var vectors = this.vectors();
	// 	var angleChange = angle - clockwiseInteriorAngle(vectors[0], vectors[1]);
	// 	var rotateNodes = [-angleChange*0.5, angleChange*0.5];
	// 	return <[XY,XY]>vectors.map(function(el:XY, i){
	// 		// rotate the nodes, subtract the new position from the original position
	// 		return this.endPoints[i].subtract(el.rotate(rotateNodes[i]).add(this.origin));
	// 	}, this);
	// }
}

export class PlanarJunction{

	origin:PlanarNode;
	// sectors and edges are sorted clockwise
	sectors:PlanarSector[];
	edges:PlanarEdge[];
	// Planar Junction is invalid if the node is either isolated or a leaf node
	//  javascript constructors can't return null. if invalid: edges = [], sectors = []
	constructor(node:PlanarNode){
		this.origin = node;
		this.sectors = [];
		this.edges = [];
		if(node === undefined){ return; }
		// these are coming in already sorted now
		this.edges = this.origin.adjacentEdges();
		// Junctions by definition cannot be built on leaf nodes. there is only 1 edge.
		if(this.edges.length <= 1){ return; }
		this.sectors = this.edges.map(function(el,i){
			var nextEl = this.edges[(i+1)%this.edges.length];
			var origin = <PlanarNode>el.commonNodeWithEdge(nextEl);
			var nextN = <PlanarNode>nextEl.uncommonNodeWithEdge(el);
			var prevN = <PlanarNode>el.uncommonNodeWithEdge(nextEl);
			// return new this.origin.sectorType(origin, [nextN, prevN]);
			return new this.origin.sectorType(el, nextEl);
		},this);
		// this.edges = this.sectors.map(function(el:PlanarSector){return el.edges[0];});
	}
	edgeVectorsNormalized():M.XY[]{
		return this.edges.map(function(el){return el.vector(this.origin).normalize();},this);
	}
	edgeAngles():number[]{
		return this.edges.map(function(el){return el.absoluteAngle(this.origin);},this);
	}
	sectorWithEdges(a:PlanarEdge, b:PlanarEdge):M.Sector{
		var found = undefined;
		this.sectors.forEach(function(el){
			if( (el.edges[0].equivalent(a) && el.edges[1].equivalent(b) ) ||
				(el.edges[1].equivalent(a) && el.edges[0].equivalent(b) ) ){
				found = el;
				return found; // this just breaks out of the loop
			}
		},this);
		return found;
	}
	/** get an array of numbers measuring the angle in radians between each edge.
	 * array indices are related to edges indices: interiorAngle()[i] is the angle between edges[i] and edges[i+1].
	 * @returns {number[]} angles in radians. sum of all numbers in array equals 2 PI for non-zero curvature
	 */
	interiorAngles():number[]{
		return this.sectors.map(function(el:PlanarSector){
			return el.angle();
		},this);
	}
	/** Locates the most clockwise adjacent node from the node supplied in the argument. If this was a clock centered at this node, if you pass in node for the number 3, it will return you the number 4.
	 * @returns {PlanarNode}
	 */
	clockwiseNode(fromNode:PlanarNode):PlanarNode{
		for(var i = 0; i < this.edges.length; i++){
			if(this.edges[i].otherNode(this.origin) === fromNode){
				return <PlanarNode>this.edges[ (i+1)%this.edges.length ].otherNode(this.origin);
			}
		}
	}
	clockwiseEdge(fromEdge:PlanarEdge):PlanarEdge{
		var index = this.edges.indexOf(fromEdge);
		if(index === -1){ return undefined; }
		return this.edges[ (index+1)%this.edges.length ];
	}
	faces():PlanarFace[]{
		var adjacentFaces = [];
		for(var n = 0; n < this.edges.length; n++){
			var circuit = this.origin.graph.walkClockwiseCircut(this.origin, <PlanarNode>this.edges[n].otherNode(this.origin));
			var face = new this.origin.graph.faceType(this.origin.graph).makeFromCircuit( circuit );
			if(face !== undefined){ adjacentFaces.push(face); }
		}
		return adjacentFaces;
	}
}


export class PlanarGraph extends Graph{

	nodes:PlanarNode[];
	edges:PlanarEdge[];
	faces:PlanarFace[];

	// When subclassed, base types are overwritten
	nodeType = PlanarNode;
	edgeType = PlanarEdge;
	faceType = PlanarFace;

	properties = {"optimization":0}; // we need something to be able to set to skip over functions

	didChange:(event:object)=>void;

	constructor(){ super(); this.clear(); }

	/** Deep-copy the contents of this planar graph and return it as a new object
	 * @returns {PlanarGraph} 
	 */
	copy():PlanarGraph{
		this.nodeArrayDidChange();
		this.edgeArrayDidChange();
		var g = new PlanarGraph();
		for(var i = 0; i < this.nodes.length; i++){
			var n = g.addNode(new PlanarNode(g));
			(<any>Object).assign(n, this.nodes[i]);
			n.graph = g; n.index = i;
		}
		for(var i = 0; i < this.edges.length; i++){
			var index = [this.edges[i].nodes[0].index, this.edges[i].nodes[1].index];
			var e = g.addEdge(new PlanarEdge(g, g.nodes[index[0]], g.nodes[index[1]]));
			(<any>Object).assign(e, this.edges[i]);
			e.graph = g; e.index = i;
			e.nodes = [g.nodes[index[0]], g.nodes[index[1]]];
		}
		for(var i = 0; i < this.faces.length; i++){
			var f = new PlanarFace(g);
			(<any>Object).assign(f, this.faces[i]);
			for(var j=0;j<this.faces[i].nodes.length;j++){f.nodes.push(f.nodes[this.faces[i].nodes[j].index]);}
			for(var j=0;j<this.faces[i].edges.length;j++){f.edges.push(f.edges[this.faces[i].edges[j].index]);}
			for(var j=0;j<this.faces[i].angles.length;j++){f.angles.push(this.faces[i].angles[j]); }
			f.graph = g;
			g.faces.push(f);
		}
		return g;
	}

	///////////////////////////////////////////////
	// ADD PARTS
	///////////////////////////////////////////////

	/** Create a new isolated planar node at x,y
	 * @returns {PlanarNode} pointer to the node
	 */
	newPlanarNode(x:number, y:number):PlanarNode{
		return (<PlanarNode>this.newNode()).position(x, y);
	}
	/** Create two new nodes each with x,y locations and an edge between them
	 * @returns {PlanarEdge} pointer to the edge
	 */
	newPlanarEdge(x1:number, y1:number, x2:number, y2:number):PlanarEdge{
		var a = (<PlanarNode>this.newNode()).position(x1, y1);
		var b = (<PlanarNode>this.newNode()).position(x2, y2);
		return <PlanarEdge>this.newEdge(a, b);
	}
	/** Create one node with an x,y location and an edge between it and an existing node
	 * @returns {PlanarEdge} pointer to the edge
	 */
	newPlanarEdgeFromNode(node:PlanarNode, x:number, y:number):PlanarEdge{
		var newNode = (<PlanarNode>this.newNode()).position(x, y);
		return <PlanarEdge>this.newEdge(node, newNode);
	}
	/** Create one edge between two existing nodes
	 * @returns {PlanarEdge} pointer to the edge
	 */
	newPlanarEdgeBetweenNodes(a:PlanarNode, b:PlanarNode):PlanarEdge{
		return <PlanarEdge>this.newEdge(a, b);
	}
	/** Create one node with an angle and distance away from an existing node and make an edge between them
	 * @returns {PlanarEdge} pointer to the edge
	 */
	newPlanarEdgeRadiallyFromNode(node:PlanarNode, angle:number, length:number):PlanarEdge{
		var newNode = (<PlanarNode>this.copyNode(node))
					   .translate(Math.cos(angle)*length, Math.sin(angle)*length);
		return <PlanarEdge>this.newEdge(node, newNode);
	}

	///////////////////////////////////////////////
	// REMOVE PARTS (TARGETS KNOWN)
	///////////////////////////////////////////////

	/** Removes all nodes, edges, and faces, returning the graph to it's original state */
	clear():PlanarGraph{
		this.nodes = [];
		this.edges = [];
		this.faces = [];
		return this;
	}

	/** Removes an edge and also attempt to remove the two nodes left behind if they are otherwise unused
	 * @returns {boolean} if the edge was removed
	 */
	removeEdge(edge:PlanarEdge):PlanarClean{
		var len = this.edges.length;
		var endNodes = [edge.nodes[0], edge.nodes[1]];
		this.edges = this.edges.filter(function(el){ return el !== edge; });
		this.edgeArrayDidChange();
		this.cleanNodeIfUseless(endNodes[0]);
		this.cleanNodeIfUseless(endNodes[1]);
		// todo: this is hitting the same node repeatedly from different sides, so keeping track of nodes is not working
		// var report = new PlanarCleanReport();
		// var a = this.cleanNodeIfUseless(endNodes[0]);
		// var b = this.cleanNodeIfUseless(endNodes[1]);
		// console.log(a +  " " + b)
		return new PlanarClean(undefined, len - this.edges.length);
	}

	/** Attempt to remove an edge if one is found that connects the 2 nodes supplied, and also attempt to remove the two nodes left behind if they are otherwise unused
	 * @returns {number} how many edges were removed
	 */
	removeEdgeBetween(node1:PlanarNode, node2:PlanarNode):PlanarClean{
		var len = this.edges.length;
		this.edges = this.edges.filter(function(el){ 
			return !((el.nodes[0] === node1 && el.nodes[1] === node2) ||
					 (el.nodes[0] === node2 && el.nodes[1] === node1) );
		});
		this.edgeArrayDidChange();
		return new PlanarClean(undefined, len - this.edges.length)
			.join(this.cleanNodeIfUseless(node1))
			.join(this.cleanNodeIfUseless(node2));
	}

	/** Remove a node if it is either unconnected to any edges, or is in the middle of 2 collinear edges
	 * @returns {number} how many nodes were removed
	 */
	cleanNodeIfUseless(node:PlanarNode):PlanarClean{
		var edges = node.adjacentEdges();
		switch (edges.length){
			case 0: return <PlanarClean>this.removeNode(node);
			case 2:
				var farNodes = [<PlanarNode>(edges[0].uncommonNodeWithEdge(edges[1])), 
								<PlanarNode>(edges[1].uncommonNodeWithEdge(edges[0]))]
				var span = new M.Edge(farNodes[0], farNodes[1]);
				if(span.collinear(node)){
					edges[0].nodes = [farNodes[0], farNodes[1]];
					this.removeEdge(edges[1]);
					// this.newEdge(farNodes[0], farNodes[1]);
					this.removeNode(node);
					// console.log("Collinear " + (nodeLen - this.nodes.length));
					return new PlanarClean(1, 1);
				}
			// return below, no break
		}
		return new PlanarClean();
	}

	///////////////////////////////////////////////
	// REMOVE PARTS (SEARCH REQUIRED TO LOCATE)
	///////////////////////////////////////////////

	/** Removes all isolated nodes and performs cleanNodeIfUseless() on every node
	 * @returns {PlanarClean} how many nodes were removed
	 */
	cleanAllUselessNodes():PlanarClean{
		// prepare adjacency information
		this.nodes.forEach(function(el){ el.cache['adjacentEdges'] = []; });
		this.edges.forEach(function(el){ 
			el.nodes[0].cache['adjacentEdges'].push(el);
			el.nodes[1].cache['adjacentEdges'].push(el);
		});
		var report = new PlanarClean().join( this.removeIsolatedNodes() );
		this.nodeArrayDidChange();
		this.edgeArrayDidChange();
		for(var i = this.nodes.length-1; i >= 0; i--){
			var edges = this.nodes[i].cache['adjacentEdges'];
			switch (edges.length){
				case 0: report.join(this.removeNode(this.nodes[i])); break;
				case 2:
					var farNodes = [<PlanarNode>(edges[0].uncommonNodeWithEdge(edges[1])), 
									<PlanarNode>(edges[1].uncommonNodeWithEdge(edges[0]))]
					var span = new M.Edge(farNodes[0], farNodes[1]);
					if(span.collinear(this.nodes[i])){
						edges[0].nodes = [farNodes[0], farNodes[1]];
						this.edges.splice(edges[1].index, 1);
						this.edgeArrayDidChange();
						this.nodes.splice(this.nodes[i].index, 1);
						this.nodeArrayDidChange();
						report.join( new PlanarClean(1, 1) );
					}
				break;
			}
		}
		this.nodes.forEach(function(el){ el.cache['adjacentEdges'] = undefined; });
		return report;
	}

	/** Removes all nodes that lie within an epsilon distance to an existing node.
	 * remap any compromised edges to the persisting node so no edge data gets lost
	 * @returns {PlanarClean} how many nodes were removed
	 */
	cleanDuplicateNodes(epsilon?:number):PlanarClean{
		var EPSILON_HIGH = 0.00000001;
		if (epsilon === undefined){ epsilon = EPSILON_HIGH; }
		var tree = rbush();
		// cache each node's adjacent edges
		// this.nodes.forEach(function(el){ el.cache = {'edges':[]}; });
		// this.edges.forEach(function(el){ 
		// 	el.nodes[0].cache['edges'].push(el);
		// 	el.nodes[1].cache['edges'].push(el);
		// });
		// console.time("map");
		var nodes = this.nodes.map(function(el){
			return {
				minX: el.x - epsilon,
				minY: el.y - epsilon,
				maxX: el.x + epsilon,
				maxY: el.y + epsilon,
				node: el
			};
		});
		tree.load(nodes);
		var that = this;
		function merge2Nodes(nodeA, nodeB):PlanarClean{
			that.edges.forEach(function(el){
				if(el.nodes[0] === nodeB){ el.nodes[0] = nodeA; }
				if(el.nodes[1] === nodeB){ el.nodes[1] = nodeA; }
			});
			that.nodes = that.nodes.filter(function(el){ return el !== nodeB; });
			return new PlanarClean().duplicateNodes([new M.XY(nodeB.x, nodeB.y)]).join(that.cleanGraph());
		}
		var clean = new PlanarClean()
		for(var i = 0; i < this.nodes.length; i++){
			var result = tree.search({
				minX: this.nodes[i].x - epsilon,
				minY: this.nodes[i].y - epsilon,
				maxX: this.nodes[i].x + epsilon,
				maxY: this.nodes[i].y + epsilon
			});
			for(var r = 0; r < result.length; r++){
				if(this.nodes[i] !== result[r]['node']){
					clean.join(merge2Nodes(this.nodes[i], result[r]['node']));
				}
			}
		}
		return clean;
	}

	/** Removes circular and duplicate edges, merges and removes duplicate nodes, and refreshes .index values
	 * @returns {object} 'edges' the number of edges removed, and 'nodes' an XY location for every duplicate node merging
	 */
	clean(epsilon?:number):PlanarClean{
		var report = new PlanarClean();
		report.join( this.cleanDuplicateNodes(epsilon) );
		report.join( this.fragment() );
		report.join( this.cleanDuplicateNodes(epsilon) );
		report.join( this.cleanGraph() );
		report.join( this.cleanAllUselessNodes() );
		return report;
	}

	///////////////////////////////////////////////
	// FRAGMENT, EDGE INTERSECTION
	///////////////////////////////////////////////

	/** Fragment looks at every edge and one by one removes 2 crossing edges and replaces them with a node at their intersection and 4 edges connecting their original endpoints to the intersection.
	 * @returns {XY[]} array of XY locations of all the intersection locations
	 */
// new idea
		// build a N x N matrix of edge to edge relationships, but only use the top triangle
		// fill matrix with approximations
	fragment():PlanarClean{
		var that = this;
		function fragmentOneRound():PlanarClean{
			var roundReport = new PlanarClean();
			for(var i = 0; i < that.edges.length; i++){
				var fragmentReport = that.fragmentEdge(that.edges[i]);
				roundReport.join(fragmentReport);
				if(fragmentReport.nodes.fragment.length > 0){
					roundReport.join( that.cleanGraph() );
					roundReport.join( that.cleanAllUselessNodes() );
					roundReport.join( that.cleanDuplicateNodes() );
				}
			}
			return roundReport;
		}
		//todo: remove protection, or bake it into the class itself
		var protection = 0;
		var report = new PlanarClean();
		var thisReport:PlanarClean;
		do{
			thisReport = fragmentOneRound();
			report.join( thisReport );
			protection += 1;
		}while(thisReport.nodes.fragment.length != 0 && protection < 5000);
		if(protection >= 5000){ throw("exiting fragment(). potential infinite loop detected"); }
		return report;
	}

	/** This function targets a single edge and performs the fragment operation on all crossing edges.
	 * @returns {XY[]} array of XY locations of all the intersection locations
	 */
	fragmentEdge(edge:PlanarEdge):PlanarClean{
		var report = new PlanarClean();
		// console.time("crossingEdge");
		var intersections:{'edge':PlanarEdge, 'point':M.XY}[] = edge.crossingEdges();
		// console.timeEnd("crossingEdge");
		if(intersections.length === 0) { return report; }
		report.nodes.fragment = intersections.map(function(el){ return new M.XY(el.point.x, el.point.y);});
		// console.time("fragmentEdge");
		var endNodes = edge.nodes.sort(function(a,b){
			if(a.commonX(b)){ return a.y-b.y; }
			return a.x-b.x;
		});
		// iterate through intersections, rebuild edges in order
		var newLineNodes = [];
		// todo, add endNodes into this array
		for(var i = 0; i < intersections.length; i++){
			if(intersections[i] != undefined){
				var newNode = (<PlanarNode>this.newNode()).position(intersections[i].point.x, intersections[i].point.y);
				this.copyEdge(intersections[i].edge).nodes = [newNode, intersections[i].edge.nodes[1]];
				intersections[i].edge.nodes[1] = newNode;
				newLineNodes.push(newNode);
			}
		}
		// replace the original edge with smaller collinear pieces of itself
		this.copyEdge(edge).nodes = [endNodes[0], newLineNodes[0]];
		for(var i = 0; i < newLineNodes.length-1; i++){
			this.copyEdge(edge).nodes = [newLineNodes[i], newLineNodes[i+1]];
		}
		this.copyEdge(edge).nodes = [newLineNodes[newLineNodes.length-1], endNodes[1]];
		this.removeEdge(edge);
		// console.timeEnd("fragmentEdge");
		report.join(this.cleanGraph());
		return report;
	}

	/** walk from node1 to node2, continue always making right-most inner angle turn. */
	walkClockwiseCircut(node1:PlanarNode, node2:PlanarNode):PlanarEdge[]{
		if(node1 === undefined || node2 === undefined){ return undefined; }
		var incidentEdge = <PlanarEdge>node1.graph.getEdgeConnectingNodes(node1, node2);
		if(incidentEdge == undefined) { return undefined; }  // nodes are not adjacent
		var pairs:PlanarEdge[] = [];
		var lastNode = node1;
		var travelingNode = node2;
		var visitedList:PlanarNode[] = [lastNode];
		var nextWalk = incidentEdge;
		pairs.push(nextWalk);
		do{
			visitedList.push(travelingNode);
			var travelingNodeJunction:PlanarJunction = travelingNode.junction();
			if(travelingNodeJunction !== undefined){ // just don't go down cul de sacs
				nextWalk = travelingNodeJunction.clockwiseEdge(nextWalk);
			}
			pairs.push(nextWalk);
			lastNode = travelingNode;
			travelingNode = <PlanarNode>nextWalk.otherNode(lastNode);
			if(travelingNode === node1){ return pairs; }		
		// } while(!contains(visitedList, travelingNode));
		} while( !(visitedList.filter(function(el){return el === travelingNode;}).length > 0) );
		return undefined;
	}

	///////////////////////////////////////////////
	// GET PARTS
	///////////////////////////////////////////////

	bounds():M.Rect{
		if(this.nodes === undefined || this.nodes.length === 0){ return undefined; }
		var minX = Infinity;
		var maxX = -Infinity;
		var minY = Infinity;
		var maxY = -Infinity;
		this.nodes.forEach(function(el){
			if(el.x > maxX){ maxX = el.x; }
			if(el.x < minX){ minX = el.x; }
			if(el.y > maxY){ maxY = el.y; }
			if(el.y < minY){ minY = el.y; }
		});
		return new M.Rect(minX, minY, maxX-minX, maxY-minY);
	}

	/** Without changing the graph, this function collects the XY locations of every point that two edges cross each other.
	 * @returns {XY[]} array of XY locations of all the intersection locations
	 */
	getEdgeIntersections(epsilon?:number):M.XY[]{
		// todo should this make new XYs instead of returning EdgeIntersection objects?
		var intersections = [];
		// check all edges against each other for intersections
		for(var i = 0; i < this.edges.length-1; i++){
			for(var j = i+1; j < this.edges.length; j++){
				var intersection = this.edges[i].intersection(this.edges[j], epsilon);
				// add to array if exists, and is unique
				if(intersection != undefined){
					var copy = false;
					for(var k = 0; k < intersections.length; k++){
						if(intersection.point.equivalent(intersections[k], epsilon)){ copy = true;}
					}
					if(!copy){ intersections.push(intersection.point); }
				}
			}
		}
		return intersections;
	}

	/** Add an already-initialized edge to the graph
	 * @param {XY} either two numbers (x,y) or one XY point object (XY)
	 * @returns {PlanarNode} nearest node to the point
	 */
	/*
	getNearestNode(a:any, b:any):PlanarNode{
		var p = gimme1XY(a,b);
		if(p === undefined){ return; }
		// can be optimized with a k-d tree
		var node = undefined;
		var distance = Infinity;
		for(var i = 0; i < this.nodes.length; i++){
			var dist = Math.sqrt(Math.pow(this.nodes[i].x - p.x,2) + Math.pow(this.nodes[i].y - p.y,2));
			if(dist < distance){
				distance = dist;
				node = this.nodes[i];
			}
		}
		return node;
	}

	getNearestNodes(a:any, b:any, howMany:number):PlanarNode[]{
		var p = gimme1XY(a,b);
		if(p === undefined){ return; }
		// can be optimized with a k-d tree
		var distances = [];
		for(var i = 0; i < this.nodes.length; i++){
			var dist = Math.sqrt(Math.pow(this.nodes[i].x - p.x,2) + Math.pow(this.nodes[i].y - p.y,2));
			distances.push( {'i':i, 'd':dist} );
		}
		distances.sort(function(a,b) {return (a.d > b.d) ? 1 : ((b.d > a.d) ? -1 : 0);} ); 
		// cap howMany at the number of total nodes
		if(howMany > distances.length){ howMany = distances.length; }
		return distances.slice(0, howMany).map(function(el){ return this.nodes[el.i]; }, this);
	}

	getNearestEdge(a:any, b:any):{'edge':PlanarEdge, 'point':XY}{
		var input = gimme1XY(a,b);
		if(input === undefined){ return; }
		var minDist, nearestEdge, minLocation = new XY(undefined,undefined);
		for(var i = 0; i < this.edges.length; i++){
			var p = this.edges[i];
			var pT = p.nearestPoint(input);
			if(pT != undefined){
				var thisDist = Math.sqrt(Math.pow(input.x-pT.x,2) + Math.pow(input.y-pT.y,2));
				if(minDist == undefined || thisDist < minDist){
					minDist = thisDist;
					nearestEdge = this.edges[i];
					minLocation = pT;
				}
			}
		}
		// for (x,y) that is not orthogonal to the length of the edge (past the endpoint)
		// check distance to node endpoints
		for(var i = 0; i < this.nodes.length; i++){
			var dist = Math.sqrt(Math.pow(this.nodes[i].x - input.x,2) + Math.pow(this.nodes[i].y - input.y,2));
			if(dist < minDist){
				var adjEdges = this.nodes[i].adjacentEdges();
				if(adjEdges != undefined && adjEdges.length > 0){
					minDist = dist;
					nearestEdge = adjEdges[0];
					minLocation = new M.XY(this.nodes[i].x, this.nodes[i].y);
				}
			}
		}
		return {'edge':nearestEdge, 'point':minLocation};
	}


	getNearestEdges(a:any, b:any, howMany:number):any[]{
		var p = gimme1XY(a,b);
		if(p === undefined){ return; }
		var minDist, nearestEdge, minLocation = {x:undefined, y:undefined};
		var edges = this.edges.map(function(el){ 
			var pT = el.nearestPointNormalTo(p);
			if(pT === undefined){return undefined;}
			var distances = [
				Math.sqrt(Math.pow(p.x-pT.x,2) + Math.pow(p.y-pT.y,2)), // perp dist
				Math.sqrt(Math.pow(el.nodes[0].x - p.x, 2) + Math.pow(el.nodes[0].y - p.y, 2)), // node 1 dist
				Math.sqrt(Math.pow(el.nodes[1].x - p.x, 2) + Math.pow(el.nodes[1].y - p.y, 2)), // node 2 dist
			].filter(function(el){return el !== undefined; })
			 .sort(function(a,b){return (a > b)?1:(a < b)?-1:0});
			if(distances.length){ return {'edge':el, 'distance':distances[0]}; }			
		});
		return edges.filter(function(el){return el != undefined; });
	}
	getNearestEdgeConnectingPoints(a:any, b:any, c?:any, d?:any):PlanarEdge{
		var p = gimme2XY(a,b,c,d);
		if(p === undefined){ return; }
		var aNear = this.getNearestNode(p[0].x, p[0].y);
		var bNear = this.getNearestNode(p[1].x, p[1].y);
		var edge = <PlanarEdge>this.getEdgeConnectingNodes(aNear, bNear);
		if(edge !== undefined) return edge;
		// check more
		for(var cou = 3; cou < 20; cou+=3){
			var aNears = this.getNearestNodes(p[0].x, p[0].y, cou);
			var bNears = this.getNearestNodes(p[1].x, p[1].y, cou);
			for(var i = 0; i < aNears.length; i++){
				for(var j = 0; j < bNears.length; j++){
					if(i !== j){
						var edge = <PlanarEdge>this.getEdgeConnectingNodes(aNears[i], bNears[j]);
						if(edge !== undefined) return edge;
					}
				}
			}
		}
		return undefined;
	}

	getNearestFace(a:any, b:any):PlanarFace{
		var nearestNode = this.getNearestNode(a, b);
		if(nearestNode === undefined){ return; }
		var faces = nearestNode.adjacentFaces();
		if(faces === undefined || faces.length == 0){ return; }
		var sortedFaces = faces.sort(function(a,b){
			var avgA = 0;
			var avgB = 0;
			for(var i = 0; i < a.nodes.length; i++){ avgA += a.nodes[i].y; }
			avgA /= (a.nodes.length);
			for(var i = 0; i < b.nodes.length; i++){ avgB += b.nodes[i].y; }
			avgB /= (a.nodes.length);
			return (avgA < avgB) ? 1 : ((avgA > avgB) ? -1 : 0);
		});
		if(sortedFaces.length <= 1){ return; }
		return sortedFaces[0];
	}

	getNearestInteriorAngle(a:any, b:any):PlanarSector{
		var p = gimme1XY(a,b);
		if(p === undefined){ return; }
		// todo: 5 is an arbitrary number to speed up this algorithm
		var nodes = this.getNearestNodes(p.x, p.y, 5);
		var node, sectors;
		for(var i = 0; i < nodes.length; i++){
			node = nodes[i];
			var nodeJunction = node.junction();
			if(nodeJunction !== undefined){
				sectors = nodeJunction.sectors;
				if(sectors !== undefined && sectors.length > 0){ break; }
			}
		}
		if(sectors == undefined || sectors.length === 0){ return undefined; }
		// cross product on each edge pair
		var anglesInside = sectors.filter(function(el:PlanarSector){ 
			var pts = el.endPoints;
			var cross0 = (p.y - node.y) * (pts[1].x - node.x) - 
						 (p.x - node.x) * (pts[1].y - node.y);
			var cross1 = (p.y - pts[0].y) * (node.x - pts[0].x) - 
						 (p.x - pts[0].x) * (node.y - pts[0].y);
			if (cross0 < 0 || cross1 < 0){ return false; }
			return true;
		});
		if(anglesInside.length > 0) return anglesInside[0];
		return undefined;
	}
	*/

	///////////////////////////////////////////////
	// FACE
	///////////////////////////////////////////////

	faceArrayDidChange(){for(var i=0; i<this.faces.length; i++){this.faces[i].index=i;}}

	generateFaces():PlanarFace[]{
		this.faces = [];
		this.clean();
		for(var i = 0; i < this.nodes.length; i++){
			var adjacentFaces = this.nodes[i].adjacentFaces();
			for(var af = 0; af < adjacentFaces.length; af++){
				var duplicate = false;
				for(var tf = 0; tf < this.faces.length; tf++){
					if(this.faces[tf].equivalent(adjacentFaces[af])){ duplicate = true; break; }
				}
				if(!duplicate){ this.faces.push(adjacentFaces[af]); }
			}
		}
		this.faceArrayDidChange();
		return this.faces;
	}

	// adjacentFaceTree(start:PlanarFace):any{
	// 	this.faceArrayDidChange();
	// 	// this will keep track of faces still needing to be visited
	// 	var faceRanks = [];
	// 	for(var i = 0; i < this.faces.length; i++){ faceRanks.push(undefined); }
	// 	function allFacesRanked():boolean{
	// 		// return faceRanks.filter(function(el){return el === undefined}).length == 0;
	// 		for(var i = 0; i < faceRanks.length; i++){
	// 			if(faceRanks[i] === undefined){ return false; }
	// 		}
	// 		return true;
	// 	}

	// 	var rank = [];
	// 	var rankI = 0;
	// 	rank.push([start]);
	// 	// rank 0 is an array of 1 face, the start face
	// 	faceRanks[start.index] = {rank:0, parents:[], face:start};

	// 	// loop
	// 	var safety = 0;
	// 	while(!allFacesRanked() && safety < this.faces.length+1){
	// 		rankI += 1;
	// 		rank[rankI] = [];
	// 		for(var p = 0; p < rank[rankI-1].length; p++){
	// 			var adjacent:PlanarFace[] = rank[rankI-1][p].edgeAdjacentFaces();
	// 			for(var i = 0; i < adjacent.length; i++){
	// 				// add a face if it hasn't already been found
	// 				if(faceRanks[adjacent[i].index] === undefined){
	// 					rank[rankI].push(adjacent[i]);
	// 					var parentArray = faceRanks[ rank[rankI-1][p].index ].parents.slice();
	// 					// add nearest parent to beginning of array
	// 					parentArray.unshift( rank[rankI-1][p] );
	// 					// OR, add them to the beginning
	// 					// parentArray.push( rank[rankI-1][p] );
	// 					faceRanks[adjacent[i].index] = {rank:rankI, parents:parentArray, face:adjacent[i]};
	// 				}
	// 			}
	// 		}
	// 		safety++;
	// 	}
	// 	for(var i = 0; i < faceRanks.length; i++){
	// 		if(faceRanks[i] !== undefined && faceRanks[i].parents !== undefined && faceRanks[i].parents.length > 0){
	// 			var parent = <PlanarFace>faceRanks[i].parents[0];
	// 			var edge = <PlanarEdge>parent.commonEdge(faceRanks[i].face);
	// 			var m = edge.reflectionMatrix();
	// 			faceRanks[i].matrix = m;
	// 		}
	// 	}
	// 	for(var i = 0; i < rank.length; i++){
	// 		for(var j = 0; j < rank[i].length; j++){
	// 			var parents = <PlanarFace[]>faceRanks[ rank[i][j].index ].parents;
	// 			var matrix = faceRanks[ rank[i][j].index ].matrix;
	// 			if(parents !== undefined && m !== undefined && parents.length > 0){
	// 				var parentGlobal = faceRanks[ parents[0].index ].global;
	// 				if(parentGlobal !== undefined){
	// 					// faceRanks[ rank[i][j].index ].global = matrix.mult(parentGlobal.copy());
	// 					faceRanks[ rank[i][j].index ].global = parentGlobal.copy().mult(matrix);
	// 				} else{
	// 					faceRanks[ rank[i][j].index ].global = matrix.copy();
	// 				}
	// 			} else{
	// 				faceRanks[ rank[i][j].index ].matrix = new Matrix();
	// 				faceRanks[ rank[i][j].index ].global = new Matrix();
	// 			}
	// 		}
	// 	}
	// 	return {rank:rank, faces:faceRanks};
	// }

	///////////////////////////////////////////////////////////////////////
	// possibly useless. consider deleting
	edgeExistsThroughPoints(a:M.XY, b:M.XY):boolean{
		for(var i = 0; i < this.edges.length; i++){
				console.log(a);
				console.log(this.edges[i].nodes[0]);
			if( (a.equivalent(this.edges[i].nodes[0]) && b.equivalent(this.edges[i].nodes[1])) || 
				(a.equivalent(this.edges[i].nodes[1]) && b.equivalent(this.edges[i].nodes[0])) ){
				return true;
			}
		}
		return false;
	}

	fewestPolylines():M.Polyline[]{
		var cp = this.copy();
		cp.clean();
		cp.removeIsolatedNodes();
		var paths:M.Polyline[] = [];
		while(cp.edges.length > 0){
			var node = cp.nodes[0];
			var adj = <PlanarNode[]>node.adjacentNodes();
			var polyline = new M.Polyline();
			// var path = [];
			if(adj.length === 0){
				// this shouldn't ever happen
				cp.removeIsolatedNodes();
			}else{
				var nextNode = adj[0];
				var edge = cp.getEdgeConnectingNodes(node, nextNode);
				polyline.nodes.push( new M.XY(node.x, node.y) );
				// remove edge
				cp.edges = cp.edges.filter(function(el){
					return !((el.nodes[0] === node && el.nodes[1] === nextNode) ||
					         (el.nodes[0] === nextNode && el.nodes[1] === node) );
				});
				cp.removeIsolatedNodes();
				node = nextNode;
				adj = [];
				if(node !== undefined){ adj = <PlanarNode[]>node.adjacentNodes(); }
				while(adj.length > 0){
					nextNode = adj[0];
					polyline.nodes.push( new M.XY(node.x, node.y) );
					cp.edges = cp.edges.filter(function(el){
						return !((el.nodes[0] === node && el.nodes[1] === nextNode) ||
						         (el.nodes[0] === nextNode && el.nodes[1] === node) );
					});
					cp.removeIsolatedNodes();
					node = nextNode;
					adj = <PlanarNode[]>node.adjacentNodes();
				}
				polyline.nodes.push(new M.XY(node.x, node.y));
			}
			paths.push(polyline);
		}
		return paths;
	}
}


