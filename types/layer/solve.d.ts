export function solveLayerOrders({ vertices_coords, edges_vertices, edges_faces, edges_assignment, edges_foldAngle, faces_vertices, faces_edges, faces_faces, edges_vector, }: FOLD, epsilon?: number): {
    orders: {
        [key: string]: number;
    };
    branches: {
        [key: string]: number;
    }[][];
    faces_winding: boolean[];
};
export function solveFaceOrders(graph: any, epsilon: any): {
    orders: number[][];
    branches?: undefined;
} | {
    orders: number[][];
    branches: any;
};
export function solveLayerOrdersSingleBranches({ vertices_coords, edges_vertices, edges_faces, edges_assignment, faces_vertices, faces_edges, edges_vector, }: {
    vertices_coords: any;
    edges_vertices: any;
    edges_faces: any;
    edges_assignment: any;
    faces_vertices: any;
    faces_edges: any;
    edges_vector: any;
}, epsilon: any): {
    faces_winding: boolean[];
    root: {
        [key: string]: number;
    };
    branches: {
        [key: string]: number;
    }[][];
};
export function solveLayerOrders3D({ vertices_coords, edges_vertices, edges_faces, edges_assignment, edges_foldAngle, faces_vertices, faces_edges, faces_faces, }: FOLD, epsilon?: number): {
    orders: {
        [key: string]: number;
    };
    branches: {
        [key: string]: number;
    }[][];
    faces_winding: boolean[];
};
export function solveFaceOrders3D(graph: any, epsilon: any): {
    orders: number[][];
    branches?: undefined;
} | {
    orders: number[][];
    branches: any;
};
