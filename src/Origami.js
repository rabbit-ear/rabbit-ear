'use strict';

import * as Geometry from './geometry.js'

var squareFoldFile = {
	"file_spec": 1.1,
	"file_creator": "Rabbit Ear",
	"file_author": "",
	"file_classes": ["singleModel"],
	"vertices_coords": [[0,0],[1,0],[1,1],[0,1]],
	"edges_vertices": [[0,1],[1,2],[2,3],[3,0]],
	"edges_assignment": ["B","B","B","B"],
	"faces_vertices": [[0,1,2,3]],
	"faces_layer": [0],
	"faces_matrix": [[1, 0, 0, 1, 0, 0]],
	"file_frames": [{
		"parent": 0,
		"inherit": true
	}]
};

var oneFoldFoldFile = {
	"file_spec": 1.1,
	"file_creator": "Rabbit Ear",
	"file_author": "Robby Kraft",
	"file_classes": ["singleModel"],
	"frame_attributes": ["2D"],
	"frame_title": "one valley crease",
	"frame_classes": ["foldedState"],
	"vertices_coords": [
		[0.62607055447, 1.172217339808],
		[1.182184366474, 0.341111192497],
		[1, 1],
		[0, 1],
		[1, 0.21920709774914016],
		[0, 0.7532979469531602]
	],
	"vertices_vertices": [[1,3], [4,0], [3,4], [0,2], [2,5,1], [0,4,3]],
	"vertices_faces": [[0], [0], [1], [1], [1,0], [0,1]],
	"edges_vertices": [[0,1], [1,4], [4,5], [5,0], [4,2], [2,3], [3,5]],
	"edges_faces": [[0], [0], [1,0], [0], [1], [1], [1]],
	"edges_assignment": ["B","B","V","B","B","B","B"],
	"edges_foldAngle": [0, 0, 180, 0, 0, 0, 0],
	"faces_vertices": [[0,1,4,5], [2,3,5,4]],
	"faces_edges": [[0,1,2,3], [5,6,2,4]],
	"faces_layer": [1,0],
	"faces_matrix": [
		[0.5561138120038558, -0.8311061473112445, -0.8311061473112445, -0.5561138120038558, 0.6260705544697115, 1.172217339807961],
		[1, 0, 0, 1, 0, 0]
	],
	"file_frames": [{
		"frame_classes": ["creasePattern"],
		"parent": 0,
		"inherit": true,
		"vertices_coords": [[0,0], [1,0], [1,1], [0,1], [1,0.21920709774914016], [0,0.7532979469531602]],
		"edges_foldAngle": [0, 0, 0, 0, 0, 0, 0],
		"faces_layer": [0,1],
		"faces_matrix": [[1,0,0,1,0,0], [1,0,0,1,0,0]],
	}]
};


export default class Origami{

	constructor(){
		this.oneFold = oneFoldFoldFile;
		this.square = squareFoldFile;
	}

	static prepareFoldFile(foldFile){
		let dontCopy = ["parent", "inherit"];
		let fold = JSON.parse(JSON.stringify(foldFile));
		if(fold.file_frames != undefined){
			var thing = key => !dontCopy.includes(key);
			let keys = Object.keys(fold.file_frames[0]).filter(key => !dontCopy.includes(key))
			// console.log("copying over " + keys.join(' ') + " from frame[0] to main");
			keys.forEach(key => fold[key] = fold.file_frames[0][key] )
		}
		fold.file_frames = null;
		return fold;
	}

