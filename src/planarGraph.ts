// planarGraph.js
// a planar graph data structure containing edges and vertices in 2D space
// MIT open source license, Robby Kraft
//
//  "equivalent": 2 edges are equivalent if their two end-nodes occupy the same space
//              they can be equivalent even if they are not "similar", 4 nodes involved instead of 2.
//  "similar": edges are similar if they contain the same 2 nodes, even if in a different order

/// <reference path="graph.ts" />
/// <reference path="geometry.ts" />

"use strict";

interface rbushObject{
	load(data:object[]);
	insert(data:object):object;
	search(data:object):object[];
} declare function rbush():rbushObject;

/** A survey of the objects removed from a planar graph after a function is performed */
class PlanarClean extends GraphClean{
	edges:{total:number, duplicate:number, circular:number};
	nodes:{
		total:number;
		isolated:number;// nodes removed for being unattached to any edge
		fragment:XY[];  // nodes added at intersection of 2 lines, from fragment()
		collinear:XY[]; // nodes removed due to being collinear
		duplicate:XY[]; // nodes removed due to occupying the same space
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
/** Planar nodes mark the endpoints of planar edges in 2D space */
class PlanarNode extends GraphNode implements XY{

	graph:PlanarGraph;
	x:number;
	y:number;

	// for speeding up algorithms, temporarily store information here
	cache:object = {};

	copy():XY{ return new XY(this.x, this.y); }

	/** The PlanarJunction associated with this node */
	junction():PlanarJunction{
		if(this.graph.unclean){ this.graph.flatten(); }
		return this.graph.junctions.slice().filter(function(junction){
			return junction.origin === this;
		},this).shift();
	}
	/** An array of the PlanarSectors from the PlanarJunction associated with this node */
	sectors():PlanarSector[]{
		if(this.graph.unclean){ this.graph.flatten(); }
		return this.graph.sectors.filter(function(el){return el.origin === this;},this);
	}
	/** An array of the PlanarSectors from the PlanarJunction associated with this node */
	interiorAngles():number[]{ return this.junction().interiorAngles(); }

	/** Returns an array of faces containing this node
	 * @returns {PlanarFace[]} array of adjacent faces
	 * @example
	 * var adjacent = node.adjacentFaces()
	 */
	adjacentFaces():PlanarFace[]{
		if(this.graph.unclean){ this.graph.flatten(); }
		return this.graph.faces.filter(function(face){
			return face.nodes.filter(function(n){return n === this;},this).length > 0;
		},this);
	}
	/** Returns an array of edges that contain this node, sorted counter-clockwise, beginning from the +X axis
	 * @returns {PlanarEdge[]} array of adjacent edges
	 * @example
	 * var adjacent = node.adjacentEdges()
	 */
	adjacentEdges():PlanarEdge[]{
		return this.graph.edges
			.filter(function(el:PlanarEdge){return el.nodes[0]===this||el.nodes[1]===this},this)
			.map(function(el:PlanarEdge){
					var other = <PlanarNode>el.otherNode(this);
					return {'edge':el, 'angle':Math.atan2(other.y-this.y, other.x-this.x)};
				},this)
			// move the beginning of the array to +X axis
			.map(function(el){ if(el['angle'] < 0){el['angle'] += 2*Math.PI; }; return el; })
			// sort counter-clockwise
			.sort(function(a,b){return a.angle-b.angle;})
			.map(function(el){ return el.edge });
	}
	setPosition(x:number, y:number):PlanarNode{ this.x = x; this.y = y; return this; }
	// IMPORTANT: these were take from XY implementation, where they return a modified COPY
	// these functions MODIFY IN PLACE the x and the y values
	transform(matrix:Matrix):PlanarNode{
		var t = new XY(this.x*matrix.a+this.y*matrix.c+matrix.tx, this.x*matrix.b+this.y*matrix.d+matrix.ty);
		this.x = t.x;   this.y = t.y;   return this;
	}
	translate(dx:number, dy:number):PlanarNode{ this.x += dx; this.y += dy; return this;}
	rotate(angle:number,origin?:XY):PlanarNode{return this.transform(new Matrix().rotation(angle,origin));}
	reflect(line:any):XY{
		var origin = (line.direction!=undefined)?(line.point||line.origin):new XY(line.nodes[0].x,line.nodes[0].y);
		var vector = (line.direction!=undefined)?line.direction:new XY(line.nodes[1].x,line.nodes[1].y).subtract(origin);
		return this.transform( new Matrix().reflection(vector,origin));
	}
	// implements XY, requires re-implementation to remove mention of EPSILON
	equivalent(point:XY,epsilon?:number):boolean{return new XY(this.x,this.y).equivalent(point,epsilon);}
	// implements XY, for typescript to work, this was copied over from XY
	normalize():XY{var m = this.magnitude();return new XY(this.x/m,this.y/m);}dot(point:XY):number{return this.x*point.x+this.y*point.y;}cross(vector:XY):number{return this.x*vector.y-this.y*vector.x;}magnitude():number{return Math.sqrt(this.x*this.x+this.y*this.y);}distanceTo(a:XY):number{return Math.sqrt(Math.pow(this.x-a.x,2)+Math.pow(this.y-a.y,2));}rotate90():XY{return new XY(-this.y,this.x);}rotate180():XY{return new XY(-this.x,-this.y);}rotate270():XY{return new XY(this.y,-this.x);}lerp(point:XY,pct:number):XY{var inv=1.0-pct;return new XY(this.x*pct+point.x*inv,this.y*pct+point.y*inv);}midpoint(other:XY):XY{return new XY((this.x+other.x)*0.5,(this.y+other.y)*0.5);}scale(magnitude:number):XY{return new XY(this.x*magnitude,this.y*magnitude);}add(a:any,b?:any):XY{if(isValidPoint(a)){return new XY(this.x+a.x,this.y+a.y);}else if(isValidNumber(b)){return new XY(this.x+a,this.y+b);}}subtract(point:XY):XY{return new XY(this.x-point.x,this.y-point.y);}multiply(m:XY):XY{return new XY(this.x*m.x,this.y*m.y);}abs():XY{return new XY(Math.abs(this.x),Math.abs(this.y));}commonX(point:XY,epsilon?:number):boolean{return epsilonEqual(this.x,point.x,epsilon);}commonY(point:XY,epsilon?:number):boolean{return epsilonEqual(this.y,point.y,epsilon);}
}
/** Planar edges are straight lines connecting two planar nodes */
class PlanarEdge extends GraphEdge implements Edge{

	graph:PlanarGraph;
	nodes:[PlanarNode,PlanarNode];

	// for speeding up algorithms, temporarily store information here
	cache:object = {};

	copy():Edge{ return new Edge(this.nodes[0].copy(), this.nodes[1].copy()); }
	/** Returns an array of faces that contain this edge
	 * @returns {PlanarFace[]} array of adjacent faces
	 * @example
	 * var adjacent = edge.adjacentFace()
	 */
	adjacentFaces():PlanarFace[]{
		if(this.graph.unclean){ this.graph.flatten(); }
		return this.graph.faces.filter(function(face){
			return face.edges.filter(function(edge){return edge === this;},this).length > 0;
		},this);
	}
	boundingBox(epsilon?:number):Rect{
		if(epsilon == undefined){ epsilon = 0; }
		var xs = this.nodes[0].x<this.nodes[1].x?[this.nodes[0].x,this.nodes[1].x]:[this.nodes[1].x,this.nodes[0].x];
		var ys = this.nodes[0].y<this.nodes[1].y?[this.nodes[0].y,this.nodes[1].y]:[this.nodes[1].y,this.nodes[0].y];
		var eps2 = epsilon*2;
		return new Rect(xs[0]-epsilon, ys[0]-epsilon, xs[1]-xs[0]+eps2, ys[1]-ys[0]+eps2);
	}	
	intersection(edge:PlanarEdge, epsilon?:number):XY{
		// checking if isAdjacentToEdge is at least 2x faster than checking if instanceof PlanarEdge
		if(typeof(<PlanarEdge>edge).isAdjacentToEdge==="function"&&this.isAdjacentToEdge(<PlanarEdge>edge)){return undefined;}
		var intersect = this.copy().intersection(edge.copy(), epsilon);
		if(intersect != undefined && 
			!(intersect.equivalent(this.nodes[0], epsilon) || intersect.equivalent(this.nodes[1], epsilon))){
			return intersect;
		}
	}
	// implements Edge (LineType), requires re-implementation to modify nodes in place
	transform(matrix:Matrix):Edge{return new Edge(this.nodes[0].transform(matrix),this.nodes[1].transform(matrix));}
	// implements Edge (LineType), requires re-implementation to remove mention of EPSILON
	parallel(edge:PlanarEdge, epsilon?:number):boolean{return new Edge(this).parallel(new Edge(edge), epsilon);}
	collinear(point:XY, epsilon?:number):boolean{return new Edge(this).collinear(point, epsilon);}
	equivalent(e:PlanarEdge, epsilon?:number):boolean{return((this.nodes[0].equivalent(e.nodes[0],epsilon)&&this.nodes[1].equivalent(e.nodes[1],epsilon))||(this.nodes[0].equivalent(e.nodes[1],epsilon)&&this.nodes[1].equivalent(e.nodes[0],epsilon)));}
	degenrate(epsilon?:number):boolean{return this.nodes[0].equivalent(this.nodes[1], epsilon);}	
	// implements Edge (LineType)
	length():number{return Math.sqrt(Math.pow(this.nodes[0].x-this.nodes[1].x,2)+Math.pow(this.nodes[0].y-this.nodes[1].y,2));}vector(originNode?:XY):XY{if(originNode==undefined){return this.nodes[1].subtract(this.nodes[0]);}if(this.nodes[0].equivalent(originNode)){return this.nodes[1].subtract(this.nodes[0]);}return this.nodes[0].subtract(this.nodes[1]);}reflectionMatrix():Matrix{return new Matrix().reflection(this.nodes[1].subtract(this.nodes[0]),this.nodes[0]);}nearestPoint(point:XY):XY{var answer=this.nearestPointNormalTo(point);if(answer!==undefined){return answer;}return this.nodes.map(function(el){return {point:el,distance:el.distanceTo(point)};},this).sort(function(a,b){return a.distance-b.distance;}).shift().point;}nearestPointNormalTo(point:XY):XY{var p=this.nodes[0].distanceTo(this.nodes[1]);var u=((point.x-this.nodes[0].x)*(this.nodes[1].x-this.nodes[0].x)+(point.y-this.nodes[0].y)*(this.nodes[1].y-this.nodes[0].y))/(Math.pow(p,2));if(u<0||u>1.0){return undefined;}return new XY(this.nodes[0].x+u*(this.nodes[1].x-this.nodes[0].x),this.nodes[0].y+u*(this.nodes[1].y-this.nodes[0].y));}midpoint():XY{return new XY(0.5*(this.nodes[0].x+this.nodes[1].x),0.5*(this.nodes[0].y+this.nodes[1].y));}perpendicularBisector():Line{return new Line(this.midpoint(),this.vector().rotate90());}infiniteLine():Line{ return new Line(this.nodes[0],this.nodes[1].subtract(this.nodes[0]));}
}
/** Planar faces are counter-clockwise sequences of nodes already connected by edges */
class PlanarFace extends Polygon{
	// this library is counting on the edges and nodes to be stored in counter-clockwise winding
	graph:PlanarGraph;
	nodes:PlanarNode[];
	edges:PlanarEdge[];

	angles:number[];
	index:number;

	constructor(graph:PlanarGraph){
		super()
		this.graph = graph;
		this.nodes = [];
		this.edges = [];
		this.angles = [];
	}
	sectors():PlanarSector[]{
		if(this.graph.unclean){ }
		var options = this.graph.sectors.filter(function(sector){
			return this.nodes.filter(function(node){ return node === sector.origin; },this).length > 0;
		},this);
		return this.edges.map(function(el,i){
			var nextEl = this.edges[(i+1)%this.edges.length];
			return options.filter(function(sector){return sector.edges[0] === el && sector.edges[1] === nextEl},this).shift();
		},this);
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
	// [
	// 	[CreaseFace]
	// 	[CreaseFace, CreaseFace]
	// 	[CreaseFace, CreaseFace, CreaseFace, CreaseFace]
	// 	[CreaseFace, CreaseFace]
	// 	[CreaseFace]
	// ]
	adjacentFaceArray():{"face":PlanarFace, "parent":PlanarFace}[][]{
		if(this.graph.unclean){ this.graph.generateFaces(); } 
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
}
/** a PlanarSector is the interior angle space made by two adjacent edges, counter-clockwise around their shared node, from edge[0] to edge[1] */
class PlanarSector extends Sector{
	// the node in common with the edges
	origin:PlanarNode;
	// the indices of these 2 nodes directly correlate to 2 edges' indices
	edges:[PlanarEdge, PlanarEdge];
	endPoints:[PlanarNode, PlanarNode];

	index:number;
	// counter-clockwise angle from edge 0 to edge 1 is in index 0. edge 1 to 0 is in index 1
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
}
/** Planar junctions mark intersections between edges */
class PlanarJunction{

	origin:PlanarNode;
	// sectors and edges are sorted counter-clockwise
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
			return new this.origin.graph.sectorType(el, this.edges[(i+1)%this.edges.length]);
		},this);
	}

	/** Returns an array of nodes, the endpoints of the junctions edges, sorted counter-clockwise.
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
		if(this.origin.graph.unclean){ this.origin.graph.flatten(); }
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
	/** Locates the nearest clockwise adjacent node from the node supplied in the argument. If this was a clock centered at this node, if you pass in node for the number 3, it will return you the number 4.
	 * @returns {PlanarNode}
	 */
	clockwiseNode(fromNode:PlanarNode):PlanarNode{
		for(var i = 0; i < this.edges.length; i++){
			if(this.edges[i].otherNode(this.origin) === fromNode){
				return <PlanarNode>this.edges[ (i+this.edges.length-1)%this.edges.length ].otherNode(this.origin);
			}
		}
	}
	/** Locates the nearest counter-clockwise adjacent node from the node supplied in the argument. If this was a clock centered at this node, if you pass in node for the number 3, it will return you the number 2.
	 * @returns {PlanarNode}
	 */
	counterClockwiseNode(fromNode:PlanarNode):PlanarNode{
		for(var i = 0; i < this.edges.length; i++){
			if(this.edges[i].otherNode(this.origin) === fromNode){
				return <PlanarNode>this.edges[ (i+1)%this.edges.length ].otherNode(this.origin);
			}
		}
	}
	clockwiseEdge(fromEdge:PlanarEdge):PlanarEdge{
		var index = this.edges.indexOf(fromEdge);
		if(index === -1){ return undefined; }
		return this.edges[ (index+this.edges.length-1)%this.edges.length ];
	}
	counterClockwiseEdge(fromEdge:PlanarEdge):PlanarEdge{
		var index = this.edges.indexOf(fromEdge);
		if(index === -1){ return undefined; }
		return this.edges[ (index+1)%this.edges.length ];
	}
}
/** A planar graph is a set of nodes in 2D space, edges connecting them */
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
	// if nodes have been moved, it's possible for edges to overlap. re-require call to flatten()
	unclean:boolean;
	// not using these yet
	didChange:(event:object)=>void;

