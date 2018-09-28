'use strict';

import * as Geometry from './geometry.js'

var squareCreasePattern = {
	"file_spec":1,
	"file_creator":"Rabbit Ear",
	"file_author":"Robby Kraft",
	"file_classes":["singleModel"],
	"vertices_coords":[[0,0],[1,0],[1,1],[0,1]],
	"faces_vertices":[[0,1,2,3]],
	"edges_vertices":[[0,1],[1,2],[2,3],[3,0]],
	"edges_assignment":["B","B","B","B"]
}

class FoldFile{
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
			"faces_matrices":[[1, 0, 0, 1, 0, 0]],
			"faces_coloring":[0]
		};
	}
}

class OrigamiDesign{
	constructor(){
		this.unfolded = FoldFile.square();
		this.folded = FoldFile.square();
	}
}


export default class Origami extends OrigamiDesign{

	constructor(){
		super();
	}

	creaseCP(line){
		var creasePattern = new CreasePattern().importFoldFile(this.unfolded);
		creasePattern.crease(line);
	}

	creaseFolded(line){
		var cp = new CreasePattern().importFoldFile(this.unfolded);

		var matrices = this.folded["faces_matrices"].map(function(n){ 
			return new Geometry.Matrix(n[0], n[1], n[2], n[3], n[4], n[5]);
		},this);
		var coloring = this.folded["faces_coloring"];

		var faces = this.folded.faces_vertices.map(function(nodeArray){
			return nodeArray.map(function(n){ return this.folded.vertices_coords[n]; },this);
		},this);

		var newCreases = cp.faces.map(function(f, i){
			var transformedLine = line.transform(matrices[i].inverse());
			return f.clipLine(transformedLine);
		},this);

		newCreases
			.forEach(function(c, i){
				if(c != undefined){
					var crease = cp.crease(c);
					if(crease != undefined){ 
						if(coloring[i] == 0){ crease.valley(); }
						else{ crease.mountain(); }
					}
				}
			},this);
		cp.clean();

		this.unfolded = cp.exportFoldFile();
		this.folded = cp.fold();
		// this.unfolded = cp.exportFoldFile();
	}
}