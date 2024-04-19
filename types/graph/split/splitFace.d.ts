export function splitFaceWithLeafEdge(graph: FOLD, face: number, vertexFace: number, vertexLeaf: number, assignment?: string, foldAngle?: number): {
    edge: number;
    faces: {};
};
export function splitFaceWithEdge(graph: FOLD, face: number, vertices: [number, number], assignment?: string, foldAngle?: number): {
    edge?: number;
    faces?: {
        map?: (number | number[])[];
        new?: number[];
        remove?: number;
    };
};
export function splitFace(graph: FOLD, face: number, vertices: [number, number], assignment?: string, foldAngle?: number): {
    edge?: number;
    faces?: {
        map?: (number | number[])[];
        new?: number[];
        remove?: number;
    };
};
