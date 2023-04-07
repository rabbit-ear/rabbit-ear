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
	cp_100_vert,
	cp_100_frag,
	cp_300_vert,
	cp_300_frag,
	thick_edges_100_vert,
	thick_edges_300_vert,
} from "./shaders.js";

export const cpFacesV1 = (gl, graph = {}, options = undefined) => {
	const program = createProgram(gl, cp_100_vert, cp_100_frag);
	return {
		program,
		vertexArrays: makeCPFacesVertexArrays(gl, program, graph, options),
		elementArrays: makeCPFacesElementArrays(gl, 1, graph),
		flags: [],
		makeUniforms,
	};
};

export const cpEdgesV1 = (gl, graph = {}, options = undefined) => {
	const program = createProgram(gl, thick_edges_100_vert, cp_100_frag);
	return {
		program,
		vertexArrays: makeCPEdgesVertexArrays(gl, program, graph, options),
		elementArrays: makeCPEdgesElementArrays(gl, 1, graph),
		flags: [],
		makeUniforms,
	};
};

export const cpFacesV2 = (gl, graph = {}, options = undefined) => {
	const program = createProgram(gl, cp_300_vert, cp_300_frag);
	return {
		program,
		vertexArrays: makeCPFacesVertexArrays(gl, program, graph, options),
		elementArrays: makeCPFacesElementArrays(gl, 2, graph),
		flags: [],
		makeUniforms,
	};
};

export const cpEdgesV2 = (gl, graph = {}, options = undefined) => {
	const program = createProgram(gl, thick_edges_300_vert, cp_300_frag);
	return {
		program,
		vertexArrays: makeCPEdgesVertexArrays(gl, program, graph, options),
		elementArrays: makeCPEdgesElementArrays(gl, 2, graph),
		flags: [],
		makeUniforms,
	};
};
