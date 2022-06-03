/**
 * Rabbit Ear (c) Kraft
 */
import {
	get_duplicate_edges,
	get_circular_edges
} from "./edges_violations";
import {
	get_duplicate_vertices,
	get_isolated_vertices,
} from "./vertices_violations";
import count from "./count";
import count_implied from "./count_implied";

// import get_vertices_edges_overlap from "./vertices_edges_overlap";

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
		vertices: count_implied.vertices(graph),
		edges: count_implied.edges(graph),
		faces: count_implied.faces(graph),
	};
	return {
		vertices: counts.vertices >= implied.vertices,
		edges: counts.edges >= implied.edges,
		faces: counts.faces >= implied.faces,
	}
};

const validate = (graph, epsilon) => {
	const duplicate_edges = get_duplicate_edges(graph);
	const circular_edges = get_circular_edges(graph);
	const isolated_vertices = get_isolated_vertices(graph);
	const duplicate_vertices = get_duplicate_vertices(graph, epsilon);
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
		}
	};
};

export default validate;
