// planarGraph.js
// a planar graph data structure containing edges and vertices in 2D space
// MIT open source license, Robby Kraft

/// <reference path="graph.ts" />
/// <reference path="geometry.ts" />

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

/** a survey of the objects removed from a planar graph after a cleaning-type function is performed */
class PlanarClean extends GraphClean{
	edges:{total:number, duplicate:number, circular:number};
	nodes:{
		total:number;
		fragment:XY[];  // nodes added at intersection of 2 lines, from fragment()
		collinear:XY[]; // nodes removed due to being collinear
		duplicate:XY[]; // nodes removed due to occupying the same space
		isolated:number;  // nodes removed for being unattached to any edge
	}
	constructor(numNodes?:number, numEdges?:number){
		super(numNodes, numEdges);
		this.edges = {total:0,duplicate:0, circular:0};
		this.nodes = {
			total:0,
			isolated:0,
			fragment:[],
			collinear:[],
			duplicate:[]
		}
		if(numNodes != undefined){ this.nodes.total += numNodes; }
		if(numEdges != undefined){ this.edges.total += numEdges; }
	}
	fragmentedNodes(nodes:XY[]):PlanarClean{
		this.nodes.fragment = nodes; this.nodes.total += nodes.length; return this;
	}
	collinearNodes(nodes:XY[]):PlanarClean{
		this.nodes.collinear = nodes; this.nodes.total += nodes.length; return this;
	}
	duplicateNodes(nodes:XY[]):PlanarClean{
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
		if(planarReport.nodes.fragment != undefined){ 
			this.nodes.fragment = this.nodes.fragment.concat(planarReport.nodes.fragment); 
		}
		if(planarReport.nodes.collinear != undefined){ 
			this.nodes.collinear = this.nodes.collinear.concat(planarReport.nodes.collinear);
		}
		if(planarReport.nodes.duplicate != undefined){ 
			this.nodes.duplicate = this.nodes.duplicate.concat(planarReport.nodes.duplicate);
		}
		return this;
	}
}

class PlanarNode extends GraphNode implements XY{

	graph:PlanarGraph;
	x:number;
	y:number;

	// for speeding up algorithms, temporarily store information here
	cache:object = {};

	copy():XY{ return new XY(this.x, this.y); }

	/** Returns an array of edges that contain this node, sorted counter-clockwise
	 * @returns {PlanarEdge[]} array of adjacent edges
	 * @example
	 * var adjacent = node.adjacentEdges()
	 */
	adjacentEdges():PlanarEdge[]{
		// TODO: are these increasing in the right direction?
		var adjacent = this.graph.edges
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
		//WTF why did I write this? is it useful for something? why would edges be duplicated
		// for(var i = 0; i < adjacent.length; i++){
		// 	var el = adjacent[ i ];
		// 	var nextEl = adjacent[ (i+1)%adjacent.length ];
		// 	if(el === nextEl){ adjacent.splice(i,1); }
		// }
		return adjacent;
	}
	/** Returns an array of faces containing this node
	 * @returns {PlanarFace[]} array of adjacent faces
	 * @example
	 * var adjacent = node.adjacentFaces()
	 */
	adjacentFaces():PlanarFace[]{
		if(this.graph.dirty){ this.graph.flatten(); }
		return this.graph.faces.filter(function(face){
			return face.nodes.filter(function(n){return n === this;},this).length > 0;
		},this);
	}
	/** Adjacent nodes and edges sorted clockwise around this node */
	junction():PlanarJunction{
		if(this.graph.dirty){ this.graph.flatten(); }
		return this.graph.junctions.filter(function(junction){
			return junction.origin === this;
		},this).shift();
	}
	interiorAngles():number[]{ return this.junction().interiorAngles(); }
	// implements XY
	// todo: probably need to break apart XY and this. this modifies the x and y in place. XY returns a new one and doesn't modify the current one in place
	position(x:number, y:number):PlanarNode{ this.x = x; this.y = y; return this; }
	translate(dx:number, dy:number):PlanarNode{ this.x += dx; this.y += dy; return this;}
	normalize():PlanarNode { var m = this.magnitude(); this.x /= m; this.y /= m; return this; }
	dot(point:XY):number { return this.x * point.x + this.y * point.y; }
	cross(vector:XY):number{ return this.x*vector.y - this.y*vector.x; }
	magnitude():number { return Math.sqrt(this.x * this.x + this.y * this.y); }
	distanceTo(a:XY):number{ return Math.sqrt( Math.pow(this.x-a.x,2) + Math.pow(this.y-a.y,2) ); }
	equivalent(point:XY, epsilon?:number):boolean{
		return new XY(this.x, this.y).equivalent(point, epsilon);
	}
	transform(matrix):PlanarNode{
		var xx = this.x; var yy = this.y;
		this.x = xx * matrix.a + yy * matrix.c + matrix.tx;
		this.y = xx * matrix.b + yy * matrix.d + matrix.ty;
		return this;
	}
	rotate90():PlanarNode { var x = this.x; this.x = -this.y; this.y = x; return this; }
	rotate180():PlanarNode { this.x = -this.x; this.y = -this.y; return this; }
	rotate270():PlanarNode { var x = this.x; this.x = this.y; this.y = -x; return this; }
	rotate(angle:number, origin?:XY):PlanarNode{
		var rotated = new XY(this.x, this.y).rotate(angle, origin);
		return this.position(rotated.x, rotated.y);
	}
	lerp(point:XY, pct:number):PlanarNode{
		var translated = new XY(this.x, this.y).lerp(point, pct);
		return this.position(translated.x, translated.y);
	}
	angleLerp(point:XY, pct:number):PlanarNode{
		var translated = new XY(this.x,this.y).angleLerp(point,pct);
		return this.position(translated.x, translated.y);
	}
	/** reflects about a line that passes through 'a' and 'b' */
	reflect(line:any):PlanarNode{
		var reflected = new XY(this.x, this.y).reflect(line);
		return this.position(reflected.x, reflected.y);
	}
	scale(magnitude:number):PlanarNode{ this.x*=magnitude; this.y*=magnitude; return this; }
	add(point:XY):PlanarNode{ this.x+=point.x; this.y+=point.y; return this; }
	subtract(sub:XY):PlanarNode{ this.x-=sub.x; this.y-=sub.y; return this; }
	multiply(m:XY):PlanarNode{ this.x*=m.x; this.y*=m.y; return this; }
	midpoint(other:XY):XY{ return new XY((this.x+other.x)*0.5, (this.y+other.y)*0.5); }
	abs():PlanarNode{ this.x = Math.abs(this.x), this.y = Math.abs(this.y); return this; }
	commonX(p:XY, epsilon?:number):boolean{return new XY(this.x,this.y).commonX(new XY(p.x,p.y),epsilon);}
	commonY(p:XY, epsilon?:number):boolean{return new XY(this.x,this.y).commonY(new XY(p.x,p.y),epsilon);}
}

