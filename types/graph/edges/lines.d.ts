export function edgeToLine2({ vertices_coords, edges_vertices }: FOLD, edge: number): VecLine2;
export function edgeToLine({ vertices_coords, edges_vertices }: FOLD, edge: number): VecLine;
export function edgesToLines2({ vertices_coords, edges_vertices }: FOLD): VecLine2[];
export function edgesToLines({ vertices_coords, edges_vertices }: FOLD): (VecLine2 | VecLine3)[];
export function getEdgesLine({ vertices_coords, edges_vertices }: FOLD, epsilon?: number): {
    lines: VecLine[];
    edges_line: number[];
};
