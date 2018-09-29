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
			"faces_matrices":[[1, 0, 0, 1, 0, 0]],
			"faces_coloring":[0]
		};
	}
}



function clipLineOnFaces(foldFile, line){
	return foldFile.faces_vertices.map(function(nodeArray){
		var points = nodeArray
			.map(function(n){ return foldFile.vertices_coords[n]; },this)
			.map(function(p){ return {x:p[0], y:p[1]} })
		return RabbitEar.Geometry.ConvexPolygon.convexHull(points);
	},this).filter(function(face, i){
		return face.clipLine( line.transform(matrices[i].inverse()) ) != undefined;
	},this);

}



export default class Origami{

	constructor(){
		// super();
		this.unfolded = Fold.square();
		this.folded = Fold.square();
	}

	crease(line){

		// 1. vertices_intersections
		// [ boolean, boolean, boolean, boolean, boolean, boolean]
		var newFaceClipLines = clipLineOnFaces(this.unfolded, line);

		// 2. output edges_intersections
		// possible cleaning step

		// 3. walk around each face. for each edge and vertex, in order, was there an intersection? 2 or 0, 1 is treated as 0.

		// 3.5. draw lines on crease pattern
		//  - using faces_lines, draw these on crease pattern

		// 4. build faces_vertices


		// var creasePattern = new CreasePattern().importFoldFile(this.unfolded);
		// creasePattern.crease(line);

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