export function edgeToLine({ vertices_coords, edges_vertices }: FOLD, edge: number): VecLine;
export function getEdgesLine({ vertices_coords, edges_vertices }: FOLD, epsilon?: number): {
    lines: VecLine[];
    edges_line: number[];
};