	constructor(){ super(); this.clear(); }

	/** Removes circular and duplicate edges, merges and removes duplicate nodes, and refreshes .index values
	 * @returns {object} 'edges' the number of edges removed, and 'nodes' an XY location for every duplicate node merging
	 */
	clean(epsilon?:number):PlanarClean{
		// console.time("clean");
		var report = new PlanarClean();
		report.join( this.cleanDuplicateNodes(epsilon) );
		this.fragmentCollinearNodes(epsilon);
		report.join( this.cleanDuplicateNodes(epsilon) );
		report.join( this.fragment(epsilon) );
		report.join( this.cleanDuplicateNodes(epsilon) );
		report.join( this.cleanGraph() );
		report.join( this.cleanAllUselessNodes() );
		this.nodeArrayDidChange();
		this.edgeArrayDidChange();
		// console.timeEnd("clean");
		return report;
	}

	flatten(epsilon?:number):PlanarClean{
		// console.time("flatten");
		this.unclean = false;
		var report = this.clean(epsilon);
		this.generateJunctions();
		this.generateFaces();
		// console.timeEnd("flatten");
		return report;
	}

	///////////////////////////////////////////////
	// ADD PARTS
	///////////////////////////////////////////////

	/** Create a new isolated planar node at x,y
	 * @returns {PlanarNode} pointer to the node
	 */
	newPlanarNode(x:number, y:number):PlanarNode{
		this.unclean = true;
		return (<PlanarNode>this.newNode()).setPosition(x, y);
	}
	/** Create two new nodes each with x,y locations and an edge between them
	 * @returns {PlanarEdge} pointer to the edge
	 */
	newPlanarEdge(x1:number, y1:number, x2:number, y2:number):PlanarEdge{
		this.unclean = true;
		var a = (<PlanarNode>this.newNode()).setPosition(x1, y1);
		var b = (<PlanarNode>this.newNode()).setPosition(x2, y2);
		return <PlanarEdge>this.newEdge(a, b);
	}
	/** Create one node with an x,y location and an edge between it and an existing node
	 * @returns {PlanarEdge} pointer to the edge
	 */
	newPlanarEdgeFromNode(node:PlanarNode, x:number, y:number):PlanarEdge{
		this.unclean = true;
		var newNode = (<PlanarNode>this.newNode()).setPosition(x, y);
		return <PlanarEdge>this.newEdge(node, newNode);
	}
	/** Create one edge between two existing nodes
	 * @returns {PlanarEdge} pointer to the edge
	 */
	newPlanarEdgeBetweenNodes(a:PlanarNode, b:PlanarNode):PlanarEdge{
		this.unclean = true;
		return <PlanarEdge>this.newEdge(a, b);
	}

