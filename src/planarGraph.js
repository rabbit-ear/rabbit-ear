// planarGraph.js
// a planar graph data structure containing edges and vertices in 2D space
// MIT open source license, Robby Kraft
//
//  "equivalent": 2 edges are equivalent if their two end-nodes occupy the same space
//              they can be equivalent even if they are not "similar", 4 nodes involved instead of 2.
//  "similar": edges are similar if they contain the same 2 nodes, even if in a different order

import { GraphClean, GraphNode, GraphEdge, Graph } from './graph'
import * as M from './geometry'
import '../lib/rbush.js';

"use strict";

////////////// Copied from geometry.ts
function isValidPoint(point){return(point!==undefined&&!isNaN(point.x)&&!isNaN(point.y));}
function isValidNumber(n){return(n!==undefined&&!isNaN(n)&&!isNaN(n));}
function epsilonEqual(a, b, epsilon){
	if(epsilon === undefined){ epsilon = M.EPSILON_HIGH; }
	return ( Math.abs(a - b) < epsilon );
}
///////////////////////////////////////

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
	if(isValidPoint(b)) { return new M.Ray(a,b); }
	if(isValidNumber(d)){ return new M.Ray(new M.XY(a,b), new M.XY(c,d)); }
}
function gimme1Line(a, b, c, d){
	// input is 1 line
	if(a instanceof M.Line){ return a; }
	// input is 2 XY
	if(isValidPoint(b)){ return new M.Line(a,b); }
	// input is 4 numbers
	if(isValidNumber(d)){ return new M.Line(a,b,c,d); }
	// input is 1 line-like object with points in a nodes[] array
	if(a instanceof M.Edge && a.nodes instanceof Array &&
	        a.nodes.length > 0 &&
	        isValidPoint(a.nodes[1])){
		return new M.Line(a.nodes[0].x, a.nodes[0].y, a.nodes[1].x, a.nodes[1].y);
	}
}

