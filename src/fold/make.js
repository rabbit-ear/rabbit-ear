import { clean_number } from "../convert/arguments"; 

const template = function() {
	return {
		file_spec: 1.1,
		file_creator: "Rabbit Ear",
		file_author: "",
		file_title: "",
		file_description: "",
		file_classes: [],
		file_frames: [],

		frame_author: "",
		frame_title: "",
		frame_description: "",
		frame_attributes: [],
		frame_classes: [],
		frame_unit: "unit",
	};
};

const cp_type = function() {
	return {
		file_classes: ["singleModel"],
		frame_attributes: ["2D"],
		frame_classes: ["creasePattern"],
	};
};

const square_graph = function() {
	return {
		vertices_coords: [[0,0], [1,0], [1,1], [0,1]],
		vertices_vertices: [[1,3], [2,0], [3,1], [0,2]],
		vertices_faces: [[0], [0], [0], [0]],
		edges_vertices: [[0,1], [1,2], [2,3], [3,0]],
		edges_faces: [[0], [0], [0], [0]],
		edges_assignment: ["B","B","B","B"],
		edges_foldAngle: [0, 0, 0, 0],
		edges_length: [1, 1, 1, 1],
		faces_vertices: [[0,1,2,3]],
		faces_edges: [[0,1,2,3]]
	};
}


export const square = function(width, height) {
	return Object.assign(
		Object.create(null),
		template(),
		cp_type,
		square_graph()
	);
};

export const rectangle = function(width, height) {
	let graph = square_graph();
	graph.vertices_coords = [[0,0], [width,0], [width,height], [0,height]];
	graph.edges_length = [width, height, width, height];
	return Object.assign(
		Object.create(null),
		template(),
		cp_type,
		graph
	);
};

export const regular_polygon = function(sides, radius = 1) {
	let arr = Array.from(Array(sides));
	let angle = 2 * Math.PI / sides;
	let sideLength = clean_number(Math.sqrt(
		Math.pow(radius - radius*Math.cos(angle), 2) +
		Math.pow(radius*Math.sin(angle), 2)
	));
	let graph = {
		// vertices_
		vertices_coords: arr.map((_,i) => angle * i).map(a => [
			clean_number(radius*Math.cos(a)),
			clean_number(radius*Math.sin(a))
		]),
		vertices_vertices: arr
			.map((_,i) => [(i+1)%arr.length, (i+arr.length-1)%arr.length]),
		vertices_faces: arr.map(_ => [0]),
		// edges_
		edges_vertices: arr.map((_,i) => [i, (i+1)%arr.length]),
		edges_faces: arr.map(_ => [0]),
		edges_assignment: arr.map(_ => "B"),
		edges_foldAngle: arr.map(_ => 0),
		edges_length: arr.map(_ => sideLength),
		// faces_
		faces_vertices: [arr.map((_,i) => i)],
		faces_edges: [arr.map((_,i) => i)],
		// "re:faces_layer": [0]
	}
	return Object.assign(
		Object.create(null),
		template(),
		cp_type,
		graph
	);
};

