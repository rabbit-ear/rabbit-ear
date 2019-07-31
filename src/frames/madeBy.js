
// build a re:construction frame
const axiom1 = function (pointA, pointB) {
  return {
    axiom: 1,
    parameters: {
      points: [pointA, pointB]
    },
    solutions: [
      [[0.5, 0.625], [0.6, -0.8]],
      [[0.25, 0.25], [0.4, -1.0]],
      [[0.15, 0.5], [0.2, -0.8]]
    ]
  };
};

const madeBy = function (fold_file) {
  const made = {};
  made.axiom1 = axiom1;
  return made;
};

export default madeBy;
