export default graphExport;
declare const graphExport: Function & {
    validate: (graph: FOLD) => string[];
    walkSingleFace: ({ vertices_vertices, vertices_sectors }: FOLDExtended, vertex0: number, vertex1: number, walkedEdges?: any) => {
        vertices: number[];
        edges: string[];
        angles?: number[];
    };
    walkPlanarFaces: ({ vertices_vertices, vertices_sectors }: FOLDExtended) => {
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
    triangulate: (graph: FOLD, earcut: any) => {
        faces?: {
            map: number[][];
        };
        edges?: {
            new: number[];
        };
    };
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
    splitGraphWithLineAndPoints: (graph: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, interiorPoints?: [number, number][], epsilon?: number) => splitGraph.SplitGraphEvent;
    splitGraphWithLine: (graph: FOLD, line: VecLine2, epsilon?: number) => splitGraph.SplitGraphEvent;
    splitGraphWithRay: (graph: FOLD, ray: VecLine2, epsilon?: number) => splitGraph.SplitGraphEvent;
    splitGraphWithSegment: (graph: FOLD, segment: [number, number][], epsilon?: number) => splitGraph.SplitGraphEvent;
    splitLineToSegments: ({ vertices_coords, edges_vertices, faces_vertices, faces_edges }: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, interiorPoints?: [number, number][], epsilon?: number) => {
        vertices: number[];
        edges: LineLineEvent[];
        faces: {
            vertices: FaceVertexEvent[];
            edges: FaceEdgeEvent[];
            points: FacePointEvent[];
        }[];
        segments: {
            vertices: any[];
            edges_face: number[];
            edges_vertices?: any;
        };
    };
    splitLineIntoEdges: ({ vertices_coords, edges_vertices, faces_vertices, faces_edges }: FOLD, line: VecLine2, lineDomain?: Function, interiorPoints?: [number, number][], epsilon?: number) => {
        vertices?: number[];
        edges_vertices?: number[][];
        edges_collinear?: boolean[];
        edges_face?: number[];
    };
    splitFaceWithLeafEdge: (graph: FOLD, face: number, vertexFace: number, vertexLeaf: number, assignment?: string, foldAngle?: number) => {
        edge: number;
        faces: {};
    };
    splitFaceWithEdge: (graph: FOLD, face: number, vertices: [number, number], assignment?: string, foldAngle?: number) => {
        edge?: number;
        faces?: {
            map?: (number | number[])[];
            new?: number[];
            remove?: number;
        };
    };
    splitFace: (graph: FOLD, face: number, vertices: [number, number], assignment?: string, foldAngle?: number) => {
        edge?: number;
        faces?: {
            map?: (number | number[])[];
            new?: number[];
            remove?: number;
        };
    };
    splitEdge: (graph: FOLD, oldEdge: number, coords?: number[]) => {
        vertex: number;
        edges: {
            map: (number | number[])[];
            add: [number, number];
            remove: number;
        };
    };
    replace: (graph: FOLD, key: string, replaceIndices: number[]) => number[];
    prepareForRenderingWithCycles: (inputGraph: FOLDExtended, { earcut, layerNudge }?: {
        earcut?: Function;
        layerNudge?: number;
    }) => FOLD;
    prepareForRendering: (inputGraph: FOLDExtended, { earcut, layerNudge }?: {
        earcut?: Function;
        layerNudge?: number;
    }) => FOLD;
    remove: (graph: FOLD, key: string, removeIndices: number[]) => number[];
    raycast: (graph: FOLD, ray: VecLine) => void;
    populate: (graph: FOLD, options?: any) => FOLD;
    pleat: ({ vertices_coords, edges_vertices }: FOLD, lineA: VecLine2, lineB: VecLine2, count: number, epsilon?: number) => [[number, number], [number, number]][][];
    pleatEdges: ({ vertices_coords, edges_vertices }: FOLD, edgeA: number, edgeB: number, count: number, epsilon?: number) => number[][][][];
    planarizeOverlaps: ({ vertices_coords, vertices_edges, edges_vertices, edges_assignment, edges_foldAngle }: FOLD, epsilon?: number) => {
        result: FOLD;
        changes: {
            vertices: {
                map: number[];
            };
            edges: {
                map: number[][];
            };
        };
    };
    planarizeMakeFaces: (oldGraph: FOLD, newGraph: FOLD, { edges: { map: edgeNextMap } }: {
        edges: {
            map: number[][];
        };
    }) => {
        faces_vertices: number[][];
        faces_edges: number[][];
        faceMap: number[][];
    };
    planarizeCollinearVertices: (graph: FOLD, epsilon?: number) => {
        result: FOLD;
        changes: {
            vertices: {
                map: number[];
            };
            edges: {
                map: number[][];
            };
        };
    };
    planarizeCollinearEdges: ({ vertices_coords, vertices_edges, edges_vertices, edges_assignment, edges_foldAngle, }: FOLD, epsilon?: number) => {
        result: FOLD;
        changes: {
            vertices: {
                map: number[];
            };
            edges: {
                map: number[][];
            };
        };
    };
    intersectAllEdges: ({ vertices_coords, vertices_edges, edges_vertices, }: FOLD, epsilon?: number) => {
        i: number;
        j: number;
        a: number;
        b: number;
        point: [number, number];
    }[];
    planarizeEdges: ({ vertices_coords, edges_vertices, edges_assignment, edges_foldAngle, }: FOLD, epsilon?: number) => FOLD;
    planarize: (graph: FOLD, epsilon?: number) => FOLD;
    planarizeEdgesVerbose: (graph: FOLD, epsilon?: number) => {
        result: FOLD;
        changes: {
            vertices: {
                map: number[][];
            };
            edges: {
                map: number[][];
            };
        };
    };
    planarizeVerbose: (graph: FOLD, epsilon?: number) => {
        result: FOLD;
        changes: {
            vertices: {
                map: number[][];
            };
            edges: {
                map: number[][];
            };
            faces: {
                map: number[][];
            };
        };
    };
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
    overlappingFaceOrdersClusters: ({ faceOrders }: FOLD) => {
        clusters_faces: number[][];
        clusters_faceOrders: [number, number, number][][];
    };
    faceOrdersToDirectedEdges: ({ vertices_coords, faces_vertices, faceOrders, faces_normal }: FOLDExtended, rootFace?: number) => [number, number][];
    linearizeFaceOrders: ({ vertices_coords, faces_vertices, faceOrders, faces_normal }: FOLDExtended, rootFace?: number) => number[];
    faceOrdersCycles: ({ vertices_coords, faces_vertices, faceOrders, faces_normal }: FOLDExtended, rootFace?: number) => void;
    linearize2DFaces: ({ vertices_coords, faces_vertices, faceOrders, faces_layer, faces_normal, }: FOLDExtended, rootFace?: number) => number[];
    nudgeFacesWithFaceOrders: ({ vertices_coords, faces_vertices, faceOrders, faces_normal: facesNormal, }: FOLDExtended) => {
        vector: [number, number, number];
        layer: number;
    }[];
    nudgeFacesWithFacesLayer: ({ faces_layer }: FOLDExtended) => {
        vector: [number, number] | [number, number, number];
        layer: number;
    }[];
    makeFacesLayer: ({ vertices_coords, faces_vertices, faceOrders, faces_normal }: FOLDExtended) => number[];
    flipFacesLayer: (faces_layer: number[]) => number[];
    makeFacesNormal: ({ vertices_coords, faces_vertices }: FOLD) => [number, number, number][];
    makeVerticesNormal: ({ vertices_coords, faces_vertices, faces_normal }: FOLDExtended) => number[][];
    normalize: (graph: FOLD) => FOLD;
    nearestVertex: ({ vertices_coords }: FOLD, point: number[]) => number;
    nearestEdge: ({ vertices_coords, edges_vertices }: FOLD, point: number[]) => number;
    nearestFace: (graph: FOLD, point: [number, number]) => number;
    invertFlatMap: (map: number[]) => number[];
    invertArrayToFlatMap: (map: number[][]) => number[];
    invertFlatToArrayMap: (map: number[]) => number[][];
    invertArrayMap: (map: number[][]) => number[][];
    mergeFlatNextmaps: (...maps: number[][]) => number[];
    mergeNextmaps: (...maps: (number | number[])[][]) => number[][];
    mergeFlatBackmaps: (...maps: number[][]) => number[];
    mergeBackmaps: (...maps: (number | number[])[][]) => number[][];
    remapKey: (graph: FOLD, key: string, indexMap: number[]) => void;
    makeVerticesVertices2D: ({ vertices_coords, vertices_edges, edges_vertices }: FOLD) => number[][];
    makeVerticesVerticesFromFaces: ({ vertices_coords, vertices_faces, faces_vertices, }: FOLD) => number[][];
    makeVerticesVertices: (graph: FOLD) => number[][];
    makeVerticesVerticesUnsorted: ({ vertices_edges, edges_vertices }: FOLD) => number[][];
    makeVerticesFacesUnsorted: ({ vertices_coords, vertices_edges, faces_vertices }: FOLD) => number[][];
    makeVerticesFaces: ({ vertices_coords, vertices_vertices, faces_vertices }: FOLD) => number[][];
    makeVerticesEdgesUnsorted: ({ edges_vertices }: FOLD) => number[][];
    makeVerticesEdges: ({ edges_vertices, vertices_vertices }: FOLD) => number[][];
    makeVerticesVerticesVector: ({ vertices_coords, vertices_vertices, vertices_edges, vertices_faces, edges_vertices, edges_vector, faces_vertices, }: FOLDExtended) => [number, number][][];
    makeVerticesSectors: ({ vertices_coords, vertices_vertices, edges_vertices, edges_vector, }: FOLDExtended) => number[][];
    makeVerticesToEdge: ({ edges_vertices }: FOLD, edges?: number[]) => {
        [key: string]: number;
    };
    makeVerticesToFace: ({ faces_vertices }: FOLD, faces?: number[]) => {
        [key: string]: number;
    };
    makeEdgesToFace: ({ faces_edges }: FOLD, faces?: number[]) => {
        [key: string]: number;
    };
    makeFacesVerticesFromEdges: ({ edges_vertices, faces_edges }: FOLD) => number[][];
    makeFacesFaces: ({ faces_vertices }: FOLD) => number[][];
    makeFacesEdgesFromVertices: ({ edges_vertices, faces_vertices }: FOLD) => number[][];
    makePlanarFaces: ({ vertices_coords, vertices_vertices, vertices_edges, vertices_sectors, edges_vertices, edges_vector, }: FOLDExtended) => {
        faces_vertices: number[][];
        faces_edges: number[][];
        faces_sectors: number[][];
    };
    makeFacesPolygon: ({ vertices_coords, faces_vertices }: FOLD, epsilon?: number) => ([number, number] | [number, number, number])[][];
    makeFacesPolygonQuick: ({ vertices_coords, faces_vertices }: FOLD) => ([number, number] | [number, number, number])[][];
    makeFacesCentroid2D: ({ vertices_coords, faces_vertices }: FOLD) => [number, number][];
    makeFacesCenter2DQuick: ({ vertices_coords, faces_vertices }: FOLD) => [number, number][];
    makeFacesCenter3DQuick: ({ vertices_coords, faces_vertices }: FOLD) => [number, number, number][];
    makeFacesCenterQuick: ({ vertices_coords, faces_vertices }: FOLD) => [number, number][] | [number, number, number][];
    makeEdgesFoldAngle: ({ edges_assignment }: FOLD) => number[];
    makeEdgesFoldAngleFromFaces: ({ vertices_coords, edges_vertices, edges_faces, edges_assignment, faces_vertices, faces_edges, faces_normal, faces_center, }: FOLDExtended) => number[];
    makeEdgesFacesUnsorted: ({ edges_vertices, faces_vertices, faces_edges }: FOLD) => number[][];
    makeEdgesFaces: ({ vertices_coords, edges_vertices, edges_vector, faces_vertices, faces_edges, faces_center, }: FOLDExtended) => number[][];
    makeEdgesEdges: ({ edges_vertices, vertices_edges }: FOLD) => number[][];
    makeEdgesAssignmentSimple: ({ edges_foldAngle }: FOLD) => string[];
    makeEdgesAssignment: ({ edges_vertices, edges_foldAngle, edges_faces, faces_vertices, faces_edges, }: FOLD) => string[];
    makeEdgesCoords: ({ vertices_coords, edges_vertices }: FOLD) => [[number, number] | [number, number, number], [number, number] | [number, number, number]][];
    makeEdgesVector: ({ vertices_coords, edges_vertices }: FOLD) => ([number, number] | [number, number, number])[];
    makeEdgesLength: ({ vertices_coords, edges_vertices }: FOLD) => number[];
    makeEdgesBoundingBox: ({ vertices_coords, edges_vertices, }: FOLD, epsilon?: number) => Box[];
    join: (target: FOLD, source: FOLD) => any;
    intersectLineVertices: ({ vertices_coords }: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, epsilon?: number) => number[];
    intersectLineVerticesEdges: ({ vertices_coords, edges_vertices }: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, epsilon?: number) => {
        vertices: number[];
        edges: LineLineEvent[];
    };
    intersectLine: ({ vertices_coords, edges_vertices, faces_vertices, faces_edges }: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, epsilon?: number) => {
        vertices: number[];
        edges: LineLineEvent[];
        faces: (FaceVertexEvent | FaceEdgeEvent)[][];
    };
    intersectLineAndPoints: ({ vertices_coords, edges_vertices, faces_vertices, faces_edges }: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, interiorPoints?: [number, number][], epsilon?: number) => {
        vertices: number[];
        edges: LineLineEvent[];
        faces: {
            vertices: FaceVertexEvent[];
            edges: FaceEdgeEvent[];
            points: FacePointEvent[];
        }[];
    };
    filterCollinearFacesData: ({ edges_vertices }: FOLD, { vertices, faces }: {
        vertices: number[];
        edges: LineLineEvent[];
        faces: {
            vertices: FaceVertexEvent[];
            edges: FaceEdgeEvent[];
            points: FacePointEvent[];
        }[];
    }) => void;
    explodeFaces: ({ vertices_coords, edges_vertices, edges_assignment, edges_foldAngle, faces_vertices, faces_edges, }: FOLD) => FOLD;
    explodeEdges: ({ vertices_coords, edges_vertices, edges_assignment, edges_foldAngle, }: FOLD) => FOLD;
    disjointGraphsIndices: (graph: FOLD) => {
        vertices: number[];
        edges: number[];
        faces: number[];
    }[];
    disjointGraphs: (graph: FOLD) => FOLD[];
    topologicalSortQuick: (directedEdges: [number, number][]) => number[];
    topologicalSort: (directedEdges: [number, number][]) => number[];
    topologicalSortCycles: (directedEdges: [number, number][]) => [number, number][];
    fixCycles: (graph: FOLD) => FOLD;
    count: (graph: FOLD, key: string) => number;
    countVertices: ({ vertices_coords, vertices_vertices, vertices_edges, vertices_faces, }: FOLD) => number;
    countEdges: ({ edges_vertices, edges_faces }: FOLD) => number;
    countFaces: ({ faces_vertices, faces_edges, faces_faces }: FOLD) => number;
    countImplied: (graph: FOLD, key: string) => number;
    countImpliedVertices: (graph: FOLD) => number;
    countImpliedEdges: (graph: FOLD) => number;
    countImpliedFaces: (graph: FOLD) => number;
    connectedComponents: (array_array: number[][]) => number[];
    connectedComponentsPairs: (array_array: number[][]) => [number, number][];
    clean: (graph: FOLD, epsilon?: number) => any;
    boundingBox: ({ vertices_coords }: FOLD, padding?: number) => Box;
    boundaryVertices: ({ edges_vertices, edges_assignment }: FOLD) => number[];
    boundary: ({ vertices_edges, edges_vertices, edges_assignment }: FOLD) => {
        vertices: number[];
        edges: number[];
    };
    boundaries: ({ vertices_edges, edges_vertices, edges_assignment }: FOLD) => {
        vertices: number[];
        edges: number[];
    }[];
    boundaryPolygons: ({ vertices_coords, vertices_edges, edges_vertices, edges_assignment, }: FOLD) => ([number, number] | [number, number, number])[][];
    boundaryPolygon: ({ vertices_coords, vertices_edges, edges_vertices, edges_assignment, }: FOLD) => ([number, number] | [number, number, number])[];
    planarBoundary: ({ vertices_coords, vertices_edges, vertices_vertices, edges_vertices, }: FOLD) => {
        vertices: number[];
        edges: number[];
    };
    planarBoundaries: ({ vertices_coords, vertices_edges, vertices_vertices, edges_vertices, }: FOLD) => {
        vertices: number[];
        edges: number[];
    }[];
    sortVerticesCounterClockwise: ({ vertices_coords }: FOLD, vertices: number[], vertex: number) => number[];
    sortVerticesAlongVector: ({ vertices_coords }: FOLD, vertices: number[], vector: number[]) => number[];
    edgeIsolatedVertices: ({ vertices_coords, edges_vertices }: FOLD) => number[];
    faceIsolatedVertices: ({ vertices_coords, faces_vertices }: FOLD) => number[];
    isolatedVertices: ({ vertices_coords, edges_vertices, faces_vertices }: FOLD) => number[];
    removeIsolatedVertices: (graph: FOLD, remove_indices?: number[]) => any;
    makeVerticesCoords3DFolded: ({ vertices_coords, vertices_faces, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces, faces_matrix, }: FOLDExtended, rootFaces?: number[]) => [number, number, number][];
    makeVerticesCoordsFlatFolded: ({ vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces, }: FOLD, rootFaces?: number[]) => [number, number][];
    makeVerticesCoordsFolded: (graph: FOLD, rootFaces?: number[]) => [number, number][] | [number, number, number][];
    makeVerticesCoordsFoldedFromMatrix2: ({ vertices_coords, vertices_faces, faces_vertices, }: FOLD, faces_matrix: number[][]) => [number, number][];
    duplicateVertices: ({ vertices_coords }: FOLD, epsilon?: number) => number[][];
    removeDuplicateVertices: (graph: FOLD, epsilon?: number, makeAverage?: boolean) => {
        map: number[];
        remove: number[];
    };
    getOtherVerticesInEdges: ({ edges_vertices }: FOLD, vertex: number, edges: number[]) => number[];
    isVertexCollinear: ({ vertices_coords, vertices_edges, edges_vertices, }: FOLD, vertex: number, epsilon?: number) => boolean;
    getVerticesClusters: ({ vertices_coords }: FOLD, epsilon?: number) => number[][];
    transferPoint: (from: FOLD, to: FOLD, { vertex, edge, face, point, b }: any) => number[];
    foldGraphIntoSubgraph: (cp: FOLD, folded: FOLD, line: VecLine2, lineDomain?: Function, interiorPoints?: [number, number][], assignment?: string, foldAngle?: number, epsilon?: number) => {
        vertices_coords: number[][];
        edges_vertices: number[][];
        edges_assignment: string[];
        edges_foldAngle: number[];
    };
    foldGraphIntoSegments: ({ vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_edges, faces_faces, }: FOLD, { vector, origin }: VecLine2, assignment?: string, epsilon?: number) => {
        intersections: (FaceVertexEvent | FaceEdgeEvent)[];
        assignment: string;
        points: [number, number][];
    }[];
    foldGraph: (graph: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, interiorPoints?: [number, number][], assignment?: string, foldAngle?: number, vertices_coordsFolded?: [number, number][] | [number, number, number][], epsilon?: number) => foldGraph.FoldGraphEvent;
    foldLine: (graph: FOLD, line: VecLine2, assignment?: string, foldAngle?: number, vertices_coordsFolded?: [number, number][] | [number, number, number][], epsilon?: number) => foldGraph.FoldGraphEvent;
    foldRay: (graph: FOLD, ray: VecLine2, assignment?: string, foldAngle?: number, vertices_coordsFolded?: [number, number][] | [number, number, number][], epsilon?: number) => foldGraph.FoldGraphEvent;
    foldSegment: (graph: FOLD, segment: [[number, number], [number, number]], assignment?: string, foldAngle?: number, vertices_coordsFolded?: [number, number][] | [number, number, number][], epsilon?: number) => foldGraph.FoldGraphEvent;
    getVerticesCollinearToLine: ({ vertices_coords }: {
        vertices_coords: any;
    }, { vector, origin }: {
        vector: any;
        origin: any;
    }, epsilon?: number) => any;
    getEdgesCollinearToLine: ({ vertices_coords, edges_vertices, vertices_edges }: FOLD, { vector, origin }: VecLine, epsilon?: number) => number[];
    flatFold: (graph: FOLDFileMetadata & FOLDFrame & FOLDOutOfSpec & {
        faces_matrix2: number[][];
        faces_winding: boolean[];
        faces_crease: VecLine2[];
        faces_side: boolean[];
    }, { vector, origin }: VecLine2, assignment?: string, epsilon?: number) => any;
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
    doEdgesOverlap: ({ vertices_coords, edges_vertices }: FOLD, epsilon?: number) => boolean;
    edgeToLine2: ({ vertices_coords, edges_vertices }: FOLD, edge: number) => VecLine2;
    edgesToLines: ({ vertices_coords, edges_vertices }: FOLD) => VecLine[];
    edgesToLines2: ({ vertices_coords, edges_vertices }: FOLD) => VecLine2[];
    edgesToLines3: ({ vertices_coords, edges_vertices }: FOLD) => VecLine3[];
    getEdgesLine: ({ vertices_coords, edges_vertices }: FOLD, epsilon?: number) => {
        lines: VecLine[];
        edges_line: number[];
    };
    getEdgesLineBruteForce: ({ vertices_coords, edges_vertices }: FOLD, epsilon?: number) => {
        lines: VecLine[];
        edges_line: number[];
    };
    duplicateEdges: ({ edges_vertices }: FOLD) => number[];
    getSimilarEdges: ({ vertices_coords, vertices_edges, edges_vertices }: FOLD, epsilon?: number) => number[][];
    removeDuplicateEdges: (graph: FOLD, replace_indices?: number[]) => {
        remove: number[];
        map: number[];
    };
    circularEdges: ({ edges_vertices }: FOLD) => number[];
    removeCircularEdges: (graph: FOLD, remove_indices?: number[]) => {
        remove: number[];
        map: number[];
    };
    addEdge: (graph: FOLD, vertices: [number, number], faces?: number[], assignment?: string, foldAngle?: number) => number;
    addIsolatedEdge: (graph: FOLD, vertices: [number, number], assignment?: string, foldAngle?: number) => number;
    addVertex: (graph: FOLD, coords: [number, number] | [number, number, number], vertices?: number[], edges?: number[], faces?: number[]) => number;
    addVertices: (graph: FOLD, points?: [number, number][] | [number, number, number][]) => number[];
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
    edgeFoldAngleIsFlatFolded: (angle: number) => boolean;
    edgeFoldAngleIsFlat: (angle: number) => boolean;
    edgesFoldAngleAreAllFlat: ({ edges_foldAngle }: FOLD) => boolean;
    filterKeysWithPrefix: (obj: FOLD, prefix: string) => string[];
    filterKeysWithSuffix: (obj: FOLD, suffix: string) => string[];
    getAllPrefixes: (obj: FOLD) => string[];
    getAllSuffixes: (obj: FOLD) => string[];
    transposeGraphArrays: (graph: FOLD, geometry_key: string) => any[];
    transposeGraphArrayAtIndex: (graph: FOLD, geometry_key: string, index: number) => any;
    isFoldObject: (object?: FOLD) => number;
    getDimension: ({ vertices_coords }: FOLD, epsilon?: number) => number;
    getDimensionQuick: ({ vertices_coords }: FOLD) => number;
    isFoldedForm: ({ vertices_coords, edges_vertices, faces_vertices, faces_edges, frame_classes, file_classes, }: FOLD, epsilon?: number) => boolean;
    makeEdgesIsFolded: ({ edges_vertices, edges_foldAngle, edges_assignment }: FOLD) => boolean[];
    invertAssignment: (assign: string) => string;
    invertAssignments: (graph: FOLD) => FOLD;
    sortEdgesByAssignment: ({ edges_vertices, edges_assignment }: FOLD) => {
        B?: number[];
        V?: number[];
        M?: number[];
        F?: number[];
        J?: number[];
        C?: number[];
        U?: number[];
    };
    getFileMetadata: (FOLD?: FOLD) => {
        file_spec?: number;
        file_creator?: string;
        file_author?: string;
        file_title?: string;
        file_description?: string;
        file_classes?: string[];
    };
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
import * as trees from "./trees.js";
import * as splitGraph from "./split/splitGraph.js";
import * as foldGraph from "./fold/foldGraph.js";
//# sourceMappingURL=index.d.ts.map