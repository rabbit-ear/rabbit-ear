/**
 * Rabbit Ear (c) Kraft
 */
import { createProgram } from "../general/webgl.js";
import { touches_100_vert, touches_100_frag } from "./shaders.js";
import { makeUniforms } from "./uniforms.js";

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl WebGL context
 * @param {object} program
 * @returns {WebGLVertexArray[]}
 */
const makeVertexArrays = (gl, program) => [
	{
		location: gl.getAttribLocation(program, "v_position"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: 2,
		data: new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
	},
];

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl WebGL context
 * @param {number} version the WebGL version
 * @returns {WebGLElementArray[]}
 */
const makeElementArrays = (gl, version = 1) => [
	{
		mode: gl.TRIANGLE_STRIP,
		buffer: gl.createBuffer(),
		// drawModel uses UNSIGNED_INT for WebGL 2 and UNSIGNED_SHORT for WebGL 1
		data: version === 2 ? new Uint32Array([0, 1, 2, 3]) : new Uint16Array([0, 1, 2, 3]),
	},
];

/**
 * @description The touch indicators use a version 100 shader, which runs
 * in both WebGL 1 and 2, however, the element array type must match the
 * version of WebGL.
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The WebGL Context.
 * @param {number} [version=1] the version of the WebGL
 * @returns {WebGLModel}
 */
export const indicatorsV1 = (gl, version = 1) => {
	const program = createProgram(gl, touches_100_vert, touches_100_frag);
	return {
		program,
		vertexArrays: makeVertexArrays(gl, program),
		elementArrays: makeElementArrays(gl, version),
		flags: [], // flags: [gl.DEPTH_TEST],
		makeUniforms,
	};
};

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl The WebGL Context.
 * @param {number} version the version of the WebGL
 * @returns {WebGLModel[]}
 */
export const touchIndicators = (gl, version = 1) => {
	switch (version) {
		case 1:
			return [indicatorsV1(gl, 1)];
		default:
			return [indicatorsV1(gl, 2)];
	}
};
