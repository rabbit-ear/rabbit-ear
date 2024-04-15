export function cutFaceToVertex(graph: any, face: any, vertexFace: any, vertexLeaf: any, assignment?: string, foldAngle?: number): {
    edge: number;
    faces: {};
};
export function cutFaceToPoint(graph: any, face: any, vertex: any, point: any, assignment?: string, foldAngle?: number): {
    edge: number;
    faces: {};
};
export function splitFaceWithEdge(graph: FOLD, face: number, vertices: number[], assignment?: string, foldAngle?: number): object;
export function splitFace(graph: FOLD, face: number, vertices: number[], assignment?: string, foldAngle?: number): object;
