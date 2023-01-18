/**
 * Rabbit Ear (c) Kraft
 */
import clone from "../general/clone";
import * as S from "../general/strings";
import { filterKeysWithPrefix } from "../fold/spec";

/**
 * @description todo
 * @param {FOLD} graph a FOLD graph
 * @param {number} frame which frame number to expose as the sole contents
 * @returns {FOLD} the requested frame separated out from the rest of
 * the graph, inheriting any necessary data if needed.
 */
export const flattenFrame = (graph, frame_num = 1) => {
	if (!graph.file_frames || graph.file_frames.length < frame_num) {
		return graph;
	}
	const dontCopy = [S._frame_parent, S._frame_inherit];
	const memo = { visited_frames: [] };
	const fileMetadata = {};
	filterKeysWithPrefix(graph, "file_")
		.filter(key => key !== "file_frames")
		.forEach(key => { fileMetadata[key] = graph[key]; });

	const recurse = (recurse_graph, frame, orderArray) => {
		if (memo.visited_frames.indexOf(frame) !== -1) {
			throw new Error("flatten cycle detected");
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

export const mergeFrame = function (graph, frame) {
	const dontCopy = [S._frame_parent, S._frame_inherit];
	const copy = clone(frame);
	dontCopy.forEach(key => delete copy[key]);
	// don't deep copy file_frames. stash. bring them back.
	const swap = graph.file_frames;
	graph.file_frames = null;
	const fold = clone(graph);
	graph.file_frames = swap;
	delete fold.file_frames;
	// merge 2
	Object.assign(fold, frame);
	return fold;
};