class PlanarEdge extends GraphEdge implements Edge{

	graph:PlanarGraph;
	nodes:[PlanarNode,PlanarNode];

	/** Returns an array of faces that contain this edge
	 * @returns {PlanarFace[]} array of adjacent faces
	 * @example
	 * var adjacent = edge.adjacentFace()
	 */
	adjacentFaces():PlanarFace[]{
		if(this.graph.dirty){ this.graph.flatten(); }
		return this.graph.faces.filter(function(face){
			return face.edges.filter(function(edge){return edge === this;},this).length > 0;
		},this);
	}
	/** Returns an array of edges that cross this edge. These are edges which are considered "invalid"
	 * @returns {{edge:PlanarEdge, point:XY}[]} array of objects containing the crossing edge and point of intersection
	 * @example
	 * var edges = edge.crossingEdges()
	 */
	crossingEdges():{edge:PlanarEdge, point:XY}[]{
		// optimize by excluding all edges outside of the quad space occupied by this edge
		var minX = (this.nodes[0].x < this.nodes[1].x) ? this.nodes[0].x : this.nodes[1].x;
		var maxX = (this.nodes[0].x > this.nodes[1].x) ? this.nodes[0].x : this.nodes[1].x;
		var minY = (this.nodes[0].y < this.nodes[1].y) ? this.nodes[0].y : this.nodes[1].y;
		var maxY = (this.nodes[0].y > this.nodes[1].y) ? this.nodes[0].y : this.nodes[1].y;
		return this.graph.edges
			.filter(function(el:PlanarEdge){ return !(
				(el.nodes[0].x < minX && el.nodes[1].x < minX) ||
				(el.nodes[0].x > maxX && el.nodes[1].x > maxX) ||
				(el.nodes[0].y < minY && el.nodes[1].y < minY) ||
				(el.nodes[0].y > maxY && el.nodes[1].y > maxY)
				)},this)
			.filter(function(el:PlanarEdge){ return this !== el}, this)
			.map(function(el:PlanarEdge){ return this.intersection(el) }, this)
			.filter(function(el:{edge:PlanarEdge, point:XY}){ return el != undefined})
			.sort(function(a:{edge:PlanarEdge, point:XY},b:{edge:PlanarEdge, point:XY}){
				if(a.point.commonX(b.point)){ return a.point.y-b.point.y; }
				return a.point.x-b.point.x;
			});
	}
	// implements Edge (implements LineType)
	length():number{ return this.nodes[0].distanceTo(this.nodes[1]); }
	vector(originNode?:PlanarNode):XY{
		var origin = originNode || this.nodes[0];
		var otherNode = <PlanarNode>this.otherNode(origin);
		return new XY(otherNode.x, otherNode.y).subtract(origin);
	}
	parallel(edge:PlanarEdge, epsilon?:number):boolean{
		return new Edge(this).parallel(new Edge(edge), epsilon);
	}
	collinear(point:XY, epsilon?:number):boolean{
		return new Edge(this).collinear(point, epsilon);
	}
	equivalent(e:PlanarEdge, epsilon?:number):boolean{ return this.isSimilarToEdge(e); }
	intersection(edge:Edge, epsilon?:number):{edge:PlanarEdge, point:XY}{
		// todo: should intersecting adjacent edges return the point in common they have with each other or register no intersection?
		if(edge instanceof PlanarEdge && this.isAdjacentToEdge(edge)){ return undefined; }
		var a = new Edge(this.nodes[0].x, this.nodes[0].y, this.nodes[1].x, this.nodes[1].y);
		var b = new Edge(edge.nodes[0].x, edge.nodes[0].y, edge.nodes[1].x, edge.nodes[1].y);
		var intersect = a.intersection(b,epsilon); //intersectionEdgeEdge(a, b, epsilon);
		if(intersect !== undefined && 
		 !(intersect.equivalent(this.nodes[0], epsilon) || intersect.equivalent(this.nodes[1], epsilon))){
		 	var pe = <PlanarEdge>edge;
			return {'edge':pe, 'point':intersect};
		}
	}
	// returns the matrix representation form of this edge as the line of reflection
	reflectionMatrix():Matrix{ return new Edge(this.nodes[0], this.nodes[1]).reflectionMatrix(); }
	nearestPoint(point:XY):XY{
		var answer = this.nearestPointNormalTo(point);
		if(answer !== undefined){ return answer; }
		return this.nodes
			.map(function(el){ return {point:el,distance:el.distanceTo(point)}; },this)
			.sort(function(a,b){ return a.distance - b.distance; })
			.shift()
			.point;
	}
	nearestPointNormalTo(point:XY):XY{
		var p = this.nodes[0].distanceTo(this.nodes[1]);
		var u = ((point.x-this.nodes[0].x)*(this.nodes[1].x-this.nodes[0].x) + (point.y-this.nodes[0].y)*(this.nodes[1].y-this.nodes[0].y)) / (Math.pow(p,2));
		if(u < 0 || u > 1.0){return undefined;}
		return new XY(this.nodes[0].x + u*(this.nodes[1].x-this.nodes[0].x), this.nodes[0].y + u*(this.nodes[1].y-this.nodes[0].y));
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
	midpoint():XY { return new XY( 0.5*(this.nodes[0].x + this.nodes[1].x),
	                               0.5*(this.nodes[0].y + this.nodes[1].y));}
	perpendicularBisector():Line{ return new Line(this.midpoint(), this.vector().rotate90()); }
	infiniteLine():Line{
		var origin = new XY(this.nodes[0].x, this.nodes[0].y);
		var vector = new XY(this.nodes[1].x, this.nodes[1].y).subtract(origin);
		return new Line(origin, vector);
	}
}

class PlanarFace{
	// this library is counting on the edges and nodes to be stored in clockwise winding
	graph:PlanarGraph;
	nodes:PlanarNode[];
	edges:PlanarEdge[];

