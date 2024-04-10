export function faceOrdersSubset(faceOrders: number[][], faces: number[]): number[][];
export function linearizeFaceOrders({ faceOrders, faces_normal }: FOLD, rootFace: any): number[];
export function linearize2DFaces({ vertices_coords, faces_vertices, faceOrders, faces_layer, faces_normal, }: FOLD, rootFace: any): number[];
export function nudgeFacesWithFaceOrders({ vertices_coords, faces_vertices, faceOrders, faces_normal, }: FOLD): object[];
export function nudgeFacesWithFacesLayer({ faces_layer }: FOLD): object[];
export function makeFacesLayer({ vertices_coords, faces_vertices, faceOrders, faces_normal }: object): number[];
export function flipFacesLayer(faces_layer: number[]): number[];