	static crease(foldFile, line, point){

		// var foldFile = Origami.prepareFoldFile(masterFoldFile);

		// 1. vertices_intersections
    // input is a fold format JSON and a Robby line
    // output is an faces_ array of pairs of [x, y] points, or undefined

    // var faces_clipLines = Origami.clip_faces_at_edge_crossings(foldFile, line);
		// console.log(faces_clipLines)

		// test reconstituteFaces with fake data
		// var fakeFacesMarks = [true, true];
		// var rebuiltArrays = Origami.reconstitute_faces(foldFile.faces_vertices, foldFile.faces_layer, faces_clipLines.sides_faces_vertices, fakeFacesMarks, 0);

		// var foldedArrays = Origami.reflect_across_fold(rebuiltArrays, foldFile.faces_vertices.length);

		// console.log(rebuiltArrays);
		// return;

		// var returnObject = {
		// 	"vertices_coords_flat": [[0,0], [1,0], [1,1], [0,1], [1,0.21920709], [0,0.75329794]],
		// 	"vertices_coords_fold": [[0,0], [1,0], [1,1], [0,1], [1,0.21920709], [0,0.75329794]],
		// 	"sides_faces_vertices": [
		// 		[[0,1,4,5], [2,3,5,4]],
		// 		[[null,1,4,5], [2,3,5,4]],
		// 	]
		// }

    // 3.5. draw lines on crease pattern
    //  - using faces_lines, draw these on crease pattern
    // 
    // now user clicks on a face:
    // -------
    // we loop through faces, checking if user clicked in face. choose top most one f
    // then check which side was click by checking click intersection with faces_pieces[f]
    // NOW WE KNOW which side1 or side2 inside all of faces_pieces will be the one that moves

    // console.log(foldFile);

    // if (point == undefined) point = [0.6, 0.6];
    if (point != undefined) {
      // console.log("Jason Code!");
      var split_faces = Origami.split_folding_faces(
          foldFile, 
          line,
          point
      );
    }
    // point is place where user clicked
    // unfold must have faces_layer as a permutation of the face indices


    // var newUnfolded = foldMovingFaces(
    //     foldFile, 
    //     // faces_splitFaces, 
    //     Array(n).fill(0, n, [undefined,[1,2,3,4]]),
    //     newVertices_coords, 
    //     Array(n).fill(0, n, [0,1])
    // );

		// var creasePattern = new CreasePattern().importFoldFile(foldFile);
		// creasePattern.crease(line);
	}