	angles:number[];
	index:number;

	constructor(graph:PlanarGraph){
		this.graph = graph;
		this.nodes = [];
		this.edges = [];
		this.angles = [];
	}
	sectors():PlanarSector[]{
		return this.graph.sectors.filter(function(sector){
			return this.nodes.filter(function(node){ return node === sector.origin; },this).length > 0;
		},this);
	}
	/** This compares two faces by checking their nodes are the same, and in the same order.
	 * @returns {boolean} whether two faces are equivalent or not
	 * @example
	 * var equivalent = face.equivalent(anotherFace)
	 */
	equivalent(face:PlanarFace):boolean{
		// quick check, if number of nodes differs, can't be equivalent
		if(face.nodes.length != this.nodes.length){return false;}
		var iFace = undefined;
		face.nodes.forEach(function(n,i){ if(n === this.nodes[0]){ iFace = i; return; }},this);
		if(iFace == undefined){return false;}
		for(var i = 0; i < this.nodes.length; i++){
			var iFaceMod = (iFace + i) % this.nodes.length;
			if(this.nodes[i] !== face.nodes[iFaceMod]){return false;}
		}
		return true;
	}
	/** Returns an array of edges that are shared among both faces.
	 * @returns {PlanarEdge[]} array of edges in common
	 * @example
	 * var edges = face.commonEdges(anotherFace)
	 */
	commonEdges(face:PlanarFace):PlanarEdge[]{
		return this.edges.filter(function(edge){
			return face.edges.filter(function(fe){ return fe === edge; },this).length > 0;
		},this);
	}
	/** Returns an array of edges in this face which are not shared by the other face.
	 * @returns {PlanarEdge[]} array of edges not in common
	 * @example
	 * var edges = face.uncommonEdges(anotherFace)
	 */
	uncommonEdges(face:PlanarFace):PlanarEdge[]{
		return this.edges.filter(function(edge){
			return face.edges.filter(function(fe){ return fe === edge; },this).length == 0;
		},this);
	}
	/** Returns an array of adjacent faces which share one or more edges in common with this face.
	 * @returns {PlanarFace[]} array of adjacent faces
	 * @example
	 * var faces = face.edgeAdjacentFaces()
	 */
	edgeAdjacentFaces():PlanarFace[]{
		var allFaces = this.graph.faces.filter(function(el){return !this.equivalent(el);},this);
		return this.edges.map(function(ed){
			for(var i = 0; i < allFaces.length; i++){
				var adjArray = allFaces[i].edges.filter(function(ef){return ed === ef;});
				if(adjArray.length > 0){ return allFaces[i]; }
			}
		}, this).filter(function(el){return el !== undefined;});
	}
	/** Returns an array of adjacent faces which share one or more nodes in common with this face.
	 * @returns {PlanarFace[]} array of adjacent faces
	 * @example
	 * var faces = face.nodeAdjacentFaces()
	 */
	nodeAdjacentFaces():PlanarFace[]{
		var allFaces = this.graph.faces.filter(function(el){return !this.equivalent(el);},this);
		return this.nodes.map(function(node){
			for(var i = 0; i < allFaces.length; i++){
				var adjArray = allFaces[i].nodes.filter(function(nf){return node === nf;});
				if(adjArray.length > 0){ return allFaces[i]; }
			}
		}, this).filter(function(el){return el !== undefined;});
	}
	/** Tests whether or not a point is contained inside a face. This is counting on the face to be convex.
	 * @returns {boolean} whether the point is inside the face or not
	 * @example
	 * var isInside = face.contains( {x:0.5, y:0.5} )
	 */
	contains(point:XY):boolean{
		for(var i = 0; i < this.nodes.length; i++){
			var thisNode = this.nodes[ i ];
			var nextNode = this.nodes[ (i+1)%this.nodes.length ];
			var a = new XY(nextNode.x - thisNode.x, nextNode.y - thisNode.y);
			var b = new XY(point.x - thisNode.x, point.y - thisNode.y);
			if (a.cross(b) < 0){ return false; }
		}
		return true;
	}
	/** Apply a matrix transform to this face by transforming the location of its points.
	 * @example
	 * face.transform(matrix)
	 */
	transform(matrix){ this.nodes.forEach(function(node){node.transform(matrix);},this); }
	/** Calculates the signed area of a face. This requires the face be non-intersecting.
	 * @returns {number} the area of the face
	 * @example
	 * var area = face.signedArea()
	 */
	signedArea():number{
		return 0.5 * this.nodes.map(function(el,i){
			var nextEl = this.nodes[ (i+1)%this.nodes.length ];
			return el.x*nextEl.y - nextEl.x*el.y;
		},this)
		.reduce(function(prev, cur){ return prev + cur; },0);
	}
	/** Calculates the centroid or the center of mass of the polygon.
	 * @returns {XY} the location of the centroid
	 * @example
	 * var centroid = face.centroid()
	 */
	centroid():XY{
		return this.nodes.map(function(el,i){
			var nextEl = this.nodes[ (i+1)%this.nodes.length ];
			var mag = el.x*nextEl.y - nextEl.x*el.y;
			return new XY((el.x+nextEl.x)*mag, (el.y+nextEl.y)*mag);
		},this)
		.reduce(function(prev:XY,current:XY){ return prev.add(current); },new XY(0,0))
		.scale(1/(6 * this.signedArea()));
	}
	/** Calculates the center of the bounding box made by the edges of the polygon.
	 * @returns {XY} the location of the center of the bounding box
	 * @example
	 * var boundsCenter = face.center()
	 */
	center():XY{
		var xMin = Infinity, xMax = 0, yMin = Infinity, yMax = 0;
		for(var i = 0; i < this.nodes.length; i++){ 
			if(this.nodes[i].x > xMax){ xMax = this.nodes[i].x; }
			if(this.nodes[i].x < xMin){ xMin = this.nodes[i].x; }
			if(this.nodes[i].y > yMax){ yMax = this.nodes[i].y; }
			if(this.nodes[i].y < yMin){ yMin = this.nodes[i].y; }
		}
		return new XY(xMin+(xMax-xMin)*0.5, yMin+(yMax-yMin)*0.5);
	}

