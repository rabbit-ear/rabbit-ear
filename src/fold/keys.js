/**
 * Rabbit Ear (c) Kraft
 */
/**
 * lists of keys and values involved in the FOLD file format spec
 * https://github.com/edemaine/FOLD/
 */
/**
 * @description All FOLD keys described in the spec,
 * sorted into descriptive categories.
 */
export const foldKeys = {
	file: [
		"file_spec",
		"file_creator",
		"file_author",
		"file_title",
		"file_description",
		"file_classes",
		"file_frames",
	],
	frame: [
		"frame_author",
		"frame_title",
		"frame_description",
		"frame_attributes",
		"frame_classes",
		"frame_unit",
		"frame_parent", // inside file_frames only
		"frame_inherit", // inside file_frames only
	],
	graph: [
		"vertices_coords",
		"vertices_vertices",
		"vertices_faces",
		"edges_vertices",
		"edges_faces",
		"edges_assignment",
		"edges_foldAngle",
		"edges_length",
		"faces_vertices",
		"faces_edges",
		// as of now, these are not described in the spec, but their behavior
		// can be inferred, except faces_faces which could be edge-adjacent or
		// face-adjacent. this library uses as EDGE-ADJACENT.
		"vertices_edges",
		"edges_edges",
		"faces_faces",
	],
	orders: [
		"edgeOrders",
		"faceOrders",
	],
};
/**
 * values from the official spec, grouped by the key under which they appear.
 */
/**
 * @description All "file_classes" values according to the FOLD spec
 */
export const foldFileClasses = [
	"singleModel",
	"multiModel",
	"animation",
	"diagrams",
];
/**
 * @description All "frame_classes" values according to the FOLD spec
 */
export const foldFrameClasses = [
	"creasePattern",
	"foldedForm",
	"graph",
	"linkage",
];
/**
 * @description All "frame_attributes" values according to the FOLD spec
 */
export const foldFrameAttributes = [
	"2D",
	"3D",
	"abstract",
	"manifold",
	"nonManifold",
	"orientable",
	"nonOrientable",
	"selfTouching",
	"nonSelfTouching",
	"selfIntersecting",
	"nonSelfIntersecting",
];
