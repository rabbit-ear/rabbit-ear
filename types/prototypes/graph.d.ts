export default Graph.prototype;
declare var prototype: any;
declare class Graph {
    private constructor();
    /**
     * @returns {FOLD} a deep copy of this object
     */
    clone(): FOLD;
    /**
     * @description convert a graph into a planar graph.
     * the core "planarize" method normally does not modify the input object,
     * in this case, the object itself is modified in place.
     */
    planarize(): any;
    /**
     * @description this clears all components from the graph,
     * leaving metadata and other keys untouched.
     */
    clear(): any;
    /**
     * @description return a shallow copy of this graph with the vertices folded.
     * This method works for both 2D and 3D origami.
     * The angle of the fold is searched for in this order:
     * - faces_matrix2 if it exists
     * - edges_foldAngle if it exists
     * - edges_assignment if it exists
     * Repeated calls to this method will repeatedly fold the vertices
     * resulting in a behavior that is surely unintended.
     */
    folded(...args: any[]): any;
    /**
     * @description return a copy of this graph with the vertices folded.
     * This method will work for 2D only.
     * The angle of the fold is searched for in this order:
     * - faces_matrix2 if it exists
     * - edges_assignment or edges_foldAngle if it exists
     * If neither exists, this method will assume that ALL edges are flat-folded.
     */
    flatFolded(...args: any[]): any;
}
//# sourceMappingURL=graph.d.ts.map