	// [
	// 	[CreaseFace]
	// 	[CreaseFace, CreaseFace]
	// 	[CreaseFace, CreaseFace, CreaseFace, CreaseFace]
	// 	[CreaseFace, CreaseFace]
	// 	[CreaseFace]
	// ]
	adjacentFaceArray():{"face":PlanarFace, "parent":PlanarFace}[][]{
		if(this.graph.dirty){ this.graph.generateFaces(); } 
		else{ this.graph.faceArrayDidChange(); }
		var current = this;
		var visited:PlanarFace[] = [current];
		var list:{"face":PlanarFace,"parent":PlanarFace}[][] = [[{"face":current,"parent":undefined}]];
		do{
			var totalRoundAdjacent = [];
			list[ list.length-1 ].forEach(function(current:{"face":PlanarFace,"parent":PlanarFace}){
				totalRoundAdjacent = totalRoundAdjacent.concat(current.face.edgeAdjacentFaces()
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
		if(list.length > 0 && list[ list.length-1 ].length == 0){ list.pop(); }
		return list;
	}

	adjacentFaceTree():Tree<PlanarFace>{
		var array = this.adjacentFaceArray();
		array[0][0]["tree"] = new Tree<PlanarFace>(array[0][0].face);
		for(var r = 1; r < array.length; r++){
			for(var c = 0; c < array[r].length; c++){
				var newNode = new Tree<PlanarFace>(array[r][c].face);
				newNode.parent = array[r][c]["parent"]["tree"];
				newNode.parent.children.push(newNode);
				array[r][c]["tree"] = newNode
			}
		}
		return array[0][0]["tree"];
	}

	// adjacentFaceMatrices(){
	// 	var array = this.adjacentFaceArray();
	// 	array[0][0]["matrix"] = new Matrix();
	// 	for(var r = 1; r < array.length; r++){
	// 		for(var c = 0; c < array[r].length; c++){
	// 			var localMatrix = array[r][c].face.commonEdges(array[r][c]['parent']['face']).shift().reflectionMatrix();
	// 			var pObj = array[r][c]["parent"];
	// 			array[r][c]["local"] = localMatrix;
	// 			array[r][c]["matrix"] = pObj["matrix"].mult(localMatrix);
	// 		}
	// 	}
	// 	return array;
	// }

}

/** a PlanarSector is defined by 2 unique edges and 3 nodes (one common, 2 endpoints) 
 *  clockwise order is required
 *  the interior angle is measured clockwise from the 1st edge (edge[0]) to the 2nd
 */
class PlanarSector extends Sector{
	// the node in common with the edges
	origin:PlanarNode;
	// the indices of these 2 nodes directly correlate to 2 edges' indices
	edges:[PlanarEdge, PlanarEdge];
	endPoints:[PlanarNode, PlanarNode];

	index:number;
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
	equivalent(a:PlanarSector):boolean{
		return( (a.edges[0].isSimilarToEdge(this.edges[0]) &&
		         a.edges[1].isSimilarToEdge(this.edges[1])) ||
		        (a.edges[0].isSimilarToEdge(this.edges[1]) &&
		         a.edges[1].isSimilarToEdge(this.edges[0])));
	}
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

class PlanarJunction{

	origin:PlanarNode;
	// sectors and edges are sorted clockwise
	sectors:PlanarSector[];
	edges:PlanarEdge[];
	// index of this in graph.junctions[] array
	index:number;
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
			return new this.origin.graph.sectorType(el, nextEl);
		},this);
		// this.edges = this.sectors.map(function(el:PlanarSector){return el.edges[0];});
	}

	/** Returns an array of nodes, the endpoints of the junctions edges, sorted clockwise.
	 * @returns {PlanarNode[]} array of nodes
	 * @example
	 * var endNodes = junction.nodes()
	 */
	nodes():PlanarNode[]{
		return this.edges.map(function(edge){return <PlanarNode>edge.otherNode(this.origin);},this);
	}
	/** Returns an array of faces that encircle this junction, or, contain this junction's origin node. These are not sorted in any particular way.
	 * @returns {PlanarFace[]} array of faces
	 * @example
	 * var faces = junction.faces()
	 */
	faces():PlanarFace[]{
		if(this.origin.graph.dirty){ this.origin.graph.flatten(); }
		return this.origin.graph.faces.filter(function(face){
			return face.nodes.filter(function(node){return node === this.origin;},this).length > 0;
		},this);
	}
	edgeAngles():number[]{
		return this.nodes()
			.map(function(node){return new XY(node.x,node.y).subtract(this.origin);})
			.map(function(vec){return Math.atan2(vec.y, vec.x);},this);
	}
	edgeVectorsNormalized():XY[]{
		return this.edges.map(function(el){return el.vector(this.origin).normalize();},this);
	}
	sectorWithEdges(a:PlanarEdge, b:PlanarEdge):Sector{
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
}

class PlanarGraph extends Graph{

	nodes:PlanarNode[];
	edges:PlanarEdge[];
	faces:PlanarFace[];

	junctions:PlanarJunction[];  // 1:1 map to nodes array indices
	sectors:PlanarSector[];

	// when subclassed, base types are overwritten
	nodeType = PlanarNode;
	edgeType = PlanarEdge;
	faceType = PlanarFace;
	sectorType = PlanarSector;
	junctionType = PlanarJunction;

	// if nodes have been moved, re-require call to flatten()
	dirty:boolean;

	// not using these yet
	properties = {"optimization":0}; // we need something to be able to set to skip over functions
	didChange:(event:object)=>void;

	constructor(){ super(); this.clear(); }

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

	flatten(epsilon?:number):PlanarClean{
		this.dirty = false;
		var report = this.clean(epsilon);
		this.generateJunctions();
		this.generateFaces();
		return report;
	}

	///////////////////////////////////////////////
	// ADD PARTS
	///////////////////////////////////////////////

	/** Create a new isolated planar node at x,y
	 * @returns {PlanarNode} pointer to the node
	 */
	newPlanarNode(x:number, y:number):PlanarNode{
		this.dirty = true;
		return (<PlanarNode>this.newNode()).position(x, y);
	}
	/** Create two new nodes each with x,y locations and an edge between them
	 * @returns {PlanarEdge} pointer to the edge
	 */
	newPlanarEdge(x1:number, y1:number, x2:number, y2:number):PlanarEdge{
		this.dirty = true;
		var a = (<PlanarNode>this.newNode()).position(x1, y1);
		var b = (<PlanarNode>this.newNode()).position(x2, y2);
		return <PlanarEdge>this.newEdge(a, b);
	}
	/** Create one node with an x,y location and an edge between it and an existing node
	 * @returns {PlanarEdge} pointer to the edge
	 */
	newPlanarEdgeFromNode(node:PlanarNode, x:number, y:number):PlanarEdge{
		this.dirty = true;
		var newNode = (<PlanarNode>this.newNode()).position(x, y);
		return <PlanarEdge>this.newEdge(node, newNode);
	}
	/** Create one edge between two existing nodes
	 * @returns {PlanarEdge} pointer to the edge
	 */
	newPlanarEdgeBetweenNodes(a:PlanarNode, b:PlanarNode):PlanarEdge{
		this.dirty = true;
		return <PlanarEdge>this.newEdge(a, b);
	}
	/** Create one node with an angle and distance away from an existing node and make an edge between them
	 * @returns {PlanarEdge} pointer to the edge
	 */
	newPlanarEdgeRadiallyFromNode(node:PlanarNode, angle:number, length:number):PlanarEdge{
		this.dirty = true;
		var newNode = (<PlanarNode>this.copyNode(node))
					   .translate(Math.cos(angle)*length, Math.sin(angle)*length);
		return <PlanarEdge>this.newEdge(node, newNode);
	}

	///////////////////////////////////////////////
	// GET PARTS
	///////////////////////////////////////////////

	bounds():Rect{
		if(this.nodes === undefined || this.nodes.length === 0){ return undefined; }
		var minX = Infinity;
		var minY = Infinity;
		var maxX = -Infinity;
		var maxY = -Infinity;
		this.nodes.forEach(function(el){
			if(el.x > maxX){ maxX = el.x; }
			if(el.x < minX){ minX = el.x; }
			if(el.y > maxY){ maxY = el.y; }
			if(el.y < minY){ minY = el.y; }
		});
		return new Rect(minX, minY, maxX-minX, maxY-minY);
	}

	/** Locate the nearest node, edge, face, junction, sector to a supplied point
	 * @returns {{'node':PlanarNode,'edge':PlanarEdge,'face':PlanarFace,'junction':PlanarJunction,'sector':PlanarSector}} object with keys node, edge, face, junction, sector with their objects, or undefined if not found
	 */
	nearest(a:any,b:any):{'node':PlanarNode,'edge':PlanarEdge,'face':PlanarFace,'junction':PlanarJunction,'sector':PlanarSector}{
		var point = gimme1XY(a,b);
		var face = this.faceContainingPoint(point);
		if(face !== undefined){
			var node:PlanarNode = face.nodes.slice().sort(function(a:PlanarNode, b:PlanarNode){
				return a.distanceTo(point) - b.distanceTo(point);
			})[0];
			var edge:PlanarEdge = face.edges.slice().sort(function(a:PlanarEdge, b:PlanarEdge){
				return a.nearestPoint(point).distanceTo(point) - b.nearestPoint(point).distanceTo(point);
			})[0];
			var junction = node.junction();
			var sector = face.sectors().filter(function(el){ return el.origin === node; },this).shift();
		} else{
			var edgeArray = this.edges
				.map(function(edge:PlanarEdge){
					return {edge:edge, distance:edge.nearestPoint(point).distanceTo(point)};
				},this)
				.sort(function(a,b){
					return a.distance - b.distance;
				})[0];
			var edge = (edgeArray != undefined) ? edgeArray.edge : undefined;
			var node = (edge !== undefined) ? edge.nodes
				.slice().sort(function(a,b){ return a.distanceTo(point) - b.distanceTo(point);})
				[0] : undefined;
			var junction = (node !== undefined) ? node.junction() : undefined;
			var sector = (junction !== undefined) ? junction.sectors.filter(function(el){
				return el.contains(point);
			},this).shift() : undefined;
		}
		return {
			'node':node,
			'edge':edge,
			'face':face,
			'junction':junction,
			'sector':sector
		};
	}

	/** Without changing the graph, this function collects the XY locations of every point that two edges cross each other.
	 * @returns {XY[]} array of XY locations of all the intersection locations
	 */
	getEdgeIntersections(epsilon?:number):XY[]{
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
						if(intersection.point.equivalent(intersections[k], epsilon)){ copy = true; break;}
					}
					if(!copy){ intersections.push(intersection.point); }
				}
			}
		}
		return intersections;
	}