	///////////////////////////////////////////////
	// GET PARTS
	///////////////////////////////////////////////

	/** Create a rectangle bounding box around all the nodes, defined by rectangle dimensions and the location of one corner
	 * @returns {origin:{x:number,y:number},size:{width:number,height:number}} Rect type describing the bounds of the nodes
	 */
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
	nearest(a:any,b?:any):{'node':PlanarNode,'edge':PlanarEdge,'face':PlanarFace,'junction':PlanarJunction,'sector':PlanarSector}{
		var point = gimme1XY(a,b);
		var face = this.faceContainingPoint(point);
		// if(face !== undefined){
		// 	var node:PlanarNode = face.nodes.slice().sort(function(a:PlanarNode, b:PlanarNode){
		// 		return a.distanceTo(point) - b.distanceTo(point);
		// 	})[0];
		// 	var edge:PlanarEdge = face.edges.slice().sort(function(a:PlanarEdge, b:PlanarEdge){
		// 		return a.nearestPoint(point).distanceTo(point) - b.nearestPoint(point).distanceTo(point);
		// 	})[0];
		// 	var junction = node.junction();
		// 	if(junction === undefined){
		// 		junction = this.junctions
		// 			.map(function(el){ return {'junction':el, 'distance':point.distanceTo(el.origin)};},this)
		// 			.sort(function(a,b){return a['distance']-b['distance'];})
		// 			.shift()
		// 			.junction;
		// 	}
		// 	var sector = face.sectors().filter(function(el){ return el.origin === node; },this).shift();
		// } else{
			var edgeArray = this.edges
				.map(function(edge:PlanarEdge){
					return {edge:edge, distance:edge.nearestPoint(point).distanceTo(point)};
				},this)
				.sort(function(a,b){
					return a.distance - b.distance;
				})[0];
			var edge = (edgeArray != undefined) ? edgeArray.edge : undefined;
			var node = (edge !== undefined) ? edge.nodes
				.slice().sort(function(a,b){ return a.distanceTo(point) - b.distanceTo(point);}).shift() : undefined;
			if(node == undefined){
				var sortedNode = this.nodes
				.map(function(el){ return {'node':el, 'distance':point.distanceTo(el)};},this)
				.sort(function(a,b){ return a.distance - b.distance;})
				.shift();
				node = (sortedNode != undefined) ? sortedNode['node'] : undefined;
			}
			var junction = (node != undefined) ? node.junction() : undefined;
			if(junction === undefined){
				var sortedJunction = this.junctions
					.map(function(el){ return {'junction':el, 'distance':point.distanceTo(el.origin)};},this)
					.sort(function(a,b){return a['distance']-b['distance'];})
					.shift();
				junction = (sortedJunction !== undefined) ? sortedJunction['junction'] : undefined
			}
			var sector = (junction !== undefined) ? junction.sectors.filter(function(el){
				return el.contains(point);
			},this).shift() : undefined;
		// }
		return {
			'node':node,
			'edge':edge,
			'face':face,
			'junction':junction,
			'sector':sector
		};
	}

