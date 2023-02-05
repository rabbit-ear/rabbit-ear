/**
 * Rabbit Ear (c) Kraft
 */
// import * as S from "../general/strings.js";
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
	const hash = {};
	const getClass = el.getAttribute("class");
	const classArray = getClass ? getClass.split(" ") : [];
	classArray.push(...classes);
	classArray.forEach(str => { hash[str] = true; });
	const classString = Object.keys(hash).join(" ");
	el.setAttribute("class", classString);
};
