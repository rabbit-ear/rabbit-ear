export function makeFacesVertexData({ vertices_coords, edges_assignment, faces_vertices, faces_edges, faces_normal, }: FOLDExtended, options?: {
    showTriangulation?: boolean;
}): {
    vertices_coords: [number, number][] | [number, number, number][];
    vertices_normal: number[][];
    vertices_barycentric: [number, number, number][];
};
export function makeThickEdgesVertexData(graph: FOLD, options: {
    assignment_color?: any;
    dark: boolean;
}): {
    vertices_coords: any;
    vertices_color: any;
    verticesEdgesVector: any;
    vertices_vector: any;
} | undefined;
//# sourceMappingURL=data.d.ts.map