export function makePlanarFaces({ vertices_coords, vertices_vertices, vertices_edges, vertices_sectors, edges_vertices, edges_vector, }: FOLD): object;
export function makeFacesPolygon({ vertices_coords, faces_vertices }: FOLD, epsilon?: number): ([number, number] | [number, number, number])[][];
export function makeFacesPolygonQuick({ vertices_coords, faces_vertices }: FOLD): number[][][];
export function makeFacesCentroid2D({ vertices_coords, faces_vertices }: FOLD): [number, number][];
export function makeFacesCenter2DQuick({ vertices_coords, faces_vertices }: FOLD): [number, number][];
export function makeFacesCenter3DQuick({ vertices_coords, faces_vertices }: FOLD): [number, number, number][];
export function makeFacesCenterQuick({ vertices_coords, faces_vertices }: FOLD): [number, number][] | [number, number, number][];
