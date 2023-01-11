/**
 * Rabbit Ear (c) Kraft
 */
// the uniform is an object and the object should be structured like this:
// {
// 	u_modelView: {
// 		func: "uniformMatrix4fv",
// 		value: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
// 	},
// 	u_opacity: {
// 		func: "uniform1f",
// 		value: opacity,
// 	},
// }
const uniformFunc = (gl, i, func, value) => {
	switch (func) {
	case "uniformMatrix4fv": gl[func](i, false, value); break;
	// case "uniform1f":
	// case "uniform2fv":
	// case "uniform3fv":
	default: gl[func](i, value); break;
	}
};
/**
 * @param {object} gl a link to the WebGL instance
 * @param {number} version 1 or 2, which WebGL version.
 * @param {object} bundle the result of calling CreasePattern() FoldedForm()...
 * @param {object} uniforms the result of calling makeUniforms()
 */
export const drawProgram = (gl, version, bundle, uniforms = {}) => {
	gl.useProgram(bundle.program);
	bundle.flags.forEach(flag => gl.enable(flag));
	// set uniforms
	const uniformCount = gl.getProgramParameter(bundle.program, gl.ACTIVE_UNIFORMS);
	for (let i = 0; i < uniformCount; i += 1) {
		const uniformName = gl.getActiveUniform(bundle.program, i).name;
		const uniform = uniforms[uniformName];
		if (uniform) {
			const index = gl.getUniformLocation(bundle.program, uniformName);
			uniformFunc(gl, index, uniform.func, uniform.value);
		}
	}
	// set vertex arrays
	bundle.vertexArrays.forEach(el => {
		gl.bindBuffer(gl.ARRAY_BUFFER, el.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, el.data, gl.STATIC_DRAW);
		gl.vertexAttribPointer(el.location, el.length, el.type, false, 0, 0);
		gl.enableVertexAttribArray(el.location);
	});
	// gl.linkProgram(bundle.program);
	// draw elements
	// WebGL 2 supports UNSIGNED_INT (Uint32Array)
	// WebGL 1 cannot and must use UNSIGNED_SHORT (Uint16Array)
	bundle.elementArrays.forEach(el => {
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, el.buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, el.data, gl.STATIC_DRAW);
		gl.drawElements(
			el.mode, // GL.TRIANGLES for example
			el.data.length,
			version === 2 ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT,
			el.buffer,
		);
	});
	bundle.flags.forEach(flag => gl.disable(flag));
};
/**
 *
 */
export const deallocProgram = (gl, bundle) => {
	bundle.vertexArrays.forEach(vert => gl.disableVertexAttribArray(vert.location));
	bundle.vertexArrays.forEach(vert => gl.deleteBuffer(vert.buffer));
	bundle.elementArrays.forEach(elements => gl.deleteBuffer(elements.buffer));
	gl.deleteProgram(bundle.program);
	// gl.deleteTexture(someTexture);
	// gl.deleteRenderbuffer(someRenderbuffer);
	// gl.deleteFramebuffer(someFramebuffer);
};