	private faceContainingPoint(point:XY):PlanarFace{
		for(var f = 0; f < this.faces.length; f++){
			if(this.faces[f].contains(point)){
				return this.faces[f];
			}
		}
	}

	edgeConnectingPoints(a:any, b:any, c?:any, d?:any):PlanarEdge{
		var p = gimme2XY(a,b,c,d);
		if(p === undefined){ return; }
		var nears = p.map(function(point){
			return this.nodes
				.map(function(el){ return{'n':el, 'd':point.distanceTo(el)}; },this)
				.sort(function(a,b){ return a.d - b.d; })
				.map(function(el){return a.n;},this);
		},this);
		// nears[0] is points sorted nearest to p[0], nears[1] is nearst to p[1]
		if(nears[0].length == 0 || nears[1].length == 0){ return; }
		var edge = <PlanarEdge>this.getEdgeConnectingNodes(nears[0][0], nears[1][0]);
		if(edge !== undefined) return edge;
		// check more
		for(var cou = 3; cou < 20; cou+=3){
			// three at a time, check one against one
			for(var i = 0; i < nears[0].length; i++){
				for(var j = 0; j < nears[1].length; j++){
					if(i !== j){
						var edge = <PlanarEdge>this.getEdgeConnectingNodes(nears[0][i], nears[1][j]);
						if(edge !== undefined) return edge;
					}
				}
			}
		}
	}
	///////////////////////////////////////////////
	// REMOVE PARTS (TARGETS KNOWN)
	///////////////////////////////////////////////

