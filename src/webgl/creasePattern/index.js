/**
 * Rabbit Ear (c) Kraft
 */
import {
	cpFacesV1,
	cpEdgesV1,
	cpFacesV2,
	cpEdgesV2,
} from "./programs.js";

const WebGLCreasePattern = (gl, version = 1, graph = {}, options) => {
	switch (version) {
	case 1:
		return [cpFacesV1(gl, graph), cpEdgesV1(gl, graph, options)];
	case 2:
	default:
		return [cpFacesV2(gl, graph), cpEdgesV2(gl, graph, options)];
	}
};

export default WebGLCreasePattern;
