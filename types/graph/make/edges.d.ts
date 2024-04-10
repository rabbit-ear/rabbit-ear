export function makeEdgesCoords({ vertices_coords, edges_vertices }: FOLD): number[][][];
export function makeEdgesVector({ vertices_coords, edges_vertices }: FOLD): number[][];
export function makeEdgesLength({ vertices_coords, edges_vertices }: FOLD): number[];
export function makeEdgesBoundingBox({ vertices_coords, edges_vertices, edges_coords, }: FOLD, epsilon?: number): Box[];
