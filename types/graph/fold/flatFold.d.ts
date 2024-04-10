export function getVerticesCollinearToLine({ vertices_coords }: {
    vertices_coords: any;
}, { vector, origin }: {
    vector: any;
    origin: any;
}, epsilon?: number): any;
export function getEdgesCollinearToLine({ vertices_coords, edges_vertices, vertices_edges }: FOLD, { vector, origin }: VecLine, epsilon?: number): number[];
export function flatFold(graph: object, { vector, origin }: number[], assignment?: string, epsilon?: number): object;
