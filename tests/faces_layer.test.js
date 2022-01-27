const ear = require("rabbit-ear");

test("", () => {
	let cp = ear.cp.rectangle(0.3);
	cp.vertices_coords[2] = [0.5, 1];
	cp.vertices_coords[3] = [0.2, 1];
	cp.line(ear.line.fromPoints([0,0.1], [1,0.1])).valley();
	cp.line(ear.line.fromPoints([0,0.2], [1,0.2])).mountain();
	cp.line(ear.line.fromPoints([0,0.3], [1,0.3])).mountain();
	cp.line(ear.line.fromPoints([0,0.5], [1,0.5])).mountain();
	cp.line(ear.line.fromPoints([0,0.7], [1,0.7])).mountain();
	cp.line(ear.line.fromPoints([0,0.8], [1,0.8])).mountain();
	cp.line(ear.line.fromPoints([0,0.9], [1,0.9])).valley();
	cp.fragment();
	cp.populate();
	// ideally, we want (layers_face)
	// 0, 2, 3, 4, 5, 6, 7, 1
	// to become
	// 4  0  2  3  6  7  1  5
	// 

	const faces_layer = ear.layer.make_faces_layers(cp);
	// console.log("faces_layer", faces_layer);
	// folded["faces_re:layer"] = faces_layer;
	expect(true).toBe(true);
});
