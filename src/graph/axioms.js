// import {
// 	axiom1 as fnAxiom1,
// 	axiom2 as fnAxiom2,
// 	axiom3 as fnAxiom3,
// 	axiom4 as fnAxiom4,
// 	axiom5 as fnAxiom5,
// 	axiom6 as fnAxiom6,
// 	axiom7 as fnAxiom7,
// } from "../axioms/axiomsVecLine.js";
// import { pointsToLine } from "../math/convert.js";
// /**
//  *
//  */
// const edgeToLine = ({ vertices_coords, edges_vertices }, edge) => (
// 	pointsToLine(...edges_vertices[edge].map(v => vertices_coords[v]))
// );
// /**
//  *
//  */
// /**
//  * @description origami axiom 1: form a line that passes between the given points
//  * @param {FOLD} graph a FOLD graph
//  * @param {number} vertexA the index of the first vertex
//  * @param {number} vertexB the index of the second vertex
//  * @returns {[VecLine]} an array of one solution line in {vector, origin} form
//  * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 45
//  */
// export const axiom1 = ({ vertices_coords }, vertexA, vertexB) => (
// 	fnAxiom1(vertices_coords[vertexA], vertices_coords[vertexB])
// );
// /**
//  * @description origami axiom 2: form a perpendicular bisector between the given points
//  * @param {FOLD} graph a FOLD graph
//  * @param {number} vertexA the index of the first vertex
//  * @param {number} vertexB the index of the second vertex
//  * @returns {[VecLine]} an array of one solution line in {vector, origin} form
//  * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 56
//  */
// export const axiom2 = ({ vertices_coords }, vertexA, vertexB) => (
// 	fnAxiom2(vertices_coords[vertexA], vertices_coords[vertexB])
// );
// // todo: make sure these all get a resizeUp or whatever is necessary
// /**
//  * @description origami axiom 3: form two lines that make the two angular bisectors between
//  * two input lines, and in the case of parallel inputs only one solution will be given
//  * @param {FOLD} graph a FOLD graph
//  * @param {number} edgeA the index of the first edge
//  * @param {number} edgeB the index of the second edge
//  * @returns {[VecLine?, VecLine?]} an array of lines in {vector, origin} form
//  * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 71
//  */
// export const axiom3 = ({ vertices_coords, edges_vertices }, edgeA, edgeB) => (
// 	fnAxiom3(...[edgeA, edgeB]
// 		.map(e => edgeToLine({ vertices_coords, edges_vertices }, e)))
// );
// /**
//  * @description origami axiom 4: form a line perpendicular to a given line that
//  * passes through a point.
//  * @param {FOLD} graph a FOLD graph
//  * @param {number} edge the index of the edge
//  * @param {number} vertex the index of the vertex
//  * @returns {[VecLine]} the line in {vector, origin} form
//  * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 80
//  */
// export const axiom4 = ({ vertices_coords, edges_vertices }, edge, vertex) => (
// 	fnAxiom4(
// 		edgeToLine({ vertices_coords, edges_vertices }, edge),
// 		vertices_coords[vertex],
// 	)
// );
// /**
//  * @description origami axiom 5: form up to two lines that pass through a point that also
//  * brings another point onto a given line
//  * @param {FOLD} graph a FOLD graph
//  * @param {number} edge the index of the edge
//  * @param {number} vertexA the index of the first vertex
//  * @param {number} vertexB the index of the second vertex
//  * @returns {[VecLine, VecLine?]} an array of lines in {vector, origin} form
//  * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 93
//  */
// export const axiom5 = ({ vertices_coords, edges_vertices }, edge, vertexA, vertexB) => (
// 	fnAxiom5(
// 		edgeToLine({ vertices_coords, edges_vertices }, edge),
// 		vertices_coords[vertexA],
// 		vertices_coords[vertexB],
// 	)
// );
// /**
//  * @description origami axiom 6: form up to three lines that are made by bringing
//  * a point to a line and a second point to a second line.
//  * @param {FOLD} graph a FOLD graph
//  * @param {number} edgeA the index of the first edge
//  * @param {number} edgeB the index of the second edge
//  * @param {number} vertexA the index of the first vertex
//  * @param {number} vertexB the index of the second vertex
//  * @returns {[VecLine?, VecLine?, VecLine?]} an array of lines in {vector, origin} form
//  * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 113
//  */
// export const axiom6 = ({ vertices_coords, edges_vertices }, edgeA, edgeB, vertexA, vertexB) => (
// 	fnAxiom6(
// 		edgeToLine({ vertices_coords, edges_vertices }, edgeA),
// 		edgeToLine({ vertices_coords, edges_vertices }, edgeB),
// 		vertices_coords[vertexA],
// 		vertices_coords[vertexB],
// 	)
// );
// // .map(Constructors.line);
// /**
//  * @description origami axiom 7: form a line by bringing a point onto a given line
//  * while being perpendicular to another given line.
//  * @param {FOLD} graph a FOLD graph
//  * @param {number} edgeA the index of the first edge
//  * @param {number} edgeB the index of the second edge
//  * @param {number} vertex the index of the vertex
//  * @returns {[VecLine?]} the line in {vector, origin} form
//  * or undefined if the given lines are parallel
//  * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 132
//  */
// export const axiom7 = ({ vertices_coords, edges_vertices }, edgeA, edgeB, vertex) => (
// 	fnAxiom7(
// 		edgeToLine({ vertices_coords, edges_vertices }, edgeA),
// 		edgeToLine({ vertices_coords, edges_vertices }, edgeB),
// 		vertices_coords[vertex],
// 	)
// );
// /**
//  * @description Perform one of the seven origami axioms
//  * @param {number} number the axiom number, 1-7
//  * @param {number[] | VecLine} ...args the axiom input parameters
//  * @returns {VecLine[]} an array of solution lines in {vector, origin} form
//  * @linkcode Origami ./src/axioms/validate.js 234
//  */
// export const axiom = (number, ...args) => [
// 	null, axiom1, axiom2, axiom3, axiom4, axiom5, axiom6, axiom7,
// ][number](...args);