	// input: fold file and line
	// output: dict keys: two vertex indices defining an edge (as a string: "4 6")
	//         dict vals: [x, y] location of intersection between the two edge vertices
	static clip_faces_at_edge_crossings(foldFile, line){
		// which face does the vertex lie in (just one of them)
		let vertexInFace = foldFile.vertices_coords.map(v => -1)
		vertexInFace = vertexInFace.map(function(v,i){
			for(var f = 0; f < foldFile.faces_vertices.length; f++){
				if(foldFile.faces_vertices[f].includes(i)){ return f; }
			}
		},this);

		// from face vertex indices, create faces with vertex geometry
		let facesVertices = foldFile.faces_vertices.map( vIndices => {
			return vIndices.map( vI => foldFile.vertices_coords[vI])
		})

		// generate one clip line per face, or none if there is no intersection
		let clippedFacesLine = facesVertices.map(vertices => {
			// use geometry library to clip edge inside convex polygon
			let poly = new Geometry.ConvexPolygon();
			poly.edges = vertices.map((el,i,verts) => {
				let nextEl = verts[ (i+1)%verts.length ];
				return new Geometry.Edge(el[0], el[1], nextEl[0], nextEl[1]);
			});
			return poly;
		}).map(function(poly, i){
			// for every face, we have one clipped crease edge or undefined if no intersection
			return poly.clipLine( line );
		},this).map(function(edge){
			// convert to [ [x,y], [x,y] ]. or undefined if no intersection
			if(edge != undefined){return [[edge.nodes[0].x,edge.nodes[0].y],[edge.nodes[1].x,edge.nodes[1].y]];}
			return undefined;
		},this);

		// build result dictionary
		let edgeCrossings = {}
		clippedFacesLine.forEach((clip, f) => {
			if(clip != undefined){
				facesVertices[f].map((fv,i,faceArray) => {
					let nextFv = faceArray[(i+1)%faceArray.length];
					let foundIndex = undefined;
					if(Origami.collinear(fv, nextFv, clip[0])){ foundIndex = 0; }
					if(Origami.collinear(fv, nextFv, clip[1])){ foundIndex = 1; }
					if(foundIndex != undefined){
						let fVI = foldFile.faces_vertices[f];
						let key = [fVI[i], fVI[(i+1)%fVI.length]].sort(function(a,b){return a-b;}).join(" ");
						edgeCrossings[key] = {'clip':clip[foundIndex], 'face':f};
					}
				})
			}
		})

		// deep copy components
		let new_vertices_coords = JSON.parse(JSON.stringify(foldFile.vertices_coords));
		// let new_edges_vertices = JSON.parse(JSON.stringify(foldFile.edges_vertices));
		let new_faces_vertices = JSON.parse(JSON.stringify(foldFile.faces_vertices));
		// these will depricate the entries listed below, requiring rebuild:
		//   "vertices_vertices", "vertices_faces"
		//   "edges_faces", "edges_assignment", "edges_foldAngle", "edges_length"
		//   "faces_edges", "faces_layer", "faceOrders", "faces_matrix"

		// move vertex geometry from edgeCrossings into new_vertices_coords.
		// update edgeCrossings with index pointer to location in new_vertices_coords.
		for(let key in edgeCrossings){
			if(edgeCrossings.hasOwnProperty(key)){
				new_vertices_coords.push( edgeCrossings[key].clip )
				edgeCrossings[key].clip = new_vertices_coords.length-1
				vertexInFace[new_vertices_coords.length-1] = edgeCrossings[key].face;
			}
		}

		// forget edges for now
		// for(let key in edgeCrossings){
		// 	if(edgeCrossings.hasOwnProperty(key)){
		// 		let edges = key.split(' ').map( e => parseInt(e) )
		// 		// add new edges to edge array. multi step.
		// 		// 1. filter out the edge which has a new point in between everything.
		// 		new_edges_vertices = new_edges_vertices.filter( el => !(el.includes(edges[0]) && el.includes(edges[1])) )
		// 		new_edges_vertices.push([edges[0], edgeCrossings[key]])
		// 		new_edges_vertices.push([edgeCrossings[key], edges[1]])
		// 	}
		// }

		let facesSubstitutions = []
		clippedFacesLine.map( (clipLine,i) => {
			// this is a face that has been identified as containing a crossing
			// we need to remove it and replace it with 2 faces
			if(clipLine != undefined){
				var newFaces = [ [], [] ]
				var newFaceI = 0;

				// walk around a face. using edges
				foldFile.faces_vertices[i].forEach( (vertex,i,vertexArray) => {
					let nextVertex = vertexArray[(i+1)%vertexArray.length];

					var key = [vertex, nextVertex].sort( (a,b) => a-b ).join(' ')
					// let key = edgeArray.slice().sort(function(a,b){return a-b;}).join(' ')
					if(edgeCrossings[key]){
						var intersection = edgeCrossings[key].clip;
						newFaces[newFaceI].push(intersection)
						newFaceI = (newFaceI+1)%2; // flip bit
						newFaces[newFaceI].push(intersection)
						newFaces[newFaceI].push(nextVertex)
					} else{
						newFaces[newFaceI].push(nextVertex)
					}
				})
			}
			facesSubstitutions[i] = newFaces
		})

		var leftSide = [];
		var rightSide = [];
		for(var i in facesSubstitutions){
			if(facesSubstitutions[i] == undefined){
				facesSubstitutions[i] = [new_faces_vertices[i], undefined];
			}
			var sortedBySide = Origami.sortTwoFacesBySide(facesSubstitutions[i], new_vertices_coords, line)
			leftSide.push(sortedBySide[0]);
			rightSide.push(sortedBySide[1]);
		}

		let matrices = foldFile["faces_matrix"].map(n => 
			new Geometry.Matrix(n[0],n[1],n[2],n[3],n[4],n[5]).inverse()
		)
		let new_vertices_coords_cp = new_vertices_coords.map((point,i) => {
			return new Geometry.XY(point).transform(matrices[ vertexInFace[i] ])
		}).map( p => [p.x, p.y])

		return {
			"vertices_coords_fold": new_vertices_coords,
			"vertices_coords_flat": new_vertices_coords_cp,
			"sides_faces_vertices": [leftSide, rightSide]
		}
	}

	static sortTwoFacesBySide(twoFaces, vertices_coords, line){
		var result = [undefined, undefined];
		twoFaces.forEach(face => {
			if(face == undefined){ return; }
			var crossSum = face.map(p => {
				var fP = vertices_coords[p];
				var a = [fP[0] - line.point.x, fP[1] - line.point.y];
				var b = [line.direction.x, line.direction.y];
				return a[0]*b[1] - a[1]*b[0];
			}).reduce((prev,curr) => prev+curr);
			var index = (crossSum < 0) ? 0 : 1;
			result[index] = face;
		})
		return result
	}


// sides_faces_vertices: [
// 	[
// 		[6, 7, 5, 0],
// 		[8, 3, 5, 7],
// 		[9, 2, 5]
// 	],
// 	[
// 		[6, 1, 4, 7],
// 		[8, 7, 4, 2],
// 		[5, 4, 8, 7, 3]
// 	]
// ]

// sides_faces_vertices: [
// 	[
// 		[6, 7, 4, 5, 0],
// 		[2, 3, 5, 4]
// 	],[
// 		[6, 1, 7],
// 		undefined
// 	]
// ]

