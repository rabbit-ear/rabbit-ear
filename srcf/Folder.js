/** .FOLD file format modifier
 * 
 *  fold/unfold, add new creases, navigate frames,
 *  general cleanup and validation
 */
// dependencies: 
// - FOLD https://github.com/edemaine/fold/


// -- built for FOLD 1.1 --
// vertices_coords
// vertices_vertices
// vertices_faces
// edges_vertices
// edges_faces
// edges_assignment
// edges_foldAngle
// edges_length
// faces_vertices
// faces_edges
// faceOrders
// edgeOrders

// file_spec // num str
// file_creator // str
// file_author  // str
// file_title  // str
// file_description  // str
// file_classes // arr of str
// file_frames //

'use strict';

import * as Graph from './Graph'
import * as Geom from './Geom'

export function flattenFrame(fold_file, frame_num){
	const dontCopy = ["frame_parent", "frame_inherit"];
	var memo = {visited_frames:[]};
	function recurse(fold_file, frame, orderArray){
		if(memo.visited_frames.indexOf(frame) != -1){
			throw ".FOLD file_frames encountered a cycle. stopping.";
			return orderArray;
		}
		memo.visited_frames.push(frame);
		orderArray = [frame].concat(orderArray);
		if(frame == 0){ return orderArray; }
		if(fold_file.file_frames[frame - 1].frame_inherit &&
		   fold_file.file_frames[frame - 1].frame_parent != undefined){
			return recurse(fold_file, fold_file.file_frames[frame - 1].frame_parent, orderArray);
		}
		return orderArray;
	}
	return recurse(fold_file, frame_num, []).map(frame => {
		if(frame == 0){
			// for frame 0 (the key frame) don't copy over file_frames array
			let swap = fold_file.file_frames;
			fold_file.file_frames = null;
			let copy = clone(fold_file);
			fold_file.file_frames = swap;
			delete copy.file_frames;
			dontCopy.forEach(key => delete copy[key]);
			return copy;
		}
		let copy = clone(fold_file.file_frames[frame-1])
		dontCopy.forEach(key => delete copy[key]);
		return copy;
	}).reduce((prev,curr) => Object.assign(prev,curr),{})
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

/** deep clone an object */
export function clone(thing){
	// types to check:, "undefined" / "null", "boolean", "number", "string", "symbol", "function", "object"
	return JSON.parse(JSON.stringify(thing));  // supposed to be slow
	// recurse over each entry, somebody with more knowledge of edge cases needs to check this
	// if(thing == null || typeof thing == "boolean" || typeof thing ==  "number" ||
	//    typeof thing ==  "string" || typeof thing ==  "symbol"){ return thing; }
	// var copy = (thing.constructor === Array) ? thing.slice() : Object.assign({},thing);
	// Object.entries(copy)
	// 	.filter(([k,v]) => typeof v == "object" || typeof v == "symbol" || typeof v == "function")
	// 	.forEach(([k,v]) => copy[k] = clone(copy[k]) )
	// return copy;
};

/** 
 * when an edge sits inside a face with its endpoints collinear to face edges,
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
			.filter((e) => Geom.edge_collinear(e.edge[0], e.edge[1], endPt))
			.shift()
			.index;
		return [face_vertices[i], face_vertices[(i+1)%face_vertices.length]]
			.sort((a,b) => a-b);
	})
}

// input: fold file and line
// output: dict keys: two vertex indices defining an edge (as a string: "4 6")
//         dict vals: [x, y] location of intersection between the two edge vertices
var clip_line_in_faces = function({vertices_coords, faces_vertices},
	linePoint, lineVector){
	// convert faces into x,y geometry instead of references to vertices
	// generate one clip line per face, or undefined if there is no intersection
	// array of objects {face: index of face, clip: the clip line}
	let clipLines = faces_vertices
		.map(va => va.map(v => vertices_coords[v]))
		.map((poly,i) => ({
			"face":i,
			"clip":Geom.clip_line_in_poly(poly, linePoint, lineVector)
		}))
		.filter((obj) => obj.clip != undefined)
		.reduce((prev, curr) => {
			prev[curr.face] = {"clip": curr.clip};
			return prev;
		}, {});

	Object.keys(clipLines).forEach(faceIndex => {
		let face = faces_vertices[faceIndex];
		let line = clipLines[faceIndex].clip;
		clipLines[faceIndex].collinear = find_collinear_face_edges(line, face, vertices_coords);
	});

	// each face is now an index in the object, containing "clip", "collinear"
	// 0: {  clip: [[x,y],[x,y]],  collinear: [[i,j],[k,l]]  }
	return clipLines
}

var get_new_vertices = function(clipLines){
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
	let new_vertices_coords = JSON.parse(JSON.stringify(vertices_coords));

	newVertices.forEach(obj => {
		new_vertices_coords.push(obj.point);
		obj.newVertexIndex = new_vertices_coords.length-1;
	})
	return new_vertices_coords;
}

/** 
 * edge-walk faces with the new clip line to make 2 faces where 1 face was.
 */
var make_new_face_mapping = function(faces_vertices, clipLines, newVertices){
	// these will depricate the entries listed below, requiring rebuild:
	//   "vertices_vertices", "vertices_faces"
	//   "edges_faces", "edges_assignment", "edges_foldAngle", "edges_length"
	//   "faces_edges", "faces_layer", "faceOrders"

	let edgesCrossed = {};
	newVertices.forEach(newV => edgesCrossed[newV.edges.join(" ")] = newV)

	let new_face_map = faces_vertices.map(arr => [arr, undefined]);
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
		new_face_map[faceIndex] = newFacePair;
	});
	return new_face_map;
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