	nearestNodes(quantity:number, a:any,b:any){
		var point = gimme1XY(a,b);
		var sortedNodes = this.nodes
			.map(function(el){ return {'node':el, 'distance':point.distanceTo(el)};},this)
			.sort(function(a,b){ return a.distance - b.distance;})
			.map(function(el){ return el['node'];},this);
		if(quantity > sortedNodes.length){ return sortedNodes; }
		return sortedNodes.slice(0, quantity);
	}

	nearestEdges(quantity:number, a:any, b:any){
		var point = gimme1XY(a,b);
		var sortedEdges = this.edges
			.map(function(edge:PlanarEdge){
				return {edge:edge, distance:edge.nearestPoint(point).distanceTo(point)};
			},this)
			.sort(function(a,b){
				return a.distance - b.distance;
			});
		if(quantity > sortedEdges.length){ return sortedEdges; }
		return sortedEdges.slice(0, quantity);
	}
	nearestEdge(edges:Edge[], a:any, b:any){
		var point = gimme1XY(a,b);
		var sortedEdges = edges
			.map(function(edge:PlanarEdge){
				return {edge:edge, distance:edge.nearestPoint(point).distanceTo(point)};
			},this)
			.sort(function(a,b){
				return a.distance - b.distance;
			});
		return sortedEdges.slice(0);
	}