	// layerOrder      - original fold file
	// faces_vertices  - original fold file
	// sides_faces_vertices - from clip_faces_.. function
	// faces_mark      - boolean if a face in sides_faces_vertices should move
	// whichSide       - which side of the sides_faces_vertices we're moving
	static reconstitute_faces(faces_vertices, faces_layer, sides_faces_vertices, faces_mark, whichSideMoves){
		// build a layer order array while the face array
		// making the new extene dface array, put the layer order of the face it came from
		// for extended layer array: 
		//  - sort by values, giving them their original index
		//  - give them new values that are N and higher, in order.
		//  - unsort , based on original index
		let new_faces_vertices = [];
		let new_faces_vertices_end = [];
		// i think we can wait to build this at the end all at once.
		let new_faces_layer = faces_layer.slice(); // copy array
		let new_faces_layer_end = [];
		faces_mark.forEach((shouldMove,i) => {
			if(!shouldMove){ 
				// not folding this face, revert back to original joined face
				new_faces_vertices.push(faces_vertices[i]);
			}
			else{
				// yes, we are using this face
				// staying face goes in the same place
				let stayingFace = sides_faces_vertices[(whichSideMoves+1)%2][i];
				new_faces_vertices.push(stayingFace);
				// moving face goes at the end of the array (temporarily in new array)
				let movingFace = sides_faces_vertices[whichSideMoves][i];
				new_faces_vertices_end.push(movingFace);
				new_faces_layer_end.push( new_faces_layer[i] )
			}
		})

		var originalLayerMax = faces_layer.length
		var new_faces_layer_end_sorted = new_faces_layer_end.map((value, i) => ({value, i}))
		new_faces_layer_end_sorted.sort( (a,b) => a.value-b.value)
		var shuffle_order = new_faces_layer_end_sorted.map(a => a.i)
		new_faces_layer_end_sorted.forEach((a,i) => a.value = i + originalLayerMax)
		new_faces_layer_end_sorted.sort( (a,b) => a.i-b.i)
		new_faces_layer_end_sorted = new_faces_layer_end_sorted.map(a => a.value)

		new_faces_vertices_end = new_faces_vertices_end.map((a,i) => ({'value':a, 'i':shuffle_order[i]}))
		new_faces_vertices_end.sort( (a,b) => a.i-b.i)
		new_faces_vertices_end = new_faces_vertices_end.map(a => a.value)
	
		var compiled_faces_vertices = new_faces_vertices.concat(new_faces_vertices_end);
		var compiled_faces_layer = faces_layer.slice().concat(new_faces_layer_end_sorted);

		// clean isolated vertices
		// (compiled_faces_vertices, compiled_faces_layer)
		// var cleanResult = Origami.clean_isolated_vertices(
		// 	{ vertices_coords: compiled_faces_vertices, 
		// 		faces_vertices: compiled_faces_layer
		// 	});

		return {
			'faces_vertices': compiled_faces_vertices,
			'faces_layer':    compiled_faces_layer
		}
	}

	static reflect_across_fold(arrs, arrayIndex){
		// { 'faces_vertices': compiled_faces_vertices,
		//   'faces_layer': compiled_faces_layer }
		var top_vertices = arrs.faces_vertices.slice(0, arrayIndex);
		var top_layer = arrs.faces_layer.slice(0, arrayIndex);
		var bottom_vertices = arrs.faces_vertices.slice(arrayIndex, arrs.faces_vertices.length-arrayIndex);
		var bottom_layer = arrs.faces_layer.slice(arrayIndex, arrs.faces_layer.length-arrayIndex);
		bottom_vertices.reverse();
		bottom_layer.reverse();
		return {
			'faces_vertices': bottom_vertices.concat(top_vertices),
			'faces_layer': bottom_layer.concat(top_layer)
		}
	}