	/** Removes all nodes, edges, and faces, returning the graph to it's original state */
	clear():PlanarGraph{
		this.nodes = [];
		this.edges = [];
		this.faces = [];
		this.sectors = [];
		this.junctions = [];
		return this;
	}

	/** Removes an edge and also attempt to remove the two nodes left behind if they are otherwise unused
	 * @returns {boolean} if the edge was removed
	 */
	removeEdge(edge:PlanarEdge):PlanarClean{
		var len = this.edges.length;
		var endNodes = [edge.nodes[0], edge.nodes[1]];
		this.edges = this.edges.filter(function(el){ return el !== edge; });
		return new PlanarClean(0, len - this.edges.length)
			.join(this.cleanNodeIfUseless(endNodes[0]))
			.join(this.cleanNodeIfUseless(endNodes[1]))
		// todo: this is hitting the same node repeatedly from different sides, so keeping track of nodes is not working
		// var report = new PlanarCleanReport();
		// var a = this.cleanNodeIfUseless(endNodes[0]);
		// var b = this.cleanNodeIfUseless(endNodes[1]);
		// console.log(a +  " " + b)
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
		return new PlanarClean(0, len - this.edges.length)
			.join(this.cleanNodeIfUseless(node1))
			.join(this.cleanNodeIfUseless(node2));
	}

