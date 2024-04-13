export function getVerticesCollinearToLine({ vertices_coords }: {
    vertices_coords: any;
}, { vector, origin }: {
    vector: any;
    origin: any;
}, epsilon?: number): any;
export function getEdgesCollinearToLine({ vertices_coords, edges_vertices, vertices_edges }: FOLD, { vector, origin }: VecLine, epsilon?: number): number[];
export function flatFold(graph: FOLD & {
    faces_matrix2: number[][];
    faces_winding: boolean[];
    faces_crease: VecLine2[];
    faces_side: boolean[];
}, { vector, origin }: VecLine2, assignment?: string, epsilon?: number): object;
