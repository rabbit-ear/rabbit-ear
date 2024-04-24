export function makePlanarFaces({ vertices_coords, vertices_vertices, vertices_edges, vertices_sectors, edges_vertices, edges_vector, }: FOLDExtended): {
    faces_vertices: number[][];
    faces_edges: number[][];
    faces_sectors: number[][];
};
export function makeFacesPolygon({ vertices_coords, faces_vertices }: FOLD, epsilon?: number): ([number, number] | [number, number, number])[][];
export function makeFacesPolygonQuick({ vertices_coords, faces_vertices }: FOLD): ([number, number] | [number, number, number])[][];
export function makeFacesCentroid2D({ vertices_coords, faces_vertices }: FOLD): [number, number][];
export function makeFacesCenter2DQuick({ vertices_coords, faces_vertices }: FOLD): [number, number][];
export function makeFacesCenter3DQuick({ vertices_coords, faces_vertices }: FOLD): [number, number, number][];
export function makeFacesCenterQuick({ vertices_coords, faces_vertices }: FOLD): [number, number][] | [number, number, number][];
//# sourceMappingURL=faces.d.ts.map