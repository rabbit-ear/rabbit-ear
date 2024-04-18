export function splitGraphWithLineAndPoints(graph: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, interiorPoints?: [number, number][], epsilon?: number): SplitGraphEvent;
export function splitGraphWithLine(graph: FOLD, line: VecLine2, epsilon?: number): SplitGraphEvent;
export function splitGraphWithRay(graph: FOLD, ray: VecLine2, epsilon?: number): SplitGraphEvent;
export function splitGraphWithSegment(graph: FOLD, segment: [number, number][], epsilon?: number): SplitGraphEvent;
export type SplitGraphEvent = {
    vertices?: {
        intersect: number[];
        source: ((FacePointEvent & {
            face: number;
            faces: number[];
        }) | (FaceEdgeEvent & {
            vertices: [number, number];
        }))[];
    };
    edges?: {
        intersect: LineLineEvent[];
        new: number[];
        map: (number | number[])[];
        source: {
            face: number;
            faces: number[];
        }[];
    };
    faces?: {
        intersect: {
            vertices: FaceVertexEvent[];
            edges: FaceEdgeEvent[];
            points: FacePointEvent[];
        }[];
        map: (number | number[])[];
    };
};
