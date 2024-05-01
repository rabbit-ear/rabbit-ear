declare const _default: {
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
};
export default _default;
//# sourceMappingURL=index.d.ts.map