	/** Remove a node if it is either unconnected to any edges, or is in the middle of 2 collinear edges
	 * @returns {number} how many nodes were removed
	 */
	cleanNodeIfUseless(node:PlanarNode):PlanarClean{
		var edges = node.adjacentEdges();
		switch (edges.length){
			case 0:
				// return <PlanarClean>this.removeNode(node);
				this.nodes = this.nodes.filter(function(el){ return el !== node; });
				this.nodeArrayDidChange();
				return new PlanarClean(1, 0);
			case 2:
				var farNodes = [<PlanarNode>(edges[0].uncommonNodeWithEdge(edges[1])), 
								<PlanarNode>(edges[1].uncommonNodeWithEdge(edges[0]))];
				if(farNodes[0] === undefined || farNodes[1] === undefined){ return new PlanarClean(); }
				var span = new Edge(farNodes[0].x, farNodes[0].y, farNodes[1].x, farNodes[1].y);
				if(span.collinear(node)){
					edges[0].nodes = [farNodes[0], farNodes[1]];
					this.edges = this.edges.filter(function(el){ return el !== edges[1]; });
					// this.removeNode(node);
					this.nodes = this.nodes.filter(function(el){ return el !== node; });
					this.nodeArrayDidChange();
					this.edgeArrayDidChange();
					return new PlanarClean(1, 1);
				}
			default: return new PlanarClean();
		}
	}

	///////////////////////////////////////////////
	// REMOVE PARTS (SEARCH REQUIRED TO LOCATE)
	///////////////////////////////////////////////

