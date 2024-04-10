export default planarize;
/**
 * @description Planarize a graph into the 2D XY plane, split edges, rebuild faces.
 * The graph provided as a method argument will be modified in place.
 * @algorithm
 * - create an axis-aligned bounding box of all the vertices.
 * - create unique lines that represent all edges, with a mapping of
 * edges to lines and visa-versa (one line to many edges. one edge to one line).
 * - intersect all lines against each other, reject those which lie outside
 * of the bounding box enclosing the entire graph.
 * - for each line, gather all edges, project each endpoint down to the line,
 * each edge is now two numbers (sort these).
 * - add the set of intersection points to this set, for each line.
 * - also, sort the larger array of values by their start points.
 * - walk down the line and group edges into connected edge groups.
 * groups join connected edges and separate them from the empty spaces between.
 * as we walk, if an intersection point is in the empty space, ignore it.
 * - build each group into a connected set of segments (optional challenge:
 * do this by re-using the vertices in place).
 * do this for every line.
 * - somehow we need to apply the edge-assignment/fold angle/possibly
 * other attributes.
 * - if lines overlap, competing assignments will need to be resolved:
 * M/V above all, then perhaps Cut/Join, then unassigned, then boundary/flat.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a summary of changes to the graph
 */
declare function planarize({ vertices_coords, edges_vertices, edges_assignment, edges_foldAngle, }: FOLD, epsilon?: number): object;