	// points are in array syntax
	// point array is in counter-clockwise winding
	static contains(pointArray, point, epsilon = 0.0000000001){
		return pointArray.map( (p,i,arr) => {
			var nextP = arr[(i+1)%arr.length];
			var a = [ nextP[0]-p[0], nextP[1]-p[1] ];
			var b = [ point[0]-p[0], point[1]-p[1] ];
			return a[0] * b[1] - a[1] * b[0] > -epsilon;
		}).map((s,i,arr) => s == arr[0]).reduce((prev,curr) => prev && curr, true)
	}
	
	static collinear(edgeP0, edgeP1, point, epsilon = 0.0000000001){
		var dEdge = Math.sqrt(Math.pow(edgeP0[0]-edgeP1[0],2) + Math.pow(edgeP0[1]-edgeP1[1],2));
		var dP0 = Math.sqrt(Math.pow(point[0]-edgeP0[0],2) + Math.pow(point[1]-edgeP0[1],2));
		var dP1 = Math.sqrt(Math.pow(point[0]-edgeP1[0],2) + Math.pow(point[1]-edgeP1[1],2));
		return Math.abs(dEdge - dP0 - dP1) < epsilon
	}

	// get index of highest layer face which intersects point
  static top_face_under_point(
      {faces_vertices, vertices_coords, faces_layer}, 
      point) {
	  let top_fi = faces_vertices.map(
	    (vertices_index, fi) => {
        let points = vertices_index.map(i => vertices_coords[i]);
        return Origami.contains(points, point) ? fi : -1;
      }).reduce((acc, fi) => {
        return ((acc === -1) || 
                ((fi !== -1) && (faces_layer[fi] > faces_layer[acc]))
        ) ? fi : acc;
      }, -1);
    return (top_fi === -1) ? undefined : top_fi;
  }

  static faces_above(
      {faces_vertices, vertices_coords, faces_layer},
      first_face_idx) {
    
  }

	// make faces_faces
  static make_faces_faces(faces_vertices) {
    let nf = faces_vertices.length;
    let faces_faces = Array.from(Array(nf)).map(() => []);
    let edgeMap = {};
    faces_vertices.forEach((vertices_index, idx1) => {
      if (vertices_index === undefined) return;
      let n = vertices_index.length;
      vertices_index.forEach((v1, i, vs) => {
        let v2 = vs[(i + 1) % n];
        if (v2 < v1) [v1, v2] = [v2, v1];
        let key = v1 + " " + v2;
        if (key in edgeMap) {
          let idx2 = edgeMap[key];
          faces_faces[idx1].push(idx2);
          faces_faces[idx2].push(idx1);
        } else {
          edgeMap[key] = idx1;
        }
      }); 
    });
    return faces_faces;
  }

  static overlaps(ps1, ps2) {
    let poly1, poly2;
    [poly1, poly2] = [ps1, ps2].map((ps) => {
      ps = ps.map((p) => ({x: p[0], y: p[1]}));
      return Geometry.ConvexPolygon.convexHull(ps);
    })
    return poly1.overlaps(poly2);
  }

  static mark_moving_faces(faces_vertices, vertices_coords, faces_layer, face_idx) {
    let faces_faces = Origami.make_faces_faces(faces_vertices);
    let marked = faces_vertices.map(() => false);
    marked[face_idx] = true;
    let to_process = [face_idx];
    let process_idx = 0;
    let faces_points = faces_vertices.map((vertices_index) => {
      return vertices_index.map(i => vertices_coords[i]);
    })
    while (process_idx < to_process.length) {
      // pull face off queue
      let idx1 = to_process[process_idx];
      process_idx += 1;
      // add all unmarked above-overlapping faces to queue
      faces_vertices.forEach((vertices_index, idx2) => {
        if (!marked[idx2] && ((faces_layer[idx2] > faces_layer[idx1]))) {
          if (Origami.overlaps(faces_points[idx1], faces_points[idx2])) {
            marked[idx2] = true;
            to_process.push(idx2);
          }
        }
      });
      // add all unmarked adjacent faces to queue
      faces_faces[idx1].forEach((idx2) => {
        if (!marked[idx2]) {
          marked[idx2] = false;
          to_process.push(idx2);
        }
      });
    }
    return marked;
  }

