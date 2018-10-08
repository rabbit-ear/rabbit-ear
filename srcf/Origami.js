/** .FOLD file format modifier
 * 
 *  fold/unfold, add new creases, navigate frames,
 *  general cleanup and validation
 */

'use strict';

import {clean_number, contains, collinear, overlaps, clip_line_in_poly, transform_point, Matrix} from './Geom'

export const emptyFoldFile = {
	"file_spec": 1.1,
	"file_creator": "Rabbit Ear",
	"file_author": "",
	"file_classes": ["singleModel"],
	"frame_attributes": ["2D"],
	"frame_title": "",
	"frame_classes": ["creasePattern"],
	"vertices_coords": [[0,0], [1,0], [1,1], [0,1]],
	"edges_vertices": [[0,1], [1,2], [2,3], [3,0]],
	"edges_assignment": ["B","B","B","B"],
	"faces_vertices": [[0,1,2,3]],
	"faces_layer": [0],
	"faces_matrix": [[1,0,0,1,0,0]],
	"file_frames":[{
		"frame_classes":["creasePattern"],
		"frame_parent":0,
		"inherit":true
	}]
};


export function flattenFrame(fold_file, frame_num){
	if(frame_num == undefined ||
		 fold_file.file_frames == undefined ||
		 fold_file.file_frames[frame_num] == undefined ||
		 fold_file.file_frames[frame_num].vertices_coords == undefined){
		throw "fold file has no frame number " + frame_num;
		return;
	}
	const dontCopy = ["parent", "inherit"];
	let fold = JSON.parse(JSON.stringify(fold_file));
	let keys = Object.keys(fold.file_frames[frame_num]).filter(key =>
		!dontCopy.includes(key)
	)
	keys.forEach(key => fold[key] = fold.file_frames[frame_num][key] )
	fold.file_frames = null;
	return fold;
}


export function valleyFold(foldFile, line, point){

	if(point != undefined){ point = [point.x, point.y]; }
	let linePoint = [line.point.x, line.point.y];
	let lineVector = [line.direction.x, line.direction.y];

	// if (point == undefined) point = [0.6, 0.6];
	if (point != undefined) {
		// console.log("Jason Code!");
		let new_fold = split_folding_faces(
				foldFile, 
				linePoint, 
				lineVector,
				point
		);
    return new_fold;
	}
}

/** 
 * when an edge fits in a face, endpoints collinear to face edges,
 *  find those 2 face edges.
 * @param [[x, y], [x, y]] edge
 * @param [a, b, c, d, e] face_vertices. just 1 face. not .fold array
 * @param vertices_coords from .fold
 * @return [[a,b], [c,d]] vertices indices of the collinear face edges. 1:1 index relation to edge endpoints.
 */
var find_collinear_face_edges = function(edge, face_vertices, vertices_coords){
	let face_edge_geometry = face_vertices
		.map((v) => vertices_coords[v])
		.map((v, i, arr) => [v, arr[(i+1)%arr.length]]);
	return edge.map((endPt) => {
		// filter collinear edges to each endpoint, return first one
		// as an edge array index, which == face vertex array between i, i+1
		let i = face_edge_geometry
			.map((edgeVerts, edgeI) => ({index:edgeI, edge:edgeVerts}))
			.filter((e) => collinear(e.edge[0], e.edge[1], endPt))
			.shift()
			.index;
		return [face_vertices[i], face_vertices[(i+1)%face_vertices.length]]
			.sort((a,b) => a-b);
	})
}

// input: fold file and line
// output: dict keys: two vertex indices defining an edge (as a string: "4 6")
//         dict vals: [x, y] location of intersection between the two edge vertices
var clip_line_in_faces = function(foldFile, linePoint, lineVector){

	// convert faces into x,y geometry instead of references to vertices
	// generate one clip line per face, or undefined if there is no intersection
	// array of objects {face: index of face, clip: the clip line}
	let clipLines = foldFile.faces_vertices
		.map(va => va.map(v => foldFile.vertices_coords[v]))
		.map((poly,i) => ({
			"face":i,
			"clip":clip_line_in_poly(poly, linePoint, lineVector)
		}))
		.filter((obj) => obj.clip != undefined)
		.reduce((prev, curr) => {
			prev[curr.face] = {"clip": curr.clip};
			return prev;
		}, {});

	Object.keys(clipLines).forEach(faceIndex => {
		let face = foldFile.faces_vertices[faceIndex];
		let line = clipLines[faceIndex].clip;
		clipLines[faceIndex].collinear = find_collinear_face_edges(line, face, foldFile.vertices_coords);
	});

	// each face is now an index in the object, containing "clip", "collinear"
	// 0: {  clip: [[x,y],[x,y]],  collinear: [[i,j],[k,l]]  }
	return clipLines
}

