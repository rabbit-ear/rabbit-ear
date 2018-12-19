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

import * as Graph from './Graph'
import * as Geom from '../lib/geometry'
// import * as Geom from './math/core'
// import * as Rules from './math/rules'
// import * as Intersection from './math/intersection'

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


export function merge_frame(fold_file, frame){
	const dontCopy = ["frame_parent", "frame_inherit"];
	let copy = clone(frame);
	dontCopy.forEach(key => delete copy[key]);
	// don't deep copy file_frames. stash. bring them back.
	let swap = fold_file.file_frames;
	fold_file.file_frames = null;
	let fold = clone(fold_file);
	fold_file.file_frames = swap;
	delete fold.file_frames;
	// merge 2
	Object.assign(fold, frame);
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
			.filter((e) => Geom.intersection.point_on_edge(e.edge[0], e.edge[1], endPt))
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
			"clip":Geom.intersection.clip_line_in_poly(poly, linePoint, lineVector)
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
		  if (Geom.intersection.polygons_overlap(faces_points[idx1], faces_points[idx2])) {
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
	var matrix = Geom.core.make_matrix_reflection(lineVector, linePoint);

	var top_layer = faces_layer.slice(0, stay_layers);
	var bottom_layer = faces_layer.slice(stay_layers, stay_layers + faces_layer.length-stay_layers);
	bottom_layer.reverse();

	var boolArray = vertices_coords.map(() => false)

	for(var i = stay_layers; i < faces_vertices.length; i++){
		for(var f = 0; f < faces_vertices[i].length; f++){
			if(!boolArray[ faces_vertices[i][f] ]){
				var vert = vertices_coords[ faces_vertices[i][f] ];
				vertices_coords[ faces_vertices[i][f] ] = Geom.core.multiply_vector2_matrix2(vert, matrix);
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
			return Geom.intersection.point_in_polygon(points, point) ? fi : -1;
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
		.map(f => Geom.intersection.point_in_polygon(f, point))
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
	let inverseMatrices = faces_matrix.map(n => Geom.core.make_matrix2_inverse(n));

	let new_vertices_coords_cp = reflected.vertices_coords.map((point,i) =>
		Geom.core.multiply_vector2_matrix2(point, inverseMatrices[vertex_in_face[i]]).map((n) => 
			Geom.input.clean_number(n)
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
		.filter(f => Geom.intersection.point_in_polygon(f.face, point))
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
		Geom.core.multiply_vector2_matrix2(point, faces_matrix[vertex_in_face[i]]).map((n) => 
			Geom.input.clean_number(n)
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
// 			if( !equivalent2(intersections[0], intersections[i])){
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
			"clip":Geom.intersection.clip_line_in_poly(poly, linePoint, lineVector)
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

// function that adds a frame onto the fold file - 
// makes it a parent relationship to the keyframe,
// removes all edge mappings, rebuilds faces.
// @returns {number} new frame number (array index + 1)
// no
// returns {fold_frame} object
export function make_folded_frame(fold, parent_frame = 0, root_face){
	// todo, make it so parent_frame actually goes and gets data from that frame

	// remove_flat_creases(fold);
	// for every vertex, give me an index to a face which it's found in
	let vertex_in_face = fold.vertices_coords.map((v,i) => {
		for(var f = 0; f < fold.faces_vertices.length; f++){
			if(fold.faces_vertices[f].includes(i)){ return f; }
		}
	});
	let faces_matrix = Graph.make_faces_matrix(fold, root_face);
	// let inverseMatrices = faces_matrix.map(n => Geom.core.make_matrix2_inverse(n));
	let new_vertices_coords = fold.vertices_coords.map((point,i) =>
		Geom.core.multiply_vector2_matrix2(point, faces_matrix[vertex_in_face[i]])
			.map((n) => Geom.input.clean_number(n, 14))
	)
	return {
		"frame_classes": ["foldedState"],
		"frame_parent": parent_frame,
		"frame_inherit": true,
		"vertices_coords": new_vertices_coords,
		"re:faces_matrix": faces_matrix
	};
}


export function make_unfolded_frame(fold, parent_frame = 0, root_face){
	// todo, make it so parent_frame actually goes and gets data from that frame

	// remove_flat_creases(fold);
	// for every vertex, give me an index to a face which it's found in
	let vertex_in_face = fold.vertices_coords.map((v,i) => {
		for(var f = 0; f < fold.faces_vertices.length; f++){
			if(fold.faces_vertices[f].includes(i)){ return f; }
		}
	});
	let faces_matrix = Graph.make_faces_matrix(fold, root_face);
	// let inverseMatrices = faces_matrix.map(n => Geom.core.make_matrix2_inverse(n));
	let new_vertices_coords = fold.vertices_coords.map((point,i) =>
		Geom.core.multiply_vector2_matrix2(point, faces_matrix[vertex_in_face[i]])
			.map((n) => Geom.input.clean_number(n, 14))
	)
	return {
		"frame_classes": ["creasePattern"],
		"frame_parent": parent_frame,
		"frame_inherit": true,
		"vertices_coords": new_vertices_coords,
		"re:faces_matrix": faces_matrix
	};
}

export function crease_through_layers(fold_file, linePoint, lineVector){
	// console.log("+++++++++++++++++++");
	// let root_face = faces_containing_point(fold_file, linePoint).shift();
	let root_face = 0;
	// console.log("fold_file", fold_file);
	let fold = clone(fold_file);
	// console.log("faces 1", fold.faces_vertices);

	let folded_frame = make_folded_frame(fold, 1, root_face);
	// console.log("folded_frame", folded_frame);
	let folded = merge_frame(fold, folded_frame);
	// console.log("folded", folded);
	// console.log("folded", folded.faces_edges);
	// console.log("folded", folded);
	let creased = clip_edges_with_line(folded, linePoint, lineVector);
	let migration = creased["re:diff"]
	// console.log("migration", migration);

	//////////////////////////////////
	// wait, can we retain a mapping of the old faces_vertices to the old faces, then just transform using the old faces.
	let vertex_in_face = creased.vertices_coords.map((v,i) => {
		for(var f = 0; f < creased.faces_vertices.length; f++){
			if(creased.faces_vertices[f].includes(i)){ return f; }
		}
	});
	// console.log("migration.faces", migration.faces);
	let faces_matrix = creased["re:faces_matrix"];
	let new_vertices_coords = creased.vertices_coords.map((point,i) =>
		Geom.core.multiply_vector2_matrix2(point, Geom.core.make_matrix2_inverse(faces_matrix[migration.faces[vertex_in_face[i]]]))
			.map((n) => Geom.input.clean_number(n))
	)
	//////////////////////////////////
	// let unfolded_frame = make_unfolded_frame(creased, 0, root_face);
	// console.log("unfolded_frame", unfolded_frame);
	let unfolded = merge_frame(creased, {
		"frame_classes": ["creasePattern"],
		"frame_parent": 0,
		"frame_inherit": true,
		"vertices_coords": new_vertices_coords,
		"re:faces_matrix": faces_matrix
	});
	// console.log("unfolded", unfolded);

	// console.log("faces 2", unfolded.faces_vertices);

	delete unfolded.faces_edges;
	delete unfolded.faces_layer;
	delete unfolded.frame_inherit;
	delete unfolded.frame_parent;

	unfolded.file_frames = [ make_folded_frame(unfolded, 0, 1) ];

	return unfolded;
}


// i want my fold operation to be as simple (in code) as this
// - fold the faces
// - use the crease line to chop all faces (adding a mark line)
// - unfold all the faces.
// but to do this it won't work unless you unfold using the original
// mapping of faces and transformations, as there are now new faces


// let migration_object = {
// 	vertices_: [0, 1, 2, 5, 5, 3, 4, 6, 6],
// 	faces_: []
// }

// let migration_object = {
// 	vertices_: [false, false, false, false, false, true, true, true]
//  edges_: [0, 1, 2, null, 3, ]
// }

// edges change: remove edge 2 turns into 2 edges, appended to end
//  [a, b,  c,  d, e, f]        -- before
//  [a, b,  d,  e, f, g, h]     -- after (remove edge, 2, replcae with 2 new)
//  [0, 1,  3,  4, 5, 2, 2]     -- these is a changelog for the old array

// faces change: same as edge

/** clip a line in all the faces of a fold file. */
export function clip_edges_with_line(fold, linePoint, lineVector){
	// console.log("+++++++++++++++++++++++");
	let fold_new = fold;//clone(fold);
	let edge_map = {};
	fold.edges_vertices.forEach((ev,i) => {
		let key = ev.sort( (a,b) => a-b ).join(' ')
		edge_map[key] = i;
	});
	// console.log("edge_map", edge_map);

	// 1. find all edge-crossings and vertex-crossings
	let vertices_length = fold_new.vertices_coords.length;
	let vertices_intersections = fold_new.vertices_coords
		.map(v => Geom.intersection.point_on_line(linePoint, lineVector, v));
	let edges_intersections = fold_new.edges_vertices
		.map(ev => ev.map(v => fold_new.vertices_coords[v]))
		.map((edge, i) => {
			let intersection = Geom.intersection.line_edge_exclusive(linePoint, lineVector, edge[0], edge[1]);
			let new_index = (intersection == null ? vertices_length : vertices_length++);
			return {
				point: intersection,
				vertices: fold_new.edges_vertices[i], // shallow copy to fold file
				new_index: new_index
			};
		})

	// 2. first fold modification: add new vertices to vertex_ arrays
	let new_vertices = edges_intersections
		.filter(el => el.point != null)
		.map(el => el.point)

	// 
	let vertices_diff = fold_new.vertices_coords
		.map(v => false)
		.concat(new_vertices.map(v => true));
	// console.log("vertices_diff", vertices_diff);

	fold_new.vertices_coords = fold_new.vertices_coords
		.concat(new_vertices);

	// add new edges to edges_ arrays

	// rebuild edges
	// an edge is clipped, creating 2 edges sharing 1 new vertex
	// 
	// edges_replacement: edges_-indexed objects:
	//  { edges: (2) edges which replace this edge,
	//    vertices: (3) 1 and 2 relate to edge 1 and 2. 3 is the new one
	//  }

	let edges_replacement = edges_intersections
		.map((sect, i) => {
			if (sect.point == null) { return null; }
			let a = [fold_new.edges_vertices[i][0], sect.new_index];
			let b = [fold_new.edges_vertices[i][1], sect.new_index];
			return {
				edges: Graph.replace_edge(fold_new, i, a, b),
				vertices:[a[0], b[0], sect.new_index]
			};
		})

	// console.log("edges_replacement", edges_replacement);

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

	// console.log("fold_new.faces_edges", fold_new.faces_edges);

	// make sure faces edges is built
	// fold_new.faces_edges
	// faces_-indexed has a face been chopped? objects:
	// { edges: (0,1,2) of its edges were chopped,
	//   vertices: (0,1,2) of its vertices was crossed by an edge
	//  }
	// these "edges" objects are
	let faces_intersections = fold_new.faces_vertices.map((face_v, face_i) => {
		let verts = face_v
			.map(v => ({intersection: vertices_intersections[v], v: v}))
			.filter(el => el.intersection)
			.map(el => el.v)
		let edges = fold_new.faces_edges[face_i]
			.map(face_e => {
				let e = edges_replacement[face_e];
				if (e == null) { return undefined; }
				e.old_edge = face_e;
				return e;
			})
			.filter(el => el != null)
		return {vertices:verts, edges:edges};
	});

	// console.log("faces_intersections", faces_intersections);

	// we don't do anything with this until later
	let faces_to_modify = faces_intersections.map(el => {
		if(el.edges.length == 2){ return el; }
		if(el.vertices.length == 1 && el.edges.length == 1){ return el; }
		return undefined;
	});

	// console.log("faces_to_modify", faces_to_modify);

	// two_edges_faces: face-indexed, which 
	let two_edges_faces = faces_intersections.map(el => {
		if(el.edges.length == 2){ return el; }
		return undefined;
	}).map(el => el != null ? el.edges : undefined);
	let point_edge_faces = faces_intersections.map(el => {
		if(el.vertices.length == 1 && el.edges.length == 1){ return el; }
		return undefined;
	}).map(el => el != null ? el.vertices : undefined);

	// console.log("two_edges_faces", two_edges_faces);

	let new_edges_vertices = [];
	let faces_substitution = [];
	// console.log("-------- inside faces loop");
	two_edges_faces
		.map((edges,i) => ({edges:edges, i:i}))
		.filter(el => el.edges != null)
		.forEach(el => {
			let face_index = el.i;
			let chop_edges = el.edges
			let edge_keys = el.edges.map(e => ({
					key: e.vertices.slice(0, 2).sort((a,b) => a-b).join(' '), 
					new_v: e.vertices[2]
				})
			)
			let faces_edges_keys = fold_new.faces_vertices[face_index]
				.map((fv,i,arr) => [fv, arr[(i+1)%arr.length]])
				// .map((ev,i) => ({ev: ev.sort((a,b) => a-b).join(' '), i: i}))
				.map((ev,i) => ev.sort((a,b) => a-b).join(' '))
			// console.log("faces_edges_keys", faces_edges_keys);
			// faces_edges_keys.forEach(fkey => console.log(edge_map[fkey]));
			let found_indices = edge_keys
				.map(el => ({
					found: faces_edges_keys.indexOf(el.key),
					new_v: el.new_v
				})
			)
			let sorted_found_indices = found_indices.sort((a,b) => a.found-b.found);
			// console.log("sorted_found_indices", sorted_found_indices);
			// face a
			let face_a = fold_new.faces_vertices[face_index]
				.slice(sorted_found_indices[1].found+1);
			face_a = face_a.concat(fold_new.faces_vertices[face_index]
				.slice(0, sorted_found_indices[0].found+1)
			)
			face_a.push(sorted_found_indices[0].new_v);
			face_a.push(sorted_found_indices[1].new_v);
			// face b
			let face_b = fold_new.faces_vertices[face_index]
				.slice(sorted_found_indices[0].found+1, sorted_found_indices[1].found+1);
			face_b.push(sorted_found_indices[1].new_v);
			face_b.push(sorted_found_indices[0].new_v);
			// add things onto the graph
			new_edges_vertices.push([
				sorted_found_indices[0].new_v,
				sorted_found_indices[1].new_v
			]);
			faces_substitution[face_index] = [face_a, face_b];
			// faces_substitution.push(face_b);
		})

	// console.log("new_edges_vertices", new_edges_vertices);
	// console.log("faces_substitution", faces_substitution);

	// fold_new.edges_vertices = fold_new.edges_vertices.concat(new_edges_vertices);
	// fold_new.faces_vertices = fold_new.faces_vertices.concat(faces_substitution);

	new_edges_vertices.forEach(ev => Graph.add_edge(fold_new, ev, "F"));

	let new_faces_map = faces_substitution
		.map((faces,i) => ({faces:faces, i:i}))
		.filter(el => el.faces != null)
		.map(el => el.faces
			.map(face => ({
				old: el.i,
				new: Graph.replace_face(fold_new, el.i, face)
			})
		)).reduce((prev,curr) => prev.concat(curr));

	// clean components
	let vertices_to_remove = fold_new.vertices_coords
		.map((vc,i) => vc == null ? i : undefined)
		.filter(el => el != null);
	let edges_to_remove = fold_new.edges_vertices
		.map((ev,i) => ev == null ? i : undefined)
		.filter(el => el != null);
	// let faces_to_remove = faces_to_modify
	// 	.map((el,i) => (el != null) ? i : undefined)
	// 	.filter(el => el != null);
	let faces_to_remove = fold_new.faces_vertices
		.map((fv,i) => fv == null ? i : undefined)
		.filter(el => el != null);

	// console.log("new_faces_map", new_faces_map);
	// console.log("vertices_to_remove", vertices_to_remove);
	// console.log("edges_to_remove", edges_to_remove);
	// console.log("faces_to_remove", faces_to_remove);

//  [a, b,  c,  d, e, f]        -- before
//  [a, b,  d,  e, f, g, h]     -- after (remove edge, 2, replcae with 2 new)
//  [0, 1,  3,  4, 5, 2, 2]     -- these is a changelog for the old array

	let edges_diff = fold_new.edges_vertices.map((v,i) => i);
	edges_replacement.forEach((record, old_edge) => {
		if(record != null){
			record.edges.forEach(new_index =>
				edges_diff[new_index] = old_edge
			)
		}
	})

	let faces_diff = fold_new.faces_vertices.map((v,i) => i);
	new_faces_map.forEach(el => faces_diff[el.new] = el.old);
	// console.log("new_faces_map", new_faces_map);

	let vertices_removes = Graph.remove_vertices(fold_new, vertices_to_remove);
	let edges_removes = Graph.remove_edges(fold_new, edges_to_remove);
	let faces_removes = Graph.remove_faces(fold_new, faces_to_remove);

	// console.log("faces_diff before:", faces_diff.slice());

	vertices_diff = vertices_diff.filter((v,i) => !vertices_removes[i]);
	edges_diff = edges_diff.filter((e,i) => !edges_removes[i]);
	faces_diff = faces_diff.filter((e,i) => !faces_removes[i]);

	fold_new["re:diff"] = {
		vertices: vertices_diff,
		edges: edges_diff,
		faces: faces_diff
	};
	return fold_new
}

export function clip_line(fold, linePoint, lineVector){
	function len(a,b){
		return Math.sqrt(Math.pow(a[0]-b[0],2) + Math.pow(a[1]-b[1],2));
	}

	let edges = fold.edges_vertices
		.map(ev => ev.map(e => fold.vertices_coords[e]));

	return [lineVector, [-lineVector[0], -lineVector[1]]]
		.map(lv => edges
			.map(e => Geom.intersection.ray_edge(linePoint, lv, e[0], e[1]))
			.filter(i => i != null)
			.map(i => ({intersection:i, length:len(i, linePoint)}))
			.sort((a, b) => a.length - b.length)
			.map(el => el.intersection)
			.shift()
		).filter(p => p != null);
}

export function add_line(fold, linePoint, lineVector){

}

export function axiom1(fold, pointA, pointB){
	// chop faces
	// let line = Geom.axiom1(pointA, pointB);
	let f = clone(fold);
	f.vertices_coords.push(pointA);
	f.vertices_coords.push(pointB);
	f.edges_vertices.push([
		f.vertices_coords.length-2,
		f.vertices_coords.length-1
	]);
	f.edges_assignment.push("F");
	return f;
}

export function axiom1_force(fold, pointA, pointB){
	let f = clone(fold);
	f.vertices_coords.push(pointA);
	f.vertices_coords.push(pointB);
	f.edges_vertices.push([
		f.vertices_coords.length-2,
		f.vertices_coords.length-1
	]);
	f.edges_assignment.push("F");
	return f;
}


export function axiom2(fold, pointA, pointB){
	return Geom.core.axiom2(pointA, pointB);
}

export function is_boundary_closed(fold){

}


export function remove_boundary(fold){
	
}


// export function apply_diff(graph, diff){
// 	if(diff.vertices != null){
// 		if(diff.vertices.new != null){
// 			graph.vertices_coords = graph.vertices_coords.concat(diff.vertices.new);
// 		}
// 	}
// 	if(diff.edges != null){
// 		if(diff.edges.replace != null){
// 			diff.edges.replace.forEach(el => {
// 				Graph.replace_edge(graph, el.old_index, el.new)
// 				// Graph.remove_edges(graph, [el.old_index]);
// 			});
// 		}
// 		// let remove = diff.edges.replace.map(el => el.old_index);
// 		// Graph.remove_edges(graph, remove);
// 		if(diff.edges.new != null){
// 			diff.edges.new.forEach(edge => Graph.add_edge(graph, edge, "V"));
// 		}
// 	}
// 	if(diff.faces != null){
// 		if(diff.faces.replace != null){
// 			diff.faces.replace.forEach(el => {
// 				Graph.replace_face(graph, el.old_index, el.new);
// 				// Graph.remove_faces(graph, [el.old_index]);
// 			});
// 		}
// 		// let remove = diff.faces.replace.map(el => el.old_index);
// 		// Graph.remove_faces(graph, remove);
// 	}
// }




export function apply_diff(graph, diff){
	if(diff.vertices != null){
		if(diff.vertices.new != null){
			graph.vertices_coords = graph.vertices_coords.concat(diff.vertices.new);
		}
	}
	if(diff.edges != null){
		if(diff.edges.replace != null){
			diff.edges.replace.forEach(el => {
				graph.edges_vertices = graph.edges_vertices.concat(el.new);
				let new_assignments = el.new.map(n => graph.edges_assignment[el.old_index]);
				graph.edges_assignment = graph.edges_assignment.concat(new_assignments);
			});
		}
		if(diff.edges.new != null){
			graph.edges_vertices = graph.edges_vertices.concat(diff.edges.new);
			graph.edges_assignment = graph.edges_assignment.concat(diff.edges.new.map(_ => "V"));
		}
	}
	if(diff.faces != null){
		if(diff.faces.replace != null){
			diff.faces.replace.forEach(el => 
				graph.faces_vertices = graph.faces_vertices.concat(el.new)
			);
		}
	}
}

