export const clone = function(o) {
	// from https://jsperf.com/deep-copy-vs-json-stringify-json-parse/5
	var newO, i;
	if (typeof o !== 'object') {
		return o;
	}
	if (!o) {
		return o;
	}
	if ('[object Array]' === Object.prototype.toString.apply(o)) {
		newO = [];
		for (i = 0; i < o.length; i += 1) {
			newO[i] = clone(o[i]);
		}
		return newO;
	}
	newO = {};
	for (i in o) {
		if (o.hasOwnProperty(i)) {
			newO[i] = clone(o[i]);
		}
	}
	return newO;
} 

export const recursive_freeze = function(input) {
	Object.freeze(input);
		if (input === undefined) {
		return input;
	}
	Object.getOwnPropertyNames(input).filter(prop =>
		input[prop] !== null
		&& (typeof input[prop] === "object" || typeof input[prop] === "function")
		&& !Object.isFrozen(input[prop])
	).forEach(prop => recursive_freeze(input[prop]));
	return input;
}

export const append_frame = function(fold_file) {

}

export const flatten_frame = function(fold_file, frame_num){
	const dontCopy = ["frame_parent", "frame_inherit"];
	var memo = {visited_frames:[]};
	function recurse(fold_file, frame, orderArray) {
		if (memo.visited_frames.indexOf(frame) !== -1) {
			throw "FOLD file_frames encountered a cycle. stopping.";
			return orderArray;
		}
		memo.visited_frames.push(frame);
		orderArray = [frame].concat(orderArray);
		if (frame === 0) { return orderArray; }
		if (fold_file.file_frames[frame - 1].frame_inherit &&
		   fold_file.file_frames[frame - 1].frame_parent != null) {
			return recurse(fold_file, fold_file.file_frames[frame - 1].frame_parent, orderArray);
		}
		return orderArray;
	}
	return recurse(fold_file, frame_num, []).map(frame => {
		if (frame === 0) {
			// for frame 0 (the key frame) don't copy over file_frames array
			let swap = fold_file.file_frames;
			fold_file.file_frames = null;
			let copy = JSON.parse(JSON.stringify(fold_file));
			fold_file.file_frames = swap;
			delete copy.file_frames;
			dontCopy.forEach(key => delete copy[key]);
			return copy;
		}
		let copy = JSON.parse(JSON.stringify(fold_file.file_frames[frame-1]))
		dontCopy.forEach(key => delete copy[key]);
		return copy;
	}).reduce((prev,curr) => Object.assign(prev,curr),{})
};

export const merge_frame = function(fold_file, frame){
	const dontCopy = ["frame_parent", "frame_inherit"];
	let copy = JSON.parse(JSON.stringify(frame));
	dontCopy.forEach(key => delete copy[key]);
	// don't deep copy file_frames. stash. bring them back.
	let swap = fold_file.file_frames;
	fold_file.file_frames = null;
	let fold = JSON.parse(JSON.stringify(fold_file));
	fold_file.file_frames = swap;
	delete fold.file_frames;
	// merge 2
	Object.assign(fold, frame);
	return fold;
};
