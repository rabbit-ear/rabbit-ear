import math from "../../math";
import { getBoundingBox } from "../../graph/boundary";
/**
 * @description Initialize a viewport for a WebGL context
 * based on the dimensions of the canvas.
 * @param {object} gl a WebGL instance
 * @param {object} canvas an HTML canvas
 */
export const rebuildViewport = (gl, canvas) => {
	if (!gl) { return; }
	const devicePixelRatio = window.devicePixelRatio || 1;
	const size = [canvas.clientWidth, canvas.clientHeight]
		.map(n => n * devicePixelRatio);
	if (canvas.width !== size[0] || canvas.height !== size[1]) {
		canvas.width = size[0];
		canvas.height = size[1];
	}
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
};
/**
 * @description Create a 4x4 projection matrix for either a
 * perspective or orthographic view.
 * @param {object} canvas an HTML canvas
 * @param {string} perspective "orthographic" or "perspective"
 * @param {number} fov the field of view (perspective only)
 */
export const makeProjectionMatrix = (canvas, perspective = "perspective", fov = 45) => {
	if (!canvas) { return math.core.identity4x4; }
	const Z_NEAR = 0.1;
	const Z_FAR = 3;
	const ORTHO_FAR = -100;
	const ORTHO_NEAR = 100;
	const bounds = [canvas.clientWidth, canvas.clientHeight];
	const vmin = Math.min(...bounds);
	const padding = [0, 1].map(i => ((bounds[i] - vmin) / vmin) / 2);
	const side = padding.map(p => p + 0.5);
	return perspective === "orthographic"
		? math.core.makeOrthographicMatrix4(side[1], side[0], -side[1], -side[0], ORTHO_FAR, ORTHO_NEAR)
		: math.core.makePerspectiveMatrix4(fov * (Math.PI / 180), bounds[0] / bounds[1], Z_NEAR, Z_FAR);
};
/**
 * @description build an aspect-fit model matrix
 * (possibly an inverse-model matrix)
 * which brings the vertices inside of a 2x2x2 origin-centered bounding box.
 * @param {FOLD} graph a FOLD graph
 */
export const makeModelMatrix = (graph) => {
	if (!graph) { return math.core.identity4x4; }
	const bounds = getBoundingBox(graph);
	if (!bounds) { return math.core.identity4x4; }
	const scale = Math.max(...bounds.span); // * Math.SQRT2;
	const center = math.core.resize(3, math.core.midpoint(bounds.min, bounds.max));
	const scalePositionMatrix = [scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, scale, 0, ...center, 1];
	return math.core.invertMatrix4(scalePositionMatrix);
};
