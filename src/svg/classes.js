/**
 * Rabbit Ear (c) Robby Kraft
 */
import * as S from "../symbols/strings";
/**
 * @description given a FOLD object, gather all the class names and return
 * them in a single array
 * @param {object} FOLD graph
 * @returns {string[]} an array of class names
 */
const fold_classes = graph => [
	(graph[S.file_classes] ? graph[S.file_classes] : []),
	(graph[S.frame_classes] ? graph[S.frame_classes] : []),
].reduce((a, b) => a.concat(b));

export default fold_classes;
