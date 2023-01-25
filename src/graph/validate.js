/**
 * Rabbit Ear (c) Kraft
 */
import {
	duplicateEdges,
	circularEdges,
} from "./edgesViolations";
import {
	duplicateVertices,
	isolatedVertices,
} from "./verticesViolations";
import count from "./count";
import countImplied from "./countImplied";

// import getVerticesEdgesOverlap from "./vertices_edges_overlap";

/**
 * @description iterate over all graph cross-references between vertices,
 * edges, and faces, and, instead of checking if each index exists,
 * (which would be nice), do the faster operation of simply checking
 * if the largest reference is out of bounds of the component array length.
 * @returns {boolean} true if all references are valid within bounds.
 */
const validate_references = (graph) => {
	const counts = {
		vertices: count.vertices(graph),
		edges: count.edges(graph),
		faces: count.faces(graph),
	};
	const implied = {
		vertices: countImplied.vertices(graph),
		edges: countImplied.edges(graph),
		faces: countImplied.faces(graph),
	};
	return {
		vertices: counts.vertices >= implied.vertices,
		edges: counts.edges >= implied.edges,
		faces: counts.faces >= implied.faces,
	};
};
/**
 * @description Validate a graph, get back a report on its duplicate/circular components.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a report on the validity state of the graph. a "summary" string,
 * and "vertices" "edges" and "faces" information
 * @linkcode Origami ./src/graph/validate.js 47
 */
const validate = (graph, epsilon) => {
	const duplicate_edges = duplicateEdges(graph);
	const circular_edges = circularEdges(graph);
	const isolated_vertices = isolatedVertices(graph);
	const duplicate_vertices = duplicateVertices(graph, epsilon);
	const references = validate_references(graph);
	const is_perfect = duplicate_edges.length === 0
		&& circular_edges.length === 0
		&& isolated_vertices.length === 0
		&& references.vertices && references.edges && references.faces;
		// && more..?
	const summary = is_perfect ? "valid" : "problematic";
	return {
		summary,
		vertices: {
			isolated: isolated_vertices,
			duplicate: duplicate_vertices,
			references: references.vertices,
		},
		edges: {
			circular: circular_edges,
			duplicate: duplicate_edges,
			references: references.edges,
		},
		faces: {
			references: references.faces,
		},
	};
};

export default validate;
