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

		// 1. vertices_intersections
		// [ boolean, boolean, boolean, boolean, boolean, boolean]
		var faces_clipLines = makeFaceClipLines(this.unfolded, line);
    // input is a fold format JSON and a Robby line
    // output is an faces_ array of pairs of [x, y] points, or undefined

    // 2. walk around each face with a clipped edge.
    //     check clipped edge endpoints for intersection with edges and vertices in order
    //     initialize new vertex set with old vertices
    //     make dictionary 
    //       from edges (in verted index sorted order) 
    //       to vertex indices
    //     add new vertices when necessary and translate faces_line to vertex index pairs
    var output = cleanClipSegments(this.unfold, faces_clipLine);
    var faces_clipSegmentByIndex = output.faces_clipSegmentByIndex;
    var new_vertices_coords      = output.vertices_coords;

    //     (each clip line goes from [(x, y), (x, y)] to [v1, v2])
    //     walk around each face and build split faces side1, side2 using new vertices_coords
    var output = splitFaces(this.unfold, faces_clipLine);
    var faces_splitFaces    = output.faces_splitFaces;
    var new_vertices_coords = output.vertices_coords;

    // 3.5. draw lines on crease pattern
    //  - using faces_lines, draw these on crease pattern
    // 
    // now user clicks on a face:
    // -------
    // we loop through faces, checking if user clicked in face. choose top most one f
    // then check which side was click by checking click intersection with faces_pieces[f]
    // NOW WE KNOW which side1 or side2 inside all of faces_pieces will be the one that moves

    var faces_splitFaces_move = markMovingFaces(this.unfold, faces_splitFaces, new_vertices_coords, point);
    // point is click

		// var creasePattern = new CreasePattern().importFoldFile(this.unfolded);
		// creasePattern.crease(line);
		//


	}






	// creaseFolded(line){

	// 	var matrices = this.folded["faces_matrices"].map(function(n){ 
	// 		return new Geometry.Matrix(n[0], n[1], n[2], n[3], n[4], n[5]);
	// 	},this);
	// 	var coloring = this.folded["faces_coloring"];

	// 	var faces = this.folded.faces_vertices.map(function(nodeArray){
	// 		var points = nodeArray
	// 			.map(function(n){ return this.folded.vertices_coords[n]; },this)
	// 			.map(function(p){ return {x:p[0], y:p[1]} })
	// 		return RabbitEar.Geometry.ConvexPolygon.convexHull(points);
	// 	},this);

	// 	var polygonClipLines = faces.map(function(f,i){
	// 		return { edge: f.clipLine(line), 
	// 		         transform: matrices[i],
	// 		         coloring: coloring[i] };
	// 		},this)
	// 		.filter(function(el){ return el.edge != undefined; },this);

	// 	var cpFoldLines = polygonClipLines.map(function(clip){
	// 		return { edge: clip.edge.transform(clip.transform.inverse()),
	// 		         mountain: (clip.coloring == 0) ? true : false }
	// 	},this);

	// 	// amend the crease pattern with new creases
	// 	var cp = new CreasePattern().importFoldFile(this.unfolded);
	// 	cpFoldLines.forEach(function(foldLine){
	// 		var crease = cp.crease(foldLine.edge);
	// 		if(crease != undefined){ 
	// 			if(foldLine.mountain){ crease.mountain(); }
	// 			else{ crease.valley(); }
	// 		}
	// 	});
	// 	cp.clean();

	// 	this.unfolded = cp.exportFoldFile();
	// 	this.folded = cp.fold();
	// 	// this.unfolded = cp.exportFoldFile();
	// }
}
