/**
 * Rabbit Ear (c) Kraft
 */

/**
 * @description if they exist, get any title, author, or description
 * metadata, convert it into a python-style comment (with a #) and
 * join all of them together as one string.
 * @returns {string} a string of comments containing metadata
 */
const getTitleAuthorDescription = (graph) => [
	"file_title",
	"file_author",
	"file_description",
	"frame_title",
	"frame_author",
	"frame_description",
].filter(key => graph[key])
	.map(key => `# ${key.split("_")[1]}: ${graph[key]}`)
	.join("\n");

/**
 * @description Convert a FOLD object into an OBJ file. For FOLD objects
 * with many frames, this will only work on one frame at a time.
 * @param {FOLD|string} file a FOLD object
 * @param {number} frame_num the frame number inside the FOLD object to be
 * converted, if frames exist, if not this is ignored.
 * @returns {string} an OBJ representation of the FOLD object
 */
const foldToObj = (file) => {
	const graph = typeof file === "string" ? JSON.parse(file) : file;

	// the comment section that will sit at the beginning of the file
	const metadata = getTitleAuthorDescription(graph);

	// a list of vertices in the form of "v _ _ _" where _ are floats
	const vertices = (graph.vertices_coords || [])
		.map(coords => coords.join(" "))
		.map(str => `v ${str}`)
		.join("\n");

	// a list of faces in the form of "f _ _ _" where _ are integers
	// obj vertex indices begin from 1 not 0
	const faces = (graph.faces_vertices || [])
		.map(verts => verts.map(v => v + 1).join(" "))
		.map(str => `f ${str}`)
		.join("\n");

	// join everything together, adding a final newline at the file's end
	const fileString = [metadata, vertices, faces]
		.filter(s => s !== "")
		.join("\n");
	return `${fileString}\n`;
};

export default foldToObj;
