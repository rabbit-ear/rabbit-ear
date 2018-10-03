'use strict';

export const unfoldedFold = {
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

export const oneValleyFold = {
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
	"faces_layer": [0,1],
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


export function crease(foldFile, line, point){

  if(point != undefined){ point = [point.x, point.y]; }
  let linePoint = [line.point.x, line.point.y];
  let lineVector = [line.direction.x, line.direction.y];

  // if (point == undefined) point = [0.6, 0.6];
  if (point != undefined) {
    // console.log("Jason Code!");
    return split_folding_faces(
        foldFile, 
        linePoint, 
        lineVector,
        point
    );

  }

}


class Matrix{
	static reflection(origin, vector){
		// the line of reflection passes through origin, runs along vector
		let angle = Math.atan2(vector[1], vector[0]);
		let cosAngle = Math.cos(angle);
		let sinAngle = Math.sin(angle);
		let _cosAngle = Math.cos(-angle);
		let _sinAngle = Math.sin(-angle);
		let a = cosAngle *  _cosAngle +  sinAngle * _sinAngle;
		let b = cosAngle * -_sinAngle +  sinAngle * _cosAngle;
		let c = sinAngle *  _cosAngle + -cosAngle * _sinAngle;
		let d = sinAngle * -_sinAngle + -cosAngle * _cosAngle;
		let tx = origin[0] + a * -origin[0] + -origin[1] * c;
		let ty = origin[1] + b * -origin[0] + -origin[1] * d;
		return [a, b, c, d, tx, ty];
	}
	static inverse(m){
		var det = m[0] * m[3] - m[1] * m[2];
		if (!det || isNaN(det) || !isFinite(m[4]) || !isFinite(m[5])){ return undefined; }
		return [ m[3]/det, -m[1]/det, -m[2]/det, m[0]/det, 
		         (m[2]*m[5] - m[3]*m[4])/det, (m[1]*m[4] - m[0]*m[5])/det ];
	}
}

var transform_point = function(point, matrix){
	return [ point[0] * matrix[0] + point[1] * matrix[2] + matrix[4],
	         point[0] * matrix[1] + point[1] * matrix[3] + matrix[5] ];
}


// all points are array syntax [x,y]
// pointArray is an ordered set outlining a convex polygon
// pointArray can be either winding direction
var contains = function(pointArray, point, epsilon = 0.0000000001){
	return pointArray.map( (p,i,arr) => {
		let nextP = arr[(i+1)%arr.length];
		let a = [ nextP[0]-p[0], nextP[1]-p[1] ];
		let b = [ point[0]-p[0], point[1]-p[1] ];
		return a[0] * b[1] - a[1] * b[0] > -epsilon;
	}).map((s,i,arr) => s == arr[0]).reduce((prev,curr) => prev && curr, true)
}

var collinear = function(edgeP0, edgeP1, point, epsilon = 0.0000000001){
	// distance between endpoints A,B should be equal to point->A + point->B
	let dEdge = Math.sqrt(Math.pow(edgeP0[0]-edgeP1[0],2) + Math.pow(edgeP0[1]-edgeP1[1],2));
	let dP0 = Math.sqrt(Math.pow(point[0]-edgeP0[0],2) + Math.pow(point[1]-edgeP0[1],2));
	let dP1 = Math.sqrt(Math.pow(point[0]-edgeP1[0],2) + Math.pow(point[1]-edgeP1[1],2));
	return Math.abs(dEdge - dP0 - dP1) < epsilon
}

function points_equivalent(a, b, epsilon = 0.0000000001){
	return Math.abs(a.x-b.x) < epsilon && Math.abs(a.y-b.y) < epsilon;
}

var overlaps = function(ps1, ps2){
	// points into edges [point, nextPoint]
	let e1 = ps1.map((p,i,arr) => [p, arr[(i+1)%arr.length]] )
	let e2 = ps2.map((p,i,arr) => [p, arr[(i+1)%arr.length]] )
	for(let i = 0; i < e1.length; i++){
		for(let j = 0; j < e2.length; j++){
			if(edge_intersection(e1[i][0], e1[i][1], e2[j][0], e2[j][1]) != undefined){
				return true;
			}
		}
	}
	if(contains(ps1, ps2[0])){ return true; }
	if(contains(ps2, ps1[0])){ return true; }
	return false;
}

// each edge A,B is defined by endpoints (a0,a1),(b0,b1), each is [x,y] pair
var edge_intersection = function(a0, a1, b0, b1){
	let vecA = [a1[0]-a0[0], a1[1]-a0[1]];
	let vecB = [b1[0]-b0[0], b1[1]-b0[1]];
	return vector_intersection(a0, vecA, b0, vecB, edge_edge_comp_func);
}
// arguments: line comes first (point, vector), followed by edge's two endpoints
var line_edge_intersection = function(point, vec, edge0, edge1){
	let edgeVec = [edge1[0]-edge0[0], edge1[1]-edge0[1]];
	return vector_intersection(point, vec, edge0, edgeVec, line_edge_comp_func);
}
// use comp-function to limit boundary of interesection to edges, rays, lines.
var vector_intersection = function(aOrigin, aVec, bOrigin, bVec, compFunction, epsilon = 0.0000000001){
	function determinantXY(a,b){ return a[0] * b[1] - b[0] * a[1]; }
	var denominator0 = determinantXY(aVec, bVec);
	var denominator1 = -denominator0;
	if(Math.abs(denominator0) < epsilon){ return undefined; } /* parallel */
	var numerator0 = determinantXY([bOrigin[0]-aOrigin[0], bOrigin[1]-aOrigin[1]], bVec);
	var numerator1 = determinantXY([aOrigin[0]-bOrigin[0], aOrigin[1]-bOrigin[1]], aVec);
	var t0 = numerator0 / denominator0;
	var t1 = numerator1 / denominator1;
	if(compFunction(t0,t1,epsilon)){ return [aOrigin[0] + aVec[0]*t0, aOrigin[1] + aVec[1]*t0]; }
}
// some helpful comp functions for vector_intersection
const edge_edge_comp_func = function(t0,t1,ep = 0.0000000001){return t0 >= -ep && t0 <= 1+ep && t1 >= -ep && t1 <= 1+ep;}
const line_edge_comp_func = function(t0,t1,ep = 0.0000000001){return t1 >= -ep && t1 <= 1+ep;}

var clip_line = function(poly, linePoint, lineVector){
	// let edgeVecs = poly.map((p,i,arr) => {
	// 	let nextP = arr[(i+1)%arr.length];
	// 	return [p, [pairs[1][0]-pairs[0][0], pairs[1][0]-pairs[0][0]] ];
	// })
	let intersections = poly
		.map((p,i,arr) => [p, arr[(i+1)%arr.length]] ) // poly points into edge pairs
		.map(function(el){ return line_edge_intersection(linePoint, lineVector, el[0], el[1]); })
		.filter(function(el){return el != undefined; });
	switch(intersections.length){
	case 0: return undefined;
	case 1: return [intersections[0], intersections[0]]; // degenerate edge
	case 2: return intersections;
	default:
	// special case: line intersects directly on a poly point (2 edges, same point)
	//  filter to unique points by [x,y] comparison.
		for(let i = 1; i < intersections.length; i++){
			if( !points_equivalent(intersections[0], intersections[i])){
				return [intersections[0], intersections[i]];
			}
		}
	}
}

var prepareFoldFile = function(foldFile){
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

// input: fold file and line
// output: dict keys: two vertex indices defining an edge (as a string: "4 6")
//         dict vals: [x, y] location of intersection between the two edge vertices
var clip_faces_at_edge_crossings = function(foldFile, linePoint, lineVector){
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
	let clippedFacesLine = facesVertices.map(poly => clip_line(poly, linePoint, lineVector))
		// for every face, we have one clipped crease edge or undefined if no intersection

	// build result dictionary
	let edgeCrossings = {}
	clippedFacesLine.forEach((clip, f) => {
		if(clip != undefined){
			facesVertices[f].map((fv,i,faceArray) => {
				let nextFv = faceArray[(i+1)%faceArray.length];
				let foundIndex = undefined;
				if(collinear(fv, nextFv, clip[0])){ foundIndex = 0; }
				if(collinear(fv, nextFv, clip[1])){ foundIndex = 1; }
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
		var sortedBySide = sortTwoFacesBySide(facesSubstitutions[i], new_vertices_coords, linePoint, lineVector)
		leftSide.push(sortedBySide[0]);
		rightSide.push(sortedBySide[1]);
	}

	let matrices = foldFile["faces_matrix"].map(n => Matrix.inverse(n) )
	let new_vertices_coords_cp = new_vertices_coords.map((point,i) =>
		transform_point(point, matrices[vertexInFace[i]])
	)

	return {
		"vertices_coords_fold": new_vertices_coords,
		"vertices_coords_flat": new_vertices_coords_cp,
		"sides_faces_vertices": [leftSide, rightSide]
	}
}

var sortTwoFacesBySide = function(twoFaces, vertices_coords, linePoint, lineVector){
	var result = [undefined, undefined];
	twoFaces.forEach(face => {
		if(face == undefined){ return; }
		var crossSum = face.map(p => {
			var fP = vertices_coords[p];
			var a = [fP[0] - linePoint[0], fP[1] - linePoint[1]];
			var b = [lineVector[0], lineVector[1]];
			return a[0]*b[1] - a[1]*b[0];
		}).reduce((prev,curr) => prev+curr);
		var index = (crossSum < 0) ? 0 : 1;
		result[index] = face;
	})
	return result
}

// layerOrder      - original fold file
// faces_vertices  - original fold file
// sides_faces_vertices - from clip_faces_.. function
// faces_mark      - boolean if a face in sides_faces_vertices should move
// whichSide       - which side of the sides_faces_vertices we're moving
var reconstitute_faces = function(faces_vertices, faces_layer, sides_faces_vertices, faces_mark, whichSideMoves){
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
	// var cleanResult = clean_isolated_vertices(
	// 	{ vertices_coords: compiled_faces_vertices, 
	// 		faces_vertices: compiled_faces_layer
	// 	});

	return {
		'faces_vertices': compiled_faces_vertices,
		'faces_layer':    compiled_faces_layer
	}
}

var reflect_across_fold = function(arrs, arrayIndex, linePoint, lineVector){
  var matrix = Matrix.reflection(linePoint, lineVector);

	var top_layer = arrs.faces_layer.slice(0, arrayIndex);
	var bottom_layer = arrs.faces_layer.slice(arrayIndex, arrayIndex + arrs.faces_layer.length-arrayIndex);
	bottom_layer.reverse();

	var boolArray = arrs.vertices_coords.map(() => false)

	for(var i = arrayIndex; i < arrs.faces_vertices.length; i++){
		for(var f = 0; f < arrs.faces_vertices[i].length; f++){
			if(!boolArray[ arrs.faces_vertices[i][f] ]){
				var vert = arrs.vertices_coords[ arrs.faces_vertices[i][f] ];
				arrs.vertices_coords[ arrs.faces_vertices[i][f] ] = transform_point(vert, matrix);
				boolArray[ arrs.faces_vertices[i][f] ] = true;
			}
		}
	}

	return {
		'faces_layer': top_layer.concat(bottom_layer),
		'vertices_coords': arrs.vertices_coords
	}
}

// get index of highest layer face which intersects point
var top_face_under_point = function(
    {faces_vertices, vertices_coords, faces_layer}, 
    point) {
  let top_fi = faces_vertices.map(
    (vertices_index, fi) => {
      let points = vertices_index.map(i => vertices_coords[i]);
      return contains(points, point) ? fi : -1;
    }).reduce((acc, fi) => {
      return ((acc === -1) || 
              ((fi !== -1) && (faces_layer[fi] > faces_layer[acc]))
      ) ? fi : acc;
    }, -1);
  return (top_fi === -1) ? undefined : top_fi;
}

var faces_above = function(
    {faces_vertices, vertices_coords, faces_layer},
    first_face_idx) {
  
}

// make faces_faces
var make_faces_faces = function(faces_vertices) {
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

var mark_moving_faces = function(faces_vertices, vertices_coords, faces_layer, face_idx) {
  let faces_faces = make_faces_faces(faces_vertices);
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
        if (overlaps(faces_points[idx1], faces_points[idx2])) {
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

var faces_vertices_to_edges = function (mesh) {
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

var split_folding_faces = function(fold, linePoint, lineVector, point) {
  // assumes point not on line

  let splitFaces = clip_faces_at_edge_crossings(fold, linePoint, lineVector);
  
  let vertices_coords = splitFaces.vertices_coords_fold;
  let sides_faces     = splitFaces.sides_faces_vertices;

  let touched = top_face_under_point(fold, point);
  if (touched === undefined)
    return undefined;
  if (touched !== undefined) {
    var side = undefined;
    for (var s of [0, 1]) {
      let vertices_index = sides_faces[s][touched];
      if (vertices_index !== undefined) {
        let points = vertices_index.map(i => vertices_coords[i]);
        if (contains(points, point))
          side = s;
      }
    }
  }

  let faces_mark = mark_moving_faces(
    sides_faces[side],
    vertices_coords,
    fold.faces_layer,
    touched
  );
  let new_fold = reconstitute_faces(
    fold.faces_vertices, 
    fold.faces_layer, 
    sides_faces, faces_mark, side);
  new_fold.vertices_coords = vertices_coords;

  var faces_layer;
  ({vertices_coords, faces_layer} = reflect_across_fold(
    new_fold, fold.faces_layer.length, linePoint, lineVector));

  new_fold.vertices_coords = vertices_coords;
  console.log("setting fold layer ", faces_layer);
  new_fold.faces_layer = faces_layer;

  faces_vertices_to_edges(new_fold);

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
  // ({vertices_coords, faces_vertices} = clean_isolated_vertices(new_fold));
  console.log(new_fold);
  return new_fold;
}

// remove unused vertices based on appearance in faces_vertices only
//  also, this updates changes to references in faces_vertices only
var clean_isolated_vertices = function({vertices_coords, faces_vertices}){
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

