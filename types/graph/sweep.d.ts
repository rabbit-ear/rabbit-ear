export function sweepVertices({ vertices_coords }: FOLD, axis?: number, epsilon?: number): {
    t: number;
    vertices: number[];
}[];
export function sweepValues({ edges_vertices, vertices_edges }: FOLD, values: number[], epsilon?: number): SweepEvent[];
export function sweepEdges({ vertices_coords, edges_vertices, vertices_edges }: FOLD, axis?: number, epsilon?: number): SweepEvent[];
export function sweepFaces({ vertices_coords, faces_vertices }: FOLD, axis?: number, epsilon?: number): SweepEvent[];
export function sweep({ vertices_coords, edges_vertices, faces_vertices, }: FOLD, axis?: number, epsilon?: number): {
    vertices: number[];
    t: number;
    edges: {
        start: number[];
        end: number[];
    };
    faces: {
        start: number[];
        end: number[];
    };
}[];
