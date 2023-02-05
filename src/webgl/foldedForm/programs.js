/**
 * Rabbit Ear (c) Kraft
 */
import createProgram from "../general/createProgram.js";
import {
	makeFoldedVertexArrays,
	makeFoldedElementArrays,
	makeThickEdgesVertexArrays,
	makeThickEdgesElementArrays,
} from "./arrays.js";
import {
	makeExplodedGraph,
} from "./general.js";
import makeUniforms from "./uniforms.js";
import vertexV1 from "./shaders/model-100.vert";
import fragmentV1 from "./shaders/model-100.frag";
import vertexV2 from "./shaders/model-300.vert";
import fragmentV2 from "./shaders/model-300.frag";
import vertexOutlinedV1 from "./shaders/outlined-model-100.vert";
import fragmentOutlinedV1 from "./shaders/outlined-model-100.frag";
import vertexOutlinedV2 from "./shaders/outlined-model-300.vert";
import fragmentOutlinedV2 from "./shaders/outlined-model-300.frag";
// thick edges
import vertexThickEdgesV1 from "./shaders/thick-edges-100.vert";
import vertexThickEdgesV2 from "./shaders/thick-edges-300.vert";
import fragmentSimpleV1 from "./shaders/simple-100.frag";
import fragmentSimpleV2 from "./shaders/simple-300.frag";

export const foldedFormFaces = (gl, version = 1, graph = {}, options = {}) => {
	const exploded = makeExplodedGraph(graph, options.layerNudge);
	const program = version === 1
		? createProgram(gl, vertexV1, fragmentV1)
		: createProgram(gl, vertexV2, fragmentV2);
	return {
		program,
		vertexArrays: makeFoldedVertexArrays(gl, program, exploded, options),
		elementArrays: makeFoldedElementArrays(gl, version, exploded, options),
		flags: [gl.DEPTH_TEST],
		makeUniforms,
	};
};

export const foldedFormEdges = (gl, version = 1, graph = {}, options = {}) => {
	const program = version === 1
		? createProgram(gl, vertexThickEdgesV1, fragmentSimpleV1)
		: createProgram(gl, vertexThickEdgesV2, fragmentSimpleV2);
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
		? createProgram(gl, vertexOutlinedV1, fragmentOutlinedV1)
		: createProgram(gl, vertexOutlinedV2, fragmentOutlinedV2);
	return {
		program,
		vertexArrays: makeFoldedVertexArrays(gl, program, exploded, options),
		elementArrays: makeFoldedElementArrays(gl, version, exploded, options),
		flags: [gl.DEPTH_TEST],
		makeUniforms,
	};
};
