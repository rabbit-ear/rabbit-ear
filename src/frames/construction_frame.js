
/*

an axiom frame is signified by the key "re:axiom" and contains:
- "number", the axiom number,
- "marks", optional, array of arrays specifying points

this is a definition frame:

"re:axiom"
{
  number: 6,
  parameters: {
    marks: [
      [0.97319, 0.05149],
      [0.93478, 0.93204]
    ],
    lines: [
      [[0.36585, 0.01538], [0.707, 0.707]],
      [[0.16846, 0.64646], [1, 0]]
    ]
  }
}

this is a solution frame. same as definition but includes a "solution"

"re:axiom"
{
  number: 2,
  parameters: {
    marks: [[0, 0.25], [1, 1]]
  },
  solutions: [{
    line: [[0.5, 0.625], [0.6, -0.8]]
  }]
}

*/

export const axiom_operation = function(axiomNumber, marks, lines) {

};

export const fold_operation = function(isValley, ) {

};

/**
 *  generate a graph["re:construction"] section
 */
export const construction_frame = function(type, parameters) {
  return {
    "re:construction_type": type,
    "re:construction_parameters": parameters
  };
  // Object.keys(parameters)
  //  .filter(key => key !== type)
  //  .forEach(key => o["re:construction_parameters"][key] = parameters[key]);
  // return o;
};

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
