/**
 * Rabbit Ear (c) Kraft
 */
// import * as S from "../general/strings";
/**
 * @description given a FOLD object, gather all the class names and return
 * them in a single array
 * @param {object} FOLD graph
 * @returns {string[]} an array of class names
 */
// const foldClasses = graph => [
// 	(graph[S._file_classes] ? graph[S._file_classes] : []),
// 	(graph[S._frame_classes] ? graph[S._frame_classes] : []),
// ].reduce((a, b) => a.concat(b));

// export default foldClasses;

export const addClassToClassList = (el, ...classes) => {
	if (!el) { return; }
	const classArray = (el.getAttribute("class") || "")
		.split(" ");
	classArray.push(...classes);
	el.setAttribute("class", classArray
		.filter(a => a !== undefined)
		.join(" "));
};
