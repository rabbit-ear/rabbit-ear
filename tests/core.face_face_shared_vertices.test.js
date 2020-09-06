const ear = require("../rabbit-ear");

const arraysMatch = (a, b) => a.forEach((_, i) => expect(a[i]).toBe(b[i]));

test("face face shared vertices", () => {
  arraysMatch(ear.core
    .face_face_shared_vertices([1,2,4,5,7,9,11,15,18], [19,15,14,12,9,7,3,1]),
    [7, 9, 15, 1]);
  arraysMatch(ear.core
    .face_face_shared_vertices([1,2,4,5,7,9,11,15,18], [18,15,14,12,9,7,3,1]),
    [7, 9, 15, 18, 1]);
  arraysMatch(ear.core
    .face_face_shared_vertices([0,1,2,4,5,7,9,11,15,18], [18,15,14,12,9,7,3]),
    [7, 9, 15, 18]);
  arraysMatch(ear.core
    .face_face_shared_vertices([1,5,6,9,13], [16,9,6,4,2]),
    [6, 9]);
  arraysMatch(ear.core
    .face_face_shared_vertices([3, 5, 7, 9], [9, 7, 5, 3]),
    [3, 5, 7, 9]);
  arraysMatch(ear.core
    .face_face_shared_vertices([3, 5, 7, 9], [9, 7, 5, 3, 2]),
    [3, 5, 7, 9]);
  arraysMatch(ear.core
    .face_face_shared_vertices([3, 5, 7, 9], [11, 9, 7, 5, 3]),
    [3, 5, 7, 9]);
  arraysMatch(ear.core
    .face_face_shared_vertices([3, 5, 7, 9, 11], [9, 7, 5, 3]),
    [3, 5, 7, 9]);
  arraysMatch(ear.core
    .face_face_shared_vertices([2, 3, 5, 7, 9], [9, 7, 5, 3]),
    [3, 5, 7, 9]);

  arraysMatch(ear.core
    .face_face_shared_vertices([1, 2, 3, 4], [0, 1, 2, 6, 7]),
    [1, 2]);
  arraysMatch(ear.core
    .face_face_shared_vertices([1, 2, 3, 4, 7], [0, 1, 2, 6, 7]),
    [7, 1, 2]);
});