	/** Removes all isolated nodes and performs cleanNodeIfUseless() on every node
	 * @returns {PlanarClean} how many nodes were removed
	 */
	cleanAllUselessNodes():PlanarClean{
		// prepare adjacency information
		this.nodes.forEach(function(el){ el.cache['adjE'] = []; });
		this.edges.forEach(function(el){ 
			el.nodes[0].cache['adjE'].push(el);
			el.nodes[1].cache['adjE'].push(el);
		});
		var report = new PlanarClean().join( this.removeIsolatedNodes() );
		this.nodeArrayDidChange();
		this.edgeArrayDidChange();
		for(var i = this.nodes.length-1; i >= 0; i--){
			var edges = this.nodes[i].cache['adjE'];
			switch (edges.length){
				case 0: report.join(this.removeNode(this.nodes[i])); break;
				case 2:
					var farNodes = [<PlanarNode>(edges[0].uncommonNodeWithEdge(edges[1])), 
									<PlanarNode>(edges[1].uncommonNodeWithEdge(edges[0]))]
					var span = new Edge(farNodes[0].x, farNodes[0].y, farNodes[1].x, farNodes[1].y);
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
		this.nodes.forEach(function(el){ el.cache['adjE'] = undefined; });
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
			return new PlanarClean().duplicateNodes([new XY(nodeB.x, nodeB.y)]).join(that.cleanGraph());
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

	///////////////////////////////////////////////
	// FLATTEN, FRAGMENT, FACES
	///////////////////////////////////////////////

	generateJunctions():PlanarJunction[]{
		this.junctions = this.nodes
			.map(function(el){ return new this.junctionType(el); },this)
			.filter(function(el){ return el !== undefined; },this)
			.filter(function(el){ return el.edges.length > 0; },this);
		this.sectors = this.junctions
			.map(function(el){ return el.sectors },this)
			.reduce(function(prev, curr){ return prev.concat(curr); },[])
			.filter(function(el){ return el !== undefined; },this);
		this.junctionArrayDidChange();
		this.sectorArrayDidChange();
		return this.junctions;
	}

	generateFaces():PlanarFace[]{
		var faces:PlanarFace[] = this.edges
			.map(function(edge){
				return [this.walkClockwiseCircut(edge.nodes[0], edge.nodes[1]),
				        this.walkClockwiseCircut(edge.nodes[1], edge.nodes[0])];
			},this)
			.reduce(function(prev, curr){ return prev.concat(curr); },[])
			.filter(function(el){ return el != undefined; },this)
			.map(function(el){ return this.faceFromCircuit(el); },this)
			.filter(function(el){ return el != undefined; },this);
		// filter out duplicate faces
		var uniqueFaces:PlanarFace[] = [];
		for(var i = 0; i < faces.length; i++){
			var found = false;
			for(var j = 0; j < uniqueFaces.length; j++){
				if(faces[i].equivalent(uniqueFaces[j])){ found = true; break;}
			}
			if(!found){ uniqueFaces.push(faces[i]); }
		}
		this.faces = uniqueFaces;
		this.faceArrayDidChange();
		return this.faces;
	}

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
	private fragmentEdge(edge:PlanarEdge):PlanarClean{
		var report = new PlanarClean();
		// console.time("crossingEdge");
		var intersections:{'edge':PlanarEdge, 'point':XY}[] = edge.crossingEdges();
		// console.timeEnd("crossingEdge");
		if(intersections.length === 0) { return report; }
		report.nodes.fragment = intersections.map(function(el){ return new XY(el.point.x, el.point.y);});
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

	/** face constructor, requires result from walkClockwiseCircut()*/
	private faceFromCircuit(circuit:PlanarEdge[]):PlanarFace{
		var SUM_ANGLE_EPSILON = 0.00001;
		// var face = new this.faceType(this);
		if(circuit == undefined || circuit.length < 3){ return undefined; }
		var face = new this.faceType(this);
		face.edges = circuit;
		face.nodes = circuit.map(function(el:PlanarEdge,i){
			var nextEl = circuit[ (i+1)%circuit.length ];
			return <PlanarNode>el.uncommonNodeWithEdge( nextEl );
		});
		var angleSum = face.nodes
			.map(function(el,i){
				var el1 = face.nodes[ (i+1)%face.nodes.length ];
				var el2 = face.nodes[ (i+2)%face.nodes.length ];
				return clockwiseInteriorAngle(new XY(el.x-el1.x, el.y-el1.y), new XY(el2.x-el1.x, el2.y-el1.y));
			},this)
			.reduce(function(sum,value){ return sum + value; }, 0);
		if(face.nodes.length > 2 && Math.abs(angleSum/(face.nodes.length-2)-Math.PI) < SUM_ANGLE_EPSILON){
			return face;
		}
	}

	/** walk from node1 to node2, continue always making right-most inner angle turn. */
	private walkClockwiseCircut(node1:PlanarNode, node2:PlanarNode):PlanarEdge[]{
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
	// 			var edge = <PlanarEdge>parent.commonEdges(faceRanks[i].face).shift();
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


	/** Deep-copy the contents of this planar graph and return it as a new object
	 * @returns {PlanarGraph} 
	 */
	copy():PlanarGraph{
		this.nodeArrayDidChange();
		this.edgeArrayDidChange();
		this.faceArrayDidChange();
		// this.sectorArrayDidChange();
		// this.junctionArrayDidChange();
		var g = new PlanarGraph();
		for(var i = 0; i < this.nodes.length; i++){
			var n = g.addNode(new PlanarNode(g));
			(<any>Object).assign(n, this.nodes[i]);
			n.graph = g;  n.index = i;
		}
		for(var i = 0; i < this.edges.length; i++){
			var index = [this.edges[i].nodes[0].index, this.edges[i].nodes[1].index];
			var e = g.addEdge(new PlanarEdge(g, g.nodes[index[0]], g.nodes[index[1]]));
			(<any>Object).assign(e, this.edges[i]);
			e.graph = g;  e.index = i;
			e.nodes = [g.nodes[index[0]], g.nodes[index[1]]];
		}
		for(var i = 0; i < this.faces.length; i++){
			var f = new PlanarFace(g);
			(<any>Object).assign(f, this.faces[i]);
			for(var j=0;j<this.faces[i].nodes.length;j++){f.nodes.push(f.nodes[this.faces[i].nodes[j].index]);}
			for(var j=0;j<this.faces[i].edges.length;j++){f.edges.push(f.edges[this.faces[i].edges[j].index]);}
			for(var j=0;j<this.faces[i].angles.length;j++){f.angles.push(this.faces[i].angles[j]); }
			f.graph = g;  f.index = i;
			g.faces.push(f);
		}
		// for(var i = 0; i < this.junctions.length; i++){
		// 	var junc = new PlanarJunction(g.nodes[this.junctions[i].origin.index]);
		// 	(<any>Object).assign(junc, this.junctions[i]);
		// 	junc.graph = g;  junc.index = i;
		// }
		return g;
	}

	/** convert this planar graph into an array of polylines, connecting as many edges as possible
	 * @returns {PlanarGraph} 
	 */
	polylines():Polyline[]{
		return this.connectedGraphs().map(function(graph){
			if(graph.edges.length == 0){ return undefined; }
			if(graph.edges.length == 1){ return graph.edges[0].nodes.map(function(n:PlanarNode){return n.copy();},this); }
			var nodes = [graph.edges[0].uncommonNodeWithEdge(graph.edges[1])];
			for(var i = 0; i < graph.edges.length-1; i++){
				var edge = graph.edges[ i ];
				var nextEdge = graph.edges[ (i+1) ];
				nodes.push(edge.commonNodeWithEdge(nextEdge));
			}
			nodes.push(graph.edges[ graph.edges.length-1 ].uncommonNodeWithEdge(graph.edges[ graph.edges.length-2 ]));
			return nodes.map(function(el:PlanarNode){return el.copy();},this);
		},this)
		.filter(function(el){return el != undefined;},this)
		.map(function(line){
			var p = new Polyline();
			p.nodes = line;
			return p;
		},this);
	}

	faceArrayDidChange(){for(var i=0; i<this.faces.length; i++){this.faces[i].index=i;}}
	sectorArrayDidChange(){for(var i=0;i<this.sectors.length;i++){this.sectors[i].index=i;}}
	junctionArrayDidChange(){for(var i=0;i<this.junctions.length;i++){this.junctions[i].index=i;}}

}