	/** Without changing the graph, this function collects the point location of every intersection between crossing edges.
	 * @returns {XY[]} array of XY, the location of intersections
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
						if(intersection.equivalent(intersections[k], epsilon)){ copy = true; break;}
					}
					if(!copy){ intersections.push(intersection); }
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

	/** Get the nearest edge connecting two points supplied as arguments
	 * @returns {XY[]} array of XY, the location of intersections
	 */
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

	cleanNodeIfIsolated(node:PlanarNode):PlanarClean{
		var found = false;
		for(var i = 0; i < this.edges.length; i++){
			if(this.edges[i].nodes[0]===node || this.edges[i].nodes[1]===node){ found = true; break; }
		}
		if(found == false){
			this.nodes = this.nodes.filter(function(el){ return el !== node; });
			this.nodeArrayDidChange();
			console.log("removing isolated node");
			return new PlanarClean(1, 0);
		}
		return new PlanarClean()
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
		// console.time("cleanAllUselessNodes");
		// console.log("cleanAllUselessNodes");
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
		// console.timeEnd("cleanAllUselessNodes");
		return report;
	}

	mergePlanarNodes(node1:PlanarNode, node2:PlanarNode):PlanarClean{
		return new PlanarClean(-1).join(this.mergeNodes(node1, node2)).duplicateNodes([new XY(node2.x, node2.y)]);;
	}

