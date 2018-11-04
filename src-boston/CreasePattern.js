import SVG from "./SimpleSVG";
import * as Folder from "./Folder"
import * as Bases from "./OrigamiBases"

class CreasePattern{
	constructor(){
		this.frame = 0;
		this.data = Folder.clone(Bases.unitSquare);

	}

	lineSegment(x1, y1, x2, y2){
	
	}

	reflect(x, y, vx, vy){

	}

	valleyFold(){

	}
}


// vertices are arrays of points [x,y] or [x,y,z]
// the z coordinate is optional, if left out it assumes 0
function vertices_similar(a, b){
	var az = (a[2] == null) ? 0 : a[2];
	var bz = (b[2] == null) ? 0 : b[2];
	return Math.abs(a[0]-b[0]) < 1e-10 && 
	       Math.abs(a[1]-b[1]) < 1e-10 && 
	       Math.abs(az - bz)  < 1e-10;
}

// this modifies the fold_file

// add to fold_file vertices_coords if vertex doesn't exist. 
// return index of new vertex in verties_coords array
function add_vertex(fold_file, x, y, z){
	let new_vertex = (z == null) ? [x, y] : [x, y, z];
	let index = fold_file.vertices_coords
		.map((vertex, index) => ({vertex: vertex, index: index}))
		.filter(obj => vertices_similar(obj.vertex, new_vertex))
		.map(obj => obj.index)
		.shift();
	if(index == null){
		index = fold_file.vertices_coords.length;
		fold_file.vertices_coords.push(new_vertex);
	}
	return index;
}

// v1 and v2 are indices in the vertex array
function add_edge(fold_file, v1, v2){
	let index = fold_file.edges_vertices
		.filter(e => (e[0]==a && e[1]==b) || (e[0]==b && e[1]==a))
		.shift();
	if(index == null){
		index = fold_file.edges_vertices.length;
		fold_file.edges_vertices.push([a,b]);
	}
	return index;
}

function add_line_between_points(fold_file, x1, y1, x2, y2){
	let vertices_coords = fold_file.vertices_coords;
	let edges_vertices = fold_file.edges_vertices;
	let a = add_vertex(fold_file, x1, y1);
	let b = add_vertex(fold_file, x2, y2);
	return add_edge(fold_file, a, b);
}

