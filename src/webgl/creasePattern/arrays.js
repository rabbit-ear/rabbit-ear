/**
 * Rabbit Ear (c) Kraft
 */
import { makeCPEdgesVertexData } from "./data.js";
import { triangulateConvexFacesVertices } from "../../graph/triangulate.js";

/**
 * @param {object} gl WebGL context
 * @param {object} program
 * @param {FOLD} graph a FOLD object
 */
export const makeCPEdgesVertexArrays = (gl, program, graph, options) => {
	if (!graph || !graph.vertices_coords || !graph.edges_vertices) {
		return [];
	}
	const {
		vertices_coords,
		vertices_color,
		verticesEdgesVector,
		vertices_vector,
	} = makeCPEdgesVertexData(graph, options);

	// todo: better
	if (!vertices_coords) { return []; }
	return [{
		location: gl.getAttribLocation(program, "v_position"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: 2,
		data: new Float32Array(vertices_coords.flat()),
	}, {
		location: gl.getAttribLocation(program, "v_color"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: vertices_color.length ? vertices_color[0].length : 2,
		data: new Float32Array(vertices_color.flat()),
	}, {
		location: gl.getAttribLocation(program, "edge_vector"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: verticesEdgesVector.length ? verticesEdgesVector[0].length : 2,
		data: new Float32Array(verticesEdgesVector.flat()),
	}, {
		location: gl.getAttribLocation(program, "vertex_vector"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: vertices_vector.length ? vertices_vector[0].length : 2,
		data: new Float32Array(vertices_vector.flat()),
	}].filter(el => el.location !== -1);
};

export const makeCPEdgesElementArrays = (gl, version = 1, graph = {}) => {
	if (!graph || !graph.edges_vertices) { return []; }
	const edgesTriangles = graph.edges_vertices
		.map((_, i) => i * 4)
		.flatMap(i => [i + 0, i + 1, i + 2, i + 2, i + 3, i + 0]);
	return [{
		mode: gl.TRIANGLES,
		buffer: gl.createBuffer(),
		data: version === 2
			? new Uint32Array(edgesTriangles)
			: new Uint16Array(edgesTriangles),
	}];
};

const make2D = (coords) => coords
	.map(coord => [0, 1]
		.map(i => coord[i] || 0));

export const makeCPFacesVertexArrays = (gl, program, graph) => {
	if (!graph || !graph.vertices_coords) { return []; }
	return [{
		location: gl.getAttribLocation(program, "v_position"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: 2,
		data: new Float32Array(make2D(graph.vertices_coords).flat()),
	}].filter(el => el.location !== -1);
};

export const makeCPFacesElementArrays = (gl, version = 1, graph = {}) => {
	if (!graph || !graph.vertices_coords || !graph.faces_vertices) { return []; }
	return [{
		mode: gl.TRIANGLES,
		buffer: gl.createBuffer(),
		data: version === 2
			? new Uint32Array(triangulateConvexFacesVertices(graph).flat())
			: new Uint16Array(triangulateConvexFacesVertices(graph).flat()),
	}];
};