	/** Removes all nodes that lie within an epsilon distance to an existing node.
	 * remap any compromised edges to the persisting node so no edge data gets lost
	 * @returns {PlanarClean} how many nodes were removed
	 */
	cleanDuplicateNodes(epsilon?:number):PlanarClean{
		// console.time("cleanDuplicateNodes");
		var EPSILON_HIGH = 0.00000001;
		if(epsilon == undefined){ epsilon = EPSILON_HIGH; }
		var tree = rbush();
		tree.load(this.nodes.map(function(el){
			return {minX:el.x-epsilon, minY:el.y-epsilon, maxX:el.x+epsilon, maxY:el.y+epsilon,node:el};
		}));
		// iterate over nodes. if a node is too close to another, before removing it, make sure:
		// - it is not in "remainList" (it needs to stay, another node is counting on being replaced for it)
		// - the node it's attempting to be replaced by is not in "removeList"
		var remainList = [], removeList = [];
		var mergeList:{'remain':PlanarNode, 'remove':PlanarNode}[] = []
		this.nodes.forEach(function(node){
			tree.search({minX:node.x-epsilon, minY:node.y-epsilon, maxX:node.x+epsilon, maxY:node.y+epsilon})
				.filter(function(r){ return node !== r['node']; },this)
				.filter(function(r){ return remainList.indexOf(r['node']) == -1; },this)
				.filter(function(r){ return removeList.indexOf(node) == -1; },this)
				.forEach(function(r){
					remainList.push(node);
					removeList.push(r['node']);
					mergeList.push({'remain':node, 'remove':r['node']});
				},this);
		},this);
		// console.timeEnd("cleanDuplicateNodes");
		return mergeList
			.map(function(el){ return this.mergePlanarNodes(el['remain'], el['remove']); },this)
			.reduce(function(prev,curr){ return prev.join(curr); },new PlanarClean());
	}

	///////////////////////////////////////////////
	// FLATTEN, FRAGMENT, FACES
	///////////////////////////////////////////////

