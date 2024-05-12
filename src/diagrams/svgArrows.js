// /**
//  * Rabbit Ear (c) Kraft
//  */
// import {
// 	foldLineArrow,
// 	axiom1Arrows,
// 	axiom2Arrows,
// 	axiom3Arrows,
// 	axiom4Arrows,
// 	axiom5Arrows,
// 	axiom6Arrows,
// 	axiom7Arrows,
// } from "./arrows.js";
// // import Constructor from "../svg/constructor/index.js";
// import SVG from "../svg/index.js";

// /**
//  * @param {{
//  *   segment: [[number, number], [number, number]],
//  *   head: {
//  *     width: number,
//  *     height: number,
//  *   },
//  *   bend: number,
//  *   padding: number,
//  * }} arrow
//  * @returns {SVGElement}
//  */
// const drawSVGArrow = (arrow) => {
// 	return SVG.arrow(arrow)
// };

// /**
//  *
//  */
// export const axiom1SVGArrows = ({ vertices_coords }, point1, point2, options) => (
// 	axiom1Arrows({ vertices_coords }, point1, point2, options)
// 		.map(drawSVGArrow)
// );
