/**
 * Rabbit Ear (c) Kraft
 */
import {
	createProgram,
} from "../general/program.js";
import {
	makeFoldedVertexArrays,
	makeFoldedElementArrays,
	makeThickEdgesVertexArrays,
	makeThickEdgesElementArrays,
} from "./arrays.js";
import {
	makeExplodedGraph,
} from "./general.js";
import {
	makeUniforms,
} from "./uniforms.js";
import {
	model_100_vert,
	model_100_frag,
	model_300_vert,
	model_300_frag,
	outlined_model_100_vert,
	outlined_model_100_frag,
	outlined_model_300_vert,
	outlined_model_300_frag,
	thick_edges_100_vert,
	thick_edges_300_vert,
	simple_100_frag,
	simple_300_frag,
} from "./shaders.js";

export const foldedFormFaces = (gl, version = 1, graph = {}, options = {}) => {
	const exploded = makeExplodedGraph(graph, options.layerNudge);
	const program = version === 1
		? createProgram(gl, model_100_vert, model_100_frag)
		: createProgram(gl, model_300_vert, model_300_frag);
	return {
		program,
		vertexArrays: makeFoldedVertexArrays(gl, program, exploded, options),
		elementArrays: makeFoldedElementArrays(gl, version, exploded), // , options),
		flags: [gl.DEPTH_TEST],
		makeUniforms,
	};
};

export const foldedFormEdges = (gl, version = 1, graph = {}, options = {}) => {
	const program = version === 1
		? createProgram(gl, thick_edges_100_vert, simple_100_frag)
		: createProgram(gl, thick_edges_300_vert, simple_300_frag);
	return {
		program,
		vertexArrays: makeThickEdgesVertexArrays(gl, program, graph, options),
		elementArrays: makeThickEdgesElementArrays(gl, version, graph),
		flags: [gl.DEPTH_TEST],
		makeUniforms,
	};
};

export const foldedFormFacesOutlined = (gl, version = 1, graph = {}, options = {}) => {
	const exploded = makeExplodedGraph(graph, options.layerNudge);
	const program = version === 1
		? createProgram(gl, outlined_model_100_vert, outlined_model_100_frag)
		: createProgram(gl, outlined_model_300_vert, outlined_model_300_frag);
	return {
		program,
		vertexArrays: makeFoldedVertexArrays(gl, program, exploded, options),
		elementArrays: makeFoldedElementArrays(gl, version, exploded), // , options),
		flags: [gl.DEPTH_TEST],
		makeUniforms,
	};
};
