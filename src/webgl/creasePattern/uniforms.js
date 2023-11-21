/**
 * Rabbit Ear (c) Kraft
 */
import {
	identity4x4,
	multiplyMatrices4,
} from "../../math/matrix4.js";
import { parseColorToWebGLRgb } from "../general/colors.js";
/**
 * @description Uniforms must exist so there are protections to ensure
 * that at least some value gets passed.
 */
const makeUniforms = (gl, {
	projectionMatrix,
	modelViewMatrix,
	cpColor,
	strokeWidth,
}) => ({
	u_matrix: {
		func: "uniformMatrix4fv",
		value: multiplyMatrices4(
			projectionMatrix || identity4x4,
			modelViewMatrix || identity4x4,
		),
	},
	u_projection: {
		func: "uniformMatrix4fv",
		value: projectionMatrix || identity4x4,
	},
	u_modelView: {
		func: "uniformMatrix4fv",
		value: modelViewMatrix || identity4x4,
	},
	u_cpColor: {
		func: "uniform3fv",
		value: parseColorToWebGLRgb(cpColor || "white"),
	},
	u_strokeWidth: {
		func: "uniform1f",
		value: strokeWidth || 0.05,
	},
});

export default makeUniforms;