  static faces_vertices_to_edges (mesh) {
    var edge, edgeMap, face, i, key, ref, v1, v2, vertices;
    mesh.edges_vertices = [];
    mesh.edges_faces = [];
    mesh.faces_edges = [];
    mesh.edges_assignment = [];
    edgeMap = {};
    ref = mesh.faces_vertices;
    for (face in ref) {
      vertices = ref[face];
      face = parseInt(face);
      mesh.faces_edges.push((function() {
        var j, len, results;
        results = [];
        for (i = j = 0, len = vertices.length; j < len; i = ++j) {
          v1 = vertices[i];
          v1 = parseInt(v1);
          v2 = vertices[(i + 1) % vertices.length];
          if (v1 <= v2) {
            key = v1 + "," + v2;
          } else {
            key = v2 + "," + v1;
          }
          if (key in edgeMap) {
            edge = edgeMap[key];
          } else {
            edge = edgeMap[key] = mesh.edges_vertices.length;
            if (v1 <= v2) {
              mesh.edges_vertices.push([v1, v2]);
            } else {
              mesh.edges_vertices.push([v2, v1]);
            }
            mesh.edges_faces.push([null, null]);
            mesh.edges_assignment.push('B');
          }
          if (v1 <= v2) {
            mesh.edges_faces[edge][0] = face;
          } else {
            mesh.edges_faces[edge][1] = face;
          }
          results.push(edge);
        }
        return results;
      })());
    }
    return mesh;
  };

	static split_folding_faces(fold, line, point) {
    // assumes point not on line
    point = [point.x, point.y];

    var splitFaces = Origami.clip_faces_at_edge_crossings(fold, line);
    
    let vertices_coords = splitFaces.vertices_coords_fold;
    let sides_faces     = splitFaces.sides_faces_vertices;

    let touched = Origami.top_face_under_point(fold, point);
	  if (touched === undefined)
	    return undefined;
    if (touched !== undefined) {
      var side = undefined;
      for (var s of [0, 1]) {
        let vertices_index = sides_faces[s][touched];
        if (vertices_index !== undefined) {
          let points = vertices_index.map(i => vertices_coords[i]);
          if (Origami.contains(points, point))
            side = s;
        }
      }
    }

    let faces_mark = Origami.mark_moving_faces(
      sides_faces[side],
      vertices_coords,
      fold.faces_layer,
      touched
    );
    
    let new_fold = Origami.reconstitute_faces(
      fold.faces_vertices, 
      fold.faces_layer, 
      sides_faces, faces_mark, side);
	  new_fold.vertices_coords = vertices_coords;
		var foldedArrays = Origami.reflect_across_fold(rebuiltArrays, foldFile.faces_vertices.length);

    var faces_layer;
    ({vertices_coords, faces_layer} = reflect_across_fold(
      new_fold, fold.faces_layer.length)

	  new_fold.vertices_coords = vertices_coords;
	  new_fold.faces_layer = faces_layer;

    Origami.faces_vertices_to_edges(new_fold);

	  new_fold.file_classes = ["singleModel"];
	  new_fold.frame_attributes = ["2D"];
	  new_fold.frame_classes = ["foldedState"];
    new_fold.file_frames = [{
      "frame_classes": ["creasePattern"],
      "parent": 0,
      "inherit": true,
      "vertices_coords": splitFaces.vertices_coords_flat
    }];

    // let faces_vertices;
    // ({vertices_coords, faces_vertices} = Origami.clean_isolated_vertices(new_fold));
    console.log(new_fold);
    return new_fold;
	}

	// remove unused vertices based on appearance in faces_vertices only
	//  also, this updates changes to references in faces_vertices only
	static clean_isolated_vertices({vertices_coords, faces_vertices}){
		let booleans = vertices_coords.map(() => false)
		let count = booleans.length;
		faces_vertices.forEach(face => {
			face.forEach(f => {
				if(booleans[f] == false){ booleans[f] = true; count -= 1; }
				if(count == 0){ return; } // we fliped N bits. break
			})
		})
		if(count == 0){ return; } // every vertex is used
		// make an array of index changes [ 0, 0, 0, -1, -1, -1, -2, -2]
		let offset = 0
		let indexMap = booleans.map((b,i) => {
			if(b == false){ offset -= 1; }
			return offset;
		})
		// update faces vertices with changes
		faces_vertices = faces_vertices.map(face => face.map(f => f += indexMap[f]))
		// remove unused vertices from vertex array
		for(var i = booleans.length-1; i >= 0; i -= 1){
			if(!booleans[i]){ vertices_coords.splice(i, 1); }
		}
		return {vertices_coords, faces_vertices}
	}


}

