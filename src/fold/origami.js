
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
