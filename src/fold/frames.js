/**
 * Rabbit Ear (c) Kraft
 */
import { filterKeysWithPrefix } from "./spec.js";
import clone from "../general/clone.js";
import Messages from "../environment/messages.js";
/**
 * @description Get the number of file frames in a FOLD object.
 * The top level is the first frame, then every entry inside of
 * "file_frames" increments the count by 1.
 * @param {FOLD} graph a FOLD graph.
 * @returns {number} the number of frames in the FOLD object.
 */
export const countFrames = (graph) => (!graph.file_frames
	? 1
	: graph.file_frames.length + 1);
/**
 * @description Frames can be children of other frames via. the
 * frame_parent and frame_inherit properties. This method will render
 * a frame into its intended state by collapsing all parents and then
 * this frame itself into a single object.
 * @param {FOLD} graph a FOLD graph
 * @param {number} frame which frame number to expose as the sole contents
 * @returns {FOLD} the requested frame separated out from the rest of
 * the graph, inheriting any necessary data if needed.
 */
export const flattenFrame = (graph, frame_num = 1) => {
	if (!graph.file_frames || graph.file_frames.length < frame_num) {
		return graph;
	}
	const dontCopy = ["frame_parent", "frame_inherit"];
	const memo = { visited_frames: [] };
	const fileMetadata = {};
	filterKeysWithPrefix(graph, "file")
		.filter(key => key !== "file_frames")
		.forEach(key => { fileMetadata[key] = graph[key]; });

	const recurse = (recurse_graph, frame, orderArray) => {
		if (memo.visited_frames.indexOf(frame) !== -1) {
			throw new Error(Messages.graphCycle);
		}
		memo.visited_frames.push(frame);
		orderArray = [frame].concat(orderArray);
		if (frame === 0) { return orderArray; }
		if (recurse_graph.file_frames[frame - 1].frame_inherit
			&& recurse_graph.file_frames[frame - 1].frame_parent != null) {
			return recurse(
				recurse_graph,
				recurse_graph.file_frames[frame - 1].frame_parent,
				orderArray,
			);
		}
		return orderArray;
	};

	return recurse(graph, frame_num, []).map((frame) => {
		if (frame === 0) {
			// for frame 0 (the key frame) don't copy over file_frames array
			const swap = graph.file_frames;
			graph.file_frames = null;
			const copy = clone(graph);
			graph.file_frames = swap;
			delete copy.file_frames;
			dontCopy.forEach(key => delete copy[key]);
			return copy;
		}
		const outerCopy = clone(graph.file_frames[frame - 1]);
		dontCopy.forEach(key => delete outerCopy[key]);
		return outerCopy;
	}).reduce((a, b) => Object.assign(a, b), fileMetadata);
};
// export const mergeFrame = function (graph, frame) {
// 	const dontCopy = ["frame_parent", "frame_inherit"];
// 	const copy = clone(frame);
// 	dontCopy.forEach(key => delete copy[key]);
// 	// don't deep copy file_frames. stash. bring them back.
// 	const swap = graph.file_frames;
// 	graph.file_frames = null;
// 	const fold = clone(graph);
// 	graph.file_frames = swap;
// 	delete fold.file_frames;
// 	// merge 2
// 	Object.assign(fold, frame);
// 	return fold;
// };
/**
 * @description Get a shallow copy of the top level frame without "file_frames"
 */
const getTopLevelFrame = (graph) => {
	const copy = { ...graph };
	delete copy.file_frames;
	return copy;
};
/**
 * @description Get a flat array of all file_frames, where the top-level
 * is index 0, and the file_frames follow in sequence.
 * This does not perform any frame-collapsing if a frame inherits from
 * a parent, the frames are maintained in their original form.
 * The objects in the result are a shallow copy so they still hold
 * references to the original FOLD object provided in the input.
 * @param {FOLD} graph a FOLD object
 * @returns {FOLD[]} an array of FOLD objects, single frames in a flat array.
 */
export const getFramesAsFlatArray = (graph) => {
	if (!graph.file_frames || !graph.file_frames.length) {
		return [graph];
	}
	return [
		getTopLevelFrame(graph),
		...graph.file_frames,
	];
};
/**
 * @description Get all frames inside a FOLD object which contain a
 * frame_classes class matching the provided className string
 * @param {FOLD} graph a FOLD object
 * @param {string} className the name of the class inside frame_classes
 * @returns {FOLD[]} an array of FOLD object frames.
 */
export const getFramesByClassName = (graph, className) => Array
	.from(Array(countFrames(graph)))
	.map((_, i) => flattenFrame(graph, i))
	.filter(frame => frame.frame_classes
		&& frame.frame_classes.includes(className));
