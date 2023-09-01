/**
 * Rabbit Ear (c) Kraft
 */
import { multiplyMatrices4 } from "../../math/matrix4.js";
import { parseColorToWebGLRgb } from "../general/colors.js";

const makeUniforms = (gl, {
	projectionMatrix,
	modelViewMatrix,
	frontColor,
	backColor,
	strokeWidth,
	opacity,
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
	u_frontColor: {
		func: "uniform3fv",
		value: parseColorToWebGLRgb(frontColor),
	},
	u_backColor: {
		func: "uniform3fv",
		value: parseColorToWebGLRgb(backColor),
	},
	u_strokeWidth: {
		func: "uniform1f",
		value: strokeWidth,
	},
	u_opacity: {
		func: "uniform1f",
		value: opacity,
	},
});

export default makeUniforms;
