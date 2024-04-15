export function makeVerticesToEdge({ edges_vertices }: FOLD, edges: any): {
    [key: string]: number;
};
export function makeVerticesToFace({ faces_vertices }: FOLD, faces: any): {
    [key: string]: number;
};
export function makeEdgesToFace({ faces_edges }: FOLD, faces: any): {
    [key: string]: number;
};
