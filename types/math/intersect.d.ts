export function intersectLineLine(a: VecLine2, b: VecLine2, aDomain?: Function, bDomain?: Function, epsilon?: number): {
    point: (number[] | undefined);
    a: (number | undefined);
    b: (number | undefined);
};
export function intersectCircleLine(circle: Circle, line: VecLine2, _?: Function, lineDomain?: Function, epsilon?: number): number[][];
