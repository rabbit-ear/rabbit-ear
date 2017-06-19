/// <reference path="planarGraph.ts"/>

"use strict";
// var LOG;

// for purposes of modeling origami crease patterns
// creases are lines (edges) with endpoints v1, v2 (indices in vertex array)
class CreasePattern extends PlanarGraph{

	clockwiseNodeEdges:any[];
	starterLocations:any[];
	interestingPoints:any[];

	constructor(){
		super();
		this.faces = [];
		this.clockwiseNodeEdges = [];

		this.starterLocations = [
				{x:0.0, y:0.0},
				{x:0.0, y:1.0},
				{x:1.0, y:0.0},
				{x:1.0, y:1.0},
				{x:0.5, y:0.5},
				{x:0.0, y:0.5},
				{x:0.5, y:0.0},
				{x:1.0, y:0.5},
				{x:0.5, y:1.0}
		];

		this.interestingPoints = this.starterLocations;
	}

	import(cp){
		this.nodes = cp.nodes.slice();
		this.edges = cp.edges.slice();
		this.faces = cp.faces.slice();
		this.clockwiseNodeEdges = cp.clockwiseNodeEdges.slice();
		this.interestingPoints = cp.interestingPoints.slice();
	}

	///////////////////////////////////////////////////////////////
	// ADD PARTS

	crease(x1, y1, x2, y2){  // floats
		// if crease exists at x1 y1, or at x2 y2
		// addEdgeFromVertex
		// or addEdgeFromExistingVertices

		// else
		this.addEdgeWithVertices(x1, y1, x2, y2);
	}

	///////////////////////////////////////////////////////////////
	// CLEAN  /  REMOVE PARTS

	clean(){
		// check if any nodes are free floating and not connected to any edges, remove them
		var superReturn = super.clean();
		var intersections = super.chop();
		// this.interestingPoints = this.nodes;
		this.interestingPoints = this.appendUniquePoints(this.nodes, this.starterLocations);
		return superReturn;
	}

	clear(){
		super.clear();
		this.faces = [];
		this.clockwiseNodeEdges = [];
		this.interestingPoints = this.starterLocations;
	}

	isCornerNode(x, y){
		// var E = EPSILON;
		// if( y < E ) return 1;
		// if( x > 1.0 - E ) return 2;
		// if( y > 1.0 - E ) return 3;
		// if( x < E ) return 4;
		// return undefined;
	}

	isBoundaryNode(x, y){
		var E = .1;//EPSILON;
		if( y < E ) return 1;
		if( x > 1.0 - E ) return 2;
		if( y > 1.0 - E ) return 3;
		if( x < E ) return 4;
		return undefined;
	}

	// vertexLiesOnEdge(vIndex, intersect){  // uint, Vertex
	// 	var v = this.nodes[vIndex];
	// 	return this.vertexLiesOnEdge(v, intersect);
	// }

	trySnapVertex(newVertex, snapRadius){ // newVertex has {x:__, y:__}
		// find the closest interesting point to the vertex
		var closestDistance = undefined;
		var closestIndex = undefined;
		for(var i = 0; i < this.interestingPoints.length; i++){
			// we could improve this, this.verticesEquivalent could return the distance itself, saving calculations
			if(this.verticesEquivalent(newVertex, this.interestingPoints[i], snapRadius)){
				var thisDistance = Math.sqrt(Math.pow(newVertex.x-this.interestingPoints[i].x,2) + 
				                             Math.pow(newVertex.y-this.interestingPoints[i].y,2));
				if(closestIndex == undefined || (thisDistance < closestDistance)){
					closestIndex = i;
					closestDistance = thisDistance;
				}
			}
		}
		if(closestIndex != undefined){
			return this.interestingPoints[closestIndex];
		}
		return newVertex;
	}

	snapAll(snapRadius){ // probably should not be used! it merges points that are simply near each other
		for(var i = 0; i < this.nodes.length; i++){
			for(var j = 0; j < this.interestingPoints.length; j++){
				if(this.nodes[i] != undefined && this.verticesEquivalent(this.nodes[i], this.interestingPoints[j], snapRadius)){
					this.nodes[i].x = this.interestingPoints[j].x;
					this.nodes[i].y = this.interestingPoints[j].y;
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
		var adjacentEdges = this.nodes[nodeIndex].adjacent.edges;
		adjacentEdges.sort(function(a,b){return (a.angle > b.angle)?1:((b.angle > a.angle)?-1:0);});
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
		var adjacentEdges = this.nodes[nodeIndex].adjacent.edges;
		adjacentEdges.sort(function(a,b){return (a.angle > b.angle)?1:((b.angle > a.angle)?-1:0);});
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
	// 	if(LOG) console.log('crease pattern: cleanIntersections()');
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
			var a = this.edges[i].node[0];
			var b = this.edges[i].node[1];
			var x1 = (this.nodes[a].x * scale).toFixed(4);
			var y1 = (this.nodes[a].y * scale).toFixed(4);
			var x2 = (this.nodes[b].x * scale).toFixed(4);
			var y2 = (this.nodes[b].y * scale).toFixed(4);
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
		this.addEdgeWithVertices(1, 0, 0, 1);
		this.addEdgeWithVertices(0, 1, .70711, .70711);
		this.addEdgeWithVertices(0, 1, .29288, .2929);
		this.addEdgeWithVertices(1, 0, .29289, .2929);
		this.addEdgeWithVertices(1, 0, .7071, .7071);
		this.addEdgeWithVertices(.29289, .2929, 0, 0);
		this.addEdgeWithVertices(.70711, .7071, 1, 1);
		this.addEdgeWithVertices(.70711, .70711, 1, .70711);
		this.addEdgeWithVertices(.29288, .2929, .29288, 0);
		this.clean();
	}
	birdBase(){
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