const ear = require("../rabbit-ear");

test("face face common vertices", () => {
  expect(ear.core
    .face_face_shared_vertices([1,2,4,5,7,9,11,15,18], [19,15,14,12,9,7,3,1]))
    .toEqual(expect.arrayContaining([1, 7, 9, 15]));
  expect(ear.core
    .face_face_shared_vertices([1,2,4,5,7,9,11,15,18], [18,15,14,12,9,7,3,1]))
    .toEqual(expect.arrayContaining([15, 18, 1, 7, 9]));
  expect(ear.core
    .face_face_shared_vertices([0,1,2,4,5,7,9,11,15,18], [18,15,14,12,9,7,3]))
    .toEqual(expect.arrayContaining([15, 18, 7, 9]));
  expect(ear.core
    .face_face_shared_vertices([1,5,6,9,13], [16,9,6,4,2]))
    .toEqual(expect.arrayContaining([6, 9]));
  expect(ear.core
    .face_face_shared_vertices([3, 5, 7, 9], [9, 7, 5, 3]))
    .toEqual(expect.arrayContaining([3, 5, 7, 9]));
  expect(ear.core
    .face_face_shared_vertices([3, 5, 7, 9], [9, 7, 5, 3, 2]))
    .toEqual(expect.arrayContaining([3, 5, 7, 9]));
  expect(ear.core
    .face_face_shared_vertices([3, 5, 7, 9], [11, 9, 7, 5, 3]))
    .toEqual(expect.arrayContaining([3, 5, 7, 9]));
  expect(ear.core
    .face_face_shared_vertices([3, 5, 7, 9, 11], [9, 7, 5, 3]))
    .toEqual(expect.arrayContaining([3, 5, 7, 9]));
  expect(ear.core
    .face_face_shared_vertices([2, 3, 5, 7, 9], [9, 7, 5, 3]))
    .toEqual(expect.arrayContaining([3, 5, 7, 9]));
});
