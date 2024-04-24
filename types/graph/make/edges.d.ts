export function makeEdgesCoords({ vertices_coords, edges_vertices }: FOLD): [
    ([number, number] | [number, number, number]),
    ([number, number] | [number, number, number])
][];
export function makeEdgesVector({ vertices_coords, edges_vertices }: FOLD): ([number, number] | [number, number, number])[];
export function makeEdgesLength({ vertices_coords, edges_vertices }: FOLD): number[];
export function makeEdgesBoundingBox({ vertices_coords, edges_vertices, }: FOLD, epsilon?: number): Box[];
//# sourceMappingURL=edges.d.ts.map