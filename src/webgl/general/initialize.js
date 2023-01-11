/**
 * Rabbit Ear (c) Kraft
 */
const initializeWebGL = (canvasElement, preferredVersion) => {
	const contextName = [null, "webgl", "webgl2"];
	// set the size of the drawingBuffer to include retina display level pixels (if exist),
	// the size can still change after, even with CSS, this only matters for getContext
	const devicePixelRatio = window.devicePixelRatio || 1;
	canvasElement.width = canvasElement.clientWidth * devicePixelRatio;
	canvasElement.height = canvasElement.clientHeight * devicePixelRatio;
	if (preferredVersion) {
		return ({
			gl: canvasElement.getContext(contextName[preferredVersion]),
			version: preferredVersion,
		});
	}
	// no user preference. attempt version 2, if fails, return version 1.
	const gl2 = canvasElement.getContext(contextName[2]);
	if (gl2) { return { gl: gl2, version: 2 }; }
	const gl1 = canvasElement.getContext(contextName[1]);
	if (gl1) { return { gl: gl1, version: 1 }; }
	throw new Error("WebGl not Supported");
};

export default initializeWebGL;