	generateJunctions():PlanarJunction[]{
		this.junctions = this.nodes
			.map(function(el){ return new this.junctionType(el); },this)
			.filter(function(el){ return el !== undefined; },this)
			.filter(function(el){ return el.edges.length > 1; },this);
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
				return [this.counterClockwiseCircuit(edge.nodes[0], edge.nodes[1]),
				        this.counterClockwiseCircuit(edge.nodes[1], edge.nodes[0])];
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
	fragment(epsilon?:number):PlanarClean{
		//todo: remove protection, or bake it into the class itself
		var protection = 0;
		var report = new PlanarClean();
		var roundReport:PlanarClean;
		do{
			roundReport = this.edges
				.map(function(edge){ return this.fragmentCrossingEdges(edge, epsilon); },this)
				.reduce(function(prev,curr){ return prev.join(curr); },new PlanarClean());
			if(roundReport.nodes.fragment.length > 0){
				this.cleanDuplicateNodes(epsilon);
				this.cleanGraph();
			}
			report.join( roundReport );
			protection += 1;
		}while(roundReport.nodes.fragment.length != 0 && protection < 500);
		if(protection >= 500){ console.log("exiting fragment(). potential infinite loop detected"); }
		// this.fragmentOverlappingEdges(epsilon);
		this.removeIsolatedNodes();
		this.cleanDuplicateNodes();
		this.cleanGraph();
		return report;
	}

	/** This function targets a single edge and performs the fragment operation on all crossing edges.
	 * @returns {XY[]} array of XY locations of all the intersection locations
	 */
	private fragmentCrossingEdges(edge:PlanarEdge, epsilon?:number):PlanarClean{
		var report = new PlanarClean();
		var intersections:{'edge':PlanarEdge, 'point':XY}[] = this.edgeCrossingEdges(edge, epsilon);
		if(intersections.length == 0){ return report; }
		var edgesLength = this.edges.length;
		report.nodes.fragment = intersections.map(function(el){ return new XY(el.point.x, el.point.y);});
		// iterate through intersections, rebuild edges in order
		var newLineNodes = intersections.map(function(el){
			return (<PlanarNode>this.newNode()).setPosition(el.point.x, el.point.y);
		},this);
		var isolated = intersections
			.map(function(el,i){ return this.rebuildEdge(el.edge, el.edge.nodes, [newLineNodes[i]], epsilon);},this)
			.map(function(el){ return el.nodes })
			.reduce(function(prev,curr){ return prev.concat(curr); },[]);
			// .forEach(function(node){ this.cleanNodeIfIsolated(node); },this);
		// important: sortedEndpts are sorted in the same order as edge.crossingEdges
		var sortedEndpts = edge.nodes.slice().sort(function(a,b){
			if(a.commonX(b,epsilon)){ return a.y-b.y; } return a.x-b.x;
		});
		isolated = isolated.concat(this.rebuildEdge(edge, <[PlanarNode, PlanarNode]>sortedEndpts, newLineNodes, epsilon).nodes)
		// isolated.forEach(function(node){ this.cleanNodeIfIsolated(node); },this);
		report.edges.total += edgesLength - this.edges.length;
		// console.log(report);
		return report;
	}

	/** Returns an array of edges that cross this edge. These are edges which are considered "invalid"
	 * @returns {{edge:PlanarEdge, point:XY}[]} array of objects containing the crossing edge and point of intersection
	 * @example
	 * var edges = edge.crossingEdges()
	 */
	edgeCrossingEdges(edge:PlanarEdge, epsilon?:number):{edge:PlanarEdge, point:XY}[]{
		var EPSILON_HIGH = 0.000000001;
		if(epsilon == undefined){ epsilon = EPSILON_HIGH; }
		var myXs = edge.nodes.map(function(n){return n.x;}).sort(function(a,b){return a-b});
		var myYs = edge.nodes.map(function(n){return n.y;}).sort(function(a,b){return a-b});
		myXs[0] -= epsilon; myXs[1] += epsilon; myYs[0] -= epsilon; myYs[1] += epsilon;
		return this.edges
			.filter(function(el:PlanarEdge){ return !(
				(el.nodes[0].x < myXs[0] && el.nodes[1].x < myXs[0]) ||
				(el.nodes[0].x > myXs[1] && el.nodes[1].x > myXs[1]) ||
				(el.nodes[0].y < myYs[0] && el.nodes[1].y < myYs[0]) ||
				(el.nodes[0].y > myYs[1] && el.nodes[1].y > myYs[1])
				)},this)
			.filter(function(el:PlanarEdge){ return edge !== el}, this)
			.map(function(el:PlanarEdge){ return {edge:el, point:edge.intersection(el, epsilon)} }, this)
			.filter(function(el:{edge:PlanarEdge, point:XY}){ return el.point != undefined})
			.sort(function(a:{edge:PlanarEdge, point:XY},b:{edge:PlanarEdge, point:XY}){
				if(a.point.commonX(b.point,epsilon)){ return a.point.y-b.point.y; }
				return a.point.x-b.point.x;
			});
	}

	/** This rebuilds an edge by inserting collinear points between its endpoints and constructs many edges between them.
	 *  This is taking for granted that sorting has already happened. 1) innerpoints are sorted and 2) oldEndpts are sorted so that the first can be added to the beginning of innerpoints and the second to the end, and the product is a fully-sorted array
	 * @returns {PlanarNode[]} array of locally-isolated nodes, created by edge-removal. further checks should be done before removing to ensure they are not still being used by other edges.
	 */
	private rebuildEdge(oldEdge:PlanarEdge, oldEndpts:[PlanarNode,PlanarNode], innerpoints:PlanarNode[], epsilon?:number):{edges:PlanarEdge[], nodes:PlanarNode[]}{
		var isolatedNodes = [];
		var endinnerpts = [ innerpoints[0], innerpoints[innerpoints.length-1] ];
		var equiv = oldEndpts.map(function(n,i){return n.equivalent(endinnerpts[i],epsilon);},this);
		if(equiv[0]){ isolatedNodes.push(oldEndpts[0]) } else{ innerpoints.unshift(oldEndpts[0]); }
		if(equiv[1]){ isolatedNodes.push(oldEndpts[1]) } else{ innerpoints.push(oldEndpts[1]); }
		var newEdges = [];
		if(innerpoints.length > 1){
			for(var i = 0; i < innerpoints.length-1; i++){
				var e = this.copyEdge(oldEdge);
				e.nodes = [innerpoints[i], innerpoints[i+1]];
				newEdges.push(e);
			}
		}
		this.edges = this.edges.filter(function(e){ return e !== oldEdge; },this);
		return {edges: newEdges, nodes:isolatedNodes};
	}

	private fragmentCollinearNodes(epsilon?:number){
		var EPSILON_HIGH = 0.000000001;
		if(epsilon == undefined){ epsilon = EPSILON_HIGH; }
		var tree = rbush();
		var treeNodes = this.nodes.map(function(n){
			return {minX:n.x-epsilon, minY:n.y-epsilon, maxX:n.x+epsilon, maxY:n.y+epsilon, node:n};
		},this);
		tree.load(treeNodes);
		this.edges.forEach(function(edge){ edge.cache['box'] = edge.boundingBox(epsilon); },this);
		this.edges.slice().forEach(function(edge){
			// var box = edge.boundingBox(epsilon);
			var box = edge.cache['box'];
			if(box == undefined){ box = edge.boundingBox(epsilon); }
			var result = tree.search({
				minX: box.origin.x,
				minY: box.origin.y,
				maxX: box.origin.x + box.size.width,
				maxY: box.origin.y + box.size.height
			}).filter(function(found){
				return !edge.nodes[0].equivalent(found['node'], epsilon) && 
				       !edge.nodes[1].equivalent(found['node'], epsilon);
			}).filter(function(found){ return edge.collinear(found['node'], epsilon); })
			if(result.length){
				var sortedEdgePts = edge.nodes.slice().sort(function(a,b){
					if(a.commonX(b,epsilon)){ return a.y-b.y; }
					return a.x-b.x;
				});
				var sortedResult = result
					.map(function(found){ return found['node']; },this)
					.sort(function(a,b){
						if(a.commonX(b,epsilon)){ return a.y-b.y; }
						return a.x-b.x;
					});
				this.rebuildEdge(edge, sortedEdgePts, sortedResult, epsilon)
					.edges
					.forEach(function(e){ e.cache['box'] = e.boundingBox(epsilon); });
			}
		},this);
	}

	/** Begin from node1 to node2, continue down adjacent edges always making left-most inner angle turn until a circuit is found.
	 *  This is a part of the face-finding algorithm
	 * @returns {PlanarEdge[]}
	 */
	private counterClockwiseCircuit(node1:PlanarNode, node2:PlanarNode):PlanarEdge[]{
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
				// walking counter-clockwise means to double back along the CLOCKWISE edge
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

	/** Constructor for PlanarFace. This will only work if:
	 * a. The circuit array argument is a valid circuit; a sorted list of adjacent edges.
	 * b. The winding order of the nodes is counter-clockwise
	 * This is a part of the face-finding algorithm
	 * @param {PlanarEdge[]} the array generated from counterClockwiseCircuit()
	 * @returns {PlanarFace} a PlanarFace, 
	 */
	private faceFromCircuit(circuit:PlanarEdge[]):PlanarFace{
		var SUM_ANGLE_EPSILON = 0.000000000001;
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

	///////////////////////////////////////////////
	// COPY
	///////////////////////////////////////////////

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

	faceArrayDidChange(){for(var i=0;i<this.faces.length; i++){this.faces[i].index=i;}}
	sectorArrayDidChange(){for(var i=0;i<this.sectors.length;i++){this.sectors[i].index=i;}}
	junctionArrayDidChange(){for(var i=0;i<this.junctions.length;i++){this.junctions[i].index=i;}}
}
