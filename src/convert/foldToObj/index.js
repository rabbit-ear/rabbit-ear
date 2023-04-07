/**
 * Rabbit Ear (c) Kraft
 */
const getMetadata = (graph) => {
	const metadata = [
		"file_title",
		"file_author",
		"file_description",
		"frame_title",
		"frame_author",
		"frame_description",
	];
	return metadata
		.filter(key => graph[key])
		.map(key => `# ${key.split("_")[1]}: ${graph[key]}`)
		.join("\n");
};
/**
 * @description Convert a FOLD object into an OBJ file. For FOLD objects
 * with many frames, this will only work on one frame at a time.
 * @param {FOLD|string} file a FOLD object
 * @param {number} frame_num the frame number inside the FOLD object to be
 * converted, if frames exist, if not this is ignored.
 * @returns {string} an OBJ representation of the FOLD object
 * @linkcode Origami ./src/convert/obj.js 77
 */
const foldToObj = (file) => {
	const graph = typeof file === "string" ? JSON.parse(file) : file;
	const metadata = getMetadata(graph);
	const vertices = (graph.vertices_coords || [])
		.map(coords => coords.join(" "))
		.map(str => `v ${str}`)
		.join("\n");
	// obj vertex indices begin from 1 not 0
	const faces = (graph.faces_vertices || [])
		.map(verts => verts.map(v => v + 1).join(" "))
		.map(str => `f ${str}`)
		.join("\n");
	const fileString = [metadata, vertices, faces]
		.filter(s => s !== "")
		.join("\n");
	return `${fileString}\n`;
};

export default foldToObj;
