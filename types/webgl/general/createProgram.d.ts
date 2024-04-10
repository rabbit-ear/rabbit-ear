export default createProgram;
/**
 * Creates a program from 2 script tags.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} vertexSource vertex shader as raw text
 * @param {string} fragmentSource fragment shader as raw text
 * @returns {!WebGLProgram} a WebGL program
 */
declare function createProgram(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string): WebGLProgram;
