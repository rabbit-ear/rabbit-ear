export function verticesFlatFoldabilityMaekawa({ edges_vertices, vertices_edges, edges_assignment, }: FOLD): number[];
export function verticesFlatFoldabilityKawasaki({ vertices_coords, vertices_vertices, vertices_edges, edges_vertices, edges_assignment, }: FOLD): number[];
export function verticesFlatFoldableMaekawa(graph: FOLD): boolean[];
export function verticesFlatFoldableKawasaki(graph: FOLD, epsilon?: number): boolean[];
export function verticesFlatFoldability(graph: FOLD, epsilon?: number): number[];
export function verticesFlatFoldable(graph: FOLD, epsilon?: number): boolean[];
