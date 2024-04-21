export function foldGraph(graph: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, interiorPoints?: [number, number][], assignment?: string, foldAngle?: number, vertices_coordsFolded?: [number, number][] | [number, number, number][], epsilon?: number): FoldGraphEvent;
export function foldLine(graph: FOLD, line: VecLine2, assignment?: string, foldAngle?: number, vertices_coordsFolded?: [number, number][] | [number, number, number][], epsilon?: number): FoldGraphEvent;
export function foldRay(graph: FOLD, ray: VecLine2, assignment?: string, foldAngle?: number, vertices_coordsFolded?: [number, number][] | [number, number, number][], epsilon?: number): FoldGraphEvent;
export function foldSegment(graph: FOLD, segment: [[number, number], [number, number]], assignment?: string, foldAngle?: number, vertices_coordsFolded?: [number, number][] | [number, number, number][], epsilon?: number): FoldGraphEvent;
export type FoldGraphEvent = {
    edges?: {
        new: number[];
        map: (number | number[])[];
        reassigned: number[];
    };
    faces?: {
        new: number[];
        map: (number | number[])[];
    };
};
