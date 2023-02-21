/**
 * Rabbit Ear (c) Kraft
 */
import createProgram from "../general/createProgram.js";
import {
	makeCPEdgesVertexArrays,
	makeCPEdgesElementArrays,
	makeCPFacesVertexArrays,
	makeCPFacesElementArrays,
} from "./arrays.js";
import makeUniforms from "./uniforms.js";
import {
	simple_2d_100_vert,
	thick_edges_100_vert,
	simple_2d_100_frag,
	simple_2d_300_vert,
	thick_edges_300_vert,
	simple_2d_300_frag,
} from "./shaders.js";

export const cpFacesV1 = (gl, version = 1, graph = {}) => {
	const program = createProgram(gl, simple_2d_100_vert, simple_2d_100_frag);
	return {
		program,
		vertexArrays: makeCPFacesVertexArrays(gl, program, graph),
		elementArrays: makeCPFacesElementArrays(gl, version, graph),
		flags: [],
		makeUniforms,
	};
};

export const cpEdgesV1 = (gl, version = 1, graph = {}) => {
	const program = createProgram(gl, thick_edges_100_vert, simple_2d_100_frag);
	return {
		program,
		vertexArrays: makeCPEdgesVertexArrays(gl, program, graph),
		elementArrays: makeCPEdgesElementArrays(gl, version, graph),
		flags: [],
		makeUniforms,
	};
};

export const cpFacesV2 = (gl, version = 2, graph = {}) => {
	const program = createProgram(gl, simple_2d_300_vert, simple_2d_300_frag);
	return {
		program,
		vertexArrays: makeCPFacesVertexArrays(gl, program, graph),
		elementArrays: makeCPFacesElementArrays(gl, version, graph),
		flags: [],
		makeUniforms,
	};
};

export const cpEdgesV2 = (gl, version = 2, graph = {}) => {
	const program = createProgram(gl, thick_edges_300_vert, simple_2d_300_frag);
	return {
		program,
		vertexArrays: makeCPEdgesVertexArrays(gl, program, graph),
		elementArrays: makeCPEdgesElementArrays(gl, version, graph),
		flags: [],
		makeUniforms,
	};
};
