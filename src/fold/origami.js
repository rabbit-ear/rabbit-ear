
export function axiom1(fold, pointA, pointB){
	// chop faces
	// let line = Geom.axiom1(pointA, pointB);
	let f = clone(fold);
	f.vertices_coords.push(pointA);
	f.vertices_coords.push(pointB);
	f.edges_vertices.push([
		f.vertices_coords.length-2,
		f.vertices_coords.length-1
	]);
	f.edges_assignment.push("F");
	return f;
}

export function axiom1_force(fold, pointA, pointB){
	let f = clone(fold);
	f.vertices_coords.push(pointA);
	f.vertices_coords.push(pointB);
	f.edges_vertices.push([
		f.vertices_coords.length-2,
		f.vertices_coords.length-1
	]);
	f.edges_assignment.push("F");
	return f;
}


export function axiom2(fold, pointA, pointB){
	return Geom.core.axiom2(pointA, pointB);
}

export function fold_without_layering(fold, face) {
	if (face == null) { face = 0; }
	let faces_matrix = Graph.make_faces_matrix(fold, face);
	let vertex_in_face = fold.vertices_coords.map((v,i) => {
		for(var f = 0; f < fold.faces_vertices.length; f++){
			if(fold.faces_vertices[f].includes(i)){ return f; }
		}
	});
	let new_vertices_coords_cp = fold.vertices_coords.map((point,i) =>
		Geom.core.multiply_vector2_matrix2(point, faces_matrix[vertex_in_face[i]]).map((n) => 
			Geom.core.clean_number(n)
		)
	)
	fold.frame_classes = ["foldedState"];
	fold.vertices_coords = new_vertices_coords_cp;
	return fold;
}
