export function faceOrdersSubset(faceOrders: [number, number, number][], faces: number[]): [number, number, number][];
export function faceOrdersToDirectedEdges({ vertices_coords, faces_vertices, faceOrders, faces_normal }: FOLDExtended, rootFace?: number): [number, number][];
export function linearizeFaceOrders({ vertices_coords, faces_vertices, faceOrders, faces_normal }: FOLDExtended, rootFace?: number): number[];
export function faceOrdersCycles({ vertices_coords, faces_vertices, faceOrders, faces_normal }: FOLDExtended, rootFace?: number): void;
export function linearize2DFaces({ vertices_coords, faces_vertices, faceOrders, faces_layer, faces_normal, }: FOLDExtended, rootFace?: number): number[];
export function nudgeFacesWithFaceOrders({ vertices_coords, faces_vertices, faceOrders, faces_normal, }: FOLDExtended): object[];
export function nudgeFacesWithFacesLayer({ faces_layer }: FOLDExtended): object[];
export function makeFacesLayer({ vertices_coords, faces_vertices, faceOrders, faces_normal }: FOLDExtended): number[];
export function flipFacesLayer(faces_layer: number[]): number[];
//# sourceMappingURL=orders.d.ts.map