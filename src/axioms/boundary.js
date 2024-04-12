// /**
//  * Rabbit Ear (c) Kraft
//  */
// import {
// 	axiom,
// 	normalAxiom,
// } from "./axioms.js";
// import {
// 	validateAxiom,
// } from "./validate.js";
// import {
// 	uniqueLineToVecLine,
// } from "../math/convert.js";

// const paramsToUniqueLine = (args) => args
// 	.map(arg => (typeof arg === "object" && arg.vector
// 		? uniqueLineToVecLine(arg)
// 		: arg));

// /**
//  * @description Perform one of the seven origami axioms, and provide
//  * a boundary so that only the results possible inside the boundary
//  * will be returned.
//  * @param {number} number the axiom number, 1-7. **note, 0 is not an option**
//  * @param {number[][]} boundary the polygon outline of the folding material
//  * @param {...any[][]} args the input parameters to the axiom number, points or lines
//  * @returns {VecLine[]} an array of solutions as lines, or an empty array if no solutions.
//  */
// export const axiomWithBoundary = (number, boundary, ...args) => {
// 	const solutions = axiom(number, ...args);
// 	validateAxiom(number, boundary, solutions, ...args)
// 		.map((valid, i) => (!valid ? i : undefined))
// 		.filter(a => a !== undefined)
// 		.forEach(i => delete solutions[i]);
// 	return solutions;
// };

// /**
//  * @description Perform one of the seven origami axioms, and provide a boundary so that
//  * only the results possible inside the boundary will be returned.
//  * @param {number} number the axiom number, 1-7. **note, 0 is not an option**
//  * @param {number[][]} boundary the bounding polygon representing the folding material
//  * @param {...any[][]} args the input parameters to the axiom number, points or lines
//  * @returns {UniqueLine[]} an array of solutions as lines, or an empty array if no solutions.
//  */
// export const normalAxiomWithBoundary = (number, boundary, ...args) => {
// 	const solutions = normalAxiom(number, ...args).map(uniqueLineToVecLine);
// 	validateAxiom(number, boundary, solutions, ...paramsToUniqueLine(args))
// 		.map((valid, i) => (!valid ? i : undefined))
// 		.filter(a => a !== undefined)
// 		.forEach(i => delete solutions[i]);
// 	return solutions;
// };
