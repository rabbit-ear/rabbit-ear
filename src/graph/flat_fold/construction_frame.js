/**
 * Rabbit Ear (c) Robby Kraft
 */

/**
construction frame is what you pass into a fold or crease operation.
origami.cp.fold( {construction_frame} );
this makes it consistent when describing WHAT it is you're doing.
*/
export const line_construction = (point, vector) => ({
  line: [point, vector]
});

export const line_segment_construction = (point, vector) => ({
  edge: [
    point,
    point.map((p, i) => point[i] + vector[i])
  ]});

export const construction_flip = direction_vector => ({
  type: "flip",
  direction: direction_vector
});

export const fold_operation = (isValley, ) => { };

/**
 * "re:construction".type examples: "flip", "fold", "squash", "sink", "pleat"...
 *
 * "re:construction" : {
 *   type: "fold",
 *   assignment: "M" / "V" / "F"
 *   direction: fold_direction_vector
 *   axiom: 6,
 *   parameters: {
 *     points: [
 *       [0.97319, 0.05149],
 *       [0.93478, 0.93204]
 *     ],
 *     lines: [
 *       [[0.36585, 0.01538], [0.707, 0.707]],
 *       [[0.16846, 0.64646], [1, 0]]
 *     ]
 *   }
 *  }
 * }
 *
 * "re:construction": {
 *   type: "fold",
 *   assignment: "M" / "V" / "F"
 *   direction: fold_direction_vector
 * }
 */

// export const construction_fold = function (assignment, direction_vector, ) {
//   return {
//     type: "fold",
//     parameters: parameters
//   };
// };

/**
 *  generate a graph["re:construction"] section
 */
// export const construction_frame = function (type, parameters) {
//   return {
//     "re:construction_type": type,
//     "re:construction_parameters": parameters
//   };
//   // Object.keys(parameters)
//   //  .filter(key => key !== type)
//   //  .forEach(key => o["re:construction_parameters"][key] = parameters[key]);
//   // return o;
// };

/*

"re:construction" example

{
  axiom: 2,
  type: "valley",
  direction: [0.0435722, -0.999050],
  edge: [[0, 0.45016], [1, 0.49377]],
  parameters: { marks: [[0.97319, 0.05149], [0.93478, 0.93204]] }
}


"re:axiom"
{
  number: 2,
  parameters: { marks: [[0.97319, 0.05149], [0.93478, 0.93204]] }
}

*/
