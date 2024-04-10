export default countImplied;
/**
 * @description Get the number of vertices, edges, or faces in the graph, as
 * evidenced by their appearance in other arrays; ie: searching faces_vertices
 * for the largest vertex index, and inferring number of vertices is that long.
 * @param {FOLD} graph a FOLD object
 * @param {string} key the prefix for a key, eg: "vertices"
 * @returns {number} the number of vertices, edges, or faces in the graph.
 */
declare function countImplied(graph: FOLD, key: string): number;
declare namespace countImplied {
    /**
     * @param {FOLD} graph a FOLD object
     * @returns {number} the number of components
     */
    function vertices(graph: FOLD): number;
    /**
     * @param {FOLD} graph a FOLD object
     * @returns {number} the number of components
     */
    function edges(graph: FOLD): number;
    /**
     * @param {FOLD} graph a FOLD object
     * @returns {number} the number of components
     */
    function faces(graph: FOLD): number;
}
