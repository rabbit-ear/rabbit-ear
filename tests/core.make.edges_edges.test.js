const ear = require("../rabbit-ear.js");

// test("make edges_edges 1", () => {
//   const result = ear.core.make_edges_edges({
//     edges_vertices: [[0, 1], [1,2], [2,3], [3,0]] 
//   });
//   expect(result[0]).toEqual(expect.arrayContaining([0, 3]));
//   expect(result[1]).toEqual(expect.arrayContaining([0, 1]));
//   expect(result[2]).toEqual(expect.arrayContaining([1, 2]));
//   expect(result[3]).toEqual(expect.arrayContaining([2, 3]));
// });

// test("make edges_edges, invalid faces", () => {
//   const res1 = ear.core.make_edges_edges({
//     edges_vertices: [[undefined], [undefined]]
//   });
//   expect(res1[0]).toEqual(expect.arrayContaining([1]));
//   expect(res1[1]).toEqual(expect.arrayContaining([0]));
//   // lol. look, it will match anything including strings
//   const res2 = ear.core.make_edges_edges({ edges_vertices: [["hi"], ["hi"]] });
//   expect(res2[0]).toEqual(expect.arrayContaining([1]));
//   expect(res2[1]).toEqual(expect.arrayContaining([0]));
//   const res3 = ear.core.make_edges_edges({ edges_vertices: [["hi"], ["bye"]] });
//   expect(res3[0].length).toBe(0);
//   expect(res3[1].length).toBe(0);
// });

// test("make edges_edges 3", () => {
//   // technically these edges are invalid
//   const result = ear.core.make_edges_edges({
//     edges_vertices: [[0, 1, 2, 3, 4], [5, 6]] 
//   });
//   [[0], [0], [0], [0], [0], [1], [1]].forEach((arr, i) => {
//     expect(result[i]).toEqual(expect.arrayContaining(arr));
//   })
// });

// test("make edges_edges 4", (done) => {
//   try {
//     const result = ear.core.make_edges_edges({
//       edges_vertices: [[0], [1], undefined, [2]] 
//     });
//   } catch (error) {
//     expect(error).not.toBe(undefined);
//     done();
//   }
// });

test("make edges_edges 5", (done) => {
  try {
    const result = ear.core.make_edges_edges();
  } catch (error) {
    expect(error).not.toBe(undefined);
    done();
  }
});

test("make edges_edges 6", (done) => {
  try {
    const result = ear.core.make_edges_edges({});
  } catch (error) {
    expect(error).not.toBe(undefined);
    done();
  }
});

test("make edges_edges 7", () => {
  const result = ear.core.make_edges_edges({ edges_vertices:[] });
  expect(result.length).toBe(0);
});
