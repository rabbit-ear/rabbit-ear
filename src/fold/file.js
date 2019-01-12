
export const validate = function(graph) {

	let foldKeys = {
		"vertices": ["coords", "vertices", "faces"],
		"edges": ["vertices", "faces", "assignment", "foldAngle", "length"],
		"faces": ["vertices", "edges"],
	};

	let arraysLengthTest = Object.keys(foldKeys)
		.map(key => ({prefix: key, suffixes: foldKeys[key]}))
		.map(el => el.suffixes
			.map(suffix => el.prefix + "_" + suffix)
			.filter(key => graph[key] != null)
			.map((key,_,arr) => graph[key].length === graph[arr[0]].length)
			.reduce((a,b) => a && b, true)
		).reduce((a,b) => a && b, true);

	let l = {
		vertices: Graph.get_vertex_count(graph),
		edges: Graph.get_edge_count(graph),
		faces: Graph.get_face_count(graph)
	}

	let arraysIndexTest = Object.keys(foldKeys)
		.map(key => ({prefix: key, suffixes: foldKeys[key]}))
		.map(el => el.suffixes
			.map(suffix => ({key:el.prefix + "_" + suffix, suffix: suffix}))
			.filter(ell => graph[ell.key] != null && l[ell.suffix] != null)
			.map(ell => graph[ell.key]
				.reduce((prev,curr) => curr
					.reduce((a,b) => a && (b < l[ell.suffix]), true)
				, true)
			).reduce((a,b) => a && b, true)
		).reduce((a,b) => a && b, true);

	return arraysLengthTest && arraysIndexTest;
}


/** deep clone an object */
export const clone = function(thing){
	// types to check:, "undefined" / "null", "boolean", "number", "string", "symbol", "function", "object"
	return JSON.parse(JSON.stringify(thing));  // might be a faster way
	// recurse over each entry. todo
	// if(thing == null || typeof thing == "boolean" || typeof thing ==  "number" ||
	//    typeof thing ==  "string" || typeof thing ==  "symbol"){ return thing; }
	// var copy = (thing.constructor === Array) ? thing.slice() : Object.assign({},thing);
	// Object.entries(copy)
	// 	.filter(([k,v]) => typeof v == "object" || typeof v == "symbol" || typeof v == "function")
	// 	.forEach(([k,v]) => copy[k] = clone(copy[k]) )
	// return copy;
};

export const flattenFrame = function(fold_file, frame_num){
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


export const merge_frame = function(fold_file, frame){
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
