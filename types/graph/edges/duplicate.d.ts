export function duplicateEdges({ edges_vertices }: FOLD): number[];
export function getSimilarEdges({ vertices_coords, vertices_edges, edges_vertices }: FOLD, epsilon?: number): number[][];
export function removeDuplicateEdges(graph: FOLD, replace_indices?: number[]): {
    remove: number[];
    map: number[];
};
//# sourceMappingURL=duplicate.d.ts.map