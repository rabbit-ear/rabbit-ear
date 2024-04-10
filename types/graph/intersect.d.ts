export function intersectLineVertices({ vertices_coords }: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, epsilon?: number): (number | undefined)[];
export function intersectLineVerticesEdges({ vertices_coords, edges_vertices }: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, epsilon?: number): {
    vertices: (number | undefined)[];
    edges: (object | undefined)[];
};
export function intersectLine({ vertices_coords, edges_vertices, faces_vertices, faces_edges }: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, epsilon?: number): {
    vertices: number[];
    edges: (object | undefined)[];
    faces: (object | undefined)[];
};
export function intersectLineAndPoints({ vertices_coords, edges_vertices, faces_vertices, faces_edges }: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, interiorPoints?: number[][], epsilon?: number): {
    vertices: number[];
    edges: (object | undefined)[];
    faces: (object | undefined)[];
};
export function filterCollinearFacesData({ edges_vertices }: FOLD, { vertices, faces }: object): void;
