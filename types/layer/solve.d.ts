export function solveLayerOrders({ vertices_coords, edges_vertices, edges_faces, edges_assignment, edges_foldAngle, faces_vertices, faces_edges, faces_faces, edges_vector, }: FOLD, epsilon?: number): {
    orders: {
        [key: string]: number;
    };
    branches?: LayerBranch[];
    faces_winding: boolean[];
};
export function solveLayerOrdersSingleBranches({ vertices_coords, edges_vertices, edges_faces, edges_assignment, faces_vertices, faces_edges, edges_vector, }: FOLD, epsilon?: number): {
    orders: {};
    faces_winding: any[];
} | {
    faces_winding: boolean[];
    root: {
        [key: string]: number;
    };
    branches: {
        [key: string]: number;
    }[][];
    orders?: undefined;
};
export function solveLayerOrders3D({ vertices_coords, edges_vertices, edges_faces, edges_assignment, edges_foldAngle, faces_vertices, faces_edges, faces_faces, }: FOLD, epsilon?: number): {
    orders: {
        [key: string]: number;
    };
    branches?: LayerBranch[];
    faces_winding: boolean[];
};
export function solveFaceOrders(graph: FOLD, epsilon?: number): FaceOrdersSolverSolution;
export function solveFaceOrders3D(graph: FOLD, epsilon?: number): FaceOrdersSolverSolution;
