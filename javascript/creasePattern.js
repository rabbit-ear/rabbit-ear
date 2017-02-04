"use strict";
// for purposes of modeling origami crease patterns
// creases are lines (edges) with endpoints v1, v2 (indices in vertex array)
class CreasePattern extends PlanarGraph{

	constructor(){
		super();
		this.faces = [];
		this.clockwiseNodeEdges = [];

		this.verbose = false;
	}

	///////////////////////////////////////////////////////////////
	// ADD PARTS

	creaseBetweenPoints(x1, y1, x2, y2){  // floats
		// if crease exists at x1 y1, or at x2 y2
		// addEdgeFromVertex
		// or addEdgeFromExistingVertices

		// else
		addEdgeWithVertices(x1, y1, x2, y2);
	}

	///////////////////////////////////////////////////////////////
	// CLEAN  /  REMOVE PARTS

	clean(){
		super.clean();
	}

	isCornerNode(x, y){
		// var E = VERTEX_DUPLICATE_EPSILON;
		// if( y < E ) return 1;
		// if( x > 1.0 - E ) return 2;
		// if( y > 1.0 - E ) return 3;
		// if( x < E ) return 4;
		// return undefined;
	}

	isBoundaryNode(x, y){
		var E = .1;//VERTEX_DUPLICATE_EPSILON;
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

	findInterestingPoints(){
		return [
			{x:0.0, y:0.0},
			{x:0.0, y:1.0},
			{x:1.0, y:0.0},
			{x:1.0, y:1.0},
			{x:0.5, y:0.5},
			{x:0.0, y:0.5},
			{x:0.5, y:0.0},
			{x:1.0, y:0.5},
			{x:0.5, y:1.0}
		]
	}

	snap(){
		var interestingPoints = this.findInterestingPoints();
		for(var i = 0; i < this.nodes.length; i++){
			for(var j = 0; j < interestingPoints.length; j++){
				if(this.nodes[i] != undefined && this.verticesEquivalent(this.nodes[i], interestingPoints[j], 0.08)){
					this.nodes[i].x = interestingPoints[j].x;
					this.nodes[i].y = interestingPoints[j].y;
				}				
			}
		}
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