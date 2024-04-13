declare const _default: {
    count: {
        (graph: FOLD, key: string): number;
        vertices({ vertices_coords, vertices_faces, vertices_vertices }: FOLD): number;
        edges({ edges_vertices, edges_faces }: FOLD): number;
        faces({ faces_vertices, faces_edges, faces_faces }: FOLD): number;
    };
    countImplied: {
        (graph: FOLD, key: string): number;
        vertices(graph: FOLD): number;
        edges(graph: FOLD): number;
        faces(graph: FOLD): number;
    };
    clean: (graph: FOLD, epsilon?: number) => any;
    populate: (graph: FOLD, options?: any) => FOLD;
    remove: (graph: FOLD, key: string, removeIndices: number[]) => number[];
    replace: (graph: FOLD, key: string, replaceIndices: number[]) => number[];
    normalize: (graph: FOLD) => FOLD;
    planarize: ({ vertices_coords, edges_vertices, edges_assignment, edges_foldAngle, }: FOLD, epsilon?: number) => FOLD;
    validateVerticesWinding: ({ vertices_vertices, vertices_edges, vertices_faces, edges_vertices, faces_vertices, faces_edges, }: FOLD) => string[];
    validate: (graph: FOLD) => string[];
    walkSingleFace: ({ vertices_vertices, vertices_sectors }: FOLD, vertex0: number, vertex1: number, walkedEdges?: any) => {
        vertices: number[];
        edges: string[];
        angles?: number[];
    };
    walkPlanarFaces: ({ vertices_vertices, vertices_sectors }: FOLD) => {
        vertices: number[];
        edges: string[];
        angles?: number[];
    }[];
    filterWalkedBoundaryFace: (walkedFaces: {
        vertices: number[];
        edges: string[];
        angles?: number[];
    }[]) => {
        vertices: number[];
        edges: string[];
        angles?: number[];
    }[];
    triangulateConvexFacesVertices: ({ faces_vertices }: FOLD) => number[][];
    triangulateNonConvexFacesVertices: ({ vertices_coords, faces_vertices }: FOLD, earcut: any) => number[][];
    triangulate: (graph: FOLD, earcut: any) => any;
    minimumSpanningTrees: (array_array?: number[][], rootIndices?: number[]) => trees.BreadthFirstTreeNode[][][];
    unitize: (graph: FOLD) => FOLD;
    translate2: (graph: FOLD, translation: [number, number] | [number, number, number]) => FOLD;
    translate3: (graph: FOLD, translation: [number, number] | [number, number, number]) => FOLD;
    translate: (graph: FOLD, translation: [number, number] | [number, number, number]) => FOLD;
    scaleUniform2: (graph: FOLD, scaleAmount?: number, origin?: [number, number] | [number, number, number]) => FOLD;
    scaleUniform3: (graph: FOLD, scaleAmount?: number, origin?: [number, number] | [number, number, number]) => FOLD;
    scaleUniform: (graph: FOLD, scaleAmount?: number, origin?: [number, number] | [number, number, number]) => FOLD;
    scale2: (graph: FOLD, scaleAmounts?: [number, number] | [number, number, number], origin?: [number, number] | [number, number, number]) => FOLD;
    scale3: (graph: FOLD, scaleAmounts?: [number, number] | [number, number, number], origin?: [number, number] | [number, number, number]) => FOLD;
    scale: (graph: FOLD, scaleAmounts?: [number, number] | [number, number, number], origin?: [number, number] | [number, number, number]) => FOLD;
    transform: ({ vertices_coords }: FOLD, matrix: number[]) => [number, number] | [number, number, number][];
    rotate: (graph: FOLD, angle: number, vector?: number[], origin?: number[]) => FOLD;
    rotateX: (graph: FOLD, angle: number, origin?: number[]) => FOLD;
    rotateY: (graph: FOLD, angle: number, origin?: number[]) => FOLD;
    rotateZ: (graph: FOLD, angle: number, origin?: number[]) => FOLD;
    transferPointInFaceBetweenGraphs: (from: FOLD, to: FOLD, face: number, point: [number, number]) => [number, number];
    sweepVertices: ({ vertices_coords }: FOLD, axis?: number, epsilon?: number) => {
        t: number;
        vertices: number[];
    }[];
    sweepValues: ({ edges_vertices, vertices_edges }: FOLD, values: number[], epsilon?: number) => SweepEvent[];
    sweepEdges: ({ vertices_coords, edges_vertices, vertices_edges }: FOLD, axis?: number, epsilon?: number) => SweepEvent[];
    sweepFaces: ({ vertices_coords, faces_vertices }: FOLD, axis?: number, epsilon?: number) => SweepEvent[];
    sweep: ({ vertices_coords, edges_vertices, faces_vertices, }: FOLD, axis?: number, epsilon?: number) => {
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
    selfRelationalArraySubset: (array_array: number[][], indices: number[]) => number[][];
    subgraphExclusive: (graph: FOLD, indicesToKeep?: any) => FOLD;
    subgraph: (graph: FOLD, indicesToKeep?: any) => FOLD;
    subgraphWithFaces: (graph: FOLD, faces: number[]) => FOLD;
    subgraphWithVertices: (graph: any, vertices?: any[]) => FOLD;
    splitGraphWithLineAndPoints: (graph: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, interiorPoints?: [number, number][], epsilon?: number) => any;
    splitGraphWithLine: (graph: FOLD, line: VecLine2, epsilon?: number) => any;
    splitGraphWithRay: (graph: FOLD, ray: VecLine2, epsilon?: number) => any;
    splitGraphWithSegment: (graph: FOLD, segment: [number, number][], epsilon?: number) => any;
    splitLineToSegments: ({ vertices_coords, edges_vertices, faces_vertices, faces_edges }: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, interiorPoints?: [number, number][], epsilon?: number) => {
        vertices: number[];
        edges: any[];
        faces: any[];
        segments: {
            vertices: any[];
        };
    };
    splitLineIntoEdges: ({ vertices_coords, edges_vertices, faces_vertices, faces_edges }: FOLD, line: VecLine2, lineDomain?: Function, interiorPoints?: [number, number][], epsilon?: number) => {
        vertices?: number[];
        edges_vertices?: number[][];
        edges_collinear?: boolean[];
        edges_face?: number[][];
    };
    cutFaceToVertex: (graph: any, face: any, vertexFace: any, vertexLeaf: any, assignment?: string, foldAngle?: number) => {
        edge: number;
        faces: {};
    };
    cutFaceToPoint: (graph: any, face: any, vertex: any, point: any, assignment?: string, foldAngle?: number) => {
        edge: number;
        faces: {};
    };
    splitFaceWithEdge: (graph: FOLD, face: number, vertices: number[], assignment?: string, foldAngle?: number) => any;
    splitFace: (graph: FOLD, face: number, vertices: number[], assignment?: string, foldAngle?: number) => any;
    splitEdge: (graph: FOLD, oldEdge: number, coords?: number[]) => any;
    pleat: ({ vertices_coords, edges_vertices }: FOLD, lineA: VecLine2, lineB: VecLine2, count: number, epsilon?: number) => [[number, number], [number, number]][][];
    pleatEdges: ({ vertices_coords, edges_vertices }: FOLD, edgeA: number, edgeB: number, count: number, epsilon?: number) => number[][][][];
    getFacesFacesOverlap: ({ vertices_coords, faces_vertices, }: FOLD, epsilon?: number) => number[][];
    getEdgesEdgesCollinearOverlap: ({ vertices_coords, edges_vertices, }: FOLD, epsilon?: number) => number[][];
    getOverlappingComponents: ({ vertices_coords, edges_vertices, faces_vertices, }: FOLD, epsilon?: number) => {
        verticesVertices: boolean[][];
        verticesEdges: boolean[][];
        edgesEdges: boolean[][];
        facesVertices: boolean[][];
    };
    getFacesEdgesOverlap: ({ vertices_coords, edges_vertices, faces_vertices, faces_edges, }: FOLD, epsilon?: number) => number[][];
    getEdgesFacesOverlap: ({ vertices_coords, edges_vertices, faces_vertices, faces_edges, }: FOLD, epsilon?: number) => number[][];
    faceOrdersSubset: (faceOrders: [number, number, number][], faces: number[]) => [number, number, number][];
    linearizeFaceOrders: ({ faceOrders, faces_normal }: FOLD, rootFace: any) => number[];
    linearize2DFaces: ({ vertices_coords, faces_vertices, faceOrders, faces_layer, faces_normal, }: FOLD, rootFace: any) => number[];
    nudgeFacesWithFaceOrders: ({ vertices_coords, faces_vertices, faceOrders, faces_normal, }: FOLD) => any[];
    nudgeFacesWithFacesLayer: ({ faces_layer }: FOLD) => any[];
    makeFacesLayer: ({ vertices_coords, faces_vertices, faceOrders, faces_normal }: any) => number[];
    flipFacesLayer: (faces_layer: number[]) => number[];
    makeFacesNormal: ({ vertices_coords, faces_vertices }: FOLD) => [number, number, number][];
    makeVerticesNormal: ({ vertices_coords, faces_vertices, faces_normal }: FOLD) => number[][];
    nearestVertex: ({ vertices_coords }: FOLD, point: number[]) => number;
    nearestEdge: ({ vertices_coords, edges_vertices }: FOLD, point: number[]) => number;
    nearestFace: (graph: FOLD, point: [number, number]) => number;
    invertFlatMap: (map: number[]) => number[];
    invertArrayToFlatMap: (map: number[][]) => number[];
    invertFlatToArrayMap: (map: number[]) => number[][];
    invertArrayMap: (map: number[][]) => number[][];
    mergeFlatNextmaps: (...maps: number[][]) => number[];
    mergeNextmaps: (...maps: number[][][]) => number[][];
    mergeFlatBackmaps: (...maps: number[][]) => number[];
    mergeBackmaps: (...maps: number[][][]) => number[][];
    remapKey: (graph: FOLD, key: string, indexMap: number[]) => void;
    makeVerticesVertices2D: ({ vertices_coords, vertices_edges, edges_vertices }: FOLD) => number[][];
    makeVerticesVerticesFromFaces: ({ vertices_coords, vertices_faces, faces_vertices, }: FOLD) => number[][];
    makeVerticesVertices: (graph: FOLD) => number[][];
    makeVerticesVerticesUnsorted: ({ vertices_edges, edges_vertices }: FOLD) => number[][];
    makeVerticesFacesUnsorted: ({ vertices_coords, vertices_edges, faces_vertices }: FOLD) => number[][];
    makeVerticesFaces: ({ vertices_coords, vertices_vertices, faces_vertices }: FOLD) => number[][];
    makeVerticesEdgesUnsorted: ({ edges_vertices }: FOLD) => number[][];
    makeVerticesEdges: ({ edges_vertices, vertices_vertices }: FOLD) => number[][];
    makeVerticesVerticesVector: ({ vertices_coords, vertices_vertices, vertices_edges, vertices_faces, edges_vertices, edges_vector, faces_vertices, }: FOLD) => number[][][];
    makeVerticesSectors: ({ vertices_coords, vertices_vertices, edges_vertices, edges_vector, }: FOLD) => number[][];
    makeVerticesToEdge: ({ edges_vertices }: FOLD, edges: any) => {
        [key: string]: number;
    };
    makeVerticesToFace: ({ faces_vertices }: FOLD, faces: any) => {
        [key: string]: number;
    };
    makeEdgesToFace: ({ faces_edges }: FOLD, faces: any) => {
        [key: string]: number;
    };
    makeFacesVerticesFromEdges: ({ edges_vertices, faces_edges }: FOLD) => number[][];
    makeFacesFaces: ({ faces_vertices }: FOLD) => number[][];
    makeFacesEdgesFromVertices: ({ edges_vertices, faces_vertices }: FOLD) => number[][];
    makePlanarFaces: ({ vertices_coords, vertices_vertices, vertices_edges, vertices_sectors, edges_vertices, edges_vector, }: FOLD) => any;
    makeFacesPolygon: ({ vertices_coords, faces_vertices }: FOLD, epsilon?: number) => ([number, number] | [number, number, number])[][];
    makeFacesPolygonQuick: ({ vertices_coords, faces_vertices }: FOLD) => ([number, number] | [number, number, number])[][];
    makeFacesCentroid2D: ({ vertices_coords, faces_vertices }: FOLD) => [number, number][];
    makeFacesCenter2DQuick: ({ vertices_coords, faces_vertices }: FOLD) => [number, number][];
    makeFacesCenter3DQuick: ({ vertices_coords, faces_vertices }: FOLD) => [number, number, number][];
    makeFacesCenterQuick: ({ vertices_coords, faces_vertices }: FOLD) => [number, number][] | [number, number, number][];
    makeEdgesFoldAngle: ({ edges_assignment }: FOLD) => number[];
    makeEdgesFoldAngleFromFaces: ({ vertices_coords, edges_vertices, edges_faces, edges_assignment, faces_vertices, faces_edges, faces_normal, faces_center, }: FOLD) => number[];
    makeEdgesFacesUnsorted: ({ edges_vertices, faces_vertices, faces_edges }: FOLD) => number[][];
    makeEdgesFaces: ({ vertices_coords, edges_vertices, edges_vector, faces_vertices, faces_edges, faces_center, }: FOLD) => number[][];
    makeEdgesEdges: ({ edges_vertices, vertices_edges }: FOLD) => number[][];
    makeEdgesAssignmentSimple: ({ edges_foldAngle }: FOLD) => string[];
    makeEdgesAssignment: ({ edges_vertices, edges_foldAngle, edges_faces, faces_vertices, faces_edges, }: FOLD) => string[];
    makeEdgesCoords: ({ vertices_coords, edges_vertices }: FOLD) => [[number, number] | [number, number, number], [number, number] | [number, number, number]][];
    makeEdgesVector: ({ vertices_coords, edges_vertices }: FOLD) => number[][];
    makeEdgesLength: ({ vertices_coords, edges_vertices }: FOLD) => number[];
    makeEdgesBoundingBox: ({ vertices_coords, edges_vertices, }: FOLD, epsilon?: number) => Box[];
    join: (target: FOLD, source: FOLD) => any;
    intersectLineVertices: ({ vertices_coords }: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, epsilon?: number) => number[];
    intersectLineVerticesEdges: ({ vertices_coords, edges_vertices }: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, epsilon?: number) => {
        vertices: number[];
        edges: any[];
    };
    intersectLine: ({ vertices_coords, edges_vertices, faces_vertices, faces_edges }: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, epsilon?: number) => {
        vertices: number[];
        edges: any[];
        faces: any[];
    };
    intersectLineAndPoints: ({ vertices_coords, edges_vertices, faces_vertices, faces_edges }: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, interiorPoints?: [number, number][], epsilon?: number) => {
        vertices: number[];
        edges: any[];
        faces: any[];
    };
    filterCollinearFacesData: ({ edges_vertices }: FOLD, { vertices, faces }: any) => void;
    explodeFaces: ({ vertices_coords, edges_vertices, edges_assignment, edges_foldAngle, faces_vertices, faces_edges, }: FOLD) => FOLD;
    explodeEdges: ({ vertices_coords, edges_vertices, edges_assignment, edges_foldAngle, }: FOLD) => FOLD;
    disjointGraphsIndices: (graph: FOLD) => {
        vertices: number[];
        edges: number[];
        faces: number[];
    }[];
    disjointGraphs: (graph: FOLD) => FOLD[];
    topologicalSort: (directedEdges: number[][]) => number[];
    connectedComponents: (array_array: number[][]) => number[];
    connectedComponentsPairs: (array_array: number[][]) => [number, number][];
    boundingBox: ({ vertices_coords }: FOLD, padding?: number) => Box;
    boundaryVertices: ({ edges_vertices, edges_assignment }: FOLD) => number[];
    boundary: ({ vertices_edges, edges_vertices, edges_assignment }: FOLD) => any;
    boundaries: ({ vertices_edges, edges_vertices, edges_assignment }: FOLD) => any[];
    planarBoundary: ({ vertices_coords, vertices_edges, vertices_vertices, edges_vertices, }: FOLD) => any;
    planarBoundaries: ({ vertices_coords, vertices_edges, vertices_vertices, edges_vertices, }: FOLD) => any;
    sortVerticesCounterClockwise: ({ vertices_coords }: FOLD, vertices: number[], vertex: number) => number[];
    sortVerticesAlongVector: ({ vertices_coords }: FOLD, vertices: number[], vector: number[]) => number[];
    edgeIsolatedVertices: ({ vertices_coords, edges_vertices }: FOLD) => number[];
    faceIsolatedVertices: ({ vertices_coords, faces_vertices }: FOLD) => number[];
    isolatedVertices: ({ vertices_coords, edges_vertices, faces_vertices }: FOLD) => number[];
    removeIsolatedVertices: (graph: FOLD, remove_indices?: number[]) => any;
    makeVerticesCoords3DFolded: ({ vertices_coords, vertices_faces, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces, faces_matrix, }: FOLD, rootFaces?: number[]) => number[][];
    makeVerticesCoordsFlatFolded: ({ vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces, }: FOLD, rootFaces?: number[]) => number[][];
    makeVerticesCoordsFolded: (graph: FOLD, rootFaces?: number[]) => number[][];
    makeVerticesCoordsFoldedFromMatrix2: ({ vertices_coords, vertices_faces, faces_vertices, }: FOLD, faces_matrix: number[][]) => number[][];
    duplicateVertices: ({ vertices_coords }: FOLD, epsilon?: number) => number[][];
    removeDuplicateVertices: (graph: FOLD, epsilon?: number, makeAverage?: boolean) => any;
    getOtherVerticesInEdges: ({ edges_vertices }: FOLD, vertex: number, edges: number[]) => number[];
    isVertexCollinear: ({ vertices_coords, vertices_edges, edges_vertices, }: FOLD, vertex: number, epsilon?: number) => boolean;
    getVerticesClusters: ({ vertices_coords }: FOLD, epsilon?: number) => number[][];
    foldFoldedForm: (graph: any, { vector, origin }: {
        vector: any;
        origin: any;
    }, lineDomain?: (_: number, __?: number) => boolean, interiorPoints?: any[], vertices_coordsFolded?: any, assignment?: string, foldAngle?: any, epsilon?: number) => any;
    foldFoldedLine: (graph: any, line: any, vertices_coordsFolded?: any, assignment?: string, foldAngle?: any, epsilon?: number) => any;
    foldFoldedRay: (graph: any, ray: any, vertices_coordsFolded?: any, assignment?: string, foldAngle?: any, epsilon?: number) => any;
    foldFoldedSegment: (graph: any, segment: any, vertices_coordsFolded?: any, assignment?: string, foldAngle?: any, epsilon?: number) => any;
    foldGraphWithLineMethod: (graph: any, { vector, origin }: {
        vector: any;
        origin: any;
    }, lineDomain?: (_: number, __?: number) => boolean, interiorPoints?: any[], vertices_coordsFolded?: any, assignment?: string, foldAngle?: any, epsilon?: number) => {
        edges: {
            new: any[];
            map: any;
        };
        faces: {
            map: any;
        };
    };
    foldLine: (graph: any, line: any, vertices_coordsFolded?: any, assignment?: string, foldAngle?: any, epsilon?: number) => {
        edges: {
            new: any[];
            map: any;
        };
        faces: {
            map: any;
        };
    };
    foldRay: (graph: any, ray: any, vertices_coordsFolded?: any, assignment?: string, foldAngle?: any, epsilon?: number) => {
        edges: {
            new: any[];
            map: any;
        };
        faces: {
            map: any;
        };
    };
    foldSegment: (graph: any, segment: any, vertices_coordsFolded?: any, assignment?: string, foldAngle?: any, epsilon?: number) => {
        edges: {
            new: any[];
            map: any;
        };
        faces: {
            map: any;
        };
    };
    getVerticesCollinearToLine: ({ vertices_coords }: {
        vertices_coords: any;
    }, { vector, origin }: {
        vector: any;
        origin: any;
    }, epsilon?: number) => any;
    getEdgesCollinearToLine: ({ vertices_coords, edges_vertices, vertices_edges }: FOLD, { vector, origin }: VecLine, epsilon?: number) => number[];
    flatFold: (graph: any, { vector, origin }: number[], assignment?: string, epsilon?: number) => any;
    foldCreasePattern: ({ vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_edges, faces_faces, }: FOLD, { vector, origin }: VecLine, assignment?: string, epsilon?: number) => any[];
    makeFacesWinding: ({ vertices_coords, faces_vertices }: FOLD) => boolean[];
    makeFacesWindingFromMatrix: (faces_matrix: number[][]) => boolean[];
    makeFacesWindingFromMatrix2: (faces_matrix2: number[][]) => boolean[];
    facesSharedEdgesVertices: (verticesA: number[], verticesB: number[]) => number[][];
    makeFacesMatrix: ({ vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces, }: FOLD, rootFaces?: number[]) => number[][];
    makeFacesMatrix2: ({ vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces, }: FOLD, rootFaces?: number[]) => number[][];
    getFacesPlane: ({ vertices_coords, faces_vertices }: FOLD, epsilon?: number) => {
        planes: {
            normal: number[];
            origin: number[];
        }[];
        planes_faces: number[][];
        planes_transform: number[][];
        faces_plane: number[];
        faces_winding: boolean[];
    };
    getCoplanarAdjacentOverlappingFaces: ({ vertices_coords, faces_vertices, faces_faces }: FOLD, epsilon?: number) => {
        planes: {
            normal: number[];
            origin: number[];
        }[];
        planes_faces: number[][];
        planes_transform: number[][];
        planes_clusters: number[][];
        faces_winding: boolean[];
        faces_plane: number[];
        faces_cluster: number[];
        clusters_plane: number[];
        clusters_faces: number[][];
    };
    edgeToLine2: ({ vertices_coords, edges_vertices }: FOLD, edge: number) => VecLine2;
    edgeToLine: ({ vertices_coords, edges_vertices }: FOLD, edge: number) => VecLine;
    edgesToLines: ({ vertices_coords, edges_vertices }: FOLD) => VecLine[];
    edgesToLines2: ({ vertices_coords, edges_vertices }: FOLD) => VecLine2[];
    edgesToLines3: ({ vertices_coords, edges_vertices }: FOLD) => VecLine3[];
    getEdgesLine: ({ vertices_coords, edges_vertices }: FOLD, epsilon?: number) => {
        lines: VecLine[];
        edges_line: number[];
    };
    duplicateEdges: ({ edges_vertices }: FOLD) => number[];
    getSimilarEdges: ({ vertices_coords, vertices_edges, edges_vertices }: FOLD, epsilon?: number) => number[][];
    removeDuplicateEdges: (graph: FOLD, replace_indices?: number[]) => any;
    circularEdges: ({ edges_vertices }: FOLD) => number[];
    removeCircularEdges: (graph: FOLD, remove_indices?: number[]) => any;
    addEdge: (graph: FOLD, vertices: number[], faces?: number[], assignment?: string, foldAngle?: number) => number;
    addVertex: (graph: FOLD, coords: [number, number] | [number, number, number], vertices?: number[], edges?: number[], faces?: number[]) => number;
    addVertices: (graph: FOLD, points?: ([number, number] | [number, number, number])[]) => number[];
    foldKeys: {
        file: string[];
        frame: string[];
        graph: string[];
        orders: string[];
    };
    foldFileClasses: string[];
    foldFrameClasses: string[];
    foldFrameAttributes: string[];
    VEF: string[];
    edgesAssignmentValues: string[];
    edgesAssignmentNames: {
        B: string;
        M: string;
        V: string;
        F: string;
        J: string;
        C: string;
        U: string;
    };
    assignmentFlatFoldAngle: {
        B: number;
        b: number;
        M: number;
        m: number;
        V: number;
        v: number;
        F: number;
        f: number;
        J: number;
        j: number;
        C: number;
        c: number;
        U: number;
        u: number;
    };
    assignmentCanBeFolded: {
        B: boolean;
        b: boolean;
        M: boolean;
        m: boolean;
        V: boolean;
        v: boolean;
        F: boolean;
        f: boolean;
        J: boolean;
        j: boolean;
        C: boolean;
        c: boolean;
        U: boolean;
        u: boolean;
    };
    assignmentIsBoundary: {
        B: boolean;
        b: boolean;
        M: boolean;
        m: boolean;
        V: boolean;
        v: boolean;
        F: boolean;
        f: boolean;
        J: boolean;
        j: boolean;
        C: boolean;
        c: boolean;
        U: boolean;
        u: boolean;
    };
    edgeAssignmentToFoldAngle: (assignment: string) => number;
    edgeFoldAngleToAssignment: (angle: number) => string;
    edgeFoldAngleIsFlat: (angle: number) => boolean;
    edgesFoldAngleAreAllFlat: ({ edges_foldAngle }: FOLD) => boolean;
    filterKeysWithPrefix: (obj: any, prefix: string) => string[];
    filterKeysWithSuffix: (obj: any, suffix: string) => string[];
    getAllPrefixes: (obj: any) => string[];
    getAllSuffixes: (obj: any) => string[];
    transposeGraphArrays: (graph: FOLD, geometry_key: string) => any[];
    transposeGraphArrayAtIndex: (graph: FOLD, geometry_key: string, index: number) => any;
    isFoldObject: (object?: FOLD) => number;
    isFoldedForm: ({ frame_classes, file_classes }: FOLD) => boolean;
    getDimension: ({ vertices_coords }: FOLD, epsilon?: number) => number;
    getDimensionQuick: ({ vertices_coords }: FOLD) => number;
    makeEdgesIsFolded: ({ edges_vertices, edges_foldAngle, edges_assignment }: FOLD) => boolean[];
    invertAssignment: (assign: string) => string;
    invertAssignments: (graph: FOLD) => FOLD;
    sortEdgesByAssignment: ({ edges_vertices, edges_assignment }: FOLD) => any;
    getFileMetadata: (FOLD?: FOLD) => any;
    flattenFrame: (graph: FOLD, frameNumber?: number) => FOLD;
    getFileFramesAsArray: (graph: FOLD) => FOLD[];
    countFrames: ({ file_frames }: FOLD) => number;
    getFramesByClassName: (graph: FOLD, className: string) => FOLD[];
    assignmentColor: {
        B: string;
        M: string;
        V: string;
        F: string;
        J: string;
        C: string;
        U: string;
    };
    rgbToAssignment: (red?: number, green?: number, blue?: number) => string;
};
export default _default;
import * as trees from "./trees.js";
