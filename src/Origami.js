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

	var facesVertices = foldFile.faces_vertices.map( vIndices => {
		// from face vertex indices, create faces with vertex geometry
		return vIndices.map( vI => foldFile.vertices_coords[vI])
	})
	// generate one clip line per face, or none if there is no intersection
	var facePolys = facesVertices.map(vertices => {
		// convex hull algorithm turns faces into a convex polygon object
		var poly = new Geometry.ConvexPolygon();
		poly.edges = vertices.map(function(el,i,verts){
			var nextEl = verts[ (i+1)%verts.length ];
			return new Geometry.Edge(el[0], el[1], nextEl[0], nextEl[1]);
		},this);
		return poly;
		// return Geometry.ConvexPolygon.convexHull( vertices.map(v => {x:v[0], y:v[1]}) )
	})
	// for every face, we have one clipped crease edge or undefined if no intersection
	var clipLines = facePolys.map(function(poly, i){
		return poly.clipLine( line.transform(matrices[i].inverse()) );
	},this).map(function(edge){
		// convert to [ [x,y], [x,y] ]. or undefined if no intersection
		if(edge != undefined){return [[edge.nodes[0].x,edge.nodes[0].y],[edge.nodes[1].x,edge.nodes[1].y]];}
		return undefined;
	},this);
	// deep copy vertices array
	var new_vertices_coords = JSON.parse(JSON.stringify(foldFile.vertices_coords));

	var edgeDictionary = {}
	clipLines.map((clip, f) => {
		if(clip != undefined){
			facePolys[f].edges.forEach((edge, eI) => {
				var foundIndex = undefined;
				if(edge.collinear( {x:clip[0][0], y:clip[0][1]} )){ foundIndex = 0; }
				if(edge.collinear( {x:clip[1][0], y:clip[1][1]} )){ foundIndex = 1; }
				if(foundIndex != undefined){
					var fVI = foldFile.faces_vertices[f];
					var key = [fVI[eI], fVI[(eI+1)%fVI.length]].sort(function(a,b){return a-b;}).join(" ");
					edgeDictionary[key] = clip[foundIndex];
				}
			})
		}
	})
	// console.log(edgeDictionary);



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
    return;
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


}