var mark_moving_faces = function(faces_vertices, vertices_coords, faces_faces, faces_layer, face_idx) {
	let marked = faces_vertices.map(() => false);
	marked[face_idx] = true;
	let to_process = [face_idx];
	let process_idx = 0;
	let faces_points = faces_vertices.map((vertices_index) =>
	(vertices_index === undefined)
		? undefined
		: vertices_index.map(i => vertices_coords[i])
	)
	while (process_idx < to_process.length) {
		// pull face off queue
		let idx1 = to_process[process_idx];
		process_idx += 1;
		// add all unmarked above-overlapping faces to queue
		faces_vertices.forEach((vertices_index, idx2) => {
			if (!marked[idx2] && ((faces_layer[idx2] > faces_layer[idx1]))) {
		if (faces_points[idx1] !== undefined && faces_points[idx2] !== undefined) {
		  if (Geom.overlaps(faces_points[idx1], faces_points[idx2])) {
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

/** merge faces or separate faces at the clip line, and bubble up faces
 *  in the layer order if they're going to be folded.
 * new_face_map   - from make_new_face_mapping function
 * faces_mark     - boolean if a face in new_face_map should move
 * whichSideMoves - which side of the new_face_map we're moving
 */
var reconstitute_faces = function(faces_vertices, faces_layer, new_face_map, faces_mark, whichSideMoves){
	// for each level there are 4 cases:
	//  1. do not move: clipping ignored. original face restored. new_face_map ignored.
	//  2. move and clipping occured: split faces, move one face (to top layer)
	//  3. move without clipping: face was on one side and it either
	//     3a. moves  3b. stays
	let new_faces_vertices = faces_vertices.slice(); // append to this
	let new_faces_layer = faces_layer.slice(); // don't append to this
	let top_layer_map = []; // {face:_, layer:_}
	let stay_layers = new_faces_layer.length; // which layer # divides stay/fold

	let faces_mark_i = faces_mark.map((mark,i) => ({mark:mark, i:i}))

	let stay_faces = faces_mark.map((mark,i) => {
		if(mark){ return new_face_map[i][(whichSideMoves+1)%2]; }
		else { return faces_vertices[i]; }
	}).map((verts,i) => {
		if(verts != undefined){ return {old_face:i, old_layer:faces_layer[i], new_vertices:verts}; }
	}).filter(el => el != undefined)

	let move_faces = faces_mark_i
		.filter(obj => obj.mark)
		.map(obj =>
		 ({old_face:obj.i, old_layer:faces_layer[obj.i], new_vertices:new_face_map[obj.i][whichSideMoves]})
	)
	return {stay_faces, move_faces};
}

// argument objects stay_faces and move_faces are modified in place
var sort_faces_valley_fold = function(stay_faces, move_faces){
	// top/bottom layer maps. new faces, new layers, and where they came from
	// some faces have bubbled to the top, layers need to decrement to take their place
	stay_faces.forEach((obj,i) => obj.i = i);
	move_faces.forEach((obj,i) => obj.i = i);
	stay_faces.sort((a,b) => a.old_layer - b.old_layer)
		.forEach((obj,j) => obj.new_layer = j);
	// give me the top-most layer
	// give layer numbers to the new faces
	move_faces.sort((a,b) => a.old_layer - b.old_layer)
		.forEach((obj,j) => obj.new_layer = j + stay_faces.length);
	// we really don't need to do this. put faces back in original order
	stay_faces.sort((a,b) => a.i - b.i);
	move_faces.sort((a,b) => a.i - b.i);
	stay_faces.forEach(obj => delete obj.i);
	move_faces.forEach(obj => delete obj.i);
	// give new face ids
	stay_faces.forEach((obj,i) => obj.new_face = i);
	move_faces.forEach((obj,i) => obj.new_face = i + stay_faces.length);
	// perform a valley fold
	let stay_faces_vertices = stay_faces.map(obj => obj.new_vertices)
	let move_faces_vertices = move_faces.map(obj => obj.new_vertices)
	let stay_faces_layer = stay_faces.map(obj => obj.new_layer)
	let move_faces_layer = move_faces.map(obj => obj.new_layer)
	return {
		'faces_vertices': stay_faces_vertices.concat(move_faces_vertices),
		'faces_layer': stay_faces_layer.concat(move_faces_layer)
	}
}

var reflect_across_fold = function(vertices_coords, faces_vertices,
	faces_layer, stay_layers, linePoint, lineVector){
	var matrix = Geom.Matrix.reflection(linePoint, lineVector);

	var top_layer = faces_layer.slice(0, stay_layers);
	var bottom_layer = faces_layer.slice(stay_layers, stay_layers + faces_layer.length-stay_layers);
	bottom_layer.reverse();

	var boolArray = vertices_coords.map(() => false)

	for(var i = stay_layers; i < faces_vertices.length; i++){
		for(var f = 0; f < faces_vertices[i].length; f++){
			if(!boolArray[ faces_vertices[i][f] ]){
				var vert = vertices_coords[ faces_vertices[i][f] ];
				vertices_coords[ faces_vertices[i][f] ] = Geom.transform_point(vert, matrix);
				boolArray[ faces_vertices[i][f] ] = true;
			}
		}
	}
	return {
		'faces_layer': top_layer.concat(bottom_layer),
		'vertices_coords': vertices_coords,
	}
}

// get index of highest layer face which intersects point
var top_face_under_point = function(
		{faces_vertices, vertices_coords, faces_layer}, 
		point) {
	let top_fi = faces_vertices.map(
		(vertices_index, fi) => {
			let points = vertices_index.map(i => vertices_coords[i]);
			return Geom.contains(points, point) ? fi : -1;
		}).reduce((acc, fi) => {
			return ((acc === -1) || 
							((fi !== -1) && (faces_layer[fi] > faces_layer[acc]))
			) ? fi : acc;
		}, -1);
	return (top_fi === -1) ? undefined : top_fi;
}

// assumes point not on line
var split_folding_faces = function(fold, linePoint, lineVector, point) {

	// find which face index (layer) the user touched
	let tap = top_face_under_point(fold, point);
	if (tap == undefined) { return undefined; }
	// keys are faces with vals: {clip: [[x,y],[x,y]], collinear:[[i,j],[k,l]] }
	let clippedLines = clip_line_in_faces(fold, linePoint, lineVector);
	// array of objects: {edges:[i,j], face:f, point:[x,y]}
	let newVertices = get_new_vertices(clippedLines);
	// create a new .fold vertices_coords with new data appended to the end
	let new_vertices_coords = make_new_vertices_coords(fold.vertices_coords, newVertices);
	// walk faces. generate two new faces for every cut face
	// sort these new face-pairs by which side of the line they are.
	let new_face_map = make_new_face_mapping(fold.faces_vertices,
			clippedLines, newVertices).map((subs) =>
			sortTwoFacesBySide(subs, new_vertices_coords, linePoint, lineVector)
		)
	// convert undefined to empty array to convert face indices to face point geometry
	let side = [0,1]
		.map(s => new_face_map[tap][s] == undefined ? [] : new_face_map[tap][s]) 
		.map(points => points.map(f => new_vertices_coords[f]))
		.map(f => Geom.contains(f, point))
		.indexOf(true)
	// make face-adjacent faces on only a subset, the side we clicked on
	let moving_side = new_face_map.map(f => f[side]);
	let faces_faces = Graph.make_faces_faces({faces_vertices:moving_side});
	// mark which faces are going to be moving based on a valley fold
	let faces_mark = mark_moving_faces(moving_side, new_vertices_coords, 
		faces_faces, fold.faces_layer, tap);

	// split faces at the fold line. 
	let stay_faces, move_faces;
	({stay_faces, move_faces} = reconstitute_faces(fold.faces_vertices,
		fold.faces_layer, new_face_map, faces_mark, side));

	// compile layers back into arrays, bubble moving faces to top z-order
	let stay_layers = stay_faces.length;
	let new_layer_data = sort_faces_valley_fold(stay_faces, move_faces);

	// clean isolated vertices
	// (compiled_faces_vertices, compiled_faces_layer)
	// var cleaned = Graph.remove_isolated_vertices({new_vertices_coords,
	//	new_layer_data.faces_vertices});
	var cleaned = {
		vertices_coords: new_vertices_coords,
		faces_vertices:new_layer_data.faces_vertices
	};
	Graph.remove_isolated_vertices(cleaned);

	// flip points across the fold line, 
	let reflected = reflect_across_fold(cleaned.vertices_coords,
		cleaned.faces_vertices, new_layer_data.faces_layer,
		stay_layers, linePoint, lineVector);

	// for every vertex, give me an index to a face which it's found in
	let vertex_in_face = reflected.vertices_coords.map((v,i) => {
		for(var f = 0; f < cleaned.faces_vertices.length; f++){
			if(cleaned.faces_vertices[f].includes(i)){ return f; }
		}
	});

	var bottom_face = 1; // todo: we need a way for the user to select this
	let faces_matrix = Graph.make_faces_matrix({vertices_coords:reflected.vertices_coords, 
		faces_vertices:cleaned.faces_vertices}, bottom_face);
	let inverseMatrices = faces_matrix.map(n => Geom.Matrix.inverse(n));

	let new_vertices_coords_cp = reflected.vertices_coords.map((point,i) =>
		Geom.transform_point(point, inverseMatrices[vertex_in_face[i]]).map((n) => 
			Geom.clean_number(n)
		)
	)

	// let faces_direction = cleaned.faces_vertices.map(f => true);
	// make_face_walk_tree(cleaned.faces_vertices, bottom_face)
	// 	.forEach((level,i) => level.forEach((f) => 
	// 		faces_direction[f.face] = i%2==0 ? true : false
	// 	))

	// create new fold file
	let new_fold = {
		vertices_coords: reflected.vertices_coords,
		faces_vertices: cleaned.faces_vertices,
		faces_layer: reflected.faces_layer
	};

	// new_fold.faces_direction = faces_direction;
	
	Graph.faces_vertices_to_edges(new_fold);

	let headers = {
		"file_spec": 1.1,
		"file_creator": "Rabbit Ear",
		"file_author": "",
		"file_classes": ["singleModel"],
		"frame_attributes": ["2D"],
		"frame_title": "one valley crease",
		"frame_classes": ["foldedState"]
	};
	// bring along any metadata from the original file, replace when necessary
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

	// console.log("------------------");
	// console.log("1. tap", tap);
	// console.log("2. clippedLines", clippedLines);
	// console.log("3. newVertices", newVertices);
	// console.log("4. new_vertices_coords", new_vertices_coords);
	// console.log("5. new_face_map", new_face_map);
	// console.log("6. side", side);
	// console.log("7. faces_faces", faces_faces);
	// console.log("8. faces_mark", faces_mark);
	// console.log("9. new_layer_data", new_layer_data);
	// console.log("9. faces_layer", reflected.faces_layer);
	// console.log("10. vertices_coords", new_fold.vertices_coords);
	// console.log("11. vertex_in_face", vertex_in_face);
	// console.log("12. faces_matrix", faces_matrix);
	// console.log("13. new_fold", new_fold);

	return new_fold;
}

/** This filters out all non-operational edges
 * removes: "F": flat "U": unassigned
 * retains: "B": border/boundary, "M": mountain, "V": valley
 */
function remove_flat_creases(fold){
	let removeTypes = ["f", "F", "b", "B"];
	let removeEdges = fold.edges_assignment
		.map((a,i) => ({a:a,i:i}))
		.filter(obj => removeTypes.indexOf(obj.a) != -1)
		.map(obj => obj.i)
	Graph.remove_edges(fold, removeEdges);
}

function faces_containing_point(fold, point){
	return fold.faces_vertices
		.map((fv,i) => ({face:fv.map(v => fold.vertices_coords[v]),i:i}))
		.filter(f => Geom.contains(f.face, point))
		.map(f => f.i);
}

function fold_without_layering(fold, face){
	if (face == null){ face = 0; }
	let faces_matrix = Graph.make_faces_matrix(fold, face);

	let vertex_in_face = fold.vertices_coords.map((v,i) => {
		for(var f = 0; f < fold.faces_vertices.length; f++){
			if(fold.faces_vertices[f].includes(i)){ return f; }
		}
	});
	console.log("vertex_in_face");
	console.log(vertex_in_face);

	let new_vertices_coords_cp = fold.vertices_coords.map((point,i) =>
		Geom.transform_point(point, faces_matrix[vertex_in_face[i]]).map((n) => 
			Geom.clean_number(n)
		)
	)

	console.log("new_vertices_coords_cp");
	console.log(new_vertices_coords_cp);

	fold.vertices_coords = new_vertices_coords_cp;
	return fold;
}

// function clip_face_into_two(fold, face_index, )



var get_new_vertices = function(clipLines){
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


// /** clip an infinite line in a polygon, returns an edge or undefined if no intersection */
// export function clip_line_in_poly(poly, linePoint, lineVector){
// 	let intersections = poly
// 		.map((p,i,arr) => [p, arr[(i+1)%arr.length]] ) // poly points into edge pairs
// 		.map((el,i,arr) => ({
// 			xing:line_edge_intersection(linePoint, lineVector, el[0], el[1]),
// 			poly_vertices:[i, (i+1)%arr.length]
// 		}))
// 		.filter((el) => el.xing != null);
// 	switch(intersections.length){
// 	case 0: return undefined;
// 	case 1: // degenerate edge
// 		let array = [intersections[0].xing, intersections[0].xing];
// 		array[face]
// 	case 2:
// 		let array = intersections.map(el => el.xing)
// 		return intersections;
// 	default:
// 	// special case: line intersects directly on a poly point (2 edges, same point)
// 	//  filter to unique points by [x,y] comparison.
// 		for(let i = 1; i < intersections.length; i++){
// 			if( !points_equivalent(intersections[0], intersections[i])){
// 				return [intersections[0], intersections[i]];
// 			}
// 		}
// 	}
// }


var clip_line_in_faces = function({vertices_coords, faces_vertices},
	linePoint, lineVector){
	// convert faces into x,y geometry instead of references to vertices
	// generate one clip line per face, or undefined if there is no intersection
	// array of objects {face: index of face, clip: the clip line}
	let clipLines = faces_vertices
		.map(va => va.map(v => vertices_coords[v]))
		.map((poly,i) => ({
			"face":i,
			"clip":Geom.clip_line_in_poly(poly, linePoint, lineVector)
		}))
		.filter((obj) => obj.clip != undefined)
		.reduce((prev, curr) => {
			prev[curr.face] = {"clip": curr.clip};
			return prev;
		}, {});

	Object.keys(clipLines).forEach(faceIndex => {
		let face = faces_vertices[faceIndex];
		let line = clipLines[faceIndex].clip;
		clipLines[faceIndex].collinear = find_collinear_face_edges(line, face, vertices_coords);
	});

	// each face is now an index in the object, containing "clip", "collinear"
	// 0: {  clip: [[x,y],[x,y]],  collinear: [[i,j],[k,l]]  }
	return clipLines
}

export function crease_through_layers(fold_file, line){
	let fold = clone(fold_file);
	remove_flat_creases(fold);
	console.log("crease_through_layers");
	let face = faces_containing_point(fold, line.point).shift();
	if (face == null){ return; }
	console.log(face);
	let folded = fold_without_layering(fold, face);
	console.log(folded);

	let clippedLines = clip_line_in_faces(folded, line.point, line.direction);

	console.log("clippedLines");
	console.log(clippedLines);

	let newVertices = get_new_vertices(clippedLines);
	// create a new .fold vertices_coords with new data appended to the end
	let new_vertices_coords = make_new_vertices_coords(fold.vertices_coords, newVertices);
	// walk faces. generate two new faces for every cut face
	// sort these new face-pairs by which side of the line they are.
	let new_face_map = make_new_face_mapping(fold.faces_vertices,
			clippedLines, newVertices).map((subs) =>
			sortTwoFacesBySide(subs, new_vertices_coords, line.point, line.direction)
		)

	let side = 0;
	console.log("new_face_map");
	console.log(new_face_map);
	let faces_mark = new_face_map.map(a => true)

	let stay_faces, move_faces;
	({stay_faces, move_faces} = reconstitute_faces(fold.faces_vertices,
		fold.faces_layer, new_face_map, faces_mark, side));

	// compile layers back into arrays, bubble moving faces to top z-order
	let stay_layers = stay_faces.length;
	let new_layer_data = sort_faces_valley_fold(stay_faces, move_faces);

	// clean isolated vertices
	// (compiled_faces_vertices, compiled_faces_layer)
	// var cleaned = Graph.remove_isolated_vertices({new_vertices_coords,
	//	new_layer_data.faces_vertices});
	var cleaned = {
		vertices_coords: new_vertices_coords,
		faces_vertices:new_layer_data.faces_vertices
	};
	Graph.remove_isolated_vertices(cleaned);

	// flip points across the fold line, 
	let reflected = reflect_across_fold(cleaned.vertices_coords,
		cleaned.faces_vertices, new_layer_data.faces_layer,
		stay_layers, line.point, line.direction);

	// for every vertex, give me an index to a face which it's found in
	let vertex_in_face = reflected.vertices_coords.map((v,i) => {
		for(var f = 0; f < cleaned.faces_vertices.length; f++){
			if(cleaned.faces_vertices[f].includes(i)){ return f; }
		}
	});

	var bottom_face = 1; // todo: we need a way for the user to select this
	let faces_matrix = Graph.make_faces_matrix({vertices_coords:reflected.vertices_coords, 
		faces_vertices:cleaned.faces_vertices}, bottom_face);
	let inverseMatrices = faces_matrix.map(n => Geom.Matrix.inverse(n));

	let new_vertices_coords_cp = reflected.vertices_coords.map((point,i) =>
		Geom.transform_point(point, inverseMatrices[vertex_in_face[i]]).map((n) => 
			Geom.clean_number(n)
		)
	)

	// let faces_direction = cleaned.faces_vertices.map(f => true);
	// make_face_walk_tree(cleaned.faces_vertices, bottom_face)
	// 	.forEach((level,i) => level.forEach((f) => 
	// 		faces_direction[f.face] = i%2==0 ? true : false
	// 	))

	// create new fold file
	// let new_fold = {
	// 	vertices_coords: reflected.vertices_coords,
	// 	faces_vertices: cleaned.faces_vertices,
	// 	faces_layer: reflected.faces_layer
	// };

	// return new_fold;

	fold.vertices_coords = reflected.vertices_coords;
	fold.faces_vertices = cleaned.faces_vertices;
	fold.faces_layer = reflected.faces_layer;



	// let faces_matrix = Graph.make_faces_matrix({vertices_coords:reflected.vertices_coords, 
	// 	faces_vertices:cleaned.faces_vertices}, bottom_face);
	// let inverseMatrices = faces_matrix.map(n => Geom.Matrix.inverse(n));
	// let new_vertices_coords_cp = reflected.vertices_coords.map((point,i) =>
	// 	Geom.transform_point(point, inverseMatrices[vertex_in_face[i]]).map((n) => 
	// 		Geom.clean_number(n)
	// 	)
	// )


	return fold_file;
}


// export function fold(face){
// 	this.clean();
// 	var copyCP = this.copy().removeAllMarks();
// 	if(face == undefined){
// 		var bounds = copyCP.boundaryBounds();
// 		face = copyCP.nearest(bounds.origin.x + bounds.size.width * 0.5,
// 		                      bounds.origin.y + bounds.size.height*0.5).face;
// 	} else{
// 		var centroid = face.centroid();
// 		face = copyCP.nearest(centroid.x, centroid.y).face;
// 	}
// 	if(face === undefined){ return; }
// 	var tree = face.adjacentFaceTree();
// 	var faces = [];
// 	tree['matrix'] = new M.Matrix();
// 	faces.push({'face':tree.obj, 'matrix':tree['matrix'], 'level':0});
// 	function recurse(node, level){
// 		node.children.forEach(function(child){
// 			var local = child.obj.commonEdges(child.parent.obj).shift().reflectionMatrix();
// 			child['matrix'] = child.parent['matrix'].mult(local);
// 			faces.push({'face':child.obj, 'matrix':child['matrix'], 'level':level});
// 			recurse(child, level+1);
// 		},this);
// 	}
// 	recurse(tree, 1);
// 	var nodeTransformed = Array.apply(false, Array(copyCP.nodes.length))
// 	faces.forEach(function(f){
// 		f.face.cache = {matrix:f.matrix, coloring:f.level % 2};
// 		f.face.nodes
// 			.filter(function(node){ return !nodeTransformed[node.index]; },this)
// 			.forEach(function(node){
// 				node.transform(f.matrix);
// 				nodeTransformed[node.index] = true;
// 			},this);
// 	},this);
// 	return copyCP.exportFoldFile();
// }


/** clip an infinite line in a polygon, returns an edge or undefined if no intersection */
// requires:
// - fold.vertices_coords
// - fold.edges_vertices
// - fold.faces_vertices
export function clip_edges_with_line(fold, linePoint, lineVector){
	var vertex_index = fold.vertices_coords.length;
	let vertices_intersections = fold.vertices_coords
		.map(v => Geom.line_collinear(linePoint, lineVector, v));
	let edges_intersections = fold.edges_vertices
		.map(ev => ev.map(v => fold.vertices_coords[v]))
		.map((edge, i) => {
			let intersection = Geom.line_edge_intersect_exclusive(linePoint, lineVector, edge[0], edge[1]);
			let new_index = (intersection == null ? vertex_index : vertex_index++);
			return {
				point: intersection,
				vertices: fold.edges_vertices[i], // shallow copy to fold file
				new_index: new_index
			};
		})

	console.log(vertices_intersections);
	console.log(edges_intersections);

	// add new vertices to vertex_ arrays
	let new_vertices = edges_intersections
		.filter(el => el.point != null)
		.map(el => el.point)

	new_vertices.forEach(v => fold.vertices_coords.push(v));
	// fold.vertices_coords = fold.vertices_coords.concat(new_vertices);
	// add new edges to edges_ arrays

	// let new_edges = edges_intersections
	// 	.filter(el => el.intersection != null)
	// 	.map(el => el.point)
	// fold.edges_vertices = fold.edges_vertices.concat(new_edges);

	// rebuild edges
	let edge_record = [];
	edges_intersections
		.map((sect, i) => ({sect:sect, edge:i}))
		.filter(el => el.sect.point != null)
		.forEach(el => {
			let edge_vertices_a = [fold.edges_vertices[el.edge][0], el.sect.new_index];
			let edge_vertices_b = [fold.edges_vertices[el.edge][1], el.sect.new_index];
			Graph.rebuild_edge(fold, el.edge, edge_vertices_a, edge_vertices_b);
			edge_record[el.edge] = {
				edges:[
					fold.edges_vertices.length-2, 
					fold.edges_vertices.length-1
				],
				vertices:[
					edge_vertices_a[0],
					edge_vertices_b[0],
					el.sect.new_index
				]
			};
		});
	// rebuild faces and build new edges (requires faces)
	// let edge_record = edges_intersections
	// 	.map((sect,i) => sect.point == null ? undefined : i)
	// 	.filter(el => el != null)
	// 	.map(edge_i => fold.edges_vertices[edge_i])

	console.log(edge_record);

	// important!
	// vertices_vertices is now invalid


	// let two_vertex_with_intersection = {
	// 	"0 2" : new_v_i,
	// 	"5 7" : new_v_i,
	// 	"20 8" : new_v_i
	// }
	// let old_edge_with_intersection = {
	// 	"1" : new_v_i,
	// 	"4" : new_v_i,
	// 	"5" : new_v_i
	// }

	// let new_face_parts = [
	// 	undefined,
	// 	{}
	// ]

	// fold.faces_vertices.



	// clean components
	let vertices_to_remove = fold.vertices_coords
		.map((vc,i) => vc == null ? i : undefined)
		.filter(el => el != null)
	let edges_to_remove = fold.edges_vertices
		.map((ev,i) => ev == null ? i : undefined)
		.filter(el => el != null)
	// let faces_to_remove = fold.faces_vertices
	// 	.map((fv,i) => fv == null ? i : undefined)
	// 	.filter(el => el != null)
	
	Graph.remove_vertices(fold, vertices_to_remove);
	Graph.remove_edges(fold, edges_to_remove);

}
