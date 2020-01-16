let starting_face = 0;

const strip_graft = function(graph, graft_scale) {//func) {
	let face_walk = RabbitEar.core.make_face_walk_tree(graph, starting_face);

	let faces = graph.faces_vertices
		.map(fv => fv.map(v => graph.vertices_coords[v]))
		.map(fv => RabbitEar.polygon(fv));
	let faces_centroids = faces.map(f => f.centroid);
	let faces_matrix = graph.faces_vertices.map(_ => RabbitEar.matrix2());

	let faces_done = graph.faces_vertices.map(_ => false);
	let graft_edges = [];

	face_walk
		.filter((_,i) => i !== 0)
		.forEach(level => level.forEach(f => {
			// get vector from parent to child
			let parent_center = faces_centroids[f.parent];
			let face_center = faces_centroids[f.face];
			let faces_vec = RabbitEar.vector(
				face_center[0] - parent_center[0],
				face_center[1] - parent_center[1]
			);

			// get vector from parent to child, perpendicular to the shared edge
			let p0 = graph.vertices_coords[f.edge[0]];
			let p1 = graph.vertices_coords[f.edge[1]];
			let edgeVec = RabbitEar.vector(p0[0] - p1[0], p0[1] - p1[1]);
			let vec0 = edgeVec.rotateZ90();
			let vec1 = edgeVec.rotateZ270();

			let trans = vec0.dot(faces_vec) > 0
				? vec0.scale(graft_scale)
				: vec1.scale(graft_scale);

			let parent_matrix = faces_matrix[f.parent];
			let local_matrix = RabbitEar.matrix2.makeTranslation(trans[0], trans[1]);
			faces_matrix[f.face] = local_matrix.multiply(parent_matrix);
		}));

		let translatedFaces = faces.map((f,i) => f.transform(faces_matrix[i]));

		origami.drawLayer.removeChildren();
		let svg_faces = translatedFaces
			.map(f => origami.drawLayer.polygon(f.points));
		svg_faces.forEach(face => {
			face.setAttribute("fill", "none");
			face.setAttribute("stroke-width", 0.005);
			face.setAttribute("stroke", "black");
			face.setAttribute("opacity", 0.5);
		});

		origami.cp.edges_faces.forEach((ef,i) => {
			if (ef.length < 2) { return; }
			let face1 = ef[0];
			let face2 = ef[1];
			let p0 = origami.cp.vertices_coords[origami.cp.edges_vertices[i][0]];
			let p0b = origami.cp.vertices_coords[origami.cp.edges_vertices[i][0]];
			let p1 = origami.cp.vertices_coords[origami.cp.edges_vertices[i][1]];
			let p1b = origami.cp.vertices_coords[origami.cp.edges_vertices[i][1]];

			let p0_parent = faces_matrix[face1].transform(p0);
			let p0_child = faces_matrix[face2].transform(p0b);
			let p1_parent = faces_matrix[face1].transform(p1);
			let p1_child = faces_matrix[face2].transform(p1b);

			graft_edges.push([p0_parent, p0_child]);
			graft_edges.push([p1_parent, p1_child]);
		});

		graft_edges.map(e => 
			origami.drawLayer.line(e[0][0], e[0][1], e[1][0], e[1][1])
		).forEach(line => {
			line.setAttribute("stroke-width", 0.005);
			line.setAttribute("stroke", "black");
		});
}

let origami = RabbitEar.origami({padding:0.5});
origami.drawLayer = origami.group();
origami.edges.visible = false;
origami.groups.boundaries.setAttribute("opacity", 0)

origami.cp = RabbitEar.bases.frog;
strip_graft(origami.cp, 0.2);//function(a,b){ return 0.1; });

origami.onMouseMove = function(mouse) {
	// let face = origami.nearest(mouse.position).faces;
	// if(face !== undefined && starting_face !== face.index) {
	// 	origami.cp = RabbitEar.bases.frog;
	// 	starting_face = face.index;
	// 	strip_graft(origami.cp, function(a,b){ return 0.1; });
	// }
	strip_graft(origami.cp, mouse.x);
}
