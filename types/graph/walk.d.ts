export function walkSingleFace({ vertices_vertices, vertices_sectors }: FOLD, vertex0: number, vertex1: number, walkedEdges?: object): {
    vertices: number[];
    edges: string[];
    angles?: number[];
} | undefined;
export function walkPlanarFaces({ vertices_vertices, vertices_sectors }: FOLD): {
    vertices: number[];
    edges: string[];
    angles?: number[];
}[];
export function filterWalkedBoundaryFace(walkedFaces: {
    vertices: number[];
    edges: string[];
    angles?: number[];
}[]): {
    vertices: number[];
    edges: string[];
    angles?: number[];
}[];
