const ear = require("rabbit-ear");

const arraysMatch = (a, b) => a.forEach((_, i) => expect(a[i]).toBe(b[i]));

test("face face shared vertices", () => {
	arraysMatch([7, 9, 15, 1], ear.graph.getFaceFaceSharedVertices(
		[1, 2, 4, 5, 7, 9, 11, 15, 18], [19, 15, 14, 12, 9, 7, 3, 1]));
	arraysMatch([7, 9, 15, 18, 1], ear.graph.getFaceFaceSharedVertices(
		[1, 2, 4, 5, 7, 9, 11, 15, 18], [18, 15, 14, 12, 9, 7, 3, 1]));
	arraysMatch([7, 9, 15, 18], ear.graph.getFaceFaceSharedVertices(
		[0, 1, 2, 4, 5, 7, 9, 11, 15, 18], [18, 15, 14, 12, 9, 7, 3]));
	arraysMatch([6, 9], ear.graph.getFaceFaceSharedVertices(
		[1, 5, 6, 9, 13], [16, 9, 6, 4, 2]));
	arraysMatch([3, 5, 7, 9], ear.graph.getFaceFaceSharedVertices(
		[3, 5, 7, 9], [9, 7, 5, 3]));
	arraysMatch([3, 5, 7, 9], ear.graph.getFaceFaceSharedVertices(
		[3, 5, 7, 9], [9, 7, 5, 3, 2]));
	arraysMatch([3, 5, 7, 9], ear.graph.getFaceFaceSharedVertices(
		[3, 5, 7, 9], [11, 9, 7, 5, 3]));
	arraysMatch([3, 5, 7, 9], ear.graph.getFaceFaceSharedVertices(
		[3, 5, 7, 9, 11], [9, 7, 5, 3]));
	arraysMatch([3, 5, 7, 9], ear.graph.getFaceFaceSharedVertices(
		[2, 3, 5, 7, 9], [9, 7, 5, 3]));
	arraysMatch([1, 2], ear.graph.getFaceFaceSharedVertices(
		[1, 2, 3, 4], [0, 1, 2, 6, 7]));
	arraysMatch([7, 1, 2], ear.graph.getFaceFaceSharedVertices(
		[1, 2, 3, 4, 7], [0, 1, 2, 6, 7]));
});
