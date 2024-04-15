export function foldGraphWithLineMethod(graph: any, { vector, origin }: {
    vector: any;
    origin: any;
}, lineDomain?: (_: number, __?: number) => boolean, interiorPoints?: any[], vertices_coordsFolded?: any, assignment?: string, foldAngle?: any, epsilon?: number): {
    edges: {
        new: any[];
        map: any;
    };
    faces: {
        map: any;
    };
};
export function foldLine(graph: any, line: any, vertices_coordsFolded?: any, assignment?: string, foldAngle?: any, epsilon?: number): {
    edges: {
        new: any[];
        map: any;
    };
    faces: {
        map: any;
    };
};
export function foldRay(graph: any, ray: any, vertices_coordsFolded?: any, assignment?: string, foldAngle?: any, epsilon?: number): {
    edges: {
        new: any[];
        map: any;
    };
    faces: {
        map: any;
    };
};
export function foldSegment(graph: any, segment: any, vertices_coordsFolded?: any, assignment?: string, foldAngle?: any, epsilon?: number): {
    edges: {
        new: any[];
        map: any;
    };
    faces: {
        map: any;
    };
};
