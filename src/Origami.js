'use strict';

import * as Geometry from './geometry.js'

class Fold{
	static square(meta){
		var author = ""
		if(meta != undefined){
			if(meta.author != undefined){ author = meta.author; }
		}
		return {
			"file_spec":1,
			"file_creator":"Rabbit Ear",
			"file_author":author,
			"file_classes":["singleModel"],
			"vertices_coords":[[0,0],[1,0],[1,1],[0,1]],
			"edges_vertices":[[0,1],[1,2],[2,3],[3,0]],
			"edges_assignment":["B","B","B","B"],
			"faces_vertices":[[0,1,2,3]],
			"faces_layer":[0],
			"faces_matrix":[[1, 0, 0, 1, 0, 0]],
			"faces_coloring":[0]
		};
	}
}

function makeFaceClipLines(foldFile, line){
	// use each face's matrix to transform the input line
	//   from folded coords to crease pattern coords
	var matrices = foldFile["faces_matrix"].map(function(n){ 
			return new Geometry.Matrix(n[0], n[1], n[2], n[3], n[4], n[5]);
		},this);
	return foldFile.faces_vertices.map(function(nodeArray){
		// from face vertex indices, create faces with vertex geometry
		var points = nodeArray
			.map(function(n){ return foldFile.vertices_coords[n]; },this)
			.map(function(p){ return {x:p[0], y:p[1]} })
		// convex hull algorithm turns faces into a convex polygon object
		return RabbitEar.Geometry.ConvexPolygon.convexHull(points);
	},this).map(function(poly, i){
		// clip line inside convex polygon. or undefined if no intersection
		return poly.clipLine( line.transform(matrices[i].inverse()) );
	},this).map(function(edge){
		// convert to [ [x,y], [x,y] ]. or undefined if no intersection
		if(edge != undefined){return [[edge.nodes[0].x,edge.nodes[0].y],[edge.nodes[1].x,edge.nodes[1].y]];}
		return undefined;
	},this);
}

export default class Origami{

	constructor(){
		this.unfolded = Fold.square();
		this.folded = Fold.square();
	}

	crease(line){
		var faces_clipLines = makeFaceClipLines(this.unfolded, line);
