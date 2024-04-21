export default layerExport;
declare const layerExport: ((graph: FOLD, epsilon?: number) => {
    count: (this: LayerFork) => any;
    structure: (this: LayerFork) => any;
    leaves: (this: LayerFork) => any;
    gather: (this: LayerFork, ...pattern: number[]) => any;
    gatherAll: (this: LayerFork) => {
        [key: string]: number;
    }[][];
    compile: (this: LayerFork, ...pattern: number[]) => any;
    compileAll: (this: LayerFork) => {
        [key: string]: number;
    }[][];
    faceOrders: (this: LayerFork, ...pattern: number[]) => any;
}) & {
    layer3D: (graph: FOLD, epsilon?: number) => {
        count: (this: LayerFork) => any;
        structure: (this: LayerFork) => any;
        leaves: (this: LayerFork) => any;
        gather: (this: LayerFork, ...pattern: number[]) => any;
        gatherAll: (this: LayerFork) => {
            [key: string]: number;
        }[][];
        compile: (this: LayerFork, ...pattern: number[]) => any;
        compileAll: (this: LayerFork) => {
            [key: string]: number;
        }[][];
        faceOrders: (this: LayerFork, ...pattern: number[]) => any;
    };
    makeTransitivity: ({ faces_polygon }: FOLD, facesFacesOverlap: number[][], epsilon?: number) => TransitivityConstraint[];
    getTransitivityTriosFromTacos: ({ taco_taco, taco_tortilla }: {
        taco_taco: TacoTacoConstraint[];
        taco_tortilla: TacoTortillaConstraint[];
    }) => {
        [key: string]: boolean;
    };
    makeTortillaTortillaFacesCrossing: (edges_faces: number[][], edgesFacesSide: number[][], edgesFacesOverlap: number[][]) => TortillaTortillaConstraint[];
    makeTacosAndTortillas: ({ vertices_coords, edges_vertices, edges_faces, faces_vertices, faces_edges, faces_center, }: FOLD, epsilon?: number) => {
        taco_taco: TacoTacoConstraint[];
        taco_tortilla: TacoTortillaConstraint[];
        tortilla_tortilla: TortillaTortillaConstraint[];
    };
    table: {
        taco_taco: {
            [key: string]: Readonly<boolean | [number, number]>;
        };
        taco_tortilla: {
            [key: string]: Readonly<boolean | [number, number]>;
        };
        tortilla_tortilla: {
            [key: string]: Readonly<boolean | [number, number]>;
        };
        transitivity: {
            [key: string]: Readonly<boolean | [number, number]>;
        };
    };
    solver: ({ constraints, lookup, facePairs, orders }: {
        constraints: {
            taco_taco: TacoTacoConstraint[];
            taco_tortilla: TacoTortillaConstraint[];
            tortilla_tortilla: TortillaTortillaConstraint[];
            transitivity: TransitivityConstraint[];
        };
        lookup: {
            taco_taco: number[][];
            taco_tortilla: number[][];
            tortilla_tortilla: number[][];
            transitivity: number[][];
        };
        facePairs: string[];
        orders: {
            [key: string]: number;
        };
    }) => LayerFork;
    solveLayerOrders: ({ vertices_coords, edges_vertices, edges_faces, edges_assignment, edges_foldAngle, faces_vertices, faces_edges, faces_faces, edges_vector, }: FOLD, epsilon?: number) => {
        orders: {
            [key: string]: number;
        };
        branches?: LayerBranch[];
        faces_winding: boolean[];
    };
    solveLayerOrdersSingleBranches: ({ vertices_coords, edges_vertices, edges_faces, edges_assignment, faces_vertices, faces_edges, edges_vector, }: FOLD, epsilon?: number) => {
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
    solveLayerOrders3D: ({ vertices_coords, edges_vertices, edges_faces, edges_assignment, edges_foldAngle, faces_vertices, faces_edges, faces_faces, }: FOLD, epsilon?: number) => {
        orders: {
            [key: string]: number;
        };
        branches?: LayerBranch[];
        faces_winding: boolean[];
    };
    solveFaceOrders: (graph: FOLD, epsilon?: number) => FaceOrdersFork;
    solveFaceOrders3D: (graph: FOLD, epsilon?: number) => FaceOrdersFork;
    getBranchStructure: ({ branches }: LayerFork) => any;
    gather: ({ orders, branches }: LayerFork, pattern?: number[]) => any;
    compile: ({ orders, branches }: LayerFork, pattern?: number[]) => any;
    gatherAll: ({ orders, branches }: LayerFork) => {
        [key: string]: number;
    }[][];
    compileAll: ({ orders, branches }: LayerFork) => {
        [key: string]: number;
    }[][];
    LayerPrototype: {
        count: (this: LayerFork) => any;
        structure: (this: LayerFork) => any;
        leaves: (this: LayerFork) => any;
        gather: (this: LayerFork, ...pattern: number[]) => any;
        gatherAll: (this: LayerFork) => {
            [key: string]: number;
        }[][];
        compile: (this: LayerFork, ...pattern: number[]) => any;
        compileAll: (this: LayerFork) => {
            [key: string]: number;
        }[][];
        faceOrders: (this: LayerFork, ...pattern: number[]) => any;
    };
    solveFlatAdjacentEdges: ({ edges_faces, edges_assignment }: FOLD, faces_winding: boolean[]) => {
        [key: string]: number;
    };
    tacoTypeNames: string[];
    emptyCategoryObject: () => {
        taco_taco: any;
        taco_tortilla: any;
        tortilla_tortilla: any;
        transitivity: any;
    };
    constraintToFacePairs: {
        taco_taco: (f: TacoTacoConstraint) => [number, number][];
        taco_tortilla: (f: TacoTortillaConstraint) => [number, number][];
        tortilla_tortilla: (f: TortillaTortillaConstraint) => [number, number][];
        transitivity: (f: TransitivityConstraint) => [number, number][];
    };
    constraintToFacePairsStrings: {
        taco_taco: (f: TacoTacoConstraint) => string[];
        taco_tortilla: (f: TacoTortillaConstraint) => string[];
        tortilla_tortilla: (f: TortillaTortillaConstraint) => string[];
        transitivity: (f: TransitivityConstraint) => string[];
    };
    solverSolutionToFaceOrders: (facePairOrders: any, faces_winding: boolean[]) => [number, number, number][];
    mergeWithoutOverwrite: (orders: {
        [key: string]: number;
    }[]) => {
        [key: string]: number;
    };
    makeEdgesFacesSide: ({ vertices_coords, edges_vertices, edges_faces, faces_center, }: FOLD) => number[][];
    makeEdgePairsFacesSide: ({ vertices_coords, edges_vertices, edges_faces, faces_center }: FOLD, edgePairs: [number, number][]) => [[number, number], [number, number]][];
    makeEdgesFacesSide2D: ({ vertices_coords, edges_faces, faces_vertices, faces_center }: FOLD, { lines, edges_line }: {
        lines: VecLine[];
        edges_line: number[];
        faces_plane: number[];
        planes_transform: number[][];
    }) => number[][];
    makeEdgesFacesSide3D: ({ vertices_coords, edges_faces, faces_vertices, faces_center }: FOLD, { lines, edges_line, planes_transform, faces_plane }: {
        lines: VecLine[];
        edges_line: number[];
        faces_plane: number[];
        planes_transform: number[][];
    }) => number[][];
    makeConstraintsLookup: (constraints: {
        taco_taco: TacoTacoConstraint[];
        taco_tortilla: TacoTortillaConstraint[];
        tortilla_tortilla: TortillaTortillaConstraint[];
        transitivity: TransitivityConstraint[];
    }) => {
        taco_taco: number[][];
        taco_tortilla: number[][];
        tortilla_tortilla: number[][];
        transitivity: number[][];
    };
    makeSolverConstraintsFlat: ({ vertices_coords, edges_vertices, edges_faces, edges_assignment, faces_vertices, faces_edges, faces_center, }: FOLD, epsilon?: number) => {
        constraints: {
            taco_taco: TacoTacoConstraint[];
            taco_tortilla: TacoTortillaConstraint[];
            tortilla_tortilla: TortillaTortillaConstraint[];
            transitivity: TransitivityConstraint[];
        };
        lookup: {
            taco_taco: number[][];
            taco_tortilla: number[][];
            tortilla_tortilla: number[][];
            transitivity: number[][];
        };
        facePairs: string[];
        faces_winding: boolean[];
        orders: {
            [key: string]: number;
        };
    };
    getOverlapFacesWith3DEdge: ({ edges_faces }: FOLD, { clusters_graph, faces_plane }: {
        clusters_graph: FOLD[];
        faces_plane: number[];
    }, epsilon?: number) => {
        edge: number;
        tortilla: number;
        coplanar: number;
        angled: number;
    }[];
    solveOverlapFacesWith3DEdge: ({ edges_foldAngle }: FOLD, edgeFace3DOverlaps: {
        edge: number;
        tortilla: number;
        coplanar: number;
        angled: number;
    }[], faces_winding: boolean[]) => {
        [key: string]: number;
    };
    solveFacePair3D: ({ edges_foldAngle, faces_winding }: {
        edges_foldAngle: number[];
        faces_winding: boolean[];
    }, edges: number[], faces: number[]) => {
        [key: string]: number;
    };
    getSolvable3DEdgePairs: ({ edges_faces, faces_plane, edgePairs, facesFacesLookup, }: {
        edges_faces: number[][];
        edgePairs: [number, number][];
        faces_plane: number[];
        facesFacesLookup: boolean[][];
    }) => {
        tJunctions: number[];
        yJunctions: number[];
        bentFlatTortillas: number[];
        bentTortillas: number[];
        bentTortillasFlatTaco: number[];
    };
    constraints3DEdges: ({ vertices_coords, edges_vertices, edges_faces, edges_foldAngle, }: FOLD, { faces_plane, faces_winding, facesFacesOverlap, }: {
        faces_plane: number[];
        faces_winding: boolean[];
        facesFacesOverlap: number[][];
    }, epsilon?: number) => {
        orders: {
            [key: string]: number;
        };
        taco_tortilla: TacoTortillaConstraint[];
        tortilla_tortilla: TortillaTortillaConstraint[];
    };
    constraints3DFaceClusters: ({ vertices_coords, edges_vertices, edges_faces, edges_assignment, edges_foldAngle, faces_vertices, faces_edges, faces_faces, }: FOLD, epsilon?: number) => {
        planes_transform: number[][];
        faces_plane: number[];
        faces_cluster: number[];
        faces_winding: boolean[];
        faces_polygon: [number, number][][];
        faces_center: [number, number][];
        clusters_faces: number[][];
        clusters_graph: FOLD[];
        clusters_transform: number[][];
        facesFacesOverlap: number[][];
        facePairs: string[];
    };
    makeSolverConstraints3D: ({ vertices_coords, edges_vertices, edges_faces, edges_assignment, edges_foldAngle, faces_vertices, faces_edges, faces_faces, }: FOLD, epsilon?: number) => {
        constraints: {
            taco_taco: TacoTacoConstraint[];
            taco_tortilla: TacoTortillaConstraint[];
            tortilla_tortilla: TortillaTortillaConstraint[];
            transitivity: TransitivityConstraint[];
        };
        lookup: {
            taco_taco: number[][];
            taco_tortilla: number[][];
            tortilla_tortilla: number[][];
            transitivity: number[][];
        };
        facePairs: string[];
        faces_winding: boolean[];
        orders: {
            [key: string]: number;
        };
    };
};
