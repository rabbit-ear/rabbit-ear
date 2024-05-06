export default ear;
/**
 * @description Rabbit Ear, the main entrypoint into the library methods
 */
declare const ear: {
    __types__: () => void;
    axiom: {
        validateAxiom1And2: (boundary: [number, number][], point1: [number, number], point2: [number, number]) => boolean[];
        validateAxiom3: (boundary: [number, number][], solutions: VecLine2[], line1: VecLine2, line2: VecLine2) => boolean[];
        validateAxiom4: (boundary: [number, number][], solutions: VecLine2[], line: VecLine2, point: [number, number]) => boolean[];
        validateAxiom5: (boundary: [number, number][], solutions: VecLine2[], line: VecLine2, point1: [number, number], point2: [number, number]) => boolean[];
        validateAxiom6: (boundary: [number, number][], solutions: VecLine2[], line1: VecLine2, line2: VecLine2, point1: [number, number], point2: [number, number]) => boolean[];
        validateAxiom7: (boundary: [number, number][], solutions: VecLine2[], line1: VecLine2, line2: VecLine2, point: [number, number]) => boolean[];
        normalAxiom1InPolygon: (polygon: [number, number][], point1: [number, number], point2: [number, number]) => UniqueLine[];
        axiom1InPolygon: (polygon: [number, number][], point1: [number, number], point2: [number, number]) => VecLine2[];
        normalAxiom2InPolygon: (polygon: [number, number][], point1: [number, number], point2: [number, number]) => UniqueLine[];
        axiom2InPolygon: (polygon: [number, number][], point1: [number, number], point2: [number, number]) => VecLine2[];
        normalAxiom3InPolygon: (polygon: [number, number][], line1: UniqueLine, line2: UniqueLine) => UniqueLine[];
        axiom3InPolygon: (polygon: [number, number][], line1: VecLine2, line2: VecLine2) => VecLine2[];
        normalAxiom4InPolygon: (polygon: [number, number][], line: UniqueLine, point: [number, number]) => UniqueLine[];
        axiom4InPolygon: (polygon: [number, number][], line: VecLine2, point: [number, number]) => VecLine2[];
        normalAxiom5InPolygon: (polygon: [number, number][], line: UniqueLine, point1: [number, number], point2: [number, number]) => UniqueLine[];
        axiom5InPolygon: (polygon: [number, number][], line: VecLine2, point1: [number, number], point2: [number, number]) => VecLine2[];
        normalAxiom6InPolygon: (polygon: [number, number][], line1: UniqueLine, line2: UniqueLine, point1: [number, number], point2: [number, number]) => UniqueLine[];
        axiom6InPolygon: (polygon: [number, number][], line1: VecLine2, line2: VecLine2, point1: [number, number], point2: [number, number]) => VecLine2[];
        normalAxiom7InPolygon: (polygon: [number, number][], line1: UniqueLine, line2: UniqueLine, point: [number, number]) => UniqueLine[];
        axiom7InPolygon: (polygon: [number, number][], line1: VecLine2, line2: VecLine2, point: [number, number]) => VecLine2[];
        normalAxiom1: (point1: [number, number], point2: [number, number]) => [UniqueLine];
        axiom1: (point1: [number, number], point2: [number, number]) => [VecLine2];
        normalAxiom2: (point1: [number, number], point2: [number, number]) => [UniqueLine];
        axiom2: (point1: [number, number], point2: [number, number]) => [VecLine2];
        normalAxiom3: (line1: UniqueLine, line2: UniqueLine) => [UniqueLine?, UniqueLine?];
        axiom3: (line1: VecLine2, line2: VecLine2) => [VecLine2?, VecLine2?];
        normalAxiom4: (line: UniqueLine, point: [number, number]) => [UniqueLine];
        axiom4: ({ vector }: VecLine2, point: [number, number]) => [VecLine2];
        normalAxiom5: (line: UniqueLine, point1: [number, number], point2: [number, number]) => [UniqueLine?, UniqueLine?];
        axiom5: (line: VecLine2, point1: [number, number], point2: [number, number]) => VecLine2[];
        normalAxiom6: (line1: UniqueLine, line2: UniqueLine, point1: [number, number], point2: [number, number]) => UniqueLine[];
        axiom6: (line1: VecLine2, line2: VecLine2, point1: [number, number], point2: [number, number]) => VecLine2[];
        normalAxiom7: (line1: UniqueLine, line2: UniqueLine, point: [number, number]) => [UniqueLine?];
        axiom7: (line1: VecLine2, line2: VecLine2, point: [number, number]) => [VecLine2?];
    };
    convert: {
        parseCSSStyleSheet: (sheet: CSSStyleSheet) => any;
        parseStyleElement: (style: SVGStyleElement) => any[];
        getStylesheetStyle: (key: any, nodeName: any, attributes: any, sheets?: any[]) => any;
        lineToSegments: (line: Element) => [number, number, number, number][];
        pathToSegments: (path: Element) => [number, number, number, number][];
        polygonToSegments: (polygon: Element) => [number, number, number, number][];
        polylineToSegments: (polyline: Element) => [number, number, number, number][];
        rectToSegments: (rect: Element) => [number, number, number, number][];
        facesVerticesPolygon: (graph: any, options: any) => SVGElement[];
        facesEdgesPolygon: (graph: any, options: any) => SVGElement[];
        drawFaces: (graph: any, options: any) => SVGElement | SVGElement[];
        edgesPaths: (graph: FOLD, options?: any) => SVGElement;
        edgesLines: (graph: FOLD, options?: any) => SVGElement;
        drawEdges: (graph: any, options: any) => SVGElement;
        drawVertices: (graph: any, options?: {}) => SVGElement;
        drawBoundaries: (graph: any, options?: {}) => SVGElement;
        colorToAssignment: (color: any, customAssignments: any) => any;
        opacityToFoldAngle: (opacity: any, assignment: any) => number;
        getEdgeStroke: (element: any, attributes: any) => string;
        getEdgeOpacity: (element: any, attributes: any) => number;
        setKeysAndValues: (el: Element, attributes?: any) => void;
        boundingBoxToViewBox: (box: Box) => string;
        getViewBox: (graph: FOLD) => string;
        getNthPercentileEdgeLength: ({ vertices_coords, edges_vertices, edges_length }: FOLD, n?: number) => number;
        getStrokeWidth: (graph: FOLD, vmax?: number) => number;
        planarizeGraph: (graph: FOLD, epsilon?: number) => FOLD;
        findEpsilonInObject: (graph: FOLD, object: any, key?: string) => number;
        invertVertical: (vertices_coords: [number, number][] | [number, number, number][]) => undefined;
        invisibleParent: (child: any) => any;
        foldToObj: (file: string | FOLD) => string;
        renderSVG: (graph: FOLD, element: SVGElement, options?: any) => SVGElement;
        foldToSvg: (file: string | FOLD, options?: {
            string?: boolean;
            vertices?: boolean;
            edges?: {
                mountain: any;
                valley: any;
            };
            faces?: {
                front: any;
                back: any;
            };
            boundaries?: any;
            viewBox?: boolean;
            strokeWidth?: number;
            radius?: number;
        }) => string | SVGElement;
        svgSegments: (svg: string | Element) => {
            element: Element;
            attributes?: {
                [key: string]: string;
            };
            segment: [number, number][];
            data: {
                assignment: string;
                foldAngle: string;
            };
            stroke: string;
            opacity: number;
        }[];
        svgEdgeGraph: (svg: string | Element, options: any) => FOLD;
        svgToFold: (file: string | SVGElement, options: any) => FOLD;
        opxEdgeGraph: (file: string) => FOLD;
        opxToFold: (file: string, options: number | {
            epsilon?: number;
            invertVertical?: boolean;
        }) => FOLD;
        objToFold: (file: string) => FOLD;
    };
    diagram: {
        segmentToArrow: (segment: [number, number][], polygon: [number, number][], options?: {}) => any;
        simpleArrow: ({ vertices_coords }: FOLD, foldLine: VecLine2, options: any) => any;
        axiom1Arrows: ({ vertices_coords }: FOLD, point1: [number, number], point2: [number, number], options: any) => any[];
        axiom2Arrows: ({ vertices_coords }: FOLD, point1: [number, number], point2: [number, number], options: any) => any[];
        axiom3Arrows: ({ vertices_coords }: FOLD, line1: VecLine2, line2: VecLine2, options: any) => any[];
        axiom4Arrows: ({ vertices_coords }: FOLD, line: VecLine2, point: [number, number], options: any) => any[];
        axiom5Arrows: ({ vertices_coords }: FOLD, line: VecLine2, point1: [number, number], point2: [number, number], options: any) => any[];
        axiom6Arrows: ({ vertices_coords }: FOLD, line1: VecLine2, line2: VecLine2, point1: [number, number], point2: [number, number], options: any) => any[];
        axiom7Arrows: ({ vertices_coords }: FOLD, line1: VecLine2, line2: VecLine2, point: [number, number], options: any) => any[];
    };
    general: {
        toCamel: (s: string) => string;
        toKebab: (s: string) => string;
        capitalized: (s: string) => string;
        sortPointsAlongVector: (points: number[][], vector: number[]) => number[];
        radialSortUnitVectors2: (vectors: [number, number][]) => number[];
        radialSortVectors3: (points: [number, number, number][], vector?: [number, number, number], origin?: [number, number, number]) => number[];
        cleanNumber: (number: number, places?: number) => number;
        clusterSortedGeneric: (elements: any[], comparison: Function) => number[][];
        clusterUnsortedIndices: (indices: any[], comparison: Function) => number[][];
        clusterScalars: (numbers: number[], epsilon?: number) => number[][];
        clusterRanges: (ranges: [number, number][], epsilon?: number) => number[][];
        clusterParallelVectors: (vectors: number[][], epsilon?: number) => number[][];
        uniqueElements: (array: number[]) => number[];
        nonUniqueElements: (array: any[]) => any[];
        uniqueSortedNumbers: (array: number[]) => number[];
        epsilonUniqueSortedNumbers: (array: number[], epsilon?: number) => number[];
        arrayIntersection: (array1: any[], array2: any[]) => any[];
        rotateCircularArray: (array: any[], newStartIndex: number) => any[];
        splitCircularArray: (array: any[], indices: [number, number]) => [any[], any[]];
        chooseTwoPairs: (array: any[]) => [any, any][];
        setDifferenceSortedNumbers: (a: number[], b: number[]) => number[];
        setDifferenceSortedEpsilonNumbers: (a: number[], b: number[], epsilon?: number) => number[];
        arrayMinimumIndex: (array: any[], map?: Function) => number;
        arrayMaximumIndex: (array: any[], map?: Function) => number;
        mergeArraysWithHoles: (...arrays: any[][]) => any[];
        clustersToReflexiveArrays: (clusters: number[][]) => number[][];
        arrayArrayToLookupArray: (array_array: number[][]) => boolean[][];
        lookupArrayToArrayArray: (lookupArray: boolean[][]) => number[][];
    };
    graph: Function & {
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
        minimumSpanningTrees: (array_array?: number[][], rootIndices?: number[]) => import("./graph/trees.js").BreadthFirstTreeNode[][][];
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
        splitGraphWithLineAndPoints: (graph: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, interiorPoints?: [number, number][], epsilon?: number) => import("./graph/split/splitGraph.js").SplitGraphEvent;
        splitGraphWithLine: (graph: FOLD, line: VecLine2, epsilon?: number) => import("./graph/split/splitGraph.js").SplitGraphEvent;
        splitGraphWithRay: (graph: FOLD, ray: VecLine2, epsilon?: number) => import("./graph/split/splitGraph.js").SplitGraphEvent;
        splitGraphWithSegment: (graph: FOLD, segment: [number, number][], epsilon?: number) => import("./graph/split/splitGraph.js").SplitGraphEvent;
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
        remove: (graph: FOLD, key: string, removeIndices: number[]) => number[];
        raycast: (graph: FOLD, ray: VecLine) => void;
        populate: (graph: FOLD, options?: any) => FOLD;
        pleat: ({ vertices_coords, edges_vertices }: FOLD, lineA: VecLine2, lineB: VecLine2, count: number, epsilon?: number) => [[number, number], [number, number]][][];
        pleatEdges: ({ vertices_coords, edges_vertices }: FOLD, edgeA: number, edgeB: number, count: number, epsilon?: number) => number[][][][];
        intersectAllEdges: ({ vertices_coords, vertices_edges, edges_vertices, }: FOLD, epsilon?: number) => {
            i: number;
            j: number;
            a: number;
            b: number;
            point: [number, number];
        }[];
        planarizeOverlaps: ({ vertices_coords, vertices_edges, edges_vertices, edges_assignment, edges_foldAngle }: FOLD, epsilon?: number) => {
            graph: FOLD;
            changes: any;
        };
        planarizeMakeFaces: (oldGraph: FOLD, newGraph: FOLD, edgeBackmap: number[][]) => {
            faces_vertices: number[][];
            faces_edges: number[][];
            faceMap: number[][];
        };
        planarizeCollinearVertices: (graph: FOLD, epsilon?: number) => {
            graph: FOLD;
            changes: any;
        };
        planarizeCollinearEdges: ({ vertices_coords, vertices_edges, edges_vertices, edges_assignment, edges_foldAngle, }: FOLD, epsilon?: number) => {
            graph: FOLD;
            changes: any;
        };
        planarizeEdges: (graph: FOLD, epsilon?: number) => {
            graph: FOLD;
            changes: any;
        };
        planarizeVEF: (graph: FOLD, epsilon?: number) => {
            graph: FOLD;
            changes: any;
        };
        planarize: ({ vertices_coords, edges_vertices, edges_assignment, edges_foldAngle, }: FOLD, epsilon?: number) => FOLD;
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
        faceOrdersToDirectedEdges: ({ vertices_coords, faces_vertices, faceOrders, faces_normal }: FOLDExtended, rootFace?: number) => [number, number][];
        linearizeFaceOrders: ({ vertices_coords, faces_vertices, faceOrders, faces_normal }: FOLDExtended, rootFace?: number) => number[];
        faceOrdersCycles: ({ vertices_coords, faces_vertices, faceOrders, faces_normal }: FOLDExtended, rootFace?: number) => void;
        linearize2DFaces: ({ vertices_coords, faces_vertices, faceOrders, faces_layer, faces_normal, }: FOLDExtended, rootFace?: number) => number[];
        nudgeFacesWithFaceOrders: ({ vertices_coords, faces_vertices, faceOrders, faces_normal, }: FOLDExtended) => any[];
        nudgeFacesWithFacesLayer: ({ faces_layer }: FOLDExtended) => any[];
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
        foldGraph: (graph: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, interiorPoints?: [number, number][], assignment?: string, foldAngle?: number, vertices_coordsFolded?: [number, number][] | [number, number, number][], epsilon?: number) => import("./graph/fold/foldGraph.js").FoldGraphEvent;
        foldLine: (graph: FOLD, line: VecLine2, assignment?: string, foldAngle?: number, vertices_coordsFolded?: [number, number][] | [number, number, number][], epsilon?: number) => import("./graph/fold/foldGraph.js").FoldGraphEvent;
        foldRay: (graph: FOLD, ray: VecLine2, assignment?: string, foldAngle?: number, vertices_coordsFolded?: [number, number][] | [number, number, number][], epsilon?: number) => import("./graph/fold/foldGraph.js").FoldGraphEvent;
        foldSegment: (graph: FOLD, segment: [[number, number], [number, number]], assignment?: string, foldAngle?: number, vertices_coordsFolded?: [number, number][] | [number, number, number][], epsilon?: number) => import("./graph/fold/foldGraph.js").FoldGraphEvent;
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
    layer: ((graph: FOLD, epsilon?: number) => {
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
        makeTransitivity: ({ faces_polygon }: FOLDExtended, facesFacesOverlap: number[][], epsilon?: number) => TransitivityConstraint[];
        getTransitivityTriosFromTacos: ({ taco_taco, taco_tortilla }: {
            taco_taco: TacoTacoConstraint[];
            taco_tortilla: TacoTortillaConstraint[];
        }) => {
            [key: string]: boolean;
        };
        makeTortillaTortillaFacesCrossing: (edges_faces: number[][], edgesFacesSide: number[][], edgesFacesOverlap: number[][]) => TortillaTortillaConstraint[];
        makeTacosAndTortillas: ({ vertices_coords, edges_vertices, edges_faces, faces_vertices, faces_edges, faces_center, }: FOLDExtended, epsilon?: number) => {
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
        solveLayerOrders: ({ vertices_coords, edges_vertices, edges_faces, edges_assignment, edges_foldAngle, faces_vertices, faces_edges, faces_faces, edges_vector, }: FOLDExtended, epsilon?: number) => {
            orders: {
                [key: string]: number;
            };
            branches?: LayerBranch[];
            faces_winding: boolean[];
        };
        solveLayerOrdersSingleBranches: ({ vertices_coords, edges_vertices, edges_faces, edges_assignment, faces_vertices, faces_edges, edges_vector, }: FOLDExtended, epsilon?: number) => {
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
        makeEdgesFacesSide: ({ vertices_coords, edges_vertices, edges_faces, faces_center, }: FOLDExtended) => number[][];
        makeEdgePairsFacesSide: ({ vertices_coords, edges_vertices, edges_faces, faces_center }: FOLDExtended, edgePairs: [number, number][]) => [[number, number], [number, number]][];
        makeEdgesFacesSide2D: ({ vertices_coords, edges_faces, faces_vertices, faces_center }: FOLDExtended, { lines, edges_line }: {
            lines: VecLine[];
            edges_line: number[];
            faces_plane: number[];
            planes_transform: number[][];
        }) => number[][];
        makeEdgesFacesSide3D: ({ vertices_coords, edges_faces, faces_vertices, faces_center }: FOLDExtended, { lines, edges_line, planes_transform, faces_plane }: {
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
        makeSolverConstraintsFlat: ({ vertices_coords, edges_vertices, edges_faces, edges_assignment, faces_vertices, faces_edges, faces_center, }: FOLDExtended, epsilon?: number) => {
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
    math: {
        clipLineConvexPolygon: (poly: [number, number][], { vector, origin }: VecLine2, fnPoly?: Function, fnLine?: Function, epsilon?: number) => [number, number][];
        clipPolygonPolygon: (polygon1: number[][], polygon2: number[][], epsilon?: number) => number[][];
        intersectLineLine: (a: VecLine2, b: VecLine2, aDomain?: Function, bDomain?: Function, epsilon?: number) => {
            point: [number, number];
            a: number;
            b: number;
        };
        intersectCircleLine: (circle: Circle, line: VecLine2, _?: Function, lineDomain?: Function, epsilon?: number) => [number, number][];
        intersectPolygonLine: (polygon: ([number, number] | [number, number, number])[], line: VecLine2, domainFunc?: Function, epsilon?: number) => {
            a: number;
            point: [number, number];
        }[];
        overlapLinePoint: ({ vector, origin }: VecLine2, point: [number, number] | [number, number, number], lineDomain?: (_: number, __?: number) => boolean, epsilon?: number) => boolean;
        overlapConvexPolygonPoint: (polygon: ([number, number] | [number, number, number])[], point: [number, number] | [number, number, number], polyDomain?: Function, epsilon?: number) => {
            overlap: boolean;
            t: number[];
        };
        overlapConvexPolygons: (poly1: [number, number][], poly2: [number, number][], epsilon?: number) => boolean;
        overlapBoundingBoxes: (box1: Box, box2: Box, epsilon?: number) => boolean;
        pointInBoundingBox: (point: number[], box: Box, epsilon?: number) => boolean;
        enclosingBoundingBoxes: (outer: Box, inner: Box, epsilon?: number) => boolean;
        trilateration2: (pts: [[number, number], [number, number], [number, number]], radii: [number, number, number]) => [number, number];
        trilateration3: (pts: [[number, number, number], [number, number, number], [number, number, number]], radii: [number, number, number]) => [number, number, number];
        circumcircle: (a: [number, number], b: [number, number], c: [number, number]) => Circle;
        straightSkeleton: (points: [number, number][]) => any[];
        rangeUnion: (a: number[], b: number[]) => number[];
        doRangesOverlap: (a: number[], b: number[], epsilon?: number) => boolean;
        isCounterClockwiseBetween: (angle: number, floor: number, ceiling: number) => boolean;
        clockwiseAngleRadians: (a: number, b: number) => number;
        counterClockwiseAngleRadians: (a: number, b: number) => number;
        clockwiseAngle2: (a: [number, number], b: [number, number]) => number;
        counterClockwiseAngle2: (a: [number, number], b: [number, number]) => number;
        clockwiseBisect2: (a: [number, number], b: [number, number]) => [number, number];
        counterClockwiseBisect2: (a: [number, number], b: [number, number]) => [number, number];
        clockwiseSubsectRadians: (angleA: number, angleB: number, divisions: number) => number[];
        counterClockwiseSubsectRadians: (angleA: number, angleB: number, divisions: number) => number[];
        clockwiseSubsect2: (vectorA: [number, number], vectorB: [number, number], divisions: number) => [number, number][];
        counterClockwiseSubsect2: (vectorA: [number, number], vectorB: [number, number], divisions: number) => [number, number][];
        counterClockwiseOrderRadians: (radians: number[]) => number[];
        counterClockwiseOrder2: (vectors: [number, number][]) => number[];
        counterClockwiseSectorsRadians: (radians: number[]) => number[];
        counterClockwiseSectors2: (vectors: [number, number][]) => number[];
        threePointTurnDirection: (p0: [number, number], p1: [number, number], p2: [number, number], epsilon?: number) => number;
        makePolygonCircumradius: (sides?: number, circumradius?: number) => [number, number][];
        makePolygonCircumradiusSide: (sides?: number, circumradius?: number) => [number, number][];
        makePolygonInradius: (sides?: number, inradius?: number) => [number, number][];
        makePolygonInradiusSide: (sides?: number, inradius?: number) => [number, number][];
        makePolygonSideLength: (sides?: number, length?: number) => [number, number][];
        makePolygonSideLengthSide: (sides?: number, length?: number) => [number, number][];
        makePolygonNonCollinear: (polygon: ([number, number] | [number, number, number])[], epsilon?: number) => ([number, number] | [number, number, number])[];
        makePolygonNonCollinear3: (polygon: [number, number, number][], epsilon?: number) => [number, number, number][];
        signedArea: (points: [number, number][]) => number;
        centroid: (points: [number, number][]) => [number, number];
        boundingBox: (points: number[][], padding?: number) => Box;
        projectPointOnPlane: (point: [number, number] | [number, number, number], vector?: [number, number, number], origin?: [number, number, number]) => [number, number, number];
        nearestPoint2: (points: [number, number][], point: [number, number]) => [number, number];
        nearestPoint: (points: number[][], point: number[]) => number[];
        nearestPointOnLine: ({ vector, origin }: VecLine, point: [number, number] | [number, number, number], clampFunc?: Function, epsilon?: number) => [number, number] | [number, number, number];
        nearestPointOnPolygon: (polygon: [number, number][], point: [number, number]) => any;
        nearestPointOnCircle: ({ radius, origin }: Circle, point: [number, number]) => [number, number];
        clampLine: (dist: number) => number;
        clampRay: (dist: number) => number;
        clampSegment: (dist: number) => number;
        collinearPoints: (p0: number[], p1: number[], p2: number[], epsilon?: number) => boolean;
        collinearBetween: (p0: number[], p1: number[], p2: number[], inclusive?: boolean, epsilon?: number) => boolean;
        collinearLines2: (a: VecLine2, b: VecLine2, epsilon?: number) => boolean;
        collinearLines3: (a: VecLine3, b: VecLine3, epsilon?: number) => boolean;
        pleat: (a: VecLine2, b: VecLine2, count: number, epsilon?: number) => [VecLine2[], VecLine2[]];
        bisectLines2: (a: VecLine2, b: VecLine2, epsilon?: number) => [VecLine2?, VecLine2?];
        convexHullRadialSortPoints: (points: [number, number][], epsilon?: number) => number[][];
        convexHull: (points?: [number, number][], includeCollinear?: boolean, epsilon?: number) => number[];
        quaternionFromTwoVectors: (u: [number, number, number], v: [number, number, number]) => [number, number, number, number];
        matrix4FromQuaternion: (q: [number, number, number, number]) => number[];
        identity4x4: readonly number[];
        isIdentity4x4: (m: number[]) => boolean;
        multiplyMatrix4Vector3: (m: number[], vector: [number, number, number]) => [number, number, number];
        multiplyMatrix4Line3: (m: number[], vector: [number, number, number], origin: [number, number, number]) => VecLine;
        multiplyMatrices4: (m1: number[], m2: number[]) => number[];
        determinant4: (m: number[]) => number;
        invertMatrix4: (m: number[]) => number[];
        makeMatrix4Translate: (x?: number, y?: number, z?: number) => number[];
        makeMatrix4RotateX: (angle: number, origin?: [number, number, number]) => number[];
        makeMatrix4RotateY: (angle: number, origin?: [number, number, number]) => number[];
        makeMatrix4RotateZ: (angle: number, origin?: [number, number, number]) => number[];
        makeMatrix4Rotate: (angle: number, vector?: [number, number, number], origin?: [number, number, number]) => number[];
        makeMatrix4Scale: (scale?: [number, number, number], origin?: [number, number, number]) => number[];
        makeMatrix4UniformScale: (scale?: number, origin?: [number, number, number]) => number[];
        makeMatrix4ReflectZ: (vector: [number, number], origin?: [number, number]) => number[];
        makePerspectiveMatrix4: (FOV: number, aspect: number, near: number, far: number) => number[];
        makeOrthographicMatrix4: (top: number, right: number, bottom: number, left: number, near: number, far: number) => number[];
        makeLookAtMatrix4: (position: [number, number, number], target: [number, number, number], up: [number, number, number]) => number[];
        identity3x3: readonly number[];
        identity3x4: readonly number[];
        isIdentity3x4: (m: number[]) => boolean;
        multiplyMatrix3Vector3: (m: number[], vector: [number, number, number]) => [number, number, number];
        multiplyMatrix3Line3: (m: number[], vector: [number, number, number], origin: [number, number, number]) => VecLine;
        multiplyMatrices3: (m1: number[], m2: number[]) => number[];
        determinant3: (m: number[]) => number;
        invertMatrix3: (m: number[]) => number[];
        makeMatrix3Translate: (x?: number, y?: number, z?: number) => number[];
        makeMatrix3RotateX: (angle: number, origin?: [number, number, number]) => number[];
        makeMatrix3RotateY: (angle: number, origin?: [number, number, number]) => number[];
        makeMatrix3RotateZ: (angle: number, origin?: [number, number, number]) => number[];
        makeMatrix3Rotate: (angle: number, vector?: [number, number, number], origin?: [number, number, number]) => number[];
        makeMatrix3Scale: (scale?: [number, number, number], origin?: [number, number, number]) => number[];
        makeMatrix3UniformScale: (scale?: number, origin?: [number, number, number]) => number[];
        makeMatrix3ReflectZ: (vector: [number, number], origin?: [number, number]) => number[];
        identity2x2: number[];
        identity2x3: number[];
        multiplyMatrix2Vector2: (matrix: number[], vector: [number, number]) => [number, number];
        multiplyMatrix2Line2: (matrix: number[], { vector, origin }: VecLine2) => VecLine2;
        multiplyMatrices2: (m1: number[], m2: number[]) => number[];
        determinant2: (m: number[]) => number;
        invertMatrix2: (m: number[]) => number[];
        makeMatrix2Translate: (x?: number, y?: number) => number[];
        makeMatrix2Scale: (scale?: [number, number], origin?: [number, number]) => number[];
        makeMatrix2UniformScale: (scale?: number, origin?: [number, number]) => number[];
        makeMatrix2Rotate: (angle: number, origin?: [number, number]) => number[];
        makeMatrix2Reflect: (vector: [number, number], origin?: [number, number]) => number[];
        magnitude: (v: number[]) => number;
        magnitude2: (v: [number, number] | [number, number, number]) => number;
        magnitude3: (v: [number, number, number]) => number;
        magSquared2: (v: [number, number] | [number, number, number]) => number;
        magSquared: (v: number[]) => number;
        normalize: (v: number[]) => number[];
        normalize2: (v: [number, number] | [number, number, number]) => [number, number];
        normalize3: (v: [number, number, number]) => [number, number, number];
        scale: (v: number[], s: number) => number[];
        scale2: (v: [number, number] | [number, number, number], s: number) => [number, number];
        scale3: (v: [number, number, number], s: number) => [number, number, number];
        scaleNonUniform: (v: number[], s: number[]) => number[];
        scaleNonUniform2: (v: [number, number] | [number, number, number], s: [number, number] | [number, number, number]) => [number, number];
        scaleNonUniform3: (v: [number, number, number], s: [number, number, number]) => [number, number, number];
        add: (v: number[], u: number[]) => number[];
        add2: (v: [number, number] | [number, number, number], u: [number, number] | [number, number, number]) => [number, number];
        add3: (v: [number, number, number], u: [number, number, number]) => [number, number, number];
        subtract: (v: number[], u: number[]) => number[];
        subtract2: (v: [number, number] | [number, number, number], u: [number, number] | [number, number, number]) => [number, number];
        subtract3: (v: [number, number, number], u: [number, number, number]) => [number, number, number];
        dot: (v: number[], u: number[]) => number;
        dot2: (v: [number, number] | [number, number, number], u: [number, number] | [number, number, number]) => number;
        dot3: (v: [number, number, number], u: [number, number, number]) => number;
        midpoint: (v: number[], u: number[]) => number[];
        midpoint2: (v: [number, number] | [number, number, number], u: [number, number] | [number, number, number]) => [number, number];
        midpoint3: (v: [number, number, number], u: [number, number, number]) => [number, number, number];
        average: (...args: number[][]) => number[];
        average2: (...vectors: [number, number][]) => [number, number];
        average3: (...vectors: [number, number, number][]) => [number, number, number];
        lerp: (v: number[], u: number[], t?: number) => number[];
        cross2: (v: [number, number] | [number, number, number], u: [number, number] | [number, number, number]) => number;
        cross3: (v: [number, number, number], u: [number, number, number]) => [number, number, number];
        distance: (v: number[], u: number[]) => number;
        distance2: (v: [number, number] | [number, number, number], u: [number, number] | [number, number, number]) => number;
        distance3: (v: [number, number, number], u: [number, number, number]) => number;
        flip: (v: number[]) => number[];
        flip2: (v: [number, number] | [number, number, number]) => [number, number];
        flip3: (v: [number, number, number]) => [number, number, number];
        rotate90: (v: [number, number] | [number, number, number]) => [number, number];
        rotate270: (v: [number, number] | [number, number, number]) => [number, number];
        degenerate: (v: number[], epsilon?: number) => boolean;
        parallelNormalized: (v: number[], u: number[], epsilon?: number) => boolean;
        parallel: (v: number[], u: number[], epsilon?: number) => boolean;
        parallel2: (v: [number, number] | [number, number, number], u: [number, number] | [number, number, number], epsilon?: number) => boolean;
        parallel3: (v: [number, number, number], u: [number, number, number], epsilon?: number) => boolean;
        resize: (dimension: number, vector: number[]) => number[];
        resize2: (vector: number[]) => [number, number];
        resize3: (vector: number[]) => [number, number, number];
        resizeUp: (a: number[], b: number[]) => number[][];
        basisVectors2: (vector?: [number, number] | [number, number, number]) => [number, number][];
        basisVectors3: (vector?: [number, number, number]) => [number, number, number][];
        basisVectors: (vector: number[]) => number[][];
        epsilonEqual: (a: number, b: number, epsilon?: number) => boolean;
        epsilonCompare: (a: number, b: number, epsilon?: number) => number;
        epsilonEqualVectors: (a: number[], b: number[], epsilon?: number) => boolean;
        include: (n: number, epsilon?: number) => boolean;
        exclude: (n: number, epsilon?: number) => boolean;
        includeL: (_: number, __?: number) => boolean;
        excludeL: (_: number, __?: number) => boolean;
        includeR: (n: number, epsilon?: number) => boolean;
        excludeR: (n: number, epsilon?: number) => boolean;
        includeS: (n: number, e?: number) => boolean;
        excludeS: (n: number, e?: number) => boolean;
        vectorToAngle: (v: [number, number]) => number;
        angleToVector: (a: number) => [number, number];
        pointsToLine2: (a: [number, number] | [number, number, number], b: [number, number] | [number, number, number]) => VecLine2;
        pointsToLine3: (a: [number, number, number], b: [number, number, number]) => VecLine3;
        pointsToLine: (a: [number, number] | [number, number, number], b: [number, number] | [number, number, number]) => VecLine;
        vecLineToUniqueLine: ({ vector, origin }: VecLine) => UniqueLine;
        uniqueLineToVecLine: ({ normal, distance }: UniqueLine) => VecLine2;
        EPSILON: 0.000001;
        R2D: number;
        D2R: number;
        TWO_PI: number;
    };
    singleVertex: {
        maekawaSolver: (vertices_edgesAssignments: string[]) => string[][];
        alternatingSum: (numbers: number[]) => number[];
        alternatingSumDifference: (sectors: number[]) => number[];
        kawasakiSolutionsRadians: (radians: number[]) => number[];
        kawasakiSolutionsVectors: (vectors: number[][]) => [number, number][];
        kawasakiSolutions: ({ vertices_coords, vertices_edges, edges_assignment, edges_vertices }: FOLD, vertex: number) => number[][];
        verticesFoldability: ({ vertices_coords, vertices_vertices, vertices_edges, vertices_faces, edges_vertices, edges_foldAngle, edges_vector, faces_vertices, }: FOLDExtended) => number[];
        verticesFoldable: (graph: FOLD, epsilon?: number) => boolean[];
        verticesFlatFoldabilityMaekawa: ({ edges_vertices, vertices_edges, edges_assignment, }: FOLD) => number[];
        verticesFlatFoldabilityKawasaki: ({ vertices_coords, vertices_vertices, vertices_edges, edges_vertices, edges_assignment, }: FOLD) => number[];
        verticesFlatFoldableMaekawa: (graph: FOLD) => boolean[];
        verticesFlatFoldableKawasaki: (graph: FOLD, epsilon?: number) => boolean[];
        verticesFlatFoldability: (graph: FOLD, epsilon?: number) => number[];
        verticesFlatFoldable: (graph: FOLD, epsilon?: number) => boolean[];
        foldDegree4: (sectors: number[], assignments: string[], foldAngle?: number) => number[];
    };
    svg: ((...args: any[]) => SVGElement) & {
        /**
         * @description Rabbit Ear, the main entrypoint into the library methods
         */
        window: any;
        svg: (...args: any[]) => SVGElement;
        defs: (...args: any[]) => SVGElement;
        desc: (...args: any[]) => SVGElement;
        filter: (...args: any[]) => SVGElement;
        metadata: (...args: any[]) => SVGElement;
        style: (...args: any[]) => SVGElement;
        script: (...args: any[]) => SVGElement;
        title: (...args: any[]) => SVGElement;
        view: (...args: any[]) => SVGElement;
        cdata: (...args: any[]) => SVGElement;
        g: (...args: any[]) => SVGElement;
        circle: (...args: any[]) => SVGElement;
        ellipse: (...args: any[]) => SVGElement;
        line: (...args: any[]) => SVGElement;
        path: (...args: any[]) => SVGElement;
        polygon: (...args: any[]) => SVGElement;
        polyline: (...args: any[]) => SVGElement;
        rect: (...args: any[]) => SVGElement;
        arc: (...args: any[]) => SVGElement;
        arrow: (...args: any[]) => SVGElement;
        curve: (...args: any[]) => SVGElement;
        parabola: (...args: any[]) => SVGElement;
        roundRect: (...args: any[]) => SVGElement;
        wedge: (...args: any[]) => SVGElement;
        origami: (...args: any[]) => SVGElement;
        text: (...args: any[]) => SVGElement;
        marker: (...args: any[]) => SVGElement;
        symbol: (...args: any[]) => SVGElement;
        clipPath: (...args: any[]) => SVGElement;
        mask: (...args: any[]) => SVGElement;
        linearGradient: (...args: any[]) => SVGElement;
        radialGradient: (...args: any[]) => SVGElement;
        pattern: (...args: any[]) => SVGElement;
        textPath: (...args: any[]) => SVGElement;
        tspan: (...args: any[]) => SVGElement;
        stop: (...args: any[]) => SVGElement;
        feBlend: (...args: any[]) => SVGElement;
        feColorMatrix: (...args: any[]) => SVGElement;
        feComponentTransfer: (...args: any[]) => SVGElement;
        feComposite: (...args: any[]) => SVGElement;
        feConvolveMatrix: (...args: any[]) => SVGElement;
        feDiffuseLighting: (...args: any[]) => SVGElement;
        feDisplacementMap: (...args: any[]) => SVGElement;
        feDistantLight: (...args: any[]) => SVGElement;
        feDropShadow: (...args: any[]) => SVGElement;
        feFlood: (...args: any[]) => SVGElement;
        feFuncA: (...args: any[]) => SVGElement;
        feFuncB: (...args: any[]) => SVGElement;
        feFuncG: (...args: any[]) => SVGElement;
        feFuncR: (...args: any[]) => SVGElement;
        feGaussianBlur: (...args: any[]) => SVGElement;
        feImage: (...args: any[]) => SVGElement;
        feMerge: (...args: any[]) => SVGElement;
        feMergeNode: (...args: any[]) => SVGElement;
        feMorphology: (...args: any[]) => SVGElement;
        feOffset: (...args: any[]) => SVGElement;
        fePointLight: (...args: any[]) => SVGElement;
        feSpecularLighting: (...args: any[]) => SVGElement;
        feSpotLight: (...args: any[]) => SVGElement;
        feTile: (...args: any[]) => SVGElement;
        feTurbulence: (...args: any[]) => SVGElement;
        convertToViewBox: (svg: any, x: any, y: any) => any[];
        foldToViewBox: ({ vertices_coords }: {
            vertices_coords: any;
        }) => string;
        getViewBox: (element: any) => any;
        setViewBox: (element: any, ...args: any[]) => any;
        parseTransform: (transform: string) => {
            transform: string;
            parameters: number[];
        }[];
        transformStringToMatrix: (string: any) => any;
        parsePathCommands: (d: string) => {
            command: string;
            values: number[];
        }[];
        parsePathCommandsWithEndpoints: (d: any) => {
            end: any;
            start: any;
            command: string;
            values: number[];
        }[];
        pathCommandNames: {
            m: string;
            l: string;
            v: string;
            h: string;
            a: string;
            c: string;
            s: string;
            q: string;
            t: string;
            z: string;
        };
        makeCDATASection: (text: string) => CDATASection;
        addClass: (el: Element, ...classes: string[]) => void;
        findElementTypeInParents: (element: Element, nodeName: string) => Element;
        flattenDomTree: (el: Element | ChildNode) => (Element | ChildNode)[];
        flattenDomTreeWithStyle: (element: Element | ChildNode, attributes?: any) => {
            element: Element | ChildNode;
            attributes: {
                [key: string]: string;
            };
        }[];
        getRootParent: (el: Element) => Element;
        xmlStringToElement: (input: string, mimeType?: string) => Element;
        svg_add2: (a: [number, number], b: [number, number]) => [number, number];
        svg_distance2: (a: [number, number], b: [number, number]) => number;
        svg_distanceSq2: (a: [number, number], b: [number, number]) => number;
        svg_magnitude2: (a: [number, number]) => number;
        svg_magnitudeSq2: (a: [number, number]) => number;
        svg_multiplyMatrices2: (m1: number[], m2: number[]) => number[];
        svg_polar_to_cart: (a: number, d: number) => [number, number];
        svg_scale2: (a: [number, number], s: number) => [number, number];
        svg_sub2: (a: [number, number], b: [number, number]) => [number, number];
        parseColorToHex: (string: string) => string;
        parseColorToRgb: (string: string) => number[];
        hexToRgb: (string: string) => number[];
        hslToRgb: (hue: number, saturation: number, lightness: number, alpha: number) => number[];
        rgbToHex: (red: number, green: number, blue: number, alpha: number) => string;
        cssColors: {
            black: string;
            silver: string;
            gray: string;
            white: string;
            maroon: string;
            red: string;
            purple: string;
            fuchsia: string;
            green: string;
            lime: string;
            olive: string;
            yellow: string;
            navy: string;
            blue: string;
            teal: string;
            aqua: string;
            orange: string;
            aliceblue: string;
            antiquewhite: string;
            aquamarine: string;
            azure: string;
            beige: string;
            bisque: string;
            blanchedalmond: string;
            blueviolet: string;
            brown: string;
            burlywood: string;
            cadetblue: string;
            chartreuse: string;
            chocolate: string;
            coral: string;
            cornflowerblue: string;
            cornsilk: string;
            crimson: string;
            cyan: string;
            darkblue: string;
            darkcyan: string;
            darkgoldenrod: string;
            darkgray: string;
            darkgreen: string;
            darkgrey: string;
            darkkhaki: string;
            darkmagenta: string;
            darkolivegreen: string;
            darkorange: string;
            darkorchid: string;
            darkred: string;
            darksalmon: string;
            darkseagreen: string;
            darkslateblue: string;
            darkslategray: string;
            darkslategrey: string;
            darkturquoise: string;
            darkviolet: string;
            deeppink: string;
            deepskyblue: string;
            dimgray: string;
            dimgrey: string;
            dodgerblue: string;
            firebrick: string;
            floralwhite: string;
            forestgreen: string;
            gainsboro: string;
            ghostwhite: string;
            gold: string;
            goldenrod: string;
            greenyellow: string;
            grey: string;
            honeydew: string;
            hotpink: string;
            indianred: string;
            indigo: string;
            ivory: string;
            khaki: string;
            lavender: string;
            lavenderblush: string;
            lawngreen: string;
            lemonchiffon: string;
            lightblue: string;
            lightcoral: string;
            lightcyan: string;
            lightgoldenrodyellow: string;
            lightgray: string;
            lightgreen: string;
            lightgrey: string;
            lightpink: string;
            lightsalmon: string;
            lightseagreen: string;
            lightskyblue: string;
            lightslategray: string;
            lightslategrey: string;
            lightsteelblue: string;
            lightyellow: string;
            limegreen: string;
            linen: string;
            magenta: string;
            mediumaquamarine: string;
            mediumblue: string;
            mediumorchid: string;
            mediumpurple: string;
            mediumseagreen: string;
            mediumslateblue: string;
            mediumspringgreen: string;
            mediumturquoise: string;
            mediumvioletred: string;
            midnightblue: string;
            mintcream: string;
            mistyrose: string;
            moccasin: string;
            navajowhite: string;
            oldlace: string;
            olivedrab: string;
            orangered: string;
            orchid: string;
            palegoldenrod: string;
            palegreen: string;
            paleturquoise: string;
            palevioletred: string;
            papayawhip: string;
            peachpuff: string;
            peru: string;
            pink: string;
            plum: string;
            powderblue: string;
            rosybrown: string;
            royalblue: string;
            saddlebrown: string;
            salmon: string;
            sandybrown: string;
            seagreen: string;
            seashell: string;
            sienna: string;
            skyblue: string;
            slateblue: string;
            slategray: string;
            slategrey: string;
            snow: string;
            springgreen: string;
            steelblue: string;
            tan: string;
            thistle: string;
            tomato: string;
            turquoise: string;
            violet: string;
            wheat: string;
            whitesmoke: string;
            yellowgreen: string;
        };
        NS: string;
        nodes_attributes: {
            svg: string[];
            line: string[];
            rect: string[];
            circle: string[];
            ellipse: string[];
            polygon: string[];
            polyline: string[];
            path: string[];
            text: string[];
            mask: string[];
            symbol: string[];
            clipPath: string[];
            marker: string[];
            linearGradient: string[];
            radialGradient: string[];
            stop: string[];
            pattern: string[];
        };
        nodes_children: {
            svg: string[];
            defs: string[];
            filter: string[];
            g: string[];
            text: string[];
            marker: string[];
            symbol: string[];
            clipPath: string[];
            mask: string[];
            linearGradient: string[];
            radialGradient: string[];
        };
        extensions: {
            origami: {
                nodeName: string;
                init: (parent: any, graph: any, options?: {}) => any;
                args: () => any[];
                methods: {
                    appendTo: (element: any, parent: any) => any;
                    removeChildren: (element: any) => any;
                    setAttributes: (element: any, attrs: any) => any;
                    clearTransform: (el: any) => any;
                    vertices: (...args: any[]) => Element;
                    edges: (...args: any[]) => Element;
                    faces: (...args: any[]) => Element;
                    boundaries: (...args: any[]) => Element;
                };
            };
            wedge: {
                nodeName: string;
                args: (a: any, b: any, c: any, d: any, e: any) => string[];
                attributes: string[];
                methods: {
                    clearTransform: (el: any) => any;
                    setArc: (el: any, ...args: any[]) => any;
                };
            };
            curve: {
                nodeName: string;
                attributes: string[];
                args: (...args: any[]) => string[];
                methods: {
                    clearTransform: (el: any) => any;
                    setPoints: (element: any, ...args: any[]) => any;
                    bend: (element: any, amount: any) => any;
                    pinch: (element: any, amount: any) => any;
                };
            };
            arrow: {
                nodeName: string;
                attributes: any[];
                args: () => any[];
                methods: {
                    clearTransform: (el: any) => any;
                    setPoints: (element: any, ...args: any[]) => any;
                    points: (element: any, ...args: any[]) => any;
                    bend: (element: any, amount: any) => any;
                    pinch: (element: any, amount: any) => any;
                    padding: (element: any, amount: any) => any;
                    head: (element: any, options: any) => any;
                    tail: (element: any, options: any) => any;
                    getLine: (element: any) => any;
                    getHead: (element: any) => any;
                    getTail: (element: any) => any;
                };
                init: (parent: any, ...args: any[]) => any;
            };
            arc: {
                nodeName: string;
                attributes: string[];
                args: (a: any, b: any, c: any, d: any, e: any) => string[];
                methods: {
                    clearTransform: (el: any) => any;
                    setArc: (el: any, ...args: any[]) => any;
                };
            };
            polyline: {
                args: (...args: any[]) => any[];
                methods: {
                    appendTo: (element: any, parent: any) => any;
                    removeChildren: (element: any) => any;
                    setAttributes: (element: any, attrs: any) => any;
                    clearTransform: (el: any) => any;
                    setPoints: (element: any, ...args: any[]) => any;
                    addPoint: (element: any, ...args: any[]) => any;
                };
            };
            polygon: {
                args: (...args: any[]) => any[];
                methods: {
                    appendTo: (element: any, parent: any) => any;
                    removeChildren: (element: any) => any;
                    setAttributes: (element: any, attrs: any) => any;
                    clearTransform: (el: any) => any;
                    setPoints: (element: any, ...args: any[]) => any;
                    addPoint: (element: any, ...args: any[]) => any;
                };
            };
            mask: {
                args: (...args: any[]) => any[];
                methods: {
                    appendTo: (element: any, parent: any) => any;
                    removeChildren: (element: any) => any;
                    setAttributes: (element: any, attrs: any) => any;
                    clearTransform: (el: any) => any;
                };
            };
            clipPath: {
                args: (...args: any[]) => any[];
                methods: {
                    appendTo: (element: any, parent: any) => any;
                    removeChildren: (element: any) => any;
                    setAttributes: (element: any, attrs: any) => any;
                    clearTransform: (el: any) => any;
                };
            };
            symbol: {
                args: (...args: any[]) => any[];
                methods: {
                    appendTo: (element: any, parent: any) => any;
                    removeChildren: (element: any) => any;
                    setAttributes: (element: any, attrs: any) => any;
                    clearTransform: (el: any) => any;
                };
            };
            marker: {
                args: (...args: any[]) => any[];
                methods: {
                    appendTo: (element: any, parent: any) => any;
                    removeChildren: (element: any) => any;
                    setAttributes: (element: any, attrs: any) => any;
                    clearTransform: (el: any) => any;
                    size: (element: any, ...args: any[]) => any;
                    setViewBox: (element: any, ...args: any[]) => any;
                };
            };
            text: {
                args: (a: any, b: any, c: any) => any[];
                init: (parent: any, a: any, b: any, c: any, d: any) => any;
                methods: {
                    appendTo: (element: any, parent: any) => any;
                    setAttributes: (element: any, attrs: any) => any;
                    clearTransform: (el: any) => any;
                };
            };
            style: {
                init: (parent: any, text: any) => any;
                methods: {
                    setTextContent: (el: any, text: any) => any;
                };
            };
            rect: {
                args: (a: any, b: any, c: any, d: any) => any;
                methods: {
                    appendTo: (element: any, parent: any) => any;
                    removeChildren: (element: any) => any;
                    setAttributes: (element: any, attrs: any) => any;
                    clearTransform: (el: any) => any;
                    origin: (el: any, a: any, b: any) => any;
                    setOrigin: (el: any, a: any, b: any) => any;
                    center: (el: any, a: any, b: any) => any;
                    setCenter: (el: any, a: any, b: any) => any;
                    size: (el: any, rx: any, ry: any) => any;
                    setSize: (el: any, rx: any, ry: any) => any;
                };
            };
            path: {
                methods: {
                    appendTo: (element: any, parent: any) => any;
                    removeChildren: (element: any) => any;
                    setAttributes: (element: any, attrs: any) => any;
                    clearTransform: (el: any) => any;
                    addCommand: (el: any, command: any, ...args: any[]) => any;
                    appendCommand: (el: any, command: any, ...args: any[]) => any;
                    clear: (element: any) => any;
                    getCommands: (element: any) => {
                        command: string;
                        values: number[];
                    }[];
                    get: (element: any) => {
                        command: string;
                        values: number[];
                    }[];
                    getD: (el: any) => any;
                };
            };
            line: {
                args: (...args: any[]) => any[];
                methods: {
                    appendTo: (element: any, parent: any) => any;
                    removeChildren: (element: any) => any;
                    setAttributes: (element: any, attrs: any) => any;
                    clearTransform: (el: any) => any;
                    setPoints: (element: any, ...args: any[]) => any;
                };
            };
            ellipse: {
                args: (a: any, b: any, c: any, d: any) => any[];
                methods: {
                    appendTo: (element: any, parent: any) => any;
                    removeChildren: (element: any) => any;
                    setAttributes: (element: any, attrs: any) => any;
                    clearTransform: (el: any) => any;
                    radius: (el: any, rx: any, ry: any) => any;
                    setRadius: (el: any, rx: any, ry: any) => any;
                    origin: (el: any, a: any, b: any) => any;
                    setOrigin: (el: any, a: any, b: any) => any;
                    center: (el: any, a: any, b: any) => any;
                    setCenter: (el: any, a: any, b: any) => any;
                    position: (el: any, a: any, b: any) => any;
                    setPosition: (el: any, a: any, b: any) => any;
                };
            };
            circle: {
                args: (a: any, b: any, c: any, d: any) => any[];
                methods: {
                    appendTo: (element: any, parent: any) => any;
                    removeChildren: (element: any) => any;
                    setAttributes: (element: any, attrs: any) => any;
                    clearTransform: (el: any) => any;
                    radius: (el: any, r: any) => any;
                    setRadius: (el: any, r: any) => any;
                    origin: (el: any, a: any, b: any) => any;
                    setOrigin: (el: any, a: any, b: any) => any;
                    center: (el: any, a: any, b: any) => any;
                    setCenter: (el: any, a: any, b: any) => any;
                    position: (el: any, a: any, b: any) => any;
                    setPosition: (el: any, a: any, b: any) => any;
                };
            };
            g: {
                methods: {
                    appendTo: (element: any, parent: any) => any;
                    removeChildren: (element: any) => any;
                    setAttributes: (element: any, attrs: any) => any;
                    clearTransform: (el: any) => any;
                };
            };
            svg: {
                args: (...args: any[]) => string[];
                methods: {
                    appendTo: (element: any, parent: any) => any;
                    removeChildren: (element: any) => any;
                    setAttributes: (element: any, attrs: any) => any;
                    clearTransform: (el: any) => any;
                    clear: (element: any) => any;
                    size: (element: any, ...args: any[]) => any;
                    setViewBox: (element: any, ...args: any[]) => any;
                    getViewBox: (element: any) => any;
                    padding: (element: any, padding: any) => any;
                    background: (element: any, color: any) => any;
                    getWidth: (el: any) => any;
                    getHeight: (el: any) => any;
                    stylesheet: (el: any, text: any) => any;
                };
                init: (_: any, ...args: any[]) => any;
            };
        };
    };
    webgl: {
        makeUniforms: ({ projectionMatrix, modelViewMatrix, cpColor, strokeWidth, }: {
            projectionMatrix: any;
            modelViewMatrix: any;
            cpColor: any;
            strokeWidth: any;
        }) => {
            [key: string]: WebGLUniform;
        };
        cp_300_frag: "#version 300 es\n#ifdef GL_FRAGMENT_PRECISION_HIGH\n  precision highp float;\n#else\n  precision mediump float;\n#endif\nin vec3 blend_color;\nout vec4 outColor;\nvoid main() {\n\toutColor = vec4(blend_color.rgb, 1);\n}\n";
        cp_100_frag: "#version 100\nprecision mediump float;\nvarying vec3 blend_color;\nvoid main () {\n\tgl_FragColor = vec4(blend_color.rgb, 1);\n}\n";
        thick_edges_300_vert: "#version 300 es\nuniform mat4 u_matrix;\nuniform float u_strokeWidth;\nin vec2 v_position;\nin vec3 v_color;\nin vec2 edge_vector;\nin vec2 vertex_vector;\nout vec3 blend_color;\nvoid main () {\n\tfloat sign = vertex_vector[0];\n\tfloat halfWidth = u_strokeWidth * 0.5;\n\tvec2 side = normalize(vec2(edge_vector.y * sign, -edge_vector.x * sign)) * halfWidth;\n\tgl_Position = u_matrix * vec4(side + v_position, 0, 1);\n\tblend_color = v_color;\n}\n";
        thick_edges_100_vert: "#version 100\nuniform mat4 u_matrix;\nuniform float u_strokeWidth;\nattribute vec2 v_position;\nattribute vec3 v_color;\nattribute vec2 edge_vector;\nattribute vec2 vertex_vector;\nvarying vec3 blend_color;\nvoid main () {\n\tfloat sign = vertex_vector[0];\n\tfloat halfWidth = u_strokeWidth * 0.5;\n\tvec2 side = normalize(vec2(edge_vector.y * sign, -edge_vector.x * sign)) * halfWidth;\n\tgl_Position = u_matrix * vec4(side + v_position, 0, 1);\n\tblend_color = v_color;\n}\n";
        cp_100_vert: "#version 100\nuniform mat4 u_matrix;\nuniform vec3 u_cpColor;\nattribute vec2 v_position;\nvarying vec3 blend_color;\nvoid main () {\n\tgl_Position = u_matrix * vec4(v_position, 0, 1);\n\tblend_color = u_cpColor;\n}\n";
        cp_300_vert: "#version 300 es\nuniform mat4 u_matrix;\nuniform vec3 u_cpColor;\nin vec2 v_position;\nout vec3 blend_color;\nvoid main () {\n\tgl_Position = u_matrix * vec4(v_position, 0, 1);\n\tblend_color = u_cpColor;\n}\n";
        cpFacesV1: (gl: WebGLRenderingContext | WebGL2RenderingContext, graph?: FOLD, options?: any) => WebGLModel;
        cpEdgesV1: (gl: WebGLRenderingContext | WebGL2RenderingContext, graph?: FOLD, options?: any) => WebGLModel;
        cpFacesV2: (gl: WebGLRenderingContext | WebGL2RenderingContext, graph?: FOLD, options?: any) => WebGLModel;
        cpEdgesV2: (gl: WebGLRenderingContext | WebGL2RenderingContext, graph?: FOLD, options?: any) => WebGLModel;
        creasePattern: (gl: WebGLRenderingContext | WebGL2RenderingContext, version?: number, graph?: FOLD, options?: any) => WebGLModel[];
        makeCPEdgesVertexData: (graph: any, options: any) => {
            vertices_coords: any;
            vertices_color: any;
            verticesEdgesVector: any;
            vertices_vector: any;
        };
        makeCPEdgesVertexArrays: (gl: WebGLRenderingContext | WebGL2RenderingContext, program: any, graph: FOLD, options: any) => WebGLVertexArray[];
        makeCPEdgesElementArrays: (gl: WebGLRenderingContext | WebGL2RenderingContext, version?: number, graph?: FOLD) => WebGLElementArray[];
        makeCPFacesVertexArrays: (gl: WebGLRenderingContext | WebGL2RenderingContext, program: any, graph: FOLD) => WebGLVertexArray[];
        makeCPFacesElementArrays: (gl: WebGLRenderingContext | WebGL2RenderingContext, version?: number, graph?: FOLD) => WebGLElementArray[];
        model_300_vert: "#version 300 es\nuniform mat4 u_modelView;\nuniform mat4 u_matrix;\nuniform vec3 u_frontColor;\nuniform vec3 u_backColor;\nin vec3 v_position;\nin vec3 v_normal;\nout vec3 front_color;\nout vec3 back_color;\nvoid main () {\n\tgl_Position = u_matrix * vec4(v_position, 1);\n\tvec3 light = abs(normalize((vec4(v_normal, 1) * u_modelView).xyz));\n\tfloat brightness = 0.5 + light.x * 0.15 + light.z * 0.35;\n\tfront_color = u_frontColor * brightness;\n\tback_color = u_backColor * brightness;\n}\n";
        outlined_model_300_frag: "#version 300 es\n#ifdef GL_FRAGMENT_PRECISION_HIGH\n  precision highp float;\n#else\n  precision mediump float;\n#endif\nuniform float u_opacity;\nin vec3 front_color;\nin vec3 back_color;\nin vec3 outline_color;\nin vec3 barycentric;\nout vec4 outColor;\nfloat edgeFactor(vec3 barycenter) {\n\tvec3 d = fwidth(barycenter);\n\tvec3 a3 = smoothstep(vec3(0.0), d*3.5, barycenter);\n\treturn min(min(a3.x, a3.y), a3.z);\n}\nvoid main () {\n\tgl_FragDepth = gl_FragCoord.z;\n\tvec3 color = gl_FrontFacing ? front_color : back_color;\n\t// vec4 color4 = gl_FrontFacing\n\t// \t? vec4(front_color, u_opacity)\n\t// \t: vec4(back_color, u_opacity);\n\t// vec4 outline4 = vec4(outline_color, 1);\n\t// outColor = vec4(mix(vec3(0.0), color, edgeFactor(barycentric)), u_opacity);\n\toutColor = vec4(mix(outline_color, color, edgeFactor(barycentric)), u_opacity);\n\t// outColor = mix(outline4, color4, edgeFactor(barycentric));\n}\n";
        outlined_model_100_frag: "#version 100\nprecision mediump float;\nuniform float u_opacity;\nvarying vec3 barycentric;\nvarying vec3 front_color;\nvarying vec3 back_color;\nvarying vec3 outline_color;\nvoid main () {\n\tvec3 color = gl_FrontFacing ? front_color : back_color;\n\t// vec3 boundary = vec3(0.0, 0.0, 0.0);\n\tvec3 boundary = outline_color;\n\t// gl_FragDepth = 0.5;\n\tgl_FragColor = any(lessThan(barycentric, vec3(0.02)))\n\t\t? vec4(boundary, u_opacity)\n\t\t: vec4(color, u_opacity);\n}\n";
        model_100_vert: "#version 100\nattribute vec3 v_position;\nattribute vec3 v_normal;\nuniform mat4 u_projection;\nuniform mat4 u_modelView;\nuniform mat4 u_matrix;\nuniform vec3 u_frontColor;\nuniform vec3 u_backColor;\nvarying vec3 normal_color;\nvarying vec3 front_color;\nvarying vec3 back_color;\nvoid main () {\n\tgl_Position = u_matrix * vec4(v_position, 1);\n\tvec3 light = abs(normalize((vec4(v_normal, 1) * u_modelView).xyz));\n\tfloat brightness = 0.5 + light.x * 0.15 + light.z * 0.35;\n\tfront_color = u_frontColor * brightness;\n\tback_color = u_backColor * brightness;\n}\n";
        model_100_frag: "#version 100\nprecision mediump float;\nuniform float u_opacity;\nvarying vec3 front_color;\nvarying vec3 back_color;\nvoid main () {\n\tvec3 color = gl_FrontFacing ? front_color : back_color;\n\tgl_FragColor = vec4(color, u_opacity);\n}\n";
        simple_300_frag: "#version 300 es\n#ifdef GL_FRAGMENT_PRECISION_HIGH\n  precision highp float;\n#else\n  precision mediump float;\n#endif\nin vec3 blend_color;\nout vec4 outColor;\n \nvoid main() {\n\toutColor = vec4(blend_color.rgb, 1);\n}\n";
        outlined_model_100_vert: "#version 100\nattribute vec3 v_position;\nattribute vec3 v_normal;\nattribute vec3 v_barycentric;\nuniform mat4 u_projection;\nuniform mat4 u_modelView;\nuniform mat4 u_matrix;\nuniform vec3 u_frontColor;\nuniform vec3 u_backColor;\nuniform vec3 u_outlineColor;\nvarying vec3 normal_color;\nvarying vec3 barycentric;\nvarying vec3 front_color;\nvarying vec3 back_color;\nvarying vec3 outline_color;\nvoid main () {\n\tgl_Position = u_matrix * vec4(v_position, 1);\n\tbarycentric = v_barycentric;\n\tvec3 light = abs(normalize((vec4(v_normal, 1) * u_modelView).xyz));\n\tfloat brightness = 0.5 + light.x * 0.15 + light.z * 0.35;\n\tfront_color = u_frontColor * brightness;\n\tback_color = u_backColor * brightness;\n\toutline_color = u_outlineColor;\n}\n";
        outlined_model_300_vert: "#version 300 es\nuniform mat4 u_modelView;\nuniform mat4 u_matrix;\nuniform vec3 u_frontColor;\nuniform vec3 u_backColor;\nuniform vec3 u_outlineColor;\nin vec3 v_position;\nin vec3 v_normal;\nin vec3 v_barycentric;\nin float v_rawEdge;\nout vec3 front_color;\nout vec3 back_color;\nout vec3 outline_color;\nout vec3 barycentric;\n// flat out int rawEdge;\nflat out int provokedVertex;\nvoid main () {\n\tgl_Position = u_matrix * vec4(v_position, 1);\n\tprovokedVertex = gl_VertexID;\n\tbarycentric = v_barycentric;\n\t// rawEdge = int(v_rawEdge);\n\tvec3 light = abs(normalize((vec4(v_normal, 1) * u_modelView).xyz));\n\tfloat brightness = 0.5 + light.x * 0.15 + light.z * 0.35;\n\tfront_color = u_frontColor * brightness;\n\tback_color = u_backColor * brightness;\n\toutline_color = u_outlineColor;\n}\n";
        model_300_frag: "#version 300 es\n#ifdef GL_FRAGMENT_PRECISION_HIGH\n  precision highp float;\n#else\n  precision mediump float;\n#endif\nuniform float u_opacity;\nin vec3 front_color;\nin vec3 back_color;\nout vec4 outColor;\nvoid main () {\n\tgl_FragDepth = gl_FragCoord.z;\n\tvec3 color = gl_FrontFacing ? front_color : back_color;\n\toutColor = vec4(color, u_opacity);\n}\n";
        simple_100_frag: "#version 100\nprecision mediump float;\nvarying vec3 blend_color;\nvoid main () {\n\tgl_FragColor = vec4(blend_color.rgb, 1);\n}\n";
        foldedFormFaces: (gl: WebGLRenderingContext | WebGL2RenderingContext, version?: number, graph?: FOLD, options?: any) => WebGLModel;
        foldedFormEdges: (gl: WebGLRenderingContext | WebGL2RenderingContext, version?: number, graph?: FOLD, options?: any) => WebGLModel;
        foldedFormFacesOutlined: (gl: WebGLRenderingContext | WebGL2RenderingContext, version?: number, graph?: FOLD, options?: any) => WebGLModel;
        foldedForm: (gl: WebGLRenderingContext | WebGL2RenderingContext, version?: number, graph?: FOLD, options?: any) => WebGLModel[];
        makeFacesVertexData: ({ vertices_coords, edges_assignment, faces_vertices, faces_edges, faces_normal, }: {
            vertices_coords: any;
            edges_assignment: any;
            faces_vertices: any;
            faces_edges: any;
            faces_normal: any;
        }, options?: {}) => {
            vertices_coords: [number, number][] | [number, number, number][];
            vertices_normal: number[][];
            vertices_barycentric: [number, number, number][];
        };
        makeThickEdgesVertexData: (graph: any, options: any) => {
            vertices_coords: any;
            vertices_color: any;
            verticesEdgesVector: any;
            vertices_vector: any;
        };
        makeFoldedVertexArrays: (gl: WebGLRenderingContext | WebGL2RenderingContext, program: any, { vertices_coords, edges_vertices, edges_assignment, faces_vertices, faces_edges, faces_normal, }?: FOLDExtended, options?: {}) => WebGLVertexArray[];
        makeFoldedElementArrays: (gl: WebGLRenderingContext | WebGL2RenderingContext, version?: number, graph?: FOLD) => WebGLElementArray[];
        makeThickEdgesVertexArrays: (gl: WebGLRenderingContext | WebGL2RenderingContext, program: any, graph: FOLD, options?: {}) => WebGLVertexArray[];
        makeThickEdgesElementArrays: (gl: WebGLRenderingContext | WebGL2RenderingContext, version?: number, graph?: FOLD) => WebGLElementArray[];
        initializeWebGL: (canvasElement: HTMLCanvasElement, preferredVersion?: number) => {
            gl: WebGLRenderingContext | WebGL2RenderingContext;
            version: number;
        };
        createProgram: (gl: WebGLRenderingContext | WebGL2RenderingContext, vertexSource: string, fragmentSource: string) => WebGLProgram;
        rebuildViewport: (gl: WebGLRenderingContext | WebGL2RenderingContext, canvas: HTMLCanvasElement) => undefined;
        makeProjectionMatrix: ([width, height]: [number, number], perspective?: string, fov?: number) => number[];
        makeModelMatrix: (graph: FOLD) => number[];
        drawModel: (gl: WebGLRenderingContext | WebGL2RenderingContext, version: number, model: WebGLModel, uniforms?: {
            [key: string]: WebGLUniform;
        }) => void;
        deallocModel: (gl: WebGLRenderingContext | WebGL2RenderingContext, model: WebGLModel) => void;
        makeExplodedGraph: (graph: FOLDExtended, layerNudge?: number) => FOLD;
        dark: {
            B: number[];
            b: number[];
            V: number[];
            v: number[];
            M: number[];
            m: number[];
            F: number[];
            f: number[];
            J: number[];
            j: number[];
            C: number[];
            c: number[];
            U: number[];
            u: number[];
        };
        light: {
            B: number[];
            b: number[];
            V: number[];
            v: number[];
            M: number[];
            m: number[];
            F: number[];
            f: number[];
            J: number[];
            j: number[];
            C: number[];
            c: number[];
            U: number[];
            u: number[];
        };
        parseColorToWebGLColor: (color: string | number[]) => [number, number, number];
    };
};
//# sourceMappingURL=index.d.ts.map