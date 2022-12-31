import {
	foldedFormFaces,
	foldedFormEdges,
	foldedFormFacesOutlined,
} from "./programs";

const WebGLFoldedForm = (gl, version = 1, graph = {}, options = {}) => {
	const programs = [];
	// either Faces, or FacesOutlined
	if (options.outlines === false) {
		programs.push(foldedFormFaces(gl, version, graph, options));
	} else {
		programs.push(foldedFormFacesOutlined(gl, version, graph, options));
	}
	// if edges option is on, also add thick edges
	if (options.edges === true) {
		programs.push(foldedFormEdges(gl, version, graph, options));
	}
	// console.log("programs", programs);
	return programs;
};

export default WebGLFoldedForm;