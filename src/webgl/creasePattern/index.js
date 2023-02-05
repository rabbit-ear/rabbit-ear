/**
 * Rabbit Ear (c) Kraft
 */
import {
	cpFacesV1,
	cpEdgesV1,
	cpFacesV2,
	cpEdgesV2,
} from "./programs.js";

const WebGLCreasePattern = (gl, version = 1, graph = {}) => {
	switch (version) {
	case 1:
		return [cpFacesV1(gl, version, graph), cpEdgesV1(gl, version, graph)];
	case 2:
	default:
		return [cpFacesV2(gl, version, graph), cpEdgesV2(gl, version, graph)];
	}
};

export default WebGLCreasePattern;
