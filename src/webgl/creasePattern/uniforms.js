/**
 * Rabbit Ear (c) Kraft
 */
import { multiplyMatrices4 } from "../../math/algebra/matrix4.js";
import { parseColorToWebGLRgb } from "../general/colors.js";

const makeUniforms = (gl, {
	projectionMatrix,
	modelViewMatrix,
	cpColor,
	strokeWidth,
}) => ({
	u_matrix: {
		func: "uniformMatrix4fv",
		value: multiplyMatrices4(projectionMatrix, modelViewMatrix),
	},
	u_projection: {
		func: "uniformMatrix4fv",
		value: projectionMatrix,
	},
	u_modelView: {
		func: "uniformMatrix4fv",
		value: modelViewMatrix,
	},
	u_cpColor: {
		func: "uniform3fv",
		value: parseColorToWebGLRgb(cpColor),
	},
	u_strokeWidth: {
		func: "uniform1f",
		value: strokeWidth,
	},
});

export default makeUniforms;
