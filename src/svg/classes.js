/**
 * Rabbit Ear (c) Kraft
 */
import * as S from "../general/strings";
/**
 * @description given a FOLD object, gather all the class names and return
 * them in a single array
 * @param {object} FOLD graph
 * @returns {string[]} an array of class names
 */
const fold_classes = graph => [
	(graph[S._file_classes] ? graph[S._file_classes] : []),
	(graph[S._frame_classes] ? graph[S._frame_classes] : []),
].reduce((a, b) => a.concat(b));

export default fold_classes;