var get_new_vertices = function(foldFile, clipLines){

	// edgeCrossings is object with N entries: # edges which are crossed by line
	let edgeCrossings = {};
	Object.keys(clipLines).forEach(faceIndex => {
		let keys = clipLines[faceIndex].collinear.map(e => e.sort((a,b) => a-b).join(" "))
		keys.forEach((k,i) => edgeCrossings[k] = ({
			"point": clipLines[faceIndex].clip[i],
			"face": parseInt(faceIndex)
		}))
	});

	let new_vertices = Object.keys(edgeCrossings).map(key => {
		edgeCrossings[key].edges = key.split(" ").map(s => parseInt(s));
		return edgeCrossings[key];
	})
	return new_vertices;
}

let make_new_vertices_coords = function(vertices_coords, newVertices){
	// deep copy components
	let new_vertices_coords = JSON.parse(JSON.stringify(foldFile.vertices_coords));

	newVertices.forEach(obj => {
		new_vertices_coords.push(obj.point);
		obj.newVertexIndex = new_vertices_coords.length-1
	})
	return new_vertices_coords;
}

/** 
 * build new faces around new vertices
 */
var make_faces_substitution = function(faces_vertices, clipLines, newVertices){
	// these will depricate the entries listed below, requiring rebuild:
	//   "vertices_vertices", "vertices_faces"
	//   "edges_faces", "edges_assignment", "edges_foldAngle", "edges_length"
	//   "faces_edges", "faces_layer", "faceOrders", "faces_matrix"

	let edgesCrossed = {};
	newVertices.forEach(newV => edgesCrossed[newV.edges.join(" ")] = newV)

	let facesSubstitutions = faces_vertices.map(arr => [arr, undefined]);
	Object.keys(clipLines).forEach( s => {
		let faceIndex = parseInt(s);
		var newFacePair = [ [], [] ]
		var rightLeft = 0;
		faces_vertices[faceIndex].forEach( (vertex,i,vertexArray) => {
			let nextVertex = vertexArray[(i+1)%vertexArray.length];
			var key = [vertex, nextVertex].sort( (a,b) => a-b ).join(' ')
			if(edgesCrossed[key]){
				var intersection = edgesCrossed[key].newVertexIndex;
				newFacePair[rightLeft].push(intersection)
				rightLeft = (rightLeft+1)%2; // flip bit
				newFacePair[rightLeft].push(intersection)
				newFacePair[rightLeft].push(nextVertex)
			} else{
				newFacePair[rightLeft].push(nextVertex)
			}
		})
		facesSubstitutions[faceIndex] = newFacePair;
	});
	return facesSubstitutions;
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

var mark_moving_faces = function(faces_vertices, vertices_coords, faces_faces, faces_layer, face_idx) {
	let marked = faces_vertices.map(() => false);
	marked[face_idx] = true;
	let to_process = [face_idx];
	let process_idx = 0;
	let faces_points = faces_vertices.map((vertices_index) => {
    if (vertices_index === undefined) {
      return undefined;
    }
    return vertices_index.map(i => vertices_coords[i]);
	})
	while (process_idx < to_process.length) {
		// pull face off queue
		let idx1 = to_process[process_idx];
		process_idx += 1;
		// add all unmarked above-overlapping faces to queue
		faces_vertices.forEach((vertices_index, idx2) => {
			if (!marked[idx2] && ((faces_layer[idx2] > faces_layer[idx1]))) {
        if (faces_points[idx1] !== undefined && faces_points[idx2] !== undefined) {
          if (overlaps(faces_points[idx1], faces_points[idx2])) {
            marked[idx2] = true;
            to_process.push(idx2);
          }
        }
			}
		});
		// add all unmarked adjacent faces to queue
		faces_faces[idx1].forEach((idx2) => {
			if (!marked[idx2]) {
				marked[idx2] = true;
				to_process.push(idx2);
			}
		});
	}
	return marked;
}

// layerOrder      - original fold file
// faces_vertices  - original fold file
// sides_faces_vertices - from clip_faces_.. function
// faces_mark      - boolean if a face in sides_faces_vertices should move
// whichSide       - which side of the sides_faces_vertices we're moving
var reconstitute_faces = function(faces_vertices, faces_layer, sides_faces_vertices, faces_mark, whichSideMoves, faces_matrix){
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
	let new_faces_matrix = faces_matrix.slice();
	let new_faces_matrix_end = [];
	faces_mark.forEach((shouldMove,i) => {
		if(!shouldMove){ 
			// not folding this face, revert back to original joined face
			new_faces_vertices.push(faces_vertices[i]);
		}
		else{
			// yes, we are using this face
			// staying face goes in the same place
			let stayingFace = sides_faces_vertices[i][(whichSideMoves+1)%2];
			new_faces_vertices.push(stayingFace);
			// moving face goes at the end of the array (temporarily in new array)
			let movingFace = sides_faces_vertices[i][whichSideMoves];
			new_faces_vertices_end.push(movingFace);
			new_faces_layer_end.push( new_faces_layer[i] );
			// copy over parent face's matrix, we will modify it during reflection step
			new_faces_matrix_end.push( faces_matrix[i] ); 
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

	new_faces_matrix_end = new_faces_matrix_end.map((a,i) => ({'value':a, 'i':shuffle_order[i]}))
	new_faces_matrix_end.sort( (a,b) => a.i-b.i)
	new_faces_matrix_end = new_faces_matrix_end.map(a => a.value)

	var compiled_faces_vertices = new_faces_vertices.concat(new_faces_vertices_end);
	var compiled_faces_layer = faces_layer.slice().concat(new_faces_layer_end_sorted);
	var compiled_faces_matrix = faces_matrix.slice().concat(new_faces_matrix_end);

	return {
		'faces_vertices': compiled_faces_vertices,
		'faces_layer':    compiled_faces_layer,
		'faces_matrix':    compiled_faces_matrix
	}
}

var reflect_across_fold = function(foldFile, arrayIndex, linePoint, lineVector){
	var matrix = Matrix.reflection(linePoint, lineVector);

	var top_layer = foldFile.faces_layer.slice(0, arrayIndex);
	var bottom_layer = foldFile.faces_layer.slice(arrayIndex, arrayIndex + foldFile.faces_layer.length-arrayIndex);
	bottom_layer.reverse();

	var boolArray = foldFile.vertices_coords.map(() => false)

	for(var i = arrayIndex; i < foldFile.faces_vertices.length; i++){
		for(var f = 0; f < foldFile.faces_vertices[i].length; f++){
			if(!boolArray[ foldFile.faces_vertices[i][f] ]){
				var vert = foldFile.vertices_coords[ foldFile.faces_vertices[i][f] ];
				foldFile.vertices_coords[ foldFile.faces_vertices[i][f] ] = transform_point(vert, matrix);
				boolArray[ foldFile.faces_vertices[i][f] ] = true;
			}
		}
	}

	// face matrix transform
	for(var i = arrayIndex; i < foldFile.faces_matrix.length; i++){
		foldFile.faces_matrix[i] = Matrix.multiply(matrix, foldFile.faces_matrix[i]);
	}

	return {
		'faces_layer': top_layer.concat(bottom_layer),
		'vertices_coords': foldFile.vertices_coords
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


var faces_vertices_to_edges = function (mesh) {
	var edge, edgeMap, face, i, key, ref, v1, v2, vertices;
	mesh.edges_vertices = [];
	mesh.edges_faces = [];
	mesh.faces_edges = [];
	mesh.edges_assignment = [];
	edgeMap = {};
	ref = mesh.faces_vertices;
	console.log("faces_vertices_to_edges");
	console.log(ref);
	console.log(ref.length);
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

	// keys are faces with vals: {clip: [[x,y],[x,y]], collinear:[[i,j],[k,l]] }
	let clippedLines = clip_line_in_faces(fold, linePoint, lineVector);
	// array of objects: {edges:[i,j], face:f, point:[x,y]}
	let newVertices = get_new_vertices(fold, clippedLines);
	let new_vertices_coords = make_new_vertices_coords(fold.vertices_coords, newVertices);
	let facesSubstitutions = make_faces_substitution(fold.faces_vertices, clippedLines, newVertices)
	let sides_faces = facesSubstitutions.map(subs =>
		sortTwoFacesBySide(subs, new_vertices_coords, linePoint, lineVector)
	)

	let touched = top_face_under_point(fold, point);
	if (touched === undefined) { return undefined; }

	console.log("------------------");
	console.log(sides_faces);
	console.log(sides_faces[touched]);

	// convert undefined to empty array
	let side = [0,1]
		.map(s => sides_faces[touched][s] == undefined ? [] : sides_faces[touched][s]) 
		.map(points => points.map(f => new_vertices_coords[f]))
		.map(f => contains(f, point))
		.indexOf(true)

	let faces_faces = make_faces_faces(sides_faces.map(f => f[side]));

	let faces_mark = mark_moving_faces(
		sides_faces.map(f => f[side]),
		new_vertices_coords,
		faces_faces,
		fold.faces_layer,
		touched
	);

	let new_fold = reconstitute_faces(
		fold.faces_vertices,
		fold.faces_layer,
		sides_faces,
		faces_mark,
		side,
		fold.faces_matrix);
	new_fold.vertices_coords = new_vertices_coords;

	// clean isolated vertices
	// (compiled_faces_vertices, compiled_faces_layer)
	// var cleanResult = clean_isolated_vertices(
	//  { vertices_coords: compiled_faces_vertices, 
	//    faces_vertices: compiled_faces_layer
	//  });


	console.log("+++++++++++", new_fold.faces_vertices);

	var faces_layer, vertices_coords;
	({vertices_coords, faces_layer} = reflect_across_fold(
		new_fold, fold.faces_layer.length, linePoint, lineVector));

	new_fold.vertices_coords = vertices_coords;
	new_fold.faces_layer = faces_layer;
	// new_fold.faces_matrix = faces_matrix;

	faces_vertices_to_edges(new_fold);

	// copy new vertices over to crease pattern, inverse matrix transform
	let inverseMatrices = new_fold.faces_matrix.map(n => Matrix.inverse(n))
	// for every vertex, give me an index to a face which it's found in
	let vertex_in_face = new_fold.vertices_coords.map(v => -1).map((v,i) => {
		for(var f = 0; f < new_fold.faces_vertices.length; f++){
			if(new_fold.faces_vertices[f].includes(i)){ return f; }
		}
	});
	
	console.log("vertex_in_face", vertex_in_face);
	let new_vertices_coords_cp = new_fold.vertices_coords.map((point,i) =>
		transform_point(point, inverseMatrices[vertex_in_face[i]]).map((n) => 
			clean_number(n)
		)
	)

	///////////////////////////////////////////////
	console.log("clippedLines", clippedLines);
	console.log("newVertices", newVertices);
	console.log("new_vertices_coords", new_vertices_coords);
	console.log("facesSubstitutions", facesSubstitutions);
	console.log("sides_faces", sides_faces);
	console.log("touched", touched);
	console.log("side", side);
	console.log("faces_mark", faces_mark);
	console.log("new_fold", new_fold);
	console.log("new_vertices_coords", new_vertices_coords);
	console.log("vertex_in_face", vertex_in_face);
	///////////////////////////////////////////////


	// we don't want to completely overwrite the file. bring along some metadata and replace when necessary
	let headers = {
		"file_spec": 1.1,
		"file_creator": "Rabbit Ear",
		"file_author": "",
		"file_classes": ["singleModel"],
		"frame_attributes": ["2D"],
		"frame_title": "one valley crease",
		"frame_classes": ["foldedState"]
	};
	Object.keys(headers).forEach(meta => new_fold[meta] = (fold[meta] == undefined) ? headers[meta] : fold[meta])

	new_fold.file_classes = ["singleModel"];
	new_fold.frame_attributes = ["2D"];
	new_fold.frame_classes = ["foldedState"];
	new_fold.file_frames = [{
		"frame_classes": ["creasePattern"],
		"parent": 0,
		"inherit": true,
		"vertices_coords": new_vertices_coords_cp
	}];

	// let faces_vertices;
	// ({vertices_coords, faces_vertices} = clean_isolated_vertices(new_fold));
	// console.log(new_fold);
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

