export function makeEdgesBoundingBox({ vertices_coords, edges_vertices, edges_coords, }: FOLD, epsilon?: number): object[];
export function getEdgesEdgesOverlapingSpans({ vertices_coords, edges_vertices, edges_coords, }: FOLD, epsilon?: number): boolean[][];
export function makeEdgesEdgesIntersection({ vertices_coords, edges_vertices, edges_vector, edges_origin, }: FOLD, epsilon?: number): number[][][];
export default planarize;
/**
 * @description Planarize a graph into the 2D XY plane, split edges, rebuild faces.
 * The graph provided as a method argument will be modified in place.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a summary of changes to the graph
 */
declare function planarize(graph: FOLD, epsilon?: number): object;
