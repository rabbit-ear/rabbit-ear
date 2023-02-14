/**
 * Rabbit Ear (c) Kraft
 */
import { multiplyMatrices4 } from "../../math/algebra/matrix4.js";

const makeUniforms = (gl, {
	projectionMatrix, viewMatrix, modelMatrix, strokeWidth,
}) => ({
	u_matrix: {
		func: "uniformMatrix4fv",
		value: multiplyMatrices4(multiplyMatrices4(
			projectionMatrix,
			viewMatrix,
		), modelMatrix),
	},
	u_projection: {
		func: "uniformMatrix4fv",
		value: projectionMatrix,
	},
	u_modelView: {
		func: "uniformMatrix4fv",
		value: multiplyMatrices4(viewMatrix, modelMatrix),
	},
	u_strokeWidth: {
		func: "uniform1f",
		value: strokeWidth / 2,
	},
});

export default makeUniforms;
