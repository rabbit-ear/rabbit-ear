export function splitGraphWithLineAndPoints(graph: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, interiorPoints?: [number, number][], epsilon?: number): GraphLineEvent;
export function splitGraphWithLine(graph: FOLD, line: VecLine2, epsilon?: number): GraphLineEvent;
export function splitGraphWithRay(graph: FOLD, ray: VecLine2, epsilon?: number): GraphLineEvent;
export function splitGraphWithSegment(graph: FOLD, segment: [number, number][], epsilon?: number): GraphLineEvent;
export type GraphLineEvent = {
    vertices?: {
        intersect: number[];
        source: ((FacePointEvent & {
            face: number;
        }) | (FaceEdgeEvent & {
            vertices: number[];
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
