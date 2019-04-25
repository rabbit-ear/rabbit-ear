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

/**
 * this asynchronously or synchronously loads data from "input",
 * if necessary, converts into the FOLD format,
 * and calls "callback(fold)" with the data as the first argument.
 *
 * valid "input" arguments are:
 * - filenames ("pattern.svg")
 * - raw blob contents of a preloaded file (.fold, .oripa, .svg)
 * - SVG DOM objects (<svg> SVGElement)
 */

export const load_file = function(input, callback) {
	let type = typeof input;
	if (type === "object") {
		try {
			let fold = JSON.parse(JSON.stringify(input));
			// todo different way of checking fold format validity
			if (fold.vertices_coords == null) {
				throw "tried FOLD format, got empty object";
			}
			if (callback != null) {
				callback(fold);
			}
			return fold; // asynchronous loading was not required
		} catch(err) {
			if (input instanceof Element){
				let fold = svg_to_fold(input);
				if (callback != null) {
					callback(fold);
				}
				return fold; // asynchronous loading was not required
			} else {
				// console.warn("could not load file, object is either not valid FOLD or corrupt JSON.", err);
			}
		} 
		// finally {
		// 	return;  // currently not used. everything previous is already returning
		// }
	}
	// are they giving us a filename, or the data of an already loaded file?
	if (type === "string" || input instanceof String) {
		// try a FOLD format string
		try {
			// try .fold file format first
			let fold = JSON.parse(input);
			if (callback != null) { callback(fold); }
		} catch(err) {
			let extension = input.substr((input.lastIndexOf('.') + 1));
			// filename. we need to upload
			switch(extension) {
				case "fold":
					fetch(input)
						.then((response) => response.json())
						.then((data) => {
							if (callback != null) { callback(data); }
						});
				break;
				case "svg":
					SVG.load(input, function(svg) {
						let fold = svg_to_fold(svg);
						if (callback != null) { callback(fold); }
					});
				break;
				case "oripa":
					// ORIPA.load(input, function(fold) {
					// 	if (callback != null) { callback(fold); }
					// });
				break;
			}
		}
	}
}