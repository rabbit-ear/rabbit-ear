import createProgram from "../general/createProgram";
import {
	makeCPEdgesVertexArrays,
	makeCPEdgesElementArrays,
	makeCPFacesVertexArrays,
	makeCPFacesElementArrays,
} from "./arrays";
import makeUniforms from "./uniforms";
import vertexSimpleV1 from "./shaders/simple-2d-100.vert";
import vertexThickEdgesV1 from "./shaders/thick-edges-100.vert";
import fragmentSimpleV1 from "./shaders/simple-2d-100.frag";
import vertexSimpleV2 from "./shaders/simple-2d-300.vert";
import vertexThickEdgesV2 from "./shaders/thick-edges-300.vert";
import fragmentSimpleV2 from "./shaders/simple-2d-300.frag";

export const cpFacesV1 = (gl, version = 1, graph = {}) => {
	const program = createProgram(gl, vertexSimpleV1, fragmentSimpleV1);
	return {
		program,
		vertexArrays: makeCPFacesVertexArrays(gl, program, graph),
		elementArrays: makeCPFacesElementArrays(gl, version, graph),
		flags: [],
		makeUniforms,
	};
};

export const cpEdgesV1 = (gl, version = 1, graph = {}) => {
	const program = createProgram(gl, vertexThickEdgesV1, fragmentSimpleV1);
	return {
		program,
		vertexArrays: makeCPEdgesVertexArrays(gl, program, graph),
		elementArrays: makeCPEdgesElementArrays(gl, version, graph),
		flags: [],
		makeUniforms,
	};
};

export const cpFacesV2 = (gl, version = 2, graph = {}) => {
	const program = createProgram(gl, vertexSimpleV2, fragmentSimpleV2);
	return {
		program,
		vertexArrays: makeCPFacesVertexArrays(gl, program, graph),
		elementArrays: makeCPFacesElementArrays(gl, version, graph),
		flags: [],
		makeUniforms,
	};
};

export const cpEdgesV2 = (gl, version = 2, graph = {}) => {
	const program = createProgram(gl, vertexThickEdgesV2, fragmentSimpleV2);
	return {
		program,
		vertexArrays: makeCPEdgesVertexArrays(gl, program, graph),
		elementArrays: makeCPEdgesElementArrays(gl, version, graph),
		flags: [],
		makeUniforms,
	};
};