/** A survey of the objects removed from a planar graph after a function is performed */
export class PlanarClean extends GraphClean{
	// edges;
	// nodes;
		// isolated;// nodes removed for being unattached to any edge
		// fragment;  // nodes added at intersection of 2 lines, from fragment()
		// collinear; // nodes removed due to being collinear
		// duplicate; // nodes removed due to occupying the same space
	constructor(numNodes, numEdges){
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
	fragmentedNodes(nodes){
		this.nodes.fragment = nodes; this.nodes.total += nodes.length; return this;
	}
	collinearNodes(nodes){
		this.nodes.collinear = nodes; this.nodes.total += nodes.length; return this;
	}
	duplicateNodes(nodes){
		this.nodes.duplicate = nodes; this.nodes.total += nodes.length; return this;
	}
	join(report){
		this.nodes.total += report.nodes.total;
		this.edges.total += report.edges.total;
		this.nodes.isolated += report.nodes.isolated;
		this.edges.duplicate += report.edges.duplicate;
		this.edges.circular += report.edges.circular;
		// if we are merging 2 planar clean reports, type cast this variable and check properties
		var planarReport = report;
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
export class PlanarNode extends GraphNode {

	// graph;
	// x;
	// y;

	copy(){ return new M.XY(this.x, this.y); }

	/** The PlanarJunction associated with this node */
	junction(){
		if(this.graph.unclean){ this.graph.clean(); }
		return this.graph.junctions.slice().filter(function(junction){
			return junction.origin === this;
		},this).shift();
	}
	/** An array of the PlanarSectors from the PlanarJunction associated with this node */
	sectors(){
		if(this.graph.unclean){ this.graph.clean(); }
		return this.graph.sectors.filter(function(el){return el.origin === this;},this);
	}
	/** An array of the PlanarSectors from the PlanarJunction associated with this node */
	interiorAngles(){ return this.junction().interiorAngles(); }

	/** Returns an array of faces containing this node
	 * @returns {PlanarFace[]} array of adjacent faces
	 * @example
	 * var adjacent = node.adjacentFaces()
	 */
	adjacentFaces(){
		if(this.graph.unclean){ this.graph.clean(); }
		return this.graph.faces.filter(function(face){
			return face.nodes.filter(function(n){return n === this;},this).length > 0;
		},this);
	}
	/** Returns an array of edges that contain this node, sorted counter-clockwise, beginning from the +X axis
	 * @returns {PlanarEdge[]} array of adjacent edges
	 * @example
	 * var adjacent = node.adjacentEdges()
	 */
	adjacentEdges(){
		return this.graph.edges
			.filter(function(el){return el.nodes[0]===this||el.nodes[1]===this},this)
			.map(function(el){
					var other = el.otherNode(this);
					return {'edge':el, 'angle':Math.atan2(other.y-this.y, other.x-this.x)};
				},this)
			// move the beginning of the array to +X axis
			.map(function(el){ if(el['angle'] < 0){el['angle'] += 2*Math.PI; }; return el; })
			// sort counter-clockwise
			.sort(function(a,b){return a.angle-b.angle;})
			.map(function(el){ return el.edge });
	}
	setPosition(x, y){ this.x = x; this.y = y; return this; }
	// IMPORTANT: these were taken from XY implementation, where they return a modified COPY
	// these functions MODIFY IN PLACE the x and the y values
	transform(matrix){
		var t = new M.XY(this.x*matrix.a+this.y*matrix.c+matrix.tx, this.x*matrix.b+this.y*matrix.d+matrix.ty);
		this.x = t.x;   this.y = t.y;   return this;
	}
	translate(dx, dy){ this.x += dx; this.y += dy; return this;}
	rotate(angle,origin){return this.transform(new M.Matrix().rotation(angle,origin));}
	reflect(line){
		var origin = (line.direction!=undefined)?(line.point||line.origin):new M.XY(line.nodes[0].x,line.nodes[0].y);
		var vector = (line.direction!=undefined)?line.direction:new M.XY(line.nodes[1].x,line.nodes[1].y).subtract(origin);
		return this.transform( new M.Matrix().reflection(vector,origin));
	}
	// implements XY, requires re-implementation to remove mention of EPSILON
	equivalent(point,epsilon){return new M.XY(this.x,this.y).equivalent(point,epsilon);}
	// implements XY, for typescript to work, this was copied over from XY
	normalize(){var m = this.magnitude();return new M.XY(this.x/m,this.y/m);}dot(point){return this.x*point.x+this.y*point.y;}cross(vector){return this.x*vector.y-this.y*vector.x;}magnitude(){return Math.sqrt(this.x*this.x+this.y*this.y);}distanceTo(a){return Math.sqrt(Math.pow(this.x-a.x,2)+Math.pow(this.y-a.y,2));}rotate90(){return new M.XY(-this.y,this.x);}rotate180(){return new M.XY(-this.x,-this.y);}rotate270(){return new M.XY(this.y,-this.x);}lerp(point,pct){var inv=1.0-pct;return new M.XY(this.x*pct+point.x*inv,this.y*pct+point.y*inv);}midpoint(other){return new M.XY((this.x+other.x)*0.5,(this.y+other.y)*0.5);}scale(magnitude){return new M.XY(this.x*magnitude,this.y*magnitude);}add(a,b){if(isValidPoint(a)){return new M.XY(this.x+a.x,this.y+a.y);}else if(isValidNumber(b)){return new M.XY(this.x+a,this.y+b);}}subtract(point){return new M.XY(this.x-point.x,this.y-point.y);}multiply(m){return new M.XY(this.x*m.x,this.y*m.y);}abs(){return new M.XY(Math.abs(this.x),Math.abs(this.y));}commonX(point,epsilon){return epsilonEqual(this.x,point.x,epsilon);}commonY(point,epsilon){return epsilonEqual(this.y,point.y,epsilon);}
}
/** Planar edges are straight lines connecting two planar nodes */
export class PlanarEdge extends GraphEdge{

	// graph;
	// nodes;

	// for speeding up algorithms, temporarily store information here
	// cache = {};

	copy(){ return new M.Edge(this.nodes[0].copy(), this.nodes[1].copy()); }
	/** Returns an array of faces that contain this edge
	 * @returns {PlanarFace[]} array of adjacent faces
	 * @example
	 * var adjacent = edge.adjacentFace()
	 */
	adjacentFaces(){
		if(this.graph.unclean){ this.graph.clean(); }
		return this.graph.faces.filter(function(face){
			return face.edges.filter(function(edge){return edge === this;},this).length > 0;
		},this);
	}
	boundingBox(epsilon){
		if(epsilon == undefined){ epsilon = 0; }
		var xs = this.nodes[0].x<this.nodes[1].x?[this.nodes[0].x,this.nodes[1].x]:[this.nodes[1].x,this.nodes[0].x];
		var ys = this.nodes[0].y<this.nodes[1].y?[this.nodes[0].y,this.nodes[1].y]:[this.nodes[1].y,this.nodes[0].y];
		var eps2 = epsilon*2;
		return new M.Rect(xs[0]-epsilon, ys[0]-epsilon, xs[1]-xs[0]+eps2, ys[1]-ys[0]+eps2);
	}	
	intersection(edge, epsilon){
		// checking if isAdjacentToEdge is at least 2x faster than checking if instanceof PlanarEdge
		if(typeof(edge).isAdjacentToEdge==="function"&&this.isAdjacentToEdge(edge)){return undefined;}
		var intersect = this.copy().intersection(edge.copy(), epsilon);
		if(intersect != undefined && 
			!(intersect.equivalent(this.nodes[0], epsilon) || intersect.equivalent(this.nodes[1], epsilon))){
			return intersect;
		}
	}
	// implements M.Edge (LineType), requires re-implementation to modify nodes in place
	transform(matrix){return new M.Edge(this.nodes[0].transform(matrix),this.nodes[1].transform(matrix));}
	// implements M.Edge (LineType), requires re-implementation to remove mention of EPSILON
	parallel(edge, epsilon){return new M.Edge(this).parallel(new M.Edge(edge), epsilon);}
	collinear(point, epsilon){return new M.Edge(this).collinear(point, epsilon);}
	equivalent(e, epsilon){return((this.nodes[0].equivalent(e.nodes[0],epsilon)&&this.nodes[1].equivalent(e.nodes[1],epsilon))||(this.nodes[0].equivalent(e.nodes[1],epsilon)&&this.nodes[1].equivalent(e.nodes[0],epsilon)));}
	degenrate(epsilon){return this.nodes[0].equivalent(this.nodes[1], epsilon);}	
	// implements M.Edge (LineType)
	length(){return Math.sqrt(Math.pow(this.nodes[0].x-this.nodes[1].x,2)+Math.pow(this.nodes[0].y-this.nodes[1].y,2));}vector(originNode){if(originNode==undefined){return this.nodes[1].subtract(this.nodes[0]);}if(this.nodes[0].equivalent(originNode)){return this.nodes[1].subtract(this.nodes[0]);}return this.nodes[0].subtract(this.nodes[1]);}reflectionMatrix(){return new M.Matrix().reflection(this.nodes[1].subtract(this.nodes[0]),this.nodes[0]);}nearestPoint(point){var answer=this.nearestPointNormalTo(point);if(answer!==undefined){return answer;}return this.nodes.map(function(el){return {point:el,distance:el.distanceTo(point)};},this).sort(function(a,b){return a.distance-b.distance;}).shift().point;}nearestPointNormalTo(point){var p=this.nodes[0].distanceTo(this.nodes[1]);var u=((point.x-this.nodes[0].x)*(this.nodes[1].x-this.nodes[0].x)+(point.y-this.nodes[0].y)*(this.nodes[1].y-this.nodes[0].y))/(Math.pow(p,2));if(u<0||u>1.0){return undefined;}return new M.XY(this.nodes[0].x+u*(this.nodes[1].x-this.nodes[0].x),this.nodes[0].y+u*(this.nodes[1].y-this.nodes[0].y));}midpoint(){return new M.XY(0.5*(this.nodes[0].x+this.nodes[1].x),0.5*(this.nodes[0].y+this.nodes[1].y));}perpendicularBisector(){return new M.Line(this.midpoint(),this.vector().rotate90());}infiniteLine(){ return new M.Line(this.nodes[0],this.nodes[1].subtract(this.nodes[0]));}
}
/** Planar faces are counter-clockwise sequences of nodes already connected by edges */
export class PlanarFace extends M.Polygon{
	// this library is counting on the edges and nodes to be stored in counter-clockwise winding
	// graph;
	// nodes;
	// edges;
	// index;
	constructor(graph){
		super()
		this.graph = graph;
		this.nodes = [];
		this.edges = [];
	}
	sectors(){
		if(this.graph.unclean){ }
		var options = this.graph.sectors.filter(function(sector){
			return this.nodes.filter(function(node){ return node === sector.origin; },this).length > 0;
		},this);
		return this.edges.map(function(el,i){
			var nextEl = this.edges[(i+1)%this.edges.length];
			return options.filter(function(sector){return sector.edges[1] === el && sector.edges[0] === nextEl},this).shift();
		},this);
	}
	/** Returns an array of edges that are shared among both faces.
	 * @returns {PlanarEdge[]} array of edges in common
	 * @example
	 * var edges = face.commonEdges(anotherFace)
	 */
	commonEdges(face){
		return this.edges.filter(function(edge){
			return face.edges.filter(function(fe){ return fe === edge; },this).length > 0;
		},this);
	}
	/** Returns an array of edges in this face which are not shared by the other face.
	 * @returns {PlanarEdge[]} array of edges not in common
	 * @example
	 * var edges = face.uncommonEdges(anotherFace)
	 */
	uncommonEdges(face){
		return this.edges.filter(function(edge){
			return face.edges.filter(function(fe){ return fe === edge; },this).length == 0;
		},this);
	}
	/** Returns an array of adjacent faces which share one or more edges in common with this face.
	 * @returns {PlanarFace[]} array of adjacent faces
	 * @example
	 * var faces = face.edgeAdjacentFaces()
	 */
	edgeAdjacentFaces(){
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
	nodeAdjacentFaces(){
		var allFaces = this.graph.faces.filter(function(el){return !this.equivalent(el);},this);
		return this.nodes.map(function(node){
			for(var i = 0; i < allFaces.length; i++){
				var adjArray = allFaces[i].nodes.filter(function(nf){return node === nf;});
				if(adjArray.length > 0){ return allFaces[i]; }
			}
		}, this).filter(function(el){return el !== undefined;});
	}
	/** Assembles an array of arrays, beginning with one face, each subsequent array contains faces adjacent to the faces in the previous layer
	 * @returns {PlanarFace[]} array of adjacent faces
	 * @example
	 * [
	 * 	[CreaseFace]
	 * 	[CreaseFace, CreaseFace]
	 * 	[CreaseFace, CreaseFace, CreaseFace, CreaseFace]
	 * 	[CreaseFace, CreaseFace]
	 * 	[CreaseFace]
	 * ]
	 */
	adjacentFaceArray(){
		if(this.graph.unclean){ this.graph.clean(); } 
		else{ this.graph.faceArrayDidChange(); }
		var current = this;
		var visited = [current];
		var list = [[{"face":current,"parent":undefined}]];
		do{
			var totalRoundAdjacent = [];
			list[ list.length-1 ].forEach(function(current){
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
	adjacentFaceTree(){
		var array = this.adjacentFaceArray();
		array[0][0]["tree"] = new M.Tree(array[0][0].face);
		for(var r = 1; r < array.length; r++){
			for(var c = 0; c < array[r].length; c++){
				var newNode = new M.Tree(array[r][c].face);
				newNode.parent = array[r][c]["parent"]["tree"];
				newNode.parent.children.push(newNode);
				array[r][c]["tree"] = newNode
			}
		}
		return array[0][0]["tree"];
	}
}
/** a PlanarSector is the interior angle space made by two adjacent edges, counter-clockwise around their shared node, from edge[0] to edge[1] */
export class PlanarSector extends M.Sector{
	// the node in common with the edges
	// origin;
	// the indices of these 2 nodes directly correlate to 2 edges' indices
	// edges;
	// endPoints;
	// index;
	// counter-clockwise angle from edge 0 to edge 1 is in index 0. edge 1 to 0 is in index 1
	// constructor(origin, endPoints, edges){
	constructor(edge1, edge2){
		super(edge1.commonNodeWithEdge(edge2), undefined);
		if(this.origin === undefined){ return; }
		if(edge1 === edge2){ return; }
		this.edges = [edge1, edge2];
		this.endPoints = [
			(edge1.nodes[0] === this.origin) ? edge1.nodes[1] : edge1.nodes[0],
			(edge2.nodes[0] === this.origin) ? edge2.nodes[1] : edge2.nodes[0]
		];
	}
	equivalent(a){
		return( (a.edges[0].isSimilarToEdge(this.edges[0]) &&
		         a.edges[1].isSimilarToEdge(this.edges[1])) ||
		        (a.edges[0].isSimilarToEdge(this.edges[1]) &&
		         a.edges[1].isSimilarToEdge(this.edges[0])));
	}
}
/** Planar junctions mark intersections between edges */
export class PlanarJunction{
	// origin;
	// sectors and edges are sorted counter-clockwise
	// sectors;
	// edges;
	// index of this in graph.junctions[] array
	// index;
	// Planar Junction is invalid if the node is either isolated or a leaf node
	//  javascript constructors can't return null. if invalid: edges = [], sectors = []
	constructor(node){
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
	nodes(){
		return this.edges.map(function(edge){return edge.otherNode(this.origin);},this);
	}
	/** Returns an array of faces that encircle this junction, or, contain this junction's origin node. These are not sorted in any particular way.
	 * @returns {PlanarFace[]} array of faces
	 * @example
	 * var faces = junction.faces()
	 */
	faces(){
		if(this.origin.graph.unclean){ this.origin.graph.clean(); }
		return this.origin.graph.faces.filter(function(face){
			return face.nodes.filter(function(node){return node === this.origin;},this).length > 0;
		},this);
	}
	edgeAngles(){
		return this.nodes()
			.map(function(node){return new M.XY(node.x,node.y).subtract(this.origin);})
			.map(function(vec){return Math.atan2(vec.y, vec.x);},this);
	}
	edgeVectors(){
		return this.edges.map(function(el){return el.vector(this.origin);},this);
	}
	edgeVectorsNormalized(){
		return this.edges.map(function(el){return el.vector(this.origin).normalize();},this);
	}
	sectorWithEdges(a, b){
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
	interiorAngles(){
		return this.sectors.map(function(el){
			return el.angle();
		},this);
	}
	/** Locates the nearest clockwise adjacent node from the node supplied in the argument. If this was a clock centered at this node, if you pass in node for the number 3, it will return you the number 4.
	 * @returns {PlanarNode}
	 */
	clockwiseNode(fromNode){
		for(var i = 0; i < this.edges.length; i++){
			if(this.edges[i].otherNode(this.origin) === fromNode){
				return this.edges[ (i+this.edges.length-1)%this.edges.length ].otherNode(this.origin);
			}
		}
	}
	/** Locates the nearest counter-clockwise adjacent node from the node supplied in the argument. If this was a clock centered at this node, if you pass in node for the number 3, it will return you the number 2.
	 * @returns {PlanarNode}
	 */
	counterClockwiseNode(fromNode){
		for(var i = 0; i < this.edges.length; i++){
			if(this.edges[i].otherNode(this.origin) === fromNode){
				return this.edges[ (i+1)%this.edges.length ].otherNode(this.origin);
			}
		}
	}
	clockwiseEdge(fromEdge){
		var index = this.edges.indexOf(fromEdge);
		if(index === -1){ return undefined; }
		return this.edges[ (index+this.edges.length-1)%this.edges.length ];
	}
	counterClockwiseEdge(fromEdge){
		var index = this.edges.indexOf(fromEdge);
		if(index === -1){ return undefined; }
		return this.edges[ (index+1)%this.edges.length ];
	}
}
/** A planar graph is a set of nodes in 2D space, edges connecting them */
export class PlanarGraph extends Graph{
	// nodes;
	// edges;
	// faces;
	// sectors;
	// junctions;  // 1:1 map to nodes array indices
	// when subclassed, base types are overwritten
	// if nodes have been moved, it's possible for edges to overlap. this signals requiring a call to clean()
	// unclean;
	// not using these yet
	// didChange;

	constructor(){
		super();
		this.faces = [];
		this.sectors = [];
		this.junctions = [];
		this.nodeType = PlanarNode;
		this.edgeType = PlanarEdge;
		this.faceType = PlanarFace;
		this.sectorType = PlanarSector;
		this.junctionType = PlanarJunction;
	}

	/** Removes circular & duplicate edges, merges & removes duplicate nodes, fragments, generates faces junctions & sectors
	 * @returns {object} 'edges' the number of edges removed, and 'nodes' an XY location for every duplicate node merging
	 */
	clean(epsilon){
		this.unclean = false;
		// console.time("clean");
		var report = new PlanarClean();
		report.join( this.cleanDuplicateNodes(epsilon) );
		this.fragmentCollinearNodes(epsilon);
		report.join( this.cleanDuplicateNodes(epsilon) );
		report.join( this.fragment(epsilon) );
		report.join( this.cleanDuplicateNodes(epsilon) );
		report.join( this.cleanGraph() );
		report.join( this.cleanAllNodes() );
		this.nodeArrayDidChange();
		this.edgeArrayDidChange();
		this.generateJunctionsAndSectors();
		this.generateFaces();
		// console.timeEnd("clean");
		return report;
	}

	cleanEdges(edges, epsilon){
		this.unclean = false;
		// console.time("cleanEdges");
		var report = new PlanarClean();
		report.join( this.cleanDuplicateNodes(epsilon) );
		edges.map(function(edge){ return this.fragmentOneEdge(edge, epsilon); },this)
			.forEach(function(fragReport){ report.join(fragReport); },this);
		// report.join( this.fragment(epsilon) );
		report.join( this.cleanDuplicateNodes(epsilon) );
		report.join( this.cleanGraph() );
		report.join( this.cleanAllNodes() );
		this.nodeArrayDidChange();
		this.edgeArrayDidChange();
		this.generateJunctionsAndSectors();
		this.generateFaces();
		// console.timeEnd("cleanEdges");
		return report;
	}

	generateJunctionsAndSectors(){
		this.junctions = this.nodes
			.map(function(el){ return new this.junctionType(el); },this)
			.filter(function(el){ return el !== undefined && el.edges.length > 1; },this);
		this.sectors = this.junctions
			.map(function(el){ return el.sectors },this)
			.reduce(function(prev, curr){ return prev.concat(curr); },[])
			.filter(function(el){ return el !== undefined; },this);
		this.junctionArrayDidChange();
		this.sectorArrayDidChange();
	}
	generateFaces(){
		var faces = this.edges
			.map(function(edge){
				return [this.counterClockwiseCircuit(edge.nodes[0], edge.nodes[1]),
				        this.counterClockwiseCircuit(edge.nodes[1], edge.nodes[0])];
			},this)
			.reduce(function(prev, curr){ return prev.concat(curr); },[])
			.filter(function(el){ return el != undefined; },this)
			.map(function(el){ return this.faceFromCircuit(el); },this)
			.filter(function(el){ return el != undefined; },this);
		// filter out duplicate faces
		var uniqueFaces = [];
		for(var i = 0; i < faces.length; i++){
			var found = false;
			for(var j = 0; j < uniqueFaces.length; j++){
				if(faces[i].equivalent(uniqueFaces[j])){ found = true; break;}
			}
			if(!found){ uniqueFaces.push(faces[i]); }
		}
		this.faces = uniqueFaces;
		this.faceArrayDidChange();
	}

	///////////////////////////////////////////////
	// ADD PARTS
	///////////////////////////////////////////////

	/** Create a new isolated planar node at x,y
	 * @returns {PlanarNode} pointer to the node
	 */
	newPlanarNode(x, y){
		this.unclean = true;
		return (this.newNode()).setPosition(x, y);
	}
	/** Create two new nodes each with x,y locations and an edge between them
	 * @returns {PlanarEdge} pointer to the edge
	 */
	newPlanarEdge(x1, y1, x2, y2){
		this.unclean = true;
		var a = (this.newNode()).setPosition(x1, y1);
		var b = (this.newNode()).setPosition(x2, y2);
		return this.newEdge(a, b);
	}
	/** Create one node with an x,y location and an edge between it and an existing node
	 * @returns {PlanarEdge} pointer to the edge
	 */
	newPlanarEdgeFromNode(node, x, y){
		this.unclean = true;
		var newNode = (this.newNode()).setPosition(x, y);
		return this.newEdge(node, newNode);
	}
	/** Create one edge between two existing nodes
	 * @returns {PlanarEdge} pointer to the edge
	 */
	newPlanarEdgeBetweenNodes(a, b){
		this.unclean = true;
		return this.newEdge(a, b);
	}

	///////////////////////////////////////////////
	// REMOVE PARTS
	///////////////////////////////////////////////

	/** Removes all nodes, edges, and faces, returning the graph to it's original state */
	clear(){
		this.nodes = [];
		this.edges = [];
		this.faces = [];
		this.sectors = [];
		this.junctions = [];
		return this;
	}
	/** Removes an edge and also attempt to remove the two nodes left behind if they are otherwise unused
	 * @returns {PlanarClean} if the edge was removed
	 */
	removeEdge(edge){
		var len = this.edges.length;
		var endNodes = [edge.nodes[0], edge.nodes[1]];
		this.edges = this.edges.filter(function(el){ return el !== edge; });
		return new PlanarClean(0, len - this.edges.length)
			.join(this.cleanNode(endNodes[0]))
			.join(this.cleanNode(endNodes[1]))
	}
	/** Attempt to remove an edge if one is found that connects the 2 nodes supplied, and also attempt to remove the two nodes left behind if they are otherwise unused
	 * @returns {number} how many edges were removed
	 */
	removeEdgeBetween(node1, node2){
		var len = this.edges.length;
		this.edges = this.edges.filter(function(el){ 
			return !((el.nodes[0]===node1&&el.nodes[1]===node2) ||
					 (el.nodes[0]===node2&&el.nodes[1]===node1) );
		});
		this.edgeArrayDidChange();
		return new PlanarClean(0, len - this.edges.length)
			.join(this.cleanNode(node1))
			.join(this.cleanNode(node2));
	}
	/** This will remove a node only if one of two cases: isolated, or the node is collinear to only two edges
	 * @returns {PlanarClean} the number of nodes and edges removed
	 */
	cleanNode(node){
		var edges = this.edges.filter(function(e){return e.nodes[0]===node||e.nodes[1]===node;},this);
		switch (edges.length){
			case 0:  // remove isolated node
				this.nodes = this.nodes.filter(function(el){ return el !== node; });
				this.nodeArrayDidChange();
				return new PlanarClean(1, 0);
			case 2:  // remove collinear node between two edges. merge two edges into one
				var farNodes = [(edges[0].uncommonNodeWithEdge(edges[1])), 
								(edges[1].uncommonNodeWithEdge(edges[0]))];
				if(farNodes[0] === undefined || farNodes[1] === undefined){ return new PlanarClean(); }
				var span = new M.Edge(farNodes[0].x, farNodes[0].y, farNodes[1].x, farNodes[1].y);
				if(span.collinear(node)){
					edges[0].nodes = [farNodes[0], farNodes[1]];
					this.edges = this.edges.filter(function(el){ return el !== edges[1]; });
					this.nodes = this.nodes.filter(function(el){ return el !== node; });
					this.nodeArrayDidChange();
					this.edgeArrayDidChange();
					return new PlanarClean(1, 1);
				}
			default: return new PlanarClean();
		}
	}
	/** Removes all isolated nodes and performs cleanNode() on every node
	 * @returns {PlanarClean} how many nodes were removed
	 */
	cleanAllNodes(){
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
					var farNodes = [(edges[0].uncommonNodeWithEdge(edges[1])), 
									(edges[1].uncommonNodeWithEdge(edges[0]))]
					var span = new M.Edge(farNodes[0].x, farNodes[0].y, farNodes[1].x, farNodes[1].y);
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
	cleanDuplicateNodes(epsilon){
		var EPSILON_HIGH = 0.00000001;
		if(epsilon == undefined){ epsilon = EPSILON_HIGH; }
		var tree = new rbush();
		tree.load(this.nodes.map(function(el){
			return {minX:el.x-epsilon, minY:el.y-epsilon, maxX:el.x+epsilon, maxY:el.y+epsilon,node:el};
		}));
		// iterate over nodes. if a node is too close to another, before removing it, make sure:
		// - it is not in "remainList" (it needs to stay, another node is counting on being replaced for it)
		// - the node it's attempting to be replaced by is not in "removeList"
		var remainList = [], removeList = [];
		var mergeList = []
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
		return mergeList
			.map(function(el){
				// merge two PlanarNodes, append the duplicate node XY to the merged node list
				return new PlanarClean(-1)
					.join(this.mergeNodes(el['remain'], el['remove']))
					.duplicateNodes([new M.XY(el['remove'].x, el['remove'].y)]);
			},this)
			.reduce(function(prev,curr){ return prev.join(curr); },new PlanarClean());
	}

	///////////////////////////////////////////////
	// GET PARTS
	///////////////////////////////////////////////

	/** Locate the nearest node, edge, face, junction, sector to a supplied point
	 * @returns {{'node','edge','face','junction','sector'}} object with keys node, edge, face, junction, sector with their objects, or undefined if not found
	 */
	nearest(a,b){
		var point = gimme1XY(a,b);
		var face = this.faceContainingPoint(point);
		var edgeArray = this.edges
			.map(function(edge){
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
		return {
			'node':node,
			'edge':edge,
			'face':face,
			'junction':junction,
			'sector':sector
		};
	}
	faceContainingPoint(point){
		for(var f = 0; f < this.faces.length; f++){
			if(this.faces[f].contains(point)){
				return this.faces[f];
			}
		}
	}
	nearestNodes(quantity, a,b){
		var point = gimme1XY(a,b);
		var sortedNodes = this.nodes
			.map(function(el){ return {'node':el, 'distance':point.distanceTo(el)};},this)
			.sort(function(a,b){ return a.distance - b.distance;})
			.map(function(el){ return el['node'];},this);
		if(quantity > sortedNodes.length){ return sortedNodes; }
		return sortedNodes.slice(0, quantity);
	}
	nearestEdge(edges, a, b){
		var point = gimme1XY(a,b);
		edges.map(function(edge){
				return {edge:edge, distance:edge.nearestPoint(point).distanceTo(point)};
			},this)
			.sort(function(a,b){ return a.distance - b.distance; })
			.slice(0);
	}
	nearestEdges(quantity, a, b){
		var point = gimme1XY(a,b);
		var sortedEdges = this.edges
			.map(function(edge){
				return {edge:edge, distance:edge.nearestPoint(point).distanceTo(point)};
			},this)
			.sort(function(a,b){ return a.distance - b.distance; });
		if(quantity > sortedEdges.length){ return sortedEdges; }
		return sortedEdges.slice(0, quantity);
	}
	nearestEdgeWithPoints(a, b, c, d){
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
		var edge = this.getEdgeConnectingNodes(nears[0][0], nears[1][0]);
		if(edge !== undefined) return edge;
		// check more
		for(var cou = 3; cou < 20; cou+=3){
			// three at a time, check one against one
			for(var i = 0; i < nears[0].length; i++){
				for(var j = 0; j < nears[1].length; j++){
					if(i !== j){
						var edge = this.getEdgeConnectingNodes(nears[0][i], nears[1][j]);
						if(edge !== undefined) return edge;
					}
				}
			}
		}
	}

	/** Create a rectangle bounding box around all the nodes, defined by rectangle dimensions and the location of one corner
	 * @returns {origin:{x,y},size:{width,height}} Rect type describing the bounds of the nodes
	 */
	bounds(){
		if(this.nodes === undefined || this.nodes.length === 0){ return undefined; }
		var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
		this.nodes.forEach(function(el){
			if(el.x>maxX){ maxX=el.x; } if(el.x<minX){ minX=el.x; }
			if(el.y>maxY){ maxY=el.y; } if(el.y<minY){ minY=el.y; }
		});
		return new M.Rect(minX, minY, maxX-minX, maxY-minY);
	}

	/** Without changing the graph, this function collects the point location of every intersection between crossing edges.
	 *  This should return an empty array for a valid graph.
	 * @returns {XY[]} array of XY, the location of intersections
	 */
	getEdgeIntersections(epsilon){
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

	///////////////////////////////////////////////
	//
	///////////////////////////////////////////////

	scaleToUnitHeight(){
		var bounds = this.bounds();
		var scale = 1 / (bounds.size.height - bounds.origin.y);
		this.nodes.forEach(function(n){
			n.x = (n.x - bounds.origin.x) * scale;
			n.y = (n.y - bounds.origin.y) * scale;
		},this);
	}

	scaleToUnitWidth(){
		var bounds = this.bounds();
		var scale = 1 / (bounds.size.width - bounds.origin.x);
		this.nodes.forEach(function(n){
			n.x = (n.x - bounds.origin.x) * scale;
			n.y = (n.y - bounds.origin.y) * scale;
		},this);
	}

	///////////////////////////////////////////////
	// FRAGMENT, FACES
	///////////////////////////////////////////////

	/** Fragment looks at every edge and one by one removes 2 crossing edges and replaces them with a node at their intersection and 4 edges connecting their original endpoints to the intersection.
	 * @returns {XY[]} array of XY locations of all the intersection locations
	 */
	fragment(epsilon){
		var sortFunction = function(a,b){ if(a.commonX(b,epsilon)){ return a.y-b.y; } return a.x-b.x; }
		var EPSILON_HIGH = 0.000000001;
		if(epsilon == undefined){ epsilon = EPSILON_HIGH; }
		this.edgeArrayDidChange();
		// fill "crossings", an array of objects with intersections and the 2 edges that cross
		var crossings = [];
		for(var i = 0; i < this.edges.length-1; i++){
			for(var j = i+1; j < this.edges.length; j++){
				var intersection = this.edges[i].intersection(this.edges[j], epsilon);
				if(intersection != undefined){
					crossings.push({point:intersection, edges:[this.edges[i], this.edges[j]]});
				}
			}
		}
		// merge points that are within an epsilon range of each other, and merge their associated edges too
		for(var i = 0; i < crossings.length-1; i++){
			for(var j = crossings.length-1; j > i; j--){
				if(crossings[i].point.equivalent(crossings[j].point, epsilon)){
					crossings[i].point = crossings[i].point.lerp(crossings[j].point, 0.5);
					crossings[i].edges = crossings[i].edges.concat(crossings[j].edges);
					crossings.splice(j, 1);
				}
			}
		}
		// swap out intersection points with actual new nodes on the graph
		// refactor data in "crossings" into "edgesClips", one edge and all its associated crossings
		var edgesClips = Array.apply(null, Array(this.edges.length)).map(function(el){return [];});
		crossings.map(function(el){
				return {node:(this.newNode()).setPosition(el.point.x, el.point.y), edges:el.edges};
			},this).forEach(function(crossing){
				crossing.edges.forEach(function(edge){
					edgesClips[ edge.index ].push(crossing.node);
				},this);
			},this);
		// prepare data, sort points, rebuild edges
		var rebuild = edgesClips
			.map(function(el, i){
				el.sort(sortFunction);
				var endpoints = this.edges[i].nodes.slice().sort(sortFunction);
				return {edge:this.edges[i], endpoints:endpoints, innerPoints:el };
			},this)
			.filter(function(el){ return el.innerPoints.length != 0; },this)
			.map(function(el){
				return this.rebuildEdge(el.edge, el.endpoints, el.innerPoints, epsilon);
			},this);
		this.removeIsolatedNodes();
		this.cleanDuplicateNodes();
		// this.cleanGraph();
		return new PlanarClean();
	}

	fragmentOneEdge(oneEdge, epsilon){
		var sortFunction = function(a,b){ if(a.commonX(b,epsilon)){ return a.y-b.y; } return a.x-b.x; }
		var EPSILON_HIGH = 0.000000001;
		if(epsilon == undefined){ epsilon = EPSILON_HIGH; }
		this.edgeArrayDidChange();
		// fill "crossings", an array of objects with intersections and the 2 edges that cross
		var crossings = this.edges
			.filter(function(edge){ return edge !== oneEdge; },this)
			.map(function(edge){
				return {point:oneEdge.intersection(edge, epsilon), edges:[oneEdge, edge]};
			},this);
		// merge points that are within an epsilon range of each other, and merge their associated edges too
		for(var i = 0; i < crossings.length-1; i++){
			for(var j = crossings.length-1; j > i; j--){
				if(crossings[i].point.equivalent(crossings[j].point, epsilon)){
					crossings[i].point = crossings[i].point.lerp(crossings[j].point, 0.5);
					crossings[i].edges = crossings[i].edges.concat(crossings[j].edges);
					crossings.splice(j, 1);
				}
			}
		}
		// swap out intersection points with actual new nodes on the graph
		// refactor data in "crossings" into "edgesClips", one edge and all its associated crossings
		var edgesClips = Array.apply(null, Array(this.edges.length)).map(function(el){return [];});
		crossings.map(function(el){
				return {node:this.newNode().setPosition(el.point.x, el.point.y), edges:el.edges};
			},this).forEach(function(crossing){
				crossing.edges.forEach(function(edge){
					edgesClips[ edge.index ].push(crossing.node);
				},this);
			},this);
		// prepare data, sort points, rebuild edges
		var rebuild = edgesClips
			.map(function(el, i){
				el.sort(sortFunction);
				var endpoints = this.edges[i].nodes.slice().sort(sortFunction);
				return {edge:this.edges[i], endpoints:endpoints, innerPoints:el };
			},this)
			.filter(function(el){ return el.innerPoints.length != 0; },this)
			.map(function(el){
				return this.rebuildEdge(el.edge, el.endpoints, el.innerPoints, epsilon);
			},this);
		this.removeIsolatedNodes();
		this.cleanDuplicateNodes();
		// this.cleanGraph();
		return new PlanarClean();
	}
	/** This function targets a single edge and performs the fragment operation on all crossing edges.
	 * @returns {XY[]} array of XY locations of all the intersection locations
	 */
	fragmentCrossingEdges(edge, epsilon){
		var report = new PlanarClean();
		var intersections = this.edgeCrossingEdges(edge, epsilon);
		if(intersections.length == 0){ return report; }
		var edgesLength = this.edges.length;
		report.nodes.fragment = intersections.map(function(el){ return new M.XY(el.point.x, el.point.y);});
		// iterate through intersections, rebuild edges in order
		var newLineNodes = intersections.map(function(el){
			return (this.newNode()).setPosition(el.point.x, el.point.y);
		},this);
		var isolated = intersections
			.map(function(el,i){ return this.rebuildEdge(el.edge, el.edge.nodes, [newLineNodes[i]], epsilon);},this)
			.map(function(el){ return el.nodes })
			.reduce(function(prev,curr){ return prev.concat(curr); },[]);
			// .forEach(function(node){ this.removeNodeIfIsolated(node); },this);
		// important: sortedEndpts are sorted in the same order as edge.crossingEdges
		var sortedEndpts = edge.nodes.slice().sort(function(a,b){
			if(a.commonX(b,epsilon)){ return a.y-b.y; } return a.x-b.x;
		});
		isolated = isolated.concat(this.rebuildEdge(edge, sortedEndpts, newLineNodes, epsilon).nodes)
		// isolated.forEach(function(node){ this.removeNodeIfIsolated(node); },this);
		report.edges.total += edgesLength - this.edges.length;
		return report;
	}

	/** Returns an array of edges that cross this edge. These are edges which are considered "invalid"
	 * @returns {{edge, point}[]} array of objects containing the crossing edge and point of intersection
	 * @example
	 * var edges = edge.crossingEdges()
	 */
	edgeCrossingEdges(edge, epsilon){
		var EPSILON_HIGH = 0.000000001;
		if(epsilon == undefined){ epsilon = EPSILON_HIGH; }
		var myXs = edge.nodes.map(function(n){return n.x;}).sort(function(a,b){return a-b});
		var myYs = edge.nodes.map(function(n){return n.y;}).sort(function(a,b){return a-b});
		myXs[0] -= epsilon; myXs[1] += epsilon; myYs[0] -= epsilon; myYs[1] += epsilon;
		return this.edges
			.filter(function(el){ return !(
				(el.nodes[0].x < myXs[0] && el.nodes[1].x < myXs[0]) ||
				(el.nodes[0].x > myXs[1] && el.nodes[1].x > myXs[1]) ||
				(el.nodes[0].y < myYs[0] && el.nodes[1].y < myYs[0]) ||
				(el.nodes[0].y > myYs[1] && el.nodes[1].y > myYs[1])
				)},this)
			.filter(function(el){ return edge !== el}, this)
			.map(function(el){ return {edge:el, point:edge.intersection(el, epsilon)} }, this)
			.filter(function(el){ return el.point != undefined})
			.sort(function(a,b){
				if(a.point.commonX(b.point,epsilon)){ return a.point.y-b.point.y; }
				return a.point.x-b.point.x;
			});
	}

	/** This rebuilds an edge by inserting collinear points between its endpoints and constructs many edges between them.
	 *  This is taking for granted that sorting has already happened. 1) innerpoints are sorted and 2) oldEndpts are sorted so that the first can be added to the beginning of innerpoints and the second to the end, and the product is a fully-sorted array
	 * @returns {PlanarNode[]} array of locally-isolated nodes, created by edge-removal. further checks should be done before removing to ensure they are not still being used by other edges.
	 */
	rebuildEdge(oldEdge, oldEndpts, innerpoints, epsilon){
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

	fragmentCollinearNodes(epsilon){
		var EPSILON_HIGH = 0.000000001;
		if(epsilon == undefined){ epsilon = EPSILON_HIGH; }
		var tree = new rbush();
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
	counterClockwiseCircuit(node1, node2){
		if(node1 === undefined || node2 === undefined){ return undefined; }
		var incidentEdge = node1.graph.getEdgeConnectingNodes(node1, node2);
		if(incidentEdge == undefined) { return undefined; }  // nodes are not adjacent
		var pairs = [];
		var lastNode = node1;
		var travelingNode = node2;
		var visitedList = [lastNode];
		var nextWalk = incidentEdge;
		pairs.push(nextWalk);
		do{
			visitedList.push(travelingNode);
			var travelingNodeJunction = travelingNode.junction();
			if(travelingNodeJunction !== undefined){ // just don't go down cul de sacs
				// walking counter-clockwise means to double back along the CLOCKWISE edge
				nextWalk = travelingNodeJunction.clockwiseEdge(nextWalk);
			}
			pairs.push(nextWalk);
			lastNode = travelingNode;
			travelingNode = nextWalk.otherNode(lastNode);
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
	faceFromCircuit(circuit){
		var SUM_ANGLE_EPSILON = 0.000000000001;
		// var face = new this.faceType(this);
		if(circuit == undefined || circuit.length < 3){ return undefined; }
		var face = new this.faceType(this);
		face.edges = circuit;
		face.nodes = circuit.map(function(el,i){
			var nextEl = circuit[ (i+1)%circuit.length ];
			return el.uncommonNodeWithEdge( nextEl );
		});
		var angleSum = face.nodes
			.map(function(el,i){
				var el1 = face.nodes[ (i+1)%face.nodes.length ];
				var el2 = face.nodes[ (i+2)%face.nodes.length ];
				return M.clockwiseInteriorAngle(new M.XY(el.x-el1.x, el.y-el1.y), new M.XY(el2.x-el1.x, el2.y-el1.y));
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
	copy(){
		this.nodeArrayDidChange();
		this.edgeArrayDidChange();
		this.faceArrayDidChange();
		this.sectorArrayDidChange();
		this.junctionArrayDidChange();
		var g = new PlanarGraph();
		for(var i = 0; i < this.nodes.length; i++){
			var n = g.addNode(new PlanarNode(g));
			Object.assign(n, this.nodes[i]);
			n.graph = g;  n.index = i;
		}
		for(var i = 0; i < this.edges.length; i++){
			var index = [this.edges[i].nodes[0].index, this.edges[i].nodes[1].index];
			var e = g.addEdge(new PlanarEdge(g, g.nodes[index[0]], g.nodes[index[1]]));
			Object.assign(e, this.edges[i]);
			e.graph = g;  e.index = i;
			e.nodes = [g.nodes[index[0]], g.nodes[index[1]]];
		}
		for(var i = 0; i < this.faces.length; i++){
			var f = new PlanarFace(g);
			Object.assign(f, this.faces[i]);
			for(var j=0;j<this.faces[i].nodes.length;j++){f.nodes.push(f.nodes[this.faces[i].nodes[j].index]);}
			for(var j=0;j<this.faces[i].edges.length;j++){f.edges.push(f.edges[this.faces[i].edges[j].index]);}
			f.graph = g;  f.index = i;
			g.faces.push(f);
		}
		g.sectors = this.sectors.map(function(sector,i){
			var gSecEdges = sector.edges.map(function(edge){ return g.edges[edge.index]; },this);
			var s = new PlanarSector(gSecEdges[0], gSecEdges[1]);
			s.index = i;
			return s;
		},this);
		g.junctions = this.junctions.map(function(junction,i){
			var j = new PlanarJunction(undefined);
			// Object.assign(j, this.junctions[i]);
			j.origin = g.nodes[ junction.origin.index ];
			j.sectors = junction.sectors.map(function(sector){ return g.sectors[sector.index]; },this);
			j.edges = junction.edges.map(function(edge){ return g.edges[edge.index]; },this);
			j.index = i;
			return j;
		},this);
		return g;
	}

	/** convert this planar graph into an array of polylines, connecting as many edges as possible
	 * @returns {Polyline} 
	 */
	polylines(){
		return this.connectedGraphs().map(function(graph){
			if(graph.edges.length == 0){ return undefined; }
			if(graph.edges.length == 1){ return graph.edges[0].nodes.map(function(n){return n.copy();},this); }
			var nodes = [graph.edges[0].uncommonNodeWithEdge(graph.edges[1])];
			for(var i = 0; i < graph.edges.length-1; i++){
				var edge = graph.edges[ i ];
				var nextEdge = graph.edges[ (i+1) ];
				nodes.push(edge.commonNodeWithEdge(nextEdge));
			}
			nodes.push(graph.edges[ graph.edges.length-1 ].uncommonNodeWithEdge(graph.edges[ graph.edges.length-2 ]));
			return nodes.map(function(el){return el.copy();},this);
		},this)
		.filter(function(el){return el != undefined;},this)
		.map(function(line){
			var p = new M.Polyline();
			p.nodes = line;
			return p;
		},this);
	}

	faceArrayDidChange(){for(var i=0;i<this.faces.length; i++){this.faces[i].index=i;}}
	sectorArrayDidChange(){for(var i=0;i<this.sectors.length;i++){this.sectors[i].index=i;}}
	junctionArrayDidChange(){for(var i=0;i<this.junctions.length;i++){this.junctions[i].index=i;}}
}
