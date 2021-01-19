const ear = require("../rabbit-ear");

// these test parameter input handling
// more axiom tests in math.axiom.test.js
test("axiom params", () => {
  ear.axiom(1, { points: [ [0.75, 0.75], [0.15, 0.85] ] });
  ear.axiom(2, { points: [ [0.75, 0.75], [0.15, 0.85] ] });
  ear.axiom(3, { lines: [
    { vector: [0.0, -0.5], origin: [0.25, 0.75] },
    { vector: [0.5, 0.0], origin: [0.5, 0.75] },
  ]});
  ear.axiom(4, {
    points: [ [0.83, 0.51] ],
    lines: [{ vector: [-0.10, 0.11], origin: [0.62, 0.37] }]
  });
  ear.axiom(5, {
    points: [ [0.75, 0.75], [0.15, 0.85] ],
    lines: [{ vector: [-0.37, -0.13], origin: [0.49, 0.71] }]
  });
  ear.axiom(6, {
    points: [ [0.75, 0.75], [0.15, 0.85] ],
    lines: [
      { vector: [0.04, -0.52], origin: [0.43, 0.81] },
      { vector: [0.05, -0.28], origin: [0.10, 0.52] },
    ]
  });
  ear.axiom(7, {
    points: [ [0.25, 0.85] ],
    lines: [
      { vector: [-0.20, -0.25], origin: [0.62, 0.93] },
      { vector: [-0.42, 0.61], origin: [0.52, 0.25] },
    ]
  });
});


